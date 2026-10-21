import type {Product} from '../data/products';

export type CommerceState = {kind:'unavailable';reason:string}|{kind:'ready';url:string};
const rawBase = (import.meta.env.PUBLIC_SQUARESPACE_SHOP_URL||'').trim();
const allowHosts = (import.meta.env.PUBLIC_SQUARESPACE_ALLOWED_HOSTS||'').split(',').map((s:string)=>s.trim().toLowerCase()).filter(Boolean);

export function commerceState(product:Product):CommerceState{
  if(!product.storePath)return {kind:'unavailable',reason:'Product supplier and Squarespace listing not qualified.'};
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
