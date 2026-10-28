import type {APIRoute} from 'astro';
import {projectsNewestFirst} from '../lib/catalog';
import {products} from '../data/products';
import {mosaicoAssemblyParts,mosaicoCommercePlans} from '../data/mosaico-bom';
import {catalogSnapshotDate,stageFor,plannedVariantForProject,projectBomMissingParts} from '../data/catalog-staging';
import {supplierFor,offersFor} from '../data/supplier-matches';
import {microduckPriceObservedAt,microduckRetailCautions} from '../data/microduck-price-plans';
import {isMakhexAliExpress,preferredExternalOffer} from '../data/sourcing-policy';

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
    externalCheckoutMode:'DIRECT_FOR_NON_ALIEXPRESS',
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
      const isAli=isMakhexAliExpress(product.slug);
      const stage=isAli?stageFor(product.slug):undefined;
      const external=isAli?undefined:preferredExternalOffer(product.slug);
      const match=supplierFor(product.slug);
      return {
        slug:product.slug,title:stage?.supplierModel??product.title,
        url:'https://makhex.com/shop/'+product.slug+'/',
        variants:stage?.variants.map(v=>({title:v.title,priceUsd:v.plannedRetailUsd}))??[],
        priceStatus:isAli?'MAKHEX_PRICE_REVIEW':'EXTERNAL_SELLER',
        fulfillmentMode:isAli?'MAKHEX_OWNER_REVIEW':'EXTERNAL_VENDOR',
        directSupplierLink:external?.url??null,
        supplierPriceReviewDate:isAli?microduckPriceObservedAt:null,
        sourcingNote:microduckRetailCautions[product.slug]??null,
        availability:isAli?'COMING_SOON':'EXTERNAL_REFERENCE',
        hardwareReview:stage?.technicalGate??'HOLD',
        exactRequirements:match?.required??null,
        supplierCaution:match?.notes??null,
        buyingOptions:match?.offers.map(({seller,label,url,match,note,project})=>({seller,label,url,match,note,...(project?{project}:{})}))??[]
      };
    }),
    projects:projectsNewestFirst.map(project=>{
      const parts=project.materials.map(m=>{
        const isAli=isMakhexAliExpress(m.slug);
        const v=isAli?plannedVariantForProject(m.slug,project.slug):undefined;
        return {
          slug:m.slug,qty:m.qty,sourceMode:isAli?'MAKHEX_CART':'EXTERNAL_LINK',directSupplierLink:isAli?null:preferredExternalOffer(m.slug,project.slug)?.url??null,selectedOption:v?.title??null,unitPriceUsd:v?.plannedRetailUsd??null,
          lineTotalUsd:v?Math.round(v.plannedRetailUsd*m.qty*100)/100:null,
          buyingOptions:offersFor(m.slug,project.slug).map(({seller,label,url,match,note})=>({seller,label,url,match,note}))
        };
      });
      return {
        slug:project.slug,title:project.title,
        url:'https://makhex.com/projects/'+project.slug+'/',
        parts,
        partsSubtotalUsd:Math.round(parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100,
        externalPartTypes:parts.filter(p=>p.sourceMode==='EXTERNAL_LINK').length,
        outstandingParts:projectBomMissingParts[project.slug]??[],
        ...(project.slug==='mosaico-learning-assistant'?{cartPlan:{...mosaicoCommercePlans.bundle,parts:mosaicoCommercePlans.bundle.parts.map(part=>({...part,option:plannedVariantForProject(part.slug,project.slug)?.title??part.option}))}}:{})
      };
    })
  };
  return new Response(JSON.stringify(data,null,2),{
    headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
  });
};