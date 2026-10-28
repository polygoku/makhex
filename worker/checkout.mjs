// First-party MAKHEX order-intent / owner-exception queue.
// No card processing, no supplier order and no automatic paid flag in this service.
import {checkoutCatalog} from './checkout-catalog.mjs';

const DAY=86400000;
const US_STATES=new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' '));
const textEncoder=new TextEncoder();
const hash=async x=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',textEncoder.encode(x)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const newToken=()=> 'mkxo_'+btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const safeText=(v,n)=>typeof v==='string'?v.trim().replace(/[\u0000-\u001f\u007f]/g,'').slice(0,n+1):'';
const constantCompare=(a,b)=>{
  if(typeof a!=='string'||typeof b!=='string')return false;
  let bits=a.length^b.length;
  for(let i=0;i<Math.max(a.length,b.length);i++)bits|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return bits===0;
};
function validateLines(lines){
 if(!Array.isArray(lines)||lines.length<1||lines.length>60)return null;
 const seen=new Set(),out=[];
 let totalParts=0,subtotal=0,missingPrices=false;
 for(const item of lines){
  if(!item||typeof item!=='object'||Array.isArray(item))return null;
  const slug=safeText(item.slug,64),project=safeText(item.project??'',64),option=safeText(item.option??'',160);
  const qty=item.quantity;
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||!Number.isInteger(qty)||qty<1||qty>99)return null;
  const part=checkoutCatalog.parts[slug]??checkoutCatalog.researchSubcomponents[slug];
  if(!part||part.shopEligible!==true)return null; // External supplier parts never enter MAKHEX orders.
  if(project){
   const allowed=checkoutCatalog.projectParts[project];
   if(!allowed || (!allowed.includes(slug)&&!(project==='mosaico-learning-assistant'&&slug in checkoutCatalog.researchSubcomponents)))return null;
  }
  if(option.length===0)return null;
  const isDuckSpeaker=slug==='speaker-4ohm-3w'&&project==='microduck-robot';
  if(isDuckSpeaker && option!=='Option pending')return null;
  if(!isDuckSpeaker&&part.variants.length && option!=='Option pending'&&!part.variants.includes(option))return null;
  if(!part.variants.length&&option!=='Option pending')return null;
  const id=slug+'|'+project+'|'+option;
  if(seen.has(id))return null;
  seen.add(id);totalParts+=qty;
  const ix=part.variants.indexOf(option);
  const cents=isDuckSpeaker||ix<0?null:part.plannedRetailCents[ix]??null;
  if(cents===null)missingPrices=true;
  else subtotal+=cents*qty;
  out.push({slug,title:part.title,quantity:qty,option,project:project||null,planningUnitCents:cents,
    requiresExceptionReview:!part.sellerCheckoutVerified});
 }
 if(totalParts>1200||!Number.isSafeInteger(subtotal))return null;
 return {lines:out,planningSubtotalCents:missingPrices?null:subtotal,totalParts};
}
const response=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{
 'content-type':'application/json; charset=utf-8','cache-control':'no-store',
 'x-content-type-options':'nosniff','x-robots-tag':'noindex','referrer-policy':'no-referrer'
}});
const fail=(status,message)=>response({error:message},status);
function sameOrigin(req){
 const url=new URL(req.url);
 return url.protocol==='https:'&&req.headers.get('Origin')===url.origin;
}
async function jsonBody(req){
 if(!req.headers.get('content-type')?.includes('application/json'))return null;
 if(Number(req.headers.get('content-length')||0)>16000)return null;
 const text=await req.text();
 if(text.length>16000)return null;
 try{const o=JSON.parse(text);return o&&typeof o==='object'&&!Array.isArray(o)?o:null}catch{return null}
}
const money=cents=>Math.round(cents)/100;
function safePayLink(urlText){
 try{
  const u=new URL(urlText);
  if(u.protocol!=='https:'||u.username||u.password||u.hash||u.port&&u.port!=='443')return false;
  if(!(u.hostname==='shop.makhex.com'||u.hostname==='squarespace.com'||u.hostname.endsWith('.squarespace.com')))return false;
  return u.pathname.length>1&&u.href.length<1000;
 }catch{return false}
}
function customerView(row){
 return {
  orderId:row.id,status:row.status,items:JSON.parse(row.lines_json).map(p=>({slug:p.slug,title:p.title,quantity:p.quantity,option:p.option})),
  approvedAmountUsd:row.approved_total_cents==null?null:money(row.approved_total_cents),
  paymentUrl:row.status==='PAYMENT_LINK_READY'?row.payment_url:null,
  tracking:row.status==='FULFILLED'?row.tracking_reference:null,
  updatedAt:row.updated_at,
  notice:row.status==='PENDING_REVIEW'?'MAKHEX is reviewing supplier options and exceptions. No payment has been collected.':
    row.status==='APPROVED_NEEDS_PAYMENT_LINK'?'Your price was approved; the MAKHEX payment link is being prepared. No payment has been collected.':
    row.status==='PAYMENT_LINK_READY'?'Use the approved Squarespace-hosted MAKHEX payment link. Your order is not yet marked paid.':
    row.status==='PAID_VERIFIED'?'Owner verified payment against Squarespace merchant records. Fulfillment remains pending.':
    row.status==='FULFILLED'?'Shipment tracking was recorded by MAKHEX.':'MAKHEX will update the request after review.'
 };
}

export async function checkoutApi(req,env,h={}){
 const path=new URL(req.url).pathname.replace(/\/$/,'');
 if(!env.COMMUNITY_DB)return fail(503,'MAKHEX checkout database is unavailable');
 if(req.method==='OPTIONS')return fail(405,'Unsupported method');
 if(path==='/api/v1/checkout/requests'&&req.method==='POST'){
  if(!sameOrigin(req))return fail(403,'Checkout submission requires a secure same-origin browser session');
  const body=await jsonBody(req);
  if(!body||body.acceptTerms!==true)return fail(422,'Accept the order-request terms');
  const email=safeText(body.email,254).toLowerCase(),zip=safeText(body.shippingZip,10),state=safeText(body.shippingState,2).toUpperCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return fail(422,'Enter a valid customer email');
  if(!/^\d{5}$/.test(zip)||!US_STATES.has(state))return fail(422,'Enter a valid U.S. state and five-digit ZIP for sourcing');
  const validated=validateLines(body.lines);
  if(!validated)return fail(422,'Cart contains an unknown product, invalid option or invalid quantity');
  if(!h.verifyTurnstile||!(await h.verifyTurnstile(req,env,safeText(body.turnstileToken,2100))))
    return fail(403,'Complete the human verification challenge before submitting');
  const ip=await h.ipKey?.(req,env);
  if(!ip)return fail(503,'Rate limit protection unavailable');
  if(!(await h.limit(env,'order-request-ip:'+ip,5))||!(await h.limit(env,'order-request-global',100)))
    return fail(429,'Too many order requests; try again later');
  const id='MKX-'+crypto.randomUUID().slice(0,8).toUpperCase();
  const secret=newToken(),now=Date.now(),expires=now+30*DAY;
  await env.COMMUNITY_DB.prepare(
   'INSERT INTO makhex_checkout_requests(id,access_hash,email,shipping_zip,shipping_state,status,lines_json,planning_subtotal_cents,created_at,updated_at,expires_at) VALUES (?,?,?,?,?,\'PENDING_REVIEW\',?,?,?,?,?)'
  ).bind(id,await hash(secret),email,zip,state,JSON.stringify(validated.lines),validated.planningSubtotalCents,now,now,expires).run();
  await env.COMMUNITY_DB.prepare(
   'INSERT INTO makhex_checkout_events(id,request_id,actor,action,created_at,note) VALUES (?,?,\'CUSTOMER\',\'SUBMITTED\',?,\'Awaiting sourcing and owner exception review\')'
  ).bind(crypto.randomUUID(),id,now).run();
  return response({orderId:id,accessToken:secret,status:'PENDING_REVIEW',
    statusUrl:'/checkout/status/#'+secret,
    requestedParts:validated.totalParts,quoteStatus:'REVIEW_REQUIRED',
    message:'Order request recorded. No payment was collected; MAKHEX will approve any sourcing exceptions before sending an official payment link.'},201);
 }
 if(path==='/api/v1/checkout/status'&&req.method==='POST'){
  if(!sameOrigin(req))return fail(403,'Same-origin status requests only');
  const body=await jsonBody(req);
  if(!body||!/^mkxo_[A-Za-z0-9_-]{43}$/.test(body.accessToken||''))return fail(401,'Invalid private order-status token');
  const row=await env.COMMUNITY_DB.prepare('SELECT * FROM makhex_checkout_requests WHERE access_hash=? AND expires_at>?')
    .bind(await hash(body.accessToken),Date.now()).first();
  return row?response(customerView(row)):fail(404,'Order not found or private link expired');
 }
 if(path==='/api/v1/checkout/admin/requests'&&req.method==='GET'||
    /^\/api\/v1\/checkout\/admin\/requests\/MKX-[A-F0-9]{8}$/.test(path)&&req.method==='POST'){
  const ownerKey=env.MAKHEX_ORDER_ADMIN_TOKEN||env.COMMUNITY_ADMIN_TOKEN;
  if(!ownerKey)return fail(503,'Owner approval access is not configured');
  const supplied=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
  if(!constantCompare(supplied,ownerKey))return fail(401,'Owner access required');
  if(req.method==='GET'){
   const rows=await env.COMMUNITY_DB.prepare(
    'SELECT id,email,shipping_zip,shipping_state,status,lines_json,planning_subtotal_cents,approved_total_cents,payment_url,merchant_order_id,tracking_reference,owner_note,created_at,updated_at FROM makhex_checkout_requests ORDER BY created_at DESC LIMIT 80'
   ).all();
   return response({orders:(rows.results??[]).map(row=>({...row,lines:JSON.parse(row.lines_json),lines_json:undefined}))});
  }
  if(!sameOrigin(req))return fail(403,'Owner changes require a same-origin browser');
  const body=await jsonBody(req);
  if(!body)return fail(400,'A valid JSON request is required');
  const id=path.split('/').at(-1);
  const old=await env.COMMUNITY_DB.prepare('SELECT * FROM makhex_checkout_requests WHERE id=?').bind(id).first();
  if(!old)return fail(404,'Order request not found');
  const note=safeText(body.note,500),now=Date.now();
  let status=old.status,approved=old.approved_total_cents,url=old.payment_url,merchant=old.merchant_order_id,tracking=old.tracking_reference;
  if(body.action==='approve'){
   if(status!=='PENDING_REVIEW')return fail(409,'Only pending orders may be approved');
   if(!Number.isInteger(body.approvedTotalCents)||body.approvedTotalCents<100||body.approvedTotalCents>30000000||note.length<12)
    return fail(422,'Owner must enter a positive approved price in cents and evidence note');
   approved=body.approvedTotalCents;status='APPROVED_NEEDS_PAYMENT_LINK';
  }else if(body.action==='reject'){
   if(!['PENDING_REVIEW','APPROVED_NEEDS_PAYMENT_LINK'].includes(status)||note.length<12)
    return fail(422,'Reject only uncharged requests and explain the exception');
   status='REJECTED';
  }else if(body.action==='attach_payment'){
   if(status!=='APPROVED_NEEDS_PAYMENT_LINK'||!safePayLink(body.paymentUrl))
    return fail(422,'Enter a real Squarespace-hosted MAKHEX payment URL for the approved amount');
   url=body.paymentUrl;status='PAYMENT_LINK_READY';
  }else if(body.action==='record_paid_verified'){
   if(status!=='PAYMENT_LINK_READY'||!/^.{6,90}$/.test(safeText(body.merchantOrderId,90))||
      body.receiptTotalCents!==approved||note.length<12)return fail(422,'A matching verified merchant receipt and evidence note are required');
   merchant=safeText(body.merchantOrderId,90);status='PAID_VERIFIED';
  }else if(body.action==='fulfill'){
   if(status!=='PAID_VERIFIED'||!/^.{6,130}$/.test(safeText(body.tracking,130)))return fail(422,'Verified payment and tracking are required');
   tracking=safeText(body.tracking,130);status='FULFILLED';
  }else return fail(422,'Unsupported owner decision');
  const result=await env.COMMUNITY_DB.prepare(
   'UPDATE makhex_checkout_requests SET status=?,approved_total_cents=?,payment_url=?,merchant_order_id=?,tracking_reference=?,owner_note=?,updated_at=? WHERE id=? AND status=? RETURNING id,status,updated_at'
  ).bind(status,approved,url,merchant,tracking,note,now,id,old.status).first();
  if(!result)return fail(409,'Request status changed. Refresh and review again');
  await env.COMMUNITY_DB.prepare(
   'INSERT INTO makhex_checkout_events(id,request_id,actor,action,created_at,note) VALUES (?,?,\'OWNER\',?,?,?)'
  ).bind(crypto.randomUUID(),id,body.action,now,note).run();
  return response({orderId:id,status,updatedAt:now});
 }
 return fail(404,'MAKHEX checkout endpoint not found');
}

export const checkoutInternals={validateLines,safePayLink,customerView};
