# Today Tab Hero Card - Design Spec v2
**Date:** 2026-03-27
**Status:** Designer-approved. Supersedes spec-today-hero-march-27.md entirely.
**Author:** Designer agent

---

## Pre-spec findings from code reading

**Function signatures and availability:**

`renderTodayStateB` signature at line 6659:
```javascript
function renderTodayStateB(cur, verdict, hazards, daily)
```
`hourly` is NOT a current parameter. The brief states it is - this is incorrect. The function must have `hourly` added as a fifth parameter, and the call site at line 7294 must be updated accordingly. This affects Section 3 and is called out explicitly in the JS changes.

`getBestWindowTime(hourly)` at line 6760 returns an object: `{ time: "Xam - Ypm", isTomorrow: boolean }`. It always returns a value - there is no null/empty case. For the avoid state "omit if no good window exists today", the correct check is `winResult.isTomorrow === true` - if the best slot is tomorrow, the condition is today-only and the line is omitted.

**Rain chance logic reference:** `maxRainProb` in `renderWeatherTab` is calculated at lines 6848-6856 as maximum `precipitation_probability` from current hour to end of day. For the hero card pills, the brief specifies next 12 hours only - a tighter window. The JS in this spec uses `hNow + 12` as the ceiling.

**`heroClass` declaration is at line 6710.** Usage is at line 6713. The brief references lines 6719 and 6722 - those are not the heroClass lines in the current code. All line numbers in this spec reflect actual file state.

**`luIcon(verdict.icon, 20)` is at line 6723** (not 6732 as stated in the brief).

**Weather tab:** `daily` is passed to `renderWeatherTab` (line 6833 signature). `daily.sunrise[0]` and `daily.sunset[0]` are available and fetched (confirmed line 6062). Both are ISO strings e.g. `"2026-03-27T06:43"`. Time-only parsing logic already exists at line 6684.

**`.weather-hero-divider`** has `display: none` (lines 4019-4021). Both instances in the JS string (lines 6730, 6737) are invisible. Both are removed.

**Card bottom padding** is currently `16px` (from `padding: 20px 20px 16px 20px` at line 800), not 20px as the brief implies. The new footer row takes over bottom spacing with `padding-bottom: 20px`. Card bottom padding becomes `0`.

---

## Section 1 - Card background: gradient shift by state

### Gradient values

**Default (approved / no verdict modifier):**
```css
background: linear-gradient(145deg, #3E6622 0%, #2C4A14 55%, #243D10 100%);
```
Starts lighter and warmer in the top-left, settles at brand green, deepens slightly toward the bottom-right. Feels energetic and welcoming.

**Caution / caveat:**
```css
background: linear-gradient(145deg, #2C4A14 0%, #263F12 55%, #1F3410 100%);
```
Anchored at brand green, a steady descent toward darker tone. Neutral - doesn't alarm, signals measured attention.

**Avoid:**
```css
background: linear-gradient(145deg, #243D10 0%, #1A2D0B 55%, #152408 100%);
```
Approximately 20% darker across all stops. The card feels heavier, more serious. Still clearly green - not alarming, not dark enough to read as danger, but with weight.

All three use the same hue family and 145deg direction. The difference is lightness only. At normal viewing distance on a phone, the avoid variant will feel noticeably subdued compared to default without looking like a different card.

### Radial glow

A new `.weather-hero-glow` element, added as the first child inside `.weather-hero` in the JS HTML string. It uses `position: absolute` and is clipped by the existing `overflow: hidden` on `.weather-hero`.

```css
.weather-hero-glow {
  position: absolute;
  top: -60px;
  left: -60px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
}
```

7% white opacity. Not visible as a design element - adds surface warmth that reads as material depth.

### Updated box-shadow

The base `.weather-hero` box-shadow replaces the current value with a deeper spread and both inset borders:

```css
box-shadow:
  0 12px 36px rgba(44,74,20,0.28),
  0 4px 12px rgba(44,74,20,0.18),
  inset 0 1px 0 rgba(255,255,255,0.13),
  inset 0 -1px 0 rgba(0,0,0,0.12);
```

The top inset simulates light catching the card edge. The bottom inset grounds the card against the background. Both are subliminal.

---

## Section 2 - Typography

### .weather-hero-temp (line 832)

```css
.weather-hero-temp {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -3.5px;
  line-height: 0.95;
}
```

Changes from current: `font-size` 36px → 56px, `letter-spacing` -2px → -3.5px, add `line-height: 0.95`.

### .weather-hero-top (line 826)

Remove `margin-bottom: 12px`. The verdict title's `margin-top` controls the gap between the temp block and the verdict text.

```css
.weather-hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
}
```

### .weather-verdict (lines 834-843)

Remove `display: flex`, `align-items: center`, `gap: 8px`. These supported the icon that is being removed. Add `margin-top: 18px`.

```css
.weather-verdict {
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.18;
  margin-top: 18px;
}
```

### .weather-verdict > svg (line 844)

Delete this rule entirely. The verdict icon is removed, so this selector matches nothing.

```
line 844: .weather-verdict > svg { flex-shrink: 0; }   ← DELETE
```

### .weather-hero-body (lines 4022-4030)

```css
.weather-hero-body {
  font: 400 14px/1.6 'Plus Jakarta Sans', sans-serif;
  color: rgba(255,255,255,0.72);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 5px;
  margin-bottom: 0;
}
```

Changes: `line-height` 1.55 → 1.6 (in the font shorthand), `color` rgba(255,255,255,0.85) → rgba(255,255,255,0.72), add `margin-top: 5px`.

---

## Section 3 - Best window line

### Critical prerequisite: function signature update

`renderTodayStateB` must accept `hourly` as a fifth parameter. Without this change, `getBestWindowTime` cannot be called.

**Line 6659 - update function signature:**

Current:
```javascript
function renderTodayStateB(cur, verdict, hazards, daily) {
```

New:
```javascript
function renderTodayStateB(cur, verdict, hazards, daily, hourly) {
```

**Line 7294 - update call site:**

Current:
```javascript
renderTodayStateB(cur, verdict, hazards, daily);
```

New:
```javascript
renderTodayStateB(cur, verdict, hazards, daily, hourly);
```

`hourly` is available at the call site - it is used at line 7290 for `getWalkVerdict(cur, hourly)`.

### CSS

Add after `.weather-hero-body` closing brace (after line 4030):

```css
.weather-hero-window {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  margin-top: 12px;
}
```

### JS variable - add to renderTodayStateB

Insert the following block after the `pawInline` variable declaration (after line 6707), before `verdictLabel`:

```javascript
var windowHtml = '';
if (hourly) {
  var winResult = getBestWindowTime(hourly);
  if (verdict.type === 'approved' || verdict.type === 'caution' || verdict.type === 'caveat') {
    windowHtml = '<div class="weather-hero-window">' +
      luIcon('clock', 12) + ' Best window: ' + winResult.time +
    '</div>';
  } else if (verdict.type === 'avoid' && !winResult.isTomorrow) {
    windowHtml = '<div class="weather-hero-window">' +
      luIcon('clock', 12) + ' Better conditions expected after ' + winResult.time.split(' \u2013 ')[0].split(' - ')[0] +
    '</div>';
  }
}
```

Note on the avoid time string: `getBestWindowTime` returns `time` formatted as `"4pm - 7pm"` (using `formatHour` which produces "4pm", "7pm" etc). `split(' - ')[0]` extracts just the start time - "4pm". The avoid message becomes "Better conditions expected after 4pm".

The `isTomorrow` guard on avoid: if the best window is tomorrow, today has no better window - omit the line entirely.

### Position in HTML string

`windowHtml` is inserted after `verdict.body` and before `alertPillHtml` (see Section 6). In the updated HTML string:

```javascript
'<div class="weather-hero-body">' + verdict.body + '</div>' +
windowHtml +
alertPillHtml +
'<div class="hero-divider-top"></div>' +
```

---

## Section 4 - Dividers and pills row

### Dividers

The existing `.weather-hero-divider` CSS (lines 4019-4021) is deleted (per Section 7 item 9). The two existing `weather-hero-divider` divs in the JS string (lines 6730, 6737) are removed.

Two new named classes replace them:

```css
.hero-divider-top {
  height: 1px;
  background: rgba(255,255,255,0.09);
  margin: 16px 0;
}
.hero-divider-bottom {
  height: 1px;
  background: rgba(255,255,255,0.09);
  margin: 14px 0;
}
```

Two distinct classes rather than repurposing the old one - naming communicates intent and avoids confusion about which divider is which.

### Rain chance calculation

Add the following to `renderTodayStateB`, in the same block as the `windowHtml` variable (after line 6707):

```javascript
var maxRainProbHero = 0;
if (hourly && hourly.precipitation_probability) {
  var hNow = new Date().getHours();
  for (var ri = hNow; ri < Math.min(hNow + 12, hourly.precipitation_probability.length); ri++) {
    var rp = hourly.precipitation_probability[ri] || 0;
    if (rp > maxRainProbHero) maxRainProbHero = rp;
  }
}
```

Uses `ri` as the loop variable (not `i`) to avoid conflict with any outer-scope `i` variable.

### Updated .weather-pill CSS (lines 851-859)

```css
.weather-pill {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.11);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 99px;
  padding: 5px 11px;
}
```

Changes: `background` 0.15 → 0.11, `border` 0.28 → 0.18, `padding` 3px 10px → 5px 11px.

### Updated pills row in JS HTML string

The pills row removes `humidity` and adds `maxRainProbHero`. The `style="margin-top:12px;"` inline style is removed - spacing is now handled by `.hero-divider-top` and `.hero-divider-bottom`.

```javascript
'<div class="weather-pills">' +
  '<span class="weather-pill">' + luIcon('cloud-rain', 14) + ' ' + maxRainProbHero + '%</span>' +
  '<span class="weather-pill">' + luIcon('wind', 14) + ' ' + wind + ' km/h</span>' +
  (sunPillText ? '<span class="weather-pill">' + sunPillText + '</span>' : '') +
'</div>' +
```

Uses `cloud-rain` icon for rain chance (more specific than `droplets` which was humidity). `wind` icon is unchanged. `sunPillText` is already populated at lines 6679-6686 using `daily.sunrise[0]` / `daily.sunset[0]`.

---

## Section 5 - Full forecast footer row

### CSS - new class

```css
.weather-hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s ease;
}
.weather-hero-footer:active {
  transform: scale(0.97);
}
.weather-hero-footer-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.50);
}
.weather-hero-footer-chevron {
  color: rgba(255,255,255,0.40);
}
```

No background, no border. Reads as a natural end to the card content. The `padding-bottom: 20px` replaces the card's bottom padding (which is set to 0 - see card padding update below).

### Card padding update

Line 800 - update `padding`:

Current:
```css
padding: 20px 20px 16px 20px;
```

New:
```css
padding: 20px 20px 0 20px;
```

Bottom padding is now 0. The footer row's `padding-bottom: 20px` provides the bottom spacing.

### JS HTML string replacement

The current forecast row block (lines 6737-6741) and the second `.weather-hero-divider` (line 6737) are replaced:

```javascript
'<div class="hero-divider-bottom"></div>' +
'<div class="weather-hero-footer" onclick="event.stopPropagation();switchTab(\'weather\')" role="button" aria-label="Full forecast">' +
  '<span class="weather-hero-footer-label">Full forecast</span>' +
  '<span class="weather-hero-footer-chevron">' + luIcon('chevron-right', 14) + '</span>' +
'</div>' +
```

---

## Section 6 - Alert pill

### CSS

Add after `.weather-hero-window` (after its closing brace):

```css
.weather-alert-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: var(--radius-pill);
  padding: 4px 10px 4px 8px;
  margin-top: 12px;
}
.weather-alert-pill--caution {
  background: rgba(255,185,0,0.18);
  border: 1px solid rgba(255,185,0,0.30);
  color: rgba(255,220,100,0.95);
}
.weather-alert-pill--avoid {
  background: rgba(255,110,90,0.20);
  border: 1px solid rgba(255,110,90,0.32);
  color: rgba(255,180,165,0.95);
}
```

### JS variable

Add with `windowHtml` and `maxRainProbHero` in the same block after line 6707:

```javascript
var alertPillHtml = '';
if (verdict.type === 'caution' || verdict.type === 'caveat') {
  alertPillHtml = '<div class="weather-alert-pill weather-alert-pill--caution">' +
    luIcon('alert-triangle', 11) + ' Challenging conditions' +
  '</div>';
} else if (verdict.type === 'avoid') {
  alertPillHtml = '<div class="weather-alert-pill weather-alert-pill--avoid">' +
    luIcon('alert-octagon', 11) + ' Severe weather' +
  '</div>';
}
```

### Layout decision: window line and alert pill stack vertically

They do not share a row. Rationale: `windowHtml` is a piece of information (a time), `alertPillHtml` is a status callout. Putting them side by side on one row creates competing elements with different visual weights. Vertical stacking gives each element clear ownership. Both have `margin-top: 12px` from the element above.

Sequence within the card (for a caution verdict):
1. Verdict title
2. Verdict body
3. `windowHtml` - "Best window: 2pm - 5pm"
4. `alertPillHtml` - "Challenging conditions" pill
5. `.hero-divider-top`
6. Pills row
7. `.hero-divider-bottom`
8. Footer row

---

## Section 7 - Removals

### Removal 1 - Info button from JS HTML string

**Line 6714** - delete the entire line:

```javascript
'<button class="weather-hero-info-btn" onclick="event.stopPropagation();switchTab(\'weather\')" aria-label="Full forecast">' + luIcon('info', 18) + '</button>' +
```

### Removal 2 - luIcon(verdict.icon, 20) from JS HTML string

**Line 6723** - delete this line only, keep all surrounding lines:

```javascript
          luIcon(verdict.icon, 20) +
```

The `.weather-verdict` div and its inner `<span>` remain. After deletion, the div contains only the greeting span (conditional), the verdict label, and the paw icon (approved only).

### Removal 3 - heroClass variable and usage

**Line 6710** - delete the heroClass variable declaration:
```javascript
var heroClass = (verdict.type === 'caution' || verdict.type === 'caveat' ? ' weather-hero--caution' : verdict.type === 'avoid' ? ' weather-hero--avoid' : '');
```

**Line 6713** - update to always use plain class name:

Current:
```javascript
'<div class="weather-hero' + heroClass + '">' +
```

New:
```javascript
'<div class="weather-hero">' +
```

The `.weather-hero--caution` and `.weather-hero--avoid` modifier classes remain in CSS for the gradient background values (see Section 1 CSS additions) - but since `heroClass` is no longer appended to the class attribute, they will never be applied. The gradient is therefore always the default gradient from `.weather-hero`. To apply state-specific gradients, the JS must set the modifier class a different way.

**Revised approach for Section 1 gradients - state via modifier classes:**

Rather than deleting heroClass entirely, repurpose it to apply gradient modifiers only. Keep the variable declaration at line 6710 and keep the usage at line 6713 as-is. The modifier classes in CSS will only set the gradient background - nothing else.

This means the deletion in Removal 3 is: **do not delete heroClass**. Instead the change is:
- Remove all declarations from `.weather-hero--caution` and `.weather-hero--avoid` except the gradient `background`
- The heroClass variable and its usage at lines 6710/6713 remain unchanged

### Removal 4 - .weather-hero--caution and .weather-hero--avoid (lines 812-825)

**Replace** both blocks. Do not delete them - replace their declarations with gradient-only versions:

Current lines 812-825:
```css
.weather-hero--caution {
  background: #7C4A00;
  box-shadow: ... ;
}
.weather-hero--avoid {
  background: #8A1A1A;
  box-shadow: ... ;
}
```

New:
```css
.weather-hero--caution {
  background: linear-gradient(145deg, #2C4A14 0%, #263F12 55%, #1F3410 100%);
}
.weather-hero--avoid {
  background: linear-gradient(145deg, #243D10 0%, #1A2D0B 55%, #152408 100%);
}
```

### Removal 5 - .weather-hero-info-btn CSS (lines 4054-4071)

Delete all of lines 4054-4071 inclusive:
```
.weather-hero-info-btn { ... }
.weather-hero-info-btn:active { ... }
```

### Removal 6 - Orphaned .weather-info-btn CSS (lines 3997-4010)

Delete all of lines 3997-4010 inclusive:
```
.weather-info-btn { ... }
```

### Removal 7 - .weather-hero-forecast-row CSS (lines 4031-4053)

Delete all of lines 4031-4053 inclusive:
```
.weather-hero-forecast-row { ... }
.weather-hero-forecast-row:active { ... }
.weather-hero-forecast-label { ... }
.weather-hero-forecast-chevron { ... }
```

### Removal 8 - Night mode caution/avoid overrides (lines 3302-3313)

Delete both blocks:
```
body.night .weather-hero--caution { background: #4A2C00; box-shadow: ... }
body.night .weather-hero--avoid { background: #4A0E0E; box-shadow: ... }
```

Night mode gradient overrides are addressed in Section 8 below.

### Removal 9 - .weather-hero-divider CSS (lines 4019-4021)

Delete three lines:
```
.weather-hero-divider {
  display: none;
}
```

---

## Section 8 - Night mode

### Gradient backgrounds

The existing `body.night .weather-hero` block (lines 3296-3301) currently sets:
```css
body.night .weather-hero {
  background: #1A3522;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
}
```

This flat `#1A3522` background overrides the new gradient. **Night mode needs updated gradient values.**

Add or replace the night mode `.weather-hero` background with:

```css
body.night .weather-hero {
  background: linear-gradient(145deg, #1F3D1A 0%, #162C0F 55%, #11240B 100%);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.07),
    inset 0 1px 0 rgba(255,255,255,0.08),
    inset 0 -1px 0 rgba(0,0,0,0.18);
}
```

Night mode gradient is the same family - very dark forest greens. The card reads as distinctly night mode without losing the green identity.

Add night mode modifier overrides. The removed day-mode blocks (Removal 8) are replaced with gradient-only night equivalents. Insert after the updated `body.night .weather-hero` block:

```css
body.night .weather-hero--caution {
  background: linear-gradient(145deg, #1A2E0D 0%, #152608 55%, #101E06 100%);
}
body.night .weather-hero--avoid {
  background: linear-gradient(145deg, #151E08 0%, #101705 55%, #0C1204 100%);
}
```

Both are darker and heavier than the base night gradient - the same state logic as light mode.

### Alert pill colours

Confirmed: `rgba(255,185,0,0.18)`, `rgba(255,110,90,0.20)` and their border/text equivalents are all semi-transparent white-relative values. On the night card (dark green), the amber and coral tints read clearly. No night mode override needed.

### Best window line colour

`rgba(255,255,255,0.55)` is a white-relative alpha value. On both light-mode (#2C4A14) and night-mode (#162C0F) cards it resolves to a subdued white. Confirmed: no override needed.

### Footer row colour

`rgba(255,255,255,0.50)` and `rgba(255,255,255,0.40)` are white-relative. Confirmed: no override needed for the footer row.

---

## Section 9 - Weather tab: add sunrise/sunset

### Approach decision

A **dedicated sunrise/sunset row below the 2x2 tiles grid**, outside the grid container. Not a fifth tile - that would require a CSS change to the grid column definition and would either create an orphaned single tile or force a different layout. Not an addition to an existing tile - sunrise/sunset is standalone time data that benefits from its own uncluttered treatment.

The row is a `wx-card`-style surface (same border-radius, border, shadow system as other Weather tab cards) split into two equal halves: Sunrise left, Sunset right, with an internal vertical divider.

### New CSS

Add to the Weather tab CSS section (near the existing `.wx-card` and `.wx-tiles` rules):

```css
.wx-sun-row {
  display: flex;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
  margin: 0 16px;
}
.wx-sun-cell {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}
.wx-sun-cell + .wx-sun-cell {
  border-left: 1px solid var(--border);
}
.wx-sun-time {
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.5px;
  line-height: 1;
}
.wx-sun-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-2);
  margin-top: 3px;
}
```

Night mode is handled automatically by `var(--surface)`, `var(--border)`, `var(--ink)`, `var(--ink-2)` token overrides. No explicit night mode additions needed.

### JS variable additions to renderWeatherTab

Insert the following variable declarations after line 6953 (after `var walkWindowTomorrow = walkWindowResult.isTomorrow;`):

```javascript
var sunriseTime = '--:--';
var sunsetTime  = '--:--';
if (daily && daily.sunrise && daily.sunrise[0]) {
  var srRaw = daily.sunrise[0];
  sunriseTime = srRaw.indexOf('T') !== -1 ? srRaw.split('T')[1] : srRaw;
}
if (daily && daily.sunset && daily.sunset[0]) {
  var ssRaw = daily.sunset[0];
  sunsetTime = ssRaw.indexOf('T') !== -1 ? ssRaw.split('T')[1] : ssRaw;
}
```

Time format follows the existing pattern at line 6684. Output will be `"06:43"` format.

### JS HTML string insertion point

In `renderWeatherTab`, after the closing `'</div>' +` of `.wx-tiles` (line 7064) and before the 5-day forecast `wx-card` (line 7067).

Insert:

```javascript
// Sunrise / Sunset row
'<div class="wx-sun-row">' +
  '<div class="wx-sun-cell">' +
    luIcon('sunrise', 20, 'color:var(--amber);flex-shrink:0;') +
    '<div>' +
      '<div class="wx-sun-time">' + sunriseTime + '</div>' +
      '<div class="wx-sun-label">Sunrise</div>' +
    '</div>' +
  '</div>' +
  '<div class="wx-sun-cell">' +
    luIcon('sunset', 20, 'color:var(--amber);flex-shrink:0;') +
    '<div>' +
      '<div class="wx-sun-time">' + sunsetTime + '</div>' +
      '<div class="wx-sun-label">Sunset</div>' +
    '</div>' +
  '</div>' +
'</div>' +
```

Amber icon colour: `var(--amber)` (`#B07A28` in light mode). Sunrise and sunset are time-of-day events - amber is the most semantically accurate colour and distinct from the brand green used for walk-condition data.

---

## Implementation order

### Phase 1 - CSS deletions

| Step | Action | Lines |
|---|---|---|
| 1 | Delete `.weather-info-btn` (orphaned) | 3997-4010 |
| 2 | Delete night mode caution/avoid background overrides | 3302-3313 |
| 3 | Delete `.weather-hero-divider { display: none; }` | 4019-4021 |
| 4 | Delete `.weather-hero-forecast-row` and child classes | 4031-4053 |
| 5 | Delete `.weather-hero-info-btn` and `:active` | 4054-4071 |
| 6 | Delete `.weather-verdict > svg { flex-shrink: 0; }` | 844 |

### Phase 2 - CSS replacements and updates

| Step | Action | Lines |
|---|---|---|
| 7 | Replace `.weather-hero` background with default gradient; update box-shadow | 796-810 |
| 8 | Replace `.weather-hero--caution` with gradient-only declaration | 812-818 |
| 9 | Replace `.weather-hero--avoid` with gradient-only declaration | 819-825 |
| 10 | Update `.weather-hero-top` margin-bottom to 0 | 826-831 |
| 11 | Update `.weather-hero-temp` font-size, letter-spacing, line-height | 832 |
| 12 | Replace `.weather-verdict` - remove flex, update size/weight/tracking/margin | 834-843 |
| 13 | Update `.weather-hero-body` line-height, color, margin-top | 4022-4030 |

### Phase 3 - CSS additions

| Step | Action | Insert after |
|---|---|---|
| 14 | Add `.weather-hero-glow` CSS | after `.weather-hero--avoid` (after line 825) |
| 15 | Add `.hero-divider-top` and `.hero-divider-bottom` CSS | after `.weather-hero-glow` |
| 16 | Update `.weather-pill` padding, background, border | line 851-859 (replace) |
| 17 | Add `.weather-hero-window` CSS | after `.weather-pill` section |
| 18 | Add `.weather-alert-pill`, `--caution`, `--avoid` CSS | after `.weather-hero-window` |
| 19 | Add `.weather-hero-footer`, `--label`, `--chevron`, `:active` CSS | after alert pill CSS |
| 20 | Add night mode `.weather-hero` gradient override | after/replacing existing `body.night .weather-hero` |
| 21 | Add night mode `.weather-hero--caution` and `--avoid` gradient overrides | after night mode `.weather-hero` |
| 22 | Add `.wx-sun-row`, `.wx-sun-cell`, `.wx-sun-time`, `.wx-sun-label` CSS | near existing `.wx-tiles` CSS |

### Phase 4 - JS changes

| Step | Action | Line |
|---|---|---|
| 23 | Update `renderTodayStateB` function signature to add `hourly` parameter | 6659 |
| 24 | Add `maxRainProbHero` calculation variable block | after line 6707 |
| 25 | Add `windowHtml` variable | after `maxRainProbHero` block |
| 26 | Add `alertPillHtml` variable | after `windowHtml` |
| 27 | Remove info button line from HTML string | 6714 |
| 28 | Remove `luIcon(verdict.icon, 20)` line from HTML string | 6723 |
| 29 | Remove first `.weather-hero-divider` div from HTML string | 6730 |
| 30 | Update `.weather-hero-body` line to add `windowHtml` and `alertPillHtml` after it | 6731 |
| 31 | Add `.weather-hero-glow` div as first child of `.weather-hero` | after line 6713 |
| 32 | Replace `.weather-pills` block - remove humidity, add rain, remove inline style | 6732-6736 |
| 33 | Replace second `.weather-hero-divider` + forecast row with `.hero-divider-bottom` + footer | 6737-6741 |
| 34 | Update call site `renderTodayStateB(...)` to pass `hourly` | 7294 |
| 35 | Add `sunriseTime`/`sunsetTime` variables to `renderWeatherTab` | after line 6953 |
| 36 | Insert `.wx-sun-row` HTML into `renderWeatherTab` string | after `.wx-tiles` closing div, before 5-day forecast |

---

## Complete rebuilt JS HTML string for renderTodayStateB

For reference, the full replacement for `content.innerHTML =` (lines 6712-6745):

```javascript
content.innerHTML =
  '<div class="weather-hero' + heroClass + '">' +
    '<div class="weather-hero-glow"></div>' +
    '<div class="weather-hero-top">' +
      '<div>' +
        '<div class="weather-hero-temp">' + temp + '\u00b0C</div>' +
        '<div class="weather-hero-feels">Feels like ' + feels + '\u00b0C</div>' +
      '</div>' +
      heroIconHtml +
    '</div>' +
    '<div class="weather-verdict">' +
      '<span>' +
        (greetingText ? '<span class="weather-greeting">' + greetingText + '</span>' : '') +
        verdictLabel +
        pawInline +
      '</span>' +
    '</div>' +
    '<div class="weather-hero-body">' + verdict.body + '</div>' +
    windowHtml +
    alertPillHtml +
    '<div class="hero-divider-top"></div>' +
    '<div class="weather-pills">' +
      '<span class="weather-pill">' + luIcon('cloud-rain', 14) + ' ' + maxRainProbHero + '%</span>' +
      '<span class="weather-pill">' + luIcon('wind', 14) + ' ' + wind + ' km/h</span>' +
      (sunPillText ? '<span class="weather-pill">' + sunPillText + '</span>' : '') +
    '</div>' +
    '<div class="hero-divider-bottom"></div>' +
    '<div class="weather-hero-footer" onclick="event.stopPropagation();switchTab(\'weather\')" role="button" aria-label="Full forecast">' +
      '<span class="weather-hero-footer-label">Full forecast</span>' +
      '<span class="weather-hero-footer-chevron">' + luIcon('chevron-right', 14) + '</span>' +
    '</div>' +
  '</div>' +
  '<div id="today-walks-section"></div>' +
  hazardHTML +
  '<div id="today-hidden-gems"></div>';
```

---

*Spec produced by Designer agent, 2026-03-27. No code files were modified. Supersedes spec-today-hero-march-27.md.*
