# UX/UI Review — sniffout-v2.html
**Date:** 22 March 2026
**Method:** Code-only analysis. No rendering. All line numbers reference the current `sniffout-v2.html`.

---

## Summary verdict

The app has a coherent design system on paper but the implementation is undermined by three production-breaking bugs that will actively harm users on first contact: a `beforeunload` dialog that fires on every navigation attempt, dark mode auto-overriding user preference on weather fetch, and hardcoded debug copy left in a UI element. Below these are a cluster of tap target failures, a ghost CSS class, hardcoded unit strings that ignore user preferences, and an unversioned CDN dependency that can break the app silently at any time.

---

## Prioritised findings

### BLOCKER — Fix before showing to anyone

**[B1] `renderWeather()` hijacks dark mode based on API data.**
`renderWeather()` applies or removes `body.night` based on `cur.is_day === 0` (lines ~5401–5405). Dark mode is supposed to be a user-controlled toggle in Settings, not an automatic weather state. This silently overrides whatever the user set. If a user sets light mode at 7pm, the next weather fetch snaps them to dark. The whole "Auto" / "Manual" settings distinction is rendered meaningless.
**Fix:** Remove the `body.night` manipulation from `renderWeather()` entirely. Auto mode already handled separately via `prefers-color-scheme`.

**[B2] `window.beforeunload` fires a browser leave-page dialog on every navigation.**
Lines 6249–6252 set `e.returnValue = ''` unconditionally. On mobile Chrome/Safari this pops a system "Leave page?" sheet whenever the user tries to navigate away — including when using the hardware back button to close a sheet. This is the most intrusive UX anti-pattern possible on a PWA intended to feel native.
**Fix:** Remove the `beforeunload` handler entirely, or set `returnValue` only when there is genuinely unsaved in-progress data (e.g. a partially filled form).

**[B3] Hardcoded debug copy inside `renderWishlistBtn()`.**
The function renders a hardcoded `<p>` element containing `"Add to our walk list"` (line ~6268). This text is visible in the walk detail actions row for every walk. It reads like a placeholder or debugging label that was never removed.
**Fix:** Remove the `<p>` element. If instructional copy is needed, align with approved copy strings.

**[B4] `btoa()` in `getDeviceId()` throws on non-ASCII user agents.**
`btoa(navigator.userAgent + screen.width + screen.height)` (line ~6686) will throw a `DOMException` on any browser whose user agent string contains non-ASCII characters (Chrome on some Android OEM builds, localised browsers). `btoa` only accepts Latin-1. An uncaught throw here will break all downstream code that calls `getDeviceId()`, including the condition tag system.
**Fix:** Wrap in a try/catch, or use `btoa(unescape(encodeURIComponent(...)))` to handle non-ASCII safely.

---

### HIGH — Fix before soft launch

**[H1] `trail-heart` tap target is 28×28px.**
`.trail-heart { width: 28px; height: 28px; }` (lines 2863–2866). WCAG 2.5.5 requires 44×44px minimum. This is the heart button on every walk card in the Walks tab. With a 28px target, users will reliably miss it and either open the walk detail or give up.
**Fix:** Increase to `min-width: 44px; min-height: 44px`. Adjust padding to preserve visual size.

**[H2] `walk-detail-hero-heart` tap target is 36×36px.**
`.walk-detail-hero-heart { width: 36px; height: 36px; }` (lines 3293–3305). Still 8px short. This is the favourite button on the most-used screen in the app — the walk detail overlay.
**Fix:** As above — pad to 44×44px minimum.

**[H3] `me-stat-card--primary` CSS class is referenced in HTML but has no definition.**
Line 3851 applies `me-stat-card--primary` to the walks stat card. This class does not exist anywhere in the stylesheet. The primary stat card has no visual differentiation from the secondary ones — the intended emphasis is absent.
**Fix:** Add the CSS definition, or remove the class from the HTML if the design no longer requires a primary stat.

**[H4] Stats show hardcoded "0" before JS runs.**
The Me tab stat cards have `0` baked into the HTML (lines 3852–3863). JS overwrites these on `updateMeStats()`, but there is a visible flash of "0 walks · 0 explored · 0 saved" before JS executes. On a slow device or cold load, this is what the user reads first.
**Fix:** Use `&nbsp;` or an en-dash as the placeholder value, or hide the stats row until JS has populated it.

**[H5] Meta description hardcodes stale walk count.**
`<meta name="description" content="Discover 25 handpicked UK dog walks...">` (line 6). WALKS_DB has well over 25 entries. This is the text shown in Google search results and link previews.
**Fix:** Update the copy. Use a generic phrasing or pull from `WALKS_DB.length` at build time.

**[H6] `lucide@latest` is an unversioned CDN dependency.**
Line 27 loads Lucide icons via `@latest`. Any breaking change in a Lucide release will silently break every icon in the app with no warning and no rollback. This is a live production risk — the app has no build step to catch this.
**Fix:** Pin to a specific version (e.g. `lucide@0.344.0`). Review Lucide's changelog to confirm current usage is compatible before pinning.

**[H7] Portrait cards and trail cards hardcode `' mi'` — ignores user units preference.**
`renderPortraitCard()` builds `walk.distance.toFixed(1) + ' mi · '` (line 9667). `renderTrailCard()` builds `walk.distance.toFixed(1) + ' mi · '` (line 9703). The `formatDist()` helper exists precisely for this, and is used correctly elsewhere.
**Fix:** Replace both raw distance strings with `formatDist(walk.distance)`.

**[H8] `renderWalksTab` location context header hardcodes 'km'.**
`locationCtx = 'Within ' + radiusKm + ' km of ' + locationName` (line 9784) always says 'km' even when the user has selected miles. Same pattern in `renderWalksTabWithResults` (line 9847).
**Fix:** Branch on `getSavedUnits()` to render the correct unit label.

**[H9] `wx-verdict--caveat` uses a hardcoded colour with no dark mode override.**
`.wx-verdict--caveat { background: #2D7A5A; }` (line ~1105). This is a fixed hex value that is neither a CSS token nor overridden in the `body.night` block. In dark mode, it will render the same mid-green on a near-black surface — likely to be too bright and out of palette.
**Fix:** Map this to a CSS custom property, or add a `body.night .wx-verdict--caveat` override.

**[H10] OS Leisure Maps API key is hardcoded in plaintext.**
`var OS_API_KEY = 'JcMmulbTghzn8pkYAGdxd8MH6GTK2314';` (line 10134). The key is visible in the source of a public GitHub Pages site. Anyone viewing source can extract and abuse it.
**Fix:** Route OS tile requests through the existing Cloudflare Worker proxy (`places-proxy.sniffout.app`) or a separate proxy, so the key is server-side only.

---

### MEDIUM — Fix in next polish round

**[M1] Inconsistent swipe-dismiss thresholds between sheets and walk detail.**
`initWalkDetailSwipe()` uses a 150px threshold (line ~6122); `addSheetSwipe()` uses 100px (line ~6142). Users will develop muscle memory from one and find the other unresponsive or too eager.
**Fix:** Standardise to a single threshold (100px is more responsive; 150px if swiping through content is a concern).

**[M2] Duplicate CSS rules with conflicting values.**
`.venue-card` is defined twice (lines ~1398 and ~1451). `.me-stats-row` is defined twice with conflicting `display` values (lines ~1539 and ~2149). Whichever declaration wins depends on order — this is fragile and unpredictable.
**Fix:** Consolidate each to a single declaration. Remove the duplicate.

**[M3] `wx-tile-chevron` uses a text character, not an icon.**
`&#8250;` (the single right angle quotation mark `›`) is used as the expand chevron on weather tile cards (line ~1132). Every other chevron in the app uses either an SVG or Lucide icon. `›` is not a proper directional indicator — it's a typographic character and will render inconsistently across fonts.
**Fix:** Replace with an inline SVG chevron or a `luIcon('chevron-right', ...)` call.

**[M4] Filter chips in Walks tab do visual toggle only — no filtering.**
The filter chip row has `/* logic: Phase 2 */` commented inline (line 10094). The click handler removes and adds the `.active` class but performs no filtering. Tapping a filter chip appears to do something (active state changes) but the walk list does not change.
**Fix:** Either implement filtering, or hide the filter row entirely until Phase 2 is ready. Showing non-functional UI controls breaks user trust.

**[M5] `renderMeWalkLog()` and `meExpandWalkLog()` duplicate 20+ lines of row-building code.**
Both functions independently build `.me-walk-row` elements with identical logic (lines 8795–8814 and 8836–8855). Any bug fix or design change must be made in both places.
**Fix:** Extract the row-building logic into a shared `buildMeWalkRow(entry, walkById)` helper.

**[M6] Dead CSS accumulates throughout the stylesheet.**
Classes including `.hero-body`, `.cta-block`, `.dog-setup-*`, `.me-hero`, `.me-hero--empty`, `.preview-picks-header`, `.preview-picks-label`, `.preview-picks-prompt` have no corresponding HTML and are not generated dynamically. Each one makes the stylesheet harder to reason about.
**Fix:** Delete unused rules. They will not be needed — the HTML they matched has been replaced.

**[M7] `renderCondTagSheet()` uses inline style strings instead of CSS classes.**
The sheet header is built with `style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px;"` and `style="font-size:13px;color:var(--ink-2);"` (lines 6737–6740). These are not responsive to dark mode token overrides at a glance and are harder to maintain than named classes.
**Fix:** Extract to `.cond-sheet-title` and `.cond-sheet-subtitle` classes in the stylesheet.

---

### LOW — Polish pass

**[L1] Older conditions toggle uses Unicode text arrows instead of Lucide.**
`toggleOlderReports()` sets `arrow.textContent = '↓'` or `'↑'` (line 6632). The journal row chevron uses `&#x25B2;`/`&#x25BC;` Unicode triangles (line 8906). Both are inconsistent with the rest of the UI which uses Lucide's `chevron-down` / `chevron-up`.
**Fix:** Swap for `luIcon('chevron-down', ...)` / `luIcon('chevron-up', ...)` and update via `syncIcons()`.

**[L2] "See all N ->" uses ASCII arrow instead of `→`.**
`seeAllEl.textContent = 'See all ' + reversed.length + ' ->'` (line 8819). Every other "see all" or navigation prompt in the app uses the proper `→` Unicode character or an SVG.
**Fix:** Use `'\u2192'` or `'→'`.

**[L3] `CATEGORY_ICON` map uses emoji for Nearby venues.**
`pub: '🍺', cafe: '☕', vet: '🏥', shop: '🛍️'` (lines 10213–10218). These are emoji used as interface icons, which is inconsistent with the SVG/Lucide icon system used throughout the rest of the app.
**Fix:** Replace with Lucide icon names and render via `luIcon()`, consistent with all other icon usage.

**[L4] `renderWalkCard()` omits `escHtml()` on walk name.**
`'<div class="walk-name">' + walk.name + '</div>'` (line 9631) does not escape the walk name. `renderTrailCard()` uses `escHtml(walk.name)` correctly (line 9724). The walk name is currently hardcoded in WALKS_DB, so this is not an active XSS vector, but the inconsistency means any future dynamic name source (user input, Places API) will silently introduce a vulnerability.
**Fix:** Wrap with `escHtml(walk.name)` to match the other card renderers.

**[L5] Portrait card placeholder skips the brand background used by walk cards.**
`renderPortraitCard()` sets `var photoStyle = walk.imageUrl ? '' : '';` (line 9649) — effectively doing nothing for missing images. `renderWalkCard()` correctly sets `background:var(--brand);` for missing images (line 9604). Portrait cards with no image will render with a transparent/white photo area.
**Fix:** Set `photoStyle = walk.imageUrl ? '' : 'background:var(--brand);';` to match `renderWalkCard`.

**[L6] `renderGreenSpaceCard` always shows distance in km regardless of units preference.**
`distText` is built with `distKm.toFixed(1) + ' km away'` (line 9736). No check of `getSavedUnits()`.
**Fix:** Branch on the saved units preference, matching the pattern used in `formatDist()`.
