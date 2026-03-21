# UX/UI Review — Sniffout v2
**Date:** 2026-03-21
**Reviewer:** Designer
**Standard:** Would a design-conscious person feel this belongs alongside Strava, AllTrails, or the best native iOS/Android apps?
**Prior review:** 2026-03-19 — referenced throughout

**Review method:** Full code and CSS review of `sniffout-v2.html`. All judgements drawn from CSS values, HTML structure, and interaction logic without rendering.

---

## What has changed since March 19

Before the fresh findings: the previous review's blockers and high-priority issues have largely been actioned. The following are confirmed fixed:

- **B2:** Dark mode brand contrast. `--brand` in dark mode is now `#5C7A63` (not `#82B09A`). White text on `#5C7A63` is approximately 4.7:1 — passes WCAG AA. This was a critical regression and it's gone.
- **H1:** Filter button tap targets. `.filter-btn` now has `padding: 10px 10px; min-width: 44px; min-height: 44px`. Correct.
- **H2:** Mark as walked button. `.walked-btn` is now `height: 48px`. Correct.
- **H5:** State A redesign. Body copy paragraph removed. CTA card wrapper removed. CTA sits directly on `--bg`. Hero headline updated to "Paws before you go." and is 32px. The screen is substantially cleaner.
- **H6:** Dark mode upgraded from forest-green to Scheme B (Dark Slate — `#141414` / `#1F1F1F`). Better visual coherence for the dark mode brand token.
- **H7:** Leaflet map dark mode. `filter: invert(1) hue-rotate(180deg)` applied. Fixed.
- **H8:** Secondary action underline. `.cta-secondary` has no underline. Correct.
- **M1:** Nav label is now `font-size: 11px`. Fixed.
- **M2:** Non-Today-tab dimming at 50% opacity. Fixed.
- **M3:** Walk photo placeholder now uses a CSS background combining the real placeholder JPEG URL with a gradient fallback (`linear-gradient(135deg, #2D5A1B, #1A3D0F, #2E7D5E)`). A real image renders where available; the gradient is the fallback.
- **M4:** Walk detail "Add photo" button is now a solid-border button (`walk-photo-add-btn`). Dashed border removed.
- **M5:** Hero headline is 32px. Fixed.
- **M8:** Dog settings inline padding moved to `.dog-subpage-inner` class. Fixed.

The rate of improvement is meaningful. The app has moved from "needs major structural work" to "needs targeted fixes and polish."

---

## Summary verdict

Sniffout is in a materially better state than two days ago. The State A redesign alone removes the single biggest visual problem in the product. The dark mode scheme change from forest-green to neutral dark slate makes the design significantly more coherent at night.

What remains is a mix of small-but-specific regressions, code hygiene issues that don't affect the rendered experience but create maintenance risk, and a handful of genuine UX problems that have survived across both reviews. None of the remaining issues is a product-stopper. Several are embarrassing enough that they should be fixed before external users see the app.

The most damaging unresolved issue is still the same one from two days ago: **the walk photos**. No CSS improvement recovers from 65+ walk cards showing a tiled photograph of an undefined path that all look identical. This is not a code problem. It needs a content decision.

---

## 1. PROFESSIONALISM

**What is working:**

The card system is genuinely clean. `border-radius: 16px`, `1px solid var(--border)`, white surface — this is textbook modern app card design and it's applied consistently. The weather tab hero at `80px/700 letter-spacing: -3px` reads like a serious app, not a prototype. The segmented controls (3-option light/system/dark, 4-option radius) with the sliding pill are the best single component in the app — they would not be out of place in a polished native iOS app.

The icon approach — Lucide SVGs for functional icons, custom inline SVGs for the nav — is consistent and correct. No emoji in functional UI, no icon mismatches.

**What is not working:**

**The `--border` token in light mode is a hard hex** (`#E5E7EB` — line 44), not the `rgba(0,0,0,0.08)` documented in CLAUDE.md. These are close but not identical: `rgba(0,0,0,0.08)` on white renders as `rgb(235,235,235)` (warm grey); `#E5E7EB` is `rgb(229,231,235)` — a faint blue-grey. The difference is subtle but the blue cast places cards and inputs in the cool register, which works against the warm `#F7F5F0` background. The CLAUDE.md token value `rgba(0,0,0,0.08)` is correct for a warm-background app; the hex `#E5E7EB` is not. This is a small but specific wrong note that a design-conscious person will feel without being able to name.

**The walk rating on trail cards is still 12px.** The amber rating star + count (lines 1355-1358) at 12px `color: var(--ink-2)` is too small and too muted to scan at a glance. Rating is one of the three pieces of information a user uses to judge a walk — it deserves more visual weight, not less. 12px in `--ink-2` grey with an amber star reads as fine print. 13px in `var(--ink)` weight 500 would be a meaningful step up.

**The `walks` and `nearby` tabs have inconsistent card types.** The Nearby tab renders two different card patterns: `venue-card-gp` (photo card with `height: 140px` photo area, name, meta, rating, address) and `gs-card` (horizontal row card at `min-height: 72px` with a 64px thumbnail, no photo area). Both appear to be in use for Google Places results. The visual gap between these two styles is significant — one feels like a restaurant discovery app, the other like a list entry. Users will experience both in the same scroll and notice the inconsistency even if they can't name it.

**The `meDisplayName` span starts empty** (line 3841). The span has no placeholder text in the HTML. A new user's first experience of the Me tab is an avatar circle followed by nothing — the name slot is visually absent until JS either finds a stored name or sets the placeholder class. On a slow first render, the header briefly shows an orphaned avatar with a gap where the name should be.

---

## 2. CONTRADICTIONS AND COMPLEXITY

**The radius picker units are km but the system is miles.**

The Walks tab radius picker (lines 3780-3785) shows "1 km / 3 km / 5 km / 10 km" with `data-km` attributes. The `sniffout_radius` key in localStorage stores values in miles (1/3/5/10 per CLAUDE.md). The units preference (`sniffout_units`) controls walk card distances but apparently not the radius picker labels.

A UK user who has walk cards showing miles (the default) will see a filter picker that says kilometres. This is a mixed-units UX inside a single tab. It creates a small but real moment of confusion: "Am I filtering to walks within 3 kilometres or 3 miles?" On a 390px screen where the user is trying to quickly filter, this question should never arise.

**The preview carousel in State A has `pointer-events: none`** (line 729). The cards are shown at 85% opacity to imply they're locked. There is no affordance, label, or tooltip explaining why — no "Sign in to browse" equivalent, no "Set your location to unlock". A user who taps a trail card in State A gets zero feedback. They will tap again, assume the app is broken, or assume their touch failed. The lockout needs either a visual explanation or a behaviour (tap carousel card → gentle nudge to the "Find walks near me" button, or show a toast: "Set your location to explore").

**The `me-stat-card--primary` CSS class does not exist** (line 3851 uses it, no definition exists in the CSS). The first stat card in the dashboard (`statMiles`) has a modifier class that does nothing. If there was intended to be visual differentiation between the primary and secondary stat cards — bolder number, accent colour, or different background — it has silently failed. The two cards look identical when they may have been designed to look different.

**Saved Walks uses a heart icon but Saved Walks is the wishlist section** (lines 3936-3950). The entry row for "Saved Walks" uses a filled heart icon (SVG path for the filled heart). But the walk detail overlay distinguishes between the heart (favourite — "walked and loved it") and the bookmark/wishlist ("want to walk this"). In the Me tab, "Saved Walks" entry row uses the heart icon regardless of which saves it is reflecting. This compounds the confusion that M9 in the previous review flagged — the distinction between favourite and wishlist is now invisible in the Me tab entry list, because both are filed under a heart icon.

---

## 3. COLOUR

**Light mode is solid.** The brand green `#3B5C2A` on `#F7F5F0` is readable and distinctive. The amber `#D97706` for warnings and ratings reads as cautionary without being alarming. The red `#DC2626` is appropriately alarming for hazard cards. The walk tag colours (brand green for full off-lead, amber for partial) are the right semantic choice. No light mode colour problems.

**Dark mode has three specific remaining issues:**

**Issue 1 — `#5C7A63` on `#1F1F1F` is approximately 3.56:1 contrast.** The dark mode brand colour on the dark mode surface fails WCAG AA (4.5:1 for normal text). Any small text in `var(--brand)` that appears over a surface-coloured background — `.me-stat-value` (36px, would pass AA at this size), `.trail-card-name` (15px, would fail), `.section-link` (14px, would fail) — is technically non-compliant. At large sizes this doesn't matter. But the 12-14px brand-coloured links and labels throughout the app on surface backgrounds (`venue-dist`, `gs-maps-link`, `today-conditions-link`) are all below threshold in dark mode.

**Issue 2 — Active chips in dark mode look fundamentally different from light mode.** In light mode, `.chip.active` is `background: var(--brand); color: #fff` — a solid filled chip with white text. In dark mode, `.chip.active` is `background: rgba(92,122,99,0.10); border-color: rgba(92,122,99,0.22); color: var(--brand)` — a ghost chip with muted coloured text. Same component, completely different visual grammar. If a user switches between light and dark mid-session (unlikely but possible), the active filter chips will look like entirely different components. More practically: the dark mode active chip reads as less "selected" than the light mode version. A user scanning quickly may not register that a filter is active.

**Issue 3 — `wx-verdict--caveat` background is hard-coded `#2D7A5A`.** This colour does not vary with dark mode. In dark mode, the approved badge adapts (`background: var(--brand)` → `#5C7A63`), but the caveat badge stays `#2D7A5A` — a mid-saturated forest green that reads as dark-mode-like even in light mode, and becomes inconsistent with the neutral dark slate scheme in dark mode. Both badges should use token-driven colours.

**The `--border` blue cast** (addressed in Section 1) is also a colour issue — worth noting again that `#E5E7EB` in the light mode token set pulls the overall app slightly cool.

---

## 4. COMPONENT CLARITY

**Weather tab tile chevron** (line 1132): `.wx-tile-chevron { font-size: 14px; color: var(--ink-2) }`. The tile chevron is rendered as a text character (`›`), not an SVG. Across every other chevron in the app, an SVG polyline is used (`<polyline points="9 18 15 12 9 6"/>`). The `›` character renders at a different weight, a different angle, and in slightly different positions across iOS/Android font stacks. This is the one place in the app where a non-SVG chevron is used and it will look subtly wrong compared to the consistent SVG chevrons elsewhere.

**Drag handle inconsistency:** Three handle widths are in use:
- `wx-sheet-handle` (weather detail sheet): 32px
- `me-settings-handle` (settings sheet): 36px
- `me-subpage-handle` (Me subpages): 36px

The previous review flagged this. It is still not resolved. The settings sheet and subpage handles are consistent with each other but the weather sheet handle is shorter. A user who pulls the weather sheet up and later pulls a subpage up will notice the handle is different. This is the definition of an unpolished detail.

**Condition tag chips** (`.cond-chip`) have `border-radius: 20px` and `.cond-chip-more` also has `border-radius: 20px`. The walk cards main `.walk-tag` has `border-radius: 6px` and `.detail-tag` has `border-radius: 8px`. Three different border-radius values for what are all semantically "tags" or "chips" on walk-related cards. This creates a visual inconsistency across card contexts that a design-conscious user won't consciously identify but will register as an uneven feel.

---

## 5. BLAND OR PLAIN AREAS

**The Me tab empty state (zero stats) is still the coldest moment in the app.** The stats dashboard shows three "0" values in 36px/700 weight by default (lines 3852-3863). The HTML sets them to "0" and JS presumably updates them. But until the JS runs or until the user logs a walk, "0 miles walked / 0 walks logged / 0 contributions" in three large numeral zeros dominates the Me tab above the fold. This is not a design problem — it is a content problem. The numbers are beautifully laid out. They're just saying the wrong thing. The previous review flagged this as HIGH. It remains.

**The Badges entry row is hidden until the first badge is earned** (line 3918: `hidden` attribute). This is correct per spec — no badges, no row. But the consequence is that a new user opening the Me tab sees: Avatar, 3 × "0", optional dog prompt, four entry rows (Your Dog, Walk Journal, Saved Walks, Saved Places). "Walk Journal" row says "No walks logged yet". "Saved Walks" says "None saved yet". "Saved Places" says "None saved yet". Three of the four visible entry rows signal emptiness. The combined effect is a tab that communicates: *you haven't done anything yet.* This is the worst possible message for a new user who is trying to decide whether to engage with the product.

**The "contributions" stat card** (line 3861) shows a number and the label "contributions". What is a contribution? Is it condition tags submitted? Reviews? Walk log entries? The label is ambiguous and there's no explanation anywhere on the Me tab. For a new user seeing "0 contributions", the word is meaningless. For an existing user who has logged walks, they may wonder why they have contributions at all. This metric needs either a rename to something self-explanatory ("condition reports") or a brief label tooltip.

**The social proof strip** (line 3708) reads "Know the route · Own the weather · Find the spots". This is the CLAUDE.md approved copy and it's a genuine improvement over the previous version. However, "Find the spots" refers to the Nearby tab — but "spots" could mean anything. "Dog-friendly spots" would be clearer while keeping the cadence. "Find the spots" in isolation reads as vague.

---

## 6. MODERNITY

**What is modern and working:**

The walk detail overlay (`transform: translateY(100%)` → `translateY(0)` on open) is mobile-native. Swipe-to-dismiss with 100px threshold, 200ms animation — this is well-executed. The hourly weather scroll with `scroll-snap-type: x mandatory` is standard modern app pattern. The `wx-tile` 2×2 grid for metric tiles with expandable sheets is clean and clearly structured.

The silent refresh on visibility change and tab switch is an invisible UX improvement that prevents stale weather data without annoying the user. This is good mobile-first engineering.

**What is showing its age or lacks refinement:**

**`overflow: hidden` on `.state-a-scroll`** — not applied; the State A content uses `state-a-scroll` as a layout class without `overflow-y: auto`, relying on the parent `.tab-panel` for scrolling. This is correct architecture. But the combined `padding-bottom: 32px` on `.state-a-scroll` + no visible scroll indicator means there is no affordance that content exists below the fold on a fresh load.

**`lucide@latest` as the CDN dependency** (line 27: `<script src="https://unpkg.com/lucide@latest">`). Using `@latest` means the icon set could change between page loads if Lucide publishes a major version. In production, this must be pinned to a specific version (`lucide@0.x.x`). A version bump that renames or removes an icon used in the app will silently break that icon. This is a deployment correctness issue, not a UX issue, but it will surface as a UX issue when it breaks.

**Dead CSS is accumulating.** The following class definitions exist in the stylesheet but appear to have no corresponding HTML usage: `.hero-body`, `.cta-block`, `.preview-picks-header`, `.preview-picks-label`, `.preview-picks-prompt`, `.me-hero`, `.me-hero--empty`, `.dog-setup-card`, `.dog-setup-avatar`, `.dog-setup-heading`, `.dog-setup-sub`, `.dog-setup-input`, `.dog-setup-btn`, `.dog-setup-skip`, `.me-add-dog-link`. These are remnants of earlier iterations. At 3637 lines of CSS in a 526KB file, dead CSS contributes meaningfully to parse time on low-end devices.

**Duplicate CSS definitions.** Three classes are defined twice with conflicting properties:
- `.venue-card` (lines 1398 and 1451) — the second definition wins
- `.venue-icon` (lines 1409 and 1462) — the second definition wins
- `.me-stats-row` (lines 1539 and 2149) — the first is `display: flex`, the second is `display: grid; grid-template-columns: 1fr 1fr`. The grid definition wins. The flex definition is dead code.

These are maintenance hazards. A developer editing the wrong `.venue-card` rule in the future will create a confusing bug.

---

## 7. REDESIGN FROM SCRATCH

**What I would keep:**

The card system is correct. `border-radius: 16px`, 1px border, white surface — clean and defensible for a product at this stage. The colour family (warm off-white, forest green brand, amber warning, red danger) is distinctive and right for a nature product. The bottom tab navigation with 5 tabs is appropriate. The weather hero card "verdict first" architecture is genuinely differentiated and should stay. The walk detail overlay as a full-screen slide-up is the correct native-feeling pattern for a content-rich detail view.

**What I would do differently:**

**Tokens first.** The current token system is partially implemented. `--border` in light mode should be `rgba(0,0,0,0.08)` for context-adaptiveness. The amber token should be consistent between documentation and code (currently `#D97706` in code vs `#F59E0B` in CLAUDE.md). The dark mode brand should be split into `--brand-interactive` and `--brand-display` so that filled buttons can maintain a stronger green while secondary brand text adapts. The current single `--brand` token in dark mode creates contrast failures at small text sizes.

**Me tab zero state is a product design failure.** I would not show number stats to a new user at all. The Me tab for a new user should show a warm onboarding prompt — "Here's where your walks live. Start by finding a walk near you." — with the stat cards appearing only after the first walk is logged. The three "0" stats dominate the screen and communicate the opposite of what the product wants to say: *this is a record of your walks.* An empty record is demotivating, not inviting.

**One unified location entry pattern.** Currently there are four instances of the same search UI (`search-input-row` with a search icon, text input, and submit button): State A, State B inline, Walks tab, Nearby tab. These are all technically correct but each has its own container ID and error element ID. This is the right approach for a single-file app without components — but a future refactor to extract a shared `renderSearchBar(containerId, onSubmit)` function would eliminate the maintenance risk of four nearly-identical HTML fragments drifting apart.

**Preview carousel needs a reason to exist.** In State A, the preview carousel is non-interactive at 85% opacity. It either inspires the user to set their location, or it doesn't. Currently there's no copy connecting the carousel to the CTA — no "these are waiting for you" label, no tap-to-prompt behaviour. I would add a single-line label above the carousel: "100 walks, ready to explore." (where 100 is `WALKS_DB.length`), and wire the carousel cards to a gentle CTA nudge on tap. The carousel without a story is decoration; the carousel with a story is a conversion tool.

**Badges entry row visible from day one.** Rather than hiding the Badges row until a badge is earned, I would show it with an empty state that communicates the system exists: "Earn your first badge by logging a walk." Hidden entry rows train users to not expect more — which is fine in itself, but means users discover features by accident rather than by invitation. Badges are a retention mechanism; they should be visible as a promise, not revealed as a surprise.

---

## 8. BENCHMARK AGAINST MARKET LEADERS

**Compared to AllTrails:**

AllTrails' core strength is photos — every trail listing has multiple real user-submitted photos. AllTrails also has a review count in the thousands. Sniffout's placeholder photos are the single largest gap against this benchmark. Everything else — the card system, the tag chips, the detail overlay, the stats — is competitive with AllTrails' list view. AllTrails' weather integration is generic (basic forecast, no walk verdict). On weather intelligence, Sniffout is ahead.

**Compared to Strava:**

Strava's Me equivalent (the athlete profile) uses the same stats-dashboard-with-numbers pattern. Crucially, Strava's dashboard is only ever shown when there is data — a new Strava account shows an onboarding flow, not three zeros. Strava's activity feed fills the emptiness with suggested activities and highlights from athletes you follow. Sniffout has no equivalent of this "filler content that feels personal." The Me tab for a new user is the biggest gap against Strava in terms of emotional design.

**Compared to Too Good To Go:**

TGTG's strength is cards with real food photography. Their card design is tighter than Sniffout's — smaller radius, less padding, more information density. Sniffout is deliberately less dense, which is correct for an outdoor product where the user may be planning rather than browsing. TGTG's filter sheet is close in pattern to Sniffout's — bottom sheet, chip filters, clear/apply footer. Sniffout's filter sheet is at least as good and probably better structured. This is an area where Sniffout holds its own.

**Compared to Deliveroo:**

Deliveroo's horizontal carousels have right-edge gradient fades (`linear-gradient(to right, transparent, var(--bg))`) on every scrollable row to communicate "more this way." Sniffout's carousels (trail carousel, portrait card carousel, preview carousel) have no right-edge affordance. The walk carousel on the Today tab State B shows approximately 1.5 cards at 390px — the right edge peek communicates scrollability, but without a gradient the clip is abrupt. The hourly weather scroll (`.wx-hourly-fade::after`) does have a fade — but only the weather card has it. All walk carousels should.

**Overall benchmark position:**

The app benchmarks well against market leaders on interaction patterns and component quality. It benchmarks poorly on content richness (photos), and poorly on onboarding/zero state. The weather intelligence feature has no direct equivalent in any of the four benchmarks — this is Sniffout's defensible position and it is well-executed in the code. The gap to close before launch is primarily about photography and not about code.

---

## 9. MISSING FEATURES OR ELEMENTS

**Right-edge carousel fades.** The hourly forecast card has `.wx-hourly-fade::after` applying a right-edge gradient. Every other carousel (`trail-carousel`, portrait card row in Today State B, preview picks carousel in State A) has an abrupt right clip. On a 390px screen, the trail carousel shows approximately 1.6 cards. The affordance to scroll exists, but a gradient fade communicates it more clearly. This is a two-line CSS addition per carousel.

**No "recently viewed" shortcut.** A user who has opened a walk detail, wants to log it after returning, has to find the walk again in the full list. The Today tab State B shows recommended walks, not recently viewed. The Walks tab lists walks by proximity or rating. There is no "jump back to the walk I just looked at" feature. A simple "recently viewed" chip in the recent-pills row (the same pills used for recent location searches) would close this gap. One chip, one localStorage key.

**No visual explanation for the locked preview carousel.** Described in Section 2 above. The 85% opacity and `pointer-events: none` communicates "locked" but not "unlock by doing X." Even a single line — "Tap 'Find walks near me' to explore" — directly above or below the carousel would close this.

**No pull-to-refresh.** For weather data, silent refresh on visibility change is implemented. But there is no user-initiated refresh affordance. If a user suspects the weather data is stale, they have no obvious way to force a refresh. A pull-to-refresh gesture on the Weather tab is the standard mobile pattern. An alternative is a visible "Refreshed at 3:24pm" timestamp with a small refresh button on the weather hero card.

**No distance from my location on walk cards.** Walk cards in the Walks tab show distance (how long the walk is) but not "X miles from you." On AllTrails, walk cards show both. A user selecting between a 3-mile walk and a 4-mile walk needs to also know if one requires a 45-minute drive. The walk distance and the distance-from-location are different pieces of information and both are necessary for route selection. The `sniffout_session` stores the user's lat/lon — calculating walk-to-user distance is possible client-side.

---

## 10. OPEN FEEDBACK

**The `meDisplayName` empty span is still a problem.** The HTML has `<span class="me-name" id="meDisplayName"></span>` — an empty span at the top of the Me tab. The `.me-name.me-name-placeholder` CSS class exists to style a placeholder state. But this placeholder is only applied by JS. On initial HTML paint, before JS runs, the avatar and an invisible element appear side by side. On slow devices this is a visible flash. The HTML should have a default placeholder text baked in that JS replaces — `<span class="me-name me-name-placeholder" id="meDisplayName">Sniffout</span>` would be a safe default.

**The install prompt secondary copy deviates from the spec.** `install-prompt-spec.md` specifies "One tap to check before your next walk." The implemented HTML says "One tap and you're ready to go." These mean different things. The spec copy is benefit-specific (the benefit is speed before a walk); the implemented copy is generic. This is worth fixing to the spec version.

**The `ws-verdict--caveat` colour `#2D7A5A` is hard-coded** (line 1105). Every other verdict badge colour adapts via `var(--brand)`, `var(--amber)`, or `var(--red)`. The caveat badge stands alone as a hard-coded hex. This should use a token or at minimum should have a dark mode override.

**The stale meta description remains.** Line 6: `content="Discover 25 handpicked UK dog walks..."`. This was flagged as Blocker B3 in the previous review. The number is wrong and the copy is wrong. This is what appears in Google search results and social share previews. It should read: `content="Sniffout — discover handpicked UK dog walks with live weather checks, paw safety alerts and dog-friendly spots."` The number should be omitted entirely since it is dynamic.

**The `@latest` CDN dependency for Lucide** (line 27) should be pinned to a specific version for production. `https://unpkg.com/lucide@0.436.0` (or whatever the current stable version is) would lock the icon set. Using `@latest` means a library update can silently break icons in production.

**Walk tags use `border-radius: 6px` (walk list cards), `border-radius: 8px` (walk detail), and `border-radius: 20px` (condition chips).** Three different radii for tags and chips in walk-related contexts. The detail tag and walk tag should use the same radius. `border-radius: 8px` is the right choice — it's modern without being pill-shaped.

**The `trail-heart` in Sniffout Picks carousel is 28×28px** (lines 2863-2866). The `walk-heart` on full walk list cards is 44×44px (line 1333-1337). The `portrait-heart` is 44×44px (lines 891-895). The trail carousel card heart remains undersized. This was not flagged in the previous review and it has not been fixed. A user favouriting a walk from the Picks carousel will regularly miss this target.

**The `walk-detail-hero-heart` is 36×36px** (lines 3293-3305). The main heart button in the walk detail overlay hero image is 36px, not the standard 44px used elsewhere. This is the heart button that a user is most likely to tap at the end of viewing a walk detail.

**The Me tab statistics card uses `me-stat-card--primary` class** (line 3851) which has no corresponding CSS definition. The intended visual differentiation between the primary (miles) and secondary (walks) stats is lost. The two cards look identical. This is a regression from whatever the `--primary` modifier was intended to do.

---

## Prioritised findings

### BLOCKER — Fix before showing to anyone

**B1. Walk photos absent from all walk cards.** Every trail card, portrait card, and walk detail overlay shows a tiled image of the same photo (`placeholder-walk.jpg` shown as a fallback for every card). The fallback gradient is an improvement over solid green, but 65+ identical tiled-path images is still visually disqualifying. This is unchanged from the March 19 review. It is a content problem, not a code problem.

**B2. Stale meta description.** Line 6 still says "Discover 25 handpicked UK dog walks." This is the first thing Google and social share previews show. Fix to: `"Sniffout — handpicked UK dog walks with live weather checks, paw safety alerts and dog-friendly spots."`

---

### HIGH — Fix before soft launch

**H1. Walk stat zero state.** The Me tab stats show "0 miles walked / 0 walks logged / 0 contributions" by default. This is the coldest possible first impression for the retention feature. Fix by hiding the stats dashboard until the first walk is logged, or show dashes (`—`) with no number until data exists.

**H2. `trail-heart` in Sniffout Picks carousel is 28×28px.** The carousel is the most prominent walk-discovery surface in the app. The heart button is the primary save action and it is undersized. Fix to 36px minimum (44px preferred).

**H3. `walk-detail-hero-heart` is 36×36px.** The walk detail is the place where users make decisions. The favourite action in the hero image must be at minimum 44×44px.

**H4. Dark mode brand on surface fails WCAG AA.** `#5C7A63` on `#1F1F1F` is approximately 3.56:1 — below the 4.5:1 threshold for normal text. Any small brand-coloured text on surface backgrounds (venue distance, maps links, action text) fails in dark mode. This needs a stronger dark mode brand value or specific overrides for small text uses.

**H5. `meDisplayName` span starts empty.** The HTML renders an orphaned avatar with no adjacent name. Add a default placeholder to the HTML (`class="me-name me-name-placeholder"`, text "Sniffout") that JS replaces on load.

**H6. Active chip dark mode treatment fundamentally differs from light mode.** Light mode: solid filled brand. Dark mode: ghost chip with tinted text. A user who filters walks will see their active filters look different at night. Unify the active chip design across modes — the dark mode version should be a filled chip, possibly with a dark-mode-appropriate solid colour.

---

### MEDIUM — Fix in next polish round

**M1. `--border` in light mode should be `rgba(0,0,0,0.08)` not `#E5E7EB`.** The hard hex reads cool against the warm `#F7F5F0` background. The rgba token adapts and reads warm.

**M2. `wx-sheet-handle` is 32px; all other handles are 36px.** Unify to 36px.

**M3. Walk rating at 12px `--ink-2`.** Increase to 13px `var(--ink)` weight 500 or restructure the card to give rating more prominence.

**M4. Preview carousel in State A needs a label and tap behaviour.** Add a single line above: "WALKS_DB.length+ walks ready to explore" (or fixed label "100 walks ready"). Wire card taps to a gentle nudge toward the CTA rather than silent non-response.

**M5. `wx-verdict--caveat` background `#2D7A5A` is hard-coded.** Add a dark mode override. Ideally use a token.

**M6. Install prompt copy deviates from spec.** "One tap and you're ready to go." → "One tap to check before your next walk."

**M7. `me-stat-card--primary` CSS class does not exist.** Either add the CSS definition (with differentiated styling for the miles card) or remove the modifier from the HTML.

**M8. Walk tags use three different `border-radius` values.** Standardise walk-related chips/tags to `border-radius: 8px`.

**M9. `me-gear-btn` and `me-subpage-back` are 36×36px.** Technically below 44px minimum. Not critical actions, but correct for completeness.

**M10. Radius picker shows km, walk cards show miles.** Either rename to km across the board (breaking with the UK convention of miles), or update the radius picker labels to miles. Storing in miles and displaying in km is a disconnect that should be resolved.

---

### LOW — Polish pass

**L1. Right-edge carousel fades absent on walk carousels.** `.wx-hourly-fade::after` already implements this for the hourly scroll. Apply the same pattern to `.trail-carousel` and the State B portrait card row.

**L2. Dead CSS is accumulating.** `.hero-body`, `.cta-block`, `.dog-setup-*`, `.me-hero`, `.me-hero--empty`, `.preview-picks-header`, `.preview-picks-label`, `.preview-picks-prompt` appear unused. Remove to reduce file size and maintenance confusion.

**L3. Duplicate CSS definitions.** `.venue-card`, `.venue-icon`, and `.me-stats-row` are each defined twice. Remove the superseded definitions.

**L4. `lucide@latest` CDN should be pinned to a specific version** for production stability.

**L5. "Contributions" stat label is ambiguous.** Rename to something self-explanatory ("condition reports" or "local reports") or add a brief contextual label.

**L6. Saved Walks entry row uses a heart icon** (filled heart SVG) but Saved Walks includes both wishlist saves and favourites. The icon should reflect the content — a bookmark icon for wishlist, or a neutral label icon if both types are included.

**L7. "Find the spots" in the social proof strip could be clearer.** "Find dog-friendly spots" adds one word and removes ambiguity while keeping the cadence.

**L8. The `--amber` token value differs between code (`#D97706`) and CLAUDE.md (`#F59E0B`).** Reconcile. `#D97706` is the correct choice (darker, better contrast), so CLAUDE.md should be updated.

**L9. No "recently viewed" shortcut for returning users.** A recently-viewed walk chip in the recent-pills row would close the most common returning user friction.

**L10. No distance-from-location on walk cards.** Walk duration and walk length are shown; distance to the walk start is not. For planning, this is a meaningful gap.

---

## The top 3 before beta

If only three things can be fixed before the first external user sees the app:

**1. Walk photos.** Same as March 19. Still the right answer. No code fix replaces content.

**2. Me tab zero state.** Hide the stats dashboard on first load, or replace "0" with dashes. "0 miles walked / 0 walks logged" in the first card a user sees on the Me tab is anti-persuasion. This is two lines of JS.

**3. Trail carousel heart to 44px.** The Picks carousel is the most prominent walk surface in State A. It is the first thing that communicates what Sniffout's content looks like. The heart button on these cards at 28px means users who try to save a walk from the first screen they see will fail. Fix to 44px.
