# Sprint 01 — Code-first MAKHEX foundation

**Target:** GitHub + Cloudflare Workers static site + existing Squarespace Basic shopping backend.

## Delivered in source
- Astro + TypeScript static website and distinctive responsive design system.
- Catalog templates for 12 ESP32 ecosystem component candidates.
- 10 project blueprints with material quantities, steps, engineering warnings and linked candidate product records.
- Category and difficulty filters with minimal browser JS.
- Home, projects, shop, community, about, 404, sitemap, robots and social metadata.
- 22 real GitHub Discussions threads (12 components and 10 projects), per-page direct links and a public discussion directory; optional Giscus embed awaits app approval.
- Checkout routing: disabled by default pending exact Squarespace public URLs and SKU confirmation.
- Cloudflare Workers static assets configuration, GitHub CI and opt-in CD workflow.
- Automated route/internal-link/metadata/supplier-gate QA.

## Not represented as complete
- Cloudflare account authorization, verified public preview URL and production DNS connection.
- Squarespace product catalog, true orderability and real checkout transaction.
- Giscus app permission; until approved, use linked GitHub Discussions.
- Hardware supplier stock, images, SKU variants and physical bench qualification.
- Full Lighthouse score and accessibility audit against a public deployment.

## Next milestone
1. Deploy preview to the authorized Cloudflare account; verify URL and mobile/browser QA.
2. Connect `makhex.com` to Workers and `shop.makhex.com` to existing Squarespace (after preserving DNS/email records).
3. Qualify at least 1 physical SKU and make a real Squarespace test order before enabling its checkout link.
4. Optionally approve the Giscus GitHub App for inline embedding of the **already-created** per-page discussion threads (uses exact title mapping).
