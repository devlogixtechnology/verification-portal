"use client";

import type { VerificationConfig, VerificationActions } from "@/features/verification";
import { createEnvelopeParser, type RejectionDetail } from "@/lib/api/verificationEnvelope";
import { extractTokenFromInput, validateTokenFormat } from "@/lib/config/tokenUtils";

/** Project A's asset shape. Nothing like B's or C's — that is the point. */
export interface LegalDocument {
  assetType: string;
  title: string;
  issuedTo: string;
  issuedOn: string;
}

function formatDate(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

/** Aurora presents a document face above a divided list of its particulars. */
function DocumentView({
  asset,
  actions,
}: {
  asset: LegalDocument;
  actions: VerificationActions;
}) {
  const rows: Array<[string, string]> = [
    ["Document type", asset.assetType],
    ["Issued to", asset.issuedTo],
    ["Date of issue", formatDate(asset.issuedOn)],
    ["Status", "valid"],
  ];

  return (
    <div className="vf-screen">
      <div className="vf-preview">
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
        <span className="vf-preview__caption">Authenticated document</span>
      </div>

      <h2 className="vf-title vf-title--small">{asset.title}</h2>

      <div className="vf-list">
        {rows.map(([label, value]) => (
          <div className="vf-detail-row" key={label}>
            <span className="vf-label">{label}</span>
            <span className="vf-detail-row__value">{value}</span>
          </div>
        ))}
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another document
      </button>
    </div>
  );
}

function RejectedView({
  message,
  detail,
  actions,
}: {
  message: string;
  detail?: RejectionDetail;
  actions: VerificationActions;
}) {
  return (
    <div className="vf-screen">
      <div className="vf-preview" style={{ borderColor: "var(--verification-danger)" }}>
        <svg
          className="vf-preview__mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          style={{ color: "var(--verification-danger)" }}
          aria-hidden="true"
        >
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v5h5" />
          <path d="M10 13l4 4m0-4l-4 4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="vf-preview__caption">Not authenticated</span>
      </div>

      <p className="vf-message">{message}</p>

      <div className="vf-list">
        <div className="vf-detail-row">
          <span className="vf-label">Reason</span>
          <span className="vf-detail-row__value">{detail?.reason ?? "unknown"}</span>
        </div>
        {detail?.expiredAt && (
          <div className="vf-detail-row">
            <span className="vf-label">Expired on</span>
            <span className="vf-detail-row__value">{formatDate(detail.expiredAt)}</span>
          </div>
        )}
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another document
      </button>
    </div>
  );
}

export function createProjectAConfig(
  navigate: (path: string) => void
): VerificationConfig<LegalDocument, RejectionDetail> {
  return {
    apiBaseUrl: "http://localhost:4001",
    parseToken: extractTokenFromInput,
    isValidTokenFormat: validateTokenFormat,
    parseVerificationResponse: createEnvelopeParser<LegalDocument>(),
    onNavigate: (route) => {
      const base = "/project-a";
      if (route.name === "start") return navigate(base);
      if (route.name === "scanner") return navigate(`${base}/scan`);
      return navigate(`${base}/${encodeURIComponent(route.token)}`);
    },
    renderVerified: (asset, actions) => <DocumentView asset={asset} actions={actions} />,
    renderInvalid: (message, detail, actions) => (
      <RejectedView message={message} detail={detail} actions={actions} />
    ),
  };
}
