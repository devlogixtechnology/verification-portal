
# Verification Portal — Project Workflow & Task Roadmap

**Owner:** Haris (Repo Master, Squad Nova)
**Epic:** Epic 3 — End-User Verification Portal (Squad Nova)
**Repo:** `devlogixtechnology/verification-portal`

> Sourced from `Squad_Nova_Technical_Implementation_Brief.pdf` and
> `TECHNICAL_SPECIFICATION.pdf`. Where I didn't have confirmed details,
> it's marked **[NEEDS CONFIRMATION]** below — fill in and I'll update this doc.

---

## 1. What's Confirmed vs. What You Need to Give Me

### Confirmed from the technical brief (Squad Nova, Epic 3)

- 4 core tasks: State Management & Routing, QR Scanner, Verification Dashboard UI, API Integration & Error Handling
- 2 public verification endpoints per the brief: `POST /api/verify/qr-code`, `POST /api/verify/reference` — **the mock backends currently expose `GET /verify/:token` instead; swapping to the real shape is a one-line change to `buildVerificationRequest`**
- 4 admin document CRUD endpoints: `POST/GET/PUT /api/documents`, `GET /api/documents/:id`
- Auth endpoints (from `TECHNICAL_SPECIFICATION.pdf` §4.3): `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh` — all JWT-based, no auth required to hit register/login themselves

### **[NEEDS CONFIRMATION FROM YOU]**

- Is the admin login/signup task **officially assigned to you** by your PH, or are you adding it because you noticed it's missing? (Matters for how you scope and report it.)
- Who else, if anyone, is touching `/auth/*` integration — is this solely yours or shared with Squad A's stated login flow?
- Does `role: "user"` vs `role: "admin"` vs `role: "issuer"` in the register payload mean **anyone can self-register as admin**, or is admin role assigned separately (e.g. by an existing admin, or seeded manually)? This changes whether you build a public signup page or an invite-only one.
- Exact due date/estimate for the login/signup task (the brief's 4 tasks have set estimates; this one doesn't, since it's not in the original brief).

---

## 2. Full Task List (in build order)

| # | Task                             | Depends On                      | Owner(s) per brief            | Est.            |
| - | -------------------------------- | ------------------------------- | ----------------------------- | --------------- |
| 1 | State Management & Routing Plan  | none                            | MH, MF                        | 8h (Aug 17–18) |
| 2 | QR Scanner Implementation        | Task 1                          | HJ, HW                        | 8h (Aug 19)     |
| 3 | Verification Dashboard UI        | Task 1                          | HJ, HW                        | 10h (Aug 20)    |
| 4 | Admin Login / Signup Pages       | none (can run parallel to 2–3) | You*(added, confirm scope)* | TBD             |
| 5 | API Integration & Error Handling | Tasks 1–4                      | MF, MH                        | 5h (Aug 21)     |

Tasks 2 and 3 can run in parallel once Task 1 lands. Task 4 (login/signup) has no hard dependency on the others and can be built any time — but Task 5 needs it done first, since API integration wires auth into everything.

---

## 3. Step-by-Step Workflow

### Phase 0 — Setup (done)

- [X] Feature-based folder structure established
- [X] `CLAUDE.md`, `folder-structure.md`, `routing-state-plan.md`, `README.md` scaffolded
- [X] RTK Query pattern drafted (`verificationApi.ts`)

### Phase 1 — State Management & Routing (foundation)

- [X] Map every route explicitly: `/verify`, `/verify/scan`, `/verify/[token]` (no `/result` route — the token page renders the outcome directly)
- [X] Define state machine: `idle → verifying → verified | invalid | error` (no `scanning` state — the camera is local UI inside `QRScanner`, and a scan just produces a token)
- [X] Decide state tool: **React Context + useReducer**. RTK Query was dropped — the portal holds one short-lived verification at a time, needs no cross-route cache, and the module must not force a store on a consuming project. `store/` was removed.
- [X] Document routing + state plan as a short reference doc — `docs/ARCHITECTURE_STATE.md`
- [ ] Review with squad before Tasks 2–4 begin

### Phase 2 — QR Scanner (parallel with Phase 3)

- [X] Integrate `html5-qrcode`
- [X] Camera permission request + denial fallback — `useCameraPermission` + `ManualTokenFallback`
- [X] Validate decoded payload format before sending to backend — via `config.parseToken` / `isValidTokenFormat`
- [X] Stop camera stream on capture/navigation away — `useQrScanner` teardown
- [X] Ship as self-contained reusable component — `QRScanner`, split into permission/lifecycle/viewfinder/fallback parts

### Phase 3 — Verification Dashboard UI (parallel with Phase 2)

- [X] Reference `verify.devlogix.online` for layout/hierarchy
- [X] Render only backend-returned fields — the result screen is supplied by the project as `config.renderVerified`
- [X] Build as composable pieces — `vf-metric-card`, `vf-detail-row` and friends in `styles/verification.css`
- [X] Distinct "verified" badge/indicator
- [X] Graceful handling of partial/empty metadata

### Phase 4 — Admin Login / Signup **[your addition — confirm scope first]**

- [ ] Confirm open questions in Section 1 before building
- [ ] Build `/admin/login` page → `POST /auth/login`
- [ ] Build `/admin/register` page (if self-signup is actually intended) → `POST /auth/register`
- [ ] Store JWT + `sessionId` (check with Squad A where this should live — cookie vs. local state — given the brief's "no secrets/tokens in client-side logs" rule)
- [ ] Wire `POST /auth/logout` and `POST /auth/refresh` for session handling
- [ ] Route-guard the admin panel so `/admin/*` redirects to login when unauthenticated

### Phase 5 — API Integration & Error Handling (final wiring)

- [X] Centralize all calls — `features/verification/api/`; no component calls `fetch`
- [ ] Attach JWT via `Authorization: Bearer <token>` for authenticated calls (admin CRUD) — not needed for public verification; `buildVerificationRequest` already accepts headers
- [X] Distinguish error types: network/timeout → `error`, 4xx → the project's parser → `invalid`, 5xx → `error`
- [X] Bounded retry: one automatic retry on `GET` (never on `POST`), then a manual Retry action
- [X] Route loading/error state through the state machine, not per-screen flags

### Phase 6 — Submission Checklist (from brief §6)

- [X] TypeScript types defined for all API request/response shapes
- [X] Loading, success, error states visually distinct on every screen
- [X] No hardcoded secrets/tokens/internal URLs in client code
- [ ] Shared components documented in Storybook
- [X] Camera denial + malformed QR both have working fallback
- [ ] Routing/state plan was reviewed by squad before implementation

---

## 4. Git Workflow (how PRs flow through this roadmap)

1. Each phase/task above = its own feature branch (`feature/qr-scanner`, `feature/admin-login`, etc.)
2. Branch off `main`, PR back into `main`, review via worktree before merging (your existing process)
3. Since Phase 1 (state/routing) is the foundation, get that merged into `main` **first** — Phases 2–4 branches should be created *after* Phase 1 merges, or synced with `git merge origin/main` before opening their PRs, to avoid the conflict/duplication issues discussed earlier
4. Phase 5 (API integration) branches last, off a `main` that already has Phases 1–4 merged

---

## 5. Open Items to Resolve With Your PH / Squad A

- [ ] Confirm login/signup is actually in your scope (vs. assumed)
- [ ] Confirm admin role assignment mechanism (self-registration vs. invite-only)
- [ ] Confirm exact error response shape for `/verify/qr-code` and `/verify/reference` on not-found/expired/revoked cases (not shown in the integration guide example)
- [ ] Confirm where JWT should be stored client-side (cookie/httpOnly vs. memory/state)

---

*Once you confirm the items above, I can update this doc and also generate the actual routing diagram / state machine as a visual.*
