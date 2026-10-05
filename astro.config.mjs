import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://teamcanadaicc.ca',
  output: 'static',
  // Pages are emitted as sponsor.html rather than sponsor/index.html:
  // Cloudflare Pages serves the former at /sponsor, but answers the latter
  // with a 308 to /sponsor/. Every link on the site is slash-less, so this
  // keeps links, canonical URLs, hreflang and the sitemap redirect-free.
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      // /homepage2 is a design experiment (noindex); 404 is not a page.
      filter: (page) => !/\/(homepage2|404)\/?$/.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-CA', fr: 'fr-CA' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
