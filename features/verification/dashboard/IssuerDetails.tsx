/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { VerificationIssuer } from "@/features/verification/types/verification.types";

export interface IssuerDetailsProps {
  issuer?: VerificationIssuer;
}

export default function IssuerDetails({ issuer }: IssuerDetailsProps) {
  if (!issuer) return null;

  return (
    <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Issuing Authority
        </p>
        {issuer.verifiedBadge && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-teal)]">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified Issuer
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        {issuer.logoUrl ? (
          <img
            src={issuer.logoUrl}
            alt={`${issuer.name} logo`}
            className="h-12 w-12 rounded-xl border border-[var(--border-subtle)] object-contain p-1"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-teal)]/15 text-lg font-bold text-[var(--brand-indigo)]">
            {issuer.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        <div className="min-w-0">
          <p className="font-semibold text-[var(--foreground)] truncate">
            {issuer.name}
          </p>

          {issuer.designation && (
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {issuer.designation}
            </p>
          )}

          {issuer.website && (
            <a
              href={issuer.website}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--brand-teal)] hover:underline"
            >
              <span>Official Website</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}