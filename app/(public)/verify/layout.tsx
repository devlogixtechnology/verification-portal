"use client";

import React, { type ReactNode } from "react";
import { VerificationProvider } from "@/features/verification";
import { defaultVerificationConfig } from "@/features/verification/config/verification.config";

export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <VerificationProvider config={defaultVerificationConfig}>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </VerificationProvider>
  );
}

