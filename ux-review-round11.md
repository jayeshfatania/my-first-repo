# Sniffout — UX Review Round 11
*Issued by Designer. March 2026.*
*Four issues identified by the owner after real-device testing.*
*Output for PO review before Developer implementation.*

---

## Issue 1 — Back Button Hard to Reach One-Handed

### Problem

The walk detail overlay has a `← arrow-left` back button at top-left of a fixed 52px header. On any phone larger than an iPhone SE — which is every current iPhone and Android flagship — the top-left corner requires a full grip shift or a thumb stretch that risks dropping the phone. This is the single most ergonomically hostile position on a mobile touchscreen.

The overlay already slides up from the bottom, which creates a clear user mental model: what came up should go down. The back button fights that model by requiring a top-left tap to dismiss something that entered from the bottom.

---

### Recommendation: Swipe-down gesture + drag handle

**Primary close action: swipe-down gesture**

When the user's scroll position is at the top of the overlay (`scrollTop === 0`), a downward swipe on the overlay dismisses it. This is the native iOS sheet pattern — used by Apple Maps, Safari share sheet, iOS system sheets — and is what mobile users now instinctively expect from bottom-up overlays.

The gesture tracks touch movement and provides live visual feedback: the overlay follows the user's finger downward during the drag, then either completes the dismiss (if dragged >150px) or springs back (if released below the threshold).

**Visual affordance: drag handle**

A drag handle at the very top of the overlay (above the header) makes the gesture discoverable. Without it, swipe-to-dismiss is an invisible gesture. With it, users see the pill and intuit the interaction.

```
┌─────────────────────────────────────────┐
│         ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌              │  ← drag handle: 36×4px, var(--border), centered
│  ←   Walk name (truncated)        ↑    │  ← header unchanged
└─────────────────────────────────────────┘
```

The handle is purely visual — the gesture target is the whole header area, not just the pill. This avoids the need for precise targeting.

**Keep the top-left back button**

Do not remove it. The back button serves three purposes the gesture cannot:
1. It is discoverable without trying the gesture
2. It works for users with motor impairments who cannot perform swipe gestures
3. On Android, some users rely on the persistent visual back affordance

The back button stays. The gesture adds a faster, thumb-friendly alternative.

**No bottom close button**

A permanently visible close button at the bottom of the overlay wastes 52–60px of content viewport on every visit, for every user, for a function that has two better implementations above. Ruled out.

---

### CSS additions

```css
/* Drag handle strip */
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

Add `.walk-detail-drag-handle` as the first child of `.walk-detail-overlay`, before `.walk-detail-header`.

---

### JavaScript: swipe-to-dismiss

```js
function initWalkDetailSwipe() {
  var overlay  = document.getElementById('walk-detail-overlay');
  var scroll   = document.getElementById('walk-detail-scroll');
  if (!overlay || !scroll) return;

  var startY   = 0;
  var isDragging = false;

  overlay.addEventListener('touchstart', function(e) {
    // Only initiate swipe if scroll is at top
    if (scroll.scrollTop > 0) return;
    startY     = e.touches[0].clientY;
    isDragging = true;
    overlay.style.transition = 'none';  // disable CSS transition during drag
  }, { passive: true });

  overlay.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    if (scroll.scrollTop > 0) { isDragging = false; return; }  // user started scrolling content
    var deltaY = e.touches[0].clientY - startY;
    if (deltaY < 0) { isDragging = false; return; }            // upward swipe — scroll normally
    overlay.style.transform = 'translateY(' + deltaY + 'px)';
  }, { passive: true });

  overlay.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    var deltaY = e.changedTouches[0].clientY - startY;
    overlay.style.transition = '';  // restore CSS transition

    if (deltaY > 150) {
      closeWalkDetail();
    } else {
      // Snap back
      overlay.style.transform = 'translateY(0)';
    }
  });
}
```

Call `initWalkDetailSwipe()` once after the overlay HTML is in the DOM (e.g. at the end of the script block, alongside other init calls).

**Scroll conflict handling:** The guard `if (scroll.scrollTop > 0) return` ensures that when the user is partway through the scroll content, a downward swipe scrolls the content upward rather than dismissing the overlay. Dismiss gesture only activates when the user is already scrolled to the top. This is the same behaviour as iOS native sheets.

---

### Implementation complexity

Low-medium. The CSS is trivial (drag handle). The JS gesture handler is self-contained and does not touch any existing functions. The only integration point is calling `initWalkDetailSwipe()` once on page load. Estimated effort: 30–45 minutes.

---

## Issue 2 — Conditions Prompt Not Appearing Correctly

### Problem (root cause)

The condition tag bottom sheet has `z-index: 201` in the current implementation. The walk detail overlay has `z-index: 300`. When `openCondTagSheet()` is called from within the overlay, the sheet renders **behind** the walk detail overlay and is visually invisible. The user sees nothing. When the hardware back button is pressed, the popstate handler fires `closeWalkDetail()`, removing the overlay — which reveals the conditions sheet that was open underneath all along.

This is a z-index stacking issue, not a logic error.

**Second problem:** The session-level dismissal (`promptDismissedThisSession[walkId] = true`) permanently suppresses the prompt for the rest of the session on any dismissal — including accidental ones. A user who taps Skip by mistake, or closes the sheet instinctively before reading it, cannot access the prompt again without force-reloading the app.

---

### Fix 1: Z-index

Raise the cond-tag sheet and its backdrop above the walk detail overlay.

```css
/* Current (in existing CSS): */
#cond-tag-backdrop { z-index: 200; }
#cond-tag-sheet    { z-index: 201; }

/* Fix: */
#cond-tag-backdrop { z-index: 400; }
#cond-tag-sheet    { z-index: 401; }
```

The sheet must be visually on top of the walk detail overlay (`z-index: 300`) and the filter sheet (`z-index: 201`). 400/401 provides clear headroom above both.

No other changes to the conditions sheet or its logic. The sheet already opens and closes correctly — it was just invisible.

---

### Fix 2: Remove session-level dismissal suppression

The `promptDismissedThisSession` check prevents re-prompting for the rest of the session. Remove this guard entirely.

**Replace with a 24-hour cooldown instead:**

The prompt should not fire again if the user **submitted tags** for this walk within the last 24 hours (the existing rate-limiting window from `condition-tags-design-spec.md`). If the user dismissed without submitting — whether intentionally or accidentally — the prompt should be available again on the next "Mark as walked" tap.

```js
// Current guard (remove this):
if (promptDismissedThisSession[walkId]) return;

// Replace with: only suppress if tags were actually submitted today
function hasSubmittedTagsToday(walkId) {
  try {
    var allTags = JSON.parse(localStorage.getItem('sniffout_condition_tags') || '{}');
    var walkTags = allTags[walkId] || [];
    var today = new Date().toDateString();
    return walkTags.some(function(t) {
      return new Date(t.ts).toDateString() === today;
    });
  } catch(e) { return false; }
}
```

Logic in `onMarkWalked()`:
```js
function onMarkWalked(walkId, btn) {
  // ...existing: btn → confirmed, add to sniffout_walked...

  // Only suppress prompt if tags were already submitted today
  if (!hasSubmittedTagsToday(walkId)) {
    openCondTagSheet(walkId);
  }
}
```

The `promptDismissedThisSession` variable and all references to it can be removed.

---

### Fix 3: Manual re-trigger — "Add conditions" link

Even with the auto-prompt firing correctly, users should be able to access the conditions prompt at any time from within the walk detail. This handles:
- Users who want to add more tags after already submitting once
- Users who dismissed the auto-prompt and later want to contribute
- Users revisiting a walk they logged previously

When the walk is in the confirmed/walked state, add a secondary action alongside the "Walked" button:

```
┌──────────────────────────────────────────┐
│  walk-detail-actions section             │
│                                          │
│  [ ✓ Walked                          ]  │  ← full-width confirmed button (unchanged)
│  [ + Add or update conditions →      ]  │  ← NEW: secondary text link below
└──────────────────────────────────────────┘
```

**"Add or update conditions" element:**
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

This element is rendered only when `isWalkedToday(walkId)` is true (or the walk has any prior log entry). It is not shown on the first visit before the walk is marked. Tapping it calls `openCondTagSheet(walkId)` directly, bypassing the `hasSubmittedTagsToday` check.

---

### Updated behaviour summary

| Scenario | Prompt behaviour |
|----------|-----------------|
| User marks walk, no tags submitted today | Auto-prompt fires immediately ✅ |
| User dismisses prompt (Skip or swipe) | Prompt gone for now, but re-appears on next "Mark as walked" tap within same session |
| User submitted tags today | Auto-prompt suppressed. "Add or update conditions →" link still available manually |
| User revisits walk the next day | Auto-prompt fires again on marking walked |
| User wants to add more tags after dismissal | Taps "Add or update conditions →" link |

---

### Implementation complexity

Low. The z-index change is 2 CSS lines. Removing `promptDismissedThisSession` simplifies the logic. Adding `hasSubmittedTagsToday()` is a small helper. The "Add or update conditions" link is one new element in `populateWalkDetail()`. Estimated effort: 20–30 minutes.

---

## Issue 3 — Contradictory Condition Tags

### Problem

The tag taxonomy has 13 tags across 4 categories. Currently, all 13 are independently toggleable — a user can submit any combination, including direct contradictions. "Quiet today" and "Busy / crowded" both selected produces a nonsense report. Other contradictions exist.

---

### Full taxonomy review for contradictions

#### Footfall category: `busy` ↔ `quiet`

**Verdict: Hard mutual exclusion. Enforce strictly.**

These are direct opposites describing the same dimension (how many people were on the walk). A walk cannot be simultaneously busy and quiet. No edge case exists.

**UI enforcement:** Radio-button behaviour within the Footfall group. Selecting `busy` immediately deselects `quiet`, and vice versa. Both remain selectable — the group is not multi-select, it is single-select. Visual treatment: no change to chip appearance (avoid over-engineering). The deselection is silent and immediate.

---

#### Positive category: `clear` (Excellent conditions) ↔ Surface hazards

**Verdict: Soft mutual exclusion. Enforce with auto-deselect.**

"Excellent conditions today" is a holistic positive signal that implicitly contradicts any negative surface condition. A walk cannot simultaneously have excellent conditions and be flooded, icy, very muddy, or overgrown.

The four surface tags that contradict `clear`:
- `muddy` — Very muddy underfoot
- `flooded` — Flooded section
- `overgrown` — Overgrown path
- `icy` — Icy / slippery

**UI enforcement:**
- Selecting `clear` deselects any currently active surface hazard chips silently
- Selecting any surface hazard chip deselects `clear` if currently active, silently

This is auto-deselect, not blocking. The user is not shown a warning. The system simply ensures the resulting submission is internally consistent.

---

#### Hazard category: no contradictions within the group

`cattle`, `sheep`, `leads`, `access` — all can coexist. A walk can have cattle in a field, require leads, and have an access issue simultaneously. No enforcement needed.

---

#### Surface category: `muddy` ↔ `icy`

**Verdict: No enforcement. Edge case is valid.**

Partially frozen mud is a documented condition in UK winters. A user might legitimately tag both. Icy conditions and very muddy conditions are not mutually exclusive in the physical world. Do not enforce.

---

#### Positive category: `water` ↔ `cafe` — no conflict

Both can coexist. A walk can have a water point and a dog-friendly café.

---

#### Cross-category: Hazard + Positive

`clear` (Excellent conditions) alongside hazard tags like `cattle` or `access` could be argued contradictory — but a walk could genuinely have excellent surface conditions and still have cattle in a field. These are different dimensions (surface quality vs. animal/access hazard). No enforcement.

---

### Complete mutual exclusivity map

| Tag | Conflicts with | Enforcement |
|-----|---------------|-------------|
| `busy` | `quiet` | Hard — radio pair, selecting one deselects the other |
| `quiet` | `busy` | Hard — radio pair |
| `clear` | `muddy`, `flooded`, `overgrown`, `icy` | Soft — selecting `clear` deselects all four; selecting any of the four deselects `clear` |
| `muddy` | `clear` | Soft — selecting deselects `clear` |
| `flooded` | `clear` | Soft — selecting deselects `clear` |
| `overgrown` | `clear` | Soft — selecting deselects `clear` |
| `icy` | `clear` | Soft — selecting deselects `clear` |

All other tag combinations are permitted.

---

### Implementation

Add conflict resolution to `toggleCondTag()`. Currently:

```js
function toggleCondTag(btn) {
  btn.classList.toggle('selected');
  // ...check/uncheck icon...
}
```

Add conflict resolution after the toggle:

```js
// Mutual exclusivity rules
var COND_CONFLICTS = {
  busy:     ['quiet'],
  quiet:    ['busy'],
  clear:    ['muddy', 'flooded', 'overgrown', 'icy'],
  muddy:    ['clear'],
  flooded:  ['clear'],
  overgrown:['clear'],
  icy:      ['clear']
};

function toggleCondTag(btn) {
  var key = btn.getAttribute('data-tag');
  btn.classList.toggle('selected');
  // ...existing check/uncheck icon logic...

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

No CSS changes required. The deselection is silent — no warning dialogs, no visual indicators beyond the chip returning to its unselected state. The user simply cannot submit contradictory tags.

---

### Implementation complexity

Very low. A lookup object (`COND_CONFLICTS`) and 10 lines in the existing `toggleCondTag()` function. Zero CSS changes. Estimated effort: 20 minutes.

---

## Issue 4 — Walk Logging and Repeat Walks UX

### Problem

`sniffout_walked` is a flat array of walk IDs. Adding an ID marks the walk as walked — once. The button then enters a locked confirmed state with no further action possible. This is appropriate for a simple favouriting system, but wrong for a walk *log*. A user who walks Box Hill every weekend should be able to record each visit.

The binary confirmed state also creates a UX dead-end: users who return to a walk they've done before have no action available, the "Mark as walked" button is inert, and the detail overlay offers them nothing new.

---

### Data model change

Replace `sniffout_walked` (flat array of IDs) with `sniffout_walk_log` (array of timestamped log entries).

```js
// Key: 'sniffout_walk_log'
// Value: JSON array, most recent first

[
  { id: 'box-hill-loop',   ts: 1742140800000 },
  { id: 'hampstead-heath', ts: 1742054400000 },
  { id: 'box-hill-loop',   ts: 1741795200000 },
  { id: 'ashridge-estate', ts: 1741622400000 }
]
```

Each entry has a walk `id` and a `ts` timestamp (milliseconds, `Date.now()`). The array grows with each logged walk. No deduplication — the same walk appears multiple times, once per visit.

**Backward migration:** On first read of `sniffout_walk_log`, check if `sniffout_walked` exists. If so, migrate its entries to the new format with a synthetic timestamp (`Date.now() - 7 * 24 * 3600000` — one week ago). Then clear `sniffout_walked`. One-time migration, no user action needed.

```js
function getWalkLog() {
  try {
    // One-time migration from old format
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
  log.unshift({ id: id, ts: Date.now() }); // add to front
  try { localStorage.setItem('sniffout_walk_log', JSON.stringify(log)); } catch(e) {}
}
```

---

### Helper functions

```js
// Has this walk been logged at any point?
function isWalked(id) {
  return getWalkLog().some(function(e) { return e.id === id; });
}

// Was this walk logged today?
function isWalkedToday(id) {
  var today = new Date().toDateString();
  return getWalkLog().some(function(e) {
    return e.id === id && new Date(e.ts).toDateString() === today;
  });
}

// How many times has this walk been logged (all time)?
function getWalkLogCount(id) {
  return getWalkLog().filter(function(e) { return e.id === id; }).length;
}

// Most recent log entry for a walk (or null)
function getLastWalkDate(id) {
  var entry = getWalkLog().find(function(e) { return e.id === id; });
  return entry ? entry.ts : null;
}
```

---

### Walk detail button: three states

The "Mark as walked" button in the walk detail overlay (`#walk-detail-walked-btn`) now has three states rather than two.

**State 1 — Never walked**
```
[ ✓  Mark as walked ]
background: var(--surface)
border: 1px solid var(--border)
color: var(--ink-2)
```
Tap: logs the walk, fires conditions prompt if applicable.

**State 2 — Walked today**
```
[ ✓  Walked today ]
background: rgba(30,77,58,0.08)
border: rgba(30,77,58,0.15)
color: var(--brand)
pointer-events: none (no tap action)
```
Non-interactive. Walk was already logged today — prevent accidental duplicate entries in the same day.

**State 3 — Walked before, not today**
```
[ ↺  Walk again ]
background: var(--surface)
border: 1px solid rgba(30,77,58,0.25)
color: var(--brand)
font-weight: 600
```
Tap: logs another walk entry (same ID, new timestamp), fires conditions prompt if applicable.

The `↺` symbol is Lucide `rotate-ccw` (15px). The copy "Walk again" signals repeat action without ambiguity.

---

### Updated `populateWalkDetail()` button logic

```js
// Replace the walked button block in populateWalkDetail():
var walkedBtn = document.getElementById('walk-detail-walked-btn');
if (walkedBtn) {
  walkedBtn.setAttribute('data-walk-id', walk.id);
  walkedBtn.style.width = '100%';
  walkedBtn.style.height = '44px';
  walkedBtn.style.borderRadius = '12px';

  if (isWalkedToday(walk.id)) {
    // State 2: walked today
    walkedBtn.className = 'walked-btn confirmed';
    walkedBtn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Walked today</span>';
    walkedBtn.style.pointerEvents = 'none';
    walkedBtn.onclick = null;
  } else if (isWalked(walk.id)) {
    // State 3: walked before, not today
    walkedBtn.className = 'walked-btn';
    walkedBtn.style.borderColor = 'rgba(30,77,58,0.25)';
    walkedBtn.style.color = 'var(--brand)';
    walkedBtn.style.fontWeight = '600';
    walkedBtn.innerHTML = luIcon('rotate-ccw', 15, 'flex-shrink:0;') + '<span>Walk again</span>';
    walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
  } else {
    // State 1: never walked
    walkedBtn.className = 'walked-btn';
    walkedBtn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Mark as walked</span>';
    walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
  }
}
```

---

### `onMarkWalked()` update

```js
function onMarkWalked(walkId, btn) {
  logWalk(walkId);  // replaces the old sniffout_walked push

  // Immediately update button to "Walked today" state
  btn.className = 'walked-btn confirmed';
  btn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') + '<span>Walked today</span>';
  btn.style.pointerEvents = 'none';
  btn.style.fontWeight = '';
  btn.style.borderColor = '';
  btn.style.color = '';
  btn.onclick = null;

  // Show "Add or update conditions" link (Issue 2 fix)
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

---

### Me tab walk history

The Me tab currently shows a stats row (walks explored + favourites). Extend this with a walk log section.

**Updated stats row values:**
- "Walks logged" — total entries in `sniffout_walk_log` (replaces "Walks explored")
- "Favourites" — unchanged

**New "Recent walks" section** in Me tab, below Favourites and above Settings:

```
Recent walks                    ← .me-section-title
─────────────────────────────
🌲 Box Hill Summit Loop         Today
🌲 Hampstead Heath              Yesterday
🌲 Box Hill Summit Loop         3 days ago
🌲 Ashridge Estate Loop         5 days ago
🌲 Stanage Edge                 12 days ago

                See all walks → ← text link (shows full history in a sheet)
```

Each row:
```html
<div class="walk-log-row">
  <span class="walk-log-name">{walk.name}</span>
  <span class="walk-log-date">{relativeDate}</span>
</div>
```

```css
.walk-log-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.walk-log-row:last-child { border-bottom: none; }
.walk-log-name {
  color: var(--ink);
  font-weight: 500;
  flex: 1;
  margin-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.walk-log-date {
  color: var(--ink-2);
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}
```

**Relative date helper:**
```js
function logDateLabel(ts) {
  var diff  = Date.now() - ts;
  var days  = Math.floor(diff / 86400000);
  var today = new Date().toDateString() === new Date(ts).toDateString();
  if (today)    return 'Today';
  if (days < 2) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  if (days < 14) return '1 week ago';
  return Math.floor(days / 7) + ' weeks ago';
}
```

Show the 5 most recent entries by default. "See all walks →" opens a bottom sheet with the full history, paginated in reverse-chronological order (50 entries per page — practical maximum for localStorage).

---

### Gamification groundwork (no backend needed)

The log array enables the following calculations purely from localStorage. No backend. No accounts. These are computed at render time and can power badges and stats in a future Me tab refresh.

```js
// Current streak: consecutive days with at least one walk logged
function getCurrentStreak() {
  var log = getWalkLog();
  if (log.length === 0) return 0;

  var streak = 0;
  var checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  while (true) {
    var dateStr = checkDate.toDateString();
    var walkedOnDay = log.some(function(e) {
      return new Date(e.ts).toDateString() === dateStr;
    });
    if (!walkedOnDay) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}

// Longest streak ever
function getLongestStreak() {
  var log = getWalkLog();
  if (log.length === 0) return 0;

  // Build sorted unique date set
  var dates = log.map(function(e) {
    var d = new Date(e.ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  dates = dates.filter(function(v, i, a) { return a.indexOf(v) === i; });
  dates.sort(function(a, b) { return a - b; });

  var maxStreak = 1, current = 1;
  for (var i = 1; i < dates.length; i++) {
    if (dates[i] - dates[i-1] === 86400000) {
      current++;
      if (current > maxStreak) maxStreak = current;
    } else {
      current = 1;
    }
  }
  return maxStreak;
}

// Total distance walked (sum of walk.distance for all log entries)
function getTotalDistanceMi() {
  var log = getWalkLog();
  return log.reduce(function(sum, entry) {
    var walk = WALKS_DB.find(function(w) { return w.id === entry.id; });
    return sum + (walk ? walk.distance : 0);
  }, 0);
}

// Badge milestones (purely calculated — display in Me tab)
function getEarnedBadges() {
  var log   = getWalkLog();
  var count = log.length;
  var badges = [];
  if (count >= 1)  badges.push({ id: 'first',    label: 'First walk',       icon: 'footprints' });
  if (count >= 5)  badges.push({ id: 'five',      label: '5 walks',          icon: 'award'      });
  if (count >= 10) badges.push({ id: 'ten',       label: '10 walks',         icon: 'medal'      });
  if (count >= 25) badges.push({ id: 'twentyfive',label: '25 walks',         icon: 'trophy'     });
  if (getLongestStreak() >= 7) badges.push({ id: 'streak7', label: '7-day streak', icon: 'flame' });

  // "Regular" — walked same walk 3+ times
  var counts = {};
  log.forEach(function(e) { counts[e.id] = (counts[e.id] || 0) + 1; });
  var isRegular = Object.values(counts).some(function(n) { return n >= 3; });
  if (isRegular) badges.push({ id: 'regular', label: 'Regular', icon: 'repeat' });

  return badges;
}
```

These functions are available immediately. The Me tab can display:
- Current streak ("🔥 3-day streak")
- Total distance
- Earned badges as simple icon+label chips

None of this requires a backend or user accounts. All data lives in `sniffout_walk_log` in localStorage. When a backend eventually lands, the log entries are straightforward to sync.

---

### Me tab stats update

```js
function updateMeStats() {
  var log       = getWalkLog();
  var favs      = getFavourites();
  var explored  = JSON.parse(localStorage.getItem(EXPLORED_KEY) || '[]');

  var logsEl = document.getElementById('stat-walked');
  if (logsEl) logsEl.textContent = log.length;

  var favsEl = document.getElementById('stat-favs');
  if (favsEl) favsEl.textContent = favs.length;

  var explEl = document.getElementById('stat-explored');
  if (explEl) explEl.textContent = explored.length;

  renderWalkLogSection();
}
```

Update `stat-walked` (or add it as a new stat cell) to show total logged walks count. The existing "Explored" stat can remain alongside it.

---

### Implementation complexity

Medium. The data model change is the largest part — replace `sniffout_walked` with `sniffout_walk_log`, update all reads/writes, add migration. The button three-state logic is straightforward. The Me tab additions are new DOM but follow existing patterns. The gamification helpers are pure functions with no side effects.

Estimated effort: 2–3 hours total for the full implementation.

**Recommended implementation order:**
1. `getWalkLog()`, `logWalk()`, helper functions
2. Migration logic (one-time, on first call to `getWalkLog()`)
3. Three-state button in `populateWalkDetail()`
4. Updated `onMarkWalked()`
5. Updated `updateMeStats()`
6. `renderWalkLogSection()` in Me tab
7. Gamification helpers (last — lower priority, no UX dependency)

---

## Summary Table

| Issue | Root cause | Recommendation | Effort |
|-------|-----------|----------------|--------|
| 1 — Back button | Top-left placement, unreachable one-handed | Swipe-down gesture + drag handle visual | 30–45 min |
| 2 — Conditions prompt | z-index 201 renders behind overlay z-index 300 | Raise sheet to z-index 401; replace session dismissal with 24h tag check; add manual re-trigger link | 20–30 min |
| 3 — Contradictory tags | No conflict logic in toggleCondTag() | `COND_CONFLICTS` map: hard radio for busy/quiet, soft auto-deselect for clear vs. surface hazards | 20 min |
| 4 — Walk logging | Binary walked array with no timestamps | Replace with timestamped log; three-state button; Me tab history; gamification groundwork | 2–3 hrs |
