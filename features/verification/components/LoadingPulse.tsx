import React from "react";

export interface LoadingPulseProps {
  label?: string;
}

export default function LoadingPulse({
  label = "Verifying asset...",
}: LoadingPulseProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex min-h-[65vh] flex-col items-center justify-center gap-3 py-12"
    >
      {/* Top Small Dot */}
      <div className="h-4 w-4 rounded-full bg-[var(--brand-teal)]" />

      {/* Center Large Pulsing Dot */}
      <div className="h-11 w-11 rounded-full bg-[var(--brand-teal)] shadow-md animate-pulse-center" />

      {/* Bottom Small Dot */}
      <div className="h-4 w-4 rounded-full bg-[var(--brand-teal)]" />

      <span className="sr-only">{label}</span>
    </div>
  );
}
