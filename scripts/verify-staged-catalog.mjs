// Release gate: 20% only on source-matched AliExpress, everything else external, no STL product.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {catalogStaging,stageFor,plannedVariantForProject} from '../src/data/catalog-staging.ts';
import {microduckPricePlans} from '../src/data/microduck-price-plans.ts';
import {isMakhexAliExpress,preferredExternalOffer,MAKHEX_ALIEXPRESS_MARKUP} from '../src/data/sourcing-policy.ts';
import {checkoutCatalog} from '../worker/checkout-catalog.mjs';
const dist='dist';
const prices={'feetech-hd1910':34.33,'imx219-160-camera':10.50,'vl53l5cx-v2':24,'npf550-power-kit':34.45,
 'bearing-6700':3.57,'bearing-et2216':6,'bearing-623zz':4.50,'microduck-speaker-3525':6.70};
assert.equal(products.length,30);
assert.equal(projects.length,12);
assert.equal(MAKHEX_ALIEXPRESS_MARKUP,1.2);
assert.equal(Object.keys(microduckPricePlans).length,8);
assert.equal(Object.keys(catalogStaging).length,16,'Preserve old Squarespace pricing snapshot for reconciliation only');
assert(!products.some(p=>p.slug==='microduck-printed-parts'));
assert(!projects.some(p=>p.materials.some(m=>m.slug==='microduck-printed-parts')));
for(const p of products){
 const ali=isMakhexAliExpress(p.slug);
 const html=fs.readFileSync(path.join(dist,'shop',p.slug,'index.html'),'utf8');
 assert(html.includes('/product-media/'+p.slug+'.jpg'),'Missing image '+p.slug);
 const jpg=fs.readFileSync(path.join('public','product-media',p.slug+'.jpg'));
 assert(jpg.length>2500&&jpg[0]===0xff&&jpg[1]===0xd8,'Corrupt photo '+p.slug);
 const part=checkoutCatalog.parts[p.slug];
 assert(part,'Missing component in API allowlist '+p.slug);
 assert.equal(part.shopEligible,ali,'Checkout eligibility drift '+p.slug);
 assert.equal(part.sellerCheckoutVerified,false);
 if(ali){
  const amount=prices[p.slug];
  assert.equal(microduckPricePlans[p.slug].variants[0].plannedRetailUsd,amount,'Incorrect 20 percent MAKHEX amount '+p.slug);
  assert.equal(part.plannedRetailCents[0],Math.round(amount*100),'Server price drift '+p.slug);
  assert(html.includes('data-cart-add')&&html.includes('CHECK OUT WITH MAKHEX'),'AliExpress item must use MAKHEX checkout '+p.slug);
  assert(html.includes('20% MAKHEX markup'),'Missing markup disclosure '+p.slug);
 }else{
  assert.equal(part.variants.length,0,'External item may not have MAKHEX option '+p.slug);
  assert.equal(part.plannedRetailCents.length,0);
  assert.equal(plannedVariantForProject(p.slug),undefined);
  assert(!html.includes('data-cart-add')&&!html.includes('MAKHEX price plan $'),'External item may not have cart/price '+p.slug);
  assert(html.includes('External supplier')&&html.includes('VIEW AT'),'External supplier link missing '+p.slug);
  assert(preferredExternalOffer(p.slug)?.url,'External item must have direct source '+p.slug);
 }
}
assert.equal(Object.values(checkoutCatalog.parts).filter(p=>p.shopEligible).length,8);
assert.equal(Object.keys(checkoutCatalog.parts).length,30);
const source=JSON.parse(fs.readFileSync(path.join(dist,'sourcing.json'),'utf8'));
assert.equal(source.schema,'makhex-catalog-v3');
assert.equal(source.aliexpressPriceMarkupMultiplier,1.2);
assert.equal(source.checkoutAvailable,false);
assert.equal(source.paymentCaptureEnabled,false);
assert.equal(source.components.length,30);
assert.equal(source.projects.length,12);
assert.equal(source.researchSubcomponents.length,4);
assert.equal(source.components.filter(p=>p.priceStatus==='ALIEXPRESS_MARKUP_20_PLANNING').length,8);
assert.equal(source.components.filter(p=>p.priceStatus==='EXTERNAL_UNMARKED_LINK').length,22);
assert.equal(source.components.filter(p=>p.variants.length===0).length,22);
assert.equal(source.components.flatMap(p=>p.variants).length,8);
assert(!JSON.stringify(source).includes('microduck-printed-parts'),'No printed-part checkout or catalog JSON');
for(const project of source.projects){
 const orig=projects.find(p=>p.slug===project.slug);
 assert.equal(project.parts.length,orig.materials.length);
 assert(project.parts.every(p=>p.sourceMode==='MAKHEX_ALI_20'||p.sourceMode==='EXTERNAL_NO_MARKUP'));
 const sum=Math.round(project.parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100;
 assert.equal(project.partsSubtotalUsd,sum,'Subtotal must exclude non-AliExpress direct items '+project.slug);
 for(const line of project.parts){
  if(line.sourceMode==='EXTERNAL_NO_MARKUP')assert(line.unitPriceUsd===null&&line.directSupplierLink,'External line must not be priced '+line.slug);
  else assert(typeof line.unitPriceUsd==='number'&&line.unitPriceUsd>=0&&line.directSupplierLink===null);
 }
 const html=fs.readFileSync(path.join(dist,'projects',project.slug,'index.html'),'utf8');
 assert(html.includes('BILL OF MATERIALS'));
 assert(html.includes('data-cart-add-all="'+project.slug+'"')===orig.materials.some(p=>isMakhexAliExpress(p.slug)),'Cart appears for external-only project '+project.slug);
 assert(!html.includes('/shop/microduck-printed-parts/'));
 const csv=fs.readFileSync(path.join(dist,'projects',project.slug+'.csv'),'utf8');
 assert(csv.includes('Unit price USD')&&csv.includes('Line total USD'));
}
assert(fs.readFileSync(path.join(dist,'projects','microduck-robot','index.html'),'utf8').includes('/members/microduck-designs/'),'Keep free design download in build');
assert(!fs.existsSync(path.join(dist,'shop','microduck-printed-parts','index.html')),'Old printable SKU must be removed');
for(const slug of ['microduck-hat','microduck-imu']){
 const html=fs.readFileSync(path.join(dist,'shop',slug,'index.html'),'utf8');
 assert(html.includes('Original creator PCB layout')&&html.includes('not an assembled-board photograph'),'Design image must not masquerade as assembled-board photo '+slug);
}
assert.match(fs.readFileSync('src/data/checkout-approvals.ts','utf8'),/checkoutApprovals:\s*Readonly<Record<string,CheckoutApproval>>\s*=\s*Object\.freeze\(\{\}\)/);
const serialized=JSON.stringify(source).toLowerCase();
for(const forbidden of ['sourceitemid','sourceunitcost','supplierunitcost','sourcevariantid','access_token','refresh_token']) assert(!serialized.includes(forbidden));
console.log('POLICY PASS: 30 products; 8 selected AliExpress plans at 1.2x; 22 external direct/no markup; STL off parts; real images; first-party payment safely gated.');
