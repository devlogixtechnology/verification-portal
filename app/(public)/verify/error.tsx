"use client";

import { useEffect } from "react";
import { NetworkErrorView } from "@/features/verification";

/**
 * Route-level boundary for exceptions the state machine never saw — a render
 * fault, or a failure outside the verification pipeline.
 */
export default function VerifyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Verification route error:", error);
  }, [error]);

  return (
    <NetworkErrorView
      message="Something went wrong while loading this page. Please try again."
      onRetry={reset}
      retryLabel="Try again"
    />
  );
}
