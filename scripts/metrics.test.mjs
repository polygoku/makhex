import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {allowedEvent,recordProjectEvent,metricsApi} from '../worker/metrics.mjs';

const ORIGIN='https://makhex.com';
function setup(){
 const storage=new Map();
 const db={
  prepare(query){
   let values=[];
   return {
    bind(...params){values=params;return this},
    async run(){
     if(!query.startsWith('INSERT INTO makhex_project_funnel_daily'))throw Error('Unexpected SQL write');
     const [day,project,event]=values,key=day+'|'+project+'|'+event;
     storage.set(key,(storage.get(key)||0)+1);return {success:true};
    },
    async all(){
     if(!query.startsWith('SELECT day,project,event,count FROM makhex_project_funnel_daily'))throw Error('Unexpected SQL read');
     const start=values[0];
     return {results:[...storage.entries()].map(([key,count])=>{
      const [day,project,event]=key.split('|');return {day,project,event,count};
     }).filter(row=>row.day>=start)};
    }
   };
  }
 };
 const env={COMMUNITY_DB:db,MAKHEX_ORDER_ADMIN_TOKEN:'owner-test-only'};
 const helpers={ipKey:async()=> 'redacted-ip-hash',limit:async()=>true};
 const post=(body,origin=ORIGIN,h=helpers)=>metricsApi(new Request(ORIGIN+'/api/v1/metrics/events',{
  method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)
 }),env,h);
 const report=(token='owner-test-only',days='30')=>metricsApi(new Request(ORIGIN+'/api/v1/metrics/report?days='+days,{
  method:'GET',headers:{authorization:'Bearer '+token}
 }),env,helpers);
 return {storage,env,helpers,post,report};
}
test('only whitelisted anonymous project funnel events can be stored',async()=>{
 const x=setup();
 assert(allowedEvent('demo_play','microduck-robot'));
 assert(!allowedEvent('email','microduck-robot'));
 assert(!allowedEvent('demo_play','../../other-project'));
 assert.equal((await x.post({event:'demo_play',project:'microduck-robot'})).status,202);
 assert.equal((await x.post({event:'demo_play',project:'microduck-robot'})).status,202);
 assert.equal(x.storage.size,1);
 assert.equal([...x.storage.values()][0],2);
 const raw=JSON.stringify([...x.storage.entries()]);
 assert(!raw.includes('redacted-ip-hash')&&!raw.includes('@')&&!raw.includes('token'));
});
test('cross-origin, arbitrary events and client-side order submissions are rejected',async()=>{
 const x=setup();
 assert.equal((await x.post({event:'add_to_cart',project:'microduck-robot'},'https://malicious.test')).status,403);
 assert.equal((await x.post({event:'purchase_verified',project:'microduck-robot'})).status,422);
 assert.equal((await x.post({event:'demo_play',project:'../secrets'})).status,422);
 assert.equal((await x.post({event:'order_request_created',project:'microduck-robot'})).status,422);
 assert.equal((await x.post({event:'paid_checkout_verified',project:'microduck-robot'})).status,422);
 assert.equal((await x.post({event:'demo_play',project:'microduck-robot'},ORIGIN,{...x.helpers,ipKey:async()=>null})).status,503);
 assert.equal(x.storage.size,0);
});
test('owner-only report returns aggregated counts without visitor information',async()=>{
 const x=setup();
 await recordProjectEvent(x.env,'project_view','atomdog-quadruped-robot');
 await recordProjectEvent(x.env,'order_request_created','atomdog-quadruped-robot');
 await recordProjectEvent(x.env,'paid_checkout_verified','atomdog-quadruped-robot');
 assert.equal((await x.report('wrong')).status,401);
 assert.equal((await x.report('owner-test-only','120')).status,422);
 const result=await x.report();
 assert.equal(result.status,200);
 const data=await result.json();
 assert.equal(data.days,30);
 assert.equal(data.rows.length,3);
 assert(data.rows.every(row=>Number.isInteger(row.count)&&!Object.hasOwn(row,'ip')));
 assert(!JSON.stringify(data).includes('owner-test-only'));
});

const browserMetrics=readFileSync(new URL('../public/scripts/makhex-metrics.js',import.meta.url),'utf8');
const checkoutMarkup=readFileSync(new URL('../src/pages/checkout/index.astro',import.meta.url),'utf8');
const statusMarkup=readFileSync(new URL('../src/pages/checkout/status/index.astro',import.meta.url),'utf8');
const cartLine={slug:'fixture-controller',quantity:1,project:'microduck-robot'};

function interceptBrowserMetrics(pathname,markup,storage){
 const posts=[];
 const context={
  location:{pathname},
  document:{querySelector(selector){
   if(selector==='form#makhex-order-request-form')return /<form\b[^>]*\bid="makhex-order-request-form"/.test(markup)?{}:null;
   if(selector==='[data-showcase-project]')return null;
   throw Error('Unexpected selector '+selector);
  }},
  localStorage:{getItem(key){
   assert.equal(key,'makhex-parts-cart-v1');
   return typeof storage==='function'?storage():storage;
  }},
  window:{addEventListener(){}},
  fetch:async(url,options)=>{
   posts.push({url,method:options.method,body:JSON.parse(options.body)});
   return {ok:true};
  }
 };
 runInNewContext(browserMetrics,context,{filename:'makhex-metrics.js'});
 return posts;
}

test('a genuine checkout form sends exactly one checkout start for a nonempty cart',()=>{
 for(const pathname of ['/checkout/','/checkout']){
  assert.deepEqual(interceptBrowserMetrics(pathname,checkoutMarkup,JSON.stringify([cartLine,cartLine])),[
   {url:'/api/v1/metrics/events',method:'POST',body:{event:'checkout_start',project:'microduck-robot'}}
  ]);
 }
 assert.deepEqual(interceptBrowserMetrics('/checkout/',checkoutMarkup,JSON.stringify([cartLine,{...cartLine,project:'atomdog-quadruped-robot'}]))[0]?.body,
  {event:'checkout_start',project:'mixed'});
});

test('checkout refresh on an empty cart or invalid/unavailable storage sends no event',()=>{
 for(const storage of [null,'[]','{}','{',JSON.stringify([null,{}, {...cartLine,quantity:0}]),()=>{throw Error('Unavailable storage')}]){
  assert.deepEqual(interceptBrowserMetrics('/checkout/',checkoutMarkup,storage),[]);
 }
});

test('order-status revisits and nested checkout routes never send checkout_start',()=>{
 const cart=JSON.stringify([cartLine]);
 for(const pathname of ['/checkout/status/','/checkout/status','/checkout/unrelated/','/cart/']){
  assert.deepEqual(interceptBrowserMetrics(pathname,statusMarkup,cart),[]);
 }
 assert.deepEqual(interceptBrowserMetrics('/checkout/status/',statusMarkup,'[]'),[]);
 assert.deepEqual(interceptBrowserMetrics('/checkout/status/',checkoutMarkup,cart),[],'Route gate applies even if form markup appears on a nested route');
 assert.deepEqual(interceptBrowserMetrics('/checkout/',statusMarkup,cart),[],'Form gate applies even on an exact route');
});
