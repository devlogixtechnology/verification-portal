import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  label = "Loading...",
  className = "",
}: SpinnerProps) {
  const sizeStyles = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };

  return (
    <div
      role="status"
      className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-[var(--border-subtle)] border-t-[var(--brand-teal)] ${sizeStyles[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

