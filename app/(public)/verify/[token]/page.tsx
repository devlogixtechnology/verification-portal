"use client";

import React, { use, useEffect } from "react";
import { useSubmitToken, useVerification } from "@/features/verification";
import type {
  VerificationErrorDetail,
  VerifiedDocument,
} from "@/features/verification/types/verification.types";
import CaPassDashboard from "@/features/verification/dashboard/CaPassDashboard";
import CaFailDashboard from "@/features/verification/dashboard/CaFailDashboard";
import LoadingPulse from "@/features/verification/components/LoadingPulse";
import NetworkErrorView from "@/features/verification/components/NetworkErrorView";

interface VerifyTokenPageProps {
  params: Promise<{ token: string }>;
}

export default function VerifyTokenPage({ params }: VerifyTokenPageProps) {
  const { token: rawToken } = use(params);
  const token = decodeURIComponent(rawToken);

  const { state } = useVerification<VerifiedDocument, VerificationErrorDetail>();
  const { submitToken, retry, reset } = useSubmitToken<
    VerifiedDocument,
    VerificationErrorDetail
  >();

  useEffect(() => {
    if (token) {
      void submitToken(token);
    }
  }, [token, submitToken]);

  // Loading State (Screen 2 3-dot animation)
  if (state.status === "verifying" || state.status === "idle") {
    return <LoadingPulse label={`Verifying ${token}...`} />;
  }

  // Network / Server Error State (Screen 3)
  if (state.status === "error") {
    return (
      <NetworkErrorView
        message={
          state.errorMessage ||
          "There was a problem in verifying your asset. Please check your network and try again."
        }
        onRetry={retry}
      />
    );
  }

  // Rejection / Expiration State (Screen 5)
  if (state.status === "invalid") {
    return (
      <CaFailDashboard
        message={state.errorMessage || undefined}
        expirationDate={state.result?.expirationDate}
        reason={state.errorDetail?.reason}
        onVerifyAnother={reset}
      />
    );
  }

  // Verified Authenticity State (Screen 4)
  if (state.status === "verified" && state.result) {
    return (
      <CaPassDashboard
        document={state.result}
        onVerifyAnother={reset}
      />
    );
  }

  return null;
}