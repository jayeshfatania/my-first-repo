# App UI Parity Review — April 10, 2026

**Reviewer:** Designer/Editor
**Scope:** Sniffout PWA (`sniffout-v2.html`) vs companion website (`sniffout-website.pages.dev`)
**Date:** 2026-04-10
**Status:** Internal design review — do not publish

---

## Summary Table

| # | Area | Gap | Severity |
|---|------|-----|----------|
| 1 | Colour — difficulty badges (in-card JS) | App hard-codes solid-fill coloured pills (`#2C4A14`, `#D4940A`, `#C0392B`) on portrait and trail cards. Website uses soft tinted backgrounds for Moderate (sienna-light / sienna-dark). | High |
| 2 | Colour — `--ink-2` mismatch | App defines `--ink-2` as `#6B6B6B`. Website defines `--ink-2` as `#555555`. Secondary body text is visually different between the two surfaces. | High |
| 3 | Background token drift | App `--bg` is `#F4EFE6` (matches website). CLAUDE.md still says app uses `#F7F5F0` — this is outdated. Token is aligned, but the old value lingers in project docs creating confusion. | Medium |
| 4 | Glassmorphism remnants in app | App retains `backdrop-filter: blur(4px/8px/12px)` on the walk heart button, portrait heart, trail card badge, and one map overlay. Design spec says glassmorphism has been removed. | Medium |
| 5 | Walk detail overlay badge — no colour coding | Walk detail hero badge uses a generic `rgba(0,0,0,0.55)` dark pill regardless of badge type. Website uses `#2C4A14` for "Sniffout Pick" and `#B85C2C` (Sienna) for "Hidden gem" with white text. App badge has `display: none` by default and no colour variation per badge type. | Medium |
| 6 | Moderate difficulty colour — inconsistent across app surfaces | Walk list cards use CSS class `.walk-tag.diff-moderate { color: var(--amber); background: var(--amber-tint); }` (amber/warm). Portrait card and trail card use JS-injected inline style with `#D4940A` (a slightly different amber hex). Weather tab uses `#D4940A` for cond pills. Three slightly different rendering paths for the same semantic state. | Medium |
| 7 | Section heading treatment divergence | Website uses `walk-section-heading`: 10px, 600 weight, `rgba(44,74,20,0.55)`, uppercase, 0.06em letter-spacing. App uses multiple distinct section label patterns: `wx-section-label` (11px, 700, 0.08em), `nearby-section-label` (11px, 700, 0.08em), `me-section-label` (11px, 600, 0.07em), `walks-section-label` (18px, 700). No unified section label system across tabs — each tab has invented its own. | Medium |
| 8 | Walk card image placeholder gradient direction | App walk photo placeholder uses `linear-gradient(135deg, #2D5A1B 0%, #1A3D0F 50%, #3D6520 100%)`. Website uses `linear-gradient(135deg, #C8D8B0 0%, #2C4A14 100%)` — a light-to-dark gradient. App version is dark-only, website version starts light. Minor visual inconsistency but noticed when images fail to load. | Low |
| 9 | Weather bar chart intermediate green | Bar chart uses `rgb(90,138,46)` at score 60 (interpolated). Website walk weather preview (when present) uses `#7CB342`. These are close but not identical. The `#5A8A2E` "lighter green for 20-22C awareness range" is correctly shipped per CLAUDE.md backlog. Functionally fine. | Low |
| 10 | Sienna not applied to "Get the app" / CTA in app | Website header CTA pill uses `background: var(--sienna)` (#B85C2C) with white text. App has no persistent CTA pill — the install prompt card in the Me tab uses `background: var(--brand)` (green). Not necessarily wrong (different surfaces, different context) but worth flagging as a brand accent usage inconsistency. | Low |
| 11 | `--border` token mismatch | App: `rgba(0,0,0,0.07)`. Website: `rgba(0,0,0,0.08)`. One percentage point apart. Barely perceptible but technically a drift from a shared system. | Low |

---

## Detailed Findings

---

### 1. Difficulty badges — solid fill vs soft tint (HIGH)

**Where:** Walks tab — portrait cards, trail cards (Today tab picks section, Walks tab carousel)

**The issue:**
In the app, difficulty badges on portrait cards and trail cards are rendered via JavaScript inline styles:

```js
var diffBg = walk.difficulty === 'easy'    ? '#2C4A14'
           : walk.difficulty === 'moderate' ? '#D4940A'
           : walk.difficulty === 'hard'     ? '#C0392B' : '';
// Output: color:#fff; background: <diffBg>
```

This produces solid, fully saturated coloured pills with white text.

The website uses soft tinted backgrounds:
- Easy: `background: #E8F0DC; color: #2C4A14`
- Moderate: `background: var(--sienna-light); color: var(--sienna-dark)` — i.e., `#F5E8E0 / #8A4420`
- Hard: `background: #FDECEA; color: #C0392B`

The app's walk list card CSS uses the tinted approach (`.walk-tag.diff-easy`, `.walk-tag.diff-moderate`, `.walk-tag.diff-hard` classes are correctly styled). The mismatch is specifically in the portrait card and trail card rendering paths which bypass the CSS classes and use JS-injected inline styles.

**Suggested fix:**
Replace the JS inline-style difficulty pill in `buildPortraitCard()` and `buildTrailCard()` with a class-based approach that matches the walk tag CSS already defined (`.walk-tag.diff-easy` etc.). This eliminates the inconsistency at source and keeps styling in CSS.

---

### 2. `--ink-2` secondary text colour mismatch (HIGH)

**Where:** All tabs — any secondary/supporting text

**The issue:**
- App `--ink-2`: `#6B6B6B` (lighter grey)
- Website `--ink-2`: `#555555` (darker grey)

This is a meaningful perceptual difference. Website secondary text has more contrast and reads more clearly against the `#F4EFE6` warm background. App secondary text is noticeably lighter. This affects location labels on walk cards, meta text, descriptions, and all secondary copy throughout.

**Suggested fix:**
Align app `--ink-2` to `#555555` to match the website. The website value is also better for WCAG AA compliance against the background token.

---

### 3. CLAUDE.md background token reference is stale (MEDIUM)

**Where:** Project documentation

**The issue:**
CLAUDE.md states `Background: #F4EFE6 (warm linen)` for website and `app uses #F7F5F0 ("warm off-white")` as a known divergence. However the app CSS actually defines `--bg: #F4EFE6` — identical to the website. The app and website background are already aligned. The CLAUDE.md note describing them as different is incorrect and will cause unnecessary confusion for future contributors.

**Suggested fix:**
Update the CLAUDE.md Architecture > CSS section to reflect that both surfaces now use `#F4EFE6`. Remove the note implying they differ.

---

### 4. Glassmorphism remnants (MEDIUM)

**Where:** Walk card heart button, portrait card heart, trail card badge, map FAB overlay panel

**The issue:**
Design spec (CLAUDE.md) states "glassmorphism has been removed." However the app still applies `backdrop-filter: blur()` in several places:

- `.walk-heart`: `backdrop-filter: blur(4px)` — the heart button on walk cards
- `.portrait-heart`: `backdrop-filter: blur(4px)` — heart button on portrait view cards
- `.trail-card-badge`: `backdrop-filter: blur(4px)` — badge on trail cards in carousels
- Map FAB overlay panel: `backdrop-filter: blur(8px)` and `blur(12px)`

The website has no blur effects at all. These are subtle but they represent a design inconsistency with the stated spec and create visual weight that conflicts with the clean card-based direction.

**Suggested fix:**
Remove `backdrop-filter` from `.walk-heart` and `.portrait-heart`. For the badge, the blur is minor but could be removed for spec compliance. The map FAB may be a deliberate exception given it floats over map tiles — flag for PO decision before removing.

---

### 5. Walk detail overlay badge — generic colour, no type variation (MEDIUM)

**Where:** Walk detail overlay — hero image area

**The issue:**
The walk detail hero badge (`.walk-detail-hero-badge`) uses a single generic style:
```css
background: rgba(0,0,0,0.55);
color: #fff;
font-weight: 500;
```

It also has `display: none` by default and appears to rarely render.

The website walk page uses distinct badge colours in the hero:
- "Sniffout Pick": `background: #2C4A14; color: #FFFFFF`
- "Hidden gem": `background: #B85C2C; color: #FFFFFF`

The app walk list and portrait cards do apply `.badge-pick` (brand green) and `.badge-gem` (sienna) class colouring correctly via `.portrait-badge` and `.trail-card-badge` CSS. The gap is specifically the walk detail overlay hero badge — when a user taps into a "Sniffout Pick" walk, the badge in the full-screen detail view loses its branding.

**Suggested fix:**
When populating the walk detail hero badge, apply the same `badge-pick` / `badge-gem` class pattern used on portrait and trail cards. The CSS classes are already defined.

---

### 6. Moderate difficulty — three rendering paths (MEDIUM)

**Where:** Walk list cards, portrait cards, trail cards, weather tab pills

**The issue:**
"Moderate" difficulty renders differently depending on context:

| Surface | Colour rendering |
|---------|----------------|
| Walk list card `.walk-tag.diff-moderate` | `color: var(--amber)` = `#B07A28`; `background: var(--amber-tint)` = `#FEF3E2` |
| Portrait/trail card (JS inline) | `background: #D4940A; color: #fff` (solid, saturated) |
| Weather cond pill `.wx-cond-pill--moderate` | `background: #D4940A` |
| Weather sheet badge `--moderate` | `background: rgba(245,158,11,0.12); color: #B45309` |

Four different treatments for the same semantic value. The walk list card approach (tinted amber) aligns with the website. The portrait/trail card approach (solid saturated) does not.

**Suggested fix:**
Unify moderate difficulty behind the tinted amber approach everywhere. Convert JS inline styles to use the CSS class `.walk-tag.diff-moderate` pattern. Weather pills are intentionally more saturated for legibility on the weather surface — those can remain different.

---

### 7. Section heading system fragmented (MEDIUM)

**Where:** All tabs

**The issue:**
The website uses a single `.walk-section-heading` pattern: 10px, 600, `rgba(44,74,20,0.55)`, uppercase, 0.06em letter-spacing. It is applied consistently on the home page, walk listing, and area pages.

The app has invented a separate label class per tab, none of which share a single definition:

| Class | Size | Weight | Letter-spacing | Used in |
|-------|------|--------|----------------|---------|
| `.wx-section-label` | 11px | 700 | 0.08em | Weather tab |
| `.nearby-section-label` | 11px | 700 | 0.08em | Nearby tab |
| `.me-section-label` | 11px | 600 | 0.07em | Me tab |
| `.walks-section-label` | 18px | 700 | none | Walks tab — this is a heading, not a label |
| `.filter-section-label` | not found in snippet | unknown | — | Filter sheet |

The 18px walks section label is a category heading, not a section label — these are semantically different and should not share a name pattern. The three true section labels (wx, nearby, me) are close to each other but differ slightly in weight and spacing. None exactly match the website system.

**Suggested fix:**
Define a single `.section-label` utility class in the app (11px, 600, `rgba(44,74,20,0.55)`, uppercase, 0.07em) and apply it consistently across Weather, Nearby, and Me tabs. The walks section headings are a distinct pattern and should be named differently (e.g., `.content-heading`).

---

### 8. Walk card image placeholder gradient direction (LOW)

**Where:** Walk list cards when image is absent

**The issue:**
App placeholder background: `linear-gradient(135deg, #2D5A1B 0%, #1A3D0F 50%, #3D6520 100%)` — dark throughout, forest green shades.
Website placeholder background: `linear-gradient(135deg, #C8D8B0 0%, #2C4A14 100%)` — starts light sage, ends brand green.

The website version looks more considered. The app version is fully dark and indistinguishable from a loaded dark image.

**Suggested fix:**
Align app placeholder gradient to the website: `linear-gradient(135deg, #C8D8B0 0%, #2C4A14 100%)`. Apply to both `.walk-photo` and `.walk-detail-hero`.

---

### 9. Weather bar — intermediate green value (LOW)

**Where:** Weather tab — smart walk window bar chart

**The issue:**
The `getBarColor()` function interpolates between score stops. At score 60 it passes through approximately `rgb(90,138,46)` (computed). The `#5A8A2E` lighter green was intentionally shipped for the 20-22C awareness range. This is correct per the backlog resolution in CLAUDE.md. However `#7CB342` is also used in forecast pills (`.wx-forecast-pill--good`) for the same "good" tier. These two greens are close but not identical.

**Suggested fix:**
Low priority. Both greens fall within the brand green family. If a future design pass consolidates weather score colours, align forecast pill `--good` with the `#5A8A2E` lighter green for internal consistency.

---

### 10. Sienna CTA accent not used in app (LOW)

**Where:** Me tab install prompt, any in-app CTAs

**The issue:**
Website header CTA pill ("Get the app") uses `background: var(--sienna)` = `#B85C2C`. This is the only approved accent use of Sienna (per CLAUDE.md design decisions).

In the app, there is no persistent CTA pill. The PWA install prompt card in the Me tab uses `background: var(--brand)` (green). This is not wrong — the install prompt is a different context to a navigation CTA — but Sienna is otherwise entirely absent from the app UI. The app has Sienna defined in CSS (for `.walk-badge.badge-gem` and `.wx-cond-note--poor strong`) but the accent is less visible in the app experience than on the website.

**Assessment:** Not a bug. Flag as a design audit note. Sienna usage in the app is appropriately restrained. No immediate fix needed.

---

### 11. `--border` opacity token off by one (LOW)

**Where:** All cards, separators

**The issue:**
- App: `rgba(0,0,0,0.07)`
- Website: `rgba(0,0,0,0.08)`

Imperceptible in isolation, visible if directly compared side by side at high brightness. Not a functional issue.

**Suggested fix:**
Align app `--border` to `rgba(0,0,0,0.08)` on next CSS pass.

---

## What Is Consistent and Working Well

- **Brand colour `#2C4A14`:** Correctly applied throughout both surfaces. No rogue greens found.
- **Typeface:** Plus Jakarta Sans correctly loaded and applied in both app and website with identical weight range (400/500/600/700/800).
- **Card border-radius:** 16px consistently applied to walk cards in both app and website.
- **`border-radius: 20px` for pills:** Consistent across both surfaces.
- **Walk badge colours (Sniffout Pick / Hidden gem) on list cards:** Correctly uses brand green and sienna in the app CSS via `.badge-pick` and `.badge-gem` classes.
- **Bottom nav:** Dark `#1B3009` background is distinctive and works well. Active state with light dot indicator is a clear design decision, intentionally different from the website's navigation (which is a top header). No parity issue.
- **Dark mode `body.night` class:** Correctly implemented with its own token overrides. No website equivalent to compare.
- **Tap feedback (`transform: scale(0.97)` on `:active`):** Applied consistently on walk cards, trail cards, chips, buttons, and rows throughout the app. Correctly absent on the website (desktop hover conventions apply instead).
- **Section heading colour value `rgba(44,74,20,0.55)`:** Both app (where used) and website use this exact value for section label colour, showing the design intent is shared even if the implementation is fragmented.

---

## Priority Order for Fixes

1. **`--ink-2` mismatch** (#2) — affects every secondary text string on every tab. One token change.
2. **Difficulty badge solid vs tint** (#1) — perceptible on portrait/trail cards. Affects brand feel.
3. **Walk detail overlay badge** (#5) — "Sniffout Pick" branding disappears at the most important moment (when user is inside a walk).
4. **Glassmorphism remnants** (#4) — spec says removed. Cleanup removes technical debt.
5. **Section label fragmentation** (#7) — medium-term CSS hygiene. Not urgent but adds maintenance overhead.
6. **CLAUDE.md background token correction** (#3) — documentation fix, five minutes.
7. **Placeholder gradient** (#8) — visual polish, easy fix.
8. **`--border` token** (#11) — imperceptible. Last priority.
