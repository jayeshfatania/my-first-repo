# Me Tab — Vision and Designer Brief
**Role:** Product Owner
**Date:** March 2026
**Inputs:** po-action-plan-round12.md, community-gamification-roadmap.md, research-report-community-gamification.md, sniffout-v2.html (current implementation)

---

## The Problem with the Current Me Tab

The current Me tab is structured as a settings screen that also happens to show some stats. In order from top to bottom it reads: title → four stat cells → Favourites section → Badges section → Walk history section → a "Saved on this device" disclaimer banner → Settings section with display name and dark mode control.

Every section has equal visual weight. There is no hierarchy. There is no moment of genuine reflection — nothing that makes the user feel like the app knows them or cares about their history with it. The title "Your walks, saved locally" is a data-hygiene disclaimer masquerading as a welcome.

The research finding is direct: the Me tab should be the place a user returns to see their relationship with Sniffout reflected back at them. The same walk feels different in different seasons. The same user who opened 5 walks is a different kind of user from the one who opened 40. The Me tab should make that visible.

The test for the redesign is simple: when a user opens the Me tab, do they feel seen? Do they feel like the app has been paying attention?

---

## The Vision

**The Me tab is a personal walking journal, not a dashboard.**

The difference is emotional register. A dashboard presents data neutrally. A journal reflects back who you are. The Me tab should feel like looking at a shelf of walking boots that have been places — worn in, specific, yours.

The design analogy is closer to a loyalty card that has filled up over time (the walk log compounds, badges accumulate, regions get ticked off) than to a settings screen or a stats page. The data is already there — `sniffout_walk_log`, `sniffout_explored`, `sniffout_favs` all contain genuinely personal information. The redesign's job is to surface that data with warmth and specificity, not to add more data.

**Two structural moves define the redesign:**

1. Settings leave the Me tab. They move to a sheet triggered by a gear icon in the tab header. This is the single most impactful structural change: once settings are gone, everything that remains is about the user's relationship with the app.

2. A personal highlights card is added between the header and the badges. This card — a new element — is where the "this app knows you" moment happens. It shows the user's most visited walk, their home region, the seasons they've walked in. It is the heart of the redesign.

---

## The Five Zones

The Me tab redesign has five distinct zones, stacked top to bottom. Each zone has a clear purpose. No zone bleeds into another.

---

### Zone 1 — Identity Header

**Purpose:** Acknowledge the user. Not just label the screen.

**Phase 2 contents:**
- Left: Display name, displayed large and personal (20px, weight 700). If no name is set, show "Sniffout walker" in ink-2, with a small "Add your name →" tap target inline or below.
- Right: Gear icon (settings trigger) — a circular 36×36 tap target, ink-2 colour, which opens the Settings sheet.
- Below the display name: a single quiet line showing how long they've been using Sniffout — "Walking with Sniffout since [month year]" derived from the earliest timestamp in `sniffout_walk_log`. If no walks logged yet, show nothing here.

**Design notes:**
- Height: approximately 80px of content area, 16px horizontal padding, 20px top padding matching the existing `.me-header` pattern.
- The display name should feel like a personal greeting, not a field label. It is not a settings row.
- "Walking with Sniffout since" is a small detail that creates a sense of continuity. It should be 13px, ink-2. Show month and year only (e.g., "Since November 2025").
- Phase 3 hook: this zone is where the circular profile photo goes when accounts arrive (40px avatar, left-aligned, display name to the right). The layout should be designed with that migration in mind — the current Phase 2 layout should not need to be discarded, only extended.

**What NOT to do:**
- Do not use "Your walks, saved locally" as the header. That is a data disclaimer, not an identity moment. The disclaimer moves to the Settings sheet where it belongs (see Zone 5).
- Do not show a generic avatar placeholder (grey circle with initials) in Phase 2. Empty states should be genuinely empty, not filled with chrome.

---

### Zone 2 — Personal Highlights Card

**Purpose:** Reflect the user's walking personality back at them.

This is the new element that the current Me tab is missing entirely. It is a single white surface card (border-radius: 16px, 1px border, var(--border)) that contains 3–4 rows of personal facts derived from localStorage data. Each row has a label on the left (13px, ink-2) and a value on the right (13px, weight 600, ink). Rows are separated by a 1px border (var(--border)).

**Contents (show only rows where data is available; suppress rows with no data rather than showing "–"):**

| Row label | Value source | Example value |
|---|---|---|
| Most explored | Walk with most entries in sniffout_explored | "Devil's Dyke" |
| Favourite region | Region (location suffix) with most unique walks explored | "Surrey Hills" |
| Seasons walked | Unique seasons in sniffout_explored across all walks | "Autumn · Winter · Spring" |
| Walks since [month] | Total unique walks explored | "14 walks" |

If fewer than 3 rows have data (i.e. the user is very new), suppress the card entirely — do not show a half-empty card. The card earns its place once the user has a real history.

**Design notes:**
- Padding: 0 16px, same as other sections.
- The card has no section heading above it. It does not need one. The rows are self-describing.
- Season display: show filled/coloured dots or short text chips (12px, brand green, rounded) for each season, not prose. "Autumn · Winter" should read like tags, not a sentence.
- "Most explored" defaults to the walk with the most timestamps in sniffout_explored, not the walk logged most in sniffout_walk_log. If tied, show the most recently visited.
- "Favourite region" is derived by tallying the location suffix (e.g., "Surrey", "West Sussex") across all explored walks and taking the most frequent. Show just the region name, not the full location string.

**Phase 3 evolution:**
- Add a row for "Walks with [name]" (if dog name is set in Phase 3 profile)
- Add a row for total elevation gained (requires GPS data, Phase 3+)
- "Most explored" becomes a tappable row that opens the walk detail

---

### Zone 3 — Achievement Badges

**Purpose:** Give the user something to earn, not just see.

The current badge design shows only earned badges as chips. This is correct for the anti-patronising principle (do not award trivial things), but it means the section is either empty or a random collection with no visible progression.

The redesign introduces two badge tiers, both visible simultaneously: **earned** (full colour) and **locked** (greyed, visible but inactive). Showing locked badges is important — it gives users something to aim for. AllTrails' 100 Miles Club works precisely because users can see the milestone before they reach it.

**Phase 2 badge set — full specification:**

*Distance track* (primary, most prominent):
| Badge | Trigger | Locked state |
|---|---|---|
| 10 Miles | getTotalDistanceMi() ≥ 10 | Shows as greyed chip with lock icon |
| 25 Miles | ≥ 25 mi | — |
| 50 Miles | ≥ 50 mi | — |
| 100 Miles Club | ≥ 100 mi | — |

*Exploration track* (secondary):
| Badge | Trigger |
|---|---|
| Explorer | 5 unique walks explored |
| Trailblazer | 10 unique walks explored |
| Regional Rambler | 3+ different regions explored |

*Walk character track* (earned by the type of walk, not just count):
| Badge | Trigger | Logic |
|---|---|---|
| Coastal Walker | Logged a coastal walk | walk.environment === 'coastal' in walk_log |
| Woodland Walker | Logged a woodland walk | walk.environment === 'woodland' |
| Moorland Walker | Logged a moorland/open walk | environment is 'moorland' or 'open' |
| Seasonal Walker | Same walk in 2+ different seasons | getExploredSeasons(walkId).length ≥ 2 |
| All-Weather | Walk explored in 3+ different seasons across all walks | |

*Loyalty track* (rewards regular use):
| Badge | Trigger |
|---|---|
| Regular | Same walk logged 3+ times |
| Devoted | 5 unique walks logged (actually walked, not just explored) |
| Collector | 5+ walks favourited |

**The distance track is the most important.** It should be displayed more prominently than the other tracks — potentially as a distinct progress bar or milestone row rather than just chips, showing the user where they are between milestones. "14.3 mi — you're 10.7 mi from the 25 Miles badge." This is the mechanic the research identifies as the strongest in AllTrails.

**Badge display design:**

*Earned badge:* White chip (or var(--surface)), brand green background tint (rgba(30,77,58,0.08)), brand green border (rgba(30,77,58,0.15)), brand green text (var(--brand)), weight 600, 13px. Small icon or emoji appropriate to the badge type can appear to the left of the label (optional — discuss with Designer). No paw emoji (reserved for paw safety block).

*Locked badge:* White chip, var(--border) border, ink-2 text, 13px, weight 400. A small lock icon (Lucide 'lock', 12px, ink-2) at the left. Do not show the trigger condition inline on the chip — the chip label alone is enough. If the user taps a locked badge, show a small tooltip or inline note: "Explore 3 regions to earn this."

**Distance progress display (specific design request):**

Rather than a chip for each distance badge, show a horizontal progress bar between milestones:

```
─────────────────────────────
  14.3 mi          → 25 Miles
  [██████░░░░░░░░░░░░░░░░░░] 57%
─────────────────────────────
```

The bar shows progress toward the next unearned distance milestone. Once the 25 Miles badge is earned, it advances to show progress toward 50 Miles, and so on. After 100 Miles, the bar is replaced with the full 100 Miles Club badge in full colour.

The numbers shown: current total distance (left), next milestone (right). The bar fill is brand green. Below the bar: the next milestone badge name.

This is a specific design element to spec — the Designer should produce both a mobile layout and a dark mode variant.

**Streak note — do not surface:**
`getCurrentStreak()` and `getLongestStreak()` are computed internally but must not appear as UI elements in the badge section or anywhere in the Me tab. The research finding is explicit: streaks create anxiety for an already-habitual behaviour (daily dog walking). The distance track is the better engagement mechanic — it rewards total effort, not daily compliance.

---

### Zone 4 — Walk History

**Purpose:** Let the user relive where they've been.

**Contents:**
- Section heading: "Walk history" (16px, weight 600)
- The 5 most recent unique walked routes (from `sniffout_walk_log`, deduplicated by walk ID, sorted by most recent log timestamp)
- Each row: walk name (15px, weight 500, ink) + count and date as secondary line (13px, ink-2): "Walked 3 times · 2 days ago"
- Tapping a row opens the walk detail overlay
- If more than 5 unique walks: "See all [N] walks →" link (13px, weight 500, brand green) at the bottom of the section
- Empty state: "Mark a walk as walked to start your log." (13px, ink-2, centred, 24px vertical padding)

**Design notes:**
- Rows are separated by a 1px border (var(--border)), with no border on the last row.
- The walk history section is less prominent than the highlights card and badges — it is a log, not a showcase. Keep it compact. The walk name and date should be scannable in under a second.
- Do not show the full walk description or walk image in the log rows. Name and date only.

**Tappable "See all" sheet:**
The full walk log sheet is a standard bottom sheet (same visual pattern as the conditions tag sheet), full height. Title: "Your walks". All unique walked walks, most recently logged first. Each row tappable to open walk detail. Sheet has a close handle at the top.

---

### Zone 5 — Settings (collapsed / moved)

**The structural recommendation: settings leave the Me tab main view.**

The Settings section should be entirely removed from the Me tab's scrollable content. In its place: a gear icon in the Zone 1 header (top-right, 36×36 tap target) that opens a Settings bottom sheet.

**Settings sheet contents:**
- Sheet title: "Settings"
- Display name (tappable row, opens inline edit or modal)
- Display mode (the existing segmented control — Light / Auto / Dark)
- Search radius (1 / 3 / 5 / 10 miles — four-segment control or tappable list)
- Separator
- A passive informational note (not a banner): "Your walks, favourites, and reviews are saved on this device. Sync across devices is coming in a future update." (12px, ink-2, centred)
- This note replaces the current sign-in banner. Moving it to settings removes a permanent disclaimer from the achievement space.

**Why settings move:**
The current settings section is positioned immediately after the walk history and before the end of the scroll — it occupies 20–30% of the tab's vertical real estate. Once removed, the Me tab contains only identity, highlights, badges, and log. Every element earns its presence by being about the user's walking life.

**What does NOT move to the settings sheet:**
- Display name stays partially in Zone 1 (the display of the name — tap to edit opens the sheet). The setting and the display are decoupled.

---

## Decisions Required Before the Designer Starts

The following decisions will affect the spec. The Designer should not begin detailed layout work until these are resolved.

**Decision 1 — Distance progress bar vs milestone chips**
The vision recommends a progress bar for the distance track (Zone 3). This is a new component that doesn't exist in the design system. Decide whether to spec it as a custom component now, or use badge chips for Phase 2 and add the progress bar in Phase 3. The progress bar is the better mechanic — it should be Phase 2 if possible.

**Decision 2 — Locked badge visibility**
Should locked badges be visible in Phase 2? The vision says yes. An alternative: show earned badges only, with a single static "More to unlock" hint below. The locked-badge-visible approach drives aspirational behaviour more effectively, but it requires the Designer to create and spec two visual states for every badge.

**Decision 3 — Season display in the highlights card**
Seasons as coloured dots, as small chips, or as text? Example: ● Winter ● Spring (dots with text), or ["Winter"] ["Spring"] (chips), or "Winter · Spring" (text). The chips approach is cleanest on mobile but requires colour specification per season. Recommended: chips, no colour differentiation between seasons (all brand green or all neutral). Designer to propose.

**Decision 4 — Empty Me tab state**
A brand-new user (no walks logged, no favourites) opens the Me tab. What do they see? Options:
- A gentle full-bleed onboarding state: "Your walk journey starts here. Explore a walk to get started."
- The header only, with all other sections showing their individual empty states (current approach).
- A single "empty" card that replaces Zones 2–4 until the user has some data.
Recommended: a single empty state card in the position of Zone 2–4, with a CTA to open the Walks tab. Clean, not cluttered with multiple empty states.

**Decision 5 — Settings trigger placement**
Gear icon in the top-right of Zone 1 (header) is the recommendation. Alternative: a "Settings" text link at the very bottom of the Me tab scroll, after Zone 4, styled as a quiet tertiary element. The gear icon approach is more discoverable on mobile. Designer to propose placement.

---

## What NOT to Do

These are explicit constraints for the Designer.

**Do not add a streak counter.** Do not show "current streak", "longest streak", or any variation. No flame icons. No chain icons. The research finding is strong and the PO decision is final. Streaks create anxiety without adding value for a behaviour (daily dog walking) that is already habitual.

**Do not add a points system or numeric score.** No "experience points", no level numbers, no XP. The milestone badges are the gamification. Points add complexity without the concrete milestone payoff.

**Do not add a leaderboard.** No "top walkers this week". No comparison to other users. This is Phase 4+ at the earliest and requires a backend.

**Do not use paw emoji anywhere in the Me tab.** The 🐾 emoji is reserved for the paw safety block. Use the brand green colour, Lucide icons, or text to signal content type.

**Do not create a generic avatar placeholder.** No grey circle with initials. If the user hasn't set a photo (Phase 2, or Phase 3 when accounts are minimal), show no avatar. The display name alone is sufficient identity.

**Do not make settings invisible.** They must be discoverable. The gear icon must be obvious at 36×36, hit area clearly marked, placed in a consistent location (top-right of the tab header, aligned with the nav bar). If the user cannot find settings, they cannot change their display name or dark mode — both of which are common actions.

**Do not show an empty personal highlights card.** If fewer than 3 rows have data, suppress the card. An empty card with dashes feels worse than no card.

---

## Phase 3 Evolution — What the Tab Grows Into

The Phase 2 design should leave the following hooks open for Phase 3. None of these need to be built now, but the layout should not foreclose them.

**Profile photo slot (Zone 1):**
The identity header should be designed so that a circular 44×44 profile photo can appear to the left of the display name without reflow. The Zone 1 layout should be: [photo slot] [name + since date]. In Phase 2, the photo slot is simply absent — no placeholder. When Phase 3 adds account creation, the photo slot activates.

**Sign-in prompt (Zone 1):**
When accounts arrive, an "Upgrade to sync" or "Create account" CTA appears in Zone 1, below the display name, for users who have not signed in. Once signed in, this becomes a quiet "Synced" indicator. The Phase 2 settings sheet already has the "Saved on this device" note — migrating this to a sign-in CTA is a small text change, not a structural redesign.

**Walk log cloud sync:**
Zone 4 (Walk history) grows to include cloud-synced entries from all the user's devices. No structural change — it just gets longer. The "See all" sheet handles pagination.

**Community layer:**
Zone 3 (Badges) gains community-facing badges: "Walk submitted", "First review", "Community contributor". These are additive chips in the existing badge grid. No structural change.

**Following / followers (Phase 4+):**
Zone 1 gains a compact following/followers count below the display name: "12 following · 3 followers". This is a Phase 4 addition. Leave a vertical slot available in Zone 1 below the display name for this line.

**Local Legend (Phase 3):**
Once server-side frequency tracking exists, a new highlight can appear in Zone 2 (Personal highlights card): "Local legend on [Walk Name]" — you've visited this walk more than anyone in the last 3 months. This is a single additional row in the existing card. No structural change.

---

## Designer Brief — Deliverables

Produce a full redesign spec for the Me tab that includes:

**1. Annotated layout for Phase 2**

A single mobile screen layout (375px wide, representing the phone viewport) showing all five zones in their post-redesign positions. Annotate with:
- Exact padding values (should follow existing app convention: 16px horizontal, 20px section gap)
- Colour tokens used (var(--brand), var(--surface), var(--ink), var(--ink-2), var(--border))
- Font sizes and weights for each text element
- Component heights for each zone (approximate is fine; the Developer will tune)

**2. Personal highlights card spec**

Detail the card design: border, radius, padding, row layout, label vs value alignment, season chip design, and the suppression rule (show only rows with data; card hidden if fewer than 3 rows have data). Include the dark mode (`body.night`) variant.

**3. Badge grid spec**

Two layouts:
- Earned badge chip: full colour, dimensions, border, text style
- Locked badge chip: greyed, lock icon size and position, text style
- Proposed distance progress bar: bar dimensions, fill colour (brand green), label positions, milestone text, and the dark mode variant

For the progress bar: propose placement — either within the badge grid (above the chip rows) or as a standalone element between Zone 1 and Zone 2. The bar should feel prominent without dominating.

**4. Settings sheet spec**

The bottom sheet that replaces the inline settings section. Include: sheet handle, title, row layout for display name, segmented control for display mode, segmented control for search radius, informational note at the bottom. Standard bottom sheet pattern (matches the conditions tag sheet). Dark mode variant.

**5. Gear icon spec**

Position in Zone 1, tap target size, icon size, colour. The icon should be immediately recognisable as a settings trigger without competing with the display name. Ink-2 colour recommended. Include active/tap state.

**6. Empty state — new user**

A full layout for a user with zero history: no walks explored, no walks logged, no favourites. Show a single card replacing Zones 2–4 with a gentle, non-pushy message and a CTA to explore walks. Do not use multiple individual empty states stacked on top of each other.

**7. Phase 3 hook markers**

On the Phase 2 layout, mark with dashed outlines or annotations:
- Photo slot position in Zone 1
- "Create account" CTA position in Zone 1
- "Local Legend" row position in Zone 2 card
- "Following / followers" position in Zone 1

These should be visible in the spec so the Developer knows to leave structural space, even though they are not built in Phase 2.

**8. Dark mode variants**

The Me tab's night mode uses `body.night` which applies to all `var()` token colours automatically. The Designer should verify that the personal highlights card, badge chips (both states), and progress bar all render acceptably with the dark token set. Flag any elements that need an explicit `body.night` override rule.

---

## Design Principles Reminder

From CLAUDE.md and the product vision — the Designer should keep these front of mind:

- **Brand colour:** `#1E4D3A` (forest green)
- **Background:** `#F7F5F0` (warm off-white)
- **Surface:** `#FFFFFF`
- **Typography:** Inter 400/500/600/700 only
- **Cards:** border-radius 16px, 1px solid var(--border), no blur
- **No glassmorphism**, no shadows heavier than the border
- **Mobile-first** — all decisions are made for a 375px viewport first
- **Dark mode** via `body.night` — the designer should not introduce any hardcoded colours

The Me tab redesign should feel like it belongs to the same family as the walk detail overlay and the Today tab — clean, card-based, confident. Not a settings screen that grew some ambitions. A journal that also has a settings button in the corner.
