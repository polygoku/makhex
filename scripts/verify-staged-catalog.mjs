// MAKHEX customer catalog must remain first-party, priced 2.5x and ship free in the U.S.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {catalogStaging,stageFor,plannedVariantForProject,projectBomMissingParts} from '../src/data/catalog-staging.ts';
import {microduckPricePlans,microduckRetailCautions,supplierVariantPhotoSlugs} from '../src/data/microduck-price-plans.ts';
import {supplierMatches,offersFor} from '../src/data/supplier-matches.ts';
const dist=path.resolve('dist');
const expected={
 'esp32-s3-devkit':[55.00],'esp32-c3-supermini':[10.98],'esp32-c6-devkit':[31.25],
 'esp32-s3-touch-35':[69.23],'esp32-s3-camera':[54.73],
 'i2s-mems-mic':[11.38],'i2s-amplifier':[17.63],
 'bme280-sensor':[11.08],'sgp40-voc':[37.63],
 'epaper-29':[47.08],'ws2812-leds':[14.55,5.10],
 'usb-c-power-kit':[16.38], 'esp-mosaico-vision-combo-kit':[201.70], 'speaker-4ohm-3w':[6.35], 'momentary-tactile-switch':[3.55], '5v-5a-led-power':[29.18]
};
assert.equal(products.length,31);
assert.equal(projects.length,12);
assert.equal(Object.keys(catalogStaging).length,16);
const microPrices={'feetech-hd1910':71.53,'imx219-160-camera':21.88,'vl53l5cx-v2':50,'npf550-power-kit':71.78,'bearing-6700':7.44,'bearing-et2216':12.50,'bearing-623zz':9.37,'microduck-speaker-3525':13.95,'microduck-hat':74.62,'microduck-imu':37.12,'microduck-fasteners':7.66,'amp20-servo-cables':20.25,'microduck-wiring-kit':5.70,'microduck-printed-parts':0};
assert.equal(Object.keys(microduckPricePlans).length,14);
for(const [slug,amount] of Object.entries(microPrices)){
 assert.equal(microduckPricePlans[slug]?.variants[0].plannedRetailUsd,amount,'Wrong exact-variant 2.5x plan '+slug);
 assert.equal(microduckPricePlans[slug]?.buyerOrderabilityVerified,false);
 assert.equal(microduckPricePlans[slug]?.shippingVerified,false);
 if(supplierVariantPhotoSlugs.has(slug)){
  const image=fs.readFileSync(path.join('public','product-media',slug+'.jpg'));
  assert.ok(image.length>8000&&image[0]===0xff&&image[1]===0xd8,'The matched supplier listing photo must be a valid JPEG: '+slug);
 }
}
let optionCount=0;
for(const product of products){
 const stage=catalogStaging[product.slug],prices=expected[product.slug];
 if(!stage&&!microduckPricePlans[product.slug]){
  assert.ok(!prices,'New unqualified component must not have a fixed source price: '+product.slug);
  assert.equal(product.status,'Research','Unqualified product cannot be published: '+product.slug);
  const html=fs.readFileSync(path.join(dist,'shop',product.slug,'index.html'),'utf8');
  assert.ok(html.includes('MAKHEX sourcing review'),'Unpriced product must go through MAKHEX sourcing review: '+product.slug);
  assert.ok(html.includes('href="/parts-sources/"'),'Unquoted product missing comparison index');
  assert.equal(supplierMatches[product.slug]?.offers.length>0,true,'Missing supplier purchase/comparison options: '+product.slug);
  assert.ok(html.includes('CHECK OUT WITH MAKHEX'),'Unqualified item must use MAKHEX order review: '+product.slug);
  continue;
 }
 if(!stage&&microduckPricePlans[product.slug]){
  assert.ok(!prices,'Research cannot overwrite existing Squarespace prices: '+product.slug);
  const plan=stageFor(product.slug);
  assert.equal(plan.technicalGate,product.slug==='microduck-printed-parts'?'REVIEW':'HOLD');
  assert.equal(plan.variants.length,1);
  const html=fs.readFileSync(path.join(dist,'shop',product.slug,'index.html'),'utf8');
  if(supplierVariantPhotoSlugs.has(product.slug)) assert.ok(html.includes('Matched supplier variant listing image'),'Source image missing '+product.slug);
  if(product.slug==='microduck-printed-parts'){
   assert.ok(html.includes('FREE 3D MODEL DOWNLOAD')&&html.includes('/members/microduck-designs/'),'Free self-print model link must remain in MAKHEX login');
   assert.ok(!html.includes('ADD TO PARTS LIST +'),'Free digital file must not pretend to be a shipped part');
  }else{
   assert.ok(html.includes('MAKHEX plan $'+plan.variants[0].plannedRetailUsd.toFixed(2)),'2.5x retail plan missing '+product.slug);
   assert.ok(html.includes('CHECK OUT WITH MAKHEX'),'Must retain MAKHEX checkout');
  }
  assert.ok(html.includes(microduckRetailCautions[product.slug].slice(0,22)),'Engineering sourcing note absent '+product.slug);
  continue;
 }
 assert.ok(prices,'Unreviewed previously staged product: '+product.slug);
 assert.equal(stage.shippingVerified,false);
 assert.equal(stage.buyerOrderabilityVerified,false);
 assert.equal(stage.variants.length,prices.length);
 for(let i=0;i<prices.length;i++){
  optionCount++;
  assert.equal(stage.variants[i].plannedRetailUsd,prices[i],'Retail price mismatch: '+product.slug);
 }
 const html=fs.readFileSync(path.join(dist,'shop',product.slug,'index.html'),'utf8');
 assert.ok(html.includes('CHECK OUT WITH MAKHEX'),'Product must route to MAKHEX checkout: '+product.slug);
 assert.ok(html.includes('free U.S. shipping'),'Customer shipping message missing: '+product.slug);
 assert.ok(html.includes('Component reference image'),'Unverified supplier-photo caption not visible: '+product.slug);
 assert.ok(html.includes(stage.supplierModel.replaceAll('&','&amp;')),'Exact model missing: '+product.slug);
 assert.ok(html.includes('MAKHEX plan'),'Retail planning price clearly flagged: '+product.slug);
 assert.ok(!/VIEW PRODUCT ON SQUARESPACE|CHECK OUT AT SQUARESPACE/.test(html),'Unapproved checkout URL: '+product.slug);
}
assert.equal(optionCount,17);
assert.equal(Object.values(catalogStaging).filter(v=>v.technicalGate==='HOLD').length,6);
assert.equal(plannedVariantForProject('ws2812-leds','smart-desk-button')?.plannedRetailUsd,5.10);
assert.equal(plannedVariantForProject('ws2812-leds','rgb-matrix-clock')?.plannedRetailUsd,14.55);
assert.equal(Object.keys(projectBomMissingParts).length,5);
for(const project of projects){
 const html=fs.readFileSync(path.join(dist,'projects',project.slug,'index.html'),'utf8');
 assert.ok(html.includes('Parts subtotal'),'Parts subtotal missing: '+project.slug);
 assert.ok(html.includes('U.S. delivery'),'Shipping qualification note missing from BOM: '+project.slug);
 assert.ok(!html.includes('AliExpress source'),'Supplier link exposed on project: '+project.slug);
 for(const m of project.materials)
  assert.ok(products.some(p=>p.slug===m.slug),'Unknown BOM component '+m.slug);
 if(project.materials.some(m=>!plannedVariantForProject(m.slug,project.slug)))
  assert.ok(html.includes('Price pending'),'Project with unpriced BOM component must display pending subtotal: '+project.slug);
 const csv=fs.readFileSync(path.join(dist,'projects',project.slug+'.csv'),'utf8');
 assert.ok(csv.includes('Unit price USD')&&csv.includes('Line total USD'),'BOM CSV price fields missing');
 assert.ok(!/aliexpress/i.test(csv),'Source exposed in downloadable CSV: '+project.slug);
}
const index=fs.readFileSync(path.join(dist,'shop','index.html'),'utf8');
assert.ok(index.includes('Free U.S. shipping')&&index.includes('MAKHEX order requests open'));
assert.ok(!/aliexpress/i.test(index));
assert.ok(!index.includes('SUPPLIER VARIANTS')&&!index.includes('INDICATIVE PRICE'));
const sourcing=JSON.parse(fs.readFileSync(path.join(dist,'sourcing.json'),'utf8'));
assert.equal(sourcing.schema,'makhex-catalog-v3');
assert.equal(sourcing.checkoutAvailable,false);
assert.equal(sourcing.shipping.customerRateUsd,0);
assert.equal(sourcing.shipping.country,'US');
assert.equal(sourcing.components.length,31);
assert.equal(sourcing.projects.length,12);
assert.equal(sourcing.researchSubcomponents.length,4,'Build 11 true hardware breakdown must include core, camera, interaction and cable');
const build11=sourcing.projects.find(p=>p.slug==='mosaico-learning-assistant');
assert.equal(build11.cartPlan.parts.length,2,'Combo plan must only contain bundle and cable');
assert.equal(build11.cartPlan.parts[0].slug,'esp-mosaico-vision-combo-kit');
const alternate=sourcing.projectAlternativePlans['mosaico-learning-assistant'];
assert.equal(alternate.parts.length,4,'Standalone research plan must list four components');
assert(!alternate.parts.some(x=>x.slug==='esp-mosaico-vision-combo-kit'),'Standalone plan must not duplicate the bundle');
for(const component of sourcing.researchSubcomponents){
 assert.equal(component.availability,'RESEARCH_ONLY');
 assert.equal(component.variants.length,0,'Do not invent purchasable supplier options');
}
assert.equal(sourcing.components.flatMap(p=>p.variants).length,31);
assert.equal(sourcing.components.filter(p=>p.priceStatus==='ALIEXPRESS_VARIANT_PLANNING').length,8);
assert.equal(sourcing.components.filter(p=>p.priceStatus==='MAKER_HISTORICAL_2_5X_ESTIMATE').length,5);
assert.equal(sourcing.components.filter(p=>p.priceStatus==='FREE_DIGITAL_MODEL').length,1);
const radxa=sourcing.components.find(p=>p.slug==='radxa-zero-3w');
assert.equal(radxa.variants.length,0);
assert.equal(radxa.priceStatus,'COMPARE_EXTERNAL_SELLERS');
assert.ok(radxa.buyingOptions.some(o=>o.url==='https://arace.tech/products/radxa-zero-3w'));
assert.equal(radxa.availability,'COMING_SOON');
assert.ok(!JSON.stringify(sourcing).includes('271.98'),'Do not publish stale Radxa historical quote');
assert.equal(radxa.hardwareReview,'HOLD');
assert.ok(!sourcing.checkoutAvailable);
assert.equal(sourcing.components.filter(p=>p.variants.length===0).length,1,'Only exact Radxa 2GB header remains without a price plan');
assert.equal(sourcing.components.find(p=>p.slug==='microduck-printed-parts').availability,'DIGITAL_DOWNLOAD');
assert.equal(sourcing.components.filter(p=>p.buyingOptions.length>0).length,31,'All catalog components require buyer sources');
assert.equal(offersFor('ws2812-leds','rgb-matrix-clock').some(x=>x.project==='rgb-matrix-clock'),true);
assert.equal(offersFor('ws2812-leds','smart-desk-button').some(x=>x.project==='smart-desk-button'),true);
assert.equal(plannedVariantForProject('speaker-4ohm-3w','microduck-robot'),undefined,'Do not price 3525 speaker as voice-node 28mm speaker');
for(const project of sourcing.projects){
 if(project.parts.some(p=>p.unitPriceUsd===null))assert.equal(project.partsSubtotalUsd,null,'Unpriced BOM must have null subtotal: '+project.slug);
}
const publicJson=JSON.stringify(sourcing);
for(const sensitive of ['sourceItemId','sourceUnitCost','supplierUnitCost','sourceVariantId','access_token','refresh_token'])
 assert.ok(!publicJson.toLowerCase().includes(sensitive.toLowerCase()),'Private supplier credentials/cost exposed in public JSON: '+sensitive);
console.log(`MAKHEX SHOP PASS: ${products.length} components; ${optionCount} Squarespace prices, 8 exact AliExpress option plans, 5 historical maker estimates, 1 free CAD download, 1 out-of-stock Radxa option; checkout gated`);

// Regression gate: supplier research, stock snapshots, and an N4-titled-as-N8
// trial must never activate customer checkout by accident.
const approvalsSource=fs.readFileSync(path.resolve('src/data/checkout-approvals.ts'),'utf8');
assert.match(approvalsSource,/checkoutApprovals:\s*Readonly<Record<string,CheckoutApproval>>\s*=\s*Object\.freeze\(\{\}\)/,'Checkout approvals must remain explicitly empty pending end-to-end qualification');
assert.equal(sourcing.checkoutAvailable,false,'Do not advertise checkout without qualified orders');
const c6Stage=catalogStaging['esp32-c6-devkit'];
assert.equal(c6Stage.buyerOrderabilityVerified,false,'C6 old N4 trial cannot be treated as orderable N8');
assert.equal(c6Stage.shippingVerified,false,'C6 shipping must not be inferred from source listing');
console.log('MAKHEX COMMERCE SAFETY PASS: checkout approval ledger empty; misidentified C6 trial cannot unlock cart');
