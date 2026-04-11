# Weather bar chart colour logic - v1 (original)
Saved: April 10 2026
Reason: Replaced with smooth gradient system (v2). The original used hard colour band thresholds. Height and colour were independent signals that could contradict each other - a lighter coloured bar could appear taller than a dark green one because a score of 78 (light green) produces a taller bar than a score of 81 (dark green).

**Validator note:** The brief described a standalone `getBarColour(score)` JS function matching this shape:
```
function getBarColour(score) {
  if (score >= 80) return '#2C4A14';
  if (score >= 60) return '#7CB342';
  ...
}
```
No such named function existed in the file. The actual v1 system used CSS `data-quality` attribute rules combined with inline JS threshold logic. Both components are documented below. Code recovered from git history (commit 3fce551 - the commit immediately before replacement).

---

## Original implementation

### Part 1 - JS threshold logic (inline inside buildWalkWindowCard)

```js
var quality = score >= 80
  ? (item.apparentTemp >= 20 && item.apparentTemp < 22 ? 'great-warm' : 'great')
  : score >= 60 ? 'good' : score >= 40 ? 'fair' : score >= 20 ? 'poor' : 'danger';
var reason = (quality !== 'great' && quality !== 'great-warm') ? getDominantReason(item) : null;

// Bar rendered as:
'<div class="ww-bar" data-quality="' + quality + '" style="height:' + barH + 'px"></div>'
```

### Part 2 - CSS colour rules (resolved via data-quality attribute)

```css
.ww-bar[data-quality="great"]      { background: #2C4A14; }
.ww-bar[data-quality="great-warm"] { background: #5A8A2E; }
.ww-bar[data-quality="good"]       { background: #7CB342; }
.ww-bar[data-quality="fair"]       { background: #E6B44C; }
.ww-bar[data-quality="poor"]       { background: #DDD8CE; }
.ww-bar[data-quality="danger"]     { background: #C0392B; }

/* Dark mode override */
body.night .ww-bar[data-quality="poor"] { background: rgba(255,255,255,0.15); }
```

---

## How it worked

Six hard colour bands (not five as described in the brief - there was a split at score 80 based on apparent temperature):

- Score 80-100, apparent temp 20-22°C: #5A8A2E (mid green - "great-warm" band for awareness)
- Score 80-100, all other temps: #2C4A14 (dark green)
- Score 60-79: #7CB342 (light green)
- Score 40-59: #E6B44C (amber)
- Score 20-39: #DDD8CE (grey)
- Score 0-19: #C0392B (red)

Bar height calculated separately as `Math.max(4, Math.round(score * 0.72))`, min 4px, max 72px.
Colour and height were completely independent - a score of 78 (light green, 56px tall) would appear taller than a score of 81 (dark green, 58px tall) with a lighter colour, contradicting the visual hierarchy.

---

## Why replaced

Two independent signals could contradict each other visually. Owner approved smooth gradient system where colour interpolates directly from score - taller always means richer/darker green.

---

## To reinstate

Replace the v2 `getBarColor(score)` function in `sniffout-v2.html` (PWA, Weather tab) with the CSS + JS system documented above:

1. Restore the six CSS `data-quality` rules to the stylesheet
2. Replace the `getBarColor(score)` call in the bar rendering loop with the quality string logic
3. Restore `data-quality="' + quality + '"` on the bar div

**Website walk template note:** The brief stated the same function exists in `themes/sniffout/layouts/walks/single.html` (website weather cards on individual walk pages). Validator checked - no bar colour function exists in that file. The website walk page weather preview card does not use this colour system. No action needed there.
