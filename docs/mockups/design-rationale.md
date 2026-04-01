# Design Rationale - Visual Exploration Round 2

**Direction:** The Terrain
**Files:** 7 HTML mockups in `docs/mockups/`, designed from scratch
**Date:** April 2026

---

## 1. Design System Generator Output (Verbatim)

### `--design-system` (Sniffout, dog walking outdoor lifestyle app)

```
PATTERN: App Store Style Landing
  Conversion: Show real screenshots. Include ratings (4.5+ stars). QR code for mobile.
  CTA: Download buttons prominent (App Store + Play Store) throughout

STYLE: Accessible & Ethical
  Keywords: High contrast, large text (16px+), keyboard navigation, screen reader friendly, WCAG compliant

COLORS:
  Primary:    #0891B2
  Secondary:  #22D3EE
  CTA:        #059669
  Background: #ECFEFF
  Text:       #164E63
  Notes: Calm cyan + health green

TYPOGRAPHY: Caveat / Quicksand
  Mood: handwritten, personal, friendly, casual, warm, charming

KEY EFFECTS: Clear focus rings (3-4px), ARIA labels, skip links, 44x44px touch targets

AVOID: Bright neon colors, motion-heavy animations, AI purple/pink gradients
```

### `--domain style` (premium outdoor lifestyle)

```
Result 1: Storytelling-Driven
  Type: Landing Page
  Keywords: Narrative flow, visual story progression, chapter-like structure,
    emotional messaging, journey visualization, varied section transitions
  Best For: Brand/startup stories, mission-driven products, premium/lifestyle brands
  Design System Variables: --section-min-height: 100vh, --narrative-font: serif,
    --chapter-spacing: 8rem, --parallax-speed: 0.5

Result 2: Gradient Mesh / Aurora Evolved
  Keywords: Complex mesh gradients, aurora effect, iridescent, holographic
  Colors: Cyan #00FFFF, Magenta #FF00FF - REJECTED (anti-pattern)

Result 3: Aurora UI
  Keywords: Vibrant gradients, Northern Lights effect - REJECTED (anti-pattern)
```

### `--domain typography` (warm natural organic)

```
Result 1: Wellness Calm
  Heading: Lora
  Body: Raleway
  Mood: calm, wellness, health, relaxing, natural, organic
  Best For: Health apps, wellness, spa, meditation, yoga, organic brands
  Notes: Lora's organic curves with Raleway's elegant simplicity.

Result 2: Indie/Craft
  Heading: Amatic SC
  Body: Cabin
  REJECTED: handmade/craft aesthetic wrong for premium product

Result 3: Playful Creative
  Heading: Fredoka
  Body: Nunito
  REJECTED: children's/gaming aesthetic
```

### `--domain color` (outdoor nature wellness)

```
Result 1: Climate Tech
  Primary: #059669, Secondary: #10B981, CTA: #FBBF24
  Background: #ECFDF5, Text: #064E3B
  Notes: Nature green + solar gold

Result 2: Sustainability/ESG Platform
  Primary: #059669, Secondary: #10B981, CTA: #0891B2
  Background: #ECFDF5, Text: #064E3B
  Notes: Nature green + ocean blue

Result 3: Mental Health App
  Primary: #8B5CF6, Secondary: #C4B5FD - REJECTED (purple/lavender)
```

---

## 2. How Generator Output Influenced Design Choices

### Typography: Lora adopted, Raleway replaced

The Wellness Calm result (Lora + Raleway) was the strongest recommendation and directly influenced the direction. Lora was adopted as the primary display typeface for all headings, walk names, weather data, and pull quotes.

Raleway was not adopted. Plus Jakarta Sans was already established as the product typeface and carries better brand consistency. The Lora + Plus Jakarta Sans pairing does the same tonal work as Lora + Raleway - warm serif display against a clean geometric sans.

### Style: Storytelling-Driven layout adopted

The narrative flow pattern was directly applied:
- Website homepage uses `section-kicker` chapter labels above every headline
- Walk page body is structured like editorial writing with a pull quote in the middle
- The hero stat panel is embedded inside the hero (data reinforcing the headline in the same visual space, not below it)
- Section headings in the app use Lora to give each screen an editorial chapter feel

### Anti-patterns: confirmed correct avoidance

The anti-pattern list confirmed that aurora/mesh gradients and neon were the right things to exclude. Both Gradient Mesh and Aurora UI results from the style domain were rejected for exactly this reason.

### Color: nature green anchored to brand

The generator's nature color results centered on #059669 (emerald green) and #ECFDF5 (mint). These are lighter and more saturated than the brand. Rather than adopt them, they informed the tonal direction: warm, deep, organic greens rather than corporate greens. The parchment background (#F4EFE6) was derived by taking the existing warm off-white concept and leaning it warmer and more organic.

---

## 3. The Terrain Design System

### Color tokens

| Token | Value | Usage |
|-------|-------|-------|
| Brand | #2C4A14 | Primary actions, hero sections, nav active states, badges |
| Brand deep | #1B3009 | Bottom navigation, deep forest sections, footers |
| Brand mid | #4A7C3A | Section links, hover states, secondary brand expressions |
| Sienna | #B85C2C | Pick badges, hidden gem badges, pull quote border, sienna chip accent |
| Sage pale | #EDF4E7 | Active filter chips, trail tiles, tag pills, park category |
| Amber | #D4940A | Star ratings, warning states |
| Amber bg | #FEF5E4 | Moderate difficulty backgrounds, warning chip backgrounds |
| Page bg | #F4EFE6 | App background (warm linen, not cold white) |
| Surface | #FFFFFF | Card faces, sidebar panels |
| Ink | #1C1A16 | Primary text (warm near-black, not pure #000) |
| Ink-2 | #5C5A55 | Secondary text, body copy |
| Ink-3 | #9E9C98 | Tertiary text, metadata, disabled states |

### Typography scale

| Role | Typeface | Size | Weight | Notes |
|------|----------|------|--------|-------|
| App logo | Lora | 22px | 700 | Sienna dot alongside |
| Website logo | Lora | 22px | 700 | Same |
| Hero temperature | Lora | 72-84px | 700 | Letter-spacing: -5px |
| Walk score ring | Lora | 16-17px | 700 | SVG text element |
| Walk card names (app) | Lora | 14px | 600 italic | Overlaid on photo |
| Walk card names (web featured) | Lora | 18-22px | 700 italic | Overlaid on photo |
| Section headings | Lora | 17px | 600 | In-app section labels |
| Tab titles | Lora | 22px | 700 | Weather, Nearby, Me tabs |
| Dog name | Lora | 26px | 700 | Me tab hero |
| Dog breed | Lora | 14px | 400 italic | Me tab hero |
| Stat values (Me tab) | Lora | 24px | 700 | In hero stats grid |
| Sidebar weather temp | Lora | 44px | 700 | Walk page sidebar |
| Pull quote | Lora | 20px | 400 italic | Walk page body |
| Hero headline (website) | Lora | 50-62px | 700 | With italic em sections |
| Section headline (website) | Lora | 34-40px | 700 | With italic em sections |
| All UI text | Plus Jakarta Sans | 10-17px | 400-700 | Labels, meta, buttons, body |
| Body copy (walk page) | Plus Jakarta Sans | 17px | 400 | 1.8 line-height |

### Shadow system

| Name | Value | Usage |
|------|-------|-------|
| shadow-sm | `0 1px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)` | Small cards, location pill, nearby cards |
| shadow | `0 2px 20px rgba(44,74,20,0.09), 0 1px 6px rgba(0,0,0,0.05)` | Main walk cards, feature tiles |
| shadow-lg | `0 8px 40px rgba(44,74,20,0.14), 0 3px 12px rgba(0,0,0,0.07)` | Featured card, hover elevation |

Shadows use brand green tint (not neutral grey) to keep them feeling warm and grounded in the palette.

### Spacing and radii

- Base corner radius: 16px (cards)
- Large radius: 22px (hero cards, featured walk)
- Extra large: 52px (phone frame), 24px (bottom nav rounding)
- Standard card padding: 14-16px
- Section padding (app): 0 14px
- Content max-width (website): 1140px

### Navigation

The bottom navigation uses `#1B3009` (deep forest) as background with white icons. Active state: white icon and label, plus a 4px sage green dot positioned above the active icon (`#A8D874`). Inactive items sit at 35% white opacity. This is a deliberate departure from conventional grey/white navbars and makes the navigation feel anchored and premium.

### Hero card

Weather heroes use full-bleed green gradient backgrounds (not dark grey or generic blue) with a radial highlight at top-right to suggest light through tree canopy. Temperature in huge Lora (72-84px) with a walk score SVG ring in the top-right corner. Lora italic verdict text below the temperature. Condition chips in semi-transparent white pills at the bottom.

### Walk photography

All photos represented as CSS gradients ranging from deep forest green (#3D7030 to #1B3009) to autumn gold/brown tones for variety. In production, real walk photography would replace these. The photo cards use a `linear-gradient(to top, ...)` fade at the bottom so the Lora italic walk name sits legibly on a darkened overlay.

### CSS map

Topo/terrain maps are rendered in pure CSS:
- Base: #E8E4D8 warm sand
- Topo lines: `repeating-linear-gradient` at 0deg, 90deg, and 25-30deg at 3-6% opacity
- Roads: white strips (horizontal and vertical)
- Green space: `rgba(74,124,58,0.2)` blob shapes with border-radius
- Walk route (walk page): SVG path with brand green stroke
- Pins: rotated squares (diamond shape) for standard pins, circles for user dot
- User dot: #4A90E2 with white border and a semi-transparent pulse ring via `::before`

---

## 4. Departures from Generator Recommendations

### Caveat / Quicksand (typography) - Rejected

The generator recommended Caveat (handwritten) and Quicksand for Sniffout's tone. These are appropriate for casual personal blogs and children's products but wrong here. Sniffout sits closer to premium travel/lifestyle than to a personal notebook. Lora better serves the warm-but-authoritative tone.

### #0891B2 cyan (color) - Rejected

The design system generator's primary color recommendation was cyan. This conflicts directly with the brand anchor (#2C4A14) and the outdoor/woodland positioning. Cyan reads as healthcare or tech, not woodland walks.

### App Store Style Landing (pattern) - Partially adopted

The conversion-focused App Store pattern informed the website's structure (hero, social proof, feature strip, app download CTA) but the visual execution went toward editorial/storytelling rather than conventional SaaS landing pages.

### ARIA, focus states, touch targets - Fully adopted

All SKILL.md accessibility requirements were applied: `aria-label` on all interactive elements, `role` attributes, `cursor: pointer` on all clickables, 44px minimum touch targets, `transition: transform 0.15s ease` + `:active { transform: scale(0.97) }` on every interactive element. SVG icons used throughout - no emojis as icons.

---

## 5. Key Decisions That Differentiate from Previous Mockups

These are deliberately different from the previous round's "Naturalist" direction:

1. **Bottom nav**: Deep forest green (#1B3009) background with white icons - not white/grey. Active dot is sage green above icon, not an underline.

2. **Background**: #F4EFE6 warm linen - slightly different from previous #FAF7F2.

3. **Walk cards on Today**: Portrait ratio (2:3), 2-column grid. Previous used same concept but this round refines the shadow system and removes card borders entirely.

4. **Dog profile hero on Me tab**: Full-bleed green gradient (consistent with all hero sections) - not a warm parchment card. Dog stats are embedded inside the hero as a semi-transparent grid.

5. **Nearby map**: Full-width 200px map block with topo grid at three angles (0deg, 90deg, and 25deg diagonal) for richer terrain feel.

6. **Website hero stats panel**: Floating glassmorphic panel inside the hero (right side), not below it.

7. **Pull quote on walk page**: Lora 20px italic, `border-left: 3px solid var(--sienna)`, no quotation marks - editorial magazine style.

8. **SVG route overlay on walk page map**: The walk page shows an actual route outline as a filled SVG path with a dashed stroke suggestion, making it feel like a real map with the route drawn on it.
