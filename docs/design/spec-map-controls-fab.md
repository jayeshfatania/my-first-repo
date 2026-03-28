# Map Controls FAB — Design Spec
**Date:** 2026-03-27
**Status:** Designer-approved. Ready for Developer implementation.
**Author:** Designer agent
**Scope:** Unify all map controls (map style toggle + walk filter) into a single expandable floating action button across Walks map and Nearby map views.

---

## Code reading notes

Before the spec, key structural findings from reading the file:

- `.walks-inmap-filter` (lines 1624-1638): `position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); z-index: 400; display: none`. Two pill buttons: "Sniffout Picks" and "Green spaces". Currently shown/hidden by `setWalksView()` at line 12356.
- `.walks-inmap-btn` (lines 1639-1662): 34px height, `padding: 0 14px`, `border-radius: var(--radius-pill)`, active state `background: var(--brand); color: #FFFFFF`.
- `.map-style-row` (lines 3659-3662): wrapper `display: none; margin-bottom: 12px`. Contains `.map-style-control` segmented toggle.
- `.map-style-control` (lines 3663-3688): 2-column grid, 160px wide, 34px height, white card surface with sliding pill animation via `.map-style-btn.active`.
- HTML `#walks-map-style-row` at line 4744, `#walksInmapFilter` at line 4753, `#nearby-map-style-row` at line 4822.
- Walk detail: static map style segmented control at lines 5378-5388, inside `.walk-detail-map-section`, above the 180px map. A distinct, simpler control — not wired to the same `applyMapStyleControl` pattern.
- `setWalksMapFilter(mode)` at lines 12303-12310: sets `walksMapFilter`, updates button active classes, calls `renderWalksMapPins()`.
- `setMapStyle(style)` at lines 12754-12768: saves style preference, swaps tile layers on all three map instances (nearby, walks, walk detail), calls `applyMapStyleControl` for all three controls.
- `applyMapStyleControl(controlId, style)` at lines 12730-12740: applies `.active` class and shifts sliding pill left/right.
- `setWalksView(mode)` at lines 12312-12362: when switching to `'map'`, sets `display: block` on `#walks-map-style-row` (line 12357) and `display: flex` on `#walksInmapFilter` (line 12356). Reverses on list view.
- `setNearbyView(mode)` at lines 12961+: shows/hides `#nearby-map-style-row` (line 12985) and `#nearby-map-cat-bar` (line 12988) for map view.
- `.nearby-cat-bar-chip` (lines 1903-1922): **category navigation chips** — not a layers control. These must not be absorbed into the FAB. They remain as-is.

---

## Design decision

The current map view presents controls in two separate floating panels stacked vertically: a segmented style toggle above, and a filter chip row below. The two controls are visually unrelated — different components, different positions, different interaction patterns. On a narrow mobile viewport with a map background, this creates visual clutter and no obvious relationship between the controls.

A single expandable FAB consolidates all map configuration into one point. The pattern is well-established (Google Maps, Apple Maps). The collapsed state is a small, unobtrusive button. The expanded state reveals grouped options in a compact panel anchored to the button. Tapping outside collapses it.

**What the FAB controls (both Walks and Nearby maps):**
1. Map style — Standard / OS Map (existing toggle)
2. Walk filter — All walks / Sniffout Picks / Green spaces (Walks map only; hidden from FAB when in Nearby)

**What it does not control:**
- Category navigation chips on Nearby map (`.nearby-cat-bar-chip`) — those are content navigation, not map configuration

---

## 1 — Collapsed button design

The collapsed FAB is a 44×44px circular button, positioned `bottom: 72px, right: 12px` in the map container. `72px` clears the bottom nav bar (64px) with 8px breathing room.

```
visual appearance:
  shape:      circle, 44×44px
  background: rgba(255,255,255,0.92)
  border:     1px solid rgba(0,0,0,0.10)
  box-shadow: 0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)
  icon:       luIcon('layers', 20), color: var(--brand) (#2C4A14)
  backdrop:   backdrop-filter: blur(8px)
```

The layers icon is universally understood as "map layers / display options". No label is needed. The frosted-glass treatment (white at 92% opacity + blur) lifts the button above map tiles without harsh contrast.

**Active/open state:** While expanded, the icon rotates 180° and the button background deepens slightly:
- `background: rgba(255,255,255,0.98)`
- icon: `luIcon('x', 20)` replaces layers icon (clearer affordance to close)

---

## 2 — Expanded state design

Tapping the FAB opens a panel anchored to the bottom-right, positioned immediately above the FAB with 8px gap. The panel is a frosted card.

```
panel visual:
  background:    rgba(255,255,255,0.95)
  border:        1px solid rgba(0,0,0,0.09)
  border-radius: var(--radius-lg)  /* 20px */
  box-shadow:    0 4px 20px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)
  backdrop:      backdrop-filter: blur(12px)
  padding:       10px 0
  width:         190px
  position:      anchored bottom-right relative to FAB
```

**Panel structure — two groups:**

Group 1 (always present in both Walks and Nearby):
```
  Map style
  ─────────
  [✓ Standard]     ← active when standard selected
  [   OS Map  ]
```

Group 2 (Walks map only — hidden in Nearby):
```
  Walk filter
  ───────────
  [✓ All walks ]
  [  Sniffout Picks]
  [  Green spaces  ]
```

A 1px divider (`rgba(0,0,0,0.07)`) separates Group 1 from Group 2.

**Row design:**
```
  height:      40px
  padding:     0 14px
  display:     flex; align-items: center; gap: 10px
  font-size:   14px; font-weight: 500; color: var(--ink)
  cursor:      pointer
  transition:  background 0.1s ease
```

Active row (selected option):
```
  color:       var(--brand)
  checkmark:   luIcon('check', 14) shown at left (replaces gap space)
```

Inactive row:
```
  color:       var(--ink-2)
  no icon at left, padded to align with checkmark width
```

Row `:active` state:
```
  background: rgba(0,0,0,0.04)
```

**Group label:**
```
  height:      30px
  padding:     0 14px
  font-size:   10px
  font-weight: 600
  letter-spacing: 0.06em
  text-transform: uppercase
  color:       var(--ink-3)   /* rgba(0,0,0,0.35) */
  display:     flex; align-items: flex-end; padding-bottom: 4px
```

---

## 3 — Animation and transition

**Opening:**
- Panel expands from bottom-right origin (scale from 0.85→1.0, opacity 0→1)
- Duration: 220ms
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring — consistent with bottom sheets)
- Transform origin: `bottom right`
- FAB icon: crossfade layers→x icon, rotate 0→180deg, 180ms ease

**Closing:**
- Panel collapses: scale 1.0→0.9, opacity 1→0
- Duration: 150ms
- Easing: `cubic-bezier(0.4, 0, 1, 1)` (ease-in — snappy close)
- Transform origin: `bottom right`
- FAB icon: crossfade x→layers icon, rotate 180→0deg, 150ms ease

**Option selection:**
- Checkmark swaps to selected row: opacity 0→1, 120ms ease
- Panel does NOT auto-close on selection — user taps the FAB (or outside) to close. This allows selecting multiple options (e.g. style then filter) without re-opening.

**Click-outside-to-close:**
- A transparent overlay covers the entire screen behind the panel (z-index lower than panel, higher than map)
- Tapping the overlay closes the panel
- The overlay has no visible background — it exists only to capture touches

---

## 4 — Night mode

All colours adapt via `body.night`:

```css
body.night .map-fab-btn {
  background: rgba(31,31,31,0.92);
  border-color: rgba(255,255,255,0.10);
  box-shadow: 0 2px 10px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25);
  /* layers icon: color: var(--brand) which resolves to #5C7A63 in night mode */
}

body.night .map-fab-btn--open {
  background: rgba(31,31,31,0.98);
}

body.night .map-fab-panel {
  background: rgba(28,28,28,0.96);
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.30);
}

body.night .map-fab-panel-label {
  color: rgba(255,255,255,0.30);
}

body.night .map-fab-panel-row {
  color: var(--ink-2);  /* resolves to #8A8A8A */
}

body.night .map-fab-panel-row--active {
  color: var(--brand);  /* resolves to #5C7A63 */
}

body.night .map-fab-panel-row:active {
  background: rgba(255,255,255,0.05);
}

body.night .map-fab-divider {
  background: rgba(255,255,255,0.07);
}
```

---

## 5 — Walk detail map recommendation

**Recommendation: do not add FAB to the walk detail map.**

The walk detail map is 180px tall and occupies a fixed section within a scrollable detail page. It is a read-only orientation map — its only utility is showing where the walk is. The map style toggle there exists for accessibility preference, not active navigation.

A FAB on a 180px map would visually overwhelm the map area and add interaction complexity to a view that is not a primary map experience. The existing segmented style control (lines 5378-5388) is compact and appropriate for that context.

**Recommendation for walk detail map style control:** leave it unchanged. It is wired to `setMapStyle()` via `applyMapStyleControl` and correctly reflects global style preference. No modification required.

---

## 6 — Disposition of existing controls

| Existing element | Location | Action |
|---|---|---|
| `#walks-map-style-row` + `.map-style-control` | line 4744 | **Remove from HTML.** The FAB handles map style selection for Walks map. |
| `#walksInmapFilter` + `.walks-inmap-btn` | line 4753 | **Remove from HTML.** The FAB handles walk filter for Walks map. |
| `#nearby-map-style-row` + `.map-style-control` | line 4822 | **Remove from HTML.** The FAB handles map style selection for Nearby map. |
| `.map-style-row` CSS | lines 3659-3662 | **Delete.** No longer referenced. |
| `.map-style-control` CSS | lines 3663-3688 | **Delete.** No longer referenced. |
| `.map-style-btn` CSS | lines 3689-3708 | **Delete.** No longer referenced. |
| `.walks-inmap-filter` CSS | lines 1624-1638 | **Delete.** No longer referenced. |
| `.walks-inmap-btn` CSS | lines 1639-1662 | **Delete.** No longer referenced. |
| `setWalksView()` show/hide of style row + filter | lines 12356-12357 | **Remove those two lines.** The FAB shows/hides itself based on context. |
| `setNearbyView()` show/hide of style row | line 12985 | **Remove that line.** |
| `#nearby-map-cat-bar` chips | lines 4822 area | **Keep unchanged.** Category navigation, not map configuration. |
| Walk detail `.map-style-control` | lines 5378-5388 | **Keep unchanged.** See Section 5. |

---

## 7 — CSS specification

Insert the following CSS after `.walks-inmap-btn` styles (after line 1662), replacing the deleted blocks above the insertion point.

```css
/* ─── Map FAB ─── */
.map-fab-container {
  position: absolute;
  bottom: 72px;
  right: 12px;
  z-index: 400;
  display: none;  /* shown by setWalksView / setNearbyView */
}

.map-fab-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(0,0,0,0.10);
  box-shadow: 0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--brand);
  transition: background 0.15s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  z-index: 2;
}

.map-fab-btn:active {
  transform: scale(0.93);
}

.map-fab-btn--open {
  background: rgba(255,255,255,0.98);
}

.map-fab-btn-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.15s ease, transform 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-fab-btn-icon--layers {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

.map-fab-btn--open .map-fab-btn-icon--layers {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(180deg);
}

.map-fab-btn-icon--close {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-180deg);
}

.map-fab-btn--open .map-fab-btn-icon--close {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

.map-fab-panel {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 190px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.09);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 10px 0;
  transform-origin: bottom right;
  transform: scale(0.85);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.18s ease;
}

.map-fab-panel--open {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.map-fab-panel-label {
  height: 30px;
  padding: 0 14px;
  padding-bottom: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.35);
  display: flex;
  align-items: flex-end;
}

.map-fab-panel-row {
  height: 40px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
  transition: background 0.1s ease;
  -webkit-tap-highlight-color: transparent;
}

.map-fab-panel-row:active {
  background: rgba(0,0,0,0.04);
}

.map-fab-panel-row--active {
  color: var(--brand);
}

.map-fab-panel-row-check {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
}

.map-fab-panel-row--active .map-fab-panel-row-check {
  opacity: 1;
}

.map-fab-divider {
  height: 1px;
  background: rgba(0,0,0,0.07);
  margin: 4px 0;
}

.map-fab-overlay {
  position: fixed;
  inset: 0;
  z-index: 399;
  background: transparent;
  display: none;
}

.map-fab-overlay--active {
  display: block;
}

/* Walk filter group — hidden in Nearby map context */
.map-fab-filter-group {
  display: block;
}

.map-fab-filter-group--hidden {
  display: none;
}
```

---

## 8 — HTML specification

The FAB is injected inside the map container div, once for Walks and once for Nearby. The HTML structure is identical for both; the `id` attributes differ.

**Walks map — insert inside `#walks-map` container, after `#walksInmapFilter` (which is being removed):**

```html
<!-- Map FAB — Walks -->
<div class="map-fab-container" id="walksMapFab">
  <div class="map-fab-panel" id="walksMapFabPanel">
    <!-- Map style group -->
    <div class="map-fab-panel-label">Map style</div>
    <div class="map-fab-panel-row map-fab-panel-row--active" id="walksStyleStandard" onclick="setMapStyle('standard');updateMapFabState('walks')">
      <span class="map-fab-panel-row-check" id="walksStyleStandardCheck"></span>
      Standard
    </div>
    <div class="map-fab-panel-row" id="walksStyleOs" onclick="setMapStyle('os');updateMapFabState('walks')">
      <span class="map-fab-panel-row-check" id="walksStyleOsCheck"></span>
      OS Map
    </div>
    <!-- Divider -->
    <div class="map-fab-divider"></div>
    <!-- Walk filter group -->
    <div class="map-fab-filter-group" id="walksMapFabFilterGroup">
      <div class="map-fab-panel-label">Walk filter</div>
      <div class="map-fab-panel-row map-fab-panel-row--active" id="walksFilterAll" onclick="setWalksMapFilter('all');updateMapFabState('walks')">
        <span class="map-fab-panel-row-check" id="walksFilterAllCheck"></span>
        All walks
      </div>
      <div class="map-fab-panel-row" id="walksFilterPicks" onclick="setWalksMapFilter('picks');updateMapFabState('walks')">
        <span class="map-fab-panel-row-check" id="walksFilterPicksCheck"></span>
        Sniffout Picks
      </div>
      <div class="map-fab-panel-row" id="walksFilterGreen" onclick="setWalksMapFilter('greenspaces');updateMapFabState('walks')">
        <span class="map-fab-panel-row-check" id="walksFilterGreenCheck"></span>
        Green spaces
      </div>
    </div>
  </div>
  <button class="map-fab-btn" id="walksMapFabBtn" onclick="toggleMapFab('walks')" aria-label="Map options" aria-expanded="false">
    <span class="map-fab-btn-icon map-fab-btn-icon--layers"></span>
    <span class="map-fab-btn-icon map-fab-btn-icon--close"></span>
  </button>
</div>
```

Note: The layers icon and close icon SVGs are injected at runtime by `initMapFabIcons()` (see JS section). They cannot use `luIcon()` inline in static HTML because `luIcon()` is a JS function.

**Nearby map — insert inside `#nearby-map-view` container, after `#nearby-map-style-row` (which is being removed):**

```html
<!-- Map FAB — Nearby -->
<div class="map-fab-container" id="nearbyMapFab">
  <div class="map-fab-panel" id="nearbyMapFabPanel">
    <!-- Map style group -->
    <div class="map-fab-panel-label">Map style</div>
    <div class="map-fab-panel-row map-fab-panel-row--active" id="nearbyStyleStandard" onclick="setMapStyle('standard');updateMapFabState('nearby')">
      <span class="map-fab-panel-row-check" id="nearbyStyleStandardCheck"></span>
      Standard
    </div>
    <div class="map-fab-panel-row" id="nearbyStyleOs" onclick="setMapStyle('os');updateMapFabState('nearby')">
      <span class="map-fab-panel-row-check" id="nearbyStyleOsCheck"></span>
      OS Map
    </div>
    <!-- No filter group on Nearby — category bar handles content filtering -->
  </div>
  <button class="map-fab-btn" id="nearbyMapFabBtn" onclick="toggleMapFab('nearby')" aria-label="Map options" aria-expanded="false">
    <span class="map-fab-btn-icon map-fab-btn-icon--layers"></span>
    <span class="map-fab-btn-icon map-fab-btn-icon--close"></span>
  </button>
</div>
```

**Overlay — insert once, directly inside `<body>` or the outermost app container:**

```html
<div class="map-fab-overlay" id="mapFabOverlay" onclick="closeAllMapFabs()"></div>
```

---

## 9 — JS specification

### New functions

**`initMapFabIcons()`**

Injects Lucide icon SVGs into the FAB icon slots after DOM is ready. Call once on app init (inside `initApp()` or after DOMContentLoaded).

```javascript
function initMapFabIcons() {
  var layersHtml = luIcon('layers', 20);
  var closeHtml = luIcon('x', 20);
  var checkHtml = luIcon('check', 14);
  // Inject icons into FAB buttons
  ['walksMapFabBtn', 'nearbyMapFabBtn'].forEach(function(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    var layersEl = btn.querySelector('.map-fab-btn-icon--layers');
    var closeEl = btn.querySelector('.map-fab-btn-icon--close');
    if (layersEl) layersEl.innerHTML = layersHtml;
    if (closeEl) closeEl.innerHTML = closeHtml;
  });
  // Inject check icons into all check spans
  document.querySelectorAll('.map-fab-panel-row-check').forEach(function(el) {
    el.innerHTML = checkHtml;
  });
}
```

---

**`toggleMapFab(context)`**

Toggles the FAB open/closed for `context` = `'walks'` or `'nearby'`. Closes the other FAB if open.

```javascript
function toggleMapFab(context) {
  var btnId = context === 'walks' ? 'walksMapFabBtn' : 'nearbyMapFabBtn';
  var panelId = context === 'walks' ? 'walksMapFabPanel' : 'nearbyMapFabPanel';
  var btn = document.getElementById(btnId);
  var panel = document.getElementById(panelId);
  var overlay = document.getElementById('mapFabOverlay');
  if (!btn || !panel) return;
  var isOpen = panel.classList.contains('map-fab-panel--open');
  // Always close the other context first
  closeAllMapFabs();
  if (!isOpen) {
    panel.classList.add('map-fab-panel--open');
    btn.classList.add('map-fab-btn--open');
    btn.setAttribute('aria-expanded', 'true');
    overlay.classList.add('map-fab-overlay--active');
    // Sync state to reflect current selections
    updateMapFabState(context);
  }
}
```

---

**`closeAllMapFabs()`**

Collapses all open FABs. Called by overlay tap and by `toggleMapFab` before opening.

```javascript
function closeAllMapFabs() {
  ['walksMapFab', 'nearbyMapFab'].forEach(function(id) {
    var container = document.getElementById(id);
    if (!container) return;
    var btn = container.querySelector('.map-fab-btn');
    var panel = container.querySelector('.map-fab-panel');
    if (btn) { btn.classList.remove('map-fab-btn--open'); btn.setAttribute('aria-expanded', 'false'); }
    if (panel) { panel.classList.remove('map-fab-panel--open'); }
  });
  var overlay = document.getElementById('mapFabOverlay');
  if (overlay) overlay.classList.remove('map-fab-overlay--active');
}
```

---

**`updateMapFabState(context)`**

Reads current `walksMapFilter` and `mapStyle` globals and reflects them as active rows in the FAB panel. Call after any selection or when opening the panel.

```javascript
function updateMapFabState(context) {
  var style = localStorage.getItem('sniffout_map_style') || 'standard';
  // Normalise — style value is 'standard' or 'os'
  if (context === 'walks' || context === 'all') {
    // Style rows
    document.getElementById('walksStyleStandard')?.classList.toggle('map-fab-panel-row--active', style === 'standard');
    document.getElementById('walksStyleOs')?.classList.toggle('map-fab-panel-row--active', style === 'os');
    // Filter rows
    var filter = typeof walksMapFilter !== 'undefined' ? walksMapFilter : 'all';
    document.getElementById('walksFilterAll')?.classList.toggle('map-fab-panel-row--active', filter === 'all');
    document.getElementById('walksFilterPicks')?.classList.toggle('map-fab-panel-row--active', filter === 'picks');
    document.getElementById('walksFilterGreen')?.classList.toggle('map-fab-panel-row--active', filter === 'greenspaces');
  }
  if (context === 'nearby' || context === 'all') {
    document.getElementById('nearbyStyleStandard')?.classList.toggle('map-fab-panel-row--active', style === 'standard');
    document.getElementById('nearbyStyleOs')?.classList.toggle('map-fab-panel-row--active', style === 'os');
  }
}
```

---

### Modifications to existing functions

**`setWalksView(mode)` — lines 12312-12362**

Replace the two lines that show/hide the old controls:
```javascript
// DELETE these two lines:
document.getElementById('walksInmapFilter').style.display = mode === 'map' ? 'flex' : 'none';
document.getElementById('walks-map-style-row').style.display = mode === 'map' ? 'block' : 'none';

// REPLACE WITH:
var walksFab = document.getElementById('walksMapFab');
if (walksFab) walksFab.style.display = mode === 'map' ? 'flex' : 'none';
if (mode !== 'map') closeAllMapFabs();
```

**`setNearbyView(mode)` — lines 12961+**

Replace the line that shows/hides the nearby style row:
```javascript
// DELETE:
document.getElementById('nearby-map-style-row').style.display = mode === 'map' ? 'block' : 'none';

// REPLACE WITH:
var nearbyFab = document.getElementById('nearbyMapFab');
if (nearbyFab) nearbyFab.style.display = mode === 'map' ? 'flex' : 'none';
if (mode !== 'map') closeAllMapFabs();
```

**`setMapStyle(style)` — lines 12754-12768**

After the existing tile-swapping and `applyMapStyleControl` calls, add:
```javascript
// Add at end of setMapStyle, after all applyMapStyleControl calls:
updateMapFabState('all');
```

**`setWalksMapFilter(mode)` — lines 12303-12310**

After the existing button active class updates, add:
```javascript
// Add at end of setWalksMapFilter:
updateMapFabState('walks');
```

---

### `walksMapFilter` initial value note

`setWalksMapFilter` currently writes to an in-memory variable. `updateMapFabState` reads this variable as `typeof walksMapFilter !== 'undefined' ? walksMapFilter : 'all'`. This is safe as long as `walksMapFilter` is declared in the outer scope. If it is currently initialised as `var walksMapFilter = 'all'`, no change is needed. Verify this at the declaration site before implementation.

---

## 10 — Implementation order

Apply in this sequence:

| Step | Action |
|---|---|
| 1 | Delete CSS: `.map-style-row`, `.map-style-control`, `.map-style-btn` (lines 3659-3708) |
| 2 | Delete CSS: `.walks-inmap-filter`, `.walks-inmap-btn` (lines 1624-1662) |
| 3 | Add new CSS (Section 7) after the deleted blocks |
| 4 | Remove `#walks-map-style-row` HTML (line 4744 area) |
| 5 | Remove `#walksInmapFilter` HTML (line 4753 area) |
| 6 | Remove `#nearby-map-style-row` HTML (line 4822 area) |
| 7 | Insert Walks FAB HTML inside `#walks-map` container (Section 8) |
| 8 | Insert Nearby FAB HTML inside `#nearby-map-view` container (Section 8) |
| 9 | Insert overlay HTML in app root (Section 8) |
| 10 | Add `initMapFabIcons()`, `toggleMapFab()`, `closeAllMapFabs()`, `updateMapFabState()` (Section 9) |
| 11 | Update `setWalksView()` — replace old show/hide lines (Section 9) |
| 12 | Update `setNearbyView()` — replace old show/hide line (Section 9) |
| 13 | Update `setMapStyle()` — add `updateMapFabState('all')` call (Section 9) |
| 14 | Update `setWalksMapFilter()` — add `updateMapFabState('walks')` call (Section 9) |
| 15 | Call `initMapFabIcons()` in app init |

---

## What the map view looks like after changes

**Walks map — list view:**
- No floating controls visible (identical to current)

**Walks map — map view:**
- Single 44×44px circular FAB, bottom-right, above nav bar
- Layers icon, frosted white, green icon
- Category chips (if any) are absent — Walks has no category chips

**Walks map — FAB expanded:**
- Panel opens above FAB: Map style (Standard / OS Map) + Walk filter (All walks / Sniffout Picks / Green spaces)
- Active selections shown with green checkmark
- Transparent overlay behind panel captures outside taps to close

**Nearby map — map view:**
- Single 44×44px circular FAB, bottom-right, above nav bar
- Layers icon, frosted white
- Category chips remain at bottom-center (unchanged — content navigation)

**Nearby map — FAB expanded:**
- Panel opens above FAB: Map style only (no walk filter group)
- Transparent overlay behind panel

---

*Spec produced by Designer agent, 2026-03-27. No code files were modified.*
