"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { VerificationProvider } from "@/features/verification";
import { createProductionConfig } from "@/lib/config/verification.config";

/**
 * The production verification flow.
 *
 * No theme override: this uses the module's base token contract. Add a
 * `tokens.css` and a `data-vf-theme` wrapper here if the service gets its own
 * visual identity.
 */
export default function VerifyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const config = useMemo(
    () => createProductionConfig((path) => router.push(path)),
    [router]
  );

  return <VerificationProvider config={config}>{children}</VerificationProvider>;
}
