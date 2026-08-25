"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useVerification } from "../state/useVerification";
import { useCameraPermission } from "../scanner/useCameraPermission";
import { resolveMessages } from "../api/errors";

export interface TokenEntryViewProps {
  title?: string;
  subtitle?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
}

const SCAN_LABELS: Record<string, string> = {
  checking: "Checking camera...",
  prompt: "Request camera permission",
  granted: "Begin scan",
  denied: "Camera blocked",
  unsupported: "Camera unavailable",
};

export function TokenEntryView({
  title = "Verify your asset",
  subtitle = "Scan the QR code provided on the asset you wish to verify.",
  inputLabel = "Enter the code that was provided to you.",
  inputPlaceholder = "Code",
  submitLabel = "Verify",
}: TokenEntryViewProps): ReactElement {
  const router = useRouter();
  const { config } = useVerification();
  const { permission, request } = useCameraPermission();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const token = config.parseToken ? config.parseToken(code) : code;

    if (!token || (config.isValidTokenFormat && !config.isValidTokenFormat(token))) {
      setError(resolveMessages(config.messages).invalidTokenFormat);
      return;
    }

    setError(null);
    if (config.onNavigate) {
      config.onNavigate({ name: "verify", token });
    } else {
      router.push(`/verify/${encodeURIComponent(token)}`);
    }
  };

  const handleScanClick = async () => {
    if (permission === "granted") {
      if (config.onNavigate) config.onNavigate({ name: "scanner" });
      else router.push("/verify/scan");
      return;
    }

    if (permission === "denied" || permission === "unsupported") {
      setCameraNotice("Camera unavailable. Enter your code below instead.");
      return;
    }

    const granted = await request();
    if (granted) {
      if (config.onNavigate) config.onNavigate({ name: "scanner" });
      else router.push("/verify/scan");
    } else {
      setCameraNotice("Camera permission was declined. Enter your code below instead.");
    }
  };

  const scanDisabled = permission === "checking";

  return (
    <div className="vf-screen">
      <div className="vf-stack">
        <h1 className="vf-title">{title}</h1>
        <p className="vf-text vf-text--muted">{subtitle}</p>
      </div>

      <div className="vf-scan-frame">
        <svg
          className="vf-scan-frame__art"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          {[
            [4, 4],
            [70, 4],
            [4, 70],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x={x + 8} y={y + 8} width="10" height="10" rx="2" />
            </g>
          ))}
          {[
            [38, 6], [50, 6], [62, 6], [44, 16], [56, 16], [38, 26], [62, 26],
            [6, 38], [18, 38], [30, 38], [44, 38], [56, 38], [70, 38], [88, 38],
            [12, 50], [26, 50], [38, 50], [50, 50], [64, 50], [78, 50],
            [6, 62], [20, 62], [32, 62], [46, 62], [58, 62], [72, 62], [86, 62],
            [40, 74], [52, 74], [64, 74], [76, 74], [88, 74],
            [40, 86], [52, 86], [70, 86], [82, 86],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1.5" />
          ))}
        </svg>

        <div className="vf-scan-frame__panel">
          <button
            type="button"
            className="vf-button vf-button--primary vf-scan-frame__action"
            onClick={handleScanClick}
            disabled={scanDisabled}
          >
            {SCAN_LABELS[permission] ?? SCAN_LABELS.prompt}
          </button>
        </div>
      </div>

      {cameraNotice && (
        <p className="vf-caption" role="status">
          {cameraNotice}
        </p>
      )}

      <div className="vf-divider">
        <span>Or</span>
      </div>

      <form className="vf-stack" onSubmit={handleSubmit}>
        <label className="vf-label" htmlFor="vf-token-input">
          {inputLabel}
        </label>

        <input
          id="vf-token-input"
          className={`vf-input${error ? " vf-input--invalid" : ""}`}
          type="text"
          value={code}
          placeholder={inputPlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "vf-token-error" : undefined}
          onChange={(event) => {
            setCode(event.target.value);
            if (error) setError(null);
          }}
        />

        {error && (
          <p className="vf-error-text" id="vf-token-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="vf-button vf-button--primary">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

export default TokenEntryView;
