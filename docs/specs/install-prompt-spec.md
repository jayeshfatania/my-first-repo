# Install Prompt Spec
**Feature:** Add to home screen prompt — Me tab
**Status:** Design spec — ready for Developer implementation
**Design round:** Post-Round 12

---

## Design intention

The install prompt is the least urgent thing on the Me tab. Its job is to be present without being pushy — a quiet invitation at the end of the screen, seen by users who've already scrolled through the content they care about. It should feel like a helpful footnote, not a conversion goal.

The existing dog prompt card (`.me-dog-prompt`) is the visual reference for this component. It uses the same "icon circle + text + dismiss X" pattern that already exists in the app and that tests well for suggestions rather than demands. The install prompt inherits this pattern directly, with copy tuned to be even more casual.

---

## 1. Placement

**Below the `.me-entries` list — at the bottom of the Me tab scroll.**

The Me tab in State A shows, top to bottom:
1. Me header (avatar, empty name)
2. Stats dashboard (three zero-state stat cards)
3. Dog prompt card (if not dismissed)
4. Entry rows (Your Dog, Walk Journal, Saved Walks, Saved Places)
5. **Install prompt card ← new**

The bottom-of-scroll position is chosen for three reasons:

**It does not compete.** Every element above it serves a purpose directly related to using the app. The install prompt is optional and supplementary. Placing it last respects that hierarchy.

**It avoids a double-prompt stack.** The dog prompt card and the install prompt are both dismissable suggestion cards. Placing them adjacent (both above or below the entries) would make the top of the tab feel like a list of demands. Separating them — dog prompt above the entries, install prompt below — means only one prompt is typically in the viewport at a time.

**It suits the audience.** A user who has scrolled to the bottom of the Me tab in State A is engaged and exploratory. They've looked at the stats, seen the entry rows, and kept going. That's the right moment for a low-key home screen suggestion.

**`margin-top: 16px` between the entries card and the install prompt.** Standard card gap. The prompt is part of the page flow, not grouped with the entries.

**`margin-bottom: 32px`** below the prompt to give breathing room above the bottom nav bar.

---

## 2. Visual treatment

A card. Specifically, the same card pattern as `.me-dog-prompt`.

```
┌──────────────────────────────────────────────┐
│  [●]  Add sniffout to your home screen   [×] │
│       One tap to check before your walk.     │
│       Add to home screen →                   │
└──────────────────────────────────────────────┘
```

**Card container:**
- `background: var(--surface)`
- `border: 1px solid var(--border)`
- `border-radius: 12px`
- `padding: 14px 16px`
- `margin: 0 16px`
- `display: flex; align-items: flex-start; gap: 12px`
- `position: relative`

The icon circle, body text column, and dismiss button match the dog prompt structure exactly. `align-items: flex-start` (not center) because the body has two lines of text — top-aligning the icon circle against the first text line reads more naturally than centering it against both.

**Why a card, not a banner or a text link:**

A banner (full-width, no margins) would feel like a system notification or an ad — too authoritative for something this optional. A plain text link would be too easy to miss and would feel like a settings entry rather than a suggestion. The card pattern sits between these extremes: it has a clear boundary that signals "this is a distinct thing", but the surface colour (`var(--surface)` on `var(--bg)`) keeps it gentle rather than prominent.

---

## 3. Icon

A home icon — house outline, Lucide-style, 18×18px, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.

```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
```

The icon sits inside a 32×32px circle container with `background: rgba(59,92,42,0.10)` — the same brand-tinted circle used by the dog prompt icon. This keeps the visual language consistent: both prompt cards read as the same type of thing.

A house is immediately understood as "home screen" without any technical language. It is not the Sniffout logo (which would look self-promotional) and not a download arrow (which implies "install", the word we're avoiding).

---

## 4. Copy

**Primary text:** "Add sniffout to your home screen"
- Inter 400, 14px, `var(--ink-2)`, `line-height: 1.4`
- Lowercase "sniffout" matches the wordmark style throughout the app
- "Add" not "Install" — matches the language browsers and mobile OSs use in their own prompts; familiar without being technical
- "your home screen" — possessive, personal; this is about the user's phone, not the app

**Secondary text:** "One tap to check before your next walk."
- Inter 400, 13px, `var(--ink-2)`, `margin-top: 2px`
- Benefit-first. What does adding to the home screen give them? Speed and ease before a walk — which is exactly the core use case
- Full stop at the end — this is a complete, calm sentence, not a headline fragment

**Action label:** "Add to home screen →"
- Inter 500, 13px, `var(--brand)`
- Arrow → (not chevron) — same text-link style as other low-key in-app actions
- This label triggers the `beforeinstallprompt` deferred prompt on tap

No button shape. The action is a text link styled in brand green (`var(--brand)`), the same treatment as `me-dog-prompt-link`. A button would make this feel like the primary call to action on the tab, which it is not.

**Full card copy, assembled:**
```
Add sniffout to your home screen             [×]
One tap to check before your next walk.
Add to home screen →
```

---

## 5. Dismiss

**Yes — permanently dismissable via an × button.** No exceptions.

The dismiss button:
- 20×20px, top-right of the card, `position: absolute; top: 12px; right: 12px`
- Same implementation as `.me-dog-prompt-dismiss`
- Icon: a small × SVG (Lucide X, 12px stroke, `var(--ink-2)`)
- `aria-label="Dismiss"`

**On dismiss:**
1. Hide the card immediately (remove from display or set `display: none`)
2. Set `localStorage.setItem('sniffout_hide_install_prompt', 'true')`
3. Do not show again — ever. The user has made their choice. No re-prompting after X days, no second chance on next session

**Why permanent dismiss:** The install prompt is the lowest-priority item on the screen. A user who dismisses it has signalled clearly that they do not want it. Re-prompting on any cadence — even weekly — would feel disrespectful of that signal and would train users to dismiss future prompts by reflex rather than consideration.

---

## 6. Show/hide logic

The install prompt card is shown only when all three conditions are true simultaneously. If any condition is false, the element is `display: none` (or not rendered).

**Condition 1 — App is installable:**
The `beforeinstallprompt` event has fired and been captured. The Developer should capture this event in a variable (`let deferredPrompt`) and use its presence to determine whether the prompt is available. If the event never fires (app already installed, browser doesn't support PWA install, or user is on iOS which uses a different install mechanism), the card never shows.

**Condition 2 — Not already in standalone mode:**
`window.matchMedia('(display-mode: standalone)').matches === false`. If the app is already running installed (added to home screen and opened from there), the prompt should not appear even if the localStorage flag is not set.

**Condition 3 — User has not dismissed:**
`localStorage.getItem('sniffout_hide_install_prompt') !== 'true'`

**Auto-hide on install:**
Listen for the `appinstalled` window event. When it fires:
1. Hide the install prompt card
2. Set `localStorage.setItem('sniffout_hide_install_prompt', 'true')`

This ensures the card disappears automatically the moment the user completes installation, whether through the in-app prompt or through the browser's own install UI.

**iOS note:** `beforeinstallprompt` does not fire on Safari/iOS. The install prompt card will never appear on iOS because Condition 1 will never be met. This is the correct behaviour — iOS has its own share sheet flow for adding to the home screen, and the app should not attempt to replicate or hint at it. iOS users who want to install will find the share sheet on their own.

---

## 7. Dark mode

The card uses standard design tokens that already have dark mode overrides. No additional dark mode CSS is needed.

In dark mode (`body.night`):
- `var(--surface)` → `#1A2C22` (card background, dark forest green)
- `var(--border)` → `rgba(255,255,255,0.08)` (card border, faint)
- `var(--ink-2)` → near-white at reduced opacity (text)
- `var(--brand)` → `#82B09A` (action link in sage — acceptable for non-interactive label text, but note the WCAG contrast concern flagged in the UX review applies here too if the action link is considered interactive)

---

## 8. CSS classes

```css
.me-install-prompt           /* Card container — matches .me-dog-prompt structure */
.me-install-prompt-icon      /* 32px brand-tinted circle — same as .me-dog-prompt-icon */
.me-install-prompt-body      /* Flex-1 text column */
.me-install-prompt-text      /* Primary text: "Add sniffout to your home screen" */
.me-install-prompt-sub       /* Secondary text: "One tap to check..." */
.me-install-prompt-link      /* Action text link — same as .me-dog-prompt-link */
.me-install-prompt-dismiss   /* × button — same as .me-dog-prompt-dismiss */
```

These class names deliberately mirror the dog prompt class names. They are the same component type and should share the same visual DNA.

---

## 9. localStorage key

```
Key:   sniffout_hide_install_prompt
Value: 'true' (string, not boolean — localStorage is string-only)
```

Add this key to the localStorage key table in `CLAUDE.md` when implementing.

---

## 10. Full card wireframe

```
margin: 0 16px
┌──────────────────────────────────────────────┐
│                                          [×] │  ← 20px dismiss, position: absolute
│  ┌──┐  Add sniffout to your home screen      │
│  │🏠│  One tap to check before your next     │
│  └──┘  walk.                                 │
│        Add to home screen →                  │
└──────────────────────────────────────────────┘
margin-bottom: 32px
```

The icon circle is `align-self: flex-start` so it aligns with the first line of text, not the centre of the full card height. The dismiss button is `position: absolute; top: 12px; right: 12px` so it does not affect the flex layout of the icon, body text, and action link.
