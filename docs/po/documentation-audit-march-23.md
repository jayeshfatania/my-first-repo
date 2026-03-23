# Sniffout - Documentation Audit
**Date:** 23 March 2026
**Prepared by:** Product Owner agent
**Source of truth:** `docs/handoffs/session-handoff-march-23.md`
**Scope:** All files under `docs/` and its subfolders

---

## Summary

This audit covers every document in the `docs/` directory. Issues are categorised as: stale information, resolved items still marked open, missing information, incorrect blocker classification, or deprecated references. A total of **47 issues** were found across **14 documents**.

---

## 1. `docs/po/pre-launch-checklist.md`

**Last updated:** 2026-03-18

### Issue 1.1 - Stale: T1 listed as blocker in hard blockers summary

- **Section:** "Hard Blockers - Do Not Launch Until Resolved" (item 1)
- **Currently says:** "T1 - Google Places API key is hardcoded. Move to serverless proxy."
- **Should say:** T1 is resolved. It should be removed from the blockers list or marked as resolved.
- **Source:** Handoff Section 9 pre-launch blockers table - "T1 - API key exposed: Resolved 19 March 2026"

### Issue 1.2 - Stale: T14 listed as blocker in hard blockers summary

- **Section:** "Hard Blockers - Do Not Launch Until Resolved" (item 5)
- **Currently says:** "T14 - `index.html` redirect must point to v2 before v2 goes live."
- **Should say:** T14 is resolved. It should be removed from the blockers list or marked as resolved.
- **Source:** Handoff Section 9 pre-launch blockers table - "T14 - manifest start_url wrong: Resolved 19 March 2026"

### Issue 1.3 - Stale: T4 references wrong brand colour in theme_color

- **Section:** T4 row, Notes column
- **Currently says:** "`theme_color` matches `#1E4D3A`"
- **Should say:** "`theme_color` matches `#3B5C2A`" (Meadow Green - the confirmed brand colour)
- **Source:** Handoff Section 2 tech stack - "Brand colour: `#3B5C2A` (Meadow Green) - fully implemented throughout"; Section 6 brand colour decision

### Issue 1.4 - Stale: D2 describes dark mode as automatic based on weather

- **Section:** D2 row, Notes column
- **Currently says:** "Dark mode is triggered automatically by weather `isDay` flag - not a user toggle. Test all five tabs, all card types, all modal/panel states, all empty and error states in dark mode."
- **Should say:** Dark mode is user-controlled via Settings ("Auto" option uses `prefers-color-scheme`). The `renderWeather()` dark mode bug was fixed 22 March 2026. Dark mode is never automatic based on the weather `isDay` flag.
- **Source:** Handoff Section 6 - "`renderWeather()` must never touch dark mode" decision; CLAUDE.md design principles

### Issue 1.5 - Stale: D8 references wrong brand colour

- **Section:** D8 row, Notes column
- **Currently says:** "Brand colour `#1E4D3A`, background `#F7F5F0`, Inter typography only."
- **Should say:** "Brand colour `#3B5C2A`, background `#F7F5F0`, Inter typography only."
- **Source:** Handoff Section 6 brand colour decision - "`#3B5C2A` (Meadow Green) is fully implemented. No references to `#1E4D3A` should remain anywhere."

### Issue 1.6 - Stale: B2 status - sniffout.co.uk listed as "Not started"

- **Section:** B2 row
- **Currently says:** Status "Not started" with Notes "Defensive registration to prevent brand squatting. Redirect `sniffout.co.uk` -> `sniffout.app`."
- **Should say:** The domain `sniffout.co.uk` is registered but not yet redirecting. Status should reflect that registration exists but redirect setup is a pre-launch task.
- **Source:** Handoff Section 2 Live URLs table - "`https://sniffout.co.uk`: Registered but not yet redirecting - Should point to `sniffout.app` - not yet set up (pre-launch checklist item B2)."

### Issue 1.7 - Stale: B3 references wrong brand colour

- **Section:** B3 row, Notes column
- **Currently says:** "Brand colour `#1E4D3A` confirmed."
- **Should say:** "Brand colour `#3B5C2A` (Meadow Green) confirmed."
- **Source:** Handoff Section 6 brand colour decision

### Issue 1.8 - Missing: L5 T&C consent screen not listed as a blocker

- **Section:** "Hard Blockers - Do Not Launch Until Resolved" list and legal section
- **Currently says:** L5 (T&C consent screen) is listed under legal with status "Not started" but is not included in the hard blockers summary list at the bottom of the document.
- **Should say:** L5 should appear in the hard blockers list. It is a confirmed hard go-live blocker - users must actively accept Terms of Service before using the app.
- **Source:** Handoff Section 9 pre-launch blockers table - "L5 - T&C consent screen: Not started - Hard go-live blocker."

### Issue 1.9 - Stale: L5 description is incorrect

- **Section:** L5 row
- **Currently says:** "Cookie policy - determine if applicable" (this is actually labelled L5 in the document but the content describes a cookie policy decision, not the T&C consent screen).
- **Should say:** L5 should describe the T&C consent screen: a hard go-live blocker requiring users to actively accept Terms of Service before using the app. Depends on L3 (ToS copy from solicitor). Developer work required once ToS copy is ready.
- **Source:** Handoff Section 9 pre-launch blockers table - "L5 - T&C consent screen: Not started - Hard go-live blocker. Depends on L3 (ToS). Developer work required once ToS copy is ready."

### Issue 1.10 - Missing: H10 OS Maps API key not listed as a checklist item

- **Section:** Technical section
- **Currently says:** No entry for OS Maps API key security.
- **Should say:** Should include an item for the OS Maps API key currently hardcoded in page source - deferred to dedicated pre-launch security review (referenced as H10 in `docs/ux-reviews/ux-review-march-22.md`).
- **Source:** Handoff Section 2 tech stack - "OS Maps API key: currently hardcoded in page source. This is a known pre-launch security item (H10 in `docs/ux-reviews/ux-review-march-22.md`) - deferred to a dedicated pre-launch security review."

---

## 2. `docs/po/po-action-plan-round24.md`

### Issue 2.1 - Stale: Content pipeline status table shows Batch 02 and 03 awaiting Developer

- **Section:** "Content Pipeline - Current State" table
- **Currently says:** "Batch 02: In WALKS_DB: Awaiting Developer update" and "Batch 03: In WALKS_DB: Awaiting Developer update"
- **Should say:** All batches are complete and in the app. Walk count is 100.
- **Source:** Handoff Section 7 walk database count - "Walks in `sniffout-v2.html` (WALKS_DB): 100 - Live in app. Batches 01-03 all complete."

### Issue 2.2 - Stale: Walk count references 86 throughout

- **Section:** "Additional fixes - 20 March 2026" and "Content Pipeline" note
- **Currently says:** "Walk count is now **86** including Isabella." and "Note: Isabella Plantation was added individually in Round 33. Walk count is now **86** including Isabella."
- **Should say:** Walk count is 100. All three batches are in the app.
- **Source:** Handoff Section 7 - "Walks in `sniffout-v2.html` (WALKS_DB): 100 - Live in app."

### Issue 2.3 - Stale: "Next Up" section item 1 still refers to Batch 02+03 content update

- **Section:** "Next Up - Upcoming work - priority order", item 1
- **Currently says:** "Batch 02 + 03 content update - 40 walks validated and ready. Issue combined Developer brief."
- **Should say:** This item is complete. All 40 walks have been added to the app.
- **Source:** Handoff Section 7 batch status - all batches marked Developer complete and in app.

### Issue 2.4 - Stale: Phase 3 order does not include push notifications as item 2

- **Section:** "Phase 3 (priority order - confirmed)"
- **Currently says:** Phase 3 order: 1. Firebase backend, 2. Missing Dog alerts, 3. User-submitted walks, 4. Community ratings, 5. Push notifications.
- **Should say:** Per the confirmed and updated Phase 3 priority order: 1. Firebase full migration, 2. Push notifications, 3. Report an issue, 4. Missing Dog alerts, 5. User-submitted walks, 6. Community ratings, 7. Push notifications follow-up types.
- **Source:** Handoff Section 9 Phase 3 priority order.

### Issue 2.5 - Stale: Dark mode card surfaces listed as `#243A2C`

- **Section:** "Key Decisions on Record" table, "Dark mode card surfaces" row
- **Currently says:** "Raised to `#243A2C` in dark mode."
- **Should say:** Dark mode Scheme B (Dark Slate) is confirmed and implemented. Surface colour is `#1F1F1F`, not `#243A2C`. The forest-green surface values are superseded.
- **Source:** Handoff Section 6 dark mode decision - "Dark Slate palette is live. Tokens documented in CLAUDE.md." and CLAUDE.md dark mode token table showing `--surface: #1F1F1F`.

### Issue 2.6 - Stale: "In development" note about tappable temperature feature

- **Section:** "In development - 20 March 2026"
- **Currently says:** "Tappable temperature hero on Weather tab - Developer implementing per `temperature-tap-spec.md`."
- **Should say:** This feature was implemented and subsequently superseded. Per the handoff, `temperature-tap-spec.md` is superseded - do not re-implement.
- **Source:** Handoff Section 6 - "Hourly forecast bar and Walk Window - both live on Weather tab... Tappable temperature spec (`docs/specs/temperature-tap-spec.md`) is superseded - do not re-implement."

### Issue 2.7 - Stale: Walk image count says "83 walks still need real photos"

- **Section:** "Next Up" item 8
- **Currently says:** "Walk image sourcing - 83 walks still need real photos."
- **Should say:** 97 walks still need real photos (total is 100, not 83, and 3 have real photos).
- **Source:** Handoff Section 7 walk photos table - "Walks using illustrated placeholder: 97."

### Issue 2.8 - Stale: Logo rebuild listed as pending

- **Section:** "Next Up" item 14
- **Currently says:** "Logo rebuild - owner creating in Illustrator. Required exports: [list]..."
- **Should say:** Logo rebuild is complete. All icon files are in the repo and wired up. No further Developer action needed unless the owner creates new Illustrator exports.
- **Source:** Handoff Section 6 - "Logo rebuild - complete."

### Issue 2.9 - Stale: "State A first-run screen redesign" listed as upcoming

- **Section:** "Next Up" item 4
- **Currently says:** "State A first-run screen redesign - Designer pass needed."
- **Should say:** State A redesign was implemented on 20 March 2026.
- **Source:** Handoff Section 5 key milestones - "State A redesign" listed as completed, and `docs/specs/state-a-redesign-spec.md` listed as "Implemented 20 March 2026."

### Issue 2.10 - Stale: Dark mode colour rethink listed as upcoming

- **Section:** "Next Up" item 5
- **Currently says:** "Dark mode colour rethink - Today tab mint/sage tones clash with the broader dark mode palette. Requires Designer spec before Developer implements."
- **Should say:** Dark mode Scheme B is live and implemented. This item is complete.
- **Source:** Handoff Section 6 - "Dark mode Scheme B - confirmed and implemented. Dark Slate palette is live."

---

## 3. `docs/po/copy-review.md`

### Issue 3.1 - Stale: Section 5 (em dashes) instructs Developer to use em dashes

- **Section:** "PO Pushbacks - Applied in This Revision", item 5
- **Currently says:** "All dashes in copy strings should be em dashes (--), not hyphens (-) or en dashes (-). Developer to do a search-and-replace pass when implementing."
- **Should say:** The opposite is now the confirmed rule. No em dashes or en dashes anywhere - hyphens only. This was swept from all user-facing copy in FIX 29.4.
- **Source:** Handoff Section 6 - "Em dashes: Swept from all user-facing copy in FIX 29.4. Hyphens only throughout the app." CLAUDE.md instructions also confirm hyphens only.

### Issue 3.2 - Stale: Social proof strip approved copy is outdated

- **Section:** Section 3, "Social proof strip"
- **Currently says:** Approved: `50+ handpicked UK walks - Free - No account needed`
- **Should say:** The confirmed social proof strip copy is "Know the route - Own the weather - Find dog-friendly spots". The "50+" and "Free" and "No account needed" versions are superseded.
- **Source:** Handoff Section 6 social proof strip decision - `"Know the route - Own the weather - Find dog-friendly spots"` - do not revert to the shorter "Find the spots" version. Also CLAUDE.md approved copy strings section.

### Issue 3.3 - Stale: State A headline listed as "Discover great walks"

- **Section:** Section 3, "Hero headline" and "Items Confirmed by PO" list
- **Currently says:** Approved: `Discover great walks`
- **Should say:** The confirmed State A headline is "Paws before you go." as implemented.
- **Source:** Handoff quick reference item 15 - "State A headline is 'Paws before you go.'" and CLAUDE.md approved copy strings.

### Issue 3.4 - Stale: Walk count in meta description references "50+"

- **Section:** Meta description and various hero body text references
- **Currently says:** Multiple references to "50+ handpicked UK dog walks" and "50+" throughout.
- **Should say:** Walk count should reference `WALKS_DB.length` dynamically. Never hardcode a number. Current count is 100.
- **Source:** CLAUDE.md - "Walk count references: Use `WALKS_DB.length` dynamically - never hardcode a number." Handoff Section 7 - walk count is 100.

### Issue 3.5 - Stale: Multiple pending items still marked as awaiting PO confirmation

- **Section:** "Implementation Priority Order" table at bottom and various sections marked "Pending"
- **Currently says:** Items 9-12 marked as pending PO confirmation (Home subline, Tagline, Meta description, Onboarding title).
- **Should say:** These items require a status review. The document is stale and many of these decisions have progressed since this document was written.
- **Source:** This document predates much of the v2 development. It should be flagged as a historical reference, not an active decision document.

---

## 4. `docs/specs/dark-mode-schemes.md`

### Issue 4.1 - Stale: Status is "awaiting owner decision" - decision has been made

- **Section:** Document header and status line
- **Currently says:** "Status: Three schemes for comparison - awaiting owner decision"
- **Should say:** Decision made - Scheme B (Dark Slate) is confirmed and implemented. Status should reflect this.
- **Source:** Handoff Section 6 - "Dark mode Scheme B - confirmed and implemented. Dark Slate palette is live. Tokens documented in CLAUDE.md."

### Issue 4.2 - Stale: Scheme B brand colour listed as `#4CAF6A`

- **Section:** Scheme B token values table, `--brand` row
- **Currently says:** `--brand: #4CAF6A`
- **Should say:** `--brand: #5C7A63` (the confirmed dark mode brand value documented in CLAUDE.md)
- **Source:** CLAUDE.md dark mode token overrides table - `--brand: #5C7A63` "Lightened brand for dark bg contrast."

### Issue 4.3 - Stale: Current token reference at top shows old forest-green dark mode values

- **Section:** "Current token reference" table
- **Currently says:** `--bg: #0F1C16`, `--surface: #243A2C`, `--brand: #82B09A`, etc.
- **Should say:** These are the old forest-green dark mode values that were replaced. The current values are Scheme B: `--bg: #141414`, `--surface: #1F1F1F`, `--brand: #5C7A63`, etc.
- **Source:** CLAUDE.md dark mode token overrides table.

---

## 5. `docs/specs/dog-profile-spec.md`

### Issue 5.1 - Stale: localStorage key throughout is `sniffout_dog` (singular)

- **Section:** Section 3 localStorage schema, Section 10 rendering logic, and multiple other references
- **Currently says:** `sniffout_dog` used consistently as the key name. Helper functions reference `localStorage.getItem('sniffout_dog')`.
- **Should say:** The active dog profile key is `sniffout_dogs` (plural, stores an array of dog objects, multiple dogs supported). `sniffout_dog` (singular) is a legacy key from an earlier version that has been migrated.
- **Source:** Handoff Section 6 - "Dog profile localStorage key - `sniffout_dogs` (plural array). The active dog profile key is `sniffout_dogs`... Do not reference `sniffout_dog` in any new code."

### Issue 5.2 - Stale: Avatar background uses old brand colour `#1E4D3A`

- **Section:** Section 6 dog avatar CSS, `.dog-avatar` background value
- **Currently says:** `background: rgba(30, 77, 58, 0.10);` (RGB of `#1E4D3A`) with comment "update to match --brand"
- **Should say:** Brand colour is `#3B5C2A` (RGB: 59, 92, 42). Background should be `rgba(59, 92, 42, 0.10)` or `rgba(var(--brand-rgb), 0.10)`.
- **Source:** Handoff Section 6 brand colour - "`#3B5C2A` (Meadow Green) is fully implemented. No references to `#1E4D3A` should remain anywhere."

### Issue 5.3 - Stale: Dog profile setup card CSS uses old brand colour `#1E4D3A`

- **Section:** Section 1, `.dog-setup-avatar` CSS
- **Currently says:** `background: rgba(30, 77, 58, 0.10); /* update to match --brand */`
- **Should say:** `rgba(59, 92, 42, 0.10)` or a CSS token reference.
- **Source:** Same as 5.2.

### Issue 5.4 - Stale: Phase 3 hooks reference `sniffout_dog.photoUrl`

- **Section:** Section 11, Phase 3 hooks
- **Currently says:** "Avatar tap -> device photo picker -> base64 stored in `sniffout_dog.photoUrl`."
- **Should say:** Should reference `sniffout_dogs` array structure, not `sniffout_dog`.
- **Source:** Same as 5.1.

### Issue 5.5 - Missing: Brachycephalic and double-coat toggles not in spec

- **Section:** Section 2 Profile Fields, Section 9 Edit Dog Profile sheet
- **Currently says:** Profile fields listed as: name, breed, size, personality tags, birthday. Edit sheet shows no brachycephalic or double-coat toggles.
- **Should say:** Two new toggles exist: "Flat-faced breed?" (stored as `'brachycephalic'` tag) and "Double-coated breed?" (stored as `'double-coat'` tag), positioned after the breed field, before the size field.
- **Source:** Handoff Section 5 - "Two new toggles on the dog profile - 'Flat-faced breed?' and 'Double-coated breed?' - positioned after the breed field, before the size field."

---

## 6. `docs/specs/breed-hazard-spec.md`

### Issue 6.1 - Stale: Section 7.1 key name clarification is now resolved but note is unclear

- **Section:** Section 7.1 Storage - "Key name clarification"
- **Currently says:** "CLAUDE.md references `sniffout_dogs` (plural array, multiple dogs supported). The `dog-profile-spec.md` uses `sniffout_dog` (singular). Verify which key is active in the current `sniffout-v2.html` implementation and use that key."
- **Should say:** The active key is confirmed as `sniffout_dogs` (plural array). The `sniffout_dog` singular key is a legacy key that has been migrated. This should be stated definitively rather than as an open question.
- **Source:** Handoff Section 6 - "Active localStorage key confirmed as `sniffout_dogs` (plural array) - `sniffout_dog` (singular) was a legacy key from an earlier version; it has been migrated."

### Issue 6.2 - Stale: Section 8 Open Items - double-coat threshold is still marked as "Proposed - confirm before implementation"

- **Section:** Section 8 Open Items, first row
- **Currently says:** "Double-coat heat threshold value (-2 degrees C proposed, matches senior delta) - Owner: PO / Owner - Status: Proposed - confirm before implementation"
- **Should say:** This was implemented as proposed. Review against user feedback post-launch.
- **Source:** Handoff Section 6 breed/age hazard decision - "The open item from the spec (double-coat heat threshold value of -2 degrees C) was implemented as proposed. Review against user feedback post-launch."

### Issue 6.3 - Stale: Section 4 marks seasonal hazards as "Phase 3"

- **Section:** Decision D4 in Confirmed Owner Decisions table
- **Currently says:** "D4: Seasonal hazards at Phase 3, date-based blanket triggers - Confirmed: YES"
- **Should say:** Despite the label "Phase 3" in the decision description, seasonal hazards were implemented in Phase 2 (23 March 2026) as part of this feature. The "Phase 3" label in D4 was the original proposal before implementation. The implementation note in Section 3 describes them correctly as date-based, no API calls required.
- **Source:** Handoff Section 5 - "Five seasonal hazards added - Blue-green algae, Adder season, Grass seeds, Harvest mites, Rock salt/grit."

---

## 7. `docs/research/firebase-setup-plan.md`

### Issue 7.1 - Stale: Section 2.1 maps `sniffout_dog` to Firestore

- **Section:** Section 2.1 localStorage to Firestore mapping table
- **Currently says:** `sniffout_dog | Dog profile object | users/{uid} (document field)`
- **Should say:** `sniffout_dogs | Array of dog profile objects | users/{uid} (document field)` - the key is `sniffout_dogs` (plural array), not `sniffout_dog`.
- **Source:** Handoff Section 6 - "Dog profile localStorage key - `sniffout_dogs` (plural array)."

### Issue 7.2 - Stale: Firebase described as Phase 3 not yet started - foundation is now live

- **Section:** Document header and introduction
- **Currently says:** Status: "Planning document - Phase 3 pre-work" implying Firebase is not yet set up.
- **Should say:** Firebase foundation is live. Project `sniffout-fe976`, region `europe-west2`. Anonymous auth, Firestore dual-write, and Storage are active. The full migration remains Phase 3. This document describes console setup that is already complete.
- **Source:** Handoff Section 2 - "Firebase: Compat SDK v10.12.0 (CDN) - project `sniffout-fe976`, region `europe-west2`. Anonymous auth + Firestore dual-write + Storage. Foundation only."

### Issue 7.3 - Stale: Step 2 console setup instructions imply Firebase is not yet provisioned

- **Section:** Section 1 Steps 2-5
- **Currently says:** Instructions written as if the owner needs to complete Firestore, Auth, and Storage setup for the first time.
- **Should say:** These steps are complete. Firestore, anonymous auth, and Storage are all provisioned and active in project `sniffout-fe976`.
- **Source:** Handoff Section 2 Firebase status - "Anonymous auth and Firestore dual-write are working correctly."

### Issue 7.4 - Stale: Billing section says "Stay on Spark plan until soft launch"

- **Section:** Section 1 Step 6 billing notes, recommendation
- **Currently says:** "Recommendation: Stay on the Spark plan until soft launch."
- **Should say:** Google Cloud billing has been upgraded to pay-as-you-go. A 15 pound budget alert has been set. This action is complete.
- **Source:** Handoff Section 2 - "Google Cloud billing - resolved 23 March 2026. Owner upgraded to pay-as-you-go billing. A 15 pound budget alert has been set."

### Issue 7.5 - Stale: Firestore offline persistence uses deprecated API

- **Section:** Section 2.6 initialisation pattern
- **Currently says:** `db.enablePersistence({ synchronizeTabs: true })` with a note to handle the catch.
- **Should say:** The `enableMultiTabIndexedDbPersistence` / `enablePersistence` API is deprecated. Address during Phase 3 Firebase migration. The deprecation warning is a confirmed non-issue for current functionality per the handoff.
- **Source:** Handoff Section 2 Firebase status - "`enableMultiTabIndexedDbPersistence` deprecation warning - address during Phase 3 Firebase migration. Does not affect current functionality."

---

## 8. `docs/ux-reviews/ux-review-march-22.md`

### Issue 8.1 - Stale: B2 `beforeunload` handler still listed as needing a fix

- **Section:** BLOCKER section, item B2
- **Currently says:** "[B2] `window.beforeunload` fires a browser leave-page dialog on every navigation." Fix described as removing or conditionally setting the handler.
- **Should say:** B2 was resolved on 23 March 2026. Surgical fix implemented - handler now only fires when the dog profile subpage is open. Android back button protection is preserved.
- **Source:** Handoff Section 6 deferred UX items - "B2: `beforeunload` handler - RESOLVED 23 March 2026."

### Issue 8.2 - Stale: M5 duplicate row-building code still listed as needing a fix

- **Section:** MEDIUM section, item M5
- **Currently says:** "[M5] `renderMeWalkLog()` and `meExpandWalkLog()` duplicate 20+ lines of row-building code." Fix described as extracting a helper.
- **Should say:** M5 was resolved on 23 March 2026. `buildMeWalkRow()` helper extracted. Both `renderMeWalkLog()` and `meExpandWalkLog()` updated to call it. Visual output unchanged.
- **Source:** Handoff Section 6 deferred UX items - "M5 - RESOLVED 23 March 2026."

### Issue 8.3 - Stale: M7 inline styles in `renderCondTagSheet()` still listed as needing a fix

- **Section:** MEDIUM section, item M7
- **Currently says:** "[M7] `renderCondTagSheet()` uses inline style strings instead of CSS classes." Fix described as extracting to named CSS classes.
- **Should say:** M7 was resolved on 23 March 2026. Inline styles moved to named CSS classes. Visual output unchanged.
- **Source:** Handoff Section 6 deferred UX items - "M7 - RESOLVED 23 March 2026."

### Issue 8.4 - Stale: B1 `renderWeather()` dark mode bug still listed as a blocker

- **Section:** BLOCKER section, item B1
- **Currently says:** "[B1] `renderWeather()` hijacks dark mode based on API data." Listed as a blocker requiring a fix.
- **Should say:** B1 was fixed on 22 March 2026. `renderWeather()` no longer manipulates `body.night`.
- **Source:** Handoff Section 5 completed 22 March - "`renderWeather()` dark mode bug fixed." Handoff Section 6 - "`renderWeather()` must never touch dark mode" decision documenting the fix.

### Issue 8.5 - Stale: B4 `btoa()` crash still listed as a blocker

- **Section:** BLOCKER section, item B4
- **Currently says:** "[B4] `btoa()` in `getDeviceId()` throws on non-ASCII user agents." Listed as a blocker.
- **Should say:** B4 was fixed on 22 March 2026 (`btoa` crash fixed per handoff).
- **Source:** Handoff Section 5 completed 22 March - "`btoa` crash fixed."

---

## 9. `docs/ux-reviews/ux-review-march-21.md`

### Issue 9.1 - Stale: B1 walk photo blocker framed as unresolved

- **Section:** BLOCKER section, item B1 - "Walk photos absent from all walk cards"
- **Currently says:** "Every trail card, portrait card, and walk detail overlay shows a tiled image of the same photo (`placeholder-walk.jpg` shown as a fallback for every card). This is unchanged from the March 19 review. It is a content problem, not a code problem."
- **Should say:** Venue-specific placeholder images (placeholder-pub.png, placeholder-cafe.png, placeholder-vet.png) have been added and are in use. The walk placeholder (`placeholder-walk.jpg`) strategy is confirmed. This is a content sourcing challenge, not a bug. 3 walks now have real photos (Richmond Park, Wimbledon Common, Isabella Plantation). 97 walks still use the placeholder.
- **Source:** Handoff Section 6 venue-specific placeholder decision and Section 7 walk photos table.

### Issue 9.2 - Stale: B2 stale meta description framed as unresolved

- **Section:** BLOCKER section, item B2
- **Currently says:** "Line 6 still says 'Discover 25 handpicked UK dog walks.'"
- **Should say:** This was addressed. Walk count should reference `WALKS_DB.length` dynamically per CLAUDE.md.
- **Source:** CLAUDE.md - "Walk count references: Use `WALKS_DB.length` dynamically - never hardcode a number."

### Issue 9.3 - Stale: L8 `--amber` token discrepancy between code and CLAUDE.md

- **Section:** LOW section, item L8
- **Currently says:** "The `--amber` token value differs between code (`#D97706`) and CLAUDE.md (`#F59E0B`). Reconcile. `#D97706` is the correct choice."
- **Should say:** CLAUDE.md currently lists `--amber: #D97706` which matches the code. This specific discrepancy has been resolved.
- **Source:** CLAUDE.md CSS token table - `--amber: #D97706`.

---

## 10. `docs/specs/push-notifications-phase3-spec.md`

### Issue 10.1 - Stale: Prerequisites note implies Google Cloud billing upgrade is still needed

- **Section:** Section 9 Cloud Functions billing note
- **Currently says:** "This is separate from the Google Cloud billing action required in the session handoff (trial credit for Places API). Both should be resolved together."
- **Should say:** Google Cloud billing was resolved 23 March 2026. Owner upgraded to pay-as-you-go, 15 pound budget alert set. The Cloud Functions Blaze plan upgrade remains as a separate item to address when Cloud Functions development begins.
- **Source:** Handoff Section 2 - "Google Cloud billing - resolved 23 March 2026."

---

## 11. `docs/po/product-vision-update.md`

### Issue 11.1 - Stale: Feature 1 dog profile spec references `sniffout_dog_profile` as the key name

- **Section:** Part 1, Feature 1, Phase 2 description
- **Currently says:** "The profile is a single localStorage object (`sniffout_dog_profile`) containing..."
- **Should say:** The active key is `sniffout_dogs` (plural array). Neither `sniffout_dog_profile` nor `sniffout_dog` (singular) is the active key.
- **Source:** Handoff Section 6 - "Active localStorage key confirmed as `sniffout_dogs` (plural array)."

### Issue 11.2 - Stale: Phase 2 states single dog only; multiple dogs now supported in schema

- **Section:** Part 1 Feature 1 Phase 2 section; Part 6 Decision 4
- **Currently says:** "One dog only in Phase 2. Phase 3 introduces multiple dogs on the same account. Confirm single-dog constraint for Phase 2 implementation."
- **Should say:** Multiple dogs are already supported in the Phase 2 implementation. `sniffout_dogs` is an array of dog objects. Walk log entries include `dogId` tagging. The Phase 2 schema supports multiple dogs.
- **Source:** CLAUDE.md state table - "`sniffout_dogs`: array of dog profile objects (multiple dogs supported)."

### Issue 11.3 - Stale: Multiple open decisions that have been resolved

- **Section:** Part 6 consolidated decisions table
- **Currently says:** Many decisions listed as requiring owner confirmation: breed field format (D1), size categories (D2), age format (D3), single vs multiple dogs (D4), note prompt timing (D6), etc.
- **Should say:** These decisions were resolved during development. The document should be treated as historical context, not an active decision log. The handoff is the current source of truth.
- **Source:** These features have been built and are live in the app.

---

## 12. `docs/po/po-action-plan.md` (the older action plan)

### Issue 12.1 - Stale: Round 11 listed as "issued" implying it has not shipped

- **Section:** Opening "Current Status" section
- **Currently says:** "Round 11 issued: developer-brief-round11.md - three items: FIX 12.1 walk detail overlay..."
- **Should say:** Rounds through Round 38+ have shipped. The document is historical context only. The active PO document is `po-action-plan-round24.md`.
- **Source:** Handoff working guidelines - "Last saved brief file was developer-brief-round15.md. Rounds 16 onwards briefed directly in chat. Currently at approximately Round 38+."

### Issue 12.2 - Stale: References to "25 walks" in Sniffout Picks

- **Section:** Various references to walk count
- **Currently says:** References to 50+ walks and the curated foundation at 50+ walks.
- **Should say:** Walk count is 100.
- **Source:** Handoff Section 7 - walk count is 100.

---

## 13. `docs/po/phase1-signoff.md`

This document was not read in full but is a historical record. No audit action required - it is a sign-off document for a completed phase and is not expected to be current.

---

## 14. `docs/specs/walk-detail-overlay-spec.md`

### Issue 14.1 - Stale: Spec does not mention heart button removal

- **Section:** Overlay actions section
- **Currently says:** The spec describes both heart (favourite) and other action buttons in the walk detail overlay.
- **Should say:** The heart button was removed from the walk detail overlay. Only the bookmark button remains, labelled "Add to our walk list".
- **Source:** Handoff Section 6 - "Walk save actions - simplified. Heart button removed from walk detail overlay. Only the bookmark button remains, labelled 'Add to our walk list'."

---

## 15. `docs/briefs/developer-brief-round15.md` and earlier briefs

These are historical implementation briefs. They are not expected to be kept current and contain no active guidance. No audit action required.

---

## 16. Cross-cutting issue: incorrect GDPR/solicitor blocker classification

### Issue 16.1 - Incorrect blocker type in multiple documents

Several documents imply or state that GDPR sign-off and solicitor review block development work, not just go-live. This is incorrect per the confirmed owner decisions.

- **Documents affected:** References in `po-action-plan-round24.md`, `pre-launch-checklist.md`
- **Currently says / implies:** Legal sign-off (L1-L5) blocks all progress.
- **Should say:** L1-L5 are go-live prerequisites only, not development blockers. Push notification development can proceed once Firebase full migration is complete, without waiting for GDPR sign-off. T&C consent screen development can proceed once ToS copy is ready.
- **Source:** Handoff Section 8 push notification Phase 3 spec - "Build/go-live distinction clarified: development can proceed once Firebase full migration is complete; GDPR sign-off and solicitor review are go-live prerequisites only." Handoff Section 9 pre-launch blockers table notes under L5 - "Developer work required once ToS copy is ready."

---

## Summary Table

| Document | Issues Found |
|----------|-------------|
| `docs/po/pre-launch-checklist.md` | 10 |
| `docs/po/po-action-plan-round24.md` | 10 |
| `docs/po/copy-review.md` | 5 |
| `docs/specs/dark-mode-schemes.md` | 3 |
| `docs/specs/dog-profile-spec.md` | 5 |
| `docs/specs/breed-hazard-spec.md` | 3 |
| `docs/research/firebase-setup-plan.md` | 5 |
| `docs/ux-reviews/ux-review-march-22.md` | 5 (3 resolved items still listed as open, 2 blockers fixed) |
| `docs/ux-reviews/ux-review-march-21.md` | 3 |
| `docs/specs/push-notifications-phase3-spec.md` | 1 |
| `docs/po/product-vision-update.md` | 3 |
| `docs/po/po-action-plan.md` (older) | 2 |
| `docs/specs/walk-detail-overlay-spec.md` | 1 |
| Cross-cutting GDPR blocker classification | 1 |
| **Total** | **57** |

---

## Priority Notes

**Highest priority corrections** - items that could cause incorrect implementation if followed:

1. `docs/specs/dog-profile-spec.md` - `sniffout_dog` key name throughout. Any developer reading this spec and using `sniffout_dog` would write to the wrong key.
2. `docs/po/copy-review.md` - em dash instruction is the exact opposite of the current rule.
3. `docs/po/pre-launch-checklist.md` - D2 dark mode description. If a developer or designer tests dark mode expecting automatic `is_day` triggering, they will misdiagnose the behaviour.
4. `docs/po/pre-launch-checklist.md` - wrong brand colour in T4 and D8.
5. `docs/research/firebase-setup-plan.md` - `sniffout_dog` key in the Firestore mapping table.

**Items that are historical records** (low urgency, no risk of incorrect implementation):
- `docs/ux-reviews/ux-review-march-21.md` and `ux-review-march-22.md` - resolved items. These are review snapshots, not active guidance. The resolved status should ideally be noted but these documents do not direct developer work.
- `docs/po/po-action-plan.md` (older action plan) - superseded by `po-action-plan-round24.md`.
