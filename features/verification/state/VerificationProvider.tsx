"use client";

import {
  createContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { verificationReducer, createInitialState, type Action } from "./verificationMachine";
import type { VerificationConfig, VerificationState } from "../types/verification.types";

/** What `useVerification` returns. */
type VerificationContextValue<TAsset, TErrorDetail> = {
  state: VerificationState<TAsset, TErrorDetail>;
  dispatch: Dispatch<Action<TAsset, TErrorDetail>>;
  config: VerificationConfig<TAsset, TErrorDetail>;
};

// Context cannot carry type parameters of its own; `useVerification` reapplies
// the caller's.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VerificationContext = createContext<VerificationContextValue<any, any> | undefined>(undefined);

type VerificationProviderProps<TAsset, TErrorDetail> = {
  /** The project's backend and rendering adapter. */
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
function VerificationProvider<TAsset, TErrorDetail>({
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

export { VerificationContext, VerificationProvider };
export type { VerificationContextValue, VerificationProviderProps };
