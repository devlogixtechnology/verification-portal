import type { ReactElement } from "react";
import type { VerificationActions } from "@/features/verification";
import type { DocumentRejection } from "@/lib/config/verification.contract";

export interface RejectedDocumentCardProps {
  message: string;
  detail?: DocumentRejection;
  actions: VerificationActions;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

const HEADINGS: Record<DocumentRejection["reason"], string> = {
  expired: "This document has expired",
  revoked: "This document has been revoked",
  invalid: "No matching document",
};

/** The rejection screen: what was wrong, plus whatever context the service gave. */
export default function RejectedDocumentCard({
  message,
  detail,
  actions,
}: RejectedDocumentCardProps): ReactElement {
  const reason = detail?.reason ?? "invalid";
  const endedOn = formatDate(detail?.expiredAt ?? detail?.revokedAt);
  const document = detail?.document;

  return (
    <div className="vf-screen">
      <div className="vf-preview" style={{ borderColor: "var(--verification-danger)" }}>
        <svg
          className="vf-preview__mark"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          style={{ color: "var(--verification-danger)" }}
          aria-hidden="true"
        >
          <path d="M50 12 L88 78 A6 6 0 0 1 82 86 L18 86 A6 6 0 0 1 12 78 Z" strokeLinejoin="round" />
          <circle cx="50" cy="56" r="18" strokeWidth="3" />
          <polyline points="50,44 50,56 58,56" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="vf-preview__caption">Not verified</span>
      </div>

      <h2 className="vf-title vf-title--small">{HEADINGS[reason]}</h2>
      <p className="vf-message">{message}</p>

      {(endedOn || document?.title) && (
        <div className="vf-list">
          {document?.title && (
            <div className="vf-detail-row">
              <span className="vf-label">Document</span>
              <span className="vf-detail-row__value">{document.title}</span>
            </div>
          )}
          {document?.referenceNumber && (
            <div className="vf-detail-row">
              <span className="vf-label">Reference</span>
              <span className="vf-detail-row__value">{document.referenceNumber}</span>
            </div>
          )}
          {document?.issuer?.name && (
            <div className="vf-detail-row">
              <span className="vf-label">Issued by</span>
              <span className="vf-detail-row__value">{document.issuer.name}</span>
            </div>
          )}
          {endedOn && (
            <div className="vf-detail-row">
              <span className="vf-label">
                {reason === "revoked" ? "Revoked on" : "Expired on"}
              </span>
              <span className="vf-detail-row__value">{endedOn}</span>
            </div>
          )}
        </div>
      )}

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another document
      </button>
    </div>
  );
}
