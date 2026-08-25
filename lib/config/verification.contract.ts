/**
 * The real backend's contract: request shape, response shape, and the mapping
 * from one to an outcome the verification module understands.
 *
 * Kept free of React and of path aliases so it can be unit-tested on its own.
 */
import type {
  ParsedVerificationResult,
  RequestOptions,
} from "../../features/verification/types/verification.types";

/* -------------------------------------------------------------------------
   The real backend's shapes (api_contract.md §4.5.1)
   ------------------------------------------------------------------------- */

export interface DocumentIssuer {
  name: string;
  designation?: string;
  logoUrl?: string;
}

export interface DocumentRecipient {
  name: string;
  email?: string;
}

/** A document as returned by the verification service. */
export interface VerifiedDocument {
  documentType: string;
  title: string;
  referenceNumber: string;
  issuanceDate: string;
  status: string;
  issuer?: DocumentIssuer;
  recipient?: DocumentRecipient;
  /** Stamped by the service on a successful verification. */
  verifiedAt?: string;
}

/** Why a document was not verified, with whatever context the service gave. */
export interface DocumentRejection {
  reason: "expired" | "revoked" | "invalid";
  /** e.g. "QR_NOT_FOUND". Carried for logging; nothing renders it. */
  errorCode?: string;
  expiredAt?: string;
  revokedAt?: string;
  /** Present for expired and revoked documents, absent for unknown codes. */
  document?: Partial<VerifiedDocument>;
}

/** The response envelope, identical in shape across every verdict. */
interface VerificationEnvelope {
  success?: boolean;
  verificationStatus?: "valid" | "expired" | "revoked" | "invalid";
  message?: string;
  errorCode?: string;
  data?: {
    document?: Partial<VerifiedDocument>;
    verifiedAt?: string;
    expiredAt?: string;
    revokedAt?: string;
  };
}

/* -------------------------------------------------------------------------
   Where the backend lives
   ------------------------------------------------------------------------- */

/**
 * Set `NEXT_PUBLIC_VERIFICATION_API_URL` to Backend Squad A's origin.
 *
 * The fallback is a placeholder, not a working service: nothing answers
 * `POST /verify/qr-code` on the dev server itself, so every verification will
 * report a failure until the real origin is configured.
 */
export const VERIFICATION_API_BASE_URL =
  process.env.NEXT_PUBLIC_VERIFICATION_API_URL ?? "http://localhost:3000";

/* -------------------------------------------------------------------------
   Request and response
   ------------------------------------------------------------------------- */

export function buildVerificationRequest(token: string): RequestOptions {
  return {
    path: "/verify/qr-code",
    method: "POST",
    body: { qrCodeId: token },
    // A verification is a read. Marking it replayable restores the single
    // automatic retry that a POST would otherwise forfeit.
    idempotent: true,
  };
}

/** Narrows an unknown body to the envelope. */
function isEnvelope(body: unknown): body is VerificationEnvelope {
  return typeof body === "object" && body !== null;
}

/** Keeps only the fields this app renders, so an unexpected extra never leaks through. */
function toDocument(raw: Partial<VerifiedDocument> | undefined): Partial<VerifiedDocument> {
  if (!raw) return {};
  return {
    documentType: raw.documentType,
    title: raw.title,
    referenceNumber: raw.referenceNumber,
    issuanceDate: raw.issuanceDate,
    status: raw.status,
    issuer: raw.issuer && {
      name: raw.issuer.name,
      designation: raw.issuer.designation,
      logoUrl: raw.issuer.logoUrl,
    },
    recipient: raw.recipient && {
      name: raw.recipient.name,
      email: raw.recipient.email,
    },
  };
}

/** True when the mapped document carries enough to render a result screen. */
function isCompleteDocument(
  document: Partial<VerifiedDocument>
): document is VerifiedDocument {
  return Boolean(document.title && document.documentType && document.referenceNumber);
}

export function parseVerificationResponse(
  rawBody: unknown
): ParsedVerificationResult<VerifiedDocument, DocumentRejection> {
  if (!isEnvelope(rawBody) || !rawBody.verificationStatus) {
    return {
      outcome: "failed",
      message: "The verification service returned an unexpected response.",
    };
  }

  const { verificationStatus, message, errorCode, data } = rawBody;
  const document = toDocument(data?.document);

  if (verificationStatus === "valid") {
    if (!isCompleteDocument(document)) {
      return {
        outcome: "failed",
        message: "The verification service returned an incomplete document.",
      };
    }
    return {
      outcome: "verified",
      result: { ...document, verifiedAt: data?.verifiedAt },
    };
  }

  if (verificationStatus === "expired" || verificationStatus === "revoked") {
    return {
      outcome: "rejected",
      message: message ?? "This document is no longer valid.",
      detail: {
        reason: verificationStatus,
        errorCode,
        expiredAt: data?.expiredAt,
        revokedAt: data?.revokedAt,
        document,
      },
    };
  }

  // "invalid" — an unrecognised code. The contract omits data.document here.
  return {
    outcome: "rejected",
    message: message ?? "This code does not match any issued document.",
    detail: { reason: "invalid", errorCode },
  };
}
