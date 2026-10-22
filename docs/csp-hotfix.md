# MAKHEX live Cloudflare CSP hotfix

Cloudflare correctly blocked Astro inline JavaScript after Sprint 06 deployed. Project checklist and prior catalog filter scripts were inert on the live Worker, although build and HTTP smoke tests passed.

Fix: use same-origin scripts in public/scripts/ for checklist and both filters, retaining the existing strict script-src policy (no unsafe-inline). Add a generated-site QA check to forbid executable inline scripts and require all local script assets.

Acceptance: local Astro checks, QA, 20/20 checklist browser tests, project filter 3 Beginner/10 All, component filter 2 Sensors/12 All, no CSP browser errors. After merge, manually deploy using Wrangler OAuth and rerun the same tests against the permanent workers.dev site. Never enable GitHub auto-deploy with the broad token or change Squarespace DNS/checkout for this fix.
