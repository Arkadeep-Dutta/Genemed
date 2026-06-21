export default function AboutPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-semibold text-slate-900">About</h1>
      <p className="mt-3 text-slate-600">
        Gene Prioritizer AI is a research and clinical-informatics
        decision-support tool. It is designed to help researchers, genetic
        counselors, and clinicians explore candidate genes for a given
        phenotype profile using the Human Phenotype Ontology, HGNC gene
        validation, and PubMed literature evidence. It does not diagnose
        patients.
      </p>
      <p className="mt-3 text-sm text-slate-500">
        This page is a Phase 1 placeholder shell. A complete description of
        the methodology, intended audience, and limitations will be filled in
        as the ranking engine (Phase 5) and literature module (Phase 7) are
        built.
      </p>
    </div>
  );
}
