# Platform Monorepo

Turborepo monorepo with a NestJS API, a React admin dashboard and a shared Prisma database package.

| Path | What |
|------|------|
| `apps/backend` | NestJS REST API (`/api/v1`), JWT auth, uploads, audit log |
| `apps/admin` | Admin dashboard: Vite + React 19 + MUI 7 |
| `packages/db` | Prisma schema (MySQL 8), migrations, seed and the shared Prisma client (`@app/db`) |
| `packages/types` | Types shared by the API and the clients (`@app/types`) |

## Requirements

Node.js ≥ 20, npm, and MySQL 8 (local, or through Docker).

## Local development

```bash
npm install
cp .env.example .env        # set DATABASE_URL and JWT_ACCESS_SECRET (see below)
npm run db:migrate          # creates the first migration from prisma/schema.prisma
npm run db:seed             # creates the first admin account
npm run dev                 # API on :8080, admin on :5173
```

For local development set these in the root `.env`:
`DATABASE_URL="mysql://user:password@127.0.0.1:3306/app"`, `JWT_ACCESS_SECRET` (at least 16 characters),
`PUBLIC_URL=http://localhost:8080`, `CORS_ORIGINS=http://localhost:5173`.

Seeded admin: `admin@example.com` / `Admin@123` (override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

| Command | What |
|---------|------|
| `npm run dev` / `dev:backend` / `dev:admin` | Run everything or a single app |
| `npm run build` / `typecheck` | Build or typecheck every workspace |
| `npm run db:migrate` | Create and apply a migration after editing the schema |
| `npm run db:deploy` | Apply migrations (servers) |
| `npm run db:seed` / `db:reset` | Seed / wipe the database |

## Project structure

- **API modules**: see [apps/backend/src/modules/README.md](apps/backend/src/modules/README.md). Each module is one folder;
  responses use the envelope `{ success, statusCode, message, data, meta? }`.
- **Admin pages**: add a page in `apps/admin/src/pages`, a menu item in `src/layout/navigation.tsx` and a route in `src/App.tsx`.
  Reusable building blocks are in `src/components` (`ListView`, `FormDialog`, `KpiRow`, `SectionCard`, `StatusChip`…).
  Colours and the product name are in `src/theme.ts`.

## Deployment

**Docker (VPS):**

```bash
cp .env.example .env        # fill in the values
docker compose up -d --build
```

The API runs migrations on start and seeds an empty database when `SEED_ON_START=true`. Put an HTTPS reverse proxy
in front of `API_PORT`. Backup: `docker compose exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" app' > backup.sql`.

**Without Docker (Node.js host + PM2):** set `DATABASE_URL`, `PORT` and `UPLOAD_DIR` in `.env`, then run `bash scripts/deploy.sh`
(install, build, migrate, optional seed, `pm2 reload`).

**Admin dashboard:** `npm run build:admin` with `VITE_API_URL` set to the API URL, then serve `apps/admin/dist` as a static
SPA (`vercel.json` contains the SPA rewrite). Add its origin to `CORS_ORIGINS`.
