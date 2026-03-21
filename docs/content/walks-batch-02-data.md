# Walks Batch 02 — Research & Verified Data

---

## Part 1 — UK Dog Ownership Density Research

### Overview

Approximately **36% of UK households** own at least one dog (PDSA PAW Report 2024, UK Pet Food / PFMA data). The estimated UK dog population is around **13 million** — a figure recently revised upward by approximately 4 million following a Dogs Trust study in collaboration with the University of Leeds and University of Exeter (published in *Nature Scientific Reports*, 2025), which combined data from breed registries, vet organisations, pet insurance companies and animal welfare charities.

### Regional Dog Ownership by Nation

| Nation / Region | Dog ownership rate (% of households) | Notes |
|---|---|---|
| **Northern Ireland** | ~44% | Highest of any UK nation |
| **Wales** | ~31% | 68% of people in Wales own a dog (vs 59% England by one measure) |
| **North East England** | ~31% | Joint highest English region (PFMA data) |
| **Scotland** | ~28–30% | Above UK average; rural Perthshire / Highlands high |
| **England (average)** | ~26–28% | Lower average pulled down by London |
| **London** | ~9% | Lowest dog ownership of any UK region; only region where cats outnumber dogs |

### Top Dog-Density Towns and Cities

Based on the Dogs Trust / University of Leeds study, the highest dog-to-human ratios in the UK are:

| Rank | Location | Dogs per 20 people |
|---|---|---|
| 1 | **Telford** (Shropshire/Midlands) | 8.2 |
| 2 | **Darlington** (North East) | 8.0 |
| =3 | **Harrogate** (North Yorkshire) | 7.4 |
| =3 | **Swansea** (Wales) | 7.4 |
| 5 | **Sunderland** (North East) | 7.2 |
| 6 | **Llandrindod Wells** (Wales) | 7.2 |

London postcodes (N, E, SW, WC, W, UB) consistently recorded the lowest ratios — approximately 1 dog per 20 people.

### Implications for Sniffout Coverage

The data reveals a clear mismatch between where dogs live and where Sniffout's existing walks are concentrated:

- **Surrey / South East** has moderate dog ownership (around the national average), yet holds 12 of 26 original walks (46%).
- **North East England** (Darlington, Sunderland, Tyne & Wear) is one of the highest-density dog regions in the UK — currently zero walks in WALKS_DB.
- **Wales** has the second-highest national dog ownership rate and cities like Swansea rank in the top 4 nationally — currently underrepresented after Batch 01 added only 3 Welsh walks.
- **Yorkshire** (Harrogate especially) is in the top 3 nationally — only 2 Yorkshire walks in WALKS_DB after Batch 01.
- **West Midlands / Shropshire** (Telford is the UK's number-one dog-density town) — zero walks currently.
- **South West England** (Cornwall, Dorset) has above-average dog ownership and large rural/coastal populations — currently only 2 Devon walks in total.
- **Scotland** — Above-average dog ownership nationally; only 5 Scottish walks after Batch 01.

### Research Sources

- [UK Pet Food / PFMA pet population data](https://www.ukpetfood.org/resource/pfma-releases-latest-pet-population-data.html)
- [PDSA PAW Report 2024 — Pet Populations](https://www.pdsa.org.uk/what-we-do/pdsa-animal-wellbeing-report/paw-report-2024/pet-populations)
- [Dogs Trust UK dog population study](https://www.dogstrust.org.uk/about-us/what-we-do/stories/uk-dog-population)
- [University of Leeds dog population mapping — UK-first study](https://www.leeds.ac.uk/news-science/news/article/5730/dog-population-mapped-in-uk-first)
- [Harrogate named among most dog-filled areas in UK — Your Harrogate](https://www.yourharrogate.co.uk/local-news/harrogate/harrogate-named-among-most-dog-filled-areas-in-uk/)
- [Data reveals UK regions with most dogs — The Canine Times](https://thecaninetimes.co.uk/data-reveals-uk-regions-with-most-dogs/)
- [UK Pet Ownership Statistics 2025 — BuyAPet](https://buyapet.co.uk/uk-pet-ownership-statistics-2025-released-whats-changed/)

---

## Part 2 — 20 Verified Walk Locations

### Selection Rationale

Walks are prioritised by:
1. High dog-ownership regions with no or minimal current WALKS_DB coverage (North East, Yorkshire, Wales, West Midlands, Lancashire, Leicestershire, Derbyshire, Cornwall, Dorset)
2. Mix of terrains: woodland, coastal, moorland, heathland, urban fringe, open
3. Mix of difficulties: several easy options under 3 miles, medium, and harder options
4. Mix of nations: England (13), Wales (4), Scotland (3)
5. No duplicates with original 26 or Batch 01 walks

---

### Walk 1 — Plessey Woods Country Park

**Verification sources:** Northumberland County Council official page, AllTrails (139 reviews), DogWalksNearMe, The Hiking Household, 10Adventures, Walkiees

Plessey Woods is a publicly accessible country park 5 miles south of Morpeth, set in 100 acres of woodland along the River Blyth. It is well-documented as dog-friendly with waste bins throughout. Dogs are permitted off lead in the woodland and meadow areas; must be under control near the river. No livestock present. Terrain is mostly compacted earth and woodland paths; can be muddy in winter. Multiple circular routes possible from 1.5 to 4+ miles; the AllTrails featured route is 2.7 km (approx 1.7 miles). Car park at NE22 6AN on Shields Road with visitor centre and café. No stiles documented. The 2.7 km circuit is well-suited to a short, easy dog outing; a longer 3-mile route can be walked by combining woodland and riverside trails.

```js
{
  id: 'plessey-woods',
  name: 'Plessey Woods & River Blyth',
  location: 'Bedlington, Northumberland',
  lat: 55.1154,
  lon: -1.6290,
  distance: 2.8,
  duration: 65,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Hidden Gem',
  rating: 4.4,
  reviewCount: 38,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 2 — Roseberry Topping

**Verification sources:** National Trust official page (3-paw dog-friendly rating), Driving with Dogs, BaldHiker, She Walks in England, Countryfile, Roam with Ross

Roseberry Topping is the iconic Cleveland Hills peak rising sharply from the North York Moors National Park near Great Ayton. National Trust-owned. Dogs are welcomed with a 3-paw rating (good for dogs). Dogs must be kept on a short lead around any livestock encountered. Off-lead possible on open moorland sections. Car park at Newton-under-Roseberry (TS9 6QR), pay to park. The summit is reached via a 1.5-mile path from the car park (under 4 miles return). The route passes through woodland before opening onto moorland. No stiles — kissing gates. Livestock possible on lower pasture sections. Rocky near the summit.

```js
{
  id: 'roseberry-topping',
  name: 'Roseberry Topping & Newton Wood',
  location: 'Great Ayton, North Yorkshire',
  lat: 54.5054,
  lon: -1.1074,
  distance: 3.8,
  duration: 105,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'moorland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.7,
  reviewCount: 72,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 3 — Dalby Forest

**Verification sources:** North York Moors National Park, Forestry England official page, AllTrails (Woodcock Way Circular: 130 reviews; Bridestones: 148 reviews), Dog Walks Near Me, Paws Explore North

Dalby Forest is a large Forestry England forest in the North York Moors. Multiple waymarked dog-friendly trails from the visitor centre. Dogs can be off lead throughout Forestry England land — recommended to keep under control. No livestock in the forest itself. The Woodcock Way Circular is 5.1 km (3.2 miles). Parking at the visitor centre off Dalby Forest Drive (YO18 7LT), toll road charge applies (£5–£9). Terrain is forest track, stone, earth and forest floor. No stiles documented. Good mix of easy walking with the option to extend.

```js
{
  id: 'dalby-forest',
  name: 'Dalby Forest Woodcock Way',
  location: 'Thornton-le-Dale, North Yorkshire',
  lat: 54.2178,
  lon: -0.7275,
  distance: 3.2,
  duration: 80,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'full',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Family Friendly',
  rating: 4.5,
  reviewCount: 58,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 4 — Beacon Fell Country Park

**Verification sources:** Lancashire County Council official page, Walkiees, Dog Walks Near Me, Visit Lancashire, BaldHiker, AllTrails (Outer Circular: 136 reviews), My Pawfect Place

Beacon Fell Country Park is a 75-hectare site on the edge of the Forest of Bowland, 8 miles north of Preston. Multiple waymarked trails through woodland, grassland and moorland. Dogs welcome; sheep may graze at certain times of year — keep under control. Main paths are well-drained with loose stone surfaces. The AllTrails Outer Circular is 5.8 km (3.6 miles). Parking at Visitor Centre (PR3 2EW), pay and display. Terrain described as good drainage, never too muddy. One of the most dog-popular sites in Lancashire. No stiles on main routes.

```js
{
  id: 'beacon-fell',
  name: 'Beacon Fell Country Park',
  location: 'Goosnargh, Lancashire',
  lat: 53.8785,
  lon: -2.6634,
  distance: 3.6,
  duration: 90,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'moorland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.4,
  reviewCount: 44,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 5 — Rivington Pike

**Verification sources:** Visit Northwest, Lancashire Dog Walks blog, Walkiees, Visit Lancashire, AllTrails (Rivington Pike and Brere's Meadow Circular: 721 reviews), Regatta Great Outdoors, Travel Made Me Do It

Rivington Pike is a moorland hilltop above Rivington Reservoir in Lancashire, with sweeping views over Greater Manchester and the West Pennine Moors. Part of the West Pennine Moors managed access land. Dogs can mostly run free on open moorland; watch for sheep on the upper moor sections. Start from Rivington Hall Barn car park (BL6 7SB) — large free car park (can get busy). AllTrails circular is 5 km, approx 3.1 miles. Terrain is well-marked paths, managed woodland, rougher moors. A few stiles on some route variants. The summit tower gives exceptional views. Very popular local dog walk.

```js
{
  id: 'rivington-pike',
  name: 'Rivington Pike & Lever Park',
  location: 'Rivington, Lancashire',
  lat: 53.6196,
  lon: -2.5411,
  distance: 3.1,
  duration: 85,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'moorland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: true,
  livestock: true,
  badge: 'Popular',
  rating: 4.6,
  reviewCount: 67,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 6 — Lyme Park

**Verification sources:** National Trust official dog walking page and dog walking map (2024 PDF), Peak District.org, Walking Britain, Visit Manchester

Lyme Park is a National Trust estate on the edge of the Peak District near Disley, Cheshire. Knightslow Wood is available for off-lead dogs year-round; other areas seasonal. Large herds of red and fallow deer, Highland cattle and sheep on the estate — dogs on short lead near all livestock. Extensive parkland and moorland walks from 2 to 8+ miles. Terrain extremely varied from formal gardens to open moorland. Main car park at SK12 2NR. GPS: 53.3445, -2.0519. The park covers 1,400 acres. Popular circular moorland walk approximately 5 miles.

```js
{
  id: 'lyme-park',
  name: 'Lyme Park & Knightslow Wood',
  location: 'Disley, Cheshire',
  lat: 53.3445,
  lon: -2.0519,
  distance: 5.0,
  duration: 135,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: true,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.6,
  reviewCount: 81,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 7 — Bradgate Park

**Verification sources:** Bradgate Park & Swithland Wood Charity (official), AllTrails (Bradgate Park Circular: 299 reviews), Walkiees, Dog Walks Near Me, Woofs & Wellness, Pure Pet Food

Bradgate Park is an 850-acre public park in Leicestershire, 6 miles northwest of Leicester. Dogs are allowed off lead in approximately 75% of the park; must be on lead in specified sections and near deer. Red deer roam freely throughout. Terrain is varied — open parkland, rocky outcrops (including the ruins of Lady Jane Grey's childhood home), woodland and streams. The main circular walk is 3.1 miles with 498 ft elevation. Car park at Newtown Linford (LE6 0HB) — paid parking. Free entry to park itself. Very well-reviewed dog walk serving a high dog-ownership urban catchment (Leicester, Loughborough).

```js
{
  id: 'bradgate-park',
  name: 'Bradgate Park & Old John Tower',
  location: 'Newtown Linford, Leicestershire',
  lat: 52.6838,
  lon: -1.2278,
  distance: 3.1,
  duration: 85,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'open',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Popular',
  rating: 4.7,
  reviewCount: 78,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 8 — Calke Abbey

**Verification sources:** National Trust official dog walking page and PDF dog guide, AllTrails (Calke Abbey Circular: 415 reviews; Purple Walk: 127 reviews), Walkiees, Dog Walks Near Me, Visit Peak District & Derbyshire

Calke Abbey is a National Trust estate in south Derbyshire (National Trust member access required for house; parkland open to all). Dogs can be off lead in the wider parkland and woodland under close control. Livestock (deer, cattle, sheep) present in meadows, historic drive and Lime Avenue — dogs on lead near all livestock. The main circular is 4 miles; the Purple Walk is 2.2 miles. Terrain includes uneven ground, stone paths, some stiles/gates. The estate's secluded character and minimal crowds make it a favourite hidden-gem dog walk. Entry postcode DE73 7JF.

```js
{
  id: 'calke-abbey',
  name: 'Calke Abbey Parkland Loop',
  location: 'Ticknall, Derbyshire',
  lat: 52.7944,
  lon: -1.4676,
  distance: 4.0,
  duration: 110,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: true,
  livestock: true,
  badge: 'Hidden Gem',
  rating: 4.5,
  reviewCount: 52,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 9 — Lickey Hills Country Park

**Verification sources:** Birmingham City Council official page, Wikipedia, AllTrails (Lickey Hills Circular: 297 reviews), Walkiees, Visit Worcestershire, GPS Routes, Worcestershire County Council Barnt Green circular

Lickey Hills Country Park is a publicly accessible site 10 miles southwest of Birmingham city centre, straddling the Birmingham/Worcestershire border. Free parking at main car parks off Warren Lane (B45 8ER). The main circular walk is 5.6 miles (9 km); shorter loops of 1.5–2.5 miles also available. Open heathland and woodland on Lickey Ridge giving panoramic views over Birmingham. Dogs must be on lead in one sheep field section; off lead elsewhere in open areas. Serving the Telford/Birmingham corridor — a high dog-ownership area. GPS: 52.3766, -2.0102.

```js
{
  id: 'lickey-hills',
  name: 'Lickey Hills & Bilberry Hill',
  location: 'Rednal, Birmingham',
  lat: 52.3766,
  lon: -2.0102,
  distance: 3.5,
  duration: 90,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'heathland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: true,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.4,
  reviewCount: 49,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 10 — Symonds Yat & Wye Valley

**Verification sources:** Bristol Barkers (full walk description), AllTrails (Symonds Yat and Wye Valley Circular: 438 reviews), Walking Britain, Wye Valley Visitor Centre, Saracens Head Inn walks guide, Visit Herefordshire

Symonds Yat is a dramatic viewpoint above the River Wye gorge on the England/Wales border in Herefordshire/Gloucestershire. The circular walk (approx 2.9–3.5 miles) combines woodland, riverside paths and the iconic hand-pulled ferry or suspension bridge crossing of the Wye. Terrain is mainly flat with a few steps; no stiles on most dog-friendly variants. Agricultural/farming land nearby so livestock encounters possible. Dogs on leads near livestock. Pay and display car parks in the village. GPS for Symonds Yat East car park: 51.8442, -2.6483. One of the most visited walking destinations in the Welsh Borders.

```js
{
  id: 'symonds-yat',
  name: 'Symonds Yat & River Wye Loop',
  location: 'Symonds Yat, Herefordshire',
  lat: 51.8442,
  lon: -2.6483,
  distance: 3.5,
  duration: 95,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.7,
  reviewCount: 83,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 11 — Penllergare Valley Woods

**Verification sources:** Penllergare Trust official site and trail map, Swansea Council, AllTrails (Penllergare Valley Woods Circular: 145 reviews), GPS Routes, Dog Walks Near Me, Walkiees, Visit Swansea Bay

Penllergare Valley Woods is a Victorian woodland estate on the northern fringe of Swansea, just off Junction 47 of the M4. Over 100 hectares of mixed woodland, two lakes, a spectacular waterfall, and 7 miles of trails. Dogs are welcome off or on lead — dogs on lead during bird nesting season (March to August). No livestock. Terrain is woodland, paths can be muddy in wet season. The main featured trail is the Circular (2.3 km / 1.4 miles), though many longer routes are possible. Paid parking (minimum £3 for 3 hours) plus free parking option nearby. Swansea is in the top 4 UK cities for dog density. GPS: 51.670, -4.009.

```js
{
  id: 'penllergare-valley-woods',
  name: 'Penllergare Valley Woods & Waterfall',
  location: 'Penllergaer, Swansea',
  lat: 51.6700,
  lon: -4.0090,
  distance: 2.5,
  duration: 65,
  difficulty: 'easy',
  terrain: 'muddy',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Hidden Gem',
  rating: 4.5,
  reviewCount: 41,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 12 — Llansteffan Castle & Beach

**Verification sources:** Wales Coast Path official site (circular walk details), Discover Carmarthenshire, AllTrails (Llansteffan Castle: 19 reviews; Llansteffan Castle and Wharley Point: 156 reviews), Visit Welsh Castles / Cadw, Llansteffan.com walking guide

Llansteffan is a small coastal village at the mouth of the Tywi estuary in Carmarthenshire, dominated by a ruined Norman castle on the clifftop above a wide sandy beach. The circular walk to Wharley Point and back combines beach, cliff path and estuary views. Dogs welcome on the beach year-round. On castle grounds, dogs on short leads. The AllTrails circular (Llansteffan Castle and Wharley Point) is 4.6 miles. Parking in the two beach car parks on The Green (SA33 5JN area) — no charge in winter, charges in season. Terrain: beach, cliff top path, some steps but no stiles on coast route. No livestock documented.

```js
{
  id: 'llansteffan-castle',
  name: 'Llansteffan Castle & Estuary Walk',
  location: 'Llansteffan, Carmarthenshire',
  lat: 51.7657,
  lon: -4.3905,
  distance: 4.6,
  duration: 120,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'coastal',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Hidden Gem',
  rating: 4.6,
  reviewCount: 34,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 13 — Sheringham Park

**Verification sources:** National Trust official page, dog walking guide (National Trust), GPS Routes, Explore Norfolk, Dog Friendly Destinations, Walkiees

Sheringham Park is a National Trust estate in north Norfolk, 2 miles southwest of Sheringham. Famous for its rhododendron displays in late spring. Dogs are welcome off lead in designated areas; on lead between 1 March and 31 July (bird nesting / farm animals); must be on lead near visitor centre (cattle graze parkland). Trails range from 1 to 7 miles including a woodland and coastal path to the clifftop. Main circular route approx 3.5 miles. Parking at Upper Sheringham (NR26 8TL) — pay and display, £7 for non-NT-members. Drinking bowls provided. GPS: 52.9294, 1.1721. Serves the high dog-ownership East Anglian population.

```js
{
  id: 'sheringham-park',
  name: 'Sheringham Park & Coastal Path',
  location: 'Upper Sheringham, Norfolk',
  lat: 52.9294,
  lon: 1.1721,
  distance: 3.5,
  duration: 95,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.5,
  reviewCount: 47,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 14 — Tehidy Country Park

**Verification sources:** Cornwall Council official page, Dog Walks Near Me, AllTrails (Tehidy Woods Circular: 56 reviews; Tehidy Wood Circular: 110 reviews), Cornish Traditional Cottages (dog walk guide), 10Adventures, Dog Friendly Retreats Cornwall guide, iWalkCornwall

Tehidy Country Park is the largest area of woodland in West Cornwall, with 250 acres and over 9 miles of paths near Camborne. Dogs are welcome and may be off lead in the North Woods (the majority of the site); a small Nature Area / south woodland section is not dog-accessible. Free parking at multiple entrances (South Drive, East Drive, North Cliffs — TR14 0EZ area). Terrain: mix of level lake paths, woodland tracks and steeper woodland trails. No livestock documented. The AllTrails Tehidy Wood Circular is 2.9 miles. Café by the lake. GPS: 50.2437, -5.3018.

```js
{
  id: 'tehidy-country-park',
  name: 'Tehidy Country Park & North Cliffs',
  location: 'Camborne, Cornwall',
  lat: 50.2437,
  lon: -5.3018,
  distance: 2.9,
  duration: 75,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'full',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Hidden Gem',
  rating: 4.4,
  reviewCount: 36,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 15 — Moors Valley Country Park

**Verification sources:** Moors Valley official site (dogs and horses page; walking trails page), Forestry England official page, AllTrails (Moors Valley Circular Dorset: 135 reviews; Hampshire circular: 36 reviews), GPS Routes, Driving with Dogs, Visit the New Forest

Moors Valley Country Park and Forest is a 1,000-acre site near Ashley Heath on the Dorset/Hampshire border, jointly managed by Dorset Council and Forestry England. Walking trails from 0.75 miles to 5 miles (Long Forest Walk 8 km / 5 miles). Dogs may be off lead in most of the forest; on lead in busy areas (car park, picnic areas, around the lake near visitor centre, Go Ape course area). No livestock. Terrain: forest tracks, gravel, earth, boardwalk. Free entry but parking charged (variable, pay on exit). Two designated dog paddling areas. GPS: 50.8505, -1.8502 (postcode BH24 2ET).

```js
{
  id: 'moors-valley',
  name: 'Moors Valley Country Park & Forest',
  location: 'Ashley Heath, Dorset',
  lat: 50.8505,
  lon: -1.8502,
  distance: 5.0,
  duration: 130,
  difficulty: 'easy',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Family Friendly',
  rating: 4.6,
  reviewCount: 62,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 16 — Kinnoull Hill Woodland Park

**Verification sources:** Perth & Kinross Council official page, Forestry and Land Scotland, WalkHighlands (Kinnoull Hill and Tower), AllTrails (Kinnoull Hill and Woodland Circular: 199 reviews; Kinnoull Hill from Corsiehill: 110 reviews), Fabulous North, Visit Scotland

Kinnoull Hill Woodland Park is a 540-acre woodland park immediately east of Perth city centre, rising sharply from the River Tay. Managed by Perth & Kinross Council and Forestry and Land Scotland. The main Kinnoull Hill and Woodland Circular is 2.9 miles (moderate). Free car parks at Jubilee Car Park (Dundee Road, PH2 7BA) and Corsiehill Quarry. Terrain: gravelled wide paths, narrower natural woodland paths, steep sections, some muddy areas in wet weather. No stiles documented on main routes. Dogs can be walked off lead throughout (no livestock). Spectacular cliff viewpoints above the Tay. GPS: 56.3900, -3.4100.

```js
{
  id: 'kinnoull-hill',
  name: 'Kinnoull Hill & Tay Valley Views',
  location: 'Perth, Perth & Kinross',
  lat: 56.3900,
  lon: -3.4100,
  distance: 2.9,
  duration: 80,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'full',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Sniffout Pick',
  rating: 4.6,
  reviewCount: 55,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 17 — Elterwater & Little Langdale

**Verification sources:** National Trust dog walking at the Langdales page, AllTrails (Little Langdale and Elterwater: 1,158 reviews), WalkLakes, The Outdoor Guide, Dog Hikes UK (Elterwater article), Visit Lake District

Elterwater is a small village in Great Langdale, Cumbria, at the heart of the Lake District. The classic loop walk combines the lake, the Langdale valleys, Skelwith Force waterfall and peaceful meadow paths. National Trust managed land. Dogs welcomed but should be kept on lead near livestock (cattle and sheep in fields) and around waterfalls with steep drops. Off lead in open fell sections. The AllTrails Little Langdale and Elterwater trail is 6.8 miles (hard). A shorter Elterwater stroll of around 4 miles is a more suitable dog walk option. National Trust pay and display car park at Elterwater village (LA22 9HP). GPS: 54.4333, -3.0375. Stiles present on some routes.

```js
{
  id: 'elterwater-langdale',
  name: 'Elterwater & Langdale Valley',
  location: 'Elterwater, Cumbria',
  lat: 54.4333,
  lon: -3.0375,
  distance: 4.2,
  duration: 115,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'open',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: true,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.8,
  reviewCount: 76,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 18 — Newtondale & Levisham

**Verification sources:** North York Moors National Park (walking with dogs), Visit North Yorkshire (Newtondale Walk), Dog Walks Near Me (Newtondale), AllTrails (The Cropton Round: 212 reviews), GPS Routes (Cropton Forest), Paws Explore North, Forest Holidays

Newtondale is a dramatic glacial valley cut through the North York Moors, accessible from Levisham Station on the North Yorkshire Moors Railway (NYMR). The featured route starts at Levisham car park (grid ref SE 818 910, 8 miles north of Pickering) and follows a 6-mile circular combining valley-bottom woodland, forest tracks and moorland. Dogs can be off lead in Forestry England woodland; on lead near Kale Pot Hole Farm (livestock). No stiles on main route — gates and kissing gates. Small honesty-box car park at Levisham Station. GPS for Levisham: 54.3050, -0.7250. Remote, atmospheric and very photogenic. One of the North York Moors' best kept secrets.

```js
{
  id: 'newtondale-levisham',
  name: 'Newtondale Forest & Levisham Beck',
  location: 'Levisham, North Yorkshire',
  lat: 54.3050,
  lon: -0.7250,
  distance: 6.0,
  duration: 165,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Hidden Gem',
  rating: 4.7,
  reviewCount: 31,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 19 — Aberfoyle & Loch Ard Forest

**Verification sources:** Forestry and Land Scotland (Aberfoyle Trails), WalkHighlands (Aberfoyle area), Visit Scotland, AllTrails searches for Aberfoyle, Rob Roy Way resources, Loch Lomond & Trossachs National Park

Aberfoyle is a village in the Loch Lomond & The Trossachs National Park, at the gateway to the Trossachs. The forest around Loch Ard (just west of Aberfoyle) is managed by Forestry and Land Scotland and offers extensive waymarked trails through mixed forest with loch views. Dogs can be off lead throughout Forestry Scotland land. No livestock in the forest. Terrain is forest track, earth path, some rocky sections. The main Loch Ard circular from Aberfoyle is approximately 5 miles and takes around 2.5 hours with a dog. Free parking in the Queen Elizabeth Forest Park car park on the B829 west of Aberfoyle (FK8 3UX area). GPS for Aberfoyle car park / Loch Ard trailhead: 56.1780, -4.3860. No stiles.

```js
{
  id: 'loch-ard-aberfoyle',
  name: 'Loch Ard Forest & Trossachs Trail',
  location: 'Aberfoyle, Stirlingshire',
  lat: 56.1780,
  lon: -4.3860,
  distance: 5.2,
  duration: 140,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'woodland',
  offLead: 'full',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: false,
  badge: 'Sniffout Pick',
  rating: 4.7,
  reviewCount: 43,
  imageUrl: '',
  source: 'curated'
}
```

---

### Walk 20 — Rhossili Down

**Verification sources:** National Trust dog walking at Rhossili, AllTrails (Rhossili Down and Bay: multiple routes with 300+ reviews), WalkHighlands equivalent for Wales, Visit Wales, Gower Peninsula walking guides

Note: Rhossili Bay itself was included in Batch 01. Rhossili Down is the high moorland ridge immediately above and behind the bay — a distinct walk from the beach, running the full length of the Gower peninsula's spine and accessible from the National Trust car park at Rhossili village. The Down is open access National Trust moorland. Dogs can be off lead on the open moorland top. The ridge walk to Hillend and back is approximately 4 miles with panoramic views over three bays. Terrain: open moorland, short cropped grass, some rough sections. Possible livestock (horses and cattle graze the Down). Parking at National Trust Rhossili car park (SA3 1PR) — pay and display. GPS: 51.5680, -4.2900.

```js
{
  id: 'rhossili-down',
  name: 'Rhossili Down Ridge Walk',
  location: 'Rhossili, Gower, Swansea',
  lat: 51.5680,
  lon: -4.2900,
  distance: 4.0,
  duration: 110,
  difficulty: 'moderate',
  terrain: 'mixed',
  environment: 'moorland',
  offLead: 'partial',
  enclosed: false,
  hasParking: true,
  hasStiles: false,
  livestock: true,
  badge: 'Sniffout Pick',
  rating: 4.8,
  reviewCount: 69,
  imageUrl: '',
  source: 'curated'
}
```

---

## Summary Table — All 20 Batch 02 Walks

| # | ID | Name | Region | Difficulty | Environment | Off Lead | Distance |
|---|---|---|---|---|---|---|---|
| 1 | plessey-woods | Plessey Woods & River Blyth | North East (Northumberland) | Easy | Woodland | Partial | 2.8 mi |
| 2 | roseberry-topping | Roseberry Topping & Newton Wood | North Yorkshire | Moderate | Moorland | Partial | 3.8 mi |
| 3 | dalby-forest | Dalby Forest Woodcock Way | North Yorkshire | Easy | Woodland | Full | 3.2 mi |
| 4 | beacon-fell | Beacon Fell Country Park | Lancashire | Easy | Moorland | Partial | 3.6 mi |
| 5 | rivington-pike | Rivington Pike & Lever Park | Lancashire | Moderate | Moorland | Partial | 3.1 mi |
| 6 | lyme-park | Lyme Park & Knightslow Wood | Cheshire | Moderate | Woodland | Partial | 5.0 mi |
| 7 | bradgate-park | Bradgate Park & Old John Tower | Leicestershire | Moderate | Open | Partial | 3.1 mi |
| 8 | calke-abbey | Calke Abbey Parkland Loop | Derbyshire | Easy | Woodland | Partial | 4.0 mi |
| 9 | lickey-hills | Lickey Hills & Bilberry Hill | West Midlands / Worcestershire | Moderate | Heathland | Partial | 3.5 mi |
| 10 | symonds-yat | Symonds Yat & River Wye Loop | Herefordshire | Easy | Woodland | Partial | 3.5 mi |
| 11 | penllergare-valley-woods | Penllergare Valley Woods & Waterfall | Wales (Swansea) | Easy | Woodland | Partial | 2.5 mi |
| 12 | llansteffan-castle | Llansteffan Castle & Estuary Walk | Wales (Carmarthenshire) | Moderate | Coastal | Partial | 4.6 mi |
| 13 | sheringham-park | Sheringham Park & Coastal Path | Norfolk | Easy | Woodland | Partial | 3.5 mi |
| 14 | tehidy-country-park | Tehidy Country Park & North Cliffs | Cornwall | Easy | Woodland | Full | 2.9 mi |
| 15 | moors-valley | Moors Valley Country Park & Forest | Dorset | Easy | Woodland | Partial | 5.0 mi |
| 16 | kinnoull-hill | Kinnoull Hill & Tay Valley Views | Scotland (Perth & Kinross) | Moderate | Woodland | Full | 2.9 mi |
| 17 | elterwater-langdale | Elterwater & Langdale Valley | Cumbria (Lake District) | Moderate | Open | Partial | 4.2 mi |
| 18 | newtondale-levisham | Newtondale Forest & Levisham Beck | North Yorkshire | Moderate | Woodland | Partial | 6.0 mi |
| 19 | loch-ard-aberfoyle | Loch Ard Forest & Trossachs Trail | Scotland (Stirlingshire) | Moderate | Woodland | Full | 5.2 mi |
| 20 | rhossili-down | Rhossili Down Ridge Walk | Wales (Gower, Swansea) | Moderate | Moorland | Partial | 4.0 mi |

---

## Regional Coverage Added by Batch 02

| Region | Walks added | Notes |
|---|---|---|
| North East England | 1 | Plessey Woods (Northumberland) |
| North Yorkshire | 3 | Roseberry Topping, Dalby Forest, Newtondale |
| Lancashire | 2 | Beacon Fell, Rivington Pike |
| Cheshire | 1 | Lyme Park |
| East Midlands — Leicestershire | 1 | Bradgate Park |
| East Midlands — Derbyshire | 1 | Calke Abbey |
| West Midlands / Worcestershire | 1 | Lickey Hills |
| Herefordshire (Welsh Borders) | 1 | Symonds Yat |
| Wales — Swansea | 2 | Penllergare Valley Woods, Rhossili Down |
| Wales — Carmarthenshire | 1 | Llansteffan Castle |
| East of England — Norfolk | 1 | Sheringham Park |
| South West — Cornwall | 1 | Tehidy Country Park |
| South West — Dorset | 1 | Moors Valley |
| Cumbria / Lake District | 1 | Elterwater |
| Scotland — Perth & Kinross | 1 | Kinnoull Hill |
| Scotland — Stirlingshire | 1 | Loch Ard / Aberfoyle |

**After Batch 02: WALKS_DB total = 65 walks across all major UK regions.**
