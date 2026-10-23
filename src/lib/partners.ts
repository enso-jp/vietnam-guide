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

export const tripHomepageStay =
  'https://www.trip.com/partners/ad/S20485488?Allianceid=11105102&SID=334225872&trip_sub1=Homepage';

export const tripDestinationStay =
  'https://www.trip.com/partners/ad/S20497773?Allianceid=11105102&SID=334225872&trip_sub1=Destination%20Page';

export const tripOtherStay =
  'https://www.trip.com/partners/ad/S20497871?Allianceid=11105102&SID=334225872&trip_sub1=Attractions%20%2F%20Interests';
