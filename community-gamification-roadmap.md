# Community & Gamification Roadmap
**Role:** Product Owner review of research findings
**Based on:** research-report-community-gamification.md
**Date:** March 2026

---

## How to Read This Document

Each phase covers what to build, what to start, and what to defer. Within each phase, three standing flags appear:

- **✅ Agree** — researcher recommendation this roadmap adopts
- **⚠️ Challenges assumption** — finding that conflicts with current thinking or reveals a gap
- **🔴 Decision required** — owner must decide before work can begin

---

## Phase 2 — No Backend, localStorage Only (Current)

### What community and gamification features can be built now

Phase 2 can deliver a meaningful personal engagement layer without any backend. The key insight from the research is that the data we need already exists or is trivially capturable.

**Walk history (passive logging)**

`sniffout_explored` is already a Set of viewed walk IDs. Upgrade it to a timestamped object immediately — before real users build up history — so that Phase 3 can migrate it meaningfully into a profile. The minimum useful record per "visit" is: `{ walkId, timestamp, season }`. Season can be derived from the timestamp at read time. Weather conditions can be inferred from the `sniffout_session` weather data if the session is still live when the walk is opened.

```
sniffout_explored: {
  "walk_id": [{ ts: 1741200000, season: "winter" }, ...]
}
```

This is a one-time schema change. Do it before any user-facing walk history features ship.

**"Last visited" on walk cards**

Once the timestamped schema is in place, walk cards in the Walks tab can show a quiet secondary line: "You visited this in winter · 2 visits". This is passive, non-gamified, and genuinely useful. It also quietly signals to users that the app is tracking their history — planting the expectation that a fuller logbook is coming.

**Me tab: stats and milestone badges**

The Me tab should become a personal stats hub, not just a settings screen. Ship the following:

*Stats display (always visible)*
- Walks explored: count of unique walk IDs in `sniffout_explored`
- Walks favourited: count of `sniffout_favs`
- Regions visited: derived from the `location` field of explored walks (deduplicated by region string)

*Milestone badges (computed in JS, no backend)*

| Badge | Trigger | Logic |
|---|---|---|
| Explorer | 5 unique walks opened | `sniffout_explored` count ≥ 5 |
| Trailblazer | 10 unique walks opened | count ≥ 10 |
| Regional Rambler | Walks in 3+ different regions | deduplicate `location` field across explored walk IDs |
| Weatherproof | Walk opened in 3+ weather conditions | requires timestamped schema + session weather data |
| Seasonal Walker | Same walk opened in 2+ different seasons | requires timestamped schema |
| Favourites Collector | 5+ walks favourited | `sniffout_favs.length ≥ 5` |

These badges render as visual chips in the Me tab. They should feel earned, not patronising — do not award anything on first open. The "Explorer" badge (5 walks) is the minimum meaningful milestone.

**Ratings: minimum threshold before display**

The existing `walkReviews` in localStorage already supports user reviews. Add a minimum display threshold of 3 reviews before showing a star rating. Below that threshold, the rating slot should show "Be the first to review" as a CTA, not a partial star rating. This prevents noise from single reviews and converts low-review-count from a visual weakness into an engagement prompt.

The hardcoded ratings in `WALKS_DB` are a separate question — see Decisions below.

### What content and editorial work can begin without infrastructure

**Sniffout Pick badge curation**

The `badge` field in `WALKS_DB` already supports `"Sniffout Pick"`. This is editorial work, not engineering: walk through the database and assign the badge deliberately, based on a consistent standard (e.g., high rating + curated description + good image). The badge should mean something. Do not assign it to more than 20–25% of walks.

**Static SEO landing pages**

The single-file PWA has zero organic search surface area. The research is unambiguous that trail pages and editorial lists are the primary SEO asset for platforms in this category, not blog posts. The action is creating simple static HTML pages at paths like `/walks/london`, `/walks/peak-district`, `/walks/edinburgh` — one per major UK city or region in WALKS_DB.

Each page: a brief editorial intro, a list of the top 5–8 walks in that region with name + distance + description, and a "View in Sniffout" CTA pointing to `sniffout-v2.html`. No backend required. Pure static HTML. This is a one-time content effort that compounds indefinitely as search traffic.

**Social content preparation**

The dog content format advantage identified in the research is real. The preparation work for Phase 2 is creative, not technical: identify 5–8 walks from WALKS_DB that would photograph well and are within reach of major UK cities. These become the first wave of TikTok and Instagram content. The brief: "hidden gem dog walk near [city]" — POV walking footage, dog as protagonist, no production polish needed.

---

### Phase 2 flags

**✅ Agree with researcher**
- No streaks. Dog walking is already a daily habit; streaks create anxiety without purpose and would penalise normal behaviour (missing a weekday walk). Milestone badges are the right alternative.
- Milestone badges computed from existing localStorage data. The logic is pure JS, costs nothing, and creates genuine engagement momentum.
- Minimum 3-review threshold before displaying a star rating. Single-review ratings are noise; low count should be a CTA, not a flaw.
- Reviewed-before-publish approach when community submissions eventually open. Quality of the curated foundation is the primary moat.
- TikTok for reach, Instagram for conversion. Post the same content to both.

**⚠️ Challenges current assumptions**

1. **`sniffout_explored` is a Set, not a timestamped log.** The current schema loses all temporal data. If users start exploring walks before this is upgraded, that history is permanently shallow — we get a count but no "visited in winter" context, no season badges, no "last visited" card data. This is a now-or-never schema decision: change it before any walk history features ship.

2. **The Me tab is currently a settings screen.** The research makes a strong case that this tab should be the personal achievement hub — the place users return to see their history compound over time. The current design does not reflect this. Phase 2 should reframe the Me tab around stats and badges first, settings second.

3. **The hardcoded ratings in WALKS_DB are editorial judgements presented as community ratings.** This is defensible — they are curator assessments — but the UX currently presents them as if they were aggregate user ratings. Before community ratings go live, there needs to be a clear distinction between the initial curated rating and actual user review average. Options: label curated ratings as "Sniffout rating", suppress the rating and show "Not yet rated" until the minimum review threshold is met, or keep the curated rating but display it differently from user ratings. This is a minor UX issue now; it becomes a credibility issue post-Phase 3 if left unresolved.

4. **SEO is a completely absent growth channel.** The current single-file PWA is invisible to organic search. The research identifies this as the highest-leverage pre-backend content action. It does not require a developer — it requires someone with 2–3 hours to write 10 simple HTML pages. This should be a parallel workstream to Phase 2 development, not deferred.

**🔴 Decisions required**

1. **`sniffout_explored` schema upgrade** — must decide before any walk history features are built. Recommended: upgrade to timestamped array per walk ID immediately.

2. **Which milestone badges ship in Phase 2** — suggested set of 6 above. Owner to confirm the complete list and the threshold values before engineering begins.

3. **WALKS_DB curated ratings treatment** — decide now how curated ratings are labelled vs community ratings so the Phase 3 transition is clean. Recommended: label initial ratings "Sniffout rating" and display community star average separately once the review threshold is met.

4. **Static SEO pages** — decide whether this is Phase 2 scope (recommended: yes, parallel workstream) or deferred to Phase 3. Deferring costs 6–12 months of compounding search traffic.

5. **Me tab redesign scope** — is the stats/badges hub a Phase 2 feature or deferred? Recommended: Phase 2, but limited to the stats display and milestone badges. Full logbook is Phase 3.

---

## Phase 3 — Firebase Backend

### User accounts and authentication

Sign-in should have the lowest possible friction. Recommended provider order: Google Sign-In first, Apple Sign-In second (required for iOS App Store compliance if a native app ever ships), email/password as fallback. Do not build a username/password flow from scratch — Firebase Auth handles this.

On first sign-in, migrate the user's existing localStorage data (explored walks, favourites, reviews, username) into their Firebase profile. This is the payoff for the Phase 2 timestamped schema — users who've been using the app see their history preserved, not reset. This migration moment is also an onboarding hook: "We found 12 walks you've already explored — they've been added to your profile."

Anonymous mode (no sign-in) should remain available indefinitely. Do not gate walk discovery or viewing behind an account. Gate only: submitting a walk, writing a review (to prevent spam), and Missing Dog alerts.

### User-submitted walks — submission flow, moderation, quality control

**Submission flow minimum requirements**

A submission must include:
- Walk name (required)
- Location / nearest town (required)
- Lat/lon (required — use a map pin picker, not manual entry)
- Description (required, minimum 50 characters)
- One photo (required — this is the quality floor; photographic evidence that the walk exists)
- Difficulty and terrain (required — dropdown, no free text)

Optional at submission (can be added by curator before publish):
- GPS trace
- Off-lead status, livestock, stiles, parking (can be editorial additions)
- Duration and distance (can be estimated from lat/lon + description)

Minimum submission must conform to the existing `WALKS_DB` schema. Community walks are not second-class citizens — they get the same card design, the same detail view, the same filtering logic. The only visible distinction is the badge.

**Moderation approach**

Start with reviewed-before-publish. At early user base scale (<100 submissions/month), editorial review of every submission is tractable. The cost of a poor-quality walk appearing under the Sniffout brand outweighs the speed benefit of open publishing.

The moderation workflow:
1. User submits walk → stored in Firebase with `status: "pending"`
2. Owner reviews in a simple admin view (or directly in Firebase console at this scale)
3. Owner approves → `status: "published"`, walk appears in WALKS_DB equivalent
4. Owner rejects → automated email to submitter with brief reason

Graduate to trusted contributor auto-publish only after the submission volume exceeds what one person can manually review (likely 50+/month). Trusted contributor status: 2+ walks approved.

**AI-assisted walk submission — confirmed for Phase 3**

When the submission flow ships, the form will include an "Help me write this" option that uses the Claude API to assist users in drafting a walk description from basic inputs (walk name, location, key features). This lowers the barrier to submission for users who are confident in the walk but not in writing. The AI-generated draft is always editable and is subject to the same editorial review before publish — AI assistance does not bypass moderation. The final published description must read as though written by a knowledgeable walker, not a machine; editorial review is the quality gate.

**Quality control: the AllTrails trap to avoid**

The research documents the core AllTrails problem: unofficial routes masquerade as official trails with no clear labelling, creating genuine safety risk. Sniffout avoids this by:
- Requiring editorial approval before publish (no auto-publish for unknown contributors)
- Badging every community walk as "Community" (distinct from "Sniffout Pick" for curated)
- Including a prominent flag/report button on every community walk card
- Never allowing GPS-only submissions without a description — the description is the human quality signal

### Community ratings — minimum review thresholds, curated vs community walk badging

**Rating display logic**

| Review count | Display |
|---|---|
| 0 | "Be the first to review" CTA, no stars shown |
| 1–2 | Reviews visible, no aggregate star rating shown |
| 3–9 | Show star average with count: "4.2 · 5 reviews" |
| 10+ | Full Bayesian-weighted rating display |

**Bayesian weighting formula** (from research): `(v ÷ (v+m)) × R + (m ÷ (v+m)) × C`
Where v = review count, m = 5 (minimum threshold, tune to data), R = walk's actual average, C = platform average across all walks. This prevents a single 5-star review from appearing as a perfect rating and a single 1-star review from burying a good walk.

**Curated vs community badging**

| Walk type | Badge | Meaning |
|---|---|---|
| Sniffout curated | "Sniffout Pick" | Editorially verified, held to house standard |
| Community submitted | "Community" | User-submitted, editorially approved but not independently verified on the ground |

Do not use "Verified" for community walks unless Sniffout staff have physically walked them — that word carries a specific trust claim.

**Recency weighting**

Reviews older than 18 months should carry reduced weight in the aggregate. Trail conditions change: a 3-star review because it was muddy in January 2024 should not suppress a walk's rating in summer 2026. Implement recency decay at Phase 3.

### Missing Dog alerts

The design spec is already complete. The key Phase 3 engineering decisions:

**Data model**: Firestore is the right store for Missing Dog alerts — structured documents, real-time listeners for the map view, easy TTL for automatic expiry. Recommended document structure:
```
missing_dogs/{alertId}: {
  dogName, breed, colour, lastSeenLat, lastSeenLon,
  lastSeenLocation (text), reporterContact,
  timestamp, status: "active" | "found" | "expired",
  expiresAt (timestamp, 7 days from creation)
}
```

**Alert radius**: surface alerts within 10 miles of the user's current location. Show on a dedicated section in the Today tab and as a map layer in the Nearby tab.

**No account required for viewing alerts.** Account required for submitting an alert (to prevent abuse and allow contact).

### Push notifications

Firebase Cloud Messaging for delivery. Notification events in priority order:

1. **Missing dog alert near you** — highest urgency, highest permission grant rate, clearest value
2. **Weather condition change affecting a favourited walk** — "Heavy rain forecast tomorrow near [Walk Name] you've saved"
3. **New walk added in your area** — lower urgency, batch weekly at most
4. **Community challenge reminder** (Phase 4 scope)

Do not send notifications without explicit opt-in. Do not send more than one notification per day per user. The permission grant rate for outdoor/safety apps is high when the first notification asked for is clearly in the user's interest (missing dog is the clearest case).

---

### Phase 3 flags

**✅ Agree with researcher**
- Reviewed-before-publish for all community walk submissions. Quality moat is the primary differentiator.
- Community walks use the same `WALKS_DB` schema — no second-class data model.
- Clearly label curated vs community walks. "Sniffout Pick" vs "Community" badge achieves this.
- Bayesian-weighted ratings. The AllTrails problem (single reviews dominating) is well-documented and easy to avoid.
- Local Legend-style mechanic (most visits to a walk in 90 days) is compelling post-backend. File for Phase 3b.
- Missing Dog alert surface in Today tab and Nearby map.

**⚠️ Challenges current assumptions**

1. **Anonymous use must remain fully functional.** There may be pressure post-Phase 3 to push users toward sign-in. Resist this. The walk discovery value — which is the product's core purpose — must never require an account. The PlayDogs competitor requires sign-in for full access; Sniffout's no-login positioning is a genuine differentiator. Gate contribution features only, never discovery.

2. **The reputation score system (AllTrails model) is not needed at small scale.** At a user base of thousands (not millions), complex reputation scoring creates overhead without meaningful quality improvement. The editorial moderation model (human review) is more reliable at this scale than algorithmic trust scoring. Defer reputation score to Phase 4 or when submission volume exceeds ~200/month.

3. **GPS-verified completions are a Phase 3+ feature, not Phase 3 core.** Requiring GPS verification before a user can review adds friction that will suppress review volume at the exact moment you need community data to start accumulating. GPS verification as an optional enhancement (reviews show a "GPS verified" badge if the reviewer recorded the walk) is better than a hard requirement. Make it optional.

4. **Firebase Realtime Database vs Firestore decision.** Missing Dog alerts and real-time location features benefit from Realtime DB; structured walk and review data benefits from Firestore. A hybrid approach (Firestore for walks/reviews/users, Realtime DB for alerts) is workable but adds complexity. Recommended: Firestore-only for Phase 3, with real-time listener support for alerts. Revisit if real-time alerting latency is insufficient.

**🔴 Decisions required**

1. **Authentication providers** — Google + Apple + email/password, or just Google? Apple Sign-In is mandatory if a native iOS app ever ships. Recommended: implement all three in Phase 3 so they don't need to be retrofitted.

2. **Who is the moderation team?** If it is one person (the founder), the reviewed-before-publish model works but needs a defined SLA: how quickly will submissions be reviewed? A 48-hour turnaround is reasonable and should be communicated to submitters. If the team grows, define who has approval rights.

3. **Community walk badging nomenclature** — confirm "Community" as the label for user-submitted walks. Alternatives: "Member Walk", "User Submitted". Recommended: "Community" — consistent with the direction of the platform.

4. **Missing Dog alert authentication requirement** — account required to submit? Or phone number only (lower barrier, still accountable)? Recommended: account required, to enable follow-up contact and prevent abuse.

5. **GPS verification as requirement vs option** — recommended above: optional badge, not hard requirement. Owner to confirm.

6. **Notification event priority** — confirm the four events above, and define the suppression logic (max 1 per day per user).

---

## Phase 4+ — Growth and Content

### Editorial content flywheel

**The SEO architecture**

The AllTrails model demonstrates that trail pages are the primary SEO asset, not the blog. Sniffout's equivalent: a dedicated web page per walk, optimised for `[walk name] dog walk`, `dog walks near [location]`, `dog-friendly walks [region]`. These pages already have all the content in `WALKS_DB` — the engineering work is rendering them as standalone indexable HTML rather than JS-rendered content inside the PWA.

Build order:
1. **Regional list pages** (Phase 2, can start now): `/walks/london`, `/walks/peak-district`, etc. — 10–15 pages, static HTML
2. **Individual walk pages** (Phase 3–4): one page per walk in `WALKS_DB`, with schema.org structured data for rich results. These pages surface in Google when users search the walk name directly.
3. **Editorial blog** (Phase 4): seasonal guides, "best of" lists, gear recommendations. The blog is supplementary to the trail pages — it drives discovery and internal links, but the trail pages are the conversion surface.

**The Komoot Collections model for Sniffout**

Create thematic lists in the app itself (the `badge: "Sniffout Pick"` field is the start of this, but it needs curation). Publish each list as:
1. A shareable in-app collection (Phase 3)
2. A blog post with links to individual walk pages (Phase 4)
3. Social video cutting the top 3–5 walks from the list (ongoing)

Examples of high-value list themes:
- "10 best dog walks within 30 minutes of London by train" (targets Saturday Walkers Club audience)
- "Easy off-lead walks in the Peak District" (high search volume, low competition)
- "Autumn dog walks with no livestock" (seasonal re-use for 3+ years)
- "Dog-friendly walks near UK beaches" (summer seasonal)

These lists are reusable annually — the editorial cost is amortised over multiple seasonal cycles.

**Walk Highlands as the structural template**

Walk Highlands (Scotland-focused, no app, desktop-era) is the most direct UK analogue. Its model — editorial walk guides with a community review layer on top — is exactly what Sniffout is building, with two critical improvements: mobile-first design and live weather integration. Walk Highlands has built substantial organic traffic and community trust without an app. Sniffout's mobile-first PWA is a genuine step forward from this model.

Key Walk Highlands lessons:
- The community reports layer (user conditions updates per walk) is the primary engagement driver, not ratings
- Detailed editorial descriptions with practical information (car parking, terrain, livestock) have more retention value than glossy photography
- A modest, consistent posting cadence outperforms sporadic high-production content

### Social media strategy

**TikTok for reach, Instagram for conversion**

Post the same content to both. The output of a 2-hour walk is 3–4 pieces of social content: one "come walk with me" POV video (TikTok/Reels primary), one photo set for Instagram grid, one "is this walk worth it?" short (TikTok secondary). The dog is the protagonist in all of it.

**Priority content formats** (in order of estimated reach per effort):

1. **"Hidden gem near [city]"** — the exclusivity trigger. Dog in frame. 30–60 seconds. Drives saves aggressively. Reusable format across all 50+ walks in WALKS_DB.
2. **"Come walk with me at [walk name]"** — POV, trending audio, minimal editing. Parasocial "you were there" feeling. Consistent format enables audience building.
3. **Seasonal same-walk comparison** — same walk in spring vs autumn. High re-shareability, makes the seasonal re-engagement case visually.
4. **Weather + walk pairing** — "Is [walk] okay in the rain?" — connects the weather integration to the content, differentiates from generic walk content.

**Posting cadence**: 3x/week on TikTok, 3x/week on Instagram. Consistent niche (dog walks only) outperforms mixed lifestyle content because the algorithm can assign the account accurately. Do not mix in non-walk dog content (dog food reviews, training tips) — that dilutes the niche signal.

**The social-to-PWA install loop**

For a PWA, the conversion funnel is shorter than for a native app: social → sniffout.app → "Add to Home Screen". The friction point is that TikTok's link-in-bio supports one URL. That URL should go to a simple mobile-optimised landing page (distinct from the PWA itself) with a single CTA: "Find dog walks near you." The landing page converts the social visitor into a PWA user.

**Editorial voice**

The Outdoor Guide demonstrates that an editorial personality — a human face — creates trust and distinctiveness that an anonymous brand cannot replicate. At Phase 4+, decide whether Sniffout has an editorial voice and who it is. This is not required for Phase 2 or 3 but is the difference between a utility and a brand at growth scale.

### Partnerships and discovery

**Tourism boards** (highest leverage, lowest cost)

VisitScotland, VisitEngland, and regional tourism boards actively seek Komoot-style partnerships for digital walk collections. The pitch: Sniffout lists their walks in the app, they promote Sniffout in their digital channels. This is co-marketing, not a financial deal — both sides get distribution. Walk Highlands has benefited from VisitScotland association. Komoot has formal VisitBritain Collections. Sniffout can target regional tourism boards (VisitPeakDistrict, etc.) for a lower-competition entry point.

**Dog-specific brands** (brand alignment, secondary)

Dog food brands (Lily's Kitchen, Forthglade), dog insurance (Bought by Many / ManyPets), dog accessories (Ruffwear, Julius-K9). Sponsored walk collections ("Best muddy walks, in partnership with [wellies brand]") are the least intrusive monetisation format and the most aligned with the product experience. These are Phase 4 commercial conversations — do not pursue pre-launch.

**Veterinary and dog welfare organisations**

PDSA, Blue Cross, Dogs Trust. Content partnership potential: co-branded seasonal hazard content (winter paw care, summer heat, tick season), which directly maps to Sniffout's weather intelligence differentiator. These partnerships build trust and generate link equity for SEO.

**Discovery channels not to pursue pre-scale**

Podcast sponsorship, newsletter, long-form editorial content, paid social, app store search ads. The return on these channels is slow and the production cost high. Organic content + SEO + co-marketing with tourism boards is the Phase 4 priority stack.

---

### Phase 4+ flags

**✅ Agree with researcher**
- Walk Highlands is the closest structural UK analogue. Mobile-first + app + weather integration is a genuine improvement on that model.
- TikTok for reach, Instagram for conversion. Same content to both.
- Dog as protagonist in all content. Dog content outperforms generic walk content in engagement rate.
- Trail pages (individual walk pages) are the primary SEO asset, not the blog.
- Do not invest in podcast, newsletter, or long-form content pre-launch. Organic + SEO + social first.
- The PlayDogs UK gap is real and time-limited. The curated foundation is the moat, but it erodes if PlayDogs starts UK curation. Pace of content expansion matters.

**⚠️ Challenges current assumptions**

1. **The SEO opportunity exists right now, not in Phase 4.** Regional list pages (10 static HTML files) are a Phase 2 action that the current roadmap defers. Every month without them is organic traffic not building. This should be prioritised ahead of some Phase 3 features.

2. **The "no login" positioning is a marketing asset, not just a product decision.** The research confirms PlayDogs requires sign-in and is empty in the UK. Sniffout's combination of no-login + curated content + weather is the three-point differentiator. This should be explicit in all social content and landing page copy — without using the word "free" (per CLAUDE.md brand guidelines). Framing: "Find walks instantly. No account needed."

3. **Community content volume will be slow to start.** Even with Phase 3 walk submissions open, the rate of high-quality user-submitted walks will be low for the first 6–12 months. Editorial curation should continue to outpace community submissions during this period. Do not deprioritise editorial walk sourcing because the community submission feature exists — it won't replace curation until significant scale.

4. **The editorial voice question has a clock on it.** Establishing a distinctive editorial personality is much easier at small scale than at growth scale, where brand voice becomes a committee decision. Phase 4 should define this early.

**🔴 Decisions required**

1. **Individual walk SEO pages** — when? Phase 3 engineering work or Phase 4? The longer this is deferred, the longer the compounding delay. Recommended: Phase 3 engineering task, alongside backend build.

2. **Social content creator** — who? Founder? Agency? Dog owner partner? The format works with low production value, but it requires someone who can walk, film, and post consistently 3x/week. This is a resourcing decision, not a product decision.

3. **Editorial voice** — does Sniffout have a human face? If so, who? Decision needed before Phase 4 brand investment begins.

4. **Partnership prioritisation** — regional tourism boards vs dog brands vs welfare organisations. Recommended starting point: one regional tourism board partnership (e.g., VisitPeakDistrict or VisitLakeDistrict) as a proof-of-concept co-marketing deal. Low risk, aligns with product content, generates link equity.

5. **Monetisation model** — sponsored collections, freemium features, or purely free indefinitely? This is a Phase 4 commercial decision but the product architecture choices in Phase 3 (what is gated vs ungated) are influenced by it. Define the hypothesis now, even if the implementation is deferred.

---

## Summary Decision Register

| Phase | Decision | Urgency | Recommendation |
|---|---|---|---|
| 2 | Upgrade `sniffout_explored` to timestamped schema | Now — before walk history features ship | Do it |
| 2 | Milestone badge set and thresholds | Before Me tab engineering begins | Confirm 6-badge set above |
| 2 | WALKS_DB curated ratings labelling | Before Phase 3 community ratings | Label as "Sniffout rating", separate from user average |
| 2 | Static SEO regional pages | Now — parallel to v2 development | Start immediately, 10 pages |
| 2 | Me tab scope in Phase 2 | Before sprint planning | Stats + badges now, full logbook Phase 3 |
| 3 | Auth providers | Before Firebase setup | Google + Apple + email/password |
| 3 | Moderation team and SLA | Before submission feature ships | Define owner + 48h SLA |
| 3 | "Community" walk badge label | Before submission feature ships | Confirm "Community" |
| 3 | Missing Dog alert auth requirement | Before alert feature ships | Account required to submit |
| 3 | GPS verification model | Before review feature ships | Optional badge, not hard requirement |
| 3 | Firebase architecture (Firestore vs split) | Before Phase 3 engineering begins | Firestore-only |
| 3 | Push notification event set | Before FCM integration | Confirm 4 events above |
| 4+ | Walk SEO pages timing | Phase 3 vs Phase 4 | Phase 3 engineering task |
| 4+ | Social content creator | Before social strategy launch | Resourcing decision |
| 4+ | Editorial voice / human face | Early Phase 4 | Define before brand investment |
| 4+ | First partnership target | Phase 4 | Regional tourism board |
| 4+ | Monetisation hypothesis | Define in Phase 3, implement Phase 4 | Sponsored collections model |
