# MAKHEX engineering reference — Build 02: Offline Voice Command Node

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** ESP32-S3 DevKitC-1 N8R8 candidate with INMP441 microphone + MAX98357A amp + 4-ohm/3-W speaker
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [muhammedsaban/dudley](https://github.com/muhammedsaban/dudley/tree/61e7e08e53593db093a663f49a375c982a2e7530) at commit `61e7e08e53593db093a663f49a375c982a2e7530` (GitHub license metadata: `MIT`). Original media may show **different** hardware.
- **Software approach:** ESP-IDF I2S example is a peripheral smoke test, not an offline speech application. An ESP-SR recognizer/model must be separately pinned, built and benchmarked for the selected PSRAM configuration.

| Component | Qty | Role |
|---|---:|---|
| `esp32-s3-devkit` | 1 | Processor |
| `i2s-mems-mic` | 1 | Audio input |
| `i2s-amplifier` | 1 | Speaker driver |
| `speaker-4ohm-3w` | 1 | External mini loudspeaker |
| `usb-c-power-kit` | 1 | Stable supply |

### Additional engineering items and gaps
- Add normally-open push-to-talk switch, safe microphone-active indicator, and rated amplifier supply/connector if not present in kit.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/peripherals/i2s/i2s_basic`, run `idf.py set-target esp32s3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/peripherals/i2s/i2s_basic](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/peripherals/i2s/i2s_basic)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32s3/api-reference/peripherals/i2s.html
- https://github.com/espressif/esp-sr/tree/78a923d29a45e4e1433b909d3da12ab5b0f994fc

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| S3 DevKitC-1 3V3 | INMP441 VDD | 3.3 V only | Verify module regulator and current |
| S3 GND | INMP441 GND and MAX98357A GND | 0 V common | Continuity before power |
| S3 GPIO4 (proposed) | INMP441 SCK + MAX98357A BCLK | I2S bit clock 3.3 V | Confirm board header and separate device timing |
| S3 GPIO5 (proposed) | INMP441 WS + MAX98357A LRC | I2S word select 3.3 V | Confirm shared sample-rate compatibility |
| INMP441 SD | S3 GPIO6 (proposed) | I2S RX data at 3.3 V | No 5 V on ESP32 inputs |
| S3 GPIO7 (proposed) | MAX98357A DIN | I2S TX data at 3.3 V | Check correct amplifier pin labels |
| Regulated 5 V rail (unqualified) | MAX98357A VIN | Amp supply only, if exact board accepts 5 V | Do not power 3 W into 4 ohms until thermal/current check |
| MAX98357A SPK+ and SPK- | 4-ohm speaker terminals | Floating bridge output | Neither SPK terminal goes to ground |
| S3 GPIO15 (proposed) via normally-open switch | GND | PTT active-low with pullup | Switch absent from original BOM; must be added before physical build |
| INMP441 L/R channel select | Ground or 3V3 per device datasheet | Select one channel | Never leave selection undefined |

## Available original CAD, PCB and 3D models

- [hardware/enclosure/dudley-enclosure.scad](https://github.com/muhammedsaban/dudley/blob/61e7e08e53593db093a663f49a375c982a2e7530/hardware/enclosure/dudley-enclosure.scad) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Verify microphone and amplifier independently.
6. Check memory and firmware SDK compatibility.
7. Build push-to-talk with a visible recording indicator.
8. Benchmark a small on-device command recognizer.
9. Add error recovery and timeout handling.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Prove microphone stream independently: Capture 10 seconds PCM, inspect nonzero samples and clip count | Valid PCM stream with no continuous clipping | NOT RUN |
| 02 | Prove amplifier independently at a conservative gain: Play test tone and inspect output waveform/current | Audible output without unexpected DC, overcurrent or overheating | NOT RUN |
| 03 | Measure combined I2S full duplex: Record and play back using captured buffers | No underrun/overrun in 5-minute test | NOT RUN |
| 04 | Benchmark exact speech-recognition model: Record model checksum, RAM/PSRAM usage, three fixed test phrases and noise level | Three documented commands detected with logged true/false results | NOT RUN |
| 05 | Prove privacy timeout and obvious capture indicator: Release PTT and wait timeout; monitor mic sampling state | No silent continued capture; indicator reflects recording | NOT RUN |

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
