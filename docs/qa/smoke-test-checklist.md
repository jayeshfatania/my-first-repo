# Smoke Test Checklist
Last updated: April 2026

Run through this checklist after every Developer round that touches sniffout-v2.html. It should take approximately 10 minutes. If any item fails, log it as a bug and fix before the next feature round.

---

## How to run

1. Open sniffout.app in a fresh browser session (or incognito)
2. Clear any cached service worker if a recent change might be affected: DevTools > Application > Service Workers > Unregister
3. Work through the checklist in order
4. Mark each item pass or fail with a date

---

## Checklist

### Core navigation

- [ ] Today tab loads without errors
- [ ] Weather tab loads for a known location (try KT2 or current location)
- [ ] Walks tab loads and shows walk cards
- [ ] Nearby tab loads and shows cafes/venues
- [ ] Me tab loads

### Settings

- [ ] Settings cog in Me tab opens settings sheet (NOT dog profile)
- [ ] Dark/light mode toggle switches theme and persists after refresh
- [ ] Units toggle (km/miles) switches ALL distance displays:
  - [ ] Walk cards
  - [ ] Walk detail overlay
  - [ ] Me tab stat card labels AND numbers
  - [ ] Walk log entries
- [ ] Units setting persists after refresh
- [ ] Radius toggle (1/3/5/10 miles) changes Nearby search area

### Walk discovery

- [ ] Sniffout Picks carousel appears on Today tab
- [ ] Hidden Gems carousel appears on Today tab
- [ ] Neither carousel shows duplicate walks
- [ ] Walk card images load (not placeholders for every walk)
- [ ] Tapping a walk card opens the detail overlay
- [ ] Walk detail overlay shows correct distance in current units
- [ ] Heart/save button toggles and persists

### Weather intelligence

- [ ] Weather tab shows current conditions
- [ ] Smart weather bar chart renders with hourly bars
- [ ] Hazard alerts appear when triggered by conditions
- [ ] Walk verdict string shows on Today tab

### Walk logging

- [ ] Log a walk from a walk detail page
- [ ] Walk appears in Me tab walk journal
- [ ] Total km/miles updates in Me tab stats
- [ ] Walks logged count increments

### Dog profile

- [ ] Dog profile accessible from Me tab (name, avatar)
- [ ] Dog profile saves on edit
- [ ] Dog profile persists after refresh

### Firebase / sync (if signed in)

- [ ] Sign in to account
- [ ] Email verification status shows correctly
- [ ] Saved walks sync to cloud
- [ ] Signing out keeps local data

---

## Known regression risks

Things that have broken in past rounds. Always check these.

| Item | First found | What to check |
|------|-------------|---------------|
| Units toggle | April 2026 | Changing km/miles must update walk cards, walk detail overlay, Me tab stats, and walk log entries - not just one surface |
| Settings cog | April 2026 | Settings cog in Me tab must open the settings sheet, not the dog profile sheet |
| Walk card images | March 2026 | Walk cards must load actual images, not placeholders across the board |
| Hidden Gems duplicates | March 2026 | Hidden Gems carousel must not repeat walks already shown in Sniffout Picks |

---

## When something fails

1. Note the item and the symptom
2. Try a hard refresh (Ctrl+Shift+R) to rule out cache
3. Check browser console for errors
4. Log in the kanban as a bug
5. Fix before the next feature round
