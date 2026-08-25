"use client";

import { QRScanner } from "@/features/verification";

export default function ProjectBScanPage() {
  return (
    <QRScanner
      presets={[
        { label: "Valid certificate", token: "CERT-2001" },
        { label: "Revoked", token: "CERT-2002" },
      ]}
    />
  );
}
