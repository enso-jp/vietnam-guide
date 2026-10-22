---
name: city-setup
description: >-
  Sets up a Vietnam Guide city, town, or province until it matches Da Nang:
  attractions grouped by local area, events, side trips, local interest
  groups, one itinerary whose stops resolve, and a food guide in Da Nang’s
  shape. A licensed photo of that subject is required. Use when the user asks
  to set up, fill, or complete a city, town, province, or destination page.
---

# City setup

A destination is not done until it matches Da Nang. Copy the records below. Do not invent a layout those records do not use. Follow `AGENTS.md`. A beat skill such as `central-coast` still owns the facts for that set of places. This skill owns what the destination contains. How it looks is `.cursor/skills/ui-ux/SKILL.md`. Sight pages follow `.cursor/skills/attraction-page/SKILL.md`.

Read `.cursor/skills/destination-standard/SKILL.md` for the six-card grid and the one interest slider. This skill is the record those frames read.

## The bar

These are the finished Da Nang records. A new destination uses the same fields, filled with that place’s own facts.

- Place: `src/content/places/da-nang.json`
- Attractions: every `src/content/attractions/da-nang--*.json`. The finished sight page is `src/content/attractions/da-nang--ba-na.json`. `da-nang--an-thuong.json` is still a short record. Do not copy its missing fields.
- Food: `src/content/food/da-nang.json`, and the dish pages in its `dishSlugs` plus `cao-lau` and `bun-bo-hue` on the neighbor section
- Festivals: `src/content/festivals/da-nang-fireworks.json`, `src/content/festivals/da-nang-quan-the-am.json`
- Itineraries: `src/content/itineraries/da-nang-day.json`, `src/content/itineraries/da-nang-two-days.json`
- Resort page, because that group is on the place: `src/content/resort-living/da-nang.json`

Da Nang publishes no child district place. My Khe, An Thuong, and the river are `district` values, stay rows, and interest blocks.

Three setups fail even when the JSON validates:

- The city hero is a pile of blue plastic chairs, or any other stand-in that is not the subject.
- The food guide’s public specialty grid is two generic dishes.
- The attraction list is short and has no local `district` values.

## Hard rules

- Do not invent a fee, an hour, a visa rule, a sight, a taste, or a history. A fee or hour with no source is “Check on arrival”. Say that in the draft summary.
- Where sources disagree, print both figures and name both sources.
- The season chip is a traveler line: `season.label` plus `season.note`. Da Nang’s label is “Drier beach months”. Floods, closures, and peak dates stay in `season`. Do not rewrite `intro` into a weather report.
- Public sentences do not talk about the site. Leave out “its own page”, “no page here”, “this guide”, and “licensed photo was not filed”, including close variants. A missing card is omitted. The draft summary may say why.
- Do not guess `lat` or `lng`. Leave both unset unless a source prints the point. A box is not a pin.
- Do not edit rank-dot math. Editorial dots stay 1 to 5. Do not change an existing dot, and do not change `dotLabel` in `src/config/site.ts`. On a new record, propose a dot and the reason in the draft summary.
- Partner URLs stay in `src/lib/partners.ts`. Do not paste a booking widget, an iframe, or a partner URL into a page.
- A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`.
- Do not add a blog, an ad, a visitor count, or a review score.

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

Do not add a seventh region. Hue and Phong Nha are `north-central`. Da Nang, Hoi An, and My Son are `south-central-highlands`. The Central Coast beat is still those five places. It is not a corridor file.

Keep the search-name slug. Hoi An stays `hoi-an`. Ha Giang stays `ha-giang`. Do not move a place under a province slug.

## When this pass runs

Start only when every research lane on `ops/board/places/<slug>.json` is `stored` or `blocked`, `research/<slug>/STATUS.md` says `stored`, and the board has claimed this place and this stage. Read `.cursor/skills/content-board/SKILL.md`. If a research lane is still `not_started` or `needs_depth`, stop.

The claimed stage is the scope of this pass. `destination` writes the place shell, interests, one itinerary, festivals, nearby, and stay areas. It does not add a new attraction file. `food` writes the food guide and bundled dishes the dossier already sourced. `page` writes the one attraction named by the claim. When that stage is complete, claim the next stage for this same place. Do not fold the next stage into this stage's files.

The place is not done when one stage is done. It is done when the checklist at the bottom matches Da Nang.

Do not research the web in this pass. Do not copy a blog sentence into a page. Graphic and copy, in `.cursor/skills/graphic-copy/SKILL.md`, rewrites the prose and reviews every photo after this pass. Stop when this stage’s checklist items are done.

## Place record

`src/content/places/<slug>.json` follows `da-nang.json`.

- `summary` answers “should I stay here?” in the scene the dossier names. Da Nang’s lede is the beach hotel, An Thuong after dark, and Hoi An when the old town is the reason.
- `intro` is several paragraphs a traveler can use: the morning, the evening, food, the sights worth a ride, and the detour. After the first paragraph the template inserts the lead sight’s photo. That photo is the highest-dotted attraction whose interest matches the place’s strongest interest. Da Nang leads with the beach.
- `timeNeeded`, `getThere`, and `bestMonths` are the fact bar. Do not show a citywide fee. Da Nang’s `fee` is “No single city ticket. The beach is free.” and the fact bar omits it.
- `gettingAround` is how to cross town and how the neighbor sits on the same road.
- `stayAreas` is the hotel row. Da Nang has two: My Khe beach (`band` “Resorts and hotels”, photo `da-nang-my-khe`) and Han River (`band` “City hotels”). Each row needs `name`, `summary`, `band`, and a `photo` of that area. The My Khe row uses the My Khe file. A river row uses a river file. Reusing the beach file for the river row is a stand-in.
- `eat` is a short pointer at the food guide. Da Nang names mi Quang, the breakfast street, and seafood on the beach road, then sends the reader to the guide. The Restaurants section on the city page is that guide’s affiliate row, not a second essay.
- `dishSlugs` lists the same local dishes as the food guide.
- `foodSlug` is this place’s own guide.
- `nearby` and `routeSlugs` and `itinerarySlugs` are slugs that already exist.
- `interestCards` and `interestGroups` are both on the record. The chips under the title are the first four `interestCards`. The slider and the by-interest pages read `interestGroups`.
- `interestsBody` is one line per group, in traveler language.
- `faqs` are real planning questions. Da Nang asks where to sleep, where breakfast is, where the night is, and when the dragon breathes fire.
- `seoTitle` is the place name plus the decision, about 50–60 characters. `seoDescription` is one sentence, about 140–160 characters, with a dossier fact.
- `interests` uses keys already in `interestLabels` in `src/config/site.ts`. Weights are 1 to 5. Do not add a key in a content run. An attraction’s `interests` may use only keys already on the place at weight 3 or more.
- `provinceNote` only when a source supports the administrative line. Da Nang’s note says the city now includes the former Quang Nam province.

`nameVi` stays on the record. The place h1 does not print it.

## Attractions

File each sight at `src/content/attractions/<place>--<slug>.json` with `placeSlug`.

Da Nang files 15 sights. Every one sets `district` to a local area a traveler can use:

| `district` | Sights |
|---|---|
| The beach | My Khe, beachfront, beach sports, An Thuong |
| The river | Cham Museum, rooster church, Bach Dang, swing bridge, Han Market, Dragon Bridge, Thuan Phuoc |
| The hills | Ba Na, Hai Van |
| South shore | Marble Mountains |
| Son Tra | Linh Ung |

Another city names its own areas from how people move around that city. Compass labels copied from somewhere else, and Da Nang’s beach names pasted onto a different city, are the wrong groups. A city that has neighborhoods and files a short list with an empty `district` is not done.

A single monument or park lists every sourced sight. Do not invent sights or areas to reach 15.

The city template ranks by editorial dots and shows six cards, then a “Show all” control, in one grid. Area names stay on the records. They do not start a second card grid, and they do not become child place pages. The attraction page prints `district` as the meta line under the title.

Publish a card only when `public/photos/{placeSlug}-{slug}.jpg` is a licensed photo of that sight. A missing file is not a card. Do not borrow the place photo, the beach, or a neighboring sight. The template’s photo fallback is not permission to ship a stand-in.

The image id is `{placeSlug}-{slug}`. A second frame is `{placeSlug}-{slug}-2`.

Editor dots are 1–5. Do not change an existing dot.

A published sight is not finished until it matches the attraction skill. The city-setup `page` stage writes the one claimed sight. It does not write the next sight in the same pass.

## Events

Recurring events go in `src/content/festivals/` with this place in `placeSlugs`. Da Nang files two: the fireworks festival and the Avalokitesvara festival at the Marble Mountains.

Each record has `name`, `nameVi`, `summary`, `when`, `photo`, and `interests`. `when` states the dates a source prints. A date that moves says check on arrival. The photo id is a licensed photo of that event. The city hero is the wrong file.

The place page heading is “Events”. The tab label is “Festivals”. Do not add a third list of the same sights and call them activities.

If the dossier records no recurring event, say that in the draft summary. Do not invent a festival.

## Side trips

`nearby` links slugs that already exist. Da Nang links `hoi-an`, `hue`, and `my-son`. The page heading is “Side trips from {Place}”. Each card uses that neighbor’s own place photo.

`routeSlugs` lists routes that already exist. Da Nang lists `da-nang-to-hoi-an` and `hue-to-hoi-an`.

If the neighbor has no page, do not create it in this pass. In the draft summary, list it as `Side trip placeholder: {name}`. Do not invent the neighbor’s fees.

## By interest

The heading is `{Place} by interest`. The frame is one slider. Dining and F&B is first when this place has a food guide, and that card opens `/food/{slug}`. Resort Living opens `/resort-living/{slug}` when the group is real. Every other group opens `/{place}/by-interest/{slug}`.

Write the groups from how people use this place. Da Nang’s groups are the depth bar, and they are the wrong list for a different city:

- Dining and F&B. One card, photo of the signature dish (`mi-quang`), `to: "food"`.
- Shopping. Blocks for the market, the stone village, and the night stalls. A card only when a licensed photo of that shop exists. Da Nang’s only shopping card is Han Market, using the produce-wing frame `da-nang-han-market-2`. The stone village and the night stalls stay in the block paragraphs as traveler facts. The paragraph gives the sourced place, hour, and fee. It does not explain why a card is missing.
- Resort Living. One card, photo of a sourced resort scene, `to: "resortLiving"`. The page is `src/content/resort-living/<slug>.json`: a lede, body, and properties grouped by `area`, each with its own photo and a public source URL. Da Nang’s areas are Son Tra, Non Nuoc, and My Khe. No rates. Add this group only where a resort stay is a real reason to go: Phu Quoc, Nha Trang, Mui Ne, Da Nang, Hoi An, and Ha Long. Hue, My Son, and Phong Nha do not get the card. A property with no licensed photo of that property stays off the page.
- Beach lifestyle, Culture, and River walk use blocks when one group covers two parts of the city: `clubs` and `swim`, `city` and `hills`, `promenade` and `crossings`. A card in those groups sets `block` to that id and `attractionSlug` to a real sight.
- Beach sports and Nightlife use `body` plus cards, with no blocks. Beach sports has two cards and two photos of the hire on the sand. Nightlife has one card, An Thuong, and the photo is the doorway on An Thuong 4.

Each card has `title`, `summary`, its own `photo`, and an `icon` already used on Da Nang (`food`, `bed`, `beach`, `drink`, `museum`, `view`). The same file does not appear on two cards. One beach photo used for the beach, An Thuong, and the beach night is a stand-in.

A scene with no single venue still gets a card when a licensed photo of that scene exists. Link the nearest real attraction. Describe the scene. Do not write that the guide names no venue.

My Son and Phong Nha do not get an invented dining street. A place with nothing sourced for Shopping does not get that group.

The by-interest page renders `summary`, `body`, then each block’s heading, paragraphs, and the cards whose `block` matches. Cards with no `block` sit in a grid above the blocks. Dining and Resort Living do not get a by-interest page. They open the food guide and the resort page.

## Itinerary

File at least one itinerary whose stops resolve. Da Nang files `da-nang-day` (stops only) and `da-nang-two-days` (a `days` array plus stops). One is the minimum. Do not add a second plan in a pass that claimed one.

Each stop has `name`, `minutes`, `placeSlug`, a note, and either `attractionSlug` or `dishSlug`. That slug must exist. A stop that does not resolve stays off the page. `days`, when present, each have `title`, `body`, and `placeSlug`.

Set `photo` to a licensed photo of a stop on that plan. Da Nang’s day plan uses `da-nang-my-khe`. The two-day plan uses `da-nang-son-tra`. `budget` may be “Check on arrival”. Do not invent ticket prices. The four itinerary levels are nationwide, region, day, and half-day. Add the slug to the place’s `itinerarySlugs`. Corridor itineraries already on the place stay listed only when those slugs exist.

The itinerary page is a photo on the left and the day title plus one paragraph on the right. A walk keeps stop rows with the stop photo. Do not draw a route map.

## Food guide

The record is `src/content/food/<place>.json`, in the shape of `src/content/food/da-nang.json`.

- `summary` is the lede: what this city eats, and how that differs from the neighbor. Da Nang’s lede is turmeric noodles, morning fish-cake soup, seafood on the beach road, and a river cafe.
- `heroSlug` is the signature dish. Da Nang uses `mi-quang`. The file is a photo of that dish.
- `body` is two short paragraphs: eat this city as itself, then how to use the shops and the beach-road price rule.
- `specialtiesLead` is one sentence pointing at the sections under the list.
- `dishSlugs` is the local menu. Da Nang lists mi Quang, bun cha ca, banh xeo, banh trang cuon, banh canh, bun mam, com ga, banh beo, goi ca, vit lon, che, banh mi, and ca phe. A city guide whose list is two generic dishes is not done.
- `sections` follow Da Nang’s order and fields: `id`, `heading`, `nav` or `hideNav`, `paragraphs`, and `spots`. A spot has `name`, `nameVi`, `address`, `note`, and `dishSlug` when the spot is that dish. The sections are where to eat, streets and markets, noodles, rice, plates, seafood, breakfast, sweets, drinks, dining, after dark, and a ride away. The last section’s `dishSlugs` are the neighbor’s dishes (`cao-lau`, `bun-bo-hue` on Da Nang). Do not rewrite those dishes here.
- Name a door only when the dossier names it. Do not invent a shop. Do not print a stall price. An unsourced hour in `note` is “Check on arrival”.
- `seoTitle` and `seoDescription` are the decision a hungry traveler is making.

`src/pages/food/[slug].astro` prints the lede, then a Specialties grid. A dish becomes a card only when `public/photos/{dishSlug}.jpg` is a licensed photo of that dish. Vit lon is on Da Nang’s list and has no card until that photo exists. Do not borrow another dish to fill the hole. A later section prints only when a spot has both `photo` and `caption` and the file exists, or when the section lists a dish that is not already in `dishSlugs` and that dish has its own photo. Da Nang’s “A ride away” section is the second case. Section paragraphs and spot notes stay on the record. Do not edit the template to invent a second food layout. Do not move hours into `caption`.

## Dish page

A dish page is the specialty. Da Nang’s bowls, such as `src/content/dishes/mi-quang.json` and `src/content/dishes/bun-cha-ca.json`, use:

- `summary`, `nameVi`, `origin`, `howToEat`, `where`, `priceBand`, `placeSlugs`, `seoTitle`, `seoDescription`
- `where` names the street or the door the dossier names, in this city, before any city list
- a licensed photo of the bowl or the plate at `public/photos/{slug}.jpg`. A cityscape is a stand-in. A second file `{slug}-2` when one exists

`history`, `culture`, `texture`, and `taste` are included when a source gives them. `com-ga` has them. `mi-quang` does not. Leave the field out when the dossier has no source. Do not invent a flavor, a legend, or a date.

An unsourced hour is “Check on arrival”. Do not list a stall price.

## Photos

Open the file and look at it. Keep it when it shows that subject, in color, in one frame, and a traveler would recognize it. Record the author, license, and source from the file page. Do not invent a credit.

The city hero, `public/photos/{slug}.jpg`, is the scene people come for. Da Nang’s hero is the sand, the water, and the resort front in one frame (`da-nang.jpg`, China Beach). A pile of blue plastic chairs is a failure, including chairs on the right beach with the sea cropped out. The My Khe attraction frame may include chairs when the towers and the sand are still the subject. That frame is the wrong city hero.

An attraction image shows that attraction. An event image shows that event. A dish image shows that dish. A resort image shows that property. A side-trip card uses the neighbor’s own photo.

Reject soldiers, weapons, documents, maps, logos, collages, posters with titles burned in, and any frame that is not the subject. `scripts/fetch-photos.mjs` is a first search. It does not replace looking.

Keep a normal JPEG under 320 KB. Crop so a center cover still shows the subject: the city hero is 16:9, an attraction card is 3:2, an interest card is about 3:4. Do not invent sky.

## Affiliates and sidebar

Hotels and Restaurants are affiliate slots. The sidebar opens with Book your stay. The button uses `stayLink` from `src/lib/partners.ts` and says Search stays. The disclosure says we may earn a commission. The restaurant slot points at `/food/{slug}`.

Until a partner catalog is connected, the row is a photo, a title, one line, and a button. Do not invent a hotel, a restaurant, a score, or a price. Do not add Booking.com or Klook URLs, logos, or a date form.

Sidebar under the stay box: Explore with line icons, By interest, Plan your trip, Articles from `season` and festivals. Ads stay off.

## Checklist

Copy and complete. The place is done when every line is true.

```
- [ ] `research/<slug>/STATUS.md` says `stored` before any public edit
- [ ] Every public fact comes from that dossier
- [ ] No invented fee, hour, visa rule, sight, taste, or history. Unsourced fee or hour is “Check on arrival”
- [ ] Season chip is a traveler line. Intro is not a weather report
- [ ] No site-talk in public sentences
- [ ] `lat` and `lng` are sourced, or both are unset
- [ ] Existing editorial dots were not changed
- [ ] Templates, global.css, and src/lib/partners.ts were not edited
- [ ] `seoTitle`, `seoDescription`, and planning FAQs
- [ ] Place shell matches da-nang.json: one of the six regions, stay areas, eat, dishes, nearby, routes, itineraries. Search-name slug unchanged
- [ ] Attractions carry local `district` values the way Da Nang groups the beach, the river, the hills, the south shore, and Son Tra. A short ungrouped list fails. A monument is not padded
- [ ] Each published card is a licensed photo of that sight. No stand-in, including a chair pile used as the city hero
- [ ] No child district place was added to imitate a neighborhood Da Nang leaves on the record
- [ ] Festivals, each with a photo of that event, or an explicit draft note that none are recorded
- [ ] Side trips are real slugs. Unwritten neighbors are placeholders in the draft summary only
- [ ] Interest groups are this place’s own. Dining is first when there is a food guide. Shopping and Resort Living only when the rules above are met. Each card has its own photo
- [ ] One itinerary whose stops resolve to a place, attraction, or dish slug
- [ ] Food guide matches da-nang.json: local dish list, sections, spots, and a neighbor section. The specialty grid is not two generic dishes
- [ ] Each dish card and dish hero is a licensed photo of that dish. History, culture, texture, and taste appear only when sourced
- [ ] npm run check:content
```

## Draft summary

- Status: the stage just finished, and whether the place now matches Da Nang
- Files touched
- Facts taken from the dossier, each with its source id
- “Check on arrival” fields
- Side trip placeholders
- Cards omitted because the licensed photo of that subject is missing
- Dots proposed on new records
- Interest groups, in this place’s words
