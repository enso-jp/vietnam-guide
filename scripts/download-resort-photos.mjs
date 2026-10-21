import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'public/photos';
mkdirSync(outDir, { recursive: true });

const jobs = [
  { id: 'interest-resort-living', file: 'JW Marriott Shell Pool Phu Quoc.jpg' },
  { id: 'resort-phu-quoc-jw-marriott', file: 'JW Marriott Shell Pool Phu Quoc.jpg' },
  { id: 'resort-phu-quoc-premier-village', file: 'Premier-village-phu-quoc-resort5-hon-thom.jpg' },
  { id: 'resort-da-nang-intercontinental', file: 'InterContinental-Danang-Sun-Peninsula-Resort-2026-05-03-1.jpg' },
  { id: 'resort-da-nang-hyatt', file: 'Hyatt Regency Danang, Beach View, March 2014.jpg' },
  { id: 'resort-da-nang-pullman', file: 'Pullman Danang Beach Resort - Da Nang, Vietnam - DSC02270.JPG' },
  { id: 'resort-da-nang-furama', file: 'Furama Resort Da Nang pool.jpg' },
  { id: 'resort-hoi-an-victoria', file: 'Victoria Hoi An Beach Resort ^ Spa - panoramio.jpg' },
  { id: 'resort-hoi-an-palm-garden', file: 'DGJ 0998 - Palm Garden Resort (3382643969).jpg' },
  { id: 'resort-nha-trang-vinpearl', file: 'Vinpearl Hotel - Nha Trang.jpg' },
  { id: 'resort-nha-trang-six-senses', file: 'Ninh Van Bay.jpg' },
  { id: 'resort-mui-ne-pandanus', file: 'Pandanus Resort, Mui Ne.jpg' },
  { id: 'resort-mui-ne-asteria', file: 'Asteria Mui Ne.jpg' },
  { id: 'resort-ha-long-paradise-elegance', file: 'Paradise Elegance.jpg' },
  { id: 'phu-quoc-resort-living', file: 'Premier-village-phu-quoc-resort5-hon-thom.jpg' },
  { id: 'nha-trang-resort-living', file: 'Vinpearl Discovery 1 Nha Trang pool swimming villa pool.jpg' },
  { id: 'mui-ne-resort-living', file: 'Asteria Mui Ne.jpg' },
  { id: 'ha-long-resort-living', file: 'Paradise Elegance.jpg' },
  { id: 'hoi-an-resort-living', file: 'Victoria Hoi An Beach Resort ^ Spa - panoramio.jpg' },
  { id: 'da-nang-resort-living', file: 'InterContinental-Danang-Sun-Peninsula-Resort-2026-05-03-2.jpg' },
];

function strip(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

async function fetchMeta(fileTitle) {
  const title = fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`;
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|mime|extmetadata');
  url.searchParams.set('iiurlwidth', '1400');
  url.searchParams.set('format', 'json');
  const response = await fetch(url, {
    headers: { 'User-Agent': 'VietnamGuide/0.1 (travel reference; local build)' },
  });
  if (!response.ok) throw new Error(`meta ${response.status} ${title}`);
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl) throw new Error(`missing thumb ${title}`);
  const meta = info.extmetadata ?? {};
  return {
    thumb: info.thumburl,
    page: info.descriptionurl,
    author: strip(meta.Artist?.value).slice(0, 160),
    license: strip(meta.LicenseShortName?.value),
  };
}

const credits = existsSync(join(outDir, 'credits.json'))
  ? JSON.parse(readFileSync(join(outDir, 'credits.json'), 'utf8'))
  : {};

for (const job of jobs) {
  const dest = join(outDir, `${job.id}.jpg`);
  if (existsSync(dest) && credits[job.id]?.author) {
    console.log('skip', job.id);
    continue;
  }
  const meta = await fetchMeta(job.file);
  let image;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    image = await fetch(meta.thumb, {
      headers: { 'User-Agent': 'VietnamGuide/0.1 (travel reference; local build)' },
    });
    if (image.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 4000));
      continue;
    }
    break;
  }
  if (!image.ok) throw new Error(`image ${image.status} ${job.id}`);
  writeFileSync(dest, Buffer.from(await image.arrayBuffer()));
  credits[job.id] = { author: meta.author, license: meta.license, source: meta.page };
  console.log('saved', job.id);
}

writeFileSync(join(outDir, 'credits.json'), `${JSON.stringify(credits, null, 2)}\n`);
console.log('credits updated');
