# MAKHEX SEO foundation — implementation and rollout (2026-10-28)

## Business objective and guardrails
MAKHEX showcases maker projects and lets buyers assemble BOMs in one MAKHEX cart. Suppliers remain backstage unless the owner approves a sourcing exception. Search pages must not falsely promise available stock, a completed kit, an active payment offer, or tested hardware.

## Technical baseline
- Production canonical host: `https://makhex.com/`; HTTP and www redirects return 308 to apex.
- Live robots.txt and Astro XML sitemap passed the pre-change eight-check production audit.
- The old production sitemap contained 57 locations, including cart, checkout, account, members, moderator and operations pages.
- The proposed generated sitemap contains **51 public pages**, including **12 project detail pages**, **30 component reference pages**, and a new ESP32 guide.
- This branch includes an automated **567-check static SEO audit** for titles, descriptions, canonicals, social images, structured data, noindex, sitemap and links into the MAKHEX component catalog.

## SEO implementation in this branch
1. Unique long-tail title and description for each of the 12 project detail pages.
2. Technical metadata for 30 component pages. No unverified `Offer`/availability markup; this intentionally postpones Merchant Listing rich results.
3. `TechArticle` for researched projects and component references; `BreadcrumbList` for project and component detail; homepage `Organization` and `WebSite`.
4. Project/page-specific social images, original `/og.png` sitewide fallback, Twitter cards and clear robots tags.
5. Exclude private/utility pages from XML sitemap and add `noindex,follow` in rendered HTML. Do not use `robots.txt Disallow` to hide their noindex directive.
6. Better ESP32/robotics copy on home and project directory; linked relevant builds with common parts or tech.
7. Original evergreen article `/blog/esp32-project-ideas/`, with eight project BOM and test-plan links.
8. A reproducible static SEO audit command and an after-deploy release check.

## Keyword-to-page targets (priorities, not search-volume claims)

| Search intent | Target |
| --- | --- |
| ESP32 project ideas / beginner ESP32 builds | `/blog/esp32-project-ideas/` |
| ESP32-S3 touch weather station | `/projects/touch-weather-station/` |
| ESP32-C3 BLE beacon tutorial / beginner project | `/projects/tiny-ble-presence/` |
| ESP32 smart button / Wi-Fi button | `/projects/smart-desk-button/` |
| ESP32 plant monitor / BME280 | `/projects/plant-health-monitor/` |
| ESP32 e-paper calendar | `/projects/epaper-desk-calendar/` |
| ESP-NOW remote ESP32-C3 | `/projects/espnow-remote/` |
| ESP32 offline voice commands | `/projects/voice-command-node/` |
| ESP32 WS2812 RGB clock | `/projects/rgb-matrix-clock/` |
| Microduck robot BOM / original CAD | `/projects/microduck-robot/` |
| ESP-Mosaico AI learning assistant | `/projects/mosaico-learning-assistant/` |
| Exact component / board model queries | `/shop/{component}/` |

## Validation gates
- Local: `npm run check`, `npm run build`, `npm run seo:check`, `npm run qa`.
- Ensure no marketing changes alter prices, owner exception review, stock, fulfillment, or CAD authentication.
- After approval, deploy through the existing, verified Cloudflare workflow. **A separate explicit production deploy authorization is required by AGENTS.md.**
- After deploy: `npm run seo:live` and `npm run seo:release`; spot-check mobile and desktop screenshots, login and cart flows; verify sitemap, article and canonical URLs on public host.
- Do not make DNS or Cloudflare origin changes as part of SEO without a separate approval.

## Google and Bing setup (ownership verification not yet established)
1. Sign in to [Google Search Console](https://search.google.com/search-console) using the site's authorized owner account.
2. Add/verify a property for `makhex.com` or its canonical URL prefix. DNS TXT verification requires a separately approved DNS change; an HTML verification file can instead be staged and deployed with approval.
3. Submit `https://makhex.com/sitemap-index.xml` after production release. Use URL Inspection on home, project hub, eight-project article, Microduck, Mosaico, and key component pages; record whether each page is indexed and the last crawl date.
4. In [Bing Webmaster Tools](https://www.bing.com/webmasters), verify ownership or import the verified Google property, then submit the same sitemap.
5. For qualified paid products only, later review Google Merchant Center/Squarespace store feeds and structured-data eligibility using exact SKU, inventory, real active price, shipping/returns and chargeable checkout.

## Measurement and the next 30 days
- Capture baseline Search Console impressions, clicks, average position and index coverage after ownership is verified; empty data is **not** a proof of zero traffic.
- Rank first by **non-branded search clicks into project pages**, then organic click-through to BOM/component pages, parts-cart additions and qualified checkout requests.
- Add privacy-conscious analytics for cart/BOM conversion only after deciding the tracking provider and privacy disclosures. Do not transmit customer email or purchase information to a marketing tracker.
- Next content opportunities: board revision comparison notes, Microduck AMP2.0 vs EH2.5 connector guide, BME280 versus BMP280 identification, ESP32-C3 low-power measurements, and clear maker-tested build updates.
- Reaudit page speed on mobile after release, prioritizing real user Core Web Vitals when data is available. Do not infer field CWV from a single synthetic run.
- Continue technical corrections from credited original builders; do not manufacture reviews, FAQ ratings or unsupported tested-kit claims.

## Production status
Development branch only. No production SEO deploy, Google Search Console verification, Bing verification or submission should be marked as complete until executed and independently rechecked.
