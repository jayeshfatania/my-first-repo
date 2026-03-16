# Developer Brief — Round 7

*Issued by: Product Owner*
*Date: March 2026*
*Based on: design-review-round2.md, po-action-plan.md*
*File: sniffout-v2.html only*

---

## Context

Design Review Round 2 passed all 9 Round 1 verification checks (V1–V9) with no regressions. This brief covers the fixes identified in Parts 2–5 of the review. All items are in `sniffout-v2.html` only.

One item from the review (TB-1 — third weather pill) requires an owner decision before implementation and is **not included in this brief**. See the open decision flag at the end.

---

## FIX 8.1 — Reorder Today tab State B: verdict body before walk scroll

**Location:** `renderTodayStateB()` — currently line ~2362

**Issue:** Walk cards are inserted before the verdict detail body text, inverting the information hierarchy. The user sees walk recommendations before the weather context that justifies them.

**Fix:** Reorder the HTML output inside `renderTodayStateB()` so that the content renders in this sequence:

```
1. Weather hero card (verdict headline + temp + pills)
2. Verdict body text (1–2 sentence walk verdict explanation)
3. Today's walks — horizontal portrait card scroll
4. Hazard cards (if any)
5. Hidden gems section
```

This is a pure HTML ordering change in the JS string assembly. No CSS changes required. No new elements — only the relative position of the verdict body block and the walk scroll section is swapped.

---

## FIX 8.2 — Expand forecast from 3 days to 5 days

**Location:** `renderWeatherTab()` forecast loop — currently `Math.min(4, daily.time.length)`

**Issue:** `Math.min(4, ...)` renders today + 2 additional days (indices 0, 1, 2 = 3 rows). Open-Meteo provides 7 days of daily data at no cost. The brief recommended 5 days.

**Fix:** Change the limiter from `4` to `6`:

```js
// Before
var days = Math.min(4, daily.time.length);

// After
var days = Math.min(6, daily.time.length);
```

This renders today + 4 additional days (indices 0–4 = 5 rows). No additional API parameters needed — daily data is already fetched.

---

## FIX 8.3 — Forecast description text: 11px → 12px

**Location:** Forecast condition description text — currently line ~2464

**Issue:** Forecast day description text is rendered at 11px, below the 12px minimum for body text on mobile.

**Fix:** Find the CSS rule or inline style setting the forecast description to `font-size: 11px` and update to `font-size: 12px`. This applies to the condition description line within each forecast day row — not the temperature or day label text.

---

## FIX 8.4 — Replace Humidity with Rain Chance in conditions grid

**Location:** `renderWeatherTab()` conditions grid — the Humidity cell

**Issue:** Humidity is the least actionable metric for a dog walker in isolation. Rain chance is more directly useful for the go/no-go decision and is already available in the Open-Meteo response.

**Fix:** Replace the Humidity grid cell with Rain Chance:

- **Label:** `Rain chance`
- **Value:** `precipitation_probability` from the Open-Meteo hourly data at `currentHourIndex`
- **Format:** `X%` (e.g. `"34%"`)

The `currentHourIndex` is already used elsewhere in `renderWeatherTab()` to pull the current hour's data — use the same index for `precipitation_probability`.

The updated conditions grid will be: **Feels Like · Wind · Rain Chance**

Do not remove humidity from the data fetch or any hazard logic — it may feed into heat index calculations elsewhere. Only remove it from the visible grid cell.

---

## FIX 8.5 — Paw safety: show only in extreme or dangerous conditions

**Location:** `getPawSafety(tempC)` function

**Issue:** Issue A fix (Round 6) changed `getPawSafety()` to return a safe-state object for 0–25°C, causing the paw safety block to render at all normal UK temperatures. Owner confirms: the block must only appear when there is a genuine risk to communicate.

**Fix:** Revert `getPawSafety()` to a trigger-only model:

```js
function getPawSafety(tempC) {
  if (tempC >= 35) {
    return {
      state: 'danger',
      title: 'Too hot for paws',
      body: 'Pavement can reach 70°C in direct sun at this temperature. Use the 7-second test — press your hand on the tarmac. If you can\'t hold it for 7 seconds, it\'s too hot for your dog\'s paws.'
    };
  }
  if (tempC >= 25) {
    return {
      state: 'caution',
      title: 'Paw check needed',
      body: 'At ' + Math.round(tempC) + '°C, pavement may be getting warm. Press your hand on the tarmac before setting off — if it\'s uncomfortable to hold for 7 seconds, choose a shaded route or walk on grass.'
    };
  }
  if (tempC <= 0) {
    return {
      state: 'caution',
      title: 'Paw check needed',
      body: 'Freezing temperatures mean ice and grit on paths. Rinse paws when you get back — road salt can irritate skin if licked.'
    };
  }
  return null;
}
```

**Thresholds:**
- `tempC >= 35` → danger (hot pavement, definitely unsafe)
- `tempC >= 25` → caution (pavement may be getting warm)
- `tempC <= 0` → caution (ice and gritting risk — owner explicitly listed ice as a trigger condition)
- Everything else → `null` (no block rendered)

The `if (paw)` guard in `renderWeatherTab()` is already in place from the earlier build — the block will simply not render when `getPawSafety()` returns null. No change needed to the rendering logic.

**Copy note:** The body copy above uses the tone established in po-action-plan.md (7-second test, specific and actionable). If the PO has approved specific copy strings for these states in a copy document, those take precedence over the placeholder copy above.

---

## FIX 8.6 — Extract walk verdict inline styles to `.verdict-card` CSS class

**Location:** Walk verdict block on Weather tab — lines ~2407–2410

**Issue:** The walk verdict on the Weather tab is rendered with inline `background`, `border-radius`, `padding`, and `margin` styles rather than a CSS class. Minor code quality issue — no visual regression.

**Fix:** Add a `.verdict-card` CSS class to the `<style>` block with the inline values extracted, and replace the inline styles on the verdict element with `class="verdict-card"`. Values to extract should match whatever is currently hardcoded inline (do not change the visual appearance).

---

## FIX 8.7 — Add slide-up animation to weather info modal

**Location:** `.weather-info-modal` CSS; `openWeatherModal()` and `closeWeatherModal()` functions

**Issue:** The weather info modal currently opens/closes via `display: flex / none` — it snaps open instantly. The filter sheet uses a CSS transform transition. The modal should match this behaviour for consistency.

**Fix:**

**CSS:** Replace `display: flex / none` toggle approach with a transform-based show/hide:

```css
.weather-info-modal {
  display: flex;           /* always in layout */
  transform: translateY(100%);
  transition: transform 0.3s ease;
  pointer-events: none;
}
.weather-info-modal.open {
  transform: translateY(0);
  pointer-events: auto;
}
```

**JS:** In `openWeatherModal()`, add class `open` to `#weather-info-modal` (and remove it in `closeWeatherModal()`) instead of toggling `display`.

Ensure the modal backdrop visibility is also toggled consistently — if the backdrop uses `display: none`, update it to match the same pattern so backdrop and modal animate in sync.

---

## FIX 8.8 — Remove dead `.gs-nearby-badge` CSS

**Location:** `<style>` block — `.gs-nearby-badge` rule

**Issue:** The `.gs-nearby-badge` element was removed from `renderGreenSpaceCard()` in FIX 6.2 but the CSS rule was left in place as a harmless unused rule. Round 2 review flagged it as dead code.

**Fix:** Delete the `.gs-nearby-badge` CSS rule from the `<style>` block. Confirm no element in the HTML or JS references this class before deleting.

---

## FIX 8.9 — Replace third Today tab pill: "Feels X°C" → Wind speed

**Location:** `renderTodayStateB()` — third condition pill, currently line ~2357

**Issue:** The third condition pill shows "Feels X°C", duplicating the feels-like temperature already prominent in the weather hero block. Owner confirmed: replace with wind speed.

**Fix:** Update the third pill to display wind speed:

- **Value:** `windspeed_10m` from the current weather data (already fetched as part of the Open-Meteo response used in `renderTodayStateB`)
- **Format:** `X km/h` (e.g. `"18 km/h"`)
- **Label/display:** The pill should read something like `💨 18 km/h` — consistent with how the other pills are formatted in context

The "Feels X°C" pill is removed entirely and replaced with the wind speed pill. No new API calls needed — wind speed is already present in the weather data object.

---

## Summary

| Fix | Description | Area | Complexity |
|-----|-------------|------|------------|
| FIX 8.1 | Reorder verdict body before walk scroll in Today State B | Today tab | Low |
| FIX 8.2 | Expand forecast from 3 to 5 days | Weather tab | Trivial |
| FIX 8.3 | Forecast description text 11px → 12px | Weather tab | Trivial |
| FIX 8.4 | Replace Humidity with Rain Chance in conditions grid | Weather tab | Low |
| FIX 8.5 | Paw safety: trigger-only (≥35°C danger, ≥25°C caution, ≤0°C caution, otherwise null) | Weather tab | Low |
| FIX 8.6 | Extract verdict inline styles to `.verdict-card` class | Weather tab | Trivial |
| FIX 8.7 | Slide-up animation on weather info modal | Weather tab | Low |
| FIX 8.8 | Remove dead `.gs-nearby-badge` CSS | Stylesheet | Trivial |
| FIX 8.9 | Replace "Feels X°C" third pill with wind speed on Today tab | Today tab | Trivial |
