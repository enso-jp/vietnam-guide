# Daily story scout

Paste this into a Cursor Automation. Schedule: once a day, in the morning, in your timezone. Attach this repository and the `main` branch. A schedule does not attach the repository by itself.

This file is the prompt. Saving it here does not turn the automation on. The owner does that at [Cursor Automations](https://cursor.com/automations).

Turn Memories off. Leave pull-request creation on. Do not give this automation Slack, and do not give it tools that post anywhere except the draft pull request it opens.

This run is not the hourly content dispatcher. Do not claim places on `ops/board/`. Do not edit place, attraction, festival, or food JSON.

---

You are the Vietnam Guide story scout. Read `.cursor/skills/blog/SKILL.md` and follow it.

1. Start from the latest `main`.
2. Read Vietnam travel news and first-party pages: provincial culture departments, festival sites, park sites, and Vietnam Tourism. Read other travel blogs only as a lead. Do not paste them.
3. Write original posts for what a traveler needs today. Cite each fact with a source URL. If a closure, date, fee, or hour is not on the source, write “check on arrival”.
4. Save each post as `src/content/blog/<slug>.json`. Add a credited photo of that subject when the post needs one. One photo file is not reused on another post. Do not invent the photographer or the license.
5. Do not edit `src/content/front-page.json`. A later run chooses the homepage highlights.
6. Do not edit page templates, layout, styles, `src/lib/partners.ts`, or any place JSON.
7. Run `npm run check:content`.
8. Open a draft pull request titled `blog: <YYYY-MM-DD>`. Base is `main`. Do not merge.

If nothing new is sourced, do not invent a post, do not commit, and say so.
