# Hourly Forecast Layout — Coexistence Recommendations
**Date:** 2026-03-20
**Context:** Both "Today's forecast" (hourly bar) and "Walk window" cards are present on the Weather tab. Owner wants to keep both.

---

## 1. Do they serve distinct enough purposes to justify both?

Yes — but only if their roles are clearly differentiated. Right now, in the mockup, they don't feel differentiated because they're answering the same question in the same vocabulary. Both show quality-by-hour. Both say "Best: 2pm–5pm" in brand green. That's the problem. It isn't that they're the same card — it's that they're currently presented as the same card.

The genuine distinction, which isn't yet expressed in the mockup:

- **The hourly bar is conditions-first.** It shows icons, temperatures, and walk quality as one layer of detail. The user reads it as weather. It covers the remaining hours of today — a running clock view from now until midnight.
- **The Walk Window is quality-first.** It abstracts the weather away and shows a single, continuous signal: the walk quality pattern across the whole day. It answers "when" with directness the hourly bar can't match — one glance at the colour bar and the shape of the day is visible.

The Walk Window's real differentiator is **whole-day scope**. If it shows the full day from 6am to 11pm — not just remaining hours — it becomes something the hourly bar categorically cannot replace. The hourly bar starts at "Now" and runs forward. The Walk Window shows the full arc: this is what the morning was like, this is what the afternoon holds, this is how the evening looks. That is a genuinely different piece of information.

**Recommendation: make the Walk Window's scope explicitly whole-day (6am–midnight), while the hourly bar covers remaining hours only.** This is the single change that most clearly justifies having both.

---

## 2. Can the Walk Window be simplified now that the hourly bar carries the detail?

Significantly, yes. Three specific things can be trimmed:

**Remove the best-window time from the hourly bar header.** "Best: 2pm–5pm" appears in both card headers right now, in the same colour, in the same typographic weight. This is the most jarring redundancy. The best-window time should live in the Walk Window header only — it is the Walk Window's primary output, its reason for existing. Remove it from the hourly bar header entirely. The hourly bar's header becomes just "Today's forecast" with no annotation.

The hierarchy then becomes clean: the Walk Window makes the recommendation ("Best: 2pm–5pm"), the hourly bar provides the evidence (here's what each hour actually looks like).

**Remove or merge the legend.** Both cards currently explain what the colour coding means. The explanation needs to appear once, not twice. Keep the legend in the Walk Window — it's shorter text against a simpler visual, where a single explanatory line reads naturally. Remove the legend footer from the hourly bar card entirely. The walk window nearby covers the concept.

**The Walk Window's rain summary footer.** Keep this — it's the one piece of information the hourly bar doesn't surface at a card level. A brief rain note ("3mm expected between 1pm and 4pm") is specific, practical, and has no equivalent in the hourly bar. This is the Walk Window earning its keep.

After these changes, the Walk Window becomes: full-day colour bar + best window in the header + rain summary footer. Leaner, more focused, and no longer saying anything the hourly bar has already said.

---

## 3. Should the order change?

**Walk Window first, hourly bar second.** Reverse the current mockup order.

The Weather tab's design principle is "verdict first, data second." The hero delivers the verdict for now. The Walk Window delivers the verdict for the day — it's the planning answer, the recommendation. The hourly bar is the supporting evidence behind that recommendation.

Reading order should follow the same logic as the hero: answer first, then show your working. If the user sees "Best: 2pm–5pm" in the Walk Window, they then scroll to the hourly bar to see why — the icons and temperatures and green tints that explain what makes 2pm–5pm good. That is a satisfying and coherent information flow.

If the hourly bar comes first, the user reads the evidence before they've seen the conclusion. That works in some contexts, but for a tool whose explicit purpose is to give confident walk recommendations, leading with the recommendation is more aligned with the product's voice.

**Recommended tab order:**
```
1. Hero (verdict for now)
2. Walk Window (verdict for the day — whole-day scope)
3. Hourly forecast bar (conditions detail for remaining hours)
4. Metric tiles — Rain, Wind, UV, Humidity
5. 5-Day forecast
6. Pollen
```

---

## 4. Other recommendations

**Visual separation between the two cards.** Keep standard 12px card gap between them — do not group them with a smaller gap or shared container. They are separate cards, not a compound component. A shared visual grouping would imply they're one feature split across two views, which would reinforce the redundancy rather than defuse it.

**Different card labels.** "Walk window" and "Today's forecast" are currently close in tone. "Walk window" is distinctive Sniffout product language — it earned its name and should keep it. "Today's forecast" is generic. Once the order changes and the hourly bar's role is explicitly supporting detail, its label could shift to something that acknowledges its relationship to the walk window. "Hour by hour" would work — brief, scannable, and implicitly says "this is the detail behind what's above." Not essential, but worth considering.

**Avoid having both call out the same hazard.** If the rain summary footer in the Walk Window says "3mm expected between 1pm–4pm," and the hourly bar's tinted cards at 1pm–4pm also show amber/red quality signals, that's fine — the two surfaces are showing the same truth in different formats. But if the hourly bar ever gains additional annotation or callouts in the future, be careful not to have the same warning text appear in both cards simultaneously. The Walk Window owns the summary callout; the hourly bar shows the signal visually.
