/**
 * NOTE on a known risk with this test file (flagged during Phase 1 review,
 * not yet confirmed against a real install in this project): directly
 * importing a route handler that imports `next/server` into a Vitest test
 * has, in some Next.js/Node/Vitest version combinations, thrown
 * `ReferenceError: Request is not defined` at module-load time, because
 * `next/server`'s internals expect certain web globals (Request/Response/
 * AsyncLocalStorage) to already exist on `globalThis` before it loads.
 * This is environment-dependent and has been reported even on recent
 * Next.js/Node combinations, not only old ones.
 *
 * `vitest.config.ts` already sets `environment: "node"` (not jsdom), which
 * resolves this in the most common case. If `npm test` fails on THIS file
 * specifically with a "Request is not defined" / "AsyncLocalStorage" style
 * error, the fix is to either (a) add `import "next/dist/server/web/spec-
 * extension/request"` style polyfill shims, or (b) switch this specific
 * test to a tool built for it, such as `next-test-api-route-handler`. If
 * you hit this, please report it back — it should be fixed in Phase 1
 * itself rather than deferred, since the architecture contract requires
 * every route to ship with a real, passing test.
 */
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok envelope with server status healthy", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.checks.server.status).toBe("ok");
  });

  it("marks unimplemented subsystems explicitly rather than omitting them", async () => {
    const response = await GET();
    const body = await response.json();

    // Phase 1 contract: these fields must exist even before the
    // corresponding subsystem is built, so API consumers can rely on a
    // stable shape across phases (see docs/PHASE_0_ARCHITECTURE.md).
    expect(body.data.checks.database.status).toBe("not_implemented");
    expect(body.data.checks.hpoData.status).toBe("not_implemented");
    expect(body.data.checks.llm.status).toBe("not_implemented");
    expect(body.data.checks.pubmed.status).toBe("not_implemented");
  });

  it("includes a request id and ISO timestamp in meta", async () => {
    const response = await GET();
    const body = await response.json();

    expect(typeof body.meta.requestId).toBe("string");
    expect(body.meta.requestId.length).toBeGreaterThan(0);
    expect(() => new Date(body.meta.timestamp).toISOString()).not.toThrow();
  });
});
