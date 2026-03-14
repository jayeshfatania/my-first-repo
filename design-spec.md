# Sniffout — Design Specification
*Authored: March 2026. Based on design-brief.md, competitor-research.md, demand-validation.md, feature-recommendations.md, and review of four design inspiration screenshots (Too Good To Go browse, map, and discover screens; Deliveroo home screen).*

---

## Part 1: Brief Validation

The design brief is strong and I agree with the majority of it. Before the tab-by-tab specifications, here are the places where I'd push back, refine, or extend.

### Points of Agreement (Brief is Correct)

- **Removing glassmorphism.** Fully agree. It works against photography, dates quickly, and adds rendering cost. The clean card-on-warm-background approach from TGTG is the right model.
- **Forest green `#1E4D3A` as the sole brand accent.** Correct call. The TGTG screenshots confirm this: the brand uses exactly one strong dark teal/green, applied sparingly, and it does more work than any multi-colour palette could.
- **Inter typeface.** Right choice. It is the standard for high-quality product UI and requires no visual justification — it is simply correct for this kind of app.
- **5-tab bottom nav with filled/outlined icon states.** The TGTG and Deliveroo screenshots both validate this pattern precisely. Active state: filled icon + brand-coloured text. Inactive: outlined icon + gray text.
- **List/Map segmented pill control.** Screenshot 1 shows this exact pattern in TGTG. The filled half (brand colour) / unfilled half approach is correct. It should be sticky.
- **Card-first design.** All four screenshots reinforce this. The card is the atomic unit. Everything is a card.
- **Renaming "Places" → "Nearby" and "Profile" → "Me".** Agreed on both. These are warmer, shorter, and more consistent with modern app conventions.
- **Weather-triggered dark mode — keep it.** This is a genuine differentiator and should be retained.

### Points of Disagreement or Refinement

**1. The "Home tab" and the "Today" concept in this spec are new recommendations — neither currently exists.**

The design brief describes a "Home" tab combining weather and walk recommendations. This does not exist in the current app. What exists is a splash screen: a search form where the user enters a UK postcode or place name, and nothing else is shown until they do. After a successful search, the app drops the user onto the last active tab (defaulting to Weather). There is no persistent home screen — the splash disappears once a location is found.

The recommendation in this spec — a contextual "Today" home dashboard — is a new feature that must be designed and built. The naming ("Today" vs. "Home") and the content are both new. Reasoning: *Today / Weather / Walks / Nearby / Me* as the five tabs, where "Today" is time-contextual ("is it a good day to walk?") rather than a generic home. See Tab 1 specification below for the full recommendation including how to handle the existing splash/search behaviour.

**2. The weather hero card on the Home tab should not use a "subtle nature photo" background.**

The brief suggests: *"the card uses a subtle nature photo OR a solid brand-green gradient depending on conditions."* I recommend against the photo background. Photos behind text create contrast problems, especially dynamic weather state changes. A gradient using the dark mode / light mode palette is simpler to implement in a single HTML file, more consistent across conditions, and avoids any licensing concerns. Use a solid brand-green (`#1E4D3A`) card with white text in light mode, and a `#1A2E22` card with light green accent text in dark mode. The walk cards are where the photography lives.

**3. The "Today's tip" section on the Home tab should be elevated, not described as "small, dismissible".**

The research shows the seasonal and contextual hazard information (adder season, harvest time, post-storm fallen trees) is a genuine differentiator — PlayDogs has a version of this and it's valued. Making it dismissible treats it as a nuisance rather than a feature. Instead, render it as a distinct informational card with its own visual treatment (amber-tinted for hazards, green-tinted for neutral tips). It should not be the same visual weight as a footnote.

**4. The brief omits a "Community" tab — and that is correct, but the task brief asks for it.**

The task asks for a spec covering a "Community" tab. This tab does not exist in the current app and should not be added for the POC. Feature Recommendations explicitly defer user-submitted walks and community features. Adding a Community tab now would: (a) be empty and counterproductive, (b) require a backend to be useful, (c) undercut the curated-content advantage. This spec covers the five tabs in the design brief: Today, Weather, Walks, Nearby, Me. A Community tab spec is included as a deferred section at the end for future reference only.

**5. The bottom sheet for walk detail should default to full-screen push, not a half-sheet.**

The brief describes a bottom sheet for walk detail that can be "half-screen (quick preview from map pins) or full-screen (full walk detail)." This is correct — but the implementation note is important: in a single HTML file without a router, the "full screen" state is best handled as a `position: fixed; inset: 0` overlay with a slide-up animation, not a genuine navigation. The tab bar should hide when the detail view is open to give maximum screen space. This is achievable with `classList` toggling but is worth calling out as a non-trivial UI state.

**6. The dark mode accent `#4ADE80` (emerald-400) should be reconsidered.**

The brief recommends `#4ADE80` as the dark-mode accent. This is a bright, saturated lime-green that risks reading as garish against the `#0F1C15` background. A better choice would be `#6EE7B7` (emerald-300 / Tailwind) — still high-visibility on dark, but with slightly less visual aggression. Alternatively keep `#4ADE80` but use it only for interactive elements (active chips, icons), not for body text.

---

## Part 2: Visual Language Reference — What to Take from the Inspiration Screenshots

All four screenshots are from the same TGTG/Deliveroo session. Here are the specific elements to borrow directly.

### Screenshot 1 — TGTG Browse (List view)
*Most directly applicable to the Walks tab list view.*

- **List/Map pill:** The selected half is solid brand-colour fill with white text; the unselected half is plain white with grey text. There is no border between the two halves — the fill itself creates the visual separation. This is cleaner than using a full border on the selected half.
- **Sort line:** "Sort by: Relevance ▾" appears as a small, left-aligned text link above the card list. Right-align this for Sniffout ("Sort: Nearest ▾") to not compete with the filter chips.
- **Card anatomy:** Each card shows the restaurant logo circle overlaid bottom-left of the photo area, with the restaurant name overlaid on the photo at bottom. Then below the image: name in medium weight, sub-detail on the next line, metadata (rating + distance + price). The heart icon is top-right, white with a subtle shadow. Sniffout should follow this structure almost exactly, replacing the logo overlay with the walk's primary badge (e.g., "Off-lead" or "Woodland").
- **"Hidden gem" badge:** White text on a semi-transparent dark pill, positioned top-left of the card image. Use exactly this for Sniffout walk badges.

### Screenshot 2 — TGTG Map view
*Most directly applicable to the Walks and Nearby map views.*

- **Clustered numbered pins:** When multiple items are near each other, show a brand-coloured circle with a white number (e.g., "2"). This is standard Leaflet behaviour via a marker cluster plugin, but it can also be approximated in CSS without the plugin.
- **The List/Map toggle floats above the map** at the top — it does not sit in a separate header bar. Use this pattern: position the pill control `position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index: 1000` over the Leaflet container.
- **The search bar persists on top of the map.** Keep a narrower search bar visible above the map in map mode.

### Screenshot 3 — TGTG Discover (Home view)
*Most directly applicable to the Today (Home) tab.*

- **Location line:** "Current location — Norbiton, London ▾" — uses a small green-tinted location pin icon, then the location string, then a chevron-down. This is the exact format to copy for Sniffout's location display. The pin icon and location text should be the same brand green.
- **Filter chips:** "All, Meals, Bread & pastries, Groceries..." — horizontally scrollable, no padding at ends, pill shape. The "All" chip starts selected (brand green fill). This is the direct reference for Sniffout's walk filter chips.
- **Section pattern:** "Top picks near you" + "See all" on the same line. Content below. Then a second section with the same pattern. This two-section structure (featured + urgency-based) maps to Sniffout's "Best walks near you" + "Today's tip/hazard" sections.
- **Card image proportions in horizontal scroll:** Cards in the horizontal scroll are roughly 2:3 portrait orientation with a square-ish photo at top. For Sniffout's horizontal walk scroll on the Home tab, use portrait cards (~160px wide × ~200px tall) with a roughly 1:1 photo (~160px).

### Screenshot 4 — Deliveroo Home
*Supplementary reference for the Today tab header and category chips.*

- **Location at very top with no header bar:** "Queenshurst Square ▾" sits directly below the status bar, left-aligned, with the location name in larger type (18px, semibold) and a chevron. Sniffout's wordmark "sniffout" should go in this position but paired with the location line directly below it. Do not use a full header/navbar — the app name and location together form a compact top section.
- **Category icon chips:** Deliveroo uses square icon tiles (coloured background, icon, label below). Sniffout should not use this pattern — it is food-delivery specific. The TGTG filter chip pattern is more appropriate. But the horizontal-scroll category navigation at the top of the Nearby tab can borrow the compact icon + label format for venue type selection.
- **Full-width featured cards:** The first large card after the search bar in Deliveroo is full-bleed (edge to edge with screen padding, photo dominant). This is the reference for Sniffout's weather hero card on the Today tab — it should be the first full-width card below the location line, and it should be visually dominant.

---

## Part 3: Tab-by-Tab Design Specifications

### Global Specifications (applies to all tabs)

**Typography:**
- Font: Inter (Google Fonts CDN, weights 400/500/600/700 only)
- Scale: Display 28px/700 · H1 22px/700 · H2 18px/600 · Body 15px/400 · Label 13px/500 · Caption 11px/400
- Line heights: Headings 1.2 · Body 1.6 · Labels 1.4

**Colour tokens (light mode):**
```
--bg:          #F7F5F0   /* warm off-white, screen background */
--surface:     #FFFFFF   /* card surfaces */
--brand:       #1E4D3A   /* forest green — primary accent */
--brand-mid:   #2E7D5E   /* lighter green — hover/selected states */
--amber:       #D97706   /* hazard caution */
--red:         #DC2626   /* hazard severe */
--ink:         #111827   /* primary text */
--ink-2:       #6B7280   /* secondary/meta text */
--border:      #E5E7EB   /* hairline borders */
--chip-off:    #D1D5DB   /* unselected chip border */
```

**Colour tokens (dark mode — `body.night`):**
```
--bg:          #0F1C15
--surface:     #1A2E22
--brand:       #6EE7B7   /* emerald-300, visible on dark */
--amber:       #FCD34D
--ink:         #F9FAFB
--ink-2:       #9CA3AF
--border:      #2D4A38
```

**Spacing (8px base unit):**
- Screen edge padding: 16px
- Card internal padding: 16px
- Card gap: 12px
- Section gap: 32px
- Section title to content: 12px

**Border radius:**
- Cards: 16px
- Primary buttons: 12px
- Filter chips / pills: 99px
- Walk/venue tags: 6px
- Bottom sheet: 24px 24px 0 0 (top corners only)
- Map container (when inset): 16px top corners

**Elevation:**
- Cards: `border: 1px solid var(--border)` only — no shadow
- Floating elements (pills over map, FABs): `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- Pressed state: `transform: scale(0.97)`, 150ms ease-out

**Bottom navigation:**
- Height: 64px + `env(safe-area-inset-bottom)`
- Background: `var(--surface)` with `border-top: 1px solid var(--border)`
- Active tab: filled icon, text in `var(--brand)`
- Inactive tab: outlined icon, text in `var(--ink-2)`
- Labels: 10px, weight 500
- Tabs: Today · Weather · Walks · Nearby · Me

---

### Tab 1: Today (Home Screen)

**Current state clarification:** This tab does not currently exist. The app currently shows a splash screen — a search form for entering a UK postcode or place name — and nothing else is visible until the user submits a location. After a successful search, the app renders the last active tab (defaulting to Weather). The splash then disappears and is never shown again within the 8-hour session window.

The "Today" tab is a new design recommendation that replaces and extends the current splash/search pattern. The goal is to eliminate the gap between opening the app and seeing useful content.

---

**The core UX problem with the current splash:**

The current screen does only one thing: collect a location. It shows no value before that step is complete. For first-time users this is an extra hurdle before they see anything compelling. For returning users (within session) the splash is skipped entirely, which is correct — but the home tab they land on is Weather, not a genuine home dashboard.

The benchmark apps referenced (Citymapper, Monzo, Strava) share a principle: **the home screen is the app, not a gate to the app.** Citymapper opens to a map of your location. Strava opens to your feed. Monzo opens to your balance. None of them make you complete an action before the screen is useful. Sniffout should follow the same principle.

---

**Recommended approach: two states, one screen**

The home screen has two distinct states depending on whether a location is known. These should be handled as two rendering modes of the same tab, not two separate screens.

---

#### State A — No location (first visit, or session expired)

**Purpose:** Get to useful content in the fewest possible taps. Demonstrate the app's value before asking anything of the user.

**Design principle:** Don't show a blank form. Show a preview of what they'll get, with a clear single action to unlock it.

```
┌─────────────────────────────────────────┐
│                  [safe-area top]         │
│  sniffout                               │  ← Wordmark, Inter 700, 22px, brand green, left
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Find great dog walks               ││  ← H1, 26px/700, ink
│  │  near you — and know                ││
│  │  if conditions are safe.            ││
│  │                                     ││
│  │  [📍 Use my location      ]         ││  ← Primary CTA, full-width, brand green button
│  │                                     ││    52px tall, border-radius 12px
│  │  or enter a place or postcode       ││  ← Secondary link, 13px, ink-2, underlined
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│  SEARCH INPUT (shown if "enter a place" │  ← Collapses/expands on tap of secondary link
│  tapped, or as initial alternative)     │  ← Hidden by default, animate open
│  ┌─────────────────────────────────────┐│
│  │ 🔍  Dorking, Richmond, SW11...  [→] ││
│  └─────────────────────────────────────┘│
│  [Recent: Richmond ·  Hampstead] →      │  ← Recent searches as pills, if any exist
│                                         │
├─────────────────────────────────────────┤
│  PREVIEW SECTION                        │
│  What you'll get:                       │  ← Section label, 11px uppercase, ink-2
│                                         │
│  ┌─────────────────────────────────────┐│  ← Walk preview card (real card, slightly
│  │ [blurred photo overlay]             ││    desaturated or with "Your location" placeholder)
│  │ Walks near [your location]          ││  ← Placeholder text, not real walk
│  │ Off-lead · Woodland · Coastal       ││  ← Real tag examples
│  └─────────────────────────────────────┘│
│                                         │
│  ┌──────────────────────────────────┐   │  ← Weather preview card, simplified
│  │  ⛅  Live weather + paw safety   │   │
│  │  Know before you go              │   │
│  └──────────────────────────────────┘   │
│                                         │
│  50+ curated walks across the UK        │  ← Social proof, 13px, ink-2, centred
│  Free · No sign-up · Works offline      │
└─────────────────────────────────────────┘
                [bottom nav — dimmed]
```

**State A behaviour:**
- On load: immediately attempt geolocation (`navigator.geolocation.getCurrentPosition`)
- While geolocation is in progress: show the "Use my location" button with a subtle loading spinner inside it, not a separate loading screen
- If geolocation succeeds: skip to State B immediately — no user action required
- If geolocation fails or is denied: reveal the search input, focus it automatically
- If geolocation is not supported: show search input only, no geolocation button

**"Use my location" button:**
- Background: `#1E4D3A`, white text, 52px height, border-radius 12px, full width with 16px horizontal margin
- Icon: filled location pin SVG (white, 18px), left of text
- Loading state: replace icon with a small white spinner (CSS animation, 16px), text changes to "Finding your location…"
- Success state: transition instantly to State B

**Preview cards:**
- The walk preview card should look exactly like a real walk card but with a soft overlay (`rgba(247,245,240,0.5)`) and placeholder copy. Not a blurred screenshot — a real card component in a muted state.
- The weather preview card should be the same shape as the real weather hero card but with static copy. Gives users a sense of what they'll see without fabricating data.
- These are not interactive — they are purely illustrative. No click handlers.

**Bottom nav in State A:**
- Shown but dimmed — all items at reduced opacity except the "Today" tab
- Not interactive until location is set (pointer-events: none on other tabs)
- This signals that more is available, without creating a dead-end if tapped

**Implementation notes for State A:**
- Geolocation request should happen immediately on page load, not on button tap. The button tap is only needed if geolocation is blocked or fails.
- `navigator.geolocation.getCurrentPosition(success, error, { timeout: 8000, maximumAge: 300000 })` — 8 second timeout, accept cached position up to 5 minutes old
- On success: call `reverseGeocode(lat, lon)` using Nominatim (already exists), then `fetchWeather(lat, lon)`, then render State B
- The "enter a place" link should toggle the search input with a smooth expand animation (CSS `max-height` transition from 0 to auto equivalent)
- Recent searches should be drawn from `localStorage: recentSearches` exactly as the current splash does

---

#### State B — Location known (returning user, or just set location)

**Purpose:** Answer "is it a good time to walk today, and where should I go?" in under 2 seconds of looking at the screen.

**This is the full home dashboard.** It replaces the weather tab as the default landing experience once a location is established.

```
┌─────────────────────────────────────────┐
│                  [safe-area top]         │
│  sniffout                               │  ← Wordmark, Inter 700, 22px, brand green, left
│  📍 Near Dorking, Surrey  ▾             │  ← Location line: 13px, ink-2, green pin icon, tappable
├─────────────────────────────────────────┤
│                                         │
│  WEATHER HERO CARD                      │  ← Full-width, 16px margin, border-radius 16px
│  ┌─────────────────────────────────────┐│
│  │  ☁  Overcast                        ││  ← Condition icon, 44px, white
│  │                                     ││
│  │  14°C                               ││  ← Temp, 36px/700, white
│  │  Feels like 11°C                    ││  ← 13px/400, white 70% opacity
│  │                                     ││
│  │  ✓  Good walking conditions         ││  ← Verdict, 18px/600, white
│  │                                     ││
│  │  [Wind 18mph]  [Dry]  [UV Low]      ││  ← Condition pills, rgba(255,255,255,0.2) bg
│  └─────────────────────────────────────┘│
│  background: #1E4D3A (light mode)       │
│              #1A2E22 (dark/night mode)  │
│                                         │
├─────────────────────────────────────────┤
│  HAZARD CARD  (only if hazard active)   │  ← Amber card, not shown in good conditions
│  ┌─────────────────────────────────────┐│
│  │  ⚠  Heat risk                       ││  ← Icon + bold label
│  │  🐾 Pavement may be hot. Use the   ││  ← Paw icon for paw-specific content
│  │  7-second test before heading out.  ││
│  └─────────────────────────────────────┘│
│  border: 1px solid #D97706              │
│  background: rgba(217,119,6,0.07)       │
│                                         │
├─────────────────────────────────────────┤
│  Best walks near you        See all →   │  ← H2 left + brand green "See all" right
│                                         │
│  [card] [card] [card] →→→              │  ← Horizontal scroll, portrait cards 160×210px
│                                         │
├─────────────────────────────────────────┤
│  SEASONAL TIP  (only if date-triggered) │  ← Green-tinted informational card
│  ┌─────────────────────────────────────┐│
│  │  🌿  Adder season (Apr–Sep)         ││
│  │  Keep dogs on marked paths in       ││
│  │  heathland and moorland areas.      ││
│  └─────────────────────────────────────┘│
│  background: rgba(30,77,58,0.06)        │
│  border: 1px solid rgba(30,77,58,0.2)  │
│                                         │
└─────────────────────────────────────────┘
                [bottom nav — fully active]
```

**Location line:**
- Tappable — tap opens the search input inline (same expand animation as State A), allowing the user to change location
- Format: `📍 Near [city], [county] ▾` — "Near" prefix feels conversational, not clinical
- The chevron (▾) signals it's interactive
- After changing location: re-fetch weather + re-render State B for new location, save to session

**Weather hero card:**
- Background: `#1E4D3A` in light mode, `#1A2E22` in dark/night mode
- No photo background — solid colour only (see Part 1, point 2 for reasoning)
- Condition icon: 44px SVG, white. Use a small set of meaningful icons: sun, cloud, rain, wind, snow, fog, storm. Do not use emoji.
- Verdict text is the single most important line on the screen. **⚠️ The verdict strings listed below are first-draft placeholders and are superseded. Do not use them.** Approved verdict strings are in `copy-review.md` Section 6 and `phase1-build-brief.md` Section 9 — use those only.
  - ~~"Good walking conditions"~~ → use `🌤️ Lovely walking weather`
  - ~~"Good, but breezy"~~ → use `💨 Too gusty to be out` (if applicable)
  - ~~"Hot day — walk early or late"~~ → use `🌡️ Warm today — timing matters`
  - ~~"Wet but walkable"~~ → use `☔ It's raining — but walkable`
  - ~~"Avoid the heat today"~~ → use `🌡️ Too hot to walk safely`
  - ~~"Poor conditions"~~ → use appropriate approved string from phase1-build-brief.md
- Condition pills: small rounded pills for key readings. Max 3 pills. `rgba(255,255,255,0.18)` background, white text, 11px/500
- Tap on card: navigates to the Weather tab for full detail

**"Best walks near you" horizontal scroll:**
- Derives the nearest N walks from WALKS_DB sorted by distance from `currentLocation`
- Show 5–8 walks in the scroll. Cards are ~160px wide × ~210px tall.
- Portrait card anatomy:
  ```
  ┌─────────────────┐
  │                 │
  │  photo (square) │  ← object-fit: cover, border-radius 12px 12px 0 0
  │  [Off-lead] ♡   │  ← badge pill bottom-left, heart top-right
  ├─────────────────┤
  │ Ashdown Forest  │  ← 13px/600, ink, 2 lines max
  │ 2.8 mi · 1h20  │  ← 11px/400, ink-2
  └─────────────────┘
  ```
- Tapping a card opens the walk detail overlay (same as from the Walks tab)
- "See all →" navigates to the Walks tab

**Seasonal tip card:**
- Driven by a hardcoded `SEASONAL_TIPS` constant: array of `{ months: [4,5,6,7,8,9], text: '...', icon: '🌿' }`
- Only shown if current month matches. Not dismissible on first implementation.
- Tap: navigates to Weather tab (the hazard detail lives there)

**Transition from State A to State B:**
- State B renders by replacing the State A DOM content within `#app`
- Fade transition: `opacity 0 → 1` over 200ms
- The bottom nav becomes fully interactive
- `localStorage: sniffout_active_tab` is set to `'home'`
- No page reload, no route change — just DOM replacement and class updates

**Implementation notes for State B:**
- All data is already fetched by the time State B renders (weather + location)
- The seasonal tip check is `const month = new Date().getMonth() + 1` — purely client-side
- The horizontal walk scroll is `WALKS_DB.filter(nearbyLogic).slice(0,8)` — no new computation needed
- The weather verdict string should be derived from a pure function `getWalkVerdict(weatherData)` returning one of the six strings above. This function should be shared between the Today tab and the Weather tab's summary line to ensure consistency.

---

**Why not keep the current splash and just add a home tab?**

The current splash exists because location is a prerequisite for everything in the app. The design question is whether to treat location-gathering as a gate (current approach) or integrate it into the home screen itself (recommended approach).

The argument for the current approach: it's simple, works, and users understand search forms. The argument against: it delays the moment of value, looks like a form rather than an app, and doesn't match the standard set by Citymapper (which opens directly to a map and asks for location permission, not a search form).

The recommended approach does not eliminate the search input — it demotes it from primary action to fallback. Geolocation is attempted silently on load. Most users on a trusted app will have location already cached from a prior visit, or will grant permission immediately, and will skip the search screen entirely. The search form is still there for the minority who need it.

This is the same pattern Citymapper uses: it requests location permission on load, and if granted, opens directly to your area. The search bar is present but not the first thing you interact with.

---

### Tab 2: Weather

**Purpose:** Detailed conditions for users who want to understand conditions before heading out, with dog-specific safety context.

**Screen layout (top to bottom):**

```
┌─────────────────────────────────────────┐
│  Weather                                 │  ← H1, left-aligned, 22px/700
│  📍 Near Dorking, Surrey                │  ← Location, caption size, ink-2
├─────────────────────────────────────────┤
│  CURRENT CONDITIONS GRID                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 🌡 14°C │ │ 💧 78%  │ │ 💨 18mph │ │  ← Temp / Humidity / Wind
│  │ Temp     │ │ Humidity │ │ Wind     │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ ☁ UV 2  │ │ 👁 10km │ │ 🌡 11°C │ │  ← UV / Visibility / Feels-like
│  │ UV Index │ │ Visibility│ │ Feels    │ │
│  └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────┤
│  PAW SAFETY INDICATOR                   │  ← Always shown (not conditional)
│  ┌─────────────────────────────────────┐ │
│  │  🐾  Paw Safety: GOOD              │ │  ← Traffic-light status: GOOD/CAUTION/DANGER
│  │  Pavement temperature is safe.      │ │  ← One-line plain English
│  │  Reassess if temperature exceeds    │ │
│  │  25°C — use the 7-second test.      │ │
│  └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  ACTIVE HAZARDS (only if present)        │
│  ┌─────────────────────────────────────┐ │
│  │  ⚠ Strong Wind                     │ │  ← Amber border card
│  │  18 mph gusts. Consider sheltered  │ │
│  │  woodland walks today.              │ │
│  └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  BEST WALK WINDOW                        │
│  Today's ideal walk times               │  ← Section header
│  ┌─────────────────────────────────────┐ │
│  │  [6am][7am][8am][9am]...[9pm]      │ │  ← Hourly bar: green/amber/gray segments
│  │  Ideal: 6am–9am and 7pm–9pm        │ │  ← Plain English summary below bar
│  └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  3-DAY FORECAST                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Thu     │ │  Fri     │ │  Sat     │ │
│  │  ☀       │ │  🌧      │ │  ⛅      │
│  │  16° / 9°│ │  12° / 7°│ │  14° / 8°│
│  │  ✓ Good  │ │  ⚠ Wet   │ │  ✓ Good  │
│  └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
                [bottom nav]
```

**Current conditions grid:**
- 2 rows × 3 columns, each cell is a card
- Cell: 16px padding, border-radius 12px, `var(--surface)` background, `1px solid var(--border)`
- Icon: 20px, brand green
- Value: 18px / 600 weight, ink
- Label: 11px / 400, ink-2
- Cells should be equal-width using CSS Grid: `grid-template-columns: repeat(3, 1fr); gap: 8px`

**Paw safety indicator:**
- Always visible — this is a key differentiator, not conditional
- Full-width card with coloured left border (4px):
  - Green border (`#1E4D3A`) + green-tinted background when safe (below 20°C)
  - Amber border (`#D97706`) + amber-tinted background at caution (20–25°C)
  - Red border (`#DC2626`) + red-tinted background at danger (25°C+)
- Paw icon: 24px, matching border colour
- Status label: "PAW SAFETY: GOOD / CAUTION / DANGER" in 13px / 600 uppercase, colour matches status
- Body text: 13px, ink, explains threshold and includes 7-second test reference when relevant
- Thresholds: < 20°C = safe, 20–25°C = caution ("check pavement with back of hand"), > 25°C = danger

**Hazard cards:**
- Only rendered if hazards detected (rain >threshold, wind >threshold, heat >threshold)
- Amber border (1px `#D97706`) + `rgba(217,119,6,0.06)` background for caution
- Red border + tint for severe (storm-force wind, extreme heat)
- Icon: 20px, amber or red
- Title: 15px / 600, ink
- Description: 13px / 400, ink — one to two lines maximum, dog-specific (e.g. "Strong gusts can unsettle dogs on exposed routes — consider woodland walks today")

**Best walk window (hourly bar):**
- A horizontal sequence of 24 small blocks (or just daylight hours: 6am–10pm), colour-coded:
  - `#1E4D3A` = ideal (no hazards, daylight)
  - `#D97706` = marginal (mild hazard)
  - `#E5E7EB` = poor/nighttime
- Below the bar: plain English summary — "Ideal: 6am–9am and 7pm–9pm"
- **Implementation note:** This requires scanning the hourly forecast array from Open-Meteo. The data is already available. Write a pure JS function `getBestWalkWindows(hourlyData)` that returns labelled time ranges. The bar itself is just `display: flex; gap: 2px` with coloured `div` elements. Straightforward to implement.

**3-day forecast:**
- 3 cards in a row, `grid-template-columns: repeat(3, 1fr); gap: 8px`
- Each card: day name (13px/600), condition icon (24px), high/low temps (13px), suitability verdict (small chip: green ✓ Good / amber ⚠ Caution / gray — Poor)
- Suitability verdict logic should match the home tab's weather hero card logic for consistency

**Implementation notes:**
- All data already fetched. This tab is pure `renderWeather()` expansion.
- The hourly bar is the most novel element but is implementable in ~30 lines of JS + CSS.
- Avoid adding any new API calls.

---

### Tab 3: Walks

**Purpose:** Discover and browse walks. The primary destination tab for most sessions.

**Screen layout — List view (top to bottom):**

```
┌─────────────────────────────────────────┐
│  ┌──────────────────────────────┐ [≡] │  ← Search bar full-width, filter icon right
│  │ 🔍 Search walks...           │     │
│  └──────────────────────────────┘     │
│  [All] [Off-lead] [Short] [Woodland]→  │  ← Filter chip row, horizontally scrollable, sticky
├─────────────────────────────────────────┤
│  [     List     ] [     Map     ]       │  ← Segmented pill, sticky below chips
│  Sort: Nearest ▾               14 walks │  ← Left: sort link, Right: result count
├─────────────────────────────────────────┤
│  WEATHER SUITABILITY BANNER             │  ← Derived from session weather — only if noteworthy
│  ⚠ Warm today — showing shaded         │
│  woodland routes first                  │
├─────────────────────────────────────────┤
│  WALK CARD                              │
│  ┌─────────────────────────────────────┐│
│  │                           [♡]       ││  ← Heart, top-right, white, box-shadow: 0 1px 4px rgba
│  │      Walk photograph                ││  ← ~180px height, object-fit: cover
│  │ [Off-lead]                          ││  ← Badge pill, bottom-left overlay
│  ├─────────────────────────────────────┤│
│  │  Ashdown Forest Loop          4.2 ★ ││  ← H2 (18px/600) + rating right-aligned (label/amber ★)
│  │  East Sussex                        ││  ← 13px, ink-2
│  │  2.8 mi · ~1h 20min · Woodland      ││  ← Single metadata line, label size (13px)
│  │  [🌿 Off-lead]  [🐄 No livestock]  ││  ← Tag chips inside card
│  └─────────────────────────────────────┘│
│                                          │
│  [next walk card...]                     │
└─────────────────────────────────────────┘
                [bottom nav]
```

**Walk card anatomy (detailed):**
- Border-radius: 16px; background: `var(--surface)`; border: `1px solid var(--border)`
- **Photo area:** Height 180px, `object-fit: cover`, `border-radius: 16px 16px 0 0`. Shows a representative UK landscape photo per walk (add `imageUrl` field to WALKS_DB).
- **Badge pill:** Positioned `absolute; bottom: 12px; left: 12px` within photo div. Background `rgba(0,0,0,0.55)`, white text, 11px/500, border-radius 99px, padding 4px 10px. Shows primary category: "Off-lead", "Woodland", "Coastal", "Hidden gem".
- **Heart icon:** Positioned `absolute; top: 12px; right: 12px`. White heart SVG, 20px, `background: rgba(255,255,255,0.9)`, border-radius 50%, padding 6px, `box-shadow: 0 1px 4px rgba(0,0,0,0.15)`. Filled in brand green when favourited, outline when not.
- **Card body:** 16px padding.
  - Row 1: Walk name (18px/600, ink, flex-grow) + Star rating (13px/500, ink-2, amber ★ + number, flex-shrink)
  - Row 2: Location / region (13px, ink-2)
  - Row 3: `2.8 mi · ~1h 20min · Woodland` — single line, 13px, ink-2, items separated by middot (·)
  - Row 4: Tag chips — `[🌿 Off-lead]`, `[🐄 No livestock]`, `[🧱 Stiles]`, `[🚗 Parking]`. Max 3 chips visible. Tags: `background: rgba(30,77,58,0.1); color: #1E4D3A; border-radius: 6px; padding: 3px 8px; font-size: 12px; font-weight: 500`

**Filter chips row:**
- Chips: All · Off-lead · Short (< 2mi) · Woodland · Coastal · Easy · No livestock · No stiles
- First chip ("All") starts at 16px from left edge
- Row: `overflow-x: auto; display: flex; gap: 8px; padding: 0 16px; scrollbar-width: none`
- Row is `position: sticky; top: 0; background: var(--bg); z-index: 10; padding-top: 12px; padding-bottom: 12px` — sticks below status bar
- Chip inactive: `background: #fff; border: 1px solid #D1D5DB; color: #374151; height: 36px; padding: 0 16px; border-radius: 99px; font-size: 13px; font-weight: 500; white-space: nowrap`
- Chip active: `background: #1E4D3A; border: none; color: #fff`
- Chip transition: `background-color 150ms ease, color 150ms ease`

**Search bar:**
- Full-width below sticky header, 16px margin left/right
- Height: 44px; background: `var(--surface)`; border: `1px solid var(--border)`; border-radius: 12px; padding: 0 12px
- Left icon: magnifying glass SVG, 16px, ink-2
- Right icon: sliders/filter SVG, 16px, ink-2, tappable (opens filter panel)
- Placeholder: "Search walks..." in ink-2

**List/Map segmented toggle:**
- `position: sticky; top: [filter-chips-height + 12px]; z-index: 9` (sticks below chips)
- Width: 200px, centred using `margin: 0 auto`
- Or full-width — refer to TGTG screenshot 1 which shows it as full-width. Full-width is better for tap targets on mobile.
- Height: 40px; background: `var(--surface)`; border: `1px solid var(--border)`; border-radius: 99px; overflow: hidden
- Selected half: `background: #1E4D3A; color: #fff; font-size: 14px; font-weight: 600`
- Unselected half: `background: transparent; color: #374151; font-size: 14px; font-weight: 500`

**Weather suitability banner:**
- Only shown when weather is noteworthy (hazard active)
- Thin amber-tinted strip: `background: rgba(217,119,6,0.08); border-left: 3px solid #D97706; padding: 10px 16px; font-size: 13px`
- One line of text explaining how current weather is affecting the sort order or walk recommendations
- Logic: if heat hazard → sort shaded/woodland walks higher. If wet → surface "muddy-friendly" tag info. This requires a small sort modifier in `renderWalks()`.

**Map view:**
- Leaflet map fills the full tab area (below the sticky chips and toggle only)
- Walk markers: custom SVG pin in `#1E4D3A`, white dog-paw icon or dot inside
- Clustered pins: circle in `#1E4D3A` with white number when multiple pins are close
- Tapping a pin opens a bottom sheet at half-screen (~50% of viewport height) showing: photo, walk name, key metadata, "View details" button
- The List/Map toggle floats `position: absolute; top: 16px; left: 50%; transform: translateX(-50%)` over the map div, exactly as in TGTG screenshot 2
- Search bar also persists above the map (slimmed down, no filter icon in map view)

**Walk detail view:**
- Triggered by tapping a walk card (list) or "View details" button (map bottom sheet)
- Rendered as a `position: fixed; inset: 0; z-index: 500` overlay, slides up from bottom
- The bottom nav bar should hide when detail view is open (`display: none` on the nav, add back button at top)
- **Detail view layout:**
  ```
  ┌─────────────────────────────────────────┐
  │  ← Back           Walk Name      [♡]    │  ← Sticky top bar, white bg, border-bottom
  ├─────────────────────────────────────────┤
  │  HERO IMAGE                             │  ← ~240px height, full width
  │  (gradient scrim at bottom: linear-     │
  │  gradient transparent → rgba(0,0,0,0.4))│
  │  Walk Name overlaid on scrim            │  ← 24px/700, white, bottom-left of image
  ├─────────────────────────────────────────┤  ← Scrollable content below
  │  PRACTICAL DETAILS GRID                 │
  │  [📏 2.8 mi] [⏱ 1h 20] [⬆ Moderate]  │
  │  [🌿 Off-lead] [🐄 No livestock]       │
  │  [🛤 Mixed] [🚗 Parking available]     │  ← All as chips/small cards in 3-col grid
  ├─────────────────────────────────────────┤
  │  DESCRIPTION                            │  ← Body text, 15px, line-height 1.6
  ├─────────────────────────────────────────┤
  │  MAP                                    │  ← Leaflet map, ~200px height, border-radius 12px
  │  [centred on walk coordinates]          │
  ├─────────────────────────────────────────┤
  │  NEARBY DOG-FRIENDLY PLACES             │  ← Mini venue cards (top 3)
  │  [Pub] [Café] [Car park]                │
  ├─────────────────────────────────────────┤
  │  [    Share this walk    ]              │  ← Full-width secondary button, Web Share API
  └─────────────────────────────────────────┘
  ```

**WALKS_DB field additions required:**
```javascript
{
  id: "ashdown-forest-loop",
  name: "Ashdown Forest Loop",
  region: "East Sussex",
  lat: 51.067, lon: 0.022,
  distance: 2.8,          // miles
  duration: 80,           // minutes
  difficulty: "moderate", // easy | moderate | hard
  terrain: "mixed",       // paved | muddy | mixed | rocky
  tags: ["woodland", "off-lead"],
  offLead: "full",        // full | partial | none
  livestock: false,
  hasStiles: false,
  hasParking: true,
  isPushchairFriendly: false,
  description: "...",
  imageUrl: "https://...",
  rating: 4.2,
  reviewCount: 14,
  badge: "Hidden gem"     // optional: "Popular" | "Hidden gem" | "New"
}
```

**Empty state (no walks match filters):**
- Simple line illustration: a dog sitting, looking at a signpost
- Heading: "No walks found nearby"
- Sub-text: "Try adjusting your filters or expanding your search area"
- CTA button: "Clear filters" (brand green, 12px radius)
- Do not use a spinner for the empty state — it implies loading

**Loading state:**
- Skeleton cards: same dimensions as real cards, photo area as `#F3F4F6` with shimmer animation, two text lines as `#F3F4F6` bars of appropriate widths
- Shimmer: CSS `@keyframes shimmer` with a linear-gradient sweep from left to right, 1.5s infinite

**Implementation notes for Walks tab:**
- The weather suitability banner and sort modifier is the highest-value addition and directly maps to feature recommendation #2.
- Off-lead, livestock, terrain fields (recommendation #1, #3) are required for the filter chips to have any effect beyond what exists today.
- The walk detail overlay (fixed positioning) is the most complex single UI element in the app. It requires careful management of scroll lock (add `overflow: hidden` to `body` when open), back button behaviour, and transition animation. Achievable but needs careful implementation.
- Image loading: use `loading="lazy"` on all walk card images and a low-quality placeholder or solid brand-green background while loading.

---

### Tab 4: Nearby (currently Places)

**Purpose:** Discover dog-friendly venues near current location. Companion to Walks, not a replacement.

**Screen layout (top to bottom):**

```
┌─────────────────────────────────────────┐
│  ┌──────────────────────────────────┐   │  ← Search bar, same style as Walks tab
│  │ 🔍 Search nearby...              │   │
│  └──────────────────────────────────┘   │
│  [All] [Pubs] [Cafes] [Parks] [Vets] →  │  ← Category chips, horizontally scrollable
├─────────────────────────────────────────┤
│  [     List     ] [     Map     ]        │  ← Same segmented toggle as Walks tab
│  Showing 12 places near you             │  ← Count line, 13px, ink-2
├─────────────────────────────────────────┤
│  VENUE CARD                             │
│  ┌─────────────────────────────────────┐│
│  │                           [♡]       ││
│  │      Venue photograph               ││  ← ~140px height (shorter than walk cards)
│  │ [Pub]                               ││  ← Category badge, same pill style
│  ├─────────────────────────────────────┤│
│  │  The Anchor Inn               3.9 ★ ││  ← Name + rating
│  │  0.4 mi away · Dog-friendly patio   ││  ← Distance + short description
│  └─────────────────────────────────────┘│
│                                          │
│  [next venue card...]                    │
└─────────────────────────────────────────┘
                [bottom nav]
```

**Category chips:**
- Labels: All · Pubs · Cafes · Parks · Vets · Car parks
- Same chip style as Walks tab
- "All" selected by default
- Each chip maps to a Google Places type query in `fetchPlaces()`
- Consider adding dog-specific language where possible: "Dog-friendly pubs", "Dog-friendly cafes" — though this depends on how Places API responds to these terms. Keep label short in the chip, use the full term in the API call.

**Venue card anatomy:**
- Slightly simpler than walk cards — venues are secondary to walks in the experience
- Photo height: ~140px (walks are 180px; the visual hierarchy should reflect priority)
- No distance/time metadata row — just distance + one-line description
- No tag chips row (venues have less structured metadata)
- Rating: from Google Places, shown as amber ★ + number

**Map view:**
- Same pattern as Walks map view
- Clustered pins (see TGTG screenshot 2): brand-green circles with white number
- Individual pins: brand-green location drop pin, no custom icon needed
- Tapping a pin: bottom sheet with venue photo, name, category, distance, rating, "Get directions" link (opens Maps app via `geo:` URI or Google Maps URL)

**"Get directions" button:**
- Opens native maps app: `window.open('https://maps.google.com/?q=lat,lon')` on tap
- Style: secondary button (outline style, brand green border, brand green text, white background)
- Height: 44px, full width of bottom sheet

**Implementation notes for Nearby tab:**
- This tab is mostly built. The primary design work is visual polish: applying the new card style, chip style, and toggle style consistently.
- The category chips should replace the current category system — same function, new visual style.
- On first load, if no location is set, show an empty state with a "Set location" CTA instead of an error.

---

### Tab 5: Me (currently Profile)

**Purpose:** Lightweight personal hub. Useful without login.

**Screen layout (top to bottom):**

```
┌─────────────────────────────────────────┐
│  Me                                     │  ← H1, left-aligned
├─────────────────────────────────────────┤
│  GREETING CARD                          │
│  ┌─────────────────────────────────────┐│
│  │  Hi, Alex! 👋                       ││  ← H1 size if name set, or prompt if not
│  │  [Edit name]                        ││  ← Small inline edit button if name set
│  └─────────────────────────────────────┘│
│  [If no name set: "Add your name →"]    │  ← Tappable row opens inline text input
├─────────────────────────────────────────┤
│  STATS ROW                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │    3     │ │    12    │ │    8     │ │
│  │ Favourited│ │ Explored │ │ Week    │ │  ← Local stats only (localStorage)
│  │  walks   │ │  walks   │ │ streak  │ │
│  └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────┤
│  Favourited walks              See all → │
│  [portrait card] [portrait card] →→→    │  ← Same horizontal scroll as Home tab
│  (or: "No favourites yet — tap ♡ on   │
│   any walk to save it")                 │
├─────────────────────────────────────────┤
│  SETTINGS                               │  ← Section header
│  ┌─────────────────────────────────────┐│
│  │  Units               Miles / km  ›  ││  ← Toggle row
│  │  Dark mode      Auto (weather) / On ││  ← Toggle row
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  ▸ About Sniffout                       │  ← Collapsed rows, tap to expand
│  ▸ Privacy & legal                      │
│  ▸ Clear all data                       │  ← Destructive — requires confirmation
└─────────────────────────────────────────┘
                [bottom nav]
```

**Greeting card:**
- If `sniffout_username` is set: display "Hi, [name]!" in H1 weight. Small "Edit" button beside name.
- If not set: display a subtle prompt card — "Add your name to personalise your experience →" — tappable, opens an inline text field within the card. Confirm button in brand green. Do not use a modal for this — inline is simpler and less disruptive.

**Stats row:**
- 3-column grid of simple stat cards
- Each card: large number (32px/700, ink), label below (13px/400, ink-2)
- "Explored walks" = `localStorage` count of walked/completed walks (add `completedWalks` array)
- "Week streak" = number of consecutive weeks with at least one new walk explored — derived from completion timestamps
- If stats are all zero (new user), show a gentle empty state message inside the stats area: "Start exploring walks to see your stats"

**Favourites horizontal scroll:**
- Same component as Home tab's "Best walks near you" scroll
- If empty: show an encouraging empty state — not "No data found" but something warm:
  - Icon: outline heart, 48px, `#E5E7EB`
  - Heading: "No saved walks yet"
  - Body: "Tap the heart on any walk to save it for later"

**Settings rows:**
- List-style rows with label on left, control on right
- Thin `border-bottom: 1px solid var(--border)` between rows
- Row height: 52px
- Units toggle: "Miles" / "km" — affects all distance display throughout app. Store in `localStorage: sniffout_units`. Default: "Miles".
- Dark mode: three-way toggle — "Auto (weather)", "Always light", "Always dark". Current behaviour is Auto. Store preference.

**"Clear all data" row:**
- Shown last, in `#DC2626` red text — visually signals destructive action
- Tap: show a confirmation inline (not a browser `confirm()` dialog) — small confirmation strip slides in below the row with "Cancel" and "Clear everything" buttons
- This clears all `localStorage` keys and reloads the app

**Implementation notes for Me tab:**
- Mostly exists already. Primary work: apply new visual style to existing content.
- Week streak calculation: store completion timestamps in localStorage, calculate streaks client-side. Simple date arithmetic.
- The "Clear all data" confirmation should not use `window.confirm()` — use a CSS-animated inline confirmation strip for a polished feel.

---

## Part 4: Deferred — Community Tab (Do Not Build for POC)

The task brief mentions a "Community" tab. This should not be added to the POC for the following reasons:

1. **No content.** Without user-submitted walks and reviews, a Community tab would be empty. An empty tab destroys perceived quality.
2. **Requires backend.** Any meaningful community feature — submissions, comments, likes, user profiles — requires a database, auth, and moderation. All deferred per CLAUDE.md.
3. **Not validated.** The demand research validates walk discovery + weather safety. Community features are secondary and speculative for the UK market at POC stage.

**When the time is right (post-POC, post user traction):**
A Community tab would contain:
- User-submitted walk cards (moderated)
- Community reviews on walks (displayed on walk detail)
- Seasonal local tips from the community
- "Dogs of Sniffout" lightweight social layer (low priority, out of scope)

The tab should be introduced at the same time as optional login (see feature-recommendations.md for the login trigger conditions).

---

## Part 5: Implementation Complexity Flags for Single HTML File

The following elements in this spec are achievable in a single HTML file but require careful attention:

| Element | Complexity | Notes |
|---|---|---|
| Walk detail overlay (fixed, slide-up) | Medium | Body scroll lock + tab bar hide/show + animation. Use `body.detail-open` class to coordinate state. |
| Hourly walk window bar (Weather tab) | Low-Medium | Needs Open-Meteo hourly array processing. ~30 lines JS + 10 lines CSS. |
| Sticky filter chips + sticky segmented toggle | Low | Double-sticky requires careful `z-index` layering. Test on iOS Safari — `position: sticky` has quirks in overflow containers. |
| Skeleton loading state | Low | Pure CSS shimmer animation. Define once, apply via class. |
| Walk card image lazy loading | Low | `loading="lazy"` attribute + solid placeholder background. |
| Clustered map markers (Leaflet) | Medium | Leaflet.markercluster is a separate plugin CDN load. Can approximate clustering with manual DOM management but the plugin is cleaner. Add CDN reference only if it doesn't measurably affect load time. |
| Walk completion tracking (streak logic) | Low-Medium | Date arithmetic in pure JS. localStorage only. ~20 lines. |
| Seasonal tips lookup | Low | Static object, date comparison. 10 lines. |
| Web Share API (share walk) | Very Low | 5 lines. Check `navigator.share` exists first. |
| Dark mode CSS variable swap | Low | Already implemented (body.night class). Only needs palette update. |
| Inline name editing (Me tab) | Low | Toggle input field visibility. 10 lines JS. |

The app is at ~2,700 lines. This spec would add approximately 400–600 lines of CSS + 300–500 lines of JS across all changes. The resulting file (~3,500–3,800 lines) remains manageable. No architectural change is needed.

---

## Part 6: Priority Order for Implementation

If implementing this spec incrementally, this is the recommended order based on impact vs. effort:

1. **Visual foundation first** — colour palette swap, Inter font, card styles, bottom nav active states. Transforms the entire app's feel in one pass.
2. **Walk card redesign** — photo, badge, tag chips, heart icon. Highest-visibility element in the app.
3. **Paw safety indicator** (Weather tab) — top differentiator, fast to implement.
4. **WALKS_DB field additions** — livestock, offLead, terrain, imageUrl, badge. Unlocks filter chips and walk detail quality.
5. **Walk detail overlay** — full-screen detail view with map + nearby venues.
6. **Today tab restructure** — weather hero card + horizontal walk scroll + seasonal tip.
7. **Weather tab additions** — hourly walk window bar + 3-day forecast.
8. **Filter chips logic** — depends on #4.
9. **Weather suitability banner on Walks tab** — depends on weather session data + walk metadata.
10. **Me tab polish** — stats, inline name edit, favourites scroll.
