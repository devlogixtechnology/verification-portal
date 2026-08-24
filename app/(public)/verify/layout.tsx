import type { Metadata } from "next";
import React, { type ReactNode } from "react";
import { VerificationProvider } from "@/features/verification";

export const metadata: Metadata = {
  title: "Verify Asset Authenticity",
  description:
    "Scan a QR code or enter your DevLogix reference number to instantly verify document authenticity, issuer details, and cryptographic proof.",
  alternates: {
    canonical: "https://verify.devlogix.online/verify",
  },
  openGraph: {
    title: "Verify Asset Authenticity | DevLogix Portal",
    description:
      "Instant cryptographic credential and document verification engine.",
    url: "https://verify.devlogix.online/verify",
    siteName: "DevLogix Verification Portal",
    images: [
      {
        url: "/devlogix-logo.svg",
        width: 1023,
        height: 221,
        alt: "DevLogix Verification Portal",
      },
    ],
  },
};

export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <VerificationProvider>
      {children}
    </VerificationProvider>
  );
}
