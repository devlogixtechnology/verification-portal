import Link from "next/link";

export interface HeaderProps {
  /** Shown on the left of the bar. */
  title?: string;
  showLoginLink?: boolean;
}

/**
 * The app bar. Built entirely from the verification token contract, so it
 * retints with whichever project theme is active on `<html>`.
 */
export default function Header({
  title = "Verification Portal",
  showLoginLink = true,
}: HeaderProps) {
  return (
    <header className="vf-appbar">
      <Link
        href="/"
        className="vf-appbar__brand"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        {title}
      </Link>

      <span className="vf-appbar__spacer" />

      {showLoginLink && (
        <Link href="/login" className="vf-appbar__link">
          Login
        </Link>
      )}
    </header>
  );
}
