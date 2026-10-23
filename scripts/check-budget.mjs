import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';

const files = ['dist/index.html', 'dist/hanoi/index.html', 'dist/plan/when-to-go/index.html', 'dist/get-there/hanoi-to-sapa/index.html'];
const limit = 80 * 1024;
let failed = false;

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`Missing ${file}`);
    failed = true;
    continue;
  }
  const html = readFileSync(file);
  const size = gzipSync(html).length;
  const thirdParty = [...html.toString().matchAll(/<script[^>]+src="(https?:[^"]+)"/gi)]
    .some((match) => !match[1].startsWith('https://tpwgts.com/content?'));
  console.log(`${file}: ${(size / 1024).toFixed(1)} KB gzip`);
  if (size > limit) {
    console.error(`${file} exceeds 80 KB gzip`);
    failed = true;
  }
  if (thirdParty) {
    console.error(`${file} loads a third-party script`);
    failed = true;
  }
}

const sitemapFile = 'dist/sitemap.xml';
if (!existsSync(sitemapFile)) {
  console.error(`Missing ${sitemapFile}`);
  failed = true;
} else {
  const xml = readFileSync(sitemapFile, 'utf8');
  const head = xml.trimStart().slice(0, 80).toLowerCase();
  const urls = xml.match(/<loc>/g)?.length ?? 0;
  console.log(`${sitemapFile}: ${urls} URLs`);
  if (!head.startsWith('<?xml') || !xml.includes('<urlset') || head.startsWith('<!doctype') || head.startsWith('<html')) {
    console.error(`${sitemapFile} is not an XML urlset`);
    failed = true;
  }
  if (xml.includes('http://vietnam-travelguide.com')) {
    console.error(`${sitemapFile} uses the http host`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Budget ok.');
