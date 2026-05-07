# Sport News Project Plan

## 1) Product Overview

### What this website is
`Sport News` (brand style: `PULSE.`) is a modern sports media web app built with Next.js App Router.  
The goal is to present sports news, rankings, and editorial content in a fast, visually strong, mobile-friendly experience.

### What it does today
- Shows a landing page with a hero area.
- Provides curated pages for category browsing, trending stories, recent updates, club rankings, and long-form articles.
- Supports dynamic sport detail pages via `sport/[sport_name]` with sport-specific stats, trending items, competitions, and upcoming fixtures.
- Uses a shared visual language (dark theme, gradient accents, animated cards, rounded UI).

### Primary audience
- Sports fans who want quick highlights.
- Readers who like deeper coverage and sport-specific pages.
- Editors/developers who need an extendable structure for future CMS/API integration.

---

## 2) Current Tech Stack

### Core framework and runtime
- `next@16.x` with App Router (`app/` directory).
- `react@19.x` and `typescript`.
- Yarn Berry (`yarn@4`) package management.

### UI and styling
- Tailwind CSS v4 setup in `app/globals.css` + `tailwind.config.ts`.
- `tw-animate-css` and `tailwindcss-animate` for motion.
- `lucide-react` and `react-icons` for iconography.
- Local fonts loaded in `app/layout.tsx` using `next/font/local`.

### Utility libraries
- `clsx`, `tailwind-merge`, and local helper `lib/utils.ts` for className composition.

### Tooling
- ESLint configured via `eslint` and `eslint-config-next`.
- TypeScript strict mode enabled.

---

## 3) File/Feature Architecture (Where things happen)

## App routes
- `app/layout.tsx`
  - Global shell for all pages.
  - Injects `Navbar` and `Footer` around route content.
  - Loads global fonts and CSS.

- `app/page.tsx` (Home)
  - Renders hero content.
  - **Note:** currently imports and renders `Navbar` directly even though navbar is already in root layout, causing duplicate navbar on home page.

- `app/category/page.tsx`
  - Category listing UI.
  - Uses shared `SPORTS` data and links each card to `sport/[sport_name]`.

- `app/sport/[sport_name]/page.tsx`
  - Dynamic sport detail route.
  - Uses:
    - `generateStaticParams` for static generation of known sports.
    - `generateMetadata` for sport-specific SEO title/description.
    - `notFound()` for invalid slug handling.

- `app/trending/page.tsx`
  - Trending news list with rank and engagement stats.

- `app/recent/page.tsx`
  - Timeline-style recent stories.

- `app/rankings/page.tsx`
  - Club ranking table/cards with movement indicators.

- `app/articles/page.tsx`
  - Long-read article card layout.

- `app/not-found.tsx`
  - Global 404 page.

## Shared components
- `components/Navbar.tsx`
  - Main navigation and mobile menu toggle.
  - Highlights active route.
  - **Important bug to fix:** mobile `Link` uses a `className` function with `isActive` (React Router pattern), but Next.js `Link` does not provide `isActive`.

- `components/Footer.tsx`
  - Brand, newsletter input, social links.

- `components/PageHeader.tsx`
  - Reusable section hero/banner for top-of-page titles.
  - Implements background gradients, grid texture, and heading treatment.

- `components/hero/hero.tsx`
  - Landing hero visual section.

- `components/ui/*`
  - Shadcn-style UI primitives available for future feature expansion.

## Data/config helpers
- `lib/nav.ts`
  - Main nav route list.

- `lib/sports.ts`
  - Typed data model for dynamic sports.
  - Contains sport metadata and content arrays.
  - Exposes `getSportBySlug`.

- `app/globals.css`
  - Theme tokens, custom utilities, gradients, animations, and base typography styles.

---

## 4) UX / Design System Summary

### Visual identity
- Dark-first UI (`background` around deep blue-black tone).
- Bright gradient primary accent (orange/pink spectrum).
- Electric secondary gradient (blue/violet spectrum).
- Rounded cards and pills with heavy heading typography.

### Motion and interaction
- Entry animations: fade, slide-in, scale.
- Card hover effects: border emphasis, glow shadow, minor transform.
- Sticky translucent navbar with blur backdrop.

### Layout patterns
- `container`-based page width.
- Strong page headers for section identity.
- Card grids for digestible content units.

### Accessibility status (current)
- Good: semantic landmarks in many sections.
- Needs improvement:
  - Ensure keyboard/focus styles are consistent.
  - Add form label handling for newsletter input.
  - Review icon-only links and provide descriptive labels.

---

## 5) Functional Coverage Matrix (Current vs Planned)

### Implemented now
- Static news/category/ranking/article pages.
- Dynamic sport routes for known sports.
- Responsive navigation and page cards.
- Basic metadata support.

### Not yet implemented (high-value next)
- Real backend/API integration (currently mock data).
- Search, filters, and pagination.
- Editorial workflow or CMS integration.
- Authentication/roles for admin/editor.
- Bookmarks/personalization.
- Automated testing suite.
- Analytics, observability, and performance budgets.

---

## 6) Scale & Performance Considerations

### Current scale profile
- App is currently content-light and mock-data based.
- Build-time static generation works well for small fixed datasets.

### Expected scale targets (recommended planning baseline)
- 100k+ daily users.
- 1,000+ stories/day ingestion.
- 50+ sports/leagues with region-specific feeds.
- Burst traffic during major events.

### Technical scaling strategy
- Data layer:
  - Move mock arrays to API + database (PostgreSQL or managed document DB).
  - Add cache tier (Redis or edge cache).
- Rendering:
  - Use ISR/revalidation for sport and listing pages.
  - Keep article details statically pre-rendered with selective on-demand revalidation.
- Delivery:
  - Use CDN and image optimization.
  - Split critical and non-critical client JS.
- Reliability:
  - Add retry/fallback for upstream feed failures.
  - Track SLIs (availability, TTFB, error rate).

---

## 7) SEO & Content Strategy (Developer-facing)

### Current
- Basic metadata in layout and dynamic sport pages.

### Next
- Add page-level metadata for all routes.
- Add Open Graph + Twitter metadata defaults.
- Add structured data:
  - `NewsArticle` for articles.
  - `BreadcrumbList` for route hierarchy.
- Add sitemap and robots config.
- Enforce canonical URLs for slug variations.

---

## 8) Security & Quality Baseline

### Security
- Sanitize all external content if moving to CMS/API.
- Validate route params and API payloads with schema tooling (e.g., Zod).
- Add rate limiting for public APIs if introduced.

### Quality
- Add unit tests for helpers (`lib/sports.ts`, slug logic).
- Add component tests for route rendering states (valid/invalid sport slug).
- Add E2E tests for critical navigation paths.
- Add CI checks: lint, typecheck, tests, build.

---

## 9) Known Gaps / Risks in Current Codebase

1. **Duplicate home navbar**
   - `app/layout.tsx` already renders `Navbar`, but `app/page.tsx` renders it again.
   - Impact: duplicated UI on home route.

2. **Mobile nav active-state bug**
   - `components/Navbar.tsx` uses `className={({ isActive }) => ...}` on Next `Link`.
   - Impact: incorrect typing/behavior; should use pathname-based logic like desktop nav.

3. **Legacy/unused React Router patterns**
   - Presence of `components/Layout.tsx` and `components/NavLink.tsx` patterns suggest migration leftovers.
   - Impact: confusion for contributors; should standardize fully on Next App Router.

4. **Data source is mock-only**
   - No external API or persistence.
   - Impact: cannot scale content operations without backend integration.

---

## 10) Recommended Roadmap

## Phase 1 - Stabilize current foundation (1-3 days)
- Fix duplicate navbar on home.
- Fix mobile nav active state in `Navbar`.
- Remove/mark deprecated React Router leftovers.
- Add route-level metadata for non-dynamic pages.
- Add TypeScript route/data guard utilities for slug handling.

## Phase 2 - Data and content platform (3-7 days)
- Introduce backend contract for stories/sports.
- Replace hardcoded arrays with typed fetch layer.
- Add loading, error, and empty UI states.
- Add server-side caching and revalidation strategy.

## Phase 3 - Discovery and engagement (4-8 days)
- Add search and category filters.
- Add pagination/infinite load for content-heavy pages.
- Add related stories and cross-linking modules.
- Add simple personalization (favorite sports).

## Phase 4 - Production hardening (ongoing)
- Add test suite (unit + integration + E2E).
- Add analytics and observability.
- Add performance budgets and audits.
- Add content moderation/editor workflow features.

---

## 11) Developer Onboarding Checklist

1. Install dependencies: `yarn`.
2. Run dev server: `yarn dev`.
3. Run lint: `yarn lint`.
4. Review route map in `app/`.
5. Review shared UI patterns in `components/`.
6. Review domain models in `lib/`.
7. Follow naming convention:
   - App routes in `app/<route>/page.tsx`
   - Shared logic in `lib/`
   - Reusable UI in `components/`
8. Before PR:
   - lint passes
   - type safety maintained
   - no duplicated layout elements
   - navigation works on desktop and mobile

---

## 12) Suggested Next Developer Tasks (Immediate)

- Task A: Fix home duplicate navbar and align hero structure with root layout.
- Task B: Correct mobile navigation active-link logic in `components/Navbar.tsx`.
- Task C: Add `loading.tsx` and `error.tsx` for key routes.
- Task D: Introduce shared `types/news.ts` and normalize story models.
- Task E: Add first E2E smoke test: home -> category -> sport detail -> not found.

---

## 13) Definition of Done (For future feature work)

A feature is complete when:
- It matches the established design system.
- It works on mobile and desktop.
- It has loading/error/empty states.
- It does not regress navigation or layout shell.
- Lint/type checks pass.
- Metadata/SEO fields are defined where applicable.
- Developer notes are updated in this `plan.md` when architecture changes.

