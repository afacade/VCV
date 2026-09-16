# Vĩnh Cường Vina — website

A fast, static bilingual (Tiếng Việt / English) catalog site for **Vĩnh Cường Vina**,
migrated off WordPress/WooCommerce. Built with [Astro](https://astro.build).
Products are shown with prices but **no online cart/checkout** — customers order by
phone, Zalo, or an email quote.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321/VCV/
```

Other commands:

```bash
npm run build    # build the static site into dist/
npm run preview  # preview the built site
```

## Where the content lives

| What | File |
|---|---|
| Company info (phone, Zalo, email, addresses, brands) | `src/data/site.js` |
| Products (name, prices, category, images) | `src/data/products.json` |
| Categories | `src/data/categories.json` |
| Info + policy page text | `src/data/pages.json` |
| Blog posts | `src/data/posts.json` |
| UI text (VI/EN) | `src/i18n/ui.js` |
| Product / brand images | `public/img/...` |

These data files are **generated** from the old WordPress database by
`scripts/build-data.mjs` (reads `migration/catalog.json`). To re-import from
WordPress, re-run the export (`migration/export_products.php`) then:

```bash
node scripts/build-data.mjs
```

You can also edit the JSON files directly by hand (a visual CMS is the next step).

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. **One-time setup:** in the GitHub repo, go to
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site is served at `https://afacade.github.io/VCV/`. If you later add a custom
domain (or move to a `<user>.github.io` repo), change `base` in `astro.config.mjs`
to `'/'` and update the URLs in `public/robots.txt`.

## Notes / to-do

- **Blog posts** are currently the old theme's demo content — replace with real posts (or hide the News menu) before launch.
- **English product names** are auto-translated and rough — refine as needed.
- Next phase: a browser-based visual editor (Sveltia/Decap CMS) so non-developers can edit products/prices/text.

The old homepage design explorations are kept in `mockups/` for reference.
