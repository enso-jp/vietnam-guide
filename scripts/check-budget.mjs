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
  const thirdParty = /<script[^>]+src="https?:/i.test(html.toString());
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

if (failed) process.exit(1);
console.log('Budget ok.');
