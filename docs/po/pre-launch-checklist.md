# Sniffout — Pre-Launch Checklist

> **Last updated:** 2026-03-18
> **Status key:** ✅ Done · 🔄 In progress · ⬜ Not started · 🔴 Blocked

---

## 1. TECHNICAL

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| T1 | **Google Places API key moved to serverless proxy** | ✅ Done | Developer | Must have | Resolved 19 March 2026. Cloudflare Worker proxy deployed at `places-proxy.sniffout.app`. Referer header added to Worker so Google accepts requests. Key no longer in page source. Place photos also routing through proxy. |
| T2 | Firebase configured with region `europe-west2` (London) | ⬜ Not started | Developer | Must have | Required for UK data residency. Depends on Firebase being provisioned (Phase 3). Region cannot be changed after project creation — set correctly from day one. |
| T3 | All `localStorage` data migration paths tested | ⬜ Not started | Developer | Must have | Keys in scope: `sniffout_session`, `sniffout_active_tab`, `sniffout_favs`, `sniffout_username`, `sniffout_radius`, `sniffout_explored`, `walkReviews`, `recentSearches`. Test upgrade path from any prior v1 data left by early testers. |
| T4 | PWA manifest complete and tested | 🔄 In progress | Developer | Must have | Check `manifest.json`: all icon sizes present (192px, 512px, maskable), `theme_color` matches `#1E4D3A`, `background_color` matches `#F7F5F0`, `start_url` correct, `display: standalone`. Test "Add to Home Screen" on both iOS and Android. |
| T5 | Splash screen verified on iOS | ⬜ Not started | Developer | Must have | iOS Safari does not use the manifest splash — requires `apple-touch-startup-image` meta tags. Verify brand green background renders correctly at all iPhone viewport sizes. |
| T6 | App fully tested on iOS Safari (latest) | ⬜ Not started | Developer / Designer | Must have | iOS Safari is the primary browser for a significant portion of UK mobile users. Test all five tabs, geolocation prompt, dark mode, PWA install flow. |
| T7 | App fully tested on Android Chrome (latest) | ⬜ Not started | Developer / Designer | Must have | Test all five tabs, geolocation, PWA install banner, offline fallback via `sw.js`. |
| T8 | Lighthouse audit — score targets met | ⬜ Not started | Developer | Must have | Target: Performance ≥85, Accessibility ≥90, Best Practices ≥90, SEO ≥90. Run against production URL (`sniffout.app`), not localhost. Address any critical findings before launch. |
| T9 | Zero console errors in production | ⬜ Not started | Developer | Must have | Open DevTools on the deployed `sniffout.app` URL. No red errors permitted. Warnings reviewed and addressed or accepted. |
| T10 | All API endpoints use HTTPS | ✅ Done | Developer | Must have | Open-Meteo, Nominatim, postcodes.io, and Google Places all use HTTPS. Confirm no mixed-content warnings once API key proxy is in place (T1). |
| T11 | Service worker cache strategy validated | ⬜ Not started | Developer | Must have | `sw.js` uses network-first, cache fallback with key `sniffout-v2`. Verify stale cache does not serve old HTML after a deploy. Test offline experience — walks should load from cache, weather should fail gracefully. |
| T12 | Security and penetration test completed | ⬜ Not started | Developer / Owner | Must have | At minimum: OWASP Top 10 review for a client-side app (XSS via any dynamic HTML insertion, exposed API key — see T1, localStorage data exposure). Professional pen test recommended if budget allows. |
| T13 | Desktop "Coming soon" screen verified | ⬜ Not started | Developer | Should have | Viewport ≥768px or non-touch device shows holding screen. Test on common desktop browsers (Chrome, Firefox, Safari). |
| T14 | `sniffout-v2.html` set as production file and `index.html` redirect updated | ✅ Done | Developer | Must have | Resolved 19 March 2026. `manifest.json` `start_url` fixed to `/sniffout-v2.html` — installed PWA no longer shows 404. `index.html` intentionally redirects to `coming-soon.html`; app accessible at `sniffout.app/sniffout-v2.html` direct link only until public launch. |
| T15 | Open Graph / social meta tags added | ⬜ Not started | Developer | Should have | `og:title`, `og:description`, `og:image`, `twitter:card`. Ensures links shared on WhatsApp and social media render correctly — important for word-of-mouth launch. |

---

## 2. LEGAL AND COMPLIANCE

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| L1 | **GDPR compliance confirmed by solicitor** | 🔴 Blocked | Owner / Solicitor | Must have | Owner is currently seeking a solicitor. This is a hard blocker for launch — do not go live with real users before legal sign-off. Key questions: lawful basis for processing location data, retention periods, third-party data processors (Google Places, any future Firebase). |
| L2 | Privacy policy written, reviewed by solicitor, and live on app | 🔴 Blocked | Owner / Solicitor | Must have | Must cover: data collected (location, localStorage, any analytics), legal basis, retention, user rights, third-party processors, contact details. Depends on L1. Must be accessible from within the app (link in "Me" tab or footer). |
| L3 | Terms of service written, reviewed by solicitor, and live on app | 🔴 Blocked | Owner / Solicitor | Must have | Must cover: disclaimer on walk accuracy, limitation of liability for walk conditions, acceptable use. Depends on L1. |
| L4 | NDA reviewed by solicitor (`sniffout-nda.docx`) | 🔴 Blocked | Owner / Solicitor | Must have | NDA to be used with beta testers and any third parties given access to the codebase or data before launch. Solicitor review required before sharing with any party. |
| L5 | Cookie policy — determine if applicable | ⬜ Not started | Owner / Solicitor | Must have | The app uses `localStorage` (not cookies) for state. Determine with solicitor whether `localStorage` triggers UK PECR cookie consent obligations. If analytics are added (see B4), a cookie banner may be required. |
| L6 | Right to erasure (Article 17 GDPR) implemented | ⬜ Not started | Developer | Must have | Currently all data is in `localStorage` only — a "Clear my data" button in the "Me" tab would satisfy erasure for the pre-Firebase launch. Once Firebase is live (Phase 3), server-side deletion must be implemented. |
| L7 | Data residency confirmed — Firebase `europe-west2` | ⬜ Not started | Developer / Owner | Must have | Depends on Firebase provisioning (Phase 3). Document the region in an internal data map to demonstrate compliance. |
| L8 | Age verification — decision documented | ⬜ Not started | Owner / Solicitor | Must have | App does not currently restrict access by age. Confirm with solicitor whether any content or data processing triggers a Children's Code (AADC) obligation. If no, document the decision. If yes, implement appropriate gate. |
| L9 | Walk and venue listing disclaimer in place | ⬜ Not started | Developer / PO | Must have | A short disclaimer on walk accuracy and conditions must appear on walk detail views and venue listings before launch (see also C3 in Content section). Solicitor should approve wording. |
| L10 | Solicitor engaged and timeline confirmed | 🔄 In progress | Owner | Must have | Owner is actively seeking a solicitor. L1–L5 and L8–L9 are all blocked on this. Aim to have solicitor engaged at least 4 weeks before target launch date to allow time for review iterations. |

---

## 3. CONTENT

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| C1 | All 85+ curated walks verified for accuracy | 🔄 In progress | PO / Owner | Must have | Verify: name, location, lat/lon, off-lead status, livestock, stiles, parking, terrain, difficulty, distance, duration. Particular care on `offLead` field — legal exposure if incorrect. Walk count in `WALKS_DB` to be confirmed (CLAUDE.md references 50+ — reconcile with 85+ target). |
| C2 | All walk descriptions reviewed for quality and tone | ⬜ Not started | PO | Must have | Descriptions should match brand voice: clear, confident, dog-centric. No placeholder lorem ipsum. No internal notes left in description fields. |
| C3 | Disclaimer present on all walk and venue listings | ⬜ Not started | Developer / PO | Must have | Short legal disclaimer required on all walk detail cards and venue listings. Solicitor to approve wording (links to L9). |
| C4 | No placeholder content remaining in production build | ⬜ Not started | Developer / PO | Must have | Check: empty `imageUrl` fields render brand-green placeholder (not broken images), no "TODO" strings, no test walk entries, no hardcoded test postcodes. |
| C5 | Walk images sourced or placeholder strategy confirmed | ⬜ Not started | PO / Owner | Should have | `imageUrl` defaults to brand-green placeholder if empty — acceptable for launch if consistent. If real images are used, verify rights/licensing for each. |
| C6 | App store description written (for future native app) | ⬜ Not started | PO | Nice to have | Draft App Store and Google Play descriptions now while positioning is fresh. Not needed for PWA launch but useful for investor conversations and future native submission. |
| C7 | Walk badge assignments reviewed (`Popular`, `Hidden gem`, `New`, `Sniffout Pick`) | ⬜ Not started | PO | Should have | Badges visible to users — ensure they are accurate and consistent. `Sniffout Pick` in particular carries editorial weight. |

---

## 4. DESIGN AND UX

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| D1 | App tested on multiple screen sizes | ⬜ Not started | Designer / Developer | Must have | Test at minimum: iPhone SE (375px), iPhone 14 Pro (393px), iPhone 14 Pro Max (430px), Pixel 7 (412px). Check all five tabs. Use browser DevTools device emulation plus real devices where possible. |
| D2 | Dark mode (`body.night`) tested thoroughly | ⬜ Not started | Designer / Developer | Must have | Dark mode is triggered automatically by weather `isDay` flag — not a user toggle. Test all five tabs, all card types, all modal/panel states, all empty and error states in dark mode. Check contrast ratios. |
| D3 | All empty states implemented and reviewed | ⬜ Not started | Developer / Designer | Must have | Minimum: no walks found (after filter), no nearby venues, no favourites, no recent searches, location permission denied. Empty states must be helpful, not blank screens. |
| D4 | All error states handled gracefully | ⬜ Not started | Developer / Designer | Must have | Minimum: geolocation failure, Google Places API error, weather fetch failure, invalid postcode. No raw error messages or stack traces exposed to users. |
| D5 | Accessibility basics checked | ⬜ Not started | Developer / Designer | Should have | Tap targets ≥44×44px (WCAG 2.5.5 AAA, Apple HIG minimum). Colour contrast ≥4.5:1 for normal text, ≥3:1 for large text. Check `aria-label` on icon-only buttons (bottom nav SVG icons). |
| D6 | Onboarding flow tested end to end | ⬜ Not started | Designer / PO | Must have | First-time user journey: app open → location prompt → weather load → walk results. Test "allow" and "deny" location paths. Verify no dead ends. |
| D7 | Bottom nav icons — filled/outlined states correct on all tabs | ⬜ Not started | Developer / Designer | Should have | Active tab uses filled SVG variant, inactive uses outlined. Verify state is correctly applied on every tab switch and on session restore. |
| D8 | `sniffout-v2.html` visually matches approved `design-spec.md` | ⬜ Not started | Designer / PO | Must have | Walk through `design-spec.md` and `mockup.html` line by line. No glassmorphism, no blur, no translucent surfaces. Brand colour `#1E4D3A`, background `#F7F5F0`, Inter typography only. |

---

## 5. BUSINESS

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| B1 | Domain `sniffout.app` secured and CNAME configured | ✅ Done | Owner | Must have | `CNAME` file present in repo, pointing GitHub Pages to `sniffout.app`. Verify SSL certificate is active and auto-renewing. |
| B2 | Domain `sniffout.co.uk` secured | ⬜ Not started | Owner | Must have | Defensive registration to prevent brand squatting. Redirect `sniffout.co.uk` → `sniffout.app`. |
| B3 | Branding finalised — logo and colour palette confirmed | 🔄 In progress | Owner / Designer | Must have | Brand colour `#1E4D3A` confirmed. Logo asset needed in SVG and PNG (for PWA icons, social media, future app store). Confirm whether a wordmark exists alongside the icon. |
| B4 | Analytics configured (privacy-respecting) | ⬜ Not started | Developer / Owner | Should have | Options: Plausible, Fathom, or self-hosted Umami — all cookieless and GDPR-friendly without consent banner. Avoid Google Analytics UA/GA4 unless consent flow is implemented. Confirm with solicitor (links to L1, L5). |
| B5 | Social media accounts created and handles secured | ⬜ Not started | Owner | Should have | Minimum: Instagram (`@sniffout` or `@sniffoutapp`). Consider TikTok and X/Twitter for reach. Secure handles before launch to prevent squatting — even if accounts are not actively posted to at launch. |
| B6 | Support contact method in place | ⬜ Not started | Owner | Must have | A support email (e.g. `hello@sniffout.app`) must be linked in the app ("Me" tab or footer) before launch. Required for GDPR subject access requests (links to L2). |
| B7 | Monetisation strategy documented | ⬜ Not started | Owner / PO | Should have | Document the intended model (e.g. premium features, sponsored walks, affiliate venue links) for use in investor conversations. Not required for launch but should be written before any funding discussions. |
| B8 | Competitor monitoring set up | ⬜ Not started | Owner / PO | Nice to have | Set up Google Alerts for PlayDogs UK, dog walking apps. Monitor App Store reviews of competitors. Useful input for post-launch roadmap. |

---

## 6. SOFT LAUNCH PREPARATION

| # | Item | Status | Owner | Priority | Notes / Dependencies |
|---|------|--------|-------|----------|----------------------|
| S1 | Beta testers identified | ⬜ Not started | Owner / PO | Must have | Aim for 10–20 testers across a range of locations (London, regional UK), device types (iOS/Android), and dog owner profiles. Prioritise people who will give honest critical feedback. All beta testers must sign NDA (depends on L4). |
| S2 | Beta tester NDA signed before access granted | 🔴 Blocked | Owner | Must have | Depends on solicitor reviewing `sniffout-nda.docx` (L4). No beta access until NDA is cleared. |
| S3 | Feedback collection method in place | ⬜ Not started | Owner / PO | Must have | Options: Tally form (free, GDPR-friendly), direct WhatsApp group, email thread. Keep it lightweight — a simple structured form (What worked? What didn't? What's missing?) is sufficient for soft launch. |
| S4 | Known issues documented | ⬜ Not started | Developer / PO | Must have | Maintain a running list of known bugs and limitations before beta. Share with beta testers so they do not waste time reporting known issues. |
| S5 | Rollback plan documented | ⬜ Not started | Developer / Owner | Must have | Since the app is a single HTML file on GitHub Pages: rollback = revert the commit and push. Document the exact git commands and who has merge access. Confirm GitHub Pages redeploys within expected time (~1 min). |
| S6 | Post-launch monitoring plan in place | ⬜ Not started | Developer / Owner | Should have | Define who checks analytics and error reports, and how often, in the first two weeks post-launch. Even basic (checking analytics dashboard daily) is better than nothing. |
| S7 | Launch communications drafted | ⬜ Not started | Owner / PO | Should have | Draft the launch message for social media, WhatsApp groups, and any dog owner communities (Facebook groups, Reddit r/dogs UK, etc.) before launch day so it can go out immediately. |

---

## Summary — Must-Haves by Owner

| Owner | Open Must-Haves |
|-------|----------------|
| **Owner** | B2 (sniffout.co.uk), B6 (support email), L10 (engage solicitor), S1 (beta testers), S2 (NDA signed) |
| **Solicitor** | L1 (GDPR sign-off), L2 (privacy policy), L3 (ToS), L4 (NDA review), L8 (age verification decision) |
| **Developer** | T1 (API key proxy — critical blocker), T3 (localStorage migration), T4/T5 (PWA manifest + iOS splash), T6/T7 (iOS + Android testing), T8 (Lighthouse audit), T9 (console errors), T11 (service worker), T12 (security review), T14 (index.html redirect), L6 (right to erasure), D3/D4 (empty + error states) |
| **PO** | C1 (walk verification), C2 (description review), C3 (disclaimer copy), D6 (onboarding test), D8 (design spec sign-off) |
| **Designer** | D1 (screen sizes), D2 (dark mode), D5 (accessibility), D7 (nav icons) |

---

## Hard Blockers — Do Not Launch Until Resolved

1. **T1** — Google Places API key is hardcoded. Move to serverless proxy.
2. **L1** — No GDPR sign-off from solicitor.
3. **L2 / L3** — No privacy policy or terms of service.
4. **L4** — NDA not reviewed. No beta access until cleared.
5. **T14** — `index.html` redirect must point to v2 before v2 goes live.
