---
name: blog
description: >-
  Writes and selects Vietnam Guide blog posts for the homepage. Use when a run
  scouts the day’s stories, chooses homepage highlights, or edits
  src/content/blog or src/content/front-page.json.
---

# Blog

The owner asked for this content type. Posts are the only source of the homepage highlight block and the stories under it. Festivals stay in `src/content/festivals/`. Season notes stay on the place. A post may link to them. It does not replace them.

## What a post is

One JSON file in `src/content/blog/<slug>.json`.

- `published` is the day it was written, `YYYY-MM-DD`.
- `kicker` is a short label such as Festival, Season, or Road.
- `when` is the line under the title. If a date, hour, closure, or fee is not in a source, write “check on arrival”.
- `body` is original prose. Two or more paragraphs. Do not paste another article. Do not copy its sentences.
- `sources` names the page and links to it with `https`.
- `photo` is a credited JPEG of that subject in `public/photos/`. One file is not reused on another post. Prefer a Wikimedia Commons featured or quality image when one shows that subject. Record the author, license, and source in `public/photos/credits.json`. Do not invent a credit. A post with no licensed photo of its subject does not go up.
- `photoAlt` says what the frame shows when the picture is not the title itself.

Do not invent a closure, a date, a fee, or an hour. Do not edit place, attraction, or festival JSON. Do not edit templates, layout, styles, or `src/lib/partners.ts`.

## Homepage

`src/content/front-page.json` is the day’s choice:

```json
{ "date": "YYYY-MM-DD", "slugs": ["first", "second"] }
```

`date` is the day of the selection. `slugs` are posts, in order, with no duplicates.

The template uses that order and nothing else:

1. The first slug is the large highlight.
2. The next three sit in the row on that photo.
3. The fifth is the next large card.
4. Every other current post is the stories list under that block.

A festival page or a place `season` field is not a highlight and not a story. Only a post is.

## Two runs

The scout writes about two posts a day. One is enough when only one story is sourced. The front-page pass only edits `src/content/front-page.json`. Prompts are `ops/prompts/blog-scout.md` and `ops/prompts/blog-front.md`. Neither run is scheduled until the owner turns it on in Cursor Automations. Saving the prompt does not create the automation. Do not claim the schedule is live.

Choose a highlight because a traveler can use it now: an event that is on, a route or a clock that changed, or a sourced fact that changes the day. Do not lead the homepage with a status note whose only point is that a date is unconfirmed. Skip a post that only repeats another post. Prefer more than one place across the five slots.

## Finish

Run `npm run check:content`. Open a draft. Do not merge.
