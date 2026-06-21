import { describe, expect, it } from "vitest";

import { buildErrorEnvelope, buildSuccessEnvelope } from "@/lib/apiResponse";

describe("buildSuccessEnvelope", () => {
  it("wraps data with ok: true and default empty warnings/dataVersions", () => {
    const envelope = buildSuccessEnvelope({ foo: "bar" });

    expect(envelope.ok).toBe(true);
    expect(envelope.data).toEqual({ foo: "bar" });
    expect(envelope.warnings).toEqual([]);
    expect(envelope.meta.dataVersions).toEqual({});
    expect(typeof envelope.meta.requestId).toBe("string");
  });

  it("passes through provided warnings and dataVersions", () => {
    const envelope = buildSuccessEnvelope(
      { foo: "bar" },
      { warnings: ["careful"], dataVersions: { hpo: "2025-01-01" } },
    );

    expect(envelope.warnings).toEqual(["careful"]);
    expect(envelope.meta.dataVersions).toEqual({ hpo: "2025-01-01" });
  });

  it("generates a unique requestId on each call", () => {
    const first = buildSuccessEnvelope({});
    const second = buildSuccessEnvelope({});

    expect(first.meta.requestId).not.toBe(second.meta.requestId);
  });
});

describe("buildErrorEnvelope", () => {
  it("wraps an error with ok: false and the given code/message", () => {
    const envelope = buildErrorEnvelope("VALIDATION_ERROR", "Invalid input");

    expect(envelope.ok).toBe(false);
    expect(envelope.error.code).toBe("VALIDATION_ERROR");
    expect(envelope.error.message).toBe("Invalid input");
    expect(envelope.error.details).toBeUndefined();
  });

  it("includes details when provided", () => {
    const envelope = buildErrorEnvelope("VALIDATION_ERROR", "Invalid input", {
      field: "hpoCodes",
    });

    expect(envelope.error.details).toEqual({ field: "hpoCodes" });
  });
});
