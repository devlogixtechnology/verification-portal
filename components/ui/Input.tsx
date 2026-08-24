import React, { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-[var(--muted-foreground)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={`w-full rounded-xl border bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              errorMessage
                ? "border-[var(--status-danger)] focus-visible:ring-[var(--status-danger)]"
                : "border-[var(--border)] focus-visible:border-[var(--brand-teal)] focus-visible:ring-[var(--brand-teal)]"
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-[var(--muted-foreground)]">
              {rightIcon}
            </div>
          )}
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-xs font-medium text-[var(--status-danger)]"
          >
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-xs text-[var(--muted-foreground)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

