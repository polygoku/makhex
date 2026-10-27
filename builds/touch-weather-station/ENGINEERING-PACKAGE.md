# MAKHEX Engineering Package 01 — Touch Weather Station

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/Damov/esp32_weather_forecast_screen
- License: MIT
- Credited physical reference photo: /reference-builds/touch-weather-station.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/Damov/esp32_weather_forecast_screen
- Pinned original-source commit: d5bcb4ca34e482d4091002b480df6bb5aa9072c2

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [printable_3D_model/assembly.3mf](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/assembly.3mf)
- [printable_3D_model/step/Back_Lid.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Back_Lid.STEP)
- [printable_3D_model/step/Front_Lid.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Front_Lid.STEP)
- [printable_3D_model/step/Mounting_Radar.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Mounting_Radar.STEP)
- [printable_3D_model/step/Stand.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Stand.STEP)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-S3 3.5″ Touch Display](https://makhex.com/shop/esp32-s3-touch-35/) | Touch interface | Not verified |
| 1 | [BME280 Environment Sensor](https://makhex.com/shop/bme280-sensor/) | Environment readings | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench power | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Identify the exact display and touch controller SKU.
2. Verify display firmware alone before adding peripherals.
3. Read BME280 sensor values over verified I²C pins.
4. Build LVGL screen states and stale-data warnings.
5. Stress-test touch, power and thermal behavior.

### Project-specific preflight
- Identify the precise display controller, touch chip and backlight pin mapping from the purchased board.
- Confirm the BME280 uses 3.3 V and that its I2C pins do not conflict with the display.

## Acceptance tests — evidence not yet supplied
- [ ] A live temperature/humidity reading appears with a last-updated timestamp.
- [ ] Touch works for 30 minutes without freezes or phantom presses.
- [ ] Unplugging the sensor produces a visible stale-data warning rather than a fabricated reading.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Controller, I²C bus and GPIO maps are board-dependent; never rely on generic wiring.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Map actual screen/touch GPIO from the board schematic before writing display drivers.
2. Provide a minimal sensor example and LVGL build instructions with a reproducible flash log.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

