"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRScanner from "@/features/verification/scanner/QRScanner";
import VerificationHeader from "@/features/verification/dashboard/VerificationHeader";
import VerificationFooter from "@/features/verification/dashboard/VerificationFooter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
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
    <div className="space-y-6">
      <VerificationHeader />

      <div className="flex items-center justify-between">
        <Link href="/verify">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to Manual Entry
          </Button>
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-teal)]">
            <span className="flex h-2 w-2 rounded-full bg-[var(--brand-teal)]" />
            <span>Live Camera Scanner</span>
          </div>
          <CardTitle className="mt-2">Scan Document QR Code</CardTitle>
          <CardDescription>
            Point your camera at the QR code located on the document or certificate.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {scanNotice && (
            <div className="mb-4 rounded-xl bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 p-3 text-center text-xs font-medium text-[var(--brand-indigo)]">
              {scanNotice}
            </div>
          )}

          <QRScanner
            onScanSuccess={handleScanSuccess}
            onInvalidToken={handleInvalidToken}
          />
        </CardContent>
      </Card>

      <VerificationFooter />
    </div>
  );
}