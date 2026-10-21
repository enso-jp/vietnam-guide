#!/usr/bin/env node
/**
 * Shared status for Vietnam Guide content runs.
 * ops/board/control.json and ops/board/places/<slug>.json are the database.
 * This script is the only writer hourly runs should use. It does not edit public pages.
 * A claim locks one place. Other places can be claimed at the same time.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const boardPath = process.env.BOARD_PATH || path.join(root, "ops", "board.json");
const boardDir = process.env.BOARD_DIR || path.join(root, "ops", "board");
const pausePath = process.env.PAUSE_PATH || path.join(root, "ops", "PAUSE");
const researchRoot = process.env.RESEARCH_ROOT || path.join(root, "research");

const RESEARCH_LANES = [
  {
    stage: "researchBase",
    short: "base",
    buckets: [],
    kinds: [],
    focus: "Why a night here, where they sleep, where the evening is, and getting there. No sight catalog yet.",
  },
  {
    stage: "researchAttractions",
    short: "attractions",
    buckets: ["sights", "areas"],
    kinds: ["sight", "area", "zone", "hub", "district"],
    focus: "Sights, areas, zones, and hubs a planning trip needs. Add each one to the board.",
  },
  {
    stage: "researchFood",
    short: "food",
    buckets: ["foodStreets"],
    kinds: ["dish", "food-street"],
    focus: "Dishes, markets, and food streets. File restaurant names under the street as do not publish as a pick, unless one is already a scene landmark.",
  },
  {
    stage: "researchNightlife",
    short: "nightlife",
    buckets: ["nightlife"],
    kinds: ["nightlife"],
    focus: "The areas people walk after dark, plus a few sourced scene landmarks. Not a ranked bar guide.",
  },
  {
    stage: "researchLifestyle",
    short: "lifestyle",
    buckets: ["lifestyle"],
    kinds: ["lifestyle"],
    focus: "The ordinary day: breakfast area, the swim or the walk, cafe streets, and the hour the city goes quiet.",
  },
  {
    stage: "researchContext",
    short: "context",
    buckets: ["events", "sideTrips"],
    kinds: ["event"],
    focus: "Recurring events and side trips from this base.",
  },
];

const PAGE_STAGES = [
  "destination",
  "destinationCopy",
  "destinationQuality",
  "food",
  "foodCopy",
  "foodQuality",
];

const PLACE_STAGES = [...RESEARCH_LANES.map((lane) => lane.stage), ...PAGE_STAGES];

const DA_NANG_LANES = {
  researchBase: { status: "stored", note: "Why a night here and getting there are in the dossier from 20 Oct 2026." },
  researchAttractions: { status: "needs_depth", note: "Major sights are in. Areas beyond An Thuong are still thin." },
  researchFood: { status: "not_started", note: "Dishes exist. Food streets do not. Huynh Thuc Khang has no source." },
  researchNightlife: { status: "needs_depth", note: "An Thuong, Kalà Kalà, and East West are pins. The night is not mapped as areas." },
  researchLifestyle: { status: "not_started", note: "No ordinary-day layer yet: breakfast, the swim, cafe streets, the quiet hour." },
  researchContext: { status: "needs_depth", note: "Fireworks and a few side trips are in. Both lists are partial." },
};

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
  researchBase: "destination-research",
  researchAttractions: "destination-research",
  researchFood: "destination-research",
  researchNightlife: "destination-research",
  researchLifestyle: "destination-research",
  researchContext: "destination-research",
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
  /^ops\/board\/control\.json$/,
  /^ops\/board\/places\/[a-z0-9-]+\.json$/,
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

function directoryMode() {
  return !process.env.BOARD_PATH && fs.existsSync(path.join(boardDir, "control.json"));
}

function placeFile(slug) {
  return path.join(boardDir, "places", `${slug}.json`);
}

function load() {
  if (process.env.BOARD_PATH) {
    if (!fs.existsSync(boardPath)) fail(`No board at ${boardPath}.`);
    return normalize(readJson(boardPath));
  }
  if (directoryMode()) {
    const control = readJson(path.join(boardDir, "control.json"));
    const placeDir = path.join(boardDir, "places");
    const places = fs.readdirSync(placeDir).filter((name) => name.endsWith(".json")).map((name) => readJson(path.join(placeDir, name)));
    return normalize({
      version: control.version || 2,
      updated: control.updated,
      control,
      claim: null,
      log: control.log || [],
      places,
    });
  }
  if (!fs.existsSync(boardPath)) {
    fail(`No board at ${path.relative(root, boardPath)}. Run: node scripts/board.mjs init`);
  }
  return normalize(readJson(boardPath));
}

function normalize(board) {
  board.control = board.control || {};
  if (board.control.parallelUnits == null) board.control.parallelUnits = 4;
  board.log = board.log || [];
  for (const place of board.places || []) {
    place.claim = place.claim || null;
    place.log = place.log || [];
    place.questions = place.questions || [];
  }
  if (board.claim?.place) {
    const place = board.places.find((row) => row.slug === board.claim.place);
    if (place && !place.claim) place.claim = board.claim;
    board.claim = null;
  }
  return board;
}

function save(board, scope) {
  board.updated = nowIso();
  if (process.env.BOARD_PATH) {
    writeJson(process.env.BOARD_PATH, board);
    return;
  }
  if (!directoryMode() && !scope?.forceDirectory) {
    writeJson(boardPath, board);
    return;
  }
  const slugs = scope?.places;
  if (!slugs) {
    writeJson(path.join(boardDir, "control.json"), {
      version: board.version || 2,
      updated: board.updated,
      pause: board.control.pause,
      pauseReason: board.control.pauseReason || "",
      claimStaleHours: board.control.claimStaleHours ?? 3,
      maxOpenContentPrs: board.control.maxOpenContentPrs ?? 4,
      parallelUnits: board.control.parallelUnits ?? 4,
      holdPlaces: board.control.holdPlaces || [],
      log: board.log || [],
    });
    for (const place of board.places) writeJson(placeFile(place.slug), place);
    if (fs.existsSync(boardPath)) fs.rmSync(boardPath);
    return;
  }
  for (const slug of slugs) writeJson(placeFile(slug), findPlace(board, slug));
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
    stages: Object.fromEntries(PLACE_STAGES.map((name) => [name, stage()])),
    items: fields.items || [],
    questions: [],
    claim: null,
    log: [],
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

function claimAgeHours(claim) {
  if (!claim?.at) return null;
  return (Date.now() - Date.parse(claim.at)) / 36e5;
}

function claimFresh(claim, board) {
  const age = claimAgeHours(claim);
  if (age == null || Number.isNaN(age)) return false;
  return age < (board.control.claimStaleHours ?? 3);
}

function freshClaims(board) {
  return board.places.filter((place) => claimFresh(place.claim, board)).map((place) => place.claim);
}

function skipSet(flag) {
  if (!flag || flag === true) return new Set();
  return new Set(String(flag).split(",").map((s) => s.trim()).filter(Boolean));
}

function held(board, slug, skip) {
  if (skip.has(slug)) return true;
  return (board.control.holdPlaces || []).includes(slug);
}

function nextWork(board, skip, limit = 1) {
  const hold = paused(board);
  if (hold) return { action: "stop", reason: "paused", detail: hold, units: [] };
  const cap = Math.max(1, Number(limit) || 1);
  const ranked = [...board.places].sort((a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug));
  const units = [];
  for (const publish of ["live", "accepted", "candidate"]) {
    for (const place of ranked) {
      if (units.length >= cap) break;
      if (place.publish !== publish) continue;
      if (held(board, place.slug, skip)) continue;
      if (claimFresh(place.claim, board)) continue;
      const unit = nextForPlace(place);
      if (!unit) continue;
      if (place.publish === "candidate" && !String(unit.stage).startsWith("research")) continue;
      units.push(unit);
    }
  }
  if (!units.length) {
    return {
      action: "stop",
      reason: skip.size ? "nothing-unskipped" : "queue-clear",
      detail: skip.size
        ? "Every remaining unit is held, skipped, or already claimed in an open pull request."
        : "No open live or candidate unit. The dispatcher should not open a pull request.",
      units: [],
    };
  }
  return { action: "work", units };
}

function workRow(place, stage, item, note) {
  const lane = RESEARCH_LANES.find((row) => row.stage === stage);
  return {
    place: place.slug,
    name: place.name,
    publish: place.publish,
    stage,
    item: item?.id || null,
    itemName: item?.name || "",
    skill: SKILL[stage] || "content-board",
    focus: lane?.focus || "",
    note: note || lane?.focus || "",
  };
}

function laneByStage(stage) {
  return RESEARCH_LANES.find((lane) => lane.stage === stage);
}

function laneForKind(kind) {
  return RESEARCH_LANES.find((lane) => lane.kinds.includes(kind)) || null;
}

function laneForBucket(bucket) {
  return RESEARCH_LANES.find((lane) => lane.buckets.includes(bucket)) || null;
}

function bucketOpen(place, bucket) {
  return place.coverage[bucket] !== "filled" && place.coverage[bucket] !== "none";
}

function laneSeverity(place, lane) {
  const status = place.stages[lane.stage]?.status || "not_started";
  if (status === "blocked") return "blocked";
  const bucketsOpen = lane.buckets.some((bucket) => bucketOpen(place, bucket));
  const unsourced = place.items.some((item) => lane.kinds.includes(item.kind) && !isDone(item.research) && item.research !== "blocked");
  if (isDone(status) && !bucketsOpen && !unsourced) return "done";
  const missing = lane.buckets.some((bucket) => place.coverage[bucket] === "missing");
  if (status === "not_started" || missing) return 0;
  return 1;
}

function nextResearchLane(place, skipStages = new Set()) {
  const ranked = RESEARCH_LANES.map((lane) => ({ lane, severity: laneSeverity(place, lane) })).filter((row) => row.severity !== "done" && row.severity !== "blocked" && !skipStages.has(row.lane.stage));
  if (!ranked.length) return null;
  ranked.sort((a, b) => a.severity - b.severity || RESEARCH_LANES.indexOf(a.lane) - RESEARCH_LANES.indexOf(b.lane));
  const lane = ranked[0].lane;
  const row = place.stages[lane.stage];
  return workRow(place, lane.stage, null, row?.note || lane.focus);
}

function researchSettled(place) {
  return RESEARCH_LANES.every((lane) => laneSeverity(place, lane) === "done" || laneSeverity(place, lane) === "blocked");
}

function unitKey(stage, itemId) {
  return itemId ? `${stage}:${itemId}` : stage;
}

function nextForPlace(place, skipStages = new Set()) {
  const lane = nextResearchLane(place, skipStages);
  if (lane) return lane;
  if (!researchSettled(place) || place.publish === "candidate") return null;
  for (const name of PAGE_STAGES) {
    if (skipStages.has(name)) continue;
    const row = place.stages[name];
    if (row.status === "blocked") return null;
    if (!isDone(row.status)) return workRow(place, name, null, row.note || place.note);
  }
  for (const item of unitItems(place)) {
    if (["research", "page", "copy", "quality"].some((field) => item[field] === "blocked")) continue;
    for (const field of ITEM_FIELDS) {
      if (skipStages.has(unitKey(field, item.id))) continue;
      if (!isDone(item[field])) return workRow(place, field, item, item.note);
    }
  }
  return null;
}

function printUnit(work) {
  console.log(`action: work`);
  console.log(`place: ${work.place}`);
  console.log(`name: ${work.name}`);
  console.log(`publish: ${work.publish}`);
  console.log(`stage: ${work.stage}`);
  console.log(`item: ${work.item || ""}`);
  console.log(`itemName: ${work.itemName || ""}`);
  console.log(`skill: ${work.skill}`);
  console.log(`focus: ${work.focus || ""}`);
  console.log(`note: ${work.note || ""}`);
}

function printWork(result) {
  if (result.action === "stop") {
    console.log(`action: stop`);
    console.log(`reason: ${result.reason}`);
    console.log(`detail: ${result.detail || ""}`);
    return;
  }
  console.log(`count: ${result.units.length}`);
  for (const unit of result.units) {
    console.log("---");
    printUnit(unit);
  }
}

function sameUnit(claim, work) {
  return claim.place === work.place && claim.stage === work.stage && (claim.item || null) === (work.item || null);
}

function logPush(board, entry) {
  const line = { at: nowIso(), ...entry };
  if (entry.place) {
    const place = board.places.find((row) => row.slug === entry.place);
    if (place) {
      place.log = [line, ...(place.log || [])].slice(0, 20);
      return;
    }
  }
  board.log = [line, ...(board.log || [])].slice(0, 40);
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

function readResearch(slug, file) {
  const full = path.join(researchRoot, slug, file);
  if (!fs.existsSync(full)) fail(`research/${slug}/${file} is missing.`);
  return fs.readFileSync(full, "utf8");
}

function fileFilled(text) {
  return /### /.test(text) || /None recorded/.test(text);
}

function assertLaneStored(place, lane) {
  if (lane.stage === "researchBase") {
    const scene = readResearch(place.slug, "attractions.md");
    if (!sectionFilled(scene, "## Why a night here")) {
      fail(`research/${place.slug}/attractions.md needs ## Why a night here with the scene filled in.`);
    }
    const gettingThere = readResearch(place.slug, "getting-there.md");
    if (!fileFilled(gettingThere) && gettingThere.trim().length < 40) {
      fail(`research/${place.slug}/getting-there.md is empty.`);
    }
    return;
  }
  const headings = {
    researchFood: [["food.md", "## Food streets and markets"]],
    researchNightlife: [["attractions.md", "## Nightlife and evening"]],
    researchLifestyle: [["attractions.md", "## Lifestyle"]],
  };
  for (const [file, heading] of headings[lane.stage] || []) {
    if (!sectionFilled(readResearch(place.slug, file), heading)) {
      fail(`research/${place.slug}/${file} needs ${heading} with entries, or the line "None recorded".`);
    }
  }
  if (lane.stage === "researchContext") {
    if (!fileFilled(readResearch(place.slug, "events.md"))) fail(`research/${place.slug}/events.md needs entries, or "None recorded".`);
    if (!fileFilled(readResearch(place.slug, "side-trips.md"))) fail(`research/${place.slug}/side-trips.md needs entries, or "None recorded".`);
  }
  if (lane.stage === "researchAttractions") {
    const text = readResearch(place.slug, "attractions.md");
    if (!/### /.test(text)) fail(`research/${place.slug}/attractions.md needs sight entries.`);
  }
  const openBuckets = lane.buckets.filter((bucket) => bucketOpen(place, bucket));
  if (openBuckets.length) {
    fail(`${lane.stage} cannot be stored. Coverage still open: ${openBuckets.join(", ")}. Use --status needs_depth, or set each bucket to filled or none.`);
  }
  const unsourced = place.items.filter((item) => lane.kinds.includes(item.kind) && !isDone(item.research) && item.research !== "blocked");
  if (unsourced.length) {
    fail(`${lane.stage} cannot be stored. These items are not sourced: ${unsourced.map((item) => item.id).join(", ")}.`);
  }
}

function lastOpenLane(place, stage) {
  return RESEARCH_LANES.every((lane) => lane.stage === stage || isDone(place.stages[lane.stage]?.status) || place.stages[lane.stage]?.status === "blocked");
}

function cmdInit() {
  if ((directoryMode() || fs.existsSync(boardPath)) && !process.argv.includes("--force")) {
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
    if (json.slug === "da-nang") {
      for (const [name, preset] of Object.entries(DA_NANG_LANES)) {
        place.stages[name] = { ...stage(), ...preset, updated: nowIso() };
      }
      place.stages.destination = { status: "paged", note: "City setup ran 19–20 Oct 2026.", updated: nowIso(), reworkCount: 0 };
      place.stages.destinationCopy = { status: "enriched", note: "Copy pass 20 Oct 2026. Goes stale when a research lane changes the dossier.", updated: nowIso(), reworkCount: 0 };
      place.stages.food = { status: "paged", note: "Food guide exists. The food research lane may add streets.", updated: nowIso(), reworkCount: 0 };
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
    } else if (dossierStored(json.slug)) {
      for (const lane of RESEARCH_LANES) {
        place.stages[lane.stage].status = "stored";
      }
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
    version: 2,
    updated: nowIso(),
    control: {
      pause: false,
      pauseReason: "",
      claimStaleHours: 3,
      maxOpenContentPrs: 4,
      parallelUnits: 4,
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
  save(board, process.env.BOARD_PATH ? undefined : { forceDirectory: true });
  const where = process.env.BOARD_PATH ? path.relative(root, boardPath) : "ops/board/";
  console.log(`Wrote ${places.length} places to ${where}.`);
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

function stageSkip(flag) {
  if (!flag || flag === true) return new Set();
  return new Set(String(flag).split(",").map((s) => s.trim()).filter(Boolean));
}

function cmdNext(flags) {
  const board = load();
  if (flags.place) {
    const place = findPlace(board, flags.place);
    const unit = held(board, place.slug, skipSet(flags.skip)) ? null : nextForPlace(place, stageSkip(flags["skip-stage"]));
    const work = unit
      ? { action: "work", units: [unit] }
      : {
          action: "stop",
          reason: "place-clear",
          detail: `No remaining unit on ${place.slug} for this pass.`,
          units: [],
        };
    if (flags.json) console.log(JSON.stringify(work, null, 2));
    else printWork(work);
    return;
  }
  const work = nextWork(board, skipSet(flags.skip), flags.limit || board.control.parallelUnits || 4);
  if (flags.json) console.log(JSON.stringify(work, null, 2));
  else printWork(work);
}

function cmdClaim(flags) {
  if (!flags.place || !flags.stage) fail("claim needs --place and --stage.");
  const board = load();
  const place = findPlace(board, flags.place);
  const requested = { place: flags.place, stage: flags.stage, item: flags.item || null };
  if (claimFresh(place.claim, board) && sameUnit(place.claim, requested)) {
    console.log(`Already claimed ${requested.place} ${requested.stage} ${requested.item || ""}.`.trim());
    return;
  }
  if (claimFresh(place.claim, board)) {
    fail(`Refusing the claim. ${place.slug} is already claimed for ${place.claim.stage}.`);
  }
  const work = nextForPlace(place);
  if (!work) fail(`Nothing to claim on ${place.slug}.`);
  if (requested.stage !== work.stage || (requested.item || null) !== (work.item || null)) {
    fail(`Refusing the claim. Next unit for ${place.slug} is ${work.stage} ${work.item || ""}.`.trim());
  }
  place.claim = {
    place: work.place,
    stage: work.stage,
    item: work.item,
    at: nowIso(),
    by: flags.by || "hourly",
    branch: flags.branch || "",
  };
  save(board, { places: [place.slug] });
  console.log(`Claimed ${work.place} ${work.stage} ${work.item || ""}.`.trim());
}

function cmdRelease(flags) {
  const board = load();
  if (!flags.place) fail("release needs --place.");
  const place = findPlace(board, flags.place);
  if (!place.claim) {
    console.log("No claim.");
    return;
  }
  logPush(board, {
    place: place.slug,
    stage: place.claim.stage,
    item: place.claim.item,
    status: "released",
    note: "Claim released without finishing the unit.",
  });
  place.claim = null;
  save(board, { places: [place.slug] });
  console.log("Released.");
}

const STATUSES = new Set(["not_started", "needs_depth", "stored", "shell", "paged", "enriched", "checked", "stale", "rework", "blocked", "skipped"]);

function cmdComplete(flags) {
  if (!flags.place || !flags.stage || !flags.status) fail("complete needs --place, --stage, and --status.");
  if (!STATUSES.has(flags.status)) fail(`Unknown status ${flags.status}.`);
  const board = load();
  const place = findPlace(board, flags.place);
  const itemId = flags.item || null;
  if (flags.stage === "research") {
    fail(`Research is split into lanes: ${RESEARCH_LANES.map((lane) => lane.stage).join(", ")}.`);
  }
  if (PLACE_STAGES.includes(flags.stage)) {
    if (itemId) fail("Place stages do not take --item. Use page, copy, or quality for an item.");
    const lane = laneByStage(flags.stage);
    if (lane && flags.status === "stored" && place.stages[flags.stage].status === "not_started") {
      fail(`${flags.stage} is still not_started. The first pass must end --status needs_depth, with coverage left partial or missing. A later pass may store it.`);
    }
    if (lane && flags.status === "stored" && !/left out/i.test(flags.note || "")) {
      fail(`${flags.stage} cannot be stored without --note saying what was left out.`);
    }
    if (lane && flags.status === "stored") {
      assertLaneStored(place, lane);
      if (lastOpenLane(place, flags.stage)) {
        const statusFile = path.join(researchRoot, place.slug, "STATUS.md");
        const status = fs.existsSync(statusFile) ? fs.readFileSync(statusFile, "utf8") : "";
        if (!/^Status:\s*stored\s*$/m.test(status)) {
          fail(`This is the last research lane. Set research/${place.slug}/STATUS.md to "Status: stored" first.`);
        }
      }
    }
    if (lane && flags.status === "needs_depth" && !flags.note) {
      fail("needs_depth requires --note naming what is still open.");
    }
    place.stages[flags.stage].status = flags.status;
    place.stages[flags.stage].note = flags.note || place.stages[flags.stage].note;
    place.stages[flags.stage].updated = nowIso();
    if (lane) touchDownstream(place);
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
    if (flags.stage === "page" && flags.status === "skipped" && item.source === "owner") {
      fail(`${item.id} was named by the owner. Research must not set its page to skipped.`);
    }
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
  if (place.claim && sameUnit(place.claim, { place: place.slug, stage: flags.stage, item: itemId })) place.claim = null;
  logPush(board, { place: place.slug, stage: flags.stage, item: itemId, status: flags.status, note: flags.note || "" });
  save(board, { places: [place.slug] });
  console.log(`Updated ${place.slug} ${flags.stage} ${itemId || ""} -> ${flags.status}.`.trim());
}

function cmdSetItem(flags) {
  if (!flags.place || !flags.id) fail("set-item needs --place and --id.");
  const board = load();
  const place = findPlace(board, flags.place);
  const item = findItem(place, flags.id);
  if (flags.page === "skipped" && item.source === "owner") {
    fail(`${item.id} was named by the owner. Research must not set its page to skipped.`);
  }
  for (const key of ["research", "page", "copy", "quality", "note", "file", "kind", "track"]) {
    if (flags[key]) item[key] = flags[key];
  }
  item.updated = nowIso();
  save(board, { places: [place.slug] });
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
  const owner = laneForKind(flags.kind);
  if (owner && isDone(place.stages[owner.stage].status)) {
    place.stages[owner.stage].status = "needs_depth";
    place.stages[owner.stage].note = "A new item was added after this lane was stored.";
    place.stages[owner.stage].updated = nowIso();
  }
  save(board, { places: [place.slug] });
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
  const owner = laneForBucket(flags.bucket);
  if (flags.state === "filled" && owner && place.stages[owner.stage]?.status === "not_started") {
    fail(`${flags.bucket} cannot be filled while ${owner.stage} is not_started. The first pass leaves it partial or missing.`);
  }
  place.coverage[flags.bucket] = flags.state;
  if (flags.note) place.note = flags.note;
  save(board, { places: [place.slug] });
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
  place.claim = null;
  logPush(board, { place: place.slug, stage: flags.stage, item: flags.item || null, status: "blocked", note: flags.question });
  save(board, { places: [place.slug] });
  console.log("Blocked and recorded the question.");
}

function cmdReconcile(flags) {
  const board = load();
  const content = path.join(root, "src", "content");
  let added = 0;
  const touched = new Set();
  const files = fs.readdirSync(path.join(content, "places")).filter((name) => name.endsWith(".json"));
  const selected = flags.place ? files.filter((name) => name === `${flags.place}.json`) : files;
  if (flags.place && !selected.length) fail(`No published place file for ${flags.place}.`);
  for (const file of selected) {
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
      touched.add(place.slug);
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
      touched.add(place.slug);
      added++;
    }
  }
  if (added) save(board, { places: [...touched] });
  console.log(added ? `Reconcile added ${added}.` : "Reconcile: board matches published files.");
}

function cmdValidate() {
  const board = load();
  const errors = [];
  if (board.version !== 1 && board.version !== 2) errors.push("version must be 1 or 2");
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
  for (const place of board.places) {
    if (!place.claim) continue;
    const label = `${place.slug} ${place.claim.stage}`;
    if (!claimFresh(place.claim, board)) {
      reasons.push(`Claim for ${label} is stale since ${place.claim.at}. The next hourly run may pick that place up. Close a dead draft pull request for it if one is still open.`);
      continue;
    }
    const age = claimAgeHours(place.claim);
    if (age > 1.5) reasons.push(`Claim for ${label} has been fresh for ${age.toFixed(1)} hours. If that run is dead, wait until it is stale or release it.`);
  }
  const questions = board.places.flatMap((place) => place.questions.filter((q) => q.open).map((q) => ({ place: place.slug, ...q })));
  const blocked = blockedUnits(board);
  const work = nextWork(board, new Set(), board.control.parallelUnits || 4);
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
    lines.push("The hourly run can start several places at once. Pause it first if you are about to edit src/content or research yourself.");
  }
  const active = freshClaims(board);
  if (active.length) {
    lines.push("");
    lines.push("## In progress");
    lines.push("");
    for (const claim of active) lines.push(`- ${claim.place} — ${claim.stage}${claim.item ? ` — ${claim.item}` : ""} since ${claim.at}`);
  }
  lines.push("");
  lines.push("## Places that can start");
  lines.push("");
  if (work.action === "work") {
    for (const unit of work.units) lines.push(`- ${unit.place} — ${unit.stage}${unit.item ? ` — ${unit.item}` : ""}. Skill: ${unit.skill}.`);
  } else lines.push(`${work.reason}. ${work.detail || ""}`);
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
    const lanes = RESEARCH_LANES.map((lane) => `${lane.short} ${place.stages[lane.stage]?.status || "missing"}`).join(", ");
    lines.push(`- ${place.name} (${place.slug}, ${place.publish}, priority ${place.priority}): ${lanes}; destination ${place.stages.destination.status}/${place.stages.destinationCopy.status}/${place.stages.destinationQuality.status}; food ${place.stages.food.status}/${place.stages.foodCopy.status}/${place.stages.foodQuality.status}; unit items ${open} open of ${units.length}${buckets.length ? `; coverage open: ${buckets.join(", ")}` : ""}`);
  }
  lines.push("");
  lines.push("## Recent log");
  lines.push("");
  for (const entry of recentLog(board)) {
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
  lines.push("- Merge a content pull request only when that place's claim is null.");
  lines.push("- One hourly trigger starts up to control.parallelUnits places, and never more open content: pulls than control.maxOpenContentPrs.");
  lines.push("- A fresh claim locks that place only. Another place can run in the same hour.");
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

function recentLog(board) {
  const rows = [...(board.log || [])];
  for (const place of board.places) rows.push(...(place.log || []));
  rows.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  return rows.slice(0, 8);
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

function upgradePlace(place) {
  if (place.stages.researchBase && !place.stages.research) return false;
  const legacy = place.stages.research;
  if (place.slug === "da-nang") {
    for (const [name, preset] of Object.entries(DA_NANG_LANES)) {
      place.stages[name] = { ...stage(), ...preset, updated: nowIso() };
    }
  } else if (legacy?.status === "stored") {
    for (const lane of RESEARCH_LANES) place.stages[lane.stage] = { ...stage(), status: "stored", note: legacy.note || "", updated: nowIso() };
  } else if (legacy?.status === "blocked") {
    for (const lane of RESEARCH_LANES) place.stages[lane.stage] = { ...stage(), status: "blocked", note: legacy.note || "", updated: nowIso() };
  } else {
    for (const lane of RESEARCH_LANES) place.stages[lane.stage] = place.stages[lane.stage] || stage();
  }
  delete place.stages.research;
  return true;
}

function cmdUpgrade() {
  const board = load();
  let changed = 0;
  for (const place of board.places) {
    if (upgradePlace(place)) changed += 1;
  }
  board.version = 2;
  logPush(board, {
    place: "",
    stage: "upgrade",
    item: null,
    status: "stored",
    note: "Split research into base, attractions, food, nightlife, lifestyle, and context. A missing lane is done before a partial one.",
  });
  save(board);
  console.log(`Upgraded ${changed} places to research lanes.`);
}

function cmdSplit() {
  if (process.env.BOARD_PATH) fail("split refuses BOARD_PATH. Tests keep a single file.");
  if (directoryMode()) {
    console.log("Board is already one file per place.");
    return;
  }
  if (!fs.existsSync(boardPath)) fail("No ops/board.json to split.");
  const board = load();
  board.version = 2;
  save(board, { forceDirectory: true });
  console.log(`Split ${board.places.length} places into ops/board/.`);
}

function runSelfCheck() {
  const dir = fs.mkdtempSync(path.join("/tmp", "board-"));
  const file = path.join(dir, "board.json");
  const pause = path.join(dir, "PAUSE");
  const script = path.join(root, "scripts", "board.mjs");
  const place = placeShell({ slug: "sample", name: "Sample", publish: "live", priority: 1 });
  place.stages.researchBase = { ...stage(), status: "stored", note: "Scene is in." };
  place.stages.researchAttractions = { ...stage(), status: "needs_depth", note: "Sights are partial." };
  place.stages.researchFood = { ...stage(), status: "not_started", note: "Food streets are missing." };
  place.stages.researchNightlife = { ...stage(), status: "needs_depth", note: "Night is partial." };
  place.stages.researchLifestyle = { ...stage(), status: "not_started", note: "No ordinary day yet." };
  place.stages.researchContext = { ...stage(), status: "needs_depth", note: "Events are partial." };
  place.coverage = { sights: "partial", areas: "partial", foodStreets: "missing", nightlife: "partial", lifestyle: "missing", events: "partial", sideTrips: "partial" };
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
  const other = placeShell({ slug: "hoi-an", name: "Hoi An", publish: "live", priority: 3 });
  writeJson(file, {
    version: 2,
    updated: nowIso(),
    control: { pause: false, pauseReason: "", claimStaleHours: 3, maxOpenContentPrs: 4, parallelUnits: 4, holdPlaces: ["hue"] },
    claim: null,
    log: [],
    places: [place, placeShell({ slug: "hue", name: "Hue", publish: "live", priority: 2 }), other],
  });
  const dossier = path.join(dir, "sample");
  fs.mkdirSync(dossier, { recursive: true });
  fs.writeFileSync(path.join(dossier, "STATUS.md"), "Status: stored\n");
  fs.writeFileSync(path.join(dossier, "attractions.md"), "## Nightlife and evening\n\nNone recorded\n\n## Lifestyle\n\n### Walk\n- Note: test\n");
  fs.writeFileSync(path.join(dossier, "food.md"), "## Food streets and markets\n\n### Market\n- Note: test\n");
  const env = { ...process.env, BOARD_PATH: file, PAUSE_PATH: pause, RESEARCH_ROOT: dir };
  const run = (extra) => execSync(`node ${script} ${extra}`, { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const first = run("next --limit 2");
  if (!first.includes("stage: researchFood") || !first.includes("place: sample") || !first.includes("place: hoi-an")) {
    fail(`self-check next:\n${first}`);
  }
  const owned = run("next --place sample");
  if (!owned.includes("stage: researchFood") || owned.includes("place: hoi-an")) fail(`self-check place next:\n${owned}`);
  const later = run("next --place sample --skip-stage researchFood");
  if (!later.includes("stage: researchLifestyle")) fail(`self-check skip-stage:\n${later}`);
  run("claim --place sample --stage researchFood");
  const again = run("claim --place sample --stage researchFood");
  if (!again.includes("Already claimed")) fail(`self-check reclaim:\n${again}`);
  const busy = run("next --limit 2");
  if (!busy.includes("place: hoi-an") || busy.includes("place: sample")) fail(`self-check claim hid the other place:\n${busy}`);
  run("claim --place hoi-an --stage researchBase");
  let stored = "";
  try {
    stored = run("complete --place sample --stage researchFood --status stored --note left out the night market");
  } catch (error) {
    stored = `${error.stdout || ""}\n${error.stderr || ""}`;
  }
  if (!stored.includes("first pass")) fail(`self-check stored gate:\n${stored}`);
  let filled = "";
  try {
    filled = run("cover --place sample --bucket foodStreets --state filled");
  } catch (error) {
    filled = `${error.stderr || ""}\n${error.stdout || ""}`;
  }
  if (!filled.includes("cannot be filled")) fail(`self-check filled gate:\n${filled}`);
  let skippedPage = "";
  try {
    skippedPage = run("set-item --place sample --id sample--huynh-thuc-khang --page skipped");
  } catch (error) {
    skippedPage = `${error.stderr || ""}\n${error.stdout || ""}`;
  }
  if (!skippedPage.includes("must not set its page to skipped")) fail(`self-check owner page:\n${skippedPage}`);
  run("complete --place sample --stage researchFood --status needs_depth --note streets are still thin");
  run("cover --place sample --bucket foodStreets --state filled");
  run("set-item --place sample --id sample--huynh-thuc-khang --research stored");
  let bare = "";
  try {
    bare = run("complete --place sample --stage researchFood --status stored --note sourced");
  } catch (error) {
    bare = `${error.stderr || ""}\n${error.stdout || ""}`;
  }
  if (!bare.includes("left out")) fail(`self-check left-out gate:\n${bare}`);
  run('complete --place sample --stage researchFood --status stored --note "left out shops that are not landmarks"');
  const after = readJson(file);
  const sample = after.places.find((row) => row.slug === "sample");
  if (sample.stages.destinationCopy.status !== "stale") fail("copy should go stale after research");
  if (sample.claim !== null) fail("complete should clear the place claim");
  if (after.places.find((row) => row.slug === "hoi-an").claim?.stage !== "researchBase") fail("hoi-an claim should stay");
  const follow = run("next --limit 2");
  if (!follow.includes("stage: researchLifestyle") || follow.includes("place: hoi-an")) {
    fail(`self-check should stay in research:\n${follow}`);
  }
  fs.writeFileSync(pause, "pause\n");
  const stopped = run("next");
  if (!stopped.includes("reason: paused")) fail(`self-check pause:\n${stopped}`);
  fs.rmSync(pause);
  const skipped = run("next --skip sample,hoi-an");
  if (!skipped.includes("action: stop")) fail(`self-check skip:\n${skipped}`);
  if (ALLOWED_PATH.some((rule) => rule.test("src/lib/partners.ts"))) fail("partners.ts must be guarded");
  if (!ALLOWED_PATH.some((rule) => rule.test("src/content/places/hue.json"))) fail("place json must be allowed");
  if (ALLOWED_PATH.some((rule) => rule.test("src/components/PlaceView.astro"))) fail("components must be guarded");
  if (!ALLOWED_PATH.some((rule) => rule.test("ops/board/places/da-nang.json"))) fail("place board files must be allowed");
  checkDirectoryClaims(script);
  console.log("self-check ok");
}

function checkDirectoryClaims(script) {
  const dir = fs.mkdtempSync(path.join("/tmp", "board-dir-"));
  const places = path.join(dir, "places");
  fs.mkdirSync(places);
  writeJson(path.join(dir, "control.json"), {
    version: 2,
    pause: false,
    pauseReason: "",
    claimStaleHours: 3,
    maxOpenContentPrs: 4,
    parallelUnits: 4,
    holdPlaces: [],
    log: [],
  });
  writeJson(path.join(places, "sample.json"), placeShell({ slug: "sample", name: "Sample", publish: "live", priority: 1 }));
  writeJson(path.join(places, "hue.json"), placeShell({ slug: "hue", name: "Hue", publish: "live", priority: 2 }));
  const hueBefore = fs.readFileSync(path.join(places, "hue.json"), "utf8");
  const env = { ...process.env, BOARD_DIR: dir, PAUSE_PATH: path.join(dir, "PAUSE"), RESEARCH_ROOT: dir };
  delete env.BOARD_PATH;
  const run = (extra) => execSync(`node ${script} ${extra}`, { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const listed = run("next --limit 2");
  if (!listed.includes("place: sample") || !listed.includes("place: hue")) fail(`directory next:\n${listed}`);
  run("claim --place sample --stage researchBase");
  if (fs.readFileSync(path.join(places, "hue.json"), "utf8") !== hueBefore) fail("claiming sample rewrote hue");
  const sample = readJson(path.join(places, "sample.json"));
  if (sample.claim?.stage !== "researchBase") fail("sample claim missing");
  const still = run("next --limit 2");
  if (!still.includes("place: hue") || still.includes("place: sample")) fail(`directory next after claim:\n${still}`);
}

const argv = args(process.argv.slice(2));
const command = argv._[0];

if (command === "self-check") runSelfCheck();
else if (command === "init") cmdInit();
else if (command === "upgrade") cmdUpgrade();
else if (command === "split") cmdSplit();
else if (command === "next") cmdNext(argv);
else if (command === "claim") cmdClaim(argv);
else if (command === "release") cmdRelease(argv);
else if (command === "complete") cmdComplete(argv);
else if (command === "set-item") cmdSetItem(argv);
else if (command === "add-item") cmdAddItem(argv);
else if (command === "cover") cmdCover(argv);
else if (command === "block") cmdBlock(argv);
else if (command === "reconcile") cmdReconcile(argv);
else if (command === "validate") cmdValidate();
else if (command === "guard") cmdGuard();
else if (command === "report") cmdReport(argv);
else {
  fail(`Usage: node scripts/board.mjs <init|upgrade|split|next|claim|release|complete|set-item|add-item|cover|block|reconcile|validate|guard|report|self-check>`);
}
