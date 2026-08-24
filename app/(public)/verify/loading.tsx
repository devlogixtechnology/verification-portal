import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function VerifyLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <Spinner size="xl" label="Loading verification portal..." />
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        Loading verification portal...
      </p>
    </div>
  );
}