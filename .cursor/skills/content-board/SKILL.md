---
name: content-board
description: >-
  Claims the next Vietnam Guide content unit on ops/board.json so research,
  page setup, copy, and quality do not duplicate each other. Use when a run
  researches a place, sets up a page, polishes copy or photos, checks quality,
  or asks what content work is next.
---

# Content board

`ops/board.json` is the shared database. Every content run reads it and updates it with `node scripts/board.mjs`. Do not keep a second list in chat, in automation memory, or in a canvas.

The owner’s lane is separate. Do not edit `src/pages`, `src/layouts`, `src/components`, `src/styles`, `src/lib`, `src/config`, `src/scripts`, `package.json`, or `astro.config.mjs`. Affiliates stay in `src/lib/partners.ts`. Do not add a booking widget. Do not set `control.pause`, do not edit `control.holdPlaces`, and do not delete `ops/PAUSE`.

## One unit

One run, one unit. `node scripts/board.mjs next` prints it. The stage decides the skill and the files.

| Stage | Skill | What this run may change |
|---|---|---|
| `research` | destination-research | `research/<slug>/` and the board. No public JSON and no photos. |
| `destination` | city-setup | The place shell, interest groups, one itinerary, festivals, nearby, stay areas. Not a new attraction file. |
| `destinationCopy` | graphic-copy | Place prose and the place hero only. |
| `destinationQuality` | this skill | Read the place. Do not rewrite it. |
| `food` | city-setup | `src/content/food/<slug>.json`, bundled dish records, dish photos. |
| `foodCopy` | graphic-copy | Food-guide prose, dish prose, dish photos. |
| `foodQuality` | this skill | Read the food guide and dishes. Do not rewrite them. |
| `page` | city-setup | That one attraction file and its photo. |
| `copy` | graphic-copy | That attraction’s prose and photo. |
| `quality` | this skill | Read that attraction. Do not rewrite it. |

A city-setup checklist that mentions later stages is the end state of the place, not permission to do those stages now. Leave them on the board.

`publish: candidate` may be researched. It may not get a file under `src/content` until the owner sets `publish` to `accepted`.

## Lock

1. Update from `main`. If `ops/board.json` conflicts, stop.
2. List open pull requests. Any title that starts with `content:` locks its place slug (the second word). Run `node scripts/board.mjs next --skip slug-one,slug-two`.
3. If open `content:` pull requests are at or above `control.maxOpenContentPrs`, stop.
4. `node scripts/board.mjs reconcile`
5. If `next` prints `action: stop`, do not commit and do not open a pull request.
6. `node scripts/board.mjs claim --place <slug> --stage <stage>` and, when `next` printed an item, `--item <id>`.
7. Commit the board, push, and open a draft pull request titled `content: <slug> <stage>` before the long work. The open request is the lock the next hour can see.
8. Do the stage.
9. Update the board with `complete` or `block`. `node scripts/board.mjs guard` must pass. Run `npm run check:content` when public JSON changed.
10. Commit and push onto the same pull request.

If you cannot finish, `block` with the question, or `release` and close the draft so the next hour can retry. A merged request must have `claim` set to `null`.

Do not write automation memories. The board is the only status.

## Commands

- `next` — the unit to do. Read-only.
- `claim` — takes that unit. Refuses a different one.
- `complete --place <slug> --stage <stage> --status <status> --note "..."` — finishes it and clears the claim.
- `set-item --place <slug> --id <id> --research stored` — marks one row sourced.
- `add-item --place <slug> --kind food-street --name "..." --slug ... --note "..."` — a row the dossier just found.
- `cover --place <slug> --bucket foodStreets --state filled` — `missing`, `partial`, `filled`, or `none`.
- `block --place <slug> --stage research --question "..."` — waiting on the owner.
- `guard` — fails if the diff leaves `src/content`, `research`, `public/photos`, or `ops/board.json`.

Research is `stored` only when the dossier headings exist, every coverage bucket is `filled` or `none`, and every item is `stored`, `skipped`, or `blocked`. `needs_depth` is an honest stop when the pass ran out of time. Say what is still open in `--note`. A research `complete` marks enriched copy as `stale` so the second pass runs again.

Item `page` is refused while that item’s research is not done.

## Quality

Read the dossier and the public record. Open the photo. Check the subject, the center crop, the credit, and any fee or hour.

- Pass: `complete --status checked`.
- One fixable miss: `complete --status rework --note` the miss. The script sends copy back.
- The same miss twice: the script blocks it and records a question. Stop.

Do not invent a fee, an hour, a visa rule, a hotel, or a restaurant.

## Owner controls

The owner pauses with `ops/PAUSE` or `control.pause`. They reserve one place with `control.holdPlaces`. They accept a new public slug by setting `publish` to `accepted`. Content runs do not do those things.
