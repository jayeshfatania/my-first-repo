# Sniffout — Repository Restructure Brief
**Issued by:** Product Owner
**Date:** 21 March 2026
**For:** Cowork agent
**Repo:** `~/Desktop/my-first-repo`

---

## Overview

The repository root has accumulated a large number of loose files. This brief instructs you to reorganise them into a structured `docs/` folder hierarchy. The app itself is unaffected — no app files are moved.

Read `CLAUDE.md` before starting. The file protection rules in CLAUDE.md apply throughout this task.

---

## What to do

1. Create the folder structure below inside the repo root
2. Move each file to its assigned folder using `git mv` (not plain `mv` — git must track the renames)
3. After all moves are complete, check `CLAUDE.md` for any file references that may need updating to reflect new paths
4. Commit and push

Do not move any file that is not listed in this brief. If you encounter a file not listed anywhere, leave it in place and note it in your summary.

---

## Folder structure to create

```
docs/
  specs/
  research/
  briefs/
  content/
  handoffs/
  po/
  mockups/
  ux-reviews/
  archive/
```

---

## File assignments

### docs/specs/

```
badge-icons-spec.md
badge-system-rethink.md
card-design-update.md
condition-tags-design-spec.md
dark-mode-colour-spec.md
dark-mode-schemes.md
dark-mode-toggle-redesign.md
disclaimer-design-spec.md
dog-diary-feature-scope.md
dog-profile-spec.md
hourly-forecast-layout-rec.md
hourly-forecast-spec.md
install-prompt-spec.md
me-tab-dashboard-research.md
me-tab-redesign-spec.md
me-tab-rethink-spec.md
me-tab-rethink-v2-spec.md
me-tab-subpages-spec.md
me-tab-vision.md
missing-dog-design-spec.md
os-maps-research.md
settings-ux-recommendation.md
state-a-redesign-spec.md
sticky-picks-proposal.md
temperature-tap-spec.md
today-tab-design-proposal.md
today-tab-dev-brief.md
walk-detail-overlay-spec.md
weather-hero-fix.md
weather-icon-consistency-spec.md
weather-tab-redesign-spec.md
```

### docs/research/

```
brand-colour-proposal.md
community-engagement-research.md
competitor-research.md
demand-validation.md
design-brief.md
dog-friendly-venues-research.md
firebase-setup-plan.md
great-british-dog-walks-research.md
missing-dog-research.md
pre-build-validation.md
research-report-community-gamification.md
today-tab-research.md
weather-research.md
```

### docs/briefs/

```
designer-brief-round1.md
designer-brief-round2.md
designer-brief-round3.md
developer-brief-restaurants.md
developer-brief-round3.md
developer-brief-round4.md
developer-brief-round5.md
developer-brief-round6.md
developer-brief-round7.md
developer-brief-round8.md
developer-brief-round9.md
developer-brief-round10.md
developer-brief-round11.md
developer-brief-round13.md
developer-brief-round14.md
developer-brief-round15.md
developer-notes.md
developer-questions.md
phase1-build-brief.md
phase1-fix-brief.md
phase2-team-brief.md
```

### docs/content/

```
copywriter-personas.md
descriptions-batch-02.md
descriptions-batch-03.md
descriptions-existing-walks.md
descriptions-isabella-plantation.md
descriptions-new-walks.md
editor-review-batch-01.md
editor-review-batch-02.md
editor-review-batch-03.md
uk-dog-breeds.md
validation-report-batch-01.md
validation-report-batch-02.md
validation-report-v2.md
validation-report.md
validator-report-batch-03.md
walks-audit.md
walks-batch-01-data.md
walks-batch-02-data.md
walks-batch-03-data.md
walks-isabella-plantation-data.md
```

### docs/handoffs/

```
session-handoff-march-18.md
session-handoff-march-19.md
session-handoff-march-20.md
```

### docs/po/

```
community-gamification-roadmap.md
copy-review.md
owner-feedback-round2.md
phase1-signoff.md
po-action-plan-round12.md
po-action-plan-round24.md
po-action-plan.md
pre-launch-checklist.md
product-vision-update.md
```

### docs/mockups/

```
dark-mode-scheme-a.html
dark-mode-scheme-b.html
dark-mode-scheme-c.html
hourly-forecast-mockup.html
mockup-colour-a.html
mockup-colour-b.html
mockup-colour-c.html
mockup-colour-d.html
mockup-colour-e.html
mockup-colour-f.html
mockup-colour-g.html
mockup-colour-h.html
mockup.html
state-a-redesign-mockup.html
```

### docs/ux-reviews/

```
design-review-round1.md
design-review-round2.md
design-review-round3.md
design-spec.md
design-verification-round1.md
ux-review-march-19.md
ux-review-march-21.md
ux-review-round11.md
```

### docs/archive/

```
feature-recommendations.md
sniffout-project-brief.docx
```

---

## Files that must stay at root — do not move these

```
sniffout-v2.html
dog-walk-dashboard.html
CLAUDE.md
manifest.json
sw.js
index.html
coming-soon.html
CNAME
README.md
wrangler.toml
placeholder-walk.jpg
repo-restructure-brief.md
```

Also leave at root — all image files and folders:

```
*.jpg  (isabella-plantation.jpg, richmond-park.jpg, wimbledon-common.jpg)
*.png  (icon-192.png, icon-512.png, icon-512-green.png, icon-new-192.png,
        icon-new-512.png, apple-touch-icon.png, sniffout-logo.png,
        Sniffsniffout-logo-new.png)
*.svg  (favicon.svg, icon.svg, icon-green.svg)
screenshots/         (folder — leave in place)
workers/             (folder — leave in place)
Design inspiration/  (folder — leave in place)
```

---

## After moving files — check CLAUDE.md

Once all files have been moved, open `CLAUDE.md` and search for any file references by name (e.g. `copy-review.md`, `po-action-plan-round24.md`, `dark-mode-schemes.md`). Update any references to include the new path so agents can locate files correctly — for example, `copy-review.md` becomes `docs/po/copy-review.md`.

Do the same check for `session-handoff-march-20.md` — it contains a file reference table in Section 10 that lists every file in the project. Update those entries to reflect the new paths.

---

## Git commands

Run these after all files have been moved:

```bash
cd ~/Desktop/my-first-repo

# Create folder structure
mkdir -p docs/specs docs/research docs/briefs docs/content docs/handoffs docs/po docs/mockups docs/ux-reviews docs/archive

# Move files — docs/specs/
git mv badge-icons-spec.md docs/specs/
git mv badge-system-rethink.md docs/specs/
git mv card-design-update.md docs/specs/
git mv condition-tags-design-spec.md docs/specs/
git mv dark-mode-colour-spec.md docs/specs/
git mv dark-mode-schemes.md docs/specs/
git mv dark-mode-toggle-redesign.md docs/specs/
git mv disclaimer-design-spec.md docs/specs/
git mv dog-diary-feature-scope.md docs/specs/
git mv dog-profile-spec.md docs/specs/
git mv hourly-forecast-layout-rec.md docs/specs/
git mv hourly-forecast-spec.md docs/specs/
git mv install-prompt-spec.md docs/specs/
git mv me-tab-dashboard-research.md docs/specs/
git mv me-tab-redesign-spec.md docs/specs/
git mv me-tab-rethink-spec.md docs/specs/
git mv me-tab-rethink-v2-spec.md docs/specs/
git mv me-tab-subpages-spec.md docs/specs/
git mv me-tab-vision.md docs/specs/
git mv missing-dog-design-spec.md docs/specs/
git mv os-maps-research.md docs/specs/
git mv settings-ux-recommendation.md docs/specs/
git mv state-a-redesign-spec.md docs/specs/
git mv sticky-picks-proposal.md docs/specs/
git mv temperature-tap-spec.md docs/specs/
git mv today-tab-design-proposal.md docs/specs/
git mv today-tab-dev-brief.md docs/specs/
git mv walk-detail-overlay-spec.md docs/specs/
git mv weather-hero-fix.md docs/specs/
git mv weather-icon-consistency-spec.md docs/specs/
git mv weather-tab-redesign-spec.md docs/specs/

# Move files — docs/research/
git mv brand-colour-proposal.md docs/research/
git mv community-engagement-research.md docs/research/
git mv competitor-research.md docs/research/
git mv demand-validation.md docs/research/
git mv design-brief.md docs/research/
git mv dog-friendly-venues-research.md docs/research/
git mv firebase-setup-plan.md docs/research/
git mv great-british-dog-walks-research.md docs/research/
git mv missing-dog-research.md docs/research/
git mv pre-build-validation.md docs/research/
git mv research-report-community-gamification.md docs/research/
git mv today-tab-research.md docs/research/
git mv weather-research.md docs/research/

# Move files — docs/briefs/
git mv designer-brief-round1.md docs/briefs/
git mv designer-brief-round2.md docs/briefs/
git mv designer-brief-round3.md docs/briefs/
git mv developer-brief-restaurants.md docs/briefs/
git mv developer-brief-round3.md docs/briefs/
git mv developer-brief-round4.md docs/briefs/
git mv developer-brief-round5.md docs/briefs/
git mv developer-brief-round6.md docs/briefs/
git mv developer-brief-round7.md docs/briefs/
git mv developer-brief-round8.md docs/briefs/
git mv developer-brief-round9.md docs/briefs/
git mv developer-brief-round10.md docs/briefs/
git mv developer-brief-round11.md docs/briefs/
git mv developer-brief-round13.md docs/briefs/
git mv developer-brief-round14.md docs/briefs/
git mv developer-brief-round15.md docs/briefs/
git mv developer-notes.md docs/briefs/
git mv developer-questions.md docs/briefs/
git mv phase1-build-brief.md docs/briefs/
git mv phase1-fix-brief.md docs/briefs/
git mv phase2-team-brief.md docs/briefs/

# Move files — docs/content/
git mv copywriter-personas.md docs/content/
git mv descriptions-batch-02.md docs/content/
git mv descriptions-batch-03.md docs/content/
git mv descriptions-existing-walks.md docs/content/
git mv descriptions-isabella-plantation.md docs/content/
git mv descriptions-new-walks.md docs/content/
git mv editor-review-batch-01.md docs/content/
git mv editor-review-batch-02.md docs/content/
git mv editor-review-batch-03.md docs/content/
git mv uk-dog-breeds.md docs/content/
git mv validation-report-batch-01.md docs/content/
git mv validation-report-batch-02.md docs/content/
git mv validation-report-v2.md docs/content/
git mv validation-report.md docs/content/
git mv validator-report-batch-03.md docs/content/
git mv walks-audit.md docs/content/
git mv walks-batch-01-data.md docs/content/
git mv walks-batch-02-data.md docs/content/
git mv walks-batch-03-data.md docs/content/
git mv walks-isabella-plantation-data.md docs/content/

# Move files — docs/handoffs/
git mv session-handoff-march-18.md docs/handoffs/
git mv session-handoff-march-19.md docs/handoffs/
git mv session-handoff-march-20.md docs/handoffs/

# Move files — docs/po/
git mv community-gamification-roadmap.md docs/po/
git mv copy-review.md docs/po/
git mv owner-feedback-round2.md docs/po/
git mv phase1-signoff.md docs/po/
git mv po-action-plan-round12.md docs/po/
git mv po-action-plan-round24.md docs/po/
git mv po-action-plan.md docs/po/
git mv pre-launch-checklist.md docs/po/
git mv product-vision-update.md docs/po/

# Move files — docs/mockups/
git mv dark-mode-scheme-a.html docs/mockups/
git mv dark-mode-scheme-b.html docs/mockups/
git mv dark-mode-scheme-c.html docs/mockups/
git mv hourly-forecast-mockup.html docs/mockups/
git mv mockup-colour-a.html docs/mockups/
git mv mockup-colour-b.html docs/mockups/
git mv mockup-colour-c.html docs/mockups/
git mv mockup-colour-d.html docs/mockups/
git mv mockup-colour-e.html docs/mockups/
git mv mockup-colour-f.html docs/mockups/
git mv mockup-colour-g.html docs/mockups/
git mv mockup-colour-h.html docs/mockups/
git mv mockup.html docs/mockups/
git mv state-a-redesign-mockup.html docs/mockups/

# Move files — docs/ux-reviews/
git mv design-review-round1.md docs/ux-reviews/
git mv design-review-round2.md docs/ux-reviews/
git mv design-review-round3.md docs/ux-reviews/
git mv design-spec.md docs/ux-reviews/
git mv design-verification-round1.md docs/ux-reviews/
git mv ux-review-march-19.md docs/ux-reviews/
git mv ux-review-march-21.md docs/ux-reviews/
git mv ux-review-round11.md docs/ux-reviews/

# Move files — docs/archive/
git mv feature-recommendations.md docs/archive/
git mv "sniffout-project-brief.docx" docs/archive/

# Commit
git add .
git commit -m "sniffout-v2 - repo restructure: organise files into docs/ subfolders"
git push
```

---

## After the commit — report back

When done, provide a summary confirming:
- All folders created
- All files moved successfully
- Any files from the list that were not found (skip silently, note in summary)
- Any file path references updated in `CLAUDE.md` and `session-handoff-march-20.md`
- The git commit hash
