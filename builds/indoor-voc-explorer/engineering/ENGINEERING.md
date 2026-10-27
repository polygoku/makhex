# MAKHEX engineering reference — Build 07: Indoor VOC Explorer

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-S3 DevKitC-1 N8R8 plus SGP40 and BME280 3.3-V I2C breakout modules
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [koenvervloesem/esphome-air-quality-monitor](https://github.com/koenvervloesem/esphome-air-quality-monitor/tree/acff085bf7ee94120aadeeb3bae73f3d337e15e5) at commit `acff085bf7ee94120aadeeb3bae73f3d337e15e5` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** An I2C scan alone cannot generate a valid VOC index. Pin Sensirion SGP40 driver at 25a85e2dc9f7b0f96dbf0989162abb5beeb2bd6e and Gas Index Algorithm at 2ef9f13d225e8a0dedd3ff42dd229af4dbb1aae4; port/build those before presenting quantitative output.

| Component | Qty | Role |
|---|---:|---|
| `esp32-s3-devkit` | 1 | Controller |
| `sgp40-voc` | 1 | VOC sensor |
| `bme280-sensor` | 1 | Compensation |
| `usb-c-power-kit` | 1 | Bench supply |

### Additional engineering items and gaps
- VOC index is a relative trend with warm-up/baseline behavior; no CO2, PM or life-safety claims.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/i2c/i2c_tools`, run `idf.py set-target esp32s3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/i2c/i2c_tools](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/i2c/i2c_tools)

### Relevant engineering references
- https://github.com/Sensirion/arduino-i2c-sgp40/tree/25a85e2dc9f7b0f96dbf0989162abb5beeb2bd6e
- https://github.com/Sensirion/gas-index-algorithm/tree/2ef9f13d225e8a0dedd3ff42dd229af4dbb1aae4

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| ESP32-S3 3V3 | SGP40 VCC and BME280 VCC | 3.3 V only | Breakout-specific regulators and load check |
| ESP32-S3 GND | SGP40 GND and BME280 GND | Shared reference | Continuity check |
| GPIO4 (proposed) | SGP40 SDA and BME280 SDA | 3.3 V I2C | SGP40 address 0x59, BME280 0x76/0x77 |
| GPIO5 (proposed) | SGP40 SCL and BME280 SCL | 3.3 V I2C | Pullups to 3V3 only, avoid duplicate strong pullups |

## Available original CAD, PCB and 3D models

- No native mechanical or PCB design source identified in this original repository at the locked commit; do not claim a CAD kit exists.

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Verify each sensor on its own.
6. Supply humidity and temperature compensation.
7. Log timestamped data with warm-up status.
8. Render relative trend visualizations.
9. Explain error and sensor baseline behavior.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Scan both I2C addresses: Confirm SGP40 0x59 and BME280 0x76/0x77 | Both visible without conflicts | NOT RUN |
| 02 | Use RH/temperature compensation and checksum validation: Log compensated raw signals and measurement timing | SGP40 readings accepted with algorithm input evidence | NOT RUN |
| 03 | Run a documented baseline warm-up: Log sample interval, warm-up duration and VOC index | VOC trend appears only after valid warm-up | NOT RUN |
| 04 | Ventilate room under nonhazardous conditions: Record trend before/after using reference conditions | Trend changes recorded, no false quantitative CO2 statement | NOT RUN |
| 05 | Disconnect either sensor with power off; restart: Observe invalid compensation and stale state | System shows invalid rather than fabricated index | NOT RUN |

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
