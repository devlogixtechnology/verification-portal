import type { ReactElement } from "react";

export interface LoadingPulseProps {
  label?: string;
}

/** Shown while a verification request is in flight. */
export function LoadingPulse({
  label = "Verifying asset...",
}: LoadingPulseProps): ReactElement {
  return (
    <div className="vf-pulse" role="status" aria-label={label}>
      <span className="vf-pulse__dot" />
      <span className="vf-pulse__dot vf-pulse__dot--main" />
      <span className="vf-pulse__dot" />
      <span className="vf-visually-hidden">{label}</span>
    </div>
  );
}

export default LoadingPulse;
