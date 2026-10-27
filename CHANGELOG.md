# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-27

### Added

- NestJS API starter with Helmet, global validation, optional CORS and graceful shutdown
- Abuse protection through nestjs-shield: rate limiting, auto-ban and Redis-backed counters (in-memory fallback)
- Optional Postgres access through `DATABASE_URL`, compatible with Railway, Supabase, Neon and other hosts
- `/health` endpoint for Railway healthchecks and a `/demo/rate-limit` example route
- Layered project structure (controller, service, repository) with a `demo` feature to copy
- `AGENTS.md` and `CLAUDE.md` so AI coding agents can extend the template
- Railway configuration and README with environment variable reference
- Input sanitization of all request data (HTML and script stripping, prototype pollution protection)
- hpp and gzip compression middleware
- Environment variable validation at startup with Joi
- Structured logging with redaction of authorization and cookie headers
- Interactive API docs at `/docs`
- `@nestjs/jwt` and `bcryptjs` preinstalled for authentication
- Jest, ESLint with security rules, and an audit script
