# Firebase Setup and Architecture Plan — Sniffout

> **Status:** Planning document — Phase 3 pre-work
> **Date:** 2026-03-20
> **Audience:** Section 1 is for the Owner. Section 2 is for the Developer.
> **Scope:** No code changes. This document covers console setup and architecture decisions only.

---

# Section 1 — Console Setup (Owner)

This section walks you through setting up a Firebase project from scratch. No technical experience is required. You will be clicking through the Firebase console, not writing any code. Estimated time: 30–45 minutes.

---

## Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with your Google account (use the same Google account you use for other Sniffout services).
2. Click **Add project** (or **Create a project** if this is your first).
3. Enter the project name: **Sniffout** (or `sniffout-prod` if you want to distinguish it from a future test project).
4. **Google Analytics:** You will be asked whether to enable Google Analytics for the project. For now, select **No** — Sniffout uses privacy-respecting analytics separately and does not need Firebase Analytics.
5. Click **Create project** and wait for it to provision (usually 30–60 seconds).
6. Click **Continue** when the project is ready. You are now in the Firebase console for your Sniffout project.

> **Important:** The project ID that Firebase generates (e.g. `sniffout-prod-a1b2c`) cannot be changed after creation. It does not appear in your app but it is permanent. Make a note of it.

---

## Step 2 — Enable Firestore (your database)

Firestore is the database that will store walk logs, dog profiles, saved walks, and saved places. It replaces nothing yet — your existing app still uses localStorage — but this is where the data will eventually live.

1. In the left sidebar, click **Build** then **Firestore Database**.
2. Click **Create database**.
3. You will be asked to choose a security mode. Select **Start in production mode**. (The Developer will configure the correct rules before any real users connect — do not choose test mode, which leaves your database publicly writable.)
4. You will be asked to choose a Cloud Firestore location. This is the most important step: **select `europe-west2 (London)`**. This cannot be changed after creation and determines where user data is physically stored, which is a legal requirement for UK GDPR compliance.
5. Click **Enable** and wait for the database to provision.

> **Why europe-west2 matters:** UK data residency requires that user data is stored in the UK. `europe-west2` is Google's London region. Once set, this cannot be moved without creating a new project. Get it right now.

---

## Step 3 — Enable Firebase Authentication

Firebase Authentication manages user identity. For Sniffout's Phase 3 launch, you will use **anonymous authentication** — users get a persistent, invisible identity without creating an account or entering an email address. This preserves the no-login experience.

1. In the left sidebar, click **Build** then **Authentication**.
2. Click **Get started**.
3. You will see a list of sign-in providers. Click on **Anonymous**.
4. Toggle **Enable** to on.
5. Click **Save**.

That is all that is needed for Phase 3. Email/password, Google sign-in, and other providers can be added later without disrupting users who signed in anonymously.

> **Note:** Anonymous users who later create an account can have their data merged — this is handled in code by the Developer when the time comes. No action needed from you now.

---

## Step 4 — Enable Firebase Storage

Firebase Storage holds walk photos uploaded by users. It replaces the current approach of storing photos as large base64 strings in localStorage (which causes performance problems as photos accumulate).

1. In the left sidebar, click **Build** then **Storage**.
2. Click **Get started**.
3. You will be asked to review security rules. Click **Next** — the Developer will write proper rules before launch.
4. You will be asked to choose a location. **Select `europe-west2`** to match your Firestore region.
5. Click **Done**.

---

## Step 5 — Register a Web App and Get the Config

Your Sniffout PWA needs a configuration object (a block of settings) that tells it which Firebase project to connect to. You generate this in the console.

1. From the Firebase console home page (click the flame icon at the top of the sidebar), click the **`</>`** icon (Web) to add a web app.
2. Enter a nickname for the app: **Sniffout PWA**.
3. **Do not** tick "Also set up Firebase Hosting" — Sniffout is hosted on GitHub Pages, not Firebase Hosting.
4. Click **Register app**.
5. Firebase will display a code block that looks like this:

```
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sniffout-prod-xxxxx.firebaseapp.com",
  projectId: "sniffout-prod-xxxxx",
  storageBucket: "sniffout-prod-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. **Copy this entire block and send it to the Developer.** Do not share it publicly (it is safe to share with your developer privately — it is not a secret key, but it should not be posted on social media or in a public GitHub repository without restriction rules in place).
7. Click **Continue to console**.

---

## Step 6 — Billing and Quota Notes

Firebase has a free tier (the **Spark plan**) that is sufficient for Sniffout at POC stage.

| What you get free | Limit |
|---|---|
| Firestore reads | 50,000 per day |
| Firestore writes | 20,000 per day |
| Firestore deletes | 20,000 per day |
| Firestore storage | 1 GB |
| Firebase Storage (files) | 5 GB stored, 1 GB/day download |
| Authentication | Unlimited anonymous users |

**For context:** 50,000 Firestore reads per day is roughly 500–1,000 active users making moderate use of the app. Sniffout is well within this at POC stage.

**What triggers billing:** If you exceed free-tier limits, Firebase will not charge you automatically on the Spark plan — it will simply stop serving requests until the next day. To enable paid usage, you must manually upgrade to the **Blaze plan** (pay-as-you-go). The Developer will advise when this becomes appropriate.

**The Blaze plan** links a credit card to the project. Google provides $300 free credit for new accounts. For a small PWA at early stage, actual monthly costs after the free tier are typically a few pounds at most.

> **Recommendation:** Stay on the Spark plan until soft launch. Once real users are using the app, review usage in the Firebase console under **Usage and billing** and upgrade to Blaze only when approaching limits. Set a billing alert at £5/month as an early warning.

---

# Section 2 — Technical Architecture (Developer)

This section maps the existing Sniffout localStorage data model onto Firebase, defines the Firestore schema, and covers integration approach for a single-HTML-file PWA with no build step.

---

## 2.1 — Current localStorage Keys → Firestore Collections

| localStorage key | Current contents | Firestore equivalent |
|---|---|---|
| `sniffout_favs` | Array of walk IDs | `users/{uid}/savedWalks` |
| `walkReviews` | Object of walk reviews keyed by walk ID | `users/{uid}/reviews` (subcollection) |
| `sniffout_walk_log` | Array of walk log entries | `users/{uid}/walkLog` (subcollection) |
| `sniffout_username` | Display name string | `users/{uid}` (document field) |
| `sniffout_dog` | Dog profile object | `users/{uid}` (document field) |
| `sniffout_saved_places` | Array of saved venue objects | `users/{uid}/savedPlaces` |
| `sniffout_session` | Location + weather cache, 8h TTL | **Stays in localStorage only** — ephemeral, no sync needed |
| `sniffout_active_tab` | Last active tab | **Stays in localStorage only** — UI state, no sync needed |
| `sniffout_explored` | Set of viewed walk IDs | **Stays in localStorage only** — passive tracking, low value to sync |
| `sniffout_theme` | Light/auto/dark preference | **Stays in localStorage only** — device preference |
| `sniffout_radius` | Search radius preference | **Stays in localStorage only** — device preference |
| `recentSearches` | Recent postcode searches | **Stays in localStorage only** |

**Rule of thumb:** If it is user-generated content or cross-device data (walk log, dog profile, saves, reviews), sync it to Firestore. If it is ephemeral state or device preference, leave it in localStorage.

---

## 2.2 — Recommended Firestore Data Model

### Top-level collections

```
/users                        ← one document per user (keyed by Firebase UID)
/walks                        ← future: community walk submissions (Phase 3+)
```

### User document

```
/users/{uid}
  displayName:   string       ← from sniffout_username
  createdAt:     timestamp
  lastSeen:      timestamp
  dog: {                      ← from sniffout_dog
    name:        string
    breed:       string
    size:        string       ← 'small' | 'medium' | 'large'
  }
```

### Walk log subcollection

```
/users/{uid}/walkLog/{entryId}
  walkId:        string       ← references WALKS_DB id
  walkName:      string
  location:      string
  distance:      number       ← miles
  date:          timestamp
  note:          string
  photoUrl:      string       ← Firebase Storage URL (replaces base64)
  createdAt:     timestamp
```

**Migration note:** The existing localStorage schema uses `photoDataUrl` (base64). When the sync layer is written, any existing base64 photos should be uploaded to Firebase Storage and the URL stored in `photoUrl` instead. Base64 in Firestore documents is expensive — each 1 MB photo costs ~6× more in Firestore reads than storing a URL pointing at Storage.

### Saved walks subcollection

```
/users/{uid}/savedWalks/{walkId}
  walkId:        string       ← the walk ID string is also the document ID
  savedAt:       timestamp
```

No need to store walk data here — `walkId` references WALKS_DB which is hardcoded in the app. Keep this collection lean.

### Reviews subcollection

```
/users/{uid}/reviews/{walkId}
  walkId:        string
  rating:        number       ← 1–5
  note:          string
  createdAt:     timestamp
  updatedAt:     timestamp
```

**Future consideration:** If reviews become public (Phase 3 social), add a `/reviews` top-level collection that aggregates them. For Phase 3 launch, user-owned reviews only.

### Saved places subcollection

```
/users/{uid}/savedPlaces/{placeId}
  placeId:       string       ← Google Places ID
  name:          string
  category:      string       ← 'cafe' | 'pub' | 'park' | 'pet_shop'
  address:       string
  lat:           number
  lon:           number
  savedAt:       timestamp
  mapsUrl:       string
```

---

## 2.3 — Anonymous Authentication: How It Works and Why It Fits

### How it works

When the app first loads and calls `signInAnonymously()`, Firebase creates a real user account with a unique UID (e.g. `xK9mQ2pLrNv8wZtA...`). This UID is persisted in the browser (in IndexedDB, not localStorage) and survives page refreshes. It does **not** survive:

- The user clearing all browser data
- The user switching to a different browser or device
- The user using a private/incognito window

The UID is invisible to the user. There is no sign-in screen, no email, no password.

### Why it is the right starting point

Sniffout's core promise is no login required. Anonymous auth honours that promise while giving each user a stable, unique identity that Firestore can use to namespace their data. Without it, every user's data would share the same namespace, which is unworkable.

When users later want to recover their data on a new device, the upgrade path is:
1. User creates an account (email/password or Google) — one tap
2. Firebase merges the anonymous account into the new account
3. All data (walk log, dog profile, saves) transfers automatically

The Developer does not need to build this for Phase 3 launch — anonymous auth alone is sufficient to start. The merge flow can be a Phase 4 feature.

### Auth persistence

Firebase Auth defaults to `browserLocalPersistence` on web — the user stays signed in across sessions automatically. No action needed from the Developer.

---

## 2.4 — localStorage as Cache, Firestore as Source of Truth

The recommended sync pattern for a no-build-step PWA is: **write to localStorage first (immediate), sync to Firestore in the background (async), read from Firestore on first load (then cache locally).**

```
On app start:
  1. Read from localStorage (instant — renders UI immediately)
  2. Sign in anonymously (if not already)
  3. Fetch latest data from Firestore in background
  4. Merge Firestore data into localStorage (Firestore wins on conflict)
  5. Re-render any updated UI

On user action (save walk, add review, etc.):
  1. Write to localStorage immediately (UI updates instantly)
  2. Write to Firestore async (fire and forget, handle errors silently)

On app offline:
  Firestore SDK has built-in offline persistence — enable it.
  Queued writes replay when connectivity resumes.
```

**Why localStorage first:** Avoids any perceived latency. The app feels instant because local data renders immediately. Firestore sync happens behind the scenes.

**Conflict resolution:** Timestamp-based. If Firestore has a `walkLog` entry with a newer `updatedAt` than localStorage, Firestore wins. For most users who use one browser on one device, conflicts will be rare.

**Firestore offline persistence:** Enable with `enableIndexedDbPersistence(db)` (compat SDK) or `initializeFirestore(app, { localCache: persistentLocalCache() })` (modular SDK). This gives the app a Firestore-level local cache on top of the app's own localStorage cache. For a PWA this is belt-and-braces resilience.

---

## 2.5 — Firebase Storage for Walk Photos

Currently walk photos are stored as base64 strings in `sniffout_walk_log` in localStorage. This approach breaks down when photos accumulate — a single photo can be 200–800 KB as base64, and localStorage has a typical 5–10 MB total budget per origin.

### Recommended approach

```
Upload path:
  User taps photo button in walk log
    → resize image client-side to max 1200px wide (canvas API, no library needed)
    → upload to Firebase Storage at: users/{uid}/walkPhotos/{entryId}.jpg
    → get the download URL
    → store URL (not base64) in Firestore walkLog entry
    → store URL in localStorage walkLog entry

Storage structure:
  /users/{uid}/walkPhotos/{entryId}.jpg
```

**Client-side resize is important.** Mobile cameras produce 3–5 MB images. Uploading these to Storage at full size wastes quota and bandwidth. Resizing to 1200px wide before upload typically reduces file size to 100–300 KB with no perceptible quality loss for a walk card.

**Storage rules:** Only the owning user can read or write their photos (see Section 2.7).

---

## 2.6 — SDK Version and Adding to a Single HTML File

### Which SDK to use

Use the **Firebase JS SDK v9+ modular build via CDN**, specifically the compat layer which preserves the familiar `firebase.firestore()` syntax without requiring ES module imports or a bundler.

```html
<!-- Add to <head> of sniffout-v2.html, before the closing </head> -->

<!-- Firebase App (core) — always first -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<!-- Firestore -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<!-- Auth -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
<!-- Storage -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js"></script>
```

> **Note:** Version `10.12.0` is used as the reference here. Check [firebase.google.com/support/release-notes/js](https://firebase.google.com/support/release-notes/js) for the latest stable version before implementing. Pin to a specific version number — do not use `@latest` in a production CDN URL.

### Compat vs modular

The **compat** SDK allows code like `firebase.firestore().collection('users')` without ES6 import syntax — compatible with Sniffout's no-bundler, inline-script architecture. The **modular** SDK is the modern approach but requires `import` statements or a bundler. Use compat for Phase 3.

### Initialisation pattern

```js
// In sniffout-v2.html <script> block, after the Firebase CDN scripts load:

var firebaseConfig = {
  // Paste config object from console here
};

firebase.initializeApp(firebaseConfig);

var db   = firebase.firestore();
var auth = firebase.auth();
var storage = firebase.storage();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  // Persistence unavailable (e.g. multiple tabs) — not fatal
  console.warn('Firestore persistence unavailable:', err.code);
});

// Sign in anonymously on load
auth.signInAnonymously().then(function(result) {
  var uid = result.user.uid;
  // UID available — begin data sync
}).catch(function(err) {
  console.warn('Anonymous auth failed:', err);
  // App continues working with localStorage only — graceful degradation
});
```

**Graceful degradation is required.** If Firebase is unavailable (network offline, quota exceeded, SDK load failure), the app must continue functioning using localStorage only. Firebase is an enhancement layer, not a dependency.

---

## 2.7 — Security Rules Outline

Firestore and Storage both require security rules before any real user data is stored. The following is an outline — the Developer writes the actual rules in the Firebase console under **Firestore → Rules** and **Storage → Rules**.

### Firestore rules (outline)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection: each user can only read/write their own document
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      // Subcollections inherit parent rule
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Key principle:** `request.auth != null` ensures only authenticated users (including anonymous users) can access data. `request.auth.uid == uid` ensures users can only access their own data — not anyone else's.

### Storage rules (outline)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Walk photos: only the owning user can read or write
    match /users/{uid}/walkPhotos/{photo} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### What these rules do not yet cover

- Rate limiting (requires Firebase App Check — Phase 4)
- Data validation (e.g. enforcing that `rating` is 1–5) — add field-level validation rules before public launch
- Public read access for future community features — add a separate `/reviews` or `/walks` collection with appropriate rules when needed

---

## 2.8 — Phase 3 Integration Sequence (for planning)

Suggested order for the Developer to implement Firebase integration without disrupting the live app:

| Step | Task |
|------|------|
| 1 | Owner completes console setup (Section 1) and shares config object |
| 2 | Developer adds Firebase SDK CDN scripts to `sniffout-v2.html` |
| 3 | Developer implements anonymous auth + UID persistence |
| 4 | Developer writes Firestore sync for dog profile (simplest, lowest risk) |
| 5 | Developer writes Firestore sync for saved walks (`sniffout_favs`) |
| 6 | Developer writes Firestore sync for walk log (`sniffout_walk_log`) |
| 7 | Developer writes Firestore sync for reviews (`walkReviews`) |
| 8 | Developer implements Firebase Storage for walk photos |
| 9 | Developer implements Firestore sync for saved places |
| 10 | Security rules review — lock down before any public traffic |
| 11 | Test with 2–3 beta users, monitor Firestore usage in console |

localStorage remains the primary data layer throughout. Firestore is additive at each step.

---

## 2.9 — Open Questions for PO Sign-off Before Implementation

1. **Right to erasure (GDPR Article 17):** The app needs a "Delete all my data" function that removes the Firestore user document, all subcollections, and all Storage files. This must be built into the Me tab settings before any user data is stored in Firestore. Confirm with solicitor that the localStorage-only interim is acceptable until Firebase goes live.

2. **Anonymous user expiry:** Firebase does not automatically delete anonymous user accounts. Unused anonymous accounts accumulate. A Cloud Function (Phase 4) can clean up accounts inactive for 90+ days. Agree a retention policy with the solicitor.

3. **Config object security:** The Firebase config object is not a secret (it is safe in client-side code), but the API key should be restricted in the Google Cloud console to the `sniffout.app` domain to prevent misuse. The Developer should add HTTP referrer restrictions to the API key before launch.

4. **Firestore vs Realtime Database:** This plan recommends Firestore. Realtime Database is Firebase's older product and not recommended for new projects. Confirm with Developer.
