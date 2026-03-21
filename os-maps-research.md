# OS Maps Integration Research — Sniffout

> **Date:** 2026-03-21
> **Researcher note:** Specific per-transaction tile pricing is not publicly indexed — the OS Data Hub pricing page requires login to view full rate cards. All pricing figures below are based on the publicly available plan descriptions and developer documentation. The Developer should log in to osdatahub.os.uk to confirm current transaction rates before building.

---

## 1. OS Data Hub and OS Maps API

### What it is

The OS Data Hub (osdatahub.os.uk) is Ordnance Survey's developer platform. The **OS Maps API** is a raster tile service — it returns map images as PNG tiles that are assembled in the browser, exactly the same way OpenStreetMap/Leaflet works today.

### Plans

| Plan | Cost | What you get |
|------|------|------|
| **OpenData** | Free, unlimited | Road, Outdoor, and Light map styles only. No footpath/rights of way detail. |
| **Premium** | £1,000/month free credit, then pay-as-you-go | All styles including Leisure (footpaths, bridleways, rights of way). Also unlocks OS MasterMap and other datasets. |

**The free £1,000/month credit is generous.** At POC scale (a few hundred active users), Sniffout is very unlikely to exceed it. The credit is "use-it-or-lose-it" per month — it does not roll over.

### Rate limits

600 transactions per minute on live projects, equivalent to approximately 100 concurrent users requesting a screen's worth of map tiles every 10 seconds. Well above Sniffout's expected POC load.

### When would Sniffout hit the free ceiling?

Map tile usage is hard to predict without knowing user behaviour, but a useful rule of thumb: a user panning around a map for 30 seconds might request 20–50 tiles. At POC scale (sub-1,000 active users), monthly tile consumption would be well within the £1,000 credit even on the Premium plan. The free ceiling becomes a concern at tens of thousands of monthly active users — not a POC concern.

---

## 2. Licensing

### OpenData styles (Road, Outdoor, Light)

Free and unlimited for both personal and commercial use via the OS Data Hub. No per-request charge. Attribution is required (see below).

### Premium styles (Leisure — the one with footpaths)

Commercial use is explicitly permitted under the OS Data Hub Premium plan. The first £1,000 of monthly usage is free. Beyond that, pay-as-you-go rates apply. For a consumer-facing PWA, this is a standard commercial arrangement — no restrictions found on PWA-specific use.

### Attribution

Attribution is mandatory on all OS maps. The required credit is:

> © Crown copyright and database rights [year] OS [licence number]

In practice, this is rendered as a small copyright line in the map. Leaflet's `attribution` option on `L.tileLayer` handles this automatically if the string is passed correctly. OS provides the exact attribution string via the API documentation.

### Key licensing note

The OS API terms (osdatahub.os.uk/legal/apiTermsConditions) state that data accessed via OS Data Hub APIs is licensed per the applicable contract. For most developers on the standard Premium plan this is the standard OS Data Hub terms, which permit commercial app use. No gotchas found for a consumer-facing PWA at this scale — but the owner's solicitor should review the API terms as part of the broader GDPR/legal engagement, since data residency questions may also apply to map tile caching.

---

## 3. Technical Integration with Leaflet 1.9.4

### The good news: it is a drop-in

OS Maps API supports ZXY (XYZ) tile format — the same format that OpenStreetMap uses. This means integration with Leaflet is literally one line of code per style layer:

```js
L.tileLayer(
  'https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=YOUR_API_KEY',
  {
    maxZoom: 20,
    attribution: '© Crown copyright and database rights 2026 OS 100019918'
  }
)
```

No new library is needed. No plugin is needed. Leaflet 1.9.4 handles it natively.

### Projection note (important)

OS Maps API tiles are available in two projections:

- **EPSG:27700** (British National Grid) — OS's native projection
- **EPSG:3857** (Web Mercator) — the same projection OpenStreetMap and Leaflet use by default

**Use EPSG:3857.** Leaflet defaults to Web Mercator. Using British National Grid requires a custom CRS plugin (proj4leaflet) and is not worth the complexity. The URL endpoint uses `{style}_3857` for Web Mercator tiles. This is the standard choice for all web map integrations.

Correct URL format for Leaflet:

```
https://api.os.uk/maps/raster/v1/zxy/{Style}_3857/{z}/{x}/{y}.png?key={apiKey}
```

Where `{Style}` is one of: `Road_3857`, `Outdoor_3857`, `Light_3857`, or `Leisure_3857`.

### API key security

**OS Maps API keys can and should be restricted by HTTP referrer** (i.e. only requests from `sniffout.app` are accepted). This is configured in the OS Data Hub console under API key settings — equivalent to the referrer restriction on Sniffout's Google Places key.

With referrer restriction in place, exposing the key client-side is acceptable practice for a map tile service. This is the standard approach across the industry for tile APIs — map tile requests are read-only and do not expose user data.

**Routing through the existing Cloudflare Worker proxy is not recommended for tiles.** Here is why:

1. Map tiles generate high request volume (20–100+ tiles per user interaction). Proxying all of these through a Worker adds latency and Worker invocation cost for no meaningful security gain once the referrer restriction is in place.
2. Tile requests carry no user data. The risk profile is entirely different from the Google Places API (which proxies queries that could reveal user location and intent).
3. Cloudflare Workers have a free tier limit of 100,000 requests/day. Routing map tiles through it would burn through this quickly.

**Recommendation:** Apply HTTP referrer restriction to the OS Maps API key in the OS Data Hub console, and embed the key client-side in `sniffout-v2.html`. No proxy needed.

---

## 4. Map Styles — Which is Right for Dog Walkers

### Critical finding: Outdoor ≠ footpaths

This is the most important thing to understand before any integration decision. The four styles break down as follows:

| Style | Footpaths shown | Bridleways shown | Terrain | Best for |
|-------|----------------|-----------------|---------|----------|
| **Road** | No | No | Minimal | Navigation, urban |
| **Light** | No | No | Minimal | Clean base layer, overlays |
| **Outdoor** | **No** | **No** | Yes (contours, elevation) | General countryside |
| **Leisure** | **Yes** | **Yes** | Yes | Walking, dog walking |

**The Outdoor style, despite its name, does not show public rights of way.** It is a topographic style (contours, terrain shading, woodland areas) but it does not render the footpath network.

**Only the Leisure style shows footpaths, bridleways, and other public rights of way.** Leisure corresponds to the OS 1:25,000 Explorer and 1:50,000 Landranger paper maps that walkers are familiar with. Footpaths appear as green dashed lines; bridleways as orange dashed lines. This is the layer dog walkers actually want.

**Leisure is Premium Data** — it counts against the £1,000/month free credit. The other three styles are free unlimited OpenData.

### Recommendation for Sniffout

**OS Leisure as an optional toggle layer.** The primary map remains OpenStreetMap (free, global, already working). OS Leisure is offered as an "OS Map" toggle — useful specifically for users who want to see footpath detail beyond what OSM provides.

**OS Outdoor as a secondary consideration.** If the team wants a free fallback that still looks distinctly "OS" without the Premium cost, Outdoor provides the branded OS aesthetic and terrain detail. But it does not show footpaths, which significantly reduces its value for Sniffout's use case.

---

## 5. Map Style Toggle UX

### Current standard patterns

Three common approaches exist across mobile map apps:

**Option A — Floating icon button (Google Maps / Apple Maps pattern)**
A small square or rounded icon in the bottom-right corner of the map (above the zoom controls). Tapping it cycles through layers or opens a small popover with 2–3 choices. This is the most recognised mobile map pattern and requires minimal screen space.

*Pros:* Familiar to users, in-context (right on the map), compact.
*Cons:* Adds visual clutter to the map; must not overlap with other controls (zoom buttons, attribution line).

**Option B — Pill toggle above the map (in-tab pattern)**
A segmented control or pill button placed in the header area of the Walks or Nearby tab, above the map container. Style: `OSM | OS Map` as two labelled options.

*Pros:* No overlap with map content; easy to see and tap; fits Sniffout's existing segmented control pattern (already used in settings for radius and theme).
*Cons:* Slightly disconnected from the map; takes vertical space above the map.

**Option C — Settings option only**
Map style preference is set in the settings sheet (gear icon, Me tab) rather than inline on the map. Persistent preference, not a per-session toggle.

*Pros:* No UI clutter on the map; appropriate for a preference rather than a frequent action.
*Cons:* Hard to discover; users who want to compare layers cannot do so quickly; reduces explorability.

### Recommendation for Sniffout

**Option B (pill toggle above the map)** is the best fit. Sniffout already uses segmented controls (the same pattern) for radius selection in the Nearby tab. A consistent `OSM | OS Map` pill above the Walks or Nearby map would feel native to the app's existing UX language. The map container sits below it — no overlap issues, no competing with zoom controls or attribution.

The toggle should only appear on tabs that have an active map view (Walks map view, Nearby map view). It should not appear on the Today or Weather tabs.

---

## 6. Recommendation

### Verdict: Proceed — with one condition

OS Maps integration is feasible, technically straightforward, and the free tier is generous enough for POC scale. The integration is a Leaflet tile layer swap — minimal code, no new dependencies, no architecture changes.

**The one condition:** The primary goal for dog walkers (showing footpaths and rights of way) requires the **Leisure style**, which is **Premium Data**. Do not proceed under the assumption that the free OpenData tier delivers the footpath layer — it does not. If the integration is built using Outdoor or Light (both free), it will not show footpaths, and the entire rationale for the feature is undermined.

### Prioritised recommendation

| Priority | Action |
|----------|--------|
| 1 | Register on OS Data Hub and create an API key (free, takes 10 minutes) |
| 2 | Restrict the key to `sniffout.app` HTTP referrer in the console |
| 3 | Implement OS Leisure as a toggle layer on the Walks map view using Option B (pill toggle) |
| 4 | Embed the key client-side in `sniffout-v2.html` (no proxy needed for tiles) |
| 5 | Add correct OS attribution string to the tile layer |

### Risks and blockers

| Risk | Severity | Notes |
|------|----------|-------|
| Leisure is Premium Data, not free OpenData | Low at POC scale | £1,000/month free credit is very unlikely to be exceeded by Sniffout at launch. Becomes a real cost at scale. |
| Projection mismatch if wrong endpoint chosen | Medium | Use `_3857` (Web Mercator) endpoints — not `_27700`. Wrong choice requires a Proj4Leaflet dependency. |
| Tile latency on mobile | Low | OS tile servers perform well in the UK. No evidence of performance issues for consumer apps. |
| Attribution requirements | Low but mandatory | Must display OS copyright in the map. Leaflet handles this automatically if the attribution string is passed correctly. |
| API key terms review | Low | Owner's solicitor should include OS Data Hub API terms in the broader legal review, particularly if Sniffout scales or monetises. |
| OS Maps tiles not available offline | Medium | Unlike OSM tiles which can be cached by the service worker, OS tile caching may conflict with API terms. The Developer should check the OS Data Hub terms for offline/cached tile restrictions before implementing the service worker caching strategy for OS tiles. |

### One thing OS Maps does not solve

OS Maps shows the footpath network as rendered map tiles. It does not provide routing, turn-by-turn navigation, or the ability to draw custom routes. For that, a separate product (OS Routes API, or open routing tools like OSRM) would be needed. That is out of scope for the current feature request.

---

## Sources

- [OS Maps API | OS APIs Documentation](https://docs.os.uk/os-apis/accessing-os-apis/os-maps-api)
- [Layers and Styles | OS Maps API Docs](https://docs.os.uk/os-apis/accessing-os-apis/os-maps-api/layers-and-styles)
- [Plans | OS Data Hub](https://osdatahub.os.uk/plans)
- [OS Maps API | OS Data Products](https://www.ordnancesurvey.co.uk/products/os-maps-api)
- [Using OS Leisure Maps in Your App | OS Blog](https://www.ordnancesurvey.co.uk/blog/using-os-leisure-maps-in-your-app)
- [Legal — API Terms and Conditions | OS Data Hub](https://osdatahub.os.uk/legal/apiTermsConditions)
- [Public Rights of Way | OS GetOutside](https://getoutside.ordnancesurvey.co.uk/guides/public-rights-of-way/)
- [GitHub — OS Maps Examples (Leaflet)](https://github.com/tmnnrs/os-maps-examples)
- [Layer Groups and Layers Control | Leaflet Documentation](https://leafletjs.com/examples/layers-control/)
