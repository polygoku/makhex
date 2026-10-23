// Pseudonymous MAKHEX human-community identity; not Squarespace customer/payment auth.
// 256-bit recovery key shown once; only a SHA-256 digest is stored.
// Session cookie is HttpOnly/Secure/SameSite=Lax. No passwords, email or PII required.
const DAY=86400000;
const SESSION_MS=30*DAY;
const encoder=new TextEncoder();
const hashed=async v=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const token=(prefix)=>{
  const bytes=crypto.getRandomValues(new Uint8Array(32));
  return prefix+btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
};
const cookieName='__Host-mkx_session';
const cookie=(secret,maxAge)=>cookieName+'='+secret+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age='+maxAge;
function sameOrigin(req) {
  const origin=req.headers.get('Origin');
  const url=new URL(req.url);
  return Boolean(origin && origin===url.origin && url.protocol==='https:');
}
function readSession(req) {
  const match=/(?:^|;\s*)__Host-mkx_session=(mkxs_[A-Za-z0-9_-]{43})(?:;|$)/.exec(req.headers.get('cookie')||'');
  return match?.[1]||null;
}
export async function getMakerSession(req,env) {
  if(!env?.COMMUNITY_DB)return null;
  const secret=readSession(req);
  if(!secret)return null;
  return await env.COMMUNITY_DB.prepare(
    "SELECT a.id,a.display_name,a.created_at FROM maker_sessions s JOIN maker_accounts a ON a.id=s.account_id WHERE s.session_hash=? AND s.expires_at>? AND a.status='active'"
  ).bind(await hashed(secret),Date.now()).first();
}
export async function accountApi(req,env,h) {
  const {json,err,bodyJSON,clean,validName,ipKey,limit,verifyTurnstile}=h;
  const path=new URL(req.url).pathname.replace(/\/$/,'');
  if(!env.COMMUNITY_DB)return err(503,'Account database is unavailable');
  if(path==='/api/v1/community/users/status'&&req.method==='GET'){
    return json({makerAccountsEnabled:Boolean(env.TURNSTILE_SECRET&&env.TURNSTILE_SITE_KEY&&env.COMMUNITY_RATE_SALT),type:'pseudonymous-human',buyerAccounts:'Squarespace handles separate checkout accounts'});
  }
  if(path==='/api/v1/community/users/me'&&req.method==='GET'){
    const a=await getMakerSession(req,env);
    return a?json({id:a.id,displayName:a.display_name,actorType:'human',joinedAt:a.created_at}):err(401,'Sign in to your maker account');
  }
  if(path==='/api/v1/community/users/me/comments'&&req.method==='GET'){
    const a=await getMakerSession(req,env);
    if(!a)return err(401,'Sign in to your maker account');
    const rows=await env.COMMUNITY_DB.prepare(
      'SELECT id,project_slug AS project,parent_id AS parentId,body,status,created_at AS createdAt FROM comments WHERE human_author_id=? ORDER BY created_at DESC LIMIT 60'
    ).bind(a.id).all();
    return json({comments:rows.results||[]});
  }
  if(!['POST','DELETE'].includes(req.method))return err(405,'Unsupported account action');
  if(!sameOrigin(req))return err(403,'Account changes require a same-origin secure browser request');
  const data=req.method==='POST'?await bodyJSON(req):null;
  const ip=await ipKey(req,env);
  if(!ip)return err(503,'Registration and login protection is unavailable');
  if(!(await limit(env,'maker-account-ip:'+ip,30)))return err(429,'Account request limit reached',{'retry-after':'3600'});
  if(path==='/api/v1/community/users'&&req.method==='POST'){
    if(!data||data.actorType!=='human'||data.acceptRules!==true)return err(422,'Declare human account and accept the community rules');
    const name=clean(data.displayName,40);
    if(!validName(name))return err(422,'Choose a maker name between 3 and 40 allowed characters');
    if(!(await limit(env,'maker-signup-ip:'+ip,3))||!(await limit(env,'maker-signup-global',130)))
      return err(429,'Registration limit reached',{'retry-after':'3600'});
    if(!(await verifyTurnstile(req,env,clean(data.turnstileToken,2100))))return err(403,'Complete the anti-spam verification');
    const id=crypto.randomUUID(), recovery=token('mkxh_'),session=token('mkxs_'),now=Date.now();
    try {
      await env.COMMUNITY_DB.batch([
        env.COMMUNITY_DB.prepare("INSERT INTO maker_accounts(id,display_name,recovery_hash,status,created_at) VALUES (?,?,?,'active',?)")
          .bind(id,name,await hashed(recovery),now),
        env.COMMUNITY_DB.prepare('INSERT INTO maker_sessions(session_hash,account_id,created_at,expires_at) VALUES (?,?,?,?)')
          .bind(await hashed(session),id,now,now+SESSION_MS)
      ]);
    }catch(e) {
      if(String(e).includes('UNIQUE'))return err(409,'Maker name is already registered');
      throw e;
    }
    return json({id,displayName:name,actorType:'human',recoveryKey:recovery,
      notice:'Save this recovery key in a password manager now. It is never shown again. No email/password recovery exists.',
      status:'active',buyerAccount:'Separate Squarespace account for purchases'},201,{'set-cookie':cookie(session,SESSION_MS/1000)});
  }
  if(path==='/api/v1/community/users/login'&&req.method==='POST'){
    if(!data||!/^mkxh_[A-Za-z0-9_-]{43}$/.test(data.recoveryKey||''))return err(401,'Invalid recovery key');
    if(!(await limit(env,'maker-login-ip:'+ip,12)))return err(429,'Too many login attempts',{'retry-after':'3600'});
    if(!(await verifyTurnstile(req,env,clean(data.turnstileToken,2100))))return err(403,'Complete the anti-spam verification');
    const a=await env.COMMUNITY_DB.prepare("SELECT id,display_name FROM maker_accounts WHERE recovery_hash=? AND status='active'")
      .bind(await hashed(data.recoveryKey)).first();
    if(!a)return err(401,'Invalid recovery key');
    const session=token('mkxs_'),now=Date.now();
    await env.COMMUNITY_DB.prepare('INSERT INTO maker_sessions(session_hash,account_id,created_at,expires_at) VALUES (?,?,?,?)')
      .bind(await hashed(session),a.id,now,now+SESSION_MS).run();
    return json({id:a.id,displayName:a.display_name,actorType:'human',status:'active'},200,{'set-cookie':cookie(session,SESSION_MS/1000)});
  }
  if(path==='/api/v1/community/users/logout'&&req.method==='POST'){
    const session=readSession(req);
    if(session)await env.COMMUNITY_DB.prepare('DELETE FROM maker_sessions WHERE session_hash=?')
      .bind(await hashed(session)).run();
    return json({signedOut:true},200,{'set-cookie':cookie('',0)});
  }
  if(path==='/api/v1/community/users/me/rotate'&&req.method==='POST'){
    const a=await getMakerSession(req,env);
    if(!a)return err(401,'Sign in to your maker account');
    if(!(await verifyTurnstile(req,env,clean(data?.turnstileToken,2100))))return err(403,'Complete the anti-spam verification');
    const recovery=token('mkxh_');
    await env.COMMUNITY_DB.prepare("UPDATE maker_accounts SET recovery_hash=? WHERE id=? AND status='active'")
      .bind(await hashed(recovery),a.id).run();
    return json({recoveryKey:recovery,notice:'Old recovery key is invalid. Save this one; it is shown once.'});
  }
  if(path==='/api/v1/community/users/me'&&req.method==='DELETE'){
    const a=await getMakerSession(req,env);
    if(!a)return err(401,'Sign in to your maker account');
    await env.COMMUNITY_DB.batch([
      env.COMMUNITY_DB.prepare('DELETE FROM maker_sessions WHERE account_id=?').bind(a.id),
      env.COMMUNITY_DB.prepare("UPDATE maker_accounts SET status='revoked',recovery_hash=? WHERE id=?")
        .bind(await hashed(crypto.randomUUID()),a.id)
    ]);
    return json({revoked:true},200,{'set-cookie':cookie('',0)});
  }
  return err(404,'Unknown maker account endpoint');
}