import type {APIRoute} from 'astro';
import {projectsNewestFirst} from '../lib/catalog';
import {products} from '../data/products';
import {mosaicoAssemblyParts,mosaicoCommercePlans} from '../data/mosaico-bom';
import {catalogSnapshotDate,stageFor,plannedVariantForProject,projectBomMissingParts} from '../data/catalog-staging';

// Customer-facing agent catalog: MAKHEX items and prices, never upstream links,
// supplier identifiers, raw costs, credentials, or fulfillment route details.
export const prerender=true;
export const GET:APIRoute=()=>{
  const data={
    schema:'makhex-catalog-v3',
    lastUpdated:catalogSnapshotDate,
    store:'MAKHEX',
    currency:'USD',
    shipping:{country:'US',customerRateUsd:0,method:'Free U.S. Shipping'},
    checkoutAvailable:false,
    // These are planning-only kit constituents; no validated standalone AliExpress SKUs.
    researchSubcomponents:mosaicoAssemblyParts.map(part=>({slug:part.slug,title:part.title,variants:[],image:part.image,url:'https://makhex.com/projects/mosaico-learning-assistant/',availability:'RESEARCH_ONLY',includedInBundle:part.includedInVisionCombo})),
    projectAlternativePlans:{'mosaico-learning-assistant':mosaicoCommercePlans.separate},
    components:products.map(product=>{
      const stage=stageFor(product.slug);
      // Newly discovered products have no verified retail price or exact supplier option.
      return {
        slug:product.slug,title:stage?.supplierModel??product.title,
        url:'https://makhex.com/shop/'+product.slug+'/',
        variants:stage?.variants.map(v=>({title:v.title,priceUsd:v.plannedRetailUsd}))??[],
        availability:'COMING_SOON',
        hardwareReview:stage?.technicalGate??'HOLD',
      };
    }),
    projects:projectsNewestFirst.map(project=>{
      const parts=project.materials.map(m=>{
        const v=plannedVariantForProject(m.slug,project.slug);
        return {slug:m.slug,qty:m.qty,selectedOption:v?.title??null,unitPriceUsd:v?.plannedRetailUsd??null,
          lineTotalUsd:v?Math.round(v.plannedRetailUsd*m.qty*100)/100:null};
      });
      return {
        slug:project.slug,title:project.title,
        url:'https://makhex.com/projects/'+project.slug+'/',
        parts,
        partsSubtotalUsd:parts.every(p=>p.lineTotalUsd!==null)?Math.round(parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100:null,
        outstandingParts:projectBomMissingParts[project.slug]??[],
        ...(project.slug==='mosaico-learning-assistant'?{cartPlan:mosaicoCommercePlans.bundle}:{}),
      };
    }),
  };
  return new Response(JSON.stringify(data,null,2),{
    headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
  });
};
