# Breed and Dog-Specific Hazard Personalisation — Feature Spec

**Date:** 22 March 2026
**Status:** Approved for Phase 2 implementation
**Author:** Product Owner
**Phase:** 2 continuation (client-side only, no backend required)

---

## Overview

This spec defines the breed and dog-specific hazard personalisation feature for Sniffout. It extends the existing weather hazard system to account for characteristics that meaningfully change a dog's risk profile: brachycephalic anatomy, double coat, age (senior and puppy), and size. It also introduces five UK-specific seasonal hazards as date-triggered contextual warnings.

The feature is entirely client-side. No Firebase, no backend, no GDPR dependencies.

---

## Confirmed Owner Decisions

| # | Decision | Confirmed |
|---|---------|-----------|
| D1 | Add brachycephalic flag to dog profile | YES |
| D2 | Collect via simple toggle ("Flat-faced breed?") with breed examples | YES |
| D3 | Age-based adjustments, automatic from stored birthday | YES |
| D4 | Seasonal hazards at Phase 3, date-based blanket triggers | YES |
| D5 | Double-coat flag included | YES (owner decision — overrides Researcher deferral recommendation) |
| D6 | Walk-level hazard tags (nearWater, heathland, longGrass) | DEFERRED to Phase 3+ |

---

## 1. Dog Profile Changes

### 1.1 New fields

Two new characteristic toggles are added to the dog profile. Both are stored in the existing `tags[]` array — no new schema keys are required.

#### Flat-faced breed toggle

| Property | Value |
|----------|-------|
| Label | Flat-faced breed? |
| Helper text | (e.g. Bulldog, French Bulldog, Pug, Boxer, Shih Tzu, Cavalier) |
| Position | After the breed field, before the size field |
| Input type | Yes / No toggle (default: No) |
| Stored as | Tag string `'brachycephalic'` in `tags[]` |
| On YES | `tags` array includes `'brachycephalic'` |
| On NO | `'brachycephalic'` is absent from `tags[]` |

#### Double-coated breed toggle

| Property | Value |
|----------|-------|
| Label | Double-coated breed? |
| Helper text | (e.g. Husky, Malamute, Samoyed, Bernese, Golden Retriever) |
| Position | After the flat-faced toggle, before the size field |
| Input type | Yes / No toggle (default: No) |
| Stored as | Tag string `'double-coat'` in `tags[]` |
| On YES | `tags` array includes `'double-coat'` |
| On NO | `'double-coat'` is absent from `tags[]` |

### 1.2 Updated dog profile schema

No new top-level fields. The `tags[]` array absorbs both new characteristics. Updated schema for reference:

```js
// sniffout_dogs (see Implementation Notes — Section 7 for key clarification)
{
  name: "Biscuit",
  breed: "French Bulldog",             // optional, null if unset
  size: "small",                        // "small" | "medium" | "large" | null
  tags: ["brachycephalic"],             // includes 'brachycephalic' and/or 'double-coat'
  birthday: { month: 8, year: 2021 },  // optional, null if unset
  photoUrl: null                        // Phase 3
}
```

### 1.3 UI placement — Edit Dog Profile sheet

The "Edit dog profile" bottom sheet (gear icon → Your dog → Edit) gains two new rows between the Breed field and the Size segmented control:

```
Breed (optional)
[French Bulldog       ]

Flat-faced breed?
(e.g. Bulldog, French Bulldog, Pug, Boxer, Shih Tzu, Cavalier)
[No]  [Yes]

Double-coated breed?
(e.g. Husky, Malamute, Samoyed, Bernese, Golden Retriever)
[No]  [Yes]

Size
[Small ✓] [Medium] [Large]
```

Both toggles work for mixed breeds. The owner decides — there is no breed-name lookup.

Both toggles default to No on profile creation. On profile load, the toggle state reflects whether the tag exists in `tags[]`.

---

## 2. Hazard Threshold Logic

### 2.1 Baseline thresholds (unchanged)

These are the current thresholds in `detectHazards()` and `getPawSafety()`. They apply to all dogs with no matching characteristics.

| Hazard | Current trigger |
|--------|----------------|
| Too hot | `temp > 32°C` |
| Paw warning | `temp >= 25°C` |
| Walk verdict caution | `temp > 28°C` |
| Very cold | `feelsLike < -5°C` |
| Freezing paw | `temp <= 0°C` |
| Dangerous gusts | `gusts >= 60 km/h` |
| Gusty | `gusts >= 45 km/h` |
| Storm avoid | weather codes 95, 96, 99 |

### 2.2 Characteristic-specific threshold adjustments

All adjustments are additive and profile-conditional. Baseline thresholds are not changed.

| Profile characteristic | Hazard | Standard threshold | Adjusted threshold | Delta |
|-----------------------|--------|-------------------|--------------------|-------|
| `brachycephalic` tag | Too hot | `> 32°C` | `> 27°C` | −5°C |
| `brachycephalic` tag | Paw warning | `>= 25°C` | `>= 22°C` | −3°C |
| `brachycephalic` tag | Walk verdict caution | `> 28°C` | `> 24°C` | −4°C |
| `double-coat` tag | Too hot | `> 32°C` | `> 30°C` | −2°C |
| `double-coat` tag | Cold advisory | No threshold | `feelsLike < 0°C` | New (advisory only) |
| Senior (`age >= 7`) | Too hot | `> 32°C` | `> 30°C` | −2°C |
| Senior (`age >= 7`) | Very cold | `feelsLike < −5°C` | `feelsLike < −2°C` | +3°C (earlier warning) |
| `size: 'small'` | Cold advisory | No threshold | `feelsLike < 5°C` | New (advisory only) |
| Puppy (`age < 6 months`) | Cold advisory | No threshold | `temp <= 2°C` | New (advisory only) |

**Note on double-coat heat threshold:** The research establishes that double-coated breeds are more heat-sensitive than the standard dog due to their insulating undercoat. The −2°C delta (matching the senior delta) is the proposed starting value. This should be reviewed against user feedback post-launch. It is the most conservative reasonable value that does not conflict with the brachycephalic threshold.

**Note on double-coat cold advisory:** Double-coated breeds tolerate cold significantly better than average. The advisory at `feelsLike < 0°C` is a reassurance note ("Your dog's coat handles the cold well — just watch for ice on paws") rather than a warning.

### 2.3 Age derivation

Age is calculated from the existing `birthday: { month, year }` field. No day is stored — precision is to the birth month.

```
ageInMonths = (currentYear − birthday.year) × 12 + (currentMonth − birthday.month)
ageInYears  = ageInMonths / 12

isSenior  = ageInYears >= 7
isPuppy   = ageInMonths < 6
```

If `birthday` is null, no age-based adjustments are applied. Age characteristics are derived — they are never stored in `tags[]`.

### 2.4 Multi-characteristic resolution — most conservative wins

When a dog has multiple matching characteristics, apply the most conservative (lowest heat threshold, highest cold threshold) across all applicable adjustments.

```
effectiveHeatThreshold = min(
  tags.includes('brachycephalic') ? 27 : 32,
  tags.includes('double-coat')    ? 30 : 32,
  isSenior                        ? 30 : 32
)

effectiveColdThreshold = max(
  isSenior          ? -2 : -5,  // feelsLike
  size === 'small'  ?  5 : -5,  // feelsLike (advisory only)
  isPuppy           ?  2 : -5   // temp (advisory only)
)
```

**Example:** Small, senior, brachycephalic French Bulldog.
- Heat: min(27, 32, 30) = 27°C. Brachycephalic wins.
- Cold advisory: max(−2, 5, −5). Small dog wins at feelsLike < 5°C.

The hazard card copy should reflect the most specific applicable reason (brachycephalic takes precedence in copy over senior for heat warnings, since it is the stronger signal).

### 2.5 Advisory vs threshold change

Some adjustments are advisory notes surfaced in the paw safety block or as a secondary card — they do not change the primary hazard verdict. Specifically:

- Small dog cold advisory (`feelsLike < 5°C`) — advisory note only
- Puppy cold advisory (`temp <= 2°C`) — advisory note only
- Double-coat cold (`feelsLike < 0°C`) — reassurance note only

These do not trigger an "avoid walking" verdict. They are informational, not restrictive.

---

## 3. Seasonal Hazards

All seasonal hazards are date-based. No API calls. No WALKS_DB schema changes at Phase 3. Blanket warnings apply to all users regardless of dog profile, except where noted.

### 3.1 Trigger conditions

| Hazard | Active months | Additional trigger | Severity |
|--------|--------------|-------------------|----------|
| Blue-green algae | May–September | `temp >= 20°C` | Critical |
| Adder season | April–June | Date only | High |
| Grass seeds | June–August | Date only | High |
| Harvest mites | August–October | Date only | Low-medium |
| Rock salt / grit | November–March | `temp < 3°C` | Medium |

### 3.2 Hazard detail

**Blue-green algae**
- Trigger: `currentMonth` is May–September AND `currentTemp >= 20°C`
- Message direction: Water is dangerous right now. Toxic blooms look like blue-green paint or scum on the surface. Keep dogs out of still or slow-moving water. Even paw contact can be dangerous. No antidote — if your dog has been in water and seems unwell, contact your vet immediately.
- Severity: Critical — potentially fatal. No breed, age, or size gate. Applies to all dogs.
- Applies to: Today tab hazard card, paw safety block when near any water

**Adder season**
- Trigger: `currentMonth` is April–June
- Message direction: Adders are active. The UK's only venomous snake comes out in spring. Give long grass, heathland, and sunny banks a wide berth. If your dog is bitten, keep them calm and get to a vet fast.
- Severity: High
- Applies to: Today tab hazard card (seasonal)

**Grass seeds**
- Trigger: `currentMonth` is June–August
- Message direction: Grass seed season. Barbed seeds can burrow into paws, ears, and skin and cause serious problems. Check your dog over after every walk in long grass — especially between the toes.
- Severity: High
- Applies to: Today tab hazard card (seasonal)

**Harvest mites**
- Trigger: `currentMonth` is August–October
- Message direction: Harvest mites are about. Tiny orange larvae in soil and grass that cause intense itching, especially around the paws and belly. Check after walks and rinse paws if needed.
- Severity: Low-medium
- Applies to: Today tab hazard card (seasonal, lower priority than grass seeds or adder)

**Rock salt / grit**
- Trigger: `currentMonth` is November–March AND `currentTemp < 3°C`
- Message direction: Grit on paths can irritate paws. Rinse your dog's paws when you get home, and watch they are not licking them — large amounts can upset their stomach.
- Severity: Medium
- Applies to: Paw safety block (extends existing freezing paw logic)
- Note: The existing `getPawSafety()` function already fires at `temp <= 0°C` for ice/grit. This extends the trigger to `temp < 3°C` during November–March with a softer message than the existing freezing paw warning.

---

## 4. UI Surface Points

### 4.1 Where hazard types appear

| Hazard | Surface | Condition |
|--------|---------|-----------|
| Brachycephalic heat | Today tab hazard card | `brachycephalic` tag present + `temp > 27°C` |
| Double-coat heat | Today tab hazard card | `double-coat` tag present + `temp > 30°C` |
| Senior heat | Today tab hazard card | `isSenior` + `temp > 30°C` |
| Senior cold | Today tab hazard card | `isSenior` + `feelsLike < -2°C` |
| Small dog cold advisory | Paw safety block | `size: 'small'` + `feelsLike < 5°C` |
| Puppy cold advisory | Paw safety block | `isPuppy` + `temp <= 2°C` |
| Double-coat cold note | Paw safety block | `double-coat` tag + `feelsLike < 0°C` |
| Blue-green algae | Today tab hazard card | May–Sep + `temp >= 20°C` |
| Adder season | Today tab hazard card | April–June (date only) |
| Grass seeds | Today tab hazard card | June–August (date only) |
| Harvest mites | Today tab hazard card | August–October (date only) |
| Rock salt / grit | Paw safety block | Nov–Mar + `temp < 3°C` |

### 4.2 Priority ordering

When multiple hazard cards are shown, breed/age cards appear above seasonal hazard cards. Blue-green algae (critical) always appears above other seasonal hazards. Existing hazard ordering for heat/wind/storm is unchanged.

### 4.3 No new UI components required at Phase 3

All new hazard types use the existing hazard card component on the Today tab and the existing paw safety block. No new card types, no new modals. The breed/age information is threaded into existing copy strings — it does not create visually separate "breed-specific" sections.

If the user has no dog profile set, no breed or age personalisation cards appear. The seasonal hazard cards (blue-green algae, adder season, grass seeds, harvest mites, rock salt) appear for all users regardless of dog profile.

### 4.4 Disclaimer wording

The following disclaimer wording is approved (sourced from Section 7 of the research report) and must be present in the implementation:

**App-level disclaimer** (Settings sheet, near health/hazard content):
> "Sniffout provides general weather guidance to help you plan safer walks. It is not a substitute for professional veterinary advice. Always consult your vet if you have concerns about your dog's health."

**In-card contextual disclaimer** (appended to all breed/age hazard cards):
> "Every dog is different — if in doubt, ask your vet."

**Emergency caveat** (for critical severity cards — blue-green algae):
> "If you think your dog is in distress, contact your vet immediately."

---

## 5. Messaging Copy Direction

The following is direction for the Copywriter. These are not final approved strings. Tone must be warm, direct, dog-owner to dog-owner. No em dashes. No medical jargon. No absolute statements.

### Brachycephalic heat (temp > 27°C)

Direction: Lead with the dog's name if available. Acknowledge it is warm for flat-faced breeds specifically. Frame as precaution, not prohibition. Suggest early morning or evening timing. Do not say the dog "will" overheat — say they "can struggle" or "find it harder" in the heat.

Example direction: "[Dog's name] is a flat-faced breed, which means [they / your dog] can find warm weather harder going. Today might be a day for an early morning walk before it heats up."

### Double-coat heat (temp > 30°C)

Direction: Note that double coats are great insulation in both directions. Warm weather means the coat holds heat in. Suggest shade and water. Short on urgency — this is a caution, not a danger card.

Example direction: "[Dog's name]'s double coat keeps them warm in winter, but it works both ways. Keep walks cool and short today, and make sure there is water available."

### Senior heat (age >= 7, temp > 30°C)

Direction: Gentle. Not alarming. Acknowledge that older dogs feel the heat more and may not show it obviously. Suggest shorter walks and watching for signs.

Example direction: "Older dogs can feel the heat more than younger ones, and may not always show it. Keep today's walk short and in the shade where you can."

### Senior cold (age >= 7, feelsLike < -2°C)

Direction: Frame as extra care needed, not danger. Shorter walks, watch for stiffness.

Example direction: "Cold weather is harder on older dogs. A shorter walk today might be the right call, and watch for any stiffness once you get back inside."

### Small dog cold advisory (feelsLike < 5°C)

Direction: Light, practical. Not alarming. A coat is a good idea. No urgency.

Example direction: "Small dogs feel the cold more. If [Dog's name] does not have much of a coat, today might be a good day to layer up."

### Puppy cold advisory (temp <= 2°C)

Direction: Warm and reassuring. Short walks. Watch closely. Not a warning — it is practical guidance.

Example direction: "Young dogs are still getting used to cold weather. Keep today's walk short and check [Dog's name] is not shivering."

### Blue-green algae (May-Sep, temp >= 20°C)

Direction: Clear and serious without being alarming. Action-focused. Keep dogs out of still water. If contact, watch closely. Get to vet fast if unwell.

Example direction: "Hot weather brings the risk of toxic algae blooms in still water. If water looks blue-green or murky, keep [Dog's name] out. If they do get in and seem unwell afterwards, call your vet straight away."

### Adder season (April-June)

Direction: Factual and practical. Most dogs and people never encounter an adder. The risk is real but avoidable.

Example direction: "Adders are out in spring and are more likely to bite if disturbed. Stick to clear paths and give long grass, heathland, and sunny banks some space."

### Grass seeds (June-August)

Direction: Routine but important check. Make it feel like a simple habit, not a scary risk.

Example direction: "Grass seed season. After walks in long grass, check [Dog's name]'s paws, ears, and coat for seeds. They are small but can cause big problems if they burrow in."

### Harvest mites (August-October)

Direction: Light tone. Itchy nuisance more than serious danger. Check after walks.

Example direction: "Harvest mite season. Tiny orange larvae in long grass can make dogs very itchy, especially around the paws and belly. A quick paw rinse after walks helps."

### Rock salt / grit (Nov-Mar, temp < 3°C)

Direction: Practical paw care reminder. Rinse paws. Watch for licking.

Example direction: "Paths may have grit and rock salt down today. Rinse [Dog's name]'s paws when you get home and check they are not licking them."

---

## 6. What This Feature Does Not Do

### Hard boundaries

- **Does not diagnose.** The app surfaces risk probability and precautions, not medical assessments.
- **Does not replace veterinary advice.** Every hazard card for breed/age characteristics includes the in-card disclaimer. The app-level disclaimer is in Settings.
- **Does not use breed-name lookup.** There is no breed database. Characteristics are set by the owner via toggles. The owner's declaration is the input — not an algorithm matching a breed name.
- **Does not make absolute statements.** The app never states a dog "will" be harmed, "must not" be walked, or "cannot tolerate" a temperature. All messaging uses probability framing (may, can, might, could).
- **Does not claim medical certification.** Threshold values are based on published veterinary research and are presented as general guidance, not certified standards.
- **Walk-level hazard tags are deferred.** `nearWater`, `heathland`, and `longGrass` fields in WALKS_DB are not being added at Phase 3. Seasonal hazard warnings are blanket (all walks), not walk-specific. This is D6 confirmed.
- **No breed-specific filtering.** This feature does not change how walks are filtered or sorted based on dog characteristics. That is a separate Phase 2/3 feature.

---

## 7. Implementation Notes for Developer

### 7.1 Storage

No new localStorage keys are needed. All new data fits within the existing dog profile:

- `'brachycephalic'` tag stored in existing `tags[]` array
- `'double-coat'` tag stored in existing `tags[]` array
- Age (senior, puppy) is derived at runtime from existing `birthday.month` and `birthday.year`
- Size-based cold advisory uses existing `size` field

**Key name clarification:** CLAUDE.md references `sniffout_dogs` (plural array, multiple dogs supported). The `dog-profile-spec.md` uses `sniffout_dog` (singular). Verify which key is active in the current `sniffout-v2.html` implementation and use that key. The spec logic applies to whichever structure is in use — the characteristic tags and birthday field are present in both schemas.

### 7.2 No Firebase dependency

All logic is client-side. Seasonal hazard triggers are date calculations using `new Date()`. No API calls. No Firebase reads or writes.

### 7.3 Functions to modify

All threshold and hazard logic lives in `detectHazards()` and `getPawSafety()`. Breed and age personalisation must be added to these functions only. Do not scatter threshold logic elsewhere.

Suggested approach:

```
// At the top of detectHazards() and getPawSafety():
var dog              = getDog();
var tags             = dog ? (dog.tags || []) : [];
var isBrachy         = tags.includes('brachycephalic');
var isDoubleCoat     = tags.includes('double-coat');
var dogSize          = dog ? dog.size : null;
var dogBirthday      = dog ? dog.birthday : null;

// Derive age characteristics
var isSenior  = false;
var isPuppy   = false;
if (dogBirthday) {
  var now          = new Date();
  var ageMonths    = (now.getFullYear() - dogBirthday.year) * 12
                     + (now.getMonth() + 1 - dogBirthday.month);
  isSenior = ageMonths >= 84;   // 7 years * 12
  isPuppy  = ageMonths < 6;
}

// Resolve thresholds
var heatThreshold = Math.min(
  isBrachy      ? 27 : 32,
  isDoubleCoat  ? 30 : 32,
  isSenior      ? 30 : 32
);
var coldThreshold = -5;  // feelsLike, used for "very cold" card
if (isSenior) coldThreshold = Math.max(coldThreshold, -2);
```

### 7.4 Seasonal hazard helper

A single helper function checks all seasonal hazard triggers. Call it from `detectHazards()`:

```
// Returns array of active seasonal hazard keys
function getSeasonalHazards(currentTemp) {
  var month    = new Date().getMonth() + 1;  // 1-indexed
  var hazards  = [];

  if (month >= 5 && month <= 9 && currentTemp >= 20)  hazards.push('algae');
  if (month >= 4 && month <= 6)                        hazards.push('adder');
  if (month >= 6 && month <= 8)                        hazards.push('grassseeds');
  if (month >= 8 && month <= 10)                       hazards.push('harvestmites');
  if (month >= 11 || month <= 3)                       hazards.push('rocksalt');
  // Rock salt also requires temp check — filter in caller
  return hazards;
}
```

Rock salt requires both the month condition and `temp < 3°C`. Apply the temp check in `detectHazards()` after calling `getSeasonalHazards()`.

### 7.5 All JS in single script block

Per the 22 March working guideline: all new functions must go in the single `<script>` block. Do not add a second script block.

### 7.6 No changes to WALKS_DB

Walk-level tags (`nearWater`, `heathland`, `longGrass`) are deferred (D6). Do not add fields to WALKS_DB schema without PO sign-off.

### 7.7 `renderWeather()` must never touch `body.night`

This constraint is unrelated to this feature but bears repeating: `renderWeather()` must not manipulate `body.night` for any reason, including any new weather data fields introduced in this feature.

---

## 8. Open Items

| Item | Owner | Status |
|------|-------|--------|
| Double-coat heat threshold value (−2°C proposed, matches senior delta) | PO / Owner | Proposed — confirm before implementation |
| Final copy for all hazard card strings | Copywriter | To be commissioned |
| App-level disclaimer placement (Settings sheet — exact position) | Developer / PO | To confirm in implementation round |

---

## Sources

This spec is based on `docs/research/breed-hazard-research.md` (22 March 2026). Primary sources in the research report:

- VetCompass heatstroke study, Scientific Reports (905,543 dogs)
- Vets Now UK — cold temperature guidance
- Dogs Trust UK — hot weather guidance
- PDSA — harvest mites
- Preventive Vet / Our Pet's Health — disclaimer best practices
