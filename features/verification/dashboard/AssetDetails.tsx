import type { VerifiedDocument } from "@/features/verification/types/verification.types";

type AssetDetailsProps = {
  document: VerifiedDocument;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function AssetDetails({
  document,
}: AssetDetailsProps) {
  // Cast to the specific shape this UI component expects for the mock
  const doc = document as {
    documentType?: string;
    title?: string;
    referenceNumber?: string;
    issuanceDate?: string;
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
          {doc.documentType}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {doc.title}
        </h2>
      </div>

      <div className="grid gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Reference Number
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {doc.referenceNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Issuance Date
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {doc.issuanceDate ? formatDate(doc.issuanceDate) : null}
          </p>
        </div>
      </div>
    </section>
  );
}