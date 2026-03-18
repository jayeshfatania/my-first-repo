# Sniffout — Product Vision Update
*Issued by: Product Owner*
*Date: March 2026*
*Inputs: me-tab-dashboard-research.md; community-gamification-roadmap.md; CLAUDE.md; Researcher strategic brief (five features)*

---

## Strategic Context

The Researcher has identified a reframing opportunity. Sniffout currently positions itself as a discovery tool: find a good walk, check the weather, go. The reframe is to make it a personal record — a dog walking journal that happens to also be the best way to find new walks.

This is a meaningful shift. Discovery tools are used occasionally and replaced when something better appears. Personal records are irreplaceable. "We've done 34 walks together, and I have notes from most of them" is not something a user migrates away from. This is the correct strategic direction.

The Researcher's five features are the mechanism for this shift. This document assesses each one across phases, updates the Me tab stat set, reviews the badge system, and surfaces all decisions the owner needs to make before implementation begins.

**One important constraint:** the community-gamification-roadmap.md established that streaks are not appropriate for Sniffout, and the owner has re-confirmed rejections of streak-adjacent stats. This principle carries through to badge design — no mechanic that prescribes frequency or punishes absence.

---

## Part 1 — Feature Assessment: All Five Across Phases

---

### Feature 1 — Dog Profile

**What it is:** Name, breed, age, size. Everything in the app becomes personalised around the dog rather than the owner. "Walks Biscuit has done." Walk cards can surface breed-relevant caveats. The emotional framing changes from "my walks" to "our adventures."

**Why it matters:** The Researcher identifies this as the feature that makes Sniffout irreplaceable. A user without a dog profile uses Sniffout. A user with a dog profile — with their dog's name appearing in their stats, their notes, their Wrapped summary — has a relationship with the app. That's a fundamentally different retention dynamic. AllTrails has never cracked this because its users are hikers, not dog owners. Sniffout owns this space by default.

---

#### Phase 2 — Dog Profile in localStorage

**What can be built without Firebase:** The full dog profile experience.

The profile is a single localStorage object (`sniffout_dog_profile`) containing:

```
{
  name:  "Biscuit",
  breed: "Golden Retriever",  // free text or dropdown — see Decision 1 below
  size:  "large",             // small | medium | large
  age:   "adult"              // puppy | adult | senior
}
```

**What Phase 2 enables immediately:**
- Dog name appears in Me tab stats ("34 walks with Biscuit")
- Dog name appears in the Wrapped summary (Feature 4)
- Dog name appears in walk notes (Feature 2): "Add a note from today's walk with Biscuit"
- Size field enables a soft filter: walks with stiles can show a "not ideal for small dogs" indicator in the walk detail if the user has a small dog in their profile
- Age field enables a soft filter: walks tagged `difficulty: "hard"` can show a "not ideal for older dogs" note for users with a senior dog

**What it does NOT do in Phase 2:** Breed-specific filtering at walk-list level (that requires meaningful breed data, a breed taxonomy, and walk-specific breed tags — Phase 3 scope). Size and age do allow walk detail contextual notes without changing the filtering logic itself.

**Build notes:** Profile setup belongs in the settings sheet (the gear icon on the Me tab). The onboarding question ("Tell us about your dog") should appear once, optionally, when the user first reaches the Me tab — not as a hard gate. If skipped, stats default to "you" framing. Dog profile can be updated at any time via the settings sheet.

**Phase 2 decisions required:** See Decision 1 (breed field format), Decision 2 (size categories), Decision 3 (age format), Decision 4 (single dog or multiple).

---

#### Phase 3 — Dog Profile with Firebase

**Evolution:** The localStorage profile migrates to the user's Firebase account on sign-in. The migration message becomes a compelling hook: "We found your Biscuit profile — it's been saved to your account."

**What Phase 3 adds:**
- Profile syncs across devices (the owner's phone and a partner's phone both show Biscuit)
- Dog profile photo — an optional field, not required, but powerful. A dog's photo in the app creates the strongest emotional connection and is the thing that gets screenshotted and shared.
- Multiple dogs: if an owner has two dogs, they can maintain separate walk logs for each. Phase 3 supports this; Phase 2 does not.

**Breed-specific filtering (Phase 3 scope):** Once users have breed data stored, Sniffout can surface breed-relevant information. This requires:
1. A breed field in the user's dog profile (free-text is fine for Phase 2; a dropdown with ~50 common UK breeds is needed for Phase 3 filtering)
2. Walk-level breed-relevant tags (does the walk have water for swimming? high stiles? exposed moorland in heat?) — requires walk schema extension with owner sign-off

This is genuinely differentiated — no walking app does breed-specific filtering. It is also a meaningful amount of editorial work to tag walks accurately. Confirm this as a Phase 3 investment before committing.

---

#### Phase 4 — Dog Profile as Social Identity

**Evolution:** The dog becomes the social profile unit, not the owner. Users follow dogs, not people. Walk logs are shared under the dog's name.

**What Phase 4 enables:**
- "Follow Biscuit's adventures" — a public dog profile with a shared walk log
- Dog-to-dog recommendations ("Dogs similar to Biscuit also explored Burbage Moor")
- Walk companions: mutual followers who log the same walk within 24 hours are surfaced as "walked this together"
- Sniffout Wrapped is shared as Biscuit's year, not the owner's year — the dog is the protagonist in the shareable content, which is more emotionally resonant and more likely to be shared on social

**Design constraint for Phase 4:** The dog profile must always be optional. Some owners are intensely private about their dogs. Opt-in to public, not opt-out.

---

### Feature 2 — Walk Notes / Post-Walk Log

**What it is:** After marking a walk as done, one optional text field. Private. No structure. No prompts. "Biscuit swam in the river. Packed lunch at the top."

**Why it matters:** This is the feature that makes Sniffout feel like something users would never delete. A fitness tracker with your workout times is data. A journal with "Biscuit found a fox" is a memory. The Researcher is correct that this is the emotional anchor. It costs very little to build.

---

#### Phase 2 — Walk Notes in localStorage

**What can be built without Firebase:** The full notes experience, including one note per walk visit and note display inside the walk detail overlay.

**Recommended storage structure:**

The existing walk log stores `{ id, ts }` per entry. Extend this to include an optional `note` field:

```
sniffout_walk_log: [
  { id: "malham-cove", ts: 1741200000000, note: "Biscuit swam in Gordale Beck. Packed lunch at the tarn." },
  { id: "malham-cove", ts: 1737500000000, note: "Too muddy near the top. Beautiful light though." },
  { id: "burbage-moor", ts: 1739200000000, note: null }
]
```

**Why per-visit notes, not per-walk-ID notes:** The same walk visited in different seasons produces different memories. A note from a summer walk ("swum in the river") is distinct from a winter visit ("frosted over, turned back at the ridge"). Attaching notes to individual log entries preserves the full journal. This also motivates repeat visits — each visit can have its own note.

**UX flow:**
1. User taps "Mark as walked" in the walk detail overlay
2. Walk is logged (existing `logWalk()` logic)
3. Conditions sheet appears (existing flow)
4. After conditions sheet is dismissed: a note prompt appears — a simple text area with a placeholder and a "Save note" button, plus "Skip" in smaller text below
5. Note is saved to the most recent log entry for this walk

**Alternatively:** Rather than a sequential prompt, show the note field inline in the walk detail overlay after the "Walked today" state is set — a persistent "Add a note from today's walk" text area below the button. This is less disruptive and allows the user to add the note at any point while the overlay is open, not just immediately after logging.

**Note display:** On return visits to the walk detail overlay, show the most recent note (if any) below the walked button. "From your last visit: 'Biscuit swam in the river.'" This is the feature that creates the "you've been here before" feeling.

**Phase 2 decisions required:** See Decision 5 (note prompt timing), Decision 6 (note character limit).

---

#### Phase 3 — Walk Notes Synced

**Evolution:** Notes sync to Firebase as part of the walk log. Notes from the owner's device and a partner's device stay in sync.

**What Phase 3 adds:**
- Optional note sharing: when leaving a walk review, the user can optionally pull text from their most recent note as a starting point for the review. "Turn your note into a review?" This reduces friction for review writing and produces better-quality review text (personal, specific, authentic — exactly the kind of review Sniffout wants).
- Note history: the full list of notes for a walk (across all visits) is surfaced in a "Your history" section of the walk detail overlay.

---

#### Phase 4 — Walk Notes in Social Context

**Walk notes are the raw material for the Wrapped summary** (Feature 4). In Phase 4, the user's notes feed a personal year-end story.

Notes could also be optionally surfaced as "From a local dog owner" highlights on the walk detail page — analogous to Komoot's Highlights feature. This requires explicit opt-in and is Phase 4 scope.

---

### Feature 3 — Walk Wishlist

**What it is:** A separate list from favourites. "Want to do" vs "loved it." A walk can be favourited (explored and loved) or wishlisted (haven't done yet, want to). Both can coexist.

**Why it matters:** Favourites without wishlists creates a semantic problem: the heart button means "I loved this walk" but is currently used as a catch-all save mechanic. A user who hearts a walk they haven't done yet is misrepresenting their status. The wishlist separates intent ("I want to go here") from experience ("I've been here and loved it"). This also drives return visits: a user with six walks on their wishlist has six reasons to come back.

---

#### Phase 2 — Walk Wishlist in localStorage

**What can be built without Firebase:** The full wishlist experience.

**Storage:** `sniffout_wishlist` — an array of walk IDs, identical in structure to `sniffout_favs`.

**On the walk card and walk detail overlay:** Two action states per walk:
- **Wishlist button:** bookmark icon (not heart). "Add to list" / "On your list". Tapping adds or removes the walk from `sniffout_wishlist`.
- **Favourite button (heart):** remains for walks the user has actually explored and loved. Semantically: "I've done this and want to return."

**Interaction design consideration:** Having two action buttons on a walk card risks visual clutter. Options:
1. Show both buttons on all walk cards (always visible — cluttered)
2. Show only the heart by default; wishlist button appears only in the walk detail overlay (recommended for cards, full controls in overlay)
3. Show wishlist button on the card only for walks the user hasn't explored yet; once explored, it auto-converts to favourites prompt

Option 3 is the most elegant — the wishlist is most useful for discovery (unexplored walks), and once a walk is done, the user's action is to heart it, not wishlist it. The auto-conversion could be a gentle suggestion ("You've done this walk — did you love it?") rather than automatic.

**What to do when a wishlisted walk is explored:** The walk remains on the wishlist until the user actively removes it or explicitly hearts it. The walk detail overlay can surface both states simultaneously: "On your wishlist · Did you love it?" with a heart CTA.

**Me tab impact:** A "walks on my list" stat is a natural addition to the Me tab stats — and it's the only stats item that represents future intent rather than past achievement. This creates an interesting dynamic: the stat motivates action. See Part 3 for stats recommendations.

**Phase 2 decisions required:** See Decision 7 (card UX — always visible or overlay only), Decision 8 (wishlist copy and icon), Decision 9 (auto-conversion on completion).

---

#### Phase 3 — Wishlist Synced

**Evolution:** Synced to Firebase. The wishlist is the most natural feature to make shareable: "My bucket list dog walks."

A public wishlist URL (e.g., `sniffout.app/list/biscuit-adventures`) allows the owner to share a curated list of walks they want to do. This is a Phase 3 social feature that costs almost nothing to build once Firebase is in place.

---

#### Phase 4 — Wishlist as Social Growth Lever

**Shareable wishlists become a growth channel.** "Biscuit's bucket list: 12 walks across Yorkshire and the Peaks" — a publicly accessible URL with a "Find your own walks on Sniffout" CTA at the bottom. Every share is organic acquisition.

The Wrapped summary (Feature 4) can incorporate wishlist progress: "You completed 4 of 8 walks on your list this year. 4 still to do in 2027."

---

### Feature 4 — Wrapped-Style Year Summary

**What it is:** Once a year (or per season), a personal summary. "You and Biscuit explored 14 walks this year. Three counties. Two coastlines. Mostly muddy." Shareable. Passive. Requires no active data entry — it computes from what the user has already done.

**Why it matters:** Spotify Wrapped generates more organic social content in its first 24 hours than most campaigns generate in a year. The mechanism is simple: take data users have already provided (by using the product), present it in a personal, narrative format, and make it shareable in one tap. For Sniffout, the dog is the protagonist — "Biscuit's Year in Walks" is more shareable than any generic fitness summary because it's about a dog. Social algorithms favour animal content. This is a built-in virality mechanism.

---

#### Phase 2 — Basic Year Summary (local only)

**What can be built without Firebase:** A static summary card within the Me tab.

**What's computable from current data:**
- Walks explored this year — from `sniffout_explored` timestamped schema (requires schema upgrade, already recommended in community-gamification-roadmap.md)
- Walks logged this year — from `sniffout_walk_log` entries filtered by year
- Walks saved this year — from `sniffout_favs` cross-referenced with WALKS_DB
- Walk log count by month — from `sniffout_walk_log` timestamps (simple monthly histogram)
- Locations visited — from `location` field of explored/logged walks (deduplicated by region string)
- Terrain types experienced — from `terrain` field of logged walks (paved/muddy/mixed/rocky)
- Dog name — from dog profile (Feature 1)

**What is NOT computable without schema extension:**
- "Two coastlines" — requires an `environment` field in WALKS_DB (see Decision 10)
- "Walked in three counties" — the `location` field is a region string (e.g., "Snowdonia, Wales"), not a county. County extraction from this field is brittle. Requires either a `county` field in WALKS_DB or post-code lookup per walk location.
- Weather conditions during walks — not currently stored in the walk log entry

**Phase 2 summary scope (what to include):**
- Walks explored (unique)
- Walks logged (including repeats)
- Regions visited (deduplicated `location` values)
- Dog name (if dog profile set)
- One headline stat (e.g., most-visited walk: "[Walk name] — visited 3 times")
- One qualitative line derived from terrain data (e.g., "Mostly muddy" if >50% walks have terrain: "muddy")

**Phase 2 display:** A card inside the Me tab with a "Your year" heading and a "View summary" button. The summary is a full-screen overlay or bottom sheet with the narrative stats laid out. Not a shareable image — that requires canvas rendering or server-side image generation (Phase 4).

**Trigger:** A "View your year" button in the Me tab, visible year-round (not just in December). This avoids the complexity of timed triggers and lets users revisit their summary at any point.

**Dog name dependency:** The Wrapped summary is significantly more powerful with the dog's name. If no dog profile exists, the copy defaults to "You explored 14 walks this year" rather than "You and Biscuit explored 14 walks this year." Gently prompt the user to add their dog's name if the profile is empty when they open the summary.

**Phase 2 decisions required:** See Decision 10 (environment field), Decision 11 (county data), Decision 12 (summary trigger timing).

---

#### Phase 3 — Wrapped with Walk Notes and Weather Context

**Evolution:** If walk notes are stored (Feature 2), the summary can extract a highlight note. "Best moment: 'Biscuit swam in the river.'" — pulled from the user's own words.

If weather condition is logged at the time of walk marking (an extension to the `sniffout_walk_log` entry schema), the summary can include: "4 walks in the rain. Biscuit didn't mind."

Phase 3 also enables multi-device sync — the summary is available on any device logged in to the account.

---

#### Phase 4 — Wrapped as Social Growth Mechanism

**The shareable card:** Server-side image generation (or Canvas API rendering in the browser) produces a shareable image in Instagram Stories format (9:16 ratio). The image contains:
- Dog's name and (if set) photo
- Headline stat ("14 walks this year")
- Key narrative lines ("3 regions · Mostly muddy · 1 swim in the river")
- Sniffout branding (app name, QR code to download)
- Year and the dog's name: "Biscuit's 2026"

**Sharing mechanism:** One tap shares to the system share sheet (iOS native, Android native). The shared image links to `sniffout.app` via a short URL. Organic acquisition from shares.

**Seasonal versions:** A "Biscuit's Autumn" card rather than annual-only extends the sharing opportunity to four times a year and gives frequent walkers a more granular narrative.

**Community aggregate:** In Phase 4, an anonymised aggregate Wrapped is possible: "Sniffout dogs explored 847 walks across 23 counties this year." Published as an annual review post. Social media and PR asset.

---

### Feature 5 — Achievements / Badges

**What it is:** Earned moments, not chased metrics. "First coastal walk." "Walked in the rain." "Three counties explored." The badge appears when you've earned it — you find out rather than working toward it.

**Why it matters:** The distinction between "chased metrics" and "earned moments" is fundamental. Chased metrics (progress bars, "5/10 walks to Explorer") turn achievements into tasks. Earned moments (badge appears passively, you find it in your Me tab) create the feeling of being seen: "the app noticed I've walked in three different regions." This is the Fitbit badge model, not the Duolingo streak model.

**Assessment of current badge spec vs Researcher's framing:**

The community-gamification-roadmap.md badge set:
- Explorer (5 walks), Trailblazer (10 walks), Regional Rambler (3+ regions), Weatherproof (3+ weather conditions), Seasonal Walker (same walk in 2 seasons), Favourites Collector (5+ favourited)

**These are all earned moments.** They are milestones with thresholds, not daily streaks. The only necessary UX change from the Researcher's framing is: **no progress indicators on locked badges.** Do not show "Trailblazer — 7/10." Show locked badges as a silhouette or blurred state with no count — just the badge name and a brief description of what it celebrates. The count only appears after the badge is earned.

**New badges the Researcher's examples suggest:**

These require either existing data or schema extensions:

| Badge | Trigger | Data available? |
|---|---|---|
| First coastal walk | First walk with `environment: "coastal"` logged | Needs `environment` field in WALKS_DB |
| Walked in the rain | Walk logged during active rainfall (weather_code ≥ 51) | Needs weather_code stored in walk log entry |
| Walked at sunrise | Walk logged within 30 min of sunrise time | Needs sunrise time stored in walk log entry |
| Three counties | Walks logged across 3 distinct counties | Needs county data in WALKS_DB |
| First off-lead walk | First walk with `offLead: "full"` logged | Available now |
| Five different terrains | Walks across all terrain types logged | Available now (4 terrain types in schema) |
| Hidden gem hunter | 3+ walks with `badge: "Hidden gem"` explored | Available now |
| First walk with [dog name] | First walk logged after dog profile set | Available after Feature 1 |

**Schema extension required for full badge set:** Adding `environment` (e.g., "coastal" | "woodland" | "moorland" | "urban" | "hillside" | "hillside") and `county` fields to WALKS_DB unlocks the most emotionally resonant badges (coastal, county-based). This is editorial work plus a PO schema sign-off. See Decision 13.

**Walk log enrichment required for weather/time badges:** Extending `logWalk(id)` to save `{ id, ts, weather_code, is_day }` from the live session enables "Walked in the rain," "Walked in the dark," and "Walked in the sunshine" badges. The data is in the app at the moment of logging — it just needs to be stored. See Decision 14.

**Badge discovery moment:** When a badge is earned, a toast notification appears: "New badge — Hidden Gem Hunter" with the badge icon. This is the earned-moments discovery mechanism. It should feel like a pleasant surprise, not a celebration prompt. Keep it brief and understated — one line of copy, dismisses automatically after 3 seconds.

**Phase 2 decisions required:** See Decision 13 (environment field), Decision 14 (walk log enrichment), Decision 15 (badge reveal UX).

---

## Part 2 — Recommended Phase 2 Build Order

Build order is governed by dependencies and impact per effort:

| Order | Feature | Why this position | Dependency |
|---|---|---|---|
| 1 | Dog Profile | Foundational for all personal framing; small build; unlocks Feature 2 naming, Feature 4 protagonist | None |
| 2 | Walk Notes | High emotional value; lowest technical risk; extends existing walk log schema | `sniffout_walk_log` already in build |
| 3 | Walk Wishlist | Independent of all other features; adds new engagement driver; drives return visits | None |
| 4 | Achievements / Badges | Requires badge spec finalisation (designer brief in flight); some badges benefit from walk log enrichment (Feature 2's schema extension) | Designer spec (badge-system-rethink.md); optionally Feature 2 for context badges |
| 5 | Wrapped Summary | Most impactful but requires data to exist first; best built once users have accumulated walk history | Dog profile (Feature 1); walk notes help but aren't required; environment/county data if included |

**Dog Profile is the unlock:** Once the dog's name is in the app, the framing of every other feature changes. Walk notes say "Add a note from today's walk with Biscuit." The Wrapped summary says "Biscuit's 2026." Stats say "Walks with Biscuit." This personal framing is free once the profile exists — it costs nothing to apply it throughout the app. Build it first.

---

## Part 3 — Me Tab Stats Update

### What the Owner Has Confirmed

**Rejected:** streaks, off-lead walks explored, walks still to discover, miles walked (no GPS).

**Liked:** walks explored, contributions made, places found.

### Assessment Against Research Findings

The me-tab-dashboard-research.md establishes that the correct stat format is **icon + number**, 2-column grid, max 4-6 stats, with a warm empty state rather than zero counters.

The owner's preferred stats align well with the research findings. The only departure from the Researcher's original recommendations (Priority 4: off-lead walks, Priority 5: walks still to discover) is intentional — the owner's rejections are correct calls. Off-lead is a filter preference, not a meaningful accumulation stat. "Walks still to discover" frames the stat as a deficit ("you haven't done X walks") which the research explicitly flags as demotivating for casual users.

### Recommended Stats Set (Updated for New Features)

Taking the owner's preferences plus the five new features into account, the recommended Me tab stat set is:

**Stat 1 — Walks explored** (hero stat, largest display)
- Source: `sniffout_explored` unique walk count
- Framing: "X walks explored" (with dog name if profile set: "walks with Biscuit")
- Icon: compass or map with a dotted path

**Stat 2 — Walks saved**
- Source: `sniffout_favs.length`
- Framing: "X walks saved" (or "saved walks")
- Icon: bookmark or heart outline
- Note: this is distinct from the wishlist. "Saved" = loved and want to return. "Wishlist" = want to do.

**Stat 3 — Places found** (from FIX 16.2)
- Source: `sniffout_place_favs.length` (introduced in Round 15)
- Framing: "X places found"
- Icon: pin or storefront outline
- Note: this stat only becomes meaningful once Place Favouriting (Round 15 FIX 16.2) is in the build. Until then, hide this stat tile or substitute with another.

**Stat 4 — Contributions made**
- Source: `Object.keys(walkReviews).length` + count of condition tag submissions in `sniffout_condition_tags`
- Framing: "X contributions"
- Icon: speech bubble or pencil
- Note: "contributions" is the right framing — it covers both reviews and conditions reported. A user who has left 2 reviews and reported conditions 3 times has made 5 contributions.

**Stat 5 — Walks on your list** (new — requires Feature 3)
- Source: `sniffout_wishlist.length`
- Framing: "X on your list"
- Icon: list or checklist outline
- Note: this is the only forward-looking stat — it represents intent rather than achievement. It should be displayed slightly differently (lighter weight or `--ink-2` colour rather than `--brand`) to signal it's a prompt, not an accomplishment. Hide this stat if the wishlist feature is not yet in the build.

**Stat 6 — Badges earned** (new — requires Feature 5 / badge spec)
- Source: `getEarnedBadges().length`
- Framing: "X badges earned" — with a link to the badge display section below
- Icon: shield or star outline
- Note: this stat only makes sense once the badge system is implemented. A tappable stat that scrolls the user to the badge display section provides natural navigation.

### Stat Display Priority

Show stats in this order. Hide stats for features not yet in the build rather than showing zero.

| Priority | Stat | Show when |
|---|---|---|
| 1 | Walks explored | Always (once `sniffout_explored` has ≥ 1 entry) |
| 2 | Walks saved | Always (once `sniffout_favs` has ≥ 1 entry) |
| 3 | Contributions | Once `walkReviews` or `sniffout_condition_tags` has ≥ 1 entry |
| 4 | Places found | Once `sniffout_place_favs` feature is in build AND ≥ 1 place saved |
| 5 | Walks on your list | Once wishlist feature is in build AND ≥ 1 walk wishlisted |
| 6 | Badges earned | Once badge system is in build AND ≥ 1 badge earned |

**Empty state (all stats at zero / no stats ready to show):** Display a single card per the research recommendation:
- Headline: **"Your walks start here"**
- Body: **"Explore a walk to start building your collection."**
- CTA: **"Find a walk"** — routes to Walks tab

Do not show a grid of zero counters under any circumstances. The research is unequivocal on this point (Strava anti-pattern).

**Zero handling within the grid (some stats earned, some at zero):** Once the grid is showing (at least one walk explored), use "—" for stats that are genuinely zero rather than "0". Example: "— contributions" reads as "not yet" rather than "you've done nothing."

### Stats Framing Note

The framing throughout the Me tab should use "your" and, once the dog profile is set, the dog's name. "Walks with Biscuit" not "your walks." "12 places Biscuit has found" not "12 places found." This is a copy decision, not an engineering decision — it requires the dog's name from the profile and string interpolation. The research establishes that companionship framing ("we" and the dog's name) is significantly more emotionally resonant for dog owners than generic first-person framing.

---

## Part 4 — Badge System Review

### Does the Researcher's "Earned Moments" Principle Change the Current Spec?

**The underlying badge set is correct. The display and discovery mechanism needs to change.**

The community-gamification-roadmap.md badge triggers (Explorer, Trailblazer, Regional Rambler, Weatherproof, Seasonal Walker, Favourites Collector) are already milestone-based, not streak-based. They are correct for Sniffout's use case. The Researcher's new examples ("First coastal walk," "Walked in the rain") are additive, not replacements.

**What changes under the "earned moments" principle:**

1. **No progress indicators on locked badges.** The badge spec should not show "7/10 walks to Trailblazer." The badge is either earned (shown fully) or not (shown as a locked silhouette with its name and a one-line description of what it celebrates — not what you need to do to earn it). This is the key UX distinction. "Three counties explored" not "You need to explore walks in 2 more counties."

2. **Discovery over pursuit.** When a user opens the Me tab and a new badge has been earned since their last visit, it should be visually prominent — a gentle highlight state, a "new" label, or a brief reveal animation. The badge appeared without being chased, and the discovery moment is the payoff.

3. **Badge reveal toast.** A brief, dismissable toast notification when a badge is earned mid-session (e.g., the user logs their 10th walk and instantly earns Trailblazer). One line: "You've earned a new badge." Not "Congratulations, incredible, wow." Understated.

**Updated badge set (current + new Researcher additions):**

*Computable from current schema — ready for Phase 2:*

| Badge | Trigger | Framing (earned moment language) |
|---|---|---|
| Explorer | 5 unique walks explored | "Five new places, each one an adventure" |
| Trailblazer | 10 unique walks explored | "Ten walks in. The real exploration begins." |
| Regional Rambler | 3+ distinct regions in walk log | "You've ranged across three parts of the country" |
| Favourites Collector | 5+ walks saved | "A collection worth returning to" |
| Hidden Gem Hunter | 3+ walks with badge: "Hidden gem" explored | "You seek out the roads less walked" |
| First Off-Lead | First walk with offLead: "full" logged | "The first time [dog name] ran free" |
| Return Walker | Same walk logged 3+ times | "Some places deserve more than one visit" |

*Requires walk log enrichment (weather_code + is_day stored at log time — Decision 14):*

| Badge | Trigger | Framing |
|---|---|---|
| All Weathered | Walk logged with weather_code ≥ 51 (rain/drizzle) | "You walked through it anyway" |
| Early Riser | Walk logged before 8am | "Best time of day on a trail" |
| Golden Hour | Walk logged within 30 min of sunset | "Worth every step to see that light" |

*Requires schema extension (environment field in WALKS_DB — Decision 13):*

| Badge | Trigger | Framing |
|---|---|---|
| Coastal Walker | First walk with environment: "coastal" logged | "The sea air agrees with [dog name]" |
| Woodland Wanderer | First walk with environment: "woodland" logged | "Under the canopy" |
| Moorland Strider | First walk with environment: "moorland" logged | "Open skies, all the way" |

*Requires dog profile (Feature 1):*

| Badge | Trigger | Framing |
|---|---|---|
| First Adventure | First walk logged after dog profile is set | "[Dog name]'s first recorded adventure" |

**Priority for Phase 2 implementation:** Implement the first group (computable from current schema) first. They require no data changes. The second and third groups require schema decisions (Decisions 13 and 14) that should be made before the badge system engineering begins — not after.

**On the designer brief (badge-system-rethink.md):** The badge visual design is in flight. The PO direction from this document is: earned moments framing, no progress indicators on locked badges, understated reveal mechanic. Pass this framing explicitly to the Designer before the badge spec is finalised.

---

## Part 5 — Phase 3 and Phase 4 Summaries

### Phase 3 — Firebase Required

| Feature | Phase 2 → Phase 3 evolution | What Firebase enables |
|---|---|---|
| Dog profile | localStorage → Firebase user document | Cross-device sync; multiple dogs; profile photo; breed-specific filtering |
| Walk notes | Walk log entry `note` field → Firebase walk log | Cross-device sync; optional note-to-review conversion; full visit history |
| Walk wishlist | `sniffout_wishlist` array → Firebase user document | Cross-device sync; shareable wishlist URL |
| Achievements / badges | Computed in JS, stored in localStorage → Firebase user profile | Cross-device persistence; server-side badge verification; push notification on badge earn |
| Wrapped summary | Static summary card, not shareable → Firebase aggregation | Year-end data aggregation; server-side image generation; shareable card |
| Me tab stats | localStorage only → Firebase user stats | All stats persist and sync; Phase 3 can add review contribution tracking that has real community value (reviews visible to others) |

### Phase 4 — Growth and Social

| Feature | Phase 4 form | Growth mechanism |
|---|---|---|
| Dog profile | Public dog profile with shared walk log | "Follow Biscuit's adventures" — dog-to-dog social graph |
| Walk notes | Optional public highlights on walk detail pages | Authentic, personalised walk recommendations |
| Wrapped summary | Shareable image (dog as protagonist) | Organic social sharing; TikTok/Instagram; every share is acquisition |
| Walk wishlist | Public shareable wishlist URL | "My dog's bucket list" — shareable format with Sniffout CTA |
| Badges | Shareable badge cards ("Biscuit just earned Coastal Walker") | Milestone moments for social sharing |

**The Wrapped summary is the highest-priority Phase 4 social mechanism.** The Researcher identifies that dog content on TikTok dramatically outperforms generic content. A dog's year-in-walks summary, shared as an Instagram Story by the owner, is the exact content format that performs. It features the dog as the protagonist, it's personal and specific ("3 coastlines, mostly muddy"), and it includes Sniffout branding. Building the shareable Wrapped image is a Phase 4 priority.

---

## Part 6 — Consolidated Decisions Required

Before each feature can be briefed to the Developer, the owner must confirm these decisions. Grouped by feature.

---

### Dog Profile (Feature 1)

**Decision 1 — Breed field format**
- Option A: Free text field. Simple to build. Cannot enable breed-specific filtering.
- Option B: Searchable dropdown of ~50 most common UK dog breeds. Enables Phase 3 filtering. More editorial work to build the list.
- **Recommendation:** Free text for Phase 2 (build speed); migrate to structured dropdown at Phase 3 when filtering is implemented. Owner to confirm.

**Decision 2 — Size categories**
- Proposed: Small (under 10kg) / Medium / Large
- Does size affect anything in Phase 2, or is it stored only for Phase 3 use?
- **Recommendation:** Store the field in Phase 2; use it in Phase 2 for walk detail contextual notes only (e.g., "Note: this walk has stiles that may be difficult for smaller dogs"). Full filtering at Phase 3. Owner to confirm size categories.

**Decision 3 — Age format**
- Proposed: Puppy (under 12 months) / Adult / Senior (7+)
- Or: exact year of birth (more precise; allows automatic age updates)
- **Recommendation:** Year of birth stored, displayed as puppy/adult/senior. This ages automatically without the user needing to update it. Owner to confirm.

**Decision 4 — Single dog or multiple dogs in Phase 2**
- **Recommendation:** One dog only in Phase 2. Phase 3 introduces multiple dogs on the same account. Confirm single-dog constraint for Phase 2 implementation.

**Decision 5 (applies to Feature 2) — Where is the dog profile set up?**
- Option A: In the Me tab settings sheet (gear icon) — discoverable for engaged users, not obtrusive for new users
- Option B: As an optional prompt on first visit to the Me tab ("What's your dog's name?")
- **Recommendation:** Both: a gentle one-time prompt on first Me tab visit (dismissable), plus permanent access in the settings sheet. Owner to confirm.

---

### Walk Notes (Feature 2)

**Decision 6 — Note prompt timing**
- Option A: Sequential prompt immediately after conditions sheet is dismissed (modal flow)
- Option B: Persistent inline text area below the "Walked today" button (available throughout the overlay session)
- **Recommendation:** Option B. Less disruptive; the user can add the note when they're ready rather than being interrupted mid-flow. Owner to confirm.

**Decision 7 — Note character limit**
- **Recommendation:** No hard limit. This is a private journal; length limits would be arbitrary and frustrating. Owner to confirm (or set a soft limit, e.g., 500 characters suggested).

---

### Walk Wishlist (Feature 3)

**Decision 8 — Wishlist card UX**
- Option A: Wishlist button visible on all walk cards (alongside heart button) — always accessible, potentially cluttered
- Option B: Wishlist button only in the walk detail overlay — cleaner cards, less discoverable
- **Recommendation:** Wishlist in overlay only for Phase 2. Surface it on cards in Phase 3 once the UX is validated. Owner to confirm.

**Decision 9 — Wishlist copy and icon**
- Proposed: bookmark icon, "Add to list" / "On your list"
- Alternatives: "Save for later" / "Want to do" / "On the wishlist"
- **Recommendation:** "Add to list" / "On your list." Clean, direct, no future-tense implication. Icon: bookmark (already in Lucide icon set). Owner to confirm copy.

**Decision 10 — What happens when a wishlisted walk is explored?**
- Option A: Walk remains on wishlist until manually removed
- Option B: Gentle prompt appears ("You've explored this — did you love it?") offering to move it to saved walks
- **Recommendation:** Option B. Creates a natural progression from intent to experience. Owner to confirm.

---

### Wrapped Summary (Feature 4)

**Decision 11 — Environment field in WALKS_DB**
The Wrapped summary (and coastal/woodland/moorland badges) requires an `environment` field per walk. Adding this field requires PO sign-off on the schema extension and editorial work to tag all 50+ walks.

Proposed values: `"coastal"` | `"woodland"` | `"moorland"` | `"urban"` | `"hillside"` | `"riverside"` | `"mixed"`

This is not a small task — every walk needs to be tagged. But it is high-value: it enables the most emotionally resonant badges and the "two coastlines" headline in Wrapped.

**Owner decision:** Approve `environment` field addition to WALKS_DB schema, and commit to tagging all existing walks before implementation.

**Decision 12 — County data in WALKS_DB**
"Three counties" in the Wrapped summary requires a `county` field per walk. Alternatively, county can be extracted from the existing `location` string — but this is brittle (location strings are not standardised). A dedicated `county` field is cleaner.

**Owner decision:** Approve `county` field in WALKS_DB schema, or accept region-level grouping instead (which uses the existing `location` field without schema changes).

**Decision 13 — Wrapped trigger**
- Option A: "View your year" button always visible in Me tab (manual, user-initiated)
- Option B: Automatic notification/prompt in December
- **Recommendation:** Option A for Phase 2. No notification infrastructure needed. Owner to confirm.

---

### Achievements / Badges (Feature 5)

**Decision 14 — Walk log enrichment**
To enable weather-based and time-based badges ("Walked in the rain," "Early riser," "Golden hour"), the walk log entry needs to store context at the time of logging.

Proposed: extend `logWalk(id)` to save `{ id, ts, weather_code, is_day, wind_speed }` from the live `sniffout_session` weather data.

This is a small schema change with a one-time migration path (existing entries get null values for the new fields). High badge value for low technical cost.

**Owner decision:** Approve walk log enrichment. Confirm whether wind_speed is needed for a future "Brisk walk" badge or similar.

**Decision 15 — Badge reveal UX**
- Option A: Badge appears in the Me tab with a "New" indicator, discovered on next visit
- Option B: Toast notification fires immediately when the badge is earned mid-session
- Option C: Both — immediate toast if the app is open; "New" indicator if discovered on next visit
- **Recommendation:** Option C. Owner to confirm.

**Decision 16 — Badge spec sign-off**
The badge-system-rethink.md Designer brief is in flight. Pass the following PO direction to the Designer before the spec is finalised:
- No progress indicators on locked badges (silhouette or blurred state only — name and one-line description, no counts)
- Earned moment framing for all badge copy (what the badge celebrates, not what you did to earn it)
- Understated reveal — brief toast, not a fireworks celebration
- Owner to review and approve badge-system-rethink.md before Developer brief is issued

---

## Decision Summary Table

| # | Feature | Decision | Recommendation | Blocks |
|---|---|---|---|---|
| 1 | Dog profile | Breed field: free text or dropdown? | Free text Phase 2, dropdown Phase 3 | Feature 1 dev brief |
| 2 | Dog profile | Size categories | Small/Medium/Large | Feature 1 dev brief |
| 3 | Dog profile | Age format | Year of birth → auto-calculated | Feature 1 dev brief |
| 4 | Dog profile | Single or multiple dogs in Phase 2? | Single dog only | Feature 1 dev brief |
| 5 | Dog profile | Where is profile set up? | First-visit prompt + settings sheet | Feature 1 dev brief |
| 6 | Walk notes | Note prompt timing | Inline persistent (not sequential modal) | Feature 2 dev brief |
| 7 | Walk notes | Character limit? | No hard limit | Feature 2 dev brief |
| 8 | Walk wishlist | Wishlist button location | Overlay only in Phase 2 | Feature 3 dev brief |
| 9 | Walk wishlist | Copy and icon | "Add to list" / bookmark icon | Feature 3 dev brief |
| 10 | Walk wishlist | On completion of wishlisted walk | Gentle prompt to move to saved | Feature 3 dev brief |
| 11 | Wrapped / Badges | Approve `environment` field in WALKS_DB | Approve + editorial tagging commitment | Feature 4, Feature 5 coastal/woodland badges |
| 12 | Wrapped | Approve `county` field in WALKS_DB | Approve, or accept region-level fallback | Feature 4 county headline |
| 13 | Wrapped | Summary trigger | "View your year" button (manual) | Feature 4 dev brief |
| 14 | Badges | Walk log enrichment (weather_code + is_day at log time) | Approve | Weather-based badges |
| 15 | Badges | Badge reveal UX | Toast + "New" indicator | Feature 5 dev brief |
| 16 | Badges | Designer brief review | PO to pass framing to Designer | badge-system-rethink.md |
