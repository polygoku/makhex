/** MAKHEX source-backed 2.5x planning only; NOT accepted final checkout prices.
 * Existing seven variants use 2026-10-28 observed AliExpress options.
 * Five maker-source plans are historical CNY costs converted at 6.667 CNY/USD,
 * multiplied 2.5x BEFORE freight. Supplier verification and owner exceptions
 * are mandatory before payment, listing inventory, or automatic fulfillment.
 */
import type {CatalogStage} from './catalog-staging.ts';
export const microduckPriceObservedAt='2026-10-28' as const;
export const microduckPricePlans:Readonly<Record<string,CatalogStage>>={
 'feetech-hd1910':{supplierModel:'Feetech HD-1910-C001 TTL Serial Bus Servo',variants:[{title:'HD-1910-C001 · single servo (Microduck bundle of 15)',plannedRetailUsd:71.53}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'imx219-160-camera':{supplierModel:'IMX219 160° Wide-Angle Camera Module',variants:[{title:'IMX219 8 MP · 160° lens · 22-pin cable review',plannedRetailUsd:21.88}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'vl53l5cx-v2':{supplierModel:'VL53L5CX V2 8×8 Time-of-Flight Sensor',variants:[{title:'VL53L5X V2 · I2C ToF module',plannedRetailUsd:50.00}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'npf550-power-kit':{supplierModel:'NP-F550 Two Batteries + LCD Dual Charger Kit',variants:[{title:'2 × NP-F550 2600 mAh + LCD dual charger',plannedRetailUsd:71.78}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'bearing-6700':{supplierModel:'6700 Open Thin-Wall Bearing 10×15×3 mm',variants:[{title:'6700 open 10×15×3 mm · per bearing (5-piece build)',plannedRetailUsd:7.44}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'bearing-et2216':{supplierModel:'ET2216ZZ Shielded Bearing 16×22×4 mm',variants:[{title:'ET2216ZZ 16×22×4 mm · per bearing (12-piece build)',plannedRetailUsd:12.50}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'bearing-623zz':{supplierModel:'623ZZ Shielded Mini Bearing 3×10×4 mm',variants:[{title:'623ZZ 3×10×4 mm · per bearing (8-piece optional roller)',plannedRetailUsd:9.37}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-speaker-3525':{supplierModel:'Microduck 3525 4Ω 3W Speaker with HP1.25',variants:[{title:'YZ3525 4Ω 3W cavity · 2P 1.25 mm (not 8Ω)',plannedRetailUsd:13.95}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-hat':{supplierModel:'Microduck HAT AMP2.0 Assembled Controller Board',variants:[{title:'Original Oct 15 AMP2.0 HAT, assembled / made to order',plannedRetailUsd:74.62}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-imu':{supplierModel:'Microduck STM32/LSM6DSV16X FT6 IMU Board',variants:[{title:'Original Oct 15 AMP2.0 IMU, assembled + FT6 flash',plannedRetailUsd:37.12}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-fasteners':{supplierModel:'Microduck Six-Size M2/M2.6 Flat-Tail Screw Set',variants:[{title:'Six sizes · M2x4/5/6/8/12 + M2.6x8 · historical 200pc packs',plannedRetailUsd:7.66}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'amp20-servo-cables':{supplierModel:'Microduck AMP2.0 3P 24AWG Servo Harness Pack',variants:[{title:'30 × 100mm + 30 × 200mm; 24AWG, 2.0mm 3P',plannedRetailUsd:20.25}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-wiring-kit':{supplierModel:'Microduck 22AWG Wire and 164pcs Heat Shrink',variants:[{title:'3m 22AWG 3-core + 2m black 22AWG 1-core + 164 pcs 2:1',plannedRetailUsd:5.70}],technicalGate:'HOLD',shippingVerified:false,buyerOrderabilityVerified:false},
 'microduck-printed-parts':{supplierModel:'Microduck FrankenDuck STL / 3MF Download',variants:[{title:'Free authorized maker design download · self print',plannedRetailUsd:0}],technicalGate:'REVIEW',shippingVerified:false,buyerOrderabilityVerified:false}
} as const;
export const microduckRetailCautions:Readonly<Record<string,string>>={
 'feetech-hd1910':'The per-servo price assumes 15 motors purchased as one 15-piece supplier lot. A smaller order requires separate sourcing approval.',
 'imx219-160-camera':'The selected supplier camera option must be 160 Degree, not the cheaper default 77 Degree. Camera FPC orientation and Radxa compatibility remain under review.',
 'vl53l5cx-v2':'The VL53L5X V2 board was checked with a supplier shipping indication; the complete current landed quote and payment pilot still require review.',
 'npf550-power-kit':'The selected supplier battery kit must be 2Pcs set, not the default 1Pc. Lithium battery shipping and return terms need final verification.',
 'bearing-6700':'Supplier sells a 10-piece 6700 open lot; the planned per-unit retail assumes Microduck needs five. Smaller quantities need repricing.',
 'bearing-et2216':'The former exact supplier variant is out of stock. The alternative is a 10-piece ET2216ZZ lot; two lots are required to supply the 12-piece Microduck build.',
 'bearing-623zz':'Optional roller only. The supplier sells ten 623ZZ bearings; the 8-unit kit retail allocates the lot. Do not substitute default 683ZZ.',
 'microduck-speaker-3525':'Source-selected YZ3525 4 ohm / 3 watt with 2-pin 1.25 mm connector. $13.95 plan is 2.5x displayed $1.28 part plus $4.30 delivery; shipping to the actual address and connector polarity still require checking.',
 'microduck-hat':'Maker-assembled AMP2.0 RevA HAT with 86 PCB placements, two 2.0mm bus ports, 1.25mm audio, TLV320 audio codec and onboard power. Historical ¥199 ×2.5 at 6.667 CNY/USD BEFORE freight: planning floor only, NOT current U.S. supplier quotation.',
 'microduck-imu':'Maker-assembled STM32G031F8P6 / LSM6DSV16XTR RevA; needs FT6_SYNC15_UART_IRQ_v1 flash, ID 200 at 1 Mbps and real orientation readback. Historical ¥99 ×2.5 at 6.667 CNY/USD BEFORE freight: planning floor, NOT a certified part.',
 'microduck-fasteners':'Six cross pan-head flat-tail self-tapping sizes: M2x4/5/6/8/12 plus M2.6x8. Historical 200-piece original-maker packs total ¥20.43; 2.5x at 6.667 CNY/USD BEFORE freight. Generic wafer-head packs are NOT confirmed identical.',
 'amp20-servo-cables':'Original maker 60 cables: 30 × 10cm and 30 × 20cm; AMP2.0 3-pin, 1007 24AWG. Historical ¥54 ×2.5 at 6.667 CNY/USD BEFORE freight. AliExpress PH2.0 26AWG is NOT approved as a substitute.',
 'microduck-wiring-kit':'Original maker supplies 3m 22AWG black three-core + 2m single-core 22AWG black + 164-piece colored 2:1 heat shrink. Historical ¥15.19 ×2.5 at 6.667 CNY/USD BEFORE freight. AliExpress 3-core 0.5mm² is not equivalent to 22AWG.',
 'microduck-printed-parts':'FREE digital models, already available via MAKHEX member design library. Self-print 36 STL models and five-plate 3MF, PLA rigid + TPU plate 5. No printed physical shell or shipping is included.'
} as const;
export const supplierVariantPhotoSlugs=new Set(['feetech-hd1910','imx219-160-camera','vl53l5cx-v2','npf550-power-kit','bearing-6700','bearing-et2216','bearing-623zz','microduck-speaker-3525']);
export const originalMakerEstimateSlugs=new Set(['microduck-hat','microduck-imu','microduck-fasteners','amp20-servo-cables','microduck-wiring-kit']);
