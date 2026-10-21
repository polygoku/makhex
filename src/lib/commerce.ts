import type {Product} from '../data/products';
import {checkoutApprovals} from '../data/checkout-approvals';

export type CommerceState = {kind:'unavailable';reason:string}|{kind:'ready';url:string};
const rawBase = (import.meta.env.PUBLIC_SQUARESPACE_SHOP_URL||'').trim();
const allowHosts = (import.meta.env.PUBLIC_SQUARESPACE_ALLOWED_HOSTS||'').split(',').map((s:string)=>s.trim().toLowerCase()).filter(Boolean);

export function commerceState(product:Product):CommerceState{
  if(product.status!=='Qualified')return {kind:'unavailable',reason:'Exact product and supplier qualification pending.'};
  const approved=checkoutApprovals[product.slug];
  if(!approved||approved.provider!=='squarespace'||approved.supplierVariantVerified!==true||
    approved.shippingAndReturnsVerified!==true||approved.checkoutAndFulfillmentTested!==true||
    !approved.merchantSku||!Number.isFinite(Date.parse(approved.checkedAt))||
    !/^https:\/\/github\.com\/polygoku\/makhex\/(?:issues|pull)\/\d+$/.test(approved.evidenceIssueUrl))
    return {kind:'unavailable',reason:'Documented supplier, fulfillment and checkout approval pending.'};
  if(!product.storePath||approved.publicPath!==product.storePath)return {kind:'unavailable',reason:'Approved Squarespace product URL not mapped.'};
  if(!rawBase)return {kind:'unavailable',reason:'Storefront base URL not configured.'};
  try {
    const base=new URL(rawBase);
    if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||base.pathname!=='/')
      return {kind:'unavailable',reason:'Invalid Squarespace storefront URL.'};
    if(!allowHosts.includes(base.hostname.toLowerCase()))return {kind:'unavailable',reason:'Squarespace hostname not allowlisted.'};
    const path=product.storePath.replace(/^\/+/, '');
    if(!/^(?:product\/[a-z0-9-]+|(?:[a-z0-9-]+\/)?p\/[a-z0-9-]+)\/?$/i.test(path))return {kind:'unavailable',reason:'Unverified product URL format.'};
    return {kind:'ready',url:new URL('/'+path,base.origin).href};
  }catch{return {kind:'unavailable',reason:'Invalid store URL.'}}
}
