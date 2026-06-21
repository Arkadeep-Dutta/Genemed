# Phase 0 — Architecture Contract

**Project:** Gene Prioritizer AI
**Status:** Design contract, agreed before any Phase 1+ code is written.
**Purpose:** This document is the single source of truth for what the system is, what it is not, and how each later phase must remain compatible with it. Any deviation in a later phase must be called out explicitly in that phase's audit.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                           │
│  Next.js App Router pages/components — React + Tailwind             │
│  No secrets. No direct DB or external API access.                   │
└───────────────────────────┬───────────────────────────────────────--┘
                            │ fetch() — same-origin only
┌───────────────────────────▼───────────────────────────────────────--┐
│                  Next.js Route Handlers (Server)                    │
│  /api/health  /api/hpo/*  /api/genes/*  /api/prioritize             │
│  /api/phenotype/extract  /api/literature/*  /api/admin/*            │
│  - Zod validation on every input                                    │
│  - Consistent JSON envelope (ok/data/error)                         │
│  - Rate limiting (Upstash Redis or in-memory fallback)              │
│  - Auth check for /api/admin/* and /api/import/*                    │
└───────┬───────────────┬───────────────┬───────────────┬─────────────┘
        │               │               │               │
┌───────▼──────┐ ┌──────▼───────┐ ┌─────▼────────┐ ┌────▼─────────────┐
│ HPO Ontology  │ │ Gene Validation│ │ Ranking Engine│ │ Literature Module │
│ Service       │ │ (HGNC client)  │ │ (deterministic)│ │ (PubMed client)   │
│ - local JSON  │ │ - cached       │ │ - explainable │ │ - cached          │
│   index       │ │ - never fails  │ │   scoring     │ │ - no fabrication  │
│ - NLM fallback│ │   open         │ │ - LLM-optional│ │ - graceful        │
│   search only │ │                │ │   boost only  │ │   degradation     │
└──────┬────────┘ └──────┬─────────┘ └──────┬────────┘ └────────┬──────────┘
       │                 │                  │                   │
       │          ┌──────▼──────────────────▼───────────────────▼──────┐
       │          │              Prisma ORM Data Layer                  │
       │          │   PostgreSQL (prod) / SQLite (local dev fallback)   │
       │          └──────────────────────────┬───────────────────────--─┘
       │                                     │
┌──────▼─────────────────────────────────────▼────────────────────────┐
│                     Local Data Store (filesystem)                    │
│  HPO_DATA_DIR: hp.json, phenotype_to_genes.txt, genes_to_phenotype.txt│
│  Built once via `data:download-hpo` + `data:build-hpo`, versioned    │
└───────────────────────────────────────────────────────────────────--─┘

External services (all optional, all server-side only, all degrade gracefully):
  - LLM provider (OpenAI/Anthropic/Gemini) — phenotype extraction assist only
  - NCBI E-utilities (PubMed) — literature evidence
  - NLM ClinicalTables — HPO autocomplete fallback only
  - HGNC REST API — gene symbol canonicalization
  - GeneCards — LINKOUT ONLY, never fetched server-side, never scraped
```

### Architectural principles

1. **Local-first ontology.** HPO data lives on disk after a one-time download/build step. The app's core workflow (HPO codes → ranked genes) must never depend on a live network call at request time.
2. **Deterministic core, optional LLM veneer.** The ranking engine is pure, testable, explainable code. An LLM may assist free-text → HPO extraction, but it never decides gene rank, and it never runs ranking itself.
3. **Fail closed, not open.** Any external dependency that is unavailable (HGNC, PubMed, LLM) causes a clearly labeled degraded state, never a silent "treat as valid" fallback.
4. **No secret ever reaches the browser.** All provider keys, the admin secret, and the database URL are server-only environment variables, read only inside Route Handlers / server modules, never inside files imported by client components.
5. **GeneCards is consulted, never harvested.** The only permitted contact with GeneCards is generating an outbound `<a href>` link built from a gene symbol — no `fetch`, no HTML parsing, no caching of GeneCards content, ever, anywhere in the codebase. The only path for GeneCards *data* (not links) into the system is a manual, admin-gated, license-confirmed file upload of data the admin already legally obtained elsewhere.

---

## 2. Full Planned Folder Structure

This is the target structure for the *complete* project (Phase 12). Phase 1 implements only the subset needed for a runnable shell; later phases fill in the rest without restructuring what exists.

```
gene-prioritizer-ai/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── PHASE_0_ARCHITECTURE.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── scripts/
│   ├── data/
│   │   ├── download-hpo.ts
│   │   ├── build-hpo.ts
│   │   └── update-hpo.ts
│   └── setup.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── methodology/page.tsx
│   │   ├── data-sources/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── admin/
│   │   │   └── data/page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── data/version/route.ts
│   │       ├── hpo/
│   │       │   ├── search/route.ts
│   │       │   └── term/[id]/route.ts
│   │       ├── phenotype/extract/route.ts
│   │       ├── genes/validate/route.ts
│   │       ├── prioritize/route.ts
│   │       ├── literature/search/route.ts
│   │       ├── admin/data/update/route.ts
│   │       └── import/genecards/route.ts
│   ├── components/
│   │   ├── ui/                  (buttons, cards, tabs, table primitives)
│   │   ├── DisclaimerBanner.tsx
│   │   ├── PhenotypeInputTabs.tsx
│   │   ├── PhenotypeConfirmationPanel.tsx
│   │   ├── RankingResultsTable.tsx
│   │   ├── GeneDetailDrawer.tsx
│   │   ├── EvidenceBreakdown.tsx
│   │   └── LiteratureEvidenceList.tsx
│   ├── lib/
│   │   ├── env.ts                       (server-only env validation)
│   │   ├── apiResponse.ts               (success/error envelope helpers)
│   │   ├── rateLimit.ts
│   │   ├── logger.ts
│   │   ├── hpo/
│   │   │   ├── parse.ts
│   │   │   ├── repository.ts
│   │   │   ├── search.ts
│   │   │   └── validate.ts
│   │   ├── genes/
│   │   │   ├── hgnc.ts
│   │   │   ├── validateGeneSymbols.ts
│   │   │   └── genecardsLink.ts
│   │   ├── ranking/
│   │   │   ├── rankGenes.ts
│   │   │   ├── scoring.ts
│   │   │   ├── inputHash.ts
│   │   │   ├── types.ts
│   │   │   └── explain.ts
│   │   ├── phenotype/
│   │   │   ├── extract.ts
│   │   │   ├── negation.ts
│   │   │   ├── deterministicMatcher.ts
│   │   │   └── types.ts
│   │   ├── llm/
│   │   │   ├── provider.ts
│   │   │   ├── schema.ts
│   │   │   └── prompts.ts
│   │   ├── literature/
│   │   │   ├── pubmed.ts
│   │   │   ├── search.ts
│   │   │   ├── cache.ts
│   │   │   ├── summarize.ts
│   │   │   └── types.ts
│   │   └── db/
│   │       └── client.ts                (Prisma client singleton)
│   └── types/
│       └── api.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│       └── hpo-mini/                    (tiny offline HPO dataset for tests)
├── e2e/
│   └── playwright/
├── public/
│   └── robots.txt
├── .env.example
├── .eslintrc.json  (or eslint.config.mjs)
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── README.md
├── DEPLOYMENT.md
├── SECURITY.md
├── PRIVACY.md
├── DISCLAIMER.md
├── DATA_SOURCES.md
└── LICENSE
```

**Phase 1 implements:** top-level config files, `src/app/layout.tsx` + `src/app/page.tsx` (shell only), `src/lib/env.ts` stub, CI workflow, Docker files, and all required `.md` docs. Everything else above is a forward-looking map, not a Phase 1 deliverable — folders for later phases are *not* pre-created empty in Phase 1, to avoid the appearance of fake completeness.

---

## 3. Data Flow

```
 [1] User input
     ├─ Free text  ──────────────┐
     ├─ HPO codes  ──────────────┤
     ├─ Candidate genes ─────────┤
     └─ Structured metadata ─────┤
                                 ▼
 [2] Phenotype normalization layer
     - Free text → /api/phenotype/extract
         - LLM-assisted term suggestion (if configured) OR
         - deterministic keyword/synonym matcher (if DISABLE_LLM=true)
         - negation + uncertainty + family-history-only detection
     - Raw HPO codes → /api/hpo/term/[id] validation (format + existence)
                                 ▼
 [3] HPO confirmation
     - User reviews extracted/validated terms in the UI
     - User can accept, reject, or manually add/remove HPO terms
     - Only confirmed terms proceed
                                 ▼
 [4] Gene candidate handling
     - Optional candidate gene list → /api/genes/validate (HGNC canonicalization)
     - Unvalidated genes are flagged, never silently treated as valid
                                 ▼
 [5] Gene association retrieval
     - Confirmed HPO terms → local genes_to_phenotype / phenotype_to_genes index
     - Produces the full candidate gene universe with raw association evidence
                                 ▼
 [6] Ranking
     - /api/prioritize runs the deterministic scoring engine over:
         exact/ancestor HPO match, specificity weighting, candidate-gene boost,
         validation-state penalty, literature boost (0 until Phase 7 wired in)
     - Produces a "prioritization score" (explicitly not a diagnostic probability)
     - Every gene's score is decomposable into named contributing factors
                                 ▼
 [7] Literature evidence
     - Top genes (+ confirmed phenotypes) → /api/literature/search
     - Real PubMed records only, cached, gracefully absent if PubMed is down
                                 ▼
 [8] Report
     - Ranked table + evidence breakdown + literature + disclaimer
     - Export as CSV / JSON / Markdown
     - Raw free text is excluded from exports unless the user explicitly opts in
```

---

## 4. Safety Model

| Concern | Mechanism |
|---|---|
| Tool could be mistaken for a diagnostic device | Persistent disclaimer banner on every page; "prioritization score" terminology only, never "diagnosis" or "probability of disease"; DISCLAIMER.md; every report export includes the disclaimer text |
| PHI / identifiable patient data entry | Visible HIPAA warning; raw free text not stored by default; privacy-first mode; redaction hook if storage is explicitly enabled; synthetic-only demo data |
| LLM hallucination | LLM is never the final decision-maker for ranking; structured-JSON-only LLM outputs validated with Zod; malformed output triggers one repair retry then deterministic fallback; LLM asked for concise rationale only, not chain-of-thought; literature citations always come from real PubMed records, never LLM-generated citations |
| Gene validation failing open | HGNC unavailable → gene explicitly marked `unvalidated`; ranking engine applies a penalty to unvalidated genes; UI visually distinguishes validated vs. unvalidated |
| GeneCards licensing violation | No scraping/crawling code anywhere in the repo (enforced by Phase 4 & 10 tests that assert no `fetch` to genecards.org domains in server code paths); licensed import is off by default, admin-gated, requires an explicit license-confirmation checkbox, and imported data is stored in separate, clearly labeled tables |
| Admin endpoints abused | Shared-secret header (`ADMIN_INGEST_SECRET`) required, constant-time compared, all admin actions written to an `AuditEvent` log |
| Resource exhaustion / abuse | Rate limiting on expensive routes (`/api/prioritize`, `/api/phenotype/extract`, `/api/literature/search`), free-text length caps, HPO-code count caps, gene-list count caps, upload size caps |
| Secret leakage | `src/lib/env.ts` is the only module allowed to read `process.env` for secrets; it is never imported from a `"use client"` file; CI includes a lint rule / test asserting no `NEXT_PUBLIC_` prefix on any secret-shaped variable |

---

## 5. Data Source Model

| Source | Role | Access pattern | Licensing posture |
|---|---|---|---|
| HPO (hp.json/obo, phenotype_to_genes.txt, genes_to_phenotype.txt) | Primary ontology + gene-phenotype associations | Downloaded once via script, parsed into local index, versioned with timestamp + checksum | Open (HPO is freely licensed for this kind of use); attribution in DATA_SOURCES.md |
| NLM ClinicalTables HPO API | Autocomplete/search fallback only, never primary | Live HTTPS call, server-side only, optional | Public API, no auth required |
| HGNC REST API | Gene symbol validation/canonicalization | Live HTTPS call, server-side only, cached | Public API |
| NCBI PubMed / E-utilities | Literature evidence | Live HTTPS call, server-side only, cached, rate-limited per NCBI guidelines, optional API key/email | Public API, NCBI usage policy followed |
| ClinVar | External link-out only in MVP | No server fetch | N/A |
| OMIM | Optional, licensed-key-gated, off by default | Live HTTPS call only if `OMIM_API_KEY` set | Requires OMIM license — never bundled |
| Orphanet / STRING / Reactome / GO | Future optional enrichment, not built in Phases 0–12 unless explicitly requested | N/A | To be evaluated per-source if added |
| GeneCards | Link-out only by default; licensed CSV/TSV import as an explicit, separate, off-by-default admin feature | **Never fetched programmatically.** Only (a) URL construction for outbound links, or (b) manual admin file upload of data the admin already obtained under their own license | Must not be scraped or trained on; documented prominently in DATA_SOURCES.md, SECURITY.md |

---

## 6. Deployment Model

| Target | Database | Notes |
|---|---|---|
| Local development | SQLite (fallback) or local PostgreSQL | `npm run setup` handles install + db + HPO fixture data |
| GitHub Codespaces | SQLite or container PostgreSQL | Same scripts as local dev |
| Docker Compose | PostgreSQL container | `docker-compose.yml` defines `app` + `db` services |
| Vercel | External managed PostgreSQL (e.g. Neon, Supabase, Railway) | Vercel serverless functions for API routes; filesystem HPO data baked into build or fetched at build time |
| Railway / Render | Managed PostgreSQL add-on | Standard Node server deployment, persistent disk for HPO data dir if needed |

All targets share one `.env.example` contract; deployment-specific instructions live in `DEPLOYMENT.md` and are expanded in Phase 11.

---

## 7. Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | Pure functions: HPO parsing, scoring math, negation detection, input hashing, env validation |
| Integration | Vitest + mocked HTTP | API routes with mocked Prisma/HGNC/PubMed/LLM, using `tests/fixtures/hpo-mini` so no live network or full HPO download is required |
| End-to-end | Playwright | Full browser flows: HPO-code → ranked results → detail drawer → export |
| Safety-specific tests | Vitest | "HGNC down → gene marked unvalidated, not valid"; "no GeneCards fetch occurs anywhere in gene/genecards modules"; "admin route without secret is rejected"; "LLM disabled → HPO workflow still returns results" |
| CI | GitHub Actions | Runs lint, typecheck, unit+integration tests, build on every push/PR; Playwright wired in once Phase 8 UI exists |

Every phase from Phase 2 onward must add tests in the same PR/commit as the feature — no feature ships untested, and no phase is considered complete until its own audit shows `lint`, `typecheck`, `test`, and `build` passing.

---

## 8. Explicit Non-Goals

These are permanent constraints for the entire project, not just Phase 0–1:

- **No diagnosis.** The system never outputs a diagnosis, a disease-probability percentage, or language implying clinical certainty. Output is always framed as a "prioritization score" for research/decision-support use.
- **No GeneCards scraping.** No HTTP fetch, HTML parsing, or crawling of GeneCards anywhere in the codebase, in any phase, regardless of stated justification. The only legitimate GeneCards data path is admin-uploaded, already-licensed files.
- **No real patient data.** All seed/demo/test data is synthetic. The app actively discourages identifiable patient data entry via warnings and (by default) does not persist raw free text.
- **No hardcoded secrets.** Every credential is an environment variable with a safe placeholder in `.env.example`; nothing is committed in code, config, or version control.
- **No LLM-only ranking.** The LLM (when configured) assists phenotype extraction and may contribute a clearly bounded, transparent rationale/boost — it never independently computes or overrides the final gene ranking. The deterministic ranking engine must produce correct, explainable results with `DISABLE_LLM=true`.

---

## 9. Phase-by-Phase Implementation Checklist (Phases 1–12)

- [ ] **Phase 1 — Repository foundation.** Next.js + TS + Tailwind + ESLint + Prettier shell, test framework wired, CI skeleton, Docker files, all required root docs, app builds/lints/typechecks/tests/runs.
- [ ] **Phase 2 — Database & Prisma foundation.** Full schema (UserCase, PhenotypeTerm, Gene, associations, rankings, literature, audit, data source versions), migrations, synthetic seed data.
- [ ] **Phase 3 — HPO ingestion & local ontology service.** Download/build scripts, parser, repository, search, validate modules, fixture dataset, HPO-only API routes, tests proving LLM-free operation.
- [ ] **Phase 4 — Gene validation & HGNC integration.** HGNC client with fail-closed behavior, GeneCards link generator (no fetch), validate API route, tests proving no scraping.
- [ ] **Phase 5 — Deterministic ranking engine.** Scoring, explainability, input hashing, ranking modes, `/api/prioritize` working end-to-end on HPO codes with `DISABLE_LLM=true`.
- [ ] **Phase 6 — Free-text phenotype extraction.** LLM provider abstraction with Zod-validated structured output, deterministic fallback matcher, negation/uncertainty/family-history detection, `/api/phenotype/extract`.
- [ ] **Phase 7 — Literature & PubMed evidence.** E-utilities client, caching, rate limiting, literature boost wired into ranking transparently, `/api/literature/search`.
- [ ] **Phase 8 — UI and report export.** All pages, input tabs, confirmation panel, results table, detail drawer, CSV/JSON/Markdown export, E2E test for the core flow.
- [ ] **Phase 9 — Security, privacy, rate limiting, admin controls.** Hardened headers/CSP, upload/input limits, audit logging, `/api/health` full status, privacy-first mode.
- [ ] **Phase 10 — Licensed GeneCards import module.** Admin-only, license-gated CSV/TSV import, clearly labeled separate storage, tests proving default-off and no fetch behavior.
- [ ] **Phase 11 — Deployment, Docker, CI, production readiness.** Full DEPLOYMENT.md across all targets, CI hardened, troubleshooting docs.
- [ ] **Phase 12 — Final optimization, refactor, full audit.** Cleanup pass, final full-repo audit against every checklist item in this contract.

---

*This document must be re-read at the start of every phase. If a later phase needs to deviate from anything stated here, the deviation must be flagged explicitly in that phase's audit, with a reason.*
