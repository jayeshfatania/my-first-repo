# Sniffout v2 — Developer Brief Round 6
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: design-review-round3.md, developer-notes.md, and owner phone feedback session.*

All work in **`sniffout-v2.html`** only. This is a substantial session. Read the full brief before starting — several changes interact with each other.

---

## Round 5 status confirmation

The following are confirmed complete per `developer-notes.md` and are not repeated here:

| Fix | Item | Status |
|-----|------|--------|
| FIX 6.1 | Remove parks and beaches from Nearby tab | ✅ Done |
| FIX 6.2 | Remove "Nearby" pill from green space cards | ✅ Done |
| FIX 6.3 | "View on Google Maps →" link on green space cards | ✅ Done |

---

## Regression fix — Badge value must be singular

### FIX 7.0 — Revert WALKS_DB badge values to `'Sniffout Pick'` (singular)

**Issue:** `developer-notes.md` FIX 5.9 records that all three WALKS_DB badge values were changed from `'Sniffout Pick'` to `'Sniffout Picks'` (plural). This is incorrect.

The distinction is:
- **Badge on an individual walk card** → `'Sniffout Pick'` (singular — "this walk is a Sniffout pick")
- **Section label for a collection of these walks** → `"Sniffout Picks"` (plural — the section heading)

The schema definition in `CLAUDE.md` specifies `badge: "Sniffout Pick"` (singular). The Today tab design proposal explicitly called out this distinction. The section label change ("Sniffout Picks") was correct; the badge value change was not.

**Fix:** In `WALKS_DB`, change all three badge entries back from `'Sniffout Picks'` to `'Sniffout Pick'`. Also update the `renderStateAPreviews()` selection logic if it filters on `badge === 'Sniffout Picks'` — it should filter on `badge === 'Sniffout Pick'`.

**Confirm:** Individual trail cards show "Sniffout Pick" as the badge label. The Walks tab section heading remains "Sniffout Picks". Both can coexist.

---

## FIX 7.1 — Trail card resize: wider, taller, with description

**Approved design:** Option C from design-review-round3.md — 240px wide, 180px photo height, 2-line description excerpt.

### CSS changes

Replace the current `.trail-card` and `.trail-card-photo` CSS with the following. Update `.trail-card-body`, `.trail-card-name`, `.trail-card-meta` as specified. Add new `.trail-card-desc`:

```css
.trail-card {
  flex-shrink: 0;
  width: 240px;
  min-width: 240px;
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
}
.trail-card-photo {
  height: 180px;
  background: var(--brand);
  position: relative;
  overflow: hidden;
}
.trail-card-body { padding: 10px 12px 14px; }
.trail-card-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 4px; line-height: 1.3; }
.trail-card-rating { font-size: 12px; color: #D97706; font-weight: 500; margin-bottom: 4px; }
.trail-card-meta { font-size: 12px; color: var(--ink-2); margin-bottom: 6px; }
.trail-card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.trail-card-desc {
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-2);
  line-height: 1.4;
  margin-top: 6px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

### `renderTrailCard()` change

After the `.trail-card-tags` div, add the description element:

```js
'<div class="trail-card-desc">' + escHtml(walk.description) + '</div>'
```

Apply `escHtml()` to the description — it is user-visible text rendered as HTML content.

**Confirm:** Trail cards in the Sniffout Picks carousel are 240px wide with a 180px photo area. A 2-line (max) description excerpt appears below the tags row. Cards in the preview carousel on State A (Today tab) also use this new sizing.

---

## FIX 7.2 — Green space card: left-thumbnail layout

This is a complete replacement of the `.gs-card` layout. The current card (full-width photo top + body below) is replaced by a horizontal row with a 64×64px left thumbnail.

**Important:** `.venue-card-photo-gp` is still used by Nearby tab venue cards — do NOT remove that class or its CSS. Only the green space card (`renderGreenSpaceCard`) is being changed here.

### CSS changes

Replace the existing `.gs-card` CSS block entirely. Add new `.gs-thumb` class. Update `.gs-card-body`, `.gs-card-name`, `.gs-card-meta`. The `.gs-maps-link` CSS added in FIX 6.3 is also replaced here:

```css
.gs-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin: 0 16px 8px;
  padding: 10px 12px;
  gap: 12px;
  min-height: 72px;
}
.gs-thumb {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--brand);
}
.gs-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gs-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.gs-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gs-card-meta {
  font-size: 12px;
  color: var(--ink-2);
}
.gs-maps-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--brand);
  margin-top: 2px;
  white-space: nowrap;
  text-decoration: none;
}
.gs-maps-link:hover { text-decoration: underline; }
```

### `renderGreenSpaceCard()` rewrite

Replace the entire function body with the following output structure. The `mapsUrl` construction from FIX 6.3 is retained unchanged:

```js
function renderGreenSpaceCard(gs, refLat, refLon) {
  var distKm = haversineKm(refLat, refLon, gs.lat, gs.lon);
  var distText = distKm < 1
    ? Math.round(distKm * 1000) + 'm away'
    : distKm.toFixed(1) + ' km away';
  var mapsUrl = 'https://www.google.com/maps/place/' +
    encodeURIComponent(gs.name) + '/@' + gs.lat + ',' + gs.lon + ',16z';
  var thumbHtml = gs.photoUrl
    ? '<div class="gs-thumb"><img src="' + gs.photoUrl + '" alt="" loading="lazy"></div>'
    : '<div class="gs-thumb"></div>';
  return (
    '<div class="gs-card">' +
      thumbHtml +
      '<div class="gs-card-body">' +
        '<div class="gs-card-name">' + escHtml(gs.name) + '</div>' +
        '<div class="gs-card-meta">' + distText + '</div>' +
        '<a class="gs-maps-link" href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">' +
          'View on Google Maps \u2192' +
        '</a>' +
      '</div>' +
    '</div>'
  );
}
```

Note `onclick="event.stopPropagation()"` on the Maps link — prevents the card's own click handler (if any) from firing when the link is tapped.

**Confirm:** Green space cards in "Other nearby green spaces" show a 64×64px thumbnail on the left (brand-green if no photo), name + distance + Maps link stacked in the right column. Total card height ~80px — significantly shorter than the old full-width photo format.

---

## FIX 7.3 — `environment` field: add to all 25 WALKS_DB entries

Add `environment` field to every entry in `WALKS_DB`. Position it alongside `terrain` for readability.

**Approved values:** `'woodland'` · `'coastal'` · `'urban'` · `'moorland'` · `'heathland'` · `'open'`

**Value definitions:**
- `'woodland'` — forest or tree-covered paths
- `'coastal'` — clifftops, beach paths, estuaries
- `'urban'` — city parks, town commons, canal towpaths
- `'moorland'` — open moor, bog, upland
- `'heathland'` — lowland heath
- `'open'` — open countryside, farmland paths, fields. **Default: when uncertain, use `'open'`.**

**Guidance:** Use walk names, locations, and descriptions to assign values. Walks already confirmed:
- Richmond Park → `'urban'`
- Any Dartmoor walk → `'moorland'`
- Any coastal path → `'coastal'`
- Any New Forest walk → likely `'woodland'` or `'heathland'` depending on the specific route
- Peak District → `'moorland'` or `'open'` depending on route character

Document the assigned value for each walk in `developer-notes.md` so the PO can review and correct if needed.

**Confirm:** All 25 WALKS_DB entries have an `environment` field. No entry is missing it. Document assignments in developer-notes.md.

---

## FIX 7.4 — Filter/sort bottom sheet: replace inline radius picker

The current inline `.radius-picker` pattern is replaced entirely by a bottom sheet modal for both tabs. The existing `#walks-radius-picker`, `#nearby-radius-picker`, `#walks-radius-btn`, and `#nearby-radius-btn` elements and their JS handlers are superseded by the new system.

This is the largest change in this brief. Read all subsections before starting.

---

### 7.4a — CSS: add filter sheet styles

Add the following CSS block inside `<style>`, after the existing `.radius-picker` rules (which can be left in place — unused CSS is harmless):

```css
/* ─── Filter sheet backdrop ─── */
.filter-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
}
.filter-backdrop.open { display: block; }

/* ─── Filter sheet panel ─── */
.filter-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 72vh;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  z-index: 201;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.32,0.72,0,1);
}
.filter-sheet.open { transform: translateY(0); }

/* ─── Drag handle ─── */
.filter-handle {
  width: 40px;
  height: 4px;
  background: var(--chip-off);
  border-radius: 2px;
  margin: 12px auto 4px;
  flex-shrink: 0;
}

/* ─── Sheet header ─── */
.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 12px;
  flex-shrink: 0;
}
.filter-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}
.filter-close-btn {
  background: none;
  border: none;
  padding: 4px;
  color: var(--ink-2);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

/* ─── Scrollable body ─── */
.filter-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.filter-body::-webkit-scrollbar { display: none; }

/* ─── Section within sheet ─── */
.filter-section {
  padding: 14px 0 6px;
  border-top: 1px solid var(--border);
}
.filter-section:first-child {
  border-top: none;
  padding-top: 0;
}
.filter-section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}

/* ─── Sort rows (custom radio-style) ─── */
.filter-sort-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
}
.filter-sort-row + .filter-sort-row {
  border-top: 1px solid var(--border);
}
.filter-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--chip-off);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms;
}
.filter-radio.selected { border-color: var(--brand); }
.filter-radio.selected::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
}
.filter-sort-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

/* ─── Chip row within sheet ─── */
/* Child chips reuse existing .chip and .chip.active — no changes to chip CSS */
.filter-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
}

/* ─── Sheet footer ─── */
.filter-footer {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--surface);
}
.filter-clear-btn {
  flex: 1;
  height: 44px;
  background: none;
  border: 1.5px solid var(--chip-off);
  border-radius: 99px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
}
.filter-apply-btn {
  flex: 2;
  height: 44px;
  background: var(--brand);
  border: none;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
.filter-apply-btn:active { opacity: 0.85; }

/* ─── Active filter indicator on funnel button ─── */
.filter-btn { position: relative; }
.filter-btn.has-filter::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 0;
  width: 7px;
  height: 7px;
  background: var(--brand);
  border-radius: 50%;
  border: 1.5px solid var(--bg);
}
```

---

### 7.4b — HTML: inject both filter sheets into `<body>`

Add both sheets as direct children of `<body>`, after the main app wrapper and before any existing modals/overlays. They must not be inside `#tab-walks` or `#tab-nearby` — they need to overlay the full screen.

**Walks filter sheet:**

```html
<div class="filter-backdrop" id="walks-filter-backdrop"></div>
<div class="filter-sheet" id="walks-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter walks">
  <div class="filter-handle"></div>
  <div class="filter-header">
    <span class="filter-title">Filter &amp; Sort</span>
    <button class="filter-close-btn" id="walks-filter-close" aria-label="Close">&#x2715;</button>
  </div>
  <div class="filter-body">

    <div class="filter-section">
      <div class="filter-section-label">Sort by</div>
      <div class="filter-sort-row" data-sort="distance">
        <div class="filter-radio selected" id="walks-sort-distance"></div>
        <span class="filter-sort-label">Distance</span>
      </div>
      <div class="filter-sort-row" data-sort="rating">
        <div class="filter-radio" id="walks-sort-rating"></div>
        <span class="filter-sort-label">Rating</span>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Radius</div>
      <div class="filter-chip-row" id="walks-radius-chips">
        <button class="chip" data-walks-radius="1">1 km</button>
        <button class="chip" data-walks-radius="3">3 km</button>
        <button class="chip active" data-walks-radius="5">5 km</button>
        <button class="chip" data-walks-radius="10">10 km</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Surface</div>
      <div class="filter-chip-row" id="walks-surface-chips">
        <button class="chip active" data-walks-surface="any">Any</button>
        <button class="chip" data-walks-surface="paved">Paved</button>
        <button class="chip" data-walks-surface="muddy">Muddy</button>
        <button class="chip" data-walks-surface="mixed">Mixed</button>
        <button class="chip" data-walks-surface="rocky">Rocky</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Environment</div>
      <div class="filter-chip-row" id="walks-env-chips">
        <button class="chip active" data-walks-env="any">Any</button>
        <button class="chip" data-walks-env="woodland">Woodland</button>
        <button class="chip" data-walks-env="coastal">Coastal</button>
        <button class="chip" data-walks-env="urban">Urban</button>
        <button class="chip" data-walks-env="moorland">Moorland</button>
        <button class="chip" data-walks-env="heathland">Heathland</button>
        <button class="chip" data-walks-env="open">Open</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Duration</div>
      <div class="filter-chip-row" id="walks-duration-chips">
        <button class="chip active" data-walks-duration="any">Any</button>
        <button class="chip" data-walks-duration="short">Short &lt;1hr</button>
        <button class="chip" data-walks-duration="medium">Medium 1&#x2013;2hr</button>
        <button class="chip" data-walks-duration="long">Long 2hr+</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Off-lead</div>
      <div class="filter-chip-row" id="walks-offlead-chips">
        <button class="chip active" data-walks-offlead="any">Any</button>
        <button class="chip" data-walks-offlead="full">Full off-lead</button>
        <button class="chip" data-walks-offlead="partial">Partial</button>
        <button class="chip" data-walks-offlead="none">On-lead only</button>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Difficulty</div>
      <div class="filter-chip-row" id="walks-difficulty-chips">
        <button class="chip active" data-walks-difficulty="any">Any</button>
        <button class="chip" data-walks-difficulty="easy">Easy</button>
        <button class="chip" data-walks-difficulty="moderate">Moderate</button>
        <button class="chip" data-walks-difficulty="hard">Hard</button>
      </div>
    </div>

  </div>
  <div class="filter-footer">
    <button class="filter-clear-btn" id="walks-filter-clear">Clear all</button>
    <button class="filter-apply-btn" id="walks-filter-apply">Show walks</button>
  </div>
</div>
```

**Radius chip default:** The active chip on page load should reflect `getSavedRadius()`. Set `.active` on the matching chip when the sheet initialises, not hardcoded to 5km.

**Nearby filter sheet:**

```html
<div class="filter-backdrop" id="nearby-filter-backdrop"></div>
<div class="filter-sheet" id="nearby-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter nearby places">
  <div class="filter-handle"></div>
  <div class="filter-header">
    <span class="filter-title">Filter &amp; Sort</span>
    <button class="filter-close-btn" id="nearby-filter-close" aria-label="Close">&#x2715;</button>
  </div>
  <div class="filter-body">

    <div class="filter-section">
      <div class="filter-section-label">Sort by</div>
      <div class="filter-sort-row" data-sort="distance">
        <div class="filter-radio selected" id="nearby-sort-distance"></div>
        <span class="filter-sort-label">Distance</span>
      </div>
      <div class="filter-sort-row" data-sort="rating">
        <div class="filter-radio" id="nearby-sort-rating"></div>
        <span class="filter-sort-label">Rating</span>
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-section-label">Radius</div>
      <div class="filter-chip-row" id="nearby-radius-chips">
        <button class="chip" data-nearby-radius="1">1 km</button>
        <button class="chip" data-nearby-radius="3">3 km</button>
        <button class="chip active" data-nearby-radius="5">5 km</button>
        <button class="chip" data-nearby-radius="10">10 km</button>
      </div>
    </div>

  </div>
  <div class="filter-footer">
    <button class="filter-clear-btn" id="nearby-filter-clear">Clear all</button>
    <button class="filter-apply-btn" id="nearby-filter-apply">Show venues</button>
  </div>
</div>
```

---

### 7.4c — JavaScript: filter sheet behaviour

Wire up both sheets. Replace the existing `['walks','nearby'].forEach(...)` radius picker handler with the following. Add to the existing DOMContentLoaded initialisation block.

**General open/close pattern (implement for both tabs — `tab` = `'walks'` or `'nearby'`):**

```js
function openFilterSheet(tab) {
  document.getElementById(tab + '-filter-backdrop').classList.add('open');
  document.getElementById(tab + '-filter-sheet').classList.add('open');
  document.body.style.overflow = 'hidden';
  syncFilterSheetState(tab);
}

function closeFilterSheet(tab) {
  document.getElementById(tab + '-filter-backdrop').classList.remove('open');
  document.getElementById(tab + '-filter-sheet').classList.remove('open');
  document.body.style.overflow = '';
}
```

**`syncFilterSheetState(tab)`** — called when the sheet opens to ensure radius chips reflect the current saved radius:

```js
function syncFilterSheetState(tab) {
  var r = getSavedRadius();
  var prefix = tab === 'walks' ? 'walks' : 'nearby';
  var radiusChips = document.querySelectorAll('[data-' + prefix + '-radius]');
  radiusChips.forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset[prefix + 'Radius'], 10) === r);
  });
}
```

**Funnel button click — update existing handler** (the existing `#walks-radius-btn` / `#nearby-radius-btn` handlers should now call `openFilterSheet` instead of toggling the old `.radius-picker`):

```js
document.getElementById('walks-radius-btn').addEventListener('click', function() {
  openFilterSheet('walks');
});
document.getElementById('nearby-radius-btn').addEventListener('click', function() {
  openFilterSheet('nearby');
});
```

**Close triggers (for each tab):**

```js
['walks', 'nearby'].forEach(function(tab) {
  document.getElementById(tab + '-filter-close').addEventListener('click', function() {
    closeFilterSheet(tab);
  });
  document.getElementById(tab + '-filter-backdrop').addEventListener('click', function() {
    closeFilterSheet(tab);
  });
});
```

**Sort row interaction (for each tab):**

```js
['walks', 'nearby'].forEach(function(tab) {
  var sheet = document.getElementById(tab + '-filter-sheet');
  sheet.querySelectorAll('.filter-sort-row').forEach(function(row) {
    row.addEventListener('click', function() {
      sheet.querySelectorAll('.filter-radio').forEach(function(r) { r.classList.remove('selected'); });
      row.querySelector('.filter-radio').classList.add('selected');
    });
  });
});
```

**Chip group single-select (runs for any chip row in a sheet — for each tab):**

```js
['walks', 'nearby'].forEach(function(tab) {
  var sheet = document.getElementById(tab + '-filter-sheet');
  sheet.querySelectorAll('.filter-chip-row').forEach(function(row) {
    row.addEventListener('click', function(e) {
      var btn = e.target.closest('button.chip');
      if (!btn) return;
      row.querySelectorAll('button.chip').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
});
```

**"Clear all" button:**

```js
document.getElementById('walks-filter-clear').addEventListener('click', function() {
  resetWalksFilterSheet();
});
document.getElementById('nearby-filter-clear').addEventListener('click', function() {
  resetNearbyFilterSheet();
});

function resetWalksFilterSheet() {
  // Sort: reset to Distance
  document.getElementById('walks-filter-sheet').querySelectorAll('.filter-radio').forEach(function(r) { r.classList.remove('selected'); });
  document.getElementById('walks-sort-distance').classList.add('selected');
  // All chip groups: select "Any" chip
  document.getElementById('walks-filter-sheet').querySelectorAll('.filter-chip-row').forEach(function(row) {
    row.querySelectorAll('button.chip').forEach(function(c) { c.classList.remove('active'); });
    var anyBtn = row.querySelector('[data-walks-surface="any"],[data-walks-duration="any"],[data-walks-offlead="any"],[data-walks-difficulty="any"],[data-walks-env="any"]');
    if (anyBtn) anyBtn.classList.add('active');
  });
  // Radius: reset to saved default
  syncFilterSheetState('walks');
}

function resetNearbyFilterSheet() {
  document.getElementById('nearby-filter-sheet').querySelectorAll('.filter-radio').forEach(function(r) { r.classList.remove('selected'); });
  document.getElementById('nearby-sort-distance').classList.add('selected');
  syncFilterSheetState('nearby');
}
```

---

### 7.4d — Apply logic: Walks tab

The "Show walks" button reads the sheet state, filters and sorts `WALKS_DB`, and re-renders the Walks tab.

```js
document.getElementById('walks-filter-apply').addEventListener('click', function() {
  var sheet = document.getElementById('walks-filter-sheet');

  // Read sort
  var sortRadio = sheet.querySelector('.filter-radio.selected');
  var sortRow = sortRadio ? sortRadio.closest('.filter-sort-row') : null;
  var activeSort = sortRow ? (sortRow.dataset.sort || 'distance') : 'distance';

  // Read radius
  var activeRadiusBtn = sheet.querySelector('[data-walks-radius].active');
  var activeRadius = activeRadiusBtn ? parseInt(activeRadiusBtn.dataset.walksRadius, 10) : getSavedRadius();
  saveRadius(activeRadius); // persist via existing saveRadius() / sniffout_radius key

  // Read filter chips
  var surfaceBtn    = sheet.querySelector('[data-walks-surface].active');
  var envBtn        = sheet.querySelector('[data-walks-env].active');
  var durationBtn   = sheet.querySelector('[data-walks-duration].active');
  var offleadBtn    = sheet.querySelector('[data-walks-offlead].active');
  var difficultyBtn = sheet.querySelector('[data-walks-difficulty].active');

  var activeSurface    = surfaceBtn    ? surfaceBtn.dataset.walksSurface    : 'any';
  var activeEnv        = envBtn        ? envBtn.dataset.walksEnv             : 'any';
  var activeDuration   = durationBtn   ? durationBtn.dataset.walksDuration   : 'any';
  var activeOffLead    = offleadBtn    ? offleadBtn.dataset.walksOfflead     : 'any';
  var activeDifficulty = difficultyBtn ? difficultyBtn.dataset.walksDifficulty : 'any';

  // Get user location
  var session = restoreSession ? restoreSession() : null;
  var lat = session && session.location ? session.location.lat : null;
  var lon = session && session.location ? session.location.lon : null;

  // Filter WALKS_DB
  var result = WALKS_DB.slice();

  if (lat && lon) {
    result = result.filter(function(w) {
      return haversineKm(lat, lon, w.lat, w.lon) <= activeRadius;
    });
  }
  if (activeSurface !== 'any')    result = result.filter(function(w) { return w.terrain === activeSurface; });
  if (activeEnv !== 'any')        result = result.filter(function(w) { return w.environment === activeEnv; });
  if (activeDuration === 'short') result = result.filter(function(w) { return w.duration < 60; });
  if (activeDuration === 'medium') result = result.filter(function(w) { return w.duration >= 60 && w.duration <= 120; });
  if (activeDuration === 'long')  result = result.filter(function(w) { return w.duration > 120; });
  if (activeOffLead !== 'any')    result = result.filter(function(w) { return w.offLead === activeOffLead; });
  if (activeDifficulty !== 'any') result = result.filter(function(w) { return w.difficulty === activeDifficulty; });

  // Sort
  if (activeSort === 'rating') {
    result.sort(function(a, b) { return b.rating - a.rating; });
  } else if (lat && lon) {
    result.sort(function(a, b) {
      return haversineKm(lat, lon, a.lat, a.lon) - haversineKm(lat, lon, b.lat, b.lon);
    });
  }

  // Render
  renderWalksTabWithResults(result, lat, lon);

  // Update active indicator
  updateWalksFilterIndicator();

  closeFilterSheet('walks');
});
```

**`renderWalksTabWithResults(result, lat, lon)`** — a new function (or a refactored call to the existing `renderWalksTab`) that renders the Sniffout Picks carousel from the supplied `result` array instead of the full `WALKS_DB`. If the existing `renderWalksTab` already accepts a walks array parameter, use it. If it always reads `WALKS_DB` directly, add a parameter for the walks list.

**Empty result handling:** If `result.length === 0`, render the following in the Sniffout Picks section:

```html
<div class="walks-empty">
  Nothing matching those filters right now.
  <span style="color:var(--brand);cursor:pointer" onclick="document.getElementById('walks-filter-clear').click();document.getElementById('walks-filter-apply').click()">Show all walks →</span>
</div>
```

**`updateWalksFilterIndicator()`:**

```js
function updateWalksFilterIndicator() {
  var sheet = document.getElementById('walks-filter-sheet');
  var btn = document.getElementById('walks-radius-btn');
  var isDefault =
    sheet.querySelector('.filter-radio.selected') === document.getElementById('walks-sort-distance') &&
    !sheet.querySelector('[data-walks-surface]:not([data-walks-surface="any"]).active') &&
    !sheet.querySelector('[data-walks-env]:not([data-walks-env="any"]).active') &&
    !sheet.querySelector('[data-walks-duration]:not([data-walks-duration="any"]).active') &&
    !sheet.querySelector('[data-walks-offlead]:not([data-walks-offlead="any"]).active') &&
    !sheet.querySelector('[data-walks-difficulty]:not([data-walks-difficulty="any"]).active');
  btn.classList.toggle('has-filter', !isDefault);
}
```

---

### 7.4e — Apply logic: Nearby tab

The "Show venues" button reads the sort selection, re-sorts the current `nearbyVenues` array, and re-renders. Radius change triggers a fresh fetch.

```js
document.getElementById('nearby-filter-apply').addEventListener('click', function() {
  var sheet = document.getElementById('nearby-filter-sheet');

  // Read sort
  var sortRadio = sheet.querySelector('.filter-radio.selected');
  var sortRow = sortRadio ? sortRadio.closest('.filter-sort-row') : null;
  var activeSort = sortRow ? (sortRow.dataset.sort || 'distance') : 'distance';

  // Read radius
  var activeRadiusBtn = sheet.querySelector('[data-nearby-radius].active');
  var activeRadius = activeRadiusBtn ? parseInt(activeRadiusBtn.dataset.nearbyRadius, 10) : getSavedRadius();
  var radiusChanged = activeRadius !== getSavedRadius();
  if (radiusChanged) {
    saveRadius(activeRadius);
    NEARBY_GOOGLE_CACHE = {};
  }

  // Get user location from session
  var session = restoreSession ? restoreSession() : null;
  var lat = session && session.location ? session.location.lat : null;
  var lon = session && session.location ? session.location.lon : null;

  // Sort nearbyVenues in place
  if (activeSort === 'rating') {
    nearbyVenues.sort(function(a, b) { return (b.rating || 0) - (a.rating || 0); });
  } else if (lat && lon) {
    nearbyVenues.sort(function(a, b) {
      return haversineKm(lat, lon, a.lat, a.lon) - haversineKm(lat, lon, b.lat, b.lon);
    });
  }

  // Update active indicator
  var nearbyBtn = document.getElementById('nearby-radius-btn');
  var sortIsDistance = sheet.querySelector('.filter-radio.selected') === document.getElementById('nearby-sort-distance');
  nearbyBtn.classList.toggle('has-filter', !sortIsDistance);

  if (radiusChanged) {
    // Re-fetch with new radius
    renderNearbyTab();
  } else {
    // Re-render current venues with new sort
    renderVenueList(nearbyVenues);
  }

  closeFilterSheet('nearby');
});
```

**Note on `rating` field for Nearby:** The Google Places New API returns `rating` on venue objects. Verify `places.rating` is included in the `X-Goog-FieldMask` header in `fetchNearbyPlaces`. If not, add it. The venue object constructor should map `p.rating` to `rating` on the venue object.

---

## FIX 7.5 — `saveRadius()` function check

The apply logic above calls `saveRadius(activeRadius)`. Verify this function exists in the codebase. If the codebase only has `getSavedRadius()` and writes directly to `localStorage.setItem('sniffout_radius', ...)`, create a thin wrapper:

```js
function saveRadius(km) {
  localStorage.setItem('sniffout_radius', km);
}
```

If it already exists under a different name, use that instead and note it in developer-notes.md.

---

## Confirm When Done

**Regression fix:**
- [ ] FIX 7.0: WALKS_DB badge values restored to `'Sniffout Pick'` (singular). `renderStateAPreviews()` filters on `'Sniffout Pick'`. Individual trail card badges show "Sniffout Pick".

**Card sizing:**
- [ ] FIX 7.1: Trail cards 240px wide, 180px photo, 2-line description excerpt visible
- [ ] FIX 7.2: Green space cards show left 64×64px thumbnail + name/distance/Maps link column. Total height ~80px.
- [ ] FIX 7.2: `.venue-card-photo-gp` on Nearby venue cards is unaffected

**Schema:**
- [ ] FIX 7.3: All 25 WALKS_DB entries have `environment` field. Values documented in developer-notes.md.

**Filter sheet:**
- [ ] FIX 7.4: Tapping funnel on Walks tab opens bottom sheet (not old inline radius picker)
- [ ] FIX 7.4: Tapping funnel on Nearby tab opens bottom sheet
- [ ] Walks sheet: all 6 filter groups visible and scrollable
- [ ] Walks sheet: "Clear all" resets all groups to defaults, does not close sheet
- [ ] Walks sheet: "Show walks" filters and re-renders Walks tab, closes sheet
- [ ] Walks sheet: empty result shows "Nothing matching those filters" with "Show all walks →" reset link
- [ ] Nearby sheet: "Show venues" re-sorts current venue list (or re-fetches if radius changed)
- [ ] Funnel button shows green dot when non-default filter is active (both tabs)
- [ ] Body scroll locked while sheet is open; restored on close
- [ ] `places.rating` included in Google Places field mask; venue objects have `rating` property

---

## Developer Documentation

Update `developer-notes.md` with sections covering:
- FIX 7.0: badge regression and fix
- FIX 7.1: trail card dimensions
- FIX 7.2: gs-card layout change (note `.venue-card-photo-gp` retained for venue cards)
- FIX 7.3: `environment` field — list every walk ID and the assigned value
- FIX 7.4: filter sheet — note function names used for `saveRadius`, `restoreSession`, `renderVenueList`, `renderNearbyTab`, and whether `renderWalksTab` was refactored to accept a walks array parameter
- FIX 7.5: whether `saveRadius()` existed or was added
