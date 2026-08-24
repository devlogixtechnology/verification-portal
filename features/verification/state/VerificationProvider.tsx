"use client";

import {
  createContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  verificationReducer,
  createInitialState,
  type VerificationAction,
} from "./verificationMachine";
import type {
  VerificationConfig,
  VerificationState,
} from "../types/verification.types";
import { defaultVerificationConfig } from "../config/verification.config";

/** What `useVerification` returns. */
export type VerificationContextValue<TAsset = unknown, TErrorDetail = unknown> = {
  state: VerificationState<TAsset, TErrorDetail>;
  dispatch: Dispatch<VerificationAction<TAsset, TErrorDetail>>;
  config: VerificationConfig<TAsset, TErrorDetail>;
};

// Context holds generic verification state; useVerification re-types for callers
export const VerificationContext = createContext<
  VerificationContextValue<unknown, unknown> | undefined
>(undefined);

export type VerificationProviderProps<TAsset, TErrorDetail> = {
  /** Optional override for verification configuration. Defaults to defaultVerificationConfig. */
  config?: VerificationConfig<TAsset, TErrorDetail>;
  children: ReactNode;
};

/**
 * Top-level React Provider for the verification state machine.
 */
export function VerificationProvider<TAsset, TErrorDetail>({
  config = defaultVerificationConfig as unknown as VerificationConfig<TAsset, TErrorDetail>,
  children,
}: VerificationProviderProps<TAsset, TErrorDetail>) {
  const [state, dispatch] = useReducer(
    verificationReducer<TAsset, TErrorDetail>,
    undefined,
    () => createInitialState<TAsset, TErrorDetail>()
  );

  const value = useMemo(
    () => ({
      state,
      dispatch: dispatch as Dispatch<VerificationAction<unknown, unknown>>,
      config: config as VerificationConfig<unknown, unknown>,
    }),
    [state, config]
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}
