// CI gate for presentation-only MAKHEX supplier staging.
// Never turns on inventory, fulfillment or Squarespace checkout.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {catalogStaging,plannedVariantForProject,projectBomMissingParts} from '../src/data/catalog-staging.ts';
const dist=path.resolve('dist');
assert.equal(products.length,12);
assert.equal(projects.length,10);
assert.equal(Object.keys(catalogStaging).length,12);
let count=0;
for(const product of products){
 const stage=catalogStaging[product.slug];
 assert.ok(stage,'Missing selected supplier model: '+product.slug);
 assert.ok(stage.supplierModel.length>5);
 assert.ok(['REVIEW','HOLD'].includes(stage.technicalGate));
 assert.equal(stage.shippingVerified,false);
 assert.equal(stage.buyerOrderabilityVerified,false);
 assert.ok(stage.variants.length>=1&&stage.variants.length<=3);
 for(const variant of stage.variants){
  count++;
  assert.ok(variant.title.trim().length>=7);
  assert.ok(Number.isFinite(variant.plannedRetailUsd)&&variant.plannedRetailUsd>0);
 }
 const html=fs.readFileSync(path.join(dist,'shop',product.slug,'index.html'),'utf8');
 assert.ok(html.includes('CHECKOUT COMING SOON'),'Checkout gate missing: '+product.slug);
 assert.ok(html.includes('Not an offer to sell.'),'Price is incorrectly offered for sale: '+product.slug);
 assert.ok(html.includes('ORIGINAL TECHNICAL ILLUSTRATION'),'Visual disclosure missing: '+product.slug);
 assert.ok(html.includes('INSPECT SUPPLIER CANDIDATE'),'Source provenance missing: '+product.slug);
 assert.ok(html.includes(stage.supplierModel.replaceAll('&','&amp;')),'Supplier model missing: '+product.slug);
}
assert.equal(count,13,'Expected exactly thirteen staged supplier options');
assert.equal(Object.values(catalogStaging).filter(s=>s.technicalGate==='HOLD').length,3);
assert.equal(plannedVariantForProject('ws2812-leds','smart-desk-button')?.plannedRetailUsd,3.47);
assert.equal(plannedVariantForProject('ws2812-leds','rgb-matrix-clock')?.plannedRetailUsd,9.89);
assert.equal(Object.keys(projectBomMissingParts).length,3);
for(const project of projects){
 const html=fs.readFileSync(path.join(dist,'projects',project.slug,'index.html'),'utf8');
 assert.ok(html.includes('ILLUSTRATIVE COMPONENT SUBTOTAL'),'BOM subtotal absent: '+project.slug);
 assert.ok(html.includes('Excludes shipping, tax'),'BOM price caveat absent: '+project.slug);
 for(const m of project.materials){
  assert.ok(plannedVariantForProject(m.slug,project.slug),'Missing project part staged price: '+project.slug+'/'+m.slug);
 }
}
const index=fs.readFileSync(path.join(dist,'shop','index.html'),'utf8');
assert.ok(index.includes('12 COMPONENT TYPES / 13 SUPPLIER VARIANTS'));
assert.ok(index.includes('0</strong><span>Released for checkout'));
const sourcing=JSON.parse(fs.readFileSync(path.join(dist,'sourcing.json'),'utf8'));
assert.equal(sourcing.components.length,12);
assert.equal(sourcing.projects.length,10);
assert.equal(sourcing.purchaseStatus,'NOT_APPROVED');
assert.equal(sourcing.schema,'makhex-research-sourcing-v2');
assert.ok(sourcing.components.every(p=>p.priceStatus==='PLANNING_ONLY_NO_OFFER'&&p.storeState==='HIDDEN_ZERO_INVENTORY'));
assert.equal(sourcing.components.flatMap(p=>p.plannedVariants).length,13);
const publicJson=JSON.stringify(sourcing);
for(const term of ['sourceUnitCost','supplierUnitCost','access_token','refresh_token','account_id']){
 assert.ok(!publicJson.includes(term),'Private source detail leaked: '+term);
}
console.log('MAKHEX CATALOG STAGING PASS: 12 source items / 13 options / 10 projects / 3 hold categories / 0 qualified checkout paths');
