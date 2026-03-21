# Me Tab — Subpage Architecture Spec
**Version:** v3 — Subpage Model
**Builds on:** me-tab-rethink-v2-spec.md
**Date:** 2026-03-18

---

## What This Spec Changes

The v2 spec established the hero miles number and inline walk log. This spec:

1. Converts the walk log and badges from inline content into **entry point rows** that open full-screen overlays
2. Adds two new subpages: **Saved Walks** and **Saved Places**
3. Adds a **dog avatar** slot to the header
4. Converts the hero card from miles-only into a **three-stat dashboard**
5. Defines HTML, CSS and interaction patterns for all four subpages

The guiding principle of the v2 spec is preserved: above the fold shows one clean dashboard. Depth is accessed by tapping into subpages.

---

## Revised Me Tab Layout

```
┌─────────────────────────────────┐
│  [dog]  Jay           [gear]    │  ← Header
├─────────────────────────────────┤
│  ┌───────────┐  ┌─────────────┐ │
│  │   47.3    │  │     12      │ │  ← Stats card
│  │  miles    │  │   walks     │ │
│  └───────────┘  └─────────────┘ │
│  ┌───────────────────────────┐  │
│  │   3 contributions         │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  📒 Walk Journal        3  ›    │  ← Entry rows
│     Roseberry Topping · 2d ago  │
├─────────────────────────────────┤
│  🏅 Badges               2  ›   │
│     Sniffout Regular earned     │
├─────────────────────────────────┤
│  ♡  Saved Walks          8  ›   │
├─────────────────────────────────┤
│  📍 Saved Places         4  ›   │
└─────────────────────────────────┘
```

Icons are inline SVG outline icons — not emoji. The above uses emoji for diagram clarity only.

---

## Section 1: Me Tab — HTML & CSS

### 1.1 Header

The header gains a dog avatar slot. The gear icon position is unchanged.

```html
<div class="me-header">
  <div class="me-header-identity">
    <div class="me-dog-avatar" id="meDogAvatar">
      <!-- SVG dog outline shown until dog profile set -->
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <!-- dog silhouette outline path -->
        <path d="M10 3C8.5 3 7 4 7 6v1H5a2 2 0 00-2 2v2c0 1.1.9 2 2 2h.5L5 17h2l1-3h4l1 3h2l-.5-4H15a2 2 0 002-2V9a2 2 0 00-2-2h-2V6c0-2-1.5-3-3-3z"/>
      </svg>
    </div>
    <span class="me-name" id="meNameDisplay"></span>
  </div>
  <button class="me-gear" aria-label="Settings" onclick="openSettings()">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  </button>
</div>
```

```css
.me-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
}
.me-header-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}
.me-dog-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(30, 77, 58, 0.08);
  border: 1px solid rgba(30, 77, 58, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand);
  flex-shrink: 0;
  overflow: hidden;
}
/* When dog photo is set (Phase 3): */
.me-dog-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.me-name {
  font: 700 22px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -0.3px;
}
.me-gear {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: none;
  color: var(--ink-2);
  border-radius: 50%;
  cursor: pointer;
}
```

**Dog avatar rules:**
- If no dog profile is set: shows outline dog SVG icon in brand-tinted circle
- If dog profile set with photo (Phase 3): shows circular photo crop
- If dog profile set with name only (Phase 3): shows first initial of dog name in brand text
- Avatar is not tappable until Phase 3 dog profile feature exists

---

### 1.2 Stats Dashboard

Replaces the single-stat hero. Three stats: miles, walks, contributions.

```html
<div class="me-stats-dashboard" id="meStatsDashboard">
  <!-- Primary row: miles + walks side by side -->
  <div class="me-stats-row">
    <div class="me-stat-card me-stat-card--primary">
      <span class="me-stat-number" id="statMiles">0</span>
      <span class="me-stat-label">miles walked</span>
    </div>
    <div class="me-stat-card">
      <span class="me-stat-number" id="statWalks">0</span>
      <span class="me-stat-label">walks logged</span>
    </div>
  </div>
  <!-- Secondary row: contributions full-width -->
  <div class="me-stat-card me-stat-card--secondary">
    <span class="me-stat-number me-stat-number--sm" id="statContribs">0</span>
    <span class="me-stat-label">contributions</span>
  </div>
</div>
```

```css
.me-stats-dashboard {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.me-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.me-stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.me-stat-card--primary {
  /* Miles card: slightly more visual weight via larger number */
}
.me-stat-card--secondary {
  /* Contributions: full-width, horizontal layout */
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}
.me-stat-number {
  font: 700 48px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -2px;
}
.me-stat-number--sm {
  font: 700 32px/1 'Inter', sans-serif;
  letter-spacing: -1px;
}
.me-stat-label {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
```

**Stats calculation (JS):**

```js
function renderMeStats(walkLog, reviews, exploredSet) {
  const miles = walkLog.reduce((sum, w) => sum + (w.distance || 0), 0);
  const walks = walkLog.length;
  const contribs = Object.keys(reviews).length;

  document.getElementById('statMiles').textContent =
    miles === 0 ? '0' : miles.toFixed(1);
  document.getElementById('statWalks').textContent = walks;
  document.getElementById('statContribs').textContent = contribs;
}
```

**Rules:**
- Stats dashboard always renders, even at zero — this is data, not a feature
- Miles: one decimal place; zero renders as "0" not "0.0"
- Contributions: count of walk reviews submitted (keys in `walkReviews`)
- No progress bars, no targets, no trend arrows

---

### 1.3 Entry Point Rows

Four rows below the stats dashboard. Each row is a tappable surface.

```html
<div class="me-entries" id="meEntries">

  <!-- Walk Journal -->
  <button class="me-entry-row" onclick="openMeSubpage('journal')"
          id="entryJournal">
    <div class="me-entry-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <line x1="8" y1="7" x2="16" y2="7"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    </div>
    <div class="me-entry-text">
      <span class="me-entry-label">Walk Journal</span>
      <span class="me-entry-preview" id="journalPreview">No walks logged yet</span>
    </div>
    <div class="me-entry-right">
      <span class="me-entry-count" id="journalCount"></span>
      <svg class="me-entry-chevron" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </button>

  <!-- Badges — hidden until first badge earned -->
  <button class="me-entry-row" onclick="openMeSubpage('badges')"
          id="entryBadges" hidden>
    <div class="me-entry-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    </div>
    <div class="me-entry-text">
      <span class="me-entry-label">Badges</span>
      <span class="me-entry-preview" id="badgesPreview"></span>
    </div>
    <div class="me-entry-right">
      <span class="me-entry-count" id="badgesCount"></span>
      <svg class="me-entry-chevron" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </button>

  <!-- Saved Walks -->
  <button class="me-entry-row" onclick="openMeSubpage('savedwalks')"
          id="entrySavedWalks">
    <div class="me-entry-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    </div>
    <div class="me-entry-text">
      <span class="me-entry-label">Saved Walks</span>
      <span class="me-entry-preview" id="savedWalksPreview">None saved yet</span>
    </div>
    <div class="me-entry-right">
      <span class="me-entry-count" id="savedWalksCount"></span>
      <svg class="me-entry-chevron" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </button>

  <!-- Saved Places -->
  <button class="me-entry-row" onclick="openMeSubpage('savedplaces')"
          id="entrySavedPlaces">
    <div class="me-entry-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
    <div class="me-entry-text">
      <span class="me-entry-label">Saved Places</span>
      <span class="me-entry-preview" id="savedPlacesPreview">None saved yet</span>
    </div>
    <div class="me-entry-right">
      <span class="me-entry-count" id="savedPlacesCount"></span>
      <svg class="me-entry-chevron" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </button>

</div>
```

```css
.me-entries {
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.me-entry-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
}
.me-entry-row:last-child {
  border-bottom: none;
}
.me-entry-row:active {
  opacity: 0.6;
}
.me-entry-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-2);
  flex-shrink: 0;
}
.me-entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.me-entry-label {
  font: 500 14px/1 'Inter', sans-serif;
  color: var(--ink);
}
.me-entry-preview {
  font: 400 12px/1.3 'Inter', sans-serif;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.me-entry-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.me-entry-count {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
.me-entry-chevron {
  color: var(--ink-2);
  opacity: 0.5;
}
```

**Entry row preview logic (JS):**

```js
function updateMeEntryRows(walkLog, badges, favs, savedPlaces) {
  // Walk Journal
  const journalCount = document.getElementById('journalCount');
  const journalPreview = document.getElementById('journalPreview');
  if (walkLog.length > 0) {
    const last = [...walkLog].reverse()[0];
    journalCount.textContent = walkLog.length;
    journalPreview.textContent = `${last.walkName} · ${formatRelativeDate(last.date)}`;
  }

  // Badges — row hidden until first badge earned
  const entryBadges = document.getElementById('entryBadges');
  if (badges.length > 0) {
    entryBadges.hidden = false;
    document.getElementById('badgesCount').textContent = badges.length;
    const latest = badges[badges.length - 1];
    document.getElementById('badgesPreview').textContent =
      `${latest.name} earned`;
  }

  // Saved Walks
  const savedWalksCount = document.getElementById('savedWalksCount');
  const savedWalksPreview = document.getElementById('savedWalksPreview');
  if (favs.length > 0) {
    savedWalksCount.textContent = favs.length;
    savedWalksPreview.textContent = `${favs.length} walk${favs.length !== 1 ? 's' : ''} saved`;
  }

  // Saved Places
  const savedPlacesCount = document.getElementById('savedPlacesCount');
  const savedPlacesPreview = document.getElementById('savedPlacesPreview');
  if (savedPlaces.length > 0) {
    savedPlacesCount.textContent = savedPlaces.length;
    savedPlacesPreview.textContent = `${savedPlaces.length} place${savedPlaces.length !== 1 ? 's' : ''} saved`;
  }
}
```

---

## Section 2: Subpage Overlay Shell

All four subpages share the same overlay shell pattern, consistent with the walk detail overlay already in the codebase.

```html
<!-- Shared overlay shell — one per subpage, IDs differ -->
<div class="me-subpage" id="subpageJournal" role="dialog"
     aria-modal="true" aria-label="Walk Journal">
  <div class="me-subpage-handle"></div>
  <div class="me-subpage-header">
    <button class="me-subpage-back" onclick="closeMeSubpage('journal')"
            aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <h2 class="me-subpage-title">Walk Journal</h2>
    <div class="me-subpage-header-spacer"></div>
  </div>
  <div class="me-subpage-content">
    <!-- Subpage-specific content rendered here -->
  </div>
</div>
```

```css
.me-subpage {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: var(--bg);
  transform: translateY(100%);
  transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;
}
.me-subpage.is-open {
  transform: translateY(0);
}
/* Swipe-down drag handle */
.me-subpage-handle {
  width: 36px;
  height: 4px;
  background: rgba(0,0,0,0.15);
  border-radius: 2px;
  margin: 10px auto 0;
  flex-shrink: 0;
}
.me-subpage-header {
  display: flex;
  align-items: center;
  padding: 8px 16px 12px;
  flex-shrink: 0;
}
.me-subpage-back {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: none;
  color: var(--ink);
  border-radius: 50%;
  cursor: pointer;
  margin-left: -8px;
}
.me-subpage-title {
  font: 600 17px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -0.2px;
  flex: 1;
  text-align: center;
}
.me-subpage-header-spacer {
  width: 36px; /* mirrors back button for centering */
}
.me-subpage-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 40px;
}
```

**Open/close JS:**

```js
function openMeSubpage(id) {
  const el = document.getElementById(`subpage${capitalize(id)}`);
  el.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  // Populate content before opening
  renderSubpageContent(id);
}
function closeMeSubpage(id) {
  const el = document.getElementById(`subpage${capitalize(id)}`);
  el.classList.remove('is-open');
  document.body.style.overflow = '';
}
```

**Swipe-down to dismiss:**

```js
function initSubpageSwipe(id) {
  const el = document.getElementById(`subpage${capitalize(id)}`);
  let startY = 0;
  el.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientY - startY;
    if (delta > 80) closeMeSubpage(id);
  }, { passive: true });
}
// Call for each subpage: ['journal','badges','savedwalks','savedplaces'].forEach(initSubpageSwipe)
```

---

## Section 3: Walk Journal Subpage

### 3.1 Entry Point Preview

The entry row shows:
- Label: **Walk Journal**
- Preview: most recent walk name + relative date (e.g. "Roseberry Topping · 2 days ago")
- Count: total walks logged as a number

### 3.2 Content Layout

Chronological list, most recent first. Each row is a tappable item that expands to show the note and photo inline.

```html
<div class="me-subpage-content" id="journalContent">

  <!-- Populated by JS — structure per row: -->
  <div class="journal-row" data-id="[walkId]" onclick="toggleJournalRow(this)">
    <div class="journal-row-summary">
      <div class="journal-row-left">
        <span class="journal-row-name">Roseberry Topping</span>
        <span class="journal-row-meta">3.8 mi · 14 Feb 2026</span>
      </div>
      <svg class="journal-row-chevron" width="14" height="14"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <!-- Expanded detail — hidden by default -->
    <div class="journal-row-detail" hidden>
      <p class="journal-row-note">Best autumn colour we've seen. Scratchy found a dead rabbit which was less ideal.</p>
      <div class="journal-row-photo">
        <!-- img if photo attached, nothing if not -->
      </div>
    </div>
  </div>

</div>
```

```css
.journal-row {
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.journal-row:last-child { border-bottom: none; }
.journal-row-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
}
.journal-row-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.journal-row-name {
  font: 500 14px/1 'Inter', sans-serif;
  color: var(--ink);
}
.journal-row-meta {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
.journal-row-chevron {
  color: var(--ink-2);
  opacity: 0.5;
  transition: transform 200ms ease;
  flex-shrink: 0;
}
.journal-row.is-expanded .journal-row-chevron {
  transform: rotate(180deg);
}
.journal-row-detail {
  padding: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.journal-row-note {
  font: 400 14px/1.5 'Inter', sans-serif;
  color: var(--ink);
  margin: 0;
}
.journal-row-photo img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 200px;
}
```

**Toggle JS:**

```js
function toggleJournalRow(el) {
  const detail = el.querySelector('.journal-row-detail');
  const isExpanded = el.classList.contains('is-expanded');
  // Collapse all
  document.querySelectorAll('.journal-row.is-expanded').forEach(r => {
    r.classList.remove('is-expanded');
    r.querySelector('.journal-row-detail').hidden = true;
  });
  // Expand this one if it was collapsed
  if (!isExpanded) {
    el.classList.add('is-expanded');
    detail.hidden = false;
  }
}
```

**localStorage schema for walk log entries:**

```js
// sniffout_walk_log — array of objects
{
  id: 'walk-log-1709123456789',
  walkId: 'roseberry-topping',
  walkName: 'Roseberry Topping',
  location: 'Newton under Roseberry, North Yorkshire',
  distance: 3.8,
  date: '2026-02-14T09:23:00Z',
  note: 'Best autumn colour we\'ve seen.',
  photoDataUrl: null  // base64 string if photo attached, null if not
}
```

### 3.3 Empty State

```html
<div class="me-subpage-empty">
  <div class="me-subpage-empty-icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  </div>
  <p class="me-subpage-empty-head">Your walks will appear here</p>
  <p class="me-subpage-empty-body">After any walk, tap Log this walk on the walk card to add it to your journal.</p>
</div>
```

```css
.me-subpage-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 12px;
}
.me-subpage-empty-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-2);
  margin-bottom: 4px;
}
.me-subpage-empty-head {
  font: 600 16px/1.3 'Inter', sans-serif;
  color: var(--ink);
  margin: 0;
}
.me-subpage-empty-body {
  font: 400 14px/1.5 'Inter', sans-serif;
  color: var(--ink-2);
  margin: 0;
  max-width: 280px;
}
```

### 3.4 Phase 3 Hooks

- **Photo attachment:** `photoDataUrl` field already in schema. Render `<img>` in expanded detail when present. Add camera button in entry UI.
- **Sharing:** Share button on individual journal row header (Phase 3). Generates a shareable walk card image.
- **Community visible:** Toggle on journal entries to make them public (Phase 3 social layer). Slot for toggle in expanded detail row.

---

## Section 4: Badges Subpage

### 4.1 Entry Point Behaviour

**Hidden until the first badge is earned.** The entry row does not exist in the DOM until `badges.length > 0`. When first badge is earned, the row slides in with a brief fade animation.

Preview shows the most recently earned badge name + "earned" (e.g. "Sniffout Regular earned").

### 4.2 Content Layout

Full list of earned badges. Each badge is a card. Tapping a card expands inline detail.

```html
<div class="me-subpage-content" id="badgesContent">
  <!-- Rendered by JS -->
  <div class="badge-card" data-id="[badgeId]" onclick="toggleBadgeCard(this)">
    <div class="badge-card-summary">
      <div class="badge-card-icon">
        <!-- Badge-specific SVG icon -->
      </div>
      <div class="badge-card-text">
        <span class="badge-card-name">Sniffout Regular</span>
        <span class="badge-card-date">Earned 14 Feb 2026</span>
      </div>
      <svg class="badge-card-chevron" width="14" height="14"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="badge-card-detail" hidden>
      <p class="badge-card-desc">You logged 5 walks. Every walk is a choice — this one counts.</p>
    </div>
  </div>
</div>
```

```css
.badge-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  cursor: pointer;
}
.badge-card-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}
.badge-card-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: rgba(30, 77, 58, 0.08);
  border: 1px solid rgba(30, 77, 58, 0.15);
  display: flex; align-items: center; justify-content: center;
  color: var(--brand);
  flex-shrink: 0;
}
.badge-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.badge-card-name {
  font: 600 14px/1 'Inter', sans-serif;
  color: var(--ink);
}
.badge-card-date {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
.badge-card-chevron {
  color: var(--ink-2);
  opacity: 0.5;
  transition: transform 200ms ease;
  flex-shrink: 0;
}
.badge-card.is-expanded .badge-card-chevron {
  transform: rotate(180deg);
}
.badge-card-detail {
  padding: 0 14px 14px;
  border-top: 1px solid var(--border);
}
.badge-card-detail[hidden] { display: none; }
.badge-card-desc {
  font: 400 14px/1.5 'Inter', sans-serif;
  color: var(--ink-2);
  margin: 12px 0 0;
}
```

### 4.3 Empty State

Not applicable. The entry row is hidden until the first badge is earned, so the subpage is never opened with zero badges.

### 4.4 Phase 3 Hooks

- **Badge sharing:** Each badge card has a share icon in the expanded detail. Generates an image of the badge + earned moment for social sharing.
- **Badge notifications:** When a badge is earned, a toast appears over the current tab with the badge name and a tap-to-view CTA that opens this subpage.
- **Social badge wall:** In Phase 3, the badge subpage shows badges from people the user follows. This adds a segmented control: "Yours / Friends" at the top of the subpage.

---

## Section 5: Saved Walks Subpage

### 5.1 Entry Point Preview

Shows the count of saved walks. If zero: "None saved yet."

### 5.2 Content Layout

Compact list of favourited walks from `sniffout_favs`. Each row taps into the walk detail overlay (the same overlay used from the Walks tab).

```html
<div class="me-subpage-content" id="savedWalksContent">
  <!-- Rendered by JS from sniffout_favs + WALKS_DB lookup -->
  <div class="saved-walk-row" onclick="openWalkFromSaved('[walkId]')">
    <div class="saved-walk-info">
      <span class="saved-walk-name">Box Hill Loop</span>
      <span class="saved-walk-meta">3.2 mi · Box Hill, Surrey</span>
    </div>
    <div class="saved-walk-right">
      <span class="saved-walk-diff saved-walk-diff--easy">easy</span>
      <svg class="saved-walk-chevron" width="14" height="14"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</div>
```

```css
.saved-walk-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.saved-walk-row:last-child { border-bottom: none; }
.saved-walk-row:active { opacity: 0.6; }
.saved-walk-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.saved-walk-name {
  font: 500 14px/1 'Inter', sans-serif;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.saved-walk-meta {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
.saved-walk-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}
.saved-walk-diff {
  font: 500 11px/1 'Inter', sans-serif;
  padding: 3px 7px;
  border-radius: 20px;
  text-transform: lowercase;
}
.saved-walk-diff--easy {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}
.saved-walk-diff--moderate {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}
.saved-walk-diff--hard {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}
.saved-walk-chevron {
  color: var(--ink-2);
  opacity: 0.5;
}
```

### 5.3 Empty State

```html
<div class="me-subpage-empty">
  <div class="me-subpage-empty-icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  </div>
  <p class="me-subpage-empty-head">Heart any walk to save it here</p>
  <p class="me-subpage-empty-body">Saved walks are stored on this device and don't need a connection to view.</p>
</div>
```

### 5.4 Phase 3 Hooks

- **Walk lists / collections:** Users can organise saved walks into named collections ("Weekend trips", "Easy ones with Pretzel"). Add a + New list button in the header.
- **Shared lists:** A saved walk list can be shared as a link (Phase 3).
- **Sync across devices:** When account exists, saved walks sync to profile.

---

## Section 6: Saved Places Subpage

### 6.1 Entry Point Preview

Shows count of saved places. If zero: "None saved yet."

### 6.2 Content Layout

List of venues and green spaces saved from the Nearby tab. Each row opens Google Maps for that place.

```html
<div class="me-subpage-content" id="savedPlacesContent">
  <!-- Rendered from sniffout_saved_places -->
  <div class="saved-place-row" onclick="openPlaceInMaps('[placeId]')">
    <div class="saved-place-type-icon">
      <!-- SVG icon for category: cafe, pub, park, petshop -->
    </div>
    <div class="saved-place-info">
      <span class="saved-place-name">The Spotted Dog Cafe</span>
      <span class="saved-place-meta">Cafe · Dorking, Surrey</span>
    </div>
    <svg class="saved-place-external" width="14" height="14"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  </div>
</div>
```

```css
.saved-place-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.saved-place-row:last-child { border-bottom: none; }
.saved-place-row:active { opacity: 0.6; }
.saved-place-type-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-2);
  flex-shrink: 0;
}
.saved-place-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.saved-place-name {
  font: 500 14px/1 'Inter', sans-serif;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.saved-place-meta {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}
.saved-place-external {
  color: var(--ink-2);
  opacity: 0.4;
  flex-shrink: 0;
}
```

**localStorage schema for saved places:**

```js
// sniffout_saved_places — array of objects
{
  placeId: 'ChIJ_...', // Google Places ID
  name: 'The Spotted Dog Cafe',
  category: 'cafe',    // cafe | pub | park | pet_shop
  address: 'Dorking, Surrey',
  lat: 51.2346,
  lon: -0.3313,
  savedAt: '2026-03-01T14:22:00Z',
  mapsUrl: 'https://maps.google.com/?cid=...'
}
```

**Open in Maps:**

```js
function openPlaceInMaps(placeId) {
  const places = JSON.parse(localStorage.getItem('sniffout_saved_places') || '[]');
  const place = places.find(p => p.placeId === placeId);
  if (place?.mapsUrl) window.open(place.mapsUrl, '_blank');
}
```

### 6.3 Empty State

```html
<div class="me-subpage-empty">
  <div class="me-subpage-empty-icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>
  <p class="me-subpage-empty-head">Save cafes and green spaces</p>
  <p class="me-subpage-empty-body">Tap the bookmark icon on any venue in the Nearby tab to save it here.</p>
</div>
```

### 6.4 Phase 3 Hooks

- **Notes on places:** Add a note to a saved place ("great for post-walk coffee, order the flat white").
- **Visited toggle:** Mark a saved place as visited.
- **Shared place lists:** Send a saved places list to another user.

---

## Section 7: Interaction Summary

| Gesture | Effect |
|---|---|
| Tap entry row | Opens subpage with slide-up animation (320ms) |
| Tap back button (top-left of subpage) | Closes subpage, slides down |
| Swipe down 80px+ anywhere on subpage | Closes subpage |
| Tap outside subpage | No effect (full-screen overlay, no scrim tap-to-close) |
| Tap walk row in Saved Walks | Opens walk detail overlay on top of subpage (z-index 400) |
| Tap place row in Saved Places | Opens Google Maps in new tab/window |
| Tap journal row | Expands inline detail; collapses others |
| Tap badge card | Expands inline detail; collapses others |

---

## Section 8: New User Empty State (Me Tab)

When walk log is empty and no badges earned and no saves, the Me tab shows a minimal state. The stats dashboard renders with zeros. The entry rows render with their "none yet" preview text. No separate empty state card needed — the zeros and preview text communicate the state naturally.

The only exception: if `sniffout_username` is not set, the name slot is blank and the header is sparse. This is intentional (rule carried from v2 spec).

---

## Section 9: What Is Not in Scope

These features are intentionally excluded from this spec:

| Feature | Why excluded |
|---|---|
| Log a walk button on the Me tab | Logging happens from the walk detail overlay, not from Me |
| Edit saved walk or remove from journal | Out of scope for this pass — long-press or swipe-to-delete deferred |
| Sort or filter options on subpages | Not needed at current data volumes; add in Phase 3 |
| Photo capture in journal | Deferred — schema is ready, UI capture deferred |
| Dog profile creation | Phase 3 — avatar slot exists in header, profile creation is not in scope |
| Streak counter | Explicitly excluded per me-tab-dashboard-research.md recommendation |
