# MAKHEX engineering reference — Build 01: Touch Weather Station

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-S3 3.5-inch capacitive-touch board; exact purchased controller and PCB revision unresolved
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [Damov/esp32_weather_forecast_screen](https://github.com/Damov/esp32_weather_forecast_screen/tree/d5bcb4ca34e482d4091002b480df6bb5aa9072c2) at commit `d5bcb4ca34e482d4091002b480df6bb5aa9072c2` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** Use ESP-IDF v5.5.6 LCD/touch demonstration only after identifying LCD controller, touch IC, PSRAM and display connector mapping. It is NOT compatible by assumption with the MAKHEX board.

| Component | Qty | Role |
|---|---:|---|
| `esp32-s3-touch-35` | 1 | Touch interface |
| `bme280-sensor` | 1 | Environment readings |
| `usb-c-power-kit` | 1 | Bench power |

### Additional engineering items and gaps
- No case for the MAKHEX 3.5-inch PCB is qualified; upstream 4-inch case is not plug-compatible.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/lcd/spi_lcd_touch`, run `idf.py set-target esp32s3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/lcd/spi_lcd_touch](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/lcd/spi_lcd_touch)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32s3/api-reference/peripherals/lcd/index.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| USB data/power host | touch board USB connector | 5 V input only through rated onboard USB connector | Check board silk and power path; never backfeed 5 V into 3V3 |
| touch board regulated 3V3 | BME280 VCC | 3.3 V logic/supply | Check selected breakout current and its regulator before wiring |
| touch board GND | BME280 GND | 0 V shared reference | Continuity check while unpowered |
| touch board spare SDA pad (unresolved) | BME280 SDA | I2C; 3.3 V with pullups | Map schematic; do not reuse active LCD/touch GPIO |
| touch board spare SCL pad (unresolved) | BME280 SCL | I2C; 3.3 V with pullups | Check sensor address 0x76 or 0x77, no bus conflicts |
| integrated LCD and capacitive touch | board-local LCD/touch IC | PCB internal buses | No guessed display GPIO: read exact vendor PCB revision and panel IC |

## Available original CAD, PCB and 3D models

- [printable_3D_model/assembly.3mf](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/assembly.3mf) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [printable_3D_model/step/Back_Lid.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Back_Lid.STEP) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [printable_3D_model/step/Front_Lid.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Front_Lid.STEP) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [printable_3D_model/step/Mounting_Radar.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Mounting_Radar.STEP) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [printable_3D_model/step/Stand.STEP](https://github.com/Damov/esp32_weather_forecast_screen/blob/d5bcb4ca34e482d4091002b480df6bb5aa9072c2/printable_3D_model/step/Stand.STEP) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Identify the exact display and touch controller SKU.
6. Verify display firmware alone before adding peripherals.
7. Read BME280 sensor values over verified I²C pins.
8. Build LVGL screen states and stale-data warnings.
9. Stress-test touch, power and thermal behavior.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Record shipped PCB markings, display/touch controller IDs and schematic revision: Photograph front/back; reconcile accessible GPIO and 3V3 rail | All controller identifiers, pin mappings and voltage limits recorded | NOT RUN |
| 02 | Detect exact BME280 before enabling dashboard: Read chip ID and calibrated temp/RH/pressure over mapped I2C | Chip ID 0x60 and three valid values; fail instead of substituting BMP280 | NOT RUN |
| 03 | Verify display and touch on a matched driver: Render touch targets and capture serial initialization logs | Every target can be selected without invalid pixels or unregistered presses | NOT RUN |
| 04 | Run a 30-minute touch and sensor soak: Log timestamp, values, touch count, heap and faults | No lockup, values timestamped, sustained touch response | NOT RUN |
| 05 | Unplug sensor while powered only if breakout connection is designed for hotplug; otherwise power-cycle with disconnected sensor: Observe UI stale-data behavior and error log | No fabricated reading; explicit disconnected or stale indication | NOT RUN |

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
