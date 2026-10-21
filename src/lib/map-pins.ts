import type { vietnamProvinces } from './vietnam-provinces';
import { vietnamIslandGroups, vietnamSeaLabels } from './vietnam-provinces';

type Province = (typeof vietnamProvinces)[number];

export interface MapPin {
  slug: string;
  name: string;
  label: string;
  region: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'end';
}

const LABEL: Record<string, string> = {
  'thua-thien-hue': 'Hue',
  'ba-ria-vung-tau': 'Vung Tau',
  'ho-chi-minh-city': 'Ho Chi Minh City',
};

/** Matches the map label font. Width is generous so the halo never eats the next name. */
const FONT = 10.5;
const CHAR = 0.62;
const DOT = 8;
const GAP = 11;

interface Box {
  l: number;
  r: number;
  t: number;
  b: number;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function pointsOf(d: string): [number, number][] {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const points: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) points.push([nums[i], nums[i + 1]]);
  return points;
}

function boundsOf(d: string): Box {
  const points = pointsOf(d);
  let l = Infinity;
  let r = -Infinity;
  let t = Infinity;
  let b = -Infinity;
  for (const [x, y] of points) {
    if (x < l) l = x;
    if (x > r) r = x;
    if (y < t) t = y;
    if (y > b) b = y;
  }
  return { l, r, t, b };
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

function widthOf(label: string): number {
  return label.length * FONT * CHAR + 2.4;
}

function textBox(lx: number, ly: number, anchor: 'start' | 'end', label: string): Box {
  const w = widthOf(label);
  const l = anchor === 'start' ? lx : lx - w;
  return { l, r: l + w, t: ly - FONT - 1.2, b: ly + 3.2 };
}

function hits(a: Box, b: Box): boolean {
  return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
}

function inside(box: Box): boolean {
  return box.l >= 58 && box.r <= 575 && box.t >= 8 && box.b <= 626;
}

function obstacles(): Box[] {
  const boxes = vietnamIslandGroups.map((isle) => {
    const box = boundsOf(isle.d);
    return { l: box.l - 3, r: box.r + 3, t: box.t - 3, b: box.b + 3 };
  });
  for (const label of vietnamSeaLabels) {
    const w = Math.max(widthOf(label.name), widthOf(label.note));
    boxes.push({ l: label.x - 4, r: label.x + w + 4, t: label.y - 16, b: label.y + 18 });
  }
  return boxes;
}

interface Draft {
  slug: string;
  name: string;
  label: string;
  region: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'end';
}

function separate(list: Draft[]) {
  const ordered = [...list].sort((a, b) => a.ly - b.ly || a.lx - b.lx);
  for (let i = 0; i < ordered.length; i++) {
    const pin = ordered[i];
    let guard = 0;
    while (guard < 24) {
      const box = padded(textBox(pin.lx, pin.ly, pin.anchor, pin.label));
      const clash = ordered.slice(0, i).some((other) => hits(box, textBox(other.lx, other.ly, other.anchor, other.label)));
      if (!clash) break;
      pin.ly = round(pin.ly + 6);
      guard += 1;
    }
  }
}

function padded(box: Box): Box {
  return { l: box.l - GAP, r: box.r + GAP, t: box.t - GAP, b: box.b + GAP };
}

function placeSide(side: Draft[], anchor: 'start' | 'end', blocked: Box[]) {
  side.sort((a, b) => a.y - b.y || a.x - b.x);
  const xs = side.map((pin) => pin.x);
  const span = Math.max(...xs) - Math.min(...xs);
  const align = span < 46;
  const gutter = anchor === 'start' ? Math.max(...xs) + DOT : Math.min(...xs) - DOT;
  const taken: Box[] = [];
  for (const pin of side) {
    const lx = round(align ? gutter : anchor === 'start' ? pin.x + DOT : pin.x - DOT);
    let ly = pin.y + 3.4;
    let guard = 0;
    while (guard < 28) {
      const box = textBox(lx, ly, anchor, pin.label);
      const clear = inside(box) && !blocked.some((block) => hits(box, block)) && !taken.some((block) => hits(padded(box), block));
      if (clear) break;
      ly += 6;
      guard += 1;
    }
    pin.lx = lx;
    pin.ly = round(ly);
    pin.anchor = anchor;
    taken.push(textBox(pin.lx, pin.ly, pin.anchor, pin.label));
  }
}

/**
 * One dot on the province. The name sits just to the open side of that dot.
 * Names in the same column keep a full line of space so they never cover each other.
 */
export function mapPins(provinces: Province[]): MapPin[] {
  const blocked = obstacles();
  const pins: Draft[] = provinces.map((province) => {
    const point = centroid(province.d);
    const label = LABEL[province.slug] || province.name;
    return {
      slug: province.slug,
      name: province.name,
      label,
      region: province.region,
      x: round(point.x),
      y: round(point.y),
      lx: 0,
      ly: 0,
      anchor: 'start' as const,
    };
  });
  const groups = new Map<string, Draft[]>();
  for (const pin of pins) {
    const list = groups.get(pin.region) || [];
    list.push(pin);
    groups.set(pin.region, list);
  }
  for (const list of groups.values()) {
    const xs = list.map((pin) => pin.x).sort((a, b) => a - b);
    const mid = xs[Math.floor((xs.length - 1) / 2)] ?? 0;
    const left = list.filter((pin) => pin.x <= mid);
    const right = list.filter((pin) => pin.x > mid);
    if (right.length === 0 && left.length > 1) {
      const moved = left.pop();
      if (moved) right.push(moved);
    }
    placeSide(left, 'end', blocked);
    placeSide(right, 'start', blocked);
    separate(list);
  }
  return pins;
}
