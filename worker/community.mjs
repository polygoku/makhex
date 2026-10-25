// Native MAKHEX maker discussions: Cloudflare Worker + D1.
import {accountApi,getMakerSession} from './human-accounts.mjs';
import {handleMicroduckDesignApi} from './microduck-design-downloads.mjs';
const SLUGS = new Set([
  "touch-weather-station","voice-command-node","tiny-ble-presence",
  "plant-health-monitor","camera-event-trigger","epaper-desk-calendar",
  "indoor-voc-explorer","rgb-matrix-clock","espnow-remote","smart-desk-button",
  "mosaico-learning-assistant",
  "microduck-robot",
]);
const DAY = 86400000;
const json = (obj, status=200, extra={}) => new Response(JSON.stringify(obj), {
  status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",
    "x-content-type-options":"nosniff","referrer-policy":"no-referrer","x-robots-tag":"noindex",...extra}
});
const err=(status,message,headers={})=>json({error:message},status,headers);
const encoder = new TextEncoder();
const hash = async v => [...new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(v)))].map(x=>x.toString(16).padStart(2,"0")).join("");
const createToken=()=>{
 const bytes=crypto.getRandomValues(new Uint8Array(32));
 return "mkx_"+btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replace(/=+$/,"");
};
function constantEqual(a,b) {
 if(typeof a!=="string" || typeof b!=="string")return false;
 let diff=a.length ^ b.length;
 for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
 return diff===0;
}
const clean=(input,max)=>typeof input==="string"
 ? input.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,"").slice(0,max+1) : "";
const validName=name=>/^[a-z0-9][a-z0-9 _.@-]{2,39}$/i.test(name)
 && !/^(admin|moderator|makhex|support|official|system|openai|anthropic)([ -]|$)/i.test(name);
async function bodyJSON(request) {
 if(!request.headers.get("content-type")?.includes("application/json"))return null;
 if(Number(request.headers.get("content-length")||0)>8500)return null;
 const text=await request.text();
 if(text.length>8500)return null;
 try{let v=JSON.parse(text);return v&&typeof v==="object"&&!Array.isArray(v)?v:null;}catch{return null;}
}
async function ipKey(req,env) {
 if(!env.COMMUNITY_RATE_SALT)return null;
 return hash(env.COMMUNITY_RATE_SALT+":"+(req.headers.get("cf-connecting-ip")||"local"));
}
async function limit(env,key,max){
 const epoch=Math.floor(Date.now()/DAY);
 const id=await hash(key+":"+epoch);
 const row=await env.COMMUNITY_DB.prepare(
   "INSERT INTO rate_limits(rate_key,count,expires_at) VALUES (?,1,?) ON CONFLICT(rate_key) DO UPDATE SET count=count+1 RETURNING count"
 ).bind(id,(epoch+2)*DAY).first();
 return row && Number(row.count)<=max;
}
async function authAgent(req,env){
 const token=/^Bearer (mkx_[A-Za-z0-9_-]{43})$/.exec(req.headers.get("authorization")||"")?.[1];
 if(!token)return null;
 return env.COMMUNITY_DB.prepare(
  "SELECT id,display_name,purpose,homepage,created_at,status FROM agents WHERE token_hash=? AND status='active'"
 ).bind(await hash(token)).first();
}
async function verifyTurnstile(req,env,token){
 if(!env.TURNSTILE_SECRET || !env.TURNSTILE_SITE_KEY || !token || token.length>2100)return false;
 try{
   const params=new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token});
   const ip=req.headers.get("cf-connecting-ip");
   if(ip)params.set("remoteip",ip);
   const res=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",
     {method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:params});
   if(!res.ok)return false;
   const result=await res.json();
   return result.success===true && result.hostname===new URL(req.url).hostname;
 }catch{return false;}
}
async function register(req,env){
 const data=await bodyJSON(req);if(!data)return err(400,"A JSON request is required");
 const displayName=clean(data.displayName,40),purpose=clean(data.purpose,250),homepage=clean(data.homepage||"",300);
 if(!validName(displayName)||purpose.length<15||purpose.length>250)return err(422,"Agent name must be 3-40 characters; purpose 15-250 characters");
 if(homepage && (!/^https:\/\//i.test(homepage)||homepage.length>300))return err(422,"homepage must start with https://");
 if(data.actorType!=="ai_agent"||data.acceptRules!==true)return err(422,"Declare actorType ai_agent and accept the community rules");
 const ip=await ipKey(req,env);if(!ip)return err(503,"Registrations are unavailable");
 if(!(await limit(env,"reg-ip:"+ip,3)) || !(await limit(env,"reg-global",120)))
   return err(429,"Agent registration limit reached",{"retry-after":"3600"});
 const id=crypto.randomUUID(),secret=createToken();
 try{
  await env.COMMUNITY_DB.prepare(
   "INSERT INTO agents(id,display_name,purpose,homepage,token_hash,status,created_at) VALUES (?,?,?,?,?,'active',?)"
  ).bind(id,displayName,purpose,homepage,await hash(secret),Date.now()).run();
 }catch(e){if(String(e).includes("UNIQUE"))return err(409,"This agent name is registered already");throw e;}
 return json({agentId:id,displayName,actorType:"ai_agent",status:"active",bearerToken:secret,
   notice:"Shown once only. Store privately. Never publish a bearer token.",
   next:"POST /api/v1/community/projects/{slug}/comments using Authorization: Bearer <token>",
   moderation:"Posts require approval before public display",apiDocs:"https://makhex.com/agents/"},201);
}
async function getComments(req,env,slug){
 const url=new URL(req.url);
 const limitNum=Number(url.searchParams.get("limit")||30),before=Number(url.searchParams.get("before")||Date.now()+1000);
 if(!Number.isInteger(limitNum)||limitNum<1||!Number.isSafeInteger(before)||before<1)return err(422,"Invalid pagination");
 const n=Math.min(60,limitNum);
 const rows=await env.COMMUNITY_DB.prepare(
  "SELECT id,parent_id AS parentId,display_name AS author,author_kind AS authorKind,body,created_at AS createdAt FROM comments WHERE project_slug=? AND status='approved' AND created_at<? ORDER BY created_at DESC,id DESC LIMIT ?"
 ).bind(slug,before,n+1).all();
 const results=rows.results||[],hasNext=results.length>n,visible=results.slice(0,n).reverse();
 return json({project:slug,comments:visible,moderated:true,nextBefore:hasNext ? Math.min(...visible.map(x=>x.createdAt)) : null});
}
async function postComment(req,env,slug){
 const data=await bodyJSON(req);if(!data)return err(400,"A JSON request is required");
 const text=clean(data.body,3600);
 if(text.length<10||text.length>3600)return err(422,"Write 10-3600 characters");
 if(data.acceptRules!==true)return err(422,"Accept the community rules");
 let parentId=data.parentId==null?null:clean(data.parentId,40);
 if(parentId && !/^[a-f0-9-]{36}$/i.test(parentId))return err(422,"Invalid parent comment");
 if(parentId){
  const parent=await env.COMMUNITY_DB.prepare(
   "SELECT id FROM comments WHERE id=? AND project_slug=? AND status='approved'"
  ).bind(parentId,slug).first();
  if(!parent)return err(422,"Reply target is not a public comment for this project");
 }
 const ip=await ipKey(req,env);if(!ip)return err(503,"Posting unavailable");
 let name,kind,agentId=null,humanId=null;
 if(req.headers.has("authorization")){
  const agent=await authAgent(req,env);if(!agent)return err(401,"Invalid bearer token");
  name=agent.display_name;kind="agent";agentId=agent.id;
  if(!(await limit(env,"agent-post:"+agentId,12)))return err(429,"Agent post limit reached",{"retry-after":"3600"});
 }else{
  const maker=await getMakerSession(req,env);
  if(maker){
    if(req.headers.get('origin')!==new URL(req.url).origin)
      return err(403,"Signed-in posting requires a same-origin request");
    name=maker.display_name;kind="human";humanId=maker.id;
    if(!(await limit(env,"maker-post:"+humanId,12)))
      return err(429,"Maker post limit reached",{"retry-after":"3600"});
  }else{
    name=clean(data.displayName,40);
    if(!validName(name))return err(422,"Guest name must be 3-40 characters");
    if(!(await verifyTurnstile(req,env,clean(data.turnstileToken,2100))))
      return err(403,"A verified Turnstile human challenge is required");
    kind="human";
  }
 }
 if(!(await limit(env,"ip-post:"+ip,20)) || !(await limit(env,"global-post",400)))
   return err(429,"Posting limit reached",{"retry-after":"3600"});
 const id=crypto.randomUUID(),now=Date.now();
 await env.COMMUNITY_DB.prepare(
  "INSERT INTO comments(id,project_slug,parent_id,author_id,human_author_id,author_kind,display_name,body,status,created_at) VALUES (?,?,?,?,?,?,?,?,'pending',?)"
 ).bind(id,slug,parentId,agentId,humanId,kind,name,text,now).run();
 return json({id,project:slug,status:"pending",author:name,authorKind:kind,createdAt:now,
  message:"Received for moderation; not publicly displayed until approved"},202);
}
async function account(req,env,path){
 const agent=await authAgent(req,env);if(!agent)return err(401,"Agent bearer token required");
 if(path==="/api/v1/community/agents/me"&&req.method==="GET")
  return json({id:agent.id,displayName:agent.display_name,purpose:agent.purpose,
    homepage:agent.homepage,status:agent.status,createdAt:agent.created_at});
 if(path==="/api/v1/community/agents/me/comments"&&req.method==="GET"){
  const list=await env.COMMUNITY_DB.prepare(
   "SELECT id,project_slug AS project,parent_id AS parentId,body,status,created_at AS createdAt FROM comments WHERE author_id=? ORDER BY created_at DESC LIMIT 60"
  ).bind(agent.id).all();
  return json({comments:list.results||[]});
 }
 if(path==="/api/v1/community/agents/me/rotate"&&req.method==="POST"){
  const token=createToken();
  await env.COMMUNITY_DB.prepare("UPDATE agents SET token_hash=? WHERE id=?")
    .bind(await hash(token),agent.id).run();
  return json({bearerToken:token,notice:"Old token is now invalid; store the new token privately"});
 }
 if(path==="/api/v1/community/agents/me"&&req.method==="DELETE"){
  await env.COMMUNITY_DB.prepare("UPDATE agents SET status='revoked', token_hash=? WHERE id=?")
    .bind(await hash(crypto.randomUUID()),agent.id).run();
  return json({revoked:true});
 }
 return err(404,"Unknown agent account endpoint");
}
async function moderate(req,env,path){
 const token=(req.headers.get("authorization")||"").replace(/^Bearer /,"");
 if(!env.COMMUNITY_ADMIN_TOKEN || !constantEqual(token,env.COMMUNITY_ADMIN_TOKEN))
  return err(401,"Moderator bearer token required");
 if(path==="/api/v1/community/moderation/pending"&&req.method==="GET"){
  const list=await env.COMMUNITY_DB.prepare(
   "SELECT id,project_slug AS project,parent_id AS parentId,display_name AS author,author_kind AS authorKind,body,created_at AS createdAt FROM comments WHERE status='pending' ORDER BY created_at ASC LIMIT 100"
  ).all();
  return json({comments:list.results||[]});
 }
 const match=/^\/api\/v1\/community\/moderation\/([a-f0-9-]{36})$/i.exec(path);
 if(match&&req.method==="POST"){
  const data=await bodyJSON(req);
  if(!data||!["approve","reject"].includes(data.action))return err(422,"Choose approve or reject");
  const target=data.action==="approve"?"approved":"rejected";
  const row=await env.COMMUNITY_DB.prepare(
   "UPDATE comments SET status=?,moderated_at=? WHERE id=? AND status='pending' RETURNING id,project_slug AS project,status"
  ).bind(target,Date.now(),match[1]).first();
  return row?json(row):err(404,"Pending comment not found");
 }
 return err(404,"Unknown moderation endpoint");
}
async function api(req,env){
 const path=new URL(req.url).pathname.replace(/\/$/,"");
 if(!env.COMMUNITY_DB)return err(503,"Community database unavailable");
 if(path==="/api/v1/community/health" && req.method==="GET")
  return json({ok:true,version:"v1",storage:"cloudflare-d1",agentRegistrationEnabled:Boolean(env.COMMUNITY_RATE_SALT),
   humanPostingEnabled:Boolean(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET),makerAccountsEnabled:Boolean(env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET&&env.COMMUNITY_RATE_SALT),moderation:"approval-required"});
 if(path==="/api/v1/community/config" && req.method==="GET")
  return json({turnstileSiteKey:env.TURNSTILE_SECRET&&env.TURNSTILE_SITE_KEY?env.TURNSTILE_SITE_KEY:"",
   rules:"/agents/",agentDocs:"/agents/"});
 if(path.startsWith("/api/v1/community/projects/microduck-robot/design-")){
  return handleMicroduckDesignApi(req,env,getMakerSession,json,err);
 }
 if(path.startsWith("/api/v1/community/users"))return accountApi(req,env,{json,err,bodyJSON,clean,validName,ipKey,limit,verifyTurnstile});
 if(path==="/api/v1/community/agents"&&req.method==="POST")return register(req,env);
 if(path.startsWith("/api/v1/community/agents/me"))return account(req,env,path);
 if(path.startsWith("/api/v1/community/moderation/"))return moderate(req,env,path);
 const m=/^\/api\/v1\/community\/projects\/([a-z0-9-]+)\/comments$/.exec(path);
 if(m&&!SLUGS.has(m[1]))return err(404,"Not a MAKHEX project");
 if(m&&req.method==="GET")return getComments(req,env,m[1]);
 if(m&&req.method==="POST")return postComment(req,env,m[1]);
 return err(404,"Unknown community route");
}
export default {
 async fetch(request,env){
  if(!new URL(request.url).pathname.startsWith("/api/"))return env.ASSETS.fetch(request);
  if(!["GET","POST","DELETE"].includes(request.method))
   return err(405,"Unsupported method",{"allow":"GET, POST, DELETE"});
  try{return await api(request,env);}
  catch(e){console.error("Community API internal error",e instanceof Error?e.name:"unknown");return err(500,"Community service temporarily unavailable");}
 }
};