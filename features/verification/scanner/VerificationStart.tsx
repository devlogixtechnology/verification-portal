"use client";

type VerificationStartProps = {
  onStart: () => void;
};

export default function VerificationStart({
  onStart,
}: VerificationStartProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-teal)]/15">
          <span className="text-2xl text-[var(--brand-indigo)]">
            ⌗
          </span>
        </div>

        <h1 className="mt-5 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Verify a Document
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
          Scan the QR code associated with the document to verify
          its authenticity.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 rounded-lg bg-[var(--brand-indigo)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Start Verification
        </button>
      </div>
    </section>
  );
}