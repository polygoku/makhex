# AtomDog Build 14 — complete sourcing and substitutions

Status: **5/5 purchasable component families mapped to MAKHEX** and included in the first-party order-request cart. **Not yet a paid-ready or fulfillment-qualified kit.** Source stock indications were checked on November 17, 2026 (November 18 UTC).

| Component | Quantity | Preferred source | Substitute / secondary source | Qualification |
| --- | ---: | --- | --- | --- |
| ATOM Lite ESP32 | 1 | M5Stack C008, SKU exactly C008 | No substitute approved; ATOMS3 has a different hardware/firmware profile | Official M5Stack store JSON reports available=true; U.S. freight not verified |
| ATOMIC Motion Base | 1 | M5Stack A090-V12; original v1.1 discontinued | OpenELAB M5-A090-V12 (same manufacturer board) | Manufacturer and secondary vendor report available=true; fit/current/battery delivery not verified |
| FEETECH FS90MG 180-degree metal gear PWM servo | 4 | RobotDoo FEETECH FS90MG 180-degree digital, exact shop SKU | RobotShop FEETECH FS90MG listing | RobotDoo reports available=true, but four-unit shipping and controller limits remain unverified |
| Data-capable USB-A to USB-C 1 meter cable | 1 | Adafruit 4474 | Adafruit 4199 USB-C to USB-C for a USB-C host | Adafruit page reports in stock, U.S. delivery fees unverified |
| 1.75mm PLA, 1 kg retail spool | 1 spool | Polymaker PolyLite PLA 1.75mm, choose stocked color | Polymaker Panchroma Matte PLA 1.75mm, approved local seller to be chosen | Some colors/backorders; need specific SKU and U.S. shipping quote |

## Included in another listed component: do not double-charge

- **18350 protected lithium-ion cell, 900mAh (1):** official A090-V12 Motion Base includes it. Confirm the seller will ship this battery to the U.S.
- **Servo horn and screw hardware (4 matched sets):** RobotDoo includes one set with each selected FEETECH FS90MG servo. When using a secondary vendor, verify the same inclusion; only purchase screws if a documented seller package is missing them.
- **Seven printable robot components:** body, head, tail, four legs. Free 3MF supplied by the original maker at the Hackster source page. The 3D printer and printed shell are not sold in the electronics basket. The PLA retail spool is listed separately as a purchasable workshop supply.
- **Firmware and browser control:** original PlatformIO project, main.cpp, platformio.ini and wifi_config.h from Hackster. No pre-flashed custom firmware is shipped.

## Vendor links for procurement

1. https://shop.m5stack.com/products/atom-lite-esp32-development-kit
2. https://shop.m5stack.com/products/atomic-motion-base-v1-2-with-power-monitor
3. https://openelab.com/products/m5stack-atomic-motion-base-v1-2-ina226aidgsr
4. https://robotdoo.com/products/feetech-fs90mg-9g-metal-gear-digital-micro-servo
5. https://www.robotshop.com/products/feetech-9g-digital-servo-22kg-cm-fs90mg
6. https://www.adafruit.com/product/4474
7. https://www.adafruit.com/product/4199
8. https://shop.polymaker.com/products/polylite-pla/
9. https://eu-wholesale.polymaker.com/products/panchroma-matte

## Critical engineering exception before accepting paid orders

The manufacturer documents 0.4 A peak servo current **per A090-V12 channel**. Digital FEETECH FS90MG references include stall loads up to 0.8 A at 6V. Verify the exact servo revision, leg mounting fit, unloaded centering, mechanical stops, loaded gait current and battery supply. Neither generic MG90S nor FS90R is an accepted drop-in. A090-V12 is a provisional successor to discontinued v1.1, not yet a tested mechanical substitute.

## Retail and supplier qualification

Live manufacturer/retailer product endpoints are recorded with SKU identifiers, availability flags and observed prices in an ignored, private MAKHEX reports snapshot. Supplier wholesale basis does not appear on customer pages. No authenticated AliExpress exact variant or delivery checkout has passed, and original supplier links remain internal sourcing references. MAKHEX customers can request all **eight sale units across five component families** in one first-party cart, no card charge until review.

Remaining tasks: qualify delivery to ZIP 11021 and lithium shipping, inspect/validate actual 3MF and v1.2 dimensions, conduct servo load test, confirm five supplier items and commercial return terms, import into actual Squarespace stock-0/hidden catalog with readback, and verify Doroppu procurement/tracking before opening a paid checkout.
