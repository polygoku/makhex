import fs from 'node:fs';
import {products} from '../src/data/products.ts';
import {projects} from '../src/data/projects.ts';
import {mosaicoAssemblyParts} from '../src/data/mosaico-bom.ts';
import {stageFor} from '../src/data/catalog-staging.ts';

const generated={schema:'makhex-order-parts-v1',
 parts:Object.fromEntries(products.map(p=>[p.slug,{
   title:p.title,
   variants:(stageFor(p.slug)?.variants??[]).map(x=>x.title),
   // Prices are private *draft display only* and never authoritative charges.
   // Approval must still establish a delivered supplier quote and payment link.
   plannedRetailCents:stageFor(p.slug)?.variants?.map(x=>Math.round(x.plannedRetailUsd*100))??[],
   sellerCheckoutVerified:false
 }])),
 researchSubcomponents:Object.fromEntries(mosaicoAssemblyParts.map(p=>[p.slug,{title:p.title,variants:[],plannedRetailCents:[],sellerCheckoutVerified:false}])),
 projectParts:Object.fromEntries(projects.map(p=>[p.slug,p.materials.map(m=>m.slug)]))
};
const text='// Generated from MAKHEX catalog by scripts/build-order-catalog.mjs. DO NOT EDIT.\nexport const checkoutCatalog='+JSON.stringify(generated,null,2)+';\n';
const dest='worker/checkout-catalog.mjs';
if(process.argv.includes('--check')){
 if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==text)throw Error('checkout catalog generated source drift');
}else fs.writeFileSync(dest,text);
console.log('MAKHEX order catalog '+Object.keys(generated.parts).length+' component families and '+projects.length+' project BOMs');
