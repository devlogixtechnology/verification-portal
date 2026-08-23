type VerificationTimestampProps = {
  verifiedAt: string;
};

export default function VerificationTimestamp({
  verifiedAt,
}: VerificationTimestampProps) {
  const date = new Date(verifiedAt);

  return (
    <div className="border-t border-[var(--border)] pt-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        Verification Timestamp
      </p>

      <time
        dateTime={verifiedAt}
        className="mt-1 block text-sm font-medium text-[var(--foreground)]"
      >
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(date)}
      </time>
    </div>
  );
}