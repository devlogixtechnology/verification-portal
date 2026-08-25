"use client";

import { use } from "react";
import { VerificationView } from "@/features/verification";

export default function ProjectATokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  return <VerificationView token={decodeURIComponent(token)} />;
}
