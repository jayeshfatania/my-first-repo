# Sniffout v2 — Phase 1 Sign-Off Checklist

*Prepared by: Product Owner*
*Signed off: March 2026*
*Against: sniffout-v2.html (current build), developer-notes.md, design-verification-round1.md, validation-report-v2.md*

---

## ✅ PHASE 1 SIGNED OFF — READY TO MOVE TO PHASE 2

All blockers identified in the original sign-off checklist have been resolved and confirmed in developer-notes.md Round 6 session. Phase 2 planning can begin.

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

- **25 curated UK walks** with full v2 schema: `id, name, location, lat, lon, description, offLead, enclosed, livestock, hasStiles, hasParking, terrain, environment, difficulty, imageUrl, badge, rating, reviewCount, distance, duration, source`.
- **`enclosed` field** — added to all 25 entries (FIX 4.4). `enclosed: true` for Richmond Park only; `false` for all others.
- **`environment` field** — added to all 25 entries (FIX 7.3). Values: `woodland / coastal / urban / moorland / heathland / open`.
- **Brand-green placeholder** renders for entries without `imageUrl`. No broken image states.
- **`source: 'curated'`** on all WALKS_DB entries; `'places'` on Google-sourced results.

### API Integrations

- **Open-Meteo** — weather fetch (current + hourly). `fetchWeather(lat, lon)` implemented.
- **Google Places (New API)** — `POST /v1/places:searchText`. 4 categories: Pubs · Cafés · Pet Shops · Vets. Parks and beaches removed from Nearby tab (FIX 6.1).
- **Nominatim + postcodes.io** — UK geocoding. `geocodePostcode(pc)` implemented.
- **Overpass API** — green space fetch for Walks tab supplementary section.
- **Leaflet 1.9.4** — map rendering on Walks and Nearby tabs.

### Feature Completeness

- **Today tab** — State A (search input, recent search pills with star/unstar, social proof strip, Sniffout Picks preview carousel) and State B (weather hero card, walk verdict, condition pills, hazard card, Sniffout Picks nearby horizontal scroll, hidden gems section).
- **Weather tab** — conditions grid, walk verdict block, hazard cards (rain/heat/wind/UV), paw safety block (always visible — safe/caution/danger), 3-day forecast.
- **Walks tab** — curated walk cards (240px wide, 180px photo, 2-line description) with photo, badge, heart, metadata, off-lead and terrain tags. Overpass green space section below (64×64px left-thumbnail layout). Filter/sort bottom sheet with 6 filter groups.
- **Nearby tab** — Google Places venue cards with photos. 4 category chips (Pubs · Cafés · Pet Shops · Vets). Leaflet map. Google Maps deep link on venue cards. Filter/sort bottom sheet (sort + radius).
- **Me tab** — greeting card, saved walks, stats row, settings.
- **Session persistence** — `sniffout_session` (8h TTL, location + weather). `restoreSession()` on load.
- **Favourites** — `sniffout_favs` array. Heart icon on walk cards. Me tab favourites section.
- **Walk verdict** — `getWalkVerdict(weatherData)` shared pure function. Used by Today and Weather tabs.
- **Radius control** — `getSavedRadius()` / `saveRadius()` / `setRadius()`. Default 5km. Stored to `sniffout_radius`.

### Design Fix Rounds (All Confirmed Done)

| Round | Brief | Fixes | Status |
|-------|-------|-------|--------|
| Rounds 1–3 | Various | FIX 1.x–3.x | ✅ Done |
| Round 4 | developer-brief-round4.md | FIX 5.1–5.9 (dark mode, map fix, trail heart, tag style, label hierarchy, section labels) | ✅ Done |
| Round 5 | developer-brief-round5.md | FIX 6.1–6.3 (remove parks/beaches; remove Nearby pill; add Google Maps link) | ✅ Done |
| Round 6 | developer-brief-round6.md | FIX 7.0–7.5 + Issue A + Issue 4 partial + TA-1 | ✅ Done |

### Phase 1 Blockers — All Resolved (Round 6)

| Item | Description | Resolution |
|------|-------------|------------|
| FIX 7.0 | Badge regression: `'Sniffout Picks'` → `'Sniffout Pick'` on WALKS_DB badge values | ✅ Reverted |
| FIX 7.1 | Trail card resize: 240px wide, 180px photo, 2-line description | ✅ Done |
| FIX 7.2 | Green space card: 64×64px left-thumbnail layout, photos retained | ✅ Done |
| FIX 7.3 | `environment` field on all 25 WALKS_DB entries | ✅ Done |
| FIX 7.4 | Filter/sort bottom sheet for Walks tab and Nearby tab | ✅ Done |
| FIX 7.5 | `saveRadius()` function confirmed as thin localStorage wrapper | ✅ Done |
| Issue A | Paw safety safe state: `getPawSafety()` now returns safe state for 0–25°C; block always renders | ✅ Done |
| Issue 4 partial | `.trail-tag.partial` CSS added; `ol.cls` applied in `renderTrailCard()` | ✅ Done |
| TA-1 | Social proof strip copy — see copy note below | ✅ Done (with override) |

**TA-1 copy note:** The developer implemented TA-1 as `"Works offline"` per the original approved string (developer-notes.md confirms this). Owner subsequently confirmed a final copy override: the string is now `"Just open and explore"`. This supersedes the approved copy. Social proof strip on Today tab State A now reads: `25 handpicked UK walks · Just open and explore · Dog-specific routes`. Approved by owner at Phase 1 close.

---

## 2. OUTSTANDING

None. All items from the original Outstanding section have been resolved.

---

## 3. KNOWN LIMITATIONS

These are accepted constraints of the current architecture. They do not require fixes.

| Limitation | Notes |
|-----------|-------|
| **WALKS_DB is static — 25 walks** | No backend means walk additions require a code deploy. Social proof strip correctly reads "25 handpicked UK walks". |
| **All persistence is localStorage** | No cross-device sync. Favourites, reviews, username, and radius are device-local. Me tab copy acknowledges this. |
| **Weather requires internet** | 8h session cache is the offline fallback. Today and Weather tabs are degraded when offline. |
| **Google Places API key is hardcoded** | Acceptable for a single-file PWA at POC stage. |
| **No marker clustering** | Deferred per CLAUDE.md. Maps may show overlapping pins at low zoom. Acceptable for current venue density. |
| **Walk count vs. density** | 25 curated walks. Sniffout Picks section will often return zero results at 1–3km radius outside hotspots. "No walks found nearby. Try a wider radius." empty state is the correct fallback. |
| **3-day forecast only** | Weather tab forecast limited to 3 days. Extension to 5–6 days deferred to Phase 2 weather polish. |
| **Filter state is in-memory only** | Filter selections reset on tab switch. Accepted pattern for Phase 1 — no localStorage persistence for filter state. |
| **No `uv_index` from Open-Meteo** | Paw safety heuristic uses temperature only. Full `temp + uv_index + time` threshold logic is Phase 3. |
| **Green spaces via Overpass (Walks tab only)** | Overpass returns raw OSM data without quality signals. `["name"]` tag filter suppresses unnamed spaces. Nearby tab uses Google Places and is unaffected. |

---

## 4. DEFERRED TO PHASE 2

### UX Improvements

- **Sticky Sniffout Picks** — investigate sticky positioning for curated section header while green spaces scroll below. Requires UX design exploration before any developer brief. *(Phase 2 planning item)*
- **Walk detail overlay** — full `position: fixed` slide-up overlay with hero image, practical details grid, embedded Leaflet map, nearby venues (top 3), and share button.
- **Weather suitability banner** — thin amber strip on Walks tab when hazard active; adjusts walk sort order.
- **Forecast extension** — Weather tab 3-day forecast extended to 5–6 days.
- **Weather verdict block placement** — verdict card should appear before walk cards on Weather tab (TB-2).
- **Weather verdict block container** — verdict block should use card container, not inline styles (WT-1).

### Research Briefs

- **Community Engagement research brief** — incentive models for walk submissions and reviews, ahead of Phase 3 community features. *(Phase 2 planning item)*

### Designer Work

- **Designer Round 2 verification sweep** — `designer-brief-round2.md` issued and ready. Can now begin.
- **Today tab State B visual design** — T1–T5 items.
- **Walk detail overlay design** — new UI component.

### Features

- **Pollen** — Open-Meteo `european_aqi` endpoint. Phase 3.
- **UV index fetch** — `uv_index` parameter added to Open-Meteo call. Phase 3.
- **Breed personalisation** — four-category system. Phase 3 / post-POC.
- **Firebase / backend / push notifications / native app** — confirmed deferred indefinitely per CLAUDE.md.
- **Community features** — walk submission, community tab. Confirmed deferred per CLAUDE.md.

---

## 5. SIGN-OFF RECOMMENDATION

### ✅ PHASE 1 IS SIGNED OFF

All blockers are resolved. developer-notes.md Round 6 session confirms all 9 outstanding items complete. The app is functionally complete for Phase 1 scope: core build, all APIs integrated, 5 tabs working, walk and venue discovery functioning, weather and paw safety rendering correctly, filter/sort implemented, visual hierarchy correct.

**Phase 2 can begin immediately with:**

1. **Designer Round 2 verification sweep** — designer-brief-round2.md, now unblocked
2. **Phase 2 planning session** — sticky Sniffout Picks UX investigation; Community Engagement research brief
3. **Walk detail overlay** — design and developer brief

*Signed off by: Product Owner, March 2026*
