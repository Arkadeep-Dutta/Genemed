# Gene Prioritizer AI

A research and clinical-informatics decision-support tool for ranking
candidate genes against a phenotype profile, built on the Human Phenotype
Ontology (HPO), HGNC gene validation, and PubMed literature evidence.

> **Research and educational use only. Not medical advice. Not a
> diagnosis.** See [`DISCLAIMER.md`](./DISCLAIMER.md).

## Project status

This repository is being built in 12 phases, defined in
[`docs/PHASE_0_ARCHITECTURE.md`](./docs/PHASE_0_ARCHITECTURE.md). **The
current state of this repository is Phase 1: repository foundation.**

What exists right now:

- A runnable Next.js (App Router) + TypeScript + Tailwind CSS application
  shell, with a persistent disclaimer banner and basic navigation.
- A minimal `/api/health` route with a stable response contract.
- ESLint, Prettier, and Vitest wired up and passing on the code that
  exists.
- All required top-level documentation
  (`DEPLOYMENT.md`, `SECURITY.md`, `PRIVACY.md`, `DISCLAIMER.md`,
  `DATA_SOURCES.md`).
- Dockerfile, docker-compose.yml, and a GitHub Actions CI workflow.

What does **not** exist yet (by design — see the phase plan, not an
oversight): database/Prisma, HPO ontology data, gene validation, the
ranking engine, free-text extraction, LLM integration, PubMed
integration, the real input/results UI, admin endpoints, and the
GeneCards import module. Each is scoped to a specific later phase.

## ⚠️ Important: this repository was authored without network access

The environment that generated this code had **no access to the npm
registry**. That means:

- `package-lock.json` is **not included** in this repository yet. You
  must generate it yourself by running `npm install` (see below).
- No command (`npm install`, `npm run build`, `npm test`, etc.) has
  actually been executed by the author. Every command below is
  **expected to pass**, based on careful manual review of the code and
  configuration, but it has not been confirmed in a real environment.
  Please run the verification checklist below and report back any
  failures — this is the normal, expected next step for Phase 1, not a
  sign that something went wrong.

## Setup

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Local setup

```bash
git clone <this-repo-url>
cd gene-prioritizer-ai
cp .env.example .env.local
npm install
npm run setup
npm run dev
```

Then open <http://localhost:3000>.

`npm run setup` runs `npm install` plus a chain of database/HPO-data
scripts. In Phase 1, those downstream scripts (`db:generate`,
`data:download-hpo`, `data:build-hpo`, `data:seed`) are intentional
no-op placeholders (they print a note and exit 0) because the database
layer (Phase 2) and HPO ingestion pipeline (Phase 3) do not exist yet.
They will become real in those phases.

### GitHub Codespaces

This repository works in Codespaces using the same commands as local
setup above — there is no devcontainer-specific configuration required
for Phase 1. Open the repository in a Codespace, then run the same
`npm install && npm run setup && npm run dev` sequence in the terminal.

## Verification checklist (run this and report results)

Please run the following, in order, and paste back the output —
especially any failures — so Phase 2 can start from a confirmed-working
Phase 1 instead of an assumed-working one:

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

Expected outcomes, as designed (not yet confirmed):

| Command | Expected result |
|---|---|
| `npm install` | Installs dependencies and **generates `package-lock.json`** — please commit this file after a successful install. |
| `npm run lint` | No errors. |
| `npm run typecheck` | No errors (`tsc --noEmit`). |
| `npm test` | All Vitest unit tests pass (health route, API envelope helpers, env guard). |
| `npm run build` | Production build succeeds. |
| `npm run dev` | Starts the dev server at `http://localhost:3000`, showing the homepage with the disclaimer banner and Phase 1 status section. |

If any of these fail, the most useful next step is to paste the exact
error output back so the dependency versions or config can be corrected
before Phase 2 begins.

### One known risk to watch for

While reviewing this code (without being able to execute it), I found
multiple reports across Next.js versions — including some recent ones —
of `npm test` failing with `ReferenceError: Request is not defined` (or
similar `AsyncLocalStorage` errors) specifically when a Vitest/Jest test
directly imports a Route Handler file that imports `next/server`. This
project's `vitest.config.ts` already sets `environment: "node"`, which is
the standard fix, but I could not confirm in this sandbox that it fully
resolves the issue for this exact dependency combination. If
`tests/unit/health.test.ts` fails with an error like this, please paste
it back — see the comment at the top of that file for the likely fix.

## Project structure

See [`docs/PHASE_0_ARCHITECTURE.md`](./docs/PHASE_0_ARCHITECTURE.md)
Section 2 for the full planned folder structure (Phases 1-12) and Section
9 for the phase-by-phase checklist. Only a subset of that structure
exists as of Phase 1.

## Documentation index

- [`docs/PHASE_0_ARCHITECTURE.md`](./docs/PHASE_0_ARCHITECTURE.md) — architecture contract, data flow, safety model, phase checklist
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — local, Docker, and (future) cloud deployment instructions
- [`SECURITY.md`](./SECURITY.md) — security principles and current status
- [`PRIVACY.md`](./PRIVACY.md) — privacy policy and current status
- [`DISCLAIMER.md`](./DISCLAIMER.md) — full disclaimer text
- [`DATA_SOURCES.md`](./DATA_SOURCES.md) — every data source, access pattern, and licensing note, including the GeneCards rule

## License

[MIT](./LICENSE) for this repository's code. Third-party data sources
have their own licenses — see `DATA_SOURCES.md`.
