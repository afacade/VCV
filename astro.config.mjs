import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://afacade.github.io/VCV/
// If you later use a custom domain or a <user>.github.io repo, set base: '/'.
export default defineConfig({
  site: 'https://afacade.github.io',
  base: '/VCV',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
