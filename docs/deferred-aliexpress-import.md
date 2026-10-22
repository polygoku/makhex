# Deferred AliExpress-to-Squarespace import handoff

Scope: research/interface only. Another agent is building the AliExpress importer. Do not import products, change inventory, activate checkout, or cut over DNS during this work.

## Recommended path: Squarespace's native CSV import

Squarespace officially supports CSV imports on Basic, with up to 10,000 products on version 7.1 or 200 on 7.0 and 250 variants per product. The import is one-shot; it does NOT automatically synchronize inventory or pricing. Source: https://support.squarespace.com/hc/en-us/articles/115000378108-Importing-products-from-a-csv (updated September 17, 2026).

1. Export a normalized supplier manifest: stable external product ID, supplier/variant IDs, board model and revision, option names, costs and currencies, image rights and direct image URLs, shipping and return provenance, source timestamps.
2. Get the exact template from this site's Products > Import > Download CSV template; confirm Squarespace site version and store-page/category slugs. Do not hard-code a guessed template.
3. Convert the manifest into site-compatible physical-product CSV; preserve any native IDs on later bulk edits, and preserve supplier IDs outside merchant-facing SKU.
4. Set Visible = No for every new SKU; avoid publishing tentative stock or delivery claims.
5. Validate image URLs (CSV supports hosted image links, not local files; variant images must be configured separately), options, variants, dimensions, unique SKUs and tax/shipping defaults.
6. Perform a small hidden dry-run import, then export from Squarespace and reconcile rows, images, variants and paths. This is a later sprint, not authorized now.
7. Only after a separate supplier/orderability and checkout review, qualify one specific SKU, configure its exact public product path and evidence ledger entry; all other checkout stays disabled.

## Future API option

Investigate Squarespace Commerce Products and Inventory APIs with the connected account and plan permissions before coding. Prefer officially supported authenticated APIs over scraping. Establish a stable mapping across source product and variant IDs, Squarespace IDs, and MAKHEX slugs. CSV is not a realtime syncing mechanism.

## Boundaries

AliExpress importer agent owns sourcing and normalized source data. MAKHEX storefront owns maker guides, community and fail-closed checkout controls. Squarespace owns payment and order capture. A successful product import never proves inventory, shipping, resale permission, or order fulfillment.

Official export reference: https://support.squarespace.com/hc/en-us/articles/360000694948-Exporting-products-to-a-csv