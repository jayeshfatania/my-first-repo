# Sniffout — Product Owner Action Plan
*Reviewed: March 2026. Covers competitor-research.md, demand-validation.md, feature-recommendations.md, design-brief.md, design-spec.md, weather-research.md, copy-review.md. Updated following mockup review session, copy review, Round 3 developer review, and Design Review Round 1.*

---

## Current Status — March 2026

**Phase 1 build:** Complete. sniffout-v2.html validated and rebuilt from scratch. All core features functional.

**Phase 1 fixes (round 1–3):** Round 1 and 2 fixes confirmed complete. Round 3 fixes (4.1–4.4): mostly complete with two items flagged as regressions by design review (see below).

**Round 3 — confirmed done:**
- FIX 4.1 — "Other nearby green spaces" label text ✅
- FIX 4.2 — Venue photos on Nearby tab ✅
- FIX 4.4 — `enclosed` field added to all 25 WALKS_DB entries; chip renders on cards ✅

**Round 3 — flagged as unresolved by Design Review:**
- FIX 3.1 — Dark mode `--brand: #6EE7B7` documented as done but absent from file per designer full-file search → **Reopened as FIX 5.1**
- FIX 4.3 — Map view `filteredVenues()` fix documented as done but function still undefined per designer → **Reopened as FIX 5.2**

**Design Review Round 1:** Complete. 8 issues identified. All addressed in developer-brief-round4.md.

**Round 4 fix brief:** Issued. See developer-brief-round4.md. Contains 9 items (FIX 5.1–5.9). Two are confirmed critical regressions (5.1, 5.2); two are high priority UX issues (5.3, 5.4); two are medium (5.5, 5.6); two are low polish (5.7, 5.8); one (5.9) is pending owner decision.

**Owner decisions pending — Round 4:**
1. **Walks tab section label** — "Community Picks" vs "Sniffout Picks" vs "Recommended Trails" — decision required before FIX 5.9 can be implemented. See Flag A in developer-brief-round4.md.
2. **Walks tab empty state copy** — dependent on decision above. See Flag B in developer-brief-round4.md.

**Owner decisions confirmed (March 2026):**
1. `enclosed: boolean` field — **signed off**. Added to WALKS_DB schema (FIX 4.4). Done.
2. Walks tab map toggle — **will not add**. Walk routes are not map pins; proximity-sorted list serves the use case better.
3. Filter chips on Walks tab — **Phase 2 item**. Not in current build.
4. Community submission features — **Deferred**. `communityWalks` is not part of v2.

---

## **🚨 DO NOT MODIFY `dog-walk-dashboard.html` — EVER**

**`dog-walk-dashboard.html` is the live production file. It has been shared with real users. It must not be touched, edited, refactored, or used as a base for any new work under any circumstances.**

**All development happens in `sniffout-v2.html` only.**

If a change to the live file is ever needed, it must be explicitly requested by the PO and treated as a separate, deliberate operation — never as part of v2 development work.

- **`sniffout-v2.html`** — all new development goes here
- **`dog-walk-dashboard.html`** — live production, do not touch
- **`sw.js`, `manifest.json`** — may be updated only when explicitly instructed by the PO

---

## Overall Assessment

The research is strong and the design work is of high quality. The competitive case is well-made, the demand is genuinely evidenced (not speculative), and the design direction is correct. The team has produced more than enough to give the Developer a clear mandate. This plan records what to approve, what to flag, and in what order to proceed.

---

## What I Agree With

### Research & Demand
- The competitive matrix is accurate. The "no app combines walk discovery + live weather for UK dogs" framing is Sniffout's core positioning and it holds up.
- The cold-start problem with PlayDogs is the right thing to lead with. It's the clearest structural advantage Sniffout has.
- The weather safety statistics (43% walked dogs in dangerous heat, 60% unaware sweat glands are only in paws) are strong product justification for making the paw safety indicator prominent, not buried.
- Facebook groups as the current workaround is exactly the right "pre-product signal" to cite. This validates the POC is solving a real problem, not a hypothetical one.
- The honest caveat in demand-validation.md about walk volume (50 vs 1,400) is the most important single risk and should be treated as such.

### Features
- The high-priority feature list (livestock metadata, weather suitability on walks, terrain fields, paw safety indicator) is well-reasoned and correctly scoped for a single HTML file.
- The login analysis is excellent. The trigger condition — retained users running out of local walks — is exactly right. Do not revisit this decision until that signal appears.
- Community tab: correctly deferred. Agree completely with the reasoning.

### Design
- Removing glassmorphism: unambiguously correct. It works against photography, dates quickly, and adds complexity.
- Forest green `#1E4D3A` as the sole accent: correct. TGTG uses exactly this pattern — one strong dark colour, used sparingly, everything else neutral. It gives identity without noise.
- Inter typeface: correct. No justification needed.
- Tab renames (Nearby, Me): approve both. Warmer and shorter.
- Today tab concept: approve. The two-state design (no location / location known) is the right approach. The designer correctly identifies this as a new feature that doesn't yet exist, which is important for scoping.
- The designer's pushback on the photo background for the weather hero card (use solid brand green instead) is correct — photos behind text create contrast problems that are hard to maintain across dynamic weather states.
- Elevating the seasonal tip from "small, dismissible" to a distinct informational card is the right call. If the research validates it as a differentiator (PlayDogs has it), treat it as a feature.
- Dark mode accent correction (`#6EE7B7` instead of `#4ADE80`): approve. The reasoning is sound.
- The implementation complexity table in Part 5 of the design spec is useful and reassuring. The estimate of 3,500–3,800 lines is manageable.

---

## What I Disagree With or Want to Flag

### 1. Walk database expansion is not just "content work"
The feature recommendations describe expanding from 50 to 150–200 walks as "content work only, not engineering." This undersells the effort. Sourcing, verifying, structuring, and adding new walk objects (with the new field schema including `imageUrl`, `livestock`, `offLead`, `terrain`, `badge`) is the most time-consuming task on the list. It also can't be done until the new WALKS_DB schema is finalised. This needs an owner and a realistic estimate before it goes on any sprint. The Developer needs to lock the schema first; content expansion is a parallel workstream thereafter.

### 2. Week streak on Me tab — deprioritise
The "week streak" stat on the Me tab is premature. Completion tracking itself (marking a walk as done) hasn't been validated as something users will engage with. Building streak logic on top of an unvalidated behaviour is speculative. Cut from the Me tab for now. If users begin using walk completion tracking, add it in a later pass.

### 3. Walk photos are a content bottleneck, not an engineering one
The spec correctly identifies photos as the "highest-impact visual element." The engineering work is trivial (add `imageUrl` to each walk object, render with `loading="lazy"`). The bottleneck is sourcing 50+ appropriate, correctly licensed UK countryside photos. Unsplash and Wikimedia Commons are the right starting points. This should begin immediately and in parallel with the engineering work — it does not need to wait for the Developer to implement image support first. Assign separately.

### 4. "Get directions" on Nearby tab — reconsider `google.com` URL
The spec uses `window.open('https://maps.google.com/?q=lat,lon')`. On iOS, this won't open the native Maps app reliably. Use `https://maps.apple.com/?q=lat,lon` for Apple Maps or the `geo:` URI scheme, with a fallback to Google Maps. Worth flagging to Developer now to avoid a broken experience on iOS.

### 5. Marker clustering plugin — evaluate carefully
The spec mentions Leaflet.markercluster as a CDN addition. Given this is a PWA that needs to be fast on mobile, any additional CDN dependency should be evaluated for load impact. The spec itself acknowledges it can be approximated without the plugin. Default to not adding it unless the current Leaflet experience proves unusable with many pins at once. Flag to Developer: implement without the plugin first.

---

## Anything That Conflicts With Non-Negotiables

None of the core recommendations conflict with the non-negotiables. Specifically:
- **Free / no login**: These are the current product stance for the POC, not permanent brand promises. They must not appear in user-facing copy — do not advertise what may change. Internally they remain valid constraints for now.
- **No login**: Respected throughout in implementation terms. The Me tab, community tab deferral, and login analysis all honour this.
- **Mobile-first**: Spec is entirely mobile-first. Desktop "coming soon" screen is unchanged and untouched.
- **Single HTML file**: The spec explicitly scopes everything to the single-file architecture. The complexity table addresses this directly. No recommendation requires a backend or separate file structure.

---

## Colour Scheme — Does It Need Re-Evaluating?

**No. Approve the new palette and move forward.**

The rationale is solid and the reference is concrete (TGTG uses the same pattern: one strong dark green, everything else neutral). The key decisions — moving from glassmorphic bright green to `#1E4D3A` deep forest green, warm off-white (`#F7F5F0`) background, clean white card surfaces, no glassmorphism — are all well-argued and cross-referenced to the inspiration screenshots. The dark mode palette update (`#6EE7B7` accent on `#0F1C15` background) is similarly reasoned.

The owner's openness to changing the colour scheme is noted, but the designer has done the research and made the right call. Running another design research session on colour alone would not add value at this stage. The new palette should be the palette. If it looks wrong once implemented, adjust then — but the direction is correct.

---

## Tone of Voice and Copy — Honest Assessment

**The copy needs a dedicated review session before the Developer implements it.**

My honest opinion: the wording across the design spec and brief is functional but lacks character. It describes what the app does, but it doesn't sound like anything in particular. For a product called *Sniffout* — which is playful, specific, and has a clear personality — the copy is surprisingly generic.

**The problems:**

*Headlines are generic.* "Find great dog walks near you — and know if conditions are safe" is a serviceable description of the app. It is not a hook. Compare this to how TGTG frames its value ("Rescue food from restaurants and stores near you") — specific, active, slightly urgent. Sniffout's headline needs the same quality of thought.

*Weather verdict strings are descriptive, not distinctive.* "Good walking conditions." "Wet but walkable." "Poor conditions." These are the most important words in the entire app — the single line a user reads to decide whether to go out — and they're currently first-draft functional. They need to feel like they were written for dog owners, not pulled from a weather service.

*Empty states are clinical.* "No walks found nearby. Try adjusting your filters or expanding your search area." This reads like error text, not product copy. The spec notes these should be "encouraging, not clinical" but the proposed wording doesn't achieve that.

*Social proof line is underselling.* "50+ curated walks across the UK / Free · No sign-up · Works offline" is accurate but flat. The no sign-up / no login angle is a real differentiator that competitors can't match — it deserves a sharper line.

*The paw safety content is the exception.* "Pavement may be hot. Use the 7-second test before heading out." This is specific, actionable, and appropriate. The seasonal tips are similarly grounded. These work because they're concrete. The rest of the copy should reach this standard.

**Recommendation:** Yes, schedule a dedicated copy review session before the Developer hardens any microcopy. The effort required is not large — the spec already has the right *structure*, the copy just needs a pass from someone with a copywriter's eye. In that session, focus on:
1. The onboarding headline (State A hero section)
2. The six weather verdict strings
3. The walk-related empty states
4. The social proof / trust signals on the location screen
5. The paw safety and seasonal hazard wording

Do not let the Developer hardcode bland copy that will need reworking later. It is much cheaper to fix it in a document now.

---

## Recommended Order of Work

### Before Development Starts

1. **Lock the WALKS_DB schema** — field definitions are confirmed in developer-questions.md. Everything downstream depends on this being settled first.
2. **Assign photo sourcing owner** — walk cards need an `imageUrl` per entry. Use brand-green placeholder until photos are ready; do not block Phase 1 on this.
3. **Copy is approved** — all strings confirmed in this doc and developer-questions.md. One item still outstanding: onboarding overlay title (deferred — overlay is out of scope for now).

---

### Phase 1 — Visual Foundation and Mockup Refinement

*Goal: sniffout-v2.html looks and feels like the design spec. All visual foundations are in place. Walk cards are redesigned with real data fields. Mockup issues are resolved.*

**Visual foundation**
1. **CSS token swap** — full colour token set (light + dark mode) per design spec. Remove all glassmorphic variables.
2. **Font swap** — Inter (weights 400/500/600/700) via Google Fonts CDN. Replace Fraunces and DM Sans.
3. **Bottom nav redesign** — filled/outlined active states, labels (Today · Weather · Walks · Nearby · Me), safe area insets, correct border.
4. **Card base styles** — border-radius 16px, `1px solid var(--border)`, white surface on warm background, no glassmorphism.
5. **Filter chip and segmented toggle styles** — inactive/active states per spec, used across Walks and Nearby tabs.

**Walk cards and data**
6. **Update WALKS_DB schema** — add all confirmed fields per developer-questions.md (`offLead`, `livestock`, `hasStiles`, `hasParking`, `terrain`, `difficulty`, `imageUrl`, `badge`, `rating`, `reviewCount`, `distance`, `duration`, `source`). Drop `isPushchairFriendly`.
7. **Walk card redesign** — photo area (180px, brand-green placeholder if no `imageUrl`, lazy loading), badge pill, heart icon, metadata row, tag chips for off-lead and livestock.
8. **Hybrid content badge** — render `Sniffout Pick` pill on curated walks (`source: 'curated'`), neutral `Nearby` label on Google-sourced results.

**Mockup fixes**
9. **Today tab State A preview cards** — warm up with brand-green tint (`rgba(30,77,58,0.06)`) instead of grey (Option A approved). Remove any grey placeholder treatment.
10. **Remove all "free" / "no sign-up" / "no account" copy** — audit entire file for these strings and remove. Applies to all surfaces.
11. **Subline** — update to `Handpicked walks. Live conditions.`
12. **Social proof strip** — update to `50+ handpicked UK walks · Works offline · Dog-specific routes`

**Validator checkpoint after Phase 1:** Visual regression across all 5 tabs. Dark mode correct. Walk cards render on various screen sizes. WALKS_DB fields populated. No "free/no sign-up/no account" strings remain anywhere.

---

### Phase 2 — Core Feature Improvements Based on Research

*Goal: the app's key differentiating features are built and working. The Today tab exists. Walk filtering works. Walk detail is fully featured. The weather-walk connection is live.*

**Today tab (new feature)**
1. **State A** — geolocation attempted on load; search as fallback; Option A preview cards (brand-green tinted); social proof strip; recent search pills from localStorage.
2. **State B** — weather hero card (solid brand green, `getWalkVerdict()` string, condition pills), conditional hazard card (amber), horizontal walk scroll (nearest 5–8 walks), conditional seasonal tip.
3. **`getWalkVerdict()`** — shared pure function, used by both Today and Weather tabs. Approved verdict strings per copy review.
4. **`SEASONAL_TIPS`** — static lookup constant, date-driven.

**Walks tab enhancements**
5. **Filter chip logic** — off-lead, no livestock, terrain, distance range. Depends on Phase 1 schema.
6. **Radius selector** — `Within X miles ▾` inline control on Walks and Nearby tabs. Chips: 1 / 3 / 5 / 10 mi. Stored to `localStorage: sniffout_radius`.
7. **Weather suitability banner** — thin amber strip on Walks tab when a weather hazard is active; adjusts walk sort order (e.g. shaded/woodland routes first on hot days).
8. **Walk detail overlay** — `position: fixed; inset: 0` overlay, slide-up animation, scroll lock, bottom nav hidden when open. Content: hero image with scrim, practical details grid, embedded Leaflet map, nearby venues (top 3 via existing `fetchPlaces()`), share button (Web Share API).

**Paw safety indicator**
9. **Paw safety block on Weather tab** — always visible, traffic-light left border, approved copy. Thresholds: < 20°C safe, 20–25°C caution, 25°C+ danger.

**Validator checkpoint after Phase 2:** Today tab both states (geolocation granted / denied / blocked). Session restore. Filter chip combinations. Walk detail overlay on iOS Safari (scroll lock, safe area insets, back button). Weather verdict logic correct.

---

### Phase 3 — Polish, Copy, Weather Enhancements and Pollen

*Goal: weather tab is fully redesigned with all dog-specific intelligence. Pollen is live. Me tab and Nearby tab are polished. All approved copy is in place.*

**Weather tab full redesign**
1. **Conditions grid** — drop visibility; retain temp, feels-like, rain, wind, UV, sunrise/sunset. Humidity feeds hazard logic, not grid.
2. **Add `uv_index` to Open-Meteo API call** — not currently fetched; required for paw safety heuristic and UV hazard card.
3. **Updated paw safety heuristic** — `temp > 22°C AND uv_index > 5 AND time between 10am–6pm`.
4. **Precipitation type differentiation** — use WMO weather codes to distinguish snow (ice ball / rock salt advice) and freezing rain (slip risk) from standard rain.
5. **`getBestWalkWindows()`** — pure function scanning Open-Meteo hourly data. ~30 lines. Renders as colour-coded hourly bar.
6. **3-day forecast cards** — day, condition icon, high/low, suitability verdict chip.

**Pollen**
7. **Pollen card** — Open-Meteo `european_aqi` endpoint (`grass_pollen`, `birch_pollen`, `alder_pollen`). No new API key. Render as hazard card on Weather tab (low/moderate/high). Bubble to Today tab hazard section on High days only.

**Me tab and Nearby tab polish**
8. **Me tab** — greeting card, stats row (saved count, explored count — passive view tracking, no explicit mark-as-done), favourites horizontal scroll, settings rows (units, dark mode override), "Clear all data" with inline confirmation.
9. **Nearby tab** — apply new card styles, chip styles, segmented toggle. Primarily visual polish; tab is largely functional.
10. **Share walk button** — Web Share API, ~5 lines. In walk detail overlay.

**Copy pass**
11. Final audit: all approved strings from copy review are in place. No placeholder or ⏳ strings remain in the live build.

**Validator checkpoint after Phase 3:** Pollen API response handling. UV-dependent paw safety threshold. Precipitation type hazard differentiation. Me tab stats (passive walk tracking). iOS "Get directions" (Apple Maps on iOS, Google Maps on Android). Full copy audit — no "free/no sign-up/no account" strings.

---

### Breed Personalisation — Phase 3 or Post-POC

Build only after Phases 1–3 are stable. Four-category system (`flat-faced`, `thick-coated`, `small-thin`, `standard`), localStorage only, contextual prompt on first hazard trigger. See breed personalisation section for full spec.

---

## What I'm Pushing Back On or Deprioritising

| Item | Decision | Reason |
|------|----------|--------|
| Week streak (Me tab) | Deprioritise | Built on unvalidated behaviour (walk completion). Remove from spec scope for now. |
| Walk completion tracking | Low priority | Useful, not urgent. Implement after core walk discovery UX is strong. |
| Marker cluster plugin (CDN) | Defer | Implement without it first; add only if proven necessary. |
| Nearby venues expansion (feature rec #13) | Deprioritise | Tab exists, use existing implementation. New venue filter labels are low effort if done during Nearby tab polish (Sprint 5). Don't build new API logic. |
| Walk submission / community features | Confirmed deferred | No change from CLAUDE.md. |
| Firebase / push notifications / native app | Confirmed deferred | No change from CLAUDE.md. |
| Breed-specific weather alerts | **Upgraded — see Sprint 6** | Weather research changes this from post-POC to a late-POC addition. See breed personalisation section below. |

---

## Updates from Mockup Review Session

### 1. Hybrid Content Model (Curated + Google-Sourced)

The app should formalise a two-tier content model:

- **Curated walks** — the 50+ (growing) handpicked routes. These are the product. Full metadata, weather suitability, terrain tags, livestock warnings.
- **Nearby green spaces** — Google Places fallback, surfaced when curated walk density is thin in a given area. Supplementary only. Less metadata.

`loadNearbyGreenSpaces()` already exists in the codebase and partially implements this. The work is to formalise it in the design and data model.

**Visual differentiation:** badge system on walk cards.
- Curated: **"Sniffout Pick"** pill (brand green, white text) — same position as "Hidden gem" badge in spec
- Google-sourced: no badge, or a neutral **"Nearby"** label in gray — visually subordinate

**Schema addition:** add `source: 'curated' | 'places'` field to walk/result objects. Developer renders badge conditionally.

**Designer action:** add Sniffout Pick badge treatment to walk card spec before Sprint 2.

---

### 2. Empty State (Today Tab — State A)

The Today tab State A design in the spec already defines this correctly. If the mockup doesn't reflect it, the Developer needs to revisit:
- Geolocation attempted silently on load
- If denied/failed: search input revealed with recent searches as pills
- Muted preview cards showing what the user will see once location is set
- Social proof strip: "50+ curated walks · Free · No sign-up"

No new design work required — this is a build fidelity issue.

---

### 3. Weather Dashboard Relevance Audit (Updated Post Weather Research)

The weather research significantly refines the earlier audit. Key changes from prior version are marked.

| Metric | Keep? | Notes |
|--------|-------|-------|
| Temperature | ✅ | Core |
| Feels-like (apparent_temperature) | ✅ | Core — also the basis for heat index |
| Rain probability / precipitation | ✅ | Core |
| Wind speed | ✅ | Relevant for exposed walks; size-differentiated in breed personalisation |
| UV index | ✅ **Add — not currently fetched** | Needed for paw safety heuristic and UV risk for thin/pale-coated breeds. Must be added to the Open-Meteo API call. |
| Sunrise/sunset | ✅ | Walk timing, especially winter |
| Humidity | ✅ **Keep — not standalone, but critical** | Previous audit said drop or contextualise. The research reverses this: veterinary guidance uses `temperature + humidity ≥ 150°F` as the danger threshold. Humidity is the invisible multiplier on heat risk. Keep it but render it only as part of the heat hazard card, not as an isolated metric in the conditions grid. |
| Precipitation type (rain vs. snow vs. ice) | ✅ **Add differentiation** | Open-Meteo already returns WMO weather codes distinguishing rain, snow, sleet, and freezing rain. Sniffout already uses these for hazard detection but doesn't differentiate. Snow → flag ice balls between paw pads and rock salt risk. Freezing rain/ice → flag slip risk for dog and owner. Small addition, meaningful advice. |
| Visibility (km) | ❌ | Drop. Not actionable for dog owners. |
| Barometric pressure | ❌ | Evidence base too weak for MVP. Anecdotal arthritis link doesn't meet the bar. |

**Developer flags from this audit:**
- `uv_index` must be added to the Open-Meteo `forecast` API call parameters — it is not currently fetched
- The paw safety heuristic should use: `temperature > 22°C AND uv_index > 5 AND time between 10am–6pm` (not temperature alone)
- Humidity should feed into the heat hazard threshold calculation, not appear as a standalone grid cell
- WMO weather codes should be used to differentiate snow/ice warnings from rain warnings in the hazard rendering

---

### 4. Pollen & Allergens — Upgrade to POC Inclusion, Sprint 4

The weather research substantially strengthens the case for pollen. Previous assessment was "Medium priority, Sprint 4." New position: **include in the POC, Sprint 4, and treat it as a first-class feature, not an afterthought.**

**Why the case is stronger than initially assessed:**
- Pollen allergy in dogs does not cause hay fever — it causes **canine atopic dermatitis**: chronic itchy skin, paw licking, ear infections. Most owners do not connect these symptoms to pollen. This is exactly the kind of educational, actionable content that creates app value.
- **Labrador Retriever** (UK's #1 breed, 34,141 registrations in 2024) and **Cocker Spaniel** (UK's #2, 23,177) are both on the susceptibility list. Pollen warnings are relevant to the owners of the most common dogs in the UK.
- Peak pollen season is May–July. If the POC launches in spring 2026, it will immediately be live during peak season. Not including pollen would be a missed opportunity at exactly the right moment.
- The walking advice conflict is genuinely useful and unique: high pollen days mean **avoid early morning and evening walks** — the opposite of heat advice. No other app surfaces this conflict.

**Implementation:** Single additional API call to Open-Meteo `european_aqi` endpoint (`grass_pollen`, `birch_pollen`, `alder_pollen`). Bucket into low/moderate/high. Render as a hazard card in the Weather tab. Include the paw-wipe advice on moderate/high days ("Wipe paws and muzzle after every walk on high pollen days").

Not shown on the Today tab by default — only bubble up to the Today hazard card if pollen is High.

**Developer action in Sprint 4:** Add `european_aqi` API call alongside existing Open-Meteo weather call. Add pollen hazard card component to Weather tab. Add conditional Today tab bubble for High pollen days.

---

### 5. Search Radius / Distance Control

The codebase already has `searchRadiusKm = 3` as a global and the Nearby tab has a 1–10km radius control. The gap is that this isn't visible or consistent across Walks and Nearby.

**Decision:** Do not add a separate settings screen. Surface as an inline control on both Walks and Nearby tabs.

**Design:** A **"Within X miles ▾"** tappable label above the walk/venue list. Tap opens a compact option set — `1 mi / 3 mi / 5 mi / 10 mi` as chips, not a slider. Chips are faster on mobile and require no precision. Stores to `localStorage: sniffout_radius`.

**Scope:** Add to Sprint 4 filter chip work. Consistent control across both Walks and Nearby tabs.

---

## Breed Personalisation — Updated Assessment and MVP Spec

### Is this a POC addition or a longer-term roadmap item?

**Revised position: include in the POC, but not until Sprint 6 — after the core weather and walk UX is stable.**

The earlier assessment put this on the post-POC backlog. The weather research changes that. Three things shift the position:

1. **The science is unusually robust.** The RVC VetCompass study covered 905,543 UK dogs. Brachycephalic breeds have 4–16× elevated heatstroke odds. This isn't a weak health claim — it's one of the strongest evidence bases in the entire research corpus, and it comes from UK dogs.

2. **The UK's most popular breeds are disproportionately high-risk.** French Bulldog (3rd most registered in 2024) has 6.49× elevated heatstroke odds. Cavalier KCS and Pug are also top-10 and high-risk. Pollen sensitivity affects Labradors (#1) and Cocker Spaniels (#2). A large proportion of Sniffout's user base owns a dog that would directly benefit from differentiated advice.

3. **No backend required. The MVP is genuinely simple.** Four breed categories, a localStorage key, and a parameter passed to the existing hazard functions. This does not violate the single-HTML-file constraint or any non-negotiable.

**The risk of including it:** adding onboarding complexity before the core experience is validated. **Mitigation:** do not gate the app on it. The breed question is surfaced contextually, not as a mandatory step.

---

### MVP Spec — Four-Category Breed System

Do not build a full breed database. A four-category classification covers the vast majority of real-world variation and maps cleanly to the research findings.

**Categories:**

| Category | Key breeds | Primary risks |
|----------|-----------|---------------|
| `flat-faced` | French Bulldog, Pug, Bulldog, Cavalier KCS, Boxer, Shih Tzu, Lhasa Apso, Boston Terrier, Dogue de Bordeaux | Heat at low thresholds; humidity multiplier critical; pollen/skin allergy |
| `thick-coated` | Siberian Husky, Alaskan Malamute, Bernese Mountain Dog, Newfoundland, St Bernard, Chow Chow, Samoyed, Rough Collie | Heat at medium thresholds; ice balls in snow; never shave |
| `small-thin` | Chihuahua, Yorkshire Terrier, Whippet, Greyhound, Italian Greyhound, Toy breeds | Cold risk; UV sunburn for pale/thin coats; wind risk at low speeds |
| `standard` | Labrador, Cocker Spaniel, Border Collie, Springer Spaniel, Jack Russell, German Shepherd, Golden Retriever, most others | Default thresholds; pollen sensitivity still relevant |

**Adjusted thresholds per category:**

| Condition | flat-faced | thick-coated | small-thin | standard |
|-----------|------------|--------------|------------|---------|
| Heat caution threshold | 19°C | 21°C | 25°C | 24°C |
| Heat danger threshold | 22°C | 25°C | 30°C | 28°C |
| Cold caution threshold | 5°C | None | 7°C | 3°C |
| Pollen sensitivity | Elevated | Standard | Elevated (UV too) | Standard |
| UV warning | Standard | Standard | Elevated | Standard |
| Wind warning | Standard | Standard | Elevated (physical risk) | Standard |

**Optional modifiers (stored separately in localStorage):**
- `senior: true` — dogs aged 8+ have 1.75× elevated heatstroke odds regardless of breed. Same thresholds as flat-faced when Senior flag is set.
- Age and weight modifiers are lower priority — add only if breed category lands well with users.

**localStorage keys:** `sniffout_breed_type` (one of the four category strings), `sniffout_dog_senior` (boolean).

---

### How to Surface the Breed Question (UX approach)

Do not show a breed selector during onboarding as a mandatory step. Use a contextual prompt triggered the first time a heat or cold hazard fires:

> *"Is your dog flat-faced (like a French Bulldog or Pug)? We can tailor our weather warnings to your dog."*
> — [Yes, flat-faced] [No] [Other breed type ▾]

This surfaces at exactly the moment it's most relevant, requires no extra screen, and feels helpful rather than form-filling. The user's answer is saved to localStorage. If they don't engage, the app uses standard thresholds — no degraded experience.

A passive breed setting is also available in the Me tab Settings for users who want to set it directly.

---

### What Changes in the Code

- `getWalkVerdict(weatherData, breedCategory)` — extend the existing shared function to accept a breed category parameter and return adjusted verdicts
- `renderWeather(data, breedCategory)` — pass breed category into hazard threshold logic
- Paw safety thresholds remain the same for all breeds (pavement temperature affects all paws equally)
- Add breed selector to Me tab Settings section: a compact list of common breeds with a search/filter, mapped to the four internal categories on selection
- The contextual prompt component (first-time hazard trigger) is a new small UI element

**Estimated effort:** Low-Medium. The threshold logic changes are straightforward once `getWalkVerdict()` is refactored to accept a breed parameter. The breed selector UI in the Me tab is the most time-consuming element.

---

### Recommended Sprint: Sprint 6 (Post-Core Stabilisation)

Do not build until Sprints 1–5 are complete and the core experience is stable. The breed personalisation layer only makes sense on top of a well-functioning weather + walk experience. Sprint 6 gives the Developer time to implement the full weather tab correctly (including UV index, pollen, heat index logic) before layering in breed-specific threshold adjustments.

**Designer action required:** Design the breed selector component (Me tab) and the contextual first-hazard prompt. These are new UI elements not covered in the current spec.

---

## Copy Review — Assessment and Approved Recommendations

### Tone of Voice — Is It Right?

**Yes.** The Monzo/Citymapper benchmark is exactly correct for Sniffout. Clear, warm, occasionally dry, never gushing. Treats the user as an adult. Gets to the point. The copy reviewer has correctly identified that the current live app sounds like technical documentation with emoji sprinkled on top — functional, impersonal, and inconsistent. The proposed direction fixes this without overcorrecting into forced quirk.

The key principle the reviewer establishes — and which should govern all future copy decisions — is: **write like a friend who knows dogs and the outdoors, not like a weather service or a directory.** This is the right brief.

---

### Tagline — Decision

**POC tagline: `Discover great walks` — owner confirmed. Use this for now.**

The copy reviewer's revised proposal "Dog walks, done properly." is strong and worth keeping in mind for post-POC when the brand is more established. It's quietly confident, British in register, and implies a standard the alternatives haven't met. But for the POC, simplicity wins. "Discover great walks" is clear, direct, and sets the right expectation — walk discovery first.

This is a deliberate POC-phase pragmatic call, not a permanent brand decision. Revisit after user feedback from v2.

---

### What to Implement — Approved Copy Changes

All the following are approved for implementation in sniffout-v2.html. The Developer should not hardcode any string that isn't on this approved list.

**Metadata (handled in `<head>` of v2)**
- Page title: `Sniffout — Dog walks & weather for the UK` *(approved)*
- Meta description: `Discover 50+ handpicked UK dog walks with live weather checks, paw safety alerts and nearby dog-friendly spots.` *(approved — "Free, no sign-up." removed)*
- OG title: `Sniffout — Dog walks & weather, sorted` *(approved)*

**Navigation labels**
- Today · Weather · Walks · Nearby · Me *(approved)*

**Tagline**
- `Discover great walks` *(approved — POC phase. "Dog walks, done properly." held for post-POC consideration.)*

**Home screen / State A**
- Headline: `Discover great walks` *(approved — owner confirmed directly. Overrides copy reviewer's `Find your next great walk.`)*
- Subline: `Handpicked walks. Live conditions.` *(approved — copy reviewer's revised version, with "No account." removed per owner instruction as this will change in future)*
- Body: `50+ handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots.` *(approved — "Free, no sign-up." removed)*
- Social proof strip: `50+ handpicked UK walks · Works offline · Dog-specific routes` *(updated — "Free · No account needed" removed; replaced with factual, durable claims)*
- Helper text: `Enter any UK postcode, town or landmark to see what's near you.` *(approved)*
- Search error: `We couldn't find that — try a postcode (e.g. SW11) or a place name.` *(approved)*

**Onboarding overlay**
- Title: ⏳ **Still needs work** — copy reviewer's revised `Good walks for you and your dog.` is too generic per owner feedback. `Your walks start here.` (the reviewer's alternative) is slightly better but still flat. Copy reviewer to take another pass — needs to feel specific to Sniffout, not interchangeable with any walk app. Should not mention weather.
- Subtitle: `Curated walks, live weather checks and dog-friendly spots — all in one place.` *(approved — "all free, no sign-up needed." removed)*
- Feature 1 — Walk discovery: `50+ handpicked routes` / `Every walk in Sniffout has been chosen by hand — with terrain, livestock and off-lead info included.` *(approved — now leads)*
- Feature 2 — Weather: `Is it safe to walk today?` / `We check rain, temperature and paw safety so you know before you leave.` *(approved — moved to second position)*
- Feature 3: `Save walks you love` / `Heart any walk to save it. Your saved walks live in the Me tab.` *(approved)*
- Feature 4: `Dog-friendly places nearby` / `Pubs, cafes and parks that actually welcome dogs — near wherever you're walking.` *(approved)*
- CTA button: `Start exploring` *(approved)*

**Weather verdict strings (all 10 — highest priority copy in the app)**
- Perfect: `🌤️ Lovely walking weather` / `[X]°C and [condition]. About as good as it gets — get out there.`
- Good + high UV: `☀️ Good walking — strong UV` / `Lovely out, but UV is [X]. Walk in the shade where you can, and press your hand on the pavement before you start — if it's too hot to hold for 7 seconds, it's too hot for paws.`
- Rain arriving soon: `🌂 Dry for now — rain arriving` / `Good window right now, but heavy rain is forecast within 3 hours. If you're going, go soon.`
- Rain likely: `🌧️ Showers on the way` / `Dry now, but worth a jacket. A shorter walk while the window's open.`
- Rain: `☔ It's raining — but walkable` / `Not ideal, but fine if you're dressed for it. Stick to shorter routes and dry off your dog when you're back.`
- Rain + cold: `🥶 Wet and cold — make it a quick one` / `Rain plus cold is hard going. A short loop is fine, but wrap up and don't hang about.`
- Cold: `❄️ Brisk walk day` / `Feels like [X]°C. Fine for a quick outing — just watch for ice on paths, and rinse paws when you're home if there's been gritting.`
- Fog: `🌁 Foggy out there` / `Stick to familiar routes and keep your dog close. Low visibility means less reaction time for drivers on lanes and bridleways.`
- Hot: `🌡️ Warm today — timing matters` / `At this temperature, pavement can get hot enough to burn paws. Walk in the morning or evening, bring water, and do the 7-second test before setting off.`
- Storm/very windy: `⛈️ Not a walk day` / `There's a thunderstorm. Stay in — your dog would rather be safe than soggy.`
- Very windy: `💨 Too gusty to be out` / `Gusts of [X] km/h today — enough to cause problems on exposed routes. Worth waiting for it to ease.`

**Hazard warning titles**
- Extreme heat: `🌡️ Too hot to walk safely`
- Hot: `☀️ Hot enough to hurt paws`
- Thunderstorm: `⛈️ Thunderstorm warning — stay inside`
- Dangerous gusts: `💨 Dangerous winds — don't go out`
- Strong gusts: `💨 Very gusty — choose sheltered routes`
- Dangerous cold: `🧊 Very cold — brief outings only`
- Freezing: `❄️ Freezing — watch for grit and ice`
- High UV: `🔆 Strong UV — pale and thin-coated dogs at risk`

**Paw safety block**
- Safe: `Paws safe at [X]°C`
- Caution: `Paw check needed`
- Danger: `Too hot for paws`
- Body (safe): `At [X]°C, pavement is fine. If it gets above 25°C, press your hand on the tarmac — if you can't hold it for 7 seconds, it's too hot for your dog's paws.`

**Walk window**
- Title: `Best time to walk today`
- Good: `Best window today: [time] · [X]°C · [X]% chance of rain`
- Poor: `Best option today: [time] — but still [X]% chance of rain. Take a coat.`

**Walks tab**
- Filter empty state: `Nothing matching those filters right now. Show all walks →`
- Contribution banner title: `[X] walks reviewed by people near you`
- Contribution banner body: `Rate a walk you know — it helps everyone find the good ones.`
- Submit walk form title: `Know a good walk near here?`
- Sniffout Pick explainer: `Walks marked as community picks have been submitted by Sniffout users. Add yours below.`
- First review nudge: `No reviews yet — be the first.`
- Share walk button: `Share this walk` *(no paw emoji)*
- Weather suitability banner: `Breezy today — showing sheltered woodland routes first` *(keep as-is, it's good)*

**Me tab**
- Profile sub: `Your walks, saved locally`
- Sign-in banner title: `Your data stays on your phone`
- Sign-in banner body: `Your favourites and reviews are saved on this device. Sync across devices is coming.`
- Favourites empty: `Heart any walk to save it here.`
- Reviews empty: `Rate a walk you've tried — it'll show up here.`
- Recommendations empty: `Add a walk from the Walks tab and it'll appear here.`
- History placeholder: `Full review history is coming.`
- Greeting: `Hi, [name] 👋` with stats sub-line (`[X walks saved · X reviews]`), not "Welcome back"
- Stats labels: `Saved walks` / `Walks explored` *("Favourited" as a verb is removed)*

**PWA install card**
- Title: `Save Sniffout to your phone`
- Sub: `Works offline. Loads in a second. No app store.`
- Button: `Save`

**Walk detail**
- Section title: `About this walk`

**Nearby/Places tab**
- Empty state: `Nothing found nearby` / `No dog-friendly places in range. Try widening your search, or check Google Maps.`
- Error state: `Places didn't load` / `Something went wrong. Try again, or check Google Maps for now.`

**Loading state**
- `Getting your weather…`

**Hazard card body (mockup)**
- `[X] mph gusts on exposed routes. Woodland walks are the better call today.`

**Desktop screen**
- Keep: `Sniffout is built for walks, not desks.`
- Update body: `Open it on your phone to find what's worth walking near you.`
- Remove: "Coming soon on desktop" tag — replace with `Mobile only (for now)` or remove entirely

**Seasonal tip (adder example)**
- Body: `Keep dogs on marked paths in heathland and moorland. Adders will usually move away — but if disturbed, they bite. Most incidents happen when dogs sniff around undergrowth.`

**Rain section summaries**
- `<strong>Looks dry</strong> for the rest of today`
- `<strong>Mostly dry</strong> — light showers possible. Worth a jacket.`
- `<strong>Brief showers</strong> — about [X] hour. The dry windows are worth planning around.`
- `<strong>Wet afternoon</strong> — [X] hours of rain, up to [X]mm forecast. Best to walk early.`

---

### Pushbacks and Refinements

**1. "Effort" vs "Difficulty" on walk detail — minor pushback**
The reviewer suggests renaming the detail label from "Difficulty" to "Effort" as a warmer alternative. I'd keep "Difficulty." It's the industry standard across AllTrails, Walkiees, OS Maps, and every walk app in the competitive landscape. Users will scan it immediately. "Effort" introduces a small moment of confusion ("effort for who? my dog or me?"). This is low stakes but the convention exists for good reason.

**2. Remove all "free" and "no sign-up / no account" copy**
Do not use "free", "no sign-up", "no account", or "no login" in any user-facing copy. These are the current product stance, not permanent promises — advertising them now only creates a problem if either changes in future. This applies to all surfaces: tagline, home screen, onboarding, metadata, social proof strips, Me tab, and PWA install card.

**3. "You found it." onboarding title — reject**
The reviewer offers "You found it." as an alternative onboarding title. It's too oblique for a first-time user who doesn't yet understand what they've found. "Walks worth the weather." is the better call — it's distinctive, hints at the weather integration, and is confident without being cryptic.

**4. Paw emoji frequency — implement the restriction**
The reviewer correctly identifies the paw emoji (🐾) as significantly overused throughout the current app. In v2, reserve it for the paw safety section specifically. It should not appear on: loading states, contribution banners, share buttons, submit forms, or onboarding cards. Used sparingly, it earns meaning. Used everywhere, it becomes visual noise.

**5. Rain section punctuation (em dash)**
The reviewer flags dashes throughout. All instances should use em dashes (—) not hyphens or en dashes. This is a Developer implementation detail — do a search-and-replace pass when implementing copy.

---

### Designer Flags from Copy Review

- The tagline `Every walk, safely.` and subheadline `Great walks. Safe conditions. No fuss.` need to be incorporated into the State A design (home screen, no location). Designer should update the hero section spec to reflect the approved headline/body.
- The onboarding overlay title changes to `Walks worth the weather.` — update the overlay design component.
- The greeting card on the Me tab changes from `Hi, [name]! / Welcome back` to `Hi, [name] 👋 / [X walks saved · X reviews]` — Designer to update the Me tab spec accordingly.
- Paw emoji restriction applies to all designed components. Review the mockup/spec for any 🐾 usage outside of the paw safety block and remove.

---

## Adding Dog Character to the Design

**Observation:** The mockup design is clean and well-executed but feels generic — it could be a food discovery app or a venue finder. It doesn't immediately read as a dog app. The constraint is that we don't want to change the overall design direction (typography, layout, colour system, card structure are all approved). The question is: where can we add targeted, tasteful dog character without undermining the premium feel?

The answer is small, purposeful accents in specific moments — not a wholesale redesign. The goal is that someone opening the app for the first time immediately knows it's for dogs, without being hit over the head with paw prints everywhere.

### Recommendations

**1. Wordmark — add a small nose or paw motif (Designer action)**

The "sniffout" wordmark in Inter 700 is clean but anonymous. A minimal addition — a small filled dog nose (•᷄‸•᷅ style, simplified to a geometric shape) or a tiny paw glyph after or within the wordmark — would instantly anchor the brand identity to dogs. This should be subtle: 14–16px, same brand green as the text, not an emoji. Think of how Spotify has the soundwave curves integrated into its wordmark — small, purposeful, not decorative.

This applies to: the wordmark in the top-left of every tab, the splash/State A screen, the desktop coming-soon screen, and any share card or PWA icon usage.

**2. App icon / PWA icon — verify and strengthen**

The existing icon files (`icon-192.png`, `icon-512.png`) already exist but their design hasn't been referenced in the spec. If they don't clearly read as a dog/paw app at 192×192, they should be updated for v2 — this is a home screen icon and the first visual impression when installed. A paw print on brand green is the obvious and correct direction. Should be clean and geometric, not clipart.

**3. Empty states — dog illustration, done properly**

The design spec already calls for "simple line art of a dog and a tree" on the walks tab empty state. This is the right instinct. The brief for the Developer/Designer: these illustrations should have genuine character — a specific dog silhouette, not a generic paw or cartoon dog. Think the style of Monzo's empty state illustrations: minimal, one or two colours, slightly expressive. These are moments where the app has nothing to show and they're currently a risk of feeling dead. A well-drawn dog sitting next to a signpost or looking at a map is a chance to make the app feel alive and specific.

Empty states that should have dog illustration treatment:
- Walks tab (no results / no location set)
- Me tab favourites (no saved walks yet)
- Nearby tab (no venues found)

**4. Paw print — used in exactly one functional place**

The copy review correctly flagged that the paw emoji (🐾) is overused in the live app. In v2, reserve it for the paw safety block only — where it earns its place because the content is literally about paw health. Using it elsewhere dilutes this.

However, a single decorative paw print could work as a very subtle background watermark on the Today tab weather hero card — extremely low opacity (4–6%), in white, positioned bottom-right of the card. This gives the card a faint dog texture without competing with the weather data. This is optional and should only be implemented if it looks right in context.

**5. Walk card badge — "Sniffout Pick" visual treatment**

The curated walk badge (`Sniffout Pick`) is the main moment where Sniffout's brand appears on the content. The badge design could incorporate a tiny nose or paw as part of the badge icon — similar to how Airbnb's "Superhost" badge uses a small house icon. A small, filled paw or nose mark (8×8px) before the "Sniffout Pick" text inside the pill would add dog identity to every curated walk card without changing the card layout.

**6. Onboarding feature card icons**

The onboarding overlay has four feature cards, each with a title and description. Currently no icons are specified. Simple line-art icons for each feature — drawn in the same style and brand green — would add visual warmth and dog specificity:
- Walk discovery: a dog lead or pawprint trail
- Weather: a cloud with a small paw inside (replaces generic weather icon)
- Favourites: a heart (already implied in copy, could use the heart)
- Nearby places: a location pin with a small paw or bone — or just the standard location pin

These should be SVGs, drawn consistently, at around 32px. Not emoji. Not stock icons.

**7. Language does a lot of the work**

Several of the approved copy strings already do this well — "dry off your dog when you're back," "your dog would rather be safe than soggy," "keep your dog close." Consistently writing for the dog as well as the owner is the cheapest and most effective way to make the app feel dog-specific. The copy reviewer and Developer should maintain this in every string.

### What Not to Do

- Do not add paw prints as section dividers, background patterns, or decorative elements throughout the app — this tips into the "generic dog app" aesthetic we're trying to avoid
- Do not use dog cartoon illustrations on the main content screens (walk cards, weather tab) — the photography and data should do the visual work there
- Do not add dog emoji liberally — same note as the paw emoji: used once, it earns meaning; used everywhere, it becomes noise
- Do not change the colour scheme, typography, card styles, or layout — the design direction is approved

### Summary — Designer Actions

| Element | Action | Priority |
|---------|--------|---------|
| Wordmark | Design a small nose/paw accent for the "sniffout" wordmark | High |
| App icon | Review and update if not already a clean paw-on-green design | High |
| Empty state illustrations | Brief and design dog line-art for 3 empty states | Medium |
| Onboarding feature icons | Design 4 small SVG icons in brand style | Medium |
| Walk card Sniffout Pick badge | Add tiny paw/nose element to badge design | Low |
| Weather hero card watermark | Test subtle paw watermark at ~5% opacity — implement only if it works | Low |

---

## Open Questions to Resolve Before Developer Starts

1. **sniffout-v2.html starting point**: Developer to create `sniffout-v2.html` as the new working file. Do not copy-paste the live file as a starting point without explicit PO sign-off — v2 is a redesign, not a patch.
2. **Image sourcing ownership**: ⏳ Still unassigned. Walk cards should use a solid brand-green (`#1E4D3A`) placeholder background until real photos are sourced — not a grey box, not a broken image. Sprint 2 is not blocked by this, but photos need an owner.
3. **Copy — mostly approved, one item outstanding**: All copy strings are approved except the onboarding overlay title (deferred anyway — onboarding overlay is out of scope for current sprint). See developer-questions.md for full copy decisions.
4. **Walk schema — signed off**: Confirmed in developer-questions.md. `isPushchairFriendly` removed. `source: "curated" | "places"` added for hybrid content model. Developer can proceed.
5. **Today tab State A preview section — fix required**: Current mockup shows greyed-out preview cards under "WHAT YOU'LL GET" that read as broken content rather than a deliberate teaser. Developer to implement warmer card treatment (brand-green tint background, not grey) as Option A, or simplify to a three-line value proposition list as Option B if Option A still reads poorly. See developer-questions.md for full brief. Also remove "No account." from the subline.
6. **Designer actions before Sprint 1**: (a) Wordmark with small nose/paw accent. (b) App icon review/update. (c) Update State A subline to `Handpicked walks. Live conditions.` and social proof strip to `50+ handpicked UK walks · Works offline · Dog-specific routes`. (d) Improve Today tab State A walk preview card warmth (use `rgba(30,77,58,0.05)` background, not grey — Option A approved). (e) Update Me tab greeting card. (f) Remove paw emoji from all non-paw-safety components. (g) Hybrid content model: add Sniffout Pick badge spec with paw element. (h) Remove all instances of "free", "no sign-up", and "no account" from any designed screens.
7. **Designer actions before Sprint 2**: Empty state dog illustrations (3 screens: Walks tab, Me tab favourites, Nearby tab). Brief: minimal line art, specific dog silhouette with character, brand green only or brand green + ink.
