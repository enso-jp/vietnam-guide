---
name: graphic-copy
description: >-
  Polishes one Vietnam Guide place after its research dossier is stored:
  page prose, food copy, and photos (subject, crop, size, credit). Use when
  the user asks to polish, rewrite, or clean copy and images for a province,
  city, or town, or names the Graphic and Copy Writing Agent.
---

# Graphic and copy

One destination per pass. Start only when `research/<slug>/STATUS.md` says `stored`. Read that dossier before editing. Follow `AGENTS.md` and `.cursor/skills/city-setup/SKILL.md` for the page shape.

Do not invent a layout, a fee, an hour, a visa rule, a hotel, a restaurant, a score, or a price. If the dossier says `UNSOURCED` or `Check on arrival`, keep that on the page.

## What you edit

- Prose already on the place, its attractions, its food guide, and its dishes: `summary`, `intro`, `interestsBody`, attraction summaries, food sections.
- Photos in `public/photos/` and the matching credit in `public/photos/credits.json`.
- The place `season` only when the dossier has a sourced season note.

Leave the template components alone. A visual pass is `.cursor/skills/ui-ux/SKILL.md`. Hotels and Restaurants stay affiliate placeholders. The food guide page stays the menu. Do not paste a booking widget.

## Copy

Write the way the city-setup voice rule says: second person, the decision first, a time of day, how to arrive, the mistake to avoid, one concrete detail. Use the dossier for the detail. Do not copy another site’s sentences.

Keep the search-name slug. Do not change an existing editorial dot. A dot suggested in the dossier applies only on a record that does not have one yet.

## Photos

Open the file and look at it.

Keep it when the subject fills the frame, the crop still shows that subject on a card, and the file is a normal JPEG under 320 KB. A hero that is mostly sky, a collage, a poster with a title burned in, a document, a logo, or a soldier does not stay.

Replace a bad frame with another file whose title names the subject. Record the author, license, and source from the file page. Do not invent a credit. Do not demand a 1920px-wide hero. The page budget is the limit in `AGENTS.md`.

The image id stays `{placeSlug}-{slug}` for an attraction and the place slug for the city banner.

## When a fact is missing

Write the question in `research/<slug>/questions.md`. Leave the public field as `Check on arrival`. Stop that item. The person running the chats pastes the question into the Research Agent. Do not try to message that agent yourself.

## Finish

Run `npm run check:content`. Show the diff. Do not commit unless the user asks. In the draft summary, list files touched, facts taken from the dossier, photos replaced, and questions left in `questions.md`.
