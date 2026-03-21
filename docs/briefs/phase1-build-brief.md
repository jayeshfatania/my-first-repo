# Sniffout v2 — Phase 1 Build Brief
*Issued by Product Owner. March 2026. For Developer use only.*

---

**sniffout-v2.html must be built entirely from scratch. It must not copy or reuse code or structure from dog-walk-dashboard.html. The visual reference is mockup.html and design-spec.md only. This design has been signed off and must be followed precisely.**

**mockup.html is the non-negotiable design reference. When any document conflicts with mockup.html, mockup.html wins — except for copy strings, where phase1-build-brief.md Section 9 is authoritative.**

---

## File

All work goes into **`sniffout-v2.html`** only. Do not open, reference, or copy from `dog-walk-dashboard.html`.

---

## What Carries Over — and What Does Not

| | Carry over? | Instruction |
|--|--|--|
| **Weather — Open-Meteo** | ✅ Integration only | Re-implement `fetchWeather()` from scratch using the same Open-Meteo endpoints. No `uv_index` yet — Phase 3. |
| **Places — Google Places** | ✅ Integration only | Re-implement venue fetching from scratch. Same API key and endpoint. Do not expand beyond current venue categories. |
| **Walks — WALKS_DB content** | ✅ Data only | Use existing walk entries (names, locations, descriptions, coordinates). Remove the `icon` field. Add all new schema fields (Section 6). Write the JS array fresh. |
| **All other code** | ❌ Do not carry over | HTML structure, CSS, JS functions, navigation logic — all written from scratch using mockup.html and design-spec.md as the reference. |

---

## Phased Build Approach

Build in the following phases. **Confirm each phase works before starting the next.** Do not skip ahead.

### Phase A — HTML structure and CSS only
Build the full HTML skeleton and complete CSS token system. No JavaScript. All five tab panels present in the DOM but only the Today tab visible. Bottom nav rendered. Save the file and confirm it opens correctly in a browser before proceeding.

### Phase B — Navigation and tab switching
Add the JavaScript to switch between tabs. Confirm every tab is tappable and the correct panel shows. Bottom nav active states update correctly. Confirm on iPhone Safari (or browser dev tools at 375px). Proceed only when all five tabs switch cleanly.

### Phase C — Weather integration
Re-implement the Open-Meteo API call (`fetchWeather()`) and the weather rendering logic with all approved verdict strings and hazard titles (Section 9). Confirm live weather data loads and displays correctly. Confirm verdict string, hazard cards, paw safety block, and rain summary all render. Proceed only when real weather data is visible.

### Phase D — Walks database and Walks tab
Implement WALKS_DB with the v2 schema. Build the walk card component. Confirm walk cards render with photo area (brand-green fallback), correct badge, heart icon, metadata row, and off-lead/livestock tag chips. Confirm Today tab State A preview cards render with brand-green tint. Proceed when walks display correctly.

### Phase E — Nearby/Places tab
Re-implement the Google Places API call and venue rendering. Confirm venue results load and display. Confirm map renders via Leaflet CDN. Proceed when live venue results are visible.

### Phase F — Me tab and localStorage
Build the Me tab with stats row, favourites section, and settings. Implement localStorage persistence for: favourites (`sniffout_favs`), username (`sniffout_username`), active tab (`sniffout_active_tab`), session (`sniffout_session`), explored walks (`sniffout_explored`), radius (`sniffout_radius`). Confirm data persists across page refreshes.

### Phase G — Final polish, copy checks and PWA setup
Apply all remaining approved copy strings. Run the copy audit (prohibited strings check). Add PWA manifest link, service worker registration, and meta tags. Verify full done checklist below. This is the sign-off phase.

---

## What to Build — Specifications

### 1. CSS Token System

Use these values exactly. Sourced from mockup.html (authoritative).

| Token | Value |
|-------|-------|
| `--brand` | `#1E4D3A` |
| `--brand-mid` | `#2E7D5E` |
| `--bg` | `#F7F5F0` |
| `--surface` | `#FFFFFF` |
| `--border` | `#E5E7EB` |
| `--ink` | `#111827` |
| `--ink-2` | `#6B7280` |
| `--amber` | `#D97706` |
| `--red` | `#DC2626` |
| `--chip-off` | `#D1D5DB` |

Dark mode via `body.night` class. No glassmorphism, no `backdrop-filter`, no translucent or blurred surfaces anywhere.

### 2. Typography

Load **Inter** via Google Fonts CDN: weights 400, 500, 600, 700 only. Apply globally. No other typefaces.

### 3. Bottom Navigation

- Five tabs: **Today · Weather · Walks · Nearby · Me**
- Icons: **inline SVG only** — not emoji, not icon fonts. SVG path data for all five icons is in `mockup.html` lines 1792–1822. Use these exactly.
- Active state: filled SVG + `var(--brand)` label text
- Inactive state: outlined SVG + `var(--ink-2)` label text
- `padding-bottom: env(safe-area-inset-bottom)` — required for iPhone
- `border-top: 1px solid var(--border)`, `background: var(--surface)`

### 4. Card Base Styles

All cards across the entire app:
- `border-radius: 16px`
- `border: 1px solid var(--border)`
- `background: var(--surface)` on `var(--bg)` page background
- No glassmorphism, no blur, no translucent surfaces

### 5. Filter Chip and Segmented Toggle Styles

- Filter chips: inactive = `var(--chip-off)` border, `var(--ink-2)` text; active = `var(--brand)` fill, white text
- Segmented toggle (List/Map): active half = `var(--brand)` fill, white text; inactive = outlined

### 6. WALKS_DB Schema

Each walk entry must include these fields. Do not add anything else without PO sign-off. Remove the `icon` field — not in v2.

```
offLead:      "full" | "partial" | "none"
livestock:    boolean
hasStiles:    boolean
hasParking:   boolean
terrain:      "paved" | "muddy" | "mixed" | "rocky"
difficulty:   "easy" | "moderate" | "hard"
imageUrl:     string — use "" for all entries until photos are sourced
badge:        "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined
rating:       number
reviewCount:  number
distance:     number (miles)
duration:     number (minutes)
source:       "curated" | "places"
description:  string
```

`isPushchairFriendly` is removed. `icon` is removed. Do not add them back.

### 7. Walk Card

- Photo area: **180px tall**, lazy-loaded from `imageUrl`
- If `imageUrl` is `""` or absent: solid `#1E4D3A` background, nothing else — no emoji, no icon, no grey box
- Badge pill: **bottom-left of photo area** (`bottom: 12px; left: 12px`) — `background: rgba(0,0,0,0.55)`, white text, pill shape (`border-radius: 99px; padding: 4px 10px`) — same style for all badge types
- Heart/favourite icon: top-right of photo area, white circular background (`rgba(255,255,255,0.92)`)
- Metadata row: distance · duration · difficulty
- Tag chips: off-lead status chip always shown; livestock chip shown only if `livestock: true`

### 8. Today Tab — State A

The State A screen (no location set) must include, in order:

1. Wordmark header: `sniffout`
2. Hero headline: `Discover great walks`
3. Subline: `Handpicked walks. Live conditions.`
4. Body: `50+ handpicked UK walks with terrain, off-lead and livestock info — plus live weather checks and nearby dog-friendly spots.`
5. "Use my location" button (primary) + "or enter a place or postcode" secondary link
6. **Search input: starts hidden; expands with a CSS `max-height` transition when the secondary link is tapped.** See mockup.html for the expand behaviour.
7. Section label: `Here's what you'll see:` (or omit — not `WHAT YOU'LL GET:`)
8. Walk preview card with brand-green tint: `background: rgba(30,77,58,0.06)`, `border: 1px solid rgba(30,77,58,0.15)`. Must look like a real card at reduced opacity — off-lead badge, walk name, and tags readable. No lock overlay. No emoji icons. No "Set your location" copy.
9. Weather preview card (static, non-interactive): `⛅ Live weather + paw safety` / `Know before you go` — present in the signed-off mockup.html (line 1139–1146) and must be built.
10. Social proof strip: `50+ handpicked UK walks · Works offline · Dog-specific routes`

Search error: `We couldn't find that — try a postcode (e.g. SW11) or a place name.`

### 9. Copy — Full Approved String Reference

**Use these exactly. For all copy decisions, this brief is authoritative — not design-spec.md (its copy is outdated).**

**Page and metadata**
- Page `<title>`: `Sniffout — Dog walks & weather for the UK`
- Meta description: `Discover 50+ handpicked UK dog walks with live weather checks, paw safety alerts and nearby dog-friendly spots.`

**Weather verdict strings** (`getWalkVerdict()`)

| Condition | Title | Body |
|-----------|-------|------|
| Perfect | `🌤️ Lovely walking weather` | `[X]°C and [condition]. About as good as it gets — get out there.` |
| Good + high UV | `☀️ Good walking — strong UV` | `Lovely out, but UV is [X]. Walk in the shade where you can, and press your hand on the pavement before you start — if it's too hot to hold for 7 seconds, it's too hot for paws.` |
| Rain arriving | `🌂 Dry for now — rain arriving` | `Good window right now, but heavy rain is forecast within 3 hours. If you're going, go soon.` |
| Rain likely | `🌧️ Showers on the way` | `Dry now, but worth a jacket. A shorter walk while the window's open.` |
| Rain | `☔ It's raining — but walkable` | `Not ideal, but fine if you're dressed for it. Stick to shorter routes and dry off your dog when you're back.` |
| Rain + cold | `🥶 Wet and cold — make it a quick one` | `Rain plus cold is hard going. A short loop is fine, but wrap up and don't hang about.` |
| Cold | `❄️ Brisk walk day` | `Feels like [X]°C. Fine for a quick outing — just watch for ice on paths, and rinse paws when you're home if there's been gritting.` |
| Fog | `🌁 Foggy out there` | `Stick to familiar routes and keep your dog close. Low visibility means less reaction time for drivers on lanes and bridleways.` |
| Hot | `🌡️ Warm today — timing matters` | `At this temperature, pavement can get hot enough to burn paws. Walk in the morning or evening, bring water, and do the 7-second test before setting off.` |
| Storm | `⛈️ Not a walk day` | `There's a thunderstorm. Stay in — your dog would rather be safe than soggy.` |
| Very windy | `💨 Too gusty to be out` | `Gusts of [X] km/h today — enough to cause problems on exposed routes. Worth waiting for it to ease.` |

**Hazard warning titles**

| Condition | Title |
|-----------|-------|
| Extreme heat | `🌡️ Too hot to walk safely` |
| Hot | `☀️ Hot enough to hurt paws` |
| Thunderstorm | `⛈️ Thunderstorm warning — stay inside` |
| Dangerous gusts (≥60 km/h) | `💨 Dangerous winds — don't go out` |
| Strong gusts (≥45 km/h) | `💨 Very gusty — choose sheltered routes` |
| Dangerous cold | `🧊 Very cold — brief outings only` |
| Freezing | `❄️ Freezing — watch for grit and ice` |
| High UV | `🔆 Strong UV — pale and thin-coated dogs at risk` |

**Paw safety block**

| State | Title |
|-------|-------|
| Safe (< 20°C) | `🐾 Paws safe at [X]°C` |
| Caution (20–25°C) | `🐾 Paw check needed` |
| Danger (> 25°C) | `🐾 Too hot for paws` |

Safe state body: `At [X]°C, pavement is fine. If it gets above 25°C, press your hand on the tarmac — if you can't hold it for 7 seconds, it's too hot for your dog's paws.`

**Rain section summaries**

| State | String |
|-------|--------|
| Dry | `<strong>Looks dry</strong> for the rest of today` |
| Mostly dry | `<strong>Mostly dry</strong> — light showers possible. Worth a jacket.` |
| Brief showers | `<strong>Brief showers</strong> — about [X] hour. The dry windows are worth planning around.` |
| Wet afternoon | `<strong>Wet afternoon</strong> — [X] hours of rain, up to [X]mm forecast. Best to walk early.` |

**Best walk window**
- Good: `Best window today: [time] · [X]°C · [X]% chance of rain`
- Poor: `Best option today: [time] — but still [X]% chance of rain. Take a coat.`

**Walks tab**
- Filter empty state: `Nothing matching those filters right now. Show all walks →` (tapping clears all active filters)

**Me tab**
- Favourites empty: `Heart any walk to save it here.`
- Sign-in banner body: `Your favourites and reviews are saved on this device. Sync across devices is coming.`

### 10. Copy Audit — Prohibited Strings

Remove every instance of the following from the entire file:
- "free" as a product promise ("livestock-free" in walk descriptions is acceptable)
- "no sign-up"
- "no account"
- "no login"

---

## What Done Looks Like

Phase 1 is complete when every item below passes:

**CSS and typography**
- [ ] All 10 CSS tokens present with correct values (match mockup.html lines 14–23)
- [ ] No glassmorphism anywhere — no `backdrop-filter`, no blur, no translucent surfaces
- [ ] Inter loaded at 400/500/600/700, applied globally

**Navigation**
- [ ] SVG icons in nav — not emoji (SVG paths from mockup.html lines 1792–1822)
- [ ] Filled/outlined SVG states switch correctly on tab change
- [ ] Correct labels: Today · Weather · Walks · Nearby · Me
- [ ] `padding-bottom: env(safe-area-inset-bottom)` present

**Walk cards**
- [ ] 180px photo area, brand-green fallback — no emoji, no grey box
- [ ] Badge: bottom-left, `rgba(0,0,0,0.55)`, uniform pill style for all badge types
- [ ] Heart icon: top-right, white circular background
- [ ] Metadata row: distance · duration · difficulty
- [ ] Tag chips: off-lead always shown, livestock only if `livestock: true`

**WALKS_DB**
- [ ] All entries have v2 schema fields including `imageUrl: ""`
- [ ] `icon` field removed from all entries
- [ ] `isPushchairFriendly` not present anywhere

**Today tab State A**
- [ ] Hero headline: `Discover great walks` (no trailing period)
- [ ] Search input hidden by default, expands on tap
- [ ] Preview walk card: brand-green tint, no lock overlay, no emoji icons
- [ ] Weather preview card present: `⛅ Live weather + paw safety` / `Know before you go`
- [ ] Social proof: `50+ handpicked UK walks · Works offline · Dog-specific routes`

**Copy**
- [ ] Page title: `Sniffout — Dog walks & weather for the UK`
- [ ] All 11 verdict strings match Section 9 exactly
- [ ] All 8 hazard titles match Section 9 exactly
- [ ] Paw safety titles and body match Section 9
- [ ] Rain summaries and best walk window match Section 9
- [ ] No prohibited strings anywhere (no sign-up, no account, no login, free as product promise)
- [ ] 🐾 emoji only in paw safety block — nowhere else
- [ ] Em dashes (`—`) used throughout, not hyphens

**Technical**
- [ ] Dark mode (`body.night`) working correctly with new tokens
- [ ] localStorage persistence confirmed for favourites, session, active tab
- [ ] App loads and fully navigable on iPhone Safari at 375px viewport
- [ ] PWA manifest linked, service worker registered

---

## Constraints and Watch-Outs

- **No new features.** `getWalkVerdict()` for Today tab State B, filter chip logic, radius selector, walk detail overlay are all Phase 2.
- **No onboarding overlay.** Out of scope for the entire current build.
- **No Community tab.** Five tabs only — no sixth tab, no placeholder.
- **mockup.html is the layout reference; this brief is the copy reference.** When mockup copy differs from Section 9 (e.g. social proof strip shows outdated text), use Section 9.
- **design-spec.md verdict strings are outdated — do not use them.** Use Section 9 of this brief only.
- **Photo sourcing** is handled by the project lead. Brand-green background is the correct interim state.
- **`sw.js` and `manifest.json`** — do not modify.
- **`dog-walk-dashboard.html`** — do not open, do not reference, do not copy from.
