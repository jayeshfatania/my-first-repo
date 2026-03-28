# Companion Website Research — sniffout.co.uk
*Produced by: Researcher*
*Date: 27 March 2026*
*Sources: web research, technical documentation, competitor analysis, SEO and ASO benchmarks*

---

## Section 1 — Structure and Information Architecture

### How AllTrails Organises Its Website

AllTrails' website is consistently cited as one of the cleanest SEO-first builds in the outdoor app space. The CEO has stated that converting mobile-first SEO traffic into organic app installs is "a huge driver of our business." The structure has three layers:

**Layer 1 — Trail pages (the heavy lifters)**
Individual trail pages are the core SEO asset. Each page targets a specific trail name (e.g. "Friston Forest walk") and destination-based modifier keywords ("Friston Forest dog walk", "Friston Forest with dogs"). Trail pages feed aggregated content upward to park/area pages. These are the pages that capture high-intent search queries from people ready to go somewhere.

**Layer 2 — Area/park pages (aggregation and broader targeting)**
Park and area pages group trail pages, enabling AllTrails to target broader queries: not just "hiking in Yosemite" but "Yosemite map", "Yosemite reviews", "Yosemite photos". Each area page includes a top trail widget (pulling content from child trail pages) and aggregated reviews. This internal linking structure means every trail page you add strengthens the area page above it.

**Layer 3 — Lists and editorial (long-tail and social)**
User-created and editorial lists ("best dog-friendly trails in Cornwall") power long-tail keyword targeting and social sharing. These are lower in authority than trail pages but drive significant supplementary traffic and enable targeting of seasonal and thematic queries.

AllTrails has 23,500 keywords ranking in Google, with approximately 60% tied to trail/hiking queries and 40% to broader location-based content — demonstrating that the site ranks for things people search before they search for trails specifically.

---

### Recommended URL Structure for sniffout.co.uk

Two viable patterns:

**Option A — Flat walk slug (recommended for launch):**
```
sniffout.co.uk/walks/friston-forest-dog-walk
sniffout.co.uk/walks/seven-sisters-eastbourne
sniffout.co.uk/walks/norfolk-broads-circular
```

**Option B — Region-scoped (recommended at scale):**
```
sniffout.co.uk/walks/sussex/friston-forest
sniffout.co.uk/walks/east-anglia/norfolk-broads-circular
sniffout.co.uk/walks/yorkshire/ilkley-moor-dog-walk
```

**Recommendation: Start with Option A, migrate to Option B.** At launch with 100 walks, a flat /walks/ structure is simpler to build and deploy. As the database grows to 500+ walks, region-scoped URLs enable targeting of "[county] dog walks" area pages with proper hierarchy. The migration can be handled with 301 redirects when the time comes.

Do not use:
- `/walks/[county]/[town]/[walk-name]` — too deep for shallow database; three levels of hierarchy is the maximum recommended
- `/trail/` as the segment — "walk" is more natural UK language than "trail" (which reads as American)
- Query parameters for filtering (`/walks?region=sussex`) — these can be indexed but are harder to manage and create duplicate content risk

**Area index pages:**
```
sniffout.co.uk/walks/sussex/          → all Sussex walks
sniffout.co.uk/walks/yorkshire/       → all Yorkshire walks
sniffout.co.uk/walks/london/          → London borough walks
```

**Editorial/guide pages:**
```
sniffout.co.uk/guides/best-dog-walks-surrey
sniffout.co.uk/guides/blue-green-algae-uk-dogs
sniffout.co.uk/guides/dog-walks-brachycephalic-breeds
sniffout.co.uk/guides/autumn-dog-walks-uk
```

---

### Internal Linking Structure

The AllTrails model applied to Sniffout:

- Every walk page links to its area index page ("More dog walks in Sussex")
- Area index pages link to relevant editorial guides ("Planning a walk with a flat-faced breed? Read this first")
- Editorial guides link to specific walk pages and area pages
- Homepage links to top area pages (most populated areas first)
- A "walks near [location]" dynamic element on walk pages links to geographically proximate walks

This creates a flywheel: each walk page added strengthens its area page, which ranks higher, which drives more traffic to walk pages, which drives more installs.

---

### Filtering on Area Index Pages

The risk with filtering is creating thousands of near-duplicate pages that Google penalises as thin content. Best practice:

- **Render filters client-side (JavaScript)** — the filter does not change the URL, so Google sees only one page per area. This is how AllTrails handles it on category pages.
- If URL-based filtering is needed (for "off-lead dog walks Sussex" as a distinct SEO target), create dedicated pages rather than appended query parameters: `sniffout.co.uk/walks/sussex/off-lead/`
- Use `rel="canonical"` to point filtered views back to the parent page if URL-based filtering is unavoidable

---

### Essential Pages at Launch vs Nice to Have

**Essential at launch:**
1. One walk page per walk (100 pages)
2. Area index pages for each covered region (10-15 pages)
3. Homepage
4. Install page (unified, platform-detecting)
5. About page (who built this, why, ethos)
6. Sitemap.xml
7. robots.txt

**Nice to have, Phase 2:**
- Editorial/guide pages (seasonal hazard guides, breed-specific guides)
- "Walks near [town]" pages for major population centres
- Search results page (indexed by Google for broad queries)

**Defer:**
- Blog with pagination (creates orphaned pages at low volume)
- User-submitted walk pages (community features add complexity)
- Multi-language (English only at launch)

---

### Single Install Page vs Per-Channel Landing Pages

**Recommendation: One unified install page with platform detection.**

A single page at `sniffout.co.uk/get` (or `sniffout.co.uk/install`) that detects the user's platform and surfaces the relevant primary CTA first:
- iOS visitor → "Add to Home Screen" step-by-step guide + App Store button (secondary)
- Android visitor → Google Play button (primary) + "Add to Home Screen" (secondary)
- Desktop visitor → QR code + all three options

Why not separate pages? Separate landing pages split the SEO authority and require separate marketing URLs. A single canonical install page accumulates all backlink equity in one place, which is better for ranking.

---

### Sitemap and robots.txt

**sitemap.xml:** Submit to Google Search Console on day one. Include all walk pages, area pages, editorial guides, and the homepage. Exclude: filtered views, pagination pages beyond page 2, admin routes.

**robots.txt:** Allow all robots on content pages. Block: any admin or CMS paths, staging subdomains, duplicate filter URLs.

Update the sitemap programmatically whenever a new walk page is added. Most static site generators (Hugo, Astro, Eleventy) generate sitemaps automatically from the content files.

---

## Section 2 — Design and Visual Approach

### How Leading Outdoor Apps Handle Companion Websites

**AllTrails:** The website shares visual language with the app (same green brand, same card patterns) but is more content-dense. Desktop website is media-rich (hero photography per trail, map embeds). The website feels like an extension of the app, not a separate product. Mobile web experience closely mirrors the app. This continuity reduces cognitive friction when users arrive from Google and then install the app.

**Komoot:** Website is functionally rich — route pages include elevation profiles, surface type breakdowns, photos from the community. Visually clean and sport-focused. Designed to be used as a planning tool in itself, not just as an install funnel.

**Walk Highlands:** 600,000 unique monthly visitors. Desktop-era design that is functional but dated. Despite this, the site works because the content is excellent and authoritative. Design quality is less important than content quality for SEO-driven traffic — but design quality determines whether organic visitors convert to installs.

**The Ramblers website:** Content-heavy, region-indexed. Strong coverage of public rights of way. The model for information architecture on a UK walking content site.

**Recommendation for Sniffout:** Use the same brand system as the PWA (Woodland Green #2C4A14, Plus Jakarta Sans, warm off-white backgrounds) but in a content-optimised layout. The visual language should feel like the companion to the app — a dog owner who has used the app should recognise the website immediately. This is a trust signal: the brand is consistent and coherent.

---

### What Converts Visitors to Installs

**General research findings:**
- CTAs placed above the fold convert 317% higher than below-fold CTAs
- Personalized CTAs (platform-specific messaging) convert 202% better than generic
- Adding keyword captions to screenshots boosts App Store search visibility by 22%

**For a walking/outdoor app specifically:**
The visitor's intent on a walk page is to get information about the walk. The install CTA should answer the question they will naturally have once they've decided they want to do this walk: "How do I actually use this?" The CTA copies that work best are action-forward and benefit-forward:

- Do not use: "Download Sniffout" or "Install our app"
- Use: "Plan this walk in Sniffout" / "Open in Sniffout" / "Get live weather for this walk"

For the install page itself (sniffout.co.uk/get), the primary message should be the value proposition, not the install mechanics. Something that reflects the personal record angle: "Your dog's walk journal. Free, no account required."

---

### Platform Detection and Install CTA Strategy

**Android (Chrome):** The browser fires a `beforeinstallprompt` event when the PWA meets install criteria. Intercept this event and build a custom install button ("Add Sniffout to your home screen") that is visually on-brand rather than relying on the browser's generic prompt. Trigger it after the user has shown engagement (e.g. after scrolling a full walk page, or after viewing three walks).

**iOS (Safari):** There is no programmatic install prompt available on iOS. The install flow is manual: user must tap the Share icon in Safari, then "Add to Home Screen." Conversion on iOS PWA installs is lower than Android. The website must include a clear, friendly how-to diagram explaining this. iOS visitors should also be directed to the App Store button (for the wrapped native app) as the primary CTA — the App Store submission provides a much smoother iOS install flow.

**Desktop:** Show a QR code linking to the install page. Desktop visitors are a small minority (dog walk searches skew heavily mobile) but should not be abandoned.

**Smart app banners (iOS/Android meta tag):** Use these as a secondary nudge — they appear automatically when the website is loaded in mobile Safari or Chrome if the app is listed in stores. Smart banners are less visually integrated but cost nothing to implement and reach users who don't encounter the custom CTA.

---

### Walk Page Visual Hierarchy

**The hero image problem:** Sniffout will not have photography for every walk at launch. Handling options:

1. **Illustration + location colour field:** A stylised illustration of the walk's dominant terrain type (woodland, coastal, moorland, urban park) in brand colours. Consistent, on-brand, clearly designed rather than "placeholder."
2. **Map cropped to walk bounds:** A static map image showing the route. Not photographic but highly informative and unique per walk. Works well above the fold.
3. **Seasonal abstract imagery:** A single set of high-quality, broadly applicable landscape photos (English countryside, seasonal light) licensed for unlimited use. Rotate by season. Less unique but better than a broken image.
4. **Opt-in photography campaign:** Prompt early users to submit a photo from any walk they complete. This builds a real photo library over time.

**Recommendation:** Use a map-crop as the hero (unique, informative, no photography needed) plus a secondary terrain illustration as a visual accent. Add a photography layer as user submissions come in.

---

### Mobile-First vs Desktop-First

Mobile-first without question. 84% of local searches are conducted on mobile. Dog walk searches are overwhelmingly mobile intent (people planning walks on their phones). The desktop version is a secondary consideration.

---

### Typography and Colour for a Content Website

**Use the same brand system as the PWA.** Plus Jakarta Sans at the heading and body weights already in use. Woodland Green #2C4A14 for primary actions and headings. The warm off-white (#F7F5F0) background system works well for long-form content — it is easier on the eyes than pure white for reading-heavy pages.

Adjustments needed for a content website vs the app:
- Body copy size 16-17px (larger than app UI text) for sustained reading
- Higher line height for guide/article content (1.65-1.75)
- Strong visual hierarchy for the practical info block on walk pages (distance, terrain, difficulty) using the existing brand chip/pill components
- Ensure print-friendly styles for walk pages (some users print route cards)

---

## Section 3 — App Store Strategy

### Google Play: Trusted Web Activity (TWA)

**What is required:**
- PWA Lighthouse score ≥ 80 (performance, accessibility, best practices, PWA criteria)
- HTTPS throughout
- Valid service worker and web app manifest
- Digital Asset Links verification: `assetlinks.json` file hosted at `sniffout.app/.well-known/assetlinks.json`, pointing to the Google Play app's signing key
- Android Developer account: $25 one-time registration

**Tools:** PWABuilder (Microsoft) generates the TWA package without writing Android code. Bubblewrap is the alternative CLI tool. PWABuilder is the easier path for a non-native Android developer.

**Process:**
1. Run PWABuilder on the sniffout.app URL — it generates an Android project (APK/AAB) ready for Play Store submission
2. Generate the Digital Asset Links association and host it on the site
3. Submit to Google Play Console via the internal testing track, then roll to production
4. Review time: hours to a day. More permissive than Apple.

**Cost:** $25 developer account registration. Free thereafter.

**Lighthouse score note:** The PWA must score 80+ on the Lighthouse PWA audit before submission. Specifically: it must have a service worker, a valid manifest with all required fields, HTTPS, and be installable. Sniffout already has these. Confirm the score before packaging.

---

### Apple App Store: PWABuilder vs Capacitor

**The fundamental iOS challenge:** Apple Guideline 4.2 requires that apps "include features, content, and UI that elevate it beyond a repackaged website." Apps that are purely a WebView wrapper of a website are routinely rejected. This is Apple's explicit policy.

**PWABuilder iOS:**
- PWABuilder generates an Xcode project wrapping the PWA in WKWebView
- This is community-maintained (Microsoft team no longer officially supports iOS output)
- Rejection risk under Guideline 4.2 is high without native additions
- Best-case scenario for approval: the app must include offline capability, working push notifications via APNS (Apple Push Notification Service), and a native feel

**Capacitor:**
- Capacitor (from the Ionic team) wraps a web app in a native iOS/Android shell with access to native APIs
- It enables adding genuine native features: push notifications, camera access, native share sheet, local notifications, haptic feedback
- This makes the app feel native enough to pass App Store review
- Requires: macOS + Xcode (to compile and sign), Apple Developer account (£99/year), and some native development knowledge or the owner follows the published Capacitor documentation

**Recommendation: Use Capacitor for iOS.** The investment (£99/year, Xcode learning curve, ~2-5 days to get the wrapped app working) is justified by:
1. Apple's 1.5 billion active devices — you cannot credibly compete in a UK consumer app market without iOS distribution
2. The App Store install flow is vastly smoother for iOS users than the Safari "Add to Home Screen" manual process
3. Push notifications through Capacitor + APNS are the only way to send native iOS push notifications to installed users (iOS blocks web push in most contexts)

**What you need Capacitor to add to pass review:**
- Working offline mode (service worker already handles this)
- Native share sheet (Capacitor's `@capacitor/share` plugin)
- Local notifications for daily walk reminders (Capacitor's `@capacitor/local-notifications`)
- Haptic feedback on key interactions (Capacitor's `@capacitor/haptics`)

These are all lightweight plugins. The core app code does not change — Capacitor wraps the existing HTML/CSS/JS.

---

### App Store Optimisation (ASO)

**Google Play (Android)**

Unlike the App Store, Google Play does not have a dedicated keyword field. Keywords are extracted by NLP from the title, short description, and long description.

Title (30 chars): `Sniffout — Dog Walks & Weather`

Short description (80 chars): `Find dog-friendly walks near you. Live weather alerts. Free, no account needed.`

Long description: Incorporate naturally: "dog walks UK", "dog walk finder", "dog-friendly walks near me", "UK dog walking app", "walk log for dog owners", "dog weather alerts", "off-lead walks UK." Write for readability; keyword density matters less than natural placement.

**Apple App Store**

Title (30 chars): `Sniffout: Dog Walks & Weather`

Subtitle (30 chars): `Find walks. Check conditions.`

Keywords field (100 chars — Apple does not index these publicly, competitors cannot see them):
Suggested: `dog walk,dog walks UK,dog walking,pet walk,dog friendly,walk finder,dog park,walk log,outdoors`

**Screenshots (both stores):**
Apple now indexes text within screenshots — add short keyword captions to each one. Use all screenshot slots. Recommended sequence for a dog walking app:
1. Walk discovery screen: "100 handpicked UK dog walks"
2. Weather verdict: "Know before you go — live weather opinion"
3. Walk log: "Your dog's walk journal — every walk remembered"
4. Dog profile: "Built around [dog name], not just you"
5. Nearby places: "Dog-friendly pubs, cafes, and vets near you"

Outdoor/utility apps see 10-30% conversion uplift from optimised screenshots. Update screenshots at least twice a year.

---

### Does App Store Presence Affect Google Web Search Ranking?

App store listings do not directly boost Google web search rankings for related keywords. The relationship is indirect:
- Google Play listings are indexed by Google and can appear in search results for branded queries ("Sniffout app")
- Having an app on both stores adds credibility signals that can increase click-through rates on web listings
- Reviews on the Play Store contribute to overall brand trust signals
- The companion website's SEO and the app store's ASO operate in separate systems but reinforce each other for overall discoverability

---

### Deep Linking: Universal Links (iOS) and App Links (Android)

**What they do:** When a user taps a link to `sniffout.app/walks/friston-forest` on their phone, Universal Links (iOS) and App Links (Android) open that content directly in the native app rather than in the browser — but only if the app is installed.

**What is required:**
- Host `/.well-known/apple-app-site-association` (AASA) on sniffout.app — a JSON file listing the app bundle identifier and which URL paths should open in the app
- Host `/.well-known/assetlinks.json` on sniffout.app — a JSON file listing the Android app's package name and SHA256 fingerprint
- Both files must be served with correct content-type headers, without redirects, and must be accessible without authentication
- The files cannot be served via CDN caches that alter response headers

**Implementation complexity:** Medium. The files are simple JSON; the complexity is in the server-side configuration. The main failure mode is CDN or hosting config interfering with `.well-known/` paths. If using Cloudflare for sniffout.app, ensure the AASA and assetlinks files are excluded from caching rules.

**Firebase Dynamic Links:** Firebase Dynamic Links were deprecated in August 2025. Do not use them. Use native Universal Links (iOS) and App Links (Android) directly.

**Recommendation:** Implement deep linking before submitting to either app store. It is required for the Google Play TWA submission (assetlinks.json is used for TWA verification, not just deep linking). For iOS, Universal Links require the AASA file to be in place before the binary is submitted.

---

### Launch Sequence: Simultaneous or Staggered?

**Recommendation: Stagger. Launch Android (Google Play TWA) first; iOS second (4-8 weeks later).**

Reasons:
1. TWA is technically simpler and faster — Google Play can approve in hours once submitted
2. iOS requires Capacitor work + Apple Developer account provisioning + app review (24-48 hours) + potentially resubmission if Guideline 4.2 triggers rejection
3. Android-first lets you test the app store install flow, ASO copy, and screenshot effectiveness before committing to iOS
4. UK iPhone market share is approximately 54% vs Android 45% (roughly equal), so not launching iOS immediately carries a cost — keep the gap short

---

### Review Generation Strategy

**iOS timing:** Apple limits review prompts to 3 per 365-day period. Use `SKStoreReviewController.requestReview()`. Best moment in Sniffout: after the user logs their 3rd walk. This is the "Aha moment" — they have established a walk pattern and are experiencing the personal record value.

**Google Play:** In-app review API. Same principle: after 3rd logged walk.

**Avoid:**
- Prompting immediately after first open
- Prompting after a negative event (error, failed weather load)
- Gating content behind reviews or incentivising reviews (against store policies)

---

## Section 4 — SEO Technical Requirements

### Structured Data (Schema.org)

Walk pages should implement multiple nested schemas. Priority order:

**1. TouristAttraction (primary schema for walk pages)**
```json
{
  "@type": "TouristAttraction",
  "name": "Friston Forest Dog Walk",
  "description": "A 4.5-mile circular walk...",
  "url": "https://sniffout.co.uk/walks/friston-forest",
  "image": "...",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "50.7914",
    "longitude": "0.1981"
  },
  "touristType": ["DogOwner"],
  "isAccessibleForFree": true
}
```

**2. Trip/TouristTrip (for the walking route itself)**
```json
{
  "@type": "Trip",
  "name": "Friston Forest Circular Walk",
  "description": "...",
  "duration": "PT1H30M",
  "touristType": ["DogOwner"],
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}
}
```

**3. BreadcrumbList (for area hierarchy)**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Sussex walks", "item": "..."},
    {"@type": "ListItem", "position": 2, "name": "Friston Forest", "item": "..."}
  ]
}
```

**4. FAQPage (for walk-specific FAQs)**
Add a small FAQ block to each walk page ("Is this walk suitable for large dogs?" / "Is there parking at Friston Forest?") and mark it up with FAQPage schema. FAQ schema generates rich results in Google — expanded answers visible directly in the search results page. This meaningfully improves CTR on walk pages.

Travel websites with proper schema implementation see up to 35% higher organic CTR than those without.

---

### Core Web Vitals Requirements (March 2026 Update)

Following the March 2026 core update, performance is now a ranking filter, not a tiebreaker:

| Metric | Target | Consequence of Failing |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.0s | Can prevent competitive ranking |
| INP (Interaction to Next Paint) | < 150ms | Now primary signal equal to LCP |
| CLS (Cumulative Layout Shift) | < 0.1 | Pages in red can be "relegated" |

75% of real-user sessions must fall in the "good" range for all three metrics.

**How to hit these on a static site:**
- LCP: The largest element on mobile is typically the hero image. Pre-compress all images (WebP format, sized for mobile viewport). Use `loading="eager"` and `fetchpriority="high"` on the hero image only; lazy-load everything else. No render-blocking JavaScript or CSS.
- INP: Minimise JavaScript execution on walk pages. A static site with minimal JS interaction naturally achieves good INP. Avoid any third-party scripts on the critical path (analytics should load async after page content).
- CLS: Reserve space for images in HTML before they load (`width` and `height` attributes on all `<img>` tags). Avoid injecting content above existing content after load.

**Static site advantage:** A well-built static site (Hugo, Astro, or plain HTML) with images served from a CDN should achieve LCP 1.2-1.8s, INP < 50ms, and CLS near 0 without heroic optimisation effort. This is a genuine advantage over AllTrails' React-heavy app-like website.

---

### Page Speed Targets

For sniffout.co.uk on mobile:
- Google PageSpeed Insights mobile score: 90+
- Time to First Byte (TTFB): < 200ms (achieved by CDN-delivered static files)
- Total page size (walk page): < 400KB including images
- JavaScript payload: < 20KB for a walk page (the page barely needs any JS)

---

### Open Graph and Twitter Cards

Every walk page must include:
```html
<meta property="og:title" content="Friston Forest Dog Walk — Sniffout">
<meta property="og:description" content="4.5 miles, off-lead sections, woodland terrain...">
<meta property="og:image" content="https://sniffout.co.uk/images/walks/friston-forest-og.jpg">
<meta property="og:url" content="https://sniffout.co.uk/walks/friston-forest">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
```

OG images: 1200x630px. Generate one per walk page using the map crop + walk name overlay. These appear when walk pages are shared on WhatsApp, Facebook, Twitter/X — dog owners sharing walk recommendations is a meaningful organic distribution channel.

---

### Canonical URLs and Duplicate Content

Each walk page has one canonical URL. If filtered views (e.g. `/walks/sussex/?offLead=true`) create URL variants, add `<link rel="canonical" href="/walks/sussex/">` pointing to the parent page.

AllTrails' approach to similar content across trail pages: they rely on unique route-specific details (exact distance, elevation, specific waypoints, unique trail narrative) to differentiate pages. Each Sniffout walk page must have a genuinely unique description — not a template with swapped-out location names. Google's Helpful Content updates specifically penalise thin, templated local content.

**Minimum unique content per walk page:** 150+ words of original description, plus structured practical data (unique to each walk). Do not generate walk descriptions with AI and publish without substantial human editing — this is exactly the pattern Google's Helpful Content guidance targets.

---

### Single Domain vs Subdomain

**Use a single domain path:** `sniffout.co.uk/walks/` not `walks.sniffout.co.uk/`

Reason: Subdomains do not automatically inherit the root domain's link authority in Google's eyes (despite Google's official stance that they are treated equally, in practice root domain paths accumulate authority more reliably for new sites). All SEO effort goes into one domain. This is the universally recommended approach for a site this size.

---

### App Indexing from Play Store

Google indexes app content from Play Store listings for branded queries ("Sniffout app") and can surface deep links from apps in search results if app indexing is properly configured via Search Console and the app passes verification. At Sniffout's scale this is a secondary consideration; the companion website's organic search presence is more impactful. Implement app indexing once the app is live; it adds discoverability with minimal effort.

---

### Local SEO Signals for Walk Pages

Walk pages benefit from local SEO signals:
- Include the specific town, county, and national park (if applicable) in the page title, meta description, and H1
- Use location terms that match how UK users search ("dog walks near Lewes", "East Sussex dog walk", "South Downs dog walk")
- The Geographic coordinates in structured data (above) signal location relevance to Google
- Include nearby towns in the natural copy ("a short drive from Brighton and Lewes")

---

## Section 5 — Content Page Templates

### What Dog Walkers Search for Before a Walk

Research confirms the primary information needs before a UK dog walk:

1. **Is there parking?** Often the first practical question
2. **Is it off-lead?** The defining dog-specific question
3. **How long is it?** Distance and approximate time
4. **What's the terrain like?** Muddy / paved / rocky / mixed
5. **Is there livestock?** Critical for off-lead decisions
6. **Where can I get a coffee/pub lunch nearby?** Common secondary need
7. **Is it suitable for my dog's size/breed/age?** Emerging need, currently underserved
8. **What will the weather be like?** The Sniffout differentiator

---

### Recommended Walk Page Content Hierarchy (Mobile)

**Above the fold (no scrolling):**
1. Walk name (H1) — "Friston Forest Circular Walk"
2. Location chip — "East Sussex · South Downs"
3. Hero image (map crop of the route, or terrain illustration)
4. Quick stats strip — 4 chips in one row: `4.5 mi` · `Easy` · `Off-lead ✓` · `Woodland`
5. **Install CTA** — "Get live weather for this walk → Open in Sniffout" (primary action)

**First scroll — the essential detail block:**
6. Dog-specific summary — 2-3 sentences covering: off-lead sections, livestock presence, terrain condition, any seasonal hazards. Written from the dog's perspective ("Good for all sizes. No livestock. Two streams to splash in.")
7. Practical info table — parking (yes/no + postcode), public transport (nearest station), facilities (toilets, dog-friendly cafe nearby), difficulty rating
8. Walk description — 150-200 words of original editorial text

**Second scroll — additional context:**
9. Seasonal hazard flags — if applicable (e.g. "Livestock: sheep on the ridge April-June")
10. Map section — static map image (not interactive embed — interactive maps are heavy and slow LCP)
11. "More walks near this one" — 3-4 linked walk cards for internal linking
12. "Plan this walk in Sniffout" — secondary install CTA

**Third scroll — discovery content:**
13. Area context — "Walking in East Sussex — more walks in this area →"
14. Editorial links — relevant guides ("Dog walks on the South Downs", "Summer walk safety for dogs")

---

### Map Embed Considerations

**Use a static map image, not an interactive embed.** Leaflet or Google Maps embeds:
- Add 200-500KB of JavaScript to every page load
- Harm LCP significantly
- Require JS execution before they render
- Add third-party tracking (Google Maps) that creates GDPR complexity

**Recommended approach:** Generate a static map image per walk (OpenStreetMap tile + route overlay, baked into a PNG/WebP at build time) using a headless map renderer (e.g. Mapnik, staticmaps Python library, or MapTiler's static maps API). This image is unique to each walk, helps users understand the route at a glance, and adds zero JS load.

Include a "View interactive map → Open in Sniffout" link below the static map image. This drives app installs from precisely the moment when the user is most engaged with the walk.

---

### Handling the "No Reviews Yet" Problem at Launch

Options:
1. **"Be the first to share this walk"** — prompt that links to the app's walk log. The absence of reviews becomes an invitation to contribute.
2. **Editorial note from Sniffout team** — "We walked this route in [season]. The [specific detail]." A short first-person team note carries more credibility than a placeholder.
3. **Suppress the reviews section entirely at launch** — show it only once reviews exist. An empty reviews section reads as abandoned.

**Recommendation:** Use option 2 for launch, transitioning to user-submitted notes as they come in. "Sniffout team walked this: muddy underfoot after rain, bring a lead for the farmyard section near the car park." This provides genuine utility and differentiates from AllTrails' anonymous crowd-sourced data.

---

### CTA Wording for Each Install Channel

| Channel | Primary CTA | Secondary CTA |
|---|---|---|
| PWA (Add to Home Screen) | "Add Sniffout to your home screen" | Step-by-step guide for iOS Safari |
| Google Play | "Get it on Google Play" | Standard Google Play badge |
| Apple App Store | "Download on the App Store" | Standard Apple badge |

Walk page CTA: "Get live weather for this walk → Open in Sniffout" (pre-install) / "Open this walk in Sniffout →" (post-install, via deep link).

The phrase "Open in Sniffout" is more compelling than "Download" because it implies the content is already there waiting — the user is opening something, not acquiring something.

---

## Section 6 — Conversion and Analytics

### Tracking Installs Across Three Channels

**PWA installs from the companion website:**
- Add UTM parameters to the manifest `start_url`: `"start_url": "/?utm_source=companion_website&utm_medium=pwa_install"`
- This tags every PWA session initiated from the companion website
- Track `appinstalled` event in the browser if `beforeinstallprompt` is implemented (fires when user completes PWA install on Android)

**Google Play installs:**
- Google Play Console provides install attribution data by UTM parameters when set in the referring URL
- Add UTM to the Play Store link from the companion website: `?utm_source=sniffout_website&utm_medium=referral&utm_campaign=walk_page`
- Google Play's "Install Referrer" API passes campaign parameters to the app on first open

**Apple App Store installs:**
- App Store does not support UTM parameter passthrough natively
- Use Apple's Search Ads Attribution API if running paid UA campaigns
- For organic attribution: Apple's aggregate reports in App Store Connect show the referring URL for web-to-app installs — the companion website domain will appear here
- Consider a redirect service (e.g. Branch.io links — now that Firebase Dynamic Links are deprecated) that handles cross-platform deep linking with attribution

---

### UTM Parameter Strategy

Standard parameter set for all links from sniffout.co.uk to app stores:

| Parameter | Value | Purpose |
|---|---|---|
| utm_source | sniffout_website | Identifies companion website as origin |
| utm_medium | organic_web | Traffic type |
| utm_campaign | walk_page / area_page / guide / homepage | Which content type drove the install |
| utm_content | [walk-slug] | Which specific walk page (for walk pages) |

Use lowercase only, consistent naming, no spaces (use hyphens). Inconsistent casing creates duplicate sources in analytics.

---

### Analytics Setup Recommendation

**Primary: Plausible Analytics**

Reasons:
- GDPR and PECR compliant out of the box — no cookie consent banner required under UK/EU law
- Script is 75x smaller than GA4 — no LCP impact
- Captures an estimated 55% more traffic than GA4 when consent banners are active (Plausible research) — particularly relevant for a UK audience that has been trained to reject cookie consent
- Supports UTM parameters natively
- Attempts to recover Android app-referred traffic (Gmail, Slack, Telegram) that appears as "Direct / None" in GA4
- Price: approximately $9/month (team starter)

**Secondary (optional): GA4**

If the owner needs integration with Google Search Console, Google Ads, or requires granular funnel analysis, add GA4 as a secondary analytics layer. Do not use GA4 as the primary analytics tool for sniffout.co.uk — the consent requirement means you will systematically undercount UK users.

**What to track from day one:**

| Event | Tool | Why |
|---|---|---|
| Page views by walk page | Plausible | Which walks drive traffic; SEO validation |
| Outbound clicks to Play Store | Plausible goal | Play Store conversion intent |
| Outbound clicks to App Store | Plausible goal | App Store conversion intent |
| `appinstalled` event | Custom JS → Plausible | PWA install confirmation |
| Walk page → install page flow | Plausible funnel | Conversion path optimisation |
| UTM campaign performance | Plausible (built-in) | Which content types drive installs |
| Google Search Console impressions + CTR per walk page | GSC (free) | Which pages rank; which queries trigger them |

---

## Deliverables

### 1 — Recommended Site Structure

```
sniffout.co.uk/                              → Homepage
sniffout.co.uk/get                           → Unified install page (platform-detecting)

sniffout.co.uk/walks/                        → All walks index
sniffout.co.uk/walks/[walk-slug]             → Individual walk page (100 at launch)
sniffout.co.uk/walks/sussex/                 → Sussex area index
sniffout.co.uk/walks/yorkshire/              → Yorkshire area index
sniffout.co.uk/walks/london/                 → London area index
sniffout.co.uk/walks/[region]/               → [other area indexes]

sniffout.co.uk/guides/                       → Editorial guides index
sniffout.co.uk/guides/[guide-slug]           → Individual guide page

sniffout.co.uk/about                         → About / who built this
sniffout.co.uk/sitemap.xml                   → Sitemap (auto-generated)
```

---

### 2 — Walk Page Content Hierarchy (Mobile)

```
1.  WALK NAME (H1)
2.  Location chips: [County] · [Area]
3.  HERO IMAGE (static map crop, 360px tall, WebP, preloaded)
4.  Quick stats strip: [Distance] · [Difficulty] · [Off-lead status] · [Terrain]
5.  INSTALL CTA: "Get live weather for this walk → Open in Sniffout"
    ─ ─ ─ fold ─ ─ ─
6.  Dog summary: 2–3 sentences, dog-first framing
7.  Practical info table: Parking · Transport · Facilities
8.  Walk description: 150–200 words original text
9.  Seasonal hazard flags (if applicable)
10. Static map image with "Open interactive map in Sniffout →" link
11. More walks nearby: 3 linked cards
12. Secondary install CTA: "Plan this walk in Sniffout →"
13. Area link: "More [county] dog walks →"
14. Related guide links
```

---

### 3 — Install CTA Strategy

**One unified install page** at `sniffout.co.uk/get`. Platform detection JavaScript at the top of the page:

- **iOS Safari visitor:** Shows (a) App Store badge as primary CTA; (b) "Add to Home Screen" guide with annotated Safari screenshot as secondary; (c) Google Play badge hidden or tertiary
- **Android Chrome visitor:** Shows (a) Google Play badge as primary CTA; (b) "Add to Home Screen" custom prompt as secondary (if `beforeinstallprompt` event available); (c) App Store badge tertiary
- **Desktop visitor:** Shows QR code pointing to `/get`; all three options visible; messaging: "Scan to get Sniffout on your phone"
- **Unknown/other:** Shows all three options equally with brief explanation of each

**Walk page CTA:** Single floating bar (fixed bottom of screen, dismissable) on mobile, appearing after the user has scrolled to the practical info section. Text: "Get live weather for this walk →" Links to the app, with fallback to the install page if app is not installed.

**Never show the install prompt:**
- On first page load before user has scrolled
- After the user has already installed (detect via display-mode: standalone media query)
- More than once per session if dismissed

---

### 4 — Ten Most Important Decisions Before Building

1. **Static site generator choice** — Hugo (fastest build, mature) or Astro (zero-JS default, modern) for the companion website. Both are viable; Hugo is safer for a non-JavaScript-specialist owner.

2. **URL structure commitment** — decide between flat `/walks/[slug]` and region-scoped `/walks/[region]/[slug]` before writing a single page. Changing later requires 301 redirects across 100+ pages.

3. **Photography strategy** — decide at build time: static map crops, terrain illustrations, or licensed stock imagery as the hero treatment. This affects the build system (map generation tooling) and visual design.

4. **Content generation approach** — AI-assisted with human editorial review, or fully original. This decision affects both quality and cost. Given Google's Helpful Content emphasis, every walk page must have genuinely unique, informative content. Do not skip the editorial review layer.

5. **HTTPS and assetlinks/.well-known configuration** — these must work correctly before app store submission. Confirm that the hosting provider (Cloudflare Pages or equivalent) serves `.well-known/` files without caching or redirect interference.

6. **Capacitor vs deferring iOS** — building the Capacitor wrapper requires macOS + Xcode. If the owner does not have a Mac, the iOS App Store channel must be deferred to when one is available. Make this decision before committing to a three-channel launch timeline.

7. **Analytics tool** — choose Plausible (or Fathom) now, before launch. Retrofitting analytics consent architecture after launch is significantly more complex than starting with a cookieless solution.

8. **Plausible goals setup** — define the key conversion events (Play Store click, App Store click, PWA install, walk page → install page flow) before launch, not after. Analytics without defined goals is noise.

9. **Schema markup implementation** — build the TouristAttraction and FAQPage schemas into the walk page template at the time of build, not as a retrofit. Schema is most efficiently implemented in the page template once rather than page by page.

10. **Canonical URL handling for similar walks** — if two walks are in the same area and have overlapping descriptions (common for nearby woodland walks), decide the de-duplication strategy upfront: either make descriptions genuinely distinct, or mark one as canonical. Google's duplicate content assessment is more aggressive in 2026 than previous years.

---

### 5 — Analytics Setup

**Recommended stack:**

| Tool | Purpose | Cost |
|---|---|---|
| Plausible Analytics | Primary web analytics, UTM tracking, conversion events | ~$9/month |
| Google Search Console | SEO performance, keyword impressions, crawl errors | Free |
| Google Play Console | Android install data, ratings, crash reports | Included in $25 developer account |
| App Store Connect | iOS install data, ratings, crash reports | Included in £99/year developer account |

**Track from day one:**
1. **Page views per walk page** — identifies highest-traffic walks; validates SEO targeting
2. **Outbound clicks to Play Store** (Plausible goal: `click-playstore`)
3. **Outbound clicks to App Store** (Plausible goal: `click-appstore`)
4. **PWA `appinstalled` event** (custom JS event sent to Plausible)
5. **Walk page to install page conversion rate** (Plausible funnel: walk page → `/get`)
6. **UTM campaign breakdown** — which walk pages, area pages, and guides drive the most install intent
7. **Google Search Console: impressions + CTR per page** — weekly review to identify ranking gains and pages with high impressions but low CTR (CTA improvement opportunities)

**Dashboard cadence:** Weekly: top-performing walk pages, total install clicks, search impression trends. Monthly: search ranking position changes per page, new keywords ranking, UTM source breakdown.

---

*Report ends.*
*Saved: docs/research/website-structure-research-march-27.md*
*Research conducted: 27-28 March 2026*
