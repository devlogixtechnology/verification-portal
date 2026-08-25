"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraPermission =
  /** Still working out what the browser will allow. */
  | "checking"
  /** Access already granted — the camera can open without a prompt. */
  | "granted"
  /** Not granted yet; asking will show the browser's prompt. */
  | "prompt"
  /** Explicitly blocked. Asking again will not show a prompt. */
  | "denied"
  /** No camera API at all. */
  | "unsupported";

export interface UseCameraPermissionOptions {
  /**
   * Ask for access as soon as the hook mounts. Use on a screen the user opened
   * to scan; leave off anywhere the prompt would be unexpected.
   */
  requestOnMount?: boolean;
}

export interface UseCameraPermissionResult {
  permission: CameraPermission;
  /** Triggers the browser prompt. Resolves to true when access was granted. */
  request: () => Promise<boolean>;
}

function readSupport(): CameraPermission {
  if (typeof window === "undefined") return "checking";
  if (!navigator?.mediaDevices?.getUserMedia) return "unsupported";
  return "checking";
}

/**
 * Reports whether the camera can be used, and asks for it on demand.
 *
 * The initial read goes through the Permissions API, which does **not** show a
 * prompt — so a screen can label its own button ("Begin scan" vs "Allow
 * camera") before the user commits to anything. Browsers without that API
 * report `"prompt"`, which is the safe assumption.
 */
export function useCameraPermission({
  requestOnMount = false,
}: UseCameraPermissionOptions = {}): UseCameraPermissionResult {
  const [permission, setPermission] = useState<CameraPermission>(readSupport);
  const requestingRef = useRef<Promise<boolean> | null>(null);

  const request = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermission("unsupported");
      return false;
    }

    // Concurrent callers share one prompt.
    if (requestingRef.current) return requestingRef.current;

    const pending = navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        // The scanner opens its own managed stream; release this probe.
        stream.getTracks().forEach((track) => track.stop());
        setPermission("granted");
        return true;
      })
      .catch(() => {
        setPermission("denied");
        return false;
      })
      .finally(() => {
        requestingRef.current = null;
      });

    requestingRef.current = pending;
    return pending;
  }, []);

  // Passive read: never prompts. Settles from async callbacks so no state is
  // written synchronously during the effect.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // The lazy initialiser already reports "unsupported" on the client.
    if (!navigator.mediaDevices?.getUserMedia) return;

    let active = true;
    let status: PermissionStatus | undefined;

    const settle = (state: CameraPermission) => {
      if (!active) return;
      setPermission(state);
      // Screens whose whole purpose is the camera can opt into asking straight
      // away; everywhere else the user presses a button first.
      if (requestOnMount && state === "prompt") void request();
    };

    const onChange = () => {
      if (status) settle(status.state as CameraPermission);
    };

    const query = navigator.permissions?.query?.bind(navigator.permissions);

    if (!query) {
      // Firefox and Safari have no camera permission descriptor; assume asking
      // is required.
      void Promise.resolve().then(() => settle("prompt"));
      return () => {
        active = false;
      };
    }

    void query({ name: "camera" as PermissionName })
      .then((result) => {
        status = result;
        settle(result.state as CameraPermission);
        result.addEventListener("change", onChange);
      })
      .catch(() => settle("prompt"));

    return () => {
      active = false;
      status?.removeEventListener("change", onChange);
    };
  }, [requestOnMount, request]);

  return { permission, request };
}
