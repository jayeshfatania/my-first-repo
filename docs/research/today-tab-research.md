# Sniffout — Today Tab UX Research
*Researcher role. March 2026. Output for Designer use.*

---

## Context

The Today tab has two distinct states:

- **State A** — No location set. User hasn't entered a location yet (first-time, or location cleared).
- **State B** — Location known. User sees a weather card and a horizontal walk card scroll. Space below is currently unfilled.

This report covers competitor patterns for both states and translates them into concrete proposals.

---

## Competitor Research Summary

### AllTrails
The closest structural comparator to Sniffout. Walk/trail discovery, no login required, location-based content.

**State A behaviour:** AllTrails never shows a blank canvas. The moment location is granted, the Explore screen populates with nearby trails. There is no empty state — content appears before the user types anything. Users with no history see the same rich map + card list as a returning user.

**State B behaviour:** Discovery is persistent, not one-time. The home/explore screen stays location-anchored and keeps showing curated trails. Saved walks, completed history, and community reviews live in separate tabs — the home screen is always a discovery surface.

**Daily hook:** Users consistently report opening AllTrails before every walk to read recent trail condition reviews. The live conditions layer (posted by other users) turns a static directory into a daily-check product.

**Key insight:** The daily hook is not the map or the trails — it is the *freshness signal*. "What are conditions like today?" is a habit-forming question that the app answers by showing it.

---

### Citymapper
Highest-rated transit app in the UK. Known for zero-friction first open and returning user context.

**State A behaviour:** The app requests your city (not full location) up front, then shows you a live map with nearby transit stops immediately. There is no search-first pattern — you see your environment before you type anything. Empty "Home" and "Work" shortcut slots act as a lightweight, in-context setup prompt rather than a separate onboarding flow.

**State B behaviour:** The home screen reflects the user's own context — Home and Work shortcuts appear with pre-computed routes and departure times. Opening the app already answers the question before the user articulates it.

**Key insight:** The Home/Work shortcut pattern is the single most-praised feature across Citymapper reviews. The principle: surface the user's most likely intent without requiring input. Applied to Sniffout, this is the "your saved location, today's conditions" card.

---

### Komoot
Route planning / outdoor app. Editorial quality is their differentiator.

**State A behaviour:** First open shows a *Discover* feed of photo-forward route cards — editorial picks, regionally popular routes, curated collections. The feed is never empty because it is editorial (no social graph required). New users see the same rich content as established users.

**State B behaviour:** Feed personalises over time, but the structure does not change: one editorial/featured section, one regional trending section, one social section. The home screen is a consistent magazine-style format where content cycles, not a different screen for different user states.

**Key insight:** Using editorial content to fill State A means first-time users see the same quality experience as established users. The home screen does not feel broken or empty on day one.

---

### Strava
Fitness tracking. The clearest antipattern in the research.

**State A behaviour:** After account creation, the home feed is empty. The screen shows a prompt to "follow athletes" or "connect friends." This is widely cited in user research as a friction point and drop-off trigger. The empty feed makes the app feel useless until a social graph is established.

**Key insight (antipattern):** A home screen that depends on user-generated social content to feel complete will always fail for new users and infrequent users. Sniffout must not rely on any content mechanism that requires the user to build up a history or network before the screen feels useful.

---

### Headspace / Calm (UK lifestyle apps)
Best-in-class daily habit apps. Both are direct models for the daily hook problem.

**Headspace State B:** The "Today" tab is the home screen. It shows a morning session, afternoon check-in, and evening wind-down — all time-aware and refreshed every day. Opening the app at 7am shows different content than opening it at 9pm. The home screen answers "what should I do right now" without any search.

**Calm State B:** A single featured "Daily Calm" card occupies the hero position. One clear action per open. Secondary content (sleep stories, courses) lives below but does not compete with the primary card.

**Key insight:** Both apps treat the home screen as a *daily programme*, not a catalogue. The structure stays constant; the content changes daily. This is what creates habit: users know the format, but the content gives them a reason to check.

---

## Cross-App Patterns — What Consistently Works

**1. The home screen is never empty.** Every well-rated app ensures State A has real content visible without any user input. Location-based defaults (AllTrails, Citymapper) or editorial content (Komoot, Calm) both achieve this. The blank "tell us about yourself" screen is associated with lower App Store ratings and higher early drop-off.

**2. One primary CTA above the fold.** Hero space = one invitation, not a menu. Calm: one Daily Calm card. Citymapper: one search bar + map. AllTrails: one map with trails loaded. Complexity lives below the fold.

**3. Live conditions are the natural daily hook for outdoor apps.** AllTrails' most-praised feature is the user-generated trail condition updates — users open it before every walk to check current conditions. Sniffout already has live weather as a core differentiator. Surfacing it as a genuine "is today a good day?" signal on the home screen turns weather from a feature into a daily reason to open the app.

**4. Returning user context should be visible immediately.** Citymapper's Home/Work shortcuts, Headspace's streak. The returning user's home screen should reflect their world back at them — saved location, walk history, conditions for today — without requiring any navigation.

**5. Below the hero card, three layers work consistently.** Across Komoot, AllTrails, and Headspace: (1) curated/editorial picks, (2) nearby or personalised content, (3) a discovery/browse section. Each layer has a clear header and horizontal scroll or compact vertical list. This structure works for both a 5-second glance and a longer browse.

---

## Proposals — State A (No Location Set)

The current screen: headline, "Find walks near me" CTA button, search bar.

### Proposal A1 — Lead with what they'll get, not what to type
**Pattern:** Komoot/AllTrails editorial-first.

Place a static hero card above the CTA that shows a real curated walk: photo, name, a badge ("Sniffout Pick"), and a short one-line hook ("3.2 miles · Richmond Park · Off-lead allowed"). This card is a teaser — tapping it prompts location. It answers "what does this app actually show me?" before the user commits to anything.

Supporting copy change: "Set your location to see walks near you" as a subtitle directly above the CTA, replacing or supplementing the current subline.

### Proposal A2 — Location permission as a reveal, not a gate
**Pattern:** AllTrails contextual permission.

Show a greyed-out or softly blurred card layout behind the CTA — the silhouette of what the screen will look like once location is set. The CTA label becomes "Reveal walks near you" or "See what's nearby". This visual preview demonstrates the value before the user commits, which is associated with higher location permission acceptance in user research.

### Proposal A3 — Scroll of static editorial content below the CTA
**Pattern:** Komoot editorial Discover.

Below the CTA and search bar, render 3–4 static "Sniffout Pick" trail cards in a horizontal scroll. These are not location-filtered — they are editorially chosen UK walks (Richmond Park, Hampstead Heath, Peak District, etc.) presented as "Popular nearby walks — set your location to see what's closest." This gives the screen a complete, useful feel without any location data.

No user action needed; no empty state; the app looks full from the first tap.

### Proposal A4 — Inline personality, not a blank form
**Pattern:** Monzo/Headspace copy approach.

Instead of the current generic "Enter place name or postcode" placeholder, the search bar placeholder cycles through one of three strings on each open:
- "Try: Richmond, SW London..."
- "Try: a postcode or town name"
- "Try: Hampstead, Brighton, Oxford..."

Pair this with a short contextual sub-prompt below the search bar: "We'll find the best walks and today's conditions." This sets expectations and makes the screen feel considered rather than generic.

### Proposal A5 — Social proof strip (static)
**Pattern:** Used across Calm, Headspace, Monzo onboarding.

A single small text strip below the CTA: "25 handpicked UK walks. Updated conditions. No account needed." This answers the three most common questions a first-time user has (what's in it, is it current, do I have to sign up) in one sentence and fills the visual gap below the button without adding layout complexity.

---

**Top Recommendation — State A: Proposal A3 (Editorial walk cards below the CTA)**

Reasoning: This solves the most critical problem (blank screen on first open) without requiring any design system changes or new patterns. The current CTA button and search bar stay exactly as-is. Three static trail cards in a horizontal scroll below them — rendered immediately, no location required — transform the screen from an empty form into a product preview. It follows the Komoot pattern, which is the highest-rated outdoor app for first-run experience. It costs one component (the horizontal trail card scroll, which already exists in the Walks tab). The editorial curation supports Sniffout's positioning ("handpicked walks") — the first thing a new user sees is evidence of curation, not a blank invitation to search.

---

## Proposals — State B (Location Set, Weather Card + Walk Cards Visible)

The current screen: weather card, horizontal walk card scroll. Empty space below.

### Proposal B1 — "Today's verdict" persistent summary block
**Pattern:** Headspace Today tab / Calm Daily Calm card.

A card directly below the walk scroll that summarises the day's conditions in one line of copy — using the existing `getWalkVerdict()` output: "Good day for a walk" / "Muddy underfoot after last night's rain" / "Hot pavement risk: plan for early morning."

This card does not duplicate the weather card above it — the weather card shows data (temp, forecast, wind). This card shows the *interpretation*: what it means for a dog walk today. It uses copy the user can act on.

This card refreshes daily by definition (weather changes). It becomes the daily signal that makes opening the app every morning worthwhile.

### Proposal B2 — "Your recent walks" horizontal strip
**Pattern:** Citymapper Home/Work shortcuts.

If the user has favourited or explored walks, a compact horizontal strip below the walk carousel shows those walks with a "Nearby" or "Ready to rebook" label. Walk cards are smaller (portrait format) — name, distance, quick-access.

If no history, show nothing (hide the strip entirely rather than showing a blank placeholder). This avoids the Strava antipattern of showing an empty section with a prompt.

### Proposal B3 — Contextual tip block (time-aware)
**Pattern:** Headspace time-aware content.

A single-row card that changes based on time of day:
- **Morning (6–10am):** "Early morning walks are ideal today — pavement cools overnight."
- **Midday (10am–3pm):** "Midday heat warning: plan walks before 11am or after 4pm."
- **Evening (after 6pm):** "Good evening conditions. Lighter traffic on most trails after 7pm."
- **Night:** card is hidden.

This is not generated from complex logic — it uses a simple time check + the existing weather data (temp, UV) that is already fetched. Three or four conditional strings, no new API call.

### Proposal B4 — "Hidden gems near you" editorial section
**Pattern:** Komoot editorial / AllTrails curated section.

A second horizontal scroll below the main curated walks carousel, labelled "Hidden gems near [location]". This section shows the walks in `WALKS_DB` that carry a "Hidden gem" badge, filtered by radius. Unlike the main Community Picks carousel (which sorts by distance), this one sorts by badge type — surfacing lesser-known walks that nearby distance-sorting would bury.

This gives the user a discovery reason to scroll below the fold on return visits, not just first open.

### Proposal B5 — Live conditions snippet from the weather data
**Pattern:** AllTrails trail condition reviews (freshness signal).

A slim, text-forward card: "Conditions today: [icon] [text]". For example:
- "Conditions today: 🌧 Wet underfoot — muddy on grass paths"
- "Conditions today: ☀️ Dry and firm — ideal for any terrain"
- "Conditions today: 🌬 Gusty — stick to sheltered woodland today"

This is generated from the existing Open-Meteo data (wind speed, precipitation, temp) and uses the weather hazard logic already in the app. It doesn't require a new section or new data — it repackages existing data as a daily freshness signal. Visually it is one thin strip with an icon and a line of copy.

---

**Top Recommendation — State B: Proposal B1 (Today's verdict block) + Proposal B4 (Hidden gems section)**

Reasoning:

**B1 (Today's verdict)** directly addresses the daily habit question: "why would a dog owner open this app every single day?" The walk verdict is already computed by the app — it just isn't surfaced on the home screen. Placing it as a persistent card below the walk scroll answers the user's morning question ("is today a good day for a walk?") in one glance, without requiring them to navigate to the Weather tab. This turns the Today tab into a genuine daily briefing, not a launcher for other tabs. The Headspace/Calm model of a single contextual-content card as the home screen anchor is the strongest daily retention pattern found in the research.

**B4 (Hidden gems)** addresses the returning-user browsing problem: what is there to discover below the fold on the second, fifth, twentieth open? A static list of the same walk cards will not bring users back. A "Hidden gems" section that filters to badge type creates a curated discovery layer that feels editorially distinct from the main carousel. Combined with Proposal B1 above it, the Today tab then has three clear sections: (1) weather + verdict, (2) curated walks near you, (3) hidden gems nearby. This is structurally equivalent to the three-layer below-the-fold pattern found in Komoot, AllTrails, and Headspace — and it uses no new data, no new APIs, only existing WALKS_DB fields.

---

## Summary Table

| | Top Recommendation | Why |
|---|---|---|
| **State A** | Editorial walk cards below CTA (A3) | Solves blank screen with existing components. No new data needed. Demonstrates product value before location is set. |
| **State B** | Walk verdict block + Hidden gems (B1 + B4) | Turns weather into a daily check habit. Gives returning users a discovery reason to scroll. Uses only existing data and fields. |

---

*Sources: AllTrails support docs and App Store reviews; Citymapper user research and redesign case studies; Komoot product blog and reviews; Strava community hub and UX analysis; Headspace and Calm product blog and UX analyses; Nielsen Norman Group empty states; Smashing Magazine onboarding patterns.*
