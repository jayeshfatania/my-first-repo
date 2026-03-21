# Sniffout v2 — Designer Brief Round 3
*Issued by Product Owner. March 2026. For Designer use only.*
*Based on: owner feedback session, March 2026. Covers card sizing and filter/sort UI.*

This brief can be worked in parallel with the current developer session (Round 4 + Round 5 + Today tab). The Designer's output will feed into a subsequent developer brief.

---

## Context

The owner has reviewed the build on their phone and has two categories of feedback requiring design work before developer implementation:

1. **Card sizing hierarchy** — Sniffout Picks/curated walk cards should be more prominent. "Other nearby green spaces" cards should be slimmer and clearly subordinate.
2. **Filter and sort expansion** — the current funnel → inline radius chips pattern cannot scale to the number of filter and sort options the owner has requested. A new UI pattern is needed for both Walks and Nearby tabs.

Both tasks produce a specification document (`design-review-round3.md`) with exact CSS values and layout specs for the Developer. Reference files: `sniffout-v2.html`, `mockup.html`, `design-spec.md`.

---

## PART 1 — Card Sizing Hierarchy (Walks Tab)

### Current state

**Sniffout Picks trail cards** (`.trail-card`, in `.trail-carousel` horizontal scroll):
- Photo area: 120px height
- Card width: ~160px (narrow, designed for compact horizontal scroll)
- Body: name (14px/600), rating + meta row, tags

**"Other nearby green spaces" cards** (`.gs-card`):
- Photo area: variable (`.venue-card-photo-gp` div — 140px height when present, empty div when no photo)
- Card body: name + distance + maps link (after Round 5 fix)
- Currently uses `border-radius: 16px` (after Round 4 FIX 5.8)

### The problem

The trail cards — which represent curated Sniffout walks — are currently smaller than the green space cards. A user scrolling the Walks tab sees similar-sized cards for both sections, with no visual weight difference to indicate curated content is premium. This is backwards.

### Design task

Produce revised size specifications for both card types. The goal is unambiguous visual hierarchy: curated Sniffout Picks cards are the centrepiece, green space cards are clearly supplementary.

---

### 1A — Sniffout Picks trail card (`.trail-card`)

Redesign the trail card for more prominence. Consider:

**Option A — Taller, wider carousel cards (recommended starting point):**
- Increase photo area from 120px to 180px height
- Increase card width from ~160px to ~200–220px
- Body text: name at 15px/600 (up from 14px), rating + meta unchanged

**Option B — Full-width vertical list:**
- Cards become full-width (margin 0 16px), stacked vertically
- Photo area at 180px height, full width
- This eliminates the horizontal scroll carousel format entirely

**Option C — Hybrid: wide cards with taller photo + rich body:**
- Cards ~240px wide, 200px photo height
- Body includes a one-line excerpt from `walk.description`
- Retains horizontal scroll

**Recommendation to Designer:** Option A or C. Do not recommend Option B — the horizontal scroll carousel pattern is confirmed in the owner's brief and the research (it enables browsing without commitment). Option A is lower-effort; Option C adds description text which is valuable but increases card complexity.

Whichever option is chosen, provide:
- Exact `width`, `min-width`, or `flex` values for the card
- Exact photo height
- Font sizes for name, rating, and meta rows
- Whether `walk.description` is included (and if so, max line count)
- Confirm `position: relative` on `.trail-card-photo` (required for heart button added in FIX 5.4)

---

### 1B — Green space card (`.gs-card`)

The green space cards should be visually subordinate to the trail cards above them. After Round 5 FIX 6.2 (removing the "Nearby" pill) and FIX 6.3 (adding the Maps link), the current card contains:
- Optional photo area (140px height via `.venue-card-photo-gp`) — shown if `gs.photoUrl` exists; brand-green placeholder when not
- Card body: name + distance metadata on the left, "View on Google Maps →" link on the right

**The problem with the current format:** the full-width 140px photo area makes these cards the same visual weight or larger than the trail cards above them. This contradicts the hierarchy.

**Owner direction (confirmed):** Photos must be kept. Repositioning the photo to the left side of the card is explicitly acceptable and is the right approach for achieving a slimmer format.

**Design task:** Redesign the green space card as a compact horizontal row with a left-side thumbnail. The card should be noticeably shorter than a trail card — a scannable list row, not a feature card.

**Specified approach — left thumbnail row:**
- Card layout: horizontal flex row, full width (margin 0 16px), stacked vertically (not a carousel)
- **Left:** square thumbnail — suggested 64×64px or 72×72px, `border-radius: 10px`, `object-fit: cover`. Brand-green placeholder (`background: var(--brand)`) when `gs.photoUrl` is null — no broken image icon, no empty space.
- **Right of thumbnail:** text column — name (14px/600/`var(--ink)`) on line 1; distance (12px/`var(--ink-2)`) on line 2; "View on Google Maps →" (12px/`var(--brand)`, 500 weight) on line 3 or inline with distance
- **Card height:** target ~72–80px total including padding — approximately half the visual height of the current format
- `border-radius: 16px`, `border: 1px solid var(--border)`, `background: var(--surface)`, `padding: 10px 12px`

Provide exact values for:
- Thumbnail dimensions and border-radius
- Internal padding and gap between thumbnail and text column
- Whether "View on Google Maps →" is on its own line or inline after the distance
- Confirmed total card height

---

### 1C — Section composition after changes

Once both card specs are confirmed, review how the two sections read together on a single scroll:
- "Sniffout Picks" section: prominent horizontal carousel
- "Other nearby green spaces" section: compact subordinate list below

Confirm the section label hierarchy is correct (`.walks-section-label` for primary, `.walks-section-label-sm` for secondary — already in the CSS but confirm it reads correctly with the new card sizes).

---

## PART 2 — Filter and Sort UI (Walks + Nearby Tabs)

### Current state

Both tabs have a funnel icon button (`.filter-btn`) that opens `.radius-picker` — a small inline div with 4 chip buttons (1 km / 3 km / 5 km / 10 km). This is the entirety of the current filter UI.

**Current filter element IDs:** `#walks-radius-btn` / `#walks-radius-picker`, `#nearby-radius-btn` / `#nearby-radius-picker`.

### Requested options

**Walks tab filter/sort options (from owner — all confirmed):**
1. Radius — existing (1 / 3 / 5 / 10 km)
2. Sort by rating
3. Sort by distance (closest first)
4. Surface type — existing `terrain` field values: `paved | muddy | mixed | rocky`
5. Environment type — new `environment` field: `woodland | coastal | urban | moorland | heathland | open` *(schema addition confirmed — see terrain note below)*
6. Duration: Short (<60 min) / Medium (60–120 min) / Long (>120 min) — thresholds confirmed
7. Off-lead: Full off-lead / Partial / On-lead only
8. Difficulty: Easy / Moderate / Hard

**Nearby tab filter/sort options (from owner — all confirmed):**
1. Radius — existing (1 / 3 / 5 / 10 km)
2. Sort by distance (closest first)
3. Sort by rating
4. ~~Category filter~~ — **not in filter sheet**. Category chip row (Pubs / Cafés / Pet Shops / Vets) remains the primary category selector. Owner confirmed.

### The design problem

The current `.radius-picker` inline chip pattern cannot accommodate 7 filter/sort options. A compact inline picker that was appropriate for 4 radius chips will become unusable with 20+ chips across multiple filter groups.

A new UI pattern is needed. Design a **filter/sort bottom sheet** that opens when the funnel icon is tapped, replacing the current inline radius picker.

---

### Design task

Produce a complete filter/sort bottom sheet specification for both tabs. Consider:

**Bottom sheet behaviour:**
- Opens from bottom, covers ~65–75% of screen height
- Backdrop darkens behind it
- Drag handle or close button at the top
- Closes on backdrop tap, close button tap, or "Apply" tap
- Scroll within the sheet if content exceeds visible height

**Filter/sort structure within the sheet — Walks tab:**

```
[drag handle]
Sort by
  ○ Distance (default)
  ○ Rating

Radius
  [1 km] [3 km] [5 km] [10 km]

Surface
  [Any] [Paved] [Muddy] [Mixed] [Rocky]

Environment
  [Any] [Woodland] [Coastal] [Urban] [Moorland] [Heathland] [Open]

Duration
  [Any] [Short <1hr] [Medium 1–2hr] [Long 2hr+]

Off-lead
  [Any] [Full off-lead] [Partial] [On-lead only]

Difficulty
  [Any] [Easy] [Moderate] [Hard]

[Clear all]   [Show walks]
```

**Terrain design decision for the Designer:** Surface and Environment are two distinct dimensions (surface type vs landscape type). They are shown as separate filter sections above. If you judge that combining them into a single "Terrain" section with all 8 chips works better on mobile (fewer section labels, same chip count), that is acceptable — but specify clearly which field each chip value maps to, so the Developer knows which DB field to filter on.

**Filter/sort structure within the sheet — Nearby tab:**

```
[drag handle]
Sort by
  ○ Distance (default)
  ○ Rating

Radius
  [1 km] [3 km] [5 km] [10 km]

[Clear all]   [Show venues]
```

Category stays as the chip row above the venue list, not in the filter sheet (owner confirmed).

---

### Design decisions to make

**1. Live filter vs Apply button:**
- Live filter: results update as the user changes options, no Apply needed. Simpler UX but may cause performance issues if each change triggers a re-render.
- Apply button: results update only when user taps "Show walks". Adds a step but avoids rapid re-renders. Recommended for the Walks tab given the sort operations involved.

**2. Sort by: radio buttons vs chips:**
- Radio buttons (○ Distance ○ Rating) signal single-select semantics. Chips could be used but may imply multi-select. Recommend radio-style single-select for Sort.

**3. Filter chips: "Any" as default clear:**
- Each filter group should have an "Any" or "All" chip as the default/reset option (pre-selected when no filter is active). Tapping "Any" clears that filter group.

**4. Active filter indicator on funnel button:**
- When any non-default filter is active, the funnel button should indicate this (a dot or filled state). Spec the active indicator on `.filter-btn`.

**5. Radius chips:** Retain the current 4-chip radius design within the bottom sheet. The same chips used today, just moved into the sheet.

---

### What not to design

- Do not redesign the category chip row on the Nearby tab. Category chips (Pubs / Cafés / Pet Shops / Vets) stay as primary navigation — owner confirmed.
- Do not add filter options for fields not in WALKS_DB (e.g. enclosed — already a chip on trail cards).
- Do not add a map toggle to the Walks tab — confirmed owner decision.

---

## Schema Note for Developer (PO sign-off given)

The terrain filter requires a new `environment` field in WALKS_DB. This is confirmed and approved:

```
environment: "woodland" | "coastal" | "urban" | "moorland" | "heathland" | "open"
```

- `woodland` — forest or tree-covered paths (e.g. Ashridge Estate, Delamere Forest)
- `coastal` — clifftops, beach paths, estuaries (e.g. South West Coast Path sections)
- `urban` — city parks, town commons, canal towpaths (e.g. Richmond Park, Hampstead Heath)
- `moorland` — open moor, bog, upland (e.g. Dartmoor, Peak District)
- `heathland` — lowland heath (e.g. New Forest, Surrey Hills)
- `open` — open countryside, farmland paths, fields (default for walks that don't fit the above)

The existing `terrain` field (`paved | muddy | mixed | rocky`) is retained unchanged. The Developer must add `environment` to all 25 WALKS_DB entries in the same session as the filter implementation. Use best judgement from walk names and descriptions; when uncertain, use `open`.

The Designer's filter sheet spec must clearly label which section maps to which DB field (`terrain` vs `environment`) so the Developer has no ambiguity.

---

## Confirmed Owner Decisions

All three decisions that were previously blocking this brief are now confirmed:

| Decision | Confirmed |
|----------|-----------|
| Terrain filter values | Both existing surface values (`paved/muddy/mixed/rocky`) AND new environment values (`woodland/coastal/urban/moorland/heathland/open`) — two separate filter groups or one combined group at Designer's discretion |
| Duration thresholds | Short = <60 min · Medium = 60–120 min · Long = >120 min |
| Nearby category filter | Category stays as chip row only. Not in filter sheet. |

---

## Deliverable

Produce `design-review-round3.md` containing:

1. **Card sizing spec:** Exact CSS values for the revised `.trail-card` and `.gs-card` — widths, heights, photo area dimensions, text sizes, padding, layout structure. Include a layout table as in previous design reviews.

2. **Filter/sort bottom sheet spec:** Full HTML structure, CSS for the sheet and all its components (section labels, chip rows, radio sort, drag handle, footer buttons), behaviour spec (open/close/apply/clear), active indicator on `.filter-btn`. No ambiguity — enough detail for the Developer to implement without further design questions.

3. **Terrain section clarification:** State explicitly whether Surface and Environment are two separate sections or one combined "Terrain" section, and which DB field each chip value filters on.

4. **Component reuse confirmation:** For each new component, confirm which existing CSS classes it reuses or extends.
