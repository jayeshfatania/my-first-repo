# Disclaimer Design Spec
**Component:** Curated Walk Disclaimer
**Status:** Design spec — awaiting implementation
**Applies to:** All walks (curated and future user-submitted)

---

## 1. Copy

**Primary disclaimer (walk detail overlay):**

> Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go.

**Rationale:**
- "Checked at the time of listing" is honest without being alarming — it implies care was taken
- "Conditions, access, and facilities" covers the three things most likely to change (path closures, parking, seasonal closures)
- "Verify before you go" is a gentle call to action, not a legal hedge
- 22 words — short enough to read, specific enough to be meaningful
- Works verbatim for both curated and user-submitted walks; no source-specific language needed

**Do not use:**
- "We cannot be held responsible…" — legal, off-brand
- "Always check with the landowner" — too procedural
- "Information may be inaccurate" — undermines trust without adding value

---

## 2. Placement

### Walk detail overlay — YES (always visible)
Place the disclaimer at the **bottom of the overlay content**, below all walk information and above the bottom safe area / close affordance. It sits outside the main scroll content as a fixed footer strip within the overlay.

This placement is deliberate:
- The user has already decided they're interested — they opened the detail
- They've read the walk info, so the disclaimer lands in context ("now that you know where you're going…")
- It doesn't interrupt discovery at the card level

### Walk card — NO
Do not add disclaimer text to cards. Cards are for discovery — cluttering them with legal-adjacent copy kills the browsing experience. The detail overlay is the right trust moment.

### Session behaviour — passive, always present
The disclaimer is always visible in the detail overlay. No session suppression, no "don't show again" toggle. It is not an interstitial — it requires no acknowledgement. Because it is passive and visually quiet, seeing it repeatedly causes no friction.

---

## 3. Visual Design

### Treatment
A slim, quiet strip — not a card, not a modal. It reads as a footnote, not a warning.

```
┌─────────────────────────────────────────────────┐
│  ⓘ  Walk details are checked at the time of    │
│     listing, but conditions, access, and        │
│     facilities can change. Verify before        │
│     you go.                                     │
└─────────────────────────────────────────────────┘
```

### Tokens
| Property | Value | Rationale |
|---|---|---|
| Background | `transparent` | Avoids a "box within a box" feel |
| Top border | `1px solid var(--border)` | Separates from walk content without visual weight |
| Text colour | `var(--ink-2)` — `#6B6B6B` | Secondary — informative, not alarming |
| Font | Inter 400 | No weight — this is not a heading |
| Font size | `12px` | Footnote scale; present but unobtrusive |
| Line height | `1.5` | Comfortable for 3-line read |
| Icon | SVG info circle (`ⓘ`), `14px`, `var(--ink-2)` | Signals "information", not danger |
| Icon alignment | Top-aligned to first line of text | Stays anchored when text wraps |
| Padding | `12px 16px` | Matches overlay horizontal gutter |
| Margin top | `0` | Border does the separation work |

### Dark mode (`body.night`)
Text colour remains `var(--ink-2)` — the dark mode token set handles this automatically. No additional override needed.

### What it is NOT
- Not amber (`--amber`) — that colour is reserved for weather hazards
- Not red (`--red`) — danger signal, wrong register
- Not bold — would compete with walk name and key facts
- Not a card with `border-radius: 16px` — footnotes don't get card treatment
- No paw emoji — reserved for paw safety block per design principles

---

## 4. Interaction

**Passive — no acknowledgement required.**

The disclaimer is always visible. The user does not tap, swipe, or confirm it. There is no checkbox, no "I understand" button, no bottom sheet, no toast.

**Rationale:** Requiring acknowledgement implies legal liability management. That register is wrong for Sniffout — it breaks the "informative companion" tone and creates friction before every walk. A passive, visually quiet disclaimer achieves the honest disclosure goal without the anxiety of a consent pattern.

**Future consideration (user-submitted walks only):** When community submissions launch, submitted walks may warrant a slightly different copy variant to signal provenance — e.g., adding "This walk was submitted by a community member." The placement, size, and passive treatment remain identical. This is deferred until community features are built.

---

## Implementation Notes

- Render inside the walk detail overlay, below all scrollable content, as a non-scrolling footer element
- Single shared component — no conditional logic needed for curated vs. placeholder-for-future-submitted at this stage
- No `localStorage` interaction — always render, no session tracking
- Accessible: icon is `aria-hidden="true"`, text is plain readable content (no `aria-label` needed)
