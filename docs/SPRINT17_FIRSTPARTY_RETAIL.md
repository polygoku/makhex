# MAKHEX — retail simplification and first-party checkout path

**2026-10-22 • Sprint 17**

Customer-facing flow: MAKHEX components and project BOMs lead to MAKHEX product pages only. No public AliExpress source links, source IDs or upstream supplier-price data. Doroppu remains the private AliExpress supplier-integration system.

Retail pricing: each of 13 selected supplier variants is priced at 2.5× its chosen supplier product cost, rounded to cents. Squarespace confirmed bulk import “IMPORTED (21)”; a before/after export verified exactly 13 price changes among 22 rows and zero other edits. The price audit is held in ignored Doroppu reports on XPS. Site prices are synchronized to those exact values.

Shipping: Squarespace rate **Free U.S. Shipping**, $0 per order, $0 per item, 0% handling, configured for United States (54 of 54 states/territories as shown in the Squarespace UI). Customers pay no shipping charge under that rate.

Visual: simple model/price/shipping hierarchy. Remove repeated labels, verbose caution panels and AliExpress links. Project BOMs link to MAKHEX components and show an estimated subtotal. Public sourcing.json now serves MAKHEX retail items and prices, not supplier URLs. Supplier identifiers remain in the existing ignored Doroppu private fulfillment registry, not deployed to MAKHEX.

**Commerce gate:** imported items stay hidden and stock 0 until supplier orderability, exact variant, destination-specific delivery and Squarespace–Doroppu order/tracking/refund paths work. Free customer shipping does not mean supplier freight is free; 2.5× product multiplier does not prove net margin. Do not add live cart links until a controlled end-to-end order passes.

Verification: npm run check; npm run build; npm run qa; compare live pages to the Squarespace export; confirm zero AliExpress links in public pages and agent catalog; verify native project discussions.
