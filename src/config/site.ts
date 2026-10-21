export const site = {
  name: 'Vietnam Guide',
  url: 'https://vietnam-travelguide.com',
  description:
    'An objective travel reference for Vietnam: places, routes, food, seasons, and the practical facts needed to plan a trip.',
  correctionsEmail: '',
  /** Set a POST endpoint to record rank events. Empty keeps the first load free of network calls. */
  analyticsBeacon: '',
};

export const tabs = [
  { id: 'intro', label: 'Intro', href: '' },
  { id: 'attractions', label: 'Attractions', href: '/attractions' },
  { id: 'interests', label: 'By interest', href: '/interests' },
  { id: 'get-there', label: 'Get there', href: '/get-there' },
  { id: 'itineraries', label: 'Itineraries', href: '/itineraries' },
  { id: 'stay', label: 'Stay', href: '/stay' },
  { id: 'eat', label: 'Food', href: '/eat' },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export const interestPublicSlug: Record<string, string> = {
  oldTowns: 'old-towns',
  warHistory: 'war-history',
  resortLiving: 'resort-living',
};

export function interestHref(key: string): string {
  if (key === 'food') return '/food';
  return `/interests/${interestPublicSlug[key] ?? key}`;
}

export function interestKeyFromSlug(slug: string): string | undefined {
  if (slug in interestLabels) return slug;
  const found = Object.entries(interestPublicSlug).find(([, value]) => value === slug);
  return found?.[0];
}

export const interestLabels: Record<string, string> = {
  food: 'Food',
  oldTowns: 'Old towns',
  pagodas: 'Pagodas',
  caves: 'Caves',
  beaches: 'Beaches',
  islands: 'Islands',
  mountains: 'Mountains',
  rice: 'Rice scenery',
  markets: 'Markets',
  warHistory: 'War history',
  coffee: 'Coffee',
  nightlife: 'Nightlife',
  family: 'Family',
  photography: 'Photography',
  motorbike: 'Motorbike',
  resortLiving: 'Resort Living',
};

export const dotLabel: Record<number, string> = {
  5: 'Worth building a day around',
  4: 'Worth a special trip in this corridor',
  3: 'Worth it if you are already nearby',
  2: 'A short stop or a niche interest',
  1: 'Listed for completeness',
};

export const reservedSlugs = new Set([
  'destinations',
  'food',
  'plan',
  'get-there',
  'itineraries',
  'interests',
  'seasons',
  'news',
  'blog',
  'about',
  'search',
  'admin',
  'resort-living',
]);
