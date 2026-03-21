# Badge Icons Spec
**Date:** 2026-03-19
**Status:** Ready for Developer implementation

All icons use `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. Drop the full SVG wrapper into any HTML context — the icon inherits colour from the parent element via `currentColor`.

---

## 1. Leads On
**Category:** Explorer

**What it depicts:** The handle loop of a dog lead — an oval grip at top-left with a diagonal strap extending to a small rectangular clip at the bottom right. Immediately recognisable as a leash, not a generic run icon.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="8" cy="7" rx="4" ry="5"/>
  <line x1="12" y1="10" x2="19" y2="18"/>
  <rect x="17.5" y="17" width="3.5" height="4" rx="1"/>
</svg>
```

---

## 2. Good Mileage
**Category:** Explorer

**What it depicts:** A winding trail viewed from above — two circular waypoints (start and end) connected by a smooth S-curve path. The shape suggests real ground covered between two points, not a loop.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="4" cy="18" r="2"/>
  <path d="M6 18 C8 18 9 14 12 13 S17 9 18 8"/>
  <circle cx="20" cy="7" r="2"/>
</svg>
```

---

## 3. Creature of Habit
**Category:** Explorer

**What it depicts:** A calendar page with a small circular repeat arrow inside the body — combining the "weekly" frame (calendar) with the "return/routine" concept (cycle arrow). Four weeks is the trigger; the cycle arrow inside the calendar communicates both.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <path d="M8.5 17a3.5 3.5 0 1 0 3.5-3.5"/>
  <polyline points="8.5 13.5 8.5 17 12 17"/>
</svg>
```

---

## 4. Good Report
**Category:** Contributor

**What it depicts:** A condition tag — the classic price-tag shape with a punched hole, suggesting a label attached to a walk report. The hole is rendered as a dot using a round-capped zero-length line stroke.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/>
  <line x1="7" y1="7" x2="7.01" y2="7"/>
</svg>
```

---

## 5. Reliable Scout
**Category:** Contributor

**What it depicts:** A compass — the classic circular compass face with a diamond needle pointing to the cardinal directions. Scout imagery without needing to illustrate a dog or a path. The needle form (V-shape with opposing tip) is the Lucide compass pattern.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
</svg>
```

---

## 6. Trail Keeper
**Category:** Contributor

**What it depicts:** A two-directional trail signpost — a vertical post with one arrow pointing right (upper) and one pointing left (lower), the shape of a trail junction marker. Distinct from the compass and immediately associated with maintained footpaths.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="2" x2="12" y2="22"/>
  <path d="M12 7 H17 L20 10 L17 13 H12"/>
  <path d="M12 13 H7 L4 16 L7 19 H12"/>
</svg>
```

---

## 7. Honest Bark
**Category:** Contributor

**What it depicts:** A speech bubble with a sound waveform inside — three oscillations of a wave running across the interior of the bubble. The waveform makes this unmistakably a "bark" rather than a text message; it reads as voice, not chat.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  <path d="M8 10 C9 8 10 12 11 10 C12 8 13 12 14 10 C15 8 16 12 17 10"/>
</svg>
```

---

## 8. Discerning Nose
**Category:** Community

**What it depicts:** A dog nose (wide horizontal ellipse, proportioned as a real nose rather than a generic circle) with three sniff indicators above it — a short upward-left curl, a straight vertical line, and a mirror upward-right curl. The asymmetry of the curls reads immediately as sniffing rather than generic decoration.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="12" cy="16" rx="5" ry="3"/>
  <path d="M6 11 C5 8 8 6 9 9"/>
  <line x1="12" y1="11" x2="12" y2="6"/>
  <path d="M18 11 C19 8 16 6 15 9"/>
</svg>
```

---

## 9. Found a Good One
**Category:** Community

**What it depicts:** A map pin (teardrop location marker) with a three-line asterisk/sparkle inside instead of the standard circle. The sparkle replaces the hole — turning a location marker into a discovery marker. Distinctive from a plain map pin; the asterisk reads as "special find" not just "location."

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
  <line x1="12" y1="7" x2="12" y2="13"/>
  <line x1="9.1" y1="8.5" x2="14.9" y2="11.5"/>
  <line x1="14.9" y1="8.5" x2="9.1" y2="11.5"/>
</svg>
```

---

## 10. Voice of the Pack
**Category:** Community

**What it depicts:** A megaphone (speaker cone with two outward sound arcs) — the "voice" metaphor is unambiguous, and the two arcs suggest projection at scale, fitting for a badge about reaching other walkers. This is the most visually powerful of the 10 icons and intentionally so: it is the hardest badge to earn.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
</svg>
```

---

## Design notes for the Developer

**Rendering size.** All 10 icons are designed for 32px minimum display size. At 32px, each unit of the 24×24 viewBox renders at 1.33px. The stroke-width of 1.5 viewBox units renders at 2px physical — the floor for legibility on retina.

**Colour.** All icons use `stroke="currentColor"` and `fill="none"`. Set colour on the parent container. The brand green (`#1E4D3A`) is the default earned state. For any future unearned state (not part of the current spec), a muted `var(--ink-2)` at reduced opacity would work.

**The dot in badge 4.** The `<line x1="7" y1="7" x2="7.01" y2="7"/>` in Good Report renders as a dot when `stroke-linecap="round"` is set on the parent. This is the standard Lucide pattern for a point indicator. Do not change it to a `<circle>` — a zero-radius circle with `fill="none"` renders nothing.

**Fills in badge 6.** The two arrow paths in Trail Keeper are open strokes, not closed fills. This is intentional — a filled arrowhead at 32px would be too heavy and would compromise the visual weight consistency with the other 9 icons.
