// MAKHEX maker-project research references, not sellable inventory.
// Supplier candidates from the owner's authorized AliExpress product-detail API
// reads on 2026-10-22. Exact supplier variation IDs and costs are private.
// Do not interpret a source link as merchant orderability or MAKHEX checkout.
export type SourcingGate = 'REVIEW' | 'HOLD';
export interface SupplierResearch {
  itemId: string;
  url: string;
  selectedFormat: string;
  gate: SourcingGate;
  caution: string;
  projectOptions?: Record<string,string>;
}
export const sourcingReviewedAt = '2026-10-22';
export const supplierResearch: Record<string,SupplierResearch> = {
  'esp32-s3-devkit': {
    itemId:'3256803793464226', url:'https://www.aliexpress.com/item/3256803793464226.html',
    selectedFormat:'ESP32-S3 DevKitC-1 N8R8', gate:'REVIEW',
    caution:'Already imported hidden. Verify board revision, ESP-SR memory and GPIO/audio compatibility.'
  },
  'esp32-c3-supermini': {
    itemId:'1005010676427148', url:'https://www.aliexpress.com/item/1005010676427148.html',
    selectedFormat:'ESP32-C3 SuperMini soldered', gate:'REVIEW',
    caution:'Confirm 4MB flash, soldered pinout, bootstrapping and regulator.'
  },
  'esp32-c6-devkit': {
    itemId:'1005005087160183', url:'https://www.aliexpress.com/item/1005005087160183.html',
    selectedFormat:'ESP32-C6 DevKitC-1 N8', gate:'REVIEW',
    caution:'Standalone catalog research item; not currently used in the 10 project BOMs. Earlier N4 trial is excluded.'
  },
  'esp32-s3-touch-35': {
    itemId:'1005012486756480', url:'https://www.aliexpress.com/item/1005012486756480.html',
    selectedFormat:'ESP32-S3 3.5-inch touch display', gate:'REVIEW',
    caution:'Check resolution, touch controller, panel driver and ESP32-S3 pin map.'
  },
  'esp32-s3-camera': {
    itemId:'1005007652717681', url:'https://www.aliexpress.com/item/1005007652717681.html',
    selectedFormat:'ESP32-S3 camera kit, one unit', gate:'HOLD',
    caution:'Kit contents, OV2640 camera module and PSRAM support are unverified.'
  },
  'i2s-mems-mic': {
    itemId:'1005009183279052', url:'https://www.aliexpress.com/item/1005009183279052.html',
    selectedFormat:'INMP441 microphone with soldered pins', gate:'REVIEW',
    caution:'Verify INMP441 identity, supply, SEL and I²S pinout.'
  },
  'i2s-amplifier': {
    itemId:'1005012900699543', url:'https://www.aliexpress.com/item/1005012900699543.html',
    selectedFormat:'MAX98357A I²S amplifier, one set', gate:'REVIEW',
    caution:'Verify amplifier IC, speaker impedance and whether an actual speaker is included.'
  },
  'bme280-sensor': {
    itemId:'1005001827244148', url:'https://www.aliexpress.com/item/1005001827244148.html',
    selectedFormat:'BME280 3.3V', gate:'REVIEW',
    caution:'Confirm BME280 not BMP280 and correct sensor bus voltage.'
  },
  'sgp40-voc': {
    itemId:'1005010268049095', url:'https://www.aliexpress.com/item/1005010268049095.html',
    selectedFormat:'SGP40, not SGP41', gate:'REVIEW',
    caution:'Verify actual SGP40 breakout, power requirements and humidity compensation.'
  },
  'epaper-29': {
    itemId:'1005012759142272', url:'https://www.aliexpress.com/item/1005012759142272.html',
    selectedFormat:'2.9-inch e-paper SPI, package 1', gate:'HOLD',
    caution:'Exact controller, resolution, voltage and partial-refresh compatibility are not confirmed.'
  },
  'ws2812-leds': {
    itemId:'1005003043547774', url:'https://www.aliexpress.com/item/1005003043547774.html',
    selectedFormat:'WS2812B RGB matrix or LED ring', gate:'REVIEW',
    caution:'Power budget, 5V supply and logic-level interface must be verified.',
    projectOptions: {'rgb-matrix-clock':'8×8 WS2812 matrix', 'smart-desk-button':'8-LED WS2812 status ring'}
  },
  'usb-c-power-kit': {
    itemId:'1005008875945838', url:'https://www.aliexpress.com/item/1005008875945838.html',
    selectedFormat:'KEYESTUDIO USB-C 830-hole breadboard kit', gate:'HOLD',
    caution:'Module output and protection unverified; not a validated 5V power supply for an LED matrix.'
  }
};
