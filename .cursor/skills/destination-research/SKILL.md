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

Take the place `node scripts/board.mjs next` names. Do not pick a different city because this skill used to list Hue first. Read existing JSON only to see what is already published. Published pages are not a source.

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

Set `STATUS.md` to `researching` at the start. Set it to `stored` only when the gate below passes. Leave `ready for copy` blank until then. Read `.cursor/skills/content-board/SKILL.md` first and claim the research unit before you write. If this run already holds that claim, claim again and keep going.

## How to research

Search primary pages first: the site or park, the museum, UNESCO, the airport or railway, the provincial tourism office, and the event organizer. Use a second source before recording a fee, a duration, or a date. If those sources disagree, write both figures and name both sources.

Record the accessed date. Today’s check date is written as `19 Oct 2026`.

If a fee, hour, or date has no source, write `Check on arrival` and `UNSOURCED` next to it. Do not invent a number. Do not state a visa rule.

Name areas, not a restaurant or hotel catalog. A hotel brand is never a pick. A shop name is a source clue, marked `do not publish as a pick`, unless it is one of the few scene landmarks in **Why a night here**.

## The scene people book

A dossier that only lists tickets produces a flat page. `attractions.md` opens with **Why a night here**, before the sight entries:

- The picture a traveler expects to wake up to. For a beach city that is the sand, the water, and the buildings on the front, not the airport.
- Where they sleep, as an area (beachfront resort, river hotel). Never a hotel brand.
- Where the evening is, as streets they can walk.
- Scene landmarks: at most a few venues that orient that evening, each with a primary URL. They are pins, not a ranked bar guide. No prices, no scores, no “best of” list. If the owner named a venue, record it and still attach a source. If that source has no street, write `Check on arrival` for the address.
- What the hero must include, and which edge a tight crop would cut off.

`Photo must show` names the frame. “Sand and water” is not enough. Write “the surf, the sand, and the resort towers in one frame, subject through the center.” Say when a portrait of a statue will lose its head on a landscape card. A frame that is mostly empty sky, empty sand, fog, or a slice of a torso does not pass.

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

## Depth: streets, night, and the ordinary day

A dossier of ticketed sights is not finished. Da Nang is the example: An Thuong is an area, and a food alley such as Huynh Thuc Khang is an area. A stall list is not.

Add these headings, using the entry shape in the template:

- `food.md`: `## Food streets and markets`. Each alley, market, or eating street people treat as a destination gets its own entry. Kind `food-street`.
- `attractions.md`: `## Nightlife and evening`. The streets a traveler walks after dark. Kind `nightlife`. A few scene landmarks may pin the area, each with a primary URL. They are pins, not a ranked bar guide, and they have no prices and no scores.
- `attractions.md`: `## Lifestyle`. How an ordinary day goes: breakfast area, the swim or the walk, the cafe street, the hour the city goes quiet. Kind `lifestyle`. Areas, not a hotel brand.

Write `None recorded` under a heading only when you looked and that layer is not part of this place, and name the source that shows you looked.

If the owner named a street and you cannot find a primary source, do not invent the address. Leave that board item `blocked` with the question.

## Lanes

One run does the lane `node scripts/board.mjs next` prints. It does not finish the other lanes.

| Lane | Fill this | Then set |
|---|---|---|
| `researchBase` | Why a night here, and getting there | — |
| `researchAttractions` | Sights and areas | `sights`, `areas` |
| `researchFood` | Dishes, markets, food streets | `foodStreets` |
| `researchNightlife` | Evening areas | `nightlife` |
| `researchLifestyle` | The ordinary day | `lifestyle` |
| `researchContext` | Events and side trips | `events`, `sideTrips` |

Restaurant and bar names that helped you find a street go in `food.md` under `## Notes, not pages`, each with a source and the words `do not publish as a pick`. Group them under the street. A scene landmark already in Why a night here can stay a pin. Do not turn that list into a public restaurant page.

## Board

Read `.cursor/skills/content-board/SKILL.md`. Add every entry with `node scripts/board.mjs add-item`, or `set-item` when the row exists. Set that lane’s buckets with `node scripts/board.mjs cover`. `filled` means a planning trip could use the list. `partial` does not pass. An entry that should not have its own page is still an item: set page, copy, and quality to `skipped` and put the reason in the note.

Store the lane with `node scripts/board.mjs complete --place <slug> --stage <lane> --status stored`. If the hour ends first, use `--status needs_depth` and name the gap. While any lane is open, `STATUS.md` says `needs depth`. It says `stored` only when the last lane is stored.

## Gate

One lane is done when its own section, buckets, and items are stored. The dossier as a whole is `stored` only when every lane is, and then all of the following are true:

- All six body files exist and none is a heading with an empty list
- `food.md` has `## Food streets and markets`, and `attractions.md` has `## Nightlife and evening` and `## Lifestyle`, each with entries or `None recorded`
- Every fee, hour, date, and duration has a source line or `UNSOURCED`
- `sources.md` lists each URL, publisher, and access date
- Side trips name real slugs or a placeholder
- Interest titles are local to this destination
- No public content file was edited
- This run stored its own lane. `STATUS.md` says `stored` only when no lane is left open.

Then tell the user the folder path. Do not start page setup in the same turn. The board’s next stage does that.

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
