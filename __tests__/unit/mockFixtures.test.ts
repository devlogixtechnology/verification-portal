import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultVerificationConfig,
  MOCK_VERIFIED_DOCUMENTS,
} from "../../features/verification/config/verification.config";

describe("Verification Response Parser & Mock Fixtures", () => {
  it("includes valid mock fixture CERT-2026-001 with Squad Nova", () => {
    const cert = MOCK_VERIFIED_DOCUMENTS["CERT-2026-001"];
    assert.ok(cert);
    assert.equal(cert.status, "active");
    assert.equal(cert.issuer?.name, "Squad Nova");
    assert.equal(cert.recipient?.name, "Client Ops Team");
  });

  it("includes expired mock fixture CERT-EXPIRED-002", () => {
    const cert = MOCK_VERIFIED_DOCUMENTS["CERT-EXPIRED-002"];
    assert.ok(cert);
    assert.equal(cert.status, "expired");
  });

  it("includes revoked mock fixture CERT-REVOKED-003", () => {
    const cert = MOCK_VERIFIED_DOCUMENTS["CERT-REVOKED-003"];
    assert.ok(cert);
    assert.equal(cert.status, "revoked");
  });

  it("parses successful backend verification response", () => {
    const rawBackendPayload = {
      valid: true,
      data: MOCK_VERIFIED_DOCUMENTS["CERT-2026-001"],
    };

    const parsed = defaultVerificationConfig.parseVerificationResponse(rawBackendPayload);
    assert.equal(parsed.outcome, "verified");
    if (parsed.outcome === "verified") {
      assert.equal(parsed.result.referenceNumber, "CERT-2026-001");
      assert.equal(parsed.result.issuer?.name, "Squad Nova");
    }
  });

  it("parses rejected backend verification response", () => {
    const rawBackendPayload = {
      valid: false,
      reason: "expired",
      message: "This asset expired at 15/01/2025.",
    };

    const parsed = defaultVerificationConfig.parseVerificationResponse(rawBackendPayload);
    assert.equal(parsed.outcome, "rejected");
    if (parsed.outcome === "rejected" && parsed.detail) {
      assert.equal(parsed.detail.reason, "expired");
      assert.equal(parsed.message, "This asset expired at 15/01/2025.");
    }
  });

  it("parses unexpected or malformed payload as failed", () => {
    const parsed = defaultVerificationConfig.parseVerificationResponse(null);
    assert.equal(parsed.outcome, "failed");
  });
});

