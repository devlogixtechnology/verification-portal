"use client";

import { useCallback, useEffect, useMemo, type ReactElement } from "react";
import { useVerification } from "../state/useVerification";
import { useSubmitToken } from "../hooks/useSubmitToken";
import { LoadingPulse } from "./LoadingPulse";
import { NetworkErrorView } from "./NetworkErrorView";
import { InvalidResultView } from "./InvalidResultView";

export interface VerificationViewProps {
  /** The token to verify. Verification starts as soon as this is rendered. */
  token: string;
  /** Overrides the label shown while verifying. */
  loadingLabel?: string;
}

/**
 * The whole result flow in one component: submit the token, then show the
 * screen its outcome calls for.
 */
export function VerificationView({
  token,
  loadingLabel,
}: VerificationViewProps): ReactElement | null {
  const { state, config } = useVerification();
  const { submitToken, retry, reset } = useSubmitToken();

  useEffect(() => {
    if (token) void submitToken(token);
  }, [token, submitToken]);

  const verifyAnother = useCallback(() => {
    reset();
    config.onNavigate?.({ name: "start" });
  }, [reset, config]);

  const actions = useMemo(
    () => ({ verifyAnother, retry }),
    [verifyAnother, retry]
  );

  switch (state.status) {
    case "idle":
    case "verifying":
      return <LoadingPulse label={loadingLabel ?? `Verifying ${token}...`} />;

    case "verified":
      return config.renderVerified ? (
        <>{config.renderVerified(state.result, actions)}</>
      ) : null;

    case "invalid": {
      const message = state.errorMessage ?? "";
      if (config.renderInvalid) {
        return (
          <>{config.renderInvalid(message, state.errorDetail ?? undefined, actions)}</>
        );
      }
      return <InvalidResultView message={message} onVerifyAnother={verifyAnother} />;
    }

    case "error":
      return (
        <NetworkErrorView message={state.errorMessage ?? ""} onRetry={retry} />
      );

    default:
      return null;
  }
}

export default VerificationView;
