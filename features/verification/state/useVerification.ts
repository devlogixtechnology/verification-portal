"use client";

import { useContext } from "react";
import { VerificationContext } from "./VerificationProvider";
import type { VerificationContextValue } from "./VerificationProvider";

function useVerification<TAsset, TErrorDetail>() {
  const context = useContext(VerificationContext) as VerificationContextValue<TAsset, TErrorDetail> | undefined;
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
}

export { useVerification };
