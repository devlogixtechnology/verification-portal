"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { VerificationProvider } from "@/features/verification";
import ThemeScope from "../ThemeScope";
import { createProjectCConfig } from "./config";
import "./tokens-c.css";

export default function ProjectCLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const config = useMemo(() => createProjectCConfig((path) => router.push(path)), [router]);

  return (
    <ThemeScope theme="c">
      <VerificationProvider config={config}>{children}</VerificationProvider>
    </ThemeScope>
  );
}
