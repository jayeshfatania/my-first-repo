# Sniffout v2 — Designer Brief Round 2
*Issued by Product Owner. March 2026. For Designer use only.*
*Based on: design-review-round1.md, developer-brief-round4.md, and Round 3/4 developer implementation.*

---

## Context

Round 1 identified 8 issues across the full file. All 8 were converted into developer fixes (FIX 5.1–5.9 in developer-brief-round4.md). Round 2 has two parts:

1. **Verification sweep** — confirm all Round 4 fixes were correctly implemented by the Developer
2. **Focused review** — Today tab and Weather tab in detail (lightly covered in Round 1), plus new components introduced in Rounds 3–4

All review work is against **`sniffout-v2.html`** only. Reference files: `mockup.html`, `design-spec.md`.

---

## Part 1 — Verification Sweep

Confirm each Round 4 fix has been correctly implemented. For each item, inspect the file and produce a **PASS / FAIL** result with line number reference. If FAIL, note exactly what is wrong.

---

### V1 — Dark mode `--brand` override (FIX 5.1)

**Check:** The `body.night` CSS block must contain `--brand: #6EE7B7`.

Expected state of the block:
```css
body.night {
  --bg:      #0F1C16;
  --surface: #1A2C22;
  --border:  #2A3D30;
  --ink:     #F0F0ED;
  --ink-2:   #8A9E92;
  --chip-off:#2A3D30;
  --brand:   #6EE7B7;   /* ← this must be present */
}
```

**Confirm:** Search the file for `6EE7B7` — it should appear at minimum in the `body.night` block. If absent, FAIL.

---

### V2 — Nearby tab map: `nearbyVenues.forEach` used (FIX 5.2)

**Check:** `updateMapMarkers()` must not call `filteredVenues()`. It must iterate directly over `nearbyVenues`.

Expected:
```js
nearbyVenues.forEach(function(v) {
  L.marker([v.lat, v.lon])...
```

**Confirm:** Search for `filteredVenues` — it must not appear anywhere in the file. If it still appears in `updateMapMarkers`, FAIL.

---

### V3 — Green spaces section label uses `.walks-section-label-sm` (FIX 5.3)

**Check:** In `renderWalksTab()`, the "Other nearby green spaces" label must use the smaller CSS class.

Expected:
```js
html += '<div class="walks-section-label-sm">Other nearby green spaces</div>';
```

**Confirm:** Search for `walks-section-label` in the JS section — the secondary section must use `walks-section-label-sm`, not `walks-section-label`. Visually: the green spaces section header must be smaller/lighter than "Community Picks" (or whatever the primary section is now labelled — see V9 below).

---

### V4 — Trail card heart button present (FIX 5.4)

**Check:** `renderTrailCard()` must include a `.trail-heart` button in the photo area. The `.trail-heart` CSS class must be defined.

**Confirm:** Locate `renderTrailCard()`. Verify the photo div contains a `<button class="trail-heart...">` element with `data-heart` attribute and `onclick="toggleFavourite(...)"`. Verify `.trail-card-photo` has `position: relative`. Verify `.trail-heart` CSS is defined with `position: absolute; top: 8px; right: 8px`.

---

### V5 — Walk tag style consistent across card types (FIX 5.5)

**Check:** `.trail-tag` must use brand-green tinted style matching `.walk-tag` — not grey outlined pills.

Expected:
```css
.trail-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--brand);
  background: rgba(30,77,58,0.1);
  border-radius: 6px;
  padding: 2px 8px;
}
```

**Confirm:** Search for `.trail-tag` CSS definition. It must not have `border: 1.5px solid var(--chip-off)` or `border-radius: 99px`. Verify the off-lead class variants (`.trail-tag.full`, `.trail-tag.partial`) use tinted backgrounds, not grey borders.

---

### V6 — Dark mode: preview card tints visible (FIX 5.6)

**Check:** Dark mode overrides for `.walk-preview-card` and `.weather-preview-card` must be present.

Expected (after the `body.night` block):
```css
body.night .walk-preview-card { background: rgba(110,231,183,0.06); border-color: rgba(110,231,183,0.18); }
body.night .weather-preview-card { background: rgba(110,231,183,0.07); border-color: rgba(110,231,183,0.2); }
body.night .walk-preview-tag { background: rgba(110,231,183,0.12); color: #6EE7B7; }
body.night .weather-preview-title { color: #6EE7B7; }
```

**Confirm:** Search for `body.night .walk-preview-card` — must be present. If absent, FAIL.

---

### V7 — Walk photo placeholders use `var(--brand)` (FIX 5.7)

**Check:** Three locations must use `var(--brand)` not the hardcoded `#1E4D3A`.

**Confirm:** Search the file for `background:#1E4D3A` and `background: #1E4D3A`. Neither should appear as a photo placeholder. Verify `.walk-photo` CSS uses `var(--brand)`. Verify `renderWalkCard()` and `renderPortraitCard()` use `var(--brand)` not the hardcoded hex.

---

### V8 — Green space card `border-radius: 16px` (FIX 5.8)

**Check:** `.gs-card` must use `border-radius: 16px`.

**Confirm:** Search for `.gs-card` CSS. `border-radius` must be `16px`, not `12px`.

---

### V9 — Section label copy (FIX 5.9) — status dependent on PO decision

**Note:** FIX 5.9 (changing "Community Picks" to "Sniffout Picks") is **pending a PO decision on the label name**. Check po-action-plan.md for the current decision status.

- If PO has confirmed a label: verify the section label, location context text, and empty state copy match the confirmed wording.
- If PO has not yet confirmed: note that FIX 5.9 is pending and exclude from PASS/FAIL this round.

---

## Part 2 — Focused Review: Today Tab

Round 1 reviewed State A at a surface level (preview cards, CTA block, search input, pills). State B and the full Today tab experience were not reviewed in detail. This section scopes that review.

Reference the **State B** section of `mockup.html` and the Today tab spec in `design-spec.md`.

---

### T1 — Today tab State B: weather hero card

Review `.weather-hero` (or equivalent — locate the weather hero card rendered when a location is known).

Check:
- Background: solid `var(--brand)` (dark forest green in light mode). No image. No glassmorphism.
- Walk verdict string: correct font size and weight. Renders as the dominant text element. Verdict string does not overflow at narrow widths.
- Condition pills below the verdict: icon + label format, white or semi-transparent treatment on dark background.
- Border radius: 16px.

---

### T2 — Today tab State B: horizontal walk scroll

The Today tab State B shows a horizontal scroll of nearby walks. Locate this component (`renderPortraitCard()` or equivalent).

Check:
- Cards are `.portrait-card` (or equivalent). Base style: `border-radius: 16px`, `border: 1px solid var(--border)`.
- Photo area with heart button (confirmed pass in Round 1 — verify still present).
- Cards scroll horizontally with no visible scrollbar.
- Card width is consistent. Cards do not expand to fill available width.

---

### T3 — Today tab State B: conditional hazard card

The hazard card appears when conditions are adverse (rain/heat/wind/UV/ice). Locate the hazard card component.

Check:
- `border-radius: 12px` with a 4px left-border accent (amber or red) — this is the **correct** spec for hazard cards (compact information density requires tighter radius, not 16px — confirmed acceptable in Round 1).
- Icon, title, body text hierarchy correct: title at 14–15px/600, body at 13–14px/400.
- Amber variant (`var(--amber)`) and red variant (`var(--red)`) both defined.
- Card is visually subordinate to the weather hero — do not flag the smaller radius here.

---

### T4 — Today tab State B: seasonal tip

The seasonal tip is a distinct informational card (not an error/hazard card). Locate the seasonal tip component.

Check:
- Rendered as a surface card (`background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 16px`) — not as a hazard card.
- Icon/emoji renders at appropriate size. Only the 🐾 paw emoji is reserved for paw safety — confirm the seasonal tip does not use 🐾.
- Text hierarchy: title at 14px/600, body at 13px/400.

---

### T5 — Today tab: dark mode State B

With `body.night` active (triggers automatically when `isDay` is false in weather data):

Check:
- Weather hero background: `var(--brand)` resolves to `#6EE7B7` after FIX 5.1 — visually the hero becomes light teal on dark background. Confirm text on the hero remains legible at `#6EE7B7` (white text should remain; verify no hard-coded colour on hero text).
- Walk cards in the horizontal scroll render correctly in dark mode (`--surface: #1A2C22` background, correct border and ink colours).

---

## Part 3 — Focused Review: Weather Tab

The Weather tab was not reviewed in Round 1. Review it now against `mockup.html` and `design-spec.md`.

---

### W1 — Conditions grid

The conditions grid shows temperature, feels-like, rain probability, wind speed, UV (if added), humidity (if rendered).

Check:
- Grid cells: `border-radius: 12px`, `border: 1px solid var(--border)`, `background: var(--surface)` — the 12px radius is intentional for compact metric cells (confirmed acceptable in Round 1). Do not flag as inconsistent.
- Icon, value, and label hierarchy within each cell: value at 20–22px, label at 11–12px/`var(--ink-2)`.
- Grid layout: consistent column widths. No cell overflows or wraps unexpectedly at 390px viewport.

---

### W2 — Paw safety block

The paw safety block only renders for `temp > 25°C` (hot pavement danger) or `temp <= 0°C` (ice/gritting risk). It must NOT render at normal temperatures.

Check:
- CSS traffic-light left-border accent (green/amber/red based on severity).
- Correct approved copy — confirm against `copy-review.md`. The 7-second test copy must be present for heat state.
- `border-radius: 16px`, `border: 1px solid var(--border)`.
- No paw safety block rendered when temperature is moderate (e.g. 15°C).

---

### W3 — Weather info modal

The info button (ⓘ) in the weather hero triggers a bottom-sheet modal. Review the modal.

Check:
- Slides up from bottom. Backdrop dims. Tapping backdrop closes modal.
- Modal content: explains when cautions appear and paw safety threshold.
- Modal has `border-radius: 20px 20px 0 0` (top corners only) — standard bottom sheet spec.
- Correct ink colours and typography within modal.

---

### W4 — Dark mode: Weather tab

With `body.night` active:

Check:
- Conditions grid cells: `--surface: #1A2C22` backgrounds — visible against `--bg: #0F1C16`.
- Paw safety block: if rendered, brand tint uses `var(--brand)` (which after FIX 5.1 resolves to `#6EE7B7`).
- Hazard cards: amber/red accent borders remain visible on dark surface.

---

## Part 4 — Review: New Components from Rounds 3–4

These components were added or significantly changed in Rounds 3–4 and have not been reviewed.

---

### N1 — Venue photos on Nearby tab cards (FIX 4.2)

The Nearby tab venue cards now include a photo area at the top of each card.

Check:
- `.venue-card-photo-gp`: 140px height, full-width, `overflow: hidden` on the card (image bleeds to card border radius).
- When `photoUrl` is set: `<img loading="lazy">` renders correctly. Image fills the div — no distortion or squashing.
- When `photoUrl` is null: brand-green placeholder fills the div. No broken image icon. Background is `var(--brand)` (not a hardcoded hex).
- Card border radius at 16px — image clips to rounded corners at the top edge.
- Card body below image: venue name, category chip, address, maps link — unchanged from Round 1 pass.

---

### N2 — Enclosed chip on trail cards (FIX 4.4)

WALKS_DB entries now have an `enclosed: boolean` field. `renderTrailCard()` should render an "Enclosed" chip when `enclosed: true`.

Check:
- A trail card where `enclosed: true` (currently only Richmond Park) shows an `Enclosed` chip.
- Chip uses the same style as off-lead and terrain chips (`.trail-tag` — which should now be brand-green tinted after FIX 5.5).
- A trail card where `enclosed: false` shows **no** enclosed chip (chip absence = not enclosed).
- Confirm the enclosed chip position in the tag row is consistent — it should appear after the off-lead tag, before or after terrain tag.

---

### N3 — Green spaces section in Walks tab: overall composition

Following label text change (FIX 4.1), label weight change (FIX 5.3), and border-radius fix (FIX 5.8), review the full "Other nearby green spaces" section composition.

Check:
- Section reads as clearly subordinate to the Community Picks carousel above it.
- `.gs-card` rows: `border-radius: 16px` (after FIX 5.8), correct surface/border.
- Green space entry name at 14px/600, distance/type metadata at 12px/`var(--ink-2)`.
- Loading state ("Looking for nearby green spaces…") renders correctly while Overpass fetch is in progress.
- Empty state (no results): section hidden entirely — confirm no empty section header is shown when there are no green spaces.

---

## Deliverable

Produce `design-review-round2.md` structured as:

1. **Verification results** — PASS / FAIL table for V1–V9, with line number evidence for each
2. **Today tab findings** — T1–T5 results, any issues with fix specs
3. **Weather tab findings** — W1–W4 results
4. **New components** — N1–N3 results
5. **Issue priority summary** — if any new issues are found, triage using the same Priority / Effort format as Round 1

For any issue found, provide:
- Exact location (line number or function name)
- What is wrong vs what is expected
- The specific fix (CSS property, JS change, or copy change) — enough detail for the Developer to implement without further design input

---

## What Not to Review

- `dog-walk-dashboard.html` — do not touch or reference
- Me tab settings rows (`border-radius: 12px`) — already accepted as appropriate for list rows
- Stat cells (`border-radius: 14px`) — flagged as minor in Round 1, not a priority
- Hazard card `border-radius: 12px` — this is correct spec for compact cards, do not flag
- Conditions grid cells `border-radius: 12px` — same, intentional
