# Sniffout v2 — Phase 1 Fix Brief
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: validation-report-v2.md + owner review rounds 1 and 2. Last updated: March 2026.*

---

## ⚠️ Important: Use of dog-walk-dashboard.html

The Developer **may** open `dog-walk-dashboard.html` to read and understand logic. This is the only permitted reason to open it.

**Permitted:** Reading query logic, API call structure, filtering functions, and data patterns to understand how a feature worked.

**Not permitted:** Copying HTML structure, CSS rules, copy strings, UI layout, component patterns, or any design element into sniffout-v2.html.

**All fixes go into `sniffout-v2.html` only.** When a fix brief says "review the logic in dog-walk-dashboard.html", it means: read it, understand it, then implement your own clean version in sniffout-v2.html from scratch.

---

## Overview

The rebuild is substantially correct. All copy strings pass. CSS tokens, SVG nav, walk cards, State A/B logic, and session persistence all validated. This brief covers the remaining issues in priority order. Fix Priority 1 items first, confirm each works, then move to Priority 2, then Priority 3.

All work continues in **`sniffout-v2.html`** only. Do not touch `dog-walk-dashboard.html`.

---

## Priority 1 — Critical Fixes

These are bugs or broken/missing functionality that affect core user experience. Fix before anything else.

---

### FIX 1.1 — Social proof count does not match actual walk count

**Issue:** WALKS_DB contains 25 entries. Social proof strip (and meta description) claim "50+ handpicked UK walks." These are in direct conflict — a user opening the Walks tab will immediately see the discrepancy.

**Decision:** Update the social proof copy to reflect the actual count now. Do not claim a number we cannot support.

**Apply these strings:**

| Location | Current | Replace with |
|----------|---------|--------------|
| Social proof strip | `50+ handpicked UK walks · Works offline · Dog-specific routes` | `25 handpicked UK walks · Works offline · Dog-specific routes` |
| Meta description | `Discover 50+ handpicked UK dog walks...` | `Discover 25 handpicked UK dog walks...` |

**Note for Developer:** When the walk count grows, update these numbers. The owner will be adding more walk entries — the number should be updated to match at that point.

---

### FIX 1.2 — Recent searches not persisting

**Issue:** Searched locations are not being saved. Users must re-enter their location every time they open the app. The `recentSearches` localStorage key is defined in the architecture but is not being written to or read from correctly.

**Expected behaviour:**
- When a user successfully searches a location (postcode or place name), save it to `localStorage` key `recentSearches` as a JSON array of up to 5 entries
- Each entry: `{ label: "Battersea, London", lat: 51.48, lon: -0.15, timestamp: <unix ms> }`
- On save: push new entry to front of array; if array exceeds 5, remove the last entry; deduplicate by label (if the same location is searched again, move it to front, don't duplicate)
- On State A load: read from `recentSearches`; if entries exist, display as tappable pills above the search input. Tapping a pill loads that location directly (calls `loadWeatherAndShow(lat, lon, label)`) without requiring the user to type anything
- Pills label text: the saved `label` field
- If `recentSearches` is empty or null, show nothing (no empty state needed — the search input is sufficient)

**Confirm:** After fixing, search two different locations. Close and reopen the app. Both should appear as pills on State A.

---

### FIX 1.3 — Walks tab: full layout and logic spec (non-negotiable)

**This is a confirmed user story from the owner. It supersedes the previous Walks tab spec. Implement exactly as described.**

**Reference for logic:** Open `dog-walk-dashboard.html` and locate the Walks/Walkies tab rendering function and the `loadNearbyGreenSpaces()` function (or equivalent). Read and understand: how it filtered curated walks by radius, how it calculated distance, and how it fetched and appended supplementary green spaces. Implement your own clean version of this logic in sniffout-v2.html — logic only, no code, CSS, structure, or copy from the original file.

---

**Section 1 — Header and Location Context**

- Display a location context line at the top of the Walks tab: e.g. `Within 5km of Kingston`
- The radius value in this line should reflect the currently selected radius from `localStorage: sniffout_radius`
- Location name should come from the saved session label
- A filter/radius icon sits inline with or adjacent to this line — tapping it opens the radius chips (1 km · 3 km · 5 km · 10 km) per FIX 2.2
- When no location is set: do not show this line; show all curated walks with a prompt to set location for personalised results

---

**Section 2 — Primary: Community Trails**

- Section label: `Community Trails` (or `Recommended Trails` — use whichever reads better in context)
- Display as a **horizontal carousel** or a high-impact vertically stacked list — Developer's choice based on what renders cleanest. Carousel is preferred if 3+ results are available.
- Content: curated WALKS_DB entries (`source: 'curated'`) filtered to those within the selected radius, sorted by distance ascending
- Distance filtering: use Haversine formula against user's `lat/lon`
- Each card must show:
  - Walk name
  - Star rating (from `rating` field) and review count (from `reviewCount`)
  - Duration and distance (e.g. `1.2 mi · 45 min`)
  - Quick tag chips: off-lead status (from `offLead` field), terrain (from `terrain` field)
  - Brand-green photo placeholder (or image if `imageUrl` is set)

**Empty state for this section:**
- If no curated walks exist within the selected radius, display: `No community trails here yet — be the first to add one!`
- Still render Section 3 (green spaces) below even when this empty state is shown

---

**Section 3 — Secondary: Nearby Green Spaces**

- Section label: `Nearby Green Spaces`
- Display as a **vertical scrollable list or grid** — visually distinct from Section 2
- Smaller cards with less detail than Community Trails cards — name, distance, and a single tag chip at most
- No star rating (these are not curated — they come from Overpass API)
- Content: parks, nature reserves, and green spaces within the selected radius fetched from the Overpass API
- These results use `source: 'places'` and render with the `Nearby` neutral grey badge pill
- Visual hierarchy must be clear: Community Trails are the premium content; Green Spaces are supplementary. Use visual weight (card size, section label size, spacing) to communicate this without words

**No empty state for this section** — if no green spaces are found, simply omit the section silently.

---

**Do not change the Nearby/Places tab** — it operates independently.

**Confirm:** With a location set and radius at 3 km — Section 2 shows only curated walks within 3 km with carousel/list format. Section 3 shows green spaces below. Empty state shows if no curated walks found in radius. Changing radius to 10 km expands both sections.

---

### FIX 1.4 — Location search accuracy regression

**Issue:** Location search is returning less accurate results than the original POC. Users are likely hitting Nominatim results that favour non-UK locations or return unexpected coordinates.

**Likely causes and fixes:**

1. **Add `countrycodes=gb` to the Nominatim query** — without this, a search for "Richmond" returns Richmond, Virginia before Richmond, Surrey. This is the most probable cause.
   - Nominatim URL must include `&countrycodes=gb`

2. **Add `addressdetails=1` and limit result type** — add `&addressdetails=1&featuretype=settlement` to bias toward named places rather than administrative boundaries

3. **Prefer postcodes.io for UK postcodes** — postcodes.io is already integrated and is more reliable than Nominatim for UK postcodes. Ensure the code detects a postcode pattern (e.g. `/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i`) and routes to postcodes.io before falling back to Nominatim for free-text place names

4. **Use `Accept-Language: en` header on Nominatim** — prevents localised/non-English results

**Confirm:** Search "Richmond", "SW11", and "Edinburgh" — all should return accurate UK coordinates. Richmond should resolve to Surrey/London, not Virginia.

---

### FIX 1.5 — Nearby tab: deeper review required for dog-friendly accuracy

**Issue:** The previous fix (copying categories from the original) was not sufficient. Results are still returning non-dog-friendly venues. The accuracy of the original POC has not been matched.

The Developer must do a **deeper review** of the Places/Nearby tab logic in `dog-walk-dashboard.html` — not just the category list, but specifically how venues are queried, filtered, and displayed. The goal is to match the accuracy of the original POC.

**Reference:** Open `dog-walk-dashboard.html` and study the full Places/Nearby implementation:
- How are venues queried? What API, endpoint, and query structure is used?
- What specific tags, keywords, or filters are applied to select dog-friendly venues?
- Is there any post-fetch filtering (e.g. filtering results by name, category, or tag after the API returns)?
- How are results ranked or sorted?
- How are results displayed — what fields are shown?

Read and understand all of this. Then implement your own clean version in `sniffout-v2.html` that replicates the same filtering accuracy. No code, CSS, HTML structure, or copy from the original.

**Expected behaviour:**
- Results must be limited to venues genuinely likely to be dog-friendly: pubs, cafes, parks, pet-friendly accommodation, dog-friendly beaches, dog grooming, vets
- Generic restaurants, retail shops, and unrelated venue types must not appear
- Query, filter, and display logic should reflect whatever approach in the original produces accurate results

**Disclaimer — required on the Nearby tab:**

Add a small disclaimer below the venue list (or at the bottom of the tab):

> `Results may not always be up to date. We recommend calling ahead or checking official sources to confirm dogs are welcome and to verify opening times.`

Style it as small secondary text (`var(--ink-2)`, 12px). It must be present but unobtrusive. This protects the product if venue information is inaccurate.

**Confirm:** With a central London location set, spot-check 10 results — all should be plausibly dog-friendly venue types (pubs, cafes, parks, groomers). Disclaimer visible at bottom of Nearby tab.

---

## Priority 2 — UX Improvements

Owner-confirmed changes to improve usability. Implement after Priority 1 fixes are confirmed working.

---

### FIX 2.1 — Paw safety: conditional display only

**Issue:** Paw safety block currently shows on the Weather tab every day regardless of conditions. On a mild 15°C overcast day in March, a paw safety warning becomes noise — users stop reading it. The value of this feature depends entirely on it appearing only when genuinely relevant.

**New behaviour — show paw safety block only when:**
- Temperature is > 25°C (danger — hot pavement risk), **or**
- Temperature is ≤ 0°C (ice risk — gritting, ice on paths)

**Do not show paw safety block when conditions are normal** (temperature between 0°C and 25°C). No block, no placeholder, no empty space.

**Copy remains the same** for the two displayed states:
- Danger (> 25°C): `🐾 Too hot for paws`
- Ice (≤ 0°C): `🐾 Paw check needed` — body: use the approved ice/cold messaging

**Note:** The caution state (20–25°C) is removed. The threshold is now binary: shown or not shown. This keeps the feature high-signal.

**Confirm:** Test at three temperatures — simulate a cold day (≤ 0°C), a normal day (15°C), and a hot day (> 25°C). The block should appear only for cold and hot.

---

### FIX 2.2 — Radius filter: move inline to Walks and Nearby tabs

**Issue:** Radius is currently controlled in the Me tab settings (radius cycle button). Users cannot find it. The owner has confirmed the correct placement.

**New behaviour:**
- Add a filter/radius icon button to the right of the search bar on both the **Walks tab** and **Nearby tab**
- Tapping the icon opens a compact inline option set directly below the search bar (not a modal, not a new screen): `1 km · 3 km · 5 km · 10 km` as tappable chips
- Active chip shows `var(--brand)` fill; inactive chips use `var(--chip-off)` border
- Selecting a chip: saves to `localStorage` key `sniffout_radius`; immediately re-renders the walk/venue list for the new radius; closes the inline options
- **Remove** the radius cycle from the Me tab settings entirely — it should only live on these two tabs
- Default radius if `sniffout_radius` is unset: 5 km

**Icon:** Use a simple funnel/filter SVG icon (`<path d="M3 4h18l-7 8v6l-4-2V12L3 4z"/>` or similar). Keep it consistent across both tabs.

**Confirm:** Change radius on Walks tab — walk list updates. Change on Nearby tab — venue list updates. Reload app — selected radius persists. Me tab no longer shows a radius control.

---

### FIX 2.3 — Recent searches and starred locations on State A

**Issue:** State A home screen currently shows only the search input. The owner wants recent and pinned locations surfaced for quick re-use — no re-typing required.

**Behaviour spec:**

**Recent searches (auto-saved, from FIX 1.2):**
- Display the last 5 searched locations as horizontal pills below "or enter a place or postcode"
- Each pill: location label, tappable, loads that location directly
- Pills appear only when `recentSearches` array has entries

**Starred/pinned locations:**
- Each recent search pill has a small star icon on its right edge
- Tapping the star pins that location; the pill moves to the top of the list and gains a filled star indicator
- Starred locations are not displaced when new searches push the list to 5 — they remain pinned above the recent searches
- Storage: starred locations saved to `localStorage` key `sniffout_starred` as a JSON array; same entry shape as `recentSearches`: `{ label, lat, lon }`
- Maximum 3 starred locations (if 3 are starred, the star icon on unpinned pills becomes inactive/greyed until one is unstarred)
- Tapping a filled star unstars the location (moves it back to regular recent searches)

**Visual treatment:**
- Starred pills: `var(--brand)` left border or subtle brand-green tint to distinguish from unpinned
- Pill row is scrollable horizontally if there are many entries
- Do not show a label like "Recent searches" above the pills — let them speak for themselves

**Confirm:** Search 3 locations. Star one. Close and reopen. Starred location should be at top of pills. Search 5 more different locations. Original starred location should still appear (not displaced).

---

### FIX 2.4 — Today tab empty state: user needs clearer direction

**Issue:** When no location has been entered, it is not obvious to the user what to do next. The search bar in the top right is small and easy to miss. Users land on the Today tab and do not understand that they need to search for a location to get started.

**Expected behaviour:**
- The State A empty state must make the next action unmissable. The first thing a new user sees should clearly communicate: tap here to find walks near you
- Add a prominent, visually distinct call-to-action block in the centre of the Today screen (above the preview cards). This is the primary action — treat it as the hero element of State A
- Suggested layout (use this as a guide, implement with existing v2 token system and card styles):
  - A large tappable button or card area labelled `Find walks near me` — tapping triggers geolocation
  - Below it, a secondary text link: `Or enter a location →` — tapping expands the search input (existing behaviour)
- The "Use my location" button should be large and prominent, not a small secondary element
- The existing preview cards (walk preview + weather preview) remain below the CTA — they provide context on what the user will see once a location is set, so keep them

**What not to do:**
- Do not add a modal, overlay, or interstitial
- Do not change the existing State A copy (`Discover great walks`, subline, body text) — the copy is approved
- Do not add new copy beyond the button labels — the layout change is the fix

**Confirm:** Open the app fresh with no location set. The primary CTA should be immediately visible without scrolling. A first-time user should understand within 2 seconds what to tap.

---

### FIX 2.5 — Today tab: copy, info modal, and search placeholder

**Three small changes to the Today tab. All must be implemented together.**

---

**Change 1 — Weather preview card wording**

The weather preview card in State A currently reads: `Live weather + paw safety`

Remove this. Replace with:
- Primary line: `Live weather`
- Secondary line: `Safety tips when conditions are extreme`

The phrase "paw safety" is too specific for the preview — it implies the feature is always active, which (per FIX 2.1) it is not. The new wording sets accurate expectations: weather is always live; safety tips appear only when conditions warrant it.

---

**Change 2 — Info button on the weather card (State B)**

On the weather hero card in State B (when a location is set and weather is showing), add a small info icon button (ⓘ) in the top-right corner of the card.

Tapping it opens a simple **inline modal or bottom sheet** (not a new screen) with the following content:

> **What you'll see here**
>
> We show live weather conditions for your location. On normal days, you'll see a walk verdict and current conditions.
>
> If weather is extreme — very hot, freezing, stormy, or dangerously windy — we'll show a specific caution to help you plan your walk safely and protect your dog.
>
> Paw safety warnings appear only when pavement temperatures are genuinely dangerous (above 25°C or below 0°C).

Modal has a close button (✕ or tap outside to dismiss). Style using existing v2 surface/border tokens. Keep it simple — this is an explainer, not a feature.

---

**Change 3 — Search bar placeholder text**

Update the search input placeholder text to:

`Enter place name or postcode`

Applies to the search input in Today tab State A. The current placeholder text (if different) should be replaced with this exactly.

---

**Confirm:** Weather preview card shows "Live weather" / "Safety tips when conditions are extreme". Info button visible on State B weather card. Tapping it shows the explainer modal. Search input placeholder reads "Enter place name or postcode".

---

## Priority 3 — Polish

Low-impact fixes. Do after Priority 1 and 2 are confirmed.

---

### FIX 3.1 — Dark mode `--brand` colour not overridden

**Issue:** In `body.night` mode, `--brand` remains `#1E4D3A` (dark forest green). On dark backgrounds this is dark-on-dark — the primary CTA button, active nav label, active chip state, and preview card tint all lose contrast.

**Fix:** Add one line to the `body.night` CSS block:
```css
body.night {
  /* existing dark mode tokens */
  --brand: #6EE7B7; /* light teal — readable on dark backgrounds */
}
```

**Confirm:** Enable dark mode (set `body.night`). Primary button, active nav label, and active filter chip should all be clearly visible with the light teal colour.

---

### FIX 3.2 — Filter chip visual state (note — no code change required)

**Status:** Filter chips on the Walks tab toggle visual active state on tap but do not filter the walk list. This is intentional — filter logic is scoped to Phase 2 and is noted as such in the code comment.

**No code change needed.** Accept as-is for now. When FIX 1.3 (green spaces) is implemented and the walk list can contain mixed results, filter logic becomes more meaningful and should be built then.

---

## Summary — Fix Order

| # | Fix | Priority | Effort |
|---|-----|----------|--------|
| 1.1 | Social proof count corrected | Critical | Trivial |
| 1.2 | Recent searches persist + display as pills | Critical | Small |
| 1.3 | Walks tab: full layout spec — Community Trails + Green Spaces | Critical | Medium–Large |
| 1.4 | Location search accuracy (Nominatim params) | Critical | Small |
| 1.5 | Nearby tab: deeper review, dog-friendly filtering + disclaimer | Critical | Medium |
| 2.1 | Paw safety conditional display | UX | Small |
| 2.2 | Radius filter inline on Walks + Nearby tabs | UX | Small–Medium |
| 2.3 | Recent + starred locations on State A | UX | Medium |
| 2.4 | Today tab empty state — prominent CTA | UX | Small |
| 2.5 | Today tab: weather card copy, info modal, search placeholder | UX | Small |
| 3.1 | Dark mode `--brand` override | Polish | Trivial |
| 3.2 | Filter chips (Phase 2 deferral) | No action | — |

---

## Confirm When Done

Once all Priority 1 and 2 fixes are in place, confirm the following before marking the phase complete:

- [ ] Social proof and meta description show correct walk count
- [ ] Searching a location saves it; reloading State A shows it as a pill
- [ ] Walks tab shows location context header ("Within Xkm of [place]") with radius control
- [ ] Walks tab Community Trails section shows only curated walks within radius, sorted by distance
- [ ] Community Trails empty state shows correct message; green spaces still appear below it
- [ ] Walks tab Nearby Green Spaces section shows supplementary results below Community Trails
- [ ] Searching "Richmond" returns Surrey/London, not Virginia
- [ ] Nearby tab returns dog-friendly venues only — no generic restaurants or shops
- [ ] Nearby tab disclaimer visible at bottom of results
- [ ] Paw safety block absent on a 15°C day; present on simulated > 25°C and ≤ 0°C
- [ ] Radius filter chips on Walks and Nearby tabs; selecting re-renders the list
- [ ] Starred location persists and stays pinned after new searches
- [ ] Today tab State A: primary CTA visible immediately without scrolling
- [ ] Weather preview card reads "Live weather" / "Safety tips when conditions are extreme"
- [ ] Info button on State B weather card opens explainer modal
- [ ] Search input placeholder reads "Enter place name or postcode"
- [ ] Dark mode brand-coloured elements visible with light teal

---

## Developer Documentation

After completing all fixes, the Developer must update (or create) a file called **`developer-notes.md`** in this folder.

This file will be reviewed by the Validator and PO before sign-off. It must cover:

1. **What was changed** — for each fix, a brief description of what was implemented or modified in sniffout-v2.html
2. **Logic referenced from dog-walk-dashboard.html** — for any fix that required reading the original file (1.3, 1.5), document exactly what logic was referenced: function names, query approach, filtering method, any post-fetch filtering. Be specific.
3. **Decisions made** — anything not explicitly specified in this brief where a judgement call was made. If you chose between two approaches, document which you chose and why.
4. **Known limitations** — anything that doesn't fully match the expected behaviour and why

This is not a changelog — it is a working document explaining the thinking behind the implementation. Keep it factual and concise. One paragraph per fix is sufficient.
