"use client";

import { QRScanner } from "@/features/verification";

export default function ProjectAScanPage() {
  return (
    <QRScanner
      presets={[
        { label: "Valid document", token: "DOC-1001" },
        { label: "Expired", token: "DOC-1002" },
      ]}
    />
  );
}
