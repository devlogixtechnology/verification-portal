"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import type {
  VerificationState,
  VerifiedDocument,
} from "@/features/verification/types/verification.types";
import VerificationHeader from "./VerificationHeader";
import VerificationStatus from "./VerificationStatus";
import VerificationFooter from "./VerificationFooter";
import AssetDetails from "./AssetDetails";
import IssuerDetails from "./IssuerDetails";
import RecipientDetails from "./RecipientDetails";
import VerificationTimestamp from "./VerificationTimestamp";
import { Button } from "@/components/ui/Button";

export interface VerificationDashboardProps {
  state: VerificationState<VerifiedDocument>;
  onRetry?: () => void;
  onReset?: () => void;
  children?: ReactNode;
}

export default function VerificationDashboard({
  state,
  onRetry,
  onReset,
  children,
}: VerificationDashboardProps) {
  const isComplete =
    state.status === "verified" ||
    state.status === "invalid" ||
    state.status === "error";

  const doc = state.result;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <VerificationHeader />

      {isComplete && (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] shadow-md">
          {/* Status Header Banner */}
          <VerificationStatus state={state} />

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {state.status === "verified" && doc && (
              <>
                {children ? (
                  children
                ) : (
                  <>
                    {/* Primary Asset Card */}
                    <AssetDetails document={doc} />

                    {/* Issuer and Recipient 2-column Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <IssuerDetails issuer={doc.issuer} />
                      <RecipientDetails recipient={doc.recipient} />
                    </div>

                    {/* Verification Timestamp */}
                    {doc.verifiedAt && (
                      <VerificationTimestamp verifiedAt={doc.verifiedAt} />
                    )}
                  </>
                )}
              </>
            )}

            {/* Rejection / Failure Helper UI */}
            {(state.status === "invalid" || state.status === "error") && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-6 text-center space-y-4">
                <p className="text-sm text-[var(--muted-foreground)]">
                  If you believe this is an error, please ensure the verification token or URL was entered correctly, or contact the issuing authority directly.
                </p>

                {state.token && (
                  <p className="font-mono text-xs text-[var(--muted-foreground)]">
                    Attempted Token: <span className="text-[var(--foreground)] font-bold">{state.token}</span>
                  </p>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/verify" onClick={() => onReset?.()}>
                  <Button variant="secondary" size="md">
                    Verify Another Document
                  </Button>
                </Link>

                <Link href="/verify/scan" onClick={() => onReset?.()}>
                  <Button variant="outline" size="md">
                    Scan New QR
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {state.status === "error" && onRetry && (
                  <Button variant="primary" size="md" onClick={onRetry}>
                    Retry Verification
                  </Button>
                )}

                {state.status === "verified" && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      if (typeof window !== "undefined") window.print();
                    }}
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    }
                  >
                    Print Certificate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <VerificationFooter />
    </div>
  );
}