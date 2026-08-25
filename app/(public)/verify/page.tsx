"use client";

import { TokenEntryView } from "@/features/verification";

export default function VerifyPage() {
  return (
    <TokenEntryView
      title="Verify a document"
      subtitle="Scan the QR code on your document, or enter the code printed with it."
      inputLabel="Enter the code provided with your document."
    />
  );
}
