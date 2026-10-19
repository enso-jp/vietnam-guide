import { busLink, flightLink, stayLink, trainLink } from '../lib/partners';

type Item = { title: string; vi?: string; href: string; group: string; text: string };

const beacon = document.documentElement.dataset.beacon || '';

function track(name: string, props: Record<string, string>) {
  if (!beacon) return;
  const body = JSON.stringify({ name, props, t: Date.now(), path: location.pathname });
  if (navigator.sendBeacon) navigator.sendBeacon(beacon, body);
}

function placeId() {
  return document.body.dataset.place || '';
}

if (placeId()) {
  track('view', { place: placeId() });
  setTimeout(() => track('engaged', { place: placeId() }), 30000);
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const save = target?.closest<HTMLButtonElement>('[data-save]');
  if (save) {
    const id = save.dataset.save || '';
    const key = 'vg-saved';
    const list = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(key, JSON.stringify(next));
    save.setAttribute('aria-pressed', String(next.includes(id)));
    save.textContent = next.includes(id) ? 'Saved' : 'Save';
    track('save', { place: id });
  }
  const mapPin = target?.closest('[data-map-open]');
  if (mapPin && placeId()) track('map', { place: placeId() });
  const route = target?.closest('a[data-route]');
  if (route && placeId()) track('get-there', { place: placeId() });
  const menu = target?.closest('[data-menu]');
  if (menu) document.querySelector('.nav')?.classList.toggle('open');
  const searchToggle = target?.closest('[data-search-toggle]');
  if (searchToggle) document.querySelector('.topbar')?.classList.toggle('search-open');
});

const saved = JSON.parse(localStorage.getItem('vg-saved') || '[]') as string[];
document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((button) => {
  if (saved.includes(button.dataset.save || '')) {
    button.setAttribute('aria-pressed', 'true');
    button.textContent = 'Saved';
  }
});

let index: Item[] | null = null;
async function loadIndex() {
  if (!index) index = await fetch('/search.json').then((response) => response.json());
  return index || [];
}

function renderResults(items: Item[], query: string, panel: HTMLElement) {
  const q = query.trim().toLowerCase();
  panel.hidden = q.length < 2;
  panel.replaceChildren();
  if (q.length < 2) return;
  const ranked = items
    .map((item) => {
      const title = item.title.toLowerCase();
      const exact = title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
      const hit = `${item.title} ${item.vi || ''} ${item.text}`.toLowerCase().includes(q);
      return { item, exact, hit };
    })
    .filter((row) => row.hit)
    .sort((a, b) => a.exact - b.exact)
    .slice(0, 8);
  if (!ranked.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No matches. Browse destinations instead.';
    panel.append(empty);
    return;
  }
  for (const row of ranked) {
    const link = document.createElement('a');
    link.href = row.item.href;
    const name = document.createElement('span');
    name.textContent = row.item.vi ? `${row.item.title} · ${row.item.vi}` : row.item.title;
    const group = document.createElement('small');
    group.textContent = row.item.group;
    link.append(name, group);
    panel.append(link);
  }
}

const input = document.querySelector<HTMLInputElement>('#q');
const panel = document.querySelector<HTMLElement>('#search-panel');
if (input && panel) {
  const run = async () => {
    const items = await loadIndex();
    renderResults(items, input.value, panel);
  };
  input.addEventListener('focus', run);
  input.addEventListener('input', run);
}

const savedList = document.querySelector<HTMLElement>('#saved-list');
const catalogNode = document.querySelector<HTMLScriptElement>('#saved-catalog');
if (savedList && catalogNode) {
  const catalog = JSON.parse(catalogNode.textContent || '[]') as { id: string; name: string; href: string }[];
  const ids = JSON.parse(localStorage.getItem('vg-saved') || '[]') as string[];
  const chosen = catalog.filter((item) => ids.includes(item.id));
  if (!chosen.length) {
    savedList.textContent = 'Nothing saved yet. Use Save on a place page. The list stays in this browser.';
  } else {
    for (const item of chosen) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.name;
      li.append(link);
      savedList.append(li);
    }
  }
}

const sectionNav = [...document.querySelectorAll<HTMLElement>('nav.tabs')].find((nav) => nav.querySelector('a[href^="#"]'));
if (sectionNav) {
  const links = [...sectionNav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const sections = links
    .map((link) => document.getElementById((link.getAttribute('href') || '').slice(1)))
    .filter((section): section is HTMLElement => Boolean(section));
  const mark = (id: string) => {
    let current: HTMLAnchorElement | null = null;
    for (const link of links) {
      const on = link.getAttribute('href') === `#${id}`;
      if (on) {
        link.setAttribute('aria-current', 'location');
        current = link;
      } else {
        link.removeAttribute('aria-current');
      }
    }
    if (!current) return;
    const left = current.offsetLeft;
    const right = left + current.offsetWidth;
    if (left < sectionNav.scrollLeft || right > sectionNav.scrollLeft + sectionNav.clientWidth) {
      sectionNav.scrollTo({ left: Math.max(0, left - 12) });
    }
  };
  const sync = () => {
    if (!sections.length) return;
    const line = sectionNav.getBoundingClientRect().bottom + 12;
    let currentId = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) currentId = section.id;
    }
    mark(currentId);
  };
  sectionNav.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = (link.getAttribute('href') || '').slice(1);
    if (id) mark(id);
  });
  let ticking = false;
  document.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    },
    { passive: true },
  );
  sync();
}

document.querySelectorAll<HTMLElement>('[data-sort-root]').forEach((root) => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-sort]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      const list = root.querySelector<HTMLElement>('[data-sort-list]');
      const note = root.querySelector<HTMLElement>('[data-sort-note]');
      if (!list) return;
      const cards = [...list.children] as HTMLElement[];
      const mode = button.dataset.sort;
      if (mode === 'az') cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
      if (mode === 'recommended') cards.sort((a, b) => Number(b.dataset.dots || 0) - Number(a.dataset.dots || 0));
      if (mode === 'visited' && note) note.textContent = 'Visit counts appear after 28 days and 500 sessions. Recommended order is shown until then.';
      cards.forEach((card) => list.append(card));
    });
  });
  const select = root.querySelector<HTMLSelectElement>('[data-sort-select]');
  const groupSelect = root.querySelector<HTMLSelectElement>('[data-group-select]');
  const note = root.querySelector<HTMLElement>('[data-sort-note]');
  const resort = () => {
    const mode = select?.value || 'recommended';
    root.querySelectorAll<HTMLElement>('[data-sort-list]').forEach((list) => {
      const cards = [...list.querySelectorAll<HTMLElement>(':scope > .jg-card')];
      if (mode === 'az') cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
      if (mode === 'recommended' || mode === 'visited') {
        cards.sort((a, b) => Number(a.dataset.rank || 0) - Number(b.dataset.rank || 0));
      }
      if (mode === 'visited' && note) {
        note.textContent = 'Visit counts appear after 28 days and 500 sessions. Recommended order is shown until then.';
      }
      if (mode !== 'visited' && note) note.textContent = '';
      cards.forEach((card) => list.append(card));
    });
  };
  const regroup = () => {
    const kind = groupSelect?.value || 'all';
    root.querySelectorAll<HTMLElement>('[data-kind-block]').forEach((block) => {
      block.hidden = kind !== 'all' && block.dataset.kindBlock !== kind;
    });
  };
  select?.addEventListener('change', resort);
  groupSelect?.addEventListener('change', regroup);
});

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
  const row = root.querySelector<HTMLElement>('[data-carousel-row]');
  if (!row) return;
  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const step = () => Math.max(row.clientWidth * 0.72, 220);
  const paint = () => {
    const max = row.scrollWidth - row.clientWidth;
    if (prev) prev.hidden = row.scrollLeft < 8;
    if (next) next.hidden = max <= 8 || row.scrollLeft > max - 8;
  };
  prev?.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
  row.addEventListener('scroll', paint, { passive: true });
  paint();
});

document.querySelectorAll<HTMLElement>('[data-region-stage]').forEach((stage) => {
  const show = (slug: string) => {
    stage.querySelectorAll<HTMLElement>('[data-region-card]').forEach((card) => {
      card.hidden = card.dataset.regionCard !== slug;
    });
    stage.querySelectorAll<HTMLElement>('[data-region]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.region === slug);
    });
  };
  const read = (target: EventTarget | null) => (target as HTMLElement | null)?.closest<HTMLElement>('[data-region]')?.dataset.region;
  stage.addEventListener('pointerover', (event) => {
    const slug = read(event.target);
    if (slug) show(slug);
  });
  stage.addEventListener('focusin', (event) => {
    const slug = read(event.target);
    if (slug) show(slug);
  });
});

function localIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function chosen(select: HTMLSelectElement | null) {
  const option = select?.selectedOptions[0];
  return { slug: option?.value || '', name: option?.textContent?.trim() || '' };
}

function go(href: string, kind: string) {
  const link = document.createElement('a');
  link.href = href;
  if (kind !== 'site') {
    link.target = '_blank';
    link.rel = kind === 'partner' ? 'sponsored noopener' : 'noopener';
  }
  document.body.append(link);
  link.click();
  link.remove();
}

document.querySelectorAll<HTMLElement>('[data-book]').forEach((root) => {
  const form = root.querySelector<HTMLFormElement>('[data-book-form]');
  const note = root.querySelector<HTMLElement>('[data-book-note]');
  const submit = root.querySelector<HTMLButtonElement>('[data-book-submit]');
  const error = root.querySelector<HTMLElement>('[data-book-error]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-book-tab]')];
  const checkIn = root.querySelector<HTMLInputElement>('[data-stay-in]');
  const fallback = root.querySelector<HTMLAnchorElement>('.book-fallback a');
  const stayHref = () => {
    const city = chosen(root.querySelector('[data-stay-city]'));
    const nights = root.querySelector<HTMLSelectElement>('[data-stay-nights]')?.value || '1';
    const adults = root.querySelector<HTMLSelectElement>('[data-stay-adults]')?.value || '2';
    const url = new URL(stayLink(city.name || 'Vietnam'));
    if (checkIn?.value) url.searchParams.set('checkIn', checkIn.value);
    url.searchParams.set('los', nights);
    url.searchParams.set('adults', adults);
    return { city: city.name || 'Vietnam', href: url.toString() };
  };
  const syncStayLink = () => {
    if (!fallback) return;
    const stay = stayHref();
    fallback.href = stay.href;
    fallback.textContent = `Search stays for ${stay.city} on Agoda`;
  };
  if (checkIn && !checkIn.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkIn.min = localIso(new Date());
    checkIn.value = localIso(tomorrow);
  }
  syncStayLink();
  root.querySelector('[data-book-fields="stay"]')?.addEventListener('change', syncStayLink);
  const selectTab = (tab: HTMLButtonElement) => {
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    root.querySelectorAll<HTMLElement>('[data-book-fields]').forEach((panel) => {
      panel.hidden = panel.dataset.bookFields !== tab.dataset.bookTab;
    });
    if (note) note.textContent = tab.dataset.note || '';
    if (submit) submit.textContent = tab.dataset.submit || 'Search';
    if (error) error.hidden = true;
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab)));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const tab = tabs.find((item) => item.getAttribute('aria-selected') === 'true') || tabs[0];
    const mode = tab?.dataset.bookTab || 'stay';
    const kind = tab?.dataset.kind || 'site';
    if (error) error.hidden = true;
    if (mode === 'stay') {
      syncStayLink();
      go(stayHref().href, kind);
      return;
    }
    if (mode === 'flight' || mode === 'bus') {
      const fields = root.querySelector<HTMLElement>(`[data-book-fields="${mode}"]`);
      const from = chosen(fields?.querySelector('[data-trip-from]') || null);
      const to = chosen(fields?.querySelector('[data-trip-to]') || null);
      if (!from.slug || from.slug === to.slug) {
        if (error) {
          error.hidden = false;
          error.textContent = 'Choose two different places.';
        }
        return;
      }
      go(mode === 'flight' ? flightLink(from.name, to.name) : busLink(`${from.slug}/${to.slug}`), kind);
      return;
    }
    if (mode === 'train') {
      go(trainLink, kind);
      return;
    }
    go(mode === 'food' ? '/food' : '/itineraries', kind);
  });
});
