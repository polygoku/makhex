# MAKHEX engineering reference — Build 08: Ambient RGB Clock

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-C3 SuperMini + 8x8 WS2812B RGB matrix + 5 V / 5 A external adapter candidate
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [l0calgost/ledclock](https://github.com/l0calgost/ledclock/tree/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f) at commit `dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** Pinned ESP-IDF RMT led_strip example is a pixel-driver test, not an NTP clock implementation. Pixel count 64, worst-case nominal 64 x 60 mA = 3.84 A at full-white; actual current and thermal limits must be measured.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 1 | LED controller |
| `ws2812-leds` | 1 | Pixel array |
| `5v-5a-led-power` | 1 | Regulated LED-array power |
| `usb-c-power-kit` | 1 | Prototyping tools |

### Additional engineering items and gaps
- Required but absent from current project BOM: 5 V logic level shifter, fuse/holder, rated barrel/terminal adapter and power wiring. Exact NRTL certification of PSU remains on HOLD.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/rmt/led_strip`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/rmt/led_strip](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/rmt/led_strip)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/rmt.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| ESP32-C3 GPIO3 (proposed) | 5 V-compatible logic buffer input | 3.3 V data logic | Required level shifter SN74AHCT125-class after device verification |
| Logic buffer output | WS2812B first DIN | 5 V logic DIN | Test scope high/low and rise time |
| Regulated 5 V 5 A PSU through correctly sized fuse | WS2812 matrix 5 V | High-current 5 V supply | Verify certified supply, current, connector and cable rating |
| PSU GND | LED GND + ESP32-C3 GND | Single common signal reference | Avoid powering LED array from ESP32 board USB |
| USB bench supply | ESP32-C3 USB connector | Independent controller power | Do not connect incompatible 5 V rails or backfeed board |

## Available original CAD, PCB and 3D models

- [ledclock/models/3d-print/Colon_Diffusor_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Diffusor_Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Colon_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Segment_Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Colon_Segment_v54.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Colon_Segment_v54.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Diffusor Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Diffusor%20Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Digit_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Digit_Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Digit_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Digit_Segment_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/End_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/End_Segment_Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/End_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/End_Segment_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Start_Segment_Lid_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Start_Segment_Lid_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [ledclock/models/3d-print/Start_Segment_v52.3mf](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/ledclock/models/3d-print/Start_Segment_v52.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [usermods/word-clock-matrix/Word Clock Baffle.stl](https://github.com/l0calgost/ledclock/blob/dc0aa1fdd8ed1cc4ed7425fe5ff23bf732dfd09f/usermods/word-clock-matrix/Word%20Clock%20Baffle.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Budget current draw for worst-case LED brightness.
6. Test a small number of pixels on a correctly rated supply.
7. Use common ground and correct logic levels.
8. Synchronize time and impose brightness limits.
9. Add strain relief, diffusion and failure tests.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Inspect supply safety marking and polarity with no load: Measure regulated output, connector polarity and protective devices | Verified approved adapter and measured voltage | NOT RUN |
| 02 | Power single pixel via level-shifted data: Scope DIN and measure current | Pixel colors match expected order; no invalid logic level | NOT RUN |
| 03 | Test 8x8 matrix brightness and supply current: Measure conservative brightness then increase only within safe measured limits | No brownouts, PSU overheat or wire heating | NOT RUN |
| 04 | Prove date/time synchronization and fallback: Interrupt Wi-Fi and power-cycle | Clock displays invalid-time state until sync | NOT RUN |
| 05 | Run 30-minute color-cycle thermal check: Measure board, connector and PSU temperatures | Record stable temperatures and fuse behavior | NOT RUN |

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
