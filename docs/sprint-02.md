# Sprint 02 — launch-readiness gate

## Implemented
- Squarespace checkout links now require an explicit hostname allowlist, a valid HTTPS root, and a per-product public path.
- Project build guides expose a spreadsheet-compatible CSV bill of materials and explicitly label all materials as research candidates.
- Read-only domain snapshot script preserves DNS evidence rather than changing registrar or mail records.
- Static-site security headers: CSP, frame, referrer, MIME, permissions, and cross-origin protections.
- CI checks output structure, 22 discussion link mappings, 12 disabled checkouts and 10 CSV BOM endpoints.

## Observed infrastructure at beginning of Sprint
- `makhex.com`: Squarespace A records.
- `www.makhex.com`: Squarespace CNAME.
- `shop.makhex.com`: unresolved.
- XPS Wrangler: unauthenticated.
- Temporary Cloudflare preview deployment: challenge page (403 to automation), and requires a claimed production Cloudflare account.

## Blocked by provider access
- Do not update DNS until Cloudflare has a claimed authenticated account and current zone/mail records backed up.
- Do not activate product links or publish orderable prices until exact Squarespace shop product URL, inventory, payment, shipping, returns and test checkout are verified.
- Do not turn on GitHub automatic deployment without verified Cloudflare secrets and owning account.

## Next acceptance
1. Verify cloud account ownership, claim/migrate temporary deployment if available and connect build on main.
2. Export all current DNS; connect Cloudflare apex/www while retaining Squarespace under shop subdomain.
3. Add a single supplier-qualified Squarespace product and run a real order/fulfillment/refund smoke test.
4. Confirm behavior of Giscus if installed; direct GitHub Discussions remain functional.
