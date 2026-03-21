# Sniffout — Session Handoff Note
**Date:** 20 March 2026 (last updated: 21 March 2026)
**Prepared by:** Product Owner agent
**Purpose:** Complete context handoff for the next Claude chat session. A new session reading this document should be able to pick up immediately with zero loss of context.
**Replaces:** session-handoff-march-19.md (still in repo as historical record at `docs/handoffs/session-handoff-march-19.md`)

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
| Firebase | Compat SDK v10.12.0 (CDN) — project `sniffout-fe976`, region `europe-west2`. Anonymous auth + Firestore dual-write + Storage. Foundation only — full migration is Phase 3. |
| OS Maps | Ordnance Survey Data Hub. Standard/OS Map toggle above map on Walks and Nearby tabs. ZXY endpoint: `https://api.os.uk/maps/raster/v1/zxy/{style}_3857/{z}/{x}/{y}.png`. API key: `JcMmulbTghzn8pkYAGdxd8MH6GTK2314`. Premium Data Plan active. Leisure tiles not yet activated — check 22 March. Currently defaults to Standard (OSM). **Note: API key is currently in page source — review security before launch.** |

### Local dev

```bash
cd ~/Desktop/my-first-repo
python3 -m http.server
```

Then open `http://localhost:8000/sniffout-v2.html` in Chrome. No build step needed.

**To review mockup files locally:** `http://localhost:8000/filename.html`

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
- **UX review march-21 was completed** — first full review pass done, saved to `docs/ux-reviews/ux-review-march-21.md`. Round 1 UX fixes implemented. Some items still outstanding — a follow-up review pass is needed before beta launch.
- **Screenshot context has limits.** In sessions where many screenshots have been shared, the chat context can become constrained. Where possible, prefer terminal output and plain descriptions of issues over screenshots. Reserve screenshots for cases where visual inspection is genuinely necessary.
- **`locationRestriction` must not be used** on the Nearby tab. It is incompatible with the `searchText` endpoint and causes empty results. Radius is enforced client-side. Do not reintroduce it.

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

## WORKING GUIDELINES FOR CLAUDE IN CHAT

DEVELOPER BRIEFS - always include:
- "Only edit sniffout-v2.html. Do not touch dog-walk-dashboard.html under any circumstances."
- "Do not use em dashes or en dashes anywhere - hyphens only."
- End with exact git commands:
  cd ~/Desktop/my-first-repo
  git add .
  git commit -m "sniffout-v2 - brief description"
  git push
- Ask Developer to confirm what was changed with a summary when done
- No time estimates in briefs - agents work in minutes not hours

COORDINATION STYLE:
- Draft ALL agent prompts before the owner pastes them - never ask the owner to write their own
- Review ALL agent outputs before recommending next steps
- Always flag decisions needed from the owner explicitly before moving on
- Run agents in parallel where tasks are independent
- Follow the content pipeline strictly:
  Researcher > Copywriter > Editor > Validator > Developer
- Provide git push commands for every Developer round - owner pastes them into terminal

CONTENT RULES (apply to all agents):
- No em dashes or en dashes anywhere - hyphens only
- No walk name in first sentence of descriptions
- Morag must mention a pub or cafe in every description
- Deborah: no "which is always a bonus", no "Ideal for" closers
- Priya: no "We loved/love this one", no "We stumbled" openers
- Pete: apostrophe drops only as imperfections
- No formulaic closers repeated across descriptions

COMMUNICATION STYLE:
- Plain English always - owner is not a developer
- Explain what terminal commands do before giving them
- Never assume knowledge of git, terminal or web development
- Owner makes all final decisions - Claude recommends, never decides
- Quality over speed - always review before pushing
- Keep the owner informed of what each agent is doing and what is waiting

TECHNICAL RULES:
- sniffout-v2.html is the only file to edit
- dog-walk-dashboard.html is live production - never touch it
- Brand colour is Meadow Green #3B5C2A
- Today tab uses white Lucide icons for weather
- Weather tab uses Yr.no SVG icons for weather
- All localStorage keys use sniffout_ prefix
- No hardcoded API keys in HTML - Google Places routes through Cloudflare Worker at places-proxy.sniffout.app

AGENT PROMPTS always start with:
"You are the [Role] for Sniffout, a UK dog walking PWA.
Read CLAUDE.md before starting."
And always specify which files to read before starting.

TMUX AND AGENT SETUP:
- tmux session named "sniffout"
- 4 panes: PO (top-left), Developer (top-right), Designer (bottom-left), Researcher/Copywriter/Editor/Validator (bottom-right)
- Fifth pane or separate terminal for git commands
- To launch agent in a pane:
  cd ~/Desktop/my-first-repo && claude
- Git commands always provided by Claude in chat - owner pastes them into terminal

AGENT ROLE BOUNDARIES:
- Designer never edits code under any circumstances
- If Designer accidentally runs developer work, discard changes with:
  git checkout sniffout-v2.html
  Then re-brief correctly
- Researcher produces verified data only - never edits code
- Each agent is a separate Claude Code session

BATCHING AND TESTING:
- Owner prefers substantial rounds over many small fixes - group related fixes together
- Exception: critical bugs can be solo fixes
- Always test on device before confirming a round is complete
- Owner tests on Android Chrome
- iOS untested - iOS specific issues may be undetected

ROUND NUMBERING:
- Last saved brief file was developer-brief-round15.md
- Rounds 16 onwards briefed directly in chat
- Currently at approximately Round 35+
- Not all rounds have saved brief files - this is normal

CONTENT PIPELINE:
- All walks go through full pipeline:
  Researcher > Copywriter > Editor > Validator > Developer
- No shortcuts - Validator must sign off before Developer content update
- Batch content updates where possible

DOCS AND HANDOFF:
- After significant rounds brief PO to update docs/po/po-action-plan-round24.md and session handoff
- Do not let too many rounds accumulate without a docs update
- Active PO document: docs/po/po-action-plan-round24.md
- Active handoff: docs/handoffs/session-handoff-march-20.md (this document)

WALK PHOTOS:
- Hosted on GitHub as raw URLs
- Format: https://raw.githubusercontent.com/jayeshfatania/my-first-repo/main/filename.jpg
- Push image files to repo before referencing in WALKS_DB

CLOUDFLARE WORKER:
- Proxy at places-proxy.sniffout.app
- Worker code edited in Cloudflare dashboard
- Do not revert to direct Google URL ever
- Referer header set to https://sniffout.app in Worker code

APP URLS:
- Live app: sniffout.app/sniffout-v2.html
- index.html intentionally redirects to coming-soon.html - deliberate pre-launch behaviour, do not change
- sniffout.co.uk not yet redirecting - pre-launch task

SCREENSHOTS:
- Screenshot limit reached in previous chat
- Use terminal output and descriptions instead of screenshots where possible
- When reviewing mockups open locally:
  python3 -m http.server
  Then visit http://localhost:8000/filename.html

CHAT MANAGEMENT:
- Start fresh chats before hitting context limits
- Share session handoff note at start of each new chat
- The em dashes rule applies to copy and UI text only, not to code or technical content

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
- **FIX 14.4** — Walk detail overlay disclaimer added. Passive footnote strip, 12px, info circle icon.
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
- **FIX 16.3** — Me tab rethink (from `docs/specs/me-tab-rethink-v2-spec.md`): miles hero stat, earned badges only, walk log
- **FIX 16.4** — Badge system replacement (from `docs/specs/badge-system-rethink.md`): 10 new badges, hidden until earned, earned moment copy, toast reveal, inline detail on chip tap
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
- Dark mode: "Auto" uses `prefers-color-scheme` instead of sunrise/sunset
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
- **FIX 23.2** — Pubs and restaurants added to Nearby tab. **Permanently reverted.** Too many non-dog-friendly results. Pubs restored as standalone category. `docs/briefs/developer-brief-restaurants.md` documents the intended future implementation.

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
- **FIX 26.4** — Weather tab hero alignment fixed. Gap 56px, icon 96px, vertically centred. (Iterated as 26.4b and 26.4c.)
- **FIX 26.5** — Weather tab wrong icon fixed. Replaced stale `is_day` cache with live hour-based check (`currentH >= 6 && currentH < 21`)
- **FIX 26.6** — Save button added to walk note input with 2-second confirmation message
- **FIX 26.7** — Weather always fetches fresh on every load. Renders instantly with cache, re-renders with live data when fetch completes.
- **Badge custom icons** — all 10 badges now show unique custom SVG icons. Root cause of earlier failure: duplicate `renderMeBadges` function silently taking precedence. Correct function wired to all call sites.

### Round 27 — Me tab avatar, stats dashboard, entry point rows

- Me tab avatar, stats dashboard, and subpage entry point rows reviewed and gaps filled.

### Round 28 — Me tab subpage overlays confirmed

- All four subpage overlays confirmed built and wired: Walk Journal, Badges, Saved Walks, Saved Places.

### Round 29 — Units toggle, formatDist helper, em dash sweep

- **FIX 29.1** — km/miles units toggle added to Settings. Defaults to km. Saves to `sniffout_units` in localStorage.
- **FIX 29.2** — `formatDist()` helper applied across all distance displays in the app.
- **FIX 29.3** — Me tab stats label updates dynamically when units setting changes.
- **FIX 29.4** — Em dash sweep complete. No em dashes or en dashes remain anywhere in user-facing copy.

### Round 30 — Free-form walk logging

- **FIX 30.1** — Walk log schema extended with `type` field (`"curated"` | `"custom"`). Existing entries default to `"curated"` via fallback — no migration needed.
- **FIX 30.2** — "Log a walk" button and bottom sheet added to Walk Journal.
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
- **FIX 32.4** — Add photo button: dashed border replaced with solid, camera icon added.
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

### Additional fixes — 20 March 2026 (first session)

- **Tap to expand walk image** — walk detail overlay image tappable to open full-screen viewer. Android back button closes the viewer.
- **Walk images added** — Richmond Park, Wimbledon Common, and Isabella Plantation now have real photos.
- **Isabella Plantation added to WALKS_DB** — full data, description, photo. Badge: Hidden gem. Leads only throughout. 0.9 miles, 50 minutes. Walk count now **86**.
- **Richmond Park added to Sniffout Picks carousel.**
- **`renderTrailCard` updated** — walk images now display on trail cards where available.
- **Portrait card placeholder fixed** — Today tab portrait cards show correct placeholder.
- **Illustrated placeholder image added** (`placeholder-walk.jpg`) — single consistent image across all walk cards without a real photo.
- **Button labels removed** from heart and wishlist buttons.
- **Consistent raised button style** applied across all primary action buttons.
- **Walked button text fix** — corrected display text.
- **Cancel button added** to "Log a walk" sheet.
- **"Save for later" label duplication fixed.**
- **Add to list / wishlist fixed** — saves correctly to the correct localStorage key.
- **Default dark mode set to light** for new users.

### Morning fixes — 20 March 2026 (second session)

- **Nearby radius enforced client-side** — `locationRestriction` reverted to `locationBias` (caused empty results). Radius now enforced by post-fetch client-side distance filter. Do not reintroduce `locationRestriction`.
- **Pub search quality improved** — `primaryType` added to Google Places field mask. Non-pub venues (night clubs, casinos, cocktail bars) filtered by `primaryType` and name keyword checks after fetch.
- **Location switching added to Walks and Nearby tabs** — tappable location line with inline search bar, consistent with Today tab. All three tabs now allow location change.
- **Android back button fixed** — `beforeunload` listener added; `pushState` fires synchronously on every `popstate` event. Browser navigation no longer exits the app.
- **Info sheet swipe-to-dismiss** — extended to full overlay and scrim tap.
- **Stats card distance label fixed** — number line shows value only; label shows "km walked" / "miles walked".
- **Isabella Plantation dedup fixed** — Picks carousel IDs excluded from Hidden Gems filter.
- **Badge labels fixed** — Sniffout Picks carousel forces `"Sniffout Pick"` badge; Hidden Gems carousel forces `"Hidden gem"` badge.
- **Dark mode Today tab partial fix** — weather hero card overridden to `#1E3D2A` in dark mode.
- **Info button moved** — far right of weather pills row.
- **Me tab stats card padding normalised.**
- **Dark mode toggle renamed** from "Match device" to "Auto".
- **Tappable temperature feature implemented then reverted** — replaced by the hourly forecast bar approach. `docs/specs/temperature-tap-spec.md` exists but feature was removed from `sniffout-v2.html`. Superseded.
- **T&C consent screen added as L5** — hard go-live blocker. Requires ToS (L3) to be complete first.

### Completed — 20 March 2026 afternoon session

- **Hourly forecast bar added to Weather tab** — "Hour by hour" card added as Card 2 on the Weather tab. Walk Window card is **kept** (not removed) and updated to whole-day scope (6am to midnight). Walk Window is Card 1, Hour by hour is Card 2. Walk Window footer shows rain summary only. `docs/specs/hourly-forecast-layout-rec.md` produced by Designer.
- **Dynamic walk count implemented** — all hardcoded "25 handpicked walks" references replaced with `WALKS_DB.length`. Walk count displays correctly regardless of database size. Never hardcode a walk count number again.
- **State A full redesign implemented** — spec in `docs/specs/state-a-redesign-spec.md`. Changes:
  - Headline: "Paws before you go."
  - Hero body copy paragraph removed
  - CTA card wrapper removed
  - Wordmark corrected to 20px
  - Showcase carousel: 7 hardcoded walks (`isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland`)
  - Social proof strip: "Know the route · Own the weather · Find the spots"
- **Batch 02 and 03 content added to app** — walk count is now **100**. The previous handoff was out of date on this — both batches are now live in `WALKS_DB`.
- **`docs/research/firebase-setup-plan.md` created** — by Researcher. Firebase architecture and setup plan documented for Phase 3 reference.
- **`docs/specs/state-a-redesign-spec.md` created** — by Designer. State A redesign spec.
- **`docs/specs/hourly-forecast-layout-rec.md` created** — by Designer. Layout recommendation for the hourly forecast bar implementation.

### Completed — 20 March 2026 evening session

- **Dark mode Scheme B implemented** — new dark palette ("Dark Slate") applied via `body.night`. Tokens: `--bg #141414`, `--surface #1F1F1F`, `--border rgba(255,255,255,0.08)`, `--ink #F4F2EE`, `--ink-2 #8A8A8A`, `--brand #5C7A63`, `--chip-off #2A2A2A`. Weather tab hero card overrides to `#1A3522`. Spec in `docs/specs/dark-mode-schemes.md`. Dark mode colour rethink is now DONE — second UX review is unblocked.
- **Firebase foundation implemented** — Firebase SDK (compat v10.12.0, CDN) integrated into `sniffout-v2.html`. Project: `sniffout-fe976`, region `europe-west2`. Anonymous auth fires on load — UID used for Firestore document paths. Firestore dual-write active for walk log entries (writes to both localStorage and Firestore). Firebase Storage configured. **This is foundation only — the full migration (authenticated accounts, server-side reads, localStorage migration) remains Phase 3, gated on GDPR sign-off (L1).** Do not add Firebase reads to the critical render path.
- **PWA install prompt card added to Me tab** — dismissible card prompting user to install the app to their home screen. Dismissed state saves to `sniffout_hide_install_prompt` in localStorage. Does not reappear once dismissed.
- **Silent auto-refresh implemented** — `silentWeatherRefresh()` function. Triggers on `visibilitychange` event (app comes back to foreground) and on tab switch. Re-fetches weather if data is older than 5 minutes. Runs silently — no loading state, no UI blocking. Replaces the previous "always fetch on load" approach for background refreshes.
- **New logo icons** — updated PWA icon assets integrated. `manifest.json` updated to reference new icon files.
- **Paw-print icon unified** — paw-print icon standardised across all uses in the app. Single consistent SVG path used everywhere.

### Completed — 21 March 2026

**UX review and Round 1 fixes:**
- **Full UX review conducted** — saved to `docs/ux-reviews/ux-review-march-21.md`. Full review of all tabs and states against the current build.
- **Meta description added** — HTML `<meta name="description">` added to `sniffout-v2.html`.
- **Tap targets** — further tap target fixes applied across sheets and buttons following the review.
- **`meDisplayName` empty state fixed** — Me tab header no longer shows blank when no display name is set.
- **Sheet handle sizes unified** — drag handle dimensions standardised across all bottom sheets.
- **Walk rating size** — adjusted per review recommendation.
- **`me-stat-card--primary` number colour** — locked to `var(--ink)` in both light and dark mode. Documented in CLAUDE.md. Do not override without explicit owner instruction.
- **Walk tag `border-radius`** — updated per review.
- **Gear/back button tap targets** — increased to minimum 44px.
- **Radius picker units** — fixed to show correct unit label.
- **Saved Walks bookmark icon** — corrected.
- **`--amber` token** — value corrected.
- **Dark mode active chip and H4 contrast** — reviewed; owner is happy with current state. No change made.
- **Swipe-to-dismiss audit** — 3 sheets were missing swipe-to-dismiss (Walks filter, Nearby filter, Log a walk). All three fixed.

**OS Maps integration:**
- **OS Data Hub account created** — project "sniffout" created. OS Maps API and Premium Data Plan added, card verified.
- **OS Maps toggle implemented** — Standard/OS Map pill above map on Walks and Nearby tabs. Tapping switches the map tile layer.
- **Leisure tiles not yet activating** — Premium plan is active but Leisure tiles are pending. App currently defaults to Standard (OSM). Check again 22 March.
- **API key in page source** — OS Maps key (`JcMmulbTghzn8pkYAGdxd8MH6GTK2314`) is currently hardcoded in `sniffout-v2.html`. Needs security review before launch (equivalent of T1 for Google Places).

**Me tab — Recently Viewed:**
- **Recently Viewed entry row added** — positioned between Walk Journal and Badges in the Me tab entry rows list.
- **Subpage overlay pattern** — uses full subpage overlay (consistent with all other Me tab entry rows, not an accordion).
- **localStorage key `sniffout_recent_walks`** — stores up to 10 recently viewed curated walk IDs (most recent first). Removed from Today tab pills, now lives in Me tab only.

**Walk cards:**
- **Distance from user location** — walk cards in Walks tab list view now show "X.X km away" or "X.X mi away", respecting the units setting.

**UX/copy fixes:**
- **"Contributions" stat renamed** — Me tab stat now reads "condition reports".
- **Social proof strip updated** — "Find the spots" changed to "Find dog-friendly spots".
- **Lucide pinned to version 0.577.0** — version locked in CDN import to prevent icon changes on upstream updates.
- **Dead CSS cleanup** — 14 unused classes removed, duplicate CSS definitions removed.
- **Walk save actions simplified** — heart button removed from walk detail overlay. Bookmark button labelled "Add to our walk list".

**Repo restructure:**
- **All documentation files moved into `docs/` subfolders** — structure: `docs/specs`, `docs/research`, `docs/briefs`, `docs/content`, `docs/handoffs`, `docs/po`, `docs/mockups`, `docs/ux-reviews`, `docs/archive`.
- **CLAUDE.md updated** — all file path references updated to reflect new locations.
- **`repo-restructure-brief.md` moved to `docs/archive/`**.

---

## SECTION 6 — KEY DECISIONS ON RECORD

These decisions are locked and should not be revisited without a clear reason.

### Brand colour

`#3B5C2A` (Meadow Green) is fully implemented. No references to `#1E4D3A` should remain anywhere.

### Weather fetch strategy

Always fetch fresh. App renders instantly with cached data, re-renders when live data arrives. Never serve stale weather.

### Pubs and restaurants in Nearby tab — permanently removed

FIX 23.2 is a permanent revert. Brief at `docs/briefs/developer-brief-restaurants.md`. Do not re-implement without a dedicated design round.

### Settings and dog profile separation

Gear icon opens settings only. "Your Dog" entry row opens dog profile subpage. These are two distinct things and must not be merged.

### Logo rebuild — complete

Logo rebuild is complete. All icon files are in the repo and wired up:

- `apple-touch-icon.png` (180x180)
- `favicon.svg`
- `icon-green.svg`
- `icon-new-192.png` (192x192)
- `icon-new-512.png` (512x512)
- `icon-512-green.png` (maskable, brand green background)
- `icon.svg`

Splash screen and home screen icon are working correctly on device. No further Developer action needed unless the owner creates new Illustrator exports.

### Units

km is the default. Miles toggle in Settings, saves to `sniffout_units`. `formatDist()` helper applied everywhere.

### Em dashes

Swept from all user-facing copy in FIX 29.4. Hyphens only throughout the app.

### Free-form walk logging

Built in Round 30. Walk log has a `type` field: `"curated"` for WALKS_DB walks, `"custom"` for user-created entries. Both appear in the same journal timeline.

### Dog diary

Scoped in `docs/specs/dog-diary-feature-scope.md`. Deferred to post-launch Phase 2b. New localStorage key `sniffout_dog_diary`.

### Sniff list and Favourites brand names

- Wishlist = **"On my sniff list"**
- Favourites = **"Sniffed and approved"**

Do not revert to generic "Wishlist" or "Favourites" anywhere in the app.

### Walk card placeholder image

`placeholder-walk.jpg` (hosted on GitHub) used for all walk cards without a real photo. Do not reintroduce gradients as placeholders.

### Default dark mode

Light mode is the default for new users. Dark mode requires explicit selection in Settings.

### Isabella Plantation

Confirmed as Hidden gem walk. Leads only throughout (formal restriction). 0.9 miles, 50 minutes. In WALKS_DB with photo.

### Tap target standard

All interactive elements set to minimum 44px (WCAG 2.5.5 / Apple HIG). Apply to all new interactive elements in future rounds.

### Nearby radius — locationBias not locationRestriction

`locationRestriction` caused empty results. Permanently reverted to `locationBias`. Radius enforced client-side by post-fetch distance filter. Do not reintroduce `locationRestriction`.

### Location switching — available on all three main tabs

Today, Walks, and Nearby tabs all have a tappable location line with inline search bar.

### Hourly forecast bar and Walk Window — both live on Weather tab

The tappable temperature hero approach (`docs/specs/temperature-tap-spec.md`) was implemented and then reverted. The replacement is an **hourly forecast bar** ("Hour by hour" card) on the Weather tab — now implemented.

**Key structural decision:** The Walk Window card is **kept**, not removed. It has been updated to whole-day scope (6am to midnight). Walk Window is Card 1, Hour by hour is Card 2 on the Weather tab. Walk Window footer shows rain summary only.

Designer spec: `docs/specs/hourly-forecast-spec.md`. Layout recommendation: `docs/specs/hourly-forecast-layout-rec.md`.

### T&C consent screen is a hard go-live blocker

Users must actively accept Terms of Service before using the app for the first time. This is L5 in the pre-launch blockers. Depends on L3 (ToS copy from solicitor). Developer work required once ToS exists.

### Report an issue — Phase 3

Deferred to Phase 3. Requires Firebase backend.

### Dark mode toggle label

Renamed from "Match device" to "Auto".

### Dark mode Scheme B — confirmed and implemented

Dark Slate palette is live. Tokens documented in CLAUDE.md. Previous dark mode card surfaces (`#243A2C`, mint/sage tones) replaced. Spec in `docs/specs/dark-mode-schemes.md`. Do not revert to old dark mode colours.

### Firebase foundation — live but boundary is firm

Firebase project `sniffout-fe976` (region `europe-west2`) is integrated. Anonymous auth, Firestore dual-write for walk log, and Firebase Storage are active. **The boundary:** this is write-only foundation. No Firebase reads on the critical render path. localStorage remains source of truth for all UI rendering. Full authenticated Firebase migration remains Phase 3, gated on GDPR (L1). Do not expand Firebase scope without explicit instruction.

### PWA install prompt card

Me tab shows a dismissible install prompt card. Dismissed state persists in `sniffout_hide_install_prompt`. Does not reappear once dismissed. This is the app's only install prompt surface.

### Paw-print icon

Unified across all uses. Single consistent SVG path. Do not introduce a second paw-print variant.

### OS Maps toggle

Standard/OS Map pill is live above the map on Walks and Nearby tabs. Ordnance Survey ZXY tile layer. API key is currently in page source — this is a pre-launch security item (equivalent to T1). Leisure tiles pending activation. Default is Standard (OSM) until Leisure activates.

### Recently Viewed walks

`sniffout_recent_walks` localStorage key. Stores up to 10 recently viewed curated walk IDs, most recent first. Entry row in Me tab between Walk Journal and Badges. Uses subpage overlay pattern, not accordion. Previously surfaced as pills on Today tab — removed from there.

### Distance from user location on walk cards

Walk cards in Walks tab list view show "X.X km away" / "X.X mi away" based on `sniffout_units` setting. Uses the user's current location.

### Walk save actions — simplified

Heart button removed from walk detail overlay. Only the bookmark button remains, labelled "Add to our walk list". Cleaner single save action per walk.

### Social proof strip — updated

"Find dog-friendly spots" (not "Find the spots"). Do not revert to the shorter version.

### Lucide icon library — version pinned

Lucide pinned to version 0.577.0 in the CDN import. Do not change the version without explicit instruction — upstream changes have broken icons in the past.

### Primary stat card number colour — locked

`me-stat-card--primary` number colour is `var(--ink)` in both light and dark mode. Documented in CLAUDE.md. Do not add a colour override without explicit owner instruction.

### Dark mode Today tab hero background

Updated to `#5C7A63` (matches `--brand` dark mode value). Previous value was `#1E3D2A`.

### Dark mode active chip and H4 contrast

Reviewed in UX review march-21. Owner is happy with current state. No change required.

### Pre-launch blockers — current status

T1 (API key) and T14 (manifest start_url) resolved on 19 March 2026. All remaining blockers are legal and solicitor-dependent.

---

## SECTION 7 — CURRENT CONTENT STATE

### Walk database count

| Stage | Count | Status |
|-------|-------|--------|
| Walks in `sniffout-v2.html` (WALKS_DB) | **100** | Live in app. Batches 01-03 all complete. |
| Batch 01 | 20 | ✅ In app |
| Batch 02 | 20 | ✅ In app — added 20 March 2026 |
| Batch 03 | 20 | ✅ In app — added 20 March 2026 |

All batches complete. No content updates pending. Walk count is displayed dynamically via `WALKS_DB.length` — never hardcode a number.

### Walk photos

| Status | Count |
|--------|-------|
| Walks with real photos | 3 — Richmond Park, Wimbledon Common, Isabella Plantation |
| Walks using illustrated placeholder (`placeholder-walk.jpg`) | 97 |
| Showcase carousel walks needing photos (priority) | 7 — isabella-plantation, stanage-edge, balmaha-loch-lomond, rhossili-gower, seven-sisters, formby-beach-pinewoods, alnmouth-northumberland |

Walk photos are hosted on GitHub as raw URLs:
`https://raw.githubusercontent.com/jayeshfatania/my-first-repo/main/filename.jpg`

Image files must be pushed to the repo before being referenced in `WALKS_DB`.

### Batch status

**Batch 01:** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app

**Batch 02 (20 walks):** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app (added 20 March 2026)

**Batch 03 (20 walks — Northern Ireland, Hampshire, Wiltshire, Somerset, Gloucestershire, Highland Scotland, Yorkshire coast, County Durham, Lincolnshire, Oxfordshire, Greater Manchester, Bristol, Essex, Isle of Wight, Dorset):** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app (added 20 March 2026)

### Copywriter personas

Five personas defined in `docs/content/copywriter-personas.md`. Rules carry forward across all batches:

| Persona | Username | Dog | Notes |
|---------|----------|-----|-------|
| Deborah Hartley | DeborahH | Golden retrievers Biscuit & Marmalade | "which is always a bonus" retired; "Ideal for" closers banned |
| Jamie Okafor | jamieok | Rescue lurcher Ghost | No specific retired phrases |
| Morag Sutherland | morag83 | Working cocker Midge | Must mention pub or cafe in EVERY description |
| Pete Rushworth | PeteR63 | Border terrier Scratchy | Imperfections from documented set only (dropped apostrophes, passive voice, run-ons) |
| Priya Mistry | Priya&Pretzel | Mini dachshund Pretzel | "We loved/love this one" retired; "We stumbled" openers banned |

**Universal rules:** No walk name in sentence 1. No em dashes or en dashes — hyphens only. 2-4 sentences max. Vary openings and endings.

---

## SECTION 8 — WHAT IS IN PROGRESS RIGHT NOW

As of end of day 21 March 2026:

### 1. OS Maps Leisure tiles (check 22 March)

Premium Data Plan is active but Leisure tiles are not yet rendering. This may simply need 24 hours to propagate after the plan was activated.

**Next action:** Check tomorrow (22 March). If still not working, raise a support ticket with OS Data Hub.

### 2. Photos for 7 showcase carousel walks (priority — owner action)

The State A showcase carousel features 7 specific walks. These are the most visible walks in the app for a first-time user. Real photos should be sourced for these walks first.

Walks: `isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland`

**Next action:** Owner to source photos. Push image files to repo before referencing in `WALKS_DB`.

### 3. Second UX review follow-up (outstanding items)

UX review march-21 was completed and Round 1 fixes implemented. Some items from the review remain outstanding. A follow-up review pass is needed before beta launch.

**Next action:** Check `docs/ux-reviews/ux-review-march-21.md` for outstanding items. Issue follow-up when owner is ready.

### 4. Walk image sourcing — 97 remaining (ongoing — owner action)

97 walks still use `placeholder-walk.jpg`. 3 have real photos. Showcase carousel walks (item 2 above) are the priority.

**Next action:** Owner to direct sourcing strategy.

### 5. GDPR solicitor (owner action — outstanding blocker)

L1, L2/L3, L4, and L5 all blocked on solicitor engagement.

**Next action:** Owner engages solicitor. Target: at least 4 weeks before any beta launch date.

---

## SECTION 9 — WHAT COMES NEXT

### Immediate (in priority order)

1. **OS Maps Leisure tiles** — check 22 March if Premium plan has activated. If not, raise support ticket with OS Data Hub.
2. **Photos for 7 showcase carousel walks** — owner to source. These are the most visible walks in the app (State A carousel). Priority over other walk photos.
3. **Second UX review follow-up** — outstanding items from `docs/ux-reviews/ux-review-march-21.md`. Follow-up pass needed before beta launch.
4. **Walk image sourcing** — 97 walks need photos. Owner to direct.
5. **Copy review session** — all UI copy reviewed against brand voice.
6. **Nearby places placeholder image** — owner to create in Illustrator. Separate from `placeholder-walk.jpg`.
7. **MoSCoW prioritisation** — owner to complete when ready to triage the backlog.

### Soon (Phase 2 remaining)

- **Walk Wrapped summary** — twice yearly (July and December/January). Walk log foundation exists. Needs Designer spec.
- **Brand guidelines document** — Meadow Green `#3B5C2A` confirmed but full guidelines not yet produced.
- **Dog-friendly restaurants in Nearby tab** — permanently removed. Brief at `docs/briefs/developer-brief-restaurants.md` for a future dedicated round.
- **Me tab dashboard alignment polish** — deferred.
- **Bottom nav active tab contrast** — may need further iteration.
- **Walk empty state copy** — deferred until Firebase walk submission is built.

### Phase 3 (priority order — confirmed)

1. **Firebase full migration** — foundation is live (anonymous auth, Firestore dual-write, Storage). Phase 3 completes this: authenticated user accounts, server-side walk log reads, full localStorage → Firestore migration. Region `europe-west2`. GDPR sign-off (L1) is hard prerequisite.
2. **Report an issue** — Firestore-backed submission form.
3. **Missing Dog alerts** — Firestore-backed, map layer.
4. **User-submitted walks** — editorial review before publish, curated vs community badge.
5. **Community ratings** — Bayesian weighted, min 3 reviews before stars.
6. **Push notifications** — Firebase Cloud Messaging.

### Pre-launch hard blockers — status

| Blocker | Status | Notes |
|---------|--------|-------|
| T1 — API key exposed | ✅ Resolved 19 March 2026 | Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| T14 — manifest start_url wrong | ✅ Resolved 19 March 2026 | Fixed to `/sniffout-v2.html` |
| L1 — GDPR sign-off | 🔴 Blocked | Owner seeking solicitor |
| L2/L3 — Privacy policy / ToS | 🔴 Blocked | Depends on L1 |
| L4 — NDA review | 🔴 Blocked | `sniffout-nda.docx` ready for review |
| L5 — T&C consent screen | 🔴 Not started | Hard go-live blocker. Depends on L3 (ToS). Developer work required once ToS copy is ready. |

No technical hard blockers remain. All outstanding blockers are legal.

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
| `placeholder-walk.jpg` | Illustrated placeholder for walk cards without real photos. Hosted on GitHub. |

### Agent briefing and instructions

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Auto-loaded by Claude Code agents. Project rules, tech stack, CSS tokens, architecture. Always read first. Brand colour `#3B5C2A`, API key via proxy. |

### Product strategy and decisions

| File | Purpose |
|------|---------|
| `docs/po/po-action-plan-round24.md` | **Active PO document.** Replaces `docs/po/po-action-plan-round12.md`. Current round status, decisions, next up. |
| `docs/po/po-action-plan-round12.md` | Historical record. PO decisions from Rounds 12-23. |
| `docs/po/product-vision-update.md` | Strategic vision. Discovery → personal record reframe. |
| `docs/po/community-gamification-roadmap.md` | Phase 2/3/4 roadmap. |
| `docs/po/pre-launch-checklist.md` | 47-item checklist. T1 and T14 resolved. Four legal blockers outstanding (L1, L2/L3, L4, L5). |

### Design specs

| File | Purpose |
|------|---------|
| `docs/specs/me-tab-rethink-v2-spec.md` | Me tab redesign spec (implemented Round 15+). |
| `docs/specs/me-tab-subpages-spec.md` | Me tab subpage architecture (implemented Round 28). |
| `docs/specs/dog-profile-spec.md` | Dog profile spec (implemented Round 19). |
| `docs/specs/badge-system-rethink.md` | 10 badge definitions, triggers, earned moment copy. |
| `docs/specs/weather-tab-redesign-spec.md` | Weather tab redesign spec. |
| `docs/specs/weather-icon-consistency-spec.md` | Icon sizes: Today 72px/6px, Weather 96px/14px. |
| `docs/specs/disclaimer-design-spec.md` | Walk disclaimer design (implemented Round 13). |
| `docs/research/brand-colour-proposal.md` | 8 colour options. Option G (Meadow Green `#3B5C2A`) confirmed. |
| `docs/briefs/developer-brief-restaurants.md` | Brief for dog-friendly restaurants/pubs. Permanently deferred. |
| `docs/specs/hourly-forecast-spec.md` | Hourly forecast bar spec (Designer). Feature implemented — "Hour by hour" is Card 2 on Weather tab. |
| `docs/specs/hourly-forecast-layout-rec.md` | Designer layout recommendation for hourly forecast bar. Used during implementation. |
| `docs/specs/temperature-tap-spec.md` | Tappable temperature spec. Feature was implemented and then reverted in favour of hourly forecast bar. Superseded. |
| `docs/specs/state-a-redesign-spec.md` | Designer spec for State A first-run screen redesign. Implemented 20 March 2026. |
| `docs/specs/dog-diary-feature-scope.md` | Strategic scoping for dog diary feature. Deferred to Phase 2b post-launch. |
| `docs/specs/dark-mode-schemes.md` | Dark mode colour scheme options. Scheme B (Dark Slate) confirmed and implemented. |
| `docs/specs/install-prompt-spec.md` | PWA install prompt card spec. Implemented 20 March 2026. |
| `docs/specs/os-maps-research.md` | OS Maps API research and integration notes. |

### Content pipeline files

| File | Purpose |
|------|---------|
| `docs/content/copywriter-personas.md` | Five persona definitions. Must be read before any Copywriter or Editor work. |
| `docs/content/uk-dog-breeds.md` | 62 UK dog breeds for the breed dropdown. |
| `docs/content/walks-batch-01-data.md` through `docs/content/walks-batch-03-data.md` | Researcher data for each batch. |
| `docs/content/descriptions-batch-01.md` through `docs/content/descriptions-batch-03.md` | Copywriter descriptions for each batch. |
| `docs/content/editor-review-batch-01.md` through `docs/content/editor-review-batch-03.md` | Editor-reviewed descriptions. |
| `docs/content/validation-report-batch-01.md` through `docs/content/validation-report-batch-03.md` | Validator sign-off. Batch 03 all issues resolved. Ready for Developer update. |

### Research

| File | Purpose |
|------|---------|
| `docs/research/dog-friendly-venues-research.md` | Research on dog-friendly venue data sources for Nearby tab. |
| `docs/specs/me-tab-dashboard-research.md` | Research on personal stats design. |
| `docs/research/firebase-setup-plan.md` | Firebase architecture and setup plan for Phase 3. Produced by Researcher 20 March 2026. |

### UX reviews

| File | Purpose |
|------|---------|
| `docs/ux-reviews/ux-review-march-19.md` | UX review conducted 19 March 2026. Historical. |
| `docs/ux-reviews/ux-review-march-21.md` | **Current UX review.** Conducted 21 March 2026. Round 1 fixes implemented. Follow-up items still outstanding. |

### Session handoff notes

| File | Purpose |
|------|---------|
| `docs/handoffs/session-handoff-march-18.md` | Historical. |
| `docs/handoffs/session-handoff-march-19.md` | Historical. |
| `docs/handoffs/session-handoff-march-20.md` | **This document. Current active handoff.** |

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
3. **Pubs/restaurants permanently removed** — quality issues. Brief at `docs/briefs/developer-brief-restaurants.md`. Do not re-add without a dedicated design round.
4. **All batches complete — walk count is 100** — Batches 01, 02, and 03 all live in WALKS_DB. Use `WALKS_DB.length` dynamically, never hardcode a number.
5. **Brand colour is `#3B5C2A` (Meadow Green)** — fully implemented. No `#1E4D3A` references should remain.
6. **Hourly forecast bar is LIVE** — "Hour by hour" is Card 2 on Weather tab. Walk Window is Card 1 (kept, updated to 6am-midnight scope). Tappable temperature spec (`docs/specs/temperature-tap-spec.md`) is superseded — do not re-implement.
7. **97 walks still need photos** — 3 have real photos. 7 showcase carousel walks are priority.
8. **Brand language: "On my sniff list" and "Sniffed and approved"** — confirmed names for Wishlist and Favourites. Do not revert.
9. **Walk card placeholder is `placeholder-walk.jpg`** — single illustrated image. No gradients.
10. **L1-L5 are all legal blockers** — all solicitor-dependent. Owner must engage solicitor. L5 is T&C consent screen — hard go-live blocker.
11. **`locationRestriction` must not be used** on Nearby tab — causes empty results. Radius enforced client-side.
12. **Logo rebuild complete** — all icon files in repo and wired up. Splash screen and home screen icon working. No further action needed unless owner creates new exports.
13. **Firebase first in Phase 3** — personal data (journal, notes, photos) cannot safely live in localStorage long-term. `docs/research/firebase-setup-plan.md` produced by Researcher.
14. **Today tab = Lucide icons, Weather tab = Yr.no icons** — confirmed design decision, do not merge.
15. **State A headline is "Paws before you go."** — implemented. Social proof strip: "Know the route · Own the weather · Find dog-friendly spots". Do not revert.
16. **UX review march-21 done — follow-up items outstanding** — Round 1 fixes implemented. Check `docs/ux-reviews/ux-review-march-21.md` for remaining items before beta launch.
17. **Dark mode Scheme B is live** — Dark Slate palette. `--bg #141414`, `--surface #1F1F1F`. Today tab hero `#5C7A63`. Spec in `docs/specs/dark-mode-schemes.md`. Do not revert.
18. **Firebase foundation is live — boundary is firm** — anonymous auth, Firestore dual-write, Storage active. Full migration is Phase 3, gated on L1 (GDPR). Do not add Firebase reads to critical render path.
19. **PWA install prompt card in Me tab** — dismissible, persists to `sniffout_hide_install_prompt`. Does not reappear once dismissed.
20. **Silent auto-refresh via `silentWeatherRefresh()`** — triggers on `visibilitychange` and tab switch, 5-minute threshold. Runs silently, no UI blocking.
21. **OS Maps toggle is live** — Standard/OS Map pill on Walks and Nearby tabs. Leisure tiles not yet active — check 22 March. API key currently in page source — security review needed before launch.
22. **Recently Viewed is in Me tab** — subpage overlay, `sniffout_recent_walks`, up to 10 walks. Removed from Today tab pills.
23. **Walk cards show distance from user** — "X.X km away" / "X.X mi away" in Walks tab list view.
24. **Lucide pinned to version 0.577.0** — do not change the CDN version without explicit instruction.
25. **`me-stat-card--primary` number colour is `var(--ink)`** — in both light and dark mode. Do not override without explicit owner instruction.
