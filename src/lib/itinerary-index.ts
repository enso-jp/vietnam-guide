import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { corridorsNorthToSouth, getPlace, placePath } from './content';
import { photoPath } from './photos';
import type { Itinerary, ItineraryStop } from './types';

/** A card group longer than this shows the rest behind See more. */
export const ITINERARY_CARD_LIMIT = 10;

/** The same order the header already uses for featured trips. */
const tripRank = ['best-14-days', 'north-7-days', 'central-5-days', 'south-5-days'];

export function compareItineraryTitle<T extends { slug: string; title: string }>(a: T, b: T): number {
  const ai = tripRank.indexOf(a.slug);
  const bi = tripRank.indexOf(b.slug);
  return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.title.localeCompare(b.title);
}

function stopPhoto(stop: ItineraryStop): string {
  if (stop.attractionSlug && stop.placeSlug) return `${stop.placeSlug}-${stop.attractionSlug}`;
  if (stop.dishSlug) return stop.dishSlug;
  return stop.placeSlug || '';
}

export function itineraryCardSrc(trip: Itinerary): string | undefined {
  const ids = [
    trip.photo || '',
    trip.days?.find((day) => day.photo)?.photo || '',
    ...(trip.stops ?? []).map(stopPhoto),
    trip.placeSlug || '',
    trip.days?.find((day) => day.placeSlug)?.placeSlug || '',
  ].filter(Boolean);
  for (const id of ids) {
    const src = photoPath(id);
    if (src) return src;
  }
  return undefined;
}

export interface ItineraryCardModel {
  href: string;
  slug: string;
  title: string;
  duration: string;
  src?: string;
}

export function itineraryCard(trip: Itinerary): ItineraryCardModel {
  return {
    href: `/itineraries/${trip.slug}`,
    slug: trip.slug,
    title: trip.title,
    duration: trip.duration,
    src: itineraryCardSrc(trip),
  };
}

export interface ItineraryPlaceGroup {
  slug: string;
  name: string;
  href?: string;
  day: Itinerary[];
  half: Itinerary[];
}

export interface ItineraryCorridorGroup {
  slug: string;
  name: string;
  trips: Itinerary[];
}

export function groupItineraries(trips: Itinerary[]) {
  const sort = (items: Itinerary[]) => [...items].sort(compareItineraryTitle);
  const nationwide = sort(trips.filter((trip) => trip.level === 'nationwide'));
  const regional = sort(trips.filter((trip) => trip.level === 'region'));
  const corridors: ItineraryCorridorGroup[] = corridorsNorthToSouth()
    .map((corridor) => ({
      slug: corridor.slug,
      name: corridor.name,
      trips: regional.filter((trip) => trip.corridor === corridor.slug),
    }))
    .filter((group) => group.trips.length > 0);
  const regionalLoose = regional.filter((trip) => !trip.corridor);
  const placeMap = new Map<string, ItineraryPlaceGroup>();
  for (const trip of trips) {
    if (trip.level !== 'day' && trip.level !== 'half-day') continue;
    const slug = trip.placeSlug || '';
    let group = placeMap.get(slug);
    if (!group) {
      const place = slug ? getPlace(slug) : undefined;
      group = {
        slug,
        name: place?.name || '',
        href: place ? `${placePath(place)}#itineraries` : undefined,
        day: [],
        half: [],
      };
      placeMap.set(slug, group);
    }
    if (trip.level === 'day') group.day.push(trip);
    else group.half.push(trip);
  }
  for (const group of placeMap.values()) {
    group.day.sort(compareItineraryTitle);
    group.half.sort(compareItineraryTitle);
  }
  const places = [...placeMap.values()].filter((group) => group.name).sort((a, b) => a.name.localeCompare(b.name));
  return { nationwide, corridors, regionalLoose, places };
}

/** Place cards on the index, in the owner’s order. Names come from the place records. */
export const LOCAL_INDEX_PLACES = [
  'ho-chi-minh-city',
  'hanoi',
  'da-nang',
  'hue',
  'nha-trang',
  'hoi-an',
  'sapa',
  'ha-giang',
  'ninh-binh',
  'quy-nhon',
] as const;

/**
 * When a corridor has no “Best of …” record and is not in the menu rank,
 * use this existing overview trip instead of the longest themed one.
 */
const REGION_OVERVIEW: Record<string, string> = {
  'northern-midlands': 'northwest-loop-8-days',
  southeast: 'southeast-4-days',
  'mekong-delta': 'mekong-5-days',
};

/** Photos that were repeating across cards. A place card may still use its own. */
const REPEATED_SUBJECTS = new Set([
  'hanoi-hoan-kiem',
  'hai-phong',
  'hai-phong-opera-house',
  'hai-phong-opera-house-2',
]);

export interface IndexCard {
  href: string;
  slug: string;
  title: string;
  duration?: string;
  src?: string;
}

export interface DurationChoice {
  daysCount: number;
  label: string;
}

type Credit = { author?: string; license?: string };

let creditFile: Record<string, Credit> | undefined;

function photoCredits(): Record<string, Credit> {
  if (!creditFile) {
    const path = join(process.cwd(), 'public', 'photos', 'credits.json');
    creditFile = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) as Record<string, Credit> : {};
  }
  return creditFile;
}

function photoHash(id: string): string | undefined {
  const file = join(process.cwd(), 'public', 'photos', `${id}.jpg`);
  if (!existsSync(file)) return undefined;
  return createHash('md5').update(readFileSync(file)).digest('hex');
}

function claimPhoto(ids: string[], usedIds: Set<string>, usedHashes: Set<string>): string | undefined {
  for (const id of ids) {
    if (!id || usedIds.has(id)) continue;
    const credit = photoCredits()[id];
    if (!credit?.author?.trim() || !credit.license?.trim()) continue;
    const src = photoPath(id);
    const hash = photoHash(id);
    if (!src || !hash || usedHashes.has(hash)) continue;
    usedIds.add(id);
    usedHashes.add(hash);
    return src;
  }
  return undefined;
}

function tripPhotoIds(trip: Itinerary, skip: Set<string>): string[] {
  const sights: string[] = [];
  const places: string[] = [];
  const push = (id?: string) => {
    if (!id || skip.has(id)) return;
    if (getPlace(id)) places.push(id);
    else sights.push(id);
  };
  push(trip.photo);
  for (const day of trip.days ?? []) push(day.photo);
  for (const stop of trip.stops ?? []) {
    if (stop.attractionSlug && stop.placeSlug) push(`${stop.placeSlug}-${stop.attractionSlug}`);
    if (stop.dishSlug) push(stop.dishSlug);
  }
  for (const day of trip.days ?? []) push(day.placeSlug);
  push(trip.placeSlug);
  return [...sights, ...places];
}

function featuredNationwide(trips: Itinerary[]): Itinerary[] {
  return trips
    .filter((trip) => trip.level === 'nationwide' && trip.title.startsWith('Best of Vietnam'))
    .sort(compareItineraryTitle)
    .slice(0, 2);
}

function featuredRegional(trips: Itinerary[], corridor: string): Itinerary | undefined {
  const inCorridor = trips.filter((trip) => trip.level === 'region' && trip.corridor === corridor);
  const titled = inCorridor.filter((trip) => trip.title.startsWith('Best of ')).sort(compareItineraryTitle);
  if (titled[0]) return titled[0];
  const ranked = inCorridor.filter((trip) => tripRank.includes(trip.slug)).sort(compareItineraryTitle);
  if (ranked[0]) return ranked[0];
  const overview = inCorridor.find((trip) => trip.slug === REGION_OVERVIEW[corridor]);
  if (overview) return overview;
  return [...inCorridor].sort((a, b) => (b.daysCount ?? 0) - (a.daysCount ?? 0) || a.title.localeCompare(b.title))[0];
}

export function durationChoices(trips: Itinerary[]): DurationChoice[] {
  const seen = new Map<number, string>();
  for (const trip of [...trips].filter((item) => item.daysCount != null && item.duration).sort(compareItineraryTitle)) {
    if (!seen.has(trip.daysCount!)) seen.set(trip.daysCount!, trip.duration);
  }
  return [...seen.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([daysCount, label]) => ({ daysCount, label }));
}

export function buildItineraryIndex(trips: Itinerary[]) {
  const usedIds = new Set<string>();
  const usedHashes = new Set<string>();
  const nationwide = featuredNationwide(trips).map((trip) => ({
    href: `/itineraries/${trip.slug}`,
    slug: trip.slug,
    title: trip.title,
    duration: trip.duration,
    src: claimPhoto(tripPhotoIds(trip, REPEATED_SUBJECTS), usedIds, usedHashes),
  }));
  const regional = corridorsNorthToSouth().flatMap((corridor) => {
    const trip = featuredRegional(trips, corridor.slug);
    if (!trip) return [];
    return [{
      href: `/itineraries/${trip.slug}`,
      slug: trip.slug,
      title: trip.title,
      duration: trip.duration,
      src: claimPhoto(tripPhotoIds(trip, REPEATED_SUBJECTS), usedIds, usedHashes),
    }];
  });
  const local = LOCAL_INDEX_PLACES.flatMap((slug) => {
    const place = getPlace(slug);
    if (!place) return [];
    const own = trips.filter((trip) => trip.placeSlug === slug && (trip.level === 'day' || trip.level === 'half-day'));
    const ids = [
      slug,
      ...own.flatMap((trip) => tripPhotoIds(trip, new Set()).filter((id) => id === slug || id.startsWith(`${slug}-`))),
    ];
    return [{
      href: `${placePath(place)}#itineraries`,
      slug,
      title: place.name,
      src: claimPhoto(ids, usedIds, usedHashes),
    }];
  });
  return { nationwide, regional, local };
}
