import type {
  VerificationErrorDetail,
  VerificationState,
} from "../types/verification.types";

/**
 * Discriminated union of all possible actions in the verification finite state machine.
 */
export type VerificationAction<
  TAsset = unknown,
  TErrorDetail = VerificationErrorDetail
> =
  | { type: "tokenRejected" | "TOKEN_REJECTED"; message: string }
  | { type: "tokenReceived" | "TOKEN_RECEIVED"; token: string }
  | { type: "verificationSucceeded" | "VERIFICATION_SUCCEEDED"; result: TAsset }
  | {
      type: "verificationRejected" | "VERIFICATION_REJECTED";
      message: string;
      detail?: TErrorDetail;
    }
  | { type: "verificationFailed" | "VERIFICATION_FAILED"; message: string }
  | { type: "retry" | "RETRY" }
  | { type: "reset" | "RESET" };

/**
 * Creates a clean, initial "idle" state.
 */
export function createInitialState<
  TAsset = unknown,
  TErrorDetail = VerificationErrorDetail
>(): VerificationState<TAsset, TErrorDetail> {
  return {
    status: "idle",
    token: null,
    result: null,
    errorMessage: null,
    errorDetail: null,
  };
}

/**
 * Pure verification state machine reducer.
 *
 * Enforces state invariants:
 * - Each transition returns a deterministic, complete state snapshot.
 * - Outdated error messages and results are purged on new attempts to prevent stale UI flashes.
 * - Retains the token during failures so the UI can offer a seamless retry action.
 */
export function verificationReducer<
  TAsset = unknown,
  TErrorDetail = VerificationErrorDetail
>(
  state: VerificationState<TAsset, TErrorDetail>,
  action: VerificationAction<TAsset, TErrorDetail>
): VerificationState<TAsset, TErrorDetail> {
  switch (action.type) {
    case "tokenRejected":
    case "TOKEN_REJECTED":
      return {
        status: "invalid",
        token: null,
        result: null,
        errorMessage: action.message,
        errorDetail: null,
      };

    case "tokenReceived":
    case "TOKEN_RECEIVED":
      return {
        status: "verifying",
        token: action.token,
        result: null,
        errorMessage: null,
        errorDetail: null,
      };

    case "verificationSucceeded":
    case "VERIFICATION_SUCCEEDED":
      return {
        status: "verified",
        token: state.token,
        result: action.result,
        errorMessage: null,
        errorDetail: null,
      };

    case "verificationRejected":
    case "VERIFICATION_REJECTED":
      return {
        status: "invalid",
        token: state.token,
        result: null,
        errorMessage: action.message,
        errorDetail: action.detail ?? null,
      };

    case "verificationFailed":
    case "VERIFICATION_FAILED":
      return {
        status: "error",
        token: state.token,
        result: null,
        errorMessage: action.message,
        errorDetail: null,
      };

    case "retry":
    case "RETRY":
      if (!state.token) return state;
      return {
        status: "verifying",
        token: state.token,
        result: null,
        errorMessage: null,
        errorDetail: null,
      };

    case "reset":
    case "RESET":
      return createInitialState<TAsset, TErrorDetail>();

    default:
      return state;
  }
}
