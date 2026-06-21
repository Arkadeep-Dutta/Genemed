import { describe, expect, it } from "vitest";

import { env, findMisconfiguredPublicSecrets } from "@/lib/env";

describe("env", () => {
  it("defaults appUrl to localhost when not set", () => {
    expect(env.appUrl).toBeTruthy();
  });
});

describe("findMisconfiguredPublicSecrets", () => {
  it("returns an empty array when no secret-shaped variable is exposed publicly", () => {
    const result = findMisconfiguredPublicSecrets({
      DATABASE_URL: "postgres://localhost/db",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });

    expect(result).toEqual([]);
  });

  it("flags a secret accidentally exposed with a NEXT_PUBLIC_ prefix", () => {
    const result = findMisconfiguredPublicSecrets({
      NEXT_PUBLIC_ANTHROPIC_API_KEY: "leaked-value",
    });

    expect(result).toContain("ANTHROPIC_API_KEY");
  });

  it("flags multiple misconfigured secrets at once", () => {
    const result = findMisconfiguredPublicSecrets({
      NEXT_PUBLIC_DATABASE_URL: "leaked",
      NEXT_PUBLIC_ADMIN_INGEST_SECRET: "leaked",
    });

    expect(result).toEqual(
      expect.arrayContaining(["DATABASE_URL", "ADMIN_INGEST_SECRET"]),
    );
    expect(result).toHaveLength(2);
  });
});
