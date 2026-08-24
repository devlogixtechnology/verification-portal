import React, { type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
  };

  const variantStyles = {
    success:
      "bg-[var(--brand-teal)]/15 text-[var(--brand-indigo)] border border-[var(--brand-teal)]/30",
    danger:
      "bg-[var(--status-danger)]/10 text-[var(--status-danger)] border border-[var(--status-danger)]/20",
    warning:
      "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    info:
      "bg-sky-500/10 text-sky-600 border border-sky-500/20",
    neutral:
      "bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]",
  };

  const dotColor = {
    success: "bg-[var(--brand-teal)]",
    danger: "bg-[var(--status-danger)]",
    warning: "bg-amber-500",
    info: "bg-sky-500",
    neutral: "bg-neutral-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  );
}

