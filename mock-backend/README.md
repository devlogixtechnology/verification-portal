# Portability Demo — Mock Backends

Three independent fake backends for `features/verification`, one per port.
None of them know about each other — each has its own token table and its
own document shape, on purpose.

## Run it

```bash
npm install
node server.js
```

Starts all three at once:
- Project A → http://localhost:4001
- Project B → http://localhost:4002
- Project C → http://localhost:4003

## Endpoint

```
GET /verify/:token
```

Always responds `200 OK` — the real verdict is in the JSON body's
`verificationStatus` field, never in the HTTP status (except for the
`SERVER-ERROR-TEST` token below, which deliberately breaks that rule).

## Tokens — Project A (port 4001)

| Token | Result |
|---|---|
| `DOC-1001` | valid — verified document (NDA) |
| `DOC-1002` | expired |

## Tokens — Project B (port 4002)

| Token | Result |
|---|---|
| `CERT-2001` | valid — verified certificate |
| `CERT-2002` | revoked |

## Tokens — Project C (port 4003)

| Token | Result |
|---|---|
| `HANDOFF-3001` | valid — verified project handoff |
| `HANDOFF-3002` | expired |
| `CONTRACT-4001` | valid — verified signed contract (different shape than handoff) |
| `CONTRACT-4002` | revoked |

## Failure-simulation tokens (identical on all three ports)

| Token | Behavior |
|---|---|
| `TIMEOUT-TEST` | Server never responds — tests frontend timeout/retry |
| `SERVER-ERROR-TEST` | HTTP 500, empty body — tests generic error fallback |
| `MALFORMED-TEST` | HTTP 200, non-JSON body — tests unparseable-response handling |

## Any other token

Returns:
```json
{
  "success": false,
  "verificationStatus": "invalid",
  "message": "This code does not correspond to a known document"
}
```
