# MAKHEX — Build something real

MAKHEX is a code-first ESP32 maker site with 10 project blueprints, 12 product research candidates, BOM-to-component linking, community discussion entry points, and a gated connection to Squarespace shopping.

**Architecture:** Astro static site → Cloudflare Workers static assets at `makhex.com` and `www.makhex.com` (production domain activation verification pending), source/CI in GitHub, and a separate, publicly available Squarespace site at `shop.makhex.com`. No Squarespace plan change required.

## Status
- Code-first frontend: implemented in Sprint 01
- Product research: 12 candidates, NOT listed as verified or orderable
- 10 build guides: planning-stage, electrical and supplier compatibility not yet bench-validated; each guide also has a private-to-your-browser parts-in-hand checklist
- **Independent real-build reference gallery:** 10 credited builder photographs and links to original source repositories, shown beside candid build-stage and BOM mismatch notes. These are **not MAKHEX-built prototypes** and not proof that the proposed kit has been tested; see [Sprint 09 media provenance](docs/sprint-09-real-build-photography.md).
- GitHub Discussions: **22 dedicated threads**, one per project or component, and a browsable community directory; optional inline Giscus waits for app approval
- Squarespace: existing paid Basic site publicly available at `https://shop.makhex.com/` (HTTP 200); seven unrelated demo products Hidden; importing and checkout approval deferred
- Cloudflare: **production Worker HTTPS 200 verified at `makhex.com` and `www.makhex.com` via Cloudflare edge**, with valid TLS and maker content, after registrar nameserver cutover. Some resolvers/devices may temporarily retain cached old Squarespace addresses. Permanent fallback: [makhex.makhex-labs.workers.dev](https://makhex.makhex-labs.workers.dev/). Automatic GitHub deployment remains disabled.

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
The existing paid Squarespace Basic site has **`shop.makhex.com` Connected / Primary** and is now **Public (HTTPS 200)**. All seven sample products remain Hidden. Squarespace remains domain registrar and shop host. The old parent DNSSEC DS was cleared, Cloudflare DNS web records were staged, registrar nameservers switched to Cloudflare, and both Worker custom-domain triggers deployed. After Cloudflare activation, both authoritative nameservers and independent resolvers return proxied Cloudflare edge addresses for apex/`www` (not staging `100::`). Direct TLS/SNI checks against those edge addresses confirm MAKHEX content, HTTP 200, valid HTTPS and correct canonical URLs on both hosts, including projects, community, catalog, robots and sitemap. **DNS propagation remains in progress:** a device or resolver with cached Squarespace records can temporarily show the old redirect to the shop. The owned fallback at `https://makhex.makhex-labs.workers.dev/` remains HTTP 200. Checkout stays gated pending exact supplier, orderability, fulfillment, and authorized test evidence. See [Sprint 08 evidence](docs/sprint-08.md).

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
- [Sprint 09 independent maker photographs and credit audit](docs/sprint-09-real-build-photography.md)
- [Sprint 08 public shop, DNS migration, Worker triggers and remaining activation check](docs/sprint-08.md)
- [Signed-in DNS cutover / rollback preflight](docs/dns-cutover-live-rollback.md)
- [Freenove FNK0104N source and shipping evidence](docs/fnk0104n-vendor-evidence.md)
- [Production domain cutover and rollback runbook](docs/domain-cutover-runbook.md)
- [Qualification gate](docs/catalog-qualification.md)
- [Squarespace commerce workflow](docs/squarespace-checkout.md)
- [Cloudflare deployment workflow](docs/cloudflare-setup.md)
