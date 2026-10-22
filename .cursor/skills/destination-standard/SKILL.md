---
name: destination-standard
description: >-
  Sets the shared rules for a Vietnam Guide destination page: Da Nang is the
  required shape, six attraction cards then a Show all control, Dining and
  F&B as the first interest card, and interest groups taken from that place.
  Use when setting up or revising a destination, its attraction list, or its
  interest groups.
---

# Destination page standard

Da Nang is the required shape. Every destination follows the same frames with its own facts. The records, the local groups, and the hard rules are `.cursor/skills/city-setup/SKILL.md`. How the page looks is `.cursor/skills/ui-ux/SKILL.md`. The shared template reads each place’s own records. Do not hardcode one city’s venues into a template.

A destination is not done while any of these is true:

- The city hero is a pile of blue plastic chairs, or any stand-in that is not the subject.
- The food guide’s public specialty grid is two generic dishes.
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

The food record follows `src/content/food/da-nang.json`: a lede, the local dish list, sections with streets and doors the dossier names, and a neighbor section. The page prints a specialty card only when a licensed photo of that dish exists. A guide whose grid is two generic dishes is not done. A section without a photo card stays in the record. Do not invent a second food layout to print it. Hours stay out of the card caption. An unsourced hour is “Check on arrival”.

Each dish page has a licensed photo of that dish. History, culture, texture, taste, and how to enjoy it are written when a source gives them. Leave out any of those points you cannot source. Do not invent them.

## Events

Event pages need what happens, when, where, and a licensed photo of that event. Da Nang files the fireworks festival and the Avalokitesvara festival. An unsourced date stays “Check on arrival”. The city hero is the wrong photo.

## Photos

Credit every photo. One subject per card. A stand-in fails. The city hero is the scene people come for. Da Nang’s hero is the sand, the water, and the resort front together. A pile of blue plastic chairs fails. The same beach frame on Beach, An Thuong, and Beach night fails.

## Hard rules

Do not invent a fee, an hour, a visa rule, a sight, a taste, or a history. The season chip is a traveler line. Public copy does not say “its own page”, “no page here”, “this guide”, or “licensed photo was not filed”. Do not guess a coordinate. Do not edit rank-dot math. Partner URLs stay in `src/lib/partners.ts`. A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`.
