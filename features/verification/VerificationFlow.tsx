"use client";

import { useState } from "react";

import type { VerificationState } from "@/features/verification/types/verification.types";

import VerificationDashboard from "./dashboard/VerificationDashboard";
import VerificationStart from "./scanner/VerificationStart";
import VerificationScanner from "./scanner/VerificationScanner";

export default function VerificationFlow() {
  const [isScanning, setIsScanning] = useState(false);
  const [state, setState] = useState<VerificationState>({
    status: "idle",
    token: null,
    result: null,
    errorMessage: null,
    errorDetail: null,
  });

  const handleStart = () => {
    setIsScanning(true);
  };

  const handleScan = (token: string) => {
    console.log("Scanned verification token:", token);
    setIsScanning(false);

    setState({
      status: "verifying",
      token,
      result: null,
      errorMessage: null,
      errorDetail: null,
    });

    // Temporary simulation.
    // This will eventually be replaced by the verification request.
    setTimeout(() => {
      setState({
        status: "verified",
        token,
        result: {
          asset: {
            token,
            documentType: "Certificate",
            title: "Certificate of Completion",
          },
          verifiedAt: new Date().toISOString(),
        },
        errorMessage: null,
        errorDetail: null,
      });
    }, 1000);
  };

  const handleInvalidScan = (rawText: string) => {
    console.warn("Invalid QR token:", rawText);
  };

  if (state.status === "idle") {
    if (isScanning) {
      return (
        <VerificationScanner
          onScan={handleScan}
          onInvalidScan={handleInvalidScan}
        />
      );
    }

    return (
      <VerificationStart
        onStart={handleStart}
      />
    );
  }

  if (state.status === "verifying") {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--brand-teal)]" />

        <h1 className="mt-5 text-xl font-semibold text-[var(--foreground)]">
          Verifying Asset
        </h1>

        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Please wait while we verify the scanned asset.
        </p>
      </section>
    );
  }

  return (
    <VerificationDashboard state={state}>
      {state.status === "verified" && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {String(
              (state.result as { asset?: { title?: string } })?.asset?.title ??
                "Verified Asset"
            )}
          </h2>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            This asset has been successfully verified.
          </p>
        </div>
      )}
    </VerificationDashboard>
  );
}