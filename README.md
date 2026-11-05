# URL Shortener

A full-stack link shortening service: sign up, shorten long URLs (random or custom alias), set expiry dates, generate QR codes, and see click counts per link. Redirects are served from a Redis cache, and click analytics are recorded asynchronously through Kafka so they never slow down a redirect.

**Backend:** Java 25, Spring Boot 4, Spring Security (JWT), Spring Data JPA, MySQL, Redis, Apache Kafka, ZXing, Docker
**Frontend:** React 19, Vite, TanStack Query, React Router, Tailwind CSS

## Features

- **Auth** — BCrypt-hashed passwords, 15-minute JWT access tokens, and 7-day refresh tokens stored in MySQL and rotated on every use. Reusing a revoked refresh token logs the user out of all sessions. The frontend refreshes tokens automatically on a `401`.
- **Short codes** — 7-character base62 codes from `SecureRandom` (62⁷ ≈ 3.5 trillion combinations). Collisions are caught by a unique DB constraint and retried up to 5 times.
- **Custom aliases** — 3–30 characters, validated, with reserved words (`api`, `login`, `admin`, …) blocked.
- **Link expiry** — expired links return `410 Gone`.
- **Redis cache-aside** — redirects check Redis first; entries live for 30 minutes, capped at the link's expiry, and are evicted when a link is deleted.
- **Kafka click analytics** — each redirect publishes a `ClickEvent` (timestamp, referrer, user agent); a consumer persists it to MySQL, keeping the DB write off the redirect path.
- **Dashboard** — lists your links with click counts fetched in a single `GROUP BY` query, copy-to-clipboard, and on-demand QR codes (PNG, generated with ZXing).

## API (8 endpoints)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | — | Create account |
| `POST` | `/api/auth/login` | — | Get access + refresh tokens |
| `POST` | `/api/auth/refresh` | — | Rotate refresh token |
| `POST` | `/api/urls` | ✅ | Shorten a URL (`longUrl`, optional `customAlias`, `expiresAt`) |
| `GET` | `/api/urls` | ✅ | List your links with click counts |
| `DELETE` | `/api/urls/{id}` | ✅ | Delete a link (evicts cache) |
| `GET` | `/api/urls/{id}/qr` | ✅ | QR code PNG |
| `GET` | `/{code}` | — | Redirect (`302`), `404` if unknown, `410` if expired |

## Running locally

**Prerequisites:** Java 25, Node 20+, Docker

```bash
# 1. Start MySQL (schema auto-loaded from backend/db/schema.sql), Redis and Kafka
docker compose up -d

# 2. Backend (http://localhost:8080)
cd backend
export DB_PASSWORD=root
./mvnw spring-boot:run

# 3. Frontend (http://localhost:5173)
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

| Env variable | Default |
|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/urlshortener` |
| `DB_USERNAME` / `DB_PASSWORD` | `root` / *(empty)* |
| `REDIS_HOST` / `REDIS_PORT` | `localhost` / `6379` |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` |
| `APP_BASE_URL` | `http://localhost:8080` (prefix for generated short links) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` (comma-separated) |
| `JWT_SECRET` | dev-only value — set your own |

A `Dockerfile` (backend) and `vercel.json` (frontend SPA routing) are included for deployment.
