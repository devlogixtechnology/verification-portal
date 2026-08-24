/**
 * The 5 core states of the verification state machine.
 */
export type VerificationStatus =
  | "idle"
  | "verifying"
  | "verified"
  | "invalid"
  | "error";

/**
 * Structured details regarding an authority issuing the document.
 */
export interface VerificationIssuer {
  name: string;
  designation?: string;
  logoUrl?: string;
  verifiedBadge?: boolean;
  website?: string;
}

/**
 * Subject or holder of the verified document.
 */
export interface VerificationRecipient {
  name: string;
  email?: string;
  identifier?: string;
}

/**
 * Standard verified document entity payload.
 */
export interface VerifiedDocument {
  id?: string;
  documentType: string;
  title: string;
  referenceNumber: string;
  issuanceDate: string;
  expirationDate?: string;
  status?: "active" | "revoked" | "expired";
  issuer?: VerificationIssuer;
  recipient?: VerificationRecipient;
  additionalData?: Record<string, string | number | boolean>;
  verifiedAt?: string;
  blockchainTxHash?: string;
}

/**
 * Structured rejection details returned on 4xx/invalid response.
 */
export interface VerificationErrorDetail {
  reason?: "not_found" | "expired" | "revoked" | "tampered" | "format_error" | "unknown";
  code?: string;
  details?: string;
}

/**
 * Complete immutable verification state snapshot.
 *
 * @typeParam TAsset - Shape of a verified asset (defaults to VerifiedDocument).
 * @typeParam TErrorDetail - Shape of structured rejection details.
 */
export interface VerificationState<
  TAsset = VerifiedDocument,
  TErrorDetail = VerificationErrorDetail
> {
  /** Current state status driving the view */
  status: VerificationStatus;
  /** Token currently under verification */
  token: string | null;
  /** Populated only when status is 'verified' */
  result: TAsset | null;
  /** Error or rejection message displayed to the user */
  errorMessage: string | null;
  /** Structured rejection data supplied by the backend */
  errorDetail: TErrorDetail | null;
}

/**
 * A single HTTP request abstraction.
 */
export interface RequestOptions {
  path: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Parsed verification response outcome.
 */
export type ParsedVerificationResult<TAsset = VerifiedDocument, TErrorDetail = VerificationErrorDetail> =
  | { outcome: "verified"; result: TAsset }
  | { outcome: "rejected"; message: string; detail?: TErrorDetail }
  | { outcome: "failed"; message: string };

/**
 * Configuration contract for adapting verification to any backend & rendering system.
 */
export interface VerificationConfig<
  TAsset = VerifiedDocument,
  TErrorDetail = VerificationErrorDetail
> {
  /** API origin and base path prefix without trailing slash */
  apiBaseUrl: string;

  /** Validates token format before dispatching network request */
  isValidTokenFormat?: (token: string) => boolean;

  /** Extracts token from raw scan payload or URL */
  parseToken?: (raw: string) => string | null;

  /** Builds the HTTP request payload */
  buildVerificationRequest?: (token: string) => RequestOptions;

  /** Health check on response object */
  isHealthyResponse?: (response: Response) => boolean;

  /** Response parser converting HTTP responses into domain outcomes */
  parseVerificationResponse: (rawBody: unknown) => ParsedVerificationResult<TAsset, TErrorDetail>;

  /** Optional custom renderer for verified asset */
  renderVerified?: (document: TAsset) => React.ReactNode;

  /** Optional custom renderer for rejection */
  renderInvalid?: (message: string, detail?: TErrorDetail) => React.ReactNode;
}
