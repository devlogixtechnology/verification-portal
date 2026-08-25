import type { ReactElement } from "react";

export interface InvalidResultViewProps {
  message: string;
  onVerifyAnother?: () => void;
  verifyAnotherLabel?: string;
}

/**
 * The module's default rejection screen, used when a project supplies no
 * `renderInvalid`.
 */
export function InvalidResultView({
  message,
  onVerifyAnother,
  verifyAnotherLabel = "Verify Another Asset",
}: InvalidResultViewProps): ReactElement {
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

      {onVerifyAnother && (
        <div className="vf-stack">
          <button
            type="button"
            className="vf-button vf-button--quiet"
            onClick={onVerifyAnother}
          >
            {verifyAnotherLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default InvalidResultView;
