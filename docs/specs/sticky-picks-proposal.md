# Sniffout — Sticky Sniffout Picks: UX Exploration
*Issued by Designer. March 2026.*
*Stream 3, Phase 2. Recommendation to PO — feeds a developer brief only if recommendation is to proceed.*

---

## The Hypothesis Under Test

> "Anchoring Sniffout Picks while green spaces scroll below would reinforce the hierarchy — curated content first, supplementary content below — at all scroll positions, not just at page load."

Short answer: the hypothesis is sound but the execution most people would reach for (full CSS sticky) creates a worse problem than the one it solves. There is a simpler alternative that achieves the same goal with no layout risk.

---

## Current Layout Audit

The Walks tab scroll stack, top to bottom:

```
#tab-walks  (position: absolute; inset: 0; overflow-y: auto)
│
├── .tab-title-bar          ~44px   "Walks" + filter icon   ← SCROLLS AWAY
│
└── #walks-content
    ├── .walks-location-header   ~36px   "Within 5 km of..."  ← SCROLLS AWAY
    │
    ├── .walks-section           ~378px  "Sniffout Picks"
    │   ├── .walks-section-label          42px   18px/700 heading
    │   └── .trail-carousel               ~336px  240px cards, 180px photo
    │
    └── #gs-section              unbounded   "Other nearby green spaces"
        ├── .walks-section-label-sm           compact heading
        └── #gs-list                          72-80px rows × n
```

**The problem in concrete numbers:**

On a typical iPhone (812px screen, 64px nav = 748px usable viewport):

| Element | Height | Cumulative scroll before off-screen |
|---------|--------|-------------------------------------|
| Tab title bar | ~44px | visible at 0px scroll |
| Location header | ~36px | visible at 0px scroll |
| Sniffout Picks label | ~42px | begins scrolling at 0px |
| Trail carousel | ~336px | fully scrolled away by ~458px of scroll |
| Green spaces section | variable | visible from ~458px scroll |

By the time the user is in the green spaces list, approximately **458px of scroll has occurred** and the entire Picks section is off-screen. On a shorter phone (SE, 667px) it's proportionally more severe.

---

## Option A — Full CSS `position: sticky` on the Picks Section

The obvious approach: add `position: sticky; top: 0; z-index: 10; background: var(--bg)` to `.walks-section:first-child` inside `#walks-content`.

### Does it work technically?

**Partially, with a real reliability caveat.**

`position: sticky` requires the scrolling ancestor to have `overflow-y: auto` (not `overflow: hidden`). `#tab-walks` satisfies this — it has `overflow-y: auto`. So in theory, the Picks section would stick to `top: 0` of the tab panel when it would otherwise scroll off.

The caveat: the CSS currently has `-webkit-overflow-scrolling: touch` on `.tab-panel`. This property is deprecated and ignored in modern Safari, but it exists as a legacy declaration. In WebKit, `overflow-y: auto` + `-webkit-overflow-scrolling: touch` containers have historically had edge cases where sticky children misbehave — the element sticks for some gesture speeds but not others, or fails to un-stick when scrolling back up. Testing on physical device (not just desktop browser) would be essential before shipping. This is not a theoretical risk — it is a documented WebKit quirk that has caught multiple mobile PWA developers.

**Verdict: technically feasible in modern Safari. Needs device testing. Legacy declaration adds risk.**

### Does it feel right?

**No. The height budget kills it.**

The Picks section is approximately **378px tall** — 50.5% of the usable viewport on a standard iPhone. If it sticks at the top while the user browses green spaces, only ~370px remains for the list below. Each green space card is 72–80px. The user sees ~4–5 green space cards at most, with the top half of the screen locked.

This is not a hierarchy reinforcement — it is a content blockade. The user who has deliberately scrolled past Picks into the green spaces list is actively choosing to browse that content. Pinning 50% of the screen to a section they have already seen is working against their intent, not with it.

A full sticky Picks section would likely prompt users to find the filter to hide the Picks entirely, which is the opposite of the goal.

**Verdict: technically possible, UX unacceptable at current card height.**

---

## Option B — Collapsed Sticky Header

A two-state approach: the Picks section is normal when in view, but collapses to a slim label bar when sticky.

```
Normal state (in viewport):
┌──────────────────────────────────┐
│ Sniffout Picks                   │  18px/700
│ [═══════ card carousel ═════════]│  336px
└──────────────────────────────────┘

Collapsed sticky state (scrolled past):
┌──────────────────────────────────┐
│ Sniffout Picks  ↑ scroll up      │  42px bar, brand-green text/icon
└──────────────────────────────────┘
[green spaces scroll normally below]
```

The collapsed bar is just 42px — negligible height cost. The `↑` indicator signals "tap to expand." Tapping either scrolls back to the full Picks section or expands the carousel in-place.

### Technical requirements

1. `IntersectionObserver` watching the `.trail-carousel` element
2. When carousel exits viewport from the top: add `.picks-collapsed` class to the section
3. `.picks-collapsed .trail-carousel { max-height: 0; overflow: hidden; padding: 0; transition: max-height 0.25s ease }` — collapses to 0
4. `.walks-section.picks-collapsed { position: sticky; top: 0; background: var(--bg); z-index: 10 }`
5. Tapping the collapsed bar: `scrollTo({top: 0, behavior: 'smooth'})` to restore

### The problem with this approach

`IntersectionObserver` is clean, but the content in `#walks-content` is **dynamically injected by JavaScript** (both `renderWalksTab` and `renderWalksTabWithResults` write `el.innerHTML = html`). The observer must be attached after the DOM is written, and re-attached whenever the walks are re-rendered (e.g. after filter changes). This is manageable but requires care — if the observer is not cleaned up on re-render, old observers accumulate against detached DOM nodes.

Additionally: the `position: sticky` caveat from Option A still applies to the collapsed state. The element only needs to stick when collapsed (42px), but the same WebKit container behaviour applies.

More fundamentally: the interaction model is unclear. Does tapping the collapsed bar scroll back to the top? Expand the carousel in-place? Both? The behaviour needs a clear spec and the implementation needs testing on Safari.

**Verdict: Better than full sticky, but adds meaningful JS complexity for a behaviour that hasn't been validated as valuable. Not recommended for the current phase.**

---

## Option C — "↑ Picks" Anchor Pill Button *(Recommended)*

No sticky. No layout changes. An `IntersectionObserver` watches the `.trail-carousel`. When it leaves the viewport, a small pill button appears — floating, fixed-position — near the top-right of the Walks tab content area. Tapping it scrolls back to the top of Picks. The pill disappears when Picks are in view.

```
While browsing green spaces:

  ┌─ Walks ─────────────── [filter icon] ─┐
  │                         [ ↑ Picks ]   │  ← pill appears here
  │  Other nearby green spaces            │
  │  ┌─────────────────────────────────┐  │
  │  │ 🌳 Victoria Park     0.4km →   │  │
  │  └─────────────────────────────────┘  │
  │  ...                                  │
```

### Pill design

```css
.picks-anchor-btn {
  position: fixed;
  top: calc(var(--nav-h) + 12px);   /* below the top status area, clear of any nav */
  right: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px 8px 10px;
  background: var(--brand);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  cursor: pointer;
  /* Hidden by default */
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.picks-anchor-btn.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
```

Content: Lucide `arrow-up` icon (14px, white) + "Picks"

Position: `position: fixed` at `top: calc(var(--nav-h) + 12px)` — this places it just below the top edge of the screen, aligned to the right margin. It does not interact with the tab panel's scroll container at all, which eliminates the WebKit sticky reliability concern entirely.

**Wait — `var(--nav-h)` is the bottom nav height, not the top.** Correction: the pill should be positioned relative to the viewport, accounting for the top of the usable area. Since `#app` is `position: fixed; inset: 0` and the tab panel fills the screen area, the pill at `top: 12px; right: 16px` would sit 12px from the top of the screen — within the tab panel's visible area. Adjust to `top: 16px` to give breathing room from the device status bar.

```css
.picks-anchor-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  /* ...rest as above */
}
```

Only render this button when the Walks tab is active (check `#tab-walks.active` or manage with JS visibility toggling). When the user switches tabs, hide the pill.

### JavaScript (minimal)

```js
var picksObserver = null;

function initPicksAnchor() {
  // Clean up any previous observer
  if (picksObserver) { picksObserver.disconnect(); picksObserver = null; }

  var carousel  = document.querySelector('#tab-walks .trail-carousel');
  var anchorBtn = document.getElementById('picks-anchor-btn');
  if (!carousel || !anchorBtn) return;

  picksObserver = new IntersectionObserver(function(entries) {
    var isVisible = entries[0].isIntersecting;
    anchorBtn.classList.toggle('visible', !isVisible);
  }, {
    root:      document.getElementById('tab-walks'),
    threshold: 0  // trigger as soon as carousel edge exits
  });
  picksObserver.observe(carousel);

  anchorBtn.onclick = function() {
    document.getElementById('tab-walks').scrollTo({ top: 0, behavior: 'smooth' });
  };
}
```

`initPicksAnchor()` is called at the end of `renderWalksTab()` and `renderWalksTabWithResults()` — i.e. after the DOM is written — since the `.trail-carousel` is dynamically injected.

**IntersectionObserver `root` note:** The `root` must be the scroll container — `#tab-walks` — not `null` (which would be the viewport). Since `#tab-walks` is `position: absolute` and not the document root, using `null` would give incorrect results. Setting `root: document.getElementById('tab-walks')` correctly observes intersection within the tab's own scroll area.

The anchor button HTML lives in `#tab-walks`, not in `#walks-content`, so it is not wiped when `el.innerHTML = html` re-renders the walk list:

```html
<div id="tab-walks" class="tab-panel">
  <div class="tab-title-bar">...</div>
  <div id="walks-content">...</div>
  <!-- Anchor button lives here, outside walks-content -->
  <button class="picks-anchor-btn" id="picks-anchor-btn" aria-label="Back to Sniffout Picks">
    <!-- Lucide arrow-up icon -->
    Picks
  </button>
</div>
```

### Why this is the right approach

| Concern | Option A (full sticky) | Option B (collapsed sticky) | **Option C (anchor pill)** |
|---------|----------------------|----------------------------|--------------------------|
| Layout impact | 50% viewport occupied | 42px occupied | Zero |
| iOS Safari risk | Moderate (sticky in overflow container) | Moderate (same) | **None** |
| JS complexity | None | Medium (observer + class toggle + re-attach) | **Low (observer + btn toggle)** |
| Works after filter re-render | N/A | Requires careful re-attach | **Yes — btn is outside walks-content** |
| Respects user scroll intent | No — forces Picks visible | Partially | **Yes — passive, optional** |
| Communicates Picks are accessible | Weakly | Yes | **Yes — visible CTA** |
| Implementation time | 10 min | 2–3 hours | **30 min** |

---

## Bonus: Sticky Tab Title Bar

While investigating the sticky question, a simpler win emerged that is independent of the Picks decision.

The tab title bar (`div.tab-title-bar`, containing "Walks" + filter icon) **currently scrolls away** when the user scrolls into the walk list. This means the filter button — the most important action on the tab — also scrolls away. Users who want to change radius or sort order after scrolling have to scroll back to the top.

This is a real UX problem and the fix is trivial:

```css
.tab-title-bar {
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 20;
  /* existing padding/display properties unchanged */
}
```

44px of sticky area. The filter icon is always accessible. The "Walks" heading always provides tab context. No JS required. No height budget concern.

**This is a separate change from the Picks anchor and should ship regardless of which Picks approach is chosen.**

---

## Recommendation

**Implement Option C (anchor pill) + sticky title bar. Do not use `position: sticky` on the Picks section in any form.**

**The sticky Picks section does not solve a real problem.** The problem is: after scrolling into green spaces, the user cannot refer back to Picks without scrolling up. The anchor pill solves this directly and without the downsides.

The sticky approach answers a different question — "can I keep Picks visible at all times?" — and the answer to that question is: at 50% of the viewport, you shouldn't. The curated/supplementary hierarchy is already established by the visual weight of the two card types. What was missing was a way to navigate back. The anchor pill provides that.

**Recommended next step:** Ship the sticky title bar immediately (one CSS addition). For the anchor pill, confirm with the PO that the "navigate back to Picks" behaviour is the goal — if so, proceed to a brief developer ticket.

The question this exploration was asked to answer:

> Is sticky section positioning technically achievable? Does sticky feel right on device? Is there a simpler alternative?

**Answers:**
1. Technically achievable with CSS caveats around `-webkit-overflow-scrolling: touch`. Not fully reliable without device testing.
2. Does not feel right — 50% viewport cost is too high. Collapsed variant is better but requires meaningful JS.
3. Yes — the anchor pill achieves the same navigational goal with ~30 minutes of implementation work, zero layout risk, and zero iOS Safari concerns.

---

## Implementation Summary (if approved)

### Ticket 1: Sticky title bar (5 minutes, ship immediately)
- Add `position: sticky; top: 0; background: var(--bg); z-index: 20` to `.tab-title-bar`
- Applies to all tabs (Today already has a fixed header; Weather, Walks, Nearby, Me all benefit)

### Ticket 2: Picks anchor pill (30 minutes)
- Add `.picks-anchor-btn` button HTML inside `#tab-walks`, outside `#walks-content`
- Add CSS (`.picks-anchor-btn`, `.picks-anchor-btn.visible`)
- Add `initPicksAnchor()` JS function
- Call `initPicksAnchor()` at end of `renderWalksTab()` and `renderWalksTabWithResults()`
- Hide pill when Walks tab is not active (add to `showTab()` logic: when switching away from Walks, call `anchorBtn.classList.remove('visible')` and disconnect observer)
