# MAKHEX engineering reference — Build 09: ESP-NOW Wireless Remote

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** Two identical ESP32-C3 SuperMini modules powered independently over USB
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [ncmreynolds/sticky](https://github.com/ncmreynolds/sticky/tree/b58ed099d3bde7f70bcb61902868418367be6a6a) at commit `b58ed099d3bde7f70bcb61902868418367be6a6a` (GitHub license metadata: `LGPL-2.1`). Original media may show **different** hardware.
- **Software approach:** Use Espressif pinned ESP-NOW example as two-node reference. Sender emits a test sequence from serial commands; a physical button is not present in the initial BOM.

| Component | Qty | Role |
|---|---:|---|
| `esp32-c3-supermini` | 2 | Transmitter and receiver |
| `usb-c-power-kit` | 2 | Bench supplies |

### Additional engineering items and gaps
- No external button/actuator in baseline BOM. Use serial-triggered test packets; add a compatible switch only with a revised BOM.

## Reproducible software reference
The SDK example below is a **peripheral smoke test only**; it is not the complete project firmware:

`git clone --recursive -b v5.5.6 https://github.com/espressif/esp-idf.git`
`cd esp-idf`
`git rev-parse HEAD` must equal `880a203ae603d08a94d06aa01e0d6761958e5e9e`
After installing and activating ESP-IDF according to the platform instructions, enter `examples/wifi/espnow`, run `idf.py set-target esp32c3` and `idf.py build`.
**Do not execute flash until exact board pinout, peripheral variant and voltage conditions have passed the pre-power review.**
Source: [examples/wifi/espnow](https://github.com/espressif/esp-idf/tree/880a203ae603d08a94d06aa01e0d6761958e5e9e/examples/wifi/espnow)

### Relevant engineering references
- https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/network/esp_now.html

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| USB supply A | transmitter ESP32-C3 USB | Regulated onboard USB | Record board revision and MAC locally |
| USB supply B | receiver ESP32-C3 USB | Separate regulated USB | No shared hardware ground needed for wireless link |
| ESP32-C3 Wi-Fi radio A | ESP32-C3 Wi-Fi radio B | 2.4 GHz ESP-NOW packets | Pair using peer identifiers; do not reveal real device MAC publicly |

## Available original CAD, PCB and 3D models

- [STLs/stickyDefaultBottomSection.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyDefaultBottomSection.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [STLs/stickyDefaultTopSection.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyDefaultTopSection.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [STLs/stickyFasciaVariant1.stl](https://github.com/ncmreynolds/sticky/blob/b58ed099d3bde7f70bcb61902868418367be6a6a/STLs/stickyFasciaVariant1.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Flash both boards with compatible firmware.
6. Exchange peer identifiers securely.
7. Send packets with sequence IDs.
8. Measure drops and retry behavior.
9. Add authentication and safe timeout fallback.
10. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Record two chip IDs and firmware hashes: Flash pinned sample to each matching board | Both boot at consistent build revision | NOT RUN |
| 02 | Pair peers and send numbered messages: Send 100 tagged sequence numbers in controlled RF conditions | Capture ACK/loss/retry rates; no assumed zero loss | NOT RUN |
| 03 | Test peer authentication/encryption settings: Reject unknown peer and capture send status | Unpaired sender cannot trigger action | NOT RUN |
| 04 | Interrupt receiver power and observe sender: Log timeouts and safe fallback | Timeouts detected; no stale command executed | NOT RUN |
| 05 | Measure actual distance and current: Report room geometry, interference and idle/Tx current | Reproducible metrics and limitations recorded | NOT RUN |

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
