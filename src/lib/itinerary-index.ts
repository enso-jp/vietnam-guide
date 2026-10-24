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
