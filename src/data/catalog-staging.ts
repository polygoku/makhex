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
  'esp32-s3-devkit':{supplierModel:'ESP32-S3 DevKitC-1 N8R8',variants:[{title:'N8R8 · 8 MB flash + 8 MB PSRAM',plannedRetailUsd:55.00}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c3-supermini':{supplierModel:'ESP32-C3 SuperMini',variants:[{title:'Pre-soldered pin version',plannedRetailUsd:10.98}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-c6-devkit':{supplierModel:'ESP32-C6 DevKitC-1 N8',variants:[{title:'N8 · 8 MB flash',plannedRetailUsd:31.25}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-touch-35':{supplierModel:'ESP32-S3 3.5-inch Touch Board',variants:[{title:'ESP32-S3 version · exact LCD driver to confirm',plannedRetailUsd:69.23}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'esp32-s3-camera':{supplierModel:'ESP32-S3 Camera Kit',variants:[{title:'1-piece kit · camera/PSRAM not verified',plannedRetailUsd:54.73}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-mems-mic':{supplierModel:'INMP441 I²S Microphone Module',variants:[{title:'Soldered pin headers',plannedRetailUsd:11.38}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'i2s-amplifier':{supplierModel:'MAX98357A I²S Amplifier Module',variants:[{title:'1 set · speaker not guaranteed',plannedRetailUsd:17.63}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'bme280-sensor':{supplierModel:'BME280 Sensor Breakout',variants:[{title:'3.3 V breakout · verify humidity chip',plannedRetailUsd:11.08}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'sgp40-voc':{supplierModel:'SGP40 VOC Breakout',variants:[{title:'SGP40 sensor option',plannedRetailUsd:37.63}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'epaper-29':{supplierModel:'2.9-inch SPI E-Paper Display',variants:[{title:'Package 1 · driver to confirm',plannedRetailUsd:47.08}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
  'ws2812-leds':{supplierModel:'WS2812B Programmable LEDs',variants:[{title:'8×8 RGB LED matrix',plannedRetailUsd:14.55},{title:'8-LED white ring',plannedRetailUsd:5.10}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false},
  'usb-c-power-kit':{supplierModel:'USB-C 830-hole Breadboard Kit',variants:[{title:'830-hole breadboard kit · output unverified',plannedRetailUsd:16.38}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false}
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
 'voice-command-node':['Confirm amplifier and speaker impedance, output wattage, terminal wiring and enclosure fit before kit qualification.'],
 'smart-desk-button':['Input pull-up/pull-down configuration, safe GPIO pin, resistor and enclosure mounting are not yet qualified.'],
 'rgb-matrix-clock':['Confirm UL/ETL-listed U.S.-plug supply, correct 5.5 × 2.1 mm barrel-to-terminal connection, fuse and logic level shifting. The exact adapter remains unqualified.'],
 'microduck-robot':['Original parts and photos support component research, but no exact supplier variant, U.S. ZIP 11021 checkout or fulfillment order has been qualified.','Custom HAT/IMU fabrication, pinout, PCB assembly and firmware require source-revision matching.','The optional 623ZZ roller configuration is not part of the standard walking-foot BOM.'],
 'mosaico-learning-assistant':['Commercial rights to the original PolyForm Noncommercial application are not included.','English-localized firmware and U.S.-hosted compatible cloud model are not verified.','Original firmware only supports legacy Recovery ABI 1 / layout 4; it is incompatible with Vibe Mode 0.2 / ABI 2.','Confirm exact U.S.-shippable Vision Combo Kit variant, freight, taxes, source stock and orderability.']
};
