# Security

## Reporting a vulnerability

This is a research/educational project template. If you are using this
codebase as the basis for a real deployment and discover a vulnerability,
treat it according to your own organization's responsible-disclosure
policy. There is no production deployment of this project maintained by
its authors to report issues to.

## Security principles (apply across all phases)

- **No hardcoded secrets.** Every credential is read from an environment
  variable; `.env.example` contains only safe placeholders. Real secrets
  are never committed.
- **No secrets in the client bundle.** Secret-shaped environment variables
  are read only on the server (see `src/lib/env.ts`) and are never
  prefixed with `NEXT_PUBLIC_`. A guard function,
  `findMisconfiguredPublicSecrets`, exists specifically to catch this
  class of mistake and is unit-tested (`tests/unit/env.test.ts`).
- **No GeneCards scraping.** No code in this repository performs an HTTP
  fetch, HTML parse, or crawl of GeneCards, in any phase. The only
  GeneCards-related code permitted is (a) constructing an outbound link
  URL from a gene symbol, or (b) accepting an admin-uploaded file of data
  the admin already holds under their own license (introduced in Phase
  4/10, disabled by default).
- **Admin and import endpoints are protected.** `/api/admin/*` and
  `/api/import/*` routes (introduced in Phase 9/10) require a shared
  secret (`ADMIN_INGEST_SECRET`) and log an audit event for every action.
- **Input validation everywhere.** Every API route validates its input
  with Zod before doing anything else (introduced starting Phase 3).
- **Rate limiting on expensive routes.** `/api/prioritize`,
  `/api/phenotype/extract`, and `/api/literature/search` are rate-limited
  once they exist (Phase 5-7, hardened in Phase 9).
- **Fail closed.** External dependency outages (HGNC, PubMed, LLM) never
  cause the system to silently treat unverified data as verified — see
  the Safety Model in `docs/PHASE_0_ARCHITECTURE.md`.
- **Security headers.** Baseline headers (`X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-DNS-Prefetch-Control`)
  are set in `next.config.ts` starting Phase 1. A Content-Security-Policy
  is added in Phase 9 once all script/style sources are finalized.
- **Conservative `robots.txt` by default.** All routes are disallowed for
  crawling from Phase 1 onward; this is relaxed only for confirmed-safe
  static pages in Phase 9.

## Current build status (Phase 1)

What exists and has been implemented as described above:

- No hardcoded secrets anywhere in the repository (verify: there is no
  committed `.env` or `.env.local` file, and `.env.example` contains only
  placeholders).
- `src/lib/env.ts` is the sole intended boundary for secret-shaped
  environment variables, with a tested guard against `NEXT_PUBLIC_`
  leakage.
- Baseline security headers are configured in `next.config.ts`.
- `public/robots.txt` disallows all crawling.

What does **not** exist yet (by design, not omission):

- There are no admin or import endpoints yet (Phase 9/10).
- There is no rate limiting yet — there are no expensive endpoints yet to
  protect (Phase 5-9).
- There is no Content-Security-Policy header yet (Phase 9).
- There is no upload handling of any kind yet (Phase 10).
- There are no audit logs yet — there is no database yet (Phase 2, 9).
