/**
 * Server-only environment variable accessors.
 *
 * Per docs/PHASE_0_ARCHITECTURE.md, Safety Model: this is the only module
 * that should read secret-shaped environment variables directly. Later
 * phases (LLM provider, HGNC client, PubMed client, admin auth) should
 * import accessors from here rather than reading `process.env` themselves,
 * so that "no secret reaches the client" stays a single auditable
 * boundary instead of a convention scattered across many files.
 *
 * Phase 1 scope: only the variables actually used by Phase 1 code are
 * implemented as typed accessors. Variables required by later phases are
 * documented in .env.example now (so the full contract is visible up
 * front) but their typed accessors are added in the phase that consumes
 * them, to avoid dead code.
 */

function readOptional(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value === "" ? undefined : value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  /**
   * Public app URL. Safe to expose to the client (NEXT_PUBLIC_ prefix),
   * used for building absolute links (e.g. in future report exports).
   */
  appUrl: readOptional("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
};

/**
 * Guard used by tests/CI in later phases to assert that no variable
 * intended to hold a secret is ever exposed with a NEXT_PUBLIC_ prefix.
 * Implemented now, in Phase 1, because it is cheap and the contract it
 * enforces is a Phase 0 non-negotiable ("No hardcoded secrets" / secrets
 * never reach the client).
 */
const SECRET_SHAPED_NAMES = [
  "DATABASE_URL",
  "ADMIN_INGEST_SECRET",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "NCBI_API_KEY",
  "OMIM_API_KEY",
  "REDIS_URL",
];

export function findMisconfiguredPublicSecrets(
  envSource: Record<string, string | undefined> = process.env,
): string[] {
  return SECRET_SHAPED_NAMES.filter(
    (name) => envSource[`NEXT_PUBLIC_${name}`] !== undefined,
  );
}
