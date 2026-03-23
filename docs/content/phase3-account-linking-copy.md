# Phase 3 Account Linking and Data Reminder - Copy

> **Date:** 2026-03-23
> **Author:** Copywriter
> **Status:** Final - Editor-approved. Ready for Developer brief. Q3 (string 6g) pending Developer confirmation as non-blocking follow-up.
> **Based on:** `docs/specs/firebase-phase3-migration-spec.md` (Section 3, Appendix), `docs/specs/phase3-account-linking-design-spec.md` (Section 5), `docs/content/phase3-account-linking-copy-editor-review.md`
> **Scope:** Product UI copy only. Not walk description copy. No persona voice.

---

## Pending Developer confirmation

**Q3 - String 6g (email not found error):** The Editor flagged that showing a distinct "email not found" error for password reset enables email enumeration. Developer to confirm whether `sendPasswordResetEmail()` throws a distinct error for unregistered emails in the app's Firebase setup. If Firebase handles this gracefully (always returns success regardless), string 6g may be unused. If it does surface the error, consider replacing with a generic always-success pattern. String 6g is held pending this confirmation.

---

## Notes on approach

**Voice:** Sniffout brand voice throughout - clear, warm, occasionally dry. Treats the user as an adult. Gets to the point. No gushing.

**Framing:** All copy frames account linking as data protection, not registration. "Link an account" not "sign up". "Keep your data safe" not "create an account".

**The "free" question:** The word "free" does not appear in any of these strings. "Link an account" and "connect" language implies the user is associating an existing account (Google) or creating credentials - not paying. Editor confirmed this approach is sufficient. No string in this document needs "create a free account" added.

**Em/en dashes:** Not used anywhere. Hyphens only throughout.

**Paw emoji:** Not used. Not relevant to this feature.

---

## 1. Persistent Reminder Element (pre-linked state)

This element is always visible in the Me tab until the user links an account. Copy is designed to be calm and practical, not alarmist.

---

**1a. Headline**

```
Your data is saved on this device only
```

*Communicates that walk log and dog profile are both on this device only. "Your data" is inclusive of everything (walk journal, dog profile, saved places). "Saved" adds warmth without slowing the line down. 39 characters - within the 40-character budget in the design spec.*

---

**1b. Supporting line**

```
Link an account to keep your walks and dog profile safe if you switch phones or clear your browser.
```

*One sentence. "Link an account" avoids registration framing. Risk scenarios (switch phones, clear browser) are specific and real without being alarmist. The headline now says "your data" (broad); the supporting line names the things the user cares most about.*

---

**1c. [ARCHIVED - no CTA button on reminder row]**

*The entire reminder row is the tap target with a right chevron. No separate CTA button is needed. String "Keep my data safe" is archived. If the Designer adds a CTA button in a later iteration, the string can be reinstated.*

---

## 2. Account Status Element (post-linked, Google)

Replaces the reminder element after the user links a Google account. Should feel like a positive confirmation, not a settings row.

---

**2a. Status line**

```
Backed up to Google
```

*Short. Reassuring. No need to elaborate - the user took the action and the outcome is clear.*

---

**2b. Manage link label**

```
Manage
```

*Single word. Neutral. Standard for this type of settings row.*

---

## 3. Account Status Element (post-linked, email)

---

**3a. Status line**

```
Backed up to [email@address.com]
```

**Developer note:** Interpolate the user's linked email address. If the email address cannot be displayed, fall back to: "Backed up to your email"

---

**3b. Manage link label**

```
Manage
```

---

## 4. Account Linking Flow - Google

A focused screen within the bottom sheet. Single tap to confirm, then native Google account picker launches.

---

**4a. Screen headline**

```
Back up your walks
```

*Four words. Action-oriented, benefit-led. "Walks" functions as shorthand for everything the user values about Sniffout. The supporting line (4b) lists the full scope.*

---

**4b. Supporting line**

```
Connect your Google account and your walk journal, dog profile, photos, and saved places will be available on any device.
```

*"Connect" feels lower-stakes than "link" or "merge". Lists all four data types the user cares about. "Your Google account" is warmer than "Google" alone - clearer for users who may have multiple accounts.*

---

**4c. Button label**

```
Continue with Google
```

*Consistent with Google's OAuth branding conventions. Avoids "sign in" framing. Confirmed by Editor.*

---

**4d. Error state - network failure**

```
Check your connection and try again.
```

*Direct. Actionable. Parallel to the email network error (5h).*

---

**4e. Error state - account already in use**

```
This Google account is already linked to a different Sniffout profile. Try signing in with it instead.
```

*Explains the specific problem without technical jargon. Offers a next step. Does not describe the data merge complexity (Phase 4) - just redirects the user to sign in.*

---

## 5. Account Linking Flow - Email

A form-based screen within the bottom sheet. Email address, password creation, submission.

---

**5a. Screen headline**

```
Link your email
```

*Different headline to the Google flow. Direct. Does not say "create an account".*

---

**5b. Supporting line**

```
Set a password and your data will be safe across any device, even if you switch phones.
```

*"Set a password" describes an action, not account creation. Shorter than the Google supporting line - users who have chosen the email path need less persuasion and more instruction.*

---

**5c. Email field label**

```
Email address
```

---

**5d. Email field placeholder**

```
you@example.com
```

---

**5e. Password field label**

```
Password
```

---

**5f. Password field placeholder**

```
At least 6 characters
```

*Sets expectation on minimum length. Disappears when the user starts typing.*

---

**5g. Submit button label**

```
Link account
```

*Clear. Matches the feature's language throughout. Does not say "create", "register", or "sign up".*

---

**5h. Error state - network failure**

```
Check your connection and try again.
```

*Parallel to the Google network error (4d).*

---

**5i. Error state - email already in use**

```
This email is already linked to a different Sniffout profile. Try signing in with it instead, or use a different email.
```

*Parallel structure to the Google conflict error (4e). Offers two paths: sign in, or use a different email.*

---

**5j. Error state - invalid credentials**

```
That doesn't look like a valid email address. Check it and try again.
```

*Written for the `auth/invalid-email` Firebase error code (invalid email format). Friendly, not accusatory.*

**Developer note:** In this email linking flow (new credential creation), there is no wrong-password scenario. `auth/invalid-email` is the primary "invalid credentials" case here. If a re-authentication step is added elsewhere (e.g. the deletion flow in Section 6 of the migration spec), a separate wrong-password string will be needed at that point - out of scope for this document.*

---

**5k. Error state - weak password**

```
Use at least 6 characters
```

*Direct. Accurate. States the requirement without prefacing it.*

---

## 6. Password Reset Flow

---

**6a. Screen headline**

```
Reset your password
```

*Direct. Three words.*

---

**6b. Supporting line**

```
Enter your email and we'll send a link to reset your password.
```

*Sets expectations. "We'll" is warm and active.*

---

**6c. Email field label**

```
Email address
```

---

**6d. Email field placeholder**

```
you@example.com
```

---

**6e. Submit button label**

```
Send reset link
```

*Describes exactly what the button does.*

---

**6f. Confirmation message (email sent)**

```
Check your inbox. We've sent a reset link to [email]. It may take a few minutes - check your spam folder if you don't see it.
```

**Developer note:** Interpolate the submitted email address where [email] appears. If the email cannot be displayed, fall back to: "Check your inbox. We've sent you a reset link. It may take a few minutes - check your spam folder if you don't see it."

*Includes spam folder note per design spec requirement (String 18). Addresses the friction point that prevents users from submitting the form multiple times.*

---

**6g. Error state - email not found [HELD]**

```
We don't recognise that email. Check the address or try a different one.
```

**Status: held pending Developer confirmation.** See "Pending Developer confirmation" section at the top of this document. If Firebase's `sendPasswordResetEmail()` does not surface a distinct error for unregistered emails, this string may never fire and should be replaced with an always-success pattern.

---

## 7. Sync and Migration Toast

*Item 8 (migration complete toast) has been removed and consolidated into this single toast. This string fires once only: on the first app load after all five migration flags are set. It covers both the first sync completion and the historical migration complete scenario.*

---

**7a. Toast message**

```
Your walks and data are now backed up.
```

*"Walks and data" is warmer and more specific than "Your data" alone. "Walks" is what users care about most; "data" captures everything else. Fires once per installation, never again. Disappears automatically after approximately 3 seconds.*

**Note for PO:** If a tighter version is preferred without the slight redundancy, "Your walks are now backed up." is also approved. PO to decide.

---

## 9. Migration Failure Notice (3 Attempts Failed)

Shown in the Me tab as a non-blocking notice after three failed migration attempts across three separate app loads. Safety net only - most users will not see this.

---

**9a. Headline**

```
Some data hasn't backed up yet
```

*Non-alarming. "Hasn't" implies a temporary state. Avoids "lost" or "failed" language.*

---

**9b. Body**

```
We haven't been able to back up all your data. Connect to Wi-Fi and reopen the app to try again. Your walks are still saved on this device.
```

*"We" is consistent with the first-person voice used throughout this feature. Three sentences: what happened, what to do, reassurance that data is not gone. The third sentence is the most important.*

---

## 10. "Delete All My Data" Confirmation Warning

Shown after the user taps "Delete all my data" in Settings. A deliberate confirmation step before any deletion begins.

---

**10a. Headline**

```
Delete everything?
```

*The question mark creates a deliberate pause. "Everything" communicates the full scope.*

---

**10b. Body**

```
This will permanently delete your walk journal, dog profile, photos, saved walks, reviews, and saved places. This cannot be undone.
```

*Lists all data types including photos (which are stored separately in Firebase Storage and are deleted as part of the full delete sequence per migration spec Section 6). "Permanently" and "cannot be undone" appear explicitly.*

---

**10c. Confirm button label**

```
Delete everything
```

*Mirrors the headline. The repetition is intentional - the user must consciously register the action twice.*

---

**10d. Cancel button label**

```
Cancel
```

*Standard. The safe option uses the conventional label.*

---

## 11. Deletion Confirmed Screen

Shown after the full delete sequence completes. App resets to State A.

---

**11a. Headline**

```
Done
```

*Single word. Calm. Confirms completion without drama.*

---

**11b. Body**

```
Your data has been deleted. Sniffout has been reset. Start fresh whenever you're ready.
```

*Three sentences: what happened, what it means for the app, and a forward-looking close. "Start fresh whenever you're ready" acknowledges this may have been a considered decision without overplaying it.*

---

---

## Missing Strings - New (Part 2)

*Strings A-H were identified as missing during the Editor review. All approved by Editor final check (23 March 2026). B and H warning revised per final check.*

---

**Missing String A - Screen 1 method selection headline**

This is the headline on the first screen the user sees when they tap the reminder row. The screen shows two options: Google and email.

```
Protect your data
```

*17 characters - within the 30-character budget. "Protect" is active and frames this as security, not registration. Contains no prohibited words. Treats this as a safety action, not an onboarding step.*

---

**Missing String B - Screen 1 method selection body copy**

Beneath the Screen 1 headline. General intro before the user has chosen a path - distinct from the Google-specific line (4b) and email-specific line (5b).

```
Link Google or email and your walks and data will be safe across any device.
```

*75 characters - within the 80-character budget. Does not assume which path the user will take. "Link" is the data protection action. "Your walks and data" is consistent with the revised 1a headline ("your data") and toast 7a ("your walks and data are now backed up"). Does not repeat the headline.*

---

**Missing String C - Email option button label on Screen 1**

The label on the email button on the method selection screen. Parallel to "Continue with Google" (4c).

```
Continue with email
```

*19 characters - within the 25-character budget. Parallel structure to the Google button. "Continue" is neutral and familiar. Does not say "sign up" or "create account".*

---

**Missing String D - Privacy notice on Screen 1**

Short notice below both option buttons. Low visual weight - reassurance only, not a legal disclaimer.

```
No marketing emails. Your data stays private.
```

*45 characters - within the 60-character budget. Two concrete facts: no marketing contact, and data is handled with care. "Stays private" is warmer than "stored securely" and signals intent rather than process.*

---

**Missing String E - Generic fallback error state**

Displayed when the Firebase error is unexpected and does not map to a specific known error state. Catch-all for anything not covered by 4d (network), 4e (account in use), or 5j-5k (form errors).

```
Something went wrong. Try again.
```

*32 characters - within the 50-character budget. Acknowledges the problem without alarm. Gives a clear next step. "Something went wrong" is the recognised pattern for unexpected errors and will feel familiar. Does not name a specific cause (which would be inaccurate for a catch-all).*

---

**Missing String F - Account management sheet headline**

Label for the sheet that opens when a linked user taps "Manage" on the status element.

```
Your account
```

*12 characters - within the 20-character budget. Two words. Standard label for this type of settings management sheet. "Account" is appropriate in a management context (the prohibition in String A is against "create an account" framing, not the word itself in a descriptive label).*

---

**Missing String G - Unlink option label**

The tappable option in the account management sheet that removes the credential link. Destructive action (displayed in var(--red) per design spec). Must not suggest data deletion.

```
Remove backup
```

*13 characters - within the 25-character budget. "Remove" is deliberate without being alarming. "Backup" names what is being removed (the backup protection), not the data itself. A user reading this understands they are removing the protection mechanism, not deleting their walks. Does not say "delete", "unlink", or "disconnect" - all of which carry stronger data-loss connotations.*

---

**Missing String H - Unlink confirmation warning**

Warning shown before the unlink completes. Must communicate that data stays in the app, backup will stop, and the action is reversible.

**Warning paragraph (max 60 characters):**

```
Your data stays here. No backup until you link again.
```

*53 characters - within the 60-character budget. "Your data stays here" is the most important message - directly addresses the fear of data loss. "No backup until you link again" states the consequence explicitly (backup stops) while retaining the reversibility signal ("until you link again"). Both requirements from the design spec are now explicitly met. Parallels "Remove backup" (String G) which anchors the whole interaction.*

**Confirm button label:**

```
Remove backup
```

*Mirrors String G (the option label). The user sees the same words twice - once to trigger the confirmation, once to confirm. Consistent pairing.*

**Cancel button label:**

```
Cancel
```

*Standard. The safe option always uses the conventional label.*

---

## String inventory (updated)

| # | String | Status | Word count |
|---|--------|--------|-----------|
| 1a | Reminder headline | Revised | 7 |
| 1b | Reminder supporting line | Approved | 19 |
| 1c | Reminder CTA | Archived - not needed | - |
| 2a | Google status line | Approved | 3 |
| 2b | Google manage link | Approved | 1 |
| 3a | Email status line | Approved | variable |
| 3b | Email manage link | Approved | 1 |
| 4a | Google flow headline | Approved | 4 |
| 4b | Google supporting line | Revised | 21 |
| 4c | Google button | Approved | 3 |
| 4d | Google network error | Revised | 6 |
| 4e | Google conflict error | Approved | 16 |
| 5a | Email flow headline | Approved | 3 |
| 5b | Email supporting line | Approved | 15 |
| 5c | Email field label | Approved | 2 |
| 5d | Email placeholder | Approved | 1 |
| 5e | Password field label | Approved | 1 |
| 5f | Password placeholder | Approved | 3 |
| 5g | Email submit button | Approved | 2 |
| 5h | Email network error | Revised | 6 |
| 5i | Email conflict error | Approved | 18 |
| 5j | Invalid credentials error | Approved | 12 |
| 5k | Weak password error | Revised | 4 |
| 6a | Password reset headline | Approved | 3 |
| 6b | Password reset supporting line | Approved | 12 |
| 6c | Reset email label | Approved | 2 |
| 6d | Reset email placeholder | Approved | 1 |
| 6e | Reset submit button | Approved | 3 |
| 6f | Reset confirmation | Revised | 21 (plus email address) |
| 6g | Reset email not found error | Held - Developer confirmation needed | 13 |
| 7a | Sync and migration toast (consolidated) | Revised | 7 |
| 8a | Migration complete toast | Removed - consolidated into 7a | - |
| 9a | Failure notice headline | Approved | 6 |
| 9b | Failure notice body | Revised | 25 |
| 10a | Delete confirmation headline | Approved | 2 |
| 10b | Delete confirmation body | Revised | 23 |
| 10c | Delete confirm button | Approved | 2 |
| 10d | Delete cancel button | Approved | 1 |
| 11a | Deletion confirmed headline | Approved | 1 |
| 11b | Deletion confirmed body | Approved | 16 |
| 12a | Incognito notice headline | Removed - out of scope (FAQ) | - |
| 12b | Incognito notice body | Removed - out of scope (FAQ) | - |
| A | Screen 1 method selection headline | Approved | 3 |
| B | Screen 1 method selection body | Revised | 13 |
| C | Email option button label (Screen 1) | Approved | 3 |
| D | Privacy notice (Screen 1) | Approved | 7 |
| E | Generic fallback error | Approved | 5 |
| F | Account management sheet headline | Approved | 2 |
| G | Unlink option label | Approved | 2 |
| H (warning) | Unlink confirmation warning | Revised | 9 |
| H (confirm) | Unlink confirm button | Approved | 2 |
| H (cancel) | Unlink cancel button | Approved | 1 |

---

## Open questions (resolved by Editor)

1. **"Free" question** - Resolved. "Link an account" and "connect" language is sufficient. No string needs "create a free account" added.

2. **"Continue with Google" button label (4c)** - Resolved. "Continue with Google" confirmed as correct choice. Aligns with Google's OAuth conventions and avoids "sign in" framing.

3. **Invalid credentials interpretation (5j)** - Resolved for linking flow. Written for `auth/invalid-email`. A separate wrong-password string may be needed for the re-authentication step in the deletion flow - to be addressed at that point, out of scope here.

4. **Toast overlap (items 7 and 8)** - Resolved. Items 7 and 8 consolidated into a single toast (7a). String 8a removed.

5. **Incognito notice (items 12a and 12b)** - Resolved. Removed from this document. Incognito risk will be covered in a "why might I lose my data?" FAQ entry. FAQ copy is out of scope for this document.

6. **Network error parallelism (4d and 5h)** - Resolved in this pass. Both strings now read "Check your connection and try again." Inconsistency resolved.
