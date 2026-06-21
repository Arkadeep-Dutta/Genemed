export default function PrivacyPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-semibold text-slate-900">Privacy</h1>
      <p className="mt-3 text-slate-600">
        Gene Prioritizer AI does not store raw clinical free text by default,
        and is not automatically HIPAA-compliant. Do not enter identifiable
        patient information unless you have deployed this application in an
        environment you have confirmed is compliant for that purpose.
      </p>
      <p className="mt-3 text-slate-600">
        Full privacy details, including what is and is not stored, are in{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">PRIVACY.md</code> at the root
        of the repository.
      </p>
    </div>
  );
}
