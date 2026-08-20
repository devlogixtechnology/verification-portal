"use client";

type VerificationScannerProps = {
  onScan: (token: string) => void;
  onInvalidScan?: (rawText: string) => void;
};

export default function VerificationScanner({
  onScan,
  onInvalidScan,
}: VerificationScannerProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-6 sm:px-8">
        <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Verify a Document
        </h1>

        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
          Scan the QR code associated with the document you want to verify.
        </p>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-teal)]/20">
            <span className="text-xl text-[var(--brand-indigo)]">
              QR
            </span>
          </div>

          <h2 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
            Camera scanner
          </h2>

          <p className="mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
            QR scanning will be available here once the scanner module is
            connected.
          </p>

          {/* Temporary test controls */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onScan("TEST-VERIFICATION-TOKEN")}
              className="rounded-lg bg-[var(--brand-indigo)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Simulate Scan
            </button>

            {onInvalidScan && (
              <button
                type="button"
                onClick={() => onInvalidScan("INVALID-TEST-CODE")}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
              >
                Simulate Invalid Scan
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}