# Breed & Dog-Specific Hazard Personalisation — Research Report

> **Date:** 2026-03-22
> **Status:** Research and planning — Phase 3 pre-work
> **Audience:** Developer (technical sections), Owner (decisions section)
> **Scope:** No code changes. Research and planning document only.

---

## Executive Summary

- The existing weather hazard thresholds in `sniffout-v2.html` are calibrated for an average healthy adult dog. Brachycephalic breeds face heatstroke risk at temperatures **5°C lower** than the current "too hot" threshold (27°C vs 32°C) — a medically significant gap, not a minor tweak.
- Three characteristics drive the most impactful personalisation: **brachycephalic** (heat), **size** (cold), and **age** (both). The existing dog profile schema already stores `size` and `birthday`, making age calculation free. Only a `brachycephalic` characteristic needs to be added.
- A **characteristic-based flag system** is strongly preferred over a breed-name lookup table — brachycephaly is a spectrum, breed lists are incomplete, and mixed-breed dogs cannot be classified by name alone.
- Five UK-specific seasonal hazards (harvest mites, grass seeds, adder bites, blue-green algae, rock salt) are outside the current weather data scope but are feasible as static, date-triggered contextual warnings.
- Any hazard messaging must include a "consult your vet" disclaimer layer. The app must not diagnose or prescribe — it surfaces risk, not medical advice.

---

## 1. Baseline — Current Hazard Thresholds

From `detectHazards()` and related functions in `sniffout-v2.html`:

| Hazard | Trigger | Current threshold |
|--------|---------|------------------|
| Too hot | `temp > 32°C` | 32°C ambient |
| Paw warning | `temp >= 25°C` | 25°C ambient |
| Dangerous gusts | `gusts >= 60 km/h` | 60 km/h |
| Gusty | `gusts >= 45 km/h` | 45 km/h |
| Very cold | `feels < -5°C` | feels-like < -5°C |
| Freezing (paw) | `temp <= 0°C` | 0°C ambient |
| Storm avoid | weather codes 95/96/99 | — |

These are generic thresholds. The sections below document where breed, size, and age should modify them.

---

## 2. Brachycephalic (Flat-Faced) Breeds — Heat Risk

### What the evidence shows

UK VetCompass data covering **905,543 dogs** (published in *Scientific Reports*) identified brachycephalic breeds as the highest individual risk factor for heatstroke. Adjusted odds ratios vs the baseline (Labrador Retriever):

| Breed | Odds ratio |
|-------|-----------|
| Chow Chow | 17× |
| Bulldog (English) | 14× |
| French Bulldog | 6× |
| Dogue de Bordeaux | 5× |
| Greyhound | 4× |
| Cavalier King Charles Spaniel | 3× |
| Pug | 3× |

Overall: brachycephalic dogs have **approximately 2× the heatstroke odds** of the average dog in the population. The effective danger threshold for brachycephalic breeds is approximately **27°C ambient** — the app's current trigger of 32°C is too high for these dogs by ~5°C.

**Why?** Brachycephalic breeds have anatomically shortened airways, narrowed nostrils (stenotic nares), and an elongated soft palate. Panting — the primary canine heat-dissipation mechanism — is less effective because of reduced airflow. In hot or humid conditions, these dogs cannot cool themselves as fast as mesocephalic breeds.

Fatality rate for heatstroke cases in the VetCompass dataset: **14.18%** — this is not a minor risk.

### Brachycephalic breeds list (most common UK breeds)

The following breeds are commonly classified as brachycephalic by UK vets:

- Bulldog (English)
- French Bulldog
- Pug
- Boxer
- Boston Terrier
- Shih Tzu
- Cavalier King Charles Spaniel
- Pekinese (Pekingese)
- Chow Chow
- Dogue de Bordeaux
- Bull Mastiff
- King Charles Spaniel

**Important caveat:** A definitive, exhaustive list does not exist — brachycephaly is a spectrum and varies within breeds. The characteristic flag on the dog profile is more reliable than a breed-name lookup. An owner should be able to mark their dog as brachycephalic regardless of breed name.

### Proposed threshold adjustments

| Hazard | Current trigger | Brachycephalic trigger | Change |
|--------|----------------|----------------------|--------|
| Too hot | `temp > 32°C` | `temp > 27°C` | −5°C |
| Paw warning | `temp >= 25°C` | `temp >= 22°C` | −3°C |
| Walk verdict: caution | `temp > 28°C` | `temp > 24°C` | −4°C |

---

## 3. Size-Based Risk Adjustments

### Heat

Large dogs have a higher body mass relative to surface area, meaning they dissipate heat more slowly than small dogs. The VetCompass data identified **higher bodyweight relative to breed/sex mean** as a significant risk factor for heatstroke, independent of breed.

However: brachycephalic anatomy is a much stronger predictor than size alone. For heat, brachycephalic status should be the primary flag; size is secondary.

**Proposed adjustment:** No dedicated size-based heat threshold change — brachycephalic flag handles the highest-risk cases. Large dogs get the standard threshold (32°C).

### Cold

Small dogs are disproportionately sensitive to cold, particularly below 7°C:

| Temperature | Impact |
|-------------|--------|
| 0–7°C | Small breeds, short-haired dogs, and seniors may need extra protection (shorter walks, coats) |
| Below 0°C | Risk for all dogs from ice and grit; highest risk for small/short-haired breeds |
| Below −7°C | Most dogs should not be walked for extended periods |

**Proposed adjustment:** For `size: 'small'`, surface a "consider a coat for your dog" advisory at `feels < 5°C` (currently only "very cold" fires at `feels < -5°C`). This is a softer advisory, not a hard threshold change.

### Double-coated breeds and cold

Double-coated breeds (Husky, Malamute, Bernese Mountain Dog, Samoyed, etc.) tolerate cold significantly better than average and have higher heat sensitivity due to their insulating undercoat. If the dog profile is extended to capture `doubleCoat: true`, the heat thresholds could be slightly lowered for these breeds as well — though the primary brachycephalic flag is the clinical priority.

**Decision required (Owner):** Is double coat worth capturing in Phase 3, or is brachycephalic + size + age sufficient for launch?

---

## 4. Age-Based Risk Adjustments

### Deriving age from the existing schema

The dog profile stores `birthday: { day, month, year }`. Age in years can be calculated client-side at render time:

```
age = today.year − birthday.year (adjust for whether birthday has passed this year)
```

No schema change needed. Age group is a derived value.

### Senior dogs (7+ years)

Senior dogs are at higher risk in both heat and cold:

- **Heat:** Senior dogs have reduced thermoregulatory capacity and are more likely to have underlying conditions (heart disease, respiratory conditions, obesity) that compound heatstroke risk.
- **Cold:** Senior dogs have weaker immune systems and reduced internal regulation — less able to tolerate sub-zero temperatures.

**Proposed adjustments for senior dogs (age ≥ 7):**

| Hazard | Current trigger | Senior trigger | Change |
|--------|----------------|---------------|--------|
| Too hot | `temp > 32°C` | `temp > 30°C` | −2°C |
| Very cold paw | `feels < -5°C` | `feels < -2°C` | +3°C (earlier warning) |
| Small senior cold advisory | — | `feels < 7°C` | New |

### Puppies (under 6 months)

Puppies have immature thermoregulation in both directions:

- More susceptible to hypothermia in cold conditions
- Limited endurance — walk duration, not just temperature, is the relevant variable for puppies

**Proposed adjustment:** Surface a "puppy advisory" (shorter walks, watch closely) when `temp <= 2°C` for dogs with `birthday` within the last 6 months. Existing thresholds otherwise apply.

---

## 5. UK Seasonal Hazards (Non-Weather)

These hazards are not driven by real-time weather data but can be surfaced as **static date-triggered contextual warnings** based on the current calendar month.

### 5.1 Harvest Mites

- **What:** Tiny bright orange larvae (Neotrombicula autumnalis) that live in soil and long grass, climbing onto dogs to feed.
- **Season:** July–November, peak August–September.
- **Risk level:** Not life-threatening. Cause intense itching, skin inflammation, and dermatitis, particularly between the toes, on the belly, and around the muzzle.
- **At-risk environments:** Woodland paths, grassy fields, chalk and limestone areas (highest UK concentration).
- **Sniffout relevance:** Low-priority advisory for walks with `terrain: 'muddy'` or in known woodland areas during late summer/autumn.

### 5.2 Grass Seeds

- **What:** Barbed seeds (particularly from foxtail grass, *Hordeum murinum*) that penetrate skin, ear canals, and paw pads, then migrate internally.
- **Season:** April–September, peak June–August.
- **Risk level:** High — can cause abscesses, internal damage, and require surgery. Vets Now recorded an **86% increase in grass seed cases**. Can be fatal if untreated.
- **Sniffout relevance:** Medium-priority advisory for walks with `terrain: 'muddy'` or near long-grass areas from June–August. Most relevant for dogs with long or wire coats (seeds attach more easily).

### 5.3 Adder Bites

- **What:** Adders (*Vipera berus*) are the UK's only venomous snake. Active and more likely to bite in spring when emerging from hibernation (dogs disturb them).
- **Season:** March–October, peak biting risk April–June.
- **Risk level:** High — can be fatal, especially in small dogs. Requires emergency vet treatment within hours.
- **Sniffout relevance:** High-priority advisory for walks in heathland, moorland, or woodland (`terrain: 'mixed'` or `'rocky'`). Most relevant to rural walks in southern England, Wales, and Scotland. A blanket "adder season" warning April–June is reasonable.

### 5.4 Blue-Green Algae (Cyanobacteria)

- **What:** Toxic cyanobacteria blooms in still or slow-moving water (lakes, ponds, reservoirs). Appear as blue-green scum or surface film.
- **Season:** Hot weather, peak July–September, but blooms can occur from May onwards.
- **Risk level:** Potentially fatal — even small exposure to water or algae on paws can cause liver failure, seizures, and death within hours. No antidote.
- **Sniffout relevance:** High-priority. Triggered by `temp >= 20°C` during May–September for walks near open water. The **Bloomin' Algae app** (UK Environment Agency) allows public sightings — worth citing in user-facing copy.
- **Note:** Unlike other hazards, this can affect any dog regardless of breed, size, or age. It should not be gated behind a dog profile characteristic.

### 5.5 Rock Salt and Winter Grit

- **What:** Rock salt (sodium chloride and additives) applied to roads and paths in winter. Causes paw irritation and, if licked from paws in large quantities, dehydration and potential liver damage.
- **Season:** November–March.
- **Risk level:** Medium — paw irritation is common; serious ingestion is rarer but documented.
- **Sniffout relevance:** Winter-period paw advisory for any walk in an urban area or near roads. The existing `getPawSafety()` function already handles ice/grit at `temp <= 0°C`; a separate grit advisory could be added for `temp < 3°C` during November–March.

### Seasonal hazard calendar summary

| Hazard | Active months | Risk level | Trigger mechanism |
|--------|--------------|------------|------------------|
| Grass seeds | April–September | High | Date-based |
| Adder bites | March–October | High | Date-based |
| Blue-green algae | May–September | Potentially fatal | Date + `temp >= 20°C` |
| Harvest mites | July–November | Low-medium | Date-based |
| Rock salt/grit | November–March | Medium | Date + `temp < 3°C` |

---

## 6. Implementation Approach

### 6.1 Characteristic flags vs breed lookup table

**Do not build a breed-name lookup table.** Reasons:

1. There are hundreds of registered breeds plus countless crossbreeds and mixed breeds. Any lookup table will have gaps.
2. Brachycephaly varies within a breed — one French Bulldog may have severe stenotic nares; another may have had corrective surgery.
3. Mixed-breed dogs (majority of the UK dog population) cannot be classified by name.
4. Maintaining a breed database adds ongoing content burden with no clear owner.

**Recommended approach: user-declared characteristic flags on the dog profile.**

The existing `tags: []` array on the dog profile schema is the natural home for these. Proposed additions:

| Flag | Stored as | Drives |
|------|-----------|--------|
| `brachycephalic` | `tags: ['brachycephalic']` | Reduced heat thresholds |
| `double-coat` | `tags: ['double-coat']` | (Phase 3+, if pursued) |
| Senior (7+) | Derived from `birthday` | Adjusted thresholds |
| Puppy (<6 months) | Derived from `birthday` | Puppy advisory |
| Small dog cold advisory | Derived from `size: 'small'` | Cold advisory at feels < 5°C |

This means:
- No new schema fields required for brachycephalic — uses existing `tags[]`
- No new schema fields required for age — calculated from existing `birthday`
- No new schema fields required for size — already stored

### 6.2 Threshold resolution logic

When multiple characteristics apply (e.g. a small, senior, brachycephalic Pug), use the **most conservative threshold**:

```
effectiveHeatThreshold = min(
  isBrachycephalic ? 27 : 32,
  isSenior ? 30 : 32
)
// Result for small senior brachycephalic: 27°C (brachycephalic wins)
```

### 6.3 UI surface points

| Where | What | Condition |
|-------|------|-----------|
| Today tab hazard card | Breed-specific heat warning | `brachycephalic` + `temp > 27°C` |
| Today tab hazard card | Senior heat warning | `senior` + `temp > 30°C` |
| Today tab paw block | Small dog cold advisory | `size: 'small'` + `feels < 5°C` |
| Walk detail page | Seasonal hazard notice | Date-based, walk terrain type |
| Today tab | Blue-green algae alert | May–Sep + `temp >= 20°C` |
| Dog profile setup | Brachycephalic checkbox/toggle | During dog profile creation |

### 6.4 Dog profile setup — collecting the brachycephalic flag

During dog profile creation, after the breed name field (free text), display a simple toggle:

> **Flat-faced breed?** *(e.g. Bulldog, French Bulldog, Pug, Boxer, Shih Tzu)* [Yes / No]

This is preferable to a multi-select breed list because:
- It works for mixed breeds
- It puts the owner in control, not an algorithm
- It avoids the need to maintain a breed database

---

## 7. Disclaimer and Liability Considerations

### 7.1 Required disclaimer layer

All breed- and age-specific hazard messaging must include a disclaimer. Best-practice wording from established pet health platforms:

**Primary disclaimer (app-level, in settings or onboarding):**
> "Sniffout provides general weather guidance to help you plan safer walks. It is not a substitute for professional veterinary advice. Always consult your vet if you have concerns about your dog's health."

**In-hazard-card wording (contextual):**
> "Every dog is different — if in doubt, ask your vet."

**Emergency caveat:**
> "If you think your dog is in distress, contact your vet immediately."

### 7.2 What the app must not do

- Diagnose conditions
- State definitively that a dog "will" be harmed at a given temperature
- Claim breed-based thresholds are medically certified
- Recommend medication, treatment, or dosage
- Imply a patient-veterinarian relationship

### 7.3 Liability framing

Hazard cards should frame guidance as probability and precaution, not certainty:

- ✅ "Flat-faced breeds can struggle more in the heat — consider an early morning walk"
- ✅ "Your dog's breed may be more sensitive to warm weather"
- ❌ "Dangerous for your dog — do not walk"
- ❌ "Your dog will overheat at this temperature"

---

## 8. Content Pipeline Implications

### 8.1 Walk-level hazard tags

Some seasonal hazards (adder habitat, blue-green algae near water) are more relevant to specific walks than others. This creates an optional future enhancement: **walk-level hazard tags** in WALKS_DB.

Proposed optional fields (Phase 3+, PO sign-off required before adding to schema):

| Field | Type | Example |
|-------|------|---------|
| `nearWater` | boolean | `true` for reservoir/lake walks |
| `heathland` | boolean | `true` for adder-risk terrain |
| `longGrass` | boolean | `true` for grass-seed-risk routes |

These are additive to existing `terrain` and `offLead` fields. Not required at Phase 3 launch — date-based blanket warnings are sufficient for MVP personalisation.

### 8.2 User-reported hazards

The Bloomin' Algae sightings model (user-submitted, crowdsourced) is the obvious template for user-reported hazard data. This is a Phase 4+ consideration — requires Firebase backend and moderation workflow. Out of scope for Phase 3.

---

## 9. Owner Decisions Required

| # | Decision | Options | Recommendation |
|---|---------|---------|----------------|
| D1 | Add `brachycephalic` flag to dog profile? | Yes / No | **Yes** — highest-impact, lowest-effort change |
| D2 | Collect brachycephalic via toggle or breed dropdown? | Toggle (free-text) / Breed list | **Toggle** — works for all dogs including mixed breeds |
| D3 | Surface age-based adjustments? | Automatic (from birthday) / Manual senior toggle | **Automatic** — birthday already stored, no UX cost |
| D4 | Include seasonal hazards at Phase 3? | Date-based blanket / Walk-tagged / None | **Date-based blanket at Phase 3** — no schema changes needed |
| D5 | Pursue double-coat flag? | Yes / Defer | **Defer** — brachycephalic + size + age cover the most common UK cases |
| D6 | Add walk-level hazard tags (`nearWater`, `heathland`)? | Yes (100 walks) / Defer | **Defer** — date-based triggers sufficient for MVP |

---

## 10. Summary of Proposed Threshold Changes

All thresholds relative to current `sniffout-v2.html` values. **No change to baseline thresholds** — these are additive, profile-conditional adjustments only.

| Profile flag | Hazard | Current threshold | Proposed threshold | Delta |
|-------------|--------|------------------|--------------------|-------|
| `brachycephalic` | Too hot | > 32°C | > 27°C | −5°C |
| `brachycephalic` | Paw warning | ≥ 25°C | ≥ 22°C | −3°C |
| `brachycephalic` | Walk verdict caution | > 28°C | > 24°C | −4°C |
| Senior (age ≥ 7) | Too hot | > 32°C | > 30°C | −2°C |
| Senior (age ≥ 7) | Very cold | feels < −5°C | feels < −2°C | +3°C earlier |
| `size: 'small'` | Cold advisory | — | feels < 5°C | New (advisory only) |
| Puppy (< 6 months) | Cold advisory | — | temp ≤ 2°C | New (advisory only) |
| Any dog | Blue-green algae | — | temp ≥ 20°C, May–Sep | New seasonal |
| Any dog | Adder season | — | April–June | New seasonal (date only) |
| Any dog | Grass seed season | — | June–August | New seasonal (date only) |
| Any dog | Rock salt/grit | temp ≤ 0°C (existing) | temp < 3°C, Nov–Mar | Extend existing |

---

## Sources

- [Incidence and risk factors for heat-related illness (heatstroke) in UK dogs — Scientific Reports (VetCompass, 905k dogs)](https://www.nature.com/articles/s41598-020-66015-8)
- [Heat stress in domestic dogs: morphological and environmental risk factors — Frontiers in Animal Science 2025](https://www.frontiersin.org/journals/animal-science/articles/10.3389/fanim.2025.1679377/full)
- [Why Older Pets Struggle More in the Heat — Roundwood Pet Hospice UK](https://www.roundwoodpethospice.co.uk/post/why-older-pets-struggle-more-in-the-heat-and-how-to-help)
- [How Cold is Too Cold for Dogs — Vets Now UK](https://www.vets-now.com/pet-care-advice/too-cold-for-dogs/)
- [Caring for your dog during hot weather — Dogs Trust UK](https://www.dogstrust.org.uk/dog-advice/life-with-your-dog/seasonal/hot-weather)
- [Harvest mites in dogs — PDSA](https://www.pdsa.org.uk/pet-help-and-advice/pet-health-hub/conditions/harvest-mites-in-dogs)
- [Vet issues warning on outdoor autumn hazards — Dogs Today Magazine](https://dogstodaymagazine.co.uk/2024/09/23/vet-issues-warning-on-outdoor-autumn-hazards/)
- [Autumn Hazards for Pets — Burgess Pet Care](https://www.burgesspetcare.com/blog/dogs/autumn-hazards/)
- [Brachycephalic Breeds — What Is a Brachycephalic Dog Breed (MSD Veterinary Manual)](https://www.msdvetmanual.com/multimedia/table/what-is-a-brachycephalic-dog-breed)
- [Medical Disclaimer best practices — Preventive Vet](https://www.preventivevet.com/disclaimer-notice)
- [Medical Disclaimer — Our Pet's Health](https://ourpetshealth.com/medical-disclaimer)
