/**
 * Shared success/error JSON envelope builders.
 *
 * Per docs/PHASE_0_ARCHITECTURE.md, every API route must return a
 * consistent envelope shape. These helpers exist so that shape is defined
 * exactly once and reused by every route added in Phases 2-12, rather than
 * each route hand-rolling its own response object.
 */

export interface ApiSuccessEnvelope<T> {
  ok: true;
  data: T;
  warnings: string[];
  meta: {
    requestId: string;
    timestamp: string;
    dataVersions: Record<string, string>;
  };
}

export interface ApiErrorEnvelope {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export function buildSuccessEnvelope<T>(
  data: T,
  options?: { warnings?: string[]; dataVersions?: Record<string, string> },
): ApiSuccessEnvelope<T> {
  return {
    ok: true,
    data,
    warnings: options?.warnings ?? [],
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      dataVersions: options?.dataVersions ?? {},
    },
  };
}

export function buildErrorEnvelope(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ApiErrorEnvelope {
  return {
    ok: false,
    error: { code, message, details },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  };
}
