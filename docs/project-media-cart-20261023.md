# MAKHEX research media and parts cart

October 23, 2026. The original creator of the ESP-Mosaico learning assistant is credited in `builds/mosaico-learning-assistant/README.md`, not in the customer-facing MAKHEX article.

## Build 11 video and hardware photograph
The project's hero shows a real supplier-reference photo of the ESP-Mosaico core unit, camera and interaction module. A visible video preview opens the creator's original X demonstration. An optional embedded tweet can be expanded, but X may block playback in some browsers. The original interface is Chinese; the MAKHEX guidance is in English. MAKHEX does not bundle the noncommercial application.

## Product photography
The `scripts/stage-supplier-media.mjs` one-time ingestion script downloads 16 item-family photographs from AliExpress CDN, validates upstream host and MIME magic, converts to compressed JPEG and saves into `public/product-media`. Photos are supplier listing *references*, not evidence of exact SKU, U.S. stock or delivery. Updated board-family sources avoid the prior ESP32-C6 N4-backed and ESP32-S3 N16R8 mismatches. The WS2812 listing covers numerous selectable rings and matrices; image identity is not variant approval. Exact variant and photo reuse permissions are not established, so do not imply an approved commercial image license.

The finished public website includes the JPEG assets, not raw supplier URLs, supplier IDs, wholesale amounts or fulfillment credentials. This engineering script exists in GitHub for provenance, not in public website routes.

## Customer parts cart (not payment)
Individual product cards, shop pages and project BOM lines can add components and quantities. The Add All Parts control carries through the entire build BOM, including double quantities for the two ESP-NOW nodes and separate 8-LED ring versus 8×8 matrix variants.

A browser-local `/cart/` stores public component slugs, public variant titles and quantities only, using localStorage. The customer can review, change quantities, remove, clear and copy their list. No customer payment, server-side order, external AliExpress link, or automatic Squarespace cart transfer occurs.

**Checkout stays disabled** pending exact product variant identity, image-use authorization, U.S. shipping to ZIP 11021, supplier stock/orderability, returns and a genuine Squarespace→Doroppu end-to-end order/tracking/refund test.

## QA
Run `npm ci`, `npm run check`, `npm run build`, `npm run qa`, and `node --check public/scripts/maker-cart.js`. A CI first-party media staging pass must generate 16 JPEG files before running the site build. The old direct-login Cloudflare production deployment remains subject to the site's credential and scope gates.
