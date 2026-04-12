# Sniffout+ Subscription Spec
Date: 12 April 2026
Status: Approved by owner
Research: ~/Desktop/sniffout-website/docs/research/sniffout-plus-research-april-12.md

---

## Overview

Sniffout+ is the premium subscription tier for Sniffout.
It launches when the product reaches 5,000+ MAU with
strong retention. It gates only new features - nothing
currently free is ever paywalled.

The Komoot lesson is the most important constraint in
this spec: in March 2025, Komoot paywalled existing
features, triggered a community backlash so severe that
"Komooted" entered cycling vocabulary as a synonym for
extractive monetisation, and the company was sold in
distress weeks later. Every Sniffout+ feature must
pass this test: does this exist in the free product
today? If yes, it cannot be gated.

---

## Pricing

| Option | Price | Notes |
|--------|-------|-------|
| Annual | £29.99/year | Lead option. Frame as "less than £2.50/month" |
| Monthly | £3.99/month | Escape hatch. Position as "try before committing" |
| Lifetime (founder offer) | £69 | Time-limited. Cap at 500 purchases. See below. |
| Pack Plan (multi-dog) | £44.99/year | Defer to 1,000+ subscribers |

Annual subscribers show 2.5x better 1-year retention
than monthly (33.9% vs 13.8%). Always lead with annual.
Show monthly equivalent in small text: "£2.50/month,
billed annually."

Monthly pricing at £3.99/month = £47.88/year annually -
deliberately 37% more expensive than annual to drive
annual conversion.

### Lifetime Founder Offer

Price: £69 (below standard formula of 2.5-4x annual
to drive early adopter conversion and generate
pre-revenue cash).
Cap: 500 purchases maximum, or time-limited to
launch window - whichever comes first.
Expected revenue from 500 sales: £34,500.
After cap: lifetime available at £99-119 if at all.

### Pack Plan

£44.99/year for up to 3 dogs in one household.
Do not launch at V1. Target: 1,000+ paying subscribers.

---

## Break-Even Analysis

Infrastructure costs at 5,000 MAU: ~£1,220/year
(Google Places API ~£100/month, Firebase free at this
scale, Cloudflare free, domain ~£20/year).

| Conversion Rate | Subscribers | Annual Revenue | Surplus |
|-----------------|-------------|----------------|---------|
| 1% | 50 | £1,500 | +£280 |
| 2% | 100 | £3,000 | +£1,780 |
| 3% | 150 | £4,498 | +£3,278 |
| 5% | 250 | £7,498 | +£6,278 |

Break-even at 1% conversion. AllTrails benchmark is
~1.25% implied conversion. Freemium median is 2.6-5.8%
for well-executed apps. Financial risk of launching
Sniffout+ is low.

---

## Always Free (non-negotiable, never paywalled)

- Walk library (full access, all walks)
- Today tab weather scoring (current day)
- Nearby dog-friendly places
- Walk journal (log walks, notes, ratings)
- Dog profile (breed, size, age, one dog)
- Saved walks (up to 20)
- Account creation and cross-device sync
- Walk Wrapped basic annual card (3+ walks threshold)
- Basic breed-specific weather notes
- Basic hazard alerts (current day)

---

## Sniffout+ Feature Set (V1 Launch)

### Tier 1 - Must have at launch

**A1. 7-Day Detailed Weather Scoring**
Extends current same-day hourly scoring to a 7-day
forward view. Shows per-day walk quality scores and
best 2-3 walk windows across the week. Free tier
stays at today + tomorrow.
Open-Meteo already provides 7-day forecasts at no
extra cost - this is a display and logic change only.
Impact: 5 | Complexity: Low

**B1. Offline Walk Packs**
Subscribers can download walk cards for offline
access. Each pack includes: walk description,
distance and duration, hazard notes, weather
snapshot at download time, static map image.
Stored in browser cache via service worker extension.
Not interactive vector maps (too complex for PWA) -
structured offline bundles per walk.
Strongest universal paid hook. Every major competitor
gates offline as primary paid feature.
Impact: 5 | Complexity: Medium

**E3. Best Time to Walk Prediction**
For the user's most-used walk location, surfaces
the best walk window for tomorrow based on the
existing scoring model. Shown in the Today tab.
Impact: 4 | Complexity: Low

### Tier 2 - Within 3 months of Sniffout+ launch

**C1. Breed Exercise Goals and Daily Activity Tracker**
Sets a personalised daily and weekly exercise target
based on breed group, age, and size. Walk log entries
count toward the goal. Progress shown as a daily
indicator in the Me tab.
No UK competitor has this. Uses existing dog profile
and walk log data. Transforms Sniffout from walk
directory to health companion.
Impact: 5 | Complexity: Medium

**B2. Walk Difficulty Personalisation**
Re-scores walk difficulty based on the user's specific
dog profile (breed, age, size). Shown as a secondary
badge alongside the standard difficulty rating.
Builds on the breed sensitivity system already built.
Impact: 4 | Complexity: Medium

**F3. Partner Perks and Discounts**
Negotiated discounts with aligned brands: pet
insurance, dog food subscriptions, veterinary
services, outdoor gear. Shown in a Perks section
in the Me tab for subscribers only.
A single redeemed discount (e.g. £20 off Everypaw
pet insurance) pays for the annual subscription.
Extends existing AWIN affiliate strategy.
Impact: 4 | Complexity: Low

### Tier 3 - After traction

**E1. AI Walk Recommendation Engine**
Weekly personalised walk recommendation combining
walk suitability for the dog's breed and age,
7-day weather forecast score, and the user's walk
history. Requires C1 and 7-day scoring to be in
place first.
Impact: 5 | Complexity: Medium-High

**A4. Ground Conditions Intelligence**
Estimates current ground conditions (firm, soft,
waterlogged) from recent rainfall and temperature
data. Shown as a pill on walk cards.
Impact: 4 | Complexity: Medium

**C3. Post-Surgery Recovery Walk Mode**
User flags restricted exercise. App suppresses
long-walk suggestions, adjusts daily targets, and
pre-filters walks to short and flat routes.
Impact: 4 | Complexity: Low-Medium

**A2. Pollen Alert Layer**
Daily pollen count overlaid on weather view with
dog-specific context for breeds prone to seasonal
allergies. Uses Open-Meteo european_aqi endpoint
already identified in CLAUDE.md.
Impact: 3 | Complexity: Low

### Future consideration (post-traction)

**B3. Estimated Duration by Breed**
Walk duration personalised by breed average pace.
Impact: 3 | Complexity: Low

**C2. Vet-Recommended Activity Guidelines**
Puppy 5-minute rule, senior dog monitoring, life
stage exercise context.
Impact: 4 | Complexity: Low

**F2. Early Access to New Walks and Features**
New walks previewed to subscribers 2 weeks early.
Feature betas offered to subscribers first.
Impact: 3 | Complexity: Low

**A5. Historical Walk Conditions**
Average weather scores for a walk by month over
the last 12 months.
Impact: 3 | Complexity: Medium

**B5. Walk Variations**
Shorter and longer options surfaced on walk detail.
Editorial initially.
Impact: 3 | Complexity: Low

**Professional Tier (B2B)**
For rescue centres and veterinary practices.
£99/year per organisation. No competitor equivalent.
Defer until Phase 3.

---

## Walk Wrapped

Walk Wrapped is a free annual summary feature for
all users who have logged at least 3 walks.

Walk Wrapped must be free. Strava paywalling their
Year in Sport was universally criticised (road.cc,
BikeRadar, Cycling Weekly). The viral acquisition
mechanism only works if all users participate - a
paywalled Wrapped eliminates the sharing effect.

### Free tier Wrapped
- Annual walk count and total distance
- Favourite walk (most visited)
- Shareable visual card (1 design, branded)
- Dog-first framing: "Luna walked 89 miles with you"

### Sniffout+ Wrapped (additive)
- Monthly breakdown bar chart
- Multi-year comparison (year 2 onwards)
- Premium shareable card designs (3 variants)
- Superlatives and badges ("Top 10% of walkers")
- Hazards avoided and weather score history
- PDF download of full report

### Timing and acquisition
- Release: first week of December or first week
  of January
- Every shareable card must include Sniffout
  branding and a QR code or URL
- At 5,000 MAU with 10% sharing rate: projected
  10,000+ new organic installs from one campaign
- Walk Wrapped is the most cost-effective
  acquisition campaign Sniffout can run

### Sponsorship
At 2,000+ MAU, approach a single relevant UK pet
brand to sponsor the Walk Wrapped experience.
Estimated value: £500-2,000 at 5,000-10,000 MAU.
Candidate sponsors: Everypaw (hazards avoided card),
Benyfit Natural or Butternut Box (most active dog
award), Hills or Royal Canin (health achievement
cards).

---

## Competitor Pricing Reference (verified April 2026)

| App | Annual Price | Primary Paid Hook |
|-----|-------------|-------------------|
| AllTrails+ | ~£28/year | Offline maps, wrong-turn alerts |
| AllTrails Peak | ~£63/year | AI routes, condition forecasts |
| Komoot Premium | £59.99/year | Offline maps, device sync |
| Strava | £54.99/year | Route planning, advanced stats |
| OS Maps | £39.99/year | Full OS mapping, offline |
| Outdooractive Pro | ~£26.99/year | Offline maps, navigation |
| HiiKER PRO+ | ~£34.50/year | OS + Harvey maps, offline |
| Sniffout+ (proposed) | £29.99/year | Dog weather intelligence, offline walks, health tracking |

Sniffout+ sits at the accessible end of a credible
peer group. Below OS Maps and all major competitors.
Above the free tier without apology.

---

## Hard Rules (locked)

1. Never paywall existing free features under any
   circumstances. The Komoot case study is the
   clearest possible evidence of why this destroys
   trust permanently.

2. Walk Wrapped basic card is always free for all
   users with 3+ logged walks.

3. Core walk discovery, today weather scoring,
   account creation, and cross-device sync are
   always free.

4. Every Sniffout+ feature must be additive - it
   must not exist in the free product today.

5. No display advertising ever, regardless of
   subscriber count.

---

## Launch Trigger

Launch Sniffout+ when:
- 5,000+ MAU sustained for 2+ months
- Tier 1 features (offline packs, 7-day weather,
  best time to walk) are built and tested
- Payment infrastructure in place (Stripe or
  equivalent)
- Privacy Policy and T&Cs live (Sprintlaw)
- At least one Tier 2 feature in development

Do not launch Sniffout+ with only Tier 1 features
if the build has taken less than 3 months from the
5,000 MAU trigger - use that time to ensure Tier 2
features are close behind.

---

## Out of Scope for Sniffout+

- Google OAuth (Phase 4 auth feature, not Sniffout+)
- Push notifications (Phase 4)
- Community walk submissions (Phase 2 product feature,
  free for all users when launched)
- Walk route maps (Phase 2)
- Public profiles or social features

END OF SPEC
