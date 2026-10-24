import { getGuides, getItineraries } from './content';
import { compareItineraryTitle } from './itinerary-index';

export interface PlanLink {
  href: string;
  label: string;
  summary?: string;
}

export interface PlanSection {
  id: 'before' | 'accommodation' | 'transportation' | 'itineraries' | 'living';
  slug: string;
  title: string;
  href: string;
  tab: 'before' | 'stay' | 'travel' | 'itineraries' | 'living';
  links: PlanLink[];
}

function guideLink(slug: string): PlanLink | null {
  const guide = getGuides().find((item) => item.slug === slug);
  return guide ? { href: `/plan/${guide.slug}`, label: guide.title, summary: guide.summary } : null;
}

function keep(item: PlanLink | null): item is PlanLink {
  return Boolean(item);
}

/** The Plan a trip columns, in page order. Links are guides, routes, and itineraries already on the site. */
export function planSections(): PlanSection[] {
  const before = ['when-to-go', 'e-visa', 'money', 'sim-and-wifi', 'luggage', 'street-manners', 'eating-manners']
    .map(guideLink)
    .filter(keep);
  const stay = ['where-to-stay'].map(guideLink).filter(keep);
  const travel = ['flights', 'trains', 'buses', 'grab-and-taxis', 'motorbikes'].map(guideLink).filter(keep);
  const trips = getItineraries()
    .filter((trip) => trip.level === 'nationwide' || trip.level === 'region')
    .sort(compareItineraryTitle);
  const living = ['living', 'taxes'].map(guideLink).filter(keep);
  const sections: PlanSection[] = [
    {
      id: 'before',
      slug: 'before-you-go',
      title: 'Before you go',
      href: '/plan/sections/before-you-go',
      tab: 'before',
      links: [...before, { href: '/seasons', label: 'Seasons' }, { href: '/festivals', label: 'Festivals' }],
    },
    {
      id: 'accommodation',
      slug: 'accommodation',
      title: 'Accommodation',
      href: '/plan/sections/accommodation',
      tab: 'stay',
      links: stay,
    },
    {
      id: 'transportation',
      slug: 'transportation',
      title: 'Transportation',
      href: '/plan/sections/transportation',
      tab: 'travel',
      links: [...travel, { href: '/get-there', label: 'Routes between places' }],
    },
    {
      id: 'itineraries',
      slug: 'itineraries',
      title: 'Itineraries',
      href: '/plan/sections/itineraries',
      tab: 'itineraries',
      links: [
        ...trips.map((trip) => ({ href: `/itineraries/${trip.slug}`, label: trip.title })),
        { href: '/itineraries', label: 'All itineraries' },
      ],
    },
    {
      id: 'living',
      slug: 'living',
      title: 'Living',
      href: '/plan/sections/living',
      tab: 'living',
      links: living,
    },
  ];
  return sections.filter((section) => section.links.length > 0);
}

export function planSection(slug: string): PlanSection | undefined {
  return planSections().find((section) => section.slug === slug);
}

/** Where a Plan a trip heading opens. Itineraries opens the index; the section page stays at `href`. */
export function planSectionLink(section: PlanSection): string {
  return section.id === 'itineraries' ? '/itineraries' : section.href;
}
