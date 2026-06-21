export default function DataSourcesPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-semibold text-slate-900">Data Sources</h1>
      <p className="mt-3 text-slate-600">
        Gene Prioritizer AI integrates the Human Phenotype Ontology, HGNC, and
        NCBI PubMed directly, and links out to GeneCards and ClinVar without
        ever scraping or crawling them. Full sourcing and licensing details
        are documented in{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">DATA_SOURCES.md</code> at the
        root of the repository.
      </p>
      <p className="mt-3 text-sm text-slate-500">
        This page is a Phase 1 placeholder. Live data version/freshness
        information will be added once the HPO ingestion pipeline (Phase 3)
        and{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">/api/data/version</code> route
        exist.
      </p>
    </div>
  );
}
