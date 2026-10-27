# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, and others) building on this template. Read this before changing code.

## What this project is

A general-purpose NestJS API server ("NestJS API - Railway Template"). It is a starting point for building any REST API, not a Shield demo. `nestjs-shield` is one built-in layer that adds rate limiting, auto-ban and Redis-backed counters. The app is designed to deploy on Railway and also runs locally. Postgres is optional and driven by `DATABASE_URL`.

Included: server bootstrap, security headers, input sanitization and validation, optional CORS, env validation, structured logging, API docs, health check, optional database access, Shield, tests, linting, and a `demo` feature (`src/demo/`) that shows how each library is used.

Deliberately not included: authentication, users, payments, email, migrations, a frontend. The template is blank so you can build what the user asks for. Many users authenticate with an external provider (for example Supabase Auth, Clerk or Auth0) and only need this API to verify the tokens that provider issues. Ask or check before building your own login system.

Start by reading `src/demo/`: it is a small working example of the layering and of each preinstalled library. Copy its shape for new features and delete it when it is no longer needed (remove `DemoModule` from `src/app.module.ts`).

Stack: NestJS 12, TypeScript 6, Express adapter, Node 22.12 or newer. Nest 12 packages are ESM, and the compiled CommonJS output relies on Node's `require(esm)` support, so do not lower the Node version.

## Note for the person driving you

The user may not be a programmer and may only describe what they want in plain language. Make the technical decisions yourself, follow the rules in this file, explain what you did in plain words, and never remove the safety layers listed below to make something "just work".

## Preinstalled libraries (already wired in, use them)

| Library | Purpose | Where |
| --- | --- | --- |
| `nestjs-shield` | Rate limiting, auto-ban, Redis counters | `app.module.ts`, decorators on routes |
| `helmet` | Security headers | `main.ts` |
| `hpp` | Blocks HTTP parameter pollution | `main.ts` |
| `xss` | Strips HTML and scripts from all incoming strings (body, query, params). Skips `password`, `currentPassword`, `newPassword`, `token` and drops `__proto__` keys | `src/common/utils/sanitize.util.ts`, `src/common/pipes/sanitize.pipe.ts` |
| `class-validator`, `class-transformer` | DTO validation, unknown fields rejected | `main.ts` global `ValidationPipe`, `dto/` folders |
| `joi` | Validates environment variables at startup so a bad config fails fast | `src/config/validators/env.validator.ts` |
| `nestjs-pino`, `pino` | Structured JSON logs. `authorization` and cookie headers are redacted. `/health` is not logged | `app.module.ts` |
| `@nestjs/swagger` | Interactive API docs at `/docs` (on by default outside production) | `main.ts`, `@ApiTags` on controllers |
| `compression` | gzip responses | `main.ts` |
| `@nestjs/config` | Typed config | `src/config/configuration.ts` |
| `pg` | Postgres client | `DatabaseRepository` |
| `bcryptjs` | Password hashing (demonstrated in `src/demo/services/demo.service.ts`) | `src/demo/` |
| `@nestjs/jwt` | Installed for signing or verifying JWTs. Not wired into any module yet: register `JwtModule` in the feature that needs it, with algorithms restricted to `HS256` (or your provider's), and read the secret from config | none yet |
| `node:test` (built into Node), `@nestjs/testing` | Tests | `*.spec.ts` next to the code |
| `eslint`, `typescript-eslint`, `eslint-plugin-security` | Linting including security rules | `eslint.config.mjs` |

## If the user asks for authentication

There is no auth in this template. Decide based on what the user already uses:

- **External provider (Supabase Auth, Clerk, Auth0, Firebase, Google or Apple sign-in through one of them):** the frontend logs in with the provider and sends its access token as `Authorization: Bearer ...`. Build a guard in `src/auth/guards/` that verifies that token (signature, expiry, issuer, audience) using the provider's documented keys, and put the verified user on the request. Do not build passwords or a users table.
- **No provider:** build email and password login with `bcryptjs` and `@nestjs/jwt`. Rules: never store, log or return a password or hash; return the same error for an unknown email and a wrong password; restrict JWT algorithms explicitly; require a strong `JWT_SECRET` (add it to the Joi schema, `.env.example` and the README); put a strict `@RateLimit` on register and login.

Never trust a role or user id sent by the client. Take identity only from a verified token.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run build` | Compile to `dist/` |
| `npm run lint` | Lint, including security rules |
| `npm test` | Compile and run tests with Node's built-in test runner |
| `npm run audit` | Check production dependencies for known vulnerabilities |
| `npm run start:dev` | Run with file watching |
| `npm run start` | Run the compiled app |

Do not upgrade TypeScript to 7.x. The Nest CLI needs the compiler API, which 7.0 does not expose.

Do not switch to Jest. Nest 12 packages are ESM-only and Jest cannot load them without a fragile setup. Write tests with `node:test` and `node:assert/strict`, as in the existing `*.spec.ts` files, and mock dependencies with `mock.fn` from `node:test`.

## Layout

```text
src/
├── main.ts                  bootstrap: logger, Helmet, hpp, compression, sanitize + validation pipes, CORS, Swagger
├── app.module.ts            root module: Config, Logger, Shield, Database, features
├── common/                  shared pipes and utils (only add here when a second feature needs it)
├── config/
│   ├── configuration.ts     the only place that reads process.env for app settings
│   └── validators/env.validator.ts   Joi schema for environment variables
├── database/
│   ├── database.module.ts
│   └── repositories/database.repository.ts   pg pool, query(), ping()
├── health/                  GET /health (skipped by Shield, used by Railway)
└── demo/                    working examples of Shield, validation, sanitization, bcrypt and the database layer (see demo/README.md)
```

Every feature is a folder with this shape:

```
feature-name/
├── feature-name.module.ts
├── controllers/
├── services/
├── repositories/
├── dto/
├── interfaces/
└── validators/
```

Create only the folders you need.

## Architecture rules

Request flow: Controller → Service → Repository → Database.

- **Controllers** handle HTTP only: read params and body, call one service method, return the result. No business logic and no database access.
- **Services** hold business logic and coordinate repositories. Inject repositories, never the `pg` pool.
- **Repositories** run queries and return typed rows. No business logic, no calling services. Inject `DatabaseRepository` and call its `query<T>(sql, params)`.
- **DTOs** live in `dto/` and use `class-validator` decorators. The global `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`, so any field without a decorator is rejected.
- **Interfaces and types** live in `interfaces/` inside the feature. Do not declare `interface` or `type` inline in services, controllers or repositories.
- **Validation logic** (guards on input, id checks, type guards) lives in `validators/` as classes with static methods.
- **Errors:** throw NestJS exceptions (`NotFoundException`, `BadRequestException`, and so on). Never throw a bare `Error`.
- Use early returns. Handle the error case first, then the happy path.
- Keep code self-explanatory. The existing code has no comments or JSDoc, so match that.
- Do not add an ORM. Use parameterized SQL through `DatabaseRepository.query`.

## How to add a feature

Example: a `notes` resource.

1. Create `src/notes/` with `notes.module.ts`, `controllers/notes.controller.ts`, `services/notes.service.ts`, `repositories/notes.repository.ts`, `dto/create-note.dto.ts`, `interfaces/note.interface.ts`.
2. In the repository, inject `DatabaseRepository` and run SQL:

```ts
@Injectable()
export class NotesRepository {
  constructor(private readonly database: DatabaseRepository) {}

  findAll(): Promise<Note[]> {
    return this.database.query<Note>('SELECT id, title FROM notes ORDER BY id');
  }
}
```

3. Import `DatabaseModule` in `notes.module.ts`.
4. Import `NotesModule` in `src/app.module.ts`.
5. Create tables with SQL you run against your database. The template has no migration tool. If you add one, put its files in a top-level `migrations/` folder and document the command here.
6. Write a `*.spec.ts` next to the service for its main logic.
7. Run `npm run build`, `npm run lint` and `npm test`.

## Database

- Configured only by `DATABASE_URL` (any Postgres-compatible host: Railway, Supabase, Neon, RDS) and `DATABASE_SSL` (`true` for hosts that require SSL).
- With `DATABASE_URL` unset the database is disabled. `DatabaseRepository.query` then throws `ServiceUnavailableException`, and `/health` reports `database: "disabled"`.
- To use a different database (MySQL, Mongo, Supabase client), replace `DatabaseRepository` and keep its public methods so services do not change.

## Shield (rate limiting and bans)

Shield is registered once in `app.module.ts` with `ShieldModule.forEnv()` and applies to every route. Tune it per route with decorators from `nestjs-shield`:

```ts
@RateLimit({ limit: 5, ttl: 60_000 })
@MaxPayload({ maxBodyBytes: 10_000_000 })
@SkipShield()
@SkipShield('rate-limit', 'slow-down')
```

- Use a strict `@RateLimit` on login, signup, password reset and any expensive route.
- Routes with a strict `@RateLimit` share one bucket per IP, so several strict routes together allow about the strictest limit per window. Keep this in mind when adding more.
- Use `@SkipShield()` only for infrastructure routes such as `/health`.
- Scanner probes (requests to paths like `/.env`) count toward auto-ban by default (`SHIELD_PROBES=true`). Repeated offenders get a `403` ban, stored in Redis when available.
- `forEnv()` also reads `SHIELD_AUTOBAN_THRESHOLD`, `SHIELD_AUTOBAN_WINDOW`, `SHIELD_AUTOBAN_DURATION`, `SHIELD_BURST_MAX`, `SHIELD_MAX_BODY_BYTES` and `SHIELD_ALGORITHM`. For options it does not expose (whitelist, blacklist, custom keys), switch `app.module.ts` to `ShieldModule.forRoot({ ... })` or `forRootAsync`. Full options: <https://github.com/yassinos-coder/nestjs-shield>
- The Shield admin dashboard is off. Leave it off unless the user asks, and then protect it with `SHIELD_ADMIN_USER` and `SHIELD_ADMIN_PASSWORD`.
- Behind Railway the real client IP depends on `SHIELD_TRUST_PROXY`. Keep it set to `cloudflare`.
- If Redis is unreachable, Shield falls back to in-memory counters and logs a warning. Do not make Redis a hard requirement.

## Configuration

- Add new settings to `src/config/configuration.ts` and read them through `ConfigService`. Do not read `process.env` anywhere else.
- Add every new variable to `src/config/validators/env.validator.ts`, `.env.example` and the table in `README.md`.
- Never commit `.env` or secrets.

## Deployment (Railway)

- `railway.json` sets the start command and uses `/health` as the healthcheck. Keep `/health` fast and unauthenticated.
- Railway provides `PORT`. The app already listens on `0.0.0.0`.
- Services: API + Redis. There is no Postgres service. Users bring their own database (for example Supabase) through `DATABASE_URL`. Reference the Redis variable in Railway as `REDIS_URL=${{Redis.REDIS_URL}}`.
- Set `NODE_ENV=production` on Railway. Swagger (`/docs`) is then off unless `SWAGGER_ENABLED=true`.
- Publishing steps for the Railway template are in `docs/RAILWAY_TEMPLATES.md`.

## Definition of done

1. `npm run build`, `npm run lint` and `npm test` all succeed.
2. New routes are covered by the right Shield decorator and have `@ApiTags`.
3. New env vars are in the Joi schema, `.env.example` and `README.md`.
4. Layering is respected and there are no inline types.
5. The safety layers (Helmet, hpp, sanitize pipe, ValidationPipe, Shield) are still in place.
