# MAKHEX Engineering Package 12 — Microduck — AI Walking Robot

**STATUS: RESEARCH, NOT REPRODUCED OR ORDERABLE.** This file is a technical handoff with explicit missing proof. Never treat it as a bench-certified build.

## Provenance and source rights
- Original maker/source: https://github.com/kissqy/Microduck-kissqy
- License: Multiple component licenses and original work terms
- Credited physical reference photo: not locally hosted
- MAKHEX-hosted videos: /demo/microduck/microduck-demo-01.mp4, /demo/microduck/microduck-demo-02.mp4, /demo/microduck/microduck-demo-03.mp4, /demo/microduck/microduck-demo-04.mp4, /demo/microduck/microduck-demo-05.mp4, /demo/microduck/microduck-demo-06.mp4, /demo/microduck/microduck-demo-07.mp4
- External demo: none confirmed
- Source design/3D assets: source-linked member-gated CAD, not physically qualified
- Design source: https://github.com/kissqy/Microduck-kissqy
- Pinned original-source commit: 4f0d6cd5f17972ac8d4218dfcf458607de70c2eb

### Native source files (original build, not verified compatible with MAKHEX BOM)
- [docs/assets/assembly-battery-holder.stl](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/docs/assets/assembly-battery-holder.stl)
- [hardware/ProPrj_HAT_REVA_SCH_2026-10-07.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_HAT_REVA_SCH_2026-10-07.epro2)
- [hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2)
- [hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-07.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-07.epro2)
- [hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/blob/4f0d6cd5f17972ac8d4218dfcf458607de70c2eb/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2)

## Required hardware — research BOM
| Qty | Component | Role | Exact variant, ZIP 11021 quote, real purchase |
|---:|---|---|---|
| 15 | [Feetech HD-1910-C001 Serial Bus Servo](https://makhex.com/shop/feetech-hd1910/) | Original HD-1910-C001 actuators | Not verified |
| 1 | [Radxa ZERO 3W, 2GB (no eMMC)](https://makhex.com/shop/radxa-zero-3w/) | Original 2GB no-eMMC main computer | Not verified |
| 1 | [Microduck HAT Custom Controller PCB](https://makhex.com/shop/microduck-hat/) | AMP2.0 robot HAT control PCB | Not verified |
| 1 | [Microduck STM32 IMU Controller PCB](https://makhex.com/shop/microduck-imu/) | Custom STM32-based IMU board | Not verified |
| 1 | [IMX219 160° Camera Module](https://makhex.com/shop/imx219-160-camera/) | 160-degree vision module | Not verified |
| 1 | [VL53L5CX V2 8×8 ToF Sensor](https://makhex.com/shop/vl53l5cx-v2/) | V2 8×8 distance-sensing breakout | Not verified |
| 1 | [NP-F550 Battery & Dual Charger Kit](https://makhex.com/shop/npf550-power-kit/) | Two batteries plus charger kit | Not verified |
| 1 | [Microduck FrankenDuck 3D-Printed Shell](https://makhex.com/shop/microduck-printed-parts/) | Printed FrankenDuck chassis set / 3MF | Not verified |
| 5 | [6700 Open Thin-Wall Bearing](https://makhex.com/shop/bearing-6700/) | 10×15×3 mm bearings; purchase reference | Not verified |
| 12 | [ET2216 Thin-Wall Bearing](https://makhex.com/shop/bearing-et2216/) | 16×22×4 mm bearings; purchase reference | Not verified |
| 1 | [Mini 4 Ω / 3 W Speaker](https://makhex.com/shop/speaker-4ohm-3w/) | 3525-compatible 4Ω 3W speaker | Not verified |
| 1 | [Microduck M2/M2.6 Fastener Set](https://makhex.com/shop/microduck-fasteners/) | M2/M2.6 screw assortment | Not verified |
| 1 | [AMP2.0 3-Pin Servo Cable Set](https://makhex.com/shop/amp20-servo-cables/) | 10 and 20 cm AMP2.0 servo cables | Not verified |
| 1 | [Microduck 22AWG Wiring & Heat Shrink](https://makhex.com/shop/microduck-wiring-kit/) | 22AWG harness wire and heat shrink | Not verified |

The items above are reference candidates, not a complete electrically verified assembly. Check missing pull-ups, wires, connectors, batteries, protection, brackets, enclosure details and tooling against the original schematics.

## Reproducible engineering protocol
1. Record exact board/manufacturer revision, seller option, schematic revision, firmware source commit, SDK/toolchain version, and every configuration flag.
2. Measure/verify voltage domains, GPIO assignment, polarity, connector pitch, conductor ratings and current limit before energizing any circuit; never guess pins.
3. Verify supply protection, thermal/load margin and physical clearances. Do not use a mains adapter lacking required safety qualification.
4. Flash and test the minimum standalone vendor sample for each module; retain complete build/flash commands, version strings and serial logs.
5. Add one device at a time and keep fault-injection logs. Only mark a result as passed with dated hardware evidence.

### Project-specific bring-up
1. Open the credited original English guide, confirm the exact October 15 AMP2.0 connector variant and print-layout release.
2. Download the original five-plate 3MF and STL source set. Inspect model scale, PLA versus TPU materials and choose one battery holder before slicing.
3. Assemble the 15 HD-1910-C001 servos and correct bearings with the printed chassis, securing cables with strain relief.
4. Inspect or fabricate the original HAT and IMU PCB revisions; flash the correct STM32 IMU firmware before connecting the servo bus.
5. Mount the Radxa ZERO 3W, IMX219 camera, VL53L5CX V2 sensor, speaker and protected NP-F550 supply.
6. Validate battery voltage/polarity, bus-pin mapping, connector pitch and independent power-up of each device.
7. Configure source-matched Linux/robot software, then calibrate servo IDs and joint limits without loading the legs.
8. Run conservative support/standing tests before source-guided walking and optional roller/reinforcement-learning demos.

### Project-specific preflight
- Match the HD-1910-C001 servo, Radxa ZERO 3W 2GB/no-eMMC/header and the October 15 AMP2.0 HAT and IMU projects. This is NOT an ESP32 build.
- Read the 3MF five-plate print layout and verify geometry scale; some standalone STLs use tiny coordinate ranges. Use TPU for the sole/tire plate, not the saved PLA preset.
- Select either HUB-clamping or snap-fit battery holder, and confirm the designed IMU mounting pattern and bearing sizes.
- Treat original purchases as historical engineering examples, not proof of U.S. stock, current price or drop-ship orderability.
- Do not apply battery or servo power until polarities, grounds, fuse, 3-pin pinouts and total stall-current budget are verified.

## Acceptance tests — evidence not yet supplied
- [ ] Check that each servo ID and range matches the rig without linkage binding.
- [ ] Bring up the IMU and HAT with connector/supply checks before loading the printed robot.
- [ ] Record safe stand, walk and recovery behavior in a bounded test area.
- [ ] Verify camera, ToF and battery power with source-matched drivers.
- [ ] Cross-check printed foot configuration and optional roller bearings against the 3MF source.

Record photos/video, firmware hash, measured supply current, wiring diagram, exact bill of materials, fault tests, reviewer and date. **No run is marked passed until physical evidence is attached.**

## Engineering and licensing caution
Advanced electromechanical build with lithium-ion batteries, moving servos and custom PCBs. This is an attributed independent project, not a bench-tested MAKHEX kit. Do not replace Radxa with an ESP32, mix EH2.5/AMP2.0 connectors or assume raw STL units equal millimeters.

## Purchasing acceptance
Match each part to its exact AliExpress variant and genuine product image; verify option-specific U.S. stock, one-unit freight to ZIP 11021, landed contribution under MAKHEX supplier-cost ×2.5 rule, returns, and Squarespace product mapping. Paid checkout stays gated until a new real order is placed once, reconciled to supplier payment, tracking, and refund.

## Agent implementation tasks
1. Start with builds/microduck-robot/README.md and follow upstream release URLs; do not use generic ESP32 firmware.
2. Reconcile exact supplier options against HD-1910-C001, Radxa ZERO 3W no-eMMC, IMX219 160-degree lens, VL53L5CX V2 and AMP2.0 connector variant.
3. Inspect EasyEDA Pro .epro2 schematic/PCB before manufacturing and run ERC/DRC with the current BOM and board revisions.
4. Check the RAR/SHA256 manifest and 3MF units, PLA/TPU plate selection and mechanical fit. Do not infer exact print quantity from 36 STL filenames.
5. Keep Squarespace/Doroppu import/checkout disabled until verified exact supplier variants and U.S. test orders.

A machine-readable engineering-manifest.json accompanies these notes. Supplier credentials, customer PII and unverified success claims do not belong here.
