// All sourcing choices have explicit vendor evidence and correct cart route.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {supplierMatches,offersFor} from '../src/data/supplier-matches.ts';
import {plannedVariantForProject} from '../src/data/catalog-staging.ts';
import {isMakhexAliExpress,preferredExternalOffer} from '../src/data/sourcing-policy.ts';
const allow=new Set(['EXACT_SPEC','SELECT_VARIANT','COMPATIBILITY_REVIEW','CUSTOM_ORDER']);
assert.equal(products.length,30);
assert.equal(projects.length,12);
assert.equal(Object.keys(supplierMatches).length,30);
let urls=0;
for(const p of products){
 const match=supplierMatches[p.slug];
 assert(match?.required?.length>20&&match.notes?.length>15&&match.offers?.length>0,'Missing spec/sourcing '+p.slug);
 for(const o of match.offers){
  assert(allow.has(o.match));assert(o.label?.length>8&&o.note?.length>15);
  const url=new URL(o.url);assert.equal(url.protocol,'https:');
  assert(!url.username&&!url.password&&!/(?:\baff(?:iliate)?\b|referral|utm_)/i.test(url.search));
  if(o.project)assert(projects.some(x=>x.slug===o.project&&x.materials.some(m=>m.slug===p.slug)));
  urls++;
 }
 if(!isMakhexAliExpress(p.slug)) assert(preferredExternalOffer(p.slug),'Non-AliExpress part needs direct vendor '+p.slug);
}
for(const project of projects)for(const m of project.materials){
 const refs=offersFor(m.slug,project.slug);
 assert(refs.length>0&&refs.every(o=>!o.project||o.project===project.slug),'No relevant vendor option '+project.slug+'/'+m.slug);
 if(!isMakhexAliExpress(m.slug))assert.equal(plannedVariantForProject(m.slug,project.slug),undefined);
}
assert.equal(plannedVariantForProject('microduck-speaker-3525','microduck-robot')?.plannedRetailUsd,6.70);
assert.equal(plannedVariantForProject('speaker-4ohm-3w','voice-command-node'),undefined);
assert.equal(plannedVariantForProject('microduck-printed-parts','microduck-robot'),undefined);
assert.equal(preferredExternalOffer('microduck-wiring-kit')?.seller,'Original maker BOM','External wiring kit must link to ALL THREE original source options, not only heat shrink');
const source=JSON.parse(fs.readFileSync('dist/sourcing.json','utf8'));
assert(!source.checkoutAvailable);
assert.equal(source.components.filter(p=>p.buyingOptions.length>0).length,30);
assert.equal(source.projects.length,12);
for(const p of products){
 const html=fs.readFileSync('dist/shop/'+p.slug+'/index.html','utf8');
 assert(html.includes('id="buying-options"'));
 for(const o of supplierMatches[p.slug].offers)assert(html.includes(o.url.replaceAll('&','&amp;')),'Vendor reference missing '+p.slug);
}
console.log('SUPPLIER REFERENCES PASS:',products.length,'catalog families,',urls,'source links,',projects.length,'builds');
