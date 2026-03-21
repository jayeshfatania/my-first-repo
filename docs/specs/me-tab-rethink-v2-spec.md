# Me Tab — Complete Fresh Start
**Version:** v2 — Rethink
**Replaces:** me-tab-redesign-spec.md, me-tab-rethink-spec.md
**Guiding principle:** Show one thing well, then everything else.

---

## What Went Wrong Before

Previous specs tried to show too much at once: featured card, distance progress bar, badge grid, walk log, settings — all visible before scrolling. The result felt like a dashboard, not a personal tab. The owner's critique was right: it was overwhelming and generic.

This spec starts with a different question: what is the single most honest, personal, rewarding thing to show a user on this tab? Everything else gets organised around that.

---

## The Single Most Important Thing

**Total miles walked.**

Not walks logged (gameable, forgettable). Not distance progress toward a goal (pressure, not reward). Not a featured card that changes based on state logic (complex, brittle).

Just: how far has this person walked with Sniffout.

Miles is the one number that:
- Grows with every logged walk
- Has no ceiling and no comparison — it is simply theirs
- Is legible instantly ("You've walked 47 miles")
- Feels earned in a way that walk counts do not
- Works as a hero number at small values ("12 miles") and large ones ("214 miles")

The miles number is the anchor of the tab. Everything else serves it or sits below it.

---

## Three States

### State 1 — New User (zero walks logged)

The user has never logged a walk. There is nothing to show. Show nothing pretending to be something.

**What they see:**
- Header: their name (from `sniffout_username`) + gear icon
- A single warm card with an invite to explore walks — no empty-state illustration, no onboarding checklist, just a sentence and a link
- Nothing else

The card copy: **"Start exploring walks to build your story here."**
Below it, a single quiet link: **"Find a walk →"** — taps through to Walks tab.

No badges row. No walk log. No progress bar. No placeholder state for each missing element. The page is genuinely sparse and that is correct — the user has not done anything yet.

### State 2 — Some Data (1–4 walks logged)

The user has started using the app. Not enough data to feel like a returning walker, but enough to show something personal.

**What they see:**
- Header: name + gear icon
- Hero number: their total miles, in large type, with a label ("miles walked")
- Below the hero: secondary line showing walks logged ("across 3 walks")
- If any badges earned: badge row (see below)
- Walk log: last 3 walks

The miles number will be small (maybe 8–22 miles for this state). That is fine. The number is real and honest.

### State 3 — Established User (5+ walks logged)

Same layout as State 2. The tab does not gain new sections — it simply fills in. The hero number is bigger, the walk log has more entries, the badge row may have more chips. The tab grows through content density, not new components.

This is the key design principle: the layout never changes. There is no "you've unlocked a new section" moment. The structure is stable from first use.

---

## Layout — Three Zones

```
┌─────────────────────────────────┐
│  [Name]              [gear icon]│  ← Zone 1: Header
├─────────────────────────────────┤
│                                 │
│         47.3                    │  ← Zone 2: Hero (miles, large)
│         miles walked            │
│         across 12 walks         │
│                                 │
├─────────────────────────────────┤
│  Your badges                    │  ← Zone 3: Badges (if earned)
│  [Leads On]  [Good Report] ...  │
├─────────────────────────────────┤
│  Recent walks          ↓ scroll │
│  Roseberry Topping  3.8 mi  —   │  ← Walk log (below fold or
│  Box Hill Loop      3.2 mi  —   │     just at fold edge)
│  Seven Sisters      7.8 mi  —   │
└─────────────────────────────────┘
```

On a standard 390×844 phone, zones 1–3 fit above the fold. The walk log starts at or just below fold. The user does not need to scroll to get the meaningful information; they scroll only to review their history.

**Visible without scrolling:** 3 elements (header, hero, badges if earned). Maximum 4 if the first walk log entry is just visible at the fold edge.

---

## Zone 1 — Header

```html
<div class="me-header">
  <span class="me-name">Jay</span>
  <button class="me-gear" aria-label="Settings">
    <!-- gear icon SVG -->
  </button>
</div>
```

```css
.me-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
}
.me-name {
  font: 700 22px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -0.3px;
}
.me-gear {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: none;
  color: var(--ink-2);
  border-radius: 50%;
}
```

**Rules:**
- No "Sniffout walker" label — the name is the label
- No subtitle, tagline, or role text
- If no username is set, show nothing in the name slot (do not fall back to "Walker" or any placeholder)
- Gear icon opens existing settings bottom sheet

---

## Zone 2 — Hero

### New user (zero walks)

```html
<div class="me-hero me-hero--empty">
  <p class="me-empty-line">Start exploring walks to build your story here.</p>
  <button class="me-empty-cta" onclick="showTab('walks')">Find a walk →</button>
</div>
```

```css
.me-hero--empty {
  margin: 8px 16px;
  padding: 28px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.me-empty-line {
  font: 400 16px/1.5 'Inter', sans-serif;
  color: var(--ink-2);
}
.me-empty-cta {
  font: 600 15px/1 'Inter', sans-serif;
  color: var(--brand);
  background: none; border: none;
  padding: 0; text-align: left;
  cursor: pointer;
}
```

### Returning user (1+ walks)

```html
<div class="me-hero">
  <span class="me-miles-number">47.3</span>
  <span class="me-miles-label">miles walked</span>
  <span class="me-walks-sub">across 12 walks</span>
</div>
```

```css
.me-hero {
  margin: 8px 16px 20px;
  padding: 28px 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.me-miles-number {
  font: 700 72px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -3px;
  line-height: 1;
}
.me-miles-label {
  font: 500 16px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 4px;
}
.me-walks-sub {
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  opacity: 0.7;
}
```

**Rules:**
- Miles number: calculated from `sniffout_walk_log` entries, summing the `distance` field of each logged walk
- If the user has data but miles calculates to 0.0 (shouldn't happen, but defensive): show the empty state instead
- No progress bar toward a milestone — the number speaks for itself
- No trend arrows, no period selectors, no "this week vs last week"
- The walks sub-line ("across N walks") is secondary — smaller, dimmer
- Dark mode: card background `var(--surface)` stays white in `body.night` unless night-mode surface token differs — no change needed

---

## Zone 3 — Badges

Badges are only shown if at least one has been earned. If no badges are earned, this zone does not render — no empty row, no "0 badges" state, no locked placeholders.

```html
<!-- Only rendered if earnedBadges.length > 0 -->
<div class="me-badges-section">
  <span class="me-section-label">Your badges</span>
  <div class="me-badges-scroll">
    <!-- one .me-badge-chip per earned badge -->
    <span class="me-badge-chip">
      <svg><!-- checkmark or badge-specific icon --></svg>
      Leads On
    </span>
  </div>
</div>
```

```css
.me-badges-section {
  padding: 0 16px 16px;
}
.me-section-label {
  display: block;
  font: 500 11px/1 'Inter', sans-serif;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
}
.me-badges-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.me-badges-scroll::-webkit-scrollbar { display: none; }
.me-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 20px;
  background: rgba(30, 77, 58, 0.10);  /* update to match --brand */
  border: 1px solid rgba(30, 77, 58, 0.22);
  font: 600 13px/1 'Inter', sans-serif;
  color: var(--brand);
  white-space: nowrap;
  flex-shrink: 0;
  cursor: default;
}
```

**Tapping a badge chip** reveals an inline detail row directly beneath the scroll row (not a bottom sheet, not a modal):

```html
<div class="me-badge-detail" aria-live="polite">
  <span class="me-badge-detail-name">Leads On</span>
  <span class="me-badge-detail-desc">You went on your first three walks on different days.</span>
  <span class="me-badge-detail-date">Earned 14 Feb 2026</span>
</div>
```

```css
.me-badge-detail {
  margin-top: 10px;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: fadeIn 160ms ease;
}
.me-badge-detail-name { font: 600 13px/1 'Inter', sans-serif; color: var(--ink); }
.me-badge-detail-desc { font: 400 13px/1.4 'Inter', sans-serif; color: var(--ink-2); }
.me-badge-detail-date { font: 400 12px/1 'Inter', sans-serif; color: var(--ink-2); opacity: 0.65; }
```

Tapping a different badge collapses the current detail and opens the new one. Tapping the same badge again collapses. One detail open at a time.

---

## Zone 4 — Walk Log (below fold)

```html
<div class="me-walks-section">
  <div class="me-walks-header">
    <span class="me-section-label">Recent walks</span>
    <!-- Only if more than 3 walks: -->
    <button class="me-walks-see-all">See all 12 →</button>
  </div>
  <div class="me-walk-list">
    <div class="me-walk-row">
      <div class="me-walk-row-left">
        <span class="me-walk-name">Roseberry Topping</span>
        <span class="me-walk-meta">3.8 mi · North York Moors</span>
      </div>
      <span class="me-walk-date">14 Feb</span>
    </div>
    <!-- repeat for up to 3 rows -->
  </div>
</div>
```

```css
.me-walks-section { padding: 0 16px 32px; }
.me-walks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.me-walks-see-all {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--brand);
  background: none; border: none;
  padding: 0; cursor: pointer;
}
.me-walk-list { display: flex; flex-direction: column; gap: 1px; }
.me-walk-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}
.me-walk-row:last-child { border-bottom: none; }
.me-walk-row-left { display: flex; flex-direction: column; gap: 3px; }
.me-walk-name { font: 500 14px/1 'Inter', sans-serif; color: var(--ink); }
.me-walk-meta { font: 400 12px/1 'Inter', sans-serif; color: var(--ink-2); }
.me-walk-date { font: 400 12px/1 'Inter', sans-serif; color: var(--ink-2); }
```

**Rules:**
- Show last 3 logged walks, most recent first
- "See all N walks →" only appears if more than 3 logged — tapping expands the list in-place (no separate screen)
- Date format: day + month only ("14 Feb"), no year
- Walk meta: distance + location (from WALKS_DB `location` field)
- If user has 0 walks: this section does not render (hidden by empty state already covering the tab)

---

## Context-Aware Logic (JS sketch)

```js
function renderMeTab() {
  const username  = localStorage.getItem('sniffout_username') || '';
  const walkLog   = JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]');
  const earnedBadges = getEarnedBadges();  // returns array from localStorage

  // Header: always rendered
  renderMeHeader(username);

  // Hero
  if (walkLog.length === 0) {
    renderMeHeroEmpty();
  } else {
    const totalMiles = walkLog.reduce((sum, w) => sum + (w.distance || 0), 0);
    renderMeHero(totalMiles, walkLog.length);
  }

  // Badges: only if earned
  if (earnedBadges.length > 0) {
    renderMeBadges(earnedBadges);
  }

  // Walk log: only if walks exist
  if (walkLog.length > 0) {
    const recent = walkLog.slice().reverse().slice(0, 3);
    renderMeWalkLog(recent, walkLog.length);
  }
}
```

---

## What Was Removed and Why

| Removed | Reason |
|---|---|
| "Sniffout walker" label | Adds no value; the tab is implicitly about the user |
| Seasons walked | Meaningless for most users; gameable; not personally rewarding |
| Favourite region | Derived stat that feels generated, not earned |
| Miles explored appearing twice | Was shown in featured card and progress bar — now shown once |
| Locked badges (greyed out) | Owner decision: hidden until earned |
| Progress bar | Implies a target; creates pressure not reward |
| Context-aware featured card (5 states) | Too complex; the miles hero does the job simply |
| Badge grid | Replaced with horizontal scroll row; grid wasted space on locked placeholders |

---

## Dark Mode

No additional overrides needed beyond what `body.night` already provides for `--surface`, `--ink`, `--ink-2`, `--border`, `--bg`. The me-tab uses only these tokens.

The badge chip `rgba` tint will need updating alongside the brand colour decision — this is a Round 15 implementation task, not a spec task.

---

## Phase 3 Hooks

These are not implemented now but the structure accommodates them cleanly:

- **Profile photo:** A circular avatar above the name in the header. Slot exists — just insert before `.me-name`.
- **Following / followers count:** A two-number row below the hero card. Inserts between `.me-hero` and `.me-badges-section`.
- **Sign-in CTA:** If user is not signed in (Phase 3 auth), the empty state card includes a "Create account to save your walks" prompt. In-state only — no persistent banner.
- **Streak counter:** Could replace or complement the walks-sub line inside the hero card ("12 walks · 4-week streak"). No layout change needed.
