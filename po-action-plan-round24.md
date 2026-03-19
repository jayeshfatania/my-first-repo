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

### Immediate — Round 26

**Me tab subpages implementation**
- Implement per `me-tab-subpages-spec.md` (Designer spec complete).
- Me tab is becoming increasingly content-rich. Subpages provide the structure needed before adding more features.
- PO to review `me-tab-subpages-spec.md` and approve before issuing Developer brief.

### Also immediate

**Batch 02 + 03 content update**
- Issue combined Developer brief. 40 walks to add.
- Both batches validated. No blockers. This is ready to go now.

**CLAUDE.md** — already updated today for brand colour and API key. No further CLAUDE.md changes needed unless a new architectural decision warrants it.

### Soon (Phase 2 remaining)

- **Dog-friendly restaurants in Nearby tab** — brief exists at `developer-brief-restaurants.md`. Revert was intentional; feature to return in a dedicated round with proper design.
- **Walk Wrapped summary** — twice yearly (July and December/January). Data foundation exists (`sniffout_walk_log` with timestamps). Needs Designer spec.
- **Pollen data on Weather tab** — Open-Meteo European AQI endpoint. Phase 3 per CLAUDE.md.
- **Copy review session** — all UI copy across all tabs reviewed against brand voice.
- **Brand guidelines document** — Meadow Green `#3B5C2A` confirmed. Full guidelines (colour palette, typography, logo usage) not yet produced. Designer brief needed.

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
| Pubs/restaurants in Nearby | Reverted from Round 23. Brief exists at `developer-brief-restaurants.md`. Return in a dedicated round. | 19 March 2026 |
| API key security | Cloudflare Worker proxy at `places-proxy.sniffout.app` — do not revert to direct Google URL | 19 March 2026 |
| Strategic direction | Personal record (dog walking journal) not just a discovery tool | 18 March 2026 |
