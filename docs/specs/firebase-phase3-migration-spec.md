# Firebase Phase 3 Migration Spec — Sniffout

**Date:** 23 March 2026
**Status:** Approved for Phase 3 implementation
**Author:** Product Owner
**Phase:** 3 (build can proceed immediately -- go-live requires GDPR sign-off L1 -- see Section 9)
**Based on:** `docs/research/firebase-phase3-migration-research.md`, `docs/research/firebase-setup-plan.md`, `docs/specs/push-notifications-phase3-spec.md`

---

## Overview

This spec formalises all confirmed owner decisions for the Phase 3 Firebase migration. It does not introduce new decisions. It is the implementation reference for the Developer and the briefing foundation for the Designer and Copywriter.

### What this migration does

Phase 3 moves Sniffout from a device-local product to a cloud-backed product. Walk logs, dog profiles, saved walks, reviews, and saved places -- currently stored only in localStorage -- are migrated to Firestore. Data survives device loss, browser clears, and phone upgrades. Cross-device sync becomes possible for users who link an account.

This is a strategic inflection point. The product is shifting from "discovery tool" to "irreplaceable personal record." The data must be as durable as the content. A user who has logged 34 walks and built a dog profile for Luna should never lose that record because they got a new phone.

### What this migration does not do

- It does not introduce a login requirement. The no-login first experience is fully preserved.
- It does not require users to do anything. The migration runs silently in the background.
- It does not change the UI rendering model. localStorage remains the source of truth for all UI rendering.
- It does not change any existing feature behaviour. All existing localStorage keys remain.

### What the push notifications spec already covers

The push notifications spec (`docs/specs/push-notifications-phase3-spec.md`) covers FCM token management, home location, notification preferences, Cloud Functions, and quiet hours. This spec does not duplicate those sections. The Firestore schema in Section 10 extends the schema already defined in the push notifications spec.

---

## Section 1 -- Scope

### In scope (Phase 3 launch)

- Anonymous auth (already live) plus optional authenticated account linking (new)
- Persistent data reminder surfaced in Me tab (new UI element -- Designer and Copywriter required)
- Account linking flow -- Google and email (new UI flow)
- localStorage-to-Firestore migration for all five collections (walk log, dog profile, saved walks, reviews, saved places)
- Background Firestore reconciliation on every app load (the hybrid sync)
- Right to erasure ("Delete all my data") implementation in Me tab settings
- Lazy walk photo migration from base64 to Firebase Storage
- Five new localStorage migration flags

### Out of scope (Phase 3)

- Authenticated user accounts as a requirement (optional only -- D1)
- Public reviews or community walk submissions (Phase 4)
- Firebase App Check / rate limiting (Phase 4)
- Breed-specific walk filtering from Firestore data (Phase 3+)
- Multiple-device simultaneous session management (Phase 4)

---

## Section 2 -- Auth Architecture (Option B -- Anonymous Plus Optional Linking)

### Decision confirmed (D1)

Option B is approved. Anonymous auth stays as the permanent default. An optional account-linking mechanism is available to users who want to protect their data across devices. The no-login first experience is fully preserved for all users, forever.

### How it works

**Anonymous auth (existing, unchanged):**

When the app loads, `signInAnonymously()` is called automatically. Firebase creates a real user account with a unique UID that persists in the browser's IndexedDB. This is already live and working.

The anonymous UID is invisible to the user. There is no sign-in screen, no email, no password. All Firestore data lives at `/users/{uid}` keyed by this UID.

**Optional account linking (new in Phase 3):**

A user who wants to protect their data can link their anonymous account to a Google account or email address. Firebase's `linkWithCredential()` call upgrades the anonymous account to an authenticated one while preserving the UID. All Firestore data at `/users/{uid}` remains untouched -- no data migration is needed when an account is linked.

Once linked, the user can sign in on any device with the same credentials and their data syncs automatically via Firestore.

### Auth providers at Phase 3 launch (D3)

**Google sign-in and email (simplified) are both available at Phase 3 launch.**

- Google sign-in: single tap, no password required. Preferred for most users.
- Email: email address plus password. Required for users without a Google account.
- No email verification required at Phase 3 launch.
- Password reset flow required for email accounts.
- No other providers at Phase 3 launch.

### Edge case -- account already in use

If the user's Google or email account is already linked to a different Firebase user (for example, they created a test account earlier), the `linkWithCredential()` call fails. For Phase 3, show an error message explaining the conflict and offer to sign in with the existing account instead. The Firestore data merge for this edge case (combining two users' data) is deferred to Phase 4.

### Anonymous account auto-deletion (D4)

**Disable Firebase's anonymous account auto-deletion.** Do not enable the 30-day anonymous account cleanup setting in the Firebase console. A user who does not open the app for 30 or more days must not lose their data or their anonymous UID. Permanently-anonymous users' data is in Firestore and must remain there until the user explicitly deletes it.

### Anonymous ID risk -- critical context for the Developer and for copy

An anonymous Firebase UID is tied to a specific browser on a specific device. It does NOT survive:

- Clearing browser data (Settings > Clear data, or equivalent)
- Switching to a different browser (e.g. Chrome to Safari on the same phone)
- Opening the app in incognito or private mode
- Getting a new phone
- A factory reset

For a permanently-anonymous user (one who never links an account), losing the UID means losing all Firestore data permanently. This is why the persistent reminder (D2, D5) is critical -- users must understand this risk before it is too late to act. The copy must communicate this risk in friendly, non-alarming language.

For users who have linked an account, this risk is eliminated. Their UID is tied to their Google or email credentials, not to the browser.

---

## Section 3 -- Persistent Data Reminder and Account Linking Flow

### Decision confirmed (D2, D5)

A persistent, unobtrusive reminder is visible in the Me tab from the first time a user opens it. It does not wait for a data threshold. It is always visible until the user links an account.

Once an account is linked, the reminder is replaced with account status (for example: "Backed up to Google" or "Backed up to your email address").

**This is a go-live item.** The reminder must be designed and copy-written before Phase 3 launches. Designer spec and Copywriter brief are both required.

### Behaviour requirements

**Before account is linked:**

- Visible in the Me tab from the first session
- Unobtrusive -- must not dominate the tab or interrupt the user's flow
- Always visible (not dismissible) until the user links an account
- Tapping it opens the account linking flow
- It must not describe itself as "sign up" or "create an account" in a way that implies the app requires registration. The framing is data protection, not onboarding.

**After account is linked:**

- The reminder element is replaced by account status
- Account status shows the linked provider (Google or email)
- Account status should be reassuring -- the user's data is safe
- A "Manage account" or "Change" link is available for users who want to update their credentials

**If account linking fails (network error, conflict, etc.):**

- Show an inline error message in the linking flow, not a modal
- Allow the user to retry without losing their place
- Do not change the reminder state if linking was not completed

### Content requirements for Copywriter

The following strings must be written by the Copywriter and reviewed by the Editor before Developer implementation. The spec describes what each string needs to communicate -- not the final wording.

**Reminder element (pre-linked):**

The reminder must communicate:
- The user's walk log and dog profile are saved on this device only
- The data will be lost if they clear their cache, switch browsers, or get a new phone
- Linking a Google or email address keeps their data safe and makes it available on any device
- The action to take (tap to link)

Tone: friendly and practical. Not alarming. Not making the app feel unsafe to use. The goal is to inform, not to frighten. The user's current data is safe right now -- the risk is only if they clear their browser or switch devices without linking first.

**Note on the word "free":** The copy rules for Sniffout prohibit using "free" in the context of "no sign-up" or "no account required" (because the product is positioned as no-login, not no-cost). However, if the copy needs to clarify that creating an account has no cost (to address a user who may think they are being asked to pay), "create a free account" is a legitimate exception. Copywriter should flag this if they use it and Editor should confirm it is appropriate in context.

**Account status (post-linked, Google):**
Must communicate: data is backed up and safe, linked to Google.

**Account status (post-linked, email):**
Must communicate: data is backed up and safe, linked to their email address.

**Account linking flow -- Google:**
Single tap. Confirm intent. Handle error state.

**Account linking flow -- email:**
Email input, password input, password confirmation, submit. Error states for: email already in use, weak password, network failure. Password reset link.

**Password reset:**
Email input, confirmation message, instructions to check email.

**Error states (all):**
Must communicate what went wrong in plain English and what the user can do next.

### Surface and placement

The exact placement and visual design of the reminder element are to be determined by the Designer. The Designer brief should reference these behaviour requirements.

The Designer should consider:
- The reminder must not disrupt the primary purpose of the Me tab (viewing stats, accessing walk journal, settings)
- It should feel like a helpful notice, not a warning or a gate
- It should be visually distinct enough to be noticed without being obtrusive
- Once replaced by account status, the status element should feel like a positive confirmation, not a settings row

---

## Section 4 -- Sync Architecture (Option C Hybrid)

### Decision confirmed (D6)

The hybrid sync approach is confirmed. localStorage renders the UI instantly. Firestore reconciliation happens in the background on every app load. Firestore's own offline persistence (IndexedDB) provides a second resilience layer.

### The three-tier data stack

```
Tier 1: localStorage (app-controlled)
  Always available. Renders UI immediately on load.
  Written on every user action (save walk, update profile, etc.)
  Source of truth for all UI rendering.

Tier 2: Firestore IndexedDB cache (SDK-controlled)
  Managed automatically by the Firestore SDK.
  Fast. Works offline.
  Returns cached data before making a network request.
  Separate from the app's localStorage -- sits between Tier 1 and Tier 3.

Tier 3: Firestore server (authoritative, network-dependent)
  europe-west2 (London). Cannot be changed.
  Written async on every user action (fire and forget, existing pattern).
  Read on app load via the reconciliation step.
  The durable record -- survives device loss for linked users.
```

### Sync sequence on app load

```
1. Read localStorage
   -- Render UI immediately. No delay.

2. Sign in (anonymous auth resolves, usually instant -- user already signed in)

3. Firestore SDK returns data from IndexedDB cache
   -- Fast. Works offline (no network needed for this step).

4. Merge Firestore data into localStorage per collection:
   a. Dog profile: compare updatedAt timestamps.
      Firestore wins if its record is newer.
   b. Walk log: union. Add any Firestore entries not in localStorage.
      Never delete from either source.
   c. Saved walks: union. Add any Firestore saves not in localStorage.
      Never delete.
   d. Reviews: compare updatedAt per review.
      Firestore wins if its record is newer.
   e. Saved places: union. Add any Firestore places not in localStorage.
      Never delete.

5. Re-render only changed UI sections (not a full re-render)

6. (Background, async) Firestore SDK reconciles its IndexedDB cache with server
   -- Invisible to the user. Queued writes replay if offline.
```

### Sync sequence on user action

```
User saves a walk, updates a profile, adds a review, etc.:
1. Write to localStorage immediately
   -- UI updates instantly. No waiting.
2. Write to Firestore async (fire and forget)
   -- Existing pattern. Silent failure is acceptable.
   -- Firestore SDK queues writes if offline. Replays when connectivity returns.
```

### Conflict resolution rules (D7)

| Data type | Rule | Rationale |
|-----------|------|-----------|
| Dog profile | Firestore wins if `updatedAt` is newer | Profile changes are deliberate. Firestore is the durable record. |
| Walk log entries | Union -- never delete. Each entry is a separate Firestore document. | Walk log is append-only. A missing entry in one source is not a deletion intent. A user who logs a walk offline must not lose it. |
| Saved walks | Union -- never delete. | Removing a favourite is an explicit user action. Absence in Firestore does not mean the user removed it. |
| Reviews | Firestore wins if `updatedAt` is newer | Deliberate updates. Firestore is authoritative. |
| Saved places | Union -- never delete. | Same rationale as saved walks. |

**The "union, never delete" rule for walk log is the most important in this spec.** Any implementation that could delete a walk log entry during reconciliation is wrong. Err on the side of keeping data.

### New device / cleared storage scenario

This is the scenario that drives the need for cloud sync:

```
1. User installs Sniffout on a new phone (or clears browser data)
2. localStorage is empty -- app shows State A (first-run screen)
3a. If the user has a linked account:
    -- User signs in with Google or email
    -- Firebase resolves their UID
    -- Firestore sync runs -- pulls full walk log, dog profile, saves from Firestore
    -- localStorage is populated
    -- User sees "You and Biscuit have done 34 walks together"
3b. If the user has no linked account (permanently anonymous):
    -- A new UID is generated
    -- Firestore sync returns empty (old UID's data is still in Firestore but unreachable)
    -- User loses all data
    -- This is why the persistent reminder (Section 3) is critical
```

### Sync indicator (D8)

**Brief toast on first sync only. Silent ongoing.**

When the very first Firestore sync completes successfully (detected by: all five migration flags not yet set, all five batches complete, no previous sync toast shown), show a brief toast notification. The toast is shown once per installation, never again.

Subsequent syncs (on every subsequent app load) are entirely silent. No persistent sync indicator, no spinner, no status text.

The toast text is to be written by the Copywriter. It needs to communicate that the user's data is now backed up, in one short sentence. It disappears automatically after approximately 3 seconds.

---

## Section 5 -- Data Migration Path

### What needs migrating

The Firebase foundation went live on 22 March 2026. Since that date, Firestore dual-write has been active for walk log entries. The migration scope is:

| Collection | Pre-22 March data | Post-22 March data |
|-----------|-------------------|--------------------|
| Walk log (text) | localStorage only -- needs migrating | Already in Firestore via dual-write |
| Dog profile | May already be in Firestore via `fsWriteUserProfile()` -- reconcile | Already in Firestore if updated since 22 March |
| Saved walks | May be partially in Firestore via `fsWriteSavedWalk()` -- reconcile | Partially in Firestore |
| Reviews | localStorage only -- needs migrating | Not dual-written -- needs full migration |
| Saved places | localStorage only -- needs migrating | Not dual-written -- needs full migration |
| Walk photos | Base64 in localStorage -- lazy migration | Base64 in localStorage -- lazy migration |

### Migration flags -- idempotent detection

Use per-collection migration flags in localStorage. Do not use a single global flag. If the migration is interrupted mid-way (network drops, app closed), per-collection flags ensure that only the incomplete collections are retried.

The migration detection logic runs on every app load after anonymous auth resolves:

```
For each collection:
  If migration flag for this collection is absent:
    And localStorage data exists for this collection:
      Queue migration for this collection
    Else (no local data to migrate):
      Set migration flag immediately (nothing to do)
  Else (flag already set):
    Skip -- already migrated
```

This is safe to run on every app load. Already-migrated collections are skipped immediately.

### Migration sequence -- text data

Run in this order. Each step uses a Firestore batched write (atomic -- either the whole batch succeeds or nothing is written). Split batches if a collection exceeds 500 items.

| Order | Collection | Complexity | Notes |
|-------|-----------|-----------|-------|
| 1 | Dog profile | Low | Single document write. May already be in Firestore. Compare `updatedAt` -- write only if localStorage is newer. |
| 2 | Saved walks | Low | Array of walk IDs. Write each as a document in `savedWalks` subcollection. Skip IDs already present in Firestore (union rule). |
| 3 | Reviews | Medium | Object of review entries keyed by walk ID. Write each as a document in `reviews` subcollection. |
| 4 | Saved places | Medium | Array of place objects. Write each as a document in `savedPlaces` subcollection. |
| 5 | Walk log (text only) | Medium | Array of walk log entries. Write each as a document in `walkLog` subcollection. Do not include base64 photo data in the Firestore write -- photo migration is handled separately in the lazy step. |

After each collection's batch write completes successfully, set the corresponding migration flag in localStorage. If a batch fails, do not set the flag -- retry on next app load.

### Migration -- walk photos (lazy, deferred)

Walk photos stored as base64 strings in localStorage walk log entries are NOT migrated as part of the batch. They are migrated lazily when the entry is displayed.

```
When a walk log entry with a base64 photo is displayed in the walk journal:
  If photoDataUrl exists (base64) AND photoUrl does not exist (Firebase Storage URL):
    -- Resize image client-side to max 1200px wide (canvas API, no library needed)
    -- Upload to Storage: users/{uid}/walkPhotos/{entryId}.jpg
    On success:
      -- Write photoUrl to Firestore walk log entry document
      -- Write photoUrl to localStorage walk log entry
      -- Remove photoDataUrl from localStorage entry (to free storage space)
    On failure:
      -- Silently fail. Try again next time the entry is displayed.
```

This spreads the upload work invisibly across normal app usage. A user with 20 walk photos migrates them over days or weeks as they browse their journal. No explicit migration messaging is needed for photos.

**Why not migrate photos eagerly:** A single mobile photo can be 200-800 KB as base64. A user with 20 walk photos would initiate 4-16 MB of uploads at migration time, likely failing on a slow connection and blocking them from using the app. Lazy migration is the correct approach.

### Migration failure handling

**Per-collection failures:** If a batched write fails (network error, Firestore quota, etc.), the flag for that collection is not set. The migration retries automatically on the next app load. Batched writes are atomic -- there is no partial-write state to unwind.

**Repeated failures (3 attempts across 3 separate app loads):** Surface a non-blocking notice in the Me tab. The notice must communicate that some data has not synced yet and suggest connecting to Wi-Fi. Copy to be written by Copywriter. This is a safety net only -- most users will not see it.

**If localStorage is cleared before migration completes:** Data loss for un-migrated collections. This is an unrecoverable scenario. It is why the migration must run promptly on first load after Phase 3 goes live, not on a deferred schedule. The sooner data reaches Firestore, the smaller the risk window.

### Migration communication to users (D11)

**Silent migration with brief toast on completion.**

There is no migration screen, no progress bar, no loading state. The migration runs entirely in the background on first load. The user can use the app normally while it runs.

When all five collection migration flags are set (migration complete), show a brief toast. The toast is shown once only. It is not a modal. It dismisses automatically. Copy to be written by Copywriter -- needs to communicate that data is now backed up.

### Migration scope for permanently-anonymous users (D12)

**Migrate all users' data to Firestore, regardless of whether they have linked an account.**

A permanently-anonymous user's data is migrated to Firestore under their anonymous UID. This provides a backup in case data is recovered before the UID is lost (for example, the user gets a new phone but still has access to the old phone for a short time). If the user later links an account, their data is already in Firestore waiting for them under the same UID.

The limitation for permanently-anonymous users remains: if the anonymous UID is lost (browser cleared, new phone, etc.), the Firestore data at the old UID is unreachable. This is why the persistent reminder (Section 3) must be visible and effective.

---

## Section 6 -- Right to Erasure

### Decision confirmed (D10)

The right to erasure ("Delete all my data") feature must be built and tested before the migration goes live. This is a hard requirement -- not a nice-to-have.

Rationale: once data is stored in Firestore, the app is processing personal data (behavioural data linked to a pseudonymous UID). UK GDPR Article 17 gives users the right to request deletion of their data. This must be implemented before any real user data moves to Firestore.

### Location in the app

Me tab -- gear icon -- settings sheet. A "Delete all my data" option sits at the bottom of the settings sheet, visually separated from other settings. Tap opens a confirmation step (not immediate deletion). The Designer spec for this element should ensure the action cannot be triggered accidentally.

### The full delete sequence

The Developer must implement the following sequence in full. All steps are required.

```
User confirms "Delete all my data" in Me tab settings:

1. Delete all Firestore subcollections:
   -- /users/{uid}/walkLog (delete each document)
   -- /users/{uid}/savedWalks (delete each document)
   -- /users/{uid}/reviews (delete each document)
   -- /users/{uid}/savedPlaces (delete each document)
   Note: Firestore does not support recursive client-side deletes.
   Query each subcollection and delete documents individually.
   For Phase 3, client-side sequential deletion is acceptable.
   Phase 4+ can use a Cloud Function with admin SDK for efficiency.

2. Delete the /users/{uid} document

3. Delete all Firebase Storage files at users/{uid}/
   -- List all files at users/{uid}/walkPhotos/
   -- Delete each file

4. Clear all sniffout_ localStorage keys
   Note: clear EVERY key with the sniffout_ prefix, plus walkReviews and recentSearches.
   See CLAUDE.md for the full key list.

5. Sign out from Firebase Auth
   -- auth.signOut()

6. If the user has a linked account (Google or email):
   -- Also delete the Firebase Auth account: user.delete()
   -- This requires recent authentication. If the session is old, prompt
      re-authentication before deletion.

7. Confirm deletion to the user
   -- Show a confirmation screen (not a toast -- this is a significant action)
   -- App resets to State A (first-run screen)
   -- The anonymous auth call on next load creates a fresh UID

```

### Confirmation step design

The Designer spec must include:
- A clear warning before deletion (what will be lost)
- A confirmation step that requires a deliberate action (not a single tap)
- A non-recoverable action indicator (the data cannot be restored)

Copy for the confirmation step and warning must go through Copywriter and Editor. The copy must communicate clearly what is being deleted without being alarmist.

### Testing requirement

The complete delete sequence must be tested end-to-end (including Firestore document deletion, subcollection deletion, Storage file deletion, localStorage clear, and auth signout) before Phase 3 goes live. Test with a real Firestore document that has all subcollections populated.

---

## Section 7 -- New localStorage Keys

Five new keys are added by Phase 3. All follow the existing `sniffout_` prefix convention. They should be added to CLAUDE.md when Phase 3 implementation begins.

| Key | Type | Set when | Notes |
|-----|------|----------|-------|
| `sniffout_migrated_v1_profile` | boolean | Dog profile migration batch completes | The `_v1` suffix allows future migrations without conflict |
| `sniffout_migrated_v1_walklog` | boolean | Walk log text migration batch completes | Photos are a separate lazy step -- this flag covers text only |
| `sniffout_migrated_v1_savedwalks` | boolean | Saved walks migration batch completes | |
| `sniffout_migrated_v1_reviews` | boolean | Reviews migration batch completes | |
| `sniffout_migrated_v1_savedplaces` | boolean | Saved places migration batch completes | |

These are write-once flags. Once set, they are never unset (unless the user deletes all their data, which clears all localStorage keys).

They are not displayed in the UI. They are internal migration state only.

**No other new localStorage keys are added by Phase 3.** All other Phase 3 data (home location, notification preferences, FCM token) is covered by the push notifications spec.

---

## Section 8 -- Implementation Sequence

The 7-step sequence below is the confirmed build order. Push notifications build (already spec'd) can run in parallel with Steps 2-5.

| Step | Task | Notes |
|------|------|-------|
| 1 | Right to erasure -- build and test "Delete all my data" in Me tab settings | Gates go-live. Build first so it is ready when migration goes live. Full delete sequence in Section 6. |
| 2 | localStorage migration logic -- per-collection flags, batched writes to Firestore | No dependencies. Can start immediately. Text data only -- photos handled in Step 5. |
| 3 | Firestore reconciliation on load -- hybrid sync logic (Section 4 sync sequence) | Depends on Step 2 being designed. Can be built in parallel. |
| 4 | Account linking flow -- Google and email in Me tab (Section 3) | Depends on D1-D5 decisions being confirmed (all confirmed). Designer and Copywriter briefs required before implementation. |
| 5 | Lazy photo migration -- on walk log render (Section 5) | Depends on Step 2 complete. |
| 6 | "Delete all my data" end-to-end test | Step 1 must be complete. Run with a real populated Firestore document. |
| 7 | Phase 3 go-live | L1 sign-off (GDPR) must be confirmed. Right to erasure must pass end-to-end test (Step 6). |

**Push notifications can run in parallel with Steps 2-5.** Push notification build prerequisites are: Firebase full migration complete (all steps above complete). Go-live prerequisites for push notifications are separate (solicitor review of notification consent mechanism).

---

## Section 9 -- Dependencies and Blockers

### Build vs go-live distinction (D9)

Development of Phase 3 can proceed immediately. The migration must not run for real users until GDPR sign-off (L1) is confirmed. This matches the existing Phase 3 gating for push notifications.

| Activity | Requirement |
|----------|------------|
| Start building Steps 1-6 | No external gate. Can begin now. |
| Test with developer's own device | No external gate. |
| Test with 2-3 internal beta testers (controlled) | Owner decision required, not L1 sign-off |
| Go-live (real users' data moves to Firestore) | L1 GDPR sign-off required. Right to erasure must be complete. |
| Push notifications go-live | L1 sign-off + solicitor review of notification consent |

### GDPR considerations for this migration

The migration moves data from a device-local store (localStorage) to a cloud store (Firestore, europe-west2). This is a material change to data processing. The solicitor engagement (L1) must specifically address:

- The lawful basis for storing walk log, dog profile, photos, and reviews in Firestore
- Privacy policy update to disclose cloud storage and the Firebase processor relationship
- Whether anonymous auth constitutes processing personal data under UK GDPR (it does -- behavioural data linked to a pseudonymous UID is personal data)
- The right to erasure implementation and how users can exercise it
- Data retention policy for permanently-anonymous users whose UID is lost

### Current hard blockers

| Blocker | Status | Notes |
|---------|--------|-------|
| L1 -- GDPR sign-off | Not started | Owner must engage solicitor. Target: at least 4 weeks before any beta launch date. |
| L2/L3 -- Privacy policy / ToS | Blocked on L1 | Must disclose Firestore processing before migration goes live. |
| Right to erasure (Section 6) | Not built | Must be built before go-live. No external dependencies -- can start now. |
| Designer spec for reminder element | Not started | Required before account linking flow can be implemented. |
| Copywriter brief for all strings | Not started | Required before Developer implements any user-facing strings. |

### No technical hard blockers

Firebase project `sniffout-fe976` is already set up. Anonymous auth is live. Firestore dual-write is active for walk log. Firebase Storage is active. The Developer can begin Steps 1-3 immediately with no external dependencies.

---

## Section 10 -- Firestore Schema Reference

This section extends the schema defined in `docs/research/firebase-setup-plan.md` and `docs/specs/push-notifications-phase3-spec.md`. Read both documents before implementing.

### Top-level collections

```
/users     -- one document per user (keyed by Firebase UID)
/walks     -- future: community walk submissions (Phase 4+, not Phase 3)
```

### User document (full Phase 3 schema)

```
/users/{uid}

  -- Identity
  displayName:           string         -- from sniffout_username
  createdAt:             timestamp      -- set on first document write, never updated
  lastSeen:              timestamp      -- updated on each app load
  authLinked:            boolean        -- true if user has linked Google or email account
  linkedProvider:        string         -- 'google' | 'email' | null

  -- Dog profile
  dogs: [                               -- from sniffout_dogs (plural array)
    {
      name:              string
      breed:             string
      size:              string         -- 'small' | 'medium' | 'large'
      age:               string         -- 'puppy' | 'adult' | 'senior' (or derived from birthday)
      birthday:          string         -- ISO date string (YYYY-MM-DD), optional
      tags:              array          -- e.g. ['brachycephalic', 'double-coat']
    }
  ]
  dogsUpdatedAt:         timestamp      -- used for conflict resolution (Firestore wins if newer)

  -- Home location (from push notifications spec)
  homeLocation: {
    postcode:            string
    lat:                 number
    lon:                 number
    label:               string
    setAt:               timestamp
  }

  -- Notification preferences (from push notifications spec)
  notificationsEnabled:  boolean
  notificationPrefs: {
    extremeHeat:         boolean
    pawHeat:             boolean
    storm:               boolean
    dangerousWind:       boolean
    freeze:              boolean
  }
  fcmToken:              string         -- FCM registration token for this device/browser
```

### Walk log subcollection

```
/users/{uid}/walkLog/{entryId}

  entryId:               string         -- generated client-side (timestamp + random suffix)
  type:                  string         -- 'curated' | 'custom'
  walkId:                string         -- WALKS_DB id (for type: 'curated'); null for type: 'custom'
  walkName:              string         -- walk.name for curated; user-entered name for custom
  location:              string         -- walk.location for curated; null for custom
  distance:              number         -- miles; null if custom and not provided
  date:                  timestamp      -- when the walk was logged
  note:                  string         -- optional user note
  dogId:                 string         -- ID of the dog logged against (optional, from sniffout_dogs)
  photoUrl:              string         -- Firebase Storage URL (replaces base64 after lazy migration)
  conditionTags:         array          -- condition tags submitted at time of logging
  createdAt:             timestamp
  updatedAt:             timestamp

  -- Note: do not write photoDataUrl (base64) to Firestore documents.
  -- Photos are migrated lazily -- see Section 5. Until migration, photoUrl is null.
```

### Saved walks subcollection

```
/users/{uid}/savedWalks/{walkId}

  walkId:                string         -- the WALKS_DB walk ID, also the document ID
  savedAt:               timestamp
  listType:              string         -- 'favourite' | 'wishlist' (maps to sniffout_favs vs sniffout_wishlist)
```

### Reviews subcollection

```
/users/{uid}/reviews/{walkId}

  walkId:                string         -- WALKS_DB id, also the document ID
  rating:                number         -- 1-5
  note:                  string         -- optional text review
  createdAt:             timestamp
  updatedAt:             timestamp      -- used for conflict resolution (Firestore wins if newer)
```

### Saved places subcollection

```
/users/{uid}/savedPlaces/{placeId}

  placeId:               string         -- Google Places ID, also the document ID
  name:                  string
  category:              string         -- 'cafe' | 'pub' | 'vet' | 'pet_shop' | 'park'
  address:               string
  lat:                   number
  lon:                   number
  savedAt:               timestamp
  mapsUrl:               string
```

### localStorage to Firestore mapping (full reference)

| localStorage key | Synced to Firestore | Notes |
|-----------------|--------------------|-|
| `sniffout_dogs` | `users/{uid}.dogs` | Plural array. `sniffout_dog` is deprecated. |
| `sniffout_favs` | `users/{uid}/savedWalks` (listType: 'favourite') | |
| `sniffout_wishlist` | `users/{uid}/savedWalks` (listType: 'wishlist') | |
| `sniffout_walk_log` | `users/{uid}/walkLog` | |
| `walkReviews` | `users/{uid}/reviews` | No `sniffout_` prefix -- legacy key |
| `sniffout_saved_places` | `users/{uid}/savedPlaces` | |
| `sniffout_username` | `users/{uid}.displayName` | |
| `sniffout_home_location` | `users/{uid}.homeLocation` | See push notifications spec |
| `sniffout_notification_prefs` | `users/{uid}.notificationsEnabled` + `notificationPrefs` + `fcmToken` | See push notifications spec |
| `sniffout_session` | **Not synced** | Ephemeral weather/location cache. Device-local only. |
| `sniffout_active_tab` | **Not synced** | UI state. Device-local only. |
| `sniffout_explored` | **Not synced** | Passive tracking. Low sync value. |
| `sniffout_theme` | **Not synced** | Device preference. |
| `sniffout_radius` | **Not synced** | Device preference. |
| `sniffout_units` | **Not synced** | Device preference. |
| `recentSearches` | **Not synced** | Ephemeral. No `sniffout_` prefix -- legacy key. |
| `sniffout_recent_walks` | **Not synced** | Session convenience. Not worth syncing. |

---

## Section 11 -- Browser Support Notes

Anonymous auth and the Firestore offline persistence layer have specific browser dependencies that the Developer must be aware of.

### IndexedDB requirement

Firestore's offline persistence (`enablePersistence()`) and anonymous auth UID storage both require IndexedDB. IndexedDB is not available in:

- Incognito / private browsing mode in some browsers (notably Safari in Private mode)
- Some embedded browser contexts (WebViews)
- Very old browsers (not a practical concern for Sniffout's target audience)

**In incognito mode:** Firebase's anonymous auth will still work (creates a UID), but the UID is not persisted across sessions. If the user closes the incognito tab and reopens it, they get a new UID. Data associated with the old UID is unreachable. This is a known limitation of incognito mode -- do not try to work around it. The persistent reminder copy should note that using the app in private browsing is not recommended for users who want their data saved.

**Graceful degradation:** If `enablePersistence()` fails (for example, IndexedDB is unavailable), catch the error silently. The app continues to function. The Firestore SDK still communicates with the server but without the local IndexedDB cache layer. A warning can be logged to the console for Developer reference but must not surface to the user.

### Safari-specific notes

Safari on iOS has historically had issues with IndexedDB quotas and storage eviction for PWAs. Key risks:

- Safari may evict IndexedDB data (including Firebase auth state) if the user does not open the PWA for 7 days (iOS 16.4 and earlier behaviour)
- This means a user who opens Sniffout as a home screen PWA on iOS and does not use it for a week may find themselves signed in with a new anonymous UID
- iOS 16.4 and later improved this, but the risk is not fully eliminated
- **Mitigation:** The persistent reminder (Section 3) is the primary mitigation -- linked accounts are not affected by Safari eviction because the credentials survive the UID loss

The Developer does not need to implement special Safari handling for Phase 3. This is a known platform limitation. It is noted here for the copy brief: the reminder copy may need to acknowledge that iOS users are particularly encouraged to link an account.

### Multiple tabs

`enablePersistence({ synchronizeTabs: true })` is already in the initialisation code (from `firebase-setup-plan.md`). This setting coordinates IndexedDB cache access across multiple browser tabs, preventing conflicts. Keep this setting in place.

If `synchronizeTabs: true` is not supported (older browsers), `enablePersistence()` fails with `failed-precondition`. Catch this error silently. The app continues without offline persistence.

### Copy brief note for anonymous auth limitations

The Copywriter brief for the persistent reminder (Section 3) should include context on when the anonymous UID can be lost:

- Clearing browser data
- Switching browsers
- Incognito / private mode
- New phone or factory reset
- (iOS only) Possible eviction after extended non-use on home screen PWA

The copy must communicate this risk in friendly, non-alarming language. The goal is to inform the user so they can take protective action (linking an account), not to make them feel the app is unsafe. Frame it as: "your data is on this device" not "your data could disappear."

---

## Appendix -- Copy Pipeline Checklist

All user-facing strings in this feature must go through the full copy pipeline before Developer implementation:

```
Copywriter writes first draft
  -- Editor reviews (voice, rule compliance, quality)
    -- PO reviews (accuracy, completeness, compliance with spec)
      -- Developer implements
```

**Strings requiring copy pipeline:**

- [ ] Persistent reminder element (pre-linked state) -- Section 3
- [ ] Account status element (post-linked, Google) -- Section 3
- [ ] Account status element (post-linked, email) -- Section 3
- [ ] Account linking flow -- Google (confirm intent, error state) -- Section 3
- [ ] Account linking flow -- email (all form states, error states) -- Section 3
- [ ] Password reset flow (input, confirmation, instructions) -- Section 3
- [ ] First sync toast -- Section 4
- [ ] Migration complete toast -- Section 5
- [ ] Migration failure notice (3 attempts failed) -- Section 5
- [ ] "Delete all my data" confirmation warning -- Section 6
- [ ] Deletion confirmed screen -- Section 6
- [ ] Incognito / private mode notice (if implemented) -- Section 11

**Copy rules that apply to all strings in this feature:**

- No em dashes or en dashes. Hyphens only.
- No "free", "no sign-up", "no account", or "no login" -- exception: "create a free account" may be acceptable if it clarifies there is no cost to linking. Copywriter to flag; Editor to confirm.
- No paw emoji except in the paw safety block.
- All strings must pass Editor review before Developer implementation.
