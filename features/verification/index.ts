/**
 * Public surface of the verification feature.
 *
 * Everything a consuming project needs is exported here. Anything not listed —
 * the fetch transport, the error classifier, the raw React context — is internal
 * and free to change; import it directly only if you have accepted that.
 *
 * Deliberately no "use client" directive. Each module carries its own, so a
 * server component can import the types or `verifyToken` from this barrel
 * without turning the whole feature into a client boundary.
 */

export { VerificationProvider } from "./state/VerificationProvider";
export { useVerification } from "./state/useVerification";
export { useSubmitToken } from "./hooks/useSubmitToken";

// The machine is pure and framework-free: exported so a consuming project can
// unit-test its own config against the real transitions without mounting React.
export { verificationReducer, createInitialState } from "./state/verificationMachine";

// Headless escape hatch — the same request pipeline the hook uses, callable
// from a server component, a route handler, or a test.
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

// Renamed on the way out: `Action` is an internal name and far too generic to
// put in a consumer's import list, where it would collide with their own.
export type { Action as VerificationAction } from "./state/verificationMachine";
