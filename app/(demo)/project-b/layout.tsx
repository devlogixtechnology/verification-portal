"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { VerificationProvider } from "@/features/verification";
import ThemeScope from "../ThemeScope";
import { createProjectBConfig } from "./config";
import "./tokens-b.css";

export default function ProjectBLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const config = useMemo(() => createProjectBConfig((path) => router.push(path)), [router]);

  return (
    <ThemeScope theme="b">
      <VerificationProvider config={config}>{children}</VerificationProvider>
    </ThemeScope>
  );
}
