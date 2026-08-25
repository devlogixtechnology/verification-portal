# Verification

A portable QR / token asset verification module. Copy this folder into a
project, write one config object, mount the provider — no file inside this
folder needs editing.

The module owns the token flow, the network layer, the state machine, and the
screens that are the same everywhere (entry, scanning, loading, failure). The
consuming project owns its backend, its routes, its asset shape, and what a
verified result looks like.

**Requires:** React 19+, and `html5-qrcode` if you use the scanner.

---

## How it works

```
raw input ──▶ parseToken ──▶ isValidTokenFormat ──▶ buildVerificationRequest
(QR payload,                        │                        │
 pasted code)                       │                        ▼
                                    │                  HTTP request
                                    │                        │
                                    ▼                        ▼
                             status: invalid    parseVerificationResponse
                                                             │
                                    ┌────────────────────────┼──────────────┐
                                    ▼                        ▼              ▼
                            status: verified        status: invalid   status: error
                                    │                        │
                            renderVerified            renderInvalid
```

The named steps are yours. Everything between them is handled here.

---

## Setup

### 1. Load the styles

```css
/* your global stylesheet */
@import "../features/verification/styles/tokens.css";       /* the token contract */
@import "../features/verification/styles/verification.css"; /* the components */
```

### 2. Define a config

```tsx
import type { VerificationConfig } from "@/features/verification";

type Certificate = { courseTitle: string; recipientName: string };
type Rejection = { reason: "expired" | "revoked" };

export const config: VerificationConfig<Certificate, Rejection> = {
  apiBaseUrl: "https://api.example.com",

  parseToken: (raw) => raw.split("/").pop() ?? null,
  isValidTokenFormat: (token) => /^CERT-\d{4}$/.test(token),

  parseVerificationResponse: (body) => {
    const res = body as { status: string; message: string; doc?: Certificate };
    return res.status === "valid" && res.doc
      ? { outcome: "verified", result: res.doc }
      : { outcome: "rejected", message: res.message, detail: { reason: "expired" } };
  },

  onNavigate: (route) => {
    if (route.name === "start") router.push("/verify");
    else if (route.name === "scanner") router.push("/verify/scan");
    else router.push(`/verify/${route.token}`);
  },

  renderVerified: (cert, actions) => (
    <CertificateCard cert={cert} onDone={actions.verifyAnother} />
  ),
};
```

### 3. Mount the provider and drop in the screens

```tsx
// layout
<VerificationProvider config={config}>{children}</VerificationProvider>

// /verify
<TokenEntryView />

// /verify/scan
<QRScanner />

// /verify/[token]
<VerificationView token={token} />
```

That is the whole integration. `TAsset` and `TErrorDetail` are inferred from the
config, so `state.result` is typed everywhere below the provider.

---

## What you define

| Field | Required | Default if omitted | Purpose |
| --- | --- | --- | --- |
| `apiBaseUrl` | Yes | — | Origin and path prefix, no trailing slash |
| `parseVerificationResponse` | Yes | — | Turns a response body into an outcome |
| `renderVerified` | Yes | — | Renders the verified asset |
| `onNavigate` | Yes | — | Maps the module's route intents to your URLs |
| `parseToken` | No | Input is used as the token | Pulls a token from a QR payload or URL |
| `isValidTokenFormat` | No | Any non-empty token is accepted | Rejects malformed input before any request |
| `buildVerificationRequest` | No | `GET {apiBaseUrl}/verify/{token}` | Path, method, headers, body |
| `isHealthyResponse` | No | `response.ok` | Whether a response carries a usable body |
| `renderInvalid` | No | The module's default rejection screen | Renders a rejection |
| `messages` | No | Built-in English copy | Overrides any user-facing string |

### The scan button

`TokenEntryView` reads camera permission *passively*, through the Permissions
API, which shows no prompt. The button then says what it will actually do:

| Permission | Label | On click |
| --- | --- | --- |
| already granted | Begin scan | opens the scanner |
| not yet asked | Request camera permission | asks, then opens the scanner if granted |
| blocked / unsupported | Camera blocked / unavailable | points the user at the code field |

`QRScanner` passes `requestOnMount` instead, since a user who opened the scan
screen has already committed.

### Navigation

The module never knows your URLs. It asks to go somewhere:

```ts
onNavigate: (route) => {
  switch (route.name) {
    case "start":   return router.push("/verify");
    case "scanner": return router.push("/verify/scan");
    case "verify":  return router.push(`/verify/${route.token}`);
  }
}
```

### Placeholders and error copy

Never put the token format in a placeholder or an error message. `"CERT-0000"`
tells anyone who opens the page exactly what shape to guess against, and a
verification code is the only thing standing between a stranger and someone
else's document. The defaults are deliberately vague ("Code", "That doesn't look
like a valid code"); keep any override the same way, and enforce the real format
in `isValidTokenFormat`, which never reaches the user.

### Auth headers

Headers are per-request:

```ts
buildVerificationRequest: (token) => ({
  path: "/assets/verify",
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}` },
  body: { token },
}),
```

---

## States

Read from `useVerification().state.status`.

| Status | Meaning | Populated fields |
| --- | --- | --- |
| `idle` | Waiting for input | — |
| `verifying` | Request in flight | `token` |
| `verified` | The asset is genuine | `token`, `result` |
| `invalid` | The backend answered, and the answer is no | `token`, `errorMessage`, `errorDetail` |
| `error` | The answer could not be obtained | `token`, `errorMessage` |

Fields never outlive their status: a previous error is cleared before the next
request starts, and a result is cleared when a retry fails. Screens can read
`state.result` without defending against stale values.

---

## Who decides what failed

| Situation | Decided by | Status |
| --- | --- | --- |
| Connection lost, DNS failure | The module | `error` |
| Timeout (10s), `408`, `504` | The module | `error` |
| `5xx` | The module | `error` |
| Response body is not JSON | The module | `error` |
| `4xx` — expired, revoked, unknown | `parseVerificationResponse` | `invalid` |
| Healthy response | `parseVerificationResponse` | `verified` or `invalid` |

`4xx` goes to your parser because only you know whether a `404` means "expired"
or "never existed". Return `{ outcome: "failed", message }` to route one to the
error screen instead. Failed `GET`s retry once; `POST`s never do.

---

## Theming

Every value the module renders comes from a token in
`styles/tokens.css`. Override the tokens — not the components:

```css
[data-vf-theme="mine"] {
  --verification-success: #7c3aed;
  --verification-radius: 0;
  --verification-font-family-heading: "Inter", sans-serif;
  --verification-space-md: 1.25rem;
}
```

Colour, type, spacing, radius, shadow, rule thickness and motion are all tokens,
so a theme changes the whole flow without touching markup.

One trap worth naming: `--verification-surface-elevated` is what cards, inputs
and panels sit on, so it must read **lighter** than `--verification-surface`
(the page). Setting it equal to `--verification-surface-muted` makes every card
darker than the page and pushes placeholder text and artwork to near-invisible
contrast. Scope the block to an attribute
or class if several themes must coexist in one app; use `:root` if there is only
one.

**Build your `renderVerified` from the same tokens and classes.** It sits
between the module's own entry, loading and error screens; a result card that
takes its colours from elsewhere looks right alone and wrong in sequence. The
kit available to you:

| Class | Use |
| --- | --- |
| `vf-screen`, `vf-screen--centered` | Page wrapper |
| `vf-stack` | Vertical group |
| `vf-card` | Bordered surface |
| `vf-title`, `vf-title--large/small` | Headings |
| `vf-text`, `vf-text--muted`, `vf-caption`, `vf-label` | Body copy |
| `vf-button`, `--primary/--secondary/--ghost` | Actions |
| `vf-input`, `vf-input--invalid`, `vf-error-text` | Forms |
| `vf-metric-grid`, `vf-metric-card`, `vf-metric-card--wide` | Stat tiles |
| `vf-list`, `vf-detail-row` | Divided label/value list |
| `vf-preview`, `vf-preview__mark`, `vf-preview__caption` | A stand-in for the asset itself |
| `vf-hero` | Centred crest for certificate-style results |
| `vf-section-label` | Heading above a list or grid |
| `vf-appbar`, `vf-page` | Optional app bar and mobile frame |
| `vf-status-icon--success/danger/info` | Result icons |

Use `vf-button--primary` for the action that moves the user forward, and
`vf-button--quiet` for a loop-back like "Verify another" — it takes the page
background so it reads as optional rather than as the next step.

### Two-tone results

A project serving more than one asset type can retint a whole screen by
rebinding the accent the module's own classes already read:

```tsx
<div className="vf-screen" style={{
  "--verification-success": "var(--verification-accent-b)",
  "--verification-success-strong": "var(--verification-accent-b-strong)",
} as CSSProperties}>
```

Cards, buttons and icons below follow automatically. The base tokens point both
accents at the primary, so a single-tone theme needs no change.

---

## Exports

| Export | What it is |
| --- | --- |
| `VerificationProvider` | Provider. Takes `config`, holds the state |
| `useVerification` | Reads `{ state, dispatch, config }` |
| `useSubmitToken` | Returns `{ submitToken, retry, reset }` |
| `VerificationView` | Submits a token and renders its outcome |
| `TokenEntryView` | The entry screen |
| `QRScanner` | Camera, permission handling, manual fallback |
| `LoadingPulse`, `NetworkErrorView`, `InvalidResultView` | Individual screens |
| `useCameraPermission`, `useQrScanner`, `ScannerViewfinder`, `ManualTokenFallback`, `ScannerPresets` | Scanner parts, for a custom scan screen |
| `verifyToken` | Verifies a token without React |
| `verificationReducer`, `createInitialState` | The state machine, for tests |
| `DEFAULT_MESSAGES`, `resolveMessages` | Built-in copy |

### Verifying outside React

```ts
const outcome = await verifyToken(token, config);
if (outcome.outcome === "verified") {
  // outcome.result
}
```

### Testing a config

The machine is pure, so a config can be checked without rendering:

```ts
let state = createInitialState<Certificate, Rejection>();
state = verificationReducer(state, { type: "tokenReceived", token: "CERT-2001" });
assert.equal(state.status, "verifying");
```

---

## Not included

- **Route definitions.** The module asks to navigate; you own the URLs.
- **A camera polyfill.** `QRScanner` needs `html5-qrcode` and a secure context
  (`https://` or `localhost`).
- **Persistence.** Nothing is cached or stored between page loads.
