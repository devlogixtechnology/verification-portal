import React, { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4 py-2.5 rounded-xl gap-2",
      lg: "text-base px-6 py-3 rounded-xl gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-[var(--brand-teal)] text-[var(--brand-indigo)] font-semibold hover:bg-[var(--brand-teal-hover)] active:scale-[0.99] focus-visible:ring-[var(--brand-teal)] shadow-sm",
      secondary:
        "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--background)] active:scale-[0.99] focus-visible:ring-[var(--border)] shadow-sm",
      outline:
        "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--brand-teal)]/10 hover:border-[var(--brand-teal)] active:scale-[0.99] focus-visible:ring-[var(--brand-teal)]",
      ghost:
        "bg-transparent text-[var(--foreground)] hover:bg-[var(--brand-teal)]/10 focus-visible:ring-[var(--brand-teal)]",
      danger:
        "bg-[var(--status-danger)] text-white hover:opacity-90 active:scale-[0.99] focus-visible:ring-[var(--status-danger)] shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

