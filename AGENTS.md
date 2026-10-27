# Agent operating policy — MAKHEX

## Safety and truth
1. Preserve current Squarespace subscription, registrar settings, live theme and published products unless an explicit change is authorized.
2. Never mark a product AVAILABLE, VERIFIED, in stock or orderable without supplier/variant checkout validation and dated evidence.
3. Never add unverified delivery dates, pricing, guarantees, manufacturer photos or reviews.
4. Explain electrical limits; verify schematic and voltage with the exact board revision. Do not claim concept plans are tested tutorials.
5. No tokens, passwords or personal customer information in source, build artifacts or GitHub discussions.

## Branching and PRs
1. Create a feature branch from latest main. Never overwrite another agent's uncommitted directory.
2. Keep source of truth in `src/data/products.ts`, `src/data/projects.ts`, and `src/lib/catalog.ts`.
3. Run `npm run check && npm run build && npm run qa` and include results in PR.
4. For catalog changes, map BOM slugs to unique existing component records.
5. A release to Cloudflare or domain DNS requires a separate, explicit deploy gate.

## Responsibilities
- Frontend agent: layout, responsive UI, metadata, performance, accessibility.
- Hardware agent: exact boards, firmware reference, vendor specs, bench tests.
- Commerce agent: Squarespace listing mapping, pricing, taxes, stock and customer checkout.
- QA reviewer: routes, links, broken media, GitHub Discussions, 320px/375px/desktop screenshots.

## Reproducible engineering packages
- Maintain the 12 source-pinned hardware profiles in `scripts/engineering-profiles.mjs`, with original creator commits in `docs/engineering/upstream-pins.json` and design file references in `docs/engineering/source-design-index.json`.
- After changing a profile, run `npm run engineering:generate` and `npm run engineering:check`; check all 12 static `/projects/{slug}/engineering/` routes and CSV/SVG downloads.
- Separate verified upstream design existence from compatibility with the MAKHEX BOM. Never copy or sell third-party CAD merely because a GitHub URL exists.
- All generated bench evidence starts `NOT_RUN`. Only actual instrument logs, board photographs, firmware hashes, signed results and physical fit checks can change a release status.
- Do not treat an ESP-IDF vendor peripheral example as finished, bench-tested application firmware.

## Exit checklist
- All new routes return valid pages.
- All internal links resolve.
- 10 projects have BOMs linking to existing catalog items.
- All unqualified items show disabled commerce.
- No live checkout until exact Squarespace test purchase is validated.
