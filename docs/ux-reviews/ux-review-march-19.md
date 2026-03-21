# UX/UI Review — Sniffout v2
**Date:** 2026-03-19
**Reviewer:** Designer
**Standard:** Would a design-conscious person feel this belongs alongside Strava, AllTrails, or the best native iOS/Android apps?

**Review method:** Full code and CSS review, all spec documents, design history across 30 rounds of development. Findings are based on the implemented code, not a rendering environment — visual judgements are drawn directly from CSS values, layout structure, and interaction logic.

---

## Summary verdict

Sniffout is closer to launch-ready than most products at this stage of development. The design system is coherent, the colour choices are distinctive, and several interaction patterns (swipe-dismiss, segmented controls, the walk detail overlay) are genuinely app-quality. The strategic reframe from discovery tool to personal record is also the right call and is visible in the Me tab architecture.

The problems that exist are specific and fixable, but three of them are serious enough that no beta tester should see the app before they are resolved. The most damaging is the one that can't be designed around: the absence of walk photos. Sixty-five walk cards showing solid forest-green rectangles is the first thing every tester will see, and it will colour everything else they experience.

Below is the full tab-by-tab assessment, followed by cross-cutting findings and a prioritised list.

---

## 1. TODAY TAB

### State A — No location

**Visual quality:** The screen is too text-heavy for a first-run moment. The headline ("Discover great walks") at 28px/700 is understated — it reads like a section header, not a product statement. AllTrails and Strava both punch at 32-36px for their primary callout; at 28px with letter-spacing -0.5px this headline does not command the screen the way it should.

The hero body copy ("25 handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots.") is accurate but dense, and the "25" figure is stale — the database has 65 walks and will reach 85 after the pending batch updates. This number appears three times across State A: the hero body, the meta description tag, and the social proof strip at the bottom. All three need updating and two of them are redundant.

The CTA block — a white card boxing the primary "Find walks near me" button — creates unnecessary visual framing. The white card sitting on the warm off-white background (#F7F5F0) reads as a card-within-a-card, which makes the primary action feel contained rather than confident. The button itself at 56px height is correctly sized, but it is visually timid when wrapped inside a framed card.

"Or enter a location →" is styled as an underlined text link. This is a web-era pattern. In a mobile app context, this should be styled as a text button without underline — plain text in `var(--ink-2)` weight 500, no underline. The underline reads as a hyperlink, not an alternative action.

The "Sniffout Picks" preview carousel below the fold is a good idea — it gives users a reason to care before they commit their location. But it sits below the social proof strip, which means users who don't scroll will miss it entirely. The State A screen needs a structural rethink, not a polish pass — the picks preview belongs closer to the top of the scroll, not at the bottom.

**Social proof strip:** "25 handpicked UK walks · Just open and explore · Dog-specific routes" — the middle item ("Just open and explore") is filler copy that says nothing. Remove it or replace it with a specific differentiator. The strip design itself (small centered text at 13px) reads as fine print, not confidence.

**Dark mode:** State A in dark mode would show `--brand` (#82B09A — sage green) as the "Find walks near me" button background with white text. That combination has an estimated contrast ratio of approximately 2.3:1 — a WCAG failure. In practice, State A in dark mode is only reachable if the user has manually set dark mode before they set a location, which is an edge case, but it is still a broken state.

### State B — Location known

Cannot fully assess the rendered JS output without running the app, but the structural components are sound: compact weather card, walk preview carousel, conditions card. The layout logic is correct.

One structural note: the wordmark (sniffout) changes from 22px font in State A to 20px in State B. Two-pixel difference in the same session, same typeface. This is a small inconsistency but it will jar on transition if a user returns to State A by changing location.

**Interaction:** The location-line in State B (tap to change location) is a clean affordance. The inline search expanding in-place is the correct pattern for a PWA — no new screen, no sheet.

---

## 2. WEATHER TAB

**Visual quality:** The redesign appears implemented correctly based on the CSS: warm background, temperature + Yr.no icon at 56px gap / 96px icon / ~72px font, verdict badge below. The "verdict first, data second" principle from the spec is architecturally correct and is the right differentiation for Sniffout versus a generic weather app.

The hazard cards (red left-border, light red tint) are strong visual communication — they command attention without being aggressive. The border-left: 4px solid var(--red) treatment is clean and immediately readable.

The weather pills (small translucent chips on the hero card — feels like 12°, H 16°, L 8°) work well against the brand-green hero card. The rgba(255,255,255,0.15) background with rgba(255,255,255,0.28) border is the right treatment for chips on a coloured background.

**Dark mode on Weather:** The tab background becomes `#0F1C16` in dark mode. The weather hero card is brand-green at `#3B5C2A` in light mode. In dark mode, `--brand` becomes `#82B09A`, which means the hero card changes from a rich forest green to a muted sage. The tonal shift is dramatic — in dark mode the hero card loses most of its visual authority. This needs a specific dark-mode override to keep the hero card at a strong value regardless of the `--brand` token change.

**One outstanding concern:** The Weather tab has a `.wx-sheet` component referenced in the dark mode CSS. I cannot confirm whether all wx-sheet-based components have full dark mode coverage without running the app, but the presence of the dark mode overrides at lines 1179-1183 suggests this was considered. Verify on-device in dark mode that no content disappears or bleeds against the dark background.

**Interaction:** Swipe-dismiss on the weather sheet is confirmed implemented. The hourly bar visualisation (`.hour-seg`) is a good at-a-glance reading. No interaction concerns.

---

## 3. WALKS TAB

**Visual quality:** The tab has the correct structural layout — sticky title bar, walk cards in a scrollable list. The picks-anchor floating button (forest green pill, brand color) appearing on scroll is a well-executed touch.

**Photos — the most critical visual problem in the app.** Every walk card shows a solid `var(--brand)` (#3B5C2A) rectangle where the photo should be. 65 walks, 65 green rectangles. This will be the defining first impression for every beta tester. No amount of good typography or spacing recovers from this. Before any external person sees the app, at minimum a small set of actual walk photos needs to be sourced and added. Even 10-15 photos covering the most prominent walks would transform the visual quality of the tab.

The card design itself — `border-radius: 16px`, `1px solid var(--border)`, white surface — is clean and consistent. Walk tag chips at 11px/500 in brand color are appropriately light. The rating display at 12px amber is small enough to be difficult to scan quickly.

**Tap targets:** The filter funnel button in the title bar uses `.filter-btn` which has `padding: 4px 2px`. This gives an effective tap target of approximately 28px × 24px — below the 44px minimum on both axes. A user holding a dog lead with one hand will miss this regularly. This is the most important interaction problem in the Walks tab.

The "Mark as walked" button on trail cards is 34px height — also below the 44px minimum. This button is a core action (the primary mechanism for logging a walk from a card) and it must be at minimum 44px tall.

**Dark mode:** Walk tags in dark mode use `background: rgba(130,176,154,0.13)` with `color: #82B09A`. This is a light sage chip on a dark background — legible but low contrast. It reads correctly as a secondary element.

**Carousel affordance:** The horizontal Sniffout Picks carousel at 240px card width shows approximately 1.5 cards at 390px screen width, implying a right-edge peek that communicates scrollability. This is good. However, there is no scroll fade or shadow to the right edge — it is an abrupt clip. A subtle right-edge gradient (`linear-gradient(to right, transparent, var(--bg))` on a pseudo-element) would communicate "more content this way" more clearly.

---

## 4. NEARBY TAB

**Visual quality:** Structurally mirrors the Walks tab correctly — same title bar pattern, same chip filters, consistent radius picker. This is the right call; users learn one pattern and apply it across tabs.

**Leaflet map dark mode:** The Leaflet tile layer uses OpenStreetMap tiles which are inherently light-coloured. In dark mode (`body.night`), the app background is `#0F1C16` (near-black dark green). The embedded Leaflet map will render a light-coloured tile layer inside a dark-themed app — a jarring light rectangle in a dark screen. This is a known limitation of Leaflet without a dark tile layer, but it needs flagging. Options: add a dark tile layer URL for dark mode, or apply a CSS `filter: invert(1) hue-rotate(180deg)` to the map container when `body.night` is active.

**Tap targets:** The filter funnel on Nearby has the same undersized tap target as Walks (`.filter-btn` with `padding: 4px 2px`). Same fix needed.

**Category chips:** The category chips (cafe, pub, park, pet shop) are a clean horizontal-scroll row. No visual issues identified from the CSS. The `chip.active` state with brand-color border and tinted background is legible in both light and dark mode.

**Empty state:** "Set your location on the Today tab to find dog-friendly places near you." — accurate, clear. No issues.

---

## 5. ME TAB

### Main view

**Visual quality:** The three-stat dashboard is the strongest visual element on this tab. Two stat cards in a grid (miles + walks) above a full-width secondary card (contributions) is a well-composed layout. The stat numbers at 48px/700 for the primary stats and 32px/700 for contributions, with letter-spacing at -2px and -1px respectively, look like they'll have genuine presence when they contain real data.

**Zero state:** When the user has no walks logged, the stats show "0" — the session handoff mentions this was fixed to show dashes, but the `updateMeStats()` function sets textContent = '0' or '0.0' for zero values, not dashes. This needs investigation — either the fix was not applied or it was reverted. "0 miles walked" and "0 walks logged" make the app look broken and cold for a new user. This is a HIGH issue.

**Empty name state:** When no dog name and no username are set, `meDisplayName` is empty and the Me tab header shows just the dog avatar circle with nothing next to it. The dog avatar sits 10px left of an invisible element. This looks like a rendering error. There needs to be a fallback display — either hide the avatar entirely until a name is set, or show a placeholder label like "Set up your profile."

**Entry rows:** The entry row design is clean — icon + label + preview text + count + chevron, separated by 1px borders. The consistent chevron communicates tappability. However, the preview text on Walk Journal ("No walks logged yet") at `var(--ink-2)` weight 400 is appropriately muted.

**Dog profile prompt card:** The prompt card (orange/amber styled? — hard to assess exact colour from code alone) is shown until dismissed or until a dog profile is set. Its placement between the stats dashboard and the entry rows creates a visual interruption. Verify that its styling is consistent with the rest of the tab — no amber in the design system that would make it feel alarming rather than helpful.

**Dog avatar:** 36px circle with a 22px dog outline SVG inside. The visual weight of the SVG inside the circle is correct. When a dog name is set, the avatar shows the first letter — this is fine and expected.

**Dark mode:** `body.night` sets `--bg: #0F1C16` and `--surface: #1A2C22`. The difference in luminance between these two values is modest — approximately 6 hex steps of green channel. The stat cards (surface colour) on the tab background (bg colour) will have very low visual separation. The cards will appear to sit flat rather than lifting off the background. This is the primary dark mode problem on the Me tab.

### Walk Journal subpage

**Visual quality:** Entry rows with expandable detail, timestamp, optional note, optional photo thumbnail. The pattern is correct. The empty state copy ("No walks logged yet — tap Log this walk on the walk card") is accurate but the user may not remember where "Log this walk" is.

**Interaction concern:** The "Log a walk" button for free-form entries — this is the correct escape hatch for users who walked somewhere not in the curated DB. The bottom sheet for log entry (name, date, distance, duration, notes) is the right approach. Verify that the sheet opens smoothly and that the form fields are large enough to use with one thumb.

### Badges subpage

**Visual quality:** Badge chips with custom SVG icons. The icons were designed in this session and will provide visual identity to what would otherwise be generic chips. The inline detail panel (tap a chip to expand) is the right interaction — no extra sheet, no navigation. The earned-moment copy is the strongest writing in the app.

**Empty state:** The Badges entry row is hidden until the first badge is earned — correct per spec. No empty state needed.

### Saved Walks subpage

Cannot fully assess the rendered JS output but the structure (list from favourites + WALKS_DB lookup) is straightforward. Main concern is photo thumbnails — same problem as the Walks tab. Every saved walk will show a green placeholder.

### Saved Places subpage

Venue data from `sniffout_saved_places`. No photos (venue photos from Google Places are a separate concern). Category icons in SVG using currentColor — consistent with the design system.

### Your Dog subpage

The dog profile form — breed dropdown (62 breeds), size segmented control, personality tags (8 chips, max 3), birthday selectors. The form lives in a full-screen subpage which is the correct placement per the recommendation document. The form contents match the settings sheet form from previous rounds.

One issue: the dog profile subpage's `me-settings-section` has `style="padding:0 16px;"` inline. This is a patch, not a proper class. The padding approach should be consistent with how other subpage content sections handle their horizontal inset.

---

## 6. SETTINGS SHEET

**Visual quality:** Post-simplification, the settings sheet contains only Display mode, Search radius, and (from Round 29) units toggle. This is exactly the right scope. A gear icon that opens only app configuration is immediately legible.

The segmented controls (Display mode: Light / Match device / Dark; Search radius: 1mi / 3mi / 5mi / 10mi) are implemented correctly per the dark-mode-toggle-redesign spec — sliding pill, all options visible, 44px height. This is one of the best-executed UI patterns in the app.

**Dark mode:** The segmented control has proper dark mode overrides for both the trough and the active pill. Inactive label at `rgba(255,255,255,0.45)` is legible against `#1A2C22`.

**One concern:** The settings sheet handle (`me-settings-handle`) uses a different CSS class and different handle implementation than the Me subpage handle (`me-subpage-handle`). The settings sheet handle is 32px wide; the subpage handles are 36px. The settings sheet handle has `margin: 0 auto 20px` (20px below); the subpage handles have `margin: 10px auto 0` (10px above). These should use the same implementation for consistency. Both are functional but one is clearly the older pattern.

**The privacy note:** "Your walks, favourites, and reviews are saved on this device. Sync across devices is coming in a future update." — accurate, appropriately modest. Good copy. The note does not, however, mention that walk photos are also device-only (with photos compressed to ~200KB base64 in localStorage). The photo disclaimer appears in the walk detail overlay but not in settings. Consider whether this needs surface-level mention.

---

## 7. WALK DETAIL OVERLAY

**Visual quality:** The overlay is the most polished surface in the app. The header with back arrow + walk name + share button is clean and standard. The drag handle is correctly placed and sized (36px wide, 4px tall). The stats row (distance / duration / difficulty) with dividers is clearly structured. The walk note textarea and save button are good personal record additions.

**Tap targets:** The "Mark as walked" button (`.walked-btn`) is 34px height — below the 44px minimum. This is the most frequently used action in the overlay and the most important one to get right for one-handed use. Fix to 44px minimum.

**Photo section:** The "Add photo" button with dashed border (`border: 1.5px dashed var(--border)`) reads as provisional — it looks like a placeholder in a prototype rather than a finished UI element. The dashed border convention is fine for a drag-and-drop zone on desktop, but on mobile it reads as incomplete. Replace with a solid-border button using a camera icon and standard button treatment.

**Wishlist button:** The wishlist button (bottom of actions, outline style) is semantically distinct from the heart/favourites button in the header. This is a good distinction (wishlist = "I want to walk this", favourite = "I've walked this and loved it") but it is not communicated to the user anywhere on screen. The labels alone ("Add to wishlist" vs the heart) do not explain the distinction. Consider whether this distinction needs surfacing — or whether it is too fine for a beta audience.

**Disclaimer:** "Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go." — correct tone, correct placement (passive footer, 12px, muted). Good.

**Dark mode:** The walk detail overlay background maps to `var(--bg)` in dark mode (#0F1C16). The detail header background maps to `var(--surface)` (#1A2C22). This creates a visible step between the header and the scroll content, which is the correct treatment — the header should feel anchored and distinct from the scrolling content beneath it.

---

## Cross-cutting: Dark Mode

The dark mode palette is genuinely distinctive — a deep forest green rather than generic dark grey. This is the right call for a brand with such a specific colour identity. However, three systematic problems exist:

**1. Surface and background contrast is too low.** `--surface: #1A2C22` on `--bg: #0F1C16` has approximately 1.3:1 luminance ratio. Cards do not visually lift off the background. The brand-green weather hero card changes from authoritative to muted when `--brand` shifts to `#82B09A`. The entire dark mode reads as flatter than the light mode — less hierarchy, less depth.

**Fix:** Increase the `--surface` value by approximately 8-12 luminance steps to create more separation. Something in the range of `#223525` to `#24402E` would give measurably better card lift without leaving the forest-green colour family.

**2. Brand-coloured elements lose authority in dark mode.** Every element using `var(--brand)` shifts from `#3B5C2A` (deep forest green — strong, readable) to `#82B09A` (sage — soft, muted). The segmented control active state at `#82B09A` still works. The walk note save button (`background: var(--brand); color: #fff`) at `#82B09A` with white text gives approximately 2.3:1 contrast — a WCAG failure for interactive elements. This needs a specific dark-mode override for any filled brand-colour button: either keep a stronger green value in dark mode or switch the button text to dark ink.

**3. The Leaflet map is not dark-mode aware.** The embedded Leaflet map uses light OSM tiles. In dark mode, this renders as a light-coloured map inside a near-black screen. Options: CSS filter invert on the map container in dark mode, or a dark tile source (CartoDB Dark Matter or similar). Either is acceptable for a PWA. The current state is jarring.

---

## Cross-cutting: Navigation

**Bottom nav:** The nav label font size of 10px is at the floor of legibility. Standard is 11-12px for bottom nav labels. On lower-DPI Android screens this will be difficult to read without squinting. Increase to 11px.

**State A nav dimming:** Non-Today tabs dim to 35% opacity when no location is set. This communicates "not available" clearly, but 35% is aggressive enough to make the nav look broken. 50% opacity would communicate the same message less alarmingly.

**Subpage back behaviour:** All Me tab subpages close via the back chevron, swipe-down, or hardware back button. This is consistent and correct. The `closeTopSheet()` function correctly checks for open subpages before checking for sheets. The priority ordering (walk detail first, then subpages, then settings sheet) is right.

**Gestures:** Swipe-dismiss is implemented on every sheet and overlay. The 100px threshold with 200ms animation is well-tuned for mobile. No concerns here.

**Tappability:** The walk cards, entry rows, and venue cards all use `cursor: pointer` and `:active` states. Navigation is tap-only as required.

---

## Cross-cutting: User Journeys

### First time user opening the app

The user lands on State A. They see a headline, some body copy, a primary button, and "Or enter a location →". The walk picks preview is below the fold — they may not scroll to it. The screen does not immediately communicate what kind of walks are in the app, what the weather integration means, or why they should care. **The first-run screen is the weakest moment in the app.** It does not inspire confidence. A design-conscious user comparing this to AllTrails or Strava would feel they had downloaded a prototype.

### Returning user checking weather before a walk

Opens the app on the Weather tab (last active tab is persisted). Sees the verdict badge and temperature immediately. Scrolls through the walk window and hazard cards. This journey is smooth. The "verdict first" architecture pays off here — the user gets their answer within 2 seconds of opening. **This is the best-executed journey in the app.**

### User logging a walk after returning home

Opens walk detail for the walk they just completed. Taps "Mark as walked" (34px — undersized, but reachable). Optionally adds a note. The problem: if the user opens the Walks tab and their walk isn't the most prominent card, they have to find it first. The Today tab shows recommended walks, not recently viewed. There is no "recently viewed" shortcut to the walk they last opened. **This journey has unnecessary friction for a returning user.**

The free-form "Log a walk" option in the Walk Journal subpage is the correct safety valve, but the user has to navigate to Me > Walk Journal > Log a walk — three taps from a cold start, and the user may not know this exists.

### User exploring Nearby tab for a post-walk cafe

Opens Nearby tab. Taps "Cafes" chip. Sees venue list. Taps a venue. This journey is fast and clear. The main gap is that venues have no rating information visible on the card (unless Google Places data provides it). **This journey works well structurally.**

### User checking Me tab after a few weeks of use

Navigates to Me tab. Sees stats with real numbers — miles walked, walks logged. Taps "Walk Journal" row. Sees chronological log with notes. This is genuinely satisfying and is the strongest expression of the "personal record" value proposition. **When there is data in it, the Me tab is the most emotionally resonant screen in the app.** The challenge is getting users to that state.

---

## Prioritised Findings

### BLOCKER — Must fix before showing to anyone

**B1. Walk photos are absent from all 65 walk cards.**
Every trail card, portrait card, and walk detail overlay shows a solid forest-green (#3B5C2A) rectangle where a photo should be. This is visually disqualifying. Source a minimum of 15-20 walk photos for the most prominent cards before any external user sees the app. Not every walk needs a photo immediately, but the first screen a user sees cannot be a wall of identical green rectangles.

**B2. Primary button contrast in dark mode fails accessibility.**
The walk note save button and any other filled brand-colour button uses `background: var(--brand); color: #fff`. In dark mode, `--brand` resolves to `#82B09A` (sage green), giving approximately 2.3:1 contrast ratio with white text — a WCAG failure. Add a dark-mode-specific override for filled brand buttons to maintain a minimum 4.5:1 contrast ratio.

**B3. Stale copy: "25 handpicked UK walks" appears throughout the app but the database has 65 walks.**
The hero body on State A, the meta description tag, and the social proof strip all cite "25 handpicked UK walks." After the pending batch updates this figure reaches 85. This copy should be updated to reflect the current reality and ideally de-coupled from a hard-coded number (e.g., "handpicked UK walks" without a number, or the number generated dynamically).

---

### HIGH — Should fix before soft launch

**H1. Filter button tap target is 28px × 24px on Walks and Nearby tabs — below the 44px minimum.**
The `.filter-btn` has `padding: 4px 2px`. Users holding a dog lead will miss this consistently. Increase padding to give a minimum 44px × 44px tap target.

**H2. "Mark as walked" button is 34px height on both trail cards and walk detail overlay — below the 44px minimum.**
This is the primary walk-logging action. Fix to minimum 44px.

**H3. Stats show "0" not dashes for new users.**
The zero-state stats ("0 miles walked", "0 walks logged") make the app look empty and broken on first use. Either show dashes (–) with label "no walks yet" or hide the numbers entirely until the first walk is logged.

**H4. Empty name state in Me tab header renders visually broken.**
If no dog name and no username are set, `meDisplayName` is empty and the header shows an avatar floating with nothing beside it. Add a fallback: either hide the name element and collapse the gap, or show "Set up your profile" in `var(--ink-2)` weight 400.

**H5. State A first-run screen does not communicate the product.**
The screen is text-heavy and visually flat. A new user has no immediate visual sense of what the walks look like, what the weather integration does, or why Sniffout is worth their location permission. The Sniffout Picks preview carousel should move above the social proof strip and ideally above the hero body copy. Consider removing the hero body altogether — the headline + CTA + picks preview is a stronger argument than a paragraph of prose.

**H6. Dark mode — surface/background contrast is too low.**
At `--surface: #1A2C22` on `--bg: #0F1C16`, cards do not visually lift off the background. The app reads as flat in dark mode. Raise `--surface` value to approximately `#243A2C` to restore card depth without breaking the colour family.

**H7. Leaflet map is not dark-mode aware.**
Light OSM tile layer inside a dark-mode app creates a jarring bright rectangle. Apply `filter: invert(1) hue-rotate(180deg)` to the map container when `body.night` is active, or source a dark tile layer URL.

**H8. "Or enter a location →" uses a web-era underlined link treatment.**
Replace with plain text in `var(--ink-2)` weight 500, no underline. The arrow character is appropriate but the underline is not.

---

### MEDIUM — Fix in the next few rounds

**M1. Nav label font size is 10px — too small.**
Increase to 11px minimum. 10px is below comfortable legibility on most screens without exceptional eyesight.

**M2. Non-Today-tab dimming at 35% opacity reads as broken, not informational.**
Increase to 50% opacity. The message ("these tabs are not available yet") is clear at either value, but 35% looks like a rendering error.

**M3. Walk photo placeholder (solid brand green) needs a better fallback.**
Until real photos are sourced, the solid green placeholder reads as broken. Add a simple gradient or a subtle texture — even `linear-gradient(135deg, #3B5C2A 0%, #2E7D5E 100%)` would be more convincing than a flat block of colour. Include a faint landscape or leaf pattern if an SVG background is feasible.

**M4. The walk detail "Add photo" dashed-border button reads as provisional UI.**
Replace the dashed border with a solid-border button using `border: 1px solid var(--border)`. Add a camera icon (16px). The dashed convention reads as "drop zone" on desktop and "unfinished" on mobile.

**M5. Hero headline should be 32px, not 28px.**
At 28px the headline reads as a section header. A proper hero statement should be 32-34px for a mobile first-run moment.

**M6. Settings sheet handle is 32px / 20px bottom margin; subpage handles are 36px / 10px top margin.**
These should use a single unified handle implementation. The inconsistency is visible when both surfaces are used in the same session.

**M7. The walk rating on trail cards is 12px amber.**
Rating is significant information for walk selection. 12px is too small to scan at a glance. Increase to 13px or restructure the card body so rating gets more prominence.

**M8. The dog profile subpage `me-settings-section` uses inline padding style.**
`style="padding:0 16px;"` is a patch. Move to a proper class definition consistent with the rest of the subpage layout.

**M9. Favourite/Wishlist distinction is not communicated to users.**
The heart button (favourite — "I've walked this") and the bookmark/wishlist button (wishlist — "I want to walk this") are both present on the walk detail overlay. The distinction is not explained anywhere on screen. Either consolidate to a single save action, or add a one-line tooltip or label explaining the difference.

---

### LOW — Fix when time allows

**L1. Social proof strip copy is weak.**
"25 handpicked UK walks · Just open and explore · Dog-specific routes" — the middle item is meaningless filler. After updating the walk count, rewrite as: "65 handpicked UK walks · Live weather hazards · Off-lead and terrain info." Each item should carry specific information value.

**L2. Wordmark font size is inconsistent between State A (22px) and State B (20px).**
Choose one and apply it consistently. 20px is the correct value for an app header; State A's 22px can be reduced to match.

**L3. The portrait card heart button in Today tab State B is 28px diameter.**
This is the same issue as the trail card heart — it's a small tap target for a non-critical action (favouriting a walk from a preview card). Not urgent but worth addressing in a polish round.

**L4. The "Match device" label in the dark mode toggle is four words long.**
The segmented control has three equal-width segments. "Light" and "Dark" are single words; "Match device" is two words at 14px and may wrap or truncate on narrower screens. Consider "System" or "Auto" as alternatives. The current spec recommends "Auto" which is a single word and resolves this cleanly. Verify whether "Match device" was implemented or whether the spec's "Auto" label was used.

**L5. The walk detail overlay close button at the bottom is redundant with the back button in the header.**
The bottom close button ("Close") provides a useful safety net for users who have scrolled deep into a long overlay and don't want to scroll back up. Keep it, but verify it doesn't sit so close to the nav bar on short-viewport devices that it creates a visual collision.

---

## The top 3 before beta

If only three things can be fixed before the first external user sees the app:

**1. Walk photos.** Source at least 15-20 real photos for the most visible walks. This is not a code problem — it is a content problem. The visual damage from 65 green rectangles cannot be recovered by any design or code improvement.

**2. Mark as walked button: 34px → 44px.** The primary walk-logging action is undersized and sits at the heart of the most important user journey. Fix is two lines of CSS.

**3. Stats zero state.** New users seeing "0 miles walked, 0 walks logged" in three large numbers on the Me tab is the coldest, most demotivating first impression for the feature designed to retain them long-term. Either hide until first walk, or replace zeros with a warm empty state.
