# Sniffout v2 — Developer Brief Round 3
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: developer-notes.md review + owner observations post-round-2 fixes.*

---

## Context

All Phase 1 fixes (FIX 1.1 through FIX 3.1) are confirmed complete per developer-notes.md. This brief covers three new issues identified by the owner after reviewing the round 2 build, plus one PO decision on a developer-raised question.

All work continues in **`sniffout-v2.html`** only.

---

## FIX 4.1 — Nearby tab: label change

**Issue:** The section label inside the Nearby tab currently reads "Nearby Green Spaces". The owner has requested a more accurate label.

**Change:**

In the Walks tab — the secondary section below the Community Trails carousel — rename the section label from:

`Nearby Green Spaces`

to:

`Other nearby green spaces`

This is a copy-only change. No logic change. The lowercase start and the word "Other" communicates that this is supplementary to the Community Trails section above it.

**Confirm:** Walks tab secondary section reads "Other nearby green spaces".

---

## FIX 4.2 — Nearby tab: venue images not showing on place cards

**Issue:** Place cards in the Nearby tab show no images — only a brand-green placeholder or blank area. The Google Places New API returns photo references that can be fetched as actual images. Venue photos significantly improve the usability and credibility of the Nearby tab.

**Implementation:**

The Google Places New API (v1) returns a `photos` array on each place result. Each entry in this array has a `name` field (a resource path like `places/ChIJ.../photos/AXCi...`).

To fetch a photo:
```
GET https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=400&key=YOUR_API_KEY
```

This returns the image directly (a redirect to the photo file).

**Changes required:**

1. When fetching venues via `POST /v1/places:searchText`, ensure `photos` is included in the `fields` mask in the request header (`X-Goog-FieldMask`). Add `places.photos` to the existing field list if it is not already present.

2. On each venue card, add an image element at the top of the card:
   - If `place.photos` exists and has at least one entry: use the URL constructed from `place.photos[0].name` as the `src`
   - If no photos are available: use the existing brand-green placeholder (`background: var(--brand)`)
   - Image dimensions: consistent with the card width, ~140px height
   - Use `loading="lazy"` on the `<img>` element
   - Do not block the card render on the image load — show the card immediately, let the image populate

3. The existing `escHtml()` sanitisation on venue names is already in place — do not change it. Apply the same `escHtml()` sanitisation to any photo attribution text if you render it.

**What not to change:** The card layout below the image (venue name, category chip, disclaimer) should remain as-is. This is an additive change — add the image area at the top, leave everything else in place.

**Confirm:** With a central London location set, Nearby tab venue cards show photos for at least some results. Cards without photos show the brand-green placeholder, not a broken image.

---

## FIX 4.3 — Nearby tab: map view not returning or displaying results

**Issue:** The map view on the Nearby tab is broken — switching to Map from the List/Map toggle either shows no pins, or shows pins with no data, or fails to render entirely.

**Likely cause:** The Google Places New API response uses a different location shape than the original Overpass API response. Specifically, in the New Places API, location coordinates are at:

```
place.location.latitude
place.location.longitude
```

Not at:
- `place.lat` / `place.lon` (Overpass / old format)
- `place.geometry.location.lat` / `place.geometry.location.lng` (Classic Places API)

If the map rendering code was written against Overpass or Classic Places API field names, the coordinates will be undefined and pins will not render.

**Fix:**

1. Locate the function that adds venue pins to the Leaflet map (likely calls `L.marker()` with lat/lon values).
2. Confirm whether it is reading `place.location.latitude` / `place.location.longitude`. If not, update it to use these field paths.
3. Confirm the `places.location` field is included in the `X-Goog-FieldMask` request header when fetching venues. If absent, add it.

**Additional checks while investigating:**

- If the Leaflet map container is initialised before venue results are available, confirm `map.invalidateSize()` is called after the map becomes visible (switching from List to Map toggles the container visibility, which can cause Leaflet to miscalculate its dimensions).
- Confirm the Leaflet `L.map()` call uses the correct DOM element ID — if the map container was renamed as part of the v2 rebuild, the initialisation target may be stale.

**Confirm:** With a location set and at least one venue category selected, switching to Map view shows venue pins on the correct area. Tapping a pin shows the venue name. Switching back to List shows the venue list. Map renders correctly on viewport resize.

---

## PO Decision — Walks tab map toggle

**Question raised by owner (via PO):** Should the Walks tab have a map toggle (List / Map view), for consistency with the Nearby tab?

**PO recommendation: Do not add a map toggle to the Walks tab.**

Reasons:

1. **Not in the owner-confirmed user story.** The Walks tab spec (confirmed non-negotiable in owner-feedback-round2.md) defines two sections: Community Trails carousel and Nearby Green Spaces vertical list. A map toggle was not included and should not be added without explicit owner sign-off.

2. **Walk routes are not map pins.** Walk cards represent linear routes with start/end points, not single-location venues. A map showing one pin per walk (presumably the start point) does not communicate a route, adds minimal discovery value over the sorted proximity list, and could mislead users about where a walk is relative to them.

3. **The list is already proximity-sorted.** Community Trails are sorted ascending by distance from the user's location. This solves the "what's nearby me" question more clearly than a map of pins would.

4. **The Nearby tab map serves a specific purpose.** Venues (pubs, cafes, parks) are point locations — a map is the right way to compare them spatially. Walk routes are not comparable in the same way.

**Owner decision (March 2026): Do not add a map toggle to the Walks tab.** Confirmed. No developer action required.

---

## FIX 4.4 — Add `enclosed` field to WALKS_DB schema

**Background:** The owner's Walks tab user story lists "Enclosed" as a quick tag. The developer correctly flagged that this field doesn't exist in the WALKS_DB v2 schema and held on it. **Owner has now signed off on adding the field.**

**Schema addition:**

Add `enclosed: boolean` to every entry in WALKS_DB. This sits alongside the existing `offLead` field.

```
enclosed: true   — the walk is fully or substantially enclosed (fenced fields, enclosed parks, secure areas)
enclosed: false  — not enclosed, or open countryside
```

**Field definition guidance:**
- `true`: the walk takes place within a fenced or otherwise enclosed area where a dog cannot easily escape to a road or open land — e.g. fully fenced country parks, enclosed woodland loops with gated entries
- `false`: open countryside, unfenced paths, parks with open boundaries, coastal paths — anywhere a dog off the lead could leave the defined walk area

**Population:** The Developer must set a value for all 25 existing WALKS_DB entries. Use best judgement from the existing walk descriptions — if the description or name suggests an enclosed park or fenced area, set `true`. If it's a countryside route, coastal path, or open common, set `false`. When uncertain, default to `false`.

**UI rendering:**

On Community Trails cards in the Walks tab, add an `enclosed` chip alongside the existing `offLead` and `terrain` chips:
- `enclosed: true` → render chip: `Enclosed` (use same chip style as off-lead and terrain chips)
- `enclosed: false` → do not render a chip (absence of the chip means not enclosed; adding a "Not enclosed" chip adds noise)

**WALKS_DB schema — updated field list:**

```
offLead:      "full" | "partial" | "none"
enclosed:     boolean   ← new
livestock:    boolean
hasStiles:    boolean
hasParking:   boolean
terrain:      "paved" | "muddy" | "mixed" | "rocky"
difficulty:   "easy" | "moderate" | "hard"
imageUrl:     string
badge:        "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined
rating:       number
reviewCount:  number
distance:     number (miles)
duration:     number (minutes)
source:       "curated" | "places"
description:  string
```

**Confirm:** At least one WALKS_DB entry has `enclosed: true` and its card shows an "Enclosed" chip. Entries with `enclosed: false` show no enclosed chip. No entries are missing the `enclosed` field.

---

## Confirm When Done

- [ ] Walks tab secondary section label reads "Other nearby green spaces"
- [ ] Nearby tab venue cards show photos where available; brand-green placeholder where not
- [ ] `photos` included in Google Places field mask request
- [ ] Nearby tab map view renders venue pins correctly for the selected category
- [ ] Tapping a venue pin shows the venue name
- [ ] Map container renders at correct size after List/Map toggle
- [ ] All 25 WALKS_DB entries have `enclosed: boolean` field populated
- [ ] Walk cards show "Enclosed" chip when `enclosed: true`; no chip when `enclosed: false`

---

## Developer Documentation

Update `developer-notes.md` with a section for each fix implemented:
- What was changed
- What field name / API issue was identified and resolved (for FIX 4.3)
- Any decisions made where the brief didn't fully specify
