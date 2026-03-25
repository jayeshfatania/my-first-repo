# Sniffout — Session Handoff Note
**Date:** 24 March 2026
**Prepared by:** Product Owner agent
**Purpose:** Complete context handoff for the next Claude chat session. A new session reading this document should be able to pick up immediately with zero loss of context.
**Replaces:** session-handoff-march-24-morning.md (moved to `docs/handoffs/archive/`)

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
- No UK competitor combines: walk discovery + live weather + dog-specific hazard context in a single no-login product.
- Closest UK structural analogue: **Walk Highlands** (Scotland-focused, desktop-era, no app). Sniffout is a mobile-first PWA improvement on that model.
- **AllTrails** and **Komoot** are not direct competitors in the dog owner segment — they have never addressed the dog-specific angle meaningfully.
- Full competitive analysis at `docs/research/competitive-analysis-march-23.md`. Five monetisation decisions (M1-M5) reviewed by owner — all five deferred to closer to launch.

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
| Typography | Inter (Google Fonts CDN) for all UI copy, labels, buttons, data displays. Fraunces (Google Fonts CDN, variable font) loaded as `var(--font-display)` for display/hero elements only — see Section 6 for full application list. |
| Service worker | `sw.js` — network-first, cache fallback, cache key `sniffout-v2` |
| PWA manifest | `manifest.json` — `start_url` set to `/sniffout-v2.html`, `theme_color` `#2C4A14` |
| Brand colour | `#2C4A14` (Woodland Green) — fully implemented throughout. CLAUDE.md corrected 24 March 2026. |
| Firebase | Compat SDK v10.12.0 (CDN) — project `sniffout-fe976`, region `europe-west2`. Anonymous auth + Firestore dual-write + Storage. Foundation only — full migration is Phase 3. |
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

### Google Cloud billing — resolved 23 March 2026

Owner upgraded to pay-as-you-go billing. A £15 budget alert has been set. No further action required. The $200 free monthly tier covers current usage.

### Firebase status (as of 23 March 2026)

Anonymous auth and Firestore dual-write are working correctly after the API key was corrected. Two remaining console items are confirmed non-issues:

- **`enableMultiTabIndexedDbPersistence` deprecation warning** — address during Phase 3 Firebase migration. Does not affect current functionality.
- **PWA install banner warning** — intentional behaviour. Not a bug.

### Placeholder image naming convention

All placeholder images live in the repo root and are served via raw GitHub URLs:
`https://raw.githubusercontent.com/jayeshfatania/my-first-repo/main/filename`

| File | Used for |
|------|---------|
| `placeholder-walk.jpg` | Curated walks, green spaces, and all other types without a specific placeholder |
| `placeholder-pub.png` | Pub venues on the Nearby tab |
| `placeholder-cafe.png` | Cafe venues on the Nearby tab |
| `placeholder-vet.png` | Vet venues on the Nearby tab |

All four files are in the repo root. Always use raw.githubusercontent.com URLs when referencing them in code.

### CSS tokens (light mode)

| Token | Value | Notes |
|-------|-------|-------|
| `--brand` | `#2C4A14` | Woodland Green — brand colour |
| `--brand-mid` | `#3D6520` | Mid brand green — for gradients and accents |
| `--brand-tint` | `#EDF2E8` | Light brand tint — backgrounds, selected states |
| `--font-display` | `'Fraunces', serif` | Display typeface — hero and display elements only |
| `--bg` | `#F7F5F0` | Warm off-white page background |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--border` | `rgba(0,0,0,0.08)` | Card borders |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-2` | `#6B6B6B` | Secondary text |
| `--amber` | `#B07A28` | Warnings (updated from #D97706) |
| `--red` | `#EF4444` | Danger/errors |

Dark mode — Scheme B (Dark Slate), applied via `body.night` class. Token overrides:

| Token | Dark value | Notes |
|-------|-----------|-------|
| `--bg` | `#141414` | Near-black page background |
| `--surface` | `#1F1F1F` | Dark card surfaces |
| `--border` | `rgba(255,255,255,0.08)` | Subtle light border |
| `--ink` | `#F4F2EE` | Off-white primary text |
| `--ink-2` | `#8A8A8A` | Muted secondary text |
| `--brand` | `#6A9B4A` | Brand colour for text/icons in dark mode |
| `--brand-tint` | `rgba(92,154,74,0.12)` | Dark mode brand tint |
| `--chip-off` | `#2A2A2A` | Off/inactive chip background |
| Weather hero bg | `#1A3522` | Weather tab hero card override only |
| Brand backgrounds (dark) | `#3D6B22` | Used for brand-coloured card backgrounds in dark mode — distinct from `--brand` which is for text/icons only |

Dark mode is toggled manually by the user via Settings. "Auto" option uses `prefers-color-scheme`. Default for new users is light mode. Spec in `docs/specs/dark-mode-schemes.md`.

### Walk card dimensions (locked)

| Property | Carousel card | List card |
|----------|--------------|-----------|
| Image height | 140px | 180px |
| Total card height | 186px | 226px |
| Walk name position | Overlaid on image — Fraunces 700 26px white, bottom 14px left 16px | Same |
| Walk name below image | Not shown — name appears on image only | Not shown |
| Away distance | Not shown on card | Not shown on card |

"Away" distance appears in the walk detail overlay only, not on any card. Do not reintroduce it to cards.

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
- **Agent prompts must be formatted as code blocks** — so the owner can copy and paste them easily. Never use prose formatting for agent prompts.
- **Designer produces recommendations only — never edits code.** The Designer spec files go to the Developer for implementation. If the Designer pane accidentally runs developer work (edits `sniffout-v2.html`), discard the changes immediately with `git checkout sniffout-v2.html` and re-brief the Developer correctly.
- **Designer must be briefed without screenshots** — use code-only review with references and line numbers. Designer context fills up quickly with screenshots. Never brief the Designer with screenshots — always use code references.
- **For code checks, use terminal grep** — do not rely on an uploaded sniffout-v2.html file. Uploaded files go stale as rounds are pushed and are unreliable for current state checks. Use terminal grep commands instead.
- **Screenshots hit context limits fast** — describe issues in plain text where possible. Only request a screenshot when visual inspection is genuinely necessary and cannot be determined from code.
- **PO agent writes documents only** — the PO must never run terminal commands or edit files directly. If file operations are needed, use Cowork. If a PO agent attempts to run terminal commands when asked to write a brief, discard the output and re-brief the PO correctly.
- **When badge icons or similar asset implementations fail silently**, check for duplicate function names and mismatched render paths before assuming an ID mismatch. This was the root cause of the badge icon issue in Round 26/27 — a duplicate `renderMeBadges` function silently taking precedence.
- **Free-form walk logging is live.** The walk journal now accepts both curated (`type: "curated"`) and user-created entries (`type: "custom"`). All functions that work with the walk log must handle both types correctly.
- **Wishlist = "On my sniff list", Favourites = "Sniffed and approved".** These are confirmed brand names. Any Developer brief or copy touching these features must use these exact labels.
- **UX review march-22 was completed** — saved to `docs/ux-reviews/ux-review-march-22.md`. Rounds A and B fixes implemented. Four items deliberately deferred — see Section 6 for full details. Do not attempt to implement deferred items without explicit owner direction.
- **`locationRestriction` must not be used** on the Nearby tab. It is incompatible with the `searchText` endpoint and causes empty results. Radius is enforced client-side. Do not reintroduce it.
- **`renderWeather()` must never manipulate `body.night`.** Dark mode is user-controlled via Settings. The `is_day` API value must not be used to set or remove the `body.night` class. This was a production bug — fixed 22 March. Do not reintroduce.
- **All inline script blocks are now merged into one.** This resolved all hoisting errors (`getSavedUnits`, `renderRecentlyViewedMe`, `formatDist` scope issues). If new JS is added, it must go inside the single script block, not as a new `<script>` tag.
- **Batch fixes where possible** — each Developer round should be substantial. Exception: critical bugs (broken functionality) can be a quick solo fix.
- **Fake ratings must not be shown.** Walk cards must not display star ratings or review counts until a minimum of 3 real reviews exist per walk.
- **No hardcoded emoji in verdict title strings.** Icons rendered as separate Lucide elements. Personalised shortTitle strings used when dog profile exists. Standard title fallback when no dog profile.

### The content pipeline

All new walk content moves through a fixed pipeline. Claude coordinates each handoff:

```
Researcher → Copywriter → Editor → Validator → Developer (content update)
```

- **Researcher** produces verified walk data (lat/lon, terrain, difficulty, off-lead status, etc.)
- **Copywriter** writes 2-4 sentence persona-based descriptions for each walk
- **Editor** reviews descriptions for persona voice, rule compliance, quality
- **Validator** cross-checks walk data fields for accuracy, consistency, and schema compliance
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

AGENT PROMPTS:
- Always format agent prompts as code blocks for easy copy-paste
- Never use prose formatting for agent prompts
- Always start with: "You are the [Role] for Sniffout, a UK dog walking PWA. Read CLAUDE.md before starting."
- Always specify which files to read before starting

COORDINATION STYLE:
- Draft ALL agent prompts before the owner pastes them - never ask the owner to write their own
- Review ALL agent outputs before recommending next steps
- Always flag decisions needed from the owner explicitly before moving on
- Run agents in parallel where tasks are independent
- Follow the content pipeline strictly:
  Researcher > Copywriter > Editor > Validator > Developer
- Provide git push commands for every Developer round - owner pastes them into terminal

CODE CHECKS:
- Use terminal grep commands, not uploaded sniffout-v2.html (goes stale)
- For code state checks, always use: grep -n "pattern" ~/Desktop/my-first-repo/sniffout-v2.html

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
- Brand colour is Woodland Green #2C4A14 (not #3B5C2A which is retired)
- Display typeface is Fraunces (var(--font-display)) for hero/display elements - Inter for all UI copy
- Today tab uses white Lucide icons for weather
- Weather tab uses Yr.no SVG icons for weather
- All localStorage keys use sniffout_ prefix
- Active dog profile key is sniffout_dogs (plural array) - sniffout_dog (singular) is deprecated and migrated
- No hardcoded API keys in HTML - Google Places routes through Cloudflare Worker at places-proxy.sniffout.app
- renderWeather() must never set or remove body.night - dark mode is user-controlled only
- All JS must go inside the single merged script block - no new separate script tags
- Breed/age hazard logic lives in detectHazards() and getPawSafety() only - do not scatter
- No fake ratings - walk cards must not show stars or review counts until 3 real reviews exist
- No hardcoded emoji in verdict title strings - Lucide icons only
- Walk card image heights: carousel 140px, list 180px. Walk name overlaid on image only - not repeated below
- Away distance is NOT shown on walk cards - detail overlay only
- Walk window hours are constrained to 6am-9pm minimum/maximum

SCREENSHOTS:
- Avoid screenshots unless visual inspection is genuinely necessary
- Describe issues in plain text from code where possible
- Designer must always be briefed with code references and line numbers - never screenshots
- Screenshots hit context limits fast at full phone resolution

AGENT ROLE BOUNDARIES:
- PO agent writes documents only - never runs terminal commands or edits files
- If PO attempts terminal work, discard output and re-brief correctly
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
- Currently at approximately Round 45+
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
- Active handoff: docs/handoffs/session-handoff-march-24.md (this document)

WALK PHOTOS:
- Hosted on GitHub as raw URLs
- Format: https://raw.githubusercontent.com/jayeshfatania/my-first-repo/main/filename.jpg
- Push image files to repo before referencing in WALKS_DB
- Placeholder naming convention: see Section 2 "Placeholder image naming convention"

CLOUDFLARE WORKER:
- Proxy at places-proxy.sniffout.app
- Worker code edited in Cloudflare dashboard
- Do not revert to direct Google URL ever
- Referer header set to https://sniffout.app in Worker code

APP URLS:
- Live app: sniffout.app/sniffout-v2.html
- index.html intentionally redirects to coming-soon.html - deliberate pre-launch behaviour, do not change
- sniffout.co.uk not yet redirecting - pre-launch task

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

*(Rounds 11-33 and all 20-21 March sessions are documented in the archived `docs/handoffs/archive/session-handoff-march-20.md`. 22 March session documented in archived `docs/handoffs/archive/session-handoff-march-22.md`. 23 March session documented in archived `docs/handoffs/archive/session-handoff-march-23.md`. Early 24 March session documented in archived `docs/handoffs/archive/session-handoff-march-24-morning.md`. Summary below covers only the most recent context needed for continuity.)*

### Key milestones prior to 24 March (summary)

- **Rounds 11-33** — full app build: walk discovery, weather, Nearby tab, dog profile, walk journal, free-form logging, badges, dark mode, units toggle, brand colour, Firebase foundation, State A redesign, hourly forecast, OS Maps toggle
- **20 March** — Firebase foundation live, dark mode Scheme B, PWA install prompt, silent auto-refresh, logo icons complete
- **21 March** — UX review march-21 conducted, Round 1 fixes, OS Maps integrated, Recently Viewed in Me tab, distance on walk cards, repo restructure into `docs/` subfolders
- **22 March** — Green spaces multi-query overhaul, JS script block merge (14 → 1), Firebase API key corrected, `renderWeather()` dark mode bug fixed, `btoa` crash fixed, units consistency fixes, UX review Rounds A and B, push notification research and owner decisions confirmed, breed and dog-specific hazard personalisation research and spec produced
- **23 March** — Breed/age hazard personalisation implemented, venue-specific placeholders added, dog profile UX fixes, competitive analysis completed, Firebase Phase 3 migration spec completed, phase 3 account linking copy and design spec completed, push notification Phase 3 spec completed, deferred UX items B2/M5/M7 resolved
- **Early 24 March** — Design elevation round (Fraunces, #2C4A14, hero card colour treatment, verdict overhaul, Me tab polish, haptics, wind safety fix, weather tab updates, interaction design principles), brand colour corrected in CLAUDE.md

### Completed — 24 March 2026 (full day)

**Designer brief A — march-24-spec.md (implemented by Developer):**

- **FAB redesign:** plus icon, 56px diameter, `bottom: 88px`, brand green, multi-layer shadow, fade on scroll. Spec at `docs/specs/designer-brief-march-24-spec.md`.
- **Me tab layout:** dog profile card on `--surface` with border, stat tiles in single shared card with internal dividers, Fraunces 700 28px stat numbers, 96px bottom padding.
- **Walks tab map:** custom circular DivIcon pins, compact 180px bottom card on pin tap with spring animation, zoom threshold at level 9, dark mode tile filter.
- **Nearby tab full screen map:** expand button in map, full screen overlay, category chips bar, `history.pushState` for Android back button.
- **Parallax hero on walk detail overlay:** 260px container, 340px image, 0.5 ratio, gradient overlay, walk name over image in Fraunces 700 26px.
- **Fake ratings removed** from all walk cards.

**Designer brief B — march-24b-spec.md (implemented by Developer):**

- **Today tab hero card unified:** single card with internal dividers, hazard detail text inline, "Full forecast" tap row at bottom navigates to Weather tab, info button removed entirely.
- **Weather tab:** full-width banner removed permanently. Hazard cards with coloured backgrounds (amber/red), Lucide icons, severity ordering, `buildHazardHTML()` shared helper.
- **Settings cog:** moved inside dog profile card as absolute-positioned icon button (top-right corner). No longer a standalone FAB or tab header button.
- **Walk card proportions:** carousel 140px image / 186px total card, list 180px image / 226px total card, away distance removed.
- Walk name overlaid on image (Fraunces 700 26px white, `bottom: 14px left: 16px`) — does not repeat in content area below image.

**Bug fixes completed (multiple rounds):**

- Walk window constrained to 6am-9pm (minimum/maximum enforced).
- Pollen indicator dark mode colours fixed.
- Walk card persistent in map view fixed — card hidden by default (`display: none`), shown only on pin tap.
- Reports stat number corrected to Fraunces 700 28px (was Inter).
- State A social proof strip centred.
- State A scroll fixed.
- Keyboard dismiss on sheet swipe-down fixed — `blur()` on `activeElement` added to all 4 close functions.
- Nearby map dark mode tile filter fixed (`brightness(0.75) contrast(1.05)`).
- Weather tab duplicate banner removed — `wx-verdict` div inside `wx-hero` was generating a second amber pill.
- Walks tab header controls aligned to right edge.
- Nearby duplicate List/Map text toggle removed.
- Nearby category chips working in map view.

**Documentation completed 24 March:**

- `docs/specs/brand-guidelines-march-24.md` — consolidated brand, design, and copy reference document. Ready for use by new collaborators.
- `docs/specs/designer-brief-march-24-spec.md` — Designer spec A (FAB, Me tab, Walks map, Nearby full screen map, parallax).
- `docs/specs/designer-brief-march-24b-spec.md` — Designer spec B (Today hero card, Weather tab, Settings cog, walk card proportions).

---

## SECTION 6 — KEY DECISIONS ON RECORD

These decisions are locked and should not be revisited without a clear reason.

### Brand colour — #2C4A14 (Woodland Green)

`#2C4A14` (Woodland Green) replaces `#3B5C2A` (Meadow Green). Deeper, warmer, more authoritative. Differentiated from Too Good To Go (#2B4C3F). Fully implemented throughout the app, CLAUDE.md, and manifest.json. CLAUDE.md corrected 24 March 2026. No references to `#3B5C2A` or `#1E4D3A` should remain anywhere.

### Display typeface — Fraunces

Fraunces has been added as the display typeface alongside Inter. Loaded via Google Fonts CDN as a variable font. Defined as `var(--font-display)`.

**Fraunces applies to:** State A headline, Today tab verdict string, walk detail overlay walk name, Me tab primary stat numbers, Me tab section headers, Me tab dog name (`.me-dog-card-name` and `.me-dog-name`).

**Inter applies to:** all UI copy, labels, buttons, chips, data displays, navigation — everything not listed above.

Do not apply Fraunces to UI elements. Do not apply Inter to display/hero elements.

### Walk card content — locked

Walk cards show the image, with the walk name overlaid on the image only (Fraunces 700 26px white, `bottom: 14px`, `left: 16px`). The name does not repeat as a heading below the image. Content below the image shows walk length, difficulty pill, and off-lead pill only. Away distance is not shown on any card — it lives in the walk detail overlay only. Do not reintroduce a duplicate name heading or away distance to cards.

### Walk card image heights — locked

Carousel cards: 140px image, 186px total. List cards: 180px image, 226px total. Do not change these dimensions without a Designer brief.

### Today tab hero card — unified single card

Today tab hero card is a single unified card with internal dividers. Hazard detail text is inline within the card. A "Full forecast" tap row at the bottom navigates to the Weather tab. The info button has been removed entirely. This is a locked design decision.

### Weather tab — hazard cards only, no banner

The full-width banner on the Weather tab has been permanently removed. Hazard display uses individual full-width cards with coloured backgrounds (amber for caution, red for danger), Lucide icons, and severity ordering (most severe first, 8px gaps). `buildHazardHTML()` is the shared helper used by both Today tab and Weather tab. Do not reintroduce the banner.

### Settings cog — inside dog profile card

The settings cog icon lives inside the dog profile card on the Me tab, positioned absolute top-right. It is not a standalone FAB. It is not in the tab header. Do not move it.

### FAB (floating action button) on Me tab — implemented

Plus icon, 56px diameter, `bottom: 88px`, brand green, multi-layer shadow, fade-on-scroll behaviour. Opens the walk logging sheet. Spec at `docs/specs/designer-brief-march-24-spec.md`. Implementation complete. Further refinement is deferred to the next Designer brief (State A full composition review session).

### Nearby tab map must replicate Walks tab map

The Nearby tab map must use the same implementation pattern as the Walks tab map: same list/map icon toggle in the header, tapping the map icon shows the full screen map, same in-map filter pill at bottom-centre, same zoom controls at bottom-right. The expand-button pattern used in the 24 March brief is not the correct pattern — use the Walks tab toggle approach. This is a carry-over task for the next Developer session.

### Map filter pill position

The "Picks / Green spaces" filter pill on the Walks tab map sits at bottom-centre of the map, floating above the bottom nav. Not at the top. Do not move it to the top of the map.

### Monetisation decisions M1-M5 — deferred

Owner has reviewed the competitive analysis. All five monetisation decisions (M1-M5) are deferred to closer to launch. They are not build blockers. PO to resurface when the owner is ready.

### Walk window hours — constrained to 6am-9pm

The best walk window display is constrained to a minimum of 6am and a maximum of 9pm. Late-night edge case (e.g. suggesting 6am-9am at 23:30 without labelling it as tomorrow) is a known carry-over bug — see Section 8.

### Verdict strings — emoji removed, Lucide icons only

Verdict title strings in `getWalkVerdict()` must never contain hardcoded emoji. Icons are rendered as separate Lucide elements alongside the verdict title. Personalised shortTitle strings are used when a dog profile exists. Standard title strings are used as fallback when no dog profile is set. This is documented in CLAUDE.md and applies permanently.

### Approved verdict strings

Full set of 10 verdict states with shortTitle variants is documented in `getWalkVerdict()` in `sniffout-v2.html`. Key strings:

- With dog name: "Perfect conditions for [name]."
- Without dog name: "Perfect conditions right now."

Do not change these without PO sign-off.

### Verdict/hazard contradiction — resolved

If any active hazard contradicts an approved verdict, the verdict downgrades to caution minimum. Gust threshold is aligned between `getWalkVerdict()` and `detectHazards()`. Do not introduce separate thresholds for the same condition across these two functions.

### Wind/gust safety — woodland routes excluded

Woodland routes must never be recommended in high wind or gust conditions. Woodland is explicitly dangerous in high wind due to falling branch risk. Correct wind recommendations: valley paths, urban streets, low-lying ground. Do not reintroduce woodland as a wind recommendation.

### Interaction design principles — locked

These apply to every new interactive element added to the app without exception:

- **Tap feedback:** `transition: transform 0.15s ease` and `transform: scale(0.97)` on `:active` for all tappable elements — cards, tiles, rows, chips, pills, buttons, and any other tappable surface.
- **Bottom sheets:** spring cubic-bezier open animation: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Verdict strings:** no hardcoded emoji in title strings.

Documented in CLAUDE.md. No exceptions.

### Haptic feedback

`navigator.vibrate(10)` on all heart/bookmark saves throughout the app. `navigator.vibrate([50,30,80])` on badge earn. Graceful no-op on iOS (not supported). Apply to any new save/earn interactions added in future rounds.

### Me tab stat colours — all three use brand colour

All three Me tab stat numbers (km walked, walks logged, condition reports) use `var(--brand)` in light mode and `#6A9B4A` in dark mode. Consistent colour throughout. Documented in CLAUDE.md.

### Me tab dog name — .me-dog-card-name at 48px Fraunces 700

`.me-dog-card-name` is the active class (`.me-dog-name` also set for compatibility). Both at 48px Fraunces 700. Dog name is always the largest text on the Me tab. Do not reduce this size.

### Fake ratings — removed and prohibited

Walk cards must not show star ratings or review counts until a minimum of 3 real reviews exist per walk. No fake social proof anywhere in the app. Removed 24 March 2026.

### No-account framing — updated

"No account required" is not a selling point and must not be used. Account creation is framed as data protection. Correct framing: "your data, safe across any device" or "Keep your walks safe across any device." Updated in CLAUDE.md and copy-review.md.

### User-submitted walks — long-term content model confirmed

Curated walks in WALKS_DB are seed content created via the persona pipeline. Community walks will outnumber curated walks over time. Moderation model: automated flagging (Google Cloud Vision API, Natural Language API) plus owner final approval. Mandatory photo required for submission. Community walks use the same card design with a community badge. Full feature scope is a Researcher task — see Section 9.

### Weather fetch strategy

Always fetch fresh. App renders instantly with cached data, re-renders when live data arrives. Never serve stale weather.

### `renderWeather()` must never touch dark mode

`renderWeather()` previously set/removed `body.night` based on `is_day` from the weather API. This was a production bug — it silently overrode the user's Settings preference on every weather fetch. Fixed 22 March. **Do not reintroduce any `body.night` manipulation inside `renderWeather()` or any weather-related function.**

### All inline JS in one script block

All 14 separate `<script>` blocks in `sniffout-v2.html` have been merged into one. This permanently resolves hoisting errors. **All future JS additions must go inside the single script block, not as a new `<script>` tag.**

### Firebase API key — correct key is `sniffout-fe976` browser key

The Firebase API key was wrong (pointed to Walk Planner project). Corrected 22 March. The correct key is the browser API key for project `sniffout-fe976`. Anonymous auth and Firestore dual-write are now working.

### Dog profile localStorage key — `sniffout_dogs` (plural array)

The active dog profile key is `sniffout_dogs` (plural, stores an array of dog objects, multiple dogs supported). The old `sniffout_dog` key (singular) was an earlier version that has been migrated. Do not reference `sniffout_dog` in any new code.

### Breed and dog-specific hazard personalisation — implemented

Brachycephalic and double-coat flags stored in `tags[]` array. Age derived from `birthday` field. Multi-characteristic resolution uses most-conservative threshold. Seasonal hazards are date-only calculations. All logic in `detectHazards()` and `getPawSafety()` only. No Firebase dependency. No new localStorage keys. Spec at `docs/specs/breed-hazard-spec.md`.

### Shar Pei — owner's dog Luna

The owner has a dog named **Luna**, a Bear Coat Shar Pei. Luna has the double-coat toggle set to Yes. Shar Pei is borderline brachycephalic — the owner decides via the brachycephalic toggle on a per-dog basis.

### Venue-specific placeholder images

`placeholder-pub.png`, `placeholder-cafe.png`, `placeholder-vet.png` are in the repo root. Nearby tab venue cards use the venue-specific placeholder. Green spaces and walks use `placeholder-walk.jpg`. Do not revert to a single generic placeholder for all venue types.

### Pubs and restaurants in Nearby tab — permanently removed

FIX 23.2 is a permanent revert. Brief at `docs/briefs/developer-brief-restaurants.md`. Do not re-implement without a dedicated design round.

### Settings and dog profile — settings cog inside dog profile card

The settings cog icon lives inside the dog profile card on the Me tab (absolute-positioned, top-right). Tapping it opens Settings. The dog profile subpage is separate and opened from the dog card content. These are two distinct things and must not be merged.

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

`placeholder-walk.jpg` (hosted on GitHub) used for all walk cards and green spaces without a real photo. Do not reintroduce gradients as placeholders. Venue-specific placeholders exist for pub, cafe, and vet — see Section 2.

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

Walk Window is Card 1 (hours constrained to 6am-9pm min/max), Hour by hour is Card 2. Tappable temperature spec (`docs/specs/temperature-tap-spec.md`) is superseded — do not re-implement.

Designer spec: `docs/specs/hourly-forecast-spec.md`. Layout recommendation: `docs/specs/hourly-forecast-layout-rec.md`.

### T&C consent screen is a hard go-live blocker

Users must actively accept Terms of Service before using the app for the first time. This is L5 in the pre-launch blockers. Depends on L3 (ToS copy from solicitor). Developer work required once ToS exists.

### Report an issue — Phase 3

Deferred to Phase 3. Requires Firebase backend.

### Dark mode Scheme B — confirmed and implemented

Dark Slate palette is live. Tokens documented in CLAUDE.md and Section 2 above. Spec in `docs/specs/dark-mode-schemes.md`. Do not revert.

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

### Settings radius filter — removed

Both the Walks tab and the Nearby tab have inline radius pickers writing to the same `sniffout_radius` key. The Settings control was redundant and risked confusing users. Removed in Round 24, 23 March 2026. The `sniffout_radius` key itself is unchanged.

### Push notifications — owner decisions confirmed (Phase 3)

Full research report at `docs/research/push-notifications-research.md`. Formal spec at `docs/specs/push-notifications-phase3-spec.md`. Owner decisions confirmed:

- **Notification types at launch:** Hazard-only — Types 1-5: extreme heat, paw heat warning, storm, dangerous wind, freeze/ice. Morning walk reminder (Type 6) and rain incoming (Type 7) deferred to post-launch follow-up.
- **Infrastructure:** Firebase Cloud Functions. No third-party services (OneSignal etc.) — keeps all data within Firebase/europe-west2.
- **Home location:** Banner prompt on Today tab after postcode search ("Save as home location?") plus editable in Me tab settings. Stored in `sniffout_home_location` localStorage and Firestore user document.
- **Quiet hours:** 9pm-7am UK time (GMT/BST, DST-aware). No notifications outside this window regardless of trigger.
- **Full implementation:** Phase 3. Spec complete. Build can proceed once Firebase full migration is complete. GDPR sign-off (L1) and solicitor review of consent mechanism are go-live prerequisites only — not build prerequisites.

### Deferred UX review items — one remaining

Of the four originally deferred items from `docs/ux-reviews/ux-review-march-22.md`, three were resolved on 23 March 2026 (B2, M5, M7). One remains:

- **H10: OS Maps API key in page source** — still deferred to dedicated pre-launch security review, alongside Google Places proxy review.

### Pre-launch blockers — current status

T1 (API key) and T14 (manifest start_url) resolved on 19 March 2026. All remaining blockers are legal and solicitor-dependent.

---

## SECTION 7 — CURRENT CONTENT STATE

### Walk database count

| Stage | Count | Status |
|-------|-------|--------|
| Walks in `sniffout-v2.html` (WALKS_DB) | **100** | Live in app. Batches 01-03 all complete. No content changes this session. |
| Batch 01 | 20 | In app |
| Batch 02 | 20 | In app — added 20 March 2026 |
| Batch 03 | 20 | In app — added 20 March 2026 |

All batches complete. No content updates this session. Walk count is displayed dynamically via `WALKS_DB.length` — never hardcode a number.

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

**Batch 01:** Researcher / Copywriter / Editor / Validator / Developer — in app

**Batch 02 (20 walks):** Researcher / Copywriter / Editor / Validator / Developer — in app

**Batch 03 (20 walks — Northern Ireland, Hampshire, Wiltshire, Somerset, Gloucestershire, Highland Scotland, Yorkshire coast, County Durham, Lincolnshire, Oxfordshire, Greater Manchester, Bristol, Essex, Isle of Wight, Dorset):** Researcher / Copywriter / Editor / Validator / Developer — in app

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

## SECTION 8 — WHAT IS IN PROGRESS / CARRY-OVER TO NEXT SESSION

As of end of day 24 March 2026:

### 1. PRIORITY — Nearby tab map replication (Developer)

The Nearby tab map must replicate the Walks tab map implementation exactly:
- Same list/map icon toggle in the header (not an expand button)
- Tapping the map icon opens the full screen map
- Same in-map filter pill at bottom-centre (not top)
- Same zoom controls at bottom-right

The expand button pattern used in the 24 March brief is not correct — brief Developer to replace it with the Walks tab toggle approach. This is the first Developer task of the next session.

### 2. Walk name duplicate on browse cards (Developer)

The walk name still appears both overlaid on the image AND as a heading in the content area below the image. The content area heading must be removed. Small fix — bundle with the Nearby map brief.

### 3. Scroll-to-top pill inverted (Developer)

The IntersectionObserver fires on the wrong event direction. The scroll-to-top pill currently shows on scroll up, but should show on scroll down past the Picks section. Bundle with Nearby map brief.

### 4. Walk window late-night edge case (Developer)

At 23:30 the walk window suggests times like "6am-9am" without indicating this is tomorrow. The walk window must either label tomorrow's window clearly as "tomorrow" or handle this edge case differently. Bundle with Nearby map brief.

### 5. State A headline sizing — Designer review pending

Headline is currently `clamp(36px, 9vw, 48px)` as an interim fix. Designer must review the full State A composition and recommend the correct size. Do not apply further Developer patches until Designer has reviewed.

### 6. Designer brief pending items

- State A full composition review: headline size, balance, spacing
- Any further Me tab refinements post-FAB

### 7. Monetisation decisions M1-M5 — deferred

Owner has reviewed the competitive analysis at `docs/research/competitive-analysis-march-23.md`. All five decisions deferred to closer to launch. PO to resurface when owner is ready.

### 8. OS Maps Leisure tiles — support ticket not yet raised (owner action)

Premium Data Plan is active but Leisure tiles are still not rendering. A support ticket with OS Data Hub has not yet been raised.

### 9. Walk photos — 7 showcase carousel walks (owner action)

Walks: `isabella-plantation`, `stanage-edge`, `balmaha-loch-lomond`, `rhossili-gower`, `seven-sisters`, `formby-beach-pinewoods`, `alnmouth-northumberland`. Owner to source and push to repo.

### 10. Solicitor engagement — L1-L5 blocked (owner action)

Owner engages solicitor. Target: at least 4 weeks before any beta launch date.

### PENDING DEVELOPER CONFIRMATION (carry forward)

**Q3 — String 6g (password reset email not found):** Developer to confirm whether Firebase `sendPasswordResetEmail()` throws a distinct error for unregistered emails. String held pending this confirmation.

---

## SECTION 9 — WHAT COMES NEXT

### Immediate (in priority order)

1. **Nearby tab map replication** — Developer, first brief of next session. Replicate Walks tab map exactly: same header toggle, same full screen behaviour, same bottom-centre filter pill, same zoom controls. Do not use the expand button pattern.

2. **Walk name duplicate + scroll pill + walk window late night** — bundle all three with the Nearby map Developer brief for efficiency.

3. **State A Designer review** — Designer brief covering State A full composition: headline size, balance, spacing. Issue once Nearby/fixes are under way.

4. **Phase 3 Firebase migration Developer brief** — spec complete at `docs/specs/firebase-phase3-migration-spec.md`. Ready to brief.

5. **Researcher round — user-submitted walks** — full feature scope including moderation tool (Google Cloud Vision API, Natural Language API), plagiarism detection, owner approval queue, mandatory photo requirement, submission form best practice, community trust signals, legal considerations (Online Safety Act 2023).

6. **Competitive analysis monetisation decisions** — M1-M5 deferred to closer to launch. PO to resurface when owner is ready.

7. **OS Maps support ticket** — owner to raise with OS Data Hub. Leisure tiles still not activating.

8. **Walk photos** — 7 showcase carousel walks still need real photos. Owner to source.

9. **Solicitor engagement** — L1-L5 all blocked. Not a dev blocker.

### Soon (Phase 2 remaining)

- **Walk image sourcing** — 97 walks need photos. Owner to direct.
- **Copy review session** — all UI copy reviewed against brand voice.
- **Walk Wrapped summary** — twice yearly (July and December/January). Walk log foundation exists. Needs Designer spec.
- **MoSCoW prioritisation** — owner to complete when ready to triage the backlog.
- **Pre-launch checklist review** — PO to update `docs/po/pre-launch-checklist.md`. Several items resolved (T1, T14), new items emerged (OS Maps key, push notification consent).

### Phase 3 (priority order — confirmed)

1. **Firebase full migration** — foundation is live. Phase 3 completes: authenticated user accounts, server-side walk log reads, full localStorage → Firestore migration. Region `europe-west2`. GDPR sign-off (L1) is hard prerequisite. Spec at `docs/specs/firebase-phase3-migration-spec.md`.
2. **Push notifications** — Firebase Cloud Functions, hazard-only types at launch. Research complete. Formal spec complete at `docs/specs/push-notifications-phase3-spec.md`. Build can proceed once Firebase full migration is complete. GDPR sign-off and solicitor review are go-live prerequisites only.
3. **Report an issue** — Firestore-backed submission form.
4. **Missing Dog alerts** — Firestore-backed, map layer.
5. **User-submitted walks** — editorial review before publish, curated vs community badge.
6. **Community ratings** — Bayesian weighted, min 3 reviews before stars.
7. **Push notifications — follow-up types** — morning walk alert (Type 6), rain incoming (Type 7), after launch validation.

### Pre-launch hard blockers — status

| Blocker | Status | Notes |
|---------|--------|-------|
| T1 — API key exposed | Resolved 19 March 2026 | Cloudflare Worker proxy at `places-proxy.sniffout.app` |
| T14 — manifest start_url wrong | Resolved 19 March 2026 | Fixed to `/sniffout-v2.html` |
| L1 — GDPR sign-off | Blocked | Owner seeking solicitor |
| L2/L3 — Privacy policy / ToS | Blocked | Depends on L1 |
| L4 — NDA review | Blocked | `sniffout-nda.docx` ready for review |
| L5 — T&C consent screen | Not started | Hard go-live blocker. Depends on L3 (ToS). Developer work required once ToS copy is ready. |

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
| `manifest.json` | PWA manifest. `start_url` = `/sniffout-v2.html`, `theme_color` = `#2C4A14`. |
| `CNAME` | Custom domain `sniffout.app`. |
| `index.html` | Redirects to `coming-soon.html` intentionally. |
| `placeholder-walk.jpg` | Illustrated placeholder for walk cards and green spaces without real photos. |
| `placeholder-pub.png` | Placeholder for pub venues on Nearby tab. |
| `placeholder-cafe.png` | Placeholder for cafe venues on Nearby tab. |
| `placeholder-vet.png` | Placeholder for vet venues on Nearby tab. |

### Agent briefing and instructions

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Auto-loaded by Claude Code agents. Project rules, tech stack, CSS tokens, architecture. Always read first. Brand colour `#2C4A14` (Woodland Green). Display typeface Fraunces. API key via proxy. |

### Product strategy and decisions

| File | Purpose |
|------|---------|
| `docs/po/po-action-plan-round24.md` | **Active PO document.** Current round status, decisions, next up. |
| `docs/po/po-action-plan-round12.md` | Historical record. PO decisions from Rounds 12-23. |
| `docs/po/product-vision-update.md` | Strategic vision. Discovery → personal record reframe. |
| `docs/po/community-gamification-roadmap.md` | Phase 2/3/4 roadmap. |
| `docs/po/pre-launch-checklist.md` | Pre-launch checklist. Needs update — T1 and T14 resolved, new items emerged. |

### Design specs

| File | Purpose |
|------|---------|
| `docs/specs/brand-guidelines-march-24.md` | **Brand guidelines.** Consolidated brand, design, and copy reference. Ready for new collaborators. |
| `docs/specs/designer-brief-march-24-spec.md` | **Designer spec A (24 March).** FAB, Me tab layout, Walks tab map, Nearby full screen map, parallax hero on walk detail. Implemented. |
| `docs/specs/designer-brief-march-24b-spec.md` | **Designer spec B (24 March).** Today hero card, Weather tab hazard cards, Settings cog, walk card proportions. Implemented. |
| `docs/specs/design-elevation-spec-march-23.md` | Design elevation spec. Fraunces typeface, #2C4A14 brand colour, hero card colour treatment, micro-interactions, palette expansion. Implemented. |
| `docs/specs/me-tab-rethink-v2-spec.md` | Me tab redesign spec (implemented Round 15+). |
| `docs/specs/me-tab-subpages-spec.md` | Me tab subpage architecture (implemented Round 28). |
| `docs/specs/dog-profile-spec.md` | Dog profile spec (implemented Round 19). Base spec — breed hazard toggles extend this. |
| `docs/specs/breed-hazard-spec.md` | Breed and dog-specific hazard personalisation spec. Implemented 23 March 2026. |
| `docs/specs/badge-system-rethink.md` | 10 badge definitions, triggers, earned moment copy. |
| `docs/specs/weather-tab-redesign-spec.md` | Weather tab redesign spec. |
| `docs/specs/weather-icon-consistency-spec.md` | Icon sizes: Today 72px/6px, Weather 96px/14px. |
| `docs/specs/disclaimer-design-spec.md` | Walk disclaimer design (implemented Round 13). |
| `docs/specs/hourly-forecast-spec.md` | Hourly forecast bar spec. Implemented — "Hour by hour" is Card 2 on Weather tab. |
| `docs/specs/hourly-forecast-layout-rec.md` | Designer layout recommendation for hourly forecast bar. |
| `docs/specs/state-a-redesign-spec.md` | Designer spec for State A first-run screen redesign. Implemented 20 March 2026. |
| `docs/specs/dog-diary-feature-scope.md` | Strategic scoping for dog diary feature. Deferred to Phase 2b post-launch. |
| `docs/specs/dark-mode-schemes.md` | Dark mode colour scheme options. Scheme B (Dark Slate) confirmed and implemented. |
| `docs/specs/install-prompt-spec.md` | PWA install prompt card spec. Implemented 20 March 2026. |
| `docs/specs/firebase-phase3-migration-spec.md` | Firebase Phase 3 migration spec. Complete. Ready to brief Developer. |
| `docs/specs/phase3-account-linking-design-spec.md` | Phase 3 account linking design spec. Complete. |
| `docs/research/brand-colour-proposal.md` | 8 colour options. Option G was Meadow Green `#3B5C2A` — superseded by Woodland Green `#2C4A14`. |
| `docs/briefs/developer-brief-restaurants.md` | Brief for dog-friendly restaurants/pubs. Permanently deferred. |

### Content pipeline files

| File | Purpose |
|------|---------|
| `docs/content/copywriter-personas.md` | Five persona definitions. Must be read before any Copywriter or Editor work. |
| `docs/content/uk-dog-breeds.md` | 62 UK dog breeds for the breed dropdown (now sorted alphabetically). |
| `docs/content/walks-batch-01-data.md` through `docs/content/walks-batch-03-data.md` | Researcher data for each batch. |
| `docs/content/descriptions-batch-02.md`, `docs/content/descriptions-batch-03.md` | Copywriter descriptions (batches 02-03). |
| `docs/content/editor-review-batch-01.md` through `docs/content/editor-review-batch-03.md` | Editor-reviewed descriptions. |
| `docs/content/validation-report-batch-01.md`, `docs/content/validation-report-batch-02.md`, `docs/content/validator-report-batch-03.md` | Validator sign-off for all batches. |
| `docs/content/phase3-account-linking-copy.md` | Phase 3 account linking copy. Editor reviewed and approved. |

### Research

| File | Purpose |
|------|---------|
| `docs/research/competitive-analysis-march-23.md` | Full competitive analysis. Five monetisation decisions (M1-M5) deferred to closer to launch. |
| `docs/research/firebase-setup-plan.md` | Firebase architecture and setup plan for Phase 3. |
| `docs/research/firebase-phase3-migration-research.md` | Firebase Phase 3 migration research. Basis for firebase-phase3-migration-spec.md. |
| `docs/research/push-notifications-research.md` | Push notification research. Owner decisions confirmed. Formal spec complete at `docs/specs/push-notifications-phase3-spec.md`. |
| `docs/research/dog-friendly-venues-research.md` | Research on dog-friendly venue data sources for Nearby tab. |
| `docs/research/breed-hazard-research.md` | Breed and dog-specific hazard research. VetCompass data, seasonal hazards, threshold recommendations. |

### UX reviews

| File | Purpose |
|------|---------|
| `docs/ux-reviews/ux-review-march-21.md` | UX review 21 March 2026. Round 1 fixes implemented. |
| `docs/ux-reviews/ux-review-march-22.md` | UX review 22 March 2026. Rounds A and B fixes implemented. B2, M5, M7 resolved 23 March. H10 remains. |

### Session handoff notes

| File | Purpose |
|------|---------|
| `docs/handoffs/archive/session-handoff-march-20.md` | Archived. Covers 20-21 March 2026. Full round history Rounds 11-33 in this file. |
| `docs/handoffs/archive/session-handoff-march-22.md` | Archived. Covers 22 March 2026. |
| `docs/handoffs/archive/session-handoff-march-23.md` | Archived. Covers 23 March 2026. |
| `docs/handoffs/archive/session-handoff-march-24-morning.md` | Archived. Covers early 24 March 2026 (morning session). |
| `docs/handoffs/session-handoff-march-24.md` | **This document. Current active handoff.** |

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
- The owner has a dog named **Luna**. Luna is a Bear Coat Shar Pei. Luna has the double-coat toggle set to Yes. Luna is the inspiration for the dog profile feature. When discussing dog profile features, this is personal.

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
/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.78/claude.app/Contents/MacOS/claude
```

To add to PATH permanently:
```bash
echo 'export PATH="/Users/jayeshfatania/Library/Application Support/Claude/claude-code/2.1.78/claude.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Starting an agent

```bash
cd ~/Desktop/my-first-repo && claude
```

Paste the full prompt (drafted by Claude in chat) to start the agent's task.

### Recommended pane layout

```
+---------------------+---------------------+
|                     |                     |
|   Top-left:         |   Top-right:        |
|   PO agent          |   Developer agent   |
|                     |                     |
+---------------------+---------------------+
|                     |                     |
|   Bottom-left:      |   Bottom-right:     |
|   Designer agent    |   Researcher /      |
|                     |   Copywriter /      |
|                     |   Editor /          |
|                     |   Validator         |
+---------------------+---------------------+
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
5. **Brand colour is `#2C4A14` (Woodland Green)** — replaces `#3B5C2A` (Meadow Green). CLAUDE.md corrected 24 March. No old colour references should remain anywhere.
6. **Display typeface is Fraunces (`var(--font-display)`)** — applied to hero and display elements only. Inter for all UI copy.
7. **Dark mode brand backgrounds use `#3D6B22`** — `#6A9B4A` is for text/icons only in dark mode. Do not use `#6A9B4A` as a background colour.
8. **Hourly forecast bar is LIVE** — "Hour by hour" is Card 2 on Weather tab. Walk Window is Card 1. Tappable temperature spec is superseded.
9. **97 walks still need photos** — 3 have real photos. 7 showcase carousel walks are priority.
10. **Brand language: "On my sniff list" and "Sniffed and approved"** — confirmed names. Do not revert.
11. **Walk card placeholder is `placeholder-walk.jpg`** — venue-specific placeholders exist for pub, cafe, vet. See Section 2.
12. **L1-L5 are all legal blockers** — solicitor-dependent. L5 is T&C consent screen — hard go-live blocker.
13. **`locationRestriction` must not be used** on Nearby tab — causes empty results. Radius enforced client-side.
14. **Logo rebuild complete** — all icon files in repo, wired up. No further action needed unless owner creates new exports.
15. **Firebase foundation is live — boundary is firm** — write-only, anonymous auth + dual-write + Storage. Full migration is Phase 3, gated on L1. Do not add Firebase reads to critical render path.
16. **Today tab = Lucide icons, Weather tab = Yr.no icons** — confirmed design decision, do not merge.
17. **State A headline is "Paws before you go."** — social proof strip: "Know the route · Own the weather · Find dog-friendly spots". Do not revert.
18. **`renderWeather()` must never touch `body.night`** — dark mode is user-controlled. This was a production bug, fixed 22 March. Do not reintroduce.
19. **All inline JS is in one merged script block** — no new `<script>` tags. Hoisting errors permanently resolved.
20. **Firebase API key corrected** — correct key is `sniffout-fe976` browser key. Anonymous auth and Firestore dual-write working.
21. **OS Maps toggle is live** — Leisure tiles still pending. Owner to raise support ticket. API key in page source — deferred security review (H10).
22. **Green spaces uses multi-query with dedup** — four queries: `parks`, `nature reserve`, `common land`, `country park`. No location name in textQuery. Do not revert to single query.
23. **Push notification decisions confirmed and spec complete** — hazard-only at launch (Types 1-5), Firebase Cloud Functions, home location via banner prompt + settings. Formal Phase 3 spec at `docs/specs/push-notifications-phase3-spec.md`. GDPR sign-off and solicitor review are go-live prerequisites only, not build prerequisites.
24. **UX deferred items — three resolved, one remaining** — B2, M5, and M7 resolved 23 March 2026. H10 (OS Maps API key in page source) remains deferred to dedicated pre-launch security review.
25. **Lucide pinned to v0.577.0** — do not change CDN version without explicit instruction.
26. **Recently Viewed in Me tab** — `sniffout_recent_walks`, up to 10 walks, subpage overlay. Removed from Today tab pills.
27. **Active dog profile key is `sniffout_dogs` (plural array)** — `sniffout_dog` (singular) is deprecated and migrated. Do not use `sniffout_dog` in any new code.
28. **Breed/age hazard personalisation is live** — brachycephalic (27°C), double-coat (30°C), senior (30°C heat / -2°C cold), small dog cold advisory (5°C), puppy cold advisory (2°C). Five seasonal hazards active. All logic in `detectHazards()` and `getPawSafety()`. Spec at `docs/specs/breed-hazard-spec.md`.
29. **Agent prompts must be code blocks** — for easy copy-paste. Never prose.
30. **For code checks, use terminal grep** — not the uploaded file, which goes stale.
31. **Google Cloud billing resolved 23 March 2026** — upgraded to pay-as-you-go, £15 budget alert set. No further action needed.
32. **Firebase Phase 3 migration spec is complete** — saved to `docs/specs/firebase-phase3-migration-spec.md`. Ready to brief Developer.
33. **Phase 3 account linking copy complete** — `docs/content/phase3-account-linking-copy.md`. Editor reviewed and approved.
34. **Phase 3 account linking design spec complete** — `docs/specs/phase3-account-linking-design-spec.md`.
35. **Competitive analysis complete — M1-M5 deferred** — `docs/research/competitive-analysis-march-23.md`. Owner reviewed all five monetisation decisions and deferred to closer to launch.
36. **Fake ratings removed** — walk cards no longer show stars or review counts. No fake social proof anywhere in the app.
37. **No-account framing updated** — "no account required" is not a selling point. Frame as: "your data, safe across any device."
38. **No hardcoded emoji in verdict title strings** — Lucide icons only. Personalised shortTitle when dog profile exists.
39. **Woodland routes must never be recommended in high wind or gust conditions** — valley paths, urban streets, low-lying ground only.
40. **Today tab hero card — unified single card** — internal dividers, hazard detail inline, "Full forecast" tap row at bottom. Info button removed. No banner.
41. **Weather tab — hazard cards only, no banner** — banner permanently removed. `buildHazardHTML()` shared helper. Most severe first.
42. **Settings cog is inside the dog profile card** — absolute-positioned top-right. Not a FAB. Not in the tab header. Do not move it.
43. **FAB on Me tab — implemented** — plus icon, 56px, `bottom: 88px`, brand green, multi-layer shadow, fade on scroll. Spec at `docs/specs/designer-brief-march-24-spec.md`.
44. **Walk card image heights: carousel 140px, list 180px** — walk name overlaid on image only (Fraunces 700 26px white). Name does not repeat below image.
45. **Away distance removed from walk cards** — appears in walk detail overlay only. Do not reintroduce to cards.
46. **Nearby tab map must match Walks tab exactly** — same header toggle, same full screen behaviour, same bottom-centre filter pill. Carry-over Developer task.
47. **Walk window hours constrained to 6am-9pm** — late-night edge case (labelling tomorrow's window) is a carry-over bug fix.
48. **Brand guidelines document complete** — `docs/specs/brand-guidelines-march-24.md`. Ready for use by new collaborators.
49. **Haptic feedback: `navigator.vibrate(10)` on saves, `navigator.vibrate([50,30,80])` on badge earn** — apply to all new save/earn interactions.
50. **Me tab dog name is `.me-dog-card-name` at 48px Fraunces 700** — always the largest text on the Me tab.
51. **All three Me tab stat numbers use `var(--brand)` / `#6A9B4A` dark** — consistent colour, not var(--ink).
