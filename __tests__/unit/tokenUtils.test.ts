import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractTokenFromInput,
  validateTokenFormat,
} from "../../lib/config/tokenUtils";

describe("extractTokenFromInput", () => {
  it("passes a plain code through", () => {
    assert.equal(extractTokenFromInput("HANDOFF-3001"), "HANDOFF-3001");
  });

  it("trims surrounding whitespace", () => {
    assert.equal(extractTokenFromInput("  HANDOFF-3001 \n"), "HANDOFF-3001");
  });

  it("takes the last segment of a URL", () => {
    assert.equal(
      extractTokenFromInput("https://verify.example.com/verify/HANDOFF-3001"),
      "HANDOFF-3001"
    );
  });

  it("ignores a trailing slash on a URL", () => {
    assert.equal(
      extractTokenFromInput("https://verify.example.com/verify/HANDOFF-3001/"),
      "HANDOFF-3001"
    );
  });

  it("returns null for empty input", () => {
    assert.equal(extractTokenFromInput(""), null);
    assert.equal(extractTokenFromInput("   "), null);
  });

  it("returns null for a malformed URL", () => {
    assert.equal(extractTokenFromInput("https://"), null);
  });
});

describe("validateTokenFormat", () => {
  it("accepts alphanumerics, hyphens and underscores", () => {
    assert.equal(validateTokenFormat("HANDOFF-3001"), true);
    assert.equal(validateTokenFormat("cert_2001"), true);
  });

  it("rejects anything shorter than three characters", () => {
    assert.equal(validateTokenFormat("ab"), false);
  });

  it("rejects spaces and punctuation", () => {
    assert.equal(validateTokenFormat("HAND OFF"), false);
    assert.equal(validateTokenFormat("HANDOFF!"), false);
  });

  it("rejects anything longer than 128 characters", () => {
    assert.equal(validateTokenFormat("A".repeat(129)), false);
  });
});
