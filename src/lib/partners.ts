/** Destination Hotels “Search stays”. The same Trip.com affiliate on every place. */
export const tripStaySearch = 'https://www.trip.com/t/o8DaMeOXsW2';

export function stayLink(_placeName: string): string {
  return tripStaySearch;
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

export const tripFooterBanner =
  'https://www.trip.com/partners/ad/SB20499138?Allianceid=11105102&SID=334225872&trip_sub1=Ho%20Chi%20Minh';

export const tripFamilySummer =
  'https://sg.trip.com/sale/w/xnz6pcn7s6xl9hsl/familysummer.html?locale=en-SG&transparentBar=1&wkp=1&Allianceid=11105102&SID=334225872&trip_sub1=Non+-+homepage&trip_sub3=P20499845';

export const klookWidget =
  'https://tpwgts.com/content?currency=USD&trs=588978&shmarker=793638&locale=en&city_id=33&category=4&amount=3&powered_by=true&campaign_id=137&promo_id=4497';
