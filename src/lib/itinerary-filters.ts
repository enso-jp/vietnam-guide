export const NATIONWIDE_LENGTHS = [10, 14, 18, 21] as const;

export const GATEWAYS = [
  { value: 'hanoi', label: 'Hanoi (Noi Bai)' },
  { value: 'ho-chi-minh-city', label: 'Ho Chi Minh City (Tan Son Nhat)' },
  { value: 'da-nang', label: 'Da Nang' },
  { value: 'open-jaw', label: 'Open jaw' },
] as const;

export interface FilterTrip {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  pace: string;
  daysCount: number;
  gateway?: string;
  corridor?: string;
}

export function isNationwideLength(days: number): boolean {
  return (NATIONWIDE_LENGTHS as readonly number[]).includes(days);
}

export function daysFor(trips: FilterTrip[], key: 'gateway' | 'corridor', value: string): number[] {
  const counts = trips
    .filter((trip) => trip[key] === value)
    .map((trip) => trip.daysCount)
    .filter((count) => (key === 'gateway' ? isNationwideLength(count) : Number.isFinite(count)));
  return [...new Set(counts)].sort((a, b) => a - b);
}

export function durationLabel(trips: FilterTrip[], daysCount: number): string {
  return trips.find((trip) => trip.daysCount === daysCount)?.duration ?? `${daysCount} days`;
}

export function matchingTrips(
  trips: FilterTrip[],
  key: 'gateway' | 'corridor',
  value: string,
  daysCount: number,
): FilterTrip[] {
  return trips.filter((trip) => trip[key] === value && trip.daysCount === daysCount);
}

export function firstWithDays(values: readonly string[], hasDays: (value: string) => boolean): string | undefined {
  return values.find((value) => hasDays(value));
}
