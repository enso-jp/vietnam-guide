import type { Attraction, Festival, FoodGuide, Place } from './types';
import {
  attractionPath,
  attractionsForInterest,
  cardLine,
  festivalsForInterest,
  getDishes,
  getFoodGuides,
  getPlace,
  getResortShowcase,
  placePath,
  placesForInterest,
} from './content';
import { photoPath } from './photos';

export interface InterestCardModel {
  href: string;
  title: string;
  nameVi?: string;
  line: string;
  photo: string;
  alt: string;
  dots?: number;
  meta?: string;
}

export interface InterestTextLink {
  href: string;
  title: string;
  nameVi?: string;
  line: string;
}

export interface InterestSectionModel {
  id: string;
  heading: string;
  cards: InterestCardModel[];
  text: InterestTextLink[];
  /** Food-guide cards have no editor dots. Place and sight cards use the city card. */
  food?: boolean;
}

/**
 * Place files opened for this pass. The list is the interests that frame actually shows.
 * A photography page may use any real place photo: the subject is the place itself.
 */
const placeSubject: Record<string, string[]> = {
  'ha-giang': ['mountains', 'motorbike', 'photography'],
  'mai-chau': ['rice', 'family', 'photography'],
  'phu-quoc': ['beaches', 'islands', 'photography'],
  'da-nang': ['beaches', 'photography'],
  'cat-ba': ['islands', 'photography'],
  'ha-long': ['islands', 'photography'],
  sapa: ['markets', 'photography'],
  'tam-coc': ['photography'],
  'da-lat': ['photography'],
  hanoi: ['photography'],
  'kon-tum': ['photography'],
  'ho-chi-minh-city': ['photography'],
  'ninh-binh': ['photography'],
};

/** Tagged on the interest, but the file is a different subject. */
const wrongSubject: Record<string, string[]> = {
  'gia-lai-bien-ho-tea': ['coffee'],
  'gia-lai-dai-doan-ket': ['markets'],
  'nha-trang-po-nagar': ['beaches'],
  'dong-hoi-nhat-le-river': ['beaches'],
  'hanoi-hoan-kiem': ['pagodas'],
  'hanoi-west-lake': ['pagodas'],
};

function sightId(attraction: Attraction): string {
  return `${attraction.placeSlug}-${attraction.slug}`;
}

function sightUsable(attraction: Attraction, key: string): boolean {
  if ((wrongSubject[sightId(attraction)] || []).includes(key)) return false;
  return Boolean(photoPath(sightId(attraction)));
}

function placeFrame(place: Place, key: string, sights: Attraction[]): { id: string; line: string; alt: string } | null {
  const top = sights.find((item) => sightUsable(item, key));
  if (top) return { id: sightId(top), line: cardLine(top.summary), alt: top.name };
  const allowed = (placeSubject[place.slug] || []).includes(key);
  if (allowed && photoPath(place.slug)) return { id: place.slug, line: cardLine(place.summary), alt: place.name };
  return null;
}

function textPlace(place: Place): InterestTextLink {
  return { href: placePath(place), title: place.name, line: cardLine(place.summary) };
}

function textSight(attraction: Attraction): InterestTextLink {
  const home = getPlace(attraction.placeSlug);
  return {
    href: attractionPath(attraction),
    title: attraction.name,
    nameVi: attraction.nameVi,
    line: home ? `${home.name}. ${cardLine(attraction.summary)}` : cardLine(attraction.summary),
  };
}

function festivalFrame(festival: Festival): string {
  if (!festival.photo || getPlace(festival.photo)) return '';
  return photoPath(festival.photo) ? festival.photo : '';
}

function guideFrame(guide: FoodGuide): { id: string; alt: string } | null {
  if (guide.heroSlug && guide.heroSlug !== guide.placeSlug && photoPath(guide.heroSlug)) {
    return { id: guide.heroSlug, alt: guide.name };
  }
  const summary = guide.summary.toLowerCase();
  for (const slug of guide.dishSlugs) {
    const dish = getDishes().find((item) => item.slug === slug);
    if (!dish || !photoPath(dish.slug)) continue;
    const named = dish.name.toLowerCase().split(/\s+/).some((word) => word.length > 3 && summary.includes(word));
    if (named) return { id: dish.slug, alt: dish.name };
  }
  return null;
}

function placeSection(key: string): InterestSectionModel {
  const places = placesForInterest(key);
  const sights = attractionsForInterest(key);
  const cards: InterestCardModel[] = [];
  const text: InterestTextLink[] = [];
  const used = new Set<string>();
  for (const place of places) {
    const here = sights.filter((item) => item.placeSlug === place.slug);
    const frame = placeFrame(place, key, here);
    if (!frame) {
      text.push(textPlace(place));
      continue;
    }
    used.add(frame.id);
    cards.push({
      href: placePath(place),
      title: place.name,
      line: frame.line,
      photo: frame.id,
      alt: frame.alt,
      dots: place.dots,
    });
  }
  return { id: 'places', heading: 'Places', cards, text, food: false };
}

function sightSection(key: string, usedPlacePhotos: Set<string>): InterestSectionModel {
  const cards: InterestCardModel[] = [];
  const text: InterestTextLink[] = [];
  for (const attraction of attractionsForInterest(key)) {
    const id = sightId(attraction);
    if ((wrongSubject[id] || []).includes(key)) {
      text.push(textSight(attraction));
      continue;
    }
    if (!photoPath(id)) {
      text.push(textSight(attraction));
      continue;
    }
    if (usedPlacePhotos.has(id)) continue;
    const home = getPlace(attraction.placeSlug);
    cards.push({
      href: attractionPath(attraction),
      title: attraction.name,
      nameVi: attraction.nameVi,
      line: cardLine(attraction.summary),
      photo: id,
      alt: attraction.name,
      dots: attraction.dots,
      meta: home ? home.name : '',
    });
  }
  return { id: 'sights', heading: 'Sights', cards, text };
}

function festivalSection(key: string): InterestSectionModel {
  const cards: InterestCardModel[] = [];
  const text: InterestTextLink[] = [];
  for (const festival of festivalsForInterest(key)) {
    const photo = festivalFrame(festival);
    if (!photo) {
      text.push({
        href: `/festivals/${festival.slug}`,
        title: festival.name,
        nameVi: festival.nameVi,
        line: cardLine(festival.summary),
      });
      continue;
    }
    cards.push({
      href: `/festivals/${festival.slug}`,
      title: festival.name,
      nameVi: festival.nameVi,
      line: cardLine(festival.summary),
      photo,
      alt: festival.name,
      meta: festival.when,
    });
  }
  return { id: 'festivals', heading: 'Festivals', cards, text };
}

function foodSection(): InterestSectionModel {
  const cards: InterestCardModel[] = [];
  const text: InterestTextLink[] = [];
  for (const guide of getFoodGuides()) {
    const frame = guideFrame(guide);
    if (!frame) {
      text.push({ href: `/food/${guide.slug}`, title: guide.name, line: cardLine(guide.summary) });
      continue;
    }
    cards.push({
      href: `/food/${guide.slug}`,
      title: guide.name,
      line: cardLine(guide.summary),
      photo: frame.id,
      alt: frame.alt,
    });
  }
  return { id: 'guides', heading: 'Food guides', cards, text, food: true };
}

function coffeeDrink(): InterestSectionModel | null {
  const dish = getDishes().find((item) => item.slug === 'ca-phe');
  if (!dish || !photoPath(dish.slug)) return null;
  return {
    id: 'drink',
    heading: 'The cup',
    food: true,
    cards: [{
      href: '/food/ca-phe',
      title: dish.name,
      nameVi: dish.nameVi,
      line: cardLine(dish.summary),
      photo: dish.slug,
      alt: dish.name,
    }],
    text: [],
  };
}

function resortSection(): InterestSectionModel {
  const cards: InterestCardModel[] = [];
  const text: InterestTextLink[] = [];
  for (const place of placesForInterest('resortLiving')) {
    const showcase = getResortShowcase(place.slug);
    const photo = showcase?.properties.find((item) => photoPath(item.photo))?.photo;
    if (!showcase || !photo) {
      text.push(textPlace(place));
      continue;
    }
    cards.push({
      href: `/resort-living/${showcase.slug}`,
      title: place.name,
      line: cardLine(showcase.summary),
      photo,
      alt: showcase.name,
      dots: place.dots,
    });
  }
  return { id: 'places', heading: 'Places', cards, text };
}

export function interestSections(key: string): InterestSectionModel[] {
  if (key === 'food') {
    const guides = foodSection();
    guides.text.push({
      href: '/food',
      title: 'All dishes',
      line: 'The dish pages, from pho to the highland cup.',
    });
    return [guides];
  }
  if (key === 'resortLiving') return [resortSection()].filter(keep);
  const places = placeSection(key);
  const used = new Set(places.cards.map((card) => card.photo));
  const sections = [places, sightSection(key, used), festivalSection(key)];
  if (key === 'coffee') {
    const drink = coffeeDrink();
    if (drink) sections.unshift(drink);
  }
  if (key === 'motorbike') {
    const places = sections.find((section) => section.id === 'places');
    places?.text.push({
      href: '/plan/motorbikes',
      title: 'Motorbikes',
      line: 'A Vietnamese motorcycle license is what makes riding legal. Many shops still rent without one.',
    });
  }
  return sections.filter(keep);
}

function keep(section: InterestSectionModel): boolean {
  return section.cards.length > 0 || section.text.length > 0;
}
