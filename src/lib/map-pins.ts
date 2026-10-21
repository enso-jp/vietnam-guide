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

const FONT = 10.5;
const CHAR = 0.56;
const PAD = 3.2;

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
  return label.length * FONT * CHAR;
}

function textBox(lx: number, ly: number, anchor: 'start' | 'end', label: string): Box {
  const w = widthOf(label);
  const l = anchor === 'start' ? lx : lx - w;
  return { l, r: l + w, t: ly - FONT, b: ly + 2.4 };
}

function hits(a: Box, b: Box, gap = 1.6): boolean {
  return a.l < b.r + gap && a.r > b.l - gap && a.t < b.b + gap && a.b > b.t - gap;
}

function inside(box: Box): boolean {
  return box.l >= 58 && box.r <= 578 && box.t >= 10 && box.b <= 628;
}

function obstacles(): Box[] {
  const boxes = vietnamIslandGroups.map((isle) => boundsOf(isle.d));
  for (const label of vietnamSeaLabels) {
    const w = Math.max(widthOf(label.name), widthOf(label.note));
    boxes.push({ l: label.x - 2, r: label.x + w + 2, t: label.y - 14, b: label.y + 16 });
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
  box: Box;
}

function choose(
  pin: Draft,
  anchor: 'start' | 'end',
  lx: number,
  ly: number,
  blocked: Box[],
): { lx: number; ly: number; anchor: 'start' | 'end'; box: Box; shift: number } | null {
  const shifts = [0, -5, 5, -10, 10, -15, 15, 20, -20, 26, 32, -26, 40, 48];
  for (const shift of shifts) {
    const y = ly + shift;
    const box = textBox(lx, y, anchor, pin.label);
    if (!inside(box)) continue;
    if (blocked.some((block) => hits(box, block))) continue;
    return { lx, ly: y, anchor, box, shift: Math.abs(shift) };
  }
  return null;
}

function layout(pins: Draft[], blocked: Box[]) {
  const region = pins.reduce(
    (box, pin) => ({
      l: Math.min(box.l, pin.x),
      r: Math.max(box.r, pin.x),
      t: Math.min(box.t, pin.y),
      b: Math.max(box.b, pin.y),
    }),
    { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity },
  );
  const mid = (region.l + region.r) / 2;
  const narrow = region.r - region.l < 130;
  const rightGutter = region.r + 8;
  const leftGutter = region.l - 8;
  const taken: Box[] = [];

  for (const pin of pins) {
    const besideRight = { anchor: 'start' as const, lx: pin.x + 6.2, ly: pin.y + 3.6 };
    const besideLeft = { anchor: 'end' as const, lx: pin.x - 6.2, ly: pin.y + 3.6 };
    const gutterRight = { anchor: 'start' as const, lx: rightGutter, ly: pin.y + 3.6 };
    const gutterLeft = { anchor: 'end' as const, lx: leftGutter, ly: pin.y + 3.6 };
    const preferRight = pin.x >= mid;
    const order = narrow
      ? preferRight
        ? [gutterRight, gutterLeft, besideRight, besideLeft]
        : [gutterLeft, gutterRight, besideLeft, besideRight]
      : preferRight
        ? [besideRight, besideLeft, gutterRight, gutterLeft]
        : [besideLeft, besideRight, gutterLeft, gutterRight];

    let best: { lx: number; ly: number; anchor: 'start' | 'end'; box: Box; shift: number; rank: number } | null = null;
    order.forEach((option, rank) => {
      const found = choose(pin, option.anchor, option.lx, option.ly, [...blocked, ...taken, { l: pin.x - 5, r: pin.x + 5, t: pin.y - 5, b: pin.y + 5 }]);
      if (!found) return;
      const score = found.shift + rank * 3;
      if (!best || score < best.shift + best.rank * 3) best = { ...found, rank };
    });
    if (!best) {
      pin.lx = round(pin.x + 6.2);
      pin.ly = round(pin.y + 3.6);
      pin.anchor = 'start';
      pin.box = textBox(pin.lx, pin.ly, pin.anchor, pin.label);
    } else {
      pin.lx = round(best.lx);
      pin.ly = round(best.ly);
      pin.anchor = best.anchor;
      pin.box = best.box;
    }
    taken.push({ ...pin.box, t: pin.box.t - PAD, b: pin.box.b + PAD });
  }
}

/** Dot on the province. Names sit in the open space beside that region so neighbours stay readable. */
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
      box: { l: 0, r: 0, t: 0, b: 0 },
    };
  });
  const groups = new Map<string, Draft[]>();
  for (const pin of pins) {
    const list = groups.get(pin.region) || [];
    list.push(pin);
    groups.set(pin.region, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => a.y - b.y || a.x - b.x);
    layout(list, blocked);
  }
  return pins.map(({ box: _box, ...pin }) => pin);
}
