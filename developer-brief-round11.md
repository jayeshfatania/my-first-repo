# Developer Brief — Round 11

*Issued by: Product Owner*
*Date: March 2026*
*Based on: walk-detail-overlay-spec.md (Designer, March 2026); condition-tags-design-spec.md §4 (Designer)*
*File: sniffout-v2.html only*

---

## Context

Round 10 is complete (FIX 11.1–11.4). This brief delivers the walk detail overlay — the last major deferred component from Phase 2. It replaces the `onWalkTap()` stub that has been a placeholder since Round 8.

**Read walk-detail-overlay-spec.md in full before starting.** The spec is implementation-ready. This brief adds corrections, calls out two missing prerequisites, and provides the complete implementation order.

---

## Prerequisites — Condition Detail CSS (not yet in build)

The walk detail overlay's conditions section depends on CSS classes from `condition-tags-design-spec.md §4` that were deferred from Round 8. These classes are confirmed absent from the build. They must be added before or alongside the overlay.

Add these rules to the `<style>` block, in the condition tags section:

```css
/* ── Condition tags: detail view rows (condition-tags-design-spec.md §4B–4D) ── */

.cond-detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--ink);
}
.cond-detail-label {
  flex: 1;
  font-weight: 500;
}
.cond-detail-age {
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
}

/* Hazard row — amber label and icon colour */
.cond-detail-row--hazard .cond-detail-label { color: var(--amber); }

/* Stale row — dimmed, amber age text */
.cond-detail-row--stale { opacity: 0.55; }
.cond-detail-row--stale .cond-detail-age {
  color: var(--amber);
  font-style: italic;
  opacity: 1; /* override parent */
}

/* Older reports disclosure toggle */
.cond-older-toggle {
  display: block;
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  color: var(--ink-2);
  font-weight: 500;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Empty state */
.cond-empty {
  text-align: center;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.cond-empty-text {
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 400;
  max-width: 240px;
  line-height: 1.5;
}
```

---

## FIX 12.1 — Walk Detail Overlay

One overlay serves all card types (trail carousel, portrait card, Me tab favourites). Walk ID is passed to `openWalkDetail(id)`, which looks up `WALKS_DB` and populates all content dynamically.

---

### Step 1 — Add the overlay CSS

Add the following CSS block to the `<style>` block, after the condition tags rules. The spec provides the complete block — copy it directly from `walk-detail-overlay-spec.md § CSS`.

**One correction required** — the dark mode rule for `.detail-tag--positive` in the spec references old pre-Round-9 rgba values. Replace with the updated values:

```css
/* CORRECT version — use this, not the spec version */
body.night .detail-tag--positive {
  color: var(--brand);
  background: rgba(130,176,154,0.10);
  border-color: rgba(130,176,154,0.20);
}
```

The spec has `rgba(110,231,183,...)` — these are the pre-FIX-10.1 accent values and must not be used. All other dark mode rules in the spec are correct.

---

### Step 2 — Add the overlay HTML

Place the overlay element inside `#app`, after the bottom `<nav>` element. Copy the HTML directly from `walk-detail-overlay-spec.md § Overlay Architecture`.

The Lucide icons in the header buttons (`arrow-left`, `share-2`) should be placed as `<i data-lucide="...">` elements inside the buttons — `syncIcons()` is called by `populateWalkDetail()` on every open.

---

### Step 3 — Add JS variables and functions

Add the following in order. Each function is fully specified in `walk-detail-overlay-spec.md § JavaScript`. This step notes where to add them and flags any corrections.

**New global variables** (near the top of the main script block, with other globals):
```js
var walkDetailMap = null;
var currentDetailWalkId = null;
```

**Functions to add:**

| Function | Source | Notes |
|----------|--------|-------|
| `isWalked(id)` | Spec `populateWalkDetail` footnote | Not currently in build — add it |
| `openWalkDetail(id)` | Spec `openWalkDetail` section | Include `history.pushState` before `.open` |
| `closeWalkDetail()` | Spec `closeWalkDetail` section | Copy as-is |
| `populateWalkDetail(walk)` | Spec section | See correction below |
| `renderDetailTags(walk)` | Spec section | See correction below |
| `detailTag(icon, label, variant)` | Spec section | Copy as-is |
| `renderDetailConditions(walkId)` | Spec section | See correction below |
| `toggleOlderReports(walkId)` | Not yet in build — add it | See spec below |
| `initWalkDetailMap(lat, lon, name)` | Spec section | Copy as-is |
| `shareWalk(walk)` | Spec section | Copy as-is |
| `showShareToast(message)` | Spec section note | Reuse undo toast pattern — see note below |

**Android back button handler** — add the `popstate` listener specified in the spec. If the app already has a `popstate` handler, add the overlay close check inside it. Otherwise add the handler from the spec.

---

### Step 3a — Corrections to spec functions

**`renderDetailConditions(walkId)` — remove `clear` tag**

The spec's `TAG_LABELS` and `TAG_ICONS` local objects include the `clear` key ("Excellent conditions" / "sun"). This tag was removed in FIX 10.3. Remove it from both objects:

```js
// Remove these two entries:
//   clear:'Excellent conditions'    ← from TAG_LABELS
//   clear:'sun'                     ← from TAG_ICONS
```

The `clear` key will never appear in new tag submissions, but may exist in old localStorage data. Because it has no matching entry in `CONDITION_TAGS` (removed in FIX 10.3), `getDisplayTags()` will already filter it out. Removing it from the local objects in `renderDetailConditions` is belt-and-braces hygiene.

**`populateWalkDetail(walk)` — mark-as-walked button**

The spec sets `walkedBtn.onclick` only when the walk is not yet walked. In the confirmed state, the button should be re-tappable (toggle off, per FIX 10.2). Update the walked button setup block:

```js
// Replace the spec's walked button onclick setup with:
walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
// (Remove the conditional — onMarkWalked() already handles the toggle-off case)
```

**`toggleOlderReports(walkId)` — add this function (not in spec JS section)**

This is called by the `cond-older-toggle` button rendered in `renderDetailConditions` but not defined in the spec. Add it:

```js
function toggleOlderReports(walkId) {
  var rows  = document.getElementById('cond-older-rows-' + walkId);
  var arrow = document.getElementById('cond-older-arrow-' + walkId);
  if (!rows) return;
  var open = rows.style.display !== 'none';
  rows.style.display  = open ? 'none' : '';
  if (arrow) arrow.textContent = open ? '↓' : '↑';
}
```

**`showShareToast(message)` — reuse undo toast pattern**

The app already has `.undo-toast` CSS and the `showUndoToast()` JS from FIX 10.2. `showShareToast` is a simpler variant — no undo button, 2-second auto-dismiss. Add:

```js
function showShareToast(message) {
  var existing = document.getElementById('undo-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'undo-toast';
  toast.id = 'undo-toast';
  toast.innerHTML = '<i data-lucide="check" style="width:14px;height:14px;flex-shrink:0"></i> ' + message;
  document.body.appendChild(toast);
  syncIcons();
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2000);
}
```

---

### Step 4 — Update `onWalkTap(id)`

Add `openWalkDetail(id)` at the end of the existing function, as shown in the spec. The explore tracking and `updateMeStats()` calls are already there — only the `openWalkDetail(id)` call is new:

```js
function onWalkTap(id) {
  // ... existing explore tracking and updateMeStats() ...
  openWalkDetail(id); // ← ADD THIS LINE
}
```

---

### Step 5 — Verify

Open the app, set a location (State B). Then:

1. **Open overlay:** Tap any walk card (carousel trail card, portrait card, or Me tab favourite). Overlay should slide up over the full screen including the bottom nav.
2. **Header:** Walk name truncated, back button (←) and share button visible.
3. **Hero:** Image loads if `imageUrl` present; brand-green background if not. Badge shows if `walk.badge` is set. Heart reflects current favourite state.
4. **Info block:** Name, location (with pin icon), rating (only if `reviewCount > 0`), stats row (distance / duration / difficulty).
5. **Quick tags:** Correct tags for the walk's schema. Off-lead, difficulty, terrain, environment all present. Conditional tags (enclosed, livestock, stiles, parking) only show when true.
6. **Tag variants:** Off-lead "full" = green, livestock = amber, difficulty "hard" = amber, everything else = neutral grey.
7. **Description:** Full text, no truncation.
8. **Conditions:** Walk with no tags → empty state ("Be the first to report conditions on this walk."). Walk with tags → tag rows with "reported X ago" timestamp. Stale tags → dimmed with amber "May be out of date". Hazard tags → amber label.
9. **Mark as walked:** 44px full-width button. Tap → confirmed state immediately, undo toast appears. Tap confirmed button → toggles off (FIX 10.2 behaviour).
10. **Post-walk prompt:** If not already tagged today and not dismissed this session, the condition tag sheet opens after marking walked.
11. **Map:** Leaflet map loads 320ms after overlay opens. Centred at walk coords, zoom 14. Single marker. "Open in Google Maps →" link navigates correctly.
12. **Close:** Back button slides overlay down. Map destroyed. Scroll position resets. Opening a different walk populates correctly.
13. **Android back:** Hardware back button closes overlay (not the page).
14. **Dark mode:** All sections render correctly with dark tokens. Detail-tag--positive uses sage tint (not neon mint).
15. **Share:** Tapping share button triggers native share sheet (or clipboard fallback with toast).

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| Prereq | Condition detail CSS — `.cond-detail-row`, `.cond-empty`, `.cond-older-toggle` (deferred from Round 8, not yet in build) | Trivial |
| FIX 12.1 | Walk detail overlay — HTML, CSS, 10 JS functions, `onWalkTap` update | Medium |

**Dependencies confirmed in build:** `WALKS_DB`, `heartSVG()`, `toggleFavourite()`, `isFavourited()`, `onMarkWalked()`, `openCondTagSheet()`, `getDisplayTags()`, `relativeTime()`, `luIcon()`, `syncIcons()`, `offLeadLabel()`, `difficultyLabel()`, Leaflet CDN, undo toast CSS.

**Not yet in build — add in this round:** `isWalked()`, `toggleOlderReports()`, `showShareToast()`, condition detail CSS (§4), overlay HTML and CSS.
