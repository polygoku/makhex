import test from 'node:test';
import assert from 'node:assert/strict';
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
