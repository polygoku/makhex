# MAKHEX engineering reference — Build 05: Local Camera Event Trigger

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-S3 camera bundle is unqualified; exact image sensor, PSRAM, pin map and voltage unknown
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [bernardoeugster/espseccam](https://github.com/bernardoeugster/espseccam/tree/94a43104daf148dbbf95af91cf6563b9ff44d9b2) at commit `94a43104daf148dbbf95af91cf6563b9ff44d9b2` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** The IDF DVP example is not a guarantee that the unknown camera board is compatible. Use esp32-camera commit f37e65608f709bd94846dee01d947f02ae07c0b0 only after sensor/pin assignments are identified.

| Component | Qty | Role |
|---|---:|---|
| `esp32-s3-camera` | 1 | Camera platform |
| `usb-c-power-kit` | 1 | Stable supply |

### Additional engineering items and gaps
- Camera-active status LED and locally controlled deletion must exist; no remote streaming or hidden monitoring.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/camera/dvp_spi_lcd`, run `idf.py set-target esp32s3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/camera/dvp_spi_lcd](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/camera/dvp_spi_lcd)

### Relevant engineering references
- https://github.com/espressif/esp32-camera/tree/f37e65608f709bd94846dee01d947f02ae07c0b0

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| Board USB/data input | ESP32-S3 camera board USB | Manufacturer-rated power only | Never feed camera GPIO from 5 V |
| Sensor camera ribbon | PCB factory camera FPC connector | DVP signals; pin assignments unresolved | Verify exact ribbon orientation, sensor ID and GPIO mapping from schematic before power |
| Integrated frame-active status or external GPIO | Visible status indicator | LED output must be mapped | A camera-active indicator is required before private-scene use |

## Available original CAD, PCB and 3D models

- [hardware/enclosure/CAD/Archive/Mark I ESPSECCAM Circuit Support (discontinued).FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Archive/Mark%20I%20ESPSECCAM%20Circuit%20Support%20(discontinued).FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/enclosure/CAD/Archive/Mark II ESPSECCAM LID.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Archive/Mark%20II%20ESPSECCAM%20LID.FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/enclosure/CAD/Mark III ESPSECCAM BASE.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20BASE.FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/enclosure/CAD/Mark III ESPSECCAM BASE.step](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20BASE.step) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/enclosure/CAD/Mark III ESPSECCAM LID.FCStd](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20LID.FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/enclosure/CAD/Mark III ESPSECCAM LID.step](https://github.com/bernardoeugster/espseccam/blob/94a43104daf148dbbf95af91cf6563b9ff44d9b2/hardware/enclosure/CAD/Mark%20III%20ESPSECCAM%20LID.step) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Check camera driver compatibility for the exact board.
6. Validate local frame capture and memory use.
7. Implement a lightweight frame-change detector.
8. Log non-sensitive events only.
9. Add visible camera-active status and deletion.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Photograph PCB, camera markings and PSRAM part: Record exact hardware IDs and vendor pin map | Sensor, lens, PSRAM and required rails known | NOT RUN |
| 02 | Capture single color-bar or static test frame: Check frame dimensions, JPEG SOI/EOI and heap | Frame decodes and heap margin is recorded | NOT RUN |
| 03 | Run repeatable known-scene event trigger: Use fixed lighting and move test card through field | Changes produce timestamped events at documented threshold | NOT RUN |
| 04 | Record false positives under 10 minutes of stable scene: No movement, stable lighting | False-event count measured and documented | NOT RUN |
| 05 | Verify obvious active indicator and deletion: Toggle capture state and clear local log | Indicator always matches capture; data deleted locally | NOT RUN |

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
