// Anonymous per-day project funnel counters. No cookies, IPs, visitor IDs, emails or order IDs stored.
const EVENTS=new Set(['project_view','demo_play','assembly_interact','add_to_cart','checkout_start','order_request_created','paid_checkout_verified']);
const PROJECTS=new Set([
 'touch-weather-station','voice-command-node','tiny-ble-presence','plant-health-monitor',
 'camera-event-trigger','epaper-desk-calendar','indoor-voc-explorer','rgb-matrix-clock',
 'espnow-remote','smart-desk-button','mosaico-learning-assistant',
 'microduck-robot','atomdog-quadruped-robot','mixed'
]);
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{
 'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'
}});
const clean=v=>typeof v==='string'&&v.length<70&&/^[a-z0-9_-]+$/.test(v)?v:'';
const compare=(a,b)=>{
 if(typeof a!=='string'||typeof b!=='string')return false;
 let difference=a.length^b.length;
 for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
 return difference===0;
};
export const allowedEvent=(event,project)=>EVENTS.has(event)&&PROJECTS.has(project);
export async function recordProjectEvent(env,event,project){
 if(!env.COMMUNITY_DB||!allowedEvent(event,project))return false;
 const day=new Date().toISOString().slice(0,10);
 await env.COMMUNITY_DB.prepare(
  'INSERT INTO makhex_project_funnel_daily(day,project,event,count) VALUES(?,?,?,1) ON CONFLICT(day,project,event) DO UPDATE SET count=count+1'
 ).bind(day,project,event).run();
 return true;
}
export async function metricsApi(request,env,h={}){
 const path=new URL(request.url).pathname.replace(/\/$/,'');
 if(!env.COMMUNITY_DB)return json({error:'Metrics storage unavailable'},503);
 if(path==='/api/v1/metrics/events'&&request.method==='POST'){
  const origin=new URL(request.url).origin;
  if(new URL(request.url).protocol!=='https:'||request.headers.get('origin')!==origin)return json({error:'Secure same-origin requests only'},403);
  if(Number(request.headers.get('content-length')||0)>1000)return json({error:'Invalid event'},422);
  const text=await request.text();if(text.length>1000)return json({error:'Invalid event'},422);
  let body;try{body=JSON.parse(text)}catch{return json({error:'Invalid JSON'},422)}
  const event=clean(body?.event),project=clean(body?.project);
  if(!allowedEvent(event,project)||['order_request_created','paid_checkout_verified'].includes(event))return json({error:'Unsupported event'},422);
  const ip=await h.ipKey?.(request,env);
  if(!ip)return json({error:'Metrics rate limiting unavailable'},503);
  if(!await h.limit(env,'metrics-client:'+ip,90)||!await h.limit(env,'metrics-global',10000))return json({error:'Rate limit'},429);
  try{await recordProjectEvent(env,event,project)}catch{return json({error:'Metrics not initialized'},503)}
  return json({ok:true},202);
 }
 if(path==='/api/v1/metrics/report'&&request.method==='GET'){
  const token=env.MAKHEX_ORDER_ADMIN_TOKEN||env.COMMUNITY_ADMIN_TOKEN;
  if(!token)return json({error:'Owner metrics access is not configured'},503);
  const supplied=(request.headers.get('authorization')||'').replace(/^Bearer /,'');
  if(!compare(supplied,token))return json({error:'Owner credentials required'},401);
  const daysText=new URL(request.url).searchParams.get('days')||'30';
  const days=Number(daysText);
  if(!Number.isInteger(days)||days<1||days>90)return json({error:'Choose 1-90 days'},422);
  const start=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
  try{
   const result=await env.COMMUNITY_DB.prepare(
    'SELECT day,project,event,count FROM makhex_project_funnel_daily WHERE day>=? ORDER BY day DESC,project,event'
   ).bind(start).all();
   return json({days,start,rows:result.results??[],notes:'Anonymous aggregated interactions, not unique users or confirmed sales.'});
  }catch{return json({error:'Metrics migration must be applied'},503)}
 }
 return json({error:'Metrics endpoint not found'},404);
}
