# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # Run ESLint
npm run test      # Run tests with Vitest
npm run preview   # Preview production build
```

**Test framework:** Vitest + React Testing Library. Setup file at `src/test/setup.ts` (mocks localStorage globally).

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Font Awesome.

**Component tree:**
```
App.tsx
└── BrowserRouter
    └── AuthProvider          (src/context/AuthProvider.tsx)
        └── Routing           (src/router/Routing.tsx)
            └── MainLayout    (src/layouts/MainLayout.tsx)
                ├── Header    (src/layouts/Header.tsx)
                ├── <Outlet /> → page component
                └── Footer    (src/layouts/Footer.tsx)
```
Note: `AuthProvider` must be **inside** `BrowserRouter` because it uses `useNavigate`.

**Auth context** (`src/context/`): `AuthContext.tsx` defines `AuthContextType` and `useAuth()` hook. `AuthProvider.tsx` persists auth in **localStorage** (`token`, `user` keys). Exposes `isLoggedIn`, `user`, `token`, `login(user: User, token: string)`, and `logout()` (which clears localStorage and redirects to `/login`). `login()` normalizes `_id` → `id` (MongoDB returns `_id`); the same normalization runs on localStorage read at startup.

**Routing** (`src/router/Routing.tsx`): All routes are children of `<Route path="/" element={<MainLayout />}>`. Protected routes are wrapped in `<ProtectedRoute />` (redirects to `/login` if no token).

| Path | Page | Access |
|---|---|---|
| `/` | Home | Protected |
| `/upload` | Upload | Protected |
| `/profile/:id` | Profile | Protected |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `*` | NotFound | Public |

**Backend API** (base URL defined in `src/helpers/Global.tsx`):
- API base: `http://localhost:3000/api/`
- Uploads base: `http://localhost:3000/uploads/`
- Endpoints in use: `POST /api/user/login`, `POST /api/user/register`, `GET /api/user/profile/:id`, `GET /api/video/`, `GET /api/video/user/:id`, `POST /api/video` (multipart), `GET /api/category`

## Key Files

- `src/helpers/Global.tsx` — API and uploads base URLs (`Global.url`, `GlobalUploads.url`)
- `src/helpers/ProtectedRoute.tsx` — Route guard; checks `useAuth().token`, renders `<Outlet />` or redirects
- `src/helpers/thumbnailFetcher.ts` — Auto-fetches thumbnails from YouTube (direct), TikTok (oEmbed API), Instagram (backend proxy)
- `src/hooks/useUploadForm.ts` — All upload form state/validation/thumbnail logic; detects platform from URL
- `src/utils/validators.ts` — Pure validation functions returning error strings (empty = valid); covers auth + upload fields
- `src/components/VideoCard.tsx` — Reusable card: thumbnail, title, author, category, platform badge, date, external link
- `src/components/PasswordInput.tsx` — Password field with show/hide toggle (FontAwesome eye icon)
- `src/pages/Profile.tsx` — Profile page: sidebar with avatar, username, email, member since; video grid with user's videos fetched from API

## Styling

Two CSS entry points — `src/App.css` (global resets, CSS variables, utility classes like `.layout-container`) and `src/index.css` (currently commented out). Component-specific styles use plain CSS files co-located with pages (e.g., `src/pages/AuthForm.css`). Tailwind utility classes are used directly in JSX alongside these CSS files. CSS custom properties for the design system are defined in `:root` inside `src/App.css`.

**CSS variables** (defined in `src/App.css`): `--color-bg`, `--color-secondary`, `--color-terciary`, `--background-gradient`, `--background-card`, `--container-max-width`, `--container-gutter`, etc.

**Font Awesome** icons are imported individually from `@fortawesome/free-solid-svg-icons` and rendered via `<FontAwesomeIcon icon={...} />`.
