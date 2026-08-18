# CLAUDE.md

Guidance for Claude (or any AI agent) generating code in this repo. This is Squad Nova's Epic 3 — End-User Verification Portal (Next.js App Router + TypeScript). Read this before creating or placing any file.

## Core rule

**Feature-based, not type-based.** Never create a generic top-level `pages/` or dump unrelated components into one folder. Every file about verification belongs under `features/verification/`. Routing files belong under `app/`. Nothing else.

## Where things go

| You're creating...                                                           | Put it in...                                                                                    | Example                                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| A route / page                                                               | `app/(public)/verify/...`                                                                     | `app/(public)/verify/scan/page.tsx`            |
| An internal/authenticated route                                              | `app/(internal)/...`                                                                          | —                                               |
| A verification-specific component                                            | `features/verification/components/`                                                           | `AssetMetadataCard.tsx`                        |
| Scanner logic/component                                                      | `features/verification/scanner/`                                                              | `QrScanner.tsx`, `validateQrPayload.ts`      |
| State machine / provider / feature state                                     | `features/verification/state/`                                                                | `verificationMachine.ts`                       |
| Verification-only types                                                      | `features/verification/types/`                                                                | `verification.types.ts`                        |
| Verification-only hooks                                                      | `features/verification/hooks/`                                                                | `useQrPermission.ts`                           |
| Truly generic, reusable UI (buttons, cards, badges — no verification logic) | `components/ui/`                                                                              | `Badge.tsx`                                    |
| RTK Query base client (JWT interceptors, shared config)                      | `store/baseApi.ts`                                                                            | — single file, don't split this up              |
| RTK Query domain slice + endpoints for verification                          | `store/verification/`                                                                         | `verificationApi.ts`, `verificationSlice.ts` |
| RTK Query domain slice for another domain (e.g. auth)                        | `store/<domain>/`                                                                             | `store/auth/`                                  |
| Error classification (network/4xx/5xx)                                       | inside the relevant domain folder, or a shared`store/errors.ts` if reused across domains      | —                                               |
| Env vars, feature flags                                                      | `lib/config/`                                                                                 | —                                               |
| Route paths, error codes, magic strings                                      | `lib/constants/`                                                                              | —                                               |
| Cross-feature reusable hook                                                  | `hooks/` (root)                                                                               | `useDebounce.ts`                               |
| Cross-feature shared type                                                    | `types/` (root)                                                                               | shared API envelope types                        |
| Mock API responses                                                           | `mocks/`                                                                                      | `verification.mock.ts`                         |
| Tests                                                                        | mirror the source path under`__tests__/unit`, `__tests__/integration`, or `__tests__/e2e` | see below                                        |
| Planning docs / decisions                                                    | `docs/`                                                                                       | `routing-state-plan.md`                        |

## Decision rule: feature folder vs. shared folder

Ask: **"Would another client project need this exact file unmodified?"**

- **No** (it knows about verification, tokens, assets) → `features/verification/...`
- **Yes** (it's a generic Button, a generic useDebounce, a shared base API client) → root-level shared folder (`components/ui/`, `hooks/`, `store/baseApi.ts`)

When in doubt, default to the feature folder. It's easier to promote a file to shared later than to untangle a shared file that quietly grew feature-specific logic.

## Testing conventions

- Test location mirrors source location, under `__tests__/{unit,integration,e2e}/`.
- **Unit**: pure functions and isolated logic — `validateQrPayload.ts`, `verificationMachine.ts` transitions.
- **Integration**: anything touching the API client or store together — `store/verification/verificationApi.ts` against `mocks/`.
- **E2E**: full user flow — scan/link → loading → verified or error.
- Every new component that has a loading/success/error state must have a corresponding test covering all three states — this project treats error states as first-class, not an afterthought.

## API & state rules (don't deviate without asking)

- **Never** call `fetch` directly from a component. All backend calls go through `lib/api/verification.ts`.
- **Never** hardcode a secret, token, or internal URL in client code. Assume every route is publicly reachable.
- State must flow through the state machine in `features/verification/state/verificationMachine.ts` — no scattered `useState` booleans for loading/error across screens. If a new screen needs status, it reads from this machine.
- Prefer React Context + `useReducer`, or Zustand only if state must be read from multiple unrelated components. Don't reach for Redux Toolkit/RTK Query for this feature unless the squad has explicitly decided otherwise — see `store/` only if that decision has been made.

## Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities/logic: `camelCase.ts`
- Types: `camelCase.types.ts`
- Route folders (App Router): lowercase, matches URL segment (`scan/`, `[token]/`, `result/`)

## Before creating a new top-level folder

Don't. If something doesn't fit the table above, it likely belongs inside an existing folder — ask first rather than introducing a new top-level directory that fragments the structure documented in `docs/`

@AGENTS.md

# CLAUDE.md

Guidance for Claude (or any AI agent) generating code in this repo. This is Squad Nova's Epic 3 — End-User Verification Portal (Next.js App Router + TypeScript). Read this before creating or placing any file.

## Core rule

**Feature-based, not type-based.** Never create a generic top-level `pages/` or dump unrelated components into one folder. Every file about verification belongs under `features/verification/`. Routing files belong under `app/`. Nothing else.

## Where things go

| You're creating...                                                           | Put it in...                                                                                    | Example                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| A route / page                                                               | `app/(public)/verify/...`                                                                     | `app/(public)/verify/scan/page.tsx`       |
| An internal/authenticated route                                              | `app/(internal)/...`                                                                          | —                                          |
| A verification-specific component                                            | `features/verification/components/`                                                           | `AssetMetadataCard.tsx`                   |
| Scanner logic/component                                                      | `features/verification/scanner/`                                                              | `QrScanner.tsx`, `validateQrPayload.ts` |
| State machine / provider / feature state                                     | `features/verification/state/`                                                                | `verificationMachine.ts`                  |
| Verification-only types                                                      | `features/verification/types/`                                                                | `verification.types.ts`                   |
| Verification-only hooks                                                      | `features/verification/hooks/`                                                                | `useQrPermission.ts`                      |
| Truly generic, reusable UI (buttons, cards, badges — no verification logic) | `components/ui/`                                                                              | `Badge.tsx`                               |
| RTK Query API slice                                                          | `store/api/`                                                                                  | `verificationApi.ts`                      |
| Client-only Redux slice (UI state, not server data)                          | `store/slices/`                                                                               | `uiSlice.ts`                              |
| Backend fetch/client logic, endpoint calls                                   | `lib/api/`                                                                                    | `verification.ts`, `client.ts`          |
| Error classification (network/4xx/5xx)                                       | `lib/api/errors.ts`                                                                           | —                                          |
| Env vars, feature flags                                                      | `lib/config/`                                                                                 | —                                          |
| Route paths, error codes, magic strings                                      | `lib/constants/`                                                                              | —                                          |
| Cross-feature reusable hook                                                  | `hooks/` (root)                                                                               | `useDebounce.ts`                          |
| Cross-feature shared type                                                    | `types/` (root)                                                                               | shared API envelope types                   |
| Mock API responses                                                           | `mocks/`                                                                                      | `verification.mock.ts`                    |
| Tests                                                                        | mirror the source path under`__tests__/unit`, `__tests__/integration`, or `__tests__/e2e` | see below                                   |
| Planning docs / decisions                                                    | `docs/`                                                                                       | `routing-state-plan.md`                   |

## Decision rule: feature folder vs. shared folder

Ask: **"Would another client project need this exact file unmodified?"**

- **No** (it knows about verification, tokens, assets) → `features/verification/...`
- **Yes** (it's a generic Button, a generic useDebounce, a generic fetch wrapper) → root-level shared folder (`components/ui/`, `hooks/`, `lib/`)

When in doubt, default to the feature folder. It's easier to promote a file to shared later than to untangle a shared file that quietly grew feature-specific logic.

## Testing conventions

- Test location mirrors source location, under `__tests__/{unit,integration,e2e}/`.
- **Unit**: pure functions and isolated logic — `validateQrPayload.ts`, `verificationMachine.ts` transitions.
- **Integration**: anything touching the API client or store together — `lib/api/verification.ts` against `mocks/`.
- **E2E**: full user flow — scan/link → loading → verified or error.
- Every new component that has a loading/success/error state must have a corresponding test covering all three states — this project treats error states as first-class, not an afterthought.

## API & state rules (don't deviate without asking)

- **Never** call `fetch` directly from a component. All backend calls go through `lib/api/verification.ts`.
- **Never** hardcode a secret, token, or internal URL in client code. Assume every route is publicly reachable.
- State must flow through the state machine in `features/verification/state/verificationMachine.ts` — no scattered `useState` booleans for loading/error across screens. If a new screen needs status, it reads from this machine.
- Prefer React Context + `useReducer`, or Zustand only if state must be read from multiple unrelated components. Don't reach for Redux Toolkit/RTK Query for this feature unless the squad has explicitly decided otherwise — see `store/` only if that decision has been made.

## Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities/logic: `camelCase.ts`
- Types: `camelCase.types.ts`
- Route folders (App Router): lowercase, matches URL segment (`scan/`, `[token]/`, `result/`)

## Before creating a new top-level folder

Don't. If something doesn't fit the table above, it likely belongs inside an existing folder — ask first rather than introducing a new top-level directory that fragments the structure documented in `docs/`.
