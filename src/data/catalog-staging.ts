import {microduckPricePlans} from './microduck-price-plans.ts';
/**
 * Retail *planning* snapshot from owner-verified Squarespace CSV export,
 * 2026-10-25. NOT an offer of sale or verified delivered price.
 * This is intentionally public-facing metadata: NO supplier wholesale cost,
 * tokens, customer info, or exact supplier-option strings.
 */
export type TechnicalGate='REVIEW'|'HOLD';
export interface PlannedVariant{
  title:string;
  plannedRetailUsd:number;
}
export interface CatalogStage{
  supplierModel:string;
  variants:readonly PlannedVariant[];
  technicalGate:TechnicalGate;
  shippingVerified:false;
  buyerOrderabilityVerified:false;
}
export const catalogSnapshotDate='2026-10-25';
export const catalogStaging:Readonly<Record<string,CatalogStage>>={
  'esp32-s3-devkit':{supplierModel:'ESP32-S3 DevKitC-1 N8R8',variants:[{title:'N8R8 · 8 MB flash + 8 MB PSRAM',plannedRetailUsd:55}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c3-supermini':{supplierModel:'ESP32-C3 SuperMini',variants:[{title:'Pre-soldered pin version',plannedRetailUsd:10.98}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c6-devkit':{supplierModel:'ESP32-C6 DevKitC-1 N8',variants:[{title:'N8 · 8 MB flash',plannedRetailUsd:31.25}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-touch-35':{supplierModel:'ESP32-S3 3.5-inch Touch Board',variants:[{title:'ESP32-S3 version · exact LCD driver to confirm',plannedRetailUsd:69.23}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-camera':{supplierModel:'ESP32-S3 Camera Kit',variants:[{title:'1-piece kit · camera/PSRAM not verified',plannedRetailUsd:54.73}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-mems-mic':{supplierModel:'INMP441 I²S Microphone Module',variants:[{title:'Soldered pin headers',plannedRetailUsd:11.38}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-amplifier':{supplierModel:'MAX98357A I²S Amplifier Module',variants:[{title:'1 set · speaker not guaranteed',plannedRetailUsd:17.63}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'bme280-sensor':{supplierModel:'BME280 Sensor Breakout',variants:[{title:'3.3 V breakout · verify humidity chip',plannedRetailUsd:11.08}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'sgp40-voc':{supplierModel:'SGP40 VOC Breakout',variants:[{title:'SGP40 sensor option',plannedRetailUsd:37.63}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'epaper-29':{supplierModel:'2.9-inch SPI E-Paper Display',variants:[{title:'Package 1 · driver to confirm',plannedRetailUsd:47.08}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'ws2812-leds':{supplierModel:'WS2812B Programmable LEDs',variants:[{title:'8×8 RGB LED matrix',plannedRetailUsd:14.55},{title:'8-LED white ring',plannedRetailUsd:5.1}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'usb-c-power-kit':{supplierModel:'USB-C 830-hole Breadboard Kit',variants:[{title:'830-hole breadboard kit · output unverified',plannedRetailUsd:16.38}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp-mosaico-vision-combo-kit':{supplierModel:'ESP-Mosaico Vision Combo Kit',variants:[{title:'Vision Combo Kit - Core V1.2 + camera + interaction',plannedRetailUsd:201.7}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'speaker-4ohm-3w':{supplierModel:'28 mm 4 Ohm 3 W Mini Speaker',variants:[{title:'28 mm / 4 ohm / 3 W',plannedRetailUsd:6.35}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'momentary-tactile-switch':{supplierModel:'6 x 6 mm Momentary Tactile Button',variants:[{title:'4.3 mm / 4-pin - 50-piece supplier pack',plannedRetailUsd:3.55}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  '5v-5a-led-power':{supplierModel:'Waveshare 5 V 5 A US Power Adapter',variants:[{title:'US plug / 5 V 5 A / 5.5 x 2.1 mm',plannedRetailUsd:29.18}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false}
} as const;
export const formatUsd=(amount:number):string=>'$'+amount.toFixed(2);
export function stageFor(slug:string):CatalogStage|undefined{return catalogStaging[slug]??microduckPricePlans[slug]}
export function plannedVariantForProject(slug:string,projectSlug?:string):PlannedVariant|undefined{
 if(!microduckPricePlans[slug])return; // Non-AliExpress products link externally without a MAKHEX price.
 const stage=microduckPricePlans[slug];
 if(slug==='speaker-4ohm-3w'&&projectSlug==='microduck-robot')return; // 3525/HP1.25 is not the staged 28mm speaker.
 if(slug==='ws2812-leds'&&projectSlug==='smart-desk-button')return stage.variants[1];
 return stage.variants[0];
}
export const projectBomMissingParts:Readonly<Record<string,readonly string[]>>={
 'voice-command-node':['Confirm amplifier and speaker impedance, output wattage, terminal wiring and enclosure fit before kit qualification.'],
 'smart-desk-button':['Input pull-up/pull-down configuration, safe GPIO pin, resistor and enclosure mounting are not yet qualified.'],
 'rgb-matrix-clock':['Confirm UL/ETL-listed U.S.-plug supply, correct 5.5 × 2.1 mm barrel-to-terminal connection, fuse and logic level shifting. The exact adapter remains unqualified.'],
 'microduck-robot':['AliExpress prices use 20% markup on documented source cost; ZIP 11021 landed cost remains unverified; exact Radxa 2GB/no-eMMC with soldered GPIO is currently out of stock at checked U.S. vendors.','Original AMP2.0 HAT/IMU are maker-source or build-to-order candidates: verify Oct 15 revision, exact board power and FT6 IMU firmware/ID 200 at 1Mbps.','Authorized print design downloads are FREE for members, and no physical shell is shipped. Optional 623ZZ roller bearings are not included in the standard walking-foot BOM.'],
 'mosaico-learning-assistant':['Commercial rights to the original PolyForm Noncommercial application are not included.','English-localized firmware and U.S.-hosted compatible cloud model are not verified.','Original firmware only supports legacy Recovery ABI 1 / layout 4; it is incompatible with Vibe Mode 0.2 / ABI 2.','Confirm exact U.S.-shippable Vision Combo Kit variant, freight, taxes, source stock and orderability.']
};
