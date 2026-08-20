
// Defines the possible states the feature can be in.
type VerificationStatus =
  | "idle"
  | "scanning"
  | "verifying"
  | "verified"
  | "invalid"
  | "error";

// Defines the data needed in response to a successful verification. Handles any kind of verification information
type VerifiedDocumentData = {
  
  // The mandatory information to be returned by ANY project implementing this feature
  assetType: string;
  issuer: string;
  issuedDate: string;
  status: "valid" | "revoked";

  // The optional information about the verified asset. 
  // Highlighting will let the corresponsing detail be rendered in the main dashboard.
  details: { label: string; value: string; highlight?: boolean }[];
};

// The object that will hold all state information of the feature
type VerificationState = {
  status: VerificationStatus;
  token: string | null;
  result: VerifiedDocumentData | null;
  errorMessage: string | null;
};

export type { VerificationStatus, VerifiedDocumentData, VerificationState };