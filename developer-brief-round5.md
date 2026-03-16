# Sniffout v2 — Developer Brief Round 5
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: owner feedback session, March 2026.*

All work in **`sniffout-v2.html`** only. These three fixes are small and self-contained — implement them in the same session as the Round 4 fixes (developer-brief-round4.md) and Today tab changes (today-tab-dev-brief.md).

---

## FIX 6.1 — Remove parks and beaches from Nearby tab

**Reason:** Parks are already covered in the Walks tab under "Other nearby green spaces". Beaches duplicate that coverage. The Nearby tab should focus exclusively on services and amenities — cafes, pubs, pet shops, and vets.

**Changes required:**

1. Remove the `park` and `beach` entries from the `CATEGORIES` array (line ~2968):

```js
// Remove these two entries:
{ id: 'park',  label: 'Parks'    },
{ id: 'beach', label: 'Beaches'  },
```

2. Remove `park` and `beach` keys from `CATEGORY_ICON` (line ~2977):

```js
// Remove:
park:  '🌳',
beach: '🏖️',
```

3. Remove `park` and `beach` keys from `CATEGORY_LABEL` (line ~2985):

```js
// Remove:
park:  'Dog park',
beach: 'Dog-friendly beach',
```

4. Remove `park` and `beach` keys from `CAT_GOOGLE_CONFIG` (line ~2998):

```js
// Remove:
park:  { query: 'dog parks and nature reserves', tip: '...' },
beach: { query: 'dog friendly beaches',          tip: '...' },
```

5. **Default category check:** The Nearby tab currently defaults to `pub` as the initial selected category (confirmed in developer-notes.md FIX 1.5 re-implementation). Verify the default category on tab load is `pub` — not `park` or `beach`. If any initialisation code sets the default to `park` or `beach`, change it to `pub`.

6. **Cache clearance:** On implementation, any cached Nearby results for `park` or `beach` categories will be stale. `NEARBY_GOOGLE_CACHE` is already in-memory (cleared on page load). No additional action needed.

**Confirm:** Nearby tab category chip row shows: Pubs · Cafés · Pet Shops · Vets (4 chips only). No parks or beaches chip. Default category on tab open is Pubs.

---

## FIX 6.2 — Remove "Nearby" pill from "Other nearby green spaces" cards

**Reason:** Users set their own search radius. They know the results are nearby. The "Nearby" badge adds no information and creates visual noise on already-small cards.

**Location:** `renderGreenSpaceCard()` function, line ~2721.

**Current code:**

```js
'<span class="gs-nearby-badge">Nearby</span>'
```

**Fix:** Delete this `<span>` element from `renderGreenSpaceCard()`.

**Also:** If a `.gs-nearby-badge` CSS rule exists in the stylesheet, leave it in place — it is harmless as an unused rule.

**Confirm:** Green space cards in the Walks tab show no "Nearby" pill. Name and distance metadata remain.

---

## FIX 6.3 — Add "View on Google Maps →" link to green space cards

**Reason:** Green space cards come from Overpass API. Unlike Nearby venue cards (which have a "Get directions" link from Google Places data), green spaces have no way for users to navigate to them or find more information. A Google Maps link using the card's coordinates closes this gap.

**Location:** `renderGreenSpaceCard()` function, line ~2705.

**URL construction:** Build a Google Maps URL using the green space's name and coordinates:

```js
var mapsUrl = 'https://www.google.com/maps/place/' +
  encodeURIComponent(gs.name) +
  '/@' + gs.lat + ',' + gs.lon + ',16z';
```

**Updated `renderGreenSpaceCard()` — add the link to `.gs-card-body`:**

```js
'<div class="gs-card-body">' +
  '<div class="gs-card-left">' +
    '<div class="gs-card-name">' + escHtml(gs.name) + '</div>' +
    '<div class="gs-card-meta">' + distText + '</div>' +
  '</div>' +
  '<a class="gs-maps-link" href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer">' +
    'View on Google Maps →' +
  '</a>' +
'</div>'
```

Note: the `<span class="gs-nearby-badge">Nearby</span>` removed in FIX 6.2 is replaced here by the maps link. The two changes should be applied together.

**CSS to add:**

```css
.gs-maps-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--brand);
  text-decoration: none;
  white-space: nowrap;
  align-self: center;
}
.gs-maps-link:hover {
  text-decoration: underline;
}
```

**iOS note:** The owner has requested Google Maps links specifically. On iOS, `maps.google.com` URLs will open in the browser (not the native Maps app). This is expected and acceptable — the owner is aware. Do not add Apple Maps fallback.

**Security:** `escHtml()` is already applied to `gs.name` in the card title. The `gs.name` used in the `mapsUrl` is encoded via `encodeURIComponent()` — this is sufficient sanitisation for a URL context. Do not additionally pass it through `escHtml()` in the URL.

**Confirm:** Each "Other nearby green spaces" card shows a "View on Google Maps →" link aligned to the right of the card body. Tapping the link opens Google Maps at the correct coordinates in a new tab. The heart (if any) and name/distance display correctly alongside the link.

---

## Confirm When Done

- [ ] Nearby tab shows exactly 4 categories: Pubs · Cafés · Pet Shops · Vets
- [ ] No "Nearby" pill on green space cards
- [ ] Each green space card has "View on Google Maps →" link that opens correctly
- [ ] Default Nearby tab category on load is Pubs

---

## Developer Documentation

Update `developer-notes.md` with a section covering FIX 6.1–6.3: what was removed, what was added, and the URL construction approach for the Maps link.
