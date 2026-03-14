# Sniffout v2 — Pre-Build Validation Report
*Validator review. Documents checked: CLAUDE.md, phase1-build-brief.md, design-spec.md, copy-review.md, mockup.html, po-action-plan.md*
*Date: 2026-03-14*

---

## Status: NOT READY TO BUILD

Two blocker-level conflicts exist between the phase1-build-brief.md and mockup.html that must be resolved by the PO before the Developer starts. A build brief gap regarding the State A weather preview card also needs a PO decision. All other issues are documented below and can be actioned by the Developer using this report as their single reference.

---

## 🔴 Blockers — PO Decision Required Before Build Starts

### B1. CSS token values conflict: build brief vs mockup.html

The phase1-build-brief.md specifies a token set. The mockup.html (the non-negotiable design reference) uses different values for four tokens. These are not subtle differences — they affect every UI element in the app.

| Token | phase1-build-brief.md | mockup.html | Notes |
|-------|----------------------|-------------|-------|
| `--amber` | `#F59E0B` | `#D97706` | Warmer/darker in mockup |
| `--red` | `#EF4444` | `#DC2626` | Deeper red in mockup |
| `--ink` | `#1A1A1A` | `#111827` | Near-black; subtle difference |
| `--ink-2` | `#6B6B6B` | `#6B7280` | Slightly blue-shifted in mockup |
| `--border` | `rgba(0,0,0,0.08)` | `#E5E7EB` | Different format — one alpha, one hex |

The mockup.html also declares two additional tokens not in the build brief:
- `--brand-mid: #2E7D5E` — used for hover/selected states
- `--chip-off: #D1D5DB` — used for unselected chip borders

**PO decision needed:** Which token set is authoritative? If mockup.html is the non-negotiable reference, its values take precedence. If the build brief tokens were a deliberate revision, the build brief takes precedence. These cannot both be correct. The Developer must not be left to choose.

**Recommended resolution:** Confirm mockup.html token values as authoritative (since mockup.html is the signed-off design reference) and update phase1-build-brief.md Section 1 to match. Add `--brand-mid` and `--chip-off` to the token table.

---

### B2. Walk card badge: position and style conflict

The phase1-build-brief.md and mockup.html specify different badge placements and styles.

**Badge position:**
- phase1-build-brief.md Section 7: `"top-left of photo area"`
- mockup.html CSS (line 753): `position: absolute; bottom: 12px; left: 12px` — **bottom-left**
- design-spec.md (Tab 3 wireframe, line 509): also shows badge `bottom-left`

The mockup.html and design-spec.md are aligned with each other. The build brief is the odd one out. Two sources say bottom-left; one says top-left.

**Badge colour/style:**
- phase1-build-brief.md Section 7: three different fill colours depending on badge type (brand-green / grey / amber)
- mockup.html CSS: single style for all badges — `background: rgba(0,0,0,0.55)`, white text, pill shape
- design-spec.md (line 61): describes badge as "White text on a semi-transparent dark pill" — consistent with mockup.html

The visual reference (mockup.html) and the design spec are consistent with each other. The build brief is inconsistent with both on this point.

**PO decision needed:** Is the badge (a) bottom-left, dark semi-transparent pill for all types (as in mockup.html and design-spec.md), or (b) top-left, type-specific colour fills (as in the build brief)? The Developer cannot reconcile these two without a decision.

**Recommended resolution:** Align phase1-build-brief.md Section 7 to match mockup.html — bottom-left position, `rgba(0,0,0,0.55)` background, white text for all badge types.

---

## 🟡 Build Brief Gaps — Developer Would Have to Guess

### G1. State A weather preview card not in the build brief

mockup.html State A (line 1139–1146) includes a second preview card — a weather preview card — directly below the walk preview card:

```
⛅  Live weather + paw safety
    Know before you go
```

This card is shown as a static, non-interactive preview element. The build brief Section 8 (Today Tab — State A) does not mention it at all — it only describes the walk preview card.

A Developer following only the build brief would build State A without this weather preview card. A Developer following mockup.html would include it. The omission is not intentional enough to be safe.

**PO decision needed:** Should the weather preview card be included in Phase 1 State A? It is present in the signed-off mockup.

---

### G2. State A search input expand behaviour not specified in the build brief

mockup.html shows the search input starting hidden, revealed via a smooth CSS expand animation when "or enter a place or postcode" is tapped. The build brief Section 8 mentions the search input and helper text but does not specify that it starts hidden or how the expand works.

design-spec.md (line 254) specifies this explicitly: "Hidden by default, animate open."

The build brief should reference this behaviour so the Developer does not build it as always-visible. **Minor gap but worth noting.** Resolution: add one line to build brief Section 8: "Search input starts hidden; expands with a CSS max-height transition when the secondary link is tapped. See mockup.html for reference."

---

### G3. SVG icon paths not provided in the build brief

The build brief correctly mandates SVG icons in the bottom nav and defers to mockup.html as the design reference. mockup.html (lines 1792–1822) contains the full SVG path data for all five nav icons. The Developer will need to extract these from mockup.html.

This is acceptable given the instruction to use mockup.html as the reference — but it should be made explicit. A Developer who reads only the build brief knows SVGs are required but doesn't know where to find the paths.

**Recommended resolution:** Add to build brief Section 3: "SVG paths for all five nav icons are provided in mockup.html (lines 1792–1822). Use these exactly."

---

## 🟡 Design-Spec Stale Content — Do Not Use

### D1. design-spec.md verdict strings are outdated and must not be used

design-spec.md (Tab 1, lines 325–331) lists six weather verdict strings that bear no relation to the approved copy:

```
"Good walking conditions"
"Good, but breezy"
"Hot day — walk early or late"
"Wet but walkable"
"Avoid the heat today"
"Poor conditions"
```

These are first-draft strings, pre-copy-review. The approved strings are in copy-review.md Section 6 and fully reproduced in phase1-build-brief.md Section 9. Any Developer who reads design-spec.md for verdict string guidance will implement the wrong copy.

**Action for Developer:** For all copy decisions, use phase1-build-brief.md Section 9 only. Do not use copy from design-spec.md.

**Action for PO (optional):** Consider adding a deprecation notice to design-spec.md at the top of the Tab 1 section: *"Copy in this section is superseded by copy-review.md and phase1-build-brief.md Section 9."*

---

### D2. design-spec.md conditions grid includes visibility — removed in po-action-plan.md

design-spec.md (Tab 2 wireframe, line 401) includes a visibility cell in the conditions grid. po-action-plan.md Phase 3 explicitly removes it: "drop visibility; retain temp, feels-like, rain, wind, UV, sunrise/sunset."

This is a Phase 2/3 concern — the conditions grid full redesign is Phase 3. Not a blocker for Phase 1. Noting for Developer awareness.

---

## 🟢 Copy Issues — Build Brief Is Authoritative, Clarifications Below

### C1. Hero headline: trailing period discrepancy

- mockup.html (line 1100): `Discover great walks.` — **with period**
- phase1-build-brief.md Section 8 and 9: `Discover great walks` — **no period**
- copy-review.md Section 3: `Discover great walks` — no period

The build brief and copy-review.md agree. The mockup has a trailing period that should be treated as a typographic detail, not a copy decision. **Use `Discover great walks` (no period) per the build brief.**

---

### C2. Social proof: mockup.html shows outdated text

mockup.html (line 1149): `50+ handpicked UK walks across the UK` — this is an early draft (redundant phrasing: "UK walks across the UK") and it is missing the second and third beats.

Approved string per build brief Section 9: `50+ handpicked UK walks · Works offline · Dog-specific routes`

**Developer must use the build brief string, not the mockup text.** The mockup is the layout reference; the copy-review/build brief is the copy reference.

---

### C3. copy-review.md meta description still ends with "Free, no sign-up."

copy-review.md Section 1 (line 74):
```
Discover 50+ handpicked UK dog walks with live weather checks, paw safety alerts and nearby dog-friendly spots. Free, no sign-up.
```

phase1-build-brief.md Section 9 (approved):
```
Discover 50+ handpicked UK dog walks with live weather checks, paw safety alerts and nearby dog-friendly spots.
```

The build brief drops `Free, no sign-up.` at the end — consistent with the prohibition on these strings. **The build brief version is authoritative.** The Developer must use the build brief version.

---

### C4. copy-review.md onboarding subtitle still contains prohibited strings

copy-review.md Section 5 (line 162):
```
"Curated walks, live weather checks and dog-friendly spots — all free, no sign-up needed."
```

The onboarding overlay is out of scope for Phase 1, so this does not block the current build. However it remains a live conflict in the document. **For Phase 1: no action needed. For future phases: PO should update this string before the onboarding overlay is built.**

---

## ✅ Confirmed Ready

The following are verified consistent across all documents:

**Architecture and scope:**
- ✅ "sniffout-v2.html must be built entirely from scratch" — clearly stated in build brief (top), CLAUDE.md, and po-action-plan.md. Zero ambiguity.
- ✅ "Do not open, reference, or copy from dog-walk-dashboard.html" — stated in build brief Section File, CLAUDE.md, and po-action-plan.md
- ✅ Visual reference: mockup.html and design-spec.md — clearly stated in build brief and CLAUDE.md
- ✅ Five tabs only: Today · Weather · Walks · Nearby · Me — consistent across all documents
- ✅ No Community tab, no onboarding overlay, no new API calls — consistent across all documents

**Design:**
- ✅ Brand colour `#1E4D3A` — consistent across mockup.html, design-spec.md, build brief, CLAUDE.md
- ✅ Background `#F7F5F0` — consistent everywhere
- ✅ Inter font (400/500/600/700) — consistent everywhere
- ✅ Walk card photo area: 180px height — build brief, mockup.html, design-spec.md all agree
- ✅ Card base styles: 16px radius, 1px border, white surface, no glassmorphism — consistent
- ✅ Nav SVG icons (not emoji): build brief and mockup.html consistent; SVG paths in mockup.html
- ✅ Dark mode `body.night` — consistent everywhere
- ✅ State A bottom nav: dimmed, Today tab only active — consistent across mockup.html and build brief

**Copy:**
- ✅ Hero headline: `Discover great walks` — confirmed in copy-review.md, build brief, mockup.html, CLAUDE.md
- ✅ Page title: `Sniffout — Dog walks & weather for the UK` — consistent in mockup.html (line 6), build brief, CLAUDE.md
- ✅ Subline: `Handpicked walks. Live conditions.` — consistent in mockup.html (line 1101), build brief, copy-review.md, CLAUDE.md
- ✅ All 11 weather verdict strings: fully reproduced in build brief Section 9, match copy-review.md Section 6
- ✅ All 8 hazard titles: build brief Section 9 matches copy-review.md Section 7
- ✅ Paw safety copy: build brief Section 9 matches copy-review.md Section 8
- ✅ Rain section summaries: build brief Section 9 matches copy-review.md Section 9
- ✅ Prohibited strings ban ("free", "no sign-up", "no account", "no login"): consistent in build brief Section 10, CLAUDE.md, po-action-plan.md
- ✅ 🐾 emoji reserved for paw safety block only: consistent in build brief, copy-review.md, CLAUDE.md
- ✅ Tab labels (Today · Weather · Walks · Nearby · Me): consistent everywhere
- ✅ Em dashes (`—` not `-` or `–`): noted in build brief, consistent with copy-review.md

**Data:**
- ✅ WALKS_DB v2 schema fields: consistent between build brief Section 6 and CLAUDE.md
- ✅ `icon` field removed from v2 schema: consistent in build brief and CLAUDE.md
- ✅ `isPushchairFriendly` removed: consistent in build brief and CLAUDE.md
- ✅ `imageUrl: ""` as interim value while photos are sourced: consistent in build brief and CLAUDE.md

---

## Summary for PO — Actions Required

| # | Action | Urgency |
|---|--------|---------|
| B1 | Confirm which token set is authoritative: build brief or mockup.html. Update phase1-build-brief.md Section 1 accordingly. | **Blocker** |
| B2 | Confirm badge position (top-left vs bottom-left) and badge style (type-specific colours vs uniform dark pill). Update phase1-build-brief.md Section 7. | **Blocker** |
| G1 | Confirm whether the weather preview card (mockup.html State A) should be built in Phase 1. Add to build brief Section 8 if yes. | **Needed before build** |
| G2 | Add one line to build brief Section 8 specifying search input starts hidden and expands on tap. | Minor — Developer can use mockup.html |
| G3 | Add one line to build brief Section 3 directing Developer to mockup.html lines 1792–1822 for SVG paths. | Minor — Developer can use mockup.html |

Once B1, B2, and G1 are resolved, the documents are ready for the Developer to begin.
