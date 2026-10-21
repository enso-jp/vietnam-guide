# Updating Vietnam Guide

Public pages are JSON records. Templates render them. Do not invent a layout, a fee, an hour, or a visa rule. Visual treatment follows `.cursor/skills/ui-ux/SKILL.md`.

## Files

- Places: `src/content/places/<slug>.json` — a destination shell. It does not embed attractions.
- Attractions: `src/content/attractions/<place>--<slug>.json` — one sight, with `placeSlug`.
- Dishes: `src/content/dishes/` — food and drink blocks.
- Festivals: `src/content/festivals/`
- City food: `src/content/food/`
- Practical guides: `src/content/guides/` — `block` is `tip`, `travel`, `tax`, or `living`.
- Routes: `src/content/routes/` — travel blocks between places.
- Corridors: `src/content/corridors/`
- Itineraries and walks: `src/content/itineraries/` — days and stops point at place, attraction, or dish slugs.
- Rice calendar: `src/content/seasons/rice.json`

Destinations, interests, and itineraries are assemblies of those blocks. Do not paste a destination card into a food or festival block.

## Rules

- Keep the search-name slug. Hoi An stays `hoi-an`. Ha Giang stays `ha-giang`. Do not move a place under a new province slug.
- If a fee or hour has no source, write “Check on arrival” and say so in the draft summary. Do not invent a number.
- Stamp `verified` when you check a fact.
- Season notes belong in `season`. Do not rewrite `intro` into a weather report.
- Required links on a place: a real corridor, nearby slugs that exist, and any route, dish, or itinerary slug you list.
- Do not edit rank math. Dots are an editorial field from 1 to 5.
- Partner URLs live in `src/lib/partners.ts`. Do not paste a booking widget or iframe into a page.
- Run `npm run check:content` before handing a draft back. `npm run build` also runs that check and the size budget.

## Work board

`ops/board/` is the status for research, page setup, copy, and quality. Read `.cursor/skills/content-board/SKILL.md` before a content pass. One worker takes one place and keeps going through that place's stages. Other places may run at the same time. Do not start a place another run has claimed.

Page templates, layout, styles, and `src/lib/partners.ts` stay with the owner. A content run does not edit them. Pause the hourly automation, or add a slug to `control.holdPlaces`, before you edit that destination’s content yourself.

## Setup research

Before a Graphic and Copy pass, store a dossier with `.cursor/skills/destination-research/SKILL.md` at `research/<slug>/`. One province, city, or town per pass. Do not edit public content in that pass. The Graphic and Copy Writing Agent drafts only after `research/<slug>/STATUS.md` says `stored`.

## City setup

A full city or province page follows `.cursor/skills/city-setup/SKILL.md`: attractions grouped by area, district pages, events, side-trip placeholders, local interests, one itinerary, and labeled partner links. Do not copy another city’s interest list. The facts come from that destination’s research dossier.

## Central Coast

The Central Coast beat is the `central-coast` corridor: Hue, Da Nang, Hoi An, My Son, and Phong Nha. Drafts for that beat follow `.cursor/skills/central-coast/SKILL.md`. The weekly queue is `.cursor/skills/central-coast/coverage.md`.

There is no blog type. Floods, closures, and peak dates go in the place `season` field. Recurring events go in `src/content/festivals/`. New sights, dishes, and towns use the existing content folders. Do not add a blog layout unless the owner asks for a new content type.

## Publish

Show the diff. The owner publishes by merging and building. Season text may be updated in the place `season` field when the owner has asked for that update.
