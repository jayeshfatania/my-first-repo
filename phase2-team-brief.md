# Sniffout — Phase 2 Team Brief

*Issued by: Product Owner*
*Date: March 2026*
*Phase 1 signed off. Phase 2 active. No outstanding Phase 1 work.*

---

## What Just Shipped (Phase 1 complete)

The build is clean and working. Everything in Phase 1 is done:
- Full 5-tab PWA at sniffout.app — Today, Weather, Walks, Nearby, Me
- 25 curated UK walks with full schema including `environment` field
- Live weather (Open-Meteo), walk verdict, paw safety (trigger-only), 5-day forecast
- Filter/sort bottom sheet on Walks and Nearby tabs
- Google Places venues (pubs, cafes, pet shops, vets) with photos
- Today tab: State A preview carousel, State B with weather hero + hidden gems
- Sunrise/sunset pill on Today tab weather hero; Lucide icons throughout
- All Rounds 1–7 design fixes confirmed

---

## Phase 2 Work — Three Streams in Order

### Stream 1 — Condition Tags + Mark as Walked

**Owner: Designer**
**Brief to produce: `condition-tags-designer-brief.md`**
**Priority: Start first**

**Context:** The highest-value Phase 2 feature. Zero moderation cost, no accounts required, and creates the daily habit loop Sniffout needs — users returning before every walk to check current conditions, not just to find a new one.

The feature is two linked things:
1. **Mark as walked** — a tap action on a walk card or walk detail. The trigger for the post-walk prompt.
2. **Condition tags** — a set of pre-defined tap labels (cattle in field, very muddy, flooded, etc.) surfaced immediately after a user marks a walk as walked. Tags appear on the walk entry for other users, timestamped, and auto-expire.

**What the design needs to cover:**

*Mark as walked:*
- Where does the button live? On the trail card, in the walk detail panel, or both? Tap interaction and confirmed state.
- What happens immediately after tap? The post-walk prompt fires.

*Post-walk prompt:*
- Appears straight after "mark as walked". Single-screen or bottom sheet.
- Tag selection: tap any that apply. No text input. "Done" or "Skip" to dismiss.
- The prompt must not block navigation if the user dismisses without tagging.
- A dismissed prompt does not reappear for the same walk on the same session.

*Condition tag display on walk cards and walk detail:*
- How are tags surfaced on the trail card in the carousel? Tag count + most recent tag? Tag icons only?
- Full tag list display on walk detail — with timestamp ("2 hours ago"), staleness treatment ("may be out of date" after 14 days, animal hazard tags after 7 days), and hidden state (>30 days, collapsible).
- Empty state: "Be the first to report conditions on this walk."

*Community disclaimer:*
- "Community reported — not verified by Sniffout" must appear adjacent to condition tags wherever they are shown — on walk cards and on walk detail. Not buried in small print. Not in ToS only. This is both a legal requirement and a trust signal.

**Approved tag set:**

| Category | Tags |
|----------|------|
| Hazard | Cattle in field · Sheep in field · Dogs on leads here · Access issue |
| Surface | Very muddy underfoot · Flooded section · Overgrown path · Icy/slippery |
| Positive | Great water point for dogs · Dog-friendly café open · Excellent conditions today |
| Footfall | Busy/crowded · Quiet today |

**Constraints:**
- No text input anywhere in this feature — single-tap minimum throughout
- Lucide icons only (no emoji, consistent with current build)
- Curated fields (difficulty, off-lead status, livestock boolean) are locked — condition tags supplement, never override
- Tags are stored against walk IDs with timestamp and device rate-limiting. No account required.
- No photo uploads — out of scope for this phase

**Output:** Design spec covering all surfaces above. Enough detail for the developer to build without ambiguity — element sizes, states (empty / with tags / staleness), interaction flows, copy strings.

---

### Stream 2 — Missing Dog Alerts (Design Only — No Build Yet)

**Owner: Designer**
**Brief to produce: `missing-dog-designer-brief.md`**
**Priority: Start after or in parallel with Stream 1**

**Context:** The feature with the highest word-of-mouth potential in the entire roadmap. Research confirmed genuine demand, a real gap in the market, and strong differentiation. A "found via Sniffout" story is exactly the kind of organic growth event that no advertising budget can replicate.

**Why we're designing now but not building:** Three hard blockers all resolve post-POC — backend infrastructure (push notifications require a server), user density (a 2-mile alert needs active users within 2 miles to be useful), and moderation capacity. Designing now means we can build quickly once those conditions are met — and a "coming soon" placeholder in the app signals the product direction to early users.

**What the design needs to cover:**

*Reporting flow (owner whose dog is missing):*
- Entry point: where in the app does this live? Today tab, Me tab, or a persistent emergency-style button?
- Form: photo upload → breed/colour → last seen location (GPS pin or postcode, shown as approximate area — never a precise address) → in-app contact method setup
- Review screen before submitting
- Confirmation state: "Your alert is live. We'll notify nearby dog walkers."

*Receiving an alert (nearby user):*
- In-app banner (shown on next open for users without push permissions): layout, copy, dismiss behaviour
- Alert card: photo + breed/colour + approximate last seen area + time posted
- "I've spotted this dog" action: drop a sighting pin + optional note → owner notified
- "Share this alert" action to extend reach beyond Sniffout users

*Alert management (reporting owner):*
- Active alert view: sightings received, map of pins
- "My dog has been found" resolution flow → notification sent to all searchers
- Auto-archive reminder at 7 days: "Is your dog still missing? Tap to keep this alert active."

*"Coming soon" placeholder card:*
- A card in the app (Me tab or Today tab) that communicates this feature is coming — without requiring any backend. This ships in the next developer session.
- Copy should convey the feature's purpose without over-promising a timeline.

**Non-negotiables (owner-confirmed):**
- Phone number verification required before posting — no exceptions
- One active alert per verified phone number at any time
- Last seen location shown as approximate map pin area only — never a home address
- Owner contact mediated through in-app messaging — owner's phone number never publicly displayed
- "Community reported — not verified by Sniffout" on all alert cards
- Photo required to post — breed descriptions alone are insufficient

**Output:** Full user flow designs for all three actors (reporting owner, nearby user, owner finding resolution). Data model outline. GDPR/privacy note on what data is displayed. Safeguarding spec confirming the non-negotiables above are met in the design. "Coming soon" placeholder card design.

---

### Stream 3 — Sticky Sniffout Picks (UX Exploration)

**Owner: Designer**
**Brief: Exploration only — no spec required yet**
**Priority: Can run in parallel with Streams 1 and 2, or after**

**Context:** On the Walks tab, curated Sniffout Picks cards appear above "Other nearby green spaces." As the user scrolls through green space results, the Sniffout Picks section disappears entirely. The hypothesis is that anchoring Sniffout Picks while green spaces scroll below would reinforce the hierarchy — curated content first, supplementary content below — at all scroll positions, not just at page load.

**What the exploration needs to answer:**
1. Is sticky section positioning technically achievable within the current single-scroll-container layout? (The Walks tab is a continuous scrolling view — a sticky child element within a scrolling parent may not behave as expected on iOS Safari.)
2. Does sticky behaviour feel right on device, or does it create visual clutter when the Picks section is simultaneously visible and the green spaces are scrolling?
3. Is there a simpler alternative — e.g. a fixed "Sniffout Picks ↑" anchor button that snaps the scroll position back to the top of the curated section — that achieves the same goal with less implementation risk?

**Output:** A short recommendation to the PO — sticky / alternative approach / don't implement — with a prototype or annotated screenshot if needed. This feeds a developer brief only if the recommendation is to proceed.

---

## Developer — Status

No active brief. Developer is free while the three designer streams above are in progress.

Next developer session will be: condition tags + mark-as-walked build brief, issued once the condition tags design output has been assessed by the PO. This will be a significant build session — the first new feature in Phase 2.

---

## What Is Not In Scope for Phase 2

To be explicit about what the Designer and Developer should not build, plan for, or add complexity around:

| Item | Status |
|------|--------|
| Star ratings (community-submitted) | Deferred. Seeded WALKS_DB ratings remain as-is. |
| Written reviews | Phase 2b only, after condition tags are live. Requires lightweight account. |
| Photo uploads | Deferred until account infrastructure exists. |
| Walk submission (user-created routes) | Phase 3. |
| Firebase backend | Prerequisite for missing dog alerts and accounts. Phase 3. |
| Push notifications | Requires backend. Phase 3. |
| Full social layer (following, activity feeds) | Phase 3. |
| Breed personalisation | Phase 3 / post-POC. |
| Pollen (Open-Meteo european_aqi) | Phase 3. |
| UV index fetch | Phase 3. |
