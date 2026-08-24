import React from "react";
import type { VerificationRecipient } from "@/features/verification/types/verification.types";

export interface RecipientDetailsProps {
  recipient?: VerificationRecipient;
}

export default function RecipientDetails({ recipient }: RecipientDetailsProps) {
  if (!recipient) return null;

  return (
    <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        Issued To (Holder)
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-lg font-bold text-[var(--foreground)]">
          <svg className="h-6 w-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-[var(--foreground)] truncate">
            {recipient.name}
          </p>

          {recipient.email && (
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {recipient.email}
            </p>
          )}

          {recipient.identifier && (
            <p className="mt-0.5 font-mono text-[11px] text-[var(--muted-foreground)]">
              ID: {recipient.identifier}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}