/** Token parsing and validation rules for this portal's codes. */

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{3,128}$/;

/**
 * Pulls a token out of raw input — a scanned QR payload, a pasted deep link, or
 * a hand-typed code.
 */
export function extractTokenFromInput(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const segments = new URL(trimmed).pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    } catch {
      return null;
    }
  }

  return trimmed;
}

/** Accepts alphanumerics, hyphens and underscores, 3 to 128 characters. */
export function validateTokenFormat(token: string): boolean {
  return TOKEN_PATTERN.test(token.trim());
}
