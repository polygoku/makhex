# MAKHEX — Build something real

MAKHEX is a code-first ESP32 maker site with 10 project blueprints, 12 product research candidates, BOM-to-component linking, community discussion entry points, and a gated connection to Squarespace shopping.

**Architecture:** Astro static site → Cloudflare Workers static assets, source/CI in GitHub, separate Squarespace commerce site (later `shop.makhex.com`). No Squarespace plan change required.

## Status
- Code-first frontend: implemented in Sprint 01
- Product research: 12 candidates, NOT listed as verified or orderable
- 10 build guides: planning-stage, electrical and supplier compatibility not yet bench-validated; each guide also has a private-to-your-browser parts-in-hand checklist
- GitHub Discussions: **22 dedicated threads**, one per project or component, and a browsable community directory; optional inline Giscus waits for app approval
- Squarespace: paid Basic plan retained; actual store product paths and checkout flow remain unverified
- Cloudflare: **permanent Worker deployed and verified** at [makhex.makhex-labs.workers.dev](https://makhex.makhex-labs.workers.dev/); GitHub auto-deploy waits on scoped API token; custom-domain DNS migration pending

## Local development
Requirements: Node.js 24+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run qa
npm run test:launch
npm run test:cutover
npm run launch:audit # read-only GO/NO-GO; exit code 2 until providers are ready
npx wrangler deploy --dry-run # validate static Workers bundle without account changes
# With two separate human-verified full DNS exports under ignored reports/:
npm run dns:compare -- --source reports/squarespace-zone.json --target reports/cloudflare-zone.json
```

## Site routes
- `/` homepage
- `/projects/` filterable build gallery
- `/projects/[slug]/` ten guides, step lists, downloadable BOMs, and a browser-local parts-in-hand checklist
- `/shop/` filterable component catalog
- `/shop/[slug]/` twelve component files, compatible projects and supplier caution
- `/community/` public maker discussion hub
- `/about/` project mission and transparent status

## Cloudflare deployment
Astro is entirely static; no server adapter and no storage database. `wrangler.jsonc` publishes `./dist` to Workers static assets.

```sh
npx wrangler login
npm run deploy
```

Automated deployment requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, plus **both** `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true` (only after least-privilege review) and `CLOUDFLARE_DEPLOY_ENABLED=true`. Until that flag is enabled the workflow does not deploy. See [Cloudflare setup](docs/cloudflare-setup.md).

## Squarespace shop integration
The maker catalog is live on the permanent Cloudflare Worker at `makhex.makhex-labs.workers.dev`; cutover of `makhex.com` is NOT yet authorized. The existing paid Squarespace Basic site has **`shop.makhex.com` Connected / Primary**, but remains **Private (HTTP 401)**. All existing sample products are Hidden. Preserve the Squarespace registrar and subscription. Before accepting sales, independently verify the public Squarespace shop, exact supplier/variant, shipping, taxes, returns and checkout transaction; only then configure a real per-product `storePath` in `src/data/products.ts` and `PUBLIC_SQUARESPACE_SHOP_URL=https://shop.makhex.com`. A pending Cloudflare zone cannot use Workers Custom Domains until activation; active parent DNSSEC DS and old apex/www origins currently block nameserver migration.

**Fail closed:** A product requires a qualified supplier variant, approved evidence ledger entry, verified public store base and exact public Squarespace product path; otherwise checkout remains disabled. Never use a `/config` or admin page URL. See [Commerce playbook](docs/squarespace-checkout.md).

## Community
GitHub Discussions is the public forum: all **12 hardware candidates** and **10 project blueprints** now have dedicated threads. The thread map lives at `src/data/discussion-links.json` and can be refreshed idempotently via `node scripts/seed-discussions.mjs --apply` (requires an authenticated GitHub CLI). Every detail page and the `/community/` index links directly to its thread. Optional Giscus embeds are activated after GitHub App approval and public repo/category IDs are configured; the `specific` mapping uses the existing thread title to avoid creating parallel discussion threads.

## Agent collaboration
Read [AGENTS.md](AGENTS.md) and [contribution rules](CONTRIBUTING.md). No agent should change live DNS, enable checkouts, fabricate supplier proof, publish credentials or add unsupported safety promises.

## Project references
- [Roadmap: ESP32 maker store, launched in stages](docs/roadmap-2026.md)
- [Sprint 06 checklist and DNS preflight](docs/sprint-06.md)
- [DNS preservation evidence and comparison](docs/dns-cutover-evidence.md)
- [First product pilot qualification checklist](docs/first-kit-qualification.md)
- [Sprint 01 report](docs/sprint-01.md)
- [Sprint 02 report](docs/sprint-02.md)
- [Sprint 03 launch readiness report](docs/sprint-03.md)
- [Sprint 04 tactile workbench redesign](docs/sprint-04-design.md)
- [Sprint 05 production integration / launch gates](docs/sprint-05.md)
- [Sprint 07 shop primary, DNSSEC and pilot sourcing findings](docs/sprint-07.md)
- [Signed-in DNS cutover / rollback preflight](docs/dns-cutover-live-rollback.md)
- [Freenove FNK0104N source and shipping evidence](docs/fnk0104n-vendor-evidence.md)
- [Production domain cutover and rollback runbook](docs/domain-cutover-runbook.md)
- [Qualification gate](docs/catalog-qualification.md)
- [Squarespace commerce workflow](docs/squarespace-checkout.md)
- [Cloudflare deployment workflow](docs/cloudflare-setup.md)
