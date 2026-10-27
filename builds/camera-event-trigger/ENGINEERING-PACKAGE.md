# MAKHEX Engineering Package 05 — Local Camera Event Trigger

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/bernardoeugster/espseccam
- License: MIT
- Credited physical reference photo: /reference-builds/camera-event-trigger.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/bernardoeugster/espseccam
- Pinned original-source commit: 94a43104daf148dbbf95af91cf6563b9ff44d9b2

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [hardware/enclosure/CAD/Archive/Mark I ESPSECCAM Circuit Support (discontinued).FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Archive/Mark%20I%20ESPSECCAM%20Circuit%20Support%20(discontinued).FCStd)
- [hardware/enclosure/CAD/Archive/Mark II ESPSECCAM LID.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Archive/Mark%20II%20ESPSECCAM%20LID.FCStd)
- [hardware/enclosure/CAD/Mark III ESPSECCAM BASE.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20BASE.FCStd)
- [hardware/enclosure/CAD/Mark III ESPSECCAM BASE.step](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20BASE.step)
- [hardware/enclosure/CAD/Mark III ESPSECCAM LID.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20LID.FCStd)
- [hardware/enclosure/CAD/Mark III ESPSECCAM LID.step](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20LID.step)
- [docs/ESP32_Security_Camera.pdf](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/docs/ESP32_Security_Camera.pdf)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-S3 Camera Board](https://makhex.com/shop/esp32-s3-camera/) | Camera platform | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Stable supply | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Check camera driver compatibility for the exact board.
2. Validate local frame capture and memory use.
3. Implement a lightweight frame-change detector.
4. Log non-sensitive events only.
5. Add visible camera-active status and deletion.

### Project-specific preflight
- Verify the exact camera module, lens, GPIO assignment and PSRAM capacity; bundle compatibility is currently on HOLD.
- Point the camera at an explicitly consented, non-sensitive test scene.

## Acceptance tests — evidence not yet supplied
- [ ] A stable frame stream runs within measured memory limits.
- [ ] A synthetic scene change creates a timestamped local event.
- [ ] An obvious camera-active indicator and local event deletion work.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Do not present an unverified prototype as a safety or security monitoring product.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Pin down camera sensor model, frame size and PSRAM usage first.
2. Offer deterministic fixture tests for false triggers under varying light.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

