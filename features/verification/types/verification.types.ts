/** The five states a verification can be in. */
type VerificationStatus = "idle" | "verifying" | "verified" | "invalid" | "error";

/**
 * The complete state of a verification.
 *
 * @typeParam TAsset - Shape of a verified asset, defined by the consuming project.
 * @typeParam TErrorDetail - Shape of the structured detail attached to a rejection.
 */
type VerificationState<TAsset = unknown, TErrorDetail = unknown> = {
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
};

/** A single HTTP request, described independently of how it is sent. */
type RequestOptions = {
  /** Appended to `apiBaseUrl`. Include the leading slash. */
  path: string;
  /** Defaults to `"GET"`. */
  method?: "GET" | "POST";
  /** Merged over the defaults. `Content-Type: application/json` is set automatically when a body is present. */
  headers?: Record<string, string>;
  /** Serialised as JSON. Omit for requests without a body. */
  body?: unknown;
};

/**
 * What a response means, as decided by the consuming project.
 *
 * - `verified` - the asset is genuine.
 * - `rejected` - the backend answered, and the answer is no (expired, tampered, unknown).
 * - `failed` - the answer could not be obtained (network, timeout, server fault).
 */
type ParsedVerificationResult<TAsset, TErrorDetail> =
  | { outcome: "verified"; result: TAsset }
  | { outcome: "rejected"; message: string; detail?: TErrorDetail }
  | { outcome: "failed"; message: string };

/**
 * Everything a project must supply to adapt this feature to its own backend
 * and visual language. Optional fields fall back to the defaults noted below.
 */
type VerificationConfig<TAsset = unknown, TErrorDetail = unknown> = {
  /** Origin and any path prefix, without a trailing slash. */
  apiBaseUrl: string;

  /** Rejects a token before any request is made. Default: every non-empty token is accepted. */
  isValidTokenFormat?: (token: string) => boolean;

  /**
   * Extracts a token from raw input, such as a scanned QR payload or a pasted
   * URL. Return `null` if no token can be found. Default: the input is the token.
   */
  parseToken?: (raw: string) => string | null;

  /** Describes the verification request. Default: `GET {apiBaseUrl}/verify/{token}`. */
  buildVerificationRequest?: (token: string) => RequestOptions;

  /** Decides whether a response carries a usable body. Default: `response.ok`. */
  isHealthyResponse?: (response: Response) => boolean;

  /**
   * Turns a response body into an outcome. Called for healthy responses and for
   * 4xx responses, which usually carry the reason a token was rejected.
   */
  parseVerificationResponse: (rawBody: unknown) => ParsedVerificationResult<TAsset, TErrorDetail>;

  /** Renders the verified asset. Style it with the shared CSS tokens - see README. */
  renderVerified: (document: TAsset) => import("react").ReactNode;

  /** Renders a rejection. When omitted, `errorMessage` is shown on its own. */
  renderInvalid?: (message: string, detail?: TErrorDetail) => import("react").ReactNode;
};

export type {
  VerificationStatus, VerificationState, RequestOptions,
  ParsedVerificationResult, VerificationConfig,
};
