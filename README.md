# Vietnam Guide

A static travel reference for Vietnam. Pages share one template: a short definition, editorial dots, a fact bar, and the same tabs on every town.

```bash
npm install
npm run dev
npm run build
```

The public domain is `https://vietnam-travelguide.com`. It is set in `astro.config.mjs` (`site`), `src/config/site.ts`, `public/robots.txt`, `public/llms.txt`, and `public/CNAME`.

## Edit a page

Place records live in `src/content/places`. The field list and the rules for agents are in `AGENTS.md`. `npm run check:content` catches a broken internal link before the build.

Set `correctionsEmail` and `analyticsBeacon` in `src/config/site.ts` when you want a public corrections address and a rank-event endpoint. Leave the beacon empty and the first page load stays free of third-party requests.

## Speed budget

`npm run build` fails if a key HTML file is over 80 KB gzipped or if it references a third-party script.
