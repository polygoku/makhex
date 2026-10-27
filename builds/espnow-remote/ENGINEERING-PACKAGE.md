# MAKHEX Engineering Package 09 — ESP-NOW Wireless Remote

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/ncmreynolds/sticky
- License: LGPL-2.1
- Credited physical reference photo: /reference-builds/espnow-remote.webp
- MAKHEX-hosted videos: none
- External demo: none confirmed
- Source design/3D assets: no validated native fabrication CAD/3D model in MAKHEX package
- Design source: https://github.com/ncmreynolds/sticky
- Pinned original-source commit: b58ed099d3bde7f70bcb61902868418367be6a6a

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [STLs/stickyDefaultBottomSection.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyDefaultBottomSection.stl)
- [STLs/stickyDefaultTopSection.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyDefaultTopSection.stl)
- [STLs/stickyFasciaVariant1.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyFasciaVariant1.stl)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 2 | [ESP32-C3 SuperMini](https://makhex.com/shop/esp32-c3-supermini/) | Transmitter and receiver | Not verified |
| 2 | [USB-C Prototyping Kit](https://makhex.com/shop/usb-c-power-kit/) | Bench supplies | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Flash both boards with compatible firmware.
2. Exchange peer identifiers securely.
3. Send packets with sequence IDs.
4. Measure drops and retry behavior.
5. Add authentication and safe timeout fallback.

### Project-specific preflight
- Use matching ESP32-C3 boards and firmware versions on both ends.
- Never connect the demo to a safety-critical actuator or lock.

## Acceptance tests — evidence not yet supplied
- [ ] Peer pairing is documented and repeatable.
- [ ] Each button event carries a sequence number and acknowledgement.
- [ ] Loss of link returns the receiver to a harmless idle state.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Not for safety-critical remote control or actuators.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Publish compatible sender/receiver firmware and a measurement script.
2. Document channel, pairing, auth and timeout assumptions.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

