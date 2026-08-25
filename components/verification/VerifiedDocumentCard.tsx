import type { ReactElement } from "react";
import type { VerificationActions } from "@/features/verification";
import type { VerifiedDocument } from "@/lib/config/verification.contract";

export interface VerifiedDocumentCardProps {
  document: VerifiedDocument;
  actions: VerificationActions;
}

function formatDate(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

/** The verified result screen for a real issued document. */
export default function VerifiedDocumentCard({
  document,
  actions,
}: VerifiedDocumentCardProps): ReactElement {
  const rows: Array<[string, string]> = [
    ["Document type", document.documentType],
    ["Reference", document.referenceNumber],
    ["Date of issue", formatDate(document.issuanceDate)],
    ["Status", document.status],
  ];

  if (document.recipient?.name) rows.splice(3, 0, ["Issued to", document.recipient.name]);
  if (document.recipient?.email) rows.splice(4, 0, ["Contact", document.recipient.email]);

  return (
    <div className="vf-screen">
      <div className="vf-preview">
        {document.issuer?.logoUrl ? (
          // The issuer's logo comes from the backend, so its host is not known
          // ahead of time; a plain img avoids per-domain image configuration.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={document.issuer.logoUrl}
            alt={document.issuer.name}
            style={{ maxHeight: "3rem", maxWidth: "60%", objectFit: "contain" }}
          />
        ) : (
          <svg
            className="vf-preview__mark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M14 3v5h5" />
            <path d="M9.5 13.5l1.8 1.8 3.7-3.8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <span className="vf-preview__caption">Verified document</span>
      </div>

      <h2 className="vf-title vf-title--small">{document.title}</h2>

      {document.issuer?.name && (
        <p className="vf-text vf-text--muted">
          Issued by {document.issuer.name}
          {document.issuer.designation ? `, ${document.issuer.designation}` : ""}
        </p>
      )}

      <div className="vf-list">
        {rows.map(([label, value]) => (
          <div className="vf-detail-row" key={label}>
            <span className="vf-label">{label}</span>
            <span className="vf-detail-row__value">{value}</span>
          </div>
        ))}
      </div>

      {document.verifiedAt && (
        <p className="vf-caption">Verified {formatDate(document.verifiedAt)}</p>
      )}

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another document
      </button>
    </div>
  );
}
