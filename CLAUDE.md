# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 File Protection — Read First

**`dog-walk-dashboard.html` is the live production file. Do not touch it under any circumstances.**

All new development happens in **`sniffout-v2.html`** only. Do not use `dog-walk-dashboard.html` as a reference or base for any new code.

- **`sniffout-v2.html`** — active development file for v2
- **`dog-walk-dashboard.html`** — live production, do not modify
- **`sw.js`, `manifest.json`** — modify only when explicitly instructed

## Project Vision

Sniffout is a mobile-first PWA for discovering dog walks across the UK, being validated as a POC before investing in a backend. The product is walk discovery first; weather intelligence is the differentiator, not the lead. Keep it simple — do not add complexity unless explicitly instructed.

## Competitive Context

Closest competitor is PlayDogs (France/Switzerland, 170k downloads), but it relies on community-generated content so is empty in new regions. Sniffout differentiates with curated content from day one plus live weather integration. No UK competitor combines walk discovery + live weather + dog-specific hazard context in a single no-login product.

## Design Principles

Mobile-first, uncluttered, modern and slick. **v2 uses a clean card-based design — glassmorphism has been removed.** Key decisions locked:
- Brand colour: `#3B5C2A` (Meadow green)
- Background: `#F7F5F0` (warm off-white)
- Typography: Inter 400/500/600/700 only
- Cards: `border-radius: 16px`, `1px solid var(--border)`, no blur or translucent surfaces
- Dark mode: `body.night` class, toggled manually via Settings ("Auto" option). Not automatic based on weather.
- Me tab primary stat card (`me-stat-card--primary`): number colour is `var(--ink)` in both light and dark mode, consistent with all other stat card numbers. Do not add a colour override without explicit owner instruction.

Nothing gimmicky. Paw emoji (🐾) reserved for paw safety block only.

## Deferred — Do Not Implement Without Instruction

Google Places API expansion (already integrated at current scope — do not add new venue categories or API calls), user accounts, native app, marker clustering plugin, community tab, walk submission, push notifications.

**Firebase note:** Firebase foundation is now in place (project: `sniffout-fe976`, region `europe-west2`, anonymous auth, Firestore, Storage, SDK v10.12.0 via CDN). The foundation is integrated but the **full Firebase migration** — authenticated user accounts, server-side walk log migration, full Firestore read/write — remains Phase 3 and must not be implemented without explicit instruction and GDPR sign-off (L1).

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
| `--brand` | `#3B5C2A` | Meadow green — brand colour |
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

Dark mode is toggled manually by the user via Settings. "Auto" option uses `prefers-color-scheme`. Default for new users is light mode. Spec in `dark-mode-schemes.md`.

### Key Function Groups (v2)

- **Weather**: `fetchWeather(lat, lon)`, `renderWeather(data)` — hazard detection for rain/heat/wind/UV; hourly forecast bar on Weather tab
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

### Approved Copy — Key Strings

- **State A headline (first-run / no location set):** `Paws before you go.`
- **State A social proof strip:** `Know the route · Own the weather · Find the spots`
- **Page title:** `Sniffout — Dog walks & weather for the UK`
- **Nav labels:** Today · Weather · Walks · Nearby · Me
- **Walk count references:** Use `WALKS_DB.length` dynamically — never hardcode a number
- All weather verdict strings, hazard titles, and paw safety strings: see `copy-review.md` and `po-action-plan-round24.md`

Do not use "free", "no sign-up", "no account", or "no login" anywhere in the app.
