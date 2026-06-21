# Data Sources

This document describes every external data source the complete project
plan integrates, how it is accessed, and its licensing posture. See
`docs/PHASE_0_ARCHITECTURE.md` Section 5 for the summary table this
expands on.

## Human Phenotype Ontology (HPO)

- **Files:** `hp.json` (or `hp.obo`), `phenotype_to_genes.txt`,
  `genes_to_phenotype.txt`, optionally `phenotype.hpoa`.
- **Access pattern:** downloaded once via a script
  (`npm run data:download-hpo`), parsed into a local index
  (`npm run data:build-hpo`). The running application reads only the
  local, versioned index — never a live HPO endpoint — for its core
  workflow.
- **Licensing:** HPO is freely available for this kind of use; attribution
  is given here and in the application's Data Sources page.
- **Phase introduced:** Phase 3.

## NLM ClinicalTables HPO API

- **Role:** autocomplete/search **fallback only**. The local HPO index
  from above is always the primary source of truth.
- **Access pattern:** live HTTPS call, server-side only, optional.
- **Licensing:** public API, no authentication required.
- **Phase introduced:** Phase 3.

## HGNC REST API

- **Role:** gene symbol validation, alias/previous-symbol resolution, and
  canonicalization.
- **Access pattern:** live HTTPS call, server-side only, with caching.
  If unavailable, genes are marked `unvalidated` — never silently treated
  as valid (fail-closed; see `SECURITY.md`).
- **Licensing:** public API.
- **Phase introduced:** Phase 4.

## NCBI PubMed / E-utilities

- **Role:** literature evidence retrieval for gene-phenotype/disease
  associations.
- **Access pattern:** live HTTPS call, server-side only, cached and rate
  limited per NCBI's usage policy. `NCBI_API_KEY` and `NCBI_EMAIL` are
  optional but recommended to raise rate limits.
- **Licensing:** public API; NCBI's usage guidelines apply.
- **Phase introduced:** Phase 7.

## ClinVar

- **Role:** external link-out only in the current project plan. No
  server-side fetching of ClinVar is implemented.
- **Phase introduced:** link-out only, planned for the UI phase (Phase 8).

## OMIM

- **Role:** optional future enrichment, gated entirely behind an
  `OMIM_API_KEY` the deployer must obtain under their own OMIM license.
  Never bundled, never enabled by default.
- **Phase introduced:** not built in Phases 1-12 unless explicitly
  requested; reserved as a future optional module.

## Orphanet, STRING, Reactome, GO

- **Role:** optional future enrichment modules, only if license/terms
  review at the time confirms they are usable. Not built in Phases 1-12
  unless explicitly requested.

## GeneCards — critical rule

**GeneCards is never scraped, crawled, or fetched by this application's
server-side code, in any phase, under any justification.** This is a
hard constraint stated in the original project brief and repeated here,
in `SECURITY.md`, and in `docs/PHASE_0_ARCHITECTURE.md` because it is
load-bearing for the legality of this project.

The only two permitted forms of GeneCards integration are:

1. **Linkout mode (default-safe).** The application constructs an
   outbound `<a href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=...">`
   link from a validated gene symbol. No request is made to GeneCards by
   the server; the user's own browser navigates there if they click it.
   Controlled by `GENE_CARDS_LINKOUT_ENABLED`. Introduced in Phase 4.

2. **Licensed import mode (off by default).** An admin who already holds
   a valid GeneCards/GeneALaCart license may upload a CSV/TSV export they
   obtained directly from GeneCards under that license. This path:
   - Is disabled unless `GENE_CARDS_LICENSED_IMPORT_ENABLED=true`.
   - Requires the admin to check a license-confirmation checkbox in the
     UI before the upload is accepted.
   - Stores imported data in separate, clearly labeled database tables
     (`LicensedGeneCardsImport`, `LicensedGeneCardsGeneAnnotation`),
     distinct from any other gene data, with source/license metadata
     attached.
   - Logs an audit event for every import.
   - Introduced in Phase 10.

No model in this project is trained on GeneCards content. No automated
process retrieves GeneCards content. This is true today (Phase 1, where
no GeneCards code exists at all) and will remain true through Phase 12.

## Current build status (Phase 1)

None of the integrations above exist yet. This document states the
sourcing and licensing contract that each integration will follow when it
is built in its designated phase.
