# Sniffout — Community Engagement Research
*Researcher role. March 2026. Phase 2 planning input.*
*Based on: CLAUDE.md, po-action-plan.md, competitor-research.md, and original web research.*

---

## Strategic Context

Before findings: the single most important thing this research confirmed is that Sniffout's current sequencing is correct.

PlayDogs — the closest direct competitor — built a 100% community-generated product. In any region with few users, the app is empty. The UK is exactly that region. PlayDogs has 170,000 downloads and the UK App Store listing has "not enough ratings or reviews to display an overview." Community-only products cannot solve their own cold-start problem; the content doesn't exist until users exist, and users don't come until content exists.

Sniffout has curated content from day one. That is the structural advantage. The question for Phase 2 is not "how do we get users to create the walks?" — it is "how do we layer community enrichment on top of walks that are already there?"

Everything in this report is read through that lens.

---

## Part 1 — Contribution Incentives

### Why users contribute to community apps at all

Research across AllTrails, Komoot, and Strava converges on three genuine motivations — not the gamification-first explanation, but what drives actual behaviour:

**1. Reciprocity.** The dominant motivation is paying it forward. Users who benefited from a review that said "very muddy through the middle section, wear boots" feel a social obligation to leave the same for the next person. AllTrails frames every review prompt around this: "share your experience with fellow members." This framing — contribution as a service to other users, not to the app — consistently outperforms transactional framing ("help us improve").

**2. Personal record-keeping as a side effect.** A large proportion of AllTrails reviews are effectively personal logs. Users are documenting what they did; the community benefit is incidental. AllTrails exploits this by making the review the natural endpoint of the activity — when you save a walk, the review screen appears before the summary screen. The review is the save action. This is the single most effective design pattern found in the research: **make the contribution the natural conclusion of an activity, not a separate optional step.**

**3. Visible recognition.** AllTrails' "Verified Completed" badge — earned when your tracked route overlaps 75% of an official trail — appears on your profile and on the trail page. The badge is earned by tracking the walk; the review prompt fires at the end of the track. Users are motivated to earn the badge, which makes them track the walk, which makes them complete the review. Strava registered 14 billion Kudos globally in 2025 (up 20% year-on-year), and its data confirms social recognition is a retention driver, not just a vanity feature.

### The first contribution problem

This is the hardest conversion. Specific patterns that work:

**Post-activity prompting is the highest-converting trigger.** AllTrails requires a star rating before a user can exit the post-hike screen. Users have complained about it on the community forum ("How do I NOT have to give feedback after a hike?") — and AllTrails has kept it anyway for years, which tells you it converts. A star rating forces no real effort; it is one tap. AllTrails knows the data is worth the minor friction.

**The minimum contribution must be a single tap.** AllTrails' star rating is sufficient to dismiss the post-activity prompt. Condition tags are a single tap per tag. No writing required for either. The conversion cliff is between "tap something" and "type something." Apps that require text before proceeding have measurably lower first-contribution rates.

**Condition tags outperform ratings per unit of effort.** A 1–5 star tap is easy. A pre-defined condition tag is equally easy — but it is more operationally useful. "Cattle in field this morning" tells a dog owner something a 3-star average does not. For Sniffout specifically, a condition tag system maps directly to the highest-value information UK dog owners share with each other.

**Komoot pre-gates contribution.** Komoot prompts users to create a Highlight *before uploading their activity*, not after. The contribution comes first; the upload is the reward. It normalises contribution as part of the save ritual. This is worth noting for the walk-tracking feature if Sniffout adds that in Phase 2.

### What annoys users — what to avoid

- **Mandatory text fields.** The single biggest complaint across every platform. If a user cannot exit a review prompt without typing, drop-off is high. Never block navigation behind a text input.
- **Repeated prompts.** Once is a nudge. Twice is an annoyance. A dismissed prompt should not reappear on the next walk.
- **Account creation as a prerequisite to contributing.** Multiple sources confirm this is a significant drop-off point. Users who cannot contribute without creating an account often just leave instead.
- **Platform-first framing.** "Help us improve Sniffout" is weak. "Let the next dog walker know the path conditions" is strong. Contribution framing that benefits other users converts better than contribution framing that benefits the platform.

### Incentive mechanisms ranked by conversion

| Rank | Mechanism | Why it works |
|------|-----------|--------------|
| 1 | Post-activity prompt (contextual) | Contribution is the natural end of an activity, not an interruption |
| 2 | Single-tap minimum floor (star or condition tag) | Removes the friction cliff between "doing something" and "doing nothing" |
| 3 | Completion badges / personal logs | Gives users a reason to track the walk, which triggers the review |
| 4 | Social proof framing ("4 people found this useful") | Shows contribution has an audience |
| 5 | Community reciprocity framing ("let the next dog walker know") | Moral motivation — strongest in niche communities |
| 6 | Gamification streaks | Effective for retention, weaker for first contribution |
| 7 | Explicit rewards / discounts | Lowest conversion, most operationally complex at small scale |

---

## Part 2 — Minimum Viable Community Features

### What you can do without user accounts

A specific class of community feature works without account creation:

- **Star ratings** — stored against a walk ID, no identity required
- **Condition tags** — pre-defined labels, tap-selectable, timestamped
- **"This was helpful" votes on existing reviews** — no account, provides ranking signal
- **Anonymous photo uploads** — possible (Imgur-style), but quality control becomes harder

The account threshold arrives when features require:
- Attribution (users want to see who left a review)
- Reputation weighting (trusted contributors' reviews carry more weight)
- Content ownership (users need to edit or delete their own posts)
- Abuse prevention (banning users for spam or false reports)
- Social features (following, activity feeds, messaging)

**The practical answer for Sniffout:** Condition tags and star ratings can launch without accounts. Written reviews require lightweight accounts. Photo uploads ideally require accounts for quality control. This creates a natural progression: Phase 2a (no-account condition tags + ratings), Phase 2b (lightweight account for reviews and photos).

### How successful apps transition from curated to community

The consistent pattern across AllTrails and Komoot:

1. **Curated foundation comes first and stays.** AllTrails began with staff-curated trails. The curated record — distance, difficulty, verified off-lead status — is the authoritative floor. Community content enriches it; it does not replace it.
2. **Community content is additive, not editorial.** Reviews, condition tags, and photos sit on top of the curated walk data. The curated fields remain locked to the Sniffout team. Community fields are timestamped and explicitly labelled as community-reported.
3. **The distinction is shown in the UI.** AllTrails labels "Curated Trails" vs. "Community Content." Komoot labels Highlights as community-contributed. Users need to see which data has been verified. This is a trust mechanism, not just a disclosure one.
4. **Community content makes curated content more useful.** A curated walk entry that says "off-lead: partial" is static. A condition tag that says "cattle in the lower field this week" is dynamic and makes the walk entry more useful — but only because the curated entry exists to anchor it.

### The contribution flywheel for a walk discovery app

AllTrails' growth loop (documented in growth analysis):
1. Users find a trail page via search
2. They use the trail, find it accurate — trust is established
3. A percentage track the walk and earn the Completed badge
4. They're prompted to leave a review/condition tags; a portion do
5. More reviews make the trail page more useful for the next user
6. Better trail pages attract more users, who leave more reviews

**For Sniffout as a PWA**, the SEO dimension of this loop (AllTrails derives 68% of its traffic from non-branded organic search, driven by user review content) is less immediately relevant. The in-app version of this flywheel is:

1. User opens Sniffout, finds curated walks
2. Returns to app before a walk to check conditions (daily habit)
3. Sees a recent condition tag from another user → trusts the app more
4. Completes the walk, gets prompted, leaves a condition tag
5. That tag makes the app more useful for the next user's pre-walk check
6. More useful → higher retention → more word-of-mouth in UK dog owner communities

**The critical early metric is not volume of reviews but recency of condition tags.** An app with 3 condition tags from the last 48 hours feels alive. An app with 50 reviews from two years ago feels stale. For a pre-walk conditions check habit to form, users need to see that the community is active.

### Minimum viable Phase 2 feature set

Based on the research, this is the smallest feature set that creates genuine value and starts the contribution flywheel:

| Feature | Description | Account needed? |
|---------|-------------|-----------------|
| Star rating on walks | 1–5 stars, stored against walk ID | No |
| Condition tags | Pre-defined tap labels (see taxonomy below) | No |
| Timestamp display | "Reported 2 hours ago / 3 days ago" on each tag | No |
| Tag expiry | Condition tags auto-marked stale after set window | No |
| "Mark as walked" | User action that triggers rating/tag prompt | No |
| Community disclaimer | "Community reported — not verified by Sniffout" label | No |

This set requires no account creation, no social features, no moderation infrastructure beyond Terms of Service — and it gives returning users a reason to open the app before every walk.

---

## Part 3 — Condition Tag Taxonomy for Dog Walks

This is the most actionable section of the research. UK dog owner communities (Facebook groups, Mumsnet dog threads, Walkiees forums) show a consistent pattern of what information dog owners share with each other. It maps to a pre-defined tag set that requires zero moderation.

### Proposed Sniffout condition tag set

**Hazard tags (most important):**
- 🐄 Cattle in field
- 🐑 Sheep in field
- 🐕 Dogs on leads here (e.g. ground-nesting birds)
- ⚠️ Access issue (gate locked, path blocked)

**Surface/terrain tags:**
- 💧 Very muddy underfoot
- 🌊 Flooded section
- 🌿 Overgrown path
- ❄️ Icy/slippery

**Positive tags:**
- 💧 Great water point for dogs
- ☕ Dog-friendly café open
- 👍 Excellent conditions today

**Safety:**
- 🚗 Busy / crowded
- 🔕 Quiet today

### Tag rules

- Each tag is timestamped at submission
- Tags older than **14 days** are displayed with a "may be out of date" label
- Tags older than **30 days** are hidden by default (collapsible under "older reports")
- Tags with animal hazards (cattle, sheep) have a 7-day staleness window, not 14 — these are more time-sensitive
- Tags require no account but IP/device-rate-limited to prevent flooding

---

## Part 4 — Competitive Community Feature Benchmarking

### AllTrails

**Strengths:**
- Condition tags are the most-valued community feature — specific, time-sensitive, practically useful
- Verified Completed badge creates a tracking habit that feeds the review funnel
- Post-activity review gate is the most effective contribution trigger found in the research
- Photo gallery showing current trail conditions is praised as "invaluable for planning"

**Weaknesses (instructive for Sniffout):**
- Stale reviews presented without date-based sorting — a 2019 review for mud conditions appears next to a 2025 one. Users have noted this erodes trust.
- Difficulty ratings are called "essentially meaningless" because they are community-averaged and lack a reference point. A 5km walk through flat fields gets the same "easy" rating as 5km through moorland — because both communities gave it 1 star for difficulty.
- Unofficial GPS-tracked routes submitted as trails with no editorial vetting — documented safety issue. Users have been guided onto unmaintained paths.
- Review bombing: 1-star reviews for car park disputes, not walk quality.

**Key lesson:** Difficulty and off-lead status must be curatorially set, never community-averaged. Condition tags (not ratings) are the right mechanism for time-sensitive walk quality assessment.

### Komoot

**Strengths:**
- Highlights system is the most sophisticated community contribution mechanic found in research — composite, self-moderating via community ratings, quality-gated by engagement threshold
- "5 Myths About Highlight Creation" post reveals a key insight: users overestimate the bar for valid contribution. Lowering the *perceived* bar explicitly drives first contributions.
- Community guidelines are specific and public — users know what a good contribution looks like before making one
- Negative ratings auto-hide low-quality Highlights — community self-moderation with no staff time required

**Weaknesses:**
- The Highlight system requires account creation and photo upload — higher friction than Sniffout's Phase 2 needs
- The pre-activity gating (contribute before upload) is powerful but requires GPS activity tracking to be in the product

**Key lesson:** Self-moderation via community votes is more scalable than editorial moderation. At small scale, a simple "not helpful" flag achieves the same outcome.

### PlayDogs

**Strengths of the model:**
- Full GPS walk tracking with auto-calculated distance/duration — the most complete community walk feature set of any app in this category
- Social layer (groups, events, messaging) creates genuine community density in served regions

**Critical weakness:**
- Community-only content = empty app in new regions. The UK is the case study. No curated floor means no cold-start solution. Sniffout's curated foundation directly addresses this failure mode.

**Key lesson:** Community features are valuable only when there is already a reason to open the app. Content-first, community-second is the correct sequencing.

### Bud (UK dog walking app)

Bud is the most directly applicable model for Sniffout's specific use case. Its community hazard reporting system works as follows:
- Community-reported hazards (flooding, livestock on path, blocked paths) appear on the map as pins
- Each report is timestamped
- Users following that route are prompted to confirm "is this still relevant?" — re-confirmation keeps reports current
- Unconfirmed reports fade after a set period

This **time-decaying verification model** is the right mechanic for dog-specific hazard reporting. A cattle report that gets re-confirmed by two subsequent users stays visible; a report that is never re-confirmed fades. It requires no moderation staff and creates a self-maintaining information layer.

### Walkiees (UK)

50,000 registered UK users, community walk submission, reviews and comments. The community layer is active but sparse — typical of a web-first product where contribution requires navigating to a form. Nonetheless, UK dog owners do contribute when the barrier is low enough. Walkiees proves the audience exists; it doesn't have the app experience to maximise it.

---

## Part 5 — Risks and Moderation

### Quality failure modes to plan for

**Stale information presented as current.** AllTrails is the documented failure case. A 2019 review about mud appears in the same list as a 2025 report. No visual distinction. **Sniffout mitigation:** All community content is timestamped visibly. Condition tags have a hard expiry window. Reviews display relative date (not just absolute) — "3 days ago," not "14 March 2026."

**Unofficial content treated as curated.** AllTrails allows any GPS track as a trail submission, creating safety issues when unofficial routes appear identical to verified ones. **Sniffout mitigation:** Community content is limited to reviews and condition tags on curated walks. No user-submitted walk routes in Phase 2. The curated walks are the canonical record; community enriches them, cannot create new ones.

**Crowd-sourced difficulty ratings drift from reality.** A community-averaged difficulty score is useless because it averages across wildly different reference points. **Sniffout mitigation:** Difficulty, off-lead status, and livestock presence are curatorially set by the Sniffout team. Community tags can *supplement* livestock information (a time-sensitive "cattle in field today" tag on a walk that carries a curatorial "livestock: possible" flag) but cannot override it.

**Review bombing and off-topic content.** 1-star reviews for parking disputes, dog-reactive dog sightings (not the walk's fault), or experiences with other users are documented on AllTrails. **Sniffout mitigation:** Review guidelines explicit about scope (rate the walk, not the parking, not other dog owners); "flag this review" button that routes to a simple email form at small scale.

**Liability for hazard misinformation.** UK-specific risk: a user relying on a community-reported "no cattle" tag when cattle are present, resulting in a livestock incident. Under the Animals Act 1971 and the 2024 livestock worrying law updates, there is potential for claim of reliance. **Sniffout mitigation:** Every piece of community content is labelled "Community reported — not verified by Sniffout" in the UI (not just in ToS). The label must appear adjacent to the content, not buried.

### Moderation approach at Sniffout's current scale

**Phase 2 moderation stack (minimum viable):**

| Content type | Moderation approach |
|---|---|
| Star ratings | None required — aggregated, no individual visibility at small scale |
| Condition tags | Pre-defined taxonomy — no moderation. IP/device rate limiting only |
| Written reviews | Reactive-only. "Flag this review" → email to team. Review guidelines set scope |
| Photo uploads | Manual approval before publication. Defer until account infrastructure exists |

**On accounts and UK legal cover:** Under the UK Defamation Act 2013 (Section 5), platform operators can reduce liability for defamatory UGC if the contributing user is identifiable. **Fully anonymous community contributions carry higher legal exposure than contributions tied to even a minimal account (display name + email).** This is a material consideration for the written reviews layer specifically. Condition tags (non-defamatory by nature) can remain anonymous; written reviews should require a lightweight account before publishing.

---

## Part 6 — The Accounts Question

This deserves its own section because it is the gating decision for most of Phase 2.

### What you can do without accounts

- Star ratings
- Condition tags (pre-defined)
- "Mark as walked" (local, stored in localStorage)
- Read access to all community content

### What requires accounts

- Written reviews (UK defamation law cover; content ownership)
- Review editing and deletion
- Social features (following, activity feeds, community walks)
- Walk submission
- Photo uploads (quality control and attribution)

### How to introduce accounts without friction

Every well-studied app in this category recommends the same sequencing: **let users experience value before asking for an account.**

- New users interact with the app for at least one session before account creation is suggested
- Account creation is triggered contextually — when a user tries to leave a written review, not on first open
- The prompt is: "Create a free account to post your review" — not "create an account to continue"
- The minimum viable account is display name + email only. No phone number, no date of birth, no profile photo required at signup
- Sniffout's no-login positioning (a genuine differentiator per CLAUDE.md) is preserved: the app works fully without an account. Community features that require an account are presented as optional enhancements, not gates

### Recommendation

Phase 2 should launch community features in two steps:

**Step 1 — No-account community (condition tags + star ratings):**
Available immediately with no account required. Condition tags + star ratings on curated walks. "Mark as walked" action that triggers a single-tap prompt. All community content labelled "Community reported — not verified by Sniffout." This can launch alongside any Phase 2 build.

**Step 2 — Lightweight account for written reviews:**
Introduce after the no-account community layer is live and generating data. Account creation is triggered only when a user tries to write a review. The ask is minimal: display name + email. Users who don't want to create an account can still rate and tag walks.

---

## Summary — Top Recommendations for Phase 2

| Recommendation | Priority | Rationale |
|---|---|---|
| Condition tag system (pre-defined taxonomy, time-stamped, expiring) | Critical | Highest-value community feature for dog owners; zero moderation cost; directly enables daily habit |
| Star rating on walks (no account, single tap) | Critical | Lowest friction first contribution; populates trust signal on walk cards |
| "Mark as walked" action + post-walk prompt | High | Highest-converting contribution trigger; personalises the experience for returning users |
| Time-decay on all community content | High | Prevents stale-data trust erosion; requires no moderation |
| "Community reported — unverified" label in UI | High | Legal and trust protection; must be adjacent to content, not in ToS |
| Curated fields remain locked (difficulty, off-lead, livestock) | High | Prevents crowd-sourced drift that makes AllTrails ratings "essentially meaningless" |
| Written reviews behind lightweight account (Phase 2b) | Medium | UK legal cover; quality floor; defer until condition tags are live and active |
| Self-moderation via "not helpful" flag | Medium | Scalable quality control with zero staff time; community-rated low-quality content is hidden |
| Photo uploads deferred until account infrastructure exists | Low | Quality control without accounts is operationally unmanageable |
| Walk submission (user-created routes) deferred to Phase 3 | Low | Highest editorial risk; no benefit until community volume justifies curation pipeline |

---

*Sources: AllTrails Help Centre; AllTrails community forums; AllTrails growth analysis (growthloopteardown.substack.com); Komoot Help Centre; Komoot community guidelines; Komoot Highlights documentation; PlayDogs website and Google Play listing; Bud app (budapp.co.uk); Walkiees (walkiees.co.uk); Strava gamification analysis (trophy.so); Community flywheel theory (bettermode.com); UK Defamation Act 2013 guidance; OS GetOutside livestock worrying laws update (2024).*
