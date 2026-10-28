import type {APIRoute} from 'astro';
import {projectsNewestFirst} from '../lib/catalog';
import {products} from '../data/products';
import {mosaicoAssemblyParts,mosaicoCommercePlans} from '../data/mosaico-bom';
import {catalogSnapshotDate,stageFor,plannedVariantForProject,projectBomMissingParts} from '../data/catalog-staging';
import {supplierFor,offersFor} from '../data/supplier-matches';
import {microduckPricePlans,microduckPriceObservedAt,microduckRetailCautions,originalMakerEstimateSlugs} from '../data/microduck-price-plans';

// Public buyer comparison links are separate from private supplier order credentials.
// An external link does NOT establish MAKHEX fulfillment or in-stock checkout.
export const prerender=true;
export const GET:APIRoute=()=>{
  const data={
    schema:'makhex-catalog-v3',
    lastUpdated:microduckPriceObservedAt,
    squarespacePriceSnapshotDate:catalogSnapshotDate,
    store:'MAKHEX',
    currency:'USD',
    shipping:{country:'US',customerRateUsd:0,method:'Free U.S. Shipping'},
    checkoutAvailable:false,
    checkoutRequestAvailable:true,
    paymentCaptureEnabled:false,
    exceptionApprovalRequired:true,
    externalCheckoutMode:'LAST_RESORT_ONLY',
    researchSubcomponents:mosaicoAssemblyParts.map(part=>({
      slug:part.slug,title:part.title,variants:[],image:part.image,
      url:'https://makhex.com/projects/mosaico-learning-assistant/',
      availability:'RESEARCH_ONLY',includedInBundle:part.includedInVisionCombo,
      buyingOptions:[{
        seller:'ESP-Mosaico official',
        label:part.includedInVisionCombo?'Vision Combo Kit includes this module':'Compare data-capable USB-C cable',
        url:part.includedInVisionCombo?'https://store.mosaico.ai/products/esp-mosaico':'https://www.adafruit.com/category/112',
        match:'SELECT_VARIANT',
        note:part.includedInVisionCombo?'Select Core/camera/interaction revision. Bundle; not necessarily standalone.':'Select a data-capable cable and check the host connector.'
      }]
    })),
    projectAlternativePlans:{'mosaico-learning-assistant':mosaicoCommercePlans.separate},
    components:products.map(product=>{
      const stage=stageFor(product.slug);
      const match=supplierFor(product.slug);
      return {
        slug:product.slug,title:stage?.supplierModel??product.title,
        url:'https://makhex.com/shop/'+product.slug+'/',
        variants:stage?.variants.map(v=>({title:v.title,priceUsd:v.plannedRetailUsd}))??[],
        priceStatus:product.slug==='microduck-printed-parts'?'FREE_DIGITAL_MODEL':originalMakerEstimateSlugs.has(product.slug)?'MAKER_HISTORICAL_2_5X_ESTIMATE':stage?(microduckPricePlans[product.slug]?'ALIEXPRESS_VARIANT_PLANNING':'MERCHANT_PLANNING'):'COMPARE_EXTERNAL_SELLERS',
        fulfillmentMode:product.slug==='microduck-printed-parts'?'MEMBER_FILE_DOWNLOAD':'OWNER_APPROVAL_BEFORE_PAYMENT',
        supplierPriceReviewDate:microduckPricePlans[product.slug]?microduckPriceObservedAt:null,
        sourcingNote:microduckRetailCautions[product.slug]??null,
        availability:product.slug==='microduck-printed-parts'?'DIGITAL_DOWNLOAD':'COMING_SOON',
        hardwareReview:stage?.technicalGate??'HOLD',
        exactRequirements:match?.required??null,
        supplierCaution:match?.notes??null,
        buyingOptions:match?.offers.map(({seller,label,url,match,note,project})=>({seller,label,url,match,note,...(project?{project}:{})}))??[]
      };
    }),
    projects:projectsNewestFirst.map(project=>{
      const parts=project.materials.map(m=>{
        const v=plannedVariantForProject(m.slug,project.slug);
        return {
          slug:m.slug,qty:m.qty,selectedOption:v?.title??null,unitPriceUsd:v?.plannedRetailUsd??null,
          lineTotalUsd:v?Math.round(v.plannedRetailUsd*m.qty*100)/100:null,
          buyingOptions:offersFor(m.slug,project.slug).map(({seller,label,url,match,note})=>({seller,label,url,match,note}))
        };
      });
      return {
        slug:project.slug,title:project.title,
        url:'https://makhex.com/projects/'+project.slug+'/',
        parts,
        partsSubtotalUsd:parts.every(p=>p.lineTotalUsd!==null)?Math.round(parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100:null,
        outstandingParts:projectBomMissingParts[project.slug]??[],
        ...(project.slug==='mosaico-learning-assistant'?{cartPlan:{...mosaicoCommercePlans.bundle,parts:mosaicoCommercePlans.bundle.parts.map(part=>({...part,option:plannedVariantForProject(part.slug,project.slug)?.title??part.option}))}}:{})
      };
    })
  };
  return new Response(JSON.stringify(data,null,2),{
    headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
  });
};