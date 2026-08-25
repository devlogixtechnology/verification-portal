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
 * Only idempotent requests are retried, since replaying a write after an
 * ambiguous failure could duplicate it. `GET` qualifies by default; anything
 * else has to say so through `options.idempotent`.
 */
async function requestWithRetry(
  options: RequestOptions,
  config: TransportConfig
): Promise<Response> {
  try {
    return await performRequest(options, config);
  } catch (firstAttemptError) {
    const isIdempotent = options.idempotent ?? (options.method ?? "GET") === "GET";
    if (!isIdempotent) throw firstAttemptError;
    return await performRequest(options, config);
  }
}

export { requestWithRetry, DEFAULT_TIMEOUT_MS };
export type { TransportConfig };
