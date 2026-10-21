---
name: content-board
description: >-
  Claims the next Vietnam Guide content unit on ops/board so research,
  page setup, copy, and quality do not duplicate each other. Use when a run
  researches a place, sets up a page, polishes copy or photos, checks quality,
  or asks what content work is next.
---

# Content board

`ops/board/` is the shared database. `control.json` is the pause switch and the cap. `places/<slug>.json` is one destination. Every content run reads them and updates them with `node scripts/board.mjs`. Do not keep a second list in chat, in automation memory, or in a canvas.

The owner’s lane is separate. Do not edit `src/pages`, `src/layouts`, `src/components`, `src/styles`, `src/lib`, `src/config`, `src/scripts`, `package.json`, or `astro.config.mjs`. Affiliates stay in `src/lib/partners.ts`. Do not add a booking widget. Do not set `control.pause`, do not edit `control.holdPlaces`, and do not delete `ops/PAUSE`.

## Dispatcher

The hourly automation only dispatches. `node scripts/board.mjs next` prints up to `control.parallelUnits` places, one unit each. Skip slugs that already have an open `content:` pull request, and cap the limit at the free slots under `control.maxOpenContentPrs`.

Start one cloud agent per printed place. Do not research in the dispatcher chat, and do not walk the places one after another there. If cloud agents cannot be started, stop and leave the units unclaimed.

A claim locks that place only. Another place can be claimed in the same hour. The worker for a place keeps claiming the next stage of that place until `next --place <slug> --skip-stage ...` says stop. Lanes stay in order.

After the workers finish, open any missing draft. The title stays `content: <slug> <first stage>`. Later stages are more commits on that same pull request.

## One place

One worker, one place, every stage that place still has open. Do one stage, complete it, then run `node scripts/board.mjs next --place <slug> --skip-stage <stages already done this run>`. Claim that next stage. Do not call a global `next` and switch places. The stage decides the skill and the files.

| Stage | Skill | What this run may change |
|---|---|---|
| `researchBase` | destination-research | The scene and getting there, in `research/<slug>/`. No public JSON. |
| `researchAttractions` | destination-research | Sights and areas only. Add each row to the board. |
| `researchFood` | destination-research | Dishes, markets, and food streets. Restaurant names stay under the street as `do not publish as a pick`. |
| `researchNightlife` | destination-research | Evening areas and a few sourced landmarks. |
| `researchLifestyle` | destination-research | The ordinary day: breakfast, the swim or the walk, cafe streets, the quiet hour. |
| `researchContext` | destination-research | Events and side trips. |
| `destination` | city-setup | The place shell, interest groups, one itinerary, festivals, nearby, stay areas. Not a new attraction file. |
| `destinationCopy` | graphic-copy | Place prose and the place hero only. |
| `destinationQuality` | this skill | Read the place. Do not rewrite it. |
| `food` | city-setup | `src/content/food/<slug>.json`, bundled dish records, dish photos. |
| `foodCopy` | graphic-copy | Food-guide prose, dish prose, dish photos. |
| `foodQuality` | this skill | Read the food guide and dishes. Do not rewrite them. |
| `page` | city-setup | That one attraction file and its photo. |
| `copy` | graphic-copy | That attraction’s prose and photo. |
| `quality` | this skill | Read that attraction. Do not rewrite it. |

A city-setup checklist that mentions later stages is the end state of the place, not permission to do those stages inside the current one. Finish the claimed stage, then claim the next stage for this same place.

`publish: candidate` may be researched. It may not get a file under `src/content` until the owner sets `publish` to `accepted`.

## Lock

1. Update from `main`. If `ops/board/places/<slug>.json` conflicts, stop.
2. `node scripts/board.mjs reconcile --place <slug>`
3. `node scripts/board.mjs next --place <slug>`, then `claim` that stage. Claim checks this place only. If it refuses, stop. Do not take a different place.
4. Commit only `ops/board/places/<slug>.json`, push, and open a draft pull request titled `content: <slug> <stage>` before the long work. If you cannot open the pull request, push anyway and give the dispatcher the branch name.
5. Do the stage. Update that place file with `complete` or `block`. `node scripts/board.mjs guard` must pass. Run `npm run check:content` when public JSON changed. Commit and push onto the same branch.
6. Run `node scripts/board.mjs next --place <slug> --skip-stage <stages already completed this run>`. If it prints work, claim that stage and repeat. If it prints `place-clear`, stop. One pass per stage.

If you cannot finish, `block` with the question, or `release --place <slug>` and close the draft so the next hour can retry. A merged place file must have `claim` set to `null`.

Do not write automation memories. The board is the only status.

## Commands

- `next --limit 4 --skip hue,da-nang` — the places a dispatcher may start. Read-only. One starting unit per place.
- `next --place hue --skip-stage researchBase,researchFood` — the next stage for that place, ignoring stages this run already finished.
- `claim --place <slug> --stage <stage>` — takes that place's next unit. Refuses a different one, and does not lock any other place.
- `release --place <slug>` — drops that place's claim.
- `complete --place <slug> --stage <stage> --status <status> --note "..."` — finishes it and clears that place's claim.
- `set-item --place <slug> --id <id> --research stored` — marks one row sourced.
- `add-item --place <slug> --kind food-street --name "..." --slug ... --note "..."` — a row the dossier just found.
- `cover --place <slug> --bucket foodStreets --state partial` — `missing`, `partial`, `filled`, or `none`.
- `block --place <slug> --stage researchFood --question "..."` — waiting on the owner.
- `guard` — fails if the diff leaves `src/content`, `research`, `public/photos`, or `ops/board/`.

A research lane is stored only for its own headings, its own coverage buckets, and the items of its own kinds. A lane that is still `not_started` cannot be stored, and its buckets cannot be set to `filled`. The first pass ends `needs_depth`. Say what is still open in `--note`. A later pass may store it, and that note must contain the words `left out`. An item whose source is `owner` cannot have its page set to `skipped` during research. There is no single `research` stage. Page setup stays queued until every lane is stored or blocked. A missing bucket is taken before a partial one, so food streets are not stuck behind another pass over sights that already exist. Finishing a lane marks enriched copy stale so the second pass runs after the new research.

Item `page` is refused while that item’s research is not done.

## Quality

Read the dossier and the public record. Open the photo. Check the subject, the center crop, the credit, and any fee or hour.

- Pass: `complete --status checked`.
- One fixable miss: `complete --status rework --note` the miss. The script sends copy back.
- The same miss twice: the script blocks it and records a question. Stop.

Do not invent a fee, an hour, a visa rule, a hotel, or a restaurant.

## Owner controls

The owner pauses with `ops/PAUSE` or `control.pause`. They reserve one place with `control.holdPlaces`. They accept a new public slug by setting `publish` to `accepted`. Content runs do not do those things.
