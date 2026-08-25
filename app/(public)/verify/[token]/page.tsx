"use client";

import { use } from "react";
import { VerificationView } from "@/features/verification";

/**
 * The deep link a generated QR code points at:
 * `{VERIFICATION_BASE_URL}/verify/{qrCodeId}`.
 */
export default function VerifyTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  return <VerificationView token={decodeURIComponent(token)} />;
}
