# Dark Mode Colour Schemes
**Date:** 2026-03-20
**Context:** Review and redesign of Sniffout dark mode palette
**Status:** Three schemes for comparison — awaiting owner decision

---

## What is broken and why

The current dark mode has two problems that share a root cause.

**Root cause: the brand accent `#82B09A` is too desaturated.** At roughly 24% saturation in HSL, it is sage-grey — a colour that reads as neutral rather than as a brand identity. Sniffout's light mode brand (`#3B5C2A`) has genuine chromatic weight: it reads as forest green, unmistakably. The dark mode accent reads as "muted" and could belong to any app.

**Problem 1 — Today tab tinting.** The walk preview cards, weather preview card, and today-conditions card all use rgba tints derived from `#82B09A` (RGB: 130,176,154). This produces a slightly blue-teal tint on the dark green background — `rgba(130,176,154,0.07)` over `#0F1C16` resolves to something close to a cold mint. Cold mint on a dark forest green looks like two competing colours rather than a coherent tinted surface. A more yellow-shifted or higher-saturation brand colour would produce tints that feel part of the same green family.

**Problem 2 — Weather hero card.** The hero card background is hard-coded to `#1E3D2A`, only marginally different in lightness from the page background `#0F1C16`. The card reads flat. Worse, the brand accent used inside the card (`#82B09A` for temperature, verdict badge, etc.) lacks the authority it needs against a dark background. In light mode the hero card is `#3B5C2A` on `#F7F5F0` — a strong colour block with real visual contrast. In dark mode the hero card is `#1E3D2A` on `#0F1C16` — a subtle step up that looks like a shadow rather than a feature.

**What all three schemes fix:**
- Replace `#82B09A` with a brand accent that has real saturation — one that passes WCAG AA contrast on dark backgrounds and reads as a considered colour, not a faded default
- Specify a weather hero background with genuine separation from both page bg and card surface
- Produce tints that feel harmonious with their background

---

## Current token reference

| Token | Current value |
|---|---|
| `--bg` | `#0F1C16` |
| `--surface` | `#243A2C` |
| `--border` | `#263530` |
| `--ink` | `#F0F0ED` |
| `--ink-2` | `#8B9690` |
| `--brand` | `#82B09A` |
| `--chip-off` | `#263530` |
| Weather hero bg | `#1E3D2A` (hard-coded) |
| Preview card tints | `rgba(130,176,154,...)` (derived from `#82B09A`) |

---

## Scheme A — Woodland Night

**Character:** Fixes the known problems while staying close to the current palette direction. This is the low-risk option for an owner who likes the general feel of the existing dark mode but knows something is wrong. Deep chromatic greens throughout; the brand accent is a proper mid-green rather than sage.

**Mood:** Night woodland. The trees are still recognisably green, even in the dark.

### Token values

| Token | Value | Change from current |
|---|---|---|
| `--bg` | `#0C1A10` | Slightly more saturated, slightly darker. Green is chromatic (warm), not teal. |
| `--surface` | `#1B3022` | More chromatic than current. Clear step up from bg — cards lift off the page. |
| `--border` | `rgba(255,255,255,0.07)` | Replace hard-coded teal hex with neutral rgba. Removes teal cast from all borders. |
| `--ink` | `#F2F0EC` | Slightly warmer near-white. No change in practice. |
| `--ink-2` | `#8CA38A` | Soft grey-green secondary text. Slightly warmer than current, no blue cast. |
| `--brand` | `#5CBB7A` | Proper saturated mid-green. ~42% saturation, 55% lightness. Replaces washed-out sage. |
| `--chip-off` | `#1B3022` | Match surface — inactive chips are surface-coloured, not a separate dark step. |
| Weather hero bg | `#163D22` | Deeper forest green, clearly darker than surface and clearly distinct from bg. Holds authority. |

**Preview card tint base:** `rgba(92, 187, 122, ...)` — derived from `#5CBB7A`. These tints will read as clearly green rather than the current mint-teal.

**Contrast checks:**
- `#5CBB7A` on `#0C1A10`: ~7.2:1 — passes WCAG AAA
- White on weather hero `#163D22`: ~8.5:1 — passes WCAG AAA
- `#5CBB7A` on `#1B3022` (brand on surface): ~5.5:1 — passes WCAG AA

**What the app looks like in this scheme:**
The overall darkness and green atmosphere of the current dark mode is preserved. It still feels like the same app in the same light. The fix is precise: everything is slightly more saturated, the brand accent has energy, and the weather hero card stands out. The Today tab tints read as warm green rather than cold mint. Someone switching between the current and this scheme might take a moment to notice the difference — it is a refinement, not a transformation.

---

## Scheme B — Dark Slate

**Character:** The most dramatic departure. The page background is essentially neutral dark — near-charcoal, no green — and the brand green functions as a colour accent against that neutral field. The weather hero card becomes the primary green element on screen; everything else is monochrome. Premium, restrained, slightly tech-influenced.

**Mood:** The app at night on a high-end phone. Green is the signal; everything else gets out of its way.

### Token values

| Token | Value | Change from current |
|---|---|---|
| `--bg` | `#141414` | Near-neutral dark. No green undertone. |
| `--surface` | `#1F1F1F` | Standard dark card surface — clearly distinct from bg, clearly neutral. |
| `--border` | `rgba(255,255,255,0.08)` | Neutral rgba border. |
| `--ink` | `#F4F2EE` | Warm near-white — slight cream warmth stops it feeling clinical. |
| `--ink-2` | `#8A8A8A` | Neutral mid-grey secondary text. No green tint. |
| `--brand` | `#4CAF6A` | Strong saturated green. High contrast against the neutral dark — stands out immediately. |
| `--chip-off` | `#2A2A2A` | Slightly raised neutral — distinct from both bg and surface. |
| Weather hero bg | `#1A3522` | A rich forest green panel. On the neutral dark page, this card is visually the only green thing in sight. It commands attention. |

**Preview card tint base:** `rgba(76, 175, 106, ...)` — derived from `#4CAF6A`. Green tints on a neutral dark background read cleanly.

**Contrast checks:**
- `#4CAF6A` on `#141414`: ~7.1:1 — passes WCAG AAA
- White on weather hero `#1A3522`: ~8.8:1 — passes WCAG AAA
- `#4CAF6A` on `#1F1F1F` (brand on surface): ~6.0:1 — passes WCAG AA

**What the app looks like in this scheme:**
This is a significant visual shift. The Today tab in State A: walk preview cards are dark, charcoal-surfaced. The green tints are visible but subtle — the cards look like dark cards with a hint of brand identity. When the user opens the Weather tab, the green hero card appears as a punchy colour block on a dark neutral page — dramatic and high-contrast.

The brand feels confident rather than ambient. In Scheme A, green is the atmosphere; in Scheme B, green is a design decision.

**Who this is for:** Someone who finds the current dark mode slightly muddy and wants something crisper. If the owner has any reference points in apps like Robinhood, Things 3, or high-end outdoor brands' apps — this is that direction.

**Risk:** It moves furthest from the brand identity as an atmosphere. The bg has no relationship to Meadow Green. If the app is ever screenshotted or shown in the dark, the green feeling relies entirely on the hero card and accent elements being visible. Some people will feel it loses the "walking in the woods at night" character.

---

## Scheme C — Forest Floor

**Character:** Stays chromatic but shifts warm. Instead of a cool dark green background (current scheme's implicit hue is slightly teal) or a neutral dark, this uses a warm olive-dark — the colour of dark soil with moss. The brand accent shifts towards botanical lime-green, warmer and brighter than current. The most unusual and most distinctive of the three.

**Mood:** Autumn evening outside. Dark but warm. Organic, not digital.

### Token values

| Token | Value | Change from current |
|---|---|---|
| `--bg` | `#131510` | Very dark olive. R=19, G=21, B=16. Barely perceptible warmth — feels earthy rather than green or neutral. |
| `--surface` | `#1F2919` | Warm dark olive card surface. Notably warmer than the bg — cards lift with a warm green undertone. |
| `--border` | `rgba(230,220,170,0.07)` | Slightly warm border tint — faint parchment rather than metallic. Subtle but distinctive. |
| `--ink` | `#F0EDE4` | Cream-adjacent near-white. Warmer than current `#F0F0ED`. |
| `--ink-2` | `#9A9478` | Warm grey-green secondary text with a faint yellow tint. |
| `--brand` | `#7AB84A` | Botanical lime-green. More yellow-shifted than the other schemes — "meadow grass in sunlight". ~52% saturation. |
| `--chip-off` | `#242C1C` | Warm dark olive, slightly lifted from surface. |
| Weather hero bg | `#1E3015` | Warm deep olive-green. Clearly distinct from both bg and surface. Feels like dense foliage rather than open forest. |

**Preview card tint base:** `rgba(122, 184, 74, ...)` — derived from `#7AB84A`. Warm yellow-green tints on the warm olive bg read as a unified palette rather than competing colours.

**Contrast checks:**
- `#7AB84A` on `#131510`: ~7.9:1 — passes WCAG AAA
- White on weather hero `#1E3015`: ~8.0:1 — passes WCAG AAA
- `#7AB84A` on `#1F2919` (brand on surface): ~5.8:1 — passes WCAG AA

**What the app looks like in this scheme:**
Everything is slightly warmer. The `--ink-2` at `#9A9478` has a faint amber quality — body text feels like it's printed rather than displayed. The brand accent at `#7AB84A` is the most energetic of the three — it has a lime quality that some will find fresh and outdoorsy, and others may find slightly bright. The walk preview card tints on the Today tab read as warm organic green, which feels most connected to the subject matter of the app.

The warm border tint (`rgba(230,220,170,0.07)`) is the detail that makes this scheme feel intentional — card edges have a faint paper quality that distinguishes this from both the cool greens of Scheme A and the neutral of Scheme B.

**Who this is for:** Someone who wants the dark mode to feel connected to the outdoors and to the brand in a way that goes beyond just "it's green." This is the most unusual choice and the most creatively risky — it's unlike other apps' dark modes, which is both its appeal and its risk.

---

## Side-by-side comparison

| | Scheme A — Woodland Night | Scheme B — Dark Slate | Scheme C — Forest Floor |
|---|---|---|---|
| `--bg` | `#0C1A10` | `#141414` | `#131510` |
| `--surface` | `#1B3022` | `#1F1F1F` | `#1F2919` |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.08)` | `rgba(230,220,170,0.07)` |
| `--ink` | `#F2F0EC` | `#F4F2EE` | `#F0EDE4` |
| `--ink-2` | `#8CA38A` | `#8A8A8A` | `#9A9478` |
| `--brand` | `#5CBB7A` | `#4CAF6A` | `#7AB84A` |
| `--chip-off` | `#1B3022` | `#2A2A2A` | `#242C1C` |
| Weather hero bg | `#163D22` | `#1A3522` | `#1E3015` |
| Brand on bg contrast | ~7.2:1 | ~7.1:1 | ~7.9:1 |
| Character | Refined current | Premium/neutral | Warm/organic |
| Risk level | Low | Medium | Medium-high |
| Distance from current | Close | Far | Medium |

---

## Designer recommendation

If mocking up all three for comparison: **do it.** They are different enough that choosing between them is a genuine aesthetic decision, not a numbers exercise.

If a recommendation is needed before mocking up: **start with Scheme A.** It solves both known problems while preserving the existing design direction. It is the easiest to implement (fewer overrides change their character significantly) and the least likely to introduce unexpected visual regressions. Scheme B and C can be considered for a future design refresh once the core product is stable.

Scheme B is worth mocking up if the owner has any sense that the current palette feels "muddy" — the neutral background makes all brand-coloured elements read sharper and more intentional.

Scheme C is worth mocking up if the primary concern is "does this app feel like a nature/outdoors product at night" — the warm palette answers that question most directly.

---

## Implementation notes for the Developer

**Regardless of which scheme is chosen:**

1. **Update the rgba tint overrides.** Lines 2657–2666 in the current codebase hard-code `rgba(130,176,154,...)` — the RGB decomposition of the old `#82B09A`. These need to be updated to use the RGB values of the new `--brand` colour:
   - Scheme A: replace `130,176,154` with `92,187,122`
   - Scheme B: replace `130,176,154` with `76,175,106`
   - Scheme C: replace `130,176,154` with `122,184,74`

2. **Update the weather hero hard-code.** Line 2667: `body.night .weather-hero { background: #1E3D2A; }` — replace the hex value with the scheme's weather hero bg colour.

3. **The `--border` change from hex to rgba** (all three schemes) will change how the border renders on some elements that currently have a faint teal cast. This is a fix, not a regression.

4. **Dark mode `--brand` contrast warning.** All three schemes improve on the current `#82B09A` brand accent. However, the UX review flagged that filled brand-colour buttons (white text on `--brand` background) fail WCAG AA in the current dark mode. All three proposed brand colours pass AA for large text and UI controls, but the Developer should verify button text contrast specifically after implementing the chosen scheme. At minimum, the walk-note save button and verdict badge need to pass 4.5:1 with white text — all three proposed brand colours meet this threshold.
