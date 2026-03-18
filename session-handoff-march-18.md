# Sniffout — Session Handoff Note
**Date:** 18 March 2026
**Prepared by:** Product Owner agent
**Purpose:** Complete context handoff for the next Claude chat session. A new session reading this document should be able to pick up immediately with zero loss of context.

---

## SECTION 1 — WHAT IS SNIFFOUT

### Product description

Sniffout is a mobile-first Progressive Web App (PWA) for discovering dog walks across the UK. It is built and deployed as a single HTML file on GitHub Pages at `sniffout.app`. There is no backend, no login required, and no build tools — everything runs in the browser using `localStorage` for state.

The product is currently a **Proof of Concept (POC)**, being validated with real users before investing in a backend (Firebase). The owner's goal is a soft launch to beta testers within weeks, not months.

### The strategic reframe (confirmed today)

Sniffout is shifting from a **discovery tool** ("find a good walk, check the weather, go") to a **personal record** — a dog walking journal that happens to also be the best way to find new walks.

This is a critical strategic distinction. Discovery tools are used occasionally and replaced when something better appears. Personal records are irreplaceable. "We've done 34 walks together, and I have notes from most of them" is not something a user migrates away from. The dog profile and walk journal features shipped in Rounds 19 and 20 are the mechanism for this shift.

### Competitive position

- Closest competitor: **PlayDogs** (France/Switzerland, 170k downloads) — relies on community-generated content, currently empty across the UK. No curated foundation.
- No UK competitor combines: walk discovery + live weather + dog-specific hazard context + no login required.
- Closest UK structural analogue: **Walk Highlands** (Scotland-focused, desktop-era, no app). Sniffout is a mobile-first PWA improvement on that model.
- **AllTrails** and **Komoot** are not direct competitors in the dog owner segment — they have never addressed the dog-specific angle meaningfully.

### Current phase

Phase 2: localStorage only (no backend). Firebase is Phase 3, now elevated to the top of Phase 3 priority because the app holds irreplaceable personal data (walk journal, notes, dog profile, photos).

---

## SECTION 2 — LIVE URLS AND TECHNICAL SETUP

### Live URLs

| URL | Status | What it serves |
|-----|--------|----------------|
| `https://sniffout.app` | Live | GitHub Pages, currently `dog-walk-dashboard.html` via `index.html` redirect |
| `https://sniffout.co.uk` | Registered but not yet redirecting | Should point to `sniffout.app` — not yet set up (pre-launch checklist item B2) |
| `https://jayeshfatania.github.io/my-first-repo/` | Live (base URL) | Same as above |
| `https://sniffout.app/sniffout-v2.html` | Accessible but not the default | v2 is deployed but `index.html` still redirects to the old production file |

**Critical:** `index.html` currently redirects to `dog-walk-dashboard.html` (live v1). This must be updated to redirect to `sniffout-v2.html` before v2 goes live. This is pre-launch checklist item T14 — a hard blocker.

### Repository

- **Repo:** `github.com/jayeshfatania/my-first-repo`
- **Main branch:** `main`
- **Deployment:** GitHub Pages, auto-deploys on push to `main`. Deploys in approximately 1 minute.
- **Production file:** `dog-walk-dashboard.html` — DO NOT TOUCH. Protected per CLAUDE.md.
- **Active development file:** `sniffout-v2.html` — all changes go here.

### Git workflow

```bash
cd ~/Desktop/my-first-repo
git add .
git commit -m "descriptive message here"
git push
```

That is the complete push workflow. No branches, no PRs, no staging environment. Push directly to main. GitHub Pages auto-deploys.

**Rollback:** `git revert HEAD` then `git push`, or find the previous commit hash with `git log` and hard reset. The single-file architecture makes rollback straightforward.

### Tech stack

| Component | Technology |
|-----------|-----------|
| Application | Single HTML file (`sniffout-v2.html`) — inline CSS in `<style>`, inline JS in `<script>` |
| Deployment | GitHub Pages, custom domain via `CNAME` file |
| Weather | Open-Meteo API (no auth, free tier) |
| Dog-friendly venues | Google Places API (New) — API key currently hardcoded in JS (SECURITY RISK — must move to proxy before public launch) |
| Reverse geocoding | Nominatim/OSM (no auth) |
| UK postcode lookup | postcodes.io (no auth) |
| Map rendering | Leaflet 1.9.4 (CDN) |
| Icons | Lucide icons (inline SVG, custom function `luIcon()`) + Yr.no weather SVG icons |
| Weather icon sets | Today tab uses white Lucide icons; Weather tab uses Yr.no meteocon SVGs |
| Typography | Inter (Google Fonts CDN) |
| Service worker | `sw.js` — network-first, cache fallback, cache key `sniffout-v2` |
| PWA manifest | `manifest.json` |

### Local dev

```bash
cd ~/Desktop/my-first-repo
python3 -m http.server
```

Then open `http://localhost:8000/sniffout-v2.html` in Chrome. No build step needed.

### API key security warning

The Google Places API key is currently hardcoded in `sniffout-v2.html`. This is a live billing risk — anyone who views source can extract and abuse the key. A Cloudflare Worker proxy is in progress (Developer working on this). **Do not share the app URL publicly until the proxy is deployed.** This is pre-launch checklist item T1 — a hard blocker.

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

### Plain English always

The owner was new to terminal and git at the start of this project. Always explain what commands do before giving them. Never assume knowledge of git internals, terminal syntax, or web development concepts. If something might be confusing, explain it proactively.

### Owner pastes, Claude never directly edits

Claude does not edit `sniffout-v2.html` or any project file directly in chat. All file changes are made by agents in tmux panes. Claude provides the prompt, the owner pastes it into the correct pane, and the agent does the work.

### How agent prompts are structured

Every agent prompt Claude drafts includes:
1. The agent's role (e.g., "You are the Developer for Sniffout")
2. Which files to read before starting
3. The specific task, with exact instructions
4. The output format
5. Any constraints or context specific to this round

### Decision flags

When an agent output contains something requiring an owner decision, Claude flags it explicitly before moving on. The owner makes all final decisions — Claude recommends, never decides.

---

## SECTION 4 — AGENT TEAM

All agents run as Claude Code sessions in tmux panes, operating on the repository at `~/Desktop/my-first-repo`.

| Agent | Role | Typical output |
|-------|------|----------------|
| **Product Owner (PO)** | Translates owner direction into structured decisions and developer briefs. Reviews research and design outputs. Writes action plans and handoff notes. | `po-action-plan-roundNN.md`, `session-handoff-*.md`, `product-vision-update.md` |
| **Developer** | Implements all code changes in `sniffout-v2.html`. Writes no specs or documentation. Follows developer briefs precisely. | Modified `sniffout-v2.html`, pushed to GitHub Pages |
| **Designer** | Produces design specs and UX decisions. Does not write code. Produces spec files that Developer briefs reference. | `*-spec.md`, `*-redesign-spec.md`, mockup HTML files |
| **Researcher** | Researches specific topics (walk data, competitor analysis, feature best practices). Produces verified research documents. | `*-research.md`, `walks-batch-0N-data.md`, `product-vision-update.md` |
| **Copywriter** | Writes walk descriptions in persona voice. Uses the 5 personas in `copywriter-personas.md`. | `descriptions-batch-0N.md` |
| **Editor** | Reviews Copywriter output for persona voice, rule compliance, and quality. Returns edited descriptions. | `editor-review-batch-0N.md` |
| **Validator** | Cross-checks walk data fields in Batch data files and descriptions for accuracy, consistency, and schema compliance. | `validation-report-batch-0N.md` |

---

## SECTION 5 — WHAT WAS BUILT: COMPLETE ROUND HISTORY

### Round 11 — Walk detail overlay, Yr.no icons, trail card declutter

- Walk detail overlay redesigned as a bottom-up panel
- Yr.no meteocon weather icons integrated (replacing emoji)
- Trail card UI decluttered (removed noise from walk list cards)

### Round 12 — Swipe dismiss, conditions z-index, tag conflicts, walk logging foundation

Four fixes from owner device testing:

- **FIX 13.1** — Swipe-down gesture to dismiss the walk detail overlay. Drag handle visual affordance added. `initWalkDetailSwipe()` function.
- **FIX 13.2** — Conditions prompt z-index fix (was hidden behind overlay). Raised `#cond-tag-sheet` to z-index 401. Replaced session-level dismissal with `hasSubmittedTagsToday()` 24-hour check. Added "Add or update conditions" manual re-trigger link.
- **FIX 13.3** — Contradictory condition tags: `COND_CONFLICTS` map for `busy`/`quiet` mutual exclusion only (not `clear` — that tag was removed in Round 9).
- **FIX 13.4** — Walk log data model: replaced `sniffout_walked` (flat array) with `sniffout_walk_log` (timestamped entries). Added `getWalkLog()`, `logWalk()`, `isWalked()`, `isWalkedToday()`, `getWalkLogCount()`, `getLastWalkDate()`. Three-state button (never walked / walked today / walk again). One-time migration from old schema. Undo toast removed (incompatible with log model).

### Round 12b — Android swipe fix, bottom close button

- Android-specific swipe dismiss bug fixed
- Bottom close button added (discovered this was needed despite original brief saying not to)

### Round 13 — Walk history, badges, pollen, disclaimer, dark mode fix, explored schema

- **FIX 14.1** — Duplicate `devils-dyke` entry removed from WALKS_DB
- **FIX 14.2** — Leaflet map touch interactions disabled in walk detail overlay (was causing accidental map drags)
- **FIX 14.3** — `sniffout_explored` schema upgraded from flat Set to timestamped object (`{ walkId: [{ ts, season }] }`) — critical schema change before walk history features shipped
- **FIX 14.4** — Walk detail overlay disclaimer added (from `disclaimer-design-spec.md`): quiet footnote strip at bottom of overlay, `var(--ink-2)`, 12px, info circle icon, passive — no acknowledgement required. Copy: "Walk details are checked at the time of listing, but conditions, access, and facilities can change. Verify before you go."
- **FIX 14.5** — Me tab walk history section (`renderWalkLogSection()`) — 5 most recent walks, "See all walks" bottom sheet
- **FIX 14.6** — Gamification helpers + badge display: `getCurrentStreak()`, `getLongestStreak()`, `getTotalDistanceMi()`, `getEarnedBadges()`. Badge chips in Me tab. Me tab stats row updated (total distance, walks logged, favourites).
- **FIX 14.7** — Dark mode toggle visibility fix (was design-blocked, resolved with fallback)

### Round 14 — Settings fix, favourites compact, Android back button, sniffout_explored schema, Me tab disclaimer, duplicate walk removed

- **FIX 15.1** — Miles label renamed to "~X mi explored" with tilde prefix and "Based on each walk's listed distance" disclaimer. No GPS — using stated walk distances as Phase 2 approximation.
- **FIX 15.2** — Favourites compact list added to Me tab (was clogging the tab). Scrollable list showing saved walks.
- **FIX 15.3** — Android back button handler extended. Back button now closes open overlays/sheets instead of exiting the app. `popstate` handler covers walk detail overlay, condition tag sheet, all bottom sheets.
- **FIX 15.4** — Settings visibility investigation and fix. Settings content was appearing in the Me tab body instead of the settings bottom sheet.

### Round 15 — Recent searches, place favouriting, Me tab rethink, badge system, Android back button

- **FIX 16.1** — Recent and starred searches extended to State B (the inline location-change panel that appears when tapping the location line mid-session — previously showed a blank search field with no history)
- **FIX 16.2** — Place favouriting: heart icon on Nearby tab venue cards. Saves to `sniffout_place_favs` localStorage. Count shown in Me tab stats.
- **FIX 16.3** — Me tab rethink (from `me-tab-rethink-v2-spec.md`): replaced dashboard approach with miles hero stat, earned badges only (hidden until earned), walk log
- **FIX 16.4** — Badge system replacement (from `badge-system-rethink.md`): 10 new badges, hidden until earned, earned moment copy, toast reveal on earn, inline detail on chip tap
- **FIX 16.5** — Android back button refinement (follow-on from Round 14)

### Round 16 — See all favourites fix, weather swipe, weather icon consistency, conditions back button, info button, all sheets swipe dismiss, nearby card tappable, saved places filter

- See all favourites bottom sheet overflow fix
- Weather tab swipe-dismiss gesture added
- Weather icon consistency: Today tab 72px with 6px margin-top, Weather tab 80px with 14px margin-top (from `weather-icon-consistency-spec.md`)
- Conditions sheet back button added
- Info button added
- All bottom sheets now support swipe-to-dismiss
- Nearby venue cards made tappable
- Saved places filter added

### Round 17 — Settings root cause fix, Me tab dashboard (miles/places/contributions), info button in pills row, green space favouriting, weather icon size

- Settings root cause identified and fixed properly (had been patched in previous rounds)
- Me tab dashboard updated with stats: miles walked, places found, contributions made
- Info button added to filter pills row
- Green space venue type added to favouriting
- Weather icon size adjustment (Weather tab)

### Round 18 — Settings buttons investigation, favourites sheet overflow, weather icon, green space heart immediate update

- Settings buttons investigated (another iteration of the recurring settings bug)
- Favourites sheet overflow resolved
- Weather icon position/size refinement
- Green space heart icon now updates immediately on tap (was lagging)

### Round 19 — DOG PROFILE (biggest round in the project)

The largest single round. Implemented the complete dog profile system:

**localStorage schema additions:**
- `sniffout_dogs` — array of dog profile objects supporting multiple dogs from day one. Each object: `{ id, name, breed, size, tags, birthday: { day, month, year }, photoUrl, isActive }`
- `sniffout_wishlist` — array of walk IDs (separate from favourites: wishlist = "want to do", favourites = "done and loved")
- Walk notes extension: `sniffout_walk_log` entries now include optional `note` field
- Weather context on log: walk log entries now store `weather_code` and `is_day` from live session data at time of logging (enables future weather-based badges)

**Dog setup card:**
- Shown on first Me tab visit when no dog profile exists (replaces the empty state)
- One field only: dog name (the single most important piece of information)
- "Skip for now" → sets `sniffout_dog_dismissed: true`, shows quiet "Add your dog →" link in footer
- After setup: Me tab re-renders immediately with dog name. No celebration screen.

**Dog profile in settings sheet:**
- Full profile editor accessible from gear icon → "Your dog" → Edit
- Fields: name, breed (dropdown with 62 common UK breeds + "Other" free text), size (Small/Medium/Large segmented control), personality tags (max 3 from 8 chips: Energetic, Nervous, Elderly, Good recall, Reactive, Loves water, Mud-happy, Sociable), birthday (day/month/year pickers)
- "Remove dog profile" — destructive link at bottom, confirmation dialog, does not delete walk history

**Me tab personalisation:**
- Dog avatar in Me tab header: 40px circle, brand-tinted, dog nose SVG mark
- Dog name replaces generic label throughout
- `heroLabel()` → "miles with Biscuit" vs "miles walked"
- `heroSub()` → "across 12 walks together" vs "across 12 walks"
- Empty state copy personalised: "Where will you take Biscuit first?" vs "Start exploring walks to build your story here."
- Multiple dogs: avatar tap opens inline switcher (Biscuit ✓ / Archie / + Add another dog). Active dog drives all copy. Walk log entries tagged with `dogId`. **This is the Phase 2 multiple dogs switcher — not deferred.**

**Walk detail overlay:**
- Walk notes: persistent inline textarea below the walked button. No modal flow. No character limit. Saves to walk log entry.
- "From your last visit: [note excerpt]" shown on return visits
- Wishlist button: bookmark icon, "Add to list" / "On your list". Available everywhere in Phase 2.
- Wishlist-to-favourite prompt: when a wishlisted walk is explored/logged, gentle prompt appears — "You've explored this — did you love it?" with heart CTA.

**Badge system complete replacement:**
- 10 new badges (from `badge-system-rethink.md`) replacing all previous badge definitions
- Hidden until earned — no locked states, no silhouette placeholders, no progress indicators
- Earned moment copy: what the badge celebrates, not what the user did (e.g., "You've become someone other walkers quietly rely on" not "Submit 5 condition reports")
- Toast reveal: badge name only, warm, 3 seconds, no celebration
- "New" indicator on badge chip if discovered on next visit
- Inline detail on chip tap: badge name, earned moment copy, date earned — no stats
- Full badge list:
  1. Leads On (Explorer, Phase 1) — 3 walks on 3 distinct days
  2. Good Mileage (Explorer, Phase 1) — 25 cumulative miles
  3. Creature of Habit (Explorer, Phase 1) — walk every week for 4 weeks
  4. Good Report (Contributor, Phase 1) — first condition report with min 1 tag
  5. Reliable Scout (Contributor, Phase 1) — 5 reports, 3+ distinct walk IDs
  6. Trail Keeper (Contributor, Phase 1) — 10 reports, 5+ distinct walk IDs
  7. Honest Bark (Contributor, Phase 3) — first review ≥75 chars
  8. Discerning Nose (Community, Phase 3) — 10 unique walk ratings
  9. Found a Good One (Community, Phase 3) — walk suggestion approved by curator
  10. Voice of the Pack (Community, Phase 3) — 5 reviews, cumulative ≥600 chars

**Birthday banner on Today tab:**
- If `sniffout_dog.birthday` is set and today matches day + month, a one-line banner appears on the Today tab: "Happy birthday, [Name]! 🎂"
- Dismissible, shown once per birthday year

### Round 20 — Walk journal in Me tab, walk photos, empty states improved, dark mode Match device, moon icon fix, approx miles prefix, note visual distinction, weather icon 96px

- Walk journal section added to Me tab: chronological log of walks with notes
- Walk photos: one per walk visit, captured via device camera or gallery, compressed using canvas API to ~200KB, stored as base64 in localStorage (TEMPORARY — Firebase Storage Phase 3). Photo appears in walk journal entry.
- Empty states improved across all tabs
- Dark mode: "Auto" renamed to "Match device", now uses `prefers-color-scheme` media query instead of sunrise/sunset. Light/Dark manual options remain.
- Moon icon fix (weather tab)
- Approx miles: "~" prefix confirmed throughout
- Walk notes now visually distinct from other content in journal (indented, different weight)
- Weather tab hero icon increased to 96px (further iteration)

### Round 21 — Birthday day field added, photo picker camera or gallery choice

- Birthday profile field now includes day (day/month/year) not just month/year
- Photo picker on walk journal: explicit choice between camera and gallery rather than defaulting to camera

### Round 22 — Birthday banner investigation, Today tab icon revert (IN PROGRESS)

- **FIX 22.1** — Birthday banner not appearing correctly — Developer investigating
- **FIX 22.2** — Today tab weather icon: reverting from Yr.no SVG back to Lucide (white) icons. Weather tab keeps Yr.no. Decision was to use different icon sets per tab: Today = Lucide white icons (simpler, cleaner for Today card context), Weather = Yr.no meteocons (detailed, appropriate for dedicated weather view).

**Status: Round 22 is in progress as of session close. Developer is working on these two fixes.**

---

## SECTION 6 — KEY DECISIONS MADE TODAY

### Brand colour

**Confirmed: Meadow Green `#3B5C2A`** (Option G from `brand-colour-proposal.md`)

This replaces the original `#1E4D3A` (forest green). The change was triggered by the owner identifying that `#1E4D3A` is very close to the Too Good To Go brand colour. The new colour is a distinctly different shade — warmer, more yellow-green, clearly differentiated from competitors.

**Current state of the code:** `sniffout-v2.html` still uses `#1E4D3A`. The brand colour update has not been implemented yet. CLAUDE.md still references `#1E4D3A`. The change needs to be made to:
- `--brand` CSS variable
- All `rgba(30,77,58,...)` chip tint values
- PWA manifest `theme_color`
- Any hardcoded colour references
This is a Round 23+ task, after the current in-progress issues are resolved.

### Dog profile

- **Multiple dogs from Phase 2** (not deferred to Phase 3) — the switcher is in the build
- **Breed field:** dropdown of 62 common UK breeds + "Other" free text option (from `uk-dog-breeds.md`)
- **Birthday:** stores day, month, and year (not just month/year as originally specced)

### Walk notes

- **Inline persistent textarea** (not a sequential modal prompt after logging)
- **No character limit** (this is a private journal, arbitrary limits would be frustrating)

### Walk wishlist

- **Available everywhere in Phase 2** (bookmark icon on walk cards and detail overlay)
- Semantically distinct from favourites: wishlist = "want to do this walk", favourites = "done it and loved it"
- When a wishlisted walk is explored: gentle prompt to move to favourites, not automatic

### Walk Wrapped summary

- **Twice yearly: July and December/January** (not just annually)
- Gives frequent walkers a mid-year summary and an end-of-year summary

### Badges

- **Hidden until earned** — no locked states, no silhouette, no progress indicators visible to user
- **10 badges total**, 7 contribution/community-based
- **Earned moment framing** — all copy celebrates what the badge means, not the mechanical trigger
- **Toast reveal** is just the badge name (one line), no description in the toast itself
- **Inline detail on tap** — badge name + earned moment copy + date earned only. No stats, no counts.

### Me tab

- **Subpage architecture needed** — the Me tab needs a separate screen/subpage concept for "all walks", "all badges", journal view etc. Designer is working on `me-tab-subpages-spec.md` now. This will drive a future round.

### Firebase

- **Moved to top of Phase 3 priority** — the app now holds irreplaceable personal data (walk journal, notes, dog profile, photos). localStorage can be wiped. This is not a growth feature — it is data safety infrastructure.
- Full Phase 3 priority order: (1) Firebase, (2) Missing Dog alerts, (3) User-submitted walks, (4) Community ratings and reviews, (5) Push notifications

### Dark mode

- **"Auto" renamed to "Match device"**
- Uses `prefers-color-scheme` CSS media query (detects device dark/light setting) instead of sunrise/sunset flag

### Weather icons (confirmed today)

- **Today tab:** Lucide icons (white, filled), rendered inline by `luIcon()`
- **Weather tab:** Yr.no meteocon SVGs, 96px on hero, `margin-top: 14px` (from `weather-icon-consistency-spec.md`)
- The two tabs intentionally use different icon styles: Today tab is compact and summary, Weather tab is the dedicated weather view

### Walk photos

- **One photo per walk visit** (not per walk — so a walk visited in winter and summer can have separate photos)
- **Canvas compressed** to ~200KB before saving to localStorage
- **localStorage Phase 2, Firebase Storage Phase 3**
- **Copy surfaces the limitation:** "Photos are saved on this device only. Create an account to back them up and access them anywhere." This is the Phase 3 sign-up hook.
- **Phase 3 migration:** on first sign-in, all base64 photos decode and upload to Firebase Storage at `users/{uid}/walk_photos/{walkId}/{timestamp}.jpg`

### API key

- **Google Places API key must be secured via Cloudflare Worker proxy before any public URL is shared**
- This is a live billing risk — the key is currently visible in page source
- Developer is working on the Cloudflare Worker. Not yet deployed.

### Content pipeline

- All walks go through the full Researcher → Copywriter → Editor → Validator → Developer pipeline
- No shortcuts — the Validator must sign off before the Developer content update

---

## SECTION 7 — CURRENT CONTENT STATE

### Walk database count

| Stage | Count | Status |
|-------|-------|--------|
| Walks in `sniffout-v2.html` (before batch additions) | 65 | In app (built up from initial 26 original walks through earlier sessions) |
| Batch 01 | 20 | Validated and in app |
| Batch 02 | 20 | Validated, fixed (tehidy fixed, lickey-hills duplicate resolved), ready for Developer content update |
| Batch 03 | 20 | Researcher complete, Copywriter complete today, Editor in progress |
| **WALKS_DB target after all batches** | **85** | After Batch 02 and 03 Developer content update |

**Note:** As of session close, the Developer content update for Batch 02 and Batch 03 has not happened yet. The app currently has the original 65 walks. Batches 02 and 03 are waiting in the pipeline.

### Batch status detail

**Batch 01 (20 walks):**
- Researcher: complete
- Copywriter: complete (`descriptions-batch-01.md`)
- Editor: complete (`editor-review-batch-01.md`)
- Validator: complete (`validation-report-batch-01.md`)
- Developer content update: complete — walks are in the app

**Batch 02 (20 walks):**
- Researcher: complete
- Copywriter: complete (`descriptions-batch-02.md`)
- Editor: complete (`editor-review-batch-02.md`)
- Validator: complete (`validation-report-batch-02.md`) — tehidy issue fixed, lickey-hills duplicate resolved
- Developer content update: **NOT YET DONE** — waiting in queue

**Batch 03 (20 walks — Northern Ireland, Hampshire, Wiltshire, Somerset, Gloucestershire, Highland Scotland, Yorkshire coast, County Durham, Lincolnshire, Oxfordshire, Greater Manchester, Bristol, Essex, Isle of Wight, Dorset):**
- Researcher: complete (`walks-batch-03-data.md`) — includes 4 Northern Ireland walks as required
- Copywriter: **complete today** (`descriptions-batch-03.md`)
- Editor: **IN PROGRESS** — reviewing `descriptions-batch-03.md`
- Validator: waiting for Editor
- Developer content update: waiting for Validator sign-off

### Copywriter personas

Five personas are defined in `copywriter-personas.md`. Rules carry forward across all batches:

| Persona | Username | Age/Location | Dog | Retired phrases |
|---------|----------|--------------|-----|-----------------|
| Deborah Hartley | DeborahH | 54, Harrogate | Golden retrievers Biscuit & Marmalade | "which is always a bonus" (retired), "Ideal for" closers (banned) |
| Jamie Okafor | jamieok | 28, Hackney | Rescue lurcher Ghost | None specific to retire |
| Morag Sutherland | morag83 | 41, Inverness | Working cocker Midge | Must mention pub or cafe in EVERY description |
| Pete Rushworth | PeteR63 | 63, Sheffield | Border terrier Scratchy | Imperfections must match documented set only (dropped apostrophes, passive voice, run-ons when excited) |
| Priya Mistry | Priya&Pretzel | 34, Birmingham | Mini dachshund Pretzel | "We loved/love this one" (retired) |

**Universal rules (apply to all personas):**
- No walk name in sentence 1 (most common error — check every entry before submitting)
- No em dashes or en dashes — hyphens only ( - not — or –)
- Length: 2-4 sentences, no more
- Do not start every description with "I" — vary openings
- No formulaic closers — vary endings naturally

---

## SECTION 8 — WHAT IS IN PROGRESS RIGHT NOW

As of session close on 18 March 2026:

### 1. Developer — Round 22 (in progress)

Two fixes in progress:

**FIX 22.1 — Birthday banner investigation:** The birthday banner on the Today tab is not appearing correctly. Developer is investigating the root cause. The birthday is stored as `{ day, month, year }` in `sniffout_dog.birthday`. The banner should appear on the matching day and month each year.

**FIX 22.2 — Today tab icon revert to Lucide:** The Today tab weather icon is being reverted from Yr.no SVG back to Lucide icons (white, from `luIcon()` function). This is a design decision: Today tab uses Lucide white icons, Weather tab uses Yr.no meteocons. Do not merge until this is complete.

**Next action:** Check if Developer has finished Round 22. Test FIX 22.1 (birthday banner) and FIX 22.2 (Today tab Lucide icons) on device before pushing.

### 2. Editor — Batch 03 descriptions (in progress)

The Editor is reviewing `descriptions-batch-03.md`. When complete, will produce `editor-review-batch-03.md`.

**Next action:** Check Editor output. Review changes. If approved, send to Validator.

### 3. Validator — waiting for Editor

The Validator cannot start until Editor finishes Batch 03.

**Next action:** After Editor review is approved, send Batch 03 data + descriptions to Validator. Validator produces `validation-report-batch-03.md`.

### 4. Developer content update — Batch 02 and 03

The Developer needs to add all 40 walks from Batches 02 and 03 to `WALKS_DB` in `sniffout-v2.html`. This cannot happen until Batch 03 Validator sign-off.

**Next action:** Once Validator signs off on Batch 03, issue a combined content update brief to Developer for both batches (Batch 02 is already validated and waiting).

### 5. Developer — Cloudflare Worker proxy for Google Places API key

The API key is hardcoded in `sniffout-v2.html`. A Cloudflare Worker proxy needs to be deployed that accepts requests from `sniffout.app`, forwards to Google Places with the API key server-side, and returns results. The key must be removed from the HTML.

**Status:** Planned, not yet started.
**Priority:** Must complete before any public URL is shared.

### 6. Designer — Me tab subpages spec

The Designer is working on `me-tab-subpages-spec.md` — the architecture for Me tab subpages (walk journal view, all badges view, all walks view, etc.). The Me tab currently shows all content on one scrolling page; as content accumulates the tab needs a navigation/subpage pattern.

**Status:** In progress.
**Next action:** Review spec when complete, then implement in a future round.

---

## SECTION 9 — WHAT COMES NEXT

### Immediate next session

In this order:

1. **Verify Round 22** — check Developer FIX 22.1 (birthday banner) and FIX 22.2 (Today tab Lucide icons) are working. Test on device before pushing.
2. **Review Editor Batch 03** — check `editor-review-batch-03.md`. Approve or flag issues.
3. **Send Batch 03 to Validator** — after Editor sign-off, issue Validator prompt.
4. **Review Validator Batch 03** — check `validation-report-batch-03.md`. Approve or flag issues.
5. **Developer content update (Batches 02 + 03)** — once Validator signs off on Batch 03, issue a combined brief to add all 40 walks to `WALKS_DB`. Walk count reaches 85.
6. **Review Designer me-tab-subpages-spec.md** — when complete, review and approve before implementing.
7. **Brand colour update round** — update `--brand` from `#1E4D3A` to `#3B5C2A` (Meadow Green) throughout `sniffout-v2.html`, manifest, and any hardcoded values.

### Soon (Phase 2 remaining)

- **Me tab subpages implementation** — after Designer spec is approved
- **Cloudflare Worker API key proxy** — must happen before public launch
- **Walk Wrapped summary** — twice yearly (July and December/January). Data foundation exists (walk log with timestamps). Needs Designer spec then Developer implementation.
- **Pollen data on Weather tab** — Open-Meteo European AQI endpoint, `european_aqi` parameter. Phase 3 addition per CLAUDE.md.
- **Moon phase on Weather tab** — deferred from Round 14, now Phase 2 target.
- **Walk submission form** — Phase 2b feature. User submits a walk; goes through curation before appearing in WALKS_DB.
- **Weather tab tappable tiles** — weather metric tiles tappable to expand detail. Designer spec needed.
- **Copy review session** — all UI copy across all tabs to be reviewed against brand voice.
- **Dog-friendly restaurants in Nearby tab** — Researcher findings ready in `dog-friendly-venues-research.md`. Brief needs to be issued to Developer.
- **Brand guidelines document** — Meadow Green `#3B5C2A` is confirmed but full brand guidelines (colour palette, typography rules, logo usage) not yet produced. Designer brief needed.

### Phase 3 (priority order — updated today)

1. **Firebase First** — authentication (Google, Apple, email/password), Firestore, Firebase Storage, migration from localStorage. Region: `europe-west2` (London). GDPR compliance confirmed by solicitor is a hard prerequisite before shipping to real users.
2. **Missing Dog alerts** — Firestore-backed, map layer in Nearby tab + Today tab surface. Account required to submit.
3. **User-submitted walks** — reviewed-before-publish, same schema as WALKS_DB, "Community" badge distinguishes from "Sniffout Pick"
4. **Community ratings and reviews** — minimum 3 reviews before showing stars, Bayesian weighting formula, recency decay
5. **Push notifications** — Firebase Cloud Messaging. Events: missing dog near you, weather change on favourited walk, new walk in area.

### Pre-launch hard blockers (must resolve before real users)

From `pre-launch-checklist.md`:

1. **T1** — Google Places API key hardcoded in HTML. Must be moved to Cloudflare Worker proxy. Live billing risk.
2. **L1** — No GDPR sign-off from solicitor. Owner is seeking a solicitor. Hard legal blocker.
3. **L2 / L3** — No privacy policy or Terms of Service. Depends on L1.
4. **L4** — NDA not reviewed. No beta access until solicitor clears it. (`sniffout-nda.docx` exists, needs review.)
5. **T14** — `index.html` currently redirects to old production file `dog-walk-dashboard.html`. Must update to `sniffout-v2.html` before v2 goes live.

**Owner action required:**
- Engage solicitor (L10 — in progress, highest priority)
- Register `sniffout.co.uk` and set up redirect to `sniffout.app` (B2)
- Set up support email `hello@sniffout.app` (B6 — required for GDPR data requests)

---

## SECTION 10 — IMPORTANT FILES

All files are in `~/Desktop/my-first-repo/`.

### Core app

| File | Purpose |
|------|---------|
| `sniffout-v2.html` | **The app.** Everything: inline CSS, inline JS, all HTML. This is the only file to edit for app changes. |
| `dog-walk-dashboard.html` | Live production v1. **DO NOT TOUCH.** Protected per CLAUDE.md. |
| `sw.js` | Service worker — network-first, cache fallback. Only modify when explicitly instructed. |
| `manifest.json` | PWA manifest. Only modify when explicitly instructed. |
| `CNAME` | Custom domain `sniffout.app`. |
| `index.html` | Currently redirects to v1. Must be updated to redirect to `sniffout-v2.html` before launch. |

### Agent briefing and instructions

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Auto-loaded by Claude Code agents. Contains all project rules, tech stack, CSS tokens, architecture. Always read first. |

### Product strategy and decisions

| File | Purpose |
|------|---------|
| `po-action-plan-round12.md` | PO decisions from Round 12. Defines gamification direction, no-streaks ruling, phase roadmap. |
| `product-vision-update.md` | Strategic vision document. The strategic reframe (discovery → personal record). Five features assessed across phases. 16 owner decisions. Phase 2 build order. Me tab stats update. Firebase-first priority. Full decision register. Critical reading. |
| `community-gamification-roadmap.md` | Phase 2/3/4 roadmap. Community features, gamification approach, SEO strategy, social media strategy. Firebase priority order updated today. |
| `pre-launch-checklist.md` | 47-item checklist across Technical, Legal, Content, Design, Business, Soft Launch sections. 5 hard blockers identified. |

### Design specs (awaiting or in-progress implementation)

| File | Purpose |
|------|---------|
| `me-tab-rethink-v2-spec.md` | Complete Me tab redesign. Miles hero, earned badges only, walk log. Current spec (implemented in Round 15+). |
| `me-tab-subpages-spec.md` | Me tab subpage architecture. Designer working on this now. Not yet complete. |
| `dog-profile-spec.md` | Complete dog profile spec. Onboarding, fields, avatar, copy transformations, multiple dogs, edit sheet. Implemented in Round 19. |
| `badge-system-rethink.md` | 10 badge definitions with triggers, earned moment copy, anti-gaming rationale, reveal mechanics, tap detail spec. Updated today. |
| `weather-tab-redesign-spec.md` | Weather tab redesign spec. Verdict-first layout, walk window, metric tiles, hourly forecast, bottom sheets. |
| `weather-icon-consistency-spec.md` | Icon size and alignment spec for Today tab (72px, 6px margin-top) and Weather tab (80px, 14px margin-top). |
| `disclaimer-design-spec.md` | Walk disclaimer copy and design. Passive footnote strip at bottom of overlay. Implemented in Round 13. |
| `brand-colour-proposal.md` | 8 colour options A-H with mockup HTML files. Option G (Meadow Green `#3B5C2A`) confirmed today. |

### Content pipeline files

| File | Purpose |
|------|---------|
| `copywriter-personas.md` | Five persona definitions. Must be read before any Copywriter or Editor work. |
| `uk-dog-breeds.md` | 62 common UK dog breeds list for the breed dropdown in the dog profile. |
| `walks-audit.md` | Early audit of original 26 walks in WALKS_DB. Regional coverage gaps identified. Now superseded by Batch additions (85 walks target). |
| `walks-batch-01-data.md` | Researcher verified data for Batch 01 (20 walks). |
| `walks-batch-02-data.md` | Researcher verified data for Batch 02 (20 walks). |
| `walks-batch-03-data.md` | Researcher verified data for Batch 03 (20 walks). Northern Ireland focus + regional gaps. Completed today. |
| `descriptions-existing-walks.md` | Descriptions for the original 26 walks. |
| `descriptions-batch-01.md` | Copywriter descriptions for Batch 01. |
| `descriptions-batch-02.md` | Copywriter descriptions for Batch 02. |
| `descriptions-batch-03.md` | Copywriter descriptions for Batch 03. **Completed today.** Awaiting Editor review. |
| `editor-review-batch-01.md` | Editor-reviewed Batch 01 descriptions. |
| `editor-review-batch-02.md` | Editor-reviewed Batch 02 descriptions. |
| `editor-review-batch-03.md` | Editor-reviewed Batch 03 descriptions. **IN PROGRESS.** |
| `validation-report-batch-01.md` | Validator sign-off Batch 01. |
| `validation-report-batch-02.md` | Validator sign-off Batch 02 (tehidy fixed, lickey-hills duplicate resolved). |
| `validation-report-batch-03.md` | Validator sign-off Batch 03. **NOT YET STARTED.** |

### Developer briefs (for reference)

| File | Purpose |
|------|---------|
| `developer-brief-round13.md` | Round 13 brief (called "Round 13" in file but was the brief for the work described as "Round 13" above — Round numbering shifted during the session). |
| `developer-brief-round14.md` | Round 14 brief. |
| `developer-brief-round15.md` | Round 15 brief. |

### Previous session notes

| File | Purpose |
|------|---------|
| `session-handoff-march-17.md` | Previous session handoff. Read if context from before today is needed. |

### Research

| File | Purpose |
|------|---------|
| `me-tab-dashboard-research.md` | Research on personal stats design across Strava, AllTrails, Komoot, Apple Health, Nike Run Club, Fitbit, dog-specific apps. |
| `dog-friendly-venues-research.md` | Research on dog-friendly venue categories for the Nearby tab. Developer brief not yet issued. |

---

## SECTION 11 — OWNER PREFERENCES AND WORKING STYLE

These are not negotiable — carry them forward into every future session.

**Communication:**
- Plain English always. No jargon without explanation.
- The owner was new to terminal and git when this project started. Always explain what commands do before giving them.
- Never assume knowledge of web development, git internals, or terminal syntax.
- If something might be confusing, explain it proactively.

**Devices and testing:**
- Owner tests on an **Android phone** (Chrome browser).
- iOS testing has not been done by the owner — iOS-specific issues may be undetected.
- Owner tests the real device before every major push.

**The dog:**
- The owner has a dog named **Luna**. Luna is the inspiration for the dog profile feature.
- When discussing dog profile features, this is personal — not just a product decision.

**Batching:**
- Owner prefers **batched Developer rounds** over many small fixes. Each round should be substantial. Fixes are grouped into rounds, not pushed one at a time.
- Exception: critical bugs (broken functionality) can be a quick solo fix.
- Always test on device before pushing a major round.

**No time estimates in developer briefs:**
- Agents work in minutes, not hours. The "estimated effort" fields in briefs are guidance for the owner about round size, not commitments.

**Owner decides, Claude recommends:**
- Claude makes recommendations. The owner makes all final decisions.
- Do not proceed with significant changes without explicit owner direction.
- Quality over speed — always review before pushing.

**Timeline:**
- Building toward a **soft launch in weeks, not days**.
- Firebase and GDPR compliance must be sorted before real users.
- The dog profile and walk journal are the most strategically important features — they are what makes Sniffout irreplaceable.

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

# Enable mouse support (if not already set)
tmux set -g mouse on

# Check existing sessions
tmux ls
```

### Claude Code path

```
/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.74/claude
```

To add to PATH permanently (run once, then restart terminal):
```bash
echo 'export PATH="/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.74:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

To launch Claude Code in a tmux pane (from the repo directory):
```bash
cd ~/Desktop/my-first-repo
claude
```

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

A fifth pane (or a separate terminal window) is used for git commands and terminal operations. Git commands are always provided by Claude in chat — the owner pastes them.

### Starting an agent in a pane

Navigate to the pane, then:
```bash
cd ~/Desktop/my-first-repo && claude
```

Each agent is a separate Claude Code session. Paste the full prompt (drafted by Claude in chat) to start the agent's task.

### Git push commands (standard format used throughout project)

```bash
cd ~/Desktop/my-first-repo
git add .
git commit -m "sniffout-v2 Round NN - brief description of changes"
git push
```

Confirm the push worked by checking: `https://sniffout.app/sniffout-v2.html` — allow ~1 minute for GitHub Pages to redeploy.

---

## QUICK REFERENCE — CRITICAL THINGS TO NOT FORGET

1. **Never touch `dog-walk-dashboard.html`** — live production file, protected
2. **API key is hardcoded** — do not share app URL publicly until Cloudflare Worker proxy is deployed
3. **Round 22 is in progress** — check Developer status before issuing new work
4. **Batch 03 content pipeline is in progress** — Editor → Validator → Developer content update
5. **Brand colour is `#3B5C2A` (Meadow Green)** — confirmed today, not yet implemented in code (still `#1E4D3A`)
6. **Firebase first in Phase 3** — personal data (journal, notes, photos) cannot safely live in localStorage long-term
7. **GDPR is a hard blocker** — owner must engage solicitor before any public launch
8. **Multiple dogs is Phase 2** — already in the build. Not deferred.
9. **Walk photos are device-only** — must surface "device-only" warning in journal UI (per community-gamification-roadmap.md)
10. **Today tab = Lucide icons, Weather tab = Yr.no icons** — distinct icon sets per tab, confirmed design decision
