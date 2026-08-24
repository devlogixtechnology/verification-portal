"use client";

import React from "react";
import type {
  VerificationState,
  VerifiedDocument,
} from "@/features/verification/types/verification.types";
import CaPassDashboard from "./CaPassDashboard";
import CaFailDashboard from "./CaFailDashboard";
import NetworkErrorView from "../components/NetworkErrorView";

export interface VerificationDashboardProps {
  state: VerificationState<VerifiedDocument>;
  onRetry?: () => void;
  onReset?: () => void;
}

export default function VerificationDashboard({
  state,
  onRetry,
  onReset,
}: VerificationDashboardProps) {
  if (state.status === "verified" && state.result) {
    return (
      <CaPassDashboard
        document={state.result}
        onVerifyAnother={onReset}
      />
    );
  }

  if (state.status === "invalid") {
    return (
      <CaFailDashboard
        message={state.errorMessage || undefined}
        expirationDate={state.result?.expirationDate}
        reason={state.errorDetail?.reason}
        onVerifyAnother={onReset}
      />
    );
  }

  if (state.status === "error") {
    return (
      <NetworkErrorView
        message={state.errorMessage || undefined}
        onRetry={onRetry}
      />
    );
  }

  return null;
}