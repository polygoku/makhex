# Sprint 03 — production release and shop handoff

## Completed in repository
- Gate Squarespace purchase links behind both explicit per-item evidence ledger AND the prior URL/HTTPS/hostname conditions.
- Implement a read-only public release smoke test that returns failure on Squarespace HTTP 401, Cloudflare anti-bot 403, missing site routes, content mismatch or missing security headers.
- Add no-index header for temporary workers.dev staging domains to prevent duplicate-content indexing.
- Implement local-only read-only PowerShell DNS snapshot to assist with DNS migration (not a substitute for a full zone export).
- Expand CI and local QA to verify production-related safeguards.
- Document exact DNS migration, Cloudflare CI/CD, Squarespace primary-shop-domain and rollback gates.

## External launch status at sprint start
- Existing Squarespace site at makhex.com returned 401 (not publicly available).
- shop.makhex.com did not resolve.
- Permanent Cloudflare authentication not yet confirmed; browser OAuth on XPS initiated.
- Supplier-qualified Squarespace product and tested checkout unavailable.
- Neither Squarespace domain records nor payments have been changed.

## Verified staging deployment (temporary)
- Preview: https://makhex.sheer-cough.workers.dev/ (temporary Cloudflare account, requires claiming within its 60-minute window).
- Wrangler deployment: uploaded 44 static assets successfully.
- Read-only public smoke: 9/9 required paths passed, each HTTP 200.
- Cloudflare security headers: CSP present; preview `X-Robots-Tag: noindex` confirmed.
- XPS local Astro validation: 0 errors, 0 warnings; 28 HTML pages, 10 downloadable CSV BOMs, 710 internal links, 22 discussion mappings, and all 12 unverified checkouts blocked.
- Wrangler OAuth on XPS timed out without an authenticated permanent Cloudflare account; no account secrets were added to GitHub.
- GitHub Actions deployment variable/secrets: none configured at the time checked. Production CD remains disabled.
- Read-only DNS sample: 15 visible public DNS answers saved under ignored `reports/`; a complete registrar zone export remains unavailable.
- Headless Edge public browser QA: 12/12 tests passed across 320px, 390px, and 1440px. Each tested page had no horizontal overflow, an HTML title, and qualified commerce remained disabled. HTTP 304 on cached navigations was treated as a valid cache result.

## Go / no-go
**NO-GO** for DNS migration and checkout enablement until permanent Cloudflare deployment, full zone export, public Squarespace shop primary domain and actual checkout test are complete.
