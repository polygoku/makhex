import test from 'node:test';
import assert from 'node:assert/strict';
import { accountApi, getMakerSession } from '../worker/human-accounts.mjs';
const origin='https://makhex.com';
function fixture(){
  const people=new Map(),sessions=new Map();
  const db={
    prepare(sql){
      let args=[];
      const q={bind(...a){args=a;return q;},
        async first(){
          if(sql.includes('FROM maker_sessions s JOIN maker_accounts')){
            const session=sessions.get(args[0]);
            const p=session&&people.get(session.account_id);
            return session?.expires_at>args[1]&&p?.status==='active'?{id:p.id,display_name:p.display_name,created_at:p.created_at}:null;
          }
          if(sql.includes('FROM maker_accounts WHERE recovery_hash=')){
            const p=[...people.values()].find(p=>p.recovery_hash===args[0]&&p.status==='active');
            return p?{id:p.id,display_name:p.display_name}:null;
          }
          return null;
        },
        async all(){return{results:[]};},
        async run(){
          if(sql.startsWith('INSERT INTO maker_accounts')){
            if([...people.values()].some(p=>p.display_name.toLowerCase()===args[1].toLowerCase()))throw Error('UNIQUE');
            people.set(args[0],{id:args[0],display_name:args[1],recovery_hash:args[2],status:'active',created_at:args[3]});
          }else if(sql.startsWith('INSERT INTO maker_sessions')){
            sessions.set(args[0],{session_hash:args[0],account_id:args[1],expires_at:args[3]});
          }else if(sql.startsWith('DELETE FROM maker_sessions WHERE session_hash=')){
            sessions.delete(args[0]);
          }else if(sql.startsWith('DELETE FROM maker_sessions WHERE account_id=')){
            for(const [key,s] of sessions)if(s.account_id===args[0])sessions.delete(key);
          }else if(sql.startsWith('UPDATE maker_accounts SET recovery_hash=')){
            people.get(args[1]).recovery_hash=args[0];
          }else if(sql.startsWith("UPDATE maker_accounts SET status='revoked'")){
            const p=people.get(args[1]);p.status='revoked';p.recovery_hash=args[0];
          }else throw Error('Unexpected SQL: '+sql);
          return{success:true};
        }
      };
      return q;
    },
    async batch(actions){for(const a of actions)await a.run();return[{success:true}];}
  };
  const h={
    json:(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json',...extra}}),
    err:(status,message,headers={})=>new Response(JSON.stringify({error:message}),{status,headers:{'content-type':'application/json',...headers}}),
    bodyJSON:async request=>request.json(),
    clean:(s,max)=>typeof s==='string'?s.trim().slice(0,max+1):'',
    validName:s=>/^[A-Za-z][A-Za-z0-9 _.@-]{2,39}$/.test(s),
    ipKey:async()=> 'test-ip-hash',
    limit:async()=>true,
    verifyTurnstile:async()=>true
  };
  const env={COMMUNITY_DB:db,COMMUNITY_RATE_SALT:'for-tests-only',TURNSTILE_SECRET:'test',TURNSTILE_SITE_KEY:'test'};
  const request=(path,method='GET',body,cookie,requestOrigin=origin)=>{
    const headers={'accept':'application/json', ...(body===undefined?{}:{'content-type':'application/json'}),
      ...(cookie?{'cookie':cookie}:{}),...(method==='GET'?{}:{'origin':requestOrigin})};
    return new Request(origin+'/api/v1/community/users'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  };
  const call=(path,method,body,cookie,requestOrigin)=>accountApi(request(path,method,body,cookie,requestOrigin),env,h);
  return{people,sessions,env,h,request,call};
}
test('human signup requires exact site Origin and verified flow',async()=>{
  const f=fixture();
  let res=await f.call('','POST',{displayName:'SolderHuman',actorType:'human',acceptRules:true,turnstileToken:'fake'},undefined,'https://evil.com');
  assert.equal(res.status,403);
  assert.equal(f.people.size,0);
  res=await f.call('','POST',{displayName:'SolderHuman',actorType:'human',acceptRules:true,turnstileToken:'test-token'});
  assert.equal(res.status,201);
  const body=await res.json();
  assert.match(body.recoveryKey,/^mkxh_[A-Za-z0-9_-]{43}$/);
  assert.match(res.headers.get('set-cookie'),/__Host-mkx_session=mkxs_/);
  assert.match(res.headers.get('set-cookie'),/Secure; HttpOnly; SameSite=Lax/);
  assert.equal(f.people.size,1);
  assert.equal(f.sessions.size,1);
  assert.equal([...f.people.values()][0].recovery_hash.length,64);
  assert.equal(JSON.stringify([...f.people.values()]).includes(body.recoveryKey),false);
});
test('accounts have server-side authenticated sessions and recovery-key login',async()=>{
  const f=fixture();
  const create=await f.call('','POST',{displayName:'BenchMaker',actorType:'human',acceptRules:true,turnstileToken:'test'});
  const data=await create.json();
  const sessionCookie=create.headers.get('set-cookie').split(';')[0];
  let me=await f.call('/me','GET',undefined,sessionCookie);
  assert.equal(me.status,200);
  assert.equal((await me.json()).displayName,'BenchMaker');
  let logout=await f.call('/logout','POST',{},sessionCookie);
  assert.equal(logout.status,200);
  assert.equal((await f.call('/me','GET',undefined,sessionCookie)).status,401);
  const signIn=await f.call('/login','POST',{recoveryKey:data.recoveryKey,turnstileToken:'test'});
  assert.equal(signIn.status,200);
  const newCookie=signIn.headers.get('set-cookie').split(';')[0];
  assert.equal((await f.call('/me','GET',undefined,newCookie)).status,200);
  assert.equal((await f.call('/me','GET',undefined,'__Host-mkx_session=mkxs_invalid')).status,401);
  const duplicate=await f.call('','POST',{displayName:'BenchMaker',actorType:'human',acceptRules:true,turnstileToken:'test'});
  assert.equal(duplicate.status,409);
});
test('recovery rotation invalidates the previous token and account revoke drops sessions',async()=>{
  const f=fixture();
  const created=await f.call('','POST',{displayName:'MakerDevice',actorType:'human',acceptRules:true,turnstileToken:'test'});
  const initial=await created.json();
  const cookie=created.headers.get('set-cookie').split(';')[0];
  const rotated=await f.call('/me/rotate','POST',{turnstileToken:'test'},cookie);
  assert.equal(rotated.status,200);
  const next=(await rotated.json()).recoveryKey;
  assert.notEqual(next,initial.recoveryKey);
  assert.equal((await f.call('/login','POST',{recoveryKey:initial.recoveryKey,turnstileToken:'test'})).status,401);
  assert.equal((await f.call('/login','POST',{recoveryKey:next,turnstileToken:'test'})).status,200);
  assert.equal((await f.call('/me','DELETE',undefined,cookie)).status,200);
  assert.equal(f.sessions.size,0);
  assert.equal((await f.call('/login','POST',{recoveryKey:next,turnstileToken:'test'})).status,401);
});
test('session lookup requires existing nonexpired record',async()=>{
  const f=fixture();
  const bogus=f.request('/me','GET',undefined,'__Host-mkx_session=mkxs_'+('Z'.repeat(43)));
  assert.equal(await getMakerSession(bogus,f.env),null);
});