# MAKHEX — code-first maker website

Astro static site for MAKHEX ESP32 makers. Sprint 01 includes a custom homepage, 10 hardware research pages, 10 project concept guides with BOM mappings, catalog filtering, discussion scaffolding and Cloudflare Workers static assets configuration.

## Local

```sh
npm ci
npm run dev
npm run build
npm test
```

## Cloudflare

Connect `polygoku/makhex` from Cloudflare Workers > Create > Import Git repository. Build: `npm run build`; deploy: `npx wrangler deploy`. The Wrangler assets directory is `dist`. Preview with workers.dev before changing DNS.

## Squarespace checkout

Existing Squarespace Basic site remains untouched. No live Squarespace shop URL is verified. Each product has an optional `shopUrl` in `src/data/catalog.ts`; until verified, checkout buttons remain disabled. Keep the actual Squarespace storefront reachable from a separate hostname if the main domain is hosted at Cloudflare. Verify tax, shipping, inventory and checkout before enabling URLs.

## Discussions

Enable GitHub Discussions, configure General category, obtain repo/category IDs on giscus.app, then set `PUBLIC_GISCUS_REPO_ID` and `PUBLIC_GISCUS_CATEGORY_ID` at build time. The website shows a fallback until configured.

Catalog items are research candidates, not orderable listings. Project guides are preliminary ideas, not bench-tested electrical instructions. No live DNS or shop changes are included.
