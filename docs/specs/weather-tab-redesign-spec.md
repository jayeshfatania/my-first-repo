# Weather Tab Redesign Spec
**Tab:** Weather
**Status:** Design spec — awaiting implementation
**Design round:** Post-Round 12

---

## Design Intention

The Weather tab currently answers the question "what is the weather?" It needs to answer "should I walk my dog today?" Those are different questions with different visual priorities.

The redesign has one organising principle: **verdict first, data second.** The walk verdict — already calculated, already displayed somewhere — becomes the hero element, not a footnote. Everything else is supporting evidence for it.

The visual language stays entirely Sniffout: warm `#F7F5F0` background, white surface cards, forest green as the dominant accent, Inter typography. No dark backgrounds, no glassmorphism, no weather-app pastels. This is a dog walking app that has weather intelligence — not a weather app that mentions dogs.

---

## Layout Overview

```
┌──────────────────────────────────────────────┐
│  HERO                                        │
│  Location · Date                             │
│                                              │
│  14°C        [yr-icon 72px]                  │
│  Partly cloudy                               │
│  Feels like 11°  ·  H 16°  L 8°             │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  ✓  Good time to walk                 │  │  ← verdict badge
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  WALK WINDOW          [full-width card]      │
│  Best window: 10am – 1pm                     │
│  [hourly blocks]                             │
└──────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  Rain chance     │  │  Wind            │
│  12%             │  │  14 mph SW       │
│  Low             │  │  Light breeze    │
└──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  UV index        │  │  Humidity        │
│  4               │  │  72%             │
│  Moderate        │  │  Comfortable     │
└──────────────────┘  └──────────────────┘

┌──────────────────────────────────────────────┐
│  5-DAY FORECAST       [full-width card]      │
│  Mon  Tue  Wed  Thu  Fri                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  POLLEN               [full-width card]      │
└──────────────────────────────────────────────┘
```

The page has two visual zones:
1. **Hero** — no card treatment, sits directly on the `--bg` background, breathes with whitespace
2. **Cards zone** — white surface cards in a mixed-width layout, scrollable below the hero

---

## 1. Hero Section

The hero sits directly on the page background. No card, no border, no shadow. The temperature and icon are the first things the eye lands on.

### Layout

```
24px padding-top from tab bar

[location name]          [day, date]

   14°C       [icon]
   Partly cloudy
   Feels like 11° · H 16° L 8°

[verdict badge — full width]

24px padding-bottom before first card
```

### Location bar

- Location name: Inter 500, 15px, `var(--ink-2)`
- Day + date: Inter 400, 15px, `var(--ink-2)`, right-aligned
- Both on the same line
- Rendered from existing location state — no change to logic

### Temperature + icon row

- Temperature: Inter 700, **80px**, `var(--ink)` — this is the dominant visual element on the screen
- Unit (°C): Inter 400, **32px**, `var(--ink-2)` — superscript position, top-right of the temperature, visually half the weight
- Yr.no icon: **72×72px**, positioned to the right of the temperature block
- The temperature and icon are flex siblings, spaced with `justify-content: space-between`
- Vertical alignment: icon should be centred to the cap height of the temperature number, not the full line box. Use `align-items: flex-start` on the row and add `margin-top: 8px` to the icon — this visually anchors the icon to the top of the number.

### Condition + sub row

- Condition string: Inter 500, **17px**, `var(--ink)` — "Partly cloudy", "Rain showers", etc.
- Sub row: Inter 400, **13px**, `var(--ink-2)` — "Feels like 11° · H 16° L 8°"
- Dot separator: `·` unicode, not a dash
- `margin-top: 4px` between condition and sub row
- `margin-top: 16px` between the temp/icon row and condition

### Verdict badge

This is the most important element on the tab. It must be impossible to miss.

- Full width of the content area (16px horizontal margins, same as cards below)
- Height: **48px**
- Border-radius: **12px**
- Background: contextual (see states below)
- Text: Inter 600, **15px**, white
- Icon: 16px SVG, left of text, `8px` gap
- `margin-top: 20px` from the sub row
- Transition: `background-color 300ms ease` (smooth on weather refresh)

**Badge states:**

| Verdict type | Background | Icon |
|---|---|---|
| Approved — ideal | `var(--brand)` #1E4D3A | Checkmark circle |
| Approved — minor caveat | `#2D7A5A` (lighter green) | Checkmark circle |
| Caution | `var(--amber)` #F59E0B | Warning triangle |
| Avoid | `var(--red)` #EF4444 | X circle |

The green shades signal good news. Amber/red signal that the walk verdict function has detected a hazard. The badge text is the existing `getWalkVerdict()` output — no new copy needed.

In dark mode (`body.night`), the approved green badge is the single brightest, most saturated colour on the screen. This is intentional — it is still good news.

---

## 2. Walk Window Card

Full-width card, first below the hero. This is the "featured" card — the one most directly useful for planning.

```
┌──────────────────────────────────────────────┐
│  Walk window                  10am – 1pm     │
│  ─────────────────────────────────────────   │
│                                              │
│  [6am][7am][8am][9am][10am][11am][12pm]...  │
│   ░░░  ░░░  ░░░  ░░░   ██   ██    ██        │
│                                              │
│  Best 3-hour window based on rain,           │
│  wind and temperature conditions.            │
└──────────────────────────────────────────────┘
```

### Anatomy

- Card header row: "Walk window" left, best window time right
  - "Walk window": Inter 600, 15px, `var(--ink)`
  - Best window time: Inter 700, 15px, `var(--brand)` — this is the answer, it should be in green
- Divider: `1px solid var(--border)`, `margin: 12px 0`
- Hourly blocks: existing blocks, retained as-is from current implementation
- Footer text: Inter 400, 13px, `var(--ink-2)` — description of what the colouring means
- Padding: 16px all sides
- Card style: `var(--surface)`, `border-radius: 16px`, `1px solid var(--border)`

### Changes from current

The existing hourly walk window section already has the blocks. The only changes are:
1. Wrapping it in a card container
2. Moving the best-window time string to the header row (right-aligned, green)
3. Adding the short footer description line

---

## 3. Metric Tiles Grid

A 2×2 grid of square-ish tiles: Rain chance, Wind, UV index, Humidity.

Grid: `display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`

All four tiles are tappable (see section 5). Each tile has a subtle chevron `›` in the top-right corner to signal this.

### Individual tile anatomy

```
┌─────────────────────────────┐
│  [icon]  Rain chance    ›   │   ← label row: icon + name + chevron
│                             │
│  12%                        │   ← big value
│  Low chance today           │   ← contextual label
│                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │   ← optional mini detail (see below)
└─────────────────────────────┘
```

**Label row:**
- Icon: 16px inline SVG, `var(--ink-2)`
- Label: Inter 500, 12px, `var(--ink-2)`, `8px` left of text
- Chevron: `›` or SVG chevron-right, 12px, `var(--ink-2)`, margin-left: auto

**Value:**
- Inter 700, 32px, `var(--ink)`
- `margin-top: 10px`

**Contextual label:**
- Inter 500, 13px — colour depends on tile state (see per-tile spec below)
- `margin-top: 2px`

**Tile container:**
- Background: `var(--surface)`
- Border: `1px solid var(--border)`
- Border-radius: `16px`
- Padding: `14px`
- Min-height: `130px`
- Tap state: `active:opacity 0.85` — simple opacity dip on press, no heavy highlight

---

### Rain chance tile

- Icon: rain-drop SVG
- Value: `{max precipitation_probability for rest of today}%` — show the peak, not current
- Label: contextual string based on value:
  - 0–20%: "Low chance today" — `var(--brand)` colour
  - 21–50%: "Possible later" — `var(--amber)` colour
  - 51–80%: "Likely this afternoon" — `var(--amber)` colour
  - 81–100%: "Rain expected" — `var(--red)` colour
- Mini detail (bottom of tile): current precipitation amount if >0: "0.4mm expected" in 11px `var(--ink-2)`. Hide if 0mm expected.

### Wind tile

- Icon: wind/wave SVG
- Value: `{current wind speed} mph` — the number is large, "mph" in Inter 400 16px inline
- Label: Beaufort descriptor based on speed:
  - 0–7: "Calm / Light air" — `var(--brand)`
  - 8–18: "Light breeze" — `var(--brand)`
  - 19–28: "Gentle breeze" — `var(--ink-2)`
  - 29–38: "Moderate breeze" — `var(--amber)`
  - 39–49: "Fresh breeze" — `var(--amber)` — note this in dog context: may affect small dogs
  - 50+: "Strong / Gale" — `var(--red)`
- Mini detail: wind direction compass abbreviation — "SW" — in 11px `var(--ink-2)`, below the label

### UV index tile

- Icon: sun SVG
- Value: current UV index (0–11+)
- Label: WHO classification:
  - 0–2: "Low" — `var(--brand)`
  - 3–5: "Moderate" — `var(--ink-2)`
  - 6–7: "High" — `var(--amber)`
  - 8–10: "Very high" — `var(--red)`
  - 11+: "Extreme" — `var(--red)`
- Mini detail: "Peak at 1pm: UV 7" if today's peak is higher than current value. Otherwise hidden.
- **API note:** `uv_index` is listed as a Phase 3 Open-Meteo addition. If not yet in the hourly fetch, add `hourly=uv_index` to the existing Open-Meteo URL parameter string. No new endpoint needed.

### Humidity tile

- Icon: droplet SVG (distinct from rain — use a single filled droplet, vs rain's angled drop lines)
- Value: `{current relative humidity}%`
- Label: comfort descriptor:
  - 0–30%: "Very dry" — `var(--amber)` (low humidity = dry air, not ideal for long walks)
  - 31–50%: "Comfortable" — `var(--brand)`
  - 51–65%: "Moderate" — `var(--ink-2)`
  - 66–80%: "Humid" — `var(--amber)`
  - 81–100%: "Very humid" — `var(--red)`
- Mini detail: hidden (humidity doesn't have a useful secondary value)
- **API note:** `relative_humidity_2m` should already be in the current weather fetch for the dew point / comfort calculations. If not, add to the hourly parameter list.

---

## 4. 5-Day Forecast Card

Full-width card. No changes to the data — this is a presentational upgrade.

```
┌──────────────────────────────────────────────┐
│  5-day forecast                              │
│  ─────────────────────────────────────────   │
│                                              │
│  Today    Mon    Tue    Wed    Thu            │
│  [icon]  [icon] [icon] [icon] [icon]          │
│   16°     18°    14°    11°    13°            │
│    8°      9°    10°     7°     6°            │
└──────────────────────────────────────────────┘
```

### Anatomy

- Card header: "5-day forecast", Inter 600, 15px, `var(--ink)`
- Divider: `1px solid var(--border)`
- Five-column grid inside the card: `display: grid; grid-template-columns: repeat(5, 1fr);`
- "Today" column: day label in `var(--brand)` Inter 600 to distinguish it from forecast days
- Day label: Inter 500, 13px
- Icon: Yr.no icon, 32×32px
- High temp: Inter 600, 14px, `var(--ink)`
- Low temp: Inter 400, 14px, `var(--ink-2)`
- Each column: `text-align: center`, all elements stacked vertically with `8px` gaps

### Changes from current

The data and logic are unchanged. The change is:
1. Wrapping in the card container with header
2. Applying the 5-column grid layout
3. Distinguishing "Today" visually with brand-green label

---

## 5. Pollen Card

Full-width card. Same placement as current pollen section.

```
┌──────────────────────────────────────────────┐
│  Pollen                                      │
│  ─────────────────────────────────────────   │
│                                              │
│  Tree         Grass        Weed              │
│  ●●●○○        ●○○○○        ●●○○○             │
│  High         Low          Moderate          │
└──────────────────────────────────────────────┘
```

The dot indicators are 5 filled/unfilled circles per pollen type. This is more visual than the current text-only treatment.

- Filled dot: `var(--brand)`, 8px circle
- Unfilled dot: `var(--border)` / `rgba(0,0,0,0.15)`, 8px circle
- Spacing: `4px` between dots
- Label below dots: Inter 500, 12px, `var(--ink-2)`

This section is unchanged in terms of API data — it uses the existing Open-Meteo pollen fetch.

---

## 6. Tappable Tile Behaviour

All four metric tiles (Rain, Wind, UV, Humidity) are tappable. Tapping one opens a bottom sheet showing an hourly breakdown for today.

### Bottom sheet — general pattern

The bottom sheet follows the same pattern as the walk detail overlay. It slides up from the bottom of the screen.

**Structure:**
```
┌──────────────────────────────────────────────┐
│                  ——                          │  ← drag handle
│                                              │
│  Rain chance today                           │  ← sheet title
│                                              │
│  Now   12%  ░░░░░░░░░░░░░░░░░░░             │
│  2pm   8%   ░░░░░░░                         │
│  3pm   5%   ░░░░░                           │
│  4pm   22%  ░░░░░░░░░░░░░░░░░░░░░░░░        │
│  5pm   35%  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  6pm   40%  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                              │
│  Showing remaining hours for today.          │
│                                              │
└──────────────────────────────────────────────┘
```

**Sheet dimensions:**
- Max height: 60% of viewport
- Border-radius (top only): `20px 20px 0 0`
- Background: `var(--surface)`
- Padding: `16px`

**Handle:**
- `32×4px`, `border-radius: 2px`, `background: rgba(0,0,0,0.18)`, centred at top
- `margin-bottom: 20px`

**Sheet title:**
- Inter 700, 17px, `var(--ink)`

**Hourly row:**
- Time: Inter 500, 13px, `var(--ink-2)`, fixed width `36px`
- Value: Inter 700, 13px, `var(--ink)`, fixed width `36px`
- Bar: the remaining width, a thin horizontal bar (`8px` height, `border-radius: 4px`)
  - Filled portion: background colour varies by tile (brand green for low, amber for moderate, red for high)
  - Unfilled portion: `var(--border)` / `rgba(0,0,0,0.08)`
- Row height: `36px`, vertically centred

**Show hours:** current hour through midnight. Do not show past hours.

**Dismiss:** tap the scrim or drag the sheet down.

---

### Per-tile sheet content

**Rain chance sheet**
- Title: "Rain chance — today"
- Rows: one per remaining hour. Time | precipitation_probability (%) | bar (green → amber → red at 20% / 50%)
- Footer note: "Heavy rain is [X]mm/hr or more." if any hour exceeds 1mm

**Wind sheet**
- Title: "Wind — today"
- Rows: one per remaining hour. Time | wind_speed_10m (mph) | bar + direction arrow icon
- Bar colours: green (< 19mph), amber (19–38mph), red (39+mph)
- Direction: small cardinal direction text (N/NE/E etc) inline after the bar
- **API note:** `hourly.wind_direction_10m` — add to Open-Meteo hourly parameters if not already present. Maps to 16-point compass with a simple lookup function.

**UV index sheet**
- Title: "UV index — today"
- Rows: one per remaining hour. Time | uv_index value | badge (not a bar — a colour-coded pill)
- Badge labels match the tile: Low / Moderate / High / Very high / Extreme
- Footer note: "UV above 3 — sun protection for long outdoor sessions."
- **API note:** `hourly.uv_index` — Phase 3 addition, add to hourly parameter string.

**Humidity sheet**
- Title: "Humidity — today"
- Rows: one per remaining hour. Time | relative_humidity_2m (%) | contextual comfort label
- No bar needed — comfort label is more readable than a bar for humidity
- Footer note: "High humidity can make dogs overheat faster on long walks."

---

## 7. CSS Classes Reference

All new classes follow the `wx-` prefix convention to namespace weather tab styles.

### Hero

```css
.wx-hero               /* Hero section container, sits on --bg, no card */
.wx-hero-location      /* Location + date row */
.wx-hero-place         /* Location name text */
.wx-hero-date          /* Date text, right-aligned */
.wx-hero-main          /* Temperature + icon row */
.wx-hero-temp-block    /* Contains temperature number + unit */
.wx-hero-temp          /* 80px temperature number */
.wx-hero-unit          /* °C unit, 32px, superscript-offset */
.wx-hero-icon          /* Yr.no icon, 72×72 */
.wx-hero-condition     /* Condition string below temp/icon */
.wx-hero-sub           /* Feels-like · H · L row */
```

### Verdict badge

```css
.wx-verdict            /* Full-width 48px badge */
.wx-verdict--approved  /* Brand green background */
.wx-verdict--caution   /* Amber background */
.wx-verdict--avoid     /* Red background */
.wx-verdict-icon       /* 16px SVG icon */
.wx-verdict-text       /* Badge label text */
```

### Cards zone

```css
.wx-cards              /* Wrapper for all cards below hero, padding + gap */
.wx-card               /* Base card: surface, border, border-radius 16px */
.wx-card-header        /* Card label row */
.wx-card-title         /* Card title text, Inter 600 15px */
.wx-card-divider       /* 1px border divider below header */
```

### Metric tiles

```css
.wx-tiles              /* 2-column grid container */
.wx-tile               /* Individual metric tile card */
.wx-tile-label         /* Top row: icon + name + chevron */
.wx-tile-name          /* Metric name, 12px ink-2 */
.wx-tile-chevron       /* › chevron, right-aligned */
.wx-tile-value         /* Big value, 32px bold */
.wx-tile-desc          /* Contextual label below value */
.wx-tile-desc--good    /* Brand green */
.wx-tile-desc--caution /* Amber */
.wx-tile-desc--bad     /* Red */
.wx-tile-detail        /* Small optional detail line at bottom */
```

### Walk window card

```css
.wx-walk-window        /* Card container */
.wx-walk-window-time   /* Best window time, right-aligned, brand green */
.wx-walk-blocks        /* Hourly blocks container */
.wx-walk-footer        /* Footer description text */
```

### Forecast card

```css
.wx-forecast           /* Card container */
.wx-forecast-grid      /* 5-column grid */
.wx-forecast-col       /* Single day column */
.wx-forecast-day       /* Day label */
.wx-forecast-day--today /* Today label, brand green */
.wx-forecast-icon      /* 32×32 Yr.no icon */
.wx-forecast-high      /* High temp */
.wx-forecast-low       /* Low temp, ink-2 */
```

### Pollen card

```css
.wx-pollen             /* Card container */
.wx-pollen-grid        /* 3-column grid for tree/grass/weed */
.wx-pollen-type        /* Single pollen type column */
.wx-pollen-dots        /* Dot row */
.wx-pollen-dot         /* Single dot, 8px circle */
.wx-pollen-dot--filled /* Filled dot, brand green */
.wx-pollen-label       /* Pollen type name */
.wx-pollen-level       /* Level string */
```

### Metric detail sheet

```css
.wx-sheet-overlay      /* Full-screen scrim, rgba(0,0,0,0.4) */
.wx-sheet              /* Bottom sheet container */
.wx-sheet-handle       /* Drag handle bar */
.wx-sheet-title        /* Sheet title */
.wx-sheet-rows         /* Scrollable rows container */
.wx-sheet-row          /* Single hour row */
.wx-sheet-time         /* Time label */
.wx-sheet-val          /* Value */
.wx-sheet-bar-track    /* Bar background track */
.wx-sheet-bar-fill     /* Bar fill, width set via inline style */
.wx-sheet-badge        /* Pill badge for UV sheet */
.wx-sheet-note         /* Footer note text */
```

---

## 8. HTML Structure Skeleton

```html
<!-- WEATHER TAB -->
<div id="tab-weather" class="tab-content">

  <!-- Hero -->
  <section class="wx-hero">
    <div class="wx-hero-location">
      <span class="wx-hero-place"><!-- location name --></span>
      <span class="wx-hero-date"><!-- day, date --></span>
    </div>
    <div class="wx-hero-main">
      <div class="wx-hero-temp-block">
        <span class="wx-hero-temp"><!-- temp --></span>
        <span class="wx-hero-unit">°C</span>
      </div>
      <img class="wx-hero-icon" src="" alt="" width="72" height="72">
    </div>
    <div class="wx-hero-condition"><!-- condition string --></div>
    <div class="wx-hero-sub">
      Feels like <span class="wx-feels">--°</span>
      &nbsp;·&nbsp;
      H <span class="wx-high">--°</span>
      &nbsp; L <span class="wx-low">--°</span>
    </div>
    <div class="wx-verdict wx-verdict--approved">
      <!-- SVG checkmark icon -->
      <span class="wx-verdict-text"><!-- verdict string --></span>
    </div>
  </section>

  <!-- Cards zone -->
  <div class="wx-cards">

    <!-- Walk window -->
    <div class="wx-card wx-walk-window">
      <div class="wx-card-header">
        <span class="wx-card-title">Walk window</span>
        <span class="wx-walk-window-time"><!-- e.g. 10am – 1pm --></span>
      </div>
      <div class="wx-card-divider"></div>
      <div class="wx-walk-blocks">
        <!-- existing hourly block elements -->
      </div>
      <div class="wx-walk-footer">Best window based on rain, wind and temperature.</div>
    </div>

    <!-- Metric tiles 2×2 grid -->
    <div class="wx-tiles">

      <!-- Rain chance tile -->
      <div class="wx-tile" data-sheet="rain" role="button" tabindex="0" aria-label="Rain chance detail">
        <div class="wx-tile-label">
          <!-- rain SVG icon -->
          <span class="wx-tile-name">Rain chance</span>
          <span class="wx-tile-chevron" aria-hidden="true">›</span>
        </div>
        <div class="wx-tile-value"><!-- 12% --></div>
        <div class="wx-tile-desc wx-tile-desc--good">Low chance today</div>
        <div class="wx-tile-detail"><!-- optional: 0.4mm expected --></div>
      </div>

      <!-- Wind tile -->
      <div class="wx-tile" data-sheet="wind" role="button" tabindex="0" aria-label="Wind detail">
        <div class="wx-tile-label">
          <!-- wind SVG icon -->
          <span class="wx-tile-name">Wind</span>
          <span class="wx-tile-chevron" aria-hidden="true">›</span>
        </div>
        <div class="wx-tile-value"><!-- 14 <small>mph</small> --></div>
        <div class="wx-tile-desc wx-tile-desc--good">Light breeze</div>
        <div class="wx-tile-detail"><!-- SW --></div>
      </div>

      <!-- UV tile -->
      <div class="wx-tile" data-sheet="uv" role="button" tabindex="0" aria-label="UV index detail">
        <div class="wx-tile-label">
          <!-- sun SVG icon -->
          <span class="wx-tile-name">UV index</span>
          <span class="wx-tile-chevron" aria-hidden="true">›</span>
        </div>
        <div class="wx-tile-value"><!-- 4 --></div>
        <div class="wx-tile-desc">Moderate</div>
        <div class="wx-tile-detail"><!-- Peak at 1pm: UV 7 --></div>
      </div>

      <!-- Humidity tile -->
      <div class="wx-tile" data-sheet="humidity" role="button" tabindex="0" aria-label="Humidity detail">
        <div class="wx-tile-label">
          <!-- droplet SVG icon -->
          <span class="wx-tile-name">Humidity</span>
          <span class="wx-tile-chevron" aria-hidden="true">›</span>
        </div>
        <div class="wx-tile-value"><!-- 72% --></div>
        <div class="wx-tile-desc wx-tile-desc--good">Comfortable</div>
      </div>

    </div><!-- /.wx-tiles -->

    <!-- 5-day forecast -->
    <div class="wx-card wx-forecast">
      <div class="wx-card-header">
        <span class="wx-card-title">5-day forecast</span>
      </div>
      <div class="wx-card-divider"></div>
      <div class="wx-forecast-grid">
        <!-- 5× .wx-forecast-col -->
        <div class="wx-forecast-col">
          <span class="wx-forecast-day wx-forecast-day--today">Today</span>
          <img class="wx-forecast-icon" src="" alt="" width="32" height="32">
          <span class="wx-forecast-high">16°</span>
          <span class="wx-forecast-low">8°</span>
        </div>
        <!-- repeat for Mon–Thu -->
      </div>
    </div>

    <!-- Pollen -->
    <div class="wx-card wx-pollen">
      <div class="wx-card-header">
        <span class="wx-card-title">Pollen</span>
      </div>
      <div class="wx-card-divider"></div>
      <div class="wx-pollen-grid">
        <div class="wx-pollen-type">
          <span class="wx-pollen-label">Tree</span>
          <div class="wx-pollen-dots"><!-- 5 dots --></div>
          <span class="wx-pollen-level">High</span>
        </div>
        <div class="wx-pollen-type">
          <span class="wx-pollen-label">Grass</span>
          <div class="wx-pollen-dots"><!-- 5 dots --></div>
          <span class="wx-pollen-level">Low</span>
        </div>
        <div class="wx-pollen-type">
          <span class="wx-pollen-label">Weed</span>
          <div class="wx-pollen-dots"><!-- 5 dots --></div>
          <span class="wx-pollen-level">Moderate</span>
        </div>
      </div>
    </div>

  </div><!-- /.wx-cards -->

</div><!-- /#tab-weather -->

<!-- Metric detail bottom sheet (outside tab, in body root) -->
<div class="wx-sheet-overlay" id="wxSheetOverlay" hidden></div>
<div class="wx-sheet" id="wxSheet" hidden>
  <div class="wx-sheet-handle"></div>
  <div class="wx-sheet-title" id="wxSheetTitle"></div>
  <div class="wx-sheet-rows" id="wxSheetRows"></div>
  <div class="wx-sheet-note" id="wxSheetNote"></div>
</div>
```

---

## 9. Core CSS

```css
/* ── Hero ─────────────────────────────────────────── */

.wx-hero {
  padding: 20px 16px 24px;
}

.wx-hero-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font: 500 15px/1 'Inter', sans-serif;
  color: var(--ink-2);
}

.wx-hero-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.wx-hero-temp-block {
  display: flex;
  align-items: flex-start;
  gap: 2px;
}

.wx-hero-temp {
  font: 700 80px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -3px;
}

.wx-hero-unit {
  font: 400 32px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 8px;
}

.wx-hero-icon {
  width: 72px;
  height: 72px;
  margin-top: 8px; /* aligns icon cap-height to top of temp number */
  flex-shrink: 0;
}

.wx-hero-condition {
  margin-top: 16px;
  font: 500 17px/1.2 'Inter', sans-serif;
  color: var(--ink);
}

.wx-hero-sub {
  margin-top: 4px;
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
}

/* ── Verdict badge ────────────────────────────────── */

.wx-verdict {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  height: 48px;
  border-radius: 12px;
  font: 600 15px/1 'Inter', sans-serif;
  color: #fff;
  transition: background-color 300ms ease;
}

.wx-verdict svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.wx-verdict--approved  { background: var(--brand); }
.wx-verdict--caution   { background: var(--amber); }
.wx-verdict--avoid     { background: var(--red); }

/* ── Cards zone ───────────────────────────────────── */

.wx-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 32px;
}

.wx-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}

.wx-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wx-card-title {
  font: 600 15px/1 'Inter', sans-serif;
  color: var(--ink);
}

.wx-card-divider {
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}

/* ── Metric tiles ─────────────────────────────────── */

.wx-tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.wx-tile {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 100ms ease;
}

.wx-tile:active { opacity: 0.82; }

.wx-tile-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wx-tile-label svg {
  width: 15px;
  height: 15px;
  color: var(--ink-2);
  flex-shrink: 0;
}

.wx-tile-name {
  font: 500 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
  flex: 1;
}

.wx-tile-chevron {
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1;
}

.wx-tile-value {
  font: 700 32px/1 'Inter', sans-serif;
  color: var(--ink);
  margin-top: 10px;
  letter-spacing: -1px;
}

.wx-tile-value small {
  font: 400 16px/1 'Inter', sans-serif;
  color: var(--ink-2);
  letter-spacing: 0;
}

.wx-tile-desc {
  font: 500 13px/1.2 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: 3px;
}

.wx-tile-desc--good    { color: var(--brand); }
.wx-tile-desc--caution { color: var(--amber); }
.wx-tile-desc--bad     { color: var(--red); }

.wx-tile-detail {
  font: 400 11px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: auto;
  padding-top: 8px;
}

/* ── Walk window card ─────────────────────────────── */

.wx-walk-window-time {
  font: 700 15px/1 'Inter', sans-serif;
  color: var(--brand);
}

.wx-walk-footer {
  margin-top: 12px;
  font: 400 12px/1.4 'Inter', sans-serif;
  color: var(--ink-2);
}

/* ── Forecast card ────────────────────────────────── */

.wx-forecast-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.wx-forecast-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.wx-forecast-day {
  font: 500 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}

.wx-forecast-day--today {
  font-weight: 600;
  color: var(--brand);
}

.wx-forecast-icon {
  width: 32px;
  height: 32px;
}

.wx-forecast-high {
  font: 600 14px/1 'Inter', sans-serif;
  color: var(--ink);
}

.wx-forecast-low {
  font: 400 14px/1 'Inter', sans-serif;
  color: var(--ink-2);
}

/* ── Pollen card ──────────────────────────────────── */

.wx-pollen-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.wx-pollen-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.wx-pollen-label {
  font: 500 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
}

.wx-pollen-dots {
  display: flex;
  gap: 4px;
}

.wx-pollen-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
}

.wx-pollen-dot--filled {
  background: var(--brand);
}

.wx-pollen-level {
  font: 500 12px/1 'Inter', sans-serif;
  color: var(--ink);
}

/* ── Metric detail sheet ──────────────────────────── */

.wx-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.wx-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 60vh;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 12px 16px 32px;
  z-index: 201;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.wx-sheet.is-open {
  transform: translateY(0);
}

.wx-sheet-overlay[hidden],
.wx-sheet[hidden] {
  display: none;
}

.wx-sheet-handle {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.18);
  margin: 0 auto 20px;
}

.wx-sheet-title {
  font: 700 17px/1 'Inter', sans-serif;
  color: var(--ink);
  margin-bottom: 16px;
}

.wx-sheet-row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
}

.wx-sheet-time {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  width: 36px;
  flex-shrink: 0;
}

.wx-sheet-val {
  font: 700 13px/1 'Inter', sans-serif;
  color: var(--ink);
  width: 36px;
  flex-shrink: 0;
  text-align: right;
}

.wx-sheet-bar-track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.wx-sheet-bar-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--brand);
  transition: width 400ms ease;
}

.wx-sheet-bar-fill--caution { background: var(--amber); }
.wx-sheet-bar-fill--bad     { background: var(--red); }

.wx-sheet-badge {
  padding: 2px 8px;
  border-radius: 6px;
  font: 500 12px/1.4 'Inter', sans-serif;
}

.wx-sheet-badge--low      { background: rgba(30,77,58,0.12); color: var(--brand); }
.wx-sheet-badge--moderate { background: rgba(245,158,11,0.12); color: #B45309; }
.wx-sheet-badge--high     { background: rgba(239,68,68,0.12); color: var(--red); }

.wx-sheet-note {
  margin-top: 16px;
  font: 400 13px/1.4 'Inter', sans-serif;
  color: var(--ink-2);
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

/* ── Dark mode overrides ──────────────────────────── */

body.night .wx-hero-temp   { color: #fff; }
body.night .wx-hero-condition { color: rgba(255,255,255,0.9); }
body.night .wx-sheet-handle { background: rgba(255,255,255,0.25); }
body.night .wx-sheet-bar-track { background: rgba(255,255,255,0.1); }
body.night .wx-pollen-dot   { background: rgba(255,255,255,0.15); }
/* Tokens (--ink, --ink-2, --surface, --border) handle dark mode
   automatically via the existing body.night token overrides —
   no additional overrides needed beyond the above. */
```

---

## 10. JS — Tile Sheet Logic

```js
// Open sheet for a given metric type
function openWxSheet(type) {
  const overlay = document.getElementById('wxSheetOverlay');
  const sheet   = document.getElementById('wxSheet');
  const title   = document.getElementById('wxSheetTitle');
  const rows    = document.getElementById('wxSheetRows');
  const note    = document.getElementById('wxSheetNote');

  const hourlyData = getHourlyFromNow(); // returns array of {hour, label, ...} from current hour onward
  rows.innerHTML = '';
  note.textContent = '';

  const configs = {
    rain: {
      title: 'Rain chance — today',
      getValue: h => `${h.precipProb}%`,
      getWidth: h => h.precipProb,
      getModifier: h => h.precipProb > 50 ? '--bad' : h.precipProb > 20 ? '--caution' : '',
      note: null
    },
    wind: {
      title: 'Wind — today',
      getValue: h => `${h.windSpeed}`,
      getWidth: h => Math.min(h.windSpeed * 1.5, 100), // scale to visual width
      getModifier: h => h.windSpeed > 38 ? '--bad' : h.windSpeed > 19 ? '--caution' : '',
      note: null
    },
    uv: {
      title: 'UV index — today',
      getValue: h => `${h.uvIndex}`,
      useBadge: true,
      getBadgeClass: h => h.uvIndex >= 6 ? '--high' : h.uvIndex >= 3 ? '--moderate' : '--low',
      getBadgeLabel: h => h.uvIndex >= 8 ? 'Very high' : h.uvIndex >= 6 ? 'High' : h.uvIndex >= 3 ? 'Moderate' : 'Low',
      note: 'UV above 3 — consider sun protection for long outdoor sessions.'
    },
    humidity: {
      title: 'Humidity — today',
      getValue: h => `${h.humidity}%`,
      useLabel: true,
      getLabel: h => h.humidity > 80 ? 'Very humid' : h.humidity > 65 ? 'Humid' : h.humidity > 50 ? 'Moderate' : h.humidity > 30 ? 'Comfortable' : 'Very dry',
      note: 'High humidity can make dogs overheat faster on longer walks.'
    }
  };

  const config = configs[type];
  if (!config) return;

  title.textContent = config.title;

  hourlyData.forEach(h => {
    const row = document.createElement('div');
    row.className = 'wx-sheet-row';

    const timeEl = document.createElement('span');
    timeEl.className = 'wx-sheet-time';
    timeEl.textContent = h.label; // e.g. "2pm"

    const valEl = document.createElement('span');
    valEl.className = 'wx-sheet-val';
    valEl.textContent = config.getValue(h);

    row.appendChild(timeEl);
    row.appendChild(valEl);

    if (config.useBadge) {
      const badge = document.createElement('span');
      badge.className = `wx-sheet-badge wx-sheet-badge${config.getBadgeClass(h)}`;
      badge.textContent = config.getBadgeLabel(h);
      row.appendChild(badge);
    } else if (config.useLabel) {
      const lbl = document.createElement('span');
      lbl.className = 'wx-sheet-val';
      lbl.style.width = 'auto';
      lbl.style.flex = '1';
      lbl.style.textAlign = 'left';
      lbl.style.fontWeight = '400';
      lbl.style.color = 'var(--ink-2)';
      lbl.textContent = config.getLabel(h);
      row.appendChild(lbl);
    } else {
      const track = document.createElement('div');
      track.className = 'wx-sheet-bar-track';
      const fill = document.createElement('div');
      fill.className = `wx-sheet-bar-fill${config.getModifier(h)}`;
      fill.style.width = `${config.getWidth(h)}%`;
      track.appendChild(fill);
      row.appendChild(track);
    }

    rows.appendChild(row);
  });

  if (config.note) note.textContent = config.note;

  overlay.hidden = false;
  sheet.hidden = false;
  requestAnimationFrame(() => sheet.classList.add('is-open'));
}

function closeWxSheet() {
  const sheet = document.getElementById('wxSheet');
  const overlay = document.getElementById('wxSheetOverlay');
  sheet.classList.remove('is-open');
  sheet.addEventListener('transitionend', () => {
    sheet.hidden = true;
    overlay.hidden = true;
  }, { once: true });
}

// Wire up tiles
document.querySelectorAll('.wx-tile[data-sheet]').forEach(tile => {
  tile.addEventListener('click', () => openWxSheet(tile.dataset.sheet));
});
document.getElementById('wxSheetOverlay').addEventListener('click', closeWxSheet);
```

---

## 11. API Data — New vs Existing

### Already fetched (no changes needed)
- `current.temperature_2m`
- `current.apparent_temperature`
- `current.weather_code`
- `current.wind_speed_10m`
- `current.relative_humidity_2m`
- `daily.temperature_2m_max` / `daily.temperature_2m_min`
- `daily.weather_code`
- `daily.precipitation_probability_max`
- `hourly.precipitation_probability`
- `hourly.precipitation`
- `hourly.temperature_2m`
- `hourly.weather_code`
- `hourly.wind_speed_10m`

### Need to add to Open-Meteo hourly parameter string

| Parameter | Used for | Priority |
|---|---|---|
| `hourly=uv_index` | UV tile value, UV sheet hourly breakdown | High — Phase 3 addition, needed for UV tile |
| `hourly=wind_direction_10m` | Wind tile direction label (SW, NE etc), wind sheet | Medium — enhances wind tile |
| `hourly=relative_humidity_2m` | Humidity tile, humidity sheet hourly breakdown | Check — may already be fetched |

**Implementation:** These all go into the existing Open-Meteo hourly fetch URL as additional comma-separated values. No new endpoint, no new API key.

Example addition to fetch URL:
```
&hourly=temperature_2m,precipitation_probability,...,uv_index,wind_direction_10m,relative_humidity_2m
```

Parse `hourly.uv_index` and `hourly.wind_direction_10m` alongside existing hourly parsing in `fetchWeather()`. Add them to the weather data object that gets stored in session and passed to `renderWeather()`.

---

## 12. What Is Not Changing

- `getWalkVerdict()` — logic unchanged, output text unchanged, just visually elevated
- `fetchWeather()` — parameter additions only (see above), no structural change
- Yr.no icon references — unchanged
- The hourly walk window blocks — visual container changes, block logic unchanged
- `body.night` dark mode trigger — unchanged
- Session storage / 8-hour cache — unchanged
- 5-day forecast data — unchanged, presentation only

---

## 13. Implementation Notes

**Verdict badge state:** The developer should apply `wx-verdict--approved`, `wx-verdict--caution`, or `wx-verdict--avoid` class dynamically based on the verdict type returned by `getWalkVerdict()`. Suggest a small helper that maps verdict strings to severity classes.

**Temperature letter-spacing:** At 80px, the default Inter letter-spacing looks loose. `-3px` is recommended in the CSS above — the developer should test this on device and adjust to `−2px` if it feels too tight on smaller phones (iPhone SE = 375px viewport).

**Walk window time string:** The "best window" time is currently rendered as text inside the walk window section. Move that string to the right side of the card header, formatted as "10am – 1pm", in `var(--brand)` green. No logic change — just rendering location.

**Sheet z-index:** The overlay and sheet use `z-index: 200` and `201`. These must sit above the tab bar (check existing tab bar z-index and adjust if needed).

**Pollen dots:** The developer should write a small helper — `pollenDots(level)` — that maps a pollen level string ("Low", "Moderate", "High", "Very High") to a number of filled dots (1, 2, 3, 4 respectively) out of 5. This is a pure presentational function with no logic dependency.

**Sheet animation on first render:** Use the same `requestAnimationFrame` trick as the segment control — set `hidden = false` before adding `is-open` so the transition fires correctly.
