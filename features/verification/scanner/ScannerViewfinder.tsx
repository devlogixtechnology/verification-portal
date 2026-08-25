"use client";

import type { ReactElement } from "react";

export interface ScannerViewfinderProps {
  /** id of the element html5-qrcode mounts the video stream into. */
  regionId: string;
  /** Shows the switch-camera control when more than one camera exists. */
  canSwitchCamera?: boolean;
  onSwitchCamera?: () => void;
  hint?: string;
}

/** The live camera frame: video mount, reticle, laser guide, camera switch. */
export function ScannerViewfinder({
  regionId,
  canSwitchCamera = false,
  onSwitchCamera,
  hint = "Align the QR code within the frame to verify automatically.",
}: ScannerViewfinderProps): ReactElement {
  return (
    <div className="vf-stack">
      <div className="vf-viewfinder">
        <div className="vf-viewfinder__mount" id={regionId} />

        <div className="vf-viewfinder__reticle" aria-hidden="true">
          <span className="vf-viewfinder__laser" />
        </div>

        {canSwitchCamera && (
          <button
            type="button"
            className="vf-button vf-viewfinder__switch"
            onClick={onSwitchCamera}
            aria-label="Switch camera"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      <p className="vf-caption">{hint}</p>
    </div>
  );
}

export default ScannerViewfinder;
