# Candy Joy Chocolate

## Overview

Full-stack website for Candy Joy Chocolate (كاندي جوي شوكوليت) — a premium chocolate and gift shop in Abu Dhabi, UAE. Includes a public storefront, admin panel, REST API, and PostgreSQL database.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/candy-joy)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Build**: esbuild (CJS bundle for server), Vite (frontend)
- **Routing**: wouter (frontend)
- **Animations**: framer-motion

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Pages

### Public Site
- `/` — Home page: hero, featured products, reviews, why choose us
- `/menu` — Shop: product grid with category filters and search
- `/about` — About Us: brand story, values, timeline
- `/contact` — Contact form, map, store info

### Admin Panel (JWT protected)
- `/admin/login` — Login with username/password
- `/admin` — Dashboard: stats, products manager, reviews manager, messages manager, settings

## Admin Credentials (defaults)
- Username: `admin`
- Password: `candy123`
- Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` in environment for production

## API Routes (base: /api)
- GET/POST `/products` — list or create products
- GET/PUT/DELETE `/products/:id` — single product operations
- GET/POST `/reviews` — list or create reviews
- DELETE/PATCH `/reviews/:id` — delete or toggle visibility
- GET/POST `/messages` — list (admin) or create contact messages
- DELETE/PATCH `/messages/:id` — delete or mark read
- POST `/auth/login` — admin login, returns JWT
- POST `/auth/logout` — logout
- GET `/auth/me` — get current admin
- GET/PUT `/settings` — store settings (phone, address, social links)
- GET `/admin/stats` — dashboard stats

## Database Tables
- `products` — product catalog
- `reviews` — customer reviews
- `messages` — contact form submissions
- `settings` — store configuration (phone, address, social links)

## Business Info
- Phone: +971 56 777 2003
- WhatsApp: https://wa.me/971567772003
- Location: Refah Gift Market, Industrial Area, Shiebat Al Salam, Abu Dhabi
