# MAKHEX Sprint 16 — Source-Matched Component Storefront

**Date:** 2026-10-22

## Shipped in this sprint

- 12 public component pages mapped to **12 AliExpress candidate source items** and **13 selected supplier variants** already staged as hidden, zero-inventory Squarespace products.
- Product cards now show specific supplier model names, an explicit technical REVIEW/HOLD gate, the number of related MAKHEX projects, and indicative price per selected option.
- Every component page shows the exact option description(s) and indicative retail price snapshot without falsely claiming availability, shipping, or approved delivered price. The 8×8 LED matrix and 8-LED ring are separate options.
- All 12 product illustrations are original, distinctive technical drawings rendered with accessible alt text. They are **not** copied supplier imagery or claimed to show actual shipped products.
- All 10 project BOM pages show provisional per-part and subtotal costs, with warnings that freight, taxes and unsourced subcomponents are excluded.
- Three specific BOM gaps are flagged: speaker for the voice node, momentary pushbutton for the smart button, and a rated 5 V LED power supply/possibly a logic shifter for the matrix clock.
- `/sourcing.json` v2 now gives AI agents 10 project-to-component mapping sets, selected formats, indicative prices, fulfillment gates, and BOM subtotal limitations without exposing supplier costs, private SKUs or tokens.
- Existing discussion forums, photo credits, asset/SEO routes and the Squarespace checkout approval gate are unchanged.

## Validated catalog facts

- Squarespace's confirmed bulk import: 10 new products, 11 variants; two manufacturer-referenced board candidates were already imported.
- Last successful readback: 21 total Squarespace products / 22 export variant rows. The 11 pre-existing variants were unchanged. All new variants remained hidden, inventory 0, with no active sales.
- Private Doroppu supplier registry: **12 source item IDs / 13 exact supplier option bindings**; checkout and supplier auto-ordering intentionally disabled.
- Latest AliExpress read-only freight tests provided **zero usable shipping quotes** and did not establish orderability. Do not publish optimistic carrier charges or delivery days.
- The old N4-selected ESP32-C6 trial still has an N8-facing hidden title; it must be corrected or archived once Squarespace edit access is available. It is NOT the manufacturer-referenced N8 entry offered as a reference candidate.

## Release QA

Run:

```sh
npm run check
npm run build
npm run qa
npx wrangler deploy --dry-run --keep-vars
```

Acceptance includes 12 staged prices, 13 variants, all 10 project BOMs, 3 hardware HOLD categories, and no qualified checkout paths. Visual QA was run using Edge headless and Chrome DevTools at desktop 1440, tablet 768 and mobile 390 pixel viewports; horizontal overflow must remain absent.

## Remaining before accepting real payment

1. Verify genuine manufacturer board variants and get permissioned vendor photos or original photos of samples (the drawings on the site are not listing photographs).
2. Verify shipping prices and realistic ETA to the actual delivery ZIP for each selected supplier variation. Resolve AliExpress DS freight API parameters with the vendor and ensure checkout-stock is truly orderable.
3. Reconcile Squarespace tax, shipping policy, weights, returns policy, purchase price, duties and customer-facing shipping promise.
4. Implement Squarespace Orders/Inventory API read permissions and idempotent Doroppu→AliExpress fulfillment / tracking / refund path. Test with an approved sample order only.
5. Correct/archive the first N4/N8 mismatched hidden test item, validate the camera, e-paper and USB-C hardware HOLD variants, and complete the missing BOM subparts.
6. Publish **one qualified product at a time** after documenting tests; only then set `storePath`, a signed-off `checkoutApprovals` ledger entry, visible stock and accurate Product schema.

Current classification is **presentation ready / research catalog live / checkout HOLD** — not revenue-ready.
