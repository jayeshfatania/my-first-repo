# Push Notifications Research — Sniffout

> **Date:** 2026-03-22
> **Status:** Research and planning — Phase 3 pre-work
> **Audience:** Developer (technical sections), Owner (decisions section)
> **Scope:** No code changes. This is a planning document only.

---

## Executive Summary

- Push notifications are technically feasible for Sniffout using Firebase Cloud Messaging (FCM) with the existing Firebase project and service worker, but they require a Cloud Functions backend to send — GitHub Pages alone cannot trigger them.
- The existing in-app weather hazard thresholds map directly to notification triggers with no new logic needed; the same conditions that show hazard cards in the app should fire notifications.
- iOS support exists but only for users who have installed Sniffout to their home screen (iOS 16.4+); UK users are not affected by the EU Digital Markets Act PWA restriction.
- A "home location" concept must be explicitly designed and built before notifications can go live — the current ephemeral session cache is not suitable as a notification trigger source.
- Three owner decisions are required before implementation can begin: which notification types to enable at launch, whether to use Cloud Functions (recommended) or a third-party service, and how home location should be set.

---

## 1. Technical Architecture

### Overview

Push notifications in a PWA work through three components working together:

1. **The browser's Push API** — requests permission from the user and generates a push subscription
2. **Firebase Cloud Messaging (FCM)** — manages the push endpoint, delivers the notification to the browser
3. **A trusted sender** — the component that decides when to send and actually fires the message

The constraint for Sniffout is the third component. **GitHub Pages is a static host — it cannot run scheduled jobs or server-side code.** This means something else must trigger notifications. The recommended solution is **Firebase Cloud Functions**, which already exists within the Sniffout Firebase project (`sniffout-fe976`, `europe-west2`).

### Full notification flow

```
Scheduled Cloud Function (runs daily at trigger times)
  → fetches weather from Open-Meteo for each user's home location
  → evaluates hazard logic (same thresholds as app)
  → sends FCM message to user's device token
      → FCM delivers to browser
          → Service worker receives push event
              → Displays notification
                  → User taps notification → opens Sniffout
```

### Key components needed

**1. firebase-messaging-sw.js**
FCM requires a dedicated service worker file named `firebase-messaging-sw.js` in the root of the project. For Sniffout, this can either be a separate file or the existing `sw.js` can be extended to import the FCM messaging library. The file must be at the root (same directory as `sniffout-v2.html`), which is satisfied by the existing GitHub Pages structure.

**2. VAPID key**
Web push requires a VAPID (Voluntary Application Server Identification) key pair. Firebase generates this automatically — it is found in the Firebase console under Project Settings > Cloud Messaging > Web configuration. The public VAPID key is embedded in the app; the private key stays in Firebase.

**3. FCM token per user**
When a user grants notification permission, the FCM SDK generates a registration token for that device/browser combination. This token must be stored in Firestore under the user's anonymous UID so Cloud Functions can retrieve it when sending. Tokens expire and refresh — the app must handle token refresh and update Firestore accordingly.

**4. Cloud Functions (the backend trigger)**
A scheduled Cloud Function runs at configured times, queries Firestore for users who have notifications enabled, fetches weather for each user's home location from Open-Meteo, evaluates hazard conditions, and sends FCM messages to the relevant tokens. This is the only component that requires writing server-side code — but it lives entirely within Firebase, not on GitHub Pages.

**5. User permission and preference storage in Firestore**
The Firestore user document (already planned in the Firebase architecture) must store: the FCM token, the home location, and per-notification-type preferences.

### GitHub Pages constraint — summary

| Can GitHub Pages do this? | Answer |
|---|---|
| Serve the app HTML/JS/CSS | Yes |
| Request notification permission from user | Yes (client-side JS) |
| Generate and store FCM token | Yes (client-side JS + Firestore) |
| Display received notifications | Yes (service worker) |
| Send notifications on a schedule | **No** — requires Cloud Functions |
| Trigger notifications based on weather changes | **No** — requires Cloud Functions |

**The static site handles the user-facing experience. Cloud Functions handle all sending logic.**

### Why not a third-party service?

Alternative trigger services (OneSignal, Knock, Novu) exist but add a third-party dependency and move user data outside the Firebase project. Given Sniffout already has Firebase and is building toward GDPR compliance with data in `europe-west2`, keeping everything within Firebase Cloud Functions is the cleaner, more controllable approach.

---

## 2. Notification Types

The following types are derived directly from the existing hazard and verdict logic in `sniffout-v2.html`. The same thresholds that trigger in-app warnings should trigger push notifications — consistency between the two is important.

### Existing thresholds extracted from the app

| Function | Condition | Current in-app message |
|---|---|---|
| `detectHazards()` | `temp > 32°C` | "Too hot to walk safely" |
| `detectHazards()` | `temp >= 25°C` | "Hot enough to hurt paws" |
| `detectHazards()` | Storm code (95, 96, 99) | "Thunderstorm warning - stay inside" |
| `detectHazards()` | `gusts >= 60 km/h` | "Dangerous winds - don't go out" |
| `detectHazards()` | `gusts >= 45 km/h` | "Very gusty - choose sheltered routes" |
| `detectHazards()` | `feels < -5°C` | "Very cold - brief outings only" |
| `detectHazards()` | `temp <= 0°C` | "Freezing - watch for grit and ice" |
| `getWalkVerdict()` | `rainArrivingSoon()` — precip_prob ≥ 70% AND precip ≥ 1mm within 3h | "Dry for now - rain arriving" |
| `getWalkVerdict()` | `rainLikelyToday()` — precip_prob ≥ 50% within 8h | "Showers on the way" |
| `getPawSafety()` | `temp >= 35°C` | Paw danger |
| `getPawSafety()` | `temp <= 0°C` | Paw caution (grit/ice) |

### Recommended notification types

**TYPE 1 — Extreme heat alert**
- **Trigger:** `temp > 32°C` (matches `detectHazards()` top threshold)
- **Timing:** Day before at 8pm (plan adjustment) AND morning of at 7am
- **Message direction:** "Tomorrow/Today is too hot for a midday walk. Go before 8am or after 7pm. At this temperature, pavements can burn paws."
- **Opt-out label:** "Extreme heat alerts"
- **Value:** High — genuinely dangerous condition; dog owners commonly underestimate pavement heat

**TYPE 2 — Paw heat warning**
- **Trigger:** `temp >= 25°C` (the lower paw check threshold)
- **Timing:** Morning of at 7am
- **Message direction:** "It's going to be warm today. Do the 7-second pavement test before you head out — if you can't hold your hand on the tarmac, it's too hot for paws."
- **Opt-out label:** "Hot weather paw alerts"
- **Value:** High — this is Sniffout's existing differentiator; a notification that generic weather apps don't send

**TYPE 3 — Storm warning**
- **Trigger:** Storm WMO code (95, 96, 99) in today's or tomorrow's forecast
- **Timing:** Evening before at 8pm OR immediately if storm develops during the day
- **Message direction:** "Thunderstorms forecast. Keep walks very short and avoid open ground, water, and tall trees."
- **Opt-out label:** "Storm warnings"
- **Value:** High — safety-critical

**TYPE 4 — Dangerous wind**
- **Trigger:** `gusts >= 60 km/h`
- **Timing:** Morning of at 7am
- **Message direction:** "Very strong gusts today. Avoid exposed routes and woodland — risk of falling branches."
- **Opt-out label:** "High wind alerts"
- **Value:** Medium-high — less common in UK but genuinely hazardous

**TYPE 5 — Freeze/ice alert**
- **Trigger:** `temp <= 0°C` or `feels < -5°C`
- **Timing:** Evening before at 8pm ("tomorrow is a freeze day — rinse paws when you're back")
- **Message direction:** "Below freezing tomorrow. Watch for ice and grit on paths — rinse paws when you get back."
- **Opt-out label:** "Freeze and ice alerts"
- **Value:** Medium — seasonal, but paw grit irritation is a genuine and under-known risk

**TYPE 6 — Morning walk window (the "good news" notification)**
- **Trigger:** `approved` verdict AND `feels` between 5°C and 20°C AND precip_prob < 20% in 7–10am window
- **Timing:** 7am
- **Message direction:** "Great morning for a walk. [X]°C, dry, light winds. Get out there."
- **Opt-out label:** "Morning walk alerts"
- **Value:** Medium — positive reinforcement, not a warning. Differentiates Sniffout from pure hazard-alert tools. Could be the most-used type for many users.
- **Risk:** Notification fatigue if sent every pleasant morning — recommend max 3x per week or only when preceded by a bad-weather streak

**TYPE 7 — Rain incoming (window alert)**
- **Trigger:** Currently dry (precip_prob < 20% now) but `rainArrivingSoon()` returns true — heavy rain within 3 hours
- **Timing:** Immediate/real-time — only useful if sent promptly
- **Message direction:** "It's dry right now but heavy rain is arriving within 3 hours. If you're going, go now."
- **Opt-out label:** "Rain incoming alerts"
- **Value:** Medium — timing-sensitive; only valuable if the notification is received before the rain arrives. Latency risk: push notifications are not guaranteed real-time. This type requires careful implementation — a 30-minute delay makes it useless.
- **Note:** This type is the hardest to implement well. Consider deprioritising for initial launch.

### Types NOT recommended at launch

| Idea | Reason to defer |
|---|---|
| UV index alert | Open-Meteo UV endpoint is a Phase 3 addition not yet active in the app |
| Fog warning | Low severity, low frequency in UK; adds noise |
| General rain alert (it is raining) | The weather is already happening — too late to change plans |
| "Tomorrow's forecast" daily digest | Would require good personalisation to avoid being ignored |

---

## 3. Home Location

### The problem with the current location system

The app currently stores location in `sniffout_session` with an 8-hour TTL. This is designed for within-session use — it caches the user's current location so the app doesn't request it on every tab switch. It is not suitable for push notifications because:

- It expires when not in use (no app open = no session = no location)
- It is device/browser specific and not synced to Firestore
- It may change frequently if the user searches different postcodes while travelling
- Cloud Functions cannot read localStorage — it needs Firestore

### Recommended home location concept

**Home location is a separate, persistent concept from the session location.**

It represents where the user typically walks — their default walking area. It is used exclusively by the notification system. The session location remains as-is for in-app use.

**How it should be set:** Explicit user action. Do not infer from usage at Phase 3. Inference requires sufficient session data and adds complexity. The UX should be a simple "Set as home" option, either:
- A button in the Me tab settings sheet: "Notification location" with a postcode field
- Or: after the user enters a postcode on the Today tab, show a banner: "Save this as your home location for weather alerts?"

**How it should be stored:**
```
localStorage key:    sniffout_home_location
  { postcode: 'SW1A 1AA', lat: 51.5014, lon: -0.1419, label: 'London SW1' }

Firestore path:      /users/{uid}
  homeLocation: { postcode, lat, lon, label, setAt }
```

Both localStorage (for display in the app) and Firestore (for Cloud Functions to read) must be kept in sync.

**How the notification system uses it:**
Cloud Functions reads `homeLocation` from the Firestore user document. If no home location is set, the user is skipped — notifications cannot be sent without a known location. The settings UI should make this dependency clear: "Set a home location to receive weather alerts."

**Edge case:** User changes home location in settings. The Firestore document updates immediately. The next Cloud Function run uses the new location. No queued notifications need to be cancelled — the schedule is recalculated fresh each run.

---

## 4. User Preferences

### What preferences to offer

Each notification type should be individually toggleable. Forcing users to accept all or nothing leads to higher opt-out rates.

**Recommended preference structure:**

| Toggle | Default | Description shown in UI |
|---|---|---|
| Extreme heat alerts | On | When it's too hot for midday walks |
| Hot weather paw alerts | On | When pavements may be warm enough to hurt |
| Storm warnings | On | When thunderstorms are forecast |
| High wind alerts | On | When gusts are dangerous |
| Freeze and ice alerts | On | When freezing temps or ice are expected |
| Morning walk alerts | Off | When conditions are great for a morning walk |
| Rain incoming alerts | Off | When rain is arriving within 3 hours |

Hazard types default on; positive/informational types default off. This matches how notification permission best practices work — start conservative, let users enable more.

**A global "Notifications off" toggle** should sit above the individual types, so users can pause all notifications without revoking browser permission. Revoking browser permission is hard to undo (requires going into browser settings); a Sniffout-level off switch is much more user-friendly.

### Where in the app

The Me tab settings sheet (gear icon) is the right location, consistent with existing preferences (display mode, search radius). Add a "Weather alerts" section below the existing settings sections. Tapping "Weather alerts" could either expand inline or open a subpage using the existing `me-subpage` pattern.

**Permission prompt timing:** Do not ask for notification permission on first app launch. Ask only when the user taps into the Weather alerts section of settings and tries to enable a toggle. This is best practice — permission prompts shown in context convert significantly better than on-load prompts.

### How preferences should be stored

```
localStorage key:    sniffout_notification_prefs
Firestore path:      /users/{uid} → notificationPrefs: { ... }
Firestore path:      /users/{uid} → fcmToken: string
Firestore path:      /users/{uid} → notificationsEnabled: boolean
```

Cloud Functions read `notificationsEnabled` first — if false, skip entirely. If true, read individual type preferences before sending.

---

## 5. Timing Recommendations

### UK dog walking patterns

UK dog owners typically walk at three points in the day:
- **Morning:** 7–9am (before work or school run)
- **Lunchtime:** 12–1pm (less common, mainly home workers and retirees)
- **Evening:** 5–7pm (post-work)

Weekend patterns shift earlier in the morning and are more flexible.

### Recommended send times per notification type

| Notification type | Send time | Rationale |
|---|---|---|
| Extreme heat alert | Previous evening 8pm + morning of 7am | Double-tap: plan change the night before, reminder on the day |
| Paw heat warning | 7am day of | Morning walkers need to know before they leave; evening walkers have time to adjust |
| Storm warning | 8pm evening before (if in tomorrow's forecast) | Plan adjustment before the day starts |
| Dangerous wind | 7am day of | Conditions are confirmed; morning walkers can reroute |
| Freeze/ice alert | 8pm evening before | Paw rinse prep; extra care on morning walk |
| Morning walk alert | 7am day of | Only useful if received before the walk happens |
| Rain incoming | As close to real-time as possible | Value collapses if delayed — only send if Cloud Function can run within 15 min of condition change |

### Do not send between 9pm and 7am

Regardless of trigger condition, no notifications should be sent overnight. The Cloud Function scheduler should enforce a quiet hours window of 9pm–7am UK time (GMT/BST, adjusted for DST).

### Tomorrow's forecast vs. day-of

For hazard types, **evening-before notifications at 8pm are more actionable** than morning-of for most people — they allow plan changes (booking doggy daycare, adjusting route, preparing kit). Day-of notifications remain useful as a confirmation/reminder for high-severity conditions (extreme heat, storms). Both are worth sending for Types 1–3; day-of only for Types 4–5.

---

## 6. Constraints and Risks

### Browser support

Web push is broadly supported across modern browsers, with one major exception.

| Browser / Platform | Support | Notes |
|---|---|---|
| Chrome (Android) | Full | Best experience |
| Firefox | Full | Solid support |
| Edge | Full | |
| Samsung Internet | Full | Large share on Android in UK |
| Safari on Mac | Full (Safari 16+) | |
| Safari on iOS (installed PWA) | Partial | iOS 16.4+ only; **must be installed to home screen** |
| Chrome on iOS | **No** | iOS forces Chrome to use WebKit; push only works via Safari engine for installed PWAs |
| Safari on iOS (browser tab, not installed) | **No** | Push only works for home screen installed PWAs on iOS |

**UK-specific context:** UK users are not subject to the EU Digital Markets Act restriction that Apple applied in 2024 (which broke standalone PWA support in EU countries). UK Sniffout users on iOS 16.4+ who install the app to their home screen will receive push notifications normally.

**Estimated notification reach:** Approximately 60–70% of Sniffout's likely user base (Android Chrome, desktop browsers, installed iOS PWA) will receive notifications. The remaining 30–40% on iOS in a browser tab will not — but they are the users least likely to have granted permission anyway.

### What happens if FCM is not yet active

Until Cloud Functions are written and deployed, the client-side FCM token generation can still be built and tested — tokens can be stored in Firestore and notifications can be sent manually via the Firebase console (Messaging tab → New campaign). This allows the Developer to build and test the full client-side flow (permission prompt, token storage, service worker receipt) before the Cloud Functions scheduler is written.

**The recommended build sequence exploits this:** build client-side first, test with manual console sends, then build Cloud Functions.

### PWA vs native app — key limitations

| Limitation | Impact on Sniffout |
|---|---|
| iOS requires home screen install | Reduces iOS reach; cannot be worked around |
| No guaranteed delivery time | Notifications may arrive late; rain-incoming type most affected |
| User can revoke permission at OS level | App cannot detect this until the next send attempt; clean up stale tokens on send failure |
| FCM tokens expire and rotate | Must handle `onTokenRefresh` and update Firestore |
| No rich media in web push (iOS) | iOS web push does not support images in notifications; keep messages text-only for consistency |
| Background fetch limitations | The Cloud Function fetch replaces any "background sync" need — the app itself does not need to wake up to check weather |

### FCM token hygiene — important

FCM tokens go stale. A user who uninstalls or switches browsers leaves an orphaned token in Firestore. Cloud Functions must handle `INVALID_REGISTRATION` and `NOT_REGISTERED` error responses from FCM by deleting the stale token from Firestore. Failing to do this causes growing numbers of failed sends and inflated token counts. This is a Phase 3 implementation detail but must not be omitted.

### GDPR and notification consent

Push notification permission is a form of direct marketing consent under UK PECR. The owner's solicitor should confirm the consent mechanism is compliant — specifically: the permission prompt must be clear about what notifications will contain, and users must be able to withdraw consent as easily as they gave it (the "Notifications off" global toggle satisfies this). This should be included in the solicitor review alongside the broader GDPR engagement.

---

## Recommended Implementation Order (Phase 3)

| Step | Task | Dependency |
|------|------|------------|
| 1 | Add `firebase-messaging-sw.js` to repo root; configure FCM integration in `sniffout-v2.html` | Firebase SDK already planned |
| 2 | Build home location UI in Me tab settings (postcode field + "Set as home") | None |
| 3 | Store home location in localStorage + Firestore | Firebase Firestore sync (Phase 3 plan) |
| 4 | Build notification preferences UI in Me tab settings sheet | Home location (step 2) |
| 5 | Implement permission prompt triggered from preferences UI (not on app load) | Preferences UI (step 4) |
| 6 | Generate FCM token on permission grant; store in Firestore under user UID | Anonymous auth (Phase 3 plan) |
| 7 | Handle token refresh (`onTokenRefresh`) and update Firestore | Token storage (step 6) |
| 8 | Test full client-side flow using Firebase console manual sends | Steps 1–7 |
| 9 | Write Cloud Function: scheduled weather fetcher and notification sender | All steps above |
| 10 | Deploy and test Cloud Function with 2–3 real devices | Step 9 |
| 11 | Handle stale token cleanup in Cloud Function (`INVALID_REGISTRATION` responses) | Step 9 |
| 12 | Solicitor review of notification consent mechanism | Before any real users |

---

## Decisions Required from Owner Before Implementation

**Decision 1 — Which notification types to enable at Phase 3 launch?**
Recommendation: Types 1–5 (hazard-only: heat, paw heat, storm, wind, freeze). Types 6–7 (morning walk, rain incoming) can be added in a follow-up. Hazard types are the most defensible from a user value and consent perspective.

**Decision 2 — Cloud Functions or third-party service?**
Recommendation: Cloud Functions. Keeps all data within Firebase/europe-west2, consistent with GDPR posture. Third-party services (OneSignal etc.) send user location and device data to external servers.

**Decision 3 — How should home location be set?**
Recommendation: Explicit user action (postcode field in settings). Two options:
  - A: Settings-only (cleaner, fewer touchpoints)
  - B: Banner prompt after postcode search on Today tab ("Save as home location?") — higher discoverability

**Decision 4 — Global quiet hours and frequency limits**
Confirm: quiet hours 9pm–7am UK time. Confirm whether "morning walk alert" (Type 6) should be limited to avoid fatigue (e.g. max 3 per week).

---

## Sources

- [Firebase Cloud Messaging — Official Docs](https://firebase.google.com/docs/cloud-messaging)
- [Use Firebase in a PWA | Firebase Docs](https://firebase.google.com/docs/web/pwa)
- [Best Practices for FCM Token Management | Firebase](https://firebase.google.com/docs/cloud-messaging/manage-tokens)
- [Schedule Cloud Functions | Firebase](https://firebase.google.com/docs/functions/schedule-functions)
- [Web Push on iOS — Apple Developer Documentation](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers)
- [PWA iOS Limitations 2026 | MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [Scalable Notification System for PWA Using FCM | Medium](https://amal-krishna.medium.com/scalable-notification-system-for-a-pwa-using-fcm-6a4b8aa093af)
- [Send Notifications via Cloud Functions | Firebase Codelabs](https://firebase.google.com/codelabs/firebase-cloud-functions)
