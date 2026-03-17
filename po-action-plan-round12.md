# Sniffout — Product Owner Action Plan: Round 12
*Issued by: Product Owner*
*Date: March 2026*
*Inputs: ux-review-round11.md (Designer); research-report-community-gamification.md (Researcher)*

---

## Context

Round 11 shipped (walk detail overlay, Yr.no icons, trail card declutter). Real-device testing by the owner surfaced four UX issues. The Designer has diagnosed and spec'd all four. In parallel, the Researcher has completed a community and gamification study. This document produces PO decisions on both and defines the exact Round 12 scope for the Developer.

---

## PART 1 — UX Fixes: PO Decisions

### Issue 1 — Back Button / Swipe-Down Dismiss

**Designer recommendation:** Swipe-down gesture on the overlay when `scrollTop === 0`; drag handle visual affordance; keep top-left back button.

**PO decision: ✅ Approved in full.**

The gesture is the correct native pattern for a bottom-up overlay — users expect it, especially on iOS. The drag handle is essential for discoverability: without it the gesture is invisible. Keeping the back button is non-negotiable for accessibility and Android affordance parity.

The "no bottom close button" rationale is correct. That would sacrifice content viewport for every user, every visit.

**Scope: Round 12.** Estimated 30–45 min. Lowest-effort fix in this round.

**Developer note:** `initWalkDetailSwipe()` must be called once after the overlay HTML is in the DOM. The scroll container queried in the gesture handler (`walk-detail-scroll`) must match the actual ID in the overlay HTML from FIX 12.1. Verify this before implementing.

---

### Issue 2 — Conditions Prompt Not Appearing

**Designer recommendation:** Raise `#cond-tag-sheet` and `#cond-tag-backdrop` to z-index 401/400; replace session-level dismissal (`promptDismissedThisSession`) with `hasSubmittedTagsToday()` 24-hour check; add "Add or update conditions →" manual re-trigger link below the walked button.

**PO decision: ✅ Approved in full.**

The z-index bug is critical — it has meant zero users could submit conditions from the detail overlay since Round 11 shipped. Fix 1 is mandatory and ships immediately.

The 24-hour re-trigger is the right calibration. Session-level suppression was too aggressive: a user who taps Skip on the prompt (common, especially on first encounter with a new UI element) is permanently locked out for the session. That is wrong. The correct gate is whether tags were *actually submitted* today, not whether the sheet was dismissed.

The "Add or update conditions" link is the right secondary pattern. It covers users who actively want to contribute more, not just first-time loggers. This requires `isWalked(walkId)` to be in the build — see dependency note below.

**Scope: Round 12.** Estimated 20–30 min for Fixes 1 and 2. Fix 3 (the link element in `populateWalkDetail()`) ships alongside Issue 4's data model in the same round.

**Developer constraint — dependency on Issue 4:** `isWalked()` and `isWalkedToday()` are referenced by the Issue 2 manual link. These functions are redefined in Issue 4's data model change (reading from `sniffout_walk_log`). Because Issue 4's core data model ships in Round 12, implement Issue 4 data model first (steps 1–2 of the recommended implementation order), then implement Issue 2 Fix 3. Both are in Round 12 — the sequencing matters within the round.

---

### Issue 3 — Contradictory Condition Tags

**Designer recommendation:** `COND_CONFLICTS` lookup map; hard mutual exclusion (radio pair) for `busy`/`quiet`; soft auto-deselect for `clear` ↔ `muddy`, `flooded`, `overgrown`, `icy`.

**PO decision: ✅ Partially approved — `busy`/`quiet` only. `clear` rules are redundant.**

The `busy` ↔ `quiet` hard mutual exclusion is approved and ships in Round 12. These are genuine direct contradictions on the same dimension.

**However:** The `clear` (Excellent conditions) tag was removed from `CONDITION_TAGS` in FIX 10.3 (Round 9). It does not exist in the tag sheet. The Designer's soft mutual exclusion rules for `clear` ↔ surface hazards are therefore already resolved by the tag's non-existence — there is no `clear` chip to conflict with. The Designer appears to have worked from a pre-FIX-10.3 taxonomy.

The `COND_CONFLICTS` map the Developer implements should contain only:
```js
var COND_CONFLICTS = {
  busy:  ['quiet'],
  quiet: ['busy']
};
```

The `clear`, `muddy`, `flooded`, `overgrown`, `icy` entries from the Designer's spec must **not** be added — `clear` does not exist in the current build and adding entries for a removed tag would be dead code at best and a future source of confusion at worst.

All other tag pairs (hazard vs hazard, `muddy`/`icy` co-existence, positive vs hazard cross-category) are confirmed correctly analysed by the Designer: no further enforcement needed.

**Scope: Round 12.** Estimated 15–20 min with the reduced scope above.

---

### Issue 4 — Walk Logging and Repeat Walks

**Designer recommendation:** Replace `sniffout_walked` (flat ID array) with `sniffout_walk_log` (timestamped entries); three-state button (never walked / walked today / walked before not today); Me tab walk history section; gamification helper functions (`getCurrentStreak`, `getLongestStreak`, `getTotalDistanceMi`, `getEarnedBadges`).

**PO decision: ✅ Staged. Core data model + button ship in Round 12. Me tab redesign + gamification display defer to Round 13.**

The data model change is foundational and cannot wait. The binary `sniffout_walked` array with no timestamps is structurally wrong for a walking log — it creates the dead-end UX the owner experienced (return visits offer no action). The migration, helper functions, and three-state button resolve this directly.

The Me tab history section (`renderWalkLogSection()`), the "See all walks" sheet, and the gamification helper functions are meaningful UI work that deserves a proper round. They are not UX fixes — they are new features. Deferring them prevents Round 12 from ballooning to 4–5 hours. The data will be there when Round 13 implements the display.

**What ships in Round 12 (core only):**
1. `getWalkLog()`, `logWalk()` — data access and write
2. One-time migration from `sniffout_walked` → `sniffout_walk_log` (entries back-dated one week)
3. `isWalked(id)`, `isWalkedToday(id)`, `getWalkLogCount(id)`, `getLastWalkDate(id)` — helper functions
4. `hasSubmittedTagsToday(walkId)` — required by Issue 2
5. Three-state button logic in `populateWalkDetail()`
6. Updated `onMarkWalked()` — calls `logWalk()`, shows "Add or update conditions" link
7. `updateMeStats()` — update `stat-walked` to show `log.length` (label change to "Walks logged")

**What defers to Round 13:**
- `renderWalkLogSection()` — walk history rows in Me tab
- "See all walks →" bottom sheet
- `logDateLabel()` helper (used only by the history section)
- `getCurrentStreak()`, `getLongestStreak()`, `getTotalDistanceMi()`, `getEarnedBadges()` — gamification helpers
- Badge display UI in Me tab
- Updated Me tab stats row layout

**Developer note on undo toast:** The existing `showUndoToast()` / `onUnmarkWalked()` pattern from FIX 10.2 conflicts with the new three-state model. In the new model, "Walked today" (State 2) is non-interactive — there is no undo action, because the walk can be re-logged on the next calendar day and the log is additive. Remove the undo toast trigger from `onMarkWalked()` when implementing Issue 4. The undo pattern was designed for the binary toggle; it has no equivalent in a timestamped log.

**Streak note (from Researcher):** `getCurrentStreak()` is included in the Round 13 deferred scope but should **not be surfaced prominently** in the Me tab. The research finding is explicit: Strava does not use streaks; dog walking is already a daily habit; streaks create anxiety without adding value. The function can exist for internal calculation, but the primary gamification display should be milestone badges and total-log stats. Do not add a streak counter to the Me tab header or stats row.

---

## PART 2 — Community and Gamification Direction

### Key Research Findings

**Strongly confirmed — current direction is correct:**

1. **The Sniffout architecture is differentiated.** PlayDogs UK is empty. Sniffout has 50+ curated walks before the first user submits anything. This is the cold-start moat. Protect it.

2. **Walk Highlands is the closest structural analogue.** Editorial walk guides with a community review layer on top. Desktop-era, no app. A mobile-first PWA with the same model is a genuine category improvement. The gap is real and current.

3. **The curated-foundation + community-layer model is proven.** AllTrails began as a National Geographic co-branded curated database, then opened to community. Komoot uses editorial collections with community Highlights on top. The model works.

4. **For ratings with low review counts:** show a minimum threshold before displaying stars (e.g. 3+ reviews). Below threshold: "Be the first to review." This is already aligned with Decision 19 (seeded ratings as-is for POC). Confirmed as Phase 3 direction.

**Findings that challenge assumptions:**

5. **Do not use streaks.** This is the strongest challenge in the report. Strava explicitly avoids streaks because outdoor sport is seasonal, weather-dependent, and injury-prone. Dog walking is an already-habitual daily behaviour — streaks would add anxiety and guilt to something that is already happening. The Designer's gamification groundwork includes `getCurrentStreak()` — this function can exist internally but must not be the primary UI signal. **Milestone badges are the right mechanic** (1 walk, 5 walks, 10 walks, "Regular" for 3 visits to same walk, "Explorer" for 3+ regions). These celebrate what the user is already doing without prescribing frequency.

6. **Weather + walk history is a compelling re-engagement hook.** The Researcher notes that "the same walk feels different in different weather" and that showing "you last walked this on [date]" would be compelling. The timestamped walk log we're building in Round 12 creates the data foundation for this. It is a Phase 3 display feature — worth flagging now so the schema decisions are right.

7. **AllTrails' quality trap is avoidable.** Community-submitted walks appearing without clear differentiation from curated ones erodes trust. The `badge` field (`"Sniffout Pick"`) already provides the signal. When community submissions open, continue to use this badge for curated walks and leave community-submitted walks unbadged (or "Community" badge). Never mix the quality signals.

8. **TikTok dog content is a direct growth lever available now.** The Researcher's finding that dog-specific walk content dramatically outperforms generic walk content in engagement rate is specific and actionable. "Come walk with me" POV format, consistent niche cadence (3×/week), dogs as the recurring protagonist. This is an owner action outside the app — no dev work required.

---

### Phased Recommendation

#### Phase 2 — Now (no backend required, localStorage only)

| Feature | Approach | Round |
|---------|----------|-------|
| Timestamped walk log | `sniffout_walk_log` array, `logWalk()`, migration | Round 12 |
| Three-state walked button | Never / Today / Again | Round 12 |
| Walk log stats ("Walks logged") | `stat-walked` count in Me tab | Round 12 |
| "Add or update conditions" link | Manual re-trigger in detail overlay | Round 12 |
| Walk history in Me tab | `renderWalkLogSection()`, 5 most recent | Round 13 |
| Milestone badges (1, 5, 10, 25 walks; Regular; Explorer) | `getEarnedBadges()`, displayed in Me tab | Round 13 |
| Total distance stat | `getTotalDistanceMi()` in Me tab | Round 13 |
| "Last visited" on walk detail | Show last log date in detail overlay info block | Round 13 or 14 |
| Editorial lists as static HTML | "10 best dog walks near London" pages at sniffout.app | Owner action, no dev |

#### Phase 3 — Firebase required

| Feature | Notes |
|---------|-------|
| User accounts | Display name + email minimum; contextual intro only (existing Decision 17) |
| Walk log sync | Local `sniffout_walk_log` entries seed user profile on account creation |
| Community walk submissions | Reviewed-before-publish editorial sign-off; same `WALKS_DB` schema; curated-vs-community badge |
| Reputation-weighted community reviews | High-reputation users get more weight |
| Bayesian ratings | Min 3 reviews before displaying; formula: `(v/(v+3)) × R + (3/(v+3)) × C` |
| Local Legend frequency tracking | "You've visited [Walk Name] most in the last 3 months" — needs server-side |
| Community condition photos | Photo attachment to condition reports |
| Community challenges | Monthly/seasonal; e.g., "Walk 5 routes this autumn" |

#### Phase 4+ — Editorial resource required

| Feature | Notes |
|---------|-------|
| SEO-optimised trail pages | Each walk as a standalone page; structured data for Google rich results |
| Seasonal editorial guides | "Best autumn walks in [region]" articles, blog |
| Walk Highlights (Komoot model) | User-contributed POI tips on specific walks |
| "Year in Walks" retrospective | Annual shareable summary |
| Brand/tourism partnerships | VisitBritain Komoot Collections model |
| Shareable walk summaries | Social-ready post-walk card |

---

## PART 3 — Round 12 Developer Brief Scope

### Summary

Round 12 ships four fixes from the UX review. Issues 1–3 are quick wins. Issue 4 is staged — the data model and button ship now; the Me tab UI redesign defers to Round 13.

**Total estimated effort: 2.5–3.5 hours.**

---

### FIX 13.1 — Swipe-to-Dismiss Overlay

*(Based on ux-review-round11.md Issue 1)*

**Step 1 — Add drag handle CSS**

In the `<style>` block, add to the walk detail overlay CSS section:

```css
.walk-detail-drag-handle {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  cursor: grab;
}
.walk-detail-drag-handle::after {
  content: '';
  display: block;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
}
```

**Step 2 — Add drag handle HTML**

In the walk detail overlay HTML, add `.walk-detail-drag-handle` as the **first child** of `#walk-detail-overlay`, before `.walk-detail-header`:

```html
<div class="walk-detail-drag-handle"></div>
```

**Step 3 — Add `initWalkDetailSwipe()` function**

```js
function initWalkDetailSwipe() {
  var overlay  = document.getElementById('walk-detail-overlay');
  var scroll   = document.getElementById('walk-detail-scroll');
  if (!overlay || !scroll) return;

  var startY     = 0;
  var isDragging = false;

  overlay.addEventListener('touchstart', function(e) {
    if (scroll.scrollTop > 0) return;
    startY     = e.touches[0].clientY;
    isDragging = true;
    overlay.style.transition = 'none';
  }, { passive: true });

  overlay.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    if (scroll.scrollTop > 0) { isDragging = false; return; }
    var deltaY = e.touches[0].clientY - startY;
    if (deltaY < 0) { isDragging = false; return; }
    overlay.style.transform = 'translateY(' + deltaY + 'px)';
  }, { passive: true });

  overlay.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    var deltaY = e.changedTouches[0].clientY - startY;
    overlay.style.transition = '';
    if (deltaY > 150) {
      closeWalkDetail();
    } else {
      overlay.style.transform = 'translateY(0)';
    }
  });
}
```

**Step 4 — Call `initWalkDetailSwipe()`**

Call once after the overlay HTML is in the DOM — at the end of the script block alongside other init calls. **Verify the scroll container ID** (`walk-detail-scroll`) matches the actual scrollable content container in the overlay HTML from FIX 12.1. Correct if different.

**Verify:**
- On a real device (or Chrome DevTools touch emulation): swipe down from the top of the overlay at scroll position 0 → overlay follows finger → releases at >150px → closes smoothly.
- Scroll partway through overlay content → swipe down → scrolls content up, does not dismiss.
- Back button still closes overlay correctly.
- `closeWalkDetail()` resets `overlay.style.transform` to empty string (ensure this is the case — the spring-back also does this, but close must also clean up).

---

### FIX 13.2 — Conditions Prompt Fix

*(Based on ux-review-round11.md Issue 2)*

**Step 1 — Z-index fix (2 CSS lines)**

Find the existing `#cond-tag-backdrop` and `#cond-tag-sheet` CSS rules. Update:

```css
/* Was: */
#cond-tag-backdrop { z-index: 200; }
#cond-tag-sheet    { z-index: 201; }

/* Fix: */
#cond-tag-backdrop { z-index: 400; }
#cond-tag-sheet    { z-index: 401; }
```

**Step 2 — Add `hasSubmittedTagsToday()` helper**

This helper drives the auto-prompt suppression check. Add near the condition tags JS helpers:

```js
function hasSubmittedTagsToday(walkId) {
  try {
    var allTags  = JSON.parse(localStorage.getItem('sniffout_condition_tags') || '{}');
    var walkTags = allTags[walkId] || [];
    var today    = new Date().toDateString();
    return walkTags.some(function(t) {
      return new Date(t.ts).toDateString() === today;
    });
  } catch(e) { return false; }
}
```

**Step 3 — Remove session-level dismissal suppression**

Find and remove:
- The `promptDismissedThisSession` variable declaration
- All reads and writes to `promptDismissedThisSession`

In `onMarkWalked()` (updated in FIX 13.4 below), the prompt gate is now:
```js
if (!hasSubmittedTagsToday(walkId)) {
  openCondTagSheet(walkId);
}
```

**Step 4 — "Add or update conditions" link**

This element is added in `onMarkWalked()` — see FIX 13.4 below. The CSS:

```css
.walked-conditions-link {
  display: block;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--brand);
  padding: 10px 0 4px;
  cursor: pointer;
  text-decoration: none;
}
```

In `populateWalkDetail()`, when the walk is in State 2 (walked today) or State 3 (walked before, not today), render the link below the walked button:

```js
// After rendering the walked button (State 2 or 3):
if (isWalked(walk.id)) {
  var actionsEl = document.getElementById('walk-detail-actions'); // adjust selector to match overlay HTML
  if (actionsEl && !actionsEl.querySelector('.walked-conditions-link')) {
    var link = document.createElement('a');
    link.className = 'walked-conditions-link';
    link.textContent = '+ Add or update conditions →';
    link.onclick = function() { openCondTagSheet(walk.id); };
    actionsEl.appendChild(link);
  }
}
```

**Note:** `isWalked()` is added in FIX 13.4. Implement FIX 13.4 steps 1–3 before this step.

**Verify:**
- Mark a walk as walked from the detail overlay → conditions sheet appears on top of the overlay (not behind it).
- Dismiss the conditions sheet (swipe or skip) → no auto-prompt. Close overlay, re-open walk, tap "Mark as walked" again → conditions prompt fires again.
- Submit condition tags → conditions prompt suppressed for 24 hours on this walk. "Add or update conditions →" link still visible and functional.
- Dark mode: conditions sheet renders correctly above the overlay backdrop.

---

### FIX 13.3 — Contradictory Tag Conflict Resolution

*(Based on ux-review-round11.md Issue 3 — `busy`/`quiet` only; `clear` entries omitted as the tag was removed in FIX 10.3)*

**Step 1 — Add `COND_CONFLICTS` map**

Add near the top of the condition tags JS section, with other globals:

```js
var COND_CONFLICTS = {
  busy:  ['quiet'],
  quiet: ['busy']
};
```

**Note:** Do NOT add `clear`, `muddy`, `flooded`, `overgrown`, or `icy` entries. The Designer's spec included these for a `clear` tag that was removed in FIX 10.3. Adding entries for a non-existent tag is dead code.

**Step 2 — Update `toggleCondTag()`**

After the existing toggle logic, add conflict resolution:

```js
function toggleCondTag(btn) {
  var key = btn.getAttribute('data-tag');
  btn.classList.toggle('selected');
  // ...existing check/uncheck icon logic (unchanged)...

  // Deselect conflicting tags if this tag is now selected
  if (btn.classList.contains('selected')) {
    var conflicts = COND_CONFLICTS[key] || [];
    conflicts.forEach(function(conflictKey) {
      var conflictBtn = document.querySelector(
        '#cond-tag-sheet-inner .cond-tag-option[data-tag="' + conflictKey + '"]'
      );
      if (conflictBtn && conflictBtn.classList.contains('selected')) {
        conflictBtn.classList.remove('selected');
        var check = conflictBtn.querySelector('.cond-option-check');
        if (check) check.remove();
      }
    });
  }

  updateCondDoneBtn();
}
```

No CSS changes.

**Verify:**
- Open the condition tag sheet. Tap "Quiet today" → chip selected. Tap "Busy / crowded" → "Quiet today" deselects silently. Reverse direction also works.
- All other tag combinations remain independently toggleable.

---

### FIX 13.4 — Walk Log Data Model (Core Only)

*(Based on ux-review-round11.md Issue 4 — Me tab history and gamification helpers deferred to Round 13)*

**Step 1 — Core data functions**

Add these near the existing `sniffout_walked` read/write code:

```js
function getWalkLog() {
  try {
    var oldWalked = JSON.parse(localStorage.getItem('sniffout_walked') || 'null');
    if (oldWalked && Array.isArray(oldWalked) && oldWalked.length > 0) {
      var migratedTs = Date.now() - (7 * 24 * 3600000);
      var migrated = oldWalked.map(function(id) { return { id: id, ts: migratedTs }; });
      localStorage.setItem('sniffout_walk_log', JSON.stringify(migrated));
      localStorage.removeItem('sniffout_walked');
      return migrated;
    }
    return JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]');
  } catch(e) { return []; }
}

function logWalk(id) {
  var log = getWalkLog();
  log.unshift({ id: id, ts: Date.now() });
  try { localStorage.setItem('sniffout_walk_log', JSON.stringify(log)); } catch(e) {}
}
```

**Step 2 — Helper functions**

```js
function isWalked(id) {
  return getWalkLog().some(function(e) { return e.id === id; });
}

function isWalkedToday(id) {
  var today = new Date().toDateString();
  return getWalkLog().some(function(e) {
    return e.id === id && new Date(e.ts).toDateString() === today;
  });
}

function getWalkLogCount(id) {
  return getWalkLog().filter(function(e) { return e.id === id; }).length;
}

function getLastWalkDate(id) {
  var entry = getWalkLog().find(function(e) { return e.id === id; });
  return entry ? entry.ts : null;
}
```

Replace any existing `isWalked()` function (added in FIX 12.1) with the above version that reads from `sniffout_walk_log`.

**Step 3 — Update `onMarkWalked()`**

```js
function onMarkWalked(walkId, btn) {
  logWalk(walkId);  // replaces old sniffout_walked push

  // Immediately update button to "Walked today" state
  btn.className = 'walked-btn confirmed';
  btn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Walked today</span>';
  btn.style.pointerEvents = 'none';
  btn.style.fontWeight    = '';
  btn.style.borderColor   = '';
  btn.style.color         = '';
  btn.onclick = null;

  // Show "Add or update conditions" link
  var actionsEl = btn.closest('.walk-detail-actions');
  if (actionsEl && !actionsEl.querySelector('.walked-conditions-link')) {
    var link = document.createElement('a');
    link.className = 'walked-conditions-link';
    link.textContent = '+ Add or update conditions →';
    link.onclick = function() { openCondTagSheet(walkId); };
    actionsEl.appendChild(link);
  }

  updateMeStats();

  if (!hasSubmittedTagsToday(walkId)) {
    openCondTagSheet(walkId);
  }
}
```

**Remove:** The `showUndoToast()` call and the `onUnmarkWalked()` call from `onMarkWalked()`. The undo pattern was designed for the binary toggle and has no equivalent in a timestamped log. The undo toast CSS and `showUndoToast()` / `onUnmarkWalked()` functions can be removed entirely if they are only used in `onMarkWalked()`. Check for other call sites first.

**Step 4 — Three-state button in `populateWalkDetail()`**

Replace the existing walked button setup block:

```js
var walkedBtn = document.getElementById('walk-detail-walked-btn');
if (walkedBtn) {
  walkedBtn.setAttribute('data-walk-id', walk.id);
  walkedBtn.style.width        = '100%';
  walkedBtn.style.height       = '44px';
  walkedBtn.style.borderRadius = '12px';

  if (isWalkedToday(walk.id)) {
    // State 2: walked today — non-interactive
    walkedBtn.className = 'walked-btn confirmed';
    walkedBtn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Walked today</span>';
    walkedBtn.style.pointerEvents = 'none';
    walkedBtn.onclick = null;
  } else if (isWalked(walk.id)) {
    // State 3: walked before, not today
    walkedBtn.className       = 'walked-btn';
    walkedBtn.style.borderColor = 'rgba(30,77,58,0.25)';
    walkedBtn.style.color     = 'var(--brand)';
    walkedBtn.style.fontWeight = '600';
    walkedBtn.innerHTML = luIcon('rotate-ccw', 15, 'flex-shrink:0;') + '<span>Walk again</span>';
    walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
  } else {
    // State 1: never walked
    walkedBtn.className = 'walked-btn';
    walkedBtn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Mark as walked</span>';
    walkedBtn.onclick   = function() { onMarkWalked(walk.id, walkedBtn); };
  }

  // Show "Add or update conditions" link if walk has any prior log entry
  if (isWalked(walk.id)) {
    var actionsEl = walkedBtn.closest('.walk-detail-actions');
    if (actionsEl && !actionsEl.querySelector('.walked-conditions-link')) {
      var link = document.createElement('a');
      link.className   = 'walked-conditions-link';
      link.textContent = '+ Add or update conditions →';
      link.onclick     = function() { openCondTagSheet(walk.id); };
      actionsEl.appendChild(link);
    }
  }
}
```

**Step 5 — Update `updateMeStats()`**

Update the `stat-walked` element to reflect log length:

```js
var logsEl = document.getElementById('stat-walked');
if (logsEl) logsEl.textContent = getWalkLog().length;
```

Also update the stat label text in the Me tab HTML from "Walks explored" (or equivalent) to "Walks logged" if the `stat-walked` cell is currently labelled differently.

**Verify:**
- Open a walk never logged before: button shows "Mark as walked" (State 1). Tap → logs walk, button instantly becomes "Walked today" (State 2, non-interactive), conditions prompt fires, "Add or update conditions →" link appears.
- Close overlay. Reopen same walk: State 2 ("Walked today"), non-interactive, link present.
- Open a different walk never logged: State 1.
- Simulate next day (advance device clock or temporarily shift `isWalkedToday` threshold): same previously-walked walk shows "Walk again" (State 3) with ↺ icon. Tapping logs again.
- Me tab "Walks logged" count increments correctly with each log entry.
- User with existing `sniffout_walked` data: first `getWalkLog()` call migrates entries, removes `sniffout_walked` key, returns migrated entries with synthetic timestamps. Verify via DevTools storage.

---

### Round 12 — Complete Scope Summary

| Fix | Description | Effort |
|-----|-------------|--------|
| FIX 13.1 | Swipe-to-dismiss overlay — drag handle CSS/HTML + `initWalkDetailSwipe()` | 30–45 min |
| FIX 13.2 | Conditions prompt — z-index 400/401; remove `promptDismissedThisSession`; `hasSubmittedTagsToday()`; "Add or update conditions" link | 20–30 min |
| FIX 13.3 | Contradictory tags — `COND_CONFLICTS` for `busy`/`quiet` only; updated `toggleCondTag()` | 15–20 min |
| FIX 13.4 | Walk log core — `getWalkLog()`, `logWalk()`, migration, helpers, three-state button, `onMarkWalked()` update, `updateMeStats()` | 90–120 min |
| **Total** | | **~2.5–3.5 hrs** |

**Dependencies within Round 12 — implement in this order:**
1. FIX 13.3 (no dependencies — standalone)
2. FIX 13.4 steps 1–3 (data model, helpers, `hasSubmittedTagsToday`)
3. FIX 13.2 (z-index first; manual link depends on `isWalked` from step 2)
4. FIX 13.4 steps 4–5 (three-state button, `updateMeStats`)
5. FIX 13.1 (no dependencies — can be done at any point)

**Not in Round 12:**
- `renderWalkLogSection()` — walk history rows in Me tab
- Gamification helpers (`getCurrentStreak`, `getLongestStreak`, `getTotalDistanceMi`, `getEarnedBadges`)
- Me tab redesign / badge display

---

## Round 13 Preview — Me Tab Redesign and Gamification Display

Round 13 completes the Issue 4 implementation deferred from Round 12. Exact scope to be confirmed after Round 12 is assessed, but planned contents:

1. `logDateLabel(ts)` helper function
2. `renderWalkLogSection()` — 5 most recent walks in Me tab, with "See all walks →" sheet
3. Gamification helper functions (`getCurrentStreak`, `getLongestStreak`, `getTotalDistanceMi`, `getEarnedBadges`)
4. Badge display in Me tab — earned badge chips (milestone-based only; no streak counter surfaced)
5. Me tab stats row update — total distance, walks logged, favourites
6. "Last visited" note on walk detail — uses `getLastWalkDate()` already in build from Round 12

The Me tab will also be the natural place for a settings refresh once Phase 3 (accounts) approaches. That is out of scope for Round 13 but informs the layout decisions made there.
