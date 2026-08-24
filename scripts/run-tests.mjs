import { describe, it } from "node:test";
import assert from "node:assert/strict";

// --------------------------------------------------------------------------
// 1. Inlined Reducer for Direct Deterministic Testing
// --------------------------------------------------------------------------
function createInitialState() {
  return {
    status: "idle",
    token: null,
    result: null,
    errorMessage: null,
    errorDetail: null,
  };
}

function verificationReducer(state, action) {
  switch (action.type) {
    case "tokenReceived":
      return {
        status: "verifying",
        token: action.token,
        result: null,
        errorMessage: null,
        errorDetail: null,
      };
    case "verificationSucceeded":
      return {
        ...state,
        status: "verified",
        result: action.result,
        errorMessage: null,
        errorDetail: null,
      };
    case "verificationRejected":
      return {
        ...state,
        status: "invalid",
        errorMessage: action.message,
        errorDetail: action.detail ?? null,
      };
    case "verificationFailed":
      return {
        ...state,
        status: "error",
        errorMessage: action.message,
        errorDetail: null,
      };
    case "retry":
      if (state.status === "error" && state.token) {
        return {
          ...state,
          status: "verifying",
          errorMessage: null,
          errorDetail: null,
        };
      }
      return state;
    case "reset":
      return createInitialState();
    default:
      return state;
  }
}

// --------------------------------------------------------------------------
// 2. Token Utilities
// --------------------------------------------------------------------------
function extractTokenFromInput(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
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

function validateTokenFormat(token) {
  if (!token) return false;
  const sanitized = token.trim();
  return /^[a-zA-Z0-9_-]{3,128}$/.test(sanitized);
}

// --------------------------------------------------------------------------
// 3. Mock Fixtures
// --------------------------------------------------------------------------
const MOCK_FIXTURES = {
  "CERT-2026-001": {
    id: "doc-001",
    status: "active",
    title: "Client Portal Redesign",
    issuer: { name: "Squad Nova" },
    recipient: { name: "Client Ops Team" },
    additionalData: { "Source Code": "Present" },
  },
  "CERT-EXPIRED-002": {
    id: "doc-002",
    status: "expired",
    expirationDate: "2025-01-15T00:00:00.000Z",
  },
  "CERT-REVOKED-003": {
    id: "doc-003",
    status: "revoked",
  },
};

// --------------------------------------------------------------------------
// Test Suites
// --------------------------------------------------------------------------
describe("DevLogix Verification Portal — Comprehensive Test Suite", () => {
  describe("State Machine Lifecycle & Transitions", () => {
    it("initializes in clean idle state", () => {
      const state = createInitialState();
      assert.equal(state.status, "idle");
      assert.equal(state.token, null);
      assert.equal(state.result, null);
      assert.equal(state.errorMessage, null);
    });

    it("transitions idle -> verifying on tokenReceived", () => {
      const state = createInitialState();
      const next = verificationReducer(state, {
        type: "tokenReceived",
        token: "CERT-2026-001",
      });
      assert.equal(next.status, "verifying");
      assert.equal(next.token, "CERT-2026-001");
    });

    it("transitions verifying -> verified on verificationSucceeded", () => {
      const state = {
        status: "verifying",
        token: "CERT-2026-001",
        result: null,
        errorMessage: null,
        errorDetail: null,
      };
      const next = verificationReducer(state, {
        type: "verificationSucceeded",
        result: MOCK_FIXTURES["CERT-2026-001"],
      });
      assert.equal(next.status, "verified");
      assert.equal(next.result.issuer.name, "Squad Nova");
      assert.equal(next.result.recipient.name, "Client Ops Team");
    });

    it("transitions verifying -> invalid on verificationRejected (Expired)", () => {
      const state = {
        status: "verifying",
        token: "CERT-EXPIRED-002",
        result: null,
        errorMessage: null,
        errorDetail: null,
      };
      const next = verificationReducer(state, {
        type: "verificationRejected",
        message: "This asset expired at 15/01/2025.",
        detail: { reason: "expired" },
      });
      assert.equal(next.status, "invalid");
      assert.equal(next.errorMessage, "This asset expired at 15/01/2025.");
      assert.equal(next.errorDetail.reason, "expired");
    });

    it("transitions verifying -> error on verificationFailed (Network/500)", () => {
      const state = {
        status: "verifying",
        token: "ERROR-500",
        result: null,
        errorMessage: null,
        errorDetail: null,
      };
      const next = verificationReducer(state, {
        type: "verificationFailed",
        message: "There was a problem in verifying your asset. Please check your network and try again.",
      });
      assert.equal(next.status, "error");
      assert.equal(next.token, "ERROR-500");
    });

    it("transitions error -> verifying on retry", () => {
      const errorState = {
        status: "error",
        token: "ERROR-500",
        result: null,
        errorMessage: "Failed network request",
        errorDetail: null,
      };
      const retried = verificationReducer(errorState, { type: "retry" });
      assert.equal(retried.status, "verifying");
      assert.equal(retried.token, "ERROR-500");
      assert.equal(retried.errorMessage, null);
    });

    it("resets back to initial state on reset", () => {
      const verifiedState = {
        status: "verified",
        token: "CERT-2026-001",
        result: MOCK_FIXTURES["CERT-2026-001"],
        errorMessage: null,
        errorDetail: null,
      };
      const resetState = verificationReducer(verifiedState, { type: "reset" });
      assert.equal(resetState.status, "idle");
      assert.equal(resetState.token, null);
      assert.equal(resetState.result, null);
    });
  });

  describe("Token Format & URL Extraction", () => {
    it("extracts token from plain code input", () => {
      assert.equal(extractTokenFromInput("CERT-2026-001"), "CERT-2026-001");
      assert.equal(extractTokenFromInput("  VALID-001 "), "VALID-001");
    });

    it("extracts token from standard URL", () => {
      const url = "https://verify.devlogix.online/verify/CERT-2026-001";
      assert.equal(extractTokenFromInput(url), "CERT-2026-001");
    });

    it("extracts token from URL with trailing slash", () => {
      const url = "https://verify.devlogix.online/verify/CERT-EXPIRED-002/";
      assert.equal(extractTokenFromInput(url), "CERT-EXPIRED-002");
    });

    it("validates token format constraints", () => {
      assert.equal(validateTokenFormat("CERT-2026-001"), true);
      assert.equal(validateTokenFormat("VALID-001"), true);
      assert.equal(validateTokenFormat("DL_99"), true);
      assert.equal(validateTokenFormat(""), false);
      assert.equal(validateTokenFormat("A"), false);
      assert.equal(validateTokenFormat("INVALID CODE WITH SPACES"), false);
    });
  });

  describe("Dummy Test Fixtures Coverage", () => {
    it("contains valid active certificate fixture", () => {
      const cert = MOCK_FIXTURES["CERT-2026-001"];
      assert.ok(cert);
      assert.equal(cert.status, "active");
      assert.equal(cert.issuer.name, "Squad Nova");
      assert.equal(cert.recipient.name, "Client Ops Team");
      assert.equal(cert.additionalData["Source Code"], "Present");
    });

    it("contains expired certificate fixture", () => {
      const cert = MOCK_FIXTURES["CERT-EXPIRED-002"];
      assert.ok(cert);
      assert.equal(cert.status, "expired");
      assert.equal(cert.expirationDate, "2025-01-15T00:00:00.000Z");
    });

    it("contains revoked certificate fixture", () => {
      const cert = MOCK_FIXTURES["CERT-REVOKED-003"];
      assert.ok(cert);
      assert.equal(cert.status, "revoked");
    });
  });
});

