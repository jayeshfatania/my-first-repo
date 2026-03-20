# Walk Data — Isabella Plantation, Richmond Park

**Researched:** 2026-03-19
**Sources:** Royal Parks (royalparks.org.uk) · Wikipedia (en.wikipedia.org/wiki/Isabella_Plantation)

---

## Verified Fields

| Field | Value | Confidence |
|-------|-------|------------|
| `id` | `isabella-plantation` | Fixed — per brief |
| `name` | `Isabella Plantation` | High |
| `location` | `Richmond Park, London` | High |
| `lat` | `51.4344` | Medium — see note |
| `lon` | `-0.2771` | Medium — see note |
| `distance` | `2.0` | Medium — see note |
| `duration` | `60` | Medium |
| `difficulty` | `easy` | High |
| `terrain` | `mixed` | High |
| `environment` | `woodland` | High |
| `offLead` | `none` | High |
| `enclosed` | `true` | High |
| `livestock` | `true` | High — see note |
| `hasStiles` | `false` | High |
| `hasParking` | `true` | High |
| `badge` | `Hidden gem` | Fixed — per brief |

---

## Notes

### Coordinates
Lat/lon above are derived from OS grid square TQ 1971 (confirmed by Richmond Libraries OS map record), placed at the northern entrance gate nearest Broomfield Hill car park. **Recommend the Developer cross-checks against Google Maps or OSM before committing** — precise entrance gate coordinates could not be confirmed from the two permitted sources.

### Distance
Royal Parks and Wikipedia do not publish an official loop distance for the plantation itself. Broomfield Hill car park is described as a five-minute walk (~400m) from the entrance. The plantation covers 40 acres; a full internal loop at a relaxed pace takes approximately one hour per multiple visitor accounts. A 2.0-mile figure (car park approach + plantation loop) is a reasonable working estimate. A MyPacer route logs 3.6 miles for a wider Richmond Park route that includes the plantation — that figure includes significant park perimeter walking and is not plantation-only.

**Recommend the Copywriter use "around 2 miles" rather than a precise figure until the Developer can plot the route.**

### Off-lead status
Confirmed `none`. Royal Parks states dogs are permitted in Isabella Plantation but must be kept on leads. This is a permanent rule within the plantation (not just seasonal). Additionally, a mandatory leads-on rule applies across all of Richmond Park during deer birthing season (1 May–31 July).

### Livestock / deer
`livestock: true` is correct at the park level. Richmond Park has large herds of red and fallow deer; they are encountered on approach from any car park. The plantation itself is fenced and deer are excluded from inside it. However, the standard Sniffout `livestock` field is best set to `true` given the approach route involves open parkland with deer present.

### Enclosed
`true` — the plantation has been fenced since the early 19th century. Deer are excluded. This is notable as it means dogs cannot chase deer *within* the plantation, though the lead rule still applies.

### Terrain
`mixed` — post-2014 improvements added wheelchair-accessible paved paths throughout. Woodland grass and compacted-earth paths also exist within the plantation. Surface is not uniformly paved.

### Parking
**Broomfield Hill car park** — nearest car park, ~5 min walk to plantation entrance. Approached from Kingston Gate (western approach only — note for the Copywriter as it catches some satnav users out). **Peg's Pond car park** is adjacent to the north-western boundary but is designated for Blue Badge holders only.

### Opening hours
Isabella Plantation has its own gates with seasonal opening times (separate from Richmond Park's general hours). Royal Parks notes "a small number of early closures during April/May." Specific times are not published on the pages reviewed. **Recommend linking to royalparks.org.uk/visit/parks/richmond-park/isabella-plantation for up-to-date times.**

### Entry fee
None. Richmond Park and Isabella Plantation are free to enter. Car parking charges apply at Broomfield Hill.

### Nearest cafe
**Isabella Plantation Café** — kiosk at Broomfield Hill car park. Opens from 9am; serves hot drinks, pastries, snacks. Effectively on the route (pass it arriving and leaving). A fuller food option is **Pembroke Lodge** (~30 min walk from the plantation) in a Grade II listed Georgian mansion.

---

## Suggested WALKS_DB Entry (for Developer)

```js
{
  id: 'isabella-plantation',
  name: 'Isabella Plantation',
  location: 'Richmond Park, London',
  lat: 51.4344,
  lon: -0.2771,
  description: '',  // Copywriter to supply
  distance: 2.0,
  duration: 60,
  difficulty: 'easy',
  terrain: 'mixed',
  offLead: 'none',
  enclosed: true,
  livestock: true,
  hasStiles: false,
  hasParking: true,
  badge: 'Hidden gem',
  imageUrl: '',
  rating: 0,
  reviewCount: 0,
  source: 'curated'
}
```

> **Note:** `enclosed` is not a current WALKS_DB schema field — PO to confirm whether to add it or capture the enclosed nature in the description only.

---

## For the Copywriter

Key accurate facts to use:
- 40-acre walled woodland garden within Richmond Park
- Established as woodland in the early 19th century; opened to the public in 1953
- Three ponds: Peg's Pond, Thomson's Pond, Still Pond — with streams and small waterfalls
- Azaleas and rhododendrons are the headline plants — April and May are peak bloom months (April for rhododendrons, May for azaleas based on Royal Parks monthly diaries)
- Dogs on leads at all times inside the plantation — firm rule, not seasonal
- Whole of Richmond Park is leads-mandatory 1 May–31 July (deer birthing)
- Nearest cafe: Isabella Plantation Café kiosk at Broomfield Hill car park
- Broomfield Hill car park is approached from Kingston Gate — not all entrances lead to it
- No entry fee; free to visit

---

Sources:
- [Isabella Plantation | The Royal Parks](https://www.royalparks.org.uk/visit/parks/richmond-park/isabella-plantation)
- [Isabella Plantation — Wikipedia](https://en.wikipedia.org/wiki/Isabella_Plantation)
