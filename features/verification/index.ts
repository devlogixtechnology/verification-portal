/**
 * Public API of the verification feature. See ./README.md for setup.
 *
 * Anything not exported here is internal and may change.
 */

// Mount this around the verification routes, then use these in any screen below.
export { VerificationProvider } from "./state/VerificationProvider";
export { useVerification } from "./state/useVerification";
export { useSubmitToken } from "./hooks/useSubmitToken";

// The state machine, for testing a config against real transitions.
export { verificationReducer, createInitialState } from "./state/verificationMachine";

// Verify a token without React, from a server component or a test.
export { verifyToken } from "./api/verification";

export type {
  VerificationConfig,
  VerificationState,
  VerificationStatus,
  ParsedVerificationResult,
  RequestOptions,
} from "./types/verification.types";

export type {
  VerificationContextValue,
  VerificationProviderProps,
} from "./state/VerificationProvider";

export type { Action as VerificationAction } from "./state/verificationMachine";
