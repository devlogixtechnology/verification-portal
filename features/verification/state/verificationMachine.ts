import type { VerificationState, VerifiedDocumentData } from "../types/verification.types";

type Action =
  | { type: "startScanning" }
  | { type: "tokenRejected"; message: string }
  | { type: "tokenReceived"; token: string }
  | { type: "verificationSucceeded"; result: VerifiedDocumentData }
  | { type: "verificationRejected"; message: string }
  | { type: "verificationFailed"; message: string }
  | { type: "retry" }
  | { type: "reset" };

const initialState: VerificationState = {
  status: "idle",
  token: null,
  result: null,
  errorMessage: null,
};

function verificationReducer(state: VerificationState, action: Action): VerificationState {
  switch (action.type) {
    case "startScanning":
      return { ...initialState, status: "scanning" };
    case "tokenRejected":
      return { ...state, status: "invalid", errorMessage: action.message };
    case "tokenReceived":
      return { ...state, status: "verifying", token: action.token };
    case "verificationSucceeded":
      return { ...state, status: "verified", result: action.result, errorMessage: null };
    case "verificationRejected":
      return { ...state, status: "invalid", errorMessage: action.message };
    case "verificationFailed":
      return { ...state, status: "error", errorMessage: action.message };
    case "retry":
      return { ...state, status: "verifying" };
    case "reset":
      return { ...initialState };
    default:
      return state;
  }
}

export { verificationReducer, initialState };
export type { Action };