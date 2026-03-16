# Sniffout v2 — Phase 1 Sign-Off Checklist

*Prepared by: Product Owner*
*Date: March 2026*
*Against: sniffout-v2.html (current build), developer-notes.md, design-verification-round1.md, validation-report-v2.md*

---

## 1. COMPLETED

### Core Build

- **sniffout-v2.html built from scratch** — clean build, no copy-paste from production file. Architecture confirmed: inline CSS + JS in a single HTML file, no build step, no modules.
- **5-tab navigation** — Today · Weather · Walks · Nearby · Me. Tab state persisted to `localStorage: sniffout_active_tab`. Bottom nav with filled/outlined SVG icons and correct active states.
- **CSS token system** — full v2 token set (`--brand`, `--bg`, `--surface`, `--border`, `--ink`, `--ink-2`, `--amber`, `--red`). Glassmorphism removed. `border-radius: 16px` card base.
- **Inter typography** — weights 400/500/600/700 via Google Fonts CDN. Fraunces and DM Sans removed.
- **Dark mode** — `body.night` class toggled by `weather.isDay` flag. `--brand: #6EE7B7` dark mode override in place (FIX 5.1).
- **Desktop coming soon screen** — viewport ≥768px or non-touch devices redirected to coming soon state.
- **PWA** — `manifest.json` and `sw.js` (network-first, cache key `sniffout-v2`) in place.
- **Custom domain** — `sniffout.app` via CNAME, GitHub Pages auto-deploy from main branch.

### WALKS_DB

- **25 curated UK walks** with full schema: `id, name, location, lat, lon, description, offLead, enclosed, livestock, hasStiles, hasParking, terrain, difficulty, imageUrl, badge, rating, reviewCount, distance, duration, source`.
- **`enclosed` field** added to all 25 entries (FIX 4.4). Chip renders on walk cards.
- **Brand-green placeholder** renders for entries without `imageUrl`. No broken image states.
- **`source: 'curated'`** on all WALKS_DB entries; `'places'` on Google-sourced results.

### API Integrations

- **Open-Meteo** — weather fetch (current + hourly). `fetchWeather(lat, lon)` implemented.
- **Google Places (New API)** — `POST /v1/places:searchText`. 4 categories: pubs, cafes, shops, vets. Parks and beaches removed (FIX 6.1).
- **Nominatim + postcodes.io** — UK geocoding. `geocodePostcode(pc)` implemented.
- **Overpass API** — green space fetch for Walks tab nearby section.
- **Leaflet 1.9.4** — map rendering on Walks and Nearby tabs.

### Feature Completeness

- **Today tab** — State A (no location: search input, recent search pills, social proof strip, preview walk cards with brand-green tint) and State B (weather hero card, walk verdict, condition pills, hazard card, nearest walks horizontal scroll).
- **Weather tab** — conditions grid, walk verdict block, hazard cards (rain/heat/wind/UV), paw safety block, 3-day forecast.
- **Walks tab** — curated walk cards with photo, badge, metadata, off-lead and terrain tags. Overpass green space section below. Radius picker.
- **Nearby tab** — Google Places venue cards with maps link. 4 category chips. Leaflet map. "Nearby" pill removed from green space cards (FIX 6.2). Google Maps deep link on venue cards (FIX 6.3).
- **Me tab** — greeting card, saved walks, stats row, settings.
- **Session persistence** — `sniffout_session` (8h TTL, location + weather). `restoreSession()` on load.
- **Favourites** — `sniffout_favs` array. Heart icon on walk cards. Me tab favourites section.
- **Walk verdict** — `getWalkVerdict(weatherData)` shared pure function. Used by Today and Weather tabs.

### Design Fix Rounds (Confirmed Done)

| Round | Fixes | Status |
|-------|-------|--------|
| Round 1–3 | FIX 1.x–3.x | ✅ All done |
| Round 4 (dev-brief-round4) | FIX 5.1–5.9 | ✅ All done |
| Round 5 (dev-brief-round5) | FIX 6.1–6.3 | ✅ All done |

---

## 2. OUTSTANDING

These items must be resolved before Phase 2 begins. The developer has been briefed on all of them via `developer-brief-round6.md` but implementation is not yet confirmed.

### Blocking — developer-brief-round6.md (FIX 7.0–7.5)

| Fix | Description | Severity |
|-----|-------------|----------|
| **FIX 7.0** | Badge regression: developer changed `badge: 'Sniffout Pick'` to `'Sniffout Picks'` (plural) across all WALKS_DB entries. Must revert to singular. Badge on individual cards = "Sniffout Pick". Section label = "Sniffout Picks". | HIGH |
| **FIX 7.1** | Trail card resize: featured cards 240px height, secondary 180px. `.trail-card-desc` 2-line clamp added. | MEDIUM |
| **FIX 7.2** | `renderGreenSpaceCard()` full rewrite: left-side 64×64px thumbnail layout. Photos retained. Visual hierarchy differentiated from curated walk cards. | MEDIUM |
| **FIX 7.3** | `environment` field added to all 25 WALKS_DB entries. Values: `woodland \| coastal \| urban \| moorland \| heathland \| open`. Required for Environment filter. | HIGH |
| **FIX 7.4** | Filter/sort bottom sheet for Walks tab (`#walks-filter-sheet`) and Nearby tab (`#nearby-filter-sheet`). Replaces inline radius picker. 6 filter groups on Walks (sort, radius, surface, environment, duration, off-lead, difficulty). Sort + radius on Nearby. Apply button pattern. In-memory filter state only. | HIGH |
| **FIX 7.5** | `saveRadius()` function check — confirm exists and is consistent with `sniffout_radius` localStorage key. | LOW |

### Blocking — Design Issues (from design-verification-round1.md)

| Ref | Description | Severity |
|-----|-------------|----------|
| **Issue 4 (partial)** | Off-lead tag renders incorrectly for "Partial" walks. `renderTrailCard()` at line ~2707 does not pass `ol.cls` variable. CSS rule `.trail-tag.partial { color: var(--amber); background: rgba(217,119,6,0.08); }` is missing. "Partial off-lead" shows brand-green instead of amber. | MEDIUM |
| **New Issue A** | Paw safety safe state never renders. `getPawSafety()` returns `null` for temperatures 0–25°C. `if (paw)` guard in `renderWeatherTab()` skips block entirely for normal UK temperatures. Fix: return safe state object for 0–25°C range; update `pawClass` ternary to handle 3 states (safe / caution / danger). Paw safety should always be visible on the Weather tab — it is a core feature. | HIGH |

### Non-Blocking — Copy

| Ref | Description | Priority |
|-----|-------------|----------|
| **TA-1** | Social proof strip currently reads "Live conditions". Design verification recommends reverting to "Works offline" (the confirmed approved string from copy-review.md and po-action-plan.md). "Works offline" is factual and durable; "Live conditions" implies always-on connectivity. | LOW |

---

## 3. KNOWN LIMITATIONS

These are constraints of the current architecture. They are accepted for Phase 1 and do not require fixes.

| Limitation | Notes |
|-----------|-------|
| **WALKS_DB is static — 25 walks** | Social proof strip correctly reads "50+ handpicked UK walks" (a forward-looking claim as database grows — confirmed acceptable). No backend means walk additions require a code deploy. |
| **All persistence is localStorage** | No cross-device sync. Favourites, reviews, username, and radius are device-local. This is by design for the POC. Me tab copy acknowledges this ("Your data stays on your phone"). |
| **Weather requires internet** | Open-Meteo calls fire on location set. If offline, the session cache (8h TTL) is the fallback. App functions without weather but Today/Weather tabs are degraded. |
| **Google Places API key is hardcoded** | Acceptable for a single-file PWA at POC stage. Key is scoped to Places API only. |
| **No marker clustering** | Deferred per CLAUDE.md. Maps may show overlapping pins at low zoom. Acceptable for current venue density. |
| **Walk count capped at WALKS_DB entries** | 25 curated walks. Overpass supplements with green spaces but these have reduced metadata. Walk density is uneven across UK regions. |
| **3-day forecast only** | Weather tab forecast limited to 3 days. Design verification (WT-2) flags this should extend to 5–6. Deferred to Phase 2 polish. |
| **Filter state is in-memory only** | Filter selections reset on tab switch. This is the approved pattern for Phase 1 (no localStorage persistence for filters). |
| **No `uv_index` from Open-Meteo** | UV index not yet fetched. Paw safety heuristic uses temperature only, not the approved `temp > 22°C AND uv_index > 5 AND time 10am–6pm` threshold. Full UV logic is Phase 3. |

---

## 4. DEFERRED TO PHASE 2

The following were in scope for investigation or design during Phase 1 but are deferred for implementation:

### UX Improvements

- **Sticky Sniffout Picks** — investigate sticky positioning for the curated walk section header while green space results scroll below on the Walks tab. Needs UX design before developer brief. *(New — added at Phase 1 close.)*
- **Walk detail overlay** — full `position: fixed` slide-up overlay with hero image, practical details grid, embedded Leaflet map, nearby venues (top 3), and share button. Scoped for Phase 2 (Walk tab enhancement).
- **Weather suitability banner** — thin amber strip on Walks tab when a hazard is active. Adjusts walk sort order (sheltered/woodland routes first on hot days). Scoped for Phase 2.
- **Forecast extension** — extend Weather tab forecast from 3 days to 5–6 days (WT-2 from design-verification-round1.md). Included in Phase 2 weather enhancement pass.
- **Weather verdict block placement** — verdict body card should appear before walk cards on Weather tab (TB-2 from design-verification-round1.md). Minor layout fix, deferred to Phase 2 weather polish.
- **Weather verdict block container** — verdict block uses inline styles without a card container (WT-1). Deferred to Phase 2 weather polish.

### Research Briefs

- **Community Engagement research brief** — investigate incentive models for walk submissions and reviews. Inform Phase 3 community features. *(New — added at Phase 1 close.)*

### Designer Work

- **Designer Round 2 verification sweep** — `designer-brief-round2.md` issued. Awaiting developer to complete Round 6 fixes before Designer begins. Full sweep covers V1–V9 consistency items, Today tab State B review, Weather tab review, new components.
- **Today tab State B visual design** — T1–T5 items in designer-brief-round2.md. Includes weather hero card, verdict section, hazard card, hidden gems section.
- **Walk detail overlay design** — new UI component. Scoped in Phase 2.

### Features

- **Pollen** — Open-Meteo `european_aqi` endpoint. Phase 3.
- **UV index fetch** — add `uv_index` parameter to Open-Meteo call. Phase 3.
- **Breed personalisation** — four-category system (flat-faced / thick-coated / small-thin / standard). Phase 3 / post-POC.
- **Walk completion / passive tracking** — `sniffout_explored` set. Low priority until core discovery UX is validated.
- **Firebase / backend / push notifications / native app** — confirmed deferred indefinitely per CLAUDE.md.
- **Community features** — walk submission, community tab, user-generated content. Confirmed deferred per CLAUDE.md.

---

## 5. SIGN-OFF RECOMMENDATION

### Recommendation: **NOT READY — Phase 1 cannot be signed off yet**

**Phase 2 must not begin until the following are resolved:**

| Blocker | Owner | Brief |
|---------|-------|-------|
| developer-brief-round6.md (FIX 7.0–7.5) | Developer | All 6 fixes must be implemented and confirmed in developer-notes.md |
| New Issue A — paw safety safe state | Developer | `getPawSafety()` must return safe state for 0–25°C; `if (paw)` guard removed or updated |
| Issue 4 partial — `.trail-tag.partial` | Developer | CSS rule added; `ol.cls` passed in `renderTrailCard()` |

Once all three are resolved, Phase 1 can be signed off and the following can proceed concurrently:

- **Designer begins Round 2 verification sweep** (designer-brief-round2.md)
- **Phase 2 planning session** — sticky Sniffout Picks UX investigation, walk detail overlay design
- **Community Engagement research brief** initiated

The TA-1 copy issue ("Live conditions" → "Works offline") is not a hard blocker but should be bundled into the Round 6 developer session as a single-line fix.

---

*Phase 1 sign-off is contingent on developer confirmation in developer-notes.md that all items listed under OUTSTANDING section 2 are complete.*
