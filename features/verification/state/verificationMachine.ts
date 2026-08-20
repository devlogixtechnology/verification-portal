import type { VerificationState } from "../types/verification.types";

/**
 * Everything that can move a verification forward.
 *
 * | Action                  | Resulting status |
 * | ----------------------- | ---------------- |
 * | `tokenRejected`         | `invalid`        |
 * | `tokenReceived`         | `verifying`      |
 * | `verificationSucceeded` | `verified`       |
 * | `verificationRejected`  | `invalid`        |
 * | `verificationFailed`    | `error`          |
 * | `retry`                 | `verifying`      |
 * | `reset`                 | `idle`           |
 */
type Action<TAsset, TErrorDetail> =
  | { type: "tokenRejected"; message: string }
  | { type: "tokenReceived"; token: string }
  | { type: "verificationSucceeded"; result: TAsset }
  | { type: "verificationRejected"; message: string; detail?: TErrorDetail }
  | { type: "verificationFailed"; message: string }
  | { type: "retry" }
  | { type: "reset" };

/** The state a verification starts in: idle, with nothing to show. */
function createInitialState<TAsset, TErrorDetail>(): VerificationState<TAsset, TErrorDetail> {
  return { status: "idle", token: null, result: null, errorMessage: null, errorDetail: null };
}

/**
 * The verification state machine. Pure and free of React, so it can be tested
 * on its own.
 *
 * Each transition returns the whole state, so no field outlives the status it
 * belongs to: an error message never survives into a loading screen, and a
 * result never survives into a failure.
 */
function verificationReducer<TAsset, TErrorDetail>(
  state: VerificationState<TAsset, TErrorDetail>,
  action: Action<TAsset, TErrorDetail>
): VerificationState<TAsset, TErrorDetail> {
  switch (action.type) {
    // Input that never became a token, so no token is kept and `retry` has
    // nothing to repeat.
    case "tokenRejected":
      return {
        status: "invalid",
        token: null,
        result: null,
        errorMessage: action.message,
        errorDetail: null,
      };

    case "tokenReceived":
      return {
        status: "verifying",
        token: action.token,
        result: null,
        errorMessage: null,
        errorDetail: null,
      };

    case "verificationSucceeded":
      return {
        status: "verified",
        token: state.token,
        result: action.result,
        errorMessage: null,
        errorDetail: null,
      };

    // The token is kept so the screen can still offer a retry.
    case "verificationRejected":
      return {
        status: "invalid",
        token: state.token,
        result: null,
        errorMessage: action.message,
        errorDetail: action.detail ?? null,
      };

    case "verificationFailed":
      return {
        status: "error",
        token: state.token,
        result: null,
        errorMessage: action.message,
        errorDetail: null,
      };

    // Verifies the same token again. Without one, there is nothing to retry.
    case "retry":
      if (!state.token) return state;
      return {
        status: "verifying",
        token: state.token,
        result: null,
        errorMessage: null,
        errorDetail: null,
      };

    case "reset":
      return createInitialState<TAsset, TErrorDetail>();

    default:
      return state;
  }
}

export { verificationReducer, createInitialState };
export type { Action };
