# Sniffout — Product Owner Action Plan: Round 15
*Issued by: Product Owner*
*Date: March 2026*
*Inputs: Owner confirmed decisions; CLAUDE.md; po-action-plan-round12.md; community-gamification-roadmap.md; sniffout-v2.html (code review)*

---

## Context

Round 14 shipped Me tab and Weather tab fixes plus Android back button handling (FIX 15.1-15.4). The owner has now completed a further testing cycle and confirmed the Round 15 scope. Two features are ready to implement. Three designer briefs are in flight (me-tab-rethink-v2-spec.md, badge-system-rethink.md, and an expanded weather icon brief). Several items are still blocked on designer or owner input.

**Total estimated effort: 2 - 3 hours (confirmed fixes only).**

Round 14 bug fixes (FIX 15.1-15.4) are being handled by the Developer in parallel and are not in this brief.

---

## Part 1 — Confirmed Fixes (Ready to Implement)

Implement in this order. No designer input needed. Dependencies noted per fix.

---

### FIX 16.1 — Recent and Starred Searches: State B Extension

**No dependencies. Implement first.**

**Background:** The recent and starred searches feature (labeled FIX 1.2 in the codebase, lines 7146-7289) is already implemented for State A — the initial location selection screen shown before any location is set. It provides:
- Last 5 recent searches auto-saved on each successful geocode
- Up to 3 starred (pinned) searches displayed above recent ones
- Pills rendered to `#recent-pills` (line 2683)
- Tapping a pill calls `loadFromPill()` which re-runs the search
- Data stored in `localStorage['recentSearches']` and `localStorage['sniffout_starred']`

**Gap identified by code review:** State B — the inline location-change search that returns users open by tapping the location line while the app already has a location set (the `#state-b-search` panel, lines 2737-2750) — does **not** show recent or starred pills. A user who taps to change their location mid-session gets a blank text field with no saved history. This is the primary location-change flow for returning users and is where the feature has the most impact.

**Fix required:**

**Step 1 — Add pills container to State B HTML**

Inside `#state-b-search`, after `<div class="search-error" id="state-b-search-error">`, add:

```html
<div id="state-b-recent-pills"></div>
```

**Step 2 — Add CSS for State B pills container**

The `recent-pill` and `pill-star` CSS classes are already defined and shared. Add only the container positioning:

```css
#state-b-recent-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0 4px;
}
#state-b-recent-pills:empty { display: none; }
```

**Step 3 — Update `renderRecentPills()` to also write to State B**

The existing function renders pill HTML and writes it to `#recent-pills`. Extend it to write the same HTML to `#state-b-recent-pills` if that element exists:

```js
function renderRecentPills() {
  var targets = [
    document.getElementById('recent-pills'),
    document.getElementById('state-b-recent-pills')
  ];

  // Build pill HTML (same logic as current — compute once, apply to both)
  var starred = getStarred().filter(function(e) { return e && e.label && e.lat && e.lon; });
  var recent  = getRecent().filter(function(e)  { return e && e.label && e.lat && e.lon; });
  var starredLabels = starred.map(function(s) { return s.label; });
  var recentOnly = recent.filter(function(r) { return starredLabels.indexOf(r.label) === -1; });
  var all = starred.concat(recentOnly);

  var pillsHtml = all.length === 0 ? '' : all.map(function(entry) {
    var isStarred = starredLabels.indexOf(entry.label) !== -1;
    var canStar   = !isStarred && starred.length < STARRED_MAX;
    var starIcon  = isStarred ? luIcon('star', 12, 'fill:currentColor;') : luIcon('star', 12);
    var starTitle = isStarred ? 'Unpin' : (canStar ? 'Pin' : 'Max 3 pinned');
    return (
      '<span class="recent-pill' + (isStarred ? ' starred' : '') + '" ' +
        'onclick="loadFromPill(' + entry.lat + ',' + entry.lon + ',\'' + escPillLabel(entry.label) + '\')">' +
        escHtml(entry.label) +
        '<span class="pill-star" title="' + starTitle + '" ' +
          'onclick="event.stopPropagation();toggleStarred(' + entry.lat + ',' + entry.lon + ',\'' + escPillLabel(entry.label) + '\')">' +
          starIcon +
        '</span>' +
      '</span>'
    );
  }).join('');

  targets.forEach(function(el) {
    if (el) { el.innerHTML = pillsHtml; syncIcons(); }
  });
}
```

**Note:** This replaces the existing `renderRecentPills()` body — the logic is the same, just computed once and applied to both targets.

**Step 4 — Render pills when State B opens**

In `toggleStateBSearch()`, when the panel is being opened (the `opening` branch), call `renderRecentPills()` after the existing setup:

```js
// In toggleStateBSearch(), inside the `if (opening)` branch:
renderRecentPills();
```

**Step 5 — Verify geocoding hooks save and re-render correctly for State B**

The existing hooks already intercept `geocodeAndGo()` and `geocodeByName()` to call `saveRecentSearch()`, which itself calls `renderRecentPills()`. The State B submit button calls `geocodeAndGo()` (verify this — check the `_sbBtn` event listener). If it does, no additional hook is needed and State B searches will auto-save and re-render the pills.

If the State B submit calls a different path: add `saveRecentSearch(name, lat, lon)` to that path.

**Verify:**
- State A (no location set): pills appear above the search input, unchanged from current behaviour.
- State B (location set, user taps location line): pills appear below the text field. Tapping any pill re-runs the search and closes State B.
- Performing a new search from State B: search is saved and appears in pills on next open.
- Starring a pill in State B: persists across both State A and State B views.
- Empty state (no searches yet): pills container hidden, no blank space.

**Estimated effort: 30-45 min.**

---

### FIX 16.2 — Place Favouriting (Nearby tab — Part A: save only)

**No dependencies. Implement after FIX 16.1.**

**Scope split:** This fix ships in two parts across two rounds:
- **Part A (Round 15 — this fix):** Heart button on venue cards; save/remove from localStorage. No Me tab display.
- **Part B (Round 16+ — blocked):** Display favourited places in the Me tab. Blocked on me-tab-rethink-v2-spec.md.

**Background:** Venue cards in the Nearby tab (`renderVenueCard()`, line 6817) are plain `<a>` tags with no save mechanism. The current venue object uses a dynamic `id: 'gp-' + i` which changes between fetches (based on sort index). A stable identifier is required for favouriting to persist reliably.

**PO decision on stable identifier:** Add `places.name` to the Google Places field mask. The resource name (e.g. `places/ChIJ...`) is stable and unique per venue. This is an additional field on the existing API call — not a new API call or new category — and is within the current integration scope per CLAUDE.md.

**Storage schema — new localStorage key `sniffout_place_favs`:**

```js
// Array of saved place objects:
[
  {
    placeId:  "places/ChIJ...",   // stable Google Places resource name
    name:     "The Fox & Hound", // display name
    cat:      "pub",             // category id: pub | cafe | shop | vet
    address:  "12 High St, Leeds", // short address (2 segments)
    mapsUrl:  "https://maps.google.com/...", // for direct link in Me tab
    savedAt:  1741200000000      // timestamp — used for ordering in Me tab
  },
  ...
]
```

**Changes required:**

**Step 1 — Add `places.name` to the Google Places field mask**

In `fetchNearbyPlaces()`, update the `X-Goog-FieldMask` header:

```js
// Before:
'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,...'

// After:
'X-Goog-FieldMask': 'places.name,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.regularOpeningHours,places.googleMapsUri,places.location,places.photos'
```

**Note:** `places.name` here is the resource name (the Places API unique identifier), not the display name. The display name is `places.displayName.text`. Do not confuse these.

**Step 2 — Store `placeId` on the venue object**

In the `.map(function(p, i)` inside `fetchNearbyPlaces()`, add `placeId: p.name || null` to the returned object:

```js
return {
  placeId: p.name || null,   // stable resource name — add this line
  id:      'gp-' + i,
  name:    (p.displayName && p.displayName.text) || 'Unknown',
  // ...rest unchanged
};
```

**Step 3 — Add storage functions**

Add near the existing `getFavourites()` / `saveFavourites()` functions:

```js
var PLACE_FAVS_KEY = 'sniffout_place_favs';

function getPlaceFavourites() {
  try { return JSON.parse(localStorage.getItem(PLACE_FAVS_KEY)) || []; } catch(e) { return []; }
}

function savePlaceFavourites(favs) {
  try { localStorage.setItem(PLACE_FAVS_KEY, JSON.stringify(favs)); } catch(e) {}
}

function isPlaceFavourited(placeId) {
  if (!placeId) return false;
  return getPlaceFavourites().some(function(f) { return f.placeId === placeId; });
}

function togglePlaceFavourite(placeId) {
  var venue = nearbyVenues.find(function(v) { return v.placeId === placeId; });
  if (!venue) return;
  var favs = getPlaceFavourites();
  var idx  = favs.findIndex(function(f) { return f.placeId === placeId; });
  if (idx !== -1) {
    favs.splice(idx, 1);
  } else {
    favs.unshift({
      placeId: placeId,
      name:    venue.name,
      cat:     venue.cat,
      address: venue.address,
      mapsUrl: venue.mapsUrl,
      savedAt: Date.now()
    });
  }
  savePlaceFavourites(favs);
  renderVenueList(); // re-render cards to update heart fill state
}
```

**Note:** `togglePlaceFavourite` reads the venue's full data from `nearbyVenues` (the current in-memory list) rather than passing everything through inline `onclick` attributes. This keeps the onclick call clean: `togglePlaceFavourite('places/ChIJ...')`.

**Step 4 — Add heart button to `renderVenueCard()`**

The existing venue card is an `<a>` tag. Add a heart button inside it. Position it absolutely over the venue photo.

Add to CSS (near `.venue-card-gp` styles):

```css
.venue-card-gp { position: relative; } /* add if not already set */

.venue-fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.88);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  z-index: 1;
  flex-shrink: 0;
}
```

In `renderVenueCard(venue)`, add the heart button HTML. Only render it when a stable `placeId` is available:

```js
var isFaved   = venue.placeId ? isPlaceFavourited(venue.placeId) : false;
var heartHtml = venue.placeId
  ? '<button class="venue-fav-btn" ' +
    'onclick="event.preventDefault();event.stopPropagation();togglePlaceFavourite(\'' + venue.placeId.replace(/'/g, "\\'") + '\')" ' +
    'aria-label="' + (isFaved ? 'Remove from saved places' : 'Save place') + '">' +
    luIcon('heart', 16, isFaved ? 'fill:var(--red);stroke:var(--red);' : 'stroke:var(--ink-2);') +
    '</button>'
  : '';
```

Add `heartHtml` as a child of the returned card HTML, positioned after the opening `<a>` tag and before `photoHtml`. It will position absolutely over the photo area.

**Step 5 — Verify `nearbyVenues` cache is current when `togglePlaceFavourite` is called**

`nearbyVenues` is the module-level array set by `fetchNearbyPlaces`. If the user switches category and returns, the array is repopulated. Confirm that `togglePlaceFavourite` can always find the right venue — if the category has changed and `nearbyVenues` no longer contains the tapped venue's `placeId`, the function returns early and does nothing (correct and safe).

**Note on NEARBY_GOOGLE_CACHE invalidation:** No change needed. The cache key includes category + lat/lon + radius, not place IDs. Adding `places.name` to the field mask means cache entries from before this fix will not contain `placeId`. Clear the cache on first load by bumping the service worker cache key in `sw.js` — or simply accept that the cache clears naturally after the session. Do not change `sw.js` unless explicitly instructed.

**Verify:**
- Open Nearby tab. Tap a pub card's heart button: heart fills red. No navigation occurs. Card re-renders with filled heart.
- Tap again: heart empties. Place removed from `sniffout_place_favs`.
- Switch category (e.g., Cafés), return to Pubs: previously hearted pub still shows filled heart (persisted in localStorage).
- Venues that don't have a stable `placeId` (edge case — null fallback): no heart button rendered. No error thrown.
- DevTools Storage: `sniffout_place_favs` array updates correctly on each toggle.
- Me tab: no changes visible yet (Part B is Round 16+).

**Estimated effort: 60-90 min.**

---

## Part 2 — Design-Blocked Items (Awaiting Designer Output)

No developer work until the relevant designer spec is approved by the owner.

---

### Me Tab Redesign — Awaiting me-tab-rethink-v2-spec.md

The Me tab is being fully rethought by the Designer. No Round 15 developer work should touch the Me tab beyond what is already in flight (Round 14 FIX 15.1-15.4, handled in parallel).

**What is blocked:**
- Round 15 Part B of FIX 16.2 — showing saved places in the Me tab
- Any stats, layout, or badge display changes to the Me tab
- The Round 14 FIX 15.1 (miles label) and FIX 15.2 (favourites list placement) may be superseded by the redesign spec — Developer should flag this conflict once the spec arrives

**Dependency flag:** When me-tab-rethink-v2-spec.md is approved:
1. Assess whether the Round 14 Me tab fixes (15.1, 15.2) need to be re-implemented differently to match the new spec
2. Scope Part B of FIX 16.2 (saved places section in Me tab)
3. Confirm badge display approach (see below)

---

### Badge System Redesign — Awaiting badge-system-rethink.md

The badge system is being rethought by the Designer. No badge-related developer work in Round 15.

**Context from community-gamification-roadmap.md:** Milestone badges (not streaks) are the confirmed direction. The exact badge set, visual design, and trigger conditions are under designer review. The underlying `getEarnedBadges()` function (deferred from Round 13, listed in po-action-plan-round12.md) should not be implemented until the badge spec is confirmed — implementing it now would require rework.

**What is blocked:** `getEarnedBadges()`, badge chip display, badge-related Me tab sections.

---

### Weather Icon Sizing and Cross-Tab Consistency — Expanded Designer Brief B

**Background:** Round 14 issued Designer Brief B covering Weather tab hero icon vertical alignment (currently `margin-top: 8px` on the 72px icon relative to the 80px temperature number). The owner's Round 15 testing has expanded this to a cross-tab consistency requirement: the weather icon should be the same size and consistently positioned on both the Today tab and the Weather tab.

**Current state (code review):**
- Today tab: `yrIcon(cur.weather_code, cur.is_day, 64)` — 64px icon, no margin offset, inside a `<div>` with `display: flex` alignment in `.weather-hero-top`
- Weather tab: `<img class="wx-hero-icon">` — 72px with `margin-top: 8px`, aligned to cap height of 80px temperature number

The two tabs use different sizes, different alignment approaches, and different layout contexts. Making them consistent requires decisions the Designer must make.

**Expanded Designer Brief B scope:**

1. **Confirm target icon size** for both tabs. Options: keep 72px on Weather (aligned to 80px temp); increase both to 80px; or set a unified size between the current 64px and 72px. Whichever is chosen applies to both tabs.

2. **Today tab icon alignment**: The Today tab's weather hero uses `flex` alignment to sit beside the temperature number. The icon may need `align-self` or margin adjustments to match whatever alignment rule is established for the Weather tab.

3. **Weather tab icon alignment**: Confirm whether `margin-top: 8px` is correct on the chosen size, or whether `align-items: center` on the flex row is preferable.

4. **Deliverable**: Updated CSS values for both tabs — specifically the `size` parameter passed to `yrIcon()` on the Today tab, and the `width`/`height` values plus `margin-top` in `.wx-hero-icon` on the Weather tab.

**No developer work until Designer Brief B output is received and owner-approved.**

---

## Part 3 — Items Needing Owner Decision / Developer Verification

---

### Walk Detail "Report Conditions" Link — Developer Verification Required

**Owner request:** Verify the "Report conditions" link behaviour works correctly post Round 12 fixes.

**Code review finding:** The implementation appears correct:
- `#cond-tag-sheet` and `#cond-tag-backdrop` are at z-index 401/400 (FIX 13.2 ✓)
- "Add or update conditions →" link is rendered correctly in `populateWalkDetail()` when `isWalked(walk.id)` is true (line 4807-4815 ✓)
- Link calls `openCondTagSheet(walk.id)` (line 4813 ✓)
- `onMarkWalked()` correctly calls `hasSubmittedTagsToday()` before auto-opening the sheet (line 4513 area ✓)

**Developer verification checklist — test on a real Android device:**

1. Open walk detail overlay on a walk never previously marked as walked. Confirm: "Mark as walked" button (State 1). No conditions link visible.
2. Tap "Mark as walked". Confirm: button updates to "Walked today" (non-interactive). Conditions sheet appears above the overlay (not behind it). "Add or update conditions →" link appears below the button.
3. Dismiss the conditions sheet (swipe down). Conditions link remains visible. Tapping it re-opens the conditions sheet above the overlay.
4. Close overlay. Reopen same walk. Confirm: button shows "Walked today" (State 2). "Add or update conditions →" link is visible.
5. Submit condition tags. Close overlay. Reopen same walk. Conditions sheet does NOT auto-open (24-hour suppression). "Add or update conditions →" link still visible and functional.
6. Open a different walk not previously walked. Confirm: State 1, no link.

**If all steps pass:** Mark as verified. No code change needed. Report to owner.

**If any step fails:** Investigate. Common failure modes:
- Conditions sheet rendering behind overlay: re-check z-index values on `#cond-tag-sheet` (expect 401) and `#walk-detail-overlay` (expect lower z-index)
- Link not appearing: check `isWalked()` is reading from `sniffout_walk_log` correctly
- Auto-prompt firing after submission: check `hasSubmittedTagsToday()` and the `sniffout_condition_tags` storage key

**Estimated effort: 20-30 min (verification) + fix time if a bug is found.**

**Owner decision required after verification:** Developer to report findings to owner. If a bug is found, the fix is added to the Round 15 build. If verified clean, close the issue.

---

## Part 4 — Deferred Items

---

### Moon Phase — Issue 8 (Deferred Again to Round 16+)

**Context:** Deferred from Round 14 pending an owner brief on placement, content, and display conditions.

**PO assessment for Round 15:** The owner's Round 15 input lists moon phase as an "item to assess" but has not provided the required brief. The three open questions from Round 14 remain unanswered:
- Where on the Weather tab does moon phase appear? (hero section, standalone card, replacement metric tile)
- What information is shown? (phase name, icon, illumination %, rise/set time)
- Is it always shown or only at night (`body.night`)?

**Decision: Defer to Round 16.** The technical implementation is small (lunar phase calculation requires no API — derivable from a known reference date and the 29.53-day synodic period). But placement and content must be defined before implementation begins to avoid rework on the recently redesigned Weather tab.

**For Round 16:** Owner to provide a brief covering the three questions above before the round opens.

---

### Theme Colour Update — Still Blocked on Designer Brief A

Designer Brief A (brand colour alternatives) was issued in Round 14. No colour has been selected yet.

When a colour is selected:
1. CSS token: `--brand: #1E4D3A` → new value (one change in `sniffout-v2.html`)
2. Theme meta: `<meta name="theme-color" content="#1E4D3A">` → new value
3. Manifest: `"theme_color": "#1E4D3A"` in `manifest.json` → new value

All three changes ship in the same commit. Do not implement until the owner has selected a colour.

---

### Me Tab Developer Work — Blocked on Designer Spec

All Me tab developer work beyond Round 14 in-flight fixes is blocked on me-tab-rethink-v2-spec.md. This includes:
- FIX 16.2 Part B (saved places section)
- Badge display
- Distance progress bar
- Walk history section
- Stats row layout

Round 16 cannot be fully scoped until the Designer spec is approved.

---

### Badge System Developer Work — Blocked on Designer Spec

All badge-related developer work is blocked on badge-system-rethink.md. This includes:
- `getEarnedBadges()` function
- Badge chip display in Me tab
- Badge unlock logic and thresholds

---

## Round 15 — Complete Scope Summary

| Item | Type | Effort | Status |
|---|---|---|---|
| FIX 16.1 — Recent/starred searches in State B | Confirmed fix | 30-45 min | Ready |
| FIX 16.2 Part A — Place favouriting (save + heart) | Confirmed fix | 60-90 min | Ready |
| Walk detail conditions link | Verification | 20-30 min | Needs developer check, report to owner |
| Me tab redesign | Design-blocked | TBD | Awaiting me-tab-rethink-v2-spec.md |
| Badge system | Design-blocked | TBD | Awaiting badge-system-rethink.md |
| Weather icon consistency | Design-blocked | TBD | Awaiting expanded Designer Brief B |
| Moon phase | Deferred Round 16+ | Small | Needs owner brief (placement/content) |
| Theme colour update | Blocked | Small | Awaiting Designer Brief A colour selection |
| **Total confirmed** | | **~2-3 hrs** | |

**Implementation order:**
1. FIX 16.1 (Recent/starred in State B — no dependencies, isolated change)
2. FIX 16.2 Part A (Place favouriting — no dependencies, isolated to Nearby tab)
3. Walk detail verification checklist (can be done at any point, no code dependencies)

---

## Dependency Map — What Unblocks What

| Blocker | Unblocks |
|---|---|
| me-tab-rethink-v2-spec.md approved | FIX 16.2 Part B (saved places in Me tab), Me tab stats/history/layout, Round 14 FIX 15.1-15.2 review |
| badge-system-rethink.md approved | `getEarnedBadges()`, badge chip display, badge milestone triggers |
| Expanded Designer Brief B output | Weather icon size + margin updates on Today and Weather tabs |
| Designer Brief A colour selection | `--brand` token update, theme-color meta, manifest.json |
| Owner brief on moon phase | Round 16 moon phase implementation brief |

**Nothing in Round 15 is blocked.** Both confirmed fixes are independent of all designer work.
