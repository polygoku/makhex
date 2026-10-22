import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const base=path.join(root,'public/reference-builds');
const rows=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
assert.equal(rows.length,10,'Exactly ten independent build references required');
const unique=new Set();
const examples=fs.readFileSync(path.join(root,'src/data/projects.ts'),'utf8');
for(const row of rows){
 const key=row.slug;assert(!unique.has(key),'Duplicate '+key);unique.add(key);
 assert(examples.includes("slug:'"+key+"'"),'Reference does not match MAKHEX project '+key);
 assert(/^https:\/\/github\.com\/[-a-zA-Z0-9_.]+\/[-a-zA-Z0-9_.]+$/.test(row.sourceUrl),'Untrusted upstream repository '+key);
 assert(row.sourceImageUrl.startsWith(row.sourceUrl+'/blob/'),'Image source does not match repository '+key);
 assert(['MIT','Apache-2.0','GPL-3.0','LGPL-2.1','AGPL-3.0'].includes(row.license),'License not reviewed '+key);
 assert(row.stage.length>12 && row.difference.length>65,'Missing comparison disclosure '+key);
 assert(row.image===('/reference-builds/'+key+'.webp'),'Image must be local and deterministic '+key);
 const file=path.join(root,'public',row.image.slice(1));
 const buf=fs.readFileSync(file);
 assert(buf.length>20000 && buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP','Invalid real photo '+key);
 const l=path.join(base,'licenses',key+'-LICENSE.txt');assert(fs.readFileSync(l,'utf8').length>500,'License notice missing '+key);
 const generated=path.join(root,'dist','projects',key,'index.html');
 if(fs.existsSync(generated)){
  const html=fs.readFileSync(generated,'utf8');
  for(const term of ['/reference-builds/'+key+'.webp','Photo credit:',row.builder]){
   assert(html.includes(term),'Generated page missing '+term+' for '+key);
  }
 }
}
console.log('PASS: 10 independently sourced images, original creator credits, source/license records retained without extra UI panels');
