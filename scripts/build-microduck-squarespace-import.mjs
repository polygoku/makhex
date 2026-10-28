/** Build a Squarespace Basic import bundle for seven reviewed AliExpress research SKUs.
 * Safe: outputs hidden, zero-stock candidate products and does NOT call any merchant API.
 * Imported variants require explicit inventory/checkout review before publishing.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {microduckPricePlans,microduckPriceObservedAt} from '../src/data/microduck-price-plans.ts';
import {verifyDoroppuBundle,SQUARESPACE_HEADER} from './verify-doroppu-bundle.mjs';
const supplierIds={
 'feetech-hd1910':'3256813219512604',
 'imx219-160-camera':'3256807416958346',
 'vl53l5cx-v2':'3256807375986018',
 'npf550-power-kit':'2255800740884834',
 'bearing-6700':'3256807024557318',
 'bearing-et2216':'3256804482667678',
 'bearing-623zz':'3256805794598678'
};
const supplierOptions={
 'feetech-hd1910':'15 x Servo pack; price on MAKHEX is PER SERVO for 15-piece Microduck order',
 'imx219-160-camera':'160 Degree',
 'vl53l5cx-v2':'VL53L5X V2',
 'npf550-power-kit':'2Pcs set',
 'bearing-6700':'S6700W3-OPEN 10x15x3 (supplier lot of 10; needed 5)',
 'bearing-et2216':'ET2216ZZ 16x22x4 (supplier lot of 10; needed 12, procure 2 lots)',
 'bearing-623zz':'623ZZ - 3x10x4 mm (optional 8-piece roller; supplier lot of 10)'
};
const csvCell=value=>{
 const s=String(value??'');
 return /[",\r\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;
};
const rows=[SQUARESPACE_HEADER],manifestProducts=[];
for(const [slug,item] of Object.entries(supplierIds)){
 const part=microduckPricePlans[slug];
 if(!part||part.variants.length!==1)throw Error('Unqualified/missing plan '+slug);
 const variant=part.variants[0];
 const sku='MKX-'+item+'-'+createHash('sha256').update(slug+':'+variant.title).digest('hex').slice(0,12).toUpperCase();
 const row=Object.fromEntries(SQUARESPACE_HEADER.map(x=>[x,'']));
 Object.assign(row,{
  'Product Type [Non Editable]':'PHYSICAL','Product Page':'shop','Product URL':'mkx-'+item,
  Title:part.supplierModel,
  Description:'MAKHEX robotics component: '+variant.title+'. Exact supplier option review dated '+microduckPriceObservedAt+'. Verify fulfillment stock, shipping, connector/mechanical compatibility and return eligibility before publishing. For MAKHEX project kits.',
  SKU:sku,'Option Name 1':'Hardware option','Option Value 1':variant.title,
  Price:variant.plannedRetailUsd.toFixed(2),
  'On Sale':'No',Stock:'0',Categories:'Robotics',Tags:'MAKHEX,Microduck',
  Visible:'No','Hosted Image URLs':'https://makhex.com/product-media/'+slug+'.jpg'
 });
 rows.push(SQUARESPACE_HEADER.map(k=>row[k]??''));
 manifestProducts.push({
  sourceId:item,slug:'mkx-'+item,title:part.supplierModel,variantCount:1,
  importVisibility:'No',initialStockPerVariant:0,publishAuthorized:false,
  qualification:'RESEARCH_ONLY',supplierSelectedOption:supplierOptions[slug],
  selectedPublicPhoto:'https://makhex.com/product-media/'+slug+'.jpg',
  landedCostVerifiedToUsZip:false,actualSkuVerifiedByAliApi:false
 });
}
const csv=rows.map(x=>x.map(csvCell).join(',')).join('\r\n')+'\r\n';
const manifest={
 schema:'makhex-doroppu-staging-v1',store:'shop.makhex.com',storePage:'shop',
 sourceProductCount:manifestProducts.length,variantCount:manifestProducts.length,
 status:'HIDDEN_ZERO_STOCK_REVIEW_ONLY',publishAuthorized:false,writePerformed:false,
 checkoutReady:false,researchedOn:microduckPriceObservedAt,
 pricingMultiplier:2.5,finalPriceSubjectToFreightReview:true,
 products:manifestProducts
};
const validation=verifyDoroppuBundle(csv,manifest);
if(!validation.ok)throw Error('Importer verification failed '+JSON.stringify(validation.failures));
const out=path.resolve('reports','microduck-merchant-import-20261028');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'squarespace-hidden-microduck-seven.csv'),csv);
fs.writeFileSync(path.join(out,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('SQUARESPACE IMPORT READY (HIDDEN/ZERO STOCK, NOT UPLOADED):',out,'7 products, 7 variant rows, 0 published');
