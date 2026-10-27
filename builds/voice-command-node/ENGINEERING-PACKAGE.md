# MAKHEX Engineering Package 02 — Offline Voice Command Node

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/muhammedsaban/dudley
- License: MIT
- Credited physical reference photo: /reference-builds/voice-command-node.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/muhammedsaban/dudley
- Pinned original-source commit: 61e7e08e53593db093a663f49a375c982a2e7530

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [hardware/enclosure/dudley-enclosure.scad](https://github.com/muhammedsaban/dudley/blob/61e7e08e53593db093a663f49a375c982a2e7530/hardware/enclosure/dudley-enclosure.scad)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-S3 Dev Board](https://makhex.com/shop/esp32-s3-devkit/) | Processor | Not verified |
| 1 | [I²S MEMS Microphone](https://makhex.com/shop/i2s-mems-mic/) | Audio input | Not verified |
| 1 | [I²S Speaker Amplifier](https://makhex.com/shop/i2s-amplifier/) | Speaker driver | Not verified |
| 1 | [Mini 4 Ω / 3 W Speaker](https://makhex.com/shop/speaker-4ohm-3w/) | External mini loudspeaker | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Stable supply | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Verify microphone and amplifier independently.
2. Check memory and firmware SDK compatibility.
3. Build push-to-talk with a visible recording indicator.
4. Benchmark a small on-device command recognizer.
5. Add error recovery and timeout handling.

### Project-specific preflight
- Select an electrically compatible 3.3 V I2S microphone, amplifier and speaker; the speaker is included in the research BOM but its exact amp/connector pairing has not been qualified.
- Verify the board has sufficient PSRAM and use a hardware control with an unmistakable microphone-active indicator.

## Acceptance tests — evidence not yet supplied
- [ ] Record and play back intelligible audio without buffer underruns.
- [ ] Recognize three documented commands under a measured noise condition.
- [ ] The device visibly stops listening on timeout and never silently records.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
General-purpose offline speech recognition is not practical on all ESP32 modules; verify model memory needs.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Document separate microphone and amplifier bring-up procedures before the combined firmware.
2. Record the recognition model, memory allocation and repeatable latency benchmark.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

