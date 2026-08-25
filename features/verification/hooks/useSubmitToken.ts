"use client";

import { useCallback, useEffect, useRef } from "react";
import { verifyToken } from "../api/verification";
import { resolveMessages } from "../api/errors";
import { useVerification } from "../state/useVerification";

/**
 * Runs a token through the whole verification flow: parse the raw input, check
 * its format, send the request, and move the state machine to the outcome.
 *
 * Screens call these actions and read the result with `useVerification`; the
 * returned functions are stable, so they are safe to list as effect
 * dependencies.
 *
 * ```tsx
 * const { submitToken, retry, reset } = useSubmitToken<Certificate, RejectionDetail>();
 *
 * // Deep link: verify as soon as the page opens.
 * useEffect(() => { void submitToken(token); }, [submitToken, token]);
 * ```
 *
 * @returns
 * - `submitToken(rawInput)` - verify a scanned payload or pasted code.
 * - `retry()` - verify the same token again. Does nothing if there is none.
 * - `reset()` - return to `idle` and discard any result.
 */
export function useSubmitToken<TAsset, TErrorDetail>() {
  const { state, dispatch, config } = useVerification<TAsset, TErrorDetail>();

  // Ignores a slow response that arrives after a newer request was started.
  const latestRequestId = useRef(0);
  // Keeps the callbacks stable while still reading the current config.
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const runVerification = useCallback(
    async (token: string) => {
      const requestId = ++latestRequestId.current;
      const parsed = await verifyToken(token, configRef.current);
      if (requestId !== latestRequestId.current) return;

      switch (parsed.outcome) {
        case "verified":
          dispatch({ type: "verificationSucceeded", result: parsed.result });
          return;
        case "rejected":
          dispatch({
            type: "verificationRejected",
            message: parsed.message,
            detail: parsed.detail,
          });
          return;
        case "failed":
          dispatch({ type: "verificationFailed", message: parsed.message });
      }
    },
    [dispatch]
  );

  const submitToken = useCallback(
    async (rawToken: string) => {
      const currentConfig = configRef.current;
      const { parseToken, isValidTokenFormat } = currentConfig;
      const token = parseToken ? parseToken(rawToken) : rawToken;

      if (!token || (isValidTokenFormat && !isValidTokenFormat(token))) {
        latestRequestId.current++;
        dispatch({
          type: "tokenRejected",
          message: resolveMessages(currentConfig.messages).invalidTokenFormat,
        });
        return;
      }

      dispatch({ type: "tokenReceived", token });
      await runVerification(token);
    },
    [dispatch, runVerification]
  );

  const retry = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: "retry" });
    await runVerification(state.token);
  }, [dispatch, runVerification, state.token]);

  const reset = useCallback(() => {
    latestRequestId.current++;
    dispatch({ type: "reset" });
  }, [dispatch]);

  return { submitToken, retry, reset };
}
