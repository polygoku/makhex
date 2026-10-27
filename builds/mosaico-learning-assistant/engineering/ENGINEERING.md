# MAKHEX engineering reference — Build 11: AI Photo & Voice Learning Assistant

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP-Mosaico ESP32-S31 Core Unit V1.2, LEFT H2 camera module (V1.4 SC101IOT candidate), onboard speaker/microphone
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [samyeei/mosaico-learning-assistant](https://github.com/samyeei/mosaico-learning-assistant/tree/3fcdf1c176bff2c2d3614b9419837179536e4a41) at commit `3fcdf1c176bff2c2d3614b9419837179536e4a41` (GitHub license metadata: `NOASSERTION`). Original media may show **different** hardware.
- **Software approach:** Original samyeei software describes v1.0.0 for legacy Recovery ABI 1/layout 4. It is NOT validated with modern Vibe Mode 0.2/Recovery ABI 2, and no commercial code/firmware license is granted. Do not flash or downgrade absent compatibility and rights evidence.

| Component | Qty | Role |
|---|---:|---|
| `esp-mosaico-vision-combo-kit` | 1 | ESP32-S31 touchscreen core with dedicated left-slot camera; interaction module included |

### Additional engineering items and gaps
- Cloud-region/model/account cost, privacy, child data and noncommercial firmware rights are distinct software release gates.

## Reproducible software reference
This build has no generic ESP32 development-board flash command. Use the original creator software strictly at its pinned revision after checking device revision, licensing and bootloader/recovery compatibility.
Source: [samyeei/mosaico-learning-assistant](https://github.com/samyeei/mosaico-learning-assistant/tree/3fcdf1c176bff2c2d3614b9419837179536e4a41)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide.html
- https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_camera.html
- https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_interact.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| ESP-Mosaico LEFT H2 connector | Matching ESP-Mosaico camera module | Vendor-defined board-to-board signals | Power off before install; confirm SC101IOT versus OV3640 and correct H2 orientation |
| ESP-Mosaico Core Unit | Onboard touch display | Factory internal interface | No invented GPIO map; preserve factory wiring |
| ESP-Mosaico Core Unit | Onboard mic and speaker | Factory internal interface | No external microphone or speaker needed |
| Rated USB-C data cable | ESP-Mosaico USB-C | Manufacturer-rated USB | Read recovery ABI/version without destructive flashing |

## Available original CAD, PCB and 3D models

- No native mechanical or PCB design source identified in this original repository at the locked commit; do not claim a CAD kit exists.

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Identify an actual ESP-Mosaico ESP32-S31 Core Unit V1.2 and its matching camera module; generic ESP32-S3 boards cannot run this project.
6. Read the original software license and compatibility notes. The released application is noncommercial and limited to legacy Recovery ABI 1 / layout 4.
7. Confirm hardware revision, included USB data cable, firmware recovery layout and camera module type before connecting or installing anything.
8. With power off, insert the camera module in the LEFT H2 expansion slot; use the onboard microphone and speaker.
9. On a compatible legacy test device only, follow the original author’s matching-tool installation guide. Do not downgrade modern Vibe Mode 0.2 / ABI 2 firmware.
10. Set up the device with 2.4 GHz Wi-Fi and a personal Alibaba Cloud Model Studio (Qwen/DashScope) API key; check region and service charges.
11. Test camera preview, multi-question selection, spoken prompts, and page-by-page explanations with non-sensitive sample questions.
12. Treat English UI, U.S. curriculum alignment, child-data privacy and licensing as separate unverified adaptation requirements, not shipped features.
13. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Photograph Core PCB ID, camera module and ABI: Read factory diagnostic/version screens without flashing | Core v1.2, camera model and recovery ABI logged | NOT RUN |
| 02 | Prove camera preview on factory-authorized compatible firmware: Use non-identifying sample worksheet | Correct orientation and stable image recorded | NOT RUN |
| 03 | Test Wi-Fi onboarding and signed-in cloud model in permitted environment: Use personal test account, scrub all keys from evidence | Connection error/success logged without secret exposure | NOT RUN |
| 04 | Test recognition + spoken followup with synthetic worksheet: Record transcript quality and response latency | Measured English behavior; do not assume translation shipped | NOT RUN |
| 05 | Review legal and data protections for commercialization: Record license approval, data retention and student-data impact | No commercial deployment until software rights and privacy requirements satisfied | NOT RUN |

Complete [acceptance.csv](./acceptance.csv) and [bench-results.template.json](./bench-results.template.json) with signed observations. Keep customer PII, passwords and tokens out of public build evidence.

## Engineering release gate

- [ ] Purchased PCB/variant physically identified and matched to the source schematic
- [ ] All wiring and power connections validated with the hardware unpowered
- [ ] Exact firmware compiled, hash saved and actual board flashed
- [ ] Required source fabrication files verified, safely licensed and physically fitted
- [ ] All functional/safety tests pass with dated, reproducible bench evidence
- [ ] Additional electrical safety parts included in final revision BOM
- [ ] Separate supplier order/fulfillment testing completed before enabling purchase

**Status: reference documented; not bench certified or purchase ready.**
