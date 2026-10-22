// Read-only live SEO/canonical check. Run: npm run seo:live
// A 308 preserves HTTP methods when redirecting API requests.
const base = 'https://makhex.com';
const route = '/projects/?seo_audit=1';
let errors = 0;
const check = (label, pass, detail) => {
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + label + ': ' + detail);
  if (!pass) errors++;
};
async function get(url) {
  const result = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: { 'User-Agent': 'MAKHEX-SEO-Audit/1.0' },
  });
  return result;
}
for (const [label, url] of [
  ['HTTP apex', 'http://makhex.com' + route],
  ['HTTP www', 'http://www.makhex.com' + route],
  ['HTTPS www', 'https://www.makhex.com' + route],
]) {
  try {
    const response = await get(url);
    const destination = response.headers.get('location');
    const expected = base + route;
    check(label, response.status === 308 && destination === expected,
      'HTTP ' + response.status + '; Location ' + (destination || '(missing)'));
  } catch (error) { check(label, false, String(error)); }
}
for (const [label, routePath, validType, bodyRequired] of [
  ['canonical homepage', '/', 'text/html', '<link rel="canonical" href="https://makhex.com/">'],
  ['canonical projects', '/projects/', 'text/html', '<link rel="canonical" href="https://makhex.com/projects/">'],
  ['robots', '/robots.txt', 'text/plain', 'Sitemap: https://makhex.com/sitemap-index.xml'],
  ['sitemap index', '/sitemap-index.xml', 'xml', 'https://makhex.com/sitemap-0.xml'],
  ['sitemap URLs', '/sitemap-0.xml', 'xml', '<loc>https://makhex.com/</loc>'],
]) {
  try {
    const response = await get(base + routePath);
    const body = await response.text();
    const ok = response.status === 200 &&
      (response.headers.get('content-type') || '').includes(validType) &&
      body.includes(bodyRequired);
    check(label, ok, 'HTTP ' + response.status + '; expected content ' + (body.includes(bodyRequired) ? 'present' : 'absent'));
  } catch (error) { check(label, false, String(error)); }
}
console.log('\n' + (errors ? errors + ' checks failed.' : 'All live SEO checks passed.'));
process.exitCode = errors ? 1 : 0;
