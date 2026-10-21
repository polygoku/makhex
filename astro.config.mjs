import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({site:'https://makhex.com',output:'static',trailingSlash:'always',integrations:[sitemap()]});
