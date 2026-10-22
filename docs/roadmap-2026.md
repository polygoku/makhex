# MAKHEX roadmap — project-first maker commerce

Reviewed against GitHub `main` and issues #28–#31 on October 21, 2026.

## North star

Create a practical ESP32 workshop where someone can discover a real build idea, inspect the BOM, follow honest instructions, discuss firmware/hardware revisions, and eventually buy only the supplier-qualified parts. Keep the approved warm tactile identity.

**Architecture:** GitHub source + PR workflows → Astro static site on Cloudflare Workers → `makhex.com`. Preserve the already-paid Squarespace Basic site as the separately managed checkout on `shop.makhex.com`, after confirming its exact primary-domain setup. No custom card/payment backend. No shared cart or login between the origins.

## Milestones and truth

| Sprint | Status | What it delivers |
| --- | --- | --- |
| 01 | Completed | 10 project blueprints, 12 component candidates, 22 GitHub discussion threads and a GitHub/Cloudflare/Squarespace codebase |
| 02 | Completed | CSV BOM exports, checkout URL safeguards and security headers |
| 03 | Completed | Cloudflare staging, release smoke tests and DNS cutover runbook |
| 04 | Completed | Approved warm Light / tactile workbench visual redesign and interactive featured component links |
| 05 | Completed | Launch-readiness auditor, first permanent Cloudflare Worker, CI with protected deploy opt-in |
| **06** | **Implemented / QA passed** | Track which BOM parts a builder already has without enabling sales, establish fail-closed full-zone record comparison, strengthen QA and write the next-stage roadmap |
| 07 | Blocked on provider/account work | Least-privilege deploy token, GitHub automatic deployment; verify supported Squarespace shop subdomain/primary-domain path, full DNS export and rollback plan |
| 08 | Blocked on supplier/checkout evidence | Qualify the first exact physical SKU, product photo/spec/stock and a real Squarespace test order with shipping/returns/fulfillment checks |
| 09 | Planned | Bench-verifiable firmware builds, source code, board revisions, original photos/video and revised BOM evidence for flagship projects |
| 10 | Planned | SEO/measurement, GitHub community loop, X/Hackaday/Reddit/YouTube launch content and budget-aware acquisition after shop tests |

## Dependencies and rules

**Website launch:** own permanent Worker (done) → scoped CI/CD token (open #28) → supported real `shop.makhex.com` as Squarespace primary (open #29) → full DNS and mail preservation plus Cloudflare staged records (open #30) → witnessed cutover and 200/SSL/mobile checks. Keep Squarespace site private until its launch readiness is explicitly approved; do not force a site availability change as a shortcut.

**Commerce launch:** exact supplier + board revision + true selectable variant + landed cost/stock/lead time + shipping/tax/refund/fulfillment tests in Squarespace → recorded reviewer evidence → release a *single* qualified item while every other item stays on HOLD (open #31).

**Technical content:** every project starts as a blueprint, not a proven wiring schematic; add validated pin map, exact board/SDK version, schematic and repeatable firmware/recovery instructions only after bench work. Avoid unverified lithium battery, mains power, medical, life safety, alarm or surveillance claims.

**Community:** use the existing 22 GitHub Discussions as the source of truth. Inline Giscus is optional and must map to those existing threads rather than spawning duplicate topics.

**Marketing loop after first qualified build:** physical prototype → original photo/video + GitHub repo/how-to → MAKHEX project → BOM/source guide → X/Reddit/Hackaday/YouTube sharing and feedback → versioned project notes. Do not use paid traffic until checkout and fulfillment are verified.

## Owners and next actions

- Cloudflare & DevOps: [issue #28](https://github.com/polygoku/makhex/issues/28) — rotate the overly broad token to one Worker-scoped Editor token; set `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true` only after independent evidence review, then enable GitHub deployment.
- Squarespace store: [issue #29](https://github.com/polygoku/makhex/issues/29) — inspect domain billing/permission topology before attempting shop primary.
- DNS: [issue #30](https://github.com/polygoku/makhex/issues/30) — export complete authoritative zone data, stage Cloudflare zone and compare using `npm run dns:compare`. No name server writes without a full rollback plan.
- Hardware and commerce: [issue #31](https://github.com/polygoku/makhex/issues/31) — begin with an exact ESP32-S3 touch-display board candidate for the flagship Touch Weather Station, but keep it research-only until tested.

Use `AGENTS.md`, `docs/catalog-qualification.md`, and `docs/domain-cutover-runbook.md` as mandatory safety gates. The code and first-party documentation are source-controlled; DNS/provider/checkout are not presumed complete merely because code is merged.
