# MAKHEX engineering reference — Build 10: One-Press Smart Button

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-C3 SuperMini, 6x6-mm normally-open tactile switch and 8-pixel status ring candidate
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [aamat09/baby-tracker-suite](https://github.com/aamat09/baby-tracker-suite/tree/28ad8d11ae8719f47d0f073007ca4e96645f082e) at commit `28ad8d11ae8719f47d0f073007ca4e96645f082e` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** Pinned GPIO example proves input/debounce foundation only. An optional RMT LED example implements status signaling; current BOM includes a candidate LED ring but not the required signal shifter.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 1 | Input controller |
| `ws2812-leds` | 1 | Status LED |
| `momentary-tactile-switch` | 1 | Physical momentary input |
| `usb-c-power-kit` | 1 | Bench power |

### Additional engineering items and gaps
- Add approved 5 V logic shifter, strain relief and suitable current-rated power. 50-piece switch pack is purchasing quantity, not 50 installed devices. Enclosure from referenced 15-button remote does not fit one-button PCB without redesign.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/gpio/generic_gpio`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/gpio/generic_gpio](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/gpio/generic_gpio)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/gpio.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| GPIO6 (proposed) | Momentary button terminal A | Input with internal pull-up | Not GPIO2/8/9 C3 boot-strapping pins |
| Momentary button terminal B | ESP32-C3 GND | Press pulls GPIO6 low | Confirm which pins connect internally on four-pin switch |
| GPIO3 (proposed) | 5 V tolerant buffer input | 3.3 V data | Level-shifter required when driving 5 V LED ring |
| Buffer output | 8-pixel LED DIN | 5 V WS2812-style serial data | Confirm selected LED option is addressable RGB |
| Regulated LED 5 V / GND | LED ring VCC/GND | Independent current-rated power | Keep grounds common; do not draw LED load from GPIO |

## Available original CAD, PCB and 3D models

- [baby-remote/kicad/baby-remote.kicad_pcb](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/kicad/baby-remote.kicad_pcb) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/kicad/baby-remote.kicad_sch](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/kicad/baby-remote.kicad_sch) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-back-cover.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-back-cover.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-back-cover.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-back-cover.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-label-plate-base.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate-base.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-label-plate-letters.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate-letters.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-label-plate.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-label-plate.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-label-plate.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-pcb-case.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb-case.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-pcb-case.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb-case.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-pcb.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/baby-remote-pcb.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/baby-remote-pcb.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/button_plunger.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/button_plunger.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/dims.scad](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/dims.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [baby-remote/scad/led_window.stl](https://github.com/aamat09/baby-tracker-suite/blob/28ad8d11ae8719f47d0f073007ca4e96645f082e/baby-remote/scad/led_window.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Choose a safe input pin for a pushbutton.
6. Debounce and distinguish press patterns.
7. Run a mock local action first.
8. Report success or failure with LED status.
9. Keep credentials out of Git history.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Start board with button released and pressed: Repeat 20 cold boots while watching boot serial | Always boots normally; no bootstrapping conflict | NOT RUN |
| 02 | Debounce with 100 short presses and 20 long presses: Log press duration and event counts | No duplicate accidental activations beyond measured threshold | NOT RUN |
| 03 | Execute mock local action only: No external services, record ACK and timeout result | Action never silently claims success | NOT RUN |
| 04 | Exercise LED states and full-off privacy: Scope data after shifter and measure power | Correct acknowledged/error/off pattern without overheating | NOT RUN |
| 05 | Inspect security of firmware and network interactions: Search flash logs and sources for tokens; attempt unauthenticated action | No embedded production secret or exposed unauthenticated control | NOT RUN |

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
