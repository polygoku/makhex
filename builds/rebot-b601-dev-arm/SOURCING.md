# MAKHEX Build 15 — reBot B601 Supplier Matrix

Date: 2026-11-17. Source repo: https://github.com/Seeed-Projects/reBot-DevArm (reviewed commit 2432f436572f77922cdae6af39788df00f993263).

**All parts on MAKHEX are FIRST-PARTY QUOTE-ONLY REQUEST ITEMS**, not automatically paid supplier purchases. Manufacturer or distributor links below are sourcing evidence, not customer checkout. External links must not replace the MAKHEX cart as the normal buyer path.

## Arm configurations

| Component family | Maker/source listing | Exact scope / qualification |
| --- | --- | --- |
| DM complete body + gripper | https://www.seeedstudio.com/reBot-Arm-B601-DM-Bundle.html | Select "Full Kit"; manufacturer options also include partial subkits and assembled bundle, so category page headline price isn't reliable |
| RS complete body + gripper | https://www.seeedstudio.com/reBot-Arm-B601-RS-Disassembly-Kit-Version-with-Power-Supply-Bundle.html | Select proper full kit with RS motors; bundle may already include power |
| DM optional extra power | https://www.seeedstudio.com/Power-Adapter-Kit-for-reBot-Arm-B601-DM-p-6874.html | 24V DC about 14.6A; verify NRTL/U.S. preassembled safe AC/DC and actual pack contents |
| RS optional extra power | https://www.seeedstudio.com/Power-Adapter-Kit-for-reBot-Arm-B601-RS-p-6873.html | 48V DC about 12.5A; NEVER substitute for DM; verify included in main RS bundle |
| DM CAN/USB | https://www.seeedstudio.com/DM-CAN-USB-Driver-Borad-p-6706.html | Host interface reference, check if included in full-kit packing list |
| RS CAN/USB | https://github.com/Seeed-Projects/reBot-DevArm/blob/main/hardware/reBot_B601_RS/README.md | Source example USB-to-CAN, no verified official current RS supplier SKU |
| Both two desk clamps | https://www.amazon.com/dp/B092J1YW2M | Source physical 6in G-clamps, qty two and bench load check |
| DM optional discharge/stop | https://www.seeedstudio.com/Rebotic-Power-Discharge-Module-for-reBot-Arm-B601-DM-p-6988.html | DM-specific; confirm real E-stop energy path |
| RS optional bleeder/stop | https://www.seeedstudio.com/Rebotic-Bleeder-Module-for-reBot-Arm-B601-RS-p-6987.html | RS-specific; not compatible with DM version |

## Separately orderable Seeed subkits / source parts

| Model | Components | Maker references |
| --- | --- | --- |
| DM | Body motor kit, body structural kit, complete gripper | https://www.seeedstudio.com/reBot-Arm-B601-DM-Body-Motor-Kit-p-6752.html ; https://www.seeedstudio.com/reBot-Arm-B601-DM-Body-Structure-Kit-p-6753.html ; https://www.seeedstudio.com/reBot-Arm-B601-DM-Gripper-Kit-p-6751.html |
| RS | Body motor kit, body structural kit, complete gripper | https://www.seeedstudio.com/reBot-Arm-B601-RS-Body-Motor-Kit-p-6867.html ; https://www.seeedstudio.com/reBot-Arm-B601-RS-Body-Structure-Kit-p-6866.html ; https://www.seeedstudio.com/reBot-Arm-B601-RS-Gripper-Kit-p-6868.html |
| DM | DM4310(V4) qty4, DM4340P(V4) qty3 | https://www.seeedstudio.com/Damiao-4310-Actuator-Motor-p-6823.html ; https://www.seeedstudio.com/DM4340P-Actuator-p-6663.html |
| RS | RobStride RS00 qty4, RS06 qty3 | https://www.seeedstudio.com/Robostride-00-Actuator-p-6664.html ; https://www.seeedstudio.com/Robostride-06-Actuator-p-6668.html |
| DM source fasteners and machined parts | 79 detailed CSV rows, including 20 printed, 21 CNC, 27 purchased, 10 power and 1 optional camera | /bom/rebot-b601-dm-detailed.csv and original hardware/reBot_B601_DM/readme.md |
| RS source fasteners and machined parts | 75 detailed CSV rows, including 13 printed, 27 CNC, 25 purchased, 10 power | /bom/rebot-b601-rs-detailed.csv and original hardware/reBot_B601_RS/README.md |

The source-reproduced component specification is NOT an assertion about the current production kit's packing list. The original Seeed author explicitly notes fabricated/factory differences. The DM v1.1 revision corrected Joint 1 motor, bracing and custom wiring; the RS source has different metal geometry. Fabrication means qualified CNC processes/tolerances, not a blanket swap to low-infill PLA.

**CAD and software:** The source STEP designs remain at the original GitHub repository and may be downloaded free under CERN-OHL-W-2.0 with notices and source obligations. Software repo/SDK has Apache-2.0 references. The MAKHEX catalog sells hardware/services only after review; no standalone billed STL/STEP file. Original photos and brand marks are separately owned and show Seeed's original arm, not a MAKHEX product sample.

## Unresolved before approving paid checkout

The current Seeed pages provide manufacturer and partial-kit SKU references, but **no buyer cart test, stock reservation, U.S. shipping, delivered unit price, taxes, factory packing list, reseller agreement, actual motor revisions, certifiable safe AC power, warranty, return terms, or automated supplier order proof** was obtained. Consumer MAKHEX price is unknown and should remain "Price on request"; we do not put an arbitrary retail price or disclose private markup.

For assembled arms and custom subkits alike, first prove one complete MAKHEX Squarespace payment -> correct vendor purchase -> carrier tracking -> customer fulfillment with a controlled test order. For expensive/high-force robots, resolve U.S. electrical safety, pinch points, stop/park behavior, liability and protection hardware first.
