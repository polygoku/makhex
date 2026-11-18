# MAKHEX Build 15 — Seeed reBot B601 Open-Source Robot Arm

## Source provenance

- Original creator: Seeed Studio / Seeed-Projects
- Source: https://github.com/Seeed-Projects/reBot-DevArm
- Pinned source review: 2432f436572f77922cdae6af39788df00f993263 (2026-11-17)
- Official mechanical BOMs:
  - DM: https://github.com/Seeed-Projects/reBot-DevArm/blob/main/hardware/reBot_B601_DM/readme.md
  - RS: https://github.com/Seeed-Projects/reBot-DevArm/blob/main/hardware/reBot_B601_RS/README.md
- Source CAD: DM 2026-06-25 v1.1 full STEP; RS 2026-06-25 v1.0 full STEP; exact links on MAKHEX project page.
- Hardware license: CERN Open Hardware Licence v2, Weakly Reciprocal (CERN-OHL-W-2.0), source LICENSE file.
- Software SDK claimed license: Apache-2.0 (verify each separately redistributed SDK's original headers).
- Seeed announced a switch to these commercial open licenses effective 2026-05-11. Copyright notices, source-access obligations and license text apply to derived hardware products. Manufacturing/market use cannot imply Seeed endorses MAKHEX or authorizes use of separate trademarks/marketing artwork.

**This is not an ESP32 project.** An x86/ARM Linux host, CAN motor communications, industrial DC power, correctly engineered brackets, gripper and actuator setup are required. User-supplied source is a real, built robotic arm project. MAKHEX has not independently assembled, tested, stocked, safety-certified, or sold an arm.

## Model choice — do not cross-connect

| Specification | B601-DM / Damiao | B601-RS / RobStride |
| --- | --- | --- |
| Motion | 6 DOF + 1 gripper actuator | 6 DOF + 1 gripper actuator |
| Actuators in published source BOM | 4 × DM4310(V4) + 3 × DM4340P(V4) | 4 × RobStride RS00 + 3 × RobStride RS06 |
| Manufacturer payload claim | 1.5 kg | 2.5 kg |
| Manufacturer max reach | 767 mm | 754 mm |
| Manufacturer repeatability claim | better than ±0.2 mm | better than ±0.1 mm |
| DC supply | 24 V / about 14.6 A | 48 V / about 12.5 A |
| Source full STEP | reBot_B601_DM_v1.1_20260625.step | reBot_B601_RS_v1.0_20260625.step |
| Source assembly | https://wiki.seeedstudio.com/rebot_b601_dm_getting_started/ | https://wiki.seeedstudio.com/rebot_b601_rs_getting_started/ |

**No DM and RS parts can be silently substituted.** Voltage, motor models, control interface, CAN protocol, mounting, firmware, harnesses and safety/discharge hardware differ. Never use 48 V power on a 24 V DM arm.

## Complete source BOM extraction

The original published source tables have been parsed into a reusable, line-precise public MAKHEX inventory:

- DM: /bom/rebot-b601-dm-detailed.csv — 79 source rows: 20 printed, 1 optional camera mount, 21 CNC/metal, 27 standard purchased, 10 power/consumable items.
- RS: /bom/rebot-b601-rs-detailed.csv — 75 source rows: 13 printed, 27 CNC/metal, 25 standard purchased, 10 power/consumable items.
- These counts represent **distinct table lines, not physical item quantities**. A source fastener row may represent 14 or more screws.
- Source entries preserve section, part file, material specification, quantity text, original supplier reference (when supplied), and source URL.
- The maker explicitly notes its source BOM describes a reproducible developer construction and may differ from Seeed's current factory shipping bundles. Original production revisions may replace printed parts with metal, modify harnesses and clearances.

Do not sell original STEP/STL drawings as physical MAKHEX components. Design files remain free and available under the actual source licensing terms. For custom manufactured CNC parts, a separately quoted finished hardware pack needs geometry, drawing revision, finish and tolerance approval.

## First-party MAKHEX configuration — DM source full kit (baseline)

1. rebot-b601-dm-full-kit ×1 — full arm body and gripper, Seeed full-kit option (part contents/pack still to verify).
2. rebot-b601-dm-power-kit ×1 — official B601-DM 24V power accessory if not included in full-kit offer; remove if redundant.
3. rebot-b601-dm-can-usb ×1 — model-compatible host CAN interface, source Seeed board, if not bundled.
4. rebot-b601-mount-clamps ×1 — two robust desk clamps, not a single clamp; verify table structure and user safety.
5. rebot-b601-dm-discharge-module ×1 — separate optional safety/energy-dissipation and stop accessory; verify interface and actual function.

The baseline assumes source component families, **not** that every line is required in a vendor-complete kit. The customer request must be reviewed to avoid double-counting power, CAN interface or safety accessories. Parts are internally requestable on MAKHEX; no prices are fabricated or payment captured at this stage.

## Alternate first-party MAKHEX configuration — RS source full kit

1. rebot-b601-rs-full-kit ×1 — full 48V RobStride arm and gripper.
2. rebot-b601-rs-power-kit ×1 — 48V/12.5A source adapter ONLY if not packed in the selected factory bundle; the Seeed product page title sometimes includes a power supply.
3. rebot-b601-rs-can-usb ×1 — compatible RS USB-to-CAN hardware after protocol qualification, if not bundled.
4. rebot-b601-mount-clamps ×1 — stable suitable desk-clamp pair.
5. rebot-b601-rs-bleeder-module ×1 — optional RS-specific energy bleed/stop hardware, needs verification.

The Build 15 page offers **Add RS Kit** as a separate configuration. The cart and backend reject orders mixing DM and RS parts and also reject full-kit + overlapping subkit orders under the same project.

## Optional subkit, repair and fabrication purchasing

Available as standalone MAKHEX first-party research/quote listings (source vendor reference):
- DM body motor kit; DM body structural kit; DM gripper complete kit.
- RS body motor kit; RS body structural kit; RS gripper complete kit.
- Individual original actuator source SKUs: DM4310 V4, DM4340P V4, RobStride RS00, RobStride RS06.
- DM hardware/fasteners/bearings custom pack and RS hardware/fasteners/bearings custom pack, cross-referenced to source CSV.
- Other relevant Seeed official optional modules are separate SKU families above.
- Individual printed designs remain free CAD source. MAKHEX does not charge for a bare design file nor imply a finished print is in the standard electronics kit.

## Assembly, safe commissioning and software

1. Confirm exact source/factory model, STEP revision, motor ID map and approved structural hardware and fastening method.
2. Use an enclosed U.S. safety-certified preassembled AC/DC adapter of the correct variant. Do not sell or recommend exposed AC terminals or mains DIY wiring to nonqualified buyers. Verify grounding, DC cable polarity, proper overcurrent protection and isolation.
3. Clamp to a mechanically suitable bench and remove collision hazards. Plan physical travel constraints, pinch-point guarding and nonaccessible bystander zones. These arms produce substantial force.
4. Check every motor's hardware revision and bus ID against the source instructions. Confirm vendor motor and CAN host driver + compatible Linux/ROS 2 environment. Establish an independently tested emergency stop/physical power isolation before executing motion.
5. Unloaded low-torque homing, travel limit and one-joint motion tests come before loaded arm and gripper motions. Verify thermals and fault timeout, disable uncontrolled post-fault movement.
6. Try original Seeed ROS2 and LeRobot integration after baseline CAN operation. Community simulation is not evidence of a MAKHEX physical test.
7. Do not claim the repeatability/payload values without verifying a physical specimen.

## Qualification / commercialization gates

- [ ] Supplier selected correct complete-kit variant and exact shipping packing list, including included/excluded gripper, body motors, structure, harnesses, fasteners and power.
- [ ] Source matching including seven correct motors, 24V or 48V supply, CAN host adapter, stop module and clamps.
- [ ] U.S. ZIP 11021 landed shipping, taxes, freight restrictions, returns and warranty established.
- [ ] NRTL-rated U.S. power assembly with suitable connectors and safe isolation confirmed.
- [ ] Reseller/distribution and product liability/marketing/media rights reviewed before using manufacturer branded imagery in commercial promotion.
- [ ] No duplicate items when full kit vs subkit, factory power vs accessory.
- [ ] Controlled Squarespace => vendor purchase and tracking test proven before enabling instant paid checkout.
- [ ] Real physical commissioning and fault-isolation test logs available.

All source URLs and manufacturer kit choices are itemized in SOURCING.md. Nothing here asserts full-kit paid checkout is already functioning at MAKHEX.
