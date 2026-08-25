# Verification Portal

A QR / token asset verification flow, built once and reused across projects.

The whole point: **`features/verification/` never changes.** A project adapts it
by writing one config object — which backend to call, what its answers mean,
where to navigate, and what a result looks like. Everything else is already done.

This repo proves it. Four projects use the same module against four different
backends, with four asset shapes and four themes, and none of them edit a file
inside it.

---

## Run it

Two terminals.

```bash
# 1 — the demo backends (ports 4001, 4002, 4003)
cd mock-backend
npm install
npm start

# 2 — the app
npm install
npm run dev
```

Open <http://localhost:3000>.

---

## Try it

Paste any of these codes into a project's entry screen, or scan a QR that
encodes one.

| Project | Backend | Valid | Rejected |
| --- | --- | --- | --- |
| [Aurora Legal](http://localhost:3000/project-a) | `:4001` | `DOC-1001` | `DOC-1002` — expired |
| [Northwind Academy](http://localhost:3000/project-b) | `:4002` | `CERT-2001` | `CERT-2002` — revoked |
| [Meridian Delivery](http://localhost:3000/project-c) | `:4003` | `HANDOFF-3001`, `CONTRACT-4001` | `HANDOFF-3002`, `CONTRACT-4002` |

Any unrecognised code is rejected. These three work on every backend:

| Code | What it tests |
| --- | --- |
| `SERVER-ERROR-TEST` | Server fault → error screen with a retry |
| `MALFORMED-TEST` | Unreadable response → error screen |
| `TIMEOUT-TEST` | No response at all. Takes ~20s: a 10s timeout, then one retry |

`/verify` is the production route. It points at the real service and needs
`NEXT_PUBLIC_VERIFICATION_API_URL` set — see [Going live](#going-live).

---

## How it works

```
        THE MODULE                              YOUR PROJECT
   features/verification/

   Scan or type a code
            │
            ▼
     Parse the input       ─────────────▶   parseToken
            │
            ▼
     Check its format      ─────────────▶   isValidTokenFormat
            │
            ▼
     Send the request      ─────────────▶   buildVerificationRequest
            │
            ▼
     Handle the network         (network, timeout, 5xx — the module decides)
            │
            ▼
     Read the answer       ─────────────▶   parseVerificationResponse
            │
            ▼
     Show the result       ─────────────▶   renderVerified / renderInvalid
```

The module owns the left column in every project. The right column is the config
object, and it is the only thing that differs between them.

---

## What a project writes

One config object. Four fields are required, the rest have sensible defaults.

```tsx
export const config: VerificationConfig<Certificate, Rejection> = {
  // 1. Where the backend is
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL!,

  // 2. What its answers mean
  parseVerificationResponse: (body) => {
    const res = body as ApiResponse;
    return res.status === "valid"
      ? { outcome: "verified", result: res.certificate }
      : { outcome: "rejected", message: res.message, detail: { reason: res.reason } };
  },

  // 3. Where to send the user
  onNavigate: (route) => {
    if (route.name === "start")   return router.push("/verify");
    if (route.name === "scanner") return router.push("/verify/scan");
    router.push(`/verify/${route.token}`);
  },

  // 4. What a verified asset looks like
  renderVerified: (cert, actions) => (
    <CertificateCard cert={cert} onDone={actions.verifyAnother} />
  ),
};
```

Then mount it and drop in the three screens:

```tsx
// layout            <VerificationProvider config={config}>{children}</VerificationProvider>
// /verify           <TokenEntryView />
// /verify/scan      <QRScanner />
// /verify/[token]   <VerificationView token={token} />
```

That is the entire integration. Types flow from the config, so `state.result` is
typed everywhere below the provider.

The full field list, the theming contract and the CSS class kit are in
[`features/verification/README.md`](features/verification/README.md) — the
module's own reference, which travels with the folder if you copy it elsewhere.

---

## Mock and real, side by side

The demo projects and the production route use the **same module, the same
screens and the same styling**. Only the config differs, and only in three
places:

| | Demo projects | Production |
| --- | --- | --- |
| Config lives in | `app/(demo)/project-*/config.tsx` | `lib/config/verification.config.tsx` |
| `apiBaseUrl` | A localhost port | `NEXT_PUBLIC_VERIFICATION_API_URL` |
| `buildVerificationRequest` | A `GET` with the token in the path | A `POST` with a JSON body |
| `parseVerificationResponse` | A shared envelope helper | Its own contract file |
| Everything else | — identical — | — identical — |

That is the portability claim in one table. Moving to a different backend is a
new config file, not a rewrite. The production one is split in two so the
mapping can be tested on its own:

- `lib/config/verification.contract.ts` — request shape, response shape, and the
  mapping between them. Pure, no React, unit-tested.
- `lib/config/verification.config.tsx` — the wiring that hands those to the module.

---

## Add your own project

1. **Config** — `apiBaseUrl`, `parseVerificationResponse`, `onNavigate`,
   `renderVerified`.
2. **Result screen** — build it from the `vf-*` classes so it matches the
   screens around it.
3. **Theme** *(optional)* — a CSS file overriding
   `--verification-*` tokens.
4. **Routes** — a layout that mounts the provider, plus the three one-line pages.

Nothing inside `features/verification/`. If you find yourself editing the module
to make a project work, that is a gap in the config contract — worth raising
rather than patching around.

`app/(demo)/project-a/` is the smallest complete example: six files, ~260 lines.

---

## Going live

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_VERIFICATION_API_URL to the real origin
```

Until that is set, `/verify` points at a placeholder and every verification
reports a failure. The demo projects are unaffected — they hardcode their
localhost ports on purpose.

---

## Layout

```
features/verification/     the module — knows nothing about any project
├── types/                 the config contract
├── state/                 pure reducer, provider, hook
├── api/                   transport, error classification, verifyToken
├── hooks/                 useSubmitToken
├── components/            entry, loading, failure, and the render seam
├── scanner/               camera permission, decoder, viewfinder, fallback
└── styles/                design tokens + the stylesheet that reads them

lib/config/                production config + the backend contract
components/verification/   production result screens
app/(public)/verify/       production routes
app/(demo)/project-{a,b,c} three demo consumers, one folder each
mock-backend/              three fake backends, one per port
__tests__/                 mirrors the source paths
```

**The rule:** anything that knows about a specific backend, brand or URL lives
outside `features/verification/`.

---

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build, typechecked |
| `npm test` | Compiles the test graph, runs it against real source |
| `npm run lint` | ESLint |

Tests cover the state machine's transitions, the token rules, the whole request
pipeline against stubbed responses, and the production response mapping.

---

## Stripping the demo

A real deployment has one project, not four:

1. Delete `app/page.tsx` — it only lists the demos.
2. Delete `app/(demo)/` and `mock-backend/`.
3. Keep `app/(public)/verify/` and point it at the real backend.

`features/verification/`, `lib/` and the styles are untouched by all three.

---

## Known gaps

- **Theme fonts are not loaded.** `Unbounded` and `Albert Sans` are named in the
  tokens but nothing fetches them, so headings fall back to a system face.
- **No browser-level test.** `__tests__/e2e/` is empty; the click-through is
  verified by hand.
- **`/login`** is an unstyled scaffold with no backend behind it. See
  [`docs/Workflow.md`](docs/Workflow.md) for its open scope questions.
