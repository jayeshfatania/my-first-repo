# Sniffout — Card Design Update & Weather Icon Recommendation
*Issued by Designer. March 2026.*
*Covers two issues: weather icon replacement and trail card declutter.*
*For Developer — Round 11.*

---

## Issue 1 — Weather Icon Replacement

### Problem

The current Basmilius Meteocons (`fill/svg-static` variant from `bmcdn.nl`) use a fully illustrated style: coloured fills, gradient shadows, and animated states. Against Sniffout's clean card-based design — white surfaces, muted greens, `var(--bg): #F7F5F0` — these icons look out of register. They belong in an app with a lush illustrated visual language; they don't match a minimal, professional PWA.

The brief asks for **line icons with selective colour accents, not fully illustrated** — the BBC Weather register. Clean shapes, a flat sun, simple blue rain drops, grey clouds.

---

### Icon Set Evaluation

#### Option A — Yr.no Weather Symbols *(Recommended)*

| Property | Details |
|----------|---------|
| Style | Flat SVG icons with selective colour accents — sun is yellow, rain blue, clouds grey |
| BBC Weather match | ✅ Closest — this is the same clean, flat "national weather service" aesthetic |
| Day/Night variants | ✅ `01d.svg` / `01n.svg` naming pattern; three style variants (lightmode / darkmode / shadows) |
| Light + dark mode | ✅ Dedicated `lightmode` and `darkmode` style variants match Sniffout's day/night split exactly |
| WMO code alignment | ✅ Best of all options — Yr.no (Norwegian Meteorological Institute) co-developed the WMO code set used by Open-Meteo |
| CDN | ✅ jsDelivr GitHub CDN |
| Maintained | ✅ Active — v8+ available |
| License | MIT |

**CDN base:** `https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/`

**File naming:** `{code}{variant}.svg` where variant is `d` (day), `n` (night), or absent (condition has no day/night difference). Examples: `01d.svg`, `01n.svg`, `04.svg`, `09.svg`, `15.svg`.

**Style variant path:** Include style variant in path to get lightmode or darkmode icons:
- Light mode: `https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/` (base — lightmode default)
- Dark mode: available in a `darkmode/` subdirectory (Developer to confirm exact path against the GitHub repo at `nrkno/yr-weather-symbols`)

**Note for Developer:** Verify the exact directory structure against the npm package or GitHub repo before implementing. The jsDelivr path may be `dist/svg/` or `dist/symbols/lightmode/`. Pin to a specific version (e.g. `@8.0.1`) to avoid breaking changes.

---

#### Option B — Basmilius Line Variant (Quick Fix)

| Property | Details |
|----------|---------|
| Style | Outline/stroke icons — same detailed shapes as fill variant but without colour fills or shadows |
| BBC Weather match | ⚠️ Better than current, but still uses complex cloud shapes and detailed stroke paths — more illustrative than Option A |
| CDN | ✅ Same `bmcdn.nl` CDN, different path |
| Code change | Minimal — one URL change in `METEOCON_BASE` |
| Day/Night variants | ✅ Same as current mapping |

**CDN path:** Replace `fill/svg-static` with `line/svg-static` in `METEOCON_BASE`:
```js
// Current:
var METEOCON_BASE = 'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg-static/';
// Line variant:
var METEOCON_BASE = 'https://bmcdn.nl/assets/weather-icons/v3.0/line/svg-static/';
```

This is a one-line fix. Same filenames, same `WMO_METEOCON` lookup table. Ships in minutes. Significantly cleaner than the current fill variant — shadows and gradients disappear. The icons still have slightly complex shapes but no longer look cartoonish.

**Recommended as an interim fix** if Option A implementation is deferred to a later session.

---

#### Option C — Erik Flowers Weather Icons

| Property | Details |
|----------|---------|
| Style | Icon font — CSS class-based, not SVG |
| Colour | Monochrome only — no selective colour accents |
| Maintained | ❌ Last release 2015 |
| CDN | ✅ cdnjs available |
| Verdict | Does not meet "selective colour accents" requirement. Ruled out. |

---

#### Option D — QWeather Icons

| Property | Details |
|----------|---------|
| Style | Coloured SVG with accents — similar register to Yr.no |
| CDN | ✅ jsDelivr npm |
| Code mapping | ⚠️ Uses QWeather API codes (not WMO codes) — mapping table would need to be built from scratch |
| Verdict | Valid option but WMO-to-QWeather code mapping is an additional translation layer. No advantage over Yr.no for Sniffout's data source. |

---

### Recommendation: Yr.no Weather Symbols

**Implement Option A** (Yr.no) in Round 11. If the path verification takes time, ship the **Option B line-variant quick fix first** and replace with Yr.no in the same session or a subsequent round.

The alignment between Yr.no's icon design, its dedicated lightmode/darkmode variants, and Sniffout's `body.night` dark mode architecture is the decisive factor. The WMO code co-authorship means there are no ambiguous condition mappings.

---

### WMO → Yr.no Symbol Mapping Table

Developer reference. These mappings replace the current `WMO_METEOCON` lookup.

| WMO Code | Condition | Day symbol | Night symbol |
|----------|-----------|-----------|-------------|
| 0 | Clear sky | `01d` | `01n` |
| 1 | Mainly clear | `02d` | `02n` |
| 2 | Partly cloudy | `03d` | `03n` |
| 3 | Overcast | `04` | `04` |
| 45, 48 | Fog | `15` | `15` |
| 51, 53 | Light/moderate drizzle | `46` | `46` |
| 55 | Dense drizzle | `09` | `09` |
| 56, 57 | Freezing drizzle | `12` | `12` |
| 61, 63 | Light/moderate rain | `09` | `09` |
| 65 | Heavy rain | `10d` | `10n` |
| 66, 67 | Freezing rain | `12` | `12` |
| 71, 73 | Light/moderate snow | `13` | `13` |
| 75 | Heavy snow | `14` | `14` |
| 77 | Snow grains | `13` | `13` |
| 80, 81 | Rain showers | `40d` | `40n` |
| 82 | Violent rain showers | `41d` | `41n` |
| 85 | Snow showers | `44d` | `44n` |
| 86 | Heavy snow showers | `45d` | `45n` |
| 95 | Thunderstorm | `22d` | `22n` |
| 96, 99 | Thunderstorm with hail | `25d` | `25n` |

**Usage in code:** The existing `meteoconImg()` function passes `code` and `isDay`. The new function (`yrIcon()` or updated `meteoconImg()`) looks up the symbol from this table, appends `.svg`, and fetches from the jsDelivr CDN base.

```js
var YR_BASE = 'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols@8.0.1/dist/svg/';
// Verify this path against the actual repo before shipping

var WMO_YR = {
  0:  { day: '01d', night: '01n' },
  1:  { day: '02d', night: '02n' },
  2:  { day: '03d', night: '03n' },
  3:  { day: '04',  night: '04'  },
  45: { day: '15',  night: '15'  },
  48: { day: '15',  night: '15'  },
  51: { day: '46',  night: '46'  },
  53: { day: '46',  night: '46'  },
  55: { day: '09',  night: '09'  },
  56: { day: '12',  night: '12'  },
  57: { day: '12',  night: '12'  },
  61: { day: '09',  night: '09'  },
  63: { day: '09',  night: '09'  },
  65: { day: '10d', night: '10n' },
  66: { day: '12',  night: '12'  },
  67: { day: '12',  night: '12'  },
  71: { day: '13',  night: '13'  },
  73: { day: '13',  night: '13'  },
  75: { day: '14',  night: '14'  },
  77: { day: '13',  night: '13'  },
  80: { day: '40d', night: '40n' },
  81: { day: '40d', night: '40n' },
  82: { day: '41d', night: '41n' },
  85: { day: '44d', night: '44n' },
  86: { day: '45d', night: '45n' },
  95: { day: '22d', night: '22n' },
  96: { day: '25d', night: '25n' },
  99: { day: '25d', night: '25n' }
};

function yrIcon(code, isDay, size) {
  var entry = WMO_YR[code];
  var name  = entry ? (isDay === 0 ? entry.night : entry.day) : '04';
  return '<img src="' + YR_BASE + name + '.svg"'
    + ' alt="' + (WMO_DESC[code] || 'Weather') + '"'
    + ' width="' + size + '" height="' + size + '"'
    + ' style="display:block;flex-shrink:0;">';
}
```

Replace all calls to `meteoconImg(code, isDay, size)` with `yrIcon(code, isDay, size)`.

**The `METEOCON_BASE`, `WMO_METEOCON`, and `meteoconImg()` function are all removed** when Option A is shipped. The `WMO_EMOJI` and `WMO_ICON` (Lucide) maps are unchanged — they're used elsewhere.

**Forecast icon removal:** The `.forecast-icon img { background: ...; border-radius: 50%; padding: 6px; }` CSS adds a green circular background behind forecast icons. **Remove these properties** — the Yr.no icons have their own visual framing and the circle background was compensating for Meteocons' transparent backgrounds. With Yr.no, the raw icon should sit directly on the card surface.

---

## Issue 2 — Trail Card Declutter

### Problem

The `.trail-card-body` currently renders up to 8 elements: name, rating, meta, schema tag chips, condition tag chips, community disclaimer, description excerpt, and the walked button. On a 240px-wide card, this creates a card body approximately 180–250px tall. Combined with the 180px photo, total card height can reach 430px — nearly 60% of a standard iPhone's usable viewport for a single card.

The card is doing too much. It is showing information that belongs in the walk detail overlay, not in a browse carousel.

### Design Principle

> **The card's job is to make someone want to tap it. The detail's job is to answer their questions.**

The card is a hook. It needs walk name, just enough context to create intent, and the badge signal. Everything else — condition reports, ratings, written tags, full off-lead/terrain breakdown, mark as walked — lives in the detail overlay, surfaced when the user commits their attention by tapping.

---

### Revised Trail Card Body

#### Before (current elements in `.trail-card-body`)

```
1. Walk name           15px/600
2. Star rating         12px/amber  ← REMOVE
3. Meta: duration · distance  12px  ← CHANGE
4. Schema tags (3 chips max)  ← REDUCE to 2 max
5. Condition tag row (cond-chip)  ← REMOVE
6. Community disclaimer  ← REMOVE
7. Description excerpt (2 lines)  ← REMOVE
8. Walked button  ← REMOVE
```

#### After (revised elements in `.trail-card-body`)

```
1. Walk name           15px/600          ← unchanged
2. Meta: distance · difficulty  12px     ← simplified
3. 1–2 schema chips (priority order)     ← reduced
```

That is all. Three elements. The card body becomes approximately 80–90px tall. Total card height: ~270px — a clean, tappable card that doesn't dominate the carousel.

---

### Element-by-element specification

#### 1. Walk name — unchanged

```css
.trail-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
  line-height: 1.3;
  /* Add: max 2 lines, clamp */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

No change to font size or weight. Add 2-line clamp — walk names are long enough (e.g. "Malham Cove & Gordale Scar") that overflow without clamping would push the body taller.

#### 2. Meta row — revised

**Current:** `{duration} min · {distance} mi`
**Revised:** `{distance} mi · {difficulty}`

Duration is removed from the card meta. It is available in the detail overlay. Difficulty replaces it — it is a higher-value decision signal at browse time ("do I have time for a Hard walk right now?" comes after "do I want to walk at all?").

```js
// In renderTrailCard():
var metaText = walk.distance.toFixed(1) + ' mi · ' +
  walk.difficulty.charAt(0).toUpperCase() + walk.difficulty.slice(1);
```

```css
.trail-card-meta {
  font-size: 12px;
  color: var(--ink-2);
  margin-bottom: 6px;
}
```

No CSS change required — only the content string changes.

#### 3. Schema tags — reduced to 1 or 2 chips, priority order

**Current logic:** Shows off-lead chip + terrain chip (if non-mixed) + enclosed chip — potentially 3 chips, always wrapped.

**Revised logic:** Maximum 2 chips. Selection priority:
1. **Off-lead status** — always shown (highest decision value for dog owners)
2. **Enclosed** — shown if `walk.enclosed === true` (strong differentiator — overrides terrain chip)
3. **Terrain** — shown only if `walk.terrain !== 'mixed'` AND enclosed is false (third priority)

In practice, most cards will show 1 chip (off-lead) or 2 chips (off-lead + enclosed or off-lead + terrain). Never more than 2.

```js
// In renderTrailCard():
var ol = offLeadLabel(walk.offLead);
var chips = [];
chips.push('<span class="trail-tag' + (ol.cls ? ' ' + ol.cls : '') + '">' + ol.text + '</span>');

if (walk.enclosed) {
  chips.push('<span class="trail-tag">Enclosed</span>');
} else if (walk.terrain && walk.terrain !== 'mixed') {
  chips.push('<span class="trail-tag">' +
    walk.terrain.charAt(0).toUpperCase() + walk.terrain.slice(1) + '</span>');
}
// chips.length is always 1 or 2 — never more
```

#### 4. Rating — moved to detail only

Remove from `renderTrailCard()`. The `trail-card-rating` element is not rendered on the card.

Seeded ratings (all walks have ratings) are visible in the walk detail overlay — they surface when the user commits attention by tapping, not as ambient information while browsing.

#### 5. Condition tags — moved to detail only

Remove `cond-tag-row` and `.cond-disclaimer` from the card render path entirely.

The `renderCondTagRow(walkId)` function and `rerenderCondTagRow(walkId)` are called after tag submission to update the card. After this change, `rerenderCondTagRow()` no longer needs to update the card — it only needs to update the detail overlay if open.

**CSS classes `.cond-tag-row`, `.cond-chip`, `.cond-chip--hazard`, `.cond-chip--stale`, `.cond-chip-more`, `.cond-disclaimer` are no longer used on trail cards.** They remain in the stylesheet for the detail overlay, but are not rendered in `renderTrailCard()`.

#### 6. Description excerpt — moved to detail only

Remove `.trail-card-desc` from `renderTrailCard()`.

The description is valuable — it is the first thing a user reads in the detail overlay. On the card it adds 34px of height for content the user can access one tap away.

```css
/* .trail-card-desc — KEEP in CSS for the detail overlay render */
/* REMOVE from renderTrailCard() only */
```

#### 7. Mark as walked button — moved to detail only

Remove `.walked-btn` from `renderTrailCard()`.

The walked action is a deliberate post-walk interaction. It requires the user to think "I have walked this." That is a detail-level action, not a browse-level one. Moving it to the detail overlay also resolves the visual weight problem — a button inside a scroll carousel card adds noise.

The `.walked-btn` CSS and JS (`markAsWalked()`, confirmed state) are unchanged — they are retained for the detail overlay implementation.

---

### Updated `renderTrailCard()` structure

Full revised card HTML output:

```js
function renderTrailCard(walk) {
  var badgeHTML = walk.badge
    ? '<div class="trail-card-badge">' + walk.badge + '</div>'
    : '';

  var ol = offLeadLabel(walk.offLead);
  var chips = [
    '<span class="trail-tag' + (ol.cls ? ' ' + ol.cls : '') + '">' + ol.text + '</span>'
  ];
  if (walk.enclosed) {
    chips.push('<span class="trail-tag">Enclosed</span>');
  } else if (walk.terrain && walk.terrain !== 'mixed') {
    chips.push('<span class="trail-tag">' +
      walk.terrain.charAt(0).toUpperCase() + walk.terrain.slice(1) + '</span>');
  }

  var metaText = walk.distance.toFixed(1) + ' mi · ' +
    walk.difficulty.charAt(0).toUpperCase() + walk.difficulty.slice(1);

  return (
    '<div class="trail-card" onclick="onWalkTap(\'' + walk.id + '\')">' +
      '<div class="trail-card-photo">' +
        badgeHTML +
        '<button class="trail-heart" data-heart="' + walk.id + '" ' +
          'onclick="event.stopPropagation();toggleFavourite(\'' + walk.id + '\',this)">' +
          heartSVG(isFavourited(walk.id)) +
        '</button>' +
      '</div>' +
      '<div class="trail-card-body">' +
        '<div class="trail-card-name">' + escHtml(walk.name) + '</div>' +
        '<div class="trail-card-meta">' + metaText + '</div>' +
        '<div class="trail-card-tags">' + chips.join('') + '</div>' +
      '</div>' +
    '</div>'
  );
}
```

---

### Updated card body CSS

The `.trail-card-tags` needs `flex-wrap: nowrap` since we are capping at 2 chips — wrapping is no longer necessary and could cause layout issues on very narrow cards if a chip is long.

```css
.trail-card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;   /* changed from wrap */
  overflow: hidden;     /* clip if somehow still overflows */
}
```

Add 2-line name clamp (specified above). All other `.trail-card-*` CSS is unchanged.

---

### Revised card height estimate

| Element | Height |
|---------|--------|
| `.trail-card-photo` | 180px |
| `.trail-card-body` padding-top | 10px |
| `.trail-card-name` (1–2 lines) | 20–40px |
| `.trail-card-meta` | 16px + 6px margin |
| `.trail-card-tags` | 20px |
| `.trail-card-body` padding-bottom | 14px |
| **Total** | **~266–286px** |

Down from **~360–430px** in the current cluttered state. This is a 20–35% reduction in card height, allowing the carousel to show more of the next card's peek on a standard phone screen — reinforcing the horizontal scroll affordance.

---

### What moves to the walk detail overlay

Everything removed from the card is present in the detail overlay (Phase 2 — `onWalkTap()`). The detail overlay spec (`condition-tags-design-spec.md`) already accounts for these elements. Confirming the detail overlay contains:

| Element | Detail overlay section |
|---------|----------------------|
| Star rating + review count | Walk header |
| Duration | Walk meta |
| Full schema tags (all fields) | Walk details section |
| Description (full, not clamped) | Walk description section |
| Condition tags + timestamps | §4A — Condition tags section |
| Community disclaimer | §4A — adjacent to tags |
| Mark as walked button | §4E — below tags section |

No information is lost — it is promoted to the context where it belongs.

---

### Condition tag "freshness signal" on card — optional indicator

The card no longer shows condition tag content. However, there is a case for showing that condition reports *exist* — to drive taps into the detail.

**Optional: single dot indicator on the card when fresh tags exist**

If `getDisplayTags(walk.id).length > 0`, add a small dot badge to the card's bottom-right corner of the photo area. A 8px solid circle in `var(--brand)`, positioned `position: absolute; bottom: 8px; right: 38px` (left of the heart button).

```css
.trail-card-condition-dot {
  position: absolute;
  bottom: 8px;
  right: 38px;       /* to the left of the .trail-heart button */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
  border: 1.5px solid white;
}
```

This is the minimum viable signal — "there is recent community information about this walk." It does not add clutter. It creates a reason to tap.

**This dot indicator is optional** — the card works without it. The PO should decide whether the engagement benefit justifies the implementation. If approved, include in Round 11. If deferred, the card is complete without it.

---

### Summary of changes for Developer

| Change | File location | Type |
|--------|--------------|------|
| Remove `ratingHTML` from `renderTrailCard()` | JS — `renderTrailCard()` | Remove |
| Change meta to `distance · difficulty` | JS — `renderTrailCard()` | Edit |
| Reduce tags to max 2, priority order | JS — `renderTrailCard()` | Edit |
| Remove `trail-card-desc` from `renderTrailCard()` | JS — `renderTrailCard()` | Remove |
| Remove `condTagHTML` / `condDisclaimerHTML` from `renderTrailCard()` | JS — `renderTrailCard()` | Remove |
| Remove `.walked-btn` from `renderTrailCard()` | JS — `renderTrailCard()` | Remove |
| `rerenderCondTagRow()` — no longer updates carousel cards | JS | Remove card DOM update |
| `.trail-card-tags { flex-wrap: nowrap }` | CSS | Edit |
| `.trail-card-name` — add 2-line clamp | CSS | Edit |
| Replace `meteoconImg()` calls with `yrIcon()` | JS — weather render functions | Replace |
| Add `WMO_YR` lookup table | JS | Add |
| Add `yrIcon()` function | JS | Add |
| Remove `WMO_METEOCON`, `meteoconImg()`, `METEOCON_BASE` | JS | Remove |
| Remove `.forecast-icon img { background; border-radius; padding }` | CSS | Edit |
| Optional: add `.trail-card-condition-dot` | CSS + JS | Add |
