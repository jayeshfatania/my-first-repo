# Sniffout — Product Owner Action Plan: Round 14
*Issued by: Product Owner*
*Date: March 2026*
*Inputs: Phone testing by owner; CLAUDE.md; po-action-plan-round12.md; me-tab-redesign-spec.md*

---

## Context

Round 13 shipped the full Me tab redesign (highlights card, distance progress bar, badge grid, walk history, settings sheet) plus the Weather tab redesign (hero section, metric tiles, bottom sheets). The owner has now tested both on a real Android device and surfaced nine observations ranging from genuine bugs to feature ideas. This document resolves each one and defines the exact Round 14 scope.

**Total estimated effort: 2.5 - 3.5 hours.**

---

## Part 1 — Issue Assessment

| # | Issue | Decision |
|---|---|---|
| 1 | Miles walked accuracy | FIX 15.1 — rename with tilde + disclaimer |
| 2 | Favourites clogging Me tab | FIX 15.2 — add compact list to Me tab |
| 3 | Android back button exits app | FIX 15.3 — extend popstate handler |
| 4 | Brand colour similarity to TGTG | Designer brief — no Round 14 code |
| 5 | Theme colour update | Blocked on issue 4 — flag only |
| 6 | Back button on overlays/sheets | FIX 15.3 — same fix as issue 3 |
| 7 | Weather hero icon position | Designer brief — no Round 14 code |
| 8 | Moon phase on Weather tab | Deferred to Round 15 |
| 9 | Settings visible in Me tab body | FIX 15.4 — investigate and resolve |

Issues 3 and 6 are the same root fix and are combined into FIX 15.3.

---

## Part 2 — Round 14 Scope: Confirmed Fixes

Implement in this order. Dependencies are noted per fix.

---

### FIX 15.1 — Miles accuracy label

**Issue 1. No dependencies.**

**PO recommendation: rename to "~X mi explored" with a small disclaimer. Do not remove.**

Reasoning: The progress-to-milestone mechanic (Zone 2 distance bar) is the primary engagement driver on the Me tab. Removing it entirely leaves an empty card and kills the badge track for Explorer and Trailblazer milestones. The tilde prefix and a one-line disclaimer are honest without dismantling the feature. GPS tracking is Phase 3; using stated walk distances is an acceptable Phase 2 approximation, and consistent with how AllTrails handled early iterations before GPS integration.

**Changes required:**

**1. Zone 2 progress card heading — in the HTML:**
```
"Miles walked" → "Miles explored"
```
The element is the `<div class="me-progress-heading">` inside `#meProgressCard`.

**2. Zone 2 current value prefix — in `renderProgressBar()`:**
Wherever the current total is written to `#meProgressCurrent`, prefix the value with a tilde:
```js
// Before:
progressCurrent.textContent = currentMiles.toFixed(1) + ' mi';
// After:
progressCurrent.textContent = '~' + currentMiles.toFixed(1) + ' mi';
```

**3. Zone 2 disclaimer note — add below the hint text:**
After rendering the `#meProgressHint` text, append a small note below it. Add to `renderProgressBar()`:
```js
// After setting meProgressHint content:
var noteEl = document.getElementById('meProgressNote');
if (noteEl) noteEl.textContent = 'Based on each walk\'s listed distance.';
```
Add the corresponding element to the HTML inside `#meProgressCard`, after `<div id="meProgressHint">`:
```html
<div class="me-progress-note" id="meProgressNote">Based on each walk's listed distance.</div>
```
CSS to add:
```css
.me-progress-note {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 6px;
  opacity: 0.7;
}
```

**4. Zone 1 highlights card row label — in `renderHighlightsCard()`:**
The "Total miles" row label should match the renamed concept:
```
"Total miles" → "Miles explored"
```
Find the string literal in `renderHighlightsCard()` and update it.

**5. Completion card — no change needed.**
The "100 Miles Club" completion title and body are milestone names, not claims of GPS precision. Leave them exactly as specified.

**Verify:**
- Me tab with at least one logged walk shows "Miles explored" heading and "~14.3 mi" (or equivalent) as the current value.
- Progress note appears below the hint text in smaller, lighter text.
- Completion state (100+ mi) shows "100 Miles Club" — no tilde.
- Zone 1 highlights row shows "Miles explored" label, not "Total miles".

**Estimated effort: 20-30 min.**

---

### FIX 15.2 — Favourites compact list on Me tab

**Issue 2. No dependencies.**

The me-tab-redesign-spec.md removed the Favourites section from the Me tab zone layout. The owner wants it reinstated as a compact list. The current `renderFavouritesList()` function targets `#favs-list`, which does not exist in the redesigned Me tab HTML — the function is called at init but silently does nothing.

**PO decision: add a compact Favourites section to the Me tab, positioned between Zone 3 (Badges) and Zone 4 (Walk history).**

This overrides the spec omission. The Favourites section is confirmed as part of the Me tab. The compact format replaces full walk cards.

**Changes required:**

**1. Add HTML for the Favourites section to the Me tab, after `#meBadgesSection` and before `#meHistorySection`:**

```html
<!-- Favourites -->
<div class="me-favs-section" id="meFavsSection">
  <div class="me-history-heading">Favourites</div>
  <div class="me-history-list" id="favs-list"></div>
</div>
```

The section is always rendered (the empty state handles the no-favourites case). Use the existing `me-history-list` card container pattern from Zone 4.

**2. Rewrite `renderFavouritesList()`:**

```js
function renderFavouritesList() {
  var el = document.getElementById('favs-list');
  if (!el) return;
  var favIds   = getFavourites();
  if (favIds.length === 0) {
    el.innerHTML =
      '<div style="padding:16px;font:400 13px/1.4 Inter,sans-serif;color:var(--ink-2);">' +
      'Heart any walk to save it here.</div>';
    return;
  }
  var favWalks = favIds.map(function(id) {
    return WALKS_DB.find(function(w) { return w.id === id; });
  }).filter(Boolean);

  var VISIBLE_MAX = 5;
  var visible  = favWalks.slice(0, VISIBLE_MAX);
  var hasMore  = favWalks.length > VISIBLE_MAX;

  var rows = visible.map(function(w) {
    return '<div class="me-fav-row" onclick="onWalkTap(\'' + w.id + '\')">' +
      '<span class="me-fav-name">' + w.name + '</span>' +
      '<span class="me-fav-dist">' + (w.distance ? w.distance + ' mi' : '') + '</span>' +
    '</div>';
  }).join('');

  var seeAll = hasMore
    ? '<button class="me-history-see-all" onclick="openFavsSheet()">See all ' + favWalks.length + ' favourites &#8594;</button>'
    : '';

  el.innerHTML = rows + seeAll;
}
```

**3. Add CSS for compact favourite rows:**

```css
.me-fav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.me-fav-row:last-of-type,
.me-fav-row:has(+ .me-history-see-all) { border-bottom: none; }
.me-fav-name {
  font: 500 15px/1.3 'Inter', sans-serif;
  color: var(--ink);
}
.me-fav-dist {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  flex-shrink: 0;
  margin-left: 10px;
}
```

**Note on `:has` selector:** Safari 15.4+ and Chrome 105+ support it. For older Android Chrome, the last fav row will retain a border-bottom if it precedes the "See all" button. This is acceptable — it is a minor visual issue, not a functional one. Do not add JS to work around it.

**4. Add `openFavsSheet()` function:**

A "See all favourites" sheet, following the same pattern as the walk log sheet (`#walk-log-sheet`). Add to the body root:

```html
<!-- Favourites sheet -->
<div class="filter-backdrop" id="favs-sheet-backdrop" onclick="closeFavsSheet()"></div>
<div class="filter-sheet" id="favs-sheet">
  <div class="filter-handle"></div>
  <div style="padding:16px 16px 4px; border-bottom:1px solid var(--border);">
    <div style="font-size:16px;font-weight:700;color:var(--ink);">Favourites</div>
  </div>
  <div id="favs-sheet-inner" style="overflow-y:auto; max-height:calc(65vh - 80px); padding:0;"></div>
  <div style="padding:12px 16px 16px; border-top:1px solid var(--border);">
    <button class="sheet-btn-ghost" onclick="closeFavsSheet()">Close</button>
  </div>
</div>
```

```js
function openFavsSheet() {
  var inner = document.getElementById('favs-sheet-inner');
  if (!inner) return;
  var favIds   = getFavourites();
  var favWalks = favIds.map(function(id) {
    return WALKS_DB.find(function(w) { return w.id === id; });
  }).filter(Boolean);
  inner.innerHTML = favWalks.map(function(w) {
    return '<div class="me-fav-row" onclick="closeFavsSheet();onWalkTap(\'' + w.id + '\')">' +
      '<span class="me-fav-name">' + w.name + '</span>' +
      '<span class="me-fav-dist">' + (w.distance ? w.distance + ' mi' : '') + '</span>' +
    '</div>';
  }).join('');
  var backdrop = document.getElementById('favs-sheet-backdrop');
  var sheet    = document.getElementById('favs-sheet');
  if (backdrop) backdrop.classList.add('is-open');
  if (sheet)    sheet.classList.add('is-open');
  history.pushState(null, '', location.href);
}

function closeFavsSheet() {
  var backdrop = document.getElementById('favs-sheet-backdrop');
  var sheet    = document.getElementById('favs-sheet');
  if (backdrop) backdrop.classList.remove('is-open');
  if (sheet)    sheet.classList.remove('is-open');
}
```

**5. Update `toggleFav()` call site to also update the section:**
The existing `toggleFav()` already calls `renderFavouritesList()` on every toggle. No additional wiring needed.

**6. Update `renderMeTab()` to call `renderFavouritesList()`** if it doesn't already. Check the current call sites — `renderFavouritesList()` is called at init (line ~6480) but may not be called inside `renderMeTab()`. Add it:
```js
// At the end of renderMeTab(), before the closing brace:
renderFavouritesList();
```

**Verify:**
- Me tab with 0 favourites: section shows "Heart any walk to save it here."
- Me tab with 1-5 favourites: shows compact rows with name and distance. No "See all" button.
- Me tab with 6+ favourites: shows 5 rows + "See all [N] favourites →" button. Tapping opens the sheet with all favourites.
- Tapping any row (in list or sheet) opens the walk detail overlay.
- Hearting/un-hearting a walk on any tab updates the Me tab list immediately.

**Estimated effort: 45-60 min.**

---

### FIX 15.3 — Android back button navigation

**Issues 3 and 6. No dependencies. Implement after FIX 15.2 so the favs sheet is included.**

**Root cause:** The existing `popstate` handler (line ~4623) only closes the walk detail overlay. All other bottom sheets — conditions tag sheet, Me settings sheet, walk log sheet, wx metric detail sheet, and the new favs sheet (FIX 15.2) — have no back-button handling. On Android, a hardware back press when no sheets are open goes to the browser's previous state and exits the PWA session.

**Fix:** Replace the existing `popstate` listener with a unified handler that closes the topmost open sheet. Every sheet open function must push a history state entry. After closing any sheet, push a new state entry to ensure the stack always has at least one state above the app's initial entry, preventing the next back press from exiting.

**Step 1 — audit which sheet open functions push history state**

Current state:
- `onWalkTap()`: calls `history.pushState(null, '', location.href)` — already correct
- `openCondTagSheet()`: check — likely does NOT push state
- `openMeSettingsSheet()`: does NOT push state
- `openWalkLogSheet()` (walk log "See all"): check — likely does NOT push state
- `openWxSheet()`: does NOT push state
- `openFavsSheet()` (new, FIX 15.2): DOES push state (spec above includes it)

**Step 2 — add `history.pushState` to each sheet open function that is missing it**

In `openCondTagSheet()`, add at the end:
```js
history.pushState(null, '', location.href);
```

In `openMeSettingsSheet()`, add at the end:
```js
history.pushState(null, '', location.href);
```

In `openWalkLogSheet()` (or equivalent function that opens `#walk-log-sheet`), add at the end:
```js
history.pushState(null, '', location.href);
```

In `openWxSheet()`, add before the `requestAnimationFrame` call:
```js
history.pushState(null, '', location.href);
```

**Step 3 — add a `closeTopSheet()` helper function**

Place this near the existing `popstate` listener. Returns `true` if a sheet was closed, `false` if nothing was open.

```js
function closeTopSheet() {
  // Check in z-index / priority order — highest z-index first

  // Conditions tag sheet (z-index 401 — highest in app)
  var condSheet = document.getElementById('cond-tag-sheet');
  if (condSheet && condSheet.classList.contains('is-open')) {
    closeCondTagSheet();
    return true;
  }

  // Wx metric detail sheet (z-index 201)
  var wxSheet = document.getElementById('wxSheet');
  if (wxSheet && !wxSheet.hidden && wxSheet.classList.contains('is-open')) {
    closeWxSheet();
    return true;
  }

  // Me settings sheet (z-index 201)
  var meSettings = document.getElementById('meSettingsSheet');
  if (meSettings && meSettings.classList.contains('is-open')) {
    closeMeSettingsSheet();
    return true;
  }

  // Walk log sheet
  var walkLog = document.getElementById('walk-log-sheet');
  if (walkLog && walkLog.classList.contains('is-open')) {
    closeWalkLogSheet();
    return true;
  }

  // Favourites sheet (FIX 15.2)
  var favsSheet = document.getElementById('favs-sheet');
  if (favsSheet && favsSheet.classList.contains('is-open')) {
    closeFavsSheet();
    return true;
  }

  // Walk detail overlay (class 'open', not 'is-open')
  var overlay = document.getElementById('walk-detail-overlay');
  if (overlay && overlay.classList.contains('open')) {
    closeWalkDetail();
    return true;
  }

  return false;
}
```

**Step 4 — replace the existing `popstate` listener**

Find and replace the existing popstate handler (currently around line 4623):

```js
// REMOVE this existing handler:
window.addEventListener('popstate', function() {
  var overlay = document.getElementById('walk-detail-overlay');
  if (overlay && overlay.classList.contains('open')) {
    closeWalkDetail();
    history.pushState(null, '', location.href);
  }
});

// REPLACE with:
window.addEventListener('popstate', function() {
  if (closeTopSheet()) {
    // Closed something — push a new state so the next back press
    // triggers popstate again rather than exiting the app
    history.pushState(null, '', location.href);
  }
  // If nothing was open, do nothing — the browser navigates back
  // in its own history (on a fresh PWA load this exits, but with
  // the state entries we maintain above, this path is rarely reached)
});
```

**Verify (test on a real Android device or Chrome DevTools with hardware back button simulation):**
- Walk detail overlay open: back button closes overlay. Second back press: nothing exits (overlay is gone, next back press is a browser history navigation but the app stays open due to maintained state entries).
- Conditions sheet open: back button closes sheet. Walk detail was open beneath it: second back press closes walk detail.
- Me settings sheet open: back button closes sheet.
- Wx metric detail sheet open: back button closes sheet.
- Walk log sheet open: back button closes sheet.
- Favourites sheet open (FIX 15.2): back button closes sheet.
- Nothing open: back button does NOT exit the app. (On the first launch with no prior history, this may still exit — that is acceptable behaviour.)
- iOS swipe-back gesture: unaffected (no change to existing swipe-to-dismiss logic).

**Estimated effort: 45-60 min.**

---

### FIX 15.4 — Settings investigation on Android

**Issue 9. No dependencies. Quickest fix — start here if Round 14 has limited time.**

**Owner report:** "Display mode and Display name settings appear to still be showing in the Me tab body rather than being fully moved to the gear icon settings sheet."

**Code review finding:** The current Me tab HTML (lines 2795-2869) contains NO settings controls in the tab body. The settings are correctly placed in `#meSettingsSheet`, which uses `transform: translateY(100%)` when closed and is visually off-screen. The gear icon (`#meGearBtn`) is correctly wired to `openMeSettingsSheet()`.

**Likely causes:**
a) The owner tested a version of the app before the Round 13 redesign was deployed to main. The live `dog-walk-dashboard.html` still has the old Me tab with inline settings — if the owner loaded that file directly, they would see the old layout.
b) On some Android Chrome versions, `translateY(100%)` on a fixed element inside a specific stacking context may not fully push the sheet below the viewport.
c) A JS error earlier in the script prevented `openMeSettingsSheet` from being correctly wired.

**Developer actions:**

1. **Hard-reload the app on the test Android device** (clear cache) to ensure the latest build is running, not a cached version.

2. **Verify the settings sheet is off-screen when closed:** In DevTools, inspect `#meSettingsSheet`. Confirm `transform: translateY(100%)` is applied and the element is below the visible viewport. If it is partially visible, add `will-change: transform` to `.me-settings-sheet` CSS — this forces GPU compositing and may resolve the rendering inconsistency.

3. **Verify gear icon opens the sheet:** Tap the gear icon in the Me tab header. Confirm `openMeSettingsSheet()` fires and the sheet slides up with display mode, search radius, and display name controls.

4. **Confirm no settings controls exist in the Me tab body scroll:** Search the Me tab HTML for any `segment-control`, `display-name`, or settings-related elements outside `#meSettingsSheet`. If any are found, remove them.

5. **If the issue cannot be reproduced** on the latest build: mark as resolved — it was a stale cache issue. Document this in the commit message.

**If the sheet is partially visible (rendering bug on Android):**

Add the following to `.me-settings-sheet` CSS:
```css
.me-settings-sheet {
  /* existing rules unchanged */
  will-change: transform;
  -webkit-transform: translateY(100%);
}
.me-settings-sheet.is-open {
  -webkit-transform: translateY(0);
}
```

**Estimated effort: 15-30 min (investigation) + 15 min if CSS fix needed.**

---

## Part 3 — Designer Briefs

These issues require a Designer's input. No code changes in Round 14.

---

### Designer Brief A — Brand colour alternatives

**Issue 4.**

**Problem:** The current brand green (`#1E4D3A`) is visually similar to Too Good To Go's brand colour. The card-based layout also creates a surface-level resemblance in screenshots and App Store previews. This is a differentiation risk as Sniffout grows.

**Designer task:** Propose 3-4 alternative primary brand colours that:
- Retain an outdoor/nature/trust signal — earthy, grounded, not corporate
- Avoid direct overlap with Too Good To Go (dark green), AllTrails (orange), Komoot (orange), PlayDogs (purple)
- Work with the existing warm off-white background (`#F7F5F0`) — the background is not changing
- Pass WCAG AA contrast ratio (4.5:1) against white text (`#FFFFFF`) — required for the verdict badge
- Work in both light and dark mode (confirm legibility against the night-mode surface)

**Deliverable:** For each proposed colour:
1. A `#hex` value and a short name
2. Sample application on:
   - The walk verdict badge (the most prominent coloured element)
   - A metric tile contextual label (the "Low chance today" text in brand green)
   - The "Since November 2025" text is in `var(--ink-2)` not brand — confirm no confusion
3. Recommendation note: which of the 3-4 options the Designer favours and why

**Owner must select a colour before any code changes.** Developer cannot start FIX 16.x (theme colour update) without this decision.

---

### Designer Brief B — Weather hero icon vertical alignment

**Issue 7.**

**Problem:** The 72px Yr.no weather icon in the Weather tab hero section feels "slightly off-position." The icon is right-aligned with `margin-top: 8px`, intended to align it to the cap height of the 80px temperature number. On some device sizes or icon shapes, the alignment reads as awkward.

**Designer task:** Review the hero layout on a 375px viewport and propose any adjustment to:
- `margin-top` value on the icon (currently 8px)
- Whether the icon should align to the cap height, x-height, or baseline of the temperature
- Whether the icon and temperature number should use `align-items: center` instead of `flex-start`
- Whether the icon size (currently 72px) is correct relative to the 80px temperature number

**Deliverable:** Annotated layout showing the intended icon position relative to the temperature number, with updated CSS value(s) if any change is needed.

**This is a minor refinement.** If the Designer's review finds the current position is correct on their test device, mark as no-change-needed.

---

## Part 4 — Deferred Items

---

### Moon phase — Issue 8 (Deferred to Round 15)

**Owner request:** Show the current moon phase on the Weather tab.

**PO decision: Defer to Round 15.**

Reasoning:
1. This is a new feature, not a bug fix. Round 14 is a correctness round.
2. The Weather tab underwent a major redesign in Round 13. Allow it to settle and be fully tested before adding new elements.
3. The technical implementation is small (~15 lines of JS — lunar phase is derivable from a known reference new moon date and the synodic period of 29.53 days, no API needed). But the *placement* question on the redesigned weather tab is not trivial and needs a brief.
4. The feature earns its place in the app — evening dog walks are real use cases for moon phase. But it should be specced properly, not squeezed into Round 14.

**For Round 15:** Owner to produce a brief specifying:
- Where on the Weather tab the moon phase appears (hero section? standalone card? small tile in the 2x2 grid replacing a future metric?)
- What information is shown (phase name, phase icon, illumination percentage, rise/set time?)
- Whether this is always shown or only at night (`body.night`)

The calculation function can be prototyped quickly once placement is decided.

---

### Theme colour update — Issue 5 (Blocked on Designer Brief A)

Once the owner selects a new brand colour from Designer Brief A, this is a two-line change:

1. In `<head>`: update `<meta name="theme-color" content="#1E4D3A">` to the new value
2. In `manifest.json`: update `"theme_color": "#1E4D3A"` to the new value

Flag to Developer as pending. Do not implement until the colour decision is made. Include in the same commit as the CSS variable update.

**When the colour changes:** The single CSS token `--brand: #1E4D3A` drives all brand-coloured elements across the app. Updating that token is the only code change needed in `sniffout-v2.html`. Verify every brand-coloured element after the change:
- Walk verdict badge
- Metric tile contextual labels ("Low chance today", etc.)
- Progress bar fill
- Earned badge chips
- Brand-green nav text
- "Full forecast →" and similar link text

---

## Part 5 — Decisions Required Before Developer Starts

**Decision 1 — Miles accuracy approach (FIX 15.1)**
The brief recommends: rename to "~X mi explored" with a disclaimer note. The alternative is to remove the feature until GPS tracking is available in Phase 3.
Owner to confirm which approach before implementation.

**Decision 2 — Favourites section placement (FIX 15.2)**
The brief places Favourites between Zone 3 (Badges) and Zone 4 (Walk history).
Owner to confirm this is the correct position, or specify a different location.

**Decision 3 — Moon phase scope (Issue 8)**
Deferred to Round 15. Owner to confirm deferral is acceptable, and to begin thinking about placement and content for the Round 15 brief.

**Decision 4 — Brand colour (Designer Brief A)**
No code action until colour is selected. Owner to commission Designer Brief A and make the selection before Round 15.

---

## Round 14 — Complete Scope Summary

| Fix | Description | Effort |
|---|---|---|
| FIX 15.1 | Miles accuracy — rename to "~X mi explored" + disclaimer | 20-30 min |
| FIX 15.2 | Favourites compact list — max 5 rows, "See all" sheet | 45-60 min |
| FIX 15.3 | Android back button — extend popstate handler to all sheets | 45-60 min |
| FIX 15.4 | Settings investigation — verify and fix if sheet rendering issue | 15-30 min |
| **Total** | | **~2-3 hrs** |

**Implementation order:**
1. FIX 15.4 (investigation first — quick to rule out or resolve, no code dependencies)
2. FIX 15.1 (no dependencies, isolated label changes)
3. FIX 15.2 (introduces the favs sheet, which FIX 15.3 must include in its handler)
4. FIX 15.3 (depends on FIX 15.2's `openFavsSheet`/`closeFavsSheet` functions existing)

**Not in Round 14:**
- Moon phase (deferred to Round 15)
- Brand colour update (blocked on Designer Brief A)
- Theme colour update (blocked on Designer Brief A)
- Weather hero icon adjustment (blocked on Designer Brief B)
- Me tab walk history empty-state inline text (spec already in me-tab-redesign-spec.md — not surfaced as an issue, no action needed)
