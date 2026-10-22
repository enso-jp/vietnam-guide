---
name: graphic-copy
description: >-
  Polishes one Vietnam Guide place after its research dossier is stored, until
  the page matches Da Nang: prose, selling-point lines, the season chip, photos
  that are licensed pictures of that subject, and a food guide of 40 to 50
  sourced entries in the Japan Guide page order. Use when the user asks to
  polish, rewrite, or clean copy and images for a province, city, or town, or
  names the Graphic and Copy Writing Agent.
---

# Graphic and copy

One claimed stage at a time. The place is not done until it matches Da Nang. The records and the failure cases are `.cursor/skills/city-setup/SKILL.md`. A sight page matches `.cursor/skills/attraction-page/SKILL.md`. The reference sight is `src/content/attractions/da-nang--ba-na.json`.

Start a copy stage only when every research lane is `stored` or `blocked`, `research/<slug>/STATUS.md` says `stored`, and the board stage is `destinationCopy`, `foodCopy`, or an item `copy`. Read `.cursor/skills/content-board/SKILL.md`. If any research lane is `needs_depth` or `not_started`, stop. If the stage is `stale` or `rework`, enrich again from the dossier. The new food streets, nightlife, and lifestyle belong in the prose. When the stage is complete, claim the next copy or quality stage for this same place.

`destinationCopy` is the place prose and the place hero. `foodCopy` is the food guide and its dishes. An item `copy` is that attraction only.

## Hard rules

- Do not invent a layout, a dish, a restaurant, a taste, a history, a fee, an hour, a visa rule, a sight, a hotel, a score, or a price. If the dossier says `UNSOURCED` or `Check on arrival`, keep that on the page. An unsourced price or hour is “Check on arrival”.
- Where sources disagree, print every figure and name every source. Do not average them, and do not drop a conflicting figure.
- The season chip is a traveler line. Da Nang’s `season.label` is “Drier beach months”, and `season.note` tells the traveler what to do with September and the Hoi An road. Floods, closures, and peak dates stay in `season`. Do not rewrite `intro` into a weather report.
- Public sentences do not talk about the site. Leave out “its own page”, “no page here”, “this guide”, and “licensed photo was not filed”. If a sentence explains a missing card, delete the explanation and keep the traveler fact.
- Do not guess `lat` or `lng`. Leave both unset unless a source prints the point.
- Do not edit rank-dot math. Do not change an existing editorial dot. A dot suggested in the dossier applies only on a record that does not have one yet. Dots stay 1 to 5.
- Partner URLs stay in `src/lib/partners.ts`. Do not paste a booking widget or a partner URL.
- A content run does not edit templates, `src/styles/global.css`, or `src/lib/partners.ts`. A visual pass is `.cursor/skills/ui-ux/SKILL.md`.

## What you edit

- Prose already on the place, its attractions, its food guide, and its dishes: `summary`, `intro`, `interestsBody`, interest-group paragraphs, attraction summaries and body, food sections, dish fields the dossier supports.
- Photos in `public/photos/` and the matching credit in `public/photos/credits.json`.
- The place `season` only when the dossier has a sourced season note.

Leave Hotels and Restaurants as affiliate placeholders. Book your stay stays the existing rail. Do not add a poll, an ad, or a hotel ranking. The food record keeps the fields in `src/content/food/da-nang.json` and follows the page order in `.cursor/skills/city-setup/SKILL.md`. A dining city whose dossier can support 40 is not finished at a two-dish list or at Da Nang’s 13 dish pages. If 40 sourced entries cannot be reached without inventing, publish every sourced entry and name the gap in the draft summary. Do not pad. Do not hold the page. Do not edit the food template.

## Copy

Second person. Make the reader want the place. The first two sentences put them in the scene they came for: the light, the street, the thing in front of the hotel. Then the decision, stay here if this is the trip, go to the neighbor if that is the trip. Then a time of day, how to arrive, and the mistake to avoid.

A paragraph that could describe any coastal city fails. So does a paragraph that is only logistics. Specifics are the excitement. Do not inflate with empty praise: stunning, vibrant, hidden gem, must-see, nestled. Do not copy another site’s sentences.

Use a scene landmark from the dossier when it orients the evening. Do not turn it into a ranked list, and do not add a price or a score the dossier does not have.

Keep the search-name slug.

A selling-point line is one plain sentence: the reason to go. The destinations region list uses that line. It is the reason a traveler makes the trip. It is not a lodging instruction such as “Sleep here when…”.

## Photos

Open the file and look at it. A licensed photo of that subject is required. A stand-in is a failure. Then picture the file in the slot, because the page crops with a center cover:

- The city hero is 16:9. It is the brightest true picture of why people come. Da Nang’s hero, `public/photos/da-nang.jpg`, is the sand, the water, and the resort front in one frame. A pile of blue plastic chairs is a failure, including chairs on the right beach with the sea and the towers cropped out. The My Khe card may include chairs when the towers and the sand are still the subject. That card is the wrong city hero.
- An attraction card and the intro photo are 3:2. The landmark stays whole and recognizable. A portrait of a statue loses its head in that slot. Crop to the face and the gesture, from the real file. Do not invent sky or blur beside it.
- An interest card is tall, about 3:4. The subject has to sit in the center. The sides are cut. Each interest card has its own file. One beach photo used for the beach, An Thuong, and the beach night fails.
- A dish card, and each photo in a dish’s photo essay, is a photo of that dish. A cityscape, a cafe interior, or a different bowl is a stand-in. A room card is a photo of that room. Another restaurant, the beach, or a borrowed dish is a stand-in. A sourced dish counts once, with or without a photo. The photo makes it a card. An entry with no photo is named in the guide and is not a card. A dining city that can support 40 is not finished at two dishes.
- An event photo shows that event. The city hero is the wrong file.
- A resort photo shows that property. A stay-row photo shows that area. The beach file on a river hotel row is a stand-in.

Do not ship a panorama and hope the browser finds the subject. Crop the file so a center cover still shows the place at its best. Reject a frame that is mostly empty sky, empty sand, fog with no landmark, a collage, a poster with a title burned in, a document, a logo, or a soldier.

Keep a normal JPEG under 320 KB. Record the author, license, and source from the file page. Do not invent a credit. Do not demand a 1920px-wide hero. The page budget is the limit in `AGENTS.md`.

The image id stays `{placeSlug}-{slug}` for an attraction hero and the place slug for the city banner. A second attraction frame is `{placeSlug}-{slug}-2`.

When the page is an attraction, follow `.cursor/skills/attraction-page/SKILL.md`. Do not lengthen a stub summary and call the page finished. `da-nang--an-thuong.json` is still that stub.

## Food and dishes

`foodCopy` checks the guide against the Japan Guide page order in `.cursor/skills/city-setup/SKILL.md`: hero, intro, city specialties with a highlights list and a photo essay per dish, regional dishes only if sourced, international dining, casual dining, fine dining, themed dining, and breakfast only if sourced. A sourced dish named in the guide counts once, with or without a photo. The photo makes it a card. A sourced door, street, or room counts once, with or without a photo. The same dish or the same door counts once. A dining city whose dossier can support 40 (Hanoi, Ho Chi Minh City, Da Nang, Hue, Hoi An, Nha Trang, and that class) carries 40 to 50 of those entries and is not finished at a two-dish list or at Da Nang’s 13 dish pages. If 40 sourced entries cannot be reached without inventing, publish every sourced entry and name the gap in the draft summary. Do not pad. Do not hold the page. My Son and Phong Nha get no invented dining street. A park or a pass with a short sourced list ships that list and names the gap. A card needs a licensed photo of that dish or that room. An entry with no photo is named in the guide and is not a card. History, culture, texture, and taste stay on a dish only when the dossier has a source. Leave the field out when it does not, and say so in the draft summary. Do not invent a flavor, a dish, or a room. Book your stay stays the existing rail. Do not add a poll, an ad, or a hotel ranking. Do not edit the food template.

## When a fact is missing

Write the question in `research/<slug>/questions.md`. Leave the public field as `Check on arrival`. Stop that item. The person running the chats pastes the question into the Research Agent. Do not try to message that agent yourself.

## Finish

Run `npm run check:content`. Show the diff. A chat with a person does not commit unless they ask. A run that claimed the unit on the board commits that unit. In the draft summary, list files touched, facts taken from the dossier, photos replaced and why they failed or passed the subject test, and questions left in `questions.md`. Say whether the place now matches Da Nang, including groups, the hero, and the food guide: the page order, the count of sourced dishes plus sourced doors, streets, and rooms, and the gap when that count is under 40. The page still ships.
