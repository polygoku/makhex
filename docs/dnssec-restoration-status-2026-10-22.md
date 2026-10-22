# MAKHEX DNSSEC restoration — 2026-10-22 safe execution gate

## Current externally verified state

- Squarespace remains domain registrar and Squarespace storefront host; DNS authority has migrated to Cloudflare.
- Active registrar NS: maya.ns.cloudflare.com and rodney.ns.cloudflare.com (agreed by Cloudflare and Google public recursive resolvers).
- Former Squarespace parent DS has been removed. Fresh queries to .com parent servers, 1.1.1.1 and 8.8.8.8 show no parent DS.
- Both designated Cloudflare authoritative servers return NO DNSKEY for makhex.com. Cloudflare DNSSEC signing has **not** been enabled.
- Live HTTPS for makhex.com and shop.makhex.com returns 200 with valid TLS. The website is functioning but lacks DNSSEC chain-of-trust validation.
- Authentication blocker: XPS Windows desktop is locked, so signed-in interactive Cloudflare and Squarespace DNSSEC settings cannot be operated safely through GUI. Authenticated Wrangler OAuth grants Zone Read but no DNSSEC/Zone DNS write; no appropriate unattended registrar API credentials exist. **Do not** bypass Windows lock, extract browser sessions or install a guessed DS.

## Required next authorized steps (after user unlocks the XPS Windows desktop)

1. Confirm Cloudflare zone makhex.com is Active under the intended permanent account.
2. Cloudflare DNS > Settings > DNSSEC > Enable DNSSEC. Retrieve the **new Cloudflare** Key Tag, Algorithm, Digest Type and Digest. Do not reuse any old Squarespace DS/key.
3. Verify Cloudflare authoritative maya/rodney return matching DNSKEY/RRSIG before entering a DS in the parent. Document the key data in restricted local operations report (DS itself is public, never share auth tokens).
4. Squarespace Domains > makhex.com > DNS > DNSSEC: add the third-party Cloudflare DS record (not Squarespace-managed DNSSEC) using the exact values in step 2.
5. Verify at authoritative parent and 1.1.1.1, 8.8.8.8, 9.9.9.9: DS present, chain validates (DNSSEC-secure/AD), expected addresses and TXT/CNAME for makhex.com, www.makhex.com and shop.makhex.com; no SERVFAIL.
6. Confirm browser TLS/HTTP 200, maker project pages, separate Squarespace shop, and preserved email-related DNS records across multiple public resolvers. Update issue #37 with time-stamped results, then close only if all checks PASS.

## Rollback if a validation failure occurs

Immediately remove the **new** DS from Squarespace registrar first if it mismatches Cloudflare's published DNSKEY, restoring an unsigned but functional delegation; verify DS removal at the .com parent and recursive validators before making any further DNSSEC changes. Do not change the nameservers during this rollback; do not re-enable Squarespace's old DNSSEC toggle with Cloudflare nameservers.

Official providers:
- https://developers.cloudflare.com/dns/dnssec/
- https://support.squarespace.com/hc/en-us/articles/31094668921229-DNSSEC-for-Squarespace-domains

State: **DNSSEC NOT RESTORED** until Cloudflare signing, Squarespace third-party DS publication and independent validation all pass. Public website and shop are operational.
