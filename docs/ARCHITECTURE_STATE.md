# Verification Routing & State

How the App Router routes and the verification state machine line up.

## 1. Routes

Each consuming project owns its own URLs and maps the module's navigation
intents onto them in `config.onNavigate`. Every project uses the same three
screens under its own base path — `/project-a`, `/project-b`, `/project-c`:

| Route | File | Screen | Active state |
| --- | --- | --- | --- |
| `{base}` | `app/(demo)/{project}/page.tsx` | `TokenEntryView` | `idle` |
| `{base}/scan` | `app/(demo)/{project}/scan/page.tsx` | `QRScanner` | `idle` |
| `{base}/[token]` | `app/(demo)/{project}/[token]/page.tsx` | `VerificationView` | `verifying` → `verified` \| `invalid` \| `error` |

Each project's `layout.tsx` mounts `VerificationProvider`, so state survives
navigation between its three screens.

The module expresses navigation as intent, never as a path:

```ts
type VerificationRoute =
  | { name: "start" }
  | { name: "scanner" }
  | { name: "verify"; token: string };
```

## 2. State machine

Five states. There is no `scanning` state — the camera is local UI concern
inside `QRScanner`, and a scan simply produces a token like any other input.

```
              ┌────────┐
      ┌──────▶│  idle  │◀──────────────┐
      │       └────────┘               │
      │            │ tokenReceived     │ reset
      │            ▼                   │
      │      ┌───────────┐             │
      │      │ verifying │◀──── retry ─┤
      │      └───────────┘             │
      │            │                   │
      │   ┌────────┼────────┐          │
      │   ▼        ▼        ▼          │
      │ ┌────────┐┌───────┐┌───────┐   │
      └─│verified││invalid││ error │───┘
        └────────┘└───────┘└───────┘
```

| State | Meaning | Populated |
| --- | --- | --- |
| `idle` | Waiting for input | — |
| `verifying` | Request in flight | `token` |
| `verified` | Asset is genuine | `token`, `result` |
| `invalid` | Backend answered no — expired, revoked, unknown | `token`, `errorMessage`, `errorDetail` |
| `error` | No answer obtainable — network, timeout, 5xx, bad body | `token`, `errorMessage` |

### Invariants

Every transition returns a complete state, so no field outlives the status it
belongs to:

- A new `tokenReceived` clears any previous error and result.
- `retry` clears the error before re-entering `verifying`, so no stale message
  renders under the spinner.
- `tokenRejected` drops the token, so `retry` cannot silently re-verify a
  previous one.
- `retry` with no token is a no-op.

These are covered in `__tests__/unit/verificationMachine.test.ts`.

## 3. State management choice

React Context + `useReducer`, as the brief's default. Redux Toolkit and RTK
Query were evaluated and dropped: the portal holds one short-lived verification
at a time, needs no cross-route cache, and the module must not force a store on
a consuming project. `store/` was removed.

## 4. Error handling

Failure is a state, not an exception.

| Situation | Classified by | Status |
| --- | --- | --- |
| Network failure, DNS, abort | `api/errors.ts` | `error` |
| Timeout (10s), `408`, `504` | `api/errors.ts` | `error` |
| `5xx` | `api/errors.ts` | `error` |
| Body is not JSON | `api/verification.ts` | `error` |
| `4xx` with a body | the project's `parseVerificationResponse` | `invalid` |

`4xx` is delegated because only the consuming project knows what its own `404`
means. Failed `GET`s retry once; `POST`s never do, so no write is duplicated.

Camera permission denial is handled inside `QRScanner`, which falls back to
manual entry rather than moving the machine to `error`.

Camera permission is also read *passively* on the entry screen through the
Permissions API, which shows no prompt. That is what lets the scan button label
itself correctly — "Begin scan" when access already exists, "Request camera
permission" when it does not — and open the scanner automatically once access is
granted.
