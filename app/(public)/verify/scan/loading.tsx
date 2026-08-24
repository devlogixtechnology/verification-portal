import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function ScanLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <Spinner size="lg" label="Initializing camera stream..." />
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        Initializing camera module...
      </p>
    </div>
  );
}