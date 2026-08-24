"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  extractTokenFromInput,
  validateTokenFormat,
} from "../config/verification.config";

export interface QRScannerProps {
  onScanSuccess: (decodedToken: string) => void;
  onScanFailure?: (error: string) => void;
  onInvalidToken?: (rawText: string) => void;
}

export default function QRScanner({
  onScanSuccess,
  onScanFailure,
  onInvalidToken,
}: QRScannerProps) {
  const qrRegionId = "qr-video-region";
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  // Lazy-initialize permission status to avoid calling setState directly in effect
  const [permissionState, setPermissionState] = useState<
    "checking" | "granted" | "denied" | "unsupported"
  >(() => {
    if (typeof window === "undefined") return "checking";
    if (!navigator?.mediaDevices?.getUserMedia) return "unsupported";
    return "checking";
  });

  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState("");

  // Check camera support and request permission
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    let isMounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        // Stop stream immediately — Html5Qrcode will create its own managed stream
        stream.getTracks().forEach((track) => track.stop());
        if (!isMounted) return;
        setPermissionState("granted");

        // Enumerate devices
        Html5Qrcode.getCameras()
          .then((devices) => {
            if (!isMounted || !devices || devices.length === 0) return;
            setCameras(devices);
            const backCam = devices.find(
              (d) =>
                d.label.toLowerCase().includes("back") ||
                d.label.toLowerCase().includes("environment") ||
                d.label.toLowerCase().includes("rear")
            );
            setActiveCameraId(backCam ? backCam.id : devices[0].id);
          })
          .catch(() => {
            // Devices could not be enumerated, but camera might still work
          });
      })
      .catch((err: unknown) => {
        console.warn("Camera permission denied or unavailable:", err);
        if (isMounted) setPermissionState("denied");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize and start scanner when granted
  useEffect(() => {
    if (permissionState !== "granted") return;

    let isMounted = true;
    const scanner = new Html5Qrcode(qrRegionId);
    scannerInstanceRef.current = scanner;

    const startScanner = async () => {
      try {
        const cameraConfig = activeCameraId
          ? { deviceId: { exact: activeCameraId } }
          : { facingMode: "environment" };

        await scanner.start(
          cameraConfig,
          {
            fps: 12,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isMounted) return;
            const token = extractTokenFromInput(decodedText);

            if (token && validateTokenFormat(token)) {
              // Gracefully stop camera before triggering parent navigation to prevent AbortError
              if (isScanningRef.current) {
                isScanningRef.current = false;
                scanner
                  .stop()
                  .catch(() => {})
                  .finally(() => {
                    if (isMounted) onScanSuccess(token);
                  });
              } else {
                onScanSuccess(token);
              }
            } else {
              if (onInvalidToken) onInvalidToken(decodedText);
            }
          },
          (errorMessage) => {
            if (onScanFailure) onScanFailure(errorMessage);
          }
        );
        if (isMounted) {
          isScanningRef.current = true;
        }
      } catch (err: unknown) {
        // Silently ignore browser AbortError / Play interrupted during component transitions
        const msg = String(err);
        if (!msg.includes("AbortError") && !msg.includes("play()")) {
          console.warn("Camera scanner start notice:", err);
        }
      }
    };

    void startScanner();

    return () => {
      isMounted = false;
      if (scannerInstanceRef.current && isScanningRef.current) {
        isScanningRef.current = false;
        scannerInstanceRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scannerInstanceRef.current?.clear();
            } catch {}
          });
      }
    };
  }, [permissionState, activeCameraId, onScanSuccess, onScanFailure, onInvalidToken]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = extractTokenFromInput(manualInput);
    if (!token || !validateTokenFormat(token)) {
      setManualError("Please enter a valid verification code (e.g. CERT-2026-001).");
      if (onInvalidToken) onInvalidToken(manualInput);
      return;
    }

    setManualError("");
    onScanSuccess(token);
  };

  const handleCameraToggle = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === activeCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setActiveCameraId(cameras[nextIndex].id);
  };

  // State: Checking Camera
  if (permissionState === "checking") {
    return (
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 text-center sm:p-12 shadow-xs">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-[var(--brand-teal)] border-t-transparent" />
        <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
          Requesting Camera Access
        </h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Please allow camera permissions in your browser to scan QR codes.
        </p>
      </div>
    );
  }

  // State: Denied or Unsupported Camera
  if (permissionState === "denied" || permissionState === "unsupported") {
    return (
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--status-danger-bg)] text-[var(--status-danger)]">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">
            {permissionState === "denied"
              ? "Camera Access Denied"
              : "Camera Not Supported"}
          </h3>

          <p className="mt-2 max-w-sm text-xs text-[var(--text-secondary)] leading-relaxed">
            {permissionState === "denied"
              ? "Camera permission was blocked. You can still verify any asset by entering the code manually below."
              : "Your device or browser does not support camera capture. Please enter the verification code manually."}
          </p>

          <form onSubmit={handleManualSubmit} className="mt-6 w-full max-w-sm space-y-3">
            <input
              type="text"
              placeholder="e.g. CERT-2026-001"
              value={manualInput}
              onChange={(e) => {
                setManualInput(e.target.value);
                if (manualError) setManualError("");
              }}
              className={`w-full rounded-2xl border bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] ${
                manualError ? "border-[var(--status-danger)]" : "border-[var(--border-default)]"
              }`}
            />

            {manualError && (
              <p className="text-xs text-[var(--status-danger)] font-medium text-left">
                {manualError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--brand-teal)] py-3 text-sm font-bold text-white shadow-xs hover:bg-[var(--brand-teal-hover)] transition active:scale-98"
            >
              Verify Document
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-8 border-t border-[var(--border-subtle)] pt-5 w-full max-w-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
              Quick Test Presets
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                type="button"
                onClick={() => onScanSuccess("CERT-2026-001")}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)] transition"
              >
                Sample Valid
              </button>
              <button
                type="button"
                onClick={() => onScanSuccess("CERT-EXPIRED-002")}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)] transition"
              >
                Sample Expired
              </button>
              <button
                type="button"
                onClick={() => onScanSuccess("CERT-REVOKED-003")}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)] transition"
              >
                Sample Revoked
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State: Granted (Active Camera Viewfinder)
  return (
    <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden shadow-xs">
      <div className="relative flex min-h-[320px] flex-col items-center justify-center bg-black">
        {/* html5-qrcode target mount */}
        <div id={qrRegionId} className="w-full max-w-sm overflow-hidden" />

        {/* Viewfinder Target Frame Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-56 w-56 rounded-3xl border-2 border-[var(--brand-teal)] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
            <span className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-[var(--brand-teal)] rounded-tl-xl" />
            <span className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-[var(--brand-teal)] rounded-tr-xl" />
            <span className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-[var(--brand-teal)] rounded-bl-xl" />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-[var(--brand-teal)] rounded-br-xl" />
            {/* Animated Laser Guide */}
            <div className="absolute left-2 right-2 h-0.5 bg-[var(--brand-teal)] shadow-[0_0_8px_#0acab7] animate-laser-scan" />
          </div>
        </div>

        {/* Camera Switcher (if multiple cameras detected) */}
        {cameras.length > 1 && (
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={handleCameraToggle}
              className="rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80 transition"
              title="Switch Camera"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-center text-xs font-medium text-[var(--text-secondary)]">
          Align the QR code within the frame to verify automatically.
        </p>

        {/* Demo Simulation Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 border-t border-[var(--border-subtle)] pt-3">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Test Presets:</span>
          <button
            type="button"
            onClick={() => onScanSuccess("CERT-2026-001")}
            className="rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-teal-dark)] hover:bg-[var(--brand-teal-light)] transition"
          >
            Valid Code
          </button>
          <button
            type="button"
            onClick={() => onScanSuccess("CERT-EXPIRED-002")}
            className="rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--status-warning)] hover:bg-amber-50 transition"
          >
            Expired Code
          </button>
          <button
            type="button"
            onClick={() => onScanSuccess("CERT-REVOKED-003")}
            className="rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--status-danger)] hover:bg-red-50 transition"
          >
            Revoked Code
          </button>
        </div>
      </div>
    </div>
  );
}