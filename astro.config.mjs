import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const canonicalOrigin = 'https://vietnam-travelguide.com';
const hubPaths = new Set(['/interests', '/itineraries', '/festivals', '/get-there', '/food', '/plan', '/destinations']);
const tabTail = /\/(attractions|interests|get-there|itineraries|stay|eat|festivals)$/;
const omittedPaths = new Set([
  '/search',
  '/search.json',
  '/news',
  '/interests/food',
  '/interests/oldTowns',
  '/interests/warHistory',
  '/destinations/northern-vietnam',
  '/destinations/central-coast',
  '/destinations/highlands-coast',
]);

export default defineConfig({
  site: canonicalOrigin,
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/interests/oldTowns': '/interests/old-towns',
    '/interests/warHistory': '/interests/war-history',
    '/destinations/northern-vietnam': '/destinations',
    '/destinations/central-coast': '/destinations',
    '/destinations/highlands-coast': '/destinations/south-central-highlands',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        if (omittedPaths.has(pathname)) return false;
        if (hubPaths.has(pathname)) return true;
        if (tabTail.test(pathname)) return false;
        return true;
      },
    }),
    publishSitemapXml(),
  ],
});

function publishSitemapXml() {
  return {
    name: 'publish-sitemap-xml',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const destDir = fileURLToPath(dir);
        const chunks = readdirSync(destDir)
          .filter((name) => /^sitemap-\d+\.xml$/.test(name))
          .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
        if (chunks.length === 0) {
          throw new Error('@astrojs/sitemap did not write a urlset, so /sitemap.xml would be served as HTML.');
        }
        const parts = chunks.map((name) => readFileSync(path.join(destDir, name), 'utf8'));
        const xml = parts.length === 1 ? parts[0] : mergeUrlsets(parts);
        const locs = sitemapLocs(xml);
        writeFileSync(path.join(destDir, 'sitemap.xml'), xml);
        logger.info(`sitemap.xml written with ${locs.length} URLs`);
      },
    },
  };
}

function sitemapLocs(xml) {
  const head = xml.trimStart().slice(0, 80).toLowerCase();
  if (!head.startsWith('<?xml') || !xml.includes('<urlset') || head.startsWith('<!doctype') || head.startsWith('<html')) {
    throw new Error('sitemap.xml is not an XML urlset.');
  }
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (locs.length === 0) throw new Error('sitemap.xml has no URLs.');
  const bad = locs.filter((loc) => loc !== canonicalOrigin && !loc.startsWith(`${canonicalOrigin}/`));
  if (bad.length) throw new Error(`sitemap.xml has non-canonical URLs: ${bad.slice(0, 5).join(', ')}`);
  if (locs.some((loc) => /\/research(?:\/|$)|\/drafts?(?:\/|$)/i.test(loc))) {
    throw new Error('sitemap.xml lists a research dossier or draft.');
  }
  return locs;
}

function mergeUrlsets(parts) {
  const open = parts[0].match(/^<\?xml[\s\S]*?<urlset[^>]*>/);
  if (!open) throw new Error('Sitemap chunk is missing a urlset.');
  const urls = parts.flatMap((xml) => [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((match) => match[0]));
  if (urls.length === 0) throw new Error('Sitemap chunks have no URLs.');
  return `${open[0]}\n${urls.join('\n')}\n</urlset>\n`;
}
