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

This pass runs after research. Start only when `research/<slug>/STATUS.md` says `stored`. Read that dossier and build the public records from it. If the dossier is missing or still `researching`, stop.

Do not research the web in this pass. Do not copy a blog sentence into a page. Graphic and copy, in `.cursor/skills/graphic-copy/SKILL.md`, rewrites the prose and reviews every photo after this pass. The lead signs off after that. Stop when the checklist is done and say the place is `paged`.

Do not invent a fee, an hour, a visa rule, a tax rate, or a partner ID. If a fee or hour has no source, write “Check on arrival” and say so in the draft summary. Do not paste a booking widget or iframe. Do not add a blog.

## Templates

Each city tab is one template. The template reads JSON. Do not hard-code a city’s sights into the component.

- Attractions and events: photo cards in a grid. Image on top, a number on the photo, name, one useful line, editor dots, and the whole card is the link. The image id is `{placeSlug}-{slug}`. A missing file falls back to the place photo.
- By interest: the heading is `{Place} by interest`. Never “Related interests”. Cards sit under a group heading. The card is a tall rounded photo. The guide name and a small line icon sit on the bottom of the image. A round white arrow sits on the right edge of the row and moves it. Hide the scrollbar. Do not put Previous and Next text buttons above the row. One card is `{Place} Food Guide` with `"to": "food"`. It links to `/food/{slug}`, which is its own page.
- Itineraries: the same rounded row, headed `{Place} itineraries`. Set up at least one itinerary whose stops resolve, and a second when the city supports a longer stay. Card image is the itinerary `photo`, otherwise the first stop’s attraction image. The itinerary page lists stops as clickable photo rows.
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

Write a clear first version from the dossier. Second person. The first sentences make the decision: stay here if this is the trip, go to the neighbor if that is the trip. Graphic and copy owns the final tone.

Useful means a time of day, how long it takes, how to arrive, and the mistake to avoid. Interesting means one concrete thing the reader could see or taste. Flat lines such as “the city’s own sight” do not earn a place on the page.

Do not copy sentences from other travel blogs. Use them only for shape: a decision up front, neighborhoods by who they suit, food as dishes you can order, and a day that fits together. Do not import their prices, hotel picks, or shop lists.

## Photos

Place a photo that matches the dossier note for what the picture must show. Open the file and look at it before you keep it. Graphic and copy reviews crop, mood, and size after this pass.

Keep a picture when it shows the subject, in color, in one frame, and a traveler would recognize the place.

Reject soldiers, weapons, documents, maps, logos, collages, posters with titles burned into the image, book covers, and any frame that is not the sight. The Da Nang banner is the river, the bridge, or the beach. It is never a military photograph.

The city image is the scene people come for. An attraction image shows that attraction. If the first Commons hit fails, take the next file whose title names the subject. Record the author, license, and source from the file page. Do not invent a credit. `scripts/fetch-photos.mjs` skips military and document titles. That filter does not replace looking at the picture.

## Chrome

How the page looks is `.cursor/skills/ui-ux/SKILL.md`. Place pages already follow it. Do not print `nameVi` beside the place h1. Do not show a fee on the place fact bar.

## Page shape

The city page, top to bottom:

1. Top attractions. Split into areas when there are too many. Combine into one list when there are not a lot.
2. Area pages for a district that is itself a destination, on the Tsukiji model.
3. Events and activities.
4. Suggested side trips to nearby places or provinces. Placeholder until that neighbor is written.
5. `{Place} by interest`, in groups. The food guide is one card inside the food group and opens `/food/{slug}`. Do not title the section “Related interests”.
6. Itinerary ideas. At least one itinerary, and a second when a longer stay is a real choice. The carousel and the itinerary page both use the stop records.
7. Hotels and restaurants are affiliate slots. Use the placeholder row until a partner catalog is connected.
8. Sidebar: Book your stay placeholder, then Explore with icons, then articles. Ads stay off.

City tabs stay Intro, Attractions, By interest, Get there, Itineraries, Hotels, Restaurants. A district uses Intro, Get there, Hotels, Restaurants, Experiences, and keeps the parent city’s row above it.

The page is not a wall of text. After the first intro paragraph, one photo of the top sight breaks the text. Cards, the fact bar, the tabs, and the spacing follow `.cursor/skills/ui-ux/SKILL.md`. Do not add visitor counts, a green brand line, an ad, or a booking form.

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
| Other interests | `interestGroups`, each with a local title and its cards | Heading is `{Place} by interest`. Cards sit under the group. One card is the food guide. |
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

The heading is `{Place} by interest`. Group the cards. A flat row of unrelated sights is not the section.

Each group has a local name and one sentence on who it is for. Render the group heading, then that group’s rounded photo cards. Useful groups look like street food, markets, beaches, history, nightlife, shopping, and fine dining. Use a group only when this place has it. Do not copy Tokyo’s list. Beach and beach bars belong in one beaches group. A museum belongs in history. The food guide is one card, inside the food group, with `"to": "food"`.

A scene with no single venue, such as beach bars, still gets a card. Link the nearest real attraction and say the guide does not name a venue. Use a distinct `photo` id when the shared attraction photo would repeat.

## Attraction page

Match the Tsukiji page. A title, one lede, and a fact bar are not the page.

- The photo shows the sight. A caption under it says what the frame is.
- Body paragraphs say what the visitor does, how long it takes, and the mistake to avoid. The words come from the dossier.
- **Getting there and around** is its own section, longer than the fact-bar line. Name the start point a traveler already knows, the mode, and the time. A second start point gets its own short block when the dossier has it.
- **Hours and fees** is its own section. Open, closed, and the fee. An unknown stays “Check on arrival”.
- **Also in {Place}** lists the other sights, each linked.
- The sidebar is the same as the city page: Book your stay placeholder, then Explore with icons.

The fact bar stays. It does not replace the two sections.

## Food guide

Match the Tokyo food guide’s structure. Do not add its booking widget, its Michelin list, or its shop names.

1. Opening: what this city is known for eating, and how that differs from the neighbor.
2. Specialties: each dish is a row with a photo of that dish, the name, what it is, and the first how-to-eat line. The row links to the dish page. If the dish has no photo, do not borrow the city beach or the bridge. Say so in the draft summary and fetch the dish photo.
3. Where to eat, by area: markets and streets. Name the area.
4. Breakfast, sweets, and drinks when the city has them.
5. Casual dining and fine dining only when this city really splits that way. Name the district, not a restaurant.
6. A short section for the neighbor’s dishes, with links.
7. The sidebar reserves a restaurant placeholder, the same shape as Book your stay, until a restaurant partner exists. The button points at the food guide. It does not search Booking.com.

Do not list a stall price. Do not name a shop unless you are ready to maintain it.

## Dish page

A dish page is the specialty, not a stub. Mi Quang with a paragraph and a city list is not done.

- A photo of the bowl or the plate, at the top. No cityscape fallback.
- What it is, in more than one sentence, from the dossier.
- Varieties, when the dish has them. Each variety is a small photo and how it differs, the way nigiri and gunkan sit on the sushi page.
- Where it comes from.
- How to eat it: the gesture, the hour, the mistake.
- Where to try it: the market or the street in this city. A list of city names is the last line, after the area.
- The same restaurant placeholder sits in the sidebar.

## Itinerary

One walk or one day is the minimum. Add a second plan when a longer stay is a real choice, such as a beach day and a two-day city plan. Duration, pace, and a budget note may say check on arrival. Stops name a real attraction, dish, or place. Set `photo` when the card should show a different image from the first stop. A day may set `photo` when the place image would repeat. Do not invent ticket prices inside the budget.

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
- [ ] Place shell: corridor, nearby, routes, dishes, itinerary slugs
- [ ] Attractions, grouped only if the list needs areas
- [ ] Area page, if a district is a destination of its own
- [ ] Festivals, or an explicit note that none are recorded
- [ ] Side trips: real slugs, plus placeholders in the draft summary
- [ ] `{Place} by interest` grouped, including `{Place} Food Guide` linking to `/food/{slug}`
- [ ] Each attraction page has body, getting there and around, and hours and fees
- [ ] Each dish page has its own photo, how to eat it, and where to try it by area
- [ ] Itinerary page: each day is a photo row, with the stay sidebar. Walks keep stop photos.
- [ ] Food guide with specialty blocks, where to eat, breakfast, and the neighbor
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
