# Sniffout v2 — Today Tab Developer Brief
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: today-tab-design-proposal.md, today-tab-research.md, developer-brief-round4.md.*

All work in **`sniffout-v2.html`** only.

---

## PO Assessment — What Is Approved, What Is Not

The Designer's proposal is well-scoped, architecturally sound, and reuses the existing component system throughout. It is approved with two modifications:

**Approved as specified:**
- State A: Replace generic preview cards with Sniffout Picks preview section (3 real walk cards, horizontal scroll, 85% opacity)
- State B: Rename "Walks nearby" → "Sniffout Picks nearby"
- State B: Add Today's conditions card (surfaces `verdict.body`)
- State B: Add Hidden gems section (conditional on ≥1 Hidden gem walk within 50km)
- Social proof copy change (partial — see below)

**Modification 1 — Social proof copy:**

The Designer proposed: `25 handpicked UK walks · Live conditions · No account needed`

"No account needed" is a prohibited string (CLAUDE.md non-negotiable: do not use "no account", "no sign-up", "no login", or "free" anywhere in the app). The third element must change.

**Approved social proof copy:** `25 handpicked UK walks · Live conditions · Dog-specific routes`

"Live conditions" replaces "Works offline" — the Designer's reasoning is sound (partial offline support risks misleading users). "Dog-specific routes" is retained from the current copy as the third element.

**Modification 2 — Hero body text:**

The Designer's advisory body text ("Find the right walk for you and your dog. Curated routes, live conditions, and no account needed.") contains "no account needed" and is **not approved**. Do not change the current hero body text. It stays as-is.

---

## Implementation Notes Before Starting

The following require verification against the current codebase before writing code. Check each and use the actual values found:

| Item | What to verify |
|------|---------------|
| GPS button ID | `#btn-use-location` — confirm this is the actual ID on the "Find walks near me" button in `#state-a`. If different, use the correct ID in the prompt's `onclick`. |
| Tab switching function | `switchTab('weather')` and `switchTab('walks')` — confirm the correct function name for switching tabs programmatically. |
| Haversine function | The Hidden gems section uses a haversine calculation. Confirm the function name (`haversineKm` or `haversineMiles`) and its return units. Use the appropriate threshold (50km = 31mi). |
| Verdict object shape | `verdict.body` — confirm `getWalkVerdict()` returns an object with a `.body` property. If the property is named differently, use the correct name. |
| Portrait card function | `renderPortraitCard(walk)` — confirm the exact function name used to render Today tab walk cards. |
| State A show function | Confirm whether State A is re-rendered on every `showTab('today')` call or only once. The new preview section must be rendered on every State A display, not just on first load. |

---

## STATE A — No Location Set

### Remove from `#state-a` HTML

Find and remove the following elements from the State A HTML structure:
- The `<p class="preview-label">` element (and its text "Here's what you'll see:")
- The `.walk-preview-card` element
- The `.weather-preview-card` element

Do not remove: wordmark, hero headline/subline/body, CTA block, recent pills container, search expand, social proof strip.

Note: The CSS rules for `.preview-label`, `.walk-preview-card`, `.weather-preview-card` and their child classes can remain in the stylesheet — they are unused and harmless. Only remove the HTML.

---

### Add: Sniffout Picks Preview Section

**Placement:** After the search expand (`#search-expand` or equivalent), before the social proof strip.

**How to render:** Do not hardcode static HTML strings for the cards. Instead, write a `renderStateAPreviews()` function (or equivalent) that:
1. Selects 3 walk objects from `WALKS_DB` by hardcoded IDs (see walk selection below)
2. Calls `renderTrailCard(walk)` for each to produce the card HTML
3. Injects the result into the carousel div

Call this function every time State A is shown (in `showStateA()` or equivalent).

**HTML structure (the container — add to `#state-a`):**

```html
<div class="preview-picks-section">
  <div class="preview-picks-header">
    <span class="preview-picks-label">Sniffout Picks</span>
    <span class="preview-picks-prompt" id="preview-picks-prompt">
      Set your location to see what's nearest →
    </span>
  </div>
  <div class="trail-carousel preview-carousel" id="preview-picks-carousel">
    <!-- populated by renderStateAPreviews() -->
  </div>
</div>
```

**Prompt click behaviour:** The `preview-picks-prompt` should trigger the same action as tapping "Find walks near me" — i.e., attempt geolocation or open the search input. Use `document.getElementById('btn-use-location').click()` if that ID is confirmed. If the GPS button ID is different, use the correct one. If the prompt action is unclear from inspection, have it call the same function that the "Find walks near me" button calls directly.

**Walk selection — hardcoded IDs:** Select 3 walks from `WALKS_DB` where `badge === 'Sniffout Pick'`. Choose for geographic spread (south / north / coastal or Wales/Scotland if available) and highest rating. If fewer than 3 Sniffout Pick entries exist in `WALKS_DB`, use all available. Hardcode the walk IDs in `renderStateAPreviews()`.

**CSS to add** (inside `<style>`, after existing preview card rules):

```css
/* ── Preview Picks Section (State A) ── */
.preview-picks-section {
  padding: 8px 0 24px;
}
.preview-picks-header {
  padding: 0 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.preview-picks-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.2px;
}
.preview-picks-prompt {
  font-size: 13px;
  color: var(--brand);
  font-weight: 500;
  cursor: pointer;
}
.preview-carousel {
  pointer-events: none;
  opacity: 0.85;
}
```

No dark mode overrides needed for this section — opacity 0.85 reads correctly in both modes, and `var(--brand)` and `var(--ink)` resolve correctly once FIX 5.1 is in place.

---

### Update: Social Proof Copy

Find the social proof strip in State A HTML. Change the copy to:

`25 handpicked UK walks · Live conditions · Dog-specific routes`

---

## STATE B — Location Known

### Change 1: Section label rename (trivial)

In `renderWalksNearby()` (or wherever "Walks nearby" is rendered as the section title), change:

```js
'Walks nearby'
```

to:

```js
'Sniffout Picks nearby'
```

This is a string-only change. No logic, no layout.

---

### Change 2: Today's Conditions Card

**What it is:** A card that surfaces `verdict.body` — the actionable walking guidance computed by `getWalkVerdict()`. This text already exists in the app but only appears on the Weather tab. Placing it on the Today tab turns it into the app's daily-check signal.

**Placement in `renderTodayStateB()`:** After the `#today-walks-section` div (the walk cards section), add the conditions card and the hidden gems container:

```js
'<div class="today-conditions-card">' +
  '<div class="today-conditions-body">' + verdict.body + '</div>' +
  '<span class="today-conditions-link" onclick="switchTab(\'weather\')">Full forecast →</span>' +
'</div>' +
'<div id="today-hidden-gems"></div>'
```

Verify `verdict` is in scope at this point in `renderTodayStateB`. If `verdict` is computed inside `renderTodayStateB`, this placement is correct. If it is computed in a caller, ensure it is passed through.

**CSS to add:**

```css
/* ── Today's Conditions Card (State B) ── */
.today-conditions-card {
  margin: 4px 16px 16px;
  background: rgba(30,77,58,0.05);
  border: 1px solid rgba(30,77,58,0.12);
  border-radius: 16px;
  padding: 14px 16px;
}
.today-conditions-body {
  font-size: 14px;
  color: var(--ink);
  line-height: 1.55;
  margin-bottom: 10px;
}
.today-conditions-link {
  font-size: 13px;
  color: var(--brand);
  font-weight: 600;
  cursor: pointer;
  display: block;
  text-align: right;
}
```

**Dark mode override** — add alongside the other `body.night` overrides (in the same block as FIX 5.6 overrides):

```css
body.night .today-conditions-card {
  background: rgba(110,231,183,0.06);
  border-color: rgba(110,231,183,0.18);
}
```

**Dependency:** This dark mode override depends on FIX 5.1 (`--brand: #6EE7B7` in `body.night`) being in place. If implementing this change in the same session as the Round 4 fixes, implement FIX 5.1 first.

---

### Change 3: Hidden Gems Section

**What it is:** A second horizontal portrait card scroll below the conditions card. Shows walks with `badge === 'Hidden gem'` within 50km of the user, sorted by proximity. Conditional — section only renders if at least 1 qualifying walk exists.

**Placement:** Rendered into `#today-hidden-gems` (the div added in Change 2). Call this logic from `renderWalksNearby(lat, lon)` after the existing Sniffout Picks nearby section is rendered.

**Implementation:**

```js
// Hidden gems section — add at the end of renderWalksNearby()
var HIDDEN_GEM_THRESHOLD_KM = 50;
var hiddenGems = WALKS_DB
  .filter(function(w) { return w.badge === 'Hidden gem'; })
  .map(function(w) {
    return { walk: w, dist: haversineKm(lat, lon, w.lat, w.lon) };
  })
  .filter(function(item) { return item.dist <= HIDDEN_GEM_THRESHOLD_KM; })
  .sort(function(a, b) { return a.dist - b.dist; })
  .slice(0, 4)
  .map(function(item) { return item.walk; });

var gemsEl = document.getElementById('today-hidden-gems');
if (gemsEl && hiddenGems.length > 0) {
  gemsEl.innerHTML =
    '<div class="section-header">' +
      '<div class="section-title">Hidden gems</div>' +
      '<span class="section-link" onclick="switchTab(\'walks\')">Explore →</span>' +
    '</div>' +
    '<div class="hscroll-row" style="padding:0 16px 24px">' +
      hiddenGems.map(renderPortraitCard).join('') +
    '</div>';
}
```

**Note on haversine units:** The code above uses `haversineKm` with a 50km threshold, consistent with the radius system which was converted to km in FIX 2.2. If the codebase only has `haversineMiles`, convert to `haversineMiles` and use threshold `31` (31 miles ≈ 50km). Use whichever matches the existing codebase — do not add a new function.

**No new CSS required.** Uses existing `.section-header`, `.section-title`, `.section-link`, `.hscroll-row`, and `.portrait-card` — all unchanged.

---

## State B — Full Layout Reference

| # | Element | Component | Change |
|---|---------|-----------|--------|
| 1 | App header + wordmark | `.app-header` | No change |
| 2 | Location line | `.location-line` | No change |
| 3 | Inline search (hidden) | `#state-b-search` | No change |
| 4 | Weather hero card | `.weather-hero` | No change |
| 5 | Hazard cards | `.hazard-card` | No change |
| 6 | **Sniffout Picks nearby** | `#today-walks-section` | Rename section title from "Walks nearby" → "Sniffout Picks nearby" |
| 7 | **Today's conditions card** | `.today-conditions-card` | **New** — surfaces `verdict.body`, links to Weather tab |
| 8 | **Hidden gems section** | `#today-hidden-gems` | **New** — conditional, ≤4 cards within 50km |

---

## Confirm When Done

- [ ] State A: preview label, walk preview card, weather preview card removed from HTML
- [ ] State A: `.preview-picks-section` renders 3 Sniffout Pick trail cards in a horizontal scroll
- [ ] State A: preview carousel at 85% opacity, pointer-events none (cards non-interactive)
- [ ] State A: prompt text "Set your location to see what's nearest →" triggers location CTA when tapped
- [ ] State A: social proof reads "25 handpicked UK walks · Live conditions · Dog-specific routes"
- [ ] State B: section title reads "Sniffout Picks nearby" (was "Walks nearby")
- [ ] State B: today's conditions card renders below the walk scroll with `verdict.body` text
- [ ] State B: "Full forecast →" link on conditions card switches to Weather tab
- [ ] State B: hidden gems section appears when ≥1 Hidden gem walk is within 50km
- [ ] State B: hidden gems section is absent (zero height, no gap) when no qualifying walks
- [ ] State B: dark mode conditions card uses teal tint (dependent on FIX 5.1 in place)
- [ ] Hero body text unchanged from current value

---

## Developer Documentation

Update `developer-notes.md` with:
- Which 3 walk IDs were selected for State A preview (and why)
- The haversine function name and units used for the Hidden gems threshold
- The exact property path used for `verdict.body`
- Any function names that differed from those assumed in this brief
