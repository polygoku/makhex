# MAKHEX interactive maker showroom — implementation and release checklist

Date: November 22, 2026
Branch: `feat/interactive-maker-showroom-20261122`
Scope: 13 published project blueprints, 35 component-family shop pages, 4 Mosaico research subcomponents.

## Customer journey and qualification truth

1. Every real physical part in the 13 published project BOMs goes into the same first-party **unpaid** MAKHEX request cart. This includes custom PCBs and formerly externally linked component families. STL/3MF downloads remain free resources, not line items. The backend checks project/part membership, available variant choices, quantities, request origin, Turnstile, throttling, address/consent and owner approval.
2. The `sourcing.json` schema v4 keeps source URLs as research/fallback details, while the primary action on every component/project page is a MAKHEX request. On Nov 22 this means 8 priced **planning-only** source-variant families and 27 quote-only component families. All 35 are **unverified for paid checkout**. The static stage/catalog prices are **not** accepted as final billed prices.
3. The visible per-part qualification is `ENGINEERING_HOLD`, `SUPPLIER_REVIEW`, `QUOTE_REQUIRED`, or `PAYMENT_READY`; the last requires separate dated supplier, shipping, fulfillment and payment evidence. Nothing in this change creates such approvals, charges a card, imports a Squarespace listing, sends a Pay Link, or places an AliExpress purchase.
4. Mosaico has two **mutually exclusive** plans: Vision Combo Kit + data cable (2 lines) or original components and data cable (4 lines). All must be quoted and compatibility reviewed before payment. No itemized paid sale of bundled internal modules occurs.
5. Owner exceptions remain required before a real hosted Squarespace payment link; variants, shipping and other qualification must still be checked. Payment is not captured by the Cloudflare Worker.

## Reusable project presentation

- `ProjectShowcase.astro`: responsive, self-hosted **credited and licensed** creator footage for Microduck, with original media manifest in `public/demo/microduck/media-manifest.json` (7 clips retained). AtomDog references the original maker on Hackster but deliberately does **not** fabricate or redistribute an unapproved video; the video slot is labeled pending and uses an explicitly illustrative concept image. Other projects use labeled upstream reference photos, or an illustration when source media is missing.
- `AssemblyExplorer.astro` + `src/scripts/assembly-explorer.ts`: lazy-loaded Three.js abstract schematic; selectable 3D shapes are mapped to *every physical BOM type* and to its first-party Add+ request action. Includes keyboard-operable synchronized part list, orbit, exploded layout, reset, WebGL/save-data fallback and status changes. **This is a schematic, not CAD, electrical wiring, manufactured dimensions, or evidence of fit/bench tests.** Print and wiring instructions stay with credited creator design source.
- `src/styles/showroom.css`: maintain maker workbench visual direction, clear hierarchy, 44px+ tap targets for newly authored controls, reduced-motion behavior, contrast correction, heading wrapping, small-screen layout. No elaborate auto-playing video.

## Anonymous aggregate engagement and owner report

- Client browser events: `project_view`, `demo_play`, `assembly_interact`, `add_to_cart`, `checkout_start`.
- Server-authoritative submission event: `order_request_created`, only after request successfully created by `worker/checkout.mjs`. A separate server-only `paid_checkout_verified` event is recorded only after the authenticated owner transitions an order from payment-link-ready using a matching Squarespace merchant order ID, receipt amount and evidence note. Browser cannot claim purchases or payment.
- D1 `migrations/0004_project_funnel.sql` creates `makhex_project_funnel_daily(day,project,event,count)` and index, **without customer details, IP, sessions, visitor IDs, or order IDs**.
- `POST /api/v1/metrics/events`: secure same-origin only, allowlisted event and project, rate-limited, aggregate counters; `GET /api/v1/metrics/report?days=7|30|90`: owner-only token `MAKHEX_ORDER_ADMIN_TOKEN` or existing `COMMUNITY_ADMIN_TOKEN`, no cache.
- `/ops/metrics/`: noindex password-form dashboard showing per-project event totals, submitted requests and **owner-verified paid checkout counts**, with indicative event ratios rather than unique-user conversion. Owner-confirmed payment requires manual receipt evidence, not an automatically integrated Squarespace webhook. Supplier purchase and fulfillment cannot be inferred from this report and must be reconciled with Squarespace/Doroppu.
- Metrics fail closed or do not block real order creation/payment-state transitions if the optional metrics table has not been migrated. The report will return 503 until D1 is migrated.

## Acceptance / verification

```powershell
npm run check
npm run build
npm run qa
# Start the static preview in another terminal: npm run preview -- --host localhost --port 4322
node scripts/showroom-browser-qa.mjs
```

- Build and QA: 67 pages, 2,844 internal links, 35 shop components, 13 BOMs, 13 maker discussions, protected Microduck CAD unchanged.
- Browser QA: Chrome with WebGL, 1440px, 390px, 375px, 320px; 13 Microduck types (including custom HAT/IMU), 5 AtomDog types, and 2 Mosaico bundle/cable request lines. Checks no horizontal overflow, 3D canvas, list selection, single-part cart persistence, owner report layout.
- Security regression: no request can mint a price, bypass owner approval, forge a supplier swap, or mislabel an order as paid. `scripts/metrics.test.mjs` checks input allowlists and private aggregate reporting.
- Zero physical paid-checkout variants are qualified by this release. No manufacturing or bench test is claimed.

## Design review

- Applied Impeccable criteria manually: information hierarchy, responsive screenshots, real-media provenance, buttons/selection status, keyboard fallback, reduced motion, rendering and cart outcomes.
- Ran the upstream Hallmark `sloplint.mjs` on new components and entire site; this lint is **not a certification**. Remaining warnings include color literals outside a semantic-token block and legacy style-pattern flags. Fixed a new 4.35:1 warning for the engineering-hold status, increased control target sizes and balanced large headings. A later design-system token consolidation can reduce those structural lint findings without sacrificing the current workbench identity.
- Do not mistake a mechanical Hallmark score for actual usability. Browser DOM tests and screenshots are the acceptance evidence.

## Production gate — not performed by this branch

**Per `AGENTS.md`, deployment is separate from creating/reviewing this PR.** At an explicitly approved production release:

1. Merge reviewed PR after checks.
2. Back up D1, apply `migrations/0004_project_funnel.sql` to the existing `COMMUNITY_DB` once, verifying no existing checkout or community tables are altered.
3. Deploy the Cloudflare Worker + assets as a single release, keeping DNS, SquareSpace Basic and payment configuration unchanged.
4. Smoke-check one complete BOM request **without supplier payment**, real-media playback, 3D interactive fallback, owner-only metrics authentication, counts increment, canonical/robots/sitemap, mobile views and checkout status. Do not submit a paid order simply to test this.
5. Add dated supplier/physical test evidence before promoting any item or AtomDog complete kit to paid checkout. A licensed real AtomDog maker clip or approved embed can replace the pending image.
6. Review actual anonymous 7/30-day funnel results once real traffic has occurred. Do not claim improved conversion without a before/after sample and completed paid-order reconciliation.
