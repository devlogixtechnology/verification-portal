"use client";

import { useCallback, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useVerification } from "../state/useVerification";
import { useCameraPermission } from "./useCameraPermission";
import { useQrScanner } from "./useQrScanner";
import { ScannerViewfinder } from "./ScannerViewfinder";
import { ManualTokenFallback } from "./ManualTokenFallback";
import { ScannerPresets, type ScannerPreset } from "./ScannerPresets";

const QR_REGION_ID = "vf-qr-region";

export interface QRScannerProps {
  /**
   * What to do with a decoded token. Defaults to
   * `config.onNavigate({ name: "verify", token })`.
   */
  onScanSuccess?: (token: string) => void;
  /** Called when a code is read but is not a token this project recognises. */
  onInvalidToken?: (rawText: string) => void;
  /** Optional shortcut buttons for demoing without a physical code. */
  presets?: ScannerPreset[];
}

/**
 * The scan screen. Requests the camera, runs the decoder, and falls back to
 * keyboard entry when the camera is unavailable.
 */
export function QRScanner({
  onScanSuccess,
  onInvalidToken,
  presets = [],
}: QRScannerProps): ReactElement {
  const router = useRouter();
  const { config } = useVerification();
  const { permission } = useCameraPermission({ requestOnMount: true });

  const acceptToken = useCallback(
    (token: string) => {
      if (onScanSuccess) {
        onScanSuccess(token);
      } else if (config.onNavigate) {
        config.onNavigate({ name: "verify", token });
      } else {
        router.push(`/verify/${encodeURIComponent(token)}`);
      }
    },
    [onScanSuccess, config, router]
  );

  const handleDecode = useCallback(
    (decodedText: string) => {
      const token = config.parseToken ? config.parseToken(decodedText) : decodedText;

      if (token && (!config.isValidTokenFormat || config.isValidTokenFormat(token))) {
        acceptToken(token);
      } else {
        onInvalidToken?.(decodedText);
      }
    },
    [config, acceptToken, onInvalidToken]
  );

  const { cameras, switchCamera } = useQrScanner({
    enabled: permission === "granted",
    regionId: QR_REGION_ID,
    onDecode: handleDecode,
  });

  if (permission === "checking" || permission === "prompt") {
    return (
      <div className="vf-card vf-screen vf-screen--centered" role="status">
        <h2 className="vf-title vf-title--small">Requesting camera access</h2>
        <p className="vf-text vf-text--muted">
          Allow camera permission in your browser to scan a QR code.
        </p>
      </div>
    );
  }

  if (permission === "denied" || permission === "unsupported") {
    return (
      <div className="vf-screen">
        <ManualTokenFallback
          title={
            permission === "denied" ? "Camera access denied" : "Camera not supported"
          }
          description={
            permission === "denied"
              ? "Camera permission was blocked. You can still verify any asset by entering its code below."
              : "This device or browser cannot capture video. Please enter the verification code below."
          }
          onSubmitToken={acceptToken}
        />
        <ScannerPresets presets={presets} onSelect={acceptToken} />
      </div>
    );
  }

  return (
    <div className="vf-screen">
      <ScannerViewfinder
        regionId={QR_REGION_ID}
        canSwitchCamera={cameras.length > 1}
        onSwitchCamera={switchCamera}
      />
      <ScannerPresets presets={presets} onSelect={acceptToken} />
    </div>
  );
}

export default QRScanner;
