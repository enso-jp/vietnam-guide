import { vietnamProvinces } from './vietnam-provinces';

export interface RouteStop {
  slug: string;
  name: string;
  lat?: number;
  lng?: number;
}

export interface RoutePin {
  x: number;
  y: number;
  name: string;
  n: number;
  anchor: 'start' | 'end';
  labelY: number;
}

/**
 * Linear fit of the sourced Hanoi, Da Nang, and Cao Bang pins onto the GADM
 * province viewBox. A place with no lat and lng is plotted only when its slug
 * is a province on that map, at the shape's own center.
 */
const LNG_SCALE = 32.97;
const LNG_OFFSET = -3284.3864;
const LAT_SCALE = -34.1102;
const LAT_OFFSET = 816.2991;

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

const provinceCenter = new Map(vietnamProvinces.map((province) => [province.slug, centroid(province.d)]));

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function pointFor(place: RouteStop): { x: number; y: number } | undefined {
  if (typeof place.lat === 'number' && typeof place.lng === 'number') {
    return {
      x: round(LNG_SCALE * place.lng + LNG_OFFSET),
      y: round(LAT_SCALE * place.lat + LAT_OFFSET),
    };
  }
  const center = provinceCenter.get(place.slug);
  if (!center) return undefined;
  return { x: round(center.x), y: round(center.y) };
}

/** Pins in visit order. A repeated stay stays one pin. A place with no point is skipped. */
export function routePins(places: RouteStop[]): RoutePin[] {
  const sequence: RouteStop[] = [];
  for (const place of places) {
    const previous = sequence[sequence.length - 1];
    if (previous?.slug === place.slug) continue;
    sequence.push(place);
  }

  const drawn: RoutePin[] = [];
  for (const place of sequence) {
    const point = pointFor(place);
    if (!point) continue;
    const stacked = drawn.some((pin) => Math.hypot(point.x - pin.x, point.y - pin.y) < 3);
    if (stacked) continue;
    const previous = drawn[drawn.length - 1];
    const close = Boolean(previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 24);
    if (close && previous) previous.labelY = previous.y - 14;
    drawn.push({
      x: point.x,
      y: point.y,
      name: place.name,
      n: drawn.length + 1,
      anchor: point.x > 300 ? 'end' : 'start',
      labelY: close ? point.y + 16 : point.y - 12,
    });
  }
  return drawn;
}

const MAINLAND = { x: 68, y: 8, w: 276, h: 530 };

/** Crop to the route when the stops sit in one part of the country. A long route keeps the full mainland. */
export function routeFrame(pins: RoutePin[]): string {
  const full = `${MAINLAND.x} ${MAINLAND.y} ${MAINLAND.w} ${MAINLAND.h}`;
  if (pins.length < 2) return full;
  const xs = pins.map((pin) => pin.x);
  const ys = pins.map((pin) => pin.y);
  const pad = 42;
  let x = Math.min(...xs) - pad;
  let y = Math.min(...ys) - pad;
  let w = Math.max(...xs) - Math.min(...xs) + pad * 2;
  let h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  if (w < 130) {
    x -= (130 - w) / 2;
    w = 130;
  }
  if (h < 160) {
    y -= (160 - h) / 2;
    h = 160;
  }
  if (w >= MAINLAND.w * 0.72 || h >= MAINLAND.h * 0.62) return full;
  x = Math.max(MAINLAND.x, Math.min(x, MAINLAND.x + MAINLAND.w - w));
  y = Math.max(MAINLAND.y, Math.min(y, MAINLAND.y + MAINLAND.h - h));
  const round = (n: number) => Math.round(n * 10) / 10;
  return `${round(x)} ${round(y)} ${round(w)} ${round(h)}`;
}
