import { products, type Product } from '../data/products';
import { projects, type Project } from '../data/projects';
export {products,projects};
/** Display order only: newer build numbers first. Keep the canonical project data unchanged. */
export const projectsNewestFirst: readonly Project[] = [...projects].sort((a,b)=>Number(b.number)-Number(a.number));
export const productBySlug=(slug:string):Product|undefined=>products.find(p=>p.slug===slug);
export const projectBySlug=(slug:string):Project|undefined=>projects.find(p=>p.slug===slug);
export const productUrl=(slug:string)=>'/shop/'+encodeURIComponent(slug)+'/';
export const projectUrl=(slug:string)=>'/projects/'+encodeURIComponent(slug)+'/';
const shopBase=(import.meta.env.PUBLIC_SQUARESPACE_SHOP_URL||'').trim().replace(/\/+$/,'');
export function purchaseUrl(p:Product):string|null {
  if(!shopBase || !p.storePath)return null;
  try{
    const url=new URL(shopBase);
    if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash || /\/config\/?$/.test(url.pathname))return null;
    const path=p.storePath.replace(/^\/+/, '');
    if(!/^(?:product\/[a-z0-9-]+|(?:[a-z0-9-]+\/)?p\/[a-z0-9-]+)\/?$/i.test(path))return null;
    return new URL(path,url.toString()+'/').href;
  }catch{return null;}
}
