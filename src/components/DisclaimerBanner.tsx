/**
 * DisclaimerBanner
 *
 * Required by docs/PHASE_0_ARCHITECTURE.md, Safety Model: a persistent,
 * visible disclaimer must appear on every page. This is a real, rendered
 * component (not a placeholder) because the disclaimer is a Phase 1
 * safety requirement, not a feature deferred to a later phase.
 *
 * This component intentionally has no client-side interactivity beyond
 * a single internal link, so it stays a lightweight server component.
 */
import Link from "next/link";

export function DisclaimerBanner() {
  return (
    <div
      role="note"
      aria-label="Research and educational use disclaimer"
      className="border-b border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700"
    >
      <p className="mx-auto max-w-5xl">
        <strong>Research and educational use only.</strong> This tool does not
        provide medical advice and does not produce a diagnosis. All outputs
        require review by qualified genetics or medical professionals before
        any clinical use. This application is not automatically
        HIPAA-compliant &mdash; do not enter identifiable patient information
        unless it is deployed in an environment you have confirmed is
        compliant. See{" "}
        <Link href="/disclaimer" className="underline underline-offset-2">
          full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
