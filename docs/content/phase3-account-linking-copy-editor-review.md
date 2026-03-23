# Phase 3 Account Linking - Editor Review
**Date:** 23 March 2026
**Editor:** Claude Code (Editor agent)
**Status:** Editor review complete - requires Copywriter follow-up pass before Developer brief
**Source:** `docs/content/phase3-account-linking-copy.md`
**Reference documents read:** `docs/specs/firebase-phase3-migration-spec.md`, `docs/specs/phase3-account-linking-design-spec.md`, `docs/content/copywriter-personas.md`, `docs/handoffs/session-handoff-march-23.md`, `CLAUDE.md`

---

## Known corrections applied

Before the string-by-string review, the three known corrections have been applied directly as instructed:

**Correction 1 - String 4b:** Updated to include walk journal and photos. Tightened from the spec's suggested version. See 4b entry below.

**Correction 2 - Items 7 and 8:** Item 8 (migration complete toast) removed. Item 7 updated to "Your walks and data are now backed up." Note for Developer: this single toast fires for both the first sync completion and the migration complete scenario.

**Correction 3 - Item 12:** Incognito notice (12a and 12b) removed from the document. Note for Copywriter: incognito mode risk will be covered in a "why might I lose my data?" FAQ entry. FAQ copy is out of scope for this document.

---

## Overall quality assessment

The Copywriter has done solid work. The voice is consistent throughout - clear, warm, practical. The data protection framing holds across every string. No rule violations found (no em dashes, no en dashes, no prohibited phrases, no paw emoji). The most significant issue is a structural gap: the method selection screen (Screen 1 in the design spec) has no copy written for it. This is not a minor omission - it is the first screen the user sees when they tap the reminder row. See the gaps section at the end of this review.

---

## String-by-string review

---

### 1. Persistent Reminder Element (pre-linked state)

---

**1a. Headline**

Original:
```
Your walks are on this device only
```

**REVISED**

```
Your data is saved on this device only
```

Rationale: The design spec (Section 1, Copywriter annotation) requires the headline to communicate that the walk log AND dog profile are on this device only. "Your walks" covers only one data type. "Your data" is inclusive of everything (walk journal, dog profile, saved places) and fits within the 40-character budget (39 characters). "saved" adds a small amount of warmth without slowing the line down. The supporting line (1b) adds specificity for users who need it.

---

**1b. Supporting line**

Original:
```
Link an account to keep your walks and dog profile safe if you switch phones or clear your browser.
```

**APPROVED** - with a note.

This is good. "Link an account" avoids registration framing. The risk scenarios (switch phones, clear browser) are specific and real without being alarmist. "Keep your walks and dog profile safe" is the right level of specificity for a supporting line.

Note to Copywriter: The spec also lists photos and saved places as data the user might lose. The current supporting line does not mention them. Given the headline now says "your data" (broad), the supporting line's specific call-out of "walks and dog profile" is appropriate - it names the things the user cares most about. No change needed unless the Designer requests the full list.

---

**1c. CTA label**

Original:
```
Keep my data safe
```

**QUERY - for Designer to confirm**

"Keep my data safe" is well-written - first person, action-oriented, no registration framing. However, the design spec (Section 1) specifies that the entire reminder row is the tap target, with a right-side chevron. There is no separate CTA button on this element. If the Designer confirms no CTA button exists, this string is not needed and can be archived. If the Designer adds a CTA button in implementation, this string is approved as written.

---

### 2. Account Status Element (post-linked, Google)

---

**2a. Status line**

```
Backed up to Google
```

**APPROVED**

Three words. Calm. Does exactly what it needs to do. Consistent with the post-linked data vocabulary used throughout.

---

**2b. Manage link label**

```
Manage
```

**APPROVED**

Standard, unambiguous. Correct for a settings-adjacent row.

---

### 3. Account Status Element (post-linked, email)

---

**3a. Status line**

```
Backed up to [email@address.com]
```

**APPROVED** - with Developer note retained.

Parallel structure to 2a is correct. Developer interpolation note is appropriate. Fallback to "Backed up to your email" is well-chosen.

---

**3b. Manage link label**

```
Manage
```

**APPROVED**

Consistent with 2b.

---

### 4. Account Linking Flow - Google

Note for Developer: Section 4 of this copy document covers the Google-specific confirmation screen (Screen 2a in the design spec). It does not cover the method selection screen (Screen 1). See gaps section at the end of this review.

---

**4a. Screen headline**

Original:
```
Back up your walks
```

**APPROVED** - with a note.

Four words (the string inventory lists this as three - minor inventory error). Action-oriented, benefit-led. Appropriately differentiated from the email flow headline (5a). "Walks" is narrower than the full data set but in this context it functions as a shorthand for everything the user values about Sniffout. The supporting line (4b) lists the full scope.

Note: word count in the string inventory at the bottom of the copy document is incorrect for this string (says 3, should be 4). Copywriter to correct the inventory.

---

**4b. Supporting line**

Original:
```
Connect your Google account and your walks, dog profile, and saved places will be available on any device.
```

Known correction applied. Updated version:

**REVISED (known correction applied and tightened)**

```
Connect your Google account and your walk journal, dog profile, photos, and saved places will be available on any device.
```

Tightening note: The spec's suggested version is clear and correct. Minor trim considered ("Connect Google and..." instead of "Connect your Google account and...") but rejected - "your Google account" is warmer and clearer for users who may have multiple Google accounts. The list of four items (walk journal, dog profile, photos, saved places) flows naturally with the Oxford comma. No further tightening needed.

---

**4c. Button label**

```
Continue with Google
```

**APPROVED**

Confirmed. "Continue with Google" is consistent with Google's OAuth branding conventions and avoids "sign in" framing. "Link with Google" was the alternative - rejected correctly, as "link" could suggest technical account merging rather than a simple association. "Continue with Google" is the industry standard for this pattern and will feel familiar to users.

Open question resolved - see Section: Open question resolutions.

---

**4d. Error state - network failure**

```
No connection. Check your internet and try again.
```

**APPROVED** - with a note on parallelism.

Direct and actionable. "Check your internet" is accessible and not condescending.

Note: This string says "Check your internet" while the email flow network error (5h) says "Check your connection." Both are functionally correct but inconsistent for the same root cause. Since both flows belong to the same feature, a user who sees one is unlikely to see the other - so the inconsistency is invisible at runtime. However, for code quality and future maintenance, parallelism is preferable. If the Developer or PO prefers consistency, the recommended unified version is: "No connection. Check your connection and try again." for both 4d and 5h. PO to decide.

---

**4e. Error state - account already in use**

```
This Google account is already linked to a different Sniffout profile. Try signing in with it instead.
```

**APPROVED**

"Try signing in" refers to authentication, not registration - acceptable use. "A different Sniffout profile" is clear and accurate. The suggestion to sign in instead is the correct Phase 3 action (Phase 4 handles the data merge). 16 words is appropriate for an error that requires explanation.

---

### 5. Account Linking Flow - Email

Note for Developer: Section 5 covers the email form screen (Screen 2b in the design spec). The email button label on Screen 1 (method selection) is a separate string not yet written - see gaps section.

---

**5a. Screen headline**

```
Link your email
```

**APPROVED**

Three words. Direct. No registration framing. Appropriately different from the Google flow headline.

---

**5b. Supporting line**

```
Set a password and your data will be safe across any device, even if you switch phones.
```

**APPROVED**

"Set a password" is the right framing - it describes an action, not account creation. "Even if you switch phones" is warm and specific. Shorter than the Google supporting line, which is appropriate: users who have already chosen the email path need less persuasion and more instruction.

---

**5c. Email field label**

```
Email address
```

**APPROVED**

Standard. Correct.

---

**5d. Email field placeholder**

```
you@example.com
```

**APPROVED**

Industry standard example format. Helpful without being prescriptive.

---

**5e. Password field label**

```
Password
```

**APPROVED** - with a note.

"Password" is clean and standard. The design spec suggested "Create a password" as an alternative to signal this is a new credential rather than an existing one. "Password" works in context because the screen headline ("Link your email") and the placeholder (5f) already establish that a new password is being set. No change needed.

---

**5f. Password field placeholder**

```
At least 6 characters
```

**APPROVED**

Practical expectation-setting. Disappears once typing begins. Correct minimum for Firebase email auth.

---

**5g. Submit button label**

```
Link account
```

**APPROVED**

Two words. Matches the feature vocabulary throughout. No prohibited framing.

---

**5h. Error state - network failure**

```
Something went wrong. Check your connection and try again.
```

**APPROVED** - with the same parallelism note as 4d.

"Something went wrong" is slightly softer than "No connection." - the Copywriter's rationale (more user effort warrants a softer error) is reasonable. However, see the note on 4d above. PO to decide on parallelism.

---

**5i. Error state - email already in use**

```
This email is already linked to a different Sniffout profile. Try signing in with it instead, or use a different email.
```

**APPROVED**

Parallel structure with 4e (Google conflict error) is correct and intentional. Offering two paths (sign in or use different email) is more helpful than a single path in this context. 18 words is acceptable for an error requiring a decision.

---

**5j. Error state - invalid credentials**

```
That doesn't look like a valid email address. Check it and try again.
```

**APPROVED** - with Developer note retained and clarified.

This string is correctly written for the `auth/invalid-email` Firebase error code (invalid email format). It is friendly, specific, and keeps the user moving.

Developer note retained from Copywriter, with clarification: In this email LINKING flow (new credential creation), there is no scenario where a user enters a "wrong password" for an existing account - passwords are created, not verified. The `auth/invalid-email` error is therefore the primary "invalid credentials" scenario. However, if the Developer implements a re-authentication step elsewhere (for example, the "Delete all my data" flow requires recent authentication for linked accounts per Section 6 of the migration spec), a separate wrong-password string will be needed at that point. This string covers the linking flow only.

---

**5k. Error state - weak password**

Original:
```
Password is too short. Try at least 6 characters.
```

**REVISED**

```
Password is too short. Use at least 6 characters.
```

Rationale: "Try at least 6 characters" is slightly odd - "try" suggests the minimum is a suggestion rather than a requirement. "Use at least 6 characters" is direct and accurate. One word change.

---

### 6. Password Reset Flow

---

**6a. Screen headline**

```
Reset your password
```

**APPROVED**

Direct. Does the job. Three words.

---

**6b. Supporting line**

```
Enter your email and we'll send a link to reset your password.
```

**APPROVED**

Sets expectations accurately. "We'll" is warm and active - consistent with the first-person voice used in the rest of the feature. 12 words is appropriate.

---

**6c. Email field label**

```
Email address
```

**APPROVED**

Consistent with 5c.

---

**6d. Email field placeholder**

```
you@example.com
```

**APPROVED**

Consistent with 5d.

---

**6e. Submit button label**

```
Send reset link
```

**APPROVED**

Describes exactly what the button does. Three words. No ambiguity.

---

**6f. Confirmation message (email sent)**

Original:
```
Check your inbox. We've sent a reset link to [email]. It may take a few minutes.
```

**REVISED**

```
Check your inbox. We've sent a reset link to [email]. It may take a few minutes - check your spam folder if you don't see it.
```

Rationale: The design spec (String 18 in the design spec's string table) explicitly requires the confirmation to mention checking the spam folder. This is also standard best practice - reset emails frequently land in spam. The addition is 10 words, but they address a real friction point that prevents users from submitting the form multiple times. The hyphen connects the timing note to the practical tip cleanly. Developer interpolation note from original is retained.

---

**6g. Error state - email not found**

Original:
```
We don't recognise that email. Check the address or try a different one.
```

**QUERY - Security concern for Developer and PO**

The copy itself is well written. "We don't recognise" is warmer than "not found". Two clear paths offered.

However, there is a security consideration: showing a distinct "email not found" error confirms to a malicious actor whether or not a given email address has a Sniffout account. This is known as email enumeration and is considered a vulnerability.

Firebase's `sendPasswordResetEmail()` function sends an email only if the address is registered, but by default does not throw an error for unregistered addresses in some configurations. The recommended pattern is to always show the success confirmation (6f) regardless of whether the email is registered.

Developer to advise: Does the app's Firebase configuration return an error for unregistered emails on `sendPasswordResetEmail()`? If not, this error string may never fire, and the always-success pattern is more secure. If it does fire, this string should be replaced with a generic version such as "Check your inbox. If that email is linked to Sniffout, we've sent a reset link." - which provides confirmation without confirming account existence.

This is a Developer and PO decision before this string is finalised.

---

### 7. Sync and Migration Toast

Known correction applied: Items 7 and 8 consolidated into a single toast.

**7a. Toast message (consolidated - applies to both first sync and migration complete)**

```
Your walks and data are now backed up.
```

**APPROVED** - with a note.

Applied as per known correction. This fires once only: on the first app load after all five migration flags are set.

Note: "walks and data" is slightly redundant (walks are data), but it is warmer and more specific than "Your data is now backed up" alone. "Walks" is the thing users care about most; "data" captures everything else. The pairing works as UX copy even if it is not technically precise. If the PO wants a tighter version: "Your walks are now backed up." is cleaner and also approved. PO to decide.

Note for Developer: String 8 (migration complete toast) has been removed per owner instruction. This single string covers both scenarios.

---

**[Item 8 removed - see known corrections]**

---

### 9. Migration Failure Notice (3 Attempts Failed)

---

**9a. Headline**

```
Some data hasn't backed up yet
```

**APPROVED**

Six words. Non-alarming. "Hasn't" is appropriately casual and implies a temporary state. Good.

---

**9b. Body**

Original:
```
Sniffout hasn't been able to back up all your data. Connect to Wi-Fi and reopen the app to try again. Your walks are still saved on this device.
```

**REVISED**

```
We haven't been able to back up all your data. Connect to Wi-Fi and reopen the app to try again. Your walks are still saved on this device.
```

Rationale: Using "Sniffout" in the third person is inconsistent with the first-person "we" voice used throughout this feature (see 6b: "we'll send a link"). The copy document uses "we" comfortably and "Sniffout" in third person in a body string reads as slightly corporate and detached. "We haven't been able to" is warmer and consistent with the established voice. All other words retained unchanged.

---

### 10. "Delete All My Data" Confirmation Warning

---

**10a. Headline**

```
Delete everything?
```

**APPROVED**

Two words. The question mark creates a deliberate pause. "Everything" communicates the full scope without listing it. Good.

---

**10b. Body**

Original:
```
This will permanently delete your walk journal, dog profile, saved walks, reviews, and saved places. This cannot be undone.
```

**REVISED**

```
This will permanently delete your walk journal, dog profile, photos, saved walks, reviews, and saved places. This cannot be undone.
```

Rationale: The migration spec (Section 6) includes Firebase Storage photo deletion as a step in the full delete sequence. Walk photos are not part of the walk journal documents - they are stored separately in Firebase Storage. A user who has added photos to their walk log entries should know those photos will also be deleted. "Photos" added to the list. The addition is one word and does not disrupt the rhythm of the sentence.

"This cannot be undone" is retained. Explicit, necessary.

---

**10c. Confirm button label**

```
Delete everything
```

**APPROVED**

Mirrors the headline correctly. The repetition is intentional - the user must mentally confirm the action by reading the same words twice.

---

**10d. Cancel button label**

```
Cancel
```

**APPROVED**

Standard. Correct. The safe option should always use the conventional label.

---

### 11. Deletion Confirmed Screen

---

**11a. Headline**

```
Done
```

**APPROVED**

Single word. Calm. The restraint is correct here - this is not a moment for warmth or consolation, just a clean confirmation that the action completed.

---

**11b. Body**

```
Your data has been deleted. Sniffout has been reset. Start fresh whenever you're ready.
```

**APPROVED**

Three clean sentences. The structure is right: what happened, what it means for the app, and a forward-looking close. "Start fresh whenever you're ready" is genuinely good copy - it acknowledges that this may have been a considered decision without overplaying it. No change needed.

Note: This is the one place in this document where using "Sniffout" in the third person is appropriate - it refers to the app state, not to an action the product is performing. The distinction is correct.

---

**[Item 12 removed - see known corrections]**

---

## Open question resolutions

**1. "Free" question**

Confirmed: the approach is sufficient. "Link an account" and "Connect your Google account" language makes clear that no payment is involved - users understand account association is free by default. "Link" implies connecting something that already exists (a Google account), not purchasing access. "Set a password" for the email path does not suggest a cost. No string in this document needs "create a free account" added. The exception is available per spec but is not needed here.

**2. "Continue with Google" button label (4c)**

Confirmed: "Continue with Google" is the correct choice. It aligns with Google's OAuth button conventions, avoids "sign in" framing, and feels natural within Sniffout's brand voice. "Link with Google" would have implied a technical operation and risked sounding unfamiliar. Approved.

**3. Invalid credentials interpretation (5j)**

Confirmed for the linking flow: string 5j is correctly written for the email format error (`auth/invalid-email`). In the account creation path, there is no "wrong password" scenario. However, a separate wrong-password string is likely needed for re-authentication in the deletion flow (Section 6 of the migration spec). This is flagged to the Developer as a gap to address at that point, not within this document's scope.

**4. Toast overlap**

Resolved via known correction. Items 7 and 8 consolidated into one toast. See item 7a above.

**5. Incognito notice**

Resolved via known correction. Items 12a and 12b removed from this document. FAQ copy is out of scope.

---

## Summary of REVISED strings

| String | Change | Reason |
|--------|--------|--------|
| 1a | "Your walks are on this device only" - changed to "Your data is saved on this device only" | Design spec requires headline to cover walk log and dog profile; "data" is inclusive and within character budget |
| 4b | Updated to include walk journal and photos; minor tightening | Known correction applied |
| 5k | "Try at least 6 characters" - changed to "Use at least 6 characters" | "Try" implies suggestion; "Use" is accurate |
| 6f | Added "- check your spam folder if you don't see it" | Design spec requires spam folder mention; standard best practice |
| 9b | "Sniffout hasn't" - changed to "We haven't" | Consistency with first-person voice used elsewhere in the feature |
| 10b | Added "photos" to the list | Migration spec includes Firebase Storage photo deletion; users should know photos are deleted |

---

## Summary of QUERY items requiring PO or Developer decision

**Q1 - String 1c (CTA label)**
Is this string needed? The design spec specifies the whole reminder row as the tap target with a chevron - no separate CTA button. Designer to confirm whether a CTA button label is required on this element. String is approved as written if a button is added.

**Q2 - Network error parallelism (4d and 5h)**
4d says "Check your internet" and 5h says "Check your connection" - inconsistent phrasing for the same root cause. Both are functionally correct. PO to decide: require parallelism (use "Check your connection and try again" for both), or accept the intentional variation as the Copywriter intended.

**Q3 - String 6g (email not found security concern)**
Recommended to Developer and PO: showing a distinct "email not found" error enables email enumeration. Firebase may not surface this error in all configurations. Developer to confirm whether `sendPasswordResetEmail()` throws an error for unregistered emails in the app's Firebase setup. If it does not, this string may be unused. If it does, consider replacing with an always-success pattern or a generic version that does not confirm account existence. String held pending this decision.

**Q4 - String 7a (toast wording)**
"Your walks and data are now backed up." is applied per known correction. If the PO prefers a tighter version without the redundancy, "Your walks are now backed up." is also approved.

---

## Missing strings - Copywriter follow-up required before Developer brief

### Gap 1 - Strings 22, 23, 24 (flagged in review brief)

The following strings from the design spec (Section 5) were not included in the Copywriter's document. These cannot be written by the Editor. A Copywriter follow-up pass is required before the Developer brief for account management can be issued.

**String 22 - Account management sheet headline**
- 2-3 words, maximum 20 characters
- Label for the sheet that opens when a linked user taps "Manage" on the status element
- Brief from design spec: label for a management sheet containing linked provider display and unlink option

**String 23 - Unlink option label**
- Maximum 25 characters
- Must communicate: this removes the link between credentials and the account
- Must NOT suggest data deletion - unlinking does not delete data, it only means data is no longer backed up

**String 24 - Unlink confirmation warning text**
- Maximum 60 characters for the warning paragraph
- Must explain: what unlinking means (data stays in the app but is no longer protected across devices), that the user's data will not be deleted
- Includes two action labels: confirm and cancel (these are additional strings within this item)

---

### Gap 2 - Additional missing strings discovered during review

The review brief flagged strings 22-24 as the known gap. During review against the design spec's full string table, the following additional gaps were found. These were not included in the Copywriter's document and are not covered by any existing string. A Copywriter pass is required to cover these before the feature can be fully implemented.

**Missing: Screen 1 method selection headline (design spec String 3)**
- This is the headline on the first screen the user sees when they tap the reminder row
- The screen shows two buttons: Google and Email
- Design spec requires: 1-2 short words or a phrase, maximum 30 characters, must not contain "account", "sign up", "register", or "create"
- The Copywriter's document jumps from the reminder element (Section 1) directly to the Google-specific confirmation screen (Section 4) without covering Screen 1

**Missing: Screen 1 method selection body copy (design spec String 4)**
- 1-2 sentences on the method selection screen beneath the headline
- Must communicate: linking Google or email keeps data safe across devices
- Distinct from the Google-specific supporting line (4b) and email-specific supporting line (5b)

**Missing: Email option button label on Screen 1 (design spec String 6)**
- The label on the "use email" button on the method selection screen
- Equivalent of "Continue with Google" (4c) for the email path
- Note: string 5a "Link your email" is the EMAIL FORM screen headline (Screen 2b), not the button label on Screen 1

**Missing: Privacy notice on Screen 1 (design spec String 7)**
- Short notice below both option buttons on the method selection screen
- Design spec brief: must communicate no marketing, data stored safely, maximum 60 characters
- Low visual weight - this is a reassurance notice, not a legal disclaimer

**Missing: Generic fallback error state (design spec String 13)**
- Displayed when the Firebase error is unexpected or does not map to a specific known error
- Plain English fallback, maximum 50 characters
- Note: 4e covers the "account already in use" error and 4d covers network failure - String 13 is a catch-all for anything else

---

## Correction to string inventory

The string inventory at the bottom of the copy document lists string 4a ("Back up your walks") as 3 words. The correct count is 4 words. Copywriter to correct.

---

## Final status

The copy document is approved with revisions as noted above. It cannot be passed to the Developer until:

1. All REVISED strings are updated in the master copy document
2. QUERY items Q1, Q2, Q3, and Q4 are resolved by the PO or Developer
3. Copywriter follow-up pass covers Gap 1 (strings 22-24) and Gap 2 (Screen 1 headline, body, email button label, privacy notice, generic error) - 8 strings in total
4. String inventory is corrected

Once the above are complete, Editor should do a final check on the new strings before the Developer brief is issued.
