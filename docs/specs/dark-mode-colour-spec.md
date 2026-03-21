# Sniffout — Dark Mode Colour Spec (Revised)
*Issued by Designer. March 2026.*
*Status: Awaiting PO review before Developer implementation.*
*Based on: current sniffout-v2.html dark mode audit.*

---

## Root Cause Analysis

The neon/mint problem has two sources. Fixing only one of them is insufficient.

**Source 1 — `--brand: #6EE7B7` is the wrong dark mode accent.**

`#6EE7B7` is Tailwind's `emerald-300`. Its properties:
- Hue: 152° (green)
- Saturation: **72%** — very high
- Lightness: **71%** — very high

High saturation + high lightness on dark surfaces = perceived neon glow. It is the right choice for neither a dark mode accent nor a surface tint. Every link, active nav item, icon, and chip in dark mode currently screams this colour.

For comparison, Citymapper and Monzo use dark mode accents with saturation in the 20–35% range at equivalent lightness — calm and readable, not glowing.

**Source 2 — Hardcoded `rgba(110,231,183,...)` values are not derived from the `--brand` token.**

There are 8 inline dark mode colour overrides that reference `rgb(110,231,183)` (i.e. `#6EE7B7`) directly:
- `.walk-preview-card` background and border
- `.weather-preview-card` background and border
- `.walk-preview-tag` background and text
- `.weather-preview-title` text
- `.today-conditions-card` background and border
- `.trail-tag` background

Because these are hardcoded (not `rgba(var(--brand),...)` — CSS doesn't work that way), changing `--brand` alone would leave all of these still glowing. **The Developer must update each of these instances explicitly.** A full substitution table is provided below.

**Source 3 — `rgba(30,77,58,...)` tints are designed for light mode and are wrong in dark mode.**

Many light-mode components use `rgba(30,77,58,0.1)` — a dark green at low opacity — for icon backgrounds, tag chips, and card tints. On white this creates the correct subtle sage tint. On dark surfaces (`#1A2C22`) the same value is nearly invisible (dark-on-dark) or creates inconsistent results depending on the surface. These need dark mode overrides with the new accent at slightly higher opacity to be perceptible.

---

## Design Principles for This Palette

1. **Backgrounds stay dark forest-green.** `#0F1C16` and `#1A2C22` are correct — thematically appropriate, well-chosen. They are not the problem.

2. **The accent earns its place.** In dark mode, brand colour appears only as text, icons, and interactive states — never as chip backgrounds unless the opacity is low enough to read as a *dark* tint, not a glowing surface.

3. **Sage, not mint.** The revised accent shifts from mint (high saturation, cool) to sage (low saturation, slightly warm-green). Sage reads as green without radiating.

4. **Secondary text reads neutral.** `--ink-2` in dark mode should look like a muted mid-grey with only the faintest green undertone. It currently looks too green, which compounds the "everything is green" feeling.

5. **Borders disappear into the surface.** A good dark mode border is barely there — it defines structure without competing with content. The current `#2A3D30` is too saturated to recede.

---

## Revised Token Values

### `--brand` (dark mode accent) — THE KEY FIX

| | Current | Revised |
|--|---------|---------|
| Hex | `#6EE7B7` | `#82B09A` |
| HSL | 152°, 72%, 67% | 155°, **21%**, 60% |
| Description | Neon mint | Muted sage |

**`#82B09A`** — RGB(130, 176, 154).

This is sage green. The saturation drops from 72% to 21%, removing the neon quality entirely. The lightness of 60% ensures it remains readable on dark surfaces (contrast ratio ~5.8:1 on `--surface`, ~7.1:1 on `--bg` — passes WCAG AA for normal text, approaches AAA).

It is unambiguously green — no one would call it grey — but it is calm, like foliage rather than a glow stick. This is the register used by Citymapper's teal, Monzo's coral, and Things 3's brand red in their respective dark modes.

---

### `--ink-2` (secondary text) — MINOR FIX

| | Current | Revised |
|--|---------|---------|
| Hex | `#8A9E92` | `#8B9690` |
| Description | Green-tinted mid-grey | Neutral mid-grey with faint green undertone |

**`#8B9690`** — RGB(139, 150, 144).

The current value `#8A9E92` has G=158 vs R=138 — a 20-point gap that makes it noticeably green-tinted. This means secondary text, metadata, and inactive labels all look green in dark mode, adding to the saturation overload.

`#8B9690` has G=150 vs R=139 — an 11-point gap, barely perceptible green undertone. It reads as neutral grey in context, which is correct for secondary text.

Contrast on `--surface` (`#1A2C22`): approximately 4.8:1 — passes AA for large text and UI components.

---

### `--border` — MINOR FIX

| | Current | Revised |
|--|---------|---------|
| Hex | `#2A3D30` | `#263530` |
| Description | Saturated dark green | Near-neutral dark separator |

**`#263530`** — RGB(38, 53, 48).

The current border `#2A3D30` (RGB 42, 61, 48) has G=61 vs R=42 — 19-point gap. Borders aren't interactive, so they shouldn't register as a colour; they should define structure and disappear. `#263530` (G=53 vs R=38, 15-point gap) recedes further toward neutral while remaining very slightly warm.

---

### `--chip-off` (inactive filter chips, radio circles) — MINOR FIX

| | Current | Revised |
|--|---------|---------|
| Hex | `#2A3D30` | `#263530` |

Matches the revised `--border`. These elements should be indistinguishable from borders when inactive — same recessive neutral.

---

### Tokens that do not change

| Token | Dark mode value | Reason unchanged |
|-------|----------------|-----------------|
| `--bg` | `#0F1C16` | Correct. Dark forest, thematically right. |
| `--surface` | `#1A2C22` | Correct. Elevated surface, appropriate depth. |
| `--ink` | `#F0F0ED` | Correct. Warm off-white reads well on dark forest. |
| `--amber` | `#D97706` | Amber hazard/warning colour is already muted. No change needed. |
| `--red` | `#DC2626` | Same — functional alarm colour, not decorative. |

---

## Contrast Verification

All calculated against dark mode surfaces using WCAG relative luminance formula.

| Foreground | Background | Contrast ratio | WCAG result |
|-----------|-----------|---------------|-------------|
| `#82B09A` (new brand) | `#1A2C22` (surface) | ~5.8:1 | ✅ AA (normal text) |
| `#82B09A` (new brand) | `#0F1C16` (bg) | ~7.1:1 | ✅ AAA |
| `#F0F0ED` (ink) | `#1A2C22` (surface) | ~12.4:1 | ✅ AAA |
| `#8B9690` (ink-2) | `#1A2C22` (surface) | ~4.8:1 | ✅ AA (large text / UI) |
| `#8B9690` (ink-2) | `#0F1C16` (bg) | ~5.9:1 | ✅ AA |
| `#6EE7B7` (old brand) | `#1A2C22` (surface) | ~9.4:1 | High contrast — but neon |

The old `--brand` actually had very high contrast, which is why it glowed so strongly — it was far too bright for the dark surface it sat on. The new value's contrast is better calibrated: sufficient for accessibility, not so high that it radiates.

---

## Hardcoded Colour Substitution Table

Every instance of `rgba(110,231,183,...)` and `#6EE7B7` in dark mode must be replaced by the Developer. Old accent `#6EE7B7` = RGB(110,231,183). New accent `#82B09A` = RGB(130,176,154).

| Current value | Replacement | Where used |
|---------------|-------------|-----------|
| `rgba(110,231,183,0.06)` | `rgba(130,176,154,0.07)` | `.walk-preview-card` bg, `.today-conditions-card` bg |
| `rgba(110,231,183,0.07)` | `rgba(130,176,154,0.08)` | `.weather-preview-card` bg |
| `rgba(110,231,183,0.12)` | `rgba(130,176,154,0.13)` | `.walk-preview-tag` bg, `.trail-tag` bg |
| `rgba(110,231,183,0.18)` | `rgba(130,176,154,0.18)` | `.walk-preview-card` border, `.today-conditions-card` border |
| `rgba(110,231,183,0.20)` | `rgba(130,176,154,0.20)` | `.weather-preview-card` border |
| `#6EE7B7` (text) | `#82B09A` | `.walk-preview-tag` color, `.weather-preview-title` color |

**Why the opacity values are nearly identical:** The old tints glowed because `rgb(110,231,183)` is very bright. The new `rgb(130,176,154)` is substantially darker, so the same opacity produces a much more recessive tint automatically. A small upward nudge on a few values (0.06 → 0.07, 0.07 → 0.08) compensates to keep the tints perceptible.

---

## Dark Mode Overrides for Light-Mode `rgba(30,77,58,...)` Tints

The following components use `rgba(30,77,58,...)` (dark green at low opacity) for their light-mode chip/icon backgrounds. On dark surfaces these are nearly invisible — dark on dark. These need dark mode overrides to use the new accent instead.

`rgba(30,77,58,...)` will be replaced in dark mode with `rgba(130,176,154,...)`.

| Component | Light mode value | Dark mode override needed |
|-----------|-----------------|--------------------------|
| `.venue-icon` | `rgba(30,77,58,0.1)` | `rgba(130,176,154,0.12)` |
| `.walk-tag.full` | `rgba(30,77,58,0.08)` bg + `rgba(30,77,58,0.2)` border | `rgba(130,176,154,0.10)` bg + `rgba(130,176,154,0.22)` border |
| `.venue-open-gp.open` | `rgba(30,77,58,0.1)` | `rgba(130,176,154,0.12)` |
| Walk window card | `rgba(30,77,58,0.05)` bg + `rgba(30,77,58,0.12)` border | `rgba(130,176,154,0.06)` bg + `rgba(130,176,154,0.14)` border |
| Hazard card (brand variant) | `rgba(30,77,58,0.06)` | `rgba(130,176,154,0.07)` |
| State A preview card | `rgba(30,77,58,0.06)` bg + `rgba(30,77,58,0.15)` border | use `--surface` bg + `--border` border (no tint needed in dark mode) |
| Filter chip selected | `rgba(30,77,58,0.06)` | `rgba(130,176,154,0.10)` |

---

## Summary: Complete `body.night` Block (Revised)

```css
body.night {
  --bg:       #0F1C16;
  --surface:  #1A2C22;
  --border:   #263530;
  --ink:      #F0F0ED;
  --ink-2:    #8B9690;
  --chip-off: #263530;
  --brand:    #82B09A;
}

/* Preview cards — State A */
body.night .walk-preview-card    { background: rgba(130,176,154,0.07); border-color: rgba(130,176,154,0.18); }
body.night .weather-preview-card { background: rgba(130,176,154,0.08); border-color: rgba(130,176,154,0.20); }
body.night .walk-preview-tag     { background: rgba(130,176,154,0.13); color: #82B09A; }
body.night .weather-preview-title { color: #82B09A; }
body.night .today-conditions-card { background: rgba(130,176,154,0.07); border-color: rgba(130,176,154,0.18); }

/* Trail tags */
body.night .trail-tag            { background: rgba(130,176,154,0.13); }
body.night .trail-tag.partial    { background: rgba(217,119,6,0.12); } /* unchanged — amber, correct */

/* Venue icons */
body.night .venue-icon           { background: rgba(130,176,154,0.12); }

/* Walk tags (Walks list view) */
body.night .walk-tag.full        { background: rgba(130,176,154,0.10); border-color: rgba(130,176,154,0.22); }

/* Misc */
body.night .search-input-row     { background: var(--surface); } /* unchanged */
body.night .hour-seg.poor        { background: var(--border); }  /* unchanged */
```

---

## What This Does Not Change

- The weather hero background is `var(--brand)` in its inline dark mode styles and hardcoded `color: #fff` for text. The new `--brand: #82B09A` on the weather hero will render as a sage green hero — this is intentional and correct for dark mode. White text on sage passes contrast.
- Amber (`--amber: #D97706`) and red (`--red: #DC2626`) are unchanged. These functional colours are not part of the green problem.
- The nav active state using `var(--brand)` will update automatically when `--brand` is overridden.
- `--brand-mid: #2E7D5E` has no dark mode override currently and is not visibly used in dark mode contexts. No change required.

---

## Visual Before/After Description

| Element | Before (current) | After (revised) |
|---------|-----------------|-----------------|
| Active nav icon/label | Bright neon mint | Muted sage |
| Trail tag chips (dark mode) | Glowing mint tint background | Subtle dark sage tint, barely perceptible |
| Walk preview cards (State A) | Neon mint border glow | Quiet sage outline |
| Walk preview tags | Bright mint chip | Muted sage chip |
| Weather preview title | Neon headline | Calm sage headline |
| Links and section links | Bright mint | Sage — clearly green but not emitting light |
| Conditions card border | Mint glow | Near-invisible sage border |

The overall effect shifts from "glowing in a forest at night" to "sitting in a calm dark room with green accents." The green identity is preserved; the neon is removed.

---

## Implementation Note for Developer

This is a targeted token + override update. No component structure changes. Implementation steps:

1. Replace the `body.night` token block with the revised block above
2. Search for every instance of `rgba(110,231,183` and replace per the substitution table
3. Search for every instance of `#6EE7B7` in dark mode overrides and replace with `#82B09A`
4. Add the new dark mode overrides for `rgba(30,77,58,...)` components listed above
5. Verify visually on device in dark mode (set `is_day = 0` in devtools to force, or use the Me tab dark mode toggle)

No other files need changing. `sw.js`, `manifest.json`, and all light mode styles are unaffected.
