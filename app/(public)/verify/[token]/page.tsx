"use client";

import React, { use, useEffect } from "react";
import { useSubmitToken, useVerification } from "@/features/verification";
import type {
  VerificationErrorDetail,
  VerifiedDocument,
} from "@/features/verification/types/verification.types";
import VerificationDashboard from "@/features/verification/dashboard/VerificationDashboard";
import VerificationHeader from "@/features/verification/dashboard/VerificationHeader";
import VerificationFooter from "@/features/verification/dashboard/VerificationFooter";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

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

  // Loading / Verifying State
  if (state.status === "verifying" || state.status === "idle") {
    return (
      <div className="space-y-6">
        <VerificationHeader />

        <Card className="p-8 sm:p-12 text-center shadow-md">
          <div className="mx-auto max-w-sm flex flex-col items-center">
            <Spinner size="xl" label="Verifying credential authenticity..." />

            <h2 className="mt-6 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
              Verifying Document Authenticity
            </h2>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Querying the official registry and verifying cryptographic signature...
            </p>

            <div className="mt-6 w-full rounded-xl bg-[var(--background)] p-3 font-mono text-xs text-[var(--muted-foreground)]">
              Token: <span className="font-semibold text-[var(--foreground)]">{token}</span>
            </div>
          </div>
        </Card>

        <VerificationFooter />
      </div>
    );
  }

  // Completed State: Verified, Invalid, or Error
  return (
    <VerificationDashboard
      state={state}
      onRetry={retry}
      onReset={reset}
    />
  );
}