# Me Tab Redesign Spec
**Tab:** Me
**Status:** Design spec — awaiting implementation
**Based on:** me-tab-vision.md (PO), po-action-plan-round12.md
**Phase:** 2 (Phase 3 hooks documented but not built)

---

## Design Intent

The Me tab has been a settings screen with ambitions. This redesign strips it back to a single purpose: reflecting the user's walking life back at them. Settings move to a sheet. Everything that remains is personal.

The test: open the Me tab after 20 walks. Does it feel like it knows you? Does anything on screen make you feel like those 20 walks meant something? If yes, the redesign has worked.

---

## Full Layout — Annotated

```
375px viewport · 16px horizontal padding throughout

┌──────────────────────────────────────────────┐
│ 20px top padding                             │
│                                              │
│  [Display name — 20px 700]    [⚙ gear 36px] │  ← HEADER
│  Since November 2025 (13px ink-2)            │
│                                              │
│ 20px gap                                     │
├──────────────────────────────────────────────┤  ← ZONE 1
│ ┌──────────────────────────────────────────┐ │
│ │  Most explored   Devil's Dyke            │ │  13px rows
│ │  ─────────────────────────────────────   │ │  label: ink-2 400
│ │  Favourite region  Surrey Hills          │ │  value: ink 600
│ │  ─────────────────────────────────────   │ │
│ │  Total miles       14.3 mi               │ │
│ │  ─────────────────────────────────────   │ │
│ │  Total walks       8 walks               │ │
│ │  ─────────────────────────────────────   │ │
│ │  Seasons walked  [Spring] [Autumn]       │ │  chips: brand green
│ └──────────────────────────────────────────┘ │
│                                              │
│ 16px gap                                     │
├──────────────────────────────────────────────┤  ← ZONE 2
│ ┌──────────────────────────────────────────┐ │
│ │  Miles walked              (section head)│ │  15px 600 ink
│ │                                          │ │
│ │  14.3 mi              → 25 Miles         │ │  13px labels
│ │  [████████████░░░░░░░░░░░░░░░░░]  57%   │ │  10px bar
│ │                                          │ │
│ │  10.7 miles to the 25 Miles badge        │ │  13px ink-2
│ └──────────────────────────────────────────┘ │
│                                              │
│ 16px gap                                     │
├──────────────────────────────────────────────┤  ← ZONE 3
│  Badges                    3 earned          │  heading row
│                                              │
│  [🔒 10 Miles] [✓ Explorer] [✓ Trailblazer] │  flex-wrap chips
│  [🔒 25 Miles] [🔒 50 Miles] [🔒 100 Miles] │
│  [🔒 Regional] [✓ Devoted] [🔒 Collector]   │
│  ...                                         │
│                                              │
│  More to unlock             (hint, 12px)     │
│                                              │
│ 16px gap                                     │
├──────────────────────────────────────────────┤  ← ZONE 4
│  Walk history                                │  heading
│                                              │
│  Devil's Dyke                          ›     │
│  Walked 3 times · 2 days ago                 │
│  ─────────────────────────────────────────   │
│  Leith Hill                            ›     │
│  Walked once · 6 days ago                    │
│  ─────────────────────────────────────────   │
│  Richmond Park                         ›     │
│  Walked twice · 12 days ago                  │
│  ...                                         │
│                                              │
│  See all 8 walks →                           │
│                                              │
│ 32px bottom padding                          │
└──────────────────────────────────────────────┘
```

**Phase 3 hook positions (dashed — not built in Phase 2):**
```
HEADER (with Phase 3 extensions):
  ┌ ─ ─ ─ ─ ┐
  │  44×44   │  [Display name]               [⚙]
  │  photo   │  Since November 2025
  │  slot    │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  └ ─ ─ ─ ─ ┘  ─ ─  12 following · 3 followers ─ ─

ZONE 1 card (Phase 3 additional row):
  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  Local Legend    Devil's Dyke  (requires backend)
  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

---

## Header

The header is above the zone stack. It is not a card — it sits directly on the `--bg` background.

### Layout

```
┌──────────────────────────────────────────────┐
│ [name — 20px 700 ink]           [⚙ 36×36px] │
│ Since November 2025 (13px, ink-2)            │
└──────────────────────────────────────────────┘
```

Padding: `20px 16px 0` — matches the existing header pattern.

### Display name

- Text: the stored `sniffout_username` value
- Font: Inter 700, 20px, `var(--ink)`
- If no name is set: "Sniffout walker" in `var(--ink-2)`, Inter 400, 20px — passive, not a heading
- Directly below the name (when no username set): "Add your name →" — Inter 500, 13px, `var(--brand)`, tap opens the display name row in the Settings sheet

### Since line

- Text: "Since {Month} {Year}" — e.g. "Since November 2025"
- Derived from the earliest timestamp in `sniffout_walk_log`. If no walks logged, this line is hidden entirely — do not show it.
- Font: Inter 400, 13px, `var(--ink-2)`
- `margin-top: 4px`

### Gear icon

- Position: top-right of the header, vertically aligned to the centre of the display name
- Tap target: `36×36px` — use a `<button>` with `padding: 8px` around the 20px icon
- Icon: gear/cog SVG, `20×20px`, `var(--ink-2)` (`currentColor`)
- Active state: `opacity: 0.6` on press
- No border, no background on the button — the icon alone is sufficient
- `margin-left: auto` to push it to the right when using flex layout on the header row

**Phase 3 hook — profile photo slot:**
The header flex row should be designed so a `44×44px` circular image can be prepended left of the name column without reflow. In Phase 2, the photo slot is entirely absent — no placeholder, no grey circle. The layout is: `[name column | gear button]`. In Phase 3 it becomes: `[photo | name column | gear button]`.

**Phase 3 hook — following/followers:**
A third line below the Since line: "[N] following · [N] followers" — 13px, `var(--ink-2)`. In Phase 2 this line is absent.

---

## Zone 1 — Personal Highlights Card

A white surface card immediately below the header. No section heading above it — the rows are self-describing.

### Card container

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 16px;
padding: 0;          /* rows carry their own padding */
overflow: hidden;    /* so the last row's border-radius clips */
margin: 20px 16px 0;
```

### Row layout

Each row is a horizontal pair: label left, value right.

```
┌──────────────────────────────────────────────┐
│  Most explored       Devil's Dyke            │  16px side padding
│                                              │  48px row height
└──────────────────────────────────────────────┘
```

```css
.me-highlights-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.me-highlights-row:last-child {
  border-bottom: none;
}
```

### Label

- Font: Inter 400, 13px, `var(--ink-2)`
- Never truncated — labels are short strings

### Value

- Font: Inter 600, 13px, `var(--ink)`
- Right-aligned
- Truncate with `text-overflow: ellipsis` if walk name is long: `max-width: 55%`

### Rows — specification

Show only rows where data is available. Suppress the entire card if fewer than 3 rows have data.

| Row label | Data source | Value format | Example |
|---|---|---|---|
| Most explored | Walk ID with most entries in `sniffout_explored` | Walk name from `WALKS_DB` | "Devil's Dyke" |
| Favourite region | Most frequent location suffix across explored walks | Region name only | "Surrey Hills" |
| Total miles | Sum of `distance` across all `sniffout_walk_log` entries | "[X.X] mi" or "[N] mi" | "14.3 mi" |
| Total walks | Count of unique walk IDs in `sniffout_walk_log` | "[N] walks" or "1 walk" | "8 walks" |
| Seasons walked | See below | Season chips | — |

**Row ordering:** Most explored → Favourite region → Total miles → Total walks → Seasons walked. Omit any row whose data is absent.

**Suppression rule:** If fewer than 3 rows have data, do not render the card at all. An empty or near-empty highlights card reads worse than no card.

### Seasons walked row

The value cell contains chips, not text.

**Season chip design:**

```
[Spring]  [Autumn]
```

```css
.me-season-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.me-season-chip {
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(30, 77, 58, 0.1);
  border: 1px solid rgba(30, 77, 58, 0.2);
  font: 600 12px/1.4 'Inter', sans-serif;
  color: var(--brand);
  white-space: nowrap;
}
```

No colour differentiation between seasons — all chips are brand green. The label carries the meaning. Seasons: "Spring", "Summer", "Autumn", "Winter".

Season derivation: from timestamps in `sniffout_explored`, map each to a season (Dec–Feb = Winter, Mar–May = Spring, Jun–Aug = Summer, Sep–Nov = Autumn). Collect unique season strings.

### Phase 3 hook — Local Legend row

When server-side data is available: a row at the bottom of the highlights card: "Local Legend" label, "[Walk Name]" value. Inserts before the seasons row. No structural change required — it is a standard `me-highlights-row`.

### Dark mode (`body.night`)

The `--surface`, `--border`, `--ink`, and `--ink-2` tokens handle the card automatically. The season chip uses `rgba` values that will remain legible in dark mode. No explicit `body.night` override needed.

---

## Zone 2 — Distance Progress Bar

A white surface card. This is a custom component — no third-party library.

### Card container

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 16px;
padding: 16px;
margin: 16px 16px 0;
```

### Card layout

```
Miles walked

14.3 mi                        → 25 Miles
[██████████████░░░░░░░░░░░░░░]    57%

10.7 miles to the 25 Miles badge
```

### Section heading

- Text: "Miles walked"
- Font: Inter 600, 15px, `var(--ink)`
- `margin-bottom: 14px`

### Labels row

```css
.me-progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
```

- Left: current total — Inter 700, 17px, `var(--ink)` — "[X.X] mi" — this is the most prominent number on the card
- Right: next milestone — Inter 500, 13px, `var(--ink-2)` — "→ 25 Miles"

### Progress bar

```css
.me-progress-track {
  height: 10px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.me-progress-fill {
  height: 100%;
  border-radius: 5px;
  background: var(--brand);
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

The fill `width` is set via inline style: `style="width: 57%"`.

On first render, set `width: 0` and then `requestAnimationFrame` to the calculated width — this creates a satisfying fill animation when the user opens the tab.

### Percentage label

Positioned to the right of the bar track on the same line as the bar:

```css
.me-progress-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.me-progress-track { flex: 1; }
.me-progress-pct {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}
```

### Hint text

- Text: "[X.X] miles to the [N] Miles badge" — e.g. "10.7 miles to the 25 Miles badge"
- Font: Inter 400, 13px, `var(--ink-2)`
- `margin-top: 10px`

### Milestone logic

Milestones: `[10, 25, 50, 100]`

```
currentMiles  = sum of walk.distance across all sniffout_walk_log entries
prevMilestone = last milestone already passed (0 if none)
nextMilestone = first milestone where currentMiles < milestone
progress      = (currentMiles - prevMilestone) / (nextMilestone - prevMilestone) * 100
remaining     = nextMilestone - currentMiles
```

If `currentMiles >= 100`: show the completion state (see below), hide the progress bar.

### Completion state

When the user has walked ≥ 100 miles, replace the progress bar with a completion card:

```
┌──────────────────────────────────────────────┐
│                                              │
│   ✓   100 Miles Club                         │
│       You've walked over 100 miles           │
│       with Sniffout.                         │
│                                              │
└──────────────────────────────────────────────┘
```

```css
.me-progress-complete {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 0;
}
.me-progress-complete-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.me-progress-complete-icon svg {
  width: 20px;
  height: 20px;
  color: #fff;
}
.me-progress-complete-title {
  font: 700 16px/1.2 'Inter', sans-serif;
  color: var(--ink);
}
.me-progress-complete-sub {
  font: 400 13px/1.4 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 2px;
}
```

### Dark mode

`body.night .me-progress-track { background: rgba(255,255,255,0.1); }`

The fill (`var(--brand)`) and label colours are handled by existing tokens. No other overrides needed.

---

## Zone 3 — Badge Grid

The badge grid is not inside a card — it sits directly in the scroll area with a section heading. This keeps it visually lighter than the highlights card and progress bar above it.

### Section heading row

```
Badges                    3 earned
```

```css
.me-badges-heading-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 12px;
  margin-top: 20px;
}
.me-badges-heading {
  font: 600 16px/1 'Inter', sans-serif;
  color: var(--ink);
}
.me-badges-count {
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
```

Count format: "[N] earned" — if 0 earned, hide the count.

### Badge grid container

```css
.me-badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px;
}
```

Badges are auto-sizing chips — no fixed column count.

### Earned badge

```css
.me-badge.me-badge--earned {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  height: 32px;
  border-radius: 20px;
  background: rgba(30, 77, 58, 0.08);
  border: 1px solid rgba(30, 77, 58, 0.2);
  font: 600 13px/1 'Inter', sans-serif;
  color: var(--brand);
  white-space: nowrap;
  cursor: default;
}
.me-badge--earned .me-badge-icon {
  width: 13px;
  height: 13px;
  color: var(--brand);
  flex-shrink: 0;
}
```

The icon for earned badges: a small filled checkmark circle SVG (`13×13px`). Optional — if the badge label alone is clear enough, the icon can be omitted. The distance track badges (10 Miles, 25 Miles etc.) should include it; character track badges (Coastal Walker etc.) do not need it.

### Locked badge

```css
.me-badge.me-badge--locked {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  height: 32px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.me-badge--locked .me-badge-lock {
  width: 12px;
  height: 12px;
  color: var(--ink-2);
  flex-shrink: 0;
  opacity: 0.6;
}
```

The lock icon is a Lucide `lock` SVG, `12×12px`. It sits to the left of the label text.

### Tapping a locked badge

Tapping reveals a small inline expansion below the badge chip — not a full bottom sheet. The expansion appears immediately below the grid in a single-line note that replaces the "More to unlock" hint momentarily:

```css
.me-badge-tooltip {
  width: 100%;
  padding: 8px 16px;
  font: 400 12px/1.4 'Inter', sans-serif;
  color: var(--ink-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-top: 4px;
  animation: fadeIn 150ms ease;
}
```

The tooltip text is the unlock condition for that specific badge (see copy strings section). Tapping anywhere else or tapping the same badge again dismisses it.

This is simpler than a bottom sheet and less disruptive — the user doesn't lose context.

### Badge order in the grid

Display earned badges first (in the order listed below), then locked badges in the same order.

**Full badge list (Phase 2):**

*Distance track:*
- 10 Miles
- 25 Miles
- 50 Miles
- 100 Miles Club

*Exploration track:*
- Explorer
- Trailblazer
- Regional Rambler

*Walk character track:*
- Coastal Walker
- Woodland Walker
- Moorland Walker
- Seasonal Walker
- All-Weather

*Loyalty track:*
- Regular
- Devoted
- Collector

### "More to unlock" hint

Below the grid, if any locked badges remain:

```css
.me-badges-hint {
  padding: 10px 16px 0;
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
```

Text: "More to unlock" — quiet, no CTA, no explanation.

### Dark mode

Earned badge: the `rgba(30,77,58,0.08)` background will appear slightly different in dark mode but remains legible. The border `rgba(30,77,58,0.2)` is also fine. If the dark surface is very dark, the green tint may disappear — add:

`body.night .me-badge--earned { background: rgba(30, 77, 58, 0.15); }`

Locked badge: `var(--surface)` and `var(--border)` handle dark mode automatically.

---

## Zone 4 — Walk History

### Section heading

```css
.me-history-heading {
  font: 600 16px/1 'Inter', sans-serif;
  color: var(--ink);
  padding: 20px 16px 12px;
}
```

### Row list

No card container — rows sit directly on the `--bg` background as a borderless list, separated internally by dividers. This keeps the history section visually lighter than the card zones above.

```css
.me-history-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin: 0 16px;
  overflow: hidden;
}
```

### Individual row

```css
.me-history-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.me-history-row:last-of-type {
  border-bottom: none;
}
.me-history-row:active {
  background: rgba(0, 0, 0, 0.03);
}
.me-history-text {
  flex: 1;
}
.me-history-name {
  font: 500 15px/1.3 'Inter', sans-serif;
  color: var(--ink);
}
.me-history-meta {
  font: 400 13px/1.3 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 2px;
}
.me-history-chevron {
  width: 16px;
  height: 16px;
  color: var(--ink-2);
  opacity: 0.5;
  flex-shrink: 0;
  margin-left: 8px;
}
```

### Meta string format

- "Walked once · today"
- "Walked once · yesterday"
- "Walked twice · 3 days ago"
- "Walked [N] times · [X] days ago"
- Use "once" and "twice" for 1 and 2. Use number for 3+.
- "days ago": if < 1 day, "today". If 1 day, "yesterday". If ≥ 2 days, "[N] days ago". If ≥ 30 days, "[N] weeks ago".

### "See all" link

Shown only when total unique logged walks > 5.

```css
.me-history-see-all {
  display: block;
  padding: 14px 16px;
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--brand);
  text-align: left;
  background: none;
  border: none;
  border-top: 1px solid var(--border);
  width: 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
```

Text: "See all [N] walks →"

This button sits inside the `.me-history-list` card, after the 5 visible rows.

### Full log sheet

Opens as a standard bottom sheet (matches the conditions tag sheet pattern). Full height (90vh). Standard handle + title.

- Title: "Your walks"
- All unique walked walks, most recently logged first
- Same row layout as the main history rows
- Each row tappable to open walk detail overlay
- If walk is no longer in `WALKS_DB`, show "Unknown walk" in ink-2 as fallback

### Tapping a history row

Opens the existing walk detail overlay for that walk. The walk ID is stored in the log — look it up in `WALKS_DB`.

---

## Settings Sheet

Triggered by the gear icon in the header. Standard bottom sheet pattern.

### Sheet structure

```
──  (handle)

Settings

  Your name             Deborah  ›
  ──────────────────────────────────
  Display mode
  [☀ Light | ◑ Auto | ☾ Dark]
  ──────────────────────────────────
  Search radius
  [1 mi | 3 mi | 5 mi | 10 mi]

──────────────────────────────────────────────
Your walks, favourites, and reviews are saved
on this device. Sync across devices is coming
in a future update.
```

### Sheet container

```css
.me-settings-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 75vh;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 12px 16px 40px;
  z-index: 201;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
.me-settings-sheet.is-open {
  transform: translateY(0);
}
```

### Handle + title

Handle: `32×4px`, `border-radius: 2px`, `rgba(0,0,0,0.18)`, centred, `margin-bottom: 20px`.

Title: "Settings" — Inter 700, 17px, `var(--ink)`, `margin-bottom: 20px`.

### Display name row

A standard settings row: tappable, opens an inline edit state or a simple prompt.

```css
.me-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.me-settings-row-label {
  font: 500 15px/1 'Inter', sans-serif;
  color: var(--ink);
}
.me-settings-row-value {
  font: 400 15px/1 'Inter', sans-serif;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  gap: 6px;
}
.me-settings-row-value svg { /* chevron */
  width: 14px;
  height: 14px;
  color: var(--ink-2);
  opacity: 0.5;
}
```

Row content: label "Your name" | value = current username or "Not set" in ink-2, with a chevron.

Tapping the row makes the value cell editable in-place (standard `contenteditable` pattern), or opens a simple modal. Either approach is acceptable. The developer should use whichever is simpler — the spec does not prescribe the edit mechanic.

### Display mode control

Below the name row. A sub-label and the segmented control from `dark-mode-toggle-redesign.md`.

```
Display mode
[☀ Light | ◑ Auto | ☾ Dark]
```

The sub-label "Display mode" uses the `.segment-label` class from the existing spec. The control is the existing `.segment-control` component — no change.

Border-bottom on the display mode section: `1px solid var(--border)`, `padding-bottom: 16px`, `margin-bottom: 16px`.

### Search radius control

Follows the identical pattern as the display mode segmented control. Four equal segments.

Sub-label: "Search radius" (using `.segment-label`).

Segments: "1 mi" | "3 mi" | "5 mi" | "10 mi"

```css
/* Search radius — same .segment-control pattern, 4 columns */
.me-radius-control {
  /* inherits all .segment-control styles */
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.me-radius-control .segment-pill {
  width: calc(25% - 2.25px); /* one of four equal segments */
}
.me-radius-control .segment-pill[data-active="0"] { transform: translateX(0); }
.me-radius-control .segment-pill[data-active="1"] { transform: translateX(100%); }
.me-radius-control .segment-pill[data-active="2"] { transform: translateX(200%); }
.me-radius-control .segment-pill[data-active="3"] { transform: translateX(300%); }
```

Value stored in: `localStorage.setItem('sniffout_radius', value)` — same key already in use.

### Passive data note

Separator line then the informational note:

```css
.me-settings-note {
  margin-top: 24px;
  font: 400 12px/1.5 'Inter', sans-serif;
  color: var(--ink-2);
  text-align: center;
  padding: 0 8px;
}
```

Text: "Your walks, favourites, and reviews are saved on this device. Sync across devices is coming in a future update."

This replaces the current inline disclaimer in the Me tab body. Moving it here removes a permanent data-hygiene message from the achievement space.

---

## Empty State

Shown when `sniffout_walk_log` is empty (or absent) and `sniffout_explored` is empty. Replaces Zones 1–4 entirely. The header (display name + gear icon) is always shown.

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│      Your walking journey                    │
│      starts here                             │
│                                              │
│  Explore walks and mark them as              │
│  walked to build your personal log.          │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │       Explore walks                  │   │
│  └──────────────────────────────────────┘   │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

### Empty card container

```css
.me-empty-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 20px;
  margin: 20px 16px 0;
  text-align: center;
}
.me-empty-title {
  font: 700 18px/1.3 'Inter', sans-serif;
  color: var(--ink);
  margin-bottom: 10px;
}
.me-empty-body {
  font: 400 14px/1.5 'Inter', sans-serif;
  color: var(--ink-2);
  margin-bottom: 24px;
}
.me-empty-cta {
  display: inline-block;
  padding: 12px 24px;
  background: var(--brand);
  color: #fff;
  border-radius: 12px;
  font: 600 15px/1 'Inter', sans-serif;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.me-empty-cta:active {
  opacity: 0.88;
}
```

The CTA button calls `showTab('walks')` to navigate to the Walks tab.

### Suppression rules

- Empty card: shown when `sniffout_walk_log` is empty AND `sniffout_explored` has fewer than 3 unique entries
- Zone 1 highlights card: shown only when ≥ 3 rows have data
- Zone 2 progress bar: shown only when `sniffout_walk_log` has any entries (even 0.1 mi)
- Zone 3 badges: always shown (locked badges fill the grid even for a new user) — do not suppress the badge grid
- Zone 4 walk history: always shown (shows its own empty state if no logged walks)

**Interaction between empty card and zone suppression:** If the empty card is shown, suppress Zones 1, 2, and 4. Zone 3 (badges) is still shown below the empty card — the badge grid gives a new user something to aim for even on their first visit.

---

## HTML Structure

```html
<div id="tab-me" class="tab-content">

  <!-- Header -->
  <header class="me-header">
    <div class="me-header-identity">
      <!-- Phase 3 hook: photo slot here (not built) -->
      <div class="me-name-block">
        <span class="me-name" id="meDisplayName">Deborah</span>
        <!-- shown only if no name set: -->
        <button class="me-name-edit-cta" id="meAddName">Add your name →</button>
        <span class="me-since" id="meSince">Since November 2025</span>
        <!-- Phase 3 hook: following/followers line here (not built) -->
      </div>
    </div>
    <button class="me-gear-btn" id="meGearBtn" aria-label="Settings">
      <!-- gear SVG icon 20×20 -->
    </button>
  </header>

  <!-- Empty state (shown when no data, replaces zones 1, 2, 4) -->
  <div class="me-empty-card" id="meEmptyCard" hidden>
    <div class="me-empty-title">Your walking journey starts here</div>
    <div class="me-empty-body">Explore walks and mark them as walked to build your personal log.</div>
    <button class="me-empty-cta" onclick="showTab('walks')">Explore walks</button>
  </div>

  <!-- Zone 1 — Personal highlights card -->
  <div class="me-highlights" id="meHighlights" hidden>
    <!-- rows rendered dynamically -->
    <!-- Phase 3 hook: Local Legend row inserts before seasons row (not built) -->
  </div>

  <!-- Zone 2 — Distance progress bar -->
  <div class="me-progress-card" id="meProgressCard" hidden>
    <div class="me-progress-heading">Miles walked</div>
    <div class="me-progress-labels">
      <span class="me-progress-current" id="meProgressCurrent">14.3 mi</span>
      <span class="me-progress-next" id="meProgressNext">→ 25 Miles</span>
    </div>
    <div class="me-progress-bar-row">
      <div class="me-progress-track">
        <div class="me-progress-fill" id="meProgressFill" style="width: 0%"></div>
      </div>
      <span class="me-progress-pct" id="meProgressPct">57%</span>
    </div>
    <div class="me-progress-hint" id="meProgressHint">10.7 miles to the 25 Miles badge</div>
    <!-- Completion state (hidden until 100mi reached) -->
    <div class="me-progress-complete" id="meProgressComplete" hidden>
      <div class="me-progress-complete-icon"><!-- checkmark SVG --></div>
      <div>
        <div class="me-progress-complete-title">100 Miles Club</div>
        <div class="me-progress-complete-sub">You've walked over 100 miles with Sniffout.</div>
      </div>
    </div>
  </div>

  <!-- Zone 3 — Badge grid -->
  <div class="me-badges-section">
    <div class="me-badges-heading-row">
      <span class="me-badges-heading">Badges</span>
      <span class="me-badges-count" id="meBadgesCount"></span>
    </div>
    <div class="me-badges-grid" id="meBadgesGrid">
      <!-- earned and locked badges rendered dynamically -->
    </div>
    <!-- badge tooltip (shown on locked badge tap) -->
    <div class="me-badge-tooltip" id="meBadgeTooltip" hidden></div>
    <div class="me-badges-hint" id="meBadgesHint">More to unlock</div>
  </div>

  <!-- Zone 4 — Walk history -->
  <div class="me-history-section">
    <div class="me-history-heading">Walk history</div>
    <div class="me-history-list" id="meHistoryList">
      <!-- rows rendered dynamically -->
      <!-- "see all" button rendered here when > 5 walks -->
    </div>
  </div>

</div><!-- /#tab-me -->

<!-- Settings sheet (outside tab, in body root) -->
<div class="settings-sheet-overlay" id="meSettingsOverlay" hidden></div>
<div class="me-settings-sheet" id="meSettingsSheet" hidden>
  <div class="me-settings-handle"></div>
  <div class="me-settings-title">Settings</div>

  <!-- Your name row -->
  <div class="me-settings-row" id="meNameRow">
    <span class="me-settings-row-label">Your name</span>
    <span class="me-settings-row-value">
      <span id="meSettingsNameValue">Not set</span>
      <!-- chevron SVG -->
    </span>
  </div>

  <!-- Display mode -->
  <div class="me-settings-section">
    <div class="segment-label">Display mode</div>
    <div class="segment-control" role="group" aria-label="Display mode">
      <div class="segment-pill" data-active="1"></div>
      <button class="segment-btn" data-mode="light" aria-pressed="false"><!-- sun SVG --><span>Light</span></button>
      <button class="segment-btn active" data-mode="auto" aria-pressed="true"><!-- half-circle SVG --><span>Auto</span></button>
      <button class="segment-btn" data-mode="dark" aria-pressed="false"><!-- moon SVG --><span>Dark</span></button>
    </div>
  </div>

  <!-- Search radius -->
  <div class="me-settings-section">
    <div class="segment-label">Search radius</div>
    <div class="segment-control me-radius-control" role="group" aria-label="Search radius">
      <div class="segment-pill" data-active="1"></div>
      <button class="segment-btn" data-radius="1" aria-pressed="false"><span>1 mi</span></button>
      <button class="segment-btn active" data-radius="3" aria-pressed="true"><span>3 mi</span></button>
      <button class="segment-btn" data-radius="5" aria-pressed="false"><span>5 mi</span></button>
      <button class="segment-btn" data-radius="10" aria-pressed="false"><span>10 mi</span></button>
    </div>
  </div>

  <div class="me-settings-note">
    Your walks, favourites, and reviews are saved on this device.
    Sync across devices is coming in a future update.
  </div>
</div>

<!-- Full walk log sheet -->
<div class="me-log-sheet" id="meLogSheet" hidden>
  <div class="me-settings-handle"></div>
  <div class="me-settings-title">Your walks</div>
  <div class="me-history-list" id="meLogList">
    <!-- all unique logged walks rendered here -->
  </div>
</div>
```

---

## CSS Classes Reference

```css
/* ── Header ──────────────────────────────────── */
.me-header            /* flex row, padding 20px 16px 0, justify space-between */
.me-header-identity   /* flex row, align-items flex-start, gap 12px */
.me-name-block        /* flex column, gap 3px */
.me-name              /* Inter 700 20px ink */
.me-name--placeholder /* Inter 400 20px ink-2 — shown when no name set */
.me-name-edit-cta     /* Inter 500 13px brand, no background, no border */
.me-since             /* Inter 400 13px ink-2 */
.me-gear-btn          /* 36×36 button, no bg/border, padding 8px, ink-2 color */

/* ── Zone 1 highlights card ──────────────────── */
.me-highlights        /* card container: surface, 1px border, 16px radius, mx 16px, mt 20px */
.me-highlights-row    /* flex row, padding 14px 16px, border-bottom var(--border) */
.me-highlights-label  /* Inter 400 13px ink-2 */
.me-highlights-value  /* Inter 600 13px ink, max-width 55%, truncate */
.me-season-chips      /* flex row, gap 6px, flex-wrap, justify flex-end */
.me-season-chip       /* green pill: rgba brand tint bg, Inter 600 12px brand */

/* ── Zone 2 progress bar ─────────────────────── */
.me-progress-card      /* card: surface, 1px border, 16px radius, p 16px, mx 16px, mt 16px */
.me-progress-heading   /* Inter 600 15px ink, mb 14px */
.me-progress-labels    /* flex, justify space-between, align baseline, mb 8px */
.me-progress-current   /* Inter 700 17px ink */
.me-progress-next      /* Inter 500 13px ink-2 */
.me-progress-bar-row   /* flex, align center, gap 10px */
.me-progress-track     /* flex 1, h 10px, radius 5px, rgba bg */
.me-progress-fill      /* h 100%, radius 5px, brand bg, width via inline style */
.me-progress-pct       /* Inter 500 13px ink-2, w 32px, text-right */
.me-progress-hint      /* Inter 400 13px ink-2, mt 10px */
.me-progress-complete  /* flex row, gap 14px, align center */
.me-progress-complete-icon /* 40px circle, brand bg */
.me-progress-complete-title /* Inter 700 16px ink */
.me-progress-complete-sub   /* Inter 400 13px ink-2, mt 2px */

/* ── Zone 3 badges ───────────────────────────── */
.me-badges-section     /* no card — direct on bg */
.me-badges-heading-row /* flex, justify space-between, px 16px, mt 20px, mb 12px */
.me-badges-heading     /* Inter 600 16px ink */
.me-badges-count       /* Inter 400 13px ink-2 */
.me-badges-grid        /* flex wrap, gap 8px, px 16px */
.me-badge              /* base chip: inline-flex, h 32px, radius 20px, p 6px 12px */
.me-badge--earned      /* brand-tint bg + border, Inter 600 13px brand */
.me-badge--locked      /* surface bg, border var(--border), Inter 400 13px ink-2 */
.me-badge-icon         /* 13×13 SVG, currentColor — earned badges only */
.me-badge-lock         /* 12×12 SVG lock icon, ink-2, opacity 0.6 */
.me-badge-tooltip      /* inline expand: surface card, Inter 400 12px ink-2, mt 4px, p 8px 16px */
.me-badges-hint        /* Inter 400 12px ink-2, px 16px, pt 10px */

/* ── Zone 4 walk history ─────────────────────── */
.me-history-section    /* no card — heading + inner card */
.me-history-heading    /* Inter 600 16px ink, p 20px 16px 12px */
.me-history-list       /* card: surface, 1px border, 16px radius, mx 16px */
.me-history-row        /* flex, align center, p 12px 16px, border-bottom */
.me-history-text       /* flex 1 */
.me-history-name       /* Inter 500 15px ink */
.me-history-meta       /* Inter 400 13px ink-2, mt 2px */
.me-history-chevron    /* 16px SVG, ink-2, opacity 0.5 */
.me-history-see-all    /* Inter 500 13px brand, p 14px 16px, border-top, full-width btn */

/* ── Settings sheet ──────────────────────────── */
.me-settings-sheet     /* fixed bottom sheet, 75vh max-h, surface bg, 20px top radius */
.me-settings-handle    /* 32×4px bar, rgba dark, centred, mb 20px */
.me-settings-title     /* Inter 700 17px ink, mb 20px */
.me-settings-section   /* mt 16px, pb 16px, border-bottom var(--border) */
.me-settings-row       /* flex, justify space-between, py 14px, border-bottom */
.me-settings-row-label /* Inter 500 15px ink */
.me-settings-row-value /* Inter 400 15px ink-2, flex row, gap 6px */
.me-settings-note      /* Inter 400 12px ink-2, text-centre, mt 24px, px 8px */

/* ── Empty state ─────────────────────────────── */
.me-empty-card   /* card: surface, 1px border, 16px radius, p 32px 20px, mx 16px, mt 20px, text-centre */
.me-empty-title  /* Inter 700 18px ink, mb 10px */
.me-empty-body   /* Inter 400 14px ink-2, mb 24px, lh 1.5 */
.me-empty-cta    /* brand bg, white text, Inter 600 15px, p 12px 24px, radius 12px */

/* ── Radius control (4-segment) ──────────────── */
.me-radius-control     /* extends .segment-control, 4-column grid */
```

---

## Copy Strings

All copy strings for the Me tab. Developer should use these exact strings — do not paraphrase.

### Header
- Display name placeholder: "Sniffout walker"
- Add name CTA: "Add your name →"
- Since prefix: "Since {Month} {Year}" — e.g. "Since November 2025"

### Zone 1 — Highlights card
- Row labels: "Most explored" | "Favourite region" | "Total miles" | "Total walks" | "Seasons walked"
- Total miles format: "[X.X] mi" (1 decimal place) or "[N] mi" if whole number
- Total walks format: "1 walk" | "[N] walks"
- Season chip labels: "Spring" | "Summer" | "Autumn" | "Winter"

### Zone 2 — Progress bar
- Section heading: "Miles walked"
- Current format: "[X.X] mi" (1dp) as large label
- Next milestone format: "→ [N] Miles" — e.g. "→ 25 Miles", "→ 100 Miles"
- Hint format: "[X.X] miles to the [N] Miles badge" — e.g. "10.7 miles to the 25 Miles badge"
- Completion title: "100 Miles Club"
- Completion body: "You've walked over 100 miles with Sniffout."

### Zone 3 — Badges
- Section heading: "Badges"
- Earned count: "[N] earned" — hidden if 0
- Hint: "More to unlock"
- Badge names (exact): "10 Miles" | "25 Miles" | "50 Miles" | "100 Miles Club" | "Explorer" | "Trailblazer" | "Regional Rambler" | "Coastal Walker" | "Woodland Walker" | "Moorland Walker" | "Seasonal Walker" | "All-Weather" | "Regular" | "Devoted" | "Collector"

**Locked badge tooltip strings:**
| Badge | Tooltip text |
|---|---|
| 10 Miles | "Walk 10 miles in total to earn this." |
| 25 Miles | "Walk 25 miles in total to earn this." |
| 50 Miles | "Walk 50 miles in total to earn this." |
| 100 Miles Club | "Walk 100 miles in total to earn this." |
| Explorer | "Explore 5 different walks to earn this." |
| Trailblazer | "Explore 10 different walks to earn this." |
| Regional Rambler | "Explore walks in 3 different regions to earn this." |
| Coastal Walker | "Log a coastal walk to earn this." |
| Woodland Walker | "Log a woodland walk to earn this." |
| Moorland Walker | "Log a moorland or open-country walk to earn this." |
| Seasonal Walker | "Return to the same walk in a different season to earn this." |
| All-Weather | "Walk in 3 different seasons to earn this." |
| Regular | "Log the same walk 3 or more times to earn this." |
| Devoted | "Log 5 different walks to earn this." |
| Collector | "Save 5 walks to your favourites to earn this." |

### Zone 4 — Walk history
- Section heading: "Walk history"
- Meta format: "Walked once · today" | "Walked once · yesterday" | "Walked twice · [X] days ago" | "Walked [N] times · [X] days ago" | "Walked [N] times · [X] weeks ago"
- See all link: "See all [N] walks →"
- Full log sheet title: "Your walks"
- Walk history empty inline state: "Mark a walk as walked to start your log."

### Settings sheet
- Sheet title: "Settings"
- Name row label: "Your name"
- Name row empty value: "Not set"
- Display mode sub-label: "Display mode"
- Segment labels: "Light" | "Auto" | "Dark"
- Search radius sub-label: "Search radius"
- Radius segment labels: "1 mi" | "3 mi" | "5 mi" | "10 mi"
- Data note: "Your walks, favourites, and reviews are saved on this device. Sync across devices is coming in a future update."

### Empty state
- Title: "Your walking journey starts here"
- Body: "Explore walks and mark them as walked to build your personal log."
- CTA button: "Explore walks"

---

## Phase 3 Hook Summary

These are not built in Phase 2. They are documented here so the Developer knows to leave space and avoid layout decisions that would require a structural rewrite.

| Hook | Zone | What it is | Layout impact |
|---|---|---|---|
| Profile photo | Header | 44×44 circular image, left of name | Prepend to header flex row — no reflow |
| Following / followers | Header | "[N] following · [N] followers" line below Since | Third line in name block — no reflow |
| Sign-in CTA | Header | "Create account to sync" below name | Fourth line in name block — no reflow |
| Local Legend row | Zone 1 highlights card | "Local Legend: [Walk Name]" row above seasons | Standard `.me-highlights-row` insertion |
| Profile walk submissions | Zone 3 badges | "Walk submitted", "First review" chips | Standard `.me-badge` chips in existing grid |

No structural change is required to accommodate any Phase 3 hook. Each slots into an existing container.

---

## Dark Mode — Explicit Overrides Required

All `var()` token colours handle dark mode automatically via `body.night`. The following elements require explicit `body.night` overrides because they use non-token `rgba` values:

```css
/* Progress bar track */
body.night .me-progress-track {
  background: rgba(255, 255, 255, 0.1);
}

/* Earned badge — slightly stronger green tint in dark mode */
body.night .me-badge--earned {
  background: rgba(30, 77, 58, 0.18);
  border-color: rgba(30, 77, 58, 0.3);
}

/* Season chips — same as earned badge tint */
body.night .me-season-chip {
  background: rgba(30, 77, 58, 0.18);
  border-color: rgba(30, 77, 58, 0.3);
}

/* Settings + log sheet handle */
body.night .me-settings-handle {
  background: rgba(255, 255, 255, 0.22);
}
```

Everything else — card surfaces, borders, text colours, progress fill — is handled by the existing token set.
