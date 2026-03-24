# Designer Brief B - Today Hero, Weather Hazards, Settings, Walk Cards, Map Toggle
**Date:** 24 March 2026
**Author:** Designer
**Status:** Ready for Developer implementation
**Scope:** Spec only - no app files edited. Developer implements from this document.
**Companion spec:** docs/specs/designer-brief-march-24-spec.md (earlier today - all decisions there stand)

---

## Notes before starting

All CSS tokens, typeface rules, and interaction requirements are as defined in CLAUDE.md and designer-brief-march-24-spec.md. Nothing contradicts decisions already made there.

**Tap feedback rule applies throughout:** every interactive element in this spec requires `transition: transform 0.15s ease` and `transform: scale(0.97)` on `:active`. Stated once here, applies everywhere below without exception.

**Brand colour is #2C4A14.** Dark mode brand backgrounds use #3D6B22. Brand text and icons in dark mode use #6A9B4A. These values are as established in designer-brief-march-24-spec.md.

---

## Task 1 - Today Tab Hero Card and Detail Card Unification

### 1. Where the detail text lives

**Recommendation: option (c) - a single unified card with the detail text as a distinct lower section within the same coloured card surface.**

Neither option (a) nor option (b) is correct for this product.

Option (a) (collapsible detail behind the info button) hides content that matters. If a user is in a heat hazard and does not tap the info button, they miss the actionable guidance. Safety-adjacent information should not be behind a tap.

Option (b) (detail below the hero card, visually connected) is better but still creates a visual seam between two elements. A user can always wonder whether the second element belongs to the first.

Option (c) - one card, two internal sections - eliminates both problems. The card is a single coloured surface (amber, green, or red as appropriate). Internally, a 1px white-at-12%-opacity horizontal divider separates the upper hero section (temperature, verdict) from the lower detail section (hazard body text). Everything is within one border-radius, one colour, one card.

**Structural layout of the unified card (top to bottom):**

Upper section (above the internal divider):
1. Temperature and feels-like row
2. Verdict title + Lucide icon

Lower section (below the internal divider):
3. Hazard detail text (body copy)
4. Stat pills row (humidity, wind, sunset)
5. "Full forecast" tap row (see point 3 below)

The info button is absolutely positioned in the top-right corner and is not part of this vertical flow (see point 2).

**Internal divider specification:**
- 1px horizontal line
- Colour: white at 12% opacity (`rgba(255,255,255,0.12)`)
- Full width of the card interior (margin: 0 -16px if the card has 16px horizontal padding, so the line extends edge to edge within the card border-radius)
- Vertical margin: 12px above and below the divider

**Lower section background:** same colour as the upper section - no tone change, no overlay. The divider alone creates the separation. Do not add a darker or lighter tint to the lower section.

### 2. Info button repositioning

**Move to: top-right corner of the hero card, absolutely positioned**

This removes the info button from the vertical flow, which currently forces the verdict title onto its own line. Once moved to an absolute position, the verdict title and Lucide icon can sit on a single natural line.

**Specification:**

- Position: `position: absolute; top: 12px; right: 12px`
- Tap target size: 36px x 36px (the touchable area)
- Visual element inside: Lucide `info` icon, 18px (use the plain `info` not `info-circle` - the plain version is cleaner at small sizes)
- Colour: white at 65% opacity (`rgba(255,255,255,0.65)`)
- Background: none. The icon sits directly on the card's coloured background with no circle, badge, or pill behind it. The coloured card surface provides sufficient context.
- No border, no shadow on the info icon button itself.

**What the info button does:** tapping it navigates the user to the Weather tab (`showTab('weather')`). It is a shortcut to full detail, not a toggle or modal trigger. This is consistent with the "Full forecast" link (see point 3) - both elements point to the same destination, but the info icon is the compact version in the top corner and the "Full forecast" row is the explicit CTA at the bottom.

The info button should apply the standard tap feedback (scale 0.97) using `transform-origin: center` so the icon scales from its own centre, not the card corner.

### 3. "Full forecast" link placement

**Location: bottom of the unified card, as a tap row separated from the stat pills by an internal divider**

The "Full forecast" link is not an afterthought - it is the primary path to the detailed weather view. It belongs inside the card as a defined section, not as a loose text link below the card.

**Specification:**

- A second internal horizontal divider (identical to the one specified in point 1) separates the stat pills row from the "Full forecast" row
- The "Full forecast" row sits below this divider
- Content: text "Full forecast" (Inter 500, 13px, white at 80% opacity) on the left, Lucide `chevron-right` icon (14px, white at 60% opacity) on the right
- Row height: 40px (padding 10px top and bottom)
- The row is the full tap target - tapping anywhere on this row navigates to the Weather tab

This treatment means the "Full forecast" row is part of the card's visual footprint. No change to the card's outer dimensions is needed - the row simply adds height to the bottom of the card. The card's `border-radius: 16px` wraps around the entire structure including this bottom row.

### 4. Final element order and content audit

**Final element order in the unified hero card (top to bottom):**

1. Temperature + feels-like row
   - Temperature: existing large display treatment (keep)
   - Feels-like: Inter 400, 13px, white at 70% opacity, on the same row as temperature or directly below it

2. Verdict title + Lucide verdict icon
   - Fraunces 600, 22px, white (applying the display typeface to this as a hero moment - this is the verdict, not UI copy)
   - Lucide icon to the left of the title text, 20px, white
   - No info button inline - it has moved to the top-right corner (point 2 above)

3. Internal divider (white, 12% opacity)

4. Hazard detail text
   - Inter 400, 14px, white at 85% opacity
   - `line-height: 1.55`
   - Maximum 3 lines of body text. If the hazard detail string is longer, truncate with an ellipsis at 3 lines. The user can see the full detail on the Weather tab.

5. Stat pills row (humidity, wind, sunset)
   - Keep as-is. No reordering recommended.

6. Internal divider (white, 12% opacity)

7. "Full forecast" tap row
   - As specified in point 3 above

**The info button** is not in this vertical flow - it is `position: absolute; top: 12px; right: 12px` overlaid on the card.

**Nothing removed from the current set.** Temperature, feels-like, verdict title, stat pills, info button, and detail text are all retained. The only changes are: detail text moves inside the card, info button moves to the corner, "Full forecast" becomes an internal row.

---

## Task 2 - Weather Tab Warning Duplication

### 1. Which element to keep: the banner or the card

**Recommendation: remove the banner. Expand the card.**

The banner (full-width coloured strip at the top of the tab) is a notification pattern borrowed from system UIs and browser alerts. It is visually abrupt, it interrupts the visual flow before any weather content has been shown, and it forces the user to process a warning before they understand what they are looking at.

The card format is consistent with the rest of the Weather tab (walk window card, hourly forecast card, hourly bar). A hazard card at the top of the scroll content is the correct pattern: it is prominent, contextualised within the weather content, and uses the same visual language as the other cards on the tab.

Remove the banner entirely. The hazard card sits at the top of the Weather tab's scrollable content area, above the walk window card.

### 2. Unified hazard card layout

The unified hazard card communicates three pieces of information: the hazard summary (what is happening), the hazard detail (what it means and what to do), and the severity level (amber or red).

**Card specification:**

- Background: amber (`--amber`, #B07A28) for caution hazards; `--red` (#EF4444) for danger hazards. The background colour is the severity signal - no additional label, badge, or severity indicator is needed.
- Border: none. The coloured background on the warm off-white page background is sufficient contrast.
- Border-radius: 16px (consistent with all cards)
- Padding: 16px all sides

**Content layout within the card (top to bottom):**

1. Header row
   - Lucide hazard icon on the left: 20px, white. Icon choice is hazard-specific: `wind` for gusts, `thermometer` for heat, `droplets` for rain, `cloud-off` or `alert-triangle` as fallback for any other condition. The Developer implements a mapping from hazard type to icon.
   - Hazard summary text to the right of the icon: Inter 600, 15px, white, on the same baseline as the icon
   - The icon and summary text share a row with `align-items: center`, gap: 8px

2. Hazard detail text
   - `margin-top: 10px`
   - Inter 400, 14px, white at 88% opacity
   - `line-height: 1.55`
   - 1 to 3 sentences. Do not truncate hazard detail text on the Weather tab - unlike the Today tab hero card where 3-line truncation is specified, the Weather tab is specifically the place users come for full detail. Show it all.

3. No stat pills, no CTA link, no bottom row. The hazard card is self-contained. The hourly forecast and walk window below it provide the actionable context.

**Dark mode treatment:**

In dark mode the coloured backgrounds are slightly modified for legibility against the dark page:
- Amber hazard: `#8A5A18` (darker, less saturated amber that reads correctly on #141414)
- Red hazard: `#C73333` (slightly darker red)
- Text remains white at the same opacity values

### 3. Multiple simultaneous hazards

**Stacked cards, one per hazard. Never a single card with multiple hazard rows.**

If wind and heat are active simultaneously, two hazard cards appear stacked vertically with 8px gap between them. Each card is self-contained with its own colour, its own icon, its own summary, and its own detail text.

Rationale: a single card with multiple rows would require showing two different severity colours (amber for gusts, red for heat) within one border-radius - this is visually incoherent. Two separate cards each carry their own severity signal cleanly. The amber wind card above the red heat card is immediately readable: two separate warnings, two separate severity levels.

**Card order when multiple hazards are present:** most severe first (red above amber). When two hazards share the same severity level, use this priority order: heat, then UV, then wind, then rain. Heat and UV hazards are dog-specific (breed hazard spec) and are higher-stakes for the target user.

There is no maximum number of simultaneous hazard cards specified in the product. In practice, three or more simultaneous hazards are rare UK weather scenarios. If three cards somehow appear, they stack with 8px gaps. No collapse or "show more" mechanism is needed.

### 4. Walk window and hourly cards

**Confirmed: the walk window card and the hour by hour card remain entirely separate from the hazard section, below it in the scroll order.**

Card sequence on the Weather tab from top of scroll to bottom:
1. Hazard card(s) (if any active hazards) - 0 to N cards, 8px gaps between them
2. Walk window card
3. Hour by hour card

**Spacing between the last hazard card and the walk window card:** 12px. This matches the standard gap between cards used throughout the app. No special treatment needed - the hazard section does not need extra breathing room above or below it.

**When no hazards are active:** the hazard section is empty. The walk window card sits at the top of the scroll. This is the same state as today - no "all clear" card is needed (the Today tab hero card carries the "good conditions" message). The Weather tab's absence of hazard cards is itself the good-conditions signal.

---

## Task 3 - Settings Cog Placement

### 1. Should this be a second FAB?

**No. A second FAB is the wrong pattern for settings.**

FABs represent the primary, high-frequency action on a screen. The existing log walk FAB is correctly a FAB - adding a walk entry is the primary action on the Me tab and users will tap it after every walk.

Settings is a low-frequency, navigational action. A user sets their dog's name once. They change their units preference once. They toggle dark mode occasionally. Making settings a FAB assigns it the same visual prominence as the most important action in the product. This is a hierarchy error and creates a "two primary actions" signal that confuses the tab's purpose.

The top-right corner placement is also wrong - it is out of reach (top corner on a mobile screen is a low-affordance zone for thumb use), visually disconnected from the content it controls, and it reads as a global setting rather than a profile setting.

### 2. Recommended alternative placement

**Move the settings cog to the top-right corner of the dog profile card as an in-card icon button.**

The dog profile card is the natural home for settings access. The settings that live behind the cog (dog name, breed, units, dark mode) are either directly about the dog profile or directly about the app experience. Both are logically anchored to the profile card.

A user who wants to edit Luna's name looks at the Luna card and sees the settings icon in its corner. The connection is immediately legible.

**Specification:**

- Position: `position: absolute; top: 12px; right: 12px` within the dog profile card (the card must have `position: relative`)
- Tap target: 36px x 36px
- Visual element: Lucide `settings` icon, 18px, `--ink-2`
- Background: none. The icon sits directly on `--surface` (white in light mode, #1F1F1F in dark mode). No circle, no pill, no border behind it.
- In dark mode: same `settings` icon, 18px, `--ink-2` (#8A8A8A in dark mode). Readable against the dark card surface.
- No shadow.

**The existing Settings row at the bottom of the Me tab nav rows should be kept.** It provides a full-page settings pathway that is discoverable through standard navigation. The in-card settings icon is a shortcut for the most frequent settings action (editing the dog profile) not a replacement for the settings row.

If the settings cog currently appears in the top-right corner of the Me tab as a floating element (above the scrollable content, outside the dog profile card), remove it from that position entirely and implement it as described above.

---

## Task 4 - Walk Card Image Proportion and Layout

### 1. Recommended image heights

**Walk name is confirmed as overlaid on the image** (per designer-brief-march-24-spec.md, Task 5, point 5). This means the image carries more visual and informational weight - it must be tall enough for the name to breathe.

**(a) Horizontal carousel on the Today tab:**

**Image height: 140px**

Carousel cards on a 375px screen are typically 200-220px wide (showing one full card and a hint of the next card to signal scrollability). At 140px image height, a 210px wide card achieves close to a 3:2 ratio, which is the standard for walk imagery and was established in designer-brief-march-24-spec.md.

The 140px image height is a substantial increase from the assumed current ~100px. It makes the walk feel like a destination rather than a thumbnail.

**(b) List view on the Walks tab:**

**Image height: 180px**

List cards are full-width minus 32px total margin (16px each side) on a 375px screen, giving approximately 343px card width. At 180px image height, the ratio is approximately 343:180 (approximately 1.9:1) - slightly wider than 16:9, which is correct for landscape walk photography. The walk name overlaid at the image bottom (spec from designer-brief-march-24-spec.md) sits in the gradient zone with ample legibility.

180px is the minimum for the list card image to feel prominent at full width. Going higher risks making the card very tall and reducing the number of cards visible without scrolling (which matters for list browse behaviour).

### 2. Minimum content below the image

With the walk name already in the image overlay, the content area below the image is purely functional: it provides the planning data.

**Minimum required content (all in one row):**

1. Walk length - formatted via `formatDist()`, Inter 500, 13px, `--ink`
2. Difficulty pill - "Easy" / "Moderate" / "Hard", Inter 500, 12px, pill height 24px
3. Off-lead pill - "Full off-lead" / "Partial" / "On-lead", Inter 500, 12px, pill height 24px

These three items fit in a single horizontal row with `gap: 8px` between them. The row is left-aligned within the card content area.

**Nothing else is required in the card content area.** Location, description, ratings, and review count all live in the walk detail overlay. The card is a browse unit - it shows enough to make a tap decision, not enough to make a go decision.

Content area padding: 10px top, 12px left and right, 12px bottom.

### 3. "Away" distance versus walk length

**Remove the "away" distance from the card. Keep walk length only.**

Rationale: "away" distance answers the question "how far do I need to travel to get there?" Walk length answers the question "how long is the walk?" On a browse card, the user is deciding whether to tap for more detail - the walk length is the more relevant planning signal at this stage. "How far away?" is a detail the user looks up once they are interested, not before.

Walk length stays. "Away" distance moves to the walk detail overlay (if it is not already shown there), where it belongs alongside the full walk information.

This simplification also reduces the pill row from four items to three, which matters at the compressed content area heights specified above.

### 4. Final card heights

**Carousel card (Today tab horizontal scroll):**
- Image: 140px
- Content area: 10px top padding + 24px pill row height + 12px bottom padding = 46px
- Total card height: 140 + 46 = **186px**

**List card (Walks tab list view):**
- Image: 180px
- Content area: 10px top padding + 24px pill row height + 12px bottom padding = 46px
- Total card height: 180 + 46 = **226px**

Card outer border-radius: 16px on all corners (both variants).
Card border: 1px solid `--border`.
Card background on the content area: `--surface`.

**Dark mode:** the content area uses `--surface` (#1F1F1F), `--ink` and `--ink-2` dark values. The gradient placeholder (green gradient) remains identical in dark mode - the gradient itself is dark enough to be appropriate on a dark background without adjustment.

---

## Task 5 - Walks Tab Map - Toggle Between Curated Walks and Green Spaces

### 1. Toggle design

**Recommendation: a segmented control in the map header area above the map, full width within the header padding.**

Rejected alternatives:
- Floating toggle overlaid on the map: overlaid controls compete with pin interaction and obscure map content. The map should be as clear as possible.
- Filter chips: filter chips are additive selections (the user can select multiple). This toggle is a binary mode switch - a segmented control is the correct interaction model for an either/or choice.

**Segmented control specification:**

- Position: within the existing filter/header bar that sits above the map in map view, on its own row above any filter chips. If the filter bar is a horizontal strip, the segmented control occupies the full strip width on its own row, with filter chips on a second row below it (scroll only if needed).
- Width: full width of the header area minus 16px left and right padding
- Height: 34px
- Container background: `rgba(0,0,0,0.06)` in light mode, `rgba(255,255,255,0.08)` in dark mode
- Border-radius: 10px
- Active segment: `--surface` (#FFFFFF light, #2A2A2A dark) background, `--ink` text, `box-shadow: 0 1px 3px rgba(0,0,0,0.15)`, border-radius: 8px
- Inactive segment: transparent background, `--ink-2` text
- Segment labels: Inter 600, 13px
- Transition: the active segment indicator slides between positions with `transition: transform 180ms ease`. This is a smooth sliding highlight, not an instant swap.
- Each segment is 50% of the total width (two equal segments)

**Label text: confirmed as "Sniffout Picks" and "Green spaces"**

These labels match the section headings in the list view exactly, which is the right call - consistent language between list mode and map mode reduces cognitive load.

### 2. Pin differentiation for green spaces

From designer-brief-march-24-spec.md, curated walk pins are: 28px diameter circle, #2C4A14 fill, 2px white border.

**Green space pins:**
- Shape: same circular DivIcon (consistency - the circle is the Sniffout map pin shape, not a type indicator)
- Diameter: 28px (same as walk pins)
- Fill colour: `#4A7A5A` (a mid-range forest green - lighter and less saturated than the dark brand green #2C4A14, distinctly different at a glance while remaining in the same green family, appropriate for natural green spaces)
- Border: 2px solid #FFFFFF (same as walk pins)
- Shadow: `0 1px 4px rgba(0,0,0,0.28)` (same as walk pins)
- Selected state: 36px diameter, 3px white border, `0 2px 8px rgba(0,0,0,0.35)` (same escalation pattern as walk pins)

**Visual distinguishability test:** dark brand green (#2C4A14) versus mid forest green (#4A7A5A) - the lightness difference between these two values is substantial enough to read as clearly distinct even at 28px. Walk pins are near-black green. Green space pins are mid-green. The distinction is immediate and does not depend on colour alone (useful for colour-blind users for whom both still differ in perceived lightness).

**Dark mode green space pins:** `#5A9070` (lightened for dark mode, same lightening principle as the brand dark adjustment from #2C4A14 to #3D6B22/6A9B4A)

### 3. Default state

**Default: Sniffout Picks is shown when the user enters map view.**

Rationale: Sniffout Picks are the editorially curated walks - the core product offering. They are the reason a user downloaded and installed Sniffout. When a user switches from list mode to map mode, they should see the same curated walks they were browsing in the list, now on a map. Green spaces are the secondary layer - supplementary, Places API-driven, lower editorial confidence.

Showing curated walks first also ensures that the custom green circular pins (the brand-coloured map pins from the spec) are the first thing a new user sees on the map. These are the most visually distinctive element of the Sniffout map and they read as "this is our content" - the right first impression.

### 4. Both visible simultaneously

**Both visible simultaneously: yes, but as a third segment - not the default.**

A two-option toggle (Sniffout Picks / Green spaces) is clean but loses the ability to show both. The spec extends this to a three-segment control: "Picks | All | Green spaces."

**Updated segmented control label set:**
- Segment 1: "Picks" (shortened from "Sniffout Picks" to fit three segments cleanly at 13px Inter 600)
- Segment 2: "All"
- Segment 3: "Green spaces"

Each segment is 33.3% of the total width.

**When "All" is active:** both walk pins (#2C4A14 dark green) and green space pins (#4A7A5A mid-green) appear simultaneously. The colour differentiation specified in point 2 is the sole mechanism for distinguishing the two types - no legend or key is needed. At zoom levels above 9 (the threshold from designer-brief-march-24-spec.md), both layers are visible.

**Clutter management for "All" mode:** the zoom-level-9 threshold from designer-brief-march-24-spec.md applies to both layers when in "All" mode. Below zoom 9, all pins are hidden and the "Zoom in to see walks" overlay appears (same spec as designer-brief-march-24-spec.md Task 3, point 4). Above zoom 9, both layers are shown and the 100 walk pins plus the nearby green space pins will be visible simultaneously. This is acceptable given the geographic spread of 100 UK walks - at zoom level 9 or above, the visible map area covers a limited geographic region and the total visible pins will typically be a manageable number (5-20 of each type, not all 100).

**"All" mode is not the default.** It is available but requires deliberate selection. Users who want to explore both start on "Picks" by default and can switch to "All" when they want the combined view.

---

## Summary of key recommendations

**Task 1 - Today hero unification:** One unified card, coloured background throughout. Internal white dividers separate the hero section (temperature, verdict) from the hazard detail text and stat pills. Info button moves to absolute position top-right (18px `info` icon, white 65% opacity, no background). "Full forecast" becomes a defined tap row inside the card below the stat pills.

**Task 2 - Weather hazard unification:** Remove the banner entirely. One hazard card per active hazard, stacked with 8px gaps, most severe first. Each card is self-contained with coloured background, Lucide hazard icon, one-line summary, and full detail text. Walk window and hourly cards remain separate below with 12px spacing.

**Task 3 - Settings cog:** Not a second FAB. Move to the top-right corner of the dog profile card (absolute position, 12px from top and right, 36px tap target, Lucide `settings` 18px, `--ink-2`, no background). The existing Settings nav row at the bottom of the tab is kept.

**Task 4 - Walk card images:** Carousel image 140px (total card 186px). List image 180px (total card 226px). Walk name stays overlaid on image. Content below shows walk length, difficulty pill, and off-lead pill only - "away" distance removed from cards, retained in the detail overlay.

**Task 5 - Map toggle:** Three-segment control ("Picks | All | Green spaces") in the map header above the filter chips. Green space pins use #4A7A5A (mid forest green) distinct from walk pin #2C4A14 (dark brand green). Default is "Picks." "All" mode shows both layers simultaneously with colour differentiation as the sole distinguishing mechanism.

---

*Document ends.*
*Saved: docs/specs/designer-brief-march-24b-spec.md*
*Date: 24 March 2026*
*Status: Ready for Developer implementation. No app files were edited in producing this spec.*
