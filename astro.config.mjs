import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const hubPaths = new Set(['/interests', '/itineraries', '/festivals', '/get-there', '/food', '/plan', '/destinations']);
const tabTail = /\/(attractions|interests|get-there|itineraries|stay|eat|festivals)$/;

export default defineConfig({
  site: 'https://enso-jp.github.io',
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/interests/oldTowns': '/interests/old-towns',
    '/interests/warHistory': '/interests/war-history',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        if (path === '/search' || path === '/saved' || path === '/interests/food') return false;
        if (path === '/interests/oldTowns' || path === '/interests/warHistory') return false;
        if (hubPaths.has(path)) return true;
        if (tabTail.test(path)) return false;
        return true;
      },
    }),
  ],
});
