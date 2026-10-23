READ FIRST: AGENTS.md, .cursor/skills/attraction-page/SKILL.md (field set and photo rules; reference record src/content/attractions/da-nang--ba-na.json), .cursor/skills/city-setup/SKILL.md (area grouping via `district`), .cursor/skills/content-board/SKILL.md, research/<place>/ (the stored dossier).

RESEARCH
- Facts come from research/<place>/. If a sight needs more, research it (official site, city or provincial tourism portal, UNESCO, Wikipedia/Wikivoyage as secondary) and ADD it to the dossier with source URLs and access date (research/<place>/attractions.md plus research/<place>/attractions/<slug>.md per the attraction-page template). Never invent a fee, hour, duration, coordinate, history, or taste. Unsourced fee/hour -> "Check on arrival" in the fee/hours fields only, never inside a sentence. Sources that disagree: give the newest/official figure or a range; keep the conflict in the dossier, not on the page.

EACH NEW ATTRACTION (src/content/attractions/<place>--<slug>.json with placeSlug)
- Full finished shape like da-nang--ba-na.json: name, nameVi, kicker, summary, dots (editorial 1-5 for new records only; never change an existing dot), timeNeeded, fee, getThere, district (this place's own local area names, consistent with its other attractions), verified ("23 Oct 2026" style), heroCaption, body (>=2 paragraphs), figures (second photo id <place>-<slug>-2 when a second licensed photo of the same subject exists), gettingThere, legs (only sourced), hours/closed, admissionNote if bands, links (official https), interests (existing interest slugs only; check scripts/validate-content.mjs).
- CARD LINE: the place page card shows only the FIRST SENTENCE of `summary`, truncated at 110 characters (cardLine in src/lib/content.ts). Write that first sentence to fit in 110 chars and say what it is, what you do, how long, and why go, e.g. "Limestone cave on a bay island: walk its lit chambers in about 45 minutes for the bay's biggest cavern." The rest of the summary is the decision lede (under ~80 words total).
- Voice: plain, direct English for native speakers, second person. No source narration ("the portal prints", "one page says", "no source gives"), no site-talk ("this guide", "its own page"), no riddles or literary phrasing, no "not X" framing.

PHOTOS (hard rules)
- Licensed photos from Wikimedia Commons only, of THAT subject. View each image before keeping it (download it and look). Reject: wrong subject, generic street, another sight, the city banner, signs, maps, text, watermarks, soldiers/weapons, gray wash, speck subjects.
- Save as public/photos/<place>-<slug>.jpg (and -2.jpg), normal JPEG under 320 KB (resize with python PIL or ImageMagick; install if needed).
- Credits: public/photos/credits.json is APPEND-ONLY. Add new keys at the end of the object; never remove existing entries. Format: {"author": ..., "license": ..., "source": "https://commons.wikimedia.org/wiki/File:..."} with the real author and license from the file page.
- If no licensed photo of a sight exists, do not publish that sight. Record "unpublished: no licensed photo" in the dossier and report it.
- Replacing a wrong photo on an existing attraction: replace the file and update that one key's credit value (the only allowed credit edit; note it in the PR).

EXISTING ATTRACTIONS: rewrite any summary whose first sentence fails the card-line test. Strip research notes from public copy. Replace wrong-subject photos. Do not change existing dots.

DO NOT TOUCH: the place `summary` field in src/content/places/<place>.json (another PR owns it), templates/components/styles/src/lib (including src/lib/partners.ts), package.json, control.json, other places' files. Do not create a sight that belongs to another place slug (check src/content/attractions/ first).

BOARD: optionally record new sights with `node scripts/board.mjs add-item --place <place> --kind sight ...` and `set-item` if the script allows; if it refuses because the place is held, skip board updates and note that. `node scripts/board.mjs guard` should pass.

CHECKS: `npm ci` if needed, then `npm run check:content` must pass, then `npm run build` must pass (includes a size budget; report if the budget fails).

GIT/PR: create a branch, commit, push, and open a pull request (ready for review, not draft) titled "content: <place> attractions" against main. Do not merge. Do not push to main.

FINAL REPLY (short): PR URL and branch; attraction count before -> after; new attraction slugs; existing attractions whose card/photo you fixed; sights left unpublished (no licensed photo) or unsourced; "Check on arrival" fields; any owner decision needed.
