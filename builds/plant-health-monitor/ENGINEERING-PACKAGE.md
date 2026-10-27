# MAKHEX Engineering Package 04 — Connected Plant Monitor

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/ConnerWill/esp32-plant
- License: GPL-3.0
- Credited physical reference photo: /reference-builds/plant-health-monitor.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/ConnerWill/esp32-plant
- Pinned original-source commit: 284af7c31e6bce2de528f599f36ba47192eefc66

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [3D-models/DHT22-case/DHT22_bottom.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/DHT22-case/DHT22_bottom.stl)
- [3D-models/DHT22-case/DHT22_top.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/DHT22-case/DHT22_top.stl)
- [3D-models/ESP32-housing/ESP32-housing.3mf](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.3mf)
- [3D-models/ESP32-housing/ESP32-housing.FCStd](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.FCStd)
- [3D-models/ESP32-housing/ESP32-housing.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.stl)
- [3D-models/MQ-135-case/MQ2-Bottom-02.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/MQ-135-case/MQ2-Bottom-02.stl)
- [3D-models/MQ-135-case/MQ2-Top-02.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/MQ-135-case/MQ2-Top-02.stl)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | Wi-Fi controller | Not verified |
| 1 | [BME280 Environment Sensor](https://makhex.com/shop/bme280-sensor/) | Ambient sensing | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench supply | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Verify the BME280 wiring and supply.
2. Read temperature and humidity.
3. Publish a small read-only local dashboard.
4. Mark stale readings and connection failures.
5. Optionally add a separately qualified soil probe.

### Project-specific preflight
- Confirm the BME280, not BMP280, part number and correct 3.3 V supply.
- Select a safe Wi-Fi-only local dashboard with no exposed internet control endpoint.

## Acceptance tests — evidence not yet supplied
- [ ] Room readings update at the chosen interval with units.
- [ ] Power interruption and sensor disconnect are distinguished in the UI.
- [ ] A calibration limitation note is visible next to readings.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Ambient humidity is not soil moisture. Do not infer watering status without a soil sensor.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Create a read-only local web page with age-of-data indication.
2. Provide serial logs and troubleshooting for common I2C address differences.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.
