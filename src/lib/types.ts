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

export interface InterestPageCopy {
  key: string;
  summary: string;
  body: string[];
  verified?: string;
}

export interface Festival {
  slug: string;
  name: string;
  nameVi?: string;
  placeSlugs: string[];
  summary: string;
  when: string;
  interests: string[];
  /** Photo id when the city hero is the wrong picture for this event. */
  photo?: string;
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
  /** Groups this card under an `InterestGroup` block on the interest page. */
  block?: string;
  /** `food` links this card to the city food guide page. */
  to?: 'food' | 'resortLiving';
}

export interface InterestBlock {
  id: string;
  heading: string;
  nav?: string;
  paragraphs?: string[];
}

export interface ResortSource {
  label: string;
  url: string;
}

export interface ResortProperty {
  name: string;
  summary: string;
  photo: string;
  /** Coast or neighborhood heading on the resort page. */
  area?: string;
  sources: ResortSource[];
}

export interface ResortShowcase {
  slug: string;
  placeSlug: string;
  name: string;
  summary: string;
  body: string[];
  properties: ResortProperty[];
  seoTitle: string;
  seoDescription: string;
}

export interface InterestGroup {
  title: string;
  /** One sentence on who this group is for. */
  summary?: string;
  /** Sourced orientation. Leave a line out when nothing supports it. */
  body?: string[];
  blocks?: InterestBlock[];
  cards: InterestCard[];
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
  /** Sourced map pin. Leave both unset when no point is sourced. A box is not a pin. */
  lat?: number;
  lng?: number;
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
  /** Local interest groupings. The template does not invent another city's groups. */
  interestGroups?: InterestGroup[];
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
  /** Sourced history. Leave it out when no source gives one. */
  history?: string[];
  /** Why the dish matters where it is eaten. */
  culture?: string[];
  texture?: string[];
  taste?: string[];
  howToEat: string[];
  /** Streets and shops. Shown before the city list. */
  where?: string[];
  priceBand: string;
  placeSlugs: string[];
  verified?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface FoodSpot {
  name: string;
  nameVi?: string;
  address?: string;
  /** Short caption. Hours stay out of this line. */
  caption?: string;
  /** Writeup on the dining row, under the address. */
  note?: string;
  /** Licensed photo id. A jpg with an author and a license. Without one, the row shows a monogram tile. */
  photo?: string;
  dishSlug?: string;
}

export type FoodGuideRole = 'regional' | 'international' | 'casual' | 'fine' | 'themed' | 'breakfast';

export interface FoodSection {
  id: string;
  heading: string;
  /** Short label for the tab row. Falls back to the heading. */
  nav?: string;
  /** Keep the heading on the page and out of the tab row. */
  hideNav?: boolean;
  /**
   * Japan Guide slot. Omit it and the section prints after the specialty essays
   * under its own heading.
   */
  role?: FoodGuideRole;
  paragraphs: string[];
  dishSlugs?: string[];
  spots?: FoodSpot[];
}

export interface FoodGuide {
  slug: string;
  name: string;
  placeSlug: string;
  summary: string;
  body: string[];
  /** Licensed dish photo above the intro. Omit it and the page starts with the intro. */
  heroSlug?: string;
  specialtiesLead?: string;
  sections?: FoodSection[];
  dishSlugs: string[];
  verified?: string;
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

export interface ItineraryApproach {
  mode: 'walk' | 'bicycle' | 'grab' | 'taxi' | 'boat' | 'bus';
  minutes?: number;
  note: string;
}

export interface ItineraryStop {
  name: string;
  /** A sourced count of minutes, or “Check on arrival” when no duration was published. */
  minutes?: number | 'Check on arrival';
  walkMinutes?: number;
  placeSlug?: string;
  attractionSlug?: string;
  dishSlug?: string;
  note: string;
  approach?: ItineraryApproach;
}

export interface ItineraryDay {
  title: string;
  body: string;
  placeSlug?: string;
  photo?: string;
  routeSlug?: string;
  itinerarySlug?: string;
}

/** An optional stop named on a day plan. No fee, hour, or travel time. */
export interface ItineraryAddition {
  name: string;
  note: string;
  placeSlug?: string;
  attractionSlug?: string;
  dishSlug?: string;
  itinerarySlug?: string;
}

export interface Itinerary {
  slug: string;
  title: string;
  kind: 'trip' | 'walk';
  level: 'nationwide' | 'region' | 'day' | 'half-day';
  duration: string;
  budget: string;
  pace: string;
  daysCount?: number;
  spanDays?: number;
  gateway?: 'hanoi' | 'ho-chi-minh-city' | 'da-nang' | 'open-jaw';
  direction?: 'north-to-south' | 'south-to-north' | 'out-of-da-nang';
  corridor?: string;
  placeSlug?: string;
  routeSlugs?: string[];
  variant?: string;
  summary: string;
  photo?: string;
  days?: ItineraryDay[];
  stops?: ItineraryStop[];
  additions?: ItineraryAddition[];
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

export interface PostSource {
  label: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  when: string;
  published: string;
  photo: string;
  photoAlt?: string;
  cover?: string;
  body: string[];
  sources: PostSource[];
  placeSlugs?: string[];
  festivalSlug?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface FrontPage {
  date: string;
  slugs: string[];
}

export interface SearchItem {
  title: string;
  vi?: string;
  href: string;
  group: 'Places' | 'Attractions' | 'Routes' | 'Food' | 'Festivals' | 'Practical' | 'Interests' | 'Stories';
  text: string;
}
