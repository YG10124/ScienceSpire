# Project Overview – Student Science Hub

This project is a **student‑built, science‑only learning hub** focused on four core tracks:

- Physics
- Chemistry
- Biology
- Earth Science

It is designed to be:

- Highly **interactive** (every button performs a real action, even if minimal at MVP stage)
- **Accessible** (color‑blind friendly, keyboard‑navigable, reduced‑motion support)
- **Responsive** (optimized layouts for phones, tablets, and desktops)
- **Optimized for GitHub Pages** deployment (correct asset paths and build settings)

The goal is to deliver a production‑grade MVP that already feels like a polished app, not a demo.

---

## High‑Level Architecture

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Design approach: mix of **flat design** with light **skeuomorphic** touches (glass cards, notebook‑like portfolios)
- Theming: full **light and dark mode** with shared design tokens
- Data: small local‑first store plus a simple backend layer for sign‑up/sign‑in and session data
- Deployment: static build served via **GitHub Pages**, configured with the correct base path so the app does not render as a blank page

File structure (simplified):

- `src/main.tsx` – React entry; mounts the app and wraps providers (theme, store, router)
- `src/App.tsx` – top‑level layout:
  - Sticky header
  - Collapsible translucent sidebar (signed‑in)
  - Main content area
  - Global footer
- `src/pages/` – route‑level screens
  - `HomePublic.tsx` – unsigned‑in landing page (parallax science hero)
  - `HomeDashboard.tsx` – signed‑in dashboard
  - `SchedulePage.tsx` – calendar + sessions
  - `ResourcesPage.tsx` – science resources library
  - `CommunityPage.tsx` – forum/channels/groups
  - `PortfolioPage.tsx` – student project portfolio
  - `CreatorStudioPage.tsx` – student resource creation tools
  - `Auth/SignInPage.tsx`, `Auth/SignUpPage.tsx`
- `src/components/` – reusable UI
  - `layout/Sidebar.tsx`, `TopBar.tsx`, `BottomNav.tsx`, `Footer.tsx`
  - `home/FloatingScienceGallery.tsx`, `RotatingHeadline.tsx`
  - `schedule/Calendar.tsx`, `SessionCard.tsx`, `SessionDetailsDrawer.tsx`
  - `dashboard/ProgressCard.tsx`, `StreakWidget.tsx`
  - `community/ChannelList.tsx`, `ThreadView.tsx`, `GroupPreview.tsx`
- `src/store/` – local state & persistence (user, sessions, progress, theme)
- `vite.config.ts` – Vite + React + Tailwind config, **including correct `base` for GitHub Pages**

---

## Core Product Requirements

### Science‑only focus

- All content, navigation, and labels are specific to **Physics, Chemistry, Biology, and Earth Science**.
- Filters, tags, tracks, and sessions are scoped to these subjects.
- The site copy and imagery reinforce “science learning” (lab scenes, molecules, planets, diagrams).

### Key user flows

1. **Unsigned‑in user**
   - Lands on the parallax **HomePublic** page.
   - Scrolls through interactive explanations of how the platform works.
   - Previews science tracks, sample sessions, and community.
   - Creates an account via **Sign Up**.

2. **Signed‑in user**
   - Sees **Dashboard** with:
     - Today’s sessions and tasks.
     - Progress by science track.
     - Streaks and recommendations.
   - Uses **Schedule** to join/leave sessions.
   - Uses **Resources** to study materials and practice.
   - Uses **Community** to join channels and groups.
   - Uses **Portfolio** and **Creator Studio** to showcase and create content.

Every primary action in these flows is backed by working UI state (and where available, persisted data).

---

## UX & UI Principles

### Layout and grid system

- CSS Grid for overall page layout; Flexbox inside components.
- 12‑column desktop grid that collapses to fewer columns on tablet/phone.
- Consistent vertical rhythm using a spacing scale (e.g., 4/8/12/16/24/32 px).
- All cards, buttons, and text blocks align to the grid for a clean, professional look.

### Responsive behavior

- Breakpoints optimized for:
  - ≤ 480px: phones (single‑column, large touch targets, bottom navigation)
  - ~768px: tablets (two columns where possible)
  - ≥ 1024px: desktops (sidebar + content + optional right rail)
- On smaller screens:
  - **Bigger buttons** and tap targets (≥ 44×44 px).
  - Simplified layouts (no crammed sidebars).
  - Collapsible navigation (sidebar becomes slide‑over drawer).

### Navigation

- **Sticky top navigation bar**
  - Always visible.
  - Contains logo, main links, and auth/profile controls.
  - Slightly shrinks and gains a subtle background/blur on scroll.

- **Collapsible translucent sidebar** (signed‑in app)
  - Left side.
  - Contains icon+label links to Dashboard, Schedule, Resources, Community, Portfolio, Creator Studio.
  - Collapses to icons on desktop; becomes a translucent, glassy slide‑over on mobile.

- **Breadcrumb navigation**
  - Visible on deeper pages (resource detail, session detail, portfolio project).
  - Shows the path like `Home > Resources > Physics > Newton’s Laws`.
  - Helps users orient themselves and improves SEO.

---

## Theming, Color, and Accessibility

### Light & dark modes

- Global theme system with `light` and `dark` modes:
  - Light: soft neutral background, dark text, science accent colors.
  - Dark: deep navy backgrounds, lighter card surfaces, off‑white text (no pure white on pure black).
- Theme applied consistently across all pages, including Portfolio and Creator Studio.
- Theme choice stored (e.g., `localStorage`) and respects system `prefers-color-scheme`.

### Color‑blind and WCAG compliance

- All color pairs meet **WCAG AA** contrast:
  - 4.5:1 for normal text.
  - 3:1 for large text and UI components.
- Status and feedback states (success, warning, error) use:
  - Color + icon + label (not color alone).
- Charts, badges, and tags use different shapes/patterns or icons so they are distinguishable in grayscale.
- Heavy motion and parallax support a reduced‑motion mode:
  - If `prefers-reduced-motion` is set, disable parallax and nonessential animations.

---

## Motion & Parallax

- Buttons, cards, drawers, and view changes use **short, smooth transitions** (150–250 ms).
- No abrupt “snap” state changes; every interaction feels fluid but snappy enough for performance.
- **Parallax** is used only for decorative backgrounds on the public home page:
  - Hero section uses layered science imagery that moves at different speeds.
  - Text and key content layers do NOT move to preserve readability and accessibility.
- Parallax designs degrade gracefully with reduced‑motion preferences.

---

## Page‑Specific MVPs

### 1. Home (unsigned‑in, public)

- Hero section with:
  - Changing science keywords in the headline.
  - Parallax science background.
  - Primary CTA: “Start your science journey” (Sign Up).
  - Secondary CTA: “Preview science sessions” (scroll).
- Sections:
  - How it works (3 steps: choose track → join sessions → build portfolio).
  - Science tracks (Physics, Chemistry, Biology, Earth Science).
  - Live sessions preview (read‑only).
  - Community preview (sample channels and posts).
- Footer with key links and mission statement.

### 2. Dashboard (signed‑in)

- Today’s tasks and upcoming sessions.
- Progress by science track (cards with completion bars).
- Streaks, time spent, and next recommendations.
- All actions clickable and stateful (e.g., mark tasks as done, open session details, save a recommendation).

### 3. Schedule

- Calendar + sessions list:
  - Calendar controls the selected day/week.
  - Sessions differ by day and track.
- “My Sessions” tab:
  - Shows only joined sessions.
  - Updates when the user joins/leaves sessions.
- Session detail drawer:
  - Title, track, description, agenda.
  - Attendee count, spots left.
  - Join/leave actions that update state.

### 4. Resources

- Filterable library of science lessons, videos, quizzes, and downloads.
- Resource detail pages with content, metadata, related items, and discussion.
- “Save,” “Start quiz,” “Add to playlist/portfolio” all have real, visible effects.

### 5. Community

- Channel view:
  - Physics help, Chemistry labs, Biology projects, Earth science channels.
- Thread view:
  - Posts and replies, with ability to create and interact.
- Group join behavior:
  - Joining a group flips state to “Joined,” adds it to “My groups,” and unlocks posting/extra content.

### 6. Portfolio

- List of science projects/labs with status and thumbnails.
- Project detail pages with artifacts and reflections.
- Proper colors in both light and dark themes.

### 7. Creator Studio

- Simple tools to create:
  - Quizzes, notes, explainer lessons.
- Uses templates and guidance.
- Fully themed in both modes, with all controls working.

---

## Data & Backend (MVP scale)

- Local‑first store:
  - User profile (id, name, preferences).
  - Sessions and joins.
  - Resource progress (completed, scores).
  - Basic community interactions (locally or via simple API).
- Small backend (or local API) for:
  - Sign up / sign in (with hashed passwords).
  - Persisting sessions and user progress beyond the browser.
- All UI actions:
  - Update local state immediately (optimistic UI).
  - Sync to backend where available.

---

## Content Management & SEO

- Science content stored as structured data (can be fed from JSON or a CMS).
- Per‑page SEO:
  - Unique titles and descriptions.
  - Semantic headings and markup.
- Sitemap:
  - XML sitemap linking public pages and key content.
- Breadcrumb markup:
  - Implemented as structured data where appropriate.

---

## Footer

Always visible at the bottom of the page content:

- Navigation links for:
  - Science tracks, Resources, Community, Help, Accessibility, Privacy, Terms.
- Short mission statement.
- Social/contact links.

Responsive layout:
- Multi‑column on desktop, stacked sections on mobile.

---

## “Every Button Works” Principle

- No decorative or fake buttons.
- Every visible button or link:
  - Executes a meaningful action (open, toggle, save, navigate).
  - Provides instant feedback (state change, animation, or confirmation).
- If a full backend isn’t ready, actions still update local state and show realistic results.

---

## GitHub Pages Optimization

The project must be **fully compatible with GitHub Pages**:

- Build output: `npm run build` produces a static bundle in `dist/`.
- Vite configuration:
  - `vite.config.ts` includes the correct `base` path for the GitHub Pages URL so that assets load correctly on deployment.
  - Example: if deployed at `https://username.github.io/repo-name/`, `base` is set to `/repo-name/`.
- Deployment:
  - GitHub Pages is configured to serve the content of `dist/` (either via a `gh-pages` branch or an action that pushes that folder).
- After deployment:
  - The app loads with no blank screen.
  - All routes that should be publicly accessible work from the root URL.
  - Console is free of missing asset errors (no 404s on JS/CSS bundles).

The MVP is considered complete only when the application is **live on GitHub Pages**, loads its assets correctly from the configured base path, and all core flows (unsigned‑in home, sign up, dashboard, schedule, resources, community, portfolio, creator studio) are usable from that deployment.

---
