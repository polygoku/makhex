// MAKHEX commerce truth gate: every physical BOM part is requestable; no invented paid checkout.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {catalogStaging,plannedVariantForProject} from '../src/data/catalog-staging.ts';
import {microduckPricePlans} from '../src/data/microduck-price-plans.ts';
import {isMakhexAliExpress,isMakhexQuoteOnly,preferredExternalOffer,MAKHEX_ALIEXPRESS_MARKUP} from '../src/data/sourcing-policy.ts';
import {checkoutCatalog} from '../worker/checkout-catalog.mjs';

const dist='dist';
const prices={'feetech-hd1910':34.33,'imx219-160-camera':10.50,'vl53l5cx-v2':24,'npf550-power-kit':34.45,
 'bearing-6700':3.57,'bearing-et2216':6,'bearing-623zz':4.50,'microduck-speaker-3525':6.70};
assert.equal(products.length,35);
assert.equal(projects.length,13);
assert.equal(MAKHEX_ALIEXPRESS_MARKUP,1.2,'Previous AliExpress retail price formula must be retained only internally');
assert.equal(Object.keys(microduckPricePlans).length,8);
assert.equal(Object.keys(catalogStaging).length,16,'Historical Squarespace snapshot retained for reconciliation');
assert(!products.some(p=>p.slug==='microduck-printed-parts'),'STL print file must never become a saleable physical SKU');
assert(!projects.some(p=>p.materials.some(m=>m.slug==='microduck-printed-parts')));
assert.equal(Object.keys(checkoutCatalog.parts).length,35);
assert.equal(Object.keys(checkoutCatalog.projectParts).length,13);
assert.equal(Object.keys(checkoutCatalog.researchSubcomponents).length,4);
assert(Object.values(checkoutCatalog.researchSubcomponents).every(p=>p.shopEligible&&p.variants.length===0&&p.plannedRetailCents.length===0&&!p.sellerCheckoutVerified),'Mosaico virtual research items must be unpriced request-only');
for(const p of products){
 const part=checkoutCatalog.parts[p.slug];
 assert(part&&part.shopEligible===true&&!part.sellerCheckoutVerified,'Every real component is requestable, zero checkout-verified: '+p.slug);
 const html=fs.readFileSync(path.join(dist,'shop',p.slug,'index.html'),'utf8');
 assert(html.includes('/product-media/'+p.slug+'.jpg'),'Missing product photo: '+p.slug);
 const jpg=fs.readFileSync(path.join('public','product-media',p.slug+'.jpg'));
 assert(jpg.length>2500&&jpg[0]===0xff&&jpg[1]===0xd8,'Corrupt product JPEG: '+p.slug);
 assert(html.includes('data-cart-add')&&html.includes('REVIEW MAKHEX CART'),'No MAKHEX cart for '+p.slug);
 assert(html.includes('qualification-pill')&&html.includes('No charge until approved'),'Unqualified buyer promise missing '+p.slug);
 if(Object.hasOwn(prices,p.slug)){
  const amount=prices[p.slug],expected=Math.round(amount*100);
  assert.equal(microduckPricePlans[p.slug].variants[0].plannedRetailUsd,amount,'Wrong retail display amount '+p.slug);
  assert.equal(part.plannedRetailCents[0],expected,'Server planned price inconsistent '+p.slug);
  assert(html.includes('$'+amount.toFixed(2)),'Planned customer price missing '+p.slug);
 }else if(isMakhexQuoteOnly(p.slug)||!isMakhexAliExpress(p.slug)){
  assert.equal(part.variants.length,0,'Unqualified part must not invent variants '+p.slug);
  assert.equal(part.plannedRetailCents.length,0,'Unqualified part must not invent payable price '+p.slug);
  assert(html.includes('Price on request'),'Missing unpriced request label '+p.slug);
  assert(!html.includes('clean-product-price">$'),'Unqualified fixed price published '+p.slug);
 }
 if(!isMakhexAliExpress(p.slug)){
  assert.equal(plannedVariantForProject(p.slug),undefined,'Stale historical price used for non-Aliexpress part '+p.slug);
  assert(preferredExternalOffer(p.slug)?.url,'Keep optional fallback vendor evidence for owner: '+p.slug);
 }
 assert(html.includes('supplier-last-resort'),'Fallback source references missing '+p.slug);
 assert(!/supplierUnitCost|sourceUnitCost|aliexpressPriceMarkupMultiplier|\bmarkup\b/i.test(html),'Sensitive pricing detail disclosed '+p.slug);
}
assert(Object.values(checkoutCatalog.parts).every(p=>p.shopEligible===true&&p.sellerCheckoutVerified===false),'Payment is not verified for any part');
const source=JSON.parse(fs.readFileSync(path.join(dist,'sourcing.json'),'utf8'));
assert.equal(source.schema,'makhex-catalog-v4');
assert.equal(source.checkoutAvailable,false);
assert.equal(source.checkoutRequestAvailable,true);
assert.equal(source.paymentCaptureEnabled,false);
assert.equal(source.exceptionApprovalRequired,true);
assert.equal(source.externalCheckoutMode,'LAST_RESORT_ONLY');
assert.equal(source.components.length,35);
assert.equal(source.projects.length,13);
assert.equal(source.researchSubcomponents.length,4);
assert(source.researchSubcomponents.every(p=>p.priceStatus==='MAKHEX_QUOTE_REQUIRED'));
assert.equal(source.components.filter(p=>p.priceStatus==='MAKHEX_PRICE_REVIEW').length,8);
assert.equal(source.components.filter(p=>p.priceStatus==='MAKHEX_QUOTE_REQUIRED').length,27);
assert(source.components.every(p=>p.directSupplierLink===null&&p.fulfillmentMode==='MAKHEX_OWNER_REVIEW'&&p.availability==='QUALIFICATION_PENDING'));
assert.equal(source.components.filter(p=>p.variants.length===0).length,27);
assert.equal(source.components.flatMap(p=>p.variants).length,8);
for(const plan of source.projects){
 const origin=projects.find(p=>p.slug===plan.slug);
 assert(origin,'Unknown project');
 assert.equal(plan.parts.length,origin.materials.length);
 assert(plan.parts.every(p=>p.sourceMode==='MAKHEX_REQUEST'&&p.directSupplierLink===null),'External supplier made primary checkout for '+plan.slug);
 const sum=Math.round(plan.parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100;
 assert.equal(plan.partsSubtotalUsd,sum,'Unpriced item included in subtotal '+plan.slug);
 assert.equal(plan.quoteRequiredPartTypes,plan.parts.filter(p=>p.unitPriceUsd===null).length);
 for(const part of plan.parts){
  const m=origin.materials.find(m=>m.slug===part.slug);
  assert.equal(part.qty,m.qty,'Project BOM count drift '+plan.slug+'/'+part.slug);
  if(isMakhexAliExpress(part.slug)&&!isMakhexQuoteOnly(part.slug))assert(typeof part.unitPriceUsd==='number'&&part.unitPriceUsd>0);
  else assert.equal(part.unitPriceUsd,null,'Unverified item claimed a price '+plan.slug+'/'+part.slug);
 }
 const html=fs.readFileSync(path.join(dist,'projects',plan.slug,'index.html'),'utf8');
 assert(html.includes('data-cart-add-all="'+plan.slug+'"'),'Complete project request missing '+plan.slug);
 assert(html.includes('id="project-showcase"')&&html.includes('id="assembly-explorer"'),'Reusable showroom and assembly missing '+plan.slug);
 assert(html.includes('data-assembly-viewer')&&html.includes('data-assembly-select'),'Accessible 3D hotspot component index missing '+plan.slug);
}
const mosaico=source.projects.find(p=>p.slug==='mosaico-learning-assistant');
assert.deepEqual(mosaico.cartPlan.parts.map(x=>x.slug),['esp-mosaico-vision-combo-kit','usb-c-data-cable'],'Mosaico combo must include one cable without duplicating core/camera/interaction');
assert(source.researchSubcomponents.find(p=>p.slug==='usb-c-data-cable')?.priceStatus==='MAKHEX_QUOTE_REQUIRED');
assert(!JSON.stringify(source).includes('microduck-printed-parts'));
assert(!fs.existsSync(path.join(dist,'shop','microduck-printed-parts','index.html')));
for(const slug of ['microduck-hat','microduck-imu']){
 const html=fs.readFileSync(path.join(dist,'shop',slug,'index.html'),'utf8');
 assert(html.includes('Original creator PCB layout')&&html.includes('not an assembled-board photograph'),'PCB illustration misrepresented as physical board');
}
assert.match(fs.readFileSync('src/data/checkout-approvals.ts','utf8'),/checkoutApprovals:\s*Readonly<Record<string,CheckoutApproval>>\s*=\s*Object\.freeze\(\{\}\)/);
const allPublishedFiles=fs.readdirSync(dist,{recursive:true}).filter(n=>typeof n==='string'&&(n.endsWith('.html')||n==='sourcing.json'||n.endsWith('maker-cart.js')||n.endsWith('makhex-checkout.js')));
const confidential=/\bmark[\s-]?up\b|aliexpressPriceMarkupMultiplier|supplierUnitCost|sourceUnitCost|\bsupplier (?:cost|basis)\b/i;
for(const item of allPublishedFiles){
 const html=fs.readFileSync(path.join(dist,item),'utf8');
 assert(!confidential.test(html),'Internal pricing details leaked to buyers: '+item);
}
console.log('CUSTOMER PRICE/QUALIFICATION PRIVACY PASS: 35 first-party quote-safe components, 4 Mosaico virtual parts, 13 complete BOM requests, zero falsely verified paid SKUs.');
