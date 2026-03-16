# Developer Notes — Phase 1 Fixes
*Last updated: March 2026. Documents changes to sniffout-v2.html made during Phase 1 fix sprint.*

---

## FIX 1.1 — Social proof count corrected

Updated four occurrences of `50+` to `25` across: `<meta name="description">`, hero body text, social proof strip, and the Me tab stat value (`#stat-walks`). No logic change — string substitution only.

---

## FIX 1.2 — Recent searches persist and display as pills

Added a `FIX 1.2` script block at the end of the file. Implemented `saveRecentSearch(label, lat, lon)` which deduplicates by label, pushes to front, and trims to 5 entries stored under the `recentSearches` localStorage key. `renderRecentPills()` reads both `recentSearches` and `sniffout_starred`, displays starred entries first (brand-green tint), then recent-only entries with star toggle icons. Guards added to reject entries with undefined/null label or coordinates.

Overrides `geocodeByName` and `geocodeAndGo` to intercept successful geocode results and save them before calling `loadWeatherAndShow`. Also overrides `showStateA` to re-render pills on every State A transition.

---

## FIX 1.3 — Walks tab: radius filter applied, green spaces supplemented

**Logic referenced from dog-walk-dashboard.html:** `renderWalks()` (lines 1315–1472) calculates Haversine distance from `currentLocation.lat/lon` to each walk in `WALKS_DB`, filters to `MAX_KM` (the user-selected radius), and sorts ascending by distance. `loadNearbyGreenSpaces()` (lines 1485–1524) fetches supplementary results from Google Places using `textQuery: "parks and nature reserves near [location]"` and appends them below the curated walk list.

**Implementation in v2:** `renderWalksTab(lat, lon)` applies `haversineKm` distance filter against `getSavedRadius()` km, sorts by proximity, renders curated walks immediately. When location is set, calls `fetchGreenSpacesForWalks()` which queries Overpass (`leisure~park|nature_reserve|common` with `name` tag required, nodes and ways) within the same radius. Green spaces are appended below curated entries after deduplication (any green space within 300m of a curated walk is suppressed). A loading message ("Looking for nearby green spaces…") is shown while the Overpass fetch is in flight; it is replaced by the final state when results arrive.

**Decision:** The original uses Google Places API for green spaces. v2 uses Overpass API instead (consistent with the Nearby tab approach, no API key required). The data coverage is different but the functional result is equivalent.

---

## FIX 1.4 — Location search accuracy

Added `&countrycodes=gb&addressdetails=1&featuretype=settlement` to the Nominatim search URL and `Accept-Language: en` header. Postcode detection regex (`/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i`) routes UK postcodes to postcodes.io before falling back to Nominatim for place names. Both the original `geocodeByName` function and the FIX 1.2 override were updated.

---

## FIX 1.5 — Nearby tab: dog-friendly venue filtering

**Logic referenced from dog-walk-dashboard.html:** `fetchPlaces()` (lines 1864–1889) uses Google Places API `textQuery` parameter with explicit dog-friendly search phrases per category: `"dog friendly cafes"`, `"dog friendly pubs"`, `"dog friendly beaches"`, `"pet shops"`, `"veterinary clinics"`. Restaurants are not a category in the original. Dog-friendly filtering is baked into the search phrase, not post-fetch.

**Implementation in v2:** The Overpass query was redesigned to mirror the original's category intent:
- Pubs/bars: `["dog"!="no"]` — matches "dog friendly pubs" intent; UK pubs are typically dog-welcoming so "not explicitly excluded" is the right threshold
- Cafés: `["dog"="yes"]` required — explicit tag required, matching the original's "dog friendly cafes" keyword search
- Parks/nature reserves/dog parks: always included — inherently dog-accessible
- Beaches: `["natural"="beach"]` added — matches original "dog friendly beaches" category (not present in v2 before)
- Vets and pet shops: always included
- Restaurants: removed entirely — not a category in the original

Added `beach` to `CATEGORIES`, `CATEGORY_ICON`, `CATEGORY_LABEL`. Updated `resolveCategory` to detect `tags.natural === 'beach'` before the park/café checks. Cleared the `sniffout_nearby_cache` sessionStorage key on load to force a fresh fetch with the updated query.

---

## FIX 2.1 — Paw safety: conditional display

`getPawSafety(temp)` now returns `null` for temperatures between 0°C and 25°C. Only returns a result for `temp > 25` (danger — hot pavement) or `temp <= 0` (ice/gritting risk). The caution state (20–25°C) is removed. `renderWeatherTab` checks `if (paw)` before building `pawHTML`, so no block, placeholder, or space is rendered for normal temperatures.

---

## FIX 2.2 — Radius filter inline on Walks and Nearby tabs

Added a funnel SVG icon button (`filter-btn`) to the title bar of both the Walks and Nearby tabs. Tapping opens an inline `radius-picker` div with four chips: 1 km, 3 km, 5 km, 10 km. Active chip uses `var(--brand)` fill. Selecting a chip: saves to `sniffout_radius`, clears `sniffout_nearby_cache` and `sniffout_walks_gs` sessionStorage caches, closes the picker, and re-renders both Walks and Nearby tabs from the saved session.

Radius unit changed from miles to km throughout. `getSavedRadius()` default changed from 10 (miles) to 5 (km). `fetchNearbyPlaces` switched from hardcoded `r = 2000` to `getSavedRadius() * 1000`. The radius cache key for Nearby now includes the radius value so changing radius triggers a fresh Overpass fetch.

Removed the radius cycle row from the Me tab settings entirely.

---

## FIX 2.3 — Starred locations (pill star icons)

Star icons added to each recent search pill. Tapping a star calls `toggleStarred(lat, lon, label)` which saves to `sniffout_starred` (max 3). Starred entries persist above recent entries in pill order, are visually distinguished with a brand-green left border, and are not displaced when newer searches push the recent list to 5. Tapping a filled star unstars the location.

---

## FIX 2.4 — Today tab empty state: prominent CTA

The primary CTA was wrapped in a `.cta-block` card element (`border-radius: 16px`, `border: 1px solid var(--border)`, white surface background). This gives the action area a distinct visual boundary that separates it from the hero body text and makes the primary action immediately recognisable as interactive.

Button label changed from "Use my location" to "Find walks near me". Secondary link changed from "or enter a place or postcode" to "Or enter a location →". Button height increased from 52px to 56px, font size from 16px to 17px. Recent search pills remain outside the card block — they are contextual, not primary actions.

Hero body bottom margin reduced from 28px to 20px to tighten the gap between body text and the CTA card.

**Decision:** The approved copy (headline, subline, body text) was not changed. Only button labels and layout treatment were modified, per the fix brief.

---

## FIX 1.5 — Nearby tab: switched to Google Places API

**Reason:** Overpass API returns sparse results because most dog-friendly venues are not explicitly tagged with `dog=yes` in OSM. The original POC used Google Places text search which infers dog-friendliness semantically. Switching to Google Places matches the original's accuracy.

**Implementation:** Replaced Overpass-based `fetchNearbyPlaces` with a Google Places New API (`POST /v1/places:searchText`) implementation. Six categories with text queries matching the original:
- Pubs: `"dog friendly pubs near [location]"`
- Cafés: `"dog friendly cafes near [location]"`
- Parks: `"dog parks and nature reserves near [location]"`
- Beaches: `"dog friendly beaches near [location]"`
- Pet shops: `"pet shops near [location]"`
- Vets: `"veterinary clinics near [location]"`

Results are cached in-memory (`NEARBY_GOOGLE_CACHE`) keyed by `cat|lat|lon|radius`. `setRadius()` now clears `NEARBY_GOOGLE_CACHE = {}` (was: `sessionStorage.removeItem('sniffout_nearby_cache')`). Venue cards (`renderVenueCard`) rewritten for Google Places response shape. Category tip banner and disclaimer added to `renderVenueList`. `renderNearbyTab` default category changed from `all` to `pub`.

---

## FIX 1.3 — Walks tab: full layout rewrite per owner user story

**Previous state:** Single list of curated walks + appended green spaces below.

**New layout:**
1. Location context header: "Within Xkm of [location]" (location name read from session)
2. **Community Picks** section: horizontal scrolling carousel of curated walks within radius. Each card shows badge, name, star rating, duration/distance, off-lead and terrain tags. Empty state: "No community trails here yet — be the first to add one!"
3. **Nearby Green Spaces** section: compact vertical list from Overpass API. "Looking for nearby green spaces…" loading state while fetch is in flight. Section is hidden if no results.

Old filter chips row (All walks, Off-lead, Easy, No livestock, Paved) removed — per owner user story which does not include filter chips. Filter chips are a Phase 2 item.

New functions added: `renderTrailCard(walk)` (carousel card) and `renderGreenSpaceCard(gs, refLat, refLon)` (compact list row).

`walks-list` div renamed to `walks-content` in HTML.

**Open question for PO:** Owner user story mentions "Enclosed" as a quick tag on trail cards. The `enclosed` field does not exist in WALKS_DB v2 schema. Currently rendering `offLead` and `terrain` tags only. Add `enclosed: boolean` to schema only with PO sign-off.

---

## FIX 2.5 — Today tab: weather preview copy, info modal, search placeholder

Three sub-changes:

1. **Preview card copy:** "Live weather + paw safety" → "Live weather" / "Safety tips when conditions are extreme"
2. **Search placeholder:** Changed to "Enter place name or postcode"
3. **Info button on weather hero:** Added `<button class="weather-info-btn">ⓘ</button>` (top-right, absolute positioned). Tapping opens `#weather-info-modal` (bottom sheet). Modal explains that cautions appear on extreme weather days and paw safety only shows when pavement is genuinely dangerous. `openWeatherModal()` / `closeWeatherModal()` functions added. Modal closes on backdrop tap.

---

## FIX 3.1 — Dark mode `--brand` override

Added `--brand: #6EE7B7;` to the `body.night` CSS block. This overrides the default dark forest green with a light teal that reads clearly on dark backgrounds — affecting the primary CTA button, active nav label, active filter chips, and preview card tint.

---

## FIX 4.1 — Walks tab: "Other nearby green spaces" label

Copy-only change. Secondary section label in `renderWalksTab` changed from `"Nearby Green Spaces"` to `"Other nearby green spaces"`. Lowercase start and the word "Other" communicates the supplementary nature of this section relative to Community Picks above.

---

## FIX 4.2 — Nearby tab: venue photos

**Field mask:** Added `places.photos` to `X-Goog-FieldMask` header in `fetchNearbyPlaces`.

**URL construction:** Photo URL built as `https://places.googleapis.com/v1/{photos[0].name}/media?maxWidthPx=400&key=...`. Stored as `photoUrl` on the venue object. `null` when no photos array is returned.

**Card layout:** `renderVenueCard` updated with:
- `.venue-card-photo-gp` div (140px height) at the top of the card — shows `<img loading="lazy">` when `photoUrl` is set, brand-green background when not.
- `.venue-card-body-gp` wrapper around the existing name/meta/address/maps-link content with padding.
- `.venue-card-gp` changed to `overflow: hidden` (was `padding: 14px 16px`) so the photo bleeds edge-to-edge to the card border radius.

---

## FIX 4.3 — Nearby tab: map view broken

**Root cause:** `filteredVenues()` was called in `updateMapMarkers()` but was never defined after the Google Places rewrite replaced the Overpass-based venue filter. JavaScript threw a `ReferenceError` when the Map button was tapped.

**Fix:** Added `filteredVenues()` function that returns `nearbyVenues` filtered to entries with valid lat/lon coordinates. With Google Places, each fetch is already category-specific so no additional category filtering is needed.

**Coordinate field names:** The venue objects in `nearbyVenues` already stored `lat` and `lon` from `p.location.latitude` / `p.location.longitude` (set in `fetchNearbyPlaces`). `L.marker([v.lat, v.lon])` is therefore correct — no coordinate field name change was needed.

**`invalidateSize` on map reveal:** Already handled: the map button handler calls `setTimeout(function() { initNearbyMap(lat, lon); }, 50)` which calls `nearbyMap.invalidateSize()` inside `initNearbyMap`. No change needed.

---

## FIX 4.4 — WALKS_DB: `enclosed` field added

Added `enclosed: boolean` to all 25 WALKS_DB entries, positioned between `offLead` and `livestock`.

**Values assigned:**
- `enclosed: true` — Richmond Park only. Richmond Park has a perimeter wall/fence with gated entries, making it a genuinely enclosed deer park where dogs cannot exit to a road without going through a gate.
- `enclosed: false` — all other 24 entries. All remaining walks are open countryside, moorland, heathland, coastal paths, or commons with open boundaries.

**UI:** `renderTrailCard` updated to render `<span class="trail-tag">Enclosed</span>` chip when `walk.enclosed === true`. No chip rendered when `false`.

---

---

## FIX 5.1 — Dark mode `--brand` override

Added `--brand: #6EE7B7;` to the `body.night` CSS block. This makes the brand colour light teal in dark mode, ensuring the CTA button, active nav, filter chips, preview picks prompt, and conditions card link all read clearly on dark surfaces.

---

## FIX 5.2 — Nearby tab map: removed `filteredVenues()`, use `nearbyVenues` directly

Removed the `filteredVenues()` helper function. `updateMapMarkers()` now iterates `nearbyVenues` directly with an inline `if (!v.lat || !v.lon) return;` guard. `filteredVenues()` was a leftover from the Overpass era and was still being called in the map markers loop.

---

## FIX 5.3 — Green spaces section label uses `walks-section-label-sm`

Changed `walks-section-label` to `walks-section-label-sm` on the "Other nearby green spaces" section header in `renderWalksTab`. The smaller class (15px/500 vs 18px/600) communicates correct visual hierarchy — supplementary section reads as subordinate to Sniffout Picks above.

---

## FIX 5.4 — Trail card heart button added

Added `.trail-heart` CSS (`position: absolute; top: 8px; right: 8px`). Updated `renderTrailCard` to include a `<button class="trail-heart">` inside `.trail-card-photo`, calling `toggleFavourite()` on tap with `event.stopPropagation()` to prevent card tap interference.

---

## FIX 5.5 — `.trail-tag` style: brand-green tinted

Changed `.trail-tag` from grey outlined pill (`border: 1.5px solid var(--chip-off); border-radius: 99px; color: var(--ink-2)`) to brand-green tinted chip (`border-radius: 6px; color: var(--brand); background: rgba(30,77,58,0.1)`). Added `body.night .trail-tag { background: rgba(110,231,183,0.12); }` dark mode override.

---

## FIX 5.6 — Dark mode preview card tints

Added `body.night` overrides for `.walk-preview-card`, `.weather-preview-card`, `.walk-preview-tag`, `.weather-preview-title`, and `.today-conditions-card`. All use teal tint values (`rgba(110,231,183,...)`) consistent with the dark mode brand colour.

---

## FIX 5.7 — Walk photo placeholders use `var(--brand)`

Changed `.walk-photo { background: #1E4D3A }` → `var(--brand)` in CSS. Changed the inline placeholder style in both `renderWalkCard` and `renderPortraitCard` from `background:#1E4D3A;` to `background:var(--brand);`. Dark mode will now correctly show teal placeholders.

---

## FIX 5.8 — Green space card `border-radius: 16px`

Changed `.gs-card { border-radius: 12px }` → `16px`. Consistent with the 16px standard for surface cards throughout the app.

---

## FIX 5.9 — Section label: "Sniffout Picks" (PO confirmed)

PO confirmed label as "Sniffout Picks". Changed `renderWalksTab`:
- Section label: "Community Picks" → "Sniffout Picks"
- Empty state: "No community trails here yet — be the first to add one!" → "No walks found nearby. Try a wider radius."

Also updated all three WALKS_DB badge values from `'Sniffout Pick'` (singular) to `'Sniffout Picks'` (plural) so trail card badges display consistently.

---

## Today Tab — State A: Sniffout Picks preview section

Removed from State A HTML: `<p class="preview-label">`, `.walk-preview-card`, `.weather-preview-card`.

Added `<div class="preview-picks-section">` containing a header with label "Sniffout Picks" and prompt "Set your location to see what's nearest →", plus a `.trail-carousel.preview-carousel` populated by `renderStateAPreviews()`.

**Walk IDs selected:** `leith-hill` (Surrey — south), `haytor-dartmoor` (Devon — south-west/coastal), `malham-cove` (North Yorkshire — north). All three have `badge: 'Sniffout Picks'` and ratings of 4.8–4.9. Geographic spread: south, south-west, north.

`renderStateAPreviews()` is called on init and on every `showStateA()` call.

Prompt click triggers `document.getElementById('btn-use-location').click()` — same as "Find walks near me" button (ID confirmed as `#btn-use-location`).

**Social proof copy** updated to: "25 handpicked UK walks · Live conditions · Dog-specific routes" (removed "Works offline", per PO approval).

---

## Today Tab — State B improvements

**Section label:** `renderWalksNearby` section title changed from "Walks nearby" → "Sniffout Picks nearby".

**Today's conditions card:** Added to `renderTodayStateB` after `#today-walks-section`. Surfaces `verdict.body` (property path confirmed — `getWalkVerdict` returns `{title, body}`). "Full forecast →" link calls `switchTab('weather')`. Tab switch function name confirmed as `switchTab`.

**Hidden gems section:** Added to `renderWalksNearby` after the portrait card scroll. Uses `haversineKm` (confirmed — returns km, threshold 50km). Filters `WALKS_DB` for `badge === 'Hidden gem'` within 50km, sorted by proximity, capped at 4 cards. Renders into `#today-hidden-gems` div. Section absent if no qualifying walks. `renderPortraitCard` confirmed as the portrait card function name.

---

## Known Limitations

- **Green spaces via Overpass vs Google Places:** The original `loadNearbyGreenSpaces()` uses Google Places which factors in relevance and reviews. Overpass returns raw OSM data without quality signals. Some results may be small or unnamed green spaces. The `["name"]` tag filter suppresses the worst of these. (This limitation only applies to the Walks tab green spaces supplement — the Nearby tab now uses Google Places.)
- **Beach results depend on OSM coverage:** Coastal areas are well-tagged; inland areas will return no beach results, which is correct.
- **Sniffout Picks empty at small radii:** With 25 curated UK walks, a 1 km or 3 km radius will often return zero curated results outside walk hotspots. The "No walks found nearby. Try a wider radius." empty state and green spaces below are the main content at small radii.

---

## FIX 6.1 — Remove parks and beaches from Nearby tab

Removed `park` and `beach` entries from `CATEGORIES`, `CATEGORY_ICON`, `CATEGORY_LABEL`, and `CAT_GOOGLE_CONFIG`. Nearby tab now shows exactly 4 categories: Pubs · Cafés · Pet Shops · Vets. Default category (`nearbyCategory = 'pub'`) was already correct — no change needed.

---

## FIX 6.2 — Remove "Nearby" pill from green space cards

Removed `<span class="gs-nearby-badge">Nearby</span>` from `renderGreenSpaceCard()`. CSS rule `.gs-nearby-badge` left in place as an unused rule (harmless). Cards now show only name and distance metadata.

---

## FIX 6.3 — Add "View on Google Maps →" link to green space cards

Added `mapsUrl` construction in `renderGreenSpaceCard()`:
```js
var mapsUrl = 'https://www.google.com/maps/place/' +
  encodeURIComponent(gs.name) +
  '/@' + gs.lat + ',' + gs.lon + ',16z';
```
`gs.name` is encoded via `encodeURIComponent()` for the URL context (not `escHtml()` which is for HTML attribute contexts). The link replaces the removed "Nearby" badge in the card body. Added `.gs-maps-link` CSS (`font-size: 12px; font-weight: 500; color: var(--brand); white-space: nowrap`). Link opens in a new tab with `target="_blank" rel="noopener noreferrer"`.

---

## FIX 7.0 — Badge regression revert

FIX 5.9 incorrectly changed WALKS_DB badge values from `'Sniffout Pick'` (singular) to `'Sniffout Picks'` (plural). Individual walk card badges should be singular ("this walk is a Sniffout pick"). Section headings (plural — "a collection of picks") are correctly `"Sniffout Picks"`. All three WALKS_DB badge values reverted to `'Sniffout Pick'`.

Also verified `renderStateAPreviews()` uses the correct `PREVIEW_PICK_IDS` array (`['leith-hill', 'haytor-dartmoor', 'malham-cove']`) — it does not filter on badge value, so no change needed there.

---

## FIX 7.1 — Trail card resize: 240px wide, 180px photo, description

Replaced `.trail-card` and `.trail-card-photo` CSS. Key changes: width `240px` (was `200px`), photo height `180px` (was `140px`). Added `.trail-card-desc` (12px/400, `var(--ink-2)`, 2-line clamp via `-webkit-line-clamp: 2`). `renderTrailCard` updated to append `<div class="trail-card-desc">` with `escHtml(walk.description)` after the tags row.

---

## FIX 7.2 — Green space card: left-thumbnail layout

Replaced full `.gs-card` CSS with horizontal row layout. New `.gs-thumb` class: 64×64px, `border-radius: 10px`, brand-green background when no photo. `.gs-card-body` is column flex with name/distance/Maps link stacked. Total card height ~80px.

`renderGreenSpaceCard` rewritten to output thumbnail + body column. `onclick="event.stopPropagation()"` added to the Maps link to prevent card click interference. `.venue-card-photo-gp` on Nearby tab venue cards is unaffected.

`.gs-maps-link` CSS updated to include `margin-top: 2px` (was `align-self: center`).

---

## FIX 7.3 — `environment` field added to all 25 WALKS_DB entries

Added `environment` field positioned alongside `terrain` on the same line. Approved values: `'woodland'` · `'coastal'` · `'urban'` · `'moorland'` · `'heathland'` · `'open'`.

Assignments (PO review requested):

| Walk ID | Name | environment |
|---------|------|-------------|
| `box-hill-loop` | Box Hill Loop | `'open'` |
| `richmond-park` | Richmond Park | `'urban'` |
| `leith-hill` | Leith Hill | `'woodland'` |
| `frensham-common` | Frensham Common | `'heathland'` |
| `hindhead-common` | Hindhead Common | `'heathland'` |
| `seven-sisters` | Seven Sisters | `'coastal'` |
| `devils-dyke` | Devil's Dyke | `'open'` |
| `ashridge-estate` | Ashridge Estate | `'woodland'` |
| `hampstead-heath` | Hampstead Heath | `'urban'` |
| `wimbledon-common` | Wimbledon Common | `'urban'` |
| `newlands-corner` | Newlands Corner | `'open'` |
| `ranmore-common` | Ranmore Common | `'woodland'` |
| `haytor-dartmoor` | Haytor & Hound Tor | `'moorland'` |
| `burley-new-forest` | Burley Village & Forest | `'woodland'` |
| `stanage-edge` | Stanage Edge | `'moorland'` |
| `malham-cove` | Malham Cove | `'open'` |
| `grasmere-lake` | Grasmere Lake Circuit | `'open'` |
| `headley-heath` | Headley Heath | `'heathland'` |
| `bookham-common` | Bookham Common | `'woodland'` |
| `st-marthas-hill` | St Martha's Hill | `'woodland'` |
| `the-hurtwood` | The Hurtwood | `'heathland'` |
| `epsom-common` | Epsom Common | `'woodland'` |
| `shere-village` | Shere Village | `'woodland'` |
| `cuckmere-haven` | Cuckmere Haven | `'coastal'` |
| `cissbury-ring` | Cissbury Ring | `'open'` |

Note: `wimbledon-common` assigned `'urban'` as it's a London common (similar to Richmond Park), though it has heathland character. PO may wish to change to `'heathland'`. `grasmere-lake` assigned `'open'` as the lake circuit is mostly open lakeside path; could be `'moorland'` if preferred.

---

## FIX 7.4 — Filter/sort bottom sheet: replaces inline radius picker

The inline `.radius-picker` pattern is superseded by a bottom sheet modal on both tabs. Old `.radius-picker` CSS and HTML elements are left in place (unused, harmless). The `.radius-chip` chip click handlers are also superseded.

**Functions added:**
- `openFilterSheet(tab)` — adds `.open` to backdrop and sheet, locks body scroll, calls `syncFilterSheetState`
- `closeFilterSheet(tab)` — removes `.open`, restores scroll
- `syncFilterSheetState(tab)` — sets active class on the radius chip matching `getSavedRadius()`
- `resetWalksFilterSheet()` — resets all filter groups to defaults (Distance sort, Any for all chip groups, saved radius for radius chips)
- `resetNearbyFilterSheet()` — resets sort to Distance, radius to saved
- `updateWalksFilterIndicator()` — toggles `has-filter` class on `#walks-radius-btn` when non-default filters are active
- `renderWalksTabWithResults(result, lat, lon)` — renders the Sniffout Picks section from a supplied walks array; preserves existing green spaces section if already rendered; empty result shows "Nothing matching..." with reset link
- Walks apply listener on `#walks-filter-apply` — reads lat/lon from `sniffout_location` localStorage (not `restoreSession()` which returns void)
- Nearby apply listener on `#nearby-filter-apply` — uses globals `nearbyUserLat`, `nearbyUserLon`, `nearbyLocationName`; re-fetches on radius change, re-sorts in place otherwise; calls `renderVenueList()` (no args, uses global `nearbyVenues`)

**FieldMask:** `places.rating` was already present in `fetchNearbyPlaces` FieldMask (line 3072). No change needed.

**`saveRadius(km)`:** Added as thin wrapper — `localStorage.setItem('sniffout_radius', km)` — without the side effects of `setRadius()` (no cache clear, no re-render). Used by both apply listeners.

---

## FIX 7.5 — `saveRadius()` function

Added `saveRadius(km)` as a thin localStorage wrapper alongside `getSavedRadius()`. Does not clear caches or re-render — that is the responsibility of the caller. `setRadius(km)` (the full version with side effects) continues to exist for direct radius changes from settings.

---

## Issue A — Paw safety safe state never rendered

**Root cause:** `getPawSafety(temp)` returned `null` for temperatures 0–25°C. The `if (paw)` guard in `renderWeatherTab()` skipped the block entirely for normal UK temperatures, meaning paw safety was never visible in practice.

**Fix:** `getPawSafety` now returns a safe state object for `0 < temp ≤ 25°C`:
```js
{ state: 'safe', title: '🐾 Paws safe at Xm°C', body: 'At X°C, pavement is fine...' }
```
Returns `danger` state for `temp > 25°C`, `caution` for `temp ≤ 0°C`.

**`pawClass` ternary updated** in `renderWeatherTab` to handle 3 states:
```js
var pawClass = paw.state === 'danger' ? 'danger' : paw.state === 'caution' ? 'caution' : '';
```
Empty string for safe = base `.paw-safety` styling with brand-green.

Paw safety block now always renders on the Weather tab.

---

## Issue 4 partial — `.trail-tag.partial` CSS and `ol.cls` in `renderTrailCard`

**Root cause 1:** CSS rule `.trail-tag.partial` was missing. Off-lead "Partial" tags rendered with brand-green (default `.trail-tag` style) instead of amber.

**Fix 1:** Added CSS rules after the `.trail-tag` block:
```css
.trail-tag.partial {
  color: var(--amber);
  background: rgba(217,119,6,0.08);
}
body.night .trail-tag.partial {
  background: rgba(217,119,6,0.12);
}
```

**Root cause 2:** `renderTrailCard()` rendered `<span class="trail-tag">` without applying `ol.cls`, so partial walks always got the default class regardless.

**Fix 2:** Updated the span to apply `ol.cls`:
```js
'<span class="trail-tag' + (ol.cls ? ' ' + ol.cls : '') + '">' + ol.text + '</span>'
```

`offLeadLabel()` returns `{ text: 'Partial off-lead', cls: 'partial' }` for partial walks — `cls` is now correctly applied.

---

## TA-1 — Social proof strip: "Live conditions" → "Works offline"

**Change:** Social proof strip on Today tab State A reverted to approved copy string.

```
Before: 25 handpicked UK walks · Live conditions · Dog-specific routes
After:  25 handpicked UK walks · Works offline · Dog-specific routes
```

"Works offline" is factual (session cache provides 8h offline fallback) and durable. "Live conditions" was inaccurate copy that implied always-on connectivity.

---

## Round 6 — Phase 1 sign-off blockers: confirmation

All items identified in `phase1-signoff.md` section 2 (Outstanding) are now resolved:

| Item | Status |
|------|--------|
| FIX 7.0 — Badge regression revert | ✅ Done (this session) |
| FIX 7.1 — Trail card resize | ✅ Done (this session) |
| FIX 7.2 — Green space card left-thumbnail layout | ✅ Done (this session) |
| FIX 7.3 — `environment` field on all 25 WALKS_DB entries | ✅ Done (this session) |
| FIX 7.4 — Filter/sort bottom sheet (Walks + Nearby) | ✅ Done (this session) |
| FIX 7.5 — `saveRadius()` function confirmed | ✅ Done (this session) |
| Issue A — paw safety safe state | ✅ Done (this session) |
| Issue 4 partial — `.trail-tag.partial` CSS + `ol.cls` | ✅ Done (this session) |
| TA-1 — "Works offline" copy | ✅ Done (this session) |
