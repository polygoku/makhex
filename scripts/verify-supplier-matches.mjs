// User-facing supplier routing completeness: public URLs are comparison links,
// never approved Shopify/Squarespace dropship mappings or confirmed U.S. stock.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {supplierMatches,offersFor} from '../src/data/supplier-matches.ts';
import {plannedVariantForProject} from '../src/data/catalog-staging.ts';

const allow=new Set(['EXACT_SPEC','SELECT_VARIANT','COMPATIBILITY_REVIEW','CUSTOM_ORDER']);
assert.equal(products.length,31);
assert.equal(projects.length,12);
assert.equal(Object.keys(supplierMatches).length,31,'One source spec per catalog component required');
let urls=0;
for(const p of products){
 const match=supplierMatches[p.slug];
 assert(match,'Missing seller routes '+p.slug);
 assert(match.required?.length>20);
 assert(match.notes?.length>15);
 assert(match.offers?.length>0,'No source matches for '+p.slug);
 for(const offer of match.offers){
  assert(allow.has(offer.match),'Unrecognized source confidence '+p.slug);
  assert(offer.seller?.length>1&&offer.label?.length>8&&offer.note?.length>15);
  const u=new URL(offer.url);
  assert.equal(u.protocol,'https:','Require HTTPS seller');
  assert(!u.username&&!u.password&&!/^(?:localhost|127\.0\.0\.1)$/.test(u.hostname));
  assert(!/(?:\baff(?:iliate)?\b|referral|utm_)/i.test(u.search),'No implicit affiliate tracking URLs');
  if(offer.project)assert(projects.some(x=>x.slug===offer.project&&x.materials.some(m=>m.slug===p.slug)));
  urls++;
 }
}
for(const project of projects){
 for(const line of project.materials){
  const offers=offersFor(line.slug,project.slug);
  assert(offers.length,'Build '+project.number+' has no sourcing path for '+line.slug);
  assert(offers.every(o=>!o.project||o.project===project.slug),'Wrong project vendor option');
 }
}
assert.equal(plannedVariantForProject('speaker-4ohm-3w','microduck-robot'),undefined,'3525 Microduck speaker must not inherit 28mm product price');
assert(plannedVariantForProject('speaker-4ohm-3w','voice-command-node')?.plannedRetailUsd>0,'Voice node retains its own priced 28mm speaker');
assert.equal(plannedVariantForProject('microduck-speaker-3525','microduck-robot')?.plannedRetailUsd,13.95,'Microduck has its separate 3525 HP1.25 speaker');
assert.equal(plannedVariantForProject('microduck-printed-parts','microduck-robot')?.plannedRetailUsd,0,'Free DIY CAD is never charged as physical goods');
assert(offersFor('ws2812-leds','rgb-matrix-clock').some(x=>/64|8×8/.test(x.label)));
assert(offersFor('ws2812-leds','smart-desk-button').some(x=>/8.LED|8-LED/.test(x.label)));
const dist='dist';
const matrix=fs.readFileSync(dist+'/parts-sources/index.html','utf8');
for(const p of products){
 assert(matrix.includes('id="'+p.slug+'"'),'Matrix missing anchor for '+p.slug);
 const detail=fs.readFileSync(dist+'/shop/'+p.slug+'/index.html','utf8');
 assert(detail.includes('id="buying-options"')&&detail.includes('OPEN '),'No source comparison links on '+p.slug);
 for(const o of supplierMatches[p.slug].offers)assert(detail.includes(o.url.replaceAll('&','&amp;')),'Seller URL missing in '+p.slug);
}
const source=JSON.parse(fs.readFileSync(dist+'/sourcing.json','utf8'));
assert(!source.checkoutAvailable);
assert.equal(source.components.filter(x=>x.buyingOptions.length>0).length,31);
assert.equal(source.projects.length,12);
assert.equal(source.researchSubcomponents.length,4);
assert(!JSON.stringify(source).includes('271.98'),'Dated out-of-stock estimate is not a real price');
console.log('SOURCE MATCH PASS: '+products.length+' catalog components, '+urls+' public retailer/design links, '+projects.length+' builds and Mosaico subassemblies; no fake stock, no checkout');
