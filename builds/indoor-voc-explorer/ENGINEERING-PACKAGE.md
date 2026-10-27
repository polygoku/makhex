# MAKHEX Engineering Package 07 — Indoor VOC Explorer

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/koenvervloesem/esphome-air-quality-monitor
- License: MIT
- Credited physical reference photo: /reference-builds/indoor-voc-explorer.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/koenvervloesem/esphome-air-quality-monitor
- Pinned original-source commit: acff085bf7ee94120aadeeb3bae73f3d337e15e5

### Native source files (original build, not verified compatible with MAKHEX BOM)
- No source CAD/3D/PDF files indexed.

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-S3 Dev Board](https://makhex.com/shop/esp32-s3-devkit/) | Controller | Not verified |
| 1 | [SGP40 VOC Sensor](https://makhex.com/shop/sgp40-voc/) | VOC sensor | Not verified |
| 1 | [BME280 Environment Sensor](https://makhex.com/shop/bme280-sensor/) | Compensation | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench supply | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Verify each sensor on its own.
2. Supply humidity and temperature compensation.
3. Log timestamped data with warm-up status.
4. Render relative trend visualizations.
5. Explain error and sensor baseline behavior.

### Project-specific preflight
- Verify SGP40 and BME280 supply/bus wiring on the exact board.
- Choose a VOC index library with documented warm-up and state persistence.

## Acceptance tests — evidence not yet supplied
- [ ] VOC trend and compensation readings appear with timestamps.
- [ ] Warm-up and out-of-range conditions are shown instead of hidden.
- [ ] No CO2 concentration or safety alarm is inferred from VOC data.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Not a calibrated CO₂, particulate or life-safety monitor.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. State the exact VOC algorithm and supported conditions.
2. Supply test logs for sensor warm-up, disconnect and compensation.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.
