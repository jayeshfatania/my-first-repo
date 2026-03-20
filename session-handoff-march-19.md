# Sniffout — Session Handoff Note
**Date:** 19 March 2026
**Last updated:** 20 March 2026
**Prepared by:** Product Owner agent
**Purpose:** Complete context handoff for the next Claude chat session. A new session reading this document should be able to pick up immediately with zero loss of context.

---

## SECTION 1 — WHAT IS SNIFFOUT

### Product description

Sniffout is a mobile-first Progressive Web App (PWA) for discovering dog walks across the UK. It is built and deployed as a single HTML file on GitHub Pages at `sniffout.app`. There is no backend, no login required, and no build tools — everything runs in the browser using `localStorage` for state.

The product is currently a **Proof of Concept (POC)**, being validated with real users before investing in a backend (Firebase). The owner's goal is a soft launch to beta testers. No pressure to ship — thoroughness takes priority over speed.

### The strategic reframe

Sniffout is shifting from a **discovery tool** ("find a good walk, check the weather, go") to a **personal record** — a dog walking journal that happens to also be the best way to find new walks.

This is a critical strategic distinction. Discovery tools are used occasionally and replaced when something better appears. Personal records are irreplaceable. "We've done 34 walks together, and I have notes from most of them" is not something a user migrates away from. The dog profile and walk journal features shipped in Rounds 19 and 20 are the mechanism for this shift.

### Competitive position

- Closest competitor: **PlayDogs** (France/Switzerland, 170k downloads) — relies on community-generated content, currently empty across the UK. No curated foundation.
- No UK competitor combines: walk discovery + live weather + dog-specific hazard context + no login required.
- Closest UK structural analogue: **Walk Highlands** (Scotland-focused, desktop-era, no app). Sniffout is a mobile-first PWA improvement on that model.
- **AllTrails** and **Komoot** are not direct competitors in the dog owner segment — they have never addressed the dog-specific angle meaningfully.

### Current phase

Phase 2: localStorage only (no backend). Firebase is Phase 3, elevated to the top of Phase 3 priority because the app now holds irreplaceable personal data (walk journal, notes, dog profile, photos).

---

## SECTION 2 — LIVE URLS AND TECHNICAL SETUP

### Live URLs

| URL | Status | What it serves |
|-----|--------|----------------|
| `https://sniffout.app` | Live | GitHub Pages — `index.html` redirects to `coming-soon.html` intentionally. Coming soon page shown at root. |
| `https://sniffout.app/sniffout-v2.html` | Accessible — direct link only | v2 app. Not the default yet — accessible by direct URL only until public launch. |
| `https://sniffout.co.uk` | Registered but not yet redirecting | Should point to `sniffout.app` — not yet set up (pre-launch checklist item B2). |
| `https://jayeshfatania.github.io/my-first-repo/` | Live (base URL) | Same as above. |
| `https://places-proxy.sniffout.app` | Live — fully working | Cloudflare Worker proxy for Google Places API. Key secured server-side. |

**Note on T14:** `manifest.json` `start_url` is now correctly set to `/sniffout-v2.html`. Installed PWA no longer shows a 404. The `index.html` → `coming-soon.html` redirect is intentional — the app is not publicly accessible at the root URL until launch.

### Repository

- **Repo:** `github.com/jayeshfatania/my-first-repo`
- **Main branch:** `main`
- **Deployment:** GitHub Pages, auto-deploys on push to `main`. Deploys in approximately 1 minute.
- **Production file (v1):** `dog-walk-dashboard.html` — DO NOT TOUCH. Protected per CLAUDE.md.
- **Active development file:** `sniffout-v2.html` — all changes go here.

### Git workflow

```bash
cd ~/Desktop/my-first-repo
git add .
git commit -m "descriptive message here"
git push
```

No branches, no PRs, no staging environment. Push directly to main. GitHub Pages auto-deploys.

**Rollback:** `git revert HEAD` then `git push`, or find the previous commit hash with `git log` and hard reset. The single-file architecture makes rollback straightforward.

### Tech stack

| Component | Technology |
|-----------|-----------|
| Application | Single HTML file (`sniffout-v2.html`) — inline CSS in `<style>`, inline JS in `<script>` |
| Deployment | GitHub Pages, custom domain via `CNAME` file |
| Weather | Open-Meteo API (no auth, free tier) — always fetches fresh on every load |
| Dog-friendly venues | Google Places API (New) — requests routed via Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| Reverse geocoding | Nominatim/OSM (no auth) |
| UK postcode lookup | postcodes.io (no auth) |
| Map rendering | Leaflet 1.9.4 (CDN) |
| Icons | Lucide icons (inline SVG, custom function `luIcon()`) + Yr.no weather SVG icons |
| Weather icon sets | Today tab uses white Lucide icons; Weather tab uses Yr.no meteocon SVGs (96px, margin-top 14px) |
| Typography | Inter (Google Fonts CDN) |
| Service worker | `sw.js` — network-first, cache fallback, cache key `sniffout-v2` |
| PWA manifest | `manifest.json` — `start_url` set to `/sniffout-v2.html`, `theme_color` `#3B5C2A` |
| Brand colour | `#3B5C2A` (Meadow Green) — fully implemented throughout |

### Local dev

```bash
cd ~/Desktop/my-first-repo
python3 -m http.server
```

Then open `http://localhost:8000/sniffout-v2.html` in Chrome. No build step needed.

### API key security

Google Places API key is secured behind the Cloudflare Worker proxy at `places-proxy.sniffout.app`. The key is not in page source. Place photo requests also route through the proxy. Pre-launch checklist item T1 is resolved. Do not revert to direct Google URL under any circumstances.

---

## SECTION 3 — HOW CLAUDE IN CHAT COORDINATES THE PROJECT

This section is critical context for any new Claude session. Read it carefully.

### The role of Claude in chat

Claude in the chat session (separate from any agent running in tmux) acts as:

1. **Project coordinator** — tracks what each agent is working on, what is waiting, and what needs to happen next
2. **Sounding board** — the owner talks through product decisions with Claude before acting on them
3. **Technical guide** — explains what code changes mean, interprets terminal output, helps troubleshoot errors in plain English
4. **Quality controller** — reviews all agent outputs before the owner acts on them; flags issues before they reach the codebase
5. **Prompt drafter** — drafts ALL prompts that go to agents. The owner never writes a raw prompt directly — Claude drafts it, the owner reviews and approves, then pastes it into the correct tmux pane
6. **Git command provider** — provides the exact git add / commit / push commands. The owner pastes them into terminal. Claude never directly pushes code
7. **Decision tracker** — maintains a running list of observations, issues, and decisions needed from the owner
8. **Handoff author** — at the end of each session, writes the handoff note for the next session

### Working guidelines (non-negotiable)

These apply in every session without exception:

- **Developer briefs always include:** the file protection warning (never touch `dog-walk-dashboard.html`), no em dashes instruction for any copy, the exact git commands to run, and a request for the Developer to summarise what was changed.
- **Draft ALL agent prompts** before the owner pastes them. Owner never writes raw prompts directly.
- **Review ALL agent outputs** before recommending next steps. Never wave through agent work without checking.
- **Flag decisions explicitly** — when an agent output contains something requiring an owner decision, flag it clearly before moving on. Do not silently resolve it.
- **Run agents in parallel** where tasks are independent. If Designer and Researcher are on unrelated tasks, issue both prompts at once.
- **Follow the content pipeline strictly:** Researcher → Copywriter → Editor → Validator → Developer. No shortcuts. No Copywriter output goes to Developer without passing through Editor and Validator.
- **Plain English always** — the owner was new to terminal and git at the start of this project. Explain what commands do before giving them. Never assume knowledge of web development, git internals, or terminal syntax.
- **Owner makes all final decisions** — Claude recommends, never decides. Do not proceed with significant changes without explicit owner direction.
- **Quality over speed** — no pressure to ship. Flag issues clearly. Do not wave through borderline content to keep things moving.
- **Agent prompts always start with role and CLAUDE.md instruction** — every prompt begins "You are the [Role] for Sniffout" and instructs the agent to read `CLAUDE.md` before starting.
- **Designer produces recommendations only — never edits code.** The Designer spec files go to the Developer for implementation. If the Designer pane accidentally runs developer work (edits `sniffout-v2.html`), discard the changes immediately with `git checkout sniffout-v2.html` and re-brief the Developer correctly.
- **When badge icons or similar asset implementations fail silently**, check for duplicate function names and mismatched render paths before assuming an ID mismatch. This was the root cause of the badge icon issue in Round 26/27 — a duplicate `renderMeBadges` function was silently taking precedence.
- **Free-form walk logging is live.** The walk journal now accepts both curated (`type: "curated"`) and user-created entries (`type: "custom"`). All functions that work with the walk log must handle both types correctly.
- **Wishlist = "On my sniff list", Favourites = "Sniffed and approved".** These are confirmed brand names. Any Developer brief or copy touching these features must use these exact labels.
- **A second UX/UI review pass will be needed** after State A first-run redesign and dark mode colour rethink are implemented. Do not treat Round 31/32 as the final UX review.

### The content pipeline

All new walk content moves through a fixed pipeline. Claude coordinates each handoff:

```
Researcher → Copywriter → Editor → Validator → Developer (content update)
```

- **Researcher** produces verified walk data (lat/lon, terrain, difficulty, off-lead status, etc.)
- **Copywriter** writes 2-4 sentence persona-based descriptions for each walk
- **Editor** reviews descriptions for persona voice, rule compliance, quality
- **Validator** cross-checks walk data fields for accuracy, flags issues
- **Developer** adds verified, edited, validated content to `WALKS_DB` in `sniffout-v2.html`

Claude reviews Editor and Validator outputs before they go anywhere.

### Agent role discipline

The PO also acts as Validator on this project. This has been explicitly approved by the owner. There is no conflict because the Validator role is factual accuracy checking, not creative or strategic. The owner makes all launch readiness decisions regardless.

If the owner accidentally sends a task meant for another agent (Copywriter, Editor, Validator, Researcher, Developer, Designer), flag it, name the correct agent, and push back — do not silently absorb it.

---

## SECTION 4 — AGENT TEAM

All agents run as Claude Code sessions in tmux panes, operating on the repository at `~/Desktop/my-first-repo`.

| Agent | Role | Typical output |
|-------|------|----------------|
| **Product Owner (PO)** | Translates owner direction into structured decisions and developer briefs. Reviews research and design outputs. Writes action plans and handoff notes. Also acts as Validator. | `po-action-plan-roundNN.md`, `session-handoff-*.md`, `validation-report-batch-0N.md` |
| **Developer** | Implements all code changes in `sniffout-v2.html`. Writes no specs or documentation. Follows developer briefs precisely. | Modified `sniffout-v2.html`, pushed to GitHub Pages |
| **Designer** | Produces design specs and UX decisions. Does not write code — ever. Produces spec files that Developer briefs reference. | `*-spec.md`, `*-redesign-spec.md`, mockup HTML files |
| **Researcher** | Researches specific topics (walk data, competitor analysis, feature best practices). Produces verified research documents. | `*-research.md`, `walks-batch-0N-data.md` |
| **Copywriter** | Writes walk descriptions in persona voice. Uses the 5 personas in `copywriter-personas.md`. | `descriptions-batch-0N.md` |
| **Editor** | Reviews Copywriter output for persona voice, rule compliance, and quality. Returns edited descriptions. | `editor-review-batch-0N.md` |
| **Validator** | Cross-checks walk data fields in batch data files and descriptions for accuracy, consistency, and schema compliance. | `validation-report-batch-0N.md` |

---

## SECTION 5 — WHAT WAS BUILT: COMPLETE ROUND HISTORY

### Round 11 — Walk detail overlay, Yr.no icons, trail card declutter

- Walk detail overlay redesigned as a bottom-up panel
- Yr.no meteocon weather icons integrated (replacing emoji)
- Trail card UI decluttered

### Round 12 — Swipe dismiss, conditions z-index, tag conflicts, walk logging foundation

- **FIX 13.1** — Swipe-down gesture to dismiss walk detail overlay. Drag handle visual affordance. `initWalkDetailSwipe()`.
- **FIX 13.2** — Conditions prompt z-index fix (was hidden behind overlay). Raised to z-index 401. Replaced session-level dismissal with `hasSubmittedTagsToday()` 24-hour check. Added "Add or update conditions" manual re-trigger link.
- **FIX 13.3** — Contradictory condition tags: `COND_CONFLICTS` map for `busy`/`quiet` mutual exclusion only.
- **FIX 13.4** — Walk log data model: replaced `sniffout_walked` with `sniffout_walk_log` (timestamped entries). Three-state button (never walked / walked today / walk again). One-time migration from old schema. Undo toast removed.

### Round 12b — Android swipe fix, bottom close button

- Android-specific swipe dismiss bug fixed
- Bottom close button added

### Round 13 — Walk history, badges, disclaimer, dark mode fix

- **FIX 14.1** — Duplicate `devils-dyke` entry removed
- **FIX 14.2** — Leaflet map touch interactions disabled in walk detail overlay
- **FIX 14.3** — `sniffout_explored` schema upgraded to timestamped object
- **FIX 14.4** — Walk detail overlay disclaimer added. Passive footnote strip, 12px, info circle icon. Copy: "Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go."
- **FIX 14.5** — Walk history section in Me tab (`renderWalkLogSection()`) — 5 most recent, "See all walks" sheet
- **FIX 14.6** — Gamification helpers + badge display: `getCurrentStreak()`, `getLongestStreak()`, `getTotalDistanceMi()`, `getEarnedBadges()`. Badge chips in Me tab. Stats row updated.
- **FIX 14.7** — Dark mode toggle visibility fix

### Round 14 — Settings fix, favourites compact, Android back button

- **FIX 15.1** — Miles label: "~X mi explored" with tilde prefix and disclaimer
- **FIX 15.2** — Favourites compact list in Me tab
- **FIX 15.3** — Android back button handler extended to close overlays/sheets
- **FIX 15.4** — Settings visibility fix (content appearing in body instead of sheet)

### Round 15 — Recent searches, place favouriting, Me tab rethink, badge system

- **FIX 16.1** — Recent and starred searches extended to State B (inline location-change panel)
- **FIX 16.2** — Place favouriting: heart icon on Nearby tab venue cards, `sniffout_place_favs` localStorage, count in Me tab stats
- **FIX 16.3** — Me tab rethink (from `me-tab-rethink-v2-spec.md`): miles hero stat, earned badges only, walk log
- **FIX 16.4** — Badge system replacement (from `badge-system-rethink.md`): 10 new badges, hidden until earned, earned moment copy, toast reveal, inline detail on chip tap
- **FIX 16.5** — Android back button refinement

### Round 16 — See all favourites, weather swipe, icon consistency, conditions back button

- See all favourites bottom sheet overflow fix
- Weather tab swipe-dismiss gesture
- Weather icon consistency: Today 72px/6px margin-top, Weather 80px/14px margin-top
- Conditions sheet back button added
- Info button added
- All bottom sheets support swipe-to-dismiss
- Nearby venue cards tappable
- Saved places filter added

### Round 17 — Settings root cause, Me tab dashboard, info button, green space favouriting

- Settings root cause identified and properly fixed
- Me tab dashboard: miles walked, places found, contributions made
- Info button added to filter pills row
- Green space venue type added to favouriting
- Weather icon size adjustment

### Round 18 — Settings buttons, favourites overflow, weather icon, green space heart

- Settings buttons investigation and fix
- Favourites sheet overflow resolved
- Weather icon position/size refinement
- Green space heart updates immediately on tap

### Round 19 — DOG PROFILE (largest round in the project)

Full dog profile system:

- **localStorage additions:** `sniffout_dogs` (array, multiple dogs from day one), `sniffout_wishlist`, walk notes on log entries, weather context on log entries
- **Dog setup card:** first Me tab visit, one field (dog name), "Skip for now" option
- **Dog profile editor:** name, breed (62 UK breeds + Other), size, personality tags (max 3 from 8), birthday (day/month/year)
- **Me tab personalisation:** dog avatar, dog name throughout, `heroLabel()` / `heroSub()` personalised copy, empty states personalised
- **Multiple dogs:** inline switcher in Me tab header. Active dog drives all copy. Walk log entries tagged with `dogId`. This is Phase 2 — not deferred.
- **Walk notes:** persistent inline textarea in walk detail overlay. No character limit.
- **Wishlist button:** bookmark icon on walk cards and detail overlay. Semantically distinct from favourites.
- **Badge system final replacement:** 10 badges, hidden until earned, earned moment framing
- **Birthday banner:** Today tab, appears on matching day/month, dismissible

### Round 20 — Walk journal, walk photos, empty states, dark mode, weather icon 96px

- Walk journal section in Me tab: chronological log with notes
- Walk photos: one per visit, canvas compressed ~200KB, base64 localStorage (TEMPORARY — Firebase Storage Phase 3). "Photos are saved on this device only" copy surfaces limitation.
- Empty states improved across all tabs
- Dark mode: "Auto" renamed "Match device", now uses `prefers-color-scheme` instead of sunrise/sunset
- Moon icon fix
- "~" prefix on miles confirmed throughout
- Walk notes visually distinct in journal
- Weather tab hero icon increased to 96px

### Round 21 — Birthday day field, photo picker camera/gallery choice

- Birthday stores day/month/year (not just month/year)
- Photo picker: explicit camera vs gallery choice

### Round 22 — Birthday banner fix, Today tab icon revert to Lucide

- **FIX 22.1** — Birthday banner root cause found and fixed
- **FIX 22.2** — Today tab icon reverted from Yr.no back to Lucide (white). Today = Lucide, Weather = Yr.no. Confirmed design decision.

### Round 23 — Dog profile prompt in Me tab, pubs/restaurants (later reverted)

- **FIX 23.1** — Dog profile prompt added to Me tab. Intact.
- **FIX 23.2** — Pubs and restaurants added to Nearby tab. **Permanently reverted.** Too many non-dog-friendly results. Pubs restored as standalone category. `developer-brief-restaurants.md` documents the intended future implementation.

### Round 24 — Me tab polish, dark mode toggle, settings separation

- Me tab stats show dashes (not zeros) when no data
- Weather icon alignment on Weather tab confirmed correct
- Dark mode toggle default fixed (was defaulting to Light incorrectly)
- Settings and dog profile separated into distinct sections

### Round 25 — Brand colour update to Meadow Green

- `--brand` updated to `#3B5C2A` throughout `sniffout-v2.html` and `manifest.json`
- All `rgba()` chip tint values updated
- `CLAUDE.md` updated to reflect new colour

### Round 26 — Saved places fix, heart icons, weather hero, note save button, fresh weather

- **FIX 26.1** — Saved places not appearing in Me tab. localStorage key mismatch (`sniffout_place_favs` vs `sniffout_saved_places`). Fixed across all three read locations.
- **FIX 26.2** — Empty state copy: "bookmark icon" corrected to "heart icon"
- **FIX 26.3** — Heart icon disappearing on Walks tab fixed with `z-index: 1` on `.walk-heart`
- **FIX 26.4** — Weather tab hero alignment fixed. Gap 56px, icon 96px, vertically centred. (Iterated as 26.4b and 26.4c to reach final values per Designer spec.)
- **FIX 26.5** — Weather tab wrong icon fixed. Replaced stale `is_day` cache with live hour-based check (`currentH >= 6 && currentH < 21`)
- **FIX 26.6** — Save button added to walk note input with 2-second confirmation message
- **FIX 26.7** — Weather always fetches fresh on every load. Renders instantly with cache, re-renders with live data when fetch completes.
- **Badge custom icons** — all 10 badges now show unique custom SVG icons. Root cause of earlier failure: duplicate `renderMeBadges` function silently taking precedence. Correct function wired to all call sites.

### Round 27 — Me tab avatar, stats dashboard, entry point rows

- Me tab avatar, stats dashboard, and subpage entry point rows reviewed and gaps filled. Most of this work was already in place from previous rounds.

### Round 28 — Me tab subpage overlays confirmed

- All four subpage overlays confirmed built and wired: Walk Journal, Badges, Saved Walks, Saved Places. Each entry point row correctly opens its corresponding subpage overlay.

### Round 29 — Units toggle, formatDist helper, em dash sweep

- **FIX 29.1** — km/miles units toggle added to Settings. Defaults to km. Saves to `sniffout_units` in localStorage.
- **FIX 29.2** — `formatDist()` helper applied across all distance displays in the app. Respects `sniffout_units` consistently.
- **FIX 29.3** — Me tab stats label updates dynamically when units setting changes. `~` prefix confirmed throughout.
- **FIX 29.4** — Em dash sweep complete. No em dashes or en dashes remain anywhere in user-facing copy.

### Round 30 — Free-form walk logging

- **FIX 30.1** — Walk log schema extended with `type` field (`"curated"` | `"custom"`). Existing entries default to `"curated"` via fallback — no migration needed.
- **FIX 30.2** — "Log a walk" button and bottom sheet added to Walk Journal. Fields: name (required), date (defaults to today), distance (optional), duration (optional), notes (optional).
- **FIX 30.3** — Custom entries display in the journal timeline with a "Your route" chip.
- **FIX 30.4** — Me tab stats include custom walk distances in total miles calculation.

### Round 31 — UX review blockers and high priority fixes

- **FIX 31.1** — Filter button tap target increased to 44px.
- **FIX 31.2** — Heart buttons increased to 44x44px.
- **FIX 31.3** — Walk photo placeholder replaced with gradient.
- **FIX 31.4** — Nearby category chips increased to 44px.
- **FIX 31.5** — Mark as walked button increased to 44px.
- **FIX 31.6** — Empty name state in Me tab header fixed.
- **FIX 31.7** — Dark mode card surfaces raised to `#243A2C`.
- **FIX 31.8** — Leaflet map inverted in dark mode.
- **FIX 31.9** — Location link underline removed.

### Round 32 — Medium priority UX fixes

- **FIX 32.1** — Nav labels increased to 11px.
- **FIX 32.2** — Inactive tab dimming increased to 50%.
- **FIX 32.3** — Walk photo placeholder gradient updated.
- **FIX 32.4** — Add photo button dashed border replaced with solid, camera icon added.
- **FIX 32.5** — Hero headline increased to 32px.
- **FIX 32.6** — Sheet handles unified across all sheets and subpages.
- **FIX 32.7** — Walk rating increased to 13px.
- **FIX 32.8** — Dog profile subpage inline padding moved to CSS class.
- **FIX 32.9** — Favourite and wishlist labels added (later removed as unnecessary).

### Round 33 — Sniff list labels and fixes

- **Wishlist renamed** to "On my sniff list" — confirmed brand language.
- **Favourites renamed** to "Sniffed and approved" — confirmed brand language.
- **Saved Walks subpage** now shows two sections: "Sniffed and approved" and "On my sniff list".
- **Walk Journal preview null fix** — prevented crash on entries with no note.
- **Camera/gallery choice restored** — photo picker explicitly offers camera vs gallery.
- **Active nav tab contrast fixed** — active tab now clearly distinguishable.

### Additional fixes — 20 March 2026

- **Tap to expand walk image** — walk detail overlay image now tappable to open full-screen viewer. Android back button closes the viewer.
- **Walk images added** — Richmond Park, Wimbledon Common, and Isabella Plantation now have real photos. Three walks total have images.
- **Isabella Plantation added to WALKS_DB** — full data, description, and photo. Badge: Hidden gem. Leads only throughout. 0.9 miles, 50 minutes. Walk count now **86**.
- **Richmond Park added to Sniffout Picks carousel** — now featured on Today tab.
- **`renderTrailCard` updated** — walk images now display on trail cards where available.
- **Portrait card placeholder fixed** — Today tab portrait cards show correct placeholder.
- **Illustrated placeholder image added** (`placeholder-walk.jpg`) — replaces gradient placeholder for all walk cards. Consistent single image across the app.
- **Button labels removed** from heart and wishlist buttons.
- **Consistent raised button style** applied across all primary action buttons.
- **Walked button text fix** — corrected display text.
- **Cancel button added** to "Log a walk" sheet.
- **"Save for later" label duplication fixed**.
- **Add to list / wishlist fixed** — saves correctly to the correct localStorage key.
- **Default dark mode set to light** for new users.

---

## SECTION 6 — KEY DECISIONS ON RECORD

### Weather fetch strategy

**Decision: always fetch fresh. Never serve stale weather.**

App renders instantly using cached session data, then re-fetches and re-renders when the live API call completes. The 8-hour session cache is removed as the primary source of truth for weather display. Cached data is a loading placeholder only.

### Pubs and restaurants in Nearby tab — permanently removed

**FIX 23.2 is a permanent revert, not a temporary one.**

Too many non-dog-friendly results were appearing despite the Nearby Search implementation. The feature requires proper design work before returning. Brief exists at `developer-brief-restaurants.md`. Do not re-implement without a dedicated design round.

Pubs (the original single category) are restored as a standalone Nearby tab category.

### Settings and dog profile separation

Gear icon (settings) and dog profile are fully separated:
- Gear icon opens **settings only**
- "Your Dog" entry row in the Me tab opens the **dog profile subpage**

These are two distinct things and must not be merged again.

### Brand colour

`#3B5C2A` (Meadow Green) is fully implemented. No references to `#1E4D3A` should remain anywhere. CLAUDE.md, CSS tokens, manifest, and all hardcoded values updated.

### Logo rebuild

Owner is creating a new logo in Illustrator. Required exports when ready:
- `icon.svg` — master SVG
- `icon-192.png` — PWA manifest icon
- `icon-512.png` — PWA manifest icon
- `apple-touch-icon.png` — 180x180
- `favicon.svg`

No Developer work needed until the owner provides the export files.

### Full UX/UI review

A dedicated session where the Designer reviews every tab systematically and produces a prioritised findings list. This must happen before the next beta push. It is a gate, not a nice-to-have.

### Units

km is the default. A miles toggle is in Settings, saves to `sniffout_units`. `formatDist()` helper applied everywhere distances display across the app.

### Em dashes

Swept from all user-facing copy in FIX 29.4. Hyphens only throughout the app. No em dashes or en dashes remain.

### Free-form walk logging

Built and shipped in Round 30 — before soft launch, as confirmed in `dog-diary-feature-scope.md`. The journal was structurally broken without it. Walk log now has a `type` field: `"curated"` for WALKS_DB walks, `"custom"` for user-created entries. Both appear in the same journal timeline.

### Dog diary

Scoped in `dog-diary-feature-scope.md`. Deferred to post-launch Phase 2b. Entry types when built: vet visit, medication, health note, general. New localStorage key `sniffout_dog_diary`. Lives as a Me tab subpage.

**Solicitor flag:** The app stores user-entered notes about their dog including health observations (via walk notes and the future dog diary). Not special category GDPR data, but the privacy policy must accurately reflect that these categories are stored.

### Sniff list and Favourites brand names

**Decision: confirmed brand language.**

- Wishlist = **"On my sniff list"**
- Favourites = **"Sniffed and approved"**

Saved Walks subpage shows two distinct sections using these labels. Do not revert to generic "Wishlist" or "Favourites" language anywhere in the app.

### Walk card placeholder image

**Decision: single illustrated placeholder image for all walk cards.**

`placeholder-walk.jpg` (hosted on GitHub) is used for any walk card without a real photo. Replaces all gradient placeholder approaches. Consistent across Today tab portrait cards, Walks tab trail cards, and the walk detail overlay. Do not reintroduce gradients as placeholders.

### Default dark mode

**Decision: light mode is the default for new users.**

Dark mode requires explicit selection in Settings. New user sessions start in light mode.

### Isabella Plantation

Confirmed as a Hidden gem walk. Leads only throughout (formal restriction). 0.9 miles, 50 minutes. Full data, description, and photo now in WALKS_DB. Added in Round 33.

### Tap target standard

All interactive elements (filter buttons, heart buttons, category chips, action buttons) set to minimum 44px. This is in line with WCAG 2.5.5 and Apple HIG. Apply to any new interactive elements added in future rounds.

### Pre-launch blockers — technical blockers resolved

T1 (API key) and T14 (manifest start_url) resolved on 19 March 2026. Remaining blockers are all legal (solicitor-dependent). No technical hard blockers outstanding.

---

## SECTION 7 — CURRENT CONTENT STATE

### Walk database count

| Stage | Count | Status |
|-------|-------|--------|
| Walks in `sniffout-v2.html` (WALKS_DB) | **86** | Live in app — includes Isabella Plantation (added Round 33) |
| Batch 02 | 20 | Validated — awaiting Developer content update |
| Batch 03 | 20 | Validated — awaiting Developer content update |

Both Batch 02 and Batch 03 are fully validated and waiting. No blockers. Issue the combined content update brief to Developer when ready.

### Walk photos

| Status | Count |
|--------|-------|
| Walks with real photos | 3 — Richmond Park, Wimbledon Common, Isabella Plantation |
| Walks using illustrated placeholder (`placeholder-walk.jpg`) | 83 |

Walk image sourcing is a significant outstanding task. Owner to direct sourcing strategy for the 83 remaining walks.

### Batch status

**Batch 01:** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app

**Batch 02 (20 walks):**
- Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ (tehidy fixed, lickey-hills duplicate resolved)
- Developer content update: **NOT YET DONE** — waiting

**Batch 03 (20 walks — Northern Ireland, Hampshire, Wiltshire, Somerset, Gloucestershire, Highland Scotland, Yorkshire coast, County Durham, Lincolnshire, Oxfordshire, Greater Manchester, Bristol, Essex, Isle of Wight, Dorset):**
- Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ (all issues resolved)
- Developer content update: **NOT YET DONE** — waiting

### Copywriter personas

Five personas defined in `copywriter-personas.md`. Rules carry forward across all batches:

| Persona | Username | Dog | Notes |
|---------|----------|-----|-------|
| Deborah Hartley | DeborahH | Golden retrievers Biscuit & Marmalade | "which is always a bonus" retired; "Ideal for" closers banned |
| Jamie Okafor | jamieok | Rescue lurcher Ghost | No specific retired phrases |
| Morag Sutherland | morag83 | Working cocker Midge | Must mention pub or cafe in EVERY description |
| Pete Rushworth | PeteR63 | Border terrier Scratchy | Imperfections from documented set only (dropped apostrophes, passive voice, run-ons) |
| Priya Mistry | Priya&Pretzel | Mini dachshund Pretzel | "We loved/love this one" retired |

**Universal rules:** No walk name in sentence 1. No em dashes or en dashes — hyphens only. 2-4 sentences max. Vary openings and endings.

---

## SECTION 8 — WHAT IS IN PROGRESS RIGHT NOW

As of session close on 20 March 2026:

### 1. Content update — Batch 02 and 03 (ready to go)

Both batches are fully validated. 40 walks ready to add to `WALKS_DB`.

**Next action:** Issue combined content update brief to Developer. No blockers.

### 2. State A first-run screen redesign (upcoming)

The current first-run state needs a full Designer pass. This is a prerequisite for the second UX review.

**Next action:** Issue Designer prompt for State A redesign spec.

### 3. Dark mode colour rethink (upcoming)

Today tab mint/sage tones clash with the broader dark mode palette. Requires a Designer spec before any Developer implementation.

**Next action:** Issue Designer prompt for dark mode colour review.

### 4. Second UX/UI review pass (upcoming — blocked on items 2 and 3)

A second dedicated Designer session is needed after State A redesign and dark mode colour rethink are built. The first UX review (Rounds 31/32) addressed all high and medium priority items. The second pass should address anything raised by the State A redesign and dark mode work, plus any remaining items.

**Next action:** Do not issue second UX review prompt until State A and dark mode specs are built and implemented.

### 5. Walk image sourcing (ongoing — owner action)

83 walks still need real photos. 3 currently have images (Richmond Park, Wimbledon Common, Isabella Plantation).

**Next action:** Owner to direct sourcing strategy.

### 6. Logo rebuild (owner action)

Owner is creating new logo in Illustrator. No Developer action until exports are delivered.

**Next action:** When exports are ready, issue Developer brief to replace icon files in repo.

### 7. GDPR solicitor (owner action — outstanding blocker)

Owner is seeking a solicitor. L1 (GDPR sign-off), L2/L3 (privacy policy/ToS), and L4 (NDA review) are all blocked on this.

**Next action:** Owner engages solicitor. Target: engaged at least 4 weeks before any beta launch date.

---

## SECTION 9 — WHAT COMES NEXT

### Immediate (in priority order)

1. **Batch 02 + 03 content update** — both batches validated, no blockers. Issue combined Developer brief. 40 walks to add.
2. **State A first-run screen redesign** — Designer spec needed first, then Developer implementation.
3. **Dark mode colour rethink** — Designer spec needed first (Today tab mint/sage clash). Then Developer implements.
4. **Second UX/UI review pass** — after items 2 and 3 are built. Do not issue before then.
5. **Small fixes queue** — "25 handpicked walks" copy update (3 locations, correct number 86); info button position on Today tab; bottom nav active tab contrast iteration.
6. **Walk image sourcing** — owner to direct. 83 walks need photos.
7. **Logo rebuild** — owner delivers Illustrator exports, Developer replaces icon files.

### Soon (Phase 2 remaining)

- **Walk Wrapped summary** — twice yearly (July and December/January). Walk log foundation exists. Needs Designer spec.
- **Pollen data on Weather tab** — Open-Meteo European AQI endpoint. Phase 3 per CLAUDE.md.
- **Copy review session** — all UI copy across all tabs reviewed against brand voice. Includes "Not to be sniffed at" tertiary stat copy in Me tab.
- **Brand guidelines document** — Meadow Green `#3B5C2A` confirmed but full guidelines not yet produced.
- **Dog-friendly restaurants in Nearby tab** — permanently removed from current build. Brief at `developer-brief-restaurants.md` for a future dedicated round. Do not re-implement without design work.
- **Nearby places placeholder image** — owner to create. Separate from walk card placeholder (`placeholder-walk.jpg`).
- **Me tab dashboard alignment polish** — deferred pending State A redesign.

### Pre-launch hard blockers — status

| Blocker | Status | Notes |
|---------|--------|-------|
| T1 — API key exposed | ✅ Resolved 19 March 2026 | Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| T14 — manifest start_url wrong | ✅ Resolved 19 March 2026 | Fixed to `/sniffout-v2.html` |
| L1 — GDPR sign-off | 🔴 Blocked | Owner seeking solicitor |
| L2/L3 — Privacy policy / ToS | 🔴 Blocked | Depends on L1 |
| L4 — NDA review | 🔴 Blocked | `sniffout-nda.docx` ready for review |

No technical hard blockers remain. All outstanding blockers are legal.

### Phase 3 (priority order — confirmed)

1. **Firebase** — authentication, Firestore, Firebase Storage, localStorage migration. Region `europe-west2`. GDPR sign-off is a hard prerequisite.
2. **Missing Dog alerts** — Firestore-backed, map layer.
3. **User-submitted walks** — editorial review before publish, curated vs community badge.
4. **Community ratings** — Bayesian weighted, min 3 reviews before stars.
5. **Push notifications** — Firebase Cloud Messaging.

---

## SECTION 10 — IMPORTANT FILES

All files in `~/Desktop/my-first-repo/`.

### Core app

| File | Purpose |
|------|---------|
| `sniffout-v2.html` | **The app.** Everything: inline CSS, inline JS, all HTML. Only file to edit for app changes. |
| `dog-walk-dashboard.html` | Live production v1. **DO NOT TOUCH.** Protected per CLAUDE.md. |
| `sw.js` | Service worker. Modify only when explicitly instructed. |
| `manifest.json` | PWA manifest. `start_url` = `/sniffout-v2.html`, `theme_color` = `#3B5C2A`. |
| `CNAME` | Custom domain `sniffout.app`. |
| `index.html` | Redirects to `coming-soon.html` intentionally. |

### Agent briefing and instructions

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Auto-loaded by Claude Code agents. Project rules, tech stack, CSS tokens, architecture. Always read first. Brand colour `#3B5C2A`, API key via proxy. |

### Product strategy and decisions

| File | Purpose |
|------|---------|
| `po-action-plan-round24.md` | **Active PO document.** Replaces `po-action-plan-round12.md`. Current round status, decisions, next up. |
| `po-action-plan-round12.md` | Historical record. PO decisions from Rounds 12-23, gamification direction, phase roadmap. |
| `product-vision-update.md` | Strategic vision. Discovery → personal record reframe. Phase build order. Firebase-first. 16 owner decisions. |
| `community-gamification-roadmap.md` | Phase 2/3/4 roadmap. Community features, gamification approach. |
| `pre-launch-checklist.md` | 47-item checklist. T1 and T14 resolved. Three legal blockers outstanding (L1, L2/L3, L4). |

### Design specs

| File | Purpose |
|------|---------|
| `me-tab-rethink-v2-spec.md` | Me tab redesign spec (implemented Round 15+). |
| `me-tab-subpages-spec.md` | Me tab subpage architecture. Ready for PO review, then Round 27 implementation. |
| `dog-profile-spec.md` | Dog profile spec (implemented Round 19). |
| `badge-system-rethink.md` | 10 badge definitions, triggers, earned moment copy, reveal mechanics. |
| `weather-tab-redesign-spec.md` | Weather tab redesign spec. |
| `weather-icon-consistency-spec.md` | Icon sizes: Today 72px/6px, Weather 96px/14px. |
| `disclaimer-design-spec.md` | Walk disclaimer design (implemented Round 13). |
| `brand-colour-proposal.md` | 8 colour options. Option G (Meadow Green `#3B5C2A`) confirmed and implemented. |
| `developer-brief-restaurants.md` | Brief for dog-friendly restaurants/pubs in Nearby tab. Permanently deferred until dedicated design round. |

### Content pipeline files

| File | Purpose |
|------|---------|
| `copywriter-personas.md` | Five persona definitions. Must be read before any Copywriter or Editor work. |
| `uk-dog-breeds.md` | 62 UK dog breeds for the breed dropdown. |
| `walks-batch-01-data.md` | Batch 01 researcher data. |
| `walks-batch-02-data.md` | Batch 02 researcher data. |
| `walks-batch-03-data.md` | Batch 03 researcher data (Northern Ireland focus). |
| `descriptions-batch-01.md` | Batch 01 descriptions. |
| `descriptions-batch-02.md` | Batch 02 descriptions. |
| `descriptions-batch-03.md` | Batch 03 descriptions. |
| `editor-review-batch-01.md` | Editor-reviewed Batch 01. |
| `editor-review-batch-02.md` | Editor-reviewed Batch 02. |
| `editor-review-batch-03.md` | Editor-reviewed Batch 03. |
| `validation-report-batch-01.md` | Validator sign-off Batch 01. |
| `validation-report-batch-02.md` | Validator sign-off Batch 02. |
| `validation-report-batch-03.md` | Validator sign-off Batch 03. All issues resolved. Ready for Developer update. |

### Research

| File | Purpose |
|------|---------|
| `dog-friendly-venues-research.md` | Research on dog-friendly venue data sources for Nearby tab. Informs `developer-brief-restaurants.md`. |
| `me-tab-dashboard-research.md` | Research on personal stats design across Strava, AllTrails, Komoot, etc. |

### Previous session notes

| File | Purpose |
|------|---------|
| `session-handoff-march-18.md` | Previous session handoff. Read if context from before 19 March is needed. |
| `session-handoff-march-19.md` | This document. Current session handoff. |

---

## SECTION 11 — OWNER PREFERENCES AND WORKING STYLE

These are not negotiable — carry them forward into every future session.

**Communication:**
- Plain English always. No jargon without explanation.
- The owner was new to terminal and git when this project started. Always explain what commands do before giving them.
- Never assume knowledge of web development, git internals, or terminal syntax.
- If something might be confusing, explain it proactively.

**Devices and testing:**
- Owner tests on **Android Chrome**.
- iOS testing has not been done by the owner — iOS-specific bugs may be undetected.
- Owner tests the real device before every major push.
- Full UX/UI review (Designer-led) must happen before the next beta push.

**Design assets:**
- Owner uses **Illustrator** for design assets. Logo is being rebuilt in Illustrator.
- Required logo exports: `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180x180), `favicon.svg`.

**The dog:**
- The owner has a dog named **Luna**. Luna is the inspiration for the dog profile feature. When discussing dog profile features, this is personal.

**Batching:**
- Owner prefers **batched Developer rounds** over many small fixes. Each round should be substantial.
- Exception: critical bugs (broken functionality) can be a quick solo fix.
- Always test on device before pushing a major round.

**Quality over speed:**
- There is no pressure to ship. Thoroughness takes priority over velocity at every stage.
- Run the full content pipeline for every batch. Flag issues clearly. Do not wave through borderline work.

**Owner decides, Claude recommends:**
- Claude makes recommendations. The owner makes all final decisions.
- Do not proceed with significant changes without explicit owner direction.

**Copy rules (non-negotiable):**
- No em dashes (—) or en dashes (–) anywhere in copy, descriptions, or UI text. Hyphens only ( - ).
- No "free", "no sign-up", "no account", or "no login" anywhere in the app (per CLAUDE.md).
- Paw emoji (🐾) is reserved for the paw safety block only.

---

## SECTION 12 — TMUX SETUP

### Session management

```bash
# Reattach to existing session
tmux attach -t sniffout

# If session is lost, create new
tmux new-session -s sniffout

# Enable mouse support
tmux set -g mouse on

# Check existing sessions
tmux ls
```

### Claude Code path

```
/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.74/claude
```

To add to PATH permanently:
```bash
echo 'export PATH="/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.74:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Starting an agent

```bash
cd ~/Desktop/my-first-repo && claude
```

Paste the full prompt (drafted by Claude in chat) to start the agent's task.

### Recommended pane layout

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   Top-left:         │   Top-right:        │
│   PO agent          │   Developer agent   │
│                     │                     │
├─────────────────────┼─────────────────────┤
│                     │                     │
│   Bottom-left:      │   Bottom-right:     │
│   Designer agent    │   Researcher /      │
│                     │   Copywriter /      │
│                     │   Editor /          │
│                     │   Validator         │
└─────────────────────┴─────────────────────┘
```

A fifth pane (or separate terminal window) is used for git commands. Git commands are always provided by Claude in chat — the owner pastes them.

### Git push commands (standard format)

```bash
cd ~/Desktop/my-first-repo
git add .
git commit -m "sniffout-v2 Round NN - brief description of changes"
git push
```

Confirm push by checking `https://sniffout.app/sniffout-v2.html` — allow ~1 minute for GitHub Pages to redeploy.

---

## QUICK REFERENCE — CRITICAL THINGS TO NOT FORGET

1. **Never touch `dog-walk-dashboard.html`** — live production v1, protected per CLAUDE.md
2. **Cloudflare Worker proxy is fully working** — `places-proxy.sniffout.app`. Do not revert to direct Google URL under any circumstances.
3. **Pubs/restaurants permanently removed** — quality issues. Brief at `developer-brief-restaurants.md`. Do not re-add without a dedicated design round.
4. **Batch 02 + 03 ready to go** — 40 walks validated, waiting for combined Developer content update.
5. **Brand colour is `#3B5C2A` (Meadow Green)** — fully implemented. No `#1E4D3A` references should remain.
6. **Second UX/UI review is coming — but not yet** — State A redesign and dark mode colour rethink must be built first.
7. **Walk count is 86** — Isabella Plantation added in Round 33. 83 walks still need photos.
8. **Brand language: "On my sniff list" and "Sniffed and approved"** — confirmed names for Wishlist and Favourites. Do not revert to generic labels.
9. **Walk card placeholder is `placeholder-walk.jpg`** — single illustrated image. No gradients.
10. **GDPR is the only hard blocker** — L1/L2/L3/L4 all solicitor-dependent. Owner must engage solicitor.
11. **Logo rebuild in progress** — owner creating in Illustrator, five exports needed.
12. **Firebase first in Phase 3** — personal data (journal, notes, photos) cannot safely live in localStorage long-term.
13. **Today tab = Lucide icons, Weather tab = Yr.no icons** — confirmed design decision, do not merge.
14. **"25 handpicked walks" copy is wrong** — appears in 3 places. Correct number is 86. Fix in a small Developer round.
