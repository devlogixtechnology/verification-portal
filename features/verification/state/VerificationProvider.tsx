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

/** What `useVerification` returns. */
export type VerificationContextValue<TAsset = unknown, TErrorDetail = unknown> = {
  state: VerificationState<TAsset, TErrorDetail>;
  dispatch: Dispatch<VerificationAction<TAsset, TErrorDetail>>;
  config: VerificationConfig<TAsset, TErrorDetail>;
};

// React context cannot itself be generic; consumers re-apply their own type
// arguments through useVerification.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VerificationContext = createContext<VerificationContextValue<any, any> | undefined>(
  undefined
);

export type VerificationProviderProps<TAsset, TErrorDetail> = {
  /** The project's backend, routing, and rendering adapter. */
  config: VerificationConfig<TAsset, TErrorDetail>;
  children: ReactNode;
};

/**
 * Owns the verification state and shares it, along with the config, with every
 * screen below it. Wrap the verification routes in one of these.
 *
 * `TAsset` and `TErrorDetail` are inferred from `config`, so screens below get
 * a fully typed `state.result` without naming them again.
 *
 * ```tsx
 * <VerificationProvider config={verificationConfig}>
 *   {children}
 * </VerificationProvider>
 * ```
 */
export function VerificationProvider<TAsset, TErrorDetail>({
  config,
  children,
}: VerificationProviderProps<TAsset, TErrorDetail>) {
  const [state, dispatch] = useReducer(
    verificationReducer<TAsset, TErrorDetail>,
    undefined,
    () => createInitialState<TAsset, TErrorDetail>()
  );

  const value = useMemo(() => ({ state, dispatch, config }), [state, config]);

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}
