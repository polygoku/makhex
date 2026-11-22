import {stageFor} from '../data/catalog-staging';
import {isMakhexAliExpress} from '../data/sourcing-policy';
import {checkoutApprovals} from '../data/checkout-approvals';
import type {Project} from '../data/projects';

export type QualificationStatus='ENGINEERING_HOLD'|'SUPPLIER_REVIEW'|'QUOTE_REQUIRED'|'PAYMENT_READY';
export interface Qualification{
  status:QualificationStatus;
  label:string;
  note:string;
  payable:boolean;
}
/** Independent dated verification is required for every paid item. A catalog price is not such verification. */
export function partQualification(slug:string):Qualification{
  const stage=stageFor(slug);
  const approval=checkoutApprovals[slug];
  if(approval?.supplierVariantVerified===true&&approval.shippingAndReturnsVerified===true&&approval.checkoutAndFulfillmentTested===true)
    return {status:'PAYMENT_READY',label:'Checkout verified',note:'Approved supplier, shipping and fulfillment evidence recorded.',payable:true};
  if(stage?.technicalGate==='HOLD'||['microduck-hat','microduck-imu','m5stack-atomic-motion-v12','radxa-zero-3w'].includes(slug))
    return {status:'ENGINEERING_HOLD',label:'Engineering hold',note:'Hardware revision, compatibility or supply must be reviewed before payment.',payable:false};
  if(isMakhexAliExpress(slug)&&stage?.variants.length)
    return {status:'SUPPLIER_REVIEW',label:'Supplier review',note:'Planning price only. Variant, U.S. shipping and fulfillment are not checkout-verified.',payable:false};
  return {status:'QUOTE_REQUIRED',label:'Quote required',note:'MAKHEX will locate a compatible supply and confirm an approved price before payment.',payable:false};
}
export function projectQualification(project:Project){
  const parts=project.materials.map(part=>partQualification(part.slug));
  return {
    total:parts.length,
    payable:parts.filter(part=>part.payable).length,
    holds:parts.filter(part=>part.status==='ENGINEERING_HOLD').length,
    quotes:parts.filter(part=>part.status==='QUOTE_REQUIRED').length,
    supplierReview:parts.filter(part=>part.status==='SUPPLIER_REVIEW').length,
    requestable:true
  };
}
