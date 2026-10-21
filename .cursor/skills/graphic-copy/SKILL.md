---
name: graphic-copy
description: >-
  Polishes one Vietnam Guide place after its research dossier is stored:
  page prose, food copy, and photos (subject, crop, size, credit). Use when
  the user asks to polish, rewrite, or clean copy and images for a province,
  city, or town, or names the Graphic and Copy Writing Agent.
---

# Graphic and copy

One claimed stage per pass. Start only when `research/<slug>/STATUS.md` says `stored` and the board stage is `destinationCopy`, `foodCopy`, or an item `copy`. Read `.cursor/skills/content-board/SKILL.md`. If the board says `needs_depth`, stop. If the stage is `stale` or `rework`, enrich again from the dossier.

`destinationCopy` is the place prose and the place hero. `foodCopy` is the food guide and its dishes. An item `copy` is that attraction only. Follow `AGENTS.md` and `.cursor/skills/city-setup/SKILL.md` for the page shape.

Do not invent a layout, a fee, an hour, a visa rule, a hotel, a restaurant, a score, or a price. If the dossier says `UNSOURCED` or `Check on arrival`, keep that on the page.

## What you edit

- Prose already on the place, its attractions, its food guide, and its dishes: `summary`, `intro`, `interestsBody`, attraction summaries, food sections.
- Photos in `public/photos/` and the matching credit in `public/photos/credits.json`.
- The place `season` only when the dossier has a sourced season note.

Leave the template components alone. A visual pass is `.cursor/skills/ui-ux/SKILL.md`. Hotels and Restaurants stay affiliate placeholders. The food guide page stays the menu. Do not paste a booking widget.

## Copy

Write the way the city-setup voice rule says, and make the reader want the place. Second person. The first two sentences put them in the scene they came for: the light, the street, the thing in front of the hotel. Then the decision, stay here if this is the trip, go to the neighbor if that is the trip. Then a time of day, how to arrive, and the mistake to avoid.

A paragraph that could describe any coastal city fails. So does a paragraph that is only logistics. Specifics are the excitement. Do not inflate with empty praise: stunning, vibrant, hidden gem, must-see, nestled. Do not copy another site’s sentences.

Use a scene landmark from the dossier when it orients the evening. Do not turn it into a ranked list, and do not add a price or a score the dossier does not have.

Keep the search-name slug. Do not change an existing editorial dot. A dot suggested in the dossier applies only on a record that does not have one yet.

## Photos

Open the file and look at it. Then picture it in the slot, because the page crops with a center cover:

- The city hero is 16:9. It is the brightest true picture of why people come. For a beach city that is the sand, the water, and the resort front together, not a documentary slice of river.
- An attraction card and the intro photo are 3:2. The landmark stays whole and recognizable. A portrait of a statue loses its head in that slot. Crop to the face and the gesture, from the real file. Do not invent sky or blur beside it.
- An interest card is tall, about 3:4. The subject has to sit in the center. The sides are cut.

Do not ship a panorama and hope the browser finds the subject. Crop the file so a center cover still shows the place at its best. Reject a frame that is mostly empty sky, empty sand, fog with no landmark, a collage, a poster with a title burned in, a document, a logo, or a soldier. Reject a side-trip photo that is not that place, and do not reuse the city hero for an event.

Keep a normal JPEG under 320 KB. Record the author, license, and source from the file page. Do not invent a credit. Do not demand a 1920px-wide hero. The page budget is the limit in `AGENTS.md`.

The image id stays `{placeSlug}-{slug}` for an attraction and the place slug for the city banner. A scene that is not the attraction, such as a beach night beside the swim, gets its own id.

## When a fact is missing

Write the question in `research/<slug>/questions.md`. Leave the public field as `Check on arrival`. Stop that item. The person running the chats pastes the question into the Research Agent. Do not try to message that agent yourself.

## Finish

Run `npm run check:content`. Show the diff. A chat with a person does not commit unless they ask. A run that claimed the unit on the board commits that unit. In the draft summary, list files touched, facts taken from the dossier, photos replaced, and questions left in `questions.md`.
