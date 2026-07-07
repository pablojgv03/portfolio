// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.pablogomezvillen.com',
  output: 'static',
  integrations: [
    sitemap({
      // Fuera del sitemap: páginas privadas y páginas noindex (gracias/thank-you)
      filter: (page) =>
        !page.includes('/reclutadores/') &&
        !page.includes('/recruiter/') &&
        !page.includes('/gracias/') &&
        !page.includes('/thank-you/'),
      // Las URLs del sitemap deben coincidir con las canonical: sin barra final
      serialize: (item) => {
        const root = 'https://www.pablogomezvillen.com/';
        if (item.url !== root) item.url = item.url.replace(/\/$/, '');
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
  // Las redirecciones /sobre-mi viven en vercel.json como 308 de servidor
  // (las redirects de Astro en estático generan páginas meta-refresh con noindex)
});
