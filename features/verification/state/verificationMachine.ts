import type { VerificationState } from "../types/verification.types";

type Action<TAsset, TErrorDetail> =
  | { type: "tokenRejected"; message: string }
  | { type: "tokenReceived"; token: string }
  | { type: "verificationSucceeded"; result: TAsset }
  | { type: "verificationRejected"; message: string; detail?: TErrorDetail }
  | { type: "verificationFailed"; message: string }
  | { type: "retry" }
  | { type: "reset" };

function createInitialState<TAsset, TErrorDetail>(): VerificationState<TAsset, TErrorDetail> {
  return { status: "idle", token: null, result: null, errorMessage: null, errorDetail: null };
}

/**
 * Every transition returns the complete state shape instead of spreading the
 * previous one. Spreading is how stale fields survive a transition — a previous
 * errorMessage rendered next to a spinner, or an old result still readable after
 * a failure. Stating all five fields also means the annotated return type forces
 * a deliberate decision in every case if VerificationState ever gains a field.
 */
function verificationReducer<TAsset, TErrorDetail>(
  state: VerificationState<TAsset, TErrorDetail>,
  action: Action<TAsset, TErrorDetail>
): VerificationState<TAsset, TErrorDetail> {
  switch (action.type) {
    // The raw input never became a token, so none is retained. Keeping the
    // previous one would let `retry` silently re-verify whatever came before.
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

    // The token is kept so the UI can still offer a retry on an expired or
    // tampered code; the previously verified result is not.
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

    // Retrying with no token would leave the machine in `verifying` with
    // nothing in flight, so it is a no-op.
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
