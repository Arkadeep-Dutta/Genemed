# Deployment

This document is filled in incrementally as each phase adds deployment
surface area. As of **Phase 1**, only local development and a basic
Docker build are meaningfully documented — Vercel/Railway/Render
instructions are deferred to Phase 11, since the app does not yet have a
database or any feature worth deploying publicly.

## Local development

```bash
cp .env.example .env.local
npm install
npm run setup
npm run dev
```

Open <http://localhost:3000>.

No environment variables are required to be filled in for Phase 1 — the
defaults in `.env.example` are sufficient, since no database, LLM, or
external API integration exists yet.

## GitHub Codespaces

Open this repository in a Codespace and run the same commands as local
development above. No devcontainer-specific setup is required for Phase
1; this will be revisited if Phase 2's database requirements call for a
Postgres-in-Codespaces setup.

## Docker / Docker Compose

```bash
docker compose up --build
```

This builds the `app` image from the `Dockerfile` and starts it alongside
a PostgreSQL `db` service. **Note:** as of Phase 1, the application does
not actually use the database — the `db` service is included now so the
Compose topology and `DATABASE_URL` wiring are stable ahead of Phase 2,
not because Phase 1 features depend on it.

The `Dockerfile` runs `npm ci`, which requires `package-lock.json` to be
present and committed. If you have not yet run `npm install` locally and
committed the resulting lockfile, `docker compose up --build` will fail
at the `npm ci` step — this is expected until that lockfile exists (see
`README.md`).

To stop and remove the containers:

```bash
docker compose down
```

## Production build (without Docker)

```bash
npm run build
npm run start
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm install` (not yet
`npm ci` — see the note inside that file), lint, typecheck, unit tests,
and build on every push/PR to `main`. Playwright end-to-end tests are not
wired into CI yet; that happens in Phase 8 once there is a real UI flow
to test.

## Cloud deployment (Vercel, Railway, Render)

**Not yet documented.** These require a real database (Phase 2) and at
least the HPO-code ranking workflow (Phase 5) to be worth deploying
publicly. Full instructions for each target are added in Phase 11.

## Environment variables

See [`.env.example`](./.env.example) for the complete variable contract
across all phases, and `docs/PHASE_0_ARCHITECTURE.md` Section 6 for which
phase introduces each one. As of Phase 1, no variable is required to be
set to anything other than its example default.
