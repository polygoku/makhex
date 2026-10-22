# Sprint 08 — MAKHEX public shop and Cloudflare nameserver cutover

Execution time: October 21, 2026 EDT / October 22, 2026 UTC.

## Scope and immutable boundaries

- Public maker website: Astro static assets deployed to owned Cloudflare Worker `makhex`.
- Separate paid Squarespace site stays primary for `shop.makhex.com`.
- Product importing, SKU qualifications, inventory, live purchase actions and any payments remain deferred.
- Squarespace remains the domain registrar and paid commerce website provider.
- Auto-deploy remains disabled pending a least-privilege token; manual authenticated Wrangler release used.

## Owner-account changes executed

1. **Squarespace published** using the signed-in site dashboard. Confirmation said "Your site is now live!" Public direct `https://shop.makhex.com/` returns HTTPS 200 and no redirect; a hidden template product test URL returned 404. Historical seven catalog template products remain Hidden.
2. **Cloudflare DNS staged correctly**: removed four legacy apex Squarespace A records and the old www Squarespace CNAME; set `makhex.com AAAA 100::` proxied and `www.makhex.com AAAA 100::` proxied for Cloudflare custom-domain routing. `shop CNAME ext-cust.squarespace.com` remains DNS-only. `_domainconnect` remains DNS-only. Three existing email-security TXT records preserved exactly. Cloudflare DNS panel had seven records after changes.
3. **Old DNSSEC cleared**: Disabled DNS Security Extensions in Squarespace registrar. The checkbox was off after confirmation. Fresh queries to two .com authoritative addresses and public 1.1.1.1, 8.8.8.8 and 9.9.9.9 returned no parent DS.
4. **Nameservers changed at Squarespace registrar** from `nsb1-4.squarespacedns.com` to `maya.ns.cloudflare.com` and `rodney.ns.cloudflare.com`. Registrar displayed "Nameservers updated" on Oct 21 2026 at 10:33 PM EDT. Independent public 1.1.1.1 and 8.8.8.8 NS answers now return the intended pair.
5. **Worker production triggers deployed** by the authenticated `wrangler deploy`, returning both `makhex.com (custom domain)` and `www.makhex.com (custom domain)`. Explicit `workers_dev: true` and `preview_urls: true` retained the permanent fallback `https://makhex.makhex-labs.workers.dev/`. Last deployment version `cc475eb1-8945-4ac8-bd6e-fb2f3374023b`.
6. **Code preflight passed**: Astro check 0 errors and 0 warnings, 28-page build, QA 28 pages/743 links/12 gated research pages/22 maker discussions/10 BOM CSVs, launch unit tests 5/5, DNS unit tests 10/10, Wrangler dry run PASS, and nine public smoke checks against Worker fallback PASS.

## Activation caveat — do not mistake delegation for production HTTP readiness

Immediately after registrar change, Cloudflare Overview still displayed **"Waiting for your registrar to propagate your new nameservers"**; its **Check nameservers now** button was invoked. DNS query to Cloudflare authoritative maya/rodney and to 1.1.1.1/8.8.8.8 returned the staging `AAAA 100::` for apex/www, not a proxied Cloudflare edge address. Local curl still reached the old Squarespace origin by cached IP and redirected `makhex.com` and `www.makhex.com` to `shop.makhex.com`. **Production apex/www therefore remain UNVERIFIED until Cloudflare reports ACTIVE, edge DNS is served, TLS is issued, and maker-site content is observed at both hostnames.** The Worker fallback and direct shop remain HTTPS 200. Do not claim completed launch merely on Cloudflare custom-domain trigger success.

## Remaining activation-time validation

- Confirm Cloudflare zone ACTIVE, then query apex/www A and AAAA on both authoritative nameservers and independent public resolvers; placeholder `100::` must no longer be published.
- Check `https://makhex.com/` and `https://www.makhex.com/` HTTPS/TLS, canonical maker-site content rather than Squarespace redirect, representative Astro routes, metadata, CSP, robots, sitemap, mobile experience.
- Check `https://shop.makhex.com/` HTTPS 200 stays Squarespace, no redirect to apex, no publicly purchasable demo products.
- Reconfirm absence of parent DS until Cloudflare-managed DNSSEC is intentionally enabled and correct DS is installed at the registrar; preserve SPF/DMARC/DKIM, shop CNAME and `_domainconnect`.
- Run `node scripts/public-smoke.mjs https://makhex.com/` and the read-only `npm run launch:audit`; lack of supplier-qualified product should continue to block commerce even after website hosting is live.

## Rollback

The pre-cutover registrar nameservers are `nsb1.squarespacedns.com`, `nsb2.squarespacedns.com`, `nsb3.squarespacedns.com`, `nsb4.squarespacedns.com`; Squarespace domain ownership and source DNS preset records were preserved. If pending-zone activation fails or production routes break, revert the Squarespace registrar nameserver delegation to all four previous values; verify parent DS remains absent (or properly aligned with restored signing keys) and test original site, shop and mail records. During an emergency rollback, old Squarespace apex/www may redirect to the separate shop, not the maker site; the maker site remains reachable at the permanent workers.dev URL. Raw DNS backups remain in the locally ignored reports folder, not committed publicly.
