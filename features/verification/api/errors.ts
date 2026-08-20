import type { ParsedVerificationResult } from "../types/verification.types";

/** A failure the module can describe without help from the consuming project. */
type ClassifiedError = Extract<
  ParsedVerificationResult<never, never>,
  { outcome: "failed" }
>;

/** Default copy shown when a request could not be completed. */
const FAILURE_MESSAGES = {
  timeout: "The request timed out. Please try again.",
  server: "Something went wrong on our end. Please try again.",
  network: "Network error. Please check your connection and try again.",
  unreadable: "Something went wrong. Please try again.",
} as const;

/** Builds a `failed` outcome. */
function failure(message: string): ClassifiedError {
  return { outcome: "failed", message };
}

/**
 * Classifies a response by status code.
 *
 * Returns a failure for timeouts and server faults. Returns `null` for healthy
 * responses and for 4xx, which are passed to `parseVerificationResponse`
 * instead: only the consuming project knows whether a 404 means "expired",
 * "tampered", or something else.
 */
function classifyResponse(
  response: Response,
  isHealthyResponse: (response: Response) => boolean
): ClassifiedError | null {
  if (isHealthyResponse(response)) return null;

  if (response.status === 408 || response.status === 504) {
    return failure(FAILURE_MESSAGES.timeout);
  }
  if (response.status >= 500) {
    return failure(FAILURE_MESSAGES.server);
  }
  return null;
}

/** Classifies a thrown request error, separating an aborted timeout from a lost connection. */
function classifyNetworkError(error: unknown): ClassifiedError {
  const isAbort =
    error instanceof Error && error.name === "AbortError";
  return failure(isAbort ? FAILURE_MESSAGES.timeout : FAILURE_MESSAGES.network);
}

export { classifyResponse, classifyNetworkError, failure, FAILURE_MESSAGES };
export type { ClassifiedError };
