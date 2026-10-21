import type { vietnamProvinces } from './vietnam-provinces';

type Province = (typeof vietnamProvinces)[number];

export interface MapPin {
  slug: string;
  name: string;
  label: string;
  region: string;
  /** Shown while its region is selected. Other provinces keep a pin for hover only. */
  listed: boolean;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'end';
}

const LABEL: Record<string, string> = {
  hanoi: 'Ha Noi',
  'thua-thien-hue': 'Hue',
  'ho-chi-minh-city': 'Ho Chi Minh City',
};

/** The short set from the region samples. `end` draws the name to the left of the dot. */
const LISTED: Record<string, 'start' | 'end'> = {
  'cao-bang': 'start',
  'lai-chau': 'end',
  'tuyen-quang': 'start',
  'thai-nguyen': 'start',
  'lao-cai': 'start',
  'lang-son': 'start',
  'dien-bien': 'end',
  'son-la': 'end',
  'phu-tho': 'start',
  'bac-ninh': 'end',
  'quang-ninh': 'start',
  hanoi: 'end',
  'hai-phong': 'start',
  'ninh-binh': 'end',
  'hung-yen': 'start',
  'thanh-hoa': 'start',
  'nghe-an': 'start',
  'ha-tinh': 'start',
  'quang-tri': 'start',
  'thua-thien-hue': 'start',
  'da-nang': 'start',
  'quang-ngai': 'start',
  'gia-lai': 'start',
  'dak-lak': 'start',
  'lam-dong': 'end',
  'khanh-hoa': 'start',
  'tay-ninh': 'end',
  'dong-nai': 'start',
  'ho-chi-minh-city': 'start',
  'an-giang': 'end',
  'dong-thap': 'start',
  'vinh-long': 'start',
  'can-tho': 'end',
  'ca-mau': 'end',
};

/** Name offset from its dot. Positive dx draws to the right. Tuned so the measured boxes stay apart. */
const PLACE: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
  'cao-bang': { dx: 9.5, dy: -19.3, anchor: 'start' },
  'tuyen-quang': { dx: -65.9, dy: -32.6, anchor: 'start' },
  'lai-chau': { dx: -8.1, dy: -28.2, anchor: 'end' },
  'lao-cai': { dx: -23.4, dy: 24.7, anchor: 'start' },
  'lang-son': { dx: 8.5, dy: -20.3, anchor: 'start' },
  'dien-bien': { dx: -50.4, dy: 26.8, anchor: 'start' },
  'thai-nguyen': { dx: 8.6, dy: 19.5, anchor: 'start' },
  'phu-tho': { dx: 8.1, dy: 36.6, anchor: 'start' },
  'son-la': { dx: -8.1, dy: 37.3, anchor: 'end' },
  'quang-ninh': { dx: 8.5, dy: -16.8, anchor: 'start' },
  'bac-ninh': { dx: -8.2, dy: -20, anchor: 'end' },
  hanoi: { dx: -7.8, dy: 6.6, anchor: 'end' },
  'hai-phong': { dx: 8.2, dy: 6.8, anchor: 'start' },
  'hung-yen': { dx: 8.1, dy: 38.6, anchor: 'start' },
  'ninh-binh': { dx: -7.7, dy: 14.2, anchor: 'end' },
  'thanh-hoa': { dx: 8, dy: 4, anchor: 'start' },
  'nghe-an': { dx: 8, dy: 8.3, anchor: 'start' },
  'ha-tinh': { dx: 8, dy: 5, anchor: 'start' },
  'quang-tri': { dx: 8, dy: -4.4, anchor: 'start' },
  'thua-thien-hue': { dx: 8, dy: 21.2, anchor: 'start' },
  'da-nang': { dx: 8, dy: 4, anchor: 'start' },
  'quang-ngai': { dx: 8, dy: 4, anchor: 'start' },
  'gia-lai': { dx: 8, dy: -3.6, anchor: 'start' },
  'dak-lak': { dx: 8, dy: -10.5, anchor: 'start' },
  'khanh-hoa': { dx: 8, dy: 23.2, anchor: 'start' },
  'lam-dong': { dx: -8, dy: 4, anchor: 'end' },
  'tay-ninh': { dx: -8, dy: 4, anchor: 'end' },
  'dong-nai': { dx: 8, dy: 4, anchor: 'start' },
  'ho-chi-minh-city': { dx: 8, dy: 25.7, anchor: 'start' },
  'an-giang': { dx: -8, dy: 4, anchor: 'end' },
  'dong-thap': { dx: 8, dy: -0.8, anchor: 'start' },
  'can-tho': { dx: -8, dy: 18.9, anchor: 'end' },
  'vinh-long': { dx: 8, dy: 20.6, anchor: 'start' },
  'ca-mau': { dx: -8, dy: 13.7, anchor: 'end' },
};

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function pointsOf(d: string): [number, number][] {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const points: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) points.push([nums[i], nums[i + 1]]);
  return points;
}

function centroid(d: string): { x: number; y: number } {
  const parts = d.split(/Z/i).filter((part) => part.trim().length > 0);
  let best = parts[0] || '';
  for (const part of parts) if (part.length > best.length) best = part;
  const points = pointsOf(best);
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  const n = points.length || 1;
  return { x: x / n, y: y / n };
}

/** One large name beside the dot for the sample provinces. Every province still has a hover pin. */
export function mapPins(provinces: Province[]): MapPin[] {
  return provinces.map((province) => {
    const point = centroid(province.d);
    const label = LABEL[province.slug] || province.name;
    const x = round(point.x);
    const y = round(point.y);
    const spot = PLACE[province.slug];
    const anchor = spot?.anchor || LISTED[province.slug] || 'start';
    return {
      slug: province.slug,
      name: province.name,
      label,
      region: province.region,
      listed: province.slug in LISTED,
      x,
      y,
      lx: round(x + (spot ? spot.dx : anchor === 'start' ? 8 : -8)),
      ly: round(y + (spot ? spot.dy : 4)),
      anchor,
    };
  });
}
