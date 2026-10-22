---
name: attraction-page
description: >-
  Researches, writes, and photographs one Vietnam Guide attraction to the
  finished Da Nang sight-page standard: a kicker, a sourced notice, body, a
  second photo of that subject, getting there from named starts, and hours
  and fees. Use when the user asks to improve, rewrite, or add an attraction
  page, or names a sight page or the attraction template.
---

# Attraction page

One sight per pass. The finished Da Nang records are the standard. Copy their shape. Do not copy their sentences, fees, hours, or photos onto another sight.

The reference record is `src/content/attractions/da-nang--ba-na.json`. The same field set is on the other finished Da Nang sights, including `da-nang--my-khe.json`, `da-nang--cham-museum.json`, `da-nang--marble-mountains.json`, and `da-nang--dragon-bridge.json`. `da-nang--an-thuong.json` is still a short record: a summary, a fee line, and a district, with no kicker, body, second photo, or hours section. Do not treat those missing fields as optional.

Follow `AGENTS.md`. How the page looks is `.cursor/skills/ui-ux/SKILL.md`. What the city page contains is `.cursor/skills/city-setup/SKILL.md`. A city dossier is the index, not the page. Deepen the sight in `research/<place>/attractions/<slug>.md` before editing public JSON. Copy [template.md](template.md). Set that file to `stored` only when every fee, hour, and duration has a source line or `UNSOURCED`.

## Hard rules

- Do not invent a fee, an hour, a drive time, a visa rule, a sight, a taste, or a history. If a number has no source, write “Check on arrival” and list it under Open questions.
- Where sources disagree, print both figures and name both sources. Do not average them.
- Stamp `verified` with the check date when a fact is checked.
- The season chip on the place is a traveler line. A sight-specific season goes in `bestMonths` and one sentence, and only when a source gives it. Do not turn the body into a weather report.
- Public sentences do not talk about the site. Leave out “its own page”, “no page here”, “this guide”, and “licensed photo was not filed”.
- Do not guess `lat` or `lng`. A map link renders only when the record has both, from a source. It is an OpenStreetMap link, not an iframe.
- Do not change an existing editorial dot. Dots stay 1 to 5. Do not edit rank-dot math.
- Partner URLs stay in `src/lib/partners.ts`. The stay row uses `stayLink`. Do not name a hotel, and do not paste a booking widget or a partner URL.
- A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`.
- Do not add a blog, an ad, a review count, a visitor rank, a forum, a combo price grid, or a booking form.

If no licensed photo of this sight exists, stop. Leave the page unpublished, and leave it off the city card. Do not borrow the city banner, a beach, a pile of chairs, or a neighboring sight. Record `unpublished: no licensed photo` in the attraction research file.

## Page, top to bottom

`src/components/AttractionView.astro` renders this. Fill the fields. Do not invent a second layout. The article uses `wrap`. Do not add the class `attraction`.

1. Breadcrumb: Destinations, the corridor, the city, the sight.
2. Title, with `nameVi` beside it when the record has one. `district` prints as the meta line. Da Nang uses local areas: The beach, The river, The hills, South shore, Son Tra.
3. `kicker`. One line. What it is. Ba Na’s is “Hill resort built around the Golden Bridge”.
4. `summary`, the decision lede, under the kicker and before the dots.
5. Editor dots. Do not change an existing dot.
6. Hero photo, then `heroCaption`, then the credit. The caption names the frame.
7. Fact bar: time, the main fee, the short get-there line, best months. Best months come from the sight when `bestMonths` is set, otherwise from the place. The verification line uses the sight’s `verified` when set.
8. Tabs, only for sections that exist: Intro, Get there, Hours & fees, Also in, Stay.
9. `notice`, when a fact would waste the day: a closure, a move, a ticket that does not include the thing people came for. Ba Na’s notice says the basic ticket is not every ride. My Khe’s notice says to read the duty board.
10. `body`. At least two paragraphs. The first figure follows the first paragraph. Later figures follow the next paragraphs.
11. Getting there and around. `gettingThere` paragraphs, then `legs`. Each leg has a heading that names the start (“From Da Nang”, “From the Han River”) and a body with the mode and the time.
12. Hours and fees. Rows for `hours`, `closed`, and admission. Admission is `admissionNote` when set, otherwise the fact-bar fee. Official `links` sit at the end of this section.
13. Also in {Place}: photo cards of the other sights, no new rank numbers. Then the link to all attractions.
14. One stay row, only on a page that has `body`. The button uses `stayLink`. The disclosure says we may earn a commission. The row does not name a hotel.

A record with no `body` still renders the stub: lede, hero, fact bar, and the Also in cards. That record is not finished. An Thuong is that stub.

## Research

Store the pass at `research/<place>/attractions/<slug>.md` before the public edit. Primary pages first: the site or park, the museum, UNESCO, the city tourism office, the railway or airport. Use a second source before recording a fee, a duration, or a date. If they disagree, write both figures and name both sources.

Record the access date. Skip the operator’s world-record lines, coupons, and “wonder of the world” claims. Skip a combo price grid. The page prints the basic ticket, who counts as a child, what that ticket includes, and the extras that cost more, without a menu of every combo.

When a timetable is only an image and the text does not contain the hours, write `Check on arrival` for the line you could not read. Keep any hour a second official page states in words.

The city dossier entry can be the start. It is not enough on its own when it lacks hours, a named start, or a photo brief for two frames.

## Copy

Second person. The `summary` is the decision sentence: what the day is, and when to skip it. It stays under about 80 words. The body does the rest.

Useful means a time of day, how long it takes on site, how to arrive, and the mistake that wastes the visit. Interesting means one concrete thing the reader could see. Do not copy another site’s sentences.

The fact-bar `fee` is the main price a non-resident adult pays, or “Check on arrival”. The bands, inclusions, and extras go in `admissionNote`. The fact-bar `getThere` stays one line. The section is longer.

`kicker` is a label. It is not a second lede.

The notice is one fact. If the body already says it in full, cut the notice.

Do not add `seoTitle`. Attractions do not have that field.

## Photos

Open the file and look at it. A licensed photo of this subject is required. A stand-in is a failure.

Keep a photograph when all of these are true:

- The subject is obvious in one glance, in color, in one frame.
- Light has a direction: sun on the subject, a clear sky, or a dusk that still shows the form.
- The frame has depth: something in front, the sight, and something behind it.
- A card crop still shows the sight. The subject is not a speck in a corner that `object-fit` will cut.
- The file is a normal JPEG under 320 KB.
- You can name the author, the license, and the file page. Do not invent a credit.

The hero is the view a traveler recognizes. The second frame is a different moment of the same sight: the thing you do there, a detail, or another hour. It uses the id `{placeSlug}-{slug}-2`. Do not publish the same file twice.

Da Nang’s city hero is the sand, the water, and the resort front. That file is the wrong hero for a sight. A pile of blue plastic chairs is the wrong hero for the city and the wrong hero for a sight. My Khe’s card may include chairs when the towers and the sand are still the subject.

Reject these even when the title names the place:

- A gray wash where the subject does not read. Fog is allowed only when the road, gate, or building still has an edge.
- Mostly sky, a distant speck, a sign, a ticket window, a logo, a map, a collage, or text burned into the picture.
- Soldiers, weapons, documents, posters, and watermarks.
- A trash bin, a cable, or a selfie that competes with the sight.
- Another sight, the city banner, or a generic street.

House examples, already on disk:

- Keep `public/photos/da-nang-ba-na.jpg`. The stone hands and the gold curve fill the frame, above the cloud sea.
- Keep `public/photos/da-nang-ba-na-2.jpg`. Same bridge, the end of the day, the coast behind the hands.
- Replace `public/photos/da-nang-hai-van.jpg` when that sight is the pass and the frame fails the test above. Do not replace it in a pass about another sight.

`scripts/fetch-photos.mjs` is a first search. It is not a judgment. Do not run it over a file you have already accepted.

## Fields

On `Attraction` in `src/lib/types.ts`. A stub may omit the optional fields. A finished page has the ones marked required below.

| Field | Required when finished | What it holds |
|---|---|---|
| `summary` | yes | The decision lede. |
| `kicker` | yes | One line under the title. |
| `district` | yes on a city that has areas | A local area, the way Da Nang uses The beach, The river, The hills, South shore, and Son Tra. |
| `heroCaption` | yes | What the hero frame shows. |
| `verified` | yes | The check date, `20 Oct 2026` style. |
| `body` | yes, at least two paragraphs | What you do, one detail, the decision. |
| `figures` | yes, at least one | `{ id, caption, alt? }`. The first sits after paragraph one. The id is a second licensed photo of this sight. |
| `gettingThere` | yes | Longer than the fact-bar line. |
| `legs` | when a second start exists | `{ heading, body }`. |
| `hours` | hours or `closed` | Open, and last entry when it differs. |
| `closed` | hours or `closed` | Weekly close, seasonal close, or the board to check. |
| `admissionNote` | when the fee has bands | Child rule, inclusions, extras. |
| `notice` | when one fact would waste the day | `{ title, body }`. |
| `links` | when an official page exists | `{ label, url, note? }`. `https` only. |
| `bestMonths` | only with a sight-specific source | Otherwise leave it unset and the place’s months show. |
| `lat`, `lng` | only with a sourced coordinate | No map without both. |

`fee`, `timeNeeded`, `getThere`, `dots`, and `interests` stay on every record, including stubs.

## Checklist

```
- [ ] A licensed photo of this sight exists. A stand-in stays unpublished
- [ ] `research/<place>/attractions/<slug>.md` says `stored` before the public edit
- [ ] Every fee, hour, and duration has a source, or “Check on arrival”
- [ ] Disagreements are both printed, not averaged
- [ ] No site-talk, no guessed coordinate, no invented taste or history
- [ ] Kicker, lede, notice if needed, and at least two body paragraphs
- [ ] `district` is this city’s own area name
- [ ] Getting there names a start a traveler knows; a second leg only when sourced
- [ ] Hours, closed, and admission are filled or explicitly check on arrival
- [ ] Hero and second photo were opened and kept under the photo rules, with credits
- [ ] No review count, visitor rank, ad, iframe, combo grid, or hotel name
- [ ] Existing editorial dots were not changed
- [ ] Templates, global.css, and src/lib/partners.ts were not edited
- [ ] npm run check:content
```

## Draft summary

- Status: `paged` for this sight
- Files touched
- Facts used, each with its source id in the attraction research file
- “Check on arrival” lines
- Photos kept or replaced, and why
- The dot, only if the record is new
