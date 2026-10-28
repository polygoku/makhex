import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Keep account, payment, private library and moderation pages out of search indexes.
// They retain visible noindex tags; do not disallow crawling them in robots.txt.
const excludeFromSitemap = new Set([
  '/404/',
  '/account/',
  '/cart/',
  '/checkout/',
  '/checkout/status/',
  '/community/moderate/',
  '/members/microduck-designs/',
  '/ops/orders/',
  '/parts-sources/'
]);
export default defineConfig({
  site: 'https://makhex.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: page => !excludeFromSitemap.has(new URL(page).pathname)
  })]
});
