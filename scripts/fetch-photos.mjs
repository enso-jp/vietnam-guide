import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'public/photos';
mkdirSync(outDir, { recursive: true });

const places = readdirSync('src/content/places')
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(join('src/content/places', name), 'utf8')));

const attractions = readdirSync('src/content/attractions')
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(join('src/content/attractions', name), 'utf8')));

const jobs = [];
for (const place of places) {
  jobs.push({ id: place.slug, q: `${place.name} ${place.nameVi} Vietnam` });
}
for (const attraction of attractions) {
  const place = places.find((item) => item.slug === attraction.placeSlug);
  jobs.push({ id: `${attraction.placeSlug}-${attraction.slug}`, q: `${attraction.name} ${place?.name || ''} Vietnam` });
}

const credits = existsSync(join(outDir, 'credits.json'))
  ? JSON.parse(readFileSync(join(outDir, 'credits.json'), 'utf8'))
  : {};

function strip(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

async function findCandidates(query) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrnamespace', '6');
  url.searchParams.set('gsrlimit', '8');
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|mime|extmetadata');
  url.searchParams.set('iiurlwidth', '800');
  url.searchParams.set('format', 'json');
  const response = await fetch(url, {
    headers: { 'User-Agent': 'VietnamGuide/0.1 (travel reference; local build)' },
  });
  if (response.status === 429) {
    const wait = Number(response.headers.get('retry-after') || 20);
    console.log('rate limit, waiting', wait);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    return findCandidates(query);
  }
  if (!response.ok) return [];
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});
  const found = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    const mime = String(info?.mime || '');
    const thumb = String(info?.thumburl || '');
    const title = String(page.title || '');
    if (/marine|soldier|war|military|\.pdf|logo|flag|portrait|document|reincarnation|magazine|newspaper|map of|usmc|infantry/i.test(title)) continue;
    if (!thumb || !(mime.includes('jpeg') || thumb.includes('.jpg'))) continue;
    const meta = info.extmetadata ?? {};
    found.push({
      thumb: info.thumburl,
      page: info.descriptionurl,
      author: strip(meta.Artist?.value).slice(0, 120),
      license: strip(meta.LicenseShortName?.value),
    });
  }
  return found;
}

for (const job of jobs) {
  const file = join(outDir, `${job.id}.jpg`);
  if (existsSync(file)) continue;
  try {
    const candidates = await findCandidates(job.q);
    let saved = false;
    for (const found of candidates) {
      const image = await fetch(found.thumb, {
        headers: { 'User-Agent': 'VietnamGuide/0.1 (travel reference; local build)' },
      });
      if (!image.ok) continue;
      const bytes = Buffer.from(await image.arrayBuffer());
      if (bytes[0] !== 0xff || bytes[1] !== 0xd8) continue;
      if (bytes.length < 8000 || bytes.length > 320000) continue;
      writeFileSync(file, bytes);
      credits[job.id] = { author: found.author, license: found.license, source: found.page };
      console.log('ok', job.id, Math.round(bytes.length / 1024) + 'kb');
      saved = true;
      break;
    }
    if (!saved) console.log('miss', job.id);
  } catch (error) {
    console.log('err', job.id, error.message);
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

writeFileSync(join(outDir, 'credits.json'), JSON.stringify(credits, null, 2));
console.log('photos', Object.keys(credits).length);
