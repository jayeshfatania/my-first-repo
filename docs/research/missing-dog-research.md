# Sniffout — Missing Dog Alert: Feature Viability Study
*Researcher role. March 2026. Phase 2 planning input.*

---

## Executive Summary

**The demand is real. The gap is real. The timing is wrong for now.**

Around 250,000 pets go missing in the UK each year. ~5 dogs are stolen every day. The current ecosystem for finding missing dogs is fragmented, slow, and not mobile-native. No walk-discovery app sends real-time alerts to the people best positioned to help — dog owners who are *already outside walking their dogs* near the last known location.

That is a genuine product gap. The feature would meaningfully differentiate Sniffout, and "found via Sniffout" carries exceptional word-of-mouth potential.

However: the feature requires backend infrastructure (incompatible with the current static PWA), meaningful user density per region before alerts are useful, significant safeguarding design, and active moderation capacity. None of these conditions are met at the current POC stage.

**Recommendation: Design the feature now. Build it once Sniffout has backend infrastructure and sufficient active UK users per region to make a 2-mile alert radius meaningful. Do not build for the POC.**

---

## Part 1 — Demand Evidence

### Scale of the problem

- **~250,000 pets go missing in the UK annually**
- **Nearly 5,000 dogs reported missing** in the 18 months from January 2023 to June 2024 (Petlog data alone — only microchipped, registered dogs)
- **74% of missing dogs are reunited** with owners, but that still leaves ~1,300 permanently lost in Petlog's data per 18 months
- **Over 21,000 dogs were reported as strays in 2023**, with ~10% euthanised due to owners not coming forward
- **1,808 dogs reported stolen in 2024** — approximately 5 per day — a 21% fall from 2023's peak, but still nearly 10,000 dogs stolen since 2019
- **Only 19% of stolen dogs are recovered** — far lower than genuinely lost dogs
- **61% of UK dog owners** say they remain worried about their dog being stolen (2025)
- The **Pet Abduction Act 2024** (England and Northern Ireland, in force August 2024) criminalised pet theft specifically for the first time, with up to 5 years' imprisonment — confirming the political and emotional salience of the issue

Dog theft and dog loss are emotionally charged, high-stakes topics in UK dog owner communities. This is not a niche problem.

### How UK dog owners currently handle a missing dog

Current methods are fragmented and manual:
- **Neighbourhood searching on foot** — most common, labour-intensive
- **Contacting dog wardens, vets, rescue centres** — second most common
- **Posting physical signs/posters** — ~15% of recoveries
- **Social media posts** across multiple platforms simultaneously — increasingly common, now a primary awareness channel
- **Microchip/ID tag** — effective once a dog is handed in, but passive and dependent on finder taking action

The critical pain point: there is no single, real-time, location-aware system targeted at people who are *actively outside with dogs* near where the animal was lost. The owner must manually distribute information across DogLost, local Facebook groups, Nextdoor, and WhatsApp groups while in a state of panic. Every minute of delay reduces recovery probability.

### Do missing dog posts generate engagement?

Evidence is strong that this category generates disproportionate community response:
- A DogLost case study shows a missing dog appeal "shared hundreds of times by the following morning" through their Facebook network
- Reddit missing dog threads routinely attract tens of thousands of views; strangers have driven to search for dogs lost in the countryside
- The **Missing Pets, Dundee and Angus** Facebook page (founded 2013) has reunited thousands of pets through voluntary community effort
- Facebook groups dedicated to exposing hoax missing pet posts have over **9,000 members** — which confirms both the volume of genuine posts and the scale of the false report problem (covered in Part 4)

---

## Part 2 — Existing UK Services and Their Gaps

### DogLost (doglost.co.uk) — The Incumbent

**Scale:** 163,000 registered members, 100+ regional area co-ordinators, ~40 regional Facebook groups, established relationships with dog wardens, police, and vets.

**How it works:** Owner reports online; DogLost creates a listing and printable poster; email alerts go to nearby members; regional volunteer co-ordinators provide hands-on support.

**What works:** Strong volunteer network, trusted brand over two decades, completely free, working relationships with official bodies.

**Gaps:**
- No real-time push notifications — alerts are email, which is passive and easy to miss
- No mobile app — operates via desktop website and Facebook groups
- No map-based interface for reporting sightings
- The user journey at the panic moment requires navigating a website and filling forms
- Some Trustpilot reviews raise concerns about unexpected payment requests (possibly from impersonator services rather than DogLost itself — worth noting as a trust issue in the category)

### Animal Search UK

86,000+ volunteer "Pet Patrol" members. Auto-match system cross-references records daily. Similar to DogLost in capability — no push notifications, no map-based community alerts, no walker-specific targeting.

### Petlog / My Dog UK App

The Kennel Club's official microchip database with an app integration. Premium subscribers can trigger a "Lost Pet Alert" that pushes to vets and authorities within a **30-mile radius**.

**Gaps:** Alerts reach vets and officials, not the dog-walking public. 30 miles is too broad to be actionable — it is radius for institutions, not for individual searchers.

### PetRadar — The Most Modern Approach

Creates sponsored Facebook and Instagram posts that appear in the feeds of people within a geographic radius of the last known location. QR codes protect owner privacy. Claims 12,000+ reunited pets.

**Gaps:** Relies on Facebook/Instagram ad infrastructure. Reaches passive social media scrollers at home — not people who are currently outside and capable of acting. No community of active walkers.

### Nextdoor

Has a lost and found pets feature; in the US partners with PawBoost for 2-mile radius alerts. 49% of Nextdoor users cite crime and safety as a key engagement driver.

**Gaps:** General community platform, not dog-walk-specific. No weather integration, no dog-specific filtering. Alerting a random local neighbourhood is less targeted than alerting active dog walkers in the area.

### Summary: The Gap

| Service | Push notification | Mobile-native | Targets active walkers | Free | Location-aware |
|---------|------------------|---------------|----------------------|------|----------------|
| DogLost | No (email) | No | No | Yes | Partial |
| Animal Search UK | No | No | No | Yes | No |
| Petlog Premium | Yes (to vets/authorities) | Yes | No | Paid | 30-mile radius |
| PetRadar | No (social ads) | No | No | Paid | Via FB ads |
| Nextdoor | Yes | Yes | No | Free | Neighbourhood |
| **Sniffout potential** | **Yes (PWA push)** | **Yes** | **Yes** | **Free** | **GPS-precise** |

**The specific gap no one fills:** real-time push notifications to people who are *currently outside walking their dogs* near the last known location. That is Sniffout's unique position if this feature is built.

---

## Part 3 — Practical Feature Design

### What information a useful alert needs

**Required (no alert without these):**
- Photo (essential — breed descriptions are unreliable; this is the first thing searchers need)
- Breed, size, and colour
- Last seen location (GPS pin, not home address — see safeguarding)
- Time last seen
- Contact method (in-app message — not phone number or address publicly displayed)

**Optional but valuable:**
- Dog's name
- Microchip number (for vets and wardens)
- Distinguishing features (scars, unusual markings, collar colour)
- Temperament note ("nervous, likely to hide" vs. "friendly, will approach strangers")
- Whether the dog is likely to respond to food/treats

### Notification radius

Research from multiple lost dog recovery studies and existing alert services:
- Most lost dogs are found within **1.5 miles** of their last known location
- FidoTabby Alert and AKC Reunite use a **5-mile** standard radius
- PawBoost/Nextdoor integration triggers at **2 miles**
- Petlog's 30-mile radius is for institutions, not individuals

**Recommendation for Sniffout:** Push notifications to active users within a **2–5 mile radius** of the *last seen location* (configurable by the reporting owner). The user's *current GPS location* is compared against active alert zones each time the app is opened or when a new alert is posted nearby.

### User flow — reporting owner

1. Prominent "Report missing dog" entry point (Today tab, persistent banner, or emergency-style button)
2. Guided form: photo upload → breed/colour → last seen location (GPS-assisted or postcode) → contact method
3. Alert goes live; nearby users notified immediately
4. Owner receives a notification each time a sighting is reported
5. Owner can mark the dog as found, which triggers a resolution notification to all searchers

### User flow — nearby user receiving an alert

1. Push notification (if installed) or in-app banner: "Missing dog near you — [Breed], [Colour], last seen [X] near [Area]"
2. Tap opens alert card: photo, description, map pin showing last known location
3. "I've spotted this dog" → user can drop a sighting pin with a note → owner is notified instantly
4. "Alert a friend" → share function to extend reach beyond Sniffout users
5. When resolved: "Great news — [Dog name] has been found. Thank you for looking."

### Alert lifecycle

- Active for up to **7 days** unless resolved earlier
- Owner receives a reminder after 3 days to confirm the alert is still active
- After 7 days, the alert automatically archives (owner can re-post if needed)
- Resolved alerts move to a "Found" archive — visible for 30 days as a positive outcome, then deleted

### PWA push notification technical feasibility

Push notifications are technically achievable in a PWA via the Web Push API using VAPID keys, a service worker, and a push server (e.g. Firebase Cloud Messaging).

**Critical constraint — iOS:**
- PWA push notifications on iOS **only work for installed Home Screen apps** — users must have added Sniffout to their home screen
- Push permissions cannot be requested from the browser tab in Safari
- Users who haven't installed the PWA will not receive push notifications on iOS

**Practical implication:** This feature works well on Android immediately. On iOS, Sniffout would need to prompt users to install to the home screen with an explicit explanation of why (e.g. "Install Sniffout to receive missing dog alerts near you"). This is manageable but is a real friction point.

**Fallback:** In-app banners shown on next app open reach users without push permissions. This degrades gracefully but is not real-time.

**Backend requirement:** A push notification system requires a backend to store push subscriptions and trigger notifications when an alert is posted. This is not possible with the current static GitHub Pages architecture. Firebase or a lightweight serverless function (e.g. Vercel) would be needed. **This is the primary technical blocker for the current POC.**

---

## Part 4 — Safeguarding, Moderation and Legal Considerations

This section contains the most important constraints. None are insurmountable, but all require deliberate design.

### The false report problem

This is the **single largest operational risk**. Full Fact documented over **1,200 hoax missing pet/person posts** across **115 UK community Facebook groups**, describing it as "the tip of the iceberg." The established attack pattern:

1. Post an emotionally charged missing pet appeal with a real-looking photo
2. Accumulate shares and engagement from well-meaning users
3. Edit the post to redirect traffic to affiliate links, cashback sites, or phishing pages

**Sniffout-specific risks:**
- Engagement bait: fake missing dog alerts drive push notifications and app opens
- Theft reconnaissance: a bad actor posts a fake missing dog in an area to gather sighting reports, mapping where valuable dogs are walked and when
- Owner harassment: false alert about someone's real dog triggers unwanted contact
- Trust erosion: if users receive false alerts, they begin ignoring future notifications — destroying the feature's utility

**Safeguards required:**
- **Phone number verification to post an alert** — the most effective deterrent against mass fake reports; requires a backend
- **One active alert per verified phone number** at any time
- **"Flag this alert as suspicious"** button — routes to a manual review queue
- Alerts visible to reporters that contain a disclaimer: "Alerts are community-submitted and not verified by Sniffout"
- A clear and fast abuse response process (email or in-app form)

### Privacy and GDPR

The UK Information Commissioner's Office has confirmed that a dog's *name* can constitute personal data if it can be linked back to the owner — a web search of a named police dog revealed the handler's identity. This principle applies to Sniffout alerts.

**Minimum GDPR requirements:**
- A privacy notice specific to the alert feature, explaining what data is collected, how it is stored, and when it is deleted
- **Last seen location must be a map pin with an approximate area label — never a precise address.** A pin dropped on "Hampstead Heath" reveals no personal information; a pin at "43 Oak Lane" reveals where the owner lives.
- **Contact details mediated through in-app messaging** — never display the owner's phone number or address on the public-facing alert
- Defined **data retention**: alerts deleted after 30 days of resolution; owner account data subject to standard retention policy
- Explicit opt-in consent at the point of posting an alert

### Risk of theft targeting via published dog information

The Metropolitan Police and Dogs Trust both explicitly warn against publishing breed, photo, and regular walk location on social media, as this information is useful to thieves targeting high-value breeds. A missing dog alert that includes breed, photo, and location pin is precisely the information a dog thief would want.

**Mitigation:** The last seen location should never be near a home address. The app should not prompt for or display the dog's regular walk routes. The alert should be time-limited (a dog that went missing 3 months ago is no longer a live investigation).

**High-risk breeds need no special warning in the UI** — this would be over-engineering. But the terms of service and guidance text should note that owners of high-value breeds should consider whether to include a precise location pin.

### Moderation burden

Any user-generated safety alert creates a moderation responsibility. At small scale (early Sniffout userbase), manual review of flagged alerts is feasible. At scale, abuse reports multiply non-linearly.

**Minimum viable moderation stack:**
- Phone number verification gates posting (automated)
- User flagging routes to email queue (manual review at <4 hours)
- Auto-archive after 7 days (automated)
- Clear terms prohibiting false or misleading alerts, with an explicit removal policy

---

## Part 5 — Differentiation and Word-of-Mouth Potential

### Competitive differentiation

No walk-discovery competitor offers this feature. AllTrails, PlayDogs, Walkiees, and Komoot are all walk-finding tools with no community safety dimension. The absence of this feature from competitors is partly deliberate (moderation overhead, legal complexity) and partly a genuine product gap — no one has made the connection between the dog-walk-discovery audience and the missing dog alert use case.

If Sniffout builds this feature, it adds a new category of value: not just "find a walk" but "be part of the UK dog owner safety network." This repositions the app from a walk directory to a **dog owner's essential mobile companion** — a significantly broader and more defensible proposition.

### Word-of-mouth potential

The emotional stakes are very high. "Found via Sniffout" is a story with narrative clarity, a villain (losing your dog), a hero (a stranger who spotted the alert while walking their own dog), and a resolution. It is tailor-made for:
- Social media sharing by the owner
- Local press coverage ("local dog found thanks to app alert")
- App store reviews ("I found my dog because of this app")
- Word-of-mouth recommendations among dog owners ("download Sniffout — it helped me find my dog")

This category of story generates organic growth that advertising cannot replicate. The Citizen app, Nextdoor's crime alerts, and Nextdoor's broader growth are all partly explained by the same emotional mechanic: the platform helped me in a moment of genuine fear or vulnerability.

**14% of lost dogs in ASPCA research were found through social media** — through passive sharing by non-walkers. A push notification to active dog walkers within 2 miles of a lost dog is a structurally more targeted and effective mechanism.

### One honest risk to the differentiation argument

The feature's value scales with user density. **A 2-mile alert is useless if there are no active Sniffout users within 2 miles.** In the early POC phase, Sniffout does not have the geographic coverage to make missing dog alerts reliably useful in most UK areas. Launching a feature that fails to deliver in most use cases is worse than not launching it — it sets a false expectation and generates negative reviews.

This is the primary timing argument against building now.

---

## Part 6 — Minimum Viable Version

When the feature is built, the smallest version that delivers real value:

**Minimum viable feature set:**

| Element | Description |
|---------|-------------|
| Report missing dog flow | Photo + breed/colour + last seen GPS pin + in-app contact only |
| Phone number verification | Required before posting — one active alert per number |
| Push notifications to nearby users | 2–5 mile radius, configurable by reporter |
| In-app banner fallback | For users without push permissions |
| Sighting report | "I've seen this dog" → GPS pin + optional note → owner notified |
| Resolution flow | "My dog has been found" → resolution notification to all searchers |
| Auto-archive | After 7 days if unresolved; owner prompted to confirm or re-post |
| Disclaimer label | "Community reported — not verified by Sniffout" on all alerts |
| Flag/report button | Routes to moderation queue |

**What is not in MVP:**
- Community-submitted sightings map (Phase 2 enhancement)
- Breed filtering for alerts (not essential — photo is the primary identification mechanism)
- Sharing to external platforms from within the app (useful but not blocking)
- Stolen dog reporting (different legal category, different moderation implications — defer)

---

## Recommendation

**Build: Yes. Stage: Post-POC.**

### Why yes

The demand is real and substantial. The gap in the market is genuine — no walk-discovery app sends real-time alerts to active dog walkers. The word-of-mouth potential from a single high-profile "found via Sniffout" story is exceptional. The feature extends Sniffout's value proposition from "find a walk" to "be part of the UK dog owner safety network" — a much larger and more emotionally resonant positioning.

### Why not now

Three blockers all resolve after the POC:

1. **Backend infrastructure.** Push notifications require a backend to store subscriptions and trigger alerts. The current static GitHub Pages architecture does not support this. A backend (Firebase or equivalent) is a prerequisite — and that backend decision should be driven by the broader product roadmap (user accounts, community features), not by the missing dog feature alone.

2. **User density.** A 2-mile alert is only valuable if there are active users within 2 miles. In the early POC, geographic coverage is thin. Launching a feature that fails to deliver in most use cases sets a false expectation. The right threshold is "enough active users per region that a 2-mile alert reaches at least one person in a typical UK town."

3. **Moderation capacity.** Phone number verification and a moderation queue require operational attention. This is manageable at scale, but it is a distraction from the core POC mission of validating the walk discovery + weather proposition.

### Immediate action

**Design the feature fully now** — define the user flows, the data model, the privacy approach, and the moderation rules. This has two benefits: (a) it can be built quickly when the backend is in place, and (b) it demonstrates product vision to investors and early users even before it ships. A "coming soon" card in the app for "Missing Dog Alerts" communicates the app's direction without requiring the infrastructure to be ready.

Do not build for the current POC. Revisit when Sniffout has a backend, an account system, and demonstrable user density in at least 3–4 UK regions.

---

*Sources: Petlog (petlog.org.uk); Dogs Today Magazine; Dogster UK statistics; DogLost (doglost.co.uk) and Trustpilot; Animal Search UK; PetRadar (petradar.org); Nextdoor; Full Fact hoax posts analysis; UK Information Commissioner's Office (dog name as personal data); Metropolitan Police dog theft guidance; Dogs Trust theft advice; Web Push API / MagicBell / MobiLoud PWA notification guides; PawMaw lost dog statistics; ASPCA social media recovery data.*
