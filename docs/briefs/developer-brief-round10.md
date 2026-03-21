# Developer Brief — Round 10

*Issued by: Product Owner*
*Date: March 2026*
*Based on: sticky-picks-proposal.md (Designer, March 2026); missing-dog-design-spec.md §1 (Designer, March 2026); Owner brief — Meteocons weather icons (March 2026)*
*File: sniffout-v2.html only*

---

## Context

Round 9 is complete (FIX 10.1–10.4 all confirmed done). This brief contains four independent changes. FIX 11.1–11.3 are small UI additions. FIX 11.4 is a weather icon upgrade — the most impactful visual change in this round.

These changes have no interaction risk with each other or with the condition tags work. FIX 11.4 is self-contained (new lookup + helper + two render call changes).

---

## FIX 11.1 — Sticky Tab Title Bar

**Problem:** The `.tab-title-bar` (tab heading + filter/action icon) scrolls away when the user scrolls down in any tab. On the Walks tab this is most harmful — the filter button disappears, forcing the user to scroll back to the top to change radius or sort. The same issue exists on other tabs.

**Fix:** One CSS addition.

```css
.tab-title-bar {
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 20;
}
```

Add this to the existing `.tab-title-bar` rule. Do not create a new rule — merge into the existing one.

**Scope:** `.tab-title-bar` is a shared class used across all tabs. This change applies to all of them: Weather, Walks, Nearby, Me. The Today tab already has its own fixed-position header structure — confirm visually that the sticky declaration does not conflict; if the Today tab title bar does not use `.tab-title-bar` as its primary scroll container, no action needed there.

**Dark mode:** `var(--bg)` resolves correctly in both modes — no additional dark mode rule needed.

**Verify:** Scroll down on the Walks tab. The "Walks" heading and filter icon should remain visible at the top of the content area throughout. Repeat on Weather, Nearby, Me. Tab-switch should not cause any visual jump.

---

## FIX 11.2 — "↑ Picks" Anchor Pill on Walks Tab

**Problem:** After scrolling past the Sniffout Picks carousel into the green spaces list (~458px of scroll on a standard iPhone), there is no way to return to Picks without manually scrolling back to the top.

**Approach:** A small fixed-position pill button appears when the Picks carousel leaves the viewport. Tapping it scrolls back to the top of the Walks tab. It disappears when Picks are visible. No sticky layout, no height budget concerns, no iOS Safari `-webkit-overflow-scrolling` risk.

### Step 1 — Add the button HTML

Inside `#tab-walks`, **outside** `#walks-content` (so it is not wiped when the walk list re-renders):

```html
<div id="tab-walks" class="tab-panel">
  <div class="tab-title-bar">...</div>
  <div id="walks-content">...</div>
  <!-- Anchor button — outside walks-content so it survives re-renders -->
  <button class="picks-anchor-btn" id="picks-anchor-btn" aria-label="Back to Sniffout Picks">
    <i data-lucide="arrow-up" style="width:14px;height:14px;flex-shrink:0"></i>
    Picks
  </button>
</div>
```

### Step 2 — Add CSS

```css
.picks-anchor-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px 8px 10px;
  background: var(--brand);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  cursor: pointer;
  /* Hidden by default */
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.picks-anchor-btn.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
```

No dark mode override needed — `var(--brand)` resolves to `#82B09A` in dark mode, which is correct for this button.

### Step 3 — Add `initPicksAnchor()` JS function

```js
var picksObserver = null;

function initPicksAnchor() {
  // Disconnect any previous observer (called after every re-render)
  if (picksObserver) { picksObserver.disconnect(); picksObserver = null; }

  var carousel  = document.querySelector('#tab-walks .trail-carousel');
  var anchorBtn = document.getElementById('picks-anchor-btn');
  if (!carousel || !anchorBtn) return;

  picksObserver = new IntersectionObserver(function(entries) {
    var isVisible = entries[0].isIntersecting;
    anchorBtn.classList.toggle('visible', !isVisible);
  }, {
    root:      document.getElementById('tab-walks'), // must be the scroll container, not null
    threshold: 0                                     // trigger as soon as carousel edge exits
  });

  picksObserver.observe(carousel);

  anchorBtn.onclick = function() {
    document.getElementById('tab-walks').scrollTo({ top: 0, behavior: 'smooth' });
  };
}
```

**Why `root` must be `#tab-walks` and not `null`:** The Walks tab is `position: absolute` and not the document scroll root. Using `root: null` (viewport) would give incorrect intersection results. The `root` must be the same element that has `overflow-y: auto` — `#tab-walks`.

### Step 4 — Call `initPicksAnchor()` after every walk render

At the end of both `renderWalksTab()` and `renderWalksTabWithResults()`, after the DOM is written to `#walks-content`, add:

```js
initPicksAnchor();
syncIcons(); // if not already called at end of these functions
```

`initPicksAnchor()` must be called **after** `el.innerHTML = html` so the `.trail-carousel` element exists in the DOM when the observer attaches.

### Step 5 — Clean up when switching away from Walks tab

In `showTab()`, when the tab being left is `'walks'` (or when any non-walks tab is activated), hide the pill and disconnect the observer:

```js
// Inside showTab() or wherever tab switching is handled:
var anchorBtn = document.getElementById('picks-anchor-btn');
if (anchorBtn) anchorBtn.classList.remove('visible');
if (picksObserver) { picksObserver.disconnect(); picksObserver = null; }
```

This prevents the pill from appearing on other tabs and prevents the observer from running while the Walks tab is off-screen.

### Verify

1. Open Walks tab. Confirm pill is not visible.
2. Scroll past the carousel into the green spaces list. Confirm pill appears with fade-in animation.
3. Tap the pill. Confirm smooth scroll to top of Walks tab. Confirm pill disappears once carousel is back in view.
4. Switch to another tab. Confirm pill is not visible.
5. Switch back to Walks. Confirm pill behaviour is correct again.
6. Apply a filter (changes radius or sort). Confirm pill still works after the walk list re-renders.

---

## FIX 11.3 — Missing Dog Alerts "Coming Soon" Card in Me Tab

**Design reference:** missing-dog-design-spec.md §1 — read it in full before implementing. Everything needed is specified there. This note is a summary only.

**What to add:** A single non-interactive card in the Me tab, between the Favourites section and the sign-in banner.

**Placement:** Me tab currently: Stats → Favourites → Sign-in banner → Settings. Card inserts between Favourites and the sign-in banner.

**HTML:**

```html
<div class="missing-coming-soon">
  <div class="missing-coming-soon-icon">
    <i data-lucide="search" style="width:22px;height:22px"></i>
  </div>
  <div class="missing-coming-soon-body">
    <div class="missing-coming-soon-title">Missing Dog Alerts</div>
    <div class="missing-coming-soon-desc">Alert nearby dog walkers when your dog goes missing — or help find one near you.</div>
    <span class="missing-coming-soon-pill">Coming soon</span>
  </div>
</div>
```

**CSS** (add to stylesheet — copy directly from missing-dog-design-spec.md §1 for exact values):

```css
.missing-coming-soon {
  margin: 0 16px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  opacity: 0.9;
  pointer-events: none;
}
.missing-coming-soon-icon {
  width: 44px;
  height: 44px;
  background: rgba(30,77,58,0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--brand);
}
.missing-coming-soon-body { flex: 1; min-width: 0; }
.missing-coming-soon-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}
.missing-coming-soon-desc {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.5;
  margin-bottom: 10px;
}
.missing-coming-soon-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
  letter-spacing: 0.02em;
}
/* Dark mode */
body.night .missing-coming-soon-icon {
  background: rgba(130,176,154,0.12);
}
```

**No JavaScript.** Static card only. `pointer-events: none` is set on the container — no tap action, no href. Call `syncIcons()` after the Me tab renders to pick up the Lucide `search` icon.

**Verify:** Open Me tab. Card appears between Favourites section and sign-in banner. Card is non-tappable (no ripple, no cursor change on desktop). Dark mode: icon background is a subtle sage tint. All other tokens resolve correctly.

---

---

## FIX 11.4 — Meteocons Weather Icons

**Problem:** The current weather icons are Lucide SVG icons — a general-purpose UI icon set. Lucide icons for weather are minimal line symbols (`cloud-rain`, `cloud-snow`, `sun`) that look fine for UI chrome but generic as weather indicators. Replacing them with Meteocons — a purpose-built, illustrated weather icon set with 236 icons including day/night variants — makes the weather sections look significantly more polished and visually distinct from the rest of the UI.

**Scope:** Weather condition icons on the Today tab hero and the 5-day forecast rows (shown on both Today and Weather tabs via `buildForecastGrid()`). All other icons in the app remain Lucide.

**Icon set:** Meteocons by Bas Milius. MIT licence. Static SVG via CDN — no npm install, no build step. Animated variants exist but static is used initially (animated can be considered separately).

**CDN:** `https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg-static/{name}.svg`

No `<script>` tag needed. Icons are plain `<img>` tags.

---

### Step 1 — Audit current WMO icon usage

There are exactly **two places** in the codebase where `WMO_ICON` is used to render a weather condition icon:

| Location | Current code | Size |
|----------|-------------|------|
| `renderTodayStateB()` — Today tab hero | `luIcon(WMO_ICON[cur.weather_code] \|\| 'cloud-sun', 46)` | 46px |
| `buildForecastGrid()` — 5-day forecast rows | `luIcon(WMO_ICON[code] \|\| 'cloud-sun', 24)` | 24px |

Both will be replaced. The `WMO_ICON` object can stay — removing it is optional tidy-up.

**Note on dead code:** `var emoji = WMO_EMOJI[...]` is declared in both `renderTodayStateB()` and `buildForecastGrid()` but the `emoji` variable is never placed into the rendered HTML (superseded by the Lucide icon upgrade in Round 7). Can be cleaned up if desired, but not a blocker.

---

### Step 2 — Add the `WMO_METEOCON` lookup and helpers

Add these near the existing WMO helpers block (after `WMO_ICON`):

```js
/* ─── Meteocons weather icon lookup ─── */

var METEOCON_BASE = 'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg-static/';

var WMO_METEOCON = {
  //  code: { day: '...', night: '...' }
  //  Where no day/night difference exists, both values are the same.
  0:  { day: 'clear-day',                night: 'clear-night' },
  1:  { day: 'clear-day',                night: 'clear-night' },
  2:  { day: 'partly-cloudy-day',        night: 'partly-cloudy-night' },
  3:  { day: 'overcast-day',             night: 'overcast-night' },
  45: { day: 'fog-day',                  night: 'fog-night' },
  48: { day: 'fog-day',                  night: 'fog-night' },
  51: { day: 'drizzle',                  night: 'drizzle' },
  53: { day: 'drizzle',                  night: 'drizzle' },
  55: { day: 'drizzle',                  night: 'drizzle' },
  56: { day: 'sleet',                    night: 'sleet' },
  57: { day: 'sleet',                    night: 'sleet' },
  61: { day: 'rain',                     night: 'rain' },
  63: { day: 'rain',                     night: 'rain' },
  65: { day: 'rain',                     night: 'rain' },
  66: { day: 'sleet',                    night: 'sleet' },
  67: { day: 'sleet',                    night: 'sleet' },
  71: { day: 'snow',                     night: 'snow' },
  73: { day: 'snow',                     night: 'snow' },
  75: { day: 'snow',                     night: 'snow' },
  77: { day: 'snow',                     night: 'snow' },
  80: { day: 'partly-cloudy-day-rain',   night: 'partly-cloudy-night-rain' },
  81: { day: 'rain',                     night: 'rain' },
  82: { day: 'rain',                     night: 'rain' },
  85: { day: 'partly-cloudy-day-snow',   night: 'partly-cloudy-night-snow' },
  86: { day: 'snow',                     night: 'snow' },
  95: { day: 'thunderstorms-day-rain',   night: 'thunderstorms-night-rain' },
  96: { day: 'thunderstorms-day-rain',   night: 'thunderstorms-night-rain' },
  99: { day: 'thunderstorms-day-rain',   night: 'thunderstorms-night-rain' }
};

function meteoconImg(code, isDay, size) {
  var entry = WMO_METEOCON[code];
  var name  = entry
    ? (isDay === 0 ? entry.night : entry.day)
    : 'not-available';
  var desc  = WMO_DESC[code] || 'Weather';
  return '<img src="' + METEOCON_BASE + name + '.svg"'
    + ' alt="' + desc + '"'
    + ' width="' + size + '" height="' + size + '"'
    + ' style="display:block;flex-shrink:0;">';
}
```

**Day/night logic:** `isDay` is the raw value from Open-Meteo's `current.is_day` field — `1` during day, `0` at night. The function treats anything other than `0` as day. For forecast rows, always pass `1` (conventional daytime icons for multi-day forecasts).

**Fallback:** `not-available` is a valid Meteocon icon showing a greyed placeholder. It only renders if an unknown WMO code is received.

---

### Step 3 — Update the Today tab hero icon

In `renderTodayStateB()`, replace:

```js
'<div style="line-height:1;">' + luIcon(WMO_ICON[cur.weather_code] || 'cloud-sun', 46) + '</div>' +
```

with:

```js
'<div>' + meteoconImg(cur.weather_code, cur.is_day, 64) + '</div>' +
```

Size increases from 46px → 64px. The hero is the primary visual anchor of the Today tab — a larger illustrated icon reads better than a smaller line icon. The `line-height:1` style is unnecessary for a block-display image and is removed.

---

### Step 4 — Update the 5-day forecast row icons

In `buildForecastGrid()`, replace:

```js
'<div class="forecast-icon">' + luIcon(WMO_ICON[code] || 'cloud-sun', 24) + '</div>' +
```

with:

```js
'<div class="forecast-icon">' + meteoconImg(code, 1, 32) + '</div>' +
```

Size increases from 24px → 32px. The illustrated icons benefit from more space — detail (raindrops, snow crystals) becomes legible at 32px but lost at 24px. `isDay` hardcoded to `1` — day variants are conventional for multi-day forecasts.

---

### Step 5 — No other changes needed

- **Lucide** remains for all non-weather icons throughout the app (nav, UI elements, condition tags, hazard cards, etc.). `luIcon()` and `syncIcons()` are unchanged.
- **`WMO_ICON`** can be left in place or removed — no longer referenced after this change.
- **`WMO_EMOJI`** is already dead code — can be removed or left.
- **No CDN `<script>` tag** needed in `<head>` — `<img>` tags fetch from the CDN directly.
- **`sw.js`:** Network-first strategy means cached pages automatically pick up new icons on next load. No cache-busting needed.

---

### Verify

Force State B (set a location). Check:

1. **Today tab hero:** 64px illustrated weather icon replacing the previous line icon. Test day/night: force `is_day = 0` in devtools and confirm night variants load (`clear-night`, `partly-cloudy-night`, etc.).
2. **Weather tab → 5-day forecast:** Each row shows a 32px illustrated icon appropriate to its WMO code. All day variants.
3. **Fallback:** Confirm `not-available.svg` renders gracefully for an unknown code — no layout break.
4. **All Lucide icons intact:** Nav, condition tag chips, hazard cards, filter sheet — confirm nothing broken.
5. **Dark mode:** Meteocons are coloured SVGs — they do not respond to CSS `color`. This is correct and intentional; the illustrated icons look fine on dark backgrounds without any colour override.

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| FIX 11.1 | Sticky tab title bar — one CSS addition to `.tab-title-bar` | Trivial |
| FIX 11.2 | "↑ Picks" anchor pill — fixed button, IntersectionObserver, smooth scroll | Low (~30 min) |
| FIX 11.3 | Missing Dog "Coming Soon" card in Me tab — static HTML + CSS, no JS | Trivial (~15 min) |
| FIX 11.4 | Meteocons weather icons — `WMO_METEOCON` lookup, `meteoconImg()` helper, two render call updates | Low (~45 min) |

All four changes are independent. No changes required to `sw.js`, `manifest.json`, or light-mode styles (beyond what is specified above).
