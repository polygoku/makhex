/**
 * Retail *planning* snapshot from owner-verified Squarespace CSV export,
 * 2026-10-22. NOT an offer of sale or verified delivered price.
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
export const catalogSnapshotDate='2026-10-22';
export const catalogStaging:Readonly<Record<string,CatalogStage>>={
  'esp32-s3-devkit':{supplierModel:'ESP32-S3 DevKitC-1 N8R8',variants:[{title:'N8R8 · 8 MB flash + 8 MB PSRAM',plannedRetailUsd:37.40}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c3-supermini':{supplierModel:'ESP32-C3 SuperMini',variants:[{title:'Pre-soldered pin version',plannedRetailUsd:7.46}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c6-devkit':{supplierModel:'ESP32-C6 DevKitC-1 N8',variants:[{title:'N8 · 8 MB flash',plannedRetailUsd:21.25}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-touch-35':{supplierModel:'ESP32-S3 3.5-inch Touch Board',variants:[{title:'ESP32-S3 version · exact LCD driver to confirm',plannedRetailUsd:47.07}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-camera':{supplierModel:'ESP32-S3 Camera Kit',variants:[{title:'1-piece kit · camera/PSRAM not verified',plannedRetailUsd:37.21}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-mems-mic':{supplierModel:'INMP441 I²S Microphone Module',variants:[{title:'Soldered pin headers',plannedRetailUsd:7.74}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-amplifier':{supplierModel:'MAX98357A I²S Amplifier Module',variants:[{title:'1 set · speaker not guaranteed',plannedRetailUsd:11.99}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'bme280-sensor':{supplierModel:'BME280 Sensor Breakout',variants:[{title:'3.3 V breakout · verify humidity chip',plannedRetailUsd:7.53}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'sgp40-voc':{supplierModel:'SGP40 VOC Breakout',variants:[{title:'SGP40 sensor option',plannedRetailUsd:25.59}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'epaper-29':{supplierModel:'2.9-inch SPI E-Paper Display',variants:[{title:'Package 1 · driver to confirm',plannedRetailUsd:32.01}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'ws2812-leds':{supplierModel:'WS2812B Programmable LEDs',variants:[{title:'8×8 RGB LED matrix',plannedRetailUsd:9.89},{title:'8-LED white ring',plannedRetailUsd:3.47}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'usb-c-power-kit':{supplierModel:'USB-C 830-hole Breadboard Kit',variants:[{title:'830-hole breadboard kit · output unverified',plannedRetailUsd:11.14}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false}
} as const;
export const formatUsd=(amount:number):string=>'$'+amount.toFixed(2);
export function stageFor(slug:string):CatalogStage|undefined{return catalogStaging[slug]}
export function plannedVariantForProject(slug:string,projectSlug?:string):PlannedVariant|undefined{
 const stage=stageFor(slug);
 if(!stage)return;
 if(slug==='ws2812-leds'&&projectSlug==='smart-desk-button')return stage.variants[1];
 return stage.variants[0];
}
export const projectBomMissingParts:Readonly<Record<string,readonly string[]>>={
 'voice-command-node':['A compatible physical speaker must be chosen and added to the BOM.'],
 'smart-desk-button':['A momentary pushbutton and safe pull-up/pull-down input wiring are not yet listed.'],
 'rgb-matrix-clock':['A rated 5 V supply for the LED matrix is missing; validate current draw, fuse and signal level shifting.']
};
