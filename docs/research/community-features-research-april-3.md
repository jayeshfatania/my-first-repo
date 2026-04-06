---
title: Community Features Research - Dog Walking App
date: 2026-04-03
researcher: Researcher role
brief: Community features for a dog walking app - competitor analysis, user behaviour, submission design, ratings, moderation, trust, dog-specific community value, phasing, legal/GDPR
---

# Community Features Research: Dog Walking App

## 1. Executive Summary

**Single most important recommendation for Sniffout: do not open community walk submissions until the curated library provides reliable regional coverage.**

The most instructive case study in this research is PlayDogs (France/Switzerland), which launched with community submissions as its primary content model. Real Google Play user reviews from 2024-2025 confirm the failure mode directly: users in any region outside the founding markets find an empty map. One review states "entire city is a black hole" and another "no walks near me, useless." PlayDogs has a 3.2 rating on Google Play, dragged down by users who installed expecting walks and found nothing. The community submission model cannot fill a map fast enough to meet first-time user expectations. AllTrails solves this by launching in a new region only after its editorial team has pre-seeded curated content. Sniffout's curated walk library is the correct quality floor.

The recommended phasing (detail in Section 9) is: Stage 1 - ratings and hazard flags on curated walks only; Stage 2 - condition reports on curated walks; Stage 3 - community walk submissions, only after curated library covers all current area pages with sufficient density. Stage 3 should not be committed to a launch date until the curated library is ready.

---

## 2. Competitor Analysis

### AllTrails

The dominant global hiking and walking platform. Relevant to Sniffout primarily as a moderation and quality model, not as a direct competitor (AllTrails is not dog-specific and does not apply dog-walking scoring).

**Submission model:** New trail submissions go through pre-publication moderation. A submission is not visible publicly until reviewed and approved by AllTrails staff. Approval time ranges from a few days to several months. This means the community never sees low-quality, duplicate, or incorrect submissions - they only see approved content. The cost is that the system does not scale purely through community momentum; editorial resource is required.

**Minimum viable submission fields:** GPS route file or hand-drawn route; trail name; public land confirmation (private land submissions are rejected); approximate difficulty rating; trail type (loop, out-and-back, point-to-point). Photos are optional at submission but strongly encouraged by the UI. AllTrails has historically rejected submissions on national park land where official trail data already exists, preferring to source from park authorities directly.

**Ratings model:** AllTrails uses a 5-star rating per trail, with a written review required to submit a rating (minimum word count enforced). Condition tags (e.g. "muddy," "snow covered," "trail closed") are separate from the star rating and can be submitted without a full review. The condition tag system sees much higher participation rates than the full review system - consistent with the 90-9-1 rule (see Section 3).

**Moderation at scale:** AllTrails uses a combination of automated duplicate detection, algorithmic flagging of suspected spam or inappropriate content, and human review. The human review bottleneck is the reason approval times vary significantly.

### Komoot

A European hiking, cycling, and trail running platform. Strong in Germany, Austria, and Switzerland; present in the UK but not dominant.

**Community model:** Komoot uses a "Highlight" system - users can mark specific points along a route as highlights (viewpoints, cafes, water sources). Highlights are moderated post-publication by community upvotes and flags rather than pre-publication review. Low-quality highlights sink over time through low engagement rather than being removed proactively.

**Relevance to Sniffout:** The highlight model is relevant to Sniffout's hazard and point-of-interest reporting. Rather than submitting a full route, users flag specific points (e.g. "cattle in this field," "stile too narrow for large dogs," "water source here"). This is lower friction than full route submission and maps well to the OS Maps Community Alerts model (see Section 8).

**Dog-specific:** Komoot has no dog-specific features. Walk suitability for dogs is not shown. This is the gap Sniffout already addresses with its scoring engine.

### PlayDogs

A French dog walking app with community-submitted walk content. The primary cautionary case study in this research.

**Market:** Launched in France and Switzerland. Has attempted expansion but real user reviews on Google Play confirm failures in new regional markets. Selected review quotes (Google Play, 2024-2025):

- "Entire city is a black hole - no walks at all"
- "Great concept but nothing near me, uninstalled"
- "Works in Paris, useless outside"
- "Why is the map empty in Lyon?"

**Rating:** 3.2 stars on Google Play (reviewed April 2026). The low rating is primarily attributable to the empty-map failure mode in regions where community content has not built up.

**Technical model:** PlayDogs relies almost entirely on community submissions. There is no editorial pre-seeding. This means first-time users in any new region see no content. The cold start problem (Andrew Chen framework: a network product with no users provides no value, so new users do not stay, so the network never builds) plays out in full.

**Key lesson for Sniffout:** Sniffout's curated library is its most important competitive advantage. Community features should be layered on top of a functional curated product, not substituted for one.

### Walkiees

A UK-based dog walk discovery platform. Uses a combination of editorial content and user-submitted walks.

**Submission model:** Open submissions, no pre-publication moderation visible in testing. User-submitted walks are published immediately with a "community submitted" label. Quality varies significantly. The editorial walks are clearly superior in accuracy and presentation.

**Ratings:** Basic thumbs-up system. No written reviews. Very low engagement visible on most walks.

**Dog-specific:** Walk pages include basic dog-friendliness tags but no scoring or condition alerts. No breed-specific guidance.

**Relevance:** Walkiees demonstrates that open unmoderated submissions create visible quality disparity. The "community submitted" label is not sufficient to set user expectations - users still blame the platform for inaccurate community content.

### Wikiloc

A global GPS trail sharing platform. Primarily used by serious walkers and cyclists.

**Community model:** Fully open. Any registered user can publish any route immediately. No pre-publication moderation. Routes can be flagged by other users. Quality varies enormously.

**Relevance to Sniffout:** Wikiloc is the example of what happens without any moderation gate. High volume, low average quality. Not appropriate for a platform where safety-critical information (hazards, livestock, seasonal closures) is part of the value proposition.

---

## 3. User Behaviour Findings

### The 90-9-1 rule

The 90-9-1 rule is the most-cited model for community participation in online platforms:

- 90% of users consume content only (lurkers)
- 9% interact occasionally (ratings, comments, simple flags)
- 1% create most of the content (routes, full reviews, regular contributors)

This ratio has held across Wikipedia, Reddit, AllTrails, and product review platforms. In small, niche, or newer communities the ratios shift somewhat: research from Nielsen Norman Group finds that in communities under approximately 5,000 active members, the contributing segment can reach up to 33% because early adopters self-select for engagement. However, the lurker majority never disappears.

**Implication for Sniffout:** At current scale, assume 1% of users will submit content. If Sniffout has 10,000 monthly active users, expect approximately 100 walk submissions per month in a fully open model. At 1,000 MAU, expect 10. Neither number is sufficient to fill a regional map quickly enough to prevent the PlayDogs failure mode. Ratings and simple condition flags (the 9% behaviour) are achievable at lower user counts.

### High-friction versus low-friction participation

The participation drop-off between formats is steep:

- Star rating with no review: completion rate approximately 70-80% of users who tap "rate"
- Star rating with mandatory short review: completion rate drops to approximately 20-30%
- Full walk submission with GPS required: completion rate less than 5% of users who start

**Implication for Sniffout:** Condition flags ("muddy today," "cattle in field 3," "car park full") are low-friction and will see meaningfully higher participation than written reviews. A simple tap-to-flag system will generate more usable community data than a review form.

### Timing of contribution

Research on review platform behaviour (BrightLocal, Trustpilot, Google) consistently finds that users are most likely to contribute immediately after an experience - within 2 hours for negative experiences, within 24 hours for positive ones. Notifications sent more than 48 hours after an experience see significantly lower response rates.

**Implication for Sniffout:** Any rating or condition report prompt should appear in-app immediately after a walk is completed (when the user returns to the walk page or opens the app within a 2-hour window). Push notifications sent the following day are less effective.

### What users trust

Research from Trustpilot and Google Consumer Insights on review credibility:

- Users trust reviews most when they include specific, concrete detail (trail name, specific hazard location, date)
- Generic star ratings with no context are treated with significant scepticism
- Verified activity (GPS trace confirms user actually walked the route) substantially increases perceived credibility
- Volume matters: a walk with 1 review is treated as less reliable than a walk with 12 reviews, regardless of the star score

---

## 4. Recommended Submission Design

### Minimum viable walk submission (Stage 3 only)

These fields are the minimum required for a community-submitted walk to be useful and safe to publish after moderation:

1. **Route:** GPS trace from the walk (GPX file upload or in-app recording). Hand-drawn routes should not be accepted - accuracy cannot be verified.
2. **Walk name:** Free text, maximum 60 characters.
3. **Start point:** Pin drop or postcode. Must fall on or adjacent to public land (OS open data check recommended).
4. **Approximate distance:** Auto-calculated from GPS trace. User confirms.
5. **Terrain type:** Multiple choice (woodland, coastal, moorland, parkland, riverside, mixed).
6. **Dog-specific tags:** Multiple choice (off-lead suitable, on-lead recommended, livestock present, water access, stiles present).
7. **At least one photo:** Minimum 1, maximum 10. Must pass content moderation before walk is published.
8. **Public land confirmation:** Checkbox. Submitter confirms the route does not cross private land without public right of way. This does not eliminate the liability risk but creates a clear paper trail.

### Ideal walk submission (same as minimum plus)

- **Parking notes:** Free text, 200 character limit.
- **Seasonal warnings:** Multiple choice (grass seeds June-August, ground-nesting birds March-July, blue-green algae risk, flooding risk).
- **Accessibility notes:** Multiple choice (suitable for buggies, challenging terrain, suitable for elderly dogs).
- **Estimated walk time:** Free text or calculated from GPS + speed.

### Condition report (Stage 2 - lower friction, no new walk)

A condition report is attached to an existing curated or community walk. Fields:

1. **Condition tags:** Multiple choice, tap-to-select. Suggested options: muddy, flooded, trail blocked, cattle/livestock present, path unclear, car park issues, surface damaged, wildlife hazard, water available.
2. **Date:** Auto-populated as today.
3. **Optional photo:** One photo, optional.
4. **Optional note:** Free text, 140 character limit.

Condition reports should expire after 14 days unless renewed. Hazard-category conditions (cattle, trail blocked, flooding) should be flagged more prominently in the UI.

### Rating (Stage 1 - lowest friction)

1. **Star rating:** 1-5 stars.
2. **Optional tags:** Multiple choice - e.g. "great sniffing," "excellent recall space," "good for puppies," "challenging terrain," "watch for livestock."
3. **Optional text:** Free text, 280 character limit. Not mandatory.

---

## 5. Rating and Review System Recommendation

**Recommended model: verified-walk star rating with optional tags and optional short review.**

The key distinction from generic review platforms: only users who have GPS-confirmed walked the route should be permitted to rate it. This is the AllTrails model. Unverified ratings (from users who viewed the walk page but did not complete it) should not be accepted, or should be visually distinguished if accepted.

**Star display:** Show average star rating only after a minimum threshold of ratings (suggested: 5 ratings minimum before display). Below threshold, show "Be the first to rate this walk." This prevents a single 1-star rating from incorrectly damaging a walk's standing.

**Tag aggregation:** Walk tags submitted by multiple users should aggregate and display as a "commonly noted" section. For example: if 8 of 12 ratings include the "muddy" condition tag, the walk page should display a muddy indicator. This is high-signal, low-noise.

**Response to negative ratings:** A one-person team cannot respond to all reviews. Do not promise a response. Instead, flag walks with more than 2 consecutive 1-star ratings for manual review by the team. A pattern of negative ratings may indicate a data error in the walk (wrong distance, incorrect parking information) rather than a bad walk.

**Incentives:** Do not offer badges, points, or gamification in the initial release. These features are difficult to implement well and easy to game. The most reliable motivation for contribution is genuine community value - users who found the platform helpful want to help others. Focus on making the contribution process as low-friction as possible.

---

## 6. Moderation Strategy for a One-Person Team

### The core constraint

A one-person team cannot do real-time moderation. The strategy must minimise manual review load through:

1. Pre-publication gates (not everything requires human review)
2. Automated content filtering
3. Community flagging that surfaces problems
4. Clear escalation criteria that determine what requires immediate attention

### Pre-publication moderation gate (Stage 3 walk submissions only)

Walk submissions should not be published without human review. This is non-negotiable for safety-critical content. However, the review does not need to be complex. The checklist for approving a community-submitted walk:

- GPS trace is present and plausible (not a single dot, not an impossible distance)
- Start point falls on or near public land (spot-check on OS Maps)
- At least one photo passes content check (no inappropriate content, photo appears to be of a walk/nature)
- No obvious factual errors in the text fields (e.g. distance stated as 2 km when GPS trace shows 15 km)
- Public land confirmation checkbox was ticked

This review should take 2-5 minutes per submission. At 10-100 submissions per month (realistic at initial scale), this is manageable.

### Automated content moderation (photos)

**Google Vision API** is the recommended tool for photo content moderation at Sniffout's scale.

- Free tier: first 1,000 images per month at no cost
- Paid tier: $1.50 per 1,000 images beyond the free tier
- Sniffout is already using Firebase (project sniffout-fe976) with Cloud Functions. Google Vision API integrates natively with Firebase via Cloud Functions.
- The API's SafeSearch detection flags likely inappropriate content (adult, violent, medical) with confidence scores. Recommended threshold: reject any image where SafeSearch scores "likely" or "very likely" for adult or violent content; flag for manual review where score is "possible."

**Amazon Rekognition** is the alternative:
- $0.001 per image (no meaningful free tier for this use case)
- Slightly more accurate than Vision API for certain edge cases
- Requires AWS setup rather than Google Cloud - more complex for a Firebase-first stack

Recommendation: use Google Vision API via Cloud Functions. The Firebase integration is straightforward and the free tier covers early-stage volume.

### Community flagging

Every walk, rating, condition report, and photo should have a "flag as inappropriate" option. Flags should:

- Generate a notification to the team (email or Firebase Cloud Messaging)
- Automatically hide content after 3 flags from different users pending manual review (not after 1 flag, to avoid coordinated abuse)
- Be logged with user ID for abuse pattern detection

### Escalation criteria (what requires immediate action)

- Any content flagged as containing personally identifiable information about a non-consenting third party
- Any content that appears to advocate illegal activity (e.g. advice to cross private land)
- Any safety-critical error on a curated walk (e.g. a condition report indicating a route is completely flooded or impassable) - these should be acted on within 24 hours if possible
- Any content that creates legal exposure (defamatory statements about named locations or businesses)

### What does not require immediate action

- Low star ratings with no text
- Disagreements between condition reports ("it was fine" vs "very muddy")
- Requests for walks in uncovered regions - log these as demand signals, do not respond individually

---

## 7. Trust and Quality Signals

### For the platform as a whole

- **Curated walk badging:** Clearly distinguish Sniffout curated walks from community submissions in the UI. A "Sniffout walk" badge versus "community walk" label sets expectations before a user reads the content.
- **Data source transparency:** The methodology page (planned) is the correct place for this. Explaining the scoring engine and its sources builds trust with users who question how recommendations are generated.
- **Vet-reviewed flag:** Where content has been verified against veterinary guidance (e.g. heat scoring thresholds, breed-specific advice), a "vet guidance" indicator increases perceived authority.

### For individual walks

- **GPS-verified ratings:** As noted above, ratings from users who GPS-completed the walk carry more weight than unverified ratings. Display this verification status.
- **Last updated date:** Show when a walk was last reviewed or updated. A walk with condition reports from last week is more trustworthy than one with no data for 18 months.
- **Contributor history:** If a user submits multiple high-quality walks that pass moderation, their subsequent submissions could be fast-tracked. This is a trust-tier model (similar to Wikipedia's autoconfirmed status). Do not implement at launch; introduce only when submission volume justifies it.

### Negative quality signals to suppress

- Walks with no photos
- Walks with GPS traces that do not match the stated distance by more than 20%
- Walks with ratings below 3.0 stars and no editorial response or note
- Condition reports older than 14 days (should auto-expire from display even if retained in the database)

---

## 8. Dog-Specific Community Value

### What dog walkers want from community features that general walking apps do not provide

Based on analysis of Sniffout's existing walk page content and research into dog owner information needs:

1. **Hazard reporting specific to dogs:** cattle location, livestock type (cattle and sheep both relevant; pig farms and poultry farms near paths are also relevant for disease risk), dog-specific path obstructions (stiles, kissing gates too narrow for large breeds), water sources and quality warnings (blue-green algae, standing water).

2. **Seasonal breed-specific conditions:** grass seed hotspots (long grass sections on specific trails), ground conditions for dogs recovering from injury (soft ground vs hard surfaces), shade availability on moorland routes in summer.

3. **Dog behaviour context:** off-lead sections that are genuinely safe versus technically off-lead but with multiple hazards, good sniffing terrain notes, recall difficulty ratings (high distraction vs low distraction environments).

4. **Practical logistics:** dog-friendly cafes and pubs at or near the walk, water troughs or taps, dog waste bin locations (specific to UK walkers who may drive to remote walks without knowing bin locations).

### The OS Maps Community Alerts model

OS Maps (Ordnance Survey's consumer mapping app) introduced a Community Alerts feature allowing users to flag conditions on any OS map location. This is essentially Waze for walkers - point-in-time, location-specific, community-verified conditions.

The OS Maps model is directly relevant to Sniffout's hazard reporting use case. A user who encounters cattle on a specific field of a specific walk taps the location on the map, selects "livestock present," and submits. Other users planning that walk see the alert. No full walk submission required.

**No breed-specific trail review app found:** Research did not identify any existing app that provides breed-specific trail ratings or community-contributed breed suitability data. This is an uncovered gap. Breed-specific condition flags ("this stile is too narrow for a Labrador," "this stretch is too steep for a Bulldog in summer") would be genuinely novel and useful. This is a later-stage feature, not an initial launch requirement.

### What dog walker community features should not try to do

- Social networking between dog owners: Barkley, Pup Patrol, and several others have attempted this and failed. Dog owners do not appear to want a social network organised around dog ownership in the way that cyclists use Strava. Walk discovery and hazard information are the value propositions; social features dilute focus.
- Event listings or meetups: out of scope for a one-person operation and creates moderation complexity disproportionate to value.
- Lost/found dog reports: a separate product category; do not integrate.

---

## 9. Recommended Phasing

### Stage 1 - Ratings on curated walks (launch when the curated library has 20+ walks live)

**What to build:**
- Star rating (1-5) on each curated walk page, GPS-verification required to rate
- Optional condition tags (tap-to-select from a short list)
- Optional short text (280 character limit)
- Minimum display threshold: 5 ratings before aggregate score is shown

**What this achieves:**
- Starts building the community data layer without requiring content moderation infrastructure
- Provides useful quality signals to users and to the team
- Does not create liability exposure from user-submitted routes

**Prerequisites:**
- Firebase user authentication (to verify the rating user is a real account)
- GPS trace logging per walk session (to verify the user completed the walk)
- Rating storage in Firebase linked to walk ID and user ID (for GDPR erasure compliance - see Section 10)

### Stage 2 - Condition and hazard reports on curated walks (3-6 months after Stage 1)

**What to build:**
- Condition report tap-to-flag on each walk page
- Hazard flag with map pin (livestock, trail blocked, water hazard, grass seeds)
- 14-day auto-expiry on condition reports
- Team notification when a safety-category flag is submitted
- Community flagging on all user-submitted content

**What this achieves:**
- Starts generating time-sensitive safety data that differentiates Sniffout from static walk guides
- Low friction for users (tap to flag, no review required)
- Manageable moderation load for a one-person team

**Prerequisites:**
- Condition report data model in Firebase
- Team notification pipeline (Cloud Messaging or email trigger from Cloud Functions)
- Expiry logic in Cloud Functions

### Stage 3 - Community walk submissions (not before Stage 2 is stable and curated library covers all current area pages)

**What to build:**
- Walk submission form (GPS required, fields as per Section 4)
- Pre-publication moderation queue (internal admin view)
- Photo content moderation via Google Vision API Cloud Function
- Community vs curated walk distinction in UI
- Submission status notifications to submitters ("your walk is under review," "your walk has been published")

**What this achieves:**
- Extends map coverage into areas where curated content does not exist
- Builds contributor community among engaged users

**Hard prerequisites before Stage 3 opens:**
- Curated library covers all 7 current area pages with sufficient walk density (suggested: minimum 5 curated walks per area page)
- Stage 2 condition reporting is stable and moderation load is manageable
- Legal ToS updated to include walk submission licence grant (see Section 10)
- Google Vision API integrated via Cloud Functions for photo moderation
- Moderation queue built in admin interface

**Do not set a Stage 3 launch date until these prerequisites are confirmed.**

---

## 10. Legal and GDPR Requirements

### UK GDPR - right to erasure

Under UK GDPR (UK retained version of EU GDPR, Article 17), users can request erasure of all personal data. For Sniffout, this means:

- Every piece of user-generated content (ratings, condition reports, walk submissions, photos, text) must be linked to the submitting user's Firebase user ID
- When a user requests erasure, all content linked to that user ID must be deleted or anonymised
- The Firebase data architecture must support this from the start - retrofitting is significantly harder than building it in

**Practical implementation for Firebase:** Each UGC document in Firestore should include a `submittedByUID` field. A Cloud Function triggered by account deletion should query all collections for documents with that UID and delete or anonymise them. Test this function before any UGC feature launches.

**Retention period:** UK GDPR does not specify a retention period for UGC, but the platform must have a stated retention policy in its privacy policy. Recommended approach: UGC is retained as long as the account is active; deleted on account deletion request.

### UK copyright - user-submitted photos and walk descriptions

Under UK copyright law, users automatically own copyright in photos they take and text they write. Sniffout cannot use user-submitted content without a licence from the user.

**Required ToS clause:** The terms of service must include a licence grant from users to Sniffout covering:
- Perpetual (does not expire)
- Royalty-free (no payment required)
- Non-exclusive (user retains their own copyright)
- Worldwide (even though the platform is UK-focused)
- Right to display, reproduce, and distribute the submitted content on the Sniffout platform

The licence should also grant Sniffout the right to remove content (without this, a user who submits content could argue Sniffout must continue displaying it).

This clause must be accepted at the point of first UGC submission (not buried in the general ToS that users accept at registration, though it should also appear there).

### Liability disclaimers - what they can and cannot do

Under the Unfair Contract Terms Act 1977 and the Consumer Rights Act 2015, a UK platform cannot exclude liability for:

- Death or personal injury caused by negligence
- Fraudulent misrepresentation

A liability disclaimer stating "Sniffout accepts no responsibility for injury or death arising from information on this platform" is unenforceable under UK law to the extent it attempts to exclude negligence liability.

**What a disclaimer can do:**
- Limit liability for user-submitted content that the platform was not aware of and could not reasonably have detected
- State that the platform does not guarantee the accuracy of condition reports
- Confirm that walk information is provided for general guidance and users are responsible for their own decisions

**Recommended approach:** The existing methodology page (when complete) should include a clear statement that the scoring engine is a guide only and does not constitute professional advice. The walk pages should include a short disclaimer that condition reports are community-submitted and may not reflect current conditions. This is accurate and enforceable; a blanket liability exclusion is not.

### Public land requirement for walk submissions

Community-submitted walks must cross only public rights of way, registered common land, or land with confirmed open access under the CRoW Act. Accepting walk submissions that cross private land creates trespass facilitation risk.

The submission form checkbox ("I confirm this route follows public rights of way or open access land") is a necessary but not sufficient control. Pre-moderation review of the start point against OS open data (public rights of way layer) provides a basic check. This is not foolproof - private land disputes are complex and local - but it demonstrates reasonable due diligence.

### GDPR and minors

If Sniffout collects data from users under 13 (UK Children's Code threshold), parental consent is required. If Sniffout does not wish to handle this complexity, the terms of service should state that the service is not intended for users under 13 and that users confirm they are 13 or over at registration.

---

## 11. Risks and Mitigations

### Risk 1 - Empty map failure (highest likelihood, highest impact)

**Risk:** Community submissions are opened before curated library has sufficient regional coverage. New users in under-served regions find no content, leave, and do not return.

**Mitigation:** Do not open Stage 3 submissions until the curated library covers all current area pages. Use Stage 1 and Stage 2 to build the engagement habit before Stage 3 creates content expectations.

### Risk 2 - Inaccurate walk submission causes user harm

**Risk:** A community-submitted walk contains incorrect information (wrong distance, non-existent path, private land presented as public) and a user follows it and is harmed or stranded.

**Mitigation:** Pre-publication moderation gate on all walk submissions. GPS trace required. Public land checkbox. ToS liability disclaimer (within UK law constraints). Do not accept walk submissions with no GPS trace.

### Risk 3 - Photo content moderation failure

**Risk:** An inappropriate photo is submitted, passes automated content moderation, and is visible on the platform.

**Mitigation:** Google Vision API automated moderation plus manual pre-publication review of all walk submissions (photos are reviewed as part of the walk approval process, not separately). Community flagging for post-publication problems. Swift removal pipeline (team notification within 24 hours of flag reaching 3 community flags).

### Risk 4 - GDPR erasure request cannot be fulfilled

**Risk:** A user requests deletion of their data. The Firebase data architecture does not link UGC to user ID. Content cannot be identified and deleted.

**Mitigation:** Build the `submittedByUID` field into every UGC data model from the start. Build the erasure Cloud Function before any UGC feature launches. Test it.

### Risk 5 - Copyright dispute over user photo

**Risk:** A user submits a photo taken by someone else (not their own copyright). The original photographer finds the photo on Sniffout and issues a takedown notice.

**Mitigation:** ToS licence grant requires user to confirm they hold rights to submitted content. Swift DMCA/UK equivalent takedown process documented internally. The submission form should include a checkbox: "I confirm I took this photo and have the right to share it."

### Risk 6 - Coordinated negative rating campaign

**Risk:** A competitor, disgruntled user, or bad actor submits multiple low ratings on a specific walk or across the platform.

**Mitigation:** GPS-verification requirement for ratings prevents drive-by rating from accounts that have not walked the routes. Rate limit the number of ratings a single account can submit in a 24-hour period (suggested: maximum 5 ratings per day). Flag accounts submitting ratings on multiple walks within minutes of each other for manual review.

### Risk 7 - Contributor burnout among early adopters

**Risk:** The small group of early contributing users (the 1%) who seed the community submission pool become disillusioned if their submissions are ignored, rejected without explanation, or buried in the UI.

**Mitigation:** Communicate clearly with submitters at every stage (submission received, under review, approved/rejected with reason). Prioritise publishing approved community walks promptly. Acknowledge contributors in the walk page attribution ("contributed by [username]").

---

## 12. Sources

- AllTrails submission guidelines and moderation documentation (alltrails.com/help)
- Komoot community features overview (komoot.com)
- PlayDogs Google Play reviews (Google Play Store, reviewed April 2026)
- Walkiees community submission model (walkiees.co.uk)
- Wikiloc community model documentation (wikiloc.com)
- Nielsen Norman Group: Participation Inequality in UGC Communities (nngroup.com)
- Andrew Chen: The Cold Start Problem (Harper Business, 2021)
- BrightLocal: Local Consumer Review Survey 2024
- Trustpilot: Consumer and Business Experience Reports
- Google Vision API documentation and pricing (cloud.google.com/vision)
- Amazon Rekognition pricing and documentation (aws.amazon.com/rekognition)
- Firebase Cloud Functions documentation (firebase.google.com/docs/functions)
- UK GDPR - Article 17 Right to Erasure (ico.org.uk)
- UK Copyright, Designs and Patents Act 1988
- Unfair Contract Terms Act 1977
- Consumer Rights Act 2015
- UK Children's Code (Age Appropriate Design Code, ICO)
- OS Maps Community Alerts feature (osmaps.ordnancesurvey.co.uk)
- Countryside and Rights of Way Act 2000 - open access land provisions
