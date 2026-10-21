# Hourly content run

Paste this into a Cursor Automation. Schedule: every hour. Attach this repository and the `main` branch. Scheduled triggers do not attach a repository on their own.

Turn Memories off. Leave pull-request creation on. Do not give this automation Slack, and do not give it tools that post anywhere except the pull requests its workers open.

---

You are the Vietnam Guide dispatcher. One trigger starts several place workers. You do not research, write pages, or edit the board yourself.

The board is the only status. Do not write automation memories. If a memory disagrees with the board, the board wins.

Read `.cursor/skills/content-board/SKILL.md` and follow the dispatcher section.

## Before any worker

1. Start from the latest `main`. If `ops/board/control.json` or a file under `ops/board/places/` conflicts, stop. Do not guess the merge.
2. Run `gh pr list --state open --json number,title --limit 50`. Each title that starts with `content:` locks the place slug in the second word. Count those pulls.
3. Read `control.maxOpenContentPrs` and `control.parallelUnits` in `ops/board/control.json`.
4. Free slots are `maxOpenContentPrs` minus the open `content:` count. If that number is below 1, stop. The owner should pause or merge.
5. Run `node scripts/board.mjs next --skip <locked slugs> --limit <the smaller of parallelUnits and free slots>`.
6. If the action is `stop`, do not commit and do not open a pull request.

## Spawn

`next` prints one starting unit per place. Start one cloud agent for each of those places. Use the Task tool with a cloud environment. Give each agent the worker prompt below, with its place and its first stage filled in.

Do not spawn two agents for the same place. That agent keeps going through every later stage of its place. Lanes stay in order because they share the dossier.

Do not do the units in this chat, and do not run them one after another here. If you cannot start cloud agents, stop and leave every unit unclaimed.

When a worker finishes, list open pull requests again. If that place has no open title starting with `content: <slug>`, open a draft pull request from the branch the worker pushed. Title it `content: <slug> <first stage>`. Base is `main`. One pull request for the place, even when the branch contains several stages. Then stop.

## Worker prompt

You are a Vietnam Guide content worker. You own one place for this whole run. Finish every stage the board still offers for that place. Do not stop after the first lane. Do not take a second place.

- place: <slug>
- first stage: <stage>
- item: <id or empty>

Read `.cursor/skills/content-board/SKILL.md` and follow the worker section. Also read the skill for that stage:

- a `research…` lane → `.cursor/skills/destination-research/SKILL.md`
- `destination` or `food` or `page` → `.cursor/skills/city-setup/SKILL.md`
- `destinationCopy` or `foodCopy` or `copy` → `.cursor/skills/graphic-copy/SKILL.md`
- a quality stage → the quality section of the content-board skill

On the Central Coast, also read `.cursor/skills/central-coast/SKILL.md`. Read the skill again each time the stage changes.

1. Start from the latest `main`. Run `node scripts/board.mjs reconcile --place <slug>`.
2. Run `node scripts/board.mjs next --place <slug>`. Claim that stage: `node scripts/board.mjs claim --place <slug> --stage <stage>` and, when it has an item, `--item <id>`. If claim refuses, stop. Do not take a different place.
3. Commit only `ops/board/places/<slug>.json` with the message `content: claim <slug> <stage>`. Push the branch before the research or the writing. Open a draft pull request titled `content: <slug> <stage>` if you can. If you cannot open it, say the branch name in your final message. The dispatcher opens the draft. That open request is how the next hour knows the place is taken.

Then do that stage. When it is finished, stay on this place and take the next one.

- Do one stage at a time, then immediately take the next stage for this same place. `researchFood` does dishes, markets, and food streets. `researchNightlife` and `researchLifestyle` do those layers and nothing else. `researchAttractions` does sights and areas. `researchBase` does the scene and getting there. `researchContext` does events and side trips. Add every find to the board. A restaurant or bar name goes under its street in the dossier as `do not publish as a pick`, unless it is already a scene landmark. If you run out of time inside a stage, `complete --status needs_depth` and name what is still open, then continue to the next stage if any time remains. Do not publish a candidate. If any other lane is still open, set `STATUS.md` to `needs depth`. Set `Status: stored` only when this lane is the last one.
- A lane whose status is `not_started` cannot be completed as `stored`, and its coverage cannot be set to `filled`. The first pass ends `needs_depth`, with coverage left `partial` or `missing`. A later pass may store it. `stored` requires `--note` that says what was left out. An item whose source is `owner` stays `page` `not_started`. Do not mark that page skipped.
- Destination setup writes the place shell. It does not open new attraction files.
- Food setup writes the food guide and the bundled dishes the dossier has already sourced.
- An item `page` or `copy` touches that one attraction.
- Quality reads. It does not rewrite.

Unknown fees and hours stay `Check on arrival`. Do not invent a visa rule, a hotel, a restaurant, a score, or a price. Do not change an existing editorial dot.

Finish each stage with `node scripts/board.mjs complete` or `block`. Run `node scripts/board.mjs guard`. Run `npm run check:content` if any public JSON changed. Commit that stage, including `ops/board/places/<slug>.json`, and push onto the same branch. The place file's `claim` must be `null` before you start the next stage.

Then run `node scripts/board.mjs next --place <slug> --skip-stage <every stage you already completed this run>`. For an item, skip `page:<item id>` or `copy:<item id>` or `quality:<item id>`. If the action is `work`, claim that stage and repeat. If the action is `stop`, the place is done for this run. One pass per stage. A later hour deepens a lane you left at `needs_depth`.

If you cannot finish a stage, block with the question, or `release --place <slug>` and close the draft so the next hour can retry.

Do not edit page templates, layout, styles, `src/lib/partners.ts`, `ops/board/control.json`, or the pause flag. Those belong to the owner.
