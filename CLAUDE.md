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

Google Places API expansion (already integrated at current scope — do not add new venue categories or API calls), user accounts, native app, marker clustering plugin, community tab, walk submission, push notifications.

**Firebase note:** Firebase foundation is now in place (project: `sniffout-fe976`, region `europe-west2`, anonymous auth, Firestore, Storage, SDK v10.12.0 via CDN). The foundation is integrated but the **full Firebase migration** — authenticated user accounts, server-side walk log migration, full Firestore read/write — remains Phase 3 and must not be implemented without explicit instruction and GDPR sign-off (L1).

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

Walk data is hardcoded in `WALKS_DB` (100 UK walks). No backend — all persistence is `localStorage`. The v2 schema for each walk entry:

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
```

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
| Firebase (compat SDK v10.12.0, CDN) | Firestore (walk log dual-write), Firebase Storage (photos), anonymous auth | Project: `sniffout-fe976`, region `europe-west2` |

**Firebase initialisation:** SDK loaded via CDN in `sniffout-v2.html`. Anonymous auth fires on load — UID used for Firestore document paths. Dual-write is active for walk log entries (writes to both localStorage and Firestore). Do not add Firebase reads to the critical render path — localStorage remains the source of truth for UI rendering.

**Phase 3 additions (not yet implemented):** Open-Meteo `uv_index` parameter; Open-Meteo `european_aqi` endpoint for pollen; full authenticated Firebase migration.

### CSS

All inline. Light mode token set:

| Token | Value | Notes |
|-------|-------|-------|
| `--brand` | `#2C4A14` | Woodland Green — brand colour |
| `--bg` | `#F7F5F0` | Warm off-white page background |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--border` | `rgba(0,0,0,0.08)` | Card borders |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-2` | `#6B6B6B` | Secondary text |
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

### Backlog and Pending Items

These items are not yet implemented. Do not start any of these without an explicit PO brief.

**Pre-launch blockers:**
- Fake walk card ratings removal - ratings are not real, must be removed before go-live
- Open/closed venue status goes stale after 24h cache - needs recalculation from schedule
- Website methodology page (scoring sources) - required before go-live

**PWA backlog:**
- Push notifications spec
- B2 beforeunload handler - deferred, manual test on Android needed
- OS Maps Leisure tiles not activating
- Firebase Phase 3 migration - authenticated accounts, server-side walk log, full Firestore

**Website backlog:**
- Website weather preview card on walk pages (contextual walk-level forecast)
- Breed walking guides: French Bulldog, Cockapoo, Labrador (SEO priority)
- "How far should I walk my dog" guide (5,000-10,000 monthly searches)
- "Is it too hot to walk my dog" temperature guide - mid-May deadline for summer peak
- Walk route maps (Phase 2)
- Community features scoping - Researcher round needed before any spec work
- Ailsa walk descriptions for all live walk pages

**Content in pipeline:**
- Senior dog walking article - Fact Checker review pending, then commit

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
