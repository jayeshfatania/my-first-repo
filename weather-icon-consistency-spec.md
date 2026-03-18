# Weather Icon Consistency Spec
**Component:** Weather icon on Today tab and Weather tab
**Issue:** Icon jumps position and size when switching between tabs
**Relates to:** weather-hero-fix.md (Weather tab margin-top fix)

---

## Current State — What's Different Between Tabs

| | Today tab | Weather tab |
|---|---|---|
| **Class** | no class — `<img>` inside `.weather-hero-top > div` | `.wx-hero-icon` |
| **Icon size** | 64px | 72px |
| **Temperature font-size** | 36px | 80px |
| **Container alignment** | `align-items: flex-start` | `align-items: flex-start` |
| **Icon margin-top** | none (0px) | `8px` (bugged — should be 14px) |
| **Icon background** | brand-green card | white/off-white page |

Two problems compound each other:
1. **Different sizes (64px vs 72px)** — the icon visually jumps scale when switching tabs.
2. **Different vertical offset (0px vs 8px, itself incorrect)** — the icon sits at a different optical position relative to the temperature text on each tab.

---

## The Alignment Principle

Both tabs use `align-items: flex-start`. The temperature text's visible cap top does not sit at y=0 of the flex row — Inter's ascender metrics leave a blank gap above the cap. The icon needs a `margin-top` that matches that gap so the icon's visual top optically aligns with the numeral's visual top.

This gap scales with font-size:
- At **36px** (Today tab): Inter's ascender blank above the cap ≈ **6px**
- At **80px** (Weather tab): Inter's ascender blank above the cap ≈ **12–14px** (per weather-hero-fix.md)

The fix is the same logical operation on both tabs: `margin-top = cap-height offset for that font-size`.

---

## Icon Size Recommendation

Increase both icons by one step:

| | Current | Recommended |
|---|---|---|
| Today tab | 64px | **72px** |
| Weather tab | 72px | **80px** |

**Rationale:**
- 72px next to 36px text fills the Today card's top-right corner with more presence. The brand-green card has enough visual space.
- 80px next to 80px text on the Weather tab is a natural pairing — icon height matches font-size, making the hero row feel anchored and balanced.
- The size difference between tabs (72px vs 80px) is intentional: the Weather tab is the dedicated weather screen and earns a larger icon; the Today card is a compact preview.

---

## Developer Instructions — Exact Changes

### Today tab

**1. Change icon size in `renderTodayStateB()`:**

```js
// Before
'<div>' + yrIcon(cur.weather_code, cur.is_day, 64) + '</div>'

// After
'<div>' + yrIcon(cur.weather_code, cur.is_day, 72) + '</div>'
```

**2. Add CSS for Today icon offset:**

```css
/* Add to the Today-tab styles block */
.weather-hero-top img {
  width: 72px;
  height: 72px;
  margin-top: 6px;
  flex-shrink: 0;
}
```

The `margin-top: 6px` compensates for Inter's ascender gap above the cap at 36px, placing the icon's visual top optically level with the numeral's visible top.

---

### Weather tab

**Update `.wx-hero-icon` CSS:**

```css
/* Before */
.wx-hero-icon {
  width: 72px;
  height: 72px;
  margin-top: 8px;
  flex-shrink: 0;
}

/* After */
.wx-hero-icon {
  width: 80px;
  height: 80px;
  margin-top: 14px;
  flex-shrink: 0;
}
```

No JS change needed — the Weather tab icon size is controlled entirely by CSS.

---

## If the Icon Has Internal SVG Padding

Yr.no icons may have whitespace inside their bounding box (the visual content starts below the SVG's top edge). If after applying these values the icon still looks high, increase `margin-top` by 2–4px on the affected tab only.

Quick test: in DevTools, add `outline: 1px solid red` to the icon. If there is visible space between the red outline's top and the start of the actual graphic, increase `margin-top` until the graphic's visual top aligns with the numeral's cap.

Expected adjustment range if needed:
- Today tab: `6px` → `8–10px`
- Weather tab: `14px` → `16–18px`

---

## Summary

| | Today tab | Weather tab |
|---|---|---|
| Icon size | `72px` | `80px` |
| `margin-top` | `6px` | `14px` |
| Container | `align-items: flex-start` (no change) | `align-items: flex-start` (no change) |
| JS change | `yrIcon(..., 72)` | none |
| CSS selector | `.weather-hero-top img` | `.wx-hero-icon` |

Both tabs now use the same alignment logic — icon top optically meets numeral cap top — scaled to their respective font sizes. The switch between tabs will feel continuous rather than jarring.
