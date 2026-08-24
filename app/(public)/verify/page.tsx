"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TokenInputForm } from "@/features/verification/components/TokenInputForm";
import VerificationHeader from "@/features/verification/dashboard/VerificationHeader";
import VerificationFooter from "@/features/verification/dashboard/VerificationFooter";

export default function VerifyPage() {
  return (
    <div className="space-y-8">
      <VerificationHeader />

      {/* Main Verification Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[var(--brand-teal)]">
            <span className="flex h-2 w-2 rounded-full bg-[var(--brand-teal)]" />
            <span>Digital Asset Authenticity</span>
          </div>
          <CardTitle className="mt-2">Verify Credential Authenticity</CardTitle>
          <CardDescription>
            Enter a certificate reference number, verification token, or paste a document verification link below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <TokenInputForm />
        </CardContent>
      </Card>

      {/* Scan with Camera Card */}
      <Card className="border-[var(--border-subtle)] bg-gradient-to-br from-[var(--card)] to-[var(--background)]">
        <CardContent className="flex flex-col items-center p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-teal)]/15 text-[var(--brand-indigo)]">
              <svg className="h-7 w-7 text-[var(--brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[var(--foreground)]">Have a physical or digital QR code?</h4>
              <p className="text-xs text-[var(--muted-foreground)]">
                Scan instantly using your smartphone or webcam without manual entry.
              </p>
            </div>
          </div>

          <Link href="/verify/scan" className="mt-4 sm:mt-0">
            <Button variant="primary" size="md">
              Open Camera Scanner
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Trust & Guarantees */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h5 className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Tamper Proof</h5>
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
            Cryptographically sealed against revocation and modification.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h5 className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Instant Validation</h5>
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
            Real-time validation directly against the official issuer registry.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h5 className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Privacy Preserving</h5>
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
            Zero personal data retention; verifications are performed on-the-fly.
          </p>
        </div>
      </div>

      <VerificationFooter />
    </div>
  );
}