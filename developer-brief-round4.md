# Sniffout v2 — Developer Brief Round 4
*Issued by Product Owner. March 2026. For Developer use only.*
*Based on: developer-notes.md, design-review-round1.md, and round 3 checklist review.*

All work continues in **`sniffout-v2.html`** only. Do not touch `dog-walk-dashboard.html`.

---

## Round 3 Status Confirmation

The following round 3 items are confirmed complete per `developer-notes.md` and are not repeated in this brief:

| Fix | Item | Status |
|-----|------|--------|
| FIX 4.1 | "Other nearby green spaces" label text | ✅ Done |
| FIX 4.2 | Venue photos on Nearby tab | ✅ Done |
| FIX 4.4 | `enclosed` field added to all 25 WALKS_DB entries | ✅ Done |

Two items require verification or are unresolved — see Priority 1 below.

---

## Priority 1 — Critical: Must be fixed before any further testing

---

### FIX 5.1 — Dark mode `--brand` override missing from file (regression)

**Background:** FIX 3.1 was documented as complete in `developer-notes.md`. The Designer has reviewed the live `sniffout-v2.html` file and confirmed via full-file search that `#6EE7B7` does not appear anywhere in the file. The `body.night` block has no `--brand` override.

**Impact:** In dark mode, the `--brand` token remains `#1E4D3A` (dark forest green on a `#0F1C16` background — near-invisible). Affected elements: primary CTA button, active nav label, active radius and filter chips, paw safety block, preview card brand tints.

**Fix:** Add one line to the `body.night` CSS block:

```css
body.night {
  --bg:      #0F1C16;
  --surface: #1A2C22;
  --border:  #2A3D30;
  --ink:     #F0F0ED;
  --ink-2:   #8A9E92;
  --chip-off:#2A3D30;
  --brand:   #6EE7B7;   /* ← this line was missing */
}
```

**Confirm:** In dark mode (trigger by setting `body.night` manually or by testing a night-time location), the primary CTA button, active nav label, and active chips all render in light teal (`#6EE7B7`), not dark green.

---

### FIX 5.2 — Nearby tab map view: verify FIX 4.3 resolution

**Background:** FIX 4.3 was documented as complete (added `filteredVenues()` wrapper function). The Designer reviewed the file and found `filteredVenues()` is still undefined — calling `updateMapMarkers()` throws `ReferenceError: filteredVenues is not defined`. The Designer's fix is simpler than the documented approach.

**The Designer's finding:** `nearbyVenues` (defined at line ~2794, populated by `fetchNearbyPlaces`) already contains the current category's venues. No filter wrapper is needed since the API is already category-specific. The fix is to replace the call to the missing function with the existing array directly.

**Fix:** In `updateMapMarkers()`, replace:

```js
filteredVenues().forEach(function(v) {
```

with:

```js
nearbyVenues.forEach(function(v) {
```

If a `filteredVenues()` function was added elsewhere during FIX 4.3 but is still not resolving, remove it and use the direct reference above.

**Confirm:** With a location set and a category selected (e.g. pubs), tapping Map on the Nearby tab renders venue pins at the correct location. Tapping a pin shows the venue name. Switching back to List shows the venue list correctly.

---

## Priority 2 — High: Significant UX impact

---

### FIX 5.3 — Section label hierarchy: green spaces uses wrong CSS class

**Issue:** `developer-notes.md` FIX 4.1 updated the label text to "Other nearby green spaces" — correct. However, the CSS class was not changed. The secondary section still uses `.walks-section-label` (18px/700/`var(--ink)`) which gives it the same visual weight as the primary "Community Picks" section label. The owner's specification requires clear visual hierarchy — Community Trails as primary, green spaces as subordinate.

A smaller CSS class already exists but is unused:

```css
.walks-section-label-sm {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);
  padding: 4px 16px 8px;
}
```

**Fix:** In `renderWalksTab()`, change the green spaces section label from:

```js
html += '<div class="walks-section-label">Other nearby green spaces</div>';
```

to:

```js
html += '<div class="walks-section-label-sm">Other nearby green spaces</div>';
```

**Confirm:** In the Walks tab, "Community Picks" appears at larger weight/darker colour than "Other nearby green spaces". The secondary section is visually subordinate.

---

### FIX 5.4 — Trail card missing heart/favourite button

**Issue:** `renderTrailCard()` renders no heart button in the photo area. Users cannot add a walk to favourites from the Community Picks carousel — the primary walk surface on the Walks tab. `renderWalkCard()` and `renderPortraitCard()` both include a heart button; all three card types should be consistent.

**Fix:** Add a heart button to `renderTrailCard()` inside the `.trail-card-photo` div, using the same pattern as the other card types:

```js
'<div class="trail-card-photo">' +
  badgeHTML +
  '<button class="trail-heart' + (isFavourited(walk.id) ? ' fav-active' : '') + '" ' +
    'data-heart="' + walk.id + '" ' +
    'onclick="event.stopPropagation();toggleFavourite(\'' + walk.id + '\')">' +
    heartSVG(isFavourited(walk.id)) +
  '</button>' +
'</div>'
```

Add corresponding CSS:

```css
.trail-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
```

Also confirm `.trail-card-photo` has `position: relative` — add it if absent.

**Confirm:** Each Community Picks card shows a heart icon in the top-right of its photo area. Tapping the heart favourites the walk (filled heart) and persists across tab changes. Tapping again unfavourites. The favourited walk appears in the Me tab.

---

## Priority 3 — Medium: Visual inconsistency

---

### FIX 5.5 — Walk tag style inconsistency between card types

**Issue:** Off-lead and terrain tags render differently depending on which card type shows them:

| Card | Class | Style |
|------|-------|-------|
| `.walk-card` (Me tab) | `.walk-tag` | Brand-green tint, `border-radius: 6px` |
| `.trail-card` (Walks tab) | `.trail-tag` | Grey outlined pill, `border-radius: 99px` |

A walk saved in Favourites has green square-corner chips. The same walk in Community Picks has grey pills. These should be consistent.

**Fix:** Update `.trail-tag` to match `.walk-tag` styling:

```css
.trail-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--brand);
  background: rgba(30,77,58,0.1);
  border-radius: 6px;
  padding: 2px 8px;
}
.trail-tag.full    { color: var(--brand); background: rgba(30,77,58,0.08); }
.trail-tag.partial { color: var(--amber); background: rgba(217,119,6,0.08); }
```

In `renderTrailCard()`, pass the off-lead CSS class through as with `renderWalkCard()`:

```js
'<span class="trail-tag ' + ol.cls + '">' + ol.text + '</span>'
```

**Confirm:** Off-lead and terrain chips on Community Picks cards and Favourites cards use the same visual treatment (green tint, 6px radius).

---

### FIX 5.6 — Dark mode: State A preview card tints invisible

**Dependency:** Requires FIX 5.1 to be completed first. Once `--brand: #6EE7B7` is in the dark mode block, these overrides will use the correct teal value.

**Issue:** Preview cards (`.walk-preview-card`, `.weather-preview-card`) use hardcoded `rgba(30,77,58,x)` tints. On the `#0F1C16` dark background, these are effectively invisible — no card boundary or fill is visible.

**Fix:** Add dark mode overrides after the `body.night` block:

```css
body.night .walk-preview-card {
  background: rgba(110,231,183,0.06);
  border-color: rgba(110,231,183,0.18);
}
body.night .weather-preview-card {
  background: rgba(110,231,183,0.07);
  border-color: rgba(110,231,183,0.2);
}
body.night .walk-preview-tag {
  background: rgba(110,231,183,0.12);
  color: #6EE7B7;
}
body.night .weather-preview-title {
  color: #6EE7B7;
}
```

**Confirm:** In dark mode on the Today tab State A (no location set), both preview cards are visibly distinguishable from the background — a subtle teal tint and border is visible.

---

## Priority 4 — Low: Polish

---

### FIX 5.7 — Walk photo placeholder uses hardcoded hex instead of `var(--brand)`

**Dependency:** Only visible as a bug after FIX 5.1 is resolved. Until then, `#1E4D3A` and `var(--brand)` produce the same colour.

**Issue:** Three places hardcode `#1E4D3A` as the walk card photo placeholder background. Once `--brand` is `#6EE7B7` in dark mode, these hardcoded values won't follow — photo placeholders will remain dark forest green while all other brand elements switch to light teal.

**Fix:**
1. CSS: change `background: #1E4D3A` to `background: var(--brand)` on `.walk-photo`
2. JS `renderWalkCard()`: change `'background:#1E4D3A;'` to `'background:var(--brand);'`
3. JS `renderPortraitCard()`: same change

**Confirm:** In dark mode, walk card photo placeholders render in light teal (matching other brand elements), not dark forest green.

---

### FIX 5.8 — Green space card `border-radius` is 12px (should be 16px)

**Issue:** `.gs-card` uses `border-radius: 12px`. Every other card in the app uses `border-radius: 16px` (walk card, trail card, venue card, sign-in banner). The green space cards look slightly squarer and inconsistent.

**Fix:** Change `.gs-card` at line 1155 from `border-radius: 12px` to `border-radius: 16px`.

**Confirm:** Green space cards in the Walks tab secondary section have the same rounded corners as walk cards and venue cards.

---

## Copy Fix — Section Label Terminology

### FIX 5.9 — "Community Picks" label is misleading for curated content

**Issue:** The primary Walks tab section is labelled "Community Picks." The walks in this section are not community-submitted — they are curated by Sniffout. `CLAUDE.md` explicitly states "communityWalks is not part of v2 — community features are deferred." Using "Community Picks" misrepresents what the section contains.

The empty state "No community trails here yet — be the first to add one!" has the same problem — it implies community submission functionality that doesn't exist and is deferred.

**This is a PO decision item — see the flags section below before implementing.**

**Pending PO confirmation, the proposed changes are:**

| Current | Proposed |
|---------|----------|
| Section label: `Community Picks` | `Sniffout Picks` |
| Location context: `Community Trails` (anywhere used in JS) | `Curated Walks` |
| Empty state: `No community trails here yet — be the first to add one!` | `No walks found nearby. Try a wider radius.` |

`Sniffout Picks` aligns with the `Sniffout Pick` badge name already in the schema and copy-review. The empty state change removes the forward-looking community submission implication, which is appropriate for a POC that must not set expectations around features that don't exist.

**Do not implement until PO confirms.** See flags below.

---

## Confirm When Done

- [ ] Dark mode: `--brand: #6EE7B7` present in `body.night` CSS block (FIX 5.1)
- [ ] Nearby tab map: pins render correctly; `nearbyVenues.forEach` used, no `ReferenceError` (FIX 5.2)
- [ ] Walks tab: "Other nearby green spaces" uses `.walks-section-label-sm` class (FIX 5.3)
- [ ] Community Picks trail cards: heart button present in photo area; tapping it toggles favourites (FIX 5.4)
- [ ] Off-lead and terrain tags identical in style between `.walk-card` and `.trail-card` (FIX 5.5)
- [ ] Dark mode State A: preview cards visibly distinguishable from background (FIX 5.6)
- [ ] Walk card photo placeholders use `var(--brand)` not hardcoded `#1E4D3A` (FIX 5.7)
- [ ] Green space cards: `border-radius: 16px` (FIX 5.8)
- [ ] Section label copy (FIX 5.9): implement only after PO confirms below

---

## PO Flags — Decisions Required Before FIX 5.9

### Flag A — "Community Picks" vs "Sniffout Picks"

The owner's round 2 user story said: *"Labelled 'Community Picks' or 'Recommended Trails'."* The developer chose "Community Picks." However, this creates a positioning problem: the walks are curated, not community-generated, and community features are explicitly deferred. "Sniffout Picks" is accurate and consistent with the badge naming. "Recommended Trails" is also acceptable and avoids the issue.

**Decision needed:** Confirm preferred label — `Sniffout Picks`, `Recommended Trails`, or keep `Community Picks`.

### Flag B — Empty state forward-looking copy

The empty state "No community trails here yet — be the first to add one!" was previously accepted as forward-looking (PO note in `owner-feedback-round2.md`). However, this sets a user expectation of community submission — a feature that is deferred and may not arrive in POC. If the label changes to "Sniffout Picks", the empty state must also change. If label stays as "Community Picks", this string is acceptable as-is.

**Decision needed:** Confirm in context of Flag A decision.

---

## Developer Documentation

Update `developer-notes.md` with a section for each fix implemented, noting:
- What line numbers were changed
- For FIX 5.2: confirm whether `filteredVenues()` was removed or whether a working version was already present
- For FIX 5.9: note it is pending PO confirmation and should not be implemented until confirmed
