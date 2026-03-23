# Push Notifications — Phase 3 Spec

**Date:** 23 March 2026
**Status:** Approved for Phase 3 implementation
**Author:** Product Owner
**Phase:** 3 (build requires Firebase full migration -- go-live requires GDPR sign-off -- see Section 9)
**Based on:** `docs/research/push-notifications-research.md`

---

## Overview

This spec formalises the confirmed push notification feature for Sniffout. All owner decisions were made during the 22 March 2026 research review. This document is the implementation reference for the Developer. It does not introduce new decisions.

### Purpose

Push notifications allow Sniffout to surface hazard-level weather alerts for a user's home location even when the app is not open. This is the closest a PWA can get to native app behaviour for safety-critical conditions.

The feature is hazard-only at launch. It extends the existing in-app hazard system (which shows warning cards when a user opens the app) into a proactive alert that can reach a user before they leave the house. The same threshold logic that drives in-app hazard cards drives notifications -- no new logic is invented.

### Scope

- **In scope (Phase 3 launch):** Notification types 1-5 (hazard alerts), home location, user preferences, permission flow, Cloud Function sender, token management.
- **Deferred (post-launch):** Type 6 (morning walk reminder), Type 7 (rain incoming). See Section 8.
- **Out of scope permanently:** Third-party notification services (OneSignal, Knock, Novu, etc.).

### Prerequisites

**Build prerequisites -- development cannot start without these:**
1. Firebase full migration is complete (authenticated user accounts, Firestore reads live)

**Go-live prerequisites -- the feature cannot be released to real users without these:**
2. GDPR sign-off (L1) from the owner's solicitor
3. Solicitor review of the notification consent mechanism (Step 12 in implementation order)

Build and testing can proceed once Firebase full migration is complete. GDPR sign-off and solicitor review are not required to begin development -- they are required before any real user receives a notification.

---

## Section 1 -- Notification Types at Launch (Types 1-5)

All five types are confirmed for Phase 3 launch. Types 6 and 7 are deferred. The five types below map directly to existing thresholds in `detectHazards()` and `getPawSafety()`.

### Type 1 -- Extreme Heat Alert

| Property | Value |
|----------|-------|
| Trigger | `temp > 32°C` in today's or tomorrow's forecast |
| Source function | `detectHazards()` |
| Severity | High -- safety critical |
| Send times | Evening before at 8pm (plan change) AND morning of at 7am (reminder) |
| User preference toggle label | "Extreme heat alerts" |
| Default | On |

**Copy direction (not final -- goes through Copywriter):**

Evening before: Tomorrow is going to be too hot for a midday walk. Head out before 8am or after 7pm. Pavements can burn paws at this temperature.

Morning of: Too hot for a midday walk today. Go early or wait until the evening. Check the pavement with your hand before you head out.

**Includes breed/age personalisation:** Yes -- brachycephalic dogs trigger at `temp > 27°C`, senior dogs at `temp > 30°C`. Cloud Function must read the dog profile's `tags[]` and `birthday` from Firestore to apply personalised thresholds. If the user has no dog profile, standard thresholds apply.

---

### Type 2 -- Paw Heat Warning

| Property | Value |
|----------|-------|
| Trigger | `temp >= 25°C` in today's forecast |
| Source function | `detectHazards()` / `getPawSafety()` |
| Severity | High -- differentiating Sniffout feature |
| Send times | Morning of at 7am |
| User preference toggle label | "Hot weather paw alerts" |
| Default | On |

**Copy direction:**

Morning of: It's going to be warm today. Try the 7-second pavement test before you head out -- if you can't hold your hand on the tarmac, it's too hot for paws.

**Includes breed/age personalisation:** Yes -- brachycephalic dogs trigger at `temp >= 22°C`. Apply same profile logic as Type 1.

**Note:** This is Sniffout's clearest differentiator from generic weather apps. Generic weather apps do not send paw-specific warnings. Prioritise the copy quality for this type.

---

### Type 3 -- Storm Warning

| Property | Value |
|----------|-------|
| Trigger | Storm WMO code (95, 96, or 99) in today's or tomorrow's forecast |
| Source function | `detectHazards()` |
| Severity | High -- safety critical |
| Send times | Evening before at 8pm if in tomorrow's forecast; morning of at 7am if in today's forecast |
| User preference toggle label | "Storm warnings" |
| Default | On |

**Copy direction:**

Evening before: Thunderstorms are forecast for tomorrow. Keep walks short and avoid open ground, water, and tall trees.

Morning of: Thunderstorms expected today. Keep walks very short, stick to sheltered routes, and watch the sky.

---

### Type 4 -- Dangerous Wind Alert

| Property | Value |
|----------|-------|
| Trigger | `gusts >= 60 km/h` in today's forecast |
| Source function | `detectHazards()` |
| Severity | Medium-high |
| Send times | Morning of at 7am |
| User preference toggle label | "High wind alerts" |
| Default | On |

**Copy direction:**

Morning of: Very strong gusts forecast today. Avoid exposed routes and woodland where falling branches are a risk.

---

### Type 5 -- Freeze and Ice Alert

| Property | Value |
|----------|-------|
| Trigger | `temp <= 0°C` OR `feelsLike < -5°C` in today's or tomorrow's forecast |
| Source function | `detectHazards()` / `getPawSafety()` |
| Severity | Medium |
| Send times | Evening before at 8pm (single send -- plan preparation) |
| User preference toggle label | "Freeze and ice alerts" |
| Default | On |

**Copy direction:**

Evening before: Below freezing tomorrow. Watch for ice and grit on paths, and rinse paws when you get back.

**Includes breed/age personalisation:** Yes -- senior dogs trigger at `feelsLike < -2°C`. Apply profile logic from Firestore.

---

### Threshold summary table

| Type | Standard trigger | Brachycephalic trigger | Senior trigger |
|------|-----------------|----------------------|----------------|
| 1 (extreme heat) | `temp > 32°C` | `temp > 27°C` | `temp > 30°C` |
| 2 (paw heat) | `temp >= 25°C` | `temp >= 22°C` | `temp >= 25°C` (unchanged) |
| 5 (freeze) | `temp <= 0°C` or `feelsLike < -5°C` | unchanged | `feelsLike < -2°C` |
| 3, 4 | as stated above | unchanged | unchanged |

Multi-characteristic resolution: most conservative threshold wins (matching the in-app logic in `detectHazards()`).

---

## Section 2 -- Infrastructure

### Architecture

The notification system uses three layers:

1. **Client-side (sniffout-v2.html + firebase-messaging-sw.js):** requests permission, generates and stores FCM token, receives and displays notifications via service worker.
2. **Firestore (sniffout-fe976, europe-west2):** stores home location, notification preferences, FCM tokens, and per-user notification opt-ins. Cloud Functions read from here.
3. **Cloud Functions (sniffout-fe976, europe-west2):** scheduled backend logic. Reads Firestore for active users, fetches weather from Open-Meteo, evaluates hazard thresholds, sends FCM messages. This is the only component that can trigger sends -- GitHub Pages cannot.

### Why Cloud Functions (not third-party)

**Confirmed decision:** Firebase Cloud Functions only. No OneSignal, no Knock, no Novu, no third-party notification services.

Rationale: Third-party services send user location and device data to servers outside the Firebase project and outside `europe-west2`. This creates GDPR complications and adds an external dependency. Everything stays within the existing Firebase project.

### Firebase project

- Project ID: `sniffout-fe976`
- Region: `europe-west2` (all Cloud Functions must be deployed to this region)
- Firebase SDK: compat v10.12.0 (already in the app)

### Service worker requirement

FCM requires a service worker file named `firebase-messaging-sw.js` at the repo root. This is distinct from the existing `sw.js`. It must import the FCM messaging library and handle push events. It can either be a standalone file or `sw.js` can be extended to include the FCM import -- both approaches work with the existing GitHub Pages structure.

### The full notification flow

```
Scheduled Cloud Function (runs at configured times)
  -- queries Firestore: users with notificationsEnabled: true
  -- for each user: reads homeLocation, fcmToken, notificationPrefs, dog profile
  -- fetches weather from Open-Meteo for homeLocation lat/lon
  -- evaluates hazard thresholds (with breed/age personalisation from dog profile)
  -- if threshold met AND type is enabled AND not quiet hours:
      -- sends FCM message to user's fcmToken
          -- FCM delivers to browser
              -- Service worker receives push event
                  -- Displays notification to user
                      -- User taps -- opens sniffout-v2.html
```

---

## Section 3 -- Home Location

### Concept

Home location is a separate, persistent concept from the session location (`sniffout_session`). The session location is ephemeral (8-hour TTL, in-browser only) and suitable for in-app use only. Home location is permanent, synced to Firestore, and used exclusively by the notification system.

Home location = where the user typically walks from. It does not change unless the user deliberately updates it.

### How home location is set

**Two entry points (both confirmed):**

1. **Banner prompt on Today tab** -- after a user enters a postcode on the Today tab, a dismissible banner appears below the location line: "Save [postcode] as your home location for weather alerts?" with "Save" and "Dismiss" actions. This is the high-discoverability path.

2. **Me tab settings sheet** -- a "Notification location" row in the Weather alerts section (see Section 5 for preferences UI). Shows the current home location if set, or a "Set home location" prompt if not. Tapping opens a postcode input. This is the direct editing path.

**Do not infer home location from usage.** Explicit user action only at Phase 3.

### Storage schema

```
localStorage key: sniffout_home_location
Value: { postcode: 'SW1A 1AA', lat: 51.5014, lon: -0.1419, label: 'London SW1' }

Firestore path: /users/{uid}
Fields:
  homeLocation: {
    postcode: 'SW1A 1AA',
    lat: 51.5014,
    lon: -0.1419,
    label: 'London SW1',
    setAt: Timestamp
  }
```

Both must be kept in sync. When the user sets or updates home location: write to localStorage immediately (for in-app display), write to Firestore immediately (for Cloud Functions). Use the existing `fsWriteUserProfile()` pattern -- fire and forget, failure is silent, localStorage is source of truth for display.

### Dependency on home location

If no home location is set, the user receives no notifications regardless of preference settings. The notification preferences UI should make this explicit: "Set a home location to receive weather alerts." The Cloud Function skips any user without a `homeLocation` field in their Firestore document.

### Edge case: user updates home location

Cloud Functions read `homeLocation` fresh on each scheduled run. Updating home location in settings takes effect on the next function run. No queued notifications need to be cancelled. No special handling required.

---

## Section 4 -- Quiet Hours

**Confirmed: no notifications between 9pm and 7am UK time.**

This is enforced at the Cloud Function level, not the client level. The scheduler checks the current UK time before sending any notification and skips the send if the time is outside the 7am-9pm window.

### DST handling

UK time switches between GMT (winter) and BST (UTC+1, summer). The Cloud Function must use a DST-aware time library (e.g. `date-fns-tz` with timezone `'Europe/London'`) to determine the local UK time. Do not use UTC offset arithmetic directly -- it breaks across DST transitions.

### Implementation note

The Cloud Function scheduler can be set to run at multiple fixed UTC times (e.g. 7am GMT = 7am UTC in winter, 6am UTC in summer). The easier approach is to run the function on a fine-grained schedule (e.g. every hour from 6am-9pm UTC) and let the function itself check the UK local time before sending. This approach handles DST transitions without needing to change the function schedule twice a year.

### Quiet hours boundary cases

| Scenario | Behaviour |
|----------|-----------|
| Type 5 freeze alert triggered at 9:30pm | Skip. Send the following evening if condition persists. |
| Type 3 storm alert -- storm appears in forecast at 11pm | Skip until 7am send window. |
| Type 1 extreme heat -- evening-before send scheduled at 8pm | Send. 8pm is within the window. |
| Any type -- condition clears before the next send window | Do not send. Evaluate conditions fresh on each run. |

---

## Section 5 -- User Preferences UI

### Location in the app

Me tab -- gear icon -- settings sheet -- "Weather alerts" section. This section is new. It sits below the existing "Display" section in the settings sheet.

### Preference structure

```
WEATHER ALERTS

Notifications are off.
[Turn on notifications]    (shown if notificationsEnabled: false or permission not yet granted)

-- OR, if enabled: --

[Weather alerts: On / Off]    (global toggle -- pauses all without revoking browser permission)

Notification location
  [London SW1 - Change]    (or "Set home location" if not set)

Alert types:
  [On]  Extreme heat alerts
        When it's too hot for a midday walk
  [On]  Hot weather paw alerts
        When pavements may be warm enough to hurt
  [On]  Storm warnings
        When thunderstorms are forecast
  [On]  High wind alerts
        When gusts are dangerous
  [On]  Freeze and ice alerts
        When freezing temperatures or ice are expected
```

Types 6 and 7 (morning walk, rain incoming) do not appear in the UI at Phase 3 launch.

### Permission prompt timing

**Do not ask for notification permission on app load.** Ask only when the user taps "Turn on notifications" in the Weather alerts section and the browser has not yet granted permission. This context-aware timing converts significantly better than on-load prompts and is consistent with platform best practices.

If permission has already been granted (from a previous session), skip the browser prompt and go straight to enabling the preference.

If permission was previously denied by the user at the browser level, show a message: "Notifications are blocked in your browser settings. To enable them, go to your browser settings and allow notifications for sniffout.app."

### Global off toggle behaviour

The global "Weather alerts: On / Off" toggle sets `notificationsEnabled: false` in Firestore (and in `sniffout_notification_prefs` in localStorage). The Cloud Function skips the user entirely when this is false. This does not revoke browser permission -- the user can re-enable from the same toggle without any browser prompt.

### Preference storage

```
localStorage key: sniffout_notification_prefs
Value: {
  enabled: true,
  types: {
    extremeHeat: true,
    pawHeat: true,
    storm: true,
    dangerousWind: true,
    freeze: true
  }
}

Firestore path: /users/{uid}
Fields:
  notificationsEnabled: boolean
  notificationPrefs: {
    extremeHeat: boolean,
    pawHeat: boolean,
    storm: boolean,
    dangerousWind: boolean,
    freeze: boolean
  }
  fcmToken: string
```

---

## Section 6 -- FCM Token Management

### Token generation

When the user grants notification permission, the FCM SDK generates a registration token for that device and browser. This token is the address Cloud Functions use to deliver notifications to the user.

1. Call `getToken(messaging, { vapidKey: '...' })` after permission is granted
2. Write the token to Firestore: `/users/{uid}.fcmToken`
3. Also write to `sniffout_notification_prefs.fcmToken` in localStorage for diagnostic reference

### Token refresh

FCM tokens can change -- the browser refreshes them periodically or after the user clears app data. The app must handle `onTokenRefresh` and update Firestore when the token changes.

```js
onTokenRefresh(() => {
  getToken(messaging, { vapidKey: '...' }).then((newToken) => {
    // update Firestore: /users/{uid}.fcmToken = newToken
  });
});
```

### Stale token cleanup

When a Cloud Function attempts to send to a token and receives an `INVALID_REGISTRATION` or `NOT_REGISTERED` error from FCM, the function must delete that token from the user's Firestore document (`fcmToken: null`). This prevents growing numbers of failed sends and keeps Firestore clean. This is a required implementation step (Step 11 in the implementation order).

### VAPID key

The VAPID public key is found in the Firebase console under Project Settings -- Cloud Messaging -- Web configuration. It is embedded in the app's JS and passed to `getToken()`. The private key stays within Firebase and is never exposed.

---

## Section 7 -- Implementation Order

The 12-step sequence below is the confirmed build order. Steps 1-8 are client-side and can be built and tested before the Cloud Function exists (manual sends via Firebase console cover testing in this phase). Steps 9-12 complete the backend.

### Step 1 -- Add firebase-messaging-sw.js

Add `firebase-messaging-sw.js` to the repo root. Configure it to import the Firebase Messaging compat library and handle push events. Wire it to the existing Firebase config (project `sniffout-fe976`).

**Dependency:** Firebase SDK already in `sniffout-v2.html`. No new dependencies.

**Test:** Load the app, check DevTools Application -- Service Workers shows both `sw.js` and `firebase-messaging-sw.js` registered.

---

### Step 2 -- Build home location UI

Add home location input to the Me tab settings sheet (Weather alerts section). This is a postcode field that geocodes via `geocodePostcode()` (already exists in the app) to get lat/lon. Store result in `sniffout_home_location`.

Add the banner prompt to the Today tab: appears after a postcode search with "Save [postcode] as your home location for weather alerts?" and Save/Dismiss actions. Banner is dismissible and does not re-appear after dismissal.

**Dependency:** None.

**Test:** Enter a postcode, check `sniffout_home_location` in localStorage has the correct structure.

---

### Step 3 -- Sync home location to Firestore

When home location is set or updated via either UI entry point, write to Firestore `/users/{uid}.homeLocation` immediately after writing to localStorage. Use the fire-and-forget pattern matching the existing `fsWriteUserProfile()` helper.

**Dependency:** Firebase anonymous auth (already live). Firestore write helpers (already live).

**Test:** Set home location, check Firestore document has `homeLocation` field with correct lat/lon.

---

### Step 4 -- Build notification preferences UI

Add "Weather alerts" section to the Me tab settings sheet. Include the global on/off toggle, the notification location display (from Step 2), and the five per-type toggles. Store preferences in `sniffout_notification_prefs` localStorage and sync to Firestore `/users/{uid}.notificationsEnabled` and `/users/{uid}.notificationPrefs`.

**Dependency:** Home location UI (Step 2).

**Test:** Toggle each preference, check localStorage and Firestore reflect the correct state.

---

### Step 5 -- Implement permission prompt flow

Wire the "Turn on notifications" button (shown when `notificationsEnabled` is false and browser permission is not yet granted) to call `Notification.requestPermission()`. Handle the three outcomes:

- **Granted:** proceed to Step 6 (token generation); update UI to show alerts as enabled
- **Denied:** show "notifications blocked" message with browser settings guidance
- **Default (dismissed without choosing):** treat as not yet decided; show the button again next time

**Dependency:** Preferences UI (Step 4).

**Test:** Tap "Turn on notifications" on a device that has not yet been prompted. Confirm browser permission dialog appears.

---

### Step 6 -- Generate and store FCM token

On permission grant, call `getToken(messaging, { vapidKey: '...' })`. Write the returned token to Firestore `/users/{uid}.fcmToken`. Set `notificationsEnabled: true` in Firestore and `sniffout_notification_prefs.enabled: true` in localStorage.

**Dependency:** Permission granted (Step 5). VAPID key from Firebase console.

**Test:** Grant permission, check Firestore user document has `fcmToken` populated.

---

### Step 7 -- Handle token refresh

Add `onTokenRefresh()` listener to update Firestore when the token changes. This is a passive background listener -- it runs whenever the FCM SDK detects a token refresh.

**Dependency:** Token storage (Step 6).

**Test:** Cannot be reliably triggered manually. Confirm the listener is wired and the Firestore update code path is present. Full test happens in production over time.

---

### Step 8 -- Test client-side flow end to end

With Steps 1-7 complete, test the full client-side flow using Firebase console manual sends (Firebase console -- Messaging -- New campaign -- Test on device). This validates:

- Token is stored correctly
- Service worker receives the push event
- Notification displays correctly on device
- Tapping the notification opens sniffout-v2.html

Test on: Android Chrome (primary), desktop Chrome, and iOS home screen installed PWA (if available for testing).

**Dependency:** Steps 1-7 complete.

---

### Step 9 -- Write the Cloud Function

Write a scheduled Cloud Function in `europe-west2` that:

1. Queries Firestore for all users where `notificationsEnabled: true` and `fcmToken` is not null
2. For each user: reads `homeLocation`, `notificationPrefs`, and dog profile (for breed/age personalisation)
3. Fetches current and tomorrow's weather from Open-Meteo for the user's `homeLocation.lat` and `homeLocation.lon`
4. Evaluates Type 1-5 threshold conditions (with breed/age personalisation applied)
5. Checks UK local time for quiet hours (using DST-aware time library -- see Section 4)
6. For each triggered type that the user has enabled: sends an FCM message to the user's `fcmToken`
7. Handles FCM errors (see Step 11)

**Schedule:** Run at 7am and 8pm UK time daily. Use a time-based trigger, not a Pub/Sub trigger.

**Open-Meteo parameters:** The Cloud Function should request the same weather fields the app uses: `temperature_2m`, `apparent_temperature`, `weathercode`, `windgusts_10m`, `precipitation_probability`, `precipitation`. Request hourly forecast for the full day.

**Dependency:** All steps above. Firestore rules must allow Cloud Functions (admin SDK) to read user documents.

---

### Step 10 -- Deploy and test Cloud Function

Deploy to `europe-west2`. Test with 2-3 real devices. Verify:

- Notifications arrive at the expected times
- Personalised thresholds are applied correctly for dogs with `brachycephalic` or senior profiles
- Quiet hours are respected -- no sends between 9pm and 7am UK time
- Notifications open the app correctly on tap

**Dependency:** Step 9. All prior steps on test devices.

---

### Step 11 -- Stale token cleanup

In the Cloud Function, after each FCM send attempt, check the response. If FCM returns `INVALID_REGISTRATION` or `NOT_REGISTERED`, delete the stale token from the user's Firestore document (`fcmToken: null`, `notificationsEnabled: false`). Log the cleanup for diagnostic purposes.

This step must not be omitted. Stale tokens accumulate over time as users switch browsers or uninstall the app. Failing to clean them causes growing failure rates and Firestore clutter.

**Dependency:** Step 9.

---

### Step 12 -- Solicitor review of notification consent mechanism

This step is a go-live gate, not a build gate. Development of Steps 1-11 can proceed before this review is complete. The review must be complete before any real user receives a notification.

The owner's solicitor must review:

- The notification permission prompt wording
- The preference UI (individual type toggles, global off toggle)
- The home location consent (does setting a home location constitute additional consent?)
- The ability for users to withdraw consent (global off toggle and browser-level permission revocation)

Push notification permission is a form of direct marketing consent under UK PECR. This review is a hard go-live blocker -- not an optional review, and not a development prerequisite.

**Dependency:** Steps 1-11 complete (so the solicitor can review the actual built UI). Solicitor engagement (L1 blocker already in progress).

---

## Section 8 -- Deferred Notification Types

### Type 6 -- Morning Walk Reminder (deferred, post-launch)

| Property | Value |
|----------|-------|
| Trigger | `approved` verdict AND `feelsLike` between 5°C and 20°C AND `precip_prob < 20%` in the 7-10am window |
| Confirmed timing | 7am |
| User preference toggle label | "Morning walk alerts" |
| Default | Off |

**Why deferred:** This type requires validation that users actually want "good news" notifications and will not experience them as noise. It also risks notification fatigue if sent on every pleasant morning. The recommendation is to add this as a post-launch option once the hazard types have established user trust in the notification system.

When implemented: consider limiting to a maximum of 3 sends per week, or only sending after a streak of bad-weather days (to preserve the "good news" impact).

---

### Type 7 -- Rain Incoming Alert (deferred, post-launch)

| Property | Value |
|----------|-------|
| Trigger | Currently dry (`precip_prob < 20%` now) AND `rainArrivingSoon()` true -- heavy rain within 3 hours |
| Timing | As close to real-time as possible |
| User preference toggle label | "Rain incoming alerts" |
| Default | Off |

**Why deferred:** Push notifications are not guaranteed real-time. A 20-30 minute delivery delay is possible. For this type, the value collapses if the notification arrives after the rain -- it becomes a "rain is here" notification rather than a "get out now" alert. This type requires testing real-world delivery latency before it can be offered to users.

When implemented: the Cloud Function must run on a short interval (every 15-30 minutes) and the notification should only be sent if the rain arrival window is more than 1 hour away (to provide a buffer for delivery latency).

---

## Section 9 -- Dependencies and Blockers

### Build prerequisites -- cannot start development without these

| Prerequisite | Status | Owner |
|--------------|--------|-------|
| Firebase full migration (Phase 3) | Not started | Developer |

### Go-live blockers -- cannot release to real users without these

| Blocker | Status | Owner |
|---------|--------|-------|
| GDPR sign-off (L1) | Blocked -- solicitor not yet engaged | Owner |
| Solicitor review of notification consent (Step 12) | Blocked -- depends on L1 | Owner + solicitor |

### Soft dependencies -- must exist before specific steps

| Dependency | Required by | Status |
|------------|-------------|--------|
| Firebase anonymous auth | Steps 3, 6 | Live (already in app) |
| Firestore write helpers | Steps 3, 4 | Live (already in app) |
| `geocodePostcode()` function | Step 2 | Live (already in app) |
| `sniffout_dogs` dog profile with `tags[]` and `birthday` | Step 9 (breed/age personalisation) | Live -- `tags[]` now includes `brachycephalic` and `double-coat` |
| VAPID key from Firebase console | Step 6 | Available -- requires Firebase console access |
| `europe-west2` Cloud Functions quota | Step 9 | Requires enabling Cloud Functions billing on the Firebase project |

### Cloud Functions billing note

Cloud Functions requires the Firebase Blaze (pay-as-you-go) plan. The free Spark plan does not support Cloud Functions outbound network requests (which are needed to call Open-Meteo). The expected cost at Sniffout's scale is negligible (well within free tier limits), but the plan upgrade must be done before Cloud Functions can be deployed.

**Google Cloud billing - resolved 23 March 2026.** The owner upgraded to pay-as-you-go and set a £15 budget alert. The $200 free monthly tier covers current usage. No further action required for the existing Google Cloud account.

The Firebase Blaze plan upgrade for Cloud Functions is a separate item. It must be addressed when Cloud Functions development begins (Step 9). It is not required for Steps 1-8 and does not block any client-side work.

### Phase 3 vs Phase 2

The notification system must not be partially implemented in Phase 2. The full stack (client-side, Firestore schema, Cloud Functions) is a single coherent feature. Partial builds (e.g. building the preferences UI without the Cloud Function) create UI debt and user confusion (toggles that appear functional but do nothing).

Begin development once Firebase full migration is complete. Do not go live with real users until GDPR sign-off (L1) and solicitor review of the consent mechanism (Step 12) are both complete.

---

## Section 10 -- Firestore Schema Reference

All notification-related fields live under `/users/{uid}`. This is the same document used by the existing Phase 3 Firebase migration plan.

```
/users/{uid}
  // Home location (Section 3)
  homeLocation: {
    postcode: string,           // 'SW1A 1AA'
    lat: number,                // 51.5014
    lon: number,                // -0.1419
    label: string,              // 'London SW1' (display name)
    setAt: Timestamp
  }

  // FCM token (Section 6)
  fcmToken: string | null       // null if token was deleted/stale

  // Global notification switch (Section 5)
  notificationsEnabled: boolean

  // Per-type preferences (Section 5)
  notificationPrefs: {
    extremeHeat: boolean,
    pawHeat: boolean,
    storm: boolean,
    dangerousWind: boolean,
    freeze: boolean
    // morningWalk and rainIncoming added at post-launch
  }

  // Dog profile tags -- used for breed/age personalisation in Cloud Function
  // (Written by the existing dog profile feature -- Cloud Function reads, never writes)
  // dogs: array of dog objects, each with tags[] and birthday
```

The Cloud Function reads this document using the Firebase Admin SDK. It does not write to `notificationPrefs` or `dogs` -- it reads them.

---

## Section 11 -- Browser Support Reference

| Browser / Platform | Notifications work | Notes |
|--------------------|--------------------|-------|
| Chrome on Android | Yes | Primary target platform |
| Samsung Internet (Android) | Yes | Significant UK market share on Android |
| Firefox (desktop + Android) | Yes | Full support |
| Edge (desktop) | Yes | Full support |
| Chrome on desktop | Yes | Good for testing |
| Safari on iOS -- installed PWA | Partial | iOS 16.4+ only. Must be installed to home screen. Chrome on iOS uses WebKit, so same restriction applies. |
| Safari on iOS -- browser tab | No | Push only works for installed PWAs on iOS |

**UK context:** UK users are not affected by the EU Digital Markets Act restriction Apple applied in 2024. iOS users on UK devices running iOS 16.4+ who install Sniffout to their home screen will receive notifications normally.

**Expected reach:** Approximately 60-70% of Sniffout's user base will receive notifications at Phase 3 launch. iOS users who have not installed the app to their home screen (estimated 30-40%) will not. This is acceptable -- the users most likely to opt in to notifications are the users most likely to have installed the app.

---

## Sources

This spec is based entirely on `docs/research/push-notifications-research.md` (22 March 2026) and the confirmed owner decisions documented in `docs/handoffs/session-handoff-march-23.md`.

Primary source materials (from the research report):
- Firebase Cloud Messaging official documentation
- Web Push on iOS -- Apple Developer documentation
- Firebase Cloud Functions scheduling documentation
- FCM token management best practices
