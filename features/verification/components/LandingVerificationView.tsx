"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { extractTokenFromInput, validateTokenFormat } from "../config/verification.config";

export default function LandingVerificationView() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const token = extractTokenFromInput(code);

    if (!token) {
      setError("Please enter a verification code.");
      return;
    }

    if (!validateTokenFormat(token)) {
      setError("Invalid code format (e.g. CERT-2026-001).");
      return;
    }

    setError(null);
    router.push(`/verify/${encodeURIComponent(token)}`);
  };

  const handleBeginScan = () => {
    router.push("/verify/scan");
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Title & Subtitle */}
      <div className="w-full text-left space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--brand-teal)]">
          Verify your Asset
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Scan the QR Code provided to you on the asset you wish to verify.
        </p>
      </div>

      {/* Large QR Code Frame with Centered "Begin Scan" Button */}
      <div className="relative w-full aspect-square max-w-[340px] rounded-3xl border-2 border-[var(--brand-teal)]/40 bg-[var(--surface-card)] p-6 shadow-sm flex flex-col items-center justify-center overflow-hidden transition hover:border-[var(--brand-teal)]">
        {/* QR Matrix Graphic Watermark */}
        <div className="absolute inset-4 opacity-25 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full text-neutral-600" viewBox="0 0 200 200" fill="currentColor">
            {/* Top-Left Finder */}
            <rect x="10" y="10" width="55" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="10" />
            <rect x="25" y="25" width="25" height="25" rx="5" />
            {/* Top-Right Finder */}
            <rect x="135" y="10" width="55" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="10" />
            <rect x="150" y="25" width="25" height="25" rx="5" />
            {/* Bottom-Left Finder */}
            <rect x="10" y="135" width="55" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="10" />
            <rect x="25" y="150" width="25" height="25" rx="5" />
            {/* Pattern Blocks */}
            <rect x="75" y="15" width="15" height="15" />
            <rect x="100" y="15" width="15" height="15" />
            <rect x="85" y="45" width="15" height="15" />
            <rect x="105" y="45" width="15" height="15" />
            <rect x="20" y="80" width="15" height="15" />
            <rect x="45" y="80" width="15" height="15" />
            <rect x="20" y="105" width="15" height="15" />
            <rect x="45" y="105" width="15" height="15" />
            <rect x="75" y="80" width="20" height="20" />
            <rect x="105" y="80" width="20" height="20" />
            <rect x="75" y="105" width="20" height="20" />
            <rect x="105" y="105" width="20" height="20" />
            <rect x="140" y="80" width="15" height="15" />
            <rect x="165" y="80" width="15" height="15" />
            <rect x="140" y="105" width="15" height="15" />
            <rect x="165" y="105" width="15" height="15" />
            <rect x="80" y="145" width="15" height="15" />
            <rect x="105" y="145" width="15" height="15" />
            <rect x="140" y="145" width="15" height="15" />
            <rect x="165" y="145" width="15" height="15" />
            <rect x="80" y="170" width="15" height="15" />
            <rect x="105" y="170" width="15" height="15" />
            <rect x="140" y="170" width="15" height="15" />
            <rect x="165" y="170" width="15" height="15" />
          </svg>
        </div>

        {/* Center "Begin Scan" Button Overlay */}
        <button
          type="button"
          onClick={handleBeginScan}
          className="relative z-10 rounded-2xl bg-[var(--brand-teal)] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--brand-teal-hover)] active:scale-95 flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Begin Scan</span>
        </button>
      </div>

      {/* "Or" Divider */}
      <div className="w-full flex items-center justify-center gap-3 my-1">
        <div className="flex-1 h-px bg-[var(--border-default)] opacity-70" />
        <span className="text-xs font-semibold text-[var(--text-secondary)] px-2">Or</span>
        <div className="flex-1 h-px bg-[var(--border-default)] opacity-70" />
      </div>

      {/* Manual Code Input Form */}
      <form onSubmit={handleVerify} className="w-full space-y-3">
        <label
          htmlFor="manual-code-input"
          className="block text-xs sm:text-sm text-[var(--text-secondary)] font-medium text-left"
        >
          Enter the code that was provided to you.
        </label>

        <div>
          <input
            id="manual-code-input"
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            className={`w-full rounded-2xl border bg-[var(--surface-card)] px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] ${
              error ? "border-[var(--status-danger)]" : "border-[var(--border-default)]"
            }`}
          />

          {error && (
            <p className="mt-1.5 text-xs text-[var(--status-danger)] font-medium text-left">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--brand-teal)] py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-[var(--brand-teal-hover)] active:scale-98"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
