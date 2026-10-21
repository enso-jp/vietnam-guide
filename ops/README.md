# Content board

`ops/board/` is the database every content agent reads. `control.json` holds pause, holds, and how many places may run at once. `places/<slug>.json` holds that destination. `node scripts/board.mjs` is the lock. Status in chat does not count.

The hourly automation is a dispatcher. It reads `next` and starts one cloud agent per free place, up to `control.parallelUnits` (4 unless you change it). It does not research in that same chat. Each of those agents stays on its place and works through every open stage once: the six research lanes on a first visit, then pages and copy on a later visit once the lanes are stored. A claim locks only that place, so Hue can run while Da Nang is claimed. The lanes of one place stay in order, because they share the dossier. One pull request holds every stage that run finished.

Open `content:` pull requests still count against `control.maxOpenContentPrs`. The dispatcher starts at most the free slots. Raise `parallelUnits` and `maxOpenContentPrs` together if you want more than four places in flight.

Research is six lanes, and page setup does not start until they are stored: base, attractions, food, nightlife, lifestyle, then events and side trips. A missing lane jumps ahead of a partial one. The first pass on a lane ends `needs_depth`. It cannot mark the lane `stored` or a bucket `filled`. A later pass may store it, and the note has to say what was left out. After the lanes come the destination page, destination copy, food page, food copy, and one attraction at a time. Quality is a read-only pass after each copy. A finished research lane marks old copy stale so the second pass uses the new material.

Da Nang's next lane is food. Dishes are already written. Food streets are not, and Huynh Thuc Khang has no source. Lifestyle has not been started. Nightlife and attractions stay open behind those, because they are partial rather than missing.

## What you set up

Two automations, not one. The hourly run writes, through the workers it starts. The daily run only reports, so it cannot collide with a claim.

1. Merge the pull request that splits this board. Both automations read `main`.
2. Open [Cursor Automations](https://cursor.com/automations). Replace the hourly prompt with `ops/prompts/hourly.md` whenever that file changes. The saved automation does not pick up the file by itself.
   - Trigger: Scheduled, every hour. You can narrow the hours later if the usage is too high.
   - Repository: this repo. Branch: `main`. A schedule does not attach the repo by itself.
   - Tools: pull requests on. Memories off. The dispatcher must be allowed to start cloud agents.
3. Keep the daily one on `ops/prompts/daily.md`.
   - Trigger: Scheduled, once each morning, in your timezone.
   - Same repository and branch.
   - Memories off. It must not open pull requests. Send to Slack only if you want the report pushed to you.
4. Leave page templates, layout, styles, and `src/lib/partners.ts` on your own branches. Content runs are refused on those paths.

You can also press Run now more than once. Each run skips places that are already claimed, so the extra runs pick up other destinations. The hourly prompt is what starts several agents from one trigger.

## How you steer it

- Pause everything: add a file `ops/PAUSE` on `main`, or set `control.pause` to `true` in `ops/board/control.json`. You can also pause the hourly automation in the Cursor UI. The daily report keeps running.
- Edit one destination yourself: add its slug to `control.holdPlaces` before you start, and remove it when you are done.
- Accept a new public place (Dong Hoi, Lang Co, Cham Islands, or a later find): set `publish` to `accepted` on that place file. Until then the hourly run may research it and may not create a public file.
- Answer a blocked question in `research/<slug>/questions.md`, then set that stage off `blocked` only when you want the run to continue. Merging the pull request is what records the block on `main`.
- Merge a `content:` pull request only when that place's claim is `null`. Close a draft that died after the claim commit, or that place stays locked.
- Pause the hourly automation while you edit `src/content` or `research` yourself.
- Do not merge a draft that stored a research lane on its first pass. The script now refuses that. A first pass ends `needs_depth`.

`node scripts/board.mjs report` is the same text the daily run starts from.
