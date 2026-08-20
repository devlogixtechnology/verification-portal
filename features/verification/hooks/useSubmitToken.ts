"use client";

import { useCallback, useEffect, useRef } from "react";
import { verifyToken } from "../api/verification";
import { useVerification } from "../state/useVerification";

const DEFAULT_INVALID_TOKEN_MESSAGE =
  "That doesn't look like a valid code. Please check it and try again.";

/**
 * The only place a token travels from the UI into the state machine:
 * parse -> format check -> request -> dispatch. Screens never own loading or
 * error booleans; they read status off the machine.
 *
 * Config comes from VerificationProvider, so the returned callbacks keep a
 * stable identity across renders — safe to put in a useEffect dependency array
 * on the deep-link route without re-firing verification every render.
 */
function useSubmitToken<TAsset, TErrorDetail>() {
  const { state, dispatch, config } = useVerification<TAsset, TErrorDetail>();

  // Guards against an earlier, slower response overwriting a newer one.
  const latestRequestId = useRef(0);
  // Read the freshest config without making it a callback dependency.
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
      const { parseToken, isValidTokenFormat } = configRef.current;
      const token = parseToken ? parseToken(rawToken) : rawToken;

      if (!token || (isValidTokenFormat && !isValidTokenFormat(token))) {
        latestRequestId.current++; // discard anything still in flight
        dispatch({ type: "tokenRejected", message: DEFAULT_INVALID_TOKEN_MESSAGE });
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

export { useSubmitToken, DEFAULT_INVALID_TOKEN_MESSAGE };
