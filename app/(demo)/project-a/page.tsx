"use client";

import { TokenEntryView } from "@/features/verification";

export default function ProjectAPage() {
  return (
    <TokenEntryView
      title="Aurora Legal — Document Check"
      subtitle="Scan or enter a document reference to confirm it is genuine."
      submitLabel="Check document"
    />
  );
}
