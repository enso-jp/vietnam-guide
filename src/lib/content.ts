import type {
  Attraction,
  Corridor,
  Dish,
  Festival,
  FoodGuide,
  Guide,
  Itinerary,
  Place,
  BlogPost,
  FrontPage,
  RiceSite,
  ResortShowcase,
  Route,
  SearchItem,
} from './types';
import { dotLabel, interestHref, interestLabels, tabs } from '../config/site';

function load<T>(modules: Record<string, { default: T }>): T[] {
  return Object.values(modules).map((mod) => mod.default);
}

const placeModules = import.meta.glob('../content/places/*.json', {
  eager: true,
}) as Record<string, { default: Place }>;
const corridorModules = import.meta.glob('../content/corridors/*.json', {
  eager: true,
}) as Record<string, { default: Corridor }>;
const routeModules = import.meta.glob('../content/routes/*.json', {
  eager: true,
}) as Record<string, { default: Route }>;
const dishModules = import.meta.glob('../content/dishes/*.json', {
  eager: true,
}) as Record<string, { default: Dish }>;
const foodModules = import.meta.glob('../content/food/*.json', {
  eager: true,
}) as Record<string, { default: FoodGuide }>;
const resortModules = import.meta.glob('../content/resort-living/*.json', {
  eager: true,
}) as Record<string, { default: ResortShowcase }>;
const guideModules = import.meta.glob('../content/guides/*.json', {
  eager: true,
}) as Record<string, { default: Guide }>;
const itineraryModules = import.meta.glob('../content/itineraries/*.json', {
  eager: true,
}) as Record<string, { default: Itinerary }>;
const riceModules = import.meta.glob('../content/seasons/rice.json', {
  eager: true,
}) as Record<string, { default: { sites: RiceSite[] } }>;
const attractionModules = import.meta.glob('../content/attractions/*.json', {
  eager: true,
}) as Record<string, { default: Attraction }>;
const festivalModules = import.meta.glob('../content/festivals/*.json', {
  eager: true,
}) as Record<string, { default: Festival }>;
const postModules = import.meta.glob('../content/blog/*.json', {
  eager: true,
}) as Record<string, { default: BlogPost }>;
const frontModules = import.meta.glob('../content/front-page.json', {
  eager: true,
}) as Record<string, { default: FrontPage }>;

export function getPlaces(): Place[] {
  return load(placeModules);
}

const corridorOrder = ['northern-vietnam', 'central-coast', 'highlands-coast', 'southeast', 'mekong-delta'];

export function getCorridors(): Corridor[] {
  return load(corridorModules);
}

export function corridorsNorthToSouth(): Corridor[] {
  return [...getCorridors()].sort((a, b) => {
    const ai = corridorOrder.indexOf(a.slug);
    const bi = corridorOrder.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

export function getRoutes(): Route[] {
  return load(routeModules);
}

export function getDishes(): Dish[] {
  return load(dishModules);
}

export function getFoodGuides(): FoodGuide[] {
  return load(foodModules);
}

export function getResortShowcases(): ResortShowcase[] {
  return load(resortModules).sort((a, b) => a.name.localeCompare(b.name));
}

export function getResortShowcase(slug: string): ResortShowcase | undefined {
  return getResortShowcases().find((item) => item.slug === slug);
}

export function getGuides(): Guide[] {
  return load(guideModules);
}

export function getItineraries(): Itinerary[] {
  return load(itineraryModules);
}

export function getRiceSites(): RiceSite[] {
  const file = Object.values(riceModules)[0];
  return file ? file.default.sites : [];
}

export function getAttractions(): Attraction[] {
  return load(attractionModules);
}

export function getFestivals(): Festival[] {
  return load(festivalModules);
}

export function attractionPath(attraction: Attraction): string {
  const place = getPlace(attraction.placeSlug);
  const base = place ? placePath(place) : `/${attraction.placeSlug}`;
  return `${base}/${attraction.slug}`;
}

export function attractionsForPlace(place: Place): Attraction[] {
  const own = getAttractions().filter((item) => item.placeSlug === place.slug);
  const fromChildren = getPlaces()
    .filter((child) => child.parent === place.slug)
    .flatMap((child) =>
      getAttractions()
        .filter((item) => item.placeSlug === child.slug)
        .map((item) => ({ ...item, district: item.district || child.name })),
    );
  return [...own, ...fromChildren];
}

export function festivalsForPlace(place: Place): Festival[] {
  return getFestivals().filter((item) => item.placeSlugs.includes(place.slug));
}

export function attractionsForInterest(key: string): Attraction[] {
  return getAttractions()
    .filter((item) => item.interests.includes(key))
    .sort((a, b) => b.dots - a.dots || a.name.localeCompare(b.name));
}

export function festivalsForInterest(key: string): Festival[] {
  return getFestivals().filter((item) => item.interests.includes(key));
}

export function getPlace(slug: string): Place | undefined {
  return getPlaces().find((place) => place.slug === slug);
}

export function getCorridor(slug: string): Corridor | undefined {
  return getCorridors().find((corridor) => corridor.slug === slug);
}

export function topPlaces(places: Place[], limit = 4): Place[] {
  return [...places].sort(compareRecommended).slice(0, limit);
}

export function compareRecommended(a: Place, b: Place): number {
  if (b.dots !== a.dots) return b.dots - a.dots;
  return a.name.localeCompare(b.name);
}

export function placesInCorridor(corridorSlug: string): Place[] {
  return getPlaces()
    .filter((place) => place.corridor === corridorSlug && !place.parent)
    .sort(compareRecommended);
}

export function itineraryPhoto(trip: Itinerary): string {
  if (trip.photo) return trip.photo;
  const stop = trip.stops?.find((item) => item.attractionSlug && item.placeSlug);
  if (stop?.placeSlug && stop.attractionSlug) return `${stop.placeSlug}-${stop.attractionSlug}`;
  const dish = trip.stops?.find((item) => item.dishSlug);
  if (dish?.dishSlug) return dish.dishSlug;
  return trip.days?.find((item) => item.placeSlug)?.placeSlug || trip.stops?.find((item) => item.placeSlug)?.placeSlug || '';
}

export function cardLine(summary: string): string {
  const sentence = summary.split(/(?<=\.)\s/)[0] ?? summary;
  return sentence.length > 110 ? `${sentence.slice(0, 107).trim()}…` : sentence;
}

export const kindOrder = ['city', 'town', 'area', 'district'] as const;

export const kindLabel: Record<string, string> = {
  city: 'Cities',
  town: 'Towns',
  area: 'Landscapes and islands',
  district: 'Districts',
};

export function groupPlaces(places: Place[]): { kind: string; label: string; places: Place[] }[] {
  return kindOrder
    .map((kind) => ({
      kind,
      label: kindLabel[kind],
      places: places.filter((place) => place.kind === kind),
    }))
    .filter((group) => group.places.length > 0);
}

export function placesForInterest(key: string): Place[] {
  return getPlaces()
    .filter((place) => !place.parent && (place.interests[key] ?? 0) >= 3)
    .sort(compareRecommended);
}

export function attractionsInCorridor(corridorSlug: string): Attraction[] {
  const slugs = new Set(
    getPlaces()
      .filter((place) => {
        if (place.corridor === corridorSlug) return true;
        const parent = place.parent ? getPlace(place.parent) : undefined;
        return parent?.corridor === corridorSlug;
      })
      .map((place) => place.slug),
  );
  return getAttractions()
    .filter((item) => slugs.has(item.placeSlug))
    .sort((a, b) => b.dots - a.dots || a.name.localeCompare(b.name));
}

export function placesForCityFood(): Place[] {
  const taken = new Set([...getDishes().map((dish) => dish.slug), ...getFoodGuides().map((guide) => guide.slug)]);
  return getPlaces()
    .filter((place) => !taken.has(place.slug) && (place.eat.length > 0 || place.dishSlugs.length > 0))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function englishList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function pageDescription(preferred: string, ...more: string[]): string {
  const parts = [preferred, ...more].map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const source = parts[0] && parts[0].length >= 70 && parts[0].length <= 170 ? parts[0] : parts.join(' ');
  if (source.length <= 170) return source;
  const cut = source.slice(0, 157);
  const stop = cut.lastIndexOf('. ');
  if (stop >= 70) return cut.slice(0, stop + 1);
  const space = cut.lastIndexOf(' ');
  return `${(space >= 70 ? cut.slice(0, space) : cut).trim()}…`;
}

export function interestDescription(key: string): string {
  if (key === 'resortLiving') {
    const places = placesForInterest(key).slice(0, 3).map((place) => place.name);
    const placeBit = places.length ? `Places where a resort stay is part of the trip include ${englishList(places)}.` : '';
    return pageDescription('Resort Living in Vietnam.', 'Named luxury and premium resorts on leisure coasts.', placeBit);
  }
  const label = interestLabels[key] ?? key;
  const places = placesForInterest(key).slice(0, 3).map((place) => place.name);
  const sights = attractionsForInterest(key).slice(0, 3).map((item) => item.name);
  const placeBit = places.length ? `Places tagged for it include ${englishList(places)}.` : '';
  const sightBit = sights.length ? `Sights include ${englishList(sights)}.` : '';
  return pageDescription(`${label} in Vietnam.`, placeBit, sightBit);
}

export function childPlaces(parentSlug: string): Place[] {
  return getPlaces().filter((place) => place.parent === parentSlug);
}

export interface StoryCard {
  href: string;
  title: string;
  kicker: string;
  summary: string;
  when: string;
  photo: string;
  cover: string;
}

export function getPosts(): BlogPost[] {
  return load(postModules).sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getFrontPage(): FrontPage {
  const file = Object.values(frontModules)[0];
  return file?.default ?? { date: '', slugs: [] };
}

export function postCard(post: BlogPost): StoryCard {
  return {
    href: `/blog/${post.slug}`,
    title: post.title,
    kicker: post.kicker,
    summary: post.summary,
    when: post.when,
    photo: post.photo,
    cover: post.cover || 'town',
  };
}

/** Posts chosen for the homepage highlight block, in front-page order. */
export function getHighlights(): StoryCard[] {
  const posts = new Map(getPosts().map((post) => [post.slug, post]));
  return getFrontPage()
    .slugs.map((slug) => posts.get(slug))
    .filter((post): post is BlogPost => Boolean(post))
    .map(postCard);
}

/** Current posts that are not on the highlight list. */
export function getOtherPosts(): StoryCard[] {
  const chosen = new Set(getFrontPage().slugs);
  return getPosts()
    .filter((post) => !chosen.has(post.slug))
    .map(postCard);
}

export function placePath(place: Place, tab = ''): string {
  const base = place.parent ? `/${place.parent}/${place.slug}` : `/${place.slug}`;
  return tab ? `${base}/${tab}` : base;
}

const cityTabLabels: Record<string, string> = {
  intro: 'Intro',
  attractions: 'Attractions',
  interests: 'By interest',
  'get-there': 'Get there',
  itineraries: 'Itineraries',
  stay: 'Hotels',
  eat: 'Restaurants',
};

export function placeTabs(place: Place, hasFestivals = false) {
  if (place.kind === 'district') {
    return [
      { id: 'intro', label: 'Intro', href: '#intro' },
      { id: 'get-there', label: 'Get there', href: '#get-there' },
      { id: 'stay', label: 'Hotels', href: '#stay' },
      { id: 'eat', label: 'Restaurants', href: '#eat' },
      { id: 'attractions', label: 'Experiences', href: '#attractions' },
    ];
  }
  const items = tabs.map((tab) => ({
    id: tab.id,
    label: cityTabLabels[tab.id] ?? tab.label,
    href: `#${tab.id}`,
  }));
  if (hasFestivals) {
    items.push({ id: 'festivals', label: 'Festivals', href: '#festivals' });
  }
  return items;
}

export function interestList(place: Place): { key: string; label: string; weight: number }[] {
  return Object.entries(place.interests)
    .filter(([, weight]) => weight >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([key, weight]) => ({
      key,
      label: interestLabels[key] ?? key,
      weight,
    }));
}

export function dotText(dots: number): string {
  return dotLabel[dots] ?? '';
}

export function relatedPlaces(place: Place): Place[] {
  return place.nearby
    .map((slug) => getPlace(slug))
    .filter((item): item is Place => Boolean(item));
}

export function searchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const place of getPlaces()) {
    items.push({
      title: place.name,
      vi: place.nameVi,
      href: placePath(place),
      group: 'Places',
      text: `${place.name} ${place.nameVi} ${place.summary}`,
    });
  }
  for (const attraction of getAttractions()) {
    const place = getPlace(attraction.placeSlug);
    items.push({
      title: attraction.name,
      vi: attraction.nameVi,
      href: attractionPath(attraction),
      group: 'Attractions',
      text: `${attraction.name} ${place?.name || ''} ${attraction.summary}`,
    });
  }
  for (const festival of getFestivals()) {
    items.push({
      title: festival.name,
      vi: festival.nameVi,
      href: `/festivals/${festival.slug}`,
      group: 'Festivals',
      text: festival.summary,
    });
  }
  for (const route of getRoutes()) {
    items.push({
      title: route.name,
      href: `/get-there/${route.slug}`,
      group: 'Routes',
      text: route.summary,
    });
  }
  for (const dish of getDishes()) {
    items.push({
      title: dish.name,
      vi: dish.nameVi,
      href: `/food/${dish.slug}`,
      group: 'Food',
      text: `${dish.name} ${dish.nameVi} ${dish.summary}`,
    });
  }
  for (const guide of getFoodGuides()) {
    items.push({
      title: guide.name,
      href: `/food/${guide.slug}`,
      group: 'Food',
      text: guide.summary,
    });
  }
  for (const place of placesForCityFood()) {
    items.push({
      title: `${place.name} food`,
      href: `/food/${place.slug}`,
      group: 'Food',
      text: `${place.name} ${place.eat[0] || place.summary}`,
    });
  }
  for (const [key, label] of Object.entries(interestLabels)) {
    if (key === 'food') continue;
    items.push({
      title: label,
      href: interestHref(key),
      group: 'Interests',
      text: interestDescription(key),
    });
  }
  for (const guide of getGuides()) {
    items.push({
      title: guide.title,
      href: `/plan/${guide.slug}`,
      group: 'Practical',
      text: guide.summary,
    });
  }
  for (const trip of getItineraries()) {
    items.push({
      title: trip.title,
      href: `/itineraries/${trip.slug}`,
      group: 'Practical',
      text: trip.summary,
    });
  }
  for (const post of getPosts()) {
    items.push({
      title: post.title,
      href: `/blog/${post.slug}`,
      group: 'Stories',
      text: `${post.title} ${post.summary}`,
    });
  }
  items.push({
    title: 'Stories',
    href: '/blog',
    group: 'Stories',
    text: 'Homepage highlights and other current posts',
  });
  return items;
}
