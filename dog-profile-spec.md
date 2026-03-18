# Dog Profile — Concept Spec
**Phase:** 2 (localStorage, no backend)
**Principle:** Everything becomes about the dog. Not "your walks" — "Biscuit's walks."

---

## The Core Insight

The research established that dog owners walk for companionship, not fitness. The meaningful unit is the outing — the thing done together. A stats panel that says "47 miles walked" is a fitness tracker. A tab that says "47 miles with Biscuit" is irreplaceable.

One field — the dog's name — transforms every string in the app. Nothing else does this. Adding breed, birthday, and size is refinement. Adding the name is the shift.

This spec is built around that truth: **get the name first, everything else is optional and secondary.**

---

## 1. Onboarding Moment

### When

**First visit to the Me tab.**

Not first app launch — the user has no relationship with Sniffout yet, and a profile form before any value has been delivered feels like a gate. Not after first walk logged — a significant portion of users will explore without ever logging a walk, and they deserve the personal experience too.

The Me tab is the personal zone. The first time a user arrives there, the app should ask one warm question. The empty state and the onboarding moment are the same thing: the dog name prompt replaces what would otherwise be a hollow "nothing here yet" screen.

### Feel

Not a form. One question, one field, one button. The prompt should feel like the beginning of something rather than registration. The tone is warm and curious, not administrative.

---

### Setup Card Layout

Shown in place of the Me tab empty state when `sniffout_dog` is null:

```
┌────────────────────────────────────────┐
│                                        │
│    [dog nose mark SVG — 36px,          │
│     in brand-tinted circle, 56px]      │
│                                        │
│  What's your dog's name?               │
│  (so we can make this yours)           │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ e.g. Biscuit                   │    │
│  └────────────────────────────────┘    │
│                                        │
│  [Continue →]                          │
│                                        │
│  Skip for now                          │
│                                        │
└────────────────────────────────────────┘
```

```html
<div class="dog-setup-card">
  <div class="dog-setup-avatar">
    <!-- dog nose mark SVG, same as header logo, 28px, brand colour -->
  </div>
  <p class="dog-setup-heading">What's your dog's name?</p>
  <p class="dog-setup-sub">So we can make this yours.</p>
  <input class="dog-setup-input" type="text" placeholder="e.g. Biscuit"
         maxlength="24" autocomplete="off" autocapitalize="words">
  <button class="dog-setup-btn" onclick="saveDogName()">Continue →</button>
  <button class="dog-setup-skip" onclick="dismissDogSetup()">Skip for now</button>
</div>
```

```css
.dog-setup-card {
  margin: 24px 16px;
  padding: 28px 24px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.dog-setup-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(30, 77, 58, 0.10);  /* update to match --brand */
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.dog-setup-heading {
  font: 700 18px/1.2 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -0.2px;
}
.dog-setup-sub {
  font: 400 14px/1 'Inter', sans-serif;
  color: var(--ink-2);
  margin-top: -4px;
}
.dog-setup-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font: 500 16px/1 'Inter', sans-serif;
  color: var(--ink);
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  outline: none;
}
.dog-setup-input:focus {
  border-color: var(--brand);
}
.dog-setup-btn {
  width: 100%;
  height: 48px;
  background: var(--brand);
  color: #fff;
  font: 600 15px/1 'Inter', sans-serif;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 4px;
}
.dog-setup-skip {
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  background: none; border: none;
  padding: 4px 0;
  cursor: pointer;
}
```

### Post-Setup Transition

After tapping Continue (with a name entered):
1. The setup card fades out
2. The Me tab re-renders with the dog's name in the header
3. No celebration, no modal — the personalised tab IS the reward
4. The hero section immediately reads: **"Where will you take [Name] first?"** with a link to Walks

The name is capitalised on save: `name.trim().replace(/\b\w/g, c => c.toUpperCase())`.

### Skip Behaviour

"Skip for now" sets `sniffout_dog_dismissed: true` and shows the standard Me tab empty state (per `me-tab-rethink-v2-spec.md`). The prompt does not reappear on subsequent visits — it would feel pestering. Instead, a quiet "Add your dog →" link appears in the Me tab footer area (below the walk log) indefinitely until a dog is added.

---

## 2. Profile Fields

### Essential — Phase 1

**Name**
The only field that must be set for the feature to be meaningful. All personalised copy depends on this single value. Maximum 24 characters to fit cleanly in the header.

### Optional — Phase 1

**Breed**
Shown as a secondary line in the Me tab header: "Jay · Border Terrier". Adds warmth and specificity without enabling any product logic. Free text input, maxlength 40. Pre-populate with a common-breed autosuggest (optional, Phase 2).

**Size bucket**
Three options: Small · Medium · Large. Displayed as a segmented control, not a dropdown. No label needed — size is self-evidently about the dog. Potential Phase 2 use: filter walks by `offLead: 'full'` or surface shorter/easier walks for elderly/small dogs. Not implemented in v1 filtering but stored for future use.

**Personality tags**
Multi-select chips. Suggested tags:

```
Energetic   Nervous   Elderly   Good recall
Reactive    Loves water   Mud-happy   Sociable
```

Maximum 3 selected. Shown as small chips in the header area below the name, or in the gear-icon settings sheet. Not used for filtering in v1 — stored in localStorage and surfaced in copy only ("Walks for an energetic dog" in Phase 2 filtering).

**Birthday**
Optional. Enables two pieces of charming copy: "Biscuit is 3 years old" in the header and "Happy 4th birthday, Biscuit! 🎂" as a Today tab banner on the birthday date. Uses a month + year picker (not full date — unnecessary precision). Store as `{ month: 8, year: 2021 }`.

### Phase 3 — Requires Backend

**Profile photo**
Shown as a circular avatar in the Me tab header. In Phase 1, the avatar is an SVG placeholder (dog nose mark in a brand-tinted circle). In Phase 3, tapping the avatar opens the device camera/photo picker. Store as base64 in localStorage for offline-first Phase 2 use, migrate to CDN in Phase 3.

---

## 3. localStorage Schema

```js
// sniffout_dog (single JSON object, null until set)
{
  name: "Biscuit",
  breed: "Border Terrier",        // optional, null if unset
  size: "medium",                  // "small" | "medium" | "large" | null
  tags: ["energetic", "loves water"],  // max 3 strings, [] if unset
  birthday: { month: 8, year: 2021 }, // optional, null if unset
  photoUrl: null                   // Phase 3
}
```

Helper functions:

```js
function getDog() {
  return JSON.parse(localStorage.getItem('sniffout_dog') || 'null');
}

function saveDogProfile(updates) {
  var current = getDog() || {};
  localStorage.setItem('sniffout_dog', JSON.stringify(Object.assign({}, current, updates)));
}

function getDogName() {
  var dog = getDog();
  return dog ? dog.name : null;
}

// Use throughout the app:
// var dogName = getDogName();
// var displayName = dogName || 'you';  // safe fallback — never shows null
```

The `displayName` fallback ensures all personalised strings degrade gracefully if the dog profile is not set: "Where will you go first?" instead of "Where will you take null first?".

---

## 4. Where It Lives in the App

### Me Tab Header (primary home)

The dog profile lives in the Me tab header. It does not get its own screen. The profile is accessible and editable from the gear icon settings sheet (a "Your dog" section within the existing settings bottom sheet).

**Without dog profile:**
```
Jay                              [gear]
```

**With dog name only:**
```
[🐕] Biscuit                    [gear]
```

**With name + breed:**
```
[🐕] Biscuit                    [gear]
     Border Terrier
```

**With name + breed + tags:**
```
[🐕] Biscuit                    [gear]
     Border Terrier · Energetic
```

The avatar circle sits to the left of the name, same vertical alignment as the wordmark in the standard header. The breed + tag line is smaller, dimmer (`--ink-2`, 13px), directly beneath the name.

### Settings Sheet

A "Your dog" section appears within the existing gear-icon bottom sheet, above other settings:

```
YOUR DOG
[🐕 avatar] Biscuit
            Border Terrier
            [Edit]

───────────────────────────────
DISPLAY
  Dark mode   [Auto | Light | Dark]
...
```

Tapping "Edit" opens a dedicated "Edit dog profile" bottom sheet with the full field set (name, breed, size, tags, birthday). This keeps the settings sheet from becoming a long form — the dog editing is its own contained step.

### Nowhere Else (in Phase 1)

The dog profile does not appear in:
- Walk detail overlays (the "Mark as walked" action is the only dog-adjacent moment there — see Section 5)
- The Today tab header (weather is context-independent)
- The Walks, Weather, or Nearby tabs (no personalisation context needed)

These are Phase 2 and Phase 3 opportunities, not Phase 1.

---

## 5. How It Changes the App — Copy Strings

### Me Tab

| Moment | Without dog profile | With dog profile |
|---|---|---|
| Tab header | Jay | [Biscuit] + avatar |
| Hero number label | miles walked | miles with Biscuit |
| Hero secondary | across 12 walks | across 12 walks together |
| Empty state headline | Start exploring walks to build your story here. | Where will you take Biscuit first? |
| Empty state CTA | Find a walk → | Find a walk for Biscuit → |
| Badge toast | Leads On earned | Biscuit earned Leads On |
| Badge detail | You filed 5 condition reports. | Biscuit's walker filed 5 condition reports. |
| Walk log — most recent | Roseberry Topping · 3.8 mi | Roseberry Topping with Biscuit · 3.8 mi |
| Section label | Recent walks | Biscuit's recent walks |

### Walk Detail Overlay

| Moment | Without dog profile | With dog profile |
|---|---|---|
| Log button | Mark as walked | Mark as walked with Biscuit |
| After logging | Walk logged | Walk logged for Biscuit |
| Repeat walk note | You've done this walk before | Biscuit's been here before |

### Today Tab

| Moment | Without dog profile | With dog profile |
|---|---|---|
| Paw safety block title | Paw check needed | Check Biscuit's paws |
| Paw safety body (heat) | Pavement may be getting warm. Press your hand... | Pavement may be getting warm for Biscuit. Press your hand... |

### Walks Tab (Phase 2 — not Phase 1)

| Moment | Without dog profile | With dog profile |
|---|---|---|
| Walk card — logged | Walked | Biscuit walked this |
| Walk filter label | Off-lead walks | Off-lead for Biscuit |
| Saved walk tooltip | Saved | In Biscuit's collection |

### Sniffout Wrapped / Annual Summary (Phase 2)

| Moment | Without dog profile | With dog profile |
|---|---|---|
| Summary title | Your 2026 in walks | Biscuit's 2026 in walks |
| Hero line | You explored 28 walks | Biscuit explored 28 walks |
| Achievement | Your best month: August | Biscuit's best month: August |

---

## 6. The Dog Avatar

The avatar is a circular element, 40px diameter, containing the dog nose mark SVG at 22px. Before Phase 3 photo upload, it serves as a warm, brand-consistent placeholder that is immediately readable as "dog" without being a generic profile photo silhouette.

```css
.dog-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(30, 77, 58, 0.10);  /* update to match --brand on Round 15 */
  border: 1.5px solid rgba(30, 77, 58, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/* Phase 3 — photo replaces SVG placeholder */
.dog-avatar--photo {
  background: none;
  border: none;
  overflow: hidden;
}
.dog-avatar--photo img {
  width: 100%; height: 100%;
  object-fit: cover;
}
```

The nose mark SVG inside is the same mark used in the mockup header (viewBox="0 0 48 36"), rendered at 22px wide × 16px tall, in `var(--brand)`. The brand tint circle and brand-colour nose create a visually consistent identity token.

```html
<!-- In Me tab header -->
<div class="dog-avatar" aria-label="Biscuit's profile">
  <svg width="22" height="16" viewBox="0 0 48 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 2C30 2 43 8 43 18C43 28 35 36 24 36C13 36 5 28 5 18C5 8 18 2 24 2Z" fill="var(--brand)"/>
    <ellipse cx="15.5" cy="21" rx="5.5" ry="5.5" fill="#F7F5F0"/>
    <ellipse cx="32.5" cy="21" rx="5.5" ry="5.5" fill="#F7F5F0"/>
    <rect x="22" y="7" width="4" height="9" rx="2" fill="#F7F5F0"/>
  </svg>
</div>
```

Note: the ellipse/rect fill values use `#F7F5F0` (the app background) because this is a filled mark on a tinted circle — the "holes" must match whatever sits behind the avatar. If the avatar is used on a `var(--surface)` white card, these values need to switch to `#FFFFFF`. In the Me tab header (which sits on `var(--bg)`), `#F7F5F0` is correct.

---

## 7. Full Me Tab Header Layout With Dog Profile

```css
.me-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
  gap: 12px;
}
.me-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;  /* allows text truncation */
}
.me-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.me-dog-name {
  font: 700 22px/1 'Inter', sans-serif;
  color: var(--ink);
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.me-dog-meta {
  font: 400 13px/1 'Inter', sans-serif;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```html
<div class="me-header">
  <div class="me-header-left">
    <div class="dog-avatar" ...><!-- SVG --></div>
    <div class="me-header-text">
      <span class="me-dog-name">Biscuit</span>
      <span class="me-dog-meta">Border Terrier · Jay</span>
    </div>
  </div>
  <button class="me-gear" aria-label="Settings"><!-- gear SVG --></button>
</div>
```

If no dog profile: render the standard header without avatar (as per `me-tab-rethink-v2-spec.md`):

```html
<div class="me-header">
  <span class="me-name">Jay</span>
  <button class="me-gear" ...><!-- gear SVG --></button>
</div>
```

---

## 8. Multiple Dogs

**v1: one dog.** No switcher, no multi-dog support. This is the right call for Phase 1.

The reasoning: multi-dog support requires the walk log to associate each entry with a specific dog, the badge system to track per-dog, and the stats to split or aggregate. None of this infrastructure exists. Building it now would mean building twice.

**What a v1 user with two dogs should do:**
The app supports one dog profile. A user with two dogs enters the dog they walk most often, or the dog they primarily use Sniffout with. This is a pragmatic limitation, not a design failure. It mirrors how a user with multiple Spotify accounts simply uses one.

**For Phase 2, the correct multi-dog implementation is:**

A simple switcher in the Me tab header. Not a permanent side-by-side view (too complex for the minimal aesthetic) — a tap on the dog avatar reveals a small inline picker:

```
┌──────────────────────────────┐
│  ✓ Biscuit                   │
│    Archie                    │
│  + Add another dog           │
└──────────────────────────────┘
```

The selected dog becomes "active" — all copy personalisation uses the active dog's name. Walk log entries are tagged with `dogId` so each dog's history is separable. Badges are shared (the walker earned them, not the dog).

This is a 4-line note for Phase 2 planning. Do not implement in Phase 1.

---

## 9. "Edit Dog Profile" Bottom Sheet

Accessible from gear icon → "Your dog" → Edit. This is the full profile editor.

**Structure:**

```
EDIT DOG PROFILE

[avatar / tap to change photo — Phase 3]

Name
[Biscuit              ]

Breed (optional)
[Border Terrier       ]

Size
[Small] [Medium ✓] [Large]

About [Name] (pick up to 3)
[Energetic ✓] [Nervous] [Elderly]
[Good recall ✓] [Reactive] [Loves water]
[Mud-happy] [Sociable]

Birthday (optional)
[August] [2021]

[Save]   [Remove dog profile]
```

The "Remove dog profile" action is a destructive link at the bottom, in `--ink-2`, not a button. Tapping it shows a confirmation: "Remove Biscuit? This won't delete your walks." Confirmed → `localStorage.removeItem('sniffout_dog')`, tab reloads to standard Me tab.

---

## 10. Rendering Logic

```js
function renderMeTab() {
  var dog       = getDog();
  var dogName   = dog ? dog.name : null;
  var username  = localStorage.getItem('sniffout_username') || '';
  var walkLog   = JSON.parse(localStorage.getItem('sniffout_walk_log') || '[]');
  var dismissed = localStorage.getItem('sniffout_dog_dismissed');

  // Header
  if (dog) {
    renderMeHeaderWithDog(dog, username);
  } else {
    renderMeHeader(username);
  }

  // Hero / empty state
  if (!dog && !dismissed && walkLog.length === 0) {
    // First visit, no dog, no walks: show dog setup card
    renderDogSetupCard();
  } else if (walkLog.length === 0) {
    // No walks but dog set (or dismissed): standard empty state
    renderMeHeroEmpty(dogName);
  } else {
    // Returning user: miles hero
    var totalMiles = walkLog.reduce(function(sum, w) { return sum + (w.distance || 0); }, 0);
    renderMeHero(totalMiles, walkLog.length, dogName);
  }

  // Badges, walk log (unchanged from me-tab-rethink-v2-spec.md)
  // ...
}

// Personalised copy helpers
function heroLabel(dogName) {
  return dogName ? 'miles with ' + dogName : 'miles walked';
}

function heroSub(count, dogName) {
  return 'across ' + count + ' walk' + (count === 1 ? '' : 's')
    + (dogName ? ' together' : '');
}

function emptyHeadline(dogName) {
  return dogName
    ? 'Where will you take ' + dogName + ' first?'
    : 'Start exploring walks to build your story here.';
}

function emptyCtaLabel(dogName) {
  return dogName ? 'Find a walk for ' + dogName + ' →' : 'Find a walk →';
}
```

---

## 11. Phase 3 Hooks

The following are noted for implementation order planning, not designed here:

- **Profile photo:** Avatar tap → device photo picker → base64 stored in `sniffout_dog.photoUrl`. Displayed as `object-fit: cover` in the 40px avatar circle. Placeholder SVG shown until set.
- **Multi-dog switcher:** Tap avatar → inline picker (see Section 8). Requires walk log to gain `dogId` field.
- **Birthday banner:** On the date matching `sniffout_dog.birthday`, the Today tab shows a one-line banner: "Happy birthday, Biscuit! 🎂" Dismissible, shown once per birthday year.
- **Breed-based walk recommendations:** If `sniffout_dog.size === 'small'` or tags include `'elderly'`, surface easier/shorter walks first in the Walks tab. Requires filter logic addition.
- **Account sync:** `sniffout_dog` migrates to a user account record when authentication is added. The field structure is already designed for this — no schema changes needed, just a sync call.
