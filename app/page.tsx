import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { TokenInputForm } from "@/features/verification/components/TokenInputForm";
import VerificationFooter from "@/features/verification/dashboard/VerificationFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--card)] sticky top-0 z-20 shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-teal)] text-[var(--brand-indigo)] font-bold text-lg shadow-xs">
              D
            </div>
            <div>
              <span className="font-bold tracking-tight text-[var(--foreground)] sm:text-lg">
                DevLogix
              </span>
              <span className="ml-2 rounded-md bg-[var(--brand-teal)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-teal)]">
                Trust Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/verify/scan">
              <Button variant="outline" size="sm">
                Scan QR Code
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="primary" size="sm">
                Verify Document
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-indigo)] mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-teal)] animate-pulse" />
              <span>Official Verification Service</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Instant, Cryptographic{" "}
              <span className="text-[var(--brand-teal)]">Document Verification</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg">
              Verify authentic certificates, licenses, and official credentials in real-time with tamper-proof cryptographic validation.
            </p>

            {/* Quick Verification Card */}
            <div className="mx-auto mt-10 max-w-2xl">
              <Card className="shadow-lg text-left border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Verification Lookup</CardTitle>
                  <CardDescription>
                    Enter a reference number or paste a document URL to verify immediately.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TokenInputForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--card)] py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Enterprise-Grade Trust & Integrity
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Built to protect individuals and organizations from fraudulent and forged documents.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Instant QR Scanning</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  Scan physical paper certificates or digital QR codes directly via camera stream with automated resolution.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Cryptographic Signatures</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  Every verified document is matched against immutable authority hashes to ensure zero tampering.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Real-time Revocation Checks</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  Immediate detection of expired, revoked, or invalid credentials to maintain full compliance.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <VerificationFooter text="DevLogix Verification Portal — Secure & Verifiable Trust Network" />
    </div>
  );
}