---
name: city-setup
description: >-
  Sets up a full Vietnam Guide city or province page in the Tokyo city-guide
  shape: grouped attractions, area pages, events, side trips, local interests,
  an itinerary, and labeled partner links. Use when the user asks to set up,
  fill, or complete a city, town, province, or destination page, or names a
  place that should match the Tokyo, Tsukiji, food, museum, or itinerary templates.
---

# City setup

Build one place until its page has the same layers as the Tokyo city guide. Follow `AGENTS.md`. A corridor skill such as `central-coast` still owns the facts for that beat. This skill owns the shape.

This pass is the first version. Stop when the checklist is done. The research dossier is a separate chat. Copy and photo cleanup is `.cursor/skills/graphic-copy/SKILL.md`, and it starts only after `research/<slug>/STATUS.md` says `stored`.

Do not invent a fee, an hour, a visa rule, a tax rate, or a partner ID. If a fee or hour has no source, write “Check on arrival” and say so in the draft summary. Do not paste a booking widget or iframe. Do not add a blog.

## Templates

Each city tab is one template. The template reads JSON. Do not hard-code a city’s sights into the component.

- Attractions and events: photo cards in a grid. Image on top, a number on the photo, name, one useful line, editor dots, and the whole card is the link. The image id is `{placeSlug}-{slug}`. A missing file falls back to the place photo.
- By interest: the heading is `{Place} by interest`. Never “Related interests”. Cards are tall rounded photos. The guide name and a small line icon sit on the bottom of the image. A round white arrow sits on the right edge of the row and moves it. Hide the scrollbar. Do not put Previous and Next text buttons above the row. One card is `{Place} Food Guide` with `"to": "food"`. It links to `/food/{slug}`, which is its own page. Other cards use a local title and `attractionSlug`, `dishSlug`, or `placeSlug`, plus `icon` (`food`, `beach`, `drink`, `museum`, `view`). If `interestCards` is empty, build the row from interest weights of 3 or more and the first tagged sight.
- Itineraries: the same rounded row, headed `{Place} itineraries`. Set up at least one itinerary whose stops resolve, and a second when the city supports a longer stay. Card image is the itinerary `photo`, otherwise the first stop’s attraction image. The itinerary page lists stops as clickable photo rows.
- Side trips use the same photo cards. Hotels and restaurants are the affiliate row: photo on the left, area name, one line, and a button. A hotel row is not a booking widget and not a named property.
- Tabs stay anchors on one page. The sticky tab marks the section in view.

## Voice

Write the way a well-traveled friend briefs someone the night before they land. Second person. The first sentences make the decision: stay here if this is the trip, go to the neighbor if that is the trip.

Useful means a time of day, how long it takes, how to arrive, and the mistake to avoid. Interesting means one concrete thing the reader could see or taste. Flat lines such as “the city’s own sight” do not earn a place on the page.

Do not copy sentences from other travel blogs. Use them only for shape: a decision up front, neighborhoods by who they suit, food as dishes you can order, and a day that fits together. Do not import their prices, hotel picks, or shop lists.

## Photos

Open the file and look at it before you keep it.

Keep a picture when it shows the subject, in color, in one frame, and a traveler would recognize the place.

Reject soldiers, weapons, documents, maps, logos, collages, posters with titles burned into the image, book covers, and any frame that is not the sight. The Da Nang banner is the river, the bridge, or the beach. It is never a military photograph.

The city image is the scene people come for. An attraction image shows that attraction. If the first Commons hit fails, take the next file whose title names the subject. Record the author, license, and source from the file page. Do not invent a credit. `scripts/fetch-photos.mjs` skips military and document titles. That filter does not replace looking at the picture.

## Food guide

Match the Tokyo food guide’s structure. Do not add its booking widget.

1. Opening: what this city is known for eating, and how that differs from the neighbor.
2. Specialties: each dish is a photo block with what it is, how to eat it, and when to order it. Link the dish page.
3. Where to eat: markets and streets. Name the area. Do not build a restaurant catalog. Hours without an official page stay “Check on arrival”.
4. Breakfast, sweets, and drinks when the city actually has them.
5. A short section for the neighbor’s dishes, with links.
6. Do not list a stall price. Do not name a shop unless you are ready to maintain it. Prefer the area.

## Page shape

The city page, top to bottom:

1. Top attractions. Split into areas when there are too many. Combine into one list when there are not a lot.
2. Area pages for a district that is itself a destination, on the Tsukiji model.
3. Events and activities.
4. Suggested side trips to nearby places or provinces. Placeholder until that neighbor is written.
5. `{Place} by interest`. The food guide is one card in that row and opens `/food/{slug}`. Other cards are local: Da Nang uses the beach, beach bars, the Cham museum, and the Golden Bridge. Do not copy another city’s list. Do not title the section “Related interests”.
6. Itinerary ideas. At least one itinerary, and a second when a longer stay is a real choice. The carousel and the itinerary page both use the stop records.
7. Hotels and restaurants are affiliate slots. Use the placeholder row until a partner catalog is connected.
8. Sidebar: Book your stay placeholder, then Explore with icons, then articles. Ads stay off.

City tabs stay Intro, Attractions, By interest, Get there, Itineraries, Hotels, Restaurants. A district uses Intro, Get there, Hotels, Restaurants, Experiences, and keeps the parent city’s row above it.

## Where each layer goes

| Layer | Record | Rule |
|---|---|---|
| Place shell | `src/content/places/<slug>.json` | Search-name slug. No embedded attractions. |
| One sight | `src/content/attractions/<place>--<slug>.json` | `placeSlug`, `district` when the city is split, `interests` only from keys already on the place at weight 3 or more. |
| Area like Tsukiji | Child place `kind: "district"` with `parent`, or one attraction if the area is a single sight | Breadcrumb is corridor, then city, then the area. Getting there is required. |
| Events | `src/content/festivals/` with this `placeSlug` | Recurring only. A date that moves says check on arrival. |
| Activities that are sights | Attractions | Do not make a second list of the same sights. |
| Side trips | `nearby` slugs that already exist | If the neighbor has no page, do not create it in this pass. |
| Food | `src/content/food/<place>.json`, with `sections`, and `src/content/dishes/` | Opening, specialty blocks, where to eat, breakfast, and the neighbor. Areas, not a restaurant catalog. |
| Other interests | `interestCards`, one of them `"to": "food"` | Heading is `{Place} by interest`. The food card opens the city food guide. Other cards use a local title, an icon, and a real slug. |
| Itinerary | `src/content/itineraries/<slug>.json` | Stops point at `placeSlug`, `attractionSlug`, or `dishSlug`. Add the slug to `itinerarySlugs`. |
| Stay and restaurants | `stayAreas` for the stay-row placeholder; `eat` and `dishSlugs` feed the food guide | The city-page Hotels and Restaurants sections are affiliate slots. Do not invent a property. |
| Season | `season` | Do not rewrite `intro` into a weather report. |

## Attractions

- Two or more districts, or a long list: set `district` and let the city page group by that field. Tokyo’s groups are Central, Northern, Western, Southern, Outlying.
- One area, or only a handful of sights: leave `district` empty so they read as one list.
- Each sight page has a summary, time, fee, and how to get there. Editor dots are 1–5. On a new record, propose a dot and the reason in the draft summary. Do not change an existing dot.
- A district with several sights gets its own place page and lists those sights as experiences. A single sight stays an attraction page.

## Side trips

Link `nearby` only when the slug exists. In the draft summary, list neighbors that are not written yet as `Side trip placeholder: {name}`. Fill those when that place is set up. Do not invent the neighbor’s fees or page.

## By interest

The heading is `{Place} by interest`. Cards are the rounded photo row, name on the image, round arrow on the right.

- One card is `{Place} Food Guide`, with `"to": "food"`. It opens `/food/{slug}`, a full page in the Tokyo food-guide shape.
- A museum, beach, market, or old street becomes an attraction, then a card with that local name and an icon.
- A scene with no single venue, such as beach bars, still gets a card. Link the nearest real attraction and say the guide does not name a venue. Use a distinct `photo` id when the shared attraction photo would repeat.
- Do not copy another city’s card list. Do not title the section “Related interests”.

## Itinerary

One walk or one day is the minimum. Add a second plan when a longer stay is a real choice, such as a beach day and a two-day city plan. Duration, pace, and a budget note may say check on arrival. Stops name a real attraction, dish, or place. Set `photo` when the card should show a different image from the first stop. Do not invent ticket prices inside the budget.

Run `node scripts/fetch-photos.mjs` for a new attraction id, or fetch that id alone. Save the file as `public/photos/{id}.jpg` and the credit in `public/photos/credits.json`. Look at the picture. Do not invent a photographer or a license.

## Affiliates and sidebar

Hotels and Restaurants, at the bottom of the city page, are affiliate slots. The sidebar opens with Book your stay, also an affiliate slot. Until a partner catalog is connected, render the placeholder in that same template: a photo row with a title, a short line, and a button. Do not invent a hotel, a restaurant, a score, or a price.

- The sidebar stay card is “Book your stay”, with the word stay in lacquer, then an icon row: Stays, Flights, Car, Buses, Activities, Food. Stays is the only live tab. Its button uses `stayLink` and says Search stays. The disclosure says we may earn a commission. The other icons stay in the template until those partners exist.
- The restaurant slot points at `/food/{slug}` until a restaurant partner exists. It is not a second copy of the food essay.
- Booking.com and Klook are not connected. Do not add their URLs, their logos, or a booking form that collects dates. Dates are chosen on the partner site.

Sidebar, under the stay box:

1. Explore {place}. Rows with a line icon: districts, attractions, events, side trips.
2. By interest. The same cards as the interest row, each with its icon, including the food guide.
3. Plan your trip. Hotels, restaurants, and itineraries, each with an icon.
4. Articles — this place’s `season` and its festivals. No blog type.
5. Ads — do not render. Display ads stay off. They never go on visa, storm, or accessibility pages, and never above the fact bar.

## Checklist

Copy and complete:

```
- [ ] Place shell: corridor, nearby, routes, dishes, itinerary slugs
- [ ] Attractions, grouped only if the list needs areas
- [ ] Area page, if a district is a destination of its own
- [ ] Festivals, or an explicit note that none are recorded
- [ ] Side trips: real slugs, plus placeholders in the draft summary
- [ ] `{Place} by interest` cards, including `{Place} Food Guide` linking to `/food/{slug}`
- [ ] Itineraries on the carousel, with stop photos on the itinerary page
- [ ] Food guide with specialty blocks, where to eat, breakfast, and the neighbor
- [ ] Photos looked at and kept only when they show the subject, with credits
- [ ] Hotels and restaurants are affiliate placeholders, with no invented properties
- [ ] Sidebar: Book your stay placeholder, Explore rows with icons
- [ ] npm run check:content
```

## Draft summary

- Files touched
- Facts checked, each with its source
- “Check on arrival” fields
- Side trip placeholders
- Dots proposed on new records
- Interest list for this place, in local words
