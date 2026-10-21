---
name: attraction-page
description: >-
  Researches, writes, and photographs one Vietnam Guide attraction to the
  Tokyo sight-page standard: a kicker, a sourced notice, body, a second
  photo, getting there from named starts, and hours and fees. Use when the
  user asks to improve, rewrite, or add an attraction page, or names Tsukiji,
  Hama Rikyu, a sight page, or the attraction template.
---

# Attraction page

One sight per pass. This skill is the basis for every attraction page. The reference record is `src/content/attractions/da-nang--ba-na.json`. Copy its shape. Do not copy its sentences, its fee, or its photos onto another sight.

Follow `AGENTS.md`. How the page looks is `.cursor/skills/ui-ux/SKILL.md`. A city dossier is the index, not the page. Deepen the sight in `research/<place>/attractions/<slug>.md` before editing public JSON. Copy [template.md](template.md). Set that file to `stored` only when every fee, hour, and duration has a source line or `UNSOURCED`.

Do not invent a fee, an hour, a drive time, a coordinate, a visa rule, or a credit. If a number has no source, write “Check on arrival” and list it under Open questions. Stamp `verified` with the check date when a fact is checked. Where sources disagree, print both figures and name both sources. Do not add a blog, an ad, a review count, a visitor rank, a forum, a map iframe, or a booking form.

A later decision changed the photo gate. If no licensed photo of this sight exists, stop. Leave the page unpublished, and leave it off the city card. Do not borrow the city banner, a beach, or a neighboring sight. Record `unpublished: no licensed photo` in the attraction research file. The rest of this sight-page standard is unchanged.

## What was wrong

The old page was a lede, editor dots, one photo, and a four-cell fact bar. That is a stub. A reader still does not know what they will see, what the ticket leaves out, how to arrive from a place they already know, or when the gate shuts.

The Tokyo sight pages (Tsukiji Outer Market, Hama Rikyu) are the shape to match:

- A one-line kicker under the title, saying what the place is.
- A large photograph with a caption that names the frame.
- Section tabs: Intro, Get there, Hours and fees.
- A short notice when one fact would waste the day.
- Several paragraphs: what you do, one concrete detail, the decision.
- A second photograph inside the prose, with its own caption.
- Getting there from a named start, then a second start when a source has it, with the mode and the time.
- Hours, closed, and admission as their own rows.
- Links to the official page.
- Other sights as photo cards.

Keep our own chrome. Editor dots stay 1 to 5. Do not print a star average, a review count, or “#20 of 84 most visited.” The fact bar stays. It does not replace the sections. The Vietnamese name stays beside the English title. There is no city sidebar. Hotels are one labeled stay row, not a property list.

## Page, top to bottom

`src/components/AttractionView.astro` renders this. Fill the fields. Do not invent a second layout. The article uses `wrap`. Do not add the class `attraction`; that name is already a two-column grid.

1. Breadcrumb: Destinations, the corridor, the city, the sight.
2. Title, with `nameVi` beside it when the record has one.
3. `kicker`. One line. What it is, not a slogan.
4. `summary`, the decision lede, under the kicker and before the dots.
5. Editor dots. Do not change an existing dot.
6. Hero photo, then `heroCaption`, then the credit.
7. Fact bar: time, the main fee, the short get-there line, best months. Best months come from the sight when `bestMonths` is set, otherwise from the place. The verification line uses the sight’s `verified` when set.
8. Tabs, only for sections that exist: Intro, Get there, Hours & fees, Also in, Stay.
9. `notice`, when a fact would waste the day: a closure, a move, a ticket that does not include the thing people came for.
10. `body`. At least two paragraphs. The first figure follows the first paragraph. Later figures follow the next paragraphs.
11. Getting there and around. `gettingThere` paragraphs, then `legs`. Each leg has a heading that names the start (“From Da Nang”) and a body with the mode and the time.
12. Hours and fees. Rows for `hours`, `closed`, and admission. Admission is `admissionNote` when set, otherwise the fact-bar fee. Official `links` sit at the end of this section.
13. Also in {Place}: photo cards, no new rank numbers. Then the link to all attractions.
14. One stay row, only on a page that has `body`. The button uses `stayLink`. The disclosure says we may earn a commission. The row does not name a hotel.

A map link renders only when the record has `lat` and `lng`. It is an OpenStreetMap link, not an iframe. Do not geocode from memory.

A record with no `body` still renders the stub: lede, hero, fact bar, and the Also in cards. Do not call that record finished.

## Research

Store the pass at `research/<place>/attractions/<slug>.md` before the public edit. Primary pages first: the site or park, the museum, UNESCO, the city tourism office, the railway or airport. Use a second source before recording a fee, a duration, or a date. If they disagree, write both figures and name both sources. Do not collapse them into a number you prefer.

Record the access date. Skip the operator’s world-record lines, coupons, and “wonder of the world” claims. Skip a combo price grid. The page prints the basic ticket, who counts as a child, what that ticket includes, and the extras that cost more, without a menu of every combo.

When a timetable is only an image and the text does not contain the hours, write `Check on arrival` for the line you could not read. Keep any hour a second official page states in words.

The city dossier entry can be the start. It is not enough on its own when it lacks hours, a named start, or a photo brief for two frames.

## Copy

Second person. The `summary` is the decision sentence: what the day is, and when to skip it. It stays under about 80 words. The body does the rest.

Useful means a time of day, how long it takes on site, how to arrive, and the mistake that wastes the visit. Interesting means one concrete thing the reader could see. Do not copy another site’s sentences. Do not turn `intro` into a weather report. A sight-specific season goes in `bestMonths` and one sentence, and only when a source gives it.

The fact-bar `fee` is the main price a non-resident adult pays, or “Check on arrival”. The bands, inclusions, and extras go in `admissionNote`. The fact-bar `getThere` stays one line. The section is longer.

`kicker` is a label: “Hill resort built around the Golden Bridge”, “Market for fresh seafood”. It is not a second lede.

The notice is one fact. If the body already says it in full, cut the notice.

Do not add `seoTitle`. Attractions do not have that field.

## Photos

Open the file and look at it. A captivating frame is the standard, not a bonus.

Keep a photograph when all of these are true:

- The subject is obvious in one glance, in color, in one frame.
- Light has a direction: sun on the subject, a clear sky, or a dusk that still shows the form.
- The frame has depth: something in front, the sight, and something behind it.
- A card crop still shows the sight. The subject is not a speck in a corner that `object-fit` will cut.
- The file is a normal JPEG under 320 KB.
- You can name the author, the license, and the file page. Do not invent a credit.

The hero is the view a traveler recognizes. The second frame is a different moment: the thing you do there, a detail, or another hour. It uses the id `{placeSlug}-{slug}-2`. Do not publish the same file twice. Do not borrow the city banner, a beach, or a neighboring sight.

Reject these even when the title names the place:

- A gray wash where the subject does not read. Fog is allowed only when the road, gate, or building still has an edge.
- Mostly sky, a distant speck, a sign, a ticket window, a logo, a map, a collage, or text burned into the picture.
- Soldiers, weapons, documents, posters, and watermarks.
- A trash bin, a cable, or a selfie that competes with the sight.

House examples, already on disk:

- Keep `public/photos/da-nang-ba-na.jpg`. The stone hands and the gold curve fill the frame, above the cloud sea.
- Keep `public/photos/da-nang-ba-na-2.jpg`. Same bridge, the end of the day, the coast behind the hands.
- Replace `public/photos/da-nang-hai-van.jpg` when that sight is the pass. The road is a faint line in cloud and the sea is missing. Do not replace it in a pass about another sight.

`scripts/fetch-photos.mjs` is a first search. It is not a judgment. Do not run it over a file you have already accepted.

## Fields

On `Attraction` in `src/lib/types.ts`. A stub may omit the optional fields. A finished page has the ones marked required below.

| Field | Required when finished | What it holds |
|---|---|---|
| `summary` | yes | The decision lede. |
| `kicker` | yes | One line under the title. |
| `heroCaption` | yes | What the hero frame shows. |
| `verified` | yes | The check date, `20 Oct 2026` style. |
| `body` | yes, at least two paragraphs | What you do, one detail, the decision. |
| `figures` | yes, at least one | `{ id, caption, alt? }`. The first sits after paragraph one. |
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
- [ ] A licensed photo of this sight exists. If it does not, the page stays unpublished
- [ ] `research/<place>/attractions/<slug>.md` says `stored` before the public edit
- [ ] Every fee, hour, and duration has a source, or “Check on arrival”
- [ ] Disagreements are both printed, not averaged
- [ ] Kicker, lede, notice if needed, and at least two body paragraphs
- [ ] Getting there names a start a traveler knows; a second leg only when sourced
- [ ] Hours, closed, and admission are filled or explicitly check on arrival
- [ ] Hero and second photo were opened and kept under the photo rules, with credits
- [ ] No review count, visitor rank, ad, iframe, combo grid, or hotel name
- [ ] Existing editorial dots were not changed
- [ ] npm run check:content
```

## Draft summary

- Status: `paged` for this sight
- Files touched
- Facts used, each with its source id in the attraction research file
- “Check on arrival” lines
- Photos kept or replaced, and why
- The dot, only if the record is new
