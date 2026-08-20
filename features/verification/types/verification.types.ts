type VerificationStatus = "idle" | "verifying" | "verified" | "invalid" | "error";

type VerificationState<TAsset = unknown, TErrorDetail = unknown> = {
  status: VerificationStatus;
  token: string | null;
  result: TAsset | null;
  errorMessage: string | null;
  errorDetail: TErrorDetail | null;
};

type RequestOptions = {
  path: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
};

type ParsedVerificationResult<TAsset, TErrorDetail> =
  | { outcome: "verified"; result: TAsset }
  | { outcome: "rejected"; message: string; detail?: TErrorDetail }
  | { outcome: "failed"; message: string };

type VerificationConfig<TAsset = unknown, TErrorDetail = unknown> = {
  apiBaseUrl: string;
  isValidTokenFormat?: (token: string) => boolean;
  parseToken?: (raw: string) => string | null;
  buildVerificationRequest?: (token: string) => RequestOptions;
  isHealthyResponse?: (response: Response) => boolean;
  parseVerificationResponse: (rawBody: unknown) => ParsedVerificationResult<TAsset, TErrorDetail>;
  renderVerified: (document: TAsset) => import("react").ReactNode;
  renderInvalid?: (message: string, detail?: TErrorDetail) => import("react").ReactNode;
};

export type {
  VerificationStatus, VerificationState, RequestOptions,
  ParsedVerificationResult, VerificationConfig,
};