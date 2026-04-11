# Account and Data Sync Spec
Date: 11 April 2026
Status: Approved by owner
Scope: Firebase Phase 3 - account creation and data
persistence

---

## What data syncs across devices

| Data | Syncs | Notes |
|------|-------|-------|
| Saved walks (hearts) | Yes | Primary Phase 3A |
| Walk journal entries | Yes | Notes, rating, duration, weather |
| Dog profile | Yes | Name, breed, age, size, breed flags |
| App settings | Yes | Units, radius |
| Saved places | Yes | Nearby tab hearts |
| Recently viewed | No | Device-local only |
| Achievements/badges | No | Recalculate from journal on load |
| Dark mode preference | No | Device preference |

---

## Firestore data model

users/{uid}/
  profile/
    userDoc:
      email
      createdAt
      isAnonymous
  dogs/
    {dogId}:
      name
      breed
      size
      ageGroup
      isBrachycephalic
      createdAt
      updatedAt
  savedWalks/
    {walkId}:
      walkId
      walkName
      location
      savedAt
  walkLog/
    {entryId}:
      walkId
      walkName
      date
      notes (null if not set)
      rating (1-5 or null)
      duration (minutes or null)
      weather (score, temp, summary snapshot)
      dogId
      createdAt
  savedPlaces/
    {placeId}:
      placeId
      placeName
      placeType
      savedAt
  settings/
    userPrefs:
      units (km or miles)
      radius (1/3/5/10)

---

## Sign-in on a new device - merge behaviour

1. Fetch all Firestore data for the UID
2. Fetch all localStorage data on the device
3. Merge by timestamp - newer entry wins per item
4. Saved walks: union of both sets
5. Walk journal: union of both sets, never discard
6. Dog profile: Firestore wins if exists, else local
7. Settings: local wins
8. Write merged result back to Firestore and localStorage

---

## Sign-out behaviour

- Keep all localStorage data on the device
- Start new anonymous Firebase session
- Me tab returns to anonymous state
- Email removed from header
- On next sign-in: merge local + Firestore as above

---

## Account creation

- Email and password only (Google OAuth is Phase 4)
- No display name - email is the identifier
- No email verification for development
  (required before public launch)
- Password minimum 8 characters
- Anonymous account upgraded via linkWithCredential
- On successful upgrade: immediately write dog profile
  and settings to Firestore

---

## Account deletion

- Accessible from Me tab settings
- On deletion:
  - Delete all Firestore data for UID immediately
  - Delete Firebase Auth account
  - Clear localStorage
  - Start fresh anonymous session
  - Show: "Your account and all data has been deleted"
- Required before public launch (GDPR right to erasure)

---

## Password reset

- Available from sign-in state only
- Sends Firebase password reset email
- No custom email template needed for development

---

## Out of scope

- Google OAuth (Phase 4)
- Push notifications (Phase 4)
- Profile photos
- Username/display name
- Public profiles
- Community features
