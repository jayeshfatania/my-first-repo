# Sniffout v2 — Design Review Round 3
*Designer output. For Developer implementation.*
*Date: 2026-03-16. Covers: card sizing hierarchy (Part 1) + filter/sort bottom sheet (Part 2).*

---

## Part 1 — Card Sizing Hierarchy

### Decision: Option C for trail cards

**Rationale:** Option A (same width, taller photo) increases visual weight but doesn't meaningfully differentiate the card from the current 200px format. Option C — wider card plus a description excerpt — creates a genuine step up in information density and visual prominence. The one-line description is high discovery value: users see "Ancient forest trails from a charming New Forest village" rather than a bare name. Option B (full-width vertical) is excluded per brief.

---

### 1A — Revised `.trail-card` spec

**Layout:** Horizontal scroll carousel (`flex-shrink: 0`), unchanged.

| Property | Current value | Revised value |
|----------|--------------|---------------|
| `width` | `200px` | `240px` |
| `min-width` | — | `240px` |
| Photo height (`.trail-card-photo`) | `120px` | `180px` |
| Card `border-radius` | `16px` | `16px` (unchanged) |
| Card `border` | `1px solid var(--border)` | `1px solid var(--border)` (unchanged) |
| Card `background` | `var(--surface)` | `var(--surface)` (unchanged) |
| `overflow` | `hidden` | `hidden` (unchanged) |

**`.trail-card-body` padding:** `10px 12px 14px` (bottom increases from 12px to 14px to accommodate description line)

**Typography:**

| Element | Current | Revised |
|---------|---------|---------|
| `.trail-card-name` | `14px / 600` | `15px / 600` |
| `.trail-card-rating` | `12px / 500` | `12px / 500` (unchanged) |
| `.trail-card-meta` | `12px / var(--ink-2)` | `12px / var(--ink-2)` (unchanged) |
| `.trail-card-desc` | — (new) | `12px / 400 / var(--ink-2)`, `line-height: 1.4`, 2-line clamp |

**New `.trail-card-desc` CSS:**
```css
.trail-card-desc {
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-2);
  line-height: 1.4;
  margin-top: 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

**Render change:** Add `walk.description` truncated to 2 lines immediately after `.trail-card-tags`:
```html
<div class="trail-card-desc">{walk.description}</div>
```

**`position: relative` on `.trail-card-photo`:** Already present in current code. Confirmed retained — required for heart button (FIX 5.4) and badge positioning.

**Badge:** `.trail-card-badge` position unchanged (`bottom: 8px; left: 10px`).

**Full revised CSS block:**
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

---

### 1B — Revised `.gs-card` spec

**Layout change:** From vertical column (full-width photo top + body below) → horizontal flex row (left thumbnail + right text column). This is a complete replacement of the current card layout.

**Target total card height:** 80px (including vertical padding).

**Card container:**
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
```

**Remove:** `.venue-card-photo-gp` (the full-width 140px top photo area) is no longer used for gs-cards. The gs-card gets its own thumbnail class instead.

**Left thumbnail (`.gs-thumb`):**

| Property | Value |
|----------|-------|
| Width | `64px` |
| Height | `64px` |
| `border-radius` | `10px` |
| `object-fit` | `cover` (on `<img>`) |
| `flex-shrink` | `0` |
| Fallback (no photo) | `background: var(--brand)` |
| `overflow` | `hidden` |

```css
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
```

**Right text column (`.gs-card-body` — repurposed as column):**
```css
.gs-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
```

**Text elements:**

| Element | CSS |
|---------|-----|
| `.gs-card-name` | `font-size: 14px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` |
| `.gs-card-meta` | `font-size: 12px; color: var(--ink-2);` |
| `.gs-maps-link` | `font-size: 12px; color: var(--brand); font-weight: 500; margin-top: 2px;` |

**Layout decision — Maps link placement:** Own line below the distance, not inline. The card is compact enough that inline distance + link on one row creates crowding on narrow phones. Three rows (name / distance / Maps link) fits cleanly in 64px of height with the text gap.

```css
.gs-maps-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--brand);
  margin-top: 2px;
  white-space: nowrap;
}
```

**Remove:** `.gs-nearby-badge` — per Round 5 FIX 6.2, the "Nearby" pill is removed.

**Revised `renderGsCard()` HTML output:**
```html
<div class="gs-card">
  <div class="gs-thumb">
    <!-- if gs.photoUrl: -->
    <img src="{gs.photoUrl}" alt="" loading="lazy">
    <!-- if no photoUrl: empty div (brand-green fallback from CSS) -->
  </div>
  <div class="gs-card-body">
    <div class="gs-card-name">{gs.name}</div>
    <div class="gs-card-meta">{distText}</div>
    <a class="gs-maps-link" href="{mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">View on Google Maps →</a>
  </div>
</div>
```

---

### 1C — Section composition

After both card changes, the Walks tab reads as:

```
WALKS TAB
─────────────────────────────────
Sniffout Picks              [funnel]
  [← 240px card][← 240px card] →
    prominent, tall photo, description

Other nearby green spaces
  ┌──────────────────────────────┐
  │ [thumb] Name          ↗ Maps │  ← 80px row
  └──────────────────────────────┘
  ┌──────────────────────────────┐
  │ [thumb] Name          ↗ Maps │  ← 80px row
  └──────────────────────────────┘
```

The hierarchy is unambiguous: the Picks carousel is visually dominant (240px wide × 180px photo + description). The green space rows are clearly supplementary (80px compact rows).

**Section label hierarchy — confirmed correct:**
- `.walks-section-label` (`18px / 700 / var(--ink)`) for "Sniffout Picks" — correct weight for primary section
- `.walks-section-label-sm` (`15px / 600 / var(--ink-2)`) for "Other nearby green spaces" — correct subordinate treatment

No changes needed to section label CSS.

---

## Part 2 — Filter/Sort Bottom Sheet

### Design decisions

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Live filter vs Apply | **Apply button ("Show walks" / "Show venues")** | Walks tab involves sort operations and DB iteration across 25+ entries. Apply button avoids re-renders on every chip tap and matches user expectation (select criteria, then confirm). |
| Sort UI | **Radio-style single-select** | Radio semantics are correct — only one sort order can be active. Chip-style would imply multi-select. Styled as custom radio rows (not native `<input type="radio">`). |
| "Any" as default | **Yes, per group** | Each filter group has an "Any" chip pre-selected by default. Tapping "Any" clears that group's selection. "Any" + a specific option are mutually exclusive. |
| Active indicator on `.filter-btn` | **Filled dot via `.filter-btn.has-filter` modifier** | When any non-default filter is active, a green dot appears top-right of the funnel icon. |
| Surface vs Environment | **Two separate sections** — see Part 2 terrain note below | |
| Nearby category chips | **Not in sheet** — category chip row stays as primary nav | |

---

### CSS — Bottom sheet components

```css
/* ─── Filter sheet backdrop ─── */
.filter-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
.filter-sheet.open {
  transform: translateY(0);
}

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

/* ─── Sort rows (radio-style) ─── */
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
.filter-radio.selected {
  border-color: var(--brand);
}
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

/* ─── Chip group within sheet ─── */
/* Reuses existing .chip and .chip.active — no new classes needed */
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

/* ─── Active indicator on funnel button ─── */
.filter-btn {
  position: relative;
}
.filter-btn.has-filter::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 0px;
  width: 7px;
  height: 7px;
  background: var(--brand);
  border-radius: 50%;
  border: 1.5px solid var(--bg);
}
```

---

### HTML structure — Walks tab filter sheet

The sheet is injected once into `<body>` (not inside `#tab-walks`) so it overlays correctly regardless of scroll position. The backdrop is a separate sibling element.

```html
<!-- WALKS FILTER SHEET -->
<div class="filter-backdrop" id="walks-filter-backdrop"></div>
<div class="filter-sheet" id="walks-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter walks">
  <div class="filter-handle"></div>
  <div class="filter-header">
    <span class="filter-title">Filter &amp; Sort</span>
    <button class="filter-close-btn" id="walks-filter-close" aria-label="Close">×</button>
  </div>
  <div class="filter-body">

    <!-- Sort by -->
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

    <!-- Radius -->
    <div class="filter-section">
      <div class="filter-section-label">Radius</div>
      <div class="filter-chip-row" id="walks-radius-chips">
        <button class="chip active" data-walks-radius="1">1 km</button>
        <button class="chip" data-walks-radius="3">3 km</button>
        <button class="chip" data-walks-radius="5">5 km</button>
        <button class="chip" data-walks-radius="10">10 km</button>
      </div>
    </div>

    <!-- Surface (maps to walk.terrain field) -->
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

    <!-- Environment (maps to walk.environment field) -->
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

    <!-- Duration -->
    <div class="filter-section">
      <div class="filter-section-label">Duration</div>
      <div class="filter-chip-row" id="walks-duration-chips">
        <button class="chip active" data-walks-duration="any">Any</button>
        <button class="chip" data-walks-duration="short">Short &lt;1hr</button>
        <button class="chip" data-walks-duration="medium">Medium 1–2hr</button>
        <button class="chip" data-walks-duration="long">Long 2hr+</button>
      </div>
    </div>

    <!-- Off-lead -->
    <div class="filter-section">
      <div class="filter-section-label">Off-lead</div>
      <div class="filter-chip-row" id="walks-offlead-chips">
        <button class="chip active" data-walks-offlead="any">Any</button>
        <button class="chip" data-walks-offlead="full">Full off-lead</button>
        <button class="chip" data-walks-offlead="partial">Partial</button>
        <button class="chip" data-walks-offlead="none">On-lead only</button>
      </div>
    </div>

    <!-- Difficulty -->
    <div class="filter-section">
      <div class="filter-section-label">Difficulty</div>
      <div class="filter-chip-row" id="walks-difficulty-chips">
        <button class="chip active" data-walks-difficulty="any">Any</button>
        <button class="chip" data-walks-difficulty="easy">Easy</button>
        <button class="chip" data-walks-difficulty="moderate">Moderate</button>
        <button class="chip" data-walks-difficulty="hard">Hard</button>
      </div>
    </div>

  </div><!-- /filter-body -->
  <div class="filter-footer">
    <button class="filter-clear-btn" id="walks-filter-clear">Clear all</button>
    <button class="filter-apply-btn" id="walks-filter-apply">Show walks</button>
  </div>
</div>
```

---

### HTML structure — Nearby tab filter sheet

```html
<!-- NEARBY FILTER SHEET -->
<div class="filter-backdrop" id="nearby-filter-backdrop"></div>
<div class="filter-sheet" id="nearby-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter nearby places">
  <div class="filter-handle"></div>
  <div class="filter-header">
    <span class="filter-title">Filter &amp; Sort</span>
    <button class="filter-close-btn" id="nearby-filter-close" aria-label="Close">×</button>
  </div>
  <div class="filter-body">

    <!-- Sort by -->
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

    <!-- Radius -->
    <div class="filter-section">
      <div class="filter-section-label">Radius</div>
      <div class="filter-chip-row" id="nearby-radius-chips">
        <button class="chip active" data-nearby-radius="1">1 km</button>
        <button class="chip" data-nearby-radius="3">3 km</button>
        <button class="chip" data-nearby-radius="5">5 km</button>
        <button class="chip" data-nearby-radius="10">10 km</button>
      </div>
    </div>

  </div><!-- /filter-body -->
  <div class="filter-footer">
    <button class="filter-clear-btn" id="nearby-filter-clear">Clear all</button>
    <button class="filter-apply-btn" id="nearby-filter-apply">Show venues</button>
  </div>
</div>
```

---

### Behaviour spec

**Opening the sheet:**
1. User taps `.filter-btn` (funnel icon) on either tab
2. The corresponding `filter-backdrop` gets class `open` and `filter-sheet` gets class `open`
3. Sheet slides up via CSS transition (`transform: translateY(0)`)
4. Body scroll is locked (`document.body.style.overflow = 'hidden'`)

**Closing the sheet (three triggers, all do the same):**
- Tap the close button (`.filter-close-btn`)
- Tap the backdrop (`.filter-backdrop`)
- Tap "Show walks" / "Show venues" (apply triggers close after applying)

On close: remove `open` from sheet and backdrop, restore body scroll.

**Sort row interaction:**
- Tapping a sort row selects it: `.filter-radio` → `.filter-radio.selected`
- Deselects the previously selected row (only one can be active)

**Chip group interaction:**
- Within each chip group, tapping a chip selects it and deselects all others in the group (single-select per group)
- Tapping "Any" returns that group to default (deselects all non-Any chips)

**"Clear all" button:**
- Resets all groups to their default: "Any" chips selected, Sort by Distance selected, radius returns to default (use stored preference from `localStorage.sniffout_radius`)
- Does NOT close the sheet — user can review and then tap "Show walks"

**"Show walks" / "Show venues" (Apply):**
- Reads current state of all selectors from the sheet
- Calls the render function with the collected filter/sort parameters
- Closes the sheet
- Updates `.filter-btn.has-filter` class: add if any non-default option is active, remove if all are default

**Active filter indicator logic:**
- Non-default = any chip other than "Any" is selected, OR sort is set to Rating (not Distance), OR radius differs from the stored default
- Add `has-filter` class to `.filter-btn` → green dot appears
- Remove `has-filter` when "Clear all" is tapped and applied

**State persistence:**
- Filter state is in-memory only (no localStorage). Resets to defaults when the page reloads.
- Radius persists via existing `localStorage.sniffout_radius` key (unchanged behaviour).

---

### Filter logic — Walks tab (for Developer reference)

Apply is triggered by tapping "Show walks". At that point, read the sheet state and filter/sort `WALKS_DB`:

```
// Pseudo-logic (Developer implements)
var result = WALKS_DB.slice();

// 1. Filter by radius (distance from user location, if known)
if (userLat && userLon && activeRadius) {
  result = result.filter(w => haversineMiles(userLat, userLon, w.lat, w.lon) <= activeRadius * 0.621);
}

// 2. Filter by surface (terrain field)
if (activeSurface !== 'any') {
  result = result.filter(w => w.terrain === activeSurface);
}

// 3. Filter by environment (environment field — new schema)
if (activeEnv !== 'any') {
  result = result.filter(w => w.environment === activeEnv);
}

// 4. Filter by duration
if (activeDuration === 'short')  result = result.filter(w => w.duration < 60);
if (activeDuration === 'medium') result = result.filter(w => w.duration >= 60 && w.duration <= 120);
if (activeDuration === 'long')   result = result.filter(w => w.duration > 120);

// 5. Filter by off-lead
if (activeOffLead !== 'any') {
  result = result.filter(w => w.offLead === activeOffLead);
}

// 6. Filter by difficulty
if (activeDifficulty !== 'any') {
  result = result.filter(w => w.difficulty === activeDifficulty);
}

// 7. Sort
if (activeSort === 'rating') {
  result.sort((a, b) => b.rating - a.rating);
} else {
  // distance (default) — requires user coords
  if (userLat && userLon) {
    result.sort((a, b) => haversineMiles(userLat, userLon, a.lat, a.lon) - haversineMiles(userLat, userLon, b.lat, b.lon));
  }
}
```

**Empty result:** If `result.length === 0`, show the existing `.walks-empty` string: "Nothing matching those filters right now. Show all walks →". The "Show all walks →" link should trigger "Clear all" + Apply.

---

## Terrain section clarification

**Two separate filter sections. Not combined.**

| Sheet section label | DB field | Values |
|--------------------|----------|--------|
| Surface | `walk.terrain` | `paved` · `muddy` · `mixed` · `rocky` |
| Environment | `walk.environment` | `woodland` · `coastal` · `urban` · `moorland` · `heathland` · `open` |

**Rationale:** Surface and environment are orthogonal. A walk can be "Muddy + Woodland" or "Paved + Urban" — these are different dimensions of the same route. Combining them into one "Terrain" section would prevent multi-axis filtering (filtering by both surface and environment simultaneously), which is the whole point of having two fields. Keep separate.

Note for Developer: the `environment` field must be added to all 25 WALKS_DB entries. When uncertain, use `open`. See the Schema Note in designer-brief-round3.md for value definitions.

---

## Component reuse confirmation

| New component | Reuses / extends |
|---------------|-----------------|
| `.filter-backdrop` | New — no existing backdrop class in codebase |
| `.filter-sheet` | New — structurally similar to a modal but no existing modal class to extend |
| `.filter-handle` | New |
| `.filter-header` / `.filter-title` | `.tab-title-bar` / `.tab-title` as visual reference only — different elements |
| `.filter-section-label` | New — similar to `.walks-section-label-sm` (13px, uppercase) but distinct enough to warrant its own class |
| `.filter-chip-row` | New container; child chips reuse existing **`.chip`** and **`.chip.active`** exactly as-is — no changes to chip CSS |
| `.filter-sort-row` / `.filter-radio` | New — custom radio row, not extending any existing class |
| `.filter-footer` | New |
| `.filter-clear-btn` | New — styled like a secondary chip but full-width, 44px height |
| `.filter-apply-btn` | New — primary CTA, consistent with `.btn-primary` pattern but scoped to filter context |
| `.filter-btn.has-filter` (modifier) | Extends existing `.filter-btn` — adds `::after` pseudo-element only |
| `.trail-card-desc` | New — no existing description class on trail cards |
| `.gs-thumb` | New — replaces `.venue-card-photo-gp` for the gs-card thumbnail context |
| `.gs-maps-link` | New — distinct from `.venue-maps-link-gp` (which is 13px; this is 12px for compact row) |
