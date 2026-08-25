"use client";

import { TokenEntryView } from "@/features/verification";

export default function ProjectBPage() {
  return (
    <TokenEntryView
      title="Northwind Academy"
      subtitle="Confirm that a certificate was really issued by us."
      inputLabel="Enter the certificate code provided to you."
      inputPlaceholder="Code"
      submitLabel="Confirm"
    />
  );
}
