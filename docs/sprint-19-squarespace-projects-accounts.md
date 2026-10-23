# Sprint 19 — Squarespace commerce, richer build guides and maker identities

## Priority decision
MAKHEX uses **Squarespace Commerce**, not Shopify. The customer sees only MAKHEX-branded pages at `makhex.com` and the existing native Squarespace shop at `shop.makhex.com`. Doroppu and the upstream AliExpress supplier remain behind the checkout. No public supplier URLs, supplier SKU IDs, or AliExpress branding are exposed in customer links. Do not invent a cross-domain add-to-cart URL or use the Squarespace Admin API as if it could charge the buyer.

## Customer purchase flow
1. The visitor starts on a MAKHEX project and reviews its BOM, use cases and verified specs.
2. Each part has a MAKHEX detail page. Only a variant with approved proof in `checkout-approvals.ts` and a verified Squarespace product path can show **Select options & add to cart**. Otherwise, show **Coming soon**, not a fake cart.
3. Clicking a qualified part navigates to the exact Squarespace product detail under `https://shop.makhex.com`. Native Squarespace variant selection, **Add to Cart**, cart, checkout, tax calculation, payment and buyer-account flows remain first-party to the Squarespace store. A persistent header cart link targets `https://shop.makhex.com/cart`.
4. Squarespace records a paid order. The separate deployed Doroppu MAKHEX intake Worker validates a signed `order.create` / `order.update` webhook, re-reads the authoritative Squarespace Orders API, idempotently records an order case in D1 and inspects every merchant-facing SKU.
5. Each SKU must be in a private supplier qualification ledger with exact source variant, merchant SKU, destination-specific freight/ETA, available stock, one-unit checkout/orderability proof, returns terms, intellectual-property rights, and approved landed contribution.
6. Order state advances from **HOLD_UNQUALIFIED** to **READY_FOR_MANUAL_REVIEW** only after paid status, ship-to ZIP, stock, shipping and all SKU gates pass. A separate, explicitly authorized Doroppu purchase action must translate qualified line items into an official AliExpress Dropshipper API order, record a supplier order ID and payment confirmation **once**, then poll tracking and update Squarespace fulfillment. Never place an upstream order during webhook retries.
7. Refunds and cancellations are reconciled across the payment provider, Squarespace order state and supplier order. No false refund promise; Squarepace Orders API does not itself provide a generic charge-refund endpoint.

### Hard blockers on October 23
- Original ESP32-C6 N8 label was corrected to **N4, unverified, not for sale**, hidden, stock 0. Other products are still hidden with stock 0.
- Product pricing is supplier-unit-cost x2.5; free U.S. customer shipping configured in Squarespace. Supplier freight, fees and landed contribution **not yet proved**.
- Squarespace order intake Worker deployed with dedicated D1 and zero qualified variants but not connected to an Orders OAuth webhook subscription. An Orders API key could alternatively be used for authenticated order polling, if configured and proven; webhook management requires OAuth.
- AliExpress developer profile approved, but Dropshipping API application/scopes, exact shipping to ZIP 11021, payable supplier order creation, returns and tracking/refunds remain unverified.
- GitHub Cloudflare token failed read-only authentication HTTP 401. Automatic deployment deliberately disabled. Owner must replace least-privilege Workers token and rerun token scope audit.

## Project guides / agent contributions
All ten projects now contain goal, actual use cases, prerequisite checks, rough bench sequence, acceptance tests, credited independent reference image/repo and explicit instructions for AI coding agents. Independent reference photos do not imply MAKHEX built or validated the shown device. Verified creator videos linked only for Spottr BLE Beacon and trandi E-Paper Calendar.

The `builds/<slug>/README.md` files are the repo-based **working specifications**, not copied firmware. Agents should start there, check the original creator's repository for inspiration, then use a MAKHEX issue/PR and the per-project moderated discussion to propose changes with logs, board rev and safety constraints. Do not invent hardware pinouts or claim a complete kit when missing parts exist.

## Human, agent and buyer identities
- **Maker account**: a pseudonymous human community account at `/account/`, protected by Cloudflare Turnstile and per-IP/global limits. Registration returns a high-entropy recovery key **once** and issues an HttpOnly Secure SameSite=Lax cookie. D1 stores only hashes of recovery keys and sessions, no passwords or email. An account can log in from another browser using its stored recovery key; losing the key and all active sessions has **no automated recovery**. Moderated posts are associated with the account.
- **AI agent account**: existing `/agents/` and bearer-token registration; separate actor kind, limits and moderation. Agent API tokens cannot access payment or supplier-order operations.
- **Buyer account**: native Squarespace customer account and payment/order history at `shop.makhex.com`. This is a distinct identity; no SSO or synchronized passwords are claimed. Enable Customer Accounts in Squarespace Selling settings before calling the account link operational.

## Activation procedure
1. Run `npm ci && npm run check && npm run build && npm run qa` plus `npm run test:accounts`.
2. Before deploying, apply existing D1 community migration 0001 (if not applied) and **0002_human_accounts.sql** to the live `makhex-community` database using authenticated Wrangler; backup current D1 first.
3. Confirm `COMMUNITY_RATE_SALT` and `TURNSTILE_SECRET` secrets exist and Turnstile site key is allowed for makhex.com.
4. Deploy updated static site and community Worker only through authenticated/approved Wrangler; verify `/api/v1/community/users/status` says registration enabled. Exercise one authorized human signup/login/logout, then one moderated comment. Verify agent registration/comments unchanged. Never display recovered secrets in logs/screenshots.
5. Enable Squarespace Customer Accounts separately; confirm native product/cart/checkout navigation using a **qualified test product** only.
6. Connect Orders API OAuth or tested poll-based read; create signed webhook subscription and test a notification. Qualify first exact supplier item. Then perform a deliberately approved low-risk end-to-end test order with an explicit payment/cancellation/refund plan; only after pass enable **one** checkout-approved SKU.

### Sources
- https://developers.squarespace.com/commerce-apis/orders
- https://developers.squarespace.com/commerce-apis/webhooks/overview
- https://developers.squarespace.com/commerce-apis/update-webhook-subscription
- https://support.squarespace.com/hc/en-us/articles/115012777327-Customer-accounts
- https://support.squarespace.com/hc/en-us/articles/206541027-How-customers-buy-your-products