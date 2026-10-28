> **Historical audit (October 28, before owner policy change).** The 2.5× figures below are superseded for the current MAKHEX storefront by [20% AliExpress markup / direct external vendor policy](MAKHEX_SOURCING_20_PERCENT_AND_IMAGE_AUDIT_20261028.md). STL/3MF files are no longer catalog or BOM parts; they remain in the Build 12 design library. Do not use the prior table as a current shopping price.

# Microduck — engineering-source qualification and MAKHEX storefront changes
**Date:** 2026-10-28 · **Build:** Microduck #12 · **Retail:** 2.5× reference supplier basis

## Result
The real blockers were NOT the existence of components: HAT and IMU are two custom PCBs with original assembler/fabricator source files; commodity screws, speaker and wires are sourced to physical specifications; 3D CAD is already offered FREE behind MAKHEX login. The only Microduck catalog family without any retail price plan is the exact Radxa ZERO 3W RS107-D2E0H1W15, which remains without verified U.S.-deliverable stock.

MAKHEX customer buys through one MAKHEX order request, not on supplier sites. No automatic supplier payment, fake inventory, or manufactured compatibility claim. New amounts are **2.5× PLANNING figures** that require a real supplier landed-cost quote before buyer capture. MAKHEX itself is the storefront/merchant.

## HAT — custom Radxa expansion/power/audio board
- Original Oct 15, 2026 EasyEDA Pro project: [ProPrj_HAT_REVA_SCH_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/raw/refs/heads/main/hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2).
- SHA256: `9c2870a28b29845ef6e559369cf3ea3c27e3fccd12b63745ed661af77fff32b0`; 86 placements; full MPNs/pads in [AMP2.0 BOM](https://github.com/kissqy/Microduck-kissqy/blob/main/hardware/AMP2.0-BOM.json).
- U1 `PAM8406DR` speaker amp, U2 `TLV320AIC3104IRHBR` I²S audio codec, U9 `AP63205WU-7` buck regulator, U10 `LM5050MKX-1/NOPB`, J4 `FH-00339` Radxa connection. J13 and J14 `A2007WV-3P` at 2.0mm. HAT speaker J1 `A1251WV-2P` at 1.25mm, **not** generic 2.54mm pins.
- Power/bus HAT J13/J14: 1 GND, 2 BATT_IN, 3 DXL_DATA.
- Primary source [original assembled HAT/IMU seller](https://item.taobao.com/item.htm?id=1095121548583), historical HAT ¥199. Alternate: exact Gerber/BOM/CPL submission to JLCPCB custom board assembly with inspection and electrical QA, **not** generic HAT substitution.

## IMU — *custom* serial-bus inertial measurement module
- Original Oct 15 project: [ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2](https://github.com/kissqy/Microduck-kissqy/raw/refs/heads/main/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2).
- SHA256: `824bad07b60bbb1680f759c45b1e2bb918757f7f59747d254cb6d0d0c2ec4a25`; 25 placements.
- U1 `STM32G031F8P6`, U2 `LSM6DSV16XTR`, U3 `TLV70433DBVR`, U4 `SN74LVC2G125DCUR`; J1 `A2007WV-3P`, pins 1=GND, 2=DXL_VDD, 3=DXL_DATA. J2 SWD header pin 1=3V3, 2=SWDIO, 3=GND, 4=SWCLK, 5=NRST.
- Firmware must be [FT6_SYNC15_UART_IRQ_v1.bin](https://github.com/kissqy/Microduck-kissqy/raw/refs/heads/main/microduck-hd1910/firmware/console/updates/imu_to_feetech_ReVA_FT6_SYNC15_UART_IRQ_v1.bin), flash address `0x08000000`, checksum `d7bd2f37a6a4e0e15d1f9650a3959bcf4d8c704524d8ec319d72d8bdf104ab6d`; bus 1 Mbps / ID 200 / FT6 Sync-Read. Bench test real orientation and freshness. Generic LSM6DSV16X breakout is sensor-compatible but **not protocol-/firmware-/interface-compatible** with Microduck's software; cannot substitute.
- Historical original-maker assembled IMU ¥99 or custom JLC assembly + programming.

## Physical commodity parts and owner-review retail plans

| Microduck product | Physical requirement, exact source option | Pricing basis and provisional MAKHEX plan |
|---|---|---|
| 3525 / 4Ω 3W speaker **NEW distinct SKU** | [AliExpress item 3256813213673448](https://www.aliexpress.us/item/3256813213673448.html), color `14-193`; YZ3525 4Ω3W, **2P 1.25mm**, matching HAT J1 (verify polarity) | Observed $1.28 + $4.30 delivery = $5.58; ×2.5 = **$13.95** |
| HAT assembled | Creator shop exact Oct 15 AMP2.0 PCB | HISTORICAL ¥199 / 6.667 × 2.5 = **$74.62**, freight not included |
| IMU assembled | Creator shop RevA AMP2.0 with FT6 flash/bench check | HISTORICAL ¥99 / 6.667 × 2.5 = **$37.12**, freight not included |
| Fasteners, 6 pack assortment | M2×4/5/6/8/12 and M2.6×8, original Phillips pan-head flat-tail each 200pc at [maker supplier](https://item.taobao.com/item.htm?id=534923831046) | Historical maker six packs ~¥20.43 / 6.667 ×2.5 = **$7.66** prior to freight. M2x5 original ¥0 coupon corrected to ¥3.03 proxy. [Ali alternative](https://www.aliexpress.us/item/3256807980116275.html) uses different wafer head and certain M2 variants were OOS, not approved.
| AMP2.0 servo cable harness | 30 × 100 mm + 30 × 200 mm, **24AWG**, AMP2.0 3P, same pinout, [maker vendor](https://item.taobao.com/item.htm?id=825340808235) | Historical ¥54 / 6.667 ×2.5 = **$20.25**, before freight. Ali 26AWG PH2.0 is NOT approved.
| 22AWG wire + heat shrink kit | [Original BOM](https://github.com/kissqy/Microduck-kissqy/blob/main/DUCK-SHOPPING-LIST.en.md) 3m 22AWG black 3-core, 2m black single-core 22AWG + 164 pcs 2:1 shrink. [Ali heat shrink](https://www.aliexpress.us/item/3256812286354959.html) option `14-350853`, [Ali black single wire](https://www.aliexpress.us/item/3256810220858713.html) options black `14-200004890`, 22AWG `380-201441935`, 2m `183-390264893` | Historical maker ¥15.19 / 6.667 ×2.5 = **$5.70**, before freight; 3-core 0.5 mm² is NOT 22AWG. Need quote as one delivered bundle.
| FrankenDuck printed physical shell | Not for sale as a fabricated shell | **$0, FREE STL / 3MF member download**: [MAKHEX library](https://makhex.com/members/microduck-designs/); 36 STL + five print plates, rigid PLA, plate 5 TPU.

**Critical:** Original-maker 2.5× amounts exclude unknown international freight. They are estimates shown in the MAKHEX first-party catalog, not final checkout-ready prices or promises that a $5.70 wiring kit can economically be shipped free to the USA. Each requires an exception approval that includes *current supplier total, destination, variant, customer price and fulfillment method*.

## Last physical blocker: Radxa ZERO 3W
Exact manufacturer part: **RS107-D2E0H1W15** = 2 GB RAM, no eMMC, pre-soldered GPIO pins. [Radxa product brief](https://dl.radxa.com/zero3/docs/hw/3w/radxa_zero_3w_product_brief.pdf) confirms. U.S.-referenced [Arace](https://arace.tech/products/radxa-zero-3w) JSON 2026-10-28 returned `available:false` on exact configuration ($39.99 listed, not in-stock), and AliExpress exact model unavailable. [Hubtronics India](https://hubtronics.in/radxa-zero-3w-2gbram) reports **13 units** of exact SKU at ₹5,760 including local Indian GST; shipping to USA is unverified. Do not assign a MAKHEX price or substitute a 1GB model/board missing header until qualified.

## Release QA contract
- One new distinct physical speaker catalog product; preserves the 28mm voice-node product and its existing Squarespace price. The original 16 merchant SKUs and media are unchanged.
- Microduck BOM now uses 3525 speaker. All 31 catalog families source-mapped. 30 have price plans or a free digital model; exact Radxa remains unpriced.
- Mark free 3D download in cards and detail pages, using existing member authentication, never a fabricated/shipped product.
- All HAT, IMU, fasteners, cables, wiring and speaker remain **owner approval / HOLD**, with real supplier write/payment unattempted.
