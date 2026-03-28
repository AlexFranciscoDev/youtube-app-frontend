# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Font Awesome.

**Component tree:**
```
App.tsx
└── AuthProvider          (src/context/AuthProvider.tsx)
    └── BrowserRouter
        └── Routing       (src/router/Routing.tsx)
            └── MainLayout (src/layouts/MainLayout.tsx)
                ├── Header (src/layouts/Header.tsx)
                ├── <Outlet /> → page component
                └── Footer (src/layouts/Footer.tsx)
```

**Auth context** (`src/context/`): `AuthContext.tsx` defines the `AuthContextType` interface and `useAuth()` hook. `AuthProvider.tsx` holds the state (`isLoggedIn`, `user`) and exposes `login(name, email)` / `logout()`. Auth is **in-memory only** — no backend or localStorage integration yet. `AuthProvider` must always be above `BrowserRouter`.

**Routing** (`src/router/Routing.tsx`): All routes are children of a single `<Route path="/" element={<MainLayout />}>`, so Header and Footer appear on every page. Current routes: `/` (Home), `/login`, `/register`, `*` (NotFound).

**Styling:** Two CSS entry points — `src/App.css` (global resets, CSS variables, utility classes like `.layout-container`) and `src/index.css` (currently commented out). Component-specific styles use plain CSS files co-located with pages (e.g., `src/pages/AuthForm.css`). Tailwind utility classes are used directly in JSX alongside these CSS files. CSS custom properties for the design system are defined in `:root` inside `src/App.css`.

**CSS variables** (defined in `src/App.css`): `--color-bg`, `--color-secondary`, `--color-terciary`, `--background-gradient`, `--background-card`, `--container-max-width`, `--container-gutter`, etc.

**Font Awesome** icons are imported individually from `@fortawesome/free-solid-svg-icons` and rendered via `<FontAwesomeIcon icon={...} />`.
