"use client";

type ScannerPlaceholderProps = {
  onScan: (token: string) => void;
};

export default function ScannerPlaceholder({
  onScan,
}: ScannerPlaceholderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-6 sm:px-8">
        <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Verify a Document
        </h1>

        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
          Scan the QR code associated with the asset you want to verify.
        </p>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--border)] p-8">
          <p className="text-sm text-[var(--muted-foreground)]">
            QR Scanner will appear here.
          </p>

          <button
            type="button"
            onClick={() => onScan("demo-token-12345")}
            className="rounded-lg bg-[var(--brand-indigo)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Simulate QR Scan
          </button>
        </div>
      </div>
    </section>
  );
}