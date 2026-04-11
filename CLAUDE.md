# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 File Protection — Read First

**`dog-walk-dashboard.html` is the live production file. Do not touch it under any circumstances.**

All new development happens in **`sniffout-v2.html`** only. Do not use `dog-walk-dashboard.html` as a reference or base for any new code.

- **`sniffout-v2.html`** — active development file for v2
- **`dog-walk-dashboard.html`** — live production, do not modify
- **`sw.js`, `manifest.json`** — modify only when explicitly instructed

## Project Vision

Sniffout is a mobile-first PWA for discovering dog walks across the UK, being validated as a POC before investing in a backend. The product is walk discovery first; weather intelligence is the differentiator, not the lead. Keep it simple - do not add complexity unless explicitly instructed.

The long-term vision is to become the definitive community-driven platform for dog walkers across the UK. The product has three layers:

1. Curated content - handpicked walks, live weather intelligence, dog-friendly places, hazard alerts. This is the foundation being built now.
2. Community layer - users submit walks, rate and review walks and places, content becomes community-driven supplemented by curated editorial. This is Phase 2.
3. Platform - full community walks database, guides and articles, sponsored venue listings, Sniffout+ subscription. Phase 3.

The community features (user-submitted walks, ratings, reviews) are planned but not yet built. Do not implement or reference them as live features until explicitly instructed.

## Competitive Context

Closest competitor is PlayDogs (France/Switzerland, 170k downloads), but it relies on community-generated content so is empty in new regions. Sniffout differentiates with curated content from day one plus live weather integration. No UK competitor combines walk discovery + live weather + dog-specific hazard context in a single no-login product.

## Monetisation Strategy

Researched and validated April 2026. Full research: ~/Desktop/sniffout-website/docs/research/monetisation-research-april-4.md. Summary: ~/Desktop/sniffout-website/docs/monetisation-strategy.md

**Phase 1 - Affiliates (start now, pre-launch):** AWIN application submitted April 11 2026, awaiting approval (1-5 business days). Account type: Publisher / Editorial & Media Sites. Sectors registered: Insurance, Pets & Pet Care, Hotels & Accommodation. On approval, apply in order: (1) Everypaw Pet Insurance (~£20 CPA), (2) tails.com, (3) VioVet, (4) Booking.com. First placement: heatstroke guide contextual link. Join Amazon Associates UK (approximately 8% pet category - verify in Associates Central). Join Webgains (Rover UK - 15% per sale). Pet insurance CPAs £20-40/sale - highest-value category. Target 2,000-3,000 monthly visitors to monetised guides for self-sufficiency. New opportunity: dog-friendly accommodation affiliates on walk pages (Booking.com 3.75-6% per booking, Canopy and Stars, Cool Camping).

**Phase 2 - Sniffout+ subscription (12-18 months post-launch):** £29.99/year or £3.99/month. Launch trigger: 5,000+ MAU with retention. Never paywall existing free features (Komoot backlash lesson - disproportionate and persistent reputation damage). Gate only new features: offline maps, 7-day detailed weather scoring, cross-device sync.

**Phase 3 - Sponsored venue listings (18-24 months post-launch):** £59 + VAT per year per Featured listing. Self-serve model only. Validated by DogFriendly.co.uk (£54.95 Featured, confirmed). Launch only after venues see demonstrable traffic from Nearby tab.

**Hard affiliate rules (locked):** Zero affiliate links on Alabama rot, blue-green algae, cattle, antifreeze articles. Walk pages: maximum 1 contextual link. No links on homepage or install page.

**Infrastructure warning:** Google Maps Platform is primary scaling cost risk. At 50,000 MAU could be £200-600/month for interactive map loads. Mitigation: static map images on walk overview pages; load interactive map on navigate/start walk only.

## Design Principles

Mobile-first, uncluttered, modern and slick. **v2 uses a clean card-based design — glassmorphism has been removed.** Key decisions locked:
- Brand colour: `#2C4A14` (Woodland green)
- Background: `#F4EFE6` (warm linen)
- Typography: Plus Jakarta Sans 400/500/600/700/800 only
- Cards: `border-radius: 16px`, `1px solid var(--border)`, no blur or translucent surfaces
- Dark mode: `body.night` class, toggled manually via Settings ("Auto" option). Not automatic based on weather.
- Me tab primary stat card (`me-stat-card--primary`): number colour is `var(--brand)` in light mode and `#6A9B4A` in dark mode. Secondary stat numbers remain `var(--ink)`.

Nothing gimmicky. Paw emoji (🐾) reserved for paw safety block only.

## Interaction design principles

Tap feedback rule: every tappable element must have consistent tap feedback. Apply `transition: transform 0.15s ease` and `transform: scale(0.97)` on `:active` to all interactive elements. No exceptions. This applies to cards, tiles, rows, chips, pills, buttons, and any other tappable surface. Bottom sheets must use the spring cubic-bezier open animation: `cubic-bezier(0.34, 1.56, 0.64, 1)`. All new interactive elements added in future rounds must include tap feedback.

Verdict strings rule: verdict title strings in getWalkVerdict() must never contain hardcoded emoji. Icons are rendered as separate Lucide elements alongside the verdict title. Personalised short verdict strings (shortTitle) are used when a dog profile exists. Standard title strings are used as fallback when no dog profile is set.

## Deferred — Do Not Implement Without Instruction

Google Places API expansion (already integrated at current scope — do not add new venue categories or API calls), native app, marker clustering plugin, community tab, walk submission, push notifications.

**Firebase note:** Firebase project `sniffout-fe976` is ACTIVE (region `europe-west2`, configured April 10 2026). SDK v10.12.0 via CDN. See Firebase status section below for full auth and Firestore state. Phase 3A is complete. Phase 3B is largely complete (multi-device merge needs on-device testing; email verification required before public launch). GDPR sign-off (L1) is required before any real users can access email sign-in — development and internal testing can proceed without it.

## Hazard Content Rules

These rules are locked. Do not implement hazard content outside these boundaries without PO sign-off.

### Today tab
The Today tab hazard system handles weather-driven hazards only: heat, cold, wind, storm, paw safety, and existing seasonal alerts (blue-green algae, adders, grass seeds, harvest mites, rock salt). Do not add new hazard alerts to the Today tab without explicit PO instruction. The Today tab must never feel overwhelming.

### Walk card hazard pills
A small number of terrain-specific hazard pills may appear on individual walk cards and walk detail pages. Pills are informative only - they help users make their own decisions, they do not warn users away from walks. Maximum 3-4 pills per walk. Most walks will show none.

Approved hazard pills and their conditions:
- Livestock - show if walk.livestock === true (already in WALKS_DB)
- Ticks - show if walk terrain includes woodland or heathland (March-October only)
- Blue-green algae - show if walk passes near still or slow water (May-September, temp gated)
- Adders - show if walk terrain includes heathland or moorland (April-June only)

No other hazard pills are approved. Do not add new pills without PO sign-off.

### Companion website articles
Hazard guide articles on sniffout.co.uk exist primarily for SEO. They are informative editorial content, not in-app features. The following are approved as website articles:
- Ticks
- Heatstroke and hot weather walking
- Alabama rot
- Blue-green algae
- Cattle and dog walkers
- Antifreeze

Antifreeze and cattle are website articles only - they do not appear in the app in any form.

### Tone
All hazard content follows docs/specs/hazard-content-tone-guide.md. Informative, warm, practical. Never alarmist. Never disparaging about specific walks or routes. The user makes their own decisions - Sniffout gives them the information to do so confidently.

## Companion Website (sniffout.co.uk)

The companion website is a Hugo static site in a separate repo: github.com/jayeshfatania/sniffout-website. Auto-deployed to Cloudflare Pages on every push to main.

### URLs
- Live: sniffout-website.pages.dev (baseURL in config.toml)
- Custom domain: sniffout.co.uk — NOT yet connected. Do not change baseURL until the domain is live.

### Design decisions locked
- Typeface: Plus Jakarta Sans sole typeface throughout. Fraunces display serif is permanently rejected.
- Brand colour: #2C4A14 (Woodland Green)
- Second accent: #B85C2C (Sienna) — approved. Applied to header CTA pill, difficulty badges, Sniffout Pick badge.
- Card treatment: overlay style kept. Separated card treatment reviewed and rejected.
- Section labels: low-opacity brand green rgba(44,74,20,0.55)
- Pull quotes: italic, no quotation marks, sienna left border

### Guide article pages
- Fully redesigned — CSS classes use ga- prefix throughout
- Spec at docs/design/guide-article-spec-march-30.md
- Frontmatter supports: pullQuote (rendered as styled pull quote), heroImage, relatedWalks

### Area pages
- 7 area pages live: Surrey, London, New Forest, Yorkshire, Sussex, Lake District, Dartmoor
- Files at content/areas/ (flat structure: e.g. content/areas/surrey.md, not subdirectories)
- Area pills: horizontal scroll on mobile
- Intros written by Saoirse persona (50-80 words each)

### Walk pages
- 14 walk pages live with FAQ blocks and schema.org FAQ markup
- FAQ blocks improve rich result eligibility in Google search

### SEO research
- Content gap analysis at docs/research/seo-content-gap-analysis-april-2.md
- 90-day content calendar in that file
- Top priorities: breed guides, temperature guide, area index pages

### Developer push verification (mandatory)
Every Developer brief for sniffout-website must end with:
```
cd ~/Desktop/sniffout-website && git add . && git commit -m "description" && git push
git log --oneline -3
```
Confirm origin/main matches HEAD before saying the task is complete. This step is mandatory — commits have previously failed to reach GitHub without this check.

### Website personas
Four copywriter personas for all website content. Full specs at ~/Desktop/sniffout-website/docs/copy/website-personas.md.

| Persona | Content type | Word count |
|---------|-------------|------------|
| Ailsa | Walk page descriptions | 150-200 words |
| Tom | Hazard and safety guide articles | 800-1,500 words |
| Saoirse | Area index page introductions | 50-80 words |
| Ravi | Editorial and homepage copy | Varies |

### Content pipeline
Researcher - Copywriter (Tom/Ailsa/Saoirse/Ravi) - Fact Checker (mandatory for all Tom articles) - fixes - Editor - Validator - Developer

Fact Checker is mandatory after every Tom article without exception. Tom writes about hazards that affect dog health — errors have real-world consequences. Fact check reports saved at ~/Desktop/sniffout-website/docs/fact-check/

### Copy rules for website
- No em dashes in any user-facing copy (see Em Dash Rule above)
- No "free", "no account needed", "no sign-up", or "no login" anywhere on the website
- Do not frame the absence of an account as a selling point

## Project Overview

**Sniffout** is a mobile-first PWA for discovering dog walks across the UK. No build step — it's a single HTML file deployed to GitHub Pages at `sniffout.app` via a CNAME. `index.html` redirects to `coming-soon.html` (intentional pre-launch behaviour). Desktop users see a "Coming soon" screen (viewport ≥768px or non-touch device).

## Development

No build tools, no package manager, no test framework. Development is:

1. Edit `sniffout-v2.html` directly (v2 — active development)
2. Open in a browser (or use a local static server: `python3 -m http.server`)
3. Deploy by pushing to `main` — GitHub Pages auto-deploys

`sniffout-v2.html` must be built entirely from scratch. It must not copy or reuse code or structure from `dog-walk-dashboard.html`. The only carry-overs from the original app are:
- The API integrations (Open-Meteo for weather, Google Places for venues, Nominatim/postcodes.io for geocoding) — implemented fresh, same endpoints and API key
- The curated walks data from `WALKS_DB` — content carries over, extended with v2 schema fields

## Process Rules (Developer briefs — website and PWA)

### Browser-verify-first
Any CSS visual change must be tested live in the browser using JavaScript before a Developer brief is written. Use the browser console to apply the change and confirm it looks correct before writing any brief. No briefs based on assumptions about how a rule will render.

### One CSS change per brief
Write one CSS change per Developer brief. This makes it trivial to diagnose what went wrong if something breaks and trivial to rollback. Multiple CSS changes in one brief make root-cause analysis harder.

### Rollback preference
When multiple things break, prefer rollback to the last known good state over fixing forward. Fixing forward compounds complexity. Roll back, confirm the baseline, then re-apply changes one at a time.

### Grep before writing CSS rules
Always confirm the current state of a CSS rule by searching the file before writing a new rule. Do not write rules based on what the last brief said - the file may have changed.

### Website CSS discipline
When working on the sniffout-website Hugo project, always grep `themes/sniffout/static/css/main.css` before writing any CSS rule to confirm the exact current selector, value, and line context. Conflicting rules and media query overrides are the most common source of visual bugs.

## Architecture

Everything lives in `sniffout-v2.html`: inline CSS in `<style>`, inline JS in `<script>`, and all HTML. No modules, no bundler.

**Other files:**
- `sw.js` — service worker (network-first, cache fallback, cache key `sniffout-v2`)
- `manifest.json` — PWA manifest
- `CNAME` — custom domain (`sniffout.app`)

### Navigation

Tab-based, no URL routing. Five tabs: **today · weather · walks · nearby · me**. Active tab stored in `localStorage` (`sniffout_active_tab`). `showTab(tab)` switches views. Bottom nav uses inline SVG icons with filled (active) and outlined (inactive) variants — not emoji.

### State

All state is in-memory globals + `localStorage`. Key storage:

| Key | Contents |
|-----|----------|
| `sniffout_session` | `{location, weather, timestamp}` — expires after 8h |
| `sniffout_active_tab` | last active tab |
| `sniffout_favs` | array of favourited walk IDs (Sniffed and approved) |
| `sniffout_wishlist` | array of walk IDs saved for later (On my sniff list) |
| `sniffout_saved_places` | array of saved nearby place IDs |
| `sniffout_place_favs` | nearby place favourites (Nearby tab write path) |
| `sniffout_username` | user's display name |
| `sniffout_radius` | search radius in miles (1/3/5/10) |
| `sniffout_explored` | Set of walk IDs viewed (passive completion tracking) |
| `sniffout_dogs` | array of dog profile objects (multiple dogs supported) |
| `sniffout_walk_log` | array of timestamped walk log entries — `type: "curated"` or `"custom"` |
| `sniffout_units` | `"km"` (default) or `"miles"` — user units preference |
| `sniffout_hide_install_prompt` | boolean — set when user dismisses the PWA install prompt card in Me tab |
| `walkReviews` | JSON object of user reviews |
| `recentSearches` | JSON array |
| `sniffout_recent_walks` | array of up to 3 recently viewed walk IDs (most recent first) |

Note: `communityWalks` is not part of v2 — community features are deferred.

### Data

Walk data is hardcoded in `WALKS_DB` (93 UK walks with hazard tagging). No backend — all persistence is `localStorage`. The v2 schema for each walk entry:

```
id, name, location, lat, lon, description
offLead:     "full" | "partial" | "none"
livestock:   boolean
hasStiles:   boolean
hasParking:  boolean
terrain:     "paved" | "muddy" | "mixed" | "rocky"
difficulty:  "easy" | "moderate" | "hard"
imageUrl:    string (use "" until photo is sourced — placeholder-walk.jpg renders)
badge:       "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined
rating:      number
reviewCount: number
distance:    number (miles)
duration:    number (minutes)
source:      "curated" | "places"
hazards:     array — approved values: deer, adders, ticks, algae, livestock, ground-nesting-birds, cliff, flooding, paw-burn, mountain-bikers
wetNote:     string (optional) — underfoot condition note shown in wet weather context
hotNote:     string (optional) — heat/summer note shown in hot weather context
```

**Hazard tagging:** Every walk has a `hazards` array. Per-walk seasonal notices driven by `getWalkNotices()` function. Old global deer rut notice has been removed in favour of per-walk hazard data.

Walk log entries (in `sniffout_walk_log`) have an additional `type` field:
- `"curated"` — a walk from WALKS_DB, linked by `id`
- `"custom"` — a free-form user-created entry with a user-provided `name` field and no WALKS_DB `id`

Do not add WALKS_DB schema fields without PO sign-off.

### APIs

| Service | Purpose | Auth |
|---------|---------|------|
| Open-Meteo | Weather forecasts (current + hourly) | None |
| Google Places (New) | Dog-friendly venues | API key secured behind Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| Nominatim (OSM) | Reverse geocoding | None |
| postcodes.io | UK postcode → lat/lon | None |
| Leaflet 1.9.4 (CDN) | Map rendering | None |
| Firebase (compat SDK v10.12.0, CDN) | Firestore (walk log dual-write), Firebase Storage (photos), anonymous auth + email/password auth | Project: `sniffout-fe976`, region `europe-west2` |

**Firebase initialisation:** SDK loaded via CDN in `sniffout-v2.html`. Anonymous auth fires on load — UID used for Firestore document paths. Dual-write is active for walk log entries (writes to both localStorage and Firestore). Do not add Firebase reads to the critical render path — localStorage remains the source of truth for UI rendering.

**Phase 3 additions (not yet implemented):** Open-Meteo `uv_index` parameter; Open-Meteo `european_aqi` endpoint for pollen.

### Firebase Project Status

Project: `sniffout-fe976` | Region: `europe-west2` | Status: ACTIVE (services configured April 10 2026)

**Authentication:**
- Anonymous auth: ENABLED (was already enabled from previous development, March 2026)
- Email/Password: ENABLED (enabled April 10 2026)
- Google OAuth: NOT YET ENABLED (Phase 4)

**Firestore:**
- Database: ACTIVE in europe-west2
- Existing data: users collection with anonymous user documents and walkLog subcollections from March 2026 development
- Security rules: published, user-scoped (`users/{uid}/{document=**}` read/write if `auth.uid` matches)

**Firebase config:** Config object in Project Settings under the sniffout web app. Fields present: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`. Config is currently hardcoded in `sniffout-v2.html` — must be moved to Cloudflare Worker environment variables before launch (see pre-launch blockers).

### Infrastructure and Monitoring

- **Circuit breaker (Cloudflare Worker):** Live at places-proxy.sniffout.app. 500 requests/hour threshold, KV-backed rate limiting, email alert to hello@sniffout.app on trigger, auto-reset after 60 minutes. Admin endpoints: /admin/stats (view usage) and /admin/reset?key=SNIFFOUT_ADMIN_2026 (manual reset). Worker uses ES module syntax (`export default`), `env.PLACES_API_KEY`, `env.SNIFFOUT_KV`.
- **GA4 tracking:** Live on app and website. Measurement ID: G-B1GQG1KWD3. Custom events: tab_view, walk_card_tap, walk_detail_open, weather_check, nearby_search, app_install_prompt, app_installed. Beta source tracking via ?src= URL parameter.
- **Email routing:** hello@sniffout.app forwards to personal email via Cloudflare Email Routing.
- **Google Cloud billing alerts:** Configured at £50 and £100 thresholds.
- **Google Maps cost risk:** Primary scaling cost. At 50,000 MAU, interactive map loads could be £200-600/month. Mitigation: static map images on overview pages; interactive map only on navigate/start walk view.

### CSS

All inline. Light mode token set:

| Token | Value | Notes |
|-------|-------|-------|
| `--brand` | `#2C4A14` | Woodland Green — brand colour |
| `--bg` | `#F4EFE6` | Warm linen page background |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--border` | `rgba(0,0,0,0.08)` | Card borders |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-2` | `#555555` | Secondary text |
| `--amber` | `#D97706` | Warnings |
| `--red` | `#EF4444` | Danger/errors |

Dark mode — Scheme B (Dark Slate), applied via `body.night` class. Token overrides:

| Token | Dark value | Notes |
|-------|-----------|-------|
| `--bg` | `#141414` | Near-black page background |
| `--surface` | `#1F1F1F` | Dark card surfaces |
| `--border` | `rgba(255,255,255,0.08)` | Subtle light border |
| `--ink` | `#F4F2EE` | Off-white primary text |
| `--ink-2` | `#8A8A8A` | Muted secondary text |
| `--brand` | `#5C7A63` | Lightened brand for dark bg contrast |
| `--chip-off` | `#2A2A2A` | Off/inactive chip background |
| Weather hero bg | `#1A3522` | Weather tab hero card override only |

Dark mode is toggled manually by the user via Settings. "Auto" option uses `prefers-color-scheme`. Default for new users is light mode. Spec in `docs/specs/dark-mode-schemes.md`.

### Key Function Groups (v2)

- **Weather**: `fetchWeather(lat, lon)`, `renderWeather(data)` — hazard detection for rain/heat/wind/UV; hourly forecast bar on Weather tab. Includes smart walk window bar chart with evidence-based per-hour scoring. Five reason icons: rain, heat, wind, cold, storm. Info disclaimer pill on Weather tab. "All day" pill when all bars are green.
- **Smart weather scoring**: `scoreHour(hour, dogProfile)` — per-hour quality score using evidence-based thresholds. Heat threshold 22C (product decision), 28C = POOR. Rain scored as amount x probability. Humidity multipliers 1.3x (70-79%) and 1.6x (80%+). Scoring spec: docs/smart-weather-scoring-spec.md. Fact check: ~/Desktop/sniffout-website/docs/reviews/scoring-thresholds-fact-check-april-2.md.
- **Breed sensitivity engine**: `BREED_SENSITIVITY` constant, `getBreedGroup()`, `getActiveDogProfile()`, `getDogWeatherNotes()`, `getConditionalAlerts()` — drives breed-specific notes on Weather tab condition tiles.
- **Hazard notices**: `getWalkNotices(walk, date)` — returns per-walk seasonal notices based on the walk's `hazards` array and current date. Replaced old global deer rut notice.
- **Walk verdict**: `getWalkVerdict(weatherData)` — shared pure function returning approved verdict strings; used by Today and Weather tabs
- **Walks**: `renderWalks()` — filtering by offLead/livestock/terrain/distance, map view, favourites
- **Walk log**: `getWalkLog()`, `saveWalkLog(entry)` — manages `sniffout_walk_log`. Handles both `"curated"` and `"custom"` entry types.
- **Distance formatting**: `formatDist(miles)` — respects `sniffout_units` setting; used everywhere distances display
- **Places**: `renderPlacesPanel()`, `fetchPlaces(category)` — Google Places (via Cloudflare Worker proxy) + Leaflet map. Radius enforced client-side after fetch, not via `locationRestriction`.
- **Dog profile**: reads/writes `sniffout_dogs`; drives Me tab avatar, personalised copy, and walk log `dogId` tagging
- **Storage**: `getReviews/saveReviews`, `getFavourites/saveFavourites`
- **Session**: `saveSession()`, `restoreSession()` — persists location + weather for 8h
- **Silent refresh**: `silentWeatherRefresh()` — triggers on `visibilitychange` event and on tab switch; re-fetches weather if data is older than 5 minutes. Does not block UI. Runs silently in background.
- **Firebase helpers**: `fsWriteWalkLogEntry(entry)`, `fsUpdateWalkNote(entryId, note)`, `fsWriteSavedWalk(walkId)`, `fsWriteUserProfile(profileData)` — write-only helpers for Firestore dual-write. All are fire-and-forget; failures are silent and do not affect UI. localStorage remains source of truth.
- **Geocoding**: `geocodePostcode(pc)` — postcodes.io lookup

### Smart Weather Scoring - Key Decisions (LOCKED)

These decisions are locked and must not be changed without explicit PO sign-off.

| Decision | Value | Notes |
|----------|-------|-------|
| Heat threshold | 22C | Product decision - higher than some generic guidance (20C). Verified against canine research. |
| POOR verdict threshold | 28C | |
| Rain scoring method | Amount x probability | Not raw precipitation amount |
| Humidity multiplier (70-79%) | 1.3x | Estimate - note in methodology |
| Humidity multiplier (80%+) | 1.6x | Estimate - note in methodology |
| Info disclaimer | Required | Must appear on all scoring displays |
| "All day" pill | Required | Renders when all hourly bars are green |

Scoring spec (full): docs/smart-weather-scoring-spec.md
Scoring fact check: ~/Desktop/sniffout-website/docs/reviews/scoring-thresholds-fact-check-april-2.md

A website methodology page citing the scoring sources is required before go-live. This is a liability protection measure - do not launch without it.

### Phase 3 Plan

Do not implement any Phase 3 item without an explicit PO brief.

Full spec: docs/specs/account-data-sync-spec-april-11.md
Approved by owner April 11 2026.

Key decisions:
- Syncs: saved walks, journal, dog profile, settings, saved places
- Multi-device merge: newer timestamp wins, walks/journal always union
- Sign-out: keep local data, start fresh anonymous session
- No display name: email is the identifier
- No email verification for development (required before public launch)
- Account deletion: immediate, all Firestore data removed, GDPR compliant

**Phase 3A: Anonymous auth + saved walks — COMPLETE**
- Firebase SDK loaded via CDN in sniffout-v2.html: DONE (v10.12.0)
- Anonymous auth on first open (silent, no UI): DONE
- Heart button writes to Firestore `users/{uid}/savedWalks/{walkId}`: DONE
- Heart button reads saved state on load: DONE
- Me tab shows saved walks list: DONE
- Me tab shows account creation prompt after 3+ saved walks: DONE
- Account row in Me tab (direct access): DONE

**Phase 3B: Account creation + walk journal — LARGELY COMPLETE**

Completed:
- Email/password sign-in bottom sheet: DONE
- Anonymous account upgraded via `linkWithCredential` (UID preserved, all data carries over): DONE
- Me tab signed-in state (email shown in header): DONE
- Password reset flow: DONE
- Walk journal add entry from walk detail: DONE
- Walk journal list view in Me tab: DONE
- Sign out with anonymous fallback: DONE
- Direct Account row in Me tab: DONE
- Dog profile sync to Firestore on sign-in: DONE
- Settings sync to Firestore on sign-in: DONE
- Saved places dual-write to Firestore: DONE
- Account deletion flow (GDPR right to erasure): DONE
- Dog profile write on update (live sync): DONE

Remaining:
- Multi-device merge on sign-in: BUILT, needs on-device testing
- Email verification: required before public launch, not yet implemented

**Phase 4 (future):**
- Google OAuth sign-in
- Push notifications (hazard alerts only)
- Photos on journal entries

### Backlog and Pending Items

These items are not yet implemented. Do not start any of these without an explicit PO brief.

**Pre-launch blockers (remaining):**

GDPR/Legal:
- L1: GDPR sign-off - STILL NEEDED before public launch with real users. Development/internal testing can proceed without it.
- L5: T&C consent screen - still needed, blocked on Sprintlaw call
- ICO registration: still needed before launch

Firebase:
- T17: Firebase security review - Firestore rules and auth config reviewed before launch - not started
- T12: Pen test covering auth flows and Firestore data access - not started
- T18: Firebase config object currently hardcoded in sniffout-v2.html - must be moved to Cloudflare Worker environment variables before launch
- Email verification: must be implemented before public launch (Firebase sendEmailVerification)

Other:
- T16: Full end-to-end test pass - not started
- Multi-device merge: BUILT, needs on-device testing before sign-off

AWIN: Application submitted April 11 2026 - awaiting approval. Not a launch blocker but required for Phase 1 revenue.

**Resolved pre-launch blockers:**
- Fake walk card ratings: removed (pre-launch blocker resolved)
- Open/closed venue status: fixed via isVenueOpenNow() at line 14250 - recalculates from schedule data at render time, openNow field discarded at parse time
- Website methodology page: live at /methodology/
- Lighter green #5A8A2E treatment for 20-22C awareness range: shipped
- Reason icons replaced with simpler bolder versions: shipped
- OS Maps Leisure tiles: fixed and active
- Smart weather bar chart with evidence-based per-hour scoring: live
- Weather bar chart smooth gradient colour system: shipped April 10 2026. Colour interpolates directly from score — taller always means richer/darker green. Old logic archived at docs/archive/weather-bar-chart-colour-logic-v1.md
- UI parity fixes (April 10 2026): --ink-2 updated to #555555; difficulty badges portrait/trail cards now tinted not solid; walk detail overlay badge brand green/sienna per type; heart button blur removed, border none, SVG stroke white, box-shadow removed; section labels unified under .section-label class; walk card placeholder gradient aligned to website; --border token rgba(0,0,0,0.08)
- Firebase Phase 3A: complete (anonymous auth, saved walks, Me tab prompt, account row)
- Firebase Phase 3B: largely complete (see Phase 3 Plan above)

**PWA backlog:**
- Push notifications spec (Phase 4)
- B2 beforeunload handler - deferred, manual test on Android needed
- Multi-device merge on sign-in: BUILT, needs on-device testing

**Website backlog:**
- Website weather preview card on walk pages (contextual walk-level forecast)
- Labrador walking guide (SEO priority)
- "Is it too hot to walk my dog" temperature guide - mid-May deadline, research complete
- "How far should I walk my dog" guide (5,000-10,000 monthly searches)
- Walk route maps (Phase 2)
- Community features scoping - Researcher round needed before any spec work

**Content complete (April 2026):**
- Senior dog walking article: fact-checked PASS, committed and live
- French Bulldog walking guide: fact-checked PASS, live
- Cockapoo walking guide: fact-checked PASS with one correction applied, live
- Ailsa walk descriptions for all 14 live walk pages: complete at docs/copy/ailsa-walk-descriptions-april-3.md (pending Developer commit to walk pages)

### Working Agreements

These govern how all agents and Developer briefs operate. Do not deviate.

- Always ask Jayesh before writing any Developer or agent brief
- Number tasks clearly (Task 1, Task 2 etc) with visual separators between tasks
- Specify which repo (PWA or website) for every task
- Handoff and CLAUDE.md updates go through PO pane only
- Kanban must be updated at end of every session
- Content pipeline: Researcher - Copywriter - Fact Checker (mandatory for Tom) - fixes - commit
- Surgical single-task briefs only (maximum 3-4 related tasks per round)
- No time estimates in Developer briefs
- Developer must confirm changes with line numbers summary
- Developer must verify push with git log --oneline -3 confirming origin/main matches HEAD
- Agent prompt format: single copyable code block, start with "You are the [Role] for Sniffout...", include file protection warning and no em dash rule

### Trail Tips Content Category

Short practical hacks written in Jayesh's founder voice. Distinct from Tom's safety guide format. Lives across multiple surfaces:
- Walk pages: contextual tips relevant to that specific walk
- Standalone articles on website
- In-app contextual tips (future)
- Social media

Trail Tips are written by Jayesh directly or heavily edited from Jayesh's voice. They are not a Tom article type and do not require Fact Checker unless health claims are made.

### Em Dash Rule

No em dashes in app or website copy or user-facing strings. Em dashes are fine in documents, reports, and conversation. This applies to all in-app copy, website article body text, guide article copy, UI labels, cards, pills, tooltips, and any string a user reads. Hyphens only in user-facing content.

### Approved Copy — Key Strings

- **State A headline (first-run / no location set):** `Paws before you go.`
- **State A social proof strip:** `Know the route · Own the weather · Find the spots`
- **Page title:** `Sniffout — Dog walks & weather for the UK`
- **Nav labels:** Today · Weather · Walks · Nearby · Me
- **Walk count references:** Use `WALKS_DB.length` dynamically — never hardcode a number
- All weather verdict strings, hazard titles, and paw safety strings: see `docs/po/copy-review.md` and `docs/po/po-action-plan-round24.md`
- **Account messaging (Phase 3):** When prompting users to create an account, always frame it as protecting their data across devices - never as registration or sign-up. The approved hook line is: "Keep your walks safe across any device." Secondary framing: "Your stats, your journal, always with you." The trigger moment is when a user has logged enough walks that losing them would matter. Final copy to be confirmed by Copywriter before implementation.

Do not use "free", "no sign-up", "no account", or "no login" anywhere in the app. When account creation arrives (Phase 3), it must be framed as data protection - "Keep your walks safe across any device" or "your data, safe wherever you are" - not as a registration step or burden. The absence of an account is not a selling point; protecting the user's data is. Copy that frames accounts as optional or avoidable will conflict with Phase 3 messaging and must not be introduced.

### Auth Copy Rules

Applies to all sign-in flows, account prompts, and account creation UI (Phase 3B onwards):

- **Never use:** "register", "sign up", "create an account"
- **Always use:** "Save your walks", "Keep your data safe", "Access on any device"
- Account creation is always optional — never gated. Users must be able to dismiss any account prompt without penalty.
