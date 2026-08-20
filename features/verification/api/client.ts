import type { RequestOptions, VerificationConfig } from "../types/verification.types";

const DEFAULT_TIMEOUT_MS = 10000;

/**
 * The transport only ever needs the base URL — it stays independent of the
 * rendering/parsing halves of VerificationConfig.
 */
type TransportConfig = Pick<VerificationConfig, "apiBaseUrl">;

async function performRequest(
  options: RequestOptions,
  config: TransportConfig
): Promise<Response> {
  const { path, method = "GET", headers, body } = options;
  const url = `${config.apiBaseUrl}${path}`;
  const hasBody = body !== undefined;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retries once, but only for idempotent requests — replaying a POST after an
 * ambiguous failure risks a duplicate write on the backend.
 */
async function requestWithRetry(
  options: RequestOptions,
  config: TransportConfig
): Promise<Response> {
  try {
    return await performRequest(options, config);
  } catch (firstAttemptError) {
    if ((options.method ?? "GET") !== "GET") throw firstAttemptError;
    return await performRequest(options, config);
  }
}

export { requestWithRetry, DEFAULT_TIMEOUT_MS };
export type { TransportConfig };
