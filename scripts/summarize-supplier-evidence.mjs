// Local PRIVATE source ledgers -> PUBLIC non-sensitive qualification summary.
// Never print item IDs, source URLs, cost, addresses or buyer information.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
if(process.argv.length!==4)throw new Error('Usage: node scripts/summarize-supplier-evidence.mjs PRIVATE_CORE_MAP.json PRIVATE_MICRODUCK_LEDGER.json');
const root=process.cwd();
const read=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=fs.readFileSync(path.join(root,'src/data/products.ts'),'utf8');
const context={exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context,{timeout:2000});
const products=context.exports.products;
const core=read(process.argv[2]);const duck=read(process.argv[3]);
const coreMap=new Map((core.components||[]).map(c=>[c.componentSlug,c]));
const duckMap=new Map((duck.items||[]).map(d=>[d.makhexSlug,d]));
const rows=products.map(p=>{
 const c=coreMap.get(p.slug),d=duckMap.get(p.slug);
 const candidate=Boolean(c?.sourceItemId||d?.aliexpressCandidateItemId);
 const exact=Boolean(c?.exactVariantQualified===true||d?.confirmedSkuId);
 const zip=Boolean(c?.shippingToZip11021Verified===true||d?.shippingPriceUsdTo11021);
 const media=Boolean(c?.photosReuseRightsVerified===true||d?.mediaPermissionVerified===true);
 const checkout=Boolean(c?.payableOrderVerified===true||d?.usCheckoutReviewVerified===true);
 const current=false; // All supplied evidence dated before 2026-10-27.
 return {slug:p.slug,candidate,exact,zip,media,checkout,current,
  status:(!candidate?'NO_VERIFIED_LISTING_CANDIDATE':!exact?'SOURCE_OPTION_UNVERIFIED':!zip?'11021_QUOTE_UNVERIFIED':!media?'MEDIA_RIGHTS_UNVERIFIED':'PILOT_STILL_REQUIRED')};
});
const summary={total:rows.length,candidates:rows.filter(r=>r.candidate).length,
 exact:rows.filter(r=>r.exact).length,datedZipQuotes:rows.filter(r=>r.zip).length,
 rightsEvidence:rows.filter(r=>r.media).length,datedCheckoutReviews:rows.filter(r=>r.checkout).length,
 currentlyQualified:rows.filter(r=>r.current&&r.exact&&r.zip&&r.media&&r.checkout).length};
const md=['# MAKHEX supplier qualification — historical evidence reconciliation','',
'Prepared October 27, 2026 from owner-controlled research dated October 23–25. Private supplier listing IDs, variant option strings, landed wholesale quotes and buyer details are intentionally excluded. No evidence is marked current without an authenticated refreshed checkout.','',
'## Coverage',
...Object.entries(summary).map(([k,v])=>'- '+k+': '+v),
'',
'| MAKHEX component | Candidate located | Exact seller option | 11021 quote (historical) | Media rights documented | Seller checkout reviewed | Sale-ready |',
'|---|---|---|---|---|---|---|',
...rows.map(r=>'| '+r.slug+' | '+(r.candidate?'Yes':'No')+' | '+(r.exact?'Historical match':'No')+' | '+(r.zip?'Historical only':'No')+' | '+(r.media?'Yes':'No')+' | '+(r.checkout?'Historical only':'No')+' | **NO** |'),
'',
'## Non-negotiable launch proof',
'1. Confirm source exact SKU/pack/board revision and seller photo for every BOM line; use only rights-cleared supplier imagery.',
'2. Prove real stock, ZIP 11021 option-specific landed freight, handling, ETA and returns within a dated expiry; AliExpress country-only API freight is insufficient.',
'3. Align exact merchant SKU and variant in Squarespace; no incorrect ESP32-C6 N4/N8 substitution, Radxa 1GB/no-header substitution, or 77-degree camera substituting for 160-degree model.',
'4. Apply supplier-cost × 2.5 retail pricing while accounting for shipping and payment fees. Free U.S. shipping only on merchant terms actually configured.',
'5. Verify genuine paid Squarespace order trigger, unique AliExpress supplier ID, charge settlement, tracking, shipment update and end-to-end refund; never retry an uncertain placement.',''];
fs.writeFileSync(path.join(root,'docs','SUPPLIER_QUALIFICATION_MATRIX_20261027.md'),md.join('\n'));
fs.writeFileSync(path.join(root,'docs','SUPPLIER_QUALIFICATION_MATRIX_20261027.json'),JSON.stringify({generatedAt:new Date().toISOString(),summary,rows},null,2)+'\n');
console.log(summary);
