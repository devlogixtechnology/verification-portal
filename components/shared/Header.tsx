"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export interface HeaderProps {
  showLoginButton?: boolean;
}

export default function Header({ showLoginButton = true }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Verify Asset" },
    { href: "/verify/scan", label: "Camera Scan" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-white/95 backdrop-blur-md transition-all shadow-2xs">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Hamburger (Only visible on small screens: sm:hidden) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] sm:hidden transition"
              aria-label="Open mobile menu"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* DevLogix Logo */}
            <Link href="/" className="flex items-center gap-2 transition hover:opacity-90 active:scale-98">
              <Image
                src="/devlogix-logo.svg"
                alt="DevLogix"
                width={136}
                height={28}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center (Desktop Navigation - No Hamburger needed on desktop) */}
          <nav className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] p-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-white text-[var(--text-primary)] shadow-2xs font-bold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Login Action */}
          {showLoginButton && (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-teal-border)] bg-[var(--brand-teal-light)] px-4 py-1.5 text-xs font-bold text-[var(--brand-teal-dark)] transition hover:bg-[var(--brand-teal)] hover:text-white active:scale-95 shadow-2xs"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer (Only for mobile viewports) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative flex w-full max-w-xs flex-col bg-[var(--surface-card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
              <Image
                src="/devlogix-logo.svg"
                alt="DevLogix"
                width={120}
                height={26}
                className="h-6 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--brand-teal-light)] text-[var(--brand-teal-dark)] font-bold"
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="my-4 border-t border-[var(--border-default)]" />

              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-teal)] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-teal-hover)] transition active:scale-98"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin Login</span>
              </Link>
            </nav>

            <div className="mt-auto border-t border-[var(--border-default)] pt-4 text-center">
              <p className="text-[11px] text-[var(--text-muted)]">
                © 2026 DevLogix. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
