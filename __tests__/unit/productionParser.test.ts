import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseVerificationResponse } from "../../lib/config/verification.contract";

const DOCUMENT = {
  documentType: "Experience Letter",
  title: "Senior Engineer — Experience Letter",
  referenceNumber: "DL-2026-0042",
  issuanceDate: "2026-04-01T00:00:00.000Z",
  status: "active",
  issuer: {
    name: "DevLogix",
    designation: "Head of Engineering",
    logoUrl: "https://cdn.example.com/logo.svg",
  },
  recipient: { name: "Ayesha Raza", email: "ayesha@example.com" },
};

describe("production parseVerificationResponse", () => {
  it("maps a valid document, keeping verifiedAt", () => {
    const outcome = parseVerificationResponse({
      success: true,
      verificationStatus: "valid",
      message: "Document verified.",
      data: { document: DOCUMENT, verifiedAt: "2026-08-25T10:00:00.000Z" },
    });

    assert.equal(outcome.outcome, "verified");
    if (outcome.outcome !== "verified") return;
    assert.equal(outcome.result.title, DOCUMENT.title);
    assert.equal(outcome.result.issuer?.designation, "Head of Engineering");
    assert.equal(outcome.result.recipient?.email, "ayesha@example.com");
    assert.equal(outcome.result.verifiedAt, "2026-08-25T10:00:00.000Z");
  });

  it("drops fields the app does not render", () => {
    const outcome = parseVerificationResponse({
      verificationStatus: "valid",
      data: { document: { ...DOCUMENT, internalOwnerId: "secret-123" } },
    });

    assert.equal(outcome.outcome, "verified");
    if (outcome.outcome !== "verified") return;
    assert.equal("internalOwnerId" in outcome.result, false);
  });

  it("rejects an expired document and keeps its context", () => {
    const outcome = parseVerificationResponse({
      success: false,
      verificationStatus: "expired",
      message: "This document expired on 01/01/2026.",
      data: { document: DOCUMENT, expiredAt: "2026-01-01T00:00:00.000Z" },
    });

    assert.equal(outcome.outcome, "rejected");
    if (outcome.outcome !== "rejected") return;
    assert.equal(outcome.message, "This document expired on 01/01/2026.");
    assert.equal(outcome.detail?.reason, "expired");
    assert.equal(outcome.detail?.expiredAt, "2026-01-01T00:00:00.000Z");
    assert.equal(outcome.detail?.document?.referenceNumber, "DL-2026-0042");
  });

  it("rejects a revoked document and keeps revokedAt", () => {
    const outcome = parseVerificationResponse({
      verificationStatus: "revoked",
      message: "Revoked by the issuing authority.",
      data: { document: DOCUMENT, revokedAt: "2026-06-01T00:00:00.000Z" },
    });

    assert.equal(outcome.outcome, "rejected");
    if (outcome.outcome !== "rejected") return;
    assert.equal(outcome.detail?.reason, "revoked");
    assert.equal(outcome.detail?.revokedAt, "2026-06-01T00:00:00.000Z");
  });

  it("rejects an unknown code, carrying errorCode with no document", () => {
    const outcome = parseVerificationResponse({
      success: false,
      verificationStatus: "invalid",
      message: "This code does not correspond to a known document.",
      errorCode: "QR_NOT_FOUND",
    });

    assert.equal(outcome.outcome, "rejected");
    if (outcome.outcome !== "rejected") return;
    assert.equal(outcome.detail?.reason, "invalid");
    assert.equal(outcome.detail?.errorCode, "QR_NOT_FOUND");
    assert.equal(outcome.detail?.document, undefined);
  });

  it("fails when a valid verdict arrives without a usable document", () => {
    const outcome = parseVerificationResponse({
      verificationStatus: "valid",
      data: { document: { title: "Half a document" } },
    });

    assert.equal(outcome.outcome, "failed");
  });

  it("fails on a body that is not the envelope", () => {
    for (const body of [null, "nope", 42, {}, { message: "hi" }]) {
      assert.equal(parseVerificationResponse(body).outcome, "failed");
    }
  });
});
