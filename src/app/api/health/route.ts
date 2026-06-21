import { NextResponse } from "next/server";

import { buildSuccessEnvelope } from "@/lib/apiResponse";

/**
 * GET /api/health
 *
 * Phase 1 scope: reports that the server process is up and returns build
 * metadata. Database, HPO data, LLM, and PubMed checks are added in later
 * phases (Phase 2, 3, 6, 7 respectively) as those subsystems are built —
 * they are represented here as explicit "not_implemented" statuses rather
 * than omitted or faked as healthy, so the contract shape is stable from
 * Phase 1 onward and callers can rely on the field always being present.
 */
export async function GET() {
  const body = buildSuccessEnvelope({
    status: "ok",
    checks: {
      server: { status: "ok" },
      database: { status: "not_implemented", note: "Added in Phase 2" },
      hpoData: { status: "not_implemented", note: "Added in Phase 3" },
      llm: { status: "not_implemented", note: "Added in Phase 6" },
      pubmed: { status: "not_implemented", note: "Added in Phase 7" },
    },
    build: {
      phase: 1,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
    },
  });

  return NextResponse.json(body);
}
