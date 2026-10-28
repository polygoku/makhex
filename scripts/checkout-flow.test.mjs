import test from 'node:test';
import assert from 'node:assert/strict';
import {checkoutApi,checkoutInternals} from '../worker/checkout.mjs';
import {checkoutCatalog} from '../worker/checkout-catalog.mjs';
const origin='https://makhex.com';

function setup(){
 const requests=new Map(), events=[];
 const db={
  prepare(sql){
   let args=[];
   const query={
    bind(...x){args=x;return query},
    async run(){
     if(sql.startsWith('INSERT INTO makhex_checkout_requests')){
      const [id,hash,email,zip,state,lines,sub,created,updated,expires]=args;
      requests.set(id,{id,access_hash:hash,email,shipping_zip:zip,shipping_state:state,status:'PENDING_REVIEW',lines_json:lines,planning_subtotal_cents:sub,approved_total_cents:null,payment_url:null,merchant_order_id:null,tracking_reference:null,owner_note:null,created_at:created,updated_at:updated,expires_at:expires});
     }else if(sql.startsWith('INSERT INTO makhex_checkout_events'))events.push(args);
     else throw Error('unexpected run '+sql);
     return {success:true};
    },
    async first(){
     if(sql.includes('SELECT * FROM makhex_checkout_requests WHERE access_hash=')){
      return [...requests.values()].find(r=>r.access_hash===args[0]&&r.expires_at>args[1])??null;
     }
     if(sql.includes('SELECT * FROM makhex_checkout_requests WHERE id='))return requests.get(args[0])??null;
     if(sql.startsWith('UPDATE makhex_checkout_requests')){
      const [status,approved,url,merchant,tracking,note,now,id,old]=args;
      const row=requests.get(id);
      if(!row||row.status!==old)return null;
      Object.assign(row,{status,approved_total_cents:approved,payment_url:url,merchant_order_id:merchant,tracking_reference:tracking,owner_note:note,updated_at:now});
      return {id,status,updated_at:now};
     }
     throw Error('unexpected first '+sql);
    },
    async all(){
     if(sql.startsWith('SELECT id,email,shipping_zip,shipping_state,status')){
      return {results:[...requests.values()].map(x=>({...x}))};
     }
     throw Error('unexpected all '+sql);
    }
   };return query;
  }
 };
 const env={COMMUNITY_DB:db,MAKHEX_ORDER_ADMIN_TOKEN:'test-owner-token'};
 const h={verifyTurnstile:async()=>true,ipKey:async()=> 'hashed-test-ip',limit:async()=>true};
 const call=(path,method='POST',body,admin=false,reqOrigin=origin,helpers=h)=>{
  const headers={'accept':'application/json',...(body?{'content-type':'application/json'}:{}),...(['POST','PUT','DELETE'].includes(method)?{'origin':reqOrigin}:{}),
   ...(admin?{authorization:'Bearer test-owner-token'}:{})};
  return checkoutApi(new Request(origin+'/api/v1/checkout/'+path,{method,headers,body:body?JSON.stringify(body):undefined}),env,helpers);
 };
 return {requests,events,call,env,h};
}
const validBody=()=>({
 email:'buyer@example.com',shippingZip:'11021',shippingState:'NY',acceptTerms:true,turnstileToken:'verified',
 lines:[
  {slug:'feetech-hd1910',option:'Option pending',quantity:15,project:'microduck-robot'},
  {slug:'microduck-speaker-3525',option:checkoutCatalog.parts['microduck-speaker-3525'].variants[0],quantity:1,project:'microduck-robot'}
 ]
});
test('all 30 catalog products are present and external parts are locked',()=>{
 assert.equal(Object.keys(checkoutCatalog.parts).length,30);
 assert.equal(Object.keys(checkoutCatalog.projectParts).length,12);
 const bundle=checkoutInternals.validateLines([
  {slug:'feetech-hd1910',option:checkoutCatalog.parts['feetech-hd1910'].variants[0],quantity:15,project:'microduck-robot'},
  {slug:'bearing-et2216',option:checkoutCatalog.parts['bearing-et2216'].variants[0],quantity:12,project:'microduck-robot'}
 ]);
 assert.equal(bundle.planningSubtotalCents,58695,'15 servos and 12 ET bearings must normalize supplier multi-packs once, not multiply pack prices per item');
 assert.equal(bundle.totalParts,27);
 assert.equal(Object.values(checkoutCatalog.parts).filter(x=>x.shopEligible).length,8);
 assert.equal(checkoutCatalog.parts['microduck-hat'].shopEligible,false);
 assert.equal(checkoutCatalog.parts['esp32-s3-devkit'].shopEligible,false);
 assert.equal(checkoutCatalog.parts['microduck-printed-parts'],undefined);
 assert.equal(Object.keys(checkoutCatalog.researchSubcomponents).length,4);
 assert(Object.values(checkoutCatalog.parts).every(p=>p.sellerCheckoutVerified===false));
});
test('cart whitelist protects source options and project BOM',()=>{
 const ok=checkoutInternals.validateLines(validBody().lines);
 assert.equal(ok.totalParts,16);assert.equal(ok.lines.length,2);
 assert.equal(ok.lines.every(x=>x.requiresExceptionReview),true);
 assert.equal(ok.planningSubtotalCents,null);
 assert.equal(checkoutInternals.validateLines([{slug:'nonexistent',option:'Option pending',quantity:1}]),null);
 assert.equal(checkoutInternals.validateLines([{slug:'feetech-hd1910',option:'Option pending',quantity:99,project:'smart-desk-button'}]),null);
 assert.equal(checkoutInternals.validateLines([{slug:'esp32-c6-devkit',option:'N4',quantity:1}]),null);
 assert.equal(checkoutInternals.validateLines([{slug:'esp32-c6-devkit',option:'N8 · 8 MB flash',quantity:1}]),null,'External-only former merchant SKU is not checkout eligible');
 assert.equal(checkoutInternals.validateLines([{slug:'speaker-4ohm-3w',option:'28 mm / 4 ohm / 3 W',quantity:1,project:'microduck-robot'}]),null);
 assert.equal(checkoutInternals.validateLines([{slug:'speaker-4ohm-3w',option:'Option pending',quantity:1,project:'microduck-robot'}]),null,'Never let the voice-node speaker into Microduck cart');
 assert.equal(checkoutInternals.validateLines([{slug:'microduck-speaker-3525',option:checkoutCatalog.parts['microduck-speaker-3525'].variants[0],quantity:1,project:'microduck-robot'}])?.planningSubtotalCents,670);
 assert.equal(checkoutInternals.validateLines([{slug:'microduck-hat',option:'Option pending',quantity:1,project:'microduck-robot'}]),null,'Non-AliExpress HAT must not be sold through MAKHEX');
 assert.equal(checkoutInternals.validateLines([{slug:'microduck-printed-parts',option:'Option pending',quantity:1,project:'microduck-robot'}]),null,'Removed STL cannot be billed');
});
test('intake requires same origin, consent, Turnstile and US ZIP',async()=>{
 const f=setup(),b=validBody();
 assert.equal((await f.call('requests','POST',b,false,'https://attacker.example')).status,403);
 assert.equal((await f.call('requests','POST',{...b,acceptTerms:false})).status,422);
 assert.equal((await f.call('requests','POST',{...b,shippingZip:'ABC'})).status,422);
 assert.equal((await f.call('requests','POST',b,false,origin,{...f.h,verifyTurnstile:async()=>false})).status,403);
 assert.equal(f.requests.size,0);
});
test('one MAKHEX order requires owner price exception approval then secure provider link',async()=>{
 const f=setup();
 const created=await f.call('requests','POST',validBody());
 assert.equal(created.status,201);
 const receipt=await created.json();assert.equal(receipt.status,'PENDING_REVIEW');
 assert.match(receipt.accessToken,/^mkxo_[A-Za-z0-9_-]{43}$/);
 assert.equal(f.requests.size,1);
 assert(!JSON.stringify([...f.requests.values()]).includes(receipt.accessToken),'Only token hash may be persisted');
 assert.equal((await f.call('admin/requests','GET')).status,401);
 const pending=await f.call('status','POST',{accessToken:receipt.accessToken});assert.equal(pending.status,200);
 assert.equal((await pending.json()).status,'PENDING_REVIEW');
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'attach_payment',paymentUrl:'https://shop.makhex.com/pay/123',note:'test'},true)).status,422);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'approve',approvedTotalCents:19000,note:'Verified exact variants and supplier delivery estimate'},true)).status,200);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'attach_payment',paymentUrl:'https://evil.shop.fake/checkout',note:'malicious host'},true)).status,422);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'attach_payment',paymentUrl:'https://shop.makhex.com/pay/abc',note:'Matched quoted amount to Squarespace Pay Link'},true)).status,200);
 const ready=await (await f.call('status','POST',{accessToken:receipt.accessToken})).json();
 assert.equal(ready.status,'PAYMENT_LINK_READY');assert.equal(ready.paymentUrl,'https://shop.makhex.com/pay/abc');
 assert.equal(ready.approvedAmountUsd,190);
 assert.equal(ready.email,undefined);assert.equal(ready.shipping_zip,undefined);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'record_paid_verified',merchantOrderId:'SQ123456',receiptTotalCents:18000,note:'Receipt mismatch'},true)).status,422);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'record_paid_verified',merchantOrderId:'SQ123456',receiptTotalCents:19000,note:'Confirmed paid merchant receipt and matching total'},true)).status,200);
 assert.equal((await f.call('admin/requests/'+receipt.orderId,'POST',{action:'fulfill',tracking:'USPS 9400 1022 1234 5678 90',note:'Carrier handoff recorded'},true)).status,200);
 assert.equal((await (await f.call('status','POST',{accessToken:receipt.accessToken})).json()).status,'FULFILLED');
 assert.equal(f.events.length,5);
});
test('existing community moderator credential can review exceptions until dedicated owner key exists',async()=>{
 const f=setup();
 f.env.COMMUNITY_ADMIN_TOKEN=f.env.MAKHEX_ORDER_ADMIN_TOKEN;
 delete f.env.MAKHEX_ORDER_ADMIN_TOKEN;
 assert.equal((await f.call('admin/requests','GET',undefined,true)).status,200);
 assert.equal((await f.call('admin/requests','GET')).status,401);
 delete f.env.COMMUNITY_ADMIN_TOKEN;
 assert.equal((await f.call('admin/requests','GET',undefined,true)).status,503);
});
test('buyer cannot forge internal prices or attach arbitrary redirect',()=>{
 assert.equal(checkoutInternals.safePayLink('https://shop.makhex.com/pay/abc'),true);
 assert.equal(checkoutInternals.safePayLink('https://shop.makhex.com.evil.com/pay/abc'),false);
 assert.equal(checkoutInternals.safePayLink('http://shop.makhex.com/pay/abc'),false);
 assert.equal(checkoutInternals.safePayLink('https://evil.com/pay/abc'),false);
 assert.equal(checkoutInternals.safePayLink('https://checkout.squarespace.com/s/123'),true);
});
