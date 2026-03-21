# Badge System Rethink
**Status:** Complete redesign — replaces all previous badge definitions
**Owner direction:** Fewer badges, harder to earn, more meaningful; strong emphasis on contribution; no weather/season badges; no single-tap earnable; earned moments not chased metrics; badges hidden until earned

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

4. **Hidden until earned.** Badges do not exist in the UI until they are earned. The badge row in the Me tab does not render until at least one badge has been earned. There are no locked placeholders, no silhouette states, no progress indicators, no "X more to go" prompts. The discovery moment — finding a new badge waiting in your Me tab, or receiving a toast while using the app — is the entire mechanic.

5. **Earned moments, not chased metrics.** All badge copy is written as earned-moment framing: what the badge celebrates, not what the user did. Not "You submitted 5 condition reports" but "You've become someone other walkers quietly rely on." The count is not the point. The identity is.

6. **10 badges total.** Enough to be meaningful, few enough that earning even one matters.

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

**Earned moment copy** (shown in toast and badge detail):
*"You kept coming back. The lead was always on."*

**Trigger:** Walk log contains entries on 3 distinct calendar dates (ISO date comparison on `logged_at` timestamp).

**Anti-gaming:** Requires returning to the app on three separate days. Cannot be earned in a single session regardless of how many walks are tapped.

**Why this name:** "Leads on" — as in, the lead is on, let's go. The start of something. Warm, dog-specific, action-oriented.

**Design note:** This is the entry badge. Most users will earn it within the first few weeks. It is not a milestone — it is a welcome. Keep it appropriately small.

---

### 2. Good Mileage
**Category:** Explorer
**Phase:** 1 (current)

**Earned moment copy:**
*"Twenty-five miles. Real ground covered, real paths walked."*

**Trigger:** Cumulative `distance` sum across all entries in `sniffout_walk_log` ≥ 25 miles.

**Anti-gaming:** Requires logging 7–10 typical walks (most WALKS_DB entries are 2.5–7 miles). Possible to game by tapping the longest walks repeatedly, but the effort required is substantial — it is not a casual tap. No fix needed for Phase 1; GPS verification can harden it in Phase 3.

**Why this name:** Unpretentious, honest. "Good mileage" is something a dog owner actually says. Not "Distance Pioneer" or "Trail Conqueror."

---

### 3. Creature of Habit
**Category:** Explorer
**Phase:** 1 (current)

**Earned moment copy:**
*"Dogs love a routine. Turns out their owners do too."*

**Trigger:** Walk log contains at least one entry in each of 4 consecutive ISO weeks (Monday–Sunday). The streak resets if a week is missed but re-counts from the most recent unbroken run.

**Anti-gaming:** Cannot be earned in a single session. Requires genuine 4-week engagement. The hardest Explorer badge to earn — designed to reward the small number of users who become habitual.

**Why this name:** Affectionate and dog-appropriate. Dogs are creatures of habit; so are their owners. The name earns itself.

---

### 4. Good Report
**Category:** Contributor
**Phase:** 1 (current)

**Earned moment copy:**
*"Someone is choosing the right path today because of you."*

**Trigger:** First condition report submitted. A valid report requires: at least one condition tag selected (e.g., "muddy", "good underfoot") and submission confirmed. A pure no-input tap is not a valid report.

**Anti-gaming:** Requires composing a real report. The minimum bar (at least one tag) is low — intentionally. The point is to get users into the habit of contributing, not to make the first contribution difficult.

**Why this name:** Simple and unpretentious. "Good report" is what a teacher says to a child who's done something well. Warm without being patronising.

---

### 5. Reliable Scout
**Category:** Contributor
**Phase:** 1 (current)

**Earned moment copy:**
*"You've become someone other walkers quietly rely on."*

**Trigger:** 5 condition reports submitted, each with at least one condition tag, across at least 3 distinct walk IDs.

**Anti-gaming:** The 3 distinct walk ID requirement prevents filing 5 reports on the same walk. The user must visit at least 3 different walk pages and submit a real report on each.

**Why this name:** Dogs are scouts. A reliable scout is what a well-trained dog is. Warm and specific.

---

### 6. Trail Keeper
**Category:** Contributor
**Phase:** 1 (current)

**Earned moment copy:**
*"The trails you walk are better documented because you were there."*

**Trigger:** 10 condition reports submitted, each with at least one condition tag, across at least 5 distinct walk IDs.

**Anti-gaming:** 5 distinct walk IDs is a meaningful bar — the user has to engage with 5 different walks and report on each (with multiple reports across some). Very difficult to game without genuine engagement.

**Why this name:** A trail keeper is a real role — the person who maintains footpaths, clears fallen branches, reports damage to the local authority. The name gives the user a meaningful identity, not a points level.

---

### 7. Honest Bark
**Category:** Contributor
**Phase:** 3 (requires review system)

**Earned moment copy:**
*"Your words are out there. Someone will choose their next walk because of them."*

**Trigger:** First walk review submitted with a minimum length of 75 characters. The character floor prevents one-word submissions ("Great!") while not requiring an essay.

**Anti-gaming:** Requires composing genuine prose. Cannot be submitted by a single tap. The 75-character minimum is roughly two short sentences — a real observation about a walk.

**Why this name:** An honest bark is a real bark — not excessive, not performative, just accurate. Good name for a review badge.

---

### 8. Discerning Nose
**Category:** Community
**Phase:** 3 (requires rating system)

**Earned moment copy:**
*"You've shaped what other walkers will discover next."*

**Trigger:** 10 unique walk ratings submitted (1–5 stars, one per walk ID, cannot rate the same walk twice toward this count).

**Anti-gaming:** Requires visiting 10 different walk pages and submitting a rating on each. The uniqueness constraint prevents gaming by re-rating the same walk.

**Why this name:** Dogs are famous for their discerning noses. The phrase earns its dog-appropriateness without being forced. "Discerning" implies quality of judgement — a natural fit for a rating badge.

---

### 9. Found a Good One
**Category:** Community
**Phase:** 3 (requires walk submission and curation workflow)

**Earned moment copy:**
*"You found something worth sharing — and it made it in. Every dog who walks it has you to thank."*

**Trigger:** A walk submission from this user is approved by a Sniffout curator and published to WALKS_DB. Not triggered by submitting — only by approval.

**Anti-gaming:** Requires genuine, quality content (a walk that passes curation review). The curator acts as the gate. Cannot be gamed.

**Why this name:** Warm, unpretentious, and honest. "Found a good one" is exactly what a dog owner says when they've discovered a new trail. No heroic language.

**Note for implementation:** This badge requires a user identity system (Phase 3) and a curation workflow. The badge is attributed to the `source_user_id` on the approved walk entry.

---

### 10. Voice of the Pack
**Category:** Community
**Phase:** 3 (requires review system)

**Earned moment copy:**
*"Other walkers plan their routes around reviews like yours. You've earned that."*

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

## How Badges Are Hidden — No Locked State

Badges that have not been earned do not exist in the UI.

There is no locked badge grid, no silhouette placeholder, no blurred outline, no "N badges remaining" counter, and no progress indicator of any kind. The badge row in the Me tab does not render at all until at least one badge has been earned.

This is a deliberate direction. Showing locked badges — even as silhouettes — creates gamification pressure that contradicts the personal and warm feel of the tab. Showing progress indicators ("7/10 to your next badge") turns the badge into a task, not a discovery.

The correct mechanic is the opposite: the user goes about their walks and contributions, and badges appear. They were not chasing the badge; the app noticed something about them. That is the experience this system is designed to produce.

---

## How a Badge Is Revealed — Earn Moment

When `checkBadgeEarned()` detects a newly triggered badge (a badge that was not in `sniffout_badges` before this check):

1. **Badge is written to storage** with `earnedAt` timestamp.

2. **If the app is currently open:** a toast notification appears at the bottom of the screen (above the bottom nav):
   ```
   ┌─────────────────────────────────────┐
   │  Leads On                           │
   └─────────────────────────────────────┘
   ```
   Toast duration: 3 seconds, then fade out. One line — just the badge name. Warm, not celebratory. No exclamation, no congratulations. No tap required to dismiss.

3. **If the Me tab is currently active when the badge is earned:** the new badge chip appears in the badge row with a brief scale-up animation (`transform: scale(0.8) → scale(1)`, 200ms ease-out) and a "New" dot indicator.

4. **If the badge is discovered on next visit** (the app was not open when the trigger fired, or the user navigates to Me tab after the earn): the badge chip renders with a subtle "New" dot indicator on first paint. No animation loop, no persistent highlight — just a single visual cue that this chip arrived since the user was last here. The "New" indicator disappears once the chip has been tapped.

**No confetti, no full-screen celebration, no sound.** The toast and the chip appearing are the complete reveal. Understated is correct — this is a personal tab, not a game.

---

## Badge Detail — Tapping a Chip in the Me Tab

Tapping a badge chip in the badge scroll row reveals an inline detail panel directly beneath the row (not a bottom sheet, not a modal):

```
┌─────────────────────────────────┐
│  Leads On                       │
│                                 │
│  You kept coming back.          │
│  The lead was always on.        │
│                                 │
│  Earned 14 Feb 2026             │
└─────────────────────────────────┘
```

**Content:**
- **Badge name** — same as the chip label, slightly larger weight
- **Earned moment description** — the copy defined per badge above. Personal, warm, no stats, no counts. Written as a reflection of who the user has become, not a receipt of what they did.
- **Date earned** — day and month and year, formatted as "14 Feb 2026". No time, no relative date ("2 weeks ago") — the absolute date is warmer for a personal record.

**Interaction:**
- Tapping a different chip collapses the current detail and opens the new one
- Tapping the same chip again collapses the detail
- One detail open at a time

**What is not shown in the detail:**
- The badge trigger threshold ("you filed 5 reports")
- Any progress toward other badges
- A "share" button (Phase 3 consideration — not Phase 1)
- Any gamification framing

The detail is personal and specific. It reads like a note the app wrote about the user, not a certificate of completion.

```css
.me-badge-detail {
  margin-top: 10px;
  padding: 14px 16px;
  background: var(--bg);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: fadeIn 160ms ease;
}
.me-badge-detail-name {
  font: 600 14px/1 'Inter', sans-serif;
  color: var(--ink);
}
.me-badge-detail-desc {
  font: 400 14px/1.45 'Inter', sans-serif;
  color: var(--ink-2);
}
.me-badge-detail-date {
  font: 400 12px/1 'Inter', sans-serif;
  color: var(--ink-2);
  opacity: 0.6;
  margin-top: 2px;
}
```

---

## Badge Descriptions in the UI

Badge earned-moment copy appears in two places only:

1. **The toast notification** — the badge name only (one line, no description in the toast itself). The full description waits in the Me tab.
2. **The inline detail panel** — full earned-moment copy + date, revealed on chip tap.

Badge copy is **not** shown in:
- The badge chip itself (name only, no description)
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
