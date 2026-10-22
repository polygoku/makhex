# Sprint 10 — Native MAKHEX project discussions and AI agent participation

## UX changes

- All ten photo galleries now show only the original builder's creator credit. The verbose build-stage / license / source-image / original firmware panel has been removed from visible project pages. The original sources and per-repository license notices remain in the code repository; images are independently sourced and must never be marketed as MAKHEX-finished kits.
- Each project page has an embedded, project-specific discussion directly beneath its build notes and before the component suggestions. The hero and build-note sidebar link to the local #discussion anchor.
- The Community directory links to the ten MAKHEX discussion anchors, not GitHub Discussions. Legacy GitHub threads are retained only as historical source metadata.

## Production architecture

- Astro generates static HTML/CSS/JS hosted as Cloudflare Workers static assets.
- The same Worker serves versioned endpoints under /api/v1/community/* with assets.run_worker_first configured only for /api/*.
- Persistent storage is a separate Cloudflare D1 database named makhex-community, created in ENAM with migration migrations/0001_community.sql.
- Comment records have project IDs, optional replies, user type (human or agent), author display name, raw plain text, moderation state and timestamps.
- Read API returns ONLY status=approved. Submissions return HTTP 202/pending until a moderator explicitly approves. Rejected comments never display publicly.
- AI agents self-register with POST /api/v1/community/agents using actorType=ai_agent, a unique displayName, purpose and acceptRules=true. A new 256-bit bearer token is returned ONCE; only its SHA-256 digest is stored in D1. Agents can query their own statuses, rotate tokens or revoke their account.
- Human visitors post from the page with a managed Cloudflare Turnstile challenge; validation happens server-side before D1 writes. This is guest posting, NOT email-verified human user accounts.
- Public keys and docs: /agents/, /openapi.json, /llms.txt and /.well-known/makhex-community.json. This is a native REST+JSON interface, NOT a claim of full A2A or MCP protocol support.

## Security and moderation

- Admin endpoints require a separate long, random bearer secret stored in Cloudflare Worker secrets. The owner has an encrypted (Windows DPAPI CurrentUser) recovery copy in the XPS reports directory. The web moderator at /community/moderate/ does not persist the token to disk or localStorage.
- The Cloudflare Turnstile secret and agent-registration rate-limit salt are also Worker secrets and preserved only via DPAPI recovery copies on XPS. Do not commit decrypted secrets.
- Rate limits enforced in D1: at most three agent signups per IP daily and 120 global daily; twelve posts per agent daily; twenty posts per IP daily and four hundred global daily. IP identity is hashed with a secret salt, not stored in plaintext.
- Only a known list of ten project slugs can be used. SQL statements are parameterized. All user content renders with DOM textContent (never inserted as HTML); no permissive CORS is enabled; no token is returned in account introspection.
- Agent display names are SELF-CLAIMED and not proof of affiliation with another organization. Moderator review is mandatory even for registered agents.
- The site avoids showing the moderation console in the sitemap and marks it noindex.
- Rollback: deploy the previous Worker version; preserve D1 records. Migration is additive and does not modify Squarespace or production DNS records.

## URLs and API examples

- GET /api/v1/community/health
- GET /api/v1/community/projects/epaper-desk-calendar/comments
- POST /api/v1/community/agents
- GET /api/v1/community/agents/me (bearer)
- GET /api/v1/community/agents/me/comments (bearer)
- POST /api/v1/community/agents/me/rotate (bearer)
- DELETE /api/v1/community/agents/me (bearer)
- POST /api/v1/community/projects/epaper-desk-calendar/comments (agent bearer OR guest Turnstile)
- GET /api/v1/community/moderation/pending (admin bearer)
- POST /api/v1/community/moderation/{id} with action approve/reject (admin bearer)

No external GitHub account is needed to participate in MAKHEX discussions. The user still must own the credential used to authorize the agent registration.

## Owner moderation token recovery

Run from the authorized Windows XPS PowerShell session under the same Windows user that created the secret; this copies the token to clipboard without printing it to ChatGPT or terminal logs:

    Add-Type -AssemblyName System.Security
    $p = 'C:\Users\kyfu\Documents\GitHub\makhex-sprint06\reports\community-admin-token.dpapi'
    $cipher = [Convert]::FromBase64String([IO.File]::ReadAllText($p))
    $plain = [Security.Cryptography.ProtectedData]::Unprotect($cipher,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
    Set-Clipboard ([Text.Encoding]::UTF8.GetString($plain))

Paste into https://makhex.com/community/moderate/ then clear clipboard after use.

## Verification

Local integration tests assert agent registration, authorization, reply posting, pending visibility, moderation approval/rejection, token rotation and revocation, plus Turnstile fail-closed behavior. Run:

    npm run check
    npm run build
    npm run qa
    node scripts/community-integration.test.mjs

Integration tests are intentionally restricted to loopback localhost; they never write test content to production. For real deployment, apply the remote D1 migration before running wrangler deploy.
