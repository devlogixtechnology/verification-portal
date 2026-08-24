import type {
  ParsedVerificationResult,
  VerificationConfig,
  VerificationErrorDetail,
  VerifiedDocument,
} from "../types/verification.types";

/** Mock verified documents for demo, tests, and offline development */
export const MOCK_VERIFIED_DOCUMENTS: Record<string, VerifiedDocument> = {
  "CERT-2026-001": {
    id: "doc-001",
    documentType: "Professional Certificate",
    title: "Full-Stack Software Engineering Certification",
    referenceNumber: "CERT-2026-001",
    issuanceDate: "2026-01-15T09:00:00.000Z",
    expirationDate: "2029-01-15T09:00:00.000Z",
    status: "active",
    issuer: {
      name: "DevLogix Technology Institute",
      designation: "Accredited Certification Authority",
      logoUrl: "",
      verifiedBadge: true,
      website: "https://devlogix.online",
    },
    recipient: {
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      identifier: "USR-99420-DL",
    },
    additionalData: {
      Grade: "Distinction (96%)",
      CredentialID: "CRD-88219-AM",
      VerificationLevel: "Tier 3 Cryptographic",
    },
    verifiedAt: new Date().toISOString(),
    blockchainTxHash: "0x3f9a78b4c2d1e567890abcdef1234567890abcdef1234567890abcdef1234567",
  },
  "CERT-EXPIRED-002": {
    id: "doc-002",
    documentType: "Compliance Audit Clearance",
    title: "ISO 27001 Security Compliance Seal",
    referenceNumber: "CERT-EXPIRED-002",
    issuanceDate: "2023-01-01T00:00:00.000Z",
    expirationDate: "2024-01-01T00:00:00.000Z",
    status: "expired",
    issuer: {
      name: "Global Standards Bureau",
      designation: "Information Security Directorate",
      verifiedBadge: true,
    },
    recipient: {
      name: "Apex Logistics Ltd",
      email: "compliance@apexlogistics.com",
      identifier: "ORG-8831",
    },
    verifiedAt: new Date().toISOString(),
  },
  "CERT-REVOKED-003": {
    id: "doc-003",
    documentType: "Trade License",
    title: "International Export Authorization",
    referenceNumber: "CERT-REVOKED-003",
    issuanceDate: "2025-05-10T00:00:00.000Z",
    status: "revoked",
    issuer: {
      name: "Department of Foreign Commerce",
      designation: "Licensing Unit",
    },
    recipient: {
      name: "Vanguard Export Corp",
      email: "contact@vanguard.io",
    },
    verifiedAt: new Date().toISOString(),
  },
};

/**
 * Extracts a token from a QR code raw string or URL.
 * Handles both plain strings (`CERT-123`) and full URLs (`https://domain.com/verify/CERT-123`).
 */
export function extractTokenFromInput(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  // If it's a URL, extract the last path segment
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const segments = url.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    } catch {
      return null;
    }
  }

  return trimmed;
}

/**
 * Validates token structure (must be non-empty alphanumeric with hyphens or underscores).
 */
export function validateTokenFormat(token: string): boolean {
  if (!token) return false;
  const sanitized = token.trim();
  // Accepts token format between 3 and 128 characters
  return /^[a-zA-Z0-9_-]{3,128}$/.test(sanitized);
}

/**
 * Default production/development verification config.
 */
export const defaultVerificationConfig: VerificationConfig<
  VerifiedDocument,
  VerificationErrorDetail
> = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",

  parseToken: extractTokenFromInput,

  isValidTokenFormat: validateTokenFormat,

  buildVerificationRequest: (token: string) => ({
    path: `/api/verify/${encodeURIComponent(token)}`,
    method: "GET",
  }),

  parseVerificationResponse: (
    rawBody: unknown
  ): ParsedVerificationResult<VerifiedDocument, VerificationErrorDetail> => {
    // If backend returns data in standard format
    if (rawBody && typeof rawBody === "object") {
      const body = rawBody as {
        valid?: boolean;
        success?: boolean;
        data?: VerifiedDocument;
        document?: VerifiedDocument;
        message?: string;
        reason?: VerificationErrorDetail["reason"];
        code?: string;
      };

      const doc = body.data || body.document;

      if ((body.valid === true || body.success === true) && doc) {
        return {
          outcome: "verified",
          result: {
            ...doc,
            verifiedAt: doc.verifiedAt || new Date().toISOString(),
          },
        };
      }

      if (body.valid === false || body.success === false) {
        return {
          outcome: "rejected",
          message: body.message || "This document could not be verified or is no longer valid.",
          detail: {
            reason: body.reason || "unknown",
            code: body.code,
            details: body.message,
          },
        };
      }
    }

    return {
      outcome: "failed",
      message: "Received an unexpected response from the verification server.",
    };
  },
};

