# Sprint 06 — from build blueprint to bench checklist, with safe domain preparation

## Objective

Move the approved MAKHEX workshop toward its project-first commerce launch without waiting idly on provider authorization. Preserve the existing paid Squarespace Basic site, permanent Cloudflare Worker, 22 discussion threads, 10 project BOMs, and **12 unqualified checkout holds**.

## Delivered in source

1. **Workbench part checklist on every project:** one checkbox per mapped BOM part type, quantity and component link, accessible live progress and clear/reset button. Progress is saved locally in that browser when permitted. No backend, account, inventory, payment, supplier claim or telemetry. The read-only BOM table and CSV export remain unchanged.
2. **Complete-zone DNS comparison:** `scripts/dns-cutover-compare.mjs` checks a human-verified full Squarespace DNS export against a staged Cloudflare zone, with non-exempt MX/TXT/DKIM/DMARC/SRV/CAA preservation, multiplicity and a DNS-only shop entry. Missing or unverified exports fail closed. The script never calls any provider write APIs.
3. **Validation:** 6 fail-closed DNS comparison tests added to GitHub CI; project QA extended to ensure all 10 checklists match their BOM slugs and have accessible status/reset controls.
4. **Roadmap:** `docs/roadmap-2026.md` specifies launch/dependency and product-validation stages. `docs/first-kit-qualification.md` defines the first Touch Weather Station component SKU evidence packet.
5. **Production token safety:** Cloudflare account token `makhex_token1` was observed to grant extensive account/zone permissions. GitHub deploy now requires TWO separate flags, `CLOUDFLARE_DEPLOY_ENABLED=true` and `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true`; both stay false until the broad token is replaced by an independently reviewed Worker-scoped Editor token. No credentials belong in this branch.

## Verified acceptance on XPS

- `npm ci`: completed, 0 vulnerabilities reported.
- `npm run test:launch`: 4/4 pass.
- `npm run test:cutover`: 6/6 pass.
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: 28 static pages.
- `npm run qa`: PASS — 743 internal links, 22 mapped GitHub discussions, 10 BOM CSV routes, all 10 project checklists match source BOMs, and 12 product checkout holds.
- Headless Edge QA: 20/20 checks at 320px, 390px, 768px and 1440px. Verified zero horizontal overflow, checkbox update, browser-local persistence after reload, reset, two-board BOM quantity and retained disabled checkout.
- New GitHub variable `CLOUDFLARE_TOKEN_SCOPE_APPROVED=false` is set. Protected deployment requires both it and `CLOUDFLARE_DEPLOY_ENABLED=true`; credentials and domain settings were not changed.

## Acceptance and external blockers

- Run `npm run test:cutover && npm run check && npm run build && npm run qa`.
- Test browser part checklist at narrow phone, phone, and desktop widths. Verify local save/reset on reload and unchanged product checkout HOLD.
- Confirm public permanent Worker remains healthy before any new production deploy.
- Do **not** alter nameservers, registrar, Squarespace site-availability setting, product prices, supplier catalog or payment settings as part of this sprint.
- Live `shop.makhex.com`, full authoritative registrar DNS export, Squarespace primary-domain topology, a least-privilege GitHub deployment token and verified physical checkout still require external provider/account evidence.

A passing repository build is not proof of storefront launch.
