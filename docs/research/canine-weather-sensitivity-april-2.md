# Canine Weather Sensitivity - Research Notes
**Date:** 2026-04-02
**For:** Walk quality scoring engine

---

## Executive Summary

The five most important thresholds for the scoring engine:

1. **Heat - air temperature:** 20 degrees Celsius is the UK consensus caution threshold for average dogs. VetCompass data shows exercise-induced heatstroke occurs at a median ambient temperature of 16.9 degrees Celsius in UK dogs - lower than most owners assume. Danger threshold is 25 degrees Celsius for most dogs, 20 degrees Celsius for brachycephalic breeds.

2. **Heat - ground/pavement:** At 25 degrees Celsius air temperature in direct sun, asphalt reaches 52 degrees Celsius. Skin burns in under 60 seconds at 52 degrees Celsius. The 7-second hand test is the practical field check; not a formally evidenced threshold but widely adopted by vets.

3. **Cold - breed-dependent:** Short-coated and small breeds start struggling at 7 degrees Celsius and face genuine risk below 0 degrees Celsius. Most average breeds are fine above 0 degrees Celsius. Below -4 degrees Celsius is dangerous for most dogs. Apply wind chill to the effective temperature.

4. **Wind - woodland safety:** Forestry-adjacent organisations close wooded areas to groups at Beaufort Force 7 (sustained 32 mph / 51 km/h) or at gust forecasts above 34 mph. This is the key threshold for walk route scoring (sheltered vs wooded).

5. **Ticks:** Ixodes ricinus (the UK sheep tick, main Lyme disease vector) becomes active at approximately 7 degrees Celsius with relative humidity above 80 percent. Peak UK tick activity: May-June, with a secondary peak in September. This is a binary risk flag, not a comfort score.

---

## 1. Heat and Humidity

### Air temperature thresholds

Three levels for average dogs (mesocephalic breeds, healthy adult, average weight):

**Level A - Be aware (elevated risk, shorten and time walk carefully):**
15 degrees Celsius and above during exercise.

Basis: VetCompass UK data (2016-2018, 856 heat-related illness events) found the median ambient temperature on exercise-triggered heatstroke days was 16.5 degrees Celsius for exertional HRI and 16.9 degrees Celsius across all HRI event types (IQR 14.8-18.9 degrees Celsius). This is dog-specific UK data, not extrapolated from human research. Source: O'Neill et al., "Risk Factors for Severe and Fatal Heat-Related Illness in UK Dogs - A VetCompass Study", Veterinary Sciences 2022, PMC9144152.

**Level B - Caution (shorten walk, morning/evening only, stick to shade, avoid exertion):**
20 degrees Celsius and above.

Basis: This is the explicit UK welfare organisation consensus. Multiple UK sources including UK pet insurance and vet-adjacent publishers cite this as the threshold above which "most dogs are at higher risk of heatstroke, especially during strenuous exercise." Sources: Search results citing PDSA and general UK vet consensus, corroborated across Agria Pet Insurance, Animal Friends, Julius K9 UK. Note: PDSA's own web pages were not directly fetchable (404 errors), so this threshold derives from multiple secondary UK sources consistently citing PDSA guidance.

Supplementary thresholds from Barc London / UK vet summaries:
- 20-23 degrees Celsius: shorten walk, shade only, water essential
- 24-26 degrees Celsius: too risky except shortest possible necessity walk

**Level C - Danger (do not walk most dogs, brachycephalic dogs must stay indoors):**
25 degrees Celsius and above.

Basis: Above 25 degrees Celsius, walking any dog becomes high-risk per multiple UK vet sources. Above 27 degrees Celsius, all sources recommend indoors only. Sources: Barc London walk temperature guide; Agria Pet Insurance guidance; UK vet consensus summaries.

**Important nuance from VetCompass research:** Exercise (including just walking) caused 74 percent of all heatstroke cases in UK dogs. 68 percent of exercise-triggered events were triggered by walking alone, not running. This strongly suggests the "be aware" threshold should be set at 15 degrees Celsius, not 20 degrees Celsius, for the scoring engine - particularly during midday and for high-risk breeds. Source: RVC VetCompass press release, "Excessive exercise responsible for three-quarters of heatstroke cases in dogs."

### Brachycephalic adjustment

Brachycephalic breeds (French Bulldog, Pug, English Bulldog, Shih Tzu, Cavalier King Charles Spaniel, Chow Chow) have a caution threshold approximately 4-5 degrees Celsius lower than average dogs.

**Specific published data:**
- General brachycephalic caution: 21 degrees Celsius (where average dog threshold is 25 degrees Celsius), per UK brachycephalic heat management sources. Source: Brachycephalic heat safety UK summary (doggroomersfolkestone.com, citing veterinary guidance) - note: page was blocked at fetch time but search results extracted the 21 degree threshold.
- At-risk dogs including brachycephalics: threshold approximately 17-18 degrees Celsius (63-66 degrees Fahrenheit) per veterinary sources. Source: Veterinary guidance cited in search results from ecvets.com.

**Risk multiplier from peer-reviewed data:**
VetCompass study (PMC7303136) found brachycephalic dogs had 2.10 times greater odds of heat-related illness compared to mesocephalic breeds. Specific breed odds ratios vs Labrador Retriever:
- Bulldog: OR 13.95 (95% CI 8.01-24.29)
- French Bulldog: OR 6.49 (95% CI 3.62-11.63)
- Chow Chow: OR 16.61 (95% CI 6.21-44.44)
- Pug: OR 3.24 (95% CI 1.67-6.29)

Source: O'Neill et al., "Incidence and risk factors for heat-related illness (heatstroke) in UK dogs under primary veterinary care in 2016," Scientific Reports, PMC7303136.

**Recommended scoring engine adjustment:** Apply a -4 degree Celsius offset to all heat thresholds for brachycephalic breeds (i.e., Level B caution starts at 16 degrees Celsius, Level C danger at 21 degrees Celsius).

### Humidity and dew point

**Humidity thresholds (from veterinary pathophysiology research):**

- Above 35 percent relative humidity: panting becomes progressively less effective as evaporative cooling is reduced. Source: Drobatz and Macintire, "Pathophysiology of heatstroke in dogs - revisited," PMC5800390, citing established veterinary physiology.
- Above 80 percent relative humidity: evaporative cooling through panting is substantially negated. Source: same PMC5800390 study - "at 80% relative humidity, this body cooling mechanism in dogs is negated."

**Combined temperature + humidity risk:**
No published canine-specific heat index formula was found for dogs equivalent to the human Heat Index. However, the Temperature-Humidity Index (THI) formula used in some veterinary and sporting dog contexts is:

THI = (1.8 x AT + 32) - (0.55 - 0.0055 x RH/100) x (1.8 x AT - 26)

where AT is ambient temperature in Celsius and RH is relative humidity percentage.

THI thresholds referenced for canine exercise precautions:
- THI above 72: start precautions for at-risk breeds (brachycephalic, elderly, obese)
- THI above 75: precautions required for all dogs

Source: Ponderosa Springers (english-springer-spaniels.com) heat index guide, referencing veterinary field guidance. Note: this is a sporting dog community source, not a peer-reviewed study. These THI values are extrapolated from livestock and human research, not derived from canine-specific studies.

**Dew point:**
No peer-reviewed canine-specific dew point threshold was found. For the scoring engine, relative humidity above 60 percent combined with temperatures above 15 degrees Celsius creates compounding risk (panting less effective). Above 80 percent humidity the risk compounds significantly at any temperature above 15 degrees Celsius.

**Recommendation for scoring engine:** Use apparent/feels-like temperature (which incorporates humidity via heat index) rather than raw air temperature alone. This captures the humidity effect without requiring a separate variable.

### Ground temperature and paw safety

**Air temperature to pavement temperature relationship:**
- At 25 degrees Celsius air temperature with low wind and low humidity: asphalt can reach 52 degrees Celsius. Basis: university experiment data, cited by Vets Now and Four Paws USA.
- At 31 degrees Celsius air temperature: pavement can reach 62 degrees Celsius. Source: Vets Now, "Never walk dogs on hot asphalt" (vets-now.com, 2017).
- General rule: asphalt in direct sun runs 10-30 degrees Celsius above air temperature. Source: pavement engineering research, Rocket City Now weather blog.
- Simple approximation from road engineering: PT (Fahrenheit) = AT (Fahrenheit) + 30. In Celsius this approximates to PT = AT + 17 degrees for peak summer sun conditions. Source: FHWA LTPP pavement temperature research.

**Burn threshold:**
- 52 degrees Celsius (125 degrees Fahrenheit): skin destruction can occur in under 60 seconds. Source: Vets Now article, citing veterinary burn pathophysiology. Corroborated by multiple US veterinary sources.
- Burns possible in approximately 60 seconds at 49 degrees Celsius (120 degrees Fahrenheit). Source: search result aggregation from multiple US vet sources.

**The 7-second rule:**
Place the back of your hand on the pavement. If you cannot hold it for 7 seconds, it is too hot for dog paws. The test was developed by US veterinarians as a practical check. It is not derived from a controlled clinical trial with a specific burn time calculation. The Vets Now source confirms it was "developed by veterinarians in the US" but does not cite a specific originating study. Source: Vets Now, vets-now.com (2017).

**For scoring engine use:** Apply pavement risk flag when air temperature exceeds 22 degrees Celsius with sun/UV exposure (pavement likely above 40 degrees Celsius). Apply danger flag at air temperature above 25 degrees Celsius in sun (pavement likely above 50 degrees Celsius, burn risk within minutes).

---

## 2. Rain Thresholds

No dog-specific veterinary research on rain thresholds was found. The thresholds below use Met Office rain intensity classifications (a meteorological standard), with safety rationale from vet and dog walker advisory sources.

**Met Office rain intensity classifications:**
- Slight rain: below 0.5 mm/hr
- Moderate rain: 0.5 to 4 mm/hr
- Heavy rain: above 4 mm/hr
- Slight showers: 0-2 mm/hr
- Moderate showers: 2-10 mm/hr
- Heavy showers: 10-50 mm/hr

Source: UK Met Office classification as reported in Rainfall Intensity Categories (rainsimulator.com citing Met Office); confirmed via search result showing Met Office factsheet content.

**Three levels for scoring engine:**

**Level A - Fine to walk (light drizzle, proceed normally):**
Below 0.5 mm/hr (slight rain / light drizzle).
Rationale: Light drizzle has no material impact on dog welfare. Dogs are not harmed by drizzle. Owner preference only. Source: Multiple dog walking sources confirm this unanimously. ManyPets UK: "it's completely safe to walk dogs of all breeds and sizes in the rain."

**Level B - Shorter walk recommended (moderate rain, apply common sense):**
0.5 to 4 mm/hr (moderate rain per Met Office classification).
Rationale: Moderate rain wets a dog's coat, reducing insulation and increasing cold risk. Muddy paths become activated. Note: no veterinary body publishes a specific mm/hr dog walking threshold. This level maps to Met Office "moderate rain" only.

**Level C - Not recommended except for toilet needs (heavy rain or thunderstorm):**
Above 4 mm/hr, or any thunderstorm condition.

**Thunderstorms specifically:**
The Blue Cross (UK) explicitly advises: "When you know a thunderstorm is on its way, ensure you can stay at home with your dog." Dogs can panic, bolt, and become lost or injured. Lightning strike is rare but fatal when it occurs. Source: Blue Cross UK, "Dogs and Thunderstorms" (bluecross.org.uk). Supported by Blue Cross UK and Royal Kennel Club guidance: "stay safe indoors than go out for a walk during heavy wind or rain." Source: Royal Kennel Club storms guidance (royalkennelclub.com).

**RSPCA 2005 survey note:** 49 percent of dogs showed fear responses to loud noises, with a significant proportion showing severe reactions. This supports thunderstorm as a hard stop in the scoring engine. Source: RSPCA 2005 survey, cited in multiple dog anxiety resources.

---

## 3. Wind Thresholds

No dog-specific veterinary wind speed research was found. Thresholds below derive from: forest school / outdoor education operational policies (which use Beaufort scale and mph thresholds), general dog walking safety guidance, and small-dog physical vulnerability data.

**Three levels for scoring engine:**

**Level A - Breezy but fine (walk normally, be aware of gusts):**
Beaufort Force 4 or below - sustained below 28 km/h (17 mph).
Rationale: Below Force 4 (moderate breeze), there is no material risk. Small dogs may be briefly unsteady in strong gusts but not endangered. Source: Beaufort scale interpretation from multiple outdoor sources.

**Level B - Keep to sheltered routes, avoid exposed hilltops and open fields:**
Beaufort Force 5-6 - sustained 29-49 km/h (18-30 mph).
Rationale: At Force 5 (fresh breeze, 29-38 km/h), small dogs under 5-7 kg can be knocked over or destabilised. Debris risk increases. Hobbyist and walker sources cite 30 mph (48 km/h) as the threshold where small dogs face difficulty walking and should be moved to sheltered paths. Source: HobbyFAQS wind walking guide; wind safety sources aggregated in search results.

**Small breed specifics:** 10-15 pound (4.5-7 kg) dogs can be knocked over or struggle to walk in sustained winds of 20-25 mph (32-40 km/h). Source: wind safety aggregated sources in search results.

**Level C - Avoid woodland entirely, consider postponing (especially for small dogs and in areas with mature trees):**
Beaufort Force 7 or above - sustained 50 km/h / 32 mph or above (gusts of 34+ mph trigger the woodland threshold).

**Woodland closure threshold:**
Forest school operational guidance cites Beaufort Force 7 (sustained average 32 mph / 51 km/h) as the threshold for cancelling woodland activities. One widely referenced policy (Kids Go Wild Forest School) cancels all woodland activities at Beaufort Force 7. A separate operational benchmark used in some facilities is gust forecasts above 34 mph as the decision trigger - "not necessarily cancelling entirely, but moving to open space." Source: forest school weather policy search results citing Kids Go Wild Forest School policy and Inspired Forest School Training guidance.

Note: No direct Forestry Commission document specifying a public recreation wind speed closure threshold was found - the Forestry Commission's published guidance focuses on tree management and asset risk rather than per-wind-speed public access rules. The 34 mph gust / Beaufort Force 7 threshold comes from outdoor education operational policy, not an official government regulation. This should be noted in implementation.

**Wind chill:**
Wind chill affects dogs as it does humans - wind strips heat from the body. At 0 degrees Celsius air temperature and 30 mph wind, the effective "feels like" temperature is approximately -10 to -12 degrees Celsius using standard wind chill tables. Small dogs experience greater wind chill effect due to their surface area to volume ratio. For scoring: use apparent wind chill temperature (not raw air temperature) when applying cold thresholds to wind-exposed routes. Source: General wind chill physiology (petplace.com wind chill article); small dog surface area ratio explanation from multiple cold weather sources.

---

## 4. Cold and Snow Thresholds

### Short-coated and small breeds (Chihuahua, Whippet, Greyhound, Dachshund, Italian Greyhound, Miniature Pinscher)

- **7 degrees Celsius:** Discomfort begins, coat or jacket recommended. Source: Multiple UK vet sources including Julius K9 UK blog, Animal Friends (citing Joii Pet Care vets).
- **5 degrees Celsius or below:** "Cold averse" dogs start to struggle. Paw extremities at risk of frostbite. Source: Animal Friends cold walk guide (citing UK vet sources); Julius K9 UK.
- **0 degrees Celsius:** Small dogs, slim breeds (whippets, greyhounds, lurchers), elderly dogs and puppies "may start to struggle and should avoid walks where possible." Source: Julius K9 UK cold weather guide.
- **-4 degrees Celsius:** Potentially unsafe for short-haired, small, elderly, and puppy dogs - life-threatening risk if wet. Source: Vets Now, "How Cold Is Too Cold for Dogs" (vets-now.com).

### Average breeds (Labrador, Cocker Spaniel, Beagle, Border Collie - medium coat, medium size)

- **Above 7 degrees Celsius:** No cold concern for most healthy adult dogs.
- **1 degree Celsius to -4 degrees Celsius:** Monitor; coat may help. Source: Vets Now thresholds.
- **-4 degrees Celsius to -9 degrees Celsius:** Potentially life-threatening for smaller dogs in this category especially if wet. Most average breeds can manage with coat but limit duration. Source: Vets Now.
- **Below -9 degrees Celsius:** Not recommended for average breeds. Source: Vets Now.

### Double-coated breeds (Husky, Alaskan Malamute, Samoyed, Bernese Mountain Dog, Akita)

- These breeds tolerate sub-zero temperatures well. Huskies maintain safe core temperature down to approximately -46 degrees Celsius with shelter, though veterinarians generally recommend bringing inside below -20 degrees Celsius overnight. Source: iHeartDogs Husky temperature guide (citing veterinary guidance).
- Double coats also provide summer insulation - these breeds can overheat in warm weather despite their cold tolerance. Limit summer exercise to early morning and evening. Source: AKC expert advice on Samoyed coat temperature regulation.
- **Cold concern threshold for double-coated breeds:** Below -9 degrees Celsius for extended outdoor exposure without shelter.

### RSPCA guidance note:
The RSPCA recommends keeping indoor temperatures above 10 degrees Celsius for vulnerable dogs. Their outdoor walking guidance does not specify exact Celsius walk thresholds but notes dogs with thin or short coats, small dogs, elderly dogs, puppies and dogs with medical conditions need extra protection from cold. Source: RSPCA Winter Cold Weather Care for Dogs (rspca.org.uk).

### Snow depth

No peer-reviewed threshold found for specific snow depth at which small dog walking becomes problematic. General guidance from multiple sources indicates:
- Snow above the belly height of a short-legged dog (dachshund belly height approximately 15-20 cm from ground; Chihuahua approximately 10-15 cm) becomes difficult and increases heat loss through body contact with snow.
- Deep snow also causes ice ball formation between paw pads, causing lameness, particularly in breeds with hairy paws.
- No specific cm threshold appears in any source reviewed. The practical indicator is whether snow depth approaches the dog's belly clearance.

Source: NutriSource Pet Foods cold weather guide; multiple general dog winter walking sources.

### Ice risk

Ice forms at 0 degrees Celsius and below. At air temperatures at or below 0 degrees Celsius, treated paths (road salt) and untreated natural paths both present slip risk. Road salt can cause paw irritation and is toxic if ingested during grooming.

**Scoring engine threshold:** Apply ice risk flag at air temperature below 2 degrees Celsius (allowing for delayed surface freezing after air temperature drops).

Source: Derived from standard physics (ice at 0 degrees Celsius); paw risk from Royal Kennel Club winter dangers page and Vets Now cold weather guide.

---

## 5. Breed-Specific Adjustments

All adjustments are relative to a "baseline" average healthy adult mesocephalic dog (e.g., Labrador Retriever, Beagle, Border Collie) at standard exercise intensity (brisk walk).

| Breed type | Heat threshold adjustment | Cold threshold adjustment | Wind sensitivity | Key source |
|---|---|---|---|---|
| Brachycephalic (French Bulldog, Pug, Bulldog, Shih Tzu, CKCS) | -4 to -5 degrees Celsius on all heat thresholds. Caution at 16C, danger at 21C | No significant cold adjustment (normal cold thresholds apply) | No significant wind adjustment | VetCompass PMC7303136 (OR 2.10 for HRI); ecvets.com vet guidance |
| Double-coated breeds (Husky, Malamute, Samoyed, Akita) | +5 to +8 degrees Celsius more heat tolerant - BUT still prone to heat stress above 25C with exercise | Cold danger threshold lowered to approximately -9C or below (vs -4C for average) | No significant wind adjustment | AKC Samoyed coat guide; iHeartDogs Husky temperature guide |
| Small breeds under 10 kg (Chihuahua, Yorkshire Terrier, Pomeranian, toy breeds) | No significant heat adjustment (same thresholds as average) | Cold discomfort starts at 7C (vs approximately 1-2C for average); danger below 0C | Moderate wind (20-25 mph / 32-40 km/h) can knock over or destabilise; apply caution from Beaufort Force 5 | Julius K9 UK; Vets Now; wind safety search results |
| Giant breeds over 40 kg (Great Dane, Mastiff, Saint Bernard, Newfoundland) | -2 to -3 degrees Celsius lower heat threshold (larger body mass, lower surface area to volume ratio = slower heat dissipation). Note: Greyhound OR 4.26 in VetCompass despite lean build - body type matters more than weight alone | Standard cold thresholds apply or slightly better than average due to body mass | No significant wind adjustment | VetCompass PMC7303136 (dogs over 50 kg: OR 3.42 for HRI); Frontiers 2025 heat stress paper |
| Elderly dogs (7 years and above) | Apply -2 to -3 degree Celsius caution offset. Elderly dogs have reduced thermoregulation capacity | Reduced cold tolerance. RSPCA: below 10C, vulnerable elderly dogs may struggle | No significant wind adjustment | VetCompass PMC9144152 (dogs 12+: OR 8.87 for fatal HRI); leapyears.com senior dog heat guide |
| Puppies under 12 months | Apply -3 degree Celsius caution offset for heat; puppies cannot regulate body temperature effectively. Avoid exercise at the warmest part of the day | Cold discomfort likely below 5-7C; avoid exposure below 2C | No significant wind adjustment; small puppies affected by wind similarly to small breeds | Dial A Vet (puppies regulate body temperature from approximately 7 weeks); multiple puppy care sources |

**Notes on breed-specific data quality:**
- Brachycephalic heat adjustments are the best-evidenced, with multiple peer-reviewed UK studies (VetCompass).
- Giant breed heat sensitivity is supported by the body-mass surface-area ratio principle in veterinary literature but no specific Celsius offset for giant breeds appears in clinical guidelines.
- Double-coated breed heat thresholds are confirmed by general veterinary sources but no specific clinical threshold paper was found.
- All cold thresholds for small breeds and puppies are from vet advisory sources (Vets Now, Julius K9 UK, RSPCA), not primary research.

---

## 6. Mud Risk Indicator

### Rainfall and mud formation

No veterinary or pet-specific research on rainfall thresholds for muddy paths was found. The following is derived from soil science and agricultural research applied to walking conditions.

**Soil drainage rate by terrain type:**
- Sandy soil: drains at 1-6 inches (2.5-15 cm) per hour - paths effectively dry within hours of rain stopping. Source: EPA soil constraint documentation, LWDD soil saturation guide.
- Chalk downland: free-draining, similar to sandy soil - rapid drainage.
- Clay soil: drains at less than 0.05 inches per hour (less than 1.3 mm per hour) - water can remain in soil for days to weeks after rain. Source: same EPA/LWDD sources.
- General field capacity: after heavy rain, soil drains under gravity for approximately 48 hours before reaching "field capacity" - after which moisture remains bound in the soil. Source: soil science standard definition cited in agricultural search results.

**Practical mud risk proxy:**
- Dry: less than 2 mm rainfall in preceding 48 hours.
- Damp: 2-10 mm cumulative rainfall in preceding 48 hours.
- Muddy: 10-25 mm cumulative rainfall in preceding 48 hours (clay paths likely muddy; chalk and sandy paths may be clear).
- Very muddy: above 25 mm cumulative rainfall in preceding 48 hours.

These are proposed thresholds for the scoring engine only - not from published veterinary or official walking guidance. They are conservative estimates informed by soil drainage research.

### Open-Meteo API data availability

Based on available documentation and search results, Open-Meteo's forecast API includes soil moisture variables. Confirmed available variables include soil moisture at multiple depth layers. The API documentation references `soil_moisture_7_to_28` (cm) depth notation, and ERA5-Land in the Historical Weather API explicitly includes soil moisture as a variable.

For the forecast API specifically, soil moisture variables are available as hourly data. However, the exact variable names for the shallowest layers (e.g., `soil_moisture_0_to_1cm`) could not be confirmed from search results alone - the documentation page at open-meteo.com/en/docs was inaccessible via WebFetch during this research session. The Climate API only includes soil moisture from the EC_Earth3P_HR model, suggesting soil moisture may have limited forecast coverage.

**Feasibility assessment:**
A simple cumulative precipitation in last 48 hours variable is more reliably available across weather APIs (including Open-Meteo, which provides `precipitation` as a standard hourly forecast variable) than soil moisture. A rainfall accumulation proxy is sufficient for a "dry / damp / muddy / very muddy" indicator for path conditions for most UK terrain types.

**Recommendation:** Use `precipitation` sum over past 24-48 hours as the primary mud indicator. If Open-Meteo soil moisture at 0-7 cm depth is available in the forecast API, it could be used as a secondary confirmation signal. The 48-hour rainfall accumulation is the more practical and universally available data point.

---

## 7. Tick Risk Indicator

### Temperature threshold

**Ixodes ricinus** (the sheep tick, primary UK Lyme disease vector) activity thresholds from peer-reviewed research:

- **Minimum questing temperature (UK populations):** approximately 5.7 to 7.9 degrees Celsius (varies by UK region - Scottish population minimum metabolic activity 5.7C, Welsh 7.9C, English 7.0C). Some questing observed at 6 degrees Celsius. Source: "Climate of origin affects tick (Ixodes ricinus) host-seeking behavior in response to temperature," PMC3997332. Also corroborated by ECDC Ixodes ricinus factsheet and search result summaries.
- **Practical active threshold for scoring engine:** 7 degrees Celsius (conservative, mid-point of UK regional ranges). Ticks are unlikely to be questing below this temperature.
- **Peak activity temperature:** 15-25 degrees Celsius. Source: ECDC factsheet and multiple entomological sources.
- **Reduced activity in hot dry conditions:** Questing reduces during the hottest and driest part of English summers (ticks desiccate in low humidity), then resumes in late summer / early autumn. Source: UKHSA Lyme disease blog (2024) as cited in search results.

### Humidity threshold

- Ixodes ricinus requires relative humidity above 80 percent to avoid desiccation and maintain questing behaviour. Source: ECDC Ixodes ricinus factsheet (ecdc.europa.eu); entomological search result summaries. This threshold aligns with the value found in multiple independent sources.

### Seasonal pattern (UK)

- Primary peak: May-June (matching warm, humid spring conditions and nymph activity peak).
- Secondary peak: September (adult activity resurgence as summer heat fades but humidity remains).
- Winter: reduced but not zero; active on mild winter days above 7 degrees Celsius.
- Source: UKHSA blog post on Lyme disease awareness (2024); multiple tick surveillance sources.

### Feasibility of a tick risk indicator

A simple binary or three-level tick risk indicator is feasible using temperature and humidity alone:

- **Low risk:** temperature below 7 degrees Celsius OR relative humidity below 70 percent.
- **Moderate risk:** temperature 7-20 degrees Celsius AND humidity above 70 percent (spring and autumn conditions).
- **High risk:** temperature 10-25 degrees Celsius AND humidity above 80 percent, especially in April-June and September (peak questing conditions, especially in woodland, heath, bracken).

This does not account for location (woodland vs urban park) or altitude, which affect local tick density significantly. The indicator is best treated as a seasonal awareness flag rather than a location-specific risk score.

Note: tick risk is a human-and-dog health concern (Lyme disease), not a walk comfort factor. It should be presented as an informational flag, not as a walk quality penalty in the same way that heat or rain affects the scoring.

---

## 8. Recommended Algorithm Updates

Specific numbers to use in the scoring engine (expressed as thresholds):

**Heat scoring (air temperature):**
- Apparent temperature (heat index, incorporating humidity) below 15C: no penalty
- Apparent temperature 15-19C: minor penalty, flag for brachycephalic/elderly/giant breeds
- Apparent temperature 20-24C: moderate penalty for all dogs; heavy penalty for brachycephalic, elderly, giant breeds
- Apparent temperature 25-26C: heavy penalty for all dogs; maximum penalty (block) for brachycephalic, elderly, giant, puppy
- Apparent temperature 27C and above: maximum penalty (block) for all dogs

**Pavement/paw heat (sun exposure modifier):**
- Air temperature above 22C with UV index above 3 (sunshine): apply pavement heat warning flag
- Air temperature above 25C with UV index above 3: apply burn risk flag (short walk only, grass recommended)

**Rain scoring:**
- Below 0.5 mm/hr: no penalty
- 0.5-4 mm/hr: minor penalty
- Above 4 mm/hr: moderate penalty; also apply mud risk increment to next 24-48 hours
- Thunderstorm (any intensity): maximum penalty

**Wind scoring:**
- Below 29 km/h (Beaufort 4): no penalty
- 29-49 km/h (Beaufort 5-6): minor penalty; moderate penalty for small dogs under 10 kg
- 50-74 km/h (Beaufort 7-8): heavy penalty for all; woodland routes should be flagged as avoid; moderate penalty for open/sheltered routes
- Above 75 km/h (Beaufort 9+): maximum penalty

**Cold scoring (apply to apparent temperature including wind chill):**
- Above 7C: no penalty for any breed
- 5-7C: minor penalty for small and short-coated breeds only
- 0-5C: minor penalty for all dogs; moderate penalty for small, short-coated, brachycephalic, elderly, puppy
- -4 to 0C: moderate penalty for all; heavy penalty for small, short-coated, elderly, puppy
- Below -4C: heavy penalty for all; maximum penalty for small, short-coated, elderly, puppy

**Ice risk flag:**
- Air temperature at or below 2C: apply ice path risk flag (independent of walk quality score)

**Snow depth modifier:**
- No specific cm threshold available from sources. Flag when snow depth above 10 cm for routes with small dogs or short-legged breeds.

**Mud risk (24-48 hour accumulated precipitation):**
- Less than 2 mm in 48 hours: dry
- 2-10 mm in 48 hours: damp
- 10-25 mm in 48 hours: muddy
- Above 25 mm in 48 hours: very muddy

**Tick risk flag:**
- Temperature above 7C AND humidity above 80 percent AND month is March-October: activate tick awareness flag
- Heighten flag in May-June and September

---

## 9. Sources

**Peer-reviewed research:**

- O'Neill et al. (2022). "Risk Factors for Severe and Fatal Heat-Related Illness in UK Dogs - A VetCompass Study." Veterinary Sciences. PMC9144152. https://pmc.ncbi.nlm.nih.gov/articles/PMC9144152/

- O'Neill et al. (2020). "Incidence and risk factors for heat-related illness (heatstroke) in UK dogs under primary veterinary care in 2016." Scientific Reports. PMC7303136. https://pmc.ncbi.nlm.nih.gov/articles/PMC7303136/

- Drobatz and Macintire (1996). "Pathophysiology of heatstroke in dogs - revisited." PMC5800390. https://pmc.ncbi.nlm.nih.gov/articles/PMC5800390/

- Climate of origin affects tick (Ixodes ricinus) host-seeking behavior in response to temperature. PMC3997332. https://pmc.ncbi.nlm.nih.gov/articles/PMC3997332/

- Frontiers in Animal Science (2025). "Heat stress in domestic dogs: morphological and environmental risk factors for dog welfare in a warming world." https://www.frontiersin.org/journals/animal-science/articles/10.3389/fanim.2025.1679377/full

**UK veterinary and welfare organisations:**

- RSPCA, "Winter and Cold Weather Care for Dogs." https://www.rspca.org.uk/adviceandwelfare/seasonal/winter/pets/dogs (fetched - no specific Celsius thresholds, qualitative guidance only)

- Blue Cross UK, "Dogs and Thunderstorms." https://www.bluecross.org.uk/advice/dog/behaviour-and-training/dogs-and-thunderstorms (sourced via search results)

- Blue Cross UK, "How to Keep Dogs Cool in the Summer Heat." https://www.bluecross.org.uk/advice/dog/how-to-keep-dogs-cool-in-the-summer-heat (sourced via search results - page returned 403 on direct fetch)

- Royal Kennel Club, "Storms guidance." https://www.royalkennelclub.com/health-and-dog-care/health/health-and-care/a-z-of-health-and-care-issues/storms/ (fetched - qualitative guidance, no wind speed thresholds)

- Royal Kennel Club, "Winter dangers to dogs." https://www.royalkennelclub.com/health-and-dog-care/health/health-and-care/a-z-of-health-and-care-issues/winter-dangers-to-dogs/ (fetched - qualitative guidance, no Celsius thresholds)

- PDSA (referenced but not directly fetchable - 404 errors during research). 20C caution threshold attributed to PDSA by multiple secondary UK sources.

**UK vet advisory sources (non-academic):**

- Vets Now, "How Cold Is Too Cold for Dogs." https://www.vets-now.com/pet-care-advice/too-cold-for-dogs/ (fetched - specific Celsius thresholds: 7C, 0C, -4C, -9C)

- Vets Now, "Never walk dogs on hot asphalt." https://www.vets-now.com/2017/06/never-walk-dogs-hot-asphalt-tarmac-pavements-artificial-grass/ (fetched - 52C burn threshold, 25C to 52C air/pavement relationship)

- Julius K9 UK, "When is it too cold to walk your dog." https://julius-k9.co.uk/blog/when-is-it-too-cold-to-walk-your-dog (referenced in search results)

- Animal Friends, "How cold is too cold for dog walks." https://www.animalfriends.co.uk/dog/dog-advice/dog-maintenance-and-safety/how-cold-is-too-cold-for-dog-walks/ (referenced in search results)

- Agria Pet Insurance, "When is it too hot to walk your dog." https://www.agriapet.co.uk/guides-and-advice/when-is-it-too-hot-to-walk-your-dog/ (referenced in search results, direct fetch blocked)

**RVC VetCompass programme:**

- RVC VetCompass, "Excessive exercise responsible for three-quarters of heatstroke cases in dogs." https://www.rvc.ac.uk/vetcompass/news/excessive-exercise-responsible-for-three-quarters-of-heatstroke-cases-in-dogs-study-shows

- RVC VetCompass, "Hot Dogs project overview." https://heatstroke.dog/ (blocked at fetch; data obtained via search results)

**Tick surveillance:**

- UKHSA, "What is Lyme disease and why do we need to be tick-aware?" (2024). https://ukhsa.blog.gov.uk/2024/03/21/what-is-lyme-disease-and-why-do-we-need-to-be-tick-aware/ (blocked at fetch; data obtained via search results)

- UKHSA Data Dashboard, ticks. https://ukhsa-dashboard.data.gov.uk/vectors-and-vector-borne-diseases/ticks

- ECDC Factsheet, Ixodes ricinus. https://www.ecdc.europa.eu/en/disease-vectors/facts/tick-factsheets/ixodes-ricinus (blocked at fetch; data confirmed via multiple search result summaries citing ECDC data)

**Meteorological and environmental:**

- Met Office rainfall intensity classification. Referenced via: https://rainsimulator.com/guides/intensity-categories/ and Met Office UKCP18 factsheet.

- Barani Design, "Rain rate intensity classification." https://www.baranidesign.com/faq-articles/2020/1/19/rain-rate-intensity-classification (blocked at fetch; data obtained via search results)

- FHWA Research - LTPP Guide to Asphalt Temperature. https://www.fhwa.dot.gov/publications/research/infrastructure/pavements/ltpp/98085/tempred.cfm

**Forest school / woodland wind policy:**

- Kids Go Wild Forest School weather policy (Beaufort Force 7 woodland closure). https://www.kidsgowildforestschool.com/weatherpolicy (referenced in search results)

- Kindling Play and Training, "Wind and Woods." https://kindlingplayandtraining.co.uk/forest-school/wind-and-woods/ (blocked at fetch; data obtained via search results)

- Inspired Forest School Training, "Wind speed and gusts." https://www.inspiredforestschooltraining.co.uk/wind-speed-and-gusts/ (blocked at fetch; data obtained via search results)

**Breed-specific and additional sources:**

- AKC, "How the Samoyed's Coat Helps Them Handle Heat and Cold." https://www.akc.org/expert-advice/lifestyle/samoyed-coat-temperature/

- iHeartDogs, "Are Huskies Safe in Cold Weather." https://iheartdogs.com/are-huskies-safe-in-cold-weather/

- Petplace.com, "How Does the Wind Chill Factor Affect Your Dog." https://www.petplace.com/article/dogs/pet-health/how-does-the-wind-chill-factor-affect-your-dog

- Leap Years, "Hot weather hazards: how aging affects your dog's exposure to heat." https://leapyears.com/news/hot-weather-hazards-panting-and-aging-related-heat-exposure/

- Kinship.co.uk, "What temperature is too hot to walk a dog UK." https://www.kinship.co.uk/dog-health/what-temperature-is-too-hot-to-walk-a-dog-uk (blocked at fetch; data obtained via search results)

- Open-Meteo API documentation. https://open-meteo.com/en/docs (inaccessible at fetch time; variable availability confirmed via search results)
