# Folder Structure

The organising rule: **anything that knows about a specific backend, brand, or
URL lives outside `features/verification/`.** The module stays generic; the app
supplies the specifics through one config object.

## The module

```
features/verification/
├── index.ts                        public API — import from here, not deep paths
├── README.md                       the contract for a consuming project
├── types/verification.types.ts     config contract, state, outcomes, routes
├── state/
│   ├── verificationMachine.ts      pure reducer + actions
│   ├── VerificationProvider.tsx    context, config required
│   └── useVerification.ts          reads { state, dispatch, config }
├── api/
│   ├── client.ts                   fetch, 10s timeout, GET-only retry
│   ├── errors.ts                   status/network classification + copy
│   └── verification.ts             verifyToken pipeline
├── hooks/useSubmitToken.ts         parse → validate → request → dispatch
├── components/
│   ├── VerificationView.tsx        the seam: status → config.render*
│   ├── TokenEntryView.tsx          entry screen
│   ├── LoadingPulse.tsx            in-flight screen
│   ├── NetworkErrorView.tsx        error screen
│   └── InvalidResultView.tsx       default rejection screen
├── scanner/
│   ├── QRScanner.tsx               orchestrator
│   ├── useCameraPermission.ts      permission probe
│   ├── useQrScanner.ts             html5-qrcode lifecycle
│   ├── ScannerViewfinder.tsx       live camera frame
│   ├── ManualTokenFallback.tsx     keyboard entry when denied
│   └── ScannerPresets.tsx          project-supplied shortcuts
└── styles/
    ├── tokens.css                  the token contract
    └── verification.css            every class the module renders
```

No file here imports from `app/`, `lib/`, `components/`, or `types/`.

## The app

```
app/
├── page.tsx                        demo index (delete for a real deployment)
├── layout.tsx                      root layout, fonts, globals.css
├── login/page.tsx                  admin login scaffold
└── (demo)/project-{a,b,c}/         the three consumers
    ├── config.tsx                  backend, parser, navigation, renderVerified
    ├── tokens-{a,b,c}.css          theme, scoped by [data-vf-theme]
    ├── layout.tsx                  mounts the provider
    ├── page.tsx, scan/, [token]/   the same three screens

lib/
├── api/verificationEnvelope.ts     the mock backends' envelope + RejectionDetail
└── config/tokenUtils.ts            token parsing and format rules

components/ui/, components/shared/  generic primitives
mock-backend/                       three fake backends, one per port
__tests__/{unit,integration}/       mirror the source paths
```

## One design system

`features/verification/styles/tokens.css` is the only place a colour, size or
rule thickness is decided. Everything else reads from it:

- `app/globals.css` imports the contract, then aliases the older
  `--brand-*` / `--surface-*` names onto it. Those names hold no values of
  their own, so nothing can drift out of step.
- `components/shared/Header` and `Footer` are built from `vf-*` classes.
- Each project's `tokens-{a,b,c}.css` overrides the contract under
  `[data-vf-theme="..."]`, which `ThemeScope` puts on `<html>` — so the app
  bar, footer, page background and module screens all retint together.

Surface roles, in order from back to front: `--verification-surface` is the
page, `--verification-surface-muted` is recessed, and
`--verification-surface-elevated` is what cards and inputs sit on. Elevated
must be lighter than the page, or every card reads as a hole in it.

## Where new files go

| Creating | Put it in |
| --- | --- |
| A route | `app/(demo)/...`, or your own route group |
| Something the module needs and no project can customise | `features/verification/` |
| A backend response shape | `lib/api/` |
| A project's config | that project's folder |
| A project's asset schema | that project's `config.tsx` |
| A project's result screen | that project's folder |
| A generic button, card, badge | `components/ui/` |
| A test | mirror the source path under `__tests__/` |

## Naming

Components `PascalCase.tsx`, hooks `useCamelCase.ts`, logic `camelCase.ts`,
types `camelCase.types.ts`, route folders lowercase matching the URL segment.
