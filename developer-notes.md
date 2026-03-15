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

## Known Limitations

- **Green spaces via Overpass vs Google Places:** The original `loadNearbyGreenSpaces()` uses Google Places which factors in relevance and reviews. Overpass returns raw OSM data without quality signals. Some results may be small or unnamed green spaces. The `["name"]` tag filter suppresses the worst of these. (This limitation only applies to the Walks tab green spaces supplement — the Nearby tab now uses Google Places.)
- **Beach results depend on OSM coverage:** Coastal areas are well-tagged; inland areas will return no beach results, which is correct.
- **Community Picks empty at small radii:** With 25 curated UK walks, a 1 km or 3 km radius will often return zero curated results outside walk hotspots. The "No community trails here yet" empty state and green spaces below are the main content at small radii.
