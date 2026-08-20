import type { VerificationRecipient } from "@/store/verification/types";

type RecipientDetailsProps = {
  recipient: VerificationRecipient;
};

export default function RecipientDetails({
  recipient,
}: RecipientDetailsProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        Issued To
      </p>

      <div className="mt-4">
        <p className="font-semibold text-[var(--foreground)]">
          {recipient.name}
        </p>

        {recipient.email && (
          <p className="mt-1 break-all text-sm text-[var(--muted-foreground)]">
            {recipient.email}
          </p>
        )}
      </div>
    </section>
  );
}