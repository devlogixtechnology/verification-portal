import type { VerifiedDocument } from "@/store/verification/types";

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
  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-blue)]">
          {document.documentType}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {document.title}
        </h2>
      </div>

      <div className="grid gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Reference Number
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {document.referenceNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Issuance Date
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {formatDate(document.issuanceDate)}
          </p>
        </div>
      </div>
    </section>
  );
}