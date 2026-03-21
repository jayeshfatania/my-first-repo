# State A Redesign Spec
**Screen:** Today tab — no location set (first-run / State A)
**Status:** Design spec — ready for Developer implementation
**Design round:** Post-Round 12

---

## What this spec covers

Six problems identified in the UX review, addressed together as a single structural pass. Two of the six (headline size, secondary action underline) are already resolved in the current code — noted below so the Developer does not spend time on them. The remaining four require changes.

---

## Current structure (for reference)

```
Header: wordmark (22px)

hero-section:
  h1 "Discover great walks"
  p.hero-subline "Handpicked walks. Live conditions."
  p.hero-body [walk count + feature paragraph]       ← REMOVE
  .cta-block (white card wrapper)                    ← REMOVE card, keep contents
    button.cta-primary "Find walks near me"
    span.cta-secondary "Or enter a location →"
  #recent-pills
  .search-expand

.preview-picks-section                               ← MOVE UP
  "Sniffout Picks" + carousel

.social-proof                                        ← REWRITE copy
  "{count}+ handpicked UK walks · Just open and explore · Dog-specific routes"
```

---

## New structure

```
Header: wordmark (20px)

hero-section:
  h1 "Discover great walks"
  p.hero-subline "Handpicked walks. Live conditions."
  button.cta-primary "Find walks near me"            ← sits directly on --bg
  span.cta-secondary "Or enter a location →"
  #recent-pills
  .search-expand

.preview-picks-section                               ← immediately below hero-section
  "Sniffout Picks" + carousel

.social-proof                                        ← below picks
  "{count}+ handpicked walks · Live weather & paw safety · Off-lead & terrain info"
```

---

## Change 1 — Remove the hero body copy paragraph

**Remove `p.hero-body` from the HTML entirely.**

The paragraph currently reads (dynamically populated):
> "65+ handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots."

This is a feature list in prose form. It tells the user what the app does without showing them. The subline ("Handpicked walks. Live conditions.") already communicates the product promise in five words. Everything the paragraph says is either covered by the subline or visible in the picks carousel cards directly below.

Removing it:
- Gets the CTA higher on screen
- Gets the picks carousel on screen sooner (less scrolling before the user sees real walks)
- Removes the verbosity that made State A feel like a landing page rather than an app

**JS cleanup:** The inline script at the bottom of the file (`hero-body-walk-count`) updates the paragraph's text content dynamically. Remove this element from the HTML and remove the corresponding `getElementById('hero-body-walk-count')` line from the script block. The walk count is still shown in the social proof strip — only the paragraph target is removed.

---

## Change 2 — Remove the CTA card wrapper

**Remove the `.cta-block` wrapper card.** The primary button and secondary action should sit directly on `var(--bg)`.

The `.cta-block` has:
```
background: var(--surface);
border: 1px solid var(--border);
border-radius: 16px;
padding: 20px 16px 16px;
margin-bottom: 20px;
```

This creates a white card on a warm off-white background. The primary action is framed inside a container, which makes it feel housed rather than confident. A button this important should own the space it's in.

**What to do:** Remove the `<div class="cta-block">` wrapper from the HTML. The `button.cta-primary` and `span.cta-secondary` become direct children of `.hero-section`.

**CSS adjustments needed:**
- `button.cta-primary` already has `margin-bottom: 14px` — keep as is
- `span.cta-secondary` should have `margin-bottom: 24px` added (or `display: block` with `margin-bottom: 24px`) to maintain breathing room before `#recent-pills` and the search expand
- The `.cta-block` CSS class can remain in the stylesheet but the HTML element is removed — or the class can be deleted entirely; Developer's choice

The search expand (`#search-expand`) and recent pills (`#recent-pills`) remain as children of `.hero-section` below the secondary action, unchanged in position or behaviour.

---

## Change 3 — Move picks carousel above social proof

**The `.preview-picks-section` should appear immediately below `.hero-section`, before `.social-proof`.** This is already its position in the HTML — the carousel sits between the hero section and the social proof strip. No HTML reordering is needed.

However, the carousel currently sits below a large `padding-bottom: 28px` on `.hero-section` and below the search-expand area. Once the body copy paragraph is removed and the CTA card wrapper is gone, the hero section becomes shorter, and the carousel will naturally appear higher on screen. No structural change required beyond the paragraph removal above.

**Verify after implementing Change 1 and Change 2:** on a 390px screen, the picks carousel should be visible without scrolling, or at most require a very small scroll. If the carousel is still below the fold, reduce `padding: 24px 16px 28px` on `.hero-section` to `padding: 24px 16px 20px`.

---

## Change 4 — Rewrite social proof strip copy

**Current:**
```
{count}+ handpicked UK walks · Just open and explore · Dog-specific routes
```

"Just open and explore" carries zero information. It is the kind of copy that fills space rather than earns it.

**New copy:**
```
{WALKS_DB.length}+ handpicked walks · Live weather & paw safety · Off-lead & terrain info
```

Three items. Each item tells the user something they could not have assumed:
- Item 1 (`{count}+ handpicked walks`): scale — this is a curated, real-sized dataset, not a proof-of-concept with five routes
- Item 2 (`Live weather & paw safety`): the primary differentiator — no UK competitor combines these in a single no-login product
- Item 3 (`Off-lead & terrain info`): the data that dog walkers actually need before choosing a route

"UK" is dropped from item 1 — it is implied by the product context and saving the two characters helps at narrow screen widths where the strip wraps. The count number retains the `+` suffix to communicate growth ("65+" reads as "at least 65", which is honest — more walks are coming).

**JS update:** The inline script currently sets:
```js
document.getElementById('social-proof-walk-count').innerHTML =
  WALKS_DB.length + '+ handpicked UK walks\u00b7 Just open and explore\u00b7 Dog-specific routes';
```

Update to:
```
WALKS_DB.length + '+ handpicked walks&nbsp;\xb7&nbsp;Live weather &amp; paw safety&nbsp;\xb7&nbsp;Off-lead &amp; terrain info'
```

No other JS changes required for the social proof strip.

---

## Change 5 — Wordmark: 22px → 20px

The `.state-a-header .wordmark` is currently `font-size: 22px`. The State B wordmark (inside `.app-header .wordmark`) is 20px. The two-pixel discrepancy is a small inconsistency but it registers on transition when a user sets a location. Fix `.state-a-header .wordmark` to `font-size: 20px` to match.

---

## Already resolved — no action required

**Headline size (UX review issue M5):** `.hero-headline` is currently `font-size: 32px` in the stylesheet. The review flagged 28px but the fix was already applied. No change needed.

**Secondary action underline (UX review issue H8):** `.cta-secondary` is currently `color: var(--ink-2)`, `font-weight: 500`, with no `text-decoration` property — meaning no underline is rendered. The review flagged an underline treatment but it is already absent. No change needed.

---

## Layout visualisation — before and after

### Before
```
┌──────────────────────────────────────────────┐
│  sniffout  (22px)                            │
├──────────────────────────────────────────────┤
│  Discover great walks                        │  32px/700
│  Handpicked walks. Live conditions.          │  15px/400
│                                              │
│  65+ handpicked UK walks with terrain,       │  ← dense paragraph
│  off-lead and livestock info — plus live     │    14px/400 ink-2
│  weather checks and nearby dog-friendly...   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │  [ Find walks near me      📍 ]        │   │  ← wrapped in white card
│ │  Or enter a location →                 │   │
│ └────────────────────────────────────────┘   │
│                                              │
│  ↕ scroll required to reach picks           │
│                                              │
│  Sniffout Picks                              │
│  [card][card][card] →                        │
│                                              │
│  65+ walks · Just open and explore ·         │  ← filler copy
│  Dog-specific routes                         │
└──────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────┐
│  sniffout  (20px)                            │
├──────────────────────────────────────────────┤
│  Discover great walks                        │  32px/700
│  Handpicked walks. Live conditions.          │  15px/400
│                                              │
│  [ Find walks near me           📍 ]         │  ← button directly on --bg
│  Or enter a location →                       │
│                                              │
│  Sniffout Picks                              │  ← visible without scrolling
│  [card][card][card] →                        │
│                                              │
│  65+ handpicked walks · Live weather &       │  ← specific copy
│  paw safety · Off-lead & terrain info        │
└──────────────────────────────────────────────┘
```

---

## CSS changes summary

| Element | Property | Old value | New value |
|---|---|---|---|
| `.state-a-header .wordmark` | `font-size` | `22px` | `20px` |
| `.cta-block` | Entire HTML element | Present | Removed |
| `.cta-secondary` | `margin-bottom` | none | `24px` |
| `p.hero-body` | Entire HTML element | Present | Removed |

No new CSS classes are needed. All changes are removals or single-property updates to existing elements.

---

## Copy changes summary

| Element | Old copy | New copy |
|---|---|---|
| `p.hero-body` | Walk count + feature paragraph | Removed |
| `#social-proof-walk-count` | `{count}+ handpicked UK walks · Just open and explore · Dog-specific routes` | `{count}+ handpicked walks · Live weather & paw safety · Off-lead & terrain info` |

The hero headline ("Discover great walks") and subline ("Handpicked walks. Live conditions.") are unchanged.

---

## Implementation order

Do these in sequence — each change makes the next easier to verify:

1. Fix wordmark font-size: 22px → 20px
2. Remove `p.hero-body` from HTML and its JS update line
3. Remove the `.cta-block` wrapper div, keep its children in place; add `margin-bottom: 24px` to `.cta-secondary`
4. Verify picks carousel is above the fold (or near-above) on 390px screen; adjust `.hero-section` bottom padding if needed
5. Update social proof copy in the JS script block
