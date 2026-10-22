import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function words(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length;
}

function readDir(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(dir, name), 'utf8')));
}

const places = readDir('src/content/places');
const attractions = readDir('src/content/attractions');
const festivals = readDir('src/content/festivals');
const guideRecords = readDir('src/content/guides');
const resortDir = 'src/content/resort-living';
const resortRecords = existsSync(resortDir) ? readDir(resortDir) : [];
const resortSlugs = new Set(resortRecords.map((item) => item.slug));
const corridors = new Set(readDir('src/content/corridors').map((item) => item.slug));
const routes = new Set(readDir('src/content/routes').map((item) => item.slug));
const dishes = new Set(readDir('src/content/dishes').map((item) => item.slug));
const foodGuides = readDir('src/content/food');
const guides = new Set(readDir('src/content/guides').map((item) => item.slug));
const itineraries = readDir('src/content/itineraries');
const trips = new Set(itineraries.map((item) => item.slug));
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
  const checkInterestCard = (card) => {
    if (!card.title || !card.summary) errors.push(`${place.slug} interest card is missing a title or summary`);
    if (!card.attractionSlug && !card.dishSlug && !card.placeSlug && card.to !== 'food' && card.to !== 'resortLiving') {
      errors.push(`${place.slug} interest card ${card.title || ''} has no link`);
    }
    if (card.attractionSlug && !attractions.some((item) => item.slug === card.attractionSlug && item.placeSlug === place.slug)) {
      errors.push(`${place.slug} interest card attraction ${card.attractionSlug} missing`);
    }
    if (card.dishSlug && !dishes.has(card.dishSlug)) errors.push(`${place.slug} interest card dish ${card.dishSlug} missing`);
    if (card.placeSlug && !places.some((item) => item.slug === card.placeSlug)) errors.push(`${place.slug} interest card place ${card.placeSlug} missing`);
  };
  for (const card of place.interestCards || []) checkInterestCard(card);
  for (const group of place.interestGroups || []) {
    if (!group.title || !String(group.title).trim()) errors.push(`${place.slug} interest group is missing a title`);
    if (!Array.isArray(group.cards) || group.cards.length === 0) {
      errors.push(`${place.slug} interest group ${group.title || ''} has no cards`);
    }
    if (group.body && (!Array.isArray(group.body) || group.body.some((line) => typeof line !== 'string' || !line.trim()))) {
      errors.push(`${place.slug} interest group ${group.title || ''} has an empty paragraph`);
    }
    const blockIds = new Set();
    for (const block of group.blocks || []) {
      if (!block.id || !block.heading) errors.push(`${place.slug} interest block in ${group.title || ''} is missing an id or heading`);
      else if (blockIds.has(block.id)) errors.push(`${place.slug} interest block ${block.id} is duplicated in ${group.title || ''}`);
      else blockIds.add(block.id);
      if (block.paragraphs && (!Array.isArray(block.paragraphs) || block.paragraphs.some((line) => typeof line !== 'string' || !line.trim()))) {
        errors.push(`${place.slug} interest block ${block.id || ''} has an empty paragraph`);
      }
    }
    for (const card of group.cards || []) {
      checkInterestCard(card);
      if (card.block && !blockIds.has(card.block)) {
        errors.push(`${place.slug} interest card ${card.title || ''} block ${card.block} missing`);
      }
    }
  }
}

if (!guides.has('e-visa') || !guides.has('when-to-go')) errors.push('Core practical guides missing');
const foodRoles = new Set(['regional', 'international', 'casual', 'fine', 'themed', 'breakfast']);
for (const guide of foodGuides) {
  if (dishes.has(guide.slug)) errors.push(`food guide slug collides with a dish: ${guide.slug}`);
  for (const slug of guide.dishSlugs || []) {
    if (!dishes.has(slug)) errors.push(`${guide.slug} dish ${slug} missing`);
  }
  for (const section of guide.sections || []) {
    if (section.role && !foodRoles.has(section.role)) errors.push(`${guide.slug} section ${section.id} role ${section.role} is not a food-guide slot`);
    for (const slug of section.dishSlugs || []) {
      if (!dishes.has(slug)) errors.push(`${guide.slug} section ${section.id} dish ${slug} missing`);
    }
    for (const spot of section.spots || []) {
      if (!spot.name || !spot.note) errors.push(`${guide.slug} spot is missing a name or note`);
      if (spot.dishSlug && !dishes.has(spot.dishSlug)) errors.push(`${guide.slug} spot ${spot.name} dish ${spot.dishSlug} missing`);
    }
  }
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
  const finished = Array.isArray(attraction.body) && attraction.body.length > 0;
  if (!finished) continue;
  if (words(attraction.summary) < 25 || words(attraction.summary) > 80) errors.push(`${key} summary should stay a lede of 25–80 words`);
  if (!attraction.kicker || words(attraction.kicker) > 14) errors.push(`${key} kicker missing or longer than one line`);
  if (!attraction.heroCaption) errors.push(`${key} hero caption missing`);
  if (!attraction.verified) errors.push(`${key} verified date missing`);
  if (attraction.body.length < 2) errors.push(`${key} body needs at least two paragraphs`);
  if (!attraction.gettingThere?.length) errors.push(`${key} getting there missing`);
  if (!attraction.hours && !attraction.closed) errors.push(`${key} hours or closed missing`);
  const heroFile = join('public', 'photos', `${attraction.placeSlug}-${attraction.slug}.jpg`);
  if (!existsSync(heroFile)) errors.push(`${key} hero photo missing`);
  if (!attraction.figures?.length) errors.push(`${key} second photo missing`);
  for (const figure of attraction.figures || []) {
    if (!figure.id || !figure.caption) errors.push(`${key} figure needs an id and a caption`);
    if (figure.id === `${attraction.placeSlug}-${attraction.slug}`) errors.push(`${key} figure repeats the hero`);
    if (figure.id && !existsSync(join('public', 'photos', `${figure.id}.jpg`))) errors.push(`${key} figure ${figure.id} file missing`);
  }
  for (const leg of attraction.legs || []) {
    if (!leg.heading || !leg.body) errors.push(`${key} leg is incomplete`);
  }
  if (attraction.notice && (!attraction.notice.title || !attraction.notice.body)) errors.push(`${key} notice is incomplete`);
  for (const link of attraction.links || []) {
    if (!link.label || !/^https:\/\//.test(link.url || '')) errors.push(`${key} link needs a label and an https URL`);
  }
  const hasLat = attraction.lat != null;
  const hasLng = attraction.lng != null;
  if (hasLat !== hasLng) errors.push(`${key} map needs both lat and lng`);
}
for (const festival of festivals) {
  for (const slug of festival.placeSlugs || []) {
    if (!places.some((place) => place.slug === slug)) errors.push(`${festival.slug} place ${slug} missing`);
  }
}
for (const guide of guideRecords) {
  if (!['tip', 'travel', 'tax', 'living'].includes(guide.block)) errors.push(`${guide.slug} block missing`);
}
const resortPlaces = new Set(['phu-quoc', 'nha-trang', 'mui-ne', 'da-nang', 'hoi-an', 'ha-long']);
for (const showcase of resortRecords) {
  if (!resortPlaces.has(showcase.slug)) errors.push(`resort-living ${showcase.slug} is not an allowed leisure place`);
  if (showcase.slug !== showcase.placeSlug) errors.push(`resort-living ${showcase.slug} placeSlug mismatch`);
  if (!showcase.summary || !showcase.seoTitle || !showcase.seoDescription) errors.push(`resort-living ${showcase.slug} summary or SEO missing`);
  if (!Array.isArray(showcase.body) || showcase.body.length < 1) errors.push(`resort-living ${showcase.slug} body missing`);
  if (!Array.isArray(showcase.properties) || showcase.properties.length < 1) errors.push(`resort-living ${showcase.slug} has no properties`);
  for (const property of showcase.properties || []) {
    if (!property.name || !property.summary || !property.photo) errors.push(`resort-living ${showcase.slug} property incomplete`);
    if (!existsSync(join('public', 'photos', `${property.photo}.jpg`))) errors.push(`resort-living ${showcase.slug} photo ${property.photo} missing`);
    if (!Array.isArray(property.sources) || property.sources.length < 1) errors.push(`resort-living ${showcase.slug} property ${property.name || ''} needs a source`);
    for (const source of property.sources || []) {
      if (!source.label || !/^https:\/\//.test(source.url || '')) errors.push(`resort-living ${showcase.slug} source needs label and https URL`);
    }
  }
}
for (const slug of resortPlaces) {
  if (!resortSlugs.has(slug)) errors.push(`resort-living ${slug} showcase missing`);
  const place = places.find((item) => item.slug === slug);
  if (place && (place.interests?.resortLiving ?? 0) < 3) errors.push(`${slug} resortLiving weight missing`);
}

const placeSlugs = new Set(places.map((place) => place.slug));
const attractionPairs = new Set(attractions.map((item) => `${item.placeSlug}/${item.slug}`));
const itineraryBySlug = new Map(itineraries.map((item) => [item.slug, item]));
const LEVELS = new Set(['nationwide', 'region', 'day', 'half-day']);
const GATEWAYS = new Set(['hanoi', 'ho-chi-minh-city', 'da-nang', 'open-jaw']);
const DIRECTIONS = new Set(['north-to-south', 'south-to-north', 'out-of-da-nang']);
const APPROACH_MODES = new Set(['walk', 'bicycle', 'grab', 'taxi', 'boat', 'bus']);
const NATIONWIDE_DAYS = new Set([10, 14, 18, 21]);
const REGION_DAYS = {
  'northern-midlands': new Set([5, 7, 9]),
  'red-river-delta': new Set([5, 7, 9]),
  'north-central': new Set([4, 5, 7]),
  'south-central-highlands': new Set([4, 5, 7]),
  southeast: new Set([4]),
  'mekong-delta': new Set([4, 5]),
};
// south-5-days spans three corridors until the split records exist.
const REGION_CHOOSER = 'south-5-days';
const seenNationwide = new Map();
const seenRegion = new Map();

for (const trip of itineraries) {
  const slug = trip.slug;
  if (!LEVELS.has(trip.level)) errors.push(`${slug} level missing`);
  if (trip.gateway != null && !GATEWAYS.has(trip.gateway)) errors.push(`${slug} gateway ${trip.gateway} missing`);
  if (trip.direction != null && !DIRECTIONS.has(trip.direction)) errors.push(`${slug} direction ${trip.direction} missing`);

  if (trip.level === 'nationwide') {
    if (!GATEWAYS.has(trip.gateway)) errors.push(`${slug} gateway missing`);
    if (!DIRECTIONS.has(trip.direction)) errors.push(`${slug} direction missing`);
    if (!NATIONWIDE_DAYS.has(trip.daysCount)) errors.push(`${slug} daysCount ${trip.daysCount} does not fit nationwide`);
    else if (GATEWAYS.has(trip.gateway) && DIRECTIONS.has(trip.direction)) {
      const key = `${trip.gateway}|${trip.direction}|${trip.daysCount}`;
      if (seenNationwide.has(key)) errors.push(`${slug} nationwide key already used by ${seenNationwide.get(key)}`);
      else seenNationwide.set(key, slug);
    }
  }

  if (trip.level === 'region') {
    if (slug === REGION_CHOOSER) {
      if (trip.corridor) errors.push(`${slug} chooser does not use one corridor`);
      if (trip.daysCount !== 5) errors.push(`${slug} daysCount ${trip.daysCount} does not fit the south chooser`);
    } else if (!corridors.has(trip.corridor)) {
      errors.push(`${slug} corridor ${trip.corridor || ''} missing`);
    } else if (!REGION_DAYS[trip.corridor]?.has(trip.daysCount)) {
      errors.push(`${slug} daysCount ${trip.daysCount} does not fit ${trip.corridor}`);
    } else {
      const key = `${trip.corridor}|${trip.daysCount}|${trip.variant || ''}`;
      if (seenRegion.has(key)) errors.push(`${slug} region key already used by ${seenRegion.get(key)}`);
      else seenRegion.set(key, slug);
    }
  }

  if (trip.level === 'day') {
    if (trip.spanDays !== 1 && trip.spanDays !== 2) errors.push(`${slug} spanDays must be 1 or 2`);
    if (trip.daysCount != null && trip.daysCount !== trip.spanDays) errors.push(`${slug} daysCount ${trip.daysCount} does not fit a day`);
  }

  if (trip.level === 'half-day' && trip.daysCount != null) errors.push(`${slug} half-day omits daysCount`);

  if (trip.level === 'day' || trip.level === 'half-day') {
    if (!placeSlugs.has(trip.placeSlug)) errors.push(`${slug} place ${trip.placeSlug || ''} missing`);
  } else if (trip.placeSlug && !placeSlugs.has(trip.placeSlug)) {
    errors.push(`${slug} place ${trip.placeSlug} missing`);
  }

  if (trip.level !== 'region' && trip.corridor && !corridors.has(trip.corridor)) {
    errors.push(`${slug} corridor ${trip.corridor} missing`);
  }

  for (const routeSlug of trip.routeSlugs || []) {
    if (!routes.has(routeSlug)) errors.push(`${slug} route ${routeSlug} missing`);
  }

  for (const day of trip.days || []) {
    if (day.placeSlug && !placeSlugs.has(day.placeSlug)) errors.push(`${slug} day place ${day.placeSlug} missing`);
    if (day.routeSlug && !routes.has(day.routeSlug)) errors.push(`${slug} day route ${day.routeSlug} missing`);
    if (day.itinerarySlug) {
      const linked = itineraryBySlug.get(day.itinerarySlug);
      if (!linked) errors.push(`${slug} day itinerary ${day.itinerarySlug} missing`);
      else if (linked.level !== 'day' && linked.level !== 'half-day') {
        errors.push(`${slug} day itinerary ${day.itinerarySlug} is not a day or half-day`);
      }
    }
  }

  for (const stop of trip.stops || []) {
    if (stop.placeSlug && !placeSlugs.has(stop.placeSlug)) errors.push(`${slug} stop ${stop.name} place ${stop.placeSlug} missing`);
    if (stop.attractionSlug) {
      if (!stop.placeSlug) errors.push(`${slug} stop ${stop.name} attraction needs a place`);
      else if (!attractionPairs.has(`${stop.placeSlug}/${stop.attractionSlug}`)) {
        errors.push(`${slug} stop ${stop.name} attraction ${stop.placeSlug}/${stop.attractionSlug} missing`);
      }
    }
    if (stop.dishSlug && !dishes.has(stop.dishSlug)) errors.push(`${slug} stop ${stop.name} dish ${stop.dishSlug} missing`);
    if (stop.approach) {
      if (!APPROACH_MODES.has(stop.approach.mode)) errors.push(`${slug} stop ${stop.name} approach missing`);
      if (!stop.approach.note) errors.push(`${slug} stop ${stop.name} approach note missing`);
      if (stop.approach.fee != null || stop.approach.price != null) errors.push(`${slug} stop ${stop.name} approach has a fee`);
    }
  }
}

const posts = existsSync('src/content/blog') ? readDir('src/content/blog') : [];
const front = existsSync('src/content/front-page.json')
  ? JSON.parse(readFileSync('src/content/front-page.json', 'utf8'))
  : { date: '', slugs: [] };
const interestPhotos = existsSync('src/content/interest-photos.json')
  ? JSON.parse(readFileSync('src/content/interest-photos.json', 'utf8'))
  : {};
const credits = existsSync('public/photos/credits.json')
  ? JSON.parse(readFileSync('public/photos/credits.json', 'utf8'))
  : {};
const postSlugs = new Set();
const postPhotos = new Set();
for (const post of posts) {
  if (postSlugs.has(post.slug)) errors.push(`Duplicate post ${post.slug}`);
  postSlugs.add(post.slug);
  if (!post.title || !post.kicker || !post.summary || !post.when) errors.push(`${post.slug} is missing a title, kicker, summary, or when`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.published || '')) errors.push(`${post.slug} published date missing`);
  if (!Array.isArray(post.body) || post.body.length < 2) errors.push(`${post.slug} body needs at least two paragraphs`);
  if (!Array.isArray(post.sources) || post.sources.length < 1) errors.push(`${post.slug} needs a source`);
  for (const source of post.sources || []) {
    if (!source.label || !/^https:\/\//.test(source.url || '')) errors.push(`${post.slug} source needs a label and an https URL`);
  }
  if (!post.photo) errors.push(`${post.slug} photo missing`);
  else if (postPhotos.has(post.photo)) errors.push(`${post.slug} reuses photo ${post.photo}`);
  else postPhotos.add(post.photo);
  if (post.photo && !existsSync(join('public', 'photos', `${post.photo}.jpg`))) errors.push(`${post.slug} photo file missing`);
  if (post.photo && !credits[post.photo]?.author) errors.push(`${post.slug} photo credit missing`);
  for (const slug of post.placeSlugs || []) {
    if (!places.some((place) => place.slug === slug)) errors.push(`${post.slug} place ${slug} missing`);
  }
  if (post.festivalSlug && !festivals.some((festival) => festival.slug === post.festivalSlug)) {
    errors.push(`${post.slug} festival ${post.festivalSlug} missing`);
  }
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(front.date || '')) errors.push('front page date missing');
const seenFront = new Set();
for (const slug of front.slugs || []) {
  if (seenFront.has(slug)) errors.push(`front page repeats ${slug}`);
  seenFront.add(slug);
  if (!postSlugs.has(slug)) errors.push(`front page slug ${slug} missing`);
}
const interestCopyDir = 'src/content/interests';
const interestCopy = existsSync(interestCopyDir) ? readDir(interestCopyDir) : [];
const interestKeys = new Set([
  'food', 'oldTowns', 'pagodas', 'caves', 'beaches', 'islands', 'mountains', 'rice', 'markets',
  'warHistory', 'coffee', 'nightlife', 'family', 'photography', 'motorbike', 'resortLiving',
]);
const seenInterestKeys = new Set();
for (const page of interestCopy) {
  if (!page.key || seenInterestKeys.has(page.key)) errors.push(`interest page ${page.key || '(missing)'} is missing or duplicated`);
  seenInterestKeys.add(page.key);
  if (!interestKeys.has(page.key)) errors.push(`interest page ${page.key} is not a public interest`);
  if (!page.summary || !String(page.summary).trim()) errors.push(`interest page ${page.key} summary missing`);
  if (!Array.isArray(page.body) || page.body.length < 1 || page.body.some((line) => !String(line).trim())) {
    errors.push(`interest page ${page.key} body missing`);
  }
}
for (const key of interestKeys) {
  if (!seenInterestKeys.has(key)) errors.push(`interest page ${key} missing`);
}
const seenInterestPhotos = new Set();
for (const [key, id] of Object.entries(interestPhotos)) {
  if (!id || seenInterestPhotos.has(id)) errors.push(`interest photo ${key} is missing or reused`);
  seenInterestPhotos.add(id);
  if (!existsSync(join('public', 'photos', `${id}.jpg`))) errors.push(`interest photo ${id} file missing`);
  if (!credits[id]?.author) errors.push(`interest photo ${id} credit missing`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content ok: ${places.length} places, ${attractions.length} attractions, ${festivals.length} festivals, ${posts.length} posts, ${routes.size} routes, ${dishes.size} dishes, ${guides.size} guides, ${itineraries.length} itineraries.`);
