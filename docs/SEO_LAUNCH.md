# MAKHEX production SEO launch: Search Console and canonical redirects

Issue: https://github.com/polygoku/makhex/issues/42

## Verified October 22, 2026

- MAKHEX live at `https://makhex.com/` and `https://www.makhex.com/`.
- `robots.txt` allows all crawlers and points at `/sitemap-index.xml`.
- The index lists `/sitemap-0.xml`, which lists canonical page URLs.
- The homepage emits `<link rel="canonical" href="https://makhex.com/">`.
- HTTP apex, HTTP www and HTTPS www **currently** return 200 (duplicate hosts).
- The XPS Wrangler OAuth session belongs to the correct Cloudflare account; the API returns 403 for DNS-record and redirect-ruleset management. Do not assume CLI login grants zone rule edit rights.
- Search Console was started in a different Chrome/Google profile and is not yet DNS-verified.

## Step 1: Google Search Console verification

1. Sign into Search Console in the desired Google owner account.
2. Add property **Domain**: `makhex.com` (not `https://makhex.com`).
3. Use automatic Cloudflare linking **only** when it offers the Cloudflare account containing the MAKHEX zone. Otherwise select **Any DNS provider** and obtain the TXT verification value.
4. In the authorized Cloudflare `makhex.com` DNS zone, add the TXT verification record at `@`, keeping all existing records and DNSSEC unchanged.
5. Return to Search Console; click Verify. Keep the TXT record permanently.
6. Submit sitemap `https://makhex.com/sitemap-index.xml`.
7. Inspect and request indexing for homepage `https://makhex.com/`, project index `https://makhex.com/projects/`, and a representative live project `https://makhex.com/projects/touch-weather-station/`. An accepted request is not proof of indexing.

## Step 2: One Cloudflare Single Redirect

Configure via Cloudflare > makhex.com > Rules > Redirect Rules > Create rule,
**Custom filter expression**:

```text
(http.host in {"makhex.com" "www.makhex.com"} and (http.request.scheme eq "http" or http.host eq "www.makhex.com"))
```

**Dynamic target URL expression**:

```text
concat("https://makhex.com", http.request.uri.path)
```

Status code **308 Permanent** (preserve method), **Preserve query string ON**.

Review any existing redirect rules first; add a new rule without replacing them.
A zone Single Redirect executes before the Worker so existing static-asset delivery and
`/api/` community handlers are unaffected. Preserve the existing Worker custom domains,
DNSSEC, firewall rules and other subdomains.

## Step 3: Test from XPS

```bash
npm run seo:live
```

Expected for all three redirect checks:
`308` with `Location: https://makhex.com/projects/?seo_audit=1`.
HTTPS apex and crawlability checks should remain `200`.

After deployment, confirm Search Console's sitemap reports **Success**, and monitor
**Pages** for discovered/crawled/indexed URL counts. Indexing can take time; do not
interpret a zero `site:` search result as proof that Cloudflare is blocking Google.

## Guardrails

- Do not remove DNSSEC or reduce bot protection based solely on a Gemini fetch failure.
- Do not enable `assets.run_worker_first=true` to implement global hostname redirects:
  it changes cost/routing for static assets.
- Cloudflare Workers Static Assets `_redirects` does **not** support domain-level
  host redirects. Prefer the zone Single Redirect above.
- Never paste Cloudflare access credentials or Google verification credentials
  into GitHub issues or source.
- MAKHEX auto-deploy is intentionally disabled; this runbook and audit require no deploy.
