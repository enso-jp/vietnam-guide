export function stayLink(placeName: string): string {
  return `https://www.agoda.com/search?q=${encodeURIComponent(`${placeName}, Vietnam`)}`;
}

export function busLink(path: string): string {
  return `https://12go.asia/en/travel/${path}`;
}

export function flightLink(from: string, to: string): string {
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(`flights from ${from} to ${to}`)}`;
}

export const trainLink = 'https://dsvn.vn/';
