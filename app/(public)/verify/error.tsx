"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Something went wrong while loading verification.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-medium text-[var(--brand-indigo)]"
      >
        Try again
      </button>
    </div>
  );
}