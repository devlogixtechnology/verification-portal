"use client";

import React, { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractTokenFromInput, validateTokenFormat } from "../config/verification.config";

export interface TokenInputFormProps {
  initialValue?: string;
  onVerify?: (token: string) => void;
  isLoading?: boolean;
  showScanLink?: boolean;
}

export function TokenInputForm({
  initialValue = "",
  onVerify,
  isLoading = false,
  showScanLink = true,
}: TokenInputFormProps) {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = extractTokenFromInput(tokenInput);

    if (!token) {
      setError("Please enter a verification code or document URL.");
      return;
    }

    if (!validateTokenFormat(token)) {
      setError("Invalid code format. Expected alphanumeric characters (e.g. CERT-2026-001).");
      return;
    }

    setError(null);
    if (onVerify) {
      onVerify(token);
    } else {
      router.push(`/verify/${encodeURIComponent(token)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Input
        label="Verification Code or URL"
        placeholder="e.g. CERT-2026-001 or paste verification link"
        value={tokenInput}
        onChange={(e) => {
          setTokenInput(e.target.value);
          if (error) setError(null);
        }}
        errorMessage={error || undefined}
        helperText="Enter the reference code found on the certificate or document."
        leftIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full sm:w-auto"
          rightIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          }
        >
          Verify Authenticity
        </Button>

        {showScanLink && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/verify/scan")}
            className="w-full sm:w-auto"
            leftIcon={
              <svg
                className="h-4 w-4 text-[var(--brand-teal)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            }
          >
            Scan QR Code
          </Button>
        )}
      </div>
    </form>
  );
}

