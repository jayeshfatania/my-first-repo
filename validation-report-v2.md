# Sniffout v2 — Phase 1 Validation Report (v2)
*Validator review against: phase1-build-brief.md, copy-review.md, design-spec.md, mockup.html*
*File reviewed: sniffout-v2.html (2,885 lines — full rebuild from scratch)*
*Date: 2026-03-14*

---

## Summary

The rebuild is **substantially correct and shippable with one data fix**. All copy strings are correct. CSS tokens match mockup.html. SVG nav icons are in place. State A/B logic works. Preview cards are built correctly. Every approved copy string — verdicts, hazard titles, paw safety, rain summaries, best walk window — passes verbatim. The critical issues from the prior validation report (emoji nav, wrong copy, lock overlay, emoji fallback) are resolved.

One medium issue must be addressed before shipping: the WALKS_DB has 25 entries but the social proof strip claims "50+ handpicked UK walks". These are in conflict. One or the other must be corrected. All other items are low-priority or informational.

---

## 1. Medium — Fix Before Ship

### 1.1 WALKS_DB has 25 entries; social proof claims 50+

**WALKS_DB entries:** 25 (lines 1905–2157)
**Social proof strip (line ~1060):** `50+ handpicked UK walks · Works offline · Dog-specific routes`

The database and the marketing copy are in conflict. Either:
- (a) Add 25+ more WALKS_DB entries to reach 50+, **or**
- (b) Update the social proof strip to match the actual count (e.g. `25 handpicked UK walks` or `Growing library of UK walks`)

**If (a):** new entries must follow the v2 schema — `id`, `name`, `lat`, `lon`, `description`, `distance`, `duration`, `difficulty`, `terrain`, `offLead`, `livestock`, `badge`, `rating`, `reviewCount`, `imageUrl: ''`, `source: 'curated'`. No `icon` field.

**If (b):** update line containing `50+ handpicked UK walks` in the social proof strip, and also update the `<meta name="description">` if it references 50+.

---

## 2. Design Issues — Low Priority

### 2.1 Filter chips (Walks tab) are visual-only — no filtering logic

**Lines 2396–2402**

Chips toggle their active state on tap but do not filter the walk list. Tapping "Off-lead" or "Easy" leaves all 25 walks visible. This is **explicitly deferred to Phase 2** in the code comment (`/* ─── Filter chip visual toggle (logic: Phase 2) ─── */`), so it is not a bug — but it creates confusing UX where the chips appear interactive but have no effect.

**Options:**
- (a) Accept as-is for Phase 1 and add a brief note or disabled appearance to signal they're coming, **or**
- (b) Implement basic filter logic now: filter `WALKS_DB` by `offLead` for the "Off-lead" chip, by `difficulty` for "Easy"/"Moderate", etc.

### 2.2 Dark mode — `--brand` colour not overridden in `body.night`

The `body.night` CSS block correctly adjusts `--bg`, `--surface`, `--ink`, `--ink-2`, and `--border` for dark mode. However `--brand` remains `#1E4D3A` (dark green) in dark mode. On dark backgrounds this renders as dark-on-dark for brand-coloured elements: the CTA button, active nav item, active chip state, and the preview card body tint (`rgba(30,77,58,0.06)`).

design-spec.md specifies `--brand: #6EE7B7` (light teal) for dark mode. Whether this spec is still current is a PO call, but the current dark mode treatment has a low-contrast issue on the primary button and active states.

**Recommended:** Add `--brand: #6EE7B7;` to the `body.night` CSS block.

---

## 3. Copy Issues — None

All approved strings are implemented correctly. Specifically confirmed:

- All 11 `getWalkVerdict()` verdict titles and bodies — **pass**
- All 8 `detectHazards()` hazard titles — **pass**
- `getPawSafety()` all 3 states (danger/caution/safe) — **pass**
- All 4 `getRainSummary()` strings — **pass**
- Both `getBestWindow()` strings (good/poor conditions) — **pass**
- Hero headline `Discover great walks` (no period) — **pass**
- Subline `Handpicked walks. Live conditions.` — **pass**
- Search error `We couldn't find that — try a postcode (e.g. SW11) or a place name.` — **pass**
- Me tab favourites empty state `Heart any walk to save it here.` — **pass**
- Walks empty state `Nothing matching those filters right now. Show all walks →` — **pass**
- Social proof `50+ handpicked UK walks · Works offline · Dog-specific routes` — **present** (but see 1.1)
- No prohibited strings (`free`, `no sign-up`, `no account`, `no login`) — **pass**
- 🐾 emoji used only in paw safety block (lines 1682, 1685, 1689, 1799) — **pass**

---

## 4. Polish / Informational

### 4.1 Filter chips empty state is unreachable

The `walks.length === 0` branch in `renderWalksTab()` (line 2337) can never trigger because no filtering logic is applied — the function always renders all walks. The empty state copy is correct but dead code until filter logic is added in Phase 2. No action needed now.

### 4.2 Nearby tab uses Overpass API instead of Google Places

The original `dog-walk-dashboard.html` used the Google Places API for venue data. The rebuild uses the OpenStreetMap Overpass API (`overpass-api.de/api/interpreter`). This is a material architectural change — no API key required, no billing exposure, broader data coverage. The switch is a net positive. Noting for PO awareness.

### 4.3 `getWalkVerdict()` hot condition uses actual temperature, not feels-like

**Line ~1602** (hot condition check): `cur.temperature_2m > 28`

The spec description implies feels-like (`feelsLike > 28`). Using actual temperature is consistent with how hazard detection handles heat elsewhere in the code — this is a defensible implementation choice. Minor discrepancy; no user-facing impact in most cases.

### 4.4 "free" in WALKS_DB descriptions

Walk descriptions contain "freely" (e.g. "Dogs can run freely", "Ponies and cattle roam freely"). These are descriptive, not product promises. No action required — consistent with finding in prior validation report.

---

## 5. Confirmed Correct

The following pass validation against all reference documents:

**Architecture:**
- ✅ Built entirely from scratch — no dog-walk-dashboard.html patterns detected
- ✅ Single-file PWA — inline CSS, JS, HTML with no build step
- ✅ Phase-based JS structure (A–G) — clear, non-overlapping
- ✅ Service worker registration at `/sw.js` ✅
- ✅ Five tabs only (today/weather/walks/nearby/me) — no Community tab ✅
- ✅ No onboarding overlay ✅

**Design:**
- ✅ CSS tokens match mockup.html: `--brand: #1E4D3A`, `--bg: #F7F5F0`, `--surface: #FFFFFF`, `--border: #E5E7EB`, `--ink: #111827`, `--ink-2: #6B7280`, `--amber: #D97706`, `--red: #DC2626`, `--brand-mid: #2E7D5E`, `--chip-off: #D1D5DB`
- ✅ Inter font (Google Fonts CDN, 400/500/600/700)
- ✅ Bottom nav: SVG icons (not emoji), labels Today · Weather · Walks · Nearby · Me
- ✅ State A nav dimming (`nav.state-a`) — Today-only active
- ✅ Walk card photo area: 180px height, `background: #1E4D3A` fallback, no emoji icon
- ✅ Walk card border: `1px solid var(--border)`, `border-radius: 16px`
- ✅ Walk card badge: bottom-left position, `rgba(0,0,0,0.55)` dark pill, white text — consistent with mockup.html
- ✅ Walk card tags: off-lead status chip + livestock chip only (no generic tags array)
- ✅ Walk card heart: top-right of photo area
- ✅ State A preview cards: brand-green gradient + `rgba(0,0,0,0.25)` mute overlay, bottom-left badge, no lock overlay, no emoji
- ✅ Preview card body tint: `rgba(30,77,58,0.06)` background, `rgba(30,77,58,0.15)` border
- ✅ Weather preview card present in State A
- ✅ Search input: starts hidden, expands via CSS `max-height` transition on tap
- ✅ `body.night` dark mode present and functional

**Data:**
- ✅ WALKS_DB v2 schema: `imageUrl: ''` present on all entries, no `icon` field, correct fields (`offLead`, `livestock`, `terrain`, `difficulty`, `badge`, `rating`, `reviewCount`, `distance`, `duration`, `source`)
- ✅ `isPushchairFriendly` — not present
- ✅ `badge: undefined` entries handled correctly (no badge rendered)

**Copy:**
- ✅ Page title: `Sniffout — Dog walks & weather for the UK`
- ✅ Meta description: correct, no "Free, no sign-up"
- ✅ Hero headline: `Discover great walks` (no period)
- ✅ All 11 verdict strings — verbatim match to copy-review.md Section 6
- ✅ All 8 hazard titles — verbatim match to copy-review.md Section 7
- ✅ Paw safety: all 3 state titles and safe-state body — correct
- ✅ Rain section: all 4 strings correct
- ✅ Best walk window: both good/poor variants correct
- ✅ Em dashes (`—`) used correctly throughout
- ✅ No prohibited strings: `free` (as product promise), `no sign-up`, `no account`, `no login`

**Functionality:**
- ✅ Location flow: GPS + postcode both wired to `loadWeatherAndShow()`
- ✅ Session persistence: 8-hour TTL via `localStorage`
- ✅ Favourites: toggle, persist, render in Me tab
- ✅ Explored walks: tracked in `localStorage` for Me tab stats
- ✅ Me tab: display name inline edit, radius cycle, dark mode cycle — all wired
- ✅ Nearby tab: Overpass fetch, venue list + map toggle, category filter chips — functional
- ✅ `escHtml()` sanitisation on user-visible venue names

---

## Fix Priority Order

1. **WALKS_DB count vs social proof conflict** (1.1) — resolve before ship: either add 25+ entries or update copy
2. **Dark mode `--brand` override** (2.2) — one CSS line; fix improves dark mode legibility on all brand-coloured elements
3. **Filter chips** (2.1) — accept as Phase 2 deferral or add basic logic; PO to confirm
