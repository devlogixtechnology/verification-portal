import Link from "next/link";

export default function NotFound() {
  return (
    <div className="vf-screen vf-screen--centered">
      <h1 className="vf-title">Page not found</h1>
      <p className="vf-text vf-text--muted">
        That address does not match anything on this portal.
      </p>
      <Link href="/verify" className="vf-button vf-button--quiet">
        Go to verification
      </Link>
    </div>
  );
}
