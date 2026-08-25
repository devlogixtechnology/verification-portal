"use client";

import type { VerificationConfig, VerificationActions } from "@/features/verification";
import { createEnvelopeParser, type RejectionDetail } from "@/lib/api/verificationEnvelope";
import { extractTokenFromInput, validateTokenFormat } from "@/lib/config/tokenUtils";

/** Project B's asset shape: a training certificate. */
export interface Certificate {
  assetType: string;
  courseTitle: string;
  recipientName: string;
  issuedOn: string;
}

function formatDate(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

/** Northwind leads with a crest, then a compact grid of particulars. */
function CertificateView({
  asset,
  actions,
}: {
  asset: Certificate;
  actions: VerificationActions;
}) {
  return (
    <div className="vf-screen">
      <div className="vf-hero">
        <svg
          className="vf-status-icon vf-status-icon--success"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          aria-hidden="true"
        >
          <circle cx="50" cy="38" r="24" />
          <path d="M34 58 L28 92 L50 80 L72 92 L66 58" strokeLinejoin="round" />
          <polyline points="40,38 47,46 61,30" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <h2 className="vf-title vf-title--small">{asset.courseTitle}</h2>
        <p className="vf-text">Awarded to {asset.recipientName}</p>
      </div>

      <div className="vf-metric-grid">
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Status</span>
          <span className="vf-metric-card__value">valid</span>
        </div>
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Issued</span>
          <span className="vf-metric-card__value">{formatDate(asset.issuedOn)}</span>
        </div>
        <div className="vf-metric-card vf-metric-card--wide">
          <span className="vf-metric-card__label">Credential</span>
          <span className="vf-metric-card__value">{asset.assetType}</span>
        </div>
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another certificate
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
      <div className="vf-hero" style={{ borderColor: "var(--verification-danger)" }}>
        <svg
          className="vf-status-icon vf-status-icon--danger"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          aria-hidden="true"
        >
          <circle cx="50" cy="38" r="24" />
          <path d="M34 58 L28 92 L50 80 L72 92 L66 58" strokeLinejoin="round" />
          <path d="M41 29 L59 47 M59 29 L41 47" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <h2 className="vf-title vf-title--small">Not verified</h2>
        <p className="vf-text vf-text--muted">{message}</p>
      </div>

      <div className="vf-metric-grid">
        <div className="vf-metric-card vf-metric-card--wide" style={{ borderColor: "var(--verification-danger)" }}>
          <span className="vf-metric-card__label">Reason</span>
          <span className="vf-metric-card__value" style={{ color: "var(--verification-danger)" }}>
            {detail?.reason ?? "unknown"}
          </span>
        </div>
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another certificate
      </button>
    </div>
  );
}

export function createProjectBConfig(
  navigate: (path: string) => void
): VerificationConfig<Certificate, RejectionDetail> {
  return {
    apiBaseUrl: "http://localhost:4002",
    parseToken: extractTokenFromInput,
    isValidTokenFormat: validateTokenFormat,
    parseVerificationResponse: createEnvelopeParser<Certificate>(),
    onNavigate: (route) => {
      const base = "/project-b";
      if (route.name === "start") return navigate(base);
      if (route.name === "scanner") return navigate(`${base}/scan`);
      return navigate(`${base}/${encodeURIComponent(route.token)}`);
    },
    renderVerified: (asset, actions) => <CertificateView asset={asset} actions={actions} />,
    renderInvalid: (message, detail, actions) => (
      <RejectedView message={message} detail={detail} actions={actions} />
    ),
  };
}
