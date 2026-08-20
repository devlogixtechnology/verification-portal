import type { ParsedVerificationResult } from "../types/verification.types";

/**
 * A transport-level failure, expressed in the same vocabulary the state machine
 * consumes — no parallel `{ type: "failed" }` shape to keep in sync.
 */
type ClassifiedError = Extract<
  ParsedVerificationResult<never, never>,
  { outcome: "failed" }
>;

const FAILURE_MESSAGES = {
  timeout: "The request timed out. Please try again.",
  server: "Something went wrong on our end. Please try again.",
  network: "Network error. Please check your connection and try again.",
  unreadable: "Something went wrong. Please try again.",
} as const;

function failure(message: string): ClassifiedError {
  return { outcome: "failed", message };
}

/**
 * Classifies a response the caller could not treat as healthy.
 *
 * Returns `null` when the response should still be handed to the config's
 * `parseVerificationResponse` — a 4xx normally carries a domain body ("expired",
 * "tampered") that only the consuming project can turn into a `rejected` result.
 * Only environmental failures are classified here.
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

function classifyNetworkError(error: unknown): ClassifiedError {
  const isAbort =
    error instanceof Error && error.name === "AbortError";
  return failure(isAbort ? FAILURE_MESSAGES.timeout : FAILURE_MESSAGES.network);
}

export { classifyResponse, classifyNetworkError, failure, FAILURE_MESSAGES };
export type { ClassifiedError };
