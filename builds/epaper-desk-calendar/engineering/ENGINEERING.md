# MAKHEX engineering reference — Build 06: E-Paper Desk Calendar

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-C3 SuperMini candidate with 2.9-inch SPI e-paper; controller revision unresolved
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [trandi/e-paper-calendar](https://github.com/trandi/e-paper-calendar/tree/ac1036823d663cf95093bc501bffe17fc1436b9c) at commit `ac1036823d663cf95093bc501bffe17fc1436b9c` (GitHub license metadata: `Apache-2.0`). Original media may show **different** hardware.
- **Software approach:** SPI example is a bus smoke test only. GxEPD2 commit de82887e77a78528ea386e68bba2cb0291d2c319 targets an Arduino library; do not mix it into an IDF build without an explicit framework port. Exact EPD driver waveform is vendor-dependent.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 1 | Controller |
| `epaper-29` | 1 | Display |
| `usb-c-power-kit` | 1 | Bench power |

### Additional engineering items and gaps
- Exact e-paper controller, flex connector and refresh behavior must be identified. Upstream FreeCAD case is not proven to fit the proposed 2.9-inch panel.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/spi_master/lcd`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/spi_master/lcd](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/spi_master/lcd)

### Relevant engineering references
- https://github.com/ZinggJM/GxEPD2/tree/de82887e77a78528ea386e68bba2cb0291d2c319

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| ESP32-C3 3V3 | e-paper VCC | 3.3 V if selected breakout is rated | Do not assume bare panel can accept 5 V |
| ESP32-C3 GND | e-paper GND | Common reference | Unpowered continuity |
| GPIO7 (proposed) | e-paper DIN / MOSI | SPI data output | Check board header and panel datasheet |
| GPIO6 (proposed) | e-paper CLK | SPI clock | Use low initial clock until validated |
| GPIO10 (proposed) | e-paper CS | Active-low select | Check boot pin use against board revision |
| GPIO3 (proposed) | e-paper DC | Data/command | Logic 3.3 V |
| GPIO4 (proposed) | e-paper RST | Reset | Respect panel initialization timing |
| e-paper BUSY | GPIO5 (proposed) | Busy input 3.3 V | Never ignore BUSY completion |

## Available original CAD, PCB and 3D models

- [freecad/ePaperCalendar_Box.FCStd](https://github.com/trandi/e-paper-calendar/blob/ac1036823d663cf95093bc501bffe17fc1436b9c/freecad/ePaperCalendar_Box.FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Select the correct e-paper driver library.
6. Render a static test pattern.
7. Synchronize time and timezone safely.
8. Use correct refresh intervals and full-refresh maintenance.
9. Measure sleep current before battery testing.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Photograph panel/FPC and read controller part number: Compare with manufacturer waveform/application note | Controller ID and LUT/driver compatibility established | NOT RUN |
| 02 | Render checkerboard and full-black/white pages: Capture images after full refresh and inspect ghosting | No stuck pixel region or ghosting beyond documented panel limit | NOT RUN |
| 03 | Set timezone and sync UTC from network: Test near a local day boundary | Correct calendar date and daylight-saving behavior | NOT RUN |
| 04 | Remove Wi-Fi and restart: Observe NTP offline handling | Time validity clearly indicated rather than made up | NOT RUN |
| 05 | Measure sleep current and safe refresh cadence: Log current and 20 update cycles | Measurable current, no excessive repeated full refresh | NOT RUN |

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
