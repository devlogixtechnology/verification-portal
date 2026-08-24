"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Verification Portal Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md p-6 text-center shadow-lg border-[var(--status-danger)]/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--status-danger-bg)] text-[var(--status-danger)]">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <CardHeader className="p-0 pt-4 pb-2">
          <CardTitle className="text-xl">Something Went Wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred while processing the verification request.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-4 space-y-3">
          {error.message && (
            <p className="rounded-lg bg-[var(--background)] p-3 font-mono text-xs text-[var(--muted-foreground)] break-words">
              {error.message}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
            <Link href="/verify">
              <Button variant="secondary">
                Return to Verification
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}