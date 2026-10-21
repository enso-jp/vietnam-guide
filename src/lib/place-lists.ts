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

/** The template replaces the place food-guide card with Dining and F&B. */
export function isReplacedInterestTitle(title: string): boolean {
  return title === 'Dining and F&B' || /food guide/i.test(title);
}

function isDiningGroup(title: string): boolean {
  return /\b(dining|food|f\s*&\s*b)\b/i.test(title);
}

/**
 * Dining and F&B leads the interest cards. A dining group from the place
 * record stays first. Other group titles are left as the place wrote them.
 */
export function leadWithDining<T extends { title: string }>(
  sections: InterestSection<T>[],
  dining: T,
): InterestSection<T>[] {
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
