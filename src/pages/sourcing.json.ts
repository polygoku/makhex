import type {APIRoute} from 'astro';
import {projectsNewestFirst} from '../lib/catalog';
import {products} from '../data/products';
import {mosaicoAssemblyParts,mosaicoCommercePlans} from '../data/mosaico-bom';
import {catalogSnapshotDate,stageFor,plannedVariantForProject,projectBomMissingParts} from '../data/catalog-staging';
import {supplierFor,offersFor} from '../data/supplier-matches';
import {microduckPriceObservedAt,microduckRetailCautions} from '../data/microduck-price-plans';
import {isMakhexAliExpress,isMakhexQuoteOnly} from '../data/sourcing-policy';

// Public buyer comparison links are separate from private supplier order credentials.
// An external link does NOT establish MAKHEX fulfillment or in-stock checkout.
export const prerender=true;
export const GET:APIRoute=()=>{
  const data={
    schema:'makhex-catalog-v4',
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
      priceStatus:'MAKHEX_QUOTE_REQUIRED',availability:'QUALIFICATION_PENDING',
      qualificationStatus:'ENGINEERING_HOLD',qualificationNote:'Mosaico component revision and quote require owner approval before payment.',
      url:'https://makhex.com/projects/mosaico-learning-assistant/',
      includedInBundle:part.includedInVisionCombo,
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
      // Supplier procurement is backstage; buyer checkout always starts with MAKHEX.
      const match=supplierFor(product.slug);
      return {
        slug:product.slug,title:stage?.supplierModel??product.title,
        url:'https://makhex.com/shop/'+product.slug+'/',
        variants:stage?.variants.map(v=>({title:v.title,priceUsd:v.plannedRetailUsd}))??[],
        priceStatus:stage?.variants.length?'MAKHEX_PRICE_REVIEW':'MAKHEX_QUOTE_REQUIRED',
        fulfillmentMode:'MAKHEX_OWNER_REVIEW',
        directSupplierLink:null, // Supplier references remain optional details; MAKHEX is first-party seller.
        supplierPriceReviewDate:isAli&&!isMakhexQuoteOnly(product.slug)?microduckPriceObservedAt:null,
        sourcingNote:microduckRetailCautions[product.slug]??null,
        availability:'QUALIFICATION_PENDING',
        qualificationStatus:stage?.technicalGate==='HOLD'?'ENGINEERING_HOLD':(stage?.variants.length?'SUPPLIER_REVIEW':'QUOTE_REQUIRED'),
        qualificationNote:stage?.technicalGate==='HOLD'?'Engineering review required before payment.':(stage?.variants.length?'Supplier variant, U.S. shipping and fulfillment require approval before payment.':'MAKHEX must confirm compatible source, price and U.S. shipping before payment.'),
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
          slug:m.slug,qty:m.qty,sourceMode:'MAKHEX_REQUEST',directSupplierLink:null,selectedOption:v?.title??null,unitPriceUsd:v?.plannedRetailUsd??null,
          lineTotalUsd:v?Math.round(v.plannedRetailUsd*m.qty*100)/100:null,
          buyingOptions:offersFor(m.slug,project.slug).map(({seller,label,url,match,note})=>({seller,label,url,match,note}))
        };
      });
      return {
        slug:project.slug,title:project.title,
        url:'https://makhex.com/projects/'+project.slug+'/',
        parts,
        partsSubtotalUsd:Math.round(parts.reduce((n,p)=>n+(p.lineTotalUsd??0),0)*100)/100,
        externalPartTypes:0,
        quoteRequiredPartTypes:parts.filter(p=>p.unitPriceUsd===null).length,
        outstandingParts:projectBomMissingParts[project.slug]??[],
        ...(project.slug==='mosaico-learning-assistant'?{cartPlan:{...mosaicoCommercePlans.bundle,parts:mosaicoCommercePlans.bundle.parts.map(part=>({...part,option:plannedVariantForProject(part.slug,project.slug)?.title??part.option}))}}:{})
      };
    })
  };
  return new Response(JSON.stringify(data,null,2),{
    headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
  });
};