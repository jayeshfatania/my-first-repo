# Sniffout — Weather Research: Breed-Specific Personalisation
*Research conducted: March 2026*

---

## Summary

The research strongly supports building breed-specific weather personalisation. The science is robust, the demand is documented, and a direct US competitor (FourCast) proves the concept — but no UK equivalent exists in an integrated app. The MVP is achievable with simple breed categorisation (not a per-breed lookup) and would deliver immediate, genuine value to owners of the highest-risk breeds — many of which are in the UK top 10.

---

## 1. What Weather Data Actually Matters for Dog Walking

Beyond basic temperature and rain, the following data dimensions have documented relevance to dog safety and comfort:

### 1a. Heat Index ("Feels Like")
**Why it matters:** Dogs cool almost entirely through panting. Panting evaporates moisture from the respiratory tract — but in humid air, evaporation is impaired. A dog that could safely manage 25°C at low humidity may be in danger at the same temperature with 70% humidity.

**The rule of thumb from veterinary practice:**
> Temperature (°F) + Humidity (%) ≥ 150 = dangerous for outdoor exercise

Translated to practical Celsius thresholds (approximate):
- Heat index ≤ 24°C: generally safe for most dogs
- Heat index 24–28°C: caution; watch for panting, slow down
- Heat index 28°C+: high risk; high-risk breeds should not be exercised
- Heat index 32°C+: dangerous for all dogs

**Open-Meteo provides:** apparent temperature (feels-like), humidity, and temperature as separate fields. The heat index is derivable from these.

### 1b. Pavement/Ground Temperature
**Why it matters:** Pavement absorbs heat and can reach temperatures twice the ambient air temperature. Dog paw pads are highly sensitive — burns occur at sustained surface temperatures above ~52°C. At 25°C ambient on a sunny afternoon, pavement can exceed this.

**The 7-second test:** Press the back of your hand on the pavement for 7 seconds. If you can't hold it, it's too hot for paw pads.

**Data available:** Open-Meteo does not directly provide pavement temperature, but it can be estimated from: ambient temperature + direct radiation + time of day. A simple heuristic works well for MVP: if temperature > 22°C and UV index > 5 and time is 10am–6pm → flag pavement risk.

### 1c. UV Index
**Why it matters:** Dogs with light or thin coats are susceptible to sunburn on exposed skin (nose, belly, ear tips). Repeated UV exposure increases skin cancer risk — particularly in Dalmatians, Bull Terriers, Whippets, and other thin/pale-coated breeds.

**Threshold:** UV index ≥ 3 is considered sufficient for skin damage in susceptible dogs. UV ≥ 6 warrants advice for owners of light-coated breeds.

**Open-Meteo provides:** UV index. This is currently unused in Sniffout's weather rendering.

### 1d. Wind Speed
**Why it matters:**
- **Small dogs:** Risk of being physically destabilised or distressed at high wind speeds. The US National Weather Service has issued "small dog warnings" for gusts above 50mph. At lower speeds (20–30mph), small dogs under ~5kg can be significantly affected.
- **Wind chill in cold:** Accelerates hypothermia risk for small/short-coated dogs in cold weather.
- **High winds + anxiety:** Many dogs find strong winds distressing (disorienting smells, unfamiliar sounds, physical discomfort) regardless of size.

**Current implementation:** Sniffout already uses wind data for hazard detection. The refinement needed is size-differentiated thresholds.

### 1e. Pollen Count
**Why it matters:** See Section 3. Pollen is a significant and under-appreciated risk for atopic dogs. Around 10–15% of dogs are estimated to suffer from environmental allergies, with pollen being a primary trigger.

**Data available:** Open-Meteo does provide a pollen API (`european_aqi` endpoint includes grass pollen, tree pollen, weed pollen). This is not currently used in Sniffout.

### 1f. Barometric Pressure
**Why it matters:** There is anecdotal and some clinical evidence that dropping barometric pressure worsens joint pain in dogs with arthritis — the same mechanism reported in humans. Joint fluid viscosity changes with temperature and pressure. The evidence base is limited (mostly observational) but the owner community is vocal about it.

**MVP relevance:** Low priority for MVP — the evidence is weak and it adds complexity. Worth a mention in the report but not recommended for initial implementation.

### 1g. Precipitation Type (Rain vs. Snow vs. Freezing Rain)
Beyond whether it is raining, the type of precipitation matters:
- **Rain:** Primarily a comfort issue for owner and dog; safety concern only in prolonged heavy rain (hypothermia risk for small/short-coated dogs)
- **Snow:** Fun for many dogs, but risk of ice balls forming between paw pads (especially double-coated breeds); rock salt on pavements causes paw irritation
- **Freezing rain / ice:** Slipping hazard for both dog and owner; elderly dogs particularly at risk of falls and joint injury

**Open-Meteo provides:** weather code (WMO codes) distinguishing rain, snow, sleet, freezing rain. Currently Sniffout uses this for general hazard detection but could differentiate further.

---

## 2. Risk Profiles by Dog Type

### 2a. Brachycephalic (Flat-Faced) Breeds

**Definition:** Breeds with significantly shortened skull structure — compresses the soft palate, narrows the nostrils, and reduces trachea width. Panting is the primary cooling mechanism for dogs, and brachycephalic dogs pant less efficiently.

**Evidence (RVC VetCompass UK study, 2020, n=905,543):**
This is the most robust UK-specific dataset on canine heatstroke. Key findings:

| Breed | Odds Ratio vs. Labrador |
|-------|------------------------|
| Chow Chow | 16.61× |
| Bulldog | 13.95× |
| French Bulldog | 6.49× |
| Dogue de Bordeaux | 5.31× |
| Cavalier King Charles Spaniel | 3.45× |
| Pug | 3.24× |

- Brachycephalic dogs overall had **2.10× the odds** of heat-related illness
- 10.4% of brachycephalic dogs in a controlled hot environment trial **could not complete the trial** due to respiratory distress
- Older brachycephalic dogs are at compounding risk: dogs aged 12+ had 1.75× higher odds regardless of breed

**Practical thresholds:**
- Exercise caution above **19°C** for brachycephalic breeds (vs. ~25°C for standard breeds)
- Avoid outdoor exercise above **22°C** in these breeds
- Humidity compounds risk significantly — a humid 20°C day is more dangerous than a dry 24°C day

**UK breed prevalence context:**
French Bulldog is the **3rd most registered breed** in the UK (13,789 registrations in 2024). Pug and Cavalier KCS are also in the top 10. This means a large proportion of Sniffout's target user base owns a dog in this highest-risk category.

---

### 2b. Thick-Coated / Double-Coated Breeds

**Breeds:** Siberian Husky, Alaskan Malamute, Bernese Mountain Dog, Newfoundland, St Bernard, Chow Chow, Rough Collie, Samoyed.

**Heat risk mechanism:** Double coats trap heat and reduce convective cooling. These breeds were bred for cold climates and have limited physiological adaptation to heat.

**Thresholds:**
- Alaskan Malamute: discomfort begins around **21°C (70°F)**
- Husky/Malamute: significant risk above **25°C**
- General guideline: restrict outdoor exercise when apparent temperature > 20°C; keep walks to 15–20 minutes max above 22°C

**Cold weather:** Paradoxically these breeds generally handle cold well, but their thick coats do not protect paw pads. Ice balls can form between toes in snow. Salt/grit on winter pavements causes paw irritation.

**Important note:** Double-coated breeds should **never be shaved** in summer — the undercoat actually insulates against heat as well as cold. Shaving removes the UV barrier and does not cool the dog more effectively.

---

### 2c. Small and Thin-Coated Breeds

**Breeds:** Chihuahua, Yorkshire Terrier, Whippet, Italian Greyhound, Greyhound, Miniature Pinscher, Toy Breeds generally.

**Cold risk:** Small dogs have a high surface area-to-volume ratio, losing body heat rapidly. Chihuahuas are cited as having the greatest difficulty regulating body temperature of any breed.

**Thresholds:**
- Caution below **7°C** for small thin-coated breeds
- Below **0°C**: short, supervised walks only; dog coats recommended
- Below **-5°C**: avoid prolonged outdoor exposure

**Heat risk:** Paradoxically, many small breeds handle heat better than larger ones due to efficient surface heat dissipation — they represent lower risk than large heavy dogs. However, small brachycephalic breeds (Pug, French Bulldog) are still very high risk due to the respiratory constraint.

**UV risk:** Greyhounds, Whippets, Dalmatians, Bull Terriers, and other short/thin-coated pale breeds are susceptible to sunburn and UV-related skin cancer. UV index > 6 warrants a flag for these breeds.

---

### 2d. Large and Heavy Breeds (>30–50kg)

**Breeds:** Great Dane, St Bernard, Newfoundland, Irish Wolfhound, Rottweiler, Mastiff types.

**Heat risk:** Large body mass generates more heat during exercise and makes dissipation harder. The RVC study found dogs over 50kg had **3.42× the odds** of heat-related illness compared to dogs under 10kg.

**Exercise type matters:** 68% of UK heatstroke cases were triggered by walking (not running or fetch). Large dogs exercising at a normal walking pace in heat accumulate heat load faster than small dogs doing the same activity.

**Threshold:** More conservative temperature limits than general guidance — treat large heavy breeds similarly to brachycephalic breeds above ~22°C.

---

### 2e. Elderly Dogs (8+ years, especially 12+)

**Joint and mobility:**
- Cold weather thickens synovial joint fluid, increasing stiffness and pain in arthritic joints
- Reduced blood circulation to extremities in cold worsens inflammation
- Scientific evidence is limited but strongly anecdotally supported and clinically accepted
- Elderly dogs benefit from shorter, more frequent walks rather than one long walk in cold weather

**Heat:**
- Age 12+ was an independent risk factor for heatstroke (OR 1.75× regardless of breed)
- Older dogs also have less efficient cardiovascular response to heat stress

**Practical advice:** In cold weather, recommend shorter walks + consider dog coat. In heat, same thresholds as brachycephalic breeds — early morning/late evening only above 19°C.

---

### 2f. Puppies (Under 12 Months)

**Heat:** Puppies have immature thermoregulation. They should be treated as high-risk in heat — same thresholds as brachycephalic or elderly dogs.

**Cold:** Similarly, puppies lose heat faster than adult dogs. Below 7°C, keep walks short.

**UV:** Puppy skin, especially on non-pigmented areas, is more susceptible to UV damage before full coat development.

---

## 3. Pollen and Dogs

### What Pollen Does to Dogs (Different from Humans)
This is important context: pollen allergy in dogs does **not** primarily cause respiratory symptoms (the way it causes hay fever in humans). In dogs, pollen is the leading trigger of **canine atopic dermatitis** — a chronic inflammatory skin condition.

**Symptoms to watch for:**
- Persistent paw licking and biting (the most common sign)
- Scratching, especially around face, ears, armpits, groin
- Red, inflamed skin
- Ear infections (often recurring)
- Watery or red eyes
- Lethargy on high pollen days

### Breeds Most Susceptible
Breeds with genetic predisposition to atopic dermatitis (and therefore pollen sensitivity):
- West Highland White Terrier (Westie)
- Labrador Retriever
- Golden Retriever
- Boxer
- French Bulldog
- German Shepherd
- English Bulldog
- Cocker Spaniel
- Dalmatian
- Lhasa Apso
- Shih Tzu
- Scottish Terrier
- Boston Terrier

The significance for Sniffout: **Labrador Retriever** (UK's most popular breed by a wide margin — 34,141 registrations in 2024) and **Cocker Spaniel** (2nd, 23,177) are both on this list. Pollen warnings are therefore relevant to the most common dog in the UK.

### UK Pollen Calendar

| Period | Pollen Type | Dog Impact |
|--------|-------------|------------|
| February–May | Tree pollens (hazel, birch, oak) | Moderate — affects more sensitive dogs |
| May–August | Grass pollens | **Worst period** — highest atopic dermatitis flare-ups |
| August–October | Weed pollens (nettle, plantain) | Moderate — tapering season |

Peak risk: **May through July** for most UK dogs with pollen sensitivity.

### Walking Advice on High Pollen Days
Vets and the Met Office both advise:
- **Avoid early morning and early evening** on high pollen days (pollen is highest at these times, counterintuitively — this is the opposite of heat advice, which creates a real conflict for owners)
- Wipe paws and muzzle after every walk — pollen absorption through paw pads is significant
- Avoid long grass (walk on paths and short grass only)
- Bathe weekly during peak season with hypoallergenic shampoo

### Pollen Data Availability
Open-Meteo's `european_aqi` API provides:
- `grass_pollen` (μg/m³)
- `birch_pollen` (μg/m³)
- `alder_pollen` (μg/m³)

These can be bucketed into low/moderate/high thresholds for display. The Met Office publishes a daily UK pollen forecast that could also be referenced.

---

## 4. Existing Apps and Tools

### FourCast (fourcast.live)
**The most direct comparator to the proposed Sniffout feature.**

- US-only email service (not an app)
- Free, delivered by 6:30am daily
- User inputs: dog breed + location
- Covers: pavement temperature, pollen/allergen levels, storm warnings, heat index, wind chill, coat care advice
- Explicitly positions around breed-specific differences: *"Flat noses, thick coats, tiny legs — every breed handles weather differently"*
- Funded by donations; 10% to dog rescue

**Assessment:** FourCast validates the concept entirely. It is doing exactly what Sniffout's breed-specific feature would do, but as a standalone email product, in the US only, with no walk discovery attached. Sniffout can leapfrog it by integrating this intelligence directly into a walk discovery app.

### Petplan Weather Furcast (UK)
- Web tool, not app
- Traffic light system: green / amber / red paw icons based on temperature
- Considers dog size and brachycephalic flag
- Does **not** cover pollen, UV index, wind, or pavement temperature
- Does **not** connect to any walk recommendations

**Assessment:** Proves UK demand for weather personalisation beyond generic advice. Sniffout can go significantly further with the same concept.

### Weather Puppy / Weather Pet / Cats & Dogs Weather
- Dog-themed weather apps — primarily aesthetic, no real dog-specific safety logic
- Not relevant competitors for the feature

### No UK Integrated Solution Exists
There is no product in the UK that combines: walk discovery + weather safety + breed-specific personalisation. This is the gap Sniffout is positioned to fill.

---

## 5. MVP Design Recommendation

Given the research, the simplest effective MVP does not require a full breed database. Instead, a **four-category classification** covers the vast majority of real-world variation:

| Category | Trigger breeds | Key risks |
|----------|---------------|-----------|
| **Flat-faced** | French Bulldog, Pug, Bulldog, Cavalier KCS, Boxer, Shih Tzu, Lhasa Apso, Boston Terrier, Dogue de Bordeaux | Heat at low thresholds; humidity critical; pollen/skin allergy |
| **Thick-coated** | Husky, Malamute, Bernese, Newfoundland, St Bernard, Chow Chow, Samoyed, Collie (rough) | Heat at medium thresholds; ice balls in snow |
| **Small/thin-coated** | Chihuahua, Yorkshire Terrier, Whippet, Greyhound, Toy breeds | Cold; UV sunburn for pale coats |
| **Standard** | Labrador, Cocker Spaniel, Dachshund, Border Collie, Springer Spaniel, Jack Russell, German Shepherd, Golden Retriever and most other breeds | Default thresholds; some pollen sensitivity |

During onboarding or in the Profile tab, the user selects their dog's breed from a list — the app maps it to one of these four categories and adjusts all weather warnings accordingly.

### What changes per category

| Condition | Flat-faced | Thick-coated | Small/thin | Standard |
|-----------|------------|--------------|------------|---------|
| Caution threshold (heat) | 19°C | 21°C | 25°C | 24°C |
| Danger threshold (heat) | 22°C | 25°C | 30°C | 28°C |
| Paw safety warning | Same for all (pavement temp) | Same | Same | Same |
| Cold caution | 5°C | None (cold-tolerant) | 7°C | 3°C |
| Pollen warning | Elevated (higher sensitivity) | Standard | Elevated (UV too) | Standard |
| UV warning | Standard | Standard | Elevated | Standard |
| Wind warning | Standard | Standard | Elevated (physical risk) | Standard |

### Additional inputs (optional, beyond breed)
- **Age:** "Senior (8+)" checkbox adds elderly dog modifiers on top of breed category
- **Weight:** "Overweight" flag — large overweight dogs have 3.4× elevated heatstroke risk per the RVC study

### Data sources needed (all available in Open-Meteo free tier)
- `apparent_temperature` (feels-like/heat index) — already fetched
- `temperature_2m` — already fetched
- `windspeed_10m` — already fetched
- `precipitation` — already fetched
- `uv_index` — **not currently fetched**, needs adding
- `european_aqi` with `grass_pollen`, `birch_pollen` — **not currently fetched**, needs adding

---

## 6. Is This Feature Worth Building?

**Yes. Four reasons:**

1. **The science is clear and actionable.** Unlike many health-adjacent features that rely on weak evidence, the breed-specific heat risk data comes from a 900,000-dog UK study (RVC VetCompass). The brachycephalic risk is not marginal — it is 4–16× elevated. This is meaningful, verifiable guidance.

2. **The most popular UK breeds are disproportionately high-risk.** French Bulldogs (3rd most registered), Cavalier KCS, and Pugs are all in the UK top 10 and all in the highest-risk category. Pollen sensitivity affects Labradors and Cocker Spaniels — the 1st and 2nd most popular breeds. The overlap between "breeds UK owners own" and "breeds that need specific advice" is almost total.

3. **No UK integrated product offers this.** FourCast exists in the US as a standalone email. Petplan's Weather Furcast is a single-metric web tool. Sniffout can be the first UK app to combine walk discovery, live weather, and breed-specific safety intelligence.

4. **It deepens the onboarding relationship without requiring login.** Asking "what breed is your dog?" is a low-friction, genuinely personal question that immediately makes the app feel tailored. It is stored locally (no backend needed for MVP) and makes every subsequent weather display more relevant. This is the kind of personalisation that creates habit and return visits.

---

## Sources

- [RVC VetCompass — Heatstroke incidence and risk factors in UK dogs 2016 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7303136/)
- [RVC — Hot Dogs heatstroke study overview](https://www.rvc.ac.uk/research/news/general/hot-dogs-vetcompass-study-of-heatstroke-in-dogs)
- [RVC — Human heat alerts could prevent canine heatstroke](https://www.rvc.ac.uk/research/research-centres-and-facilities/veterinary-epidemiology-economics-and-public-health/news/new-research-from-the-rvc-suggests-human-heat-health-alerts-could-help-prevent-heatstroke-in-dogs)
- [Veterinary Evidence — Heatstroke and brachycephalic dogs](https://veterinaryevidence.org/index.php/ve/article/download/534/805)
- [PMC — Seasonal weather variations and canine activity (3,153 UK owners)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8614552/)
- [PMC — Pollen allergies in dogs, cats and horses vs. humans](https://pmc.ncbi.nlm.nih.gov/articles/PMC4387677/)
- [Met Office — How hay fever affects pets](https://weather.metoffice.gov.uk/warnings-and-advice/seasonal-advice/health-wellbeing/pollen/pets)
- [PDSA — Summer allergies and pollen in dogs](https://www.pdsa.org.uk/what-we-do/blog/summer-allergies-how-to-protect-your-pets-from-dog)
- [FourCast — dog weather personalisation service](https://www.fourcast.live/)
- [Scottish SPCA — Heat danger warning for dog owners](https://www.scottishspca.org/news/how-hot-is-too-hot-a-warning-to-dog-owners-against-dangerous-walks-as-temperatures-rise-across-the-uk/)
- [Frontiers in Animal Science — Heat stress morphological and environmental risk factors](https://www.frontiersin.org/journals/animal-science/articles/10.3389/fanim.2025.1679377/full)
- [Woofz — Temperature safe range guide](https://www.woofz.com/blog/how-hot-is-too-hot-for-a-dog/)
- [PetMD — Cold weather breeds](https://www.petmd.com/dog/general-health/dog-breeds-that-cant-tolerate-cold-weather)
- [Countryfile — Walking dogs in storms](https://www.countryfile.com/animals/pets/walking-dogs-in-a-storm)
- [Scotsman — 43% of owners walk dogs in dangerous heat](https://www.scotsman.com/lifestyle/too-hot-to-handle-nearly-half-43-per-cent-of-uk-dog-owners-walk-pets-in-dangerous-heat-5238414)
- [Kennel Club breed registration statistics 2024](https://www.thekennelclub.org.uk/media-centre/breed-registration-statistics/)
