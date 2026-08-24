import React from "react";
import Link from "next/link";

export interface CaFailDashboardProps {
  message?: string;
  expirationDate?: string;
  reason?: string;
  onVerifyAnother?: () => void;
}

function formatDateDisplay(dateStr?: string) {
  if (!dateStr) return "DD/MM/YYYY";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export default function CaFailDashboard({
  message,
  expirationDate,
  reason,
  onVerifyAnother,
}: CaFailDashboardProps) {
  const formattedExpiry = formatDateDisplay(expirationDate);
  const displayMessage =
    message ||
    (reason === "expired"
      ? `This asset expired at ${formattedExpiry}.`
      : reason === "revoked"
      ? "This asset has been revoked by the issuing authority."
      : `This asset expired at ${formattedExpiry}.`);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-between px-4 py-8 text-center w-full">
      <div className="flex flex-1 flex-col items-center justify-center space-y-6">
        {/* Red Clock / Warning Badge SVG */}
        <div className="relative flex items-center justify-center">
          <svg
            className="h-28 w-28 text-[var(--status-danger)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path
              d="M50 12 L88 78 A6 6 0 0 1 82 86 L18 86 A6 6 0 0 1 12 78 Z"
              stroke="currentColor"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="56" r="18" stroke="currentColor" strokeWidth="3" />
            <polyline points="50,44 50,56 58,56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Expiration Description */}
        <p className="max-w-xs text-sm sm:text-base font-bold text-[var(--text-primary)] leading-relaxed">
          {displayMessage}
        </p>
      </div>

      {/* Bottom Action: Verify Another Document */}
      <div className="w-full max-w-xs pt-6">
        <Link href="/verify" onClick={onVerifyAnother} className="block w-full">
          <button
            type="button"
            className="w-full rounded-2xl border-2 border-[var(--brand-teal)] bg-[var(--surface-card)] py-3.5 text-sm font-bold text-[var(--brand-teal)] shadow-2xs transition hover:bg-[var(--brand-teal-light)] active:scale-98"
          >
            Verify Another Document
          </button>
        </Link>
      </div>
    </div>
  );
}
