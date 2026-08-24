import React from "react";

export interface NetworkErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export default function NetworkErrorView({
  message = "There was a problem in verifying your asset. Please check your network and try again.",
  onRetry,
}: NetworkErrorViewProps) {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-12 text-center w-full">
      {/* Globe with Red Disconnected Badge */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Teal Wireframe Globe */}
        <svg
          className="h-28 w-28 text-[var(--brand-teal)]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        >
          <circle cx="50" cy="50" r="44" />
          <line x1="6" y1="50" x2="94" y2="50" />
          <path d="M12 28 Q50 42 88 28" />
          <path d="M12 72 Q50 58 88 72" />
          <ellipse cx="50" cy="50" rx="24" ry="44" />
          <line x1="50" y1="6" x2="50" y2="94" />
        </svg>

        {/* Red Disconnected Sign */}
        <div className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-card)] p-0.5 shadow-md">
          <svg className="h-full w-full text-[var(--status-danger)]" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="4" />
            <line x1="7" y1="7" x2="29" y2="29" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <p className="max-w-xs text-sm sm:text-base font-medium leading-relaxed text-[var(--text-primary)]">
        {message}
      </p>

      {/* Retry Action */}
      <div className="mt-8 w-full max-w-xs">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-2xl bg-[var(--brand-teal)] py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-[var(--brand-teal-hover)] active:scale-98"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
