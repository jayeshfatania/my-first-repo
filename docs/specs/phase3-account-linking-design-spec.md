# Phase 3 Account Linking - Design Spec
**Date:** 23 March 2026
**Designer:** Claude Code (Designer agent)
**Status:** Ready for Copywriter brief and Developer implementation
**Source documents:** `docs/specs/firebase-phase3-migration-spec.md` (Section 3 primary brief), `docs/handoffs/session-handoff-march-23.md` (Section 11), `CLAUDE.md`

---

## Design principles applied

All design decisions in this spec follow the locked principles in CLAUDE.md:

- Mobile-first, uncluttered, modern and slick
- Card-based design - no glassmorphism, no translucent surfaces
- Inter 400/500/600/700 only
- Cards: border-radius 16px (utility elements: 12px), 1px solid var(--border), no blur
- All interactive elements: 44px minimum tap target (WCAG 2.5.5)
- Dark mode via `body.night` class - all components must work in both light and dark
- No hardcoded hex values in implementation - CSS custom properties only
- No em dashes, no en dashes - hyphens only in all copy

One new CSS custom property is required by this spec: `--brand-tint`. See Section 5 for definition.

---

## Section 1 - Persistent Data Reminder Element (Pre-linked State)

### Purpose

A permanent, unobtrusive entry row in the Me tab that communicates device-local data risk and invites the user to protect their data by linking an account. It must be present from the first session and must not disappear until the user has successfully linked an account.

### Placement

**Recommended position:** At the bottom of the Me tab's scrollable content, directly above the gear icon / settings row.

Rationale: The reminder is account-related. Placing it near the settings row positions it in the natural "account and settings" cluster of the Me tab. This means it does not interrupt the primary content (stats, journal, badges) at the top of the tab, which users open the Me tab specifically to view. Users who are ready to take action will find it at a natural resting point after they have reviewed their data.

The reminder must NOT be placed:
- Above the stats row (interrupts primary Me tab purpose)
- As a pinned footer outside the scroll area (iOS safe area conflicts, breaks tab bar spacing)
- As a floating element (visual noise, conflicts with brand principles)

### Component anatomy

The reminder is a single tappable row element. It is not a full card - it is a compact notice row with a distinctive left border.

```
+--[3px brand border]------------------------------------+
|  [icon 18px]  [Headline 13px/600]              [>14px] |
|               [Body copy 13px/400]                      |
+--------------------------------------------------------+
```

**Left border:** 3px solid var(--brand). This is the primary visual signal that distinguishes the row. The left border treatment is used here (instead of a background tint) because:
- It works cleanly in both light and dark mode using a single existing token
- It communicates "notice" not "alert" - a thinner visual cue than a coloured background
- It does not require inventing a new surface colour

**Element tag:** `<div class="data-reminder-row">` - renders as a tappable div, not a button, because it is a notice that opens a sheet rather than an action that completes inline. Attach `role="button"` and `tabindex="0"` for accessibility.

**Minimum height:** 56px. This exceeds the 44px minimum and gives comfortable vertical padding around two lines of text.

**Left icon:** Lucide `shield` at 18px, colour var(--brand). Shield was chosen over `lock` (which implies restriction) and `cloud-off` (negative framing). The shield icon is a recognised data protection symbol and is not threatening.

**Text block:**
- Headline: 13px, font-weight 600, color var(--ink), one line
- Body copy: 13px, font-weight 400, color var(--ink-2), one line (truncate if needed - do not wrap to three lines)

**Right chevron:** Lucide `chevron-right` at 14px, colour var(--ink-2). Signals the row is tappable and opens a flow.

**Background:** var(--surface)

**Border:** 1px solid var(--border) on top, right, and bottom edges. The left edge uses the 3px brand border (replaces the standard 1px border on that side).

**Border radius:** 12px. Slightly smaller than the main content cards (16px) to signal this is a utility/status element, not a content card.

**Padding:** 14px 16px

**Margin:** 8px 16px (standard horizontal margin, 8px vertical gap from surrounding elements)

**Dark mode:** No additional overrides needed. `var(--surface)` becomes #1F1F1F, `var(--ink)` becomes #F4F2EE, `var(--ink-2)` becomes #8A8A8A, `var(--brand)` becomes #5C7A63. The left border and icon naturally adapt. Verify dark mode visually - the lightened brand value (#5C7A63) on dark surface should have sufficient contrast.

**Non-dismissible implementation note:** Do not render a close or dismiss button on this element. The element has no dismiss state until `auth.currentUser.isAnonymous === false` (account linked). The Developer should gate the rendering on `!isLinked()` and replace it with the post-linked element (Task 3) when the account state changes.

### CSS class: `.data-reminder-row`

```css
.data-reminder-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 14px 16px;
  margin: 8px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--brand);
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.data-reminder-row:active {
  opacity: 0.75;
}

.data-reminder-icon {
  flex-shrink: 0;
  color: var(--brand);
}

.data-reminder-text {
  flex: 1;
  min-width: 0;
}

.data-reminder-headline {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
}

.data-reminder-body {
  font-size: 13px;
  font-weight: 400;
  color: var(--ink-2);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-reminder-chevron {
  flex-shrink: 0;
  color: var(--ink-2);
}
```

### Copywriter annotation - pre-linked reminder

**String 1 - Headline (`.data-reminder-headline`):**
One short line. Must communicate: your walk log and dog profile are on this device only. Character budget: approximately 40 characters. No "sign up", no "account", no "registration". Framing: "your data is here" not "your data is at risk".

**String 2 - Body copy (`.data-reminder-body`):**
One short line. Must communicate: tap here to keep your data safe across devices. Character budget: approximately 50 characters. Keep it lightweight - this is a prompt, not a warning.

---

## Section 2 - Account Linking Flow

### Overview

The account linking flow opens as a bottom sheet when the user taps the data reminder row. It follows the existing bottom sheet pattern used by the condition tag sheet (`openCondTagSheet()`) and favourites sheet (`openFavsSheet()`).

The flow has four distinct screens rendered within the same sheet element:
1. Method selection (Google or email)
2a. Google confirmation and loading
2b. Email form
3. Password reset

Navigation within the flow uses JavaScript state to swap the inner content - the sheet element itself does not change. History.pushState is called once when the sheet opens, not on each screen transition.

### Sheet container

**Element:** `<div id="account-link-sheet" class="account-link-sheet">` with `<div id="account-link-backdrop">` behind it.

**Sheet dimensions:**
- Method selection screen: natural content height (approximately 340-380px visible)
- Email form screen: taller, approximately 460-500px to accommodate both input fields, labels, and CTA without requiring scroll on most devices. If the keyboard reduces available space below this, the sheet content must be scrollable.

**Sheet chrome (present on all screens):**
- Drag handle: centred at top, 32px wide x 4px tall, background var(--border). No label. Margin-top 8px, margin-bottom 16px.
- Close button: top-right of the sheet header, Lucide `x` at 20px, 44x44px tap target, colour var(--ink-2). Tapping closes the sheet and returns to the Me tab without completing the flow.

**Transitions between screens:**
Content within the sheet cross-fades over 150ms. The sheet height animates smoothly when the email screen (taller) replaces the method selection screen. Use CSS `transition: height 200ms ease` on the sheet element.

**Swipe to dismiss:** The same swipe-dismiss behaviour used elsewhere in the app applies here. Threshold: 100px (consistent with other sheets - do not use the 150px walk-detail threshold). On dismiss, the sheet closes and the user returns to the Me tab. The data reminder remains visible and unchanged.

---

### Screen 1 - Method Selection

**Layout (top to bottom, within sheet):**

1. Drag handle (sheet chrome, see above)
2. Headline - 20px, font-weight 700, color var(--ink), padding 0 20px
3. Body copy - 14px, font-weight 400, color var(--ink-2), padding 0 20px, margin-top 6px. Two lines maximum.
4. Google option button - 48px height, border-radius 12px, border 1px solid var(--border), background var(--surface). Left: Google "G" icon (inline SVG, 18px, original Google colours - see note below). Centred label text 15px/600/var(--ink). Full-width minus 32px margin (16px each side).
5. Vertical gap: 10px
6. Email option button - same dimensions and treatment as Google button. Left: Lucide `mail` at 18px, colour var(--ink-2). Centred label text 15px/600/var(--ink).
7. Privacy notice - 12px, colour var(--ink-2), centered, padding 0 20px, margin-top 16px, margin-bottom 20px.

**Note on the Google "G" icon:** The Google "G" icon must use Google's official brand colours and cannot be replaced with a monochrome Lucide icon. The Developer should inline the standard Google "G" SVG. This is the only exception to the Lucide-only icon rule in this spec and is required by Google's identity guidelines.

**Note on option button layout:** The icon is left-aligned within the button with fixed left padding (16px from button edge). The label is centered in the remaining space. This is not a flex-centered layout - it is an offset-label pattern that gives the button visual balance. Reference: this is the same pattern used in many native mobile OAuth screens and will feel familiar to users.

**Active states:** Both option buttons use `opacity: 0.75` on `:active` / tap. No background colour change - the tap highlight must be subtle.

**CSS classes:**

```css
.account-link-option-btn {
  display: flex;
  align-items: center;
  width: calc(100% - 32px);
  margin: 0 16px;
  height: 48px;
  padding: 0 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  gap: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.account-link-option-btn:active {
  opacity: 0.75;
}

.account-link-option-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.account-link-option-label {
  flex: 1;
  text-align: center;
  padding-right: 18px; /* optical centre compensation for the icon on the left */
}
```

**Dark mode:** `var(--surface)` becomes #1F1F1F, border uses `rgba(255,255,255,0.08)`. The Google "G" SVG retains its original colours - do not invert in dark mode, as Google colours are brand-mandated.

**Copywriter annotation - screen 1:**

**String 3 - Sheet headline:**
1-2 short words or a very short phrase that frames this as protection, not sign-up. This is the first thing the user reads. Must not contain "account", "sign up", "register", or "create". Maximum 30 characters.

**String 4 - Sheet body copy:**
1-2 sentences. Must communicate: link Google or email to keep data safe across devices. No alarm. No urgency. Maximum 80 characters total. This copy must pass the spec test: does it sound like data protection or does it sound like registration? It must sound like data protection.

**String 5 - Google button label:**
Short. "Continue with Google" is industry-standard and likely correct. Confirm with Editor.

**String 6 - Email button label:**
Short. "Continue with email" or "Use email address". Confirm with Editor.

**String 7 - Privacy notice (below buttons):**
Very short. Must communicate: no marketing, data stored safely. Maximum 60 characters. Low visual weight.

---

### Screen 2a - Google Confirmation and Loading

This screen appears after the user taps the Google button. It is a brief intermediate state while the Google OAuth popup is triggered.

**Layout:**

1. Drag handle
2. Back arrow - Lucide `arrow-left` at 20px, 44x44px tap target, top-left, colour var(--ink-2). Returns to screen 1.
3. Headline - 18px/700/var(--ink)
4. Body copy - 14px/400/var(--ink-2)
5. "Continue with Google" CTA button - primary style, 48px height, border-radius 12px, background var(--brand), text white, font 15px/600. Full width minus 32px margin. Google "G" icon left-aligned within button (white/transparent version for dark background).
6. Loading state: when the OAuth popup is triggered, the CTA button changes to a loading spinner (Lucide `loader` animating at 16px, white, centred in the button). The button remains 48px height and becomes non-interactive.

**Error state for Google (inline, below CTA):**

If the Firebase `linkWithCredential()` call fails after OAuth completes, show an inline error row below the CTA button.

Error row: 12px/400/var(--red), left-aligned, padding 8px 0, preceded by Lucide `alert-circle` at 14px/var(--red).

**Three error variants:**
- Network failure: explains no connection, suggests retry
- Account already linked to another user: explains conflict, offers a link to "sign in instead" (which will be a Phase 4 data merge feature - for Phase 3 launch, "sign in instead" should navigate to a simple message that explains the conflict and suggests using a different Google account)
- Generic / unexpected error: plain "Something went wrong" + retry instruction

**CTA CSS:**

```css
.account-link-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 32px);
  margin: 0 16px;
  height: 48px;
  background: var(--brand);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  gap: 10px;
  -webkit-tap-highlight-color: transparent;
}

.account-link-cta:active {
  opacity: 0.85;
}

.account-link-cta:disabled {
  opacity: 0.6;
  pointer-events: none;
}

.account-link-error-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 16px 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--red);
  line-height: 1.4;
}
```

**Copywriter annotation - screen 2a:**

**String 8 - Screen headline:**
Short. Confirms what is about to happen. Maximum 30 characters.

**String 9 - Screen body copy:**
1 sentence. Explains what linking with Google means (data protection). Maximum 60 characters.

**String 10 - Google CTA label:**
"Continue with Google" (same as option button or slight variation).

**String 11 - Error: network failure:**
Plain English. What went wrong. What to do. Maximum 50 characters.

**String 12 - Error: account already in use:**
Plain English. Explains a different Google account is already used. Includes a "use a different account" or "sign in instead" link label. Two strings: paragraph + link label.

**String 13 - Error: generic:**
Plain English fallback. Maximum 50 characters.

---

### Screen 2b - Email Form

This screen appears after the user taps the email button from screen 1. It replaces the sheet content with an email and password form.

**Layout (top to bottom):**

1. Drag handle
2. Back arrow - top-left, returns to screen 1
3. Headline - 18px/700/var(--ink)
4. Body copy - 14px/400/var(--ink-2), maximum 2 lines
5. Email input label - 13px/600/var(--ink), margin-bottom 4px
6. Email input field - 48px height, border-radius 10px, border 1px solid var(--border), background var(--surface), padding 0 14px, font 15px/400/var(--ink), placeholder var(--ink-2)
7. Email error slot - 12px/400/var(--red), hidden until error, height 0 when hidden (animate to natural height on show). Left-aligned under input.
8. Vertical gap: 12px
9. Password input label - 13px/600/var(--ink), margin-bottom 4px
10. Password input field - same as email field. Right-side: show/hide toggle button (Lucide `eye` or `eye-off`, 16px, var(--ink-2), 44x44px tap target inside the field boundary using absolute positioning).
11. Password error slot - same pattern as email error slot
12. "Forgot your password?" link - 13px/400/var(--brand), left-aligned under password field, margin-top 8px, 44px minimum tap target height (padding above and below the text to achieve this)
13. Vertical gap: flexible, minimum 16px
14. Submit CTA button - same style as the Google CTA (`.account-link-cta`), full width minus 32px margin, 48px height

**Input focus state:** On focus, the border of the active input changes from `var(--border)` to `var(--brand)` (1px solid var(--brand)). This is the only focus indicator change needed - do not add a glow or shadow.

**Input error state:** When an error is present for an input, the input border changes to `var(--red)` (1px solid var(--red)) and the error slot below it reveals the error message.

**Submit loading state:** Same as screen 2a - CTA shows spinner, becomes non-interactive.

**Dark mode inputs:** Background remains `var(--surface)` (#1F1F1F in dark mode). Text is `var(--ink)` (#F4F2EE). Placeholder is `var(--ink-2)` (#8A8A8A). Focus border `var(--brand)` (#5C7A63 in dark mode). All handled by token inheritance - no additional dark mode rules needed.

**CSS classes (additions to what is already defined above):**

```css
.account-link-input-group {
  padding: 0 16px;
  margin-bottom: 0;
}

.account-link-input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
}

.account-link-input {
  display: block;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 400;
  color: var(--ink);
  -webkit-appearance: none;
  box-sizing: border-box;
}

.account-link-input:focus {
  outline: none;
  border-color: var(--brand);
}

.account-link-input--error {
  border-color: var(--red);
}

.account-link-input-wrapper {
  position: relative;
}

.account-link-pw-toggle {
  position: absolute;
  right: 0;
  top: 0;
  width: 44px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--ink-2);
  cursor: pointer;
}

.account-link-field-error {
  font-size: 12px;
  font-weight: 400;
  color: var(--red);
  padding: 4px 0 0;
  min-height: 0;
  overflow: hidden;
  transition: max-height 150ms ease;
}

.account-link-field-error:empty {
  max-height: 0;
}

.account-link-forgot-pw {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: var(--brand);
  padding: 10px 16px;
  min-height: 44px;
  line-height: 1.4;
}
```

**Error states - email form:**

Four distinct error conditions must be handled:

**E1 - Network failure:** The submit CTA becomes available again. An error row appears below the CTA button (not attached to a specific field). Text communicates connection failure and suggests retrying. Colour var(--red). Icon Lucide `wifi-off` at 14px.

**E2 - Email already in use (Firebase `auth/email-already-in-use`):** Error appears under the email field only (`.account-link-field-error` for the email group). Email input border turns var(--red). The error text must explain that this email is linked to a different account and include a tappable "Sign in instead" link in var(--brand). For Phase 3 launch, "Sign in instead" navigates to a simple message screen (within the same sheet) that explains the user should use a different email or contact support. Full account merge is Phase 4.

**E3 - Invalid credentials (Firebase `auth/wrong-password` or `auth/invalid-email`):** Generic "Incorrect email or password" error - do not distinguish between wrong email and wrong password to avoid email enumeration. Error appears under the password field. Both fields keep their values (do not clear on error).

**E4 - Weak password (Firebase `auth/weak-password`):** Error appears under the password field. Text explains the password does not meet minimum requirements and gives a brief hint (at minimum 6 characters).

---

### Screen 3 - Password Reset

Opened by tapping "Forgot your password?" from screen 2b.

**Layout:**

1. Drag handle
2. Back arrow - returns to screen 2b (email form). Does not clear the email field in screen 2b.
3. Headline - 18px/700/var(--ink)
4. Body copy - 14px/400/var(--ink-2), explains what will happen (a link will be sent to the email address)
5. Email input - same as screen 2b input style. Pre-filled with whatever the user typed in screen 2b. Editable.
6. Email error slot - same pattern
7. "Send reset link" CTA button - same style as `.account-link-cta`, 48px height

**Sent confirmation state:**

After a successful `sendPasswordResetEmail()` call, replace the entire sheet content with a confirmation screen:

1. Drag handle
2. Icon: Lucide `mail-check` at 32px, colour var(--brand), centered
3. Headline - 18px/700/var(--ink), centered
4. Body copy - 14px/400/var(--ink-2), centered, 2 lines maximum. Must explain: check inbox, may take a moment, check spam folder.
5. "Back to sign in" link - 13px/400/var(--brand), centered, 44px minimum tap target. Returns to screen 2b.

**Error state:** Network failure only. Same pattern as E1 above - inline error below the CTA.

**Copywriter annotation - screen 3:**

**String 14 - Screen headline:**
Short. Communicates this is for recovering access. Maximum 25 characters.

**String 15 - Body copy:**
1 sentence. Explains a reset link will be sent. Maximum 60 characters.

**String 16 - CTA label:**
Short. "Send reset link" is recommended but confirm with Editor.

**String 17 - Confirmation headline:**
2-4 words. Reassuring. Maximum 20 characters.

**String 18 - Confirmation body copy:**
1-2 sentences. Check inbox, check spam. Maximum 80 characters.

**String 19 - "Back to sign in" link label:**
Short. No more than 4 words.

---

### Navigation and transitions summary

| Action | Result |
|--------|--------|
| Tap reminder row (Me tab) | Sheet opens, screen 1 shown. `history.pushState()` called once. |
| Tap Google button | Transition to screen 2a |
| Tap email button | Transition to screen 2b (sheet height animates taller) |
| Tap back arrow (screen 2a or 2b) | Transition back to screen 1 |
| Tap back arrow (screen 3) | Transition back to screen 2b |
| Tap close button (X) | Sheet dismisses. No state change. Reminder remains visible. |
| Drag down past 100px threshold | Sheet dismisses. Same as close. |
| Hardware back button | Sheet dismisses via `popstate` handler (existing pattern). |
| Successful Google link | Sheet closes. Me tab re-renders. Reminder replaced by status element. |
| Successful email link | Sheet closes. Me tab re-renders. Reminder replaced by status element. |
| Confirmation screen "Back to sign in" | Transition to screen 2b |

**Screen transitions:** 150ms cross-fade on the inner content. Sheet height animates 200ms ease when changing from screen 1 to screen 2b (taller). All other transitions are instant (swapping content, not height changes).

---

## Section 3 - New CSS Custom Property Required

The reminder row and account status element use an existing token set throughout. No new tokens are strictly required for the spec as written. However, a `--brand-tint` token is recommended for future use (e.g. success states, positive confirmation backgrounds) and can be introduced with Phase 3:

```css
:root {
  --brand-tint: rgba(59, 92, 42, 0.06);
}

body.night {
  --brand-tint: rgba(92, 122, 99, 0.12);
}
```

This token is not used by the components in this spec (which use `var(--surface)` with the left border treatment). It is defined here as a future-proofing recommendation only. The Developer should add it to the token block (lines 37-49 in current `sniffout-v2.html`) if approved by the owner.

---

## Section 4 - Post-linking Account Status Element (Design Task 3)

### Purpose

Once the user successfully links an account, the data reminder row is replaced by an account status row in the same position. This element confirms the link, reassures the user, and provides a path to manage their credentials.

### Component anatomy

The status element occupies the same position and approximate dimensions as the pre-linked reminder row. It uses the same `.data-reminder-row` base layout pattern.

```
+--[3px brand border]------------------------------------+
|  [check icon 18px]  [Headline 13px/600]        [>14px] |
|                     [Body copy 13px/400]                 |
+--------------------------------------------------------+
```

**Key differences from the pre-linked state:**

**Icon:** Lucide `shield-check` at 18px, colour var(--brand). The filled check within the shield signals completion and safety. This replaces the plain `shield` icon.

**Left border:** Same 3px solid var(--brand). No change needed - the colour still communicates Sniffout brand identity without implying urgency.

**Text content:** See Copywriter annotation below.

**Chevron:** Present. Tapping opens an account management sheet (scope detailed in Section 4.1 below).

**No dismiss state:** This element is persistent. Once visible, it remains until the user changes their auth state or deletes their account.

### Variants by provider

**Variant A - Linked to Google:**
- Headline: Communicates data is backed up via Google
- Body copy: The Google account email address (truncated if longer than ~35 characters with ellipsis: `longname...@gmail.com`)

**Variant B - Linked to email:**
- Headline: Communicates data is backed up via email
- Body copy: The linked email address (same truncation rule)

### CSS

The status element reuses the `.data-reminder-row` class with a modifier:

```css
.data-reminder-row--linked {
  /* No structural changes - all visual differences come from icon and copy swap */
  /* The border and background remain identical to the pre-linked state */
}
```

No additional CSS is needed. The component is structurally identical to the pre-linked state - only the icon and text content change.

### Dark mode

No additional overrides needed. All tokens apply correctly in dark mode as documented in Section 1.

### 4.1 - Account Management Sheet

When a linked user taps the status element, a bottom sheet opens with account management options. This sheet is out of scope for Phase 3 launch if it adds significant development complexity. A minimum viable version for Phase 3 launch:

**Minimum viable - Phase 3 launch:**
- Sheet headline: account management label
- Linked provider display (read-only): icon + provider name + email address
- "Unlink account" option (destructive, var(--red) text, with a confirmation step)
- Close button

**Not in scope for Phase 3 launch:**
- Change email
- Change password (direct from this sheet - password reset via email is sufficient)
- Add a second provider
- View last sign-in date

The Developer should build the minimum viable version. Full account management can be expanded in Phase 3+ post-launch.

### Copywriter annotation - post-linked status

**String 20 - Status headline (Google variant):**
Short. Communicates data is backed up and safe. Mentions Google. Maximum 35 characters.

**String 21 - Status headline (email variant):**
Short. Same intent. Mentions email. Maximum 35 characters.

**String 22 - Account management sheet headline:**
2-3 words. Maximum 20 characters.

**String 23 - Unlink option label:**
Short. Must communicate this removes the link (not deletes data). Maximum 25 characters.

**String 24 - Unlink confirmation:**
1 sentence. Explains what unlinking means (data stays in app but is no longer backed up). Includes confirm and cancel actions. Maximum 60 characters for the warning text.

---

## Section 5 - Copywriter Brief Summary

All strings requiring copy pipeline:

| String | Location | What it must communicate | Budget |
|--------|----------|--------------------------|--------|
| 1 | Reminder headline | Data is on this device only | ~40 chars |
| 2 | Reminder body | Tap to keep it safe | ~50 chars |
| 3 | Sheet headline (screen 1) | Data protection, not sign-up | ~30 chars |
| 4 | Sheet body (screen 1) | Link Google or email for cross-device safety | ~80 chars |
| 5 | Google button label | Tap to continue with Google | ~25 chars |
| 6 | Email button label | Tap to continue with email | ~25 chars |
| 7 | Privacy notice | No marketing, stored safely | ~60 chars |
| 8 | Google confirm headline | What is about to happen | ~30 chars |
| 9 | Google confirm body | Data protection meaning | ~60 chars |
| 10 | Google CTA | Action label | ~25 chars |
| 11 | Error: network failure | Problem + what to do | ~50 chars |
| 12 | Error: account in use | Conflict explanation + "use different account" link label | ~80 chars + link |
| 13 | Error: generic | Fallback | ~50 chars |
| 14 | Password reset headline | Recovering access | ~25 chars |
| 15 | Password reset body | Link will be sent | ~60 chars |
| 16 | Password reset CTA | Action label | ~20 chars |
| 17 | Reset sent headline | Confirmation | ~20 chars |
| 18 | Reset sent body | Check inbox, check spam | ~80 chars |
| 19 | Back to sign in link | Navigation label | ~20 chars |
| 20 | Status headline (Google) | Backed up via Google | ~35 chars |
| 21 | Status headline (email) | Backed up via email | ~35 chars |
| 22 | Account management headline | Label for management sheet | ~20 chars |
| 23 | Unlink label | Remove link (not delete data) | ~25 chars |
| 24 | Unlink confirmation | What unlinking means | ~60 chars |

**Copy rules for all strings in this feature:**
- No em dashes or en dashes - hyphens only
- No "sign up", "register", "create an account" framing
- No "free", "no sign-up", "no login" per CLAUDE.md rules (exception: Copywriter may use "create a free account" if needed to address cost concerns - flag to Editor for approval)
- No paw emoji (reserved for paw safety block only)
- Framing throughout is data protection, not onboarding

---

## Section 6 - Implementation Notes for Developer

These are design-intent notes to accompany the Developer brief. They are not implementation instructions - the Developer brief will specify those.

**Sheet ID conventions:** Use `account-link-sheet` and `account-link-backdrop` as element IDs, consistent with the existing `cond-tag-sheet` / `cond-tag-backdrop` pattern.

**Screen state management:** A single variable (e.g. `_accountLinkScreen`) controls which screen is rendered in the sheet. Do not create separate HTML elements for each screen - render the correct content into `account-link-sheet-inner` using a function, same pattern as `renderCondTagSheet()`.

**Keyboard handling on iOS:** For the email form screen, the sheet must not be obscured by the software keyboard. Test on device (or simulator) to confirm that `position: fixed` or `position: sticky` behaviour on the sheet does not conflict with `visualViewport` resize events on iOS Safari.

**Auth state listener:** The transition from reminder to status element should be driven by the Firebase `onAuthStateChanged` listener, not by a one-time check. If the auth state changes while the Me tab is open (e.g. the user links their account and the sheet closes), `renderMeTab()` should re-run automatically to swap the elements.

**The `isLinked()` helper:** A boolean helper `isLinked()` should return `!firebase.auth().currentUser.isAnonymous` (or equivalent with the compat SDK). Both the reminder and the status element render conditionally on this value.

**Error state cleanup:** When the user corrects a field and retries, the error state for that field must clear immediately on input (not wait for the next submit). Add an `input` event listener to each field that removes the error state for that field only.

**Screen 2b - form validation:** Client-side validation before submit: email must be non-empty and contain `@` + domain, password must be at least 6 characters. Show client-side errors using the same error slot pattern as server-side errors. Do not submit if validation fails.
