"use client";

import { QRScanner } from "@/features/verification";

export default function ProjectCScanPage() {
  return (
    <QRScanner
      presets={[
        { label: "Handoff", token: "HANDOFF-3001" },
        { label: "Contract", token: "CONTRACT-4001" },
        { label: "Expired", token: "HANDOFF-3002" },
        { label: "Revoked", token: "CONTRACT-4002" },
      ]}
    />
  );
}
