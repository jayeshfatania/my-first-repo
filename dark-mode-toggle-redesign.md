# Dark Mode Toggle Redesign
**Component:** Display mode selector — Me tab
**Status:** Design recommendation — awaiting implementation
**Replaces:** Cycling single-label button (Light → Auto → Dark → repeat)

---

## The Problem, Precisely

The current button has a hidden interaction model. A user who sees a button labelled "Auto" has no way of knowing that tapping it will cycle to "Dark" rather than toggle it off. When they tapped "Auto" on a sunny day and the screen didn't change, the button appeared broken — because Auto correctly resolved to light mode, but nothing communicated that the tap had registered, or that three states even existed.

The root cause: a single-label cycling control communicates state (what it is now) but not affordance (what it does) or context (what else is available).

---

## Recommendation: Segmented Control

Replace the cycling button with a segmented control — all three options always visible, the active one highlighted.

This is the correct pattern for this exact problem. iOS uses it for display settings, text size, and map type. It is immediately legible to any smartphone user: you see all options, you see which is active, you tap one to select it. No cycling, no ambiguity, no mystery state.

---

## Visual Description

```
┌─────────────────────────────────────────────┐
│  ☀  Light  │  ◑  Auto  │  ☾  Dark           │
│ ──────────   ─────────   ─────────           │
│  [active]                                    │
└─────────────────────────────────────────────┘
```

More precisely, when **Light** is active:

```
┌──────────────────────────────────────────────────────┐
│ ┌──────────────┐                                      │
│ │  ☀  Light   │    ◑  Auto       ☾  Dark             │
│ └──────────────┘                                      │
└──────────────────────────────────────────────────────┘
```

The active segment has a white pill on a warm grey trough. Inactive segments show muted text and icon. The whole control is one unit — it reads as a selector, not three buttons.

---

## Anatomy

### Container (the trough)
- Shape: `border-radius: 12px`
- Background: `rgba(0, 0, 0, 0.06)` — slightly darker than `--bg`, creates a recessed feel
- Padding: `3px` all sides — creates the inset margin around the active pill
- Border: none — the background contrast is enough
- Width: full width of the Me tab settings row

### Active pill
- Background: `var(--surface)` (`#FFFFFF`)
- Shape: `border-radius: 9px` — 3px smaller than container, so it visually sits inside it
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.12)` — subtle lift, not heavy
- Transition: `transform` and `width` over `200ms ease` — the pill slides to the new position on tap (sliding pill animation, not a cross-fade)

### Active label + icon
- Colour: `var(--brand)` (`#1E4D3A`)
- Font: Inter 600, 14px
- Icon: 15px, same colour

### Inactive label + icon
- Colour: `var(--ink-2)` (`#6B6B6B`)
- Font: Inter 500, 14px
- Icon: 15px, same colour

### Height
- Container height: `44px` — the full height is one tap target, no segment is smaller than 44px tall
- Each segment fills the full height

### Width split
- Three equal segments: each is `33.33%` of the container width
- Do not make segments unequal widths — the symmetry is part of the readability

---

## Icons

Use inline SVG icons, not emoji. Three icons:

**Light — sun**
A simple outlined circle with 8 short radiating lines. Standard sun icon.
```
☀  (SVG, ~15×15px, stroke-based, currentColor)
```

**Auto — half circle**
A circle filled on the left half, outlined on the right. Represents the system/automatic state — neither fully light nor fully dark. This icon is less common but immediately intuitive in context: it sits between sun and moon and reads as "in between / automatic."
```
◑  (SVG, ~15×15px, half-filled, currentColor)
```
If a half-filled circle feels too abstract, an acceptable alternative is the letter "A" in a small circle (⓪ style) — but the half-circle is visually cleaner and more icon-like. Recommend the half-circle.

**Dark — crescent moon**
A simple crescent. Standard moon icon.
```
☾  (SVG, ~15×15px, filled crescent, currentColor)
```

All three icons should be `currentColor` so they inherit the active/inactive colour automatically.

---

## Label text

- Light
- Auto
- Dark

Keep these exact labels. "System" is an alternative for Auto but is a more technical term — "Auto" is what users say ("it switches automatically"). Keep "Auto."

Icon and label sit together, icon left of text, `6px` gap between them. Both vertically centred.

---

## Dark mode appearance (`body.night`)

When the user's Auto setting has resolved to dark (or they've set it to Dark manually), the whole app is in dark mode. The segmented control must work against a dark background.

**Container:**
- Background: `rgba(255, 255, 255, 0.08)` — a light trough on a dark surface

**Active pill:**
- Background: `rgba(255, 255, 255, 0.18)` — lighter than the trough, visibly lifted
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.3)`

**Active label + icon:**
- Colour: `#FFFFFF`

**Inactive label + icon:**
- Colour: `rgba(255, 255, 255, 0.45)`

The visual logic is identical — trough, pill, active contrast — just inverted. No new design decisions needed for dark mode.

---

## Slide animation

The active pill should visually slide to its new position when the user taps a new segment. This is what communicates "something happened" — especially important when tapping Auto on a bright day produces no visible app change. The pill movement is the feedback.

Implementation: use a CSS `transform: translateX()` transition on the pill element, not separate show/hide states. The pill is a single `<div>` that moves.

```
transition: transform 200ms ease;
```

200ms is fast enough to feel immediate, slow enough to be perceptible. Do not use a spring or bounce — keep it linear-ease, consistent with the rest of the app.

---

## Placement in the Me tab

The control sits inside a settings row, replacing the existing button. The row should be:

```
┌──────────────────────────────────────────────────────┐
│  Display mode                                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  ☀ Light  │  ◑ Auto  │  ☾ Dark               │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- Row label ("Display mode") sits above the control on its own line, in `var(--ink-2)`, Inter 500, 13px — it reads as a section label, not an inline label
- The control itself is full-width within the card's horizontal padding
- `16px` vertical gap between the row label and the segmented control
- The control sits inside a card (standard Me tab card surface, `border-radius: 16px`)

Do not place the row label inline to the left of the segmented control — the control needs its full width for comfortable tap targets on a mobile screen.

---

## CSS / HTML notes for the Developer

### HTML structure

```html
<div class="segment-label">Display mode</div>
<div class="segment-control" role="group" aria-label="Display mode">
  <div class="segment-pill" aria-hidden="true"></div>
  <button class="segment-btn active" data-mode="light" aria-pressed="true">
    <!-- sun SVG icon -->
    <span>Light</span>
  </button>
  <button class="segment-btn" data-mode="auto" aria-pressed="false">
    <!-- half-circle SVG icon -->
    <span>Auto</span>
  </button>
  <button class="segment-btn" data-mode="dark" aria-pressed="false">
    <!-- moon SVG icon -->
    <span>Dark</span>
  </button>
</div>
```

The pill is a separate `<div>` positioned absolutely behind the buttons — it slides independently. The buttons themselves are transparent backgrounds; only the pill provides the active highlight.

### CSS

```css
.segment-label {
  font: 500 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-bottom: 10px;
}

.segment-control {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* pill is absolute, so grid only applies to buttons */
  background: rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 3px;
  height: 44px;
  box-sizing: border-box;
}

/* dark mode override */
body.night .segment-control {
  background: rgba(255, 255, 255, 0.08);
}

.segment-pill {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(33.333% - 3px); /* one segment minus the left padding */
  height: calc(100% - 6px);   /* full height minus top + bottom padding */
  background: var(--surface);
  border-radius: 9px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 200ms ease;
  pointer-events: none;
  z-index: 0;
}

body.night .segment-pill {
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* JS sets this — translate by 0, 1x, or 2x segment width */
.segment-pill[data-active="0"] { transform: translateX(0); }
.segment-pill[data-active="1"] { transform: translateX(calc(100% + 0px)); }
.segment-pill[data-active="2"] { transform: translateX(calc(200% + 0px)); }
/* Note: since each segment is 1fr and the pill is 1 segment wide,
   translateX(100%) moves it exactly one segment right */

.segment-btn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: none;
  border-radius: 9px;
  font: 500 14px/1 'Inter', sans-serif;
  color: var(--ink-2);
  cursor: pointer;
  padding: 0;
  transition: color 150ms ease;
  -webkit-tap-highlight-color: transparent;
}

body.night .segment-btn {
  color: rgba(255, 255, 255, 0.45);
}

.segment-btn.active {
  font-weight: 600;
  color: var(--brand);
}

body.night .segment-btn.active {
  color: #FFFFFF;
}

.segment-btn svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
```

### JS behaviour

```js
const control = document.querySelector('.segment-control');
const pill = control.querySelector('.segment-pill');
const buttons = control.querySelectorAll('.segment-btn');
const modes = ['light', 'auto', 'dark'];

function setMode(index) {
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
    btn.setAttribute('aria-pressed', i === index);
  });
  pill.dataset.active = index;

  const mode = modes[index];
  localStorage.setItem('sniffout_display_mode', mode);
  applyDisplayMode(mode); // existing function — no change needed there
}

buttons.forEach((btn, i) => {
  btn.addEventListener('click', () => setMode(i));
});

// On init — read from localStorage and set pill position without animation
const saved = localStorage.getItem('sniffout_display_mode') || 'auto';
const savedIndex = modes.indexOf(saved);
pill.style.transition = 'none';
setMode(savedIndex);
requestAnimationFrame(() => {
  pill.style.transition = ''; // restore transition after first render
});
```

The `requestAnimationFrame` trick prevents the pill from animating on page load — it snaps to position silently, then becomes animated for user interactions.

---

## What this fixes

| Problem | Fix |
|---|---|
| User doesn't know other states exist | All three options always visible |
| Tapping Auto on a sunny day appears to do nothing | Pill slides visibly to Auto — the movement is the confirmation |
| No way to jump directly to a state | Tap any segment directly — no cycling required |
| Confusing when Auto = Light visually | The pill position tells you the setting regardless of the current resolved appearance |

---

## What this does not change

- The underlying logic for `applyDisplayMode()` — no change needed
- The `sniffout_display_mode` localStorage key — rename from current if needed, but same concept
- The `body.night` class mechanism — untouched
- The Auto behaviour (resolves to light or dark based on weather `isDay`) — unchanged

---

## Accessibility

- `role="group"` on the container groups the three controls semantically
- Each button uses `aria-pressed` (true/false) to communicate selection state to screen readers
- The pill div is `aria-hidden="true"` — it is decorative only
- The row label ("Display mode") is plain text above the group — no `aria-label` needed on the group itself since the label is visible, but `aria-label="Display mode"` is added to the group as a belt-and-braces measure
- All three buttons are always in the tab order — no hidden or disabled states

---

## One thing to watch

The pill width calculation assumes three equal segments. If the container width is odd and the browser rounds `33.333%` differently than expected, the pill may be 1px too wide or narrow. Test on physical devices at `375px` (iPhone SE) and `390px` (iPhone 14) viewport widths. If off, use `calc((100% - 6px) / 3)` for the pill width (subtracting the `3px` left and right padding from the container).
