---
name: city-setup
description: >-
  Sets up a full Vietnam Guide city or province page: attractions and dishes
  only with a licensed photo, Dining first, Shopping and Resort Living when
  sourced, one itinerary whose stops resolve, and one of the six tourism
  regions. Use when the user asks to set up, fill, or complete a city, town,
  province, or destination page, or names a place that should match the Tokyo,
  Tsukiji, food, museum, or itinerary templates.
---

# City setup

Build one place until its page has the same layers as the Tokyo city guide. Follow `AGENTS.md`. A beat skill such as `central-coast` still owns the facts for that set of places. This skill owns what the destination page contains. How it looks is `.cursor/skills/ui-ux/SKILL.md`.

Read `.cursor/skills/destination-standard/SKILL.md` before a city pass. The shared template shows six attraction cards, then a “Show all” control for the rest. Dining and F&B stays first when this place has a food guide, and that card opens the guide. Interest groups come from this place’s own data. Do not copy Japan’s regions or durations.

## Regions and slugs

The place `corridor` is one of the six tourism regions already in `src/content/corridors/`:

| Slug | Name |
|---|---|
| `northern-midlands` | Northern Midlands & Mountains |
| `red-river-delta` | Red River Delta |
| `north-central` | North Central Coast |
| `south-central-highlands` | South Central Coast & Central Highlands |
| `southeast` | Southeastern Vietnam |
| `mekong-delta` | Mekong Delta |

Do not recreate an old corridor (`central-coast`, `northern-vietnam`, `highlands-coast`) and do not add a seventh region. Hue and Phong Nha are `north-central`. Da Nang, Hoi An, and My Son are `south-central-highlands`. The Central Coast beat is still those five places. It is not a corridor file.

Keep the search-name slug. Hoi An stays `hoi-an`. Ha Giang stays `ha-giang`. Do not move a place under a province slug.

This pass runs after research. Start only when every research lane on `ops/board/places/<slug>.json` is `stored` or `blocked`, `research/<slug>/STATUS.md` says `stored`, and the board has claimed this place and this stage. Read `.cursor/skills/content-board/SKILL.md`. If a research lane is still `not_started` or `needs_depth`, stop.

The claimed stage is the scope of this pass. `destination` writes the place shell, interests, one itinerary, festivals, nearby, and stay areas. It does not add a new attraction file. `food` writes the food guide and bundled dishes the dossier already sourced. `page` writes the one attraction named by the claim. When that stage is complete, claim the next stage for this same place. Do not fold the next stage into this stage's files.

Do not research the web in this pass. Do not copy a blog sentence into a page. Graphic and copy, in `.cursor/skills/graphic-copy/SKILL.md`, rewrites the prose and reviews every photo after this pass. The lead signs off after that. Stop when the checklist is done and say the place is `paged`.

Do not invent a fee, an hour, a visa rule, a tax rate, or a partner ID. If a fee or hour has no source, write “Check on arrival” and say so in the draft summary. Do not paste a booking widget or iframe. Do not add a blog.

## Templates

Each city tab is one template. The template reads JSON. Do not hard-code a city’s sights into the component.

- Attractions and events: photo cards in a grid. Image on top, a number on the photo, name, one useful line, editor dots, and the whole card is the link. The image id is `{placeSlug}-{slug}`. Publish the card only when a licensed photo of that sight exists. A missing file is not a card, and it does not fall back to the place photo.
- By interest: the heading is `{Place} by interest`. Never “Related interests”. The frame is one slider. See `.cursor/skills/ui-ux/SKILL.md`. Dining and F&B stays first and links to `/food/{slug}` when this place has a food guide. The other cards come from this place. See `.cursor/skills/destination-standard/SKILL.md`.
- Itineraries: the same rounded row, headed `{Place} itineraries`. Set up one itinerary whose stops resolve. Card image is the itinerary `photo`, otherwise the first stop’s attraction image. The itinerary page lists stops as clickable photo rows.
- Side trips use the same photo cards. Hotels and restaurants are the affiliate row: photo on the left, area name, one line, and a button. A hotel row is not a booking widget and not a named property.
- Tabs stay anchors on one page. The sticky tab marks the section in view.

## SEO and GEO

The page should be findable in search and citable by an answer engine. Use the fields the record already has. Do not add a second schema system. Article, FAQ, and breadcrumb markup are already rendered.

- `seoTitle`: place name plus the decision the page helps a traveler make. About 50–60 characters.
- `seoDescription`: one sentence, about 140–160 characters, with a fact from the dossier (days, season risk, or how the place differs from its neighbor).
- `summary`: the first sentences answer “should I stay here?” A reader who sees only that paragraph still knows what to do.
- One FAQ asks a real planning question. The answer uses a dossier fact. One idea per answer.
- A fee, hour, or date marked `UNSOURCED` in the dossier is “Check on arrival” on the page.

## Voice

Write a clear first version from the dossier. Second person. Open in the scene the dossier’s “Why a night here” names, then the decision: stay here if this is the trip, go to the neighbor if that is the trip. A lede that only mentions the airport is not finished. Graphic and copy owns the final tone.

Useful means a time of day, how long it takes, how to arrive, and the mistake to avoid. Interesting means one concrete thing the reader could see, taste, or walk into, including the evening area and any scene landmark the dossier recorded. Flat lines such as “the city’s own sight” do not earn a place on the page. Empty praise does not either.

Do not copy sentences from other travel blogs. Use them only for shape: a decision up front, neighborhoods by who they suit, food as dishes you can order, and a day that fits together. Do not import their prices, hotel picks, or shop lists.

## Photos

Place a photo that matches the dossier note for what the picture must show. Open the file and look at it before you keep it. Graphic and copy reviews crop, mood, and size after this pass.

Keep a picture when it shows the subject, in color, in one frame, and a traveler would recognize the place.

Reject soldiers, weapons, documents, maps, logos, collages, posters with titles burned into the image, book covers, and any frame that is not the sight. The Da Nang banner is the river, the bridge, or the beach. It is never a military photograph.

The city image is the scene people come for, the one named in the dossier’s hero line. An attraction image shows that attraction, composed for a 3:2 card so a center crop still shows it. A tall statue is cropped to the face and the gesture, not to a headless torso, and not padded with invented sky. If the first Commons hit fails, take the next file whose title names the subject. Record the author, license, and source from the file page. Do not invent a credit. `scripts/fetch-photos.mjs` skips military and document titles. That filter does not replace looking at the picture.

## Chrome

How the page looks is `.cursor/skills/ui-ux/SKILL.md`. Place pages already follow it. Do not print `nameVi` beside the place h1. Do not show a fee on the place fact bar.

## Page shape

The city page, top to bottom:

1. Top attractions. Split into areas when there are too many. Combine into one list when there are not a lot.
2. Area pages for a district that is itself a destination, on the Tsukiji model.
3. Events and activities.
4. Suggested side trips to nearby places or provinces. Placeholder until that neighbor is written.
5. `{Place} by interest`, one slider, from this place. Dining and F&B stays first and opens `/food/{slug}` when this place has a food guide. Do not title the section “Related interests”. See `.cursor/skills/destination-standard/SKILL.md`.
6. Itinerary ideas. One itinerary whose stops resolve. The carousel and the itinerary page both use those stop records.
7. Hotels and restaurants are affiliate slots. Use the placeholder row until a partner catalog is connected.
8. Sidebar: Book your stay placeholder, then Explore with icons, then articles. Ads stay off.

City tabs stay Intro, Attractions, By interest, Get there, Itineraries, Hotels, Restaurants. A district uses Intro, Get there, Hotels, Restaurants, Experiences, and keeps the parent city’s row above it.

The page is not a wall of text. After the first intro paragraph, one photo of the top sight breaks the text. Cards, the fact bar, the tabs, and the spacing follow `.cursor/skills/ui-ux/SKILL.md`. Do not add visitor counts, a green brand line, an ad, or a booking form.

## Where each layer goes

| Layer | Record | Rule |
|---|---|---|
| Place shell | `src/content/places/<slug>.json` | Search-name slug. `corridor` is one of the six tourism regions. No embedded attractions. |
| One sight | `src/content/attractions/<place>--<slug>.json` | `placeSlug`, `district` when the city is split, `interests` only from keys already on the place at weight 3 or more. |
| Area like Tsukiji | Child place `kind: "district"` with `parent`, or one attraction if the area is a single sight | Breadcrumb is corridor, then city, then the area. Getting there is required. |
| Events | `src/content/festivals/` with this `placeSlug` | Recurring only. A date that moves says check on arrival. |
| Activities that are sights | Attractions | Do not make a second list of the same sights. |
| Side trips | `nearby` slugs that already exist | If the neighbor has no page, do not create it in this pass. |
| Food | `src/content/food/<place>.json`, with `sections`, and `src/content/dishes/` | Opening, specialty blocks, where to eat, breakfast, and the neighbor. Areas, not a restaurant catalog. |
| Other interests | `interestGroups`, one slider | Heading is `{Place} by interest`. Dining stays first when there is a food guide. Shopping and Resort Living follow the rules below. |
| Itinerary | `src/content/itineraries/<slug>.json` | One itinerary. Every stop points at a `placeSlug`, `attractionSlug`, or `dishSlug` that exists. Add the slug to `itinerarySlugs`. |
| Stay and restaurants | `stayAreas` for the stay-row placeholder; `eat` and `dishSlugs` feed the food guide | The city-page Hotels and Restaurants sections are affiliate slots. Do not invent a property. |
| Season | `season` | Do not rewrite `intro` into a weather report. |

## Attractions

- Two or more districts, or a long list: set `district` and let the city page group by that field. Tokyo’s groups are Central, Northern, Western, Southern, Outlying.
- One area, or only a handful of sights: leave `district` empty so they read as one list.
- Each sight page has a summary, time, fee, and how to get there. Editor dots are 1–5. On a new record, propose a dot and the reason in the draft summary. Do not change an existing dot.
- An attraction card is published only with a licensed photo of that sight. No photo means no card. Leave the sight in the dossier and name it in the draft summary. Do not borrow the place photo or another sight.
- A district with several sights gets its own place page and lists those sights as experiences. A single sight stays an attraction page.

## Side trips

Link `nearby` only when the slug exists. In the draft summary, list neighbors that are not written yet as `Side trip placeholder: {name}`. Fill those when that place is set up. Do not invent the neighbor’s fees or page.

## By interest

The heading is `{Place} by interest`. The page frame is one slider. See `.cursor/skills/ui-ux/SKILL.md`.

Each card has a local name and one sentence on who it is for. Useful subjects look like street food, markets, beaches, history, nightlife, and fine dining. Use a card only when this place has it. Do not copy Tokyo’s list, another city’s groups, or Da Nang’s beach groups onto a different city. Beach and beach bars belong in one beaches card. A museum belongs in history. Dining and F&B stays first and opens `/food/{slug}` when this place has a food guide. My Son and Phong Nha do not get an invented dining street. See `.cursor/skills/destination-standard/SKILL.md`.

Shopping is a card on that slider when a source names local boutiques, souvenirs, specialty goods to take home, or large malls. Dining stays first. A place with nothing sourced does not get the card. A shop or mall with no licensed photo stays in the text. It does not become a card and it does not borrow another picture.

Resort Living is a card only where a resort stay is a real reason to go: Phu Quoc, Nha Trang, Mui Ne, Da Nang, Hoi An, and Ha Long. The card opens a page of luxury and premium resorts that can be sourced, including ones the owner names when a public source and a photo of that property exist. The page is not left as a single lesser property. It is not added to a citadel, a cave, or a monument. Hue, My Son, and Phong Nha do not get the card. A property with no licensed photo of that property stays off the page. Do not invent a rate, a ranking, or a property.

A scene with no single venue, such as beach bars, still gets a card. Link the nearest real attraction and say the guide does not name a venue. Use a distinct `photo` id when the shared attraction photo would repeat. Every interest card has its own photo.

## Attraction page

Follow `.cursor/skills/attraction-page/SKILL.md`. A title, one lede, and a fact bar are not the page. The reference record is `src/content/attractions/da-nang--ba-na.json`.

The attraction page does not use the city sidebar. It ends with one labeled stay row. Do not write the sight’s body in the city-setup pass. Store `research/<place>/attractions/<slug>.md` first, then fill the record in an attraction pass.

## Food guide

The city food guide is photo-led. Do not add a booking widget or a Michelin list. Shop names belong on Shopping, not in this guide.

1. One lede: what this city is known for eating. Not an essay, and not a list of hours.
2. Specialties: a grid of dish photo cards. Each card is a licensed photo of that dish, the name, and a short caption, and it links to the dish page. If the dish has no photo, do not make a card and do not borrow another picture. Say so in the draft summary.
3. A market or a street is a photo card with a short caption, or it stays off the page. Do not print hours as paragraphs.
4. Breakfast, sweets, and drinks when the city has them and a real photo exists.
5. A short set of cards for the neighbor’s dishes, with links. Do not rewrite those dishes in this city’s pass.
6. The sidebar reserves a restaurant placeholder, the same shape as Book your stay, until a restaurant partner exists. The button points at the food guide. It does not search Booking.com.

Do not list a stall price. Do not name a shop in the food guide. A sourced shop belongs on Shopping, in the text when it has no licensed photo.

## Dish page

A dish page is the specialty, not a stub. A paragraph and a city list are not done.

- A photo of the bowl or the plate, at the top. No cityscape fallback. A second licensed photo when one exists.
- History of the dish, when a source gives it. Leave the section out when it does not.
- Why it matters culturally.
- Texture.
- Taste.
- How to best enjoy it: the gesture and the mistake. An unsourced hour is “Check on arrival,” not a paragraph of clocks.
- Where to try it: the market or the street in this city. A list of city names is the last line, after the area.
- Do not invent a flavor, a legend, or a date. If a point has no source, leave it out and say so in the draft.
- The same restaurant placeholder sits in the sidebar.

## Itinerary

One itinerary whose stops resolve. A stop points at a place, attraction, or dish slug that already exists. A stop that does not resolve stays off the page. Do not add a second plan in this pass. Do not copy a Japan duration. Duration, pace, and a budget note may say check on arrival. Set `photo` when the card should show a different image from the first stop. A day may set `photo` when the place image would repeat. Do not invent ticket prices inside the budget. The four itinerary types are nationwide, region, day, and half-day. This pass adds the one that belongs on this place.

The itinerary page matches the Kanto day list. Each day is a photo on the left and the day title plus one paragraph on the right. The whole row links to that place. Do not use a horizontal strip of day names. The sidebar is Book your stay, then the other itineraries. Do not draw a route map until a real one exists. A walk keeps its stop rows, each with the stop photo.

Run `node scripts/fetch-photos.mjs` for a new attraction id, or fetch that id alone. Save the file as `public/photos/{id}.jpg` and the credit in `public/photos/credits.json`. Look at the picture. Do not invent a photographer or a license.

## Affiliates and sidebar

Hotels and Restaurants, at the bottom of the city page, are affiliate slots. The sidebar opens with Book your stay, also an affiliate slot. Until a partner catalog is connected, render the placeholder in that same template: a photo row with a title, a short line, and a button. Do not invent a hotel, a restaurant, a score, or a price.

- The sidebar stay card is “Book your stay”, with the word stay in lacquer, then an icon row: Stays, Flights, Car, Buses, Activities, Food. Stays is the only live tab. Its button uses `stayLink` and says Search stays. The disclosure says we may earn a commission. The other icons stay in the template until those partners exist.
- The restaurant slot points at `/food/{slug}` until a restaurant partner exists. It is not a second copy of the food essay.
- Booking.com and Klook are not connected. Do not add their URLs, their logos, or a booking form that collects dates. Dates are chosen on the partner site.

Sidebar, under the stay box:

1. Explore {place}. Rows with a line icon: districts, attractions, events, side trips.
2. By interest. The same groups as the city page, each row with its icon, including the food guide.
3. Plan your trip. Hotels, restaurants, and itineraries, each with an icon.
4. Articles — this place’s `season` and its festivals. No blog type.
5. Ads — do not render. Display ads stay off. They never go on visa, storm, or accessibility pages, and never above the fact bar.

## Checklist

Copy and complete:

```
- [ ] `research/<slug>/STATUS.md` says `stored` before any public edit
- [ ] Every public fact comes from that dossier
- [ ] `seoTitle`, `seoDescription`, and one planning FAQ
- [ ] Place shell: one of the six tourism regions, nearby, routes, dishes, one itinerary slug. Search-name slug unchanged
- [ ] Attractions, grouped only if the list needs areas, each card a licensed photo of that sight
- [ ] Area page, if a district is a destination of its own
- [ ] Festivals, or an explicit note that none are recorded
- [ ] Side trips: real slugs, plus placeholders in the draft summary
- [ ] `{Place} by interest` is one slider. Dining stays first when there is a food guide. Shopping and Resort Living only when the rules above are met
- [ ] Attraction records exist for the sights. A finished sight page is a later pass under `.cursor/skills/attraction-page/SKILL.md`, not this one
- [ ] Each dish page has its own photo, history, culture, texture, taste, and how to enjoy it, with anything unsourced left out
- [ ] One itinerary whose stops resolve. Each day is a photo row, with the stay sidebar. Walks keep stop photos
- [ ] Food guide is photo-led: a card only with a photo of that dish, short captions, and no hour paragraphs
- [ ] Photos looked at and kept only when they show the subject, with credits
- [ ] Hotels and restaurants are affiliate placeholders, with no invented properties
- [ ] Sidebar: Book your stay placeholder, Explore rows with icons
- [ ] npm run check:content
```

## Draft summary

- Status: `paged`
- Files touched
- Facts taken from the dossier, each with its source id
- “Check on arrival” fields
- Side trip placeholders
- Dots proposed on new records
- Interest list for this place, in local words
