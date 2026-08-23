# Verification

A portable QR / token asset verification module. Copy this folder into a
project, write one config object, and mount the provider — no other part of the
module needs editing.

It handles the token flow, the network layer, and the state machine. The
consuming project supplies the backend details and the visuals.

---

## How it works

```
raw input  ──▶  parseToken  ──▶  isValidTokenFormat  ──▶  buildVerificationRequest
(QR payload,                            │                          │
 pasted code)                           │                          ▼
                                        │                    HTTP request
                                        │                          │
                                        ▼                          ▼
                                  status: invalid       parseVerificationResponse
                                                                   │
                                        ┌──────────────────────────┼─────────────┐
                                        ▼                          ▼             ▼
                                 status: verified          status: invalid  status: error
```

The named steps are yours to define. Everything between them is handled here.

---

## Setup

### 1. Define a config

```tsx
import type { VerificationConfig } from "@/features/verification";

type Certificate = { id: string; holder: string; issuedAt: string };
type RejectionDetail = { reason: "expired" | "revoked" | "unknown" };

export const verificationConfig: VerificationConfig<Certificate, RejectionDetail> = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL!,

  // QR codes encode a full URL; the token is the last segment.
  parseToken: (raw) => raw.split("/").pop() ?? null,

  isValidTokenFormat: (token) => /^[a-f0-9]{32}$/.test(token),

  parseVerificationResponse: (rawBody) => {
    const body = rawBody as { valid: boolean; certificate?: Certificate; reason?: string };

    if (body.valid && body.certificate) {
      return { outcome: "verified", result: body.certificate };
    }
    return {
      outcome: "rejected",
      message: "This certificate could not be verified.",
      detail: { reason: (body.reason as RejectionDetail["reason"]) ?? "unknown" },
    };
  },

  renderVerified: (certificate) => <CertificateCard certificate={certificate} />,
  renderInvalid: (message, detail) => <RejectionNotice message={message} detail={detail} />,
};
```

### 2. Mount the provider

```tsx
import { VerificationProvider } from "@/features/verification";
import { verificationConfig } from "@/lib/config/verification";

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <VerificationProvider config={verificationConfig}>{children}</VerificationProvider>;
}
```

`TAsset` and `TErrorDetail` are inferred from the config, so every screen below
gets a typed `state.result` without repeating them.

### 3. Use it in a screen

```tsx
"use client";
import { useSubmitToken, useVerification } from "@/features/verification";

export function VerifyScreen({ token }: { token: string }) {
  const { submitToken, retry, reset } = useSubmitToken<Certificate, RejectionDetail>();
  const { state, config } = useVerification<Certificate, RejectionDetail>();

  useEffect(() => { void submitToken(token); }, [submitToken, token]);

  switch (state.status) {
    case "verifying": return <Spinner />;
    case "verified":  return config.renderVerified(state.result!);
    case "invalid":   return <>{config.renderInvalid?.(state.errorMessage!, state.errorDetail ?? undefined)}</>;
    case "error":     return <ErrorScreen message={state.errorMessage!} onRetry={retry} />;
    default:          return <TokenEntryForm onSubmit={submitToken} onClear={reset} />;
  }
}
```

---

## What you define

| Field | Required | Default if omitted | Purpose |
| --- | --- | --- | --- |
| `apiBaseUrl` | Yes | — | Origin and path prefix, no trailing slash |
| `parseVerificationResponse` | Yes | — | Turns a response body into an outcome |
| `renderVerified` | Yes | — | Renders the verified asset |
| `parseToken` | No | Input is used as the token | Pulls a token out of a QR payload or pasted URL |
| `isValidTokenFormat` | No | Any non-empty token is accepted | Rejects malformed input before a request is sent |
| `buildVerificationRequest` | No | `GET {apiBaseUrl}/verify/{token}` | Sets the path, method, headers, and body |
| `isHealthyResponse` | No | `response.ok` | Decides whether a response carries a usable body |
| `renderInvalid` | No | `errorMessage` shown on its own | Renders a rejection |

### Sending auth headers

Headers are per-request, so a token or API key goes in `buildVerificationRequest`:

```ts
buildVerificationRequest: (token) => ({
  path: "/assets/verify",
  method: "POST",
  headers: { "X-Api-Version": "2" },
  body: { token },
}),
```

---

## States

The screen is always in exactly one of these. Read it from
`useVerification().state.status`.

| Status | Meaning | Populated fields |
| --- | --- | --- |
| `idle` | Waiting for input | — |
| `verifying` | Request in flight | `token` |
| `verified` | The asset is genuine | `token`, `result` |
| `invalid` | The backend answered, and the answer is no | `token`, `errorMessage`, `errorDetail` |
| `error` | The answer could not be obtained | `token`, `errorMessage` |

Fields never outlive their status: an error message from a previous attempt is
cleared before the next request starts, and a result is cleared when a retry
fails. Screens can read `state.result` or `state.errorMessage` without
defending against stale values.

---

## Who decides what failed

| Situation | Decided by | Status |
| --- | --- | --- |
| Connection lost, DNS failure | The module | `error` |
| Timeout (10s), `408`, `504` | The module | `error` |
| `5xx` | The module | `error` |
| Response body is not JSON | The module | `error` |
| `4xx` — expired, revoked, tampered | `parseVerificationResponse` | `invalid` |
| Healthy response | `parseVerificationResponse` | `verified` or `invalid` |

`4xx` responses go to your parser rather than being treated as errors, because
only the consuming project knows whether its `404` means "expired" or "never
existed". Return `{ outcome: "failed", message }` from the parser to route one
to the `error` screen instead.

Failed `GET` requests are retried once automatically. `POST` requests are not,
so a write is never duplicated.

---

## Styling with CSS tokens

The pages in `app/` do not hard-code colours, spacing, or type. They read a set
of CSS custom properties declared in `app/globals.css`:

```css
:root {
  --verify-color-surface: #ffffff;
  --verify-color-text: #111827;
  --verify-color-muted: #6b7280;
  --verify-color-accent: #2563eb;
  --verify-color-success: #059669;
  --verify-color-danger: #dc2626;
  --verify-radius: 0.75rem;
  --verify-space: 1rem;
  --verify-font-body: system-ui, sans-serif;
}
```

**To restyle the portal, change these values — not the components.** Override
them once in your own stylesheet and the whole flow follows:

```css
:root {
  --verify-color-accent: #7c3aed;
  --verify-radius: 0;
  --verify-font-body: "Inter", sans-serif;
}
```

This matters most for the UI you pass to `renderVerified` and `renderInvalid`.
Those screens sit between the module's own entry and loading screens, so build
them from the same tokens rather than from your app's raw values:

```tsx
function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <article
      style={{
        background: "var(--verify-color-surface)",
        color: "var(--verify-color-text)",
        borderRadius: "var(--verify-radius)",
        padding: "var(--verify-space)",
      }}
    >
      <h2 style={{ color: "var(--verify-color-success)" }}>Verified</h2>
      <p style={{ color: "var(--verify-color-muted)" }}>{certificate.holder}</p>
    </article>
  );
}
```

A custom asset card that takes its colours from elsewhere will look right on its
own and wrong in sequence. The entry screen, the spinner, the result, and the
error screen should read as one product, and the tokens are what keep them
aligned.

---

## Exports

| Export | What it is |
| --- | --- |
| `VerificationProvider` | Provider. Takes `config`, holds the state |
| `useVerification` | Reads `{ state, dispatch, config }` |
| `useSubmitToken` | Returns `{ submitToken, retry, reset }` |
| `verifyToken` | Verifies a token without React |
| `verificationReducer` | The state machine, for tests |
| `createInitialState` | A fresh `idle` state, for tests |
| `VerificationConfig` | The config type |
| `VerificationState`, `VerificationStatus` | State shape and the status union |
| `ParsedVerificationResult` | Return type of `parseVerificationResponse` |
| `RequestOptions` | Return type of `buildVerificationRequest` |
| `VerificationAction` | Actions accepted by `dispatch` |

### Verifying outside React

`verifyToken` is the same pipeline the hook uses with no React attached — for a
server component, a route handler, or a test:

```ts
const outcome = await verifyToken(token, verificationConfig);
if (outcome.outcome === "verified") {
  // outcome.result
}
```

### Testing a config

The state machine is pure, so a config can be checked against real transitions
without rendering anything:

```ts
let state = createInitialState<Certificate, RejectionDetail>();
state = verificationReducer(state, { type: "tokenReceived", token: "a1b2" });
expect(state.status).toBe("verifying");
```

---

## Not included

Still to be provided by the consuming project, or built:

- **The camera.** `scanner/` is empty. `parseToken` handles a scanned payload
  once you have the string, but capturing it — permissions, the video stream,
  the fallback when permission is denied — is not built.
- **The result view.** `renderVerified` and `renderInvalid` are declared on the
  config, but no component in this folder calls them yet. Screens invoke them
  directly, as in step 3 above.
- **The HTTP status code in the parser.** `parseVerificationResponse` receives
  only the body, so a backend that separates rejections by status alone — `410`
  for expired, `422` for tampered — cannot be modelled yet.
- **Copy and localisation.** Failure messages are hard-coded English in
  `api/errors.ts`, and the malformed-token message in `hooks/useSubmitToken.ts`.
- **Timeout configuration.** Fixed at 10 seconds in `api/client.ts`.
