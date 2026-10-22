# MAKHEX domain cutover — gated runbook (do not execute until gates are green)

## Architecture
- `makhex.com` and `www.makhex.com`: Astro static website on a permanent Cloudflare Workers account.
- `shop.makhex.com`: the already-paid Squarespace Basic website, used as **primary Squarespace site domain**.
- Squarespace domain registration remains paid and under its existing owner. Only authoritative DNS hosting changes if full Cloudflare setup is selected.
- The two origins DO NOT share their cart, login or product inventory.

## Evidence at 2026-10-21
The XPS lookup returned Squarespace nameservers (nsb1–nsb4.squarespacedns.com), four Squarespace A addresses at the apex, `www` CNAME `ext-sq.squarespace.com`, no `shop` DNS, and HTTP 401 on the root and www. Cloudflare Wrangler OAuth was not initially authenticated. A temporary Workers preview was blocked with Cloudflare challenge and is not a permanent deployment. Re-check all states before modifying any record.

## Required P0 gates
1. User has an owned, permanent Cloudflare account and has approved account connection. Wrangler `whoami` confirms it. Do not transmit OAuth tokens.
2. Cloudflare Worker builds, deploys and serves HTTP 200 from the permanent `*.workers.dev` preview. Run `npm run smoke:public -- https://...workers.dev/` and inspect 320/390/1440 viewport output.
3. Squarespace Basic site must be public (not 401, not a `/config` page). **Check the Squarespace-managed domain billing/site connection first:** a same-site subdomain sharing billing/permissions may be ineligible as primary. Use a supported third-party-style `shop.makhex.com` connection and an explicitly coordinated root-domain detachment/migration if required. Verify shop's real primary-domain status and absence of redirects to the Cloudflare apex before cutover. See issue #29 and the current Squarespace primary-domain documentation.
4. Verify an actual Squarespace product and test cart/checkout/shipping/tax/returns/fulfillment behavior, on an approved variant. No checkout links before per-product qualification.
5. Export ALL actual registrar DNS records (MX, SPF, DKIM, DMARC, TXT, CAA, verification, old subdomains) via Squarespace DNS panel. The local `scripts/dns-snapshot.ps1` captures only public answers and IS NOT a substitute for an authoritative zone export. Identify DNSSEC DS records before changing nameservers.
6. Prepare the corresponding Cloudflare zone and clone ALL records; verify that mail and existing services will remain working.
7. Choose a short rollback window with human operator available. Set `makhex.com` and `www.makhex.com` Workers Custom Domains on active Cloudflare zone, while preserving Squarespace `shop` records as DNS-only.
8. Update registrar nameservers to the exact pair provided by that Cloudflare zone, ONLY after the zone, Worker, Squarespace shop, mail records and cutover checklist have passed.

## After nameserver cutover
- Recheck public DNS resolution of apex, www and shop from multiple resolvers.
- Verify HTTPS 200, valid certificate, correct canonical/redirect, website/asset loads, mobile nav, sitemap, robots and the 22 GitHub discussions.
- Verify `shop.makhex.com` remains hosted by Squarespace and the cart leads to a real Squarespace checkout.
- Re-run read-only public smoke and browser responsive tests; check error monitoring.
- If rollback is needed, restore previous nameservers at the registrar and review whether Cloudflare DNSSEC/DS values need removal before reversion. Keep a copy of original Squarespace zone data.

## Cloudflare CI/CD
Use ONLY one delivery pipeline (GitHub Actions or Workers Builds). Existing `.github/workflows/deploy.yml` remains disabled unless **both** repository variables `CLOUDFLARE_DEPLOY_ENABLED=true` and `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true` are set after the scoped-token review. For GitHub Actions, scope `CLOUDFLARE_API_TOKEN` to deployment (not zone editing), provide `CLOUDFLARE_ACCOUNT_ID` in Actions secrets, and preserve DNS rights separately. Set `PUBLIC_SQUARESPACE_SHOP_URL` and `PUBLIC_SQUARESPACE_ALLOWED_HOSTS` only after the public shop origin is verified. Never commit tokens.
