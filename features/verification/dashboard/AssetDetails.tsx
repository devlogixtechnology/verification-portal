import React from "react";
import type { VerifiedDocument } from "@/features/verification/types/verification.types";
import { Badge } from "@/components/ui/Badge";

export interface AssetDetailsProps {
  document: VerifiedDocument;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function AssetDetails({ document }: AssetDetailsProps) {
  return (
    <section aria-labelledby="asset-details-heading" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-teal)]">
            {document.documentType || "Official Document"}
          </span>
          <h2
            id="asset-details-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl"
          >
            {document.title}
          </h2>
        </div>

        {document.status && (
          <Badge
            variant={
              document.status === "active"
                ? "success"
                : document.status === "expired"
                ? "warning"
                : "danger"
            }
            dot
            className="self-start sm:self-center"
          >
            {document.status}
          </Badge>
        )}
      </div>

      {/* Primary Key-Value Grid */}
      <div className="grid gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)]/60 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Reference Number
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-[var(--foreground)]">
            {document.referenceNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Issuance Date
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {formatDate(document.issuanceDate)}
          </p>
        </div>

        {document.expirationDate && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Valid Until
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatDate(document.expirationDate)}
            </p>
          </div>
        )}
      </div>

      {/* Additional Structured Metadata (if present) */}
      {document.additionalData && Object.keys(document.additionalData).length > 0 && (
        <div className="rounded-xl border border-[var(--border-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Document Attributes
          </p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.entries(document.additionalData).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-[var(--border-subtle)] pb-2 text-sm">
                <dt className="text-[var(--muted-foreground)]">{key}:</dt>
                <dd className="font-medium text-[var(--foreground)]">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Blockchain Cryptographic Proof */}
      {document.blockchainTxHash && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Cryptographic Integrity Proof
          </p>
          <p className="mt-1 break-all font-mono text-xs text-[var(--muted-foreground)]">
            {document.blockchainTxHash}
          </p>
        </div>
      )}
    </section>
  );
}