# MAKHEX Engineering Package 06 — E-Paper Desk Calendar

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/trandi/e-paper-calendar
- License: Apache-2.0
- Credited physical reference photo: /reference-builds/epaper-desk-calendar.webp
- MAKHEX-hosted videos: none
- External demo: https://youtu.be/xnUqWcdtqyU
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/trandi/e-paper-calendar
- Pinned original-source commit: ac1036823d663cf95093bc501bffe17fc1436b9c

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [freecad/ePaperCalendar_Box.FCStd](https://github.com/trandi/e-paper-calendar/blob/ac1036823d663cf95093bc501bffe17fc1436b9c/freecad/ePaperCalendar_Box.FCStd)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | Controller | Not verified |
| 1 | [2.9″ E-Paper Display](https://makhex.com/shop/epaper-29/) | Display | Not verified |
| 1 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench power | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Select the correct e-paper driver library.
2. Render a static test pattern.
3. Synchronize time and timezone safely.
4. Use correct refresh intervals and full-refresh maintenance.
5. Measure sleep current before battery testing.

### Project-specific preflight
- Match the 2.9-inch panel controller and FPC to its library; current supplier bundle is not yet verified.
- Choose a reliable timezone and offline fallback when NTP cannot be reached.

## Acceptance tests — evidence not yet supplied
- [ ] A static test pattern renders cleanly.
- [ ] Date/time remain correct through a restart and network loss.
- [ ] Deep sleep and refresh intervals are measured and documented.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Panel ghosting and burn-in may result from incorrect refresh behavior; consult module documentation.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Make controller-selection checks explicit before library recommendations.
2. Provide a safe demo without requiring personal calendar credentials.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

