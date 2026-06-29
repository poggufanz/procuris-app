# Running Procuris locally

The React SPA talks to a single origin (`VITE_API_GATEWAY_URL`, default `http://localhost:8080`).
That origin is the **API gateway** (`gateway/gateway.mjs`, zero-dependency Node reverse proxy) which
routes by path prefix to the four backend services:

| Path prefix | Service | Port |
|---|---|---|
| `/auth/*` | auth-service | 8001 |
| `/branches/*`, `/positions/*`, `/employees/*` | employee-service | 8002 |
| `/vendors/*`, `/items/*`, `/purchase-orders/*` | purchase-service | 8003 |
| `/notifications/*` | notification-service | 8004 |

Service-to-service calls (employee→auth, purchase→auth+employee) go direct via `*_SERVICE_URL` env
defaults, not through the gateway.

## Quickstart

```powershell
powershell -ExecutionPolicy Bypass -File run-dev.ps1   # Redis + 4 services + gateway
cd frontend; npm install; npm run dev                  # SPA on http://localhost:5173
```

Login: `super@procuris.test` / `password`.

`run-dev.ps1` migrates/seeds each service, starts all four + the gateway, and **auto-starts Redis**
on `:6379` via Docker (see below). Flags:

- `-DbUser` / `-DbPass` — MySQL credentials (default `root` / `12345`).
- `-RedisPort` — Redis port (default `6379`).
- `-SkipRedis` — don't touch Redis (use when you run Memurai/WSL Redis yourself).

Verified working end-to-end through the gateway: login, `/auth/me`, branches, positions, vendors,
items, purchase-orders (incl. cross-service JWT validation), and `/notifications`.

### Notifications need Redis
`notification-service` stores its inbox in Redis (`RedisNotificationRepository`), so `/notifications`
requires a running Redis on `127.0.0.1:6379`. It uses the **`predis`** client (pure PHP) — **no
`phpredis` extension needed**. Without Redis up, `/notifications` returns 500 / hangs; everything
else works.

`run-dev.ps1` brings Redis up automatically: if `:6379` is already listening it does nothing; else
it runs `docker start redis` (or creates the container with `--restart unless-stopped`). Requirements:
**Docker Desktop installed and its engine running.** First call after installing Docker needs a fresh
terminal so `docker` is on `PATH` (the script also falls back to
`C:\Program Files\Docker\Docker\resources\bin`).

No Docker? Run Redis yourself (Memurai native Windows, or Redis in WSL) and pass `-SkipRedis`. The
script auto-sets `REDIS_CLIENT=predis` in `notification-service/.env` on every run.

## Docker Compose (full stack)
Root `docker-compose.yml` brings up the whole system: MySQL (one schema per service,
auto-created by `docker/mysql-init.sql`), Redis, the four services (php-fpm+nginx+supervisor),
the Node gateway, and the SPA served by nginx.

```bash
cp .env.example .env                                   # then fill APP_KEY / JWT_SECRET / MYSQL_ROOT_PASSWORD
docker compose run --rm auth-service php artisan key:generate --show   # paste into APP_KEY
docker compose run --rm auth-service php artisan jwt:secret --show     # paste into JWT_SECRET
docker compose up --build
```

- SPA: http://localhost:8081  •  Gateway: http://localhost:8080  (`/health` for targets)
- Each service runs `php artisan migrate --force` on start (entrypoint waits for MySQL first).
- First run only — seed the auth login: `docker compose exec auth-service php artisan db:seed --force`
  (then log in as `super@procuris.test` / `password`).
- Services aren't published to the host; the gateway reaches them over the compose network by name.

## Production-ish (manual MySQL + Redis, no compose)
Point each service `.env` at MySQL (`DB_CONNECTION=mysql`, one schema per service:
`db_auth`, `db_hrm`, `db_purchasing`, `db_notification`) and a shared Redis, then
`php artisan migrate --seed` per service. Run each behind php-fpm/nginx and keep the gateway
(or replace it with an nginx reverse proxy using the same prefix table above).

## Notes
- `php artisan serve` fails to bind on some Windows PHP builds; the scripts use `php -S 127.0.0.1:PORT -t public`.
- auth & employee test envs need `JWT_SECRET` / `APP_KEY` (set in their `phpunit.xml`).
- Built on Laravel 11.31; on PHP 8.5 you'll see a benign `PDO::MYSQL_ATTR_SSL_CA` deprecation from the framework's bundled config. Run on PHP 8.4 or upgrade the framework to silence it.
