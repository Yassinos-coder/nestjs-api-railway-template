# Publishing the Railway templates

This guide is for the maintainer. It creates two templates from this repository: **Lite** and **Full**. Railway's dashboard changes over time, so if a menu name differs, look for the closest match.

## Before you start

- The GitHub repository must be public.
- Check that `npm run build` and `npm test` pass on `main`.
- A template earns you a share of the usage of services deployed from it, so keep it published and maintained.

## Template 1: Lite (API + Redis)

For people who bring their own database (Supabase, Neon, RDS, and so on).

1. In Railway, open your workspace and go to **Templates**, then create a new template.
2. Add a service from the GitHub repo `Yassinos-coder/nestjs-api-railway-template`. Name it `API`.
3. Add a **Redis** service from Railway's database list. Name it `Redis`.
4. On the `API` service, set these variables:

| Variable | Value | Notes |
| --- | --- | --- |
| `NODE_ENV` | `production` | |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Reference to the Redis service |
| `JWT_SECRET` | `${{secret(48)}}` | Generated per deploy. Railway's template variable function, check the name in the dashboard |
| `SHIELD_TRUST_PROXY` | `cloudflare` | Correct client IP behind Railway |
| `DATABASE_URL` | empty, marked as a prompt for the deployer | Their own Postgres connection string |
| `DATABASE_SSL` | `true` | Most hosted databases need SSL |
| `CORS_ORIGINS` | empty, marked optional | Their frontend origin |

5. Enable a public domain for the `API` service.
6. Add the description and README (see below), then publish.

## Template 2: Full (API + Redis + Postgres)

For people who want everything on Railway.

1. Start from the Lite template and add a **Postgres** service named `Postgres`.
2. On the `API` service, change `DATABASE_URL` to `${{Postgres.DATABASE_URL}}` and `DATABASE_SSL` to `false`.
3. Publish it as a second template.

## Check it works

After publishing, deploy each template into a throwaway project and verify:

1. The deploy goes green and the healthcheck at `/health` passes.
2. `/health` shows `"database":"up"` on Full and `"database":"disabled"` on Lite (until the deployer sets their own URL).
3. `POST /auth/register` works on Full.
4. Calling `/demo/rate-limit` more than 5 times in 10 seconds returns `429`.

Then delete the throwaway project.

## Listing text

Name: **NestJS API (Redis + Postgres)** and **NestJS API (Redis, bring your own DB)**

Description: A secure NestJS API starter with JWT login, rate limiting and auto-ban (nestjs-shield), input sanitization, validated config and API docs. Built for AI coding agents: includes an AGENTS.md.

README for the template page:

- What you get: the feature list from the repository README.
- First steps: open `/docs` for API docs when `SWAGGER_ENABLED=true`, then clone the repository and give your coding agent the `AGENTS.md` file.
- Where to find your secrets: the `JWT_SECRET` is generated for you and is in the `API` service variables.

## Keeping it earning

- Put the month and year in the template description and refresh it when you ship an update.
- Share the deploy button in the nestjs-shield repository README and on social media.
- Keep dependencies current with `npm audit` and publish new versions.
