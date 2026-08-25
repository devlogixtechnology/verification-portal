import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  verificationReducer,
} from "../../features/verification/state/verificationMachine";

type Asset = { id: string };
type Detail = { reason: string };

const start = () => createInitialState<Asset, Detail>();

describe("verificationMachine", () => {
  it("starts idle with nothing to show", () => {
    assert.deepEqual(start(), {
      status: "idle",
      token: null,
      result: null,
      errorMessage: null,
      errorDetail: null,
    });
  });

  it("moves to verifying and keeps the token", () => {
    const state = verificationReducer(start(), {
      type: "tokenReceived",
      token: "TOK-1",
    });
    assert.equal(state.status, "verifying");
    assert.equal(state.token, "TOK-1");
  });

  it("clears a previous error when a new token arrives", () => {
    let state = verificationReducer(start(), { type: "tokenReceived", token: "TOK-1" });
    state = verificationReducer(state, {
      type: "verificationRejected",
      message: "Expired",
      detail: { reason: "expired" },
    });
    state = verificationReducer(state, { type: "tokenReceived", token: "TOK-2" });

    assert.equal(state.status, "verifying");
    assert.equal(state.token, "TOK-2");
    assert.equal(state.errorMessage, null);
    assert.equal(state.errorDetail, null);
    assert.equal(state.result, null);
  });

  it("clears a previous result when a later attempt is rejected", () => {
    let state = verificationReducer(start(), { type: "tokenReceived", token: "TOK-1" });
    state = verificationReducer(state, {
      type: "verificationSucceeded",
      result: { id: "a" },
    });
    state = verificationReducer(state, { type: "retry" });
    state = verificationReducer(state, {
      type: "verificationRejected",
      message: "Revoked",
      detail: { reason: "revoked" },
    });

    assert.equal(state.status, "invalid");
    assert.equal(state.result, null);
    assert.equal(state.token, "TOK-1");
    assert.deepEqual(state.errorDetail, { reason: "revoked" });
  });

  it("clears error fields on retry so no stale message shows under the spinner", () => {
    let state = verificationReducer(start(), { type: "tokenReceived", token: "TOK-1" });
    state = verificationReducer(state, { type: "verificationFailed", message: "Network" });
    state = verificationReducer(state, { type: "retry" });

    assert.equal(state.status, "verifying");
    assert.equal(state.errorMessage, null);
    assert.equal(state.token, "TOK-1");
  });

  it("drops the token when the input never became one", () => {
    let state = verificationReducer(start(), { type: "tokenReceived", token: "TOK-1" });
    state = verificationReducer(state, {
      type: "verificationSucceeded",
      result: { id: "a" },
    });
    state = verificationReducer(state, { type: "tokenRejected", message: "Bad format" });

    assert.equal(state.status, "invalid");
    assert.equal(state.token, null);
    assert.equal(state.result, null);
  });

  it("treats retry without a token as a no-op", () => {
    const idle = start();
    assert.equal(verificationReducer(idle, { type: "retry" }), idle);
  });

  it("resets to a pristine state", () => {
    let state = verificationReducer(start(), { type: "tokenReceived", token: "TOK-1" });
    state = verificationReducer(state, {
      type: "verificationSucceeded",
      result: { id: "a" },
    });
    assert.deepEqual(verificationReducer(state, { type: "reset" }), start());
  });

  it("never mutates the state it is given", () => {
    const before = start();
    const snapshot = JSON.stringify(before);
    verificationReducer(before, { type: "tokenReceived", token: "TOK-1" });
    assert.equal(JSON.stringify(before), snapshot);
  });
});
