# Sniffout — Developer Brief: Round 13
*Issued by: Product Owner*
*Date: March 2026*
*Inputs: po-action-plan-round12.md, owner device testing, disclaimer-design-spec.md, community-gamification-roadmap.md*

---

## Context

Round 12 shipped all four fixes (swipe dismiss, conditions z-index, tag conflicts, walk log data model). Owner device testing surfaced additional issues and the carry-forward Me tab / gamification work from Round 12 is now due.

**Total estimated effort: 3.5–4.5 hours.**

---

## Design blocks — read before starting

**FIX 14.7 (dark mode toggle)** is design-blocked. See the flag in that section. Do not implement it until the Designer responds, or implement the simple fallback described. Everything else can proceed immediately.

The **45 new and rewritten walk descriptions** from the Copywriter are NOT in this round. They are awaiting Editor and Validator sign-off and will follow as a separate content drop. Do not add or rewrite any walk descriptions in Round 13.

---

## Implementation order

Dependencies govern this order — do not resequence.

1. FIX 14.1 — Remove duplicate devils-dyke (data, no deps, 5 min)
2. FIX 14.2 — Disable map touch interactions (Leaflet config, no deps, 10–15 min)
3. FIX 14.3 — sniffout_explored schema upgrade (data migration, must ship before FIX 14.5 and 14.6)
4. FIX 14.4 — Walk detail overlay disclaimer (static HTML + CSS, no deps, 20–25 min)
5. FIX 14.5 — Me tab walk history (depends on Round 12 walk log — `getWalkLog()` must be in build)
6. FIX 14.6 — Gamification helpers + badge display (depends on FIX 14.3 and Round 12 walk log)
7. FIX 14.7 — Dark mode toggle state visibility (**DESIGN-BLOCKED** — see instructions below)

---

## FIX 14.1 — Remove duplicate devils-dyke entry

**Effort:** 5 min
**Dependencies:** None

The Copywriter identified a duplicate entry for Devil's Dyke in `WALKS_DB`. The entry to keep is:

```
id: 'devils-dyke'
name: 'Devil\'s Dyke & South Downs'
location: 'Brighton, West Sussex'
lat: 50.9091, lon: -0.2260
```

**Step 1 — Find the duplicate**

Search WALKS_DB for any second entry that describes the same walk. The duplicate may have a different `id` but the same or near-identical `name`, `lat`/`lon`, or `location`. Search for:
- Any ID containing `dyke` or `devil`
- Any entry with `lat` close to `50.9091` or `lon` close to `-0.2260`
- Any `location` containing `Brighton` with similar description text

**Step 2 — Remove**

Delete the complete duplicate object from the `WALKS_DB` array (including its trailing comma). Keep the `id: 'devils-dyke'` entry at its current position.

**Verify:**
- WALKS_DB renders without JS errors.
- Walk cards load without blank entries.
- No walk detail can be opened with the deleted ID (it no longer appears in the list, so this is automatic).

---

## FIX 14.2 — Disable map touch interactions in walk detail overlay

**Effort:** 10–15 min
**Dependencies:** None

The Leaflet map inside the walk detail overlay is decorative/reference only — it shows the walk start location. On mobile, users accidentally drag the map while trying to scroll past it. Disable all interaction.

**Step 1 — Update `initWalkDetailMap()` options**

Find `initWalkDetailMap()` (currently around line 3863). Update the `L.map()` constructor to include the following disabled options:

```js
walkDetailMap = L.map(container, {
  zoomControl: false,
  attributionControl: false,
  dragging: false,
  scrollWheelZoom: false,
  touchZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false
});
```

**Step 2 — Belt-and-braces disable after creation**

Immediately after the `L.map()` call and before `setView`, add:

```js
walkDetailMap.dragging.disable();
walkDetailMap.touchZoom.disable();
```

Mobile Leaflet sometimes ignores constructor options for touch events. The explicit method calls are the reliable path.

**Do not** add a `pointer-events: none` CSS override — this would break the "Open in Google Maps →" link below the map which the user does need to tap.

**Verify:**
- On real device or Chrome DevTools touch emulation: attempt to drag the map in the detail overlay → map does not pan.
- Attempt pinch-to-zoom → no zoom.
- Scroll up on the walk detail content above the map → normal scroll.
- Scroll down past the map → normal scroll (no map drag capture).
- "Open in Google Maps →" link below the map still works.
- The Nearby tab full-screen Leaflet map (`initNearbyMap()`) is **not affected** — that map needs full interaction. Only change `initWalkDetailMap()`.

---

## FIX 14.3 — sniffout_explored schema upgrade

**Effort:** 25–35 min
**Dependencies:** None, but must ship before FIX 14.5 and FIX 14.6

**Why this matters:** The current `sniffout_explored` stores walk IDs as a flat array with no timestamps. Once users build up a history in this format, that data cannot be retroactively enriched with season or date context. This upgrade is now-or-never — it must ship before any walk history or badge features.

**Current schema:**
```
sniffout_explored: ["walk-id-1", "walk-id-2"]
```

**New schema:**
```
sniffout_explored: {
  "walk-id-1": [{ ts: 1741200000000, season: "winter" }],
  "walk-id-2": [{ ts: 1741200000000, season: "spring" }, { ts: 1743800000000, season: "spring" }]
}
```

Each walk ID maps to an array of visit objects. Multiple entries per walk ID are expected and intentional — every time a walk detail is opened, a new entry is appended. This enables "Seasonal Walker" badge logic (same walk in 2+ seasons) and "last visited" display.

**Step 1 — Add season helper**

Add near the top of the JS section alongside other utility helpers:

```js
function tsToSeason(ts) {
  var m = new Date(ts).getMonth(); // 0-indexed
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4)             return 'spring';
  if (m <= 7)             return 'summer';
  return 'autumn';
}
```

**Step 2 — Replace sniffout_explored read/write functions**

Remove the current inline `localStorage.getItem(EXPLORED_KEY)` blocks in `onWalkTap()` and `updateMeStats()`. Replace them with these centralized helpers:

```js
function getExplored() {
  try {
    var raw = localStorage.getItem(EXPLORED_KEY);
    if (!raw) return {};
    var parsed = JSON.parse(raw);
    // One-time migration: flat array → timestamped object
    if (Array.isArray(parsed)) {
      var migratedTs = Date.now() - (7 * 24 * 3600000); // back-date 1 week
      var migrated = {};
      parsed.forEach(function(id) {
        migrated[id] = [{ ts: migratedTs, season: tsToSeason(migratedTs) }];
      });
      localStorage.setItem(EXPLORED_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch(e) { return {}; }
}

function markExplored(walkId) {
  var explored = getExplored();
  var ts = Date.now();
  if (!explored[walkId]) explored[walkId] = [];
  explored[walkId].push({ ts: ts, season: tsToSeason(ts) });
  try { localStorage.setItem(EXPLORED_KEY, JSON.stringify(explored)); } catch(e) {}
}

function getExploredCount() {
  return Object.keys(getExplored()).length;
}

function getExploredSeasons(walkId) {
  return (getExplored()[walkId] || []).map(function(e) { return e.season; });
}
```

**Step 3 — Update `onWalkTap()`**

Replace the existing inline localStorage block with the helper call:

```js
function onWalkTap(id) {
  markExplored(id);
  updateMeStats();
  openWalkDetail(id);
}
```

**Step 4 — Update `updateMeStats()`**

Replace the existing explored count line with:

```js
var exploredCount = getExploredCount();
```

**Step 5 — Confirm stat label**

The `stat-explored` element in the Me tab HTML should be labelled "Walks explored" (or similar). Confirm this label is correct and not "Walks logged" — the explored count and the walk log count are different stats. `stat-explored` = unique walks tapped open. `stat-walked` = total log entries (from Round 12). These are distinct.

**Verify:**
- Fresh session (no localStorage): open 3 walk details → `localStorage.getItem('sniffout_explored')` in DevTools shows an object with 3 keys, each with one visit entry containing a `ts` and correct `season`.
- Open the same walk detail again → the walk's array gains a second entry.
- User with existing flat array: on first `getExplored()` call, old array is migrated to object format and old key is overwritten. Verify via DevTools before and after.
- `getExploredCount()` returns the correct count of unique walk IDs (not total visits).
- Me tab "Walks explored" stat updates correctly.

---

## FIX 14.4 — Walk detail overlay disclaimer

**Effort:** 20–25 min
**Dependencies:** None
**Design spec:** `disclaimer-design-spec.md` — read in full before implementing. Summary below.

**What:** A passive footnote at the bottom of the walk detail overlay. No acknowledgement required. Always visible. No session logic.

**Copy (exact — do not paraphrase):**
> Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go.

**Step 1 — Add CSS**

Add to the walk detail overlay CSS section in `<style>`:

```css
.walk-detail-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: transparent;
}
.walk-detail-disclaimer-icon {
  flex-shrink: 0;
  color: var(--ink-2);
  margin-top: 1px;
}
.walk-detail-disclaimer span {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--ink-2);
}
```

Dark mode is handled automatically by `var(--ink-2)` and `var(--border)` tokens. No `body.night` override needed.

**Step 2 — Add HTML**

In the walk detail overlay HTML, insert the disclaimer element between `.walk-detail-map-section` and `.walk-detail-bottom-pad`:

```html
<div class="walk-detail-disclaimer">
  <svg class="walk-detail-disclaimer-icon" aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg" width="14" height="14"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
  <span>Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go.</span>
</div>
```

**No JS required.** The disclaimer is static HTML, always in the DOM, always visible.

**What NOT to do (from design spec):**
- Do not use amber or red — those colours signal weather hazards
- Do not bold the text
- Do not add `border-radius` — this is a footnote, not a card
- Do not add paw emoji
- Do not require any user acknowledgement

**Verify:**
- Open any walk detail → disclaimer visible at the bottom, below map section, above bottom padding.
- In dark mode (`body.night`) → disclaimer renders correctly (no hardcoded colours).
- Text is readable but clearly secondary — it should read as a footnote, not a warning.
- Icon is top-aligned to the first line of text when the text wraps to multiple lines.

---

## FIX 14.5 — Me tab walk history

**Effort:** 60–75 min
**Dependencies:** `getWalkLog()` must be in the build (shipped in Round 12). FIX 14.3 (`markExplored`) should be complete first.

This completes the Me tab history section deferred from Round 12. It surfaces the walk log as a personal history list in the Me tab.

**Step 1 — Add `logDateLabel()` helper**

```js
function logDateLabel(ts) {
  if (!ts) return '';
  var d       = new Date(ts);
  var now     = new Date();
  var diffMs  = now - d;
  var diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return diffDays + ' days ago';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
```

**Step 2 — Add `renderWalkLogSection()`**

This function renders a personal history list in the Me tab. Show the 5 most recently walked **unique** walks (deduplicated by walk ID, ordered by most recent log entry timestamp).

For each walk entry show:
- Walk name (looked up from `WALKS_DB` by ID — gracefully handle deleted walk IDs with a fallback)
- How many times logged: "Walked X time" / "Walked X times"
- Date of most recent log entry: formatted via `logDateLabel()`
- Tapping the row opens the walk detail overlay via `openWalkDetail(id)`

```js
function renderWalkLogSection() {
  var container = document.getElementById('me-walk-log');
  if (!container) return;

  var log = getWalkLog();
  if (log.length === 0) {
    container.innerHTML = '<p class="me-log-empty">No walks logged yet. Mark a walk as walked to start your log.</p>';
    return;
  }

  // Deduplicate — keep most recent entry per walk ID
  var seen = {};
  var unique = [];
  log.forEach(function(entry) {
    if (!seen[entry.id]) {
      seen[entry.id] = { id: entry.id, lastTs: entry.ts, count: 0 };
      unique.push(seen[entry.id]);
    }
    seen[entry.id].count++;
  });

  // Sort by most recent, take first 5
  unique.sort(function(a, b) { return b.lastTs - a.lastTs; });
  var recent = unique.slice(0, 5);

  var walkById = {};
  WALKS_DB.forEach(function(w) { walkById[w.id] = w; });

  var html = recent.map(function(entry) {
    var walk = walkById[entry.id];
    var name = walk ? walk.name : 'Unknown walk';
    var countStr = entry.count === 1 ? 'Walked once' : 'Walked ' + entry.count + ' times';
    return '<div class="me-log-row" onclick="openWalkDetail(\'' + entry.id + '\')">' +
      '<div class="me-log-name">' + name + '</div>' +
      '<div class="me-log-meta">' + countStr + ' · ' + logDateLabel(entry.lastTs) + '</div>' +
    '</div>';
  }).join('');

  if (unique.length > 5) {
    html += '<div class="me-log-seeall" onclick="openWalkLogSheet()">See all ' + unique.length + ' walks →</div>';
  }

  container.innerHTML = html;
}
```

**Step 3 — Add CSS**

```css
.me-log-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.me-log-row:last-of-type { border-bottom: none; }
.me-log-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 2px;
}
.me-log-meta {
  font-size: 13px;
  color: var(--ink-2);
}
.me-log-empty {
  font-size: 14px;
  color: var(--ink-2);
  text-align: center;
  padding: 24px 0;
  margin: 0;
}
.me-log-seeall {
  font-size: 13px;
  font-weight: 500;
  color: var(--brand);
  padding: 12px 0 4px;
  cursor: pointer;
}
```

**Step 4 — Add Me tab HTML container**

In the Me tab HTML, add a walk history section with a heading and the container div. Position it below the stats row and above settings:

```html
<div class="me-section">
  <div class="me-section-title">Walk history</div>
  <div id="me-walk-log"></div>
</div>
```

Add `.me-section` and `.me-section-title` CSS if not already defined (follow the existing Me tab section style).

**Step 5 — Add "See all walks" bottom sheet**

`openWalkLogSheet()` renders a full bottom sheet listing all unique walked walks, sorted by most recent. Follow the existing bottom sheet pattern in the codebase (the conditions tag sheet is the reference). Title: "Your walks". Each row is tappable to open the walk detail.

**Step 6 — Call `renderWalkLogSection()` on tab show and after logging**

- Call in `showTab('me')` after `updateMeStats()`.
- Call after `logWalk()` succeeds (in `onMarkWalked()`) — add `renderWalkLogSection()` alongside the existing `updateMeStats()` call.

**Verify:**
- No logged walks: empty state message visible.
- 3 walks logged: all 3 appear, most recently logged first.
- Same walk logged 3 times: one row with "Walked 3 times · [date]".
- 6+ unique walks: first 5 visible, "See all X walks →" link appears.
- Tapping a row opens the walk detail overlay.
- "See all" sheet opens and is dismissable.
- Walk history updates immediately after marking a walk as walked (without requiring a tab change).

---

## FIX 14.6 — Gamification helpers and badge display

**Effort:** 60–75 min
**Dependencies:** FIX 14.3 (`getExplored()`, `getExploredSeasons()`), Round 12 walk log (`getWalkLog()`, `getFavourites()`)

**Step 1 — Add `getTotalDistanceMi()`**

Counts total distance across all logged walks (by summing the `distance` field for each log entry, including repeats). A walk logged 3 times counts 3× its distance — this rewards walking, not just discovering.

```js
function getTotalDistanceMi() {
  var log = getWalkLog();
  var walkById = {};
  WALKS_DB.forEach(function(w) { walkById[w.id] = w; });
  return log.reduce(function(sum, entry) {
    var walk = walkById[entry.id];
    return sum + (walk && walk.distance ? walk.distance : 0);
  }, 0);
}
```

**Step 2 — Add `getEarnedBadges()`**

Returns an array of earned badge objects `{ id, label, description }`. Badges are milestone-based only. No streak badges.

```js
function getEarnedBadges() {
  var badges  = [];
  var log     = getWalkLog();
  var explored = getExplored();
  var favs    = getFavourites();

  var uniqueWalked   = {};
  log.forEach(function(e) { uniqueWalked[e.id] = true; });
  var uniqueWalkedCount = Object.keys(uniqueWalked).length;

  var exploredIds    = Object.keys(explored);
  var exploredCount  = exploredIds.length;
  var totalMi        = getTotalDistanceMi();

  // — Explorer: 5 unique walks explored (opened)
  if (exploredCount >= 5) {
    badges.push({ id: 'explorer', label: 'Explorer', description: '5 walks explored' });
  }

  // — Trailblazer: 10 unique walks explored
  if (exploredCount >= 10) {
    badges.push({ id: 'trailblazer', label: 'Trailblazer', description: '10 walks explored' });
  }

  // — Devoted: 5 walks actually logged (walked)
  if (uniqueWalkedCount >= 5) {
    badges.push({ id: 'devoted', label: 'Devoted', description: '5 walks completed' });
  }

  // — Regular: same walk logged 3+ times
  var logCountById = {};
  log.forEach(function(e) { logCountById[e.id] = (logCountById[e.id] || 0) + 1; });
  var hasRegular = Object.values(logCountById).some(function(c) { return c >= 3; });
  if (hasRegular) {
    badges.push({ id: 'regular', label: 'Regular', description: 'Same walk 3 times' });
  }

  // — Regional Rambler: explored walks in 3+ different regions
  var walkById = {};
  WALKS_DB.forEach(function(w) { walkById[w.id] = w; });
  var regions = {};
  exploredIds.forEach(function(id) {
    var w = walkById[id];
    if (w && w.location) {
      // Use the last part of location string as region proxy (e.g., "Peak District" from "Edale, Peak District")
      var parts = w.location.split(',');
      var region = parts[parts.length - 1].trim();
      regions[region] = true;
    }
  });
  if (Object.keys(regions).length >= 3) {
    badges.push({ id: 'rambler', label: 'Regional Rambler', description: '3 regions explored' });
  }

  // — Seasonal Walker: same walk explored in 2+ different seasons
  var hasSeasonal = exploredIds.some(function(id) {
    var seasons = getExploredSeasons(id);
    var uniqueSeasons = {};
    seasons.forEach(function(s) { uniqueSeasons[s] = true; });
    return Object.keys(uniqueSeasons).length >= 2;
  });
  if (hasSeasonal) {
    badges.push({ id: 'seasonal', label: 'Seasonal Walker', description: 'Same walk in 2 seasons' });
  }

  // — Collector: 5+ walks favourited
  if (favs.length >= 5) {
    badges.push({ id: 'collector', label: 'Collector', description: '5 walks favourited' });
  }

  return badges;
}
```

**Step 3 — Badge display in Me tab**

Add a badges section to the Me tab HTML below the stats row and above the walk history section:

```html
<div class="me-section" id="me-badges-section">
  <div class="me-section-title">Badges</div>
  <div id="me-badges"></div>
</div>
```

CSS:

```css
#me-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0 8px;
}
.me-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(30,77,58,0.06);
  border: 1px solid rgba(30,77,58,0.15);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--brand);
}
.me-badges-empty {
  font-size: 13px;
  color: var(--ink-2);
  padding: 4px 0 8px;
}
```

`renderBadges()` function:

```js
function renderBadges() {
  var container = document.getElementById('me-badges');
  if (!container) return;
  var badges = getEarnedBadges();
  if (badges.length === 0) {
    container.innerHTML = '<span class="me-badges-empty">Keep exploring to earn badges.</span>';
    return;
  }
  container.innerHTML = badges.map(function(b) {
    return '<div class="me-badge">' + b.label + '</div>';
  }).join('');
}
```

**Step 4 — Update Me tab stats row**

Add total distance to the stats row:

```js
var distEl = document.getElementById('stat-distance');
if (distEl) distEl.textContent = Math.round(getTotalDistanceMi()) + ' mi';
```

Add `stat-distance` HTML to the stats row alongside `stat-explored`, `stat-walked`, `stat-favs`. Label: "Miles walked".

**Step 5 — Call `renderBadges()` on tab show and after logging**

- Call in `showTab('me')` after `updateMeStats()`.
- Call after `logWalk()` and `markExplored()` — add to `onMarkWalked()` and `onWalkTap()`.

**Streak note — important:** `getCurrentStreak()` and `getLongestStreak()` are listed in the Round 12 deferred scope. Implement them internally if useful for future features, but **do not** render streak counts anywhere in the Me tab UI. Per the PO decision in Round 12: streaks add anxiety to an already-habitual behaviour. Milestone badges are the right signal. The streak helpers can exist as dead code for future use; they must not surface to the user.

**Verify:**
- Fresh user (no history): badges section shows "Keep exploring to earn badges."
- After exploring 5 walks: "Explorer" badge appears.
- After exploring 10 walks: "Trailblazer" badge also appears (both visible).
- After favouriting 5 walks: "Collector" badge appears.
- After logging same walk 3 times: "Regular" badge appears.
- Badges update live after tapping a walk or marking as walked (no tab reload needed).
- No streak badge exists anywhere in the UI.
- Dark mode: badge chips render correctly with brand green on dark surface.

---

## FIX 14.7 — Dark mode toggle active state visibility

**Effort:** 20–30 min
**Status: DESIGN-BLOCKED — await Designer input before implementing**

**Owner observation:** The three-state dark mode toggle (Auto / Off / On) does not show the current active state visually until the user taps it.

**Current implementation (for Designer context):**
The toggle is a standard settings row item (`#setting-dark`) with a right-aligned text label (`#darkmode-val`) showing "Auto", "Off", or "On". The `applyDarkModePreference()` function already updates this text on init and on each tap. The text label is styled as secondary text (`var(--ink-2)`).

The UX issues are likely:
1. The text label is secondary colour and weight — it doesn't read as a current-state indicator
2. The cycling pattern (single tap to cycle) means users can't see all three options at once

**Designer decision needed:**

Option A — Simple label enhancement (low effort, implement now if Designer is unavailable):
Make `#darkmode-val` visually prominent when a non-default state is active. Update `applyDarkModePreference()` to apply a class:

```js
function applyDarkModePreference(mode) {
  // ...existing logic...
  var el = document.getElementById('darkmode-val');
  if (el) {
    el.textContent = DARKMODE_LABELS[mode] || 'Auto';
    el.className = 'settings-item-right darkmode-val-' + mode;
  }
}
```

Add CSS:
```css
.darkmode-val-on,
.darkmode-val-off {
  color: var(--brand);
  font-weight: 600;
}
/* 'auto' inherits default secondary text style */
```

This makes "On" and "Off" visually distinct from the default "Auto" state, giving the user a clear signal that they've overridden the default.

Option B — Segmented control redesign (better UX, more effort, requires Designer spec):
Replace the cycling tap pattern with a three-segment selector showing all three states simultaneously, with the active segment highlighted. This requires new HTML, CSS, and a rewrite of the click handler.

**If no Designer response is received before this fix is due:** implement Option A. It resolves the owner's observation with minimal risk. Option B remains available for a future round with a Designer spec.

**Verify (Option A):**
- Page load with "Auto" saved: darkmode-val shows "Auto" in secondary text style.
- Tap once → "Off" appears in brand green / weight 600.
- Tap again → "On" appears in brand green / weight 600.
- Tap again → "Auto" returns to secondary text style.
- Dark mode: verify brand green is legible on both light and dark backgrounds.

---

## Pollen indicator — deferred, not Round 13

The owner asks whether pollen should be included in Round 13.

**PO decision: defer to Phase 3.**

Reasoning:
1. **Architecture document (`CLAUDE.md`) explicitly categorises pollen as a Phase 3 addition**: "Phase 3 additions (not yet implemented): Open-Meteo `uv_index` parameter; Open-Meteo `european_aqi` endpoint for pollen." This is the authoritative source — the Phase 3 classification reflects a deliberate decision that pollen adds a second API call with its own latency, failure modes, and data-validation complexity.
2. **Round 13 is already substantive.** Adding pollen would make this a 5–6 hour round. The Me tab features (FIX 14.5, FIX 14.6) and the schema upgrade (FIX 14.3) are higher-priority foundational work.
3. **Pollen is a weather intelligence enhancement.** The weather tab is already the differentiator; pollen makes it stronger, but not having it does not break the core proposition. The other hazard data (rain/heat/wind/UV) covers the primary dog-walk use cases for now.

Pollen remains on the Phase 3 roadmap. When it ships, it will use the Open-Meteo `european_aqi` endpoint for `alder_pollen`, `birch_pollen`, and `grass_pollen` parameters, aligned with the existing weather data fetch pattern.

---

## Not in Round 13

| Item | Status |
|---|---|
| 45 new and rewritten walk descriptions | Awaiting Editor + Validator sign-off. Separate content drop. |
| Pollen indicator | Deferred to Phase 3 per PO decision above |
| "Last visited" note on walk detail card | Deferred to Round 14 — depends on sniffout_explored schema (FIX 14.3) which ships this round |
| `getCurrentStreak()` / `getLongestStreak()` UI | Implemented internally only, never surfaced to user |
| Static SEO regional pages | Owner action, no Developer involvement |
| AI-assisted walk submission | Phase 3 — noted in community-gamification-roadmap.md |

---

## Round 13 — Complete scope summary

| Fix | Description | Effort | Design-blocked? |
|---|---|---|---|
| FIX 14.1 | Remove duplicate devils-dyke from WALKS_DB | 5 min | No |
| FIX 14.2 | Disable Leaflet touch/scroll/zoom in walk detail map | 10–15 min | No |
| FIX 14.3 | sniffout_explored schema upgrade — timestamped object with season, migration, new helpers | 25–35 min | No |
| FIX 14.4 | Walk detail overlay disclaimer — static HTML/CSS, always visible, no acknowledgement | 20–25 min | No |
| FIX 14.5 | Me tab walk history — logDateLabel, renderWalkLogSection, "See all" sheet | 60–75 min | No |
| FIX 14.6 | Gamification helpers + badge display — getTotalDistanceMi, getEarnedBadges, renderBadges, distance stat | 60–75 min | No |
| FIX 14.7 | Dark mode toggle active state — simple label enhancement or segmented control | 20–30 min | **Yes — await Designer** |
| **Total** | | **3.5–4.5 hrs** | |
