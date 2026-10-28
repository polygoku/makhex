import {microduckPricePlans} from './microduck-price-plans.ts';
import {offersFor, type SupplierOffer} from './supplier-matches.ts';
/** Only a variant sourced from a selected AliExpress offer can enter MAKHEX checkout. */
export const MAKHEX_ALIEXPRESS_MARKUP=1.20 as const;
export const isMakhexAliExpress=(slug:string)=>Object.prototype.hasOwnProperty.call(microduckPricePlans,slug);
const notProduct=(o:SupplierOffer)=>!/(?:github\.com|jlcpcb\.com|pcbway\.com|learn\.adafruit\.com)/i.test(new URL(o.url).hostname);
/** For all other items, link directly to a real retailer with no MAKHEX price or cart. */
export function preferredExternalOffer(slug:string,project?:string):SupplierOffer|undefined{
 const options=offersFor(slug,project).filter(notProduct);
 if(slug==='microduck-fasteners')return options.find(o=>o.seller.includes('Taobao'))??options[0];
 // No seller offers a verified complete three-material wiring kit. Link to the original
 // BOM, which supplies separate purchase links for 3-core wire, black wire and shrink.
 // Sending buyers directly to the Taobao shrink listing would silently omit two parts.
 if(slug==='microduck-wiring-kit')return offersFor(slug,project).find(o=>o.seller==='Original maker BOM')??options[0];
 return options.find(o=>!new URL(o.url).hostname.includes('aliexpress'))??options[0];
}
