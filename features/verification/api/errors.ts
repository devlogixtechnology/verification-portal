import type {
  ParsedVerificationResult,
  VerificationMessages,
} from "../types/verification.types";

/** A failure the module can describe without help from the consuming project. */
export type ClassifiedError = Extract<
  ParsedVerificationResult,
  { outcome: "failed" }
>;

/** Copy used when the project supplies no override. */
export const DEFAULT_MESSAGES: VerificationMessages = {
  invalidTokenFormat:
    "That doesn't look like a valid code. Please check it and try again.",
  timeout: "The request timed out. Please try again.",
  serverError: "Something went wrong on our end. Please try again.",
  networkError: "Network error. Please check your connection and try again.",
  unreadableResponse: "Something went wrong. Please try again.",
};

/** Fills any gaps in a project's message overrides with the defaults. */
export function resolveMessages(
  overrides?: Partial<VerificationMessages>
): VerificationMessages {
  return overrides ? { ...DEFAULT_MESSAGES, ...overrides } : DEFAULT_MESSAGES;
}

/** Builds a `failed` outcome. */
export function failure(message: string): ClassifiedError {
  return { outcome: "failed", message };
}

/**
 * Classifies a response by status code.
 *
 * Returns a failure for timeouts and server faults. Returns `null` for healthy
 * responses and for 4xx, which are passed to `parseVerificationResponse`
 * instead: only the consuming project knows whether a 404 means "expired",
 * "revoked", or something else.
 */
export function classifyResponse(
  response: Response,
  isHealthyResponse: (response: Response) => boolean,
  messages: VerificationMessages = DEFAULT_MESSAGES
): ClassifiedError | null {
  if (isHealthyResponse(response)) return null;

  if (response.status === 408 || response.status === 504) {
    return failure(messages.timeout);
  }
  if (response.status >= 500) {
    return failure(messages.serverError);
  }
  return null;
}

/** Classifies a thrown request error, separating an aborted timeout from a lost connection. */
export function classifyNetworkError(
  error: unknown,
  messages: VerificationMessages = DEFAULT_MESSAGES
): ClassifiedError {
  const isAbort = error instanceof Error && error.name === "AbortError";
  return failure(isAbort ? messages.timeout : messages.networkError);
}
