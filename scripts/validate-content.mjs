import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function readDir(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(dir, name), 'utf8')));
}

const places = readDir('src/content/places');
const attractions = readDir('src/content/attractions');
const festivals = readDir('src/content/festivals');
const guideRecords = readDir('src/content/guides');
const corridors = new Set(readDir('src/content/corridors').map((item) => item.slug));
const routes = new Set(readDir('src/content/routes').map((item) => item.slug));
const dishes = new Set(readDir('src/content/dishes').map((item) => item.slug));
const foodGuides = readDir('src/content/food');
const guides = new Set(readDir('src/content/guides').map((item) => item.slug));
const trips = new Set(readDir('src/content/itineraries').map((item) => item.slug));
const slugs = new Set();
const errors = [];

for (const place of places) {
  if (slugs.has(place.slug)) errors.push(`Duplicate place slug ${place.slug}`);
  slugs.add(place.slug);
  if (!corridors.has(place.corridor)) errors.push(`${place.slug} corridor missing`);
  if (!place.summary || place.summary.split(/\s+/).length < 25) errors.push(`${place.slug} summary is too short`);
  if (place.dots < 1 || place.dots > 5) errors.push(`${place.slug} dots out of range`);
  for (const slug of place.nearby || []) {
    if (!places.some((item) => item.slug === slug)) errors.push(`${place.slug} nearby ${slug} missing`);
  }
  for (const slug of place.routeSlugs || []) {
    if (!routes.has(slug)) errors.push(`${place.slug} route ${slug} missing`);
  }
  for (const slug of place.dishSlugs || []) {
    if (!dishes.has(slug)) errors.push(`${place.slug} dish ${slug} missing`);
  }
  for (const slug of place.itinerarySlugs || []) {
    if (!trips.has(slug)) errors.push(`${place.slug} itinerary ${slug} missing`);
  }
  if (place.parent && !places.some((item) => item.slug === place.parent)) errors.push(`${place.slug} parent missing`);
  if (!place.intro?.length) errors.push(`${place.slug} intro missing`);
  for (const card of place.interestCards || []) {
    if (!card.title || !card.summary) errors.push(`${place.slug} interest card is missing a title or summary`);
    if (!card.attractionSlug && !card.dishSlug && !card.placeSlug && card.to !== 'food') errors.push(`${place.slug} interest card ${card.title || ''} has no link`);
    if (card.attractionSlug && !attractions.some((item) => item.slug === card.attractionSlug && item.placeSlug === place.slug)) {
      errors.push(`${place.slug} interest card attraction ${card.attractionSlug} missing`);
    }
    if (card.dishSlug && !dishes.has(card.dishSlug)) errors.push(`${place.slug} interest card dish ${card.dishSlug} missing`);
    if (card.placeSlug && !places.some((item) => item.slug === card.placeSlug)) errors.push(`${place.slug} interest card place ${card.placeSlug} missing`);
  }
}

if (!guides.has('e-visa') || !guides.has('when-to-go')) errors.push('Core practical guides missing');
for (const guide of foodGuides) {
  if (dishes.has(guide.slug)) errors.push(`food guide slug collides with a dish: ${guide.slug}`);
}
for (const place of places) {
  if (dishes.has(place.slug)) errors.push(`place slug collides with a dish: ${place.slug}`);
}

const seenAttractions = new Set();
for (const attraction of attractions) {
  const key = `${attraction.placeSlug}/${attraction.slug}`;
  if (seenAttractions.has(key)) errors.push(`Duplicate attraction ${key}`);
  seenAttractions.add(key);
  if (!places.some((place) => place.slug === attraction.placeSlug)) errors.push(`${key} place missing`);
  if (!attraction.summary) errors.push(`${key} summary missing`);
  if (attraction.dots < 1 || attraction.dots > 5) errors.push(`${key} dots out of range`);
}
for (const festival of festivals) {
  for (const slug of festival.placeSlugs || []) {
    if (!places.some((place) => place.slug === slug)) errors.push(`${festival.slug} place ${slug} missing`);
  }
}
for (const guide of guideRecords) {
  if (!['tip', 'travel', 'tax', 'living'].includes(guide.block)) errors.push(`${guide.slug} block missing`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content ok: ${places.length} places, ${attractions.length} attractions, ${festivals.length} festivals, ${routes.size} routes, ${dishes.size} dishes, ${guides.size} guides.`);
