/**
 * Public API of the verification feature. See ./README.md for setup.
 *
 * Anything not exported here is internal and may change.
 *
 * No "use client" directive: each module carries its own, so a server component
 * can import the types or `verifyToken` from here without the whole feature
 * becoming a client boundary.
 */

// Mount this around the verification routes.
export { VerificationProvider } from "./state/VerificationProvider";
export { useVerification } from "./state/useVerification";
export { useSubmitToken } from "./hooks/useSubmitToken";

// Screens.
export { VerificationView } from "./components/VerificationView";
export { TokenEntryView } from "./components/TokenEntryView";
export { LoadingPulse } from "./components/LoadingPulse";
export { NetworkErrorView } from "./components/NetworkErrorView";
export { InvalidResultView } from "./components/InvalidResultView";
export { QRScanner } from "./scanner/QRScanner";

// Scanner internals, for projects building their own scan screen.
export { useCameraPermission } from "./scanner/useCameraPermission";
export { useQrScanner } from "./scanner/useQrScanner";
export { ScannerViewfinder } from "./scanner/ScannerViewfinder";
export { ManualTokenFallback } from "./scanner/ManualTokenFallback";
export { ScannerPresets } from "./scanner/ScannerPresets";

// The state machine, for testing a config against real transitions.
export { verificationReducer, createInitialState } from "./state/verificationMachine";

// Verify a token without React, from a server component or a test.
export { verifyToken } from "./api/verification";
export { DEFAULT_MESSAGES, resolveMessages } from "./api/errors";

export type {
  VerificationConfig,
  VerificationState,
  VerificationStatus,
  VerificationActions,
  VerificationRoute,
  VerificationMessages,
  ParsedVerificationResult,
  RequestOptions,
} from "./types/verification.types";

export type {
  VerificationContextValue,
  VerificationProviderProps,
} from "./state/VerificationProvider";

export type { VerificationViewProps } from "./components/VerificationView";
export type { TokenEntryViewProps } from "./components/TokenEntryView";
export type { QRScannerProps } from "./scanner/QRScanner";
export type { ScannerPreset } from "./scanner/ScannerPresets";
export type { CameraPermission } from "./scanner/useCameraPermission";

export type { VerificationAction } from "./state/verificationMachine";
