"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { useVerification } from "../state/useVerification";
import { resolveMessages } from "../api/errors";

export interface ManualTokenFallbackProps {
  title: string;
  description: string;
  onSubmitToken: (token: string) => void;
  placeholder?: string;
  submitLabel?: string;
}

/** Keyboard entry for when the camera is denied, missing, or simply not wanted. */
export function ManualTokenFallback({
  title,
  description,
  onSubmitToken,
  placeholder = "Code",
  submitLabel = "Verify",
}: ManualTokenFallbackProps): ReactElement {
  const { config } = useVerification();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const token = config.parseToken ? config.parseToken(value) : value;

    if (!token || (config.isValidTokenFormat && !config.isValidTokenFormat(token))) {
      setError(resolveMessages(config.messages).invalidTokenFormat);
      return;
    }

    setError(null);
    onSubmitToken(token);
  };

  return (
    <div className="vf-card vf-stack">
      <svg
        className="vf-status-icon vf-status-icon--danger"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        style={{ width: "3rem", height: "3rem" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>

      <h2 className="vf-title vf-title--small">{title}</h2>
      <p className="vf-text vf-text--muted">{description}</p>

      <form className="vf-stack" onSubmit={handleSubmit}>
        <label className="vf-visually-hidden" htmlFor="vf-manual-token">
          {placeholder}
        </label>
        <input
          id="vf-manual-token"
          className={`vf-input${error ? " vf-input--invalid" : ""}`}
          type="text"
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
        />

        {error && (
          <p className="vf-error-text" role="alert">
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

export default ManualTokenFallback;
