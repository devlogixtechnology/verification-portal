"use client";

import type { ReactElement } from "react";

export interface ScannerPreset {
  label: string;
  token: string;
}

export interface ScannerPresetsProps {
  presets: ScannerPreset[];
  onSelect: (token: string) => void;
  title?: string;
}

/**
 * Shortcut buttons that stand in for a physical QR code.
 *
 * The module never defines presets itself — a project passes in whatever its
 * own demo needs.
 */
export function ScannerPresets({
  presets,
  onSelect,
  title = "Test presets",
}: ScannerPresetsProps): ReactElement | null {
  if (presets.length === 0) return null;

  return (
    <div className="vf-stack">
      <span className="vf-label">{title}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--verification-space-sm)" }}>
        {presets.map((preset) => (
          <button
            key={preset.token}
            type="button"
            className="vf-button vf-button--ghost"
            onClick={() => onSelect(preset.token)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ScannerPresets;
