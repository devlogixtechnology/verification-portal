# End-User Verification Portal (Epic 3)

A portable QR / token asset verification module, plus three demo projects that
prove it travels.

The point of this repository: **`features/verification/` adapts to a new
consuming project through configuration alone.** Three projects here use it
against three independent backends, four different asset shapes, four different
result layouts and three different themes — and none of them edit a file inside
the module.

There is deliberately no DevLogix-branded portal here. We do not have their API
or their document model, so there is nothing to build one against; every project
in this repo runs on a mock backend and is presented as such.

---

## Run it

Two terminals.

```bash
# 1. the three mock backends (ports 4001, 4002, 4003)
cd mock-backend
npm install
npm start

# 2. the portal
npm install
npm run dev
```

Then open <http://localhost:3000> for an index of all four projects.

| Route | Backend | Asset shape | Result layout | Try |
| --- | --- | --- | --- | --- |
| `/project-a` | `:4001` | legal document | preview + divided list | `DOC-1001`, `DOC-1002` |
| `/project-b` | `:4002` | certificate | crest hero + metric grid | `CERT-2001`, `CERT-2002` |
| `/project-c` | `:4003` | handoff **and** contract | grid, or preview + grid + list | `HANDOFF-3001`, `CONTRACT-4001` |

Failure paths work on every port: `SERVER-ERROR-TEST`, `MALFORMED-TEST`,
`TIMEOUT-TEST`, and any unrecognised code.

---

## Layout

```
features/verification/     the portable module — knows nothing about this app
├── types/                 the config contract
├── state/                 pure reducer, provider, hook
├── api/                   transport, error classification, verifyToken
├── hooks/                 useSubmitToken
├── components/            entry, loading, failure, and the render seam
├── scanner/               camera permission, decoder, viewfinder, fallback
└── styles/                token contract + the stylesheet that reads it

lib/api/                   the mock backends' response envelope
lib/config/                token parsing and format rules
app/(demo)/project-{a,b,c} the three consumers, one folder each
app/page.tsx               demo index (delete for a real deployment)
mock-backend/              three fake backends, one per port
```

**The rule:** anything that knows about a specific backend, brand, or URL lives
outside `features/verification/`.

---

## What a new project has to write

Everything a fourth project needs is in one folder — see
`app/(demo)/project-a/` for the smallest complete example:

- a `config.tsx` — backend URL, response parser, navigation, `renderVerified`
- a `tokens-x.css` — its theme
- a `layout.tsx` that mounts `VerificationProvider`
- three one-line pages: `TokenEntryView`, `QRScanner`, `VerificationView`

No changes inside `features/verification/`. That is the acceptance test.

---

## Stripping the demo

A real deployment has one consuming project, not four. To get there:

1. Delete `app/page.tsx` — the index exists only to list the demos.
2. Delete `app/(demo)/` and `mock-backend/`.
3. Keep one project folder, move it to your real route (e.g. `app/(public)/verify/`),
   and point its `apiBaseUrl` at the real backend.
4. Adjust that project's `onNavigate` to the new paths, and rewrite
   `parseVerificationResponse` for the real response envelope.

Nothing else changes. `features/verification/`, `lib/`, and the styles are
untouched by all four steps.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (typechecks) |
| `npm test` | Compiles the test graph and runs it against real source |
| `npm run lint` | ESLint |

Tests cover the state machine's transitions, the token rules, and the full
`verifyToken` pipeline against stubbed responses — including 4xx delegation,
5xx classification, unparseable bodies, lost connections, and message overrides.

---

## Docs

- `features/verification/README.md` — the module's contract. Read this first if
  you are adopting it.
- `docs/ARCHITECTURE_STATE.md` — routes and the state machine.
- `docs/FolderStructureSetup.md` — where files go and why.
- `mock-backend/README.md` — every token and what it returns.
