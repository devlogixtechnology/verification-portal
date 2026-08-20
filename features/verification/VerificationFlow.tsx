"use client";

import { useState } from "react";

import type { VerificationState } from "@/store/verification/types";

import VerificationDashboard from "./dashboard/VerificationDashboard";
import VerificationStart from "./scanner/VerificationStart";
import VerificationScanner from "./scanner/VerificationScanner";

export default function VerificationFlow() {
  const [state, setState] =
    useState<VerificationState>({
      status: "idle",
    });

  const handleStart = () => {
    setState({
      status: "scanning",
    });
  };

  const handleScan = (token: string) => {
    console.log("Scanned verification token:", token);

    setState({
      status: "verifying",
    });

    // Temporary simulation.
    // This will eventually be replaced by the RTK Query
    // verification request.
    setTimeout(() => {
      setState({
        status: "valid",
        result: {
          verificationStatus: "valid",
          data: {
            asset: {
              token,
              documentType: "Certificate",
              title: "Certificate of Completion",
            },
            verifiedAt: new Date().toISOString(),
          },
        },
      });
    }, 1000);
  };

  const handleInvalidScan = (rawText: string) => {
    console.warn("Invalid QR token:", rawText);
  };

  if (state.status === "idle") {
    return (
      <VerificationStart
        onStart={handleStart}
      />
    );
  }

  if (state.status === "scanning") {
    return (
      <VerificationScanner
        onScan={handleScan}
        onInvalidScan={handleInvalidScan}
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
      {state.status === "valid" && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {String(
              (state.result.data.asset as {
                title?: string;
              }).title ?? "Verified Asset"
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