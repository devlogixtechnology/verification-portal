type VerificationHeaderProps = {
  brandName?: string;
  subtitle?: string;
};

export default function VerificationHeader({
  brandName = "DevLogix",
  subtitle = "Official Verification Portal",
}: VerificationHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-teal)]">
          <span className="text-sm font-bold text-[var(--brand-indigo)]">
            D
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {brandName}
          </p>

          <p className="text-xs text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}