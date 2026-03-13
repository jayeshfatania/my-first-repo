# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

Sniffout is a concept/POC being validated before investing in a backend. It must remain free, no-login, and simple. Do not add complexity unless explicitly instructed.

## Competitive Context

Closest competitor is PlayDogs (France/Switzerland, 170k downloads), but it relies on community-generated content so is empty in new regions. Sniffout differentiates with curated content from day one plus live weather integration.

## Design Principles

Mobile-first, uncluttered, modern and slick. The current glassmorphic green style is open to change based on research. Nothing gimmicky.

## Deferred — Do Not Implement Without Instruction

Firebase backend, Google Places API (already integrated but not to be expanded), user accounts, native app.

## Project Overview

**Sniffout** is a mobile-first PWA for discovering dog walks across the UK. It has no build step — it's a single HTML file deployed to GitHub Pages at `sniffout.app`.

## Development

No build tools, no package manager, no test framework. Development is:

1. Edit `dog-walk-dashboard.html` directly
2. Open in a browser (or use a local static server: `python3 -m http.server`)
3. Deploy by pushing to `main` — GitHub Pages auto-deploys

The `index.html` redirects to `dog-walk-dashboard.html`. Desktop users see a "Coming soon" screen (viewport ≥768px or non-touch device).

## Architecture

Everything lives in `dog-walk-dashboard.html` (~2,700 lines): inline CSS in `<style>`, inline JS in `<script>`, and all HTML. No modules, no bundler.

**Other files:**
- `sw.js` — service worker (network-first, cache fallback, cache key `sniffout-v2`)
- `manifest.json` — PWA manifest
- `CNAME` — custom domain (`sniffout.app`)

### Navigation

Tab-based, no URL routing. Tabs: `home`, `weather`, `walks`, `places`, `profile`. Active tab stored in `localStorage` (`sniffout_active_tab`). `showTab(tab)` switches views.

### State

All state is in-memory globals + `localStorage`. Key storage:

| Key | Contents |
|-----|----------|
| `sniffout_session` | `{location, weather, timestamp}` — expires after 8h |
| `sniffout_active_tab` | last active tab |
| `sniffout_favs` | array of favourited walk IDs |
| `sniffout_username` | user's display name |
| `walkReviews` | JSON object of user reviews |
| `communityWalks` | JSON array of user-submitted walks |
| `recentSearches` | JSON array |

### Data

Walk data is hardcoded in `WALKS_DB` (50+ UK walks). No backend database — all persistence is `localStorage`.

### APIs

| Service | Purpose | Auth |
|---------|---------|------|
| Open-Meteo | Weather forecasts | None (free) |
| Google Places (New) | Dog-friendly venues | API key hardcoded in JS |
| Nominatim (OSM) | Reverse geocoding | None |
| postcodes.io | UK postcode → lat/lon | None |
| Leaflet 1.9.4 (CDN) | Map rendering | None |

### CSS

All inline. Uses CSS custom properties (`--amber`, `--moss`, `--ink`, etc.). Dark mode toggled via `body.night` class, set automatically based on weather `isDay` flag.

### Key Function Groups

- **Weather**: `fetchWeather(lat, lon)`, `renderWeather(data)` — hazard detection for rain/heat/wind
- **Walks**: `renderWalks()`, `loadNearbyGreenSpaces()` — filtering, map view, favourites
- **Places**: `renderPlacesPanel()`, `fetchPlaces(category)` — Google Places + Leaflet map
- **Storage**: `getReviews/saveReviews`, `getFavourites/saveFavourites`, `getCommunityWalks/saveCommunityWalks`
- **Session**: `saveSession()`, `restoreSession()` — persists location + weather for 8h
- **Geocoding**: `geocodePostcode(pc)` — postcodes.io lookup
