# Design Spec - Round 27
**Date:** 2026-03-27
**Status:** Designer-approved. Ready for Developer implementation.
**Author:** Designer agent

---

## Item 1 - Replace Fraunces + Inter with Plus Jakarta Sans

### Finding: --font-ui is undefined

Before specifying changes, a discovery from reading the file: `--font-ui` is referenced at lines 182 and 4297 but is **never defined as a CSS custom property** in `:root`. It has no value. Both references fall back to `inherit`, which means they currently pick up the body `font-family` (Inter). This is a latent bug, not a deliberate choice.

When the body `font-family` is updated to Plus Jakarta Sans in the changes below, lines 182 and 4297 will automatically inherit Plus Jakarta Sans correctly. No extra fix is needed for those two lines, but `--font-ui` should be defined properly to prevent the same ambiguity recurring.

---

### 1.1 Google Fonts import - line 24

**Replace the entire line 24 with:**

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

This removes both the Fraunces and Inter imports and replaces them with a single Plus Jakarta Sans import covering all five required weights. The `opsz` variable axis used by Fraunces is not available on Plus Jakarta Sans and does not need a replacement.

---

### 1.2 CSS variables - lines 73-80

**Line 73 - update --font-display:**

```css
--font-display:  'Plus Jakarta Sans', sans-serif;
```

**Add --font-ui definition directly below line 73** (currently undefined - must be made explicit):

```css
--font-ui:       'Plus Jakarta Sans', sans-serif;
```

**Line 80 - update body font-family:**

```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

The `-apple-system` and `BlinkMacSystemFont` fallbacks remain correct. They ensure legible system font rendering if the Google Fonts CDN fails to load.

---

### 1.3 Direct 'Fraunces' references - replace individually

There are two direct hardcoded `'Fraunces'` string references that must be updated manually. These will not be caught by a simple `--font-display` variable update.

**Line 831 - .weather-hero-temp**

Current:
```css
.weather-hero-temp { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 700; letter-spacing: -1px; }
```

Replace with:
```css
.weather-hero-temp { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 800; letter-spacing: -2px; }
```

Changes: `serif` -> `sans-serif`, weight `700` -> `800`, letter-spacing `-1px` -> `-2px`. Plus Jakarta Sans at 36px needs weight 800 and tighter tracking to carry the same visual authority as Fraunces 700 at the same size. At -1px it would read as noticeably lighter.

**Line 1156 - .wx-hero-temp**

Current:
```css
.wx-hero-temp { font: 700 80px/1 'Fraunces', serif; color: var(--ink); letter-spacing: -3px; }
```

Replace with:
```css
.wx-hero-temp { font: 800 80px/1 'Plus Jakarta Sans', sans-serif; color: var(--ink); letter-spacing: -4px; }
```

Changes: weight `700` -> `800`, font name updated, letter-spacing `-3px` -> `-4px`. At 80px, Plus Jakarta Sans needs an extra pixel of tracking compression to feel equally confident. At -3px it will read as slightly loose compared to Fraunces at the same value, because Plus Jakarta Sans has wider default character spacing than Fraunces.

---

### 1.4 Direct 'Inter' references - global find-replace

There are **146 occurrences** of the literal string `'Inter'` throughout the file. Listing each individually is not useful. The Developer should perform a global find-and-replace:

- Find: `'Inter'`
- Replace: `'Plus Jakarta Sans'`
- Scope: entire file

This will correctly update all `font:` shorthand declarations (e.g. `font: 600 15px/1 'Inter', sans-serif`) and all `font-family:` declarations.

**Spot-check after replacement:** Verify the following lines are correct post-replacement, as they have specific type treatment that intersects with the font change.

| Line | Element | Note |
|---|---|---|
| 1150 | .wx-hero-location | `font: 500 15px/1` - no weight change needed |
| 1157 | .wx-hero-unit | `font: 400 32px/1` at 32px - add `letter-spacing: -0.5px` after replacement |
| 1201 | .wx-tile-value | `font: 700 32px/1` - add `letter-spacing: -1px` after replacement (likely already has it) |
| 2543 | .me-dog-name | See section 1.5 below - additional changes required |
| 2675 | .me-dog-card-name | See section 1.5 below - additional changes required |

There is also one occurrence at line 1166 in the `font:` shorthand for `.wx-verdict` which uses `'Inter', sans-serif`. This will be caught by the find-replace and is correct to update.

---

### 1.5 Typography adjustments for large display elements

These elements use `var(--font-display)` and will automatically pick up Plus Jakarta Sans once line 73 is updated. However, the weight and tracking values need manual adjustment at display sizes.

**Line 2543 - .me-dog-name (48px, dog name on Me tab)**

Current:
```css
.me-dog-name { font-family: var(--font-display); font-size: 48px; font-weight: 700; line-height: 1; letter-spacing: -0.02em; ... }
```

Update these two properties only:
```css
font-weight: 800;
letter-spacing: -1.5px;
```

Reasoning: `-0.02em` at 48px resolves to approximately `-0.96px`, which is noticeably light for Plus Jakarta Sans at this size. `-1.5px` is the correct optical equivalent. Weight 800 replaces 700 for the same reason as the hero temperature above.

**Line 2675 - .me-dog-card-name (48px, dog name in dog profile card)**

Current:
```css
.me-dog-card-name { font-family: var(--font-display); font-size: 48px; font-weight: 700; ... letter-spacing: -0.02em; ... }
```

Apply identical changes:
```css
font-weight: 800;
letter-spacing: -1.5px;
```

**Line 516 - .hero-headline (clamp 36-48px, State A headline)**

Current:
```css
.hero-headline { font-family: var(--font-display); font-size: clamp(36px, 9vw, 48px); font-weight: 700; letter-spacing: -0.02em; ... }
```

Update:
```css
font-weight: 800;
letter-spacing: -0.03em;
```

`-0.03em` scales correctly with the clamped font size range (resolves to -1.08px at 36px, -1.44px at 48px).

**Lines 2760 and 2767 - .me-stat-number and .me-stat-number--sm (28px and 24px)**

These are at a size where Plus Jakarta Sans 700 performs well without adjustment. No changes needed to weight or tracking for these elements.

**Lines 2994, 838, 1665, 1929 - subpage title and verdict elements using var(--font-display)**

These are 19px-22px. Plus Jakarta Sans reads excellently at these sizes with weight 600 and the existing letter-spacing values. No changes needed.

---

### 1.6 Summary of all changes

| Line | Change type | Action |
|---|---|---|
| 24 | HTML | Replace Google Fonts import URL |
| 73 | CSS | Update `--font-display` value |
| 74 (new) | CSS | Add `--font-ui` definition |
| 80 | CSS | Update body `font-family` |
| 831 | CSS | Replace `'Fraunces', serif`, update weight to 800, tracking to -2px |
| 1156 | CSS | Replace `'Fraunces', serif`, update weight to 800, tracking to -4px |
| 1157 | CSS | Post find-replace: add `letter-spacing: -0.5px` |
| 2543 | CSS | Update `font-weight` to 800, `letter-spacing` to -1.5px |
| 2675 | CSS | Update `font-weight` to 800, `letter-spacing` to -1.5px |
| 516 | CSS | Update `font-weight` to 800, `letter-spacing` to -0.03em |
| All 146 | CSS | Global find-replace `'Inter'` -> `'Plus Jakarta Sans'` |

---

## Item 2 - Map tap card refinement (Walks tab, map view)

### 2.1 HTML change - drag handle element

A drag handle element must be added inside `.walks-map-card`, as the **first child**, before `.walks-map-card-name`.

The handle requires a new HTML element. Add the following immediately after the opening tag of `.walks-map-card` in the HTML:

```html
<div class="walks-map-card-handle"></div>
```

The CSS for this element is specified in 2.2 below.

### 2.2 Updated CSS

**Replace lines 1644-1663 in full** with the following:

```css
/* Compact walk card on pin tap */
.walks-map-card {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(64px + env(safe-area-inset-bottom) + 8px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 14px;
  z-index: 410;
  display: none;
  transform: translateY(100%);
  transition: transform 200ms ease;
  pointer-events: none;
  box-shadow: 0 -2px 20px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
}
.walks-map-card.open {
  transform: translateY(0);
  transition: transform 280ms cubic-bezier(0.34,1.56,0.64,1);
  pointer-events: auto;
}
```

**Add handle CSS** (insert after the `.walks-map-card.open` block, around line 1664):

```css
.walks-map-card-handle {
  width: 32px;
  height: 4px;
  background: var(--border-strong);
  border-radius: 2px;
  margin: 0 auto 10px auto;
}
```

### 2.3 Notes on changes

- `border-radius: var(--radius-xl)` resolves to `28px` on all four corners. This replaces `16px 16px 0 0`. Full radius makes the card read as floating rather than docked.
- `bottom` value adds `+ 8px` to the existing formula. The card now sits 8px above the nav bar rather than flush against it.
- `padding: 14px` replaces `padding: 16px` as specified in the brief.
- `box-shadow` replaces whatever was there previously. The upward-direction shadow (`0 -2px 20px`) + downward shadow (`0 4px 12px`) gives the card physical presence floating above the map.
- `z-index: 410` is unchanged.
- The spring animation on `.walks-map-card.open` is unchanged: `cubic-bezier(0.34,1.56,0.64,1)`.
- The handle element sits above the walk name. The `margin-bottom: 10px` on the handle creates the gap specified in the brief ("8px above the walk name" - 10px accounts for the handle's own height of 4px).

---

## Item 3 - Settings cog tap target (Me tab)

### Finding

The `.me-gear-btn` CSS class (lines 2043-2053) already specifies `width: 44px; height: 44px` - which is the correct WCAG AA minimum tap target. This is already correct in the stylesheet.

The problem is on **line 4777** in the HTML, where the button has an inline style that overrides the CSS:

```html
<button class="me-gear-btn" id="meGearBtn" aria-label="Settings" style="position:absolute;top:12px;right:12px;width:36px;height:36px;" onclick="...">
```

The `width:36px;height:36px` in the inline style overrides the class-level `44px` dimensions, reducing the tap target to 36x36px.

### Fix

**Line 4777 - remove width and height from inline style only.**

Current inline style:
```
style="position:absolute;top:12px;right:12px;width:36px;height:36px;"
```

Updated inline style:
```
style="position:absolute;top:12px;right:12px;"
```

The `position:absolute; top:12px; right:12px;` positioning values stay. Only `width:36px;height:36px;` is removed. The CSS class `.me-gear-btn` then provides the correct 44x44px dimensions.

No CSS change is needed. The fix is a one-line HTML edit.

**Post-fix check:** The visual icon size is controlled by `.me-gear-btn svg { width: 20px; height: 20px; }` at line 2052. This is unchanged, so the icon remains 20px visually while the tap target expands to 44px. The `display: flex; align-items: center; justify-content: center;` on the button class centres the icon within the larger tap target.

---

## Item 4 - Verdict copy tone review

Reviewed all strings listed in the brief against the tone principles: warm and conversational, specific and practical, confident, dog-first, no hyphens misused as em dashes, no exclamation marks.

### Strings that pass - no changes needed

| String | Assessment |
|---|---|
| wind-caution body (line 6290) | Specific routes named, two-part structure works, practical. Pass. |
| fog body (line 6308) | Dog-first, specific hazard mechanism named. Pass. |
| rain-cold body (line 6317) | "Don't hang about" is warmly colloquial. Brief and right. Pass. |
| rain-soon body (line 6335) | Clear urgency without alarm. Pass. |
| rain-likely body (line 6344) | Punchy brevity. "Worth a jacket" is acceptable mild human framing for a low-stakes condition. Pass. |
| heat-paw body (line 6362) | Specific temperature, concrete test, actionable alternatives. Dog-first. Pass. |
| cold-caveat body (line 6353) | Practical, specific paw-care detail, conversational. Pass. |
| approved body (line 6370) | Short and confident. Pass. |
| heat-paw hazard (line 6463) | Clear and actionable. Pass. |
| storm hazard (line 6468) | Specific dangers listed. Pass. |
| wind-avoid hazard (line 6471) | Named locations, named risks. Pass. |

---

### Strings that require revision

**1. storm - verdict body (line 6272)**

Current:
```
'There\'s a thunderstorm. Stay in - your dog would rather be safe than soggy.'
```

Flag: "Safe than soggy" trivialises a genuine safety risk. A thunderstorm involves lightning, falling branches, and exposed terrain - not just rain. The quip reframes the hazard as a wetness issue and risks being read as "it's just a wet day". For the most serious verdict type in the app, this is the wrong register.

Revised:
```
'There\'s a thunderstorm. Stay in - lightning, falling branches, and gusts make this genuinely dangerous for you and your dog.'
```

Why this works: names the specific dangers (not just "storm"), keeps the direct instruction ("stay in"), applies to both human and dog, serious tone matches the severity.

---

**2. wind-avoid - verdict body (line 6281)**

Current:
```
'Gusts of ' + Math.round(gusts) + ' km/h today - enough to cause problems on exposed routes. Worth waiting for it to ease.'
```

Flag: Two issues. "Cause problems" is vague - it does not tell the user what kind of problems. "Worth waiting for it to ease" reads as a soft suggestion rather than a clear avoid recommendation. This is the AVOID state - the strongest verdict. The body copy should match that severity.

Revised:
```
'Gusts of ' + Math.round(gusts) + ' km/h today - strong enough to knock a dog off balance on exposed routes and bring down branches. Stick to sheltered streets, or wait for it to drop.'
```

Why this works: names the specific risk ("knock a dog off balance", "bring down branches"), removes the vague "cause problems", replaces the weak "worth waiting" with a clear recommendation, keeps the temperature and conditions dynamic.

---

**3. heat-caution - verdict body (line 6299)**

Current:
```
'At this temperature, pavement can get hot enough to burn paws. Walk in the morning or evening, bring water, and do the 7-second test before setting off.'
```

Flag: "At this temperature" is vague when the actual temperature is available in the verdict context. More importantly, the body front-loads the pavement test - but at >28°C (the threshold for heat-caution), the more urgent message is about timing the walk, not just checking the pavement. The pavement-test angle is the primary message for heat-paw (25-28°C). Repeating it here as the opening line creates duplication in the system and dilutes both messages.

Revised:
```
'At ' + Math.round(temp) + '\u00b0C, this is hot for a dog. Go early morning or after the sun drops - it makes a real difference. Keep it shorter than usual, bring water, and test the tarmac with your hand before you head out.'
```

Why this works: uses the actual temperature (consistent with heat-paw pattern), leads with timing (the main message at this threshold), preserves the pavement-test reference without making it the primary message, increases urgency appropriately for the higher temperature range.

---

**4. rain - verdict body (line 6326)**

Current:
```
'Not ideal, but fine if you\'re dressed for it. Stick to shorter routes and dry off your dog when you\'re back.'
```

Flag: "If you're dressed for it" is human-centric. The tone principles specify dog-first. The first sentence is entirely about the human's comfort (dressed for it), with the dog appearing only in the second sentence. For a dog-walking app, this ordering feels off.

Revised:
```
'Not ideal, but fine if you keep it moving. Stick to shorter routes, avoid muddy trails if you can, and give your dog a good dry-off when you\'re back.'
```

Why this works: "Keep it moving" applies to both human and dog (dog-first by implication), removes the explicitly human "dressed for it", adds "avoid muddy trails" as practical dog-specific guidance, preserves the dry-off detail.

---

**5. cold-freeze - hazard card body (line 6491)**

Current:
```
'Rinse paws after walking on gritted paths to prevent irritation.'
```

Flag: Minor. "Prevent irritation" is clinical. The rest of the hazard copy uses warmer, more specific language. This line reads like a product safety notice.

Revised:
```
'Salt and grit can irritate paws - a quick rinse when you get home makes a real difference.'
```

Why this works: names the cause (salt and grit, not just "gritted paths"), uses a warmer construction ("makes a real difference"), same brevity.

---

### Consolidated change list for Developer

| Line | Key | Change |
|---|---|---|
| 6272 | storm body | Replace full string - see revised copy above |
| 6281 | wind-avoid body | Replace full string - see revised copy above |
| 6299 | heat-caution body | Replace full string - see revised copy above |
| 6326 | rain body | Replace full string - see revised copy above |
| 6491 | cold-freeze hazard body | Replace full string - see revised copy above |

All other strings in the brief are approved with no changes required.

---

*Spec produced by Designer agent, 2026-03-27. No code files were modified.*
