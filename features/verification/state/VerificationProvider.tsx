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

type VerificationContextValue<TAsset, TErrorDetail> = {
  state: VerificationState<TAsset, TErrorDetail>;
  dispatch: Dispatch<Action<TAsset, TErrorDetail>>;
  config: VerificationConfig<TAsset, TErrorDetail>;
};

// React context cannot itself be generic; consumers re-apply their own type
// arguments through useVerification.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VerificationContext = createContext<VerificationContextValue<any, any> | undefined>(undefined);

type VerificationProviderProps<TAsset, TErrorDetail> = {
  /** The one place a project describes its backend. Also what lets TypeScript
   *  infer TAsset and TErrorDetail for everything below this provider. */
  config: VerificationConfig<TAsset, TErrorDetail>;
  children: ReactNode;
};

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
