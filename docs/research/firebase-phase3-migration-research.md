# Firebase Phase 3 Migration Architecture — Research Report

> **Date:** 2026-03-23
> **Status:** Research and planning — pre-spec
> **Audience:** Product Owner (decisions section), Developer (technical sections)
> **Scope:** No code changes. Research and planning document only.
> **Feeds into:** PO to write formal Phase 3 migration spec after owner reviews this document.

---

## Executive Summary

- **Q1 recommendation: Option B** (optional authenticated accounts alongside permanent anonymous auth). Anonymous auth stays as the default; account linking is an opt-in data recovery mechanism surfaced only after a user has meaningful data to protect. The no-login principle is preserved.
- **Q2 recommendation: Option C** (hybrid - localStorage instant render, background Firestore reconciliation). The firebase-setup-plan.md already describes this pattern. It is confirmed as the correct approach. Key addition: Firestore's own offline persistence (IndexedDB cache) provides a second resilience layer that works alongside localStorage.
- **Q3 recommendation: Phased, idempotent, per-collection migration** with a lazy photo strategy. The migration scope is smaller than it appears - walk log entries written since 22 March 2026 (when the Firebase foundation went live and dual-write became active) are already in Firestore. Only pre-foundation data needs migrating.

---

## Background and Constraints

The firebase-setup-plan.md and push-notifications-phase3-spec.md establish the starting point:

- Firebase project `sniffout-fe976`, region `europe-west2` (London). Cannot change region.
- Anonymous auth is live and working. Firestore dual-write for walk log is active (write-only). Firebase Storage active.
- localStorage remains source of truth for all UI rendering. No Firestore reads on the critical render path.
- No login is a confirmed product principle. The owner does not want to gate the app behind an account.
- Personal data (walk journal, dog profile, photos) is now described as "irreplaceable" in the strategic reframe. "We've done 34 walks together" is not something a user migrates away from.
- Full authenticated Firebase migration is Phase 3, gated on GDPR sign-off (L1) from the owner's solicitor.
- The push notifications spec identifies "Firebase full migration" as a build prerequisite.
- GDPR right to erasure must be implemented before any user data is stored in Firestore.

---

## Research Question 1 - Anonymous Auth vs Authenticated Accounts

### The three options

**Option A - Anonymous auth permanently:** Keep the current anonymous auth model indefinitely. Complete the Firestore migration without ever introducing user accounts. Users are identified by Firebase UID only - no email, no Google account.

**Option B - Optional authenticated accounts:** Anonymous auth remains the default (no change to the first-run experience). After a user accumulates meaningful data, offer an optional account-linking flow that upgrades their anonymous account to an email or Google account. Their UID stays the same; all Firestore data migrates automatically.

**Option C - Required authenticated accounts:** Move to required sign-in. Remove anonymous auth. Users must create an account or sign in with Google before accessing the app.

---

### Why Option A fails at Phase 3

Option A is technically simple but creates a product risk that conflicts directly with the "irreplaceable data" strategic position.

Anonymous auth UIDs survive browser refreshes but do NOT survive:
- Clearing browser data (Settings > Clear data, or factory reset)
- Switching to a new device
- Switching browsers
- Private/incognito mode

A user who has logged 34 walks and built a dog profile for Luna would lose everything if they get a new phone. With localStorage-only this was an acceptable risk (all data was always device-local). Once Firestore becomes the home for this data, users will reasonably expect it to be recoverable - cloud-backed data should not disappear when a phone is replaced.

Offering no recovery path is a retention risk precisely at the highest-value moment (when a user has irreplaceable data). It also creates a support expectation problem: "I got a new phone and lost all my walks" is a user complaint that Sniffout cannot currently answer.

**Option A is not recommended.** It is only viable if the walk journal and dog profile are explicitly positioned as device-local tools with no recovery - which contradicts the strategic reframe.

---

### Why Option C is not viable

Option C directly contradicts the confirmed product principle that no login is required. This principle is not a preference - it is a competitive differentiator. "No account, no barrier, just go" is part of Sniffout's positioning against PlayDogs and AllTrails.

Mandatory sign-in also creates GDPR obligations immediately for all users, complicating the solicitor engagement (L1) and expanding the privacy policy scope before launch.

**Option C is not recommended and should not be revisited without explicit owner direction.**

---

### Option B - Recommendation with rationale

**Option B is recommended.** This is also the approach Firebase explicitly endorses in its own best practices documentation.

The mechanism is clean: when a user upgrades from anonymous to authenticated, the existing UID is preserved. Firebase links the Google or email credentials to the existing anonymous account. All Firestore data (walk log, dog profile, saved walks, reviews) remains under the same document path - `/users/{uid}` - with no migration required.

The implementation has one known complexity: if the user's email or Google account is already linked to a different Firebase user (e.g. they created a test account earlier), the linking call fails and a merge must be handled manually. Firebase's recommendation for this edge case is to perform the Firestore data merge via a callable Cloud Function (server-side) before completing the sign-in, to prevent partial state. This is a Phase 3+ edge case - not required for the initial implementation.

**The critical product design decision is when and how to surface the account-linking option.** It must not feel like "sign up" or "create an account". The recommended framing is data protection:

> "Your walk journal is only saved on this device. Link to Google or email to back it up and access it from any device."

This is surfaced:
1. Not at first launch - there is nothing to protect yet.
2. After a meaningful threshold of data accumulates (suggested: after 3 walk log entries, or after a dog profile is saved).
3. In Me tab settings, always available but never intrusive.

The no-login first experience is completely preserved. Existing anonymous users who never link an account continue to work exactly as now.

---

### GDPR implications by option

| Dimension | Option A (anon only) | Option B (optional upgrade) | Option C (required auth) |
|-----------|---------------------|----------------------------|--------------------------|
| PII in auth layer | None | Email (only for users who link) | Email for all users |
| GDPR basis for auth | Not required | Legitimate interest or consent (for linked users only) | Required for all users |
| Right to erasure | Delete Firestore document | Delete Firestore document + deregister auth account | More complex |
| Privacy policy scope | No email processing | Email processing for linked users - must be disclosed | Email processing for all users |
| Anonymous account cleanup | Firebase auto-cleanup (30 day idle) | Linked accounts are not auto-deleted | N/A |
| Solicitor sign-off impact | Simpler | Moderate - email processing for opt-in users | Most complex |

**Important note on anonymous account auto-deletion:** Firebase can be configured to automatically delete anonymous accounts inactive for 30 days. If this feature is enabled, a user who installed Sniffout, accumulated data, and then did not open the app for 30+ days would lose their anonymous UID - and with it their Firestore data. The firebase-setup-plan.md flagged this as an open question requiring a solicitor retention policy. The recommendation is to either disable auto-deletion (accounts accumulate but data is not lost) or surface the account-linking prompt earlier to linked users before the 30-day window. The PO must decide a retention policy with the solicitor before Phase 3 goes live.

---

### Open questions for owner before spec is written

| # | Question | Impact |
|---|---------|--------|
| D1 | Approve Option B? | Gates all Phase 3 auth work |
| D2 | What is the trigger threshold for surfacing the account-linking prompt? | Determines product experience |
| D3 | Which linking methods at launch: Google only, email only, or both? | Google is simpler to implement; email requires password reset flows |
| D4 | Agree anonymous account retention policy with solicitor: disable auto-deletion, or 30/60/90 day cleanup? | GDPR right to erasure filing |
| D5 | Where should the account-linking entry point live in the Me tab? | Developer brief |

---

## Research Question 2 - Firestore as Source of Truth vs localStorage as Primary

### The three options

**Option A - Firestore as source of truth:** App reads from Firestore on every load. localStorage used as a fallback for offline only.

**Option B - localStorage as primary permanently:** Current model. Firestore receives writes but is never read on the critical render path. No cross-device sync.

**Option C - Hybrid:** localStorage renders instantly on load. Firestore sync runs in the background. After sync completes, UI reconciles any differences.

---

### Why Option A fails for Sniffout

The firebase-setup-plan.md already ruled this out and the reasoning holds. Firestore reads on the critical render path add 100-500ms minimum on every app start, even with the europe-west2 region. For a PWA expected to feel native on mobile, this is a significant regression from the current instant render.

Offline use becomes a first-class failure mode rather than a graceful degradation. On a patchy rural walk (exactly when a user might want to check the app), a Firestore-first architecture would show a blank loading state instead of the user's walk log.

The firebase-setup-plan.md, the push notifications spec, and CLAUDE.md all explicitly state that Firestore must not be on the critical render path. This is a locked principle, not an open decision.

**Option A is not recommended.**

---

### Option C - Recommendation and implementation detail

**Option C (hybrid) is confirmed as the correct approach.** This is consistent with the firebase-setup-plan.md Section 2.4 recommendation. The research findings add two important layers of detail not in the original plan.

**Layer 1: Firestore's own offline cache sits between localStorage and Firestore server.**

When `db.enablePersistence({ synchronizeTabs: true })` is enabled (already in the firebase-setup-plan.md initialisation code), Firestore maintains its own IndexedDB cache on the device. This is separate from the app's localStorage. The effective data stack becomes:

```
UI renders from: localStorage (instant, always available)

On load, in background:
  Firestore SDK checks its IndexedDB cache first (fast, offline-capable)
    If cached data exists: returns immediately from IndexedDB
    If not cached or stale: fetches from Firestore server
  App reconciles Firestore data into localStorage
  UI re-renders changed items only
```

This means the app has three tiers of persistence: localStorage (app-controlled, instant), Firestore IndexedDB cache (SDK-controlled, fast), and Firestore server (authoritative, network-dependent). Even if the server is unreachable, the Firestore SDK can return data from its own cache. For Sniffout users on rural walks, this is important.

**Layer 2: Conflict resolution must be explicitly defined per data type.**

Firestore's default conflict model is "last write wins" at the document level. For Sniffout, this needs to be more granular:

| Data type | Conflict rule | Rationale |
|-----------|--------------|-----------|
| Dog profile (name, breed, tags, birthday) | Firestore wins if `updatedAt` is newer | Profile changes are deliberate; Firestore is the durable record |
| Walk log entries (individual entries) | Union - never delete. Each entry has its own document ID. | Walk entries are append-only. A missing entry in one source is not a deletion intent. |
| Saved walks (`sniffout_favs`) | Union - never delete. Items added from either source are preserved. | Removing a favourite is an explicit action; absence in Firestore does not mean the user removed it. |
| Walk reviews | Firestore wins if `updatedAt` is newer | Deliberate update; Firestore is authoritative |
| Saved places | Union | Same rationale as saved walks |

The "union, never delete" rule for walk log entries is the most important. If a user logs a walk offline and it is in localStorage but not yet in Firestore, the sync must ADD it to Firestore, not treat the absence as a Firestore-authoritative deletion.

**Cross-device sync is the key benefit that Option B cannot provide.** When the user gets a new phone, they link their account (if they followed Q1 recommendation), the app loads, localStorage is empty, the Firestore sync runs, and their full walk journal is restored. This is the outcome the "irreplaceable data" strategic position promises.

---

### Recommended sync sequence (refined from firebase-setup-plan.md)

```
App start:

1. Read localStorage - render UI immediately (instant)
2. Sign in anonymously (if not already - usually instant, already signed in)
3. Firestore SDK returns data from IndexedDB cache (fast, offline-safe)
4. Merge Firestore data into localStorage:
   a. Dog profile: compare updatedAt; Firestore wins if newer
   b. Walk log: union (add any Firestore entries missing from localStorage)
   c. Saved walks: union (add any Firestore saves missing from localStorage)
   d. Reviews: compare updatedAt per review; Firestore wins if newer
   e. Saved places: union
5. Re-render only changed UI sections
6. (Background) Firestore SDK reconciles IndexedDB cache with server

On user action (save walk, update profile, etc.):
1. Write to localStorage immediately (UI updates instantly)
2. Write to Firestore async (fire and forget - existing pattern)
3. Firestore SDK queues the write if offline; replays when connectivity resumes

```

---

### New device / cleared storage scenario

This is the critical scenario that drives the need for Option C over Option B:

```
New device scenario:
1. User installs Sniffout on new phone
2. localStorage is empty - app shows State A (first-run screen)
3. User has a linked account (Google or email) - signs in
   OR
   User's anonymous account is still active (within 30-day window) - auth resolves automatically
4. Firestore sync runs - pulls full walk log, dog profile, saves from Firestore
5. localStorage is populated - app renders their data
6. User sees "We've done 34 walks together"
```

Without a linked account (Option A only, anonymous UID gone): step 3 fails, new UID generated, step 4 returns empty, user loses all data. This is the failure mode that Options B + C together prevent.

---

### Open questions for owner before spec is written

| # | Question | Impact |
|---|---------|--------|
| D6 | Confirm Option C hybrid approach? | Gates architecture decisions in Phase 3 spec |
| D7 | Confirm "union, never delete" as the merge rule for walk log and saved walks? | Determines conflict resolution implementation |
| D8 | Should the sync show any visible indicator to the user (e.g. a subtle "synced" confirmation)? Or entirely silent? | UX decision for Developer brief |

---

## Research Question 3 - Migration Path for Existing localStorage Data

### Scoping the migration - it is smaller than it appears

Before planning the migration, it is important to understand what data actually needs migrating.

The Firebase foundation went live on 22 March 2026. From that date, Firestore dual-write has been active for walk log entries. This means:

- Walk log entries created on or after 22 March 2026: already in Firestore. No migration needed for these.
- Walk log entries created before 22 March 2026: in localStorage only. These need migrating.
- Dog profiles: written to Firestore via `fsWriteUserProfile()` helper. If the user has saved their dog profile since 22 March, the current state is already in Firestore.
- Saved walks (`sniffout_favs`): written to Firestore via `fsWriteSavedWalk()`. If the user has saved/unsaved a walk since 22 March, the current state is partially in Firestore.
- Reviews (`walkReviews`): NOT currently dual-written. All existing review data is localStorage only.
- Saved places: NOT currently dual-written. All existing saved places are localStorage only.

This means the migration is two-tier:
1. **Full historical migration needed:** walk log entries pre-22 March, all reviews, all saved places.
2. **Reconciliation only:** dog profile (may already be in Firestore), saved walks (may be partially in Firestore), recent walk log entries.

---

### Detecting un-synced data

**Recommended approach: per-collection migration flags in localStorage.**

Do not use a single `sniffout_firestore_migrated: true` flag. If the migration is interrupted mid-way (e.g. network drops after dog profile is written but before walk log is written), a single flag leaves it impossible to know what was and was not migrated.

Instead, use per-collection flags that are set individually after each collection is successfully written:

```
sniffout_migrated_v1_profile: true     (set after dog profile migration completes)
sniffout_migrated_v1_walklog: true     (set after walk log migration completes)
sniffout_migrated_v1_savedwalks: true  (set after saved walks migration completes)
sniffout_migrated_v1_reviews: true     (set after reviews migration completes)
sniffout_migrated_v1_savedplaces: true (set after saved places migration completes)
```

The `_v1` suffix allows future migrations to be added without conflict.

**Detection logic at app start:**

```
On app load, after anonymous auth resolves:
  For each collection:
    If migration flag for this collection is absent:
      And localStorage data exists for this collection:
        Queue migration for this collection
```

This is idempotent - safe to run on every app load. Collections already migrated are skipped immediately. Collections with no localStorage data are also skipped immediately (nothing to migrate).

---

### Migration sequence and approach

**Recommended order (lowest risk to highest complexity):**

| Step | Collection | Complexity | Notes |
|------|-----------|-----------|-------|
| 1 | Dog profile | Low | Single document write; already partially in Firestore |
| 2 | Saved walks | Low | Array of walk IDs; simple batch write |
| 3 | Reviews | Medium | Object of review entries; batch write |
| 4 | Saved places | Medium | Array of place objects; batch write |
| 5 | Walk log (text only) | Medium-high | Array of entries; write each as a Firestore subcollection document |
| 6 | Walk log photos | High | Base64 → Storage upload → URL replacement (see below) |

**For steps 1-5, use Firestore batched writes.** A Firestore batch groups up to 500 writes into a single atomic operation - either all succeed or all fail. For collections with more than 500 entries (unlikely at POC scale but possible), split into sequential batches of 500.

**Walk log photos (step 6) are a separate, lazy migration.** Do not block the migration on photo uploads. Base64 photos in walk log entries can be 200-800KB each. A user with 20 walk photos would be trying to upload 4-16MB at migration time, which is likely to fail on a slow connection and blocks the user from using the app.

**Recommended photo migration approach - lazy on render:**

```
When a walk log entry with a base64 photo is displayed:
  If photoDataUrl exists (base64) AND photoUrl does not exist (Firebase Storage URL):
    Upload to Storage: users/{uid}/walkPhotos/{entryId}.jpg
    On success:
      Write photoUrl to Firestore walk log entry
      Write photoUrl to localStorage walk log entry
      Remove photoDataUrl from Firestore (not strictly necessary but keeps documents lean)
    On failure:
      Silently fail - try again next time the entry is displayed
```

This spreads the upload work across normal app usage rather than front-loading it. Photos are migrated over days/weeks as the user reviews their walk journal - invisible to the user.

---

### What happens if the migration is interrupted?

With per-collection flags and idempotent logic, interruption is handled gracefully:

- If the app is closed mid-migration: on next load, the flags for completed collections are already set. Only the incomplete collections are retried.
- If a Firestore batch write fails: the migration flag is not set. The entire batch is retried on next load. Batched writes are atomic - either the whole batch succeeded or nothing was written, so there is no partial write to worry about.
- If the Firestore batched write for walk log partially succeeds then fails: some entries may have been written in a previous successful batch and some may not. The reconciliation logic (union, never delete from Q2) handles this correctly - on the next attempt, entries already in Firestore are harmlessly overwritten with the same data.

The only unrecoverable failure scenario is if localStorage is cleared before migration completes. This is why the migration must run promptly on first load after Phase 3 goes live - not on a deferred schedule. The sooner data is in Firestore, the smaller the risk window.

---

### Silent or inform the user?

**Text data migration: entirely silent.**

There is no user benefit to watching a "migrating your data" loading screen. The migration runs in the background, does not block UI rendering, and completes in seconds for most users (text data is small). A subtle confirmation ("Your data is now backed up") can be shown once the migration flags are all set, but it should be unobtrusive - a brief toast, not a modal.

**Photo migration: silent per photo, with optional progress in settings.**

Each photo upload is silent. If the user opens their walk journal and photos appear to load progressively (as lazy migration runs), this is acceptable and normal-feeling behaviour - similar to how any image-heavy app loads. No explicit "migrating photos" messaging is needed.

An optional "X of Y photos backed up" indicator in the Me tab settings (under storage/account section) is a nice-to-have, not required at Phase 3 launch.

**If the migration fails for a collection after 3 attempts: surface a non-blocking notice.**

```
"Some of your data hasn't synced yet. Connect to Wi-Fi to back it up."
```

This is a safety net only. Most users will not see it.

---

### GDPR gate for migration

**The migration must be gated on GDPR sign-off (L1).**

Currently, data exists only on the user's device (localStorage). The migration moves data to Firestore (cloud storage, europe-west2). This is a material change to data processing - data that was never leaving the device is now being transmitted to and stored on a server.

The solicitor engagement (L1) must specifically cover:
- The lawful basis for storing walk log, dog profile, and photos in Firestore
- The privacy policy update to disclose cloud storage
- Whether anonymous auth constitutes "processing personal data" under UK GDPR (it does - behavioural data linked to a pseudonymous UID is still personal data)
- The right to erasure implementation (Firestore document + all subcollections + Storage files)

Development of the migration can proceed before L1 sign-off. **The migration must not run for real users until L1 is signed off.** This matches the existing Phase 3 gating for push notifications.

---

### Right to erasure - must be built before migration goes live

The firebase-setup-plan.md flagged this as open question 1. It must be resolved before Phase 3 goes live. The delete path:

```
User requests "Delete all my data" in Me tab settings:
1. Delete all Firestore subcollections: walkLog, savedWalks, reviews, savedPlaces
2. Delete the /users/{uid} document
3. Delete all Firebase Storage files at users/{uid}/
4. Clear all sniffout_ localStorage keys
5. Sign out from Firebase Auth
6. If the user has a linked account: also delete the Firebase Auth account
7. Confirm deletion to the user
```

Deleting Firestore subcollections from the client requires querying and deleting each document individually (Firestore does not support recursive deletes from the client). For Phase 3, client-side sequential deletion is acceptable. For Phase 4+, a Cloud Function with admin SDK can handle recursive deletes more efficiently.

---

### Summary of migration flags and localStorage keys added

No new app features are needed - only these new localStorage migration flags:

| New key | Type | Purpose |
|---------|------|---------|
| `sniffout_migrated_v1_profile` | boolean | Set when dog profile migration completes |
| `sniffout_migrated_v1_walklog` | boolean | Set when walk log text migration completes |
| `sniffout_migrated_v1_savedwalks` | boolean | Set when saved walks migration completes |
| `sniffout_migrated_v1_reviews` | boolean | Set when reviews migration completes |
| `sniffout_migrated_v1_savedplaces` | boolean | Set when saved places migration completes |

These join the existing `sniffout_` key namespace and should be documented in CLAUDE.md when Phase 3 implementation begins.

---

### Open questions for owner before spec is written

| # | Question | Impact |
|---|---------|--------|
| D9 | Confirm GDPR sign-off (L1) as a go-live gate for the migration (not a build gate)? | Solicitor engagement timeline |
| D10 | Confirm that right to erasure must be built before the migration goes live? | Developer scope |
| D11 | Approve silent migration for text data with a brief toast on completion? | UX decision |
| D12 | Should the migration run only for users with a linked account (Option B from Q1), or for all users including permanently-anonymous users? | If anonymous users are included, their data is in Firestore but still unrecoverable on device loss - the migration provides backup without recovery. Confirm intent. |

---

## Consolidated Owner Decisions Required

All decisions required before the formal Phase 3 migration spec can be written:

| # | Research question | Decision | Options |
|---|-----------------|---------|---------|
| D1 | Q1 | Approve Option B (optional account linking)? | Yes / revisit |
| D2 | Q1 | Trigger threshold for account-linking prompt | After N walk entries / after dog profile saved / both / other |
| D3 | Q1 | Auth linking methods at Phase 3 launch | Google only / Email only / Both |
| D4 | Q1 | Anonymous account retention policy | Disable auto-deletion / 30 / 60 / 90 day cleanup |
| D5 | Q1 | Location of account-linking entry point in Me tab | Me tab settings / standalone "Protect your data" card |
| D6 | Q2 | Confirm Option C hybrid approach? | Yes / revisit |
| D7 | Q2 | Confirm "union, never delete" for walk log and saved walks conflicts? | Yes / revisit |
| D8 | Q2 | Sync indicator to user? | Silent / brief toast on first sync / persistent indicator in settings |
| D9 | Q3 | GDPR sign-off (L1) as go-live gate for migration (not build gate)? | Yes / revisit |
| D10 | Q3 | Right to erasure built before migration goes live? | Yes (recommended) / defer to post-launch |
| D11 | Q3 | Migration communication to user | Silent with toast / silent with settings indicator / explicit migration screen |
| D12 | Q3 | Migrate data for permanently-anonymous users (no linked account)? | Yes (data in Firestore but unrecoverable on device loss) / Only after account link |

---

## Implementation Sequence (for PO to include in spec)

Suggested order to build Phase 3 without disrupting the live app:

| Step | Task | Gates |
|------|------|-------|
| 1 | Right to erasure implementation in Me tab settings | GDPR go-live gate |
| 2 | localStorage migration logic (per-collection flags, batch writes) | Nothing blocked on this |
| 3 | Firestore reconciliation on load (Q2 hybrid sync) | Nothing blocked on this |
| 4 | Account linking flow - Google and/or email (Q1) | D1-D5 decisions |
| 5 | Lazy photo migration (on walk log render) | Step 2 complete |
| 6 | "Delete all my data" end-to-end test | Step 1 complete |
| 7 | Phase 3 go-live | L1 sign-off + right to erasure complete |

Push notifications build (already spec'd) can run in parallel with Steps 2-5. Push notifications go-live gates separately on solicitor review of notification consent.

---

## Sources

- [Firebase best practices for anonymous authentication](https://firebase.blog/posts/2023/07/best-practices-for-anonymous-authentication/)
- [Firebase Authentication - link multiple auth providers](https://firebase.google.com/docs/auth/web/account-linking)
- [Firebase - anonymous auth to authenticated upgrade (JavaScript)](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Firestore offline persistence documentation](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Offline-first sync and conflict resolution on Firebase](https://wild.codes/candidate-toolkit-question/how-do-you-design-offline-first-sync-conflict-resolution-on-firebase)
- [Firestore offline persistence with conflict resolution - SystemsArchitect](https://www.systemsarchitect.io/services/google-firestore/reliability-best-practices/pt/implement-offline-persistence-with-conflict-resolu)
- `docs/research/firebase-setup-plan.md` (2026-03-20)
- `docs/specs/push-notifications-phase3-spec.md` (2026-03-23)
- `docs/handoffs/session-handoff-march-23.md` (2026-03-23)
