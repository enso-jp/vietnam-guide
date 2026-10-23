# Phase 2 brief: route pages

Repo enso-jp/vietnam-guide. Route records live in src/content/routes/<slug>.json and render at /get-there/<slug> (src/pages/get-there/[slug].astro). Type: `Route` and `RouteMode` in src/lib/types.ts. Look at every existing route file first and match the shape exactly: slug, name, from, to, summary, modes[{mode, duration, note, partner?, partnerPath?}], seoTitle, seoDescription, faqs[{q,a}].

Read AGENTS.md first. The owner reviews on the live site.

Rules
- Sourced modes and times only. Sources: Vietnam Railways (dsvn.vn / vr.com.vn), airport and airline pages (Vietnam Airlines, Vietjet, Bamboo), provincial tourism portals, the operator of a ferry or boat, the place dossiers in research/<place>/getting-there.md, and Wikivoyage as a secondary source. Use a second source for a time when you can. If a duration has no source, write "Check on arrival" in `duration`. Do not invent distances, fares, frequencies, or timetables. No fares at all unless an official page prints them.
- Write the summary as a traveler line: which mode to take and why, in plain direct English. No source narration ("one page says", "the portal prints"), no site-talk.
- `partner`: "bus" only if a bus or limousine van mode is listed AND you set `partnerPath` in the 12go pattern `<from>/<to>` (busLink in src/lib/partners.ts builds https://12go.asia/en/travel/<path>; open that URL and confirm it is a real route page; if not, omit partnerPath and the bus partner). "flight" for flight modes. "train" for rail. "ferry" exists in the type but has no button; it is fine to set. Do not edit src/lib/partners.ts.
- One record per city pair. If the reverse direction is commonly searched, mention it in a FAQ, not a second record.
- Slug pattern: <from-place-slug>-to-<to-place-slug>, using existing place slugs from src/content/places/.
- Do NOT edit any file outside src/content/routes/ and research/<place>/getting-there.md (you may append sourced findings with URL and access date to the relevant dossier). Do not edit place files (other workers are editing them), itineraries, templates, or partners.ts.
- `npm ci` if needed; `npm run check:content` must pass; `npm run build` must pass.
- Create a branch, commit, push, open a pull request (ready for review) titled "content: route pages (<group>)" against main. Do not merge or push to main.

Final reply (short): PR URL and branch; routes added (slug, modes, and which durations are sourced vs Check on arrival); any route you could not source enough to publish; any owner question.
