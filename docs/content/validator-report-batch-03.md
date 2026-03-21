# Validator Report — Batch 03
**Batch scope:** 20 walk descriptions
**Validator:** Final quality check before Developer handoff
**Date:** 2026-03-18
**Sources cross-referenced:** walks-batch-03-data.md, descriptions-batch-03.md, editor-review-batch-03.md, copywriter-personas.md

---

## 1. EXECUTIVE SUMMARY

**Overall status: NOT YET READY FOR DEVELOPER HANDOFF**

Two issues require resolution before this batch can go to the Developer:

1. **white-park-bay** — description states seasonal beach restrictions that contradict the data file, which says "no seasonal restrictions." One source is wrong. Must be resolved.
2. **dovestone-reservoir** — data shows `livestock: true` and `hasStiles: true` but the description implies off-lead access without mentioning either. Safety concern.

All four editorial fixes have been correctly applied. All carry-forward rules are clean. Sixteen of twenty descriptions are ready.

---

## 2. DATA INTEGRITY: SUMMARY TABLE ERRORS

**Critical note for the Developer:** The summary table at the bottom of walks-batch-03-data.md contains multiple errors. It must not be used. Use only the individual walk data entries.

Specific summary table errors confirmed:

| Walk | Table says | Data entry says | Correct value |
|---|---|---|---|
| cave-hill-belfast | offLead: Partial | offLead: 'none' | none |
| cave-hill-belfast | distance: 3.3mi | distance: 4.5 | 4.5 |
| farley-mount | offLead: Full | offLead: 'partial' | partial |
| savernake-forest | offLead: Full | offLead: 'partial' | partial |

The descriptions correctly reflect the individual data entries, not the table. The table is a non-authoritative artefact and should be discarded.

---

## 3. INDIVIDUAL VALIDATION

---

### cave-hill-belfast | Pete
**Status: PASS**

- offLead 'none' correctly reflected: "Belfast City Council bylaws require dogs to be kept on leads throughout" ✓
- No implication of any off-lead opportunity ✓
- McArt's Fort named and described as Iron Age promontory fort ✓
- Belfast Lough named ✓
- Belfast Castle car park as start point ✓
- Distance 4.5 miles stated correctly ✓
- Apostrophe drops: "doesnt", "its" — correct Pete imperfections ✓
- Data shows livestock: true (cattle on hillside). Description does not mention cattle. Not flagged as critical — the universal lead requirement covers this — but worth noting for completeness.
- 3 sentences ✓ Hyphens only ✓

---

### tollymore-forest | Deborah
**Status: PASS**

- offLead 'partial' correctly reflected: "off the lead through the open forest sections, though the signs do ask for leads near the campsite and visitor area" ✓
- River Shimna named ✓
- Arched stone bridges ✓ (verified in data)
- "around £5" paid parking ✓ (data confirms £5/car)
- Bryansford Road entrance named ✓
- livestock: false — no mention of livestock ✓
- Deborah's "Do bear in mind" not present here but water mention and older dog consideration absent — acceptable, not required in every entry
- 3 sentences ✓ Hyphens only ✓

---

### white-park-bay | Morag
**Status: FLAG — factual discrepancy, requires resolution**

The description states: "The beach is off the lead year-round **apart from the western section between May and September when it's restricted** (signed on site)."

The data file states: "Dogs welcome on the beach year-round **with no seasonal restrictions**."

These directly contradict each other. One of them is wrong.

The description also states the `offLead` value is 'partial' in the data, and the Researcher's verification notes mention "Dogs on short leads along the clifftop and near nesting bird areas (chalk grassland, spring/summer)" — which implies seasonal restrictions do exist in some form, just not framed as a beach restriction.

**Action required:** The Researcher must confirm whether White Park Bay beach has seasonal dog restrictions on the western section. National Trust beaches on the Causeway Coast commonly have nesting bird restrictions. If restrictions exist, the data field note is wrong. If no restrictions, the description must be amended to remove the seasonal caveat.

This cannot be resolved by the Validator alone. Flagged for Researcher clarification.

---

### farley-mount | Deborah
**Status: PASS**

- offLead 'partial' correctly reflected: "off the lead for most of the rest" with leads in livestock sections ✓
- livestock: true — "cattle and ponies graze in the enclosed sections" ✓
- West Wood named ✓
- Pyramid folly at summit ✓
- "all kissing gates rather than stiles" — data confirms no stiles, kissing gates ✓
- Free parking at Sparsholt entrance ✓
- 3 sentences ✓ Hyphens only ✓

---

### lepe-country-park | Priya
**Status: PASS**

- Fix 4 confirmed: "which is a genuine bonus" replaced with "Pretzel didn't have a single complaint about the terrain" ✓
- offLead 'partial' correctly implied: seasonal restrictions on main beach, paddling area open year-round ✓
- Dog paddling area confirmed ✓
- Solent shore ✓
- Isle of Wight views ✓
- Seasonal restrictions April–September ✓ (data confirms)
- Paid parking, Hampshire County Council ✓
- livestock: false — no mention ✓
- 3 sentences ✓ Hyphens only ✓

---

### savernake-forest | Pete
**Status: PASS**

- offLead 'partial' correctly reflected: off-lead in open forest, leads in gated cattle enclosures ✓
- livestock: true — "gated enclosures contain cattle in some sections" ✓
- Grand Avenue described as "3.9 miles dead straight and beech-lined" ✓ (data confirms 3.9 miles)
- Permissive paths vs public rights of way distinction ✓
- "privately owned forest managed under Crown Forestry — the only one of its kind in England" ✓ (data confirms)
- Postern Hill car park, A346, SN8 3HP, free ✓
- "its leads-on there" — apostrophe drop correctly applied ✓
- 4 sentences ✓ Hyphens only ✓

---

### valley-of-rocks-lynton | Jamie
**Status: PASS — data note for Developer**

- offLead 'none' correctly reflected: "Not an off-lead walk at all" ✓
- "Feral mountain goats" correctly named as feral ✓
- Bristol Channel views ✓
- South West Coast Path named ✓

**Data note for Developer (not a description error):** The data entry has `livestock: true` but the Researcher's own verification notes say "No livestock (goats are feral/wild)." This is an internal contradiction in the data file. The description correctly identifies the goats as feral, which is accurate. The Developer should set `livestock: false` and rely on the description to explain the goat/lead situation. Or — if the app uses the `livestock` field to trigger a warning UI — keeping it `true` may be intentional as a precautionary flag. PO decision required.

- 3 sentences ✓ Hyphens only ✓

---

### quantock-hills-staple-plain | Morag
**Status: PASS**

- offLead 'partial' correctly reflected: "range free for most of the circuit" with nesting season caveat ✓
- "Views across to Wales and down to Exmoor" ✓ (data confirms both)
- "March to July ground-nesting season" ✓ (data confirms)
- Staple Plain car park named ✓
- Nether Stowey pub mentioned ✓ (Morag café/pub requirement met)
- livestock: false — no livestock mentioned ✓
- Fragment opener "Proper hill ground this" — Morag imperfection ✓
- 3 sentences ✓ Hyphens only ✓

---

### mallards-pike-forest-of-dean | Pete
**Status: PASS**

- offLead 'full' correctly reflected: "full open access throughout... range freely from the car park to the furthest trail junction without going near a lead" ✓
- livestock: false — "no livestock" stated explicitly ✓
- Distance 3.5 miles ✓
- Lake circuit half a mile ✓ (data confirms 0.5 miles)
- "designated dog dip area on the far bank" ✓ (data confirms "far side of the lake")
- Paid car park up to £5 ✓
- "follow the Go Ape signs" ✓ (data confirms)
- "theres" — apostrophe drop ✓
- 3 sentences ✓ Hyphens only ✓

---

### loch-morlich-glenmore | Morag
**Status: PASS — minor inaccuracy note**

- offLead 'partial' correctly reflected: off-lead with nesting season caveat ✓
- "Scots pine" ✓
- "Cairngorm plateau as your backdrop" ✓
- "Sandy beach... unusually for a Highland loch" ✓ (data confirms award-winning sandy beach)
- "April to August bird nesting season" ✓
- Café mention satisfies Morag requirement ✓

**Minor inaccuracy note:** "The Glenmore Lodge cafe is right by the car park" — Glenmore Lodge (the national outdoor training centre) is approximately 1km from the main Loch Morlich car park at the Glenmore Forest visitor area. The café at the car park is the Glenmore Forest visitor centre café, not specifically Glenmore Lodge. This is a minor naming conflation. The café exists and is in the right area; the attribution is slightly off. Suggest changing to "the cafe at the Glenmore visitor centre" if precision is required, but this is low priority.

- 3 sentences ✓ Hyphens only ✓

---

### robin-hoods-bay | Deborah
**Status: PASS**

- offLead 'partial' correctly reflected: clifftop and beach off-lead, farm field section on-lead ✓
- livestock: true — "cattle and sheep on that stretch" ✓
- Cleveland Way named ✓
- Boggle Hole named ✓ (stream detail accurate — Mill Beck crosses the beach at Boggle Hole)
- Village car park ✓
- "Do bear in mind" ✓ Deborah vocabulary
- hasStiles: true per data — description does not mention stiles. Not a critical omission given lead-on sections cover the stile areas, but worth noting.
- 3 sentences ✓ Hyphens only ✓

---

### hamsterley-forest | Morag
**Status: PASS**

- offLead 'partial' correctly reflected: "range free once you're past the visitor centre" ✓
- Orange Trail 4.5 miles ✓
- "two becks running through it" ✓ (data confirms Bedburn Beck and forest becks)
- livestock: false — no mention ✓
- "visitor centre has a cafe" ✓
- Morag café/pub requirement met ✓
- "Hamsterley" in sentence 1 — flagged as borderline by Editor, accepted as pass ✓
- 3 sentences ✓ Hyphens only ✓

---

### gibraltar-point-lincolnshire | Priya
**Status: PASS**

- Fix 1 confirmed: "We stumbled across" opener replaced with "A rainy October weekend and it turned out to be one of the better wild beach walks we've done" ✓ No variation of "stumbled" present ✓
- offLead 'partial' implied (off-lead on beach, leads in nesting bird areas) ✓
- "genuinely remote feel even though it's only a couple of miles south of Skegness" — data says "3 miles south of Skegness." "A couple of miles" typically implies 2. A minor looseness in a conversational description; acceptable in Priya's voice.
- Visitor centre café at car park ✓
- "parking is paid at the Lincolnshire Wildlife Trust site" ✓
- livestock: false — no mention ✓
- 3 sentences ✓ Hyphens only ✓

---

### uffington-white-horse | Pete
**Status: PASS**

- offLead 'none' correctly reflected: "dogs must be kept on leads throughout due to year-round sheep grazing" ✓
- livestock: true — "year-round sheep grazing" ✓
- "national trail and public right of way" ✓
- "Berkshire Downs" — data places walk in Oxfordshire near the Wiltshire border; this area is historically and informally called the Berkshire Downs, a name used in National Trail documentation. Acceptable.
- "chalk downland drains remarkably well" — accurate and useful all-weather note ✓
- SN7 7UK, free for members ✓ (data confirms, £2.50 otherwise)
- "Dont" apostrophe drop ✓, "its" ✓
- hasStiles: true per data — description does not mention stiles. Minor omission.
- 3 sentences ✓ Hyphens only ✓

---

### dovestone-reservoir | Jamie
**Status: FLAG — livestock and stiles not mentioned**

Description: "...Ghost gets decent off-lead stretches on the quieter sections of the circuit away from the picnic area..."

Data: `livestock: true`, `hasStiles: true`

The description implies off-lead access without noting that livestock is present. If sheep are present on any section of the circuit, a user reading this description could have their dog off-lead near livestock. This is a safety concern that the data flagged and the description should address.

**Action required:** Add a brief livestock caveat. Suggested addition to sentence 3: "Ghost gets decent off-lead stretches on the quieter moor sections, though clip on near the sheep that graze parts of the upper circuit — Bank Lane car park, small charge, even cheaper if you're RSPB."

Note: The stile omission is less critical given Jamie rarely mentions stiles, but if the app displays stile info separately from the description, the data is flagged correctly.

- 3 sentences ✓ Hyphens only ✓

---

### blaise-castle-estate | Jamie
**Status: PASS**

- Fix 2 confirmed: "visitor centre cafe is right there on the way back out" added to sentence 3 ✓
- offLead 'partial' — "deeper woodland sections" implies partial ✓
- livestock: false — no mention needed ✓
- Stream swimming confirmed ✓
- Kings Weston Road free parking ✓
- Coombe Dingle entrance ✓
- "the move" — Jamie vocabulary ✓
- 3 sentences ✓ Hyphens only ✓

---

### epping-forest-chingford | Jamie
**Status: PASS**

- Fix 3 confirmed: "stop at the King's Oak cafe near High Beach on the way round" added ✓
- King's Oak at High Beach is a real and well-known Epping Forest landmark ✓
- offLead 'partial' — "quieter glades" off-lead ✓
- "ancient pollarded hornbeams" ✓
- livestock: false — fallow deer noted in data as "not livestock," description correctly omits livestock warning ✓
- "Goes very busy on sunny Sundays" — dropped subject, Jamie imperfection ✓
- 3 sentences ✓ Hyphens only ✓

---

### compton-bay-iow | Priya
**Status: PASS — livestock note**

- offLead 'partial' correctly reflected: beach year-round, seasonal restriction on western section ✓
- "Hanover Point and Brook Chine" ✓
- "section west of Compton Chine has seasonal restrictions from May to September" ✓ (data confirms)
- "sandstone cliffs in layers of red, orange and cream" ✓
- "chalk downs loop" recommended ✓

**Note:** Data shows `livestock: true` (sheep on chalk downs) and the description encourages doing the chalk downs loop without noting that leads are required there. This is a mild omission — the `offLead: 'partial'` field covers it at the data level. Not a critical safety concern given the seasonal beach restriction is clearly flagged, but a lead note on the downs would improve the description. Low priority.

- hasStiles: true per data — not mentioned in description. Minor omission.
- 3 sentences ✓ Hyphens only ✓

---

### crawfordsburn-country-park | Deborah
**Status: PASS — waterfall claim note**

- offLead 'partial' implied (beach off-lead, glen circuit partial) ✓
- livestock: false ✓
- Distance 2.5 miles ✓
- "Belfast Lough" ✓
- "Bridge Road in Helen's Bay" ✓ (data confirms BT19 1LE)
- Free parking ✓
- Older/less mobile dog caveat ✓ — Deborah's core concern
- Bracket aside ✓

**Waterfall claim note:** Description says "one of the tallest in Northern Ireland." Data says "the highest in Northern Ireland." The description is the more defensible claim — "the highest" is likely an overclaim by the Researcher (the Glenariff Falls system in Antrim is typically cited as the tallest waterfall sequence in NI). The description's softer wording is correct and should stand. The data note should be updated from "the highest" to "one of the tallest" to avoid the Developer displaying incorrect superlative copy elsewhere.

- 3 sentences ✓ Hyphens only ✓

---

### golden-cap-seatown | Priya
**Status: PASS**

- offLead 'partial' — off-lead on open summit, leads in fields ✓
- livestock: true — stiles on field approach noted; livestock not explicitly named but field approach implies it ✓
- hasStiles: true — "wooden stiles on the field approach that small dogs can squeeze past, just about" ✓ (data confirms stiles with note "dogs can pass through or beside most")
- "highest cliff on the south coast" ✓ (data confirms 191m, highest on south coast)
- "Jurassic Coast" ✓
- difficulty 'hard' consistent with description's steep climb warning ✓
- "climb from Seatown" ✓
- Paid car park in Seatown ✓
- Pretzel's little legs detail — small dog specificity ✓
- 3 sentences ✓ Hyphens only ✓

---

## 4. EDITORIAL FIXES — CONFIRMATION

All four fixes applied correctly:

| Fix | Walk | Status |
|---|---|---|
| Fix 1 | gibraltar-point-lincolnshire | APPLIED ✓ — "We stumbled" replaced with "A rainy October weekend" |
| Fix 2 | blaise-castle-estate | APPLIED ✓ — visitor centre café added to sentence 3 |
| Fix 3 | epping-forest-chingford | APPLIED ✓ — King's Oak café added to sentence 3 |
| Fix 4 | lepe-country-park | APPLIED ✓ — "which is a genuine bonus" replaced |

---

## 5. CARRY-FORWARD RULES — CONFIRMATION

| Rule | Status |
|---|---|
| "which is always a bonus" absent | CONFIRMED ABSENT from all 20 ✓ |
| "Ideal for" Deborah closers absent | CONFIRMED ABSENT ✓ |
| Priya "We loved/love this one" absent | CONFIRMED ABSENT ✓ |
| Priya "We stumbled" absent | CONFIRMED ABSENT (fixed in gibraltar-point) ✓ |
| Pete imperfections: apostrophe-drops only | CONFIRMED — "doesnt", "its", "theres" across Pete entries ✓ |
| Morag pub/café in every description | CONFIRMED — all 4 Morag entries include pub or café ✓ |

---

## 6. FORMATTING CHECK

All 20 descriptions checked:

| Check | Result |
|---|---|
| Hyphens only (no em/en dashes) | PASS — all 20 ✓ |
| 2–4 sentences | PASS — all 20 within limit ✓ |
| Walk name not in first sentence | PASS — all 20 (hamsterley borderline accepted per Editor) ✓ |
| USERNAME field present | PASS — all 20 ✓ |

---

## 7. ISSUES REQUIRING RESOLUTION BEFORE DEVELOPER HANDOFF

### BLOCKING — must resolve:

**1. white-park-bay**
Description and data contradict each other on seasonal restrictions. Researcher must confirm NT dog policy for White Park Bay beach. If seasonal restrictions exist on the western section (likely), data field must be corrected. If no restrictions, description must be amended.
*Assigned to: Researcher*

**2. dovestone-reservoir**
Data: `livestock: true`. Description implies off-lead without livestock caveat. One sentence addition required.
*Suggested fix (sentence 3 only):* "Ghost gets decent off-lead stretches on the quieter moor sections, though clip on near the sheep that graze parts of the upper circuit — Bank Lane car park, small charge, even cheaper if you're RSPB."
*Assigned to: Copywriter*

---

### NON-BLOCKING — PO decisions or future fixes:

**3. valley-of-rocks-lynton — data contradiction**
`livestock: true` in data entry but Researcher notes say "No livestock (goats are feral/wild)." Description correctly identifies goats as feral. PO to decide whether to keep `livestock: true` as a precautionary UI flag or correct to `false`.

**4. crawfordsburn-country-park — data overclaim**
Data says "the highest waterfall in Northern Ireland." This is likely incorrect (Glenariff Falls system is typically cited as NI's tallest). Description correctly uses "one of the tallest." Data note should be updated.

**5. loch-morlich-glenmore — minor café attribution**
"Glenmore Lodge cafe" is approximately 1km from the main car park. Description could more precisely reference "the Glenmore visitor centre café." Low priority.

**6. robin-hoods-bay and compton-bay-iow — stiles omitted from descriptions**
Both walks have `hasStiles: true` but descriptions don't mention stiles. The app presumably surfaces stile data from the schema fields, so not critical. Note for completeness.

---

## 8. FINAL VERDICT

**16 of 20 descriptions: READY FOR DEVELOPER HANDOFF**

**4 requiring action:**

| Walk | Action needed | Assigned to |
|---|---|---|
| white-park-bay | Verify seasonal restriction — description or data must be corrected | Researcher |
| dovestone-reservoir | Add livestock caveat to sentence 3 | Copywriter |
| valley-of-rocks-lynton | PO decision on livestock field value | PO |
| crawfordsburn-country-park | Update data note on waterfall height claim | Researcher |

Resubmit white-park-bay and dovestone-reservoir for re-validation once corrected.
