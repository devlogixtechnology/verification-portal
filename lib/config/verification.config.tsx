"use client";

import type { VerificationConfig } from "@/features/verification";
import { extractTokenFromInput, validateTokenFormat } from "@/lib/config/tokenUtils";
import {
  VERIFICATION_API_BASE_URL,
  buildVerificationRequest,
  parseVerificationResponse,
  type DocumentRejection,
  type VerifiedDocument,
} from "./verification.contract";
import VerifiedDocumentCard from "@/components/verification/VerifiedDocumentCard";
import RejectedDocumentCard from "@/components/verification/RejectedDocumentCard";

export type {
  VerifiedDocument,
  DocumentRejection,
  DocumentIssuer,
  DocumentRecipient,
} from "./verification.contract";

/** Maps the module's navigation intents onto this app's routes. */
function routeToPath(name: "start" | "scanner" | "verify", token?: string): string {
  if (name === "start") return "/verify";
  if (name === "scanner") return "/verify/scan";
  return `/verify/${encodeURIComponent(token ?? "")}`;
}

export function createProductionConfig(
  navigate: (path: string) => void
): VerificationConfig<VerifiedDocument, DocumentRejection> {
  return {
    apiBaseUrl: VERIFICATION_API_BASE_URL,

    parseToken: extractTokenFromInput,
    isValidTokenFormat: validateTokenFormat,

    buildVerificationRequest,
    parseVerificationResponse,

    onNavigate: (route) =>
      navigate(
        routeToPath(route.name, route.name === "verify" ? route.token : undefined)
      ),

    renderVerified: (document, actions) => (
      <VerifiedDocumentCard document={document} actions={actions} />
    ),

    renderInvalid: (message, detail, actions) => (
      <RejectedDocumentCard message={message} detail={detail} actions={actions} />
    ),
  };
}
