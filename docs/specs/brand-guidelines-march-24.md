# Sniffout Brand Guidelines
**Version:** March 2026
**Author:** Designer
**Audience:** Designers, Copywriters, Developers joining the project
**Sources:** CLAUDE.md, designer-brief-march-24-spec.md, designer-brief-march-24b-spec.md

This document consolidates the design and brand decisions made across all Sniffout specifications to date. It is a reference, not a brief. Where a rule is absolute, it is stated as absolute. Where a value is exact, the exact value is given. Nothing in this document has been invented - every decision was made in a previous spec or in CLAUDE.md.

---

## Section 1 - Brand Identity

### Product name

The product is written as **Sniffout** - one word, capital S, lowercase n. Never "SniffOut", "sniffout", or "Sniff Out." The app file is `sniffout-v2.html`. The domain is `sniffout.app`.

### Brand positioning

Sniffout is the UK's personal record for dog walks - the place where a dog owner and their dog build a history together, powered by live weather intelligence and curated routes.

This single sentence contains three things that matter:

1. **Personal record, not discovery tool.** Sniffout started as a walk discovery app. It is evolving into something more valuable: an irreplaceable journal of where you and your dog have been together. Discovery tools are replaceable when something better appears. Personal records are not. "We've done 34 walks together, and I have notes from most of them" is not something a user migrates away from.

2. **Dog as subject, not filter.** No competitor has built an app where the dog is the main character. AllTrails has a "dog-friendly" filter. Sniffout has Luna. The dog's name appears in stats, walk logs, badge copy, and the walk verdict. This is the product's structural advantage and must be protected in every design and copy decision.

3. **Weather as opinion.** Sniffout does not show weather data. It gives a verdict. "Good walk today, Luna" is a different product from "Temperature: 18C, humidity: 72%." The verdict function is a point of view. Maintain it.

### Tone of voice

Sniffout copy is clear, warm, and occasionally dry. It treats the user as an adult. It gets to the point. It never gushes.

Good Sniffout copy earns every word. If a word can be removed without losing meaning, remove it. "Protect your data" is better than "Help keep your important walk data protected." The headline "Paws before you go." is the benchmark - it is witty, self-contained, and does not over-explain.

The tone is not playful in the way a children's app is playful. It is warm in the way a trusted local recommendation is warm - it knows what it is talking about, it has a point of view, and it respects that the user has a dog waiting at the door.

**Confirmed copy strings in the live app:**

- State A headline: "Paws before you go."
- State A social proof: "Know the route - Own the weather - Find dog-friendly spots"
- Walk wishlist label: "On my sniff list"
- Walk favourites label: "Sniffed and approved"
- Nav tabs: Today - Weather - Walks - Nearby - Me

---

## Section 2 - Colour Palette

### Light mode tokens

| Token | Hex | Role | Usage notes |
|-------|-----|------|-------------|
| `--brand` | `#2C4A14` | Brand green | Buttons, active states, stat numbers (primary), FAB background, Today tab hero card background (good conditions), interactive fill elements |
| `--brand-mid` | `#3D6520` | Mid brand green | Hover states, filled chip backgrounds, secondary brand fills |
| `--brand-tint` | `#EDF2E8` | Light brand tint | Reminder rows, info panels, active chip backgrounds, brand-adjacent surface contexts |
| `--bg` | `#F7F5F0` | Page background | The warm off-white used for the full page background. Not for card surfaces. |
| `--surface` | `#FFFFFF` | Card surface | All card backgrounds, bottom sheets, overlay content areas |
| `--border` | `rgba(0,0,0,0.08)` | Card border | All card and component borders in light mode |
| `--ink` | `#1A1A1A` | Primary text | Headlines, labels, body copy - all primary text |
| `--ink-2` | `#6B6B6B` | Secondary text | Supporting copy, metadata, labels below headlines |
| `--amber` | `#B07A28` | Warning / amber state | Caution hazard card backgrounds, amber warning contexts |
| `--red` | `#EF4444` | Danger / error state | Danger hazard card backgrounds, error messages, destructive action labels |

### Dark mode tokens (applied via `body.night` class)

| Token | Dark value | Notes |
|-------|-----------|-------|
| `--bg` | `#141414` | Near-black page background |
| `--surface` | `#1F1F1F` | Dark card surfaces |
| `--border` | `rgba(255,255,255,0.08)` | Subtle light border |
| `--ink` | `#F4F2EE` | Off-white primary text |
| `--ink-2` | `#8A8A8A` | Muted secondary text |
| `--chip-off` | `#2A2A2A` | Off/inactive chip background |
| Weather hero bg | `#1A3522` | Weather tab hero card only - not a general token |

### Dark mode brand colour rules - read carefully

Two separate values govern brand green in dark mode. They are not interchangeable.

**`#6A9B4A` - brand text and icons only.** Use this value when the brand colour appears as text, icon colour, or active state indicator (nav dots, active tab labels, stat numbers). Never use `#6A9B4A` as a background colour in dark mode.

**`#3D6B22` - brand-coloured backgrounds only.** Use this value for any surface that uses the brand green as its background in dark mode: FAB background, the Today hero card background (good conditions), walk pins on the map, any filled button with brand green background. Never use `#3D6B22` for text or icons.

This separation exists because `#6A9B4A` (a lighter, more vivid green) has sufficient contrast for text on the `#1F1F1F` surface but would look washed-out as a background. `#3D6B22` (a darker mid-green) works as a surface colour but would be too dark and low-contrast for text use.

### Amber and red in dark mode

Amber hazard card backgrounds in dark mode: `#8A5A18` (darker, less saturated - necessary for legibility against `#141414`).
Red hazard card backgrounds in dark mode: `#C73333` (slightly darker red).
Text on both remains white.

### Colour usage hierarchy

- **Brand green:** interactive elements, active states, confirmation states, the Today hero card in good conditions
- **Amber:** caution and warning states only - never decorative
- **Red:** danger, errors, and destructive actions only - never decorative
- **Brand tint:** light-weight contextual highlighting - reminder rows, selected chip state backgrounds
- **Surface/bg:** structural - surface is for elevated elements (cards, sheets), bg is the page canvas

---

## Section 3 - Typography

Sniffout uses two typefaces. No others should be introduced.

### Fraunces - display typeface

Fraunces is a variable optical-size serif with genuine character. It is used exclusively for hero moments and walk-named elements - the places where the design "speaks" rather than labels. At large display sizes it communicates warmth, care, and editorial quality that Inter cannot achieve.

**Loaded via Google Fonts CDN:**
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap
```

**CSS variable:** `--font-display: 'Fraunces', serif`

**Weights in use:** 400 (body-scale), 600 (section headings), 700 (hero display)

**Where Fraunces applies:**
- State A main headline ("Paws before you go.")
- Today tab walk verdict string (the verdict itself, not data around it)
- Walk name in the walk detail overlay (the title over the hero image)
- Me tab primary stat number (the large walk count)
- Me tab section headers ("Your walks", "Badges")
- Badge names when displayed as earned
- Walk name in compact pin-tap bottom cards on the map view
- Venue name in compact pin-tap cards on the Nearby map view
- Walk Wrapped headlines (Phase 2, when built)

### Inter - UI typeface

Inter is the system typeface for all functional, navigational, and copy contexts. It is highly legible on Android Chrome at all sizes and the chosen weights cover the full range of UI hierarchy.

**Weights in use:** 400 (body, captions), 500 (labels, meta, navigation), 600 (buttons, emphasis, strong labels), 700 (numeric data in stat tiles, if not using Fraunces)

**Where Inter applies:**
- All walk descriptions and body copy
- All button labels
- All navigation labels (Today, Weather, Walks, Nearby, Me)
- All chip and pill labels
- All form field labels and placeholders
- All error messages and system copy
- All data displays (temperature, distance, time, humidity, wind speed)
- All secondary stats and numbers
- All meta and caption text

### Type scale reference

| Role | Typeface | Weight | Size | Line height |
|------|----------|--------|------|-------------|
| Hero display (State A, verdict) | Fraunces | 700 | 44-48px | 1.05 |
| Walk detail overlay name | Fraunces | 700 | 26px | 1.15 |
| Section display (Me tab headers) | Fraunces | 600 | 28-32px | 1.15 |
| Compact card name (map pin cards) | Fraunces | 600 | 19px | 1.2 |
| Primary stat number (Me tab) | Fraunces | 700 | 56px | 1.0 |
| Body copy (descriptions) | Inter | 400 | 15px | 1.55 |
| Hazard detail text | Inter | 400 | 14px | 1.55 |
| UI label (buttons, tags, chips) | Inter | 500-600 | 13-14px | 1.3 |
| Caption and meta | Inter | 400 | 12-13px | 1.4 |
| Navigation labels | Inter | 500 | 11px | 1.0 |

---

## Section 4 - Iconography

### Icon library

Sniffout uses Lucide icons exclusively. Version: **0.577.0** (pinned - do not update without reviewing for breaking visual changes).

Icons are rendered as inline SVG via the `luIcon()` helper function. Do not use an icon font, an icon sprite sheet, or CDN-loaded SVG for Lucide icons. Inline SVG ensures icons render correctly in offline/PWA contexts and allows CSS colour control.

### Icon sizes and weights

Standard icon sizes in use:
- Navigation icons: 24px, stroke-width 2px
- Card and component icons: 20px, stroke-width 2px
- Small inline icons (pills, tags): 14-16px, stroke-width 2px
- FAB icon: 24px, stroke-width 2px

Do not reduce stroke-width below 2px. At small sizes (below 18px) on mid-range Android screens, 1.5px stroke icons can appear thin and faint.

### Icon colour rules

- **On brand-coloured backgrounds** (hero cards, FAB, filled buttons): white (#FFFFFF), full opacity
- **On surface backgrounds** (cards, sheets): `--ink-2` for secondary/support icons, `--ink` for primary emphasis icons
- **Active nav icons:** `--brand` in light mode, `#6A9B4A` in dark mode
- **Today tab icons:** white Lucide icons throughout - the Today tab hero section uses white icons on the coloured card background
- **Weather tab icons:** Yr.no meteocon SVGs for weather condition icons. Lucide icons are used for UI chrome (info buttons, navigation) on the Weather tab, but the weather condition visuals themselves use the Yr.no meteocon set.

### Paw emoji rule

The paw emoji (🐾) is reserved exclusively for the paw safety block. It does not appear anywhere else in the product - not in walk descriptions, not in marketing copy, not in empty states, not in badge copy. This is an absolute rule.

### Verdict string icon rule

Verdict title strings returned by `getWalkVerdict()` must never contain hardcoded emoji. The Lucide icon that accompanies a verdict is rendered as a separate element alongside the verdict text. Emoji are not icons and cannot be styled, scaled, or controlled as reliably as SVG elements.

---

## Section 5 - Component Rules

### Cards

All cards follow this specification without exception:

- `border-radius: 16px`
- `border: 1px solid var(--border)`
- Background: `var(--surface)` (#FFFFFF light, #1F1F1F dark)
- No blur, no backdrop-filter, no translucent backgrounds
- No glassmorphism effects of any kind

Cards may have a subtle multi-layer box-shadow in addition to the border:
```
box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
```
In dark mode, box-shadow is removed and the `--border` token provides the definition.

### Tap feedback

Every tappable element in the product must have the following tap feedback behaviour. No exceptions. This applies to cards, tiles, rows, chips, pills, buttons, FABs, icon buttons, map pins, and any other interactive surface.

```
transition: transform 0.15s ease;
```
```
:active {
  transform: scale(0.97);
}
```

For elements that have a translate applied (such as the FAB which uses `translateX(-50%)` for centering), the full transform value on `:active` must include both the existing transform and the scale: `transform: translateX(-50%) scale(0.97)`.

### Bottom sheets

All bottom sheets must open with the spring cubic-bezier animation:
```
transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

Exit/close transitions use a non-spring easing:
```
transition: transform 200ms ease;
```

The spring open gives sheets physical weight - they snap into place rather than sliding flatly. The direct exit keeps dismissal quick and unobtrusive.

### Minimum tap target

All interactive elements must meet the WCAG 2.5.5 minimum tap target of **44px in both dimensions**. Where a visual element is smaller than 44px (for example, a 24px icon), the tappable area must be extended via padding or an absolutely positioned hit area to meet the minimum.

### FAB specification

The Me tab floating action button (log walk action):
- Diameter: 56px
- Icon: Lucide `plus`, 24px, white (#FFFFFF), stroke-width 2px
- Background: `#2C4A14` light, `#3D6B22` dark
- Shadow: `0 4px 12px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.14)`
- Border in dark mode only: `1px solid rgba(255,255,255,0.12)`
- Position: `position: fixed`, `bottom: 88px`, `left: 50%`, `transform: translateX(-50%)`
- Fade on scroll: fades to `opacity: 0` and `scale(0.88)` when the Me tab is scrolled, restores after 250ms scroll inactivity

### Walk cards

Walk card image heights:
- Horizontal carousel (Today tab): 140px
- List view (Walks tab): 180px

Walk name is overlaid on the image at the bottom-left, in Fraunces 700 26px white with text shadow. It does not repeat below the image.

Content below the image shows: walk length (via `formatDist()`), difficulty pill, off-lead status pill. Nothing else on the card.

"Away" distance (distance from user to the walk start) is not shown on cards. It appears in the walk detail overlay only.

### Walk detail overlay hero

- Hero image container: 260px height, `overflow: hidden`
- Image element: 340px height (130% of container), `will-change: transform` for parallax
- Parallax ratio: 0.5 (image moves at half scroll speed)
- Gradient overlay over image: transparent at 40%, rgba(0,0,0,0.62) at 100%
- Walk name: Fraunces 700, 26px, white, absolute position `bottom: 14px left: 16px right: 16px`

---

## Section 6 - Writing Rules

### Punctuation

**No em dashes (--) or en dashes (-) anywhere in the product.** Use hyphens only. This applies to all copy: UI strings, walk descriptions, error messages, tooltips, empty states, and documentation. No exceptions.

### Emoji

Emoji are not used in product copy except for the paw emoji (🐾) in the paw safety block. Verdict strings, walk descriptions, button labels, and empty states all use text and Lucide icons, not emoji.

### Prohibited phrases

The following phrases must not appear anywhere in the product:

- "free" (as in "free to use" or "free app")
- "no sign-up"
- "no account"
- "no login"

These phrases frame the absence of a requirement as a selling point. When Phase 3 account linking arrives, this framing actively conflicts with the data protection message. Do not introduce it.

### Account and data framing

When Phase 3 account linking copy is needed, the correct framing is data protection - not registration. Approved framings:

- "Keep your walks safe across any device"
- "Your data, safe wherever you are"
- "Protect your data"
- "Link Google or email and your walks and data will be safe across any device."

Prohibited framings for accounts:
- "Create an account"
- "Sign up"
- "Register"
- "Join Sniffout"

The user is not joining a service. They are protecting data that already belongs to them.

### Walk feature labels

- Walk wishlist feature: **"On my sniff list"**
- Walk favourites feature: **"Sniffed and approved"**

These are confirmed product labels and must be used consistently across all surfaces where these features are named.

### Walk descriptions

Walk descriptions are written by five copywriter personas (defined in `docs/content/copywriter-personas.md`). These personas are for walk descriptions only - they do not apply to UI copy. UI copy follows the general Sniffout brand voice: clear, warm, occasionally dry.

Universal rules for walk descriptions:
- Walk name must not appear in the first sentence of a description
- No em dashes or en dashes - hyphens only
- 2-4 sentences maximum per description
- Vary openers and closers across descriptions

### Personalisation copy

When a dog profile is set, copy that references the user's activity should use the dog's name. Approved patterns:

- "34 walks with Luna" (not "34 walks")
- "Good walk today, Luna." (not "Good walk today.")
- "Your walks with Luna start here" (not "Your walks start here")
- "Add a note from today's walk with Luna" (not "Add a note")

The dog name is interpolated from `sniffout_dogs[0].name`. If no dog profile is set, fall back to generic second-person framing ("your walks", "good walk today").

---

## Section 7 - What Not To Do

This section is a definitive list of things that are explicitly ruled out. Each item was a deliberate decision, not an oversight.

**Visual design:**
- No glassmorphism. No backdrop-filter. No blur on any surface. The clean card-based design replaced a previous glassmorphism approach and must not revert.
- No translucent card surfaces. Cards are `--surface` (opaque white or near-black). Partial transparency on card backgrounds is not permitted.
- No automatic dark mode based on weather conditions. Dark mode is user-controlled only. `renderWeather()` must not apply or remove `body.night` based on the `is_day` field or any weather condition. This was a specific bug (B1 in the March 2026 UX review) and the fix must not be undone.

**Iconography and emoji:**
- No paw emoji (🐾) outside the paw safety block.
- No hardcoded emoji in verdict title strings in `getWalkVerdict()`. Lucide icons are rendered separately alongside verdict text.
- No icon fonts. No CDN-loaded Lucide. Inline SVG via `luIcon()` only.

**Copy and content:**
- No "away" distance on walk cards. The distance from the user's location to the walk start appears in the walk detail overlay only, not on any card surface.
- No "woodland routes" in high wind walk recommendations. Woodland walks are not safer in high winds - the hazard from falling branches is higher, not lower. This is a verified safety concern from the breed-hazard research.
- No fake or placeholder ratings. If a walk has no reviews, do not show a default star rating or a fabricated score.

**Architecture:**
- No separate `<script>` blocks. All JavaScript lives in a single merged `<script>` block in `sniffout-v2.html`. Multiple script blocks were a prior implementation issue and must not be reintroduced.
- No modifications to `dog-walk-dashboard.html` under any circumstances. This is the live production v1 file and is protected.
- No WALKS_DB schema additions without Product Owner sign-off.
- No new Google Places API venue categories without Product Owner sign-off. The current venue categories are fixed.

**Interaction:**
- No swipe-down to dismiss the full-screen Nearby map. The full-screen map fills the entire screen and swipe-down gestures conflict with Leaflet's map pan behaviour. The exit mechanism is the minimize icon button plus the Android hardware back button.
- No progress indicators on locked achievement badges. Locked badges are shown as a silhouette or blurred state with a name and one-line description only. No "7/10 walks to Trailblazer" counts.

---

*Document ends.*
*Saved: docs/specs/brand-guidelines-march-24.md*
*Date: 24 March 2026*
*Status: Living reference document - update when new decisions are made in spec files or CLAUDE.md.*
