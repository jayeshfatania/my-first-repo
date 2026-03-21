# Developer Brief — Round 11

*Issued by: Product Owner*
*Date: March 2026*
*Based on: walk-detail-overlay-spec.md (Designer, March 2026); condition-tags-design-spec.md §4 (Designer); card-design-update.md (Designer, March 2026)*
*File: sniffout-v2.html only*

---

## Context

Round 10 is complete (FIX 11.1–11.4). This brief delivers three items:

1. **FIX 12.1** — Walk detail overlay, the last major deferred component from Phase 2. Replaces the `onWalkTap()` stub that has been a placeholder since Round 8.
2. **FIX 12.2** — Yr.no weather icons, replacing the Meteocons installed in Round 10. The illustrated fill style is out of register with Sniffout's minimal design.
3. **FIX 12.3** — Trail card declutter. The carousel card is reduced to 3 elements (name, meta, chips). All detail content moves to the overlay.

**Read walk-detail-overlay-spec.md in full before starting FIX 12.1.** The spec is implementation-ready. This brief adds corrections, calls out two missing prerequisites, and provides the complete implementation order.

---

## Prerequisites — Condition Detail CSS (not yet in build)

The walk detail overlay's conditions section depends on CSS classes from `condition-tags-design-spec.md §4` that were deferred from Round 8. These classes are confirmed absent from the build. They must be added before or alongside the overlay.

Add these rules to the `<style>` block, in the condition tags section:

```css
/* ── Condition tags: detail view rows (condition-tags-design-spec.md §4B–4D) ── */

.cond-detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--ink);
}
.cond-detail-label {
  flex: 1;
  font-weight: 500;
}
.cond-detail-age {
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
}

/* Hazard row — amber label and icon colour */
.cond-detail-row--hazard .cond-detail-label { color: var(--amber); }

/* Stale row — dimmed, amber age text */
.cond-detail-row--stale { opacity: 0.55; }
.cond-detail-row--stale .cond-detail-age {
  color: var(--amber);
  font-style: italic;
  opacity: 1; /* override parent */
}

/* Older reports disclosure toggle */
.cond-older-toggle {
  display: block;
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  color: var(--ink-2);
  font-weight: 500;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Empty state */
.cond-empty {
  text-align: center;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.cond-empty-text {
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 400;
  max-width: 240px;
  line-height: 1.5;
}
```

---

## FIX 12.1 — Walk Detail Overlay

One overlay serves all card types (trail carousel, portrait card, Me tab favourites). Walk ID is passed to `openWalkDetail(id)`, which looks up `WALKS_DB` and populates all content dynamically.

---

### Step 1 — Add the overlay CSS

Add the following CSS block to the `<style>` block, after the condition tags rules. The spec provides the complete block — copy it directly from `walk-detail-overlay-spec.md § CSS`.

**One correction required** — the dark mode rule for `.detail-tag--positive` in the spec references old pre-Round-9 rgba values. Replace with the updated values:

```css
/* CORRECT version — use this, not the spec version */
body.night .detail-tag--positive {
  color: var(--brand);
  background: rgba(130,176,154,0.10);
  border-color: rgba(130,176,154,0.20);
}
```

The spec has `rgba(110,231,183,...)` — these are the pre-FIX-10.1 accent values and must not be used. All other dark mode rules in the spec are correct.

---

### Step 2 — Add the overlay HTML

Place the overlay element inside `#app`, after the bottom `<nav>` element. Copy the HTML directly from `walk-detail-overlay-spec.md § Overlay Architecture`.

The Lucide icons in the header buttons (`arrow-left`, `share-2`) should be placed as `<i data-lucide="...">` elements inside the buttons — `syncIcons()` is called by `populateWalkDetail()` on every open.

---

### Step 3 — Add JS variables and functions

Add the following in order. Each function is fully specified in `walk-detail-overlay-spec.md § JavaScript`. This step notes where to add them and flags any corrections.

**New global variables** (near the top of the main script block, with other globals):
```js
var walkDetailMap = null;
var currentDetailWalkId = null;
```

**Functions to add:**

| Function | Source | Notes |
|----------|--------|-------|
| `isWalked(id)` | Spec `populateWalkDetail` footnote | Not currently in build — add it |
| `openWalkDetail(id)` | Spec `openWalkDetail` section | Include `history.pushState` before `.open` |
| `closeWalkDetail()` | Spec `closeWalkDetail` section | Copy as-is |
| `populateWalkDetail(walk)` | Spec section | See correction below |
| `renderDetailTags(walk)` | Spec section | See correction below |
| `detailTag(icon, label, variant)` | Spec section | Copy as-is |
| `renderDetailConditions(walkId)` | Spec section | See correction below |
| `toggleOlderReports(walkId)` | Not yet in build — add it | See spec below |
| `initWalkDetailMap(lat, lon, name)` | Spec section | Copy as-is |
| `shareWalk(walk)` | Spec section | Copy as-is |
| `showShareToast(message)` | Spec section note | Reuse undo toast pattern — see note below |

**Android back button handler** — add the `popstate` listener specified in the spec. If the app already has a `popstate` handler, add the overlay close check inside it. Otherwise add the handler from the spec.

---

### Step 3a — Corrections to spec functions

**`renderDetailConditions(walkId)` — remove `clear` tag**

The spec's `TAG_LABELS` and `TAG_ICONS` local objects include the `clear` key ("Excellent conditions" / "sun"). This tag was removed in FIX 10.3. Remove it from both objects:

```js
// Remove these two entries:
//   clear:'Excellent conditions'    ← from TAG_LABELS
//   clear:'sun'                     ← from TAG_ICONS
```

The `clear` key will never appear in new tag submissions, but may exist in old localStorage data. Because it has no matching entry in `CONDITION_TAGS` (removed in FIX 10.3), `getDisplayTags()` will already filter it out. Removing it from the local objects in `renderDetailConditions` is belt-and-braces hygiene.

**`populateWalkDetail(walk)` — mark-as-walked button**

The spec sets `walkedBtn.onclick` only when the walk is not yet walked. In the confirmed state, the button should be re-tappable (toggle off, per FIX 10.2). Update the walked button setup block:

```js
// Replace the spec's walked button onclick setup with:
walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
// (Remove the conditional — onMarkWalked() already handles the toggle-off case)
```

**`toggleOlderReports(walkId)` — add this function (not in spec JS section)**

This is called by the `cond-older-toggle` button rendered in `renderDetailConditions` but not defined in the spec. Add it:

```js
function toggleOlderReports(walkId) {
  var rows  = document.getElementById('cond-older-rows-' + walkId);
  var arrow = document.getElementById('cond-older-arrow-' + walkId);
  if (!rows) return;
  var open = rows.style.display !== 'none';
  rows.style.display  = open ? 'none' : '';
  if (arrow) arrow.textContent = open ? '↓' : '↑';
}
```

**`showShareToast(message)` — reuse undo toast pattern**

The app already has `.undo-toast` CSS and the `showUndoToast()` JS from FIX 10.2. `showShareToast` is a simpler variant — no undo button, 2-second auto-dismiss. Add:

```js
function showShareToast(message) {
  var existing = document.getElementById('undo-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'undo-toast';
  toast.id = 'undo-toast';
  toast.innerHTML = '<i data-lucide="check" style="width:14px;height:14px;flex-shrink:0"></i> ' + message;
  document.body.appendChild(toast);
  syncIcons();
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2000);
}
```

---

### Step 4 — Update `onWalkTap(id)`

Add `openWalkDetail(id)` at the end of the existing function, as shown in the spec. The explore tracking and `updateMeStats()` calls are already there — only the `openWalkDetail(id)` call is new:

```js
function onWalkTap(id) {
  // ... existing explore tracking and updateMeStats() ...
  openWalkDetail(id); // ← ADD THIS LINE
}
```

---

### Step 5 — Verify

Open the app, set a location (State B). Then:

1. **Open overlay:** Tap any walk card (carousel trail card, portrait card, or Me tab favourite). Overlay should slide up over the full screen including the bottom nav.
2. **Header:** Walk name truncated, back button (←) and share button visible.
3. **Hero:** Image loads if `imageUrl` present; brand-green background if not. Badge shows if `walk.badge` is set. Heart reflects current favourite state.
4. **Info block:** Name, location (with pin icon), rating (only if `reviewCount > 0`), stats row (distance / duration / difficulty).
5. **Quick tags:** Correct tags for the walk's schema. Off-lead, difficulty, terrain, environment all present. Conditional tags (enclosed, livestock, stiles, parking) only show when true.
6. **Tag variants:** Off-lead "full" = green, livestock = amber, difficulty "hard" = amber, everything else = neutral grey.
7. **Description:** Full text, no truncation.
8. **Conditions:** Walk with no tags → empty state ("Be the first to report conditions on this walk."). Walk with tags → tag rows with "reported X ago" timestamp. Stale tags → dimmed with amber "May be out of date". Hazard tags → amber label.
9. **Mark as walked:** 44px full-width button. Tap → confirmed state immediately, undo toast appears. Tap confirmed button → toggles off (FIX 10.2 behaviour).
10. **Post-walk prompt:** If not already tagged today and not dismissed this session, the condition tag sheet opens after marking walked.
11. **Map:** Leaflet map loads 320ms after overlay opens. Centred at walk coords, zoom 14. Single marker. "Open in Google Maps →" link navigates correctly.
12. **Close:** Back button slides overlay down. Map destroyed. Scroll position resets. Opening a different walk populates correctly.
13. **Android back:** Hardware back button closes overlay (not the page).
14. **Dark mode:** All sections render correctly with dark tokens. Detail-tag--positive uses sage tint (not neon mint).
15. **Share:** Tapping share button triggers native share sheet (or clipboard fallback with toast).

---

## FIX 12.2 — Yr.no Weather Icons

Replace Meteocons (installed in FIX 11.4) with Yr.no Weather Symbols. The Meteocons `fill` style is fully illustrated — gradients, shadows, complex fills — which is out of register with Sniffout's clean card-based design. Yr.no icons are flat SVGs with selective colour accents (BBC Weather aesthetic), and are co-authored by the Norwegian Meteorological Institute against the same WMO code set used by Open-Meteo.

**CDN path confirmed:** `https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/svg/`

**File naming:** `{code}d.svg` (day) / `{code}n.svg` (night). For codes with no day/night difference (e.g. overcast, fog): `{code}.svg`. No dark mode subdirectory — night variants (`01n`, `02n`, etc.) serve as dark mode equivalents.

---

### Step 1 — Add `WMO_YR` and `yrIcon()`

In the JS globals section, after `WMO_DESC`/`WMO_ICON`, add:

```js
var YR_BASE = 'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/svg/';

var WMO_YR = {
  0:  { day: '01d', night: '01n' },
  1:  { day: '02d', night: '02n' },
  2:  { day: '03d', night: '03n' },
  3:  { day: '04',  night: '04'  },
  45: { day: '15',  night: '15'  },
  48: { day: '15',  night: '15'  },
  51: { day: '46',  night: '46'  },
  53: { day: '46',  night: '46'  },
  55: { day: '09',  night: '09'  },
  56: { day: '12',  night: '12'  },
  57: { day: '12',  night: '12'  },
  61: { day: '09',  night: '09'  },
  63: { day: '09',  night: '09'  },
  65: { day: '10d', night: '10n' },
  66: { day: '12',  night: '12'  },
  67: { day: '12',  night: '12'  },
  71: { day: '13',  night: '13'  },
  73: { day: '13',  night: '13'  },
  75: { day: '14',  night: '14'  },
  77: { day: '13',  night: '13'  },
  80: { day: '40d', night: '40n' },
  81: { day: '40d', night: '40n' },
  82: { day: '41d', night: '41n' },
  85: { day: '44d', night: '44n' },
  86: { day: '45d', night: '45n' },
  95: { day: '22d', night: '22n' },
  96: { day: '25d', night: '25n' },
  99: { day: '25d', night: '25n' }
};

function yrIcon(code, isDay, size) {
  var entry = WMO_YR[code];
  var name  = entry ? (isDay === 0 ? entry.night : entry.day) : '04';
  return '<img src="' + YR_BASE + name + '.svg"'
    + ' alt="' + (WMO_DESC[code] || 'Weather') + '"'
    + ' width="' + size + '" height="' + size + '"'
    + ' style="display:block;flex-shrink:0;">';
}
```

---

### Step 2 — Replace `meteoconImg()` call sites

There are two call sites:

1. **Today tab hero** (`renderTodayStateB()`) — hero icon, size 64. Replace `meteoconImg(cur.weather_code, cur.is_day, 64)` with `yrIcon(cur.weather_code, cur.is_day, 64)`.
2. **Weather tab forecast grid** (`buildForecastGrid()`) — forecast day icon, size 32. Replace `meteoconImg(code, 1, 32)` with `yrIcon(code, 1, 32)`.

---

### Step 3 — Remove Meteocons artefacts

**JS — remove these three items:**
- `var METEOCON_BASE = '...'`
- `var WMO_METEOCON = { ... }`
- `function meteoconImg(...) { ... }`

**CSS — remove the circular background from forecast icons.** Find the `.forecast-icon img` rule (or equivalent) that adds `background`, `border-radius: 50%`, and `padding` — these were compensating for Meteocons' transparent backgrounds. Remove only those three properties. Yr.no icons have their own visual framing and sit directly on the card surface.

---

### Step 4 — Same-session fallback (Option B)

If the Yr.no icon paths cause any issues during testing, the immediate fallback requires a single character change in `METEOCON_BASE`:

```js
// From (fill variant — current):
var METEOCON_BASE = 'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg-static/';
// To (line variant — fallback):
var METEOCON_BASE = 'https://bmcdn.nl/assets/weather-icons/v3.0/line/svg-static/';
```

Same `WMO_METEOCON` table, same filenames. Ships in minutes. Use this to unblock if needed, then switch to Yr.no in the same session once confirmed.

---

### Step 5 — Verify

- Today tab hero: weather icon renders at 64px for current WMO code. Flat, selective-colour SVG (yellow sun, blue rain, grey cloud) — not illustrated/gradient.
- Dark mode (`body.night`): night variant icon renders (e.g. `01n.svg` for clear sky).
- Weather tab 5-day forecast: each day icon renders at 32px with no circular green background.
- No console errors loading icons (CDN reachable).

---

## FIX 12.3 — Trail Card Declutter

The carousel trail card currently renders up to 8 elements in the card body, making cards ~360–430px tall. The card's job is to create intent to tap — not answer questions. Questions are for the detail overlay.

Reduce to 3 elements: **name · meta · chips**. Everything else (rating, conditions, description, walked button) is already in the detail overlay.

---

### Step 1 — Replace `renderTrailCard()`

Replace the entire function with:

```js
function renderTrailCard(walk) {
  var badgeHTML = walk.badge
    ? '<div class="trail-card-badge">' + walk.badge + '</div>'
    : '';

  var ol = offLeadLabel(walk.offLead);
  var chips = [
    '<span class="trail-tag' + (ol.cls ? ' ' + ol.cls : '') + '">' + ol.text + '</span>'
  ];
  if (walk.enclosed) {
    chips.push('<span class="trail-tag">Enclosed</span>');
  } else if (walk.terrain && walk.terrain !== 'mixed') {
    chips.push('<span class="trail-tag">' +
      walk.terrain.charAt(0).toUpperCase() + walk.terrain.slice(1) + '</span>');
  }

  var condDot = getDisplayTags(walk.id).length > 0
    ? '<div class="trail-card-condition-dot"></div>'
    : '';

  var metaText = walk.distance.toFixed(1) + ' mi · ' +
    walk.difficulty.charAt(0).toUpperCase() + walk.difficulty.slice(1);

  return (
    '<div class="trail-card" onclick="onWalkTap(\'' + walk.id + '\')">' +
      '<div class="trail-card-photo">' +
        badgeHTML +
        condDot +
        '<button class="trail-heart" data-heart="' + walk.id + '" ' +
          'onclick="event.stopPropagation();toggleFavourite(\'' + walk.id + '\',this)">' +
          heartSVG(isFavourited(walk.id)) +
        '</button>' +
      '</div>' +
      '<div class="trail-card-body">' +
        '<div class="trail-card-name">' + escHtml(walk.name) + '</div>' +
        '<div class="trail-card-meta">' + metaText + '</div>' +
        '<div class="trail-card-tags">' + chips.join('') + '</div>' +
      '</div>' +
    '</div>'
  );
}
```

**Chip priority:** Off-lead always shown (1st). Enclosed shown if true (2nd, overrides terrain). Terrain shown only if not mixed and not enclosed (2nd). Maximum 2 chips, never more.

**Dot indicator:** An 8px solid brand-green dot positioned bottom-right of the photo area, left of the heart button. Shows when the walk has fresh condition reports (`getDisplayTags(walk.id).length > 0`). Signals community information exists without adding any text clutter.

---

### Step 2 — Update CSS

**`.trail-card-tags` — change to nowrap:**

```css
.trail-card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;   /* changed from wrap */
  overflow: hidden;
}
```

**`.trail-card-name` — add 2-line clamp:**

```css
.trail-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Add `.trail-card-condition-dot`:**

```css
.trail-card-condition-dot {
  position: absolute;
  bottom: 8px;
  right: 38px;       /* left of .trail-heart */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
  border: 1.5px solid white;
}
```

---

### Step 3 — Update `rerenderCondTagRow()`

After this change, condition tags no longer appear on carousel cards. The function `rerenderCondTagRow(walkId)` was previously responsible for updating the card's condition tag row in-place after a tag submission.

Update it: instead of finding a card element in the DOM and updating it, check whether the walk detail overlay is currently showing the same walk — if so, re-render the detail conditions. Otherwise no-op.

```js
function rerenderCondTagRow(walkId) {
  // Condition tags no longer appear on trail cards (FIX 12.3).
  // If the detail overlay is open for this walk, refresh it.
  if (currentDetailWalkId === walkId) {
    renderDetailConditions(walkId);
  }
}
```

`currentDetailWalkId` is the global added in FIX 12.1. This requires FIX 12.1 to be implemented first.

---

### Step 4 — Verify

- Trail card renders with exactly 3 elements: name (max 2 lines), meta (`X.X mi · Difficulty`), 1–2 chips.
- No rating, no description, no condition chips, no walked button on the card.
- Dot indicator appears on cards that have fresh condition tags; absent on cards with no tags.
- After submitting a condition tag, the detail overlay's conditions section updates if open; carousel cards are unaffected.
- Card body height ~80–90px. Total card height ~270px.

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| Prereq | Condition detail CSS — `.cond-detail-row`, `.cond-empty`, `.cond-older-toggle` (deferred from Round 8, not yet in build) | Trivial |
| FIX 12.1 | Walk detail overlay — HTML, CSS, 10 JS functions, `onWalkTap` update | Medium |
| FIX 12.2 | Yr.no weather icons — replace Meteocons. Add `WMO_YR` + `yrIcon()`, remove `WMO_METEOCON` + `meteoconImg()` + `METEOCON_BASE`, remove forecast icon circle CSS | Small |
| FIX 12.3 | Trail card declutter — 3-element card body, dot indicator, `rerenderCondTagRow()` update, CSS tweaks | Small |

**Dependencies confirmed in build:** `WALKS_DB`, `heartSVG()`, `toggleFavourite()`, `isFavourited()`, `onMarkWalked()`, `openCondTagSheet()`, `getDisplayTags()`, `relativeTime()`, `luIcon()`, `syncIcons()`, `offLeadLabel()`, `difficultyLabel()`, `escHtml()`, Leaflet CDN, undo toast CSS, `WMO_DESC`.

**Not yet in build — add in this round:** `isWalked()`, `toggleOlderReports()`, `showShareToast()`, condition detail CSS (§4), overlay HTML and CSS, `YR_BASE`, `WMO_YR`, `yrIcon()`.

**Implementation order:** Prerequisites → FIX 12.1 → FIX 12.2 → FIX 12.3. FIX 12.3 Step 3 (`rerenderCondTagRow`) depends on `currentDetailWalkId` being in place from FIX 12.1.
