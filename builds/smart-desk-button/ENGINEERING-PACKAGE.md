# MAKHEX Engineering Package 10 — One-Press Smart Button

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/aamat09/baby-tracker-suite
- License: MIT
- Credited physical reference photo: /reference-builds/smart-desk-button.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/aamat09/baby-tracker-suite
- Pinned original-source commit: 28ad8d11ae8719f47d0f073007ca4e96645f082e

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [baby-remote/kicad/baby-remote.kicad_pcb](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/kicad/baby-remote.kicad_pcb)
- [baby-remote/kicad/baby-remote.kicad_sch](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/kicad/baby-remote.kicad_sch)
- [baby-remote/scad/baby-remote-back-cover.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-back-cover.scad)
- [baby-remote/scad/baby-remote-back-cover.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-back-cover.stl)
- [baby-remote/scad/baby-remote-label-plate-base.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate-base.stl)
- [baby-remote/scad/baby-remote-label-plate-letters.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate-letters.stl)
- [baby-remote/scad/baby-remote-label-plate.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate.scad)
- [baby-remote/scad/baby-remote-label-plate.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate.stl)
- [baby-remote/scad/baby-remote-pcb-case.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb-case.scad)
- [baby-remote/scad/baby-remote-pcb-case.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb-case.stl)
- [baby-remote/scad/baby-remote-pcb.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb.scad)
- [baby-remote/scad/baby-remote-pcb.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb.stl)
- [baby-remote/scad/button_plunger.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/button_plunger.stl)
- [baby-remote/scad/dims.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/dims.scad)
- [baby-remote/scad/led_window.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/led_window.stl)
- [baby-remote/labels/baby-remote-labels.pdf](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/labels/baby-remote-labels.pdf)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | Input controller | Not verified |
| 1 | [Addressable RGB LEDs](https://makhex.com/shop/ws2812-leds/) | Status LED | Not verified |
| 1 | [6 mm Momentary Pushbutton](https://makhex.com/shop/momentary-tactile-switch/) | Physical momentary input | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench power | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Choose a safe input pin for a pushbutton.
2. Debounce and distinguish press patterns.
3. Run a mock local action first.
4. Report success or failure with LED status.
5. Keep credentials out of Git history.

### Project-specific preflight
- The research BOM lists a 6 mm momentary switch; its exact fit and electrical configuration are not yet verified.
- Choose an ESP32-C3 GPIO that is not a boot strapping conflict on the actual board.

## Acceptance tests — evidence not yet supplied
- [ ] Short and long presses are debounced consistently.
- [ ] LED state distinguishes acknowledgement from timeout.
- [ ] No API secret is stored in source or sent in a public request.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Do not embed private API tokens or expose unauthenticated control endpoints.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Write a pin-selection and debounce test matrix.
2. Implement local no-op mock action before real network integration.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

