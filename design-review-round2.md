# Sniffout v2 — Design Review Round 2
*Issued by Designer. March 2026.*
*Based on: designer-brief-round2.md, design-verification-round1.md, sniffout-v2.html, po-action-plan.md, CLAUDE.md*

---

## Part 1 — Verification Sweep (FIX 5.1–5.9)

All V1–V9 checks **PASS**. Every fix from Round 1 is correctly implemented in the current build.

| Check | Fix | Result | Location |
|-------|-----|--------|----------|
| V1 | Dark mode `--brand: #6EE7B7` override | ✅ PASS | Line 1036 |
| V2 | `nearbyVenues.forEach()` (no `filteredVenues` ref) | ✅ PASS | Line 3252 |
| V3 | `.walks-section-label-sm` for green spaces section | ✅ PASS | Line 2786 |
| V4 | Trail heart button — `position: absolute; top: 8px; right: 8px` | ✅ PASS | CSS 1382–1396, JS line 2933 |
| V5 | Trail tag `ol.cls` passed + `.trail-tag.partial` amber variant defined | ✅ PASS | CSS 1424–1441, JS line 2942 |
| V6 | Dark mode preview card tints | ✅ PASS | Lines 1227–1231 |
| V7 | Walk photo placeholder `background: var(--brand)` | ✅ PASS | Lines 767, 2591, 2636 |
| V8 | `.gs-card border-radius: 16px` | ✅ PASS | Line 1448 |
| V9 | `badge: 'Sniffout Pick'` (singular) restored | ✅ PASS | Lines 2528, 2628, 2658 |

No regressions detected from Round 1 fixes.

---

## Part 2 — Today Tab Focused Review (T1–T5)

### T1 — Weather Hero
**Status: PASS with note**

The weather hero block is correctly implemented:
- `background: var(--brand)`, `border-radius: 16px`, `padding: 20px`
- Temperature: 36px/700 white
- Verdict: 15px/600 white
- Condition pills: white background, `var(--ink)` text, `border-radius: 20px`

**Note (no action required):** The weather condition icon is rendered as an emoji at `font-size: 46px` rather than an SVG. This is acceptable for Phase 2 — emoji rendering is consistent cross-platform for weather symbols. No change needed unless the owner requests SVG icons.

---

### T2 — Today Walk Scroll (horizontal portrait cards)
**Status: PASS**

- `.portrait-card`: 160px wide, `border-radius: 16px`, heart icon present
- Horizontal scroll container: `scrollbar-width: none` — no visible scrollbar on mobile ✅
- Consistent with the approved portrait card pattern

---

### T3 — Hazard Cards
**Status: PASS**

- `.hazard-card`: `border-radius: 12px`, `border-left: 4px solid` accent
- Amber variant (`border-left-color: var(--amber)`) and red variant (`border-left-color: var(--red)`) both defined ✅
- Title: 14px/600, Body: 13px/`var(--ink-2)` ✅

---

### T4 — Seasonal Tip
**Status: NOT APPLICABLE**

There is no standalone "seasonal tip" card component in the current build. The `today-hidden-gems` section renders portrait walk cards (hidden gems from WALKS_DB) rather than a tip card. This is an accepted implementation choice — the section provides value without requiring a bespoke tip system. No action required.

---

### T5 — Dark Mode State B
**Status: PASS**

Weather hero text uses hardcoded `color: #fff` within `.weather-hero`. In night mode, `var(--brand)` resolves to `#6EE7B7` (light teal background) — white text on teal maintains acceptable contrast. ✅

---

### New Issues — Today Tab

#### TB-1 — Third weather pill duplicates hero temperature
**Priority: Low**
**Location:** Line 2357 (renderTodayStateB)

The third condition pill shows "Feels X°C" — this duplicates information already displayed in the hero temperature block. Consider replacing with a more useful value (UV index, wind, or humidity). However, this is a content decision for the PO to confirm, not a blocker.

**Recommendation:** Replace the third pill with UV index when available, or wind speed. Flag to PO.

---

#### TB-2 — Verdict body renders after walk cards
**Priority: Medium**
**Location:** Line 2362 — walk cards render before verdict detail body

In `renderTodayStateB()`, the walk scroll section is inserted before the verdict detail/body text. This means the user sees walk cards before the weather context that explains the recommendation. The information hierarchy is inverted.

**Recommendation:**
Move the verdict body text (secondary explanation of the walk verdict) to appear directly below the weather hero — before the walk scroll section. Correct order:

```
[Weather hero — verdict headline + temp + pills]
[Verdict body — 1–2 sentence explanation]
[Today's walks — horizontal scroll]
[Hazard cards — if any]
[Hidden gems]
```

**CSS impact:** None. Pure JS/HTML ordering change in `renderTodayStateB()`.

---

## Part 3 — Weather Tab Focused Review (W1–W4)

### W1 — Conditions Grid
**Status: PASS with recommendation**

- 3 cells: Feels Like / Wind / Humidity
- `border-radius: 12px` ✅
- `.condition-value`: 18px/600 ✅
- `.condition-label`: 11px ✅

**Recommendation (WT-5 from design-verification-round1.md):**
Replace the Humidity cell with Rain Chance. Humidity is the least actionable metric for a dog walker. Rain chance (available as `precipitation_probability` in the Open-Meteo hourly data) is more directly relevant to the go/no-go decision.

Proposed cell set: **Feels Like / Wind / Rain Chance**
- Label: "Rain chance"
- Value: `X%` from `hourly.precipitation_probability[currentHourIndex]`

---

### W2 — Paw Safety Block
**Status: SPECIFICATION CONFLICT — REQUIRES PO DECISION**

**The conflict:**
- `designer-brief-round2.md` (W2) states: the paw safety block **must NOT render at normal temperatures** (only shown when dangerous or cautionary)
- Current `sniffout-v2.html` (lines 2276–2277): `getPawSafety()` now returns a safe-state object for 0–25°C, causing the block to render in all conditions

Both approaches have merit:
- **Brief approach (hide at normal temps):** Cleaner — avoids showing a "paw safety: safe" message that adds no value in typical UK conditions. Less visual noise.
- **Current approach (always show):** Reassuring for anxious owners; consistent block presence prevents layout shift between conditions.

**Designer recommendation:** Revert to the brief specification — **hide the paw block at normal temperatures**. The block should only appear when there is an actual message to communicate (caution ≥ 25°C, danger ≥ 35°C). A perpetual "paw safety: safe" in 15°C British drizzle adds noise.

**Implementation spec (if brief approach adopted):**
```js
// getPawSafety() — return null for normal temps
function getPawSafety(tempC) {
  if (tempC >= 35) return { state: 'danger', ... };
  if (tempC >= 25) return { state: 'caution', ... };
  return null; // do not render
}
```
The `renderWeatherTab()` paw block should guard: `if (paw) { ... }` — already present in earlier version.

**Action required:** PO to confirm which behaviour is correct before Developer implements. Flag as open decision.

---

### W3 — Weather Info Modal
**Status: PASS with minor recommendation**

- `border-radius: 20px 20px 0 0` ✅
- Backdrop tap closes modal ✅
- Correct content sections ✅

**Minor recommendation (low priority):**
The modal currently appears/disappears via `display: flex / none` toggle — it snaps open instantly. A slide-up animation would match the filter sheet behaviour and feel more native.

```css
.weather-info-modal {
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.weather-info-modal.open {
  transform: translateY(0);
}
```

Toggle class `open` on the element instead of `display` to enable the animation. Low priority — acceptable without this for Phase 2.

---

### W4 — Dark Mode Weather Tab
**Status: PASS**

Conditions grid cells use `var(--surface)` which resolves to `#1A2C22` (dark green) in night mode. Text uses `var(--ink)` and `var(--ink-2)` which resolve to their night mode overrides. Legible and consistent. ✅

---

### New Issues — Weather Tab

#### WT-1 — Verdict block uses inline styles, not a card class
**Priority: Low**
**Location:** Lines 2407–2410

The walk verdict on the Weather tab is rendered as a plain `<div>` with inline `background`, `border-radius`, `padding`, and `margin` styles — not a reusable CSS class. This is a minor code quality issue.

**Recommendation:** Extract to `.verdict-card` CSS class for consistency. Not a visual regression.

---

#### WT-2 — Forecast limited to 3 days
**Priority: Low**
**Location:** Line 2450 — `Math.min(4, daily.time.length)` (renders 3 rows: index 0–2 is today + 2 days)

The brief recommended expanding the forecast to 5 days. Open-Meteo provides up to 7 days of daily forecast data at no cost.

**Recommendation:** Change `Math.min(4, ...)` to `Math.min(6, ...)` to render 5 days (today + 4). This does not require any additional API parameters — daily data is already fetched.

---

#### WT-3 — Forecast description text at 11px
**Priority: Low**
**Location:** Line 2464

Forecast condition description text is 11px — below the 12px minimum for body text on mobile. Increase to 12px.

---

## Part 4 — New Components Review (N1–N3)

### N1 — Venue Photos in Nearby Tab
**Status: PASS**

- `.venue-card-photo-gp`: 140px height, `background: var(--brand)` fallback when no photo URL ✅
- `object-fit: cover`, `overflow: hidden` on card ✅
- No broken image icon, no empty space — placeholder fills correctly ✅

---

### N2 — Enclosed Chip on Trail Cards
**Status: PASS**

- `enclosedTag` present in `renderTrailCard()` at line 2928 ✅
- Uses `.trail-tag` class (no border — `.trail-tag` has no `border` property) ✅
- Consistent with other trail tag chips ✅

---

### N3 — Green Spaces Section (Walks Tab)
**Status: PASS with dead code note**

- `.walks-section-label-sm` used for "Other nearby green spaces" heading ✅
- `.gs-card border-radius: 16px` ✅
- Round 3 horizontal thumbnail layout implemented ✅ (64×64px `.gs-thumb`, name/distance/Maps link column)

**Dead code note:** `.gs-nearby-badge` CSS class exists in the stylesheet but the `gs-nearby-badge` element is never rendered in JS. This is a leftover from an earlier design iteration. No visual impact — harmless — but can be removed in a future cleanup pass.

---

## Part 5 — Outstanding Items Priority Summary

Items requiring Developer action, in priority order:

| Priority | ID | Issue | Action |
|----------|----|-------|--------|
| **DECISION REQUIRED** | W2 | Paw safety at normal temps — conflicting specs | PO to confirm: hide at normal temps (brief) or always show (current) |
| Medium | TB-2 | Verdict body renders after walk cards — inverted hierarchy | Reorder `renderTodayStateB()`: verdict body before walk scroll |
| Low | WT-2 | Forecast capped at 3 days | Change `Math.min(4,...)` to `Math.min(6,...)` |
| Low | WT-3 | Forecast description text 11px | Increase to 12px |
| Low | WT-5 | Humidity cell — least actionable | Replace with Rain Chance (`precipitation_probability`) |
| Low | TB-1 | Third weather pill duplicates hero temp | Replace with UV index or wind — PO to confirm |
| Low | WT-1 | Verdict uses inline styles | Extract to `.verdict-card` CSS class |
| Low | W3 | Info modal has no slide animation | Add CSS transform transition (matches filter sheet) |
| No action | N3 | `.gs-nearby-badge` dead CSS | Remove in future cleanup pass only |

---

## Summary

All 9 verification checks from Round 1 (V1–V9) **pass**. No regressions.

Today tab (T1–T5): Structurally sound. Two content/ordering issues to address (TB-1, TB-2), neither a visual regression.

Weather tab (W1–W4): One specification conflict requiring PO decision (W2 paw safety). Three low-priority polish items (WT-2, WT-3, WT-5).

New components (N1–N3): All implemented correctly per spec. One piece of dead CSS (`.gs-nearby-badge`) — harmless.

The build is shippable at current quality. TB-2 (verdict body ordering) is the highest-confidence fix to apply in the next developer session. W2 must be resolved by PO before implementation.
