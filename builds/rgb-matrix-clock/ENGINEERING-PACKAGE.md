# MAKHEX Engineering Package 08 — Ambient RGB Clock

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/l0calgost/ledclock
- License: MIT
- Credited physical reference photo: /reference-builds/rgb-matrix-clock.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/l0calgost/ledclock
- Pinned original-source commit: dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [ledclock/models/3d-print/Colon_Diffusor_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Diffusor_Lid_v52.3mf)
- [ledclock/models/3d-print/Colon_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Segment_Lid_v52.3mf)
- [ledclock/models/3d-print/Colon_Segment_v54.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Segment_v54.3mf)
- [ledclock/models/3d-print/Diffusor Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Diffusor%20Lid_v52.3mf)
- [ledclock/models/3d-print/Digit_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Digit_Lid_v52.3mf)
- [ledclock/models/3d-print/Digit_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Digit_Segment_v52.3mf)
- [ledclock/models/3d-print/End_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/End_Segment_Lid_v52.3mf)
- [ledclock/models/3d-print/End_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/End_Segment_v52.3mf)
- [ledclock/models/3d-print/Start_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Start_Segment_Lid_v52.3mf)
- [ledclock/models/3d-print/Start_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Start_Segment_v52.3mf)
- [usermods/word-clock-matrix/Word Clock Baffle.stl](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/usermods/word-clock-matrix/Word%20Clock%20Baffle.stl)
- [ledclock/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/datasheets/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)
- [ledclock/datasheets/nxg-04_en_10031380.pdf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/datasheets/nxg-04_en_10031380.pdf)
- [ledclock/datasheets/nxg-t_en_10030915.pdf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/datasheets/nxg-t_en_10030915.pdf)
- [ledclock/datasheets/sc-caps.pdf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/datasheets/sc-caps.pdf)
- [ledclock/datasheets/ws2812b.pdf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/datasheets/ws2812b.pdf)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | LED controller | Not verified |
| 1 | [Addressable RGB LEDs](https://makhex.com/shop/ws2812-leds/) | Pixel array | Not verified |
| 1 | [5 V / 5 A LED Power Adapter (U.S. Plug)](https://makhex.com/shop/5v-5a-led-power/) | Regulated LED-array power | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Prototyping tools | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Budget current draw for worst-case LED brightness.
2. Test a small number of pixels on a correctly rated supply.
3. Use common ground and correct logic levels.
4. Synchronize time and impose brightness limits.
5. Add strain relief, diffusion and failure tests.

### Project-specific preflight
- Size a separate 5 V supply for the real LED count; a candidate 5 V/5 A supply is listed, but its U.S. safety rating, wiring and under-load performance are not verified.
- Confirm ESP32-to-pixel logic compatibility and wiring length; add an appropriate level shifter if needed.

## Acceptance tests — evidence not yet supplied
- [ ] A small pixel subset lights without power or data faults.
- [ ] Current draw at the imposed brightness cap stays under the measured supply limit.
- [ ] Loss of time-sync is displayed distinctly from valid time.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Never source LED strip current from microcontroller GPIO.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Calculate current budget from verified LED quantity and brightness constraints.
2. Provide firmware color order, power injection and safe startup behavior.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

