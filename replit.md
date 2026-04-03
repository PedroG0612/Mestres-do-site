# Mestres do Site

A Brazilian digital marketing agency landing page and lead generation platform.

## Overview

Professional landing page ("optipage") for **Mestres do Site**, a digital marketing agency focused on helping Brazilian businesses get more clients through website creation, paid traffic, organic traffic, and inbound marketing.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + shadcn/ui (Radix UI)
- **Backend**: Node.js + Express + tRPC
- **ORM**: Drizzle ORM with PostgreSQL (migrated from MySQL on Replit)
- **Build**: Vite (frontend) + ESBuild (backend)
- **Package Manager**: pnpm

## Project Structure

```
/client        - React frontend (Vite)
  /src/pages   - Home.tsx, PrivacyPolicy.tsx, NotFound.tsx
  /src/components - shadcn/ui + custom components
  /src/contexts - ThemeContext
  /src/lib     - tRPC client, utils
/server        - Express + tRPC backend
  /_core       - Server setup (OAuth, tRPC, Vite middleware)
  routers.ts   - API routes (leads, auth)
  db.ts        - Database queries
/shared        - Shared types/constants
/drizzle       - Database schema + migrations
```

## Running the App

```bash
pnpm run dev   # Development (port 5000)
pnpm run build # Production build
pnpm run start # Production server
```

## Key Features

- **Lead capture form** — Validates and stores leads (name, email, phone, company, role) via tRPC → PostgreSQL
- **WhatsApp CTAs** — Multiple strategic WhatsApp redirect buttons throughout the page
- **Animated landing page** — Framer Motion scroll animations, stat counters, FAQ accordion
- **Privacy Policy page** — LGPD-compliant at `/politica-de-privacidade`
- **Admin protected routes** — Lead listing for authenticated admins

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (provided automatically by Replit)
- `JWT_SECRET` — Cookie signing secret (set during migration)
- `OAUTH_SERVER_URL` — OAuth server for admin auth (optional, add via Secrets for full auth)
- `VITE_APP_ID` — App ID for OAuth (optional)
- `OWNER_OPEN_ID` — OpenID of the admin user (optional)

## Deployment

- **Target**: Autoscale
- **Build**: `pnpm run build`
- **Run**: `node dist/index.cjs`
- **Port**: 5000

## Replit Migration Notes

- Migrated database from MySQL to PostgreSQL (Replit's built-in database)
- Updated Drizzle schema and config to use `pg` driver instead of `mysql2`
- The `dev` script uses locally installed `tsx` (not `npx tsx`) to avoid interactive prompts
- The workflow "Start application" runs `npm run dev` on port 5000 with webview output
- Analytics script removed from `index.html` (was causing Vite substitution errors); add `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` env vars if needed
- OAuth warnings at startup are expected if `OAUTH_SERVER_URL` is not configured — app runs fine without it
