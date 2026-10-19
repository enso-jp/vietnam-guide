import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const placesDir = 'src/content/places';
const attractionsDir = 'src/content/attractions';
mkdirSync(attractionsDir, { recursive: true });

function interestsFor(place, attraction) {
  const text = `${attraction.slug} ${attraction.name} ${attraction.summary}`.toLowerCase();
  const tags = [];
  if (/beach|dune|my khe|an bang|long beach|sao beach/.test(text)) tags.push('beaches');
  if (/cave|động|hang múa|hang mua|paradise/.test(text) || attraction.slug.includes('cave')) tags.push('caves');
  if (/pagoda|temple|chùa|đền|po nagar|thien mu|bai dinh|bach ma/.test(text)) tags.push('pagodas');
  if (/market|chợ/.test(text)) tags.push('markets');
  if (/war remnant|tunnel|reunification/.test(text)) tags.push('warHistory');
  if (/rice|terrace|paddy|ta van/.test(text)) tags.push('rice');
  return tags.filter((tag) => (place.interests?.[tag] ?? 0) >= 3);
}

const extracted = [];
for (const name of readdirSync(placesDir).filter((file) => file.endsWith('.json'))) {
  const path = join(placesDir, name);
  const place = JSON.parse(readFileSync(path, 'utf8'));
  for (const attraction of place.attractions || []) {
    const record = {
      slug: attraction.slug,
      placeSlug: place.slug,
      name: attraction.name,
      summary: attraction.summary,
      dots: attraction.dots,
      timeNeeded: attraction.timeNeeded,
      fee: attraction.fee,
      getThere: attraction.getThere,
      interests: interestsFor(place, attraction),
    };
    if (attraction.nameVi) record.nameVi = attraction.nameVi;
    if (attraction.district) record.district = attraction.district;
    writeFileSync(join(attractionsDir, `${place.slug}--${attraction.slug}.json`), `${JSON.stringify(record, null, 2)}\n`);
    extracted.push(record);
  }
  delete place.attractions;
  writeFileSync(path, `${JSON.stringify(place, null, 2)}\n`);
}

const blockOf = {
  'when-to-go': 'tip',
  'e-visa': 'tip',
  money: 'tip',
  'sim-and-wifi': 'tip',
  luggage: 'tip',
  'street-manners': 'tip',
  'eating-manners': 'tip',
  flights: 'travel',
  trains: 'travel',
  buses: 'travel',
  'grab-and-taxis': 'travel',
  motorbikes: 'travel',
  'where-to-stay': 'living',
  taxes: 'tax',
  living: 'living',
};
const guidesDir = 'src/content/guides';
for (const name of readdirSync(guidesDir).filter((file) => file.endsWith('.json'))) {
  const path = join(guidesDir, name);
  const guide = JSON.parse(readFileSync(path, 'utf8'));
  guide.block = blockOf[guide.slug] || guide.block || 'tip';
  writeFileSync(path, `${JSON.stringify(guide, null, 2)}\n`);
}

const tripsDir = 'src/content/itineraries';
for (const name of readdirSync(tripsDir).filter((file) => file.endsWith('.json'))) {
  const path = join(tripsDir, name);
  const trip = JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  for (const stop of trip.stops || []) {
    const match = extracted.find((item) => item.name === stop.name && (!stop.placeSlug || item.placeSlug === stop.placeSlug));
    if (match && stop.attractionSlug !== match.slug) {
      stop.attractionSlug = match.slug;
      changed = true;
    }
  }
  if (changed) writeFileSync(path, `${JSON.stringify(trip, null, 2)}\n`);
}

console.log(`attractions ${extracted.length}`);
