# Sniffout v2 — Design Verification Round 1
*Designer verification sweep against design-review-round1.md and design-review-round3.md*
*File reviewed: sniffout-v2.html*
*Date: 2026-03-16*

---

## Summary

Six of eight issues from design-review-round1.md are fully resolved. Issue 4 (walk tag consistency) is partially fixed but has a remaining gap. All issues are tracked below. Round 3 card sizing and filter sheet changes are not yet implemented — confirmed as expected, as these feed a future developer brief.

Two new issues are flagged: a residual from Issue 4, and a paw safety safe-state regression.

Design recommendations for the Today tab and Weather tab follow in Part 2.

---

## Part 1 — Verification of Previous Design Issues

### Issue 1 — Dark mode `--brand` colour override
**Status: FIXED ✅**

`--brand: #6EE7B7` is present at line 1036 inside the `body.night` block. Confirmed with full-file search.

---

### Issue 2 — Dark mode preview card tints
**Status: FIXED ✅**

All four specified overrides are present (lines 1040–1043):
```css
body.night .walk-preview-card    { background: rgba(110,231,183,0.06); border-color: rgba(110,231,183,0.18); }
body.night .weather-preview-card { background: rgba(110,231,183,0.07); border-color: rgba(110,231,183,0.2); }
body.night .walk-preview-tag     { background: rgba(110,231,183,0.12); color: #6EE7B7; }
body.night .weather-preview-title { color: #6EE7B7; }
```
An additional bonus override was added for `.today-conditions-card` in dark mode (line 1044) — correct and consistent with the same tint approach.

---

### Issue 3 — Section label hierarchy (Walks tab)
**Status: FIXED ✅**

`renderWalksTab()` correctly uses:
- `walks-section-label` (18px/700/`--ink`) for "Sniffout Picks"
- `walks-section-label-sm` (15px/600/`--ink-2`) for "Other nearby green spaces"

Both the class change and the label text update ("Nearby Green Spaces" → "Other nearby green spaces") are applied.

---

### Issue 4 — Walk tag style inconsistency
**Status: PARTIALLY FIXED — gap remains**

**What was fixed:** `.trail-tag` base style now matches `.walk-tag` — brand-green tint, `border-radius: 6px`, `color: var(--brand)`, `background: rgba(30,77,58,0.1)`. Dark mode override added (`body.night .trail-tag`). This is correct for "Full off-lead", terrain, and enclosed tags.

**Remaining gap:** `renderTrailCard()` (line 2707) passes off-lead text without the `ol.cls` class:
```js
// Current (incorrect):
'<span class="trail-tag">' + ol.text + '</span>'

// Required (from Issue 4 fix spec):
'<span class="trail-tag ' + ol.cls + '">' + ol.text + '</span>'
```

`ol.cls` is `''` (empty) for full, `'partial'` for partial, and `''` for on-lead. Without passing the class, "Partial off-lead" trail cards display brand-green (the default trail-tag) instead of amber. Additionally, the CSS defines no `.trail-tag.partial` variant for the amber treatment. Two fixes still needed:

1. **CSS:** Add to trail tag block:
   ```css
   .trail-tag.partial { color: var(--amber); background: rgba(217,119,6,0.08); }
   body.night .trail-tag.partial { background: rgba(217,119,6,0.12); }
   ```

2. **JS:** In `renderTrailCard()`, change line 2707 to pass `ol.cls`.

---

### Issue 5 — Trail card missing heart/favourite button
**Status: FIXED ✅**

`.trail-heart` CSS is defined (lines 1193–1207) with `position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background: rgba(255,255,255,0.92); border-radius: 50%`. The heart button is present in `renderTrailCard()` at line 2698. `position: relative` is confirmed on `.trail-card-photo` (line 1191).

---

### Issue 6 — Green space card `border-radius: 12px`
**Status: FIXED ✅**

`.gs-card` at line 1241 now has `border-radius: 16px`.

---

### Issue 7 — `filteredVenues()` undefined — map view broken
**Status: FIXED ✅**

`updateMapMarkers()` now calls `nearbyVenues.forEach(...)` (line 3252) instead of the undefined `filteredVenues()`. Map view will no longer throw a `ReferenceError`.

---

### Issue 8 — Walk photo background hardcoded hex
**Status: FIXED ✅**

All three instances updated to `var(--brand)`:
- CSS `.walk-photo`: `background: var(--brand)` (line 767) ✅
- `renderWalkCard()` JS: `'background:var(--brand);'` (line 2591) ✅
- `renderPortraitCard()` JS: `'background:var(--brand);'` (line 2636) ✅

---

### New Issue A — Paw safety safe state never renders
**Status: NEW — fix required**

**Location:** `getPawSafety()` (line 2035), `renderWeatherTab()` (line 2154)

`getPawSafety()` returns `null` for temperatures between 0–25°C (i.e., normal UK conditions):
```js
if (temp > 25) return { state: 'danger', ... };
if (temp <= 0)  return { state: 'caution', ... };
return null;  // ← safe state
```

When `paw` is `null`, the `if (paw)` guard at line 2154 skips rendering entirely. The paw safety block is absent from the Weather tab for the vast majority of UK walks. The approved spec (copy-review.md Section 8) defines a three-state block, with the safe state providing ambient reassurance: `🐾 Paws safe at [X]°C`.

Additionally, the `pawClass` ternary at line 2155 (`paw.state === 'danger' ? 'danger' : 'caution'`) would incorrectly render a hypothetical `state: 'safe'` return as amber/caution styling.

**Fix:**
1. In `getPawSafety()`, replace `return null` with the safe state return:
   ```js
   return {
     state: 'safe',
     title: '🐾 Paws safe at ' + Math.round(temp) + '°C',
     body: 'At ' + Math.round(temp) + '°C, pavement is fine. If it gets above 25°C, press your hand on the tarmac — if you can\'t hold it for 7 seconds, it\'s too hot for your dog\'s paws.'
   };
   ```

2. In `renderWeatherTab()`, fix the class logic to handle all three states:
   ```js
   var pawClass = paw.state === 'danger' ? 'danger' : paw.state === 'caution' ? 'caution' : '';
   ```

---

### Round 3 card sizing and filter sheet
**Status: NOT YET IMPLEMENTED — expected**

The following Round 3 specs from `design-review-round3.md` have not been applied to `sniffout-v2.html`:

| Item | Spec | Current state |
|------|------|---------------|
| `.trail-card` width | 240px | 200px |
| `.trail-card-photo` height | 180px | 120px |
| `.trail-card-name` size | 15px/600 | 14px/600 |
| `.trail-card-desc` | New 2-line description element | Not present |
| `.gs-card` layout | Horizontal flex row + 64×64px thumbnail | Column layout with full-width 140px photo |
| `.gs-thumb` | New thumbnail class | Not present |
| Filter/sort bottom sheet | Full sheet with 7 filter groups | Inline radius picker only (4 chips) |
| `.filter-btn.has-filter` indicator | Green dot via `::after` | Not present |

These are correctly deferred — they are the input to the next developer brief and have not been instructed yet.

**Note:** `.gs-nearby-badge` CSS still exists in the stylesheet (lines 1254–1259) but is no longer rendered in `renderGsCard()`. This is dead CSS — safe to remove when the next developer pass applies the Round 3 gs-card layout changes.

**Note:** `.gs-maps-link` is now in both the CSS and `renderGsCard()` HTML ✅ — the Round 5 FIX 6.3 Maps link is correctly implemented.

---

## Part 2 — Design Recommendations: Today Tab & Weather Tab

These are forward-looking recommendations. Each item is rated by impact and implementation effort.

---

### TODAY TAB — State A

**TA-1 (Medium impact / Trivial effort): Social proof — "Live conditions" should be "Works offline"**

Current (line 1377): `25 handpicked UK walks · Live conditions · Dog-specific routes`
Approved string (copy-review.md): `[N] handpicked UK walks · Works offline · Dog-specific routes`

"Works offline" is a genuine differentiator — it communicates PWA behaviour. "Live conditions" is already communicated by the subline ("Handpicked walks. Live conditions.") directly above. Replace.

---

**TA-2 (Low impact / Trivial effort): Hero body copy references "25 handpicked UK walks" — align with social proof strip**

Line 1329 (hero body): "25 handpicked UK walks with terrain…"
Line 1377 (social proof): "25 handpicked UK walks · …"

Both are correct and internally consistent. When the WALKS_DB reaches 50+, both strings need updating. Flag for the developer: update both locations together when the database is complete.

---

### TODAY TAB — State B

**TB-1 (Medium impact / Small effort): Third weather pill duplicates data**

The weather hero renders three pills (lines 2120–2122):
```
💧 [humidity]%  |  💨 [wind] km/h  |  Feels [feels]°C
```

The third pill ("Feels X°C") duplicates `weather-hero-feels` text which already shows `"Feels like X°C"` directly in the hero card. This wastes a pill slot. Replace the third pill with today's maximum precipitation probability, which is actionable and non-duplicated:

```js
// Replace "Feels [feels]°C" pill with:
var maxPrecip = getMaxPrecipProb(hourly); // peak rain probability next 12h
'<span class="weather-pill">☔ ' + maxPrecip + '%</span>'
```

If precipitation probability is unavailable, fall back to WMO description text (e.g. "Sunny spells").

---

**TB-2 (Medium impact / Small effort): Verdict body card position — buried below walk cards**

In `renderTodayStateB()` the content order is:
1. Weather hero
2. Hazard cards (conditional)
3. Today walks section (6 portrait cards)
4. **Verdict body card** (`today-conditions-card`) — "Wet and cold — make it a quick one. Short loop is fine..."
5. Hidden gems section

The verdict body is the most important behavioural guidance on the tab — it tells the user exactly what to do today. Currently it appears after the walk cards, which means a user who stops scrolling at the walks misses it entirely.

**Recommended reorder:**
1. Weather hero
2. Verdict body card — immediately below the hero, before walks
3. Hazard cards (conditional)
4. Today walks section
5. Hidden gems section

This ensures the key recommendation is visible without scrolling, while walks remain discoverable beneath it.

---

**TB-3 (Low impact / Trivial effort): Today tab `today-conditions-card` hardcoded styles**

The `.today-conditions-card` element uses a CSS class ✅ — but the conditions body and link inside it are styled inline. Extract to `.today-conditions-body` and `.today-conditions-link` classes for consistency with the rest of the app's pattern of CSS classes over inline styles. (Minor — only matters when introducing dark mode or design token changes.)

---

### WEATHER TAB

**WT-1 (High impact / Small effort): Verdict block uses inline styles — extract to CSS class**

`renderWeatherTab()` line 2172–2175:
```js
'<div style="padding:0 16px 12px">' +
  '<div style="font-size:16px;font-weight:600;color:var(--ink);padding:8px 0 6px;">' + verdict.title + '</div>' +
  '<p style="font-size:13px;color:var(--ink-2);line-height:1.5;">' + verdict.body + '</p>' +
'</div>'
```

All other content blocks use CSS classes. This inline-styled block visually reads as an orphaned div above the hazard cards — it has no card container, no background, no border. It lacks the visual closure that signals "this content is complete."

**Recommended fix:** Wrap in a proper card using the existing `.today-conditions-card` pattern (which already has the correct styling: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 16px`, `padding: 14px 16px`). This is the same verdict treatment used on the Today tab. Reuse:

```js
'<div class="today-conditions-card" style="margin:0 16px 12px">' +
  '<div class="today-conditions-body">' + verdict.title + '<br>' + verdict.body + '</div>' +
'</div>'
```

Or introduce a `.weather-verdict-block` class if the Weather tab treatment should differ.

---

**WT-2 (High impact / Small effort): Expand forecast from 3 days to 5 days**

`buildForecastGrid()` limits to `Math.min(4, daily.time.length)` and starts from index 1, yielding a maximum of 3 forecast days (Tomorrow, +2, +3). The Open-Meteo `daily` response supports 7 days.

The forecast section is the most valuable part of the Weather tab for trip planning — walkers want to know if the weekend looks good. 3 days is insufficient.

**Recommended:**
- Change limit to `Math.min(7, daily.time.length)` — yields up to 6 forecast days
- Change forecast grid from `repeat(3, 1fr)` to `repeat(4, 1fr)` for days 1–4 (Tomorrow through day 4), with overflow wrapping for days 5–6 if present
- Or use a horizontal scroll row for 5–6 forecast cards (consistent with the portrait card pattern used elsewhere)

The simplest approach: change limit to `Math.min(6, ...)` and let the existing `3-column grid` wrap to two rows (3+3). This requires no CSS change and gives 5 days of forecast.

---

**WT-3 (Medium impact / Trivial effort): Forecast card description text too small**

`buildForecastGrid()` line 2229: `font-size: 11px` for the WMO description text (e.g. "Light rain showers").

At 11px this text is at the lower edge of readability on a mobile screen. The forecast card is already compact at `border-radius: 12px; padding: 14px 8px`. Increase to 12px to match the `condition-label` size used in the conditions grid.

Change CSS `.forecast-card` body text from `font-size: 11px` to `font-size: 12px`:
```css
/* In buildForecastGrid, change inline style: */
'<div style="font-size:12px;color:var(--ink-2);">' + desc + '</div>'
```

---

**WT-4 (Medium impact / Small effort): Section separator between paw safety and walk window**

The Weather tab content flows: conditions grid → paw safety → walk window title → hour bar → rain summary → best window → legend → forecast. The transition from paw safety to the walk window is abrupt — two visually distinct sections with no divider.

Add a `section-header` separator row before the walk window title, consistent with the "3-day forecast" separator already present:

```js
'<div class="section-header"><div class="section-title">Walk window</div></div>' +
'<div class="walk-window">' +
  barHTML + ... +
'</div>'
```

This wraps the bar + summaries in a contained section and adds the same visual cadence used before the forecast grid.

---

**WT-5 (Low impact / Trivial effort): Conditions grid — add "Rain today" cell**

The conditions grid currently shows 3 cells: Feels like / Wind km/h / Humidity. Humidity is the least actionable metric for a dog walker — it doesn't change behaviour.

Replace humidity with "Rain today" — the peak precipitation probability for the next 12 hours. This directly answers "will I get wet?" which is the primary weather concern.

```js
// Replace humidity cell:
'<div class="condition-cell"><div class="condition-value">' + maxPrecip + '%</div><div class="condition-label">Rain chance</div></div>'
```

`maxPrecip` = `Math.max(...hourly.precipitation_probability.slice(currentHour, currentHour + 12))`.

The grid remains 3 cells. One change. Significant improvement in relevance.

---

## Summary Table

### Round 1 issues
| # | Issue | Status |
|---|-------|--------|
| 1 | Dark mode `--brand` override | ✅ Fixed |
| 2 | Dark mode preview card tints | ✅ Fixed |
| 3 | Section label hierarchy | ✅ Fixed |
| 4 | Walk tag style inconsistency | ⚠️ Partial — `ol.cls` not passed in trail card; `.trail-tag.partial` CSS missing |
| 5 | Trail card missing heart button | ✅ Fixed |
| 6 | gs-card border-radius 12px | ✅ Fixed |
| 7 | `filteredVenues()` undefined | ✅ Fixed |
| 8 | Walk photo hardcoded hex | ✅ Fixed |

### New issues
| # | Issue | Priority |
|---|-------|----------|
| A | Paw safety safe state never renders | High |

### Round 3 (not yet implemented — expected)
| Item | Status |
|------|--------|
| Trail card sizing (240px, 180px photo, description) | Pending developer brief |
| GS card horizontal thumbnail layout | Pending developer brief |
| Filter/sort bottom sheet | Pending developer brief |

### Today / Weather tab recommendations
| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| TA-1 | Social proof: "Live conditions" → "Works offline" | Medium | Trivial |
| TB-1 | Replace duplicate "Feels" weather pill with rain probability | Medium | Small |
| TB-2 | Move verdict body card above walks section | Medium | Small |
| WT-1 | Verdict block: extract inline styles to card class | High | Small |
| WT-2 | Expand forecast from 3 to 5 days | High | Small |
| WT-3 | Forecast description text: 11px → 12px | Medium | Trivial |
| WT-4 | Add section separator before walk window | Medium | Trivial |
| WT-5 | Replace humidity with rain chance in conditions grid | Low | Trivial |
