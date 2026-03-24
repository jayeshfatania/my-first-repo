# Designer Brief - Me Tab, FAB, Map Views, Walk Detail Overlay
**Date:** 24 March 2026
**Author:** Designer
**Status:** Ready for Developer implementation
**Scope:** Spec only - no app files edited. Developer implements from this document.

---

## Notes before starting

**CSS token discrepancy:** CLAUDE.md currently records `--brand: #3B5C2A`. The design elevation spec (docs/specs/design-elevation-spec-march-23.md) and this brief both use the updated palette with `--brand: #2C4A14`. The Developer should implement using the values in this brief. The brand colour token update and the Fraunces CDN import should be treated as prerequisites for this round, or implemented as the first step of this round before the tasks below.

**Fraunces prerequisite:** Several specs below reference Fraunces as the display typeface. If Fraunces is not yet imported, the Developer adds this to `<head>` before implementing any Fraunces usage:
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap
```
And sets `--font-display: 'Fraunces', serif` as a CSS variable.

**Marker clustering:** CLAUDE.md explicitly defers the marker clustering plugin. Task 3 and Task 4 address this constraint directly.

**Tap feedback rule:** Every interactive element specced below must include `transition: transform 0.15s ease` and `transform: scale(0.97)` on `:active`. This is stated here once and applies to all elements across all tasks without exception.

---

## Task 1 - FAB (Floating Action Button) on Me Tab

### 1. Icon

**Recommendation: `plus` (Lucide icon)**

The FAB opens the walk log sheet - the action is "add a walk entry." The `plus` icon is the universal symbol for this action and is immediately understood by Android Chrome users who are familiar with FAB conventions from Gmail, Google Maps, and other installed apps. It is unambiguous.

Rejected alternatives:
- `pencil` - implies editing an existing item, not creating
- `book-open` - implies reading or browsing the journal, not adding to it
- `footprints` or `paw-print` - CLAUDE.md reserves the paw emoji for the paw safety block only; applying the same restraint to paw iconography in non-safety contexts is consistent with the brand rule

Icon size inside the FAB: 24px, stroke width 2px, colour white (#FFFFFF).

### 2. Size

**Diameter: 56px**

56px is the Material Design standard FAB diameter and is the right size for this context. It is large enough to be confident and easy to tap (exceeds the 44px WCAG 2.5.5 minimum with room to spare), and small enough not to dominate the tab visually. The Me tab content is primarily text and tiles - a 64px FAB would feel oversized relative to the content weight.

### 3. Position

**Bottom offset from viewport: 88px**
**Horizontal position: centered (left: 50%, transform: translateX(-50%))**

Calculation:
- Bottom nav height: 64px
- Gap between FAB bottom edge and nav top edge: 24px (generous visual breathing room - 16px would be minimum, 24px feels considered)
- FAB bottom offset: 64 + 24 = 88px from the bottom of the viewport

The 88px offset means the FAB's bottom edge is 24px above the top of the bottom nav. The FAB center sits at 88 + 28 = 116px from the bottom of the viewport. This is visually distinct from the nav and does not look cramped.

The FAB is `position: fixed` (not `position: sticky`), ensuring it remains in position regardless of scroll depth.

### 4. Visual treatment

**Shadow: Yes**

```
box-shadow: 0 4px 12px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.14);
```

The multi-layer shadow creates the physical lift that distinguishes a FAB from a standard button. The outer shadow (12px blur) creates depth at a distance. The inner shadow (4px blur) adds crispness at the edge. Both are necessary - a single shadow layer feels flat on mid-range Android screens.

**Border in light mode: none**

The brand green on the off-white background has sufficient contrast. A border would add visual noise.

**Border in dark mode: 1px solid rgba(255,255,255,0.12)**

On the dark (#141414) background, the brand green FAB at #3D6B22 needs the additional definition of a subtle white border to prevent it from visually merging with dark content beneath it. 12% white opacity is sufficient - barely perceptible but effective.

**Background:**
- Light mode: `#2C4A14` (matches `--brand`)
- Dark mode: `#3D6B22` (as specified in brief - not `--brand` dark mode value of #6A9B4A, which is for text and icons only)

### 5. Fade and scroll behaviour

**Recommendation: Yes, implement fade on scroll**

Rationale: the Me tab will grow as users accumulate walk log entries and badges. The FAB must not permanently obscure content. Fade-on-scroll also signals that the FAB is aware of the user's current action - it respects their reading/browsing state.

**Behaviour specification:**

- When the user begins scrolling the Me tab content, the FAB transitions to `opacity: 0` and `transform: translateX(-50%) scale(0.88)` simultaneously
- The transition uses `transition: opacity 180ms ease, transform 180ms ease`
- When scrolling stops (no scroll event for 250ms), the FAB transitions back to `opacity: 1` and `transform: translateX(-50%) scale(1)` using the same transition

**Scroll logic in plain English for the Developer:**

1. Attach a `scroll` event listener to the Me tab's scrollable content container (not `window`)
2. On each scroll event, immediately set a `scrolling` flag to true and apply the hidden state (opacity 0, scale 0.88)
3. Clear any existing timeout and set a new `setTimeout` for 250ms
4. When the timeout fires (meaning no scroll event occurred for 250ms), remove the `scrolling` flag and apply the visible state (opacity 1, scale 1)
5. The `pointer-events: none` CSS property should be applied alongside `opacity: 0` to prevent accidental taps while the FAB is invisible

Note: the FAB should start in the visible state. It only fades when the user actively scrolls.

### 6. Icon colour

**White (#FFFFFF), full opacity**

No reduced opacity. No tinting. Pure white at full opacity. The contrast ratio of white on #2C4A14 (the brand green FAB background) exceeds WCAG AA for large visual elements at this size. The same applies to white on #3D6B22 in dark mode.

---

## Task 2 - Me Tab Overall Layout Review

### 1. Dog profile card - 48px dog name and visual anchoring

The 48px Fraunces 700 dog name is correct and should be kept. It is the largest text element on the tab and acts as the personal identity anchor for the Me tab. It does not create visual imbalance - it creates intentional hierarchy.

**Required: the dog profile card must be a defined surface, not floating text**

The dog name and avatar should sit inside a card container with the following treatment:
- Background: `--surface` (#FFFFFF light / #1F1F1F dark)
- Border: 1px solid `--border`
- Border-radius: 16px (consistent with all other cards)
- Padding: 20px top, 20px bottom, 20px left and right

The card layout within the container:
- Dog avatar circle: 64px diameter, centered horizontally
- Gap between avatar and name: 12px
- Dog name: Fraunces 700, 48px, `--ink`, centered, `line-height: 1.1`
- Breed/age line: Inter 400, 13px, `--ink-2`, centered, `margin-top: 4px`
- Card total height: approximately 196px (20 top + 64 avatar + 12 gap + ~57px name + ~20px breed + 20 bottom + border)

**Long name handling:** Apply `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%` to the name element. Names over approximately 14 characters at 48px Fraunces will risk overflow on 375px viewports. The ellipsis prevents layout breakage and keeps the line clean.

**Do not** apply a `--brand-tint` background to the dog profile card. The `--brand-tint` tint would read as a promotional banner rather than an identity surface. The Fraunces 700 at 48px is the visual signal - the card surface should be neutral `--surface` white.

**Top margin:** 16px from the top of the scrollable content area to the top edge of the dog profile card. This creates breathing room between the top of the screen and the card.

### 2. Stat tiles - balance with the dog name

The three stat tiles (km walked, walks logged, condition reports) in a row are correctly sized relative to the 48px dog name. The hierarchy reads: dog identity (48px Fraunces) > personal stats (numbers at a smaller size) > navigation rows below.

**Stat tile number size: 28px**

- Numbers: Inter 700, 28px (Fraunces if Fraunces is available - acceptable either way), `var(--brand)` colour (light) / `#6A9B4A` (dark)
- Labels: Inter 400, 12px, `--ink-2`
- Tile padding: 16px top and bottom, equal horizontal padding within each tile (tiles use `flex: 1`)
- Gap between dog profile card and stat tiles: 12px
- The three tiles sit in a horizontal row, full width, sharing a single card container (1px `--border` border, 16px border-radius) with internal dividers between the tiles rather than three separate cards. A full-width card with internal vertical dividers (1px `--border`) looks more considered than three floating equal-width cards.

No change to the established colour rule: primary stat numbers use `var(--brand)` in light mode and `#6A9B4A` in dark mode. This is confirmed in CLAUDE.md and maintained here.

### 3. FAB overlap - bottom padding

**Bottom padding on scrollable content container: 96px**

Calculation:
- FAB bottom offset: 88px from viewport bottom
- FAB height: 56px
- FAB top edge: 88 + 56 = 144px from viewport bottom
- Bottom nav height: 64px
- Content needs to scroll clear of the FAB: 144 - 64 = 80px above the nav for the FAB top
- Adding 16px generous breathing room: 96px total padding-bottom on the scrollable container

This ensures that when the user scrolls to the very bottom of the Me tab content, the last row (Settings) is fully visible above the FAB without any overlap. The Settings row does not get hidden behind the button.

Apply `padding-bottom: 96px` to the scrollable wrapper div of the Me tab content, not to individual rows.

### 4. Additional layout observations

**One observation worth addressing before beta launch:**

The walk journal row, recently viewed row, badges row, and settings row appear to be navigation entry rows (tappable rows that open sub-views). These rows should have consistent height (minimum 52px per row - exceeding the 44px WCAG 2.5.5 tap target requirement with appropriate padding) and a right-pointing chevron (`chevron-right`, 16px, `--ink-2`) aligned to the right edge. If these chevrons are currently text characters (`>`) rather than Lucide icons, replace them. This is referenced in the UX review (M3) as a known issue.

No other layout issues require addressing before beta launch. The top-to-bottom structure (profile card, stat tiles, nav rows) is correct and does not need restructuring.

---

## Task 3 - Map View on Walks Tab

### 1. Map container

**Recommendation: full height below the filter bar**

The map fills the full available height between the filter bar and the bottom nav. There is no list view visible simultaneously. The list/map toggle switches completely between the two modes.

Exact height: `calc(100vh - [filter bar height] - 64px)` where filter bar height is measured from the current implementation (approximately 56px, giving a map height of roughly `calc(100vh - 120px)`).

Rationale: a split-screen map/list is a reasonable pattern but on a 375px wide mobile screen the map portion becomes too small to navigate usefully if the list occupies the bottom third. Full height gives the map enough room to be genuinely useful. The compact walk card on pin tap (spec below) provides the list context without requiring a permanently visible list panel.

### 2. Walk pins

**Custom circular DivIcon - do not use default Leaflet markers**

Default Leaflet orange teardrops are visually incompatible with Sniffout's clean card-based design language. Custom pins must be implemented as Leaflet `DivIcon` with CSS styling.

**Default pin (unselected):**
- Shape: filled circle
- Diameter: 28px
- Fill colour: `--brand` (#2C4A14 light, #3D6B22 dark mode - same rule as FAB)
- Border: 2px solid #FFFFFF
- Shadow: `0 1px 4px rgba(0,0,0,0.28)`
- No label text inside the pin

**Selected pin (tapped/active):**
- Diameter: 36px
- Fill colour: `--brand` (#2C4A14)
- Border: 3px solid #FFFFFF
- Shadow: `0 2px 8px rgba(0,0,0,0.35)`
- The selected pin should also be brought to the top z-index so it is never obscured by adjacent pins

**Tap transition:** when a pin is tapped, the transition from 28px to 36px should be animated using CSS `transition: width 150ms ease, height 150ms ease` so the selection feels physical rather than instantaneous.

**Anchor point:** the pin is a circle, so the Leaflet `iconAnchor` should be set to the center of the circle (14px, 14px for the 28px default size), not the bottom-center as the default marker uses.

### 3. Walk card on pin tap

**Pattern: compact bottom card sliding up from the bottom of the map area**

When a pin is tapped, a compact walk card slides up from the bottom of the map container (above the bottom nav). The card is not a full bottom sheet - it is a partial reveal showing approximately 180px of content above the bottom nav.

**Animation:** slides up with `cubic-bezier(0.34, 1.56, 0.64, 1)` (the standard Sniffout spring easing). Duration: 280ms. When dismissed, slides down with `ease` at 200ms (no spring on exit - exits should be quick and direct).

**Card dimensions:**
- Width: full viewport width minus 16px left and 16px right margin
- Visible height: 180px above the bottom nav top edge
- Background: `--surface`
- Border: 1px solid `--border`
- Border-radius: 16px 16px 0 0 (rounded top, flat bottom against the nav)
- Padding: 16px all sides

**Card content (from top to bottom within 180px):**

1. Walk name: Fraunces 600, 19px, `--ink`, single line (truncate with ellipsis if over ~30 characters at this size)
2. Location string: Inter 400, 13px, `--ink-2`, single line, `margin-top: 4px`
3. Tags row: three small pills at `margin-top: 10px` - distance (formatted via `formatDist()`), difficulty badge (Easy/Moderate/Hard), off-lead status (Full/Partial/None). Each pill: Inter 500, 12px, `--brand-tint` background, `--brand` text in light mode; `rgba(255,255,255,0.08)` background, `--brand` dark text in dark mode. Pill height: 24px, horizontal padding: 8px, border-radius: 6px
4. "View walk" CTA button: full width, 44px height, `--brand` background, white Inter 600 14px label, border-radius 10px, `margin-top: 12px`. Tap opens the full walk detail overlay.

**Dismiss behaviour:**
- Tap anywhere on the map outside the card
- Swipe down on the card (100px downward threshold)
- Tapping a different pin dismisses the current card and shows the new pin's card

**Scroll within card:** the 180px compact card should not have internal scrolling. All content fits within 180px at the spec above. If it does not fit on a specific walk, truncate - do not add a scroll.

### 4. Clustering

**CLAUDE.md defers the marker clustering plugin. Do not implement a clustering plugin in this round.**

Without clustering, implement a zoom-based pin visibility threshold instead:

- Below map zoom level 9 (showing a regional or national view): hide all walk pins entirely and show a centered overlay message: "Zoom in to see walks" in Inter 500, 15px, `--ink`, with a Lucide `zoom-in` icon at 20px above the text. The overlay has a `--surface` background (90% opacity), 12px border-radius, 16px padding, centered in the map area.
- At zoom level 9 and above: show all walks within the current map bounds (the existing `renderWalks()` map mode logic handles this)

This prevents the visual mess of overlapping pins at wide zoom levels without requiring the deferred plugin. Document this as a known limitation: clustering plugin approved and implemented at a future phase.

### 5. Dark mode

**Map tiles:**
Leaflet's default OpenStreetMap tile layer cannot be styled via CSS tokens. Apply the following CSS to the tile layer in `body.night`:

Target class: `.leaflet-tile-pane`
Filter: `brightness(0.75) contrast(1.05)`

This reduces tile brightness by 25% and increases contrast slightly in dark mode. It is an imperfect compromise - the tiles will still be visibly lighter than the surrounding interface - but it is the least-intrusive available approach without switching tile providers. Flag this to the Developer as a known limitation for a future tile provider change.

**Map container background** (the area visible before tiles load or in areas with no tiles):
- Light mode: `--bg` (#F7F5F0) - already the page background, requires no change
- Dark mode: `#1A1A1A` (slightly lighter than `--bg` dark of #141414 to differentiate the map container from the page background)

**Walk pins in dark mode:**
- Default pin: #3D6B22 fill, white border (same as FAB dark mode)
- Selected pin: #3D6B22 fill, white border, same shadow

**Compact walk card in dark mode:**
- Background: `--surface` (#1F1F1F)
- Border: `--border` (rgba(255,255,255,0.08))
- Text: `--ink` and `--ink-2` dark values
- Tags: `rgba(255,255,255,0.08)` background, `#6A9B4A` text (brand dark)
- CTA button: #3D6B22 background, white text

### 6. Empty state on the map

**When no walks match the active filters:**

Show a centered overlay panel on the map surface. Specification:
- Background: `--surface` at 92% opacity
- Border-radius: 12px
- Padding: 20px
- Max-width: 260px
- Centered in the map area (both horizontally and vertically within the map container)

Content:
- Lucide icon: `map-pin-off`, 28px, `--ink-2`
- Headline: "No walks match your filters" in Inter 600, 15px, `--ink`, `margin-top: 10px`
- Body: "Try adjusting your filters above." in Inter 400, 13px, `--ink-2`, `margin-top: 4px`

The map tiles should be partially visible behind the overlay - do not use a full-screen opaque blocker. The user can see they are still on the map and can interact with it (zoom, pan) to see if the issue is geographic.

---

## Task 4 - Full Screen Nearby Map

### 1. Entry point

**Location: expand icon in the top-right corner of the inline Nearby map**

A small control button positioned inside the inline map, 8px from the top edge and 8px from the right edge. This placement mirrors Google Maps' full-screen button - users who have used any map app will recognise it immediately.

**Button specification:**
- Size: 32px x 32px (tap target is sufficient given the clear visual hit area and the low-risk nature of the action)
- Shape: rounded rectangle, border-radius 6px
- Background: `--surface` (#FFFFFF light, #1F1F1F dark)
- Border: 1px solid `--border`
- Shadow: `0 1px 4px rgba(0,0,0,0.2)` - the button must be visually distinct from the map tiles beneath it
- Icon: Lucide `expand` (or `maximize-2` if expand is unavailable), 16px, `--ink`
- When in full screen mode, the same button position shows the `minimize-2` or `shrink` icon to indicate that tapping will exit full screen

Do not add a separate full-screen button in the Nearby tab header. The header is already busy with filters and category chips. The in-map button is the right pattern.

### 2. Full screen layout

**When the expand button is tapped:**

1. The map transitions to full screen. The transition is a simple opacity/scale: `opacity: 0 to 1` over 200ms with `transform: scale(0.98) to scale(1)` - no complex animation. Speed is appropriate here; this is a mode switch, not an emotional moment.
2. The bottom navigation bar hides entirely: `transform: translateY(64px)` with `transition: transform 200ms ease`. It does not remain visible as an overlay - it is fully removed from view.
3. The full-screen map container: `position: fixed; inset: 0; z-index: 200` (above all page content, below any modal sheets).
4. A category filter bar pins to the top of the full-screen map: the existing venue category chips (cafe, vet, green space) in a horizontal scrolling row with `padding: 8px 12px`. Background: `--surface` at 95% opacity. The chips allow the user to change category without exiting full screen. Total height of this filter bar: 48px.
5. The close/exit button: occupies the same position as the expand button (top-right corner, 8px from each edge) but now shows the `minimize-2` icon (or the same icon as the expand button, which toggles). No additional close button is needed - the one-button toggle pattern is sufficient.

**Full screen map height:** `100vh` (full viewport height). The category filter bar overlays the top of the map with a semi-transparent background so it does not reduce the map height.

### 3. Venue pins

**Use the same circular DivIcon system as the Walks tab, with category-specific fill colours**

**Cafe/food venue pins:**
- Default: 28px circle, fill `--amber` (#B07A28 light, #C08B38 dark - slightly lighter amber for dark mode legibility), white 2px border, `0 1px 4px rgba(0,0,0,0.28)` shadow
- Selected: 36px, white 3px border, stronger shadow

**Vet pins:**
- Default: 28px circle, fill `#C04040` (a healthcare red, distinct from the error `--red`), white 2px border
- Selected: 36px, white 3px border

**Green space pins:**
- Default: 28px circle, fill `--brand-mid` (#3D6520 light, #4A7830 dark), white 2px border
- Selected: 36px, white 3px border

**Using colour differentiation rather than icons inside the pin:** at 28px pin diameter with a 2px white border, the usable interior is approximately 20px. Lucide icons at 10-12px are generally legible but require testing at this size on a mid-range Android screen. Colour differentiation alone is sufficient for three category types and is more reliable across screen densities. Omit icons inside the pins.

All pins follow the same tap transition (28px to 36px at 150ms ease) as the Walks tab pins.

### 4. Venue card on pin tap

**Same compact bottom card pattern as Task 3 with venue-specific content**

The card slides up in the same position (above the bottom nav - but note: in full screen mode the bottom nav is hidden, so the card slides up from the bottom of the screen). When the nav is hidden, the card bottom sits at the bottom edge of the screen with no gap below.

**Card content (from top to bottom within 180px visible area):**

1. Venue name: Fraunces 600, 19px, `--ink`, truncate at approximately 30 characters with ellipsis
2. Category type tag: single pill ("Cafe", "Vet", "Green Space") in Inter 500, 12px, category-appropriate colour background (amber tint for cafe, light red tint for vet, brand-tint for green space), `margin-top: 4px`
3. Distance from user: Inter 400, 13px, `--ink-2`, formatted via `formatDist()`, `margin-top: 8px`
4. Open/closed status (if available from the Google Places API response): "Open now" in green (#2D7A3A) or "Closed" in `--red`, Inter 500, 13px, displayed on the same line as distance separated by a center dot character. If the API does not return open/closed status, omit this entirely - do not show "Unknown."
5. "Get directions" button: full width, 44px height, white background, `--brand` border (1px solid), `--brand` text (Inter 600, 14px), border-radius 10px, `margin-top: 12px`. Tapping opens the device's native maps app via a `geo:` URI or a `maps.google.com` URL as fallback.

Note: venues do not have a Sniffout detail overlay. There is no "View venue" CTA. "Get directions" is the primary action.

**Dismiss behaviour:** same as Task 3 - tap map outside card, swipe down (100px threshold), or tap a different pin.

### 5. Return to list / exit full screen

**Two exit mechanisms:**

**Mechanism A (primary): the minimize icon button**
The top-right corner button (same position as the expand button) shows the collapse icon. Tapping it reverses the full screen animation (opacity fade, bottom nav slides back in) and returns to the inline map view.

**Mechanism B (secondary): hardware back button on Android**
When entering full screen mode, the Developer pushes a history state via `history.pushState()`. When the user presses the Android hardware back button, the `popstate` event fires, and the full screen mode exits without navigating away from the Nearby tab. This is a required behaviour - without it, Android users pressing back will exit the entire Nearby tab or close the app.

**Do not implement swipe-down to exit.** The full screen map fills the whole screen and swipe-down gestures on the map will conflict with Leaflet's default pan behaviour. The two mechanisms above (button + back button) are sufficient.

### 6. Dark mode

**Tiles:** Same `filter: brightness(0.75) contrast(1.05)` on `.leaflet-tile-pane` in `body.night` as Task 3.

**Category filter bar in full screen (dark mode):**
- Background: `#1F1F1F` at 95% opacity
- Category chip backgrounds: `rgba(255,255,255,0.08)`
- Category chip text: `--ink` (#F4F2EE)
- Active chip: `#3D6B22` background, white text

**Expand/minimize button in dark mode:**
- Background: `--surface` (#1F1F1F)
- Border: `--border` (rgba(255,255,255,0.08))
- Icon: `--ink` (#F4F2EE)
- Shadow: `0 1px 4px rgba(0,0,0,0.5)` (heavier shadow needed in dark mode to separate from dark map background)

**Venue card in dark mode:** same dark surface treatment as Task 3 compact walk card. Background `--surface` (#1F1F1F), border `--border`, text `--ink`/`--ink-2` dark values.

---

## Task 5 - Parallax Hero Image on Walk Detail Overlay

### 1. Should parallax be implemented?

**Yes.**

Assessment: `background-attachment: fixed` CSS parallax is not suitable here because it only works on the document scroll, not inside a scrollable container. The walk detail overlay is a `position: fixed` bottom sheet with its own internal scroll - `background-attachment: fixed` would have no effect.

However, a JavaScript-driven `transform: translateY()` parallax using a scroll listener on the overlay's internal container is suitable and performant on modern Android Chrome. The key conditions are: (a) apply only `transform` (GPU-composited, no layout recalculation), (b) use `will-change: transform` on the image element to promote it to its own compositor layer, (c) keep the scroll calculation arithmetic simple (one multiplication, one assignment). These conditions are met by the spec below.

The visual payoff is real: a walk photo that subtly moves as the user scrolls creates depth and reinforces the sense that the walk exists in physical space. It is the correct treatment for a product that is selling outdoor experiences.

If scroll jank is observed on the test device (Android Chrome, mid-range phone) after implementation, the Developer should add a `prefers-reduced-motion` media query check and disable parallax when the user has requested reduced motion. This is a quality fallback, not an anticipated problem.

### 2. Parallax behaviour

**The image moves up at half the speed of the content scroll.**

When the user scrolls the overlay content down by 1px, the hero image element moves up by 0.5px. The visual effect: the landscape gradually reveals itself from the bottom of the image frame as the user reads down through the walk details, giving the sense of descending into the walk description.

**Implementation in plain English for the Developer:**

1. The hero image container has `overflow: hidden` and a fixed height (specified in point 3 below). The container does not scroll.
2. The image element inside the container is taller than the container (approximately 130% of the container height - see point 3). It starts positioned to show the top portion of the image. The extra height at the bottom provides the downward travel range.
3. The image element has `will-change: transform` applied in CSS. This promotes it to a GPU compositor layer and prevents layout recalculation on each scroll update.
4. A `scroll` event listener is attached to the overlay's scrollable content wrapper (the element that the user scrolls to read the walk details - not `window`).
5. On each scroll event, the listener reads `scrollTop` from the scrollable container and applies `transform: translateY(${scrollTop * -0.5}px)` to the image element. The negative sign moves the image up as scroll increases. The 0.5 multiplier is the parallax ratio.
6. The Developer may optionally throttle this to `requestAnimationFrame` for performance, but in practice `scroll` event-driven `transform` updates on a `will-change` element are smooth on Android Chrome without throttling.
7. When the overlay closes (dismissed), remove the scroll event listener to avoid memory leaks.

**Parallax ratio:** 0.5 (image moves at half scroll speed). Do not increase this - higher ratios cause the image to exit the container frame prematurely on longer scroll distances.

### 3. Image container height

**Container height: 260px**
**Image element height: 340px (approximately 130% of container)**

The 260px container height is the visible area. It is substantially more immersive than the ~200px used on walk list cards and is appropriate for a detail view.

The 340px image height provides 80px of parallax travel. At a 0.5 ratio, the user would need to scroll 160px of content for the image to reach its maximum upward travel. Walk detail content is long enough that this will be reached on most walks.

On devices with `window.innerHeight` below 600px: reduce both values proportionally. Container: 220px, image: 290px. The Developer should check `window.innerHeight` on load and apply the smaller values if below 600px.

**Image `object-fit`:** `cover`. The image fills the 340px height container width at full width, cropping if necessary. Do not use `contain` - this would leave empty bars on either side.

### 4. Overlay gradient

**A gradient sits over the hero image, covering the bottom 50% of the image container.**

This gradient serves two purposes: it ensures the walk name text (overlaid on the image, spec in point 5) remains legible regardless of image brightness, and it creates a visual transition into the content section below.

**Gradient specification:**
- Element: a `::after` pseudo-element on the hero image container, or a separate `<div>` positioned absolutely over the image
- Position: `position: absolute; inset: 0` (covers the full container)
- `pointer-events: none` (does not interfere with image or walk name interaction)
- Gradient direction: `to bottom`
- Colour stops:
  - `transparent` at 40%
  - `rgba(0, 0, 0, 0.0)` at 48%
  - `rgba(0, 0, 0, 0.35)` at 72%
  - `rgba(0, 0, 0, 0.62)` at 100%

This gradient is consistent across light and dark modes. The content area below the image (white in light mode, #1F1F1F in dark mode) does not need to be matched by the gradient - the gradient fades to dark at the image bottom edge, and the transition to the content section below is handled by the content area starting on its own surface, not by the gradient extending below the image.

### 5. Walk name placement

**Walk name appears over the hero image, anchored to the bottom-left of the image container**

This is the AllTrails approach: the trail name is part of the hero composition, not a separate heading below it. It creates the sense that the walk has been photographed and titled, like an editorial feature.

**Walk name specification:**
- Font: Fraunces 700
- Size: 26px
- Colour: white (#FFFFFF)
- Text shadow: `0 1px 6px rgba(0,0,0,0.55)` - ensures legibility over any image content, including bright sky areas that the gradient does not fully reach
- Position: absolute, `bottom: 14px`, `left: 16px`, `right: 16px`
- Line height: 1.15
- Max 2 lines (longer walk names may wrap). If a third line would be created, truncate with ellipsis.
- `z-index`: above the gradient overlay

**Important:** the walk name must NOT appear again immediately below the image in the content section. Remove any duplicate walk name heading that appears at the top of the content section. The first element in the content section below the image should be the key stats row (distance, difficulty, terrain, off-lead status), not the name.

### 6. Fallback for placeholder-walk.jpg

**Apply the parallax spec to the placeholder exactly as to real images. No separate treatment needed.**

Rationale: the CSS gradient placeholder (green gradient, per the design elevation spec) is itself a designed visual with depth and texture. The parallax motion on a gradient will be subtle (gradient colour transitions are nearly uniform, so movement is harder to perceive than with a photographic image), but it is not noticeable as broken or incorrect - it simply appears as a smooth transition. When real photos replace the placeholder, the parallax effect becomes fully visible with no code change required.

The gradient placeholder uses the same 260px container and 340px image heights as specified. The dark overlay gradient at the image base ensures the white Fraunces walk name is legible against the green gradient placeholder.

---

## Summary of key recommendations

This summary is for the Developer. Full specifications with exact values are in each section above.

**Task 1 - FAB:** `plus` icon, 56px diameter, bottom: 88px from viewport, brand green background (#2C4A14 light, #3D6B22 dark), multi-layer shadow, white icon, fade on scroll using 250ms scroll stop timeout.

**Task 2 - Me tab layout:** Dog profile card on --surface with 16px border-radius, dog name 48px Fraunces 700 with ellipsis overflow protection, stat tiles in a single row using a shared bordered container with internal dividers, 96px bottom padding on the scrollable container to clear the FAB.

**Task 3 - Walks map:** Full height map below filter bar, custom 28px circular green DivIcon pins (36px selected), compact 180px bottom card on pin tap with spring animation, zoom-level-9 threshold instead of clustering plugin, brightness(0.75) tile filter in dark mode.

**Task 4 - Full screen Nearby map:** In-map expand icon button (32px, top-right, 8px offset), full screen with nav hidden and top-pinned category chip bar, category-coloured circular pins (amber for cafes, red for vets, mid-green for green spaces), venue compact card with directions CTA, history.pushState for Android back button support.

**Task 5 - Parallax:** Yes, implement using scroll listener on overlay container + `transform: translateY()` + `will-change: transform`. Container 260px, image 340px, 0.5 parallax ratio, dark gradient overlay (transparent 40% to rgba(0,0,0,0.62) 100%), walk name in Fraunces 700 26px white over the image at bottom-left. Placeholder receives identical treatment.

---

*Document ends.*
*Saved: docs/specs/designer-brief-march-24-spec.md*
*Date: 24 March 2026*
*Status: Ready for Developer implementation. No app files were edited in producing this spec.*
