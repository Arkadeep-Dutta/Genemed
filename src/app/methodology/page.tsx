export default function MethodologyPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-semibold text-slate-900">Methodology</h1>
      <p className="mt-3 text-sm text-slate-500">
        Not yet available. The ranking methodology (HPO match scoring,
        specificity weighting, candidate-gene boosting, literature evidence
        boosting) is implemented in Phase 5 and Phase 7 and will be documented
        here in detail once those phases are complete. See{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
          docs/PHASE_0_ARCHITECTURE.md
        </code>{" "}
        for the planned scoring model in the meantime.
      </p>
    </div>
  );
}
