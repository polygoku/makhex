import test from 'node:test';
import assert from 'node:assert/strict';
import {handleMicroduckDesignApi} from '../worker/microduck-design-downloads.mjs';
import {microduckFiles} from '../worker/microduck-file-index.mjs';
const base='https://makhex.com/api/v1/community/projects/microduck-robot/';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
const err=(status,msg)=>json({error:msg},status);
const guest=async()=>null;
const signedIn=async()=>({id:'synthetic-test-maker'});
const req=(path,method='GET')=>new Request(base+path,{method});
const env={MICRODUCK_FILES:{async get(key){
 const file=microduckFiles.find(f=>f.key===key);
 return file?new Uint8Array(file.sizeBytes).buffer:null;
}}};

test('CAD catalog is inaccessible to anonymous requests',async()=>{
 const r=await handleMicroduckDesignApi(req('design-resources'),env,guest,json,err);
 assert.equal(r.status,401);
 assert.doesNotMatch(await r.text(),/microduck\/2026-10-25\/print-archive/);
});
test('every direct file download requires a maker session',async()=>{
 const r=await handleMicroduckDesignApi(req('design-downloads/stl-01'),env,guest,json,err);
 assert.equal(r.status,401);
});
test('signed in member sees 43 originals, including 36 STL meshes',async()=>{
 const r=await handleMicroduckDesignApi(req('design-resources'),env,signedIn,json,err);
 assert.equal(r.status,200);
 const data=await r.json();
 assert.equal(data.entries,43);
 assert.equal(data.resources.filter(x=>x.group==='Individual STL models').length,36);
 assert.ok(data.resources.some(x=>x.id==='print-archive'));
 assert.equal(data.resources.filter(x=>x.group==='Electronics / EasyEDA Pro').length,4);
 for(const item of data.resources){
   assert.match(item.downloadUrl,/^\/api\/v1\/community\/projects\/microduck-robot\/design-downloads\/[a-z0-9-]+$/);
   assert.match(item.sha256,/^[0-9a-f]{64}$/);
 }
});
test('signed-in download responds with an attachment and no-store headers',async()=>{
 const r=await handleMicroduckDesignApi(req('design-downloads/stl-01'),env,signedIn,json,err);
 assert.equal(r.status,200);
 assert.match(r.headers.get('content-disposition'),/attachment;/);
 assert.match(r.headers.get('cache-control'),/no-store/);
 assert.match(r.headers.get('x-robots-tag'),/noindex/);
 assert.equal((await r.arrayBuffer()).byteLength,microduckFiles.find(f=>f.id==='stl-01').sizeBytes);
});
test('unknown names, unsupported verbs and missing KV are rejected',async()=>{
 assert.equal((await handleMicroduckDesignApi(req('design-downloads/wrong'),env,signedIn,json,err)).status,404);
 assert.equal((await handleMicroduckDesignApi(req('design-downloads/stl-01','HEAD'),env,signedIn,json,err)).status,405);
 assert.equal((await handleMicroduckDesignApi(req('design-downloads/stl-01'),{},signedIn,json,err)).status,503);
});
test('KV byte-size mismatch fails closed',async()=>{
 const r=await handleMicroduckDesignApi(req('design-downloads/stl-01'),{MICRODUCK_FILES:{get:async()=>new Uint8Array(1).buffer}},signedIn,json,err);
 assert.equal(r.status,503);
});
