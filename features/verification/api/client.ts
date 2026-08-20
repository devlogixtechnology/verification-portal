import type { RequestOptions, VerificationConfig } from "../types/verification.types";

/** How long a single attempt may take before it is aborted. */
const DEFAULT_TIMEOUT_MS = 10000;

/** The only part of the config the transport reads. */
type TransportConfig = Pick<VerificationConfig, "apiBaseUrl">;

/**
 * Sends one request and returns the raw response. Status codes are not
 * inspected here; that is the caller's job.
 */
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
 * Sends a request, retrying once if it never reached the server.
 *
 * Only `GET` is retried; replaying a `POST` after an ambiguous failure could
 * duplicate a write. Anything else rethrows the original error.
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
