import type { ReactNode } from "react";

/** The five states a verification can be in. */
export type VerificationStatus =
  | "idle"
  | "verifying"
  | "verified"
  | "invalid"
  | "error";

/** Detailed Issuer representation */
export interface VerificationIssuer {
  name: string;
  designation?: string;
  logoUrl?: string | null;
  verifiedBadge?: boolean;
  website?: string;
}

/** Recipient information */
export interface VerificationRecipient {
  name: string;
  email?: string;
  identifier?: string;
}

/** Normalized Verified Document Domain Model */
export interface VerifiedDocument {
  id: string;
  documentType: string;
  title: string;
  referenceNumber: string;
  issuanceDate: string;
  expirationDate?: string;
  status: "active" | "expired" | "revoked";
  issuer?: VerificationIssuer;
  recipient?: VerificationRecipient;
  additionalData?: Record<string, unknown>;
  verifiedAt?: string;
  blockchainTxHash?: string;
}

/** Error details returned on invalid or rejected verifications */
export interface VerificationErrorDetail {
  reason?: "expired" | "revoked" | "not_found" | "invalid" | "server_error" | "unknown";
  code?: string;
  details?: string;
  fields?: Array<{ field: string; message: string }>;
}

/**
 * The complete state of a verification.
 *
 * @typeParam TAsset - Shape of a verified asset, defined by the consuming project.
 * @typeParam TErrorDetail - Shape of the structured detail attached to a rejection.
 */
export interface VerificationState<TAsset = VerifiedDocument, TErrorDetail = VerificationErrorDetail> {
  /** Drives which screen is shown. */
  status: VerificationStatus;
  /** The token currently being verified, or the one that was. */
  token: string | null;
  /** Populated only while `status` is `"verified"`. */
  result: TAsset | null;
  /** Message to display while `status` is `"invalid"` or `"error"`. */
  errorMessage: string | null;
  /** Structured rejection data, when the backend supplied any. */
  errorDetail: TErrorDetail | null;
}

/** A single HTTP request, described independently of how it is sent. */
export interface RequestOptions {
  /** Appended to `apiBaseUrl`. Include the leading slash. */
  path: string;
  /** Defaults to `"GET"`. */
  method?: "GET" | "POST";
  /** Merged over the defaults. `Content-Type` is set automatically when a body is present. */
  headers?: Record<string, string>;
  /** Serialised as JSON. Omit for requests without a body. */
  body?: unknown;
  /** Marks the request as safe to send twice. */
  idempotent?: boolean;
}

/**
 * What a response means, as decided by the consuming project.
 */
export type ParsedVerificationResult<TAsset = VerifiedDocument, TErrorDetail = VerificationErrorDetail> =
  | { outcome: "verified"; result: TAsset }
  | { outcome: "rejected"; message: string; detail?: TErrorDetail }
  | { outcome: "failed"; message: string };

/**
 * Where a screen wants to go, expressed as intent rather than as a URL.
 */
export type VerificationRoute =
  | { name: "start" }
  | { name: "scanner" }
  | { name: "verify"; token: string };

/** What a result screen can do besides display itself. */
export interface VerificationActions {
  verifyAnother: () => void;
  retry: () => void;
}

/** Every user-facing string the module produces on its own. */
export interface VerificationMessages {
  invalidTokenFormat: string;
  timeout: string;
  serverError: string;
  networkError: string;
  unreadableResponse: string;
}

/**
 * Configuration contract for the verification module.
 */
export interface VerificationConfig<TAsset = VerifiedDocument, TErrorDetail = VerificationErrorDetail> {
  apiBaseUrl: string;
  isValidTokenFormat?: (token: string) => boolean;
  parseToken?: (raw: string) => string | null;
  buildVerificationRequest?: (token: string) => RequestOptions;
  isHealthyResponse?: (response: Response) => boolean;
  parseVerificationResponse: (
    rawBody: unknown
  ) => ParsedVerificationResult<TAsset, TErrorDetail>;
  onNavigate?: (route: VerificationRoute) => void;
  renderVerified?: (asset: TAsset, actions: VerificationActions) => ReactNode;
  renderInvalid?: (
    message: string,
    detail: TErrorDetail | undefined,
    actions: VerificationActions
  ) => ReactNode;
  messages?: Partial<VerificationMessages>;
}
