/**
 * Public API of the Verification Feature Module.
 */

// State Machine & React Context
export {
  VerificationProvider,
  VerificationContext,
  useVerification,
  verificationReducer,
  createInitialState,
  type VerificationContextValue,
  type VerificationProviderProps,
  type VerificationAction,
} from "./state";

// Custom Hooks
export { useSubmitToken, DEFAULT_INVALID_TOKEN_MESSAGE } from "./hooks/useSubmitToken";

// Network / API
export { verifyToken, defaultBuildVerificationRequest, defaultIsHealthyResponse } from "./api/verification";
export { requestWithRetry, DEFAULT_TIMEOUT_MS } from "./api/client";
export { classifyNetworkError, classifyResponse, FAILURE_MESSAGES } from "./api/errors";

// Config & Defaults
export {
  defaultVerificationConfig,
  MOCK_VERIFIED_DOCUMENTS,
  extractTokenFromInput,
  validateTokenFormat,
} from "./config/verification.config";

// UI Components
export { default as QRScanner } from "./scanner/QRScanner";
export { default as LandingVerificationView } from "./components/LandingVerificationView";
export { default as LoadingPulse } from "./components/LoadingPulse";
export { default as NetworkErrorView } from "./components/NetworkErrorView";
export { default as VerificationDashboard } from "./dashboard/VerificationDashboard";
export { default as CaPassDashboard } from "./dashboard/CaPassDashboard";
export { default as CaFailDashboard } from "./dashboard/CaFailDashboard";

// Types
export type {
  VerificationConfig,
  VerificationState,
  VerificationStatus as VerificationStatusType,
  ParsedVerificationResult,
  RequestOptions,
  VerificationIssuer,
  VerificationRecipient,
  VerifiedDocument,
  VerificationErrorDetail,
} from "./types/verification.types";
