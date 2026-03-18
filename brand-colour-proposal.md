# Brand Colour Proposal
**Status:** Options for owner selection before Round 15
**Current brand:** #1E4D3A (forest green)
**Problem:** Too close to Too Good To Go's brand green; combined with the card-based layout, creates unintended brand proximity.

---

## The Constraint

WCAG AA requires 4.5:1 contrast ratio for normal text and 3:1 for large text and UI components. The app background is #F7F5F0 (warm off-white, relative luminance ≈ 0.93). Any proposed brand colour must be dark enough to read cleanly against it. All eight options below clear AA by a comfortable margin — exact ratios should be verified with a contrast checker before implementation.

The brand colour must work across: bottom nav active state, CTA buttons, badge chips and borders, progress bar fill, verdict badge background, season chips, walk name highlights. It will appear at multiple opacity levels (full strength, and tinted at ~rgba(colour, 0.08-0.15) for chip backgrounds).

---

## Option A — Coastal Teal

**Hex: #0D5068**

A deep blue-green sitting firmly in teal territory — clearly distinct from any green, closer to the colour of a cold lake or a stretch of Welsh coast on an overcast morning.

**The feeling:** Fresh air. Water. That specific shade of a moorland reservoir or a slate-roofed estuary village. It signals outdoors without signalling countryside in the same way green does, which gives Sniffout a broader spatial identity — coast walks, urban parks, moorland, not just leafy green lanes.

**Against #F7F5F0:** High contrast (approximately 8:1). The teal reads confidently against the warm off-white and creates a complementary temperature pairing — cool accent on a warm ground — which is more visually sophisticated than the current green-on-warm-white.

**In dark mode:** Dark teal deepens further in night mode and retains legibility well. The tint backgrounds (rgba(13,80,104,0.1)) read as a cool blue-green wash on dark surfaces.

**Risks:** Could read as "water/swimming" brand rather than walking brand if not handled carefully in copywriting. Also shares some territory with health and fitness apps (Calm, Headspace adjacent). Neither is fatal — but worth testing against the audience.

**Too Good To Go difference:** Entirely different hue family. No proximity risk.

---

## Option B — Trail Rust

**Hex: #8A3520**

A deep burnt sienna — the colour of dried bracken, iron-stained rock, autumn mud on a North Yorkshire path. Warm, earthy, and unlike any other walking or food-discovery app.

**The feeling:** Autumn walks. Muddy boots. The orange glow of bracken turning in October. This colour feels used and real — it has the quality of a worn-in wax jacket rather than a brand kit. It would make Sniffout look distinctive in any app drawer.

**Against #F7F5F0:** Approximately 7.5:1 contrast. The warm rust against the warm off-white creates an all-warm palette that reads as cohesive and intentional — not clashing, because both colours share the same warmth temperature.

**In dark mode:** Deep rust is tricky in dark mode — it can appear muddy on very dark surfaces. The tint (rgba(138,53,32,0.1)) reads as a terracotta wash which is attractive in light mode but requires checking in dark mode specifically. Recommend testing the active nav state in night mode before committing.

**Risks:** This is the highest-risk option aesthetically and the highest-reward. Some users may associate rust/orange-red with warnings or errors (Sniffout uses `--amber` and `--red` for hazard states). The developer would need to ensure the brand rust does not visually compete with amber warnings. Careful pairing is essential.

**Too Good To Go difference:** Completely different hue family. Maximum differentiation.

---

## Option C — Moorland Navy

**Hex: #1E3A5C**

A deep, slightly warm navy — the colour of an OS map cover, a waxed cotton jacket, the sky over the Peak District at 5pm in October. Trusted, outdoor-premium, quietly confident.

**The feeling:** Authority and reliability. The colour of well-made outdoor equipment — Ordnance Survey, Barbour, Inov-8. Signals that Sniffout is a serious app made by people who actually walk. It has the quality of something that has been outside in all weathers.

**Against #F7F5F0:** Approximately 10:1 contrast — the strongest pairing of the four original options. The cool navy pops cleanly against the warm off-white background, creating the same temperature-contrast advantage as Option A but with even higher legibility.

**In dark mode:** Navy is excellent in dark mode. Deep blue-navy on a dark surface retains a premium feel and the tinted backgrounds (rgba(30,58,92,0.1)) read as a subtle blue wash that works across both light and dark contexts.

**Risks:** The most conservative option. It will not surprise anyone. The risk is that navy reads as "corporate" or "financial" if the rest of the design is not warm enough to balance it. With the #F7F5F0 background and Inter typography, this risk is manageable — but the product needs to ensure the copywriting and UX remain warm. Also: many outdoor and fitness brands use navy (OS, Garmin, many cycling apps). Less distinctive than Options A or B.

**Too Good To Go difference:** Entirely different hue. No proximity risk.

---

## Option D — Hawthorn Amber

**Hex: #7A5018**

A deep amber-brown — the colour of a hawthorn berry in September, beeswax polish, or the inside of a old-fashioned pub on a cold walk day. Neither orange nor brown — genuinely amber.

**The feeling:** Warmth, natural materials, handcrafted quality. This colour positions Sniffout as local and specific — the kind of app a knowledgeable dog owner would build, not a startup. It has a crafted-in-Britain quality that none of the other options match.

**Against #F7F5F0:** Approximately 8:1 contrast. The warm amber on warm off-white requires careful execution — both colours are in the same temperature family, so the contrast is luminance-based rather than temperature-based. It works, but feels less crisp than Options A or C.

**In dark mode:** Amber darkens well in dark mode. The tint (rgba(122,80,24,0.1)) reads as a warm honey wash — attractive in light mode, but requires testing in dark mode where gold-amber tones can read as stale against very dark backgrounds.

**Risks:** The amber-brown territory overlaps with food brands (it is the colour of craft beer, artisan honey, upscale food markets). May create unintended food-app associations in an era when #F7F5F0 warm-white palettes are common across food delivery and recipe apps. The tinted chip backgrounds may look too "craft bakery" depending on context.

**Too Good To Go difference:** Completely different hue family. Maximum differentiation.

---

## Option E — Conifer Pine

**Hex: #1B5045**

A deep, blue-toned pine green — the colour of a spruce canopy at dusk, dark water in a tarn, or the inside of a dense Forestry Commission wood in the Lake District. Where the current brand colour is warm-forest-green, this reads as cool-evergreen.

**The feeling:** Quiet, dense woodland. Conifer and bracken. This is the green of places dogs actually love — shaded trails, soft-needled ground, cool air under the tree line. It is distinct from the current brand because the blue undertone shifts it away from the classic "forest green" family and into spruce/pine territory.

**Against #F7F5F0:** Approximately 8.5:1 contrast. The cool blue-green creates a crisp, clean pairing against the warm off-white — slightly more sophisticated than the current brand's warm-green-on-warm-white pairing.

**In dark mode:** Blue-toned greens deepen well in dark mode and retain legibility. The tint backgrounds (rgba(27,80,69,0.1)) read as a cool green wash that works cleanly in both light and dark contexts.

**Risks:** Could be mistaken for the current brand colour in low-quality screenshots or side-by-side comparisons without swatch reference. The blue shift is real but subtle. Recommended to show owner a direct side-by-side with #1E4D3A before committing.

**Too Good To Go difference:** More blue-shifted, slightly darker, meaningfully different in character — but owner should verify with a direct swatch comparison.

---

## Option F — Hedgerow Sage

**Hex: #3C6B4A**

A softer, more muted sage-green — the colour of lichen on a drystone wall, sun-bleached nettles in late summer, or the muted green of a wax cotton jacket after years of use. Noticeably lighter and less saturated than any of the other green options.

**The feeling:** Worn-in, natural, unforced. This is green without trying to be green — it feels accidental in the best sense. Against the warm off-white background, it reads as restrained and tactile rather than bold. It would suit an app that wants to feel knowledgeable and unpretentious rather than vivid and branded.

**Against #F7F5F0:** Approximately 5.8:1 contrast — the lightest of all eight options. Clears WCAG AA comfortably for normal text, but the verdict pill and nav active state will read as softer and more muted than bolder options. This is aesthetically intentional but developers should verify legibility on the badge chip tint backgrounds specifically.

**In dark mode:** Sage greens can lose their identity in dark mode — the muted character that makes them attractive in light mode can read as "washed out" on dark surfaces. Recommend testing the chip tint (rgba(60,107,74,0.1)) against the dark surface before committing.

**Risks:** The softer contrast means less visual punch on small elements (condition dots, nav active states). Some users may not register it as clearly active against inactive states. The muted quality is the differentiator, but it requires careful judgment about where additional visual weight is needed (e.g. verdict pill may need a slight weight increase in font or size).

**Too Good To Go difference:** Noticeably lighter and more muted. Same hue family but different character — lower proximity risk than the current brand, but not zero.

---

## Option G — Meadow Green

**Hex: #3B5C2A**

A warm, yellow-shifted grass green — the colour of a cut meadow in July, bracken fronds beginning to turn, or the worn-in green of an Ordnance Survey cover left in a coat pocket for five years. Where the current brand is cool-forest, this is warm-field.

**The feeling:** Open air, sunlit grass, summer walking. The yellow undertone gives it an energy the cooler green options lack — it reads as alive and seasonal rather than evergreen. Against the warm off-white background the warm-on-warm pairing creates a cohesive, natural palette.

**Against #F7F5F0:** Approximately 6.5:1 contrast. Confident legibility across all uses — verdict pill, nav active states, chips and badges all read clearly. The yellow shift means tinted chip backgrounds (rgba(59,92,42,0.1)) have a distinctly warm, slightly yellow-green cast.

**In dark mode:** Warm greens are reasonably well-behaved in dark mode. The tint backgrounds may read as slightly olive in dark contexts, which is not unattractive but should be tested. Consider a slightly more saturated dark-mode variant.

**Risks:** The warmth and yellow-shift of this green places it closer to the "nature/organic food" branding space than the cooler options. It avoids Too Good To Go specifically, but warm olive-greens are common across food, health, and wellness apps. The owner should consider whether the warm-grass quality signals "walking" clearly enough or risks generic "natural brand" territory.

**Too Good To Go difference:** Clearly different hue direction — warm/yellow versus TGTG's cool/neutral forest green. No meaningful proximity risk.

---

## Option H — Moorland Heather

**Hex: #5C3A6C**

A deep heather purple — the exact colour of the North Yorkshire and Peak District moors in late August when the heather is in full bloom. Not violet, not grape, not corporate purple — genuinely the purple of Calluna vulgaris against brown peat and dried bracken.

**The feeling:** The moors at their most dramatic. Expansive open sky, the specific smell of damp heather and peat, the kind of walk that takes all day and leaves mud on the collar. This is a completely different signal from any other option: it says "UK outdoors" without saying "green countryside," which gives Sniffout a more specific and memorable spatial identity.

**Against #F7F5F0:** Approximately 8:1 contrast. The cool purple against the warm off-white creates a strong complementary temperature pairing — arguably the most visually distinctive combination of all eight options. The tinted chip backgrounds (rgba(92,58,108,0.1)) read as a lavender wash, which is unusual for a walking app and may be the differentiator.

**In dark mode:** Deep purples retain legibility well in dark mode and have a premium quality on dark surfaces. The tint backgrounds may need adjustment in dark mode — purple tints on dark surfaces can read as blue.

**Risks:** Purple is the most unexpected choice and carries the highest creative risk. Some users may not immediately associate it with dog walking. It has territory overlap with wellbeing, spirituality, and luxury brands (Hallmark, Cadbury, certain skincare). The heather association is genuine and specific to UK outdoor culture — but it requires confident copywriting and UX to establish the connection clearly. Not recommended if the product direction is cautious or expects a broad non-UK audience.

**Too Good To Go difference:** Maximum hue differentiation. Completely different family. No proximity risk.

---

## Comparison at a Glance

| | Hex | Approx contrast | Feeling | Risk level |
|---|---|---|---|---|
| A — Coastal Teal | #0D5068 | ~8:1 | Fresh, coastal, modern | Low |
| B — Trail Rust | #8A3520 | ~7.5:1 | Earthy, autumnal, distinctive | Medium-high |
| C — Moorland Navy | #1E3A5C | ~10:1 | Trusted, premium, outdoor | Low-medium |
| D — Hawthorn Amber | #7A5018 | ~8:1 | Warm, handcrafted, local | Medium |
| E — Conifer Pine | #1B5045 | ~8.5:1 | Cool evergreen, woodland depth | Low-medium |
| F — Hedgerow Sage | #3C6B4A | ~5.8:1 | Muted, natural, worn-in | Medium |
| G — Meadow Green | #3B5C2A | ~6.5:1 | Warm, summery, open-air | Medium |
| H — Moorland Heather | #5C3A6C | ~8:1 | Dramatic, specific, memorable | High |

---

## Notes on the Green Options (E, F, G)

All three new greens are distinct from the current brand (#1E4D3A) in different ways:

- **E (Conifer Pine)** moves in the blue direction — darker and cooler than TGTG's warm forest green. Most similar to current brand in hue, but meaningfully shifted.
- **F (Hedgerow Sage)** moves toward lighter and more muted — a completely different weight and saturation. Easy to distinguish from any other option.
- **G (Meadow Green)** moves in the warm/yellow direction — clearly warmer and more olive than TGTG's neutral-cool green.

If the owner wants green but wants clear brand differentiation from Too Good To Go, **G (Meadow Green)** has the most distinct character. **F (Hedgerow Sage)** is the most unusual/specific feel. **E (Conifer Pine)** is the most "green but clearly not that green."

---

## Implementation Note for Round 15

Whichever option is selected, only one change is required in the codebase: the `--brand` CSS custom property value in `sniffout-v2.html`. All elements that reference `var(--brand)` will update automatically. The `rgba` tint values used for chip backgrounds and badge borders will need to be updated separately — they are currently hardcoded as `rgba(30, 77, 58, ...)` rather than derived from the variable. The developer should search for these and replace them with the new RGB values.

The dark mode token for `--brand` (if one exists in `body.night`) should also be reviewed — a slightly lighter/more saturated version of the brand colour may be needed in dark mode for legibility on dark surfaces.
