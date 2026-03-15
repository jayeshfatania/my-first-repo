# Sniffout v2 — Owner Feedback Round 2
*Received: March 2026. Recorded verbatim with PO notes and decisions.*

---

## How to use this document

This is the permanent record of the owner's second round of feedback on sniffout-v2.html. Each item is recorded as given, followed by the PO's interpretation and the action taken in phase1-fix-brief.md.

---

## Nearby / Places Tab

**Owner feedback:**
> The Developer copied categories from the original but the results are still not accurate enough. The original POC returned more accurate dog-friendly results than v2. The Developer must do a deeper review of the Places logic in dog-walk-dashboard.html — specifically how venues are queried, filtered and displayed. Goal: match the accuracy of the original POC for Places results. Add a small disclaimer reminding users to call ahead or check official sources to confirm dogs are allowed. Logic reference from original only — no design, CSS or structure.

**PO note:** The previous fix (FIX 1.5) directed the Developer to review category filters. That was insufficient — the issue is in how venues are queried and post-processed, not just what categories are requested. The fix has been escalated to a full deep review of query logic, filter approach, and display logic. The disclaimer is a product/legal protection measure and is non-negotiable — it must appear on the Nearby tab.

**Action:** FIX 1.5 updated in phase1-fix-brief.md. Disclaimer wording specified and required.

---

## Walks Tab — User Story

**Owner feedback:**
> The following is the confirmed specification for the Walks tab:
>
> 1. Header and Location Context — display current search location and radius e.g. "Within 5km of Kingston". Radius adjustable via a filter icon in the header.
>
> 2. Primary Section — Curated Community Trails (top). Horizontal carousel or high-impact list. Labelled "Community Picks" or "Recommended Trails". Each card shows: star rating, duration/length, quick tags (Off-Lead, Enclosed etc).
>
> 3. Secondary Section — Nearby Green Spaces (bottom). Vertical scrollable list or grid labelled "Nearby Green Spaces". Visually distinct from Community Trails — smaller cards, less detail. Clear visual hierarchy so Community Trails take priority.
>
> 4. Empty State. If no Community Trails found: show "No community trails here yet — be the first to add one!". Still show Google green spaces below even if no curated walks found.

**PO note:** This replaces the previous Walks tab spec in FIX 1.3. This is owner-confirmed and non-negotiable.

One schema note: the owner mentions "Enclosed" as a quick tag. The current WALKS_DB v2 schema does not include an `enclosed` field. For now, the Developer should render available tags from the schema (`offLead`, `terrain`). If "Enclosed" needs to be a dedicated field, it requires PO sign-off on a schema addition — raise as a question rather than adding it unilaterally.

The "be the first to add one!" empty state copy implies future community submission capability. This does not need to be wired up now — the empty state text is forward-looking and acceptable as-is for the POC phase.

**Action:** FIX 1.3 fully rewritten in phase1-fix-brief.md to reflect this user story.

---

## Today Tab

**Owner feedback:**
> Remove "Live weather + paw safety" wording. Replace with "Live weather" and something more generic about safety. Add an info button that opens a modal explaining what the user should expect to see — for example they will see cautions if weather is extreme to help plan walks and take precautions. Search bar placeholder text should read: "Enter place name or postcode".

**PO note:** The wording "paw safety" in the preview card sets an expectation that the feature is always active. Per FIX 2.1, paw safety only shows on extreme days. The preview card copy must be corrected to match this. The info modal is a good UX decision — it explains the conditional nature of the safety features and reduces confusion without cluttering the UI. Modal copy has been drafted in FIX 2.5.

**Action:** Added as FIX 2.5 in phase1-fix-brief.md.

---

## Places Tab

**Owner feedback:**
> Review and match the retrieval logic from dog-walk-dashboard.html. Add disclaimer: remind users to call ahead or check official sources to confirm dogs are allowed and opening times etc. This is to ensure that if info is out of date or wrong for some reason, we can cover our back.

**PO note:** The "Nearby" tab and "Places" tab are the same tab in v2. This feedback is the same tab as the Nearby/Places feedback above — both items have been consolidated into FIX 1.5 rather than creating a separate fix. The disclaimer covers both the accuracy concern (wrong dog-friendly designation) and the opening times concern (outdated data).

**Action:** Consolidated into FIX 1.5. Disclaimer wording covers dogs allowed + opening times per this feedback.

---

## Summary of Actions

| Feedback item | Action | Fix reference |
|---------------|--------|---------------|
| Nearby tab: deeper review for dog-friendly accuracy | FIX 1.5 escalated | phase1-fix-brief.md |
| Nearby tab: disclaimer about calling ahead | Disclaimer added to FIX 1.5 | phase1-fix-brief.md |
| Walks tab: full layout user story (non-negotiable) | FIX 1.3 fully rewritten | phase1-fix-brief.md |
| Today tab: remove "paw safety" from preview card | FIX 2.5 added | phase1-fix-brief.md |
| Today tab: info modal on weather card | FIX 2.5 added | phase1-fix-brief.md |
| Today tab: search placeholder text | FIX 2.5 added | phase1-fix-brief.md |
| Places tab: deeper review + disclaimer | Consolidated into FIX 1.5 | phase1-fix-brief.md |

---

## Open Question for Developer to Flag

**"Enclosed" tag on Walks tab cards:** The owner's user story lists "Off-Lead, Enclosed etc" as quick tag examples. The current WALKS_DB v2 schema does not include an `enclosed` boolean field. The Developer should:
1. Render available tags from existing schema fields for now
2. Flag this to the PO as a question: should `enclosed: boolean` be added to the WALKS_DB schema?

This is not a blocker — but it should not be added without PO sign-off.
