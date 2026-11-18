# MAKHEX Build 13 — ESP32 NOVA20 Multi-Point LiDAR Scanner

**Status:** Original creator's demonstration documented; MAKHEX adaptation and full parts kit remain **unverified**. No sensor, electronics, or supplier payment has been independently validated by MAKHEX.

## Original attribution and references

- Creator: **Christopher (cgwaltney)**; video: https://www.youtube.com/watch?v=r8egFYK296M
- Original Seeed Studio discussion (November 16, 2026): https://forum.seeedstudio.com/t/esp32-lidar-scanner-with-benewake-nova20-multi-point-lidar-live-2d-3d-visualization/295998
- Adafruit feature (November 17, 2026): https://blog.adafruit.com/2026/11/17/an-esp32-lidar-scanner-with-benewake-nova20-multi-point-lidar/
- Independent how-to reference (not established as the maker's exact BOM): https://how2electronics.com/nova20-solid-state-multi-point-lidar-with-esp32-web-view/
- Benewake official NOVA20 specification: https://ai.benewake.com/en/resources/technical-documents/nova20-datasheet/

The original Seeed post embeds a video but does not include a complete downloadable firmware repository or source-exact BOM. We **embed** the video from YouTube; we do not copy it. The sample sketch and illustrations in this MAKHEX project are new, untested research materials and not copies of third-party code or media.

## Demonstration and limitations

The NOVA20 measures distances across **20 channels over a field up to 40 degrees**. It is a fixed solid-state sensor. It **does not** provide mechanical 360-degree sweeps or independently validated 3D mapping. A 3D-like graph plotting time vs. channel vs. distance is a *history visualization*, not a physical 3D point cloud. Suitable learning use cases: UART data framing, robotics proximity experiments, local Wi-Fi dashboards, and sensor fault handling. Not safety-certified.

### Device specification — manufacturer claims, not measured by MAKHEX

| Characteristic | Benewake NOVA20 V2.1 |
| --- | --- |
| Sensors | 20 channels, <=40 degrees (±20 degrees) |
| Measuring range | 1 m at 10% reflectivity and 100 klux; blind zone <=0.1 m |
| Update rate | 10 Hz nominal |
| Supply | 5 V ±5%, startup peak below 850 mA |
| Interface | UART, 921600 baud default |
| Housing connector | 1.25 mm pitch, 5 positions (exact mating housing and pinout to verify) |
| Serial frame | 9 bytes: 0x59 0x59, dist low/high, peak low/high, temp, zone index, checksum |

## MAKHEX bill of materials — first-party sourcing review

All seven exact-NOVA20 entries are research-stage catalog parts; MAKHEX does **not** yet have a verified sensor supplier, price or shipping quote. They can be added to a single first-party **order request**, but no customer card is charged before sourcing approval.

| Qty | MAKHEX component slug | Engineering requirement |
| ---: | --- | --- |
| 1 | `benewake-nova20-lidar` | Exact NOVA20 20-channel module (not TF-NOVA) |
| 1 | `esp32-wroom32-devkit` | Classic ESP32-WROOM-32 development board with spare UART |
| 1 | `ssd1306-oled-096` | Optional local 128×64 I2C OLED display |
| 1 | `nova20-5pin-harness` | Correctly keyed mating 1.25 mm 5-position cable assembly |
| 1 | `regulated-5v-2a-proto-kit` | Regulated 5 V 2 A adapter, safe breakout/terminal wiring |
| 1 | `nova20-capacitor-kit` | Two 10uF electrolytics and four 100nF ceramic bypass capacitors from the source how-to; verify exact placement |
| 1 | `dupont-jumper-20cm-kit` | Four or more 2.54mm insulated header jumper wires; distinct from the NOVA20 1.25mm mating cable |

No exact NOVA20 AliExpress listing, live inventory, complete harness, landed U.S. cost, return terms or controlled purchase was qualified as of **November 17, 2026**. Do not invent price; do not replace NOVA20 with TF-NOVA or a different ToF sensor.

## Engineer-led bring-up checklist

1. Confirm the delivered sensor is genuine NOVA20, with its current datasheet and pin labels. Manufacturer power, UART logic levels, pin-1 orientation and mating connector must be verified before applying voltage.
2. Supply the LiDAR from a stable dedicated **5 V ±5%** path rated above its startup current. Supply the ESP32 via its approved input. Grounding and UART TX-to-RX crossing need protection against accidental backfeeding; **ESP32 GPIO is not 5 V tolerant**.
3. On a confirmed classic ESP32 DevKit, use a spare hardware UART RX (GPIO16 is only an example); configure **921600 8N1** and verify that raw frame traffic matches the manufacturer's protocol.
4. Check 0x59 0x59 header, 9-byte packet length and modulo-256 checksum before updating readings. Log raw zone index rather than assuming the scan's angular order.
5. Test the OLED separately with the exact controller voltage and pins. Typical I2C GPIO21/22 is board-dependent.
6. Connect a **local-only** Wi-Fi dashboard. Mark channels stale after timeouts and do not retain secrets, identify occupants or expose the device to the public internet.
7. Test with stationary targets at documented distances within the sensor's near-field operating conditions. Record actual zone mapping, response rate, error counters and USB/5 V power measurements.

### Independent experimental firmware

`firmware/nova20_uart_wifi_demo.ino` offers a minimal Arduino-ESP32 UART packet reader and local read-only browser interface. It is **not physically validated** and deliberately avoids reproducing claimed 3D reconstruction. It does not yet implement the OLED. To test, compile against a compatible Arduino-ESP32 core, change the local AP password, verify all actual pin voltages and wiring, then monitor the local dashboard at `192.168.4.1`.

## Qualification gate before paid checkout

- [ ] Source and photograph the exact NOVA20 variant and correctly mated harness.
- [ ] Verify sensor TX logic levels and manufacturer pinout.
- [ ] Qualify a 5 V / 2 A **U.S. safety-rated** power adapter and all breakout components.
- [ ] Capture real packet logs at 921600 baud; test checksum, channel alignment and dropouts.
- [ ] Validate OLED, firmware build and hardware operation for 30 minutes.
- [ ] Verify stock, U.S. ZIP shipping, landed cost, returns, taxes, and test order.
- [ ] Only after these checks, authorize a customer-visible price, Squarespace checkout and fulfillment.

Neither the original video nor Adafruit's editorial page grants blanket redistribution rights. Use source links and attribution, not downloaded copies.

## Fully sourced component shortlist and replacement option

See [SOURCING.md](SOURCING.md) for the seven-line original BOM, five-line VL53L5CX alternative kit, precise supplier model numbers, URLs, pack-quantity breakdown, known restocks, connector compatibility and the remaining supplier purchase checks. The 8x8 replacement uses [vl53l5cx_i2c_dashboard.ino](firmware/vl53l5cx_i2c_dashboard.ino) and the SparkFun VL53L5CX Arduino library, **not** the 20-channel NOVA20 UART sketch. Both are experimental and await hardware testing.
