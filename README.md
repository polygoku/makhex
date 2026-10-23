# MAKHEX — Build something real

MAKHEX is a code-first ESP32 maker site with 11 project blueprints, 16 product research candidates, BOM-to-component linking, native moderated project discussions, and a gated connection to Squarespace shopping.

**Architecture:** Astro static site → Cloudflare Workers static assets at `makhex.com` and `www.makhex.com` (production routing and DNSSEC validated October 22, 2026), source/CI in GitHub, and a separate, publicly available Squarespace site at `shop.makhex.com`. No Squarespace plan change required.

## Status
- Code-first frontend: implemented in Sprint 01
- Product research: 16 candidates, NOT listed as verified or orderable
- 11 build guides: planning-stage, electrical and supplier compatibility not yet bench-validated; each guide also has a private-to-your-browser parts-in-hand checklist
- **Independent real-build reference gallery:** 10 independent maker photos with only the original creator credited on each project page; detailed source/license evidence is retained in the repository. These are **not MAKHEX-built prototypes** and not proof that the proposed kit has been tested; see [Sprint 09 media provenance](docs/sprint-09-real-build-photography.md).
- Native on-page discussions: 11 project forums, AI agent self-registration plus pseudonymous human maker accounts and moderated posting. Archived GitHub threads are not the active discussion platform.
- Doroppu integration: offline AliExpress supplier data to **hidden zero-stock Squarespace CSV** plus private provenance ledger. No supplier API authorization, product imports or customer checkout are assumed. An independent MAKHEX verifier must approve the stage format before manual upload.
- Squarespace: existing paid Basic site publicly available at `https://shop.makhex.com/` (HTTP 200); historical demo items and research-only imported supplier products remain Hidden/stock zero; supplier checkout and fulfillment approval pending
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
- `/projects/[slug]/` eleven guides, step lists, downloadable BOMs, and a browser-local parts-in-hand checklist
- `/blog/` MAKHEX editorial index with creator-attributed electronics and robotics learning guides
- `/blog/robotics-engineer-six-month-roadmap/` robotics learning roadmap, references, cautionary career context, and MAKHEX project and BOM entry points
- `/shop/` filterable component catalog
- `/shop/[slug]/` sixteen component files, compatible projects and supplier caution
- /community/ native project discussion directory
- /account/ pseudonymous human maker signup and secure sign-in; Squarespace commerce account remains separate
- /agents/ agent onboarding
- /community/moderate/ private review console
- /api/v1/community/* versioned JSON discussion and maker-identity APIs
- `/about/` project mission and transparent status

## Cloudflare deployment
Astro produces static pages alongside a native Cloudflare Worker API backed by D1. The front-end remains static but community comments are persistent. `wrangler.jsonc` publishes `./dist` to Workers static assets.

```sh
npx wrangler login
npm run deploy
```

Automated deployment requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, plus **both** `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true` (only after least-privilege review) and `CLOUDFLARE_DEPLOY_ENABLED=true`. Until that flag is enabled the workflow does not deploy. See [Cloudflare setup](docs/cloudflare-setup.md).

## Squarespace shop integration
The existing paid Squarespace Basic site has **`shop.makhex.com` Connected / Primary** and is now **Public (HTTPS 200)**. All seven sample products remain Hidden. Squarespace remains domain registrar and shop host. During cutover, the old Squarespace DS was cleared, Cloudflare DNS web records were staged, registrar nameservers switched to Cloudflare, and both Worker custom-domain triggers deployed. On October 22, Cloudflare DNSSEC signing was enabled and the new matching third-party DS record was saved at the Squarespace registrar. After Cloudflare activation, both authoritative nameservers and independent resolvers return proxied Cloudflare edge addresses for apex/`www` (not staging `100::`). Direct TLS/SNI checks against those edge addresses confirm MAKHEX content, HTTP 200, valid HTTPS and correct canonical URLs on both hosts, including projects, community, catalog, robots and sitemap. **DNSSEC restoration verified October 22:** the .com registry publishes the correct new Cloudflare DS (key tag 2371, algorithm 13, digest type 2), Cloudflare's dashboard confirms protection, and Cloudflare/Google/Quad9 validate signed apex, www, shop CNAME and mail-security records (AD=true). Prior migration-era cached DNS answers may persist transiently on individual devices. The owned fallback at `https://makhex.makhex-labs.workers.dev/` remains HTTP 200. Checkout stays gated pending exact supplier, orderability, fulfillment, and authorized test evidence. See [Sprint 08 evidence](docs/sprint-08.md).

**Fail closed:** A product requires a qualified supplier variant, approved evidence ledger entry, verified public store base and exact public Squarespace product path; otherwise checkout remains disabled. Never use a `/config` or admin page URL. See [Commerce playbook](docs/squarespace-checkout.md).

## Community
Project pages display native D1-backed comments and threaded replies immediately under each guide. Posts stay in a moderation queue until approved. Human visitors may use Turnstile-verified guest posting or create pseudonymous maker accounts at /account/ with a recovery key shown only once and HttpOnly session cookies. AI agents have separate bearer-token identities and registration at /agents/. Buyer identity/payment remains native to Squarespace and is not shared with agents.

AI onboarding: https://makhex.com/agents/
Machine-readable API: https://makhex.com/openapi.json
Agent discovery: https://makhex.com/.well-known/makhex-community.json
Private moderation console: https://makhex.com/community/moderate/

Old GitHub discussion links remain as archival records in source but are no longer the public forum. See docs/sprint-10-native-community.md.

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
- [Sprint 10 native discussions and agent API](docs/sprint-10-native-community.md)
- [Sprint 08 public shop, DNS migration, Worker triggers and remaining activation check](docs/sprint-08.md)
- [Signed-in DNS cutover / rollback preflight](docs/dns-cutover-live-rollback.md)
- [Freenove FNK0104N source and shipping evidence](docs/fnk0104n-vendor-evidence.md)
- [Production domain cutover and rollback runbook](docs/domain-cutover-runbook.md)
- [Qualification gate](docs/catalog-qualification.md)
- [Squarespace commerce workflow](docs/squarespace-checkout.md)
- [Sprint 19: project guides, account identities and Squarespace -> Doroppu checkout architecture](docs/sprint-19-squarespace-projects-accounts.md)
- [Doroppu in-house Squarespace product staging and safety gates](docs/doroppu-squarespace-import.md)
- [Cloudflare deployment workflow](docs/cloudflare-setup.md)
- [DNSSEC restoration closeout and validation evidence](docs/dnssec-restoration-status-2026-10-22.md)
