# Sniffout v2 — Designer Review Brief (Round 1)
*Issued by Product Owner. March 2026. For Designer use only.*

---

## Context

sniffout-v2.html has been built from scratch and has passed the Phase 1 validation report. All Phase 1 fixes are complete. Before the app progresses to Phase 2, the owner has requested a Designer visual consistency review across the rebuilt file — specifically the Walks tab and Nearby tab, where new card types, image treatments, and section layouts have been added during the fix sprint.

This is a **review and feedback brief**, not a redesign. The task is to assess sniffout-v2.html against the approved design spec (mockup.html and design-spec.md) and flag inconsistencies. Any issues should be documented as specific, actionable feedback for the Developer to address.

---

## What to Review

### 1. Card style consistency

sniffout-v2.html now has multiple card types:
- **Walk cards (Community Trails)** — carousel cards in the Walks tab, introduced in Phase 1 fix sprint
- **Green space cards** — compact list cards below Community Trails
- **Venue cards (Nearby tab)** — place cards with category chips; venue photos now being added (FIX 4.2)
- **State A preview cards** — brand-green tinted walk/weather teaser cards on Today tab

All cards across the app should follow the approved base style from phase1-build-brief.md:
- `border-radius: 16px`
- `border: 1px solid var(--border)`
- `background: var(--surface)` on `var(--bg)` page background

**Review question:** Are all card types visually consistent with each other and with the base card style? Are border radii, border colours, background colours, and shadow/elevation treatment uniform across card types?

---

### 2. Community Trails carousel cards (Walks tab)

These are new cards added during the fix sprint and have not been through a design review. They display:
- Brand-green photo placeholder (or image if available)
- Walk name
- Star rating + review count
- Duration and distance
- Off-lead and terrain tag chips

**Review questions:**
- Are the carousel cards consistent with the approved walk card spec in phase1-build-brief.md (Section 7)?
- Photo area: 180px height, brand-green `#1E4D3A` fallback, no emoji/icon — is this implemented correctly?
- Badge pill: bottom-left, `rgba(0,0,0,0.55)` dark pill, white text — present and correctly positioned?
- Heart icon: top-right of photo area, white circular background — present?
- Tag chips: correct inactive state (`var(--chip-off)` border, `var(--ink-2)` text) — consistent with Nearby tab chips and filter chips?
- Does the carousel scroll behaviour work cleanly on mobile (375px viewport)?

---

### 3. Green space cards (Walks tab secondary section)

These are compact list cards introduced in FIX 1.3 — smaller and less detailed than Community Trails cards. The brief specifies they should be visually subordinate: smaller cards, less detail, no star rating.

**Review questions:**
- Is the visual hierarchy between Community Trails and Nearby Green Spaces clearly communicated? A user should immediately understand which section is the premium content.
- Are the green space cards appropriately smaller/simpler than walk cards without looking broken or unfinished?
- Is the section label "Other nearby green spaces" (FIX 4.1) using the correct typography treatment (consistent with other section labels in the app)?

---

### 4. Venue cards (Nearby tab)

Venue cards are getting image support added (FIX 4.2 — developer implementing). Once images are in, review the card treatment:

**Review questions:**
- Does the image area on venue cards follow the same visual language as walk card photo areas (similar height, brand-green fallback, no broken image state)?
- Are venue card category chips consistent in style with walk card tag chips and other chips across the app?
- Is spacing inside venue cards consistent with spacing inside walk cards (padding, gap between image and card body)?

*Note: If FIX 4.2 is not yet implemented when this review begins, review card layout and flag the image treatment as pending.*

---

### 5. Section labels and typography

The fix sprint introduced several new section labels:
- "Community Trails" (or "Recommended Trails") — Walks tab primary section
- "Other nearby green spaces" — Walks tab secondary section
- Location context header: "Within Xkm of [place]" — Walks tab

**Review questions:**
- Are section labels visually consistent with each other and with existing section labels elsewhere in the app (e.g. on the Weather tab, Me tab)?
- Font weight, size, and colour: section labels should use a consistent treatment throughout. The approved token set uses `var(--ink)` for primary text and `var(--ink-2)` for secondary/supporting text.
- Is the location context header ("Within 5km of Kingston") visually distinct from section labels without conflicting with them?
- Is the radius filter icon (funnel SVG) correctly sized and positioned next to the location context header?

---

### 6. Spacing and layout consistency

**Review questions:**
- Is the vertical rhythm consistent between sections on the Walks tab and Nearby tab? Section spacing, card gap, and inner padding should feel uniform.
- Does the Walks tab layout feel correctly weighted — Community Trails as primary, green spaces as secondary? Or does it feel like two equally weighted sections?
- On the Nearby tab, does the category chip row (pub / café / park / etc.) maintain consistent spacing with the venue list below it?

---

### 7. Dark mode (`body.night`)

FIX 3.1 added `--brand: #6EE7B7` to the dark mode CSS block. Verify this is working correctly across all brand-coloured elements.

**Review questions:**
- Primary CTA button: visible and readable in dark mode with the new light teal?
- Active nav label: correct colour in dark mode?
- Active filter chips and radius chips: light teal fill in dark mode?
- Preview card brand-green tint (`rgba(30,77,58,0.06)`): how does this look in dark mode? The tint is based on the dark green — it may read differently on a dark background. Flag if it needs an adjusted value for `body.night`.

---

## What This Review Is Not

- Do not redesign cards, sections, or layouts — flag issues for the Developer to fix
- Do not change the CSS token system — it is approved and fixed
- Do not change copy — all copy strings are approved and confirmed in phase1-build-brief.md
- Do not add new features or sections — scope is review and flagging only
- Do not reference `dog-walk-dashboard.html` — the design reference is mockup.html and design-spec.md only

---

## Output Required

Produce a file called **`design-review-round1.md`** in this folder.

For each issue found, document:
1. **Location** — which tab, which section, which element
2. **Issue** — what is wrong or inconsistent
3. **Reference** — what it should look like (cite mockup.html line number or design-spec.md section)
4. **Recommended fix** — specific, actionable instruction for the Developer

If an element passes, note it as passing — the Developer and PO need to know what has been reviewed and confirmed correct, not just what is broken.

Format the report as a flat list of items, grouped by tab.
