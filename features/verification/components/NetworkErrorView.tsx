import type { ReactElement } from "react";

export interface NetworkErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Shown when the answer could not be obtained: network, timeout, or server fault. */
export function NetworkErrorView({
  message,
  onRetry,
  retryLabel = "Retry",
}: NetworkErrorViewProps): ReactElement {
  return (
    <div className="vf-screen vf-screen--centered">
      <svg
        className="vf-status-icon vf-status-icon--info"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="44" />
        <line x1="6" y1="50" x2="94" y2="50" />
        <path d="M12 28 Q50 42 88 28" />
        <path d="M12 72 Q50 58 88 72" />
        <ellipse cx="50" cy="50" rx="24" ry="44" />
        <line x1="50" y1="6" x2="50" y2="94" />
      </svg>

      <p className="vf-message">{message}</p>

      {onRetry && (
        <div className="vf-stack">
          <button type="button" className="vf-button vf-button--primary" onClick={onRetry}>
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default NetworkErrorView;
