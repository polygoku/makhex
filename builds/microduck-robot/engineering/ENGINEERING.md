# MAKHEX engineering reference — Build 12: Microduck — AI Walking Robot

> **ENGINEERING REFERENCE, NOT A TESTED KIT.** Source revisions and schematic/reference models are documented. The actual MAKHEX fixture has not undergone pin verification, firmware build/flash, enclosure fit or physical acceptance.

## Hardware identity and BOM

- **Candidate hardware:** Radxa ZERO 3W 2-GB/no-eMMC with AMP2.0 October 15 HAT, STM32 IMU and 15 HD-1910-C001 serial servos
- **Exact supplier board/PCB revision:** UNVERIFIED — record manufacturer, PCB silkscreen, module, flash/PSRAM and measured rails before wiring.
- **Independent original source:** [kissqy/Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy/tree/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb) at commit `4f0d6cd5f17972ac8d4218dfcf458607de70c2eb` (GitHub license metadata: `NOASSERTION`). Original media may show **different** hardware.
- **Software approach:** Use kissqy source as independent robot build at pinned revision; original Oct 15 AMP2.0 HAT/IMU .epro2 and audited be8c106 source. No generic ESP32 firmware is applicable. Pin Radxa OS image, kernel and servo firmware only after original-version/hardware verification.

| Component | Qty | Role |
|---|---:|---|
| `feetech-hd1910` | 15 | Original HD-1910-C001 actuators |
| `radxa-zero-3w` | 1 | Original 2GB no-eMMC main computer |
| `microduck-hat` | 1 | AMP2.0 robot HAT control PCB |
| `microduck-imu` | 1 | Custom STM32-based IMU board |
| `imx219-160-camera` | 1 | 160-degree vision module |
| `vl53l5cx-v2` | 1 | V2 8×8 distance-sensing breakout |
| `npf550-power-kit` | 1 | Two batteries plus charger kit |
| `microduck-printed-parts` | 1 | Printed FrankenDuck chassis set / 3MF |
| `bearing-6700` | 5 | 10×15×3 mm bearings; purchase reference |
| `bearing-et2216` | 12 | 16×22×4 mm bearings; purchase reference |
| `speaker-4ohm-3w` | 1 | 3525-compatible 4Ω 3W speaker |
| `microduck-fasteners` | 1 | M2/M2.6 screw assortment |
| `amp20-servo-cables` | 1 | 10 and 20 cm AMP2.0 servo cables |
| `microduck-wiring-kit` | 1 | 22AWG harness wire and heat shrink |

### Additional engineering items and gaps
- NP-F550 lithium battery, servo stall-current/fusing, printed TPU plate 5 and exact PCB BOM need physical validation. CAD redistribution remains governed by original permissions.

## Reproducible software reference
This build has no generic ESP32 development-board flash command. Use the original creator software strictly at its pinned revision after checking device revision, licensing and bootloader/recovery compatibility.
Source: [kissqy/Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy/tree/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb)

### Relevant engineering references
- https://github.com/kissqy/Microduck-kissqy/tree/be8c106
- https://github.com/kissqy/Microduck-kissqy/blob/be8c106/hardware/AMP2.0-VERSION.en.md

## Proposed wiring and interfaces

This is a **connection plan**, not an electrical schematic signed off against the purchased PCB. Confirm each GPIO against the actual module variant. The editable source data is [wiring.csv](./wiring.csv); the generated connection chart is [wiring.svg](./wiring.svg).

| Origin | Destination | Electrical interface | Verify before power |
|---|---|---|---|
| HAT J13/J14 pin 1 | IMU J1 pin 1 / DXL bus GND | GND, 2.0 mm AMP2.0 3-pin | October 15 PCB only; no EH2.5 swap |
| HAT J13/J14 pin 2 | IMU J1 pin 2 / servo bus VDD | BATT_IN / DXL_VDD | Check actual battery voltage and actuator limit before power |
| HAT J13/J14 pin 3 | IMU J1 pin 3 / servo bus DATA | DXL_DATA | Verify half-duplex bus direction and connector pitch |
| IMU SWD J2 pin 1 / 2 / 3 / 4 / 5 | 3V3 / SWDIO / GND / SWCLK / NRST | STM32 SWD programming | Do not confuse with servo/battery connector |
| Radxa ZERO 3W, 2 GB / no eMMC | HAT board interface | Board-specific headers | Check 40-pin orientation/power net from EasyEDA design |
| HAT HP1.25 J1/J2/J9 | speaker / left mic / right mic | 1.25-mm audio headers | No AMP2.0 2-mm substitution for audio |

## Available original CAD, PCB and 3D models

- [docs/assets/assembly-battery-holder.stl](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/docs/assets/assembly-battery-holder.stl) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/ProPrj_HAT_REVA_SCH_2026-10-07.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_HAT_REVA_SCH_2026-10-07.epro2) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-07.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-07.epro2) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2) — actual original-creator design; compatibility with MAKHEX hardware NOT established
- [Source hash/print review](../../../docs/microduck-cad-review-20261025.md) — original print RAR: 36 STL + five-plate 3MF, plus four electronic PCB projects.

Upstream files are only linked. Original creator rights and physical fit must be checked before printing, PCB manufacturing, redistribution or resale. These are **not** interchangeable with a different MAKHEX board.

## Repeatable assembly and validation

1. Photograph the actual board(s), seller option, PCB silkscreen and connector orientation. Record exact part revisions and chip markings.
2. Read factory schematic/datasheets, reconcile all proposed connections in wiring.csv and mark unresolved pins as a HOLD.
3. With power removed, continuity-check 3V3/5V/GND, polarity, connector pin one, strapping GPIO and supply/ground isolation.
4. Install locked build tools, capture version output, compile the exact firmware implementation and hash the resulting image; the vendor SDK demo alone does not meet this gate.
5. Open the credited original English guide, confirm the exact October 15 AMP2.0 connector variant and print-layout release.
6. Download the original five-plate 3MF and STL source set. Inspect model scale, PLA versus TPU materials and choose one battery holder before slicing.
7. Assemble the 15 HD-1910-C001 servos and correct bearings with the printed chassis, securing cables with strain relief.
8. Inspect or fabricate the original HAT and IMU PCB revisions; flash the correct STM32 IMU firmware before connecting the servo bus.
9. Mount the Radxa ZERO 3W, IMX219 camera, VL53L5CX V2 sensor, speaker and protected NP-F550 supply.
10. Validate battery voltage/polarity, bus-pin mapping, connector pitch and independent power-up of each device.
11. Configure source-matched Linux/robot software, then calibrate servo IDs and joint limits without loading the legs.
12. Run conservative support/standing tests before source-guided walking and optional roller/reinforcement-learning demos.
13. Execute every acceptance test on the actual selected hardware and save measurement logs, photos and instrument metadata privately.

## Physical acceptance procedures — all tests currently NOT RUN

| ID | Procedure | Acceptance evidence | Result |
|---|---|---|---|
| 01 | Verify 3MF/RAR and four .epro2 hashes from archived review: Compare SHA256 manifest with source; inspect 3MF unit and print plates | All archive hashes match, mm units, TPU plate 5; no unreviewed files mixed | NOT RUN |
| 02 | Perform EasyEDA Pro ERC/DRC on matched Oct 15 revisions: Export rule reports and review regulator/trace widths | Zero unreviewed electrical/design violations | NOT RUN |
| 03 | Measure 15 servo IDs, torque-free joints, current and polarity: One-by-one unloaded bench test with overcurrent protection | Every ID unique and current within documented limits | NOT RUN |
| 04 | Print one diagnostic joint and fit hardware before batch: Measure servo pocket, bearing bores and sample part scale | Measured physical fit and non-interfering travel | NOT RUN |
| 05 | Bring up IMU, camera, ToF and Radxa software independently: Capture firmware/kernel versions and sensor logs | Source-matched devices enumerate and deliver valid data | NOT RUN |
| 06 | Run tethered stand then bounded low-speed gait: Log battery, temperatures, gait frames and emergency cutoff | Safe calibrated standing and recoverable walking; no uncontrolled tip hazard | NOT RUN |

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
