export type InterestKey = keyof typeof import('../config/site').interestLabels;

export interface Faq {
  q: string;
  a: string;
}

export interface AttractionFigure {
  id: string;
  caption: string;
  alt?: string;
}

export interface AttractionLeg {
  heading: string;
  body: string;
}

export interface AttractionLink {
  label: string;
  url: string;
  note?: string;
}

export interface AttractionNotice {
  title: string;
  body: string;
}

export interface Attraction {
  slug: string;
  placeSlug: string;
  name: string;
  nameVi?: string;
  /** Decision lede. A finished page keeps this short and puts the visit in `body`. */
  summary: string;
  /** One line under the title: what the sight is. */
  kicker?: string;
  dots: number;
  district?: string;
  timeNeeded: string;
  /** Fact-bar price. Bands and inclusions belong in `admissionNote`. */
  fee: string;
  /** Fact-bar line. The longer version belongs in `gettingThere`. */
  getThere: string;
  /** Sight-specific months. Leave unset to use the place. */
  bestMonths?: string;
  verified?: string;
  /** What the hero frame shows. */
  heroCaption?: string;
  notice?: AttractionNotice;
  body?: string[];
  figures?: AttractionFigure[];
  gettingThere?: string[];
  legs?: AttractionLeg[];
  hours?: string;
  closed?: string;
  admissionNote?: string;
  links?: AttractionLink[];
  lat?: number;
  lng?: number;
  interests: string[];
}

export interface Festival {
  slug: string;
  name: string;
  nameVi?: string;
  placeSlugs: string[];
  summary: string;
  when: string;
  interests: string[];
}

export interface StayArea {
  name: string;
  summary: string;
  band: string;
  photo?: string;
}

export interface InterestCard {
  title: string;
  summary: string;
  attractionSlug?: string;
  dishSlug?: string;
  placeSlug?: string;
  photo?: string;
  icon?: string;
  /** `food` links this card to the city food guide page. */
  to?: 'food';
}

export interface Place {
  slug: string;
  name: string;
  nameVi: string;
  kind: 'city' | 'town' | 'district' | 'area';
  parent?: string;
  corridor: string;
  province: string;
  provinceNote?: string;
  lat: number;
  lng: number;
  dots: number;
  dotReason: string;
  summary: string;
  timeNeeded: string;
  fee: string;
  getThere: string;
  bestMonths: string;
  verified: string;
  interests: Record<string, number>;
  cover: string;
  nearby: string[];
  foodSlug?: string;
  routeSlugs: string[];
  itinerarySlugs: string[];
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  gettingAround: string[];
  stayAreas: StayArea[];
  eat: string[];
  dishSlugs: string[];
  interestsBody: string[];
  interestCards?: InterestCard[];
  faqs: Faq[];
  season?: { label: string; note: string };
}

export interface Corridor {
  slug: string;
  name: string;
  climate: string;
  days: string;
  summary: string;
  body: string[];
  cover: string;
  seoTitle: string;
  seoDescription: string;
}

export interface RouteMode {
  mode: string;
  duration: string;
  note: string;
  partner?: 'bus' | 'flight' | 'train' | 'ferry';
  partnerPath?: string;
}

export interface Route {
  slug: string;
  name: string;
  from: string;
  to: string;
  summary: string;
  modes: RouteMode[];
  seoTitle: string;
  seoDescription: string;
  faqs: Faq[];
}

export interface Dish {
  slug: string;
  name: string;
  nameVi: string;
  summary: string;
  origin: string;
  howToEat: string[];
  priceBand: string;
  placeSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface FoodSection {
  id: string;
  heading: string;
  paragraphs: string[];
  dishSlugs?: string[];
}

export interface FoodGuide {
  slug: string;
  name: string;
  placeSlug: string;
  summary: string;
  body: string[];
  sections?: FoodSection[];
  dishSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  block: 'tip' | 'travel' | 'tax' | 'living';
  group: 'before' | 'learn' | 'move' | 'stay';
  summary: string;
  verified?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  sections: GuideSection[];
  faqs: Faq[];
  seoTitle: string;
  seoDescription: string;
}

export interface ItineraryStop {
  name: string;
  minutes: number;
  walkMinutes?: number;
  placeSlug?: string;
  attractionSlug?: string;
  dishSlug?: string;
  note: string;
}

export interface ItineraryDay {
  title: string;
  body: string;
  placeSlug?: string;
  photo?: string;
}

export interface Itinerary {
  slug: string;
  title: string;
  kind: 'trip' | 'walk';
  duration: string;
  budget: string;
  pace: string;
  summary: string;
  photo?: string;
  days?: ItineraryDay[];
  stops?: ItineraryStop[];
  seoTitle: string;
  seoDescription: string;
}

export interface RiceSite {
  slug: string;
  name: string;
  placeSlug: string;
  water: string;
  green: string;
  gold: string;
  note: string;
}

export interface SearchItem {
  title: string;
  vi?: string;
  href: string;
  group: 'Places' | 'Attractions' | 'Routes' | 'Food' | 'Festivals' | 'Practical' | 'Interests';
  text: string;
}
