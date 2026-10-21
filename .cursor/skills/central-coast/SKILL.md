---
name: central-coast
description: >-
  Researches and drafts Central Coast Vietnam Guide content for Hue, Da Nang,
  Hoi An, My Son, and Phong Nha: places, attractions, food, festivals, routes,
  season notes, and SEO fields. Use when the user mentions the Central Coast,
  those destinations, a weekly content update, events, or files for that beat.
---

# Central Coast

Own the Central Coast beat only: Hue, Da Nang, Hoi An, My Son, and Phong Nha. Read [coverage.md](coverage.md) for the beat notes. The unit to do next is in `ops/board/`. Follow `AGENTS.md`. Do not invent a layout, a fee, an hour, or a visa rule. The six tourism regions replaced the old `central-coast` corridor. Do not recreate that file. Hue and Phong Nha use `north-central`. Da Nang, Hoi An, and My Son use `south-central-highlands`. Page shape is `.cursor/skills/city-setup/SKILL.md`.

## Setup phase

Research is not a public draft. For each destination, follow `.cursor/skills/destination-research/SKILL.md`, store the dossier in `research/<slug>/`, and stop. Do not edit `src/content` until that dossier’s `STATUS.md` says `stored`. The next stage is the one claimed on that place under `ops/board/places/`. A claimed stage is the request to draft. Read `.cursor/skills/content-board/SKILL.md` before taking it.

## Scope

In: Hue, Da Nang, Hoi An, My Son, and Phong Nha, their attractions (`<place>--<slug>.json`), food guides, dishes that name those places, festivals that name those places, routes that start or end there, and itineraries `central-5-days` and `hoi-an-old-town-walk`.

Out: northern and southern pages, rank dots on existing records, and partner URLs. Do not edit templates. A shared dish such as `banh-mi` may gain a coast sentence. Do not rewrite its other cities.

New place slugs stay the search name (`hoi-an`, `da-nang`). Add a public place file only when that place's file in `ops/board/places/` has `publish` set to `live` or `accepted`. Until then it stays `candidate`. Coverage.md can name it. The board is the lock.

## What to publish where

Blog posts follow `.cursor/skills/blog/SKILL.md`. This beat does not write them and does not schedule the scout. Floods, closures, and peak dates still go in the place `season`.

| Kind of news | Where it goes |
|---|---|
| Floods, closures, peak dates | Place `season`. Leave `intro` evergreen. |
| Recurring events | `src/content/festivals/` |
| A new sight | `src/content/attractions/<place>--<slug>.json` |
| A new dish or city food page | `src/content/dishes/` or `src/content/food/` |
| A new town | `src/content/places/<slug>.json` plus a real corridor, nearby slugs, and any route, dish, or itinerary you list |

If a fee or hour has no source, write “Check on arrival” and say so in the draft summary.

## Weekly pass

One pass, one reviewable diff. Do the first open item in coverage.md, then stop unless the user asked for a full sweep.

1. Search the open item. Prefer official pages: UNESCO, the site or park, Da Nang airport, provincial tourism, and the festival organizer. Cross-check a fee in a second source before writing a number.
2. Update the record. Set `verified` to the check date (`19 Oct 2026` style) on places. Stamp festivals and dishes in the draft summary, since those types have no `verified` field.
3. Fill SEO fields that the type already has (`seoTitle`, `seoDescription`). Attractions and festivals do not have those fields. Do not add them.
4. Run `npm run check:content`.
5. Update coverage.md: what was checked, the source, and the next open item.
6. Show the diff. The owner publishes by merging and building.

## SEO

Match the existing voice: a specific title, a description that states the decision the page helps.

- `seoTitle`: place name plus the useful promise. About 50–60 characters. Example: `Hoi An travel guide — what to do, how to get there, where to eat`.
- `seoDescription`: one sentence, about 140–160 characters, with a fact a traveler can use (days, ticket, season risk).
- FAQs answer a real planning question. One idea per answer.
- Link only to slugs that exist. The sitemap, breadcrumbs, Article, and FAQ schema are already rendered. Do not add a second markup system.

## Quality bar

Write for someone choosing how to spend the day. Follow the voice, photo, and food-guide rules in `.cursor/skills/city-setup/SKILL.md`. An attraction page follows `.cursor/skills/attraction-page/SKILL.md`. The reference record is Ba Na Hills. The city page’s Hotels, Restaurants, and Book your stay sidebar are affiliate placeholders from that skill. Name the sight, when to go, how to arrive, and the mistake to avoid. Use a concrete detail. Do not copy another site’s sentences, prices, or shop list.

Propose a dot from 1 to 5 on a **new** record, with a one-line reason in the draft summary. Do not change an existing dot.

## Draft summary

End every pass with:

- Files touched
- Facts checked, each with its source
- Anything left as “Check on arrival”
- SEO titles added or changed
- The next coverage item
