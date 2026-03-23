# Sniffout — Session Handoff Note
**Date:** 22 March 2026
**Prepared by:** Product Owner agent
**Purpose:** Complete context handoff for the next Claude chat session. A new session reading this document should be able to pick up immediately with zero loss of context.
**Replaces:** session-handoff-march-20.md (moved to `docs/handoffs/archive/`)

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

Phase 2: localStorage only (no backend). Firebase foundation is live (anonymous auth, Firestore dual-write, Storage) but the full migration remains Phase 3, gated on GDPR sign-off (L1).

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
| Application | Single HTML file (`sniffout-v2.html`) — inline CSS in `<style>`, inline JS in `<script>`. **All inline script blocks merged into one** — hoisting errors are now permanently resolved. |
| Deployment | GitHub Pages, custom domain via `CNAME` file |
| Weather | Open-Meteo API (no auth, free tier) — always fetches fresh on every load |
| Dog-friendly venues | Google Places API (New) — requests routed via Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| Reverse geocoding | Nominatim/OSM (no auth) |
| UK postcode lookup | postcodes.io (no auth) |
| Map rendering | Leaflet 1.9.4 (CDN) |
| Icons | Lucide icons (inline SVG, custom function `luIcon()`) pinned to v0.577.0 + Yr.no weather SVG icons |
| Weather icon sets | Today tab uses white Lucide icons; Weather tab uses Yr.no meteocon SVGs (96px, margin-top 14px) |
| Typography | Inter (Google Fonts CDN) |
| Service worker | `sw.js` — network-first, cache fallback, cache key `sniffout-v2` |
| PWA manifest | `manifest.json` — `start_url` set to `/sniffout-v2.html`, `theme_color` `#3B5C2A` |
| Brand colour | `#3B5C2A` (Meadow Green) — fully implemented throughout |
| Firebase | Compat SDK v10.12.0 (CDN) — project `sniffout-fe976`, region `europe-west2`. Anonymous auth + Firestore dual-write + Storage. **API key corrected 22 March** (previous key belonged to wrong project). Foundation only — full migration is Phase 3. |
| OS Maps | Ordnance Survey Data Hub, project "sniffout". Standard/OS Map toggle above map on Walks and Nearby tabs. ZXY endpoint: `https://api.os.uk/maps/raster/v1/zxy/{style}_3857/{z}/{x}/{y}.png`. API key: `JcMmulbTghzn8pkYAGdxd8MH6GTK2314`. Premium Data Plan active. **Leisure tiles still not activating** — support ticket not yet raised. Owner to raise ticket with OS Data Hub. Currently defaults to Standard (OSM). **Note: API key is currently in page source — deferred to pre-launch security review (H10).** |

### Local dev

```bash
cd ~/Desktop/my-first-repo
python3 -m http.server
```

Then open `http://localhost:8000/sniffout-v2.html` in Chrome. No build step needed.

**To review mockup files locally:** `http://localhost:8000/docs/mockups/filename.html`

### API key security

Google Places API key is secured behind the Cloudflare Worker proxy at `places-proxy.sniffout.app`. The key is not in page source. Place photo requests also route through the proxy. Pre-launch checklist item T1 is resolved. Do not revert to direct Google URL under any circumstances.

OS Maps API key is currently hardcoded in page source. This is a known pre-launch security item (H10 in `docs/ux-reviews/ux-review-march-22.md`) — deferred to a dedicated pre-launch security review.

### Firebase status (as of 22 March 2026)

Anonymous auth and Firestore dual-write are working correctly after the API key was corrected. Two remaining console items are confirmed non-issues:

- **`enableMultiTabIndexedDbPersistence` deprecation warning** — address during Phase 3 Firebase migration. Does not affect current functionality.
- **PWA install banner warning** — intentional behaviour. Not a bug.

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
- **When badge icons or similar asset implementations fail silently**, check for duplicate function names and mismatched render paths before assuming an ID mismatch. This was the root cause of the badge icon issue in Round 26/27 — a duplicate `renderMeBadges` function silently taking precedence.
- **Free-form walk logging is live.** The walk journal now accepts both curated (`type: "curated"`) and user-created entries (`type: "custom"`). All functions that work with the walk log must handle both types correctly.
- **Wishlist = "On my sniff list", Favourites = "Sniffed and approved".** These are confirmed brand names. Any Developer brief or copy touching these features must use these exact labels.
- **UX review march-22 was completed** — saved to `docs/ux-reviews/ux-review-march-22.md`. Rounds A and B fixes implemented. Four items deliberately deferred — see Section 6 for full details. Do not attempt to implement deferred items without explicit owner direction.
- **Screenshot context has limits.** In sessions where many screenshots have been shared, the chat context can become constrained. Where possible, prefer terminal output and plain descriptions of issues over screenshots. Reserve screenshots for cases where visual inspection is genuinely necessary.
- **`locationRestriction` must not be used** on the Nearby tab. It is incompatible with the `searchText` endpoint and causes empty results. Radius is enforced client-side. Do not reintroduce it.
- **`renderWeather()` must never manipulate `body.night`.** Dark mode is user-controlled via Settings. The `is_day` API value must not be used to set or remove the `body.night` class. This was a production bug — fixed 22 March. Do not reintroduce.
- **All inline script blocks are now merged into one.** This resolved all hoisting errors (`getSavedUnits`, `renderRecentlyViewedMe`, `formatDist` scope issues). If new JS is added, it must go inside the single script block, not as a new `<script>` tag.

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
- renderWeather() must never set or remove body.night - dark mode is user-controlled only
- All JS must go inside the single merged script block - no new separate script tags

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
- Currently at approximately Round 36+
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
- Active handoff: docs/handoffs/session-handoff-march-22.md (this document)

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
- Use terminal output and descriptions instead of screenshots where possible
- When reviewing mockups open locally:
  python3 -m http.server
  Then visit http://localhost:8000/docs/mockups/filename.html

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
| **Copywriter** | Writes walk descriptions in persona voice. Uses the 5 personas in `docs/content/copywriter-personas.md`. | `descriptions-batch-0N.md` |
| **Editor** | Reviews Copywriter output for persona voice, rule compliance, and quality. Returns edited descriptions. | `editor-review-batch-0N.md` |
| **Validator** | Cross-checks walk data fields in batch data files and descriptions for accuracy, consistency, and schema compliance. | `validation-report-batch-0N.md` |

---

## SECTION 5 — WHAT WAS BUILT: COMPLETE ROUND HISTORY

*(Rounds 11-33 and all 20-21 March sessions are documented in the archived `docs/handoffs/archive/session-handoff-march-20.md`. Summary below covers only the most recent context needed for continuity.)*

### Key milestones prior to 22 March (summary)

- **Rounds 11-33** — full app build: walk discovery, weather, Nearby tab, dog profile, walk journal, free-form logging, badges, dark mode, units toggle, brand colour, Firebase foundation, State A redesign, hourly forecast, OS Maps toggle
- **20 March** — Firebase foundation live, dark mode Scheme B, PWA install prompt, silent auto-refresh, logo icons complete
- **21 March** — UX review march-21 conducted, Round 1 fixes, OS Maps integrated, Recently Viewed in Me tab, distance on walk cards, repo restructure into `docs/` subfolders

### Completed — 22 March 2026

**Nearby tab — green spaces query overhaul:**
- **Multi-query approach implemented** — green spaces query changed from a single `'parks and nature reserves near locationName'` text query to a multi-query approach: `parks`, `nature reserve`, `common land`, `country park`. Results are deduplicated by place ID after all four queries complete.
- **Car parks filtered** — car park results that were appearing in green spaces results are now filtered out using `primaryType` check and name keyword filter post-fetch.
- **`locationName` removed from Nearby textQuery** — appending the location name to the textQuery string was hurting GPS-based results. `locationBias` handles proximity; the location name is not needed in the query string. Removed from all Nearby queries.

**Nearby tab — radius and caching fixes:**
- **Radius storage unified to km** — miles conversion round-trip removed. Radius is now stored and operated on in km throughout. No more km/miles conversion on the way in and out.
- **Radius guard removed** — the `radiusChanged` check that was preventing radius updates has been removed.
- **Green spaces cache cleared on radius change** — when the user changes radius via the filter sheet, the green spaces cache is now cleared so fresh results are fetched at the new radius.
- **Green spaces client-side radius filter added** — post-fetch filter now enforces the selected radius on green space results, matching the pattern used for other venue types.

**JavaScript architecture — hoisting errors permanently resolved:**
- **All 14 inline script blocks merged into 1** — `sniffout-v2.html` previously had 14 separate `<script>` blocks. All merged into a single block. This permanently resolves all function hoisting errors (`getSavedUnits`, `renderRecentlyViewedMe`, `formatDist` scope errors that were breaking features). Any future JS additions must go inside this single block.

**Firebase — API key corrected:**
- **Firebase API key corrected to `sniffout-fe976` browser key** — the previous key belonged to the Walk Planner project (a different Firebase project). Anonymous auth and Firestore dual-write are now working correctly. The two remaining console items are confirmed non-issues (see Section 2).

**Dark mode — `renderWeather()` override fixed:**
- **`renderWeather()` no longer manipulates `body.night`** — the function was applying or removing the dark mode class based on `cur.is_day` from the weather API. This silently overrode the user's Settings preference every time weather was fetched. The `body.night` manipulation is now removed from `renderWeather()` entirely. Auto mode is handled separately via `prefers-color-scheme`. Do not reintroduce this pattern.

**Bug fixes:**
- **`btoa` non-ASCII crash fixed in `getDeviceId()`** — `btoa(navigator.userAgent)` throws on browsers whose user agent contains non-ASCII characters (some Android OEM builds). Fixed with `btoa(unescape(encodeURIComponent(...)))`.
- **Units consistency fixed** — portrait cards and trail cards were hardcoding `' mi'` instead of using `formatDist()`. Fixed. Location context header in Walks tab was hardcoding `'km'` — now branches on `getSavedUnits()`.
- **`wx-verdict--caveat` dark mode override added** — this class had a hardcoded hex colour with no dark mode equivalent. CSS custom property / override added.
- **Meta description updated** — stale walk count removed from `<meta name="description">`.
- **Swipe dismiss threshold standardised** — all sheets now use 100px threshold. Walk detail overlay previously used 150px.
- **Various icon and CSS polish fixes (Round B)** — additional fixes from the UX review Round B pass.

**UX review — 22 March 2026:**
- **Full UX review conducted** — saved to `docs/ux-reviews/ux-review-march-22.md`. Rounds A and B fixes implemented from the review.
- **Four items deliberately deferred** — see Section 6 "Deferred UX review items" for full details and rationale.

**Push notifications — research and owner decisions:**
- **Full research report produced** — saved to `docs/research/push-notifications-research.md`. Covers technical architecture, notification types, home location design, user preferences, timing, browser support, and implementation order.
- **Owner decisions confirmed** — see Section 6 "Push notifications" for the full set of confirmed decisions.

---

## SECTION 6 — KEY DECISIONS ON RECORD

These decisions are locked and should not be revisited without a clear reason.

### Brand colour

`#3B5C2A` (Meadow Green) is fully implemented. No references to `#1E4D3A` should remain anywhere.

### Weather fetch strategy

Always fetch fresh. App renders instantly with cached data, re-renders when live data arrives. Never serve stale weather.

### `renderWeather()` must never touch dark mode

`renderWeather()` previously set/removed `body.night` based on `is_day` from the weather API. This was a production bug — it silently overrode the user's Settings preference on every weather fetch. Fixed 22 March. **Do not reintroduce any `body.night` manipulation inside `renderWeather()` or any weather-related function.**

### All inline JS in one script block

All 14 separate `<script>` blocks in `sniffout-v2.html` have been merged into one. This permanently resolves hoisting errors. **All future JS additions must go inside the single script block, not as a new `<script>` tag.**

### Firebase API key — correct key is `sniffout-fe976` browser key

The Firebase API key was wrong (pointed to Walk Planner project). Corrected 22 March. The correct key is the browser API key for project `sniffout-fe976`. Anonymous auth and Firestore dual-write are now working.

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

km is the default. Miles toggle in Settings, saves to `sniffout_units`. `formatDist()` helper applied everywhere. Radius stored in km throughout — no miles round-trip.

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

### Tap target standard

All interactive elements set to minimum 44px (WCAG 2.5.5 / Apple HIG). Apply to all new interactive elements in future rounds.

### Nearby radius — locationBias not locationRestriction

`locationRestriction` caused empty results. Permanently reverted to `locationBias`. Radius enforced client-side by post-fetch distance filter. Do not reintroduce `locationRestriction`.

### Nearby tab — no location name in textQuery

Appending `locationName` to the Nearby textQuery string hurt GPS-based results. `locationBias` handles proximity. The location name must not be appended to textQuery for any Nearby venue query.

### Green spaces — multi-query with deduplication

Green spaces results use four separate queries (`parks`, `nature reserve`, `common land`, `country park`) with deduplication by place ID. The old single `'parks and nature reserves near locationName'` query is replaced. Do not revert to single query.

### Location switching — available on all three main tabs

Today, Walks, and Nearby tabs all have a tappable location line with inline search bar.

### Hourly forecast bar and Walk Window — both live on Weather tab

Walk Window is Card 1 (6am-midnight scope), Hour by hour is Card 2. Tappable temperature spec (`docs/specs/temperature-tap-spec.md`) is superseded — do not re-implement.

Designer spec: `docs/specs/hourly-forecast-spec.md`. Layout recommendation: `docs/specs/hourly-forecast-layout-rec.md`.

### T&C consent screen is a hard go-live blocker

Users must actively accept Terms of Service before using the app for the first time. This is L5 in the pre-launch blockers. Depends on L3 (ToS copy from solicitor). Developer work required once ToS exists.

### Report an issue — Phase 3

Deferred to Phase 3. Requires Firebase backend.

### Dark mode Scheme B — confirmed and implemented

Dark Slate palette is live. Tokens documented in CLAUDE.md. Spec in `docs/specs/dark-mode-schemes.md`. Do not revert.

### Firebase foundation — live but boundary is firm

Firebase project `sniffout-fe976` (region `europe-west2`) is integrated. Anonymous auth, Firestore dual-write for walk log, and Firebase Storage are active. **The boundary:** this is write-only foundation. No Firebase reads on the critical render path. localStorage remains source of truth for all UI rendering. Full authenticated Firebase migration remains Phase 3, gated on GDPR (L1). Do not expand Firebase scope without explicit instruction.

### OS Maps toggle

Standard/OS Map pill is live above the map on Walks and Nearby tabs. API key is currently in page source — pre-launch security item (H10), deferred to dedicated security review. Leisure tiles pending activation — owner to raise support ticket with OS Data Hub.

### Recently Viewed walks

`sniffout_recent_walks` localStorage key. Stores up to 10 recently viewed curated walk IDs, most recent first. Entry row in Me tab between Walk Journal and Badges. Uses subpage overlay pattern. Removed from Today tab pills.

### Walk save actions — simplified

Heart button removed from walk detail overlay. Only the bookmark button remains, labelled "Add to our walk list".

### Social proof strip

"Know the route · Own the weather · Find dog-friendly spots" — do not revert to the shorter "Find the spots" version.

### Lucide icon library — version pinned

Lucide pinned to version 0.577.0 in the CDN import. Do not change the version without explicit instruction.

### Primary stat card number colour — locked

`me-stat-card--primary` number colour is `var(--ink)` in both light and dark mode. Documented in CLAUDE.md. Do not add a colour override without explicit owner instruction.

### Push notifications — owner decisions confirmed (Phase 3)

Full research report at `docs/research/push-notifications-research.md`. Owner decisions confirmed:

- **Notification types at launch:** Hazard-only — Types 1-5: extreme heat, paw heat warning, storm, dangerous wind, freeze/ice. Morning walk reminder (Type 6) and rain incoming (Type 7) deferred to post-launch follow-up.
- **Infrastructure:** Firebase Cloud Functions. No third-party services (OneSignal etc.) — keeps all data within Firebase/europe-west2.
- **Home location:** Banner prompt on Today tab after postcode search ("Save as home location?") plus editable in Me tab settings. Stored in `sniffout_home_location` localStorage and Firestore user document.
- **Quiet hours:** 9pm-7am UK time (GMT/BST, DST-aware). No notifications outside this window regardless of trigger.
- **Full implementation:** Phase 3, gated on Firebase full migration and GDPR sign-off (L1). 12-step implementation order documented in research report.

### Deferred UX review items (from ux-review-march-22.md)

These four items were reviewed and deliberately deferred. Do not attempt to implement without explicit owner instruction:

- **B2: `beforeunload` handler** — the handler currently fires a leave-page dialog on all navigation. A surgical fix is needed that only fires when there is genuinely unsaved data. Owner has seen the dialog only a couple of times in normal use — not urgent. Test on device before changing; the handler was originally added to fix the Android back button closing the browser. Fix carefully.
- **H10: OS Maps API key in page source** — deferred to dedicated pre-launch security review, alongside Google Places proxy review.
- **M5: Duplicate row-building code in `renderMeWalkLog()`/`meExpandWalkLog()`** — deferred to a dedicated refactoring round.
- **M7: Inline styles in `renderCondTagSheet()`** — deferred to a dedicated refactoring round.

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
| Showcase carousel walks needing photos (priority) | 7 — `isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland` |

Walk photos are hosted on GitHub as raw URLs:
`https://raw.githubusercontent.com/jayeshfatania/my-first-repo/main/filename.jpg`

Image files must be pushed to the repo before being referenced in `WALKS_DB`.

### Batch status

**Batch 01:** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app

**Batch 02 (20 walks):** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app

**Batch 03 (20 walks — Northern Ireland, Hampshire, Wiltshire, Somerset, Gloucestershire, Highland Scotland, Yorkshire coast, County Durham, Lincolnshire, Oxfordshire, Greater Manchester, Bristol, Essex, Isle of Wight, Dorset):** Researcher ✅ / Copywriter ✅ / Editor ✅ / Validator ✅ / Developer ✅ — in app

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

As of end of day 22 March 2026:

### 1. OS Maps Leisure tiles — support ticket not yet raised (owner action)

Premium Data Plan is active but Leisure tiles are still not rendering. A support ticket with OS Data Hub has not yet been raised.

**Next action:** Owner to raise support ticket with OS Data Hub.

### 2. Photos for 7 showcase carousel walks (priority — owner action)

The State A showcase carousel features 7 specific walks. These are the most visible walks in the app for a first-time user.

Walks: `isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland`

**Next action:** Owner to source photos. Push image files to repo before referencing in `WALKS_DB`.

### 3. UX review follow-up — deferred items outstanding

Four items from `docs/ux-reviews/ux-review-march-22.md` are deliberately deferred. See Section 6 "Deferred UX review items" for full details and rationale.

**Next action:** B2 (`beforeunload` handler) is the most impactful. Owner to decide when to tackle. Others can wait for dedicated refactoring rounds.

### 4. Walk image sourcing — 97 remaining (ongoing — owner action)

97 walks still use `placeholder-walk.jpg`. 3 have real photos. Showcase carousel walks (item 2 above) are the priority.

**Next action:** Owner to direct sourcing strategy.

### 5. Push notification spec (PO task)

Research is complete and owner decisions are confirmed. A formal Phase 3 spec document should be produced before Firebase migration begins, so the Developer brief is ready.

**Next action:** PO to produce formal push notification spec based on confirmed decisions in research report.

### 6. Pre-launch checklist review (PO task)

The pre-launch checklist at `docs/po/pre-launch-checklist.md` has not been updated since early in the project. Several items have been resolved (T1, T14) and new items have emerged (OS Maps API key security, push notification consent).

**Next action:** PO to review and update the checklist.

### 7. GDPR solicitor (owner action — outstanding blocker)

L1, L2/L3, L4, and L5 all blocked on solicitor engagement.

**Next action:** Owner engages solicitor. Target: at least 4 weeks before any beta launch date.

---

## SECTION 9 — WHAT COMES NEXT

### Immediate (in priority order)

1. **OS Maps support ticket** — owner to raise with OS Data Hub. Leisure tiles overdue.
2. **Photos for 7 showcase carousel walks** — owner to source. Most visible walks in the app.
3. **UX review follow-up** — deferred items from `docs/ux-reviews/ux-review-march-22.md`. B2 (`beforeunload`) is most impactful.
4. **Push notification spec** — PO to produce formal Phase 3 spec document.
5. **Pre-launch checklist review** — PO to update `docs/po/pre-launch-checklist.md` to reflect current status.

### Soon (Phase 2 remaining)

- **Walk image sourcing** — 97 walks need photos. Owner to direct.
- **Copy review session** — all UI copy reviewed against brand voice.
- **Walk Wrapped summary** — twice yearly (July and December/January). Walk log foundation exists. Needs Designer spec.
- **Nearby places placeholder image** — owner to create in Illustrator. Separate from `placeholder-walk.jpg`.
- **Brand guidelines document** — Meadow Green `#3B5C2A` confirmed but full guidelines not yet produced.
- **MoSCoW prioritisation** — owner to complete when ready to triage the backlog.

### Phase 3 (priority order — confirmed)

1. **Firebase full migration** — foundation is live. Phase 3 completes: authenticated user accounts, server-side walk log reads, full localStorage → Firestore migration. Region `europe-west2`. GDPR sign-off (L1) is hard prerequisite.
2. **Push notifications** — Firebase Cloud Functions, hazard-only types at launch. Research complete. Spec to be produced. GDPR sign-off required before any real users.
3. **Report an issue** — Firestore-backed submission form.
4. **Missing Dog alerts** — Firestore-backed, map layer.
5. **User-submitted walks** — editorial review before publish, curated vs community badge.
6. **Community ratings** — Bayesian weighted, min 3 reviews before stars.
7. **Push notifications — follow-up types** — morning walk alert (Type 6), rain incoming (Type 7), after launch validation.

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

All files in `~/Desktop/my-first-repo/`. Documentation files are organised into `docs/` subfolders following the repo restructure on 21 March 2026.

### Core app (root — never move these)

| File | Purpose |
|------|---------|
| `sniffout-v2.html` | **The app.** Everything: inline CSS, inline JS (single merged block), all HTML. Only file to edit for app changes. |
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
| `docs/po/po-action-plan-round24.md` | **Active PO document.** Current round status, decisions, next up. |
| `docs/po/po-action-plan-round12.md` | Historical record. PO decisions from Rounds 12-23. |
| `docs/po/product-vision-update.md` | Strategic vision. Discovery → personal record reframe. |
| `docs/po/community-gamification-roadmap.md` | Phase 2/3/4 roadmap. |
| `docs/po/pre-launch-checklist.md` | Pre-launch checklist. Needs update to reflect current status. T1 and T14 resolved. Four legal blockers outstanding. |

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
| `docs/specs/hourly-forecast-spec.md` | Hourly forecast bar spec. Implemented — "Hour by hour" is Card 2 on Weather tab. |
| `docs/specs/hourly-forecast-layout-rec.md` | Designer layout recommendation for hourly forecast bar. |
| `docs/specs/temperature-tap-spec.md` | Tappable temperature spec. Feature implemented and reverted — superseded. |
| `docs/specs/state-a-redesign-spec.md` | Designer spec for State A first-run screen redesign. Implemented 20 March 2026. |
| `docs/specs/dog-diary-feature-scope.md` | Strategic scoping for dog diary feature. Deferred to Phase 2b post-launch. |
| `docs/specs/dark-mode-schemes.md` | Dark mode colour scheme options. Scheme B (Dark Slate) confirmed and implemented. |
| `docs/specs/install-prompt-spec.md` | PWA install prompt card spec. Implemented 20 March 2026. |
| `docs/research/brand-colour-proposal.md` | 8 colour options. Option G (Meadow Green `#3B5C2A`) confirmed. |
| `docs/briefs/developer-brief-restaurants.md` | Brief for dog-friendly restaurants/pubs. Permanently deferred. |

### Content pipeline files

| File | Purpose |
|------|---------|
| `docs/content/copywriter-personas.md` | Five persona definitions. Must be read before any Copywriter or Editor work. |
| `docs/content/uk-dog-breeds.md` | 62 UK dog breeds for the breed dropdown. |
| `docs/content/walks-batch-01-data.md` through `docs/content/walks-batch-03-data.md` | Researcher data for each batch. |
| `docs/content/descriptions-batch-02.md`, `docs/content/descriptions-batch-03.md` | Copywriter descriptions (batches 02-03). |
| `docs/content/editor-review-batch-01.md` through `docs/content/editor-review-batch-03.md` | Editor-reviewed descriptions. |
| `docs/content/validation-report-batch-01.md`, `docs/content/validation-report-batch-02.md`, `docs/content/validator-report-batch-03.md` | Validator sign-off for all batches. |

### Research

| File | Purpose |
|------|---------|
| `docs/research/firebase-setup-plan.md` | Firebase architecture and setup plan for Phase 3. |
| `docs/research/push-notifications-research.md` | **Push notification research.** Technical architecture, notification types, home location design, implementation order. Owner decisions confirmed. |
| `docs/research/dog-friendly-venues-research.md` | Research on dog-friendly venue data sources for Nearby tab. |

### UX reviews

| File | Purpose |
|------|---------|
| `docs/ux-reviews/ux-review-march-21.md` | UX review 21 March 2026. Round 1 fixes implemented. |
| `docs/ux-reviews/ux-review-march-22.md` | **Current UX review.** 22 March 2026. Rounds A and B fixes implemented. Four items deliberately deferred — see Section 6. |

### Session handoff notes

| File | Purpose |
|------|---------|
| `docs/handoffs/archive/session-handoff-march-20.md` | Archived. Covers 20-21 March 2026. Full round history Rounds 11-33 in this file. |
| `docs/handoffs/session-handoff-march-22.md` | **This document. Current active handoff.** |

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
- Owner uses **Illustrator** for design assets. Logo rebuild is complete — new exports only if the owner creates revised assets.

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
4. **All batches complete — walk count is 100** — use `WALKS_DB.length` dynamically, never hardcode a number.
5. **Brand colour is `#3B5C2A` (Meadow Green)** — fully implemented. No `#1E4D3A` references should remain.
6. **Hourly forecast bar is LIVE** — "Hour by hour" is Card 2 on Weather tab. Walk Window is Card 1. Tappable temperature spec is superseded.
7. **97 walks still need photos** — 3 have real photos. 7 showcase carousel walks are priority.
8. **Brand language: "On my sniff list" and "Sniffed and approved"** — confirmed names. Do not revert.
9. **Walk card placeholder is `placeholder-walk.jpg`** — no gradients.
10. **L1-L5 are all legal blockers** — solicitor-dependent. L5 is T&C consent screen — hard go-live blocker.
11. **`locationRestriction` must not be used** on Nearby tab — causes empty results. Radius enforced client-side.
12. **Logo rebuild complete** — all icon files in repo, wired up. No further action needed unless owner creates new exports.
13. **Firebase foundation is live — boundary is firm** — write-only, anonymous auth + dual-write + Storage. Full migration is Phase 3, gated on L1. Do not add Firebase reads to critical render path.
14. **Today tab = Lucide icons, Weather tab = Yr.no icons** — confirmed design decision, do not merge.
15. **State A headline is "Paws before you go."** — social proof strip: "Know the route · Own the weather · Find dog-friendly spots". Do not revert.
16. **`renderWeather()` must never touch `body.night`** — dark mode is user-controlled. This was a production bug, fixed 22 March. Do not reintroduce.
17. **All inline JS is in one merged script block** — no new `<script>` tags. Hoisting errors permanently resolved.
18. **Firebase API key corrected** — correct key is `sniffout-fe976` browser key. Anonymous auth and Firestore dual-write working.
19. **OS Maps toggle is live** — Leisure tiles still pending. Owner to raise support ticket. API key in page source — deferred security review (H10).
20. **Green spaces uses multi-query with dedup** — four queries: `parks`, `nature reserve`, `common land`, `country park`. No location name in textQuery. Do not revert to single query.
21. **Push notification decisions confirmed** — hazard-only at launch (Types 1-5), Firebase Cloud Functions, home location via banner prompt + settings. Full Phase 3 spec needed before implementation.
22. **Four UX items deliberately deferred** — B2 (`beforeunload`), H10 (OS Maps key), M5 (duplicate code), M7 (inline styles). Do not implement without owner direction.
23. **Lucide pinned to v0.577.0** — do not change CDN version without explicit instruction.
24. **Recently Viewed in Me tab** — `sniffout_recent_walks`, up to 10 walks, subpage overlay. Removed from Today tab pills.
