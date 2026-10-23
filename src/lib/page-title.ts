/** Search-result titles. Keep them specific, under a snippet when we can, and never invent a place or fee. */

export const BRAND = 'Vietnam Guide';

/** Google's usual desktop title cut is near 60 characters. */
export const TITLE_SNIPPET = 60;

export const titles = {
  home: 'Vietnam Guide — destinations, food, and how to get there',
  destinations: 'Destinations in Vietnam',
  festivals: 'Festivals and events in Vietnam',
  interests: 'Vietnam by interest',
  stories: 'Vietnam travel stories',
  food: 'Vietnamese food guide',
  routes: 'Getting around Vietnam',
  plan: 'Plan a trip to Vietnam',
  itineraries: 'Vietnam itineraries',
  seasons: 'When to go to Vietnam',
  rice: 'Rice terrace calendar',
  about: 'About Vietnam Guide',
  editing: 'How Vietnam Guide pages are updated',
  ratings: 'How Vietnam Guide ratings work',
  search: 'Search Vietnam Guide',
  notFound: 'Page not found',
} as const;

function collapse(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function hasBrand(title: string): boolean {
  return collapse(title).includes(BRAND);
}

/** Document <title> and og:title. Drop the brand suffix when the page title is already a full snippet. */
export function documentTitle(title: string): string {
  const text = collapse(title);
  if (!text) return BRAND;
  if (hasBrand(text)) return text;
  const branded = `${text} | ${BRAND}`;
  return branded.length <= TITLE_SNIPPET ? branded : text;
}

/** Name plus a place already on the record. Skip the place when the name already says it. */
export function titledInPlace(name: string, placeName?: string): string {
  const text = collapse(name);
  const place = placeName ? collapse(placeName) : '';
  if (!place) return text;
  if (text.toLowerCase().includes(place.toLowerCase())) return text;
  const next = `${text} in ${place}`;
  if (next.length <= TITLE_SNIPPET) return next;
  const stem = collapse(text.split('—')[0].split(' - ')[0]);
  const shorter = `${stem} in ${place}`;
  return shorter.length <= TITLE_SNIPPET && shorter !== next ? shorter : text;
}

export function interestTitle(label: string): string {
  const text = collapse(label);
  return / in vietnam$/i.test(text) ? text : `${text} in Vietnam`;
}
