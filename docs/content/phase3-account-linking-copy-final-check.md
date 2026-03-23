# Phase 3 Account Linking - Final Editor Check
**Date:** 23 March 2026
**Editor:** Claude Code (Editor agent)
**Status:** Final check complete - two revisions required before Developer brief
**Source:** `docs/content/phase3-account-linking-copy.md` (second pass)
**Previous review:** `docs/content/phase3-account-linking-copy-editor-review.md`

---

## Strings A-H - Final check

---

**String A - "Protect your data"**

**APPROVED**

17 characters - within the 30-character budget. "Protect" is active and data protection-led without being alarming. No prohibited words ("account", "sign up", "register", "create" are all absent). The step from the reminder row ("Your data is saved on this device only") to the sheet headline ("Protect your data") is coherent - both use "your data" language and the active framing of "Protect" is appropriate for a screen where the user has already chosen to act.

---

**String B - "Link Google or email and your walks will be safe across any device."**

**REVISED**

```
Link Google or email and your walks and data will be safe across any device.
```

Rationale: The specific check required by the brief is whether "your walks" should be "your walks and data" for consistency with the revised 1a headline. It should. The reminder row headline was deliberately broadened to "your data" to cover walk journal, dog profile, photos, and saved places - not just walks. If Screen 1's body copy narrows back to "your walks," a user who read the reminder as being about all their information may feel the flow is talking about something narrower than what they were protecting. "Your walks and data will be safe" is the correct reading: walks are called out as the anchor, "and data" captures the rest. This phrasing is also consistent with the consolidated toast (7a: "Your walks and data are now backed up"), establishing the phrase as a feature-level convention.

Revised character count: 75 characters - within the 80-character budget.

The string is also distinct enough from the Google-specific line (4b: "Connect your Google account and your walk journal, dog profile, photos, and saved places will be available on any device") and the email-specific line (5b: "Set a password and your data will be safe across any device, even if you switch phones"). String B is broader and higher-level than both - correct for a method-agnostic intro screen.

---

**String C - "Continue with email"**

**APPROVED**

19 characters - within the 25-character budget. Perfect parallel to "Continue with Google" (4c). "Continue" is neutral and familiar. No prohibited framing. This is the correct choice - "Use email" (an alternative) lacks the forward momentum of "Continue with" and breaks the pattern set by the Google button.

---

**String D - "No marketing emails. Your data stays private."**

**APPROVED**

45 characters - within the 60-character budget. Two concrete facts: no marketing contact and data handled with care. "Stays private" is warmer than "stored securely" - it signals intent rather than process, which is the right register for a low-visual-weight notice below two option buttons.

Note: "No marketing emails" addresses the most common account-creation anxiety (inbox spam) without claiming to cover all marketing channels. This is appropriately specific. "Your data stays private" does not imply data never leaves the device - in context the user understands data is moving to the cloud, and "private" correctly means "not shared with third parties." No change needed.

---

**String E - "Something went wrong. Try again."**

**APPROVED**

32 characters - within the 50-character budget. Industry-standard catch-all. Does not overclaim a cause ("network" or "connection" would be inaccurate for Firebase errors like `auth/too-many-requests` or `auth/operation-not-allowed`). "Try again" is the correct next step for transient failures. Two short sentences land better than one longer compound sentence for an error state.

---

**String F - "Your account"**

**APPROVED**

12 characters - within the 20-character budget. Standard management sheet label. The Copywriter's note is correct: "account" is prohibited in the context of "create an account" framing, not as a descriptive label for a settings-adjacent management view. "Your account" is neutral, immediately understood, and appropriate. "Account details" (an alternative) is wordier with no benefit.

---

**String G - "Remove backup"**

**APPROVED**

13 characters - within the 25-character budget. This is the strongest of the new strings. "Remove backup" shifts the mental model from "I'm removing my credentials/account" to "I'm removing the protection layer" - the data itself is not implied to be at risk. On mobile, users understand that removing a backup does not delete the original. "Remove" is deliberate without being alarming. "Unlink" (the obvious alternative) carries stronger connotations of severing a relationship, which could feel more permanent. "Disconnect" has the same problem. "Remove backup" is well-chosen.

One small note for the Designer: this label appears in `var(--red)` per the design spec. The confirm button (H) mirrors this label, so the user sees "Remove backup" in red twice before completing the action. This is the correct UX pattern for a consequential but reversible destructive action.

---

**String H - Warning paragraph, confirm button, cancel button**

Warning paragraph original:
```
Your data stays here. You can link again at any time.
```

**REVISED - warning paragraph only**

```
Your data stays here. No backup until you link again.
```

Rationale: The design spec (Section 4.1, String 24 brief) explicitly requires the warning to communicate that data is "no longer backed up" after unlinking. The original string communicates "data stays" and "action is reversible," but does not explicitly state that backup stops. A user reading the original could reasonably conclude: "great, my data stays AND I can link again - what is actually changing?" The revised version adds "No backup until you link again" which states the consequence directly (backup stops) while retaining the reversibility signal ("until you link again"). Both requirements are now explicitly met.

Character count: 53 characters - within the 60-character budget.

"No backup" is appropriately terse for a consequence that is consequential but not catastrophic. It parallels "Remove backup" (String G) which anchors the whole interaction.

**Confirm button: "Remove backup"**

**APPROVED**

Mirrors String G exactly. The user sees the same two words as the option label, then again on the confirm button. This double-exposure is intentional and correct for a destructive confirmation.

**Cancel button: "Cancel"**

**APPROVED**

Standard. The safe path always uses the conventional label.

---

## Consistency check

Four observations from reviewing the full document for "your walks" vs "your walks and data" alignment:

**1. 1b - "Link an account to keep your walks and dog profile safe if you switch phones or clear your browser."**

Acceptable as written. The reminder body deliberately specifies "walks and dog profile" (the two things most users will be most upset to lose) rather than the abstract "data." This is a different register from 1a - the headline summarises broadly ("your data"), the supporting line gets specific. No change needed.

**2. 9b - "We haven't been able to back up all your data. Connect to Wi-Fi and reopen the app to try again. Your walks are still saved on this device."**

The third sentence uses "your walks" narrowly. In this context, "walks" as an emotional anchor in the reassurance sentence is a deliberate choice - it names the thing the user most fears losing. This is acceptable. "Your data is still saved on this device" would also be correct and arguably more accurate, but "your walks" is warmer in a failure state where the user needs reassurance. Acceptable as written.

**3. 4a - "Back up your walks"**

"Walks" as shorthand in this four-word headline was approved in the first Editor review and the rationale still holds. The supporting line (4b) immediately follows with the full list. No change needed.

**4. String B - "Link Google or email and your walks will be safe across any device."**

Revised above. The only instance in the new strings where the inconsistency required a change.

---

**One additional observation - string 5k**

The Copywriter simplified 5k from the Editor's suggested revision "Password is too short. Use at least 6 characters." to just "Use at least 6 characters."

This deviation from the Editor's suggested version is acceptable. "Use at least 6 characters" appears inline directly under the password field the user has just filled - the context makes "Password is too short." redundant. Shorter is better for a field-level error. The revised version in the copy document is approved as written.

---

## Overall sign-off

The copy document is ready for the Developer brief to be issued subject to the following:

**Two revisions required in the copy document before the Developer brief:**

1. String B updated to: "Link Google or email and your walks and data will be safe across any device."
2. String H warning paragraph updated to: "Your data stays here. No backup until you link again."

**One item still pending Developer confirmation:**

Q3 - String 6g (password reset email not found error): held pending Developer confirmation of Firebase `sendPasswordResetEmail()` behaviour for unregistered emails. Developer to advise before this string is finalised. All other strings are independent of this decision and the Developer brief can proceed without it - string 6g can be resolved as a follow-up action.

**Once the two revisions above are applied to the copy document, all 8 new strings (A-H) are approved and the document is ready for the Developer brief.**
