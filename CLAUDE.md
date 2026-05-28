# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at localhost:4321 (copies i18n JSONs to public/ first)
npm run build      # production build to ./dist/ (copies i18n JSONs to public/ first)
npm run preview    # preview the built site
```

There are no lint or test scripts configured.

## Architecture

**Astro 5 static site** deployed on Vercel. Output is fully static (`output: 'static'`). Tailwind CSS is installed but almost all styles live in `src/styles/global.css` using CSS custom properties (design tokens in `:root`). No component library.

### Bilingual i18n (ES/EN)

The site is bilingual without using Astro's i18n integration. The approach:

- **Spanish** pages are at root paths (`/`, `/blog/`, `/servicios`, etc.)
- **English** pages are at `/en/` prefix (`/en/`, `/en/blog/`, `/en/servicios`, etc.)
- The language toggle stores a `lang` cookie and navigates to the alternate URL via `<link rel="alternate" hreflang="...">` tags
- All translatable copy lives in two JSON files: `src/data/i18n/es.json` and `src/data/i18n/en.json`

**Important quirk on blog post pages**: `/blog/[slug].astro` renders Spanish by default and uses a client-side script to swap text content to English if the `lang` cookie is `'en'`. This is the same URL — not a redirect. The `/en/blog/[slug].astro` route is a separate, genuinely English page. Both exist in parallel.

The `predev`/`prebuild` scripts copy the i18n JSONs to `public/data/i18n/` so they are also accessible via fetch if needed.

### Data Layer

All content is stored as JSON — there is no CMS or database:

| File | Purpose |
|---|---|
| `src/data/i18n/es.json` | All Spanish copy + full blog post content |
| `src/data/i18n/en.json` | All English copy + full blog post content |
| `src/data/projects.json` | Portfolio projects with inline bilingual fields (`.es` / `.en`) |
| `src/data/experience.json` | Work/education timeline entries |

### Blog Post Schema

Blog posts live under the `blog` key in both JSON files, keyed by slug:

```json
"slug-del-articulo": {
  "title": "...",
  "subtitle": "...",
  "date": "YYYY-MM-DD",
  "category": "Informativo | Formación | Para negocios",
  "readTime": "X min de lectura",
  "tags": ["tag1", "tag2"],
  "image": "/img/blog/slug.webp",
  "imageAlt": "...",
  "hidden": false,
  "featured": true,
  "content": "<raw HTML string>",
  "quickAnswer": "...",
  "excerpt": "..."
}
```

- `hidden: true` = draft (excluded from all listings and static routes)
- `featured: true` = appears in the homepage featured section
- `content` is raw HTML with special classes: `blog-intro`, `blog-highlight`, etc.
- `quickAnswer` renders a highlighted "Respuesta directa" box below the header
- `excerpt` appears in the sidebar "Sobre este artículo" widget
- Internal links must use language-prefixed paths: `/blog/slug` in ES, `/en/blog/slug` in EN

The EN blog route (`/en/blog/[slug].astro`) only generates a page for slugs where `enData.blog[slug].content` exists.

### Layout

`src/layouts/Layout.astro` is the single layout used by all pages. It handles:
- All `<head>` SEO meta (canonical, hreflang, OG, Twitter Card, JSON-LD)
- Navbar with language toggle (URL-based navigation)
- Hero section (conditional via `showHero` prop)
- Footer with social links
- Contact fixed widget (hidden on contact/about pages)
- Exit-intent popup
- All shared JS (mobile menu, scroll effects, language switch logic)

Key props: `title`, `lang`, `showHero`, `description`, `canonical`, `alternateEn`, `alternateEs`, `keywords`, `ogImage`, `ogType`, `ogArticleDate`, `jsonLd` (accepts array), `lcp` (preloads an image as LCP hint).

### Special Pages

Two hardcoded pillar pages (not generated from JSON) exist as `.astro` files:
- `src/pages/blog/web-para-negocios-granada.astro` / `src/pages/en/blog/web-for-businesses-granada.astro`
- `src/pages/blog/formacion-programacion.astro` / `src/pages/en/blog/programming-training.astro`

### Deployment

Vercel config in `vercel.json`: redirects `pablogomezvillen.com` → `www.pablogomezvillen.com`, sets security headers (CSP, HSTS, X-Frame-Options), and applies immutable cache to `/_astro/` assets.

Production domain: `https://www.pablogomezvillen.com`
