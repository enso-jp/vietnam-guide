import type { InterestBlock, InterestCard, Place } from './types';
import {
  attractionPath,
  attractionsForPlace,
  cardLine,
  getFoodGuides,
  getPlace,
  getPlaces,
  interestList,
  placePath,
} from './content';
import { isAuthoredDiningCard, isReplacedInterestTitle, leadWithDining, realFoodGuideSlug, shouldLeadWithDining } from './place-lists';

export interface InterestRailItem {
  href: string;
  title: string;
  summary: string;
  photo: string;
  fallback: string;
  alt: string;
  cover?: string;
  icon?: string;
  block?: string;
}

export interface PlaceInterestSection {
  title: string;
  summary: string;
  body: string[];
  blocks: InterestBlock[];
  /** Set when this headed section opens its own page. */
  slug: string;
  items: InterestRailItem[];
}

/** A stable URL piece from a group title. "Dining and F&B" becomes dining-and-fb. */
export function interestGroupSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/&/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function takeSlug(title: string, used: Set<string>): string {
  const base = interestGroupSlug(title) || 'interest';
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

function toInterestRail(place: Place, card: InterestCard, attractions: ReturnType<typeof attractionsForPlace>): InterestRailItem {
  const sight = card.attractionSlug
    ? attractions.find((item) => item.slug === card.attractionSlug)
    : undefined;
  const linkedPlace = card.placeSlug ? getPlace(card.placeSlug) : undefined;
  const href = card.to === 'food'
    ? `/food/${place.foodSlug || place.slug}`
    : card.to === 'resortLiving'
      ? `/resort-living/${place.slug}`
      : sight
        ? attractionPath(sight)
        : card.dishSlug
          ? `/food/${card.dishSlug}`
          : linkedPlace
            ? placePath(linkedPlace)
            : '#interests';
  const photo = card.photo || (sight ? `${sight.placeSlug}-${sight.slug}` : '') || card.dishSlug || card.placeSlug || place.slug;
  return {
    href,
    title: card.title,
    summary: card.summary,
    photo,
    fallback: place.slug,
    alt: card.title,
    cover: place.cover,
    icon: card.icon || (card.to === 'food' ? 'food' : card.to === 'resortLiving' ? 'bed' : undefined),
    block: card.block,
  };
}

/**
 * The interest sections a place page renders today.
 * Headed groups keep their titles, sentences, and photo cards.
 * A place with no groups stays one untitled rail of its interest cards.
 */
export function placeInterestSections(place: Place): PlaceInterestSection[] {
  const attractions = attractionsForPlace(place);
  const foodGuides = getFoodGuides();
  const sourceSections = place.interestGroups?.length
    ? place.interestGroups.map((group) => ({
        title: group.title,
        summary: group.summary || '',
        cards: group.cards,
      }))
    : [{
        title: '',
        summary: '',
        cards: place.interestCards?.length
          ? place.interestCards
          : interestList(place)
              .filter((tag) => tag.key !== 'food')
              .map((tag) => {
                const sight = attractions.find((item) => item.interests.includes(tag.key));
                return {
                  title: tag.label,
                  summary: sight ? cardLine(sight.summary) : tag.label,
                  attractionSlug: sight?.slug,
                };
              }),
      }];
  const sourceCards = sourceSections.flatMap((section) => section.cards);
  const guideCard = sourceCards.find((card) => isAuthoredDiningCard(card));
  const showDining = shouldLeadWithDining(place, foodGuides, sourceCards);
  const diningSlug = realFoodGuideSlug(place, foodGuides);
  const diningHref = diningSlug ? `/food/${diningSlug}` : guideCard ? toInterestRail(place, guideCard, attractions).href : '';
  const dining = showDining && diningHref
    ? {
        href: diningHref,
        title: 'Dining and F&B',
        summary: guideCard?.summary || '',
        photo: guideCard?.photo || place.dishSlugs[0] || place.slug,
        fallback: place.slug,
        alt: `${place.name} food`,
        cover: place.cover,
        icon: 'food',
      }
    : undefined;
  const groupMeta = new Map(
    (place.interestGroups || []).map((group) => [
      group.title,
      { body: group.body || [], blocks: group.blocks || [] },
    ]),
  );
  const sections = leadWithDining(
    sourceSections.map((section) => ({
      title: section.title,
      summary: section.summary,
      items: section.cards
        .filter((card) => !showDining || !isAuthoredDiningCard(card))
        .map((card) => toInterestRail(place, card, attractions)),
    })),
    dining,
  );
  const used = new Set<string>();
  const hasHeaded = sections.some((section) => section.title.trim() && section.items.length > 0);
  return sections.map((section) => {
    const injectedDining = !section.title.trim()
      && hasHeaded
      && section.items.length > 0
      && section.items.every((item) => isReplacedInterestTitle(item.title));
    const title = section.title.trim() || (injectedDining ? section.items[0].title : '');
    const headed = Boolean(title) && section.items.length > 0 && (Boolean(section.title.trim()) || injectedDining);
    const resolvedTitle = section.title.trim() ? section.title : title;
    const extra = groupMeta.get(resolvedTitle) || { body: [], blocks: [] };
    return {
      title: resolvedTitle,
      summary: section.summary,
      body: extra.body,
      blocks: extra.blocks,
      slug: headed ? takeSlug(title, used) : '',
      items: section.items,
    };
  });
}

export function interestGroupPath(place: Place, slug: string): string {
  return `${placePath(place)}/by-interest/${slug}`;
}

function isDiningTitle(title: string): boolean {
  return /\b(dining|food|f\s*&\s*b)\b/i.test(title);
}

/**
 * Dining opens the food guide. Resort Living opens the resort page.
 * A one-card wrapper is not generated for either.
 */
function directGuideHref(section: PlaceInterestSection): string | undefined {
  const hrefs = [...new Set(section.items.map((item) => item.href))];
  if (hrefs.length !== 1) return undefined;
  const href = hrefs[0];
  if (href.startsWith('/resort-living/')) return href;
  if (href.startsWith('/food/') && isDiningTitle(section.title)) return href;
  return undefined;
}

function sliderHref(place: Place, section: PlaceInterestSection): string {
  return directGuideHref(section) ?? interestGroupPath(place, section.slug);
}

/** One slider card per headed section. Untitled rails stay as they are. */
export function interestSliderItems(place: Place, sections: PlaceInterestSection[]): InterestRailItem[] | null {
  const headed = sections.filter((section) => section.slug && section.items.length > 0);
  if (!headed.length) return null;
  return headed.map((section) => {
    const photo = section.items[0];
    return {
      href: sliderHref(place, section),
      title: section.title,
      photo: photo.photo,
      fallback: place.slug,
      alt: section.title,
      cover: place.cover,
      icon: photo.icon,
    };
  });
}

export function interestGroupPages(): { place: Place; section: PlaceInterestSection }[] {
  return getPlaces()
    .filter((place) => !place.parent && place.kind !== 'district')
    .flatMap((place) => placeInterestSections(place)
      .filter((section) => section.slug && section.items.length > 0 && !directGuideHref(section))
      .map((section) => ({ place, section })));
}
