# Sniffout - Session Handoff Note
**Date:** 27 March 2026 (afternoon)
**Prepared by:** Claude (PO)
**Purpose:** Complete context handoff for the next session.

---

## SECTION 1 - COST REDUCTION: PLACES API

### Billing result

Billing confirmed at £0.13 for the day, down from £69.87 spike. 99.8% reduction.
Breakdown: approximately 10 photo calls + 3 searchText calls for the full day.

### Changes made this session

- **Race condition fix:** `_gsInFlight` guard added to `fetchGreenSpacesForWalks` - prevents duplicate concurrent fetches
- **Cache TTL extended:** 24 hours for all categories (up from 30/60 min)
- **View more button:** 10 initial results for venues, 5 for green spaces - reduces calls on load
- **Lazy photo loading:** IntersectionObserver with rootMargin 200px - photos only fetched when card enters viewport
- **Cloudflare Worker proxy caching:** active for both photo GETs and searchText POSTs
- **maxResultCount reduced:** from 20 to 10 for `fetchNearbyPlaces`
- **Google Maps escape hatch:** added after last result for all categories
- **OpenStreetMap Overpass API hybrid:** parallel fetch alongside Google for green spaces - OSM fills gaps, Google wins on overlap, 24h cache, retry on 504
- **OSM quality filtering:** access tags, exclude keywords, tag-based filters applied

### Current cost profile

- Cold load: 5 Google searchText + 1 Overpass + 2 photo GETs
- Cost per cold load: approximately £0.13
- At 100 users/day: approximately £3-8/day

---

## SECTION 2 - LEGAL AND BUSINESS DECISIONS

### Business structure

Owner confirmed: currently sole trader, no limited company yet. Limited company must be formed before launch.

- **Process:** Companies House online registration - £100, approximately 15 minutes, 24 hours to complete
- **ICO registration:** required - approximately £52/year - register at ico.org.uk
- **Recommendation:** limited company for liability protection before any public launch

### Legal setup

- **Solicitor needed for:** T&Cs, Privacy Policy, liability limitation, trade mark
- **Recommended route:** Sprintlaw or LawBite - fixed-fee online services, startup-focused
- **Estimated cost:** £600-1,500 one-off

### Monetisation direction

- Priority: self-sufficient first (cover running costs), profitable second
- Preferred routes: venue partnerships, affiliate links, freemium

### Google pricing context

- Pay-as-you-go currently correct for current scale
- Automatic volume discounts apply at scale
- Subscription plans available at 50k-250k calls/month
- Negotiated enterprise rates at 1M+ requests/month

---

## SECTION 3 - TYPEFACE DECISION

### Decision

Replacing Fraunces (display) + Inter (body) with a single font: **Plus Jakarta Sans**.

- **Reason:** inconsistency feedback, desire for clean, confident, consumer-friendly feel
- **Weights:** 400, 500, 600, 700, 800

### Developer brief sent 27 March 2026

- Google Fonts import update (line 24)
- CSS variable updates (lines 73-80)
- Direct Fraunces replacement (lines 831, 1156)
- Typography adjustments: letter-spacing on large numbers, Luna name at 800 weight

---

## SECTION 4 - DESIGN TASKS IN PROGRESS

Developer brief sent 27 March 2026. Status: in progress.

### Map tap card

- Full border-radius all corners (`var(--radius-xl)`)
- Drag handle added: 32px wide, 4px tall
- Box shadow: `0 -2px 20px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)`
- Padding reduced from 16px to 14px
- 8px bottom margin added
- z-index remains 410

### Settings cog (Me tab)

- Tap target increased to 44x44px minimum (WCAG AA)
- Visual icon size unchanged
- Achieved via padding + negative margin compensation

### Verdict copy

- Updated strings: storm, wind-avoid, wind-caution, rain-cold, rain, approved, cold-caveat
- Tone: warmer, more personal, less alarm-heavy
- Rules: hyphens only (no em dashes), no exclamation marks

---

## SECTION 5 - LEGAL REQUIREMENTS RESEARCH

Completed this session. Summary of requirements before launch:

| Area | Requirement | Notes |
|------|------------|-------|
| GDPR | ICO registration (£52/year), Privacy Policy, T&Cs, lawful basis documentation | Accept Google/Firebase/Cloudflare DPAs. No DPO required at this scale. |
| PECR | Push notifications require explicit opt-in | Already designed correctly. |
| Consumer Rights Act | Relevant if subscription model introduced | Not yet applicable. |
| Equality Act 2010 | Accessibility compliance - WCAG AA | Partially met - 44px pins already in place. |
| IP | Trade mark "Sniffout" recommended before launch | £170 for one class. |
| Business structure | Limited company recommended before launch | Liability protection. |

---

## SECTION 6 - CURRENT STATE

### App

- All five tabs functional with Signature Tactile design system
- Billing: approximately £0.13/day (owner testing only)
- `FIREBASE_WRITE_ENABLED = false` - do not enable until Phase 3
- `extractPlaceId()` at line 5972 - do not remove or modify
- Cloudflare Worker: `Referer: https://sniffout.app` must be present in all proxy requests
- `workers/places-proxy.js` in repo - Worker code version 89996423
- Green spaces: hybrid Google+OSM, OSM fills gaps, 24h cache
- Nearby: 10 initial results, Google Maps escape hatch after all results shown
- Typeface change in progress - Plus Jakarta Sans replacing Fraunces+Inter
- Design round in progress - map card, settings cog, verdict copy

### Owner actions outstanding

- Companies House registration (£100, 15 min online)
- ICO registration (£52, ico.org.uk)
- Solicitor engagement (Sprintlaw or LawBite recommended)
- OS Maps support ticket still outstanding - no response yet
- Trade mark application for Sniffout (£170, one class)

### Hard go-live blockers

| Blocker | Status |
|---------|--------|
| L5 - T&C consent screen | Needs solicitor first |
| T12 - Pen test | Not started |
| T16 - Full end-to-end test pass | Not started |
| T17 - Firebase security review | Not started |

### Known backlog items

- Open/closed status stale after 24h cache (line 12588) - recalculate live without API call
- Pubs/restaurants Nearby tab (FIX 23.2) - reverted, needs scoping before re-adding
- B2 beforeunload handler - deferred, needs careful device testing
- Proxy-level Cloudflare caching improvements - carry-over

---

## SECTION 7 - QUICK REFERENCE (new items this session)

- **Billing is now £0.13/day** - 99.8% reduction from spike. Mitigations: 24h cache, lazy photos, IntersectionObserver, OSM hybrid, maxResultCount 10, Cloudflare proxy caching.
- **OSM Overpass API is now part of green spaces fetch** - parallel with Google, OSM fills gaps, Google wins on overlap, 24h cache, 504 retry. Do not remove OSM path.
- **`_gsInFlight` guard in `fetchGreenSpacesForWalks`** - race condition fix. Do not remove.
- **Plus Jakarta Sans is the new typeface** - replaces Fraunces+Inter. Single font, weights 400-800. Change in progress.
- **Limited company required before launch** - owner is currently sole trader. Companies House, £100, 15 min.
- **ICO registration required** - £52/year, ico.org.uk. Must register before launch due to GDPR.
- **Solicitor engagement is an owner action** - Sprintlaw or LawBite recommended. £600-1,500 one-off. Blocks L5 (T&C consent screen).
- **Trade mark recommended** - "Sniffout", £170, one class, before launch.
- **Google Maps escape hatch** - appears after last result for all Nearby categories. Do not remove.
- **View more button initial counts** - 10 for venues, 5 for green spaces. Do not increase without billing review.
