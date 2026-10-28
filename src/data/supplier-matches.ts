/**
 * Buyer-visible source comparison, 2026-10-27.
 * Links are public retailer/fabrication listings, NOT MAKHEX fulfillment,
 * not proof of stock, shipping, MOQ, checkout or product suitability.
 * Never store private API variants or landed supplier costs here.
 */
export type SourceMatch='EXACT_SPEC'|'SELECT_VARIANT'|'COMPATIBILITY_REVIEW'|'CUSTOM_ORDER';
export interface SupplierOffer {
  seller:string;
  label:string;
  url:string;
  match:SourceMatch;
  note:string;
  project?:string;
}
export interface SupplierMatch {
  required:string;
  notes:string;
  offers:readonly SupplierOffer[];
}
export const supplierMatches:Readonly<Record<string,SupplierMatch>>={
 'esp32-s3-devkit':{
  required:'Espressif ESP32-S3-DevKitC-1-N8R8; 8 MB flash, 8 MB PSRAM. No N8 without R8.',
  notes:'The Espressif DevKitC footprint differs from some Waveshare N8R8 clones; check actual GPIO/header pins before following a guide.',
  offers:[
   {seller:'DigiKey',label:'Espressif DevKitC-1 N8R8',url:'https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-DEVKITC-1-N8R8/15295894',match:'EXACT_SPEC',note:'Exact manufacturer part; stock may be zero. Verify current inventory.'},
   {seller:'Waveshare',label:'ESP32-S3 DEV KIT N8R8 alternative',url:'https://www.waveshare.com/product/esp32-s3-dev-kit-n8r8.htm',match:'COMPATIBILITY_REVIEW',note:'ESP32-S3 N8R8 module, but different board layout. Reconcile GPIO and dimensions.'}
  ]
 },
 'esp32-c3-supermini':{
  required:'ESP32-C3 SuperMini, 4 MB flash, 3.3 V GPIO; select pre-soldered pins for solderless builds.',
  notes:'Presoldered variant and board pinout must match the enclosure and code. The two-pack is not one board.',
  offers:[
   {seller:'DIYables',label:'C3 SuperMini presoldered 2-pack',url:'https://diyables.io/products/diyables-esp32-c3-supermini-development-board-wifi-bluetooth-le-risc-v-mcu-11-gpio-4-adc-low-power-iot-module-for-wearables-and-diy-presoldered',match:'EXACT_SPEC',note:'ESP32-C3 SuperMini with header; seller bundle contains two boards.'},
   {seller:'ShillehTek',label:'ESP32-C3 pre-soldered dev board',url:'https://shillehtek.com/products/esp32-c3-dev-board-4mb-wifi-presoldered',match:'COMPATIBILITY_REVIEW',note:'ESP32-C3 board with header; confirm SuperMini footprint.'}
  ]
 },
 'esp32-c6-devkit':{
  required:'ESP32-C6-DevKitC-1-N8, exact N8 (8 MB) — not N4.',
  notes:'The previously tested N4 supplier option cannot fulfill an N8 listing.',
  offers:[
   {seller:'DigiKey',label:'Espressif DevKitC-1-N8',url:'https://www.digikey.com/en/products/detail/espressif-systems/ESP32-C6-DEVKITC-1-N8/17728861',match:'EXACT_SPEC',note:'Manufacturer part number matched; buyer checks current stock and delivery.'},
   {seller:'Espressif',label:'DevKitC-1 official buying directory',url:'https://esp-wrover-kit.espressif.com/en/products/devKits',match:'EXACT_SPEC',note:'Manufacturer directory links to AliExpress, DigiKey and other retailers.'}
  ]
 },
 'esp32-s3-touch-35':{
  required:'ESP32-S3, 3.5-inch capacitive 320×480 touchscreen; exact LCD/touch chips and board connector layout.',
  notes:'Waveshare standard uses ST7796 and FT6336; 3.5B uses AXS15231B. They are not drop-in firmware-equivalent.',
  offers:[
   {seller:'Waveshare',label:'ESP32-S3 Touch LCD 3.5 standard',url:'https://www.waveshare.com/esp32-s3-touch-lcd-3.5.htm',match:'SELECT_VARIANT',note:'Choose without-case board; driver ST7796/FT6336. Confirm against MAKHEX firmware.'},
   {seller:'Waveshare',label:'3.5B alternative (different LCD driver)',url:'https://www.waveshare.com/esp32-s3-touch-lcd-3.5b.htm',match:'COMPATIBILITY_REVIEW',note:'QSPI AXS15231B variant; needs different display driver.'}
  ]
 },
 'esp32-s3-camera':{
  required:'ESP32-S3 MCU camera board with actual camera sensor, FPC pinout, PSRAM, and flashed firmware revision identified.',
  notes:'Generic ESP32-S3 camera products vary widely; no exact PCB/sensor combination is fixed by the MAKHEX guide.',
  offers:[
   {seller:'Freenove',label:'ESP32-S3 CAM official board choices',url:'https://freenoveonline.shop/collections/for-esp32-s3',match:'SELECT_VARIANT',note:'Select ESP32-S3 CAM board and verify included camera sensor and PSRAM.'},
   {seller:'Waveshare',label:'S3 touch 3.5 with OV5640 camera',url:'https://www.waveshare.com/esp32-s3-touch-lcd-3.5.htm',match:'COMPATIBILITY_REVIEW',note:'Different all-in-one camera/touch board; not an interchangeable kit.'}
  ]
 },
 'i2s-mems-mic':{
  required:'INMP441 digital I2S microphone breakout, 3.3 V logic; not an analog electret module.',
  notes:'The SPH0645 I2S module is similar functionality, but different chip and firmware timing.',
  offers:[
   {seller:'ShillehTek',label:'INMP441 pre-soldered I2S microphone',url:'https://shillehtek.com/products/inmp441-i2s-omnidirectional-microphone-module-with-soldering',match:'EXACT_SPEC',note:'INMP441 breakout; confirm channel-select pin and required quantity.'},
   {seller:'BerryBase',label:'INMP441 I2S breakout',url:'https://www.berry-base.com/en/inmp441-mems-omnidirectional-microphone-module-i2s-interface',match:'EXACT_SPEC',note:'INMP441 chip; verify shipping to U.S. and whether headers are fitted.'}
  ]
 },
 'i2s-amplifier':{
  required:'MAX98357A mono I2S Class D amplifier with speaker output, correct 5 V rail current and 4 Ω load.',
  notes:'Audio outputs are bridge-tied; never ground either speaker terminal.',
  offers:[
   {seller:'Adafruit',label:'MAX98357A mono I2S amplifier',url:'https://www.adafruit.com/product/3006',match:'EXACT_SPEC',note:'Matching MAX98357A; terminal block soldered, header may need soldering.'},
   {seller:'Adafruit',label:'Dual MAX98357A stereo alternative',url:'https://www.adafruit.com/product/6513',match:'COMPATIBILITY_REVIEW',note:'Stereo two-amp board; physically different and not a direct replacement.'}
  ]
 },
 'bme280-sensor':{
  required:'Bosch BME280 (temperature, pressure AND humidity), not BMP280.',
  notes:'Check chip ID 0x60 and voltage/pull-ups; BME breakout outline may differ from 3D case.',
  offers:[
   {seller:'Adafruit',label:'Genuine BME280 STEMMA QT breakout',url:'https://www.adafruit.com/product/2652',match:'EXACT_SPEC',note:'BME280 temperature, RH and pressure; larger QT PCB may change mounting.'},
   {seller:'Bosch/Adafruit',label:'BME280 engineering and pin reference',url:'https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout/pinouts',match:'COMPATIBILITY_REVIEW',note:'Pinout reference, not a retail checkout link.'}
  ]
 },
 'sgp40-voc':{
  required:'Sensirion SGP40 VOC I2C sensor, not SGP30 or CO2 sensor.',
  notes:'VOC-index algorithm requires a supported driver, warm-up and humidity compensation.',
  offers:[
   {seller:'Adafruit',label:'SGP40 VOC STEMMA QT breakout',url:'https://www.adafruit.com/product/4829',match:'EXACT_SPEC',note:'SGP40 IC; check the chosen board supplies 3.3 V logic and cabling.'},
   {seller:'Adafruit',label:'SGP40 pinout/compatibility guide',url:'https://learn.adafruit.com/adafruit-sgp40/pinouts',match:'COMPATIBILITY_REVIEW',note:'Sensor interface guide, not direct checkout.'}
  ]
 },
 'epaper-29':{
  required:'2.9-inch SPI e-paper with controller compatible with chosen firmware, B/W 296×128.',
  notes:'Waveshare full breakout vs raw display differ mechanically; validate the exact controller code.',
  offers:[
   {seller:'Waveshare',label:'2.9-inch SPI e-Paper Module',url:'https://www.waveshare.com/product/displays/e-paper/2.9inch-e-paper-module.htm',match:'EXACT_SPEC',note:'Includes controller PCB; compare dimensions with enclosure before buying.'},
   {seller:'Waveshare',label:'e-Paper module interface guide',url:'https://www.waveshare.com/wiki/2.9inch_e-Paper_Module_Manual',match:'COMPATIBILITY_REVIEW',note:'Driver/pin reference, not a checkout.'}
  ]
 },
 'ws2812-leds':{
  required:'Project 08: 8×8 / 64 WS2812B RGB matrix. Project 10: circular 8-LED WS2812B RGB ring. These are distinct seller options.',
  notes:'Do not substitute an 8-LED ring for 64-LED matrix; RGBW, APA102 and 24-LED rings are not the configured part.',
  offers:[
   {seller:'Tayda',label:'8×8 WS2812B 64-pixel matrix',url:'https://www.taydaelectronics.com/ws2812-led-5050-rgb-8x8-64bit-led-matrix-module.html',match:'EXACT_SPEC',note:'Select one WS2812B-64 panel; verify panel size and wiring.',project:'rgb-matrix-clock'},
   {seller:'LED Lighting Hut',label:'8-LED WS2812B RGB ring',url:'https://www.ledlightinghut.com/8-x-ws2812b-digital-5050-rgb-led-pixel-ring.html',match:'EXACT_SPEC',note:'8 LEDs, 28 mm outer diameter; confirm enclosure fit.',project:'smart-desk-button'},
   {seller:'PartsMine',label:'Alternative 8×8 WS2812B matrix',url:'https://partsmine.com/leds/ws2812b-8x8-rgb-led-matrix-module-64-bit-5050-addressable-new/',match:'EXACT_SPEC',note:'A second seller for 8×8; check any shipping and minimum pack.',project:'rgb-matrix-clock'}
  ]
 },
 'usb-c-power-kit':{
  required:'USB-C input 830-tie-point prototyping breadboard, 3.3/5 V rail module and jumper wires (check current and connector).',
  notes:'A 500 mA breadboard module is NOT a supply for an LED matrix, motor or 15-servo robot. Separate power supplies remain essential.',
  offers:[
   {seller:'Lonely Binary',label:'USB-C breadboard power bundle',url:'https://lonelybinary.com/en-us/products/breadboard-power-supply-kit-2x830-2x400-tie-points',match:'COMPATIBILITY_REVIEW',note:'Includes 2×830 breadboards + 4 USB-C modules but no assured jumper pack; add wires separately.'},
   {seller:'Addicore',label:'830 breadboard, power and jumpers',url:'https://www.addicore.com/products/breadboard-prototyping-addikit-breadboard-with-3-3v-5v-power-module-and-jumper-wires',match:'COMPATIBILITY_REVIEW',note:'Has jumpers but power input may NOT be USB-C; verify adapter and stock.'}
  ]
 },
 'esp-mosaico-vision-combo-kit':{
  required:'ESP-Mosaico Vision Combo Kit, ESP32-S31 Core V1.2, LEFT-H2 camera and interaction module, black.',
  notes:'Official pre-order is not evidence of MAKHEX commercial software rights or automatic supplier order fulfillment.',
  offers:[
   {seller:'ESP-Mosaico official',label:'Vision Combo Kit (select bundle)',url:'https://store.mosaico.ai/products/esp-mosaico',match:'SELECT_VARIANT',note:'Official Vision Combo Kit: Core v1.2 + Camera + Interaction; pre-order, check dispatch and U.S. shipping.'},
   {seller:'ESP-Mosaico AliExpress',label:'Official Mosaico AliExpress product',url:'https://www.aliexpress.us/item/3256812844825848.html',match:'SELECT_VARIANT',note:'Choose Vision Combo Kit and verify version, actual stock and U.S. delivery at checkout.'}
  ]
 },
 'speaker-4ohm-3w':{
  required:'Build 02 only: 28 mm diameter, 4 ohm / 3 W speaker. Never substitute Microduck 3525 cavity with 2-pin 1.25 mm connector.',
  notes:'Original 28 mm voice-node speaker. Microduck now uses the separate microduck-speaker-3525 product and $13.95 sourcing plan; no shared SKU or inherited price.',
  offers:[
   {seller:'Mouser',label:'28 mm 4 Ω 3 W Same Sky CMS-2811-44E',url:'https://www.mouser.com/en/c/electromechanical/audio-devices/speakers-transducers/?impedance=4+Ohms&power+rating=3+W',match:'SELECT_VARIANT',note:'Find CMS-2811-44E (28 mm x 11 mm) in filtered results.',project:'voice-command-node'},
  ]
 },
 'momentary-tactile-switch':{
  required:'Normally open 6×6×4.3 mm four-pin through-hole tactile switch, mechanical height exactly 4.3 mm.',
  notes:'6×6×5 mm is not the same plunger height; verify actual button travel and mounting.',
  offers:[
   {seller:'eElectronicParts',label:'6×6×4.3 mm four-pin switch pack',url:'https://www.eelectronicparts.com/products/100pcs-6x6x4-3mm-pcb-momentary-tactile-tact-push-button-switch-4-pin-dip-micro-mini',match:'EXACT_SPEC',note:'Same footprint, 4.3 mm height; sold in a multi-switch pack.'},
   {seller:'eElectronicParts',label:'6×6 assorted heights including 4.3 mm',url:'https://www.eelectronicparts.com/products/200pcs-6x6-tact-micro-switch-tactile-push-button-kit-height-4-3mm-13mm-dip-4p-mini',match:'SELECT_VARIANT',note:'Select/use the 4.3 mm switch from the assortment.'}
  ]
 },
 '5v-5a-led-power':{
  required:'Safety-certified, US-plug AC adapter, 5 V / 5 A, 5.5×2.1 mm barrel, correct polarity.',
  notes:'Need properly rated panel-to-barrel adapter, fuse and 5 V level shifter separately for WS2812 matrix power.',
  offers:[
   {seller:'Waveshare',label:'PSU-5V5A-5.5-2.1-US',url:'https://www.waveshare.com/product/psu-5v5a-5.5-2.1.htm',match:'SELECT_VARIANT',note:'Select US plug, 5 V 5 A, 5.5/2.1 barrel; verify certification/polarity with product shipped.'}
  ]
 },
 'feetech-hd1910':{
  required:'Feetech HD-1910-C001 dual-axis TTL serial-bus servo, 15 pieces for original Microduck, AMP2.0 connection.',
  notes:'Not a PWM servo or Feetech STS3215. Check bulk count, protocol and individual IDs.',
  offers:[
   {seller:'RobArmMotion',label:'HD-1910-C001 servo (per unit)',url:'https://www.robarmmotion.com/product/feetech-hd-1910-c001-coreless-ttl-servo-for-microduck-robotics/',match:'EXACT_SPEC',note:'Select HD-1910-C001 Motor; order quantity 15; URT2 board is not a servo.'},
   {seller:'TorqueMicro',label:'Feetech HD-1910-C001 alternative',url:'https://torquemicro.com/products/feetech-hd1910-servo-motor',match:'SELECT_VARIANT',note:'Correct model but was shown on backorder; confirm supply for 15.'},
   {seller:'AliExpress',label:'15-pack candidate listing',url:'https://www.aliexpress.us/item/3256813219512604.html',match:'SELECT_VARIANT',note:'Select 15 x Servo bundle. A 15-unit lot cannot be priced as one motor; 2.5x pricing is normalized per servo for the 15-piece kit. ZIP freight and buyer-orderable supplier SKU still require verification.'}
  ]
 },
 'radxa-zero-3w':{
  required:'Radxa ZERO 3W manufacturer SKU RS107-D2E0H1W15: 2 GB RAM, no eMMC, pre-soldered GPIO header.',
  notes:'Exact 2 GB/no-eMMC/pre-soldered GPIO manufacturer SKU RS107-D2E0H1W15 was sold out at Arace and current AliExpress candidates. Hubtronics India listed exact manufacturer variant in stock, but U.S. shipping remains unverified. Never ship 1 GB/no GPIO by substitution.',
  offers:[
   {seller:'Hubtronics India',label:'Exact Radxa ZERO 3W 2 GB + header',url:'https://hubtronics.in/radxa-zero-3w-2gbram',match:'SELECT_VARIANT',note:'Listed RS107-D2E0H1W15 with inventory in India. Shipping to U.S., taxes and courier qualification are unknown; not an approved fulfillment source.'},
   {seller:'Arace Tech',label:'Radxa ZERO 3W — select exact configuration',url:'https://arace.tech/products/radxa-zero-3w',match:'SELECT_VARIANT',note:'Select 2 GB / None eMMC / Soldered header. Reconfirm selected SKU and shipping at checkout.'},
   {seller:'ameriDroid',label:'Alternative board listing',url:'https://ameridroid.com/products/radxa-zero-3w',match:'SELECT_VARIANT',note:'Compare exact 2GB no-eMMC header version; availability can vary.'}
  ]
 },
 'microduck-hat':{
  required:'Custom Microduck HAT Oct 15, 2026 AMP2.0 bus + HP1.25 audio + LED/R34, board populated and tested.',
  notes:'No generic ESP32 HAT is suitable. Choose creator-assembled AMP2.0 model or fabricate from correct authorized EasyEDA Pro source.',
  offers:[
   {seller:'Original creator (Taobao)',label:'Order assembled HAT/IMU from creator',url:'https://item.taobao.com/item.htm?id=1095121548583',match:'SELECT_VARIANT',note:'Choose AMP2.0 HAT and confirm connector revision, stock and cross-border shipping.'},
   {seller:'JLCPCB assembly',label:'Custom HAT PCB + assembly quotation',url:'https://jlcpcb.com/',match:'CUSTOM_ORDER',note:'Requires Oct 15 gerber/BOM/CPL, verified footprint matching, fab rights and test plan.'}
  ]
 },
 'microduck-imu':{
  required:'Custom Microduck IMU STM32G031F8P6/LSM6DSV16XTR Oct 15 AMP2.0, compatible bus firmware.',
  notes:'Creator assembled IMU may come flashed; independently fabricated IMU needs flashing, calibration and bus pin test.',
  offers:[
   {seller:'Original creator (Taobao)',label:'Order assembled FT6 IMU from creator',url:'https://item.taobao.com/item.htm?id=1095121548583',match:'SELECT_VARIANT',note:'Select AMP2.0 IMU, verify included FT6 firmware and shipping.'},
   {seller:'JLCPCB assembly',label:'Custom IMU PCB fabrication and assembly',url:'https://jlcpcb.com/',match:'CUSTOM_ORDER',note:'Submit matching Oct 15 PCB/BOM/CPL; no verified retail SKU.'}
  ]
 },
 'imx219-160-camera':{
  required:'Sony IMX219 8 MP camera with true 160° lens, Radxa ZERO 3W-compatible FPC/cable orientation.',
  notes:'AliExpress selected 160 Degree option 14-173 on Oct 28; do not use cheaper default 77 Degree. Radxa CSI cable and orientation must be verified.',
  offers:[
   {seller:'ArmDojo',label:'IMX219 160° with 22-pin FPC cable',url:'https://armdojo.com/products/imx219-160-wide-angle-csi-camera-module-8mp',match:'SELECT_VARIANT',note:'160° module with cable offered, verify CSI pin orientation and Radxa drivers.'},
   {seller:'Waveshare',label:'IMX219-160 camera module',url:'https://www.waveshare.com/product/risc-v/imx219-160-camera.htm',match:'SELECT_VARIANT',note:'Choose IMX219-160 option, not 120/IR/IR-CUT; 22-pin adapter may be extra.'},
   {seller:'AliExpress',label:'160° module candidate (must select)',url:'https://www.aliexpress.us/item/3256807416958346.html',match:'SELECT_VARIANT',note:'Default listing previously showed 77°; explicitly select 160 Degree and check ZIP shipping.'}
  ]
 },
 'vl53l5cx-v2':{
  required:'VL53L5CX V2 8×8 ToF breakout with matching cover and compatible I2C/power pins.',
  notes:'Pololu VL53L5CX carrier uses a different PCB; not the V2 board in the creator’s original mount.',
  offers:[
   {seller:'AliExpress',label:'VL53L5CX V2 exact variant candidate',url:'https://www.aliexpress.us/item/3256807375986018.html',match:'SELECT_VARIANT',note:'Select VL53L5X V2, not bare sensor or other carrier; prior ZIP 11021 quote is dated and payment untested.'},
   {seller:'RCDrone',label:'V2 sensor module + cover',url:'https://rcdrone.top/sw/products/vl53l5cx-v2-8-8-multi-zone-tof-distance-sensor-module-4m-60hz-63-fov-i2c-3d-ranging-for-robot-arduino',match:'SELECT_VARIANT',note:'Select V2 Module + Cover; page was sold out at last review.'},
   {seller:'RobotShop',label:'Pololu carrier — alternate PCB',url:'https://www.robotshop.com/products/vl53l5cx-tof-8x8-zone-distance-sensor-400-cm-carrier-w-voltage-regulator',match:'COMPATIBILITY_REVIEW',note:'Correct VL53L5CX chip but different dimensions; not drop-in V2.'}
  ]
 },
 'npf550-power-kit':{
  required:'Two Sony NP-F550 style 7.2V batteries PLUS one compatible dual charger (not one battery); use approved protection.',
  notes:'Wasabi 2600 mAh is a functional equivalent of original 2200 mAh capacity, not the exact maker brand. Verify battery slot size/current.',
  offers:[
   {seller:'AliExpress',label:'NP-F550 2Pcs set with LCD dual charger',url:'https://www.aliexpress.us/item/2255800740884834.html',match:'SELECT_VARIANT',note:'Select 2Pcs set (not default 1Pc); regular supplier offer observed 2026-10-28. Lithium freight and current stock require qualification.'},
   {seller:'Wasabi Power',label:'2 NP-F550 batteries + dual charger',url:'https://www.wasabipower.com/collections/battery-charger-kits/products/wasabi-power-battery-2-pack-and-dual-charger-for-sony-np-f550',match:'COMPATIBILITY_REVIEW',note:'Two 7.2 V 2600 mAh batteries and dual USB charger; shipping/battery rules apply.'}
  ]
 },
 'bearing-6700':{
  required:'6700 open, 10 mm inner × 15 mm outer × 3 mm width; buy 5 installed/reference units.',
  notes:'6700-ZZ 10x15x4 is not equivalent to 6700 open 10x15x3.',
  offers:[
   {seller:'AliExpress',label:'S6700W3-OPEN 10×15×3 10-pack',url:'https://www.aliexpress.us/item/3256807024557318.html',match:'SELECT_VARIANT',note:'Select S6700W3-OPEN 10x15x3; ten supplied per lot, Microduck needs five. Shipping and lot use must be reviewed.'},
   {seller:'VXB',label:'6700 open 10×15×3 mm per bearing',url:'https://vxb.com/products/6700-ball-bearing-10mm-x-15mm-x-3mm-single-row-open',match:'EXACT_SPEC',note:'Open, 3 mm wide. Select quantity 5; verify delivery and tolerance.'},
   {seller:'Bearings Direct',label:'6700 series compare exact open bearing',url:'https://bearingsdirect.com/6700-series-thin-high-speed-ball-bearings/?page=1',match:'SELECT_VARIANT',note:'Choose 6700 Open 10x15x3, not sealed 4-mm variants.'}
  ]
 },
 'bearing-et2216':{
  required:'ET2216ZZ, 16 mm inner × 22 mm outer × 4 mm width, double metal shields, 12 units.',
  notes:'Same geometric size may be called MR1622-ZZ; check bearing width and exact tolerances.',
  offers:[
   {seller:'AliExpress',label:'NAZE ET2216ZZ 16×22×4 ABEC-7 10-pack (replacement)',url:'https://www.aliexpress.us/item/3256804482667678.html',match:'SELECT_VARIANT',note:'Exact 16x22x4 selection displayed available Oct 28. Two 10-packs required for 12-unit Microduck kit; verify live inventory and U.S. shipping.'},
   {seller:'NZ Miniature Bearings',label:'MR1622-ZZ / ET2216ZZ 16×22×4',url:'https://nzminiaturebearings.co.nz/product/16x22x4-mm-mr1622-zz-bearing-sku-00206030.html',match:'EXACT_SPEC',note:'Equivalent designation with dimensional match; verify U.S. checkout and quantity 12.'},
   {seller:'LILY Bearing',label:'ET2216 ZZ manufacturer profile',url:'https://www.lily-bearing.com/products/et2216-zz/',match:'EXACT_SPEC',note:'Exact part dimensions; ask seller for actual quote/pack and delivery.'},
   {seller:'AliExpress',label:'ET2216ZZ supplier option candidate',url:'https://www.aliexpress.us/item/2251800514902353.html',match:'SELECT_VARIANT',note:'Original ET2216ZZ option from this item reported out of stock on Oct 28; do not use as primary supplier.'}
  ]
 },
 'bearing-623zz':{
  required:'Optional Microduck roller: 623ZZ, 3 mm bore × 10 mm OD × 4 mm, eight installed.',
  notes:'Optional roller only, NOT included in standard walking build. 683ZZ 3×7×3 is wrong.',
  offers:[
   {seller:'AliExpress',label:'623ZZ 3×10×4 mm exact 10-pack selection',url:'https://www.aliexpress.us/item/3256805794598678.html',match:'SELECT_VARIANT',note:'Select 623ZZ - 3x10x4 mm, not default 683ZZ - 3x7x3 mm. Optional 8-unit roller kit consumes a 10-pack.'},
   {seller:'Bearings Direct',label:'623-ZZ 3×10×4 shielded',url:'https://bearingsdirect.com/623-zz-mini-ball-bearing-3x10x4-shielded-r1030zz/',match:'EXACT_SPEC',note:'Exact dimensions; select quantity eight.'},
   {seller:'VXB',label:'623ZZ pack of ten',url:'https://vxb.com/products/623zz-10-bearing-shielded-3x10x4-miniature',match:'EXACT_SPEC',note:'10-pack covers optional eight rollers plus two spares.'}
  ]
 },
 'microduck-speaker-3525':{
  required:'Microduck YZ3525 3525 cavity loudspeaker, 4Ω / 3W and mating 2P 1.25 mm connector for HAT J1 SPK_R_P / SPK_R_N.',
  notes:'A distinct physical SKU from 28mm Voice Node loudspeaker. The supplier photo confirms YZ3525 4Ω3W with 2P 1.25mm plug (option 14-193). Confirm connector polarity and ZIP shipping before payment.',
  offers:[
   {seller:'AliExpress',label:'YZ3525 4Ω3W speaker · 2P 1.25 mm',url:'https://www.aliexpress.us/item/3256813213673448.html',match:'SELECT_VARIANT',note:'Choose exact picture 14-193 YZ3525 4Ω3W / 2P 1.25. Default $1.28 item and $4.30 displayed delivery on Oct 28; ZIP-specific purchase not yet confirmed.'},
   {seller:'Original maker supplier',label:'Original 3525 4Ω3W speaker',url:'https://item.taobao.com/item.htm?id=683920556900',match:'SELECT_VARIANT',note:'Original creator reference. Match 3525 size, 4Ω/3W and crimped HP1.25 2P connector, not the 8Ω speaker.'}
  ]
 },
 'microduck-printed-parts':{
  required:'Original FrankenDuck 36 STL parts plus five-plate 3MF; PLA rigid parts, TPU soles/tires, audited scale.',
  notes:'MAKHEX already makes the authorized 36 STL + five-plate 3MF design download available FREE behind member login. No physical prints are offered or shipped; select your printer and PLA/TPU material yourself.',
  offers:[
   {seller:'MAKHEX',label:'FREE member STL and 3MF download',url:'https://makhex.com/members/microduck-designs/',match:'EXACT_SPEC',note:'Sign in to obtain original author-controlled design archive and print locally. Digital files only; no part delivery or physical shipment.'},
   {seller:'JLC3D',label:'Upload original STLs/3MF to quote prints',url:'https://jlcpcb.com/3d-printing/',match:'CUSTOM_ORDER',note:'Quote PLA and TPU separately; verify scale, supports, dimensional fit and print quantity.'},
   {seller:'PCBWay 3D',label:'Alternative upload-to-print service',url:'https://www.pcbway.com/rapid-prototyping/',match:'CUSTOM_ORDER',note:'Request same STL/3MF geometry and material compatibility; private CAD access on MAKHEX.'}
  ]
 },
 'microduck-fasteners':{
  required:'Microduck complete fastener assortment: M2x4/5/6/8/12 and M2.6x8, correct self-tapping/thread, head shape and lengths.',
  notes:'Use maker six-size ×200 flat-tail Phillips pan-head packs. Ordinary AliExpress wafer-head screws can differ mechanically. Historical ¥20.43 kit is a pricing basis BEFORE freight, not current order quote.',
  offers:[
   {seller:'AliExpress',label:'M2 and M2.6 flat-tail screws / multiple lengths candidate',url:'https://www.aliexpress.us/item/3256807980116275.html',match:'COMPATIBILITY_REVIEW',note:'Listing allows M2/M2.6 and 4/5/6/8/12 mm but supplied heads are low-wafer, NOT proven identical to maker pan-head. Selected M2 combinations displayed OOS; not an approved direct swap.'},
   {seller:'Original maker supplier (Taobao)',label:'Creator fastener-size purchase listing',url:'https://item.taobao.com/item.htm?id=534923831046',match:'SELECT_VARIANT',note:'Select all six lengths and confirm head/drive, quantity, M2 vs M2.6.'},
   {seller:'Original maker BOM',label:'See every required screw type and count',url:'https://github.com/kissqy/Microduck-kissqy/blob/main/DUCK-SHOPPING-LIST.en.md',match:'COMPATIBILITY_REVIEW',note:'Authoritative assembly list; sourcing guidance, not a single checkout.'}
  ]
 },
 'amp20-servo-cables':{
  required:'AMP2.0 3P serial-bus servo cables, 24 AWG, both 100 mm and 200 mm lengths; verify pin-1 mapping.',
  notes:'The exact maker cables are 3P 2.0 mm AMP2.0, 1007/24AWG, 30 pieces each of 10cm and 20cm. 2.54 mm RC PWM and generic PH2.0 26AWG extension listings do not satisfy the documented gauge/protocol without review.',
  offers:[
   {seller:'Original maker supplier (Taobao)',label:'AMP2.0 3P 10 cm / 20 cm ready-made leads',url:'https://item.taobao.com/item.htm?id=825340808235',match:'SELECT_VARIANT',note:'Choose original 10 cm and 20 cm / 1007 24AWG options, not EH2.5 or JR PWM connectors.'},
   {seller:'Creator connector drawing',label:'AMP2.0 pin and cable spec',url:'https://github.com/kissqy/Microduck-kissqy/blob/main/hardware/AMP2.0-VERSION.en.md',match:'COMPATIBILITY_REVIEW',note:'Source reference and fabrication info, not retail cable checkout.'}
  ]
 },
 'microduck-wiring-kit':{
  required:'22 AWG 3-core silicone harness, 22 AWG black single wire, plus mixed heat shrink; source original quantities.',
  notes:'Manufacturer BOM defines a three-material MAKHEX bundle; use 3m of 22AWG three-core + 2m 22AWG black single-core + 164-piece 2:1 heat shrink, not default 0.5mm² three-core mistaken for 22AWG.',
  offers:[
   {seller:'AliExpress',label:'164-piece colored 2:1 shrink assortment',url:'https://www.aliexpress.us/item/3256812286354959.html',match:'SELECT_VARIANT',note:'Select 14-350853 164 PCS assortment; one of three materials required in the MAKHEX wiring bundle.'},
   {seller:'AliExpress',label:'Black single-core silicone 22AWG 2m',url:'https://www.aliexpress.us/item/3256810220858713.html',match:'SELECT_VARIANT',note:'Select black 14-200004890, 22 AWG 380-201441935 and 2m 183-390264893; not default 26 AWG red.'},
   {seller:'AliExpress',label:'3-core 22AWG silicone cable candidate',url:'https://www.aliexpress.us/item/3256801085130585.html',match:'COMPATIBILITY_REVIEW',note:'Choose black 3-core 22AWG with at least 3m. Exact option was not buyer-cart verified; do not substitute 0.5mm² 3-core as 22AWG.'},
   {seller:'Original maker BOM',label:'Shop original 22AWG wire + heat shrink items',url:'https://github.com/kissqy/Microduck-kissqy/blob/main/DUCK-SHOPPING-LIST.en.md',match:'SELECT_VARIANT',note:'Open three source links: 3-core 22 AWG 3 m, black 22 AWG 2 m, 164-piece heat-shrink set.'},
   {seller:'Original maker supplier (Taobao)',label:'Heat shrink assortment source',url:'https://item.taobao.com/item.htm?id=945215173380',match:'SELECT_VARIANT',note:'Only heat shrink. Also order both silicone wire types via maker BOM links.'}
  ]
 },
} as const;

export function supplierFor(slug:string):SupplierMatch|undefined{return supplierMatches[slug]}
export function offersFor(slug:string,project?:string):readonly SupplierOffer[]{
 const all=supplierFor(slug)?.offers??[];
 if(!project)return all;
 const relevant=all.filter(x=>!x.project||x.project===project);
 return [...relevant].sort((a,b)=>Number(b.project===project)-Number(a.project===project));
}
