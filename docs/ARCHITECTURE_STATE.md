# Epic 3: Verification Routing & State Management Specification

This document defines the coordination rules between the Next.js file-system router and the RTK Query / Zustand state slices for Squad Nova's verification portal.

## 1. App Router Navigation Mapping

Every path segment is isolated to keep public verification pages separate from internal dashboard logic.

| Route Path          | File Path                                | Active State                                 | Purpose                                                                                         |
| ------------------- | ---------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/verify`         | `app/(public)/verify/page.tsx`         | `idle`                                     | Entry point. Prompts the user to scan a QR code or paste a hash token directly.                 |
| `/verify/scan`    | `app/(public)/verify/scan/page.tsx`    | `scanning`                                 | Activates the device camera stream via`html5-qrcode`.                                         |
| `/verify/[token]` | `app/(public)/verify/[token]/page.tsx` | `verifying` → `verified` \| `invalid` | Dynamic deep-link handler. Fires the verification query to backend squad`MERN-BE-A` on mount. |

## 2. Finite State Machine

The application state is a deterministic state machine to prevent race conditions and inconsistent UI across hooks.

```
                ┌────────────┐
        ┌──────▶│    idle    │◀─────────────────┐
        │       └────────────┘                   │
        │              │                          │
        │              ▼                          │
        │       ┌────────────┐                    │
        │       │  scanning  │                    │
        │       └────────────┘                    │
        │              │                          │
        │              ▼                          │
        │       ┌────────────┐                    │
        │       │ verifying  │────────────────────┤
        │       └────────────┘                    │
        │              │                          │
        │     ┌────────┼────────┐                 │
        │     ▼        ▼        ▼                 │
        │ ┌────────┐┌────────┐┌────────┐          │
        │ │verified││invalid ││ error  │──────────┘
        │ └────────┘└────────┘└────────┘   (reset / retry)
        └──────────────────────────────────────────┘
```

### State Definitions

| State         | Description                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idle`      | Uninitialized. Waiting for a scanned token or a direct path redirect.                                                                                 |
| `scanning`  | Camera stream is active and tracking image frames. If permission is denied, the state drops to`error` and reveals the `ManualTokenFallback` form. |
| `verifying` | Asynchronous request to the backend is in progress. The UI renders a skeleton loading state.                                                          |
| `verified`  | The backend returned a valid response. The UI renders the verified asset card.                                                                        |
| `invalid`   | The API returned a`4xx` response — expired token, tampered hash, or missing credentials.                                                           |
| `error`     | Environmental failure — no camera permission, network timeout, or server error.                                                                      |

## 3. RTK Query Integration Pattern

Data actions subscribe to the RTK Query cache rather than maintaining separate local state.

```typescript
// features/verification/hooks/useVerificationActions.ts
import { useVerifyAssetQuery } from '@/store/verification/verificationApi';
import { useVerificationStore } from '@/store/verification/verificationSlice';

export function useVerificationActions(token?: string) {
  // Subscribe to the RTK Query caching hook
  const { data, isLoading, isError, error } = useVerifyAssetQuery(token, {
    skip: !token, // Only run if a token is present
  });

  // Derive the state-machine status from query state
  const getDerivedStatus = () => {
    if (!token) return 'idle';
    if (isLoading) return 'verifying';
    if (isError) {
      return (error as any).status >= 400 && (error as any).status < 500
        ? 'invalid'
        : 'error';
    }
    if (data) return 'verified';
    return 'idle';
  };

  return {
    status: getDerivedStatus(),
    assetData: data,
    errorMessage: error ? (error as any).data?.message : null,
  };
}
```

## 4. Error Boundary Defenses

Every view must treat failure as a first-class state, not an unhandled exception.

1. **Network dropouts** — RTK Query intercepts connection errors and surfaces a "Try Again" action that invalidates the cache to force a refetch.
2. **Camera permission denials** — If `navigator.mediaDevices.getUserMedia` throws, the layout sets status to `error`, unmounts the video track, and renders a fallback numeric token entry screen.
