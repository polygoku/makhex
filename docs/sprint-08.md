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

## Activation timeline and verified production routing

- Immediately after registrar change, Cloudflare Overview displayed "Waiting for your registrar to propagate your new nameservers". The signed-in **Check nameservers now** action was used. During this transitional period the nameservers returned the staging `AAAA 100::` and XPS curl still followed cached old Squarespace A records to the shop; this was correctly NOT called production readiness.
- At approximately **10:41 PM EDT on October 21, 2026**, Cloudflare authoritative `maya` and `rodney` and public `1.1.1.1`/`8.8.8.8` returned **proxied edge AAAA** for apex and www instead of `100::`. Both Cloudflare authoritative nameservers returned edge A addresses `104.21.47.114` and `172.67.147.123` for each hostname, demonstrating active edge proxy routing. Some public resolver A responses still needed propagation.
- Independent HTTPS test with `curl.exe --resolve host:443:104.21.47.114` used the real host as TLS SNI and Host header; **`makhex.com` and `www.makhex.com` each returned HTTP 200 with TLS validation success, no redirect, MAKHEX/ESP32 page content, not Squarespace**. Both emitted a canonical link to `https://makhex.com/` and valid Cloudflare response/security headers. Homepage, `/projects/`, `/community/`, `/shop/`, `/robots.txt` and `/sitemap-index.xml` passed HTTP 200 on **both** hosts. The direct Squarespace shop stayed HTTP 200 over valid TLS on its separate hostname.
- **Propagation caveat:** the XPS default DNS route still held an old Squarespace origin A answer and followed the old shop redirect; this is a resolver cache issue, not a failure of the tested Cloudflare production Worker edge. The permanent workers.dev origin remains available. Do not claim global resolver propagation is complete until the old cached DNS TTL expires.

## Post-launch controls and separately gated follow-ups

- **Completed:** verified two Cloudflare authoritative proxies, external public DNS AAAA, TLS 200 maker content at both production hostnames, canonical to apex, no old Squarespace signature on Cloudflare responses, six representative routes per host, direct Squarespace shop HTTP 200, 9/9 fallback Worker public smoke, protected `shop`/email DNS.
- **Resolver propagation:** wait for old Squarespace IP caches to expire; retest ordinary non-forced `https://makhex.com/` and `www` from several networks. At transition time old-cached A records still redirected to Squarespace shop.
- **DNSSEC hardening:** old Squarespace DS was removed correctly; leave parent DS absent during migration and re-enable via Cloudflare-generated DS at the Squarespace registrar after old delegation caches have expired and keys are validated. Do NOT re-enable the old Squarespace DNSSEC toggle while using custom Cloudflare nameservers.
- **Commerce remains intentionally HOLD:** no AliExpress import, product activation, transaction or fulfillment test was carried out. `npm run launch:audit` is expected to flag `qualifiedCheckout` and unattended deployment, even though the website and shop are accessible. Existing model/stock qualification is a separate future sprint.
- **Optional polish:** evaluate a 301 `www`→apex redirect; the `www` page currently returns maker content with correct apex canonical, avoiding duplicate-index instructions.

## Rollback

The pre-cutover registrar nameservers are `nsb1.squarespacedns.com`, `nsb2.squarespacedns.com`, `nsb3.squarespacedns.com`, `nsb4.squarespacedns.com`; Squarespace domain ownership and source DNS preset records were preserved. If pending-zone activation fails or production routes break, revert the Squarespace registrar nameserver delegation to all four previous values; verify parent DS remains absent (or properly aligned with restored signing keys) and test original site, shop and mail records. During an emergency rollback, old Squarespace apex/www may redirect to the separate shop, not the maker site; the maker site remains reachable at the permanent workers.dev URL. Raw DNS backups remain in the locally ignored reports folder, not committed publicly.
