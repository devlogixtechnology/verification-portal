import Link from "next/link";

/**
 * Demo index. Not part of the product.
 *
 * A real deployment has one consuming project, so this page and `app/(demo)/`
 * both get deleted — see README, "Stripping the demo".
 */
const DEMOS = [
  {
    href: "/project-a",
    name: "Aurora Legal",
    detail: "Backend :4001 — legal documents. Document preview above a divided list.",
  },
  {
    href: "/project-b",
    name: "Northwind Academy",
    detail: "Backend :4002 — certificates. Crest hero above a metric grid.",
  },
  {
    href: "/project-c",
    name: "Meridian Delivery",
    detail: "Backend :4003 — two asset shapes, two accent tones, two layouts.",
  },
];

export default function HomePage() {
  return (
    <main className="vf-page">
      <div className="vf-stack">
        <h1 className="vf-title vf-title--large">Verification Portal</h1>
        <p className="vf-text vf-text--muted">
          One verification module, three consuming projects. Each brings its own
          backend, asset shape, result layout and theme — and none of them change
          a file inside <code>features/verification</code>.
        </p>
        <p className="vf-caption">
          Start the backends first: <code>cd mock-backend &amp;&amp; npm start</code>
        </p>
      </div>

      <div className="vf-stack">
        {DEMOS.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="vf-card vf-stack"
            style={{ textDecoration: "none" }}
          >
            <span className="vf-title vf-title--small">{demo.name}</span>
            <span className="vf-caption">{demo.detail}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
