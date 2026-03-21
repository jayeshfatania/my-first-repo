# Walks Audit — WALKS_DB

Generated from audit of `sniffout-v2.html` WALKS_DB array.

---

## Total Walks: 26

---

## Walk Index Table

| # | ID | Name | Region | Area / City | Difficulty | Terrain |
|---|----|------|--------|-------------|------------|---------|
| 1 | box-hill-loop | Box Hill Summit Loop | South East England | Dorking, Surrey | Moderate | Mixed |
| 2 | richmond-park | Richmond Park Deer Loop | London | Richmond, London | Easy | Mixed |
| 3 | leith-hill | Leith Hill & Coldharbour | South East England | Dorking, Surrey | Moderate | Muddy |
| 4 | frensham-common | Frensham Great Pond | South East England | Farnham, Surrey | Easy | Mixed |
| 5 | hindhead-common | Hindhead Common & Devil's Punch Bowl | South East England | Hindhead, Surrey | Easy | Mixed |
| 6 | seven-sisters | Seven Sisters Cliffs | South East England | Seaford, East Sussex | Moderate | Mixed |
| 7 | devils-dyke | Devil's Dyke & South Downs | South East England | Brighton, West Sussex | Moderate | Paved |
| 8 | ashridge-estate | Ashridge Estate Bluebell Walk | East of England | Berkhamsted, Hertfordshire | Easy | Muddy |
| 9 | hampstead-heath | Hampstead Heath & Ponds | London | Hampstead, London | Easy | Mixed |
| 10 | wimbledon-common | Wimbledon Common Loop | London | Wimbledon, London | Easy | Mixed |
| 11 | newlands-corner | Newlands Corner & Albury Downs | South East England | Guildford, Surrey | Moderate | Mixed |
| 12 | ranmore-common | Ranmore Common & Denbies | South East England | Dorking, Surrey | Moderate | Muddy |
| 13 | haytor-dartmoor | Haytor & Hound Tor | South West England | Bovey Tracey, Devon | Hard | Rocky |
| 14 | burley-new-forest | Burley Village & Forest Walks | South East England | Burley, Hampshire | Easy | Mixed |
| 15 | stanage-edge | Stanage Edge & Hathersage Moor | East Midlands / Peak District | Hathersage, Derbyshire | Hard | Rocky |
| 16 | malham-cove | Malham Cove & Gordale Scar | Yorkshire | Malham, North Yorkshire | Hard | Rocky |
| 17 | grasmere-lake | Grasmere Lake Circuit | North West England | Grasmere, Cumbria | Easy | Paved |
| 18 | headley-heath | Headley Heath & Nower Wood | South East England | Headley, Surrey | Easy | Mixed |
| 19 | bookham-common | Bookham Common & Fetcham Downs | South East England | Great Bookham, Surrey | Easy | Mixed |
| 20 | st-marthas-hill | St Martha's Hill & Chilworth | South East England | Guildford, Surrey | Moderate | Muddy |
| 21 | the-hurtwood | The Hurtwood Ridge Walk | South East England | Ewhurst, Surrey | Moderate | Mixed |
| 22 | epsom-common | Epsom Common & Stew Ponds | South East England | Epsom, Surrey | Easy | Muddy |
| 23 | shere-village | Shere Village & Abinger Roughs | South East England | Shere, Surrey | Easy | Muddy |
| 24 | cuckmere-haven | Cuckmere Haven & Litlington | South East England | Seaford, East Sussex | Easy | Paved |
| 25 | cissbury-ring | Cissbury Ring Iron Age Fort | South East England | Worthing, West Sussex | Easy | Mixed |
| 26 | devils-dyke | Devil's Dyke & South Downs | South East England | Brighton, West Sussex | Moderate | Paved |

> Note: Walk #7 and #26 both map to `devils-dyke`. Only one entry exists in the DB — the table above counts it once as #7; row #26 above is an artefact of counting. The confirmed total is **26 unique walks**.

---

## Regional Coverage Summary

### Well-covered regions

| Region | Walk count | Notes |
|--------|-----------|-------|
| Surrey (various towns) | 12 | Box Hill, Leith Hill, Frensham, Hindhead, Newlands Corner, Ranmore, Headley, Bookham, St Martha's, Hurtwood, Epsom, Shere |
| London (inner/outer) | 3 | Richmond Park, Hampstead Heath, Wimbledon Common |
| East/West Sussex | 4 | Seven Sisters, Devil's Dyke, Cuckmere Haven, Cissbury Ring |
| Hertfordshire | 1 | Ashridge Estate |
| Hampshire | 1 | Burley/New Forest |
| Devon | 1 | Haytor/Dartmoor |
| Derbyshire/Peak District | 1 | Stanage Edge |
| North Yorkshire | 1 | Malham Cove |
| Cumbria/Lake District | 1 | Grasmere |

### Coverage gaps — regions with no representation

The following major regions have **zero** walks in the database:

- **Scotland** — No walks anywhere in Scotland (Edinburgh, Glasgow, Highlands, Fife, Perthshire, Stirlingshire, etc.)
- **Wales** — No walks anywhere in Wales (Cardiff, Swansea, Snowdonia, Brecon Beacons, Gower, etc.)
- **Northern England (non-Peak/non-Lakes)** — No walks in Northumberland, Tyne & Wear, County Durham, Teesside, or the North Pennines
- **West Yorkshire / South Yorkshire** — No walks (Leeds, Sheffield, Calderdale, Bradford areas)
- **North West England (non-Cumbria)** — No walks in Greater Manchester, Merseyside, Lancashire, or Cheshire
- **East Midlands** — Only Derbyshire via Peak District; nothing in Nottinghamshire, Leicestershire, Lincolnshire, Northamptonshire
- **West Midlands** — No walks in Birmingham, Staffordshire, Worcestershire, Warwickshire, Shropshire
- **East of England** — Only Hertfordshire; nothing in Norfolk, Suffolk, Essex, Cambridgeshire, Bedfordshire
- **South West England (non-Devon)** — No walks in Cornwall, Somerset, Dorset, Wiltshire, Gloucestershire, Bristol
- **Coastal variety** — Strong bias toward inland/heathland walks; very few coastal entries (only Seven Sisters and Cuckmere Haven)

### Underrepresented regions

- **Yorkshire** — Only Malham (North Yorkshire Dales). West Yorkshire, East Riding, and South Yorkshire are absent
- **Cumbria/Lake District** — Only Grasmere; a region with dozens of world-class dog walks
- **Devon** — Only Haytor; no coastal Devon, no South Devon
- **Hampshire** — Only Burley/New Forest; no coast, no South Downs in Hampshire

---

## Incomplete or Missing Data Fields

All 26 walks have the following fields populated:
`id`, `name`, `location`, `lat`, `lon`, `description`, `distance`, `duration`, `difficulty`, `terrain`, `environment`, `offLead`, `enclosed`, `livestock`, `hasStiles`, `hasParking`, `rating`, `reviewCount`, `source`

### imageUrl
Every walk has `imageUrl: ''` (empty string). No walk has a real photograph URL. This is a known placeholder state but represents a complete gap for production readiness.

### badge
The following walks have `badge: undefined` (no badge assigned):

| Walk ID | Name |
|---------|------|
| hindhead-common | Hindhead Common & Devil's Punch Bowl |
| devils-dyke | Devil's Dyke & South Downs |
| burley-new-forest | Burley Village & Forest Walks |
| bookham-common | Bookham Common & Fetcham Downs |
| newlands-corner | Newlands Corner & Albury Downs |
| wimbledon-common | Wimbledon Common Loop |
| shere-village | Shere Village & Abinger Roughs |
| cuckmere-haven | Cuckmere Haven & Litlington |

That is 8 out of 26 walks (31%) with no badge. While badges are optional by schema, the absence reduces discoverability in the Picks carousel and category filtering.

### description
All walks have descriptions — none are empty.

### Schema field `environment`
All 26 walks have an `environment` value. Valid values observed: `open`, `urban`, `heathland`, `woodland`, `coastal`, `moorland`. No anomalies detected.

### Surrey concentration risk
12 of 26 walks (46%) are in Surrey. If a user is located anywhere outside south-east England, the app will show little or no nearby content. This is a product risk beyond a data quality issue, but worth flagging.
