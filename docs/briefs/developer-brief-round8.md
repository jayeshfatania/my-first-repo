# Developer Brief — Round 8

*Issued by: Product Owner*
*Date: March 2026*
*Based on: condition-tags-design-spec.md, phase2-team-brief.md*
*File: sniffout-v2.html only*

---

## Context

This is the first Phase 2 feature build. The condition tags + mark as walked system is a linked pair of features: a tap action that marks a walk as done (mark as walked) triggers a post-walk prompt where the user can optionally submit pre-defined condition tags. Tags are stored locally and displayed on walk cards for all users.

**Build scope for this session:** carousel cards on the Walks tab only. The walk detail overlay does not yet exist — do not implement the walk detail panel version of these features (Parts 4, 4E of the design spec). Those will be added when the walk detail overlay is designed and built. Everything else in the spec is in scope.

The design spec (condition-tags-design-spec.md) is highly detailed — read it in full before starting. This brief follows the spec exactly except where corrections are noted below.

---

## PO Corrections — Read First

**Correction 1 — Bug in `getDisplayTags()` (§Part 6 of spec)**

The spec's `ageText` logic has an error. The condition `stale && age > STALE_LIMIT` fails to return "May be out of date" for hazard tags aged 7–14 days: those tags have `stale = true` but `age > STALE_LIMIT` is false, so `relativeTime()` is returned instead.

**Replace this line in `getDisplayTags()`:**

```js
// SPEC (incorrect):
ageText: stale && age > STALE_LIMIT ? 'May be out of date' : relativeTime(t.ts)

// CORRECT:
ageText: stale ? 'May be out of date' : relativeTime(t.ts)
```

The rest of `getDisplayTags()` is correct as specified.

**Correction 2 — Lucide icon availability**

The spec notes that `cow` and `sheep` may not be available in the current Lucide build. Check at build time. If either is absent, use `triangle-alert` as the fallback for both `cattle` and `sheep` tags — these are Hazard category, and `triangle-alert` correctly communicates urgency.

---

## FIX 9.1 — Data Model and Helper Functions

Add the following to the `<script>` block, near the top of the function definitions (before the render functions).

### Tag taxonomy constant

```js
var CONDITION_TAGS = [
  { key: 'cattle',   label: 'Cattle in field',       icon: 'cow',            cat: 'Hazard'   },
  { key: 'sheep',    label: 'Sheep in field',         icon: 'sheep',          cat: 'Hazard'   },
  { key: 'leads',    label: 'Dogs on leads here',     icon: 'dog',            cat: 'Hazard'   },
  { key: 'access',   label: 'Access issue',           icon: 'triangle-alert', cat: 'Hazard'   },
  { key: 'muddy',    label: 'Very muddy underfoot',   icon: 'footprints',     cat: 'Surface'  },
  { key: 'flooded',  label: 'Flooded section',        icon: 'waves',          cat: 'Surface'  },
  { key: 'overgrown',label: 'Overgrown path',         icon: 'leaf',           cat: 'Surface'  },
  { key: 'icy',      label: 'Icy / slippery',         icon: 'snowflake',      cat: 'Surface'  },
  { key: 'water',    label: 'Great water point',      icon: 'droplets',       cat: 'Positive' },
  { key: 'cafe',     label: 'Dog-friendly café open', icon: 'coffee',         cat: 'Positive' },
  { key: 'clear',    label: 'Excellent conditions',   icon: 'sun',            cat: 'Positive' },
  { key: 'busy',     label: 'Busy / crowded',         icon: 'users',          cat: 'Footfall' },
  { key: 'quiet',    label: 'Quiet today',            icon: 'volume-x',       cat: 'Footfall' }
];

var HAZARD_KEYS = ['cattle', 'sheep', 'leads', 'access'];
```

### localStorage helpers

```js
function getConditionTags() {
  return JSON.parse(localStorage.getItem('sniffout_condition_tags')) || {};
}

function saveConditionTags(data) {
  localStorage.setItem('sniffout_condition_tags', JSON.stringify(data));
}

function getWalkedIds() {
  return JSON.parse(localStorage.getItem('sniffout_walked')) || [];
}

function markWalked(walkId) {
  var ids = getWalkedIds();
  if (ids.indexOf(walkId) === -1) {
    ids.push(walkId);
    localStorage.setItem('sniffout_walked', JSON.stringify(ids));
  }
}

function hasWalked(walkId) {
  return getWalkedIds().indexOf(walkId) > -1;
}
```

### Rate limit check (24h per device per walk)

```js
function getDeviceId() {
  return btoa(navigator.userAgent + screen.width + screen.height);
}

function hasSubmittedToday(walkId) {
  var all  = getConditionTags();
  var tags = (all[walkId] || []);
  var cutoff = Date.now() - 86400000; // 24h
  var deviceId = getDeviceId();
  return tags.some(function(t) {
    return t.device === deviceId && t.ts > cutoff;
  });
}
```

### Session-scoped dismissal tracker

```js
var promptDismissedThisSession = {};
```

Declare this at the top level (outside any function), alongside the other global state variables.

### `relativeTime()` helper (from spec §5 — exact as specified)

```js
function relativeTime(ts) {
  var diff  = Date.now() - ts;
  var mins  = Math.floor(diff / 60000);
  var hours = Math.floor(diff / 3600000);
  var days  = Math.floor(diff / 86400000);
  var weeks = Math.floor(diff / 604800000);
  if (mins < 5)   return 'Just now';
  if (mins < 60)  return mins + ' min ago';
  if (hours < 24) return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
  if (days < 30)  return days + ' day' + (days > 1 ? 's' : '') + ' ago';
  if (weeks < 8)  return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
  return Math.floor(days / 30) + ' months ago';
}
```

### `getDisplayTags()` helper (from spec §6 — with PO correction applied)

```js
function getDisplayTags(walkId) {
  var allTags    = (getConditionTags()[walkId] || []);
  var now        = Date.now();
  var HAZARD_STALE = 7  * 24 * 3600000;
  var STALE_LIMIT  = 14 * 24 * 3600000;
  var HIDE_LIMIT   = 30 * 24 * 3600000;

  return allTags
    .filter(function(t) { return (now - t.ts) < HIDE_LIMIT; })
    .map(function(t) {
      var age      = now - t.ts;
      var isHazard = HAZARD_KEYS.indexOf(t.tag) > -1;
      var stale    = isHazard ? age > HAZARD_STALE : age > STALE_LIMIT;
      return {
        tag:      t.tag,
        ts:       t.ts,
        isHazard: isHazard,
        stale:    stale,
        ageText:  stale ? 'May be out of date' : relativeTime(t.ts)  // PO correction
      };
    })
    .sort(function(a, b) {
      if (a.isHazard && !b.isHazard) return -1;
      if (!a.isHazard && b.isHazard) return 1;
      return a.ts - b.ts;
    })
    .reverse();
}

function getOlderTags(walkId) {
  var allTags  = (getConditionTags()[walkId] || []);
  var now      = Date.now();
  var HIDE_LIMIT = 30 * 24 * 3600000;
  return allTags
    .filter(function(t) { return (now - t.ts) >= HIDE_LIMIT; })
    .sort(function(a, b) { return b.ts - a.ts; });
}
```

### `saveTagsForWalk()` — submitting tags from the prompt

```js
function saveTagsForWalk(walkId, selectedKeys) {
  var all  = getConditionTags();
  var existing = all[walkId] || [];
  var deviceId = getDeviceId();
  var now  = Date.now();
  selectedKeys.forEach(function(key) {
    existing.push({ tag: key, ts: now, device: deviceId });
  });
  all[walkId] = existing;
  saveConditionTags(all);
}
```

---

## FIX 9.2 — Mark as Walked Button on Trail Carousel Cards

### CSS

Add to the `<style>` block, after the existing `.trail-card` rules:

```css
/* Mark as walked button */
.walked-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 34px;
  margin-top: 8px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
}
.walked-btn.confirmed {
  background: rgba(30,77,58,0.08);
  border-color: rgba(30,77,58,0.15);
  color: var(--brand);
  pointer-events: none;
}
body.night .walked-btn {
  border-color: rgba(110,231,183,0.2);
}
body.night .walked-btn.confirmed {
  background: rgba(110,231,183,0.1);
  border-color: rgba(110,231,183,0.2);
  color: var(--brand);
}
```

### HTML (inside `renderTrailCard()`)

At the end of `.trail-card-body`, after the `.trail-card-desc` div, append the walked button:

```js
var walkedClass = hasWalked(walk.id) ? ' confirmed' : '';
var walkedLabel = hasWalked(walk.id) ? 'Walked' : 'Mark as walked';

// Inside the card body HTML string:
'<button class="walked-btn' + walkedClass + '" data-walk-id="' + escHtml(walk.id) + '" onclick="onMarkWalked(event, \'' + escHtml(walk.id) + '\')">' +
  luIcon('check', 13) +
  '<span>' + walkedLabel + '</span>' +
'</button>'
```

### `onMarkWalked()` function

```js
function onMarkWalked(event, walkId) {
  event.stopPropagation();

  // Transition button to confirmed state immediately
  var btn = event.currentTarget;
  btn.classList.add('confirmed');
  var span = btn.querySelector('span');
  if (span) span.textContent = 'Walked';

  // Persist
  markWalked(walkId);

  // Show post-walk prompt unless already submitted today or dismissed this session
  if (!hasSubmittedToday(walkId) && !promptDismissedThisSession[walkId]) {
    openCondTagSheet(walkId);
  }
}
```

---

## FIX 9.3 — Post-Walk Prompt (Condition Tag Bottom Sheet)

### HTML

Add the following to the `<body>`, alongside the existing filter sheet HTML:

```html
<!-- Condition tag sheet -->
<div class="filter-backdrop" id="cond-tag-backdrop" onclick="closeCondTagSheet()"></div>
<div class="filter-sheet" id="cond-tag-sheet">
  <div class="sheet-handle"></div>
  <div id="cond-tag-sheet-inner" style="overflow-y:auto; max-height:calc(65vh - 60px); padding: 0 0 8px;"></div>
  <div style="display:flex; gap:12px; padding:12px 16px 16px; border-top:1px solid var(--border);">
    <button class="sheet-btn-ghost" id="cond-tag-skip" onclick="closeCondTagSheet()">Skip</button>
    <button class="sheet-btn-primary" id="cond-tag-done" onclick="submitCondTags()">Done</button>
  </div>
</div>
```

### CSS additions

```css
/* Ghost button — Skip */
.sheet-btn-ghost {
  flex: 1;
  height: 44px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
}

/* Condition sheet section label */
.cond-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 16px 8px;
  display: block;
}

/* Tag option row in prompt */
.cond-tag-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% - 32px);
  height: 44px;
  margin: 0 16px 8px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
}
.cond-tag-option.selected {
  background: rgba(30,77,58,0.08);
  border-color: rgba(30,77,58,0.25);
  color: var(--brand);
  font-weight: 500;
}
body.night .cond-tag-option.selected {
  background: rgba(110,231,183,0.1);
  border-color: rgba(110,231,183,0.2);
  color: var(--brand);
}
.cond-tag-option .cond-option-icon {
  color: var(--ink-2);
  flex-shrink: 0;
}
.cond-tag-option.selected .cond-option-icon {
  color: var(--brand);
}
.cond-tag-option .cond-option-check {
  margin-left: auto;
  color: var(--brand);
  flex-shrink: 0;
}
```

### Sheet open/close/render functions

```js
var _condTagWalkId = null;

function openCondTagSheet(walkId) {
  _condTagWalkId = walkId;
  renderCondTagSheet();
  document.getElementById('cond-tag-backdrop').classList.add('open');
  document.getElementById('cond-tag-sheet').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCondTagSheet() {
  if (_condTagWalkId) {
    promptDismissedThisSession[_condTagWalkId] = true;
  }
  _condTagWalkId = null;
  document.getElementById('cond-tag-backdrop').classList.remove('open');
  document.getElementById('cond-tag-sheet').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCondTagSheet() {
  var categories = ['Hazard', 'Surface', 'Positive', 'Footfall'];
  var html = '<div style="padding:16px 16px 4px;">' +
    '<div style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px;">How were the conditions?</div>' +
    '<div style="font-size:13px;color:var(--ink-2);">Tap all that apply</div>' +
    '</div>';

  categories.forEach(function(cat) {
    var tagsInCat = CONDITION_TAGS.filter(function(t) { return t.cat === cat; });
    html += '<span class="cond-section-label">' + cat + '</span>';
    tagsInCat.forEach(function(t) {
      html += '<button class="cond-tag-option" data-tag="' + t.key + '" onclick="toggleCondTag(this)">' +
        '<span class="cond-option-icon">' + luIcon(t.icon, 18) + '</span>' +
        '<span>' + t.label + '</span>' +
      '</button>';
    });
  });

  document.getElementById('cond-tag-sheet-inner').innerHTML = html;
  updateCondDoneBtn();
}

function toggleCondTag(btn) {
  btn.classList.toggle('selected');
  var check = btn.querySelector('.cond-option-check');
  if (btn.classList.contains('selected')) {
    if (!check) {
      var c = document.createElement('span');
      c.className = 'cond-option-check';
      c.innerHTML = luIcon('check', 14);
      btn.appendChild(c);
    }
  } else {
    if (check) check.remove();
  }
  updateCondDoneBtn();
}

function updateCondDoneBtn() {
  var selected = document.querySelectorAll('#cond-tag-sheet-inner .cond-tag-option.selected');
  var n = selected.length;
  var doneBtn = document.getElementById('cond-tag-done');
  doneBtn.textContent = n > 0 ? 'Done \u00b7 ' + n + ' reported' : 'Done';
}

function submitCondTags() {
  if (!_condTagWalkId) { closeCondTagSheet(); return; }
  var selected = document.querySelectorAll('#cond-tag-sheet-inner .cond-tag-option.selected');
  var keys = [];
  selected.forEach(function(btn) { keys.push(btn.getAttribute('data-tag')); });

  // Save even if keys is empty — still sets the 24h rate limit via device fingerprint
  // Only write a record if there are actual tags to store
  if (keys.length > 0) {
    saveTagsForWalk(_condTagWalkId, keys);
    rerenderCondTagRow(_condTagWalkId);
  }

  closeCondTagSheet();
}
```

**Note on "Done" with zero tags:** If the user taps Done with nothing selected, close the sheet without saving any tag records. The `promptDismissedThisSession` flag set in `closeCondTagSheet()` prevents re-prompting this session, but the 24h rate limit is NOT set (no device record written) — meaning the prompt will reappear tomorrow if the user marks the same walk again. This is intentional: a "Done with no tags" is a skip, not a positive confirmation. If the intent is to hard-gate re-prompting for 24h even on zero-tag Done, add an explicit empty record at submit time — but the current spec does not require this.

---

## FIX 9.4 — Condition Tag Row on Trail Carousel Cards

### CSS

Add to `<style>` block after `.walked-btn` rules:

```css
/* Condition tag row on carousel card */
.cond-tag-row {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow: hidden;
  margin-top: 4px;
}
.cond-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2px 7px;
  white-space: nowrap;
}
.cond-chip--hazard {
  color: var(--amber);
  border-color: rgba(217,119,6,0.25);
  background: rgba(217,119,6,0.06);
}
.cond-chip--stale {
  opacity: 0.55;
}
.cond-chip-more {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-2);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2px 7px;
  white-space: nowrap;
}
.cond-disclaimer {
  font-size: 10px;
  color: var(--ink-2);
  margin-top: 2px;
  font-weight: 400;
}
```

### `renderCondTagRow()` — builds the tag row HTML for a walk

```js
function renderCondTagRow(walkId) {
  var tags = getDisplayTags(walkId);
  if (tags.length === 0) return '';

  var tagDef = {};
  CONDITION_TAGS.forEach(function(t) { tagDef[t.key] = t; });

  var html = '<div class="cond-tag-row">';
  var shown = tags.slice(0, 2);
  var extra = tags.length - shown.length;

  shown.forEach(function(t) {
    var def = tagDef[t.tag];
    if (!def) return;
    var classes = 'cond-chip' +
      (t.isHazard ? ' cond-chip--hazard' : '') +
      (t.stale    ? ' cond-chip--stale'  : '');
    html += '<span class="' + classes + '">' +
      luIcon(def.icon, 11) +
      escHtml(def.label) +
    '</span>';
  });

  if (extra > 0) {
    html += '<span class="cond-chip-more">+' + extra + ' more</span>';
  }

  html += '</div>';
  html += '<div class="cond-disclaimer">Community reported</div>';
  return html;
}
```

### Update `renderTrailCard()` to include the tag row

Inside `renderTrailCard()`, the `.trail-card-body` order must be:

```
.trail-card-name
.trail-card-rating      (if reviewCount > 0)
.trail-card-meta
.trail-card-tags        (existing schema tags)
[renderCondTagRow(walk.id)]    ← NEW: insert here
.trail-card-desc
[walked-btn]            ← NEW: already added in FIX 9.2
```

### `rerenderCondTagRow()` — called after tags are submitted

After the post-walk prompt is submitted, update the condition tag row on the visible card without a full re-render:

```js
function rerenderCondTagRow(walkId) {
  // Find all walked-btn elements for this walkId on screen and update their parent card's tag row
  var btns = document.querySelectorAll('[data-walk-id="' + walkId + '"]');
  btns.forEach(function(btn) {
    var card = btn.closest('.trail-card-body');
    if (!card) return;
    var existing = card.querySelector('.cond-tag-row');
    var disclaimer = card.querySelector('.cond-disclaimer');
    var newHtml = renderCondTagRow(walkId);

    if (existing) existing.remove();
    if (disclaimer) disclaimer.remove();

    // Insert before .trail-card-desc
    var desc = card.querySelector('.trail-card-desc');
    if (desc && newHtml) {
      desc.insertAdjacentHTML('beforebegin', newHtml);
    }
  });
}
```

---

## Walk Detail Panel — Deferred

Parts 4, 4B–4E of the design spec (condition tags section in walk detail, "Mark as walked" button at 44px, `getOlderTags()` display, `toggleOlderReports()`) are **not in scope for this session**. The walk detail overlay does not yet exist. These will be implemented in a future developer session once the walk detail overlay is designed and built.

The `getOlderTags()` helper (defined above in FIX 9.1) can still be added now so it's ready.

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| FIX 9.1 | Data model: `CONDITION_TAGS`, `HAZARD_KEYS`, localStorage helpers, `getDeviceId()`, rate limit check, `relativeTime()`, `getDisplayTags()` (with PO correction), `getOlderTags()`, `saveTagsForWalk()`, `promptDismissedThisSession` | Medium |
| FIX 9.2 | Mark as walked button on trail carousel cards — HTML in `renderTrailCard()`, CSS, `onMarkWalked()` | Low |
| FIX 9.3 | Post-walk prompt bottom sheet — HTML, CSS, `openCondTagSheet()`, `closeCondTagSheet()`, `renderCondTagSheet()`, `toggleCondTag()`, `submitCondTags()` | Medium |
| FIX 9.4 | Condition tag row on carousel cards — CSS, `renderCondTagRow()`, update to `renderTrailCard()`, `rerenderCondTagRow()` | Low |

**Not in scope:** Walk detail panel condition tags section, walk detail walked button (44px). Deferred to walk detail overlay build session.

---

## Notes for Developer

- Reuse the existing `filter-sheet`, `filter-backdrop`, and `.open` class pattern for the condition tag sheet — the CSS transitions are already implemented
- The `luIcon()` helper is already in the codebase — use it throughout for all tag icons
- `escHtml()` is already defined — use it on all user-facing strings constructed from data
- Check Lucide build for `cow` and `sheep` — fallback to `triangle-alert` if absent (see spec note)
- The `sheet-btn-primary` class already exists from the filter sheet — reuse for the Done button
- `promptDismissedThisSession` must be declared at the top level alongside other global state, not inside a function
