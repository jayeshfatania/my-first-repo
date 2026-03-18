# Me Tab Dashboard Research
## Product Design Decision Document — Sniffout v2

**Prepared:** March 2026
**Scope:** Personal stats dashboard for the Me tab in `sniffout-v2.html`
**Constraint:** All state is localStorage only. No backend. Stats must be derivable from `sniffout_favs`, `sniffout_explored`, `walkReviews`, and walk data in `WALKS_DB`.

---

## Executive Summary

**Key findings across all four research questions:**

- **Distance and activity count are the two stats outdoor app users care about most.** They appear as the hero stat in Strava, AllTrails, Komoot, and OS Maps. Everything else is secondary.
- **"All-time" totals feel more meaningful than weekly or monthly numbers** for a walk discovery app, because the emotional payoff is accumulation over time — not performance optimisation.
- **Streak mechanics are the single highest-engagement gamification pattern**, with users 2.3x more likely to engage daily after a 7+ day streak. But streaks punish absence harshly and suit daily-habit apps (Duolingo, Headspace) more than occasional-use apps like Sniffout.
- **Icon + number is the dominant mobile stat card pattern** across all leading apps. Icons aid quick scanning without adding clutter, provided they are simple line/outline style. Data-only feels clinical; illustrated rings/arcs are overkill for a casual-use product.
- **Dog-specific stats that feel meaningfully different from general fitness:** walks completed (not miles, because dog owners care about the outing, not the distance), terrain variety experienced, and saves/favourites as a discovery proxy.
- **Empty states should never show zero-value counters.** Hide stats until at least one qualifying action is taken. Replace with a single warm, action-oriented prompt. "Ghost data" (greyed example stats) is appropriate only for complex multi-panel dashboards, not simple card grids.
- **The first action to encourage on an empty Me tab** should be to explore a walk — not to fill in profile settings. The stat should populate passively from use, not require active data entry.

---

## Research Question 1 — What Stats Resonate in Outdoor / Walking Apps

### Strava

**Stats shown on profile:**
- Strava's profile page shows personal stats for the sport types uploaded most frequently in the past 90 days, structured as: averages for the last four weeks, totals for the year, and all-time totals.
- Within activity feeds, Strava shows a maximum of 3 metrics per activity when there are no achievements, and 2 metrics when at least one achievement is displayed. The default pairing is **distance + pace/speed**. Elevation replaces pace if elevation gain exceeds 100ft/mile.
- The sport type shown most frequently and recently appears most prominently — ordering is determined by frequency of recent use, not user choice.
- Community feedback (Strava Community Hub) consistently requests the ability to customise which stats appear, indicating that the defaults don't always align with what users value. This is a signal that **distance is treated as universally meaningful but other metrics are contested**.

**Hero stat:** Distance. Cumulative distance is the number users cite when describing their Strava profile to others ("I've done 800km this year").

**Third-party engagement signal:** The existence and popularity of tools like Statistics for Strava (a self-hosted open-source dashboard with 1,000+ GitHub stars) and VeloViewer demonstrates strong user demand for richer personal stats than the native app provides. Key additions these tools offer: Eddington number, heatmaps, year-on-year comparison charts, gear mileage — suggesting users want context and progress narrative, not just raw totals.

### AllTrails

**Stats shown on profile:**
- Miles hiked (lifetime), elevation gain (lifetime), moving time (lifetime)
- Personal bests for each category
- Monthly graph view showing mileage, elevation, and moving time over time
- Stats & Achievements feature (launched 2023) — badges earned, trails completed count
- Verified Completed badge on individual trails (earned by recording an activity that overlaps 75%+ of the verified route)

**Hero stat:** Miles hiked, displayed prominently at the top of the Stats tab. AllTrails named Apple's iPhone App of the Year 2023, partly on the strength of the Achievements feature.

**Insight:** AllTrails frames the stats section as "Celebrate your time outside" (the exact copy used in their LinkedIn announcement of the Achievements feature). This framing — celebration over performance — is directly relevant to Sniffout's positioning.

### Komoot

**Stats shown on profile:**
- Distance, elevation, time, sport type — per activity and aggregated
- Personal heatmap showing most-visited areas and routes (mobile only)
- Activity statistics filterable by time period and sport type
- Statistics are private by default (only visible to the user in their profile)
- Map-based adventure log with photos and Highlights attached to completed tours

**Hero stat:** Total distance, with the map/heatmap as the visual hero — places visited matters as much as distance covered.

**Insight:** Komoot's heatmap is a distinctly place-based stat. It shows where you've been, not just how far. This is meaningful for a discovery-focused product like Sniffout: the **map of places visited is a compelling stat** that distance alone doesn't capture.

### Apple Health / Apple Fitness Rings

**Stats shown:**
- Activity rings (Move/Exercise/Stand) as the primary visual — a progress arc toward daily goals
- Step count, distance walked/run, flights climbed — shown as tiles on the Summary tab
- Weekly trends shown as small bar charts within each tile

**Hero stat:** The three activity rings are the dominant visual. The Move ring (active calories) is the central ring and the most emphasised.

**Insight from UX research on rings:** Apple's rings succeed because they are **goal-referenced rather than absolute**. A number like "2.3km walked" means nothing without context; a ring at 80% complete means you're nearly there. This goal-referencing pattern is worth noting for Sniffout — framing a stat as progress toward something is more motivating than a bare number.

### Nike Run Club

**Stats shown:**
- Distance run (weekly, monthly, year-to-date)
- Recent runs timeline
- Milestones and achievements (trophies displayed on profile)
- Coaching plan progress

**Hero stat:** Distance, specifically weekly distance relative to recent history.

**Gamification insight:** NRC uses streaks, milestones, and leaderboards. Research cited by StriveCloud notes that NRC "dominates the fitness category by using behavioral psychology to turn solitary running into a social, goal-oriented habit." Specifically: NRC maintains significantly higher loyalty in an industry where most apps lose 80% of users within 90 days. The key psychological drivers cited are **usefulness** (immediate, actionable data validates effort) and **ease of use** (frictionless interface).

### Fitbit

**Stats shown on Today/home dashboard:**
- Steps (hero, largest display)
- Distance, calories, Active Zone Minutes, floors climbed — secondary tiles
- Health metrics (heart rate, sleep score, stress) — separate section
- Dashboard is fully customisable via drag-and-drop tiles

**Hero stat:** Steps — because it is the most universally understood and immediately actionable metric. Distance is secondary.

**Insight:** Fitbit's research-backed design choice to make steps the hero (not distance, not calories) reflects that steps feel **controllable and gameable**. You can decide to take 500 more steps. You can't decide to run 0.3 more miles mid-walk. For a casual app, the stat that feels actionable is more motivating than the one that is technically more precise.

### What Makes a Stat Feel Meaningful vs. Noise

Based on academic research from MDPI (Motivation and User Engagement in Fitness Tracking) and self-determination theory:

**Stats that feel meaningful (create pride and return visits):**
- Stats with a narrative of accumulation — "I've done X total" (all-time distance, walks completed)
- Stats that reference a goal or benchmark — rings, streaks, personal bests
- Stats that show place or territory — heatmaps, "walks in X regions"
- Stats that feel shared — reviews left, other walkers helped (community contribution)

**Stats that feel like noise (users ignore or find anxiety-inducing):**
- Pure performance metrics without context — average pace, average heart rate (irrelevant for casual walkers)
- Stats that require active data entry — calorie intake, weight
- Stats that show how little you've done — "0 days streaked", "0 reviews left"
- Vanity metrics — app open count, profile views

**Academic finding:** A 2017 study (Motivation and User Engagement in Fitness Tracking, MDPI) established that three design factors directly impact motivation: data quality, gamification design, and content quality. Goal focus — framing data as progress toward something — is the strongest motivator, serially mediated by perceived feedback meaningfulness and self-empowerment.

---

## Research Question 2 — Icons vs. Visuals vs. Data Only

### The Three Approaches in Practice

**Approach 1: Data only (number + label, minimal/no icon)**

Best example: Apple Health summary tiles in the older iOS design. Pure numbers with small labels, no decoration.

**What the research says:** Data-only dashboards score well for information density but poorly for emotional engagement. They feel clinical — appropriate for medical tracking (blood pressure, HRV) where precision matters more than motivation. For a casual walking discovery app, data-only risks the dashboard feeling like a spreadsheet.

Dashboard design research (Justinmind, UX Studio, Toptal) consistently finds that mobile dashboards should be designed for "the glance check use case" — the user pulling out their phone to see if a metric is on track, not for deep analysis. Data-only layouts work for power users who are already emotionally invested; they do not work for casual or occasional users.

**Approach 2: Icon + number (small supporting icon beside or above stat)**

Best examples: Fitbit's tile design, Nike Run Club activity cards, AllTrails stat rows.

This is the dominant pattern across virtually every fitness and outdoor app. A small icon (16–20px, outline/line style) sits above or to the left of a large number, with a label below. The icon provides category recognition at a glance without requiring users to read the label.

**What the research says:**
- Icons aid scanning speed — users can identify stat categories before their eye resolves the text label
- Icons create visual anchors that make the layout more scannable in the F/Z eye-scan pattern
- The MDPI fitness tracking research notes that "visual symbols of progress elicit feelings of pride and satisfaction"
- Fitbit's badge and achievement design is specifically cited as tapping into users' desire for accomplishment through visual signifiers
- Icons should be simple line/outline style for clean aesthetics; filled icons risk looking heavy; illustrated icons add charm but increase complexity

**Risk:** Icons only add value if they are immediately recognisable. Abstract icons for abstract stats (e.g., what icon means "terrain variety"?) add confusion rather than clarity. The rule: if you need a legend to explain the icon, don't use one.

**Approach 3: Illustrated / graphic (activity rings, progress arcs, charts)**

Best examples: Apple Fitness rings, Strava's annual summary charts, Fitbit's weekly trend sparklines.

**What the research says:** Progress arcs and rings succeed when tied to a daily goal, because the visual incompleteness creates a "near-miss" psychological state that motivates action (closing the ring). This is well-documented in behavioural economics. However, this mechanism requires frequent, daily use — the user must open the app every day to benefit from the ring mechanic.

For Sniffout — an occasional-use, walk discovery app — progress rings tied to daily goals are inappropriate. Users who open the app once a week will always see an empty ring, which is demotivating rather than motivating.

**What fits best for a clean, minimal design with occasional users:**

Icon + number is the correct approach for Sniffout's Me tab, with the following specifications:
- Simple SVG outline icons, matching the bottom nav icon style already in the codebase (consistent visual language)
- Large number (the hero — e.g., 28pt or equivalent), with label below in `--ink-2` colour
- Stats arranged in a 2-column card grid, maximum 2 rows (4 stats total on first view), with additional stats optionally below
- No progress arcs — these require daily engagement to motivate
- No bar charts — these require enough data history to be meaningful; a new user with 3 walks cannot interpret a 12-month chart

**On emotional connection through icons:**

Research on emotional design (Codebridge, Figr.design, UPTop) establishes that icons contribute to reflective design — the layer of design that creates pride, connection, and loyalty. The example consistently cited is Duolingo, where progress tracking, rewards, and personalised paths create a sense of achievement. Animated icons are noted as zero-learning-curve communication tools, but animation is unnecessary and potentially gimmicky for Sniffout's aesthetic.

**Colour and visual hierarchy recommendation:**

The `--brand` colour (`#1E4D3A`) used sparingly on the large stat number creates the emotional signal "this is a meaningful number" without visual noise. Secondary labels in `--ink-2` keep the layout clean.

---

## Research Question 3 — Dog Walking Specific Stats

### What General Fitness Stats Don't Capture

The core insight from dog walking research: **dog owners walk differently from solo fitness trackers.** A study from PMC (Odds of Getting Adequate Physical Activity by Dog Walking) found that dog walkers walk an average of 9 times per week, 34 minutes per session. But the motivation is companionship and the dog's needs — not personal fitness goals.

This means:
- **Distance and pace are low-relevance stats** for dog walking. Dog walkers don't care if they walked at 3.2 mph vs 3.5 mph.
- **The outing itself — the walk completed — is the meaningful unit**, not the miles covered.
- **Novelty and variety are intrinsically motivating for dogs and owners.** Research on dog walking engagement consistently notes that mental stimulation through varied environments is key to a happy dog. Owners who learn their dog is stimulated by new environments are more likely to seek out new walks.

### Dog-Specific Stats Evaluated

**1. Walks completed (total)**
Rating: HIGH VALUE. This is the core unit of meaning for a dog owner. "We've completed 28 walks together" is a statement about the relationship, not about fitness. It maps directly to `sniffout_explored` (walk IDs viewed) in Sniffout's existing localStorage schema.

**2. Favourited walks (saved)**
Rating: MEDIUM-HIGH VALUE. Reflects curation and discovery investment. "You've saved 12 walks" tells the user their personal collection is building. Maps to `sniffout_favs`.

**3. Terrain variety (coastal / woodland / moorland / paved)**
Rating: MEDIUM VALUE — HIGH CHARM. The concept is meaningful (variety of environments experienced with the dog) but requires terrain data per walk to compute. Sniffout's schema includes `terrain: "paved" | "muddy" | "mixed" | "rocky"`, which is not quite the same as environment type. Implementing a meaningful terrain diversity stat would require either schema extension or a proxy derived from location/name. **Worth noting for v3, but not computable from current schema without changes.**

**4. Discovery stat (new walks found / completed)**
Rating: HIGH VALUE. Maps directly to `sniffout_explored`. The framing matters: "28 walks explored" feels like discovery; "28 activities logged" feels like a fitness tracker. Language choice is critical.

**5. Community contribution (reviews left, conditions reported)**
Rating: MEDIUM VALUE for POC stage. Reviews exist in `walkReviews` localStorage, so a "reviews written" count is computable. However, Sniffout has no community backend at POC stage — reviews are local only. Showing "reviews written" when those reviews aren't visible to others risks feeling hollow. **Defer to when community backend exists.**

**6. Streak (consecutive days walked)**
Rating: LOW VALUE for Sniffout specifically. Streaks are the highest-engagement gamification pattern in daily habit apps (2.3x daily engagement after 7-day streak, per Plotline research). But Sniffout tracks walk *exploration* from a curated database of 50+ walks, not daily walk logging. Users don't log walks in Sniffout; they discover and view walk cards. A streak built on "opened the app daily" is a dark pattern. A streak built on "completed a walk daily" requires active logging, which Sniffout doesn't have. **Do not implement.**

**7. Seasonal completions (walked in all four seasons)**
Rating: LOW VALUE for POC. No timestamp metadata per walk in current schema (beyond what's derivable from session). Interesting as a long-term retention mechanic ("You've walked in 3 seasons — can you find a winter walk?") but not computable from current data.

### What Makes a Dog Walking Stat Specifically Meaningful

The key distinction vs. solo fitness tracking is **companionship framing**. Stats about "we" (the dog-owner pair) rather than "I" (the individual) resonate differently. AllTrails' framing of "Celebrate your time outside" is close but generic. The Sniffout equivalent would be framing stats around the walks shared with the dog — the adventures, the discoveries, the new places explored together.

Concrete framing examples:
- "28 walks explored" (not "28 activities logged")
- "12 walks saved" (not "12 favourites")
- "Your collection" (not "Your stats")

This framing is free — it costs nothing to implement and transforms a generic stats panel into something that feels built for dog owners.

---

## Research Question 4 — Empty State Best Practice

### What the Research Establishes

The canonical source on empty state UX is Nielsen Norman Group (NNG), which identifies three guidelines:
1. Explain what the empty area is for
2. Tell users how to populate it
3. Don't make users feel they've done something wrong

NN/G and UXPin both cite that "leaving empty spaces empty creates confusion and decreases user confidence — and misses a goldmine of opportunities for increasing usability and discoverability."

### Real-World Examples

**Duolingo**
Duolingo's empty states use the Duo mascot with a short, friendly illustration and copy that redirects to a lesson. Specifically: "Streak shields protect your streak if you miss a day. Complete a lesson to get your first streak shield." The pattern is: acknowledge the empty state neutrally, then point to the one action that fixes it. UserOnboarding.Academy specifically notes "Duolingo's empty state is encouraging" as a positive pattern.

**AllTrails (new user)**
AllTrails' profile shows the stats panel with lifetime totals visible from day one (at 0). However, AllTrails has a workaround: the Achievements section shows locked badges with greyed-out illustrations, which serve as "ghost data" — they communicate what's possible without requiring the user to have earned anything yet. The copy on locked badges describes what you'd need to do to earn them, making zero-state feel like potential rather than emptiness.

**Strava (new user)**
Strava's profile shows the stats table immediately with all zeros. This is widely criticised in the Strava Community Hub as feeling deflating for new users. Community posts complain that "all-time stats not visible / showing zero" feels like a broken state. This is a documented example of what NOT to do.

**Headspace / Duolingo (streaks)**
Both apps hide the streak counter until a streak actually begins. Showing "0 day streak" is actively avoided because it frames the user as having failed before they've started.

**Monzo**
Monzo is cited across multiple UX design resources as a benchmark for first-run experience. Its approach: the home screen on first open shows a warm, action-oriented prompt with a single CTA ("Add money to get started"), and no empty stat tiles that would show £0.00 everywhere. The design choice to not show zero balances everywhere is deliberate — they appear only after first use.

### Showing "0" vs Hiding Stats Until Earned

**The research consensus is clear: hiding stats until earned is better than showing zeroes.**

Key findings:
- Milestone celebrations increase user progression by 40% (onboarding UX research, Appcues)
- Showing progress — even partial — reduces drop-off because it makes onboarding feel "structured and achievable"
- The "ghost data" / greyed-example approach (FanDuel Design System, used by AllTrails for locked badges) is appropriate when you want to communicate what's possible without implying the user has failed

**The ghost data approach for Sniffout:**
Show a single empty-state card with an illustration and copy, not a grid of "0" counters. The card communicates what the stats section will show once the user has explored some walks.

### Copy Principles for Empty States

From UXPin, Carbon Design System, and UX Writing Hub:
- Write the title as a positive statement: "Your walks will appear here" (not "You haven't explored any walks yet")
- Keep copy short — it should be fast to read and act upon
- Include exactly one CTA — multiple options cause paralysis
- Avoid guilt or implication of failure — no "still empty", no "nothing here yet"
- Add personality without being gimmicky — a short, warm line that reflects the brand voice

Smashing Magazine (2017, still the canonical reference on empty state onboarding) states: "Empty states are a major onboarding opportunity. New users will inevitably encounter them. They serve as blank canvases to educate, nudge, or show personality."

---

## Final Recommendations

### Recommended Stats to Show (max 6, priority order)

**Priority 1 — Walks Explored**
`sniffout_explored.size` — the count of unique walk IDs the user has viewed/opened.
Rationale: This is the core unit of meaning for Sniffout. It's a discovery metric, not a fitness metric. It accumulates passively from use. Framing: "28 walks explored". This should be the hero stat — largest number, top of the grid.

**Priority 2 — Walks Saved**
`sniffout_favs.length` — the count of favourited walks.
Rationale: Saves reflect investment and intent. A user with 12 saved walks has built a personal collection. This is a curation metric unique to walk discovery apps. Framing: "12 saved". Paired with a small bookmark/heart icon.

**Priority 3 — Reviews Written**
`Object.keys(walkReviews).length` — count of walks the user has left a review on.
Rationale: Contribution stat. Low numbers are expected and fine — even "1 review" is worth celebrating. This is the closest Sniffout has to community contribution at POC stage. Framing: "3 reviews". Pair with a star or speech bubble icon.

**Priority 4 — Off-Lead Walks Explored**
Count of explored walk IDs where `offLead === "full"` — derivable from cross-referencing `sniffout_explored` with `WALKS_DB`.
Rationale: Dog-specific. Owners who value off-lead freedom will feel this stat reflects their priorities. It distinguishes Sniffout from a generic walking app. Framing: "9 off-lead walks".

**Priority 5 — Nearby Walks Remaining (Discovery Prompt)**
`WALKS_DB.length - sniffout_explored.size` — walks not yet explored.
Rationale: This inverts the explored count to create a discovery prompt. "22 walks still to discover" is motivating because it frames the stat as potential, not deficit. This is the one stat that explicitly encourages return visits. Framing: "22 to discover". This could be styled differently from the other stats — lighter weight, or in `--ink-2` — to signal it's a prompt rather than an achievement.

**Priority 6 — (Optional, Phase 2) Terrain Badge**
A single derived label: "Coastal | Woodland | Mixed" or similar, derived from the dominant terrain type among explored walks. This requires some engineering to compute meaningfully but adds dog-specific character. Hold for Phase 2 once the stats grid is validated.

**Deliberately excluded:**
- Total miles walked — Sniffout doesn't track actual walks taken; it tracks exploration of a curated database. Showing "0.0 miles" because the user hasn't connected a GPS tracker is misleading.
- Streak — punishes absence, requires daily logging, not appropriate for this use case.
- Calories — completely irrelevant to dog walking discovery; generic fitness tracker territory.
- Location count (regions visited) — appealing in theory (like Komoot's heatmap) but not computable from current schema without additional geocoding.

### Visual Approach Recommendation

**Use Icon + Number.** This is the correct approach for Sniffout's Me tab, for the following reasons:

1. Sniffout's user is a casual, occasional opener — not a daily tracker. Data-only layouts work for power users who are already invested; they fail to create emotional engagement for occasional visitors.
2. Icons from the existing SVG icon set (used in bottom nav) create visual consistency without design cost.
3. The 2-column card grid with icon + large number + label is the dominant pattern across every leading outdoor and fitness app (AllTrails, Komoot, Fitbit, NRC).
4. Progress arcs and rings require daily engagement to motivate — inappropriate for Sniffout's use frequency.
5. Bar charts and sparklines require historical data depth that new users won't have.

**Avoid:**
- Progress rings or arcs (wrong use frequency)
- Bar/line charts (require data depth)
- Coloured filled icons (too heavy for the clean card aesthetic)
- Emoji as icons (paw emoji is reserved per CLAUDE.md)

### Icon Style Recommendation

**Outline / line SVG icons, 20px, `--ink-2` colour, consistent with bottom nav icon style.**

- Same visual language as the rest of the app
- Outline style matches the clean, uncluttered aesthetic
- Keep the icon small (supporting role) — the large number is the hero
- Each stat gets one icon: a compass rose for "explored", a bookmark for "saved", a star for "reviews", a dog/paw-free leash icon for "off-lead", a map pin for "to discover"

Note on the paw emoji constraint: CLAUDE.md reserves the paw emoji (🐾) for the paw safety block only. Icons should be SVG, not emoji.

### Empty State Recommendation

**Do not show a grid of zero counters.** On first open (when `sniffout_explored.size === 0`), show a single centred empty-state card in place of the stats grid.

**Suggested layout:**
- A simple SVG illustration (e.g., dog walking silhouette or walking boot — small, ~48px, in `--brand` colour)
- Headline: **"Your walks start here"**
- Body: **"Explore a walk to start building your collection."**
- CTA button (secondary style): **"Find a walk"** — deep links to the Walks tab via `showTab('walks')`

**What to avoid in the empty state:**
- "You haven't explored any walks yet" — implies failure
- "Nothing here" / "Still empty" — clinical and unhelpful
- "0 walks explored, 0 saved, 0 reviews" — the Strava anti-pattern; actively discouraging
- Multiple CTAs — one action only

**Transition:** Once `sniffout_explored.size >= 1`, replace the empty state card with the stats grid. Stats that are still zero (e.g., 0 reviews) can be shown as "—" rather than "0" — this signals "not yet" rather than "nothing".

### Dog-Walking Specific Additions Worth Considering

1. **"Off-lead walks explored" stat** (Priority 4 above) — computationally cheap, meaningfully dog-specific, distinguishes Sniffout from a generic hiking app.

2. **Seasonal framing in the "to discover" stat** — once timestamp logging is available in a future version, "2 new walks this season" would be engaging for occasional users who use the app in bursts.

3. **Terrain diversity summary** — a qualitative summary line below the stats grid ("You've explored coastal, woodland and park walks") rather than a numeric stat. This adds character and is easier to implement than a full terrain diversity metric, but requires that explored walks span multiple terrain types.

4. **The framing language throughout** — use "explored" not "logged", "saved" not "favourited", "your collection" not "your stats". This is free and transforms the panel from a generic fitness dashboard into something that feels built for dog owners specifically.

### Explicit Exclusions and Why

| Element | Reason to Exclude |
|---|---|
| Total miles walked | Sniffout tracks discovery, not GPS activity. Miles would show 0 unless walk-logging is added. Misleading. |
| Streak counter | Requires daily logging. Punishes absence. Wrong use frequency for a discovery app. |
| Calories burned | Generic fitness metric with no relevance to walk discovery or dog walking. |
| Activity rings / progress arcs | Require daily engagement to motivate. Will show as nearly empty for casual users, which is demotivating. |
| "0" zero-value stats on new user | Documented anti-pattern (Strava Community Hub complaints). Use "—" or hide until first action. |
| Social comparison / leaderboard | Community features are explicitly deferred in CLAUDE.md. No backend to support it. |
| Profile photo / avatar | Fine UX in general, but CLAUDE.md defers user accounts. No auth = no persistent identity = avatar is cosmetic only. Adds complexity for minimal value at POC. |
| Bar charts / sparklines | Require data depth. Meaningless with 1–5 data points. Add visual noise without insight. |

---

## Sources

- [Your Strava Profile Page – Strava Support](https://support.strava.com/hc/en-us/articles/216917697-Your-Strava-Profile-Page)
- [Activity Stats in the Feed – Strava Support](https://support.strava.com/hc/en-us/articles/15422373796493-Activity-Stats-in-the-Feed)
- [Statistics on profile – Strava Community Hub](https://communityhub.strava.com/general-chat-2/statistics-on-profile-6493)
- [Include walking activities in My Stats – Strava Community Hub](https://communityhub.strava.com/t5/ideas/include-walking-activities-in-my-stats/idi-p/1434)
- [Understanding the AllTrails App – AllTrails Help](https://support.alltrails.com/hc/en-us/articles/44409942124052-Understanding-the-AllTrails-App)
- [How to find your activities and completed hikes – AllTrails Help](https://support.alltrails.com/hc/en-us/articles/360018931392-How-to-find-your-activities-and-completed-hikes)
- [AllTrails Achievements feature announcement – LinkedIn](https://www.linkedin.com/posts/alltrails_introducing-our-newest-feature-achievements-activity-7107445522096910336-AP5p)
- [AllTrails Named Apple's 2023 iPhone App of the Year – PR Newswire](https://www.prnewswire.com/news-releases/alltrails-named-apples-2023-iphone-app-of-the-year-302001617.html)
- [What is a Verified Completed badge – AllTrails Help](https://support.alltrails.com/hc/en-us/articles/360021841811-What-is-a-Verified-Completed-badge-and-how-do-I-earn-one)
- [Zeige und filtere deine activity statistics – komoot](https://support.komoot.com/hc/de/articles/10360951736858-Zeige-und-filtere-deine-activity-statistics)
- [Komoot Features – The Best Outdoor Tech](https://www.komoot.com/features)
- [Create your own Komoot Dashboard – Medium](https://medium.com/@franzke.christoph/create-your-own-komoot-dashboard-6a0cd35ab89)
- [Motivation and User Engagement in Fitness Tracking – MDPI](https://www.mdpi.com/2227-9709/4/1/5)
- [Intrinsic motivations in health and fitness app engagement – PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11907615/)
- [Motivation crowding effects on gamified fitness apps – Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1286463/full)
- [Streaks and Milestones for Gamification in Mobile Apps – Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps)
- [Gamification in apps: A complete guide – RevenueCat](https://www.revenuecat.com/blog/growth/gamification-in-apps-complete-guide/)
- [Nike Run Club gamification examples – StriveCloud](https://www.strivecloud.io/blog/gamification-examples-nike-run-club)
- [How to use the dashboard on Fitbit – Android Central](https://www.androidcentral.com/how-use-dashboard-fitbit-android)
- [Fitbit Health Metrics redesign – Android Central](https://www.androidcentral.com/wearables/fitbit/fitbits-health-metrics-are-getting-a-redesign-on-android-and-ios)
- [Dashboard Design best practices – Justinmind](https://www.justinmind.com/ui-design/dashboard-design-best-practices-ux)
- [Dashboard Design UX Patterns – Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- [Intuitive Mobile Dashboard UI: 4 Best Practices – Toptal](https://www.toptal.com/designers/dashboard-design/mobile-dashboard-ui)
- [Dashboard Design best practices – Toptal](https://www.toptal.com/designers/data-visualization/dashboard-design-best-practices)
- [Emotional design in UI/UX – Codebridge](https://www.codebridge.tech/articles/emotional-design-in-ui-ux-creating-memorable-user-experiences)
- [How to Use Emotional Design to Create a Great App – Designli](https://designli.co/blog/how-to-use-emotional-design-to-create-a-great-app/)
- [How to Design a Fitness App: UX/UI Best Practices – Zfort](https://www.zfort.com/blog/How-to-Design-a-Fitness-App-UX-UI-Best-Practices-for-Engagement-and-Retention)
- [Fitness App UX – Stormotion](https://stormotion.io/blog/fitness-app-ux/)
- [Odds of Getting Adequate Physical Activity by Dog Walking – PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4535333/)
- [An Online Social Network to Increase Walking in Dog Owners – PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4286532/)
- [Empty state UX examples and design rules – Eleken](https://www.eleken.co/blog-posts/empty-state-ux)
- [Designing Empty States in Complex Applications – Nielsen Norman Group](https://www.nngroup.com/articles/empty-state-interface-design/)
- [Empty States – The Most Overlooked Aspect of UX – Toptal](https://www.toptal.com/designers/ux/empty-state-ux-design)
- [Empty State UI Pattern – Mobbin](https://mobbin.com/glossary/empty-state)
- [Designing the Overlooked Empty States – UXPin](https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/)
- [Empty states in UX done right – LogRocket](https://blog.logrocket.com/ux-design/empty-states-ux-examples/)
- [The Role Of Empty States In User Onboarding – Smashing Magazine](https://www.smashingmagazine.com/2017/02/user-onboarding-empty-states-mobile-apps/)
- [Duolingo's empty state is encouraging – UserOnboarding.Academy](https://useronboarding.academy/user-onboarding-inspirations/duolingo-empty-state)
- [Duolingo – an in-depth UX and user onboarding breakdown – UserGuiding](https://userguiding.com/blog/duolingo-onboarding-ux)
- [13 Blank State Examples – InnerTrends](https://www.innertrends.com/blog/blank-state-examples)
- [Empty States, Error States & Onboarding – Raw.Studio](https://raw.studio/blog/empty-states-error-states-onboarding-the-hidden-ux-moments-users-notice/)
- [OS Maps – Hiking Photographer review](https://hikingphotographer.uk/2022/11/os-map-app-review-ordnanace-survey.html)
- [Statistics for Strava – Robin Ingelbrecht, Medium](https://ingelbrechtrobin.medium.com/introducing-statistics-for-strava-an-open-source-app-that-analyses-your-strava-data-f1147e0d5c1e)
- [Self-tracking behaviour in physical activity – Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/0144929X.2020.1801840)
- [Highlights displayed on the map – komoot](https://support.komoot.com/hc/en-us/articles/360058904532-Highlights-displayed-on-the-map)
