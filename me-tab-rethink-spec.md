# Me Tab — Complete Rethink
**Status:** Fresh design proposal
**Supersedes:** me-tab-redesign-spec.md, me-tab-vision.md layout proposals
**Design round:** Post-Round 14

---

## Start With the Feeling

Every previous attempt at the Me tab has started with structure — zones, cards, data sources, badge grids — and then tried to make that structure feel personal. That is the wrong order.

Start with the feeling. Then build the structure to serve it.

**The feeling the Me tab should create:**

Opening the Me tab should feel like looking at your walking boots at the end of a good year. Worn in. Specific. Yours. The app has been somewhere with you, and it knows it.

It should not feel like opening a profile page. It should not feel like opening a dashboard. It should feel like a quiet moment of recognition — the app saying "here's what we've done together."

This is a fundamentally different emotional register from the current implementation. The current tab says: "here is your data." The rethink says: "here is your story."

---

## The Single Structural Insight

Every previous iteration has tried to show too much at once. The badge grid, the highlights card, the progress bar, the walk log, the seasons, the stats — all competing for attention at the same visual weight.

The rethink has one structural rule:

**Show one thing well. Then everything else.**

The hero of the Me tab is a single full-width featured card. This card is context-aware — it surfaces the single most interesting or relevant personal insight right now. Not the most data. The most interesting data.

Everything else — the badges, the walk log, the settings — lives below it. Present but not competing.

---

## What the Tab Looks Like

```
16px side padding throughout

┌──────────────────────────────────────────────┐
│  [Name / greeting]              [⚙ 36×36]    │  ← HEADER
│  Since November 2025                         │
└──────────────────────────────────────────────┘

  20px gap

┌──────────────────────────────────────────────┐
│                                              │
│  [FEATURED CARD — context-aware]             │  ← THE HERO
│  [Changes based on user state]               │
│                                              │
└──────────────────────────────────────────────┘

  20px gap

  Badges                          [see all →]  ← COMPACT ROW
  [earned chip] [earned chip] [locked chip]    ← horizontal scroll

  20px gap

  Recent walks                                 ← COMPACT LOG
  [Row]
  [Row]
  [Row]
  See all 8 walks →

  32px bottom padding
```

Three elements. That is all.

The header. The featured card. Then two compact supporting sections below.

Settings live in the gear icon — not on the page at all.

---

## The Header

Not a settings row. Not a data label. A greeting.

```
[Display name, 20px 700]               [⚙]
Since November 2025  (13px, ink-2)
```

- Display name: Inter 700, 20px, `var(--ink)`. This is the user's name — not "Your profile", not "Me", not "Your walks". Their name.
- If no name is set: "Your walks" in `var(--ink-2)`, Inter 400, 20px — neutral but not a header label. Below it: "Add your name →" in `var(--brand)`, 13px, taps to open settings sheet.
- Since line: "Since {Month} {Year}" — derived from earliest timestamp in `sniffout_walk_log`. Hidden if no walks. 13px, `var(--ink-2)`.
- Gear icon: top-right, 36×36 tap target, 20×20px icon, `var(--ink-2)`.

**Phase 3 hook:** circular photo (44×44) prepends the name block. Layout is designed for this — [photo | name block | gear]. In Phase 2, photo is entirely absent.

---

## The Featured Card

This is the whole point of the redesign. One card. Full width. Generous height (~180px). White surface. Context-aware content.

The card does not have a fixed title or a fixed layout. Its content is determined by `getFeaturedInsight()` — a function that evaluates the user's current state and returns the single most interesting thing to surface right now.

### Card container

```css
.me-featured {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  margin: 0 16px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

The card has no icon in the corner, no section label, no nav chevron. It is not tappable by default (some states have a CTA inside, but the card itself is not a tap target unless the state requires it). It is a moment to pause, not to act.

### Featured card states — in priority order

The `getFeaturedInsight()` function evaluates these conditions in order and returns the first that applies.

---

**State 1: Milestone just reached (highest priority)**

Triggered: a new distance milestone was passed since the last time the tab was opened (check against a `sniffout_last_milestone` localStorage key).

```
┌──────────────────────────────────────────────┐
│  25 Miles                                    │  ← Inter 700, 48px, var(--brand)
│                                              │
│  You've walked 27.4 miles with Sniffout.     │  ← Inter 400, 14px, ink-2
│                                              │
│  [████████████████████████░░░░░░░]           │  ← progress bar, brand green
│  27.4 mi                        → 50 Miles   │
└──────────────────────────────────────────────┘
```

The dominant element is the milestone name in large brand green. This is the one moment where the tab is celebratory. It is not confetti — it is just a large, calm statement of fact. You did this.

After the user opens the tab once with this state active, mark `sniffout_last_milestone` with the current milestone — so it shows this "just reached" state only once per milestone. On subsequent opens, fall through to State 3.

---

**State 2: Active distance progress (second highest priority)**

Triggered: user has logged walks totalling ≥ 2 miles, and no milestone was just reached.

```
┌──────────────────────────────────────────────┐
│  14.3                                        │  ← Inter 700, 64px, var(--ink)
│  miles walked                                │  ← Inter 400, 15px, ink-2
│                                              │
│  [██████████░░░░░░░░░░░░░░░░░░]              │  ← progress bar
│  10.7 miles to 25 Miles                      │  ← Inter 400, 13px, ink-2
└──────────────────────────────────────────────┘
```

The number is the hero. Large. Personal. Says something real about this specific user. The progress bar below it shows where they're going. The hint text names the next milestone without pressuring — it is a statement, not a countdown.

---

**State 3: Most recent walk (default for active users)**

Triggered: user has logged at least one walk, and States 1/2 are not active.

```
┌──────────────────────────────────────────────┐
│  Devil's Dyke                                │  ← Inter 700, 22px, var(--ink)
│  Walked 3 times · last visited 2 days ago    │  ← Inter 400, 13px, ink-2
│                                              │
│  3.2 miles each time                         │  ← Inter 400, 14px, ink-2
│                                              │
└──────────────────────────────────────────────┘
```

The walk name is prominent — it is the most personal piece of information on this screen. If a user returns to the same walk three times, the app recognises that. "Walked 3 times" is not a gamification number — it is a fact about a real relationship with a real place.

---

**State 4: First badge earned (one-time, celebratory)**

Triggered: user has just earned their first badge (Explorer, or any distance track badge). Same one-time logic as State 1.

```
┌──────────────────────────────────────────────┐
│  Explorer                                    │  ← Inter 700, 36px, var(--brand)
│                                              │
│  You've explored 5 different walks.          │  ← Inter 400, 14px, ink-2
│  First badge earned.                         │
│                                              │
└──────────────────────────────────────────────┘
```

---

**State 5: New user — empty (lowest priority)**

Triggered: no walks logged, fewer than 3 explored. This is the default for a brand new user.

```
┌──────────────────────────────────────────────┐
│                                              │
│  Your walks will                             │  ← Inter 700, 22px, ink-2
│  appear here                                 │
│                                              │
│  Explore walks and log them to start         │  ← Inter 400, 14px, ink-2
│  building your history.                      │
│                                              │
│  [Find a walk]                               │  ← CTA button, var(--brand)
│                                              │
└──────────────────────────────────────────────┘
```

The new user state is the only one with a CTA. Everything else is informational — the user does not need to do anything, they just need to feel seen.

The CTA "Find a walk" navigates to the Walks tab.

---

### Featured card — what it is NOT

It is not tappable (except the CTA in the empty state). It does not open a detail sheet. It does not have a "see more" chevron. It sits on the screen and breathes. This is intentional — the rest of the app is full of tappable surfaces. This card is a pause.

---

### getFeaturedInsight() — implementation note

```js
function getFeaturedInsight() {
  const log = getWalkLog();         // from sniffout_walk_log
  const totalMi = getTotalMiles(log);
  const lastMilestone = getLastMilestoneShown(); // from localStorage
  const nextMilestone = getNextMilestone(totalMi);
  const prevMilestone = getPrevMilestone(totalMi);
  const justReached = prevMilestone > lastMilestone && prevMilestone > 0;

  if (justReached) {
    setLastMilestoneShown(prevMilestone);
    return { type: 'milestone_reached', milestone: prevMilestone, total: totalMi, next: nextMilestone };
  }
  if (totalMi >= 2) {
    return { type: 'distance_progress', total: totalMi, next: nextMilestone, prev: prevMilestone };
  }
  if (log.length > 0) {
    const recent = getMostRecentWalk(log);
    return { type: 'recent_walk', walk: recent };
  }
  if (getJustEarnedFirstBadge()) {
    return { type: 'first_badge', badge: getFirstEarnedBadge() };
  }
  return { type: 'empty' };
}
```

The function is called once when the Me tab renders. The result determines which featured card HTML is injected into `.me-featured`.

---

## Badges — Compact Row

Below the featured card. Not a grid. A horizontal scroll row.

```
  Badges                          3 earned
  ────────────────────────────────────────
  [✓ Explorer] [✓ 10 Miles] [🔒 25 Miles] [🔒 Trailblazer] ...
  →  (scroll right for more)
```

```css
.me-badges-section {
  padding: 0 16px;
}
.me-badges-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.me-badges-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.me-badges-scroll::-webkit-scrollbar { display: none; }
```

Badges are the same chip design as the previous spec:
- Earned: brand-tinted background, brand text, Inter 600
- Locked: plain surface, ink-2 text, lock icon, Inter 400

The horizontal scroll keeps the visual weight low. The user can explore the full badge set by scrolling — it does not dominate the page.

"3 earned" count is right-aligned on the header row. If 0 earned, show nothing.

No "More to unlock" hint text — the locked badges visible in the scroll row are themselves the hint.

---

## Walk Log — Compact List

Below the badges. Maximum 3 rows visible.

```
  Recent walks
  ────────────────────────────────────────
  Devil's Dyke           Walked 3× · 2d ago
  ─────────────────────────────────────────
  Richmond Park          Walked once · 8d ago
  ─────────────────────────────────────────
  Leith Hill             Walked once · 2w ago
  ─────────────────────────────────────────
  See all 7 walks →
```

```css
.me-log-section {
  padding: 0 16px;
}
.me-log-heading {
  font: 600 16px/1 'Inter', sans-serif;
  color: var(--ink);
  margin-bottom: 10px;
}
.me-log-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}
.me-log-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.me-log-row:last-of-type { border-bottom: none; }
.me-log-name {
  font: 500 15px/1 'Inter', sans-serif;
  color: var(--ink);
}
.me-log-meta {
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  white-space: nowrap;
  margin-left: 12px;
}
.me-log-see-all {
  display: block;
  padding: 12px 16px;
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--brand);
  border-top: 1px solid var(--border);
  background: none;
  border-bottom: none;
  border-left: none;
  border-right: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
```

- "See all N walks →" shown when unique logged walks > 3
- Tapping a row opens walk detail overlay
- Meta format: "Walked 3× · 2d ago" — compact, scannable. Use "×" not "times" in the log row (space is tight). Reserve the fuller "Walked 3 times · 2 days ago" phrasing for the full log sheet.
- "d ago" = days, "w ago" = weeks. "Today" and "Yesterday" spelled out.

---

## Settings Sheet

Gear icon in header opens a bottom sheet. Contents unchanged from the previous spec:
- Your name (tappable row, in-place edit)
- Display mode segmented control
- Search radius segmented control
- Data note: "Your walks, favourites, and reviews are saved on this device. Sync across devices is coming in a future update."

The settings sheet is entirely separate from the Me tab's content. The Me tab body contains no settings rows, no dropdowns, no toggles.

---

## New User vs Returning User

**New user (no data):**
```
┌──────────────────────────────────────────────┐
│  Your walks                        [⚙]        │
│                                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Your walks will appear here                 │
│  Explore walks and log them to start         │
│  building your history.                      │
│                                              │
│  [Find a walk]                               │
└──────────────────────────────────────────────┘

  Badges             (0 earned — locked badges in scroll row)
  [🔒 10 Miles] [🔒 25 Miles] [🔒 Explorer] ...

  Recent walks
  (empty state: "Mark a walk as walked to start your log.")
```

The new user sees one welcoming invitation card, a row of locked badges to give them something to aim for, and a quiet empty log state. No multiple empty sections. No dashes. No grey placeholders. Just a calm, welcoming page.

**User with 3 walks and 12 miles:**
```
[Display name]                  [⚙]
Since February 2026

┌──────────────────────────────────────────────┐
│  12.1                                        │
│  miles walked                                │
│                                              │
│  [███████░░░░░░░░░░░░░░]                     │
│  12.9 miles to 25 Miles                      │
└──────────────────────────────────────────────┘

Badges              2 earned
[✓ 10 Miles] [✓ Explorer] [🔒 25 Miles] ...

Recent walks
[Stanage Edge      Walked twice · 3d ago]
[Box Hill          Walked once · 2w ago]
[Richmond Park     Walked once · 3w ago]
See all 3 walks →
```

**Same user 6 months later (30 miles, 8 badges):**
```
Deborah                          [⚙]
Since February 2026

┌──────────────────────────────────────────────┐
│  Devil's Dyke                                │
│  Walked 7 times · last visited yesterday     │
│                                              │
│  3.2 miles each time                         │
└──────────────────────────────────────────────┘

Badges              8 earned
[✓ 10 Miles] [✓ 25 Miles] [✓ Explorer] ...

Recent walks
[Devil's Dyke        Walked 7× · Yesterday]
[Stanage Edge        Walked 3× · 2w ago]
[Leith Hill          Walked once · 3w ago]
See all 14 walks →
```

The featured card has shifted from the distance milestone (now at 30 miles it's showing the most-walked walk) — the app recognises that returning to the same walk 7 times is the most interesting thing about this user's history right now.

---

## How It Grows Over Time

The Me tab gets richer without getting busier. The featured card updates silently — no interaction required from the user. As the walk log grows, the log compact list always shows the 3 most recent. The badges scroll row grows as badges are earned. None of this requires new sections, new cards, or structural change.

**Phase 3 additions (hooks only — not built):**
- Circular profile photo (44×44) prepends the header name block
- "N following · N followers" line appears in the header below the Since line
- "Local Legend on [Walk Name]" can appear as a secondary note in the State 3 featured card
- Badge track gains community badges (walk submitted, first review)
- Walk log gains cloud-synced entries without structural change

None of these require redesigning the Me tab. They slot into existing positions.

---

## Reference Experiences That Get This Right

**Nike Run Club activity page:** after a run, one beautiful summary card. Nothing else competes with it. The rest of the history is below, compact. This is the template.

**Strava personal records:** surfaces your best performance at any given moment without requiring you to scroll through a dashboard. The "most interesting thing" rises to the top.

**Apple Health summary:** one highlighted metric at the top that changes based on recent activity. Not a fixed dashboard. Context-aware.

**A well-worn journal:** you open it and see the last thing you wrote. It does not show you an index. It shows you the last entry. The Me tab featured card is the last entry in the user's walking journal.

---

## What This Removes From Previous Specs

| Removed | Reason |
|---|---|
| Personal highlights card (5 rows) | Too much at once; absorbed into featured card states |
| Zone structure (1–5) | Created equal visual weight across unequal elements |
| Seasons row | Nice detail, not the hero moment — can surface in State 5 later if needed |
| Favourite region row | Derived data that requires enough history to be meaningful |
| Deborah-style "total walks logged" stat | The featured card surfaces this contextually when it's meaningful |
| Badge grid (flex-wrap) | Replaced with horizontal scroll — less vertical weight |

The reduction is aggressive. But the previous implementation's problem was not that it was missing features — it was that it was too full. Every removed element was present in the previous spec. None of them were wrong to include. They were just all included at once, at the same weight, which made none of them meaningful.

---

## CSS Class Summary

```css
/* Header */
.me-header          /* flex, space-between, padding 20px 16px 0 */
.me-name            /* Inter 700 20px ink */
.me-name--empty     /* Inter 400 20px ink-2 */
.me-since           /* Inter 400 13px ink-2, mt 4px */
.me-gear-btn        /* 36×36 tap target, 20px icon */

/* Featured card */
.me-featured                   /* card: surface, 1px border, radius 20px, p 24px, mx 16px, min-h 160px */
.me-featured-label             /* Inter 400 13px ink-2 — supporting line */
.me-featured-hero-text         /* Inter 700 64px ink — big number */
.me-featured-hero-name         /* Inter 700 22px ink — walk name */
.me-featured-milestone-name    /* Inter 700 48px brand — milestone label */
.me-featured-badge-name        /* Inter 700 36px brand — badge name */
.me-featured-sub               /* Inter 400 14px ink-2 */
.me-featured-hint              /* Inter 400 13px ink-2 — progress hint */
.me-featured-bar               /* progress bar: brand green, 10px h, radius 5px */
.me-featured-empty-title       /* Inter 700 22px ink-2 */
.me-featured-cta               /* brand bg button, white text, Inter 600 15px */

/* Badges */
.me-badges-section  /* padding 0 16px */
.me-badges-header   /* flex, space-between */
.me-badges-heading  /* Inter 600 16px ink */
.me-badges-count    /* Inter 400 13px ink-2 */
.me-badges-scroll   /* flex, overflow-x auto, gap 8px, no scrollbar */
.me-badge           /* base chip */
.me-badge--earned   /* brand tint bg, brand text, Inter 600 13px */
.me-badge--locked   /* surface bg, border, ink-2 text, Inter 400 13px */

/* Walk log */
.me-log-section     /* padding 0 16px */
.me-log-heading     /* Inter 600 16px ink, mb 10px */
.me-log-list        /* card: surface, 1px border, radius 16px */
.me-log-row         /* flex, space-between, p 12px 16px */
.me-log-name        /* Inter 500 15px ink */
.me-log-meta        /* Inter 400 13px ink-2 */
.me-log-see-all     /* Inter 500 13px brand */
```
