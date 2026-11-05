# API modules

All routes are under `/api/v1`. Every response uses the envelope
`{ success, statusCode, message, data, meta? }`; validation errors return `422` with `errors: { field: [message] }`.

Every route needs a bearer token unless it is marked `@Public()`. Use `@Roles('ADMIN')` to limit a controller or route to a role.

| Path | Routes | Who |
|------|--------|-----|
| `../auth` | `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`, `POST /auth/password` | public / signed in |
| `users` | `/users` list, detail, create, update (example CRUD module) | ADMIN |
| `uploads` | `POST /uploads` (images ≤ 5 MB, PDF ≤ 10 MB) | signed in |
| `../health.controller.ts` | `GET /health` | public |

## Adding a module

1. Create `modules/<name>/<name>.controller.ts` with the controller and its `@Module` (copy `users`).
2. Validate bodies with `new ZodPipe(schema)`; return `ok(data, message)` or `paged(items, total, pageArgs(query))`.
3. Throw the helpers from `common/http.ts` (`notFound`, `badRequest`, `conflict`, `forbidden`, `invalid`).
4. Register the module in `app.module.ts`. Move shared logic into a `<name>.service.ts` once it grows.

## Shared services (`../core`, global)

| Service | What |
|---------|------|
| `MailService` | SMTP email (logged to the console when `SMTP_HOST` is empty) |
| `StorageService` | Local disk storage served at `/uploads` |
| `AuditService` | Append-only audit trail |
