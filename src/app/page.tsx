export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Gene Prioritizer AI</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A research and clinical-informatics decision-support tool for
          ranking candidate genes against a patient&apos;s phenotype profile,
          built on the Human Phenotype Ontology (HPO), HGNC gene validation,
          and PubMed literature evidence.
        </p>
      </section>

      <section
        aria-labelledby="phase-status-heading"
        className="rounded-lg border border-slate-200 bg-slate-50 p-5"
      >
        <h2 id="phase-status-heading" className="text-sm font-semibold text-slate-700">
          Build status
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This is the <strong>Phase 1 repository foundation</strong>. The
          application shell, layout, disclaimer, and documentation are real
          and functional. The phenotype input workflow, HPO ontology service,
          gene validation, ranking engine, and literature evidence module are
          not implemented yet &mdash; they are built in Phases 2&ndash;7 of the
          project plan in{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            docs/PHASE_0_ARCHITECTURE.md
          </code>
          . Nothing below is a working feature; it is a preview of the planned
          input modes only.
        </p>
      </section>

      <section aria-labelledby="planned-input-heading">
        <h2 id="planned-input-heading" className="text-sm font-semibold text-slate-700">
          Planned input modes (not yet functional)
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {plannedInputModes.map((mode) => (
            <div
              key={mode.title}
              className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500"
            >
              <p className="font-medium text-slate-700">{mode.title}</p>
              <p className="mt-1">{mode.description}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                Planned for {mode.phase}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const plannedInputModes = [
  {
    title: "Free-text phenotype description",
    description:
      "e.g. \u201cInfant with seizures, global developmental delay, hypotonia.\u201d Mapped to HPO terms with negation/uncertainty detection.",
    phase: "Phase 6",
  },
  {
    title: "Direct HPO codes",
    description: "e.g. HP:0001250, HP:0001263. Validated against the local HPO ontology index.",
    phase: "Phase 3",
  },
  {
    title: "Candidate genes",
    description: "e.g. SCN2A, CACNA1A. Validated and canonicalized via HGNC.",
    phase: "Phase 4",
  },
  {
    title: "Structured metadata",
    description: "Age of onset, inheritance pattern, consanguinity, and related case context.",
    phase: "Phase 5\u20136",
  },
];
