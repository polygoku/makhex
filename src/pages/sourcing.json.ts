import type {APIRoute} from 'astro';
import {projects} from '../data/projects';
import {products} from '../data/products';
import {supplierResearch,sourcingReviewedAt} from '../data/supplier-research';
import {catalogSnapshotDate,stageFor,plannedVariantForProject,projectBomMissingParts} from '../data/catalog-staging';

// Public, static research index for builders and AI agents. Never include
// private AliExpress SKU attributes, unit costs, owner tokens or buyer data.
export const prerender=true;
export const GET:APIRoute=()=>{
 const data={
  schema:'makhex-research-sourcing-v2',
  lastReadFromSupplier:sourcingReviewedAt,
  planningPriceAsOf:catalogSnapshotDate,
  purpose:'Research and bill-of-materials planning only: no stock, product checkout, or validated delivery promise',
  purchaseStatus:'NOT_APPROVED',
  supplierQualification:'PENDING',
  retailPricesIncludeShipping:false,
  components:products.map(product=>{
   const source=supplierResearch[product.slug],stage=stageFor(product.slug);
   if(!stage)throw new Error('Missing staged metadata for '+product.slug);
   return {
    slug:product.slug,title:product.title,selectedSupplierModel:stage.supplierModel,
    sourceItemId:source.itemId,aliExpressResearchUrl:source.url,
    technicalGate:source.gate,caution:source.caution,
    plannedVariants:stage.variants.map(v=>({description:v.title,indicativeRetailUsd:v.plannedRetailUsd})),
    priceStatus:'PLANNING_ONLY_NO_OFFER',storeState:'HIDDEN_ZERO_INVENTORY',
    USFreightVerified:false,supplierCheckoutTested:false
   };
  }),
  projects:projects.map(project=>{
   const parts=project.materials.map(m=>{
    const source=supplierResearch[m.slug],variant=plannedVariantForProject(m.slug,project.slug);
    return {
     slug:m.slug,quantity:m.qty,role:m.why,aliExpressResearchUrl:source.url,
     selectedFormat:source.projectOptions?.[project.slug]??source.selectedFormat,
     technicalGate:source.gate,
     indicativeUnitUsd:variant?.plannedRetailUsd??null,
     indicativeLineUsd:variant?Math.round(variant.plannedRetailUsd*m.qty*100)/100:null
    };
   });
   return {
    slug:project.slug,title:project.title,
    url:'https://makhex.com/projects/'+project.slug+'/',
    priceStatus:'INCOMPLETE_PLANNING_SUBTOTAL_EXCLUDES_TAX_FREIGHT_AND_MISSING_PARTS',
    indicativeMappedPartsSubtotalUsd:Math.round(parts.reduce((sum,p)=>sum+(p.indicativeLineUsd??0),0)*100)/100,
    outstandingBomIssues:projectBomMissingParts[project.slug]??[],
    components:parts
   };
  }),
  bomGaps:[
   {projectSlug:'voice-command-node',part:'Speaker sized for the verified amplifier',state:'UNSOURCED'},
   {projectSlug:'smart-desk-button',part:'Momentary pushbutton and input wiring',state:'UNSOURCED'},
   {projectSlug:'rgb-matrix-clock',part:'Rated 5V LED power supply and possible level shifter',state:'UNSOURCED'}
  ]
 };
 return new Response(JSON.stringify(data,null,2),{
  headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
 });
};
