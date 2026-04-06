# Sniffout Repo Audit Report - 6 April 2026

**Scope:** Full audit of both repos - PWA (`~/Desktop/my-first-repo`) and Website (`~/Desktop/sniffout-website`)
**Conducted by:** PO/Validator

---

## Summary

39 website walk pages confirmed live and in sync with Hugo output. No orphan walk pages. CLAUDE.md in the website repo has one wrong file path and four missing guide entries. Both repos have stale dev prototypes at root level. Four PWA-specific research files are misplaced in the website repo. Two WALKS_DB description texts are inconsistent with data corrections made last session.

---

## Findings by priority

---

### Priority 1 - CLAUDE.md corrections (action before next session)

These cause silent errors every time agents reference CLAUDE.md.

| # | File | Repo | Issue | Action |
|---|------|------|-------|--------|
| 1 | `CLAUDE.md` | Website | Temperature guide path listed as `content/guides/is-it-too-hot-to-walk-my-dog.md` - file does not exist at that path | Correct to `content/guides/temperature-guide.md` |
| 2 | `CLAUDE.md` | Website | `best-dog-walks-brachycephalic-breeds.md` is live but missing from guide list | Add to guide articles list |
| 3 | `CLAUDE.md` | Website | `dog-walks-autumn-uk.md` is live but missing from guide list | Add to guide articles list |
| 4 | `CLAUDE.md` | Website | `shar-pei-fever-spaid.md` is live but missing from guide list | Add to guide articles list |
| 5 | `CLAUDE.md` | Website | `shar-pei-skin-fold-care.md` is live but missing from guide list | Add to guide articles list |

---

### Priority 2 - PWA repo root tidying

| # | File | Repo | Status | Action |
|---|------|------|--------|--------|
| 6 | `handoff-2026-04-05.md` (repo root) | PWA | MISPLACED | Move to `docs/handoffs/handoff-2026-04-05.md` |
| 7 | `smart-weather-scoring-spec.md` (repo root) | PWA | DUPLICATE | Delete root copy - canonical version is at `docs/smart-weather-scoring-spec.md` |
| 8 | `image-checklist.html` (repo root) | PWA | STALE | Archive to `docs/archive/` or delete (dev prototype, not user-facing) |
| 9 | `smart_barchart_with_reason_icons.html` (repo root) | PWA | STALE | Archive to `docs/archive/` or delete (dev prototype, not user-facing) |
| 10 | `docs/content/guides/french-bulldog-walking-guide.md` | PWA | MISPLACED | Delete - this is a website article; live version already exists at `sniffout-website/content/guides/french-bulldog-walking-guide.md` |

---

### Priority 3 - WALKS_DB description text corrections (requires Developer brief)

Data fields were corrected last session but the human-readable description text was not updated. These descriptions are visible to users on walk cards and walk detail pages.

| # | Walk | Repo | Issue | Action |
|---|------|------|-------|--------|
| 11 | Bookham Common | PWA | Description says "no livestock on the common itself" - `livestock` field was corrected to `true` last session | Update description text to reflect livestock presence - needs Developer brief |
| 12 | Epsom Common | PWA | Description says "Ghost has full off-lead run of it, there's no livestock" - `livestock` field was corrected to `true` last session | Update description text to reflect livestock presence - needs Developer brief |

---

### Priority 4 - Website repo doc folder tidying

| # | File | Repo | Status | Action |
|---|------|------|--------|--------|
| 13 | `docs/content/guides/cockapoo-walking-guide.md` | Website | STALE | Staging draft - live article exists at `content/guides/cockapoo-walking-guide.md`. Delete. |
| 14 | `docs/content/guides/temperature-guide.md` | Website | STALE | Staging draft - live article exists at `content/guides/temperature-guide.md`. Delete. |
| 15 | `docs/research/community-features-research-april-3.md` | Website | MISPLACED | PWA feature research - move to PWA repo `docs/research/` |
| 16 | `docs/research/community-features-summary.md` | Website | MISPLACED | PWA feature research - move to PWA repo `docs/research/` |
| 17 | `docs/research/scoring-validation-april-3.md` | Website | MISPLACED | PWA scoring validation - move to PWA repo `docs/research/` |
| 18 | `docs/research/canine-weather-sensitivity-april-2.md` | Website | MISPLACED | PWA weather scoring data - move to PWA repo `docs/research/` |

---

### Priority 5 - Walk image audit (owner action)

16 images in `docs/img/walks/` have no corresponding walk page. These may be pre-sourced for future walk batches or orphaned from earlier planning. Two PNG files need source verification (Google Maps screenshots are prohibited).

**Orphaned images (no matching walk page):**
- bamburgh-castle.jpg
- bath-skyline.jpg
- ben-nevis-foothills.jpg
- beachy-head.jpg
- cairngorms-loch-morlich.jpg
- edinburgh-pentland-hills.jpg
- glen-coe.jpg
- isle-of-arran.jpg
- lake-district-buttermere.jpg, lake-district-coniston.jpg, lake-district-ullswater.jpg, lake-district-wastwater.jpg
- pembrokeshire-coast.jpg
- snowdonia-aber-falls.jpg
- studland-bay.jpg
- yorkshire-pen-y-ghent.jpg

**Action:** Owner to check these against the image tracker. Confirm which are pre-sourced for upcoming walk batches and which can be deleted.

**PNG files requiring source check:**
- `docs/img/walks/burley-new-forest.png` - PNG format unlike all other walk images (JPG). Verify source is not a Google Maps screenshot.
- `docs/img/walks/hindhead-common.png` - same concern.

**Action:** If either is a Google Maps screenshot, replace immediately (copyrighted, prohibited per CLAUDE.md).

---

## What is OK - no action needed

- All 39 walk pages have corresponding Hugo output in `docs/walks/` - in sync
- All 20 area pages have corresponding Hugo output in `docs/areas/` - in sync
- All guide articles have corresponding Hugo output in `docs/guides/` - in sync
- `docs/smart-weather-scoring-spec.md` in PWA repo `docs/` - canonical, keep
- `docs/handoffs/` in website repo - all three handoffs (April 3, 4, 5) present
- `docs/handoffs/handoff-2026-04-04.md` in PWA repo - present
- `docs/monetisation-strategy.md` in website repo - correct location
- `docs/content/pages/methodology.md` in website repo - source copy for methodology page, useful reference, keep
- `sniffout-kanban.html` at PWA root - active project management tool, keep
- All fact-check files in `docs/fact-check/` - complete and correctly located
- Cross-repo: no walk pages on website without WALKS_DB entries detected
- Cross-repo: no CLAUDE.md references to files that do not exist (except the one wrong temperature guide path noted above)

---

## Action summary

| Owner | Actions |
|-------|---------|
| PO (CLAUDE.md fixes) | Fix temperature guide path (item 1); add 4 missing guides to CLAUDE.md list (items 2-5) |
| Developer | Move handoff-2026-04-05.md to correct folder (item 6); delete root spec duplicate (item 7); delete stale prototypes (items 8-9); delete misplaced french bulldog guide (item 10); update Bookham Common and Epsom Common description text (items 11-12) - separate brief |
| Developer | Delete stale staging drafts in website docs/content/ (items 13-14); move 4 misplaced research files to PWA repo (items 15-18) |
| Owner | Image tracker check - verify 16 orphaned walk images (priority 5); verify PNG sources for burley and hindhead images |
