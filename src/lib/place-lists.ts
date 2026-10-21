import type { Attraction } from './types';

/** Attraction cards shown before the Show all control. */
export const VISIBLE_ATTRACTIONS = 6;

export interface RankedAttraction {
  attraction: Attraction;
  rank: number;
}

export interface AttractionBlock {
  label: string;
  items: RankedAttraction[];
}

export interface InterestSection<T> {
  title: string;
  summary: string;
  items: T[];
}

export function partitionAttractions(
  groups: { label: string; items: Attraction[] }[],
  limit = VISIBLE_ATTRACTIONS,
): { shown: AttractionBlock[]; rest: AttractionBlock[]; total: number; hidden: number } {
  let total = 0;
  const shown: AttractionBlock[] = [];
  const rest: AttractionBlock[] = [];
  for (const group of groups) {
    const shownItems: RankedAttraction[] = [];
    const restItems: RankedAttraction[] = [];
    for (const attraction of group.items) {
      const entry = { attraction, rank: total + 1 };
      if (total < limit) shownItems.push(entry);
      else restItems.push(entry);
      total += 1;
    }
    if (shownItems.length) shown.push({ label: group.label, items: shownItems });
    if (restItems.length) rest.push({ label: shownItems.length ? '' : group.label, items: restItems });
  }
  const visible = Math.min(total, limit);
  return { shown, rest, total, hidden: total - visible };
}

/** The template replaces an authored food-guide card with Dining and F&B. */
export function isReplacedInterestTitle(title: string): boolean {
  return title === 'Dining and F&B' || /food guide/i.test(title);
}

/** A Dining and F&B card, or a food-guide card, written on the place record. */
export function isAuthoredDiningCard(card: { title: string }): boolean {
  return isReplacedInterestTitle(card.title);
}

/**
 * Slug of this place’s own food-guide record.
 * A foodSlug that only points at another city’s guide does not count.
 */
export function realFoodGuideSlug(
  place: { slug: string; foodSlug?: string },
  guides: { slug: string; placeSlug: string }[],
): string | undefined {
  const own = guides.filter((guide) => guide.placeSlug === place.slug || guide.slug === place.slug);
  const preferred = place.foodSlug ? own.find((guide) => guide.slug === place.foodSlug) : undefined;
  return (preferred ?? own[0])?.slug;
}

/** Dining leads only when this place has a food guide or an authored Dining card. */
export function shouldLeadWithDining(
  place: { slug: string; foodSlug?: string },
  guides: { slug: string; placeSlug: string }[],
  cards: { title: string }[],
): boolean {
  return Boolean(realFoodGuideSlug(place, guides)) || cards.some((card) => isAuthoredDiningCard(card));
}

function isDiningGroup(title: string): boolean {
  return /\b(dining|food|f\s*&\s*b)\b/i.test(title);
}

/**
 * Dining and F&B leads the interest cards when `dining` is passed.
 * Omit it for a place with no food guide and no authored Dining card.
 * A dining group from the place record stays first. Other group titles are left as the place wrote them.
 */
export function leadWithDining<T extends { title: string }>(
  sections: InterestSection<T>[],
  dining?: T,
): InterestSection<T>[] {
  if (!dining) return sections;
  const next = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !isReplacedInterestTitle(item.title)),
    }))
    .filter((section) => section.items.length > 0 || section.title);
  const index = next.findIndex((section) => section.title && isDiningGroup(section.title));
  if (index >= 0) {
    const [group] = next.splice(index, 1);
    return [{ ...group, items: [dining, ...group.items] }, ...next];
  }
  if (next[0] && !next[0].title) {
    return [{ ...next[0], items: [dining, ...next[0].items] }, ...next.slice(1)];
  }
  return [{ title: '', summary: '', items: [dining] }, ...next];
}
