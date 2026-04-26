# Me Tab Round 1b - Reconnaissance Report

**Date:** 26 April 2026
**File:** `sniffout-v2.html`
**Purpose:** Pre-brief research for Round 1b (activity calendar + stats header polish)

---

## Grep 1 - Me header / email pill

```
2209:    .me-header {
2388:    .me-walks-header {
2729:    .me-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
2731:    .me-header-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
2803:    .me-header-identity {
2916:    .me-month-header {
3037:    .me-stats-card-header {
3660:    .me-subpage-header {
3687:    .me-subpage-header-spacer { width: 36px; }
4910:    .walk-detail-header-name {
5640:      <header class="me-header">
5641:        <div class="me-header-identity" id="meHeaderIdentity">
5644:        <div id="meAuthStatus" style="display:none; padding: 0 16px 8px;"></div>
5674:        <div class="me-stats-card-header">
6313:    <div class="walk-detail-header-name" id="walk-detail-header-name"></div>
6393:  <div class="me-subpage-header">
6406:  <div class="me-subpage-header">
6411:    <div class="me-subpage-header-spacer"></div>
6419:  <div class="me-subpage-header">
6424:    <div class="me-subpage-header-spacer"></div>
6432:  <div class="me-subpage-header">
6437:    <div class="me-subpage-header-spacer"></div>
6445:  <div class="me-subpage-header">
6450:    <div class="me-subpage-header-spacer"></div>
6609:  <div class="me-subpage-header">
6614:    <div class="me-subpage-header-spacer"></div>
9491:    var headerName = document.getElementById('walk-detail-header-name');
9492:    if (headerName) headerName.style.opacity = '0';
9806:    var headerName = document.getElementById('walk-detail-header-name');
9807:    if (headerName) {
9808:      headerName.textContent = walk.name;
```

---

## Grep 2 - Walk log data

```
8956:  function getWalkLog() {
8963:        localStorage.setItem('sniffout_walk_log', JSON.stringify(migrated));
8967:      return JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]');
8972:    var log          = getWalkLog();
8987:    try { localStorage.setItem('sniffout_walk_log', JSON.stringify(log)); } catch(e) {}
9033:    return getWalkLog().some(function(e) { return e.id === id; });
9038:    return getWalkLog().some(function(e) {
9043:  function getWalkLogCount(id) {
9044:    return getWalkLog().filter(function(e) { return e.id === id; }).length;
9048:    var entries = getWalkLog().filter(function(e) { return e.id === walkId; });
9055:    var entry = getWalkLog().find(function(e) { return e.id === id; });
9066:    return getWalkLog().map(function(e) { return e.id; });
9088:    var log = getWalkLog();
9129:    var log = getWalkLog();
11935:      var log   = getWalkLog();
11944:        localStorage.setItem('sniffout_walk_log', JSON.stringify(log));
12129:    var log = getWalkLog();
12178:    var log       = getWalkLog();
12366:    var log = getWalkLog();
12442:    var log  = getWalkLog();
12468:    var log     = getWalkLog();
12559:    var log = getWalkLog();
12601:    var log  = getWalkLog();
13161:    var log = getWalkLog();
13186:    var log = getWalkLog();
13295:    var log = getWalkLog();
13577:    var log = getWalkLog();
13581:      try { localStorage.setItem('sniffout_walk_log', JSON.stringify(log)); } catch(e) {}
13679:    var log = getWalkLog();
13681:      try { localStorage.setItem('sniffout_walk_log', JSON.stringify(log)); } catch(e) {}
16926:      db.collection('users').doc(fsUid).collection('walkLog').doc(docId).set({
16941:        console.warn('Firestore walkLog write failed:', err);
16953:      db.collection('users').doc(fsUid).collection('walkLog').doc(String(ts)).update({
16957:        console.warn('Firestore walkLog note update failed:', err);
17193:  /* Phase 3B: Re-sync walkLog to Firestore with complete data (fixes missing distance) */
17199:    var log = JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]');
17208:      db.collection('users').doc(uid).collection('walkLog').doc(docId)
17300:      var walkLog = JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]') || [];
```

---

## Grep 3 - Calendar component

```
12327:    // Trigger: walk log entries on 3+ distinct calendar dates
```

---

## Analysis

### Email pill / header HTML location

The Me tab header lives at **lines 5640-5644**:

- `<header class="me-header">` at line 5640
- `<div class="me-header-identity" id="meHeaderIdentity">` at line 5641 - dog picker injected here by JS when multiple dogs exist
- `<div id="meAuthStatus" style="display:none">` at line 5644 - the email pill container; hidden when no auth, visible when signed in

The email pill is rendered by `updateMeAuthHeader()` at **line 17596**. When signed in, it sets:
```js
meAuthStatus.innerHTML = '<span class="me-auth-pill">email@example.com</span>';
```
It also writes the email directly to `meDogCardEmail` (lines 17627-17628), which in Round 1a was moved to the Account row "Your profile" subline.

---

### Walk log storage

- **localStorage key:** `sniffout_walk_log`
- **Accessor function:** `getWalkLog()` at **line 8956** - reads from localStorage, returns array
- **Write locations:**
  - `logWalk()` at line 8971 - curated walk taps
  - `saveCustomWalk()` at line 13577 - free-form log entries
  - Direct writes at lines 8987, 11944, 13581, 13681

---

### Calendar component status

**Does not exist.** The only hit in grep 3 is a comment at line 12327 inside the badge/achievement logic (`// Trigger: walk log entries on 3+ distinct calendar dates`). This is a counting condition for an achievement trigger, not a calendar UI. There is no `.me-calendar`, no `calendarMonth`, no grid, no walked-day elements anywhere in the file. The calendar is a greenfield build.

---

### Walk log data structure

Each entry in `sniffout_walk_log` is an object. From `logWalk()` at line 8985:

```javascript
{
  id:           "walk-id-string",  // WALKS_DB walk ID (null for custom entries)
  type:         "curated",         // "curated" | "custom"
  ts:           1714123456789,     // Unix timestamp ms - primary sort key
  date:         "2024-04-26",      // ISO date string - present on custom entries (user-picked date)
  weather_code: 3,                 // Open-Meteo weather code at time of log (nullable)
  is_day:       1,                 // 0 or 1 (nullable)
  wind_speed:   12.4,              // km/h (nullable)
  note:         null,              // user text note, set via journal detail view
  name:         "My walk",         // only on type:"custom" entries
  distance:     2.5,               // miles - only on custom entries where user filled it in
  duration:     45                 // minutes - only on custom entries where user filled it in
}
```

**Key point for calendar build:** dates are stored as Unix timestamps in `ts`, not date strings (except custom entries which use `entry.date`). The renderMeTab code already handles this dual-field pattern everywhere with `e.date || e.ts`. To derive a calendar day from any entry:

```javascript
var d = new Date(entry.date || entry.ts);
var key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
```

All walked days are recoverable from the existing log with no schema changes.
