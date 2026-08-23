import type { VerificationState } from "@/features/verification/types/verification.types";

type VerificationStatusProps = {
  state: VerificationState;
};

const statusConfig = {
  verified: {
    label: "Verified",
    title: "Document Verified",
    description:
      "This document has been successfully verified as authentic.",
    icon: "✓",
  },

  invalid: {
    label: "Invalid",
    title: "Verification Failed",
    description:
      "The provided verification code could not be matched to a valid asset.",
    icon: "!",
  },

  error: {
    label: "Error",
    title: "Verification Error",
    description:
      "We couldn't complete the verification. Please try again.",
    icon: "!",
  },
} as const;

export default function VerificationStatus({
  state,
}: VerificationStatusProps) {
  if (
    state.status === "idle" ||
    state.status === "verifying"
  ) {
    return null;
  }

  const content = statusConfig[state.status];

  const verified = state.status === "verified";

  return (
    <section
      className={[
        "border-b px-5 py-8 sm:px-8",
        verified
          ? "bg-[var(--brand-teal)]/10"
          : "bg-[var(--brand-red)]/5",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center",
            "rounded-full text-lg font-semibold",
            verified
              ? "bg-[var(--brand-teal)] text-[var(--brand-indigo)]"
              : "bg-[var(--brand-red)] text-white",
          ].join(" ")}
        >
          {content.icon}
        </div>

        {/* Status Content */}
        <div className="min-w-0">
          {/* Badge */}
          <div className="mb-1">
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-1",
                "text-xs font-semibold uppercase tracking-wide",
                verified
                  ? "bg-[var(--brand-teal)]/20 text-[var(--brand-indigo)]"
                  : "bg-[var(--brand-red)]/10 text-[var(--brand-red)]",
              ].join(" ")}
            >
              {content.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
            {content.title}
          </h1>

          {/* Description */}
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}