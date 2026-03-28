# Sniffout - Session Handoff Note
**Date:** 27 March 2026 (evening)
**Prepared by:** Claude (PO)
**Purpose:** Complete context handoff for the next session.

---

## SECTION 1 - WHAT WAS DONE TODAY (EVENING SESSION)

All changes pushed and live unless noted.

### Validator round
- 5 of 6 checks passed
- CHECK 6 FAIL: Cloudflare Worker referer check was missing - now fixed

### Refactoring round
- Dead function yrIcon removed (lines 6164-6171)
- 32 global var constants converted to const
- 92 mutable var state variables correctly left as var

### Today tab hero card - full redesign
- Card always brand green - gradient shifts subtly by state (approved lighter, avoid darker)
- Radial glow top-left, inset borders for depth
- Temperature: 56px, weight 800, tracking -3.5px, line-height 0.95
- Weather icon: large watermark 160px, opacity 0.85, top-right, no mask, sits above text
- Verdict title: 23px, weight 700, no preceding icon (removed)
- Best window line: clock icon + dynamic text from getBestWindowTime() - 5th param added to renderTodayStateB
- Alert pill: caution = amber "Challenging conditions", avoid = coral "Severe weather"
- Pills row: rain chance % (next 12h max precipitation_probability) replaces humidity, wind, sunrise/sunset
- Smart sun pill: pre-noon shows today sunrise, post-noon shows today sunset, post-sunset shows tomorrow sunrise
- Full forecast: quiet footer row below hairline divider, not a pill
- Info button: removed entirely from HTML, JS, and CSS
- heroClass variable removed - modifier classes now gradient-only
- Sunrise/sunset row added to Weather tab between tiles and 5-day forecast
- renderTodayStateB now takes 5 params: (cur, verdict, hazards, daily, hourly)

### Quick wins
- Cloudflare Worker: inbound referer check added - returns 403 for non-sniffout.app requests
- Open/closed venue status: recalculated live from regularOpeningHours.periods via isVenueOpenNow() - no longer stale from cache
- OS Maps: Leisure_3857 replaced with Outdoor_3857 (Web Mercator, free OpenData, shows footpaths/rights of way). OS confirmed Leisure not available in Web Mercator - ticket closed.
- Green spaces cache key bumped from 'gs|' to 'gs2|' to force fresh fetch

### Nearby tab - green spaces
- Playgrounds, sports grounds, leisure centres etc excluded via EXCLUDE_NAMES and primaryType filter

### Walks map
- Standard/OS Map toggle added to Walks tab map view - see Section 2, incomplete
- Empty state "No walks match your filters" converted from blocking centred overlay to small pill at bottom of map

### Cloudflare cache purged end of session

---

## SECTION 2 - KNOWN ISSUES / IN PROGRESS

### Walks map style toggle - INCOMPLETE - do not touch until next session
The Standard/OS Map toggle on the Walks tab map view is not rendering correctly. Multiple fix attempts during the session made it worse. Paused deliberately.

Current DOM state (correct):
- Element: walks-map-style-row
- Parent: tab-walks
- Position: between walks-content and walks-map-container
- Class: map-style-row
- Style: display:none

The show/hide JS in setWalksView is not displaying the row correctly when map view is active. Compare against setNearbyView for the correct pattern. The nearby tab toggle works correctly and is the reference.

Rule for next session: do not attempt incremental fixes. Fresh look only. Designer to confirm correct visual treatment before any code changes.

### Green spaces playground exclusion - verify on next session
Task 3 from the batch brief (playground exclusion + gs2 cache key) may not have fully landed. On next session run:

grep -n "playground\|gs2" ~/Desktop/my-first-repo/sniffout-v2.html | head -10

Expected: playground in EXCLUDE_NAMES and gs2 as cache key prefix. If not present, re-apply Task 3.

---

## SECTION 3 - BACKLOG

- Walks map style toggle - see Section 2. Fresh look next session, Designer first
- Green space card placeholder image - OSM results have no photo. Add illustrated fallback consistent with walk card style. Designer brief needed first
- Pubs/restaurants Nearby tab (FIX 23.2) - reverted, needs scoping before re-adding
- B2 beforeunload handler - deferred, needs careful device testing
- Mutable global var to let - separate pass, lower priority
- Proxy-level Cloudflare caching improvements - carry-over

---

## SECTION 4 - BILLING

- Today's total: approximately £0.50 (owner testing only)
- Breakdown: £0.14 photos + £0.36 Text Search
- Mitigations in place: 24h cache, lazy photos, maxResultCount 10, Cloudflare proxy caching
- At 100 real users/day: estimated £3-8/day

---

## SECTION 5 - OWNER ACTIONS OUTSTANDING

- Companies House registration (£100, 15 min, online)
- ICO registration (£52, ico.org.uk)
- Solicitor engagement - Sprintlaw or LawBite (£600-1,500) - blocks L5 T&C consent screen
- Trade mark application for Sniffout (£170, one class)

---

## SECTION 6 - HARD GO-LIVE BLOCKERS

| Blocker | Status |
|---------|--------|
| L5 - T&C consent screen | Needs solicitor first |
| T12 - Pen test | Not started |
| T16 - Full end-to-end test pass | Not started |
| T17 - Firebase security review | Not started |

---

## SECTION 7 - PHASE 3

Firebase migration is the next major milestone. Full spec written, all 12 owner decisions confirmed. Not started. Deferred until go-live blockers resolved.

---

## SECTION 8 - QUICK REFERENCE

- Green spaces cache key is now 'gs2|' - old 'gs|' entries will not be read
- isVenueOpenNow() - new helper, calculates open/closed live from openingHours.periods
- renderTodayStateB - 5 params: (cur, verdict, hazards, daily, hourly). Call site around line 7400
- FIREBASE_WRITE_ENABLED = false - do not enable until Phase 3
- extractPlaceId() - do not remove or modify
- Cloudflare Worker referer check - live, returns 403 for non-sniffout.app requests
- OS Maps - Outdoor_3857, free OpenData, unlimited tile requests
- Weather tab sunrise/sunset - .wx-sun-row between .wx-tiles and 5-day forecast
- Cloudflare cache - purged end of session

---

## SECTION 9 - BILLING FORECAST

### March 2026 full month
- Total to date: £85.27
- Breakdown: £53.67 photos (10,370 calls) + £31.60 Text Search (1,221 calls)
- Note: the majority of this is from the £69.87 spike on ~21-22 March before mitigations were in place. Post-mitigation costs collapsed to near zero.

### Today (27 March 2026)
- Total: £0.63 (may update overnight)
- Breakdown: £0.14 photos + £0.49 Text Search
- Context: heavy owner testing day - multiple cache clears, location changes, deliberate Nearby tab usage. Not representative of real user behaviour.

### Real user forecast
Based on today's cost profile and caching behaviour:

| Users/day | Estimated cost/day | Notes |
|-----------|-------------------|-------|
| 100 | £1-3 | Assumes 24h cache, ~20-30% cold load rate |
| 500 | £5-15 | Volume discounts begin applying |
| 1,000 | £10-30 | Google automatic volume discounts apply |
| 10,000 | £50-150 | Enterprise pricing discussion warranted |

Key assumptions:
- 24h Nearby cache working correctly - repeat visits within 24h cost £0 for Text Search
- Lazy photo loading via IntersectionObserver - only cards entering viewport trigger photo calls
- Average user views 5-8 venue cards per Nearby session
- ~20-30% of users per day will have a cold cache (new users or >24h since last visit)

### Metric to watch
Text Search cost per day relative to active user count. If cost scales linearly with users the caching is working correctly. If cost scales faster than users, investigate cache hit rates and consider whether the 24h TTL should be extended further.

---

## SECTION 11 - COMPANION WEBSITE (sniffout.co.uk)

### Overview
sniffout.co.uk is already owned and currently redirects to sniffout.app. This will become a companion SEO website with one dedicated page per walk. The PWA cannot be indexed by Google (single-page app). The companion website does the SEO work and drives installs.

### Why this matters
AllTrails' CEO: "We're able to parlay all the mobile-first SEO traffic into incremental organic app installs, and that's a huge driver of our business." Every walk page ranks permanently for "[location] dog walk" searches at zero ongoing cost once built.

### What to build
- One page per walk targeting "[walk name] dog walk", "[location] dog walk near [landmark]"
- One area index page per region: "best dog walks in [county/city]"
- Seasonal editorial: "best winter dog walks Surrey", "summer dog walks safe in heat"
- Breed-specific guides: "walks for brachycephalic dogs", "easy dog walks for senior dogs"
- Hazard guides: "blue-green algae UK lakes: what dog owners need to know"
- Home page explaining Sniffout with "Open in Sniffout" deep links on every walk page

### Content strategy
All walk descriptions written through the persona content pipeline - same process as walk database entries. New personas needed for the website (see below). Content should feel like genuine first-person walk reports from real people, not marketing copy.

### Photos - the hardest problem
Options in priority order:
1. **Geograph.org.uk** - Creative Commons UK landscape photos searchable by grid reference. Free with attribution. Best immediate solution for all 100 walks
2. **Owner photography** - authentic photos with Luna on local walks. Most on-brand. Prioritise for Kingston/Surrey walks
3. **Micro-influencer swap** - walk documentation photos in exchange for feature placement on the site
4. **Unsplash/Pexels** - generic stock as last resort. Avoid where possible
5. **User-submitted photos** - long-term content model once user base exists

### New personas needed
Current personas (Morag, Deborah, Priya, Pete) were built for walk database descriptions. The companion website needs additional personas that feel like genuine walkers with distinct identities, real opinions, and personal dogs. Brief the Copywriter to develop 4-6 new personas covering different demographics, dog breeds, walking styles, and regions. Each persona needs: name, age, location, dog name and breed, walking style, voice characteristics, verbal tics and tells, things they always mention, things they never say.

Suggested persona types to cover:
- Young professional, city-based, weekend walker, energetic breed
- Retired couple (written from one voice), rural, serious walkers, older dogs
- Parent with young children and a family dog, safety-conscious
- Dog trainer or behaviourist, technical knowledge, off-lead focus
- Someone who has moved from city to countryside, both perspectives
- Outdoor enthusiast, fell walker, mountain breeds

### Implementation approach
- sniffout.co.uk: static HTML website, not a PWA, fully indexable by Google
- Template-driven: one HTML template generates all walk pages from walk database data
- No build tools - consistent with Sniffout's single-file philosophy where practical
- Internal links between walk pages and area pages for SEO authority
- "Open in Sniffout" deep link on every walk page

### Priority
Post-launch, pre-Phase 3. Start persona development and photo sourcing now so content is ready to produce immediately after go-live.

---

## SECTION 12 - TICK HAZARD

### Backlog item - Add tick seasonal hazard to the app

Ticks are a genuine and underserved hazard for UK dog walkers. Add to the existing seasonal hazard system.

**Implementation:**

Step 1 - Add trigger to the seasonal hazard block (around line 6400):
if (month >= 3 && month <= 10) hazards.push('ticks');

This covers March to October - UK tick season, peaking April-June and again in autumn.

Step 2 - Add hazard definition to the builder block (around line 6522), following the exact pattern of existing seasonal hazards:

if (key === 'ticks') {
  hazards.push({ key: 'seasonal', title: 'Tick season', body: 'After walks in woodland, long grass, and heathland, check ' + dogName + ' thoroughly - especially around ears, neck, armpits, and between toes. Remove any ticks promptly with a tick remover tool, twisting out rather than pulling.' });
}

Step 3 - Copywriter pass required before implementation. The body copy above is a working draft. Brief the Copywriter to rewrite in Sniffout tone: informative, dog-first, practical, no em dashes, no exclamation marks. The "twist not pull" instruction must be preserved - it is the most important actionable detail.

**Note:** The hazard system currently triggers by date and weather only - not by terrain type. Ticks are more relevant on woodland and heathland walks than urban ones. This is a known limitation of the current system. A terrain-aware hazard trigger is a future enhancement, not a blocker for this implementation.

### Companion website content opportunity

"Ticks on dogs UK - what to do" is a high-search query. Add a dedicated hazard guide page to the sniffout.co.uk companion website content plan:

- Page: sniffout.co.uk/guides/ticks-on-dogs-uk
- Target queries: "tick on dog UK", "how to remove tick from dog", "tick season UK dogs", "are ticks dangerous for dogs UK"
- Content: seasonal calendar (when tick risk is highest by region), how to check your dog, how to remove safely, when to call a vet, Lyme disease awareness, recommended tick remover tools (affiliate opportunity)
- Affiliate note: tick remover tools and tick prevention treatments (Bravecto, Seresto, Frontline) have affiliate programmes. This page has genuine affiliate revenue potential alongside its SEO value.

---

## SECTION 13 - COMPANION WEBSITE DECISIONS AND NEXT STEPS

### Owner decisions confirmed 27 March 2026

- Mac available - iOS App Store wrapper (Capacitor) is viable. Three-channel launch confirmed: PWA direct, Google Play, App Store.
- Photography: static map crops as primary hero image solution. Geograph.org.uk for walks without owner photography. Owner photography (with Luna) prioritised for Kingston/Surrey walks.
- Timeline: companion website builds BEFORE PWA launch. SEO authority accumulates from publication date - earlier is better.

### What this means for the roadmap

The companion website is now a pre-launch workstream running in parallel with final PWA work. It is not a post-launch nice-to-have.

Priority order for companion website build:
1. Site structure and template (Developer) - static site, Hugo or Astro, walk page template, area index template
2. New Copywriter personas (Copywriter brief needed) - 4-6 new personas for web content, distinct from app personas
3. Walk page content - all 100 walks through the persona content pipeline
4. Static map crop generation for hero images - one per walk, Geograph fallback where needed
5. Schema markup - TouristAttraction + FAQPage schemas in the walk page template
6. Plausible Analytics setup - cookieless, GDPR compliant, no consent banner needed
7. Google Search Console registration - day one of launch
8. App Store assets - screenshots, descriptions, ASO for both stores
9. Capacitor wrapper for iOS App Store submission

### Key technical decisions from research

- URL structure: flat /walks/[slug] at launch, migrate to /walks/[region]/[slug] at 500+ walks with 301 redirects
- Analytics: Plausible (primary, ~$9/month, no cookie consent required) + Google Search Console (free)
- Install page: single unified page at sniffout.co.uk/get with platform detection - iOS sees App Store first, Android sees Play Store first, desktop sees QR code
- Schema: TouristAttraction + FAQPage on all walk pages, built into template not retrofitted
- Filtering: client-side JavaScript only on area index pages - no URL-based filter parameters
- No cookie consent banner needed if using Plausible - important for UK audience

### Walk page content hierarchy (mobile, from research)

1. Walk name (H1)
2. Location chips: County - Area
3. Hero image (static map crop, WebP)
4. Quick stats: Distance - Difficulty - Off-lead status - Terrain
5. Install CTA: "Get live weather for this walk - Open in Sniffout" (above the fold)
6. Dog summary: 2-3 sentences, dog-first
7. Practical info: Parking, transport, facilities
8. Walk description: 150-200 words
9. Seasonal hazard flags
10. Static map with "Open interactive map in Sniffout" link
11. More walks nearby: 3 linked cards
12. Secondary install CTA
13. Area link and related guides

### New Copywriter personas needed

Current app personas (Morag, Deborah, Priya, Pete) are for walk database descriptions. The companion website needs 4-6 additional personas that feel like genuine walkers with real opinions, distinct dog breeds, different UK regions, and personal voices. Brief the Copywriter next session to develop these before content production begins.

Suggested persona types:
- Young professional, city-based, weekend walker, energetic breed
- Retired person, rural, serious walker, older dog
- Parent with young children and a family dog, safety-conscious
- Dog trainer or behaviourist, technical, off-lead focused
- Someone who moved from city to countryside
- Outdoor enthusiast, fell walker, mountain breed

### Monetisation on the companion website

- Affiliate links contextually placed on walk pages (dog insurance on harder walks, tick remover tools on woodland walks, lead/harness on off-lead walks)
- Tick hazard guide page: sniffout.co.uk/guides/ticks-on-dogs-uk - affiliate opportunity for tick remover tools and prevention treatments (Bravecto, Seresto, Frontline)
- Sponsored editorial cap: maximum 1-2 sponsored guide features per quarter once user base established

---

## SECTION 14 - COMPANION WEBSITE DESIGN

### Design direction confirmed 27 March 2026

Owner reviewed and approved mobile and desktop mockups of the companion website walk page. Direction is confirmed.

### Core design principles

- Same brand system as the PWA: Woodland Green #2C4A14, Plus Jakarta Sans, warm off-white #F7F5F0 background
- Feels like a natural companion to the app - a user who knows the app should recognise the website immediately
- Mobile-first. 84% of dog walk searches happen on mobile.
- Content-dense but warm - not a marketing site, a genuinely useful reference

### Mobile walk page layout (confirmed)

- Nav bar with sniffout wordmark and store badges
- Static map crop hero (360px, full width, route traced with dotted line, difficulty and off-lead badges overlaid)
- Walk name H1 + location chips in brand green
- Quick stats as pill chips: distance, terrain type, parkland/coastal/woodland, lead status
- Primary install CTA in brand green above the fold: "Get live weather for this walk" with "Open in Sniffout" white button. Free, no account needed line below.
- Hairline divider
- About this walk: 150-200 words, persona-written
- Practical info: white card with parking, transport, facilities rows
- Secondary CTA: outlined green button "Plan this walk in Sniffout"
- App Store + Google Play badges side by side
- Nearby walks: 2 linked cards on mobile

### Desktop walk page layout (confirmed)

- Full-width nav bar: sniffout wordmark, Walks/Guides/About links, App Store + Google Play badges top right
- Breadcrumb: Walks > London > Walk name
- Two-column layout: map left (fills viewport height), sticky sidebar right (380px)
- Left column: large map with traced route, "Open interactive map in Sniffout" link at bottom of map, walk description, seasonal notes, nearby walks grid (2x2)
- Right sidebar (sticky): walk name + location chips, stats grid (2x2: distance, difficulty, terrain, off-lead status), primary install CTA block (dark green, benefit-forward copy, white button), App Store + Google Play badges, divider, practical info (parking, transport, facilities), "For your dog" green box (dog-specific summary)
- Green footer: sniffout wordmark, nav links, copyright

### Key design decisions

- "For your dog" box: brand green background, dog-specific summary distinct from the general walk description. This is the single biggest visual differentiator from AllTrails and Komoot. Every walk page has one.
- Seasonal notes: amber and green pills below the map showing relevant hazards (deer rut, tick season etc). These pull from the same hazard data as the app.
- Lead status colour coding: off-lead = brand green, on-lead only = amber, partial = neutral
- Install CTA copy: never "Download" or "Install". Always benefit-forward: "Get live weather for this walk" / "Plan this walk in Sniffout"
- App store badges: both shown always, platform detection on the /get install page only

### Next steps for companion website

1. Designer brief: produce full HTML mockup of walk page template (mobile + desktop) based on approved direction
2. Copywriter brief: develop 4-6 new website personas (distinct from app personas)
3. Developer brief: build static site template (Hugo or Astro) with walk page, area index, and guide page templates
4. Content round: all 100 walks through the new persona pipeline
5. Static map crop generation: one per walk (OS Maps static API or Leaflet screenshot)
6. Schema markup: TouristAttraction + FAQPage in template
7. Analytics: Plausible setup + Google Search Console registration on launch day
8. App store assets: screenshots and ASO descriptions for both stores
9. Capacitor wrapper: iOS App Store submission (requires Mac + Xcode - Mac confirmed available)
