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

---

## FIX 8.1 — Today tab State B: verdict body before walk scroll

Reordered HTML assembly in `renderTodayStateB()`. New sequence: weather hero card → verdict body (`.today-conditions-card`) → walk scroll (`#today-walks-section`) → hazard cards → hidden gems (`#today-hidden-gems`). Pure ordering change — no new elements, no CSS changes.

---

## FIX 8.2 — Forecast expanded from 3 to 5 days

`buildForecastGrid()`: changed `Math.min(4, daily.time.length)` to `Math.min(6, daily.time.length)`. Loop runs `i = 1` to `limit - 1`, so limit 6 = 5 forecast rows (tomorrow + 4 more). No additional API parameters needed — Open-Meteo already returns 7 days of daily data.

---

## FIX 8.3 — Forecast description text: 11px → 12px

Inline style on forecast description div in `buildForecastGrid()` changed from `font-size:11px` to `font-size:12px`.

---

## FIX 8.4 — Rain Chance replaces Humidity in conditions grid

`renderWeatherTab()`: added `var currentHourIndex = new Date().getHours()` and `var rainChance = hourly.precipitation_probability[currentHourIndex] || 0`. The Humidity cell in `.conditions-grid` replaced with Rain Chance: label `Rain chance`, value `rainChance + '%'`. `humidity` variable removed from `renderWeatherTab` (it is not used there). The `humidity` variable in `renderTodayStateB()` is unaffected — still used for the Today tab pill.

---

## FIX 8.5 — Paw safety: trigger-only thresholds

`getPawSafety(tempC)` rewritten. New thresholds:
- `tempC >= 35` → `danger` state
- `tempC >= 25` → `caution` state
- `tempC <= 0` → `caution` state (ice/gritting)
- All other temperatures → `null` (no block rendered)

Safe state (0–25°C) removed. The `if (paw)` guard in `renderWeatherTab()` handles the null case — no rendering change needed there.

---

## FIX 8.6 — Verdict block: extracted to `.verdict-card` CSS class

Added `.verdict-card`, `.verdict-card-title`, and `.verdict-card-body` CSS classes to the `<style>` block (positioned before `.hazard-card`). Replaced inline `style=""` attributes on the Weather tab verdict block with these classes. Visual appearance unchanged.

---

## FIX 8.7 — Slide-up animation on weather info modal

`.modal-overlay` CSS updated: `display: flex` always in layout; `transform: translateY(100%)` hides below viewport; `transition: transform 0.3s ease`; `pointer-events: none` when hidden. Added `.modal-overlay.open { transform: translateY(0); pointer-events: auto; }`.

`openWeatherModal()` and `closeWeatherModal()` updated to `classList.add/remove('open')` instead of `el.style.display` toggle. `style="display:none"` removed from `#weather-info-modal` HTML element.

---

## FIX 8.8 — Removed dead `.gs-nearby-badge` CSS rule

Confirmed no HTML or JS references to `gs-nearby-badge` remain (element removed in FIX 6.2). CSS rule deleted.

---

## TB-1 / FIX 8.9 — Third Today tab pill: "Feels X°C" → sunrise/sunset time

Third pill in `renderTodayStateB()` changed from `'Feels ' + feels + '°C'` to a sunrise/sunset pill.

**Resolution:** PO confirmed pill should show sunrise or sunset time (not wind speed, which was already shown in pill 2). Logic: `new Date().getHours() < 12` → show sunrise time; `>= 12` → show sunset time. Time string parsed from Open-Meteo `daily.sunrise[0]` / `daily.sunset[0]` ISO datetime string via `.split('T')[1]` to extract `HH:MM`.

**API change:** `fetchWeather()` updated to add `sunrise,sunset` to `&daily=` params and `forecast_days` bumped from `4` to `7` (required to supply today's sunrise/sunset at index 0 and support 5-day forecast).

**`renderTodayStateB()` signature change:** Added `daily` as 4th parameter; call site in `renderWeather()` updated to pass `data.daily`. Pill uses Lucide `sunrise` or `sunset` icon via `luIcon()`.

---

## Lucide Icons — Emoji replacement throughout app

All functional emoji used as icons replaced with Lucide CDN icons throughout `sniffout-v2.html`.

**CDN:** `<script src="https://unpkg.com/lucide@latest"></script>` added to `<head>` after the Leaflet script tag.

**Helpers added** (after `WMO_ICON` map):
```js
function luIcon(name, size, extra) { /* returns <i data-lucide="..."> HTML string */ }
function syncIcons() { if (window.lucide) lucide.createIcons(); }
```
`syncIcons()` must be called after every `innerHTML` assignment that contains `data-lucide` elements, since Lucide scans the DOM at call time.

**`WMO_ICON` map added** (alongside existing `WMO_EMOJI`): maps WMO weather codes to Lucide icon names (e.g. `0:'sun'`, `95:'cloud-lightning'`).

**CSS:** `[data-lucide] { display: inline-block; vertical-align: middle; }` added to `<style>` block.

**Replacements made:**
- `ⓘ` info button → `luIcon('info', 16)` (Today tab weather hero)
- `46px WMO emoji div` → `luIcon(WMO_ICON[code] || 'cloud-sun', 46)` (Today tab weather icon)
- `💧 humidity pill` → `luIcon('droplets', 14)` + `luIcon('wind', 14)` for wind pill
- `🐾` paw safety block → `luIcon('paw-print', 20)` (Weather tab)
- `★`/`☆` star ratings in recent pills → `luIcon('star', 12, 'fill:currentColor;')` / `luIcon('star', 12)`
- `26px WMO emoji div` in forecast rows → `luIcon(WMO_ICON[code] || 'cloud-sun', 24)`

**`cow`/`sheep` Lucide availability:** Both condition tag icons use `triangle-alert` fallback as `cow` and `sheep` are not confirmed in current Lucide build.

**`syncIcons()` call sites:** `renderTodayStateB()`, `renderWeatherTab()`, `renderVenueList()`, `renderRecentPills()`, `renderCondTagSheet()`, `toggleCondTag()`, `rerenderCondTagRow()`.

---

## Forecast layout — heading and row layout rewrite

Two changes to the 5-day forecast section:

1. **Heading:** `"3-day forecast"` → `"5-day forecast"` to match the `Math.min(6,...)` loop change from FIX 8.2.

2. **Layout:** Replaced CSS grid (`repeat(3, 1fr)`) with full-width horizontal flex rows. Each row (`<div class="forecast-row">`) contains three equal `flex: 1` columns: day name (left-aligned), icon (centred), temperatures + description (right-aligned). CSS classes: `.forecast-row`, `.forecast-day`, `.forecast-icon`, `.forecast-right`, `.forecast-temps`, `.forecast-desc`.

**Reason:** 5 cards in a 3-column grid left an orphaned empty cell in the bottom-right position.

---

## Round 7 — completion confirmation

All items from `developer-brief-round7.md` are resolved:

| Fix | Description | Status |
|-----|-------------|--------|
| FIX 8.1 | Reorder verdict body before walk scroll in Today State B | ✅ Done |
| FIX 8.2 | Expand forecast from 3 to 5 days | ✅ Done |
| FIX 8.3 | Forecast description text 11px → 12px | ✅ Done |
| FIX 8.4 | Replace Humidity with Rain Chance in conditions grid | ✅ Done |
| FIX 8.5 | Paw safety trigger-only thresholds | ✅ Done |
| FIX 8.6 | Extract verdict inline styles to `.verdict-card` class | ✅ Done |
| FIX 8.7 | Slide-up animation on weather info modal | ✅ Done |
| FIX 8.8 | Remove dead `.gs-nearby-badge` CSS | ✅ Done |
| TB-1 / FIX 8.9 | Third pill: sunrise/sunset time (PO confirmed) | ✅ Done |

---

## FIX 9.1 — Condition tags: data model, helpers, rate limiting, session tracker

New script block added between PHASE C and PHASE D.

**Tag taxonomy** (13 tags, 4 categories):

| Key | Label | Icon | Category |
|-----|-------|------|----------|
| `cattle` | Cattle in field | `triangle-alert` | Hazard |
| `sheep` | Sheep in field | `triangle-alert` | Hazard |
| `leads` | Dogs on leads here | `dog` | Hazard |
| `access` | Access issue | `triangle-alert` | Hazard |
| `muddy` | Very muddy underfoot | `footprints` | Surface |
| `flooded` | Flooded section | `waves` | Surface |
| `overgrown` | Overgrown path | `leaf` | Surface |
| `icy` | Icy / slippery | `snowflake` | Surface |
| `water` | Great water point | `droplets` | Positive |
| `cafe` | Dog-friendly café open | `coffee` | Positive |
| `clear` | Excellent conditions | `sun` | Positive |
| `busy` | Busy / crowded | `users` | Footfall |
| `quiet` | Quiet today | `volume-x` | Footfall |

`cow` and `sheep` icon keys both use `triangle-alert` — not confirmed available in current Lucide build.

**localStorage keys:**
- `sniffout_condition_tags` → `{ walkId: [{ tag, ts, device }] }` — community condition submissions
- `sniffout_walked` → array of walked walk IDs (additive, permanent)

**Rate limiting:** Device fingerprint = `btoa(navigator.userAgent + screen.width + screen.height)`. Max 1 submission per device per walk per 24h (`hasSubmittedToday(walkId)`).

**Session dismissal:** `promptDismissedThisSession = {}` global object. Keyed by `walkId`, prevents re-prompting in same session after user skips the condition sheet.

**Staleness thresholds:**
- Hazard tags: stale at 7 days
- All other tags: stale at 14 days
- Hidden at 30 days

**`getDisplayTags(walkId)` correction:** `ageText` is `stale ? 'May be out of date' : relativeTime(t.ts)`. The spec had a compound condition (`stale && age > STALE_LIMIT`) which was incorrect — corrected per PO review.

---

## FIX 9.2 — Mark as walked button on carousel cards

**CSS:** `.walked-btn` (outline variant, brand-green text), `.walked-btn.confirmed` (brand-green filled), `body.night` variants for both states.

**`renderTrailCard()` updated:** Walk button added after description. Three visual states:
1. Default: "Mark as walked" with check icon
2. Confirmed (in-session, not yet post-walk): "Walked ✓" green filled
3. Post-walk prompt: button state transitions after `onMarkWalked()` handler runs

**`onMarkWalked(event, walkId)`:** Saves to `sniffout_walked`, updates button DOM in place, checks rate limit and session dismissal, opens condition tag prompt sheet if eligible.

---

## FIX 9.3 — Post-walk prompt bottom sheet

Sheet HTML added after nearby filter sheet (`#nearby-filter-sheet`), before the FIX 2.2 script block. Uses the existing filter sheet CSS pattern (`.filter-backdrop` + `.filter-sheet` + `.open` class).

**Sheet elements:** `#cond-tag-backdrop`, `#cond-tag-sheet`, `#cond-tag-sheet-inner` (scrollable tag options), skip button (`#cond-tag-skip` → `closeCondTagSheet()`), done button (`#cond-tag-done` → `submitCondTags()`).

**New CSS:** `.sheet-btn-ghost` (outline button), `.sheet-btn-primary` (brand-green filled button) — these were not pre-existing in the codebase and were added.

**Functions:** `openCondTagSheet(walkId)`, `closeCondTagSheet()`, `renderCondTagSheet(walkId)`, `toggleCondTag(key)`, `updateCondDoneBtn()`, `submitCondTags()`.

---

## FIX 9.4 — Condition tag row on carousel cards

**CSS added:** `.cond-tag-row` (flex wrap row, gap 4px, margin above description), `.cond-chip` (base chip style), `.cond-chip--hazard` (amber tint), `.cond-chip--stale` (muted/italic), `.cond-chip-more` (secondary "+N more" chip), `.cond-disclaimer` (12px muted "Community reported" label), `.cond-section-label`, `.cond-tag-option`, `.cond-tag-option.selected`, night mode variants, `.cond-option-icon`, `.cond-option-check`.

**`renderCondTagRow(walkId)`:** Shows max 2 chips + "+N more" chip if additional tags exist. Hazard chips use `.cond-chip--hazard`. Stale chips use `.cond-chip--stale`. "Community reported" disclaimer shown when tags exist.

**`rerenderCondTagRow(walkId)`:** Live DOM update after sheet submission. Targets `.cond-tag-row` inside the relevant `.trail-card` (keyed by `data-walk-id`). Fallback: inserts before `.walked-btn` when `.trail-card-desc` is not present (walk has no description). Calls `syncIcons()` after update.

**Element order in `renderTrailCard()`:** condition tag row → description → walked button.

---

## FIX 10.1 — Dark mode colour revision

Implemented in prior session. See Round 7 and Round 8 notes for context. Token block updated, all `rgba(110,231,183,...)` and `#6EE7B7` hardcoded values replaced with `rgba(130,176,154,...)` and `#82B09A`. New dark mode overrides added for `.venue-icon`, `.walk-tag.full`, `.venue-open-gp.open`, `.chip.active`, `.hazard-card.brand-variant`. See developer-brief-round9.md FIX 10.1 for full substitution table.

---

## FIX 10.2 — Mark as walked: undo toast + toggle

**Root cause:** Accidental taps on the walked button had no recovery path.

**Changes:**

1. **`.walked-btn.confirmed` CSS:** Removed `pointer-events: none` — confirmed state is now interactive (supports toggle-off).

2. **`onMarkWalked()` updated:** Now checks `btn.classList.contains('confirmed')` on entry — if already confirmed, delegates to `onUnmarkWalked(walkId)` and returns. Otherwise marks walked, calls `showUndoToast(walkId)`, then conditionally opens the condition tag sheet.

3. **`showUndoToast(walkId)`:** Creates a `#undo-toast` div appended to `document.body`. Content: check icon + "Walk logged" + "Undo" button calling `onUnmarkWalked(walkId)`. Auto-dismisses after 5s via `setTimeout`. Timer stored in `toast.dataset.timer`. If a toast already exists (rapid double-tap), the previous one is cleared before creating the new one. Calls `syncIcons()` after appending.

4. **`onUnmarkWalked(walkId)`:** Removes `walkId` from `sniffout_walked` localStorage. Clears and removes the toast if still visible. Updates all `[data-walk-id]` walked-btn elements to remove `.confirmed` and restore "Mark as walked" text.

**Toast CSS:** `.undo-toast` (fixed, above bottom nav at `bottom: calc(64px + 12px)`, dark pill, `toastIn` animation), `.undo-toast-action` (brand-coloured "Undo" text button), `body.night .undo-toast` (`#2A3D30` background).

---

## FIX 10.3 — Remove "Excellent conditions" (`clear`) tag

Removed `{ key: 'clear', label: 'Excellent conditions', icon: 'sun', cat: 'Positive' }` from `CONDITION_TAGS`. Array now has 12 tags. Positive category now contains only `water` and `cafe`.

**Prompt:** `renderCondTagSheet()` iterates `CONDITION_TAGS` so removal is automatic — no separate change needed.

**Existing data:** `getDisplayTags()` builds a `tagDef` map from `CONDITION_TAGS`. Any existing `clear` entries in `sniffout_condition_tags` localStorage will silently have no matching `tagDef` entry and will not render. No migration needed.

---

## FIX 10.4 — Condition tag chips show timestamp

**`getDisplayTags()` updated:** `ageText` now prefixed with `"reported "` for non-stale tags:
```js
ageText: stale ? 'May be out of date' : 'reported ' + relativeTime(t.ts)
```
Produces strings like: `"reported Just now"`, `"reported 2 hours ago"`, `"reported 3 days ago"`, `"May be out of date"`.

**`.cond-chip` CSS updated:** `align-items` changed from `center` to `flex-start` (icon top-aligns with label on two-line chips). `white-space: nowrap` removed from outer chip to allow natural sizing.

**New CSS classes:**
- `.cond-tag-body` — column flex, `gap: 1px`, wraps label + time
- `.cond-tag-label` — 11px/500, `color: inherit`, `line-height: 1.3`
- `.cond-tag-time` — 10px/400, `color: var(--ink-2)`, `line-height: 1.2`
- `.cond-chip--stale .cond-tag-time` — `color: var(--amber)` (stale timestamp in amber)

**`renderCondTagRow()` updated:** Each chip now renders:
```html
<span class="cond-chip [...]">
  [icon 11px]
  <span class="cond-tag-body">
    <span class="cond-tag-label">{label}</span>
    <span class="cond-tag-time">{ageText}</span>
  </span>
</span>
```

---

## Round 9 — completion confirmation

| Fix | Description | Status |
|-----|-------------|--------|
| FIX 10.1 | Dark mode colour revision (tokens + hardcoded rgba) | ✅ Done (prior session) |
| FIX 10.2 | Mark as walked reversible — undo toast, `onUnmarkWalked`, toggle | ✅ Done |
| FIX 10.3 | Remove `clear` ("Excellent conditions") tag | ✅ Done |
| FIX 10.4 | Condition tags show timestamp — two-line chip, "reported X ago" | ✅ Done |

---

## FIX 11.1 — Sticky tab title bar

Added `position: sticky; top: 0; background: var(--bg); z-index: 20;` to the existing single-line `.tab-title-bar` rule. Applies to all tabs (Weather, Walks, Nearby, Me) — no new rule created, no dark mode override needed (`var(--bg)` resolves correctly in both modes).

---

## FIX 11.2 — "↑ Picks" anchor pill on Walks tab

**Problem:** No way to return to the Picks carousel after scrolling into the green spaces list.

**Implementation:**

- **HTML:** `<button class="picks-anchor-btn" id="picks-anchor-btn">` added inside `#tab-walks`, **outside** `#walks-content` so it survives re-renders when the walk list is rebuilt.
- **CSS:** `.picks-anchor-btn` — fixed position, `top: 16px; right: 16px`, brand-green pill. Hidden by default (`opacity: 0; pointer-events: none; transform: translateY(-6px)`). `.picks-anchor-btn.visible` shows it with fade+slide transition.
- **`initPicksAnchor()`:** Creates an `IntersectionObserver` watching the `.trail-carousel` element inside `#tab-walks`. `root` is `#tab-walks` (not `null`) because the tab panel is the scroll container, not the document. When the carousel leaves the viewport, adds `.visible` to the anchor btn; when it re-enters, removes it. Sets `onclick` to `scrollTo({ top: 0, behavior: 'smooth' })` on `#tab-walks`.
- **`var picksObserver = null`** global — allows `initPicksAnchor()` to disconnect a previous observer before attaching a new one (called after every re-render).
- **Called after:** `renderWalksTab()` and `renderWalksTabWithResults()` both call `initPicksAnchor()` after `el.innerHTML = html`.
- **Cleanup in `switchTab()`:** Removes `.visible` from the button and disconnects the observer whenever navigating away from the Walks tab.

---

## FIX 11.3 — Missing Dog Alerts "Coming Soon" card in Me tab

**Placement:** Between the Favourites section and the sign-in banner in `#tab-me`.

**HTML:** `.missing-coming-soon` card with `.missing-coming-soon-icon` (Lucide `search` 22px), `.missing-coming-soon-title`, `.missing-coming-soon-desc`, `.missing-coming-soon-pill` ("Coming soon" badge).

**CSS:** Card uses `--surface`/`--border`/`border-radius: 16px`, `pointer-events: none`, `opacity: 0.9`. Icon background `rgba(30,77,58,0.08)` light mode; `rgba(130,176,154,0.12)` dark mode via `body.night .missing-coming-soon-icon`. All other tokens resolve via CSS variables.

**JS:** Static HTML only — no render function. `syncIcons()` added to the Me nav button click handler to ensure the `data-lucide="search"` icon renders when the tab is opened.

---

## FIX 11.4 — Meteocons weather icons

**Problem:** Lucide line icons (generic UI set) replaced with Meteocons illustrated SVG icons (purpose-built weather set, MIT licence).

**Scope:** Today tab hero icon and 5-day forecast row icons only. All other Lucide icons unchanged.

**CDN pattern:** `https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg-static/{name}.svg` — plain `<img>` tags, no `<script>` needed.

**New globals:**
- `METEOCON_BASE` — CDN base URL string
- `WMO_METEOCON` — lookup object mapping WMO codes to `{ day: '...', night: '...' }` Meteocon names (23 entries covering all WMO codes used by Open-Meteo)
- `meteoconImg(code, isDay, size)` — returns `<img>` HTML string. `isDay === 0` → night variant; anything else → day variant. Fallback name: `'not-available'` (valid Meteocon placeholder).

**Render changes:**
- `renderTodayStateB()`: `luIcon(WMO_ICON[...], 46)` → `meteoconImg(cur.weather_code, cur.is_day, 64)`. Size 46→64px; `line-height:1` wrapper div removed.
- `buildForecastGrid()`: `luIcon(WMO_ICON[...], 24)` → `meteoconImg(code, 1, 32)`. Size 24→32px; `isDay` hardcoded to `1` (day variants conventional for multi-day forecasts).

**`WMO_ICON`** left in place (not removed). **`WMO_EMOJI`** also left in place.

---

## Round 10 — completion confirmation

| Fix | Description | Status |
|-----|-------------|--------|
| FIX 11.1 | Sticky tab title bar | ✅ Done |
| FIX 11.2 | "↑ Picks" anchor pill — IntersectionObserver, smooth scroll | ✅ Done |
| FIX 11.3 | Missing Dog Alerts "Coming Soon" card in Me tab | ✅ Done |
| FIX 11.4 | Meteocons weather icons — `WMO_METEOCON`, `meteoconImg()`, two call sites | ✅ Done |

---

## FIX 12.0 — PREREQ: Condition detail CSS

Added CSS classes for the walk detail overlay's conditions section: `.cond-detail-row`, `.cond-detail-label`, `.cond-detail-age`, `.cond-detail-row--hazard`, `.cond-detail-row--stale`, `.cond-older-toggle`, `.cond-empty`, `.cond-empty-text`. Inserted after `.cond-disclaimer` block.

---

## FIX 12.1 — Walk detail overlay

Full-screen slide-up overlay (`position: fixed; inset: 0; z-index: 300`). One persistent DOM element inside `#app`, after `cond-tag-sheet`. Opened by `.open` class via `transform: translateY(0)`.

**HTML:** `#walk-detail-overlay` with fixed header (back + walk name + share), scrollable body containing: hero image (220px), walk info block (name/location/rating/stats row), quick tags section, description, conditions section, mark-as-walked action, Leaflet map, Google Maps link.

**CSS:** Full overlay, header, hero, info block, stats row, detail-tag variants (positive/warning/neutral), conditions, actions, map section, dark mode overrides. Dark mode `.detail-tag--positive` uses `rgba(130,176,154,0.10)` / `rgba(130,176,154,0.20)` (not old neon mint values).

**JS globals:** `walkDetailMap`, `currentDetailWalkId`.

**JS functions added:**
- `isWalked(id)` — reads `sniffout_walked` from localStorage
- `openWalkDetail(id)` — looks up walk, calls `populateWalkDetail`, pushes history state, adds `.open`, defers `initWalkDetailMap` by 320ms
- `closeWalkDetail()` — removes `.open`, destroys Leaflet map, resets scroll, clears `currentDetailWalkId` after 310ms
- `populateWalkDetail(walk)` — populates all content: header, hero, badge, heart, name, location, rating, stats, tags, description, conditions, walked button, maps link, share button
- `renderDetailTags(walk)` — builds `.detail-tag` chips from walk schema (off-lead/difficulty/terrain/environment/enclosed/livestock/stiles/parking)
- `detailTag(icon, label, variant)` — helper for single detail-tag HTML
- `renderDetailConditions(walkId)` — reads `getDisplayTags()` + raw older tags, builds `.cond-detail-row` list or empty state; `clear` key excluded from TAG_LABELS/TAG_ICONS
- `toggleOlderReports(walkId)` — toggles hidden older-reports div
- `initWalkDetailMap(lat, lon, name)` — Leaflet map in `#walk-detail-map` container, destroys existing instance first
- `shareWalk(walk)` — Web Share API with clipboard fallback
- `showShareToast(message)` — 2-second toast, reuses `.undo-toast` CSS, no undo button
- `popstate` handler — closes overlay on Android back button

**`onWalkTap(id)` updated:** now calls `openWalkDetail(id)` after existing explore tracking logic.

**`onMarkWalked` updated:** dual calling convention — handles both `(event, walkId)` from carousel onclick handlers and `(walkId, btn)` from detail overlay. Detects by `typeof eventOrId === 'string'`.

---

## FIX 12.2 — Yr.no weather icons

Replaced Meteocons (`METEOCON_BASE`, `WMO_METEOCON`, `meteoconImg()`) with Yr.no weather symbols (`YR_BASE`, `WMO_YR`, `yrIcon()`).

- `YR_BASE`: `https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/svg/`
- `WMO_YR`: maps WMO codes to Yr.no filenames (day/night variants using `{code}d.svg`/`{code}n.svg`; codes without variants use `{code}.svg`)
- `yrIcon(code, isDay, size)`: returns `<img>` tag
- Call sites: `renderTodayStateB` → `yrIcon(cur.weather_code, cur.is_day, 64)`; `buildForecastGrid` → `yrIcon(code, 1, 32)` (back to 32px)
- Removed `.forecast-icon img` circular background CSS (was added for Meteocons readability)

---

## FIX 12.3 — Trail card declutter

Simplified `renderTrailCard()` to 3 elements: name / meta / chips.

- Removed: rating row, description block, mark-as-walked button from trail cards
- Meta row now shows: `{distance} mi · {difficulty}` (was duration · distance)
- Chips: off-lead + (enclosed OR terrain, not both) — max 2 chips, `flex-wrap: nowrap; overflow: hidden`
- Added `.trail-card-condition-dot` — 8px brand-green dot on photo, bottom-right, shown when `getDisplayTags(walk.id).length > 0`
- `.trail-card-name` gains `display: -webkit-box; -webkit-line-clamp: 2` overflow truncation
- `rerenderCondTagRow()` simplified: only updates `#walk-detail-cond-tags` if `currentDetailWalkId === walkId`; trail cards no longer have condition tag rows

## Round 11 — completion confirmation

| Fix | Description | Status |
|-----|-------------|--------|
| PREREQ | Condition detail CSS block | ✅ Done |
| FIX 12.1 | Walk detail overlay (HTML, CSS, 12 JS functions) | ✅ Done |
| FIX 12.2 | Yr.no weather icons replacing Meteocons | ✅ Done |
| FIX 12.3 | Trail card declutter — 3 elements, condition dot, simplified rerenderCondTagRow | ✅ Done |
