type VerificationFooterProps = {
  text?: string;
};

export default function VerificationFooter({
  text = "Secure Verification Portal",
}: VerificationFooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-[var(--muted-foreground)]">
          {text}
        </p>
      </div>
    </footer>
  );
}