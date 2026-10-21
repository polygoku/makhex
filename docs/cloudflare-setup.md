# Cloudflare Workers setup

The app is a **static Astro site**; `wrangler.jsonc` has `assets.directory="./dist"` and needs no adapter or Worker script.

## Preview deployment
1. Connect an authorized Cloudflare account.
2. Run `npm ci && npm run check && npm run build && npm run qa`.
3. Authenticate `npx wrangler login` using your own Cloudflare account.
4. Run `npx wrangler deploy`; save and test the actual `*.workers.dev` URL before claiming a deployment succeeded.
5. Test desktop and mobile, network links, no empty images, external GitHub discussions and disabled checkout buttons.

## Automatic CD
Use GitHub repo Settings → Secrets and variables → Actions.
- Secrets: `CLOUDFLARE_API_TOKEN` scoped for Workers deployment and `CLOUDFLARE_ACCOUNT_ID`.
- Variable: `CLOUDFLARE_DEPLOY_ENABLED=true`.
- Optional public variables: `PUBLIC_SQUARESPACE_SHOP_URL`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY_ID`.

The `deploy.yml` job only runs when the enable variable is true. GitHub push to main then triggers an automatic build and deploy. Alternatively connect Workers Builds to GitHub from the Cloudflare dashboard with build command `npm run build` and deploy command `npx wrangler deploy`. Use one publishing pipeline, not both simultaneously.

## Production staging guardrails
The Cloudflare static asset `_headers` rules mark `*.workers.dev` previews `noindex` and attach CSP, MIME, framing and referrer headers. Verify a public deployment with `npm run smoke:public -- https://<your-worker>.<account>.workers.dev/`. A Cloudflare challenge (403), Squarespace 401 or missing route fails the smoke test, not a PASS. Manual browser testing at 320, 390 and 1440 widths is still required before DNS migration.

See [Sprint 03 cutover guide](domain-cutover-runbook.md) for complete DNS, Squarespace primary shop-domain, credential and rollback requirements.

## Domain gates
Do not attach `makhex.com` until the Workers preview is verified and the existing Squarespace shop URL is mapped for `shop.makhex.com`. Preserve all existing mail and verification DNS records.
