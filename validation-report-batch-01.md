# Validation Report — Batch 01
**Validator review of:** walks-batch-01-data.md, descriptions-existing-walks.md, descriptions-new-walks.md
**Inputs read:** CLAUDE.md, walks-audit.md, walks-batch-01-data.md, descriptions-existing-walks.md, descriptions-new-walks.md, editor-review-batch-01.md, copywriter-personas.md
**Date:** March 2026

---

## How to Read This Report

Two tasks are reported separately. Each walk is assessed individually where issues exist; clean walks are listed in the summary without individual comment. Each section closes with a verdict. The overall verdict is at the end.

**Verdict key:**
- **PASS** — ready to proceed
- **PASS WITH NOTES** — ready to proceed, minor observations recorded
- **FAIL WITH ISSUES** — corrections required before proceeding

---

---

# TASK 1 — NEW WALK DATA VALIDATION

**Source file:** walks-batch-01-data.md
**Scope:** 20 new walks, coordinates, distances, durations, off-lead status, required fields, duplicate check, badge appropriateness

---

## Systematic Issues — Affect All 20 Walks

These must be corrected across the entire batch before the Developer adds any entries to WALKS_DB.

---

### SYSTEMATIC FAIL 1 — `source` field missing

**Status:** FAIL — affects all 20 walks

The `source` field is required by the WALKS_DB schema per CLAUDE.md (`source: "curated" | "places"`) and is present on all 26 existing walks per the audit. It is absent from every entry in this batch.

**Correction:** Add `source: 'curated'` to all 20 entries. These are editorially verified walks, not Google Places results.

---

### SYSTEMATIC FAIL 2 — `imageUrl: null` should be `imageUrl: ''`

**Status:** FAIL — affects all 20 walks

The schema specifies `imageUrl: string` with the instruction to "use `""` until photo is sourced — brand-green placeholder renders." All 20 entries use `null` instead of an empty string. In JavaScript, `null` is not a string. The placeholder render logic will likely test `if (!walk.imageUrl)` or similar, but the type mismatch is a data quality issue that should be resolved at source.

**Correction:** Replace `imageUrl: null` with `imageUrl: ''` across all 20 entries.

---

## Per-Walk Issues

---

### Walk 01 — arthurs-seat-holyrood

**Coordinate check:** lat 55.9441, lon -3.1615. Arthur's Seat summit is confirmed at 55.9430°N, 3.1616°W (Wikipedia, multiple sources). The given coordinates correspond to the Queen's Drive car park / eastern park entrance — the appropriate trailhead point. ✓

**Distance/duration:** 3.5 miles / 100 min = 2.1 mph average. Slow but appropriate for rocky summit terrain and a moderate scramble. ✓

**Off-lead:** 'partial' — correct. Leads required near Dunsapie and St Margaret's Loch (wildfowl); open hillside off-lead. ✓

**Duplicate check:** No existing walk covers Edinburgh or any part of Scotland. No duplicate. ✓

**Badge:** 'Sniffout Pick' — appropriate for an iconic, widely loved urban landmark walk. ✓

**ISSUE — location string:**
`location: 'Edinburgh, Edinburgh'` — redundant duplication of the city name. The existing WALKS_DB uses the format `'Town/Area, Region'` where region is different from the town (e.g., `'Dorking, Surrey'`, `'Grasmere, Cumbria'`).

**Correction:** `location: 'Edinburgh'` or more precisely `location: 'Holyrood, Edinburgh'` to match the format convention.

---

### Walk 02 — threipmuir-pentland-hills

**Coordinate check:** lat 55.8660, lon -3.3610. Threipmuir Reservoir is confirmed at approximately 55.866°N, 3.36°W (Pentland Hills Regional Park, OS data). Balerno car park on Mansfield Road is consistent with these coordinates. ✓

**Distance/duration:** 4.2 miles / 105 min = 2.4 mph. Appropriate for mixed terrain reservoir loop. ✓

**Off-lead:** 'partial' — correct. Sheep present seasonally; leads near field boundaries. ✓

**Badge:** 'Hidden gem' — appropriate for a less prominent but beautiful reservoir circuit. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 03 — dunkeld-hermitage

**Coordinate check:** lat 56.5610, lon -3.6090. The Hermitage NTS car park is confirmed at approximately 56.564°N, 3.604°W. The given coordinates (56.5610, -3.6090) are approximately 300 metres southwest of the actual car park. This is a minor discrepancy but within acceptable range for a large woodland site with multiple entry points.

**Note for Developer:** When placing the map pin, use 56.5648, -3.6055 if a more precise car park pin is desired.

**Distance/duration:** 3.5 miles / 85 min = 2.47 mph. Consistent with a mid-length forest circuit. ✓

**Off-lead:** 'full' — confirmed. NTS property, no livestock, dogs explicitly welcome throughout. ✓

**Badge:** 'Sniffout Pick' — appropriate for a well-loved, dramatic NTS woodland. ✓

**No blocking issues.** Minor coordinate note above.

---

### Walk 04 — tentsmuir-forest-fife

**Coordinate check:** lat 56.3870, lon -2.8260. Kinshaldy Beach car park confirmed at approximately 56.384°N, 2.826°W (Forestry and Land Scotland, NatureScot). The given coordinates are consistent. ✓

**Distance/duration:** 4.8 miles / 120 min = 2.4 mph. Appropriate for combined forest and beach circuit. ✓

**Off-lead:** 'partial' — confirmed correct via web verification. Dogs off-lead in forest sections; leads required in the Tentsmuir NNR section to protect grey seals and nesting birds. ✓

**Badge:** 'Hidden gem' — appropriate for an under-the-radar coastal forest walk with only 69 reviews. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 05 — balmaha-loch-lomond

**Coordinate check:** lat 56.0840, lon -4.5400. Balmaha village confirmed at 56.084°N, 4.542°W (UK City Map GPS, multiple sources). The National Park visitor centre car park is at the village entrance. ✓

**Distance/duration:** 2.8 miles / 70 min = 2.4 mph. Appropriate for lochshore and forest loop. ✓

**Off-lead:** 'partial' — correct. Highland cattle in fields seasonally. ✓

**ISSUE — badge: null:**
`badge: null` is not a valid schema value. The schema specifies `badge: "Popular" | "Hidden gem" | "New" | "Sniffout Pick" | undefined`. In the existing WALKS_DB, walks without a badge omit the field or use `undefined`. `null` will behave differently from `undefined` in JavaScript comparisons and may cause rendering issues in the badge display logic.

**Correction:** Remove the `badge` field entirely from this entry (or set to `undefined`).

**Note:** Balmaha is a well-known stop on the West Highland Way with loch views. A case could be made for 'Hidden gem' or 'Popular'. With only 56 reviews, omitting the badge or assigning 'Hidden gem' are both defensible. PO to decide if badge should be assigned; if no badge, remove the field rather than setting null.

---

### Walk 06 — pen-y-fan-brecon

**Coordinate check:** lat 51.8791, lon -3.4369. Pont ar Daf car park confirmed at approximately 51.879°N, 3.437°W (National Trust, OS data). Pen y Fan summit at 51.883°N, 3.437°W — the given coordinates correctly represent the car park / walk start, not the summit. ✓

**Distance/duration:** 5.8 miles / 165 min = 2.1 mph. Appropriate for a hard summit walk with 450m ascent over rocky/eroded terrain. ✓

**Badge:** 'Popular' — correct. 3,841 reviews on AllTrails; most popular walk in the Brecon Beacons. ✓

**FAIL — offLead: 'partial' is incorrect**

The data sets `offLead: 'partial'`. However:
- The verification notes in this file state: "Dogs must be kept on leads due to sheep throughout the route."
- The description in descriptions-new-walks.md (Pete's entry) states explicitly: "Dogs must be on leads throughout this route due to sheep — **there is no off-lead opportunity on the standard circuit and that should be stated plainly.**"
- Livestock: true is set, and sheep are present across the full ascent and summit plateau on this route.

`'partial'` implies some off-lead sections exist. There are none on the standard Pont ar Daf circuit. Displaying this as 'partial' in the app would mislead users who rely on this field to filter walks.

**Correction:** `offLead: 'none'`

**location:** 'Libanus, Powys' — accurate (Pont ar Daf car park is near Libanus), though most users would search for 'Brecon Beacons'. Acceptable per existing DB conventions (walks are pinned to nearest town). ✓

---

### Walk 07 — llyn-padarn-llanberis

**Coordinate check:** lat 53.1175, lon -4.1193. The National Slate Museum and Padarn Country Park car park is confirmed at approximately 53.117°N, 4.119°W. Llanberis village centre is slightly further west (~4.125°W); the given coordinates correctly place the trailhead near the museum/country park entrance rather than the village centre. ✓

**Distance/duration:** 5.6 miles / 135 min = 2.49 mph. Appropriate for a mostly-paved lake circuit with some rougher ground. ✓

**Off-lead:** 'partial' — correct. Leads required near nesting birds on north shore; off-lead throughout most of the park. ✓

**Badge:** 'Sniffout Pick' — appropriate. Scenic lake circuit with castle ruins; a strong editorial recommendation. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 08 — rhossili-gower

**Coordinate check:** lat 51.5689, lon -4.2893. Rhossili NT car park confirmed at approximately 51.569°N, 4.291°W (NT, What3Words). ✓

**Distance/duration:** 4.0 miles / 100 min = 2.4 mph. Appropriate for coastal cliff and beach combination. ✓

**Off-lead:** 'full' — verified. Rhossili Beach has no seasonal dog ban and is off-lead year-round. Clifftop grassland also off-lead. Confirmed via web search (Swansea Council dog beach restrictions — Rhossili explicitly exempt). ✓

**Badge:** 'Sniffout Pick' — appropriate. One of the most visually striking coastal walks in Wales. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 09 — alnmouth-northumberland

**Coordinate check:** lat 55.3902, lon -1.6129. Alnmouth confirmed at 55.390°N, 1.612°W (multiple mapping sources). ✓

**Distance/duration:** 3.8 miles / 95 min = 2.4 mph. Appropriate for beach and riverside combination on varied terrain. ✓

**Off-lead:** 'full' — confirmed. No dog restrictions on Alnmouth beach year-round. ✓

**Badge:** 'Hidden gem' — appropriate. 74 reviews, small Northumberland village, genuinely undervisited. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 10 — hardcastle-crags-hebden

**Coordinate check:** lat 53.7692, lon -2.0430. Midgehole car park confirmed at approximately 53.769°N, 2.043°W (latlong.net, NT documentation). ✓

**Distance/duration:** 4.5 miles / 115 min = 2.35 mph. Appropriate for muddy woodland valley — slower pace expected. ✓

**Off-lead:** 'partial' — correct. Leads near café and Gibson Mill area; off-lead in woodland sections. ✓

**ISSUE — badge: null:**
Same issue as Walk 05. Remove the `badge` field or set to `undefined`. PASS otherwise.

---

### Walk 11 — formby-beach-pinewoods

**Coordinate check:** lat 53.5656, lon -3.0965. Lifeboat Road NT car park confirmed at approximately 53.567°N, 3.097°W. Given coordinates are within acceptable range. ✓

**Distance/duration:** 3.5 miles / 90 min = 2.33 mph. Appropriate for mixed terrain including sand dunes. ✓

**Off-lead:** 'partial' — correct. Leads in pinewoods (red squirrel conservation); off-lead on beach. ✓

**Badge:** 'Popular' — appropriate. 341 reviews, famous NT site. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 12 — clumber-park-nottinghamshire

**Coordinate check:** lat 53.2728, lon -1.0643. Clumber Park is confirmed at approximately 53.273°N, 1.071°W. The given longitude (-1.0643) places the pin approximately 450m east of the visitor centre (which is at ~1.071°W). This is within the large estate grounds but slightly off the main car park location.

**Note for Developer:** Consider using 53.2720, -1.0712 for more accurate car park placement.

**Distance/duration:** 6.0 miles / 150 min = 2.4 mph. Appropriate for a gentle estate lakeside circuit. ✓

**Off-lead:** 'partial' — correct. Leads near kitchen garden only; off-lead for the vast majority. ✓

**ISSUE — badge: null:**
Same issue as Walk 05. Remove field or set to `undefined`.

---

### Walk 13 — sherwood-forest-major-oak

**Coordinate check:** lat 53.1687, lon -1.0934. Sherwood Forest visitor centre confirmed at 53.168737°N, 1.09341°W (multiple sources). ✓

**Distance/duration:** 2.5 miles / 60 min = 2.5 mph. Appropriate for a short, easy mixed-terrain circuit. ✓

**Off-lead:** 'partial' — correct. Leads near visitor centre and the Major Oak; off-lead in broader Budby South Forest. ✓

**Badge:** 'Popular' — appropriate. Famous location with 265 reviews. ✓

**Management attribution — clarified, not an error:**

Both the verification notes in this data file and the description reference "RSPB management." Web verification confirms: the RSPB has managed the Sherwood Forest visitor centre and nature reserve since 2015, with a new visitor centre built in 2018. The RSPB leads a partnership that includes the Woodland Trust, Sherwood Forest Trust, and Thoresby Estate, under the auspices of Nottinghamshire County Council. "RSPB-managed" is therefore broadly accurate. The description's "per RSPB management guidance" is acceptable.

This is not an error. No correction required.

**No blocking issues.** PASS (subject to systematic fixes).

---

### Walk 14 — cannock-chase-birches-valley

**Coordinate check:** lat 52.7522, lon -1.9724. Birches Valley Forest Centre confirmed at approximately 52.752°N, 1.970°W (Mapcarta, Forestry England). ✓

**Distance/duration:** 5.0 miles / 125 min = 2.4 mph. Appropriate for an AONB forest circuit. ✓

**Off-lead:** 'full' — correct. No livestock, open access land under CRoW. ✓

**Badge:** 'Sniffout Pick' — appropriate. Strong dog-walking destination in an AONB. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 15 — lickey-hills-birmingham

**Coordinate check:** lat 52.3762, lon -2.0044. Lickey Hills visitor centre confirmed at approximately 52.376°N, 2.004°W (Mapcarta). ✓

**Distance/duration:** 3.2 miles / 80 min = 2.4 mph. Appropriate for a moderate country park walk with hills. ✓

**Off-lead:** 'partial' — correct. Some areas on-lead; open to dogs generally. ✓

**ISSUE — badge: null:**
Same issue as Walk 05. Remove field or set to `undefined`.

---

### Walk 16 — kielder-water-forest

**Coordinate check:** lat 55.2340, lon -2.5803. Kielder Castle confirmed at 55.233982°N, 2.5802985°W (RatedTrips, Day Out With The Kids). ✓

**Distance/duration:** 2.8 miles / 70 min = 2.4 mph. Consistent with Duke's Trail documentation. ✓

**Off-lead:** 'full' — correct. No livestock, forest throughout. ✓

**Badge:** 'Hidden gem' — appropriate. Remote Northumberland forest, only 38 reviews. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 17 — dunwich-heath-suffolk

**Coordinate check:** lat 52.2560, lon 1.6210. Note positive longitude — correct for Suffolk (east of the prime meridian). Dunwich village is at 52.277°N, 1.629°E; the Heath is confirmed south of the village at approximately 52.256°N, 1.621°E, matching the given coordinates. ✓

**Distance/duration:** 2.5 miles / 65 min = 2.31 mph. Consistent with the NT Woof Walk documentation. ✓

**Off-lead:** 'partial' — correct. Leads on heath March–August (ground-nesting birds); off-lead outside nesting season and on beach year-round. ✓

**Badge:** 'Hidden gem' — appropriate. Quietly special heathland site, 94 reviews. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 18 — thetford-forest-high-lodge

**Coordinate check:** lat 52.4621, lon 0.6747. Note positive longitude — correct for Norfolk/Suffolk border (east of prime meridian). High Lodge Forest Centre is at grid reference TL807864, which converts to approximately 52.462°N, 0.674°E. ✓

**Location string:** 'Brandon, Suffolk' — High Lodge's postal address is Brandon, Suffolk IP27 0AF. ✓

**Distance/duration:** 4.0 miles / 100 min = 2.4 mph. The Firecrest Trail at High Lodge is documented at 4 miles. ✓

**Off-lead:** 'partial' — correct. Dedicated off-lead exercise area; leads on waymarked trails. ✓

**ISSUE — badge: null:**
Same issue as Walk 05. Remove field or set to `undefined`.

---

### Walk 19 — baggy-point-croyde

**Coordinate check:** lat 51.1300, lon -4.2251. Baggy Point/Croyde area confirmed at 51.130°N, 4.225°W (Walking Britain, National Trust). ✓

**Distance/duration:** 3.2 miles / 80 min = 2.4 mph. Appropriate for a coastal headland circuit with some field paths. ✓

**Off-lead:** 'partial' — correct. Leads on clifftop sections (nesting birds, sheer drops) and near livestock in fields. Beach has seasonal dog ban May–September. ✓

**hasStiles: true** — confirmed. Stiles present on field paths. ✓

**livestock: true** — confirmed. Sheep in fields. ✓

**Badge:** 'Hidden gem' — appropriate. North Devon headland, 63 reviews, genuinely undervisited. ✓

**No issues.** PASS (subject to systematic fixes).

---

### Walk 20 — bute-park-cardiff

**Coordinate check:** lat 51.4846, lon -3.1853. Bute Park main entrance confirmed at approximately 51.485°N, 3.185°W (Apple Maps, topographic map data). ✓

**Distance/duration:** 3.0 miles / 70 min = 2.57 mph. Appropriate for a flat, paved urban circuit. ✓

**Off-lead:** 'partial' — correct. Leads near café areas, road crossings, and sports pitches; off-lead on open parkland. ✓

**hasParking: false** — confirmed. No on-site parking; nearest pay car park is off-site. ✓

**Badge:** 'Popular' — appropriate. Central Cardiff, major tourist draw adjacent to Cardiff Castle. ✓

**ISSUE — location string:**
`location: 'Cardiff, Cardiff'` — same redundant duplication as Walk 01.

**Correction:** `location: 'Cardiff'` or `location: 'City Centre, Cardiff'` to match format convention.

---

## Duplicate Check

No IDs in the 20 new walks match any of the 26 existing WALKS_DB walk IDs. All new walks cover regions not present in the existing database (Scotland, Wales, Northern England, Midlands, East of England, South West coastal). No geographic overlap with existing walks at coordinate level. ✓

---

## Task 1 — Corrections Summary

### Systematic (apply to all 20 entries)

| # | Field | Current value | Correct value |
|---|---|---|---|
| S1 | `source` | missing | `'curated'` |
| S2 | `imageUrl` | `null` | `''` |

### Per-walk corrections

| Walk ID | Field | Current value | Correct value |
|---|---|---|---|
| arthurs-seat-holyrood | `location` | `'Edinburgh, Edinburgh'` | `'Edinburgh'` or `'Holyrood, Edinburgh'` |
| balmaha-loch-lomond | `badge` | `null` | omit field |
| pen-y-fan-brecon | `offLead` | `'partial'` | `'none'` |
| hardcastle-crags-hebden | `badge` | `null` | omit field |
| clumber-park-nottinghamshire | `badge` | `null` | omit field |
| lickey-hills-birmingham | `badge` | `null` | omit field |
| thetford-forest-high-lodge | `badge` | `null` | omit field |
| bute-park-cardiff | `location` | `'Cardiff, Cardiff'` | `'Cardiff'` |

### Minor notes (no correction required, flag for awareness)

| Walk ID | Note |
|---|---|
| dunkeld-hermitage | Coordinates ~300m SW of actual car park; acceptable, note in pin placement |
| clumber-park-nottinghamshire | Coordinates ~450m east of visitor centre; note in pin placement |
| balmaha-loch-lomond | Walk is on the West Highland Way and visually prominent — PO to consider adding 'Hidden gem' or 'Popular' badge rather than no badge |

---

## Task 1 Verdict

**FAIL WITH ISSUES**

2 systematic corrections required (affect all 20 walks), 6 per-walk corrections required (5 `badge: null`, 1 `offLead` error), 2 location string redundancies. The `offLead: 'partial'` error on pen-y-fan is the only issue that would actively mislead users; the remainder are schema conformance issues.

Corrections are mechanical. Once applied, the data is ready for Developer.

---

---

# TASK 2 — DESCRIPTION VALIDATION

**Source files:** descriptions-existing-walks.md (26 walks), descriptions-new-walks.md (20 walks)
**Scope:** Factual accuracy, invented content, tone, sentence count (2–4), persona usernames

---

## Persona Attribution Format — Minor Issue

**Status:** Minor flag

The description files use PERSONA: [First name] (e.g., `PERSONA: Deborah`, `PERSONA: Pete`). The copywriter-personas.md file defines usernames as DeborahH, jamieok, morag83, PeteR63, and Priya&Pretzel respectively.

The persona voices are correctly applied and consistently executed — this is a production metadata question, not a content error. However, for traceability between the description file and the persona spec, the PERSONA field should use the username (e.g., `PERSONA: DeborahH`, `PERSONA: PeteR63`) rather than the first name.

**Recommendation:** Copywriter to update the PERSONA field in both description files to match the username from copywriter-personas.md. No change to descriptions themselves required.

---

## Editor-Identified Issues — Validator Confirmation

The Editor flagged four systemic issues in editor-review-batch-01.md. All four are confirmed by this validator. Status on each:

---

### Issue 1 — Walk-name / location-name openers (15 entries)

**Validator verdict: CONFIRMED — affects 13 entries requiring mandatory fixes**

The brief prohibits descriptions opening with the walk name or location name as subject. The editor identified 15 entries; borderline cases (balmaha-loch-lomond, kielder-water-forest, sherwood-forest-major-oak) are considered soft passes by the editor, and the validator agrees with those assessments.

**13 entries requiring first-sentence rewrite** (rewrites already provided by Editor in editor-review-batch-01.md — Copywriter to apply):

| Walk ID | Persona | Opening issue |
|---|---|---|
| leith-hill | Pete | "Leith Hill is access land…" |
| newlands-corner | Pete | "Newlands Corner is a good base…" |
| the-hurtwood | Pete | "The Hurtwood is private land…" |
| llyn-padarn-llanberis | Pete | "The circuit of Llyn Padarn runs…" |
| cannock-chase-birches-valley | Pete | "Birches Valley is the best access point…" |
| arthurs-seat-holyrood | Jamie | "Arthur's Seat in the middle of a city…" |
| alnmouth-northumberland | Jamie | "Alnmouth is one of those quietly brilliant places…" |
| baggy-point-croyde | Jamie | "Baggy Point is a National Trust headland…" |
| rhossili-gower | Priya | "Rhossili might be the most photogenic walk in Wales…" |
| dunwich-heath-suffolk | Priya | "Dunwich Heath is one of those National Trust spots…" |
| thetford-forest-high-lodge | Deborah | "High Lodge is a really well-organised base…" |
| shere-village | Deborah | "Shere is a genuinely lovely Surrey village…" |
| bute-park-cardiff | Priya | "We loved this one for a city walk…" (opener fix; see Issue 2 also) |

All editor-suggested rewrites are accepted. Copywriter to apply verbatim or equivalent.

---

### Issue 2 — Priya "We loved/love this one" repeated opener

**Validator verdict: CONFIRMED — 3 entries, all requiring fixes**

Present in wimbledon-common, st-marthas-hill, and bute-park-cardiff. All three need opener changes. Editor-suggested rewrites accepted for all three. Copywriter to apply.

---

### Issue 3 — Deborah "which is always a bonus" frequency

**Validator verdict: CONFIRMED — 6 entries with the sign-off, 4 must be removed**

Current tally:

| Walk ID | Sign-off present | Action |
|---|---|---|
| box-hill-loop | Yes | **Retain** |
| ashridge-estate | Yes | **Retain** |
| burley-new-forest | Yes | Remove — editor rewrite provided |
| shere-village | Yes | Remove — editor rewrite provided |
| cuckmere-haven | Yes | Remove — editor rewrite provided |
| threipmuir-pentland-hills | Yes | Remove — editor rewrite provided |

Copywriter to apply all four removals using the editor's suggested closers.

---

### Issue 4 — Sentence count exceeding 2–4 guideline

**Validator verdict: CONFIRMED — consolidations required for 3 entries**

Nine descriptions run to 5 sentences. The editor correctly assessed that most are justified by essential safety or access information. The three consolidations explicitly required by the editor are:

| Walk ID | Action |
|---|---|
| frensham-common | Consolidate sentences 4–5 |
| formby-beach-pinewoods | Consolidate sentences 3–4 |
| clumber-park-nottinghamshire | Consolidate sentences 4–5 |

Editor rewrites accepted. Copywriter to apply.

The remaining six five-sentence entries (richmond-park, seven-sisters, haytor-dartmoor, burley-new-forest, malham-cove, hardcastle-crags-hebden, balmaha-loch-lomond, kielder-water-forest) are accepted as-is per editor's assessment.

---

## Additional Issues Found by Validator

The following were not identified in the Editor's review.

---

### NEW FAIL — pen-y-fan description: directional error

**Walk ID:** pen-y-fan-brecon
**Persona:** Pete
**Status:** FAIL — factual error

The description states: *"the views north over the Neuadd Reservoirs and south across the Vale of Neath are exceptional in clear conditions."*

**The Neuadd Reservoirs are to the SOUTH of Pen y Fan, not the north.** Confirmed via web verification:
- Pen y Fan summit: 51.883°N, 3.437°W
- Lower Neuadd Reservoir: approximately 51.858°N, 3.465°W — this is south-southwest of the summit
- Looking north from Pen y Fan you see Brecon town and the northern plain, not the reservoirs
- Routes approaching from the Neuadd Reservoirs ascend from the south — walkers looking back see the reservoirs behind them to the south, not ahead to the north

This is a factual directional error that would mislead users orienting themselves on the walk.

**Required correction:** Change "views north over the Neuadd Reservoirs and south across the Vale of Neath" to "views south over the Neuadd Reservoirs and further south toward the Vale of Neath."

The Vale of Neath direction is also south-southeast from Pen y Fan — the "south across the Vale of Neath" element is directionally plausible. The sole error is the "north" before Neuadd Reservoirs.

**Flag to Copywriter for rewrite of that clause only. Pete's voice and the surrounding sentences are otherwise clean.**

---

### Factual claim reviewed and confirmed accurate — Sherwood Forest / RSPB

The description for sherwood-forest-major-oak attributes management to the RSPB ("per RSPB management guidance," "RSPB-managed car park"). The Editor did not flag this. The Validator investigated.

**Verdict: accurate.** The RSPB has managed the Sherwood Forest visitor centre and nature reserve since 2015, as lead organisation in a partnership with the Woodland Trust, Sherwood Forest Trust, and Thoresby Estate. A new RSPB visitor centre opened August 2018. "Free for RSPB members" for car parking is therefore correct. No correction required.

---

## Factual Accuracy — All Other Claims

The validator has reviewed all remaining factual claims in both description files against known geography, named facilities, historical details, and access conditions. The following checks were conducted:

**Confirmed accurate (selected key claims):**

| Walk ID | Claim checked | Verdict |
|---|---|---|
| stanage-edge | Grouse shooting from 12th August | ✓ Correct (Glorious Twelfth) |
| leith-hill | Highest point in south-east England | ✓ Correct (294m tower summit) |
| epsom-common | Medieval stew ponds | ✓ Correct |
| malham-cove | Limestone pavement with grykes | ✓ Correct |
| haytor-dartmoor | Granite tramway between the tors | ✓ Correct (Haytor Granite Tramway, 1820s) |
| grasmere-lake | Famous Grasmere gingerbread | ✓ Correct |
| stanage-edge | Stanage End to High Neb ridge | ✓ Both are real geographic features on the edge |
| bookham-common | SSSI, veteran oak woodland, wet carr | ✓ Correct |
| hampstead-heath | Vale of Health as quieter area | ✓ Correct |
| richmond-park | 2,500 acres | ✓ Correct (955 ha = 2,360 acres; "2,500 acres" is the commonly cited round figure) |
| dunkeld-hermitage | Giant Douglas firs | ✓ Correct (some of the tallest in the UK) |
| hardcastle-crags-hebden | Hebden Water as the stream name | ✓ Correct |
| clumber-park-nottinghamshire | Gothic revival chapel as landmark | ✓ Correct |
| balmaha-loch-lomond | Oak Tree Inn, Balmaha | ✓ Real pub, dog-friendly |
| llyn-padarn-llanberis | Dolbadarn Castle, 13th-century Welsh fortress | ✓ Correct |
| kielder-water-forest | Largest working forest in England | ✓ Correct |
| baggy-point-croyde | Croyde Bay north, Morte Bay south of headland | ✓ Correct |
| rhossili-gower | Off-lead year-round (no seasonal ban) | ✓ Confirmed via web verification |

**No invented landmarks, facilities, or features found** in either description file. All named locations, cafés, geographical features, and access conditions checked are real and accurately described.

---

## Tone Review

All 46 descriptions are appropriate in tone. Persona voices are warmly distinct:
- Deborah's reassurance and dog-welfare focus ✓
- Jamie's dry directness and sardonic honesty ✓
- Morag's matter-of-fact Scottish register ✓
- Pete's forensic access-conditions authority ✓
- Priya's enthusiastic first-person storytelling ✓

No offensive, insensitive, or inappropriate content found in any entry. The Pen y Fan description's "that should be stated plainly" (Pete's voice, referring to the no off-lead note) is frank rather than harsh and is entirely appropriate. ✓

---

## Entries Confirmed Clean — No Validator Action Required

The following entries pass factual, tone, and length checks with no additional issues beyond what the Editor has already addressed:

**Existing walks (no issues):** box-hill-loop, richmond-park, hindhead-common, seven-sisters, devils-dyke, ashridge-estate, hampstead-heath, ranmore-common, haytor-dartmoor, stanage-edge, malham-cove, grasmere-lake, headley-heath, bookham-common, epsom-common, cissbury-ring

**New walks (no issues):** threipmuir-pentland-hills, dunkeld-hermitage, tentsmuir-forest-fife, balmaha-loch-lomond, hardcastle-crags-hebden, formby-beach-pinewoods\*, clumber-park-nottinghamshire\*, alnmouth-northumberland, cannock-chase-birches-valley, lickey-hills-birmingham, kielder-water-forest, dunwich-heath-suffolk, thetford-forest-high-lodge, baggy-point-croyde, bute-park-cardiff

\*subject to editor-specified consolidation.

---

## Task 2 — Corrections Summary

### Editor-identified fixes (all confirmed — Copywriter to apply)

| Type | Count | Action |
|---|---|---|
| Walk-name opener rewrites | 13 entries | Apply editor's suggested rewrites |
| Priya "We loved/love this one" opener | 3 entries | Apply editor's suggested rewrites |
| Deborah "which is always a bonus" removals | 4 entries | Apply editor's suggested closers |
| Five-sentence consolidations | 3 entries | Apply editor's consolidations |
| **Total editor-specified edits** | **23** | |

### Validator-identified additions

| Walk ID | Issue | Action |
|---|---|---|
| pen-y-fan-brecon | "views north over the Neuadd Reservoirs" — direction is south | Copywriter to change "north" to "south" |

### Minor non-blocking

| Issue | Action |
|---|---|
| Persona field uses first names, not usernames | Copywriter to update PERSONA fields to DeborahH / jamieok / morag83 / PeteR63 / Priya&Pretzel in both files |

---

## Task 2 Verdict

**FAIL WITH ISSUES**

The descriptions are strong in voice, detail, and accuracy. No invented content found. One additional factual error (Pen y Fan directional) identified beyond the Editor's review. All other factual claims verified as accurate.

The batch is not currently editor-ready because the editor's corrections have not yet been applied — the description files still contain the unfixed versions. Once the Copywriter applies all 23 editor fixes plus the 1 validator addition (24 total targeted edits), the batch should return for a final validator sign-off before passing to the Developer.

---

---

# Overall Verdict

**NOT READY FOR DEVELOPER**

| Task | Verdict | Blocker |
|---|---|---|
| Task 1 — Data | FAIL WITH ISSUES | 2 systematic fields + 8 per-walk corrections |
| Task 2 — Descriptions | FAIL WITH ISSUES | 24 targeted edits not yet applied |

## Required before re-submission

**Developer data file (walks-batch-01-data.md):**
1. Add `source: 'curated'` to all 20 entries
2. Change `imageUrl: null` to `imageUrl: ''` on all 20 entries
3. Change pen-y-fan-brecon `offLead: 'partial'` to `offLead: 'none'`
4. Remove `badge: null` from balmaha-loch-lomond, hardcastle-crags-hebden, clumber-park-nottinghamshire, lickey-hills-birmingham, thetford-forest-high-lodge (5 entries)
5. Fix `location: 'Edinburgh, Edinburgh'` → `'Edinburgh'` (or `'Holyrood, Edinburgh'`)
6. Fix `location: 'Cardiff, Cardiff'` → `'Cardiff'`

**Copywriter (descriptions-existing-walks.md and descriptions-new-walks.md):**
7. Apply all 23 editor-specified first-sentence rewrites, closer rewrites, and consolidations (full detail in editor-review-batch-01.md)
8. Fix pen-y-fan-brecon: change "north over the Neuadd Reservoirs" to "south over the Neuadd Reservoirs"
9. Update PERSONA fields to use usernames (DeborahH, jamieok, morag83, PeteR63, Priya&Pretzel)

**After corrections:** Re-submit data file and both description files for final validator sign-off. Expected to pass clean — no structural or substantive issues exist, only the corrections above.

---

*Validation report compiled by: Validator*
*Report date: March 2026*
