/**
 * MAKHEX customer-facing retail PLANS for exact Microduck AliExpress variants
 * inspected in the United States storefront on 2026-10-28.
 *
 * Prices apply the owner's 2.5x rule to conservative normal supplier offers
 * and available shipping observations, with supplier LOTs normalized against
 * the quantity in Microduck's source BOM.
 * These are not live supplier cart totals or checked-out U.S. ZIP quotes.
 * NO wholesale price, private supplier SKU, or access token belongs here.
 * All seven remain on HOLD until sourcing exceptions and the final
 * Squarespace-hosted MAKHEX payment amount are approved.
 */
import type {CatalogStage} from './catalog-staging.ts';
export const microduckPriceObservedAt='2026-10-28' as const;
export const microduckPricePlans:Readonly<Record<string,CatalogStage>>={
 'feetech-hd1910':{
  supplierModel:'Feetech HD-1910-C001 TTL Serial Bus Servo',
  variants:[{title:'HD-1910-C001 · single servo (Microduck bundle of 15)',plannedRetailUsd:71.53}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'imx219-160-camera':{
  supplierModel:'IMX219 160° Wide-Angle Camera Module',
  variants:[{title:'IMX219 8 MP · 160° lens · 22-pin cable review',plannedRetailUsd:21.88}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'vl53l5cx-v2':{
  supplierModel:'VL53L5CX V2 8×8 Time-of-Flight Sensor',
  variants:[{title:'VL53L5X V2 · I2C ToF module',plannedRetailUsd:50.00}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'npf550-power-kit':{
  supplierModel:'NP-F550 Two Batteries + LCD Dual Charger Kit',
  variants:[{title:'2 × NP-F550 2600 mAh + LCD dual charger',plannedRetailUsd:71.78}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'bearing-6700':{
  supplierModel:'6700 Open Thin-Wall Bearing 10×15×3 mm',
  variants:[{title:'6700 open 10×15×3 mm · per bearing (5-piece build)',plannedRetailUsd:7.44}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'bearing-et2216':{
  supplierModel:'ET2216ZZ Shielded Bearing 16×22×4 mm',
  variants:[{title:'ET2216ZZ 16×22×4 mm · per bearing (12-piece build)',plannedRetailUsd:12.50}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 },
 'bearing-623zz':{
  supplierModel:'623ZZ Shielded Mini Bearing 3×10×4 mm',
  variants:[{title:'623ZZ 3×10×4 mm · per bearing (8-piece optional roller)',plannedRetailUsd:9.37}],
  technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false
 }
} as const;
export const microduckRetailCautions:Readonly<Record<string,string>>={
 'feetech-hd1910':'The per-servo price assumes 15 motors purchased as one 15-piece supplier lot. A smaller order requires separate sourcing approval.',
 'imx219-160-camera':'The selected supplier camera option must be 160 Degree, not the cheaper default 77 Degree. Camera FPC orientation and Radxa compatibility remain under review.',
 'vl53l5cx-v2':'The VL53L5X V2 board was checked with a supplier shipping indication; the complete current landed quote and payment pilot still require review.',
 'npf550-power-kit':'The selected supplier battery kit must be 2Pcs set, not the default 1Pc. Lithium battery shipping and return terms need final verification.',
 'bearing-6700':'Supplier sells a 10-piece 6700 open lot; the planned per-unit retail assumes Microduck needs five. Smaller quantities need repricing.',
 'bearing-et2216':'The former exact supplier variant is out of stock. The alternative is a 10-piece ET2216ZZ lot; two lots are required to supply the 12-piece Microduck build.',
 'bearing-623zz':'Optional roller only. The supplier sells ten 623ZZ bearings; the 8-unit kit retail allocates the lot. Do not substitute default 683ZZ.'
} as const;
export const supplierVariantPhotoSlugs=new Set(Object.keys(microduckPricePlans));
