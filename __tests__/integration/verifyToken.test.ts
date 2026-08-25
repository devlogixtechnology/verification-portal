import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { verifyToken } from "../../features/verification/api/verification";
import {
  createEnvelopeParser,
  type RejectionDetail,
} from "../../lib/api/verificationEnvelope";
import type { VerificationConfig } from "../../features/verification/types/verification.types";

/** Stands in for any consuming project's asset shape. */
type DemoAsset = Record<string, unknown>;

const realFetch = globalThis.fetch;

function stubFetch(handler: () => Response | Promise<Response>) {
  globalThis.fetch = (async () => handler()) as typeof fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const config: VerificationConfig<DemoAsset, RejectionDetail> = {
  apiBaseUrl: "http://localhost:4003",
  parseVerificationResponse: createEnvelopeParser<DemoAsset>(),
  onNavigate: () => {},
  renderVerified: () => null,
};

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("verifyToken", () => {
  it("returns verified when the envelope carries a document", async () => {
    stubFetch(() =>
      jsonResponse({
        success: true,
        verificationStatus: "valid",
        message: "ok",
        data: {
          document: {
            assetType: "project handoff",
            projectName: "Client Portal Redesign",
            deliveredBy: "Squad Nova",
            deliveredTo: "Client Ops Team",
            handoffDate: "2026-06-01",
            includesSourceCode: true,
          },
        },
      })
    );

    const outcome = await verifyToken("HANDOFF-3001", config);
    assert.equal(outcome.outcome, "verified");
    if (outcome.outcome === "verified") {
      assert.equal((outcome.result as { projectName: string }).projectName, "Client Portal Redesign");
    }
  });

  it("returns rejected, with the reason, for an expired asset answered 200", async () => {
    stubFetch(() =>
      jsonResponse({
        success: false,
        verificationStatus: "expired",
        message: "This project handoff link has expired.",
        data: { expiredAt: "2026-03-01T00:00:00Z" },
      })
    );

    const outcome = await verifyToken("HANDOFF-3002", config);
    assert.equal(outcome.outcome, "rejected");
    if (outcome.outcome === "rejected") {
      assert.equal(outcome.detail?.reason, "expired");
      assert.equal(outcome.detail?.expiredAt, "2026-03-01T00:00:00Z");
    }
  });

  it("hands a 4xx body to the parser rather than calling it an error", async () => {
    stubFetch(() =>
      jsonResponse(
        { verificationStatus: "invalid", message: "Unknown code" },
        404
      )
    );

    const outcome = await verifyToken("NOPE-0000", config);
    assert.equal(outcome.outcome, "rejected");
  });

  it("classifies a 500 as a failure without consulting the parser", async () => {
    stubFetch(() => new Response("", { status: 500 }));

    const outcome = await verifyToken("SERVER-ERROR-TEST", config);
    assert.equal(outcome.outcome, "failed");
  });

  it("classifies an unparseable body as a failure", async () => {
    stubFetch(() => new Response("<<<not valid json>>>", { status: 200 }));

    const outcome = await verifyToken("MALFORMED-TEST", config);
    assert.equal(outcome.outcome, "failed");
  });

  it("classifies a lost connection as a failure", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;

    const outcome = await verifyToken("HANDOFF-3001", config);
    assert.equal(outcome.outcome, "failed");
  });

  it("uses the project's message overrides", async () => {
    stubFetch(() => new Response("", { status: 500 }));

    const outcome = await verifyToken("SERVER-ERROR-TEST", {
      ...config,
      messages: { serverError: "Custom server copy." },
    });
    assert.equal(outcome.outcome, "failed");
    if (outcome.outcome === "failed") {
      assert.equal(outcome.message, "Custom server copy.");
    }
  });
});
