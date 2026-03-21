# Sniffout — Condition Tags & Mark as Walked Design Spec
*Issued by Designer. March 2026.*
*Stream 1, Phase 2. For Developer implementation.*
*Based on: phase2-team-brief.md, community-engagement-research.md, sniffout-v2.html.*

---

## Overview

Two linked features:

1. **Mark as walked** — a tap action on a walk card (trail carousel) and on the walk detail panel. The trigger for the post-walk prompt.
2. **Condition tags** — pre-defined tap labels submitted via the post-walk prompt. Stored against the walk ID with a timestamp, displayed on both the carousel card and walk detail, auto-expired.

These two features are designed as a single interaction flow. They share the same bottom sheet component pattern already established for the filter/sort sheet.

---

## Data Model

Condition tag data is stored in `localStorage` under key `sniffout_condition_tags`.

```js
// Structure
{
  "walk-id-1": [
    {
      tag: "cattle",          // tag key (see taxonomy below)
      ts: 1742140800000,      // Date.now() at submission (ms)
      device: "abc123"        // device fingerprint for rate-limiting (see §Rate Limiting)
    },
    ...
  ],
  ...
}
```

**Rate limiting:** Device fingerprint = `btoa(navigator.userAgent + screen.width + screen.height)`. Per walk ID, per device: max 1 submission per 24 hours. Checked before showing the tag prompt. If already submitted within 24h, the "Mark as walked" button shows a confirmed state only — the post-walk prompt is not shown again.

**Mark as walked** is stored separately in `localStorage` under key `sniffout_walked`:
```js
// Array of walk IDs the user has marked as walked
["walk-id-1", "walk-id-2", ...]
```

This is additive and permanent (no expiry). Used to show the confirmed state on the button on subsequent visits.

---

## Tag Taxonomy

13 tags across 4 categories. Each has a key, display label, Lucide icon, and category.

| Key | Display Label | Lucide Icon | Category |
|-----|--------------|-------------|----------|
| `cattle` | Cattle in field | `cow` | Hazard |
| `sheep` | Sheep in field | `sheep` | Hazard |
| `leads` | Dogs on leads here | `dog` | Hazard |
| `access` | Access issue | `triangle-alert` | Hazard |
| `muddy` | Very muddy underfoot | `footprints` | Surface |
| `flooded` | Flooded section | `waves` | Surface |
| `overgrown` | Overgrown path | `leaf` | Surface |
| `icy` | Icy / slippery | `snowflake` | Surface |
| `water` | Great water point | `droplets` | Positive |
| `cafe` | Dog-friendly café open | `coffee` | Positive |
| `clear` | Excellent conditions | `sun` | Positive |
| `busy` | Busy / crowded | `users` | Footfall |
| `quiet` | Quiet today | `volume-x` | Footfall |

**Note on Lucide icon availability:** `cow` and `sheep` may not be in the current Lucide build used (v1.9.4-era icon set via `luIcon()`). Use `triangle-alert` for cattle and sheep as a fallback if animal icons are absent — these are hazard tags and the triangle-alert icon communicates the right urgency. Confirm at build time.

**Additional tag recommended by Designer:** `no-dogs` — "No dogs reported" for reactive dogs / dog-restricted zones. Held for Phase 2b; not in scope for this build.

---

## Staleness Rules

All staleness logic is calculated at display time from the tag's `ts` timestamp. No batch expiry job required.

| Age of tag | Display treatment |
|------------|------------------|
| 0–6 hours | Full colour. No age label. |
| 6–24 hours | Full colour. Shows "X hours ago". |
| 1–6 days | Full colour. Shows "X days ago". |
| 7–14 days | Reduced opacity (`opacity: 0.55`). Shows "X days ago". |
| 7+ days (Hazard category only) | Amber colour (`var(--amber)`). Shows "May be out of date". Animal hazard information is more time-sensitive. |
| 14–30 days | Reduced opacity (`opacity: 0.55`). Shows "May be out of date". |
| >30 days | Hidden by default. Collapsible under "Older reports" (see §Walk Detail). |

**Effective expiry for display purposes:**
- Hazard tags (`cattle`, `sheep`, `leads`, `access`): amber + "may be out of date" at 7 days
- All other tags: reduced opacity at 7 days, "may be out of date" label at 14 days
- All tags: hidden (collapsed) after 30 days

Tags are never deleted from localStorage — they decay visually and are collapsed, which preserves the audit trail for the device that submitted them.

---

## Part 1 — Mark as Walked Button

### 1A — Location

The "Mark as walked" button appears in **two places**:

1. **Trail carousel card** (`.trail-card`) — below the `.trail-card-tags` row, inside `.trail-card-body`
2. **Walk detail panel** (Phase 2 overlay) — prominent near the top of the detail view, below the walk name and rating

The button does **not** appear on:
- Portrait cards (Today tab hidden gems — too small, wrong context)
- Walk list cards on the Walks tab map view
- Green space cards (`.gs-card`)

### 1B — Button States

**Default (not yet walked):**
```
[ ✓ Mark as walked ]
```
- Element: `<button class="walked-btn" data-walk-id="{id}">`
- Layout: full width of `.trail-card-body` (minus 12px left/right padding)
- Height: 34px
- Background: transparent
- Border: `1px solid var(--border)`
- Border-radius: `10px`
- Font: 12px / 500 / `var(--ink-2)`
- Icon: `check` (Lucide, 13px, inline left) + "Mark as walked" text
- Margin: `8px 0 0` (above the button, separating from tags row)

**Confirmed (already walked — current session or previous):**
```
[ ✓ Walked ]
```
- Same dimensions
- Background: `rgba(30,77,58,0.08)` (brand-green tint, same as `.trail-tag`)
- Border: `1px solid rgba(30,77,58,0.15)`
- Font: 12px / 500 / `var(--brand)`
- Icon: `check` (brand-green)
- Text: "Walked"
- Non-interactive (no tap action). `pointer-events: none` in this state.

**Dark mode:**
- Default: `border-color: rgba(110,231,183,0.2)`; text `var(--ink-2)`
- Confirmed: background `rgba(110,231,183,0.1)`; border `rgba(110,231,183,0.2)`; text `var(--brand)` (which = `#6EE7B7` in night mode)

### 1C — Tap Behaviour

1. User taps "Mark as walked"
2. Button immediately transitions to confirmed state (optimistic UI — no server round trip)
3. Walk ID is added to `sniffout_walked` in localStorage
4. **Post-walk prompt fires** (bottom sheet slides up — see §Part 2)
5. If device has already submitted tags for this walk within 24 hours: skip step 4 (do not re-show prompt). Button shows confirmed state only.

The confirmed state is set immediately on tap, not after the prompt is dismissed. The prompt is an optional follow-on; dismissing it does not un-mark the walk.

---

## Part 2 — Post-Walk Prompt (Condition Tag Sheet)

### 2A — Trigger and Dismissal

- Fires immediately after "Mark as walked" tap
- Appears as a bottom sheet (same CSS pattern as the existing filter sheet: `transform: translateY(100%)` → `translateY(0)`, backdrop behind)
- Dismissal: backdrop tap, "Skip" button, "Done" button, or drag handle tap
- A dismissed prompt **does not reappear** for the same walk in the same session. This is managed with a session-scoped variable: `var promptDismissedThisSession = {}` — set `promptDismissedThisSession[walkId] = true` on any dismissal.
- Prompt does not block navigation. If user taps away to a different tab while the sheet is open, it closes without action.

### 2B — Sheet Layout

Sheet height: approximately `65vh`. Internal scroll if content overflows.

```
┌─────────────────────────────┐
│   ── [drag handle] ──       │  drag handle: 36px wide, 4px tall, border-radius 2px, var(--border), centered, margin-top 10px
│                             │
│  How were the conditions?   │  16px / 700 / var(--ink), margin: 16px 16px 4px
│  Tap all that apply         │  13px / 400 / var(--ink-2), margin: 0 16px 16px
│                             │
│  HAZARD          ─────────  │  section label: 11px / 600 / var(--ink-2) uppercase tracking, padding 0 16px 8px
│  [△ Cattle in field  ]      │  tag chip (see §2C)
│  [△ Sheep in field   ]
│  [⚠ Dogs on leads    ]
│  [⚠ Access issue     ]
│                             │
│  SURFACE         ─────────  │
│  [👣 Very muddy      ]
│  [〜 Flooded section ]
│  [🌿 Overgrown path  ]
│  [❄ Icy / slippery  ]
│                             │
│  POSITIVE        ─────────  │
│  [💧 Great water point ]
│  [☕ Dog-friendly café  ]
│  [☀ Excellent conditions]
│                             │
│  FOOTFALL        ─────────  │
│  [👥 Busy / crowded  ]
│  [🔇 Quiet today     ]
│                             │
│  ┌────────┐  ┌──────────┐  │
│  │  Skip  │  │   Done   │  │  footer: 16px padding, gap 12px
│  └────────┘  └──────────┘  │
└─────────────────────────────┘
```

(Section labels and chips use Lucide icons, not emoji — shown as emoji above for legibility in this document only.)

### 2C — Tag Chips (in prompt)

Each tag is a full-width row button within its section:

```
[ <icon> Label text                    ]
```

- Element: `<button class="cond-tag-option" data-tag="{key}">`
- Width: `calc(100% - 32px)`, centered (16px padding each side)
- Height: 44px (minimum tap target)
- Display: flex, align-items center, gap 10px
- Background: `var(--surface)`
- Border: `1px solid var(--border)`
- Border-radius: `10px`
- Font: 14px / 400 / `var(--ink)`
- Icon: Lucide, 18px, `var(--ink-2)`, left side
- Margin-bottom: 8px

**Selected state (`.cond-tag-option.selected`):**
- Background: `rgba(30,77,58,0.08)`
- Border: `1px solid rgba(30,77,58,0.25)`
- Font: 14px / **500** / `var(--brand)` (text weight bumps to 500 on select)
- Icon: `var(--brand)`
- A `check` icon (14px, `var(--brand)`) appears at the **right edge** of the button (positioned `margin-left: auto`)

Multiple tags can be selected simultaneously. Selection is toggle — tap again to deselect.

**Dark mode selected state:**
- Background: `rgba(110,231,183,0.1)`
- Border: `rgba(110,231,183,0.2)`
- Text + icon: `var(--brand)` (= `#6EE7B7`)

### 2D — Footer Buttons

**Skip button:**
- `<button class="sheet-btn-ghost">Skip</button>`
- Flex: 1
- Height: 44px
- Background: transparent
- Border: `1px solid var(--border)`
- Border-radius: 12px
- Font: 14px / 500 / `var(--ink-2)`
- Action: close sheet, set `promptDismissedThisSession[walkId] = true`, no data saved

**Done button:**
- `<button class="sheet-btn-primary">Done</button>`
- Flex: 2
- Height: 44px
- Background: `var(--brand)`
- Border: none
- Border-radius: 12px
- Font: 14px / 600 / white
- Action: save selected tags to `sniffout_condition_tags`, close sheet, re-render condition tag row on card

"Done" is active (full brand colour) even with zero tags selected — it functions as an explicit confirmation of "no issues to report."

### 2E — Copy Strings (prompt)

| Element | String |
|---------|--------|
| Sheet headline | "How were the conditions?" |
| Sub-headline | "Tap all that apply" |
| Skip button | "Skip" |
| Done button (0 selected) | "Done" |
| Done button (1+ selected) | "Done · {n} reported" |

---

## Part 3 — Condition Tag Display on Trail Cards

### 3A — Position Within `.trail-card-body`

The condition tag row is added **between** the existing `.trail-card-tags` row and the `.trail-card-desc` description text. New element: `.cond-tag-row`.

Full body order after implementation:
```
.trail-card-name
.trail-card-rating         (if reviewCount > 0)
.trail-card-meta           (duration · distance)
.trail-card-tags           (off-lead, terrain, enclosed — existing schema tags)
.cond-tag-row              (NEW — community condition tags)
.trail-card-desc           (description excerpt)
.walked-btn                (NEW — mark as walked button)
```

### 3B — Condition Tag Row on Card (`.cond-tag-row`)

**Empty state (no tags for this walk, or all expired >30 days):**
No `.cond-tag-row` rendered. The card is unchanged.

**With tags:**
Display a maximum of **2 condition tags** on the card — the 2 most recent non-expired tags, prioritised by: Hazard first, then Surface, then Positive, then Footfall.

```
.cond-tag-row layout:
  display: flex; gap: 4px; flex-wrap: nowrap; overflow: hidden;
  margin-top: 4px;
```

Each visible tag chip on the card:
```html
<span class="cond-chip [cond-chip--stale]">
  <!-- Lucide icon, 11px -->
  Label text
</span>
```

**`.cond-chip` CSS:**
```css
.cond-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2px 7px;
  white-space: nowrap;
}
```

**`.cond-chip--hazard` (Hazard category — additional differentiation):**
```css
.cond-chip--hazard {
  color: var(--amber);
  border-color: rgba(217,119,6,0.25);
  background: rgba(217,119,6,0.06);
}
```

**`.cond-chip--stale` (tags 7–14 days old, or hazard 7+ days):**
```css
.cond-chip--stale {
  opacity: 0.55;
}
```

**Overflow indicator:** If there are more than 2 non-expired tags, append:
```html
<span class="cond-chip-more">+{n} more</span>
```
- Same dimensions as `.cond-chip`
- Background: `var(--bg)` (slightly recessed)
- Text: `var(--ink-2)`, 11px/400

**Community disclaimer on card:**
Below the `.cond-tag-row`, when any tags are showing, render:
```html
<div class="cond-disclaimer">Community reported</div>
```
```css
.cond-disclaimer {
  font-size: 10px;
  color: var(--ink-2);
  margin-top: 2px;
  font-weight: 400;
}
```

This must be visible on the card. It is not buried — it sits directly below the tag chips.

---

## Part 4 — Walk Detail Panel

The walk detail panel is the Phase 2 overlay triggered by `onWalkTap()` (currently stubbed). This section specifies the condition tags section within that panel. The broader walk detail panel layout is a separate design scope — this spec covers the condition tags block only.

### 4A — Condition Tags Section in Walk Detail

Position: below the walk's description text, before the "Mark as walked" button.

Section structure:
```
┌─────────────────────────────────┐
│  📍 Current conditions          │  section heading (14px / 600 / var(--ink))
│  Community reported — not       │  disclaimer line (12px / 400 / var(--ink-2))
│  verified by Sniffout           │
│                                 │
│  [△ Cattle in field] 3 hrs ago  │  tag row (see §4B)
│  [💧 Very muddy] 1 day ago      │
│  [☀ Excellent conditions]       │  (stale — amber treatment)
│     May be out of date          │
│                                 │
│  Older reports ↓                │  collapsible (see §4C) — only shown if >30 day tags exist
└─────────────────────────────────┘
```

### 4B — Tag Row in Walk Detail

Each tag in the detail view is a full-width read-only row:

```html
<div class="cond-detail-row [cond-detail-row--hazard] [cond-detail-row--stale]">
  <!-- icon (Lucide 16px) -->
  <span class="cond-detail-label">Cattle in field</span>
  <span class="cond-detail-age">3 hours ago</span>
</div>
```

**`.cond-detail-row` CSS:**
```css
.cond-detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--ink);
}
.cond-detail-label {
  flex: 1;
  font-weight: 500;
}
.cond-detail-age {
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
}
```

**`.cond-detail-row--hazard`:**
```css
.cond-detail-row--hazard .cond-detail-label {
  color: var(--amber);
}
```
Icon also renders in `var(--amber)`.

**`.cond-detail-row--stale`:**
```css
.cond-detail-row--stale {
  opacity: 0.55;
}
.cond-detail-row--stale .cond-detail-age {
  color: var(--amber);
  font-style: italic;
  opacity: 1; /* override parent opacity for this element */
}
```

The staleness label replaces the relative time for tags over threshold:
- 7–14 days (hazard only): age text = "May be out of date"
- 14–30 days (all tags): age text = "May be out of date"

For tags 6hrs–14 days (non-stale): age text = relative time ("2 hours ago", "3 days ago").
For tags 0–6hrs: age text = relative time ("Just now", "1 hour ago").

### 4C — Older Reports (Collapsible)

Tags older than 30 days are hidden by default under a disclosure row:

```html
<button class="cond-older-toggle" onclick="toggleOlderReports(walkId)">
  Older reports <span>↓</span>
</button>
```

**`.cond-older-toggle` CSS:**
```css
.cond-older-toggle {
  display: block;
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  color: var(--ink-2);
  font-weight: 500;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}
```

When expanded, older rows render with full opacity 0.35 and italic age text ("X weeks ago" / "X months ago"). The `↓` rotates to `↑` on expand (CSS `transform: rotate(180deg); transition: transform 0.2s`).

### 4D — Empty State

When no tags exist for a walk (never reported, or all expired >30 days):

```html
<div class="cond-empty">
  <div class="cond-empty-icon"><!-- leaf or footprints icon, 24px, var(--ink-2) --></div>
  <div class="cond-empty-text">Be the first to report conditions on this walk.</div>
</div>
```

**`.cond-empty` CSS:**
```css
.cond-empty {
  text-align: center;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.cond-empty-text {
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 400;
  max-width: 240px;
  line-height: 1.5;
}
```

### 4E — Mark as Walked Button in Walk Detail

The same button logic as §1B applies, but with different sizing:
- Full width (`width: 100%`), not constrained to card body
- Height: **44px** (larger tap target in detail context, vs 34px on card)
- Border-radius: 12px
- Margin: `20px 0 0`

Placement: directly below the condition tags section (or below the empty state).

---

## Part 5 — Relative Time Helper

The Developer needs a utility function. Spec:

```js
function relativeTime(ts) {
  var diff = Date.now() - ts;
  var mins  = Math.floor(diff / 60000);
  var hours = Math.floor(diff / 3600000);
  var days  = Math.floor(diff / 86400000);
  var weeks = Math.floor(diff / 604800000);
  if (mins < 5)   return 'Just now';
  if (mins < 60)  return mins + ' min ago';
  if (hours < 24) return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
  if (days < 30)  return days + ' day' + (days > 1 ? 's' : '') + ' ago';
  if (weeks < 8)  return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
  return Math.floor(days/30) + ' months ago';
}
```

---

## Part 6 — Display Logic Helper

The Developer needs a function to retrieve displayable tags for a walk:

```js
// Returns array of tag objects for display, applying staleness rules
// Excludes tags older than 30 days (those go in the collapsible)
function getDisplayTags(walkId) {
  var allTags = (JSON.parse(localStorage.getItem('sniffout_condition_tags')) || {})[walkId] || [];
  var now = Date.now();
  var HAZARD_STALE  = 7  * 24 * 3600000;  // 7 days
  var STALE_LIMIT   = 14 * 24 * 3600000;  // 14 days
  var HIDE_LIMIT    = 30 * 24 * 3600000;  // 30 days
  var HAZARD_KEYS   = ['cattle','sheep','leads','access'];

  return allTags
    .filter(function(t) { return (now - t.ts) < HIDE_LIMIT; })
    .map(function(t) {
      var age     = now - t.ts;
      var isHazard = HAZARD_KEYS.indexOf(t.tag) > -1;
      var stale   = isHazard ? age > HAZARD_STALE : age > STALE_LIMIT;
      return {
        tag:     t.tag,
        ts:      t.ts,
        isHazard: isHazard,
        stale:   stale,
        ageText: stale && age > STALE_LIMIT ? 'May be out of date' : relativeTime(t.ts)
      };
    })
    .sort(function(a, b) {
      // Hazards first, then by recency
      if (a.isHazard && !b.isHazard) return -1;
      if (!a.isHazard && b.isHazard) return 1;
      return a.ts - b.ts; // older first within group (most recent displayed)
    })
    .reverse(); // most recent first overall
}
```

---

## Part 7 — CSS Class Index for Developer

All new CSS classes required, organised by component:

| Class | Component | Notes |
|-------|-----------|-------|
| `.walked-btn` | Mark as walked button (default) | On `.trail-card-body` and walk detail |
| `.walked-btn.confirmed` | Mark as walked (confirmed state) | Set on tap |
| `.cond-tag-row` | Tag chip row on trail card | Max 2 chips |
| `.cond-chip` | Individual chip on card | Base style |
| `.cond-chip--hazard` | Hazard chip variant | Amber colour |
| `.cond-chip--stale` | Stale chip variant | Reduced opacity |
| `.cond-chip-more` | "+N more" overflow chip | On card only |
| `.cond-disclaimer` | "Community reported" text | Below tag row on card |
| `.cond-tag-sheet` | Post-walk bottom sheet | Reuse filter sheet pattern |
| `.cond-tag-option` | Tag row in sheet | Full-width button |
| `.cond-tag-option.selected` | Selected state in sheet | Brand-green treatment |
| `.cond-section-label` | Section heading in sheet | HAZARD / SURFACE / etc. |
| `.cond-detail-row` | Tag row in walk detail | Full-width, read-only |
| `.cond-detail-row--hazard` | Hazard variant in detail | Amber label |
| `.cond-detail-row--stale` | Stale variant in detail | Reduced opacity + amber age text |
| `.cond-detail-label` | Tag label in detail row | Flex: 1 |
| `.cond-detail-age` | Relative time in detail row | Right-aligned |
| `.cond-older-toggle` | "Older reports ↓" disclosure | Collapsible |
| `.cond-empty` | Empty state container | Walk detail only |
| `.cond-empty-text` | Empty state copy | Walk detail only |

---

## Part 8 — Interaction Flow Summary

```
User taps trail card → walk detail opens (Phase 2 overlay)
  └── Taps "Mark as walked"
        ├── Button → confirmed state immediately
        ├── walkId added to sniffout_walked
        ├── Check: already submitted tags today?
        │     YES → no prompt, confirmed state only
        │     NO  → post-walk prompt sheet slides up
        │             └── User selects tags (0 or more)
        │             └── Taps "Done" or "Skip"
        │                   ├── "Done": save tags → close sheet → re-render cond-tag-row on card
        │                   └── "Skip": close sheet, promptDismissedThisSession[id] = true, no data
        └── Card/detail re-renders with new condition tags visible
```

---

## Part 9 — Reuse Confirmation

| New component | Reuses / extends |
|---------------|-----------------|
| Post-walk bottom sheet | Filter sheet CSS pattern (`.filter-sheet`, `.filter-backdrop`) |
| Sheet footer buttons | Filter sheet `.sheet-btn-primary` / new `.sheet-btn-ghost` (Skip) |
| Drag handle | Filter sheet drag handle (`.sheet-handle`) |
| `.cond-chip` | Extends `.trail-tag` base concept but separate class — different border treatment |
| `.walked-btn` confirmed state | Borrows `.trail-tag` background tint (`rgba(30,77,58,0.08)`) |
| Lucide icons in sheet | Existing `luIcon()` helper |
| Relative time display | New `relativeTime()` utility (see §5) |

---

## Design Notes

**Why full-width rows in the prompt (not chips)?**
The tag prompt uses full-width button rows rather than chip-style multi-select for two reasons: (1) the labels are long enough ("Very muddy underfoot", "Dog-friendly café open") that chips would require wrapping or truncation; (2) 44px tap targets are the standard for accessible interactive elements on mobile. The full-width row provides both without any layout logic.

**Why 2 tags max on the carousel card?**
The trail card already carries schema tags (off-lead, terrain, enclosed) plus a description excerpt. Adding more than 2 community tags would push the card height beyond the visual hierarchy constraint established in design-review-round3.md. 2 tags is enough to signal "conditions reported" — the detail view shows the full list.

**Why hazard tags expire faster (7 days vs 14)?**
Cattle and sheep in fields change weekly — livestock are rotated between pastures. A "cattle in field" tag from 10 days ago is more likely to be misleading than a "very muddy" tag from the same period. The 7-day amber threshold is a safety design decision, not an aesthetic one.

**Why "Community reported" appears on the card (not just the detail)?**
Per phase2-team-brief.md: "Not buried in small print. Not in ToS only. This is both a legal requirement and a trust signal." A disclaimer only in the detail view is not adjacent to the content — the content appears on the card and so the disclaimer must too. The 10px text is small but present and legible.
