---
name: destination-research
description: >-
  Researches one Vietnam province or city into a stored dossier covering
  attractions, events and to-do, side trips, local food, exploration by
  interest, and getting there. Use during the setup phase, before the Graphic
  and Copy Writing Agent, when the user asks to research a destination,
  province, city, or town.
---

# Destination research

Setup phase only. Research one province, city, or town. Store the dossier. Stop.

Store your research before you can pass on to Graphic & Copy Writing Agent.

Do not edit `src/content`, `public/photos`, or partner links in this pass. Do not write headlines, SEO titles, or page prose. The Graphic and Copy Writing Agent uses `.cursor/skills/city-setup/SKILL.md` after `research/<slug>/STATUS.md` says `stored`.

## Unit

One destination per pass. Use the search-name slug already on the site (`hue`, `da-nang`, `hoi-an`). Do not rename a place under a province slug. A province and its main city can share a dossier only when travelers treat them as one base. My Son stays `my-son`. Phong Nha stays `phong-nha`.

On the Central Coast, work in this order unless the user names one: Hue, Da Nang, Hoi An, My Son, Phong Nha. Read existing JSON only to see what is already published. Published pages are not a source.

## Where to store it

Copy [template.md](template.md) into `research/<slug>/` and fill every section. Files:

- `STATUS.md`
- `attractions.md`
- `events.md`
- `side-trips.md`
- `food.md`
- `interests.md`
- `getting-there.md`
- `sources.md`

Set `STATUS.md` to `researching` at the start. Set it to `stored` only when the gate below passes. Leave `ready for copy` blank until then.

## How to research

Search primary pages first: the site or park, the museum, UNESCO, the airport or railway, the provincial tourism office, and the event organizer. Use a second source before recording a fee, a duration, or a date. If those sources disagree, write both figures and name both sources.

Record the accessed date. Today’s check date is written as `19 Oct 2026`.

If a fee, hour, or date has no source, write `Check on arrival` and `UNSOURCED` next to it. Do not invent a number. Do not state a visa rule.

Name areas, not a restaurant or hotel catalog. A shop name is allowed only as a source clue, marked `do not publish as a pick`.

## What each file must hold

Use the headings in the template. They match the brief:

1. Attractions (Sight, area of interests, zone, hub, etc.) — detailed content
2. Events and to-do
3. Side trips
4. Comprehensive list of local food to try
5. Exploration by interest area (localized to the locations)
6. getting there

Attractions are comprehensive for a planning trip, not a top five. Include sights, areas, zones, and hubs. For each one record: Vietnamese name, kind (`sight`, `area`, `zone`, `hub`, or `district`), the area it sits in, what a visitor actually sees or does, time needed, fee, how to reach it from the usual base, when to go, the mistake to avoid, the local interest it serves, a suggested slug, a suggested dot from 1 to 5 with a one-line reason, and what a photo must show. Note when a district is a destination of its own.

Events and to-do are recurring festivals plus activities that are not already an attraction. A date that moves is `Check on arrival`. Do not copy an attraction into this file.

Side trips are day or overnight trips from this base. Give travel time, why someone goes, and whether a place slug already exists. If it does not, mark `Side trip placeholder: {name}` and do not research that neighbor’s dossier in this pass.

Food is the local list: Vietnamese name, what it is, how to eat it, when to order it, and the area. Include breakfast, sweets, and drinks when the place has them. Name the neighbor’s dishes only so copy can link them. No stall prices.

Exploration by interest uses local titles, not another city’s list. One card is the food guide. Map a title to an existing interest key only when it fits: `food`, `oldTowns`, `pagodas`, `caves`, `beaches`, `islands`, `mountains`, `rice`, `markets`, `warHistory`, `coffee`, `nightlife`, `family`, `photography`, `motorbike`. Suggest an icon of `food`, `beach`, `drink`, `museum`, or `view`.

Getting there covers air, rail, road, and bus from the usual previous stop, with station or airport names, durations, and how to move around on site. Mark an unsourced duration as approximate.

## Gate

`stored` requires all of the following:

- All six body files exist and none is a heading with an empty list
- Every fee, hour, date, and duration has a source line or `UNSOURCED`
- `sources.md` lists each URL, publisher, and access date
- Side trips name real slugs or a placeholder
- Interest titles are local to this destination
- No public content file was edited

Then tell the user the folder path and that the Page Setup Agent can polish it with `.cursor/skills/graphic-copy/SKILL.md`. Do not start that pass in the same turn.

## Example attraction entry

```markdown
### Japanese Covered Bridge
- Vietnamese name: Chùa Cầu
- Kind: sight
- Area: Old town
- What the visitor does: Walk the short covered bridge at the west end of the old town. A small temple is attached.
- Time: 20 minutes
- Fee: Check on arrival — UNSOURCED (ticket rules change)
- From the base: Walk
- When to go: Morning, before tour groups
- Mistake to avoid: Budgeting a museum hour for a bridge you can see from the street
- Local interest: Old town
- Suggested slug: japanese-bridge
- Suggested dot: 4 — a landmark inside a day built around the old town, not a day by itself
- Photo must show: the covered bridge from the street, in color, one frame
- Sources: S1
```

That entry is the index for the city dossier. It is not the attraction page. A finished sight follows `.cursor/skills/attraction-page/SKILL.md` and is stored first at `research/<place>/attractions/<slug>.md`.
