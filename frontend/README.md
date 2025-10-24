# Frontend — Next.js storefront for SpringShop

This folder contains the Next.js frontend for the SpringShop e-commerce application. It provides the public storefront, product pages, cart, authentication flows, and a small admin area. The app is built with Next.js (app router), TypeScript, and standard frontend tooling (ESLint, PostCSS).

This README documents how to set up, run, and build the frontend locally and in production, how it connects to the Spring Boot backend, environment variables used, and a high-level overview of the project's structure.

## Quick facts

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: CSS modules / global CSS (see `app/globals.css`) and PostCSS
- Node / Package manager: Node.js + npm (see `package.json`)

## Prerequisites

- Node.js (LTS recommended) installed on your machine.
- npm (bundled with Node.js) or yarn/pnpm if you prefer — commands below use npm.
- The Spring Boot backend running locally. See the main project README for backend instructions. By default the frontend expects the backend API to be available at `http://localhost:8080`.

## Setup

1. From the `frontend` folder, install dependencies:

```powershell
cd d:\SpringbootTutorial\springshop\frontend
npm install
```

2. Copy and adjust environment variables. A `.env.local` file may be present — add or update values as needed. Example variables used by the app are documented below.

## Environment variables

Place local runtime variables in `.env.local` at the root of the `frontend` folder. Example variables you might use (this project may only use a subset):

- NEXT_PUBLIC_API_BASE_URL — URL of the backend API (default: `http://localhost:8080/api`)

Example `.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

After changing environment variables you must restart the dev server.

## Scripts

Available npm scripts are defined in `package.json`.

- npm run dev — start the development server with hot reload (default port 3000)
- npm run build — build the app for production
- npm start — start the production server after `npm run build`
- npm run lint — run ESLint

Examples:

```powershell
npm run dev
npm run build; npm start
npm run lint
```

## Running locally (development)

1. Ensure the backend is running (if you need live API data).
2. From `frontend` run:

```powershell
npm run dev
```

3. Open http://localhost:3000 in your browser.

The Next.js app uses the app router. Pages live under `src/app` and server/client boundaries are controlled with `'use client'` in components that need client-side behavior.

## Building for production

Build and run the production server:

```powershell
npm run build
npm start
```

Alternatively, you can export a static app (if your app is compatible) using Next.js export, or containerize the app for deployment.

## Connecting to the Spring Boot backend

The frontend calls the backend API endpoints under `src/api` — the base URL is read from `NEXT_PUBLIC_API_BASE_URL`. Configure that variable to point to your running backend, for example `http://localhost:8080/api`.

When working locally with both front and backend you can:

- Run the backend on port 8080 and the frontend on port 3000. Ensure CORS is enabled on the backend or proxy API calls during development via `next.config.js` rewrites.

## Key folders and files

- `src/app` — Next.js app router pages and layout. Main entry points for routes such as `/products`, `/cart`, `/admin`, `/login`, etc.
- `src/components` — reusable UI components such as `ProductCard`, `Navbar`, `HeroSection`.
- `src/context` — React context providers for authentication (`AuthContext.tsx`) and cart state (`CartContext.tsx`).
- `src/api/index.ts` — helpers for calling backend api endpoints.
- `public/` — static assets (images and icons) used by the site.

## Authentication & Cart

Auth is implemented through `AuthContext` and the app uses JSON Web Tokens (JWT) or session cookies provided by the backend (see `src/utils/auth.ts`). Ensure your backend exposes the required auth endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`) and sets cookies or returns tokens compatible with the frontend code.

Cart state is held in `CartContext` and persisted in local storage; orders are sent to the backend when the user checks out.

## Admin area

There is a small admin area under `src/app/admin` for managing products, categories, and users. Access control should be handled by the backend APIs and the frontend will hide or show admin routes based on the authenticated user's role.

## Linting & formatting

- ESLint config is at `eslint.config.mjs` — run `npm run lint` to check for problems.
- Prettier may be configured globally in your editor. There is no Prettier config in this repo by default unless you add one.

## Common tasks

- Add a new product page: create a route under `src/app/products/[id]` and a server component to fetch product data from the API.
- Add a design system component: place it in `src/components/ui` and export from an index file for reuse.

## Troubleshooting

- Dev server fails to start: check Node.js version and run `npm ci` to install clean dependencies.
- Missing env variables: ensure `.env.local` is present and restart the dev server after editing it.
- CORS errors calling backend APIs: enable CORS on your Spring Boot backend or configure a proxy in `next.config.js`.

## Deployment notes

- Build the app with `npm run build` on your CI and serve the built output with `npm start` or with a Node process manager.
- For static hosting (Vercel/Netlify), adapt API endpoints or use serverless functions as a proxy to the Spring Boot backend.

## Further improvements

- Add tests (Jest/React Testing Library) for components and pages.
- Add CI workflow for linting and building the frontend.
- Add explicit environment examples: `.env.example` showing required variables.

## Contact and contribution

If you want to contribute or need help running the frontend, open an issue in the repository or reach out to the maintainers listed in the main project README.

---

README generated and tailored to the Next.js `frontend` folder included in this project. Adjust any backend URLs or environment variable names to match changes in your backend implementation.
