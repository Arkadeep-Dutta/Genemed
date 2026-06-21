export default function DisclaimerPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-semibold text-slate-900">Disclaimer</h1>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
        <li>
          <strong>Research and educational use only.</strong> This
          application is a decision-support and research tool.
        </li>
        <li>
          <strong>This is not medical advice.</strong>
        </li>
        <li>
          <strong>This is not a diagnosis.</strong> No output from this
          application constitutes a clinical diagnosis.
        </li>
        <li>
          All results require review and interpretation by qualified
          genetics or medical professionals before any clinical decision is
          made.
        </li>
        <li>
          This application is <strong>not automatically HIPAA-compliant</strong>.
          Do not enter identifiable patient information unless the
          application has been deployed in an environment you have confirmed
          is compliant.
        </li>
      </ul>
      <p className="mt-4 text-sm text-slate-500">
        See{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">DISCLAIMER.md</code> at the
        root of the repository for the canonical version of this text.
      </p>
    </div>
  );
}
