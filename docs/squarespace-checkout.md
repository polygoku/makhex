# Squarespace Basic commerce integration

## Architecture
Use the already-paid Squarespace Basic subscription as a separate hosted store. The Astro front-end runs on Cloudflare Workers at `https://makhex.com`; Squarespace can run at `https://shop.makhex.com` after the subdomain is verified with Squarespace's domain panel and Cloudflare DNS. These are **separate origins**, not a shared cart.

## Workflow
1. Finish Squarespace site setup and confirm the public storefront URL (not `/config`).
2. Create and verify a real, qualified product in Squarespace; configure taxes, shipping, stock and returns.
3. Make sure the external storefront product page is accessible without admin login.
4. In `src/data/products.ts`, set `storePath:'shop/p/actual-public-slug'` for that one qualified record.
5. In Cloudflare/GitHub build variables, set `PUBLIC_SQUARESPACE_SHOP_URL=https://shop.makhex.com` and `PUBLIC_SQUARESPACE_ALLOWED_HOSTS=shop.makhex.com` only after the subdomain is public. No slash path ending `/config`.
6. Confirm product page → external shop page → add to cart → checkout → payment/test order → fulfillment flows.
7. Expand to other SKUs only after equivalent qualification.

## Domain routing
If MAKHEX domain is registered through Squarespace, retain the registrar subscription. The DNS nameservers can move to Cloudflare for the static root site if required by Workers custom domains, but **export and preserve every existing DNS, MX, TXT and verification record first**. Add `shop` records following Squarespace official connection instructions.

**Never modify domain settings before preview and live Squarespace URLs are both tested.** A paid Squarespace Basic subscription does not require the primary root domain to resolve to the Squarespace site.

## Limits
Cross-domain shopping carts do not synchronize to the Astro website. Customer identity, inventory and checkout live at Squarespace. This is intentional and avoids creating an unmaintained custom payment backend.
