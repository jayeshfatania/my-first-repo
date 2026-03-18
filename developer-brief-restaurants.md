# Developer Brief — Dog-Friendly Pubs & Restaurants in Nearby Tab

**Issued by:** Product Owner
**Date:** 2026-03-18
**File to edit:** `sniffout-v2.html` only

---

## Authorization Note

`CLAUDE.md` defers Google Places API expansion. This brief explicitly overrides that deferral for this specific feature. Do not expand to any other new venue categories or API calls beyond what is specified here.

---

## Overview

Add pubs and restaurants as a new category in the Nearby tab. Surface them via Google Places Nearby Search. Show a "Google-confirmed: dogs welcome" badge where `allowsDogs === true`. Apply a clear disclaimer throughout. Do not present results as a verified dog-friendly list — they are nearby pubs and restaurants, some of which are confirmed dog-friendly by Google.

---

## 1. Search Implementation

### Which API call to use

Use **Nearby Search (New)**, not Text Search. This is a deliberate decision to eliminate the false positive risk raised by the owner.

**Why not Text Search:** Text Search with a "dog friendly" keyword matches against review content. A venue with a review saying "not dog friendly here" would still rank in results because the phrase appears in the text. Nearby Search does not do keyword matching against reviews — it uses type filters only. There is no false positive risk from negative review content with Nearby Search.

### Exact API call

```js
async function fetchDogFriendlyVenues(lat, lon, radiusMiles) {
  const radiusMetres = Math.round(radiusMiles * 1609);
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const body = {
    includedTypes: ['bar', 'pub', 'restaurant', 'cafe'],
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lon },
        radius: radiusMetres
      }
    },
    rankPreference: 'DISTANCE',
    maxResultCount: 20
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.rating',
        'places.userRatingCount',
        'places.allowsDogs',
        'places.websiteUri',
        'places.googleMapsUri',
        'places.primaryType',
        'places.nationalPhoneNumber'
      ].join(',')
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.places || [];
}
```

Use `sniffout_radius` from localStorage as the `radiusMiles` input, converted to metres. If `sniffout_radius` is not set, default to 3 miles (4827m).

### Ranking

Results are ranked by distance (`rankPreference: 'DISTANCE'`). This is appropriate for a "nearby" discovery feature. Do not re-sort results in the UI — distance order is correct.

### Surfacing `allowsDogs`

The `allowsDogs` field has three states:

| Value | Meaning | UI treatment |
|-------|---------|--------------|
| `true` | Business owner or Google user has confirmed dogs allowed | Show "Google-confirmed: dogs welcome" badge |
| `false` | Explicitly confirmed dogs not allowed | Show result but add "Dogs may not be welcome — check before visiting" note in place of the badge |
| `null` / absent | No information — unknown | Show result with no badge, standard disclaimer only |

**Do not filter out results where `allowsDogs` is null.** The majority of UK pubs will return null, not because they are dog-unfriendly but because the attribute is simply unpopulated. Filtering to `true` only would make the feature nearly useless.

**Do not filter out results where `allowsDogs` is false.** The `false` state means someone has actively recorded "no" — this is useful signal. Show these results with a warning note so users can skip them. Hiding them would make the feature appear broken in areas where Google has low coverage.

### Disclaimer text

Two pieces of copy are required — one at the section level, one inline on cards.

**Section-level disclaimer** (rendered once above the results list):
> Venues listed may or may not welcome dogs. Where Google has confirmed dogs are welcome, we show a badge. Always check with the venue before visiting.

**Per-card fallback** (used on cards where `allowsDogs` is null):
> Call ahead to confirm dogs are welcome.

**Where `allowsDogs === true` (badge label):**
> Google-confirmed: dogs welcome

**Where `allowsDogs === false` (warning note):**
> Dogs may not be welcome here — check before visiting.

Do not use the word "verified" anywhere in this feature. Do not use the section heading "Dog-friendly pubs near you" — this implies curation. Use "Pubs & restaurants" as the category label.

### Billing note

Requesting `allowsDogs` in the field mask escalates the Nearby Search call to the **Enterprise + Atmosphere SKU**, which is a higher billing tier than the standard Essentials tier used for other Nearby Search calls in the app. The owner is aware of this. Do not remove `allowsDogs` from the field mask without PO approval.

---

## 2. UI Placement

### Category chip

Add **"Pubs & restaurants"** as a new category chip in the existing Nearby tab category row. Position it after the existing venue type chips but before any map-only options. Use the same chip styling as existing categories.

The category chip label is: `Pubs & restaurants`

Do not split this into two separate chips ("Pubs" and "Restaurants"). One chip, one API call, one results list.

### Results placement

When "Pubs & restaurants" is the active category:

1. Render the section-level disclaimer paragraph immediately below the category chips, before any venue cards.
2. Render venue cards below the disclaimer.
3. Do not show a Leaflet map for this category at launch. Walk venues use a map because spatial awareness matters for a 4-mile route. For a pub 400m away, a list ranked by distance is sufficient. Map can be added later if there is user demand.

### Visual distinction from other venue types

The existing venue categories (pet shops, groomers, vets) are services. Pubs and restaurants are social/dining destinations — distinct context. Distinguish them visually using the `primaryType` label on the card (see Section 3), not through different card chrome. The card design is the same; the badge and type label do the distinguishing.

---

## 3. Venue Card Design

Each venue card should display the following, in order:

**Card structure:**

```
[ Venue name — 600 weight, var(--ink), 16px ]
[ Primary type pill + distance ]
[ Rating stars + rating number + review count (if available) ]
[ Address — var(--ink-2), 13px ]
[ "Google-confirmed: dogs welcome" badge (if allowsDogs === true) ]
[ "Dogs may not be welcome here — check before visiting" note (if allowsDogs === false) ]
[ Heart/favourite button — top-right, existing implementation ]
[ Card footer: "Call ahead to confirm dogs are welcome." in var(--ink-2), 12px (if allowsDogs is null) ]
```

**Primary type pill:** Derive a human-readable label from `primaryType`:

| API `primaryType` | Display label |
|---|---|
| `pub` | Pub |
| `bar` | Bar |
| `restaurant` | Restaurant |
| `cafe` | Cafe |
| anything else | Venue |

**Distance:** Compute from the user's current lat/lon to `place.location.latitude / place.location.longitude` using the existing Haversine function already in the codebase (used for walk distance). Display as "0.3 mi" or "1.2 mi".

**Rating:** Display only if `place.rating` is present. Show star icon (use existing star SVG from the walks section) + rating to one decimal place + review count in brackets. Example: `★ 4.2 (318)`. If no rating, omit this row entirely — do not show a zero or placeholder.

**"Google-confirmed: dogs welcome" badge:** Small pill, `var(--brand)` background, white text, 11px, 600 weight. Only render when `allowsDogs === true`. Exact copy: `Google-confirmed: dogs welcome`.

**"Dogs may not be welcome" note:** When `allowsDogs === false`, render the warning in `var(--amber)`, 12px, below the address. Exact copy: `Dogs may not be welcome here — check before visiting.`

**Heart/favourite button:** Reuse the existing heart/favourite implementation used for other venue types. Store as part of `sniffout_favs` using `place.id` as the identifier, prefixed to avoid collision with walk IDs — e.g., `venue_ChIJ...`. Check how existing venue favourites are keyed and follow the same pattern.

**Tap behaviour:** Tapping the card opens a link to `place.googleMapsUri` in a new tab/window. This is the correct pattern for this feature — we do not have the infrastructure for a native venue detail overlay at this stage. If `googleMapsUri` is absent, fall back to `place.websiteUri`. If both are absent, the card is not tappable.

**Card footer disclaimer:** On cards where `allowsDogs` is null, add a small footer line inside the card: `Call ahead to confirm dogs are welcome.` in `var(--ink-2)`, 12px, 400 weight. This line replaces the badge row — do not show both.

---

## 4. Empty State

If the API returns an empty array, or if the fetch fails, show the following empty state in place of venue cards (below the section-level disclaimer):

**Heading:** `No pubs or restaurants found nearby`

**Body:** `Try widening your search radius in Settings, or search for venues in the Walks tab before you go.`

Style: centred, `var(--ink-2)`, consistent with other empty states in the app.

If the fetch itself fails (network error or API error), show:

**Heading:** `Couldn't load venues`

**Body:** `Check your connection and try again.`

Do not expose raw error messages or API error codes.

---

## 5. Function Naming

Name the new function `fetchDogFriendlyVenues(lat, lon, radiusMiles)`. Wire it into the existing `fetchPlaces(category)` dispatch or the Nearby tab's category switch handler — whichever pattern is already in use. Do not duplicate the API key or the location lookup; use the values already available in the session state.

---

## 6. What Not to Do

- Do not add the "dog friendly" keyword to any search query. Nearby Search uses type filters only. See Section 1 for reasoning.
- Do not filter results to `allowsDogs === true` only. See Section 1.
- Do not add a Leaflet map to this category at launch.
- Do not add any additional venue categories beyond pubs and restaurants (`bar`, `pub`, `restaurant`, `cafe`) without PO sign-off.
- Do not use the word "verified" anywhere in copy related to this feature.
- Do not use the heading "Dog-friendly pubs near you" — use "Pubs & restaurants".
- Do not add a "Still dog-friendly?" feedback button. Community verification is deferred to Phase 3.
