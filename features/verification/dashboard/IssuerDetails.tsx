import type { VerificationIssuer } from "@/features/verification/types/verification.types";
import Image from "next/image";

type IssuerDetailsProps = {
  issuer: VerificationIssuer;
};

export default function IssuerDetails({
  issuer,
}: IssuerDetailsProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        Issued By
      </p>

      <div className="mt-4 flex items-center gap-4">
        {issuer.logoUrl ? (
          <Image
            src={issuer.logoUrl}
            alt={`${issuer.name} logo`}
            className="h-12 w-12 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-teal)]/15 text-lg font-semibold text-[var(--brand-indigo)]">
            {issuer.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}

        <div className="min-w-0">
          <p className="font-semibold text-[var(--foreground)]">
            {issuer.name}
          </p>

          {issuer.designation && (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {issuer.designation}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}