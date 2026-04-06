# Community Features - Research Summary and Product Decisions
**Date:** 3 April 2026
**Research:** docs/research/community-features-research-april-3.md
**Status:** Research complete. Spec to be written when ready to build.

---

## Key Recommendation

Do not open community walk submissions until the curated library provides reliable regional coverage. PlayDogs launched with community-only content and failed in new regions (3.2 Google Play rating, reviews citing "entire city is a black hole").

Sniffout's curated library is its most important competitive advantage. Community features layer on top, not instead.

---

## Three-Stage Phasing

### Stage 1 - Ratings and condition tags on curated walks
- Star rating (1-5) with GPS verification required
- Condition tags (tap-to-select: muddy, dry, livestock present, etc.)
- Optional 280-character text
- Minimum 5 ratings before aggregate shows
- Prerequisites: Firebase auth, GPS trace logging
- Timeline: first community feature to build

### Stage 2 - Condition and hazard reports (3-6 months after Stage 1)
- Hazard flags with map pins (livestock, trail blocked, water hazard, grass seeds)
- 14-day auto-expiry on reports
- Team notification on safety flags
- Community flagging on all user content
- Prerequisites: Firebase condition report model, Cloud Functions for expiry and notifications

### Stage 3 - Community walk submissions (not before Stage 2 stable + curated library sufficient)
- Full walk submission with GPS route required
- Pre-publication moderation (owner reviews before live)
- Photo moderation via Google Vision API
- Community vs curated badge distinction in UI
- Hard prerequisite: minimum 5 curated walks per area page
- Hard prerequisite: legal ToS updated with UGC licence grant

---

## Monetisation Alignment

Community features create new monetisation angles:

1. **Sniffout+ subscription strengthened by community.** Free tier: ratings, basic condition tags. Paid tier: full condition history, contributor badges, priority moderation, access to community walk data beyond local area. Design the free/paid boundary BEFORE launching community features to avoid takeaway perception.

2. **Community data improves sponsored venue listings (Phase 3).** User reports of "great dog-friendly pub at end of walk" make venue listings more valuable to advertisers.

3. **Breed-specific reviews are unique SEO content.** "I walked this with my French Bulldog and it was fine in October" - this data feeds the scoring engine AND creates content no competitor has.

4. **Risk: moderation costs.** Google Vision API and Firebase usage for UGC add running costs before revenue. Budget for this.

5. **Recommended alignment:**
   - Phase 1 monetisation (affiliate links) = independent of community
   - Phase 2 monetisation (Sniffout+) = launches WITH or AFTER community Stage 2
   - Phase 3 monetisation (sponsored venues) = strengthened BY community Stage 2/3 data

---

## Legal Requirements (must be in place before any community feature)

- UK GDPR: every UGC document has submittedByUID field. Erasure Cloud Function built and tested before launch.
- Copyright: ToS includes perpetual royalty-free non-exclusive licence grant for user content
- Liability: disclaimers on community content (within UK law limits - cannot exclude negligence liability)
- Public land: submission checkbox confirming route follows public rights of way
- Age: ToS states service not intended for users under 13

---

## Key Numbers

- 90/9/1 rule: 90% lurk, 9% rate/flag, 1% submit walks
- At 10,000 MAU: expect ~100 submissions/month
- At 1,000 MAU: expect ~10 submissions/month (not enough to fill a map)
- GPS verification prevents rating gaming
- 5 ratings minimum before aggregate displays
- 14-day auto-expiry on condition reports

---

## Dog-Specific Community Value (no competitor has this)

- Breed-specific reviews ("walked this with my Frenchie in October - fine")
- Dog-specific condition flags (livestock, off-lead status, water access)
- Community data feeding back into smart scoring engine
- Shade reports improving heat scores
- Mud reports confirming mud risk indicator
