import { requestWithRetry } from "./client";
import {
  FAILURE_MESSAGES,
  classifyNetworkError,
  classifyResponse,
  failure,
} from "./errors";
import type {
  ParsedVerificationResult,
  RequestOptions,
  VerificationConfig,
} from "../types/verification.types";

/** Used when `config.buildVerificationRequest` is omitted. */
function defaultBuildVerificationRequest(token: string): RequestOptions {
  return { path: `/verify/${encodeURIComponent(token)}`, method: "GET" };
}

/** Used when `config.isHealthyResponse` is omitted. */
function defaultIsHealthyResponse(response: Response): boolean {
  return response.ok;
}

/**
 * Verifies a token and reports what happened. Never throws.
 *
 * The pipeline is: build the request from the config, send it, classify
 * transport failures, then hand the body to `config.parseVerificationResponse`
 * for the domain decision.
 *
 * Contains no React, so it can also be called from a server component, a route
 * handler, or a test.
 *
 * ```ts
 * const outcome = await verifyToken("a1b2c3", verificationConfig);
 * if (outcome.outcome === "verified") console.log(outcome.result);
 * ```
 */
async function verifyToken<TAsset, TErrorDetail>(
  token: string,
  config: VerificationConfig<TAsset, TErrorDetail>
): Promise<ParsedVerificationResult<TAsset, TErrorDetail>> {
  const buildRequest =
    config.buildVerificationRequest ?? defaultBuildVerificationRequest;
  const isHealthyResponse =
    config.isHealthyResponse ?? defaultIsHealthyResponse;

  let response: Response;
  try {
    response = await requestWithRetry(buildRequest(token), config);
  } catch (error) {
    return classifyNetworkError(error);
  }

  const environmentalFailure = classifyResponse(response, isHealthyResponse);
  if (environmentalFailure) return environmentalFailure;

  let rawBody: unknown;
  try {
    rawBody = await response.json();
  } catch {
    return failure(FAILURE_MESSAGES.unreadable);
  }

  return config.parseVerificationResponse(rawBody);
}

export { verifyToken, defaultBuildVerificationRequest, defaultIsHealthyResponse };
