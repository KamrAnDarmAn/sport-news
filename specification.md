# Sport News Feature Specification

## 1) Purpose of this Document

This file describes **what information users receive** from the Sport News website and lists **all major features currently provided** by the project.

It is written so developers, designers, and content teams can quickly understand:
- what each page delivers,
- what data fields are shown to users,
- how dynamic sport pages differ by sport,
- which features are already implemented vs planned next.

---

## 2) Product Summary (User Perspective)

Sport News (`PULSE.`) is a sports content platform where users can:
- browse by sport category,
- read trending and recent stories,
- view club rankings,
- read long-form sports articles,
- open dynamic sport pages with sport-specific data.

The experience is designed to be fast, visual, and mobile-friendly.

---

## 3) Global Features Available Across the Site

### 3.1 Persistent navigation
- Sticky top navigation bar with links to:
  - Home
  - Category
  - Trending News
  - Recent News
  - Clubs Rankings
  - Sports Articles
- Mobile menu toggle available on smaller screens.

### 3.2 Global footer
- Brand identity section.
- Newsletter subscription input field.
- Social icon links (visual placeholders currently).

### 3.3 Shared page header system
- Most content pages display a reusable visual page header with:
  - eyebrow label,
  - title,
  - subtitle,
  - gradient/background effects for section identity.

### 3.4 Responsive design
- Content adapts to desktop/tablet/mobile with grid and stacked layouts.

---

## 4) Route-by-Route User Information Map

## 4.1 Home (`/`)

### What users get
- Hero section with strong visual branding and headline treatment.

### Main purpose
- Serves as brand entry point and first impression.

---

## 4.2 Category (`/category`)

### What users get
- Grid of sports categories.
- Each category card displays:
  - sport icon (emoji),
  - sport name,
  - short sport tagline,
  - number of available stories.
- Each card links to a dedicated sport details page.

### User value
- Quickly discover available sports and jump into a specific one.

---

## 4.3 Dynamic Sport Page (`/sport/[sport_name]`)

Each sport page provides **different values and information** based on the selected sport slug.

### Sports currently available
- football
- basketball
- tennis
- f1-racing
- cricket
- esports
- boxing
- golf
- athletics

### Shared information users receive for every sport

#### A) Hero/Header information
- Sport icon + name in eyebrow
- Title: `<Sport Name> Coverage`
- Sport-specific tagline

#### B) Top metrics cards
- `Stories tracked` (numeric count)
- `Active events` (numeric count)
- `Followers` (formatted audience count, e.g. 1.9M)
- `Pulse score` (0-100 signal metric)

#### C) Trending stories section
Each sport has a custom list of trending stories with:
- story title,
- short excerpt,
- source label,
- relative publish time (e.g. "14 min ago"),
- heat level (`High`, `Medium`, `Rising`).

#### D) Top competitions section
- List of core leagues/tournaments for that sport (sport-specific).

#### E) Upcoming fixtures/events section
Each item shows:
- matchup/event name,
- competition name,
- kickoff/start time label.

#### F) About section
- Sport-specific description paragraph.

### User value
- Gives users an at-a-glance dashboard for a specific sport with unique stats, stories, and schedule context.

---

## 4.4 Trending News (`/trending`)

### What users get
- Ranked trending stories list.
- For each trending item:
  - rank number,
  - tag (sport/category),
  - title/headline,
  - view count,
  - comment count,
  - trending badge.

### User value
- Shows what is hottest right now across all sports.

---

## 4.5 Recent News (`/recent`)

### What users get
- Timeline-style list of recently published updates.
- Each item includes:
  - relative time,
  - category tag,
  - title,
  - short excerpt.

### User value
- Helps users track the newest updates in chronological style.

---

## 4.6 Clubs Rankings (`/rankings`)

### What users get
- Ranked clubs table/card layout.
- For each club:
  - rank number,
  - club crest/icon,
  - club name,
  - points,
  - recent form string (W/L/D),
  - movement indicator (up/down/same).

### User value
- Provides a quick performance and standings view for top clubs.

---

## 4.7 Sports Articles (`/articles`)

### What users get
- Editorial/long-read article cards.
- Each card includes:
  - article tag/type (e.g., Tactics, Interview),
  - estimated read time,
  - article title,
  - author attribution.

### User value
- Supports deeper reading beyond short headline updates.

---

## 4.8 Not Found (`404`)

### What users get
- Error state page when route does not exist.
- Link back to home.

### User value
- Clear fallback navigation when URL is invalid.

---

## 5) Sport-Specific Value System (Data Fields)

Dynamic sport pages are powered by a structured sport model.  
Each sport object contains:

- `slug`: unique route key (used in URL)
- `name`: display name
- `icon`: visual emoji/icon
- `tagline`: short identity sentence
- `description`: longer explanatory text
- `stories`: count of stories available
- `activeEvents`: count of ongoing/active events
- `followers`: audience metric
- `pulseScore`: normalized score for sport activity
- `topLeagues`: major competitions list
- `upcoming`: upcoming fixtures/events list
  - `matchup`
  - `competition`
  - `kickoff`
- `trendingStories`: per-sport editorial highlights
  - `title`
  - `excerpt`
  - `source`
  - `time`
  - `heat`

This model ensures each sport page has different values while preserving one consistent UI structure.

---

## 6) Current Feature Status

## Implemented
- Multi-page sports news frontend.
- Dynamic sport routes with per-sport values.
- Ranking and article pages.
- Category-to-sport linking.
- Shared navigation/footer/page-header system.
- Responsive card-based UI.

## Partially implemented / placeholder
- Newsletter field UI exists, but no backend subscription flow.
- Social links are currently placeholder links.
- Data is local/static (no live API yet).

## Not implemented yet (recommended next)
- Search and filtering.
- User accounts/authentication.
- Bookmark/save-for-later.
- Live scores and real-time feed refresh.
- CMS integration for editor-managed publishing.
- Personalized content recommendations.

---

## 7) Key User Journeys Supported

1. **Discover by sport**
   - User opens `Category` -> selects a sport -> sees sport dashboard values and stories.

2. **Follow top headlines**
   - User opens `Trending News` -> checks top ranked stories and engagement signals.

3. **Catch latest updates**
   - User opens `Recent News` -> scans timeline for newest information.

4. **Check team performance context**
   - User opens `Clubs Rankings` -> reviews rank, points, form, and movement.

5. **Read deep editorial content**
   - User opens `Sports Articles` -> selects long-read topic by type and read time.

---

## 8) Developer Notes for Future Feature Expansion

- Keep all new user-facing data models typed and centralized in `lib/`.
- Maintain route-level consistency:
  - page header,
  - content sections,
  - empty/error/loading states.
- When API integration starts:
  - preserve existing field names where possible to minimize UI refactor cost.
- Add analytics events for:
  - category card click,
  - sport page views,
  - story card interactions,
  - newsletter submit attempts.

---

## 9) Quick Reference: What Users Learn From This Site

Users can learn:
- what sports are covered,
- what stories are trending now,
- what news is most recent,
- how top clubs are ranked,
- what long-form analysis is available,
- and for each sport: activity level, key competitions, upcoming events, and highlighted stories.

