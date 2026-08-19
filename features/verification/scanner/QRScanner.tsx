"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type QRScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  onInvalidToken?: (rawText: string) => void;
};

function isValidToken(text: string): boolean {
  const tokenPattern = /^[a-zA-Z0-9_-]{8,128}$/;
  return tokenPattern.test(text.trim());
}

export default function QRScanner({
  onScanSuccess,
  onScanFailure,
  onInvalidToken,
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // NEW: tracks camera permission state
  const [cameraStatus, setCameraStatus] = useState<
    "checking" | "granted" | "denied"
  >("checking");

  // NEW: holds what the user types in the manual fallback box
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState("");

  useEffect(() => {
    // Step 1: explicitly ask for camera permission BEFORE rendering the scanner
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // We got permission — stop this test stream immediately,
        // html5-qrcode will open its own stream right after
        stream.getTracks().forEach((track) => track.stop());
        setCameraStatus("granted");
      })
      .catch(() => {
        // Denied, or no camera hardware at all
        setCameraStatus("denied");
      });
  }, []);

  useEffect(() => {
    // Only start the actual scanner once permission is confirmed
    if (cameraStatus !== "granted") return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        if (isValidToken(decodedText)) {
          onScanSuccess(decodedText.trim());
          scanner.clear();
        } else {
          if (onInvalidToken) onInvalidToken(decodedText);
        }
      },
      (errorMessage) => {
        if (onScanFailure) onScanFailure(errorMessage);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, [cameraStatus, onScanSuccess, onScanFailure, onInvalidToken]);

  const handleManualSubmit = () => {
    if (isValidToken(manualInput)) {
      setManualError("");
      onScanSuccess(manualInput.trim());
    } else {
      setManualError("That doesn't look like a valid code. Please check and try again.");
      if (onInvalidToken) onInvalidToken(manualInput);
    }
  };

  // --- RENDER ---

  if (cameraStatus === "checking") {
    return <p>Checking camera access...</p>;
  }

  if (cameraStatus === "denied") {
    return (
      <div>
        <p style={{ marginBottom: "1rem" }}>
          Camera access isn't available. You can enter your verification code manually instead:
        </p>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Enter verification code"
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={handleManualSubmit} style={{ padding: "0.5rem 1rem" }}>
          Submit
        </button>
        {manualError && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{manualError}</p>
        )}
      </div>
    );
  }

  // cameraStatus === "granted"
  return <div id="qr-reader" />;
}