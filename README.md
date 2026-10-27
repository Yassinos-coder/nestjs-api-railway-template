# NestJS API - Railway Template

A complete NestJS API server you can deploy on Railway in one click, run on your own machine, or clone as the starting point for your own API. It comes with a layered project structure, optional Postgres, and built-in protection against abuse from [nestjs-shield](https://github.com/yassinos-coder/nestjs-shield) (rate limiting, auto-ban, Redis-backed counters).

## What it is, and what it is not

It is a foundation: server setup, security basics, config, health check, JWT login, and an example feature to copy. It does not include payments, roles, email or a frontend. You add those as feature modules.

Building with an AI coding agent? Point it at [AGENTS.md](AGENTS.md).

## What you get

- NestJS with Helmet, hpp, gzip, a global `ValidationPipe` and optional CORS
- Input sanitization (`xss`) on every request body, query and param
- Environment variables validated at startup with Joi
- Structured logs with `nestjs-pino`, with auth headers redacted
- Interactive API docs at `/docs` (off in production unless `SWAGGER_ENABLED=true`)
- JWT authentication: `POST /auth/register`, `POST /auth/login`, protected `GET /auth/me`, bcrypt password hashing, strict rate limits (needs a database)
- Tests with Node's built-in runner, ESLint with security rules, and `npm audit` ready to run
- `nestjs-shield` configured entirely through environment variables
- Redis storage for rate-limit counters (falls back to memory with a warning if Redis is unreachable)
- Optional Postgres through a single `DATABASE_URL`
- `/health` endpoint used by Railway for healthchecks
- `/demo/rate-limit` route (5 requests per 10 seconds) so you can see Shield respond with `429`

## Deploy on Railway

Two templates use this same repository:

| Template | Services | Use it when |
| --- | --- | --- |
| Lite | API + Redis | You bring your own database (Supabase, Neon, RDS, ...) |
| Full | API + Redis + Postgres | You want everything on Railway |

Publishing steps for the maintainer are in [docs/RAILWAY_TEMPLATES.md](docs/RAILWAY_TEMPLATES.md).

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Set to `production` on Railway |
| `PORT` | `3000` | Set by Railway |
| `LOG_LEVEL` | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent` |
| `SWAGGER_ENABLED` | on outside production | `true` or `false`, controls `/docs` |
| `CORS_ORIGINS` | empty (CORS off) | Comma-separated allowed origins |
| `SHIELD_LIMIT` | `60` | Requests per window, per client |
| `SHIELD_TTL` | `60000` | Window length in milliseconds |
| `SHIELD_TRUST_PROXY` | `cloudflare` | How to find the real client IP behind Railway |
| `REDIS_URL` | empty (memory) | Redis connection string |
| `DATABASE_URL` | empty (database off) | Any Postgres connection string |
| `DATABASE_SSL` | `false` | Set `true` for hosts that require SSL, such as Supabase |
| `JWT_SECRET` | random per boot in development | **Required in production**, at least 32 characters |
| `JWT_EXPIRES_IN_SECONDS` | `3600` | How long login tokens last |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## Using your own database

Set `DATABASE_URL` to any Postgres-compatible connection string. For Supabase or Neon, copy the connection string from their dashboard and set `DATABASE_SSL=true`. Leave it empty to run without a database.

Database access lives in `src/database/repositories`. Add your own repositories there and inject them into services.

## Local development

```bash
cp .env.example .env
npm install
npm run start:dev
```

```bash
for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w "%{http_code} " localhost:3000/demo/rate-limit; done
```

The first five calls return `200`, the rest `429`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Compile to `dist/` |
| `npm run start` | Run the compiled app |
| `npm run start:dev` | Run with file watching |
| `npm run lint` | Lint with security rules |
| `npm test` | Run tests |
| `npm run audit` | Check production dependencies for vulnerabilities |

## License

MIT
