import {microduckPricePlans} from './microduck-price-plans.ts';
import {offersFor, type SupplierOffer} from './supplier-matches.ts';
/** Existing source-matched AliExpress options and separately reviewed quote-only orders. */
export const MAKHEX_ALIEXPRESS_MARKUP=1.20 as const;
// Research-only Build 13 components enter MAKHEX first-party ORDER REQUESTS.
 // No supplier is treated as verified and no card is charged. This is not an AliExpress match.
export const makhexQuoteOnlySlugs:ReadonlySet<string>=new Set([
 'benewake-nova20-lidar','esp32-wroom32-devkit','ssd1306-oled-096',
 'nova20-5pin-harness','regulated-5v-2a-proto-kit',
 'vl53l5cx-tof-8x8','nova20-capacitor-kit','dupont-jumper-20cm-kit'
]);
export const isMakhexQuoteOnly=(slug:string)=>makhexQuoteOnlySlugs.has(slug);
// Legacy helper name retained for checkout compatibility; also accepts quote-only parts.
export const isMakhexAliExpress=(slug:string)=>Object.prototype.hasOwnProperty.call(microduckPricePlans,slug);
export const isMakhexRequestEligible=(slug:string)=>isMakhexAliExpress(slug)||isMakhexQuoteOnly(slug);
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
