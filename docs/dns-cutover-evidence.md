# DNS cutover record comparison — MAKHEX

This is a **read-only preflight**, not a cutover tool and not a substitute for exporting the COMPLETE Squarespace DNS zone. Do not use a list returned by a public DNS resolver as a full authoritative zone export; hidden records, other subdomains, mail/verification details and DNSSEC DS may be missed.

## Inputs

Export or manually transcribe each DNS record from the Squarespace domain manager into a local JSON file under ignored `reports/`. Capture every custom DNS entry. Prepare a second, independently reviewed JSON export of the Cloudflare zone that will become authoritative after nameserver migration.

Each file must have:

```json
{
  "domain": "makhex.com",
  "sourceSystem": "squarespace-registrar-full-zone",
  "capturedAt": "2026-10-21T20:00:00Z",
  "evidenceIssueUrl": "https://github.com/polygoku/makhex/issues/30",
  "verifiedComplete": false,
  "records": [
    {"name": "@", "type": "MX", "content": "mx.example.invalid", "priority": 10},
    {"name": "_dmarc", "type": "TXT", "content": "v=DMARC1; p=reject"}
  ]
}
```

For the second file, change `sourceSystem` to `cloudflare-staged-zone`, and fill in ALL true Cloudflare DNS records, with `proxied: false` on the required Squarespace `shop` CNAME. These are **illustrative placeholder data**, not actual MAKHEX records. Set `verifiedComplete:true` only after a responsible person has checked a full panel/zone export and attached review evidence to GitHub #30. Keep the actual snapshots out of Git; the `reports/` directory is gitignored.

## Compare

```powershell
npm run test:cutover
npm run dns:compare -- --source reports/squarespace-zone.json --target reports/cloudflare-zone.json --output reports/dns-cutover-compare.json
```

The comparison preserves all pre-existing records except intentionally changed **apex and www A/AAAA/CNAME** records and old apex NS/SOA records, which naturally change during the migration. It verifies TXT/SPF/DKIM/DMARC/verification, MX, CAA, SRV and other non-exempt records by name, type, value, and multiplicity. It also requires exactly one **DNS-only** `shop.makhex.com` destination, without pointing that subdomain back to the apex.

**Limits:** This static check cannot prove provider DNS access, live TLS, Squarespace site-primary status, Cloudflare Workers custom-domain routing, registrar DS/DNSSEC status, email delivery, checkout, nameserver delegation, or public certificate issuance. The authoritative full-zone export and rollback attestations in `ops/launch-attestations.json` are separate human-reviewed gates. Even a passing comparison never executes DNS changes or marks the entire production launch as GO.

The CLI emits only record type/hostname mismatches, not TXT values or token contents. Never commit any customer data, provider credentials, or private reports.
