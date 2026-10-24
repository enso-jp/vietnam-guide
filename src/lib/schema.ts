import { site } from '../config/site';

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.alternateNames,
    url: `${site.url}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${site.url}/icon-512.png`,
      width: 512,
      height: 512,
    },
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    alternateName: site.alternateNames,
    url: `${site.url}/`,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': `${site.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.url}/search?q={query}`,
      'query-input': 'required name=query',
    },
  };
}

export function abs(path: string): string {
  return new URL(path, site.url).toString();
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function itemList(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: abs(item.path),
    })),
  };
}

export function article(headline: string, description: string, path: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    ...(image ? { image: abs(image) } : {}),
    publisher: { '@id': `${site.url}/#organization` },
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
