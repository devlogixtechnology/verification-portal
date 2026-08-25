import type { ParsedVerificationResult } from "../../features/verification/types/verification.types";

/**
 * Why a verification was rejected. Produced by the parser below, so it belongs
 * with the envelope rather than with any one project's asset schema.
 */
export interface RejectionDetail {
  reason: "expired" | "revoked" | "invalid" | "unknown";
  expiredAt?: string;
}

/**
 * The response envelope every mock backend uses.
 *
 * The verdict lives in the body, never in the HTTP status — the backends answer
 * `200 OK` even for an expired or revoked asset.
 */
export interface VerificationEnvelope<TDocument> {
  success?: boolean;
  verificationStatus: "valid" | "expired" | "revoked" | "invalid";
  message: string;
  data?: {
    document?: TDocument;
    expiredAt?: string;
  };
}

/** Narrows an unknown body to the shared envelope. */
export function isVerificationEnvelope(
  body: unknown
): body is VerificationEnvelope<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { verificationStatus?: unknown }).verificationStatus === "string"
  );
}

/**
 * Builds a `parseVerificationResponse` for any project whose backend speaks the
 * envelope above. The only thing that varies between projects is the document
 * type inside `data.document`.
 */
export function createEnvelopeParser<TDocument>(): (
  rawBody: unknown
) => ParsedVerificationResult<TDocument, RejectionDetail> {
  return (rawBody) => {
    if (!isVerificationEnvelope(rawBody)) {
      return {
        outcome: "failed",
        message: "The verification service returned an unexpected response.",
      };
    }

    const envelope = rawBody as VerificationEnvelope<TDocument>;

    if (envelope.verificationStatus === "valid" && envelope.data?.document) {
      return { outcome: "verified", result: envelope.data.document };
    }

    const reason =
      envelope.verificationStatus === "expired" ||
      envelope.verificationStatus === "revoked" ||
      envelope.verificationStatus === "invalid"
        ? envelope.verificationStatus
        : "unknown";

    return {
      outcome: "rejected",
      message: envelope.message,
      detail: { reason, expiredAt: envelope.data?.expiredAt },
    };
  };
}
