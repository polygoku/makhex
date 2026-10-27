# MAKHEX engineering reference — Build 03: Tiny BLE Beacon

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-C3 SuperMini candidate, specific vendor PCB and antenna layout unresolved
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [BrunoGG69/Spottr](https://github.com/BrunoGG69/Spottr/tree/84c41ea06001f933619bf7672d484fcbd66c7eb5) at commit `84c41ea06001f933619bf7672d484fcbd66c7eb5` (GitHub license metadata: `AGPL-3.0`). Original media may show **different** hardware.
- **Software approach:** Use pinned NimBLE advertising example as an SDK smoke test. Replace any default static identifier with demonstrably non-identifying rotating demo data before public operation.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 1 | BLE transmitter |
| `usb-c-power-kit` | 1 | Development supply |

### Additional engineering items and gaps
- No external sensor is required for the proposed BLE advertisement test; the original Spottr enclosure dimensions and PCB are different.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/bluetooth/nimble/bleprph`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/bluetooth/nimble/bleprph](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/bluetooth/nimble/bleprph)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-guides/ble.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| Host USB connector | ESP32-C3 SuperMini USB | USB-supplied bench power | Check USB voltage and board regulator |
| On-board 3V3 regulator | ESP32-C3 core | 3.3 V logic | Measure under BLE burst load |
| ESP32-C3 antenna region | Clear air space | 2.4 GHz RF | No metal enclosure covering antenna without validation |

## Available original CAD, PCB and 3D models

- [cad/SPOTTR_CARD_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_CARD_BODY.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [cad/SPOTTR_SCANNER_BOX_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_SCANNER_BOX_BODY.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [cad/SPOTTR_SCANNER_TOP_LID_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_SCANNER_TOP_LID_BODY.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [cad/SPOTTR_TOP_LID_BODY.stl](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/SPOTTR_TOP_LID_BODY.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [cad/step-files/SPOTTR_BADGE.step](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/step-files/SPOTTR_BADGE.step) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [cad/step-files/SPOTTR_SCANNER.step](https://github.com/BrunoGG69/Spottr/blob/84c41ea06001f933619bf7672d484fcbd66c7eb5/cad/step-files/SPOTTR_SCANNER.step) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Flash a supported BLE advertising example.
6. Set a non-identifying payload.
7. Verify visibility from a BLE scanner.
8. Measure active and sleep currents.
9. Document range and privacy tradeoffs.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Read chip/flash ID and record board revision: Use esptool chip_id and boot log; photograph PCB | Identified ESP32-C3, flash size, firmware checksum | NOT RUN |
| 02 | Advertise a non-personal service payload: Use a BLE scanner with date/time and RSSI log | Observed service UUID and expected payload within 2 meters | NOT RUN |
| 03 | Rotate demo identifier without tracking: Capture three intervals and compare payload | Identifier changes at documented interval; no personal/device-owner strings | NOT RUN |
| 04 | Measure sleep/active supply current: Use current meter with USB meter resolution documented | Measured active/idle current and duty cycle reported | NOT RUN |
| 05 | Reboot and repeat scan: Power-cycle board twice | Reproducible advertisement startup and no boot-strap failure | NOT RUN |

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
