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
export { TokenInputForm } from "./components/TokenInputForm";
export { default as VerificationDashboard } from "./dashboard/VerificationDashboard";
export { default as AssetDetails } from "./dashboard/AssetDetails";
export { default as IssuerDetails } from "./dashboard/IssuerDetails";
export { default as RecipientDetails } from "./dashboard/RecipientDetails";
export { default as VerificationStatus } from "./dashboard/VerificationStatus";
export { default as VerificationTimestamp } from "./dashboard/VerificationTimestamp";
export { default as VerificationHeader } from "./dashboard/VerificationHeader";
export { default as VerificationFooter } from "./dashboard/VerificationFooter";

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
