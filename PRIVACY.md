# Privacy

## Summary

Gene Prioritizer AI is designed with a privacy-first default: it does not
store raw clinical free text by default, and it is **not automatically
HIPAA-compliant**. This document describes the privacy policy for the
complete, planned application; see "Current build status" below for what
is actually implemented as of Phase 1.

## Principles (apply across all phases)

- **No real patient data.** All seed, demo, and test data is synthetic.
  The application's UI actively warns against entering identifiable
  patient information.
- **No default storage of raw free text.** Free-text phenotype
  descriptions entered by a user are processed in-memory for the current
  request and are not persisted to the database unless the user
  explicitly opts in to a future "save this case" feature, which itself
  will be off by default.
- **Privacy-first mode.** A configuration mode (introduced alongside the
  database layer in Phase 2/9) keeps the application in a no-persistence
  state for any field that could contain identifiable information.
- **Redaction, not silent acceptance.** If case storage is explicitly
  enabled by a deployer, obvious identifiers (names, dates of birth,
  medical record numbers, addresses) are redacted before storage. This
  redaction logic is implemented in the phase that introduces optional
  case storage and is documented there.
- **No GeneCards harvesting.** The application does not scrape, crawl, or
  train on GeneCards content. See `DATA_SOURCES.md` and `SECURITY.md`.
- **Server-side secrets only.** No API key, database credential, or admin
  secret is ever sent to the browser. See `SECURITY.md`.

## What is sent to third parties, and when

| Data | Sent to | When | Phase |
|---|---|---|---|
| Free-text phenotype description | LLM provider (OpenAI/Anthropic/Gemini), if configured | Only if an LLM provider is configured and `DISABLE_LLM` is not `true`; never sent if the deterministic fallback extractor is used | Phase 6 |
| HPO codes / gene symbols | NLM ClinicalTables (HPO autocomplete fallback), HGNC, NCBI PubMed | Only the specific term/symbol being looked up — never the surrounding free text | Phase 3, 4, 7 |
| Nothing | GeneCards | Never — outbound links only, never a server-side fetch | N/A |

Operators who configure an LLM provider should be aware that any free
text submitted while that provider is active will be transmitted to that
third party subject to its own data-handling terms. This is documented in
the UI (Phase 6) at the point where free text is entered, not only here.

## Data retention

Retention policy details (how long ranking results, audit logs, and any
opted-in case data are kept) will be fully specified once the database
layer exists (Phase 2) and finalized in Phase 9 alongside the rest of the
security/privacy hardening work.

## Current build status

As of **Phase 1**, there is no database, no LLM integration, no HPO
lookup, and no PubMed integration — so none of the data flows in the
table above currently occur. This document states the policy the
application is committed to as each of those features is built in later
phases.
