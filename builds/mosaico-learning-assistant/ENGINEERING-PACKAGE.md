# MAKHEX Engineering Package 11 — AI Photo & Voice Learning Assistant

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/samyeei/mosaico-learning-assistant
- License: PolyForm Noncommercial 1.0.0
- Credited physical reference photo: not locally hosted
- MAKHEX-hosted videos: /demo/build11-en-concept.mp4
- External demo: https://x.com/samyeeiyu/status/2113491864078991859
- Source design/3D assets: upstream reference firmware is noncommercial, commercial distribution not authorized
- Design source: https://github.com/samyeei/mosaico-learning-assistant
- Pinned original-source commit: 3fcdf1c176bff2c2d3614b9419837179536e4a41

### Native source files (original build, not verified compatible with MAKHEX BOM)
- No source CAD/3D/PDF files indexed.

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 1 | [ESP-Mosaico Vision Combo Kit](https://makhex.com/shop/esp-mosaico-vision-combo-kit/) | ESP32-S31 touchscreen core with dedicated left-slot camera; interaction module included | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Identify an actual ESP-Mosaico ESP32-S31 Core Unit V1.2 and its matching camera module; generic ESP32-S3 boards cannot run this project.
2. Read the original software license and compatibility notes. The released application is noncommercial and limited to legacy Recovery ABI 1 / layout 4.
3. Confirm hardware revision, included USB data cable, firmware recovery layout and camera module type before connecting or installing anything.
4. With power off, insert the camera module in the LEFT H2 expansion slot; use the onboard microphone and speaker.
5. On a compatible legacy test device only, follow the original author’s matching-tool installation guide. Do not downgrade modern Vibe Mode 0.2 / ABI 2 firmware.
6. Set up the device with 2.4 GHz Wi-Fi and a personal Alibaba Cloud Model Studio (Qwen/DashScope) API key; check region and service charges.
7. Test camera preview, multi-question selection, spoken prompts, and page-by-page explanations with non-sensitive sample questions.
8. Treat English UI, U.S. curriculum alignment, child-data privacy and licensing as separate unverified adaptation requirements, not shipped features.

### Project-specific preflight
- Use the official ESP-Mosaico Vision Combo Kit, not a generic ESP32-S3 camera board. Confirm Core Unit V1.2, camera module revision and a USB data cable.
- The original v1.0.0 image supports old Recovery ABI 1 / layout 4 only; DO NOT install on a current Vibe Mode 0.2 / ABI 2 device or bypass recovery checks.
- The original author licenses the application under PolyForm Noncommercial 1.0.0. MAKHEX does not bundle, translate, redistribute, preinstall or commercially license the software.
- A personal Alibaba Cloud Model Studio / Bailian (Qwen) account, supported region and paid API key are required for the original app. Verify service access from the United States and avoid sharing personal or student information.

## Acceptance tests — evidence not yet supplied
- [ ] Check that the dedicated camera preview works and the correct question can be selected before asking for an explanation.
- [ ] Demonstrate a spoken follow-up and a visible transcript confirmation with non-sensitive test data on a licensed, compatible device.
- [ ] Record firmware ABI, model region, language, camera revision and test results rather than claiming English support.
- [ ] For a future U.S. product, establish commercial software rights or independently build a replacement and test English speech, UI, U.S. grades 1–12 and privacy before launch.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Reference software: PolyForm Noncommercial 1.0.0; do not sell, preinstall or rehost it without separate rights. Firmware v1.0.0 needs legacy Recovery ABI 1 / layout 4 and is incompatible with modern Vibe Mode 0.2 / ABI 2. English-language operation and U.S. model connectivity are unverified. Photos, recordings and prompts go to the user’s selected cloud service; do not submit student-identifying information.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Start with builds/mosaico-learning-assistant/README.md and the original source; keep the noncommercial code and assets out of a commercial distribution.
2. Audit legacy Recovery ABI 1 versus current ABI 2, camera sensor variant, minimum flash and service-region dependencies. Never downgrade or erase a customer device.
3. Research authorization for a commercial English localization or specify a clean-room implementation and original UX/assets with applicable licenses.
4. Qualify an exact ESP-Mosaico hardware supplier and U.S.-delivery quote via private Doroppu records before requesting Squarespace checkout approval.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.

