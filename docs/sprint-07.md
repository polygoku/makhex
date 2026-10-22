# Sprint 07 — Squarespace shop, DNS safety, and first FNK0104N qualification

_Account inspection: October 21, 2026 EDT / October 22, 2026 UTC._

## Decision

Retain the **paid Squarespace Basic** subscription and registrar for the commerce backend. Serve the maker/workbench content from **GitHub + Astro + the existing Cloudflare Worker**. The Squarespace site’s new primary domain is `shop.makhex.com`; `makhex.com` and `www.makhex.com` are reserved for Cloudflare after a controlled DNSSEC/DNS cutover.

**Do not change the existing Cloudflare deployment API token or enable unattended deployment in this sprint.** Manual, verified Wrangler deployment is an acceptable alternative. All MAKHEX research product checkout links remain disabled.

## Directly verified on owner-signed-in account

### Squarespace site and catalog
- Site: MAKHEX at `drum-deer-ax7k.squarespace.com`, existing paid Basic subscription. `makhex.com` remains its Squarespace-managed **domain registration**.
- Domains panel shows `shop.makhex.com` under **Domains managed by third-party**, marked **Connected · Primary**. This was achieved using Squarespace’s **Use a Domain I Own → Connect subdomain** flow.
- Squarespace automatically inserted `shop CNAME ext-cust.squarespace.com`. Authoritative `nsb1.squarespacedns.com` answers for that record.
- `https://shop.makhex.com/` and the built-in Squarespace origin returned **HTTP 401** because site availability is **Private**. **Shop is NOT launched**; HTTP 200, SSL and redirects require live recheck after publishing.
- The Squarespace product list initially contained **six Public unrelated template products** plus one Hidden unnamed placeholder. The six were changed reversibly to **Hidden** using each product's visibility cell. Verified final state: **7/7 Hidden, 0 Public**. Nothing deleted; no product prices, stock or orders altered.
- No Squarepace live product was approved or published as part of this sprint. A separately managed SKU drafting effort must be checked to avoid duplicate products.

### DNS control plane
- Squarespace authoritative DNS settings: **11 records** observed: 4 apex A, 1 `www` CNAME, 1 old Squarespace apex HTTPS/SVCB service hint, 1 `_domainconnect` CNAME, 3 email-security TXT and 1 `shop` CNAME. Raw snapshot kept in ignored local `reports/squarespace-registrar-zone.json`.
- Cloudflare Free-zone **pending**: zone ID on file in authorized account, nameservers `maya.ns.cloudflare.com`, `rodney.ns.cloudflare.com`; 10 staged records including `shop CNAME ext-cust.squarespace.com` and `_domainconnect`, both **DNS only**, plus the email-security TXT records. Raw UI snapshot kept in ignored `reports/cloudflare-staged-zone.json`.
- The old `@ HTTPS` record includes Squarespace IP hints and must be **retired/replaced**, not blindly copied into Cloudflare.
- Cloudflare staging still has the old Squarespace apex A and `www` CNAME. If nameservers were changed now without Worker routing, MAKHEX's apex would land at the old Private Squarespace site. The cutover comparison **fails closed** for this.
- **DNSSEC blocker:** public parent `DS` lookup returned an active DS key for `makhex.com`. Do not switch to Cloudflare nameservers without first clearing or coordinating DS at the Squarespace registrar and verifying propagation (see Cloudflare documentation). Original four nameservers are `nsb1`–`nsb4.squarespacedns.com`.
- Actual comparator result: preserved five non-cutover entries successfully matched (shop, domain connect, SPF, DKIM placeholder and DMARC). **NO-GO** from three explicit blockers: unchanged apex target, unchanged www target, active parent DS. No provider DNS/NS/DS edits performed.

### Freenove product pilot
- Exact official manufacturer option: `Freenove FNK0104N`, 3.5-inch IPS Touch, 320×480, ST77922. Official product Shopify variant `46006024995014`; price **$25.99 USD**, `available=true` during check (not stock quantity/reservation).
- A one-unit **anonymous cart quote** to ZIP 11021 returned **$0.00 Standard Shipping from China (11–15 working days)**. No checkout payment, order placement, or customer data provided. Freight/availability and any duty/tax can change.
- Manufacturer policy: normally dispatch within 2 working days, carrier tracking after shipment; 30-day return policy with exclusions. Actual U.S. return postage, vendor resale/dropship support, orderability and last-mile performance **remain UNKNOWN**.
- Manufacturer SDK docs and current physical-board revision must be checked before claiming BME280 wiring is verified or releasing a full Touch Weather Station kit.
- Candidate remains `Research`, and `checkout-approvals.ts` stays empty. No pilot sales price or live inventory was set.

## New source-control safeguards

- `scripts/dns-cutover-compare.mjs` explicitly exempts retired Squarespace apex HTTPS/SVCB service hints but blocks unchanged apex/www origin targets, stale hints, changed shop CNAME and active/unknown parent DS.
- `scripts/launch-audit.mjs` makes a read-only independent Cloudflare DNS-over-HTTPS lookup for the parent DS. DS presence or an unverifiable lookup is a pre-cutover **BLOCK**.
- Automatic GitHub deployment remains **off**; its scoped-token review gate is unchanged. Manual Wrangler release is not a domain-migration prerequisite.
- Expanded regression tests cover the newly discovered real-world hazards.

## Remaining go/no-go actions

1. **Squarespace shop:** Check site content/template, finish intentional launch copy, keep all sample products Hidden, then switch Site Availability to Public. Verify `shop.makhex.com` HTTP 200, certificate, no apex redirect and **zero unauthorized purchase listings**.
2. **DNSSEC:** Plan Squarespace registrar DS removal or supported DNSSEC migration; observe TTL and independent validator results before NS changes.
3. **Cloudflare origin:** Pending zones cannot use Workers **Custom Domains** until activation. Pre-stage an appropriate Worker routing cutover plan; do not delegate to a zone with apex/www still pointing to the old private Squarespace site. Validate at least one end-to-end rollback.
4. **Commerce:** Coordinate pilot SKU with the separate catalog agent; request reseller/dropshipping/returns evidence, verify physical revision, exact one-unit checkout, customer shipping/tax/refund/fulfillment. Only then promote one specific SKU to `Qualified`.

See [issue #29](https://github.com/polygoku/makhex/issues/29), [issue #30](https://github.com/polygoku/makhex/issues/30), [issue #31](https://github.com/polygoku/makhex/issues/31). This sprint's provider work intentionally stops **before** production DNS cutover or a payable checkout.
