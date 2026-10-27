# NestJS API - Railway Template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/nestjs-api-redis)

A complete NestJS API server you can deploy on Railway in one click, run on your own machine, or clone as the starting point for your own API. It comes with a layered project structure, optional Postgres, and built-in protection against abuse from [nestjs-shield](https://github.com/yassinos-coder/nestjs-shield) (rate limiting, auto-ban, Redis-backed counters).

## What it is, and what it is not

It is a blank foundation: server setup, security basics, config, health check, and a `demo` folder that shows how each preinstalled library is used. It deliberately has no login system, users, payments, email or frontend. You, or your coding agent, add what you need as feature modules. If you use an external auth provider such as Supabase Auth, you only need to verify its tokens.

Building with an AI coding agent? Point it at [AGENTS.md](AGENTS.md).

## What you get

- NestJS with Helmet, hpp, gzip, a global `ValidationPipe` and optional CORS
- Input sanitization (`xss`) on every request body, query and param
- Environment variables validated at startup with Joi
- Structured logs with `nestjs-pino`, with auth headers redacted
- Interactive API docs at `/docs` (off in production unless `SWAGGER_ENABLED=true`)
- `bcryptjs` and `@nestjs/jwt` preinstalled for when you add authentication
- A `demo` folder ([src/demo](src/demo/README.md)) with working examples: rate limiting, validation and sanitization, password hashing, and database access
- Tests with Node's built-in runner, ESLint with security rules, and `npm audit` ready to run
- `nestjs-shield` configured entirely through environment variables
- Redis storage for rate-limit counters (falls back to memory with a warning if Redis is unreachable)
- Optional Postgres through a single `DATABASE_URL`, so you can use Supabase, Neon or any other host
- `/health` endpoint used by Railway for healthchecks

## Deploy on Railway

The Railway template deploys two services: this API and Redis. It does not create a database, so you are not paying for one you do not use. Bring your own by setting `DATABASE_URL` (for example a Supabase connection string).

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
