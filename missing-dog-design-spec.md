# Sniffout — Missing Dog Alerts Design Spec
*Issued by Designer. March 2026.*
*Stream 2, Phase 2. Design only — no build until backend infrastructure and user density conditions are met.*
*Based on: phase2-team-brief.md, missing-dog-research.md, sniffout-v2.html.*

---

## Scope and Status

This spec covers the complete Missing Dog Alerts feature — all three actors, all surfaces, plus the "coming soon" placeholder card that ships in the current build. The full feature does not ship until Sniffout has backend infrastructure (push subscriptions, phone verification, server-side alert storage) and demonstrable active user density in at least 3–4 UK regions.

**What ships now:** The coming soon placeholder card in the Me tab (§1). No other parts of this spec are buildable against the current static architecture.

**What this spec prepares:** Complete UI/UX ready for immediate implementation once the backend conditions are met.

**Three actors in this feature:**
1. **Reporting owner** — the person whose dog is missing
2. **Nearby user** — a Sniffout user within the alert radius
3. **Owner post-resolution** — the same reporting owner managing and closing their alert

---

## §1 — Coming Soon Placeholder Card (Ships Now)

### Placement

Me tab, below the Favourites section, above Settings.

The Me tab currently has: Stats → Favourites → Sign-in banner → Settings. The missing dog card inserts between Favourites and the sign-in banner.

### Design

```
.missing-coming-soon card
─────────────────────────────────────────────
  [  icon  ]   Missing Dog Alerts        ←  14px / 700 / var(--ink)
               Alert nearby dog walkers  ←  13px / 400 / var(--ink-2)
               when your dog goes            line-height: 1.5
               missing — or help find
               one near you.

               [ Coming soon ]           ←  pill tag (see below)
─────────────────────────────────────────────
```

**CSS — `.missing-coming-soon`:**
```css
.missing-coming-soon {
  margin: 0 16px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  opacity: 0.9;
}
.missing-coming-soon-icon {
  width: 44px;
  height: 44px;
  background: rgba(30,77,58,0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--brand);
}
.missing-coming-soon-body {
  flex: 1;
  min-width: 0;
}
.missing-coming-soon-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}
.missing-coming-soon-desc {
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.5;
  margin-bottom: 10px;
}
.missing-coming-soon-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
  letter-spacing: 0.02em;
}
```

**Icon:** Lucide `search` (not `dog` — Lucide doesn't have a dog icon). The search icon with a location context is appropriate and available. Size: 22px, `color: var(--brand)`.

**Copy:**
- Title: "Missing Dog Alerts"
- Body: "Alert nearby dog walkers when your dog goes missing — or help find one near you."
- Pill: "Coming soon"

Do not reference a timeline. Do not say "coming in Phase 2" or "launching soon." The pill text is simply "Coming soon."

**Dark mode:** Icon background `rgba(130,176,154,0.12)` (per dark-mode-colour-spec.md). All other tokens resolve correctly.

**Non-interactive:** `pointer-events: none` on the entire card. No tap action. No href. It is a communication element, not a navigation element.

---

## §2 — Entry Points (When Feature is Live)

### 2A — Me Tab: Active Entry Point

When the feature is live, the coming soon card is replaced by two states:

**State: No active alert for this user**
Same position in the Me tab. Card becomes fully interactive:
```
  [icon]   Report a missing dog
           Something happen on your walk?
           Post an alert — nearby walkers
           will be notified immediately.

           [ Report missing dog → ]  ←  full-width brand-green button, 40px
```

**State: User has an active alert**
The card shows alert management (see §7).

### 2B — Today Tab (State B): Alert Banner

When there are active missing dog alerts within the user's current radius, a dismissible banner appears at the top of the State B content area — directly below the app header bar, above the weather hero.

This is the primary surface for **nearby users** to discover alerts. Design is in §5.

### 2C — No floating / persistent emergency button

The brief asked whether to use a persistent emergency-style button. Decision: **no**. A persistent floating button adds visual noise to every tab for a feature most users will rarely trigger. The emotional weight of the feature is better served by a dedicated, calm entry point in the Me tab rather than a permanently-visible panic button. When a dog actually goes missing, the user will find the Me tab — especially if they've seen the coming soon card.

---

## §3 — Reporting Flow (Owner Whose Dog is Missing)

The reporting flow is a **5-step full-screen overlay** that slides up from the bottom. It uses the same slide-up animation pattern as the filter sheet but covers the full screen height. Each step is a distinct screen within the same overlay.

The overlay does not use a bottom sheet (65–75% height) because the form content — particularly the map and photo upload — requires full screen real estate.

### Overlay Structure

```html
<div class="alert-overlay" id="missing-dog-overlay">
  <!-- Progress bar -->
  <div class="alert-progress">
    <div class="alert-progress-bar" style="width: {step/5 * 100}%"></div>
  </div>
  <!-- Header -->
  <div class="alert-overlay-header">
    <button class="alert-back-btn">← Back</button>
    <span class="alert-step-label">Step {n} of 5</span>
    <button class="alert-close-btn">✕</button>
  </div>
  <!-- Content area (scrollable) -->
  <div class="alert-overlay-content" id="alert-step-content">
    <!-- Step screens injected here by JS -->
  </div>
</div>
```

**`.alert-overlay` CSS:**
```css
.alert-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 300;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.35s ease;
}
.alert-overlay.open {
  transform: translateY(0);
}
.alert-progress {
  height: 3px;
  background: var(--border);
  flex-shrink: 0;
}
.alert-progress-bar {
  height: 100%;
  background: var(--brand);
  transition: width 0.3s ease;
}
.alert-overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.alert-back-btn {
  font-size: 14px;
  font-weight: 500;
  color: var(--brand);
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  min-width: 60px;
}
.alert-step-label {
  font-size: 12px;
  color: var(--ink-2);
  font-weight: 500;
}
.alert-close-btn {
  font-size: 18px;
  color: var(--ink-2);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  min-width: 60px;
  text-align: right;
}
.alert-overlay-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  -webkit-overflow-scrolling: touch;
}
```

---

### Step 1 — Photo

**Screen headline:** "Add a photo of your dog" (20px / 700 / `var(--ink)`)
**Sub-copy:** "A clear, recent photo is the most important part of your alert. It's the first thing people will see." (14px / 400 / `var(--ink-2)`, margin-bottom 24px)

**Photo upload area:**
```css
.photo-upload-zone {
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 2px dashed var(--border);
  border-radius: 16px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 24px;
}
.photo-upload-zone.has-photo {
  border: none;
  padding: 0;
  overflow: hidden;
}
.photo-upload-zone.has-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}
```

Empty state: Lucide `camera` icon (32px, `var(--ink-2)`) + "Tap to add a photo" (13px / 400 / `var(--ink-2)`) + "Choose from library or take one now" (12px / 400 / `var(--ink-2)`)

When photo is added: full bleed image fills the zone. A small "Change photo" pill overlays at bottom-right (position absolute): `background: rgba(0,0,0,0.55); color: white; 11px/500; border-radius: 20px; padding: 4px 10px`.

**Footer:** "Next" button — disabled (opacity 0.4, pointer-events none) until photo is present. Active: `var(--brand)` background, white text, full width, 48px height, border-radius 12px.

**Validation:** No "Next" without photo. No skip option. Photo is non-negotiable (per non-negotiables list and research finding that breed descriptions alone are insufficient).

---

### Step 2 — Dog Details

**Screen headline:** "Tell us about your dog" (20px / 700)

Form fields, stacked vertically with 16px gap:

**Dog's name** (optional)
- Text input, placeholder: "e.g. Biscuit"
- Label: "Name (optional)"
- This is labelled as optional because some owners may not want the name publicly associated

**Breed**
- Text input, placeholder: "e.g. Golden Retriever, mixed breed"
- Label: "Breed"
- Required — can't proceed without this

**Main colour**
- Text input, placeholder: "e.g. Golden, black and white, tan"
- Label: "Colour / markings"
- Required

**Size**
- Label: "Size"
- Four chip-select buttons in a row: `Small` · `Medium` · `Large` · `Extra large`
- Single-select, one must be chosen
- CSS: `.detail-chip` — same structure as filter sheet chips. Selected state: `background: rgba(30,77,58,0.08); border-color: rgba(30,77,58,0.25); color: var(--brand); font-weight: 600`

**Temperament** (optional)
- Label: "Temperament (optional)"
- Three chips: `Friendly` · `Nervous — may hide` · `Unsure`
- Helps searchers approach safely

**Distinguishing features** (optional)
- Textarea, placeholder: "Any scars, unusual markings, collar colour, harness type..."
- 3 rows, resize: none
- Label: "Distinguishing features (optional)"

**Microchip number** (optional)
- Text input, placeholder: "15-digit number"
- Label: "Microchip number (optional)"
- Note below: "Useful if found by a vet or dog warden"

**Footer:** "Next" button, active when Breed and Colour are filled.

---

### Step 3 — Last Seen

**Screen headline:** "Where and when were they last seen?" (20px / 700)

**When — time selector:**
Label: "How long ago?"
Row of chips: `Under 30 min` · `1–2 hours` · `2–6 hours` · `Earlier today` · `Yesterday`
Single-select required.

**Where — location input:**
Label: "Last seen location"
Sub-label: "This is shown as an approximate area — never a home address." (12px / 400 / `var(--ink-2)`, italic)

Two options presented as styled choice cards:

```
┌─────────────────────────────┐
│ [📍 icon]  Use my current   │  ← primary
│            location         │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [🔍 icon]  Enter a postcode │  ← secondary
│            or place name    │
└─────────────────────────────┘
```

When "Use current location" is selected: map preview renders below showing a Leaflet map with a single pin at the user's location, within a `240px` height container, `border-radius: 12px`, non-interactive. Pin label: approximate area name (from Nominatim reverse geocode, not full address — strip to town/area level only).

When "Enter location" is selected: the search input from the existing app pattern (`.search-input-row`) appears, postcode/place lookup via postcodes.io + Nominatim. On resolve, same map preview renders.

**Privacy note** (below map):
```
.location-privacy-note {
  background: rgba(30,77,58,0.05);
  border: 1px solid rgba(30,77,58,0.12);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.5;
  margin-top: 12px;
}
```
Copy: "We show your dog's last known area — not your home address or exact coordinates. Your privacy is protected."

**Alert radius selector:**
Label: "How far should your alert reach?" (after the map)
Three chips: `2 miles` · `5 miles` (default, pre-selected) · `10 miles`
Note below: "Most lost dogs are found within 1.5 miles of where they went missing."

**Footer:** "Next" — active when a location is set and a time is selected.

---

### Step 4 — Contact Method

**Screen headline:** "How should people contact you?" (20px / 700)
**Sub-copy:** "Your phone number is never shown on your alert." (14px / 400 / `var(--ink-2)`)

**Two option cards (single-select):**

**Option A — In-app messages** (pre-selected, recommended)
```
┌─────────────────────────────────────┐
│ ✓  In-app messages                  │
│    People send you a message        │
│    through Sniffout. Recommended.   │  ← green border, bg tint when selected
└─────────────────────────────────────┘
```

**Option B — Show phone number publicly** (discouraged)
```
┌─────────────────────────────────────┐
│    Show my phone number             │
│    Your number appears on your      │
│    alert. Not recommended.          │  ← warning treatment when selected
└─────────────────────────────────────┘
```

When Option B is selected, an amber warning banner appears below both cards:
```
.contact-warning {
  background: rgba(217,119,6,0.08);
  border: 1px solid rgba(217,119,6,0.2);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--amber);
  line-height: 1.5;
}
```
Copy: "Publishing your phone number can attract unwanted contact. We recommend in-app messages for your safety."

Phone number input appears if Option B is selected: `<input type="tel" placeholder="07xxx xxxxxx">`

**Footer:** "Next" — active when a contact method is chosen.

---

### Step 5 — Review and Verify

**Screen headline:** "Review your alert" (20px / 700)
**Sub-copy:** "This is how your alert will appear to nearby dog walkers." (14px / 400 / `var(--ink-2)`)

**Alert preview card** (visual mock of the actual alert card, non-interactive):
A read-only preview of the alert card design described in §4A, using all submitted data.

**Summary list** below the preview:
Each submitted field shown as a row: icon + label + value. Edit link on each row taps back to that step.
```
[camera]   Photo             Thumbnail + "Change"
[tag]      Breed             Golden Retriever
[palette]  Colour            Golden
[layers]   Size              Large
[clock]    Last seen         2–6 hours ago
[map-pin]  Location          Hampstead Heath area
[radio]    Alert radius      5 miles
[message]  Contact method    In-app messages
```

**Phone Verification section:**
```
.verification-section {
  margin: 24px 0 0;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
}
```
Label: "Verify your phone number to post" (14px / 600 / `var(--ink)`)
Sub-copy: "Required to prevent false alerts. One active alert per number." (13px / 400 / `var(--ink-2)`)

Phone number input + "Send code" button (inline, brand-green).
After sending: 6-digit code input + "Confirm" button.
Verified state: green checkmark + "Number verified" + phone number masked (07xxx xxxxxx).

**Consent checkbox:**
```
<label class="consent-row">
  <input type="checkbox" id="alert-consent">
  <span>I confirm this alert is genuine and my information is accurate.
  I understand that false alerts are a breach of Sniffout's
  <a href="#">Terms of Service</a>.</span>
</label>
```
CSS: checkbox 18px, `accent-color: var(--brand)`, label 12px / 400 / `var(--ink-2)`.

**Footer:** "Post alert" button — disabled until phone is verified AND consent is checked. Active: full-width, 48px, `var(--brand)` background, white 15px/600 text, border-radius 12px.

---

### Step 6 — Confirmation State

Replaces the overlay content (no new navigation, same overlay):

```
        [ 🔔 large icon — bell with check, 64px, var(--brand) ]

        Your alert is live               ← 22px / 700
        Dog walkers within 5 miles are
        being notified.                  ← 15px / 400 / var(--ink-2)

        ─────────────────────────────

        [share icon]  Share your alert   ← brand-green outlined button
                      Extend your reach beyond Sniffout

        ─────────────────────────────

        What happens next?               ← 14px / 600

        [message icon]  You'll get a message if someone spots [name].
        [clock icon]    Your alert stays active for 7 days.
        [check icon]    Mark as found when [name] is home safe.

        ─────────────────────────────

        [ Manage your alert → ]          ← 14px / 500 / var(--brand), text link

        [ Done ]                         ← full-width button, var(--brand), 48px
```

Icon: Lucide `bell` inside a brand-coloured circle (64×64px circle, `background: rgba(30,77,58,0.1)`, icon `var(--brand)`).

"Share your alert" opens native share sheet (`navigator.share`) with a deep link to the alert. Fallback to copy-to-clipboard on browsers without share API.

"Done" dismisses the overlay, navigates to Me tab, shows the active alert management card (§7).

---

## §4 — Alert Card (What Nearby Users See)

### 4A — Full Alert Overlay

The alert card opens as a full-screen overlay (same `.alert-overlay` structure, without the step progress bar).

```
┌───────────────────────────────────────┐
│                              [ ✕ ]   │  ← close button, top-right, 44×44px tap target
│                                       │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │    [dog photo — full width]      │ │  240px height, object-fit: cover,
│  │                                  │ │  border-radius: 0 (full width to edges)
│  │  [ ⚠ MISSING ]                  │ │  ← badge: position absolute, bottom-left
│  └──────────────────────────────────┘ │
│                                       │
│  Biscuit  ·  Golden Retriever        │  20px/700/var(--ink), 16px margin-horizontal
│  Reported 2 hours ago                 │  13px/400/var(--ink-2)
│                                       │
│  ⚠ Community reported · Not          │  12px/400/var(--ink-2), italic
│     verified by Sniffout             │  THIS LINE IS MANDATORY — LEGAL REQUIREMENT
│                                       │
│  ──────────────────────────────────  │
│                                       │
│  DETAILS                              │  11px/600/var(--ink-2) uppercase, section header
│  Colour      Golden                   │  13px rows: label + value
│  Size        Large                    │
│  Last seen   2–6 hours ago            │
│  Temperament Friendly                 │
│  Markings    Red collar, Sniffout tag │
│                                       │
│  ──────────────────────────────────  │
│                                       │
│  LAST KNOWN LOCATION                 │  section header
│  Hampstead Heath area                 │  13px/500/var(--ink)
│  [Leaflet map — 200px height,        │  non-interactive map view,
│   single pin, no address labels]      │  border-radius: 12px
│                                       │
│  ──────────────────────────────────  │
│                                       │
│  [ 👀  I've spotted this dog ]       │  PRIMARY CTA — see §4B
│  [ 🔗  Share this alert ]            │  SECONDARY CTA — see §4C
│                                       │
│  Flag as suspicious ↗                │  12px/400/var(--ink-2), text link, bottom
│                                       │
└───────────────────────────────────────┘
```

**"MISSING" badge:**
```css
.missing-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: #DC2626;  /* var(--red) */
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}
```

**Primary CTA:**
```css
.alert-cta-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  background: var(--brand);
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}
```

**Secondary CTA:**
```css
.alert-cta-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: transparent;
  color: var(--brand);
  font-size: 15px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 20px;
}
```

**Map:** Read-only Leaflet instance, same CDN as the Nearby tab. Custom pin: red circle-dot marker (no complex custom icon). `dragging: false`, `zoomControl: false`, `scrollWheelZoom: false`. Location is the approximate area centre — NOT the exact GPS pin submitted. Street address labels are suppressed by using a simplified tile style (or MapTiler's No Labels style if available). If precise suppression isn't achievable, add a semi-transparent overlay at `z-index: 1000` that masks the bottom address bar with a note: "Approximate location shown for privacy."

**Mandatory disclaimer:** "Community reported · Not verified by Sniffout" — must be visible at the top of the content area, immediately below the name/time. Not at the bottom. Not small print only. 12px italic text is the minimum size; it should not be hidden behind a scroll.

### 4B — "I've Spotted This Dog" Flow

Tapping the primary CTA opens a bottom sheet (65% height) layered on top of the alert overlay.

```
┌──────────────────────────────────┐
│  ── [drag handle] ──             │
│                                  │
│  Where did you spot them?        │  16px/700
│  Drop a pin or use your          │  13px/400/var(--ink-2)
│  current location.               │
│                                  │
│  [Leaflet map — 220px height]    │  interactive, user can drag pin
│   draggable pin, current GPS     │
│   as starting point              │
│                                  │
│  Add a note (optional)           │  label
│  ┌──────────────────────────┐    │
│  │ e.g. heading towards the │    │  textarea, 3 rows, resize: none
│  │ pond, wearing red collar  │    │  14px, var(--ink), var(--surface) bg
│  └──────────────────────────┘    │
│                                  │
│  [ Report sighting ]             │  full-width, var(--brand), 48px
└──────────────────────────────────┘
```

Map: interactive, user can drag the pin to their sighting location. A `locate` button (Lucide `crosshair`, 40×40px, top-right of map, `background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.12)`) snaps the pin to current GPS.

On "Report sighting" tap:
- Sheet closes
- Sighting data sent to backend (sighting pin lat/lon, timestamp, optional note)
- Owner receives in-app notification (backend-triggered)
- Confirmation toast slides in at bottom of screen: "Thank you — the owner has been notified." (Lucide `check` + text, `var(--brand)` text, `var(--surface)` bg, 14px, auto-dismiss after 3 seconds)

### 4C — "Share This Alert" Flow

Uses native `navigator.share` with:
```js
{
  title: 'Missing dog near you — ' + breed,
  text: breed + ' · Last seen ' + area + ' · ' + timeAgo,
  url: 'https://sniffout.app/alert/' + alertId  // deep link, Phase 3
}
```
Fallback (browsers without share API): copy URL to clipboard + toast: "Alert link copied."

### 4D — "Flag as Suspicious" Flow

Tapping "Flag as suspicious" opens a small bottom sheet:

```
┌──────────────────────────────────┐
│  Flag this alert                 │  16px/700
│  Why does this seem suspicious?  │  13px/400/var(--ink-2)
│                                  │
│  [ Doesn't look like a real dog ]│  full-width chip button, 44px
│  [ Photo looks fake or stolen   ]│
│  [ Possible theft scouting      ]│
│  [ Other                        ]│
│                                  │
│  [ Submit flag ] [ Cancel ]      │
└──────────────────────────────────┘
```

On submit: flag routed to moderation email queue. User sees confirmation: "Thanks — we'll review this alert. It remains visible while under review."

---

## §5 — In-App Alert Banner (Today Tab + Walks Tab)

### When it Shows

On Today tab (State B) and Walks tab: when there are 1+ active missing dog alerts within the user's current location radius. Evaluated on tab load and when location updates.

Injected directly below the `.app-header` / tab title bar, above the tab's main content. It pushes content down — it does not overlay.

### Single Alert Banner

```html
<div class="missing-alert-banner" id="missing-banner" onclick="openAlert(alertId)">
  <div class="missing-banner-photo">
    <img src="{photoUrl}" alt="{breed}">
  </div>
  <div class="missing-banner-body">
    <div class="missing-banner-title">Missing dog near you</div>
    <div class="missing-banner-desc">{Breed} · {colour} · {timeAgo}</div>
  </div>
  <div class="missing-banner-actions">
    <span class="missing-banner-cta">See alert →</span>
    <button class="missing-banner-dismiss" onclick="event.stopPropagation(); dismissBanner()">✕</button>
  </div>
</div>
```

**CSS:**
```css
.missing-alert-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 16px 4px;
  padding: 12px 14px;
  background: #FEF3C7;           /* warm amber tint — distinct from walk hazard amber */
  border: 1px solid #FDE68A;
  border-radius: 14px;
  cursor: pointer;
}
body.night .missing-alert-banner {
  background: rgba(253,230,138,0.08);
  border-color: rgba(253,230,138,0.2);
}
.missing-banner-photo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--border);
}
.missing-banner-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.missing-banner-body { flex: 1; min-width: 0; }
.missing-banner-title {
  font-size: 13px;
  font-weight: 700;
  color: #92400E;                 /* deep amber — not var(--amber), kept warm for this context */
  margin-bottom: 2px;
}
body.night .missing-banner-title { color: #FDE68A; }
.missing-banner-desc {
  font-size: 12px;
  color: #78350F;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
body.night .missing-banner-desc { color: rgba(253,230,138,0.7); }
.missing-banner-cta {
  font-size: 12px;
  font-weight: 600;
  color: #92400E;
  white-space: nowrap;
}
body.night .missing-banner-cta { color: #FDE68A; }
.missing-banner-dismiss {
  background: none;
  border: none;
  font-size: 14px;
  color: #78350F;
  padding: 4px;
  cursor: pointer;
  margin-left: 4px;
  flex-shrink: 0;
}
```

**Why amber, not brand green:** Missing dog alerts are urgent community safety content, distinct from Sniffout's walk discovery content. A warm amber differentiates the alert type visually and communicates urgency without using the same colour as the in-app hazard tags (which are `var(--amber)` at a different hex). The warm amber palette (`#FEF3C7`, `#92400E`) is borrowed from standard "caution/alert" design conventions.

### Multiple Alerts Banner

When 2+ alerts exist within radius:
```html
<div class="missing-alert-banner multi" onclick="openAlertList()">
  <div class="missing-banner-multi-photos">
    <!-- 2–3 stacked photo thumbnails, offset by 8px each -->
  </div>
  <div class="missing-banner-body">
    <div class="missing-banner-title">{n} missing dogs near you</div>
    <div class="missing-banner-desc">Tap to see alerts</div>
  </div>
  <div class="missing-banner-actions">
    <span class="missing-banner-cta">See all →</span>
    <button class="missing-banner-dismiss" onclick="event.stopPropagation(); dismissBanner()">✕</button>
  </div>
</div>
```

Stacked photos: 2–3 circular thumbnails (32px each), each offset left by 8px from the previous, z-index stacked. Shows up to 3; remaining count not indicated separately (the title says the count).

### Dismiss Behaviour

- Dismissing the banner sets a session variable: `bannerDismissed = true`
- Banner does not reappear in the same session unless a *new* alert is posted within radius
- If a new alert is posted while dismissed, the banner reappears with the new alert (session dismiss only applies to alerts the user has already seen)

---

## §6 — Alert List Screen (Multiple Alerts)

When user taps a multiple-alert banner, a list sheet opens (same bottom sheet pattern, 80% height):

**Sheet headline:** "{n} missing dogs near you"
**Sub-copy:** "Help find them — tap an alert to see details and report a sighting."

Each alert in a list row:
```
[photo 52×52, border-radius 10px]  [Name · Breed]     14px/600
                                   [Colour · timeAgo]  12px/400/var(--ink-2)
                                   [distance from user] 12px/500/var(--brand)
                                                                              → chevron
```

Separated by `border-bottom: 1px solid var(--border)`. Tapping a row opens the full alert overlay (§4).

---

## §7 — Alert Management (Reporting Owner, Active Alert)

When the reporting user has an active alert, the Me tab "Missing Dog Alerts" section becomes the management card.

### Active Alert Card

```
.alert-manage-card
─────────────────────────────────────────────
  [dog photo — 64×64px, border-radius 10px]

  Biscuit · Missing            ←  14px/700/var(--ink)
  Posted 3 hours ago           ←  12px/400/var(--ink-2)
  Active · 7 days remaining    ←  12px/600/var(--brand)

  ──────────────────────────────

  👁  2 sightings received     ←  13px/500/var(--ink), with Lucide eye icon

  [View sightings map →]       ←  13px/500/var(--brand), text link

  ──────────────────────────────

  [ ✓ My dog has been found ]  ←  primary CTA, var(--brand) bg, white, 44px, full-width
  [ Edit alert ]               ←  secondary, outlined, 40px, var(--ink-2) text
  [ Remove alert ]             ←  text link, 12px/400/var(--red)
─────────────────────────────────────────────
```

**CSS:**
```css
.alert-manage-card {
  margin: 0 16px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}
.alert-manage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.alert-manage-photo {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  background: var(--border);
  flex-shrink: 0;
}
.alert-manage-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}
.alert-manage-meta {
  font-size: 12px;
  color: var(--ink-2);
  margin: 2px 0;
}
.alert-manage-status {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand);
}
.alert-sightings-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid var(--border);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 14px;
}
```

### Sightings Map View

Opens as a full-screen overlay. Shows:
- Leaflet map centred on the last known location
- Red pin: owner's reported "last seen" location
- Green pins: each sighting reported by other users
- Each green pin tappable: shows note + timestamp in a popup

Header: "Sightings for [name]" + close button.
Below map: list of sightings in reverse chronological order (time + note).

### 7-Day Auto-Archive Reminder

At day 6 (24 hours before auto-archive), the Me tab shows a banner above the active alert card:

```
.archive-reminder
  [clock icon]  Your alert expires tomorrow.
  Tap to keep it active or mark [name] as found.

  [ Keep active ]  [ Mark as found ]
```

Both are inline buttons within the banner. "Keep active" resets the 7-day clock. "Mark as found" triggers the resolution flow (§8).

---

## §8 — Resolution Flow

### Triggered By

- Owner taps "My dog has been found" in the management card
- Owner taps "Mark as found" in the archive reminder

### Resolution Confirmation Screen

Full-screen overlay (same pattern):

```
        [ 🎉 large icon — check in circle, 64px, var(--brand) ]

        That's wonderful news           ←  22px/700
        You're about to let everyone    ←  14px/400/var(--ink-2)
        know [name] is safe.

        ──────────────────────────────────

        An in-app notification will be sent to everyone
        who viewed or reported a sighting for your alert.

        ──────────────────────────────────

        [ Yes, [name] is home safe ]    ←  var(--brand) bg, 48px, full-width
        [ Go back ]                     ←  outlined, var(--ink-2), 44px
```

### Post-Resolution

On confirm:
- Alert status changes to "Resolved"
- Push notification / in-app notification sent to all users who reported sightings or opened the alert: **"Great news — [Dog name] has been found safe! Thank you for helping."**
- Management card in Me tab changes to a resolved state (light green tint, "Found — 3 days ago", no further actions)
- Alert becomes read-only to other users (they can still view it but CTAs are replaced with "This dog has been found ✓")
- Resolved alert auto-deletes after 7 days (user sees this stated in the resolved card)

---

## §9 — Push Notification Design

*Push notifications are backend-dependent and do not ship in the current build. This section specifies the notification copy and behaviour for when the infrastructure is in place.*

### Notification: New Alert Near User

**Title:** "Missing dog near you"
**Body:** "[Breed], [colour] — last seen [area name]. Tap to help."
**Icon:** Sniffout app icon
**Action buttons (if supported):** "See alert" · "Dismiss"

### Notification: Sighting Reported (to Owner)

**Title:** "Someone spotted [name]"
**Body:** "A dog walker near [area] reported a sighting. Tap to see where."

### Notification: Alert Resolved (to Searchers)

**Title:** "Good news — [name] has been found!"
**Body:** "Thanks to the Sniffout community, [name] is safe. Your help made a difference."

### Notification: 7-Day Archive Reminder (to Owner)

**Title:** "Your alert expires tomorrow"
**Body:** "Is [name] still missing? Tap to keep your alert active."

### iOS Installation Prompt

Because PWA push notifications on iOS require home screen installation, a nudge is needed. When a user's location is set and there is at least one active alert nearby, if they do not have the PWA installed (detected via `window.matchMedia('(display-mode: standalone)').matches === false`), show a tooltip or banner:

```
.install-nudge {
  margin: 8px 16px 0;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.5;
}
```
Copy: "Add Sniffout to your home screen to receive missing dog alerts near you." + a "How to install →" link that opens a simple instruction sheet.

---

## §10 — Data Model

*For Developer and backend design reference. No localStorage implementation — this requires a database.*

### Alert Object

```
{
  id:             string (UUID),
  status:         "active" | "resolved" | "archived",
  createdAt:      timestamp,
  expiresAt:      timestamp (createdAt + 7 days),
  resolvedAt:     timestamp | null,

  // Dog information
  photo:          string (storage URL — photo is required, never null),
  dogName:        string | null (optional),
  breed:          string,
  colour:         string,
  size:           "small" | "medium" | "large" | "xlarge",
  temperament:    "friendly" | "nervous" | "unsure" | null,
  features:       string | null (free text, optional),
  microchip:      string | null (optional),

  // Location (approximate only — never exact GPS)
  lastSeenArea:   string (area name from Nominatim, e.g. "Hampstead Heath"),
  lastSeenLat:    number (snapped to nearest 0.01° = ~700m precision),
  lastSeenLon:    number (snapped to nearest 0.01°),
  lastSeenTime:   "under_30min" | "1_2hr" | "2_6hr" | "earlier_today" | "yesterday",
  alertRadius:    2 | 5 | 10 (miles),

  // Contact
  contactMethod:  "inapp" | "phone",
  // Phone number stored server-side only, never in alert object returned to client
  // In-app contact: all messages go to owner's verified phone via server relay

  // Verification
  phoneVerified:  boolean,
  phoneHash:      string (hashed, server-side only — never returned to client),

  // Moderation
  flagCount:      number,
  flagReasons:    string[],
  moderationStatus: "clean" | "under_review" | "removed",

  // Sightings
  sightings: [
    {
      id:        string,
      lat:       number,
      lon:       number,
      note:      string | null,
      timestamp: timestamp,
      // No user identity stored — anonymous sightings
    }
  ]
}
```

**Location precision note:** `lastSeenLat/Lon` is snapped to 0.01° precision (~700m). The exact GPS pin submitted by the owner is never stored in the returned alert object. The backend retains the precise location for abuse review purposes only, access-controlled.

---

## §11 — GDPR / Privacy Spec

| Data point | Stored | Displayed | Retention |
|------------|--------|-----------|-----------|
| Dog photo | Yes (cloud storage) | Yes — publicly on alert | Deleted 7 days after resolution or archive |
| Dog name | Yes | Yes (if provided) | Same as alert |
| Breed, colour, size | Yes | Yes | Same as alert |
| Last seen location (precise) | Server-side only | Never | Deleted at alert close |
| Last seen location (approximate, 700m precision) | Yes | Yes — on map and in text | Same as alert |
| Owner phone number | Server-side only, hashed | Never | Deleted at account deletion |
| Sighting pin locations | Yes | Yes — visible to owner only | Deleted with alert |
| Sighting notes | Yes | Yes — visible to owner only | Deleted with alert |
| Reporter identity | Not stored | Never | N/A |

**Consent:** Explicit checkbox consent at Step 5 (Review) before posting. Consent record stored server-side. Links to Sniffout's Privacy Policy and the specific Missing Dog Alerts data processing notice.

**Data subject rights:** Owner can delete their own alert and all associated data at any time via the "Remove alert" action in the management card. Deletion is immediate.

**Age:** No age gate is currently specced. If Sniffout adds user accounts for Phase 2b, the account's terms of service must cover this.

---

## §12 — Safeguarding Spec

Confirmation that all non-negotiables from the Phase 2 brief are met in this design:

| Non-negotiable | Where addressed in design |
|----------------|--------------------------|
| Phone number verification required before posting | Step 5 — no "Post alert" action until phone verified. Verification gated in UI (disabled button). |
| One active alert per verified phone number | Enforced at backend (phone hash check). If user already has an active alert, Step 5 shows: "You already have an active missing dog alert. Manage it in the Me tab." CTA button replaced with "Manage alert →". |
| Last seen location shown as approximate area only — never home address | Step 3 copy explicit ("approximate area only"); data model snaps to 0.01° (~700m); Nominatim area name used, not street address; map in alert overlay uses no street label tiles |
| Owner contact mediated through in-app messaging | Step 4 defaults to in-app messages; phone number option carries explicit warning; phone number never returned in API response to clients |
| "Community reported — not verified by Sniffout" on all alert cards | §4A specifies this is mandatory, positioned at the top of the content area, minimum 12px, not hidden behind scroll |
| Photo required to post | Step 1 enforces this — "Next" is disabled until photo is present, no skip option exists |

**False alert deterrents (beyond non-negotiables):**
- Phone verification (one per number) prevents mass fake alerts
- Consent checkbox with Terms of Service reference creates explicit acknowledgement
- Flag as suspicious (§4D) routes to moderation queue
- Auto-archive at 7 days limits the lifespan of any false alert

---

## §13 — CSS Class Index

New classes required across all surfaces of this feature:

| Class | Surface | Description |
|-------|---------|-------------|
| `.missing-coming-soon` | Me tab | Coming soon card container |
| `.missing-coming-soon-icon` | Me tab | Icon block in coming soon card |
| `.missing-coming-soon-title` | Me tab | Card title |
| `.missing-coming-soon-desc` | Me tab | Card body text |
| `.missing-coming-soon-pill` | Me tab | "Coming soon" pill |
| `.missing-alert-banner` | Today / Walks | Alert notification banner |
| `.missing-banner-photo` | Banner | Thumbnail in banner |
| `.missing-banner-title` | Banner | Alert headline |
| `.missing-banner-desc` | Banner | Breed/time descriptor |
| `.missing-banner-cta` | Banner | "See alert →" text link |
| `.missing-banner-dismiss` | Banner | ✕ dismiss button |
| `.alert-overlay` | Report / View | Full-screen overlay base |
| `.alert-overlay.open` | Report / View | Slide-up active state |
| `.alert-progress` | Report form | Progress bar track |
| `.alert-progress-bar` | Report form | Progress bar fill |
| `.alert-overlay-header` | Report form | Step header with back/close |
| `.alert-back-btn` | Report form | Back navigation |
| `.alert-step-label` | Report form | "Step N of 5" label |
| `.alert-close-btn` | Report form | ✕ close button |
| `.alert-overlay-content` | Report form | Scrollable content area |
| `.photo-upload-zone` | Step 1 | Photo upload tap area |
| `.photo-upload-zone.has-photo` | Step 1 | Filled photo state |
| `.detail-chip` | Step 2 | Size / temperament selectors |
| `.location-privacy-note` | Step 3 | Location privacy explanation |
| `.contact-warning` | Step 4 | Phone number warning |
| `.verification-section` | Step 5 | Phone verification block |
| `.consent-row` | Step 5 | Consent checkbox row |
| `.missing-badge` | Alert card | "MISSING" red label |
| `.alert-cta-primary` | Alert card | "I've spotted this dog" |
| `.alert-cta-secondary` | Alert card | "Share this alert" |
| `.alert-manage-card` | Me tab | Active alert management |
| `.alert-manage-header` | Me tab | Photo + name + status row |
| `.alert-manage-photo` | Me tab | Dog photo in management |
| `.alert-manage-name` | Me tab | Dog name in management |
| `.alert-manage-meta` | Me tab | Time/meta in management |
| `.alert-manage-status` | Me tab | Active status indicator |
| `.alert-sightings-row` | Me tab | Sightings count row |
| `.archive-reminder` | Me tab | 7-day expiry nudge |
| `.install-nudge` | Today tab | iOS install prompt for push |

---

## §14 — What Ships Now vs Later

| Element | Ships when |
|---------|-----------|
| Coming soon placeholder card (§1) | **Now — current static build** |
| Everything else | Post-POC, when backend + user density conditions met |

The coming soon card requires: one new `me-section` block in the Me tab HTML, a small CSS block, and no JavaScript. It is the only element of this spec that is buildable in the current architecture.
