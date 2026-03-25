# Designer Brief - Walks Tab, Nearby Tab, Map Pins, Walk Detail Overlay
**Date:** 25 March 2026
**Author:** Designer
**Status:** Ready for Developer implementation
**Scope:** Spec only - no app files edited. Developer implements from this document.
**Prior specs:** designer-brief-march-24-spec.md, designer-brief-march-24b-spec.md, brand-guidelines-march-24.md (all decisions in those documents stand)

---

## Preamble

Tap feedback rule applies to every interactive element in this document: `transition: transform 0.15s ease` and `transform: scale(0.97)` on `:active`. Stated once here, not repeated per element below.

All CSS token values use the updated palette: `--brand: #2C4A14`. Dark mode brand backgrounds use `#3D6B22`. Dark mode brand text and icons use `#6A9B4A`. These are the values from the prior spec files and brand guidelines.

---

## Task 1 - Consistency Audit: Walks Tab and Nearby Tab

### 1. Header area

**Assessment: Consistent in structure, one potential inconsistency in the filter icon's role.**

Both tabs have identical header structures: title, location line, list/map toggle, filter icon. This is correct. A user switching between tabs will immediately recognise the same control pattern.

One item to verify: on the Walks tab, the filter icon opens a filter sheet for walk filters (off-lead, terrain, difficulty, distance). On the Nearby tab, the filter icon may be redundant if category selection is already handled by the chip row. If the Nearby filter icon does something different from the Walks filter icon, this should be labelled or visually distinguished. If it opens the same type of filter sheet (e.g., filtering by distance radius), it is fine to keep as-is with identical visual treatment.

**Recommendation:** Confirm that the filter icon on both tabs opens a filter bottom sheet with the same visual treatment. If the filter icon on the Nearby tab is non-functional or redundant with the category chips, remove it from the Nearby header to avoid confusion.

### 2. List view layout

**Assessment: Inconsistent - but the inconsistency is justified and should be preserved, not resolved.**

The Walks tab list view has two distinct content zones: a horizontal carousel (editorial picks) and a vertical list (green spaces). The Nearby tab has category chips then a vertical list. These look different because they are doing different things.

The Walks tab carousel is editorial - it presents featured content. The Nearby tab chips are navigational - they filter a results list. These are not the same UI pattern and should not look the same. Making them identical would mean either removing the Walks carousel (losing editorial differentiation) or adding a carousel to Nearby (which has no editorial layer to fill it).

**Recommendation:** Keep the structural difference. Ensure visual consistency at the component level instead: both tabs use the same card border-radius, the same surface and border tokens, the same section header typography (Inter 600, 14px, `--ink`, uppercase or sentence case - pick one and apply consistently across both tabs). Sentence case is recommended: "Sniffout Picks" not "SNIFFOUT PICKS."

### 3. Map view entry

**Assessment: Consistent in mechanism, needs a brief transition to feel less abrupt.**

Both tabs use the same list/map icon toggle. Both show the map below the header. The entry is consistent.

**One improvement:** when switching from list to map view, the current implementation presumably either cuts instantly or fades. A brief `opacity` fade on the outgoing list content (150ms, ease) before the map appears would make the switch feel more deliberate. This is the same principle as the tab switch transition in the earlier specs - a 4px translateY fade-up when content arrives. For map entry, a simple opacity fade (no translate) is sufficient since the map is a different type of content.

**Recommendation:** Apply a 150ms opacity fade when switching between list and map modes on both tabs. Both tabs must use identical transition duration and easing.

### 4. Map view bottom filter area

**Assessment: Inconsistent in control type, but acceptable. Inconsistent in visual container treatment - this should be fixed.**

The Walks tab uses a three-segment control (Picks | All | Green spaces) centered at the bottom. The Nearby tab uses a horizontal chip row (6 categories) at the bottom. These are different control types, and this difference is correct - three options versus six options warrant different controls. A six-option segmented control would be illegibly narrow.

The inconsistency that should be resolved is the visual container treatment. Currently there is no shared specification for what the bottom filter container looks like. Both should use identical container treatment:

- Background: `--surface` at 96% opacity
- `padding: 10px 16px 12px 16px` (extra bottom padding to separate from the nav)
- `border-top: 1px solid var(--border)` (separates filter area from map content above it)
- `box-shadow: 0 -2px 8px rgba(0,0,0,0.07)` (subtle upward shadow giving the container lift from the map surface - pointing upward means the shadow extends into the map area, creating visual separation)

Apply this identical container spec to both the Walks tab bottom filter and the Nearby tab bottom chips in map view. The content inside the container differs (segmented control vs chip row), but the container looks identical.

Dark mode: background `--surface` (#1F1F1F) at 96% opacity, border-top `--border` (rgba(255,255,255,0.08)), shadow `0 -2px 8px rgba(0,0,0,0.3)`.

### 5. Exit from map view

**Assessment: Consistent in mechanism, but exit affordance should be more explicit.**

Both tabs use the list icon in the header toggle to exit map view. Since the header remains visible in map view (the map fills the area below the header), the toggle is always accessible.

The current active state of the map icon button tells the user they are in map mode, and they tap the list icon to exit. This is correct.

**One improvement:** when in map view, the list icon in the toggle should have a visible label or a tooltip is not practical on mobile. Instead, the list icon button in its inactive state (the user is on the map, so list is inactive) should still have visible tap feedback and a slightly different treatment to indicate "tap here to go back to the list." The recommendation: in map mode, apply `--brand-tint` background to the list toggle button (the "return to list" button) to gently indicate it is the active exit point. This is a 28px x 28px rounded rectangle with `--brand-tint` background and `--brand` icon. The currently active map icon uses the same filled treatment. The contrast between the two states makes the return path obvious.

---

## Task 2 - Visual Quality Review

### 1. Header area

**Assessment: likely functional but requiring specific fixes to feel considered.**

The header must feel proportional. On a 375px mobile screen, a tab header should be approximately 60px tall to give breathing room without stealing screen space.

**Recommended header specification (applies identically to both Walks and Nearby tabs):**

- Total header height: 60px
- Title: Inter 700, 18px, `--ink`, left-aligned, `padding-left: 16px`
- Location line: Inter 400, 13px, `--ink-2`, left-aligned, directly below the title with `margin-top: 2px`
- Right-side controls: list/map toggle and filter icon, both right-aligned, `padding-right: 16px`, vertically centered in the header
- Each control button: 40px x 40px tap target (slightly below the 44px WCAG minimum but the paired adjacent placement gives adequate combined reach - if WCAG strictness is required, expand to 44px each with 8px gap between them)
- Gap between the two right-side controls: 4px
- Toggle icons: 20px Lucide SVG, `--ink` (inactive) / `--brand` (active)
- Filter icon: 20px Lucide `sliders-horizontal`, `--ink`
- Horizontal rule below header: 1px solid `--border` (separates header from content below)

The title and location line should be vertically centered as a unit within the header, not individually pinned to top or bottom.

### 2. Category chips (Nearby tab)

**Assessment: the chips need a complete design spec. Current state is likely default browser/CSS treatment.**

**Recommended chip specification:**

- Height: 34px
- Border-radius: 20px (full pill shape - this is the correct choice for horizontal scrolling filter chips on mobile. The pill shape reads as "tappable option" while the card border-radius (16px) reads as "content container." Using pill chips on cards creates a clear visual hierarchy: cards contain pills.)
- Horizontal padding: 14px
- Typography: Inter 600, 13px (weight 600 for chips - they are navigation elements and need to carry visual weight)
- Gap between chips: 8px
- Left padding on the chip row container: 16px (matches the page horizontal padding)
- Right padding on the chip row container: 16px (allow fade-out effect using a gradient mask to hint at scrollability - see below)

**Active chip state:**
- Background: `--brand` (#2C4A14)
- Text: white (#FFFFFF)
- Border: none

**Inactive chip state:**
- Background: `--surface` (#FFFFFF)
- Text: `--ink-2` (#6B6B6B)
- Border: 1px solid `--border`

**Dark mode active chip:** background `#3D6B22`, text white
**Dark mode inactive chip:** background `rgba(255,255,255,0.07)`, text `--ink-2`, border `--border`

**Scrollability hint:** apply a CSS gradient mask on the right edge of the chip row container. The mask fades from transparent (rightmost 20px of the container) to `--bg` colour, hinting that more chips exist off-screen. This is a CSS `mask-image` property on the row container - no JS needed.

**Chip row vertical spacing:** 12px above the chip row, 12px below it, separating it from the header above and the results count / card list below.

### 3. Bottom filter area in map view

**Assessment: needs a shared container spec - see Task 1 point 4 above.**

The container treatment is specified in Task 1 point 4 and applies to both tabs equally. Inside that container:

**Walks tab segmented control (three segments: Picks | All | Green spaces):**
- Width: full width minus 32px (16px each side within the container)
- Height: 34px (consistent with chip height)
- Container background: `rgba(0,0,0,0.06)` light / `rgba(255,255,255,0.08)` dark
- Border-radius: 10px
- Active segment: `--surface` background, `--ink` text, `box-shadow: 0 1px 3px rgba(0,0,0,0.15)`, border-radius 8px
- Inactive segments: transparent background, `--ink-2` text
- Typography: Inter 600, 13px
- Active indicator transitions with `transition: transform 180ms ease`

**Nearby tab chip row in map view:**
- Uses the same chip spec from point 2 above
- The row is horizontally scrollable within the container
- Same gradient mask on the right edge for scrollability hint
- The active chip (currently selected category) uses the active chip state (brand green fill)

Both containers use identical outer wrapper treatment. The controls inside differ, but the container they sit in is the same. A user switching between tabs sees the same bottom "shelf" on the map in both views.

### 4. Overall map view cohesion

**Assessment: close to cohesive, needs attention on the visual boundary between the header and map.**

When the map fills the space below the header, there is an implicit edge between the header (on `--bg`) and the map tiles. In light mode, the warm off-white header background meets the coloured OSM map tiles. This edge can feel arbitrary rather than designed.

**Recommendation:** add a 1px `--border` bottom edge to the header area (already recommended in point 1 above). This explicitly marks the transition from header chrome to map content. The 1px line is subtle but intentional.

The bottom filter container's `border-top: 1px solid var(--border)` does the same job at the bottom edge - both the header and the bottom container have defined edges against the map, creating a clear frame around the map area.

The map container background (visible before tiles load): `--bg` (#F7F5F0 light, `#1A1A1A` dark). This is already specified in prior specs.

No additional adjustments needed. The combination of defined header bottom edge, custom circular pins with white borders and shadows, spring-animated compact card on pin tap, and defined bottom filter container creates a cohesive map experience.

### 5. Venue cards (Nearby tab list view)

**Assessment: the current description suggests a horizontal thumbnail layout that is inconsistent with walk card quality. Improvement needed.**

The current venue card (small left-aligned image, name, distance, open/closed, "View on Google Maps" link) uses a horizontal layout that is functional but visually lighter than the walk cards. "View on Google Maps" as a text link is particularly weak - it reads as a placeholder, not a designed UI element.

The venue card should not copy the walk card layout (full-width top image with overlaid name). Venues are informational, not editorial. A horizontal layout with a square thumbnail is correct for venue cards.

**Recommended venue card specification:**

- Card: 16px border-radius, 1px solid `--border`, `--surface` background, 12px padding
- Thumbnail: 72px x 72px, border-radius 10px, left-aligned, `object-fit: cover`. If no image available, show a category-coloured placeholder rectangle using the same CSS gradient approach as walk cards but with the category colour rather than brand green.
- Content area (right of thumbnail): `margin-left: 12px`, flexes to fill remaining width

Content area from top to bottom:
1. Venue name: Inter 600, 15px, `--ink`, max 2 lines (ellipsis on overflow)
2. Category pill: Inter 500, 11px, 22px height, 6px horizontal padding, 6px border-radius, category-tint background, category-text colour. Immediately below the name with `margin-top: 4px`.
3. Distance: Inter 400, 13px, `--ink-2`, formatted via `formatDist()`, `margin-top: 6px`
4. Open/closed status: if available from API - "Open now" in `#2D7A3A` (Inter 500, 13px) or "Closed" in `--red` (Inter 500, 13px). Displayed on the same line as distance separated by a centre dot character. If status not available, omit entirely - do not show "Unknown."

Remove "View on Google Maps" text link from the card entirely. This link belongs in the compact map card (as "Get directions") and in the full venue action, not as an inline card element. The venue card itself is a browse item - the action comes after the user taps through.

The venue card is the tap target. Tapping anywhere on the card opens a venue detail view (Phase 2 scope) or triggers the compact pin card behaviour from the map. For Phase 1, tapping the card navigates to the venue on the map and highlights the pin.

**Dark mode venue card:** `--surface` (#1F1F1F), `--border` dark, `--ink`/`--ink-2` dark values. Category pills use reduced opacity backgrounds in dark mode: `rgba(255,255,255,0.08)` fill, category colour text.

---

## Task 3 - Map Pins Review and Improvement

### 1. Pin shape

**Confirmed: circular pins are the correct choice for Sniffout. Do not change.**

Teardrops: the pointed bottom implies a precise geographic ground point. Walk areas and venue locations are not precise points - they are destinations. The teardrop skeuomorphism creates false precision and feels visually heavy. Modern map apps (Airbnb, Wolt, Citymapper) have moved away from teardrops.

Rounded squares: read as notification badges or app icons rather than map locations. The association is wrong.

Custom shapes (paw prints, dog silhouettes): creative but add complexity to the DivIcon implementation, scale poorly, and contradict the clean brand language. CLAUDE.md reserves the paw motif for the safety block.

Circles are immediately legible as "location" without skeuomorphic pointing, are clean and scalable, accommodate colour differentiation clearly, and align with Sniffout's modern uncluttered visual language.

### 2. Pin size

**Recommended: keep visual size at 28px default and 36px selected. Extend the effective tap target to 44px via DivIcon sizing.**

The visual sizes (28px and 36px) are correct for map legibility. Larger pins would clutter the map at any zoom level above 10. Smaller pins would be hard to distinguish.

The WCAG 2.5.5 minimum tap target of 44px is currently not met by the 28px visual circle. The fix is to extend the Leaflet DivIcon's `iconSize` to 44px x 44px while keeping the visual circle centered within that 44px area via CSS. The transparent padding around the 28px circle absorbs taps without changing the pin's visual footprint.

Implementation note for Developer: set Leaflet `DivIcon` `iconSize` to `[44, 44]` and `iconAnchor` to `[22, 22]`. Style the inner visual circle as 28px, centered within the 44px element. The 8px padding on each side is invisible but tappable.

For the selected state: `iconSize` can stay at `[44, 44]` while the visual circle grows to 36px. The tap target remains 44px.

### 3. Nearby tab pin colour system

**Assessment: the three-colour system is clear within single-category views. Multi-category views need a legend.**

Within a single-category view (only cafes visible, only vets visible), the pin colour is self-labelled by the active chip at the bottom of the map. No legend needed in this state.

In the "All" multi-category view (if implemented), multiple pin colours appear simultaneously and a brief colour key is needed.

**Legend specification for multi-category view:**

When multiple categories are visible simultaneously, display a compact colour key overlaid in the top-left corner of the map:
- Position: `position: absolute; top: 12px; left: 12px` within the map container
- Background: `--surface` at 92% opacity
- Border-radius: 8px
- Padding: 8px 10px
- Shadow: `0 1px 4px rgba(0,0,0,0.15)`
- Content: one row per visible category, each row showing a 10px coloured circle (matching pin fill colour) and the category label in Inter 500, 12px, `--ink`, with 6px gap between circle and label, 4px gap between rows

This legend is only rendered when the active chip selection results in multiple category types being displayed simultaneously. When a single category is selected, remove the legend element entirely (do not hide with `opacity: 0` - remove from the DOM or set `display: none` to avoid interfering with map interaction).

**Current category colours confirmed:**
- Cafes and pubs: amber (`--amber`, #B07A28 light)
- Vets: `#C04040` (healthcare red, distinct from `--red` error colour)
- Green spaces: `#4A7A5A` (mid forest green, distinct from brand dark green)

If pet shops are added as a visible category (Nearby tab shows "Pet Shops" in the chip list), assign them: `#6B5EA8` (a muted purple - immediately distinct from the three existing colours, and purple has no existing meaning in the Sniffout colour system to conflict with).

"Saved" venues (the "Saved" chip on the Nearby tab) show previously saved venues regardless of type. Saved venue pins use `--brand` (#2C4A14) with a white star icon centred inside the pin (16px Lucide `star-icon` or filled star shape). This differentiates saved pins visually from category pins by combining colour and iconography.

### 4. Selected pin state

**Recommendation: white outer halo via box-shadow. No pulse animation.**

The current size-only selected state (28px to 36px) is insufficient visual feedback on a map where multiple pins are close together. A user tapping a pin in a cluster may not notice which pin is now active based on size alone.

**Selected pin specification:**

Add a white outer ring to the selected pin using `box-shadow`:
```
box-shadow: 0 0 0 4px rgba(255,255,255,0.92), 0 2px 10px rgba(0,0,0,0.38);
```

The first shadow value creates a 4px solid-feeling white ring around the 36px pin. The second shadow is the standard depth shadow. Combined, the selected pin appears as: brand coloured circle (36px), white ring (4px), drop shadow. This is immediately readable as "the active pin" even against busy map tiles and adjacent unselected pins.

In dark mode, the white ring remains white (rgba(255,255,255,0.92)) - this is correct, as the white ring reads against any map tile brightness in either mode.

**No pulse animation.** A CSS animation on a map marker is distracting when multiple pins are visible. The static halo is sufficient and consistent with the brand's "nothing gimmicky" principle from CLAUDE.md.

The selected pin transition from unselected to selected applies the standard tap feedback rule and the size change simultaneously: `transition: width 150ms ease, height 150ms ease, box-shadow 150ms ease`.

### 5. Zoom threshold vs alternatives

**Recommendation: keep the zoom threshold approach. Improve to zoom level 8. Improve the overlay message.**

The zoom threshold (below zoom N, hide all pins and show a message) is the correct approach given the clustering plugin is deferred. It is clean, requires no external library, and produces a clear user experience.

The current threshold of zoom level 9 is slightly aggressive - at zoom 9 on a 375px screen, the visible area is roughly a single county (e.g., West Yorkshire). A user zooming out to see a broader region (e.g., "what walks are in the North of England?") sees nothing at zoom 8 even though a sensible result set would exist.

**Lower the threshold to zoom level 8.** At zoom 8, the visible area on a 375px screen covers approximately two to three counties - a reasonable geographic context. Walk pins are still distinguishable at this zoom level if not too many are in the same small area.

**Improved zoom overlay message:**

Current: "Zoom in to see walks" with `zoom-in` icon.

Recommended update:
- Icon: Lucide `map-pin`, 24px, `--ink-2`
- Headline: "Zoom in to see walks nearby" - Inter 600, 15px, `--ink`
- Body: "Pinch to zoom into any area." - Inter 400, 13px, `--ink-2`, `margin-top: 4px`

The added "nearby" clarifies that walks do exist - the user just needs to zoom in to the area they are interested in. "Pinch to zoom" is a helpful gesture hint for users who may not know how to zoom a Leaflet map.

Overlay container: same spec as the empty state overlay from designer-brief-march-24-spec.md Task 3 point 6 - `--surface` at 92% opacity, 12px border-radius, 20px padding, max-width 260px, centered in the map area.

---

## Task 4 - Walk Detail Overlay: Duplicate Title and Image Proportion

### Item A - Remove duplicate walk name

**Remove the walk name text heading from the content area below the image. Do not replace it with another heading.**

The walk name is already present in the hero image at `bottom: 14px, left: 16px` in Fraunces 700 26px white. Repeating it immediately below the image creates visual redundancy - the user reads the same text twice within 30px of scroll distance.

**First element in the content area below the image:**

A stats row. This is the correct first element because after seeing the walk name and the landscape photo, the user's immediate question is: "how long is this walk and how hard is it?" The stats row answers this before the description or any other detail.

**Stats row specification:**

- Background: `--surface`
- `border-top: 1px solid var(--border)` (provides a clean visual transition from the image gradient to the content area)
- Padding: 14px 16px 14px 16px
- Four items in a single horizontal row with `gap: 16px`, `align-items: center`

Item 1 - Distance:
- Lucide `route` icon, 16px, `--ink-2`, inline with text
- Value: formatted via `formatDist()`, Inter 600, 14px, `--ink`
- 4px gap between icon and value

Item 2 - Duration:
- Lucide `clock` icon, 16px, `--ink-2`
- Value: minutes formatted as "Xh Ym" or "X min" as appropriate, Inter 600, 14px, `--ink`

Item 3 - Difficulty:
- No icon - difficulty uses a coloured text label for immediate scannability
- "Easy" in `#2D7A3A` (green) / "Moderate" in `--amber` (#B07A28) / "Hard" in `--red` (#EF4444), Inter 600, 14px

Item 4 - Off-lead:
- Lucide `dog` icon if available, otherwise `circle-check`, 16px, colour matching off-lead status (brand green for full, amber for partial, muted `--ink-2` for on-lead)
- "Full off-lead" / "Partial" / "On-lead", Inter 500, 13px, matching colour

This stats row is not a card - it is flush within the content area of the overlay, sharing the `--surface` background. No separate border-radius or card treatment.

**The second element below the stats row:** the walk description text, in Inter 400, 15px, `--ink`, line-height 1.55, with 16px horizontal padding and 12px top margin from the stats row.

### Item B - Hero image proportion

**1. Recommended proportion**

On a 375px x 812px viewport: 320px for the image container.

320px represents 39.4% of the 812px viewport height. This is the right proportion for an immersive hero moment that still leaves enough visible below to communicate scrollable content.

At 320px:
- The walk name overlaid at `bottom: 14px` sits 14px above the image bottom - ample breathing room within a 320px image
- The stats row and the start of the description text are visible below the image when the overlay opens (assuming the overlay itself occupies approximately 90% of the viewport height - approximately 731px - the 320px image leaves 411px for the content area, of which the top 100px are visible before the user scrolls)
- The "scroll to read more" affordance is clear without requiring a "scroll down" indicator

On viewports with `window.innerHeight` below 620px (compact Android phones): use 240px container height. This is 40% of 600px - the same proportional feel on smaller screens.

**2. Container height recommendation**

- Standard (viewport height 620px or above): **320px container height**
- Compact (viewport height below 620px): **240px container height**

Implement as a conditional set on component render using `window.innerHeight`.

**3. Image-to-content transition**

**Recommendation: keep the dark gradient on the image (specified in designer-brief-march-24-spec.md Task 5 point 4) and add a 1px top border on the content area. No additional fade effect needed.**

The gradient over the image already handles the visual transition at the image bottom. The 1px `border-top: 1px solid var(--border)` on the content area stats row (specified in Item A above) marks the explicit division between image and content. This is clean and intentional.

Do not add a white-to-transparent gradient at the top of the content area. The 1px border is sufficient and avoids the visual complexity of a second gradient layer interacting with the first.

In dark mode: the `--border` border-top on the content area is `rgba(255,255,255,0.08)` - this provides a visible but subtle line against the `#1F1F1F` content surface.

**4. Parallax image height with updated container**

The parallax ratio remains 0.5 (unchanged from designer-brief-march-24-spec.md). The travel room (the extra height of the image element beyond the container) should remain at 80px. This preserves the exact parallax behaviour and prevents jarring changes to the scroll feel.

Updated image heights:
- Standard container (320px): image element height = **400px** (320px container + 80px travel room)
- Compact container (240px): image element height = **320px** (240px container + 80px travel room)

The 80px travel room at a 0.5 parallax ratio means the parallax effect reaches its maximum displacement when the user has scrolled 160px of content. Walk detail overlays have substantially more scrollable content than 160px, so the parallax effect will be active for the full meaningful scroll range.

Both `container height` and `image element height` values update based on the same `window.innerHeight` conditional. The Developer sets both values in the same check.

**Image `object-fit` and `will-change`:** unchanged from prior spec. `object-fit: cover` on the image element. `will-change: transform` on the image element for GPU compositing.

---

## Summary

**Task 1 - Consistency audit:** Headers are structurally consistent - the filter icon's role should be verified to confirm it is not redundant on the Nearby tab. List view differences are justified by content type and should be preserved. The bottom filter container treatment (background, border-top, shadow) must be identical across both tabs - this is the main consistency fix required.

**Task 2 - Visual quality:** Category chips need a full spec: 34px height, 20px border-radius (pill), Inter 600 13px, brand green fill for active. Venue cards need restructuring to match walk card quality: 72px square thumbnail, Inter 600 name, category pill, distance, open status, no "View on Google Maps" link. Header spec: 60px height, Inter 700 18px title, 1px bottom border.

**Task 3 - Map pins:** Circular pins confirmed as correct. Extend DivIcon `iconSize` to 44px x 44px to meet WCAG 2.5.5 while keeping visual circle at 28px. Add white outer halo to selected state via `box-shadow: 0 0 0 4px rgba(255,255,255,0.92), 0 2px 10px rgba(0,0,0,0.38)`. Lower zoom threshold from 9 to 8. Add legend overlay in multi-category map view.

**Task 4 - Walk detail overlay:** Remove duplicate walk name heading from content area below image. First content element becomes the stats row (distance, duration, difficulty, off-lead) with 1px border-top separator. Increase hero container to 320px (from 260px) on standard viewports, with image element at 400px (maintaining 80px parallax travel room). 240px container / 320px image on compact viewports below 620px height.

---

*Document ends.*
*Saved: docs/specs/designer-brief-march-25-spec.md*
*Date: 25 March 2026*
*Status: Ready for Developer implementation. No app files were edited in producing this spec.*
