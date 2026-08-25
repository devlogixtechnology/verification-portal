import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  verificationReducer,
  type VerificationAction,
} from "../../features/verification/state/verificationMachine";
import type {
  VerificationErrorDetail,
  VerifiedDocument,
} from "../../features/verification/types/verification.types";

const mockDocument: VerifiedDocument = {
  id: "doc-001",
  documentType: "Professional Certification",
  title: "Client Portal Redesign",
  referenceNumber: "CERT-2026-001",
  issuanceDate: "2026-01-15T00:00:00.000Z",
  status: "active",
  issuer: { name: "Squad Nova" },
  recipient: { name: "Client Ops Team" },
  verifiedAt: "2026-08-25T00:00:00.000Z",
};

const mockErrorDetail: VerificationErrorDetail = {
  reason: "expired",
  code: "ERR_EXPIRED",
  details: "Certificate expired",
};

describe("verificationReducer (Finite State Machine)", () => {
  it("initializes in clean idle state", () => {
    const state = createInitialState<VerifiedDocument, VerificationErrorDetail>();
    assert.equal(state.status, "idle");
    assert.equal(state.token, null);
    assert.equal(state.result, null);
    assert.equal(state.errorMessage, null);
    assert.equal(state.errorDetail, null);
  });

  it("transitions from idle to verifying on tokenReceived", () => {
    const initialState = createInitialState<VerifiedDocument, VerificationErrorDetail>();
    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "tokenReceived",
      token: "CERT-2026-001",
    };

    const nextState = verificationReducer(initialState, action);
    assert.equal(nextState.status, "verifying");
    assert.equal(nextState.token, "CERT-2026-001");
    assert.equal(nextState.result, null);
    assert.equal(nextState.errorMessage, null);
  });

  it("transitions from verifying to verified on verificationSucceeded", () => {
    const verifyingState = {
      status: "verifying" as const,
      token: "CERT-2026-001",
      result: null,
      errorMessage: null,
      errorDetail: null,
    };

    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "verificationSucceeded",
      result: mockDocument,
    };

    const nextState = verificationReducer(verifyingState, action);
    assert.equal(nextState.status, "verified");
    assert.deepEqual(nextState.result, mockDocument);
    assert.equal(nextState.errorMessage, null);
  });

  it("transitions from verifying to invalid on verificationRejected", () => {
    const verifyingState = {
      status: "verifying" as const,
      token: "CERT-EXPIRED-002",
      result: null,
      errorMessage: null,
      errorDetail: null,
    };

    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "verificationRejected",
      message: "This asset expired at 15/01/2025.",
      detail: mockErrorDetail,
    };

    const nextState = verificationReducer(verifyingState, action);
    assert.equal(nextState.status, "invalid");
    assert.equal(nextState.errorMessage, "This asset expired at 15/01/2025.");
    assert.deepEqual(nextState.errorDetail, mockErrorDetail);
  });

  it("transitions from verifying to error on verificationFailed", () => {
    const verifyingState = {
      status: "verifying" as const,
      token: "ERROR-500",
      result: null,
      errorMessage: null,
      errorDetail: null,
    };

    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "verificationFailed",
      message: "There was a problem in verifying your asset. Please check your network and try again.",
    };

    const nextState = verificationReducer(verifyingState, action);
    assert.equal(nextState.status, "error");
    assert.equal(nextState.token, "ERROR-500");
    assert.equal(nextState.errorMessage, "There was a problem in verifying your asset. Please check your network and try again.");
  });

  it("transitions from error back to verifying on retry", () => {
    const errorState = {
      status: "error" as const,
      token: "ERROR-500",
      result: null,
      errorMessage: "Network error",
      errorDetail: null,
    };

    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "retry",
    };

    const nextState = verificationReducer(errorState, action);
    assert.equal(nextState.status, "verifying");
    assert.equal(nextState.token, "ERROR-500");
    assert.equal(nextState.errorMessage, null);
  });

  it("resets back to idle on reset", () => {
    const verifiedState = {
      status: "verified" as const,
      token: "CERT-2026-001",
      result: mockDocument,
      errorMessage: null,
      errorDetail: null,
    };

    const action: VerificationAction<VerifiedDocument, VerificationErrorDetail> = {
      type: "reset",
    };

    const nextState = verificationReducer(verifiedState, action);
    assert.equal(nextState.status, "idle");
    assert.equal(nextState.token, null);
    assert.equal(nextState.result, null);
  });
});

