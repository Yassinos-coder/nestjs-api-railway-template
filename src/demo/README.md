# Demo feature

A working reference for how the preinstalled libraries are used. Copy its shape for new features, then delete this folder (and remove `DemoModule` from `src/app.module.ts`) when you no longer need it.

| Route | Shows | Where to look |
| --- | --- | --- |
| `GET /demo/rate-limit` | `nestjs-shield`: a strict per-route `@RateLimit` (5 requests per 10 seconds, then `429`) | `controllers/demo.controller.ts` |
| `POST /demo/notes` | `class-validator` DTO rules, unknown fields rejected, and HTML stripped from input by the global sanitize pipe | `dto/create-note.dto.ts` |
| `POST /demo/password-hash` | `bcryptjs` password hashing and comparing | `services/demo.service.ts` |
| `GET /demo/database` | Controller → Service → Repository → `DatabaseRepository.query`. Returns `503` when `DATABASE_URL` is not set | `repositories/demo.repository.ts` |

Try them, with the server running:

```bash
curl -X POST localhost:3000/demo/notes -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"<script>alert(1)</script><b>safe</b>"}'
```

The response content is `safe`: the tags were stripped. Sending an extra field such as `"admin":true` returns `400`.

Interactive docs for all of these are at `/docs` when `SWAGGER_ENABLED` is on (the default outside production).
