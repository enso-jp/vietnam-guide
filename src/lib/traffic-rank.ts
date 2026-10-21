/**
 * Published 2025 visitor arrivals, used only to order destinations.
 * The year is not printed on the page.
 * Places absent from `trafficVisits` have no matching 2025 figure and sort after the ones that do.
 *
 * Counts are total arrivals where the published place is the same place as the page.
 * A "more than" report is stored as that floor, not a guessed total.
 * A "nearly" report is stored as the published estimate.
 * A different measure, a partial year, or a province total that does not match the page, is left out.
 *
 * Left out on purpose:
 * - Da Nang: 2025 reports are lodging guests served (more than 17.3 million), not total arrivals.
 * - Phu Quoc: VnExpress, 30 Dec 2025, is about 7.6 million through November only.
 * - Nha Trang: Khanh Hoa’s 16.4 million (National Authority of Tourism statistics, 31 Dec 2025) is the province, not the city page.
 * - An Giang’s 24.1 million is the merged province, not Phu Quoc or Chau Doc.
 */

export const trafficVisits: Record<string, number> = {
  // VnExpress, 30 Dec 2025, citing the Vietnam National Authority of Tourism: Ho Chi Minh City, more than 53.5 million.
  'ho-chi-minh-city': 53_500_000,
  // Same article: Hanoi, 33.7 million.
  hanoi: 33_700_000,
  // Ninh Binh Department of Tourism, 13 Jan 2026: nearly 19.42 million in 2025.
  'ninh-binh': 19_420_000,
  // Tuổi Trẻ, 15 Jan 2026, from the Can Tho Department of Culture, Sports and Tourism year-end conference: nearly 11.2 million.
  'can-tho': 11_200_000,
  // Nhân Dân, 19 Dec 2025, from the city’s National Tourism Year wrap-up: more than 6.3 million.
  hue: 6_300_000,
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
