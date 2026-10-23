// MAKHEX customer catalog must remain first-party, priced 2.5x and ship free in the U.S.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {catalogStaging,plannedVariantForProject,projectBomMissingParts} from '../src/data/catalog-staging.ts';
const dist=path.resolve('dist');
const expected={
 'esp32-s3-devkit':[55.00],'esp32-c3-supermini':[10.98],'esp32-c6-devkit':[31.25],
 'esp32-s3-touch-35':[69.23],'esp32-s3-camera':[54.73],
 'i2s-mems-mic':[11.38],'i2s-amplifier':[17.63],
 'bme280-sensor':[11.08],'sgp40-voc':[37.63],
 'epaper-29':[47.08],'ws2812-leds':[14.55,5.10],
 'usb-c-power-kit':[16.38]
};
assert.equal(products.length,12);
assert.equal(projects.length,10);
assert.equal(Object.keys(catalogStaging).length,12);
let optionCount=0;
for(const product of products){
 const stage=catalogStaging[product.slug],prices=expected[product.slug];
 assert.ok(stage&&prices,'Staging record missing: '+product.slug);
 assert.equal(stage.shippingVerified,false);
 assert.equal(stage.buyerOrderabilityVerified,false);
 assert.equal(stage.variants.length,prices.length);
 for(let i=0;i<prices.length;i++){
  optionCount++;
  assert.equal(stage.variants[i].plannedRetailUsd,prices[i],'Retail price mismatch: '+product.slug);
 }
 const html=fs.readFileSync(path.join(dist,'shop',product.slug,'index.html'),'utf8');
 assert.ok(html.includes('Coming soon'),'Checkout disabled state missing: '+product.slug);
 assert.ok(html.includes('Free U.S. shipping'),'Customer shipping message missing: '+product.slug);
 assert.ok(html.includes('Illustration'),'Illustrative artwork not disclosed: '+product.slug);
 assert.ok(html.includes(stage.supplierModel.replaceAll('&','&amp;')),'Exact model missing: '+product.slug);
 assert.ok(html.includes('disabled'),'Product should not accept payment: '+product.slug);
 assert.ok(!/aliexpress(?:\.com| source| candidate|\s*\/)/i.test(html),'Supplier leak in product page: '+product.slug);
 assert.ok(!/VIEW PRODUCT ON SQUARESPACE|CHECK OUT AT SQUARESPACE/.test(html),'Unapproved checkout URL: '+product.slug);
}
assert.equal(optionCount,13);
assert.equal(Object.values(catalogStaging).filter(v=>v.technicalGate==='HOLD').length,3);
assert.equal(plannedVariantForProject('ws2812-leds','smart-desk-button')?.plannedRetailUsd,5.10);
assert.equal(plannedVariantForProject('ws2812-leds','rgb-matrix-clock')?.plannedRetailUsd,14.55);
assert.equal(Object.keys(projectBomMissingParts).length,3);
for(const project of projects){
 const html=fs.readFileSync(path.join(dist,'projects',project.slug,'index.html'),'utf8');
 assert.ok(html.includes('Parts subtotal'),'Parts subtotal missing: '+project.slug);
 assert.ok(html.includes('Free U.S. shipping'),'Shipping note missing from BOM: '+project.slug);
 assert.ok(!html.includes('AliExpress source'),'Supplier link exposed on project: '+project.slug);
 for(const m of project.materials)
  assert.ok(plannedVariantForProject(m.slug,project.slug),'Unpriced BOM component '+m.slug);
 const csv=fs.readFileSync(path.join(dist,'projects',project.slug+'.csv'),'utf8');
 assert.ok(csv.includes('Unit price USD')&&csv.includes('Line total USD'),'BOM CSV price fields missing');
 assert.ok(!/aliexpress/i.test(csv),'Source exposed in downloadable CSV: '+project.slug);
}
const index=fs.readFileSync(path.join(dist,'shop','index.html'),'utf8');
assert.ok(index.includes('Free U.S. shipping')&&index.includes('Checkout coming soon'));
assert.ok(!/aliexpress/i.test(index));
assert.ok(!index.includes('SUPPLIER VARIANTS')&&!index.includes('INDICATIVE PRICE'));
const sourcing=JSON.parse(fs.readFileSync(path.join(dist,'sourcing.json'),'utf8'));
assert.equal(sourcing.schema,'makhex-catalog-v3');
assert.equal(sourcing.checkoutAvailable,false);
assert.equal(sourcing.shipping.customerRateUsd,0);
assert.equal(sourcing.shipping.country,'US');
assert.equal(sourcing.components.length,12);
assert.equal(sourcing.projects.length,10);
assert.equal(sourcing.components.flatMap(p=>p.variants).length,13);
const publicJson=JSON.stringify(sourcing);
for(const sensitive of ['aliexpress','sourceItemId','sourceUnitCost','supplierUnitCost','sourceVariantId','access_token','refresh_token'])
 assert.ok(!publicJson.toLowerCase().includes(sensitive.toLowerCase()),'Supplier detail exposed in public JSON: '+sensitive);
console.log('MAKHEX SHOP PASS: 12 products, 13 2.5x prices, 10 project BOMs, free U.S. customer shipping, no supplier links, checkout gated');

// Regression gate: supplier research, stock snapshots, and an N4-titled-as-N8
// trial must never activate customer checkout by accident.
const approvalsSource=fs.readFileSync(path.resolve('src/data/checkout-approvals.ts'),'utf8');
assert.match(approvalsSource,/checkoutApprovals:\s*Readonly<Record<string,CheckoutApproval>>\s*=\s*Object\.freeze\(\{\}\)/,'Checkout approvals must remain explicitly empty pending end-to-end qualification');
assert.equal(sourcing.checkoutAvailable,false,'Do not advertise checkout without qualified orders');
const c6Stage=catalogStaging['esp32-c6-devkit'];
assert.equal(c6Stage.buyerOrderabilityVerified,false,'C6 old N4 trial cannot be treated as orderable N8');
assert.equal(c6Stage.shippingVerified,false,'C6 shipping must not be inferred from source listing');
console.log('MAKHEX COMMERCE SAFETY PASS: checkout approval ledger empty; misidentified C6 trial cannot unlock cart');
