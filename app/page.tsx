import VerificationFlow from "@/features/verification/VerificationFlow";

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <VerificationFlow />
      </div>
    </main>
  );
}