#!/usr/bin/env node
/**
 * Shared status for Vietnam Guide content runs.
 * The file ops/board.json is the database. This script is the only writer
 * hourly runs should use. It does not edit public pages.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const boardPath = process.env.BOARD_PATH || path.join(root, "ops", "board.json");
const pausePath = process.env.PAUSE_PATH || path.join(root, "ops", "PAUSE");
const researchRoot = process.env.RESEARCH_ROOT || path.join(root, "research");

const PLACE_STAGES = [
  "research",
  "destination",
  "destinationCopy",
  "destinationQuality",
  "food",
  "foodCopy",
  "foodQuality",
];

const ITEM_FIELDS = ["page", "copy", "quality"];

const COVERAGE_BUCKETS = [
  "sights",
  "areas",
  "foodStreets",
  "nightlife",
  "lifestyle",
  "events",
  "sideTrips",
];

const SKILL = {
  research: "destination-research",
  destination: "city-setup",
  destinationCopy: "graphic-copy",
  destinationQuality: "content-board",
  food: "city-setup",
  foodCopy: "graphic-copy",
  foodQuality: "content-board",
  page: "city-setup",
  copy: "graphic-copy",
  quality: "content-board",
};

const ALLOWED_PATH = [
  /^src\/content\//,
  /^research\//,
  /^public\/photos\//,
  /^ops\/board\.json$/,
  /^ops\/reports\//,
];

const PRIORITY = {
  "da-nang": 1,
  hue: 2,
  "hoi-an": 3,
  "my-son": 4,
  "phong-nha": 5,
  hanoi: 10,
  "old-quarter": 11,
  "ninh-binh": 12,
  "tam-coc": 13,
  "ha-long": 14,
  "cat-ba": 15,
  sapa: 16,
  "ha-giang": 17,
  "mai-chau": 18,
  "ho-chi-minh-city": 20,
  "cu-chi": 21,
  "da-lat": 30,
  "nha-trang": 31,
  "mui-ne": 32,
  "can-tho": 40,
  "phu-quoc": 41,
};

const CANDIDATES = [
  {
    slug: "dong-hoi",
    name: "Dong Hoi",
    nameVi: "Đồng Hới",
    corridor: "central-coast",
    kind: "city",
    priority: 100,
    note: "Named in Central Coast coverage as the Phong Nha gateway. Research may be stored. Do not create a public place file until publish is accepted.",
  },
  {
    slug: "lang-co",
    name: "Lang Co",
    nameVi: "Lăng Cô",
    corridor: "central-coast",
    kind: "town",
    priority: 101,
    note: "Named in Central Coast coverage. Research may be stored. Do not create a public place file until publish is accepted.",
  },
  {
    slug: "cham-islands",
    name: "Cham Islands",
    nameVi: "Cù Lao Chàm",
    corridor: "central-coast",
    kind: "area",
    priority: 102,
    note: "Named in Central Coast coverage. Research may be stored. Do not create a public place file until publish is accepted.",
  },
];

const DONE = new Set(["stored", "paged", "enriched", "checked", "skipped"]);

function nowIso() {
  return new Date().toISOString();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function load() {
  if (!fs.existsSync(boardPath)) {
    fail(`No board at ${path.relative(root, boardPath)}. Run: node scripts/board.mjs init`);
  }
  return readJson(boardPath);
}

function save(board) {
  board.updated = nowIso();
  writeJson(boardPath, board);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      out._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function stage(note = "") {
  return { status: "not_started", note, updated: null, reworkCount: 0 };
}

function blankCoverage() {
  return Object.fromEntries(COVERAGE_BUCKETS.map((key) => [key, "missing"]));
}

function itemRow(fields) {
  return {
    id: fields.id,
    kind: fields.kind,
    track: fields.track || "unit",
    name: fields.name,
    slug: fields.slug,
    file: fields.file || null,
    source: fields.source || "published",
    research: fields.research || "not_started",
    page: fields.page || "not_started",
    copy: fields.copy || "not_started",
    quality: fields.quality || "not_started",
    note: fields.note || "",
    updated: null,
    reworkCount: 0,
  };
}

function placeShell(fields) {
  return {
    slug: fields.slug,
    name: fields.name,
    nameVi: fields.nameVi || "",
    corridor: fields.corridor || "",
    kind: fields.kind || "city",
    parent: fields.parent || null,
    publish: fields.publish || "live",
    priority: fields.priority ?? 50,
    note: fields.note || "",
    coverage: fields.coverage || blankCoverage(),
    stages: {
      research: stage(),
      destination: stage(),
      destinationCopy: stage(),
      destinationQuality: stage(),
      food: stage(),
      foodCopy: stage(),
      foodQuality: stage(),
    },
    items: fields.items || [],
    questions: [],
  };
}

function isDone(status) {
  return DONE.has(status);
}

function coverageDone(place) {
  return COVERAGE_BUCKETS.every((key) => place.coverage[key] === "filled" || place.coverage[key] === "none");
}

function unitItems(place) {
  return place.items.filter((item) => item.track === "unit");
}

function findPlace(board, slug) {
  const place = board.places.find((row) => row.slug === slug);
  if (!place) fail(`No place ${slug} on the board.`);
  return place;
}

function findItem(place, id) {
  const item = place.items.find((row) => row.id === id);
  if (!item) fail(`No item ${id} on ${place.slug}.`);
  return item;
}

function paused(board) {
  if (board.control?.pause) return board.control.pauseReason || "control.pause is true";
  if (fs.existsSync(pausePath)) return `Pause file exists at ${path.relative(root, pausePath)}`;
  return "";
}

function claimAgeHours(board) {
  if (!board.claim?.at) return null;
  return (Date.now() - Date.parse(board.claim.at)) / 36e5;
}

function claimFresh(board) {
  const age = claimAgeHours(board);
  if (age == null || Number.isNaN(age)) return false;
  return age < (board.control.claimStaleHours ?? 3);
}

function skipSet(flag) {
  if (!flag || flag === true) return new Set();
  return new Set(String(flag).split(",").map((s) => s.trim()).filter(Boolean));
}

function held(board, slug, skip) {
  if (skip.has(slug)) return true;
  return (board.control.holdPlaces || []).includes(slug);
}

function nextWork(board, skip) {
  const hold = paused(board);
  if (hold) return { action: "stop", reason: "paused", detail: hold };
  if (board.claim && claimFresh(board)) {
    return {
      action: "stop",
      reason: "claimed",
      detail: "A fresh claim is on the board. Wait for that run to finish, or let it go stale.",
      claim: board.claim,
    };
  }
  const stale = board.claim && !claimFresh(board);
  const places = [...board.places].sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug));
  for (const place of places) {
    if (place.publish === "candidate") continue;
    if (held(board, place.slug, skip)) continue;
    const unit = nextForPlace(place);
    if (unit) return { action: "work", releasedStaleClaim: Boolean(stale), ...unit };
  }
  for (const place of places) {
    if (place.publish !== "candidate") continue;
    if (held(board, place.slug, skip)) continue;
    const research = place.stages.research;
    if (research.status === "blocked") continue;
    if (!isDone(research.status)) {
      return {
        action: "work",
        releasedStaleClaim: Boolean(stale),
        place: place.slug,
        name: place.name,
        publish: place.publish,
        stage: "research",
        item: null,
        skill: SKILL.research,
        note: place.note,
      };
    }
  }
  return {
    action: "stop",
    reason: skip.size ? "nothing-unskipped" : "queue-clear",
    detail: skip.size
      ? "Every remaining unit is held, skipped, or already claimed in an open pull request."
      : "No open live or candidate unit. The hourly run should not open a pull request.",
  };
}

function workRow(place, stage, item, note) {
  return {
    place: place.slug,
    name: place.name,
    publish: place.publish,
    stage,
    item: item?.id || null,
    itemName: item?.name || "",
    skill: SKILL[stage],
    note: note || "",
  };
}

function nextForPlace(place) {
  const research = place.stages.research;
  if (research.status === "blocked") return null;
  if (!isDone(research.status)) return workRow(place, "research", null, research.note || place.note);
  if (!coverageDone(place)) {
    return workRow(place, "research", null, "Coverage buckets are still missing or partial. This is a depth pass.");
  }
  const unsourced = unitItems(place).filter((item) => !isDone(item.research) && item.research !== "blocked");
  if (unsourced.length) {
    return workRow(place, "research", null, `Not sourced yet: ${unsourced.map((item) => item.id).join(", ")}. Stay in research. Do not publish them.`);
  }
  for (const name of PLACE_STAGES.slice(1)) {
    const row = place.stages[name];
    if (row.status === "blocked") return null;
    if (!isDone(row.status)) return workRow(place, name, null, row.note || place.note);
  }
  for (const item of unitItems(place)) {
    if (["research", "page", "copy", "quality"].some((field) => item[field] === "blocked")) continue;
    for (const field of ITEM_FIELDS) {
      if (!isDone(item[field])) return workRow(place, field, item, item.note);
    }
  }
  return null;
}

function printWork(work) {
  if (work.action === "stop") {
    console.log(`action: stop`);
    console.log(`reason: ${work.reason}`);
    console.log(`detail: ${work.detail || ""}`);
    if (work.claim) {
      console.log(`claim.place: ${work.claim.place}`);
      console.log(`claim.stage: ${work.claim.stage}`);
      console.log(`claim.item: ${work.claim.item || ""}`);
      console.log(`claim.at: ${work.claim.at}`);
    }
    return;
  }
  console.log(`action: work`);
  console.log(`place: ${work.place}`);
  console.log(`name: ${work.name}`);
  console.log(`publish: ${work.publish}`);
  console.log(`stage: ${work.stage}`);
  console.log(`item: ${work.item || ""}`);
  console.log(`itemName: ${work.itemName || ""}`);
  console.log(`skill: ${work.skill}`);
  console.log(`note: ${work.note || ""}`);
  console.log(`releasedStaleClaim: ${work.releasedStaleClaim ? "yes" : "no"}`);
}

function sameUnit(claim, work) {
  return claim.place === work.place && claim.stage === work.stage && (claim.item || null) === (work.item || null);
}

function logPush(board, entry) {
  board.log = board.log || [];
  board.log.unshift({ at: nowIso(), ...entry });
  board.log = board.log.slice(0, 40);
}

function touchDownstream(place) {
  for (const name of ["destinationCopy", "destinationQuality", "foodCopy", "foodQuality"]) {
    const row = place.stages[name];
    if (row.status === "enriched" || row.status === "checked") row.status = "stale";
    if (name.endsWith("Quality") && row.status === "stale") row.note = "Dossier changed. Check again after the copy pass.";
    row.updated = nowIso();
  }
  for (const item of unitItems(place)) {
    if (item.copy === "enriched" || item.copy === "checked") item.copy = "stale";
    if (item.quality === "checked") item.quality = "not_started";
    item.updated = nowIso();
  }
}

function sectionFilled(text, heading) {
  const start = text.indexOf(heading);
  if (start < 0) return false;
  const rest = text.slice(start + heading.length);
  const next = rest.search(/\n## /);
  const body = next === -1 ? rest : rest.slice(0, next);
  return /### /.test(body) || /None recorded/.test(body);
}

function assertDossierDepth(slug) {
  const dir = path.join(researchRoot, slug);
  const statusFile = path.join(dir, "STATUS.md");
  if (!fs.existsSync(statusFile)) fail(`research/${slug}/STATUS.md is missing.`);
  const status = fs.readFileSync(statusFile, "utf8");
  if (!/^Status:\s*stored\s*$/m.test(status)) {
    fail(`research/${slug}/STATUS.md must say "Status: stored" before the board can store it.`);
  }
  const attractions = fs.readFileSync(path.join(dir, "attractions.md"), "utf8");
  const food = fs.readFileSync(path.join(dir, "food.md"), "utf8");
  for (const heading of ["## Nightlife and evening", "## Lifestyle"]) {
    if (!sectionFilled(attractions, heading)) {
      fail(`research/${slug}/attractions.md needs ${heading} with entries, or the line "None recorded".`);
    }
  }
  if (!sectionFilled(food, "## Food streets and markets")) {
    fail(`research/${slug}/food.md needs ## Food streets and markets with entries, or the line "None recorded".`);
  }
}

function assertResearchStored(place) {
  assertDossierDepth(place.slug);
  if (!coverageDone(place)) {
    const open = COVERAGE_BUCKETS.filter((key) => place.coverage[key] !== "filled" && place.coverage[key] !== "none");
    fail(`Research cannot be stored. Coverage still open: ${open.join(", ")}. Use --status needs_depth, or set each bucket to filled or none.`);
  }
  const openItems = place.items.filter((item) => !isDone(item.research) && item.research !== "blocked");
  if (openItems.length) {
    fail(`Research cannot be stored. These items are not sourced: ${openItems.map((item) => item.id).join(", ")}.`);
  }
}

function cmdInit() {
  if (fs.existsSync(boardPath) && !process.argv.includes("--force")) {
    fail("Board already exists. Refusing to overwrite it.");
  }
  const content = path.join(root, "src", "content");
  const places = [];
  for (const file of fs.readdirSync(path.join(content, "places")).filter((name) => name.endsWith(".json"))) {
    const json = readJson(path.join(content, "places", file));
    const place = placeShell({
      slug: json.slug,
      name: json.name,
      nameVi: json.nameVi,
      corridor: json.corridor,
      kind: json.kind,
      parent: json.parent || null,
      publish: "live",
      priority: PRIORITY[json.slug] ?? 60,
    });
    const researched = dossierStored(json.slug);
    if (json.slug === "da-nang") {
      place.stages.research = { status: "needs_depth", note: "Dossier is stored, but food streets, nightlife, and lifestyle are thin. Huynh Thuc Khang was named by the owner and is not in the dossier.", updated: nowIso(), reworkCount: 0 };
      place.stages.destination = { status: "paged", note: "City setup ran 19–20 Oct 2026.", updated: nowIso(), reworkCount: 0 };
      place.stages.destinationCopy = { status: "enriched", note: "Copy pass 20 Oct 2026. Goes stale when the depth pass changes the dossier.", updated: nowIso(), reworkCount: 0 };
      place.stages.food = { status: "paged", note: "Food guide exists. Depth research may add streets.", updated: nowIso(), reworkCount: 0 };
      place.stages.foodCopy = { status: "enriched", note: "Food copy pass 20 Oct 2026.", updated: nowIso(), reworkCount: 0 };
      place.coverage = {
        sights: "partial",
        areas: "partial",
        foodStreets: "missing",
        nightlife: "partial",
        lifestyle: "missing",
        events: "partial",
        sideTrips: "partial",
      };
    } else if (researched) {
      place.stages.research.status = "stored";
    }
    if (json.slug !== "da-nang") {
      place.stages.destination.status = "shell";
      place.stages.destination.note = "A place file exists. It has not been set up from a stored dossier.";
    }
    const foodFile = path.join(content, "food", `${json.slug}.json`);
    if (fs.existsSync(foodFile) && json.slug !== "da-nang") {
      place.stages.food.status = "shell";
      place.stages.food.note = "A food file exists. It has not been set up from a stored dossier.";
    }
    place.items = itemsForPlace(json, place);
    places.push(place);
  }
  for (const candidate of CANDIDATES) {
    if (places.some((place) => place.slug === candidate.slug)) continue;
    places.push(placeShell({ ...candidate, publish: "candidate" }));
  }
  const board = {
    version: 1,
    updated: nowIso(),
    control: {
      pause: false,
      pauseReason: "",
      claimStaleHours: 3,
      maxOpenContentPrs: 4,
      holdPlaces: [],
    },
    claim: null,
    log: [
      {
        at: nowIso(),
        place: "",
        stage: "init",
        item: null,
        status: "stored",
        note: "Board opened from the published JSON, the Da Nang dossier, and the Central Coast candidate list.",
      },
    ],
    places,
  };
  save(board);
  console.log(`Wrote ${places.length} places to ${path.relative(root, boardPath)}.`);
}

function dossierStored(slug) {
  const file = path.join(researchRoot, slug, "STATUS.md");
  if (!fs.existsSync(file)) return false;
  return /^Status:\s*stored\s*$/m.test(fs.readFileSync(file, "utf8"));
}

function itemsForPlace(json, place) {
  const content = path.join(root, "src", "content");
  const rows = [];
  const depth = place.slug === "da-nang";
  for (const file of fs.readdirSync(path.join(content, "attractions")).filter((name) => name.startsWith(`${json.slug}--`) && name.endsWith(".json"))) {
    const attraction = readJson(path.join(content, "attractions", file));
    rows.push(itemRow({
      id: `${json.slug}--${attraction.slug}`,
      kind: "sight",
      track: "unit",
      name: attraction.name,
      slug: attraction.slug,
      file: `src/content/attractions/${file}`,
      source: "published",
      research: depth ? "stored" : "not_started",
      page: depth ? "paged" : "shell",
      copy: depth ? "enriched" : "not_started",
      note: depth ? "Published. Copy passed once on 20 Oct 2026. Quality has not been run." : "Published shell. No dossier yet.",
    }));
  }
  for (const slug of json.dishSlugs || []) {
    const file = path.join(content, "dishes", `${slug}.json`);
    const dish = fs.existsSync(file) ? readJson(file) : null;
    rows.push(itemRow({
      id: `${json.slug}--dish--${slug}`,
      kind: "dish",
      track: "bundled",
      name: dish?.name || slug,
      slug,
      file: dish ? `src/content/dishes/${slug}.json` : null,
      source: dish ? "published" : "missing",
      research: depth ? "stored" : "not_started",
      page: dish ? (depth ? "paged" : "shell") : "not_started",
      copy: depth && dish ? "enriched" : "not_started",
      note: "Bundled into the food stage. A shared dish only gains sentences for this place.",
    }));
  }
  if (fs.existsSync(path.join(content, "festivals"))) {
    for (const file of fs.readdirSync(path.join(content, "festivals")).filter((name) => name.endsWith(".json"))) {
      const festival = readJson(path.join(content, "festivals", file));
      if (!(festival.placeSlugs || []).includes(json.slug)) continue;
      rows.push(itemRow({
        id: `${json.slug}--event--${festival.slug}`,
        kind: "event",
        track: "bundled",
        name: festival.name,
        slug: festival.slug,
        file: `src/content/festivals/${file}`,
        source: "published",
        research: depth ? "stored" : "not_started",
        page: depth ? "paged" : "shell",
        copy: depth ? "enriched" : "not_started",
        note: "Bundled into the destination stage.",
      }));
    }
  }
  if (json.slug === "da-nang") rows.push(...daNangExtras());
  if (json.slug === "hoi-an" && !rows.some((row) => row.slug === "white-rose")) {
    rows.push(itemRow({
      id: "hoi-an--dish--white-rose",
      kind: "dish",
      track: "bundled",
      name: "White rose dumpling",
      slug: "white-rose",
      source: "owner",
      note: "Named in Central Coast coverage on 19 Oct 2026. No dish file yet. Source it in the Hoi An dossier before the food stage publishes it.",
    }));
  }
  if (json.slug === "hue" && !rows.some((row) => row.slug === "com-hen")) {
    rows.push(itemRow({
      id: "hue--dish--com-hen",
      kind: "dish",
      track: "bundled",
      name: "Com hen",
      slug: "com-hen",
      source: "owner",
      note: "Named in Central Coast coverage on 19 Oct 2026. No dish file yet. Source it in the Hue dossier before the food stage publishes it.",
    }));
  }
  return rows;
}

function daNangExtras() {
  return [
    itemRow({
      id: "da-nang--han-river",
      kind: "area",
      track: "unit",
      name: "Han River",
      slug: "han-river",
      source: "dossier",
      research: "stored",
      page: "skipped",
      copy: "skipped",
      quality: "skipped",
      note: "Dossier: no separate page yet. Covered by the place and by Dragon Bridge.",
    }),
    itemRow({
      id: "da-nang--non-nuoc",
      kind: "area",
      track: "unit",
      name: "Non Nuoc stone-carving village",
      slug: "non-nuoc",
      source: "dossier",
      research: "stored",
      page: "skipped",
      copy: "skipped",
      quality: "skipped",
      note: "Dossier: a side note on the Marble Mountains page is enough until a later setup pass.",
    }),
    itemRow({
      id: "da-nang--son-tra-peninsula",
      kind: "area",
      track: "unit",
      name: "Son Tra peninsula",
      slug: "son-tra-peninsula",
      source: "dossier",
      research: "stored",
      page: "skipped",
      copy: "skipped",
      quality: "skipped",
      note: "Dossier: covered by the son-tra page, including Linh Ung.",
    }),
    itemRow({
      id: "da-nang--han-market",
      kind: "food-street",
      track: "unit",
      name: "Han Market and Con Market",
      slug: "han-market",
      source: "dossier",
      research: "stored",
      page: "skipped",
      copy: "skipped",
      quality: "skipped",
      note: "Dossier: no market page. The food guide carries them. A depth pass may reopen this.",
    }),
    itemRow({
      id: "da-nang--huynh-thuc-khang",
      kind: "food-street",
      track: "unit",
      name: "Huynh Thuc Khang local food alley",
      slug: "huynh-thuc-khang",
      source: "owner",
      research: "not_started",
      note: "Owner named this alley on 21 Oct 2026. It is not in the Da Nang dossier. Do not publish it until a primary source is stored. Record the area, not a restaurant list.",
    }),
  ];
}

function cmdNext(flags) {
  const board = load();
  const work = nextWork(board, skipSet(flags.skip));
  if (flags.json) console.log(JSON.stringify(work, null, 2));
  else printWork(work);
}

function cmdClaim(flags) {
  if (!flags.place || !flags.stage) fail("claim needs --place and --stage.");
  const board = load();
  const requested = { place: flags.place, stage: flags.stage, item: flags.item || null };
  if (board.claim && claimFresh(board) && sameUnit(board.claim, requested)) {
    console.log(`Already claimed ${requested.place} ${requested.stage} ${requested.item || ""}.`.trim());
    return;
  }
  const work = nextWork(board, skipSet(flags.skip));
  if (work.action !== "work") fail(`Nothing to claim (${work.reason}). ${work.detail || ""}`);
  if (requested.place !== work.place || requested.stage !== work.stage || (requested.item || null) !== (work.item || null)) {
    fail(`Refusing the claim. Next unit is ${work.place} ${work.stage} ${work.item || ""}.`.trim());
  }
  board.claim = {
    place: work.place,
    stage: work.stage,
    item: work.item,
    at: nowIso(),
    by: flags.by || "hourly",
    branch: flags.branch || "",
  };
  save(board);
  console.log(`Claimed ${work.place} ${work.stage} ${work.item || ""}.`.trim());
}

function cmdRelease() {
  const board = load();
  if (!board.claim) {
    console.log("No claim.");
    return;
  }
  logPush(board, {
    place: board.claim.place,
    stage: board.claim.stage,
    item: board.claim.item,
    status: "released",
    note: "Claim released without finishing the unit.",
  });
  board.claim = null;
  save(board);
  console.log("Released.");
}

const STATUSES = new Set(["not_started", "needs_depth", "stored", "shell", "paged", "enriched", "checked", "stale", "rework", "blocked", "skipped"]);

function cmdComplete(flags) {
  if (!flags.place || !flags.stage || !flags.status) fail("complete needs --place, --stage, and --status.");
  if (!STATUSES.has(flags.status)) fail(`Unknown status ${flags.status}.`);
  const board = load();
  const place = findPlace(board, flags.place);
  const itemId = flags.item || null;
  if (PLACE_STAGES.includes(flags.stage)) {
    if (itemId) fail("Place stages do not take --item. Use page, copy, or quality for an item.");
    if (flags.stage === "research" && flags.status === "stored") assertResearchStored(place);
    if (flags.stage === "research" && flags.status === "needs_depth" && !flags.note) {
      fail("needs_depth requires --note naming what is still open.");
    }
    place.stages[flags.stage].status = flags.status;
    place.stages[flags.stage].note = flags.note || place.stages[flags.stage].note;
    place.stages[flags.stage].updated = nowIso();
    if (flags.stage === "research") touchDownstream(place);
    if (flags.status === "rework") {
      place.stages[flags.stage].reworkCount += 1;
      const copyName = flags.stage.replace("Quality", "Copy");
      if (place.stages[copyName]) {
        place.stages[copyName].status = place.stages[flags.stage].reworkCount >= 2 ? "blocked" : "rework";
        place.stages[copyName].updated = nowIso();
      }
      if (place.stages[flags.stage].reworkCount >= 2) {
        place.stages[flags.stage].status = "blocked";
        place.questions.push({ at: nowIso(), stage: flags.stage, item: null, text: flags.note || "Quality failed twice.", open: true });
      }
    }
  } else if (ITEM_FIELDS.includes(flags.stage)) {
    if (!itemId) fail("Item stages need --item.");
    const item = findItem(place, itemId);
    if (flags.stage === "page" && !isDone(item.research)) {
      fail(`${item.id} is not sourced. Finish research before a page.`);
    }
    item[flags.stage] = flags.status;
    if (flags.note) item.note = flags.note;
    item.updated = nowIso();
    if (flags.status === "rework") {
      item.reworkCount += 1;
      item.copy = item.reworkCount >= 2 ? "blocked" : "rework";
      if (item.reworkCount >= 2) {
        item.quality = "blocked";
        place.questions.push({ at: nowIso(), stage: "quality", item: item.id, text: flags.note || "Quality failed twice.", open: true });
      }
    }
  } else {
    fail(`Unknown stage ${flags.stage}.`);
  }
  if (board.claim && sameUnit(board.claim, { place: place.slug, stage: flags.stage, item: itemId })) board.claim = null;
  logPush(board, { place: place.slug, stage: flags.stage, item: itemId, status: flags.status, note: flags.note || "" });
  save(board);
  console.log(`Updated ${place.slug} ${flags.stage} ${itemId || ""} -> ${flags.status}.`.trim());
}

function cmdSetItem(flags) {
  if (!flags.place || !flags.id) fail("set-item needs --place and --id.");
  const board = load();
  const place = findPlace(board, flags.place);
  const item = findItem(place, flags.id);
  for (const key of ["research", "page", "copy", "quality", "note", "file", "kind", "track"]) {
    if (flags[key]) item[key] = flags[key];
  }
  item.updated = nowIso();
  save(board);
  console.log(`Updated item ${item.id}.`);
}

function cmdAddItem(flags) {
  if (!flags.place || !flags.name || !flags.kind) fail("add-item needs --place, --name, and --kind.");
  const board = load();
  const place = findPlace(board, flags.place);
  const slug = flags.slug || slugify(flags.name);
  const id = flags.id || `${place.slug}--${slug}`;
  if (place.items.some((item) => item.id === id)) fail(`Item ${id} already exists.`);
  place.items.push(itemRow({
    id,
    kind: flags.kind,
    track: flags.track || "unit",
    name: flags.name,
    slug,
    file: flags.file || null,
    source: flags.source || "dossier",
    note: flags.note || "",
  }));
  if (place.stages.research.status === "stored") {
    place.stages.research.status = "needs_depth";
    place.stages.research.note = "A new item was added after the dossier was stored.";
    place.stages.research.updated = nowIso();
  }
  save(board);
  console.log(`Added ${id}.`);
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cmdCover(flags) {
  if (!flags.place || !flags.bucket || !flags.state) fail("cover needs --place, --bucket, and --state.");
  if (!COVERAGE_BUCKETS.includes(flags.bucket)) fail(`Bucket must be one of ${COVERAGE_BUCKETS.join(", ")}.`);
  if (!["missing", "partial", "filled", "none"].includes(flags.state)) fail("State must be missing, partial, filled, or none.");
  const board = load();
  const place = findPlace(board, flags.place);
  place.coverage[flags.bucket] = flags.state;
  if (flags.note) place.note = flags.note;
  save(board);
  console.log(`${place.slug} ${flags.bucket} = ${flags.state}.`);
}

function cmdBlock(flags) {
  if (!flags.place || !flags.stage || !flags.question) fail("block needs --place, --stage, and --question.");
  const board = load();
  const place = findPlace(board, flags.place);
  if (PLACE_STAGES.includes(flags.stage)) {
    place.stages[flags.stage].status = "blocked";
    place.stages[flags.stage].note = flags.question;
    place.stages[flags.stage].updated = nowIso();
  } else if (flags.item) {
    const item = findItem(place, flags.item);
    if (!["research", "page", "copy", "quality"].includes(flags.stage)) fail(`Unknown item stage ${flags.stage}.`);
    item[flags.stage] = "blocked";
    item.note = flags.question;
    item.updated = nowIso();
  } else fail("Unknown stage. Item blocks need --item.");
  place.questions.push({ at: nowIso(), stage: flags.stage, item: flags.item || null, text: flags.question, open: true });
  if (board.claim && board.claim.place === place.slug) board.claim = null;
  logPush(board, { place: place.slug, stage: flags.stage, item: flags.item || null, status: "blocked", note: flags.question });
  save(board);
  console.log("Blocked and recorded the question.");
}

function cmdReconcile() {
  const board = load();
  const content = path.join(root, "src", "content");
  let added = 0;
  for (const file of fs.readdirSync(path.join(content, "places")).filter((name) => name.endsWith(".json"))) {
    const json = readJson(path.join(content, "places", file));
    let place = board.places.find((row) => row.slug === json.slug);
    if (!place) {
      place = placeShell({
        slug: json.slug,
        name: json.name,
        nameVi: json.nameVi,
        corridor: json.corridor,
        kind: json.kind,
        parent: json.parent || null,
        publish: "live",
        priority: 70,
        note: "Added by reconcile from a place file that was not on the board.",
      });
      place.stages.destination.status = "shell";
      board.places.push(place);
      added++;
    }
    const known = new Set(place.items.map((item) => item.id));
    for (const row of itemsForPlace(json, place)) {
      if (known.has(row.id)) continue;
      if (place.slug === "da-nang" && row.source === "published") {
        row.research = "not_started";
        row.page = "shell";
        row.copy = "not_started";
        row.note = "File appeared after the board was opened. Confirm it against the dossier before treating the page as done.";
      }
      place.items.push(row);
      added++;
    }
  }
  save(board);
  console.log(added ? `Reconcile added ${added}.` : "Reconcile: board matches published files.");
}

function cmdValidate() {
  const board = load();
  const errors = [];
  if (board.version !== 1) errors.push("version must be 1");
  const slugs = new Set();
  for (const place of board.places) {
    if (slugs.has(place.slug)) errors.push(`duplicate place ${place.slug}`);
    slugs.add(place.slug);
    for (const bucket of COVERAGE_BUCKETS) {
      if (!["missing", "partial", "filled", "none"].includes(place.coverage?.[bucket])) {
        errors.push(`${place.slug} coverage.${bucket} is invalid`);
      }
    }
    const ids = new Set();
    for (const item of place.items) {
      if (ids.has(item.id)) errors.push(`duplicate item ${item.id}`);
      ids.add(item.id);
      if (item.page !== "not_started" && item.page !== "skipped" && item.page !== "shell" && item.file) {
        const full = path.join(root, item.file);
        if (!fs.existsSync(full)) errors.push(`${item.id} points at missing file ${item.file}`);
      }
    }
  }
  if (errors.length) fail(errors.join("\n"));
  console.log(`Valid. ${board.places.length} places.`);
}

function cmdGuard() {
  const files = changedFiles();
  const blocked = files.filter((file) => !ALLOWED_PATH.some((rule) => rule.test(file)));
  if (!blocked.length) {
    console.log(files.length ? "Guard: diff stays on content paths." : "Guard: no changed files.");
    return;
  }
  fail(`Guard: these paths are the owner's lane, or they are not content:\n${blocked.join("\n")}`);
}

function changedFiles() {
  const commands = [
    "git diff --name-only",
    "git diff --name-only --cached",
    "git diff --name-only origin/main...HEAD",
  ];
  const found = new Set();
  for (const command of commands) {
    try {
      const out = execSync(command, { cwd: root, encoding: "utf8" });
      for (const line of out.split("\n").map((s) => s.trim()).filter(Boolean)) found.add(line);
    } catch {
      // Missing origin/main or an empty repo still leaves the other diffs.
    }
  }
  return [...found];
}

function cmdReport(flags) {
  const board = load();
  const lines = [];
  const hold = paused(board);
  const reasons = [];
  if (hold) reasons.push(hold);
  if (board.claim && !claimFresh(board)) {
    reasons.push(`Claim for ${board.claim.place} ${board.claim.stage} is stale since ${board.claim.at}. The next hourly run may pick it up. Close a dead draft pull request for that place if one is still open.`);
  }
  if (board.claim && claimFresh(board)) {
    const age = claimAgeHours(board);
    if (age > 1.5) reasons.push(`Claim for ${board.claim.place} ${board.claim.stage} has been fresh for ${age.toFixed(1)} hours. If that run is dead, wait until it is stale or release it.`);
  }
  const questions = board.places.flatMap((place) => place.questions.filter((q) => q.open).map((q) => ({ place: place.slug, ...q })));
  const blocked = blockedUnits(board);
  const work = nextWork(board, new Set());
  lines.push("# Vietnam Guide daily board");
  lines.push("");
  lines.push(`Checked: ${nowIso()}`);
  lines.push(`Pause: ${hold ? "yes" : "no"}`);
  lines.push(`Recommendation: ${reasons.length ? "PAUSE" : "CONTINUE"}`);
  if (reasons.length) {
    lines.push("");
    lines.push("Pause reasons:");
    for (const reason of reasons) lines.push(`- ${reason}`);
  } else {
    lines.push("The hourly run can take the next unit. Pause it first if you are about to edit src/content or research yourself.");
  }
  lines.push("");
  lines.push("## Next unit");
  lines.push("");
  if (work.action === "work") lines.push(`${work.place} — ${work.stage}${work.item ? ` — ${work.item}` : ""}. Skill: ${work.skill}.`);
  else lines.push(`${work.reason}. ${work.detail || ""}`);
  lines.push("");
  lines.push("## Attention");
  lines.push("");
  if (!questions.length && !blocked.length) lines.push("No open questions and no blocked units.");
  for (const q of questions) lines.push(`- Question ${q.place} ${q.stage}: ${q.text}`);
  for (const row of blocked) lines.push(`- Blocked ${row}`);
  lines.push("");
  lines.push("## Places");
  lines.push("");
  for (const place of [...board.places].sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug))) {
    const units = unitItems(place);
    const open = units.filter((item) => ITEM_FIELDS.some((field) => !isDone(item[field])) || !isDone(item.research)).length;
    const buckets = COVERAGE_BUCKETS.filter((key) => place.coverage[key] !== "filled" && place.coverage[key] !== "none");
    lines.push(`- ${place.name} (${place.slug}, ${place.publish}, priority ${place.priority}): research ${place.stages.research.status}, destination ${place.stages.destination.status}/${place.stages.destinationCopy.status}/${place.stages.destinationQuality.status}, food ${place.stages.food.status}/${place.stages.foodCopy.status}/${place.stages.foodQuality.status}, unit items ${open} open of ${units.length}${buckets.length ? `, coverage open: ${buckets.join(", ")}` : ""}`);
  }
  lines.push("");
  lines.push("## Recent log");
  lines.push("");
  for (const entry of (board.log || []).slice(0, 8)) {
    lines.push(`- ${entry.at} ${entry.place} ${entry.stage} ${entry.status} ${entry.note || ""}`.trim());
  }
  lines.push("");
  lines.push("## Owner lane");
  lines.push("");
  lines.push("- Page templates, layout, and styles stay in src/pages, src/layouts, src/components, and src/styles.");
  lines.push("- Affiliates stay in src/lib/partners.ts. Content runs do not add a booking widget.");
  lines.push("- To pause everything, create ops/PAUSE or set control.pause to true on main.");
  lines.push("- To keep one destination while you edit it, add its slug to control.holdPlaces.");
  lines.push("- A candidate place gets no public file until you set publish to accepted.");
  lines.push("- Merge a content pull request only when its board claim is empty.");
  lines.push("- Count open pull requests whose titles start with content:. Pause the hourly run if that count is at or above control.maxOpenContentPrs.");
  const text = lines.join("\n");
  if (flags.write) {
    const dir = path.join(root, "ops", "reports");
    fs.mkdirSync(dir, { recursive: true });
    const stamp = nowIso().slice(0, 10);
    fs.writeFileSync(path.join(dir, `${stamp}.md`), `${text}\n`);
    console.log(`Wrote ops/reports/${stamp}.md`);
  }
  if (flags.json) console.log(JSON.stringify({ recommendation: reasons.length ? "PAUSE" : "CONTINUE", reasons, work, questions, blocked }, null, 2));
  else console.log(text);
}

function blockedUnits(board) {
  const rows = [];
  for (const place of board.places) {
    for (const name of PLACE_STAGES) {
      if (place.stages[name].status === "blocked") rows.push(`${place.slug} ${name}`);
    }
    for (const item of place.items) {
      for (const field of ["research", ...ITEM_FIELDS]) {
        if (item[field] === "blocked") rows.push(`${item.id} ${field}`);
      }
    }
  }
  return rows;
}

function runSelfCheck() {
  const dir = fs.mkdtempSync(path.join("/tmp", "board-"));
  const file = path.join(dir, "board.json");
  const pause = path.join(dir, "PAUSE");
  const script = path.join(root, "scripts", "board.mjs");
  const place = placeShell({ slug: "sample", name: "Sample", publish: "live", priority: 1 });
  place.stages.research.status = "needs_depth";
  place.stages.destination.status = "paged";
  place.stages.destinationCopy.status = "enriched";
  place.stages.food.status = "paged";
  place.stages.foodCopy.status = "enriched";
  place.items.push(itemRow({
    id: "sample--huynh-thuc-khang",
    kind: "food-street",
    name: "Huynh Thuc Khang",
    slug: "huynh-thuc-khang",
    source: "owner",
  }));
  writeJson(file, {
    version: 1,
    updated: nowIso(),
    control: { pause: false, pauseReason: "", claimStaleHours: 3, maxOpenContentPrs: 4, holdPlaces: ["hue"] },
    claim: null,
    log: [],
    places: [place, placeShell({ slug: "hue", name: "Hue", publish: "live", priority: 2 })],
  });
  const dossier = path.join(dir, "sample");
  fs.mkdirSync(dossier, { recursive: true });
  fs.writeFileSync(path.join(dossier, "STATUS.md"), "Status: stored\n");
  fs.writeFileSync(path.join(dossier, "attractions.md"), "## Nightlife and evening\n\nNone recorded\n\n## Lifestyle\n\n### Walk\n- Note: test\n");
  fs.writeFileSync(path.join(dossier, "food.md"), "## Food streets and markets\n\n### Market\n- Note: test\n");
  const env = { ...process.env, BOARD_PATH: file, PAUSE_PATH: pause, RESEARCH_ROOT: dir };
  const run = (extra) => execSync(`node ${script} ${extra}`, { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const first = run("next");
  if (!first.includes("stage: research") || !first.includes("place: sample")) fail(`self-check next:\n${first}`);
  run("claim --place sample --stage research");
  const again = run("claim --place sample --stage research");
  if (!again.includes("Already claimed")) fail(`self-check reclaim:\n${again}`);
  const busy = run("next");
  if (!busy.includes("reason: claimed")) fail(`self-check claim:\n${busy}`);
  let stored = "";
  try {
    stored = run("complete --place sample --stage research --status stored");
  } catch (error) {
    stored = `${error.stdout || ""}\n${error.stderr || ""}`;
  }
  if (!stored.includes("cannot be stored")) fail(`self-check stored gate:\n${stored}`);
  for (const bucket of COVERAGE_BUCKETS) run(`cover --place sample --bucket ${bucket} --state filled`);
  run("set-item --place sample --id sample--huynh-thuc-khang --research stored");
  run("complete --place sample --stage research --status stored --note sourced");
  const after = readJson(file);
  if (after.places[0].stages.destinationCopy.status !== "stale") fail("copy should go stale after research");
  if (after.claim !== null) fail("complete should clear the claim");
  fs.writeFileSync(pause, "pause\n");
  const stopped = run("next");
  if (!stopped.includes("reason: paused")) fail(`self-check pause:\n${stopped}`);
  fs.rmSync(pause);
  const skipped = run("next --skip sample");
  if (!skipped.includes("action: stop")) fail(`self-check skip:\n${skipped}`);
  if (ALLOWED_PATH.some((rule) => rule.test("src/lib/partners.ts"))) fail("partners.ts must be guarded");
  if (!ALLOWED_PATH.some((rule) => rule.test("src/content/places/hue.json"))) fail("place json must be allowed");
  if (ALLOWED_PATH.some((rule) => rule.test("src/components/PlaceView.astro"))) fail("components must be guarded");
  console.log("self-check ok");
}

const argv = args(process.argv.slice(2));
const command = argv._[0];

if (command === "self-check") runSelfCheck();
else if (command === "init") cmdInit();
else if (command === "next") cmdNext(argv);
else if (command === "claim") cmdClaim(argv);
else if (command === "release") cmdRelease();
else if (command === "complete") cmdComplete(argv);
else if (command === "set-item") cmdSetItem(argv);
else if (command === "add-item") cmdAddItem(argv);
else if (command === "cover") cmdCover(argv);
else if (command === "block") cmdBlock(argv);
else if (command === "reconcile") cmdReconcile();
else if (command === "validate") cmdValidate();
else if (command === "guard") cmdGuard();
else if (command === "report") cmdReport(argv);
else {
  fail(`Usage: node scripts/board.mjs <init|next|claim|release|complete|set-item|add-item|cover|block|reconcile|validate|guard|report|self-check>`);
}
