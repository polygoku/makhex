# Sprint 04 — MAKHEX tactile workbench visual direction

## Goal

Replace the generic cyber-brutalist, neon-on-black presentation with a friendly physical maker workshop. This is a **design-only** release; it deliberately preserves Astro routing, mapped bills of materials, GitHub Discussions, Cloudflare and Squarespace integration gates.

## Chosen direction: Drafting Table / Warm Light

- Background: warm paper/ABS putty `#F5F1E9`; surfaces `#FFFCF5`; dark olive ink `#282D27`.
- Accent: safety orange `#F36A38`, with darker cinnamon drop-shadow `#BC4827`; secondary PCB green `#345F52`.
- Typography: Bricolage Grotesque for approachable mixed-case editorial headings and tactile controls; DM Mono only for BOM, part numbers and workbench notes.
- Controls: rounded corners, visible 4–5px physical button shadows, a depressed hover/active state and keyboard focus rings.
- Textured surfaces: restrained pin-grid/cutting-mat dots and schematic bench detail; no giant terminal labels or neon strokes.

## Content and craft

- Homepage headline: **Ideas are good. Making is better.** Brief supportive copy with strong two-action CTA.
- Original local SVG, `public/workbench-scene.svg`, depicts a conceptual ESP32 touch weather-station build with board, LCD, 3D-printed case, screws, wires, sensor module, screwdriver and mat. It is **clearly marked as concept art**, not a SKU photograph or bench-tested unit.
- Featured build card has hardware callouts, route to the actual project blueprint and accessible native `<details>` list of the part roles.
- Reusable project cards have distinct CSS-rendered miniature devices for display, audio, wireless, sensor, camera, LED and automation categories.
- Catalog cards retain abstract component renders for provisional SKUs; live product images should eventually be replaced by licensed verified photos.
- All existing 10 projects, 12 unqualified component records, 22 discussion threads and BOM downloads remain unchanged.
- Public metadata (favicon, Open Graph preview) is updated to the new palette.

## Build and visual acceptance

- `npm run check` and `npm run build` required before publishing.
- `npm run qa`: route/SEO/link/checkout gate assertions must remain green.
- **Verified:** 24/24 headless Edge browser route/layout checks across 320, 390, 768, and 1440px with no horizontal overflow.
- **Verified:** mobile navigation, project difficulty filter (3 Beginner / 10 All), and native featured BOM disclosure.
- **Verified:** all 28 generated pages, 712 internal links, 22 discussion mappings, 10 BOM downloads and 12 safe checkout holds pass existing QA.
- Local visual snapshots are included for review: [desktop home](visual-review/home-desktop.jpg), [mobile home](visual-review/home-mobile.jpg), [desktop projects](visual-review/projects-desktop.jpg), and [mobile projects](visual-review/projects-mobile.jpg).
- **Verified:** the preview at https://makhex.sheer-cough.workers.dev/ returned 9/9 public smoke PASS, HTTP 200, CSP present and `X-Robots-Tag: noindex` active. This is a temporary Cloudflare account until claimed, not permanent hosting.
- Do not touch `makhex.com`, `shop.makhex.com`, Squarespace subscription or customer checkout.
- Final recommendation: ship as **preview-first** PR for visual approval before merging. The prior production-source theme remains untouched until review. A working design preview is not a production domain cutover.

## Future content improvement

To push further toward real, tactile gadgets, replace concept imagery with **owned/permissioned** product photography and build-progress photos after sourcing and physical assembly. Photograph bare PCB, wired prototype, enclosure revision and working device side by side. Do not republish arbitrary images found on other maker sites or imply unverified hero art is a shipping kit.
