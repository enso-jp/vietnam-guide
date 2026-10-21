/**
 * Published 2024 visitor arrivals, used only to order destinations.
 * A later pass can replace this module with the site's own traffic.
 * Places absent from `trafficVisits` have no figure and sort after the ones that do.
 *
 * Counts are total arrivals where the published place is the same place as the page.
 * A "more than" report is stored as that floor, not a guessed total.
 * A different measure, or a province total that does not match the page, is left out.
 */

export const trafficYear = 2024;
export const trafficByline = 'By 2024 visitor arrivals';

export const trafficVisits: Record<string, number> = {
  // VietnamPlus, 3 Jan 2025: 6.1 million foreign and 38 million domestic in 2024.
  'ho-chi-minh-city': 44_100_000,
  // VietnamPlus, 3 Jan 2025: 6.35 million foreign and 21.51 million domestic, "nearly 28 million".
  hanoi: 27_860_000,
  // VnExpress, 1 Jan 2025: Ninh Binh, more than 8.7 million in 2024.
  'ninh-binh': 8_700_000,
  // Cần Thơ party site: 6,366,000 visitor arrivals in 2024.
  'can-tho': 6_366_000,
  // Tuổi Trẻ, 29 Nov 2024, citing the Kiên Giang tourism department: Phú Quốc, 5,969,528.
  'phu-quoc': 5_969_528,
  // chinhphu.vn, 29 Dec 2024: visitors to Huế, more than 4 million in 2024.
  hue: 4_000_000,
};

export function visitsFor(slug: string): number | null {
  const value = trafficVisits[slug];
  return typeof value === 'number' ? value : null;
}

export function compareTraffic<T extends { slug: string; name: string }>(a: T, b: T): number {
  const av = visitsFor(a.slug);
  const bv = visitsFor(b.slug);
  if (av != null && bv != null && av !== bv) return bv - av;
  if (av != null && bv == null) return -1;
  if (av == null && bv != null) return 1;
  return a.name.localeCompare(b.name);
}
