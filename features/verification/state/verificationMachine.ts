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

function verificationReducer<TAsset, TErrorDetail>(
  state: VerificationState<TAsset, TErrorDetail>,
  action: Action<TAsset, TErrorDetail>
): VerificationState<TAsset, TErrorDetail> {
  switch (action.type) {
    case "tokenRejected":
      return { ...state, status: "invalid", errorMessage: action.message, errorDetail: null };
    case "tokenReceived":
      return { ...state, status: "verifying", token: action.token };
    case "verificationSucceeded":
      return { ...state, status: "verified", result: action.result, errorMessage: null };
    case "verificationRejected":
      return { ...state, status: "invalid", errorMessage: action.message, errorDetail: action.detail ?? null };
    case "verificationFailed":
      return { ...state, status: "error", errorMessage: action.message };
    case "retry":
      return { ...state, status: "verifying" };
    case "reset":
      return createInitialState<TAsset, TErrorDetail>();
    default:
      return state;
  }
}

export { verificationReducer, createInitialState };
export type { Action };