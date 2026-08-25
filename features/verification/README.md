# Verification module

Copy this folder into a project, write one config object, mount the provider.
No file in here needs editing.

It handles the token flow, the network, the state machine, and the screens that
are the same everywhere — entry, scanning, loading, failure. Your project brings
its backend, its routes, its asset shape, and what a verified result looks like.

**Needs:** React 19+, and `html5-qrcode` if you use the scanner.

---

## Setup

**1. Load the styles.**

```css
@import "features/verification/styles/tokens.css";       /* the design tokens */
@import "features/verification/styles/verification.css";  /* the components */
```

**2. Write a config.**

```tsx
import type { VerificationConfig } from "@/features/verification";

type Certificate = { courseTitle: string; recipientName: string };
type Rejection = { reason: "expired" | "revoked" };

export const config: VerificationConfig<Certificate, Rejection> = {
  apiBaseUrl: "https://api.example.com",

  parseVerificationResponse: (body) => {
    const res = body as { status: string; message: string; doc?: Certificate };
    return res.status === "valid" && res.doc
      ? { outcome: "verified", result: res.doc }
      : { outcome: "rejected", message: res.message, detail: { reason: "expired" } };
  },

  onNavigate: (route) => {
    if (route.name === "start")   return router.push("/verify");
    if (route.name === "scanner") return router.push("/verify/scan");
    router.push(`/verify/${route.token}`);
  },

  renderVerified: (cert, actions) => (
    <CertificateCard cert={cert} onDone={actions.verifyAnother} />
  ),
};
```

**3. Mount it, and drop in the screens.**

```tsx
// layout
<VerificationProvider config={config}>{children}</VerificationProvider>

// /verify           <TokenEntryView />
// /verify/scan      <QRScanner />
// /verify/[token]   <VerificationView token={token} />
```

Done. `TAsset` and `TErrorDetail` are inferred from the config, so `state.result`
is typed everywhere below the provider.

---

## The config

| Field | Required | Default | Does |
| --- | --- | --- | --- |
| `apiBaseUrl` | ● | — | Origin and path prefix, no trailing slash |
| `parseVerificationResponse` | ● | — | Turns a response body into an outcome |
| `onNavigate` | ● | — | Maps route intents to your URLs |
| `renderVerified` | ● | — | Renders the verified asset |
| `parseToken` | | Input is the token | Pulls a token from a QR payload or URL |
| `isValidTokenFormat` | | Anything non-empty | Rejects bad input before any request |
| `buildVerificationRequest` | | `GET {base}/verify/{token}` | Path, method, headers, body |
| `isHealthyResponse` | | `response.ok` | Whether a response has a usable body |
| `renderInvalid` | | Built-in screen | Renders a rejection |
| `messages` | | Built-in English | Overrides any user-facing string |

### Outcomes

`parseVerificationResponse` returns one of three things:

```ts
{ outcome: "verified", result: TAsset }                    // genuine
{ outcome: "rejected", message: string, detail?: TDetail } // the answer is no
{ outcome: "failed",   message: string }                   // no answer available
```

### Navigation

The module never knows your URLs. It asks to go somewhere and you decide where:

```ts
onNavigate: (route) => {
  switch (route.name) {
    case "start":   return router.push("/verify");
    case "scanner": return router.push("/verify/scan");
    case "verify":  return router.push(`/verify/${route.token}`);
  }
}
```

### Requests

```ts
buildVerificationRequest: (token) => ({
  path: "/verify/qr-code",
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}` },
  body: { qrCodeId: token },
  idempotent: true,   // a read-only POST — safe to retry after a dropped connection
}),
```

`GET` is retried once automatically after a connection failure. A `POST` is not,
unless you mark it `idempotent`.

### Don't publish the token format

Keep placeholders and error copy vague. `"CERT-0000"` in a placeholder tells
anyone who opens the page exactly what to guess against, and the code is the only
thing between a stranger and someone else's document. Put the real rule in
`isValidTokenFormat`, which the user never sees.

---

## States

Read from `useVerification().state.status`.

| Status | Means | Has |
| --- | --- | --- |
| `idle` | Waiting for input | — |
| `verifying` | Request in flight | `token` |
| `verified` | Genuine | `token`, `result` |
| `invalid` | The backend said no | `token`, `errorMessage`, `errorDetail` |
| `error` | No answer obtainable | `token`, `errorMessage` |

Fields never outlive their status — a previous error is cleared before the next
request, and a result is cleared when a retry fails. Read `state.result` without
defending against stale values.

---

## Who decides a failure

| Situation | Decided by | Status |
| --- | --- | --- |
| Lost connection, DNS | The module | `error` |
| Timeout (10s), `408`, `504` | The module | `error` |
| `5xx` | The module | `error` |
| Body is not JSON | The module | `error` |
| `4xx` with a body | Your parser | `invalid` |
| Healthy response | Your parser | `verified` or `invalid` |

`4xx` goes to your parser because only you know whether your `404` means
"expired" or "never existed". Return `{ outcome: "failed" }` to send one to the
error screen instead.

---

## Theming

Every value comes from a token in `styles/tokens.css`. Override the tokens, not
the components:

```css
[data-vf-theme="mine"] {
  --verification-success: #7c3aed;
  --verification-radius: 0;
  --verification-space-md: 1.25rem;
  --verification-font-family-heading: "Inter", sans-serif;
}
```

Colour, type, spacing, radius, shadow, rule thickness and motion are all tokens,
so a theme changes the whole flow without touching markup. Put the attribute on
`<html>` if the chrome around the module needs to retint with it.

**One trap:** `--verification-surface-elevated` is what cards and inputs sit on,
so it must be **lighter** than `--verification-surface`, the page. Setting it
equal to `--verification-surface-muted` makes every card look like a hole in the
page and pushes placeholder text to invisible.

### Class kit

Build `renderVerified` from these so it matches the screens around it.

| Class | For |
| --- | --- |
| `vf-screen`, `vf-screen--centered` | Page wrapper |
| `vf-stack` | Vertical group |
| `vf-card` | Bordered surface |
| `vf-title`, `--large`, `--small` | Headings |
| `vf-text`, `--muted`, `vf-caption`, `vf-label` | Copy |
| `vf-button`, `--primary`, `--secondary`, `--quiet` | Actions |
| `vf-input`, `--invalid`, `vf-error-text` | Forms |
| `vf-metric-grid`, `vf-metric-card`, `--wide` | Stat tiles |
| `vf-list`, `vf-detail-row` | Divided label/value list |
| `vf-preview` | A stand-in for the asset itself |
| `vf-hero` | Centred crest |
| `vf-section-label` | Heading above a list or grid |
| `vf-appbar`, `vf-footer`, `vf-page` | Optional chrome |

`--primary` for the action that moves the user forward, `--quiet` for a
loop-back like "Verify another" — it takes no background of its own, so it reads
as optional.

### Two-tone results

Serving more than one asset type? Retint a whole screen by rebinding the accent
its classes already read:

```tsx
<div className="vf-screen" style={{
  "--verification-success": "var(--verification-accent-b)",
} as CSSProperties}>
```

Cards, buttons and icons below follow. Single-tone themes need no change — both
accents point at the primary by default.

---

## The scan button

`TokenEntryView` checks camera permission *without prompting*, so its button says
what it will actually do:

| Permission | Label | Click |
| --- | --- | --- |
| Granted | Begin scan | Opens the scanner |
| Not asked yet | Request camera permission | Asks, then opens the scanner if allowed |
| Blocked | Camera blocked | Points at the code field |

`QRScanner` prompts on mount instead — a user who opened the scan screen has
already committed.

---

## Exports

| Export | Is |
| --- | --- |
| `VerificationProvider` | Provider. Takes `config`, holds the state |
| `useVerification` | Reads `{ state, dispatch, config }` |
| `useSubmitToken` | Returns `{ submitToken, retry, reset }` |
| `VerificationView` | Submits a token and renders its outcome |
| `TokenEntryView` | The entry screen |
| `QRScanner` | Camera, permission handling, manual fallback |
| `LoadingPulse`, `NetworkErrorView`, `InvalidResultView` | Individual screens |
| `useCameraPermission`, `useQrScanner`, `ScannerViewfinder`, `ManualTokenFallback`, `ScannerPresets` | Scanner parts, for a custom scan screen |
| `verifyToken` | Verifies without React — server component, route handler, test |
| `verificationReducer`, `createInitialState` | The state machine, for tests |
| `DEFAULT_MESSAGES`, `resolveMessages` | The built-in copy |

### Without React

```ts
const outcome = await verifyToken(token, config);
if (outcome.outcome === "verified") { /* outcome.result */ }
```

### Testing a config

The machine is pure, so a config can be checked without rendering:

```ts
let state = createInitialState<Certificate, Rejection>();
state = verificationReducer(state, { type: "tokenReceived", token: "CERT-2001" });
// state.status === "verifying"
```

---

## Not included

- **Routes.** The module asks to navigate; you own the URLs.
- **A camera polyfill.** `QRScanner` needs `html5-qrcode` and a secure context
  (`https://` or `localhost`).
- **Persistence.** Nothing is cached or stored between page loads.
