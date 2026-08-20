
// Defines the possible states the feature can be in.
type VerificationStatus =
  | "idle"
  | "verifying"
  | "verified"
  | "invalid"
  | "error";

// The object that will hold all state information of the feature
type VerificationState<TAsset = unknown, TErrorDetail = unknown> = {
  status: VerificationStatus;
  token: string | null;
  result: TAsset | null;
  errorMessage: string | null;
  errorDetail: TErrorDetail | null;
};

export type { VerificationStatus, VerificationState };