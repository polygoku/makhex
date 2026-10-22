# MAKHEX Cloudflare Workers hosting

## Permanent hosting — verified 2026-10-21

- **Owned account:** Cloudflare account authenticated through Wrangler on the XPS. No temporary preview claim is needed anymore.
- **Permanent Worker script name:** `makhex` (matches `wrangler.jsonc`).
- **Account workers.dev subdomain:** `makhex-labs`.
- **Verified site:** https://makhex.makhex-labs.workers.dev/
- **Checks:** valid HTTPS certificate, HTTP 200, CSP and other security headers, 9/9 public smoke checks, 28 generated pages, 714 internal links, 10 BOM exports, 22 maker discussions.
- **Commerce:** all 12 unqualified products remain disabled for checkout.
- **Sprint 08 update:** Registrar nameservers are now set to Cloudflare and both apex/`www` Worker Custom Domain routes are deployed. **Authoritative Cloudflare DNS resolves to proxied edge IPs, and HTTPS 200 with valid TLS and MAKHEX content was directly verified at both hosts.** Local DNS caches may temporarily follow the obsolete Squarespace redirect. `workers.dev` remains a verified fallback and intentionally sends `X-Robots-Tag: noindex`. See [Sprint 08](sprint-08.md).

## Running and verifying from XPS

```sh
git pull --ff-only origin main
npm ci
npm run check
npm run build
npm run qa
npx wrangler whoami
npx wrangler deploy
npm run smoke:public -- https://makhex.makhex-labs.workers.dev/
```

No account email/password/token should be recorded in a repository file.

## GitHub automatic deployment — requires one secure owner token setup

The GitHub deployment workflow is already prepared but must remain **disabled** until these items are configured. Cloudflare requires an account-scoped API token for unattended GitHub Actions deployment, rather than a one-time browser login.

1. Cloudflare dashboard → **Manage account → Account API tokens → Create Token**. Name it `MAKHEX GitHub Deploy`. Grant only `Workers Scripts: Edit` for the intended account/Worker, plus any truly required static Workers deployment permission shown by Cloudflare. Do not grant DNS write access.
2. GitHub repository `polygoku/makhex` → Settings → Secrets and variables → Actions. Create **repository secrets** `CLOUDFLARE_API_TOKEN` (the newly generated token, directly entered there) and `CLOUDFLARE_ACCOUNT_ID` (from the Cloudflare dashboard). Never paste the token into an issue or chat.
3. Create **repository variables** `MAKHEX_PERMANENT_WORKER_URL` and `PUBLIC_SMOKE_URL`, each with the exact value `https://makhex.makhex-labs.workers.dev/`.
4. Review the token's actual permissions and verify it is scoped to **specified Worker: makhex / Editor**, with no unrelated account- or zone-wide permissions. Once a narrowly scoped replacement is securely saved, set repository variable `CLOUDFLARE_TOKEN_SCOPE_APPROVED=true`; set `CLOUDFLARE_DEPLOY_ENABLED=true` **only afterward**. Both variables must be true for GitHub deployment. On the next merge to main, `.github/workflows/deploy.yml` builds, runs all QA, validates the exact public origin, deploys the Worker, and tests nine public routes.
5. Run **Actions → MAKHEX Cloudflare deploy → Run workflow** to verify the first automated deployment. Confirm both deployment and public smoke success in the Actions run logs. Only run one publishing pipeline (GitHub Actions **or** Workers Builds), never both for the same Worker.

**Security:** The browser-based Wrangler OAuth token on the XPS is not suitable as a long-term GitHub deployment secret. Use an independently created narrow-scoped token. Do not set either `CLOUDFLARE_DEPLOY_ENABLED` or `CLOUDFLARE_TOKEN_SCOPE_APPROVED` until the token review and actual rotation are complete. The workflow fails closed when its required token, account ID or exact verified Worker URL is missing.

See [Cloudflare's current GitHub Actions documentation](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for required permissions.

## Domain launch (separate gate)

The preceding prerequisites were completed October 21: Squarespace shop is Public (HTTPS 200), full registrar DNS was backed up, preserved records copied, old DNSSEC DS cleared, and registrar nameservers updated. **Those production routing conditions were subsequently verified on both hostnames using Cloudflare authoritative DNS and explicit edge-IP TLS/SNI requests. Full resolver cache propagation remains asynchronous.** See [Sprint 08](sprint-08.md), [domain cutover runbook](domain-cutover-runbook.md), and [launch issue #30](https://github.com/polygoku/makhex/issues/30).

The code-first Worker and the Squarespace store are intentionally separate origins. This does not require a Squarespace plan upgrade.
