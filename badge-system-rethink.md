# Badge System Rethink
**Status:** Complete redesign — replaces all previous badge definitions
**Owner direction:** Fewer badges, harder to earn, more meaningful; strong emphasis on contribution; no weather/season badges; no single-tap earnable

---

## What Was Wrong Before

The previous badge system had two structural problems:

**Problem 1 — Gameable triggers.** Any badge tied to "Mark as walked" can be earned by tapping repeatedly without leaving the sofa. A user who taps "Mark as walked" on twenty walks in five minutes earns the same badges as someone who actually walked them. This undermines the reward.

**Problem 2 — Wrong behaviours rewarded.** Badges for "walked in all four seasons" or "walked 10 miles" reward passive consumption. They give the user a reason to log more — but not a reason to make Sniffout better. Contribution badges reward the behaviours that make the app genuinely more valuable to every user: condition reports, reviews, walk ratings, new walk suggestions.

---

## Design Principles for the New System

1. **Contribution over consumption.** At least half the badges should reward actions that benefit other users, not just the individual.

2. **Hard to game, easy to understand.** Every badge trigger is either impossible to game (requires real content) or requires sustained effort spread over time (returning to the app on multiple separate days).

3. **Warm and specific, not generic gamification.** Badge names should feel like something a UK dog walker would actually say or recognise, not a generic achievement label ("Level 2 Explorer", "Super User"). If a badge name could belong to any app, rename it.

4. **Hidden until earned.** No locked badges visible. The badge row simply does not exist until at least one badge is earned. No "You're 2 away from your next badge" prompts.

5. **10 badges total.** Enough to be meaningful, few enough that earning even one matters.

---

## Badge Categories

| Category | What it rewards |
|---|---|
| **Explorer** | Sustained walking engagement over time |
| **Contributor** | Condition reports — available Phase 1 |
| **Community** | Reviews, ratings, walk suggestions — Phase 3 |

---

## The 10 Badges

---

### 1. Leads On
**Category:** Explorer
**Phase:** 1 (current)

**What the user sees when earned:**
"You went on your first three walks on different days."

**Trigger:** Walk log contains entries on 3 distinct calendar dates (ISO date comparison on `logged_at` timestamp).

**Anti-gaming:** Requires returning to the app on three separate days. Cannot be earned in a single session regardless of how many walks are tapped.

**Why this name:** "Leads on" — as in, the lead is on, let's go. The start of something. Warm, dog-specific, action-oriented.

**Design note:** This is the entry badge. Most users will earn it within the first few weeks. It is not a milestone — it is a welcome. Keep it appropriately small.

---

### 2. Good Mileage
**Category:** Explorer
**Phase:** 1 (current)

**What the user sees when earned:**
"You've logged 25 miles with Sniffout."

**Trigger:** Cumulative `distance` sum across all entries in `sniffout_walk_log` ≥ 25 miles.

**Anti-gaming:** Requires logging 7–10 typical walks (most WALKS_DB entries are 2.5–7 miles). Possible to game by tapping the longest walks repeatedly, but the effort required is substantial — it is not a casual tap. No fix needed for Phase 1; GPS verification can harden it in Phase 3.

**Why this name:** Unpretentious, honest. "Good mileage" is something a dog owner actually says. Not "Distance Pioneer" or "Trail Conqueror."

---

### 3. Creature of Habit
**Category:** Explorer
**Phase:** 1 (current)

**What the user sees when earned:**
"You've logged at least one walk every week for four weeks running."

**Trigger:** Walk log contains at least one entry in each of 4 consecutive ISO weeks (Monday–Sunday). The streak resets if a week is missed but re-counts from the most recent unbroken run.

**Anti-gaming:** Cannot be earned in a single session. Requires genuine 4-week engagement. The hardest Explorer badge to earn — designed to reward the small number of users who become habitual.

**Why this name:** Affectionate and dog-appropriate. Dogs are creatures of habit; so are their owners. The name earns itself.

---

### 4. Good Report
**Category:** Contributor
**Phase:** 1 (current)

**What the user sees when earned:**
"You filed your first trail condition report. Other walkers will thank you."

**Trigger:** First condition report submitted. A valid report requires: at least one condition tag selected (e.g., "muddy", "good underfoot") and submission confirmed. A pure no-input tap is not a valid report.

**Anti-gaming:** Requires composing a real report. The minimum bar (at least one tag) is low — intentionally. The point is to get users into the habit of contributing, not to make the first contribution difficult.

**Why this name:** Simple and unpretentious. "Good report" is what a teacher says to a child who's done something well. Warm without being patronising.

---

### 5. Reliable Scout
**Category:** Contributor
**Phase:** 1 (current)

**What the user sees when earned:**
"You've filed 5 condition reports. You're one of the people who keeps Sniffout accurate."

**Trigger:** 5 condition reports submitted, each with at least one condition tag, across at least 3 distinct walk IDs.

**Anti-gaming:** The 3 distinct walk ID requirement prevents filing 5 reports on the same walk. The user must visit at least 3 different walk pages and submit a real report on each.

**Why this name:** Dogs are scouts. A reliable scout is what a well-trained dog is. Warm and specific.

---

### 6. Trail Keeper
**Category:** Contributor
**Phase:** 1 (current)

**What the user sees when earned:**
"You've filed 10 condition reports across 5 different walks. The trails you walk are better documented because of you."

**Trigger:** 10 condition reports submitted, each with at least one condition tag, across at least 5 distinct walk IDs.

**Anti-gaming:** 5 distinct walk IDs is a meaningful bar — the user has to engage with 5 different walks and report on each (with multiple reports across some). Very difficult to game without genuine engagement.

**Why this name:** A trail keeper is a real role — the person who maintains footpaths, clears fallen branches, reports damage to the local authority. The name gives the user a meaningful identity, not a points level.

---

### 7. Honest Bark
**Category:** Contributor
**Phase:** 3 (requires review system)

**What the user sees when earned:**
"You wrote your first walk review. Reviews like yours help other dog owners decide where to go."

**Trigger:** First walk review submitted with a minimum length of 75 characters. The character floor prevents one-word submissions ("Great!") while not requiring an essay.

**Anti-gaming:** Requires composing genuine prose. Cannot be submitted by a single tap. The 75-character minimum is roughly two short sentences — a real observation about a walk.

**Why this name:** An honest bark is a real bark — not excessive, not performative, just accurate. Good name for a review badge.

---

### 8. Discerning Nose
**Category:** Community
**Phase:** 3 (requires rating system)

**What the user sees when earned:**
"You've rated 10 different walks. Your ratings help other walkers find the best routes."

**Trigger:** 10 unique walk ratings submitted (1–5 stars, one per walk ID, cannot rate the same walk twice toward this count).

**Anti-gaming:** Requires visiting 10 different walk pages and submitting a rating on each. The uniqueness constraint prevents gaming by re-rating the same walk.

**Why this name:** Dogs are famous for their discerning noses. The phrase earns its dog-appropriateness without being forced. "Discerning" implies quality of judgement — a natural fit for a rating badge.

---

### 9. Found a Good One
**Category:** Community
**Phase:** 3 (requires walk submission and curation workflow)

**What the user sees when earned:**
"You suggested a walk that made it onto Sniffout. You've helped make the app better for every dog owner who uses it."

**Trigger:** A walk submission from this user is approved by a Sniffout curator and published to WALKS_DB. Not triggered by submitting — only by approval.

**Anti-gaming:** Requires genuine, quality content (a walk that passes curation review). The curator acts as the gate. Cannot be gamed.

**Why this name:** Warm, unpretentious, and honest. "Found a good one" is exactly what a dog owner says when they've discovered a new trail. No heroic language.

**Note for implementation:** This badge requires a user identity system (Phase 3) and a curation workflow. The badge is attributed to the `source_user_id` on the approved walk entry.

---

### 10. Voice of the Pack
**Category:** Community
**Phase:** 3 (requires review system)

**What the user sees when earned:**
"You've written 5 walk reviews with genuine detail. Other walkers rely on people like you."

**Trigger:** 5 walk reviews submitted, each with a minimum of 75 characters, cumulative total ≥ 600 characters across all 5. The cumulative floor ensures all five reviews have some substance — prevents gaming by submitting 5 reviews of exactly 75 characters.

**Anti-gaming:** Requires genuine prose across 5 different walks. The cumulative character count (600 total across 5 reviews) ensures quality without being prescriptive. Very hard to game.

**Why this name:** "Voice of the pack" is the most social of the badge names — it acknowledges that the user has become a contributor to a community, not just a consumer of one.

---

## Full Badge Reference

| # | Name | Category | Phase | Key trigger | Gameable? |
|---|---|---|---|---|---|
| 1 | Leads On | Explorer | 1 | 3 walks on 3 distinct days | No (time-gated) |
| 2 | Good Mileage | Explorer | 1 | 25 cumulative miles | Partially (effort required) |
| 3 | Creature of Habit | Explorer | 1 | Walk every week for 4 weeks | No (time-gated) |
| 4 | Good Report | Contributor | 1 | First condition report | No (content required) |
| 5 | Reliable Scout | Contributor | 1 | 5 reports, 3+ distinct walks | No (content + spread required) |
| 6 | Trail Keeper | Contributor | 1 | 10 reports, 5+ distinct walks | No (content + spread required) |
| 7 | Honest Bark | Contributor | 3 | First review ≥75 chars | No (content required) |
| 8 | Discerning Nose | Community | 3 | 10 unique walk ratings | No (uniqueness constraint) |
| 9 | Found a Good One | Community | 3 | Walk suggestion approved by curator | No (human gate) |
| 10 | Voice of the Pack | Community | 3 | 5 reviews, total ≥600 chars | No (content + volume required) |

**Contribution badges (4–10): 7 of 10.** Exceeds the minimum of 4.

**Non-gameable or very hard to game: 9 of 10.** Only "Good Mileage" has partial gaming exposure, mitigated by the required effort (25 miles of tapping).

---

## How Badges Are Earned — Detection Logic

Badge state is evaluated in two places:

1. **On Me tab open:** `checkBadgeEarned()` runs across all current localStorage data and updates `sniffout_badges` if any new badges have triggered.

2. **After any qualifying action:** Condition report submission, walk log update, review submission (Phase 3) — each action triggers `checkBadgeEarned()` for the relevant badge categories only.

```js
// sniffout_badges structure
{
  "leads-on": { earned: true, earnedAt: "2026-02-14T09:22:00Z" },
  "good-report": { earned: true, earnedAt: "2026-02-16T14:11:00Z" }
  // unearned badges: not present in the object
}
```

Unearned badges are absent from storage — they are never written with `earned: false`. This keeps the data model clean and ensures the badge row only shows genuinely earned badges.

---

## How a Badge Is Revealed — Earn Moment

When `checkBadgeEarned()` detects a newly triggered badge (a badge that was not in `sniffout_badges` before this check):

1. **Badge is written to storage** with `earnedAt` timestamp.
2. **Toast notification** appears at the bottom of the screen (above the bottom nav):
   ```
   ┌─────────────────────────────────────┐
   │  ✓  Leads On earned                 │
   └─────────────────────────────────────┘
   ```
   Toast duration: 3 seconds, then fade out. No tap required to dismiss.
3. **If the Me tab is currently active:** the badge chip slides into the badge row with a brief scale-up animation (`transform: scale(0.8) → scale(1)`, 200ms ease-out).
4. **If the Me tab is not active:** when the user next opens the Me tab, the new badge chip renders with the same scale-up animation on first paint.

**No confetti, no full-screen celebration, no sound.** The toast + chip animation is the full reveal. Understated is correct here — this is a personal tab, not a game.

---

## How Locked Badges Are Handled

**They are not shown.** The badge row does not exist until at least one badge is earned. There are no greyed-out locked badge outlines, no "N badges remaining" counter, no progress indicators toward next badge.

This is a deliberate owner decision. Showing locked badges creates a gamification pressure that contradicts the "personal and warm" feel. Users who want to know what badges exist can find out by earning one — the earn-moment toast gives them context.

---

## Badge Descriptions in the UI

Badge descriptions are shown in one place: the inline detail row that appears below the badge scroll when a chip is tapped (defined in `me-tab-rethink-v2-spec.md`).

The description text shown is the "what the user sees when earned" copy from this document — it is personal ("You filed…") and explains the action, not the rule.

Badge descriptions are **not** shown in:
- The badge chip itself (name only)
- Any tooltip on hover
- Any pre-earn state (there is no pre-earn state visible to the user)

---

## Badges Removed From Previous System

| Removed badge | Reason |
|---|---|
| All season badges | Weather/season-based; trivially gameable; not meaningful |
| "Paw Patrol" (10 miles) | Pure walk-log gaming; single session earnable |
| "Explorer" (5 walks) | Single session earnable; no time-gating |
| "Trailblazer" (first walk) | Single tap earnable |
| "Local Legend" | Vague; no clear trigger defined |
| All weather-condition badges | Owner direction: no weather badges |

---

## Phase 3 Implementation Notes

Badges 7–10 require features not yet built:

- **Badges 7 and 10 (review badges):** Require the walk review system — text input, submission, storage in `walkReviews` with timestamp and character count.
- **Badge 8 (rating badge):** Requires unique-per-walk rating system — currently ratings exist but need uniqueness enforcement and a per-user log.
- **Badge 9 (Found a Good One):** Requires walk submission form, a curator review interface, and a `source_user_id` field on approved walks. This is the most complex badge to implement and the most valuable — it directly builds the WALKS_DB.

For Phase 3 planning: badge 9 is the one most worth prioritising. A user who submits a walk that gets approved becomes an invested contributor with a visible record in the app. This is the behaviour Sniffout most needs to grow its content base.
