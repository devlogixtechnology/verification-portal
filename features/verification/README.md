# Verification Feature Module (`features/verification`)

> **Encapsulated, type-safe verification domain module for DevLogix.**

This module provides the core cryptographic verification engine, finite state machine (FSM), API client, camera scanner, and responsive dashboard views.

---

## 🏗️ Architecture & Directory Layout

```
features/verification/
├── api/                           # Network transport & error classification
│   ├── client.ts                  # requestWithRetry & fetch client
│   ├── errors.ts                  # Classification for network, 4xx, 5xx, and timeout errors
│   └── verification.ts            # Standalone verifyToken() function
│
├── config/                        # Contracts & default fixtures
│   └── verification.config.ts     # Mock dataset, token regex parser, and default configuration
│
├── components/                    # 5-State Core Components
│   ├── LandingVerificationView.tsx # State 1: QR trigger & manual code form
│   ├── LoadingPulse.tsx           # State 2: Vertical 3-dot teal animation
│   └── NetworkErrorView.tsx       # State 3: Wireframe globe error & retry action
│
├── dashboard/                     # State 4 & State 5 Dashboards
│   ├── CaPassDashboard.tsx        # State 4: 6-metric authenticated credential passport
│   ├── CaFailDashboard.tsx        # State 5: Diagnostic expiration/revocation card
│   └── VerificationDashboard.tsx  # Outcome dispatcher component
│
├── hooks/                         # React hooks
│   └── useSubmitToken.ts          # Orchestrates token submission, retry, and reset
│
├── scanner/                       # Camera & QR scanning engine
│   └── QRScanner.tsx              # html5-qrcode wrapper with AbortError-safe lifecycle
│
├── state/                         # Finite State Machine & Provider
│   ├── verificationMachine.ts     # Pure reducer state machine & action definitions
│   ├── VerificationProvider.tsx   # Top-level React Context Provider
│   ├── useVerification.ts         # Hook to access state and dispatch
│   └── index.ts                   # State barrel export
│
├── types/                         # Domain TypeScript interfaces
│   └── verification.types.ts      # VerifiedDocument, VerificationState, VerificationConfig
│
└── index.ts                       # Public API barrel export
```

---

## 🔄 State Machine Lifecycle

The module is powered by a pure reducer FSM (`state/verificationMachine.ts`):

```
       ┌────────────────────────┐
       │         idle           │
       └───────────┬────────────┘
                   │ tokenReceived
                   ▼
       ┌────────────────────────┐
       │       verifying        │
       └───────────┬────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
 ┌───────────┐┌───────────┐┌───────────┐
 │ verified  ││  invalid  ││   error   │
 └─────┬─────┘└─────┬─────┘└─────┬─────┘
       │            │            │
       │ reset      │ reset      │ retry
       │            │            ▼
       └────────────┴───────▶ [verifying]
```

### State Definitions:
1. `idle`: Initial state awaiting token input.
2. `verifying`: Asynchronous verification request in-flight.
3. `verified`: Cryptographic verification passed. Stores `result: VerifiedDocument`.
4. `invalid`: Document rejected by authority (expired/revoked/unregistered). Stores `errorDetail`.
5. `error`: Network, timeout, or server 500 fault. Stores `errorMessage` and supports `retry`.

---

## 🚀 Quick Usage

### 1. Wrap Layout with Provider
```tsx
import { VerificationProvider } from "@/features/verification";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <VerificationProvider>{children}</VerificationProvider>;
}
```

### 2. Verify a Token Programmatically
```tsx
import { useSubmitToken, useVerification } from "@/features/verification";

export function CustomVerify() {
  const { state } = useVerification();
  const { submitToken, retry, reset } = useSubmitToken();

  return (
    <button onClick={() => submitToken("CERT-2026-001")}>
      Verify CERT-2026-001
    </button>
  );
}
```

---

## 🧪 Unit Testing

Run unit tests directly:
```bash
npm test
```
Tests cover pure reducer transitions, regex token extraction, and response parsing.
