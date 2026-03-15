# Sniffout v2 — Design Review Round 1
*Designer review against: mockup.html, design-spec.md, phase1-build-brief.md*
*File reviewed: sniffout-v2.html*
*Date: March 2026*

---

## Summary

The build is largely sound. CSS tokens, base card styles, navigation, and the overall layout match the spec. Seven issues need addressing: one critical bug (dark mode `--brand` override missing despite being documented as done), one map-breaking JavaScript error, two visual inconsistencies that affect the Walks tab hierarchy, and three smaller polish items. Two items (venue images, section label wording) are pending pending fixes already in developer-brief-round3.md and are flagged here for completeness only.

---

## Issues — Fix Required

---

### ISSUE 1 — Dark mode `--brand` colour not overridden (CRITICAL)

**Location:** `sniffout-v2.html` lines 979–986 — `body.night` CSS block

**Issue:** FIX 3.1 was documented as complete in `developer-notes.md`, but `--brand: #6EE7B7` is absent from the `body.night` block. Confirmed with a full-file search — the value `#6EE7B7` does not appear anywhere in the file. The current dark mode block is:

```css
body.night {
  --bg:      #0F1C16;
  --surface: #1A2C22;
  --border:  #2A3D30;
  --ink:     #F0F0ED;
  --ink-2:   #8A9E92;
  --chip-off:#2A3D30;
}
```

The `--brand` token remains `#1E4D3A` (dark forest green) in dark mode. On the `#0F1C16` dark background this renders as near-black-on-black for: the primary CTA button, active nav label, active filter/radius chips, paw safety block, and preview card brand tint.

**Reference:** `design-spec.md` dark mode token spec; `phase1-build-brief.md` Section 1 ("Dark mode via `body.night` class"); `developer-brief-round3.md` FIX 3.1 spec: `--brand: #6EE7B7` (light teal).

**Fix:** Add one line to the `body.night` block at line 979:

```css
body.night {
  --bg:      #0F1C16;
  --surface: #1A2C22;
  --border:  #2A3D30;
  --ink:     #F0F0ED;
  --ink-2:   #8A9E92;
  --chip-off:#2A3D30;
  --brand:   #6EE7B7; /* ← add this */
}
```

---

### ISSUE 2 — Dark mode: preview card tints invisible

**Location:** `sniffout-v2.html` lines 322–387 — `.walk-preview-card` and `.weather-preview-card`

**Issue:** Both State A preview cards use hardcoded `rgba(30,77,58,x)` tint values for their background and border:

```css
.walk-preview-card {
  background: rgba(30,77,58,0.06);
  border: 1px solid rgba(30,77,58,0.15);
}
.weather-preview-card {
  background: rgba(30,77,58,0.07);
  border: 1px solid rgba(30,77,58,0.18);
}
```

On the dark mode background of `#0F1C16`, a `rgba(30,77,58,0.06)` tint is effectively invisible — the cards blend into the background with no discernible border or fill. The tinted preview treatment that makes these cards read as deliberate teasers in light mode is completely lost in dark mode.

**Reference:** Mockup.html lines 317–396 — preview card treatment (designed for light mode only; dark mode adaptation is a v2 requirement).

**Fix:** Add dark mode overrides to the `body.night` block or as dedicated rules after the existing dark mode block:

```css
body.night .walk-preview-card {
  background: rgba(110,231,183,0.06);  /* based on --brand #6EE7B7 */
  border-color: rgba(110,231,183,0.18);
}
body.night .weather-preview-card {
  background: rgba(110,231,183,0.07);
  border-color: rgba(110,231,183,0.2);
}
body.night .walk-preview-tag {
  background: rgba(110,231,183,0.12);
  color: #6EE7B7;
}
body.night .weather-preview-title {
  color: #6EE7B7;
}
```

---

### ISSUE 3 — Section label hierarchy: Community Picks and Nearby Green Spaces look identical

**Location:** `sniffout-v2.html` — `renderWalksTab()` function, lines 2633 and 2643

**Issue:** Both section labels in the Walks tab render using the same CSS class (`.walks-section-label`):

```js
html += '<div class="walks-section-label">Community Picks</div>';       // line 2633
html += '<div class="walks-section-label">Nearby Green Spaces</div>';   // line 2643
```

`.walks-section-label` is defined as `font-size: 18px; font-weight: 700; color: var(--ink)` (line 1088). The secondary section (Nearby Green Spaces) has the same visual weight as the primary section (Community Picks). The brief explicitly requires visual hierarchy — Community Trails as premium content, green spaces as subordinate.

The CSS already defines a smaller variant that is never used:

```css
.walks-section-label-sm {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);    /* secondary/supporting text colour */
  padding: 4px 16px 8px;
}
```

**Reference:** `designer-brief-round1.md` Section 3 — "visually subordinate: smaller cards, less detail"; `owner-feedback-round2.md` Walks tab user story — "Visual hierarchy must be clear".

**Fix:** In `renderWalksTab()`, change line 2643 from:
```js
html += '<div class="walks-section-label">Nearby Green Spaces</div>';
```
to:
```js
html += '<div class="walks-section-label-sm">Nearby Green Spaces</div>';
```

(Note: per FIX 4.1 in developer-brief-round3.md, the label text also needs to change to "Other nearby green spaces" — both changes should be made together.)

---

### ISSUE 4 — Walk tag style inconsistency between card types

**Location:** CSS lines 778–798 (`.walk-tag`) and lines 1139–1147 (`.trail-tag`); `renderWalkCard()` line 2501, `renderTrailCard()` line 2576

**Issue:** The same semantic content — off-lead status and terrain tags — is styled completely differently depending on which card type renders it:

| Card type | Tag class | Style |
|-----------|-----------|-------|
| `.walk-card` (Me tab Favourites) | `.walk-tag` | Brand-green tinted background `rgba(30,77,58,0.1)`, `border-radius: 6px` (square corners) |
| `.trail-card` (Walks tab Community Picks carousel) | `.trail-tag` | Grey outlined pill, `border: 1.5px solid var(--chip-off)`, `border-radius: 99px` |

A user who saves a walk and then views it in Favourites sees green square-corner chips. The same walk in the Community Picks carousel has grey pill chips. These should be consistent.

**Reference:** `phase1-build-brief.md` Section 5 — "Filter chips: inactive = `var(--chip-off)` border, `var(--ink-2)` text". The brief specifies the chip-off style as the standard inactive chip treatment.

**Fix:** Align `.trail-tag` to use the same style as `.walk-tag` (brand-green tinted), or align both to the standard chip inactive state (`var(--chip-off)` border, `var(--ink-2)` text). The recommended approach for tags is the brand-green tinted treatment, as it's used on the approved `.walk-card` which has been through more design review. Update `.trail-tag` in the CSS (line 1139):

```css
.trail-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--brand);
  background: rgba(30,77,58,0.1);
  border-radius: 6px;
  padding: 2px 8px;
}
```

And update the off-lead styling in trail tags to use the same `.walk-tag.full` / `.walk-tag.partial` tinted variants:
```css
.trail-tag.full    { color: var(--brand); background: rgba(30,77,58,0.08); border-color: rgba(30,77,58,0.2); }
.trail-tag.partial { color: var(--amber); background: rgba(217,119,6,0.08); border-color: rgba(217,119,6,0.2); }
```

In `renderTrailCard()` (line 2576), pass the off-lead CSS class through as with `renderWalkCard()`:
```js
'<span class="trail-tag ' + ol.cls + '">' + ol.text + '</span>'
```

---

### ISSUE 5 — Community Picks carousel cards missing heart/favourite button

**Location:** `renderTrailCard()` lines 2558–2582; `.trail-card-photo` CSS line 1118

**Issue:** `renderTrailCard()` renders the photo area as:

```js
'<div class="trail-card-photo">' + badgeHTML + '</div>'
```

No heart icon. By contrast, `renderWalkCard()` and `renderPortraitCard()` both include a heart button in the photo area. Users cannot add a walk to favourites from the Community Picks carousel — the main walk surface on the Walks tab.

**Reference:** `phase1-build-brief.md` Section 7 — "Heart/favourite icon: top-right of photo area, white circular background (`rgba(255,255,255,0.92)`)". This applies to all walk card types.

**Fix:** Add the heart button to `renderTrailCard()`:

```js
'<div class="trail-card-photo">' +
  badgeHTML +
  '<button class="trail-heart' + (isFavourited(walk.id) ? ' fav-active' : '') + '" ' +
    'data-heart="' + walk.id + '" ' +
    'onclick="event.stopPropagation();toggleFavourite(\'' + walk.id + '\')">' +
    heartSVG(isFavourited(walk.id)) +
  '</button>' +
'</div>'
```

Add the corresponding CSS (can reuse `.portrait-heart` dimensions, just change class name):

```css
.trail-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```

Also add `position: relative` to `.trail-card-photo` if not already present (confirmed it is: line 1121 has no `position` set — add `position: relative` to `.trail-card-photo` at line 1118).

---

### ISSUE 6 — Green space card border-radius inconsistent with base card spec

**Location:** `.gs-card` CSS line 1155

**Issue:**

```css
.gs-card {
  border-radius: 12px;   /* ← should be 16px */
  ...
}
```

All other card types in the app use `border-radius: 16px` (walk card: 16px, trail card: 16px, venue card: 16px, sign-in banner: 16px). The green space cards are 12px — visually slightly squarer, which makes them look like a different component system rather than a scaled-down version of the same card language.

**Reference:** `phase1-build-brief.md` Section 4 — "All cards across the entire app: `border-radius: 16px`".

**Fix:** Change line 1155 from `border-radius: 12px` to `border-radius: 16px`.

---

### ISSUE 7 — `filteredVenues()` function is undefined — map view will throw a JavaScript error

**Location:** `updateMapMarkers()` function, line 3071

**Issue:** The map rendering function calls `filteredVenues()`:

```js
filteredVenues().forEach(function(v) {
  L.marker([v.lat, v.lon])...
```

This function is never defined anywhere in the file. When a user taps "Map" on the Nearby tab, `initNearbyMap()` is called which calls `updateMapMarkers()`, which immediately throws `ReferenceError: filteredVenues is not defined`. No venue pins render. This is the root cause of the broken map view reported in the owner observations (FIX 4.3 in developer-brief-round3.md).

**Reference:** `developer-brief-round3.md` FIX 4.3 — "likely cause is the New Places API using `place.location.latitude/longitude` vs whatever field names the current map code expects". The coordinate field names are actually correct (`v.lat` / `v.lon` are populated correctly at line 2888). The actual bug is this missing function.

**Fix:** Replace `filteredVenues()` with `nearbyVenues` at line 3071:

```js
// Before:
filteredVenues().forEach(function(v) {

// After:
nearbyVenues.forEach(function(v) {
```

`nearbyVenues` is the correctly maintained array (defined at line 2794, populated by `fetchNearbyPlaces`) and already contains the current category's venues. No separate filtering function is needed since the API already returns category-specific results.

---

### ISSUE 8 — `.walk-photo` background uses hardcoded hex instead of `var(--brand)`

**Location:** CSS line 717; `renderWalkCard()` line 2466; `renderPortraitCard()` line 2511

**Issue:** Three places hardcode `#1E4D3A` as the photo placeholder background instead of using `var(--brand)`:

```css
.walk-photo { background: #1E4D3A; }              /* line 717 */
```
```js
var photoStyle = walk.imageUrl ? '' : 'background:#1E4D3A;';   /* line 2466 */
var photoStyle = walk.imageUrl ? '' : 'background:#1E4D3A;';   /* line 2511 */
```

Once Issue 1 (the `--brand` dark mode override) is fixed, `var(--brand)` will correctly switch to `#6EE7B7` in dark mode — but these hardcoded values won't follow. Walk card photo areas will remain dark forest green in dark mode while all other brand elements switch to light teal.

**Reference:** `phase1-build-brief.md` Section 7 — "If `imageUrl` is `""` or absent: solid `#1E4D3A` background". This was written before dark mode was specified. The intent is the brand colour.

**Fix:**
1. CSS line 717: change `background: #1E4D3A` to `background: var(--brand)`
2. JS line 2466: change `'background:#1E4D3A;'` to `'background:var(--brand);'`
3. JS line 2511: change `'background:#1E4D3A;'` to `'background:var(--brand);'`

---

## Items Confirmed Passing

### Today tab

- **State A preview cards** — brand-green tint (`rgba(30,77,58,0.06)` background, `rgba(30,77,58,0.15)` border), `border-radius: 16px`, `pointer-events: none` — **PASS**
- **State A CTA block** — `.cta-block` card styling: `border-radius: 16px`, `border: 1px solid var(--border)`, `background: var(--surface)` — **PASS**
- **Primary CTA button** — 56px height, `var(--brand)` fill, `border-radius: 12px`, Inter 600 — **PASS**
- **Weather preview card** — correct copy ("Live weather" / "Safety tips when conditions are extreme"), tint treatment matches walk preview — **PASS**
- **Search input expand** — hidden by default, `max-height` transition on open — **PASS**
- **Recent search pills** — `border: 1.5px solid var(--border)`, `border-radius: 99px`, starred variant with `var(--brand)` border — **PASS**
- **Social proof strip** — correct copy ("25 handpicked UK walks"), correct secondary text styling — **PASS**

### Today tab State B / Weather

- **Weather hero card** — `var(--brand)` background, 16px radius, white text, correct verdict font size — **PASS**
- **Hazard card** — `border-radius: 12px` with 4px left accent border, amber/red variants — matches mockup.html line 447, deliberate density choice — **PASS**
- **Conditions grid cells** — `border-radius: 12px`, `border: 1px solid var(--border)` — appropriate for compact metric cells — **PASS**
- **Paw safety card** — correct colour variants (green/amber/red), left border accent, brand-green tint background — **PASS**
- **Weather info button** — top-right, `rgba(255,255,255,0.2)` circular, correct size — **PASS**
- **Rain section** — `.rain-section` 16px radius, surface background, correct styling — **PASS**

### Walks tab

- **Tab title bar** — "Walks" at 22px/700, funnel SVG filter button, correct layout — **PASS**
- **Radius picker chips** — uses `.chip` class, brand active state, chip-off inactive — **PASS**
- **Location context header** — `.walks-location-text` in `var(--ink-2)` 14px/600, correct subordinate styling for context metadata — **PASS**
- **Community Picks section label** — `.walks-section-label` 18px/700/`var(--ink)` — **PASS**
- **Trail carousel** — horizontal scroll, `scrollbar-width: none`, `-webkit-overflow-scrolling: touch` — **PASS**
- **Trail card base** — `border-radius: 16px`, `border: 1px solid var(--border)`, `background: var(--surface)` — **PASS**
- **Trail card photo area** — 120px height (appropriate for compact carousel format), `var(--brand)` background — **PASS**
- **Trail card badge** — bottom-left (`bottom: 8px; left: 10px`), `rgba(0,0,0,0.55)`, white text, pill shape — **PASS**
- **Trail card body typography** — name 14px/600, rating 12px amber, meta 12px `var(--ink-2)` — **PASS**
- **Walk empty state** — correct copy, `var(--ink-2)` secondary text — **PASS**

### Nearby tab

- **Tab title bar** — "Nearby" at 22px/700, location subtitle, funnel SVG button — **PASS**
- **Category chip row** — uses `.chip` class, brand active state, horizontal scroll — **PASS**
- **Venue count + List/Map toggle** — correct layout and toggle styling — **PASS**
- **Venue card (`.venue-card-gp`)** — `border-radius: 16px`, `border: 1px solid var(--border)`, correct — **PASS** *(no image yet — pending FIX 4.2)*
- **Category tip banner** — `.venue-cat-tip` subtle tinted treatment, correct size/colour — **PASS**
- **Disclaimer** — 12px, `var(--ink-2)`, centred, `margin: 16px 16px 24px` — **PASS**
- **Section label (FIX 4.1 pending)** — still reads "Nearby Green Spaces" — update to "Other nearby green spaces" per developer-brief-round3.md FIX 4.1

### Me tab

- **Me section titles** — `.me-section-title` 16px/600/`var(--ink)` — consistent — **PASS**
- **Sign-in banner** — `border-radius: 16px`, `border: 1px solid var(--border)`, surface background — **PASS**
- **Settings items** — `border-radius: 12px` — these are list rows, not standalone cards; the slightly tighter radius is acceptable at this component scale — **PASS**
- **Stat cells** — `border-radius: 14px` — 2px off the base card spec of 16px. Minor; functionally invisible at this scale. Flag only if pixel-perfect consistency becomes a priority.

### Navigation

- **Bottom nav** — SVG icons, filled active / outlined inactive, `var(--brand)` active label, `var(--ink-2)` inactive label, `padding-bottom: env(safe-area-inset-bottom)`, `border-top: 1px solid var(--border)` — **PASS**
- **State A dimming** — non-Today tabs at 0.35 opacity, `pointer-events: none` — **PASS**

### CSS tokens

All 10 tokens confirmed matching mockup.html lines 13–24:

| Token | Spec | v2 | Status |
|-------|------|----|--------|
| `--brand` | `#1E4D3A` | `#1E4D3A` | ✅ |
| `--brand-mid` | `#2E7D5E` | `#2E7D5E` | ✅ |
| `--bg` | `#F7F5F0` | `#F7F5F0` | ✅ |
| `--surface` | `#FFFFFF` | `#FFFFFF` | ✅ |
| `--border` | `#E5E7EB` | `#E5E7EB` | ✅ |
| `--ink` | `#111827` | `#111827` | ✅ |
| `--ink-2` | `#6B7280` | `#6B7280` | ✅ |
| `--amber` | `#D97706` | `#D97706` | ✅ |
| `--red` | `#DC2626` | `#DC2626` | ✅ |
| `--chip-off` | `#D1D5DB` | `#D1D5DB` | ✅ |

---

## Issue Priority Summary

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 1 | Dark mode `--brand` override missing | Critical | Trivial (1 line) |
| 7 | `filteredVenues()` undefined — map view broken | Critical | Trivial (1 line) |
| 3 | Section label hierarchy: both sections same weight | High | Trivial (1 class change) |
| 5 | Trail card missing heart/favourite button | High | Small |
| 4 | Walk tag style inconsistency (`.walk-tag` vs `.trail-tag`) | Medium | Small |
| 2 | Dark mode: preview card tints invisible | Medium | Small (4 CSS rules) |
| 8 | Walk photo background hardcoded hex not `var(--brand)` | Low | Trivial (3 substitutions) |
| 6 | Green space card `border-radius: 12px` (should be 16px) | Low | Trivial (1 value) |
