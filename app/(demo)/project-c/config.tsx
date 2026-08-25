"use client";

import type { CSSProperties } from "react";
import type { VerificationConfig, VerificationActions } from "@/features/verification";
import { createEnvelopeParser, type RejectionDetail } from "@/lib/api/verificationEnvelope";
import { extractTokenFromInput, validateTokenFormat } from "@/lib/config/tokenUtils";

/** Project C serves two unrelated asset shapes from the same endpoint. */
export interface Handoff {
  assetType: string;
  projectName: string;
  deliveredBy: string;
  deliveredTo: string;
  handoffDate: string;
  includesSourceCode: boolean;
}

export interface Contract {
  assetType: string;
  contractRef: string;
  parties: string[];
  signedOn: string;
}

export type ProjectCAsset = Handoff | Contract;

function isContract(asset: ProjectCAsset): asset is Contract {
  return "contractRef" in asset;
}

function formatDate(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

/**
 * Retints everything below it by rebinding the accent the module's own classes
 * already read. One asset type turns the screen green, the other gold, without
 * either component knowing about tones.
 */
function tone(which: "a" | "b"): CSSProperties {
  return {
    "--verification-success": `var(--verification-accent-${which})`,
    "--verification-success-strong": `var(--verification-accent-${which}-strong)`,
    "--verification-info": `var(--verification-accent-${which})`,
  } as CSSProperties;
}

/** A handoff is a delivery: a grid of facts, at a glance. */
function HandoffView({ asset, actions }: { asset: Handoff; actions: VerificationActions }) {
  return (
    <div className="vf-screen" style={tone("a")}>
      <span className="vf-section-label">Project handoff</span>

      <div className="vf-metric-grid">
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Status</span>
          <span className="vf-metric-card__value">valid</span>
        </div>
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Date</span>
          <span className="vf-metric-card__value">{formatDate(asset.handoffDate)}</span>
        </div>
        <div className="vf-metric-card vf-metric-card--wide">
          <span className="vf-metric-card__label">Project</span>
          <span className="vf-metric-card__value">{asset.projectName}</span>
        </div>
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Delivered by</span>
          <span className="vf-metric-card__value">{asset.deliveredBy}</span>
        </div>
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Delivered to</span>
          <span className="vf-metric-card__value">{asset.deliveredTo}</span>
        </div>
        <div className="vf-metric-card vf-metric-card--wide">
          <span className="vf-metric-card__label">Source code</span>
          <span className="vf-metric-card__value">
            {asset.includesSourceCode ? "included" : "not included"}
          </span>
        </div>
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another asset
      </button>
    </div>
  );
}

/** A contract is a document: a face, two key facts, then the signatories. */
function ContractView({ asset, actions }: { asset: Contract; actions: VerificationActions }) {
  return (
    <div className="vf-screen" style={tone("b")}>
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
          <path d="M9 16c2-3 4 1 6-2" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="vf-preview__caption">Signed contract</span>
      </div>

      <div className="vf-metric-grid">
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Reference</span>
          <span className="vf-metric-card__value">{asset.contractRef}</span>
        </div>
        <div className="vf-metric-card">
          <span className="vf-metric-card__label">Signed on</span>
          <span className="vf-metric-card__value">{formatDate(asset.signedOn)}</span>
        </div>
      </div>

      <span className="vf-section-label">Parties</span>
      <div className="vf-list">
        {asset.parties.map((party, index) => (
          <div className="vf-detail-row" key={party}>
            <span className="vf-label">Party {index + 1}</span>
            <span className="vf-detail-row__value">{party}</span>
          </div>
        ))}
      </div>

      <button type="button" className="vf-button vf-button--quiet" onClick={actions.verifyAnother}>
        Verify another asset
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
    <div className="vf-screen vf-screen--centered">
      <svg
        className="vf-status-icon vf-status-icon--danger"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        aria-hidden="true"
      >
        <path d="M50 12 L88 78 A6 6 0 0 1 82 86 L18 86 A6 6 0 0 1 12 78 Z" strokeLinejoin="round" />
        <circle cx="50" cy="56" r="18" strokeWidth="3" />
        <polyline points="50,44 50,56 58,56" strokeWidth="3" strokeLinecap="round" />
      </svg>

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
        Verify another asset
      </button>
    </div>
  );
}

export function createProjectCConfig(
  navigate: (path: string) => void
): VerificationConfig<ProjectCAsset, RejectionDetail> {
  return {
    apiBaseUrl: "http://localhost:4003",
    parseToken: extractTokenFromInput,
    isValidTokenFormat: validateTokenFormat,
    parseVerificationResponse: createEnvelopeParser<ProjectCAsset>(),
    onNavigate: (route) => {
      const base = "/project-c";
      if (route.name === "start") return navigate(base);
      if (route.name === "scanner") return navigate(`${base}/scan`);
      return navigate(`${base}/${encodeURIComponent(route.token)}`);
    },
    renderVerified: (asset, actions) =>
      isContract(asset) ? (
        <ContractView asset={asset} actions={actions} />
      ) : (
        <HandoffView asset={asset} actions={actions} />
      ),
    renderInvalid: (message, detail, actions) => (
      <RejectedView message={message} detail={detail} actions={actions} />
    ),
  };
}
