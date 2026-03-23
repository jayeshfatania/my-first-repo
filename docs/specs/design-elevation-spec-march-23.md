# Sniffout — Design Elevation Recommendations
**Date:** 23 March 2026
**Author:** Designer
**Status:** Owner review required before any Developer briefing
**Inputs:** CLAUDE.md, session-handoff-march-23.md (Section 11), competitive-analysis-march-23.md, product-vision-update.md
**Scope:** Recommendations only. No app files edited. All recommendations require owner approval before being briefed to the Developer.

---

## Context Before Starting

The honest framing for this review: Sniffout's design is functional and coherent. The CSS token system is well-considered. The card-based layout is correct. The dark mode is implemented properly. These are not small things - many single-file PWAs ship with much less rigour.

But "functional and coherent" is not the same as "beautiful, sleek, modern, and something users feel good about." The gap is real and identifiable. It has four root causes:

1. Inter-only typography creates no hierarchy and no character. Every screen reads at the same visual temperature.
2. 97 of 100 walk images are the same placeholder. No amount of card polish compensates for 97 identical images.
3. The brand green (#3B5C2A) is being used as an accent, not as a presence. Premium apps use colour with intention and confidence.
4. There are no moments of design delight - no animation, no considered transitions, no empty states with personality. The app does not feel alive.

Each is fixable without touching the architecture. The single HTML file constraint is not an obstacle. CSS transitions are more powerful than most PWA designers use them. A display typeface costs one CDN import. These are choices, not limitations.

Reference app analysis: AllTrails succeeds through photography and confident typography. Deliveroo through colour boldness and typographic hierarchy. Too Good To Go through warmth and mission framing. Monzo through micro-copy and empty states with character. Chase UK through restraint and considered spacing. Sniffout needs to borrow from all five - but its emotional territory (personal, warm, dog-centric, UK-specific) is actually closer to Monzo and Too Good To Go than to AllTrails.

---

## Area 1 - Brand Colour and Palette

### Current state assessment

#3B5C2A (Meadow Green) was confirmed after reviewing eight alternatives. It is not a bad colour. It is a mid-tone forest green that reads immediately as "outdoors app." The problem is exactly that: it reads as *generic* outdoors app. It lacks the punch of a darker tone and the energy of a brighter one. It sits in the average zone.

There is a secondary issue: Too Good To Go uses #2B4C3F as their primary green. It is darker and has a slight teal lean, but the family resemblance is there. A Sniffout user who also uses TGTG will feel an echo.

In dark mode, the brand lightens to #5C7A63 - a muted mid-green that lacks authority. It reads as a tertiary accent rather than a brand colour.

The current palette is also incomplete. There is one brand colour, semantic colours (amber, red), and neutrals. There is no warm secondary colour and no brand tint surface. Premium apps use their colour across the full surface hierarchy, not just on interactive states.

**Verdict: FULL REDESIGN NEEDED - colour and palette together. Not a minor adjustment.**

### Recommendation

**Primary: Change to #2C4A14 (Woodland Green)**

Rationale: Deeper, darker, and warmer than the current #3B5C2A. Reads as hedgerow and woodland floor rather than park grass. Clearly differentiated from TGTG's teal-leaning #2B4C3F. Has the authority to work as a hero background colour (important for the Today tab and badge fills) not just as an accent. Passes WCAG AA contrast against white at all display sizes.

The shift is approximately 8 units darker in lightness and 4 units warmer in hue. In practice it means the active state dots, the primary button, and any brand-coloured elements will feel like they belong to a product with conviction rather than a product that is hedging.

**Palette recommendation:**

| Token | Current | Recommended | Notes |
|-------|---------|-------------|-------|
| `--brand` | `#3B5C2A` | `#2C4A14` | Woodland Green - deeper, warmer, more authoritative |
| `--brand-mid` | (none) | `#3D6520` | Mid-tone brand for hover states, filled chip backgrounds |
| `--brand-tint` | (none) | `#EDF2E8` | Very light green tint surface - for reminder rows, info panels, active tab highlight |
| `--brand-dark` (dark mode) | `#5C7A63` | `#6A9B4A` | Lightened for dark mode - more vivid than current, holds the brand identity |
| `--amber` | `#D97706` | `#B07A28` | Warm amber shifted slightly earthier - autumn walks feel, pairs with woodland green |
| `--bg` | `#F7F5F0` | `#F7F5F0` | Keep. Warm off-white is correct. |
| `--surface` | `#FFFFFF` | `#FFFFFF` | Keep. |
| `--ink` | `#1A1A1A` | `#1A1A1A` | Keep. |
| `--ink-2` | `#6B6B6B` | `#6B6B6B` | Keep. |
| `--red` | `#EF4444` | `#EF4444` | Keep. |

**Why amber as the secondary:** Dog leads, autumn leaves, muddy paths, the warmth of a dog-friendly cafe. Amber is the natural companion to deep forest green. It works as an accent without fighting the brand. Used sparingly on tags, highlights, badges, and the walk verdict "good conditions" treatment.

**What to do with colour once changed:**

The brand green should appear in more places than just active states. Consider: the Today tab hero card background, stat number colour in the Me tab, the walk verdict positive state, badge fill colours, section headers on the Me tab. The current use is timid - active dots and a primary button do not establish a brand presence. The colour needs to be present.

**Priority: HIGH - but this is a compound change (all references update). Plan as a dedicated round.**

---

## Area 2 - Typography

### Current state assessment

Inter 400/500/600/700 is a well-considered UI typeface. It is highly legible, renders beautifully on Android Chrome, and the weights are used correctly. None of this is wrong.

What Inter cannot do is create character at large display sizes. At 48px, Inter 700 looks like a data label. It has no editorial personality, no warmth, no moment of differentiation. Every competitor using Inter as their only typeface has the same problem. When you open a Monzo card and feel the quality, a significant portion of that quality comes from their typographic treatment of the number at the top. The typeface is doing emotional work that Inter cannot do alone.

For Sniffout specifically: "Paws before you go." is the app's headline. It is witty, warm, and distinctive. But if it is set in Inter 700, it reads like a toast notification header. The copy is doing all the work. The typography should be helping.

The type scale also currently has insufficient contrast. Without seeing the exact values, a common problem with Inter-only systems is that headings at 20px and 24px feel too similar in weight. The scale does not breathe.

**Verdict: FULL REDESIGN NEEDED - display typeface addition required.**

### Recommendation

**Add Fraunces as the display typeface for hero moments and walk names.**

Fraunces (Google Fonts, free) is a variable optical-size serif with genuine personality. It is warm without being frilly, distinctive without being hard to read, and it has a slightly soft, natural quality that is entirely appropriate for an outdoor dog-walking app. It won a Type Directors Club award. It is not default or generic.

Where Inter fails at large sizes, Fraunces excels. At 48px it looks crafted. At 14px (using the small optical size) it is also highly legible as a body text option. The variable axes (`opsz`, `wght`, `WONK`) give significant flexibility within a single font file.

CDN import (add to the `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap" rel="stylesheet">
```

**Usage rules - Fraunces applies to:**
- State A main headline ("Paws before you go.")
- Today tab hero verdict headline (the walk verdict string)
- Walk detail overlay walk name (the title at the top of the detail sheet)
- Me tab hero stat number (the primary walk count: "34")
- Me tab section headers ("Your walks", "Badges")
- Badge names when displayed earned
- Walk Wrapped headlines (Phase 2)
- The walk count in the nav or explore bar if displayed prominently

**Usage rules - Inter applies to:**
- All body copy (descriptions, supporting lines)
- All UI labels (buttons, tags, chips)
- All navigation labels
- All form elements
- All secondary stats and numbers
- All error messages and system copy
- All data displays (temperature, distance, time)

**Recommended type scale:**

| Role | Typeface | Weight | Size | Line height |
|------|----------|--------|------|-------------|
| Hero display | Fraunces | 700 | 44-48px | 1.05 |
| Section display | Fraunces | 600 | 28-32px | 1.15 |
| Card headline | Fraunces | 500 | 19-21px | 1.2 |
| Hero number (Me tab stat) | Fraunces | 700 | 52-60px | 1.0 |
| Body (descriptions) | Inter | 400 | 15px | 1.55 |
| UI label (buttons, tags) | Inter | 500 | 14px | 1.3 |
| Caption / meta | Inter | 400 | 12-13px | 1.4 |
| Navigation labels | Inter | 500 | 11px | 1.0 |

**Note on letter-spacing:** Fraunces at display sizes does not need negative letter-spacing in the way some geometric sans-serifs do. Inter at small label sizes (11-13px) benefits from `letter-spacing: 0.01em` for legibility. Inter navigation labels can use `letter-spacing: 0.02em`.

**Performance note:** Fraunces is a variable font. Loading only the opsz and wght axes (as specified in the CDN URL above) keeps the payload small. The `display=swap` parameter prevents a flash of invisible text. This is a standard, safe Google Fonts implementation and adds no meaningful load penalty on Android Chrome.

**Priority: HIGH - single CDN line and CSS class additions. This is the highest-impact-per-effort change in this document.**

---

## Area 3 - Card Design

### Current state assessment

The card system itself is sound: `border-radius: 16px`, `1px solid var(--border)`, no blur. These are correct decisions. 16px radius is modern. No glassmorphism is a sensible call after the glassmorphism trend peaked and aged poorly.

Three specific problems:

**Problem 1: The placeholder.** 97 of 100 walk cards show the same image. This is the most visible design problem in the entire app. A user browsing the Walks tab sees a grid of identical images. No amount of card refinement compensates for this. It reads as: the app is not finished.

**Problem 2: No shadow.** The current 1px border treatment is clean but flat. Premium cards in 2026 use a subtle multi-layer box-shadow rather than (or in addition to) a border. The shadow adds the physical sense that the card is lifted from the surface. AllTrails and Deliveroo both use shadow-based card elevation.

**Problem 3: Image aspect ratio and treatment.** Without knowing the exact implementation, the portrait card format for walk cards should follow a consistent aspect ratio. 3:2 (horizontal) is correct for mobile walk cards - it shows enough of the landscape without making the card uncomfortably tall. 16:9 feels too cinematic and crops the composition awkwardly.

**Verdict: POLISH NEEDED for the card component itself. FULL REDESIGN NEEDED for the placeholder strategy.**

### Recommendations

**Placeholder redesign - implement immediately.**

The current `placeholder-walk.jpg` file is a single image shared across all 97 walks. The redesign recommendation is a CSS-only gradient placeholder that feels intentional and on-brand. No new image file needed.

Replace the `<img>` fallback or background image placeholder with a CSS gradient pattern:

```css
.walk-card-placeholder {
  background: linear-gradient(
    160deg,
    #2C4A14 0%,
    #3D6520 45%,
    #4E7A2A 70%,
    #3A6018 100%
  );
  position: relative;
}

.walk-card-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(0,0,0,0.35) 100%
  );
}
```

This is a deep green gradient with subtle variation - different tonal ranges within the brand palette. It reads as: intentional, designed, part of the brand. Not as "missing image." The gradient overlay at the bottom ensures walk name text remains legible regardless.

**Optional enhancement:** If different gradient directions are applied per walk ID (modulo 4 or 6 options), each card will feel visually distinct even before real photos arrive. This is one line of JS per card and zero performance cost.

**Real photo standard (for when photos arrive):**
- Aspect ratio: 3:2 (consistent across all walk cards). Walk detail hero: 16:9.
- Loading state: gradient placeholder above fades to the loaded image with `transition: opacity 400ms ease`
- Error state: same gradient placeholder - never show a broken image icon
- No filters or colour treatments on loaded images - the photos should stand on their own

**Card shadow - replace border with shadow + lighter border:**

```css
.walk-card {
  border: 1px solid rgba(0,0,0,0.06); /* lighter than current */
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 1px 2px rgba(0,0,0,0.04);
}

.walk-card:active {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transform: scale(0.985);
  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

In dark mode, shadows are less effective (dark on dark). In `body.night`, replace with a slightly lighter border:
```css
body.night .walk-card {
  border-color: rgba(255,255,255,0.1);
  box-shadow: none;
}
```

**Information hierarchy on walk cards:**

Walk name at the top in Fraunces 500. Location and distance in Inter 400 at `--ink-2`. Badges (Hidden gem, Sniffout Pick, etc.) as small pills. Condition icons at the bottom edge. This ordering should place the emotional hook (the walk name and its character) at the top where it draws the eye, not the data.

**Priority: HIGH (placeholder redesign), MEDIUM (shadow refinement)**

---

## Area 4 - Bottom Navigation

### Current state assessment

Five-tab navigation with filled/outlined icon states and brand colour active indicator. The layout and interaction model are correct. Five tabs is at the functional limit for mobile - six would be too many, four would lose a primary tab.

The label set (Today, Weather, Walks, Nearby, Me) is mostly strong. One specific weakness: "Weather" is a generic label for what Sniffout does with weather, which is not display weather data but give an opinion about whether to walk. The label undersells the product. "Today" already covers the time context. "Weather" reads as "weather forecast," which is what every other app offers.

Icon consistency: Lucide icons are a good choice. The risk is in the sizes and stroke weights at small sizes. Navigation icons at 22-24px with a 1.5px stroke are at the minimum for comfortable recognition on mid-range Android screens. Going to 24px icon with 2px stroke is safer.

**Verdict: POLISH NEEDED**

### Recommendations

**Consider renaming "Weather" to "Forecast" or retaining "Weather" but treating it differently in the hero card.**

Option A: Rename to "Forecast" - slightly more specific and less generic than "Weather." But "Forecast" is still a data word, not an opinion word.

Option B: Keep "Weather" as the tab label but ensure the tab's hero card headline uses opinion language ("Today looks like a great walk" rather than "Weather conditions"). The tab label is navigation infrastructure; the content heading is the brand moment.

Recommendation: Keep "Weather" for now. The label is not the problem - the hero content treatment is the problem (addressed in Area 6). Revisit the label as part of any future navigation redesign.

**Active state refinement:**

The current active state uses the brand colour on the icon and label. This is correct. Enhancement: add a small background pill behind the active icon (similar to Material Design 3's navigation bar treatment). A `--brand-tint` background pill (12px high, 48px wide, brand-tint fill) behind the active icon adds visual weight and makes the active state clearer without being noisy. This is a `::before` pseudo-element, no JS.

**Icon sizing:**

If icons are currently below 24px, increase to 24px. If stroke weight is below 2px, increase to 2px. These are Lucide SVG attributes and are straightforward to adjust globally.

**Label refinement:**

Navigation labels at 11px Inter 500 with `letter-spacing: 0.02em` would feel considered rather than default. All five labels should be in consistent sentence case (as they are).

**Priority: LOW (current state is functional - refinements add polish, not premium feel)**

---

## Area 5 - State A (First Run Screen)

### Current state assessment

The headline "Paws before you go." is the strongest piece of copy in the app. It is the kind of headline that gets screenshotted and shared. Do not change it.

The social proof strip "Know the route - Own the weather - Find dog-friendly spots" is functional but the visual treatment is doing no work. Three bullet items separated by dots or dashes is the pattern every onboarding screen has used since 2014. It is forgettable.

The deeper problem: State A is the most important screen for first impressions and it currently asks 97 placeholder images to do the work of showcasing a product about beautiful places. A showcase carousel of identical placeholders actively undermines the headline. For a first-time user, the honest reading is: "This app does not have content yet."

The seven showcase carousel walks (`isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland`) are the most important photography brief in the entire product. Getting real photos for these seven walks is more impactful on premium perception than any other single design change.

Comparison: Too Good To Go onboarding uses full-bleed food photography that makes the product feel immediately desirable. Monzo's onboarding uses bold typography and a coral background card to create a brand moment. State A needs one of these two approaches - either bold typography on a brand-coloured background that sells the concept without depending on photography, or outstanding photography.

**Verdict: FULL REDESIGN NEEDED (photography strategy) / POLISH NEEDED (layout and typographic treatment)**

### Recommendations

**Immediate (before photos exist):**

Treat State A as a typographic brand moment. A full-bleed brand-coloured section at the top (using `--brand` at the new #2C4A14) with the headline "Paws before you go." in Fraunces 700 at 44px in white, plus the Luna/dog name if set. This is "Too Good To Go approach" - the brand colour does the work that photography cannot yet do.

The social proof strip should be redesigned. Replace the three-item dot-separated list with three small illustrated or icon-led cards in a horizontal row - each with a single icon and a 2-3 word label. Achievable in CSS alone. More considered than a text list.

**Photography brief (owner action - not Designer or Developer):**

Sourcing photos for the seven showcase carousel walks is the owner's highest-priority design action. Criteria for each photo:
- Landscape orientation (3:2 for cards, 16:9 for full-bleed hero)
- Natural light, no heavy filters
- Dog present if possible (ideally a dog running free, swimming, or on the path)
- UK weather and landscape character - overcast and green is fine, does not need to be blue sky
- No logos, no people's faces prominently
- Minimum 1200px wide
- Royalty-free or owner-photographed

**Typography treatment:**

The main headline "Paws before you go." should be in Fraunces 700 once the display typeface is added. At 44px on a brand-coloured background this will be the first thing that tells a new user this app was made by someone who cares.

**Priority: HIGH (photography) / MEDIUM (typographic treatment)**

---

## Area 6 - Today Tab Hero Card

### Current state assessment

The Today tab hero card is the app's "Monzo balance" - the thing users open the app to see. Whether it lands as a confident opinion or a data readout depends almost entirely on typographic hierarchy and the presence of personalisation.

The weather verdict string is the heart of this card. If it is displayed at the same weight and size as the temperature reading, it loses its authority. It needs to be visually dominant.

The dark mode override (`#1A3522`) for the weather hero background is a good instinct. A dark green card stands out on the `#141414` page background and feels premium. In light mode, the card background should follow the brand token recommendations.

The specific gap vs Monzo's balance card: Monzo shows you one number in the largest, most confident typography on the screen, and it is *your* number (your money). Sniffout's Today card has the potential to show you one line in the most confident typography on the screen - "Good walk today, Luna" - and it is *yours* (your weather verdict for your walk with your dog). Currently it likely does not achieve this because the typography does not give the verdict that dominance.

**Verdict: POLISH NEEDED - the architecture is right, the typographic hierarchy needs work.**

### Recommendations

**Make the verdict string dominant.**

The weather verdict text should be in Fraunces 600 at 26-30px. The temperature and condition summary should be in Inter 500 at a smaller size (15-16px). The hierarchy is: verdict first, data second.

If the dog's name is available from the profile (Luna), the verdict should read: "Good walk today, Luna." If no dog profile, it reads: "Good walk today." The dog name transforms this from a data readout into a personal communication. This is a copy interpolation, not a design change.

**Colour treatment:**

For approved/good conditions: card background uses `--brand` (#2C4A14 recommended) with white text. This is bold and confident.

For caution/hazard conditions: card background uses `--amber` (#B07A28 recommended) with white text. This creates an immediate, unmissable visual signal.

For dangerous conditions: card background uses `--red` (#EF4444) with white text.

A walk verdict card in deep green with white Fraunces text saying "Good walk today, Luna" is the premium moment this tab needs. It is a deliberate design choice that says: this product has a point of view.

**Personalisation placement:**

Luna's name (or the dog's name if the user has set a profile) should appear in:
1. The walk verdict headline (most important - every app open)
2. The "X walks with Luna" stat on the Me tab (second most important)
3. The walk log entry context ("You and Luna walked here")

These three instances are the minimum for the personalisation to feel like a product design choice rather than a nice-to-have.

**Priority: HIGH - this is the most frequently viewed surface in the app.**

---

## Area 7 - Me Tab

### Current state assessment

The Me tab is the personal record and is strategically the most important tab in the product under the "discovery to journal" repositioning. The risk is that it reads as a settings screen with some stats.

The primary stat (walks explored) should be the hero element on the Me tab. If it is displayed in Inter at the same weight as everything else, it is data. If it is displayed in Fraunces 700 at 52-60px with "walks with Luna" in Inter 400 below it, it is a personal milestone - closer to the Fitbit lifetime miles screen or the Spotify Wrapped headline stat.

Dog profile card: the dog profile needs to be the emotional anchor at the top of the Me tab. Not a form. Not a settings row. An identity. Luna's name large, breed below, a placeholder circle for the eventual photo - this is the product promising that it was built for dog owners.

Badge display: the current badge spec (from `docs/specs/badge-system-rethink.md`) exists. The visual treatment needs to feel earned, not earned-in-a-points-app. The product vision document confirms: silhouette state for unearned badges, no progress indicators, understated reveal. These are correct design principles. The badge shape and colour treatment will determine whether they feel like something worth displaying.

**Verdict: POLISH NEEDED (stat display and dog profile card) / FULL REDESIGN NEEDED (badge visual design - separate spec noted as in-flight)**

### Recommendations

**Primary stat treatment:**

The walks explored stat (the primary "hero stat" confirmed in the product vision document) should use Fraunces 700 at 52-60px for the number, with "walks with [dog name]" or "walks explored" in Inter 400 at 15px directly below. This is the Monzo balance moment for the Me tab. It should be the largest text element on the screen.

CSS for the primary stat number:
```css
.me-stat-card--primary .stat-number {
  font-family: 'Fraunces', serif;
  font-size: 56px;
  font-weight: 700;
  color: var(--ink); /* as per existing spec - do not change */
  line-height: 1.0;
  letter-spacing: -0.01em;
}
```

Note: CLAUDE.md specifies that the primary stat card number colour is `var(--ink)` in both light and dark mode. This instruction is maintained here.

**Dog profile card:**

At the top of the Me tab, before the stats grid, the dog profile card should feel like identity, not settings. Recommended treatment:
- Full-width card on `--surface`
- Dog avatar: 72px circle with a brand-tint fill and an outlined dog icon in `--brand`, or (once Phase 3 photo storage is live) the dog's actual photo
- Dog name in Fraunces 600 at 22px
- Breed and age in Inter 400 at 13px, `--ink-2`
- Tap target: the whole card opens the dog profile editor

This card should feel warm and personal. It should not look like a user account row.

**Walk journal display:**

Individual walk log entries should show the walk name in Fraunces 500 (not Inter), with the date and conditions in Inter 400 below. If a note exists for that entry, the first line of the note should appear below the conditions in Inter 400 italic, `--ink-2`. This single change transforms the walk list from a log into a journal.

**Priority: HIGH (stat display) / MEDIUM (dog profile card) / see badge spec for badge treatment**

---

## Area 8 - Micro-interactions and Emotional Design

### Current state assessment

CSS transitions exist in the current build (the bottom sheets slide in, tab content presumably fades). But micro-interactions specifically tuned for the emotional design of the product (the first walk logged, the badge earned, the heart tapped) are not documented anywhere and are likely absent or generic.

This is the area where the gap between "PWA" and "native app" is most felt by users. Native apps have physical weight because of spring animations, haptic feedback, and GPU-accelerated transitions. CSS transitions can approximate this for the visual layer. Haptic feedback (`navigator.vibrate()`) is available on Android Chrome and costs two lines of JS.

**Verdict: FULL REDESIGN NEEDED - not because the current transitions are wrong, but because the emotional design layer does not yet exist as a deliberate design choice.**

### Recommendations

All of the following are achievable with CSS transitions and minimal JS. No animation libraries. No performance cost if implemented correctly with `transform` and `opacity` (both GPU-composited).

**1. Card tap feedback:**
```css
.walk-card,
.trail-card,
.venue-card {
  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1);
}

.walk-card:active,
.trail-card:active,
.venue-card:active {
  transform: scale(0.97);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```
This gives every card a tactile press response. 100ms is the right duration - fast enough to feel like a physical response, slow enough to be perceptible.

**2. Heart/favourite toggle:**
```css
@keyframes heart-pulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.trail-heart.active {
  animation: heart-pulse 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```
A spring-feeling pulse when the heart is activated. The `cubic-bezier(0.175, 0.885, 0.32, 1.275)` is the "overshoot" easing that makes interactions feel physical. This is the same class of animation Monzo uses for positive confirmation states.

**3. Badge earn animation:**
```css
@keyframes badge-reveal {
  0%   { transform: scale(0.6) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(2deg); opacity: 1; }
  80%  { transform: scale(0.95) rotate(-1deg); }
  100% { transform: scale(1) rotate(0); }
}

.badge-earned-new {
  animation: badge-reveal 450ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
```
The badge drops in with a slight rotation and spring overshoot. Understated enough to feel like a discovery moment, physical enough to feel like an event. Exactly the Monzo "balance updated" register.

**4. Bottom sheet open:**
The current slide-up is correct. Enhancement: add a spring curve to the opening transition.
```css
.bottom-sheet.open {
  transition: transform 350ms cubic-bezier(0.175, 0.885, 0.32, 1.0);
}
```
The slight overshoot (1.0 at the end of the bezier) gives the sheet a physical snap into place. On Android Chrome this is the closest approximation to native spring physics available in CSS.

**5. Tab switch:**
```css
.tab-content {
  transition: opacity 150ms ease,
              transform 150ms ease;
}

.tab-content.entering {
  opacity: 0;
  transform: translateY(4px);
}

.tab-content.active {
  opacity: 1;
  transform: translateY(0);
}
```
A subtle 4px fade-up on tab switch makes the content feel like it is arriving, not just appearing. 150ms keeps it fast.

**6. Walk first log moment:**

When a user logs their first walk (or any walk), a brief positive toast should appear. This already exists per the copy spec (toast 7a). The enhancement is the toast's animation:
```css
@keyframes toast-arrive {
  from { transform: translateY(16px) scale(0.95); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

.toast {
  animation: toast-arrive 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

**7. Empty states:**

Every empty state in the app (no walks explored, no badges yet, no saved places) should have a warm headline and body, not a blank area. Confirmed format from the product vision document:
- No walks explored: "Your walks start here" / "Explore a walk to start building your collection." / "Find a walk" CTA
- No badges yet: name should be something like "Badges find you" / "Keep exploring - your first badge is closer than you think." (no counter, no progress, pure warmth)
- No notes on a walk: "Add a note from today's walk with Luna" as a persistent inline prompt once the walk is logged

**8. Luna moments - where to use the dog's name for maximum effect:**

Priority order (high to low):
1. Today tab hero card verdict: "Good walk today, Luna." (Every app open)
2. Me tab primary stat: "34 walks with Luna"
3. Walk log entries: "You and Luna walked here"
4. First walk badge (when earned): "[Dog name]'s first recorded adventure"
5. Empty state on Me tab: "Where are you and Luna walking next?"

These five placements create the "personal record" feel without requiring any additional data. The dog's name is already in localStorage. This is a copy interpolation, not an engineering change.

**Android haptic feedback (two lines of JS):**
```js
// On heart toggle:
navigator.vibrate && navigator.vibrate(10);

// On badge earn:
navigator.vibrate && navigator.vibrate([50, 30, 80]);
```
`navigator.vibrate(10)` is a 10ms pulse - felt but not intrusive. The badge pattern (50ms - pause - 80ms) is a short-long double pulse that feels like an event. Both are `navigator.vibrate` standard, available on Android Chrome, and gracefully no-op on iOS (which does not support `navigator.vibrate`). These are not CSS but they are two lines and the impact on Android is significant.

**Priority: HIGH (card tap and heart pulse - the most visible interactions) / MEDIUM (tab switch, sheet open) / MEDIUM (empty states) / LOW (haptic - impactful but optional)**

---

## Area 9 - Dark Mode

### Current state assessment

Scheme B (Dark Slate) is implemented: `--bg: #141414`, `--surface: #1F1F1F`. The near-black background is correct - there is a common mistake of using "dark blue" as a dark mode background (Twitter/X, old GitHub) which looks like a theme, not a true dark mode. Pure near-black is the right call.

The surface at #1F1F1F is adequate but could be warmer. Pure grey surfaces in dark mode feel like operating systems, not products. A very slight warm tint shifts the perception from "dark mode" to "the product, but at night." The difference is subtle - approximately 1-2 units warmer on the hue axis.

`--ink-2` at #8A8A8A is slightly too light in some dark mode contexts. Secondary text needs to be visually distinct from primary text but not so light it vanishes on the surface. #909090 or #8A8A8A is at the edge of acceptable contrast for 13px Inter 400 text. Worth checking against WCAG AA.

The brand in dark mode (`--brand-dark` at current #5C7A63) needs updating if the primary brand changes to #2C4A14. The recommended #6A9B4A is more vivid, holds the brand identity better, and has more authority as an accent colour on dark surfaces.

Comparison to Monzo dark mode: Monzo uses a warm near-black (#1A1A1A background, #252525 surface) with a slightly warm tint. Chase UK uses pure cool dark (#0E0E0E). Monzo's warmth wins - it feels like a product you chose to use, not a system utility.

**Verdict: POLISH NEEDED - architecture is correct, warmth and brand colour need updating.**

### Recommendations

**Surface warmth adjustment:**

```css
/* Current */
--surface: #1F1F1F;

/* Recommended */
--surface: #1E1E1C; /* 2 units warmer - barely perceptible but meaningful */
```

This is a minimal change. The warmth is barely perceptible numerically but the perceptual shift from "cool grey box" to "warm dark surface" is real at a glance.

**Brand in dark mode:**

With the primary brand change to #2C4A14, the dark mode brand token updates:
```css
body.night {
  --brand: #6A9B4A; /* was #5C7A63 - more vivid, better brand presence */
}
```

This makes the active nav dots, brand-coloured elements, and interactive states more visible and confident on the dark background.

**`--ink-2` dark mode check:**

Recommend verifying that #8A8A8A on #1E1E1C passes WCAG AA for the text sizes where `--ink-2` is used. If any instance is below 13px Inter 400, increase to #909090. This is a pre-launch quality check, not a redesign.

**Weather hero in dark mode:**

The current `#1A3522` override for the weather hero background in dark mode is a good decision. With the new brand colour at #2C4A14, consider updating this to `#162B0A` (slightly darker, more contrast against the verdict text). This deepens the "night sky over woodland" feeling that makes the card distinctive in dark mode.

**Priority: LOW - dark mode is above-average for a PWA. These are quality improvements, not fixes.**

---

## Area 10 - Overall Design Language

### Current state assessment

Sniffout has the components of a coherent design language but they are not yet pulling in the same direction. The CSS token system is well-structured. The card pattern is consistent. The bottom sheet interaction model is consistent. These are real strengths.

But if a new user opened the app and you asked them to describe the brand in three words, they would struggle. The app does not yet have a distinctive voice at the visual level - only at the copy level (which is genuinely strong). The copy says "warm, British, personal, dog-first." The visual design says "clean green app."

The gap between current state and the reference apps (Monzo, AllTrails) comes down to three things:

**1. Typography does all the emotional work in premium apps.** Monzo's card is a number in a typeface that feels designed. AllTrails' trail pages are trail names in a bold, confident type treatment. Sniffout's walks are currently named in Inter - the same typeface as every button, label, and error message. There is no moment where the design "speaks."

**2. Photography is the trust signal.** 97 placeholder images tells every user: this app is not ready. It does not matter that the UI is clean. Users judge app quality by the quality and individuality of content. Identical placeholders fail this immediately.

**3. Motion is the aliveness signal.** An app with no micro-interactions does not feel like a product someone cared about. Every premium app has a physical quality to its interactions - not animated loading spinners or gratuitous effects, but the tactile sense that tapping something causes a physical response. This is achievable in CSS.

**Verdict: POLISH NEEDED (overall direction is right, execution needs elevation)**

### What would close the gap

The gap between "feels basic" and "feels like it belongs alongside Monzo and AllTrails" requires three things in combination:

1. Fraunces for display type. This single change adds 60% of the premium typography signal.
2. Designed gradient placeholder. This removes the most visible "unfinished" signal.
3. Brand colour deepened to #2C4A14 used confidently on the Today hero card background.

These three changes together would produce a product that feels visually considered. They are implementable in a single Developer round. They do not require new architecture, new dependencies (beyond one Google Font), or significant new CSS. They are composition and judgement, not complexity.

---

## Prioritised Implementation Order

Maximum impact first, accounting for interdependencies and effort:

### Priority 1 - Typography (Fraunces display typeface)
**Impact: Very high. Effort: Low.**

One CDN `<link>` in `<head>`. New CSS variable `--font-display: 'Fraunces', serif`. Apply to hero elements, walk names, primary stats, verdict strings. This transforms the premium feel of the product faster than any other single change.

Key application points in first round:
- State A headline: "Paws before you go." in Fraunces 700, 44px
- Today tab verdict string: Fraunces 600, 26-28px
- Walk detail walk name: Fraunces 600, 22-24px
- Me tab primary stat number: Fraunces 700, 56px

### Priority 2 - CSS gradient placeholder
**Impact: Very high. Effort: Very low.**

Replaces the `placeholder-walk.jpg` reference with a CSS gradient. The 97 identical placeholder images are the single most visible "unfinished" signal. This can be addressed before any real photos exist. One CSS block.

### Priority 3 - Brand colour update (#2C4A14) and Today hero card colour treatment
**Impact: High. Effort: Medium (all --brand references update).**

Change `--brand` to #2C4A14. Update dark mode brand to #6A9B4A. Apply brand colour as hero card background on Today tab for approved conditions (white Fraunces verdict text on deep green background). This is the confidence moment that makes the app feel like it has a design point of view.

Note: this is a compound change - every element using `--brand` updates. Plan as a dedicated pass to verify nothing breaks.

### Priority 4 - Card tap and heart pulse micro-interactions
**Impact: Medium-high. Effort: Low.**

CSS-only. `transform: scale(0.97)` on card `:active`. Heart pulse keyframe. Tab fade-up transition. Sheet open spring curve. These make the app feel alive in the hands.

### Priority 5 - Dog name interpolation (Luna moments)
**Impact: High emotionally. Effort: Low (JS string interpolation).**

Today tab verdict with dog name. Me tab primary stat with dog name. Walk log entries with dog name. These three changes complete the "personal record" promise in the UI without any new data or architecture.

### Priority 6 - Empty states with personality
**Impact: Medium. Effort: Low.**

Replace blank areas with warm copy. "Your walks start here." "Badges find you." Each is a two-line copy addition with no layout change.

### Priority 7 - Card shadow and border refinement
**Impact: Medium. Effort: Very low.**

Multi-layer box-shadow on cards. Lighter border. Dark mode shadow removal. One CSS block per card type.

### Priority 8 - Me tab stat and dog profile card elevation
**Impact: Medium. Effort: Low.**

Fraunces 700 on primary stat number (depends on Priority 1). Dog profile card redesign above the stats grid.

### Priority 9 - Brand colour palette expansion
**Impact: Medium. Effort: Low (new CSS variables).**

Add `--brand-mid`, `--brand-tint`, and update `--amber` to the earthier #B07A28. Use `--brand-tint` for reminder rows, info panels, active chip backgrounds.

### Priority 10 - Walk photos for 7 showcase carousel walks
**Impact: Very high for State A. Effort: Owner action (not Developer).**

This is an owner action, not a Developer brief. The seven carousel walk photos are the highest-impact content action available to the product. Nothing the Developer can do will compensate for 97 placeholder images on the Walks tab showcase.

---

## Overall Design Health Score

**5.5 / 10**

This is not a comfortable score and it is not intended to be. A 5.5 is: "works, coherent, has a foundation, but is clearly not premium." That is an honest description of where the design is today.

**What is holding the score down:**
- 97 identical placeholder images (alone reduces the score by 1-1.5 points)
- No display typeface - everything at the same visual temperature
- Brand colour used timidly, not confidently
- No micro-interactions - app feels static
- No emotional design moments despite the product having the richest emotional design opportunity in its category

**What is holding the score up:**
- Token system is well-considered and consistent
- Card-based layout is correct for the content type
- Dark mode implementation is above-average
- No glassmorphism or other trendy decisions that will age poorly
- Copy is genuinely strong and sets the right tone
- Architecture decisions (no blur, clean surfaces, 16px radius) are all defensible

**With Priority 1-3 implemented, the score becomes approximately 7 / 10.** With all priorities 1-10 implemented and real photos for the showcase walks, the score becomes 8.5 / 10. A 9+ requires native-quality app platform infrastructure that the single HTML file architecture will never fully close.

The premium PWA bar is lower than the native app bar. Walk Highlands has 100k installs as a map PWA with no design ambition. Sniffout with a Fraunces display typeface, deep green hero card, and spring micro-interactions will be the most design-considered dog walking PWA in existence. That is achievable and it is worth doing.

---

## The Single Most Impactful Change

**Add Fraunces as the display typeface. Apply it to five key elements in one round.**

One CDN link. One CSS variable. Five targeted applications: the State A headline, the Today verdict string, the walk detail walk name, the Me tab primary stat, and the Me tab section headers.

This single change does more for premium perception than any colour, spacing, or shadow adjustment because typography is how design communicates character at a glance. A user spends 200 milliseconds forming a quality impression before they have consciously read anything. In those 200 milliseconds, typography is the primary signal. Inter says "UI." Fraunces says "made with intention."

The second most impactful change (and it can be done in the same round) is replacing the 97 placeholder images with the CSS gradient placeholder. These two changes together - display typeface and designed placeholder - address the top two root causes of "feels basic" and require approximately two hours of Developer time.

---

*Document ends.*
*Saved: docs/specs/design-elevation-spec-march-23.md*
*Date: 23 March 2026*
*Status: Owner review required. No implementation until the owner has reviewed and confirmed the recommendations to be briefed.*
