// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pablogomezvillen.com',
  output: 'static',
  integrations: [sitemap()],
  redirects: {
    '/sobre-mi': '/pablo-gomez-villen',
    '/en/sobre-mi': '/en/pablo-gomez-villen',
  },
});
