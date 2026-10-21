# Content board

`ops/board.json` is the database every content agent reads. `node scripts/board.mjs` is the lock. Status in chat does not count.

The hourly automation takes one unit: research, then the destination page, then destination copy, then food, then food copy, then one attraction at a time. Quality is a read-only pass after each copy. A second enrichment is scheduled when research changes a dossier that was already copied.

Da Nang is first because its dossier is stored and still thin on food streets, nightlife, and lifestyle. Huynh Thuc Khang is an owner-named gap. It is not a published fact until a source is stored.

## What you set up

Two automations, not one. The hourly run writes. The daily run only reports, so it cannot collide with a claim.

1. Merge the pull request that adds this board. Both automations read `main`.
2. Open [Cursor Automations](https://cursor.com/automations). Create the hourly one from `ops/prompts/hourly.md`.
   - Trigger: Scheduled, every hour. You can narrow the hours later if the usage is too high.
   - Repository: this repo. Branch: `main`. A schedule does not attach the repo by itself.
   - Tools: pull requests on. Memories off.
3. Create the daily one from `ops/prompts/daily.md`.
   - Trigger: Scheduled, once each morning, in your timezone.
   - Same repository and branch.
   - Memories off. It must not open pull requests. Send to Slack only if you want the report pushed to you.
4. Leave page templates, layout, styles, and `src/lib/partners.ts` on your own branches. Content runs are refused on those paths.

## How you steer it

- Pause everything: add a file `ops/PAUSE` on `main`, or set `control.pause` to `true`. You can also pause the hourly automation in the Cursor UI. The daily report keeps running.
- Edit one destination yourself: add its slug to `control.holdPlaces` before you start, and remove it when you are done.
- Accept a new public place (Dong Hoi, Lang Co, Cham Islands, or a later find): set `publish` to `accepted`. Until then the hourly run may research it and may not create a public file.
- Answer a blocked question in `research/<slug>/questions.md`, then set that stage off `blocked` only when you want the run to continue. Merging the pull request is what records the block on `main`.
- Merge a `content:` pull request only when its claim is `null`. Close a draft that died after the claim commit, or that place stays locked.
- Pause the hourly automation while you edit `src/content` or `research` yourself.

`node scripts/board.mjs report` is the same text the daily run starts from.
