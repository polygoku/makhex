# Sprint 11 — Doroppu → MAKHEX Squarespace staged import

**Status October 22, 2026:** Live read-only AliExpress product API evidence was collected and three Squarespace hidden, zero-inventory test products were imported (one earlier trial plus two manufacturer-referenced N8/N8R8 candidates). The admin displayed 11 total products after the second import. Buyer checkout remains disabled; an independent post-import export for the final two products is still pending. See [Sprint 12 acceptance tracking](https://github.com/polygoku/makhex/issues/44).

## Architecture and repo responsibilities

- **Source of truth:** [Doroppu](https://github.com/polygoku/doroppu), using the existing validated AliExpress supplier parser (supplier CSV, normalized JSON or a previously saved official Dropshipping API response).
- **MAKHEX target:** existing Squarespace Basic storefront at `https://shop.makhex.com`, not Shopify. The public Astro/Cloudflare maker site stays independent.
- **Store import:** Doroppu `tools/makhex/export.mjs` creates an exact 28-column Squarespace v3 CSV, with `Visible=No`, `Stock=0` for every variant, deterministic `MKX-...` merchant SKUs, and no supplier variant identifiers in public metadata.
- **Provenance:** a local, ignored, private ledger separately records AliExpress item and exact supplier variation ID, supplier unit cost, available shipping quote and source images. Do not copy that ledger into MAKHEX `public/` or GitHub.
- **Independent gate:** `scripts/verify-doroppu-bundle.mjs` in this repo checks contract, per-row hidden status, zero stock, slug consistency, source count, and no implicit publish authorization before any manual Squarespace upload.
- **Future automation:** Squarespace Commerce Products API v2 supports product creation, but the current Doroppu stage only creates a *disabled offline request preview* and does not configure an API credential or send requests.

## Staging a supplier catalog

From the Doroppu repo on the XPS, with Node 24+:

```powershell
node tools/makhex/export.mjs --source-type csv --input PATH_TO_REVIEWED_SUPPLIER.csv --store-page support --existing-export reports/current-squarespace-products.csv --template reports/official-squarespace-v2-template.csv
```

`--store-page` must match the existing Squarespace store page URL slug, **not** a guessed `shop.makhex.com` path. Existing Squarespace category slugs can be supplied separately. To stage a saved response use `--source-type aliexpress-api --source-url https://www.aliexpress.com/item/REAL_ID.html`; the CLI makes no provider call.

The supplier multiplier defaults to 1.7 only for *proposed preview* prices. It does not include shipping, taxes, payment fees, returns or landed-cost risk. Variants, availability and board revisions must be confirmed. Direct supplier images are deliberately omitted unless `--include-images` is chosen after confirming reuse rights and identity.

Then from this MAKHEX repository:

```powershell
node scripts/verify-doroppu-bundle.mjs PATH_TO_DOROPPU_REPORTS/squarespace-import.csv PATH_TO_DOROPPU_REPORTS/review-manifest.json
```

Passing the verifier means **CSV format and protective fields** match; it does not mean supplier qualification or permission to upload/publish. Check an up-to-date Squarespace product export to avoid duplicates. CSV imports do not automatically synchronize inventory and cannot set per-variant images.

## Required gates before importing or turning products live

1. Verify official AliExpress developer approval, working authenticated `aliexpress.ds.product.get`, and whether exact SKU is purchasable at supplier checkout. Doroppu PR #15 remains a **draft**; it has unresolved API secret-type verification and no live connected merchant.
2. Confirm ESP32 board revision, chip, flash/PSRAM, pins, display controller, power supply, firmware compatibility and actual build proof. Link a MAKHEX project BOM only to a verified compatible supplier item.
3. Check U.S. shipping charge/time, returns, selected variant stock, shipping weight, title cleanup, licensing of finished-product photos and final contribution margin.
4. Confirm the Squarespace Store Page ID/slug, existing category names, import template version, and local SKU ledger. Upload product CSV as **hidden, stock zero**; verify post-import records through admin.
5. Only after independent approval may a specific product in `src/data/products.ts` gain a verified `storePath` to a public Squarespace product page. Checkout test must cover cart, payment, order, fulfillment and refunds.

No demo products should be exposed, no categories or store slug should be guessed, and no supplier/order secrets should enter GitHub or the public Worker. No storefront changes are made by staging.

## Checks

- `npm run test:import` verifies the MAKHEX boundary rejects accidental visibility, nonzero stock, malformed SKUs and false claims of publication.
- `npm run qa` also invokes the independent import tests alongside the existing website QA.
- Doroppu suite: `npm test` and `npm run test:makhex`.

## Current provider references

- [Squarespace CSV import](https://support.squarespace.com/hc/en-us/articles/115000378108-Importing-products-from-a-csv)
- [Squarespace Products API v2](https://developers.squarespace.com/commerce-apis/products)
- [Doroppu AliExpress OAuth draft PR #15](https://github.com/polygoku/doroppu/pull/15)
## Verified Squarespace import behavior, October 22, 2026

The MAKHEX site's *actual* Products > Import > Download CSV Template supplied a **28-column `product_import-v3.csv`** with `GTIN` and `MPN` immediately after `SKU`; both should remain empty unless verified. The old 26-column template must not be used. A blank Product Page field **failed** with `Product page not found` on this site. The existing verified Store Page slug is **`support`**. Always confirm this value against a fresh admin export before later imports.

The real import UI confirmed one hidden stock-0 trial and subsequently `IMPORTED (2)` for two manufacturer-referenced listings, with **11** products shown after importing. The supplier listing behind the *first* C6 trial was selected as `N4` despite its title saying `N8`; leave it hidden with stock 0 and correct/archive it before publishing. The final two products still need independent post-import CSV readback and existing-catalog comparison because the XPS remote session timed out. All 12 other research candidates remain staged locally, **not** uploaded. See [Sprint 12 issue #44](https://github.com/polygoku/makhex/issues/44).
