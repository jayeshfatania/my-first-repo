# Sniffout - Session Handoff Note
**Date:** 26 March 2026 (end of session)
**Prepared by:** Claude (chat coordinator)
**Purpose:** Complete context handoff for the next session.
**Replaces:** session-handoff-march-25.md (move to docs/handoffs/archive/)

---

## SECTION 1 - WHAT CHANGED THIS SESSION

### Rounds completed

**Round A - Walk detail overlay**
- H1 walk name removed from DOM entirely
- Fake star ratings removed from DOM entirely
- Stats row rebuilt: distance (route icon), duration (clock icon), difficulty (coloured text), off-lead (circle-check icon) - 4 items, horizontal flex row, border-top separator, first element in content area
- Hero height increased: 320px standard / 240px compact (viewport < 620px), image element 400px/320px
- Header name (#walk-detail-header-name) fades in on scroll - opacity 0 on open, transitions to 1 once user scrolls past hero image. Resets to 0 on overlay close.

**Round B - Tab header polish and map bottom container consistency**
- Both tab headers (.tab-title-bar): 60px height, Inter 700 18px title (.tab-title H2), Inter 400 13px location line, 1px border-bottom
- Nearby map bottom container (.nearby-filters): background, border-top, box-shadow now matching .walks-inmap-filter
- List/map fade transition: transition: all on containers

**Round C - Nearby chips and Walks map controls**
- Nearby chips: Lucide icons added (beer/pubs, coffee/cafes, shopping-bag/pet shops, heart-pulse/vets, bookmark/saved), 34px height, Inter 600, pill shape, brand green active state
- Nearby map view chips (#nearby-map-cat-bar): same icons applied
- Walks map bottom: renamed "Picks" to "Sniffout Picks", added star icon. "Green spaces" added trees icon. Both now pill chip style matching Nearby chips.
- .walks-inmap-filter: transparent container, chips float independently on map
- Bug fixed: Nearby map chips no longer persist on screen when switching to another tab
- Scrollability hint: CSS gradient mask on right edge of .nearby-filters and #nearby-map-cat-bar

**Round D - Map pins**
- All DivIcon iconSize updated to [44, 44], iconAnchor [22, 22] - WCAG 2.5.5 tap targets
- Selected pin state: white halo via box-shadow: 0 0 0 4px rgba(255,255,255,0.92), 0 2px 10px rgba(0,0,0,0.38) - applies to .walk-pin.selected, .venue-pin.selected, .greenspace-pin.selected
- Zoom threshold lowered from 9 to 8
- Zoom overlay message updated: "Zoom in to see walks nearby" headline + "Pinch to zoom into any area." body, map-pin Lucide icon

**Additional fixes this session**
- .nearby-map-expand-btn removed entirely (dead feature, nearbyFsMap is dead code - clean up in refactor round)
- .nearby-map-cat-bar white container removed (transparent, chips float on map)
- Walks map filter (.walks-inmap-filter) centred with left: 50% / transform: translateX(-50%), transparent container
- Walk detail map tap card z-index fixed: .walks-map-card z-index 410, .walks-inmap-filter z-index 400
- Firebase completely disabled: FIREBASE_WRITE_ENABLED = false at line 13865 (global scope). firebase.initializeApp() and all auth/Firestore inside if block at line 13885. Zero network calls, zero billing.
- Places API cache persisted to localStorage (sniffout_places_cache): reads on page load, writes after every fetch, prunePlacesCache() removes expired entries on load. 30 min TTL for venues, 60 min for green spaces. Cache survives page reloads - zero API calls on reload within TTL window.

### Design references confirmed this session
- Google Maps and What3Words app screenshots reviewed as inspiration for map chip and floating controls treatment
- Chips with icons (Lucide, not emoji) confirmed as correct direction - implemented in Round C
- Floating controls with no backing container confirmed as correct direction - implemented in Round C/D

---

## SECTION 2 - BILLING STATUS

Google Cloud billing - important context for next session:

The Sniffout project (sniffout-fe976) spent £11.52 in March 2026. All Places API (New). No Firebase costs. The spike was from today's heavy testing session (732+ API calls in one session due to in-memory-only cache being wiped on every page reload).

Two mitigations now in place:
1. Firebase fully disabled - FIREBASE_WRITE_ENABLED = false. Re-enable by changing to true when Phase 3 begins. Do not enable earlier.
2. Places API cache persists to localStorage - page reloads within TTL window fire zero API calls.

Walk Planner project (walk-planner-489217) shows £90.86 for March - this is the old API key incident, not an ongoing issue. Walk Planner Places API key is disabled.

Budget alert set at £15/month for Sniffout project. Consider raising to £20 for March only given £11.52 already spent. From April onwards, normal development costs should be well under £5/month.

---

## SECTION 3 - DESIGNER AND COPYWRITER SESSION AGENDA

Confirmed items ready to brief:

1. Today tab hero card - solid colour block (amber/caution, green/good) is too dominant, not premium enough. Colour-coded system stays. Treatment needs to be subtler - soft tint rather than saturated fill. Owner confirmed this is the highest priority design item.

2. Weather/Today tab copy tone - Copywriter round. Current copy is too warning-heavy. Sniffout helps people find good walks, not avoid going out. Reframe: helpful and practical for caution conditions, strong steer only for genuine danger (extreme heat, lightning, severe wind). Full copy tone review needed.

3. Map tap card redesign - the walk card that appears when tapping a pin in Walks map view is functional but visually poor (flat, no shadow, no image, heavy buttons). Needs full Designer spec. Reference: Google Maps compact bottom sheet card pattern.

4. Nearby list view chip row container - .nearby-filters has a white background/border that looks like a separate bar bolted onto the page. Consider transparent treatment or matching page background. Deferred from Round C by owner decision.

5. Me tab settings cog tap target - small and close to card edge, may be fiddly on device.

---

## SECTION 4 - DECISIONS MADE THIS SESSION

- Venue card redesign (Task 2 point 5 from designer-brief-march-25-spec.md) permanently skipped per owner. Icon-based design stays. Do not re-implement without fresh Designer spec and owner approval.
- Dog profile photo deferred to Phase 3 (Firebase Storage). localStorage-only implementation rejected.
- Map tap card redesign deferred to Designer session. Z-index fix applied this session.
- FIREBASE_WRITE_ENABLED flag: flip to true when Phase 3 migration begins only.
- No em dashes rule confirmed - applies to all content and code.

---

## SECTION 5 - WHAT COMES NEXT (PRIORITY ORDER)

1. Designer session - Today tab hero card, map tap card, Nearby list view chip container, Me tab settings cog
2. Copywriter session - Weather/Today tab copy tone review
3. Code refactor round - Remove dead nearbyFsMap code, other dead code cleanup, consolidate duplicate functions, document major functions. Must complete before Phase 3.
4. Walk photos - 97 walks still need photos. 7 showcase carousel walks are priority.
5. Phase 3 Firebase migration - spec complete at docs/specs/firebase-phase3-migration-spec.md. Gated on L1/GDPR sign-off. Flip FIREBASE_WRITE_ENABLED to true when ready.
6. Legal - L1-L5 all solicitor-dependent. L5 (T&C consent screen) is hard go-live blocker.
7. Pre-launch checklist - sniffout.co.uk redirect (B2), H10 OS Maps API key security review, OS Maps support ticket awaiting response.

---

## SECTION 6 - QUICK REFERENCE UPDATES (new items this session)

Add these to the existing Quick Reference section, numbered from 63 onwards:

63. FIREBASE_WRITE_ENABLED = false at line 13865 - all Firebase calls disabled. Flip to true for Phase 3 only. Do not enable earlier.
64. Places API cache persists to localStorage as sniffout_places_cache - survives page reloads, 30/60 min TTL, prunePlacesCache() runs on load. Zero API calls on reload within TTL.
65. nearbyFsMap is dead code - expand button removed this session. Clean up in refactor round.
66. Walk detail header name fades in on scroll - opacity 0 on open, 1 after scrolling past hero. Resets on close.
67. Walks map filter (.walks-inmap-filter) is transparent - chips float on map. Do not add background or border back.
68. Map tap card z-index is 410 - above .walks-inmap-filter (400). Do not change without checking overlap.
69. Venue card redesign permanently skipped per owner - icon-based design stays. No reimplementation without fresh Designer spec and owner approval.
70. Google billing: sniffout-fe976 spent £11.52 in March 2026 - all Places API from dev testing. Mitigations in place (localStorage cache + Firebase disabled).
71. Walk detail overlay off-lead field name is walk.offLead (values: 'full' / 'partial' / 'none').
72. Map tap card redesign needs Designer session - current card is functional placeholder only.
