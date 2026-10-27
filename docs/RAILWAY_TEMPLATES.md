# Publishing the Railway template

This guide is for the maintainer. The template deploys two services: the API and Redis. It has no database service on purpose, so users who already have one (for example Supabase) do not pay for a second. Railway's dashboard changes over time, so if a menu name differs, look for the closest match.

## Before you start

- The GitHub repository must be public.
- Check that `npm run build` and `npm test` pass on `main`.
- A template earns you a share of the usage of services deployed from it, so keep it published and maintained.

## Build the template

1. In Railway, open your workspace and create a new template project.
2. Add a service from the GitHub repo `Yassinos-coder/nestjs-api-railway-template`.
3. Add a **Redis** service from Railway's database list. Keep its name as `Redis`.
4. On the API service, open **Variables → RAW Editor** and paste:

```env
NODE_ENV=production
REDIS_URL=${{Redis.REDIS_URL}}
SHIELD_TRUST_PROXY=cloudflare
DATABASE_SSL=true
DATABASE_URL=
CORS_ORIGINS=
```

If the editor rejects the empty values, remove `DATABASE_URL=` and `CORS_ORIGINS=`. The app runs without them.

5. Add a description to `DATABASE_URL` such as "Optional: your Postgres connection string (Supabase, Neon, ...)" and to `CORS_ORIGINS` such as "Optional: your frontend URL".
6. Enable a public domain for the API service.
7. Click **Publish to Marketplace** and fill in the listing.

## Listing text

Name: **NestJS API (Redis)**

Description: A secure, blank NestJS API starter with rate limiting and auto-ban (nestjs-shield), input sanitization, validated config, API docs and a demo folder. Built for AI coding agents: includes an AGENTS.md.

README for the template page:

- What you get: the feature list from the repository README.
- First steps: clone the repository, open it with your coding agent and tell it what to build. It will read `AGENTS.md` and `src/demo`.
- Bring your own database: set `DATABASE_URL` to your Supabase (or any Postgres) connection string.

## Check it works

After publishing, deploy it into a throwaway project and verify:

1. The deploy goes green and the healthcheck at `/health` passes.
2. `/health` shows `"database":"disabled"` until a `DATABASE_URL` is set.
3. Calling `/demo/rate-limit` more than 5 times in 10 seconds returns `429`.
4. `/docs` returns 404, because `NODE_ENV=production` turns Swagger off.

Then delete the throwaway project.

## Keeping it earning

- Put the month and year in the template description and refresh it when you ship an update.
- Share the deploy button in the nestjs-shield repository README and on social media.
- Keep dependencies current with `npm audit` and publish new versions.
