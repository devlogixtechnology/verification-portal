import type {
  ParsedVerificationResult,
  VerificationConfig,
  VerificationErrorDetail,
  VerifiedDocument,
} from "../types/verification.types";

/**
 * Rich mock verification fixtures for testing all states and conditions.
 */
export const MOCK_VERIFIED_DOCUMENTS: Record<string, VerifiedDocument> = {
  // 1. Active / Valid Professional Certificate (Ca Pass)
  "CERT-2026-001": {
    id: "doc-001",
    documentType: "Professional Certification",
    title: "Client Portal Redesign",
    referenceNumber: "CERT-2026-001",
    issuanceDate: "2026-01-15T09:00:00.000Z",
    expirationDate: "2029-01-15T09:00:00.000Z",
    status: "active",
    issuer: {
      name: "Squad Nova",
      designation: "Accredited Verification Authority",
      verifiedBadge: true,
      website: "https://devlogix.online",
    },
    recipient: {
      name: "Client Ops Team",
      email: "ops@clientportal.com",
      identifier: "USR-99420-DL",
    },
    additionalData: {
      "Source Code": "Present",
      IntegrityCheck: "SHA-256 Validated",
      VerificationTier: "Level 3 Sealed",
    },
    verifiedAt: new Date().toISOString(),
    blockchainTxHash: "0x3f9a78b4c2d1e567890abcdef1234567890abcdef1234567890abcdef1234567",
  },

  // 2. Secondary Active Demo Asset (Ca Pass)
  "VALID-001": {
    id: "doc-002",
    documentType: "Engineering Authorization",
    title: "Full-Stack Software Architecture Seal",
    referenceNumber: "VALID-001",
    issuanceDate: "2026-02-01T10:00:00.000Z",
    status: "active",
    issuer: {
      name: "DevLogix Core Authority",
      designation: "Software Engineering Directorate",
      verifiedBadge: true,
      website: "https://devlogix.online",
    },
    recipient: {
      name: "Engineering Team Alpha",
      email: "alpha@devlogix.online",
    },
    additionalData: {
      "Source Code": "Present",
      Status: "Valid",
    },
    verifiedAt: new Date().toISOString(),
  },

  // 3. Expired Certificate (Ca Fail - Expired)
  "CERT-EXPIRED-002": {
    id: "doc-003",
    documentType: "Security Compliance Clearance",
    title: "ISO 27001 Annual Compliance Seal",
    referenceNumber: "CERT-EXPIRED-002",
    issuanceDate: "2023-01-15T00:00:00.000Z",
    expirationDate: "2025-01-15T00:00:00.000Z",
    status: "expired",
    issuer: {
      name: "Global Standards Bureau",
      designation: "Audit Division",
      verifiedBadge: true,
    },
    recipient: {
      name: "Apex Logistics International",
      email: "compliance@apexlogistics.com",
    },
    verifiedAt: new Date().toISOString(),
  },

  // 4. Revoked Certificate (Ca Fail - Revoked)
  "CERT-REVOKED-003": {
    id: "doc-004",
    documentType: "Commercial Trade License",
    title: "Global Export Authorization",
    referenceNumber: "CERT-REVOKED-003",
    issuanceDate: "2025-05-10T00:00:00.000Z",
    status: "revoked",
    issuer: {
      name: "Department of Foreign Trade",
      designation: "Licensing Unit",
    },
    recipient: {
      name: "Vanguard Export Corp",
      email: "legal@vanguard.io",
    },
    verifiedAt: new Date().toISOString(),
  },
};

/**
 * Extracts a token from a QR code raw string or URL.
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
 * Validates token structure (alphanumeric with hyphens or underscores, 3-128 chars).
 */
export function validateTokenFormat(token: string): boolean {
  if (!token) return false;
  const sanitized = token.trim();
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
