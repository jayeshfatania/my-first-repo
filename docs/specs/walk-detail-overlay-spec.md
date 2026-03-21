# Sniffout — Walk Detail Overlay Design Spec
*Designer role. March 2026.*
*Stream 1, Phase 2. For Developer implementation.*
*Based on: condition-tags-design-spec.md, phase2-team-brief.md, sniffout-v2.html audit.*

---

## Overview

The walk detail overlay is a full-screen panel that slides up when a user taps any walk card — trail card (Walks tab carousel), portrait card (Today tab), or walk card (Me tab favourites). It replaces the current `onWalkTap()` stub.

**One overlay serves all card types.** The walk's ID is passed to `openWalkDetail(id)`, which looks up the walk in `WALKS_DB` and populates all content dynamically.

**Design pattern:** Full-screen slide-up overlay (not a bottom sheet). Covers the entire viewport including the bottom nav. Close button returns to the previous tab.

---

## Overlay Architecture

### HTML element

One persistent DOM element placed inside `#app`, after the bottom `<nav>`. Hidden by default via `transform: translateY(100%)`. Opened and closed by toggling `.open`.

```html
<!-- Walk detail overlay — place before </body>, inside #app -->
<div id="walk-detail-overlay" class="walk-detail-overlay" role="dialog" aria-modal="true" aria-label="Walk detail">

  <!-- Fixed header -->
  <div class="walk-detail-header">
    <button class="walk-detail-back" onclick="closeWalkDetail()" aria-label="Back">
      <!-- luIcon('arrow-left', 20) -->
    </button>
    <div class="walk-detail-header-name" id="walk-detail-header-name"></div>
    <button class="walk-detail-share-btn" id="walk-detail-share-btn" aria-label="Share this walk">
      <!-- luIcon('share-2', 20) -->
    </button>
  </div>

  <!-- Scrollable content -->
  <div class="walk-detail-scroll" id="walk-detail-scroll">

    <!-- 1. Hero image -->
    <div class="walk-detail-hero" id="walk-detail-hero">
      <!-- img injected by JS, or brand-green background if no imageUrl -->
      <div class="walk-detail-hero-badge" id="walk-detail-hero-badge"></div>
      <button class="walk-detail-hero-heart" id="walk-detail-hero-heart" aria-label="Add to favourites">
        <!-- heartSVG() injected by JS -->
      </button>
    </div>

    <!-- 2. Walk info: name, location, rating, stats -->
    <div class="walk-detail-info">
      <h1 class="walk-detail-name" id="walk-detail-name"></h1>
      <div class="walk-detail-location" id="walk-detail-location">
        <!-- luIcon('map-pin', 13) + location text -->
      </div>
      <div class="walk-detail-rating" id="walk-detail-rating"></div>
      <div class="walk-detail-stats">
        <div class="detail-stat">
          <div class="detail-stat-value" id="walk-detail-dist"></div>
          <div class="detail-stat-label">Distance</div>
        </div>
        <div class="detail-stat-divider"></div>
        <div class="detail-stat">
          <div class="detail-stat-value" id="walk-detail-dur"></div>
          <div class="detail-stat-label">Duration</div>
        </div>
        <div class="detail-stat-divider"></div>
        <div class="detail-stat">
          <div class="detail-stat-value" id="walk-detail-diff"></div>
          <div class="detail-stat-label">Difficulty</div>
        </div>
      </div>
    </div>

    <!-- 3. Quick tags (schema properties) -->
    <div class="walk-detail-tags-section" id="walk-detail-tags-section"></div>

    <!-- 4. Description -->
    <div class="walk-detail-desc" id="walk-detail-desc"></div>

    <!-- 5. Condition tags (from condition-tags-design-spec.md §4) -->
    <div class="walk-detail-conditions">
      <div class="walk-detail-conditions-heading">Current conditions</div>
      <div class="walk-detail-conditions-disclaimer">Community reported — not verified by Sniffout</div>
      <div id="walk-detail-cond-tags"></div>
    </div>

    <!-- 6. Mark as walked (from condition-tags-design-spec.md §4E) -->
    <div class="walk-detail-actions">
      <button class="walked-btn" id="walk-detail-walked-btn" data-walk-id="">
        <!-- icon + text injected by JS -->
      </button>
    </div>

    <!-- 7. Map -->
    <div class="walk-detail-map-section">
      <div class="walk-detail-map-title">Location</div>
      <div class="walk-detail-map" id="walk-detail-map"></div>
      <a class="walk-detail-maps-link" id="walk-detail-maps-link" target="_blank" rel="noopener">
        Open in Google Maps →
      </a>
    </div>

    <!-- Bottom safe area -->
    <div class="walk-detail-bottom-pad"></div>

  </div><!-- /walk-detail-scroll -->
</div><!-- /walk-detail-overlay -->
```

---

## CSS

All new rules. Add to the existing `<style>` block, after the condition tags rules.

```css
/* ══════════════════════════════════════
   WALK DETAIL OVERLAY
══════════════════════════════════════ */

.walk-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: var(--bg);
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.32,0.72,0,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.walk-detail-overlay.open {
  transform: translateY(0);
}

/* ── Header ── */
.walk-detail-header {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  gap: 4px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  z-index: 10;
  padding-top: env(safe-area-inset-top);
}
.walk-detail-back,
.walk-detail-share-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--ink);
  transition: background 120ms;
}
.walk-detail-back:active,
.walk-detail-share-btn:active {
  background: var(--bg);
}
.walk-detail-header-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  padding: 0 4px;
}

/* ── Scroll container ── */
.walk-detail-scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.walk-detail-scroll::-webkit-scrollbar { display: none; }

/* ── Hero image ── */
.walk-detail-hero {
  width: 100%;
  height: 220px;
  background: var(--brand);
  position: relative;
  flex-shrink: 0;
}
.walk-detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.walk-detail-hero-badge {
  position: absolute;
  bottom: 12px;
  left: 14px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  border-radius: 99px;
  padding: 4px 10px;
  display: none; /* shown by JS when badge exists */
}
.walk-detail-hero-heart {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(0,0,0,0.15);
}

/* ── Walk info block ── */
.walk-detail-info {
  padding: 16px 16px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.walk-detail-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin-bottom: 4px;
}
.walk-detail-location {
  font-size: 13px;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
}
.walk-detail-rating {
  font-size: 14px;
  color: #D97706;
  font-weight: 500;
  margin-bottom: 14px;
}
.walk-detail-rating .rating-count {
  color: var(--ink-2);
  font-weight: 400;
}

/* Quick stats row */
.walk-detail-stats {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
}
.detail-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  gap: 3px;
}
.detail-stat-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
}
.detail-stat-label {
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-2);
}
.detail-stat-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
  flex-shrink: 0;
}

/* ── Quick tags section ── */
.walk-detail-tags-section {
  padding: 14px 16px 10px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.detail-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  padding: 5px 10px;
  border: 1px solid transparent;
  white-space: nowrap;
}
.detail-tag--positive {
  color: var(--brand);
  background: rgba(30,77,58,0.08);
  border-color: rgba(30,77,58,0.12);
}
.detail-tag--warning {
  color: var(--amber);
  background: rgba(217,119,6,0.08);
  border-color: rgba(217,119,6,0.18);
}
.detail-tag--neutral {
  color: var(--ink-2);
  background: var(--bg);
  border-color: var(--border);
}

/* ── Description ── */
.walk-detail-desc {
  padding: 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.65;
}

/* ── Conditions section ── */
.walk-detail-conditions {
  padding: 16px 16px 4px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.walk-detail-conditions-heading {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 3px;
}
.walk-detail-conditions-disclaimer {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.4;
  margin-bottom: 12px;
}

/* ── Mark as walked (action area) ── */
.walk-detail-actions {
  padding: 20px 16px 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

/* ── Map section ── */
.walk-detail-map-section {
  padding: 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.walk-detail-map-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 10px;
}
.walk-detail-map {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--border);
  /* Leaflet map is initialised inside this container */
}
.walk-detail-maps-link {
  display: block;
  text-align: right;
  font-size: 13px;
  color: var(--brand);
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: none;
}
.walk-detail-maps-link:active { opacity: 0.7; }

/* ── Bottom pad ── */
.walk-detail-bottom-pad {
  height: 32px;
  flex-shrink: 0;
}

/* ══════════════════════════════════════
   DARK MODE
══════════════════════════════════════ */
body.night .walk-detail-overlay   { background: var(--bg); }
body.night .walk-detail-header     { background: var(--surface); border-color: var(--border); }
body.night .walk-detail-back,
body.night .walk-detail-share-btn  { color: var(--ink); }
body.night .walk-detail-back:active,
body.night .walk-detail-share-btn:active { background: var(--bg); }
body.night .walk-detail-hero       { background: var(--surface); }
body.night .walk-detail-info,
body.night .walk-detail-tags-section,
body.night .walk-detail-desc,
body.night .walk-detail-conditions,
body.night .walk-detail-actions,
body.night .walk-detail-map-section { background: var(--surface); border-color: var(--border); }
body.night .walk-detail-stats       { background: var(--bg); }
body.night .detail-tag--positive    { color: var(--brand); background: rgba(110,231,183,0.1); border-color: rgba(110,231,183,0.2); }
body.night .detail-tag--warning     { color: var(--amber); background: rgba(217,119,6,0.08); border-color: rgba(217,119,6,0.18); }
body.night .detail-tag--neutral     { color: var(--ink-2); background: var(--bg); border-color: var(--border); }
```

---

## JavaScript — Functions to Implement

### Variables

```js
var walkDetailMap = null;
var currentDetailWalkId = null;
```

### `openWalkDetail(id)`

Called from `onWalkTap(id)`. Update `onWalkTap` to call `openWalkDetail(id)` after the existing explore-tracking logic.

```js
function openWalkDetail(id) {
  var walk = null;
  for (var i = 0; i < WALKS_DB.length; i++) {
    if (WALKS_DB[i].id === id) { walk = WALKS_DB[i]; break; }
  }
  if (!walk) return;
  currentDetailWalkId = id;

  populateWalkDetail(walk);

  var overlay = document.getElementById('walk-detail-overlay');
  if (overlay) overlay.classList.add('open');

  // Init Leaflet map after CSS transition completes
  setTimeout(function() { initWalkDetailMap(walk.lat, walk.lon, walk.name); }, 320);
}
```

### `closeWalkDetail()`

```js
function closeWalkDetail() {
  var overlay = document.getElementById('walk-detail-overlay');
  if (overlay) overlay.classList.remove('open');

  setTimeout(function() {
    // Destroy map instance to free memory
    if (walkDetailMap) { walkDetailMap.remove(); walkDetailMap = null; }
    // Reset scroll position for next open
    var scroll = document.getElementById('walk-detail-scroll');
    if (scroll) scroll.scrollTop = 0;
    currentDetailWalkId = null;
  }, 310);
}
```

**Android back button support:** Add to the app's `popstate` handler (if one exists) or add:
```js
window.addEventListener('popstate', function() {
  var overlay = document.getElementById('walk-detail-overlay');
  if (overlay && overlay.classList.contains('open')) {
    closeWalkDetail();
    history.pushState(null, '', location.href); // re-push so next back doesn't leave page
  }
});
```
And `history.pushState(null, '', location.href)` inside `openWalkDetail` before adding `.open`.

---

### `populateWalkDetail(walk)`

Populates all static content. Called before the overlay opens.

```js
function populateWalkDetail(walk) {
  // Header name
  var headerName = document.getElementById('walk-detail-header-name');
  if (headerName) headerName.textContent = walk.name;

  // Hero
  var hero = document.getElementById('walk-detail-hero');
  if (hero) {
    // Remove previous img if any
    var oldImg = hero.querySelector('img');
    if (oldImg) oldImg.remove();
    if (walk.imageUrl) {
      var img = document.createElement('img');
      img.src = walk.imageUrl;
      img.alt = walk.name;
      img.loading = 'lazy';
      hero.insertBefore(img, hero.firstChild);
      hero.style.background = '';
    } else {
      hero.style.background = 'var(--brand)';
    }
  }

  // Badge
  var badge = document.getElementById('walk-detail-hero-badge');
  if (badge) {
    if (walk.badge) {
      badge.textContent = walk.badge;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }

  // Heart / favourite
  var heart = document.getElementById('walk-detail-hero-heart');
  if (heart) {
    heart.innerHTML = heartSVG(isFavourited(walk.id));
    heart.onclick = function(e) {
      e.stopPropagation();
      toggleFavourite(walk.id, heart);
    };
  }

  // Name
  var nameEl = document.getElementById('walk-detail-name');
  if (nameEl) nameEl.textContent = walk.name;

  // Location
  var locEl = document.getElementById('walk-detail-location');
  if (locEl) locEl.innerHTML = luIcon('map-pin', 13, 'color:var(--ink-2);flex-shrink:0;') + walk.location;

  // Rating
  var ratingEl = document.getElementById('walk-detail-rating');
  if (ratingEl) {
    ratingEl.innerHTML = walk.reviewCount > 0
      ? '&#9733; ' + walk.rating.toFixed(1) + ' <span class="rating-count">(' + walk.reviewCount + ' reviews)</span>'
      : '';
  }

  // Stats
  var distEl = document.getElementById('walk-detail-dist');
  if (distEl) distEl.textContent = walk.distance.toFixed(1) + ' mi';

  var durEl = document.getElementById('walk-detail-dur');
  if (durEl) {
    var hrs = Math.floor(walk.duration / 60);
    var mins = walk.duration % 60;
    durEl.textContent = hrs > 0
      ? hrs + 'h ' + (mins > 0 ? mins + 'm' : '')
      : walk.duration + ' min';
  }

  var diffEl = document.getElementById('walk-detail-diff');
  if (diffEl) diffEl.textContent = difficultyLabel(walk.difficulty);

  // Quick tags
  renderDetailTags(walk);

  // Description
  var descEl = document.getElementById('walk-detail-desc');
  if (descEl) descEl.textContent = walk.description;

  // Condition tags
  renderDetailConditions(walk.id);

  // Mark as walked button
  var walkedBtn = document.getElementById('walk-detail-walked-btn');
  if (walkedBtn) {
    walkedBtn.setAttribute('data-walk-id', walk.id);
    var walked = isWalked(walk.id);
    walkedBtn.className = 'walked-btn' + (walked ? ' confirmed' : '');
    walkedBtn.innerHTML = luIcon('check', 15, 'flex-shrink:0;') +
      '<span>' + (walked ? 'Walked' : 'Mark as walked') + '</span>';
    walkedBtn.style.width = '100%';
    walkedBtn.style.height = '44px';
    walkedBtn.style.borderRadius = '12px';
    if (!walked) {
      walkedBtn.onclick = function() { onMarkWalked(walk.id, walkedBtn); };
    }
  }

  // Google Maps link
  var mapsLink = document.getElementById('walk-detail-maps-link');
  if (mapsLink) {
    mapsLink.href = 'https://www.google.com/maps/search/?api=1&query=' + walk.lat + ',' + walk.lon;
  }

  // Share button
  var shareBtn = document.getElementById('walk-detail-share-btn');
  if (shareBtn) {
    shareBtn.onclick = function() { shareWalk(walk); };
  }

  syncIcons();
}
```

**`isWalked(id)` helper** (if not already in codebase):
```js
function isWalked(id) {
  try {
    var walked = JSON.parse(localStorage.getItem('sniffout_walked') || '[]');
    return walked.indexOf(id) > -1;
  } catch(e) { return false; }
}
```

---

### `renderDetailTags(walk)`

Builds the quick tags row from walk schema fields.

```js
function renderDetailTags(walk) {
  var el = document.getElementById('walk-detail-tags-section');
  if (!el) return;
  var html = '';

  // Off-lead
  var ol = offLeadLabel(walk.offLead);
  var olVariant = walk.offLead === 'full' ? 'positive'
                : walk.offLead === 'none' ? 'warning'
                : 'neutral';
  var olIcon = walk.offLead === 'none' ? 'link' : 'dog';
  html += detailTag(olIcon, ol.text, olVariant);

  // Difficulty
  var diffVariant = walk.difficulty === 'hard' ? 'warning' : 'neutral';
  html += detailTag('trending-up', difficultyLabel(walk.difficulty), diffVariant);

  // Terrain
  var terrainIcons = { paved: 'road', muddy: 'droplets', rocky: 'mountain', mixed: 'map' };
  if (walk.terrain) {
    var terrLabel = walk.terrain.charAt(0).toUpperCase() + walk.terrain.slice(1);
    html += detailTag(terrainIcons[walk.terrain] || 'map', terrLabel, 'neutral');
  }

  // Environment
  var envIcons = { woodland:'trees', coastal:'waves', urban:'building-2', moorland:'mountain-snow', heathland:'leaf', open:'wind' };
  if (walk.environment) {
    var envLabel = walk.environment.charAt(0).toUpperCase() + walk.environment.slice(1);
    html += detailTag(envIcons[walk.environment] || 'map', envLabel, 'neutral');
  }

  // Enclosed
  if (walk.enclosed) html += detailTag('lock', 'Enclosed', 'positive');

  // Livestock
  if (walk.livestock) html += detailTag('triangle-alert', 'Livestock possible', 'warning');

  // Has stiles
  if (walk.hasStiles) html += detailTag('step-forward', 'Has stiles', 'neutral');

  // Parking
  if (walk.hasParking) html += detailTag('car', 'Parking available', 'positive');

  el.innerHTML = html;
  syncIcons();
}

// Helper: renders a single detail-tag
function detailTag(icon, label, variant) {
  return '<span class="detail-tag detail-tag--' + variant + '">' +
    luIcon(icon, 13) + label + '</span>';
}
```

---

### `renderDetailConditions(walkId)`

Renders the condition tags section in the walk detail. Calls `getDisplayTags(walkId)` from `condition-tags-design-spec.md §6`. All individual tag row CSS is already specified in that doc (§4B, §4C, §4D).

```js
function renderDetailConditions(walkId) {
  var el = document.getElementById('walk-detail-cond-tags');
  if (!el) return;

  var tags = getDisplayTags(walkId);
  var allRaw = (JSON.parse(localStorage.getItem('sniffout_condition_tags')) || {})[walkId] || [];
  var HIDE_LIMIT = 30 * 24 * 3600000;
  var olderTags = allRaw.filter(function(t) { return (Date.now() - t.ts) >= HIDE_LIMIT; });

  if (tags.length === 0 && olderTags.length === 0) {
    // Empty state (spec §4D)
    el.innerHTML =
      '<div class="cond-empty">' +
        '<div class="cond-empty-icon">' + luIcon('footprints', 24, 'color:var(--ink-2)') + '</div>' +
        '<div class="cond-empty-text">Be the first to report conditions on this walk.</div>' +
      '</div>';
    syncIcons();
    return;
  }

  var html = '';
  var TAG_LABELS = {
    cattle:'Cattle in field', sheep:'Sheep in field', leads:'Dogs on leads here',
    access:'Access issue', muddy:'Very muddy underfoot', flooded:'Flooded section',
    overgrown:'Overgrown path', icy:'Icy / slippery', water:'Great water point',
    cafe:'Dog-friendly café open', clear:'Excellent conditions', busy:'Busy / crowded', quiet:'Quiet today'
  };
  var TAG_ICONS = {
    cattle:'triangle-alert', sheep:'triangle-alert', leads:'dog', access:'triangle-alert',
    muddy:'footprints', flooded:'waves', overgrown:'leaf', icy:'snowflake',
    water:'droplets', cafe:'coffee', clear:'sun', busy:'users', quiet:'volume-x'
  };

  tags.forEach(function(t) {
    var label = TAG_LABELS[t.tag] || t.tag;
    var icon  = TAG_ICONS[t.tag]  || 'circle';
    var cls   = 'cond-detail-row' +
                (t.isHazard ? ' cond-detail-row--hazard' : '') +
                (t.stale    ? ' cond-detail-row--stale'  : '');
    html +=
      '<div class="' + cls + '">' +
        luIcon(icon, 16) +
        '<span class="cond-detail-label">' + label + '</span>' +
        '<span class="cond-detail-age">' + t.ageText + '</span>' +
      '</div>';
  });

  // Older reports collapsible
  if (olderTags.length > 0) {
    html +=
      '<button class="cond-older-toggle" id="cond-older-toggle-' + walkId + '" ' +
        'onclick="toggleOlderReports(\'' + walkId + '\')">' +
        'Older reports <span id="cond-older-arrow-' + walkId + '">↓</span>' +
      '</button>' +
      '<div id="cond-older-rows-' + walkId + '" style="display:none">' +
        olderTags.map(function(t) {
          var label = TAG_LABELS[t.tag] || t.tag;
          var icon  = TAG_ICONS[t.tag]  || 'circle';
          var weeksAgo = Math.floor((Date.now() - t.ts) / 604800000);
          var ageText  = weeksAgo < 8 ? weeksAgo + ' week' + (weeksAgo > 1 ? 's' : '') + ' ago'
                        : Math.floor((Date.now() - t.ts) / (30*24*3600000)) + ' months ago';
          return '<div class="cond-detail-row" style="opacity:0.35">' +
            luIcon(icon, 16) +
            '<span class="cond-detail-label">' + label + '</span>' +
            '<span class="cond-detail-age" style="font-style:italic">' + ageText + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  }

  el.innerHTML = html;
  syncIcons();
}
```

---

### `initWalkDetailMap(lat, lon, name)`

```js
function initWalkDetailMap(lat, lon, name) {
  var container = document.getElementById('walk-detail-map');
  if (!container) return;
  if (walkDetailMap) { walkDetailMap.remove(); walkDetailMap = null; }

  walkDetailMap = L.map(container, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(walkDetailMap);

  walkDetailMap.setView([lat, lon], 14);

  L.marker([lat, lon])
    .bindPopup(name || 'Walk start')
    .addTo(walkDetailMap);

  walkDetailMap.invalidateSize();
}
```

---

### `shareWalk(walk)`

Uses the Web Share API where available; falls back to clipboard copy.

```js
function shareWalk(walk) {
  var text = walk.name + ' — ' + walk.distance.toFixed(1) + ' mi, ' +
             walk.duration + ' min · ' + walk.location;
  if (navigator.share) {
    navigator.share({
      title: walk.name,
      text: text,
      url: window.location.href
    }).catch(function() {}); // user may cancel — not an error
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showShareToast('Walk details copied');
    }).catch(function() {});
  }
}
```

**`showShareToast(message)`** — reuse the existing undo toast pattern if one exists in the codebase, or add a simple 2-second toast.

---

### `onWalkTap(id)` — updated

Add `openWalkDetail(id)` call at the end of the existing function:

```js
function onWalkTap(id) {
  try {
    var explored = JSON.parse(localStorage.getItem(EXPLORED_KEY)) || [];
    if (explored.indexOf(id) === -1) {
      explored.push(id);
      localStorage.setItem(EXPLORED_KEY, JSON.stringify(explored));
    }
  } catch(e) {}
  updateMeStats();
  openWalkDetail(id); // ← ADD THIS
}
```

---

## Section-by-Section Design Reference

### 1 — Header

```
┌────────────────────────────────────────┐
│  ←   Walk name (truncated)        ↑   │  52px, white surface, border-bottom
└────────────────────────────────────────┘
```

- **Back button (←):** `luIcon('arrow-left', 20)`, 40×40px tap target, left edge
- **Walk name:** 15px / 600 / `var(--ink)`, centred, truncated with ellipsis if overflows
- **Share button (↑):** `luIcon('share-2', 20)`, 40×40px tap target, right edge

---

### 2 — Hero Image

```
┌────────────────────────────────────────┐
│                                        │
│                                        │  220px, full bleed
│                    [♡]                 │  heart: top-right, 36px circle
│  [Sniffout Pick]                       │  badge: bottom-left pill
└────────────────────────────────────────┘
```

- **No image:** `background: var(--brand)` — the forest green fills the hero
- **With image:** `<img loading="lazy" object-fit: cover>`
- **Badge:** `rgba(0,0,0,0.55)` pill, bottom-left, 11px/500/white. Hidden if `walk.badge` is undefined.
- **Heart:** 36×36px white circle with box-shadow. Top-right at 12px/14px from edge. Uses existing `heartSVG()` + `toggleFavourite()`. Updates immediately on tap.

---

### 3 — Walk Info Block

```
┌────────────────────────────────────────┐
│  Box Hill Summit Loop                  │  20px / 700 / var(--ink)
│  📍 Dorking, Surrey                    │  13px / 400 / var(--ink-2)
│  ★ 4.7  (312 reviews)                 │  14px / 500 / #D97706
│                                        │
│  ┌──────────┬──────────┬──────────┐    │
│  │  3.2 mi  │  90 min  │ Moderate │    │  stats row
│  │ Distance │ Duration │Difficulty│    │
│  └──────────┴──────────┴──────────┘    │
└────────────────────────────────────────┘
```

**Stats row values:**
- Distance: `walk.distance.toFixed(1) + ' mi'`
- Duration: format as `Xh Ym` if ≥60 min (e.g. "1h 30m"), otherwise `X min`
- Difficulty: `difficultyLabel(walk.difficulty)` — "Easy" / "Moderate" / "Hard"

**Rating row:** Only rendered if `walk.reviewCount > 0`. Hidden otherwise — no placeholder text.

---

### 4 — Quick Tags

```
┌────────────────────────────────────────┐
│  [🐕 Partial off-lead]  [📈 Moderate]  │
│  [💧 Muddy]  [🌿 Woodland]             │
│  [⚠ Livestock possible]               │
└────────────────────────────────────────┘
```

Tags always shown (in order): off-lead → difficulty → terrain → environment → enclosed (if true) → livestock (if true) → stiles (if true) → parking (if true).

| Tag | Variant | Condition |
|-----|---------|-----------|
| Off-lead (full) | `--positive` | always |
| Off-lead (partial) | `--neutral` | always |
| On-lead only | `--warning` | always |
| Difficulty | `--warning` if hard, else `--neutral` | always |
| Terrain | `--neutral` | always |
| Environment | `--neutral` | always |
| Enclosed | `--positive` | `walk.enclosed === true` |
| Livestock possible | `--warning` | `walk.livestock === true` |
| Has stiles | `--neutral` | `walk.hasStiles === true` |
| Parking available | `--positive` | `walk.hasParking === true` |

Lucide icon mapping: see `renderDetailTags()` in JS section above.

---

### 5 — Description

Full `walk.description` text. No truncation. 14px / 400 / `var(--ink-2)` / line-height 1.65.

---

### 6 — Current Conditions

```
┌────────────────────────────────────────┐
│  Current conditions                    │  15px / 600 / var(--ink)
│  Community reported — not verified     │  12px / 400 / var(--ink-2)
│  by Sniffout                           │
│                                        │
│  With tags:                            │
│  [⚠ icon]  Cattle in field  3 hrs ago │  cond-detail-row--hazard
│  [💧 icon]  Very muddy       1 day ago │  cond-detail-row
│                                        │
│  OR empty state:                       │
│  [footprints icon]                     │
│  Be the first to report conditions     │
│  on this walk.                         │
│                                        │
│  Older reports ↓  (if applicable)      │
└────────────────────────────────────────┘
```

CSS for individual rows, staleness treatment, and empty state: see `condition-tags-design-spec.md §4`.

The section heading ("Current conditions") and disclaimer are rendered directly in the static HTML. The tag rows (`#walk-detail-cond-tags`) are populated by `renderDetailConditions(walkId)`.

---

### 7 — Mark as Walked

Appears immediately below the conditions section. Full specification in `condition-tags-design-spec.md §4E`. Key dimensions in this context:
- Height: 44px (vs 34px on the carousel card)
- Width: 100% (within 16px left/right padding from `.walk-detail-actions`)
- Border-radius: 12px
- Margin-top: 20px (space above the button within the actions block)
- Padding-bottom of `.walk-detail-actions`: 16px

When tapped:
1. Button → confirmed state immediately
2. Walk ID added to `sniffout_walked`
3. Tag prompt fires if not submitted today and not dismissed this session
4. Detail view button and all walk cards with same ID update to confirmed state

---

### 8 — Map

```
┌────────────────────────────────────────┐
│  Location                              │  15px / 600 / var(--ink)
│  ┌──────────────────────────────────┐  │
│  │          [Leaflet map]           │  │  180px, border-radius 12px
│  │        📍 walk start pin         │  │
│  └──────────────────────────────────┘  │
│                   Open in Google Maps →│  right-aligned, 13px / brand
└────────────────────────────────────────┘
```

**Map:** Leaflet, centred at `[walk.lat, walk.lon]`, zoom 14. Zoom controls hidden (`zoomControl: false`). Attribution hidden (`attributionControl: false`). Scroll wheel zoom disabled. Single `L.marker` at walk coords. `invalidateSize()` called after overlay transition.

**Google Maps link:** Opens `https://www.google.com/maps/search/?api=1&query={lat},{lon}` in new tab. `target="_blank" rel="noopener"`.

---

## Condition Tags Section — Integration Note

The condition tags section within the walk detail uses the existing `.cond-detail-row`, `.cond-detail-row--hazard`, `.cond-detail-row--stale`, `.cond-detail-label`, `.cond-detail-age`, `.cond-older-toggle`, `.cond-empty`, and `.cond-empty-text` classes fully specified in `condition-tags-design-spec.md §4`. Those rules are already specced and do not need repeating here. The developer should implement `condition-tags-design-spec.md §4` first, then wire it into the detail overlay via `renderDetailConditions()`.

---

## Interaction Flows

### Opening the overlay

```
User taps any walk card (trail, portrait, walk)
  └── onWalkTap(id) fires
        ├── explore tracking (existing)
        ├── updateMeStats() (existing)
        └── openWalkDetail(id)
              ├── Look up walk in WALKS_DB
              ├── populateWalkDetail(walk)
              ├── overlay.classList.add('open') → slides up
              └── setTimeout(320ms) → initWalkDetailMap()
```

### Closing the overlay

```
User taps ← back button
  └── closeWalkDetail()
        ├── overlay.classList.remove('open') → slides down
        └── setTimeout(310ms)
              ├── walkDetailMap.remove() → frees memory
              ├── scroll.scrollTop = 0 → reset for next open
              └── currentDetailWalkId = null
```

### Marking as walked from the overlay

```
User taps "Mark as walked"
  └── onMarkWalked(walkId, btn)   [existing function from condition-tags-design-spec.md]
        ├── btn → confirmed state (immediate)
        ├── walkId → sniffout_walked
        ├── All other [data-walk-id="{id}"] btns → confirmed (cards + detail)
        └── Check: already tagged today?
              YES → no prompt
              NO  → openCondTagSheet(walkId)
```

### Tapping the heart

```
User taps heart in hero
  └── toggleFavourite(id, heartBtn)   [existing function]
        ├── Toggles sniffout_favs
        ├── Updates heartSVG in this button
        └── Updates all other hearts for same walk ID
```

---

## Copy Strings

| Element | String |
|---------|--------|
| Header: overlay | Walk name (from `walk.name`) |
| Location prefix | `walk.location` (no prefix, icon only) |
| Stats: distance label | "Distance" |
| Stats: duration label | "Duration" |
| Stats: difficulty label | "Difficulty" |
| Conditions heading | "Current conditions" |
| Conditions disclaimer | "Community reported — not verified by Sniffout" |
| Empty conditions | "Be the first to report conditions on this walk." |
| Map section heading | "Location" |
| Google Maps link | "Open in Google Maps →" |
| Mark as walked (default) | "Mark as walked" |
| Mark as walked (confirmed) | "Walked" |
| Share copied toast | "Walk details copied" |

---

## CSS Class Index

| Class | Element | Notes |
|-------|---------|-------|
| `.walk-detail-overlay` | Full-screen overlay wrapper | `position: fixed; inset: 0; z-index: 300` |
| `.walk-detail-overlay.open` | Open state | `transform: translateY(0)` |
| `.walk-detail-header` | Sticky top bar | 52px, surface background |
| `.walk-detail-back` | ← close button | 40×40px tap target |
| `.walk-detail-header-name` | Walk name in header | Truncated, centered |
| `.walk-detail-share-btn` | Share button | 40×40px tap target |
| `.walk-detail-scroll` | Scrollable content container | `overflow-y: auto` |
| `.walk-detail-hero` | Hero image container | 220px height |
| `.walk-detail-hero-badge` | Badge pill in hero | Bottom-left, hidden if no badge |
| `.walk-detail-hero-heart` | Favourite button in hero | Top-right, 36px circle |
| `.walk-detail-info` | Name/location/rating/stats block | White surface |
| `.walk-detail-name` | Walk name `<h1>` | 20px / 700 |
| `.walk-detail-location` | Location row | 13px, with pin icon |
| `.walk-detail-rating` | Star rating | 14px / amber |
| `.walk-detail-stats` | 3-column stats row | Bordered, rounded |
| `.detail-stat` | One stat cell | Flex column |
| `.detail-stat-value` | Stat number | 15px / 600 |
| `.detail-stat-label` | Stat label | 11px / 400 |
| `.detail-stat-divider` | Vertical divider | 1px border |
| `.walk-detail-tags-section` | Quick tags flex wrap | White surface |
| `.detail-tag` | Base tag pill | 12px, inline-flex |
| `.detail-tag--positive` | Green variant | Off-lead, enclosed, parking |
| `.detail-tag--warning` | Amber variant | Livestock, on-lead, hard |
| `.detail-tag--neutral` | Grey variant | Terrain, environment, stiles |
| `.walk-detail-desc` | Description text | 14px / line-height 1.65 |
| `.walk-detail-conditions` | Conditions container | White surface |
| `.walk-detail-conditions-heading` | "Current conditions" | 15px / 600 |
| `.walk-detail-conditions-disclaimer` | Community disclaimer | 12px / `var(--ink-2)` |
| `.walk-detail-actions` | Walked button container | White surface |
| `.walk-detail-map-section` | Map container block | White surface |
| `.walk-detail-map-title` | "Location" | 15px / 600 |
| `.walk-detail-map` | Leaflet map container | 180px / border-radius 12px |
| `.walk-detail-maps-link` | "Open in Google Maps →" | Right-aligned, brand colour |
| `.walk-detail-bottom-pad` | Safe-area bottom spacing | 32px |

---

## Reuse Confirmation

| New component | Existing pattern reused |
|---------------|------------------------|
| Slide-up animation | `.filter-sheet` `translateY(100%) → translateY(0)` (same easing curve) |
| Hero heart button | `.trail-heart` / `.portrait-heart` style (same dimensions, larger in hero: 36px vs 28px) |
| Hero badge pill | `.trail-card-badge` / `.portrait-badge` style (identical) |
| `detail-stat` row | New — no existing pattern, but consistent with `.condition-cell` on Weather tab |
| `detail-tag` pills | Extends `.trail-tag` visual language, sized slightly larger for detail context |
| Leaflet map | `.nearby-map` pattern (Nearby tab), same initialisation approach |
| Condition tags block | Fully specified in `condition-tags-design-spec.md §4` — no new classes |
| `walked-btn` | Specified in `condition-tags-design-spec.md §1B` — height difference only (44px vs 34px) |
| `heartSVG()` / `toggleFavourite()` | Existing functions — no change |
| `syncIcons()` | Called after innerHTML updates — existing pattern |
