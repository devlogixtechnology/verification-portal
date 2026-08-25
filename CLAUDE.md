# CLAUDE.md

Guidance for Claude, or any agent, writing code in this repo. Read this before
creating or moving a file.

This is Squad Nova's Epic 3 — a portable QR / token verification module plus the
projects that consume it. Next.js App Router, TypeScript.

## The one rule

**`features/verification/` must not know about any specific project.**

Anything that knows a backend, a brand, a URL or a document schema lives outside
it. A project adapts the module through one config object — never by editing it.

If you find yourself changing a file inside the module to make a project work,
stop: that is a gap in the config contract, and the fix belongs in
`features/verification/types/verification.types.ts`, not in a workaround.

## Where things go

| Creating | Put it in | Example |
| --- | --- | --- |
| A route | `app/(public)/…` or `app/(demo)/…` | `app/(public)/verify/scan/page.tsx` |
| An authenticated route | `app/(internal)/…` | `app/(internal)/login/page.tsx` |
| Something every project needs and none can customise | `features/verification/` | `components/VerificationView.tsx` |
| A backend's request/response contract | `lib/config/` | `verification.contract.ts` |
| A project's config object | `lib/config/`, or that project's folder | `verification.config.tsx` |
| A project's result screen | `components/verification/` | `VerifiedDocumentCard.tsx` |
| Token parsing, format rules | `lib/config/tokenUtils.ts` | — |
| Truly generic UI, no verification logic | `components/ui/` | `Badge.tsx` |
| Cross-feature hook | `hooks/` | `useDebounce.ts` |
| Cross-feature type | `types/` | shared envelopes |
| A test | mirror the source path under `__tests__/{unit,integration,e2e}/` | — |

Inside the module: `types/` the contract, `state/` the machine and provider,
`api/` transport and error classification, `hooks/`, `components/` the screens,
`scanner/` the camera, `styles/` the design tokens.

**Before adding a top-level folder: don't.** If something doesn't fit above, it
almost certainly belongs inside an existing folder.

## State

- One state machine: `features/verification/state/verificationMachine.ts`. No
  scattered `useState` booleans for loading or error — screens read status from
  `useVerification()`.
- Every transition returns the **complete** state. Spreading the previous one is
  how a stale error survives into a loading screen.
- React Context + `useReducer`. Redux and RTK Query were evaluated and dropped:
  the portal holds one short-lived verification at a time, and the module must
  not force a store on a consuming project.

## API

- **Never** call `fetch` from a component. Everything goes through
  `features/verification/api/`.
- **Never** hardcode a secret, token or internal URL in client code. Every route
  here is publicly reachable.
- The module classifies network failures, timeouts, `5xx` and unreadable bodies.
  A `4xx` with a body goes to the project's `parseVerificationResponse` — only
  the project knows what its own `404` means.
- Failed `GET`s retry once. A `POST` retries only if marked `idempotent`.

## Styling

- `features/verification/styles/tokens.css` is the single source of truth for
  every colour, size and rule width. Everything else reads from it, including
  the legacy `--brand-*` aliases in `app/globals.css`.
- The module ships semantic `vf-*` classes and no utility framework, so it drops
  into a project that doesn't use Tailwind.
- To restyle, override tokens — never edit the components.
- `--verification-surface-elevated` must be lighter than `--verification-surface`.

## Security

Never print the token format in a placeholder or an error message. Enforce it in
`isValidTokenFormat`, which the user never sees.

## Testing

- Mirror the source path under `__tests__/{unit,integration,e2e}/`.
- **Unit** — pure logic: the reducer's transitions, token rules, response mapping.
- **Integration** — the request pipeline against stubbed responses.
- Tests import real source. Never inline a copy of the thing under test.
- Any component with loading / success / error states needs all three covered.
  Error states are first-class here, not an afterthought.

## Naming

Components `PascalCase.tsx` · hooks `useCamelCase.ts` · logic `camelCase.ts` ·
types `camelCase.types.ts` · route folders lowercase, matching the URL segment.

@AGENTS.md
