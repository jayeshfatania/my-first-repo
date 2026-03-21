# Settings UX Recommendation — Me Tab
**Date:** 2026-03-19
**Status:** Decision note

---

## Recommendation: Option 3 — Two separate entry points

Split dog profile and app settings into distinct surfaces. The gear icon opens a settings-only sheet. The dog profile becomes a fifth entry row on the Me tab, opening its own full-screen subpage.

---

## Why not Option 1 (Sectioned sheet)

A sectioned sheet with dividers is a modest improvement over the current state, but it does not fix the underlying problem. Dog profile content and app settings are fundamentally different in nature — one is personal identity, the other is app configuration — and proximity in a single scroll still implies a relationship that does not exist. Users have no reason to expect their dog's birthday to live next to a display mode toggle. Adding a heading labelled "Your dog" above a bottom sheet that opens from a gear icon is a confusing mismatch between metaphor and content. Sectioned sheets also tend to grow: as either surface gains fields, the other gets buried.

## Why not Option 2 (Tabbed sheet)

Tabs in a bottom sheet are not recommended. The pattern introduces a navigation layer inside a surface that was never meant for navigation. On iOS Safari in particular, bottom sheet height management and tab state across sheet dismissals can produce subtle bugs. More fundamentally, the three-tab layout implies parity between sections — Profile, Settings, About feel like equal-weight items — when in practice the dog profile is the most important content on the tab and deserves its own identity. Tabbed sheets also leave users uncertain which tab they were on after a sheet is dismissed and reopened.

## Why Option 3 is correct

**Consistency with the established subpage pattern.** The Me tab is already being built around full-screen overlay subpages for Walk Journal, Badges, Saved Walks, and Saved Places. Adding a fifth subpage — Your Dog — follows exactly the same pattern users have already learned. No new interaction model is introduced.

**The gear icon's scope becomes unambiguous.** In every well-understood mobile context, a gear icon means app-level settings. Restricting it to Display mode and Search radius makes it immediately legible. Two controls in a compact sheet — nothing more.

**Dog profile gets appropriate prominence.** A dedicated entry row on the Me tab gives the dog profile a clear location and visual weight that reflects how central it is to the product. The avatar slot in the header reinforces this — tapping it (Phase 3) will naturally lead to the profile subpage.

**Alignment with the Phase 3 roadmap.** The dog profile will gain more fields over time (photo, multiple dogs, activity level). A dedicated subpage has room to grow. A section within a settings sheet does not.

---

## Proposed layout

```
Me tab entry rows (in order):
  Your Dog         →  opens dog profile subpage (full-screen overlay)
  Walk Journal     →  existing
  Badges           →  existing (hidden until earned)
  Saved Walks      →  existing
  Saved Places     →  existing

Gear icon          →  opens settings sheet (compact bottom sheet)
                      Contents: Display mode toggle, Search radius
                      Nothing else.
```

## Settings sheet scope — locked

The settings sheet should contain exactly two controls:

| Control | Values |
|---|---|
| Display mode | Light / Match device / Dark |
| Search radius | 1 mi / 3 mi / 5 mi / 10 mi |

The privacy disclaimer can move to a static footer in the settings sheet, one line, no interaction required.

## Dog profile subpage scope

The dog profile subpage follows the same `.me-subpage` overlay shell used by all other subpages. It replaces the current `meSettingsSheet` dog section. Content carried over unchanged: dog name, breed, size, personality tags, birthday, save button, remove profile link.

---

## What changes in implementation

1. The current `meSettingsSheet` dog section is removed from the settings sheet and moved to a new `subpageDog` overlay.
2. The settings sheet is simplified to Display + Radius only.
3. A new "Your Dog" entry row is added at the top of `.me-entries`, above Walk Journal.
4. The dog avatar in the Me tab header remains non-tappable in the current phase (Phase 3 hook).
5. `renderMeTab()` populates the Your Dog row preview with the active dog's name and breed if set, or "Add your dog" if not.
