# Sniffout — Design Brief
*Based on competitive design research, inspiration analysis, and demand findings — March 2026*

---

## 1. Design Inspiration Analysis

The four screenshots provided are from **Too Good To Go** (browse/list, map, and discover screens) and **Deliveroo** (home screen). These are excellent references for the level of quality and visual language Sniffout should aim for.

### What these apps do well

**Structure and hierarchy**
Both apps open with immediate location context (a subtle line at the top: *"Current location — Norbiton, London"*) and a persistent search bar. Content is then organised into named sections with "See all" escape hatches. There is a clear visual rhythm: location → search → filters → content. Nothing competes for attention because each element has a clear role.

**Cards as the primary unit**
Full-width cards dominate the browse experience. Each card has: a large photo taking up roughly 50–60% of the card height, a clear title in medium-weight type, a short descriptor line, key metadata (distance, time, rating) in small muted text, and a heart/save icon anchored top-right. The card corners are generously rounded (approximately 14–16px). Shadows are subtle — just enough to lift the card from the background without looking dated.

**Badge overlays with personality**
Small pill labels float over the card photo — *"Popular"*, *"Hidden gem"*, *"1 left"*. These do real work: they communicate value at a glance and create micro-moments of delight without being loud. The labels use the same font family as the rest of the UI, just smaller and reversed on a semi-transparent dark background.

**Filter chips as horizontal scrollers**
Categories are rendered as a single horizontally-scrolling row of pill-shaped chips below the search bar: *All, Meals, Bread & pastries, Groceries...* The selected chip uses the brand colour fill; unselected chips are outlined or lightly filled. This pattern is efficient on mobile — it reveals filtering options without taking vertical space.

**Colour restraint**
TGTG uses a dark teal (#1B4B3A approximately) as the sole brand colour. It appears on the active tab indicator, selected button fills, and the List/Map toggle. Everything else is white, off-white, and dark text. Deliveroo uses a similar approach with its teal. The lesson is: **one strong accent colour used sparingly does more than many colours used broadly.**

**Navigation**
Both use a 5-tab bottom nav with icon + text label. Active states use the brand colour fill on the icon. The tabs are: Discover / Browse / Delivery / Favourites / Profile (TGTG) and Home / Restaurants / Groceries / Shopping / Reorder (Deliveroo). Labels are 10–11px, single words, matching a simple outline icon above.

**List/Map toggle**
The segmented control (a pill split into *List* and *Map* halves) appears as a sticky control near the top of the browse screen. When map is selected, the full screen becomes the map with a floating search bar overlay. This is the correct pattern for Sniffout's walks tab.

### What to borrow for Sniffout

Sniffout is a discovery app for outdoor locations, not food. The layout patterns and card conventions from these apps are directly applicable — the job-to-be-done is structurally the same: *"show me what's near me, help me choose, make it feel premium."* The visual language should be adapted to feel more at home in the outdoors (earthier tones, more photography, fewer UI chrome elements) while retaining the cleanliness and structural rigour of these reference apps.

---

## 2. Colour Palette

### The problem with the current style
The current glassmorphic green — blurred glass panels, green gradients — is visually distinctive but works against the design goals. Glassmorphism reads as trendy rather than timeless, feels heavier to render, and does not hold up well against rich photography. Apps like Citymapper and Strava moved away from heavy visual effects in favour of clean structure with one strong accent. That is the direction Sniffout should take.

### Recommended palette

**Primary background:** `#F7F5F0`
A warm off-white — not pure white, not cream. This reads as slightly natural and organic, referencing paper and outdoor light rather than a sterile screen. Cards sit on this background.

**Card surface:** `#FFFFFF`
Pure white for cards. The slight warmth of the background gives cards a subtle lift without needing shadows everywhere.

**Brand accent (primary):** `#1E4D3A`
A deep forest green. Not lime, not olive, not the current bright green. This reads as mature, outdoorsy, and authoritative. It is the colour of a dense tree canopy — aspirational for a dog walk app, not synthetic. Used on: active tab indicator, primary buttons, selected filter chips, link text, icon fills on key actions.

**Brand accent (light/hover state):** `#2E7D5E`
A lighter midtone of the same green family. Used for: selected chip backgrounds, button hover/pressed states, secondary highlights.

**Hazard amber:** `#D97706`
Used exclusively for weather hazard indicators. Drawn from Tailwind's amber-600. Warm, attention-grabbing, readable against both light and dark surfaces. Not alarming like red but clearly communicates *caution*.

**Hazard red:** `#DC2626`
For extreme conditions only — heatstroke risk level, severe weather. Rare.

**Text primary:** `#111827`
Near-black. Not pure black (`#000000`) which reads as harsh on mobile. This is Tailwind's gray-900.

**Text secondary:** `#6B7280`
Gray-500. Used for metadata — distance, time, tags, secondary labels. Readable but clearly subordinate to primary text.

**Text on brand colour:** `#FFFFFF`
White text on the forest green accent. Ensure contrast ratio is checked at each usage.

**Dividers / borders:** `#E5E7EB`
A light hairline for card borders and section separators when needed. Rarely used — spacing should do the work of dividers where possible.

**Dark mode (for night/weather context):**
The current behaviour of switching to dark mode based on weather (`isDay` flag) is a nice touch worth keeping. Dark mode palette:
- Background: `#0F1C15` (very dark forest green, not pure black — stays in theme)
- Card surface: `#1A2E22`
- Primary text: `#F9FAFB`
- Secondary text: `#9CA3AF`
- Accent: `#4ADE80` (a lighter green for visibility on dark — approximately emerald-400)
- Hazard amber: `#FCD34D`

---

## 3. Typography

### Font choice
**Inter** — free, open source, designed specifically for screens. Used by Linear, Vercel, many high-quality products. Available via Google Fonts CDN with no performance cost.

No secondary font. One family, multiple weights.

### Type scale

| Role | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 28px / 1.75rem | 700 | Hero text, e.g. walk name on detail page |
| Heading 1 | 22px / 1.375rem | 700 | Tab headings, section titles |
| Heading 2 | 18px / 1.125rem | 600 | Card titles, subsection heads |
| Body | 15px / 0.9375rem | 400 | Descriptions, content paragraphs |
| Label | 13px / 0.8125rem | 500 | Metadata, tags, filter chips, tab labels |
| Caption | 11px / 0.6875rem | 400 | Timestamps, secondary meta, legal text |

### Line height
- Headings: 1.2 (tight — creates authority)
- Body: 1.6 (open — comfortable reading)
- Labels/captions: 1.4

### Letter spacing
- Headings: normal or very slightly tight (-0.01em)
- Uppercase labels (if any): 0.04–0.06em tracking
- Body: normal

### Practical rules
- Never use more than two type sizes on a single card
- Walk card: heading 2 for name, label for metadata — nothing else
- Metadata should be a single line where possible, separated by middots (·)

---

## 4. Layout System

### Grid and spacing
Base unit: **8px**.

All spacing, padding, margin, and component sizing should be multiples of 8px (8, 16, 24, 32, 40, 48...).

- Screen edge padding: **16px** left and right
- Card internal padding: **16px** all around
- Section gap between title and content: **12px**
- Section gap between sections: **32px**
- Card gap in a vertical list: **12px**
- Bottom nav height: **64px** (safe area aware)
- Status bar spacing: handled by `env(safe-area-inset-top)` for PWA

### Border radius
- Cards: **16px**
- Buttons (primary): **12px**
- Filter chips: **99px** (pill)
- Tags on cards: **6px** (small chips)
- Map container: **16px** top corners when in drawer/sheet
- Bottom sheet modal: **24px** top corners

### Elevation
Avoid heavy drop shadows. Use instead:
- Thin border (`1px solid #E5E7EB`) for card definition on white background
- Very subtle shadow for floating elements: `0 2px 8px rgba(0,0,0,0.08)`
- Active/pressed states: slight scale down (0.97 transform) rather than shadow change

---

## 5. Navigation Structure

### Bottom navigation
5 tabs. Keep the existing tab structure but refine the labels and icons:

| Tab | Icon | Label | Notes |
|-----|------|-------|-------|
| Home | House (outline / filled active) | Home | Combined weather summary + featured walk recommendation |
| Weather | Sun/cloud (outline / filled active) | Weather | Full weather detail, hazard cards |
| Walks | Map pin / footsteps | Walks | Browse, filter, list/map toggle |
| Nearby | Compass or location dot | Nearby | Dog-friendly venues (currently Places) |
| Profile | Person (outline / filled active) | Me | Favourites, settings, name |

Active tab: icon switches to filled, text switches to brand accent colour (`#1E4D3A`), no indicator line needed.

Inactive tabs: outlined icon, gray-500 text.

The bottom nav should have a thin top border (`1px solid #E5E7EB`) and a white background in light mode, `#0F1C15` in dark mode. Always respect `env(safe-area-inset-bottom)` for notched devices.

### In-tab navigation
Where tabs have a map/list toggle (Walks, Nearby), use a segmented pill control at the top of the tab content. This should be sticky — it stays visible as the user scrolls.

Pill control styling: white background with brand green fill on selected segment, medium-weight label text, full width of the pill matching the brand colour border.

---

## 6. Screen-by-Screen Recommendations

### Home Tab

This is the *"is it a good day to walk?"* tab. It should answer that question within 2 seconds of opening the app.

**Structure (top to bottom):**
1. **App wordmark** — "sniffout" in Inter 700, brand green, left-aligned. Small. 24–26px. Not a logo, just the name. Paired with a small paw/leaf icon optionally.
2. **Location line** — *"Near Dorking, Surrey ▾"* — small, gray, tappable dropdown. Consistent with TGTG/Deliveroo pattern.
3. **Weather hero card** — a full-width card (not a small widget) showing:
   - Current conditions icon (large, simple line icon)
   - Temperature, feels-like
   - A single plain-English verdict: *"Good walking conditions"* or *"Too hot for afternoon walks — try before 9am"*
   - Hazard pills below if applicable: 🌡 Heat risk · 💨 Strong wind
   - Background: the card uses a subtle nature photo OR a solid brand-green gradient depending on conditions. Do not use glassmorphism.
4. **"Best walks near you" section** — heading + horizontal scrolling row of 2–3 walk cards, each showing photo, name, distance, primary tag. "See all" links to the full Walks tab.
5. **Today's tip** — a single-line contextual note. Can be seasonal (*"Adder season — keep dogs on paths in heathland"*) or weather-derived (*"Paw check: pavements may be hot. Use the 7-second test."*). Small, dismissible, not alarming.

No clutter. No multiple sections of equal weight competing for attention. The weather card dominates; everything below it supports the decision to go for a walk.

---

### Weather Tab

Deeper weather detail for users who want to understand conditions more fully.

**Structure:**
1. **Current summary** — temperature, feels-like, wind, humidity, UV index. Grid layout, 2×3 or 3×2. Each metric in a small card with a label and value.
2. **Hazard section** (if any hazards active) — horizontally scrollable hazard cards. Each card: icon, hazard name (bold), one-line plain English description. Colour-coded: amber border for caution, red for severe.
3. **Paw safety indicator** — its own dedicated block. Not buried. A simple traffic-light visual (green / amber / red paw icon) with temperature threshold explanation. *"23°C+ — pavement may be too hot. Use the 7-second test."*
4. **Today's walk window** — a simplified hourly timeline showing colour-coded good/marginal/poor windows. Does not need to be complex — even a simple bar showing "ideal: 6–9am and 7–9pm" is enough.
5. **Extended forecast** — 3-day cards below. Each shows day, condition icon, high/low, and a brief suitability note.

---

### Walks Tab

The discovery and browsing experience. This is the heart of the app.

**Structure:**
1. **Search bar** — full width, placeholder: *"Search walks..."*, with a filter icon on the right.
2. **Filter chips row** — horizontally scrollable: *All · Off-lead · Short · Woodland · Coastal · Easy · No livestock*. Selected chip: brand green fill, white text. Unselected: white/off-white background, gray border.
3. **List / Map toggle** — segmented control, sticky below filters.
4. **Sort line** — *"Sort: Nearest ▾"* — small, right-aligned, above the card list. Tappable.
5. **Walk cards** — vertical scrolling list of full-width cards.

**Walk card anatomy:**
```
┌─────────────────────────────────────┐
│                                  ♡  │  ← Heart icon, top right, white with subtle shadow
│         Walk photograph             │  ← ~180px height, object-fit: cover
│  ┌────────┐                         │
│  │Off-lead│  ← Badge pill, bottom-left of image, semi-transparent dark bg
│  └────────┘                         │
├─────────────────────────────────────┤
│  Ashdown Forest Loop           4.2★ │  ← Heading 2 + rating right-aligned
│  East Sussex                        │  ← Secondary text, gray
│  2.8 mi · ~1h 20min · Woodland     │  ← Single metadata line, label size
│  🌿 Off-lead sections · No livestock│  ← Contextual tags
└─────────────────────────────────────┘
```

On tap: expands to a full-screen walk detail view (sheet slides up from bottom or pushes in from right).

**Walk detail view:**
- Hero image at top (~240px), walk name overlaid with a gradient scrim at bottom
- Back arrow top-left (white, readable on image)
- Heart icon top-right
- Sheet content below image: full description, practical details grid (distance, time, difficulty, surface, off-lead, livestock), tags row, embedded map, nearby venues section

**Map view:** Leaflet map full-screen. Walk pins use a custom marker in brand green. Tapping a pin opens a bottom sheet with the walk card content. The list/map toggle floats as a pill above the map.

---

### Nearby Tab (currently Places)

Dog-friendly venues near the current location.

**Structure:**
1. **Category chips** — *All · Pubs · Cafes · Parks · Vets · Car parks*
2. **List / Map toggle**
3. **Venue cards** — similar card pattern to walks but simpler: photo, venue name, category badge, distance, rating (from Google Places). No complex metadata needed.

The map view should show clustered pins with numbers when zoomed out, individual brand-green pins when zoomed in.

---

### Me Tab (currently Profile)

Lightweight personal hub. Does not require login to be useful.

**Structure:**
1. **Name** — *"Hi, [name] 👋"* with a small editable field if name is set, or prompt to add name if not. This is the single piece of personalisation available without login.
2. **Favourites** — grid or list of saved walks. Empty state should be encouraging, not clinical.
3. **Stats** — simple counters: walks explored, walks favourited. Stored locally.
4. **App settings** — unit preference (miles/km), notification placeholder (for future), dark mode override.
5. **About / legal** — collapsed, at the bottom.

---

## 7. Specific UI Components

### Weather hazard pill
Small, rounded pill with an icon + text. Amber border and amber-tinted background for caution. Example: `⚠ Heat risk`. Not alarming — informative. Max width: content-fit, no minimum.

### Filter chip (active/inactive)
Inactive: `background: #FFFFFF; border: 1px solid #D1D5DB; color: #374151`
Active: `background: #1E4D3A; border: none; color: #FFFFFF`
Height: 36px. Horizontal padding: 16px. Border-radius: 99px (pill).

### Primary button
Background: `#1E4D3A`. Text: white, 15px, weight 600. Border-radius: 12px. Height: 52px. Full-width in most contexts. Pressed state: `#2E7D5E`, scale 0.97.

### Walk card tags
Small pills inside walk cards. Background: `rgba(30,77,58,0.1)` (transparent brand green). Text: `#1E4D3A`, 12px, weight 500. Border-radius: 6px. Used for: off-lead status, surface type, highlights.

### List/Map segmented toggle
Pill container, white background, `1px solid #E5E7EB` border, 40px height. Selected half: `#1E4D3A` background, white text. Unselected: transparent background, `#374151` text. No border between halves — the fill creates the separation.

### Bottom sheet / walk detail
Slides up from bottom of screen. Uses `border-radius: 24px 24px 0 0` at the top. A small drag handle (40px × 4px, `#D1D5DB`, centered) indicates it's scrollable. The sheet can be half-screen (for quick previews from map pins) or full-screen (for full walk detail).

### Empty state
When no walks match filters or no location is set: illustration (simple line art of a dog and a tree), heading, short explanation, single CTA. Not a dead end — always offer a path forward.

### Loading state
Skeleton cards — same dimensions as real cards but with an animated shimmer in `#F3F4F6`. Avoids content jump and feels premium. No spinners.

---

## 8. Photography Guidance

Walk card photography is the single highest-impact visual element. The difference between a premium-feeling app and a cheap-feeling one often comes down to image quality.

- **Each walk should have a representative photo** — ideally showing the actual path or landscape
- Images should be landscape format, cropped to ~16:9 or ~4:3
- Avoid stock photography clichés (generic dog on lead, blank green field)
- Prefer: golden hour light, recognisable UK landscapes, subtle motion/atmosphere
- When sourcing initially: Unsplash and Wikimedia Commons have excellent UK countryside photography, freely licensed
- Future state: user-submitted photos (with moderation) from walk submissions

---

## 9. Motion and Interaction

Keep motion minimal and purposeful. This is not a game — animations should feel like a natural consequence of interaction, not a show.

- Tab switches: instant or very short fade (100ms)
- Card press: scale to 0.97, ease-out, 150ms
- Bottom sheet opening: slide up, spring easing, ~300ms
- Skeleton → content: fade in, 200ms
- Filter chip selection: colour transition, 150ms
- No parallax, no entrance animations on scroll, no bouncing icons

---

## 10. What to Change vs. What to Keep

### Change
- **Glassmorphism** — remove entirely. Replace with clean card surfaces and subtle borders.
- **Current green accent** — move from the current bright/lime green to the deeper forest green `#1E4D3A`.
- **Dark mode trigger** — the automatic weather-based dark mode is a clever touch to keep, but the dark palette should be updated to match the new colour system.
- **Font** — switch to Inter. Load only the weights needed (400, 500, 600, 700) via Google Fonts.
- **Tab labels** — rename "Places" to "Nearby" and "Profile" to "Me" — both are warmer and more app-like.

### Keep
- **5-tab bottom navigation** — the right structure for this app.
- **List/Map toggle on walks** — this pattern is validated by the reference apps.
- **Weather-triggered dark mode** — distinctive and purposeful.
- **Location-first approach** — the session-based location and weather is a strong interaction model.
- **No login / no paywall** — reinforced by the TGTG and Deliveroo reference: both work as guest apps with clear value before any account is created.

---

## 11. Design Principles (One-Line Summary)

1. **Content over chrome** — the walk photos and weather data are the UI. Let them do the work.
2. **Answer the question first** — home screen should tell you in 2 seconds whether it's a good time to walk and where to go.
3. **One colour does more than many** — forest green, used sparingly, creates identity and hierarchy without visual noise.
4. **Cards are the unit** — everything is a card. Cards are consistent, scannable, actionable.
5. **Outdoor but not rugged** — this should feel like Citymapper applied to the countryside, not like a hiking app for mountaineers.
