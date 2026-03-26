# Signature Tactile - Design System Spec

**Status:** Designer-approved. Ready for Developer implementation.
**Design direction:** Signature Tactile - deeply rounded, plush cards floating in distinct layers. Premium, modern, physically present.
**Date:** 2026-03-26

---

## How to read this document

Every value in this spec is exact. Where a CSS custom property is referenced (e.g. `var(--radius-xl)`), the resolved value is also shown in brackets. The Developer should implement the custom properties first, then apply them throughout.

Night mode values are specified at the end of each section and collected in Section 4. The `body.night` toggle mechanism is unchanged.

---

## Section 1 - Foundations

### 1.1 Background and surfaces

**The Signature Tactile effect is created entirely by contrast between layers.** Layer 0 is warm cream. Layer 1 is pure white. The eye reads the difference as physical depth without any shadow needing to do heavy lifting. Get this contrast right and the shadows are almost a bonus.

**Layer 0 - Page background**

`--bg: #F0EDE6`

Reasoning: #F7F5F0 (current) reads as off-white. #F0EDE6 reads as cream. That four-point shift in warmth is the difference between "slightly grey" and "warm paper", which is the foundation the entire direction depends on. It is warm without being yellow, organic without being brown. Do not go darker than this - #EAE4DA would tip into beige and compete with the cards.

**Layer 1 - Standard card surfaces**

`--surface: #FFFFFF`

Pure white, not warm white. The cream background does the warmth work. Warm white cards on a cream background collapses the contrast that creates the floating effect. Pure white on cream is the correct pairing - the same visual logic as cream-coloured paper with white cards laid on top.

**Layer 1 shadow - Standard cards**

```css
box-shadow:
  0 2px 12px rgba(0, 0, 0, 0.07),
  0 1px 3px rgba(0, 0, 0, 0.05);
```

The 12px blur primary shadow provides the lift. The 1px/3px micro shadow provides edge definition - without it, pure white cards on a light background can lose their bottom edge. Both layers together read as a card sitting 2-3mm above the page.

**Layer 2 shadow - Hero and elevated elements**

```css
box-shadow:
  0 8px 28px rgba(44, 74, 20, 0.22),
  0 2px 8px rgba(44, 74, 20, 0.14),
  inset 0 1px 0 rgba(255, 255, 255, 0.12);
```

The green-tinted shadow is deliberate. A grey shadow under a green card reads as a mistake. Using the brand green in the shadow alpha grounds the card in its own colour identity - the card casts a green shadow because it is green. The `inset 0 1px 0` top-edge highlight simulates light from above catching the card surface. 12% opacity keeps it subtle enough to read as material behaviour, not a design trick.

**Layer 2 shadow - Caution state (amber hero)**

```css
box-shadow:
  0 8px 28px rgba(120, 72, 0, 0.22),
  0 2px 8px rgba(120, 72, 0, 0.14),
  inset 0 1px 0 rgba(255, 255, 255, 0.10);
```

**Layer 2 shadow - Avoid state (red hero)**

```css
box-shadow:
  0 8px 28px rgba(138, 26, 26, 0.22),
  0 2px 8px rgba(138, 26, 26, 0.14),
  inset 0 1px 0 rgba(255, 255, 255, 0.10);
```

---

### 1.2 Border radius system

```css
--radius-sm:   10px;   /* chips, badges, small buttons, input backgrounds */
--radius-md:   14px;   /* standard inputs, filter rows, menu rows */
--radius-lg:   20px;   /* walk cards, venue cards, info panels */
--radius-xl:   28px;   /* hero card, walk detail overlay top corners, modals */
--radius-pill: 100px;  /* category chips, tags, label pills */
```

The 8px step between sm-md-lg is consistent. The jump from lg (20) to xl (28) is larger because the hero card needs to read as a distinct class of object - more rounded than any card it sits above. 28px on a 240-280px wide card reads as "very generous". 20px reads as "modern and friendly". Both are right for their context.

Do not use 16px anywhere. The current default of 16px is fine for a generic modern app but it is not the Signature Tactile direction. The minimum radius in this system is 10px.

---

### 1.3 Colour system

**Full token set - light mode**

```css
/* Layer backgrounds */
--bg:            #F0EDE6;   /* page background - warm cream */
--surface:       #FFFFFF;   /* card surfaces */
--surface-2:     #F7F4EF;   /* input backgrounds, secondary surfaces, divider fills */

/* Text */
--ink:           #1A1A1A;   /* primary text */
--ink-2:         #6B6B6B;   /* secondary text */
--ink-3:         #9E9E9E;   /* tertiary - meta info, distance, difficulty labels */

/* Borders */
--border:        rgba(0, 0, 0, 0.07);   /* card borders */
--border-strong: rgba(0, 0, 0, 0.12);   /* input borders, dividers */

/* Brand */
--brand:         #2C4A14;   /* interactive elements, active states, badges */
--brand-mid:     #3D6520;   /* brand green for hover states and backgrounds */
--brand-tint:    #EDF2E8;   /* background behind green text - chips, active states */

/* Status */
--amber:         #B07A28;   /* caution - marginal conditions */
--amber-tint:    #FEF3E2;   /* amber chip backgrounds, caution tints */
--red:           #C0392B;   /* danger - poor conditions, hard difficulty */
--red-tint:      #FFEBE9;   /* red chip backgrounds, danger tints */
```

**Why --surface-2 exists:** Inputs, filter containers, and secondary panels should not be pure white when set inside a white card. `--surface-2` is #F7F4EF - the midpoint between the page cream and white. It reads as "slightly recessed" inside a white card without needing a border. Use it for: search input backgrounds, segmented control backgrounds, stat fill areas in the Me tab.

---

### 1.4 Typography

**Recommendation: pair Fraunces with Inter.**

Inter alone cannot produce a premium feel at display sizes. At 56px for the hero temperature, Inter 700 is clean but it has no personality - it reads as a dashboard. Fraunces at the same size reads as something worth opening. It has optical weight, slight ink-trap detail at large sizes, and the variable axis means it can go from editorial to functional. The pairing is: Fraunces for numbers and headlines that need presence, Inter for everything that needs to be read functionally.

Fraunces is free via Google Fonts. One CDN import. The Developer already has a reference implementation in the design elevation spec from March 23.

**CDN import**

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Only Fraunces 700 is needed. The optical size axis (`opsz`) should be set based on rendered size - large sizes (48px+) should use high opsz values for elegance, smaller sizes use lower values for legibility.

**Complete type scale**

| Role | Element | Font | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|---|
| display | hero temperature | Fraunces | 64px | 700 | 1.0 | -0.02em |
| display-sm | primary stat (Me tab) | Fraunces | 48px | 700 | 1.0 | -0.02em |
| heading-1 | tab section headings | Inter | 22px | 700 | 1.2 | -0.01em |
| heading-2 | card titles, walk names | Inter | 17px | 600 | 1.3 | -0.01em |
| heading-3 | section labels, overlines | Inter | 13px | 600 | 1.3 | 0.04em (uppercase) |
| body | primary body text | Inter | 15px | 400 | 1.5 | 0 |
| body-strong | body with emphasis | Inter | 15px | 600 | 1.5 | 0 |
| body-sm | secondary body text | Inter | 13px | 400 | 1.4 | 0 |
| caption | meta info, distance, difficulty | Inter | 12px | 500 | 1.3 | 0 |
| label | button labels, tab labels | Inter | 11px | 600 | 1.0 | 0.02em |
| badge | badge text | Inter | 11px | 700 | 1.0 | 0.03em |

Note on section overlines: heading-3 used as an overline label above section titles should be set in uppercase with 0.04em letter spacing. This is the only context where uppercase Inter is used.

---

## Section 2 - Component Specs

### 2.1 Hero card (.weather-hero)

**The hero card is the centrepiece of the app. It needs to feel like a physical object, not a div.**

```css
.weather-hero {
  background: #2C4A14;
  border-radius: var(--radius-xl);   /* 28px */
  padding: 20px 20px 16px 20px;
  margin: 0 16px;
  box-shadow:
    0 8px 28px rgba(44, 74, 20, 0.22),
    0 2px 8px rgba(44, 74, 20, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
}
```

**Padding reduction:** Current padding is 20px all sides. The bottom can come down to 16px because the "Full forecast" row has its own internal padding. Top stays 20px to give the inner highlight room to read. Left/right 20px unchanged.

**Green fill treatment:** Flat fill with the `inset 0 1px 0` highlight is sufficient. Do not add noise, radial gradient, or any texture. The inner highlight does the material work. Adding a radial gradient risks tipping into old-school skeuomorphism. The brief asks for tactile, not textured.

**"Full forecast" chevron row:** Keep it, but change the treatment. Remove the separate row divider border. Instead render it as a small transparent pill at the bottom of the card:

```css
.weather-hero-forecast-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.10);
  border-radius: var(--radius-md);   /* 14px */
}

.weather-hero-forecast-row span {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.80);
  letter-spacing: 0.01em;
}

.weather-hero-forecast-row svg {
  opacity: 0.65;
}
```

The frosted pill is a premium affordance. It signals tappability without text saying "tap here". The 10% white background reads as a recessed element inside the green surface.

**Night mode background**

```css
body.night .weather-hero {
  background: #1A3522;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.40),
    0 2px 8px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

**Caution state (marginal conditions)**

```css
.weather-hero.hero--caution {
  background: #7C4A00;
  box-shadow:
    0 8px 28px rgba(120, 72, 0, 0.22),
    0 2px 8px rgba(120, 72, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
}
```

**Avoid state (poor conditions)**

```css
.weather-hero.hero--avoid {
  background: #8A1A1A;
  box-shadow:
    0 8px 28px rgba(138, 26, 26, 0.22),
    0 2px 8px rgba(138, 26, 26, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
}
```

Both state colours are deep, rich, and desaturated enough to remain premium rather than alarming. #7C4A00 is a dark amber-brown - it reads as "weather is complex today" without shouting. #8A1A1A is deep red, serious but controlled. Do not use #EF4444 or bright red for the hero state - that is a UI error colour, not a weather condition colour.

---

### 2.2 Walk cards - carousel (Today tab)

```css
.walk-card-carousel {
  background: var(--surface);           /* #FFFFFF */
  border-radius: var(--radius-lg);      /* 20px */
  border: 1px solid var(--border);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: min(280px, calc(100vw - 64px));
  flex-shrink: 0;
}
```

**Image area:** The image sits at the top of the card with `border-radius: 0` on its own - the parent card's `overflow: hidden` and `border-radius: var(--radius-lg)` clips the top corners correctly. Do not apply separate border-radius to the image element. Apply `aspect-ratio: 16/9` or a fixed height of 148px to the image container. 148px is the recommendation - it gives enough visual presence without making the card unwieldy in a horizontal scroll.

```css
.walk-card-carousel .card-image {
  width: 100%;
  height: 148px;
  object-fit: cover;
  display: block;
}

.walk-card-carousel .card-body {
  padding: 12px 14px 14px 14px;
}
```

**"Sniffout Pick" badge:** Current style has served its function but needs refinement.

```css
.badge-pick {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--brand-tint);       /* #EDF2E8 */
  color: var(--brand);                  /* #2C4A14 */
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 3px 8px 3px 6px;
  border-radius: var(--radius-pill);    /* 100px */
}
```

The badge sits as the first element in `.card-body`, before the walk name. Star icon (Lucide `star`, 10px, filled) before the text. No border on the badge - the tint background on white is enough differentiation.

**Heart/favourite button**

```css
.walk-card-carousel .btn-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

The backdrop blur on the heart button is an exception to the general no-blur rule - this is a floating action element over an image, not a panel background. 4px blur is barely perceptible but prevents the white circle from looking pasted onto busy photo content. The container for the image area must be `position: relative` to contain this.

---

### 2.3 Walk cards - full width (Walks tab)

```css
.walk-card-full {
  background: var(--surface);
  border-radius: var(--radius-lg);      /* 20px */
  border: 1px solid var(--border);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 0 16px;
}
```

**Image area:** Fixed height 200px. The image container holds the parallax element. No overlay text on the image for full-width cards on the Walks tab - the name and details are below in the info section. The image should be clean.

```css
.walk-card-full .card-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.walk-card-full .card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.walk-card-full .card-body {
  padding: 14px 16px 16px 16px;
}
```

**Info section padding:** 14px top (slightly less than card body generally) because the image above already provides visual breathing room. 16px bottom clears the card base. 16px left/right aligns with standard card content inset.

**Text overlay on photo:** Remove entirely for full-width walk cards. The name, difficulty, and distance are all in the card body below. Overlaying the name on the photo created visual redundancy with the card body - this was one of the duplicate title issues identified in the March 25 spec. The photo is now purely visual.

---

### 2.4 Green space list items (Walks tab)

Make these mini cards. Keeping them as plain list rows while everything else in the system is elevated creates a jarring quality differential that reads as incomplete.

```css
.green-space-card {
  background: var(--surface);
  border-radius: var(--radius-md);      /* 14px */
  border: 1px solid var(--border);
  box-shadow:
    0 1px 6px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 16px;
}
```

The shadow is lighter than standard walk cards - this is correct. Green space items are secondary content. The reduced shadow keeps them subordinate to the hero walk cards above while still reading as part of the same system.

**Thumbnail:** 44px x 44px, `border-radius: var(--radius-sm)` (10px), `object-fit: cover`. If no image is available, use `background: var(--brand-tint)` with a Lucide `trees` icon (18px, `--brand`) centred inside.

**Dividers:** None. The cards themselves are the dividers - the gap between them (8px) is sufficient. No horizontal rules.

---

### 2.5 Category chips (Nearby tab)

**These should be sticky (pinned below the tab header) and not scroll with the venue list.** Sticky chips are the correct pattern here - they are a filter control, not content. Scrolling them away and then requiring the user to scroll back up to change category is a usability regression.

**Inactive chip**

```css
.chip {
  height: 34px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
```

**Active chip**

```css
.chip.chip--active {
  background: var(--brand);
  border-color: var(--brand);
  color: #FFFFFF;
}
```

Active chip icon colour: #FFFFFF.

**Chip container:** Horizontal scroll with no scrollbar visible. CSS gradient mask on right edge to indicate more chips beyond viewport.

```css
.chip-bar {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 10;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent 100%);
}
```

The gradient mask is purely cosmetic - it tells the user "there is more here" without any interactive element required.

---

### 2.6 Venue cards (Nearby tab)

```css
.venue-card {
  background: var(--surface);
  border-radius: var(--radius-lg);      /* 20px */
  border: 1px solid var(--border);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 0 16px;
}

.venue-card .card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.venue-card .card-body {
  padding: 14px 16px 16px 16px;
}
```

**Photo area treatment:** Full-bleed photo at the top, no overlay text, no gradient. The photo is the photo. Category and name are below in the card body.

**Info tip box (the callout currently shown above the venue list):** Remove it. The tips are editorial filler and add visual noise above the cards. If a tip is important (e.g. "showing results within 3 miles"), render it as a small inline `--surface-2` pill with an `info` icon, positioned between the chip bar and the first venue card. No permanent container.

```css
.venue-info-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-2);
  border-radius: var(--radius-pill);
  padding: 6px 12px;
  margin: 0 16px 12px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-2);
}
```

Only render this pill when there is something specific to communicate (radius restriction, no results, location fallback). Do not render it when the list is functioning normally.

---

### 2.7 Input and filter elements

**Search inputs**

```css
.input-search {
  height: 46px;
  background: var(--surface-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);      /* 14px */
  padding: 0 14px 0 42px;              /* 42px left for icon */
  font-size: 15px;
  font-weight: 400;
  color: var(--ink);
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.input-search:focus {
  background: var(--surface);
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-tint);
}

.input-search::placeholder {
  color: var(--ink-3);
}
```

**Radius picker and segmented controls**

```css
.segmented-control {
  display: flex;
  background: var(--surface-2);
  border-radius: var(--radius-md);      /* 14px */
  padding: 3px;
  gap: 2px;
}

.segmented-control .segment {
  flex: 1;
  height: 36px;
  border-radius: 11px;                  /* radius-md minus padding (14 - 3) */
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.segmented-control .segment.active {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
```

**Filter rows (settings, sort options)**

```css
.filter-row {
  height: 52px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.filter-row:last-child {
  border-bottom: none;
}
```

Filter row containers (groups of rows) should be wrapped in a card:

```css
.filter-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 0 16px;
}
```

---

### 2.8 Navigation tab bar

**Background**

```css
.tab-bar {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
}
```

The backdrop blur separates the tab bar from scrolling card content without a hard opaque line. This is a deliberate exception to the general no-blur rule - the tab bar is a chrome element, not a content surface. iOS Safari and Android Chrome both handle this well. 16px blur is the correct value: enough to obscure card edges scrolling behind it, not so much that it looks like a glass panel. This is standard iOS/Android premium app treatment.

**Active tab indicator - pill blob**

```css
.tab-item .tab-icon-container {
  width: 52px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  transition: background 0.2s ease;
}

.tab-item.active .tab-icon-container {
  background: var(--brand-tint);       /* #EDF2E8 */
}

.tab-item.active svg {
  color: var(--brand);
}

.tab-item:not(.active) svg {
  color: var(--ink-3);
}

.tab-item .tab-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-top: 2px;
}

.tab-item.active .tab-label {
  color: var(--brand);
}

.tab-item:not(.active) .tab-label {
  color: var(--ink-3);
}
```

The pill blob behind the active icon is the correct premium pattern. It provides a clear active state without the underline bar (which reads as desktop web) or colour alone (which can be ambiguous on small icons). The `--brand-tint` fill reads as selected without being heavy.

**Tab bar height:** 64px. This is 4px taller than the current 60px. The extra height is needed to accommodate the icon + pill + label stack comfortably. The `env(safe-area-inset-bottom)` padding handles iPhone home indicator.

---

### 2.9 Me tab components

**Dog profile card**

```css
.dog-profile-card {
  background: var(--surface);
  border-radius: var(--radius-xl);      /* 28px */
  border: 1px solid var(--border);
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin: 0 16px;
  position: relative;
}
```

The dog profile card uses `--radius-xl` (28px) to signal it is the primary content element on the tab - the same class of radius as the hero card on Today. Everything below it on the Me tab uses `--radius-lg`.

**Avatar circle**

```css
.dog-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```

The 3px white border around the avatar creates a halo effect that separates it from any background it sits against. The shadow grounds it as a floating element within the card.

**Empty avatar (no dog added)**

```css
.dog-avatar-empty {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--brand-tint);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(44, 74, 20, 0.30);
}
```

Lucide `plus` icon (24px, `--brand`) centred inside. The dashed border signals "add something here" without requiring a label.

**Settings cog (within profile card)**

```css
.btn-settings {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-2);
}
```

No background in resting state. The icon is visible, the tap target is 36px. The circle background on `:active` provides tap feedback.

**Stats row**

```css
.stats-row {
  display: flex;
  background: var(--surface-2);
  border-radius: var(--radius-md);      /* 14px */
  overflow: hidden;
  margin-top: 16px;
}

.stats-row .stat-cell {
  flex: 1;
  padding: 14px 8px;
  text-align: center;
  position: relative;
}

.stats-row .stat-cell + .stat-cell::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: var(--border-strong);
}
```

`--surface-2` background on the stats row creates a recessed-tray feeling inside the white card. The internal dividers use pseudo-elements rather than borders on the cells - this keeps the radius and background clean.

**Menu rows (settings list)**

```css
.menu-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 0 16px;
}

.menu-row {
  height: 54px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.menu-row:last-child {
  border-bottom: none;
}

.menu-row .row-chevron {
  margin-left: auto;
  color: var(--ink-3);
}
```

Chevron icon: Lucide `chevron-right`, 16px, `var(--ink-3)`. Do not use a right-angle arrow or custom SVG - the Lucide chevron is correct.

**Floating + button (FAB)**

```css
.fab-add {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brand);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 14px rgba(44, 74, 20, 0.30),
    0 2px 6px rgba(44, 74, 20, 0.18);
  z-index: 40;
  transition: opacity 0.25s ease, transform 0.15s ease;
}

.fab-add:active {
  transform: scale(0.94);
}
```

Green-tinted shadow on the FAB matches the hero card shadow logic. The FAB does not use `--radius-xl` - circles are circles. The shadow should push outward in the direction of the green card's visual gravity.

---

### 2.10 Bottom sheets and overlays

**Handle pill**

```css
.sheet-handle {
  width: 36px;
  height: 4px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 2px;
  margin: 10px auto 0 auto;
}
```

36px x 4px. Centred. 10px from the top edge of the sheet. No label, no chevron alongside it - the handle is a universal pattern users recognise.

**Sheet background and top radius**

```css
.bottom-sheet {
  background: var(--surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;   /* 28px 28px 0 0 */
  box-shadow:
    0 -4px 24px rgba(0, 0, 0, 0.12),
    0 -1px 6px rgba(0, 0, 0, 0.07);
}
```

28px radius at top corners only. Bottom corners are 0 - the sheet anchors to the viewport edge. The upward-direction shadow uses negative Y values to cast upwards.

**Walk detail overlay (full-screen sheet)**

```css
.walk-detail-overlay {
  background: var(--bg);              /* cream, not white */
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow:
    0 -4px 24px rgba(0, 0, 0, 0.14),
    0 -1px 6px rgba(0, 0, 0, 0.08);
}
```

The walk detail overlay background is `var(--bg)` (cream) rather than `var(--surface)` (white). This is because the overlay contains cards within it (stats section, description section, reviews). Those inner cards need to be white `var(--surface)` floating on the cream background - same layer logic as the main app. If the overlay were white, the inner cards would have no background to float against.

**Scrim**

```css
.scrim {
  background: rgba(0, 0, 0, 0.40);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
```

2px backdrop blur on the scrim is a refined touch - it softens the content behind the overlay without obscuring it completely. This is a permitted use of blur (it is behind the active surface, not the surface itself).

---

## Section 3 - Micro-details

### 3.1 Transitions and active states

**Tap/press scale:** `transform: scale(0.97)` on `:active`. Do not change this value. 0.97 is the correct amount of physical compression for a card. Values below 0.95 look like a button press rather than a tap. Values above 0.98 are imperceptible on smaller elements.

**Transition on all interactive elements:**

```css
transition: transform 0.15s ease;
```

0.15s is the correct duration. Shorter than 0.12s feels mechanical. Longer than 0.18s feels sluggish for a tap response.

**Tab bar transitions (icon state change):**

```css
transition: background 0.2s ease, color 0.2s ease;
```

Slightly slower than tap feedback because tab switches are intentional navigation, not reactive touches.

**Bottom sheet open animation (unchanged from existing spec):**

```css
animation: sheet-rise 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
```

The spring cubic-bezier is retained. Do not alter this.

**Hover states (desktop/mouse):** Apply `opacity: 0.90` on hover to interactive elements. Do not add background changes on hover - the app is mobile-first and hover states should be minimal, not a second design layer. Cursor: pointer on all interactive elements.

**Android haptic feedback:** Call `navigator.vibrate(10)` (10ms) on heart/favourite toggle. Call `navigator.vibrate([30, 20, 60])` on badge earn. No vibration on standard taps or navigation. These are conditional on `navigator.vibrate` being available - wrap in a typeof check.

---

### 3.2 Empty states

**Stats with no data (Me tab dashes)**

Render em-dashes (--) as the zero state for number cells. Font: Fraunces 700 at the same size as the actual stat. Colour: `var(--ink-3)` rather than `var(--ink)`. This reads as "this cell is waiting for data" rather than "this is broken".

Do not render a zero ("0"). Zero implies the user has walked zero times. A dash implies the counter has not started.

**Walks not yet logged**

Empty walk log on Me tab: render a single card with `--surface-2` background, `--radius-lg`, dashed border (`2px dashed var(--border-strong)`), centred Lucide `footprints` icon (32px, `--ink-3`), and two lines of copy:

- Line 1: `Your walks will appear here.` (Inter 600, 15px, `--ink-2`)
- Line 2: `Log your first walk after heading out.` (Inter 400, 13px, `--ink-3`)

No button. No CTA. The empty state is informative, not promotional.

**Making these feel intentional:** The dashed border treatment signals "something goes here" in a deliberate way. The Fraunces dashes for stats feel considered because they match the typeface used for the actual numbers. The visual treatment confirms these are placeholders, not bugs.

---

### 3.3 The cream-to-white transition

**Tab bar backdrop blur:** Yes, required. Specified in 2.8. The cream background is warm enough that scrolling walk cards (white, floating) moving behind an opaque white tab bar creates a jarring hard edge. The 16px backdrop blur dissolves that edge correctly.

**Hero card margin:** Keep 16px horizontal margin. Do not bleed the hero card to the viewport edges. The floating effect - the entire visual premise of Signature Tactile - depends on the background being visible around the card. If the card bleeds to the edges there is nothing to float above. 16px margin on each side is the minimum needed to read as floating.

**Section spacing:** 20px gap between major sections (hero card to carousel label, carousel to next section). 12px gap between items within a section (card to card in list). 8px gap between chips.

**Page top padding:** 16px below the tab content area header before the first content element.

**Page bottom padding:** `padding-bottom: 96px` on all scrollable tab containers. This ensures content is not hidden behind the tab bar + safe area.

---

### 3.4 Badge and label system

**"Sniffout Pick" badge**

```css
background: var(--brand-tint);         /* #EDF2E8 */
color: var(--brand);                   /* #2C4A14 */
font-size: 11px;
font-weight: 700;
letter-spacing: 0.03em;
padding: 3px 8px 3px 6px;
border-radius: var(--radius-pill);     /* 100px */
```

Icon: Lucide `star` 10px, filled, before the text. Gap 4px between icon and text.

**"Hidden gem" badge**

```css
background: #F5ECD7;
color: #7A5200;
font-size: 11px;
font-weight: 700;
letter-spacing: 0.03em;
padding: 3px 8px 3px 6px;
border-radius: var(--radius-pill);
```

Icon: Lucide `gem` 10px before the text.

**"Popular" badge**

```css
background: #F0EAF8;
color: #5C2D91;
font-size: 11px;
font-weight: 700;
letter-spacing: 0.03em;
padding: 3px 8px 3px 6px;
border-radius: var(--radius-pill);
```

Icon: Lucide `trending-up` 10px before the text.

**"New" badge**

```css
background: var(--amber-tint);         /* #FEF3E2 */
color: var(--amber);                   /* #B07A28 */
font-size: 11px;
font-weight: 700;
letter-spacing: 0.03em;
padding: 3px 8px 3px 6px;
border-radius: var(--radius-pill);
```

Icon: Lucide `sparkles` 10px before the text.

**Difficulty chips**

Easy:
```css
background: #E8F0E8;
color: #2C4A14;
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

Moderate:
```css
background: var(--amber-tint);         /* #FEF3E2 */
color: var(--amber);                   /* #B07A28 */
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

Hard:
```css
background: var(--red-tint);           /* #FFEBE9 */
color: var(--red);                     /* #C0392B */
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

**Off-lead chips**

Full off-lead:
```css
background: #E8F0E8;
color: #2C4A14;
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

Icon: Lucide `dog` 11px before text.

Partial off-lead:
```css
background: var(--amber-tint);
color: var(--amber);
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

Icon: Lucide `dog` 11px before text.

On lead:
```css
background: #F0EFEE;
color: #5A5A5A;
font-size: 12px;
font-weight: 600;
padding: 3px 10px;
border-radius: var(--radius-pill);
```

Icon: Lucide `dog` 11px before text (same icon, colour differs).

---

## Section 4 - Dark / Night Mode

Night mode is applied via `body.night`. All tokens below are overrides within that selector.

### 4.1 Layer system in night mode

**Layer 0 - Page background**

```css
body.night { --bg: #141414; }
```

Near-black. Not pure black (#000000) which creates excessive contrast. #141414 is the correct starting point - warm enough to not feel sterile, dark enough to be a true dark mode.

**Layer 1 - Card surfaces**

```css
body.night { --surface: #1E1E1C; }
```

#1E1E1C rather than #1F1F1F (the current value). The two-point warmth shift (from neutral grey to barely warm) mirrors the day mode logic - surface slightly warmer than a pure neutral. The difference is subtle but it prevents the interface from reading as cold blue-grey.

**Layer 2 - Surface secondary**

```css
body.night { --surface-2: #252523; }
```

Slightly elevated from surface, same warmth offset. Used for stat fill areas, input backgrounds, segmented controls.

### 4.2 Text tokens in night mode

```css
body.night {
  --ink:   #F4F2EE;   /* primary - warm white, not stark */
  --ink-2: #8A8A8A;   /* secondary - mid grey */
  --ink-3: #5E5E5E;   /* tertiary - darker grey, readable on dark surface */
}
```

### 4.3 Border tokens in night mode

```css
body.night {
  --border:        rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.12);
}
```

### 4.4 Brand tokens in night mode

```css
body.night {
  --brand:       #6A9B4A;   /* text and icons only - lightened for contrast on dark */
  --brand-mid:   #3D6B22;   /* backgrounds with brand colour - darker, holds identity */
  --brand-tint:  #1E2E17;   /* dark equivalent of light tint - near-black green */
}
```

The two-value brand rule in dark mode: `#6A9B4A` for text and icons only. `#3D6B22` for any background that is brand-coloured (active chip fill, FAB, etc.). Never use `#6A9B4A` as a background - it is too vivid on a dark surface and will vibrate against dark text. Never use `#3D6B22` for text - it lacks contrast on dark backgrounds.

### 4.5 Shadow adjustments in night mode

Drop shadows do not work on dark backgrounds - they are invisible. The shadow system must switch to border-based elevation in night mode.

**Layer 1 cards in night mode:**

```css
body.night .walk-card-carousel,
body.night .walk-card-full,
body.night .venue-card,
body.night .filter-card,
body.night .menu-card,
body.night .green-space-card {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.07);
}
```

A single-pixel inset ring (via box-shadow, not border - border would shift layout) at 7% white opacity reads as card edge definition on a dark background. This replaces the lift shadow.

**Layer 2 hero card in night mode:**

```css
body.night .weather-hero {
  background: #1A3522;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

The green-tinted drop shadow from light mode is removed. The inner highlight stays at reduced opacity (8%). The 1px ring provides definition.

**Bottom sheet in night mode:**

```css
body.night .bottom-sheet {
  background: var(--surface);         /* #1E1E1C */
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.07),
    0 -4px 24px rgba(0, 0, 0, 0.40);
}
```

Upward shadow can be heavier in dark mode because the dark scrim already provides contrast. 40% black shadow is correct.

### 4.6 Tab bar in night mode

```css
body.night .tab-bar {
  background: rgba(20, 20, 20, 0.92);
  border-top-color: rgba(255, 255, 255, 0.07);
}
```

The backdrop blur works correctly in dark mode - it blurs dark content behind the bar.

### 4.7 Category chips in night mode

Inactive chip:
```css
body.night .chip {
  background: var(--surface-2);        /* #252523 */
  border-color: rgba(255, 255, 255, 0.12);
  color: var(--ink-2);
}
```

Active chip:
```css
body.night .chip.chip--active {
  background: var(--brand-mid);        /* #3D6B22 - not #6A9B4A */
  border-color: var(--brand-mid);
  color: #FFFFFF;
}
```

Active chip uses `--brand-mid` (#3D6B22) as background because it is a background, not text. White label on dark green background has sufficient contrast. Do not use `--brand` (#6A9B4A) as the active chip background in dark mode.

### 4.8 Hero card states in night mode

Caution (marginal):
```css
body.night .weather-hero.hero--caution {
  background: #4A2C00;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}
```

Avoid (poor):
```css
body.night .weather-hero.hero--avoid {
  background: #4A0E0E;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}
```

Both dark mode state colours are significantly darker than their light equivalents. In dark mode, rich saturated backgrounds compete with the surrounding dark UI - darker, more muted state colours feel correct and maintain the premium feel.

---

## Token reference - complete custom property list

```css
:root {
  /* Layers */
  --bg:            #F0EDE6;
  --surface:       #FFFFFF;
  --surface-2:     #F7F4EF;

  /* Text */
  --ink:           #1A1A1A;
  --ink-2:         #6B6B6B;
  --ink-3:         #9E9E9E;

  /* Borders */
  --border:        rgba(0, 0, 0, 0.07);
  --border-strong: rgba(0, 0, 0, 0.12);

  /* Brand */
  --brand:         #2C4A14;
  --brand-mid:     #3D6520;
  --brand-tint:    #EDF2E8;

  /* Status */
  --amber:         #B07A28;
  --amber-tint:    #FEF3E2;
  --red:           #C0392B;
  --red-tint:      #FFEBE9;

  /* Radius */
  --radius-sm:     10px;
  --radius-md:     14px;
  --radius-lg:     20px;
  --radius-xl:     28px;
  --radius-pill:   100px;
}

body.night {
  --bg:            #141414;
  --surface:       #1E1E1C;
  --surface-2:     #252523;

  --ink:           #F4F2EE;
  --ink-2:         #8A8A8A;
  --ink-3:         #5E5E5E;

  --border:        rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.12);

  --brand:         #6A9B4A;
  --brand-mid:     #3D6B22;
  --brand-tint:    #1E2E17;

  --amber:         #D4962F;
  --amber-tint:    #2A1E08;
  --red:           #E05A5A;
  --red-tint:      #2A0E0E;
}
```

---

*Spec produced by Designer agent, 2026-03-26. No code files were modified. For implementation questions, refer to CLAUDE.md architecture notes and the existing design elevation spec at docs/specs/design-elevation-spec-march-23.md.*
