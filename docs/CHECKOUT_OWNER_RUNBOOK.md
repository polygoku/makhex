# MAKHEX first-party checkout and exception queue — operator runbook

**Production invariant:** Project → Add All Parts → MAKHEX cart → MAKHEX order request → qualified quote/exception approval → MAKHEX Squarespace-hosted payment → manually reconciled Doroppu sourcing and fulfillment. **External seller pages are not normal buyer checkout routes.**

## What is live after this release

- All 30 component families and all 12 project BOMs submit one first-party MAKHEX order request.
- MAKHEX holds the requested quantities and options in Cloudflare D1, with an access-token-based customer status page.
- The customer's request is **not a paid order**. Credit cards, full addresses and payments remain outside the MAKHEX Worker and should be submitted only into genuine Squarespace-hosted payment checkout.
- The owner exception queue is served at `/ops/orders/`, protected by a separate encrypted Cloudflare Worker secret. Only the owner can set approved final price, attach a legitimate MAKHEX Squarespace payment link, attest to a verified Squarespace payment receipt, and record shipment tracking.
- Existing Squarespace 16 hidden/zero-stock products remain unchanged. Fourteen other components require owner sourcing and price qualification. No existing SKU gets fake stock or a historical quote.
- This is an **interim manual exception workflow**, not full unattended checkout. The long-term goal is to automatically clear validated order lines and route only true exceptions to the owner. All 30 remain on review until their supplier and payment integrations are certified.

## Before deployment

1. Apply `migrations/0003_checkout_exceptions.sql` to the remote `makhex-community` D1 database, after confirming its contents and schema.
2. Provision `MAKHEX_ORDER_ADMIN_TOKEN` using `wrangler secret put` from a private host-side file or secure prompt. **Never commit or publish the token.**
3. Use the authenticated HTTPS browser and a human-approved Turnstile challenge for customer requests. The existing community account anti-spam settings `TURNSTILE_SECRET` and `COMMUNITY_RATE_SALT` must stay configured.
4. Run `node scripts/build-order-catalog.mjs --check && npm run check && npm run build && npm run qa`; run a headless browser test at a mobile viewport. Do not publish code that bypasses any gate.
5. Confirm no request was accidentally created by automated tests; staging tests use mocked requests.

## Owner exception workflow

1. Open `https://makhex.com/ops/orders/` and enter the private owner key; nothing is stored in browser localStorage. Use the password manager to retain the key across devices.
2. Review every component, exact selected option, quantity, ship-to state/ZIP, compatibility, U.S. landed cost and 2.5× gross retail calculation. Free customer U.S. shipping is included in MAKHEX margin.
3. **Approve** only when the full basket, stock, shipping, taxes, refund rules and margin are defensible. Enter the actual final total and a dated evidence note; otherwise **reject** with reason. Seek customer approval for material substitutions or price changes.
4. Create a genuine MAKHEX Squarespace Pay Link for the *entire approved order* and verify that item/quantity/total matches, or use a merchant-hosted SKU bundle checkout as applicable. The Pay Link is a one-transaction payment route, **not** evidence that individual supplier SKUs have been imported or automatic fulfillment has been tested.
5. Attach the verified `shop.makhex.com` or official Squarespace HTTPS URL in the owner queue. The customer sees the payment button on their private status URL.
6. After the customer pays, inspect the real Squarespace order receipt and approved final amount in merchant dashboard before **Record verified Squarespace payment**. A synthetic order ID or the existence of a payment link is not proof of payment.
7. Fulfill using the vetted supplier(s), reconciling Doroppu placement and payment journal first to avoid double-orders. Record actual carrier/tracking. Refund through Squarespace Payments where applicable; the initial queue does **not yet perform automatic refund or fulfillment actions**.

## Privacy and limitations

- The buyer status link includes a private 256-bit token in the URL hash; it is transmitted only in a JSON POST, not as a query parameter.
- The checkout database holds email, state/ZIP, order components and owner notes; **no passwords, card numbers or full shipping address**.
- A private status link expires after 30 days; customer should copy/save it when the request is submitted. Automated email notification is **not configured**. The owner should check the exception queue regularly.
- These D1 rows are not currently automatically cleaned up. Establish a data retention/deletion policy before regular production scale.
- Only the Squarespace payment processor may charge. MAKHEX's own HTML checkout does not collect payment details.
- Live automatic Squarespace → Doroppu → AliExpress fulfillment, payment reconciliation, tracking/refund synchronization and hands-off no-exception orders **still need controlled real purchase certification**.
- Do not use buyer-facing external seller links as the primary call to action again. The documented `docs/COMMERCE_CHARTER.md` controls future release decisions.
