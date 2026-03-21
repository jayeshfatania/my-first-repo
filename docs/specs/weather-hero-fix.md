# Weather Hero Icon Alignment Fix
**Component:** Weather tab hero — temperature + icon row
**Issue:** 72px Yr.no icon sits visually off next to 80px temperature text
**Status:** Small fix — single CSS value change

---

## The Problem

The hero row uses `align-items: flex-start` with `margin-top: 8px` on the icon. The intent was to optically align the top of the icon with the top of the temperature numeral.

The problem: Inter's internal font metrics mean the visible cap-height of the numerals does not start at 0px from the top of the line box. At 80px font size with `line-height: 1`, the blank space above the cap of a capital numeral (due to Inter's ascender metrics) is approximately **11–13px**. The current `margin-top: 8px` undershoots this — the icon sits a few pixels above where the eye expects it to be relative to the number.

Additionally, the Yr.no icons themselves may carry internal SVG padding or whitespace, which compounds the misalignment.

---

## Recommended Fix

**Change `margin-top` on `.wx-hero-icon` from `8px` to `14px`.**

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
  width: 72px;
  height: 72px;
  margin-top: 14px;
  flex-shrink: 0;
}
```

This places the top of the icon at 14px — matching the approximate optical top of the 80px Inter numeral's cap height. The icon will appear to share its top edge with the visible top of the temperature number, not the invisible top of the line box.

---

## If 14px Still Looks Off

The exact value depends on whether the Yr.no icon has internal SVG padding. If the icon's visual content sits lower within its bounding box, the icon will still appear too high even after this fix.

**Test this:** open the browser inspector, inspect `.wx-hero-icon`, and temporarily add `outline: 1px solid red` to see where the 72×72 box sits. If the icon's visual content has internal top padding, increase `margin-top` further (try 16–18px) until the icon's visual top aligns with the numeral's visual top.

---

## Alternative: Centre Alignment

If the offset keeps being difficult to tune, switch to vertical centring instead of top alignment:

```css
/* Parent row */
.wx-hero-main {
  display: flex;
  align-items: center;    /* was: flex-start */
  justify-content: space-between;
}

/* Remove margin-top from icon */
.wx-hero-icon {
  width: 72px;
  height: 72px;
  margin-top: 0;          /* was: 8px / 14px */
  flex-shrink: 0;
}

/* Shift the temperature block up slightly to compensate for font internal whitespace */
.wx-hero-temp-block {
  margin-top: -8px;       /* pulls the number up so it reads as top-dominant */
}
```

The `margin-top: -8px` on the temperature block corrects for the fact that vertically centring an 80px text box includes its internal whitespace — without this correction, the numeral appears to sit slightly lower than the icon's centre.

**Recommendation:** try the `margin-top: 14px` fix first (primary recommendation). Only switch to the centre-alignment approach if the Yr.no icon's internal bounding box is making the top-alignment approach unpredictable.

---

## One Additional Tweak Worth Considering

While reviewing the hero layout: the `wx-hero-unit` (°C) element uses `margin-top: 8px` to drop it below the top of the temperature number. At 32px font size sitting next to 80px text, the unit currently has too much visual weight relative to the number.

Consider reducing the unit to **28px** and increasing its `margin-top` to **10px**. This makes the °C read more clearly as a modifier to the temperature rather than a competing element:

```css
.wx-hero-unit {
  font: 400 28px/1 'Inter', sans-serif;  /* was 32px */
  color: var(--ink-2);
  margin-top: 10px;                       /* was 8px */
}
```

This is optional and small — raise with the owner only if the temperature display is being reviewed anyway.
