# Dog-Friendly Venues Data — Research Document

**Prepared for:** Sniffout product team
**Date:** 2026-03-18
**Scope:** UK dog-friendly venue data sources, API accuracy, legal/reputational risk, and recommended approach

---

## Executive Summary

- **Google Places API (New) has an `allowsDogs` field**, but it is owner-submitted and crowd-sourced via Google Business Profile. Coverage in the UK is patchy — the attribute is unset (null, not false) for the majority of venues, making it unreliable as a primary filter. Using it to exclude venues risks hiding genuinely dog-friendly places that simply haven't claimed or updated their profile.
- **Text Search with the query "dog friendly pubs near [location]" works**, but keyword matching does not guarantee the result is actually dog-friendly — it ranks by relevance (reviews mentioning dogs, business name, etc.), not verified policy. False positives are a real risk, estimated to be high.
- **DogFriendly.co.uk is the UK's gold-standard specialist source** with 50,000+ verified businesses, annual phone verification, and scout visits. They have no public API, but have an affiliate/partnership portal (`partners.dogfriendlyco.com`). Licensing their data would be the highest-accuracy option for the Nearby tab.
- **OpenStreetMap has a `dog=yes` tag** that can be queried via Overpass API at zero cost, but adoption among UK pubs and cafes is extremely sparse — the community has not widely adopted dog-tagging of food/drink venues, making it unsuitable as a primary source today.
- **Legal risk is real but manageable.** UK consumer law (Consumer Rights Act 2015, Consumer Protection from Unfair Trading Regulations 2008) means a bare "as is" disclaimer does not fully protect against liability where inaccurate information causes consumer detriment. Clear, prominent, forward-looking disclaimer language — paired with reasonable accuracy measures — materially reduces exposure.
- **Community verification is viable at scale** but has a cold-start problem and requires moderation infrastructure. For a no-backend PWA POC, it is premature. The right order is: launch with Google Places + prominent disclaimer → pursue DogFriendly.co.uk licensing → add community correction layer once user base exists.

---

## Question 1 — Google Places API Accuracy for Dog-Friendly Venues

### 1.1 Place Types Available for UK Venues

The Places API (New) uses two type tables. **Table A** types can be used as filters in Nearby Search (New) and Text Search (New) via `includedTypes`. Relevant types for UK dog-friendly venue discovery:

| Place Type (API value) | Real-world UK mapping |
|---|---|
| `bar` | Includes many UK pubs; pubs are often tagged `bar` as primary or secondary type |
| `pub` | Listed as a supported type in Places API (New) for UK specifically |
| `restaurant` | Restaurants, gastropubs with kitchen focus |
| `cafe` | Cafes, coffee shops, tea rooms |
| `food` | Legacy Table B type; still appears in responses but not a filterable Table A type |

**Critical note on UK pubs:** The UK pub is a culturally distinct venue type. In the Places API (New), UK pubs are typically categorised with primary type `bar` or `pub`. The legacy Places API only had `bar` — the new API added `pub` as a distinct type. A Nearby Search or Text Search filtering on `includedTypes: ["bar", "pub", "restaurant", "cafe"]` should capture the relevant category spread. Using only `bar` misses pub-primary listings; using only `restaurant` misses wet-led pubs.

**Sources:** [Place Types (New) documentation](https://developers.google.com/maps/documentation/places/web-service/place-types), [Outscraper detailed place types guide](https://outscraper.com/places-api-detailed-place-types/)

---

### 1.2 The `allowsDogs` Field — What It Is and Is Not

The Places API (New) includes a boolean attribute `allowsDogs` on the Place object. Key facts:

**How it works:**
- Set by business owners via Google Business Profile > Attributes > Pets section ("Dogs allowed inside", "Dogs allowed outside")
- Can also be crowd-sourced: Google Maps users can suggest corrections, and Local Guides can contribute attribute data
- The field is a `BooleanPlaceAttributeValue` protobuf type, meaning it has three possible states: `true`, `false`, or **unset/null** (information not available)
- Available in Place Details (New), Nearby Search (New), and Text Search (New) via field mask

**Billing implication:**
Requesting `allowsDogs` triggers the **Enterprise + Atmosphere SKU** tier — a premium billing category. This applies whether you request it on Nearby Search or Text Search. This is not the base Essentials tier that standard searches use. Budget impact must be assessed against current API usage.

**The coverage problem:**
- The attribute is only populated if a business owner has explicitly set it, or a user has contributed it
- Google Maps Community threads from UK users explicitly note that many businesses do not have a dog-friendly option available in their listing's Features section, and the "No option for 'dog-friendly'" thread on Google Support illustrates the gap between attribute existence and attribute population
- No official Google statistic on UK coverage rate exists publicly, but developer experience and community reports strongly suggest the majority of UK pubs and cafes will return `null` rather than `true` or `false`
- **Null ≠ not dog-friendly.** A null value means "unknown", not "dogs not allowed." Any implementation that filters to `allowsDogs == true` only will miss a large portion of genuinely dog-friendly venues

**False positives and false negatives:**
- **False positives:** A venue owner may have marked "dogs allowed" historically but changed their policy. Annual refresh is not guaranteed.
- **False negatives:** Large numbers of dog-friendly venues simply haven't set the attribute. Treating unset as "not dog-friendly" causes severe false negatives.
- The attribute is most useful as a **positive confidence signal** ("this venue has confirmed it allows dogs") rather than as a complete filter

**Sources:** [REST Resource: places v1](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places), [DAC Group — Google Business Profile Pets Attribute](https://www.dacgroup.com/local-search-news/new-google-business-profile-pets-attribute-dogs-allowed/), [Google Maps Community thread](https://support.google.com/maps/thread/209225954/no-option-for-dog-friendly-in-features-section?hl=en), [Places API Data Fields](https://developers.google.com/maps/documentation/places/web-service/data-fields)

---

### 1.3 Keyword Search — "dog friendly" in Text Search

**How it works in Places API (New):**
Text Search (New) accepts a free-text `textQuery` parameter. A query like `"dog friendly pubs near London"` matches against place names, review content, editorial summaries, and place attributes. The API then ranks results by relevance.

**Important distinction — ranking vs filtering:**
The keyword "dog friendly" in a Text Search query **ranks results higher** if they mention that phrase — it does NOT guarantee that every result in the response is actually dog-friendly. The API's documentation explicitly states that refinement parameters (like `includedType`) only reduce results for categorical queries; keyword text queries determine ordering, not guaranteed membership.

**Practical result for Sniffout:**
- A Text Search for `"dog friendly pubs near [user location]"` will surface the most prominently mentioned dog-friendly pubs first, drawing on reviews that mention dogs
- Results further down the list may be venues that merely have the word "dog" in a review ("not dog-friendly") or have similar semantic content
- Google's AI/Gemini-powered capabilities (introduced 2024) now extract relevant review snippets for contextual queries, which helps surface better evidence — but this is a display feature, not a data quality guarantee

**Nearby Search limitation:**
Nearby Search (New) does **not** accept a text query — only type filters and `rankPreference`. You cannot use "dog friendly" as a keyword in Nearby Search. To use keywords, you must use Text Search.

**Sources:** [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search), [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search), [Google Maps Platform AI features blog](https://mapsplatform.google.com/resources/blog/provide-ai-powered-place-and-area-summaries-with-gemini-model-capabilities/)

---

### 1.4 User-Submitted Google Attributes — Exposure via API

Google Business Profile attributes (including "dogs allowed") are:
- Settable by the **business owner** through their GBP dashboard
- Contributable by **any Google Maps user** (crowd-sourced suggestions, Local Guide contributions)
- Eligible to appear in Google Search and Maps once set

These attributes **are** exposed via the `allowsDogs` field in the Places API (New). However, the field is only populated where some source (owner or user) has actively set it. There is no guarantee that crowd-sourced attribute data is accurate or current.

**Sources:** [Mirador Local — promoting pet-friendly business on Google](https://www.miradorlocal.com/post/tips-promoting-your-pet-friendly-business-google), [DAC Group article](https://www.dacgroup.com/local-search-news/new-google-business-profile-pets-attribute-dogs-allowed/)

---

### 1.5 Recommended Google Places API Call Configuration

For the Sniffout Nearby tab, the best-practice approach with Google Places API (New):

**Option A — Nearby Search (no keyword, type filter + field mask):**
```
POST https://places.googleapis.com/v1/places:searchNearby
X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.rating,places.allowsDogs,places.websiteUri,places.googleMapsUri,places.primaryType,places.types

{
  "includedTypes": ["bar", "pub", "restaurant", "cafe"],
  "locationRestriction": {
    "circle": {
      "center": { "latitude": LAT, "longitude": LON },
      "radius": RADIUS_METRES
    }
  },
  "maxResultCount": 20
}
```
Use `allowsDogs` as a **confidence badge** in the UI ("Confirmed dog-friendly" where `allowsDogs == true`), not as a filter to exclude results.

**Option B — Text Search (keyword + type filter):**
```
POST https://places.googleapis.com/v1/places:searchText
X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.rating,places.allowsDogs

{
  "textQuery": "dog friendly pubs and cafes",
  "includedType": "bar",
  "locationBias": { "circle": { ... } }
}
```
Note: `includedType` (singular) takes only one type in Text Search. Run multiple calls for `bar`/`pub`/`restaurant`/`cafe` and merge, or use a broader text query and rely on relevance ranking.

**Billing note:** Requesting `allowsDogs` in the field mask escalates to the Enterprise + Atmosphere SKU. If budget is a concern, omit `allowsDogs` from the field mask and rely on text query relevance alone — this keeps you at the standard Essentials/Pro tier.

---

## Question 2 — Alternative Data Sources for UK Dog-Friendly Venues

### 2a. DogFriendly.co.uk

**Overview:**
The UK's largest curated dog-friendly venue database with 50,000+ registered businesses across pubs, restaurants, cafes, accommodation, shops, and attractions.

**Data quality:**
- Every pub and hotel in their directory is contacted by phone once per year to verify current dog policy
- A team of "DogFriendly scouts" visits or conducts telephone questionnaires for each venue
- This is the **highest-quality, most actively maintained** UK dog-friendly venue dataset available

**Coverage:**
- Specialised listings for pubs, restaurants/cafes, accommodation, shops, dog-friendly walks, and attractions
- UK-only focus; depth of coverage in rural areas is notable

**API access:**
- No public developer API is documented
- An affiliate/partner portal exists at `partners.dogfriendlyco.com`, suggesting a commercial partnership pathway
- Their terms state they cannot assist with enquiries or bookings on behalf of listed venues
- Data licensing or white-label access would require direct commercial negotiation

**Recommendation for Sniffout:**
Pursue a commercial licensing conversation. At Sniffout's POC stage, this may be premature, but it is the only UK-specialist source with verifiable, annually refreshed data. Even a limited data export (top 500 dog-friendly pubs by city) would dramatically improve Nearby tab quality.

**Sources:** [DogFriendly.co.uk About](https://www.dogfriendly.co.uk/about-us), [DogFriendly partner portal](https://partners.dogfriendlyco.com/), [DogFriendly Terms of Use](https://www.dogfriendly.co.uk/terms-of-use)

---

### 2b. BringFido.com

**Overview:**
US-founded global pet travel platform with UK presence (`bringfido.co.uk`). Claims 500,000+ pet-friendly places globally.

**UK coverage:**
- Over 29,000 hotels/vacation rentals in the UK listed as pet-friendly
- Restaurant/bar/activity coverage for UK cities exists but is thinner than US coverage
- UK restaurant listings appear to rely on user submissions and owner-added listings ($249/year listing fee) rather than systematic verification at the same depth as DogFriendly.co.uk

**Data quality:**
- BringFido calls venues to verify pet policies before listing (stated on their site)
- User reviews are published unmodified, both positive and negative
- Community submissions can add new venues

**API access:**
- No public developer API found. BringFido operates an affiliate programme (commission on hotel bookings) but no data API documentation is publicly available
- API access, if available, would require direct business development contact

**Business model:**
- Commission on hotel bookings, $249/year direct listing fee, affiliate payouts, pet amenity kits for hotels
- Revenue estimated at $32.5M. There is commercial incentive to protect their proprietary dataset

**Recommendation for Sniffout:**
BringFido's UK venue data is less deep than DogFriendly.co.uk for pubs/cafes specifically. An API partnership is not currently a realistic option without direct commercial engagement. BringFido is more relevant for accommodation search than walk-adjacent pub/cafe discovery.

**Sources:** [About BringFido UK](https://www.bringfido.co.uk/about/), [BringFido Affiliate Programme](https://www.bringfido.co.uk/affiliate/), [BringFido review — EXSPLORE](https://www.exsplore.com/blog/bringfido)

---

### 2c. Muddy Paws / Muddy Boots / Other UK Platforms

**Research finding:**
- "Muddy Paws" is a pet accessories/services brand rather than a venue directory
- "Muddy Boots" is not a dedicated UK dog-friendly venue platform
- Related platforms found: "Out With The Dog" (`outwiththedog.co.uk`) — a UK-specific interactive map of dog walk locations and dog-friendly businesses. Appears community-contributed with no developer API
- "Dog Friendly Retreats" is a curated blog/editorial listing for dog-friendly accommodation and dining, not an API-accessible dataset
- "Dog Friendly Finder" (`dogfriendlyfinder.com`) — a newer UK web app aggregating dog-friendly venues; has terms/disclaimer content suggesting early-stage product; no developer API found

None of these platforms offer a usable developer API for Sniffout integration at the POC stage.

---

### 2d. OpenStreetMap — `dog` Tag via Overpass API

**The tag:**
OSM uses `dog=*` as the established key for dog access at a venue:
- `dog=yes` — dogs permitted (leash laws apply)
- `dog=leashed` — dogs allowed on lead only
- `dog=outside` — dogs only in outdoor/beer garden areas
- `dog=no` — dogs not permitted
- `dog=designated` — area specifically for dogs

The `dog` key is used alongside amenity tags, e.g., `amenity=pub + dog=yes`.

**Overpass API query example (dog-friendly pubs in UK area):**
```
[out:json][timeout:30];
area["ISO3166-1"="GB"][admin_level=2]->.uk;
(
  node["amenity"="pub"]["dog"="yes"](area.uk);
  way["amenity"="pub"]["dog"="yes"](area.uk);
  node["amenity"="restaurant"]["dog"="yes"](area.uk);
  way["amenity"="restaurant"]["dog"="yes"](area.uk);
  node["amenity"="cafe"]["dog"="yes"](area.uk);
  way["amenity"="cafe"]["dog"="yes"](area.uk);
);
out geom;
```
This returns GeoJSON-compatible output at zero cost. The Overpass API is free and has no API key requirement.

**Coverage reality:**
- OSM has excellent coverage of UK pubs as `amenity=pub` (tens of thousands mapped)
- However, the `dog=*` subtag has very **sparse adoption** for venues. OSM community discussions explicitly note that few data consumers use the `dog=*` tag, which reduces mapper motivation to add it
- The tag exists, is documented, and is technically queryable — but the actual number of UK pubs with `dog=yes` is a small fraction of total pubs mapped
- OSM data quality for this specific attribute is community-dependent and unevenly distributed across UK regions

**Cost:** Free. No rate limits for reasonable query volumes. Data is openly licensed (ODbL).

**Recommendation for Sniffout:**
Not viable as a primary source today due to sparse coverage. Could be used as a **supplementary signal** — a venue appearing in OSM with `dog=yes` is a high-confidence confirmed listing. Worth monitoring as OSM data quality improves.

**Sources:** [Key:dog — OSM Wiki](https://wiki.openstreetmap.org/wiki/Key:dog), [Tag:dog=yes — OSM Wiki](https://wiki.openstreetmap.org/wiki/Tag:dog=yes), [OSM Community Forum discussion on dog= tag consumers](https://community.openstreetmap.org/t/are-there-any-data-consumers-of-dog-tag/131204), [Overpass API by Example](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_API_by_Example)

---

### 2e. Yelp API

**Dog-friendly attribute:**
Yelp API exposes a `DogsAllowed` attribute in its business response data. This can be used as a filter.

**UK coverage:**
- Yelp covers 32 countries including the UK, but **UK coverage is structurally limited**: Yelp only returns businesses that have at least one customer review. Yelp is far less culturally embedded in the UK than in the US — UK businesses and consumers are less likely to have Yelp profiles or reviews.
- Many UK pubs and independent cafes will not appear in Yelp results at all
- Yelp's UK review count is a fraction of its US dataset; searching for `DogsAllowed=true` in UK areas would return very thin results

**Pricing:**
Yelp moved to paid-only API access in 2024. API access requires a paid plan.

**Recommendation for Sniffout:**
Not suitable for UK venue discovery. Coverage gaps are too significant. The `DogsAllowed` attribute is only useful where the UK data density is sufficient, which it is not for pubs and cafes outside major urban centres.

**Sources:** [Yelp Current Capabilities & Limitations](https://docs.developer.yelp.com/docs/current-capabilities-limitations), [Yelp Places API](https://business.yelp.com/data/products/places-api/)

---

### 2f. Foursquare / FSQ Places API

**Dog-friendly attribute:**
Foursquare's FSQ Places dataset includes a `dog_friendly` tag in its POI schema. Tags are metadata attributes that describe characteristics of a location. The FSQ dataset has 25 core attributes and 115+ rich attributes.

**UK coverage:**
Foursquare claims global coverage with 100K+ trusted data sources. UK pub and restaurant density in FSQ is higher than Yelp but relies on historical check-in and tip data from the Foursquare/Swarm community, which has declined in active use since peak years (2013-2017). Coverage of UK venues is reasonably good for cities, thinner in rural areas.

**Pricing:**
- Free tier: 10,000 calls/month (Pro endpoints only)
- Pro endpoints: ~$0.015 per call at scale
- Premium endpoints (which may include `dog_friendly` tag): $18.75 per 1,000 calls (no free tier)

**Recommendation for Sniffout:**
FSQ has the technical infrastructure (a `dog_friendly` tag) and reasonable UK coverage for a secondary source. The pricing is workable. However, the `dog_friendly` tag population in UK pubs is unknown and likely sparse — the FSQ community did not systematically curate UK dog policy. Worth investigating if Google Places coverage proves inadequate, but not a primary source recommendation.

**Sources:** [Foursquare Places API overview](https://foursquare.com/products/places-api/), [FSQ Places Pricing guide — Camino.ai](https://app.getcamino.ai/learn/foursquare-places-api-pricing), [Foursquare OS Places dataset on HuggingFace](https://huggingface.co/datasets/foursquare/fsq-os-places)

---

### 2g. Other Sources Worth Noting

**Out With The Dog (`outwiththedog.co.uk`):**
UK-specific interactive map of dog-friendly businesses and walks. Community-submitted. No developer API. Could be a future partnership target.

**Companion Life / Food Hygiene data analysis:**
Some UK market research has cross-referenced food hygiene databases with dog-friendly listings to estimate city-level density. Not an API source.

**UK food hygiene database (FSA):**
The Food Standards Agency publishes a database of all food business establishments in the UK. This can be used to cross-reference venue names/postcodes but contains no dog-policy data.

---

## Question 3 — Hybrid Approach Analysis

### 3.1 The Model: Google Places + Community Verification Layer

The proposed hybrid approach would:
1. Show Google Places results (sourced from Nearby/Text Search) with a clear disclaimer
2. Allow users to flag/upvote "actually dog-friendly" or downvote "not dog-friendly"
3. Over time, build a verified layer that overrides Google Places default data

This model is used (in varying forms) by BringFido and DogFriendly.co.uk:
- BringFido combines owner-verified hotel listings with community-submitted restaurants and reviews
- DogFriendly.co.uk uses scout verification plus an annual owner contact programme
- Neither relies purely on algorithmic data; both have human-in-the-loop verification

### 3.2 Cold Start Problem

The cold start problem is severe for a dog-friendly venue verification layer:
- Users need to visit a venue with their dog before they can verify it
- A new app with limited users in any given area will have no community signals for months
- First-time users who encounter an incorrect listing before the community has corrected it will form a negative impression
- PlayDogs (the closest competitor referenced in CLAUDE.md) struggles with this — empty in new regions

**Mitigation approaches used by established apps:**
- BringFido used direct telephone verification to bootstrap their listings before community signals existed
- Waze (mapping community) seeded initial data with staff contributions, then scaled with community
- For Sniffout: a small initial seed of manually verified venues in a launch city (e.g., 50-100 pubs in Brighton, Bristol, or a specific market) would provide a credible initial experience before community contributions

### 3.3 Moderation Requirements

A community verification layer requires:
- **Spam prevention:** Venue owners downvoting competitors; users submitting fake verifications
- **Staleness management:** A venue that was dog-friendly 18 months ago may have changed policy; old upvotes decay in value
- **Conflict resolution:** If 3 users say "dog-friendly" and 2 say "not dog-friendly", which wins?
- **Review velocity:** Low-traffic venues may never accumulate enough votes to generate a reliable signal

At the Sniffout POC stage (no backend, no accounts, all state in `localStorage`), none of this infrastructure exists. Community verification is technically incompatible with the current architecture.

### 3.4 Data Quality Risks

- **Malicious contributions:** Competitors or disgruntled owners submitting false reports
- **Out-of-date positive votes:** A venue marked dog-friendly by a user 2 years ago may have new management
- **Selection bias:** Dog owners who had a positive experience are more likely to contribute than those who were turned away
- **Geographic bias:** Urban areas accumulate votes faster; rural venues remain unverified for longer

### 3.5 Phased Recommendation

The right sequence for Sniffout:

**Phase 1 (now — POC):** Google Places API with `allowsDogs` as a confidence badge + prominent disclaimer. No community input.

**Phase 2 (post-validation, with backend):** Add "Is this venue still dog-friendly?" binary user feedback button. Store in backend. Surface aggregate signal. Require verified account to vote (deters spam).

**Phase 3 (scaled):** Weight recent votes higher than old ones. Add "Last confirmed [date]" to venue cards. Enable venue owners to claim/update their listing.

**Sources:** [BringFido About](https://www.bringfido.com/about/), [DogFriendly.co.uk About](https://www.dogfriendly.co.uk/about-us), [ASK Digital Haus dog-friendly places project](https://askdigitalhaus.com/projects/dog-friendly-places/)

---

## Question 4 — Legal and Reputational Risk

### 4.1 Legal Exposure Under UK Law

UK consumer law creates meaningful exposure for apps that systematically provide inaccurate information to consumers. The relevant legal framework:

**Consumer Protection from Unfair Trading Regulations 2008 (CPRs):**
- Prohibit misleading commercial practices — both misleading actions (false statements) and misleading omissions (withholding material information)
- If Sniffout presents a venue as dog-friendly (by surfacing it prominently in a "dog-friendly venues" feature) and the venue is not, this could constitute a misleading action if the user relies on it and suffers detriment (wasted journey, dog refused entry)
- A disclaimer does not cure a misleading practice — the CPRs require the practice itself to be non-misleading

**Consumer Rights Act 2015:**
- Covers digital content and apps as "products"
- Services must be performed with reasonable care and skill
- For an information aggregator, "reasonable care and skill" likely requires a good-faith effort to source accurate data, not just a disclaimer

**Limitation of disclaimers under UK law:**
UK courts and regulators take the position that:
1. Disclaimers cannot override statutory consumer rights
2. A disclaimer cannot "cure" misleading marketing — if the app's framing implies reliability it cannot deliver, the disclaimer is insufficient
3. However, disclaimers can be effective in genuinely communicating uncertainty where that uncertainty is inherent and honestly presented

**Practical risk level:**
For a free consumer app at POC stage, the risk of litigation is low. The practical risk is **reputational**: a dog owner who drives 40 minutes to a listed pub only to be turned away will leave a negative review and potentially post on social media. This is the more immediate concern.

**Sources:** [Sprintlaw UK — Legal Disclaimer](https://sprintlaw.co.uk/articles/legal-disclaimer-in-the-uk-what-it-can-and-cant-do/), [Consumer Rights Act 2015 Explanatory Notes](https://www.legislation.gov.uk/ukpga/2015/15/notes), [Dog Friendly Finder Terms](https://www.dogfriendlyfinder.com/terms)

---

### 4.2 Standard Disclaimer Language Used by Comparable Services

**DogFriendly.co.uk (actual wording from their Terms of Use):**
> "We make no representations or warranties whatsoever as to the completeness and accuracy of the information contained on the Website."
> They expressly disclaim liability for "any direct, indirect or consequential loss or damage incurred by any user arising from any reliance placed on materials posted on the Website, including from inaccuracies, defects, errors, omissions, or out of date information."
> They advise users: "We recommend contacting individual venues directly to ensure they meet your requirements and that their facilities remain as advertised."

**DogFriendlyBritain.co.uk:**
Uses a standalone disclaimer page noting that venue details may change and recommending users verify directly with venues.

**BringFido:**
Wraps all venue listings with the expectation that users call ahead; their hotel guarantee specifically covers bookings made through BringFido, implicitly acknowledging that other listed venues are unguaranteed.

**Effective pattern across these services:**
All use a combination of:
1. A general disclaimer of accuracy warranties
2. A specific recommendation to "check directly with the venue before visiting"
3. Attribution of the data source ("information sourced from Google" or similar)

---

### 4.3 Recommended Disclaimer Language for Sniffout

The following wording balances legal protection with user trust. It should appear:
- In the Nearby tab before the venue list renders
- As a small note on each venue card or in the venue detail view

**In-product notice (concise, inline):**
> "Venue listings are sourced from Google Maps data and may not reflect current dog policies. Always check with the venue before visiting."

**Extended disclaimer (footer/info panel):**
> "Sniffout shows nearby venues based on third-party data from Google Maps. Dog-friendly status is indicated where venues have confirmed this with Google, but information may be incomplete or out of date. Sniffout does not independently verify venue policies. We recommend calling ahead before making a special trip."

**What to avoid:**
- Do not say "dog-friendly pubs near you" as a section heading without qualification — this implies a curated, verified list
- Do not use the word "verified" unless you have actually verified the venue
- Highlight the `allowsDogs` badge as "Google-confirmed" rather than "Sniffout-verified"

**Sources:** [DogFriendly.co.uk Terms of Use](https://www.dogfriendly.co.uk/terms-of-use), [DogFriendlyBritain disclaimer](https://www.dogfriendlybritain.co.uk/disclaimer.asp), [Sprintlaw UK disclaimers](https://sprintlaw.co.uk/articles/disclaimers-drafting-shields-against-business-liability/)

---

## Final Recommendations

### Which data source(s) to use

**Primary (now):** Google Places API (New) — already integrated in Sniffout. Continue using it for the Nearby tab. It has the widest UK coverage for pub/cafe discovery and is already in the codebase.

**Enhancement (now, within existing API key):** Request `allowsDogs` in the field mask for Nearby Search results. Surface it as a "Google-confirmed dog-friendly" badge on venue cards. Do not use it as a filter to exclude venues — use it only as a positive signal where present.

**Future (post-POC, with budget):** Approach DogFriendly.co.uk via `partners.dogfriendlyco.com` to explore data licensing or a co-marketing arrangement. Their 50,000+ annually-verified listings represent the highest-quality UK dog-friendly venue dataset available and would eliminate the accuracy concerns with the Google Places approach.

**Supplementary (zero cost, long term):** Monitor OSM `dog=yes` tag coverage. As Sniffout grows, contributing back to OSM (adding `dog=yes` tags to confirmed venues) improves the commons and creates a free data layer you can query.

---

### What accuracy measures to take

1. **Display `allowsDogs` badge only where explicitly `true`** — never infer dog-friendliness from a null result
2. **Combine type filter + text relevance** — use `includedTypes: ["bar", "pub", "restaurant", "cafe"]` in Nearby Search to maximise venue capture across UK place categories
3. **Show venue rating and review count** — venues with high ratings and many reviews are more likely to have accurate attribute data
4. **Add a "Still dog-friendly?" feedback mechanism** — even a simple "Report incorrect" link satisfies the duty of care and seeds community correction data for Phase 2
5. **Last-verified date** — where `allowsDogs` is true, note "Per Google Maps" so users understand the source

---

### Specific API parameters to use

**Recommended Nearby Search (New) call:**

```json
POST https://places.googleapis.com/v1/places:searchNearby
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.allowsDogs,places.websiteUri,places.googleMapsUri,places.primaryType,places.nationalPhoneNumber

{
  "includedTypes": ["bar", "pub", "restaurant", "cafe"],
  "locationRestriction": {
    "circle": {
      "center": { "latitude": USER_LAT, "longitude": USER_LON },
      "radius": RADIUS_IN_METRES
    }
  },
  "rankPreference": "DISTANCE",
  "maxResultCount": 20
}
```

**If `allowsDogs` billing is a concern, omit it from the field mask** and fall back to Text Search with the query `"dog friendly pubs"` as a softer relevance signal without the Enterprise SKU uplift.

**Text Search alternative:**
```json
POST https://places.googleapis.com/v1/places:searchText
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri

{
  "textQuery": "dog friendly pub OR bar OR cafe",
  "locationBias": {
    "circle": {
      "center": { "latitude": USER_LAT, "longitude": USER_LON },
      "radius": RADIUS_IN_METRES
    }
  },
  "pageSize": 20
}
```

---

### Disclaimer language to show users

**Inline (on the Nearby tab, above the venue list):**
> Venue listings are from Google Maps. Dog-friendly status is not independently verified — always check with the venue before visiting.

**Per-venue card (where `allowsDogs` is null):**
> Tap to see details. Call ahead to confirm dogs are welcome.

**Where `allowsDogs == true` (badge label):**
> Google-confirmed: dogs welcome

---

### Whether to build community verification and when

**Do not build community verification now.** The current Sniffout architecture (no backend, no accounts, all state in `localStorage`) is not compatible with multi-user community data. The Nearby/community features are explicitly deferred in CLAUDE.md.

**When to build it:** After the POC is validated — specifically after:
1. A backend (Firebase or similar) is introduced
2. User accounts exist (required to prevent spam votes)
3. There is sufficient traffic in at least one geography to generate meaningful vote volumes (target: 10+ votes per venue before showing a confidence score)

**What to build first when ready:** A binary "Still dog-friendly? Yes / No" report button on each venue card, with results stored server-side. Display "Sniffout users say: dog-friendly" when ≥5 "Yes" votes and a 4:1 positive ratio. This is the minimum viable community layer.

---

*Research compiled from Google Maps Platform documentation, DogFriendly.co.uk, BringFido, OpenStreetMap Wiki, Foursquare developer docs, Yelp developer docs, Sprintlaw UK, UK legislation sources, and Google Maps Community forums. March 2026.*
