import React from "react";
import Link from "next/link";
import type { VerifiedDocument } from "@/features/verification/types/verification.types";

export interface CaPassDashboardProps {
  document: VerifiedDocument;
  onVerifyAnother?: () => void;
}

function formatDateDisplay(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export default function CaPassDashboard({
  document,
  onVerifyAnother,
}: CaPassDashboardProps) {
  const statusLabel = document.status === "active" ? "Valid" : "Valid";
  const issuerName = document.issuer?.name || "Squad Nova";
  const projectName = document.title || "Client Portal Redesign";
  const recipientName = document.recipient?.name || "Client Ops Team";
  const dateOfIssue = formatDateDisplay(document.issuanceDate);
  const sourceCodeStatus =
    document.additionalData?.["Source Code"] ||
    document.additionalData?.SourceCode ||
    "Present";

  return (
    <div className="w-full space-y-4">
      {/* Row 1: Status & Issuer (2 columns) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Status Card */}
        <div className="mockup-metric-card">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Status
          </span>
          <span className="text-right text-xl sm:text-2xl font-bold tracking-tight text-[var(--brand-teal)]">
            {statusLabel}
          </span>
        </div>

        {/* Issuer Card */}
        <div className="mockup-metric-card">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Issuer
          </span>
          <span className="text-right text-lg sm:text-xl font-bold tracking-tight text-[var(--brand-teal)] truncate">
            {issuerName}
          </span>
        </div>
      </div>

      {/* Row 2: Project Name (Full Width) */}
      <div className="mockup-metric-card">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          Project Name
        </span>
        <span className="text-right text-lg sm:text-2xl font-bold tracking-tight text-[var(--brand-teal)] truncate">
          {projectName}
        </span>
      </div>

      {/* Row 3: Delivered to (Full Width) */}
      <div className="mockup-metric-card">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          Delivered to
        </span>
        <span className="text-right text-lg sm:text-2xl font-bold tracking-tight text-[var(--brand-teal)] truncate">
          {recipientName}
        </span>
      </div>

      {/* Row 4: Date of Issue & Source Code (2 columns) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Date of Issue Card */}
        <div className="mockup-metric-card">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Date of Issue
          </span>
          <span className="text-right text-base sm:text-xl font-bold tracking-tight text-[var(--brand-teal)]">
            {dateOfIssue}
          </span>
        </div>

        {/* Source Code Card */}
        <div className="mockup-metric-card">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Source Code
          </span>
          <span className="text-right text-lg sm:text-xl font-bold tracking-tight text-[var(--brand-teal)]">
            {String(sourceCodeStatus)}
          </span>
        </div>
      </div>

      {/* Bottom Action: Verify Another Document */}
      <div className="pt-3">
        <Link href="/verify" onClick={onVerifyAnother} className="block w-full">
          <button
            type="button"
            className="w-full rounded-2xl border-2 border-[var(--brand-teal)] bg-[var(--surface-card)] py-3.5 text-sm font-bold text-[var(--brand-teal)] shadow-2xs transition hover:bg-[var(--brand-teal-light)] active:scale-98"
          >
            Verify Another Document
          </button>
        </Link>
      </div>
    </div>
  );
}
