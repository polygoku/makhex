import {microduckPricePlans} from './microduck-price-plans.ts';
import {offersFor, type SupplierOffer} from './supplier-matches.ts';
/** Source-matched AliExpress items and separately documented quote-only hardware may enter MAKHEX owner-review cart. */
export const MAKHEX_ALIEXPRESS_MARKUP=1.20 as const;
// AtomDog research parts can be kept in one MAKHEX request cart without a quoted price.
// They are not yet verified AliExpress products and no payment is taken.
export const makhexQuoteOnlySlugs:ReadonlySet<string>=new Set(['m5stack-atom-lite','m5stack-atomic-motion-v12','feetech-fs90mg','usb-a-c-data-cable-1m','pla-filament-175-1kg']);
// reBot: source-identified high-power arm requests; no supplier charged or verified inventory.
export const rebotQuoteOnlySlugs:ReadonlySet<string>=new Set(["rebot-b601-dm-full-kit", "rebot-b601-rs-full-kit", "rebot-b601-dm-power-kit", "rebot-b601-rs-power-kit", "rebot-b601-dm-can-usb", "rebot-b601-rs-can-usb", "rebot-b601-mount-clamps", "rebot-b601-dm-discharge-module", "rebot-b601-rs-bleeder-module", "rebot-b601-dm-body-motor-kit", "rebot-b601-dm-body-structure-kit", "rebot-b601-dm-gripper-kit", "rebot-b601-rs-body-motor-kit", "rebot-b601-rs-body-structure-kit", "rebot-b601-rs-gripper-kit", "rebot-dm4310-v4", "rebot-dm4340p-v4", "rebot-robstride-rs00", "rebot-robstride-rs06", "rebot-b601-dm-hardware-pack", "rebot-b601-rs-hardware-pack"]);
export const isMakhexQuoteOnly=(slug:string)=>makhexQuoteOnlySlugs.has(slug)||rebotQuoteOnlySlugs.has(slug);
export const isMakhexAliExpress=(slug:string)=>Object.prototype.hasOwnProperty.call(microduckPricePlans,slug)||isMakhexQuoteOnly(slug);
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
