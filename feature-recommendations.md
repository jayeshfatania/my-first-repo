# Sniffout — Feature Recommendations
*Based on competitive landscape analysis and demand validation research, March 2026*

---

## How to Read This Document

Each recommendation is grounded in specific research findings from the two prior reports. Features are rated High / Medium / Low priority and tagged as either **Simple** (achievable within the single HTML file, no backend) or **Requires Backend** (needs server-side infrastructure, deferred per project constraints).

Non-negotiables respected throughout: free, no login, mobile-first, single HTML file.

---

## High Priority Recommendations

---

### 1. Livestock & Off-Lead Metadata on Every Walk

**What it is:**
Add two structured fields to each walk in WALKS_DB: whether the route passes through or near livestock areas, and whether there are off-lead sections (and where). Surface these prominently on the walk detail card — not buried in a description paragraph but shown as clear labelled tags or icons.

**Why the research supports it:**
This was the most explicitly and repeatedly requested feature in the demand research. On Mumsnet, AllTrails was specifically criticised for not warning about livestock — the single most cited deficiency of the most popular trail app in the world. The same thread listed livestock and off-lead information as primary reasons no existing app felt comprehensive. These are not nice-to-haves for UK dog owners; they are safety and legal requirements (the Countryside Code and livestock worrying laws make off-lead decisions a real legal consideration).

**Priority:** High

**Implementation:** Simple — add `livestock: true/false`, `offLead: "full" | "partial" | "none"` fields to each walk object in WALKS_DB, and render them as labelled tags on walk cards and detail views. No backend needed.

---

### 2. Walk Suitability Based on Current Weather

**What it is:**
On the Walks tab, show a brief contextual banner or indicator — derived from the already-fetched weather data — that summarises whether conditions are currently good, marginal, or poor for a walk. Something like: *"Good walking conditions right now"* or *"Heat warning — consider an early morning walk instead."* Optionally, surface the two or three walk recommendations best suited to current conditions (e.g., shaded woodland routes on hot days).

**Why the research supports it:**
This is Sniffout's core differentiating insight and the research validates it strongly. Petplan built a standalone weather-for-dogs product precisely because this demand exists. 43% of UK dog owners have walked their dogs in dangerous heat. 93% express concern about high temperatures but do not change their behaviour — the gap is real-time guidance at the point of decision. Sniffout already fetches weather and already has walks. Connecting them is the most impactful feature the app could ship, and it is the one thing no competitor offers.

**Priority:** High

**Implementation:** Simple — the weather data (temperature, rain, wind, `isDay`) is already available in the session state. Logic to derive a suitability label can be added inline. Surfacing it on the Walks tab header or home screen requires a small amount of UI work. No backend needed.

---

### 3. Terrain & Practical Detail Fields on Walk Cards

**What it is:**
Add structured metadata to walks covering: surface type (muddy/paved/mixed), whether stiles are present, sections walked on road, estimated time, parking availability, and whether the walk is pushchair/accessibility-friendly. Surface these as scannable tags rather than free text.

**Why the research supports it:**
The Mumsnet thread explicitly requested terrain specifics — stiles, road sections — as information that no app provides well. The Dog Walks app (Countryside Books) is praised specifically because it includes distance, time, refreshments, and parking. AllTrails difficulty ratings are criticised as being calibrated for humans, not dogs. Walk detail that helps owners decide *"is this right for my dog today?"* is the missing layer. A dog with mobility issues, an anxious dog, or a muddy-coat-averse owner all need different things — structured metadata answers these without requiring a backend.

**Priority:** High

**Implementation:** Simple — add fields to WALKS_DB objects and render them on walk detail cards. The existing card component can be extended. No backend needed.

---

### 4. Dedicated Paw Safety Heat Indicator

**What it is:**
When the weather is warm (above ~20°C), show a specific paw safety indicator — not just a generic heat hazard — with plain-language guidance. Something like: *"Pavement may be too hot for paws. Use the 7-second test before you walk."* Include the threshold logic for different scenarios: ambient temperature, time of day, and (if feasible) a simple heuristic for pavement temperature.

**Why the research supports it:**
60% of UK dog owners do not know that dogs' primary sweat glands are in their paw pads. The 7-second pavement test is widely recommended by vets but largely unknown. Petplan built an entire standalone product (Weather Furcast) around this single insight — it exists as a separate tool because the demand is real and the knowledge gap is documented. Sniffout can integrate this directly into the weather experience rather than requiring owners to open a separate app.

**Priority:** High

**Implementation:** Simple — extend the existing `renderWeather()` hazard detection logic. Add a paw-specific warning branch when temperature exceeds threshold, rendered as a distinct UI element (different from rain/wind hazards). No backend needed.

---

### 5. Walk Database Expansion (England Coverage + Regional Balance)

**What it is:**
Systematically grow WALKS_DB from 50+ walks to 150–200+, with deliberate coverage of all UK regions — particularly making sure no major county or city is unrepresented. Prioritise walks near large population centres (London, Manchester, Birmingham, Leeds, Edinburgh, Cardiff) where the highest number of dog owners live.

**Why the research supports it:**
The demand validation identified walk volume as Sniffout's most significant gap relative to competitors. Walkiees has 1,400+ walks; Dog Walks has 500+ for England alone. When a user opens the app in their town and finds no nearby walks, they close it and don't return. The curated approach (AI-generated, founder-verified) is a genuine quality advantage over community-generated content — but it needs sufficient density to feel useful in any region. This is not a feature in the UI sense, but it is arguably the highest-impact investment in the product right now.

**Priority:** High

**Implementation:** Simple in architecture — add walk objects to WALKS_DB. The work is content generation and verification, not engineering. The existing rendering, filtering, and map code already handles any number of entries.

---

## Medium Priority Recommendations

---

### 6. Walk Filtering by Practical Criteria

**What it is:**
Add filter options to the Walks tab beyond the current options — specifically: off-lead availability, no livestock, distance range, terrain type, and difficulty. Users should be able to say *"show me off-lead walks under 3 miles with no livestock"* in a few taps.

**Why the research supports it:**
Dog owners have specific, non-negotiable requirements that vary by dog. An anxious rescue dog needs quiet, off-lead, no livestock. A high-energy Labrador needs distance. A senior dog needs flat terrain. The failure mode of generic trail apps (AllTrails, OS Maps) is that they surface walks and leave the dog-specific filtering to the user. Sniffout can own this if the metadata from Recommendation 1 and 3 is in place.

**Priority:** Medium (dependent on Recommendations 1 and 3 being implemented first)

**Implementation:** Simple — filter logic in `renderWalks()` once metadata fields exist. Requires a small filter UI panel. No backend needed.

---

### 7. Seasonal and Contextual Hazard Warnings

**What it is:**
Beyond weather, surface relevant seasonal hazards in a lightweight, non-alarming way. Examples: *"Adder season — keep dogs on paths in heathland"* (spring/summer), *"Harvest time — increased livestock movement in countryside"* (late summer/autumn), *"Storm aftermath — check for fallen trees on woodland walks"* (post-storm).

**Why the research supports it:**
PlayDogs has rudimentary hazard alerts (processionary caterpillars, herding dogs) as a feature — it exists because users want it. The demand validation found that UK dog owners are routinely caught out by hazards they didn't expect. This content is static and seasonal, so it can be hardcoded as a date-aware lookup rather than a live feed.

**Priority:** Medium

**Implementation:** Simple — a small lookup object mapping month ranges to relevant hazards, rendered as an optional banner on the home or weather tab. No backend needed.

---

### 8. Walk Detail: Nearby Dog-Friendly Venues

**What it is:**
On the walk detail view, show nearby dog-friendly cafes, pubs, and car parks drawn from the existing Google Places integration. Users planning a walk naturally want to know *"is there a pub at the end?"* or *"can I park there?"*

**Why the research supports it:**
The Outdoor Guide (a UK dog walk resource) was specifically praised for combining routes with nearby dog-friendly cafes and pubs — this is the "full day out" use case. DogFriendly.co.uk built an entire product around combining walks with venues. Sniffout already has the Places tab and the Google Places API key. Surfacing it contextually on walk detail is a UX improvement that requires no new API work.

**Priority:** Medium

**Implementation:** Simple — on walk detail open, call the existing `fetchPlaces()` function centred on the walk's coordinates. Render the top 3–5 results inline. No backend needed.

---

### 9. Improved Walk Card Design with Photo Previews

**What it is:**
Add a representative photo to each walk in WALKS_DB (a static image URL per walk, either hosted externally or using a reliable free image source). Show it as a card thumbnail on the walks list.

**Why the research supports it:**
The competitive research found that visual-first design is table stakes for modern discovery apps. Go Jauntly uses photo-led walk tours as a differentiator. The demand validation found that social media (Instagram) is how UK dog owners currently discover new walks — they follow accounts that post photos of routes. A visually appealing walk card increases the perceived quality of the content and drives the desire to try the walk.

**Priority:** Medium

**Implementation:** Simple in architecture (add `imageUrl` to each walk object), but requires sourcing reliable, appropriate images. Could use Wikimedia Commons or Unsplash for UK landscape photos as a starting point. No backend needed.

---

### 10. Share a Walk (Native Share API)

**What it is:**
Add a share button on walk detail views that uses the Web Share API to share the walk name, description, and a deep link (or just the app URL) via any installed app (WhatsApp, iMessage, etc.).

**Why the research supports it:**
The demand validation found that UK dog owners currently use Facebook groups and word-of-mouth to share walk recommendations. Every time a user tells a friend *"I found this great walk"*, that is an organic acquisition opportunity. The Web Share API works natively on mobile browsers and requires no backend — it hooks into the OS share sheet directly.

**Priority:** Medium

**Implementation:** Simple — a one-function addition using `navigator.share()`. No backend needed.

---

## Lower Priority Recommendations

---

### 11. Walk Completion Tracking (Without Login)

**What it is:**
Allow users to mark walks as "done" and track how many they have completed — stored in localStorage alongside favourites. A simple count or progress indicator (*"You've explored 8 of 50 walks nearby"*).

**Why the research supports it:**
The Biscuit app demonstrated that gamification and progress tracking motivates UK dog owners to vary their walks — they accepted significant privacy trade-offs to get it. Sniffout can offer a lightweight version of this without any data collection or backend, using the same localStorage pattern as favourites.

**Priority:** Low

**Implementation:** Simple — add `completedWalks` to localStorage alongside `sniffout_favs`. No backend needed.

---

### 12. Weather History for Walk Planning ("Best Time to Walk")

**What it is:**
Use the Open-Meteo API's hourly forecast data (already available) to show the best time window to walk today — *"Ideal window: 7am–9am and 6pm–8pm. Avoid 11am–4pm (heat risk)."*

**Why the research supports it:**
54% of UK dog owners rush walks in bad weather. The research found that weather significantly affects walk timing, but owners currently make these decisions reactively (going out in dangerous heat, cutting short in cold). Surfacing a proactive *"walk window"* recommendation addresses the documented mismatch between owner concern and actual behaviour.

**Priority:** Low (useful, but the paw safety indicator in Recommendation 4 addresses the acute need first)

**Implementation:** Simple — Open-Meteo hourly data is already fetched. Add logic to scan the day's forecast and identify low-hazard windows. No backend needed.

---

### 13. Dog-Friendly Venue Filters in Places Tab

**What it is:**
In the existing Places tab, add filter options for specific venue types relevant to dog outings: *"Dog-friendly pub"*, *"Dog-friendly café"*, *"Dog water station"*, *"Vet nearby"*.

**Why the research supports it:**
PlayDogs includes venue categories prominently. DogFriendly.co.uk built a product entirely around this. The Places tab exists but currently offers broad category filters. Tightening these to dog-specific language improves relevance and reinforces that Sniffout is specifically for dog owners, not a generic nearby-places tool.

**Priority:** Low

**Implementation:** Simple — adjust the categories passed to the existing `fetchPlaces()` function and update the UI labels. No backend needed.

---

## Longer-Term Considerations (Not for POC Phase)

These are flagged for future phases only. None should be built now.

- **Walk submission by users** — requires moderation, storage, and login (see Login section below)
- **Push notifications** — e.g., "Perfect walking weather this afternoon" — requires a backend or a service like OneSignal; adds significant complexity
- **Offline-first walk maps** — caching full map tiles for offline use is complex and storage-heavy; current network-first service worker is appropriate for POC
- **Native app** — explicitly deferred per project brief

---

## The Login Question

### What Logins Would Unlock

The primary use case for user accounts is **user-submitted walk content**. This is the only path to growing WALKS_DB beyond what can be manually curated, and it is the mechanism by which Sniffout could eventually scale to Walkiees-level coverage (1,400+ walks) without requiring the team to generate every entry.

Secondary benefits of logins:
- Favourites and reviews persist across devices and reinstalls (currently localStorage only — lost on browser data clear)
- Personalisation: breed-specific hazard advice, saved preferences, walk history synced across devices
- Community features: comments, ratings, walk suggestions
- Trust signals: verified walks from identified contributors vs. anonymous

### The Costs and Risks

**Friction is real and significant.** The demand research is unambiguous: every competitor that requires login before meaningful use creates a conversion barrier. Sniffout's no-login stance is explicitly called out in the competitive analysis as a differentiator. The moment a new user hits a sign-up wall, a significant percentage will leave. This is not a theoretical risk — it is the documented behaviour across every app reviewed.

**Infrastructure requirements are non-trivial.** A login system requires: user database, auth tokens, password reset flow, email verification, GDPR compliance (data subject rights, retention policy, privacy policy update), and either a backend server or a BaaS (Firebase, Supabase). This is a significant engineering investment that contradicts the current single-HTML-file architecture and the explicit "no backend" constraint for the POC phase.

**The cold-start problem applies to user-generated content too.** Even with logins enabled, a user opening Sniffout in their town and finding only AI-curated walks will not immediately submit a new walk. The community submission flywheel requires a critical mass of engaged users before it generates meaningful new content. This argues for building that engaged user base first — before adding the infrastructure.

### The Right Time to Introduce Logins

**Not yet.** The POC needs to validate that users find the weather + curated walk combination valuable enough to return. Until return visits are happening at a meaningful rate, there is no point in building an account system — you would be adding infrastructure for users who haven't decided to stay yet.

**The trigger condition for introducing optional logins is:** evidence of retained users who have favourited walks, used the app multiple times, and are running out of new local walks to try. At that point, the value exchange is clear — *"create an account to submit a walk you love and help other dog owners discover it."*

**The recommended approach when the time comes:**
- Make login entirely optional — users without accounts should retain full access to all discovery features
- Gate only the *contribution* actions behind login (submitting walks, leaving reviews that persist)
- Use a lightweight social login (Google/Apple sign-in) rather than email/password to minimise friction
- Introduce at the same time as the walk submission feature, so the reason to create an account is immediately clear

In short: **login is the right call eventually, but it is the wrong call now.** The POC should prove the product works first. Login is infrastructure for scale — and you don't need infrastructure for scale before you've achieved scale.

---

## Summary Table

| # | Feature | Priority | Complexity |
|---|---------|----------|------------|
| 1 | Livestock & off-lead metadata on walks | High | Simple |
| 2 | Walk suitability based on current weather | High | Simple |
| 3 | Terrain & practical detail fields | High | Simple |
| 4 | Paw safety heat indicator | High | Simple |
| 5 | Walk database expansion | High | Content work only |
| 6 | Walk filtering by practical criteria | Medium | Simple (needs 1 & 3 first) |
| 7 | Seasonal & contextual hazard warnings | Medium | Simple |
| 8 | Nearby venues on walk detail | Medium | Simple |
| 9 | Walk card photo previews | Medium | Simple |
| 10 | Share a walk (Web Share API) | Medium | Simple |
| 11 | Walk completion tracking | Low | Simple |
| 12 | Best time to walk window | Low | Simple |
| 13 | Dog-friendly venue filters | Low | Simple |
| — | User logins & walk submission | Deferred | Requires backend |
| — | Push notifications | Deferred | Requires backend |
| — | Native app | Deferred | Major investment |
