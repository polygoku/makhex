# Microduck AliExpress SKU/pricing mapping — 2026-10-28

## MAKHEX ownership and checkout policy
- MAKHEX remains the seller. All 30 components stay in the project's MAKHEX cart; no user needs to purchase on supplier websites.
- For Oct 28, 7 previously unpriced Microduck research components now have **matched supplier variant photos and 2.5× retail planning prices**; 7 remain unpriced for genuine sourcing reasons. This raises the public MAKHEX catalog from 16 priced merchant families to **23 priced/planned families**, covering 24 distinct retail options.
- The **16 existing Squarespace product families, 17 merchant prices and their photos are unchanged**. The added 7 estimates are in `src/data/microduck-price-plans.ts`, not in the authenticated Squarespace catalog export. Do not mistake storefront research prices for payment-ready merchant products.
- **All 7 new price plans remain HOLD** and the Cloudflare buyer flow submits order requests; paid checkout and Doroppu orders require genuine qualification and owner review.
- Customer U.S. shipping is advertised free only after a valid landed-cost/margin check. A historical or welcome-buyer discount cannot set permanent retail prices.

## Exact source and lot matching

| MAKHEX item | Selected option | Supplier pack / Microduck quantity | Planning retail per MAKHEX unit |
|---|---|---|---:|
| Feetech HD-1910-C001 | **15 x Servo** TTL dual-axis serial bus | 15 servo pack / 15 motors | $71.53 |
| IMX219 wide-angle CSI | **160 Degree**, not 77° default | 1 camera / 1 | $21.88 |
| VL53L5CX V2 | **VL53L5X V2** model, not bare IC | 1 / 1 | $50.00 |
| NP-F550 power kit | **2Pcs set** + LCD dual charger | 1 set / 1 | $71.78 |
| 6700 OPEN bearing | **S6700W3-OPEN 10×15×3** | 10 bearings / 5 required | $7.44 |
| ET2216ZZ bearing | **ET2216ZZ 16×22×4**, replacement listing | 10 per lot / 12 required (2 lots) | $12.50 |
| 623ZZ bearing, optional | **623ZZ 3×10×4**, not default 683ZZ | 10 per lot / optional 8 bearings | $9.37 |

Quantities are *individual MAKHEX parts*, not supplier packs. For the 15 servo motors, do not order 15 separate supplier 15-packs. ET2216ZZ requires two supplier lots to supply 12 bearings. Optional 623ZZ rollers are not in the standard walking build.

These prices use conservative normal (non-first-time-buyer) observed supplier option pricing and known generic U.S. shipping where available, normalized to the Microduck build quantity. They **are not verified landed cost to ZIP 11021**. If a customer orders only one Feetech motor or one 6700 bearing, the supplier-pack economics change and the owner must approve an adjusted quote. Taxes, extra shipping and stock require final verification.

## Still unresolved / MAKHEX owner exceptions
1. **Radxa ZERO 3W** — 2 GB RAM, no eMMC, soldered GPIO: the inspected AliExpress exact GPIO option was sold out. A default 1 GB/no GPIO item is **not** compatible.
2. **Microduck custom HAT** — original AMP2.0 HAT with Oct 15, 2026 PCB/firmware revision; creator Taobao or fabrication authorization, complete BOM/CPL, and assembled board test.
3. **Microduck custom IMU** — creator LSM6DSV16X/STM32G031 matching bus and firmware; needs assembled hardware testing.
4. **FrankenDuck printed parts** — creator's 36 STL plus five-plate 3MF, PLA/TPU fabrication and QA, no stock AliExpress SKU.
5. **M2/M2.6 fasteners** — one generic 400-pc AliExpress listing was found, but exact six lengths, head types and quantities were not proven. Must not substitute without proof.
6. **AMP2.0 servo cables** — both 100 and 200 mm, 3-pin 24AWG plus correct connector; generic PH2.0/26AWG and 2.54mm PWM extensions do not match.
7. **Microduck wiring/heat shrink kit** — 22AWG three-core and black single-core, and heat shrink. Bundled offer and shipping not verified.

**Additional per-build exception:** the Microduck 3525 / 4 Ω / 3 W / HP1.25 speaker is NOT the 28 mm speaker sold in the existing Squarespace listing for Build 02. That $6.35 price must never be charged for the Microduck speaker.

## Deliverables and follow-up commerce work

- Seven selected-variant JPEG source photos staged at `public/product-media/{slug}.jpg`, linked via source-aware `ProductPhoto.astro`; the original 16 photos remain unchanged.
- `src/data/microduck-price-plans.ts` overlays the seven review plans without changing `catalogStaging`, and `scripts/build-order-catalog.mjs` includes them in the protected checkout catalog; `shippingVerified` and `buyerOrderabilityVerified` remain false.
- `scripts/build-microduck-squarespace-import.mjs` creates a 28-column, **Hidden/Stock=0** Squarespace import CSV and review manifest on KY_BASEMENT. This is **not a live Squarespace import** and is not permission to sell before qualification.
- Next work: import the approved hidden products via the logged-in Squarespace Basic browser, compare with existing merchant products, verify each variant and photo, then individually clear stock/shipping and fulfillment gates based on fresh ZIP-qualified supplier checkout. Do not bypass the pilot or automatically spend owner funds on uncertain supply orders.
