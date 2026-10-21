# MAKHEX — Build something real

MAKHEX is a code-first ESP32 maker site with 10 project blueprints, 12 product research candidates, BOM-to-component linking, community discussion entry points, and a gated connection to Squarespace shopping.

**Architecture:** Astro static site → Cloudflare Workers static assets, source/CI in GitHub, separate Squarespace commerce site (later `shop.makhex.com`). No Squarespace plan change required.

## Status
- Code-first frontend: implemented in Sprint 01
- Product research: 12 candidates, NOT listed as verified or orderable
- 10 build guides: planning-stage, electrical and supplier compatibility not yet bench-validated
- GitHub Discussions: public community link; page-specific Giscus waits for app approval
- Squarespace: paid Basic plan retained; actual store product paths and checkout flow remain unverified
- Cloudflare: config and opt-in CI/CD included; DNS and production deployment must be verified

## Local development
Requirements: Node.js 24+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run qa
```

## Site routes
- `/` homepage
- `/projects/` filterable build gallery
- `/projects/[slug]/` ten guides, step lists and mapped bills of materials
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

Automated deployment can be enabled on main branch by setting repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` and repo variable `CLOUDFLARE_DEPLOY_ENABLED=true`. Until that flag is enabled the workflow does not deploy. See [Cloudflare setup](docs/cloudflare-setup.md).

## Squarespace shop integration
The brochure/catalog is hosted on Cloudflare at `makhex.com`; the paid Squarespace Basic site continues separately. Once verified, assign Squarespace a shop subdomain such as `shop.makhex.com`. Add a real per-product `storePath: 'shop/p/verified-squarespace-slug'` to `src/data/products.ts` and set `PUBLIC_SQUARESPACE_SHOP_URL=https://shop.makhex.com`.

**Fail closed:** A product without BOTH a verified public store base and a verified per-product path renders a disabled checkout CTA. Never use a `/config` or admin page URL. See [Commerce playbook](docs/squarespace-checkout.md).

## Community
GitHub Discussions is the public forum, and every detail page links there. Optional Giscus embeds are activated when GitHub App access and public repo/category IDs are configured. A Giscus thread maps to the page's pathname and is not an independent database.

## Agent collaboration
Read [AGENTS.md](AGENTS.md) and [contribution rules](CONTRIBUTING.md). No agent should change live DNS, enable checkouts, fabricate supplier proof, publish credentials or add unsupported safety promises.

## Project references
- [Sprint report](docs/sprint-01.md)
- [Qualification gate](docs/catalog-qualification.md)
- [Squarespace commerce workflow](docs/squarespace-checkout.md)
- [Cloudflare deployment workflow](docs/cloudflare-setup.md)
