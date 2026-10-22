# MAKHEX DNSSEC restoration - completed October 22, 2026

## Status: PASS - active, cryptographically validated

Cloudflare dashboard at DNS > Settings now explicitly shows:

> Success! makhex.com is protected with DNSSEC.

Squarespace registrar at Domains > makhex.com > DNS > DNSSEC confirmed "Your new record was successfully created." The .com parent authoritative servers publish the new, matching DS. DNSSEC validating resolvers return Authenticated Data (AD=true) for the MAKHEX DNS records.

## Change record

- Registrar remains **Squarespace Domains**. Cloudflare remains the only authoritative zone provider: `maya.ns.cloudflare.com`, `rodney.ns.cloudflare.com`. No changes were made to nameservers, Worker routes, Squarespace shop, checkout or email zone records.
- Cloudflare DNSSEC signing enabled on `makhex.com`. Both authoritative nameservers publish DNSKEY records with flags 257 (key-signing key) and 256 (zone-signing key), protocol 3, algorithm 13 (ECDSA P-256 with SHA-256).
- Cloudflare-generated parent delegation signer: **Key Tag 2371, Algorithm 13, Digest Type 2 (SHA-256)**. The full digest is public in the Cloudflare DS Record UI and Squarespace DNSSEC record. It was independently recomputed from Google's published DNSKEY and matched byte-for-byte **before** the registrar DS was submitted.
- Squarespace **third-party DS record** saved with exactly those four values. This was *not* a re-enablement of Squarespace's former managed signing keys.
- Direct parent queries to `a.gtld-servers.net`, `b.gtld-servers.net`, `c.gtld-servers.net`, and `d.gtld-servers.net` all confirmed new DS Key Tag **2371**, Algorithm **13**, Digest Type **2**.
- Cloudflare's dashboard initially showed Pending while its registrar check updated, then changed to the explicit **Success** confirmation above.
- A temporary old cached DS response was seen at one Quad9 resolver early in the transition. A later query returned the new Key Tag 2371, and Quad9 validated the new chain successfully (AD=true). No unresolved resolver error remained in acceptance testing.

## DNSSEC acceptance evidence

Direct DNS queries with DO=1 and CD=0, to independent validating recursive resolvers:

| Record / zone | Cloudflare 1.1.1.1 | Google 8.8.8.8 | Quad9 9.9.9.9 |
|---|---|---|---|
| `makhex.com A` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `www.makhex.com A` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `shop.makhex.com CNAME` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `makhex.com TXT` (SPF) | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `_dmarc.makhex.com TXT` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `_domainkey.makhex.com TXT` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |
| `_domainconnect.makhex.com CNAME` | AD=true / NOERROR | AD=true / NOERROR | AD=true / NOERROR |

**21/21 signed-record checks passed**, no SERVFAIL. Cloudflare and Quad9 also authenticated the current DS and DNSKEY RRsets. Cloudflare's DS matches the public signing key.

The `shop.makhex.com` CNAME is signed within the MAKHEX zone and still points to `ext-cust.squarespace.com`. When querying `shop.makhex.com A`, the final Squarespace-hosted target may be unsigned and the *entire* synthesized A answer may have AD=false. This is normal for an external CNAME target and does not indicate failure of MAKHEX DNSSEC signing. The signed `shop CNAME` RRset itself returned AD=true from all three validators.

## Customer-facing availability preserved

After publishing the DS at the .com registry:

- `https://makhex.com/`: HTTP 200, valid TLS, no redirect
- `https://www.makhex.com/`: HTTP 200, valid TLS, no redirect
- `https://shop.makhex.com/`: HTTP 200, valid TLS, no redirect
- Maker-site routes, public API and Squarespace separate shop were already operational before DNSSEC signing. DNSSEC restoration changed neither their hosting nor product availability.
- SPF, DMARC, DKIM placeholder and Domain Connect record responses remained present and authenticated. No DNS mail settings were edited.

## Operational follow-up / rollback procedure

- Cloudflare is the authoritative signer; Squarespace is the registrar that holds the matching DS at the .com parent.
- If rotating Cloudflare KSKs, migrating DNS providers again, or changing domain registrars, coordinate DS changes **before** leaving mismatched DNSKEY/DS pairs. Never restore the old Squarespace DS record.
- If SERVFAIL is traced to a mismatched DS, **remove the incorrect DS at Squarespace first**, preserving the correct Cloudflare DNS zone and nameservers; confirm the parent registry updates, then independently validate before trying another DS.
- Periodically verify the Cloudflare dashboard reports protected and independently confirm AD=true for `makhex.com A`, `www.makhex.com A` and the signed shop CNAME. The checks in this report were performed directly, not inferred from an HTTPS certificate.
- DNSSEC protects authenticity of DNS answers, not the content or HTTPS security of a third-party site. Retain HTTPS and the checkout safety gates separately.
- Public DS information and diagnostic scripts are staged in the owner's local ignored `reports/` area. No API tokens, registrar passwords, session cookies or private DNS signing keys were added to GitHub.

## References

- [Cloudflare DNSSEC documentation](https://developers.cloudflare.com/dns/dnssec/)
- [Squarespace: third-party DNSSEC protection](https://support.squarespace.com/hc/en-us/articles/31094668921229-DNSSEC-for-Squarespace-domains)
- [GitHub DNSSEC task #37](https://github.com/polygoku/makhex/issues/37)

**Final disposition: DNSSEC restored, Cloudflare dashboard confirms protected, independent validation passed.**
