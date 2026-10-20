---
name: ui-ux
description: >-
  Applies the Vietnam Guide visual system from the finished city page: English
  place titles, fact bars, lacquer rules, photo cards, and spacing. Use when
  the user asks for a UI or UX pass, to match the city page, to apply the
  page guidelines, or to restyle attraction, food, dish, itinerary, festival,
  interest, home, destination, or guide templates.
---

# UI and UX

The city page is the reference. `src/components/PlaceView.astro` already follows this skill. A later pass brings one other template family up to the same standard.

This skill owns how a page looks. `.cursor/skills/city-setup/SKILL.md` owns what a destination contains. `.cursor/skills/graphic-copy/SKILL.md` owns prose and photo choice. Do not invent a fee, an hour, a sight, a photo, or a sentence in a visual pass. Do not add a blog, an ad, a visitor count, or a booking form.

One family per pass. Change the shared template, not one city’s JSON. Stop when that family’s checklist is done.

## Visual system

Paper background, ink text, muted notes. The accent is lacquer (`--lacquer`), used as a rule, the current tab, the recommended dot, and the word “stay”. Links stay blue. Do not add a green brand line.

Type is Source Sans 3. The page is `--page` wide. Body copy stays near `--measure`. The h1 is the page name, large, with a tight margin under it. A lede is the decision sentence, not a second title.

Corners are soft: the hero is 16px, a card is 16px with a 12px photo inside, the fact bar is 14px. Season and interest labels are pills, not small rectangles.

Icons are the line set in `src/components/Icon.astro`. They are lacquer strokes, not filled logos. Fact-bar icons are `clock`, `ticket`, `pin`, and `event`.

## Titles

A place title is the English search name. Do not print `nameVi` beside the h1 on a province, city, or district. Keep `nameVi` on the record for search and schema.

An attraction, dish, or festival may show `nameVi` beside its English name. That is the name of the thing, not a translation of the city.

## Fact bar

Use `src/components/FactBar.astro` when the cells are time, getting there, and best months.

- A place bar is those three cells. Do not show a fee. A city has no single ticket.
- An attraction bar adds the fee cell. If the fee has no source, the record already says “Check on arrival”. Do not drop the fee from a sight.
- The verification note under the bar stays: “Facts verified {date}. Fees and hours change; confirm before you go.” Show it only when the record has `verified`.

Other pages that already have a fact strip (itinerary, dish, festival) keep only cells that mean something: duration, budget, pace, origin, price band, or when. Set `--fact-cols` to the real count. The shared `.facts` rule defaults to 4 columns, so a shorter strip leaves an empty column until you set it. Add an icon only when the cell matches `clock`, `ticket`, `pin`, or `event`. Do not invent a cell to fill the row.

## Spacing

The section tabs sit on a 3px lacquer line. Leave a clear gap under that line before the first paragraph. On the city page this is `.place-body` (`padding-top: 2.25rem`).

Leave a clear gap under the first intro paragraph before the lead photo. On the city page this is `.prose-figure` (`margin-top: 3.5rem`). The paragraph must not sit on the picture.

Space between sections is larger than the space between paragraphs. On the city page a following section has `margin-top: 2.75rem`. Do not put a gray divider back between sections. A common-question answer keeps a line under the answer.

## Photos and cards

The hero has curved corners. The credit is a note under the photo: “Photo: {author} · {license}”.

After the first intro paragraph, one photo breaks the text. It is the highest-dotted attraction on that place. When several sights share that dot, use the one whose interest matches the place’s strongest interest, so a beach city leads with the beach. The caption is the sight’s name, with a short lacquer rule under it. The photo and the caption both link to that sight. If the attraction photo is missing, use the place photo.

Photos are cropped with a center cover, so the file has to be composed for the slot. The hero is 16:9 (`.place-photo`). An attraction card and the intro photo are 3:2 (`.jg-card .media`, `.prose-figure`). An interest card is a tall 3:4 (`.portrait`). Do not set a fixed rem height that slices a 3:2 file into a strip. Graphic and copy crops the file. This skill keeps the slot.

A sight, event, or side-trip card is `.jg-card`: photo on top, a round rank number on the photo, the name, one useful line, editor dots, and a light shadow. The whole card is the link. The image id is `{placeSlug}-{slug}`. A missing file falls back to the place photo.

An interest or itinerary row is `.portrait`: a tall rounded photo, the name and a small line icon on the image, a round white arrow at the right of the row. Hide the scrollbar. Do not put Previous and Next text buttons above the row.

An itinerary day is a photo on the left and the day title plus one paragraph on the right. The row links to that place. A walk keeps stop rows with the stop photo.

Hotels and restaurants stay the affiliate row: photo on the left, area name, one line, and a button. That row is not a booking widget.

## Tabs and sidebar

Tabs are sticky, white, and share the lacquer underline. The current item is lacquer. City tabs stay anchors on one page. Plan, food, and section tabs already use the same `.tabs` rule. Do not invent a second tab style.

The city sidebar is a stack of panels: Book your stay, Explore, Articles, Map. “Stay” is lacquer. Ads stay off. Do not paste that sidebar onto a page whose content skill does not ask for it.

## What is done

Place pages are done. Every province, city, and district renders through `PlaceView.astro`. Do not restyle one place ahead of the others.

These shared rules already reach other templates, without a full pass:

- `.facts` is a rounded strip. Only `FactBar` prints icons and sets the column count.
- `.tabs` is the lacquer underline, including plan, food, and section tabs.
- `.jg-card` is the soft card, including destination cards.
- Itinerary days are already photo rows.

## Still to do

Work top to bottom. One family, then stop. Mark it here when the template matches.

- [ ] **Attraction** — `src/components/AttractionView.astro`. The hero corners and the four-cell fact bar are already shared. Keep the Vietnamese name and the fee. Below the bar, “Also in” is still a text list. Bring that list up to `.jg-card` or the itinerary row. Do not add the city sidebar.
- [ ] **Food guide and dish** — `src/pages/food/[slug].astro`. Keep `nameVi` on a dish. The fact strip has no icons and still assumes 4 columns. A dish page needs a photo of the bowl, not a cityscape, and the section spacing of a city page. The longer food-guide structure (specialties, where to eat, breakfast, the neighbor) belongs to city-setup. This pass only applies the chrome those sections sit in.
- [ ] **Itinerary** — `src/pages/itineraries/[slug].astro`. Days are done. The fact strip is three cells in a four-column bar and has no icons. Set the column count and use icons only where the cell matches one.
- [ ] **Festival** — `src/pages/festivals/[slug].astro`. Keep `nameVi`. The “When” cell is already in the rounded strip, but it sits in a four-column bar and has no icon. Set the column count, use the calendar icon, and turn the place list into rows. Add a photo only when a real festival photo exists. Do not use the city banner and call it the event.
- [ ] **Interest** — `src/pages/interests/[slug].astro` and `src/pages/interests/index.astro`. Use the same cards as the city page. A nationwide interest links to the place guide. Do not title a block “Related interests”.
- [x] **Home and destinations** — `src/pages/index.astro`, `src/pages/destinations/index.astro`, `src/pages/destinations/[slug].astro`. Adopt the type, pills, cards, and lacquer. Do not copy the city sidebar or the city fact bar onto the homepage.
- [ ] **Reading pages** — plan guides, routes, seasons, about, search. Use the heading rule, the section gap, and tabs where the page already has sections. Do not add a hero, a fee, or a fact bar the record does not have.

## Pass checklist

```
- [ ] One template family
- [ ] Titles follow the place / attraction rule
- [ ] Fact cells match the record, with --fact-cols set
- [ ] Gaps under tabs and before a lead photo
- [ ] Photos and cards reuse the city classes
- [ ] No new fee, hour, sight, or sentence
- [ ] Local preview of that template and one neighbor that shares a component
```

End the pass with the files touched, the family marked above, and anything left because the content skill owns it.
