# Sniffout — Product Owner Action Plan: Round 24 onwards
*Issued by: Product Owner*
*Date: 19 March 2026*
*Status: Active — replaces po-action-plan-round12.md as the current reference document. The old file remains in the repo as a historical record.*

---

## Context

As of 19 March 2026, a full day of development has been completed. The app has advanced significantly from Round 12: walk logging, dog profile, gamification foundations, brand colour, and the Cloudflare proxy security fix are all now shipped. The pre-launch hard blockers are down from five to three, all of which are legal (solicitor-dependent) rather than technical.

**Current phase:** Phase 2 — localStorage only. Firebase is Phase 3, elevated to top priority because the app now holds irreplaceable personal data (walk journal, dog profile, photos).

---

## Completed Today — 19 March 2026

### Round 24 — Me tab polish and dark mode fixes

- **Me tab zeros** — stats now show dashes instead of zeros when no data exists. Avoids a confusing "0 walks logged" state on first open.
- **Weather icon alignment** — icon size and alignment on Weather tab confirmed correct.
- **Dark mode toggle fix** — toggle was defaulting to Light incorrectly. Fixed.
- **Settings and dog profile separated** — previously combined in the Me tab. Now distinct sections with clear visual separation.

### Round 25 — Brand colour update

- **Brand colour updated to Meadow Green `#3B5C2A`** throughout `sniffout-v2.html` and `manifest.json`.
- This replaces `#1E4D3A` (forest green) which was too close to the Too Good To Go brand colour.
- All CSS custom property uses (`var(--brand)`), hardcoded hex values, chip tint values (`rgba`), and manifest `theme_color` updated.
- `CLAUDE.md` updated to reflect the new colour.

### Additional fixes completed today (not part of a formal round)

**Cloudflare Worker proxy — fully working**
- Proxy now fully operational at `places-proxy.sniffout.app`.
- Root fix: Referer header added to Worker code so Google accepts requests. DNS and Worker code both confirmed working.
- Google Places API key is no longer exposed in page source. Pre-launch hard blocker T1 resolved.

**FIX 23.2 reverted — pubs and restaurants removed**
- The pubs and restaurants Nearby tab category (added in Round 23) has been removed cleanly.
- FIX 23.1 (dog profile prompt in Me tab) is intact and unaffected.
- Reason for revert: the feature needs more design work before shipping. `developer-brief-restaurants.md` documents the intended implementation for a future round.
- **Pubs restored as a standalone Nearby tab category** — the existing pubs category (pre-Round 23) is back in place.

**Place photos now routing through proxy**
- Google Places photo requests now correctly route through the Cloudflare Worker proxy.

**manifest.json start_url fixed**
- `start_url` was pointing to the old v1 path. Now correctly set to `/sniffout-v2.html`.
- Installed PWA instances no longer show a 404 on launch.

### Round 26 — Saved places, heart icons, weather hero, walk note save button, fresh weather fetch

- **FIX 26.1** — Saved places not appearing in Me tab. Root cause: localStorage key mismatch — Nearby tab saving to `sniffout_place_favs` but Me tab reading from `sniffout_saved_places`. Fixed across all three read locations.
- **FIX 26.2** — Empty state copy corrected from "bookmark icon" to "heart icon".
- **FIX 26.3** — Heart icon disappearing on Walks tab fixed with `z-index: 1` on `.walk-heart`.
- **FIX 26.4** — Weather tab hero temperature and icon alignment fixed. Gap set to 56px, icon 96px, vertically centred. Per Designer recommendation. (Iterated twice — 26.4b and 26.4c — to reach final values.)
- **FIX 26.5** — Weather tab showing wrong icon fixed. Replaced stale `is_day` cache value with live hour-based check (`currentH >= 6 && currentH < 21`).
- **FIX 26.6** — Save button added to walk note input with 2-second confirmation message.
- **FIX 26.7** — Weather now always fetches fresh data on every load. App renders instantly with cached data then re-renders with live data when fetch completes.

### Round 27 — Me tab avatar, stats dashboard, entry point rows

- Me tab avatar, stats dashboard, and subpage entry point rows reviewed. The bulk of this work was already in place from previous rounds — small gaps identified and filled.

### Round 28 — Me tab subpage overlays

- All four subpage overlays confirmed built from previous rounds: Walk Journal, Badges, Saved Walks, Saved Places.
- Wiring verified — each entry point row correctly opens its corresponding subpage overlay.

### Round 29 — Units toggle, formatDist helper, em dash sweep

- **FIX 29.1** — km/miles units toggle added to Settings. Defaults to km. Selection saves to `sniffout_units` in localStorage.
- **FIX 29.2** — `formatDist()` helper applied across all distance displays in the app. Respects `sniffout_units` setting consistently.
- **FIX 29.3** — Me tab stats label updates dynamically when units setting changes. `~` prefix confirmed throughout.
- **FIX 29.4** — Em dash sweep complete across all user-facing copy. No em dashes or en dashes remain anywhere in the app.

### Round 30 — Free-form walk logging

- **FIX 30.1** — Walk log schema extended with `type` field (`"curated"` | `"custom"`). Existing entries default to `"curated"` via fallback — no migration needed.
- **FIX 30.2** — "Log a walk" button and bottom sheet added to Walk Journal. Fields: name (required), date (defaults to today, editable), distance (optional), duration (optional), notes (optional).
- **FIX 30.3** — Custom entries display in the journal timeline with a "Your route" chip distinguishing them from curated walk entries.
- **FIX 30.4** — Me tab stats include custom walk distances in the total miles calculation.

### Additional fixes (afternoon session — not part of a formal round)

- **Badge custom icons** — all 10 badges now show unique custom SVG icons. Implementation required debugging: root cause was duplicate `renderMeBadges` function names and mismatched render path wiring.
- **Badge subpage crash fixed** — duplicate function removed, correct function wired to all call sites.
- **Weather tab hero spacing finalised** — 56px gap, 96px icon, vertically centred pair. Per Designer recommendation.
- **manifest.json start_url fixed** — PWA installs correctly to `/sniffout-v2.html`.
- **Cloudflare Worker proxy confirmed fully working** — see T1 resolution above.

---

## Pre-Launch Blockers — Status as of 19 March 2026

### Resolved today

| Item | Resolution | Date |
|------|-----------|------|
| **T1** — Google Places API key exposed | Cloudflare Worker proxy at `places-proxy.sniffout.app`. Key no longer in page source. | 19 March 2026 |
| **T14** — manifest.json start_url pointing to wrong file | Fixed to `/sniffout-v2.html`. Installed PWA works correctly. `index.html` intentionally redirects to `coming-soon.html` — app accessible at `sniffout.app/sniffout-v2.html` direct link only. | 19 March 2026 |

### Still outstanding — legal blockers (all solicitor-dependent)

| Item | Status | Notes |
|------|--------|-------|
| **L1** — GDPR sign-off from solicitor | 🔴 Blocked | Owner is seeking a solicitor. Hard legal blocker — do not launch without this. |
| **L2 / L3** — Privacy policy and Terms of Service | 🔴 Blocked | Depends on L1. Cannot be written without legal input. |
| **L4** — NDA review by solicitor | 🔴 Blocked | `sniffout-nda.docx` exists and is ready for review. No beta access until cleared. |

No remaining technical hard blockers. All three outstanding blockers are legal and require the solicitor to be engaged. Owner action required.

**Note for solicitor (when privacy policy is drafted):** The app now stores user-entered health notes about dogs (vet visits, medication, health observations) via the walk notes field and walk log. This is not special category GDPR data, but the solicitor should be aware so the privacy policy accurately reflects the categories of data stored.

---

## Content Pipeline — Current State

| Batch | Descriptions | Editor review | Validator sign-off | In WALKS_DB |
|-------|-------------|--------------|-------------------|-------------|
| Batch 01 | Complete | Complete | Complete | ✅ Live |
| Batch 02 | Complete | Complete | Complete | ⬜ Awaiting Developer update |
| Batch 03 | Complete | Complete | Complete | ⬜ Awaiting Developer update |

**Next action:** Issue combined content update brief to Developer. 40 walks (Batch 02 + Batch 03) to add to `WALKS_DB`. Walk count reaches 85 on completion.

---

## Next Up

### Upcoming work — priority order

1. **Full UX/UI review** — dedicated Designer session reviewing every tab systematically. Prioritised findings list. Must happen before next beta push.
2. **Batch 02 + 03 content update** — 40 walks validated and ready. Issue combined Developer brief. Walk count reaches 85.
3. **Logo rebuild** — owner creating in Illustrator. Required exports: `icon.svg` (master), `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180x180), `favicon.svg`. No Developer work until exports are ready.
4. **`sniffout.co.uk` redirect** — defensive registration exists but not yet redirecting to `sniffout.app`. Owner action.
5. **`hello@sniffout.app` support email** — required for GDPR subject access requests (checklist item B6). Owner action.
6. **GDPR solicitor engagement** — L1/L2/L3/L4 all blocked on this. Owner action. Target: engaged at least 4 weeks before any beta launch date.

### Phase 2b — post-launch (confirmed deferred)

- **Dog diary / health log** — scoped in `dog-diary-feature-scope.md`. Deferred to after soft launch to gather beta feedback first. Entry types: vet visit, medication, health note, general. New localStorage key `sniffout_dog_diary`. Me tab subpage.
- **Dog-friendly restaurants in Nearby tab** — permanently removed. Brief at `developer-brief-restaurants.md`. Returns in a future dedicated round with proper design.
- **Walk Wrapped summary** — twice yearly. Walk log foundation exists. Needs Designer spec.
- **Copy review session** — all UI copy reviewed against brand voice.
- **Brand guidelines document** — Meadow Green `#3B5C2A` confirmed. Full guidelines not yet produced.

### Soon (Phase 2 remaining)

- **Pollen data on Weather tab** — Open-Meteo European AQI endpoint. Phase 3 per CLAUDE.md.

### Phase 3 (priority order — confirmed)

1. **Firebase backend** — personal data (walk journal, dog profile, notes, photos) cannot safely live in `localStorage` long-term. Highest Phase 3 priority.
2. **Missing Dog alerts** — community safety feature.
3. **User-submitted walks** — editorial review before publish, same `WALKS_DB` schema, curated vs community badge distinction.
4. **Community ratings** — Bayesian weighted, minimum 3 reviews before stars display.
5. **Push notifications** — post-backend only.

---

## Key Decisions on Record

These decisions are locked and should not be revisited without a clear reason.

| Decision | What was decided | When |
|----------|-----------------|------|
| Brand colour | `#3B5C2A` (Meadow Green) — replaces `#1E4D3A` | 18 March 2026, implemented 19 March 2026 |
| Dark mode trigger | "Match device" using `prefers-color-scheme` — not sunrise/sunset | 18 March 2026 |
| Weather icons | Today tab = white Lucide icons; Weather tab = Yr.no meteocon SVGs | 18 March 2026 |
| Walk log data model | `sniffout_walk_log` timestamped entries — no revert to `sniffout_walked` | Round 12 |
| Streaks | Not surfaced in UI — milestone badges only | Round 12 |
| Pubs/restaurants in Nearby | Permanently removed (FIX 23.2). Quality issues — too many non-dog-friendly results. Brief at `developer-brief-restaurants.md` for a future dedicated round. | 19 March 2026 |
| API key security | Cloudflare Worker proxy at `places-proxy.sniffout.app` — fully working. Do not revert to direct Google URL. | 19 March 2026 |
| Strategic direction | Personal record (dog walking journal) not just a discovery tool | 18 March 2026 |
| Weather fetch | Always fetches fresh on every load. Renders instantly with cache then re-renders when live data arrives. Never serve stale weather. | 19 March 2026 |
| Settings vs dog profile | Gear icon opens settings only. "Your Dog" row opens dog profile subpage. Fully separated. | 19 March 2026 |
| Logo | To be rebuilt in Illustrator by owner. SVG master + four PNG/ICO exports. No Developer work until exports ready. | 19 March 2026 |
| UX/UI review | Full dedicated session required before next beta push. Designer reviews every tab systematically. | 19 March 2026 |
| Free-form walk logging | Built before soft launch — journal was structurally broken without it. `type: "curated"/"custom"` field in walk log. | 19 March 2026 |
| Dog diary | Deferred to post-launch Phase 2b. Scoped in `dog-diary-feature-scope.md`. | 19 March 2026 |
| Units | km default, miles toggle in Settings, saves to `sniffout_units`. `formatDist()` helper applied everywhere. | 19 March 2026 |
| Em dashes | Swept from all user-facing copy in FIX 29.4. Hyphens only throughout the app. | 19 March 2026 |
