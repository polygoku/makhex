# MAKHEX Build 12 — Microduck walking robot

Original creator: **kissqy**, building on the Pollen Robotics Microduck ecosystem.

**Upstream source:** https://github.com/kissqy/Microduck-kissqy
**Original English step-by-step guides:** https://kissqy.github.io/Microduck-kissqy/guides/
**MAKHEX customer build:** https://makhex.com/projects/microduck-robot/
**CAD and PCB audit:** [docs/microduck-cad-review-20261025.md](../../docs/microduck-cad-review-20261025.md)

## Status and scope

This is a **documented working external community project**, not a prototype built or tested by MAKHEX. The seven genuine upstream demonstration videos and source-derived screenshots are republished with the owner's permission, credited to kissqy; they must never be presented as a MAKHEX physical test.

The code, CAD, PCB and firmware are **not automatically granted commercial redistribution rights** by permission to reuse the media. The page links to the original source files and preserves origin attribution. Do not bundle source CAD, sell printed derivations or preinstall firmware without checking each component's license and necessary permission.

Microduck **does not use ESP32**. It uses a Radxa ZERO 3W Linux single-board computer plus a bespoke HAT, STM32-based IMU and 15 Feetech serial bus actuators.

## BOM mapping: original design -> MAKHEX research component

Every slug below is a MAKHEX local product research page. None is declared tested, in stock, paid-checkout orderable or import-complete. The future drop-ship import must match the exact source-revision and supplier option.

| Source component / exact requirement | MAKHEX component slug | Qty | Key acceptance checks |
| --- | --- | ---: | --- |
| Feetech **HD-1910-C001** serial bus servo | `feetech-hd1910` | 15 | Output and spline, bus, firmware/ID, AMP2.0 wiring |
| Radxa ZERO 3W, **2 GB RAM, no eMMC, with pin headers** | `radxa-zero-3w` | 1 | No eMMC, RAM, headers, boot media, Linux |
| Oct 15 HAT, **AMP2.0** version | `microduck-hat` | 1 | Correct .epro2 board, connectors, BOM and firmware interaction |
| Oct 15 IMU, **AMP2.0** version | `microduck-imu` | 1 | STM32G031/LSM6DSV16X, SWD, correct FT6 IMU firmware |
| IMX219 **160-degree** wide-angle camera | `imx219-160-camera` | 1 | Exact lens, CSI cable, Radxa compatibility |
| VL53L5CX **V2** 8×8 ToF module with cover | `vl53l5cx-v2` | 1 | Breakout revision, optics, cable, power, I²C |
| NP-F550 battery pair 2200mAh + matching dual charger | `npf550-power-kit` | 1 | Safe Li-ion supply, correct voltage/polarity, mechanical fit |
| FrankenDuck printed chassis (36 STL + 3MF) | `microduck-printed-parts` | 1 | 3MF scale, PLA rigid plates, TPU plate 5, battery choice |
| 6700 bearings (10×15×3 mm) reference purchase | `bearing-6700` | 5 | Bearing size and actual per-joint assembly count |
| ET2216 bearings (16×22×4 mm) reference purchase | `bearing-et2216` | 12 | Bearing size and actual per-joint assembly count |
| 3525-enclosed 4Ω/3W speaker | `speaker-4ohm-3w` | 1 | Speaker connector HP1.25 on AMP2.0 board |
| M2, M2.6 screws in specified lengths | `microduck-fasteners` | 1 | Mixed M2/M2.6, 4/5/6/8/12 mm and print pilot holes |
| AMP2.0 three-wire cables, 100/200 mm | `amp20-servo-cables` | 1 | Pin order, wire gauge and required installed lengths |
| 22AWG wire, heat shrink | `microduck-wiring-kit` | 1 | Harness current capacity, strain relief |

**Optional roller feet:** 623ZZ 3×10×4 mm bearings, original reference purchase quantity 8, mapped to `bearing-623zz`. Deliberately **not** in the walking-foot baseline BOM. The GameSir controller and extra hand tools may also be optional. Add optional variants only under a distinct project/cart configuration rather than charging baseline customers for incompatible components.

The original shopping list is at:
https://github.com/kissqy/Microduck-kissqy/blob/main/DUCK-SHOPPING-LIST.en.md

## Electronics revisions — critical

- **October 15, 2026 AMP2.0** source is the recommended reference pairing. HAT J13/J14 and IMU J1 are CJT A2007WV-3P connectors (3-pin, 2.0 mm). HAT J1/J2/J9 audio headers are CJT A1251WV-2P (2-pin, 1.25 mm). The latest HAT adds D5 and R34 1kΩ.
- **October 7, 2026 EH2.5** source is also available and has a **different cable/connector plan**. Do not mix connector BOMs or imply it uses AMP2.0 cable stock.
- IMU needs the proper flashing firmware and verified SWD wiring. HAT and IMU layouts have not been independently tested by MAKHEX for fabrication, power, ERC/DRC or EMC.

Guide: https://github.com/kissqy/Microduck-kissqy/blob/main/hardware/AMP2.0-VERSION.en.md

## CAD build checks and print material

- Original ZIP/RAR archive content and individual STL hashes have been verified in MAKHEX's Oct 25 CAD review. All 36 meshes are watertight after vertex processing, but five models contain non-area triangles and eleven have unusually small raw coordinate scales.
- Prefer the **five-plate 3MF** for reproducible arrangement and sensible print units. Raw STL files have mixed *numerical coordinate ranges*. Verify dimensions per model in slicer, especially files with sub-0.1-unit dimensions.
- The 3MF project declares **millimeter** units. The source's recorded machine was Bambu Lab P2S with BambuStudio 02.08.02.61, 0.4-mm nozzle, 0.20-mm layers; adjust hardware/profile locally.
- Print **plate 5 with TPU**, despite saved PLA presets.
- Two alternative battery holders exist; choose one. Optional roller foot reconfiguration needs 623ZZ bearings. Inspect interferences, wall thickness, screw pilot holes and servo fit before printing all parts.
- No independent MAKHEX functional clearance, structural factor-of-safety or tolerance test has been performed.

## Agent task checklist

1. Reconcile source README and release hashes without rehosting restricted files.
2. Search independent suppliers for **exact options**, not generic lookalikes or servo substitutes. Keep supplier/wholesale links internal to Doroppu.
3. Establish exact U.S. freight, stock, supplier payment, orderability and tracking for destination ZIP 11021. Do not mark **AVAILABLE** or enable Squarespace paid checkout before test completion.
4. Derive mechanical assembly installed quantities from the 3MF and source instructions, not the 36 STL count or historic pack purchase totals.
5. Run EasyEDA Pro ERC/DRC and crosscheck HAT+IMU BOM, correct connectors, wiring and firmware before fabricating boards.
6. Link new build updates, alternative mechanics, driver fixes and supplier confirmations into the **native MAKHEX project forum** rather than overwriting original upstream attribution.
7. No rebranding upstream videos or IP as MAKHEX-developed hardware.

## Media provenance

The seven original `README.en.md` demo MP4s are hosted at `/demo/microduck/microduck-demo-01.mp4` through `-07.mp4`, with JPG posters and original GitHub attachment URLs/hashes in `public/demo/microduck/media-manifest.json`. The hero image is a still from the second original clip. Five native-source print-plate screenshots appear below videos. These are original creator artifacts, not staged supplier advertisements.

**Publication:** feature branch / QA until authorized Cloudflare release and separately verified Squarespace order fulfillment.
