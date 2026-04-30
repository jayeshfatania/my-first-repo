# Nearby Tab Redesign - Feature Spec

**Status:** Ready for development
**Date:** April 30 2026
**Repo:** my-first-repo (sniffout-v2.html)
**Rounds:** Two. Round 1 is cosmetic and logic changes. Round 2 is structural rebuild (draggable sheet).

---

## Task A: Validation and flags

### Change 1: Category pills replacing tile grid
Validates cleanly. The tile grid is built dynamically in `renderNearbyTab()` by constructing `<div class="nearby-cat-grid" id="nearby-filter-row">`. It can be replaced with a pill rail in the same function. The `id="nearby-filter-row"` is referenced in `setNearbyView()` for hide/show when entering map mode - keep this id on the new pill rail container.

**Flag:** A second independent chip system exists for map view: `#nearby-map-cat-bar` (position: fixed, class `.nearby-cat-bar-chip`). It is populated by `setNearbyView('map')` and hidden/shown via `.visible`. In Round 1, the chip bar continues to serve map view and is unchanged. In Round 2, the chip bar becomes redundant (pills move into the sheet) and is removed.

### Change 2: Open/closed to time-specific text
Validates cleanly. The `isVenueOpenNow()` function (line 15800) returns `true | false | null`. The periods data from `regularOpeningHours` already includes `close.hour` and `close.minute`. No API changes needed. A new function `getVenueHoursLabel()` replaces direct calls to `isVenueOpenNow()` in the render layer. Do not modify `isVenueOpenNow()` as it may be referenced elsewhere.

**Flag:** Two render locations need updating: `renderVenueCard()` (line 16096) and `showNearbyMapCard()` (line 16370). Both call `isVenueOpenNow()` directly.

**Flag:** `businessStatus: "PERMANENTLY_CLOSED"` is not in the current Places API field mask and should not be added. Permanently closed venues return null `openingHours` and the field is correctly omitted. No action needed.

### Change 3: Draggable sheet (Round 2)
Structural rebuild - multiple dependencies flagged.

`setNearbyView()` (line 15834) manages the entire list/map toggle. It controls: `#nearby-list-view-btn`, `#nearby-map-view-btn`, `#nearby-map` visibility, `#nearby-venues` visibility, `#nearby-map-cat-bar`, `#nearby-filter-row`, `#nearby-toggle-row`. This function is removed in Round 2.

`nearbyView` state variable (line 15652) is referenced at lines 15840, 15950, 15630, 16411, 6869. All references must be cleaned up in Round 2.

`#nearbyMapFab` (map style switcher FAB) lives inside `#nearby-map`. Keep it. It remains useful with the always-visible map.

`showTab()` function contains a block (lines 6863-6869) that hides `#nearby-map-cat-bar` on tab switch and shows it when returning to Nearby in map mode. Remove this block in Round 2.

`nearbyNavBtn` click handler calls `nearbyMap.invalidateSize()` conditionally on `nearbyView === 'map'`. In Round 2, the condition is removed - always call `invalidateSize()`.

**Unresolved layout decision for Round 2:** The radius filter button (`#nearby-radius-btn`) and the location name/search (`#nearby-location-line`, `#nearby-location-search`) need a home in the new layout. Resolution: keep a minimal header bar above the map containing only the location line (tappable) and the radius filter button. The existing `#nearby-location-search` panel drops below this bar when active. This matches the Citymapper/Google Maps pattern.

### Change 4: Remove dog-friendly info banner
Validates cleanly. The banner is built in `renderVenueList()` via `tipHtml` (line 16051) and updated on category change in `setNearbyCategory()` via `#nearby-tip-card` (line 15935). Remove both blocks and the `.venue-cat-tip` / `.venue-cat-tip-text` CSS. Once `NEARBY_TIP_TEXT` has no remaining uses (after Saved is removed), delete the constant.

### Change 5: Remove Saved category
Validates cleanly. Critical preservation note below.

Elements to remove:
- `{ id: 'saved', label: 'Saved' }` from `CATEGORIES` array (line 15691)
- `TILE_CONFIG.saved` in `renderNearbyTab()` (line 15966)
- `CATEGORY_CHIP_ICON.saved` (line 15709)
- `if (cat === 'saved')` branch in `setNearbyCategory()` (line 15940)
- `if (nearbyCategory === 'saved')` branch in `renderNearbyTab()` (line 15997)
- `if (nearbyCategory === 'saved') renderSavedVenueList();` in `toggleGreenspaceFavourite()` (line 12168) - remove this line only
- `if (nearbyCategory === 'saved') { renderSavedVenueList(); }` in `togglePlaceFavourite()` (line 12215) - remove this conditional block; keep the `else` branch (which calls `renderVenueList()`)
- `NEARBY_SECTION_LABELS.saved`
- `NEARBY_TIP_TEXT.saved` (and the entire constant after the banner is also removed)

**Critical: do NOT delete `renderSavedVenueList()`.** It is called by the Me tab (line 14075) to render the Saved Places subpage. Removing it breaks Me tab.

**Simplification:** The fullscreen chips filter at line 16283 uses `CATEGORIES.filter(function(c) { return c.id !== 'saved'; })`. Once 'saved' is removed from CATEGORIES, this filter can be simplified to `CATEGORIES.map(...)`.

---

## Task B: Open questions resolved

**B1. Default sheet state before any category is selected**
Sheet opens at Peek. Sheet header shows the pill rail (no pill active) and the text "Select a category". Map shows with a "you are here" pin only, no venue pins. No Places API call fires on tab load. `nearbyCategory` should be set to `null` on tab load in Round 2 so no pill appears pre-selected. Remove the existing auto-fetch in `renderNearbyTab()` - fetches fire only on explicit pill tap.

**B2. When a category pill is tapped - does the sheet snap?**
Yes. Snap to Mid automatically on pill tap, simultaneously with the fetch starting. This makes the loading spinner visible and gives the user space to see results. Staying at Peek would hide the spinner below the fold.

**B3. When a map pin is tapped and sheet is at Peek - does it snap to Mid?**
Yes. Snap to Mid and scroll the sheet list to the matching card. The card receives a brief highlight (background flash or outline pulse, 1.5s duration). Peek is too short to show the card.

**B4. Empty state when location is not set**
Sheet stays at Peek. Pill rail is hidden (location required to use categories). Sheet body shows: "Set your location on the Today tab to find places near you." Map initialises but centres on the existing app fallback location. This matches the existing empty state behaviour on the Nearby tab.

**B5. Loading state while places are fetched**
Sheet is at Mid (snapped on pill tap). Sheet body shows the existing loading spinner and "Finding [category] near you..." text. Reuse existing loading HTML from `renderVenueList()`. No new loading UI needed.

**B6. Edge cases for open/closed times**
- Overnight hours (e.g. closes 02:00): already handled by `closeDay !== openDay` logic in `isVenueOpenNow()`. `getVenueHoursLabel()` must preserve this. "Closes at 02:00" is a correct output.
- No hours data (`openingHours === null`): return `null`, omit the field. No fallback text.
- 24/7 venues (period exists with no `close` field): detect by `!p.close`. Show "Open 24 hours" in green. Do not show "Closes at 24:00".
- Permanently closed: `openingHours` will be null. Field is omitted. No action needed.
- "Opens at" calculation: scan forward up to 7 days from now to find the earliest upcoming open period. If no period is found, return `null` and show nothing. Never guess.

---

## Task C: Round split

**Round 1 - cosmetic and logic changes (lower risk)**

All changes are within existing functions or replace small render blocks. No structural layout changes. Map/list toggle stays. Each task can be tested independently without touching the others.

- Task 1: Category pills (replaces tile grid, same container)
- Task 2: Remove Saved category
- Task 3: Remove dog-friendly info banner
- Task 4: Open/closed time-specific text

**Round 2 - structural rebuild**

The draggable sheet introduces a new DOM layer structure, touch event handling, snap animation, and changes to tab init. It cannot be done incrementally - it replaces the list/map toggle architecture entirely. Keeping it separate means Round 1 improvements are live and regression-free if Round 2 needs to be rolled back or revised.

- Task 5: Always-visible map + draggable sheet (new DOM, new CSS, new JS)
- Task 6: Eager map init
- Task 7: Map pin to card scroll and highlight
- Task 8: Remove redundant elements (chip bar, fullscreen overlay)

---

## Round 1 Developer spec

### Task 1: Replace tile grid with pill rail

**What to change:**

In `renderNearbyTab()`, replace the `<div class="nearby-cat-grid" id="nearby-filter-row">` block with a horizontal pill rail. Remove the `TILE_CONFIG` object (local to this function, tile-specific).

New pill rail HTML (to generate from CATEGORIES, excluding 'saved'):

```
<div class="nearby-pill-rail" id="nearby-filter-row">
  <!-- one button per category -->
  <button class="nearby-pill [active class if selected]" data-nearby-cat="[id]" onclick="setNearbyCategory('[id]')">
    [icon] [label]
  </button>
</div>
```

In `setNearbyCategory()`, replace `.nearby-cat-tile--active` toggling with `.nearby-pill--active` toggling on `[data-nearby-cat]` elements.

**CSS to add (replace `.nearby-cat-grid` and `.nearby-cat-tile` rules):**

```css
.nearby-pill-rail {
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 16px 12px;
  flex-wrap: nowrap;
}
.nearby-pill-rail::-webkit-scrollbar { display: none; }

.nearby-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  font: 600 13px/1 'Plus Jakarta Sans', sans-serif;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.nearby-pill:active { transform: scale(0.97); }
.nearby-pill--active {
  background: #2C4A14;
  border-color: #2C4A14;
  color: #fff;
}
body.night .nearby-pill {
  background: var(--surface);
  border-color: rgba(255,255,255,0.12);
  color: var(--ink);
}
body.night .nearby-pill--active {
  background: #3D6B22;
  border-color: #3D6B22;
  color: #fff;
}
```

**Acceptance criteria:**
- 4 pills visible on load (Pubs, Cafes, Pet Shops, Vets). No Saved pill.
- Rail scrolls horizontally. No wrapping.
- Active pill fills brand green (#2C4A14), white text.
- Inactive pill has hairline border, ink text.
- Tap feedback: scale(0.97) on :active.
- On category tap, the active pill updates correctly.
- Map view chip bar (`#nearby-map-cat-bar`) is unaffected.
- Remove `.nearby-cat-grid` and `.nearby-cat-tile*` CSS rules once tile grid is gone.

---

### Task 2: Remove Saved category

**What to change:**

1. `CATEGORIES` array: remove `{ id: 'saved', label: 'Saved' }`.
2. `CATEGORY_CHIP_ICON`: remove `saved: luIcon('bookmark', 15)`.
3. `renderNearbyTab()`: remove `TILE_CONFIG.saved` entry.
4. `setNearbyCategory()`: remove `if (cat === 'saved') { ... renderSavedVenueList(); ... }` branch and its else wrapper. The function should handle only the API-fetch path after this.
5. `renderNearbyTab()`: remove `if (nearbyCategory === 'saved') { renderSavedVenueList(); return; }` branch.
6. `toggleGreenspaceFavourite()` (line 12168): remove the line `if (nearbyCategory === 'saved') renderSavedVenueList();`.
7. `togglePlaceFavourite()` (line 12215): remove `if (nearbyCategory === 'saved') { renderSavedVenueList(); } else {` and its closing brace, leaving `renderVenueList();` unconditional.
8. `NEARBY_SECTION_LABELS`: remove `saved` key.
9. Fullscreen chips line 16283: remove `.filter(function(c) { return c.id !== 'saved'; })` since 'saved' is no longer in CATEGORIES.

**Do not touch `renderSavedVenueList()`. It is used by the Me tab.**

**Acceptance criteria:**
- Nearby tab shows 4 category options only: Pubs, Cafes, Pet Shops, Vets.
- No Saved option anywhere on the Nearby tab.
- Me tab Saved Places subpage continues to render correctly.
- Saving or unsaving a venue does not call `renderSavedVenueList()` from the Nearby tab code path.

---

### Task 3: Remove dog-friendly info banner

**What to change:**

1. In `renderVenueList()`: remove the `tipText`, `infoIconSVG`, and `tipHtml` variable declarations and remove `tipHtml +` from the `el.innerHTML` assignment.
2. In `setNearbyCategory()`: remove the `tipEl` block (locates `#nearby-tip-card` and updates `.venue-cat-tip-text`). Approximately lines 15934-15936.
3. Remove CSS rules: `.venue-cat-tip`, `.venue-cat-tip-text`, `body.night .venue-cat-tip`, `body.night .venue-cat-tip-text`.
4. Remove `NEARBY_TIP_TEXT` constant entirely (no remaining uses after Tasks 2 and 3).

**Acceptance criteria:**
- No info banner appears below categories when a category is selected.
- `#nearby-tip-card` element never rendered.
- Venue list renders immediately below pill rail and count line with no gap where banner was.

---

### Task 4: Open/closed time-specific text

**What to change:**

Add a new function `getVenueHoursLabel(openingHours)` immediately after `isVenueOpenNow()`. This function returns an object: `{ label: String | null, state: 'open' | 'closed' | null }`.

Function logic:

```
getVenueHoursLabel(openingHours):
  if (!openingHours || !openingHours.length): return { label: null, state: null }

  now = new Date()
  today = now.getDay()  // 0=Sunday
  nowMins = now.getHours() * 60 + now.getMinutes()

  // Step 1: Check if open now and find current period's close time
  for each period in openingHours:
    if period has no open: continue
    openDay = period.open.day
    openMins = period.open.hour * 60 + (period.open.minute || 0)
    closeDay = period.close ? period.close.day : openDay
    closeMins = period.close ? period.close.hour * 60 + (period.close.minute || 0) : null

    if !period.close:
      // 24/7 period
      if openDay === today and nowMins >= openMins:
        return { label: 'Open 24 hours', state: 'open' }

    // Overnight period (spans midnight)
    if closeDay !== openDay:
      prevDay = (today + 6) % 7
      if openDay === prevDay and nowMins < closeMins:
        // Currently in the overnight portion
        h = period.close.hour, m = period.close.minute || 0
        return { label: 'Closes at ' + pad(h) + ':' + pad(m), state: 'open' }
      if openDay === today and nowMins >= openMins:
        h = period.close.hour, m = period.close.minute || 0
        return { label: 'Closes at ' + pad(h) + ':' + pad(m), state: 'open' }
    else:
      // Same-day period
      if openDay === today and nowMins >= openMins and nowMins < closeMins:
        h = period.close.hour, m = period.close.minute || 0
        return { label: 'Closes at ' + pad(h) + ':' + pad(m), state: 'open' }

  // Step 2: Closed now - find next open time (scan up to 7 days forward)
  for d = 0 to 6:
    checkDay = (today + d) % 7
    checkMins = (d === 0) ? nowMins : 0
    candidates = openingHours where period.open.day === checkDay and (period.open.hour * 60 + (period.open.minute || 0)) > checkMins
    sort candidates by open time ascending
    if candidates.length > 0:
      p = candidates[0]
      h = p.open.hour, m = p.open.minute || 0
      return { label: 'Opens at ' + pad(h) + ':' + pad(m), state: 'closed' }

  return { label: null, state: null }

pad(n): return n < 10 ? '0' + n : '' + n
```

In `renderVenueCard()`, replace:
```js
var openHtml = '';
var _openNow = isVenueOpenNow(venue.openingHours);
if (_openNow === true)  openHtml = '<span class="venue-open-gp open">Open now</span>';
if (_openNow === false) openHtml = '<span class="venue-open-gp closed">Closed</span>';
```
with:
```js
var openHtml = '';
var _hours = getVenueHoursLabel(venue.openingHours);
if (_hours.label) {
  var openClass = _hours.state === 'open' ? 'open' : 'closing-soon';
  openHtml = '<span class="venue-open-gp ' + openClass + '">' + _hours.label + '</span>';
}
```

In `showNearbyMapCard()`, replace the `_openNowDetail` block with the same `getVenueHoursLabel()` call.

**CSS to update:**

Update `.venue-open-gp.open` and `.venue-open-gp.closed` rules. Add `.venue-open-gp.closing-soon`:
```css
.venue-open-gp.open       { color: #2D7A3A; font-weight: 600; font-size: 12px; }
.venue-open-gp.closing-soon { color: #D97706; font-weight: 600; font-size: 12px; }
/* .venue-open-gp.closed is now unused - remove it */
```

**Acceptance criteria:**
- Open venue shows "Closes at HH:MM" in green.
- Closed venue shows "Opens at HH:MM" in amber.
- 24/7 venue shows "Open 24 hours" in green.
- Venue with no hours data shows nothing (no fallback text, no empty element).
- Overnight close time displays correctly ("Closes at 02:00" when venue closes after midnight).
- Text appears in venue cards and in the map pop-up card.
- No em dashes in any string.

---

## Round 2 Developer spec

### Task 5: Always-visible map + draggable sheet

**New DOM structure for `#tab-nearby`:**

Replace the existing contents of `#tab-nearby` with the following structure:

```html
<div id="tab-nearby" class="tab-panel nearby-sheet-layout">

  <!-- Slim header: location + radius filter only -->
  <div class="nearby-slim-header" id="nearby-slim-header">
    <div class="tab-subtitle location-line" id="nearby-location-line" style="display:none;">
      [location pin SVG]
      <span id="nearby-location-name"></span>
      [chevron SVG]
    </div>
    <button class="filter-btn" id="nearby-radius-btn" aria-label="Filter by radius">
      [filter SVG]
    </button>
  </div>

  <!-- Location search (hidden by default, drops below slim header) -->
  <div id="nearby-location-search" style="display:none; padding:0 16px 12px;">
    [existing search input HTML unchanged]
  </div>

  <!-- Map fills remaining height -->
  <div id="nearby-map">
    <div class="map-fab-container" id="nearbyMapFab">
      [existing FAB HTML unchanged]
    </div>
  </div>

  <!-- Draggable sheet -->
  <div id="nearby-sheet" class="nearby-sheet" aria-label="Nearby places">
    <div class="nearby-sheet-handle" id="nearby-sheet-handle" aria-hidden="true"></div>
    <div class="nearby-sheet-header" id="nearby-sheet-header">
      <!-- pill rail rendered here by JS (same HTML as Round 1) -->
      <div class="nearby-pill-rail" id="nearby-filter-row"></div>
      <div class="nearby-toggle-row" id="nearby-toggle-row">
        <span class="nearby-section-label" id="nearby-section-label"></span>
        <span class="nearby-count" id="nearby-count"></span>
      </div>
    </div>
    <div class="nearby-sheet-body" id="nearby-venues">
      <!-- venue cards rendered here -->
    </div>
  </div>

</div>
```

**CSS:**

```css
.nearby-sheet-layout {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nearby-slim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  flex-shrink: 0;
  z-index: 20;
  background: var(--bg);
}

/* Map fills all remaining space below slim header */
#nearby-map {
  flex: 1;
  min-height: 0;
  position: relative;
  display: block; /* always visible - remove .visible toggle */
}

/* Sheet sits over the map */
.nearby-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--bg);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.10);
  will-change: transform;
  touch-action: none; /* prevent scroll conflict on handle */
  /* default: peek position set by JS on init */
}

body.night .nearby-sheet {
  background: var(--surface);
  box-shadow: 0 -2px 16px rgba(0,0,0,0.35);
}

.nearby-sheet-handle {
  width: 36px;
  height: 4px;
  background: rgba(0,0,0,0.15);
  border-radius: 2px;
  margin: 10px auto 6px;
}
body.night .nearby-sheet-handle { background: rgba(255,255,255,0.18); }

.nearby-sheet-header {
  padding: 0 0 4px;
  flex-shrink: 0;
}

.nearby-sheet-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  /* height controlled by snap position */
}
```

**Snap positions (JS):**

Define three snap positions as pixel values from the bottom of `#tab-nearby`:

```
PEEK_HEIGHT  = 140   // handle + pill rail + first card top edge visible
MID_HEIGHT   = viewport.height * 0.50   // 50% of tab panel
FULL_HEIGHT  = viewport.height * 0.90   // 90% of tab panel
```

Apply snap by setting `sheet.style.transform = 'translateY(' + (sheetFullHeight - snapHeight) + 'px)'`

Sheet height is always 100% of `#tab-nearby` minus the slim header. `sheetFullHeight` = sheet offsetHeight. When at Peek, `translateY = sheetFullHeight - PEEK_HEIGHT`. When at Full, `translateY = sheetFullHeight - FULL_HEIGHT`.

Animate between snaps: `transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)`.

**Touch handling (attach to `#nearby-sheet-handle`):**

```
touchstart: record startY = touch.clientY, startTransform = current translateY value
touchmove: delta = touch.clientY - startY, apply translateY = startTransform + delta (no transition)
touchend: 
  velocity = delta / elapsed
  current = startTransform + totalDelta
  snapTo nearest of [PEEK, MID, FULL] (in translateY terms) based on current position and velocity
  animate to snap with spring transition
```

Sheet body (`#nearby-venues`) is scrollable. Dragging the handle always moves the sheet. Dragging within the body: if sheet is not at Full, drag handle behaviour. If sheet is at Full and body is scrolled to top, downward drag starts sheet movement.

**`renderNearbyTab()` updates:**

- Build pill rail (same as Round 1) inside `#nearby-filter-row`.
- Set sheet to Peek on load.
- Call `initNearbyMap(lat, lon)` immediately (not lazy).
- `nearbyCategory` = null on load. No auto-fetch.
- If no location: hide pill rail, show "Set your location on the Today tab to find places near you." in `#nearby-venues`.

**`setNearbyCategory()` updates:**

- Snap sheet to Mid on pill tap (before fetch completes).
- Otherwise logic unchanged.

**Remove:** `setNearbyView()` function and `nearbyView` state variable and all references.

**Remove:** `#nearby-list-view-btn`, `#nearby-map-view-btn` HTML and CSS.

**Acceptance criteria:**
- Map always visible behind sheet on Nearby tab load.
- Sheet starts at Peek showing pill rail and no results.
- Tapping a pill snaps sheet to Mid and shows loading state.
- Dragging handle snaps to Peek / Mid / Full.
- Sheet body scrolls independently when at Full.
- Spring animation on snap release (cubic-bezier(0.34, 1.56, 0.64, 1)).
- Drag handle visible (grey pill, centred).
- No list/map toggle buttons.
- Map style FAB continues to work.
- Radius filter button retained in slim header.

---

### Task 6: Eager map init

**What to change:**

1. In `renderNearbyTab()`: call `initNearbyMap(lat, lon)` directly after setting up the DOM structure. Remove the `nearbyHasFetched` auto-fetch block entirely. Fetches fire only from `setNearbyCategory()`.
2. In `initNearbyMap()`: remove the guard that only runs in map view. Map is now always active.
3. Remove the `nearbyNavBtn` click handler that conditionally calls `nearbyMap.invalidateSize()`. Instead, call `nearbyMap.invalidateSize()` unconditionally from that handler.
4. Remove the `setNearbyView()` call chain from `#nearby-map-cat-bar` logic in `showTab()` (lines 6863-6869).

**Acceptance criteria:**
- Map initialises and shows "you are here" pin when Nearby tab is opened, before any category is tapped.
- Switching away from Nearby tab and back does not re-init the map or re-fetch places.
- Map size recalculates correctly on tab switch.

---

### Task 7: Map pin to card scroll and highlight

**What to change:**

1. In `renderVenueCard()`: add `id="nearby-card-[venue.id]"` to the outermost element of each rendered card. `venue.id` is the existing `id` field on the venue object (e.g. `'gp-0'`).

2. In `updateMapMarkers()`: replace the `L.marker` click handler (currently calls `showNearbyMapCard(venue)`) with:
```js
marker.on('click', function() {
  snapSheetToMid();
  var cardEl = document.getElementById('nearby-card-' + venue.id);
  if (cardEl) {
    var sheetBody = document.getElementById('nearby-venues');
    if (sheetBody) sheetBody.scrollTop = cardEl.offsetTop - 8;
    cardEl.classList.add('nearby-card--highlighted');
    setTimeout(function() { cardEl.classList.remove('nearby-card--highlighted'); }, 1500);
  }
});
```

3. Add `snapSheetToMid()` helper function that sets the sheet translateY to the Mid position with animation.

4. Add CSS for highlight state:
```css
.nearby-card--highlighted {
  outline: 2px solid #2C4A14;
  outline-offset: -2px;
  border-radius: 16px;
  transition: outline 0.3s ease;
}
```

5. Remove `showNearbyMapCard()`, `dismissNearbyMapCard()`, and `#nearbyMapCard` HTML element. These belonged to the old map overlay card.

**Acceptance criteria:**
- Tapping a map pin scrolls the sheet list to the matching card.
- If sheet is at Peek, it snaps to Mid before scrolling.
- Tapped card receives a brief green outline highlight that fades after 1.5s.
- No map pop-up card overlay appears.

---

### Task 8: Remove redundant elements

**What to remove:**

**`#nearby-map-cat-bar`:**
- Remove HTML (fixed-position chip bar, line 1949-1971 area)
- Remove `.nearby-cat-bar-chip` and `#nearby-map-cat-bar` CSS rules
- Remove all JS references: `catBar` variables in `setNearbyView()` and `showTab()`

**`#nearby-map-fullscreen` overlay:**
- Remove HTML (lines 6069-6076, the `#nearby-map-fullscreen` div and its children)
- Remove `.nearby-map-fullscreen-*`, `.nearby-map-fs-close`, `.nearby-map-card`, `.fs-map-chip` CSS rules
- Remove JS: `openNearbyMapFullscreen()`, `closeNearbyMapFullscreen()`, `setNearbyFsCategory()`, `renderNearbyFsMarkers()`, `nearbyFsMap`, `nearbyFsCategory`, `nearbyFsSelectedId` variables
- Remove `#nearbyFsClose` event handler

**Acceptance criteria:**
- No fullscreen map overlay exists in the DOM.
- No fixed-position chip bar appears anywhere.
- Tab switching produces no console errors from missing elements.
- Removing these elements causes no regression in the Me tab, Today tab, Weather tab, or Walks tab.

---

## Task F: Risk summary

**Regression risks:**

Round 1 carries low regression risk. Tasks 2 and 5 (Saved removal) share a critical dependency: `renderSavedVenueList()` must not be deleted as it powers the Me tab Saved Places view. The two `nearbyCategory === 'saved'` checks in `toggleGreenspaceFavourite()` and `togglePlaceFavourite()` (lines 12168, 12215) are the most likely source of a regression if missed - they are not obviously nearby-related from their location in the file.

Round 2 carries high regression risk due to the volume of JS being removed. `setNearbyView()` and `nearbyView` are referenced across six or more locations. A missed reference will cause a silent failure or console error. Recommend grepping for `nearbyView` and `setNearbyView` after the round to confirm no stale references remain.

The draggable sheet touch handler must be tested on a real iOS device. The overscroll behaviour and `touch-action` rules interact differently between browsers and OS versions. The CLAUDE.md spring animation `cubic-bezier(0.34, 1.56, 0.64, 1)` must be applied exactly as specified.

**Cost risks:**

The Places API call pattern is unchanged. Calls fire only on explicit category pill tap. The `nearbyHasFetched` guard that prevented re-fetch on tab switch is removed in Round 2 (replaced by explicit pill-only fetch). The `isFetching` 500ms debounce in `setNearbyCategory()` remains and must not be removed. Rapid pill-tapping is the primary cost risk. Confirm the debounce is intact after Round 2.

The map eager init (Task 6) initialises the Leaflet map on Nearby tab load rather than waiting for a map toggle. This adds a small CPU cost on tab open but incurs no additional API charges (Leaflet uses OS Maps tiles which are flat-rate, not pay-per-call).

**Requires owner sign-off before Round 2 development starts:**

1. Confirm the `#nearby-map-fullscreen` overlay can be retired. It is the full-screen map mode that currently exists as a separate overlay. The draggable sheet "Full" position is its replacement, but this needs explicit sign-off since it is a feature removal.
2. Confirm the location search UI (`#nearby-location-search`) stays triggered from the slim header location line, not moved into the sheet. The current spec keeps it above the map - confirm this is acceptable.
