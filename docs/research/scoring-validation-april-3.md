# Sniffout Walk Quality Scoring - Source Validation Report
**Date:** 3 April 2026
**Role:** Researcher
**Purpose:** Validate existing scoring thresholds against additional UK authoritative sources before launch

---

## 1. Executive Summary

Overall verdict: **THRESHOLDS BROADLY CONFIRMED WITH TWO MATERIAL FLAGS**

The core heat, cold, rain, and paw burn thresholds are supported by the additional sources reviewed. The plurality of UK animal welfare organisations, insurers, and veterinary consumer guidance converge on 20C as a caution onset, 25C as an escalating danger point, and the cold bands from Vets Now are reproduced across multiple secondary UK sources.

Two material flags identified:

**Flag 1 - Beaufort 7 woodland threshold is more conservative than official policy.** The National Trust's formal woodland closure policy begins at Beaufort 8 (40 mph / 64 km/h), not Beaufort 7 (31-38 mph / 50-61 km/h). The current spec cites forest school policy as the source; the app should not claim this matches official land manager guidance. The Beaufort 7 flag is appropriate as precautionary consumer advice but must not be described as matching official thresholds.

**Flag 2 - Brachycephalic -4C offset has no single citable primary source.** The concept is well-evidenced (brachycephalic dogs are at risk at materially lower temperatures than other dogs) but no UK veterinary or welfare organisation has published a specific degree offset. The -4C value is a modelled estimate and must be described as such in the methodology page.

No source was found that says the Sniffout thresholds are too strict or too lenient in a way that would require a structural change. The 22C penalty start for general dogs is consistent with available evidence.

---

## 2. Source-by-Source Findings

### BVA (British Veterinary Association)
**Pages reviewed:** bva.co.uk/pet-owners-and-breeders/caring-for-animals-in-hot-weather/ and three news articles

**Does BVA publish specific degree thresholds for dog walking?** No. All BVA guidance uses qualitative language: "don't exercise in the hottest part of the day," "walk in early morning or late evening," "if in doubt, don't go out." No specific temperature values appear on the hot weather guidance page.

**Useful data points from BVA:**
- 38% of small animal vets had treated dogs for heatstroke after being walked on a hot day (vs. 9% from hot cars) - framed as a "silent killer" category by BVA
- Five-fold increase in heatstroke cases recorded during heat-health alert periods in 2022
- One in four affected dogs died
- High-risk groups identified: older dogs, overweight dogs, flat-faced breeds, dogs with heart or lung problems - but no temperature offset stated for these groups

**Verdict for thresholds:** NEUTRAL. BVA does not confirm or contradict specific values. The "walks more dangerous than hot cars" framing is consistent with the scoring philosophy.

---

### BSAVA (British Small Animal Veterinary Association)
**Pages reviewed:** BSAVA position statements, BSAVA Library

**Does BSAVA publish clinical thresholds?** No. BSAVA has 22 published position statements (on topics from TB to neutering) and hot weather exercise is absent from all of them. The BSAVA Library references heatstroke in clinical materials but no accessible content surfaces ambient temperature thresholds.

The HotDogs research (RVC / Nottingham Trent) was presented at BSAVA Congress 2020 and 2021 but this is research presentation, not an official BSAVA position.

**Verdict:** NEUTRAL. BSAVA has not published on this topic. This is a notable gap in the UK veterinary professional body landscape - the primary small animal vet organisation has no guidance owners or developers can cite.

---

### Kennel Club (now Royal Kennel Club)
**Pages reviewed:** royalkennelclub.com/walking-your-dog-on-warm-days/, /hot-pavements/, /heatstroke

**Key findings:**
- States: "Most dogs are comfortable at temperatures between 15-25C" - the only specific temperature range on the walking guidance page
- The heatstroke page explicitly states: "since some dogs are less able to cool themselves down it's difficult to say which temperatures are safe" - declines to set a threshold
- No specific avoidance temperature (20C, 22C, 25C) is stated for walking
- Brachycephalic breeds identified as higher risk but no temperature offset stated
- Hot pavements page: uses the seven-second hand test only, no temperature values

**Verdict:** ADDS NUANCE. The Kennel Club confirms 25C as the upper end of general comfort and explicitly refuses to set a single threshold due to individual variation. The 15-25C comfort statement is about rest conditions, not exercise. Brachycephalic breeds are explicitly excluded from the general comfort statement. No contradiction to any Sniffout threshold.

---

### Scottish SPCA
**Page reviewed:** scottishspca.org/advice/dogs/dog-care-in-summer/

**Key findings:**
- States: "you can walk your dog at any temperature below 20C" - direct threshold statement
- States: "Most dogs will be comfortable walking between 15C and 25C"
- Identifies brachycephalic breeds, dogs over 8 years, and dogs under 6 months as higher risk
- Uses a five-second tarmac test, no specific pavement temperature values

**Verdict:** CONFIRMS 20C as the caution onset. This directly validates Sniffout's "no penalty below 20C for general dogs" tier. The 15-25C comfort range echoes the Kennel Club.

---

### Agria Pet Insurance (UK)
**Page reviewed:** agriapet.co.uk/guides-and-advice/when-is-it-too-hot-to-walk-your-dog/

**Key findings:**
- States: "walking your dog at any temperature over 20C should be avoided, especially long or energetic walks"
- States: "Any temperature over 25C is a very definite NO"
- Higher-risk groups: overweight, brachycephalic, heavy/matted coat, older, puppies
- No citation given for either threshold

Agria's guidance is more conservative than the Sniffout scoring: they recommend avoiding walks above 20C generally, while Sniffout only applies a general penalty from 22C. However, Agria's 20C avoidance covers long and energetic walks - their guidance does not say short, calm walks are unsafe above 20C.

**Verdict:** CONFIRMS 20C as a caution threshold and 25C as a hard limit. Consistent with the Sniffout structure. The "long or energetic walks" qualifier in the 20C guidance reduces the apparent tension with Sniffout's 22C general penalty start.

---

### Guide Dogs UK
**Page reviewed:** guidedogs.org.uk/getting-support/information-and-advice/dog-care-and-welfare/hot-weather/

**Key findings:**
- States: "Temperatures over just 20 degrees Celsius can start to have an impact on your dog"
- States: "when the mercury reaches 25 degrees, greater care should be taken"

**Verdict:** CONFIRMS 20C onset and 25C escalation. Consistent with Sniffout structure.

---

### Pedigree UK
**Page reviewed:** uk.pedigree.com/dog-advice/caring-for-your-dog/walking-dogs-in-hot-weather

**Key findings:**
- States: "It is generally safe to walk your dog in temperatures up to 18C"
- States: "Temperatures above 20C can quickly become too hot to walk a dog"
- States: "22C may be too hot to walk some dogs" - specifically names flat-faced, young, elderly, obese, thick-coated dogs
- States dogs can sometimes handle "up to 23C or more with water and shade" - acknowledges a graduated zone

**Verdict:** CONFIRMS. Pedigree UK is the closest UK consumer source found to explicitly validating 22C as a material threshold for vulnerable dogs. This directly supports Sniffout's 20-22C "flag for brachycephalic/elderly" tier.

---

### Vets Now (cold and paw burn - additional validation)
**Pages reviewed:** vets-now.com pavement heat article, vets-now.com too cold for dogs

**Paw burn confirmed:** At 25C air temperature, asphalt reaches 52C. Skin destruction can occur in under 60 seconds at 52C. At 31C air, asphalt reaches 62C. The specific 25C / 52C correlation is also cited by FOUR PAWS International (secondary source reference).

**Cold tiers confirmed:** 7C = fine for most dogs. 1-7C = small dogs, puppies, thin coats may need a coat. 1C to -4C = potentially unsafe for short-haired, small, elderly dogs. -4C to -9C = potentially life-threatening for smaller dogs especially if wet.

**Verdict:** Primary source confirmed on both topics. Consistent with spec.

---

### Animal Friends Insurance / NARPS UK (cold validation)
**Pages reviewed:** animalfriends.co.uk cold walks, narpsuk.co.uk safe walking temperatures

**Animal Friends cold thresholds:**
- 5C: "cold-averse dogs may start to struggle"
- 0C: small, slim, elderly dogs may struggle
- -4C: "walking should be skipped"

**NARPS UK cold thresholds:**
- Below 0C: usually too cold
- 0-5C: short walks only
- 5C: some breeds will not do well

**Verdict:** CONFIRMS cold tiers across multiple sources. The Sniffout 5-7C flag for small/short-coat, 0-5C general penalty, and below 0C escalation all align with Animal Friends and NARPS UK independently of Vets Now.

---

### Nottingham Trent University / RVC Research
**Sources reviewed:** PMC9144152 (VetCompass fatal HRI), PMC7459873 (exercise-triggered HRI), NTU news release

**Key data confirmed:**
- Median maximum daily WBGT (Wet Bulb Globe Temperature) on HRI event days: 16.9C
- Range across all HRI events: 3.3C to 23.1C
- The 16.9C figure is WBGT, not standard air temperature. WBGT incorporates humidity, wind, and solar radiation, making it systematically lower than dry-bulb air temperature. A UK summer day with a WBGT of 16.9C likely corresponds to an air temperature in the 20-25C range depending on conditions.
- The 3.3C minimum case involved a dog exercised intensely in winter conditions
- Exercise triggered approximately 74-75% of all heatstroke cases; walking specifically triggered 68% of those
- Brachycephalic dogs had three times the odds of a fatal outcome compared to mesocephalic dogs (PMC9144152)
- A Bulldog developed hyperthermia at 21C ambient room temperature while standing still (PMC7459873)

**On the 16.9C WBGT vs 22C air temperature penalty start:**

The 16.9C figure is a median, meaning half of all recorded HRI events occurred below that temperature and half above. The WBGT-to-air-temperature conversion means this does not directly contradict a 22C air temperature penalty start. The 3.3C minimum case and the general spread of HRI events across all temperature ranges support the interpretation that exercise risk is present year-round for vulnerable dogs, which is why Sniffout flags brachycephalic/elderly dogs from 20C rather than from 22C.

**The Bulldog at 21C standing still** is the single most significant new data point for brachycephalic scoring. This provides direct evidence that BOAS dogs can overheat in still air below 22C without exercise - supporting the decision to flag brachycephalic breeds from 20C.

**Verdict:** ADDS NUANCE. Does not contradict the 22C general penalty start. Strongly supports the 20C brachycephalic flag. The WBGT-vs-air-temperature distinction is important - the methodology page should clarify that the 16.9C VetCompass median is a WBGT figure, not comparable to air temperature readings.

---

### National Trust / Forestry England (wind)
**Pages reviewed:** nationaltrust.org.uk/visit/norfolk/oxburgh-estate/high-wind-policy, forestryengland.uk/safety-the-forest

**National Trust formal woodland closure policy (Oxburgh Estate - ancient woodland with veteran trees):**
- Wind gusts of 40 mph (64 km/h): parkland and woodland closes; buildings remain open. This is Beaufort 8 (Gale).
- Wind gusts of 45 mph (72 km/h): full site closure. This is Beaufort 9 (Strong Gale).

**Forestry England:** States closures occur "due to exceptional weather" but no specific wind speed threshold is published in accessible content.

**Beaufort Force 7 = 50-61 km/h (31-38 mph):** This falls below the National Trust's formal Beaufort 8 (64 km/h) closure threshold for ancient woodland. Sniffout's Beaufort 7 flag is therefore more conservative than the most specific official policy found.

**Mountaineering Scotland context:** 30-40 mph starts to affect adult balance; 50-60 mph is "very challenging."

**Verdict:** PARTIAL CONFIRMATION with a gap. The concept of a wind speed threshold for woodland is supported - the National Trust has a formal policy. But the Sniffout Beaufort 7 threshold does not match official land manager practice, which begins formal restrictions at Beaufort 8. The current spec notes this is from forest school policy, not regulation - that framing remains correct. See Flag 1 in executive summary.

---

### Brachycephalic Working Group (BWG)
**Pages reviewed:** ukbwg.org.uk (accessible content only; position statement PDFs unreadable)

**Accessible findings:** BWG recommends walking brachycephalic dogs in early morning or late evening when cooler, and being "especially careful." No specific degree threshold or offset stated in accessible content.

**Verdict:** No specific threshold found. Cannot confirm or contradict the -4C offset. The PDF containing the full BWG position statement could not be read.

---

## 3. Threshold-by-Threshold Validation

### a) 22C as a caution threshold

**Finding:** CONFIRMED as a well-supported value in UK consumer guidance.

- Pedigree UK explicitly names 22C as potentially too hot for flat-faced, elderly, young, obese dogs
- Vets Now places 20-23C in a "moderate risk" band rated 6/10
- Claygate/Partridge Vets: "20-23C - getting warmer, moderate risk"
- No UK source was found that places 22C as generally safe for all dogs

The 22C penalty start for all dogs (not just vulnerable groups) is consistent with the evidence. No source says 22C is safe for vigorous exercise for all breeds.

**Confidence: HIGH**

---

### b) 28C as POOR

**Finding:** CONFIRMS by convergence.

- Claygate/Partridge Vets explicitly state: "28C+ = danger zone"
- Agria states 25C+ is a "definite NO" - their hard stop is lower than our POOR threshold
- No source suggests 28C is safe or only moderately risky

If anything, Agria would place POOR at 25C, not 28C. Sniffout's graduated structure (25-28C heavy penalty, 28-30C POOR) is more nuanced but not contradicted. The 28C = POOR threshold is defensible; a case could be made for labelling 25C+ as POOR for a more conservative approach.

**Confidence: HIGH (threshold defensible; conservative labelling up to 28C rather than 25C is a design choice, not an error)**

---

### c) Humidity multipliers (1.3x above 60% RH, 1.6x above 80% RH)

**Finding:** No canine-specific published humidity multiplier formula found in any source reviewed.

The most-cited practical rule in veterinary media is the Dr. Justine Lee formula: "temperature (F) + humidity (%) = 150 or higher = avoid outdoor exercise." Working example from the rule: 80F (27C) + 70% humidity = 150. This is attributed to clinical experience, not a published study, and originates in the US.

The 80% RH threshold for near-complete negation of panting effectiveness is cited in multiple sources. The 60% RH intermediate threshold appears in no published source and remains an interpolated estimate.

**Verdict for methodology page:** The current disclosure - "1.3x and 1.6x multipliers are estimates with no scientific basis" - remains accurate and appropriate. The only new observation is that the Dr. Justine Lee formula, while US-sourced and non-peer-reviewed, broadly corroborates the Sniffout approach for the 25-30C range.

**Confidence: LOW (estimates acknowledged; directionally consistent with evidence but no primary source)**

---

### d) Brachycephalic -4C offset

**Finding:** The concept is supported; the specific -4C value has no single citable primary source.

Evidence supporting the concept:
- Pedigree UK: "22C may be too hot for flat-faced dogs" vs "safe for most dogs up to 23C or more"
- Bulldog at 21C ambient temperature developed hyperthermia while standing still (PMC7459873)
- Multiple sources identify brachycephalic dogs as at risk in conditions comfortable for general dogs
- VetCompass ORs (Bulldog 13.95x, French Bulldog 6.49x) confirm substantially elevated HRI risk
- Brachycephalic dogs had 3x odds of fatal outcome (PMC9144152)

The practical implication is that brachycephalic dogs begin facing meaningful risk approximately 3-5C lower than general dogs, which is consistent with the -4C offset. But this is an inference, not a published threshold.

**Recommended wording for methodology page:** "Sniffout applies a four-degree downward adjustment to all heat thresholds for brachycephalic breeds. This offset is modelled from available evidence - including VetCompass data showing French Bulldogs have 6.5 times the heat-related illness risk of Labradors, and clinical data showing brachycephalic dogs can overheat in ambient conditions that are safe for other breeds - rather than a single published threshold."

**Confidence: MEDIUM (concept well-supported; specific degree value is a modelled estimate)**

---

### e) Paw burn: 22C warning, 25C danger

**Finding:** CONFIRMED at 25C. The 22C warning tier is precautionary headroom.

The specific 25C air = 52C pavement correlation is corroborated by Vets Now and referenced in multiple secondary sources citing FOUR PAWS International. No source was found that contradicts this figure or provides a lower threshold. Frostburg State University research on surface temperatures is the underlying academic source cited in the Vets Now article.

The 22C + UV>3 warning tier has no primary UK source but provides appropriate early-warning headroom before the confirmed 25C danger threshold. No source says 22C air temperature is safe for pavement exposure.

**Confidence: HIGH (25C threshold); MEDIUM (22C warning tier as precautionary extrapolation)**

---

### f) Cold: 7C threshold for small/short-coat

**Finding:** CONFIRMED by multiple independent sources.

- Vets Now: fine for most dogs down to 7C; flag for small/short-coat below 7C
- Animal Friends: "cold-averse dogs may start to struggle" at 5C (slightly more conservative than Vets Now 7C)
- NARPS UK: "some breeds will not do well" below 5C

All five Sniffout cold tiers (above 7C / 5-7C / 0-5C / below 0C / below -4C) are consistent with the range of UK sources reviewed.

**Confidence: HIGH**

---

### g) Wind Force 7 woodland threshold

**Finding:** PARTIALLY CONFIRMED with a discrepancy - see Flag 1 in executive summary.

The most specific UK land manager policy found (National Trust ancient woodland) sets formal closure at Beaufort 8 (40 mph / 64 km/h), not Beaufort 7. No Forestry England numerical threshold was found in public documents. The current spec's framing - that this comes from forest school policy, not regulation - is correct and must be maintained.

The Sniffout Beaufort 7 flag is a precautionary consumer recommendation, not a regulatory threshold. The distinction matters for the methodology page.

**Confidence: MEDIUM (concept sound; specific Beaufort 7 value is a conservative precautionary threshold, not aligned with official land manager policy)**

---

## 4. New Information Not Previously Known

**New finding 1 - Bulldog at 21C standing still (PMC7459873)**
A Bulldog developed hyperthermia at 21C ambient temperature without exercise. This is direct evidence supporting the 20C brachycephalic flag and is stronger evidence for the flag than OR data alone. Recommend citing PMC7459873 in the methodology page alongside PMC7303136 and PMC8675495.

**New finding 2 - WBGT vs air temperature distinction**
The VetCompass 16.9C median figure is a Wet Bulb Globe Temperature (WBGT), not standard dry-bulb air temperature. WBGT is systematically lower than air temperature. The methodology page currently says "the median temperature on exercise-triggered heatstroke days in the UK is around 16-17 degrees Celsius" without clarifying this is WBGT. This should be updated to prevent misleading comparisons to air temperature readings.

Suggested wording: "...around 16-17 degrees Celsius (measured as Wet Bulb Globe Temperature, which incorporates humidity and solar radiation and reads lower than standard air temperature)"

**New finding 3 - Dr. Justine Lee formula**
The formula "temperature (F) + humidity (%) = 150 or higher = avoid outdoor exercise" is the most widely reproduced practical humidity rule in veterinary media. It is attributed to a US board-certified emergency vet, not a peer-reviewed study. Broadly consistent with the Sniffout multiplier approach for the 25-30C range. This is a supporting reference only, not a primary source, and is US-sourced. It does not remove the need for the estimate disclaimer.

**New finding 4 - BVA "walks more deadly than hot cars" statistic**
38% of vets had treated dogs for heatstroke after walks vs 9% for hot cars. This is an important public-facing statistic that could be used in the app's educational content or the methodology page to emphasise why the scoring focuses heavily on exercise conditions, not just ambient temperature.

---

## 5. Contradictions Found

No material contradictions identified.

One minor tension: The Kennel Club states dogs are "comfortable up to 25C" generally, which partially conflicts with Sniffout applying a -40 penalty (-40 = FAIR rating) in the 25-28C band. However, the Kennel Club's 25C figure refers to comfortable ambient conditions, not exercise safety. The distinction between rest temperature and exercise temperature eliminates this tension.

Agria recommends avoiding walks above 20C for all dogs, which is more conservative than Sniffout starting the general all-dog penalty at 22C. This is a design trade-off (usability vs. maximum caution) rather than a factual contradiction. Sniffout's 20-22C brachycephalic flag partially addresses this.

---

## 6. Confidence Assessment by Threshold

| Threshold | Confidence | Basis |
|---|---|---|
| No penalty below 20C (general dogs) | HIGH | Confirmed by Scottish SPCA, Agria, Guide Dogs UK, Pedigree UK, Vets Now |
| 20-22C flag brachycephalic/elderly | HIGH | Pedigree UK (22C), Vets Now (moderate risk from 20C), Bulldog at 21C (PMC7459873) |
| 22-25C penalty all dogs | HIGH | Vets Now, Claygate Vets, multiple UK welfare orgs; no source contradicts |
| 25-28C heavier penalty | HIGH | Agria (25C = definite NO), Kennel Club (25C = upper comfort), Guide Dogs UK |
| 28-30C POOR | HIGH | Claygate Vets (28C+ = danger zone); all sources by implication |
| 30C+ DANGER | HIGH | Extreme by UK standards; no source disputes |
| Brachycephalic -4C offset (concept) | HIGH | Multiple sources confirm brachycephalic dogs at risk at lower temps; PMC7303136, PMC7459873 |
| Brachycephalic -4C offset (specific value) | MEDIUM | Inferred from evidence; no published primary source states -4C or -5C specifically |
| Paw burn 25C air = 52C pavement | HIGH | Vets Now primary source; FOUR PAWS International corroboration |
| Paw burn 22C + UV warning (precautionary) | MEDIUM | No primary source for 22C specifically; reasonable headroom below confirmed 25C danger |
| Rain Met Office classifications | HIGH | Met Office is the authoritative source; not challenged |
| Wind Beaufort 7 woodland flag | MEDIUM | Concept: sound. Specific Beaufort 7 value: conservative vs official policy (NT closes at Beaufort 8). Source: forest school policy only. |
| Cold 7C flag small/short-coat | HIGH | Vets Now primary; Animal Friends and NARPS UK corroborate |
| Cold 5-7C penalty band | HIGH | Vets Now, Animal Friends, NARPS UK |
| Cold 0-5C penalty all dogs | HIGH | All cold sources reviewed |
| Cold below 0C escalated penalty | HIGH | All cold sources reviewed |
| Cold below -4C "potentially unsafe" | HIGH | Vets Now (life-threatening at -4 to -9C); Animal Friends ("skip walks") |
| Humidity 1.6x above 80% RH | MEDIUM | 80% RH as major threshold supported (panting substantially negated); 1.6x multiplier is estimate |
| Humidity 1.3x above 60% RH | LOW | 60% threshold is interpolated; no primary source for this specific value or multiplier |
| Mud risk thresholds | LOW | Estimates from soil drainage research; not challenged but no dog-specific source |
| Tick 7C / 80% RH thresholds | HIGH | PMC3997332 (7C), ECDC (80% RH); not re-tested in this round |

---

## 7. Recommendations

**Must do before launch:**

1. Update the methodology page to clarify the VetCompass 16.9C figure is WBGT (Wet Bulb Globe Temperature), not standard air temperature. Current wording risks misleading comparisons.

2. Add PMC7459873 ("Dogs Don't Die Just in Hot Cars," O'Neill et al.) to the methodology page sources. It provides the Bulldog-at-21C data point and is a stronger direct citation for the brachycephalic 20C flag than OR data alone.

3. Revise the brachycephalic offset description in the methodology page. Replace any language implying this is a published threshold with language describing it as a modelled estimate derived from available evidence.

4. Confirm the wind/woodland flag description does not say it matches Forestry Commission or National Trust policy. The spec currently says this correctly ("from outdoor education policy, not Forestry Commission regulation") - verify this framing is preserved in the methodology page as published.

**Consider doing before launch:**

5. Add the BVA "38% of vets saw heatstroke from walks vs 9% hot cars" statistic to the methodology page. It contextualises why the scoring focuses on exercise conditions. Source: BVA news release, 2022.

6. Consider whether the 25C FAIR threshold (currently -40 penalty = FAIR) should be relabelled more explicitly. Agria calls 25C a "definite NO." Some users may expect FAIR to mean acceptable. This is an editorial decision, not a factual issue.

**No change required:**

7. The humidity multiplier estimate disclaimers are correctly framed in the current spec and methodology page. No new source was found that would change this.

8. The cold threshold tiers are well-validated and require no change.

9. Rain Met Office classifications are not challenged and require no change.

---

## Sources

### UK animal welfare and veterinary organisations
- BVA hot weather guidance and "silent killer" news article: bva.co.uk/pet-owners-and-breeders/caring-for-animals-in-hot-weather/
- Royal Kennel Club hot weather walking, heatstroke, and hot pavements pages: royalkennelclub.com
- Scottish SPCA dog care in summer: scottishspca.org/advice/dogs/dog-care-in-summer/
- Guide Dogs UK hot weather: guidedogs.org.uk/getting-support/information-and-advice/dog-care-and-welfare/hot-weather/
- BSAVA position statements index: bsava.com/other/position-statements/
- Brachycephalic Working Group: ukbwg.org.uk

### UK pet insurance and consumer sources
- Agria Pet Insurance hot weather walking: agriapet.co.uk/guides-and-advice/when-is-it-too-hot-to-walk-your-dog/
- Animal Friends Insurance cold walks: animalfriends.co.uk/dog/dog-advice/dog-maintenance-and-safety/how-cold-is-too-cold-for-dog-walks/
- Pedigree UK hot weather walking: uk.pedigree.com/dog-advice/caring-for-your-dog/walking-dogs-in-hot-weather
- NARPS UK safe walking temperatures: narpsuk.co.uk/blog/plan-safe-dog-walking-routes-in-any-weather
- Claygate/Partridge Vets temperature guide: partridgepractices.co.uk/article/know-when-its-too-hot-to-walk-your-dog/

### Veterinary clinical sources
- Vets Now pavement heat / paw burns: vets-now.com/2017/06/never-walk-dogs-hot-asphalt-tarmac-pavements-artificial-grass/
- Vets Now too cold for dogs: vets-now.com/pet-care-advice/too-cold-for-dogs/
- BVNA HotDogs heatstroke article: bvna.org.uk/blog/hot-dogs-recognising-and-managing-canine-heat-stroke/

### Research publications
- PMC7303136: O'Neill et al., "Incidence and risk factors for heat-related illness (heatstroke) in UK dogs under primary veterinary care in 2016," Scientific Reports, 2020
- PMC8675495: O'Neill et al., French Bulldog disorder prevalence including BOAS, Canine Medicine and Genetics, 2021
- PMC9144152: O'Neill et al., "Risk factors for severe and fatal heat-related illness in UK dogs - a VetCompass study," Veterinary Sciences, 2022
- PMC7459873: O'Neill et al., "Dogs Don't Die Just in Hot Cars - Exertional Heat-Related Illness in UK Dogs under Primary Veterinary Care during 2016," Scientific Reports, 2020. Note: this is the source for the Bulldog-at-21C case and the 68% walking figure.
- PMC5800390: Drobatz and Macintire, panting physiology and humidity thresholds

### Land management
- National Trust Oxburgh Estate high wind policy: nationaltrust.org.uk/visit/norfolk/oxburgh-estate/high-wind-policy
- Forestry England safety in the forest: forestryengland.uk/safety-the-forest
- Mountaineering Scotland wind speeds: mountaineering.scot/safety-and-skills/essential-skills/weather-conditions/wind-speeds
