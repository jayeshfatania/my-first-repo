# Developer Questions — Open Items for PO Review
*Raised by Developer. March 2026. PO responses added.*

---

## **🚨 DO NOT MODIFY `dog-walk-dashboard.html` — EVER**

## Part 1: Decisions Already Made on the PO's Behalf

The following decisions were made by the project lead during the mockup review session. PO has reviewed and confirmed or amended each one.

| Decision | Instruction given | PO Status |
|---|---|---|
| **Hero headline** | Use `Discover great walks.` — overrides the copy review's recommendation of `Find your next great walk.` | ✅ Confirmed. Owner signed off on this directly. |
| **Tagline dropped** | `Dog walks, done properly.` is not to be used anywhere in the app. Removed entirely. | ✅ Confirmed for POC. Held for post-POC consideration. |
| **Onboarding overlay deferred** | Do not build the onboarding overlay for now. | ✅ Confirmed. Out of scope for this sprint. |
| **Mockup shows both Today states** | State A and State B toggled via "Use my location" button. | ✅ Confirmed. Correct approach. |
| **⏳ copy used in mockup** | Pending copy items used in mockup as-is. Not cleared for live app. | ✅ Confirmed. See Part 2 below for final decisions on each. |

---

## Part 2: Copy Items — PO Final Decisions

### 1. Home subline (State A, Today tab)
Mockup shows: `Handpicked walks. Live conditions. No account.`

**PO decision: ✅ Approved with amendment.**
Use: `Handpicked walks. Live conditions.`

**Wider instruction — applies to the entire app:** Do not use "free", "no sign-up", "no account", or "no login" anywhere in the app. These reflect the current product stance but are not permanent promises. Advertising them now creates a problem if either changes in future. Remove from all surfaces: home screen, onboarding, metadata, social proof strips, Me tab, PWA install card — everywhere.

---

### 2. Hero body text (State A, Today tab)
Mockup shows: `50+ handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots. Free, no sign-up.` *(remove "Free, no sign-up." — see instruction in item 1 above)*

**PO decision: ✅ Approved as written.**

---

### 3. Meta description
Proposed: `Discover 50+ handpicked UK dog walks with live weather checks, paw safety alerts and nearby dog-friendly spots.` *(remove "Free, no sign-up." — see instruction in item 1 above)*

**PO decision: ✅ Approved as written.**

---

### 4. Onboarding overlay title
Proposed: `Good walks for you and your dog.`

**PO decision — updated: ✅ Use `Discover great walks` for now.**
This is a POC — the title can be revisited when the overlay is formally scoped. `Discover great walks` is consistent with the hero headline already used in State A and is good enough for this stage. Copy reviewer to take another pass if/when the onboarding overlay is built properly.

---

## Part 3: Screenshot Review — Today Tab (State A)

One screenshot has been reviewed (`screenshots/Screenshot 2026-03-13 at 15.41.21.png`). This shows the Today tab State A (no location set). *Note: owner initially described this as the Me tab — confirmed to be the Today tab.*

**Overall structure is correct. Two issues to fix, one design decision to reconsider:**

**Fix 1 — Subline still shows "No account." and hero body ends with "Free, no sign-up."**
Update subline to `Handpicked walks. Live conditions.`. Remove the closing "Free, no sign-up." from the hero body. And apply the wider rule: no "free", "no sign-up", or "no account" anywhere in the app. See Part 2, item 1.

**Fix 2 — The preview section reads as broken, not intentional**
The "WHAT YOU'LL GET" section shows a greyed-out walk card and a smaller weather preview card. The owner's observation is correct: these look flat and ambiguous — more like content that failed to load than a deliberate teaser.

The design spec intent was: *"a real card component in a muted state"* with a soft overlay. The current execution is too grey and too close to a broken state. Two options — choose one:

**Option A (preferred): Warmer preview cards**
- Walk preview card: use `background: rgba(30,77,58,0.06)` with a `1px solid rgba(30,77,58,0.15)` border — gives it a light brand-green tint, feels intentional
- Ensure the "Off-lead" badge, walk name, and tags are clearly readable (not faded to illegibility)
- The card should look like a real card seen through frosted glass, not a grey placeholder

**Option B: Replace preview cards with a simpler value proposition block**
- Remove the preview cards entirely from State A
- Replace with a short, punchy three-line list under a `What you'll get:` label:
  - `🐾 50+ handpicked UK walks`
  - `☁ Live weather + paw safety checks`
  - `📍 Dog-friendly places nearby`
- Simpler, cleaner, no ambiguity about whether content has loaded

PO recommendation: **Option A** if the warmer card treatment works visually. **Option B** if the preview card concept continues to read as broken after the fix. Developer to implement Option A first; if it still doesn't feel right, switch to Option B.

**Observation — "WHAT YOU'LL GET" label**
The all-caps label `WHAT YOU'LL GET:` is fine functionally but slightly formal. Consider `Here's what you'll see:` or simply removing the label entirely — let the cards speak for themselves, as the design spec originally described.

---

## Part 5: Genuinely Open Questions — PO Answers

### Q1. Walk photo sourcing — who owns this?

**PO answer — updated:**
- Photo sourcing owner: **project lead (owner)**. ✅ Assigned.
- Photos are not needed before development begins. Developer will implement `imageUrl` rendering and use solid brand-green `#1E4D3A` as the placeholder for any walk without a photo. This is intentional and on-brand.
- When photos are ready, the owner will save them to a dedicated folder in the repo. Developer to update the `imageUrl` field for each walk entry at that point — no code changes needed, content update only.
- Approved sources: Unsplash and Wikimedia Commons (both free, licensed). Do not use unlicensed images.

---

### Q2. Walk schema sign-off

**PO answer: Approved with one field removed.**

The following fields are confirmed for Sprint 2:

```
offLead:      "full" | "partial" | "none"   ✅ Required — filter chips depend on it
livestock:    boolean                        ✅ Required — filter chips
hasStiles:    boolean                        ✅ Required — shown in walk detail
hasParking:   boolean                        ✅ Required — shown in walk detail
terrain:      "paved" | "muddy" | "mixed" | "rocky"  ✅ Required — filter chips
difficulty:   "easy" | "moderate" | "hard"  ✅ Required — shown on card
imageUrl:     string (URL)                  ✅ Required — walk card photo
badge:        "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined  ✅ Required
rating:       number (e.g. 4.2)             ✅ Required — shown on card
reviewCount:  number                        ✅ Required — shown on card
distance:     number (miles)                ✅ Required — shown as number, not string
duration:     number (minutes)              ✅ Required — shown as number
source:       "curated" | "places"          ✅ Required — hybrid content model
description:  string                        ✅ Already exists
```

**Remove for now:**
```
isPushchairFriendly: boolean   ❌ No filter chip, no UI reference — defer until needed
```

No other fields should be added without PO sign-off. Once this schema is locked and 50+ entries are updated, changing it is expensive.

---

### Q3. iOS "Get directions" link

**PO answer: Use Option A — detect platform, serve appropriate URL.**

- iOS: `https://maps.apple.com/?q={lat},{lon}` — opens native Apple Maps
- Android / other: `https://maps.google.com/?q={lat},{lon}` — opens Google Maps

Use `navigator.platform` or `navigator.userAgent` to detect iOS. This is standard practice and a small amount of code. Do not accept the iOS limitation (Option C) — "Get directions" is a key action on the Nearby tab and walk detail, and it failing silently on iOS (the dominant platform for this user base) is not acceptable.

---

### Q4. Marker clustering on map views

**PO answer: ✅ Confirmed deferral. Build without the plugin.**

Do not add the Leaflet.markercluster CDN dependency. Build the map views without clustering first. If the experience is genuinely unusable when many pins are on screen simultaneously (say, 15+ overlapping pins at a zoom level), raise it again at that point with a specific example. Don't solve for a problem that may not exist in practice given our current walk count (~50 entries).

---

### Q5. Walk completion tracking and "Walks explored" stat

**PO answer: Passive tracking — no explicit "mark as done" UI needed.**

`Walks explored` = number of distinct walk detail views. When a user taps a walk card and the walk detail overlay opens, increment a counter in `localStorage: sniffout_explored` (a Set of walk IDs — count the size of the Set). No button, no swipe, no explicit action required from the user.

This is the simplest implementation, doesn't require new UI, and aligns with how "explored" feels semantically — you've looked at it and considered going. A dedicated "mark as done" button is a future consideration if users want it, but not for this sprint.

---

### Q6. Community tab — confirm out of scope

**PO answer: ✅ Confirmed. Community tab is fully out of scope.**

Five tabs only: Today · Weather · Walks · Nearby · Me. Do not add a Community tab placeholder, a greyed-out sixth tab, or any community-related UI. It does not exist until explicitly scoped and approved.

---

## Part 6: Summary — Actions and Status

| # | Owner | Action | Status | Blocking |
|---|---|---|---|---|
| 1 | Developer | Update home subline to `Handpicked walks. Live conditions.` and remove ALL "free" / "no sign-up" / "no account" copy from every surface | ✅ PO confirmed | All sprints |
| 2 | Developer | Hero body text approved as written | ✅ PO confirmed | Sprint 3 |
| 3 | Developer | Meta description approved as written | ✅ PO confirmed | Pre-launch |
| 4 | Developer | Fix Today tab State A preview cards: warmer treatment (Option A) | ✅ Done | Sprint 3 |
| 5 | Developer | Audit entire app for "free" / "no sign-up" / "no account" — remove all instances | ✅ Done | All sprints |
| 6 | Owner | Assign walk photo sourcing owner | ✅ Owner will source photos and drop into repo folder — not a blocker for development | Sprint 2 |
| 7 | Developer | Use brand green placeholder for walk cards without imageUrl | ✅ PO confirmed | Sprint 2 |
| 8 | Developer | Implement WALKS_DB schema as confirmed above (isPushchairFriendly removed) | ✅ PO confirmed | Sprint 2 |
| 9 | Developer | iOS directions: platform detect, Apple Maps on iOS / Google Maps on Android | ✅ PO confirmed | Sprint 4 |
| 10 | Developer | Defer marker clustering — build without plugin | ✅ PO confirmed | Sprint 4 |
| 11 | Developer | Walks explored = passive view tracking (localStorage Set of walk IDs) | ✅ PO confirmed | Sprint 5 |
| 12 | Developer | Community tab: fully out of scope, do not add | ✅ PO confirmed | N/A |
| 13 | Developer | Onboarding overlay title — use `Discover great walks` when built; revisit copy then | ✅ Settled for POC | Future sprint |

---

*Status as of March 2026: All Developer items are resolved. All PO decisions are recorded. Photo sourcing is owned by the project lead and is not a development blocker. The mockup is final and ready to be used as the design reference for the Phase 1 brief.*
