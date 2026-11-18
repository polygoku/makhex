import assert from 'node:assert/strict';
import fs from 'node:fs';
import {test} from 'node:test';
import {projects} from '../src/data/projects.ts';
import {products} from '../src/data/products.ts';
import {supplierMatches} from '../src/data/supplier-matches.ts';
import {isMakhexQuoteOnly} from '../src/data/sourcing-policy.ts';
import {checkoutCatalog} from '../worker/checkout-catalog.mjs';
import {checkoutInternals} from '../worker/checkout.mjs';
const project='rebot-b601-dev-arm';
const dm=['rebot-b601-dm-full-kit','rebot-b601-dm-power-kit','rebot-b601-dm-can-usb','rebot-b601-mount-clamps','rebot-b601-dm-discharge-module'];
const rs=['rebot-b601-rs-full-kit','rebot-b601-rs-power-kit','rebot-b601-rs-can-usb','rebot-b601-mount-clamps','rebot-b601-rs-bleeder-module'];
const items=arr=>arr.map(slug=>({slug,quantity:1,option:'Option pending',project}));
test('Build 15 source, 154 source-BOM lines and source-license notices are present',()=>{
 const p=projects.find(x=>x.slug===project);
 assert.equal(p?.number,'15');assert.deepEqual(p.materials.map(x=>x.slug),dm);
 assert.equal(projects.length,14);
 assert.equal(products.length,56);
 const doc=fs.readFileSync('builds/'+project+'/README.md','utf8');
 for(const s of ['CERN-OHL-W-2.0','Apache-2.0','24 V','48 V','DM4310','DM4340P','RS00','RS06','2432f436572f77922cdae6af39788df00f993263'])assert(doc.includes(s),'Missing engineering doc term '+s);
 const lines=file=>fs.readFileSync(file,'utf8').trim().split(/\r?\n/).length-1;
 assert.equal(lines('public/bom/rebot-b601-dm-detailed.csv'),79);
 assert.equal(lines('public/bom/rebot-b601-rs-detailed.csv'),75);
 const html=fs.readFileSync('dist/projects/'+project+'/index.html','utf8');
 for(const s of ['data-cart-add-all="'+project+'"','data-cart-add-plan="rebot-b601-rs-kit"','/bom/rebot-b601-dm-detailed.csv','/bom/rebot-b601-rs-detailed.csv','reBot','CERN-OHL-W','data-discussion-project="'+project+'"'])assert(html.includes(s),'Missing rendered feature '+s);
});
test('21 reBot source-matched first-party quote-only component families are not paid SKUs',()=>{
 const newParts=products.filter(x=>x.slug.startsWith('rebot-'));
 assert.equal(newParts.length,21);
 for(const part of newParts){
  assert(isMakhexQuoteOnly(part.slug));
  const c=checkoutCatalog.parts[part.slug];
  assert(c?.shopEligible);
  assert.equal(c.sellerCheckoutVerified,false);
  assert.deepEqual(c.variants,[]);
  assert.deepEqual(c.plannedRetailCents,[]);
  assert.equal(supplierMatches[part.slug]?.offers?.length>=1,true);
  assert(fs.statSync('public/product-media/'+part.slug+'.jpg').size>2500,'Missing source-labeled image '+part.slug);
  const html=fs.readFileSync('dist/shop/'+part.slug+'/index.html','utf8');
  assert(html.includes('Price on request')&&html.includes('data-cart-add')&&!html.includes('clean-product-price">$'),'Buyer price/checkout leak '+part.slug);
 }
 assert.equal(checkoutCatalog.projectParts[project].length,21,'All individual hardware subkits can enter maker quote cart');
});
test('safe first-party DM/RS arm request handling prevents voltage and kit duplication',()=>{
 for(const slugs of [dm,rs]){
  const res=checkoutInternals.validateLines(items(slugs));
  assert.equal(res?.lines.length,5);
  assert.equal(res.planningSubtotalCents,null);
  assert(res.lines.every(x=>x.requiresExceptionReview));
 }
 assert.equal(checkoutInternals.validateLines([...items(dm),...items(rs.slice(0,1))]),null,'24V and 48V motors must not mix');
 assert.equal(checkoutInternals.validateLines([...items(dm),...items(['rebot-b601-dm-body-motor-kit'])]),null,'Do not double-count body motors on Full Kit');
 assert.equal(checkoutInternals.validateLines([{slug:dm[0],quantity:1,option:'fake-priced',project}]),null,'Forged variant');
 assert.equal(checkoutInternals.validateLines([{slug:rs[0],quantity:1,option:'Option pending',project:'atomdog-quadruped-robot'}]),null,'Project part allowlist');
});
test('public catalog stores a distinct RS alternative and only quote intents',()=>{
 const s=JSON.parse(fs.readFileSync('dist/sourcing.json','utf8'));
 assert.equal(s.projects.length,14);assert.equal(s.components.length,56);
 assert.equal(s.checkoutAvailable,false);assert.equal(s.paymentCaptureEnabled,false);
 const plan=s.projectAlternativePlans['rebot-b601-rs-kit'];
 assert.equal(plan?.project,project);assert.deepEqual(plan.parts.map(p=>p.slug),rs);
 const found=s.projects.find(p=>p.slug===project);
 assert.deepEqual(found.parts.map(p=>p.slug),dm);
 assert(found.parts.every(p=>p.sourceMode==='MAKHEX_CART'&&p.unitPriceUsd===null));
});
