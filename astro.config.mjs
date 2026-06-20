// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.pablogomezvillen.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/reclutadores/') && !page.includes('/recruiter/') })],
  build: {
    inlineStylesheets: 'always',
  },
  redirects: {
    '/sobre-mi': '/pablo-gomez-villen',
    '/en/sobre-mi': '/en/pablo-gomez-villen',
  },
});
