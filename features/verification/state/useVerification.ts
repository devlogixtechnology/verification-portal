"use client";

import { useContext } from "react";
import { VerificationContext } from "./VerificationProvider";
import type { VerificationContextValue } from "./VerificationProvider";

/**
 * Reads the current verification state and config. Every screen gets its status
 * from here rather than keeping its own loading or error flags.
 *
 * ```tsx
 * const { state } = useVerification<Certificate, RejectionDetail>();
 * if (state.status === "verifying") return <Spinner />;
 * ```
 *
 * @throws If called outside a `VerificationProvider`.
 */
function useVerification<TAsset, TErrorDetail>() {
  const context = useContext(VerificationContext) as VerificationContextValue<TAsset, TErrorDetail> | undefined;
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
}

export { useVerification };
