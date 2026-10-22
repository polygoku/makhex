# First product pilot — ESP32-S3 touch display for Touch Weather Station

## Current status

**RESEARCH ONLY / NOT FOR SALE.** MAKHEX currently displays the `esp32-s3-touch-35` product candidate and the flagship `touch-weather-station` project. The downloadable BOM also references a BME280 sensor and USB bench-power accessories. None of these are vendor-verified, bench-qualified *as a kit*, or orderable through the paid Squarespace Basic site.

## Evidence required before any product launch

| Gate | Collect and record in GitHub issue #31 |
| --- | --- |
| Supplier | Authorized listing URL, seller identity/terms, specific physical manufacturer, exact variant/SKU/revision |
| ESP32-S3 | Module type and revision, flash/PSRAM, boot mode, schematic, firmware/SDK version, pin map and USB power limits |
| Display | Actual LCD controller, touch controller, panel dimensions/resolution/orientation, interface pins and example firmware |
| BME280 | Confirm actual **BME280**, not BMP280; correct breakout I2C level shifting, voltage and address for this exact display-board revision |
| Power | Safe rated USB supply, common ground, current budget and connector/accessory fit; no unsecured LiPo charger claims |
| Inventory | Supplier selectability AND verified one-unit checkout orderability for exact variant; landed cost/shipping for a representative U.S. destination |
| Media | Original/permissioned board and enclosure photos, correct variant photos, no supplier-logo misrepresentation |
| Squarespace | Draft SKU, tax, inventory, shipping methods/rates, returns/cancellation policy, publicly accessible product URL on real shop host |
| Live test | Explicitly authorized low-value test order, actual order value and transaction ID, expected stock decrement, supplier fulfillment, refund/cancellation path |
| Release | Dated evidence/reviewer in #31, update only the matching exact `Product.storePath` and `checkout-approvals.ts`, retain holds for all others |

The first physical prototype can use an on-hand board **only after** its exact model and revision are checked against vendor pinouts. A successfully running display is not proof that the AliExpress/Squarespace selling variant has the same controller.

## Project-first checkout principle

Do not offer a "buy the complete kit" button until **all three** BOM lines and their combined order fulfillment have been verified. An individual verified component may appear as a Squarespace product link; other items and the complete project remain marked research-stage. All community feedback should go to the corresponding existing GitHub Discussion, not a duplicate forum.

See [issue #31](https://github.com/polygoku/makhex/issues/31), [catalog-qualification.md](catalog-qualification.md), and [roadmap-2026.md](roadmap-2026.md).
