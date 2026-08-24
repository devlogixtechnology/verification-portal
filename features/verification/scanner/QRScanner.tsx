"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        // Stop stream immediately — Html5Qrcode will create its own stream
        stream.getTracks().forEach((track) => track.stop());
        setPermissionState("granted");

        // Enumerate devices
        Html5Qrcode.getCameras()
          .then((devices) => {
            if (devices && devices.length > 0) {
              setCameras(devices);
              // Pick back/environment camera if available
              const backCam = devices.find(
                (d) =>
                  d.label.toLowerCase().includes("back") ||
                  d.label.toLowerCase().includes("environment") ||
                  d.label.toLowerCase().includes("rear")
              );
              setActiveCameraId(backCam ? backCam.id : devices[0].id);
            }
          })
          .catch(() => {
            // Devices could not be enumerated, but camera might still work
          });
      })
      .catch((err: unknown) => {
        console.warn("Camera permission denied or unavailable:", err);
        setPermissionState("denied");
      });
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
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isMounted) return;
            const token = extractTokenFromInput(decodedText);

            if (token && validateTokenFormat(token)) {
              onScanSuccess(token);
              // Stop camera once verified token is obtained
              if (isScanningRef.current) {
                isScanningRef.current = false;
                scanner.stop().catch(() => {});
              }
            } else {
              if (onInvalidToken) onInvalidToken(decodedText);
            }
          },
          (errorMessage) => {
            if (onScanFailure) onScanFailure(errorMessage);
          }
        );
        isScanningRef.current = true;
      } catch (err) {
        console.warn("Failed to start html5-qrcode scanner:", err);
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
            scannerInstanceRef.current?.clear();
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
      <Card className="p-8 text-center sm:p-12">
        <Spinner size="lg" label="Requesting camera access..." />
        <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
          Requesting Camera Access
        </h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Please allow camera permission in your browser to scan QR codes.
        </p>
      </Card>
    );
  }

  // State: Denied or Unsupported Camera
  if (permissionState === "denied" || permissionState === "unsupported") {
    return (
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-danger-bg)] text-[var(--status-danger)]">
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

          <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">
            {permissionState === "denied"
              ? "Camera Access Denied"
              : "Camera Not Supported"}
          </h3>

          <p className="mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            {permissionState === "denied"
              ? "Camera permission was blocked. You can still verify any asset by entering the code manually below."
              : "Your device or browser does not support camera capture. Please enter the verification code manually."}
          </p>

          <form onSubmit={handleManualSubmit} className="mt-6 w-full max-w-md space-y-4">
            <Input
              label="Verification Code"
              placeholder="e.g. CERT-2026-001"
              value={manualInput}
              onChange={(e) => {
                setManualInput(e.target.value);
                if (manualError) setManualError("");
              }}
              errorMessage={manualError || undefined}
            />

            <Button type="submit" variant="primary" className="w-full">
              Verify Document
            </Button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Quick Demo Codes
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onScanSuccess("CERT-2026-001")}
              >
                Sample Valid Cert
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onScanSuccess("CERT-EXPIRED-002")}
              >
                Sample Expired Cert
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onScanSuccess("CERT-REVOKED-003")}
              >
                Sample Revoked Cert
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // State: Granted (Active Camera Viewfinder)
  return (
    <Card className="overflow-hidden">
      <div className="relative flex min-h-[340px] flex-col items-center justify-center bg-black">
        {/* html5-qrcode target mount */}
        <div id={qrRegionId} className="w-full max-w-sm overflow-hidden" />

        {/* Viewfinder Target Frame Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-60 w-60 rounded-2xl border-2 border-[var(--brand-teal)] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
            <span className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-[var(--brand-teal)] rounded-tl" />
            <span className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-[var(--brand-teal)] rounded-tr" />
            <span className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-[var(--brand-teal)] rounded-bl" />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-[var(--brand-teal)] rounded-br" />
          </div>
        </div>

        {/* Camera Switcher (if multiple cameras detected) */}
        {cameras.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={handleCameraToggle}
              className="rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80 transition"
              title="Switch Camera"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <p className="text-center text-xs font-medium text-[var(--muted-foreground)]">
          Align the QR code within the frame to verify automatically.
        </p>

        {/* Demo Simulation Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--border-subtle)] pt-4">
          <span className="text-xs text-[var(--muted-foreground)]">Test Simulation:</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onScanSuccess("CERT-2026-001")}
          >
            Simulate Valid Code
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onScanSuccess("CERT-EXPIRED-002")}
          >
            Simulate Expired
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}