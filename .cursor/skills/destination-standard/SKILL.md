---
name: destination-standard
description: >-
  Sets the shared rules for a Vietnam Guide destination page: Da Nang is the
  required shape, six attraction cards then a Show all control, Dining and
  F&B as the first interest card, interest groups taken from that place, and
  a food guide of 40 to 50 sourced entries in the Japan Guide page order.
  Use when setting up or revising a destination, its attraction list, its
  food guide, or its interest groups.
---

# Destination page standard

Da Nang is the required shape. Every destination follows the same frames with its own facts. The records, the local groups, and the hard rules are `.cursor/skills/city-setup/SKILL.md`. How the page looks is `.cursor/skills/ui-ux/SKILL.md`. The shared template reads each place’s own records. Do not hardcode one city’s venues into a template.

A destination is not done while any of these is true:

- The city hero is a pile of blue plastic chairs, or any stand-in that is not the subject.
- A dining city whose dossier can support 40 is still a two-dish list, or it stops at Da Nang’s 13 dish pages. Hanoi, Ho Chi Minh City, Da Nang, Hue, Hoi An, Nha Trang, and that class are those cities.
- The attraction list is short and ungrouped.

## Attractions

- A city or town page lists the sights travelers actually use, grouped by local `district` the way Da Nang groups The beach, The river, The hills, South shore, and Son Tra. Da Nang files 15. High-demand places carry a list of that depth: Hanoi, Ho Chi Minh City, Da Nang, Hoi An, Hue, Ha Long, Sapa, Ninh Binh, Phu Quoc, Nha Trang, Da Lat.
- Scale the count with how much travelers actually do there. A single monument or park lists every sourced sight and does not pad the list with invented stops or invented areas.
- The page shows 6 attraction cards. The rest sit behind a control labeled “Show all”.
- That control is a button under the cards, the full width of the list. It is not a card and it does not take a slot in the grid.
- On a wide screen the list is three cards a row, so those six are two rows and then the button. Narrower widths use fewer columns. Cards fill each row. A short line of text does not open a gap. Do not use a masonry layout.
- “Show all” reveals the rest in that same packed grid. The control stays under the full list and can collapse it. Area names stay on the attraction records. They do not start a new card grid. Da Nang does not publish a child district place for those areas.
- A finished attraction has a kicker, a sourced notice, body copy, a second photo of that sight, getting there, and hours and fees. An unsourced fee or hour stays “Check on arrival”. `da-nang--an-thuong.json` is still short of that. Do not copy its missing fields. The sight skill is `.cursor/skills/attraction-page/SKILL.md`.

## Interests

Interests are real groupings for that city. The slider is one row. Dining and F&B is the first card when this place has a food guide. It opens that guide.

Da Nang’s groups show the depth. They are the wrong list to paste onto another city:

- Dining and F&B. Opens the food guide.
- Shopping. A card only for a shop with a licensed photo of that shop. Other sourced shopping stays in the block text.
- Resort Living. Opens the resort page when a resort stay is a real reason to go.
- Beach lifestyle. Opens to the sand: the club, the brewery, a coffee, and the swim.
- Beach sports. Opens to the hire on the beach, with the sourced detail.
- Nightlife. Opens to the lanes inland of the sand.
- Culture. Opens to the museum, the church, the marble hill, and Linh Ung.
- River walk. Opens to the promenade, the swing bridge, the market, Dragon Bridge, and Thuan Phuoc.

Other cities write their own groups from how people actually use that place. Each interest card has its own photograph of that subject. The same picture is not repeated across cards.

## Food

The food page follows the Japan Guide order. The record fields and the count are `.cursor/skills/city-setup/SKILL.md`. Da Nang’s 13 dish pages are not the ceiling.

The order is hero, intro, city specialties, regional dishes only if sourced, international dining, casual dining, fine dining, themed dining, and breakfast only if sourced. City specialties open with a highlights list, then a photo essay per dish. Book your stay is the existing rail. The page does not include a poll, an ad, or a hotel ranking.

A dining city whose dossier can support 40 carries 40 to 50 entries across those groups. Hanoi, Ho Chi Minh City, Da Nang, Hue, Hoi An, Nha Trang, and that class are those cities. That guide is not finished at a two-dish list or at Da Nang’s 13 dish pages.

A sourced dish named in the guide counts once, with or without a photo. The photo makes it a card. A sourced door, street, or room counts once, with or without a photo. The same dish or the same door counts once. A photo does not add a second entry.

If 40 sourced entries cannot be reached without inventing, publish every sourced entry and name the gap in the draft summary. Do not pad. Do not hold the page. My Son and Phong Nha get no invented dining street. A park or a pass with a short sourced list ships that list and names the gap.

A card needs a licensed photo of that dish or that room. An entry with no photo is named in the guide and is not a card. Do not borrow another photo. Hours stay out of the card caption. Do not edit the food template. That file is a separate pass.

Do not invent a dish, a restaurant, a taste, a history, a fee, or an hour. Where sources disagree, print every figure and name every source. An unsourced price or hour is “Check on arrival”.

Each dish page has a licensed photo of that dish. History, culture, texture, taste, and how to enjoy it are written when a source gives them. Leave out any of those points you cannot source. Do not invent them.

## Events

Event pages need what happens, when, where, and a licensed photo of that event. Da Nang files the fireworks festival and the Avalokitesvara festival. An unsourced date stays “Check on arrival”. The city hero is the wrong photo.

## Photos

Credit every photo. One subject per card. A stand-in fails. The city hero is the scene people come for. Da Nang’s hero is the sand, the water, and the resort front together. A pile of blue plastic chairs fails. The same beach frame on Beach, An Thuong, and Beach night fails.

## Hard rules

Do not invent a dish, a restaurant, a taste, a history, a fee, an hour, a visa rule, or a sight. Where sources disagree, print every figure and name every source. An unsourced price or hour is “Check on arrival”. The season chip is a traveler line. Public copy does not say “its own page”, “no page here”, “this guide”, or “licensed photo was not filed”. Do not guess a coordinate. Do not edit rank-dot math. Partner URLs stay in `src/lib/partners.ts`. A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`.
