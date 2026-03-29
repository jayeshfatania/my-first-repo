# Sniffout - Hazard Content Spec
**Version:** 1.0
**Date:** 28 March 2026
**Status:** Locked - changes require PO sign-off

---

## Purpose

This document defines how hazard content works across all Sniffout surfaces. It exists so that any agent, developer, or contributor understands what hazard content is, where it appears, what it must never do, and why.

---

## Core Principle

Sniffout hazard content is informative, not alarmist. It helps dog owners make confident decisions - it does not warn them away from walks or create anxiety. The tone is always that of a knowledgeable friend giving a quiet, practical heads-up. The user is treated as a sensible adult who loves their dog.

Full tone guidance: docs/specs/hazard-content-tone-guide.md

---

## Surface Breakdown

### Surface 1 - Today tab hazard cards

Weather-driven hazards only. These are conditions that affect whether and how to walk today.

Approved hazards:
- Heat (various thresholds by breed)
- Cold (various thresholds by breed/age)
- Wind and storm
- Paw safety (heat and frost)
- Blue-green algae (May-September, temp gated at 20 degrees C)
- Adders (April-June)
- Grass seeds (June-August)
- Harvest mites (August-October)
- Rock salt (November-March, temp gated at 3 degrees C)

Rule: Do not add new hazards to this surface without PO sign-off. The Today tab must never feel overwhelming. If a user sees more than 2-3 hazard cards at once the experience has failed.

---

### Surface 2 - Walk card hazard pills

Small informative pills on individual walk cards and walk detail pages. Terrain and season gated. These tell users something specific about this walk, not about today's weather.

Approved pills:

| Pill | Condition | Season |
|------|-----------|--------|
| Livestock | walk.livestock === true | Year-round |
| Ticks | walk.terrain includes woodland or heathland | March-October |
| Blue-green algae | walk passes near still or slow water | May-September, temp gated |
| Adders | walk.terrain includes heathland or moorland | April-June |

Rules:
- Maximum 3-4 pills per walk. Most walks show none.
- Pills are informative only. They must never imply a walk is unsafe or should be avoided.
- Pill copy must be neutral and factual. No alarm language.
- Do not add new pills without PO sign-off.

Implementation note: Tick and adder pills require terrain tagging in WALKS_DB. Blue-green algae requires water proximity tagging. This work has not yet been scoped. Do not implement without a separate PO brief.

---

### Surface 3 - Companion website articles

Hazard guide articles on sniffout.co.uk. These exist primarily to capture high search volume UK dog health queries and drive organic traffic to the site. They convert search visitors to PWA installs.

Approved articles:

| Article | URL slug | Priority |
|---------|----------|----------|
| Ticks | /guides/ticks-dogs-uk | High |
| Heatstroke and hot weather walking | /guides/heatstroke-dogs-hot-weather-walking | High |
| Alabama rot | /guides/alabama-rot-dogs-uk | High |
| Blue-green algae | /guides/blue-green-algae-dogs-uk | Medium |
| Cattle and dog walkers | /guides/walking-dog-near-cattle-uk | Medium |
| Antifreeze | /guides/antifreeze-dogs-uk | Medium |

Rules:
- Antifreeze and cattle are website articles only. They do not appear in the app in any form.
- Article tone follows the same hazard content tone guide as app copy - warm, honest, practical, never alarmist.
- Alabama rot must always contextualise the rarity (334 confirmed cases over 12 years). Do not amplify fear.
- Articles must be written by a Copywriter persona and fact checked before publication.

---

## What Never to Do

- Never add hazard content to the Today tab without PO sign-off
- Never show more than 3-4 hazard pills on a single walk card
- Never use alarm language, statistics, or medical terminology in short-form hazard copy
- Never imply a specific walk is dangerous or should be avoided
- Never implement antifreeze or cattle hazards in the app in any form
- Never add a new hazard surface (e.g. Weather tab pills, walk list banners) without a PO spec

---

## Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 28 March 2026 | 6 new hazard alerts added to Today tab then reverted | Today tab became overwhelming. Seasonal hazards belong on walk cards not Today tab. |
| 28 March 2026 | Antifreeze and cattle moved to website articles only | Not terrain-specific enough for walk pills. Better as SEO content. |
| 28 March 2026 | Walk card pills limited to 4 approved hazards | Restraint principle - informative not alarmist. Most walks show none. |
| 28 March 2026 | Hazard pills require terrain tagging in WALKS_DB | Current schema does not support water proximity or terrain sub-types needed for tick/algae/adder pills. Scoping deferred. |

---

*Spec written: 28 March 2026*
*Next review: before walk card hazard pills are implemented*
