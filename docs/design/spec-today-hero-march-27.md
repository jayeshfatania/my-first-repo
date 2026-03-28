# Today Tab Hero Card - Design Spec
**Date:** 2026-03-27
**Status:** Designer-approved. Ready for Developer implementation.
**Author:** Designer agent
**Scope:** Three issues on the Today tab hero card (.weather-hero).

---

## Code reading notes

Before the spec, key structural findings from reading the file:

- `.weather-hero-divider` (CSS lines 4019-4021) has `display: none` permanently. Both instances in the JS string (lines 6730 and 6737) are invisible and serve no function. Both can be removed.
- `heroClass` (line 6710) assigns `.weather-hero--caution` for both `caution` AND `caveat` verdict types. The alert pill spec below matches this logic - caveat gets the amber pill.
- The info button (line 6714) is `position: absolute; top: 12px; right: 12px`. It sits over the weather icon in the top-right but is out of flow - removing it does not affect `.weather-hero-top` layout.
- `.weather-info-btn` (lines 3997-4010) is an orphaned legacy class. No HTML in the file references it.
- `.weather-hero-forecast-row` (lines 6738-6741) is followed by the closing `</div>` of the hero card (line 6742). Once replaced, that closing tag is the end of the pill row, not the forecast row.

---

## Issue 1 - Card colour: always brand, alert state internal

### Design decision

The alert state is communicated by a **small conditional status pill** inserted between the verdict body text and the weather pills row. It appears only for caution, caveat, and avoid states. It is conditionally rendered via JS - not hidden with CSS `display:none`.

Considered alternatives:
- Coloured left-border accent on `.weather-verdict` - too subtle to be "immediately readable at a glance"
- Full-width tinted banner - too visually heavy, pulls attention from the verdict text
- Alert pill within the pills row - mixes weather data with verdict status, creates confusion

The standalone pill between body text and data pills is the right position: it sits after the "what does this mean" content and before the "weather data" row, reads naturally in the top-to-bottom scan, and does not interrupt the verdict copy. A small frosted-amber or frosted-red treatment on the green card is immediately distinguishable without shouting.

### CSS changes

**Step 1 - Strip backgrounds and shadows from modifier classes (lines 812-825)**

Remove the `background` and `box-shadow` declarations from both modifier classes. The class names can remain as hooks. Replace the current content with:

```css
/* lines 812-818 - replace entirely */
.weather-hero--caution {
  /* alert state communicated internally - see .weather-alert-pill */
}

/* lines 819-825 - replace entirely */
.weather-hero--avoid {
  /* alert state communicated internally - see .weather-alert-pill */
}
```

Alternatively, if empty rules feel unclean, the modifier classes can be removed entirely from CSS - the `heroClass` variable in JS can also be stripped at the same time (see JS changes below). Either approach is acceptable.

**Step 2 - Add alert pill CSS**

Insert the following after `.weather-hero--avoid` (after line 825) and before `.weather-hero-top` (line 826):

```css
.weather-alert-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: var(--radius-pill);
  padding: 4px 9px 4px 7px;
  margin-top: 10px;
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

Colour notes:
- Caution amber: warm yellow-amber at low opacity. Reads as "pay attention" without alarm. The text colour is a bright warm amber at near-full opacity - readable on the green card background.
- Avoid red: coral-red at low opacity. The text is a desaturated warm rose - distinct from caution without being harsh.
- Both colours use semi-transparent values so they adapt naturally to both light-mode (#2C4A14) and night-mode (#1A3522) card backgrounds. No night mode override needed.

### JS changes

**Step 3 - Add alertPillHtml variable**

Insert the following block immediately after line 6710 (the `heroClass` variable declaration), before `content.innerHTML =`:

```javascript
var alertPillHtml = '';
if (verdict.type === 'caution' || verdict.type === 'caveat') {
  alertPillHtml = '<div class="weather-alert-pill weather-alert-pill--caution">' + luIcon('alert-triangle', 11) + ' Take care today</div>';
} else if (verdict.type === 'avoid') {
  alertPillHtml = '<div class="weather-alert-pill weather-alert-pill--avoid">' + luIcon('alert-octagon', 11) + ' Stay in today</div>';
}
```

Icon notes: `alert-triangle` (Lucide) for caution. `alert-octagon` (Lucide) for avoid. Both are in Lucide v0.577.0. Size 11px keeps the pill compact.

**Step 4 - Insert alertPillHtml into the HTML string**

In the `content.innerHTML` string, after line 6731 (`.weather-hero-body`) and before line 6732 (`.weather-pills`), insert `alertPillHtml +`:

```javascript
'<div class="weather-hero-body">' + verdict.body + '</div>' +
alertPillHtml +                                                  /* ← ADD THIS LINE */
'<div class="weather-pills" style="margin-top:12px;">' +
```

**Step 5 - heroClass variable (optional cleanup)**

If the `.weather-hero--caution` and `.weather-hero--avoid` CSS modifier classes are removed entirely from the stylesheet (per the "alternatively" note in Step 1), then the `heroClass` variable declaration on line 6710 can also be removed, and line 6713 becomes:

```javascript
'<div class="weather-hero">' +
```

If the empty CSS modifier classes are kept, `heroClass` should stay too for forward compatibility. Developer's choice.

---

## Issue 2 - Full forecast: convert to inline pill

### Approach

The Full forecast link moves into the `.weather-pills` div as the last pill. It is rendered as a `<button>` element (not a `<span>`) to correctly represent it as an interactive element. A new `.weather-pill--nav` modifier class handles cursor, font inherit, and tap feedback.

### CSS changes

**Step 6 - Delete forecast row CSS (lines 4031-4053)**

The following CSS blocks are now unused and must be deleted:

```
lines 4031-4042: .weather-hero-forecast-row { ... }
line  4043:      .weather-hero-forecast-row:active { transform: scale(0.97); }
lines 4044-4049: .weather-hero-forecast-label { ... }
lines 4050-4053: .weather-hero-forecast-chevron { ... }
```

Delete all of lines 4031-4053 inclusive.

**Step 7 - Delete .weather-hero-divider CSS (lines 4019-4021)**

Both divider instances are being removed from the JS string (see Steps 9 and 10 below). Once gone from HTML, the CSS class is unused:

```
lines 4019-4021: .weather-hero-divider { display: none; }
```

Delete these three lines.

**Step 8 - Add .weather-pill--nav CSS**

Insert the following after the existing `.weather-pill` block (after line 859):

```css
.weather-pill--nav {
  cursor: pointer;
  font: inherit;
  transition: transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.weather-pill--nav:active {
  transform: scale(0.97);
}
```

`font: inherit` is required because `<button>` elements do not inherit font by default in all browsers. Without it, the text inside the forecast pill will render in the system font instead of Plus Jakarta Sans.

### JS changes

**Step 9 - Remove the first .weather-hero-divider from the HTML string**

Line 6730 in the JS string:

```javascript
'<div class="weather-hero-divider"></div>' +   /* ← DELETE THIS LINE (currently line 6730) */
```

**Step 10 - Add Full forecast pill to .weather-pills div, and remove forecast row**

The existing `.weather-pills` block (lines 6732-6736) and the forecast row block (lines 6737-6741) must be combined.

Replace lines 6732-6741 in full with:

```javascript
'<div class="weather-pills" style="margin-top:12px;">' +
  '<span class="weather-pill">' + luIcon('droplets', 14) + ' ' + humidity + '%</span>' +
  '<span class="weather-pill">' + luIcon('wind', 14) + ' ' + wind + ' km/h</span>' +
  (sunPillText ? '<span class="weather-pill">' + sunPillText + '</span>' : '') +
  '<button class="weather-pill weather-pill--nav" onclick="event.stopPropagation();switchTab(\'weather\')" aria-label="Full forecast">Full forecast ' + luIcon('chevron-right', 12) + '</button>' +
'</div>' +
```

Changes from current:
- The second `weather-hero-divider` div (line 6737) is removed
- The `weather-hero-forecast-row` div (lines 6738-6741) is removed
- A new `<button class="weather-pill weather-pill--nav">` is added as the last pill inside the existing `.weather-pills` div
- `event.stopPropagation()` is retained on the onclick to prevent the tap from also triggering the hero card's tap handler (which also calls `switchTab('weather')`)
- Chevron icon is `12px` - one size smaller than the old `14px` since the pill context is more compact than the old row context

The forecast pill sits at the end of the pills row, after the weather data pills. Wrapping is handled by `flex-wrap: wrap` already on `.weather-pills`. On a narrow viewport, it will wrap to the next line if needed, which is acceptable.

---

## Issue 3 - Info button: remove entirely

### Analysis

The button at line 6714 has `aria-label="Full forecast"` - confirming it was repurposed at some point from its original info function and now duplicates the forecast row. With the forecast row also removed in Issue 2, there is no remaining rationale for it.

The button is `position: absolute; top: 12px; right: 12px` - it sits visually over the weather icon (48x48px) in the top-right corner. Removing it has no effect on layout. `.weather-hero-top` uses `display: flex; justify-content: space-between` which positions the temperature left and the weather icon right. The icon will now be fully unobstructed.

### JS changes

**Step 11 - Remove info button from HTML string**

Line 6714 - delete this line entirely:

```javascript
'<button class="weather-hero-info-btn" onclick="event.stopPropagation();switchTab(\'weather\')" aria-label="Full forecast">' + luIcon('info', 18) + '</button>' +
```

After removal, line 6715 (`'<div class="weather-hero-top">'`) becomes the first child of `.weather-hero`.

### CSS changes

**Step 12 - Delete .weather-hero-info-btn CSS (lines 4054-4071)**

The following CSS blocks are now unused and must be deleted:

```
lines 4054-4070: .weather-hero-info-btn { ... }
line  4071:      .weather-hero-info-btn:active { transform: scale(0.97); }
```

Delete all of lines 4054-4071 inclusive.

**Step 13 - Delete orphaned .weather-info-btn CSS (lines 3997-4010)**

This class is not referenced anywhere in the current HTML or JS. Safe to delete:

```
lines 3997-4010: .weather-info-btn { ... }
```

Delete all of lines 3997-4010 inclusive.

---

## Night mode

**Step 14 - Remove state-override blocks (lines 3302-3313)**

```
lines 3302-3307: body.night .weather-hero--caution { background: #4A2C00; box-shadow: ... }
lines 3308-3313: body.night .weather-hero--avoid { background: #4A0E0E; box-shadow: ... }
```

Delete both blocks. The card background in night mode is now always `#1A3522` (set by `body.night .weather-hero` at lines 3296-3301, which is unchanged).

**No night mode additions needed for `.weather-alert-pill`.**

The pill uses semi-transparent colour values that behave correctly on both the light-mode card (#2C4A14) and night-mode card (#1A3522). The amber and coral tints at 18-20% opacity read clearly on both backgrounds. Night-specific overrides are not required.

---

## Implementation order

Apply in this sequence to avoid broken intermediate states:

| Step | Action | Lines affected |
|---|---|---|
| 6 | Delete .weather-hero-forecast-row CSS | 4031-4053 |
| 7 | Delete .weather-hero-divider CSS | 4019-4021 |
| 12 | Delete .weather-hero-info-btn CSS | 4054-4071 |
| 13 | Delete orphaned .weather-info-btn CSS | 3997-4010 |
| 14 | Delete night mode state overrides | 3302-3313 |
| 1 | Strip background/shadow from modifier classes | 812-825 |
| 2 | Add .weather-alert-pill CSS | after 825 |
| 8 | Add .weather-pill--nav CSS | after 859 |
| 3 | Add alertPillHtml variable in JS | after line 6710 |
| 4 | Insert alertPillHtml into HTML string | line 6731 area |
| 5 | Optionally clean up heroClass variable | line 6710/6713 |
| 11 | Remove info button from HTML string | line 6714 |
| 9 | Remove first .weather-hero-divider from string | line 6730 |
| 10 | Replace .weather-pills + forecast row in string | lines 6732-6741 |

CSS deletions first (steps 6-14), then CSS additions (steps 1-2, 8), then JS changes (steps 3-5, 11, 9-10). This order means at no point are CSS classes referenced that don't yet exist.

---

## What the card looks like after all changes

**Default (approved / no alert state):**
- Brand green card (#2C4A14), unchanged box-shadow
- Top row: temperature + weather icon, no info button overlapping
- Verdict line: icon + title text [+ paw icon for approved]
- Verdict body text
- Pills row: humidity | wind | [sunrise/sunset] | Full forecast →

**Caution / caveat state:**
- Same brand green card - no colour change
- Verdict line: alert-triangle icon + title
- Verdict body text
- Amber alert pill: [alert-triangle 11px] Take care today
- Pills row: humidity | wind | [sunrise/sunset] | Full forecast →

**Avoid state:**
- Same brand green card - no colour change
- Verdict line: alert-octagon icon + title
- Verdict body text
- Coral alert pill: [alert-octagon 11px] Stay in today
- Pills row: humidity | wind | [sunrise/sunset] | Full forecast →

---

*Spec produced by Designer agent, 2026-03-27. No code files were modified.*
