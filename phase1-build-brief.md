# Sniffout v2 — Phase 1 Build Brief
*Issued by Product Owner. March 2026. For Developer use only.*

---

## File

All work goes into **`sniffout-v2.html`** only. Do not touch `dog-walk-dashboard.html` under any circumstances.

---

## APIs and Data — Carry-Over Confirmation

All three carry over from `dog-walk-dashboard.html` into `sniffout-v2.html` as-is. Do not modify or extend any of them in Phase 1.

| | Carry over? | Phase 1 instruction |
|--|--|--|
| **Weather — Open-Meteo** | ✅ Yes | Copy the existing `fetchWeather()` call and rendering logic as-is. Do not add `uv_index` or any new parameters yet — that is Phase 3. |
| **Places — Google Places API** | ✅ Yes | Copy the existing `fetchPlaces()` / `renderPlacesPanel()` logic as-is. The API key stays hardcoded. Do not add new venue categories or expand the integration. |
| **Walks — WALKS_DB** | ✅ Yes | Copy the entire existing curated walks array. Then extend each entry with the new schema fields listed in Section 6 below. This is the only data change in Phase 1. |

Phase 1 adds no new API calls and removes no existing ones. The only data work is extending WALKS_DB entries with the new schema fields.

---

## What to Build in Phase 1

Phase 1 has one goal: **sniffout-v2.html looks and feels like the design spec**. No new logic, no new API calls. Visual foundation only — plus the walk card data model.

### 1. CSS Token System
Replace all existing colour variables and glassmorphic styles with the v2 token set:

| Token | Value |
|-------|-------|
| `--brand` | `#1E4D3A` |
| `--bg` | `#F7F5F0` (warm off-white) |
| `--surface` | `#FFFFFF` |
| `--border` | `rgba(0,0,0,0.08)` |
| `--ink` | `#1A1A1A` |
| `--ink-2` | `#6B6B6B` |
| `--amber` | `#F59E0B` |
| `--red` | `#EF4444` |

Dark mode via `body.night` class (retained from v1 — swap token values only).
Remove all glassmorphic variables (`backdrop-filter`, `rgba` surface tints, blur effects).

### 2. Typography
- Load **Inter** via Google Fonts CDN: weights 400, 500, 600, 700 only
- Replace all Fraunces and DM Sans references
- Apply `font-family: 'Inter', sans-serif` globally

### 3. Bottom Navigation
- Five tabs: **Today · Weather · Walks · Nearby · Me**
- Active state: filled icon + brand-coloured label text
- Inactive state: outlined icon + `--ink-2` label text
- Safe area inset at bottom (`padding-bottom: env(safe-area-inset-bottom)`)
- `1px solid var(--border)` top border, white background

### 4. Card Base Styles
All cards across the app:
- `border-radius: 16px`
- `border: 1px solid var(--border)`
- `background: var(--surface)` on `background: var(--bg)` page background
- No glassmorphism, no blur, no translucent surfaces

### 5. Filter Chip and Segmented Toggle Styles
- Filter chips: inactive = outlined, active = brand-green fill with white text
- Segmented toggle (List/Map): filled half uses brand colour; these will be used on Walks and Nearby tabs

### 6. WALKS_DB Schema Update
Add the following fields to every entry in WALKS_DB. Remove `isPushchairFriendly`.

```
offLead:      "full" | "partial" | "none"
livestock:    boolean
hasStiles:    boolean
hasParking:   boolean
terrain:      "paved" | "muddy" | "mixed" | "rocky"
difficulty:   "easy" | "moderate" | "hard"
imageUrl:     string (URL) — use "" if not yet sourced
badge:        "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined
rating:       number
reviewCount:  number
distance:     number (miles)
duration:     number (minutes)
source:       "curated" | "places"
description:  string (already exists)
```

No other fields. Do not add anything not on this list without PO sign-off.

### 7. Walk Card Redesign
- Photo area: **180px tall**, lazy-loaded from `imageUrl`
- If `imageUrl` is empty: solid `#1E4D3A` brand-green background — no broken image, no grey box
- Badge pill: top-left of photo area — brand-green fill for `Sniffout Pick`, neutral grey for `Nearby`, standard colour for `Popular` / `Hidden gem` / `New`
- Heart/favourite icon: top-right of photo area
- Metadata row below photo: distance · duration · difficulty
- Tag chips below metadata: off-lead status, livestock flag (show only if `livestock: true`)

### 8. Today Tab — State A Preview Cards
- Warm up the "WHAT YOU'LL GET" preview cards with `background: rgba(30,77,58,0.06)` and `border: 1px solid rgba(30,77,58,0.15)`
- Cards must look intentional — like real cards seen through frosted glass, not loading placeholders
- Ensure walk name, "Off-lead" badge, and tags are readable (not faded to illegibility)
- Section label: soften from `WHAT YOU'LL GET:` — use `Here's what you'll see:` or remove the label entirely

### 9. Copy Updates
Apply these approved strings. Do not use any other wording:

- **Headline:** `Find your next great walk.`
- **Subline:** `Handpicked walks. Live conditions.`
- **Body:** `50+ handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots.`
- **Social proof strip:** `50+ handpicked UK walks · Works offline · Dog-specific routes`
- **Nav labels:** Today · Weather · Walks · Nearby · Me
- **Page title:** `Sniffout — Dog walks & weather for the UK`

### 10. Copy Audit — Remove All Prohibited Strings
Search the entire file and remove every instance of:
- "free" (as a product promise)
- "no sign-up"
- "no account"
- "no login"

This applies to all surfaces: home screen, social proof strip, onboarding, metadata, PWA install card, Me tab — everywhere.

---

## What Done Looks Like

Phase 1 is complete when all of the following are true:

- [ ] All 5 tabs render with new CSS tokens — no glassmorphism visible anywhere
- [ ] Inter font loads and displays correctly at all 4 weights
- [ ] Bottom nav shows correct labels, correct active/inactive states
- [ ] Walk cards show photo area (brand-green placeholder where no image), badge, heart, metadata row, and tag chips
- [ ] WALKS_DB entries have all new schema fields populated (sample data is fine for non-photo fields)
- [ ] Today tab State A preview cards use the brand-green tint treatment — do not look like broken placeholders
- [ ] All prohibited copy strings ("free", "no sign-up", "no account", "no login") are gone from the entire file
- [ ] Approved copy strings from Section 9 are in place
- [ ] Dark mode (`body.night`) still works correctly with the new token set
- [ ] App loads and is navigable on iPhone Safari (375px viewport minimum)

---

## Constraints and Watch-Outs

- **No new API calls in Phase 1.** Weather, Places, and geolocation logic carries over from v1 but do not extend it.
- **No new JS logic.** This phase is visual. The `getWalkVerdict()` function, filter chip logic, and walk detail overlay are Phase 2.
- **No onboarding overlay.** Out of scope for the entire current build phase. Do not add it.
- **No Community tab.** Five tabs only — Today, Weather, Walks, Nearby, Me. No sixth tab, no placeholder.
- **Paw emoji (🐾)** must not appear anywhere outside of the paw safety block. Remove all other instances.
- **Em dashes** throughout copy — use `—` not `-` or `–`.
- **`sw.js` and `manifest.json`** — do not modify unless explicitly instructed.
- **Photo sourcing** is being handled by the project lead. Do not block on `imageUrl` — brand-green placeholder is the approved interim state.
