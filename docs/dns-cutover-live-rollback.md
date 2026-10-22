# MAKHEX DNS cutover / rollback preflight — October 21, 2026

**No live migration is authorized by this document.** The records below are derived from actual owner-signed-in Squarespace and Cloudflare control panels. Raw zone values remain in ignored, local `reports/` evidence files. Never include private credentials or customer data in a public issue.

## Current authority and pending target

| Component | Current (must preserve until safe) | Intended |
|---|---|---|
| Domain registrar | Squarespace, registration active | Squarespace — no transfer |
| Authoritative NS | `nsb1.squarespacedns.com`, `nsb2.squarespacedns.com`, `nsb3.squarespacedns.com`, `nsb4.squarespacedns.com` | `maya.ns.cloudflare.com`, `rodney.ns.cloudflare.com` |
| Zone | Signed active Squarespace DNS | Cloudflare Free zone, Pending |
| `shop.makhex.com` | `CNAME ext-cust.squarespace.com`, site Primary, currently Private | **Exactly same target, DNS only** |
| Email security | SPF, DMARC, DKIM placeholder TXT; no MX shown in Squarespace panel | Preserve all TXT exactly, without proxying |
| `_domainconnect` | `CNAME _domainconnect.domains.squarespace.com` | Same value, DNS only |
| Apex + `www` | Squarespace A/CNAME and old HTTPS/SVCB hint | Owned `makhex` Worker, **not** the old Squarespace origin |
| DNSSEC | **Parent DS active**, validation tied to Squarespace zone | Clear/coordinate DS before changing delegation; re-enable DNSSEC after Cloudflare activation |

## Records and safety checks

The **11 Squarespace control-panel records** and **10 Cloudflare staging records** are captured locally. Six legacy Squarespace-origin web records (4 A, 1 www CNAME, 1 HTTPS apex hint) must not be preserved as the final Worker origin. All five non-cutover records (shop CNAME, domainconnect CNAME, three TXT) match. The Cloudflare shop CNAME is confirmed DNS-only.

`npm run dns:compare -- --source reports/squarespace-registrar-zone.json --target reports/cloudflare-staged-zone.json` returns **NO-GO** on the current snapshots because apex/www still point to Squarespace and parent DS is active. A matching DNS snapshot never substitutes for actual Squarespace public checkout, Worker custom-domain routing, TLS or mail testing.

## Ordered change window (not yet executed)

1. Verify Squarespace shop is **Public** with an authorized non-demo product plan and no checkout surprises; prove direct `shop` HTTPS 200 without redirect to apex.
2. Secure complete DNS export and screenshots; refresh source + target snapshot, independently verify MX/TXT/subdomains, and select a rollback operator and window.
3. Verify Worker route plan: Cloudflare Workers **Custom Domains require an active zone**. A full-zone pending→active transition must have a correctly staged Worker route or other verified origin solution before the change. Default old Squarespace A/www records are *not* adequate.
4. Coordinate removal of pre-existing Squarespace DNSSEC **DS** with registrar (or approved multi-signer migration). Query DS on more than one resolver; observe published DS TTL before touching NS. Do **not** remove DS merely to test the site.
5. Change registrar nameservers to Cloudflare's exact designated pair only once all gates and rollback are approved.
6. As the zone becomes active, verify apex/www Worker routing, valid TLS, static assets, project links and checkout separation. Re-check shop CNAME remains DNS-only and no 301/302 to apex.
7. If anything fails, stop traffic/commerce promotion. Revert delegation to original four Squarespace nameservers **and coordinate DNSSEC correctly for the restored zone**; do not blindly re-add the old DS until compatible keys are confirmed. Retest authoritative DNS, TLS and mail.

Official Cloudflare references: https://developers.cloudflare.com/dns/zone-setups/full-setup/troubleshooting/ and https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ .

**Current NO-GO:** active DS, pending Cloudflare zone, old homepage targets, private Squarespace shop. No registrar delegation or DNSSEC edits have been made.
