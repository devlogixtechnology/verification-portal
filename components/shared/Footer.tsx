import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 px-4 text-center">
        {/* Centered DevLogix Logo */}
        <Image
          src="/devlogix-logo.svg"
          alt="DevLogix"
          width={120}
          height={26}
          className="h-6 w-auto object-contain opacity-90"
        />

        {/* Verified URL Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
          <span>Verified via</span>
          <span className="font-mono font-bold text-sky-800">verify.devlogix.online</span>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} DevLogix. All rights reserved. Read-only verification engine.
        </p>
      </div>
    </footer>
  );
}
