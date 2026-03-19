# Sniffout — Strategic Scoping: Free-Form Walk Logging and Dog Diary
*Issued by: Product Owner*
*Date: 19 March 2026*

---

## 1. STRATEGIC FIT

Both features fit within the personal record direction. But they fit differently, and that distinction matters.

**Free-form walk logging is not an enhancement — it is a prerequisite.**

The strategic reframe is "a dog walking journal that happens to also be the best way to find new walks." A journal that only records walks from a 65-walk database does not function as a journal. A user who walks their local park or canal towpath every day would open their walk journal and find it mostly empty. That is a broken experience, and beta testers will identify it immediately.

The current walk log records effort and memory for curated walks. But a user's actual walking life is mostly not curated walks — it is regular local routes, spontaneous detours, holiday walks. If the journal does not reflect that life, the app cannot be the irreplaceable personal record that the strategy requires. Free-form logging closes that gap and makes the strategic shift credible.

**The dog diary is a genuine extension — adjacent, valuable, but distinct.**

The walk journal is "what we did together." The health and diary log is "notes about you." These are different categories of information, even though they are both centred on the dog. A health log is closer in nature to a notebook than a walk log. Whether it belongs in Sniffout depends on whether the app is a walk journal specifically, or a dog companion app more broadly.

The honest answer is: it strengthens the "irreplaceable" quality of the app significantly. A user with two years of vet visit notes and medication records in Sniffout is not migrating to a competitor. But it also risks pulling the product toward general dog app territory. That risk is manageable as long as the feature is built as a simple notes tool, not as a clinical health tracker with reminders and charts.

Both features strengthen the proposition. Free-form logging is urgent. The dog diary is valuable but can wait.

---

## 2. FREE-FORM WALK LOGGING

### Same journal — not a separate section

Free-form walks must appear in the same walk journal as curated walk entries. Users do not want two separate lists. They want a single chronological record of their dog's walks. The distinction between curated and free-form should be visible — a subtle label or different icon — but not structurally separating.

A free-form entry in the journal looks and behaves like a curated entry: date, name, optional notes, optional distance. It is distinguished by the absence of a Sniffout walk link and a small "Your walk" label in place of the walk location chip.

### Minimum viable data for a free-form entry

| Field | Required? | Notes |
|-------|-----------|-------|
| `name` | Yes | User-provided. "Morning park", "Victoria Park", "That muddy track near work." 50 character limit. |
| `ts` | Auto | Defaults to the current date/time. User can edit the date (not the time — unnecessary precision). |
| `note` | No | Same text area as curated walk notes. No character limit. |
| `distance` | No | Miles. Manual entry. No GPS — same principle as the "~" prefix approach already in the app. |
| `duration` | No | Minutes. Manual entry. |

**Not included:** lat/lon, terrain type, off-lead status, livestock flags, difficulty, or any WALKS_DB schema fields. Free-form entries are journal entries, not database records. Do not build a walk submission form — that is a separate, deferred feature requiring editorial review.

### Visual distinction from curated entries in the UI

In the walk journal list, curated entries show the walk name as a tappable link that opens the walk detail overlay. Free-form entries show the user-provided name as plain text with a small "Your route" chip. The entry card is otherwise identical: date, dog name, note excerpt if present, distance if entered.

The "Your route" chip uses `var(--ink-2)` background at low opacity — not `var(--brand)` — to signal that this is a personal entry, not a Sniffout-curated walk. It should be warm and neutral, not highlighted.

### localStorage schema

Extend `sniffout_walk_log` with a `type` field and the fields needed for free-form entries:

```js
// Existing curated entry (unchanged)
{
  id: "malham-cove",      // WALKS_DB ID
  type: "curated",        // NEW field — default for existing entries
  ts: 1741200000000,
  note: "Biscuit swam in the beck.",
  weather_code: 1,
  is_day: 1,
  dogId: "dog1"
}

// New free-form entry
{
  id: null,               // no WALKS_DB ID
  type: "custom",         // distinguishes from curated
  ts: 1741200000000,
  name: "Victoria Park morning",  // user-provided name (required)
  distance: 2.5,          // optional, user-entered miles
  duration: 45,           // optional, user-entered minutes
  note: "Long loop around the pond.",
  weather_code: null,     // populated from session if available, else null
  is_day: null,
  dogId: "dog1"
}
```

**Migration:** existing entries without a `type` field are treated as `"curated"`. No migration script needed — a simple `entry.type || "curated"` fallback handles it.

**Helper function update:** `getWalkLog()` already exists. Functions that filter by walk ID (e.g., `isWalked(id)`, `getWalkLogCount(id)`) operate on curated entries and are unaffected — they filter on the `id` field, which is null for custom entries. New helper `getCustomWalkLog()` returns `sniffout_walk_log.filter(e => e.type === "custom")` for the journal display.

### Entry point in the UI

The walk journal section in the Me tab should have a "+ Log a walk" button. This opens a lightweight bottom sheet:

```
LOG A WALK

Walk name (required)
[e.g. Victoria Park]

Date
[Today ▼]

Distance (optional)
[    ] miles

Duration (optional)
[    ] minutes

Notes (optional)
[Add a note...]

[Save]
```

No map, no route recording, no GPS. A form. The simplicity is the point.

### Phase

**Phase 2.** No API calls, no backend dependencies. Low technical risk — it is an extension of the existing walk log data model. This is ready to brief to the Developer.

---

## 3. DOG DIARY / HEALTH LOG

### Where it lives

The dog diary is a subpage within the Me tab, accessible from a "Notes about [Dog name]" row in the dog profile section. It does not get its own navigation tab — that would be too prominent for a secondary feature and would change the product's identity (five tabs already cover discovery, weather, walks, nearby, and personal record; a sixth would dilute focus).

It does not live inside the walk journal — the content types are different. Walk log entries are about outings. Diary entries are about the dog as an individual. Mixing them in one timeline would make both harder to read.

It is a subpage. When the Me tab subpages spec (`me-tab-subpages-spec.md`) is implemented in Round 27, this fits naturally as a second-tier page under the dog profile section. The entry point is a row in the dog profile section: "Notes about [Dog name] →" showing the most recent entry date.

### Entry types for Phase 2

Keep this simple. Four types cover the meaningful categories without creating complexity:

| Type | Label in UI | Icon |
|------|------------|------|
| `vet_visit` | Vet visit | clipboard |
| `medication` | Medication | pill (or shield) |
| `health_note` | Health note | heart |
| `general` | General note | note |

Do not add reminder functionality, recurring medication schedules, weight tracking, or vaccination calendars. Those are Phase 3+ features that require notification infrastructure and significantly more design work. MVP is a timestamped list of notes with a type label.

### Schema

```js
// sniffout_dog_diary (new localStorage key)
[
  {
    id: "diary-entry-1741200000000",  // simple unique ID: "diary-" + ts
    ts: 1741200000000,
    type: "vet_visit",     // "vet_visit" | "medication" | "health_note" | "general"
    title: "Annual vaccinations",  // required, 60 char limit
    note: "All clear. Healthy weight. Next due March 2027.",  // optional
    dogId: "dog1"
  }
]
```

Functions needed: `getDogDiary()`, `saveDogDiaryEntry(entry)`, `deleteDogDiaryEntry(id)`. Standard localStorage read/write.

### Where in navigation

```
Me tab
  └── Dog profile section
        └── "Notes about [Dog name] →" (entry row, shows most recent date)
              └── Dog diary subpage (list of entries, newest first)
                    └── Individual entry view / edit
```

This is one level deeper than the main Me tab. It is appropriate depth for a secondary-priority feature.

---

## 4. DEPENDENCIES AND RISKS

### Firebase migration (Phase 3)

Neither feature introduces architectural complexity for Firebase migration.

Free-form walk entries live in `sniffout_walk_log` alongside curated entries. In Firestore, they go into the same `walkLog` collection for the user. The `type: "custom"` field distinguishes them. No separate collection needed.

Dog diary entries live in a new `sniffout_dog_diary` localStorage key. In Firestore, they become a separate `dogDiary` sub-collection on the user's dog document. Simple, clean separation.

The migration story for both is identical to the existing walk log migration plan: on first sign-in, local data uploads to Firebase. No architectural debt created by building either feature in Phase 2.

### GDPR

**Free-form walk logging:** No additional risk beyond what already exists. The walk log already stores location-adjacent data (walk names, notes). Adding free-form walks with user-provided location names is the same category of data.

**Dog diary / health log:** Pet health data is not special category data under UK GDPR (Article 9 covers human health data only). Medication notes, vet visit records, and health observations about an animal fall outside the sensitive data categories.

However, one nuance worth noting for the solicitor when Phase 3 arrives: diary entries are stored in a user's account and could indirectly reveal things about the owner (e.g., anxiety medication might signal a dog's environment). This is a low-probability fringe concern, not a blocker. In Phase 2 with localStorage only, it is not a practical risk at all.

**Recommendation:** Flag the dog diary as a data category when the solicitor reviews the privacy policy. It is unlikely to require special treatment, but the solicitor should be aware the app stores health-adjacent notes so the privacy policy can reflect this accurately.

### Scope creep risk

**Free-form walk logging — LOW risk if the boundary is held.**

The risk is feature inflation: GPS tracking, route recording, automatic distance measurement, weather capture, photo per free-form walk, sharing. All of these are technically achievable but would each add significant scope. The firm boundary is: text entry only in Phase 2. The user types a name, optionally types a distance and duration, optionally writes a note. That is it. If users want route recording, that is a separate future feature.

**Dog diary — MEDIUM risk.**

The temptation is to add: medication reminders (push notifications — deferred), vaccination schedule with date alerts (calendar integration — deferred), weight tracking over time (charts — unnecessary complexity), vet contact directory (a different product). The firm boundary is: a timestamped list of text entries with a type label. If it becomes a pet health tracker with alerts and charts, it has left its lane. MVP is a notebook, not an app.

---

## 5. RECOMMENDATION

### Priority order

**Build free-form walk logging first, before soft launch.**

This is the stronger call. Here is the reasoning:

The journal cannot function as a personal record without it. Beta testers will arrive at Sniffout, mark a walk or two from the curated list, then go home and walk their local park the next morning. They open the journal the following day and it is empty. The app has failed to do the thing it said it would do. That is a credibility problem that will generate feedback noise and distract from the things you actually want to learn from beta testing.

Free-form logging is also technically straightforward. It extends an existing data structure, requires one new bottom sheet, and adds one new entry type to the journal display. It is not a large round of development. The reward-to-effort ratio is high.

**Build the dog diary after soft launch — probably Phase 2b.**

The diary is genuinely useful but it is not a launch prerequisite. Beta testers who use Sniffout primarily as a walk journal will not feel its absence in the way they will feel the absence of free-form logging. After launch, you will have real user feedback to validate whether this is something users actually want, and how they think about it — which may be different from how it looks on paper. Build it once that signal exists.

### MVP scope summary

**Free-form walk logging — MVP:**
- "Log a walk" button in the walk journal section of the Me tab
- Bottom sheet with: walk name (required), date (defaults to today, editable), distance (optional), duration (optional), notes (optional)
- Entry appears in the journal timeline with a "Your route" chip distinguishing it from curated walks
- No GPS, no map, no route recording
- `type: "custom"` field added to walk log schema; existing entries default to `"curated"`

**Dog diary — MVP:**
- Subpage accessible from Me tab → dog profile section → "Notes about [Dog name] →"
- Four entry types: vet visit, medication, health note, general
- Each entry: type, title (required), date (required, defaults to today), notes (optional)
- Chronological list view, newest first
- New localStorage key: `sniffout_dog_diary`
- No reminders, no recurring entries, no charts, no weight tracking

### What to do right now

1. Add free-form walk logging to the Round 27 brief alongside Me tab subpages, or as a standalone Round 28 if Round 27 is already scoped.
2. Defer the dog diary to a post-launch round. Add it to the Phase 2 remaining list in `po-action-plan-round24.md`.
3. When the solicitor reviews the privacy policy (L2), flag that the app stores user-entered notes about their dog including health observations.
4. Do not add route recording, GPS, or map features to either scope — that is a separate product decision that warrants its own strategic assessment.
