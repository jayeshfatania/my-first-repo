# Developer Brief — Round 9

*Issued by: Product Owner*
*Date: March 2026*
*Based on: dark-mode-colour-spec.md (Designer, March 2026); Owner feedback on condition tags (March 2026)*
*File: sniffout-v2.html only*

---

## Context

Round 8 (condition tags) is complete. This brief opens with a dark mode colour fix that is fully independent of the condition tags work — no interaction risk.

The dark mode spec is approved in full. This is a targeted token + hardcoded override update with no component structure changes. Read dark-mode-colour-spec.md in full before implementing — it contains the complete substitution table and the full revised `body.night` CSS block to drop in.

FIX 10.2–10.4 are post-build owner feedback on the Round 8 condition tags implementation. They are small targeted changes to the existing condition tags system. Implement them in order — FIX 10.3 (tag removal) first as it is the simplest and has no dependencies, then FIX 10.4 (timestamps), then FIX 10.2 (mark-as-walked undo).

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

---

## FIX 10.2 — Mark as Walked Must Be Reversible

**Root cause:** Accidental taps on the mark-as-walked button have no recovery path. The walk is written to `sniffout_walked` immediately with no undo mechanism. The button state also does not currently support toggling off.

**Required changes:**

### Change 1 — Undo toast after marking

When `onMarkWalked(walkId)` is called and a walk is successfully marked:

1. Show an undo toast at the bottom of the screen (above the bottom nav). Toast persists for **5 seconds** then auto-dismisses.
2. Toast content: `[check icon] Walk logged  [Undo]` — the word "Undo" is a tappable action, not just text.
3. While the toast is visible, tapping "Undo" calls `onUnmarkWalked(walkId)` (see Change 2) and dismisses the toast immediately.
4. If the toast auto-dismisses without undo, the walk remains marked.

**Toast CSS:**

```css
.undo-toast {
  position: fixed;
  bottom: calc(64px + 12px); /* above bottom nav */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1A1A1A;
  color: #F0F0ED;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 24px;
  z-index: 500;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  animation: toastIn 0.2s ease;
}
.undo-toast-action {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
body.night .undo-toast {
  background: #2A3D30;
}
```

**Toast JS (outline):**

```js
function showUndoToast(walkId) {
  // Remove any existing toast
  var existing = document.getElementById('undo-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'undo-toast';
  toast.id = 'undo-toast';
  toast.innerHTML = `
    <i data-lucide="check" style="width:14px;height:14px;flex-shrink:0"></i>
    Walk logged
    <button class="undo-toast-action" onclick="undoMarkWalked('${walkId}')">Undo</button>
  `;
  document.body.appendChild(toast);
  syncIcons();

  var timer = setTimeout(function() {
    if (toast.parentNode) toast.remove();
  }, 5000);

  toast.dataset.timer = timer;
}
```

### Change 2 — `onUnmarkWalked(walkId)` function

Add a new function that reverses a mark-as-walked action:

```js
function onUnmarkWalked(walkId) {
  var walked = JSON.parse(localStorage.getItem('sniffout_walked') || '[]');
  walked = walked.filter(function(id) { return id !== walkId; });
  localStorage.setItem('sniffout_walked', JSON.stringify(walked));

  // Remove toast if still visible
  var toast = document.getElementById('undo-toast');
  if (toast) {
    clearTimeout(Number(toast.dataset.timer));
    toast.remove();
  }

  // Re-render the walk card to restore the un-walked button state
  renderWalks(); // or targeted re-render of this card if available
}
```

### Change 3 — Mark-as-walked button must be re-tappable as a toggle

The "Marked ✓" button state (the state shown after marking) must also be tappable. Tapping a walk that is already in `sniffout_walked` calls `onUnmarkWalked(walkId)`. This is a secondary undo path for when the toast has already dismissed.

The button title/aria-label in the marked state should read "Remove walk log" or similar to communicate it is reversible.

**No changes needed to the post-walk prompt trigger logic** — if the user undoes a mark-as-walked that had already triggered the prompt, the prompt need not re-trigger. The prompt only fires on the forward action.

---

## FIX 10.3 — Remove "Excellent Conditions" Tag

**Root cause:** The `clear` tag ("Excellent conditions") is misleading. It currently reflects the user's weather at their location at the time of submission — not the physical state of the walk. Condition tags must only reflect what the user physically observed. A sunny weather report is not a walk condition.

**Required changes:**

### Step 1 — Remove from `CONDITION_TAGS`

Remove this entry from the `CONDITION_TAGS` array entirely:

```js
{ key: 'clear', label: 'Excellent conditions', icon: 'sun', cat: 'Positive' },
```

After removal, `CONDITION_TAGS` has **12 tags** (was 13). The Positive category now has 2 tags: "Great water point" and "Dog-friendly café open".

### Step 2 — Remove from post-walk prompt

If the post-walk prompt bottom sheet renders tag chips from the `CONDITION_TAGS` array, this removal is automatic. If any tags are hardcoded or filtered separately in the prompt render, ensure `clear` is not included.

### Step 3 — Handle any existing `clear` tags in localStorage

Existing `sniffout_condition_tags` data in localStorage may contain `clear` entries submitted before this fix. These should be silently ignored when rendering — `getDisplayTags()` already filters by the `CONDITION_TAGS` array, so if `clear` is removed from the array, these entries will naturally not render. No migration needed.

---

## FIX 10.4 — Condition Tags Must Show Visible Timestamp

**Root cause:** Condition tags currently show label and icon only. Users cannot tell how recent a tag is unless they know the staleness rules. The submission time must be visible on each tag so users can self-assess relevance.

**Required changes:**

### Step 1 — Update `getDisplayTags()` ageText output

Change the `ageText` value so that relative times are prefixed with "reported ":

```js
// Current:
ageText: stale ? 'May be out of date' : relativeTime(t.ts)

// Updated:
ageText: stale ? 'May be out of date' : 'reported ' + relativeTime(t.ts)
```

This produces output like: `"reported 2 hours ago"`, `"reported yesterday"`, `"reported 3 days ago"`, `"May be out of date"`.

### Step 2 — Render `ageText` on each condition tag chip

Each `.cond-tag` chip currently renders: `[icon] {label}`.

Update to a two-line chip format:

```
[icon]  {label}
        reported 2 hours ago   ← 11px, var(--ink-2), second line
```

**HTML structure per chip:**

```html
<div class="cond-tag">
  <i data-lucide="{icon}" style="width:13px;height:13px;flex-shrink:0"></i>
  <div class="cond-tag-body">
    <span class="cond-tag-label">{label}</span>
    <span class="cond-tag-time">{ageText}</span>
  </div>
</div>
```

**CSS additions:**

```css
.cond-tag {
  /* existing styles remain — add align-items: flex-start if not already set */
  align-items: flex-start;
}
.cond-tag-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.cond-tag-label {
  font-size: 12px;
  font-weight: 500;
  color: inherit;
  line-height: 1.3;
}
.cond-tag-time {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-2);
  line-height: 1.2;
}
/* Stale state — ageText is "May be out of date" */
.cond-tag.stale .cond-tag-time {
  color: var(--amber);
}
```

The `.cond-tag.stale` class should already be applied by `getDisplayTags()` for tags with `stale: true`. Confirm this class is set in the render loop — if not, add it.

**Note on chip width:** The two-line format makes chips slightly taller. This is acceptable — the timestamp provides essential context. Do not suppress the timestamp to keep chips single-line.

---

## Summary

| Fix | Description | Complexity |
|-----|-------------|------------|
| FIX 10.1 | Dark mode colour revision — 4 token updates, hardcoded rgba substitutions, new dark mode overrides | Low |
| FIX 10.2 | Mark as walked reversible — undo toast (5s), `onUnmarkWalked()`, toggle button in marked state | Low |
| FIX 10.3 | Remove `clear` ("Excellent conditions") tag from `CONDITION_TAGS` and post-walk prompt | Trivial |
| FIX 10.4 | Condition tags show timestamp — `ageText` prefixed with "reported", two-line chip render | Low |

---

## Coming in a future Round 9 update

Walk detail overlay implementation (condition tags + mark-as-walked in detail context) will be added to this brief once the Designer completes the walk detail overlay design. The data model and helpers are already in place from Round 8 — the build will be straightforward when the design is ready.
