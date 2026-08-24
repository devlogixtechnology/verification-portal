import React from "react";
import type { VerificationState } from "@/features/verification/types/verification.types";
import { Badge } from "@/components/ui/Badge";

export interface VerificationStatusProps {
  state: VerificationState;
}

export default function VerificationStatus({ state }: VerificationStatusProps) {
  if (state.status === "idle" || state.status === "verifying") {
    return null;
  }

  const isVerified = state.status === "verified";
  const isInvalid = state.status === "invalid";

  const getStatusConfig = () => {
    if (isVerified) {
      return {
        badgeVariant: "success" as const,
        badgeLabel: "Authentic & Verified",
        title: "Document Authenticity Confirmed",
        description:
          "This credential has been cryptographically validated against the official verification registry.",
        icon: (
          <svg className="h-6 w-6 text-[var(--brand-indigo)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ),
        bgClass: "bg-[var(--brand-teal)]/10 border-b border-[var(--brand-teal)]/20",
        iconBgClass: "bg-[var(--brand-teal)] text-[var(--brand-indigo)]",
      };
    }

    if (isInvalid) {
      return {
        badgeVariant: "danger" as const,
        badgeLabel: "Verification Rejected",
        title: "Invalid or Revoked Credential",
        description:
          state.errorMessage ||
          "The provided token could not be verified or does not match any active credential.",
        icon: (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        bgClass: "bg-[var(--status-danger-bg)] border-b border-[var(--status-danger)]/20",
        iconBgClass: "bg-[var(--status-danger)] text-white",
      };
    }

    return {
      badgeVariant: "warning" as const,
      badgeLabel: "Service Error",
      title: "Verification Service Unavailable",
      description:
        state.errorMessage ||
        "Could not establish a connection to the verification authority. Please retry.",
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgClass: "bg-amber-500/10 border-b border-amber-500/20",
      iconBgClass: "bg-amber-500 text-white",
    };
  };

  const config = getStatusConfig();

  return (
    <section aria-live="polite" className={`p-6 sm:p-8 ${config.bgClass}`}>
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${config.iconBgClass}`}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Badge variant={config.badgeVariant} dot size="sm" className="mb-2">
            {config.badgeLabel}
          </Badge>

          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {config.title}
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {config.description}
          </p>

          {state.errorDetail?.reason && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--status-danger)]">
              Rejection Code: {state.errorDetail.reason}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}