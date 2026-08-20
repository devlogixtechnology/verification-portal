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

function defaultBuildVerificationRequest(token: string): RequestOptions {
  return { path: `/verify/${encodeURIComponent(token)}`, method: "GET" };
}

function defaultIsHealthyResponse(response: Response): boolean {
  return response.ok;
}

/**
 * Single entry point for verifying a token. Every backend-specific decision —
 * the URL shape, what counts as healthy, how a body maps to verified/rejected —
 * is supplied by the consuming project through `config`.
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
