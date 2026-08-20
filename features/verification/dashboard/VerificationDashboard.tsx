import type { ReactNode } from "react";

import type { VerificationState } from "@/store/verification/types";

import VerificationHeader from "./VerificationHeader";
import VerificationStatus from "./VerificationStatus";
import VerificationFooter from "./VerificationFooter";

type VerificationDashboardProps = {
  state: VerificationState;
  children?: ReactNode;
};

export default function VerificationDashboard({
  state,
  children,
}: VerificationDashboardProps) {
  const showResult =
    state.status === "valid" ||
    state.status === "invalid" ||
    state.status === "expired" ||
    state.status === "revoked" ||
    state.status === "error";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <VerificationHeader />

        {showResult && (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <VerificationStatus state={state} />

            {state.status === "valid" && children && (
              <section className="space-y-6 p-5 sm:p-8">
                {children}
              </section>
            )}
          </div>
        )}

        <VerificationFooter />
      </div>
    </main>
  );
}