# Temperature Tap Spec
**Feature:** Tappable temperature hero → hourly temperature breakdown
**Tab:** Weather
**Status:** Design spec — ready for Developer implementation
**Design round:** Post-Round 12

---

## Design intention

The temperature number in the hero is the most prominent piece of information on the Weather tab. Making it tappable gives users a direct path to planning a walk later in the day — without forcing them to read a generic hourly forecast. The sheet is not a weather report; it is a walk-planning tool. The walk quality context (already calculated in the existing hourly walk window logic) travels into the sheet alongside the temperature numbers so the user never loses sight of the question Sniffout is answering: *when should I take my dog out?*

The pattern follows the existing tappable metric tile sheets (Rain, Wind, UV, Humidity) defined in the Weather Tab Redesign Spec. No new interaction model is introduced.

---

## 1. Interaction pattern — bottom sheet

**Decision: bottom sheet. Not inline expand.**

Reasoning: all four metric tiles on the Weather tab already open bottom sheets for hourly detail. Adding a fifth bottom sheet for temperature is consistent. An inline expand below the hero would push the verdict badge, walk window card, and metric grid downward — a disruptive layout shift on a screen where the verdict badge is the most important element. The bottom sheet leaves the hero intact and provides more vertical space for 12–18 rows of hourly data.

The sheet follows the exact same implementation pattern as the metric tile sheets:
- Slides up from bottom: `transform: translateY(100%)` → `translateY(0)`
- Duration: `320ms cubic-bezier(0.32, 0.72, 0, 1)`
- Toggled by `is-open` class
- Scrim overlay behind the sheet
- `addSheetSwipe()` applied for swipe-down dismiss

---

## 2. Tap affordance on the temperature number

The temperature number (`wx-hero-temp-block` — the number and °C unit together) becomes the tap target. The entire block is tappable; no need to tap precisely on the numerals.

**Visual affordance:** a small downward-pointing chevron (chevron-down SVG, `12×12px`, `var(--ink-2)` at 55% opacity) positioned centered directly below the temperature block, with `margin-top: 6px`. This anchors the affordance to the tappable element without intruding on the hero composition.

```
   14°C    [icon]
   ↓                    ← 12px chevron-down, ink-2 at 55% opacity
   Partly cloudy
   Feels like 11° · H 16° L 8°
```

The chevron is rendered as an inline SVG inside `.wx-hero-temp-block`, not a separate element floating in the hero. It sits between the temperature row and the condition string.

**Tap state:** on `:active`, the temperature block dims to `opacity: 0.78`. No background fill, no border — the hero must remain clean.

**The entire `.wx-hero-temp-block` is the tap target, not just the number.** The combined height of the block (temperature number ~80px + unit ~32px) gives a tap target well above the 44px minimum. No separate hit-area expansion needed.

---

## 3. Sheet anatomy

```
┌──────────────────────────────────────────────┐
│                    ——                        │  ← drag handle
│                                              │
│  Temperature today         H 16°  L 8°       │  ← title + today's H/L
│  ─────────────────────────────────────────   │
│                                              │
│  [scrollable hourly rows — see section 4]   │
│                                              │
│  Feels like shown when it differs by 2°+    │  ← footer note
│                                              │
└──────────────────────────────────────────────┘
```

**Sheet dimensions:**
- Max height: `65%` of viewport — slightly taller than the metric tile sheets (60%) to accommodate more rows without requiring scroll from the first open
- Border-radius top: `20px 20px 0 0`
- Background: `var(--surface)`
- Padding: `16px`
- The row area is independently scrollable (`overflow-y: auto`, `-webkit-overflow-scrolling: touch`)

**Drag handle:**
- `32×4px`, `border-radius: 2px`, `background: rgba(0,0,0,0.18)`, centered at top
- `margin-bottom: 16px`

**Sheet title row:**
- Left: "Temperature today" — Inter 700, 17px, `var(--ink)`
- Right: "H 16°  L 8°" — Inter 500, 14px, `var(--ink-2)` — today's high and low from the hourly data
- Both on the same baseline
- `margin-bottom: 12px`

**Divider:**
- `1px solid var(--border)`, `margin-bottom: 12px`

**Footer note:**
- Inter 400, 12px, `var(--ink-2)`
- Text: "Feels like shown where it differs from actual by 2° or more."
- `margin-top: 12px`
- Only shown if at least one row displays a feels-like value; hidden otherwise

---

## 4. Hourly row format

Show hours from the current hour through midnight. Do not show past hours. This matches the rule used by the metric tile sheets.

### Row structure

```
[time]  [temp]  [feels-like?]  [walk dot]
```

| Column | Detail |
|---|---|
| **Time** | Inter 500, 13px, `var(--ink-2)`. "Now" for the current hour; "2pm", "3pm" etc for future hours. Fixed width `40px`. |
| **Actual temp** | Inter 700, 15px, `var(--ink)`. The number with no unit (°C is implied from context). Fixed width `32px`. |
| **Feels-like** | Inter 400, 13px, `var(--ink-2)`. Shown only when `apparent_temperature` differs from `temperature_2m` by ≥ 2°C. Format: "FL 8°". Hidden (not an empty space) when not shown. |
| **Walk quality dot** | 8px filled circle, right-aligned. Colour from the existing hourly walk quality calculation (same logic as `.hour-seg`). See section 5. |

**Row height:** `40px`, all columns vertically centred.

**Row layout:** `display: flex; align-items: center; gap: 10px;`

No horizontal bars. Temperature changes direction (up and down throughout the day) so a one-directional bar would be misleading. The numbers themselves are the primary communication; the walk quality dot provides the interpretive layer.

### Temperature number colour encoding

The actual temperature value uses a colour that signals its comfort range for walking. This replaces the need for a bar or chart:

| Temperature | Colour | Meaning |
|---|---|---|
| Below 2°C | `#6B9FD4` (cool blue) | Cold — paw safety risk |
| 2–7°C | `var(--ink-2)` | Chilly — manageable |
| 8–22°C | `var(--ink)` | Comfortable — ideal range |
| 23–27°C | `var(--amber)` | Warm — monitor dog closely |
| 28°C+ | `var(--red)` | Hot — overheating risk |

These thresholds are consistent with the existing heat hazard detection logic in `renderWeather()`. No new thresholds are introduced.

---

## 5. Walk quality dot

The dot in each row communicates whether that hour is good for a dog walk. It reuses the existing hourly quality calculation — the same values that drive the `.hour-seg` colour in the Walk Window card. This ensures the two surfaces never contradict each other.

| Dot colour | Meaning |
|---|---|
| `var(--brand)` (#3B5C2A) filled | Good walking hour — in the walk window |
| `var(--amber)` (#F59E0B) filled | Marginal — walk window caution |
| `rgba(0,0,0,0.12)` outline only | Poor or outside daylight walking hours |

The dot is the rightmost element in the row, `margin-left: auto` to push it flush right. This creates a clear visual scan column on the right edge — the user can run their eye down the dots to find the green cluster without reading every temperature number.

The combination of green dots and mid-range temperature colour (black ink, 8–22°C) creates a double confirmation: *this hour is warm enough and walkable.* An amber dot against a red temperature number means the hour is technically within the walk window but too hot.

---

## 6. Layout wireframe

```
┌──────────────────────────────────────────────┐
│                    ——                        │
│                                              │
│  Temperature today         H 16°  L 8°       │
│  ─────────────────────────────────────────   │
│                                              │
│  Now   11°  FL 8°                       ●   │  ← brand green dot
│  2pm   12°                              ●   │
│  3pm   13°                              ●   │
│  4pm   14°                              ●   │  ← temp colour: --ink (comfortable)
│  5pm   13°                              ●   │
│  6pm   11°  FL 9°                       ◌   │  ← outline dot (marginal)
│  7pm    9°                              ◌   │
│  8pm    8°                              ◌   │
│  9pm    7°                              ◌   │
│  10pm   6°                              ◌   │
│  11pm   5°                              ◌   │
│                                             │
│  Feels like shown where it differs by 2°+   │
└──────────────────────────────────────────────┘
```

---

## 7. Dismiss interaction

- **Swipe down:** `addSheetSwipe()` applied to the sheet. 100px threshold, same as all other sheets.
- **Tap the scrim:** scrim tap closes the sheet.
- **No explicit close button** in the sheet itself. The handle and swipe behaviour are sufficient. Adding a close button would add visual noise to a sheet that is light and focused.

---

## 8. Dark mode

The sheet inherits the standard dark mode overrides applied to all sheets:
- Sheet background: `var(--surface)` → `#1A2C22` in dark mode
- Title, values: `var(--ink)` → near-white
- Handle: `rgba(255,255,255,0.22)`
- Walk quality dots: brand dot becomes `#82B09A` in dark mode (dark mode `--brand` override)

Temperature colour encoding in dark mode:
- The cool blue (#6B9FD4) and `--ink-2` values work on a dark background without change
- `--ink` (black) on dark background → override to the dark mode `--ink` near-white value, same as all text

No dark-mode-specific changes are needed beyond the standard token overrides already in place.

---

## 9. Data requirements

All data is available from the existing Open-Meteo `fetchWeather()` call. No new API endpoint or additional parameters are needed for the core feature.

| Data field | Source | Notes |
|---|---|---|
| `temperature_2m` | Open-Meteo hourly | Already fetched |
| `apparent_temperature` | Open-Meteo hourly | Already fetched — drives the "Feels like" display in the hero sub-row |
| Today's high/low | Derived from `temperature_2m` array for today's date | Min/max across today's 24 hours |
| Walk quality per hour | Existing hourly quality calculation | Same values as `.hour-seg` colours in Walk Window card |

The sheet function reads from the existing weather data object — no additional fetch required.

---

## 10. CSS classes

Following the `wx-` prefix convention established in the redesign spec.

```css
.wx-temp-chevron          /* 12×12 chevron-down below temp block, affordance hint */
.wx-temp-sheet            /* Bottom sheet container */
.wx-temp-sheet-title      /* "Temperature today" header */
.wx-temp-sheet-hl         /* H/L summary, right-aligned in title row */
.wx-temp-rows             /* Scrollable container for hourly rows */
.wx-temp-row              /* Individual hour row, flex container */
.wx-temp-row-time         /* Time label (Now / 2pm etc) */
.wx-temp-row-value        /* Actual temperature number */
.wx-temp-row-fl           /* Feels-like secondary value — hidden when not needed */
.wx-temp-row-dot          /* Walk quality dot, right-aligned */
.wx-temp-row-dot--good    /* Brand green fill */
.wx-temp-row-dot--caution /* Amber fill */
.wx-temp-row-dot--poor    /* Outline only */
.wx-temp-footer           /* Footer note text */
```

The temperature-tap interaction opens the sheet via a JS function: `openTempSheet()`. Close: `closeTempSheet()`. `addSheetSwipe()` called on `.wx-temp-sheet` after DOM insertion.

---

## Summary for Developer

1. Make `.wx-hero-temp-block` tappable — `onclick="openTempSheet()"`, `cursor: pointer`, `:active` opacity dip to 0.78
2. Add `.wx-temp-chevron` (SVG chevron-down, 12px, `var(--ink-2)` at 55% opacity) inside `.wx-hero-temp-block`, centered below the temperature number
3. Build `.wx-temp-sheet` bottom sheet following the same structure as the metric tile sheets
4. Sheet title row: "Temperature today" left + "H °  L °" right
5. Hourly rows: time, temperature (colour-encoded), feels-like (conditional, ≥2°C difference only), walk quality dot (right-aligned, reuses existing hourly quality values)
6. Footer note: show if any row has feels-like; hide otherwise
7. Apply `addSheetSwipe()` and scrim-tap dismiss
8. No new API calls required
