---
name: ui-ux
description: >-
  Applies the Vietnam Guide visual system and the decided page frames: the
  phone header, the homepage bands and six-region map, the destinations index,
  Plan a trip, and the Da Nang destination frame (one interest slider, six
  attraction cards, the food dish grid). Use when the user asks for a UI or
  UX pass, to match the city page, to apply the page guidelines, or to restyle
  attraction, food, dish, itinerary, festival, interest, home, destination, or
  guide templates.
---

# UI and UX

The city page is the reference, and Da Nang is the destination that fills it. `src/components/PlaceView.astro` already follows this skill. A later pass brings one other template family up to the same standard. Do not invent a second destination layout.

This skill owns how a page looks, including the frames already decided below. `.cursor/skills/city-setup/SKILL.md` owns what a destination contains. `.cursor/skills/graphic-copy/SKILL.md` owns prose and photo choice, including the selling-point sentence on a region line. Do not invent a fee, an hour, a visa rule, a sight, a taste, a history, a photo, or a sentence in a visual pass. The season chip stays a traveler line. Public copy does not say “its own page”, “no page here”, “this guide”, or “licensed photo was not filed”. Do not guess a coordinate. Do not edit rank-dot math. Partner URLs stay in `src/lib/partners.ts`. A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`. A visual pass may edit one template family. It still does not edit `partners.ts`. The blog type already exists; do not add a second one. Do not add an ad, a visitor count, a flight ad, or a booking form. Do not copy another city’s interest groups onto these frames.

A template that still shows an older stack is not the standard. Bring that family up to the frame in this skill.

One family per pass. Change the shared template, not one city’s JSON. Stop when that family’s checklist is done.

## Decided page frames

These frames are closed. A later pass uses them as they are written here.

### Header

On a desktop, Destinations, Interests, Itineraries, and Plan a trip sit centered in the bar. The logo stays on the left. Hover shows a photo panel of options. Clicking the name still opens the full page.

On a phone, the logo is centered and the menu is a button at the top right. The homepage opens on a cover photo. The phone menu is Home, Destinations, Interests, Itineraries, and Plan a trip. Saved is removed. The menu has no Forum, Sign in, or Videos.

### Homepage

`src/pages/index.astro`. The top is three bands with space between them: the hero, the highlight cards, and the story plus booking panel. The highlight cards do not cover the hero. The story and the booking panel share one top edge. Highlights and stories are blog posts. Do not invent a story, and do not schedule the blog scout from a visual pass.

The map is on the left and outlines every province. The regions are the six in `src/content/corridors/`: Northern Midlands & Mountains, Red River Delta, North Central Coast, South Central Coast & Central Highlands, Southeastern Vietnam, and Mekong Delta. A clicked region fills red and shows a dot and the name on each of its provinces. Hovering a province turns it light red and shows its dot and name. Unselected provinces are grey outlines with no labels. Hoang Sa and Truong Sa belong to South Central Coast & Central Highlands and are labeled as islands. The region controls sit with the map, not under a blank gap.

The photo cards on the right scale down to the map so no blank sits under the map. Each photo keeps the place name at the bottom left. The paragraph under the stack changes with the region and is the width of that column. See regions is centered under the whole block.

On a phone, the map keeps a margin on both sides so province names are not cut off. Each region is a swipe card under the map. The highlight, the photo, the name, and the one-line description change together.

### Destinations index

`src/pages/destinations/index.astro`. There is no “Vietnam / Find your destination” stack.

On a phone, the region map and the swipe card are both visible on the first screen. Under that, a numbered grid. The grid has no visitor-year line. The order may follow the latest published arrivals, stored so a later pass can use this site’s own visits. Editorial dots stay 1 to 5 and are not recalculated.

Under the grid, a region list. Each region has a small highlighted map. Each place has one plain selling-point line. Graphic and copy writes that sentence.

### Plan a trip

`src/pages/plan/index.astro`. On a phone, the page is a two-column card grid of the sections already on the site. A section that is longer has See all. Each section header links to `/plan/sections/{slug}` and that page lists the same guides, routes, and itineraries, except Itineraries: the heading and See all open `/itineraries`. The phone menu and the desktop Itineraries name open `/itineraries`. Vietnam travel news sits at the bottom and links to the existing blog posts, the same posts as the homepage highlights. Each card links into that blog. No invented stories, and no flight ad.

### Itinerary

`src/pages/itineraries/[slug].astro`. The fact bar is duration, budget, and pace. Duration uses the clock icon. Budget and pace do not.

A multi-day page is that bar and one photo card per day. Do not draw a route map. A day card links to the day plan when the record names one, and otherwise to the place.

A day plan is the same bar, then a stop timeline. Travel minutes sit on the leg between stops and come from that stop. Recommended additions render only when the record lists them. Do not invent a minute, a fee, or an hour.

### Destination page

`src/components/PlaceView.astro`, filled by `src/content/places/da-nang.json`. This frame is closed.

Top to bottom: breadcrumb, province line, English h1, decision lede, editorial dots, season chip plus the first four interest chips, 16:9 hero, fact bar with time, getting there, and best months. No fee cell on a place. Sticky tabs stay Intro, Attractions, By interest, Get there, Itineraries, Hotels, Restaurants, and Festivals when the place has events. The reading column is intro with the lead sight’s photo after the first paragraph, then common questions, then attractions, events, side trips, one interest slider, getting there, itineraries, hotel rows, and the food-guide row.

Attractions are one packed grid. Six cards, then a full-width “Show all” control. Area names stay on the records. They do not start a second grid, and Da Nang does not use a child district page for them. Events, when present, are photo cards under “Events”. Side trips are photo cards of the neighbor places. Hotels are the affiliate row: photo, area name, band, one line, Search stays. Restaurants is one row pointing at `/food/{slug}`.

### Interest row

On a place page, interests are one slider. Dining and F&B is the first card when this place has a food guide, and that card opens `/food/{slug}`. Resort Living opens `/resort-living/{slug}` when that group is on the place. Every other group opens `/{place}/by-interest/{slug}`, which is the existing interest-group page: lede, section nav, block paragraphs, and photo cards. What else belongs on the row is `.cursor/skills/city-setup/SKILL.md`. Hide the scrollbar. Do not put Previous and Next text buttons above the row. Do not stack a second slider per group.

The itinerary index is three sections of photo cards, two per row on desktop and phone. Nationwide shows two existing nationwide trips, then one duration dropdown and See itineraries, which shortlists the matches. Regional shows one existing trip for each of the six corridors, then region and duration dropdowns and the same control. Local shows ten place cards that open that place’s itineraries. A lacquer rule marks each of those three headings once. It does not sit under every heading. Every card uses a different licensed photo. There is no gateway dropdown. Under the local cards, Book your stay is the existing non-homepage Trip.com search: the 320×480 hotels iframe, then the family-summer creative. The heading is centered and smaller than the widget. The 468×60 footer banner stays. This page does not also show the shared Klook block.

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
- Do not print a verification line under the bar. `verified` stays on the record. The page does not say “Facts verified” or “confirm before you go.”

Other pages that already have a fact strip (itinerary, dish, festival) keep only cells that mean something: duration, budget, pace, origin, price band, or when. Set `--fact-cols` to the real count. The shared `.facts` rule defaults to 4 columns, so a shorter strip leaves an empty column until you set it. Add an icon only when the cell matches `clock`, `ticket`, `pin`, or `event`. Do not invent a cell to fill the row.

## Spacing

The section tabs sit on a 3px lacquer line. Leave a clear gap under that line before the first paragraph. On the city page this is `.place-body` (`padding-top: 2.25rem`).

Leave a clear gap under the first intro paragraph before the lead photo. On the city page this is `.prose-figure` (`margin-top: 3.5rem`). The paragraph must not sit on the picture.

Space between sections is larger than the space between paragraphs. On the city page a following section has `margin-top: 2.75rem`. Do not put a gray divider back between sections. A common-question answer keeps a line under the answer.

## Photos and cards

The hero has curved corners. The credit is a small muted note under the photo, “Photo: {author} · {license}”, small enough that it does not compete with the picture or the line under it. The same size is used on hero photos, cards, and inline photos.

After the first intro paragraph, one photo breaks the text. It is the highest-dotted attraction on that place that has a licensed photo of that sight. When several sights share that dot, use the one whose interest matches the place’s strongest interest, so a beach city leads with the beach. The caption is the sight’s name, with a short lacquer rule under it. The photo and the caption both link to that sight. If that sight has no licensed photo, do not put another picture under its name. The place hero stays the place photo.

Photos are cropped with a center cover, so the file has to be composed for the slot. The hero is 16:9 (`.place-photo`). An attraction card and the intro photo are 3:2 (`.jg-card .media`, `.prose-figure`). An interest card is a tall 3:4 (`.portrait`). Do not set a fixed rem height that slices a 3:2 file into a strip. Graphic and copy crops the file. This skill keeps the slot.

A photo has to be a licensed photo of that subject. A stand-in is a failure. The city hero is the scene people come for. Da Nang’s hero is the sand, the water, and the resort front in one frame. A pile of blue plastic chairs fails as that hero. If a sight file is missing, omit the card. Do not substitute the place photo, a beach, or another sight. The template fallback is not a reason to show the wrong file.

A sight, event, or side-trip card is `.jg-card`: photo on top, a round rank number on the photo, the name, one useful line, editor dots, and a light shadow. The whole card is the link. The image id is `{placeSlug}-{slug}`. A sight card uses a licensed photo of that sight. A dish card uses a photo of that dish. An event card uses a photo of that event. Whether the record is published is `.cursor/skills/city-setup/SKILL.md`.

An interest row is one `.portrait` slider, as in Decided page frames. The card is a tall rounded photo, the name and a small line icon on the image, and a round white arrow at the right of the row. An itinerary row uses the same card. Hide the scrollbar. Do not put Previous and Next text buttons above the row.

A multi-day itinerary is one photo card per day. Do not draw a route map. The card is the day title and that day's paragraph. It links to the day plan when the record names one, and otherwise to the place. A day plan is a stop timeline. Travel minutes sit on the leg and come from that stop. Recommended additions render only when the record has them.

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
- Itinerary pages use the day cards and the stop timeline. Do not draw a route map. The homepage and destinations region maps stay.

## Still to do

Work top to bottom. One family, then stop. Mark it here when the template matches.

- [x] **Attraction** — `src/components/AttractionView.astro`. The hero, the caption, the fact bar, the lacquer notice, the hour rows, and the Also in cards are in place. A record with no `body` still renders the short header. Words, the second photo, and the sections are `.cursor/skills/attraction-page/SKILL.md`. Do not add the city sidebar.
- [x] **Food guide and dish** — `src/pages/food/[slug].astro`. Keep `nameVi` on a dish. The fact strip is two cells. A dish page leads with a licensed photo of that dish, then history, culture, texture, taste, and how to enjoy it when the record has them, plus a second photo when the file exists. A destination food guide follows the page order in `.cursor/skills/city-setup/SKILL.md`: hero, intro, city specialties with a highlights list and a photo essay per dish, regional dishes only if sourced, international dining, casual dining, fine dining, themed dining, and breakfast only if sourced. Optional `role` keeps a section in that order. A section with no `role` prints after the specialty essays under its own heading. Book your stay is the existing rail. Do not add a poll, an ad, or a hotel ranking. A card needs a licensed photo of that dish or that room. An entry with no photo is named in the guide and is not a card. A two-dish guide is not done. The template pass owns the food template. A content run does not edit it. A shop with no licensed photo stays off the shopping cards.
- [x] **Itinerary** — `src/pages/itineraries/[slug].astro` and `src/pages/itineraries/index.astro`. The fact bar is three columns. Duration uses the clock icon. Budget and pace do not. A multi-day page is one photo card per day. Do not draw a route map. A day plan is a stop timeline with travel minutes, then recommended additions when the record has them. The index is three sections, two cards per row: two nationwide trips, one regional trip per corridor, and ten local place cards. Duration choices come from the records. See itineraries shortlists matches. Every index card uses a different licensed photo. Under the local cards, Book your stay is the existing non-homepage Trip.com search and the family-summer creative. The footer banner stays. The shared Klook block is not on this page.
- [ ] **Festival** — `src/pages/festivals/[slug].astro`. Keep `nameVi`. The “When” cell is already in the rounded strip, but it sits in a four-column bar and has no icon. Set the column count, use the calendar icon, and turn the place list into rows. Add a photo only when a real festival photo exists. Do not use the city banner and call it the event.
- [x] **Interest** — `src/pages/interests/[slug].astro`, `src/pages/interests/index.astro`, and `src/components/InterestGroupView.astro`. The index lede is one traveler sentence. A page leads with the subject photo, then city cards for places and sights that have a licensed photo of that subject. A nationwide place card links to the place guide. Food points at the food guides. A place or sight with no licensed photo of the subject stays in the text. Do not title a block “Related interests”. On a phone, the first card group is two cards on a line (the index tiles, and the first section on a nationwide interest page and on `/{place}/by-interest/{slug}`). The second card group is a compact row on phone and desktop: a small photo on the left, the title and description on the right.
- [x] **Home and destinations** — `src/pages/index.astro`, `src/pages/destinations/index.astro`, `src/pages/destinations/[slug].astro`. Adopt the type, pills, cards, and lacquer. Do not copy the city sidebar or the city fact bar onto the homepage.
- [ ] **Destinations index frame** — `src/pages/destinations/index.astro`. No “Vietnam / Find your destination” stack. Map and swipe card both on the first phone screen. Numbered grid with no visitor-year line. Region list with a small highlighted map and one plain selling-point line. Editorial dots stay 1 to 5. See Decided page frames.
- [x] **Plan a trip frame** — `src/pages/plan/index.astro`. Two-column cards of existing sections, See all where a section is longer, Vietnam travel news at the bottom linked to existing blog posts, no flight ad. See Decided page frames.
- [ ] **Reading pages** — plan guides, routes, seasons, about, search. Use the heading rule, the section gap, and tabs where the page already has sections. Do not add a hero, a fee, or a fact bar the record does not have.

## Pass checklist

```
- [ ] One template family
- [ ] Titles follow the place / attraction rule
- [ ] Fact cells match the record, with --fact-cols set
- [ ] Gaps under tabs and before a lead photo
- [ ] Photos and cards reuse the city classes
- [ ] The family matches the decided frame in this skill, when it has one
- [ ] No new fee, hour, sight, or sentence
- [ ] Local preview of that template and one neighbor that shares a component
```

End the pass with the files touched, the family marked above, and anything left because the content skill owns it.
