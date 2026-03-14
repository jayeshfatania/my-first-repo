# Sniffout v2 — Phase 1 Validation Report
*Validator review against: phase1-build-brief.md, copy-review.md, design-spec.md, mockup.html*
*File reviewed: sniffout-v2.html (~2010 lines)*
*Date: 2026-03-14*

---

## Summary

Phase 1 is **not yet shippable**. The CSS token system and typography are correct. The walk card structure is built. However there are critical copy deviations, a spec violation on State A preview cards, badge colouring errors, a schema gap, and emoji-icon nav that doesn't match the mockup. All items below are specific and actionable.

---

## 1. Critical — Fix Before Review

### 1.1 Page title wrong
**Line 6**
```
Current:  Sniffout — Discover great walks
Required: Sniffout — Dog walks & weather for the UK
```

### ~~1.2 Hero headline wrong~~ — RETRACTED
**This item was incorrect.** `Discover great walks` is the confirmed hero headline — owner sign-off recorded in developer-questions.md Part 1. The validator's instruction to change it to `Find your next great walk.` was wrong. Do not action this item. The headline in the build is correct.

### 1.3 State A preview cards — lock overlay must be removed; use gradient placeholder
**Lines 1137–1158**

Current implementation shows emoji icons (🦌, 🌊) centred in the photo area with a `📍 Set your location to unlock walks` text overlay. This pattern is not in the mockup and the brief explicitly says preview cards must "look intentional — like real cards seen through frosted glass, not loading placeholders."

Required behaviour per mockup:
- Photo area: CSS gradient background (`.grad-forest`, `.grad-coastal` style classes — or simply `background: var(--brand)`)
- A dark mute overlay (e.g. `rgba(0,0,0,0.25)`) over the gradient
- Off-lead badge top-left, heart top-right — same as a live walk card
- Card body (name, meta, tags) readable below
- **No lock overlay. No emoji icon. No "Set your location" copy.**

State A preview cards use the brand-green tint treatment on the card *body* container per section 8 of the brief: `background: rgba(30,77,58,0.06)` and `border: 1px solid rgba(30,77,58,0.15)`. Confirm this is applied to `.preview-card` (not just the photo area).

### 1.4 Walk card badge — all badges render as amber, spec requires type-specific colours
**CSS ~line 658, JS line 1553**

Current CSS:
```css
.walk-card-badge { background: var(--amber) }
```

Required per phase1-build-brief.md Section 7:
- `Sniffout Pick` → brand-green fill (`var(--brand)`, white text)
- `Nearby` → neutral grey fill (e.g. `#6B6B6B`, white text)
- `Popular`, `Hidden gem`, `New` → amber fill (keep current colour)

Fix: Replace the single `.walk-card-badge` rule with badge-type variants. In `walkCardHTML()` (line 1553) add a CSS class based on `w.badge` value, e.g. `walk-card-badge--pick`, `walk-card-badge--nearby`.

### 1.5 Walk card tags show generic tags array, not off-lead/livestock chips
**Line 1555**

```js
// Current
const tags = w.tags.slice(0,3).map(t => '<span class="tag-chip">' + t + '</span>').join('');

// Required per brief Section 7
// Show: off-lead status tag + livestock flag (only if livestock: true)
// e.g. "Full off-lead", "Partial off-lead", "On-lead only" + "Livestock present"
```

### 1.6 🐾 emoji used outside paw safety block — two violations
**Lines 1222 and 1713**

```
Line 1222: <button class="cat-chip" onclick="switchCat('petshop',this)">🐾 Pet Shops</button>
Line 1713: petshop:{label:'🐾 Pet Shops', emoji:'🐾', ...}
```

Brief: *"Paw emoji (🐾) must not appear anywhere outside of the paw safety block. Remove all other instances."*
Replace with a neutral dog/paw SVG icon, or remove the emoji entirely from the label/chip.

---

## 2. Design Issues — Match Spec

### 2.1 Bottom nav uses emoji icons — mockup requires SVGs
**Lines 1247, 1251, 1255, 1259, 1263**

Current:
```html
<span class="nav-icon">🏠</span>  <!-- Today -->
<span class="nav-icon">☁️</span>  <!-- Weather -->
<span class="nav-icon">🐕</span>  <!-- Walks -->
<span class="nav-icon">📍</span>  <!-- Nearby -->
<span class="nav-icon">👤</span>  <!-- Me -->
```

Mockup uses inline SVG icons with filled/outlined variants for active/inactive states. Nav labels (Today · Weather · Walks · Nearby · Me) are correct. Replace emoji with SVG icon pairs — one filled for active, one outlined for inactive — per active state CSS.

### 2.2 Today State B nearby walk cards use emoji icon, not imageUrl
**Line 1816**

```js
'<div class="today-walk-photo">' + w.icon + '</div>'
```

Should use the same `imageUrl` → brand-green fallback pattern as the main walk card (line 1556). Brand-green background is already on `.walk-card-photo` — reuse that logic or a shared helper.

### 2.3 Walk card empty-image fallback shows emoji at 35% opacity, not clean brand-green
**CSS line 657, JS line 1556**

```css
.walk-card-photo-icon { font-size: 3rem; opacity: .35; z-index: 1 }
```

The `.walk-card-photo` background is correctly `#1E4D3A` (line 649). But the emoji at 35% opacity is still rendered over it. Brief says: "solid `#1E4D3A` brand-green background — no broken image, no grey box." Remove the emoji element entirely when `imageUrl` is empty. Just let the brand-green background show.

---

## 3. Data Schema — Fix WALKS_DB

### 3.1 `imageUrl` field missing from all WALKS_DB entries
`imageUrl` appears only in the two render functions (lines 1556, 1646) — it is not present in any WALKS_DB entry. Every entry must include `imageUrl: ""` per the Phase 1 schema. Without it, `w.imageUrl` evaluates as `undefined` (falsy), so the fallback renders correctly for now, but the schema is non-compliant.

Fix: Add `imageUrl:""` to all 50+ WALKS_DB entries.

### 3.2 `icon` field present in WALKS_DB entries — not in v2 schema
WALKS_DB entries still have `icon: "🦌"`, `icon: "🌊"` etc. The v2 schema (brief Section 6) does not include `icon`. Remove this field from all entries once `imageUrl` is added and the emoji fallback is removed from render functions.

Note: Until the emoji fallback is removed from `walkCardHTML()` and `renderTodayStateB()`, removing `icon` will break the fallback path. Remove `icon` last, after fixing 2.2 and 2.3 above.

---

## 4. Copy Issues — Approved Strings Not Implemented

### 4.1 All 11 walkRec verdict strings are wrong
**Lines 1435–1449**

Every verdict title and body differs from the approved strings in copy-review.md Section 6. Replace the full `walkRec()` function output with the approved strings below:

| Condition | Required title | Required body |
|-----------|---------------|---------------|
| Storm | `⛈️ Not a walk day` | `There's a thunderstorm. Stay in — your dog would rather be safe than soggy.` |
| Very windy (≥50 km/h gusts) | `💨 Too gusty to be out` | `Gusts of [X] km/h today — enough to cause problems on exposed routes. Worth waiting for it to ease.` |
| Rain + cold | `🥶 Wet and cold — make it a quick one` | `Rain plus cold is hard going. A short loop is fine, but wrap up and don't hang about.` |
| Rain | `☔ It's raining — but walkable` | `Not ideal, but fine if you're dressed for it. Stick to shorter routes and dry off your dog when you're back.` |
| Fog | `🌁 Foggy out there` | `Stick to familiar routes and keep your dog close. Low visibility means less reaction time for drivers on lanes and bridleways.` |
| Cold (feelsLike <2) | `❄️ Brisk walk day` | `Feels like [X]°C. Fine for a quick outing — just watch for ice on paths, and rinse paws when you're home if there's been gritting.` |
| Hot (feelsLike >28) | `🌡️ Warm today — timing matters` | `At this temperature, pavement can get hot enough to burn paws. Walk in the morning or evening, bring water, and do the 7-second test before setting off.` |
| High UV (≥6) | `☀️ Good walking — strong UV` | `Lovely out, but UV is [X]. Walk in the shade where you can, and press your hand on the pavement before you start — if it's too hot to hold for 7 seconds, it's too hot for paws.` |
| Rain arriving soon | `🌂 Dry for now — rain arriving` | `Good window right now, but heavy rain is forecast within 3 hours. If you're going, go soon.` |
| Rain likely | `🌧️ Showers on the way` | `Dry now, but worth a jacket. A shorter walk while the window's open.` |
| Perfect | `🌤️ Lovely walking weather` | `[X]°C and [condition]. About as good as it gets — get out there.` |

### 4.2 All 8 hazard warning titles are wrong
**Lines 1455–1462**

| Condition | Current title | Required title |
|-----------|--------------|----------------|
| Extreme heat | `Extreme heat — consider skipping the walk` | `🌡️ Too hot to walk safely` |
| Hot | `It's hot — take precautions` | `☀️ Hot enough to hurt paws` |
| Thunderstorm | `Thunderstorm — stay indoors` | `⛈️ Thunderstorm warning — stay inside` |
| Dangerous gusts (≥60) | `Dangerous gusts — do not walk` | `💨 Dangerous winds — don't go out` |
| Strong gusts (≥45) | `Very strong gusts — be careful` | `💨 Very gusty — choose sheltered routes` |
| Dangerous cold | `Dangerous cold — keep it very short` | `🧊 Very cold — brief outings only` |
| Freezing | `Freezing temperatures — paw care needed` | `❄️ Freezing — watch for grit and ice` |
| High UV | `Very high UV — protect your dog` | `🔆 Strong UV — pale and thin-coated dogs at risk` |

Hazard tip body bullet points are approved as-is per copy-review.md Section 7.

### 4.3 Paw safety title and body wrong
**Lines 1517–1519**

```js
// Current
if (t > 25)  title = '🐾 Hot pavement warning — check before you walk'
if (t < 0)   title = '🐾 Ice risk — paw care needed'
else         title = '🐾 Paws safe at ' + t + '°C'  // ← this one is correct
             body  = 'Ground temperature is comfortable. Place your hand on tarmac...'

// Required (copy-review.md Section 8)
if (t > 25)  title = '🐾 Too hot for paws'             // Danger state
if (t < 0)   title = '🐾 Paw check needed'             // Caution state
else         title = '🐾 Paws safe at ' + t + '°C'   // Safe state — correct

// Safe state body (required):
'At [X]°C, pavement is fine. If it gets above 25°C, press your hand on the tarmac — if you can\'t hold it for 7 seconds, it\'s too hot for your dog\'s paws.'
```

### 4.4 Rain section — two strings wrong
**Lines 1501–1502**

```js
// Line 1501 — Brief showers body
Current:  '(~' + rainHours + 'h). Plan around the dry windows.'
Required: '— about ' + rainHours + ' hour. The dry windows are worth planning around.'

// Line 1502 — Rainy ahead title + body
Current:  '<strong>Rainy ahead</strong> — ' + rainHours + 'h of rain, up to ' + totalPrecip.toFixed(1) + 'mm expected.'
Required: '<strong>Wet afternoon</strong> — ' + rainHours + ' hours of rain, up to ' + totalPrecip.toFixed(1) + 'mm forecast. Best to walk early.'
```

### 4.5 Best walk window strings wrong
**Line 1488**

```js
// Good conditions — current
'Best time to walk today: <strong>' + best.label + '</strong> · ' + best.feels + '°C feels-like · ' + best.rain + '% rain chance'
// Required
'Best window today: <strong>' + best.label + '</strong> · ' + best.feels + '°C · ' + best.rain + '% chance of rain'

// Poor conditions — current
'☔ Best available window today: <strong>' + best.label + '</strong> · ...'
// Required
'Best option today: <strong>' + best.label + '</strong> — but still ' + best.rain + '% chance of rain. Take a coat.'
```

### 4.6 Search error message wrong
**Line 1134**

```
Current:  Couldn't find that location. Try a postcode like SW11 or a place name.
Required: We couldn't find that — try a postcode (e.g. SW11) or a place name.
```

### 4.7 Walks tab empty state wrong
**Line 1598**

```
Current:  No walks match your filters.\nTry clearing the search or changing the filter.
Required: Nothing matching those filters right now. Show all walks →
```
Note: "Show all walks →" should act as a button/link that clears all active filters.

### 4.8 Me tab empty state wrong
**Line 1772**

```
Current:  Tap the 🤍 on any walk to save it here.
Required: Heart any walk to save it here.
```

---

## 5. Polish — Lower Priority

### 5.1 "free" in walk descriptions — confirm not a product promise
The grep for `free` returns matches only within WALKS_DB walk descriptions (lines 1282–1351 area) — e.g. "livestock-free", "dogs run free". These are descriptive, not product promises. No action required unless any instance reads as a marketing claim — scan manually to confirm.

### 5.2 Walks tab "Dry" rain summary has trailing period inconsistency
**Line 1499**
```
Current:  '<strong>Looks dry</strong> for the rest of today.'
Approved: '<strong>Looks dry</strong> for the rest of today'
```
Trailing full stop not in the approved string. Remove it.

### 5.3 State A preview cards show generic tags, not off-lead/livestock chips
**Lines 1145, 1155**
Preview cards show `Royal Park`, `Deer`, `Wildlife` tag chips. These should show the approved tag chip types (off-lead status, livestock) consistent with real walk cards per Section 7 of the brief — even in the preview state.

---

## 6. Confirmed Correct

The following items pass validation:

- ✅ CSS token set (`--brand`, `--bg`, `--surface`, `--border`, `--ink`, `--ink-2`, `--amber`, `--red`) — correct values
- ✅ Dark mode via `body.night` — retained and functional
- ✅ Inter font — loaded at 400/500/600/700 from Google Fonts CDN
- ✅ No glassmorphism (`backdrop-filter`, blur, translucent surfaces) — removed
- ✅ Walk card photo area — 180px height, `background: #1E4D3A` placeholder
- ✅ Walk card border radius — `16px`
- ✅ Walk card border — `1px solid var(--border)` on `var(--bg)` page background
- ✅ Bottom nav labels — Today · Weather · Walks · Nearby · Me ✅
- ✅ Active tab indicator — correct CSS class toggling
- ✅ State A subline — `Handpicked walks. Live conditions.` ✅
- ✅ State A body copy — `50+ handpicked UK walks with terrain, off-lead and livestock info...` ✅
- ✅ Social proof strip — `50+ handpicked UK walks · Works offline · Dog-specific routes` ✅
- ✅ Meta description — correct per approved strings
- ✅ Walk card heart icon — top-right of photo area ✅
- ✅ Walk card metadata row — distance · duration · difficulty ✅
- ✅ Walk card badge position — top-left of photo area ✅
- ✅ imageUrl render logic — lazy-loaded img if present, fallback if empty ✅
- ✅ WALKS_DB new schema fields present — `offLead`, `livestock`, `terrain`, `difficulty`, `badge`, `rating`, `reviewCount`, `distance`, `duration`, `source` all present in entries checked
- ✅ `isPushchairFriendly` — not found in file ✅
- ✅ Prohibited strings `no sign-up`, `no account`, `no login` — not found in file ✅
- ✅ No Community tab — five tabs only ✅
- ✅ No onboarding overlay ✅
- ✅ Em dashes in copy (`—`) — used correctly throughout
- ✅ `sw.js` and `manifest.json` — not modified ✅
- ✅ `dog-walk-dashboard.html` — not modified ✅

---

## Fix Priority Order

1. **Copy: walkRec verdict strings** (4.1) — highest user-facing impact
2. **Critical: hero headline** (1.2) and **page title** (1.1) — basic identity
3. **Critical: State A preview cards** (1.3) — most visible spec violation
4. **Critical: badge colours** (1.4) and **tag chips** (1.5)
5. **Copy: hazard titles** (4.2), **paw safety** (4.3), **rain section** (4.4)
6. **Critical: 🐾 emoji violations** (1.6)
7. **Design: nav SVG icons** (2.1) and **emoji fallback cleanup** (2.2, 2.3)
8. **Data: add `imageUrl: ""` to all WALKS_DB entries** (3.1), then remove `icon` (3.2)
9. **Copy: search error** (4.6), **empty states** (4.7, 4.8), **best walk window** (4.5)
10. **Polish items** (5.x)
