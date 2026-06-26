# Procuris

Integrated **HRIS + Purchasing** platform built as independent microservices behind a single
API gateway, with one React SPA covering every module. Each service owns its own MySQL schema —
no cross-service foreign keys; cross-service references are by ID and snapshotted where data must
stay stable (e.g. a branch's `code`/`name` are captured onto a purchase order at creation time).

> **Just want to start it?** Jump to [Quick start](#quick-start). Full run details, MySQL/Redis
> setup, and production notes live in **[RUN.md](RUN.md)**. The product/architecture spec
> (table schemas, full endpoint list, UI module breakdown) is **[prd.md](prd.md)**.

---

## What it does

Procuris is two systems that share authentication and a notification inbox:

- **HRIS** — manage branches (hierarchical), positions (hierarchical), and employees, with an
  org hierarchy. Backed by the Auth Service (identity/RBAC) + Employee Service.
- **Purchasing** — manage vendors, items, and purchase orders through a server-enforced state
  machine. Access is scoped by both role *and* branch.
- **Notifications** — a shared unread inbox/badge across both systems, fed by cron (contract /
  PO-expiry) and PO lifecycle events. Inbox data lives in Redis.

---

## Architecture

```
                 React SPA (Vite, :5173)
                          │
                          ▼
              API Gateway  (Node, :8080)        gateway/gateway.mjs
        ┌──────────┬───────────┬───────────────┐  routes by path prefix
        ▼          ▼           ▼               ▼
   auth :8001  employee :8002  purchase :8003  notification :8004
   db_auth     db_hrm          db_purchasing   Redis (+ db_notification
                                                for framework tables)
```

The SPA talks to **one origin only** (`VITE_API_GATEWAY_URL`, default `http://localhost:8080`).
The gateway is a zero-dependency Node reverse proxy that routes by path prefix:

| Path prefix | Service | Port | Schema |
|---|---|---|---|
| `/auth/*` | Auth Service | 8001 | `db_auth` |
| `/branches/*`, `/positions/*`, `/employees/*` (`/hris/*`) | Employee Service | 8002 | `db_hrm` |
| `/vendors/*`, `/items/*`, `/purchase-orders/*` (`/purchasing/*`) | Purchase Service | 8003 | `db_purchasing` |
| `/notifications/*` | Notification Service | 8004 | Redis (+ `db_notification`) |

**Service-to-service calls go direct, not through the gateway** (via `*_SERVICE_URL` env):
Employee → Auth and Purchase → Auth + Employee. There is no shared session store —
Auth Service's `GET /auth/me` is the single source of truth for identity and role, validated
on every incoming request to the other services.

---

## Tech stack

| Layer | Stack |
|---|---|
| Backend services | PHP 8.2, Laravel 11, Pest (tests) |
| Auth | `tymon/jwt-auth` (JWT access + refresh, refresh-token blacklist on logout) |
| Notifications | Redis via `predis` / `phpredis` |
| Gateway | Node (built-in `http`, no dependencies) |
| Frontend | React 19, Vite, TypeScript, React Router 7, TanStack Query + Table, Zustand, React Hook Form + Zod, Tailwind 4, Sonner |
| Frontend tests | Vitest + Testing Library, MSW, Playwright (E2E) |
| Database | MySQL 8 (one schema per service); SQLite supported for quick local runs |

---

## Roles & access control

Six roles in `db_auth.users.role`: `superadmin`, `admin_hrd`, `admin_cabang`, `karyawan`,
`admin_purchasing`, `staff_purchasing`.

Purchasing access is scoped by **role + branch**, enforced server-side (the SPA mirrors it with
per-role route guards, but never as the only gate):

- `staff_purchasing` / `admin_cabang` — create/view POs for their own `branch_id` only
- `admin_purchasing` — approve/reject any PO, view all branches
- `superadmin` — unrestricted

---

## Purchase Order workflow

State machine enforced server-side (not just in the UI):

```
draft → submitted → approved → received
              ↓
           rejected
draft/submitted → cancelled
```

- PO items are editable only while `draft`.
- `rejected` requires a `rejection_reason`.
- On `received`, each item's `last_price` is updated from that PO line's `unit_price`.
- `po_number` format: `PO/{KODE_CABANG}/{TAHUN}/{NOMOR_URUT}` (e.g. `PO/BDG/2026/0001`).
- Employees, vendors, and items use **soft delete** (`is_active`) — never hard delete.

---

## Project structure

```
procuris-app/
├── gateway/gateway.mjs        # Node reverse proxy (:8080)
├── run-dev.ps1                # one-shot: migrate + seed + start 4 services + gateway (Windows)
├── services/
│   ├── auth-service/          # Laravel — JWT auth + RBAC (:8001, db_auth)
│   ├── employee-service/      # Laravel — branches/positions/employees (:8002, db_hrm)
│   ├── purchase-service/      # Laravel — vendors/items/POs (:8003, db_purchasing)
│   └── notification-service/  # Laravel — Redis inbox (:8004)
├── frontend/                  # React SPA (Vite, :5173)
│   └── src/features/{auth,hris,purchasing}/
├── RUN.md                     # detailed run guide (MySQL + Redis, production notes)
└── prd.md                     # full spec: schemas, endpoints, UI modules
```

---

## Prerequisites

- **PHP 8.2+** with Composer
- **Node 18+** (20+ recommended) with npm
- **MySQL 8** — for the default `run-dev.ps1` flow (or use SQLite for a no-DB-server quick run; see RUN.md)
- **Redis 6+** + the `phpredis` extension — only needed for the notification inbox
  (`/notifications` returns 500 without it; everything else works). On Windows use Memurai or
  Redis in WSL/Docker.

---

## Quick start

**Windows (recommended)** — `run-dev.ps1` copies each `.env`, generates keys + JWT secret,
migrates, seeds the auth admin, and starts all four services plus the gateway:

```powershell
# from procuris-app/
powershell -ExecutionPolicy Bypass -File run-dev.ps1 -DbUser root -DbPass <yourpass>
# creates/uses schemas: db_auth, db_hrm, db_purchasing, db_notification

cd frontend
npm install
npm run dev          # SPA on http://localhost:5173
```

Open <http://localhost:5173> and log in with the seeded admin:

```
super@procuris.test  /  password
```

**Manual / non-Windows** — per service: `composer install`, copy `.env.example` → `.env`, set
`DB_*`, then `php artisan key:generate`, `php artisan jwt:secret` (auth only),
`php artisan migrate --seed`, and `php -S 127.0.0.1:<port> -t public`. Start the gateway with
`node gateway/gateway.mjs`. See **[RUN.md](RUN.md)** for the full step-by-step, including the
MySQL-per-schema and production-ish (php-fpm/nginx) layouts.

---

## Configuration

Each service reads a Laravel `.env`. Key variables:

| Variable | Where | Purpose |
|---|---|---|
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | all services | per-service MySQL schema |
| `APP_KEY` | all services | `php artisan key:generate` |
| `JWT_SECRET` | auth-service | `php artisan jwt:secret` |
| `AUTH_SERVICE_URL`, `EMPLOYEE_SERVICE_URL` | employee / purchase / notification | direct service-to-service calls |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_CLIENT`, `NOTIFICATION_TTL_DAYS` | notification-service | inbox storage |
| `VITE_API_GATEWAY_URL` | frontend | gateway origin (default `http://localhost:8080`) |
| `GATEWAY_PORT`, `FRONTEND_URL`, `GATEWAY_ALLOWED_ORIGINS`, `AUTH_URL`/`EMPLOYEE_URL`/`PURCHASE_URL`/`NOTIFICATION_URL` | gateway | port, CORS allow-list, upstream targets |

---

## Testing

```bash
# Backend (per service)
cd services/<service> && ./vendor/bin/pest

# Frontend
cd frontend
npm test            # Vitest unit/integration
npm run test:e2e    # Playwright E2E
npm run lint        # oxlint
```

---

## Status

All four services and the frontend are coded with tests passing, verified end-to-end through the
gateway (login, `/auth/me`, branches, positions, vendors, items, purchase-orders incl.
cross-service JWT validation). **Remaining infra TODO:** no root `docker-compose` / orchestration
yet — see the production notes in [RUN.md](RUN.md).
