# Sniffout — Today Tab Design Proposal
*Designer role. March 2026. Based on today-tab-research.md, design-spec.md, mockup.html, and sniffout-v2.html audit.*
*Output for Developer implementation.*

---

## Design Principles Applied

Three principles from the research govern every decision in this proposal:

1. **The home screen is never empty.** Both states must have real content visible without any user action.
2. **One primary CTA above the fold.** The hero space is a single invitation. Complexity lives below it.
3. **The daily hook is freshness.** Live weather conditions change every day. Surfacing their meaning — not just their data — gives users a genuine reason to open the app each morning.

Benchmark: Citymapper (zero-friction onboarding), Headspace Today tab (daily-refreshing home screen), Komoot Discover (editorial fills empty state).

---

## Badge Confirmation

The badge on individual curated walk cards reads **"Sniffout Pick"** (singular — labels one walk as a Sniffout pick). The section label displaying a collection of these walks reads **"Sniffout Picks"** (plural). This is already correct in `WALKS_DB`. This proposal also confirms the FIX 5.9 direction from `developer-brief-round4.md`: the Walks tab section label must change from "Community Picks" → **"Sniffout Picks"**. The empty state copy must also change (see FIX 5.9 in that brief).

---

## STATE A — No Location Set

### Audit of Current State

Current layout (top to bottom):
1. Wordmark header
2. Hero headline / subline / body text
3. CTA block: "Find walks near me" button + "Or enter a location →" secondary
4. Recent search pills (JS rendered)
5. Search expand (hidden)
6. `<p class="preview-label">Here's what you'll see:</p>` — weak label
7. `.walk-preview-card` — generic, single card, placeholder text "Walks near your location"
8. `.weather-preview-card` — static, "⛅ Live weather" blurb
9. `.social-proof` strip

**Problems identified:**
- Items 6–8 are weak. The "walk preview card" shows generic placeholder text and no real data — it tells users nothing about what the app actually contains.
- The weather preview card is redundant: it doesn't demonstrate the product and duplicates what a user will discover naturally.
- "Here's what you'll see:" is a hesitant, apologetic label. It positions the app as needing to justify itself.
- The screen feels incomplete below the CTA. First-time users have nothing to browse or orient themselves.

---

### Proposed State A Layout

**What stays (no changes):**
- Wordmark header
- Hero headline: "Discover great walks"
- Hero subline: "Handpicked walks. Live conditions."
- Hero body text (copy suggestion below, but content is PO-approved — treat as advisory)
- CTA block: "Find walks near me" button + "Or enter a location →"
- Recent search pills
- Search expand (hidden)
- Social proof strip (copy update below)

**What changes:**
- Remove items 6, 7, 8 (preview label, walk preview card, weather preview card)
- Replace with a **Sniffout Picks preview section** (detail below)
- Update social proof copy (detail below)

---

### New Component: Sniffout Picks Preview Section

This section replaces the single generic preview card and the weather teaser. It shows 3 real curated walk cards from `WALKS_DB` in a horizontal scroll, clearly labelled, with a prompt to set a location.

**Visual behaviour:** The cards are non-interactive (pointer-events none). They display at 85% opacity. No overlay, no lock icon — the reduced opacity is enough to signal "preview" without feeling broken. The prompt text below the section label is the actionable element.

**Section structure (HTML):**
```html
<div class="preview-picks-section">
  <div class="preview-picks-header">
    <span class="preview-picks-label">Sniffout Picks</span>
    <span class="preview-picks-prompt" onclick="document.getElementById('btn-use-location').click()">
      Set your location to see what's nearest →
    </span>
  </div>
  <div class="trail-carousel preview-carousel">
    <!-- 3 trail cards: see walk selection below -->
    [TRAIL_CARD_1]
    [TRAIL_CARD_2]
    [TRAIL_CARD_3]
  </div>
</div>
```

**Walk selection:** Developer should hardcode 3 walk cards from `WALKS_DB` with `badge: 'Sniffout Pick'`. These are rendered using the existing `renderTrailCard()` function output but as static HTML (not dynamic/location-filtered). Recommended walks for geographic variety:
- A southern England pick (e.g. Leith Hill & Coldharbour — Surrey)
- A northern England pick (any Sniffout Pick with northern lat/lon)
- A coastal or Welsh/Scottish pick if available

If there are only 3 Sniffout Pick badge entries in `WALKS_DB`, use all 3. If more, choose 3 with the highest ratings for geographic spread.

**New CSS to add** (inside existing `<style>` block, after `.preview-label` rules):

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

**CSS to remove or leave unused:** The `.preview-label`, `.walk-preview-card`, `.walk-preview-photo`, `.walk-preview-body`, `.walk-preview-name`, `.walk-preview-tags`, `.walk-preview-tag`, `.weather-preview-card`, `.weather-preview-icon`, `.weather-preview-title`, `.weather-preview-sub` rules can be left in place (they are not harmful) but the HTML elements using them should be removed from `#state-a`.

---

### Social Proof Strip Update

**Current copy:** `25 handpicked UK walks · Works offline · Dog-specific routes`

**Proposed copy:** `25 handpicked UK walks · Live conditions · No account needed`

Changes:
- "Works offline" removed — the offline claim is partial and may mislead users; it applies to cached sessions only
- "Dog-specific routes" → "No account needed" — more differentiated and directly addresses the most common first-time hesitation

---

### Hero Body Text (Advisory — Copy Change)

Current: "25 handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots."

This is a spec list, not a voice. It reads like a features list, not a product statement. Advisory suggestion (requires PO sign-off to change):

> "Find the right walk for you and your dog. Curated routes, live conditions, and no account needed."

If PO does not confirm, current body text is acceptable. Do not change without sign-off.

---

### State A — Full Layout Specification (top to bottom)

| # | Element | Component | Notes |
|---|---------|-----------|-------|
| 1 | Wordmark | `.state-a-header` / `.wordmark` | No change |
| 2 | Headline | `.hero-headline` | "Discover great walks" — no change |
| 3 | Subline | `.hero-subline` | "Handpicked walks. Live conditions." — no change |
| 4 | Body text | `.hero-body` | See advisory above; no change required |
| 5 | CTA block | `.cta-block` | "Find walks near me" button + "Or enter a location →" — no change |
| 6 | Recent pills | `#recent-pills` | JS rendered — no change |
| 7 | Search expand | `.search-expand` | Hidden until tapped — no change |
| 8 | **Sniffout Picks preview** | `.preview-picks-section` | **New — replaces items 6,7,8 below** |
| 8a | Section label | `.preview-picks-label` | "Sniffout Picks" |
| 8b | Location prompt | `.preview-picks-prompt` | "Set your location to see what's nearest →" — tapping triggers GPS CTA |
| 8c | Walk card scroll | `.trail-carousel.preview-carousel` | 3 Sniffout Pick cards; pointer-events none; 85% opacity |
| 9 | Social proof | `.social-proof` | Updated copy (see above) |

---

## STATE B — Location Set

### Audit of Current State

Current `#state-b-content` layout (rendered by `renderTodayStateB` + `renderWalksNearby`):

1. **Weather hero card** — temp, feels like, emoji, verdict title, pills (humidity, wind, feels). Tappable → Weather tab. This is good.
2. **Hazard cards** — rendered inline if active hazards. This is good.
3. **`#today-walks-section`** — populated by `renderWalksNearby`:
   - Section header: "Walks nearby" + "See all →" link
   - Horizontal scroll: 6 nearest portrait cards (160px wide)
4. **Nothing.** Empty screen below the walk scroll.

**Problems identified:**
- `verdict.body` — the actual actionable walking guidance — is computed but never shown on the Today tab. It only appears on the Weather tab. This is the biggest missed opportunity: the one piece of content that changes every day and directly answers "should I take my dog out?" is hidden behind a tab switch.
- The empty space below the walk cards makes the screen feel incomplete on the second and subsequent opens.
- "Walks nearby" is a weak section label. These are Sniffout's curated picks, not just "walks nearby."
- There is no secondary discovery layer for returning users. The same 6 portrait cards appear every time.

---

### Proposed State B Changes

Three additions to the Today tab State B, each building on existing components with no new API calls:

1. **Rename "Walks nearby" → "Sniffout Picks nearby"** (in `renderWalksNearby`)
2. **Add a "Today's conditions" card** below the walk section (in `renderTodayStateB`)
3. **Add a "Hidden gems" section** below the conditions card (in `renderWalksNearby`)

---

### Change 1: Section Label — "Walks nearby" → "Sniffout Picks nearby"

**In `renderWalksNearby` function**, change:

```js
'<div class="section-title">Walks nearby</div>'
```

to:

```js
'<div class="section-title">Sniffout Picks nearby</div>'
```

This positions the curated walks correctly — they are Sniffout's editorial selection, not a generic proximity list. Consistent with the Walks tab rename (FIX 5.9) and the State A preview section label above.

---

### Change 2: Today's Conditions Card

**The daily hook.** This card shows the `verdict.body` text — the actionable guidance computed by `getWalkVerdict()`. It is the answer to "should I take my dog out?" and it changes with the weather every day. Currently this text is only visible on the Weather tab.

**Placement:** Immediately after `#today-walks-section`, before the hidden gems section.

**Visual design:**
- White surface card with a subtle brand-green tinted border and fill
- `border-radius: 16px`, consistent with all other cards
- 16px horizontal margins, 16px vertical padding
- No icon in the body — the verdict body text already begins with a weather emoji (e.g. "🌤️ About as good as it gets…"). Keep the text exactly as-is from `getWalkVerdict().body`.
- A "Full forecast →" tap target at the bottom-right of the card, linking to the Weather tab

**Behaviour:** Rendered inside `renderTodayStateB` (which already has `verdict`). Not in `renderWalksNearby`.

**Implementation change in `renderTodayStateB`:**

After `'<div id="today-walks-section"></div>'`, add:

```js
'<div class="today-conditions-card">' +
  '<div class="today-conditions-body">' + verdict.body + '</div>' +
  '<span class="today-conditions-link" onclick="switchTab(\'weather\')">Full forecast →</span>' +
'</div>' +
'<div id="today-hidden-gems"></div>'
```

**New CSS to add:**

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

/* Dark mode override (add alongside other body.night overrides) */
body.night .today-conditions-card {
  background: rgba(110,231,183,0.06);
  border-color: rgba(110,231,183,0.18);
}
body.night .today-conditions-body {
  color: var(--ink);
}
body.night .today-conditions-link {
  color: var(--brand);
}
```

---

### Change 3: Hidden Gems Section

**The returning-user discovery layer.** A second horizontal portrait card scroll showing walks from `WALKS_DB` with `badge === 'Hidden gem'`, sorted by distance from the user's location. This section surfaces lesser-known walks that distance-sorting in the Sniffout Picks section would bury.

**Why it works:** There are ~6 Hidden gem badge walks in `WALKS_DB`, spread across the UK. Unlike the "Sniffout Picks nearby" section (which requires walks to be within the user's selected radius), this section uses a wider fixed threshold (50km) so returning users always have something to discover even at small radius settings.

**Behaviour rules:**
- Sort all `badge === 'Hidden gem'` walks ascending by distance from `lat, lon`
- Show up to 4 cards
- **Only show the section if at least 1 Hidden gem walk is within 50km.** If none qualify, the `#today-hidden-gems` div remains empty (zero height, no gap).
- If at least 1 qualifies, render the section header + the qualifying cards (up to 4)

**Placement:** Inside `renderWalksNearby(lat, lon)`, after the Sniffout Picks section is rendered. The `#today-hidden-gems` div was added to `renderTodayStateB` in Change 2.

**Implementation in `renderWalksNearby`:**

After the existing portrait card scroll HTML, add:

```js
// Hidden gems section
var hiddenGems = WALKS_DB
  .filter(function(w) { return w.badge === 'Hidden gem'; })
  .map(function(w) {
    return { walk: w, dist: haversineMiles(lat, lon, w.lat, w.lon) };
  })
  .filter(function(item) { return item.dist <= 31; }) // 50km ≈ 31 miles
  .sort(function(a, b) { return a.dist - b.dist; })
  .slice(0, 4)
  .map(function(item) { return item.walk; });

var gemsEl = document.getElementById('today-hidden-gems');
if (gemsEl) {
  if (hiddenGems.length > 0) {
    gemsEl.innerHTML =
      '<div class="section-header">' +
        '<div class="section-title">Hidden gems</div>' +
        '<span class="section-link" onclick="switchTab(\'walks\')">Explore →</span>' +
      '</div>' +
      '<div class="hscroll-row" style="padding:0 16px 24px">' +
        hiddenGems.map(renderPortraitCard).join('') +
      '</div>';
  }
}
```

No new CSS required — uses existing `.section-header`, `.section-title`, `.section-link`, `.hscroll-row`, and `.portrait-card` components.

---

### State B — Full Layout Specification (top to bottom)

| # | Element | Component | Change |
|---|---------|-----------|--------|
| 1 | App header + wordmark | `.app-header` / `.wordmark` | No change |
| 2 | Location line | `.location-line` | No change |
| 3 | Inline search (hidden) | `#state-b-search` | No change |
| 4 | **Weather hero card** | `.weather-hero` | No change. Tappable → Weather tab |
| 5 | Hazard cards | `.hazard-card` | No change. Conditional on weather |
| 6 | **Sniffout Picks nearby** | `#today-walks-section` | Label rename: "Walks nearby" → "Sniffout Picks nearby" |
| 6a | Section header | `.section-header` | Title: "Sniffout Picks nearby" · Link: "See all →" → Walks tab |
| 6b | Portrait card scroll | `.hscroll-row` + `.portrait-card` | No change — 6 nearest curated walks |
| 7 | **Today's conditions card** | `.today-conditions-card` | **New.** Shows `verdict.body`. "Full forecast →" → Weather tab |
| 8 | **Hidden gems section** | `#today-hidden-gems` | **New.** Conditional on ≥1 Hidden gem walk within 50km |
| 8a | Section header | `.section-header` | Title: "Hidden gems" · Link: "Explore →" → Walks tab |
| 8b | Portrait card scroll | `.hscroll-row` + `.portrait-card` | Up to 4 Hidden gem walks, sorted by distance |

---

## Implementation Priority

| Priority | Change | State | Effort |
|----------|--------|-------|--------|
| 1 — Critical | Add Today's conditions card | B | Low — `verdict.body` already computed; one card + CSS |
| 2 — High | Replace generic preview cards with Sniffout Picks scroll | A | Medium — static HTML for 3 trail cards + section CSS |
| 3 — High | Rename "Walks nearby" → "Sniffout Picks nearby" | B | Trivial — string change in `renderWalksNearby` |
| 4 — Medium | Add Hidden gems section | B | Low — ~15 lines of JS using existing components |
| 5 — Low | Social proof copy update | A | Trivial — string change in HTML |
| Advisory | Hero body text | A | Requires PO sign-off before implementing |

---

## Component Reuse Confirmation

All proposed components reuse the existing design system exactly:

| Proposed element | Existing component reused |
|-----------------|--------------------------|
| State A walk card preview | `.trail-card` + `.trail-carousel` (no changes to existing CSS) |
| State B conditions card | New CSS — consistent with `.hazard-card` and `.walk-preview-card` tint approach |
| State B hidden gems scroll | `.hscroll-row` + `.portrait-card` (identical to Sniffout Picks nearby) |
| All section headers | `.section-header` / `.section-title` / `.section-link` (unchanged) |

No new card shapes. No new font sizes. No new spacing tokens. The existing `border-radius: 16px`, `var(--brand)`, `var(--ink)`, `var(--ink-2)` tokens are used throughout.

---

## Dark Mode Notes

Both new components have dark mode rules specified:
- `.today-conditions-card` override is included in the CSS above (dependency on FIX 5.1 being in place first)
- `.preview-carousel` opacity (0.85) reads well in both light and dark mode — no additional dark mode rule needed
- The dark mode `body.night .today-conditions-card` override should be added alongside the other `body.night` overrides added in FIX 5.6

---

## What This Does Not Include

The following are out of scope for this proposal (Phase 2 or later):
- Personalised walk recommendations based on user history
- A "walk streak" counter or gamified usage tracking
- Time-of-day aware content refresh beyond the existing weather data
- Community-generated content of any kind

---

*Design proposal complete. Ready for Developer implementation.*
