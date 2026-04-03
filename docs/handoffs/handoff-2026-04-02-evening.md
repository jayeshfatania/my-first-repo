# Sniffout Session Handoff - 2 April 2026 (Evening)

## Session Summary

Massive session covering the full app redesign (all five tabs), website visual consistency pass, and SEO content gap research. The app and website now share a cohesive visual language.

---

## 1. APP REDESIGN - COMPLETE

All five tabs redesigned and implemented across multiple Developer rounds.

### Design Decisions (ALL LOCKED)

- Background: #F4EFE6 (warm linen)
- Bottom nav: #1B3009 (dark forest) with #A8D874 sage green active dot
- Cards: no borders, brand-tinted shadows only (rgba(44,74,20,...))
- Shadow scale: Small 0 1px 6px rgba(44,74,20,0.06), Medium 0 2px 16px rgba(44,74,20,0.07), Large 0 4px 24px rgba(44,74,20,0.12)
- Card radius: 16px cards, 20px larger cards, 28px bottom sheet top corners
- Pills: Style B - solid fill, full round (border-radius 20px), white text. Colours: Easy #2C4A14, Moderate #D4940A, Hard #C0392B
- Typography: Plus Jakarta Sans throughout (no Lora, no serif)
- Walk cards: full-image overlay everywhere (gradient: linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.72) 100%))
- Hover on website: translateY(-2px) not scale - more subtle for content site

### Weather Tab
- Breed sensitivity engine: BREED_SENSITIVITY constant, getBreedGroup(), getActiveDogProfile(), getDogWeatherNotes(), getConditionalAlerts()
- Verdict strip D: gradient quality bar + temp + divider + condition/verdict/sub-text
- Walk window bar chart starting from current hour, wrapping into tomorrow
- Condition tiles: 2-column grid with icons, pill B badges, dog-specific notes
- Weather detail sheets extended to 18-20 hours
- Hourly scroll continuing into next day with day label at midnight
- 5-day forecast with neutral temp range bars + quality pills with words
- Sunrise/sunset: clean data layout (no arc visual)
- Conditional heat/paw burn alerts
- Pollen section with dog-specific notes

### Today Tab
- Walk cards (Sniffout Picks + Hidden Gems) updated to full-image overlay
- Pill B styling applied throughout

### Walks Tab
- Sniffout Picks: horizontal scrolling showcase, tall portrait cards (220x280px)
- Community placeholder card
- Green spaces: compact horizontal list cards
- All existing logic preserved

### Nearby Tab
- Category tiles in 3-column grid (replacing chips)
- Contextual tip card below tiles
- Venue cards: compact horizontal layout

### Me Tab
- Green hero card with dog avatar, name, breed, TWO stats only
- Cog opens dog profile editor
- "This month" card with personal warm note
- Grouped entry rows with coloured icons
- FAB completely untouched

### Visual Consistency Sweep
- All secondary screens updated: bottom sheets, walk detail, Me subpages, settings, filter sheet, modals, wx-sheets

---

## 2. WEBSITE VISUAL REDESIGN - COMPLETE

### Phase 1 - Visual Consistency (DONE)

All changes deployed across multiple Developer rounds:

- --bg CSS variable: #F7F5F0 changed to #F4EFE6
- Card border-radius: 12px changed to 16px everywhere
- Brand-tinted shadows added to all cards (walk cards, guide cards, hero cards)
- Hover lift effect: translateY(-2px) + shadow expansion on all cards
- cursor-pointer on all clickable elements
- Off-lead badge consistency updated

### Homepage
- Featured walks: changed from 2-line grid to horizontal scrolling row
- "Browse all walks" link added inline with "Featured Walks" heading
- Walk cards have brand-tinted shadows

### Walks Index
- Cards aligned with page title and filters (matched guides page layout)
- H1 font-size: 26px corrected to 22px (matching guides)
- Filter bar aligned to left 228px (matching guides)
- Grid gap: 12px corrected to 20px
- Card height: 200px corrected to 220px
- "Show more walks" button centred
- "Open in Sniffout" CTA constrained to 480px max-width
- App store badges constrained to 320px max-width
- Pagination aligned with card grid centre axis

### Guides Index
- Guide hero card: brand-tinted shadow added
- Guide grid cards: brand-tinted shadows added
- Hero image support with gradient overlay (brand green fallback)

### Individual Walk Page
- On-lead badge updated for pill B consistency
- Guide cards: neutral shadows converted to brand-tinted, radius 12px to 16px

### About Page
- Luna photo added after "The story" section
- Caption: "Luna - the reason Sniffout exists"
- Photo styled at 672px max-width (matching paragraph width)
- Full image display with no cropping (height: auto, no aspect-ratio)
- Owner replaced portrait photo with landscape version - luna.jpg updated

### Phase 2 - App Promotion Features (BACKLOG)
1. Walk page: live weather preview card with CTA
2. Walk page: "Plan this walk" feature card
3. Guide page: contextual app feature cards at end of guides
4. Homepage: app feature showcase section with phone mockup visuals
5. Walks index: persistent app banner promoting live weather

---

## 3. SEO CONTENT GAP RESEARCH - COMPLETE

Full report saved at: docs/research/seo-content-gap-analysis-april-2.md

### Top 5 Opportunities

1. **Area index pages (Surrey, London)** - aggregate existing walks into landing pages. Surrey alone captures 2,000-4,000 monthly searches. Lowest effort, highest return.
2. **Breed walking guides (French Bulldog, Cockapoo, Labrador)** - breed sensitivity engine as SEO content. No competitor has this. 2,000-4,000 searches/month per breed.
3. **"How far should I walk my dog"** - 5,000-10,000 monthly searches. Breed-by-breed guide with interactive selector.
4. **Adder bite guide** - TIME SENSITIVE. Adder season is NOW (April-July). Publish immediately.
5. **Temperature/heat guide** - publish by mid-May for June-August peak (3,000-6,000 searches).

### Content Calendar Highlights (April-June 2026)

- Week 1 (now): Adder bites guide + grass seeds refresh
- Week 2: Surrey area index page + London area index page
- Week 3: French Bulldog walking guide + Cockapoo walking guide
- Week 4: New Forest area page + FAQ blocks on all 14 walk pages
- Week 5: Labrador guide + Yorkshire area page
- Week 6: Brachycephalic walking guide
- Week 7: "Is it too hot to walk my dog" + Sussex area page

### Key Strategic Insights

- "Dog walks near me" = 49,500 monthly searches (single highest volume keyword)
- No competitor has breed-specific walk recommendations - genuine white space
- AllTrails generates 68% of traffic through organic search via location pages
- Area index pages are the easiest wins (curation of existing content)
- Seasonal content must be published 6-8 weeks before peak search period
- Website-to-app CTAs should be contextual ("Get live weather for this walk") not generic ("Download")

---

## 4. KANBAN STATE

### Done
- Weather redesign (all rounds)
- Today visual pass
- Walks visual redesign
- Nearby visual redesign
- Me visual redesign
- Me fixes
- Visual consistency sweep
- CLAUDE.md cleanup
- Seasonal hazard fix
- Website Phase 1 visual pass (all rounds)
- Website walks/guides alignment fix
- About page Luna photo
- SEO content gap research

### In Progress
- Nothing currently running

### Backlog
- Website Phase 2 app promotion features
- SEO content production (90-day calendar)
- Area index pages (Surrey, London - highest priority)
- Breed walking guides (French Bulldog, Cockapoo, Labrador)
- Adder bite guide (TIME SENSITIVE)
- Walk route maps (Phase 2)
- Tap-to-trace route creator
- Community features scoping (Researcher round needed)
- Guide images sourcing
- Walk images: newlands-corner, ranmore-common
- Senior dog walking article: awaiting Fact Checker review
- Meteocons investigation
- Fake walk card ratings removal (pre-launch blocker)

---

## 5. PENDING OWNER ACTIONS

- Join AWIN and Amazon Associates UK (affiliate links)
- Companies House registration
- ICO registration
- Solicitor engagement (blocks L5 - T&Cs)
- Trade mark application for "Sniffout"
- hello@sniffout.app via Cloudflare Email Routing
- Mailchimp account + embed code
- Apply Sniffout Lightroom preset to all images
- Source guide card images (owner confirmed these are easy to get)

---

## 6. KEY LEARNINGS FROM THIS SESSION

- Designer agents cannot produce genuinely different mockups - they anchor to existing code. Building mockups in Claude chat with show_widget was far more effective.
- Combined Developer briefs work when changes are interconnected but must be explicit about what NOT to change.
- Website CSS changes need exact pixel measurements from the live site to prevent alignment drift across rounds.
- Always compare index pages side-by-side (walks vs guides) to catch inconsistencies in typography, spacing, and alignment.
- Cloudflare Pages caching: use ?v=N query strings to bypass, or hard refresh (Cmd+Shift+R).
- Hover on websites: use translateY(-2px) not scale(1.02) - more subtle for content sites.
- The guides page is the reference for website layout consistency - walks page must match it.

---

## 7. WORKING PATTERNS

- Jayesh makes all final product decisions; Claude recommends, never decides
- Quality over speed; review before pushing
- Agent briefs: single copyable code block, pasted manually into tmux panes
- Content pipeline: Researcher then Tom then Fact Checker (mandatory) then fixes then commit
- Developer confirms changes with line numbers summary and git log --oneline -3
- Terminal grep commands more reliable than uploaded files for code checks
- Screenshots only when visual inspection genuinely necessary
- Chrome MCP: javascript_exec and get_page_text reliable; screenshot unreliable
- No em dashes in app or website copy (hyphens only) - em dashes fine in documents
- Surgical single-task briefs are mandatory (max 3-4 related tasks per round)

---

## 8. REPOS AND TOOLS

- PWA: ~/Desktop/my-first-repo (sniffout-v2.html) - sniffout.app
- Website: ~/Desktop/sniffout-website (Hugo SSG) - sniffout-website.pages.dev
- Tmux: Top-left = Designer/Editor | Top-right = Developer | Bottom-left = PO/Validator | Bottom-right = Researcher/Copywriter
- Launch pane: export PATH="$HOME/.local/bin:$PATH" && claude
- Git push (PWA): cd ~/Desktop/my-first-repo && git add . && git commit -m "sniffout-v2 - description" && git push
- Git push (website): cd ~/Desktop/sniffout-website && git add . && git commit -m "sniffout-website - description" && git push
- Kanban: sniffout.app/sniffout-kanban.html
- Cloudflare Worker: places-proxy.sniffout.app
- Firebase: sniffout-fe976, region europe-west2
