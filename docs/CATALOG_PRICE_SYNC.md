# MAKHEX storefront price synchronization

## Which system controls each value?

- **Squarespace Commerce** (`shop.makhex.com`) owns physical product records, merchant-facing SKUs, photographs, merchant prices, visibility and stock.
- **MAKHEX public storefront** (`makhex.com/shop/`) is an Astro site deployed on Cloudflare. It renders the **public retail planning snapshot** in `src/data/catalog-staging.ts`. These values are compiled at build time, not fetched from Squarespace at runtime.
- **Doroppu** owns private AliExpress sourcing/variant research and fulfillment integration. A matching AliExpress listing or selected browser option does **not** prove U.S. orderability, verified freight, return eligibility or permission to initiate a supplier order.

Updating Squarespace alone does **not** update the public MAKHEX site. Use the following guarded synchronization after any merchant price change. Do not copy wholesale costs or AliExpress source URLs into the public product data.

## Operator workflow (API key not required)

1. Sign in to the **MAKHEX Squarespace** account and export **Products > Export All** as a fresh CSV. Do not use an older catalog export. Keep it private on the operator machine.
2. Check the exact AliExpress option, observed item price and shipping implications with Doroppu before treating a cost change as acceptable. Merchant catalog price follows the approved **supplier cost × 2.5** strategy, subject to the free-U.S.-shipping profitability gate.
3. Ensure intended MAKHEX merchandise remains **Hidden** with **Stock = 0** until the complete fulfillment checkout pilot is accepted. Retain the separate incorrect **ESP32-C6 N4 trial** as hidden; do not relabel it as the N8 supplier option.
4. Sync approved merchant prices into the version-controlled public retail snapshot (use the absolute CSV file path):

   ```powershell
   node scripts/sync-squarespace-prices.mjs "C:\path\to\fresh-squarespace-export.csv" src/data/catalog-staging.ts
   npm run build
   npm run qa
   npm run check
   ```

   The sync command matches the explicit 16 known component slugs, enforces positive prices/Hidden/zero-stock, validates the number of variants and requires a complete reviewed catalog. It does not publish inventory, enable checkout, create products or expose private supplier costs.
5. Commit the intended changes, use a reviewed pull request, and deploy from the approved revision with `npm run deploy` (Cloudflare credentials remain in the authorized environment).
6. Inspect `https://makhex.com/shop/`, each updated `/shop/{slug}/`, project BOM totals and `/sourcing.json` after deployment. Confirm the public amounts match the latest exported Squarespace prices. When available, run the export regression test using `MAKHEX_OWNER_SQUARESPACE_CSV` as the full path to the fresh CSV.

## Acceptance snapshot: October 25, 2026

The authenticated Squarespace export confirmed **16 component families with 16 hosted photos**, no unexpected merchant SKU changes, zero sellable stock and Hidden visibility. On the public Cloudflare site, **16 retail-planning component families / 17 option prices** are shown out of 30 researched components; the other 14 remain `Price pending`.

Confirmed new prices: ESP-Mosaico Vision Combo Kit **$201.70**, 28 mm 4-ohm 3 W speaker **$6.35**, 6×6×4.3 mm tactile switches **$3.55**, Waveshare US-plug 5 V 5 A adapter **$29.18**. The Mosaico, switch and adapter prices are updates from the prior snapshot; the speaker was already priced at $6.35 in Squarespace.

**Live checkout is still gated**, and a planned price is not an orderability or delivered-total quote. Source variation mapping, ZIP 11021 landed-cost qualification, official order-placement permission and true Squarespace-to-Doroppu supplier-order/tracking/refund tests are separate launch gates.

## October 27: historical Radxa research estimate (not merchant export)

The private Microduck supplier ledger contains an October 25 exact-option quotation for Radxa ZERO 3W 2 GB, no eMMC, populated GPIO header (manufacturer RS107-D2E0H1W15). The supplier API reported **zero stock** for that selected option. There was no confirmed ZIP 11021 supplier checkout, and the supplier offer is not current. The public **$271.98 historical retail planning estimate** applies the MAKHEX 2.5× rule to that dated reference without exposing wholesale costs or seller identifiers.

This datum lives in `src/data/research-price-references.ts` and is overlaid by `stageFor()` on a missing Squarespace item. It is **not** added to the 16-row authenticated Squarespace merchant-price snapshot and does not unlock checkout, set stock, or create a Squarespace product. When Radxa receives a validated current supplier quote and a reviewed merchant export, replace the historical datum with the true Squarespace variant/price and remove the research fallback.

`maker-cart.js` migrates old `Option pending` entries only when a component now has exactly one known option; it leaves genuinely unquoted parts labeled as requiring a quote. Avoid displaying a $0.00 subtotal when no priced lines exist.
