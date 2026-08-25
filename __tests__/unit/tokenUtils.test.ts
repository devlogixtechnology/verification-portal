import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractTokenFromInput,
  validateTokenFormat,
} from "../../features/verification/config/verification.config";

describe("Token Extraction & Format Validation Utilities", () => {
  describe("extractTokenFromInput", () => {
    it("extracts plain tokens correctly", () => {
      assert.equal(extractTokenFromInput("CERT-2026-001"), "CERT-2026-001");
      assert.equal(extractTokenFromInput("  VALID-001  "), "VALID-001");
    });

    it("extracts token from full URL format", () => {
      const url = "https://verify.devlogix.online/verify/CERT-2026-001";
      assert.equal(extractTokenFromInput(url), "CERT-2026-001");
    });

    it("extracts token from URL with trailing slash", () => {
      const url = "https://verify.devlogix.online/verify/CERT-EXPIRED-002/";
      assert.equal(extractTokenFromInput(url), "CERT-EXPIRED-002");
    });

    it("returns null for empty input", () => {
      assert.equal(extractTokenFromInput(""), null);
    });
  });

  describe("validateTokenFormat", () => {
    it("accepts valid alphanumeric tokens with hyphens and underscores", () => {
      assert.equal(validateTokenFormat("CERT-2026-001"), true);
      assert.equal(validateTokenFormat("VALID_TOKEN_123"), true);
      assert.equal(validateTokenFormat("DL99"), true);
    });

    it("rejects tokens that are too short", () => {
      assert.equal(validateTokenFormat("AB"), false);
      assert.equal(validateTokenFormat(""), false);
    });

    it("rejects tokens containing invalid special characters", () => {
      assert.equal(validateTokenFormat("CERT@2026#001"), false);
      assert.equal(validateTokenFormat("TOKEN WITH SPACES"), false);
      assert.equal(validateTokenFormat("<script>alert()</script>"), false);
    });
  });
});

