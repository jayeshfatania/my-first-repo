# Hourly Forecast Bar Spec
**Feature:** Horizontally scrollable hourly forecast bar — Weather tab
**Status:** Design spec — ready for Developer implementation
**Design round:** Post-Round 12

---

## Design intention

The hourly bar answers the question the hero and verdict badge do not: *what does the rest of today look like, hour by hour?* BBC Weather and Google Weather both lead with this view because it is the most actionable single surface in a daily weather screen. Sniffout's version differs from those apps in one critical way: each card carries a walk quality signal. The user isn't reading a weather chart — they're scanning for the green cluster that tells them when to head out.

This bar **replaces the existing Walk Window card** entirely. The walk window card's headline function ("Best window: 10am – 1pm") moves to the hourly bar card header, and its walk quality colouring is absorbed into the individual hour cards. Having both on screen simultaneously would duplicate the same hourly quality data in two different visual formats and force the user to scroll past two consecutive sections showing the same underlying signal.

---

## 1. Placement — immediately below the hero

The hourly bar sits in the first card position below the hero, where the Walk Window card currently lives. It is the first thing the user sees when they scroll past the verdict badge.

**Full Weather tab scroll order after this change:**

```
1. Hero  (temperature + icon + verdict badge)
2. Hourly forecast bar card   ← REPLACES Walk Window card
3. Metric tiles 2×2 grid  (Rain, Wind, UV, Humidity)
4. 5-Day forecast card
5. Pollen card
```

**Reasoning against placing it below the walk window card:** The hourly bar is a broader scan tool; the walk window card was a summary answer. If the bar replaces the walk window card and absorbs its summary text, there is nothing for it to sit "below." Placing a lower-resolution summary above a higher-resolution scan would also invert the natural reading order.

---

## 2. The walk window card — retired

The existing Walk Window card is removed. Its two pieces of value are absorbed:

| Walk Window card element | Absorbed into |
|---|---|
| "Walk window" label | Hourly bar card header label |
| Best window time ("10am – 1pm") | Hourly bar card header, right-aligned, brand green |
| `.hour-seg` quality blocks | Walk quality tint on each hourly card |
| Footer copy ("Best 3-hour window based on...") | Brief legend line at bottom of hourly bar card |

No information is lost. The hourly bar communicates everything the walk window card did, and adds weather icons and temperature — which the walk window card did not have.

---

## 3. Hourly bar card container

The bar lives inside a full-width card — same card treatment as all other cards on the tab.

```
┌──────────────────────────────────────────────┐
│  Today's forecast        Best: 10am – 1pm    │  ← header row
│  ─────────────────────────────────────────   │  ← divider
│                                              │
│  [Now][2pm][3pm][4pm][5pm][6pm][7pm]→→→      │  ← scrollable cards
│                                              │
│  Shaded cards show the best walking window.  │  ← legend footer
└──────────────────────────────────────────────┘
```

**Card container:**
- Background: `var(--surface)`
- Border: `1px solid var(--border)`
- Border-radius: `16px`
- Padding: `16px`
- Full width (same as all other cards)

**Header row:**
- Left: "Today's forecast" — Inter 600, 15px, `var(--ink)`
- Right: "Best: 10am – 1pm" — Inter 700, 15px, `var(--brand)` — derived from existing walk window best-window logic
- If no clear walking window exists (all hours poor), right side shows nothing — do not show "No good window" in the header; the card body communicates this through the absence of tinted cards
- `margin-bottom: 12px`

**Divider:**
- `1px solid var(--border)`, `margin-bottom: 12px`

**Legend footer:**
- "Shaded cards show the best walking window."
- Inter 400, 12px, `var(--ink-2)`
- `margin-top: 12px`

---

## 4. Scrollable card row

### Container behaviour

```css
display: flex;
flex-direction: row;
gap: 8px;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
scroll-snap-type: x mandatory;       /* optional: helps with alignment */
scrollbar-width: none;                /* hide scrollbar on Android */
```

Hide the native scrollbar on all platforms — the right-edge fade (see below) is the affordance.

**Right-edge fade:** A `linear-gradient(to right, transparent, var(--surface))` pseudo-element on the right edge of the scroll container, approximately `32px` wide, at 80% opacity. This signals that more cards exist to the right without a hard cutoff. It fades out the last visible card softly. The pseudo-element is `pointer-events: none` so it does not block taps.

**No left fade.** At load, the scroll position starts at the left (current hour). A left fade on the initial view would falsely imply content to the left.

### How many cards to show

- Show remaining hours of the current day only: current hour through midnight
- If it is 11pm, there is one card ("Now") — this is fine; the bar still renders
- Do not show tomorrow's hours in this bar (that context belongs to the 5-day forecast card)
- "Now" is always the leftmost card and the first card rendered

---

## 5. Individual hourly card

### Dimensions

- **Width: 68px**
- **Height: 96px** (content-driven — do not use fixed height; let padding determine this)
- **Padding: 8px 6px** (top/bottom 8px, left/right 6px)
- **Border-radius: 12px**
- `scroll-snap-align: start` (if scroll-snap is enabled)
- `flex-shrink: 0` (prevents cards from compressing)

At 68px card + 8px gap = 76px per card. On a 358px content area (390px screen − 32px padding) this gives approximately 4.7 cards visible before the right-edge fade — the user sees 4 full cards and a partial 5th, clearly implying a scrollable row.

### Card layout (top to bottom, centred)

```
┌──────────┐
│  Now     │  ← time label
│          │
│  [icon]  │  ← Yr.no icon
│          │
│  14°     │  ← temperature, colour-encoded
│          │
│    ●     │  ← walk quality dot
└──────────┘
```

All elements are `text-align: center` and centred horizontally within the card.

**Time label:**
- "Now" for the current hour; "2pm", "3pm", "10am" etc for future hours
- Inter 600, 11px for "Now" card; Inter 400, 11px, `var(--ink-2)` for future hours
- "Now" label colour: `var(--brand)` — distinguishes it from all future hours without a size change

**Yr.no icon:**
- 28×28px
- `margin-top: 4px`
- Use the same icon source and rendering approach as the hero icon — just smaller

**Temperature:**
- Inter 700, 14px
- Colour-encoded by comfort range (per temperature-tap-spec.md):

| Temperature | Colour |
|---|---|
| Below 2°C | `#6B9FD4` (cool blue) |
| 2–7°C | `var(--ink-2)` |
| 8–22°C | `var(--ink)` |
| 23–27°C | `var(--amber)` |
| 28°C+ | `var(--red)` |

- Show actual temperature, not feels-like — cards are too narrow for a secondary value. Feels-like is available in the metric tile context.
- No °C unit shown on individual cards — it is universal and stated once, if at all, in the card header. Do not include a unit string on each card.

**Walk quality dot:**
- 5px filled circle, centred, `margin-top: 4px`
- Uses the same per-hour quality value as the existing `.hour-seg` blocks:
  - Good hour: `var(--brand)` (#3B5C2A)
  - Marginal hour: `var(--amber)` (#F59E0B)
  - Poor hour / outside walking window: `rgba(0,0,0,0.12)` (barely visible — neutral, not alarming)

---

## 6. Walk quality background tint

In addition to the dot, each card receives a subtle background tint based on walk quality. The tint makes the "good window" cluster immediately visible as a contiguous band of slightly green cards — the user does not need to consciously scan the individual dots.

| Quality | Card background |
|---|---|
| Good | `rgba(59, 92, 42, 0.07)` — faint brand-green wash |
| Marginal | `rgba(245, 158, 11, 0.07)` — faint amber wash |
| Poor | `var(--surface)` — no tint, standard white |

The tint is very light — 7% opacity. Its purpose is pattern recognition across the row, not individual card emphasis. At this opacity, it does not conflict with the temperature colour encoding or the dot.

---

## 7. Current hour ("Now") card treatment

The "Now" card is visually the most distinct card in the row — it is the user's anchor.

```
┌──────────┐
│  Now     │  ← brand green, Inter 600
│          │
│  [icon]  │
│          │
│  11°     │  ← temperature (colour-encoded, same as other cards)
│          │
│    ●     │  ← walk quality dot
└──────────┘
  border: 1.5px solid var(--brand)
```

- Border: `1.5px solid var(--brand)` — the only card with a coloured border
- Time label: `var(--brand)`, Inter 600 (vs `var(--ink-2)` Inter 400 on future cards)
- No size change from other cards — consistent card width preserves horizontal rhythm

The coloured border + green label combination is unambiguous without being heavy. It mirrors the "Today" column distinction in the 5-day forecast card (where "Today" label is brand green).

---

## 8. No tap interaction

Individual hourly cards are **not tappable**. The bar is a read-only scroll.

Reasoning:
- At 68px wide, individual cards are marginal tap targets for one-handed use with a dog lead
- The metric tile sheets already provide per-hour deep detail for rain, wind, UV, and humidity
- The hourly bar's job is overview — scanning the whole day's pattern. Tapping one card for its detail would switch the user's mental mode from "scanning" to "drilling", and the metric tiles already serve that mode
- Adding a sixth tap target type to the Weather tab (after four metric tiles and the verdict badge) would fragment the interaction model

Cards have a subtle `:active` opacity dip (`0.88`) for feedback if the user presses, but nothing happens on release.

---

## 9. Dark mode

The card container and hourly cards use the standard dark mode surface token (`var(--surface)` → `#1A2C22`). The right-edge fade gradient becomes `linear-gradient(to right, transparent, #1A2C22)`.

Walk quality tint in dark mode:
- Good: `rgba(130, 176, 154, 0.10)` — the dark mode `--brand` value at 10% (slightly higher opacity to remain visible on the dark surface)
- Marginal: `rgba(245, 158, 11, 0.10)` — same amber, slightly higher opacity
- Poor: no tint

The current-hour card border in dark mode: `1.5px solid #82B09A` (dark mode `--brand`). The green is muted in dark mode but still distinct and readable against `#1A2C22`.

Temperature colour encoding in dark mode: all values remain the same except `var(--ink)` (standard black) which maps to the dark mode near-white `--ink` token. No overrides needed beyond the existing dark mode token set.

---

## 10. Full card wireframe — light and dark

**Light mode — "Now" card:**
```
╔══════════╗
║  Now     ║  brand green, 600
║          ║
║  [icon]  ║  28×28
║          ║
║  11°     ║  --ink (comfortable range)
║          ║
║    ●     ║  brand green dot
╚══════════╝
  brand green border, faint green tint
```

**Light mode — marginal future card:**
```
┌──────────┐
│  6pm     │  --ink-2, 400
│          │
│  [icon]  │  28×28
│          │
│  21°     │  --amber (warm range)
│          │
│    ●     │  amber dot
└──────────┘
  faint amber tint
```

**Light mode — poor future card:**
```
┌──────────┐
│  9pm     │  --ink-2, 400
│          │
│  [icon]  │  28×28
│          │
│   8°     │  --ink-2 (chilly range)
│          │
│    ·     │  near-invisible dot
└──────────┘
  no tint
```

---

## 11. CSS classes

Following the `wx-` prefix convention.

```css
.wx-hourly                /* Full-width card container */
.wx-hourly-header         /* Title + best-window row */
.wx-hourly-title          /* "Today's forecast" label */
.wx-hourly-best           /* "Best: 10am – 1pm" value, right-aligned, brand */
.wx-hourly-scroll         /* overflow-x: auto scroll container */
.wx-hourly-fade           /* Right-edge fade gradient pseudo-element */
.wx-hourly-legend         /* Footer legend text */

.wx-hour-card             /* Individual card */
.wx-hour-card--now        /* Current hour modifier: brand border + green label */
.wx-hour-card--good       /* Good walk quality modifier: green tint */
.wx-hour-card--marginal   /* Marginal quality modifier: amber tint */
.wx-hour-time             /* Time label */
.wx-hour-icon             /* Yr.no weather icon */
.wx-hour-temp             /* Temperature number */
.wx-hour-dot              /* Walk quality dot */
.wx-hour-dot--good        /* Brand green fill */
.wx-hour-dot--marginal    /* Amber fill */
.wx-hour-dot--poor        /* Near-transparent outline */
```

---

## 12. Data requirements

All data is available from the existing `fetchWeather()` call. No new API parameters are needed.

| Data | Source | Notes |
|---|---|---|
| `temperature_2m` (hourly) | Open-Meteo, existing fetch | Actual temperature per hour |
| Yr.no icon code (hourly) | Open-Meteo `weathercode`, existing fetch | Maps to Yr.no icon URL — same mapping as hero icon |
| Walk quality per hour | Existing `.hour-seg` calculation | Reuse directly — same quality score that drives the walk window card |
| Best walking window | Existing walk window best-window logic | Already calculated for the walk window card header; pass to `.wx-hourly-best` |

The JS function that builds the hourly bar reads from the same data object as `renderWeather()`. No separate fetch, no additional state.

---

## 13. Summary for Developer

1. Remove the Walk Window card (`wx-walk-window` or equivalent) from the Weather tab render
2. Add `.wx-hourly` full-width card immediately below the hero, in its place
3. Header: "Today's forecast" left + best-window time right (brand green) — reuse existing best-window calculation
4. Scrollable row of `.wx-hour-card` elements, one per remaining hour (current hour → midnight)
5. Each card: time label, 28px Yr.no icon, temperature (colour-encoded), 5px quality dot
6. Current hour card gets `.wx-hour-card--now` modifier: brand border + green time label
7. Walk quality tint via `.wx-hour-card--good` / `--marginal` modifier classes — 7% opacity background
8. Right-edge fade: absolute-positioned pseudo-element on the scroll container, 32px wide
9. No tap interaction on cards
10. Legend footer: "Shaded cards show the best walking window."
