# Sniffout — Product Owner Action Plan
*Reviewed: March 2026. Covers competitor-research.md, demand-validation.md, feature-recommendations.md, design-brief.md, design-spec.md. Updated following mockup review session.*

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
- **Free**: No monetisation introduced anywhere. Confirmed.
- **No login**: Respected throughout. The Me tab, community tab deferral, and login analysis all honour this.
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

### Immediate (before Developer starts any code)

1. **Lock the WALKS_DB schema** — the new field definitions in the design spec (`offLead`, `livestock`, `hasStiles`, `hasParking`, `terrain`, `imageUrl`, `badge`, `distance` as number, `duration` as minutes integer, `rating`, `reviewCount`) should be finalised now. Everything downstream depends on this.
2. **Start photo sourcing in parallel** — begin collecting representative UK countryside photos (Unsplash, Wikimedia Commons) for the 50+ existing walks. This is a content task that can run independently. No blocker on engineering.
3. **Schedule copy review session** — before any microcopy is hardcoded. One focused session is enough.

### Developer Sprint 1 — Visual Foundation

These changes transform the entire app's feel and are largely CSS/token updates:

1. **CSS token swap** — implement the full colour token set (light + dark mode) from the design spec. Replace all existing glassmorphic variables.
2. **Font swap** — load Inter (weights 400/500/600/700 only) via Google Fonts CDN. Replace Fraunces and DM Sans.
3. **Bottom navigation redesign** — filled/outlined active states, new labels (Today, Weather, Walks, Nearby, Me), safe area inset handling, correct border.
4. **Card base styles** — border-radius 16px, `1px solid var(--border)`, no glassmorphism, white surface on warm background.
5. **Filter chip styles** — inactive/active states per spec. Used across Walks and Nearby tabs.
6. **Segmented toggle styles** — List/Map control.

### Developer Sprint 2 — Walk Cards and Data

1. **Update WALKS_DB schema** — add all new fields to each existing walk entry. This is the prerequisite for everything else.
2. **Walk card redesign** — photo area (180px, lazy loading, solid green placeholder), badge pill (bottom-left overlay), heart icon (top-right), metadata row, tag chips row. This is the highest-visibility element in the app.
3. **Paw safety indicator** (Weather tab) — always-visible block with traffic-light border colour, 7-second test reference, thresholds (<20°C / 20–25°C / 25°C+). Fast to implement, high differentiation value.
4. **Livestock and off-lead tags on walk cards** — render from the new WALKS_DB fields. Simple once schema is in place.

### Developer Sprint 3 — Today Tab (New Feature)

This is the most significant new feature and deserves its own focused sprint:

1. **State A** — no location: hero section with geolocation-first approach, search as fallback, preview cards, social proof strip. Geolocation auto-attempted on load.
2. **State B** — location known: weather hero card (solid brand green, verdict string, condition pills), hazard card (conditional, amber), horizontal walk scroll (nearest 5–8 walks), seasonal tip (conditional, date-driven).
3. **getWalkVerdict()** — shared pure function used by both Today and Weather tabs. Six verdict values per spec.
4. **SEASONAL_TIPS** — static lookup constant. Simple date comparison.

### Developer Sprint 4 — Weather Tab and Walks Tab Enhancements

1. **Weather tab redesign** — conditions grid (drop visibility; retain temp/feels-like/rain/wind/UV/sunrise; humidity feeds hazard logic not grid), paw safety block (always shown, using updated heuristic: temp > 22°C AND uv_index > 5 AND time 10am–6pm), hazard cards (conditional), best walk window hourly bar, 3-day forecast cards.
2. **Add UV index to Open-Meteo API call** — `uv_index` is not currently fetched. Must be added to the `fetchWeather()` parameters before any UV-dependent logic can work.
3. **Update hazard logic for precipitation type** — use WMO weather codes to differentiate snow (ice balls, rock salt advice) and freezing rain (slip risk) from standard rain warnings.
4. **getBestWalkWindows()** — pure function scanning Open-Meteo hourly data. ~30 lines.
5. **Pollen card** — Open-Meteo `european_aqi` API call (grass, birch, alder pollen). Render pollen level (low/moderate/high) as a hazard card on Weather tab. Bubble to Today tab hazard card on High days only. No new API key required.
4. **Filter chip logic on Walks tab** — off-lead, no livestock, terrain, distance range filters. Depends on Sprint 2 schema.
5. **Radius selector** — "Within X miles ▾" inline control on Walks and Nearby tabs. Options as chips (1 / 3 / 5 / 10 mi), stored to `localStorage: sniffout_radius`. Replaces existing hidden `searchRadiusKm` global.
6. **Weather suitability banner on Walks tab** — derived from session weather, modifies walk sort order. Thin amber-tinted strip, one line of text.
7. **Walk detail overlay** — fixed/inset overlay, slide-up animation, body scroll lock, bottom nav hide, back button, hero image with scrim, practical details grid, embedded map, nearby venues section (top 3 from existing `fetchPlaces()`), share button (Web Share API).

### Developer Sprint 5 — Quick Wins and Me Tab Polish

1. **Share walk button** — Web Share API, 5 lines. Add to walk detail overlay. (Could be done in Sprint 4.)
2. **Me tab redesign** — greeting card, stats row (favourited count, explored count — no streak), favourites horizontal scroll, settings rows (units, dark mode override), "Clear all data" with inline confirmation.
3. **Nearby tab visual polish** — apply new card styles, chip styles, toggle. The tab is largely functional; this is primarily visual.

### Validator Agent — When to Run

- After Sprint 1: visual regression check on all 5 tabs (existing functionality intact, new styles applied correctly, dark mode working).
- After Sprint 2: walk card rendering across different screen sizes, lazy image loading behaviour, new WALKS_DB fields populated correctly.
- After Sprint 3: Today tab both states, geolocation granted / denied / blocked, session restore behaviour, transition from State A to State B.
- After Sprint 4: weather verdict logic, paw safety thresholds, filter chip combinations, walk detail overlay on iOS Safari (scroll lock, safe area insets, back navigation).

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

## Open Questions to Resolve Before Developer Starts

1. **Image sourcing ownership**: Who is responsible for sourcing walk photos? This needs to be assigned before Sprint 2 begins, or walk cards will ship without images.
2. **Copy review**: Confirm timing of the dedicated copy session. Ideally completed before Sprint 3 (Today tab) since the hero headline and verdict strings live there.
3. **Walk schema sign-off**: The PO should review and approve the WALKS_DB field additions (including the new `source` field for hybrid content) before the Developer implements them. Once the schema is locked and 50 entries are updated, changing it is expensive.
4. **Hybrid content model badge spec**: Designer to add Sniffout Pick / Nearby badge treatment to the walk card spec before Sprint 2 begins.
