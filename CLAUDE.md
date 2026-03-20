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

Nothing gimmicky. Paw emoji (🐾) reserved for paw safety block only.

## Deferred — Do Not Implement Without Instruction

Firebase backend, Google Places API expansion (already integrated at current scope — do not add new venue categories or API calls), user accounts, native app, marker clustering plugin, community tab, walk submission, push notifications.

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
| `walkReviews` | JSON object of user reviews |
| `recentSearches` | JSON array |

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

**Phase 3 additions (not yet implemented):** Open-Meteo `uv_index` parameter; Open-Meteo `european_aqi` endpoint for pollen.

### CSS

All inline. v2 token set:

| Token | Value | Notes |
|-------|-------|-------|
| `--brand` | `#3B5C2A` | Meadow green — brand colour |
| `--bg` | `#F7F5F0` | Warm off-white page background |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--border` | `rgba(0,0,0,0.08)` | Card borders |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-2` | `#6B6B6B` | Secondary text |
| `--amber` | `#F59E0B` | Warnings |
| `--red` | `#EF4444` | Danger/errors |

Dark mode toggled via `body.night` class. Set manually by the user via Settings ("Auto" option uses `prefers-color-scheme`). Default for new users is light mode. Not automatic based on weather.

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
- **Geocoding**: `geocodePostcode(pc)` — postcodes.io lookup

### Approved Copy — Key Strings

- **State A headline (first-run / no location set):** `Paws before you go.`
- **State A social proof strip:** `Know the route · Own the weather · Find the spots`
- **Page title:** `Sniffout — Dog walks & weather for the UK`
- **Nav labels:** Today · Weather · Walks · Nearby · Me
- **Walk count references:** Use `WALKS_DB.length` dynamically — never hardcode a number
- All weather verdict strings, hazard titles, and paw safety strings: see `copy-review.md` and `po-action-plan-round24.md`

Do not use "free", "no sign-up", "no account", or "no login" anywhere in the app.
