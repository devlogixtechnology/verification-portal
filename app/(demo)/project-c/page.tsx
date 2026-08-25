"use client";

import { TokenEntryView } from "@/features/verification";

export default function ProjectCPage() {
  return (
    <TokenEntryView
      title="Meridian Delivery Portal"
      subtitle="Verify a project handoff or a signed contract."
      inputLabel="Enter the reference code provided to you."
      inputPlaceholder="Code"
      submitLabel="Verify asset"
    />
  );
}
