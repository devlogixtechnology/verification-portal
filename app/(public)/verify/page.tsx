"use client";
import { useState } from "react";
import VerificationDashboard from "@/features/verification/dashboard/VerificationDashboard";
import ScannerPlaceholder from "@/features/verification/scanner/ScannerPlaceholder";
import type { VerificationState } from "@/features/verification/types/verification.types";

const asset = {
  documentType: "Certificate",
  title: "Certificate of Completion",
  issuer: { name: "DevLogix", designation: "Technology" },
  recipient: { name: "John Doe", email: "john@example.com" },
  issuanceDate: "2026-08-20",
  referenceNumber: "CERT-001",
  status: "active",
};

export default function VerifyPage() {
  // FIX 2: Initialize state with the required object shape for the new type
  const [state, setState] = useState<VerificationState>({
    status: "idle",
    token: null,
    result: null,
    errorMessage: null,
    errorDetail: null,
  });

  const handleScan = (token: string) => {
    console.log("Scanned token:", token);
    setState({
      status: "verifying",
      token,
      result: null,
      errorMessage: null,
      errorDetail: null,
    });
    
    setTimeout(() => {
      // FIX 3: Use "verified" instead of "valid", and pass the asset directly to `result`
      setState({
        status: "verified",
        token,
        result: asset, 
        errorMessage: null,
        errorDetail: null,
      });
    }, 1000);
  };

  return (
    <>
      {/* FIX 4: Update status checks to match the new type's statuses */}
      {state.status === "idle" && (
        <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <ScannerPlaceholder onScan={handleScan} />
        </div>
      )}
      
      {state.status === "verifying" && (
        <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Verifying asset...
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Please wait while we verify the scanned code.
            </p>
          </div>
        </div>
      )}
      
      {/* Only render dashboard if verified or invalid */}
      {(state.status === "verified" || state.status === "invalid") && (
        <VerificationDashboard state={state}>
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Certificate of Completion
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              This is temporary mock asset content for testing.
            </p>
          </div>
        </VerificationDashboard>
      )}
    </>
  );
}