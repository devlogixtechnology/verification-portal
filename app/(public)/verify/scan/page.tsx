"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRScanner from "@/features/verification/scanner/QRScanner";
import { Button } from "@/components/ui/Button";

export default function ScanPage() {
  const router = useRouter();
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const handleScanSuccess = (token: string) => {
    setScanNotice(`Found token: ${token}. Redirecting...`);
    router.push(`/verify/${encodeURIComponent(token)}`);
  };

  const handleInvalidToken = (rawText: string) => {
    setScanNotice(`Unrecognized code: "${rawText.slice(0, 30)}...". Please try again.`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/verify">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <svg className="h-4 w-4 text-[var(--brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
            className="text-xs font-semibold text-[var(--brand-teal)] hover:text-[var(--brand-teal-hover)] px-2"
          >
            Back to Verify
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-teal)]">
          Scan QR Code
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Point your device camera at the asset QR code.
        </p>
      </div>

      {scanNotice && (
        <div className="rounded-2xl bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 p-3 text-center text-xs font-medium text-[var(--brand-indigo)]">
          {scanNotice}
        </div>
      )}

      <QRScanner
        onScanSuccess={handleScanSuccess}
        onInvalidToken={handleInvalidToken}
      />
    </div>
  );
}