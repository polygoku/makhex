# MAKHEX sourcing, pricing and photo policy — October 28, 2026

## Owner-approved rule (supersedes earlier 2.5× plans)
- **Only parts matched to a selected AliExpress listing are offered through the MAKHEX cart.** Current planning markup: **20% over the normalized supplier option cost** (1.20×). This is markup, not gross-margin percentage.
- **Other parts are direct retailer/vendor links, with no MAKHEX markup or MAKHEX payment.** Historical Squarespace price snapshots are left intact internally for reconciliation, but are not advertised as current MAKHEX prices, and checkout API rejects them.
- **STL/3MF files are not an item in the product catalog, Microduck physical parts BOM or checkout.** Authorized self-print models remain behind the Microduck build page's member design library.
- Actual supplier stock, final ZIP-shipping landed total, seller option and refunds are still unqualified. All MAKHEX payment automation stays OFF. A merchant import CSV for eight selected variants is staged only, **Hidden** and **stock 0**.

## Current first-party AliExpress planning items
| Item | MAKHEX planning retail at 20% markup | Item/option qualification |
| --- | ---: | --- |
| Feetech HD-1910-C001 | $34.33 per servo (15-pack normalized) | Select 15-motor bulk offer; individually sold options are not the same lot |
| IMX219 160-degree | $10.50 | Must choose 160° option, not default 77° |
| VL53L5CX V2 | $24.00 | V2 board only |
| NP-F550 two batteries + charger | $34.45 | Must choose 2-cell set |
| 6700 open bearing | $3.57 each | Original pack 10, walking robot requires 5 |
| ET2216ZZ 16×22×4 mm | $6.00 each | Buy two 10-packs for 12 |
| 623ZZ 3×10×4 mm | $4.50 each | Optional roller feet, not walking BOM |
| 3525 4Ω 3W HP1.25 speaker | $6.70 | Selected 14-193 2-pin 1.25 connector, not 8Ω2W |

**Price computation:** The eight previous dated research plans used 2.5× normalized AliExpress supplier basis, including observed seller shipping when present. This release reverses that 2.5× basis and applies 1.2×, rounded to cents. These are **dated plans** not guaranteed destination-specific landed offers; actual checkout requires a fresh compatible variant and supplier delivered-cost verification. 20% over landed supplier cost with “free shipping” to the buyer could be insufficient to cover merchant fees or returns; do not silently auto-purchase.

## Non-AliExpress direct sellers
22 physical component families have **no MAKHEX sale price**, and the shopping page links to a seller/manufacturer. This includes the original creator's HAT and IMU, genuine 24 AWG AMP2.0 harnesses, six-size screws, wiring kit, exact Radxa board, and 16 legacy Squarespace priced parts without an independently qualified AliExpress mapping. Some commodity screws and wires appear on AliExpress but have NOT passed matching exact head/pitch/gauge or complete-quantity requirements. They remain external-only rather than representing a substituted supplier as verified.

## Corrected source visuals
The prior product cards physically had JPEG files for every slug, but six contained MAKHEX abstract illustrations instead of hardware:

| Catalog slug | New image type | Image provenance and limitation |
| --- | --- | --- |
| `microduck-hat` | **Creator's real native PCB layout** (not assembly photo) | SHA-verified [October 15 HAT EasyEDA project](https://github.com/kissqy/Microduck-kissqy/raw/refs/heads/main/hardware/ProPrj_HAT_REVA_SCH_2026-10-15.epro2), embedded PCB routing preview |
| `microduck-imu` | **Creator's real native PCB layout** (not assembly photo) | [October 15 IMU EasyEDA project](https://github.com/kissqy/Microduck-kissqy/raw/refs/heads/main/hardware/ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2), embedded PCB preview |
| `radxa-zero-3w` | Actual Radxa ZERO 3W board reference image | [Radxa board image reference](https://manuals.plus/ae/1005006677319461/images/S44149c5aba3e46a69258879973778d52R.png); **photo alone cannot verify 2 GB RAM, no eMMC, soldered GPIO option** |
| `microduck-fasteners` | Real pan-head miniature screw reference | [Retailer reference photo](https://i.ebayimg.com/00/s/MTAwMFgxMDAw/z/650AAeSwwaJouVpZ/$_12.JPG?set_id=880000500F); not an image of all six exact 200-piece source packs |
| `amp20-servo-cables` | Physical 3-pin servo cable reference | [Retailer reference photo](https://static.rapidonline.com/catalogueimages/product/37/13/s37-1337p01wj.jpg); **pitch, 24 AWG and actual AMP2.0 pinout NOT confirmed by photo** |
| `microduck-wiring-kit` | Composite of genuine black wire and heat-shrink supplier photos | [Black wire](https://ae-pic-a1.aliexpress-media.com/kf/Sc956d3e64f984aa9874917b537bcf33cU.jpg) + [164-piece shrink assortment](https://ae-pic-a1.aliexpress-media.com/kf/S64808fce0d384837a2995297adb2c5d9f.png); **3-core wire is sourced separately and not pictured** |

No unsupported “product photographed / selected SKU verified” claims should be made for the last six. The eight AliExpress rows already retain original selected-option supplier images. Original video, printing guides, models and the complete creator's documents remain accessible from Build 12.

## Acceptance tests
- Catalog 30 physical families, 8 internal Ali plans at 1.2×, 22 external/direct-only, 12 builds; 31st former product STL eliminated.
- MAKHEX API cannot accept external-only line items or old STL slug, and legacy saved carts are migrated.
- Microduck: 7 AliExpress BOM line types (36 physical units) at 20% plan; six other source types are direct vendor links; optional rollers separate.
- Browser test 390px, owner review/no charge, exception approval, 30 photo files verified and secure CAD member download.
