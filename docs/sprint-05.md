# Sprint 05 — production integration and launch gates

**Objective:** protect the approved MAKHEX site and paid Squarespace Basic shop while making the final launch requirements verifiable by code rather than informal status messages.

## First live observation — October 21, 2026
- `makhex.com`: DNS delegated to Squarespace; homepage returned HTTP 401 (not public).
- `www.makhex.com`: resolves through Squarespace; returned HTTP 401.
- `shop.makhex.com`: no DNS record, host did not resolve.
- Original Squarespace site origin `drum-deer-ax7k.squarespace.com`: HTTP 401 even without the custom domain.
- Temporary Cloudflare site: `https://makhex.sheer-cough.workers.dev/` returned HTTP 200; this is NOT proof of a permanent account. The launch auditor also requires the exact MAKHEX Worker script and workers.dev hostname to match an authenticated permanent Cloudflare account.
- XPS `wrangler whoami`: not authenticated; use `wrangler login` after claiming/connecting a durable Cloudflare account.
- GitHub Actions Cloudflare deploy variable and secrets: absent at observation time.
- 12 MAKHEX component products remain research-stage; no supplier-verified, purchase-qualified Squarespace products.

## Sprint changes
1. Read-only `scripts/launch-audit.mjs`, with JSON report, checks for owned Cloudflare credentials/Worker origin, preview, DNS delegation, public shop, live apex, dated DNS/primary-domain attestations and checkout approvals.
2. `ops/launch-attestations.json`, deliberately marked unverified; external owner evidence is REQUIRED before a DNS cutover.
3. `launch-audit.yml`, a **manual** GitHub Actions launch-readiness workflow that uploads a JSON report and does not write to any external service.
4. Pure release-gate unit tests, run in CI, checking restricted sites, false-owned temporary Workers and missing approvals fail closed.
5. Wrangler static deployment dry run runs in both CI and the opt-in production pipeline, before any real deployment.
6. Public smoke checks use stable route structure instead of copy text, so future headline changes do not appear as false site failures.
5. Stable release-stage separation: `preCutover.ready`, `siteLive.ready`, `commerce.ready`. The public MAKHEX maker site does not imply any product may be purchased.

## Provider work tracked on GitHub
- [#28 — Permanent Cloudflare ownership and CI/CD](https://github.com/polygoku/makhex/issues/28)
- [#29 — Make existing Squarespace Basic shop public on shop.makhex.com](https://github.com/polygoku/makhex/issues/29)
- [#30 — Full DNS zone export, backup and safe cutover](https://github.com/polygoku/makhex/issues/30)
- [#31 — Qualify first physical product and real checkout](https://github.com/polygoku/makhex/issues/31)

## Exact owner-dependent action sequence
1. **Cloudflare ownership:** sign in to your real Cloudflare account. Claim temporary preview if its short-lived claim window remains open; otherwise create a permanent Worker from the MAKHEX GitHub repository. Authenticate Wrangler using `npx wrangler login` and capture the owned `*.workers.dev` origin.
2. **GitHub deployment:** create a least-privilege scoped Workers API token and identify the Cloudflare account ID. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub Actions secrets; set `MAKHEX_PERMANENT_WORKER_URL` to its confirmed permanent URL, then opt in with `CLOUDFLARE_DEPLOY_ENABLED=true` after the deployment path is tested.
3. **Squarespace:** in the existing paid Basic website, finish setup and change **Site Availability → Public** when ready. Inspect the exact registrar/site relationship FIRST: Squarespace's 2026 documentation says a same-site subdomain that shares billing/permissions with a Squarespace-hosted domain cannot be its primary domain. A supported custom-subdomain or third-party-style connection may require detaching the current root from the site during a controlled migration. Never assume a simple forwarding subdomain will work. The verified result must have `shop.makhex.com` as the true Squarespace primary (no www prefix) with no redirect to the maker-site apex; see issue #29.
4. **Preserve DNS:** export/copy every DNS record from the registrar (including all hidden subdomains, SPF, DKIM, DMARC, MX, verification, CAA and any DNSSEC DS). A partial public DNS lookup is not a complete zone export. Add the same records in the Cloudflare zone and verify mail/services. Attach dated review evidence to GitHub issues or PRs and populate `ops/launch-attestations.json`.
5. **Cutover:** only when `preCutover.ready` passes, arrange a rollback window, then change nameservers to the EXACT two Cloudflare nameservers in the newly created zone. Verify public HTTPS, www redirect, Squarespace shop and mail.
6. **Commerce:** only release a product once the chosen supplier variant, pricing, orderability, Squarespace checkout/tax/shipping/returns, fulfillment and cancellation/refund flow are tested; then record review evidence in `src/data/checkout-approvals.ts`. Never copy unverified identifiers from another store.

## Commands
```sh
npm ci
npm run test:launch
npm run check
npm run build
npm run qa
npm run launch:audit
```
`npm run launch:audit` exits 2 while any production requirement is blocked. That is an expected **NO-GO**, not a code failure. Its local output `reports/sprint05-launch-audit.json` is deliberately gitignored. The GitHub workflow is manual, not a recurring source of premature notifications.

## Release policy
Do not fake a GO by changing script conditions, saving speculative owner attestations or setting a false Cloudflare worker URL. **No code from this sprint changes DNS, payment settings, Squarespace site visibility or checkout eligibility.**
