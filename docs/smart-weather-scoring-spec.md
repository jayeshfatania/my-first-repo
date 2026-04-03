# Sniffout Smart Weather Scoring Spec
**Date:** 3 April 2026
**Status:** Approved by owner, fact-checked, ready for implementation

---

## Bar Chart Acceptance Criteria

1. Time range: 6am-9pm next day (if currently after 6pm), or 6am-9pm today (if before 6pm). Never overnight hours.
2. 15 bars with hourly labels on EVERY bar (6am, 7am, 8am... 8pm)
3. Bar heights: tallest 72px, shortest 4px. Mixed day shows clear visual peak.
4. Five colour levels: dark green (great 80+), light green (good 60-79), amber (fair 40-59), grey (poor 20-39), red (danger below 20)
5. Reason icons: 12px, directly above each non-great bar, within same column. Five icons only: rain, heat, wind, cold, storm. No darkness icon.
6. Best walk window pill: longest consecutive great+good stretch. "All day" if everything is good. Single best hour if nothing qualifies.
7. Scannable in 2 seconds.

---

## Evidence-Based Scoring Thresholds

### Heat (uses apparent/feels-like temperature to incorporate humidity)

| Range | Penalty | Rating on dry day | Notes |
|---|---|---|---|
| Below 20C | 0 | GREAT | UK vet consensus caution starts at 20C (PDSA) |
| 20-22C | -5 high-risk breeds only, 0 average | GREAT (average), GREAT (high-risk flagged) | Subtle flag for brachycephalic/elderly/giant only |
| 22-25C | -15 all dogs | GOOD | Warm - bring water. Owner observation: Shar Pei shows signs at 22C |
| 25-28C | -40 all dogs | FAIR | Hot - keep it short. Research: 25-26C "heavy penalty" (Barc London, Agria) |
| 28-30C | -60 all dogs | POOR | Too hot for most dogs. Owner requirement: 28C must be POOR |
| 30C+ | -80 all dogs | DANGER | Avoid walking. Research: 27C+ "all sources recommend indoors only" |

Brachycephalic offset: -4C to all thresholds (VetCompass OR data: Bulldog 13.95x, French Bulldog 6.49x risk)

Sources: PDSA consensus (20C), VetCompass PMC9144152, VetCompass PMC7303136, Barc London, Agria Pet Insurance

Note on VetCompass 16.9C median: 68% of exercise-triggered heatstroke was caused by walking. This data informs the conservative approach but 16.9C is not used as a walk avoidance threshold because it includes all contributing factors (obesity, breed, exertion level).

### Humidity Modifier (amplifies heat penalty only)

| Condition | Effect | Source |
|---|---|---|
| RH above 35% when temp above 20C | Panting begins losing effectiveness - flag for awareness | Drobatz & Macintire, PMC5800390 |
| RH above 60% when temp above 22C | Heat penalty multiplied by 1.3 | ESTIMATE - not from source. 60% interpolated between 35% and 80% |
| RH above 80% when temp above 22C | Heat penalty multiplied by 1.6 | 80% RH threshold verified (PMC5800390). 1.6x multiplier is ESTIMATE |

IMPORTANT: The 1.3x and 1.6x multipliers are estimates with no scientific basis. Must be labelled as estimates in methodology page.

### Ground Temperature / Paw Burn (separate flags, not score penalties)

| Condition | Flag | Source |
|---|---|---|
| Air 22C + UV above 3 | Pavement heat warning | Vets Now - pavement reaches 40C+ |
| Air 25C + UV above 3 | Paw burn danger | Vets Now - pavement reaches 52C, burns in under 60 seconds |

### Rain (uses precipitation AMOUNT x probability, not just chance)

| Condition | Penalty | Source |
|---|---|---|
| Below 0.5mm/hr | 0 (drizzle) | Met Office "slight rain" |
| 0.5-4mm/hr with chance above 40% | -15 (moderate rain likely) | Met Office "moderate rain" |
| Above 4mm/hr with chance above 50% | -40 (heavy rain) | Met Office "heavy rain" |
| Thunderstorm weather code | -60 (stay home) | Blue Cross: "stay at home with your dog" |

The scoring uses: penalty = f(precipitation_amount, precipitation_probability). High chance of drizzle is different from high chance of downpour.

### Wind

| Range | Penalty | Source |
|---|---|---|
| Below 29km/h (Beaufort 4) | 0 | Beaufort scale |
| 29-49km/h (Beaufort 5-6) | -15 all, -25 small dogs | Forest school guidance, aggregated sources |
| 50km/h+ (Beaufort 7+) | -45 all, flag woodland | Forest school Force 7 closure (Kids Go Wild policy) |

Note: Woodland flag is from outdoor education policy, not Forestry Commission regulation. Must not be presented as regulation-backed.

### Cold (uses apparent temperature including wind chill)

| Range | Penalty | Source |
|---|---|---|
| Above 7C | 0 | Vets Now |
| 5-7C | -5 small/short-coat only | Julius K9, Animal Friends |
| 0-5C | -10 all, -20 small/short-coat/elderly | Vets Now |
| Below 0C | -25 all, -40 small/elderly | Vets Now |
| Below -4C | -50 all | Vets Now ("potentially unsafe") |

Note: Vets Now says average breeds can manage at -4C with coat. Our threshold is more conservative than their guidance. Defensible as safety-first approach.

---

## Smart Indicators (separate from bar chart score)

### Mud Risk (48-hour cumulative rainfall)

| Rainfall | Label |
|---|---|
| Below 2mm | Dry |
| 2-10mm | Damp |
| 10-25mm | Muddy |
| Above 25mm | Very muddy |

ESTIMATES ONLY - not from published guidance. Label as estimates.

### Tick Risk (binary awareness flag)

| Condition | Flag |
|---|---|
| Temp above 7C AND humidity above 80% AND March-October | Tick risk active |
| Peak: May-June, September | Heightened awareness |

Sources: PMC3997332 (7C questing threshold), ECDC (80% RH), UKHSA (seasonal peaks)

---

## Info Disclaimer

### In the app (below bar chart):
Info pill: "Based on veterinary research - every dog is different"
Tapping opens info sheet with:
- "Walk quality scores are based on published veterinary research and UK weather data. They are general guidance, not veterinary advice. Every dog responds differently to weather conditions. Watch for signs of overheating, discomfort, or distress. If in doubt, consult your vet."
- Link to methodology page on website

### On the website:
- Dedicated methodology page citing all sources
- Clear disclaimer: guidance only, not veterinary advice
- Listed sources with links

---

## Items Flagged as Estimates (must be labelled in methodology)

1. Humidity multipliers (1.3x and 1.6x) - no scientific basis
2. 60% RH threshold - interpolated, not sourced
3. Mud risk thresholds - estimates from soil drainage research
4. Small dog wind instability (32-40km/h) - aggregated sources, no single authority
5. 7-second pavement test - practical heuristic, not clinical evidence
