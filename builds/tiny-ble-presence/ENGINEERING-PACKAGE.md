# MAKHEX Engineering Package 03 — Tiny BLE Beacon

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/BrunoGG69/Spottr
- License: AGPL-3.0
- Credited physical reference photo: /reference-builds/tiny-ble-presence.webp
- MAKHEX-hosted videos: none
- External demo: https://youtu.be/ntAMRt7f-G8
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/BrunoGG69/Spottr
- Pinned original-source commit: 84c41ea06001f933619bf7672d484fcbd66c7eb5

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [cad/SPOTTR_CARD_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_CARD_BODY.stl)
- [cad/SPOTTR_SCANNER_BOX_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_SCANNER_BOX_BODY.stl)
- [cad/SPOTTR_SCANNER_TOP_LID_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_SCANNER_TOP_LID_BODY.stl)
- [cad/SPOTTR_TOP_LID_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_TOP_LID_BODY.stl)
- [cad/step-files/SPOTTR_BADGE.step](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/step-files/SPOTTR_BADGE.step)
- [cad/step-files/SPOTTR_SCANNER.step](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/step-files/SPOTTR_SCANNER.step)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | BLE transmitter | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Development supply | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Flash a supported BLE advertising example.
2. Set a non-identifying payload.
3. Verify visibility from a BLE scanner.
4. Measure active and sleep currents.
5. Document range and privacy tradeoffs.

### Project-specific preflight
- Check the ESP32-C3 board revision and BLE stack support in your chosen ESP-IDF release.
- Use a test identifier unrelated to any person, device owner or real-world asset.

## Acceptance tests — evidence not yet supplied
- [ ] A standard BLE scanner sees the advertised demo service.
- [ ] Payload and transmit interval match the documented firmware.
- [ ] Measured idle and transmit current are recorded with the meter setup.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Never use a BLE beacon to secretly identify or track individuals.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Publish a tiny NimBLE advertising project with reproducible scanner steps.
2. Include privacy limits, rotation interval and current-measurement methodology.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.
