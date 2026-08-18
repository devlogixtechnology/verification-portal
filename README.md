
# End-User Verification Portal (Epic 3)

A foundational, modular digital asset verification engine built with **Next.js App Router**, **TypeScript**, and **Redux Toolkit (RTK) Query**. This portal provides the client-facing surface for scanning QR codes and securely verifying cryptographically issued certificates, documents, and project handoffs against the backend endpoints.

## Architecture Overview

This repository follows a decoupled feature design pattern to maximize code portability. The codebase is split into three functional layers:

1. **Routing Gateway (`app/`)** — Next.js file-system paths handling entry points, loading skeletons, and runtime error boundaries natively.
2. **Global State & Network Cache (`store/`)** — Powered by RTK Query. Centralized `baseApi` with interceptors for token headers, extended by modular domain API endpoints.
3. **UI Modules Layer (`features/`)** — Strictly stateless presentational components and local interaction hooks. No configuration, data logic, or caching code lives here.

---

## Directory Structure Summary

```bash
├── app/                  # Next.js App Router (public verification views)
│   └── (public)/verify/  # /verify, /verify/scan, and deep-linked /verify/[token]
├── store/                # RTK Query state engine layer
│   ├── baseApi.ts        # Central fetch engine configured with JWT interceptors
│   ├── auth/              # Session state slices and authentication endpoint queries
│   └── verification/      # Local screen state parameters and asset validation queries
├── features/             # Plug-and-play UI building blocks
│   └── verification/      # Isolated verification module components and hardware hooks
└── docs/                 # System engineering specifications and diagrams
```

---

## Core Technical Workflows

### 1. Data Fetching and Caching via RTK Query

All communication with the backend squad (`MERN-BE-A`) goes through the `store/baseApi.ts` query client.

- To fetch verification statistics or validate hashes, use the auto-generated hooks from `store/verification/verificationApi.ts`.
- Do not invoke `fetch` or `axios` directly within custom hooks or UI components.

### 2. State Machine UI Management

Screen state uses a deterministic state machine rather than scattered boolean flags. The view always resolves to one of the following states:

`idle` → `scanning` → `verifying` → `verified` | `invalid` | `error`

---

## Onboarding for Contributors

### Development Environment Setup

1. Clone the repository using an authenticated SSH key:
   ```bash
   git clone git@github.com:devlogixtechnology/verification-portal.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Code Submission Standards

- **Type safety** — All API requests, responses, and component props must be explicitly typed using TypeScript interfaces defined in `store/verification/types.ts`.
- **Graceful degradation** — Camera permission denials, malformed QR inputs, and expired network queries must be handled cleanly using Next.js `error.tsx` boundaries or manual fallbacks.
