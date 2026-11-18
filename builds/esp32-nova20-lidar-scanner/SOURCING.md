# Build 13 — Supplier-identified BOM / November 17, 2026

This dossier describes **real source paths**, not approved, charged or shipped supplier orders. Retail pages are independently verifiable; U.S. ZIP-specific cart check, landed shipping, merchant/Squarespace SKU import, refunds and controlled drop-ship procurement are still pending.

**Customer ordering stays with MAKHEX:** Both alternative kit plans use the first-party MAKHEX order-request cart and owner-approved payment process. No buyer is sent to an outside seller as the primary checkout action. Wholesale links are engineering evidence, not customer fulfillment instructions.

## Exact NOVA20 20-channel UART build (7 MAKHEX line items)

| Qty | MAKHEX slug | Supplier reference and SKU | What is proven | Still needed before payment |
| ---: | --- | --- | --- | --- |
| 1 | benewake-nova20-lidar | Benewake NOVA20 manufacturer https://ai.benewake.com/en/products/nova20/ | Exact model, documentation and interface | **Not retail-listed for U.S. checkout.** Obtain actual price, lead time, U.S. shipping, OEM serial, commercial invoice, returns |
| 1 | esp32-wroom32-devkit | Rokland Type-C CH340C classic ESP32-WROOM-32 https://store.rokland.com/products/esp32-wroom-32-development-board-type-c-wifi-bluetooth-4-2-ble-ultra-low-power-iot-module-ch340c | Named matching controller family and store listing | Confirm exact board revision, USB, pins, stock, ZIP shipping |
| 1 | ssd1306-oled-096 | Adafruit #326 0.96in 128x64 I2C https://www.adafruit.com/product/326 OR AliExpress option https://www.aliexpress.us/item/3256811668950492.html | Reference model and at least one supplier candidate | Select exact 128x64 SSD1306 I2C variant, check 4-pin vs STEMMA/Qwiic wiring |
| 1 | nova20-5pin-harness | SparkFun JST GHR-05V 1.25mm 5-pin cable https://www.sparkfun.com/breadboard-to-jst-ghr-05v-cable-5-pin-x-1-25mm-pitch.html | A purchasable 1.25mm/5-pin *candidate* exists | **Actual NOVA20 mating connector family and pinout NOT proven**. Do not substitute by pitch alone or apply power |
| 1 | regulated-5v-2a-proto-kit | Adafruit #276 5V 2A UL-listed U.S. AC adapter https://www.adafruit.com/product/276; female #368 barrel-to-screw terminal https://www.adafruit.com/product/368; Type-C data cable #4474 https://www.adafruit.com/product/4474; 400-point breadboard #64 https://www.adafruit.com/product/64 (stock inconsistent) | Adapter, connector and cable individual sources identified | Final kit must physically contain all specified subparts incl. suitable wire gauge, safe polarity and appropriate MCU rail; verify breadboard supply or alternative |
| 1 | nova20-capacitor-kit | 2 x DigiKey CDE 106RSS050M 10uF/50V electrolytic https://www.digikey.com/en/products/detail/cornell-dubilier-knowles/106RSS050M/5410679; 4 x DigiKey Kyocera AVX SR205C104KAR 100nF/50V X7R ceramic https://www.digikey.com/en/products/detail/kyocera-avx/SR205C104KAR/936829; backup Adafruit #2195 / Addicore stock uncertain | Both values and quantities from independent practical how-to, separately sourced | Source complete two-value bundle. Confirm source circuit diagram, capacitor polarity and location; a carrier may already have decoupling |
| 1 | dupont-jumper-20cm-kit | GetHacking 40x20cm selectable M/F pack https://gethacking.com/products/dupont-jumper-wire-pack-of-40-x-20cm or SparkFun PRT-12794 20-pack https://www.sparkfun.com/jumper-wires-connected-6-m-f-20-pack.html | >=4 jumper leads with common header terminations can be sourced | Choose male/female compatibility with purchased board/breakouts; this **does not replace** NOVA20 1.25mm harness |

**Never substitute a Benewake TF-NOVA for NOVA20.** Different optical geometry and interface. The official NOVA20 has 20 channels over up to 40 degrees, not a 360-degree sweep or true volumetric 3D scanner. Its expected sensor supply is 5V +-5% with startup peak below 850mA. ESP32 GPIO must never see an unverified 5V serial signal.

## Alternative VL53L5CX 64-zone I2C build (5 MAKHEX line items)

| Qty | MAKHEX slug | Primary option | Alternative | Engineering qualification |
| ---: | --- | --- | --- | --- |
| 1 | vl53l5cx-tof-8x8 | **Pololu #3417**, DigiKey Marketplace #2183-3417-ND https://www.digikey.com/en/products/detail/pololu/3417/19199889 | Manufacturer direct https://www.pololu.com/product/3417 or SparkFun SEN-19013 Qwiic Mini https://www.sparkfun.com/sparkfun-qwiic-mini-tof-imager-vl53l5cx.html | DigiKey indexed listing reported 214 in stock (dynamic). SparkFun Qwiic Mini in stock. Check current cart, exact carrier, I2C voltage/pinout and connector (Qwiic vs 0.1in) |
| 1 | esp32-wroom32-devkit | Rokland classic ESP32-WROOM-32 Type-C CH340C | Espressif DevKitC with compatible exposed I2C pins | I2C and Wi-Fi memory allocation must be tested |
| 1 | ssd1306-oled-096 | Adafruit #326 SSD1306 I2C 128x64 | Verified AliExpress 4-pin option | Share SDA/SCL only with proper 3.3V logic and distinct I2C addresses |
| 1 | dupont-jumper-20cm-kit | GetHacking 40-piece M/F 20cm | SparkFun 20 M/F pack | Select connector gender; Qwiic Mini will require a distinct Qwiic adapter/cable, so **Pololu #3417 is preferred** |
| 1 | regulated-5v-2a-proto-kit | Adafruit #276, #368 and Type-C USB data cable #4474 | Equivalent U.S. safety-rated kit with the same power specifications | Supply actual sensor breakout through valid 3.3 V VIN from ESP32 (or regulator as specified). Never apply 5V to bare sensor or ESP32 GPIO |

This kit does not need the standalone NOVA20 mating cable or two-value source capacitor set because those belong to a different hardware design. It uses the VL53L5CX driver over I2C and 8x8 visualization instead of the NOVA20 921600-baud UART firmware. The software is distinct; the optical footprint and angular field are different.

### Compatibility and sourcing evidence

- DigiKey item #2183-3417-ND: marketplace stock and product description, https://www.digikey.com/en/products/detail/pololu/3417/19199889
- Pololu carrier 3417 technical guidance, https://www.pololu.com/product/3417
- SparkFun SEN-19013 product stock and wiring differences, https://www.sparkfun.com/sparkfun-qwiic-mini-tof-imager-vl53l5cx.html
- SparkFun reference driver with 8x8 examples, https://github.com/sparkfun/SparkFun_VL53L5CX_Arduino_Library
- Independent original ESP32/NOVA20 how-to used only for source quantities and electrical research, https://how2electronics.com/nova20-solid-state-multi-point-lidar-with-esp32-web-view/
- Source media: https://www.youtube.com/watch?v=r8egFYK296M (Christopher/cgwaltney), https://forum.seeedstudio.com/t/esp32-lidar-scanner-with-benewake-nova20-multi-point-lidar-live-2d-3d-visualization/295998

### Shop and fulfillment release requirements

**Current classification:** All eight distinctive MAKHEX component families (7 exact BOM + 1 replacement sensor) are recorded, and every purchase path is a first-party quote-only research request, never a charged sale.

**Not yet proven:** supplier account/order, exact AliExpress variants, inventory for all bundles, U.S. ZIP-11021 landed price, supplier packing, shipping/tax, returns, payment settlement, Doroppu sourcing order or MAKHEX hardware validation.

**Before enabling immediate paid checkout:** record an approved option and source variant per actual component, verify connector family, validated U.S. delivery and returns, ensure a full bundle is purchasable through one MAKHEX transaction, and complete a controlled Squarespace-to-supplier order test. No hidden assumptions or automatic substitute.
