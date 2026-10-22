# MAKHEX domain cutover — gated runbook (do not execute until gates are green)

## Architecture
- `makhex.com` and `www.makhex.com`: Astro static website on a permanent Cloudflare Workers account.
- `shop.makhex.com`: the already-paid Squarespace Basic website, used as **primary Squarespace site domain**.
- Squarespace domain registration remains paid and under its existing owner. Only authoritative DNS hosting changes if full Cloudflare setup is selected.
- The two origins DO NOT share their cart, login or product inventory.

## Verified evidence at 2026-10-21
The Squarespace site now lists **`shop.makhex.com` as Connected/Primary**, with authoritative CNAME to `ext-cust.squarespace.com`; HTTP 401 persists because Squarespace Site Availability is Private. All seven Squarespace catalog products (six irrelevant demo items and an unnamed draft) were set Hidden, without deleting or publishing them. The signed-in registrar panel exposed 11 records, staged Cloudflare zone 10 (with `shop` DNS-only); the old Squarespace apex `HTTPS` record with IP hints must be retired, not copied. Independent DS query found **ACTIVE parent DNSSEC delegation**. Cloudflare still has old Squarespace apex/www targets and zone status Pending. **Do not switch nameservers.** See [Sprint 07 detailed rollback preflight](dns-cutover-live-rollback.md).

## Required P0 gates
1. User has an owned, permanent Cloudflare account and has approved account connection. Wrangler `whoami` confirms it. Do not transmit OAuth tokens.
2. Cloudflare Worker builds, deploys and serves HTTP 200 from the permanent `*.workers.dev` preview. Run `npm run smoke:public -- https://...workers.dev/` and inspect 320/390/1440 viewport output.
3. Squarespace Basic site must be public (not 401, not a `/config` page). **Check the Squarespace-managed domain billing/site connection first:** a same-site subdomain sharing billing/permissions may be ineligible as primary. Use a supported third-party-style `shop.makhex.com` connection and an explicitly coordinated root-domain detachment/migration if required. Verify shop's real primary-domain status and absence of redirects to the Cloudflare apex before cutover. See issue #29 and the current Squarespace primary-domain documentation.
4. Verify an actual Squarespace product and test cart/checkout/shipping/tax/returns/fulfillment behavior, on an approved variant. No checkout links before per-product qualification.
5. Export ALL actual registrar DNS records (MX, SPF, DKIM, DMARC, TXT, CAA, verification, old subdomains) via Squarespace DNS panel. The local `scripts/dns-snapshot.ps1` captures only public answers and IS NOT a substitute for an authoritative zone export. Identify DNSSEC DS records before changing nameservers.
6. Prepare the corresponding Cloudflare zone and clone ALL records; verify that mail and existing services will remain working.
7. Choose a supervised rollback window and pre-stage an appropriate Worker cutover routing plan. **Workers Custom Domains require an active Cloudflare zone**, so a pending zone cannot simply attach them in advance. Keep `shop` DNS-only and never activate the default old Squarespace apex/www records as the maker origin. Document the chosen route-to-Custom-Domain transition in issue #30.
8. Resolve active parent DS/DNSSEC with Squarespace registrar first and confirm independent propagation; only then update registrar nameservers to the exact Cloudflare pair once the Worker routing, shop HTTP 200, preserved DNS and rollback checks are ready.

## After nameserver cutover
- Recheck public DNS resolution of apex, www and shop from multiple resolvers.
- Verify HTTPS 200, valid certificate, correct canonical/redirect, website/asset loads, mobile nav, sitemap, robots and the 22 GitHub discussions.
- Verify `shop.makhex.com` remains hosted by Squarespace and the cart leads to a real Squarespace checkout.
- Re-run read-only public smoke and browser responsive tests; check error monitoring.
- If rollback is needed, restore previous nameservers at the registrar and review whether Cloudflare DNSSEC/DS values need removal before reversion. Keep a copy of original Squarespace zone data.

## Cloudflare CI/CD
Use ONLY one delivery pipeline (GitHub Actions or Workers Builds). Existing `.github/workflows/deploy.yml` remains disabled unless **both** repository variables `CLOUDFLARE_DEPLOY_ENABLED=true` and `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true` are set after the scoped-token review. For GitHub Actions, scope `CLOUDFLARE_API_TOKEN` to deployment (not zone editing), provide `CLOUDFLARE_ACCOUNT_ID` in Actions secrets, and preserve DNS rights separately. Set `PUBLIC_SQUARESPACE_SHOP_URL` and `PUBLIC_SQUARESPACE_ALLOWED_HOSTS` only after the public shop origin is verified. Never commit tokens.
