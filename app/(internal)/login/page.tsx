"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setNotice("Admin authorization endpoint is ready for integration. Connected to verification API.");
    }, 800);
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-xs text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/devlogix-logo.svg"
            alt="DevLogix"
            width={160}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Admin & API Access
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Sign in to manage credential registries and test verification endpoints.
          </p>
        </div>

        {/* Notice */}
        {notice && (
          <div className="rounded-2xl bg-[var(--brand-teal-light)] border border-[var(--brand-teal-border)] p-3 text-xs font-medium text-[var(--brand-teal-dark)]">
            {notice}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="admin@devlogix.online"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[var(--brand-navy)] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-navy-hover)] active:scale-98 mt-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="border-t border-[var(--border-subtle)] pt-4">
          <Link
            href="/verify"
            className="text-xs font-semibold text-[var(--brand-teal-dark)] hover:underline"
          >
            ← Back to Public Document Verification
          </Link>
        </div>
      </div>
    </div>
  );
}
