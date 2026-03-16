# Developer Brief — Round 9

*Issued by: Product Owner*
*Date: March 2026*
*Based on: dark-mode-colour-spec.md (Designer, March 2026)*
*File: sniffout-v2.html only*

---

## Context

Round 8 (condition tags) is complete. This brief opens with a dark mode colour fix that is fully independent of the condition tags work — no interaction risk.

The dark mode spec is approved in full. This is a targeted token + hardcoded override update with no component structure changes. Read dark-mode-colour-spec.md in full before implementing — it contains the complete substitution table and the full revised `body.night` CSS block to drop in.

---

## FIX 10.1 — Dark Mode Colour Revision

**Root cause:** Two compounding problems — `--brand: #6EE7B7` has 72% saturation which produces a neon glow on dark surfaces, and 8 hardcoded `rgba(110,231,183,...)` values are not derived from the `--brand` token, so changing the token alone is insufficient. Additionally, several `rgba(30,77,58,...)` light-mode tints are nearly invisible dark-on-dark.

**Approved changes:**

| Token | Current | Revised | Reason |
|-------|---------|---------|--------|
| `--brand` | `#6EE7B7` | `#82B09A` | Saturation 72% → 21%. Removes neon glow. Sage, not mint. |
| `--ink-2` | `#8A9E92` | `#8B9690` | G/R gap 20pt → 11pt. Secondary text reads neutral, not green. |
| `--border` | `#2A3D30` | `#263530` | Slight desaturation. Borders recede, not register as colour. |
| `--chip-off` | `#2A3D30` | `#263530` | Matches revised `--border`. Inactive chips stay recessive. |

### Step 1 — Replace the `body.night` token block

Replace the entire existing `body.night { ... }` CSS rule with:

```css
body.night {
  --bg:       #0F1C16;
  --surface:  #1A2C22;
  --border:   #263530;
  --ink:      #F0F0ED;
  --ink-2:    #8B9690;
  --chip-off: #263530;
  --brand:    #82B09A;
}
```

(`--bg`, `--surface`, `--ink` are unchanged and correct — do not modify.)

### Step 2 — Replace all hardcoded `rgba(110,231,183,...)` instances

Search the file for `rgba(110,231,183` and replace each occurrence per this table. Old accent = RGB(110,231,183) = `#6EE7B7`. New accent = RGB(130,176,154) = `#82B09A`.

| Current value | Replacement | Used on |
|---------------|-------------|---------|
| `rgba(110,231,183,0.06)` | `rgba(130,176,154,0.07)` | `.walk-preview-card` bg, `.today-conditions-card` bg |
| `rgba(110,231,183,0.07)` | `rgba(130,176,154,0.08)` | `.weather-preview-card` bg |
| `rgba(110,231,183,0.12)` | `rgba(130,176,154,0.13)` | `.walk-preview-tag` bg, `.trail-tag` bg |
| `rgba(110,231,183,0.18)` | `rgba(130,176,154,0.18)` | `.walk-preview-card` border, `.today-conditions-card` border |
| `rgba(110,231,183,0.20)` | `rgba(130,176,154,0.20)` | `.weather-preview-card` border |

### Step 3 — Replace all hardcoded `#6EE7B7` text colour instances in dark mode

Search for `#6EE7B7` in `body.night` overrides and replace with `#82B09A`:

| Used on |
|---------|
| `.walk-preview-tag` color |
| `.weather-preview-title` color |

### Step 4 — Add dark mode overrides for `rgba(30,77,58,...)` components

These components use dark-green-at-low-opacity for light mode tints. On dark surfaces they are nearly invisible (dark on dark). Add the following `body.night` override rules:

```css
/* Preview cards — State A */
body.night .walk-preview-card     { background: rgba(130,176,154,0.07); border-color: rgba(130,176,154,0.18); }
body.night .weather-preview-card  { background: rgba(130,176,154,0.08); border-color: rgba(130,176,154,0.20); }
body.night .walk-preview-tag      { background: rgba(130,176,154,0.13); color: #82B09A; }
body.night .weather-preview-title { color: #82B09A; }
body.night .today-conditions-card { background: rgba(130,176,154,0.07); border-color: rgba(130,176,154,0.18); }

/* Trail tags */
body.night .trail-tag             { background: rgba(130,176,154,0.13); }
body.night .trail-tag.partial     { background: rgba(217,119,6,0.12); } /* amber — unchanged */

/* Venue and walk components */
body.night .venue-icon            { background: rgba(130,176,154,0.12); }
body.night .walk-tag.full         { background: rgba(130,176,154,0.10); border-color: rgba(130,176,154,0.22); }
body.night .venue-open-gp.open    { background: rgba(130,176,154,0.12); }
body.night .filter-chip.active    { background: rgba(130,176,154,0.10); }

/* Walk window / hazard brand variant */
body.night .hazard-card.brand-variant { background: rgba(130,176,154,0.07); }
```

**State A preview card exception:** Use `--surface` background and `--border` border in dark mode — no tint. This is intentional: a solid surface card is cleaner than a tinted one in dark mode.

```css
body.night .state-a-preview-card  { background: var(--surface); border-color: var(--border); }
```

(Adjust the class name above to match whatever class the State A preview cards actually use in the current build.)

### Step 5 — Verify

Force dark mode by setting `isDay = 0` in devtools (or via the Me tab dark mode toggle if present). Check:
- Active nav icon/label: muted sage, not neon mint
- Trail tag chips: subtle dark sage tint
- Walk preview cards (State A): quiet sage outline
- Weather preview title: calm sage text, not glowing
- Conditions card border: near-invisible
- Secondary text (metadata, labels): neutral grey, not green
- Weather hero background: sage green — intentional and correct in dark mode

No other files require changes. Light mode styles, `sw.js`, `manifest.json` are all unaffected.

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| FIX 10.1 | Dark mode colour revision — 4 token updates, hardcoded rgba substitutions, new dark mode overrides | Low |

---

## Coming in a future Round 9 update

Walk detail overlay implementation (condition tags + mark-as-walked in detail context) will be added to this brief once the Designer completes the walk detail overlay design. The data model and helpers are already in place from Round 8 — the build will be straightforward when the design is ready.
