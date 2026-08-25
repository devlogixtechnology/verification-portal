"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { VerificationProvider } from "@/features/verification";
import ThemeScope from "../ThemeScope";
import { createProjectAConfig } from "./config";
import "./tokens-a.css";

export default function ProjectALayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const config = useMemo(() => createProjectAConfig((path) => router.push(path)), [router]);

  return (
    <ThemeScope theme="a">
      <VerificationProvider config={config}>{children}</VerificationProvider>
    </ThemeScope>
  );
}
