# MAKHEX engineering reference — Build 04: Connected Plant Monitor

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-C3 SuperMini candidate, BME280 breakout (not BMP280)
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [ConnerWill/esp32-plant](https://github.com/ConnerWill/esp32-plant/tree/284af7c31e6bce2de528f599f36ba47192eefc66) at commit `284af7c31e6bce2de528f599f36ba47192eefc66` (GitHub license metadata: `GPL-3.0`). Original media may show **different** hardware.
- **Software approach:** Use pinned I2C tools to confirm actual bus first. Bosch BME280 SensorAPI at c90d419492e26dd95586598a794e65eb2760753a is a driver reference, not a complete Wi-Fi web dashboard.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 1 | Wi-Fi controller |
| `bme280-sensor` | 1 | Ambient sensing |
| `usb-c-power-kit` | 1 | Bench supply |

### Additional engineering items and gaps
- Optional soil moisture probe is NOT included and no watering recommendation may be generated from BME280 alone.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/i2c/i2c_tools`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/i2c/i2c_tools](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/i2c/i2c_tools)

### Relevant engineering references
- https://github.com/boschsensortec/BME280_SensorAPI/tree/c90d419492e26dd95586598a794e65eb2760753a
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/i2c.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| ESP32-C3 3V3 | BME280 VCC | 3.3 V supply | Verify breakout is not BMP280 |
| ESP32-C3 GND | BME280 GND | Shared return | Meter continuity |
| GPIO4 (proposed) | BME280 SDA | 3.3 V I2C SDA | Check vendor SuperMini pinout and pullups |
| GPIO5 (proposed) | BME280 SCL | 3.3 V I2C clock | Check pullup voltage and address 0x76/0x77 |

## Available original CAD, PCB and 3D models

- [3D-models/DHT22-case/DHT22_bottom.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/DHT22-case/DHT22_bottom.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/DHT22-case/DHT22_top.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/DHT22-case/DHT22_top.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/ESP32-housing/ESP32-housing.3mf](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/ESP32-housing/ESP32-housing.FCStd](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.FCStd) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/ESP32-housing/ESP32-housing.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/ESP32-housing/ESP32-housing.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/MQ-135-case/MQ2-Bottom-02.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/MQ-135-case/MQ2-Bottom-02.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [3D-models/MQ-135-case/MQ2-Top-02.stl](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/3D-models/MQ-135-case/MQ2-Top-02.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [schematics/esp32-plant.fzz](https://github.com/ConnerWill/esp32-plant/blob/284af7c31e6bce2de528f599f36ba47192eefc66/schematics/esp32-plant.fzz) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Verify the BME280 wiring and supply.
6. Read temperature and humidity.
7. Publish a small read-only local dashboard.
8. Mark stale readings and connection failures.
9. Optionally add a separately qualified soil probe.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Read sensor chip identity: Scan I2C and read BME280 ID register 0xD0 | Chip returns 0x60; BMP280 is rejected | NOT RUN |
| 02 | Read calibrated temperature, RH and pressure: Compare with reference thermometer/hygrometer/barometer and serial log | All units and calibration limitations displayed; log actual deviations | NOT RUN |
| 03 | Publish local dashboard without internet endpoint: Use local Wi-Fi only and check network exposure | Timestamp and all three values present | NOT RUN |
| 04 | Power-cycle while preserving honest timestamps: Disconnect/reconnect power and inspect UI | No stale value represented as new data | NOT RUN |
| 05 | Simulate sensor disconnect with system powered off before disconnect: Restart with absent sensor and inspect dashboard | Explicit unavailable state; no watering advice | NOT RUN |

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
